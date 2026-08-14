# EShop Backend — Performance Test Analysis Report
**Environment:** Node.js + Express + SQLite, single local machine, loopback network (localhost:3000)
**Scenarios analyzed:** Load (40 VUs/5min), Stress (100 VUs/5min), Spike (150 VUs/5 loops/~11s), Endurance (50 VUs/15min)
**Data source:** Client-side JMeter `.jtl` result logs (timestamp, elapsed, label, responseCode, allThreads)

---

## 1. Executive Summary

| Scenario | Samples | Duration | Throughput | Error Rate | p95 (all) | p99 (all) | Max latency |
|---|---|---|---|---|---|---|---|
| Load | 5,406 | 297.7 s | 18.2 req/s | **0%** | 4 ms | 8 ms | 49 ms |
| Stress | 33,646 | 299.2 s | 112.4 req/s | **0%** | 8 ms | 18 ms | 102 ms |
| Spike | 3,000 | 10.9 s | 274.4 req/s (burst) | **0%** | 7 ms | 11 ms | 45 ms |
| Endurance | 28,816 | 898.3 s | 32.1 req/s | **0%** | 6 ms | 11 ms | **584 ms** |

**Headline finding:** the backend produced **zero HTTP-level errors** (all responses were `200 OK`) across every scenario, including under a 150-VU/274 req/s momentary spike and a sustained 100-VU/~125 req/s stress load. That's a genuinely good result, but it also means **the true breaking point was never located** — Stress and Spike topped out well within the server's capacity on this hardware. The most actionable signal isn't "where it broke" but **where latency started degrading** and a **single sharp outlier event during the 15-minute soak** that's worth treating as the primary red flag.

---

## 2. Latency Trends by Endpoint

Per-sampler latency (ms) across scenarios:

| Sampler | Load (avg/p95/max) | Stress (avg/p95/max) | Spike (avg/p95/max) | Endurance (avg/p95/max) |
|---|---|---|---|---|
| `01_Login` | 1.8 / 3 / 49 | 2.2 / 5 / 73 | 2.8 / 7 / 45 | 2.8 / 6 / **449** |
| `02_GetProductDetail` | 1.1 / 2 / 13 | 1.6 / 5 / 102 | 2.1 / 6 / 17 | 1.9 / 5 / **584** |
| `03_AddToCart` | 1.4 / 2 / 5 | 1.1 / 2 / 14 | 1.4 / 3 / 6 | 1.6 / 3 / 38 |
| `04_Checkout` | 5.6 / 8 / 33 | 5.7 / 14 / 102 | 4.8 / 9 / 32 | 6.5 / 10 / **584** |

**Observations:**

- **`04_Checkout` is consistently the slowest endpoint** across all four scenarios (~3–5x the average of the read-only `GetProductDetail` call). This tracks with it being the only endpoint doing a full write transaction (order creation) against SQLite — SQLite's single-writer model means this is exactly where contention would first appear.
- **`03_AddToCart`** stays cheap and stable everywhere (simple single-row insert), confirming the slowness is specific to checkout's transactional logic, not "writes in general."
- **`01_Login`** has a visibly heavier tail than its average would suggest (e.g. Stress: avg 2.2ms but p99 16ms; Endurance: avg 2.8ms but a 449ms outlier). This is consistent with **bcrypt/password-hashing being CPU-bound and briefly blocking Node's single event loop** under concurrent access — a normal cost for password work, but one that shows up as tail latency, not average latency.

---

## 3. Throughput Scaling

Looking at the Stress run's ramp-up in 30-second windows (ramp-up was 60s to reach 100 threads):

| Time window | Concurrent threads | Throughput | Avg latency |
|---|---|---|---|
| 0–30s | ramping to 52 | 32.5 req/s | 2.6 ms |
| 30–60s | ramping to 100 | 94.7 req/s | 2.1 ms |
| 60–90s | 100 (steady) | 124.4 req/s | 2.1 ms |
| 90–270s | 100 (steady) | **~124–125 req/s (plateau)** | 2.0–2.1 ms |
| 240–270s | 100 (steady) | 124.1 req/s | **3.9 ms** (starting to climb) |
| 270–300s | 100 (steady) | 122.3 req/s | **5.4 ms** (climbing further) |

**Throughput plateaus at ~124–125 req/s once 100 concurrent VUs are reached**, and holds there for roughly 3 minutes with essentially flat latency — a genuinely healthy steady state. The **last ~60 seconds of the Stress run show average latency roughly doubling to tripling** (2.0ms → 3.9ms → 5.4ms) while throughput stays flat — an early warning sign of the same kind of resource buildup seen more dramatically in the Endurance run (see below), just not yet severe enough to cause errors or major slowdown within a 5-minute window.

Spike confirms the system can *absorb* a burst up to 150 concurrent threads / momentary 274 req/s without errors or serious latency growth (p95 stayed at 7ms) — but an 11-second burst is too short to reveal whether that rate is sustainable, only that it's survivable briefly.

---

## 4. Bottleneck: The Endurance Test Latency Spike

The most important finding in this data set is a **~500ms cluster of slow requests during the Endurance run**, all occurring within roughly a 0.5-second window near the end of the 15-minute soak:

```
timestamp        elapsed(ms)  endpoint              threads
1786287390733    584          02_GetProductDetail   50
1786287390733    584          04_Checkout            50
1786287390809    526          04_Checkout            50
1786287390855    479          02_GetProductDetail    50
1786287390871    449          01_Login               50
1786287390948    383          04_Checkout            50
1786287391024    313          01_Login               50
...(16 requests >100ms total, all clustered in ~490ms)
```

