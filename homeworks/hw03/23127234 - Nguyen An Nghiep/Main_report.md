<h3 align='center'>UNIVERSITY OF SCIENCE, VNUHCM</h3>
<h3 align='center'>FACULTY OF INFORMATION TECHNOLOGY</h3>
<br>
<p align='center'><img src='./images/logo.png' width=50% height=50%></p>

<h3 align='center'>SOFTWARE TESTING</h3>
<h4 align='center'>HW03 – GUI & Usability Testing on EMS (Event Management System)</h4>

<br>
<br>
<br>

# 1. Student information

| Field | Value |
|---|---|
| Student name | Nguyen An Nghiep |
| Student ID | 23127234 |
| Class / Cohort | Software Testing - 23KTPM1 |
| Assignment date | 3/8/2026 |
| System under test | <https://prod-dev.ems-fitus.cloud/login> |

# 2. Scope and rationale

## 2.1 Chosen scenario

Scenario D - User requests Support and Admin resolves it.

## 2.2 Primary screens

| Code | Screen | Rationale |
|---|---|---|
| D1 | User - Create Support Request with image attachment | Exercises labels, required fields, validation, upload feedback, form persistence, keyboard access, and submission feedback. |
| D3 | Admin - Support Requests list | Exercises Pending/Resolved tabs, search, filters, loading/empty states, pagination, status colours, and navigation. |
| D4 | Admin - Request detail | Exercises deep links, image lightbox, internal notes, official responses, resolution state, confirmations, and success/error feedback. |

D2 - User My Support requests/detail is used as a supporting screen to verify that the `RESOLVED` status and official response created on D4 are visible to the request owner.

The selection avoids duplicating the group members' Scenario A and B packages and creates a repeatable end-to-end support lifecycle using data created by the tester.

## 2.3 Test accounts and environment

| Purpose | Account identifier | Role | Environment |
|---|---|---|---|
| Create and verify the request | 23127234@student.hcmus.edu.vn | STUDENT | EMS prod-dev environment; Windows 11; Microsoft Edge; desktop; tested 03/08/2026 |
| Search and resolve the request | admin@gmail.com | ADMIN | EMS prod-dev environment; Windows 11; Microsoft Edge; desktop; tested 03/08/2026 |

## 2.4 Documented functional oracle

The student manual is used only to establish expected Support behaviour. Passed/Failed results still come from direct observation of the live SUT.

| Screen | Documented expectation |
|---|---|
| D1 | Category is one of SUPPORT, COMPLAINT, CONTACT, or OTHER. A request includes Title and Description and may include up to five images, each no larger than 5 MB. After successful submission, it appears in My Support requests with status PENDING. |
| D2 | The student can search personal requests by Title or Description, filter by All statuses/PENDING/RESOLVED, open the request detail, view attachments, and read the official Admin response. A new issue is submitted as a new request rather than editing a resolved one. |
| D3/D4 | The assignment defines Pending/Resolved administration, search, request detail, image lightbox, internal note, and official response. The current lifecycle uses PENDING and RESOLVED; APPROVED/REJECTED may occur only in legacy data. |

# 3. Test approach

- Shared checklist: [EMS GUI Checklist](./EMS_GUI_Checklist_reviewed.md).
- Checklist version/commit: your value.
- Execution date and time: your value.
- Base browser and OS for Task 1: your value.
- Test-data prefix: `HW03-23127234-your value`.
- Evidence directory: `images/task1b/`.
- Result values: `Passed`, `Failed`, or `N/A` with a mandatory applicability reason.
- A failed result must include expected result, actual result, reproduction steps, severity, and a screenshot reference.

# 4. Task 1B - GUI checklist execution

## 4.1 Execution matrix

Replace every `your value` cell after executing the real software. For N/A, write why the control or state does not exist on that screen.

