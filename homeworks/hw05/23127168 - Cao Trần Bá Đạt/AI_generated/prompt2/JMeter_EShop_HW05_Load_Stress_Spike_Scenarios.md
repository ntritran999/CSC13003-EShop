# JMeter EShop HW05 — Load / Stress / Spike Test Scenarios

Builds on the 4-step scenario (Login → Get Product → Add to Cart → Checkout) from Prompt 1. Each scenario below is a **separate Thread Group** (put each in its own `.jmx`, or in the same file but only enable one Thread Group at a time so results aren't mixed).

---

## 1. Load Test — steadily increasing normal load

**Goal:** Confirm the system meets performance targets (response time, error rate) under the load pattern it's actually expected to handle in production/demo use — a gradual ramp to a realistic peak, held for a while, not a shock.

| Parameter | Value | Reasoning |
|---|---|---|
| Number of Threads (VUs) | **100** | A reasonable "peak concurrent users" figure for a small demo e-commerce backend (Node.js + Express + SQLite). Large enough to expose real concurrency effects (SQLite write locks on checkout, JWT verification overhead) without being an unrealistic shock. |
| Ramp-Up Period | **300 s (5 min)** | ~1 new thread every 3 seconds — mimics organic traffic growth (e.g. morning traffic building up), not a burst. Slow enough that early threads are already in steady iteration before the last thread joins, so your Aggregate Report reflects sustained-state behavior, not startup noise. |
| Loop Count | **Infinite + Scheduler Duration = 900 s (15 min)** | You want a meaningful *steady-state* window after ramp-up completes (ramp-up 5 min + hold ~10 min), not just "each thread runs once." A fixed loop count risks fast threads finishing and dropping out while slow ones are still ramping in, distorting the "steady" load. |
| Gaussian Random Timer — Constant Delay Offset | **2000 ms** | Baseline think time between the 4 steps, approximating a real shopper reading a product page / reviewing their cart before the next click. |
| Gaussian Random Timer — Deviation | **800 ms** | Keeps most delays in the ~1.2–2.8s range (68% within 1 std dev), with occasional faster/slower "clicks" — natural variance instead of every virtual user pausing identically, which would create artificial request-rate spikes every N seconds. |

**Listener: Aggregate Report.** This is the right tool for a load test because the deliverable is *statistics over the sustained window* — average/median/90th/95th/99th percentile response time, throughput, and error % per sampler. That's exactly what you compare against SLA targets (e.g. "95th percentile checkout < 800ms at 100 concurrent users"). It's lightweight enough to run for the full 15-minute hold without the memory overhead of logging every request body.

---

## 2. Stress Test — push past the threshold to find the breakpoint

**Goal:** Keep increasing concurrency until response times degrade sharply or the error rate climbs — that inflection point is your system's breakpoint.

| Parameter | Value | Reasoning |
|---|---|---|
| Number of Threads (VUs) | **300** (well above the 100 "normal peak" from the Load Test) | Stress testing means going *past* the expected capacity on purpose. 3x normal peak is a common starting multiplier for finding where a small SQLite-backed API starts to buckle (SQLite in particular serializes writes, so `POST /api/checkout` and `POST /api/cart` are likely bottlenecks well before 300 threads). |
| Ramp-Up Period | **150 s** | Faster than the Load Test's ramp (2 threads/sec vs ~0.33/sec) so you climb through the danger zone in a reasonable test window, but still gradual enough that you can watch response time *degrade progressively* rather than jumping straight to overload — that gradual curve is what lets you pinpoint the actual breakpoint thread count instead of just "somewhere between 0 and 300." |
| Loop Count | **Infinite + Scheduler Duration ≈ 600 s (10 min)**, stopped manually early if errors spike hard | You often don't need the full duration — the moment error rate/response time clearly inflects, you have your answer and can stop the test to avoid hammering a struggling server further. |
| Gaussian Random Timer — Constant Delay Offset | **500 ms** | Reduced from the Load Test's 2000ms — stress testing is deliberately more aggressive per user (less "reading time") to reach saturation with fewer threads than a pure zero-think-time flood would need, while still not being a totally unrealistic instant-fire spam pattern. |
| Gaussian Random Timer — Deviation | **200 ms** | Tighter spread than the Load Test, keeping requests dense and consistently aggressive rather than occasionally idling. |

**⚠️ FR-02 Lockout consideration — this is the important part:** the account locks for 30s after 3 consecutive failed logins. Under heavy concurrency this creates a **confounding variable** you must design around:

- `users.csv` only has **2 accounts**. At 300 threads sharing 2 credentials, many concurrent login requests hit the *same* account simultaneously. If the server has any race condition around its failed-attempt counter, or if slow responses under load cause timeouts that the client-side logic misreads as failures, you can get **false lockouts (401/423) that are an artifact of test design, not a real capacity failure**.
- **Before running:** expand `users.csv` to at least 10–20 valid accounts so no single account is hit by many concurrent threads — this isolates "the API can't handle the load" from "the account got rate-limited by its own security feature."
- **Add a Response Assertion on `01_Login`** checking for a specific lockout message text (or the distinct status code the API returns for lockout vs. generic 5xx), so your Aggregate/Summary Report can separate "genuine server overload errors" from "expected security-feature lockouts" instead of lumping both into one error percentage.
- If you *do* see 401s cluster in bursts of exactly 3 followed by a ~30s gap in retries, that pattern itself confirms it's the lockout mechanism firing (working as designed) rather than the server crashing — a good thing to call out explicitly in your report rather than misreporting it as the breakpoint.

**Listener: View Results Tree, filtered to errors only** (check "Log/Display Only: Errors" in the listener's configuration). Unlike the Load Test, here you specifically need to *read individual failed response bodies/status codes* to tell apart lockout responses (400/401 with a lockout message) from real infrastructure failures (500, connection refused, timeouts) — an Aggregate Report's numbers alone can't distinguish those. Keep this listener's scope narrow (errors only) and don't run it for the full 10-minute duration in a high-thread run — enable it for shorter diagnostic passes, since logging full response data at 300 threads is memory-heavy.

---

## 3. Spike Test — sudden burst (0 → 500 VUs in 5 seconds)

**Goal:** Simulate a flash-sale-style traffic shock and observe whether the system survives the spike and how quickly it recovers once the spike passes.

| Parameter | Value | Reasoning |
|---|---|---|
| Number of Threads (VUs) | **500** | As specified — deliberately higher than even the Stress Test's 300, because the point isn't to find a gradual breakpoint but to test resilience to an instant, extreme shock (e.g. a promo link shared widely at once). |
| Ramp-Up Period | **5 s** | This is what defines it as a *spike* rather than a stress ramp — nearly all 500 threads fire in a near-simultaneous burst, mimicking real spike conditions where there's no gradual warning. |
| Loop Count | **3–5**, with Scheduler Duration ≈ 60–90 s | You want the spike held briefly (not just one instantaneous request per thread) so you can observe behavior *during* the peak, then see the tail off as threads finish — a single loop wouldn't give you enough data points to see recovery behavior after the initial shock. |
| Gaussian Random Timer — Constant Delay Offset | **300 ms** | Deliberately low — real flash-sale users act fast (add to cart, checkout, before stock runs out), so minimal think time is realistic here, not just a testing artifact. |
| Gaussian Random Timer — Deviation | **150 ms** | Small spread keeps the burst dense and tightly clustered, matching how a spike actually behaves (concentrated, not spread out) — a large deviation would smear the burst into something closer to the Stress Test's gradual pattern and defeat the purpose. |

**Listener: Summary Report.** For a spike test the key questions are simple and time-sensitive: how many requests succeeded vs. failed, and what's the throughput/average response time *right now* while the spike is happening and shortly after. Summary Report gives that compact, low-overhead, per-sampler pass/fail/throughput view without the heavier percentile math of Aggregate Report or the per-request detail of View Results Tree — appropriate since a spike test run is short and you mainly want a fast before/during/after comparison rather than deep statistical analysis.

---

## Summary table

| Scenario | Threads | Ramp-Up | Duration/Loops | Timer Offset / Deviation | Listener |
|---|---|---|---|---|---|
| Load | 100 | 300 s | Infinite, 900 s hold | 2000 ms / 800 ms | Aggregate Report |
| Stress | 300 | 150 s | Infinite, ~600 s (stop early on inflection) | 500 ms / 200 ms | View Results Tree (errors only) |
| Spike | 500 | 5 s | 3–5 loops, ~60–90 s hold | 300 ms / 150 ms | Summary Report |
