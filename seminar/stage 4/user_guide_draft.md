# User guide <!-- omit in toc -->

# Table of contents <!-- omit in toc -->
- [1. Introduction](#1-introduction)
- [2. Installation](#2-installation)
- [3. First test](#3-first-test)
- [4. Advanced Usage](#4-advanced-usage)
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
- Run *Admin Login* request. This request sets the `adminToken` variable, allowing the rest of the requests to admin APIs to run correctly.
- Run *Admin Create Coupon* request. The `couponCode` variable is generated randomly to avoid getting duplicated code.
- Run *Admin View Coupon List* request to review the created coupon.
- Run *User Login* request. This request sets the `userId` variable, which will then be used to apply the coupon.
- Run *User Apply Coupon* request with the generated `couponCode` before.
- Run *Admin Create Another Coupon* request. This sets the `couponToDeleteId` variable.
- Run *Admin Delete Coupon* request.
- Run *Admin Verify Deleted Coupon* request to confirm that the coupon is deleted.

The above steps can be run automatically with a single button, using collection runner.

## 4. Advanced Usage

## 5. Troubleshooting

## 6. Failure Modes

## 7. References