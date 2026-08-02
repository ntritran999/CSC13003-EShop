<h3 align='center'>UNIVERSITY OF SCIENCE, VNUHCM</h3>
<h3 align='center'>FACULTY OF INFORMATION TECHNOLOGY</h3>
<br>
<p align='center'><img src='./images/logo.png' width=50% height=50%></p>

<h3 align='center'>SOFTWARE TESTING</h3>
<h4 align='center'>HW04 – Automation Testing</h4>

<br>
<br>
<br>

# 1. Student Information & General Information

- Name: Trần Trí Nhân
- Student ID: 23127097

# Task 1

## Feature selection

### Pool A: FR-01: Account registration

Test cases:

| Test ID | Objective                                      | Test Steps                                                                                        | Expected Results                                                                                                                                             |
|---------|------------------------------------------------|---------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| TC-01   | Verify registration with valid data            | 1. Fill the 'Họ tên', 'Email', 'Mật khẩu' fields with input data.<br>2. Hit the 'Đăng ký' button. | Registration successful, redirect to /login                                                                                                                  |
| TC-02   | Verify registration with empty Full name       | 1. Fill the 'Họ tên', 'Email', 'Mật khẩu' fields with input data.<br>2. Hit the 'Đăng ký' button. | Browser's native validation triggers, or message 'Đăng ký thất bại.' is displayed                                                                            |
| TC-03   | Verify registration with empty Email           | 1. Fill the 'Họ tên', 'Email', 'Mật khẩu' fields with input data.<br>2. Hit the 'Đăng ký' button. | Browser's native validation triggers, or message 'Đăng ký thất bại.' is displayed                                                                            |
| TC-04   | Verify registration with invalid Email format  | 1. Fill the 'Họ tên', 'Email', 'Mật khẩu' fields with input data.<br>2. Hit the 'Đăng ký' button. | Message 'Đăng ký thất bại.' is displayed                                                                                                                     |
| TC-05   | Verify registration with existing Email        | 1. Fill the 'Họ tên', 'Email', 'Mật khẩu' fields with input data.<br>2. Hit the 'Đăng ký' button. | Message 'Đăng ký thất bại.' is displayed                                                                                                                     |
| TC-06   | Verify registration with empty Password        | 1. Fill the 'Họ tên', 'Email', 'Mật khẩu' fields with input data.<br>2. Hit the 'Đăng ký' button. | Browser's native validation triggers, or message 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.' is displayed |
| TC-07   | Verify registration with short Password        | 1. Fill the 'Họ tên', 'Email', 'Mật khẩu' fields with input data.<br>2. Hit the 'Đăng ký' button. | Message 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.' is displayed                                          |
| TC-08   | Verify registration with lowercase Password    | 1. Fill the 'Họ tên', 'Email', 'Mật khẩu' fields with input data.<br>2. Hit the 'Đăng ký' button. | Message 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.' is displayed                                          |
| TC-09   | Verify registration with uppercase Password    | 1. Fill the 'Họ tên', 'Email', 'Mật khẩu' fields with input data.<br>2. Hit the 'Đăng ký' button. | Message 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.' is displayed                                          |
| TC-10   | Verify registration with letter-only Password  | 1. Fill the 'Họ tên', 'Email', 'Mật khẩu' fields with input data.<br>2. Hit the 'Đăng ký' button. | Message 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.' is displayed                                          |
| TC-11   | Verify registration with alphanumeric Password | 1. Fill the 'Họ tên', 'Email', 'Mật khẩu' fields with input data.<br>2. Hit the 'Đăng ký' button. | Message 'Mật khẩu quá yếu! Phải dài tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và KÝ TỰ ĐẶC BIỆT.' is displayed                                          |
| TC-12   | Verify confirm password field exists           | 1. Observe the registration form<br>                                                              | A field with label 'Xác nhận mật khẩu' exists                                                                                                                |

### Pool B: FR-07: Shopping cart

Test cases:

