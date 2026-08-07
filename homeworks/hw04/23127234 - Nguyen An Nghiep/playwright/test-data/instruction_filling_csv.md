# Instructions for Filling the Playwright CSV Test Data


## 1. fr03.csv — Forgot/Reset Password

### 1.1 Meaning of every FR-03 column

| Column | Meaning and how the code uses it | Allowed/current values | When it is ignored |
|---|---|---|---|
| `Test ID` | Unique testcase identifier. It appears in the Playwright test title and HTML report. | Unique values such as `TC_FR03_20`. | Never. |
| `Mode` | Selects the complete workflow branch. It decides whether Playwright submits only the email, inspects the generated OTP, inspects the confirmation-password control, or attempts a reset. | `request`, `inspect-otp`, `inspect-confirm`, `reset` | Never. It is the main branch selector. |
| `Email` | Email entered into the forgot-password form. The special value `shared` is converted to `test@eshop.com`; any other value is entered literally. | `shared` or a literal email such as `missing-23127234@eshop.invalid` | Never, although only registered emails can reach reset step 2. |
| `OTP` | OTP to enter during a `reset` case. `displayed` uses the digits extracted from the green OTP message. Any other non-`none` value is entered literally, allowing invalid-length and wrong-value cases. | `displayed`, a literal such as `12345`, `999999`, or `1234567`, and `none` for non-reset inspection cases | Ignored by `request`, `inspect-otp`, and `inspect-confirm`. |
| `Password Strategy` | Decides how the password is produced. `literal` uses the `Password` column exactly. `strong-length` generates a strong password with the exact requested length. `none` produces an empty string and is intended only for branches that do not submit a password. | `none`, `literal`, `strong-length` | Never as a field, but its related `Password` or `Length` column may be ignored. |
| `Password` | Exact password used when `Password Strategy=literal`. It supports normal, invalid-rule, and boundary examples. | A literal value such as `Test1234!`, `Aa1!bbb`, or `Test12345` | Ignored when strategy is `none` or `strong-length`. |
| `Length` | Target length used when `Password Strategy=strong-length`. The generated value is `Aa1!` followed by enough `b` characters to reach the exact length. | A nonnegative integer of at least 4 for this generator, such as `254`, `255`, or `256` | Ignored when strategy is `none` or `literal`. |
| `Expected` | Names the expected oracle and is included in the test title. For reset submissions, it selects the success, OTP-rejection, or password-rejection assertion. Inspection/request modes have fixed assertions matching their expected label. | `success`, `unregistered`, `otp-six-digits`, `otp-rejected`, `password-rejected`, `confirm-field` | It is not the branch selector for `request`, `inspect-otp`, or `inspect-confirm`; their `Mode` selects the implemented assertion. Keep the matching expected label for clarity. |
| `Requirement` | Human-readable rule being tested. It is attached to the Playwright result as a `requirement` annotation. For generic password rejection, it states which individual rule the row targets. | Clear text such as `Password uppercase required` | It does not decide pass/fail. It documents the intended rule and must still be accurate. |

### 3.2 FR-03 `Mode` recipes

| Mode | What Playwright does | Columns that should be filled |
|---|---|---|
| `request` | Opens forgot-password, submits the email, expects the `User not found` dialog, and verifies the email form remains visible. | `Email=<unregistered literal>`, `OTP=none`, `Password Strategy=none`, `Expected=unregistered` |
| `inspect-otp` | Requests an OTP, extracts the first digit sequence from the green message, asserts exactly six digits, and verifies the page contains it. | `Email=shared`, `OTP=displayed`, `Password Strategy=none`, `Expected=otp-six-digits` |
| `inspect-confirm` | Requests an OTP and verifies that two password inputs exist and the second is a password control. | `Email=shared`, `OTP=none`, `Password Strategy=none`, `Expected=confirm-field` |
| `reset` | Requests an OTP, resolves the OTP and password according to their strategies, submits the reset, and applies the selected reset oracle. | Fill `OTP`, `Password Strategy`, its related `Password`/`Length`, and one of `success`, `otp-rejected`, or `password-rejected`. |

