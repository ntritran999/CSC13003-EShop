<<br/><br/>

<p align="center">
  <font size="6"><b>HCMC UNIVERSITY OF SCIENCE</b></font><br/>
  <font size="4"><b>FACULTY OF INFORMATION TECHNOLOGY</b></font>
</p>

<br/>

<p align="center">
  <img src="https://hcmus.edu.vn/wp-content/uploads/2023/04/Logo-chinh-e1681638380305.png" alt="HCMUS Logo" width="150"/>
</p>

<p align="center">
  <font size="5"><b>HOMEWORK REPORT</b></font><br/>
  <font size="4"><b>COURSE: SOFTWARE TESTING</b></font>
</p>

<p align="center">
  <b>Assignment:</b> GUI & Usability Testing trên EMS (Event Management System)
</p>

<br/><br/><br/>

---

### STUDENT INFORMATION

| Field                 | Detailed Information                                                                          |
| :-------------------- | :-------------------------------------------------------------------------------------------- |
| **Full Name**         | Cao Trần Bá Đạt                                                                               |
| **Student ID**        | 23127168                                                                                      |
| **Class Section**     | _23KTPM1_                                             

---

# Task 1

## Feature selection

### Pool A: FR-02: Login & Account Lock

Test cases:

| TC_ID       | Title                                                               | Type            | Priority   | Preconditions                                                | Input_Email                      | Input_Password   | Steps                                                                                     | Expected_Result                                                                                                               | Notes                                                                                        |
|:------------|:--------------------------------------------------------------------|:----------------|:-----------|:-------------------------------------------------------------|:---------------------------------|:-----------------|:------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------|:---------------------------------------------------------------------------------------------|
| TC-LOGIN-01 | Valid login - registered user                                       | Positive        | High       | User account exists and is active                            | test@eshop.com                   | Test1234!        | 1. Navigate to /login 2. Enter email 3. Enter password 4. Click Sign In                   | Login succeeds; JWT token returned and stored client-side; user redirected to homepage (/)                                    | Baseline happy path                                                                          |
| TC-LOGIN-02 | Valid login - admin user                                            | Positive        | High       | Admin account exists                                         | admin@eshop.com                  | Admin123!        | Same steps as TC-LOGIN-01                                                                 | Login succeeds; JWT token returned; token payload contains role=admin                                                         | Confirms role claim for downstream FR-12 access control                                      |
| TC-LOGIN-03 | Incorrect password - 1st failed attempt                             | Negative        | High       | Account exists; fail counter = 0                             | test@eshop.com                   | WrongPass1!      | Submit login once with wrong password                                                     | Login rejected; generic error message shown; fail counter increments by exactly 1 (now = 1)                                   | Verifies 'increments by exactly 1 unit' rule                                                 |
| TC-LOGIN-04 | Incorrect password - 2nd consecutive failed attempt                 | Negative        | High       | Fail counter = 1 (from TC-LOGIN-03)                          | test@eshop.com                   | WrongPass2!      | Submit login again with wrong password                                                    | Login rejected; generic error; fail counter = 2; account NOT yet locked                                                       | Boundary case, one attempt below lock threshold                                              |
| TC-LOGIN-05 | Incorrect password - 3rd consecutive failed attempt (triggers lock) | Negative        | Critical   | Fail counter = 2 (from TC-LOGIN-04)                          | test@eshop.com                   | WrongPass3!      | Submit login a 3rd consecutive time with wrong password                                   | Account is locked for 30 seconds (demo env); generic lockout error shown; underlying cause is not disclosed                   | Core FR-02 lockout rule (>= 3 consecutive failures)                                          |
| TC-LOGIN-06 | Correct password submitted while account is locked                  | Negative        | Critical   | Account currently locked (immediately after TC-LOGIN-05)     | test@eshop.com                   | Test1234!        | Immediately retry login using the CORRECT password while still inside the 30s lock window | Login is still rejected with a lockout message; no JWT is issued                                                              | Confirms lock state overrides even correct credentials                                       |
| TC-LOGIN-07 | Login succeeds after lockout window expires                         | Edge            | High       | Wait 30+ seconds after lock was triggered (post TC-LOGIN-05) | test@eshop.com                   | Test1234!        | Wait 31 seconds, then submit correct credentials                                          | Login succeeds; JWT issued; fail counter resets to 0                                                                          | Verifies 30s demo expiry and counter reset behavior                                          |
| TC-LOGIN-08 | Non-existent email address                                          | Negative        | Medium     | Email is not registered in the system                        | notexist@eshop.com               | Test1234!        | Submit login form with an unregistered email                                              | Generic error shown (does not reveal 'email not found'); response is indistinguishable from a wrong-password error            | Checks account-enumeration / info-leak prevention                                            |
| TC-LOGIN-09 | Empty email field                                                   | Negative        | Medium     | -                                                            | (empty)                          | Test1234!        | Leave email field blank, click Sign In                                                    | Client-side 'required' validation blocks submission; no network request sent                                                  | HTML5 required-field check                                                                   |
| TC-LOGIN-10 | Empty password field                                                | Negative        | Medium     | -                                                            | test@eshop.com                   | (empty)          | Leave password field blank, click Sign In                                                 | Client-side 'required' validation blocks submission; no network request sent                                                  | HTML5 required-field check                                                                   |
| TC-LOGIN-11 | Invalid email format (missing @)                                    | Edge            | Medium     | -                                                            | test.eshop.com                   | Test1234!        | Enter a malformed email, click Sign In                                                    | Browser blocks submission via type="email" HTML5 validation                                                                   | Currently FAILS - field is implemented as type="text" instead of type="email" (known defect) |
| TC-LOGIN-12 | SQL injection attempt in email field                                | Edge / Security | High       | -                                                            | ' OR '1'='1                      | anything123      | Enter SQLi payload as the email value, submit                                             | Login is rejected as invalid credentials; no authentication bypass occurs; no DB/stack error is exposed to the UI             | Validates SEC-05 (parameterized queries)                                                     |
| TC-LOGIN-13 | Email case sensitivity                                              | Edge            | Low        | Account exists as test@eshop.com                             | TEST@ESHOP.COM                   | Test1234!        | Submit login using the same email in uppercase                                            | Behavior undefined by spec - verify actual system response (commonly expected to succeed, treating email as case-insensitive) | Spec is silent on this; document actual observed behavior as a finding                       |
| TC-LOGIN-14 | Password with leading/trailing whitespace                           | Edge            | Low        | Account exists                                               | test@eshop.com                   | Test1234!        | Enter the correct password but with extra leading/trailing spaces, submit                 | Login fails unless the system explicitly trims password input before comparison - verify actual behavior                      | Confirms no unintended trimming of password field                                            |
| TC-LOGIN-15 | Extremely long string in email field                                | Edge            | Low        | -                                                            | <500-character string>@eshop.com | Test1234!        | Paste a very long string (500+ chars) into the email field, submit                        | System handles input gracefully (validation error or safe rejection); no client crash or unhandled 500 server error           | Boundary / stress test for input length handling                                             |

