# Practical Exercise: Manual API Testing with Postman

## 1. Introduction
In this section, we will simulate the daily workflow of a QA/QC when performing manual API testing (Manual API Testing). By using the basic Postman tool without the assistance of AI, you will manually configure the request, pass data (token) between steps, and write a test script to verify a logic "loophole" of the system.

## 2. Purpose
* Experience the practical difficulty of manually copying/pasting data (Token) between APIs.
* Understand how to write basic test scripts using Javascript in Postman.
* Identify the risk of "Missing Mandatory Data" (Mode 3) - the system does not validate input data.


## 3. Execution Scenario (For Audience)

**Estimated time:** 8 - 10 minutes.

**Requirement 1: Login with Admin privileges to get Token**
1. Create a new Request in Postman, select the `POST` method.
2. Enter URL: `http://localhost:3000/api/login`
3. In the **Body** tab, select `raw` and `JSON` format, then enter the Admin login information:
   ```json
   {
     "email": "admin@eshop.com",
     "password": "Admin123!"
   }
   ```
4. Click **Send**. In the Response window below, find the `token` string and manually copy it.

**Requirement 2: Create a new Coupon (Intentionally create an error)**
1. Create a second Request, `POST` method.
2. Enter URL: `http://localhost:3000/api/admin/coupons`
3. Switch to the **Authorization** tab, select Type as `Bearer Token`, and paste the token string you just copied in Requirement 1 here.
4. In the **Body** tab (`raw` -> `JSON`), enter the payload to create a Coupon, but **intentionally omit the `expired_at` field (Expiration date)**:
   ```json
   {
     "code": "TEST_MANUAL_01",
     "type": "percent",
     "discount_value": 15,
     "min_order_amount": 0,
     "max_uses_per_user": 1
   }
   ```

**Requirement 3: Write a Test Script for verification**
A standard API when missing a mandatory field (`expired_at`) must return the error code `400 Bad Request`. 
1. Switch to the **Tests** tab of the Create Coupon request.
2. Write Javascript code to ask Postman to check that the returned status code must be `400`.
3. Click **Send** and observe the **Test Results** tab. 
   *(Note: If the system has a validation error, the API will return 200 OK and your Test will report FAILED).*


## 4. Standard Answer (Answer Key)

For Instructors/Facilitators to cross-check:

**Standard script for Requirement 3 (Tests Tab):**
```javascript
pm.test("Status code is 400 Bad Request due to missing expired_at", function () {
    pm.response.to.have.status(400);
});
```

**Expected Behavior:**
* If the system is coded standardly: Returns `400 Bad Request`, test script reports **PASS**.
* If the system has an error (assumed according to the lesson scenario): Returns `200 OK` (still successfully creates the discount code despite missing the expiration date). Test script reports **FAIL**.


## 5. Lessons Learned after the Experiment
Through this short activity, we clearly see:
1. **The inconvenience of the Manual Flow:** Manually copying the Token from the Login API and pasting it to the Coupons API takes time and is prone to errors if extra spaces are accidentally copied. If running a flow of 10 consecutive APIs, this operation will become a bottleneck.
2. **The trap of Status 200 OK (Failure Mode 3):** If QA only glances and sees HTTP Status 200 (green) without writing a strict Test Script (or missing a test case scenario), a very serious error (Coupon has no expiration date) will leak into the Production environment.