Here's a complete JMeter test plan configuration for stress-testing this login → cart → coupon → checkout workflow.

## 1. Test Plan (root)
- Name: `EShop_Checkout_Flow_StressTest`
- User Defined Variables:
  - `BASE_URL` = `localhost`
  - `PORT` = `3000`
- Keep "Run thread groups consecutively" unchecked (only one TG needed here).

## 2. CSV Data Set Config (under Thread Group, scope = whole flow)
- Filename: `users.csv` (path relative to JMX, or absolute — flag this so you set it correctly on the Windows machine)
- Variable Names: `email,password,coupon_code,total_amount,shipping_address`
- Delimiter: `,`
- Recycle on EOF: **True**
- Stop thread on EOF: **False**
- Sharing mode: **All threads** (unless each VU must get unique unrepeated rows — in a stress test with recycling, "All threads" is correct so threads share the pool evenly)

> Reasoning: recycle=True + stop=False lets the test run for a fixed duration without dying when the CSV runs out — important since stress tests are usually duration-bound, not iteration-bound.

## 3. HTTP Request Defaults
- Server Name: `${BASE_URL}`
- Port: `${PORT}`
- Content-Encoding: UTF-8
- Implementation: HttpClient4

## 4. HTTP Header Manager (global, at Test Plan level)
- `Content-Type: application/json`

## 5. Thread Group — sizing (this is the part most people get wrong)

Since this is a 4-step chained transactional flow against a local SQLite-backed Express app (SQLite = single-writer, easy to saturate), don't go for huge VU counts. Realistic stress parameters:

- **Number of Threads (VUs):** 50
- **Ramp-up period:** 50 seconds (≈1 thread/sec — avoids a "thundering herd" login burst that would just test connection-accept behavior instead of the workflow)
- **Loop Count:** use **Duration-based** control instead of fixed loop count:
  - Specify Thread Lifetime: checked
  - Duration: 300 seconds (5 min)
  - Startup delay: 0
- **Scheduler:** checked, matching the above duration

> Rationale: 50 VUs against a local Node+SQLite backend is already a meaningful stress load (SQLite write-locking on checkout/coupon apply will show contention well before 50 concurrent users). Going to 500+ VUs on a non-clustered SQLite app mostly just produces connection-reset noise, not useful signal. If your goal is to find the actual breaking point, run this same plan at 50 → 100 → 200 VUs as separate stages (see step 10).

## 6. Think Times (realistic, not zero, not huge)
Add a **Uniform Random Timer** or **Gaussian Random Timer** between each request (not one global timer for the whole flow):

- Between Login → Cart: **Constant Timer 1000ms + Uniform Random Timer 0–1000ms** (~1–2s)
- Between Cart → Apply Coupon: **~1–3s** (Uniform Random Timer, offset 1000ms, range 2000ms)
- Between Apply Coupon → Checkout: **~1–2s** (offset 1000ms, range 1000ms)

> Reasoning: 1–3s think time mimics a real user reading cart contents/reviewing discount before checking out. Zero think-time turns this into a raw throughput/load test rather than a "stress test simulating real usage," and unrealistically huge think times (10s+) waste test duration without adding useful concurrency pressure.

## 7. Requests (in order, inside the Thread Group)

### 7.1 POST /api/login
- Path: `/api/login`
- Body:
```json
{
  "email": "${email}",
  "password": "${password}"
}
```
- **Post-processor: JSON Extractor**
  - Names: `authToken`
  - JSON Path: `$.token`
  - Match No.: 1
  - Default: `NOT_FOUND` (so downstream failures are visible/traceable instead of silent)
- **Assertions:**
  - Response Assertion: Response Code = `200`
  - JSON Assertion (or JSON Extractor existence check): `$.token` exists
  - Duration Assertion: < 3000 ms (flag slow auth under load — auth endpoints are usually cheap; a threshold here catches DB contention early)

### 7.2 HTTP Header Manager (scoped to this request and below)
- Add sampler-scoped Header Manager just before Cart request (or add `Authorization: Bearer ${authToken}` as a child of each subsequent sampler):
  - `Authorization: Bearer ${authToken}`

