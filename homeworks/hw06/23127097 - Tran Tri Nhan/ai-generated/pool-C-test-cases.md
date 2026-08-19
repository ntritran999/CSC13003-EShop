# Test Cases — POST /api/categories

**Endpoint context:** Admin-only endpoint per FR-14 ("Tên danh mục là bắt buộc, không được để trống") and FR-12/SEC-02/SEC-03 (all `/api/categories` write operations require valid JWT + `role='admin'`). Request body per spec: `{"name": "Tên DM"}`. No uniqueness, max-length, or character-set constraint for `name` is stated in either document, so those are not asserted as functional requirements — only explored as boundary/exploratory inputs where noted.

---

**TC01** — Objective: Create category with valid name as admin
Input: Header: valid admin token; Body: `{"name": "Điện thoại"}`
Expected: 201/200 status per implementation; response body contains created category with a `name` field equal to `"Điện thoại"` and an `id`
Covers: Happy path, FR-14 core function

**TC02** — Objective: Verify created category is retrievable afterward is NOT tested here (cross-endpoint dependency avoided) — instead verify response shape directly
Input: Header: valid admin token; Body: `{"name": "Thời trang"}`
Expected: Success status; response JSON includes `id` (number) and `name` (string) matching input
Covers: Schema of success response

**TC03** — Objective: Reject missing `name` field entirely
Input: Header: valid admin token; Body: `{}`
Expected: 400 Bad Request; response contains an error message
Covers: FR-14 "bắt buộc" (required field), schema validation

**TC04** — Objective: Reject empty string `name`
Input: Header: valid admin token; Body: `{"name": ""}`
Expected: 400 Bad Request; response contains an error message
Covers: FR-14 "không được để trống" (not empty), boundary (min length 0)

**TC05** — Objective: Reject `name` containing only whitespace
Input: Header: valid admin token; Body: `{"name": "   "}`
Expected: 400 Bad Request; response contains an error message
Covers: FR-14 empty-value partition (whitespace-only treated as empty)

**TC06** — Objective: Reject `name` as null
Input: Header: valid admin token; Body: `{"name": null}`
Expected: 400 Bad Request; response contains an error message
Covers: Schema validation, type partition

**TC07** — Objective: Reject `name` as a number type
Input: Header: valid admin token; Body: `{"name": 12345}`
Expected: 400 Bad Request; response contains an error message
Covers: Schema/type validation

**TC08** — Objective: Reject `name` as a boolean type
Input: Header: valid admin token; Body: `{"name": true}`
Expected: 400 Bad Request; response contains an error message
Covers: Schema/type validation

**TC09** — Objective: Reject `name` as an array type
Input: Header: valid admin token; Body: `{"name": ["Điện thoại"]}`
Expected: 400 Bad Request; response contains an error message
Covers: Schema/type validation

**TC10** — Objective: Reject `name` as an object/nested JSON type
Input: Header: valid admin token; Body: `{"name": {"vi": "Điện thoại"}}`
Expected: 400 Bad Request; response contains an error message
Covers: Schema/type validation

**TC11** — Objective: Accept minimal valid single-character name
Input: Header: valid admin token; Body: `{"name": "A"}`
Expected: Success status; response `name` equals `"A"`
Covers: Boundary — minimum non-empty length

**TC12** — Objective: Accept a very long `name` string (e.g., 1000 characters) since no max length is specified in spec
Input: Header: valid admin token; Body: `{"name": "<1000-char string>"}`
Expected: Success status; response `name` equals the submitted 1000-character string unmodified
Covers: Boundary exploration (no documented upper bound), data integrity

**TC13** — Objective: Accept `name` containing Vietnamese diacritics
Input: Header: valid admin token; Body: `{"name": "Đồ Gia Dụng"}`
Expected: Success status; response `name` equals `"Đồ Gia Dụng"` exactly (no encoding corruption)
Covers: Domain partition — Unicode/locale input handling

**TC14** — Objective: Accept `name` containing numbers and special characters mixed with text
Input: Header: valid admin token; Body: `{"name": "Danh mục #2025 - Khuyến mãi!"}`
Expected: Success status; response `name` matches input exactly
Covers: Domain partition — mixed character sets

**TC15** — Objective: Create two categories with identical `name` values (no uniqueness rule documented)
Input: Header: valid admin token; Body #1: `{"name": "Sách"}` then Body #2: `{"name": "Sách"}` in a second request
Expected: Both requests return a success status independently, each producing a distinct `id`
Covers: State exploration for undocumented uniqueness behavior (no uniqueness enforced per spec)

**TC16** — Objective: Reject request with no `Authorization` header
Input: No Authorization header; Body: `{"name": "Sách"}`
Expected: 401 Unauthorized; response contains an error message
Covers: FR-12 / SEC-02 — JWT required

**TC17** — Objective: Reject request with malformed `Authorization` header (missing "Bearer" prefix)
Input: Header: `Authorization: <token>` (no "Bearer "); Body: `{"name": "Sách"}`
Expected: 401 Unauthorized; response contains an error message
Covers: Auth header schema validation

**TC18** — Objective: Reject request with an invalid/garbage JWT token
Input: Header: `Authorization: Bearer invalid.token.value`; Body: `{"name": "Sách"}`
Expected: 401 Unauthorized; response contains an error message
Covers: FR-12 / SEC-02 — token validity check

**TC19** — Objective: Reject request with an expired JWT token
Input: Header: `Authorization: Bearer <expired token>`; Body: `{"name": "Sách"}`
Expected: 401 Unauthorized; response contains an error message
Covers: SEC-02 — token expiry enforcement

