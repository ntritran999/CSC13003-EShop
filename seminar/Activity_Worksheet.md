# Learning objectives

This activity aims to give teams quick hands-on experience using Postman for API testing and help them get familiar with the tool. Through this activity, teams will also learn how to utilize Postman’s built-in AI assistant to support their testing.

By the end of this activity, the teams will be able to:
- Manually perform API testing with Postman.
- Identify a commmon failure mode in Postman and how to mitigate it.
- Leverage AI tool to automate collection and test scripts generation.

# Prerequisites
- Postman desktop app is installed. Alternatively, Postman web app can be used for this activity.
- EShop backend is ready to run with `node server.js`.
- Already reviewed pre-share materials: User_Guide.md, Demo_Screencast.mp4, Activity_Worksheet.md, Seminar_Slides.pptx.

# Activity overview: 
- Estimated time: 18 - 20 minutes 

# Main exercises:

## Manual API Testing with Postman

### 1. Introduction
In this section, we will simulate the daily workflow of a QA/QC when performing manual API testing (Manual API Testing). By using the basic Postman tool without the assistance of AI, you will manually configure the request, pass data (token) between steps, and write a test script to verify a logic "loophole" of the system.

### 2. Purpose
* Experience the practical difficulty of manually copying/pasting data (Token) between APIs.
* Understand how to write basic test scripts using Javascript in Postman.
* Identify the risk of "Missing Mandatory Data" (Mode 3) - the system does not validate input data.


### 3. Execution Scenario (For Audience)

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


### 4. Standard Answer (Answer Key)

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


### 5. Lessons Learned after the Experiment
Through this short activity, we clearly see:
1. **The inconvenience of the Manual Flow:** Manually copying the Token from the Login API and pasting it to the Coupons API takes time and is prone to errors if extra spaces are accidentally copied. If running a flow of 10 consecutive APIs, this operation will become a bottleneck.
2. **The trap of Status 200 OK (Failure Mode 3):** If QA only glances and sees HTTP Status 200 (green) without writing a strict Test Script (or missing a test case scenario), a very serious error (Coupon has no expiration date) will leak into the Production environment.

## Automated Collection & Test Generation Using PostBot AI

### 1. Introduction.

Within the Postman API testing tool, there's an integrated AI tool called PostBot, a chatbot that we can interact with. One of its main functions is to create collections and test scripts based on user prompt requests directly within Postman.

---

### 2. The Sample prompt.

To achieve the best results, we supply PostBot with the complete content of our `api_specification.md` alongside a well-structured, explicit prompt constraint.

#### The sample Prompt:

> [Paste the full text of your `api_specification.md` here]
> **Context & Instructions:**
> This is the API specification for Eshop. Please create a new collection and write test scripts for login with admin account in this collection. Use collection variables; do not use environment or global variables. The admin's email is admin@eshop.com and the password is Admin123!

---

### 3. Step-by-Step Implementation

#### Step 1: Open Postman and PostBot.

#### Step 2: Prompt.

#### Step 3: Review the Generated Collection

After PostBot finishes processing, a completely new collection will appear in your sidebar's list of collections. We must review the following components:

* **Request Structure:** A `POST` request mapped exactly to the `/api/login` endpoint as specified in the markdown documentation.
* **Payload Body:** The JSON payload should automatically populate with:
```json
{
  "email": "admin@eshop.com",
  "password": "Admin123!"
}

```

#### Step 4: Run the test script and verify the scripts.

- We run the newly created request after verifying that the payload body and URL are correct.
- Check the scripts that passed and failed. For the failed scripts, re-check whether the script correctly formatted the returned response.
- Finally, check if the variables have been saved correctly in the collection.

### 4. Standard Answer (Answer Key)

For Instructors/Facilitators to cross-check the AI's output against the expected standard:

Standard Test Script Generated by PostBot (Tests Tab):

```javascript
// Verify successful authentication
pm.test("Status code is 200 OK", function () {
    pm.response.to.have.status(200);
});

// Enforce dynamic token chaining using collection variables
pm.test("Admin token is saved securely", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.token).to.not.be.null;
    pm.collectionVariables.set("adminToken", jsonData.token);
});

```

Expected Behavior:

* **AI Flow (PostBot):** PostBot instantly generates a script that extracts the token and saves it to the variables. The test will automatically **PASS** because the admin account details match the specification database.



### 5. Lessons Learned after the Experiment

Through this automation activity with PostBot, we clearly see the distinct shift from manual labor to AI assistance:

* **No More Manual Copy-Paste:** Manual testing forces you to manually copy the token from the Login API and paste it into the next requests. PostBot eliminates this bottleneck by automatically writing the data chaining logic in seconds.


* **Catching Hidden Bugs:** Testers easily fall into the "Status 200 OK" trap, thinking the API is fine just because it's green. PostBot automatically creates strict `pm.test` scripts to validate the response data structure, catching bugs that humans might miss.


* **Clean Code and Scoping:** By forcing the AI to use Collection Variables, we keep our Postman workspace clean and prevent token conflicts between different projects.

---

# Review questions:

- Question 1: What is a common failure mode when using Postman for API testing? How do we avoid it?
- Question 2: What are the common hallucinations of AI when creating new collections and test scripts?