### 7.3 GET /api/cart
- Path: `/api/cart`
- **Assertions:**
  - Response Code = `200`
  - Duration Assertion: < 2000 ms
  - (Optional light functional check) Response Assertion contains `[` or `{` — basic sanity that it returned JSON, not an HTML error page

### 7.4 POST /api/apply-coupon
- Path: `/api/apply-coupon`
- Body:
```json
{
  "code": "${coupon_code}",
  "total_amount": ${total_amount},
  "user_id": "${__P(user_id,)}"
}
```
  - Note: the spec's `user_id` field is awkward for a token-authenticated flow — flagging this: confirm with your backend whether `apply-coupon` actually needs `user_id` in the body given it's already authenticated via Bearer token, or extract `user_id` from the login response (`$.user.id`) via a second JSON Extractor on the login step instead of pulling from CSV.
- **Post-processor:** JSON Extractor for `final_amount` → `${finalAmount}` (feed into checkout for a more realistic chained flow)
- **Assertions:**
  - Response Code = `200`
  - JSON Assertion: `$.discount_amount` exists
  - JSON Assertion: `$.final_amount` exists
  - Duration Assertion: < 2500 ms

### 7.5 POST /api/checkout
- Path: `/api/checkout`
- Body:
```json
{
  "total_amount": ${total_amount},
  "shipping_address": "${shipping_address}"
}
```
  - Consider substituting `${finalAmount}` from the coupon step instead of raw `${total_amount}` if checkout is expected to reflect the discounted total — check actual backend behavior; the spec doesn't clarify this, so verify rather than assume.
- **Assertions:**
  - Response Code = `200`
  - Duration Assertion: < 3000 ms (checkout is a write-heavy op — DB insert — most likely to show contention under stress, so this is your key SLA-style check)
  - Response Assertion: response not empty / contains expected key (e.g., order id field) — confirms it's not silently returning a stale/error object with 200

## 8. Transaction Controller
Wrap the 4 requests in a **Transaction Controller** named `Checkout_Workflow`, with "Generate parent sample" checked — this lets you see end-to-end workflow latency as one metric, separate from individual step latency.

## 9. Listeners (for local run analysis — remove/disable heavy ones before real load runs)
- **Summary Report** (lightweight, keep enabled during the run)
- **Aggregate Report** (post-run analysis: throughput, error%, p90/p95)
- **View Results Tree** — enable only for a small debug run (1–2 threads), disable for the actual stress run (it's expensive and will skew results)
- Avoid Graph Results / Response Time Graph during actual stress execution — GUI listeners inflate JMeter's own resource usage and distort results. Prefer running in **non-GUI mode** (`jmeter -n -t plan.jmx -l results.jtl`) and generating an HTML dashboard report afterward.

## 10. Optional: staged escalation for true breaking-point discovery
If the goal is finding where the app degrades, not just running one load level, use a **Stepping Thread Group** (from the "jpgc - Standard Set" plugin) instead of the plain Thread Group:
- Start at 10 users, add 10 every 30s, hold 30s, up to 100 users
- This is more diagnostic than a flat 50-VU run, but adds plugin dependency — flagging it as optional rather than baseline, since you said "keep it simple and fast."

## 11. Things to watch out for on your Windows 10 setup
- Increase JVM heap in `jmeter.bat` (`-Xms1g -Xmx2g`) if VUs go beyond ~100, otherwise you'll bottleneck JMeter itself before the server.
- Set `HTTPClient4` connection/response timeouts explicitly (e.g., 5000ms) in HTTP Request Defaults — without this, a hung server response can make threads stall indefinitely and silently reduce effective concurrency.
- SQLite on Windows with concurrent writers is prone to `SQLITE_BUSY` errors — expect and specifically watch for 500s on `/api/checkout` and `/api/apply-coupon` under load; that's likely your real bottleneck, not the HTTP layer.

Let me know if you want this translated into an actual `.jmx` file — I can generate it directly once you've prepared the CSV.