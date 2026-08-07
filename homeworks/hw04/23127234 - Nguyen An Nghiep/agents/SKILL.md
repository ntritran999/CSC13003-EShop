---
name: playwright-data-driven-automation
description: Build and human-review copy-paste-ready, data-driven Playwright TypeScript automation from pasted web feature requirements, testcase tables, testing flows, and browser lists. Use when converting manual web testcases into external CSV data, inspecting selector evidence supplied by a user, generating tests incrementally, configuring multi-browser reports, reviewing reliability and isolation, classifying failures, and preparing execution/report checklists.
---

# Playwright Data-Driven Automation

## Mission

Convert pasted manual web testcases into a complete, reviewable Playwright suite whose final test specifications and configuration use TypeScript. Keep varying input and expected outcomes in external CSV files. Guide the user from requirement analysis through real execution evidence without inventing UI details, run results, reports, screenshots, or timestamps.

Treat AI output as a draft until the user has reviewed it and supplied actual execution evidence. Preserve correct expectations even when the SUT fails.

## Copy-paste operating model

Assume communication happens only through a website chat:

- Accept requirements, testcases, HTML snippets, console output, report excerpts, and file contents pasted as text.
- Do not assume filesystem, terminal, browser, repository, database, or network access.
- Never claim to have inspected a page, compiled code, run a test, or generated an HTML report unless the user pasted evidence proving it.
- Ask the user to paste an existing file before modifying it. Do not reconstruct an unseen file and call it an update.
- Emit every requested artifact as a complete copy-pasteable code block headed by `FILE: <relative-path>`.
- Do not use ellipses, omitted sections, pseudocode, or unresolved `TODO` markers in final files.
- Generate only files that are used. Do not create empty helper directories or unused helper modules.
- Work in small groups so the user can copy, run, and return evidence before the final merge.

If execution has not been demonstrated, label the result **ready for user execution — not yet verified**, never **completed** or **passed**.

## Required input

Accept the testcase list as TSV, Markdown, or consistently delimited text with these columns:

```text
Test ID	Objective	Preconditions	Input	Test Steps	Expected Result	Actual Result
```

Also require:

```text
Feature ID and name:
Requirement or business rules:
Testing-flow description:
Customer URL:
Admin URL, if applicable:
API URL, if applicable:
Seed accounts and roles, if applicable:
Student ID or report identity:
Browsers to test:
Existing Playwright files, if this is an update:
```

Interpret the columns carefully:

- `Test ID` is the permanent traceability key. Never silently rename it.
- `Objective` states the behavior under test.
- `Preconditions` define state that setup must create or verify.
- `Input` contains varying data that should usually move to CSV columns.
- `Test Steps` define the action sequence. Do not omit the main action.
- `Expected Result` is the oracle. Do not replace it with observed faulty behavior.
- `Actual Result` is post-execution evidence. It may be blank before execution and must not drive generated expectations.

Ask one compact batch of questions when critical information is missing. Prioritize missing requirements, page URLs, roles, state transitions, visible labels, endpoints, and cleanup policy. Continue analysis while waiting when safe.

## Workflow

### Phase 1 — Normalize requirements and traceability

1. Parse every pasted testcase into a normalized table.
2. Preserve the original `Test ID`, objective, expected result, and boundary value.
3. Identify equivalence classes, boundaries, roles, states, actions, channels, and side effects.
4. Mark each testcase:
   - `Automatable` — the required action and oracle are observable.
   - `Partially automatable` — only part of the requirement has an observable oracle.
   - `Blocked` — a missing environment capability or upstream defect prevents the intended behavior.
5. Explain every partial or blocked classification. Do not delete the testcase.
6. Build a traceability matrix:

```text
Test ID -> requirement -> data row -> generated Playwright title -> assertion/oracle
```

7. Detect contradictions between the requirement, expected result, and testing flow before generating code.

### Phase 2 — Design the external data schema

Design one CSV row per logical testcase. Prefer explicit columns over a single encoded `Input` field.

Always include:

