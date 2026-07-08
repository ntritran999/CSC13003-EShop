# User guide <!-- omit in toc -->

# Table of contents <!-- omit in toc -->
- [1. Introduction](#1-introduction)
- [2. Installation](#2-installation)
- [3. First test](#3-first-test)
- [4. Advanced Usage](#4-advanced-usage)
  - [Different scopes of variables](#different-scopes-of-variables)
  - [Postman for CI/CD](#postman-for-cicd)
  - [Postman's AI assistant](#postmans-ai-assistant)
- [5. Troubleshooting](#5-troubleshooting)
- [6. Failure Modes](#6-failure-modes)
- [7. References](#7-references)

## 1. Introduction

## 2. Installation

**Operating system note**: Windows will be the main operating system used in this guide, as well as in the demonstration video and later stages of the seminar.

First, to install Postman desktop app latest version, visit Postman's official website: [Download Postman](https://www.postman.com/downloads/).

After the download finishes, run the Postman installer, then sign in with your Postman account.

![](./images/signin.png)

After successful login, you will be redirected to your workspace. Depending on your account state(fresh account or old account), your workspace might look different from what is shown in the following image:

![](./images/workspace.png)

Next, we will import the end to end collection to the current workspace. At the search bar above the **Collections** list, click the ellipsis icon ('...') and click on **Import**. This will open an interface to select collections from local disk.

![](./images/import1.png)

![](./images/import2.png)

![](./images/import3.png)

The final result should look similar to this:

![](./images/import4.png)

You can review the collection variables by clicking the **Variables** tab. The URL for the backend is set here.

![](./images/variable.png)

For the final step of the installation, start the backend and run the **Admin Login** request with the **Send** button. If it returns HTTP status 200 along with the access token then you are good to continue. If not, please review this section again.

![](./images/smoke-test.png)

## 3. First test

The scenario chosen for this section is the end-to-end flow for creating a new coupon as an admin, then applying it as an user. This section focuses on demonstrating how to run the collection for the scenario.

**Requirements**:
- Postman desktop already installed.
- The E2E(end-to-end) coupon flow Postman collection is imported.
- The EShop's backend is running.
- The baseUrl variable points to the correct running backend(default is localhost:3000).

**Steps**:
- Run *Admin Login* request. This request saves the admin authorization token to the `adminToken` variable, allowing the rest of the requests to admin APIs to run correctly.
- Run *Admin Create Coupon* request. The `couponCode` variable is generated randomly to avoid getting duplicated code.
- Run *Admin View Coupon List* request to review the created coupon.
- Run *User Login* request. This request saves the user authorization token to the `userToken` variable and sets the `userId` variable, which will then be used to apply the coupon.
- Run *User Apply Coupon* request with using `userId` and `couponCode` saved from previous requests.
- Run *Admin Create Another Coupon* request. This sets the `couponToDeleteId` variable.
- Run *Admin Delete Coupon* request to delete the `couponToDeleteId` coupon.
- Run *Admin Verify Deleted Coupon* request to confirm that the coupon is deleted.

The above steps can also be run all at once using collection runner.

## 4. Advanced Usage

### Different scopes of variables

Postman supports different scopes for storing variables. You can store variables directly inside collections, or you can store them in environments instead.

You can create a new environment and select it when you run a request or a collection, or you can store variables at global scope and invoke them from any collections.

Because Postman prioritizes environment variables over collection variables when an environment is selected, if both have variables with the same name, the environment variable will be used for the run instead.

In the E2E coupon collection, `baseUrl` is a collection variable, which is manually set before running the requests. For other variables like `adminToken`, `userToken`, `couponCode`, etc, they are set dynamically by the test scripts during the execution of the collection. The collection also uses a built-in variable, `$randomInt` in the pre-request of the *Admin Create Coupon* API to create unique coupon code.

### Postman for CI/CD

Postman also support CI/CD configuration for automated collection runs. You can find the settings to work with CI/CD when choosing automate runs option in the collection runner dashboard.

Depending on your setups, you can choose which collection and environment you want to run on CI/CD, along with the CI/CD provider and operating system for CI/CD. Regardless of what options are picked, you must provide a Postman API key to log in to Postman CLI. The API key can be generated directly inside the Postman desktop app, or you can go to the browser and log in Postman with your account, then create the API key. Remember that you can only view the key once, so if you forget then you will have to create a new one.

For our E2E coupon collection, we decided to use Github Actions as the CI/CD provider. The workflow skeleton was copied from Postman dashboard, then modified to include steps to install dependencies and start the EShop backend. We also changed the generated workflow from running on push, meaning that the collection would run on CI/CD for every commit pushed to main branch, to running manually(useful for later demonstration). For the API key, we created a secret key in our EShop's Github repository and copied the key value to it.

### Postman's AI assistant

Postman includes a chat interface for its AI assistant, similar to ChatGPT or Claude. You can use it to create collections, design API endpoints or write documentations.

On free account, Postman limits the AI usage to 50 AI credits per month, which is plenty if you only intend to use it to scaffold collections based on your API specifications.

Although Postman's AI is fast when generating collections, a review is always needed to ensure the collection is executable and tests written for API follow the business logics correctly, especially when the API specification given to the AI lacks details about the expected output of each requests. Section **6. Failure Modes** will provide more insights on this issue.

## 5. Troubleshooting

## 6. Failure Modes

## 7. References