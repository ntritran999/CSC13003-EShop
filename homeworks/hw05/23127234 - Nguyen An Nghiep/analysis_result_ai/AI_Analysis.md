# AI Analysis of Load, Stress and Spike JTL Results

> Status: AI-generated analysis awaiting the separate human misinterpretation review. This file does not replace that review.

## 1. Sources and calculation method

Raw inputs:

- [Load JTL](../test-plan-human-corrected/results/23127234_Load_20260812.jtl)
- [Stress JTL](../test-plan-human-corrected/results/23127234_Stress_20260812.jtl)
- [Spike JTL](../test-plan-human-corrected/results/23127234_Spike_20260812.jtl)

JMeter cross-checks:

- [Load dashboard statistics](../test-plan-human-corrected/reports/load_html/statistics.json)
- [Stress dashboard statistics](../test-plan-human-corrected/reports/stress_html/statistics.json)
- [Spike dashboard statistics](../test-plan-human-corrected/reports/spike_html/statistics.json)

The calculations use `elapsed` as response time, `success` for error counting, `label` for endpoint grouping, `allThreads` for observed concurrency and `bytes` for received-data size. Percentiles use JMeter's legacy interpolation rule: sort the observations, calculate `p * (n + 1)`, and interpolate between the adjacent values. This reproduces all endpoint p95/p99 values in the HTML dashboards.

Stress behavior is evaluated in 30-second buckets starting at the first recorded Stress sample. Spike behavior is divided using the first actual `Spike Surge Profile` sample and the configured 120-second surge duration. Post-spike recovery is also checked in 30-second buckets. Throughput is HTTP samples per second; it must not be confused with completed journeys per second. A completed journey is represented by a successful `03_Create_Product` sample.

## 2. Load, Stress and Spike comparison

| Scenario | Recorded duration | Maximum threads | HTTP samples | Errors | Average | Raw overall p95 | Raw overall p99 | JMeter total throughput | JMeter completed-journey throughput |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Load | 359.852 s | 20 | 4,956 | 0 (0.00%) | 8.21 ms | 14 ms | 26.43 ms | 13.77 req/s | 4.65 journeys/s |
| Stress | 600.632 s | 160 | 26,699 | 0 (0.00%) | 834.96 ms | 3,831 ms | 6,370 ms | 44.45 req/s | 14.83 journeys/s |
| Spike | 299.390 s | 160 | 14,261 | 0 (0.00%) | 110.21 ms | 446 ms | 1,346 ms | 47.63 req/s | 15.88 journeys/s |

The Load run was comfortably inside every frozen latency and error target. Stress increased whole-run request throughput to 3.23 times the Load rate, but raw overall p95 increased from 14 ms to 3,831 ms. The system therefore saturated by latency and throughput before it failed by HTTP errors. Spike reached the same maximum concurrency as Stress much more suddenly, but it held that concurrency for only about two minutes; its whole-run percentile does not describe either the surge or the recovery by itself.

The completed-journey throughput column is the JMeter throughput of `03_Create_Product`, whose per-label time span is slightly shorter than the complete scenario span. It is not `total request throughput / 3`, because some users had incomplete iterations at test boundaries.

## 3. p95 and p99 per endpoint

| Scenario | Endpoint | Samples | p95 | p99 | Frozen endpoint p95 target | p95 result |
|---|---|---:|---:|---:|---:|---|
| Load | `01_Login_Admin` | 1,664 | 10 ms | 18.70 ms | <800 ms | Pass |
| Load | `02_Get_Products` | 1,648 | 10 ms | 22.53 ms | <800 ms | Pass |
| Load | `03_Create_Product` | 1,644 | 16 ms | 97.20 ms | <1,200 ms | Pass |
| Stress | `01_Login_Admin` | 8,992 | 1,396 ms | 3,139.70 ms | <800 ms | Fail |
| Stress | `02_Get_Products` | 8,874 | 4,315.25 ms | 6,720 ms | <800 ms | Fail |
| Stress | `03_Create_Product` | 8,833 | 4,278.30 ms | 6,687.98 ms | <1,200 ms | Fail |
| Spike | `01_Login_Admin` | 4,829 | 415 ms | 695.70 ms | <800 ms | Pass |
| Spike | `02_Get_Products` | 4,755 | 466.40 ms | 1,511.32 ms | <800 ms | Pass |
| Spike | `03_Create_Product` | 4,677 | 445 ms | 1,287.30 ms | <1,200 ms | Pass |

All 18 endpoint percentile values above were calculated from the raw JTL rows and match the corresponding JMeter `statistics.json` values. The frozen 1,500 ms p99 requirement is an overall-run target, not an endpoint-specific target. Spike's overall p99 was 1,346 ms and passed, although the Spike GET endpoint p99 was slightly higher at 1,511.32 ms.

## 4. Stress breaking point

Selected 30-second Stress buckets around the capacity knee:

