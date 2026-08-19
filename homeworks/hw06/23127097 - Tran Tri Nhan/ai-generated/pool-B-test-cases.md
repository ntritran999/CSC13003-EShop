Here are 35 Postman test cases for **GET /api/cart** (requires `Authorization: Bearer <token>` per spec §4.1; no query/path parameters exist for this endpoint per API spec — README FR-07 items only describe cart *content* semantics, not additional endpoint parameters).

---

**TC01 — Objective:** Get cart with valid token and existing items
Input: Header `Authorization: Bearer <valid_user_token>` (cart pre-populated with 1 item)
Expected: 200 OK; response is a JSON array containing the item with correct `id`, `name`, `price`, `quantity`
Covers: Happy path, schema

**TC02 — Objective:** Get cart with valid token, cart empty
Input: `Authorization: Bearer <valid_token>` (user has never added items)
Expected: 200 OK; response is an empty JSON array `[]`
Covers: State — empty cart

**TC03 — Objective:** Get cart without Authorization header
Input: No `Authorization` header
Expected: 401 Unauthorized
Covers: SEC-02 (auth required)

**TC04 — Objective:** Get cart with empty Authorization header value
Input: `Authorization: ""`
Expected: 401 Unauthorized
Covers: Domain partition — empty header

**TC05 — Objective:** Get cart with token missing "Bearer" scheme
Input: `Authorization: <valid_token>` (no "Bearer " prefix)
Expected: 401 Unauthorized
Covers: Schema/format of Authorization header

**TC06 — Objective:** Get cart with "Bearer" scheme but no token value
Input: `Authorization: Bearer `
Expected: 401 Unauthorized
Covers: Domain partition — empty token value

**TC07 — Objective:** Get cart with malformed JWT (not 3 dot-separated segments)
Input: `Authorization: Bearer abc.def`
Expected: 401 Unauthorized
Covers: Schema validation of token structure

**TC08 — Objective:** Get cart with syntactically valid JWT but invalid signature
Input: `Authorization: Bearer <token signed with wrong secret>`
Expected: 401 Unauthorized
Covers: SEC-02 — signature verification

**TC09 — Objective:** Get cart with expired JWT
Input: `Authorization: Bearer <expired_token>`
Expected: 401 Unauthorized
Covers: Token lifetime validation

**TC10 — Objective:** Get cart with tampered JWT payload (role changed to admin, signature not re-signed)
Input: `Authorization: Bearer <tampered_token>`
Expected: 401 Unauthorized
Covers: SEC-02/SEC-03 — token integrity

**TC11 — Objective:** Get cart with lowercase auth scheme
Input: `Authorization: bearer <valid_token>`
Expected: 401 Unauthorized
Covers: Domain partition — scheme case sensitivity per spec's exact `Authorization: Bearer <token>` format

**TC12 — Objective:** Get cart with token belonging to a user that no longer exists (e.g., deleted after token issued)
Input: `Authorization: Bearer <token_of_deleted_user>`
Expected: 401 Unauthorized
Covers: Token/user existence validation

**TC13 — Objective:** Get cart with SQL-injection-style string as token value
Input: `Authorization: Bearer ' OR '1'='1`
Expected: 401 Unauthorized; response body is standard JSON error, no server error (no 500), no SQL error leaked
Covers: SEC-05 — parameterized query / injection resilience

**TC14 — Objective:** Get cart with an extremely long garbage token string (boundary length)
Input: `Authorization: Bearer <10000-character random string>`
Expected: 401 Unauthorized; server responds without crashing (no 500)
Covers: Boundary/robustness

**TC15 — Objective:** Get cart with whitespace-only Authorization header
Input: `Authorization:    `
Expected: 401 Unauthorized
Covers: Domain partition — whitespace input

**TC16 — Objective:** Get cart with duplicated Bearer scheme
Input: `Authorization: Bearer Bearer <valid_token>`
Expected: 401 Unauthorized
Covers: Schema/format validation

**TC17 — Objective:** Get cart with valid token belonging to admin account
Input: `Authorization: Bearer <valid_admin_token>` (admin account has 1 item in personal cart)
Expected: 200 OK; response contains admin's own cart item(s)
Covers: Role independence — cart endpoint is not admin-restricted

