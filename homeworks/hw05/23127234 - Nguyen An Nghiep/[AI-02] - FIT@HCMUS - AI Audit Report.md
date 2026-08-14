<h1 align="center">Faculty of Information Technology (FIT) - Ho Chi Minh City University of Science (HCMUS)</h1>
<h3 align="center">CS423 / CSC13003 - Software Testing (AI-augmented, 2026)</h3>

# 1. Student information

- **Student name:** Nguyen An Nghiep
- **Student ID:** 23127234
- **Class / Cohort:** Software Testing - 23KTPM1
- **Assignment:** HW05 - Performance Testing
- **Assignment date:** 13/08/2026
- **AI tool used:** Claude Sonnet 5
- **AI used:** Yes

**Declaration:** I use Claude Sonnet 5 to generate the initial JMeter plans, analyse the raw JTL results and create a reusable performance-testing skill. I reviewed its output against the API specification, JMX files, raw JTL files, JMeter dashboards, backend source code and homework requirements. Claude Sonnet 5 did not generate or modify the real execution logs, hardware evidence or screenshots.

## Reconstruction note

The original chat export is not stored in the submission folder. The three prompts below are reconstructed from my interaction notes and the resulting artifacts. They preserve the complete task intent but are not presented as word-for-word transcripts. The dates and times use UTC+7 and correspond to the creation time of the first output artifact from each interaction.

# 2. Audit table