| Time | Maximum threads | Requests/s | Completed journeys/s | Overall p95 | Overall p99 | Errors |
|---|---:|---:|---:|---:|---:|---:|
| 180-210 s | 71 | 47.33 | 15.60 | 100.0 ms | 162.8 ms | 0 |
| 210-240 s | 81 | 51.53 | 17.00 | 883.8 ms | 1,851.3 ms | 0 |
| 240-270 s | 91 | 61.73 | 20.43 | 231.3 ms | 314.0 ms | 0 |
| 270-300 s | 101 | 65.13 | 21.53 | 398.0 ms | 491.8 ms | 0 |
| 300-330 s | 111 | **66.40** | **22.20** | 650.7 ms | 895.1 ms | 0 |
| 330-360 s | 121 | 62.53 | 20.80 | **1,492.4 ms** | 1,770.0 ms | 0 |
| 360-390 s | 131 | 55.63 | 18.23 | 2,247.0 ms | 2,467.9 ms | 0 |
| 390-420 s | 142 | 53.23 | 17.27 | 3,379.6 ms | 3,815.4 ms | 0 |
| 420-450 s | 151 | 45.03 | 15.77 | 4,291.8 ms | 4,790.3 ms | 0 |
| 450-480 s | 160 | 46.67 | 15.83 | 5,417.9 ms | 7,142.3 ms | 0 |

The 81-thread bucket contains an isolated p95 breach, but p95 recovered to 231.3 ms in the following 91-thread bucket while throughput continued to rise. It is therefore not a defensible sustained breaking point by itself.

The repeatable knee begins between the 111-thread and 121-thread buckets:

- At up to 111 observed threads, throughput peaked at 66.40 req/s and p95 remained below the 800 ms SLO at 650.7 ms.
- At up to 121 threads, throughput fell by 5.8% to 62.53 req/s while p95 more than doubled to 1,492.4 ms.
- Every following ramp bucket remained above the p95 target and throughput declined further through 151 threads.
- There were no HTTP or assertion errors, so the breaking mode was latency saturation and a throughput knee, not an error-rate or crash boundary.

**AI estimate: the Stress breaking point is approximately 120 concurrent users, with the knee starting in the 111-121 user range.** The maximum achieved 30-second throughput was 66.40 HTTP req/s, including 22.20 completed journeys/s, in the bucket that reached 111 threads.

## 5. Spike behavior and recovery

| Phase | Nominal duration | Samples | Requests/s | Maximum threads | p95 | p99 | Errors |
|---|---:|---:|---:|---:|---:|---:|---:|
| Pre-spike baseline | 60 s | 414 | 6.90 | 10 | 16 ms | 233.45 ms | 0 |
| Surge | 120 s | 12,962 | 108.02 | 160 | 456 ms | 1,391.37 ms | 0 |
| Post-spike observation | approximately 120 s | 885 | 7.38 | 14 while the final surge samples drained, then 10 | 24 ms | 52.98 ms | 0 |

The pre-spike p95 was 16 ms, so the frozen recovery threshold was `16 * 1.20 = 19.2 ms`. The post-spike buckets were:

| Time after nominal surge end | Samples | Requests/s | Maximum threads | p95 | p99 | Errors |
|---|---:|---:|---:|---:|---:|---:|
| 0-30 s | 226 | 7.53 | 14 | 28.0 ms | 470.38 ms | 0 |
| 30-60 s | 213 | 7.10 | 10 | 22.0 ms | 35.86 ms | 0 |
| 60-90 s | 224 | 7.47 | 10 | 23.75 ms | 44.50 ms | 0 |
| 90-120 s | 222 | 7.40 | 10 | 23.85 ms | 41.77 ms | 0 |

Two different recovery conclusions are necessary:

1. **Operational recovery passed.** No requests failed, the backend continued responding, request throughput returned to approximately the pre-spike rate, and the last observed above-baseline sample finished about 0.56 seconds after the nominal surge boundary.
2. **The frozen latency-recovery target failed.** None of the 30-second post-spike buckets returned p95 to 19.2 ms or below. Therefore, recovery to within 20% of the original p95 was not demonstrated within the recorded post-spike window, including the first 60 seconds.

The first post-spike bucket's high p99 reflects a small number of late or in-flight surge observations. Calling the system "recovered immediately" based only on zero errors or thread count would ignore the latency requirement.

## 6. Suggested thresholds

These are recommendations for future runs; they must not be applied retroactively to change the pass/fail rules frozen before these tests.

| Purpose | Suggested threshold |
|---|---|
| Formal Load acceptance | Retain overall p95 <800 ms, overall p99 <1,500 ms, error rate <1%, Login/GET p95 <800 ms and Create p95 <1,200 ms. |
| Regression detection | Use the median p95 of at least three clean baseline runs and flag a regression when it is more than 15% above that baseline. A single very fast local run is too noisy for a reliable relative gate. |
| Normal local concurrency | Use no more than approximately **70 concurrent users** until a separate calibrated run is available. This is below the observed 111-121-user knee and below the isolated 81-user excursion. |
| Stress breaking-point rule | Declare a sustained break when p95 exceeds 800 ms for two consecutive 30-second buckets, errors exceed 1%, or throughput falls while concurrency continues to rise. This run satisfies the latency/throughput rule near 120 users. |
| Spike integrity | Error rate <1%, no backend crash, and no dropped or timed-out requests. |
| Spike recovery | Retain the pre-declared requirement: post-spike p95 within 20% of baseline within 60 seconds. This run did not meet it. |