## 2. fr10.csv — Order State Machine

### 2.1 Meaning of every FR-10 column

| Column | Meaning and how the code uses it | Allowed/current values | Important notes |
|---|---|---|---|
| `Test ID` | Unique testcase identifier. It appears in the title and in the order shipping address together with the browser name, making created orders traceable. | Unique values such as `TC_FR10_14`. | Every row creates a new database order. |
| `Actor` | Declares who attempts the tested action. In the `api` branch, `unauthenticated` removes the token; other actor values use the admin token. In UI branches, `Channel` determines which UI login helper is used. | `admin`, `user`, `unauthenticated` | Keep it semantically consistent with `Channel`, even when the UI branch does not directly inspect this value. |
| `Start State` | State prepared before the main action. The script reaches it through prerequisite API transitions. | `pending`, `confirmed`, `shipping`, `delivered`, `canceled` | Preparation paths are: none; confirm; confirm→ship; confirm→ship→deliver; or cancel. |
| `Action` | Operation attempted from the prepared state. Its valid vocabulary depends on `Channel`. | See the action/channel table below. | An unsupported action can produce an undefined API target or an unsupported UI-action error. |
| `Channel` | Selects how the tested operation is executed. | `admin-ui`, `user-ui`, `api` | This is the main execution branch. |
| `Expected Status` | Exact persisted order status expected after the attempted action. The script queries `/api/orders/{id}` and compares the returned status. | `pending`, `confirmed`, `shipping`, `delivered`, `canceled` | For a rejected transition, normally repeat `Start State` because state must remain unchanged. |
| `Expected HTTP` | Numeric HTTP status expected from the tested request. | Normally `200`, `400`, `401`, or another requirement-defined status | Write digits without explanatory text. The script converts the CSV string with `Number(...)`. |

### 2.2 FR-10 action and channel combinations

| Channel | Appropriate actor | Supported action values | What is tested |
|---|---|---|---|
| `admin-ui` | `admin` | `confirm`, `cancel`, `ship`, `deliver`, `force-delivered` | Logs into the admin UI, finds the exact order row, finds the named action, and checks the response and/or state. `force-delivered` is the negative final-state UI inspection path. |
| `user-ui` | `user` | `cancel` | Logs into the customer profile and tests the exact `Hủy đơn` action. The shipping case expects the action to be absent; if present, the test uses it and captures the response/state defect. |
| `api` | `admin` or `unauthenticated` | `force-shipping`, `force-pending`, `force-canceled`, `force-delivered`, `confirm` | Sends the target status directly to the admin order-state endpoint. `unauthenticated` deliberately omits the token. |

The `force-*` prefix is test-data vocabulary, not a backend status. For example, `force-shipping` is converted to the API target status `shipping` and represents an attempt to bypass the valid state path.

## 3. fr15.csv — Product CRUD


### 3.1 Meaning of every FR-13 column