### Pool B: FR-09: Coupon

| TC_ID        | Title                                                            | Type            | Priority   | Preconditions                                                                          | Input_CouponCode   |   Input_TotalAmount | Input_LoggedIn   | Steps                                                                                                                                                   | Expected_Result                                                                                                                                                                                                         | Notes                                                                                                               |
|:-------------|:-----------------------------------------------------------------|:----------------|:-----------|:---------------------------------------------------------------------------------------|:-------------------|--------------------:|:-----------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------|
| TC-COUPON-01 | Valid percent coupon applied successfully                        | Positive        | High       | User logged in; cart total meets threshold                                             | SAVE10             |              300000 | Yes              | 1. Go to Checkout 2. Enter coupon code 3. Click Áp dụng                                                                                                 | Coupon accepted; discount_amount = 30,000 ₫ (10%); final_amount = 270,000 ₫ displayed                                                                                                                                   | Covers C1-C5 all satisfied; validates percent formula                                                               |
| TC-COUPON-02 | Valid fixed-amount coupon applied successfully                   | Positive        | High       | User logged in; cart total meets threshold                                             | BIGBUY             |              500000 | Yes              | 1. Go to Checkout 2. Enter coupon code 3. Click Áp dụng                                                                                                 | Coupon accepted; discount_amount = 50,000 ₫ (fixed); final_amount = 450,000 ₫ displayed                                                                                                                                 | Validates fixed formula                                                                                             |
| TC-COUPON-03 | Valid coupon with remaining uses (multi-use code)                | Positive        | Medium     | User logged in; user has used VIP100 0 times (max_uses_per_user = 2)                   | VIP100             |              300000 | Yes              | Enter code and apply                                                                                                                                    | Coupon accepted; discount_amount = 100,000 ₫; final_amount = 200,000 ₫                                                                                                                                                  | Confirms C5 passes when usage count is below the cap                                                                |
| TC-COUPON-04 | Non-existent coupon code (C1 fails)                              | Negative        | High       | User logged in                                                                         | NOTREAL99          |              300000 | Yes              | Enter a code that does not exist in the DB, click Áp dụng                                                                                               | couponError shown (e.g. 'Không thể áp dụng mã'); no discount applied; final total unchanged                                                                                                                             | Isolates C1 (mã tồn tại)                                                                                            |
| TC-COUPON-05 | Expired coupon rejected (C2 fails)                               | Negative        | High       | User logged in; total meets the code's own min_order_amount                            | EXPIRED            |              150000 | Yes              | Enter EXPIRED code (min_order_amount = 100,000 ₫, expired_at = 2020-01-01), click Áp dụng                                                               | couponError shown; discount NOT applied                                                                                                                                                                                 | Isolates C2 (còn hạn sử dụng) - threshold intentionally satisfied so only expiry can fail it                        |
| TC-COUPON-06 | Order total below coupon's minimum threshold (C3 fails)          | Negative        | High       | User logged in; SAVE10 requires total >= 300,000 ₫                                     | SAVE10             |              200000 | Yes              | Set cart/edit total to 200,000 ₫, enter SAVE10, click Áp dụng                                                                                           | couponError shown; discount NOT applied                                                                                                                                                                                 | Isolates C3 (đủ ngưỡng đơn hàng)                                                                                    |
| TC-COUPON-07 | Guest user attempts to apply a coupon (C4 fails)                 | Negative        | High       | User is NOT logged in (no JWT token); total meets threshold                            | SAVE10             |              300000 | No               | As a guest, enter SAVE10 and click Áp dụng                                                                                                              | Request rejected / couponError shown; discount NOT applied                                                                                                                                                              | Isolates C4 (đã đăng nhập)                                                                                          |
| TC-COUPON-08 | Coupon already used the maximum number of times (C5 fails)       | Negative        | High       | User logged in; user has already used SAVE10 once (max_uses_per_user = 1)              | SAVE10             |              300000 | Yes              | Re-apply SAVE10 a 2nd time as the same user                                                                                                             | couponError shown (e.g. 'đã dùng hết lượt'); discount NOT applied                                                                                                                                                       | Isolates C5 (chưa dùng hết lượt)                                                                                    |
| TC-COUPON-09 | Boundary - total exactly equal to min_order_amount               | Edge            | High       | User logged in; BIGBUY min_order_amount = 500,000 ₫                                    | BIGBUY             |              500000 | Yes              | Set total to exactly 500,000 ₫, apply BIGBUY                                                                                                            | Coupon accepted (spec: total >= min_order_amount); final_amount = 450,000 ₫                                                                                                                                             | Validates the >= boundary explicitly, not just >                                                                    |
| TC-COUPON-10 | Boundary - total one unit below min_order_amount                 | Edge            | High       | User logged in; BIGBUY min_order_amount = 500,000 ₫                                    | BIGBUY             |              499999 | Yes              | Set total to 499,999 ₫, apply BIGBUY                                                                                                                    | couponError shown; discount NOT applied                                                                                                                                                                                 | One VND below the boundary must fail C3                                                                             |
| TC-COUPON-11 | Coupon code entered in lowercase                                 | Edge            | Medium     | User logged in; total meets threshold                                                  | save10             |              300000 | Yes              | Type lowercase 'save10', click Áp dụng                                                                                                                  | Coupon accepted and treated identically to SAVE10 (frontend uppercases before sending); final_amount = 270,000 ₫                                                                                                        | Confirms client-side .toUpperCase() normalization works                                                             |
| TC-COUPON-12 | Coupon code with leading/trailing whitespace                     | Edge            | Low        | User logged in; total meets threshold                                                  | SAVE10             |              300000 | Yes              | Type the code with extra spaces around it, click Áp dụng                                                                                                | Coupon accepted (frontend trims before sending); final_amount = 270,000 ₫                                                                                                                                               | Confirms client-side .trim() normalization works                                                                    |
| TC-COUPON-13 | Tampered total_amount used to fraudulently satisfy threshold     | Edge / Security | Critical   | User logged in; REAL cart value is only 100,000 ₫ (below SAVE10's 300,000 ₫ threshold) | SAVE10             |              350000 | Yes              | 1. Manually overwrite the editable 'Tổng tiền thanh toán' field to 350,000 ₫ (real cart is 100,000 ₫) 2. Apply SAVE10 3. Proceed to Xác Nhận Thanh Toán | Coupon apply call may succeed client-side (known defect - see FR-08 total-tampering issue), BUT the backend checkout endpoint must recompute the real total from the cart and reject/ignore the fabricated total_amount | Directly tests the FR-08/FR-09 integrity gap - editableTotal is user-controlled input to the coupon threshold check |
| TC-COUPON-14 | Empty coupon code - submit blocked client-side                   | Edge            | Low        | User logged in                                                                         | (empty)            |              300000 | Yes              | Leave coupon input blank, observe Áp dụng button                                                                                                        | Áp dụng button remains disabled; no API request is sent; no coupon result/error rendered                                                                                                                                | Validates the !couponCode.trim() disabled-state guard                                                               |
| TC-COUPON-15 | Multi-use coupon exceeds its own usage cap (C5 fails on 3rd use) | Negative        | Medium     | User logged in; user has already used VIP100 exactly 2 times (max_uses_per_user = 2)   | VIP100             |              300000 | Yes              | Attempt to apply VIP100 a 3rd time as the same user                                                                                                     | couponError shown; discount NOT applied                                                                                                                                                                                 | Confirms C5 cap is enforced per-user, not just once                                                                 |

### Pool C: FR-17: Coupon CRUD

| TC_ID | Title | Type | Priority | Preconditions | Input_Code | Input_Type | Input_DiscountValue | Input_MinOrderAmount | Input_ExpiredAt | Input_MaxUsesPerUser | Steps | Expected_Result | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TC-COUPON-ADM-01 | Create valid percent coupon | Positive | High | Logged in as admin; code not yet in use | WELCOME20 | percent | 20 | 100000 | 2099-12-31 | 1 | 1. Go to Mã Giảm Giá tab 2. Fill all fields 3. Click Tạo mã | New row appears in table: WELCOME20 | Phần trăm | 20% | 100.000 ₫ | 2099-12-31 | 1 lần; form resets to blank | Baseline happy path for percent type |
| TC-COUPON-ADM-02 | Create valid fixed-amount coupon | Positive | High | Logged in as admin; code not yet in use | FLASH50K | fixed | 50000 | 200000 | 2099-06-30 | 2 | Fill all fields, click Tạo mã | New row appears: FLASH50K | Cố định | 50.000 ₫ | 200.000 ₫ | 2099-06-30 | 2 lần | Baseline happy path for fixed type |
| TC-COUPON-ADM-03 | Delete an existing coupon | Positive | High | A coupon named WELCOME20 already exists (e.g. from TC-ADM-01) | WELCOME20 | - | - | - | - | - | Locate the WELCOME20 row, click its Xóa button | Row for WELCOME20 is removed from the table after the list refreshes | Validates the 'Xem/Xóa' half of FR-17; scope the Xóa locator to the row - the label is reused on every admin tab |
| TC-COUPON-ADM-04 | Duplicate coupon code rejected | Negative | High | A coupon with code SAVE10 already exists in the system (sample data) | SAVE10 | percent | 15 | 100000 | 2099-12-31 | 1 | Fill form with the already-used code SAVE10, click Tạo mã | Error alert shown (e.g. 'Lỗi: ...'); no duplicate row is added to the table | Confirms code uniqueness constraint |
| TC-COUPON-ADM-05 | Empty coupon code blocks submission | Negative | Medium | Logged in as admin | (empty) | percent | 10 | 100000 | 2099-12-31 | 1 | Leave code blank, fill the rest, click Tạo mã | HTML5 'required' validation blocks submission; no POST request sent | Client-side required-field check |
| TC-COUPON-ADM-06 | Empty discount value blocks submission | Negative | Medium | Logged in as admin | TESTCODE1 | percent | (empty) | 100000 | 2099-12-31 | 1 | Leave discount value blank, click Tạo mã | HTML5 'required' validation blocks submission; no POST request sent | Client-side required-field check |
| TC-COUPON-ADM-07 | Empty expiry date blocks submission | Negative | Medium | Logged in as admin | TESTCODE2 | percent | 10 | 100000 | (empty) | 1 | Leave expiry date blank, click Tạo mã | HTML5 'required' validation blocks submission; no POST request sent | Client-side required-field check |
| TC-COUPON-ADM-08 | Discount value of zero (not positive) | Edge | High | Logged in as admin | ZERODISC | percent | 0 | 100000 | 2099-12-31 | 1 | Enter 0 as discount value, click Tạo mã | Client currently allows submission (no min='1' constraint on this field - known gap); backend MUST reject with an error per FR-17 'discount_value (dương)' and no row should be created | Documents a client-side validation gap; the real assertion is on backend behavior |
| TC-COUPON-ADM-09 | Negative discount value | Edge | High | Logged in as admin | NEGDISC | fixed | -15000 | 100000 | 2099-12-31 | 1 | Enter -15000 as discount value, click Tạo mã | Client currently allows submission (no min constraint - known gap); backend MUST reject the negative value and no row should be created | Same validation-gap class as TC-ADM-08 |
| TC-COUPON-ADM-10 | Minimum order amount at boundary zero | Edge | Medium | Logged in as admin | ZEROMIN | percent | 10 | 0 | 2099-12-31 | 1 | Set min order amount to 0, click Tạo mã | Coupon created successfully; row shows '0 ₫' for Đơn tối thiểu (spec allows min_order_amount >= 0) | Validates the inclusive >= 0 boundary is accepted, not rejected |
| TC-COUPON-ADM-11 | Negative minimum order amount | Edge | High | Logged in as admin | NEGMIN | percent | 10 | -50000 | 2099-12-31 | 1 | Set min order amount to -50000, click Tạo mã | Client currently allows submission (field isn't even marked required/min - known gap); backend MUST reject and no row should be created | Also exposes that min_order_amount lacks the 'required' attribute entirely, contrary to FR-17's required-field list |
| TC-COUPON-ADM-12 | Max uses per user below minimum (0) | Edge | Medium | Logged in as admin | ZEROUSES | percent | 10 | 100000 | 2099-12-31 | 0 | Set 'Số lần dùng tối đa/người' to 0, click Tạo mã | HTML5 min='1' constraint blocks submission (or backend rejects if bypassed); no row created | Confirms the >= 1 boundary from FR-17 |
| TC-COUPON-ADM-13 | Percent discount value exceeding 100% | Edge | Low | Logged in as admin | OVER150 | percent | 150 | 100000 | 2099-12-31 | 1 | Enter 150 as the percent discount value, click Tạo mã | Behavior undefined by spec - document actual result (accepted vs rejected); logically a >100% discount should not be allowed | Spec is silent on an upper bound for percent type - flag as a finding either way |
| TC-COUPON-ADM-14 | Non-admin token blocked from coupon creation API | Negative | Critical | Have a valid JWT for a regular (non-admin) user | APIHACK | percent | 10 | 100000 | 2099-12-31 | 1 | Send POST /api/admin/coupons directly with the regular user's Authorization header (bypassing the UI) | Request rejected with 401/403; no coupon is created | API-level test for FR-12/SEC-03 - role must be checked server-side, not just token presence |
| TC-COUPON-ADM-15 | Coupon code auto-uppercased on input | Edge | Low | Logged in as admin | flashsale | percent | 10 | 100000 | 2099-12-31 | 1 | Type the code in lowercase ('flashsale') into the code field | Field value visibly converts to 'FLASHSALE' as it's typed (onChange forces toUpperCase); submitted/stored code is uppercase | Confirms client-side normalization matches the checkout page's matching uppercase behavior |

## Execution

- Used Playwright default configuration for projects to run on 3 major browsers (Chrome, Firefox, Webkit).
- Added HTML as a reporter to Playwright configuration, along with the `title` option for HTML reporter for each test case.

### FR-02

| Test ID | Status |
|---------|--------|
| TC-01   | PASSED |
| TC-02   | PASSED |
| TC-03   | PASSED |
| TC-04   | PASSED |
| TC-05   | PASSED |
| TC-06   | PASSED |
| TC-07   | FAILED |
| TC-08   | PASSED |
| TC-09   | PASSED |
| TC-10   | PASSED |
| TC-11   | PASSED |
| TC-12   | PASSED |
| TC-13   | PASSED |
| TC-14   | PASSED |
| TC-15   | PASSED |

### FR-09

| Test ID | Status |
|---------|--------|
| TC-01   | FAILED |
| TC-02   | FAILED |
| TC-03   | FAILED |
| TC-04   | PASSED |
| TC-05   | PASSED |
| TC-06   | PASSED |
| TC-07   | PASSED |
| TC-08   | FAILED |
| TC-09   | FAILED |
| TC-10   | PASSED |
| TC-11   | FAILED |
| TC-12   | FAILED |
| TC-13   | PASSED |
| TC-14   | PASSED |
| TC-15   | FAILED |

The failed test cases were added as bugs to the bug report document.

Test cases 8, 11, 12, and 15 failed to execute correctly because their preconditions and inputs encountered bugs in `Bug 02` within the `Bug_report.md` file.

### FR-17

| Test ID | Status |
|---------|--------|
| TC-01   | PASSED |
| TC-02   | PASSED |
| TC-03   | PASSED |
| TC-04   | PASSED |
| TC-05   | PASSED |
| TC-06   | PASSED |
| TC-07   | PASSED |
| TC-08   | FAILED |
| TC-09   | FAILED |
| TC-10   | PASSED |
| TC-11   | FAILED |
| TC-12   | PASSED |
| TC-13   | FAILED |
| TC-14   | PASSED |
| TC-15   | PASSED |

The failed test cases were added as bugs to the bug report document.

Assertion pattern used for this feature:
- toHaveURL()
- toBeVisible()/not.toBeVisible()
- toHaveText()
- toHaveAttribute()
- toContainText()
- toHaveCount()
- toHaveValue()
- expect().toBe()/.toContain()

## AI analysis

### FR-01

Overall, the AI performed well in generating high-quality baseline test cases and selecting robust fallback locators where semantic attributes were missing, but its initial implementation suffered from critical structural flaws. Specifically, the AI omitted key edge cases and failed to account for stateful backend constraints, generating a flat list of tests that ignored the failed-login counter and account lockout timer, which led to unintended lockouts and flaky failures. Furthermore, the AI-generated configuration was unsuitable for this feature because it enabled parallel execution (`fullyParallel: true`), causing severe race conditions on the login counter; to resolve these issues, we refined the suite by adding missing scenarios, restructuring stateful lockout cases into sequential flows (`test.describe.serial`), enforcing single-worker execution (`workers: 1`), and integrating automated database resets (`node database.js`) before tests to ensure complete isolation.

### FR-09

Similar to FR-02, the AI performed well in the initial setup by generating strong test cases and fallback locators, but its implementation lacked an essential database reset mechanism. Without automatically resetting the database before each test run, executing the test suite sequentially causes coupon usage counters to continuously increment, which prematurely exhausts multi-use caps and inadvertently triggers false-positive failures in downstream test cases that should otherwise pass. To guarantee 100% test reliability and isolate stateful dependencies across coupon validation rules, we enhanced the suite by integrating an automated database re-seeding step (node database.js) within the beforeEach execution hook.

### FR-17

Overall, the AI performed well in establishing the initial test framework similar to previous features, successfully covering primary UI workflows like form submissions and tab navigation; however, its generated script remains flawed as it missed several required test cases from the CSV specification and failed to properly validate currency displays, incorrectly flagging valid VND formatted numbers with comma or dot separators as failures due to rigid string assertions instead of flexible regex handling.

# Appendices
