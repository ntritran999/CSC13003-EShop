# JMeter Test Plan — EShop Load Test (Login → Cart → Coupon → Checkout)

## 1. Test Plan Element
- **Name:** EShop_Checkout_Flow_LoadTest
- **User Defined Variables** (Test Plan level):
  - `BASE_URL` = `localhost`
  - `PORT` = `3000`
  - `PROTOCOL` = `http`
- Do NOT store JWT token here — it's per-user (per-thread), so it must be extracted and stored in a **thread-scoped variable**, not a Test Plan-level property.

---

## 2. Thread Group

Since this simulates 4 sequential API calls per "checkout session" (a realistic user journey, not a stress test of a single endpoint), keep load modest and realistic:

- **Name:** Checkout_Flow_Users
- **Number of Threads (VUs):** 20
  - Rationale: this is a single Express+SQLite instance on localhost — likely a student/demo backend. 20 concurrent "checkout sessions" is enough to observe queuing/contention without saturating SQLite's write lock (SQLite serializes writes, so checkout under high concurrency will bottleneck fast — that's expected and worth measuring, not something to hide by over-scaling).
- **Ramp-Up Period:** 20 seconds (i.e., 1 thread/sec) — avoids a "thundering herd" login spike that would test connection-accept behavior rather than steady-state performance.
- **Loop Count:** 5 (each VU runs the flow 5 times) — gives ~100 iterations total, enough for percentile stats without a long run.
- **Same user on each iteration?:** Yes — reuse CSV row per thread across loops (see CSV config below) so login/token stays consistent per simulated user across their session.
- **Duration-based alternative (optional):** If you prefer time-boxed runs instead of loop count, use Loop Count = -1 with a **Duration = 120s** and add a matching **Ramp-up = 20s**. Pick one approach, not both.
- **Scheduler:** Off (unless using the duration alternative above)

---

## 3. CSV Data Set Config

- **Name:** LoginAndOrderData
- **Filename:** `checkout_data.csv` (path relative to JMX, or absolute — your call)
- **Variable Names:** `email,password,coupon_code,total_amount,shipping_address`
- **Delimiter:** `,`
- **Ignore First Line (header):** True (if your CSV includes a header row)
- **Recycle on EOF:** True — needed since Loop Count(5) × Threads(20) = 100 iterations will likely exceed row count
- **Stop Thread on EOF:** False
- **Sharing Mode:** **All threads** (default) — gives even distribution of rows across all VUs, avoids one thread hammering the same row repeatedly. If you specifically want *each thread to own a fixed user for its whole session* (more realistic for login-bound flows, avoids two threads racing on the same account), switch to **Sharing Mode: Current thread group** and ensure CSV rows ≥ thread count.

---

## 4. HTTP Request Defaults (Config Element)
- **Protocol:** http
- **Server Name:** `${BASE_URL}`
- **Port:** `${PORT}`
- **Content-Encoding:** UTF-8
- Avoids repeating host/port on every sampler.

## 5. HTTP Header Manager (Test Plan level)
- `Content-Type: application/json`
- (Do NOT set Authorization here globally — it must be added per-request after login, via a thread-scoped variable, since not every request needs it before authentication.)

---

## 6. Request Flow (inside Thread Group, in order)

### 6.1 HTTP Request — Login
- **Name:** 01_POST_Login
- **Method:** POST
- **Path:** `/api/login`
- **Body (raw JSON):**
```json
{
  "email": "${email}",
  "password": "${password}"
}
```
- **Post-processor: JSON Extractor**
  - Name: Extract_Token
  - JSON Path: `$.token`
  - Variable name: `authToken`
  - Match No.: 1
  - Default value: `NOT_FOUND` (so downstream failures are obvious, not silent nulls)
- **Assertions (see Section 7)**

### 6.2 HTTP Header Manager (scoped to requests 2–4, or add per-request)
- **Authorization:** `Bearer ${authToken}`
- Best placed as a Header Manager child under a **Transaction Controller** wrapping requests 2–4, so it's scoped correctly and doesn't apply to the login call itself.

### 6.3 Transaction Controller — "Checkout_Journey_Authenticated"
Wraps GET cart → apply-coupon → checkout, generates one combined timing sample plus individual sampler timings. Set **"Generate parent sample"** = true.

Inside it:

#### 6.3.1 HTTP Request — Get Cart
- **Name:** 02_GET_Cart
- **Method:** GET
- **Path:** `/api/cart`
- No body.

#### 6.3.2 HTTP Request — Apply Coupon
- **Name:** 03_POST_ApplyCoupon
- **Method:** POST
- **Path:** `/api/apply-coupon`
- **Body (raw JSON):**
```json
{
  "code": "${coupon_code}",
  "total_amount": ${total_amount},
  "user_id": ${user_id}
}
```
- **Note:** the API spec's example body uses `user_id`, but login only returns a token+user object — you'll need a JSON Extractor on the login response for `$.user.id` → `${user_id}` as well, added to Section 6.1's extractors. Flag this: confirm the actual field name in the real login response before running, since the doc may not match implementation exactly.
- **Post-processor: JSON Extractor**
  - `discount_amount` → `${discountAmount}`
  - `final_amount` → `${finalAmount}`

