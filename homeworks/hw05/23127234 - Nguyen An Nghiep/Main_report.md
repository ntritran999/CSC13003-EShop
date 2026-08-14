<h3 align='center'>UNIVERSITY OF SCIENCE, VNUHCM</h3>
<h3 align='center'>FACULTY OF INFORMATION TECHNOLOGY</h3>
<br>
<p align='center'><img src='./images/logo.png' width=50% height=50%></p>

<h3 align='center'>SOFTWARE TESTING</h3>
<h4 align='center'>HW05 – Performance Testing</h4>

<br>
<br>
<br>

### STUDENT INFORMATION

| Field | Detailed Information |
|:---|:---|
| **Full Name** | Nguyen An Nghiep |
| **Student ID** | 23127234 |
| **Github** | https://github.com/ntritran999/CSC13003-EShop |



# 1. Task 1 - AI-assisted test design and execution

## 1.1 Test design requirements

### 1.1.1 Scope, workflow and endpoint-group mapping

All Load, Stress and Spike plans execute the same Catalog & Inventory Management journey:

1. `POST /api/login` — authenticate the seeded administrator and extract the JWT.
2. `GET /api/products` — read the current product catalog.
3. `POST /api/products` — create one product and validate the returned ID.

The base URL is `http://localhost:3000`. The product path must be plural, `/api/products`. No verification or cleanup request is added because duplicate product data is accepted by the SUT. The test sends the extracted JWT to the product requests even though the inspected backend implementation currently defines `POST /api/products` without the `authenticateToken` middleware. That access-control concern should be verified and reported separately as a security issue; it does not change the endpoint's transactional role in this performance workflow.

| Required endpoint group | Request in the workflow | Coverage rationale |
|---|---|---|
| Auth-heavy | `POST /api/login` | Every journey authenticates the shared seeded administrator and validates the JWT and role. |
| Read-heavy | `GET /api/products` | Every journey reads the complete product catalog. |
| Transactional | `POST /api/products` | Every journey performs a state-changing product creation and validates the returned ID. |

### 1.1.2 Data-driven and functional requirements

- `test-data/admin_credentials.csv` supplies `email,password`; `test-data/products.csv` supplies ten product payloads across category IDs 1–3.
- CSV headers are used as JMeter variables. Files use UTF-8, recycle at EOF, do not stop threads at EOF and are shared across all threads.
- Only the valid seeded account `admin@eshop.com` / `Admin123!` is used; invalid logins may lock the shared account.
- Login must return HTTP `200`, a non-empty JWT and role `admin`. The product list must return HTTP `200` and a non-empty JSON-array response. Product creation must return HTTP `200`, `Product created` and a positive numeric ID.
- A random 1–3 second think-time is applied before the read and create requests. Protocol, host, port, workload and timing values remain configurable through JMeter properties.

### 1.1.3 Executed scenario configurations and distinct report views

| Scenario | Configuration encoded in the corrected JMX and used by the saved JTL | Distinct JMeter report view |
|---|---|---|
| Load | 20 threads, 60-second ramp-up, 360-second total duration | Summary Report (`SummaryReport`) |
| Stress | 160 maximum threads, 480-second ramp-up, 600-second total duration | Aggregate Report (`StatVisualizer`) |
| Spike | 10-thread baseline: 10-second ramp and 300-second duration; plus 150 surge threads after a 60-second delay: 5-second ramp and 120-second duration; peak total is 160 threads | Aggregate Graph (`StatGraphVisualizer`) |

I verified these values directly against the three corrected `.jmx` files and against the timestamps and maximum active-thread values in the saved `.jtl` files. Therefore, the scenario table fits the executable test code. These are the **executed default workloads**, not merely hypothetical values. The listener assigned to each plan is present but disabled during non-GUI execution, which prevents GUI rendering overhead from contaminating the measurement. The raw JTL is generated with the CLI `-l` option; the assigned listener can then be enabled to load that JTL for its distinct report-view screenshot. Each run also has a complete HTML dashboard.

### 1.1.4 SLO targets and execution controls

The targets frozen in every corrected JMX are overall p95 below 800 ms, overall p99 below 1,500 ms and error rate below 1%; endpoint p95 targets are 800 ms for login and product read, and 1,200 ms for product creation. These are acceptance targets, not measured results. GUI listeners remain disabled during CLI execution and are intended only for loading a completed JTL afterward.