| (1) Prompt + Tool | (2) AI Output | (3) Verdict | (4) Reasoning | (5) Student Fix |
|---|---|---|---|---|
| **Interaction 1**<br>**Tool:** Claude Sonnet 5<br>**Time:** 14:06:07, 12/08/2026 (UTC+7)<br><br>**Prompt:** Read and analyse `api_specification.md`, the Catalog and Inventory workflow documented in `Main_report.md`, and the supplied Performance Testing lecture material. Generate Apache JMeter 5.6.3 test code for Load, Stress and Spike. All plans must execute the same data-driven journey: `POST /api/login`, extract and validate the administrator JWT and role, `GET /api/products`, then `POST /api/products` and validate the created ID. Use `admin_credentials.csv` and `products.csv`. Keep protocol, host, port, data directory, VUs/threads, ramp-up, duration and think-time configurable. Add correlation, assertions, timeouts and failure handling. Use realistic scenario shapes and explain provisional parameters and calibration. Assign Summary Report to Load, Aggregate Report to Stress and Aggregate Graph to Spike, but keep listeners disabled during non-GUI execution. Follow `{StudentID}_{Scenario}_{YYYYMMDD}.jmx`, explain the project structure and give commands that create separate JTL, JMeter log and HTML report paths. Do not fabricate results. | Claude generated three complete XML plans: [Load JMX](./test-plans-ai/23127234_Load_20260812.jmx), [Stress JMX](./test-plans-ai/23127234_Stress_20260812.jmx) and [Spike JMX](./test-plans-ai/23127234_Spike_20260812.jmx). They contained the login-read-create workflow, configurable properties, CSV data, JWT correlation, assertions, think-time, scenario-specific thread groups and distinct report listeners. | **INCOMPLETE** - useful draft, but not safe for formal execution without correction. | The overall workflow and scenario shapes were appropriate, but plausible JMX structure hid five measurement or control-flow problems: the wrong numeric login-failure action, no skip after a failed GET, a Transaction Controller that emitted a synthetic sample, expensive parsing of the growing product list and an assertion that accepted an empty array. | I changed `OnError.action` from `5` to `4`, added GET failure routing, replaced the Transaction Controller with a Simple Controller, replaced full JSON deserialization with a lightweight array-shape check and rejected `[]`. I executed only the corrected [Load](./test-plan-human-corrected/23127234_Load_20260812.jmx), [Stress](./test-plan-human-corrected/23127234_Stress_20260812.jmx) and [Spike](./test-plan-human-corrected/23127234_Spike_20260812.jmx) plans. The corrections are documented in [Main Report Task 1](./Main_report.md#12-human-review-and-correction-of-the-ai-generated-test-plans). |
| **Interaction 2**<br>**Tool:** Claude Sonnet 5<br>**Time:** 14:50:09, 13/08/2026 (UTC+7)<br><br>**Prompt:** Read the Load, Stress and Spike `.jtl` files in `test-plan-human-corrected/results/` and their matching JMeter HTML reports. Follow the Task 2 format in `instruction_plan_hw05.md`. Compare the scenarios; calculate p95/p99 per endpoint; find the sustained Stress breaking point; measure Spike recovery; suggest thresholds; identify resource and payload correlations; and recommend optimizations. Cross-check every important number against the raw JTL and JMeter `statistics.json`. Distinguish requests/s from completed journeys/s, measurements from recommendations, operational recovery from latency recovery, and correlation from causation. Report limitations when CPU/RAM time series do not exist. Produce the AI analysis only because the human review will be completed separately. | Claude produced [AI_Analysis.md](./analysis_result_ai/AI_Analysis.md), including the scenario comparison, all endpoint p95/p99 values, 30-second Stress buckets, Spike phases and recovery buckets, proposed thresholds, payload correlations, optimization recommendations and JTL-versus-dashboard verification. | **INCOMPLETE** - the calculations were mostly accepted, but one recommendation was rejected and one aggregate result required qualification. | Independent recalculation confirmed all nine endpoint percentile pairs, zero errors, the sustained Stress knee between 111 and 121 users, maximum 30-second Stress throughput of 66.40 req/s and failure of the strict Spike latency-recovery target. However, the proposed 70-user normal concurrency was not supported by a sustained run. The Stress aggregate also differed by source: raw total p95/p99 was 3,831/6,370 ms, while the dashboard `Total` row reported 4,172/6,651.99 ms. | I reported only 20 users as a verified sustained operating point and marked 70 users as an unsupported extrapolation. I preserved both Stress aggregate values with their sources instead of silently selecting one. I verified the results against the raw [Load](./test-plan-human-corrected/results/23127234_Load_20260812.jtl), [Stress](./test-plan-human-corrected/results/23127234_Stress_20260812.jtl) and [Spike](./test-plan-human-corrected/results/23127234_Spike_20260812.jtl) files and completed the separate human review in [Main Report Task 2](./Main_report.md#2-task-2---ai-analysis-and-misinterpretation-hunt). |
| **Interaction 3**<br>**Tool:** Claude Sonnet 5<br>**Time:** 17:05:12, 13/08/2026 (UTC+7)<br><br>**Prompt:** Based on the lessons from Task 1 and Task 2, create exactly one `SKILL.md` for Claude. The skill must support two processes. Process 1 reads one or more selected test types, the desired workflow, API specification and CSV data description; it generates one JMX per selected type plus one concise guide explaining VUs, ramp-up, duration, project structure and execution commands. Process 2 reads JTL files and matching JMeter reports, then produces a Task 2-style analysis containing comparisons, endpoint p95/p99, Stress breaking point, Spike recovery, thresholds, resource limitations and optimization assessment. Do not add `Human review of AI statements` because a human will review the AI report later. Include safeguards learned from the corrected plans and verified results. Return only `SKILL.md`. | Claude generated [jmeter-performance-testing/SKILL.md](./jmeter-performance-testing/SKILL.md). It defines both input/output processes, scenario-selection rules, JMX construction requirements, non-GUI execution guidance, JTL calculation rules, sustained Stress-knee logic, Spike recovery separation, Endurance limitations, report verification and final quality checks. | **VALID** - accepted after a packaging-only cleanup. | The skill correctly converted the assignment's lessons into reusable safeguards: avoid unintended synthetic samples, count journeys from the final business sampler, verify JTL values against reports, avoid unsupported resource conclusions and omit the human-review table from Process 2. | I removed generated UI metadata so the deliverable contained exactly one requested `SKILL.md`. I checked its frontmatter, confirmed both processes and output contracts, removed all TODO markers and verified that the skill folder contained only the final file. |

# 3. Summary of AI accuracy

| Metric | Count | Percentage |
|---|---:|---:|
| Total AI interactions audited | 3 | 100% |
| VALID - accepted final output | 1 | 33.3% |
| INCOMPLETE - useful but required human correction | 2 | 66.7% |
| INVALID - fully rejected | 0 | 0% |

# 4. Conclusion

Claude Sonnet 5 accelerated three parts of the assignment: generating the initial JMeter structures, calculating performance metrics and packaging the verified workflow as a reusable skill. Its strongest output was the raw-data analysis because most values could be checked deterministically against the JTL and JMeter report. Its weakest output was the first JMX generation, where plausible XML hid semantic errors in failure routing, sample counting and assertion overhead. I therefore treated AI output as a reviewable draft, executed only corrected plans, preserved real evidence and rejected capacity claims that the completed tests did not establish.

# 5. Mandatory disclosure

Claude Sonnet 5 generated the initial JMX plans, the first Task 2 analysis and the reusable `SKILL.md`. It also assisted with organising this audit report and critique from my three interaction records. I manually reviewed the workflow, corrected the plans, ran JMeter locally, captured the hardware/resource evidence, preserved the raw JTL files, recalculated important values, judged the recommendations and take responsibility for the final submission. No JTL, screenshot, hardware record or execution result was fabricated by AI.

# Signature

- **Student name:** Nguyen An Nghiep
- **Student ID:** 23127234
- **Class / Cohort:** Software Testing - 23KTPM1
- **Course:** CS423 / CSC13003 - Software Testing
- **Date:** 13/08/2026
- **Signature:**

  ![](./images/sign.png)

# References

- Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Microsoft. Playwright documentation.
- Hardman, P. (2025). A Post-AI Learning Taxonomy.
- Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.
- Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.
- Anthropic (2025). Building reliable AI test agents — engineering blog.