| Test ID | Objective                                                         | Steps                                                                                                                                                                                | Expected Result                                                                                            |
|---------|-------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| TC-01   | Verify shopping cart page has correct columns                     | 1. Click 'Thêm vào giỏ' button on the first item<br>2. Click 'Giỏ hàng' button<br>3. Observe the columns                                                                             | The columns include: 'Sản phẩm', 'Đơn giá', 'Số lượng'(with '+' and '-' buttons), 'Thành tiền', 'Thao tác' |
| TC-02   | Verify shopping cart not add new row when adding the same product | 1. Click 'Thêm vào giỏ' button on the first item<br>2. Click 'Thêm vào giỏ' button on the first item again<br>3. Click 'Giỏ hàng' button<br>4. Observe the rows in the shopping cart | Only one row appears in the cart                                                                           |
| TC-03   | Verify a back-to-home button exists on shopping cart page         | 1. Click 'Giỏ hàng' button                                                                                                                                                           | There is a link back to home page with message: 'Tiếp tục mua sắm'                                         |
| TC-04   | Verify total amount has correct label                             | 1. Click 'Thêm vào giỏ' button on the first item<br>2. Click 'Giỏ hàng' button<br>3. Observe the label of total amount                                                               | The label is 'Tổng cộng', not 'Tổng tạm tính'                                                              |
| TC-05   | Verify empty cart has clear message                               | 1. Click 'Giỏ hàng' button<br>2. Observe the empty cart                                                                                                                              | Message 'Giỏ hàng của bạn đang trống' is displayed                                                         |
| TC-06   | Verify reject non-integer quantity                                | 1. Click 'Xem chi tiết' button on the first item<br>2. Insert the quantity data to 'Số lượng' field<br>3. Click 'Thêm vào giỏ hàng' button twice<br>4. Click 'Giỏ hàng' button       | The item does not appear in cart                                                                           |
| TC-07   | Verify reject negative quantity                                   | 1. Click 'Xem chi tiết' button on the first item<br>2. Insert the quantity data to 'Số lượng' field<br>3. Click 'Thêm vào giỏ hàng' button twice<br>4. Click 'Giỏ hàng' button       | The item does not appear in cart                                                                           |
| TC-08   | Verify reject zero quantity                                       | 1. Click 'Xem chi tiết' button on the first item<br>2. Insert the quantity data to 'Số lượng' field<br>3. Click 'Thêm vào giỏ hàng' button twice<br>4. Click 'Giỏ hàng' button       | The item does not appear in cart                                                                           |
| TC-09   | Verify accept quantity equals 1                                   | 1. Click 'Xem chi tiết' button on the first item<br>2. Insert the quantity data to 'Số lượng' field<br>3. Click 'Thêm vào giỏ hàng' button twice<br>4. Click 'Giỏ hàng' button       | The item appears in cart with 'Số lượng' equals 1                                                          |
| TC-10   | Verify accept quantity equals 2                                   | 1. Click 'Xem chi tiết' button on the first item<br>2. Insert the quantity data to 'Số lượng' field<br>3. Click 'Thêm vào giỏ hàng' button twice<br>4. Click 'Giỏ hàng' button       | The item appears in cart with 'Số lượng' equals 2                                                          |
| TC-11   | Verify reject non-numeric quantity                                | 1. Click 'Xem chi tiết' button on the first item<br>2. Insert the quantity data to 'Số lượng' field<br>3. Click 'Thêm vào giỏ hàng' button twice<br>4. Click 'Giỏ hàng' button       | The item does not appear in cart                                                                           |
| TC-12   | Verify accept quantity equals 10000000                            | 1. Click 'Xem chi tiết' button on the first item<br>2. Insert the quantity data to 'Số lượng' field<br>3. Click 'Thêm vào giỏ hàng' button twice<br>4. Click 'Giỏ hàng' button       | The item appears in cart with 'Số lượng' equals 10000000                                                   |

### Pool C: FR-14: Category management (CRUD)

In HW02, I chose FR-12: Access control for Pool C, but that FR cannot be used for automation testing, so in HW04, I changed to FR-14 (this FR is ensured to not be duplicated among the members of the group).

Test cases:

| Test ID | Objective                                             | Steps                                                                                                                                                | Expected Result                                                                                |
|---------|-------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| TC-01   | Verify admin can view categories                      | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Observe the category list                                                         | The page shows a list of categories, each row has a name and a delete button                   |
| TC-02   | Verify admin can delete a category                    | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Click 'Xóa' button on the first row<br>4. Confirm the deletion(if dialog appears) | The first row is removed                                                                       |
| TC-03   | Verify delete button has a confirmation dialog        | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Click 'Xóa' button on the first row                                               | A confirmation dialog appears                                                                  |
| TC-04   | Verify admin can create a new category                | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Enter the test data into the category name field.<br>4. Hit 'Thêm mới' button.    | A new row is created with the input name                                                       |
| TC-05   | Verify admin can create a category name in Vietnamese | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Enter the test data into the category name field.<br>4. Hit 'Thêm mới' button.    | A new row is created with the input name                                                       |
| TC-06   | Verify category name can contain numbers and symbols  | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Enter the test data into the category name field.<br>4. Hit 'Thêm mới' button.    | A new row is created with the input name                                                       |
| TC-07   | Verify category name can contain special characters   | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Enter the test data into the category name field.<br>4. Hit 'Thêm mới' button.    | A new row is created with the input name                                                       |
| TC-08   | Verify reject empty category name                     | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Enter the test data into the category name field.<br>4. Hit 'Thêm mới' button.    | No new row is created                                                                          |
| TC-09   | Verify reject white-space category name               | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Enter the test data into the category name field.<br>4. Hit 'Thêm mới' button.    | No new row is created                                                                          |
| TC-10   | Verify reject duplicate category name                 | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Enter the test data into the category name field.<br>4. Hit 'Thêm mới' button.    | No new row is created                                                                          |
| TC-11   | Verify truncate long category name                    | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Enter the test data into the category name field.<br>4. Hit 'Thêm mới' button.    | A new row is created with the input name truncated(showing ellipsis) instead of fully rendered |
| TC-12   | Verify santitize category name                        | 1. Login as admin<br>2. Click 'Danh mục' on the left sidebar<br>3. Enter the test data into the category name field.<br>4. Hit 'Thêm mới' button.    | A new row is created with the input name displayed as-is, instead of being rendered as HTML    |


