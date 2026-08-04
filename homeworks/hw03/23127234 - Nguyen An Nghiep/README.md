# HW03 - GUI & Usability Testing on EMS

## Student information

- Student name: Nguyen An Nghiep
- Student ID: 23127234
- System under test: <https://prod-dev.ems-fitus.cloud/login>

## Self-assessment

| No. | Criterion | Maximum | Self-assessed grade |
|---|---|---:|---:|
| 1a | Shared GUI checklist, sources, and AI prompts | 15 | 15 |
| 1b | Checklist execution on D1, D3, and D4 | 15 | 15 |
| 2 | Five-user usability study | 25 | 0 |
| 3 | Cross-browser/cross-platform testing | 25 | 25 |
| 4 | Google Form submissions and aggregated findings log | 10 | 10 |
| 5 | Reusable Agent Skill and demonstration video | 10 | 10 |
| | **Total** | **100** | *75* |

## Test summary

- Chosen scenario: Scenario D - User requests Support and Admin resolves it.
- Primary screens:
  - D1 - User creates a support request with image attachments (documented maximum: 5 images, 5 MB each).
  - D3 - Admin views the Support Requests list with Pending/Resolved tabs and search.
  - D4 - Admin opens a request, views the image, adds an internal note, sends an official response, and resolves it.
- Supporting screen: D2 - User opens My Support requests to verify the RESOLVED status and official response.
- Screen-selection rationale: These screens form a repeatable end-to-end support lifecycle, do not duplicate the group members' Scenario A and B packages, and exercise form, navigation, feedback, state, image, search, and responsive-layout behaviours.
- Shared checklist items: 51.
- Checklist executions: 153.
- Passed: 82.
- Failed: 8.
- N/A: 63.
- Unique Task 1 findings: 8.
- Real user-testing participants: 0 - Task 2 was not performed.
- Compatibility cells executed: 21 out of 21.
- Compatibility failures: 2.
- Total unique findings submitted to Google Forms: 9.
- Agent Skill: `skills/ems-gui-test/`.
- Demonstration video: https://youtu.be/kbvjK2NBPBA.

## Task 2 declaration

Task 2 was not performed. No participant identities, observations, recordings, task metrics, SUS/UEQ-S responses, or usability-study findings were fabricated. The self-assessed score for Task 2 is 0/25.

## Submission contents

- [Main report](./Main_report.md)
- [Bug and Usability Findings Log](./Bug%20%26%20Usability%20Findings%20Log.md)
- [AI Audit Report](<./[AI-02] - FIT@HCMUS - AI Audit Report.md>)
- [AI Critique](./AI_critique.md)
- [Shared checklist](./EMS_GUI_Checklist_reviewed.md)
- [Agent Skill](./skills/ems-gui-test/SKILL.md)
- [Git log](./git-log.txt)