**Why this matters more than the average numbers:** this isn't one slow request — it's *multiple different endpoint types (Login, GetProduct, Checkout) all stalling simultaneously* at the same moment, all still at the same concurrency level (50 threads, no thread-count change). That signature — a synchronized, brief freeze affecting unrelated request types at once — is the classic fingerprint of **Node's single-threaded event loop being blocked** by something synchronous, most likely one of:
- A **Node.js garbage-collection pause** (V8 major GC) under sustained 15-minute memory churn, or
- A **synchronous SQLite operation** (e.g. a WAL checkpoint flush, or a non-WAL journal fsync) momentarily blocking the whole process, or
- Bcrypt's CPU-bound hashing work coinciding with a GC cycle.

This kind of event is invisible in a 5-minute Load or Stress test and only surfaced because the Endurance run ran long enough — which is exactly the value of soak testing.

---

## 5. Suggested Performance Thresholds

> **Caveat:** these `.jtl` files contain client-observed timing only (no server-side CPU/memory/heap metrics). The throughput and latency figures below are directly measured; the memory guidance is a *recommendation for what to instrument next*, not a measured limit — flagged accordingly.

| Metric | Recommended threshold | Basis |
|---|---|---|
| **Max stable throughput** | ~**120 req/s** sustained at 100 concurrent users on this hardware | Directly observed plateau in Stress test steady-state window |
| **Read endpoint SLA** (`GetProductDetail`) | p95 < **20 ms**, alert if p95 > 50 ms | Observed p95 stayed ≤6ms in all scenarios; generous headroom |
| **Write endpoint SLA** (`AddToCart`) | p95 < **20 ms** | Observed p95 ≤3ms everywhere |
| **Transactional SLA** (`Checkout`) | p95 < **50 ms**, alert if p95 > 100 ms | Observed p95 up to 14ms normally, but this is the endpoint most likely to degrade first under real load |
| **Auth SLA** (`Login`) | p95 < **30 ms**, hard alert on any single request > **200 ms** | To catch event-loop stalls like the 449–584ms Endurance spike before they compound |
| **Error rate budget** | < 0.1% (currently 0% — untested breakpoint) | No errors observed at any tested load; recommend re-running Stress at 200–400 VUs to actually find the ceiling |
| **Memory (recommended limit to set, not yet measured)** | Instrument and cap Node heap around **512MB–1GB** for this workload size, with `--max-old-space-size` alerting if approaching the cap | Standard practice for small Node services; needs real measurement (see below) — the Endurance stall is *consistent with* GC pressure but not confirmed without heap snapshots |

**Recommended next step before finalizing SLAs:** re-run Stress at a higher VU ceiling (e.g. 200 → 400) while capturing server-side metrics (`process.memoryUsage()` logged periodically, or a lightweight APM/`clinic.js` profile) alongside JMeter — this data set proves the app survives up to 150 VUs but doesn't yet show where it fails.

---

## 6. Architectural Optimization Recommendations

### 1. Enable SQLite WAL mode + tune synchronous pragma
```sql
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
```
`Checkout` is consistently the slowest and most variable endpoint in every scenario — classic symptom of SQLite's default rollback-journal mode serializing writers and fsyncing on every transaction. WAL mode allows concurrent readers during a write and batches fsyncs, which should directly reduce both average and tail latency on `POST /api/checkout` and `POST /api/cart`.

### 2. Move bcrypt hashing off the main event loop
Login's disproportionate tail latency (p99 up to 16-24ms, and the 449ms Endurance outlier) points to bcrypt's synchronous CPU cost blocking Node's single thread. Use `bcrypt.hash()`'s async/Promise API (already non-blocking if used correctly) or offload to a `worker_threads` pool, and consider tuning the cost factor down slightly if the current setting is higher than necessary for this workload's threat model.

### 3. Add indexes on hot lookup columns
Ensure indexes exist on `products.id` (path param on the read-heavy endpoint), `users.email` (login lookup), and any `order.user_id` / `cart.user_id` foreign keys used by checkout and order-history queries. On SQLite this is a near-zero-cost change with outsized impact once row counts grow beyond what a full-table scan handles cheaply.

### 4. Introduce an in-memory cache for product reads
`GET /api/products/:id` is called on every iteration and is read-only. A small in-process cache (e.g. `node-cache`, or `lru-cache` with a short TTL) in front of the DB read — invalidated on admin product updates — would cut DB round-trips for the highest-volume endpoint with minimal complexity, and is a natural first step before introducing a separate cache service.

### 5. Investigate and cluster for multi-core utilization
Node.js runs single-threaded by default, so this whole test only ever exercised one CPU core — the plateau at ~124 req/s and the GC-pause-like Endurance stall are both consistent with single-core saturation. Running the app under Node's `cluster` module or PM2 in cluster mode (behind a lightweight reverse proxy like nginx) would let concurrent requests spread across cores, directly raising the throughput ceiling. Longer-term, since SQLite itself doesn't support true multi-process concurrent writers well, migrating to a client-server database (PostgreSQL/MySQL) would be the natural next step to scale horizontally beyond a single machine.

**Suggested priority order:** #1 (WAL mode) and #3 (indexes) are cheap, low-risk, high-impact — do these first. #2 (async bcrypt) directly addresses the observed tail-latency anomaly. #4 and #5 are the right moves once you've confirmed the first three didn't already resolve the plateau/stall — clustering and caching add real complexity, so it's worth re-testing after #1–#3 to see how much headroom they open up before reaching for the bigger architectural changes.
