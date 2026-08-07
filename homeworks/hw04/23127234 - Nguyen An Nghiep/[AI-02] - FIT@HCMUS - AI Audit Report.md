<h1 align="center">Faculty of Information Technology (FIT) - Ho Chi Minh City University of Science (HCMUS)</h1>
<h3 align="center">CS423 / CSC13003 - Software Testing (AI-augmented, 2026)</h3>

# 1. Student information

- **Student name (printed):** Nguyen An Nghiep
- **Student ID:** 23127234
- **Class / Cohort:** Software Testing - 23KTPM1
- **Assignment ID:** HW04
- **Assignment date:** 07/08/2026
- **AI tool used:** Claude
- **AI used:** Yes

# 2. Audit table

| (1) Prompt + Tool | (2) AI Output | (3) Verdict | (4) Reasoning | (5) Student Fix |
|---|---|---|---|---|
| **Interaction 1**<br>**Tool:** Claude<br>**Time:** 06/08/2026 (UTC+7; exact time not recorded)<br><br>**Prompt used:**<br>"Read and analyse the reference HW04 Playwright folder, then complete my HW04 for FR-03 Forgot/Reset Password, FR-10 Order State Machine, and FR-15 Product CRUD. Keep the implementation simple, use TypeScript, and store test data in CSV files like the reference student. Configure Chromium, Firefox, and WebKit and generate separate reports with my student ID." | **Old AI-generated version:**<br>- Created `fr03.password-reset.spec.ts`, `fr10.order-state.spec.ts`, and `fr15.product-crud.spec.ts`.<br>- Created three external CSV files and a feature/browser report runner.<br>- Configured Chromium, Firefox, and WebKit with separate HTML report folders.<br>- Produced 50 logical testcases and 150 browser executions.<br><br>However, the generated code included an FR-10 branch that never performed its named action, positional selectors, a swallowed 1.5-second FR-15 response timeout, incomplete Product CRUD assertions/cleanup, generic FR-03 password evidence, and no Product CRUD authorization cases. | **INVALID** | The output was runnable but was not acceptable as the final solution. TC_FR10_06 returned without clicking Cancel, so it did not test the required transition. FR-15 could confuse no request with a slow request, relied on menu/button positions, did not explicitly apply and verify every important CSV field, and did not prove cleanup. FR-03 overclaimed rule-specific password coverage from one generic error. Missing authorization cases also left a serious server-side gap. | I critically reviewed and rewrote the old version. I made selectors semantic and row-scoped, made TC_FR10_06 perform the real action workflow, replaced the swallowed timeout with deterministic synchronization, added verified pre-clean/cleanup, strengthened FR-15 field/category assertions, documented the FR-03 oracle limitation, and added TC_FR15_21–23 for authorization. I reran all nine feature-browser combinations sequentially. The final suite contains 53 logical cases, 159 executions, 91 passed and 68 failed, with the failures retained as SUT evidence. |
| **Interaction 2**<br>**Tool:** Claude<br>**Time:** 15:03 07/08/2026 (UTC+7)<br><br>**Prompt used:**<br>"Write only `SKILL.md` for me to put into Claude. The skill must guide an agent through reading feature requirements and testcase tables; producing external data schemas; inspecting UI selectors; generating Playwright tests in small groups; configuring three browsers and report metadata; reviewing selectors, waits, assertions, isolation, and cleanup; classifying failures; and producing a report checklist. Input will be testcases with `Test ID, Objective, Preconditions, Input, Test Steps, Expected Result, Actual Result`, plus the testing flow and browser list. Communication is copy-paste through a website, and the final automation files must use TypeScript." | **Accepted `agents/SKILL.md`:**<br>- Defines a copy-paste-only operating model and prohibits fabricated inspection or execution claims.<br>- Normalizes the required testcase-table format and creates traceability.<br>- Designs and validates external CSV schemas.<br>- Requests real UI/DOM/network evidence before finalizing selectors.<br>- Generates TypeScript Playwright tests in small, reviewable groups.<br>- Configures multi-browser projects, report identity, and sequential stateful runs.<br>- Reviews selectors, synchronization, assertions, isolation, and cleanup.<br>- Classifies failures and supplies bug/report/completion checklists.<br>- Produces only the requested single skill file. | **VALID** | The response directly satisfies the Agent Skill requirement and the website-only communication constraint. It incorporates the concrete lessons from the rejected coding draft, requires human evidence before final selectors, prevents claims of unexecuted reports, and gives a reusable end-to-end automation workflow. Its final output is one self-contained skill with valid `name` and `description` frontmatter. | I reviewed the skill, confirmed that it covers the required HW04 workflow, and retained it as `agents/SKILL.md`. No technical correction to the skill content was required. I remain responsible for applying it, reviewing future generated scripts, and executing tests locally. |

# 3. Summary of AI accuracy

| Metric | Count | Percentage |
|---|---:|---:|
| Total AI interactions audited | 2 | 100% |
| VALID (correct and accepted) | 1 | 50% |
| INVALID (wrong and rejected) | 1 | 50% |
| INCOMPLETE (useful but required human work) | 0 | 0% |

# 4. Conclusion

Claude was useful for rapidly producing a data-driven Playwright structure and for turning the lessons of the assignment into a reusable Agent Skill. However, the first interaction demonstrated that runnable automation is not automatically valid automation. The old scripts contained a testcase that never executed its main action, fragile selectors, weak synchronization, incomplete assertions and cleanup, and missing authorization coverage. I therefore rejected that version and treated it only as a draft. After human review and correction, the final suite increased from 50 to 53 logical cases and exposed additional real defects without changing correct expected results merely to make tests pass. The second interaction was accepted because the requested skill explicitly guards against those mistakes, works through copy-paste evidence, and never claims that generated code has been executed. The two outcomes show that AI is most reliable when its scope, evidence requirements, completion gates, and human-review responsibilities are made explicit.

# 5. Mandatory disclosure

Claude generated the initial HW04 Playwright draft and later generated the reusable automation skill. The initial code response was rejected as the final submission after critical review. I corrected the final test scripts and data, reviewed the assertions and selectors, added missing coverage, and take responsibility for the final suite and expected results. The HTML reports contain real Playwright execution evidence from the local SUT; they were not fabricated as text or images. AI also assisted with organising and wording the audit documents. The accepted skill is guidance for future AI collaboration and does not replace human review or local test execution.

# Signature

- **Student name (printed):** Nguyen An Nghiep
- **Student ID:** 23127234
- **Class / Cohort:** Software Testing - 23KTPM1
- **Course:** CS423 / CSC13003 - Software Testing
- **Date:** 07/08/2026
- **Signature:**

  ![](./images/sign.png)

# Reference

- Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Microsoft. Playwright documentation.
- Hardman, P. (2025). A Post-AI Learning Taxonomy.
- Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.
- Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.
- Anthropic (2025). Building reliable AI test agents — engineering blog.
