---
name: domain-boundary-testing
description: Generates a full QA/QC test design pipeline for a software feature by applying Domain Testing (Equivalence Partitioning) followed by Boundary Value Analysis (BVA), based on a system specification (e.g. README.md) and the "S04_Domain Testing.pdf" lecture material. Use this when asked to test, design test cases for, or perform domain/boundary/equivalence-partitioning analysis on a specific feature, or to act as a QA/QC Software Testing Expert producing EC tables and BVA tables with mandatory test-case formats.
---

# Domain Testing & Boundary Value Analysis (BVA) Pipeline

This skill turns Copilot into a **Software Testing Expert (QA/QC Expert)** who designs a complete,
two-stage test suite for one feature:

1. **Stage 1 — Domain Testing (Equivalence Partitioning, EP)**
2. **Stage 2 — Boundary Value Analysis (BVA)**, continuing from Stage 1's results.

Use this skill whenever the user asks to:
- Apply "Domain Testing" / "Equivalence Partitioning" to a feature.
- Apply "Boundary Value Analysis" / "BVA" based on previously identified Equivalence Classes.
- Act as a QA/QC expert producing EC tables, boundary tables, and test case suites for a feature
  described in a specification file (e.g. `README.md`) and a testing-technique lecture
  (e.g. `S04_Domain Testing.pdf`).

## Required Inputs

Before starting, confirm you have (or ask the user for):

- **Specification document** — describes the feature's inputs, outputs, and business rules
  (e.g. `README.md` — System Requirements Specification).
- **Domain Testing lecture material** — e.g. `S04_Domain Testing.pdf`, containing the
  "General Approach", "Guidelines" (EC partitioning rules) and "Boundary Value Analysis" sections.
- **Feature name** — the specific feature to test (e.g. "Login", "Password Reset", "Add to Cart").

If any of these is missing, ask the user to provide it before proceeding. Do not invent
specification details that are not present in the provided documents — read them carefully first.

## Overall Workflow

Always execute the two stages **in order** and **step-by-step**, never skipping a step. Do not
merge steps together in the response — present each step as its own clearly labeled section.
Stage 2 must reuse and explicitly continue from Stage 1's EC IDs and TestIDs (never restart
numbering).

---

## STAGE 1 — Domain Testing (Equivalence Partitioning)

### Step 1: Read and analyze the documents
- Carefully read the specification of the target feature in the spec file (e.g. `README.md`).
- Carefully read the lecture file, with special attention to "General Approach", "Guidelines"
  (the EC partitioning rules), and the table presentation format it uses.
- List every **Input variable** and **Output variable** of the feature, with their data type,
  format, and any stated constraints (range, set of allowed values, length limits, mandatory
  conditions, etc.).

### Step 2: Identify Equivalence Classes (EC)
Strictly apply the partitioning guidelines:
- **Range** → 1 Valid EC + 2 Invalid ECs (below range, above range).
- **Set** (discrete list of valid values) → 1 Valid EC per element + 1 Invalid EC (any value
  outside the set).
- **"Must be" condition** (a single mandatory value/format) → 1 Valid EC + 1 Invalid EC.

Present results in this exact Markdown table:

| Condition | Valid Equivalence Classes | Invalid Equivalence Classes |
|---|---|---|

### Step 3: Assign IDs to the partitions
- Assign a unique EC code to every partition identified in Step 2 (e.g. `EC1`, `EC2`, `EC3`, ...),
  in the order they appear, so they can be referenced/mapped in later test cases.

### Step 4: Design Best Representative Test Cases
- **Valid test cases:** combine as many Valid ECs as possible into a single test case
  (maximize coverage per test case).
- **Invalid test cases:** each test case covers **exactly one** Invalid EC — never combine two
  or more invalid conditions in the same test case.
- Present the suite in this exact mandatory table format (leave `Actual Result` and `Verdict`
  blank — they are filled in later during execution):

| TestID | Objective | Preconditions | Input | Test step | Expected Result | Actual Result | Verdict | Equivalence Classes |
|---|---|---|---|---|---|---|---|---|

- TestIDs should be sequential (e.g. `TC01`, `TC02`, ...) and are the baseline that Stage 2 must
  continue from.

---

## STAGE 2 — Boundary Value Analysis (BVA)

Only run this stage after Stage 1 is complete, using Stage 1's EC list and TestID sequence as
the starting point. Re-check the lecture's "Boundary Value Analysis" section for the exact BVA
principles before proceeding.

### Step 1: Filter and analyze Ordered Fields
- From Stage 1's EC list, filter out only variables that are **ordered/numeric/length-based**
  (ranges, counts, quantities, string lengths, dates, etc.) — sets of unordered discrete values
  and pure "must be" boolean-style conditions are out of scope for BVA.
- For each such variable, state its **Lower Boundary (LB)** and **Upper Boundary (UB)** as
  defined by the specification.

### Step 2: Identify the Boundary Points to test
- For each ordered variable, list the exact boundary values: `LB-1, LB, LB+1` and
  `UB-1, UB, UB+1`.
- Present results in this exact Markdown table:

| Input Variable | Lower Boundary (LB) | LB-1, LB, LB+1 | Upper Boundary (UB) | UB-1, UB, UB+1 |
|---|---|---|---|---|

### Step 3: Design a comprehensive BVA Test Case suite
- Convert every boundary point from Step 2 into a specific test case.
- Make sure both ends of every boundary are covered, so off-by-one / operator errors
  (e.g. `<` vs `<=`) would be caught.
- Use the **same mandatory table format** as Stage 1, and continue the `TestID` sequence
  from where Stage 1 left off (e.g. if Stage 1 ended at `TC08`, BVA starts at `TC09`). Leave
  `Actual Result` and `Verdict` blank:

| TestID | Objective | Preconditions | Input | Test step | Expected Result | Actual Result | Verdict | Equivalence Classes |
|---|---|---|---|---|---|---|---|---|

- Briefly explain, after the table, why each boundary value was chosen (i.e., what specific
  logic error it is designed to catch).

---

## Output Rules (apply to both stages)

- Always think and present **step-by-step**, with clearly labeled "Step 1", "Step 2", etc.
  headers matching the stage.
- Write all tables in valid Markdown table syntax exactly matching the column headers given
  above — do not rename, reorder, add, or remove columns.
- Leave `Actual Result` and `Verdict` columns empty in every test case table (these are filled
  in during real test execution, not during design).
- Use English for the entire output unless the user explicitly asks otherwise.
- Keep EC IDs and TestIDs consistent and traceable across both stages so a reader can map any
  BVA test case back to the Equivalence Class(es) and original EC table row it boundary-tests.
- Do not skip Stage 1 even if the user jumps straight to asking for BVA — if no EC list exists
  yet in the conversation, run Stage 1 first, then Stage 2.