If a less noise-sensitive Spike rule is desired later, derive it from repeated baselines before rerunning, for example `max(1.20 * baseline p95, baseline p95 + 10 ms)`. It would be invalid to introduce that relaxation only because this result missed 19.2 ms.

## 7. Resource and payload correlations

The raw JTL files do **not** contain backend CPU, backend RAM, disk I/O, SQLite lock time or JMeter process-memory samples. Therefore, these results cannot prove a CPU bottleneck, a memory leak or an exact hardware-resource correlation. A static screenshot is also insufficient for a time-series correlation.

The JTL does contain received-byte counts. The GET response grew strongly during every scenario:

| Scenario | Average GET bytes in first 30 s | Average GET bytes in final 30 s | Raw GET bytes/elapsed Pearson `r` |
|---|---:|---:|---:|
| Load | 3.64 KiB | 241.24 KiB | 0.055 |
| Stress | 3.83 KiB | 1,315.60 KiB | 0.630 |
| Spike | 5.44 KiB | 714.08 KiB | 0.384 |

For the twenty Stress buckets, maximum concurrency versus overall p95 had Pearson `r = 0.849`, and average GET bytes versus GET p95 had `r = 0.863`. These are strong associations, but concurrency, elapsed test time and response size all increased together, so the JTL cannot separate their causal effects. The similar 3-5 KiB starting payloads also support that the three scenarios began from comparably small datasets.

The most plausible interpretation is that each successful create expanded the catalog returned by the unpaginated GET endpoint. That increases response serialization, transfer, JMeter allocation and database work. The near-zero Load bytes/latency correlation shows that larger payload alone did not cause meaningful latency at 20 users, while its stronger Stress relationship suggests payload growth amplified the high-concurrency bottleneck.

## 8. Optimization recommendations

1. **Paginate `GET /api/products`.** This has the strongest direct evidence because the received response grew from a few KiB to more than 1.3 MiB during Stress.
2. **Allow field selection and consider response compression.** These reduce serialization, network transfer and load-generator memory, but should be benchmarked separately from pagination.
3. **Use a controlled database reset or cleanup for repeatable tests.** Otherwise, later intervals measure a larger dataset as well as higher concurrency.
4. **Benchmark SQLite WAL mode and transaction behavior.** It may improve concurrent read/write behavior, but the JTL has no SQLite-lock errors, so it should be measured rather than assumed to fix the knee.
5. **Capture synchronized resource time series.** Record backend CPU/RAM, disk I/O, event-loop delay and JMeter CPU/RAM at 1-5 second intervals using timestamps compatible with the JTL. This is required for a valid resource correlation.
6. **Keep JMeter non-GUI and monitor the injector.** The growing GET payload may make the local injector part of the bottleneck; use a remote injector if its CPU or memory saturates.
7. **Consider PostgreSQL only after targeted measurements.** It is a feasible scale-oriented architecture change but is more expensive than pagination and SQLite tuning.

Caching the entire product list is questionable because every create invalidates the cache. Adding an index does not solve the cost of returning every row from an unfiltered endpoint. The Stress data points first to the growing read response and concurrent read/write workload, not to authentication alone: Stress Login p95 was 1,396 ms, while GET and Create p95 were both above 4,278 ms.

## 9. Raw-JTL versus JMeter-report verification notes

| Check | Raw JTL calculation | JMeter report | Result |
|---|---:|---:|---|
| Load samples/errors | 4,956 / 0 | 4,956 / 0 | Match |
| Load overall p95/p99 | 14 / 26.43 ms | 14 / 26.43 ms | Match |
| Stress samples/errors | 26,699 / 0 | 26,699 / 0 | Match |
| Stress overall average | 834.9578 ms | 834.9578 ms | Match |
| Stress raw overall median | 202 ms | 463 ms | **Mismatch** |
| Stress raw overall p90 | 2,809 ms | 3,301 ms | **Mismatch** |
| Stress raw overall p95 | 3,831 ms | 4,172 ms | **Mismatch** |
| Stress raw overall p99 | 6,370 ms | 6,651.99 ms | **Mismatch** |
| Spike samples/errors | 14,261 / 0 | 14,261 / 0 | Match |
| Spike overall p95/p99 | 446 / 1,346 ms | 446 / 1,346 ms | Match |
| All endpoint p95/p99 values | Directly calculated per label | Dashboard values | Match |

The Stress `statistics.json` has the same sample count, error count, mean, minimum and maximum as the raw JTL, and all three Stress endpoint percentiles match the raw calculation exactly. Only its synthetic `Total` percentile fields differ from a direct percentile calculation across all 26,699 raw `elapsed` values. The cause is not established here. For this AI analysis, per-endpoint values use the exact matching figures, while Stress overall percentile statements explicitly use the direct raw-JTL calculation. This discrepancy should be examined in the later human review rather than silently ignored.