## Execution

- Used Playwright default configuration for projects to run on 3 major browsers (Chrome, Firefox, Webkit).
- Added HTML as a reporter to Playwright configuration, along with the `title` option for HTML reporter.
- [Test scripts link](https://github.com/ntritran999/CSC13003-EShop/tree/main/homeworks/hw04/23127097%20-%20Tran%20Tri%20Nhan/playwright/tests)
- [Test data link](https://github.com/ntritran999/CSC13003-EShop/tree/main/homeworks/hw04/23127097%20-%20Tran%20Tri%20Nhan/playwright/test-data)
- [HTML reports link](https://github.com/ntritran999/CSC13003-EShop/tree/main/homeworks/hw04/23127097%20-%20Tran%20Tri%20Nhan/playwright/test-report)

### FR-01

| Test ID | Status |
|---------|--------|
| TC-01   | FAILED |
| TC-02   | PASSED |
| TC-03   | PASSED |
| TC-04   | FAILED |
| TC-05   | FAILED |
| TC-06   | PASSED |
| TC-07   | PASSED |
| TC-08   | PASSED |
| TC-09   | PASSED |
| TC-10   | PASSED |
| TC-11   | PASSED |
| TC-12   | FAILED |

The failed test cases were added as bugs to the bug report document.

Assertion pattern used for this feature:
- toHaveURL()
- toBeTruthy()
- toContainText()
- toHaveText()
- toBeVisible()

### FR-07

| Test ID | Status |
|---------|--------|
| TC-01   | FAILED |
| TC-02   | FAILED |
| TC-03   | PASSED |
| TC-04   | FAILED |
| TC-05   | PASSED |
| TC-06   | FAILED |
| TC-07   | FAILED |
| TC-08   | FAILED |
| TC-09   | PASSED |
| TC-10   | PASSED |
| TC-11   | FAILED |
| TC-12   | PASSED |

The failed test cases were added as bugs to the bug report document.

Assertion pattern used for this feature:
- toContainText()
- toBeVisible()
- toHaveCount()
- toHaveText()

Test case TC-11 could not be automated because `fill` function could not type text. Manual execution by typing letter 'e' directly into the input field on frontend web worked.

### FR-14

| Test ID | Status |
|---------|--------|
| TC-01   | PASSED |
| TC-02   | PASSED |
| TC-03   | FAILED |
| TC-04   | PASSED |
| TC-05   | PASSED |
| TC-06   | PASSED |
| TC-07   | PASSED |
| TC-08   | FAILED |
| TC-09   | FAILED |
| TC-10   | FAILED |
| TC-11   | FAILED |
| TC-12   | PASSED |

Assertion pattern used for this feature:
- toBeVisible()
- toBeGreaterThan()
- toHaveCount()
- toHaveText()
- toBeTruthy()
- toContainText()
- toBe()

## AI analysis

### FR-01

While the generated assertions used css locators, which can be vulnerable to changes in the UIs, it is acceptable because the current frontend implementation lacks support for more resilient locators like `getByLabel()`. One thing I dislike about the script is that there are too many if-else conditions. This can be troublesome when the number of test cases grows and more conditions are added. A better the way to write the script could be parsing the data first, then group test cases base on the conditions into separate `test.describe()` blocks, rather than relying on if-else branching. However, because the number of test cases for this feature in HW04 is small, the current script is acceptable as-is.

### FR-07

When iterating through the data-driven test cases, the script completely ignored the name of the item. While this did not affect the final test result, the script should utilize all the given data to create less fragile assertions. By also asserting for the item name, the tests would be able to spot when an incorrect item is added even if the quantity value is sound.

### FR-14

Again, the generated data-driven tests could really benefit from being grouped separately instead of depending on conditional checking. However, this time, the AI did slightly better by using switch-case style instead of if-else, which made the tests look way more readable compared to FR-01's.

# Appendices

## Appendix A

[AI Audit Report](./[AI-02]%20-%20FIT@HCMUS%20-%20AI%20Audit%20Report.md)

[AI Critique](./AI_critique.md)

## Appendix B

[Self-assessment & Test summary report](./README.md)