# HW04 – Automation Testing

## 1. SELF-ASSESSMENT TABLE

| No. | Criteria | Grade | Self-Assessed Grade |
| :---: | :--- | :---: | :---: |
| **1** | Task 1 — Load testing | 20 | 20 |
| **2** | Task 1 — Stress testing | 20 | 20 |
| **3** | Task 3 — Spike testing | 20 | 20 |
| **4** | Task 2 — AI analysis + misinterpretation hunt (with correct values from raw logs) | 10 | 10 |
| **5** | Task 3 — Continuous Performance Testing proposal (G9.6) | 10 | 10 |
| **6** | Agent Skills | 10 | 0 |
| | **Total** | **100** | **90** |

## 2. TEST SUMMARY REPORT

* **Scenarios Run:** 4 Scenarios
  * **Load Test:** 40 VUs, 60s Ramp-Up, 300s Hold
  * **Stress Test:** 100 VUs, 60s Ramp-Up, 300s Hold
  * **Spike Test:** 150 VUs, 5s Ramp-Up, Loop Count = 5
  * **Endurance Test:** 50 VUs, 60s Ramp-Up, 900s Hold (15 mins)

* **Endpoint Groups Covered:** 4 Endpoints
  * `01_Login` (`POST /api/login`)
  * `02_GetProductDetail` (`GET /api/products/:id`)
  * `03_AddToCart` (`POST /api/cart`)
  * `04_Checkout` (`POST /api/checkout`)

* **Endurance Threshold:**
  * **Virtual Users:** 50 VUs
  * **Duration:** 15 minutes (900 seconds)
  * **Total Requests:** 28,816 samples
  * **Throughput:** 32.1 req/s
  * **Error Rate:** 0.00%
  * **Average Response Time:** 3 ms
  * **Max Response Time:** 584 ms

* **Number of Bugs / Performance Issues:** 0 Bugs
  * **Functional Bugs:** 0 (0.00% Error Rate across 70,868 total requests)

* **Demo Video Link:** [Youtube Link](https://youtu.be/_VBcHjcosdo)
