---
name: jmeter-performance-testing
description: Design and generate Apache JMeter JMX plans for one or more Load, Stress, Spike, or Endurance/Soak scenarios from an API workflow, API specification, and CSV data requirements; or analyze raw JTL files and JMeter HTML reports with verified endpoint percentiles, breaking points, recovery, thresholds, correlations, and optimization recommendations. Use when Claude must create data-driven JMeter test code and an execution guide, select performance-test types and workload parameters, or produce a Task 2-style AI performance analysis without a human-review table.
---

# JMeter Performance Testing

Use exactly one of the two processes below, or run them in order when the user requests both. If the requested process is unclear, ask whether the user wants **Process 1: generate test plans** or **Process 2: analyze results**.

Do not invent missing APIs, measurements, hardware limits, results, or resource correlations. Ask only for information that cannot be discovered from the supplied files.

## Process 1: Generate JMeter test plans

### 1. Collect and inspect the inputs

Obtain or locate:

1. The requested test types: **Load**, **Stress**, **Spike**, **Endurance/Soak**, or any combination.
2. The business workflow in its required order, including dependencies between requests.
3. The API specification: methods, paths, request bodies, authentication, expected status codes, and response fields.
4. The CSV data description or samples: filename, headers, encoding, valid rows, recycling rules, and which request uses each column.
5. The target protocol, host, port, environment, SLOs, and any known capacity or hardware limits.
6. Authentication/correlation requirements such as JWT extraction, roles, IDs, or values reused by later requests.

Infer test types from the goal only when the user has not named them:

- Choose **Load** for expected normal traffic and SLO validation.
- Choose **Stress** to find the latency, error, or throughput breaking point.
- Choose **Spike** for sudden traffic and recovery behavior.
- Choose **Endurance/Soak** for stability, drift, sustained RPS, and resource ceilings.

If several types are selected, generate one JMX file per type. Keep the business workflow identical across plans unless the user explicitly requires otherwise; vary only the workload model.

Before generating code, reconcile the workflow with the API specification. Flag contradictions such as a wrong path, undocumented field, missing authentication, or response extraction that later steps cannot use.

### 2. Select and explain workload parameters

Use the user's calibrated values when available. Otherwise label all proposed values as **provisional** and include calibration instructions; never present arbitrary virtual-user counts as measured hardware capacity.

Use these terms consistently:

| Parameter | Meaning |
|---|---|
| Threads or VUs | Concurrent virtual users. |
| Ramp-up | Time used to start the target VUs gradually. |
| Duration | Total scheduled test time. |
| Startup delay | Delay before a thread group begins, mainly for Spike. |
| Think-time | User pause between business actions. |
| `C` | Approximate concurrency at the sustained Stress knee. |
| `L` | Normal Load level, usually about 50-70% of calibrated `C`. |
| `E` | Endurance level, usually about 70-80% of the highest stable concurrency. |

When calibration data does not exist, recommend short trials such as 1, 5, 10, 20, 40, and 80 VUs. Stop increasing when p95 breaches its target, errors exceed the limit, throughput stops growing, the backend saturates, or JMeter becomes the bottleneck.

Apply these scenario shapes after calibration:

- **Load:** standard Thread Group at `L`, gradual ramp-up, and a steady measurement period.
- **Stress:** continuously ramp toward roughly `2 * C`, then hold briefly to distinguish an isolated spike from sustained degradation.
- **Spike:** a small baseline Thread Group plus a separate surge Thread Group with startup delay, rapid ramp-up, fixed surge duration, and post-surge observation.
- **Endurance:** steady Thread Group at `E` for about 10-15 minutes unless the user requests a longer soak.

Freeze acceptance targets before formal execution. If the user has none, propose configurable starting targets and label them as recommendations, not measurements. A reasonable starting contract is overall p95 below 800 ms, overall p99 below 1,500 ms, error rate below 1%, and endpoint-specific p95 limits derived from business importance.

### 3. Generate each JMX file

Generate valid Apache JMeter 5.6.3 XML. Use a filename supplied by the user; otherwise use `<project>_<Scenario>_<YYYYMMDD>.jmx`.

Build every plan with these rules:

