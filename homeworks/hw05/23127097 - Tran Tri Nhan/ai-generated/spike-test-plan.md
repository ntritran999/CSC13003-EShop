Here's a complete JMeter 5.6.3 test plan configuration for a **Spike Test** of the login → cart → coupon → checkout workflow.

## Test Plan Structure

```
Test Plan: EShop_SpikeTest
├── User Defined Variables (Test Plan level)
├── CSV Data Set Config
├── HTTP Request Defaults
├── HTTP Header Manager
├── Thread Group: Spike_Scenario
│   ├── HTTP Request: 01_Login
│   │   └── JSON Extractor (token, user id)
│   │   └── Response Assertion
│   ├── HTTP Header Manager (Auth - child of thread group, overrides default)
│   ├── Constant Timer (think time)
│   ├── HTTP Request: 02_Get_Cart
│   │   └── Response Assertion
│   ├── Constant Timer
│   ├── HTTP Request: 03_Apply_Coupon
│   │   └── JSON Extractor (final_amount)
│   │   └── Response Assertion
│   ├── Constant Timer
│   ├── HTTP Request: 04_Checkout
│   │   └── Response Assertion
├── Listeners: Summary Report, Aggregate Report, View Results Tree (disabled during real run)
```

---

## 1. Test Plan – User Defined Variables
| Variable | Value |
|---|---|
| `BASE_URL` | `localhost` |
| `PORT` | `3000` |

## 2. CSV Data Set Config
| Setting | Value |
|---|---|
| Filename | `eshop_users.csv` |
| Variable Names | `email,password,coupon_code,total_amount,shipping_address` |
| Delimiter | `,` |
| Recycle on EOF | `True` |
| Stop thread on EOF | `False` |
| Sharing mode | `All threads` (or `Current thread group` since only one group) — spike tests reuse rows across VUs, so **All threads** is fine |

> Note: since spike tests often run more VUs than CSV rows, keep **Recycle = True** so it doesn't error out. If you want each VU to get a unique real account, "Current thread group" + enough rows is safer — but for pure load/spike behavior, recycling is acceptable since this only tests infra behavior, not data uniqueness.

## 3. HTTP Request Defaults
| Field | Value |
|---|---|
| Server Name/IP | `${BASE_URL}` |
| Port | `${PORT}` |
| Protocol | `http` |
| Content-Type (via Header Manager instead) | — |

## 4. HTTP Header Manager (global)
| Header | Value |
|---|---|
| `Content-Type` | `application/json` |

---

## 5. Thread Group — Spike Testing Setup

**Why these numbers:** Spike testing isn't about sustained high load (that's stress/load testing) — it's about a **sudden, sharp burst** of traffic hitting the system almost at once, then observing recovery. Given this is a local dev-grade stack (Node/Express + SQLite — SQLite specifically has poor write concurrency), the spike should be modest but sharp, not thousands of threads.

Use **"Stepping Thread Group"** (jpgc plugin) or simpler: use **Concurrency Thread Group + Synchronizing Timer**, OR simplest and dependency-free (no plugins) — use standard **Thread Group with a very short ramp-up** to simulate the spike, run twice for baseline vs spike comparison.

**Recommended: plain `ThreadGroup` (no plugin dependency), configured as spike:**

| Setting | Value | Rationale |
|---|---|---|
| Number of Threads (VUs) | `100` | Sharp burst appropriate for a local SQLite-backed API; enough to stress connection pool without being absurd |
| Ramp-Up Period | `5 seconds` | Key spike characteristic: threads start almost simultaneously (100 users / 5s = 20 users/sec surge) |
| Loop Count | `1` | Spike = one burst per VU, not sustained looping; keeps test short |
| Scheduler | Unchecked (not needed, single loop) | Keeps run simple/fast |
| Same user on each iteration | N/A (loop=1) | — |

**Optional (for a more classic "spike shape" — flat → spike → flat)**: add a second Thread Group *before* this one:

| Thread Group | Threads | Ramp-up | Loop | Purpose |
|---|---|---|---|---|
| `Baseline_Load` | 10 | 30s | 3 | Establish normal baseline throughput/latency |
| `Spike_Burst` | 100 | 5s | 1 | The actual spike |
| `Recovery_Load` | 10 | 30s | 3 | Confirm system recovers post-spike, run after a `Flow Control Action` pause of ~10s |