**TC20** — Objective: Reject request from a valid, authenticated non-admin user token
Input: Header: `Authorization: Bearer <valid user token, role='user'>`; Body: `{"name": "Sách"}`
Expected: 403 Forbidden; response contains an error message; category is not created
Covers: FR-12 / SEC-03 — role check beyond token existence

**TC21** — Objective: Verify a tampered token with `role` claim manually changed to `admin` is rejected (invalid signature)
Input: Header: `Authorization: Bearer <token with modified payload, original signature>`; Body: `{"name": "Sách"}`
Expected: 401 Unauthorized; response contains an error message
Covers: SEC-03 — server-side role verification via signature, not trusting client-supplied claims

**TC22** — Objective: Reject request using an empty Bearer token value
Input: Header: `Authorization: Bearer `; Body: `{"name": "Sách"}`
Expected: 401 Unauthorized; response contains an error message
Covers: Auth boundary — empty token value

**TC23** — Objective: Verify SQL injection payload in `name` is stored/handled as literal data, not executed
Input: Header: valid admin token; Body: `{"name": "abc'; DROP TABLE categories;--"}`
Expected: Success status; response `name` equals the exact literal string submitted; no server error (500) is returned
Covers: SEC-05 — parameterized queries prevent SQL injection

**TC24** — Objective: Verify a stored script/HTML payload in `name` is returned as raw, unexecuted text in the JSON response
Input: Header: valid admin token; Body: `{"name": "<script>alert(1)</script>"}`
Expected: Success status; response `name` equals the exact literal string `"<script>alert(1)</script>"` with no stripping or execution
Covers: SEC-04-adjacent (data integrity at API layer; escaping is a UI-layer concern per README, so this test only asserts raw storage/return, not rendering)

**TC25** — Objective: Reject request body sent as invalid/malformed JSON
Input: Header: valid admin token, `Content-Type: application/json`; Body: `{"name": "Sách"` (missing closing brace)
Expected: 400 Bad Request; response contains an error message
Covers: Schema validation — malformed payload parsing

**TC26** — Objective: Reject request sent with incorrect `Content-Type` header (e.g., `text/plain`)
Input: Header: valid admin token, `Content-Type: text/plain`; Body: `{"name": "Sách"}`
Expected: 400/415 status (non-2xx); response contains an error message
Covers: Schema/content-type validation

**TC27** — Objective: Reject request with completely empty request body
Input: Header: valid admin token; Body: *(empty)*
Expected: 400 Bad Request; response contains an error message
Covers: Schema validation — missing body

**TC28** — Objective: Verify extra/unexpected fields in the body are ignored or safely handled, and do not cause unintended data changes
Input: Header: valid admin token; Body: `{"name": "Sách", "id": 9999, "created_at": "2000-01-01"}`
Expected: Success status; response `name` equals `"Sách"`; the returned `id` is server-generated (not `9999`)
Covers: Schema robustness — server does not trust client-supplied system fields

**TC29** — Objective: Verify attempting to inject a `role`-like or admin-escalation field in the body has no effect (endpoint scope is category creation only)
Input: Header: valid admin token; Body: `{"name": "Sách", "role": "admin"}`
Expected: Success status; response contains only category fields (`id`, `name`); no `role` field is echoed or applied
Covers: Schema robustness, mirrors SEC-06 principle applied to unrelated endpoint (server ignores unauthorized field)

**TC30** — Objective: Reject `name` field sent with wrong JSON key casing (e.g., `Name` instead of `name`)
Input: Header: valid admin token; Body: `{"Name": "Sách"}`
Expected: 400 Bad Request (treated as missing required `name`); response contains an error message
Covers: Schema key validation, required-field partition

**TC31** — Objective: Verify leading/trailing whitespace in an otherwise valid `name` is accepted (no trimming rule documented, exploratory)
Input: Header: valid admin token; Body: `{"name": "  Sách  "}`
Expected: Success status; response `name` field has a single, deterministic value (either exactly `"  Sách  "` or exactly `"Sách"` — verify against actual server behavior on first run and assert that fixed value consistently)
Covers: Boundary exploration — whitespace handling (documented as request to observe actual deterministic behavior, not an assumed spec requirement)

**TC32** — Objective: Reject request when the Authorization header uses a token belonging to a different, valid but deleted/nonexistent user account
Input: Header: `Authorization: Bearer <token signed for a user id that no longer exists>`; Body: `{"name": "Sách"}`
Expected: 401 Unauthorized; response contains an error message
Covers: SEC-02 — token subject validity beyond signature check

**TC33** — Objective: Verify unsupported HTTP method on the same endpoint path is rejected
Input: Header: valid admin token; Method: `GET` sent with body `{"name": "Sách"}` to `/api/categories` is out of scope — instead test `PATCH /api/categories` (undocumented method)
Expected: 404/405 status (non-2xx); response contains an error message
Covers: Schema/route validation — only `POST` (and documented `GET`/`PUT`/`DELETE`) are valid

**TC34** — Objective: Verify `name` field with only numeric-string content is accepted as a valid string value
Input: Header: valid admin token; Body: `{"name": "2025"}`
Expected: Success status; response `name` equals the string `"2025"` (not converted to a number)
Covers: Domain partition — numeric-looking string treated as string type

**TC35** — Objective: Verify concurrent/duplicate rapid submissions with the same valid token and same `name` do not cause a server error
Input: Header: valid admin token; Two near-simultaneous requests with Body: `{"name": "Đồ chơi"}`
Expected: Both requests return a success status independently (each with its own `id`); no 500 Internal Server Error occurs
Covers: State/robustness — no documented uniqueness constraint, so no rejection is expected; validates server stability under duplicate writes