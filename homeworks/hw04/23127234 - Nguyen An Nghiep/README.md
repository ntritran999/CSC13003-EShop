# HW04 – Automation Testing

**Student:** Nguyen An Nghiep  
**Student ID:** 23127234

## 1. Self-assessment

| No. | Criteria | Maximum grade | Self-assessed grade |
|:---:|---|---:|---:|
| 1a | Task 1 – Feature A: FR-03 Forgot/Reset Password | 25 | 25 |
| 1b | Task 1 – Feature B: FR-10 Order State Machine | 25 | 25 |
| 1c | Task 1 – Feature C: FR-15 Product CRUD | 25 | 25 |
| 2 | Task 2 – Demo video | 15 | 15 |
| 3 | Task 3 – Agent skill | 10 | 10 |
|  | **Total** | **100** | **100** |

## 2. Test summary report

All 53 logical test cases were executed on Chromium, Firefox, and WebKit. This produced 159 browser executions across nine feature-browser runs and nine HTML reports.

| Feature | Unique automated cases | Browser executions | Passed | Failed | Browser runs / HTML reports |
|---|---:|---:|---:|---:|---:|
| FR-03 – Forgot/Reset Password | 17 | 51 | 21 | 30 | 3 |
| FR-10 – Order State Machine | 13 | 39 | 30 | 9 | 3 |
| FR-15 – Product CRUD | 23 | 69 | 40 | 29 | 3 |
| **Total** | **53** | **159** | **91** | **68** | **9** |

- Features automated: 3
- Unique test cases automated and completed: 53
- Browser executions passed: 91
- Browser executions failed: 68
- Browser coverage: Chromium, Firefox, and WebKit
- Number of observed potential bugs (failed-result groups): 15 (4 for FR-03, 3 for FR-10, and 8 for FR-15; these are not deduplicated bug tickets)
- Final execution date: 2026-08-07
- Demo video: [YouTube](https://youtu.be/iOSycIAlb-c)

## 3. Reports and deliverables

- [Main report](./Main_report.md)
- [FR-03 Chromium report](./playwright/test-report/fr03/chromium/index.html), [Firefox report](./playwright/test-report/fr03/firefox/index.html), [WebKit report](./playwright/test-report/fr03/webkit/index.html)
- [FR-10 Chromium report](./playwright/test-report/fr10/chromium/index.html), [Firefox report](./playwright/test-report/fr10/firefox/index.html), [WebKit report](./playwright/test-report/fr10/webkit/index.html)
- [FR-15 Chromium report](./playwright/test-report/fr15/chromium/index.html), [Firefox report](./playwright/test-report/fr15/firefox/index.html), [WebKit report](./playwright/test-report/fr15/webkit/index.html)
- [Agent skill](./agents/SKILL.md)
- [AI audit report](<./[AI-02] - FIT@HCMUS - AI Audit Report.md>)
- [AI critique](./AI_critique.md)