**TC18 — Objective:** Verify cart isolation between two different users
Input: User A adds Product X to cart; call `GET /api/cart` with User B's valid token (User B's cart is empty)
Expected: 200 OK; response is `[]` (does not contain User A's Product X)
Covers: Data isolation / authorization scoping

**TC19 — Objective:** Get cart after adding the same product twice
Input: `Authorization: Bearer <valid_token>` (same product added via `POST /api/cart` twice with quantity 1 each)
Expected: 200 OK; response array contains a single line item for that product with `quantity = 2` (no duplicate row)
Covers: FR-07 — same product increments quantity, not new row

**TC20 — Objective:** Get cart with multiple distinct products
Input: `Authorization: Bearer <valid_token>` (5 distinct products previously added)
Expected: 200 OK; response array length is exactly 5, each item matching the product previously added
Covers: State — multiple items

**TC21 — Objective:** Get cart after successful checkout
Input: `Authorization: Bearer <valid_token>` (user just completed `POST /api/checkout` successfully)
Expected: 200 OK; response is `[]`
Covers: FR-08 — cart cleared after checkout (state transition)

**TC22 — Objective:** Get cart for a newly registered user with no prior activity
Input: `Authorization: Bearer <token_of_freshly_registered_user>`
Expected: 200 OK; response is `[]`
Covers: Initial state

**TC23 — Objective:** Verify Content-Type of successful response
Input: `Authorization: Bearer <valid_token>`
Expected: 200 OK; response header `Content-Type` contains `application/json`
Covers: Schema/contract validation

**TC24 — Objective:** Verify field types in returned cart item objects
Input: `Authorization: Bearer <valid_token>` (cart has 1 item)
Expected: 200 OK; item object has `id` (number), `name` (string), `price` (number), `quantity` (number)
Covers: Schema validation — field types

**TC25 — Objective:** Verify `price` field is never negative
Input: `Authorization: Bearer <valid_token>` (cart has items)
Expected: 200 OK; every item's `price` value is >= 0
Covers: Schema/data integrity boundary

**TC26 — Objective:** Verify `quantity` field respects minimum boundary
Input: `Authorization: Bearer <valid_token>` (item previously added with quantity = 1)
Expected: 200 OK; returned item has `quantity = 1` exactly
Covers: Boundary — minimum quantity

**TC27 — Objective:** Verify `quantity` field for a large boundary value
Input: `Authorization: Bearer <valid_token>` (item previously added with quantity = 9999)
Expected: 200 OK; returned item has `quantity = 9999` exactly, unmodified
Covers: Boundary — large quantity value

**TC28 — Objective:** Verify top-level response type is a JSON array
Input: `Authorization: Bearer <valid_token>` (cart has items)
Expected: 200 OK; root of response body is a JSON array (`[...]`), not an object
Covers: Schema — top-level structure

**TC29 — Objective:** Verify product name is returned as raw JSON string without HTML escaping
Input: `Authorization: Bearer <valid_token>` (a product previously added to cart had `name` containing `<script>test</script>` via `POST /api/cart`)
Expected: 200 OK; the item's `name` field in the JSON response equals the original string exactly (unescaped at API/JSON level)
Covers: Clarifies SEC-04 is a UI-layer requirement, not API-layer; API returns raw stored data

**TC30 — Objective:** Get cart with unexpected/unused query string parameters
Input: `GET /api/cart?foo=bar` with `Authorization: Bearer <valid_token>`
Expected: 200 OK; response identical to calling `GET /api/cart` without query params (unknown params ignored)
Covers: Domain partition — unexpected query input

**TC31 — Objective:** Call unsupported HTTP method on `/api/cart` path
Input: `PATCH /api/cart` with `Authorization: Bearer <valid_token>`
Expected: 404 Not Found
Covers: HTTP method/route validation

**TC32 — Objective:** Get cart with non-JSON Content-Type header on a GET request (no body sent)
Input: `Authorization: Bearer <valid_token>`, header `Content-Type: text/plain`
Expected: 200 OK; response unaffected since GET request carries no body
Covers: Header robustness

**TC33 — Objective:** Verify idempotency of repeated GET calls
Input: Call `GET /api/cart` twice consecutively with the same `Authorization: Bearer <valid_token>`, no mutations in between
Expected: Both calls return 200 OK with identical response bodies
Covers: Idempotency / no side effects

**TC34 — Objective:** Get cart with valid token but token's `Authorization` header sent with extra leading/trailing spaces around the value
Input: `Authorization:   Bearer <valid_token>   `
Expected: 401 Unauthorized
Covers: Domain partition — malformed header spacing

**TC35 — Objective:** Get cart with a JWT that has valid signature but missing required user-identifying claim (e.g., no `id`/`sub` in payload)
Input: `Authorization: Bearer <token_with_valid_signature_but_no_user_claim>`
Expected: 401 Unauthorized
Covers: Token payload/schema validation