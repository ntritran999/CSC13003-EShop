---
name: ems-gui-test
description: Designs and executes reusable GUI checklist testing, heuristic evaluation, five-person usability testing, and cross-platform compatibility matrices for EMS screens and workflows. Use when the input contains an EMS flow description and related screenshots and Claude must generate a standards-based GUI checklist, plan or document real test execution across at least three screens, analyze genuine participant results, identify evidence-backed findings, or produce a compatibility report without inventing observations, users, metrics, or screenshots.
---

# EMS GUI, Usability, and Compatibility Testing

Apply this workflow to any EMS feature, screen set, or end-to-end flow. Accept a flow description and related screenshots as the initial input. Produce reusable Markdown test artifacts while keeping live execution, participant sessions, and evidence collection human-controlled.

## Required input

Obtain:

1. A description of the EMS flow to test, including the user goal, roles, starting state, major actions, expected end state, and known constraints.
2. Related screenshots for each known screen or state.

Request these when needed for execution:

- EMS URL and test environment.
- At least three target screens or states.
- Safe test accounts and test-data constraints; never copy passwords into reports.
- Human-recorded results, timestamps, recordings, notes, surveys, and compatibility evidence.

If information is missing, continue with checklist design and test preparation. Mark unexecuted work as pending. Never convert an assumption into a test result.

## Integrity rules

- Never invent a Passed/Failed result, participant, contact, session, timing, survey response, screenshot, recording, or form-submission timestamp.
- Never treat a screenshot as proof of loading, keyboard, navigation, recovery, asynchronous, or persistence behaviour that it cannot show.
- Never reuse another tester's observation as if it were newly executed.
- Never expose passwords, tokens, unmasked participant contacts, or private recording links.
- Do not perform destructive, bulk, or irreversible EMS actions without explicit authorization.
- Distinguish clearly among AI-assisted planning, expert heuristic inspection, observed user behaviour, and compatibility execution.
- Preserve the tester's supplied observations and evidence. Ask when a mapping is genuinely ambiguous.

## Stage 1: Model the flow and screens

1. Rewrite the input as a concise flow model:
   - user goal
   - target role
   - entry condition
   - screen/state sequence
   - important inputs and actions
   - success condition
   - failure and recovery states
2. Assign stable screen codes such as `S1`, `S2`, and `S3`; retain existing EMS codes when supplied.
3. Select at least three screens that collectively exercise the flow rather than three nearly identical views.
4. Inspect every supplied screenshot for visible UI elements, layout, text, controls, status, and evidence limitations.
5. Create a coverage map from screens to:
   - IA-01 General UI
   - IA-02 Forms
   - IA-03 Navigation
   - IA-04 Feedback and state

## Stage 2: Generate the master GUI checklist

Use `EMS_GUI_Checklist_reviewed.md` as the style authority when it is supplied. Otherwise apply the rules below.

### Checklist schema

Generate this exact Markdown structure:

```markdown
# EMS GUI Checklist

| Item ID | Item Description | IA Mapping | Heuristic/Principle Mapping | Result | Notes |
|---|---|---|---|---|---|
| GUI-001 | One observable and binary-testable condition | IA-01 | Nielsen: Consistency and Standards | | |
```

### Checklist quality standard

- Generate more than 40 items; default to 51 unless the user specifies another approved count.
- Number items consecutively as `GUI-001`, `GUI-002`, and so on.
- Keep each item atomic: test one observable condition only.
- Make every item binary-testable and reusable across EMS screens. Use examples only to clarify, not to restrict applicability.
- Cover all four IA groups with meaningful breadth.
- Leave Result and Notes empty in the generated master checklist.
- Avoid duplicate items that test the same root condition under different wording.
- Do not put expected product behaviour into the Result column.
- Map every item to at least one defensible heuristic or design principle.

Cover at least these themes:

- **IA-01 General UI:** layout, alignment, clipping, typography, colour hierarchy, contrast, consistency, EN/VI translation, page titles, icon labels, date/status presentation, loading, empty states, and placeholder/debug text.
- **IA-02 Forms:** labels, required indicators, validation, corrective wording, error placement, invalid submission blocking, data retention, disabled states, file constraints, previews, rich text, date/time controls, and keyboard operation.
- **IA-03 Navigation:** active location, menus, breadcrumbs, tabs, Back/Return, deep links, search, filters, pagination, drag/reorder behaviour, unsaved-change protection, focus order, Enter activation, and keyboard traps.
- **IA-04 Feedback/state:** success and failure feedback, confirmation dialogs, status visibility, badge updates, progress, real-time changes, audit feedback, downloads, duplicate-submit protection, and recovery.

### Heuristic mapping rules

Use precise names from:

- Nielsen's ten usability heuristics.
- Norman's principles: affordances, signifiers, constraints, mapping, feedback, and conceptual models.
- Shneiderman's Eight Golden Rules.
- WCAG as a supplemental accessibility reference when relevant; do not substitute it for the requested heuristic mapping.

Map an item by the behaviour it tests, not by keyword similarity. Split compound items when different clauses map to different principles. For example, keyboard shortcuts or alternative navigation may map to Nielsen's Flexibility and efficiency of use, while absence of a keyboard trap more directly concerns User control and freedom and WCAG 2.1.2.

Before finalizing the checklist, verify sequential IDs, item count, IA coverage, atomicity, binary testability, duplicate meaning, and accurate mappings.

## Stage 3: Execute the GUI checklist

### Prepare the execution matrix

Create one row per checklist item and one Result/Notes pair per selected screen:

```markdown
| Item ID | Short description | S1 Result | S1 Notes/evidence | S2 Result | S2 Notes/evidence | S3 Result | S3 Notes/evidence |
|---|---|---|---|---|---|---|---|
```

Use only these final results:

- `Passed`: the applicable expected behaviour was exercised or inspected and observed.
- `Failed`: the applicable behaviour contradicted the expectation.
- `N/A`: the screen lacks the relevant element or state.

Keep a result blank or mark it pending during preparation. Do not use Passed merely because the screenshot looks normal.

### Execute each screen

For every checklist item on every screen:

1. Identify the exact element, state, or transition to inspect.
2. Determine whether the item is applicable.
3. Exercise the behaviour in the live EMS environment when dynamic interaction is required.
4. Compare the observed result with the atomic checklist condition.
5. Record Passed, Failed, or N/A.
6. For Failed, record a concrete symptom and link contemporaneous evidence.
7. For N/A, name the absent control, element, or state; never write only `N/A` in Notes.
8. For Passed, keep Notes concise unless evidence or clarification is useful.

Count Passed, Failed, and N/A per screen and overall. Require each row, column pair, and total to reconcile with the number of checklist items and selected screens.

### Report GUI defects

Create one defect per root cause. Include:

- stable finding ID
- screen and flow
- checklist item(s)
- type and severity
- preconditions
- short numbered reproduction steps
- expected result
- actual result
- user impact
- suggested fix
- screenshot or recording reference
- real submission timestamp, or `null` only when explicitly pending

Do not create separate findings for repeated symptoms caused by the same root defect; attach all affected screens and evidence to one finding.

## Stage 4: Perform expert heuristic evaluation

Evaluate the complete flow separately from checklist execution.

1. Walk through the goal from entry to completion and recovery.
2. Inspect each screen and transition against Nielsen, Norman, and Shneiderman.
3. Identify mismatches between the system's conceptual model and the user's likely mental model.
4. Record only issues supported by the supplied screenshots or live observation.
5. Give each heuristic finding:
   - ID
   - screen/transition
   - violated heuristic or principle
   - evidence-backed observation
   - user impact
   - severity from 0 to 4
   - specific recommendation
   - evidence reference

Use this severity scale:

- `0`: not a usability problem.
- `1`: cosmetic issue.
- `2`: minor issue with limited impact or an easy workaround.
- `3`: major issue that significantly slows, confuses, or blocks many users.
- `4`: critical usability failure preventing the essential goal or causing severe risk/data loss.

Label this output as expert heuristic evaluation. Do not present it as user-testing evidence.

## Stage 5: Conduct Task 2 user testing with five real users

Do not replace this stage with AI judgment or heuristic inspection. Require five genuine participants and at least three screens from the tested flow.

### Phase 1: Design and preparation

1. Write one realistic, goal-oriented task scenario for the end-to-end flow. State the goal and context, not click-by-click instructions.
2. Define success criteria before testing.
3. Measure at minimum:
   - task success: completed, partially completed, or failed
   - time on task
   - errors
   - hesitations
   - SUS or UEQ-S after the task
4. Add open questions about clarity, error recovery, speed, and trust.
5. Recruit five real participants who match the target profile and are outside the class.
6. Keep verifiable contact information privately and mask four middle characters or digits in the report.
7. Obtain informed consent for participation and any screen/audio recording.
8. Run a pilot with one additional helper who is not counted among the five participants.
9. Refine confusing task wording or broken setup before the five real sessions.

### Phase 2: Run five separate sessions

For each participant:

1. Explain that the product is being tested, not the participant.
2. Present the same goal-oriented scenario and starting state.
3. Ask the participant to think aloud.
4. Observe neutrally without leading or teaching the interface.
5. Intervene only when the participant is completely stuck; record the intervention.
6. Record the screen and audio only with consent.
7. Capture structured notes for route taken, completion state, time, errors, hesitations, confusion, frustration, recovery, and notable quotes.
8. End the task consistently.
9. Administer SUS or UEQ-S.
10. Ask the same follow-up probes about clarity, recovery, speed, and trust.