1. Define configurable properties with `__P`, including protocol, host, port, data directory, threads, ramp-up, duration, think-time, and scenario-specific delays.
2. Add HTTP Request Defaults, UTF-8, keep-alive, and explicit connect/response timeouts.
3. Add one CSV Data Set Config per input file. Use headers as variables and document whether data recycles or stops threads at EOF.
4. Execute the complete workflow inside each iteration. Do not place login in a Once Only Controller when every journey must authenticate.
5. Use a **Simple Controller** for organization. Do not use a Transaction Controller unless the user explicitly needs a synthetic transaction sample; synthetic rows distort HTTP totals.
6. Extract tokens and dependent IDs from real responses. Attach the required Authorization or correlation values to downstream requests.
7. Assert expected HTTP status, content type, required response fields, role, and business outcome. Avoid expensive full-response parsing in high-load loops when a lightweight assertion is sufficient.
8. After a failed prerequisite such as login or catalog read, use a Result Status Action Handler to start the next thread loop and prevent invalid dependent requests.
9. Apply realistic think-time before user actions, not before technical setup elements.
10. Give HTTP samplers stable ordered labels such as `01_Login`, `02_Get_Products`, and `03_Create_Product`.
11. Keep GUI listeners disabled during execution. If distinct views are required, assign Summary Report to Load, Aggregate Report to Stress, and Aggregate Graph to Spike, but treat the CLI JTL as the authoritative result.
12. Ensure the formal JTL contains only real HTTP samplers unless a deliberate transaction metric is documented.

For Spike, duplicate the same workflow under both baseline and surge Thread Groups. Make their names unambiguous so the JTL can separate phases by `threadName`.

Check the generated XML for well-formedness and confirm every property, CSV variable, extractor reference, thread group, sampler, timer, and assertion is reachable and correctly scoped.

### 4. Return the Process 1 files

Return:

- **One JMX per selected test type.** If the user selects Load, Stress, and Spike, return three JMX files.
- **Exactly one `TEST_EXECUTION_GUIDE.md`** covering all generated plans.

Keep the execution guide concise and include:

1. Selected scenarios and why each was chosen.
2. Workflow-to-endpoint mapping.
3. A parameter table explaining VUs, ramp-up, duration, delays, think-time, and SLOs.
4. This recommended structure, adjusted to the project:

```text
performance-tests/
├── test-plans/
├── test-data/
├── results/
├── reports/
├── logs/
└── evidence/
```

5. Smoke and calibration steps before formal runs.
6. One non-GUI command per plan, following this pattern:

```text
jmeter -n -t test-plans/<plan>.jmx \
  -Jprotocol=http -Jhost=localhost -Jport=3000 \
  -Jdata_dir=test-data \
  -l results/<unique-run>.jtl \
  -j logs/<unique-run>-jmeter.log \
  -e -o reports/<unique-run>/
```

7. Instructions to restart/reseed the backend before every formal scenario and every repeated run when the workflow mutates shared data.
8. Instructions to use unique JTL, report, and JMeter-log paths. Never reuse a non-empty HTML report directory or overwrite another scenario's evidence.
9. Instructions to capture synchronized backend and injector CPU/RAM data when resource conclusions are required.

Do not run a destructive database reset unless the user has explicitly authorized it. Describe the reset step when authorization is absent.

## Process 2: Analyze JTL and JMeter report results

### 1. Collect and identify the artifacts

Obtain or locate:

1. One or more raw `.jtl` files.
2. The matching JMeter HTML report folders, especially `statistics.json`.
3. The corresponding JMX files when phase timing or thread-group intent is not obvious.
4. Frozen SLOs and recovery rules, if they exist.
5. Timestamped backend/injector resource logs or screenshots, if resource analysis is requested.
6. Backend source code when judging optimization feasibility.

Infer each scenario from its filename, `threadName`, timing, and JMX configuration. Ask when the mapping remains ambiguous. Analyze only the supplied scenarios; do not fabricate comparison rows for missing test types.

### 2. Validate the raw data before interpreting it

Treat the JTL as authoritative for row-level calculations. Check:

- headers and parseability;
- sample labels and unexpected synthetic controller rows;
- row counts per endpoint;
- response codes, `success`, and assertion failure messages;
- first timestamp, last completion time, duration, and maximum observed threads;
- whether JTL counts agree with `statistics.json`.

Calculate scenario duration as:

