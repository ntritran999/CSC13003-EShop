<h1 align='center'>Faculty of Information Technology (FIT) – Ho Chi Minh City University of Science (HCMUS)</h1>
<h3 align='center'>CS423 / CSC13003 – Software Testing (AI-augmented · 2026)</h3>

# 1. Student information

- **Student name (printed):** Trần Trí Nhân
- **Student ID:** 23127097
- **Class / Cohort:** Kiểm thử phần mềm - 23KTPM1
- **Assignment ID:** HW05
- **Assignment date:** 13/08/2026
- **AI tool(s) used:** Claude
- **AI tool(s) used:**
  - [x] Yes
  - [ ] No

# 2. Audit Table

| **(1) Prompt + Tool** | **(2) AI Output** | **(3) Verdict** | **(4) Reasoning** | **(5) Student Fix** |
|---|---|---|---|---|
| Tool: Claude<br>Time: 20:35 10/08/2026<br>Input files: api_specification.md, README.md(only the tech stack and default accounts)<br>Prompt: "Create JMeter test plan(JMeter version 5.6.3, running on Windows 10) for Load Testing on the workflow: POST /api/login -> GET /api/cart -> POST /api/apply-coupon -> POST /api/checkout. Choose realistic and reasonable parameters(like think-time, ramp-up duration, # of VUs, etc, ...). Make the plan data-driven, load the following columns of csv and use them to parameterize the body of requests: email,password,coupon_code,total_amount,shipping_address(don't suggest data, I will prepare myself). Beware of unrealistic ramp-up or think-time, wrong thread counts, weak assertions, etc,..., but make the assertions performance-centric, with basic functional check. Instead of generating a direct JMX file, give me a list of all configurations for the test plan. Keep the test plan simple and fast to run, but still demonstrate the scenario correctly." | [AI's answer for load test plan](./ai-generated/load-test-plan.md) | VALID | The suggested settings for Thread Group were realistic for the scope of the SUT. | None. |
| Tool: Claude<br>Time: 21:02 10/08/2026<br>Input files: api_specification.md, README.md(only the tech stack and default accounts)<br>Prompt: "Create JMeter test plan(JMeter version 5.6.3, running on Windows 10) for Stress Testing on the workflow: POST /api/login -> GET /api/cart -> POST /api/apply-coupon -> POST /api/checkout. Choose realistic and reasonable parameters(like think-time, ramp-up duration, # of VUs, etc, ...). Make the plan data-driven, load the following columns of csv and use them to parameterize the body of requests: email,password,coupon_code,total_amount,shipping_address(don't suggest data, I will prepare myself). Beware of unrealistic and unfit ramp-up or think-time, wrong thread counts, weak assertions, etc,..., but make the assertions stress-test-centric, with basic functional check. Instead of generating a direct JMX file, give me a list of all configurations for the test plan. Keep the test plan simple and fast to run, but still demonstrate the scenario correctly" | [AI's answer for stress test plan](./ai-generated/stress-test-plan.md) | INCOMPLETE | The AI suggested using `"user_id": "${__P(user_id,)}"` in the body of apply-coupon request, which would take the parameter at run time from the CLI instead of using extractor to get the user id directly from the login request's response | Used JSON extractor in the login request to find the user id |
| Tool: Claude<br>Time: 21:32 10/08/2026<br>Input files: api_specification.md, README.md(only the tech stack and default accounts)<br>Prompt: "Create JMeter test plan(JMeter version 5.6.3, running on Windows 10) for Spike Testing on the workflow: POST /api/login -> GET /api/cart -> POST /api/apply-coupon -> POST /api/checkout. Choose realistic and reasonable parameters(like think-time, ramp-up duration, # of VUs, etc, ...). Make the plan data-driven, load the following columns of csv and use them to parameterize the body of requests: email,password,coupon_code,total_amount,shipping_address(don't suggest data, I will prepare myself). Beware of unrealistic and unfit ramp-up or think-time, wrong thread counts, weak assertions, etc,..., but make the assertions spike-test centric, with basic functional check. Instead of generating a direct JMX file, give me a list of all configurations for the test plan. Keep the test plan simple and fast to run, but still demonstrate the scenario correctly." | [AI's answer for spike test plan](./ai-generated/spike-test-plan.md) | INCOMPLETE | The AI missed the user id extraction in the login request and the final amount assertion in the apply-coupon request | Added user id extraction then used the value of the extraction in apply-coupon request instead of defaulting user id to 1. Added final amount assertion in apply-coupon request. |
| Tool: Claude<br>Time: 21:32 10/08/2026<br>Input files: api_specification.md, README.md(only the tech stack and default accounts), load_test.jtl, stress_test.jtl, spike_test.jtl<br>Prompt: "analyse the .jtl logs and suggest performance thresholds. Beware not to misinterprets or misreads the metrics. After that, propose optimizations (e.g., adding a database index, a connection pool, or enabling SQLite WAL). Take a deep breath and think carefully before providing answer. Present your answer in bullet point(rationale + evidence)" | [AI's analysis for the jtl logs](./ai-generated/jtl-logs-analysis.md) | INCOMPLETE | The AI incorrectly suspected that bcrypt was the reason behind the slowness of login request and hallucinated the adding a connection pool proposals when suggesting optimization proposals | Added review section in the main report |

# 3. Summary of AI Accuracy

| **Metric**                               | **Count** | **Percentage** |
| ---------------------------------------- | --------- | -------------- |
| **Total AI-generated artifacts audited** | 4         |                |
| **VALID (correct, accepted as-is)**      | 1         | 25%            |
| **INVALID (wrong; rejected)**            | 0         | 0%             |
| **INCOMPLETE (acceptable after edits)**  | 3         | 75%            |

# 4. Conclusion

In conclusion, Claude did an amazing work of generating JMeter test plans for performance test scenarios in HW05, as well as providing detailed analysis for the jtl logs. The Thread Group settings for the scenarios were realistic for EShop, the assertions inside the requests correctly focused on performance testing instead of functional testing, while being strong enough to detect failures. The suggested thresholds and the optimization proposal were mostly accurate given the test result. However, the AI still made some mistakes while suggesting the request body or missed an assertion for an important field in a request. In task 2, the AI hallucinated an unsuitable proposal to optimize the SUT's performance. In the future, I think I can adjust my prompting technique to get better answers from the AI.

# 5. Mandatory Disclosure

 The test plans and the jtl logs analysis were initially generated by Claude; I reviewed and modified the stress test plan and spike test plan; the test plans review, the suggested performance thresholds and optimization proposals review, and the continuous performance-testing model were written entirely by me. The detailed AI Audit Report is attached as Appendix A. I confirm I did not use AI to generate any artifact listed in the prohibited category.

# Signature

- **Student name (printed):** Trần Trí Nhân
- **Student ID:** 23127097
- **Class / Cohort:** Kiểm thử phần mềm - 23KTPM1
- **Course:** CS423 / CSC13003 – Software Testing
- **Instructor:** Lâm Quang Vũ, Hồ Tuấn Thanh, Trương Phước Lộc
- **Date:** 13/08/2026
- **Signature:**

  ![](./images/signature.png)

# Reference

- Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). A Post-AI Learning Taxonomy.
- Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.
- Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.
- Anthropic (2025). Building reliable AI test agents — engineering blog.
- DeepEval & Promptfoo documentation — testing frameworks for LLM systems.