Do not fabricate a missing value. Mark it missing and explain why.

### Phase 3: Score and analyze

For SUS:

- Score odd-numbered items as response minus 1.
- Score even-numbered items as 5 minus response.
- Sum the ten adjusted values and multiply by 2.5 to obtain 0-100.
- Calculate all five participant scores and their mean. Do not describe a SUS score as a percentage.

For UEQ-S:

- Recode responses from 1-7 to -3 through +3.
- Calculate pragmatic, hedonic, and overall means using the official item grouping.
- Do not combine UEQ-S and SUS scoring rules.

Analyze:

1. Success counts and rates for completed, partial, and failed outcomes.
2. Mean and median time on task, with units.
3. Errors, hesitations, and interventions per participant and in total.
4. SUS or UEQ-S results across all five participants.
5. Repeated pain points versus isolated incidents.
6. Systemic design problems versus one-off mistakes or environmental issues.
7. Severity 0-4 using frequency, impact, persistence, and effect on the user's goal.

### Produce the Usability Report

Include:

1. Flow, tested screens, research question, and goal-oriented scenario.
2. Method, environment, pilot changes, consent, and limitations.
3. A masked five-participant table with target profile and verifiable masked contact.
4. A per-participant metrics table.
5. Aggregated success, time, error, hesitation, intervention, and SUS/UEQ-S results.
6. Ranked findings with severity 0-4 and evidence for each finding.
7. Specific recommendations ordered by priority.
8. A distinction between repeated/systemic issues and isolated observations.
9. References to genuine bugs submitted through the required reporting channel.

## Stage 6: Run the compatibility matrix

Run the same selected screens in each baseline configuration:

1. Windows / Chrome / Desktop
2. Windows / Edge / Desktop
3. Windows / Firefox / Desktop
4. Windows / Opera / Desktop
5. iOS / Safari / Phone
6. Android / Chrome / Phone
7. Android / Firefox / Tablet

For `N` screens, plan `7 x N` executions; use at least 21 when testing three screens.

### Compatibility checks

On every cell, verify:

- no unintended horizontal overflow, clipping, or overlap
- readable typography and controls at the viewport size
- correct navigation and screen access
- usable forms, menus, dialogs, media, and scrolling
- visible current state and feedback
- completion of the screen's critical action
- consistent content and behaviour across environments

Use `Passed` or `Failed`. Give every failure a concrete note and evidence.

### Evidence and naming

Require one distinct screenshot per cell. Keep the EMS URL, tester identity overlay, OS, browser, and device class/name visible.

Name files:

```text
OS_Browser_DeviceClass_ScreenCode.ext
```

Use `.jpg` for iOS screenshots and `.png` for all others. Verify that every referenced path exists and is unique.

### Compatibility summary

Calculate:

- planned cells
- executed cells
- passed cells
- failed cells
- unique compatibility findings by root cause

When multiple cells expose the same root cause, create one compatibility finding and attach all affected environments, screens, and evidence.

## Stage 7: Reconcile findings and deliverables

Create one consolidated findings log spanning:

- GUI checklist defects
- expert heuristic findings
- five-user usability findings
- compatibility findings

For every finding, preserve source, ID, affected screens, steps or observation method, expected/actual result where applicable, severity, recommendation, evidence, and submission status.

Reconcile:

- every Failed checklist result to a finding and evidence
- every usability finding to participant/session evidence without exposing identity
- every Failed compatibility cell to a finding and screenshot
- duplicate symptoms to one root-cause finding
- report totals to source tables
- genuine bug submissions to their real timestamps

## Final quality gate

Before delivery, verify:

- The master checklist has more than 40 sequential, atomic, binary-testable items and all required columns.
- IA-01 through IA-04 have meaningful coverage.
- Heuristic mappings are defensible and use correct names.
- No dynamic result was inferred from a static screenshot.
- Every Failed result has a note, evidence, and finding.
- Every N/A result has a precise applicability reason.
- GUI totals reconcile.
- Exactly five genuine user-testing sessions are analyzed, excluding the pilot.
- Participant contacts are masked and consent is documented.
- Task metrics and SUS/UEQ-S calculations are reproducible.
- Usability findings use severity 0-4 and include evidence.
- Compatibility matrices contain seven environments per screen and unique evidence paths.
- Compatibility totals and unique root causes reconcile.
- No credential, fabricated evidence, invented participant, or guessed timestamp appears.

## Handoff

Report what was generated, what was genuinely executed, what was derived, and what remains pending human action. Never claim that a complete template or clean validation proves the EMS flow was tested.