| Item ID | Short description | D1 Result | D1 Notes/evidence | D3 Result | D3 Notes/evidence | D4 Result | D4 Notes/evidence |
|---|---|---|---|---|---|---|---|
| GUI-001 | Consistent font family | your value | your value | your value | your value | your value | your value |
| GUI-002 | Consistent primary-action colour | your value | your value | your value | your value | your value | your value |
| GUI-003 | Alignment; no overlap or clipping | your value | your value | your value | your value | your value | your value |
| GUI-004 | Complete EN/VI translation | your value | your value | your value | your value | your value | your value |
| GUI-005 | Explicit empty state | your value | your value | your value | your value | your value | your value |
| GUI-006 | Loading indicator | your value | your value | your value | your value | your value | your value |
| GUI-007 | Legible text contrast | your value | your value | your value | your value | your value | your value |
| GUI-008 | Labels/tooltips for icon controls | your value | your value | your value | your value | your value | your value |
| GUI-009 | Consistent date/time format | your value | your value | your value | your value | your value | your value |
| GUI-010 | Consistent status badge colour | your value | your value | your value | your value | your value | your value |
| GUI-011 | Visible page title/header | your value | your value | your value | your value | your value | your value |
| GUI-012 | No placeholder/debug text | your value | your value | your value | your value | your value | your value |
| GUI-013 | Required-field indicators | your value | your value | your value | your value | your value | your value |
| GUI-014 | Persistent associated labels | your value | your value | your value | your value | your value | your value |
| GUI-015 | Error beside relevant field | your value | your value | your value | your value | your value | your value |
| GUI-016 | Specific corrective error message | your value | your value | your value | your value | your value | your value |
| GUI-017 | Empty required submission blocked | your value | your value | your value | your value | your value | your value |
| GUI-018 | Invalid end-before-start rejected | your value | your value | your value | your value | your value | your value |
| GUI-019 | Upload type/size declared | your value | your value | your value | your value | your value | your value |
| GUI-020 | Image preview before submission | your value | your value | your value | your value | your value | your value |
| GUI-021 | Image aspect ratio enforced/warned | your value | your value | your value | your value | your value | your value |
| GUI-022 | Rich-text toolbar state feedback | your value | your value | your value | your value | your value | your value |
| GUI-023 | Data retained after failed submit | your value | your value | your value | your value | your value | your value |
| GUI-024 | Disabled submit visually distinct | your value | your value | your value | your value | your value | your value |
| GUI-025 | Active sidebar/menu indication | your value | your value | your value | your value | your value | your value |
| GUI-026 | Accurate breadcrumb | your value | your value | your value | your value | your value | your value |
| GUI-027 | Back/Return without unintended loss | your value | your value | your value | your value | your value | your value |
| GUI-028 | Selected tab distinguished | your value | your value | your value | your value | your value | your value |
| GUI-029 | Tab content fully replaced | your value | your value | your value | your value | your value | your value |
| GUI-030 | Exact record opens from deep link | your value | your value | your value | your value | your value | your value |
| GUI-031 | Visible drag handle | your value | your value | your value | your value | your value | your value |
| GUI-032 | Reorder persists after refresh | your value | your value | your value | your value | your value | your value |
| GUI-033 | Search available on list screen | your value | your value | your value | your value | your value | your value |
| GUI-034 | Search and filters clearly separated | your value | your value | your value | your value | your value | your value |
| GUI-035 | Unsaved-change warning | your value | your value | your value | your value | your value | your value |
| GUI-036 | Pagination/current totals visible | your value | your value | your value | your value | your value | your value |
| GUI-037 | Success feedback | your value | your value | your value | your value | your value | your value |
| GUI-038 | Failure feedback | your value | your value | your value | your value | your value | your value |
| GUI-039 | Destructive-action confirmation | your value | your value | your value | your value | your value | your value |
| GUI-040 | Confirmation names action/target | your value | your value | your value | your value | your value | your value |
| GUI-041 | Notification badge updates | your value | your value | your value | your value | your value | your value |
| GUI-042 | Progress percentage is accurate | your value | your value | your value | your value | your value | your value |
| GUI-043 | Status colour consistent across screens | your value | your value | your value | your value | your value | your value |
| GUI-044 | Real-time logs update without refresh | your value | your value | your value | your value | your value | your value |
| GUI-045 | Current record state always visible | your value | your value | your value | your value | your value | your value |
| GUI-046 | Administrative action creates audit entry | your value | your value | your value | your value | your value | your value |
| GUI-047 | Export/download feedback | your value | your value | your value | your value | your value | your value |
| GUI-048 | Async button blocks duplicate submission | your value | your value | your value | your value | your value | your value |
| GUI-049 | Consistent body-text colour hierarchy | your value | your value | your value | your value | your value | your value |
| GUI-050 | Accessible interactive date/time picker | your value | your value | your value | your value | your value | your value |
| GUI-051 | Tab/Enter navigation without trap | your value | your value | your value | your value | your value | your value |

