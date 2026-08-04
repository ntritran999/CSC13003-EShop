<h1 align="center">Faculty of Information Technology (FIT) - Ho Chi Minh City University of Science (HCMUS)</h1>
<h3 align="center">CS423 / CSC13003 - Software Testing (AI-augmented, 2026)</h3>

# 1. Student information

- **Student name (printed):** Nguyen An Nghiep
- **Student ID:** 23127234
- **Class / Cohort:** Software Testing - 23KTPM1
- **Assignment ID:** HW03
- **Assignment date:** 04/08/2026
- **AI tool used:** OpenAI Codex (GPT-5)
- **AI used:** Yes

# 2. Audit table

| (1) Prompt + Tool | (2) AI Output | (3) Verdict | (4) Reasoning | (5) Student Fix |
|---|---|---|---|---|
| **Interaction 1**<br>**Tool:** OpenAI Codex (GPT-5)<br>**Time:** 16:33 04/08/2026 (UTC+7)<br><br>**Prompt used:**<br>"Create a practical plan for completing HW03 GUI and usability testing on the EMS Scenario D screens D1, D3, and D4. The plan must cover executing all 51 checklist items on each screen, collecting genuine evidence, writing defect reports, completing the 21-cell cross-browser matrix, reconciling findings, and validating the submission. Do not invent test results, screenshots, participants, or Google Form timestamps." | **Plan:**<br>1. Confirm Scenario D scope, accounts, test environment, and the 51-item checklist.<br>2. Prepare safe test data and evidence folders for D1, D3, D4, and Task 3.<br>3. Execute all 51 items on D1, then D3, then D4; record only observed Passed, Failed, or N/A results and explain every N/A.<br>4. Capture evidence for every failure and create one defect report per root cause with steps, expected result, actual result, severity, and suggested fix.<br>5. Execute seven OS/browser/device configurations on each screen, producing 21 distinct screenshots with environment identity.<br>6. Reconcile the execution matrix, detailed reports, findings log, screenshot paths, and real Google Form timestamps.<br>7. Run structural validation, inspect all links and totals, and perform a final manual integrity review. | **INCOMPLETE** | The plan is useful and covers the required workflow, but it cannot prove that any live EMS test was executed. It also cannot supply genuine observations, screenshots, or timestamps. | I used the plan only as a checklist. I personally operated EMS, recorded the real results, captured the screenshots, and supplied the form timestamps. |
| **Interaction 2**<br>**Tool:** OpenAI Codex (GPT-5)<br>**Time:** 15:32 23/07/2026 (UTC+7)<br><br>**Prompt used:**<br>"I independently created this checklist item: 'Users can use the Tab key to sequentially move focus through the navigation bar and use Enter to open items without becoming trapped.' Is mapping it to Nielsen's Flexibility and efficiency of use appropriate? Explain the mapping and identify any important limitation." | **Assessment:** Yes, the mapping is defensible. Keyboard navigation offers an alternative interaction method and can act as an accelerator for experienced users or users who do not use a mouse, which fits **Flexibility and efficiency of use**. However, the phrase "without becoming trapped" is more directly related to maintaining user control and to the accessibility requirement commonly described as "No Keyboard Trap." The item also checks several behaviours at once: focus order, Enter activation, and absence of a trap. If strict atomicity is required, these behaviours should be split into separate checklist items. The checklist idea remains student-authored; AI only reviewed its classification. | **VALID** | The response correctly supports the selected Nielsen mapping while identifying the accessibility and atomicity limitations. It also preserves the student's ownership of GUI-051. | I retained GUI-051 as my own checklist contribution and used the AI response only to verify and qualify the heuristic mapping. |

# 3. Summary of AI accuracy

| Metric | Count | Percentage |
|---|---:|---:|
| Total AI interactions audited | 2 | 100% |
| VALID (correct and accepted) | 1 | 50% |
| INVALID (wrong and rejected) | 0 | 0% |
| INCOMPLETE (useful but required human work) | 1 | 50% |

# 4. Conclusion

OpenAI Codex was effective for organising a large testing assignment and for checking whether a student-authored checklist item had a defensible heuristic mapping. The planning response improved completeness and traceability, but it could not replace execution against the authenticated EMS application. The heuristic response confirmed that keyboard navigation can support Nielsen's Flexibility and efficiency of use while also showing that the no-keyboard-trap requirement has an accessibility and user-control dimension. Human review was therefore necessary for both interactions. I accepted the organisational help, retained ownership of GUI-051, and relied only on direct testing for results and evidence.

# 5. Mandatory disclosure

OpenAI Codex generated the Task 1/Task 3 completion plan and reviewed the heuristic mapping of GUI-051. GUI-051 was conceived and written by Nguyen An Nghiep before the AI review. AI also assisted with organising and wording the audit documents. I personally executed the EMS tests, selected Passed/Failed/N/A results, captured screenshots, and supplied the real Google Form timestamps. AI did not access the authenticated EMS application, conduct user testing, create screenshots, or fabricate results, participants, evidence, or timestamps.

# Signature

- **Student name (printed):** Nguyen An Nghiep
- **Student ID:** 23127234
- **Class / Cohort:** Software Testing - 23KTPM1
- **Course:** CS423 / CSC13003 - Software Testing
- **Date:** 04/08/2026
- **Signature:**

  ![](./images/sign.png)

# Reference

- Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.
- ISTQB Foundation Level Syllabus (latest version).
- Hardman, P. (2025). A Post-AI Learning Taxonomy.
- Fuster Rabella, M. (2025). OECD Education Working Paper No. 338.
- Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.
- Anthropic (2025). Building reliable AI test agents — engineering blog.
- DeepEval & Promptfoo documentation — testing frameworks for LLM systems.

