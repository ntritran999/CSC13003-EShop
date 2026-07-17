
# Automated Collection & Test Generation Using PostBot AI

## Introduction.

Within the Postman API testing tool, there's an integrated AI tool called PostBot, a chatbot that we can interact with. One of its main functions is to create collections and test scripts based on user prompt requests directly within Postman.

---

## The Sample prompt.

To achieve the best results, we supply PostBot with the complete content of our `api_specification.md` alongside a well-structured, explicit prompt constraint.

### The sample Prompt:

> [Paste the full text of your `api_specification.md` here]
> **Context & Instructions:**
> This is the API specification for Eshop. Please create a new collection and write test scripts for login with admin account in this collection. Use collection variables; do not use environment or global variables. The admin's email is admin@eshop.com and the password is Admin123!

---

## Step-by-Step Implementation

### Step 1: Open Postman and PostBot.

### Step 2: Prompt.

### Step 3: Review the Generated Collection

After PostBot finishes processing, a completely new collection will appear in your sidebar's list of collections. We must review the following components:

* **Request Structure:** A `POST` request mapped exactly to the `/api/login` endpoint as specified in the markdown documentation.
* **Payload Body:** The JSON payload should automatically populate with:
```json
{
  "email": "admin@eshop.com",
  "password": "Admin123!"
}

```

### Step 4: Run the test script and verify the scripts.

- We run the newly created request after verifying that the payload body and URL are correct.
- Check the scripts that passed and failed. For the failed scripts, re-check whether the script correctly formatted the returned response.
- Finally, check if the variables have been saved correctly in the collection.

