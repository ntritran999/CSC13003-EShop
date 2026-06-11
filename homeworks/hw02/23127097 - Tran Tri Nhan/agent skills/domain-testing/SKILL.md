---
name: domain-testing
description: Use when performing Equivalence Partitioning (EP) and Boundary Value Analysis (BVA) from functional requirements in a README, SRS, PRD, user stories, or software specification. Analyzes a selected functional requirement, identifies equivalence classes, designs minimal EP test cases, and designs BVA test cases when applicable.
---

# Domain Testing Skill

## Purpose

This skill performs Domain Testing according to the standard workflow:

1. Requirement Understanding
2. Equivalence Class (EC) Identification
3. Equivalence Partitioning (EP) Test Design
4. Boundary Value Analysis (BVA)

This skill is intended for software testing, QA, test design, and test case generation from specifications.

---

# REQUIRED WORKFLOW

When invoked:

## Step 0 - Obtain Inputs

First identify:

1. The specification document (README, SRS, PRD, etc.)
2. The Functional Requirement (FR) to analyze

If the requirement is not specified by the user, ask:

> Which Functional Requirement (FR) do you want me to perform Domain Testing on?

Do not proceed until a specific FR is selected.

---

# CRITICAL RULES

## Rule 1 - Specification First

ONLY use information explicitly stated in the specification.

Never invent:

- constraints
- limits
- ranges
- validations
- formats
- business rules

that are not explicitly documented.

If something is not stated:

State clearly:

> This requirement is not specified. No equivalence classes can be derived from it.

Never assume implementation details.

Examples of forbidden assumptions:

- maximum password length
- JWT expiration duration
- HTTP status codes
- database schema constraints
- UI behavior not stated in the specification

---

## Rule 2 - Requirement Understanding is the Most Important Step

Before identifying ECs:

Extract ALL requirements affecting input behavior.

For every input field:

1. Identify the field.
2. Identify every condition applied to that field.
3. Classify each condition.

Do NOT jump directly into EC identification.

Always show:

### Input Field

### Requirement

### Condition Type

Where Condition Type is one of:

- Range of values
- Set of values
- Must be condition

---

# DOMAIN TESTING GUIDELINES

Use the following rules.

## Range of Values

Examples:

- 1 <= count <= 999
- length between 3 and 15
- quantity >= 1

Create:

- 1 valid EC
- 2 invalid ECs

Pattern:

Valid:
- within range

Invalid:
- below range
- above range

If only one boundary exists:

Example:

quantity >= 1

Create:

Valid:
- quantity >= 1

Invalid:
- quantity < 1

---

## Set of Values

Example:

Vehicle type must be:

- BUS
- TRUCK
- TAXI
- MOTORCYCLE

If values are handled differently:

Create one valid EC per meaningful value/group.

Also create invalid ECs when appropriate.

Split ECs further whenever behavior differs.

---

## Must Be Condition

Examples:

- Must be an email
- Must be an integer
- First character must be a letter
- Password must contain uppercase

Create:

Valid:
- condition satisfied

Invalid:
- condition violated

---

## EC Splitting Rule

If there is reason to believe values are handled differently by the system:

Split into separate ECs.

Example:

Email uniqueness:

Valid:
- email does not exist

Invalid:
- email already exists

Even though both are valid email formats.

---

# STEP 1 - REQUIREMENT UNDERSTANDING & EC IDENTIFICATION

Produce:

## Requirement Analysis

For each field:

### Field

### Requirement

### Condition Type

### Equivalence Classes

Use format:

| EC ID | Description | Validity |
|---------|---------|---------|

Afterward produce:

## Consolidated Equivalence Classes

containing all ECs.

---

# STEP 2 - TEST CASE DESIGN (EP)

Use the following strategy.

## Valid Classes

Create as few test cases as possible.

Each valid test case should cover as many valid ECs as possible.

Continue until every valid EC is covered.

## Invalid Classes

Create one test case per invalid EC.

Each invalid test case must contain:

- exactly one invalid EC
- all other inputs valid

Do not combine multiple invalid ECs in the same test.

---

## Output Format

For every test case:

| TC ID | Inputs | EC Covered | Expected Result |

Then provide:

## Coverage Matrix

| EC | Covered By |

Verify every EC is covered.

---

# STEP 3 - BOUNDARY VALUE ANALYSIS

Apply BVA ONLY when a true boundary exists.

Examples:

- length >= 8
- 1 <= quantity <= 999
- 3 <= x <= 7

For each boundary:

Generate:

- LB-1
- LB
- LB+1

and if an upper boundary exists:

- UB-1
- UB
- UB+1

Use the standard BVA approach.

---

## When BVA Does NOT Apply

If requirements only contain:

- valid/invalid token
- admin/non-admin role
- existing/non-existing item
- yes/no decisions

then state:

> Boundary Value Analysis is not applicable because the specification contains no range-based input domain and therefore no meaningful boundaries.

Do NOT invent boundaries.

---

# OUTPUT STRUCTURE

Always produce:

# Step 1 - Requirement Understanding and EC Identification

...

# Step 2 - Equivalence Partitioning Test Cases

...

# Step 3 - Boundary Value Analysis

...

# Final Coverage Summary

...

---

# EXAMPLE

The following example demonstrates the expected level of detail.

==================================================
EXAMPLE: FR-01 Registration
==================================================

Requirement:

- Full Name required
- Email required
- Email format valid
- Email unique
- Password required
- Password length >= 8
- Password contains uppercase
- Password contains lowercase
- Password contains digit
- Password contains special character
- Confirm Password required
- Confirm Password matches Password

--------------------------------------------------
STEP 1
--------------------------------------------------

## ECs

### Full Name

| EC ID | Description | Validity |
|---------|---------|---------|
| FN-EC1 | Full Name provided | Valid |
| FN-EC2 | Full Name empty | Invalid |

### Email Required

| EC ID | Description | Validity |
|---------|---------|---------|
| EM-EC1 | Email provided | Valid |
| EM-EC2 | Email empty | Invalid |

### Email Format

| EC ID | Description | Validity |
|---------|---------|---------|
| EM-EC3 | Valid email format | Valid |
| EM-EC4 | Invalid email format | Invalid |

### Email Uniqueness

| EC ID | Description | Validity |
|---------|---------|---------|
| EM-EC5 | Email does not exist | Valid |
| EM-EC6 | Email already exists | Invalid |

### Password Required

| EC ID | Description | Validity |
|---------|---------|---------|
| PW-EC1 | Password provided | Valid |
| PW-EC2 | Password empty | Invalid |

### Password Length

| EC ID | Description | Validity |
|---------|---------|---------|
| PW-EC3 | Length >= 8 | Valid |
| PW-EC4 | Length < 8 | Invalid |

### Password Uppercase

| EC ID | Description | Validity |
|---------|---------|---------|
| PW-EC5 | Contains uppercase | Valid |
| PW-EC6 | No uppercase | Invalid |

### Password Lowercase

| EC ID | Description | Validity |
|---------|---------|---------|
| PW-EC7 | Contains lowercase | Valid |
| PW-EC8 | No lowercase | Invalid |

### Password Digit

| EC ID | Description | Validity |
|---------|---------|---------|
| PW-EC9 | Contains digit | Valid |
| PW-EC10 | No digit | Invalid |

### Password Special Character

| EC ID | Description | Validity |
|---------|---------|---------|
| PW-EC11 | Contains allowed special character | Valid |
| PW-EC12 | No special character | Invalid |
| PW-EC13 | Unsupported special character only | Invalid |

### Confirm Password Required

| EC ID | Description | Validity |
|---------|---------|---------|
| CP-EC1 | Confirm Password provided | Valid |
| CP-EC2 | Confirm Password empty | Invalid |

### Confirm Password Match

| EC ID | Description | Validity |
|---------|---------|---------|
| CP-EC3 | Matches Password | Valid |
| CP-EC4 | Does not match Password | Invalid |

--------------------------------------------------
STEP 2
--------------------------------------------------

Valid test:

TC01

Full Name:
Nguyen Van A

Email:
newuser@gmail.com

Password:
Abc1234@

Confirm:
Abc1234@

Covers:

FN-EC1
EM-EC1
EM-EC3
EM-EC5
PW-EC1
PW-EC3
PW-EC5
PW-EC7
PW-EC9
PW-EC11
CP-EC1
CP-EC3

Expected:
Registration successful.

Invalid tests:

TC02:
FN-EC2 only

TC03:
EM-EC2 only

TC04:
EM-EC4 only

TC05:
EM-EC6 only

TC06:
PW-EC2 only

TC07:
PW-EC4 only

TC08:
PW-EC6 only

TC09:
PW-EC8 only

TC10:
PW-EC10 only

TC11:
PW-EC12 only

TC12:
PW-EC13 only

TC13:
CP-EC2 only

TC14:
CP-EC4 only

--------------------------------------------------
STEP 3
--------------------------------------------------

Boundary:
Password length >= 8

LB = 8

BVA-TC01:
Length = 7
Expected: Reject

BVA-TC02:
Length = 8
Expected: Accept

BVA-TC03:
Length = 9
Expected: Accept

--------------------------------------------------
FINAL CONCLUSION
--------------------------------------------------

- All ECs identified
- All ECs covered by EP tests
- BVA applied only to documented boundaries
- No assumptions introduced beyond the specification