This 3-phase structure (baseline → spike → recovery) is what actually demonstrates spike behavior rather than just "load test with low ramp-up." Keep total run time under ~3 minutes to stay fast.

---

## 6. Timers

| Timer | Placement | Value | Rationale |
|---|---|---|---|
| Constant Timer | After Login | `500 ms` | Minimal think time — spike tests intentionally minimize think time to maximize concurrent pressure, but 0ms is unrealistic (no human clicks instantly) |
| Constant Timer | After Get Cart | `800 ms` | Simulates user reviewing cart |
| Constant Timer | After Apply Coupon | `500 ms` | Brief pause before checkout click |

> Avoid Gaussian Random Timer with large deviation — spike testing wants tight, predictable timing so the "spike" shape isn't washed out.

---

## 7. HTTP Requests

### 01_Login
- Method: `POST`
- Path: `/api/login`
- Body:
```json
{
  "email": "${email}",
  "password": "${password}"
}
```
- **JSON Extractor**: `token` → `${AUTH_TOKEN}` (JSON Path: `$.token`), Match No. `1`, Default `NOT_FOUND`
- **Response Assertion**: Response Code = `200`
- **JSON Assertion / Response Assertion (functional check)**: Response field `token` should exist and not equal `NOT_FOUND`

### HTTP Header Manager (Thread Group level, added after login)
| Header | Value |
|---|---|
| `Authorization` | `Bearer ${AUTH_TOKEN}` |

### 02_Get_Cart
- Method: `GET`
- Path: `/api/cart`
- **Response Assertion**: Response Code = `200`

### 03_Apply_Coupon
- Method: `POST`
- Path: `/api/apply-coupon`
- Body:
```json
{
  "code": "${coupon_code}",
  "total_amount": ${total_amount},
  "user_id": 1
}
```
- **JSON Extractor**: `final_amount` → `${FINAL_AMOUNT}` (JSON Path: `$.final_amount`)
- **Response Assertion**: Response Code = `200`
- **JSON Assertion**: `$.discount_amount` exists

> Note: `user_id` is hardcoded `1` in the spec sample — if the API actually resolves user from the auth token instead, drop this field. Worth confirming against actual backend behavior since the doc example may not reflect real server logic.

### 04_Checkout
- Method: `POST`
- Path: `/api/checkout`
- Body:
```json
{
  "total_amount": ${FINAL_AMOUNT},
  "shipping_address": "${shipping_address}"
}
```
- **Response Assertion**: Response Code = `200`
- **Duration Assertion** (spike-specific): e.g. `5000 ms` — flags requests that succeed but degrade badly under spike load, which is the core signal you're testing for

---

## 8. Spike-Test-Centric Assertions (apply across all 4 requests)

| Assertion Type | Applies To | Purpose |
|---|---|---|
| Response Assertion (code=200) | All requests | Basic functional correctness — did it still work under spike |
| Duration Assertion (e.g. 3000–5000ms threshold) | All requests | Spike tests care about **degradation**, not just pass/fail — flag slow-but-successful responses |
| JSON Extractor default value check | Login, Coupon | Ensures chained requests fail fast/loud if a prior step didn't return expected data, rather than silently sending `null` downstream |

Avoid over-asserting response body content in detail (e.g. exact price math, exact strings) — that's functional/regression testing territory, not spike testing. Keep it to: **did it respond, did it respond correctly enough to chain, did it respond fast enough.**

---

## 9. Listeners (for local runs only — disable/remove for CLI/CI spike runs)
- **Aggregate Report** — primary metric: p90/p95 latency, error % during the spike window
- **Response Time Graph** or **Active Threads Over Time** — visually confirms the spike shape
- Disable **View Results Tree** during actual measured runs (I/O overhead skews spike results)

---

## 10. Run Recommendations
- Run via CLI (`jmeter -n -t plan.jmx -l results.jtl`) for accurate spike timing — GUI mode adds overhead that blunts the spike.
- Keep total test duration under ~2–3 minutes: baseline (30s) + spike (5s ramp, brief hold) + recovery (30s) — long enough to see the shape, short enough to iterate quickly.
- Since backend is **SQLite**, expect write-heavy endpoints (`checkout`) to be the first bottleneck under spike — worth watching `04_Checkout` latency specifically as your primary spike-sensitivity indicator.

Want me to also lay out the CSV file's expected structure/header row (without generating actual data), or write the actual `.jmx` XML now that the config is agreed on?