The backend is restarted before each scenario because every iteration inserts a product and `GET /api/products` returns the entire unpaginated table. Without a restart, later scenarios would inherit the products created by earlier scenarios and would not be comparable. The corrected plans also use 5,000 ms connect and 10,000 ms response timeouts, HTTP keep-alive, UTF-8, and a 1-3 second random think-time before each read and create request. Only the valid seeded administrator is used and the formal JTLs contain no login errors, so the three-failed-login lockout was not triggered and no separate lockout reset was required during these runs.

## 1.2 Human review and correction of the AI-generated test plans

After I reviewed all three AI-generated plans against `api_specification.md`, I have placed my corrected versions in `test-plan-human-corrected/` and preserved the AI-generated files in `test-plans/` (based on - Apache JMeter Test Plan documentation — thread groups, timers and listener scope: https://jmeter.apache.org/usermanual/test_plan.html)

All corrected plans still execute exactly the selected workflow:

1. `POST /api/login`
2. `GET /api/products`
3. `POST /api/products`

| Area | Problem in the AI-generated version | My human correction | Why the AI likely missed it | Effect of the correction |
|---|---|---|---|---|
| Failure-control action | The login handler was labelled “Start Next Loop” but stored `OnError.action = 5`. JMeter defines value `5` as “start next iteration of the current loop”; the explicit “Start Next Thread Loop” value is `4`. The generated plan therefore did not encode the action stated by its intent and depended on the surrounding loop context. | I changed every login failure handler to `OnError.action = 4` and renamed it “On Login Failure - Start Next Thread Loop”. | The AI reasoned from the GUI action name but generated the numeric JMX serialization without verifying JMeter's enum constants. | A failed login or login assertion now unambiguously skips the dependent requests and starts the virtual user's next complete journey instead of risking requests with an absent or invalid JWT. |
| End-to-end flow after a failed read | Only login had failure routing. If `GET /api/products` failed its status, content-type or body assertion, JMeter continued to `POST /api/products`. That recorded a product creation even though the “admin reviews the catalog” step had failed. | I added a Result Status Action Handler with action `4` to every product-list sampler. | The AI focused on authentication correlation and did not model the read step as a prerequisite for the following business action. | Failed catalog reviews no longer generate unintended writes or partially valid journeys. This may reduce downstream request volume during read failures, so endpoint throughput must still be examined separately. |
| HTTP throughput and error-rate accuracy | The Transaction Controller used `parent = false`. JMeter therefore generated an independent synthetic transaction sample in addition to the three HTTP samples. Summary/Aggregate totals could count four samples per journey and report misleading HTTP throughput and error percentages. | I replaced each Transaction Controller with a Simple Controller (`GenericController`), which groups the workflow without generating a sample. A completed journey is counted from a successful `03_Create_Product` sample. | The AI treated the controller only as tree organization and overlooked that even non-parent Transaction Controllers emit an additional result sample. | Listener and JTL totals now contain only real HTTP requests: exactly three samples for each fully completed journey. This removes double-counting, although there is no separate end-to-end transaction-duration sample. |
| Load-generator overhead | The GET assertion constructed a complete `JsonSlurper` object for the entire product array on every iteration. The backend returns the full table and every journey inserts another row, so this parsing cost grows throughout Load, Stress and Spike and can make JMeter CPU/memory part of the measured bottleneck. | I retained the status and JSON content-type checks, then replaced full deserialization with a lightweight trimmed-body check for JSON-array shape. | The AI optimized for strong functional validation but did not account for the response growing during the performance test or for assertion cost on the injector. | The injector performs much less allocation and parsing work, reducing measurement distortion. Full schema validation should be performed during the one-thread smoke test rather than on every high-load request. |
| Product-list assertion strength | The original JSON assertion accepted an empty array. A fresh backend seeds five products, so `[]` would contradict the expected catalog state but still pass. | I added an explicit failure when the response body is `[]`. | The AI checked only the JSON container type and did not connect the assertion to the SUT's seeded database state. | An unexpectedly empty catalog is now reported as a functional failure instead of being counted as a successful read. |

### 1.2.1 Corrected plan files

- [`23127234_Load_20260812.jmx`](./test-plan-human-corrected/23127234_Load_20260812.jmx)
- [`23127234_Stress_20260812.jmx`](./test-plan-human-corrected/23127234_Stress_20260812.jmx)
- [`23127234_Spike_20260812.jmx`](./test-plan-human-corrected/23127234_Spike_20260812.jmx)

## 1.3 Test environment and artifact inventory

### 1.3.1 Hardware and runtime

| Item | Recorded value |
|---|---|
| Computer | `LAPTOP-2B4SPHGV` |
| Operating system | Windows 11 Home Single Language 64-bit (build 26200) |
| Processor | AMD Ryzen 7 6800H with Radeon Graphics, 16 logical processors, approximately 3.2 GHz |
| Installed memory | 16,384 MB RAM |
| JMeter | Apache JMeter 5.6.3 |
| Java used by JMeter | OpenJDK 64-Bit Server VM, Java 25 |
| SUT location | Local backend at `http://localhost:3000` |

The processor, RAM, operating system and hostname come from the captured dxdiag System tab. The JMeter and Java versions are also recorded in the real JMeter engine log. The endurance screenshots provide the clearest [hardware and resource evidence](./test-plan-human-corrected/evidence/endurance_end.png).

### 1.3.2 Result and report completeness

| Run | Raw JTL | HTML dashboard | Samples | Errors | Photo evidence |
|---|---|---|---:|---:|---|
| Load | [JTL](./test-plan-human-corrected/results/23127234_Load_20260812.jtl) | [Dashboard](./test-plan-human-corrected/reports/load_html/index.html) | 4,956 | 0 | [Execution photo](./test-plan-human-corrected/evidence/load_evidence.png) |
| Stress | [JTL](./test-plan-human-corrected/results/23127234_Stress_20260812.jtl) | [Dashboard](./test-plan-human-corrected/reports/stress_html/index.html) | 26,699 | 0 | [Execution photo](./test-plan-human-corrected/evidence/stress_evidence.png) |
| Spike | [JTL](./test-plan-human-corrected/results/23127234_Spike_20260812.jtl) | [Dashboard](./test-plan-human-corrected/reports/spike_html/index.html) | 14,261 | 0 | [Execution photo](./test-plan-human-corrected/evidence/spike_evidence.png) |
| Endurance | [JTL](./test-plan-human-corrected/results/23127234_Endurance_20260812.jtl) | [Dashboard](./test-plan-human-corrected/reports/endurance_html/index.html) | 12,817 | 0 | [Start](./test-plan-human-corrected/evidence/endurancec_start.png), [Middle](./test-plan-human-corrected/evidence/endurance_middle.png), [End](./test-plan-human-corrected/evidence/endurance_end.png) |

All four JTLs contain only the three real HTTP sampler labels because the corrected plans use a Simple Controller rather than a Transaction Controller that would emit an extra synthetic sample.

### 1.3.3 HTML dashboard sample views

The following three screenshots are sample views from the generated **Load HTML dashboard**. They demonstrate that the submitted JTL can be converted into a readable dashboard containing an overview, a statistics table and a response-time graph. Because all three images visibly reference the Load JTL, they are presented as Load report-generation evidence and are not labelled as separate Stress or Spike results. The distinct Summary Report, Aggregate Report and Aggregate Graph assignments are verified from the JMX listener definitions described in Section 1.1.3.

<p align="center"><img src="./test-plan-human-corrected/evidence/sample_summary_report.png" width="90%" alt="Load HTML dashboard overview sample"></p>
<p align="center"><em>Figure 1. Load HTML dashboard overview and request summary.</em></p>

<p align="center"><img src="./test-plan-human-corrected/evidence/sample_aggregate_report.png" width="90%" alt="Load HTML dashboard statistics sample"></p>
<p align="center"><em>Figure 2. Load HTML dashboard statistics table.</em></p>

<p align="center"><img src="./test-plan-human-corrected/evidence/sample_aggregate_graph.png" width="90%" alt="Load HTML dashboard response-time graph sample"></p>
<p align="center"><em>Figure 3. Load HTML dashboard response-times-over-time graph.</em></p>

## 1.4 Endurance / soak result and threshold interpretation

### 1.4.1 What "reusing the Load plan" means

The endurance test ran `23127234_Load_20260812.jmx` again and preserved the exact same login-read-create workflow, CSV data, assertions and think-times as Load. The Load defaults were already 20 threads and a 60-second ramp; the important change was extending the scheduler duration from 360 seconds (6 minutes) to 900 seconds (15 minutes). The endurance command wrote to a separate JTL and report directory, so it did not mix with the formal Load result.

### 1.4.2 Verified stable soak point

| Metric | Measured result |
|---|---:|
| Highest concurrency actually soaked for 15 minutes | **20 users** |
| Sustained total request rate after ramp | **14.69 req/s** |
| Highest successful 30-second request rate | **15.5 req/s** |
| Verified endurance-capacity lower bound | **14.69 req/s at 20 users** |
| Maximum sustainable hardware RPS | **Not established by this run** |
| Sustained completed-journey rate after ramp | **4.90 journeys/s** |
| Whole-run completed-journey rate | **4.76 journeys/s** |
| Total HTTP samples | **12,817** |
| Products created successfully | **4,263** |
| Overall average / p95 / p99 | **17.44 / 42 / 103 ms** |
| Maximum response time | **657 ms** |
| Errors | **0 (0.00%)** |
| Exact peak backend-memory ceiling | **Not continuously measured** |
| Conservative captured backend-memory upper bound | **<154.7 MB** |
| Backend memory directly visible at completion | **69.1 MB** |
| Highest visible JMeter injector memory | **698.8 MB** |
| Highest captured total system-memory use | **75% of 16,384 MB (about 12.0 GB)** |

- The defensible conclusion is that this hardware sustained 20 concurrent users at 14.69 total req/s after ramp, or approximately 4.90 completed journeys/s, for the recorded soak period. This is a verified stable operating point and a lower bound on endurance capacity; it is not the maximum hardware threshold because no higher-load soak was recorded.

- To establish the maximum stable endurance threshold, a follow-up series of 10-15 minute soak runs must increase concurrency progressively and record p95, errors, throughput and Node.js memory continuously. Until those runs exist, the maximum stable RPS and exact backend-memory ceiling must remain reported as not established.

- At the tested 20-user operating point, the whole run satisfied the targets of p95 below 800 ms, p99 below 1,500 ms and errors below 1%. After all 20 users had started, the test produced 11,899 requests in 810 seconds (14.69 req/s) with no errors. The highest 30-second interval was 15.5 req/s. There was one temporary interval at 10.9 req/s around 08:07:00, but the next interval recovered to 14.4 req/s without an error or backend restart.

### 1.4.3 Three-minute interval analysis

| Interval | Samples | p95 | Errors | RPS | Average GET response | Products created |
|---|---:|---:|---:|---:|---:|---:|
| 0-3 min (includes ramp) | 2,225 | 20 ms | 0 | 12.36 | 56.5 KiB | 731 |
| 3-6 min | 2,700 | 21 ms | 0 | 15.00 | 182.1 KiB | 901 |
| 6-9 min | 2,566 | 37 ms | 0 | 14.26 | 317.2 KiB | 854 |
| 9-12 min | 2,642 | 58 ms | 0 | 14.68 | 450.8 KiB | 882 |
| 12-15 min (includes two in-flight completions) | 2,684 | 52 ms | 0 | 14.91 | 587.1 KiB | 895 |

The average `GET /api/products` response grew from 56.5 KiB in the first interval to 587.1 KiB in the final interval because every journey inserted a product and the endpoint returned the full unpaginated catalog. The modest p95 increase is therefore consistent with a growing database and response body. Throughput remained near 15 req/s and the final interval p95 was lower than the 9-12 minute interval, so this run does not show progressive server degradation or a functional failure.

### 1.4.4 Memory interpretation and limitation

The end screenshot directly shows the backend `Node.js JavaScript Runtime` at 69.1 MB. In the middle screenshot, Task Manager was sorted by memory and Node.js was below the lowest visible 154.7 MB process; therefore **less than 154.7 MB is only a conservative captured upper bound**, not an exact continuously sampled peak. The JMeter Java process reached 698.8 MB in the middle capture while the growing catalog responses were being processed. Because Process Explorer, PerfMon or another continuous per-process monitor was not recorded, I do not claim that 69.1 MB is the backend maximum or that 154.7 MB is its actual ceiling.

### 1.4.5 Evidence

- [Raw endurance JTL](./test-plan-human-corrected/results/23127234_Endurance_20260812.jtl)
- [Endurance HTML dashboard](./test-plan-human-corrected/reports/endurance_html/index.html)
- [Start screenshot](./test-plan-human-corrected/evidence/endurancec_start.png)
- [Middle screenshot](./test-plan-human-corrected/evidence/endurance_middle.png)
- [End screenshot](./test-plan-human-corrected/evidence/endurance_end.png)




# Appendices

## Appendix A

- [AI Audit Report](./%5BAI-02%5D%20-%20FIT%40HCMUS%20-%20AI%20Audit%20Report.md)
- [AI Critique](./AI_critique.md)

## Appendix B

[Self-assessment & Test summary report](./README.md)
