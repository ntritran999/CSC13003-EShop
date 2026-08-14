# HW05 Performance Testing - Self-Assessment and Test Summary

**Student:** Nguyen An Nghiep  
**Student ID:** 23127234  
**System under test:** eShop REST API at `http://localhost:3000`  
**Test tool:** Apache JMeter 5.6.3  

## Self-assessment

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | ---: | ---: |
| **1** | Task 1 — Load testing | 20 | **20** |
| **2** | Task 1 — Stress testing | 20 | **20** |
| **3** | Task 1 — Spike testing | 20 | **20** |
| **4** | Task 2 — AI analysis + misinterpretation hunt (with correct values from raw logs) | 10 | **10** |
| **5** | Task 3 — Continuous Performance Testing proposal (G9.6) | 10 | **10** |
| **6** | Agent Skills | 10 | **10** |
|  | **Total** | **100** | **100** |


## Test summary

### Scenarios run

All formal runs used a freshly restarted backend and the same data-driven login-read-create workflow. Across the four runs, JMeter recorded **58,733 real HTTP samples and 0 errors**.

| Scenario | Executed workload | Samples | Errors | Key measured result |
|---|---|---:|---:|---|
| Load | 20 users, 60 s ramp-up, 360 s duration | 4,956 | 0 | p95 **14 ms**, p99 **26.43 ms**, **13.77 req/s** |
| Stress | Ramp to 160 users over 480 s, 600 s duration | 26,699 | 0 | Raw-JTL p95 **3,831 ms**, p99 **6,370 ms**; sustained knee at **111–121 users** |
| Spike | 10-user baseline plus 150 surge users; peak 160 users | 14,261 | 0 | p95 **446 ms**, p99 **1,346 ms**; operational recovery succeeded but the strict p95 recovery rule failed |
| Endurance / soak | 20 users, 60 s ramp-up, 900 s duration | 12,817 | 0 | Stable at **14.69 req/s after ramp** for the recorded soak period; p95 **42 ms**, p99 **103 ms** |

Raw evidence and dashboards are available in the [results](./test-plan-human-corrected/results/) and [reports](./test-plan-human-corrected/reports/) folders. The detailed calculations and JTL/dashboard cross-check are in [Main_report.md](./Main_report.md).

### Endpoint groups covered

Every Load, Stress and Spike plan executed the same complete workflow:

| Required group | Covered endpoint | Role in the journey |
|---|---|---|
| Auth-heavy | `POST /api/login` | Authenticate the seeded administrator, validate the role and extract the JWT |
| Read-heavy | `GET /api/products` | Read and validate the complete product catalog |
| Transactional | `POST /api/products` | Create a product and validate the returned product ID |

The endurance run reused the corrected Load workflow, CSV data, assertions and think-times, with the scheduler extended to 15 minutes.

### Endurance threshold

The measured endurance result establishes the following **verified stable lower bound** on the tested laptop:

| Threshold metric | Verified value |
|---|---:|
| Highest concurrency soaked for 15 minutes | **20 users** |
| Stable total request rate after ramp | **14.69 req/s** |
| Stable completed-journey rate after ramp | **4.90 journeys/s** |
| Highest successful 30-second request rate | **15.5 req/s** |
| Overall average / p95 / p99 | **17.44 / 42 / 103 ms** |
| Maximum response time | **657 ms** |
| Error rate | **0.00%** |
| Backend memory visible at completion | **69.1 MB** |
| Conservative captured backend-memory upper bound | **<154.7 MB** |
| Highest visible JMeter injector memory | **698.8 MB** |
| Highest captured total system-memory use | **75% of 16,384 MB (about 12.0 GB)** |

Therefore, the empirical threshold supported by this run is **at least 14.69 req/s at 20 concurrent users with 0 errors and p95 42 ms**. This is a stable operating point and a lower bound, not the maximum hardware capacity. A maximum stable RPS and exact backend-memory ceiling were **not established**, because no higher-concurrency 10–15 minute soak or continuous per-process memory trace was recorded.

Evidence: [Endurance JTL](./test-plan-human-corrected/results/23127234_Endurance_20260812.jtl), [HTML dashboard](./test-plan-human-corrected/reports/endurance_html/index.html), and resource screenshots at [start](./test-plan-human-corrected/evidence/endurancec_start.png), [middle](./test-plan-human-corrected/evidence/endurance_middle.png), and [end](./test-plan-human-corrected/evidence/endurance_end.png).

### Bugs and performance issues

**Total identified findings: 4 — 1 security/functional bug and 3 measured performance issues.** The formal JMeter runs themselves produced **0 HTTP errors, crashes or functional assertion failures**.

| Type | Finding | Evidence |
|---|---|---|
| Security/functional bug | `POST /api/products` has neither authentication nor an administrator-role guard in the inspected backend implementation. | Source-code review documented in Main Report Sections 1.1 and 2.5 |
| Performance issue | The unpaginated `GET /api/products` response grew from **56.5 KiB** in the first endurance interval to **587.1 KiB** in the final interval. | Endurance JTL interval analysis |
| Performance issue | Stress reached a latency/throughput knee between **111 and 121 users**: p95 increased from **650.7 ms** to **1,492.4 ms** while throughput fell from **66.40** to **62.53 req/s**. | Stress 30-second bucket analysis |
| Performance issue | Spike recovered operationally, but post-spike p95 values of **28.00, 22.00, 23.75 and 23.85 ms** never returned to the strict **19.2 ms** recovery limit. | Spike post-surge bucket analysis |

No specific GitHub Issue URL was present in the submitted artifacts when this README was prepared. The repository Issues page is [available here](https://github.com/ntritran999/CSC13003-EShop/issues); issue links should be added if these findings are formally logged.

### Demo video

Unlisted YouTube demo with Vietnamese narration: [HW05 Performance Testing Demo](https://youtu.be/8t0OF1hpGJ4)

The video demonstrates JMeter and the resource monitor in the same frame and covers the scenario execution, report views, verified Stress breaking point, and Spike recovery interpretation.

## Main deliverables

- [Main performance-testing report](./Main_report.md)
- [Corrected JMeter test plans](./test-plan-human-corrected/)
- [AI analysis](./analysis_result_ai/AI_Analysis.md)
- [AI audit report](./%5BAI-02%5D%20-%20FIT%40HCMUS%20-%20AI%20Audit%20Report.md)
- [AI critique](./AI_critique.md)
- [Reusable performance-testing skill](./agents/SKILL.md)
- [Public GitHub repository](https://github.com/ntritran999/CSC13003-EShop)
- [Demo video](https://youtu.be/8t0OF1hpGJ4)