## 4.2 Execution totals

| Screen | Passed | Failed | N/A | Total |
|---|---:|---:|---:|---:|
| D1 | your value | your value | your value | 51 |
| D3 | your value | your value | your value | 51 |
| D4 | your value | your value | your value | 51 |
| **Total** | **your value** | **your value** | **your value** | **153** |

## 4.3 Detailed defect reports

Duplicate this section for each unique Task 1 finding. Do not create a separate bug when several checklist items have the same root cause.

### Finding your value - your value

- Finding ID: your value
- Screen: your value
- Related checklist item(s): your value
- Type: your value
- Preconditions: your value
- Steps to reproduce:
  1. your value
  2. your value
  3. your value
- Expected result: your value
- Actual result: your value
- Severity: your value
- Suggested fix: your value
- Screenshot: `your value`
- Google Form submission timestamp: your value

# 5. Task 2 - Five-user usability study

Task 2 was not performed. No participant identities, contacts, observations, recordings, task-success values, timings, errors, hesitation counts, SUS/UEQ-S responses, or usability-study findings were fabricated. Self-assessed score: 0/25.

# 6. Task 3 - Cross-browser and cross-platform testing

## 6.1 Method

- Execution date: your value.
- Tool/device source: your value.
- Email overlay: `23127234@student.hcmus.edu.vn`.
- Each screenshot must show the EMS URL, email overlay, OS, browser, and device class/name.
- Evidence directory: `images/task3/`.
- A failure note must name the visible defect, not merely say that the design is poor.

## 6.2 D1 - Create Support Request

| ID | OS | Browser | Device class | Result | Note/Defect ID | Screenshot |
|---|---|---|---|---|---|---|
| 01 | Windows | Chrome | Desktop | your value | your value | `images/task3/T3_D1_Windows_Chrome_Desktop.png` |
| 02 | Windows | Edge | Desktop | your value | your value | `images/task3/T3_D1_Windows_Edge_Desktop.png` |
| 03 | Windows | Firefox | Desktop | your value | your value | `images/task3/T3_D1_Windows_Firefox_Desktop.png` |
| 04 | Windows | Opera | Desktop | your value | your value | `images/task3/T3_D1_Windows_Opera_Desktop.png` |
| 05 | iOS | Safari | Phone | your value | your value | `images/task3/T3_D1_iOS_Safari_Phone.png` |
| 06 | Android | Chrome | Phone | your value | your value | `images/task3/T3_D1_Android_Chrome_Phone.png` |
| 07 | Android | Firefox | Tablet | your value | your value | `images/task3/T3_D1_Android_Firefox_Tablet.png` |

## 6.3 D3 - Support Requests List