```text
max(timeStamp + elapsed) - min(timeStamp)
```

Calculate per endpoint and overall:

- samples and errors;
- error percentage;
- average, median, p90, p95, p99, and maximum elapsed time;
- HTTP requests/second;
- completed journeys/second using the final successful business sampler, not total requests divided blindly by the number of endpoints.

Use a percentile method that reproduces the JMeter report for the same label. Record the method. If the raw calculation and JMeter report disagree, preserve both values in a verification table and explain which source is used; do not silently choose one.

### 3. Perform only the applicable scenario analyses

#### Load

Compare overall and endpoint p95/p99, errors, request throughput, and journey throughput with the frozen targets. State pass/fail without treating the average as the SLO.

#### Stress

Build 30-second buckets containing maximum/representative active threads, samples, requests/s, completed journeys/s, p95, p99, and errors. Identify a breaking point only when degradation is sustained, such as:

- p95 rises sharply and remains above its target;
- throughput plateaus or falls while concurrency rises;
- errors exceed the limit;
- timeouts, database failures, or a backend crash appear.

Do not call one isolated slow bucket the breaking point if the next bucket recovers. If the highest tested load remains stable, report that the breaking point was not found.

#### Spike

Derive the pre-spike, surge, and post-spike phases from actual timestamps and thread-group names. Report phase samples, threads, throughput, p95/p99, errors, and dropped/timed-out requests. Analyze post-spike behavior in time buckets.

Separate:

- **Operational recovery:** concurrency, throughput, error-free operation, and backend availability return.
- **Latency recovery:** post-spike p95 returns to the predeclared threshold, such as within 20% of baseline within 60 seconds.

Never claim immediate recovery from thread count or zero errors alone.

#### Endurance/Soak

Use equal time buckets, normally three minutes for a 15-minute run. Report p95 drift, errors, sustained requests/s, journey throughput, response-size growth, and any resource trend.

A single stable low-load soak proves only a stable operating point and a lower bound. Do not call it the maximum stable RPS or memory ceiling unless higher loads were tested and backend memory was continuously measured.

### 4. Analyze thresholds, correlations, and optimizations

Recommend future thresholds without retroactively changing the rules used for the completed run. Distinguish absolute SLOs from relative regression thresholds.

For resource correlations:

- Use JTL `bytes`, concurrency, timing, and latency for payload/concurrency associations.
- Require synchronized measurements for CPU, RAM, disk, event-loop delay, or JMeter saturation.
- Do not claim a memory leak from a screenshot or from a growing response body.
- State that correlation does not establish causation when concurrency, elapsed time, and payload grow together.

Classify optimization proposals as **Feasible**, **Feasible but must benchmark**, **Questionable**, **Mostly ineffective**, or **Possibly hallucinated**. Verify source code before claiming that an index, connection pool, cache, WAL mode, pagination, or database migration solves the measured bottleneck.

### 5. Return the Process 2 report

Return one file named `AI_Analysis.md` by default. Use this Task 2-style structure and omit scenario subsections that are not applicable:

```text
# Task 2 - AI performance analysis
## 2.1 Analysis sources and verification method
## 2.2 Scenario comparison and endpoint p95/p99
## 2.3 Scenario-specific findings
### Load result
### Stress breaking point
### Spike recovery
### Endurance threshold
## 2.4 Suggested thresholds and resource correlations
## 2.5 Optimization assessment
## 2.6 JTL versus JMeter-report verification
## 2.7 Conclusion
```

Use concrete tables and cite the source JTL/report paths. Explicitly distinguish:

- requests/second from completed journeys/second;
- raw-JTL totals from dashboard totals;
- measured values from recommendations;
- operational recovery from latency recovery;
- observed correlations from unproven causes.

Do **not** add a section named `Human review of AI statements`, a `Why AI was wrong` table, or any claim that a human verified the report. Process 2 is the AI analysis that a human may review later.

## Final quality checks

Before returning either process:

- Verify every generated or cited local path.
- Keep scenario names, filenames, labels, units, and counts consistent.
- Do not call HTTP throughput users/second.
- Do not infer errors when all JTL rows are successful.
- Do not infer resource causes without synchronized evidence.
- Do not describe untested concurrency as stable capacity.
- Surface report/JTL discrepancies instead of hiding them.
- State limitations briefly and precisely.
