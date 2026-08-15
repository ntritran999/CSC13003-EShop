Here are 35 Postman-ready test cases for **POST /api/register**, derived strictly from README FR-01 and the API spec (no `confirmPassword` field exists in the API spec, so it is excluded per your precedence rule).

**TC01 — Objective:** Register with fully valid data (happy path)
Input: `{"name":"Nguyen Van A","email":"tc01@domain.com","password":"Password123!"}`
Expected: 200 OK; response contains `message":"User registered successfully"` and a numeric `id`
Covers: Baseline functional flow (FR-01)

**TC02 — Objective:** Verify password is not echoed back in response
Input: same as TC01 (new unique email)
Expected: 200 OK; response body does not contain the `password` field or its value
Covers: SEC-01 (no plaintext exposure via API response)

**TC03 — Objective:** Missing `name` field entirely
Input: `{"email":"tc03@domain.com","password":"Password123!"}`
Expected: 400 Bad Request; error message indicates `name` is required
Covers: Schema validation — required field (FR-01)

**TC04 — Objective:** `name` is empty string
Input: `{"name":"","email":"tc04@domain.com","password":"Password123!"}`
Expected: 400 Bad Request; error message indicates `name` cannot be empty
Covers: Domain partition — empty value on required field

**TC05 — Objective:** `name` is whitespace only
Input: `{"name":"   ","email":"tc05@domain.com","password":"Password123!"}`
Expected: 400 Bad Request; error message indicates `name` cannot be empty/whitespace
Covers: Domain partition — boundary of "empty" definition

**TC06 — Objective:** `name` contains valid Vietnamese diacritics
Input: `{"name":"Nguyễn Văn Á","email":"tc06@domain.com","password":"Password123!"}`
Expected: 200 OK; user registered successfully
Covers: Domain partition — valid Unicode input

**TC07 — Objective:** `name` field is wrong data type (number)
Input: `{"name":12345,"email":"tc07@domain.com","password":"Password123!"}`
Expected: 400 Bad Request; error message indicates invalid type for `name`
Covers: Schema validation — type constraint

**TC08 — Objective:** Missing `email` field entirely
Input: `{"name":"Nguyen Van A","password":"Password123!"}`
Expected: 400 Bad Request; error message indicates `email` is required
Covers: Schema validation — required field

**TC09 — Objective:** `email` is empty string
Input: `{"name":"Nguyen Van A","email":"","password":"Password123!"}`
Expected: 400 Bad Request; error message indicates `email` cannot be empty
Covers: Domain partition — empty value

**TC10 — Objective:** `email` has invalid format (no @)
Input: `{"name":"Nguyen Van A","email":"tc10domain.com","password":"Password123!"}`
Expected: 400 Bad Request; error message indicates invalid email format
Covers: Domain partition — format validation (FR-01)

**TC11 — Objective:** `email` has invalid format (no domain)
Input: `{"name":"Nguyen Van A","email":"tc11@","password":"Password123!"}`
Expected: 400 Bad Request; error message indicates invalid email format
Covers: Domain partition — format validation

**TC12 — Objective:** `email` has invalid format (double @)
Input: `{"name":"Nguyen Van A","email":"tc12@@domain.com","password":"Password123!"}`
Expected: 400 Bad Request; error message indicates invalid email format
Covers: Domain partition — format validation

**TC13 — Objective:** `email` has no top-level domain
Input: `{"name":"Nguyen Van A","email":"tc13@domain","password":"Password123!"}`
Expected: 400 Bad Request; error message indicates invalid email format
Covers: Domain partition — format validation boundary

**TC14 — Objective:** `email` with leading/trailing whitespace
Input: `{"name":"Nguyen Van A","email":"  tc14@domain.com  ","password":"Password123!"}`
Expected: 200 OK; user is registered with the trimmed email `tc14@domain.com`
Covers: Domain partition — input normalization

**TC15 — Objective:** `email` uniqueness — register with an email already used
Input: Step 1: register `{"name":"A","email":"tc15@domain.com","password":"Password123!"}` → 200 OK. Step 2: repeat identical request.
Expected: Step 2 returns 400/409 (client error) with a message indicating the email already exists (not 200 OK)
Covers: State transition — uniqueness constraint (FR-01)

**TC16 — Objective:** `email` uniqueness is case-insensitive
Input: Step 1: register `tc16@domain.com` → 200 OK. Step 2: register `TC16@domain.com` with same/new password.
Expected: Step 2 returns a client error indicating the email already exists
Covers: State transition — uniqueness boundary (case sensitivity)

**TC17 — Objective:** Missing `password` field entirely
Input: `{"name":"Nguyen Van A","email":"tc17@domain.com"}`
Expected: 400 Bad Request; error message indicates `password` is required
Covers: Schema validation — required field

**TC18 — Objective:** `password` is empty string
Input: `{"name":"Nguyen Van A","email":"tc18@domain.com","password":""}`
Expected: 400 Bad Request; error message indicates `password` cannot be empty
Covers: Domain partition — empty value

**TC19 — Objective:** `password` below minimum length (7 characters)
Input: `{"name":"Nguyen Van A","email":"tc19@domain.com","password":"Pass1!a"}`
Expected: 400 Bad Request; error message indicates password must be at least 8 characters
Covers: Boundary — length lower bound - 1 (FR-01)