| ID | OS | Browser | Device class | Result | Note/Defect ID | Screenshot |
|---|---|---|---|---|---|---|
| 01 | Windows | Chrome | Desktop | your value | your value | `images/task3/T3_D3_Windows_Chrome_Desktop.png` |
| 02 | Windows | Edge | Desktop | your value | your value | `images/task3/T3_D3_Windows_Edge_Desktop.png` |
| 03 | Windows | Firefox | Desktop | your value | your value | `images/task3/T3_D3_Windows_Firefox_Desktop.png` |
| 04 | Windows | Opera | Desktop | your value | your value | `images/task3/T3_D3_Windows_Opera_Desktop.png` |
| 05 | iOS | Safari | Phone | your value | your value | `images/task3/T3_D3_iOS_Safari_Phone.png` |
| 06 | Android | Chrome | Phone | your value | your value | `images/task3/T3_D3_Android_Chrome_Phone.png` |
| 07 | Android | Firefox | Tablet | your value | your value | `images/task3/T3_D3_Android_Firefox_Tablet.png` |

## 6.4 D4 - Request Detail and Resolution

| ID | OS | Browser | Device class | Result | Note/Defect ID | Screenshot |
|---|---|---|---|---|---|---|
| 01 | Windows | Chrome | Desktop | your value | your value | `images/task3/T3_D4_Windows_Chrome_Desktop.png` |
| 02 | Windows | Edge | Desktop | your value | your value | `images/task3/T3_D4_Windows_Edge_Desktop.png` |
| 03 | Windows | Firefox | Desktop | your value | your value | `images/task3/T3_D4_Windows_Firefox_Desktop.png` |
| 04 | Windows | Opera | Desktop | your value | your value | `images/task3/T3_D4_Windows_Opera_Desktop.png` |
| 05 | iOS | Safari | Phone | your value | your value | `images/task3/T3_D4_iOS_Safari_Phone.png` |
| 06 | Android | Chrome | Phone | your value | your value | `images/task3/T3_D4_Android_Chrome_Phone.png` |
| 07 | Android | Firefox | Tablet | your value | your value | `images/task3/T3_D4_Android_Firefox_Tablet.png` |

## 6.5 Compatibility summary

| Metric | Value |
|---|---:|
| Planned cells | 21 |
| Executed cells | your value |
| Passed | your value |
| Failed | your value |
| Unique compatibility findings | your value |

# 7. Bug and usability findings reconciliation

- Aggregated log: [Bug & Usability Findings Log](./Bug%20%26%20Usability%20Findings%20Log.md).
- Total unique findings in report: your value.
- Total unique findings in aggregated log: your value.
- Total Google Form submissions: your value.
- Reconciliation result: your value.

# 8. Agent Skill

- Skill name: `ems-gui-test`.
- Source: [SKILL.md](./skills/ems-gui-test/SKILL.md).
- Purpose: prepare and validate checklist execution, evidence references, compatibility coverage, and findings-log completeness without inventing results.
- Validation command/result: your value.
- Demonstration video: your value.

# 9. AI usage

- AI tools used: your value.
- Complete interaction log: [AI Audit Report](./AI_Audit_Report.md).
- AI critique: [AI Critique](./AI_critique.md).

# 10. Conclusion

The tested Scenario D support lifecycle produced `your value` Passed results, `your value` Failed results, and `your value` N/A results across 153 checklist executions. Cross-platform testing executed `your value` of 21 planned cells and identified `your value` unique compatibility findings. The highest-priority observed risk was `your value`. Task 2 was not performed and no user-study data was fabricated.

# Appendices

- Appendix A - [Execution instructions](./instruction_hw3.md)
- Appendix B - [Shared checklist](./EMS_GUI_Checklist_reviewed.md)
- Appendix C - [Reference sources](./GUI_Checklist_Reference_Sources.md)
- Appendix D - [Shared AI prompts](./GUI_Checklist_AI_Prompts.md)
- Appendix E - [AI Audit Report](./AI_Audit_Report.md)
- Appendix F - [AI Critique](./AI_critique.md)
- Appendix G - [README and self-assessment](./README.md)
- Appendix H - [Git log](./git-log.txt)