- `Test ID`
- one workflow selector such as `Mode` or `Action`
- varying inputs
- precondition/state fields needed by setup
- expected HTTP/state/message/result fields needed by assertions
- a short `Requirement` field when multiple rows share a generic UI message

Add columns only when the TypeScript code reads them. Remove dead columns.

Use strategy values for generated boundaries instead of storing enormous literals, for example:

```text
Password Strategy=strong-length, Length=255
Name Strategy=generated-length, Name Length=256
```

Keep credentials and secrets out of CSV. Use environment variables with safe documented seed defaults when permitted.

Define for every CSV column:

- purpose;
- allowed values;
- branch that consumes it;
- whether blank is valid;
- dependencies on other columns;
- example value.

Require a runtime validator after CSV parsing. Validate exact headers, unique/nonempty test IDs, enum values, numeric conversion, required combinations, and unsupported branches before test generation.

Use UTF-8 and a standards-compliant parser such as `csv-parse/sync`. Quote fields that contain commas, quotes, or line breaks.

### Phase 3 — Obtain selector and network evidence

Do not invent selectors from testcase prose. Ask the user to inspect the live UI and paste evidence for each involved page.

Request this compact evidence block:

```text
Page name and URL:
Visible labels and button text:
Relevant form/menu/table outerHTML:
How one exact row can be identified:
Dialog or toast text:
Request URL, method, payload, status, and response:
Visible state before and after the action:
```

Tell the user how to collect it when needed:

1. Open browser developer tools.
2. Inspect the exact control and copy its relevant `outerHTML`.
3. Copy visible labels exactly, including language and accents.
4. Use the Network panel to capture the action's request method, URL, status, and body.
5. For table actions, paste one complete row containing its unique ID/name and action buttons.

Choose selectors in this order:

1. `getByRole(..., { name, exact: true })`
2. `getByLabel(...)` only when the label is programmatically associated
3. `getByPlaceholder(...)`
4. stable `data-testid`
5. exact row-scoped semantic locator
6. stable CSS selector as a documented fallback

Never use global `first()`, `nth(...)`, positional menu indexes, or generic input order for meaningful/destructive actions when a semantic alternative exists. Scope edit, delete, cancel, ship, and deliver controls inside the exact record row.

If the available markup has no stable semantic selector, request a test ID or document the unavoidable fallback. Do not call a guessed locator final.

### Phase 4 — Plan setup, state, and cleanup

For every testcase, write down:

```text
Starting data -> preparation transitions -> main action -> response oracle -> persisted-state oracle -> visible-state oracle -> cleanup
```

Rules:

- Create a fresh fixture for each stateful testcase when possible.
- Include `Test ID`, browser, and a run discriminator in generated names/addresses.
- Pre-clean deterministic fixture names before creation.
- Use `try/finally` for cleanup.
- Authenticate fixture setup and cleanup with the proper role.
- Assert cleanup response status and verify disappearance when practical.
- Never add a production delete endpoint only to simplify tests.
- When no safe cleanup endpoint exists, define a disposable-database policy.
- Do not reset a shared seed account unless the password can be restored reliably.
- Do not run stateful feature/browser combinations concurrently against one backend.
- Use API calls for fast setup and persisted-state verification, but execute the main action through the UI when the testcase is a UI testcase.

### Phase 5 — Generate TypeScript tests in small groups

Generate 3–5 related testcases at a time, grouped by workflow rather than CSV order. A useful order is:

1. one positive smoke case;
2. basic negative validation;
3. boundary cases;
4. state-transition cases;
5. authorization and isolation cases.

For each group:

1. Output the relevant CSV rows.
2. Output the complete current `.spec.ts` file, not a disconnected fragment.
3. Explain the trace from each row to its branch and assertions.
4. Give one Chromium command for the user to run.
5. Ask the user to paste the terminal summary and the first actionable failure.
6. Classify and correct automation/data defects before adding the next group.

Use this baseline implementation pattern:

- Parse CSV synchronously at discovery time.
- Generate one separately titled `test(...)` per row.
- Include the original `Test ID` in every test title.
- Use typed row interfaces plus runtime validation.
- Use `testInfo.project.name` for browser-specific fixture identity.
- Keep reusable functions focused and used; delete unused helpers.
- Throw explicit errors for unsupported `Mode`, `Action`, strategy, or expected value.
- Preserve UTF-8 visible strings.

### Phase 6 — Apply reliable action and assertion patterns

Register event and response listeners before the triggering action:

```ts
const [response] = await Promise.all([
  page.waitForResponse(
    (candidate) =>
      candidate.url().endsWith(expectedPath) &&
      candidate.request().method() === expectedMethod,
  ),
  actionButton.click(),
]);
```

For dialogs, register `page.waitForEvent("dialog")` before clicking.

Do not use:

- `waitForTimeout(...)` as synchronization;
- arbitrary short response timeouts;
- `.catch(() => null)` that hides timeouts;
- broad text checks that can pass for the wrong rule;
- assertion-free branches;
- early returns before the testcase's main action;
- changed expected values merely to make the run green.

Use deterministic synchronization:

- exact request/response predicates;
- `expect.poll(...)` for eventually persisted state;
- locator assertions for UI state;
- native form `checkValidity()` plus a request counter when invalid input should send no request.

Trace important input to important output. A successful create should normally assert:

- exact response status;
- exactly one persisted record;
- all important stored fields;
- exact visible row and values;
- expected form reset or navigation;
- successful cleanup.

A rejected mutation should normally assert:

- the expected blocking mechanism or 4xx response;
- unchanged persisted state;
- absence of a newly created record;
- appropriate visible feedback or remaining location.

Use at least three meaningful assertion patterns per feature, selected for real oracles rather than padding. Examples include `toBe`, `toHaveLength`, `toBeVisible`, `toHaveURL`, `toContainText`, `toHaveAttribute`, `toHaveValue`, and `expect.poll(...).toBe`.

Use `expect.soft(...)` only when continuation is safe and collecting related evidence is valuable. Do not continue after a failed prerequisite that invalidates later steps.

### Phase 7 — Configure browsers and report identity

Generate a TypeScript `playwright.config.ts` with projects for every requested browser. When the user requests the standard three-browser requirement, configure:

```text
chromium
firefox
webkit
```

Configure according to the environment:

- `retries: 0` for honest evidence runs;
- `workers: 1` when tests share database state;
- `screenshot: "only-on-failure"`;
- `trace: "retain-on-failure"`;
- `video: "retain-on-failure"` when required;
- line output plus an HTML reporter;
- a separate output and HTML report directory per feature/browser;
- report title/metadata containing `Run by: <StudentID>`, feature ID, browser, and a real ISO timestamp supplied at execution time.

Provide one runner command per feature/browser. Run each combination in its own Playwright process so it receives a distinct report folder and timestamp.

Never fabricate HTML reports or timestamps. They are execution evidence. Only the user's real local run can generate them.

### Phase 8 — Execute incrementally through user feedback

Give commands in this order:

1. install locked dependencies;
2. install requested browsers;
3. list discovered tests;
4. run one positive case on Chromium;
5. run the complete feature on Chromium;
6. run the same feature on the other requested browsers;
7. after all features stabilize, run the final report matrix sequentially.

Require the user to wait for the final Playwright summary and the shell prompt before starting the next stateful command. Explain that exit code 1 can mean completed tests found genuine SUT defects; it does not mean the HTML report was not generated.

After every pasted run result:

1. Check whether all cases executed.
2. Separate compile/config errors from assertion failures.
3. Inspect the first actionable failure.
4. Compare the assertion with the requirement.
5. Correct the script or data if the automation is wrong.
6. Preserve the failure if the SUT is wrong.
7. Rerun only the affected scope, then regenerate final evidence after the last code/data change.

### Phase 9 — Perform mandatory human review

Review every generated branch with this checklist:

- Does the main action actually occur?
- Is the selector semantic, exact, and row-scoped?
- Is every listener registered before the action?
- Is any timeout swallowed or any fixed delay used?
- Could the assertion pass for the wrong reason?
- Does a generic message falsely claim rule-specific evidence?
- Are response, persisted state, and visible state all checked where important?
- Are boundary values generated at the exact intended length/value?
- Does every CSV column affect code, or is it explicitly documented as descriptive?
- Are positive, negative, boundary, role, authorization, and isolation cases covered where required?
- Can one case contaminate another case, browser, or later feature?
- Does cleanup run after both pass and fail paths and verify success?
- Are credentials kept out of varying testcase data?
- Would a UI reorder make the test click a different destructive action?
- Are browser-specific native-validation differences handled honestly?

Record at least one concrete human fix with:

```text
AI draft problem:
Risk or false result:
Human correction:
Why the AI missed it:
Verification after correction:
```

## Failure classification

Classify each failed execution as exactly one primary category:

- `Automation defect` — wrong selector, race, missing action, weak oracle, incorrect setup, or cleanup problem.
- `Test-data defect` — malformed row, unsupported value, wrong expected mapping, or accidental collision.
- `Environment problem` — unavailable service, wrong seed, port conflict, missing browser, or inconsistent database.
- `Confirmed SUT defect` — correct requirement, correct data, correct automation, and reproducible incorrect SUT behavior.
- `Blocked by upstream SUT defect` — the intended oracle was never reached because an earlier SUT failure stopped the flow.

Before calling a failure a confirmed SUT defect:

1. Recheck the authoritative requirement.
2. Recheck the data row and prerequisite state.
3. Recheck the selector and action.
4. Recheck response and stored state.
5. Reproduce once in a controlled run.
6. Compare other browsers when relevant.

Do not report a blocked testcase as a separate confirmed bug. Group repeated browsers and boundary rows by root cause rather than inflating bug counts.

## Bug-report and report checklist

For each distinct confirmed defect, produce:

```text
Bug number/title
Description
Related testcase IDs
Browsers affected
Preconditions
Steps to reproduce
Expected result
Actual result
Response/persisted/visible evidence
Screenshot or HTML-report reference
```

Before final handoff, check:

- every selected feature has the required logical testcase count;
- all logical cases have external data rows;
- discovered execution count equals logical cases multiplied by requested browsers;
- every browser has a real report folder;
- report metadata contains the student ID, feature, browser, and real ISO timestamp;
- pass/fail totals match the actual reports;
- failed executions are classified;
- confirmed bugs are grouped by root cause and linked to evidence;
- blocked cases are documented without false conclusions;
- screenshots, traces, and videos are retained according to policy;
- the human-review section explains what AI got wrong or missed;
- final scripts contain no unused files, dead branches, guessed selectors, hidden waits, or unresolved placeholders.

## Artifact output order

When enough evidence is available, output artifacts in this order:

1. normalized traceability and automation-status table;
2. external CSV schema and allowed-value explanation;
3. complete CSV file;
4. complete Playwright `.spec.ts` file;
5. complete `playwright.config.ts` when configuration is in scope;
6. package/runner files only when required and actually used;
7. exact install, discovery, smoke, feature, and browser commands;
8. human-review checklist and change log;
9. failure-classification and final-report checklist.

Format files exactly like this:

````markdown
FILE: test-data/frxx.csv

```csv
Test ID,Action,Input,Expected
...
```

FILE: tests/frxx.feature.spec.ts

```ts
// Complete compilable file
```
````

Do not combine multiple physical files inside one unlabeled code block.

## Completion gate

Declare the automation ready for final evidence only when:

- all testcase rows are traceable;
- required selector/network evidence was supplied;
- the final code is complete TypeScript and contains no placeholders;
- runtime CSV validation exists;
- every branch performs its named action;
- assertions cover response, state, and UI as appropriate;
- setup and cleanup are isolated or a disposable-data policy is explicit;
- all requested browser projects and report paths are configured;
- the user has pasted successful test discovery output;
- automation defects found during review were corrected;
- any remaining unexecuted work is labeled honestly.

Declare the work fully executed only after the user supplies the real final run summaries and report evidence. Never infer execution from generated code alone.