**TC20 — Objective:** `password` at exact minimum length boundary (8 characters, all rules met)
Input: `{"name":"Nguyen Van A","email":"tc20@domain.com","password":"Passw1!a"}`
Expected: 200 OK; user registered successfully
Covers: Boundary — exact minimum length

**TC21 — Objective:** `password` missing uppercase letter
Input: `{"name":"Nguyen Van A","email":"tc21@domain.com","password":"password1!"}`
Expected: 400 Bad Request; error message indicates password must contain an uppercase letter
Covers: Domain partition — password composition rule

**TC22 — Objective:** `password` missing lowercase letter
Input: `{"name":"Nguyen Van A","email":"tc22@domain.com","password":"PASSWORD1!"}`
Expected: 400 Bad Request; error message indicates password must contain a lowercase letter
Covers: Domain partition — password composition rule

**TC23 — Objective:** `password` missing digit
Input: `{"name":"Nguyen Van A","email":"tc23@domain.com","password":"Password!"}`
Expected: 400 Bad Request; error message indicates password must contain a digit
Covers: Domain partition — password composition rule

**TC24 — Objective:** `password` missing special character
Input: `{"name":"Nguyen Van A","email":"tc24@domain.com","password":"Password123"}`
Expected: 400 Bad Request; error message indicates password must contain a special character
Covers: Domain partition — password composition rule

**TC25 — Objective:** `password` with special character outside allowed set (e.g., `#`)
Input: `{"name":"Nguyen Van A","email":"tc25@domain.com","password":"Password123#"}`
Expected: 400 Bad Request; error message indicates password requirements not met (only `@ $ ! % * ? &` are accepted)
Covers: Domain partition — allowed character set boundary

**TC26 — Objective:** `password` using each allowed special character individually is accepted
Input: `{"name":"Nguyen Van A","email":"tc26@domain.com","password":"Password1&"}`
Expected: 200 OK; user registered successfully
Covers: Domain partition — allowed special character set

**TC27 — Objective:** `password` consisting only of digits and symbols (no letters)
Input: `{"name":"Nguyen Van A","email":"tc27@domain.com","password":"12345678!"}`
Expected: 400 Bad Request; error message indicates password must contain upper/lowercase letters
Covers: Domain partition — composite rule violation

**TC28 — Objective:** `password` with very long value (e.g., 256 characters, all rules met)
Input: `{"name":"Nguyen Van A","email":"tc28@domain.com","password":"Aa1!"+ "a".repeat(252)}`
Expected: 200 OK; user registered successfully (or documented max-length error if one exists — not specified, so expect 200 OK)
Covers: Boundary — upper length stress test

**TC29 — Objective:** Request body is empty JSON object
Input: `{}`
Expected: 400 Bad Request; error message lists all required fields missing (`name`, `email`, `password`)
Covers: Schema validation — completely missing payload

**TC30 — Objective:** Request body is malformed JSON (syntax error)
Input: `{"name":"Nguyen Van A","email":"tc30@domain.com","password":"Password123!"` (missing closing brace)
Expected: 400 Bad Request; response indicates malformed JSON / parse error
Covers: Schema validation — malformed payload

**TC31 — Objective:** Request contains an unexpected extra field (e.g., `role`)
Input: `{"name":"Nguyen Van A","email":"tc31@domain.com","password":"Password123!","role":"admin"}`
Expected: 200 OK; user registered successfully with default role, not `admin` (verified via login/me response is out of scope — verify only that registration succeeds and no error is thrown for the extra field)
Covers: Schema validation — extra/unexpected field handling, SEC-06 (role cannot be injected by client)

**TC32 — Objective:** SQL Injection payload in `email` field
Input: `{"name":"Nguyen Van A","email":"' OR '1'='1","password":"Password123!"}`
Expected: 400 Bad Request; error message indicates invalid email format; response is a normal JSON error (no server error, no SQL error leakage, no 500)
Covers: SEC-05 (parameterized queries — injection safely rejected at validation layer)

**TC33 — Objective:** SQL Injection payload in `name` field with otherwise valid email/password
Input: `{"name":"Robert'; DROP TABLE users;--","email":"tc33@domain.com","password":"Password123!"}`
Expected: 200 OK; user registered successfully with `name` stored as literal text; no 500 error returned
Covers: SEC-05 (parameterized queries prevent injection execution)

**TC34 — Objective:** XSS/script payload in `name` field
Input: `{"name":"<script>alert(1)</script>","email":"tc34@domain.com","password":"Password123!"}`
Expected: 200 OK; response returns the `name` value as plain literal text in JSON (not executed/rendered); no 500 error
Covers: SEC-04 relevance at API layer — data returned as-is, safe encoding responsibility confirmed to sit at consumption layer, not evidence of stored corruption

**TC35 — Objective:** `password` field sent as a non-string type (number)
Input: `{"name":"Nguyen Van A","email":"tc35@domain.com","password":12345678}`
Expected: 400 Bad Request; error message indicates invalid type for `password`
Covers: Schema validation — type constraint

---

**Notes on scope decisions:**
- No `confirmPassword` test cases were created — the API spec's `POST /api/register` body only defines `name`, `email`, `password`; README's FR-01 confirm-password requirement is UI-only per your precedence instruction.
- No account-lockout, OTP, or role-escalation-verification-via-second-endpoint cases were included, since those depend on other endpoints (`/api/login`, `/api/users/me`) which you asked to avoid.
- SEC-01 (no plaintext storage) can only be indirectly checked via API (TC02 — password absent from response); direct DB inspection is out of API-test scope.