# HW05 – Performance Testing

## Self-assessment table

| **No.** | **Criteria** | **Grade** | **Self-Assessed Grade** |
| --- | --- | --- | --- |
| **1** | Task 1 — Load testing | 20 | 20  |
| **2** | Task 1 — Stress testing | 20 | 20 |
| **3** | Task 1 — Spike testing | 20 | 20 |
| **4** | Task 2 — AI analysis + misinterpretation hunt (with correct values from raw logs) | 10 | 10 |
| **5** | Task 3 — Continuous Performance Testing proposal (G9.6) | 10 | 10 |
| **6** | Agent Skills | 10 | 0 |
|  | **Total** | **100** | 90 |

## Test summary report

- Scenarios run: 3 (load test, stress test, spike test)
- Endpoint groups covered: 3 (auth-heavy, read-heavy, transactional)
- Endurance threshold:
  - Response Times(ms):
    - Average: 8.51
    - P50: 9.00
    - P90: 10.00
    - P95: 11.00
    - P99: 15.00
  - Throughput: 11162.84 transaction/s
  - Peaked CPU Usage on backend: 11.4%
- Number of bugs/performance issues: 0
- Demo video link: [Youtube link](https://youtu.be/PWLLhrYgbjA)