#### 6.3.3 HTTP Request — Checkout
- **Name:** 04_POST_Checkout
- **Method:** POST
- **Path:** `/api/checkout`
- **Body (raw JSON):**
```json
{
  "total_amount": ${total_amount},
  "shipping_address": "${shipping_address}"
}
```
- **Note:** Realistically this checkout body should use `${finalAmount}` (post-discount) rather than the raw CSV `total_amount`, if the intent is to test the coupon actually being applied end-to-end. Decide based on what the API actually expects — worth checking against real backend behavior before finalizing, since the spec doesn't clarify whether checkout expects pre- or post-discount total.

---

## 7. Assertions (performance-centric + basic functional sanity)

Keep these lightweight — functional correctness is a secondary concern here, not full contract testing.

### Per-sampler (each of the 4 requests):
- **Response Assertion:**
  - Field to test: Response Code
  - Pattern: `200` (Login, Cart, Checkout, Coupon) — adjust if your backend returns 201 for checkout; verify actual codes first rather than assuming.
  - Test type: "Equals"
- **Duration Assertion:**
  - Login: ≤ 800 ms
  - Get Cart: ≤ 500 ms
  - Apply Coupon: ≤ 500 ms
  - Checkout: ≤ 1000 ms (writes + SQLite lock contention expected to be slower)
  - These are starting thresholds for a local Express+SQLite app — tune after a baseline run rather than guessing blind.

### Login-specific:
- **JSON Assertion** (or Response Assertion on body): confirm `$.token` exists and is non-empty (catches silent auth failures that still return 200).

### Apply Coupon-specific:
- **JSON Assertion:** confirm `$.final_amount` exists — catches cases where coupon logic silently no-ops.

Avoid assertions on exact response body text/wording — brittle, and not meaningfully "performance-centric."

---

## 8. Timers (Think Time)

Realistic human pacing between steps, not between every packet:

- **Constant Timer** is too rigid; use **Uniform Random Timer** or **Gaussian Random Timer**, scoped per-sampler:
  - After Login (user reads dashboard before viewing cart): 1000–3000 ms (Random Timer: Constant Delay Offset 1000ms, Random Delay Maximum 2000ms)
  - After Get Cart (reviewing cart before applying coupon): 1500–3500 ms
  - After Apply Coupon (reviewing discount before confirming checkout): 2000–4000 ms
- **Do not** add think time after the final Checkout request (nothing follows it in this loop iteration).
- **Rationale:** No think time at all creates unrealistic hammering that measures server throughput ceiling, not realistic user-paced load — bad for this scenario's stated goal (workflow load test, not a stress/spike test).

---

## 9. Listeners (for local test run/debugging — remove or disable for actual load runs)

- **Summary Report** — throughput, avg/min/max/percentiles per sampler
- **Aggregate Report** — same, tabular, easier to eyeball 90/95/99th percentile
- **View Results Tree** — **disable during actual load run** (heavy memory/IO overhead); only enable for a 1–2 thread smoke-test pass first
- **Response Time Graph** or **Backend Listener (InfluxDB/Grafana)** — optional, useful if visualizing trends beyond a single run, skip for a "simple and fast" plan

Recommended actual run sequence:
1. Smoke test: 1 thread, 1 loop, View Results Tree on — verify correlation (token extraction, coupon calc) works end-to-end.
2. Disable View Results Tree, enable Summary/Aggregate Report only.
3. Run full 20-thread/5-loop plan.

---

## 10. Result Storage / Non-GUI Execution
- On Windows 10, run via command line, not GUI mode, for accurate results:
  ```
  jmeter -n -t EShop_Checkout_Flow_LoadTest.jmx -l results.jtl -e -o report_output/
  ```
- `-e -o` generates the HTML dashboard report afterward — better for reading percentiles/error % than GUI listeners.
- GUI mode should only be used for the smoke-test/debug pass in step 1 above.

---

## 11. Summary of key numbers chosen and why

| Parameter | Value | Reasoning |
|---|---|---|
| Threads (VUs) | 20 | Enough concurrency for a local SQLite-backed API to show contention, not so much it just crashes trivially |
| Ramp-up | 20s | ~1 user/sec, avoids connection-spike artifacts |
| Loop count | 5 | ~100 total iterations — enough for stable percentiles in a short run |
| Think time | 1–4s randomized, varies per step | Mimics real user pacing, avoids synthetic hammering |
| Duration assertions | 500ms–1000ms per step | Local backend baseline; checkout allowed more due to write lock |
| Sharing mode (CSV) | All threads (or per-thread if 1 user = 1 session matters) | Depends on whether you want strict user/thread pairing |

Flag before running for real: verify actual login response JSON shape (does it nest `token`/`user.id` as documented?), actual HTTP status codes returned by checkout/coupon endpoints, and whether checkout expects `total_amount` pre- or post-discount — the spec doc doesn't fully disambiguate these and getting them wrong will produce false failures that look like performance bugs but are just correlation mistakes.