# Bug report

# Bug 01:

Description: Registration failed with valid data

Steps:
- Go to Register page (http://localhost:5173/register)
- Fill 'Nguyen Van A' for Full name, 'newuser@gmail.com' for Email, 'Abc1234@' for Password.
- Hit submit

Expected result: Registration successful, redirect to /login

Actual result: Registration failed, Password strength error

Screenshots:

![](./images/bugs/bug01.png)

# Bug 02:

Description: Registration failed with unexpected result for invalid format email input

Steps:
- Go to Register page (http://localhost:5173/register)
- Fill 'Nguyen Van A' for Full name, 'abcgmail.com' for Email, 'Abc1234@' for Password.
- Hit submit

Expected result: Message 'Đăng ký thất bại.' is displayed

Actual result: Password strength error displayed

Screenshots:

![](./images/bugs/bug02.png)

# Bug 03:

Description: Registration failed with unexpected result for duplicated email input

Steps:
- Go to Register page (http://localhost:5173/register)
- Fill 'Nguyen Van A' for Full name, 'test@eshop.com' for Email, 'Abc1234@' for Password.
- Hit submit

Expected result: Message 'Đăng ký thất bại.' is displayed

Actual result: Password strength error displayed

Screenshots:

![](./images/bugs/bug03.png)

# Bug 04:

Description: Confirm password field does not exist

Steps:
- Go to Register page (http://localhost:5173/register)
- Observe the registration form

Expected result: A field with label 'Xác nhận mật khẩu' exists

Actual result: No confirm password field

Screenshots:

![](./images/bugs/bug04.png)