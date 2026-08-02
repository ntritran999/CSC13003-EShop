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



### Pool C: FR-14: Category management (CRUD)

In HW02, I chose FR-12: Access control for Pool C, but that FR cannot be used for automation testing, so in HW04, I changed to FR-14 (this FR is ensured to not be duplicated among the members of the group).

Test cases:



## Execution

- Used Playwright default configuration for projects to run on 3 major browsers (Chrome, Firefox, Webkit).
- Added HTML as a reporter to Playwright configuration, along with the `title` option for HTML reporter.

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

## AI analysis

### FR-01

While the generated assertions used css locators, which can be vulnerable to changes in the UIs, it is acceptable because the current frontend implementation lacks support for more resilient locators like `getByLabel()`. One thing I dislike about the script is that there are too many if-else conditions. This can be troublesome when the number of test cases grows and more conditions are added. A better the way to write the script could be parsing the data first, then group test cases base on the conditions into separate `test.describe()` blocks, rather than relying on if-else branching. However, because the number of test cases for this feature in HW04 is small, the current script is acceptable as-is.

# Appendices

## Appendix A

[AI Audit Report](./[AI-02]%20-%20FIT@HCMUS%20-%20AI%20Audit%20Report.md)

[AI Critique](./AI_critique.md)

## Appendix B

[Self-assessment & Test summary report](./README.md)