| Column | Meaning and how the code uses it | Allowed/current values | Important notes |
|---|---|---|---|
| `Test ID` | Unique testcase identifier used in the test title and generated product name. | Unique values such as `TC_FR15_24`. | Including it in product names prevents collision between logical cases. |
| `Action` | Selects the complete Product CRUD or authorization workflow. | `create`, `missing-category`, `invalid-category`, `view`, `update-isolation`, `cancel-edit`, `delete`, `unauth-create`, `user-update`, `user-delete` | This is the main branch selector. |
| `Name` | Base product name when `Name Length` is blank. The final name becomes `<Name>-<Test ID>-<browser>`. For length-driven rows, `Name` is only descriptive because the generated exact-length value takes precedence. | Text such as `HW04 Valid Product`, or `generated` as a descriptive marker | To create an actually empty name, set `Name Length=0`; merely leaving both fields blank would still produce the suffix. |
| `Name Length` | If nonempty, overrides `Name` and generates a browser-specific product name of exactly this length. `0` produces an empty string. | A nonnegative integer such as `0`, `1`, `2`, `254`, `255`, or `256`; otherwise leave blank | Use integers. The prefix contains the testcase ID and browser, then `x` fills the remaining length. Very short lengths may contain only a sliced prefix. |
| `Price` | Product price input or API value. UI `create` fills this exact CSV string; `abc` is typed sequentially to test a number input. Authorization setup converts it with `Number(...)`. | Numeric strings such as `0`, `1`, `100000`, `25000000`; `abc` only for the intended UI nonnumeric case | The `view`, `update-isolation`, `cancel-edit`, and `delete` fixture helper currently uses its default price `100000`; changing their CSV price alone does not change that fixture. |
| `Category` | Category strategy or documented invalid category. Normal `create` supports `first`, which explicitly selects the first nonempty option and later checks its persisted ID. | `first`; `none` for the missing-category inspection; `99999` for the current invalid-category inspection | For `create`, any value other than `first` throws an unsupported-strategy error. The current `invalid-category` code checks ID `99999` explicitly, so changing only this CSV value does not change the ID under inspection. |
| `Expected` | Expected-result label included in the title. For `create`, `created` selects the success oracle and any normal negative row should use `rejected`. Other actions have fixed assertions and should use their matching label. | `created`, `rejected`, `category-required`, `invalid-category-blocked`, `visible`, `updated-one`, `unchanged`, `deleted`, `http-401`, `http-403` | Keep `Action` and `Expected` paired as shown below. Some fixed-action branches use the label for traceability rather than branch selection. |

### 3.2 FR-15 action recipes

| Action | Required column pattern | What Playwright verifies |
|---|---|---|
| `create` | Fill name by `Name` or `Name Length`; fill `Price`; use `Category=first`; use `Expected=created` or `rejected`. | Native validity or exact POST response, stored record count, expected persistence, UI row, and cleanup. Successful rows also verify price, category, and form reset. |
| `missing-category` | `Category=none`, `Expected=category-required` | The category select has an empty option and the `required` attribute. Both checks are soft so both results are collected. |
| `invalid-category` | `Category=99999`, `Expected=invalid-category-blocked` | No option with value `99999` exists and the select cannot hold that value. |
| `view` | Use a base `Name`; `Price=100000`; `Expected=visible` | Creates an admin fixture and verifies the exact visible row, name, and price. |
| `update-isolation` | Use a base `Name`; `Expected=updated-one` | Edits only the exact fixture row and expects exactly one visible and stored updated product. |
| `cancel-edit` | Use a base `Name`; `Expected=unchanged` | Changes the edit form, cancels, verifies the form reset, and verifies the original row remains unchanged. |
| `delete` | Use a base `Name`; `Expected=deleted` | Deletes the exact fixture, checks HTTP 200, UI disappearance, and API disappearance. |
| `unauth-create` | Valid `Name`, numeric `Price`, `Expected=http-401` | Attempts product creation without a token, expects 401, and verifies no record is stored. |
| `user-update` | Valid `Name`, numeric `Price`, `Expected=http-403` | Creates an admin fixture, attempts update with the regular-user token, expects 403, and verifies the original name remains. |
| `user-delete` | Valid `Name`, numeric `Price`, `Expected=http-403` | Creates an admin fixture, attempts deletion with the regular-user token, expects 403, and verifies the record remains. |


## 4. Safe procedure after editing a CSV

From the Playwright folder: 
`npm run test:list`

Then run the three browser commands for the changed feature one at a time. For example, after editing `fr15.csv`:

```powershell
npm run test:fr15:chromium
npm run test:fr15:firefox
npm run test:fr15:webkit
```

Finally, open one report with:

```powershell
npx playwright show-report "test-report/fr15/chromium"
```