# Postman, Newman, and CI execution guide


## 1. Postman features used

| Required feature | How it is used |
| --- | --- |
| Workspace | Create one workspace named `HW06 API Testing - 23127234` and keep the three imported collections together. |
| Collection | One Postman Collection v2.1 file represents each final test pool. |
| Variable | Collection variables hold `baseUrl`, `studentId`, local credentials, runtime JWTs, fixture IDs, category IDs, and unique test suffixes. |
| Pre-request script | A collection-level script upserts `X-Student-Id: {{studentId}}` on every normal request. Every request made from a script with `pm.sendRequest` also declares this header explicitly. |
| Post-response test script | `pm.test` and `pm.expect` validate status, JSON/schema, security behavior, state postconditions, isolation, and cleanup. |
| Collection Runner | Runs each pool in its saved order inside the Postman desktop app. |
| Newman + HTML reporter | Runs the same exported collections locally and creates shareable HTML evidence. |
| Postman CLI via CI | `.github/workflows/hw06-postman.yml` runs all three local collection files in GitHub Actions. |

## 2. Prerequisites and safe variables
Set these collection variables in Postman before running:

| Variable | Pool | Value / handling |
| --- | --- | --- |
| `baseUrl` | A, B, C | `http://localhost:3000` |
| `studentId` | A, B, C | `23127234` |
| `adminEmail`, `adminPassword` | B, C | admin@eshop.com; Admin123!|
| `userEmail`, `userPassword` | B, C | test@eshop.com; Test1234! |
| `jwtSecret` | B only | super_secret_key_that_should_not_be_here |

## 3. Run in Postman Desktop

1. Start the backend
2. Import all  `*.postman_collection.json` files in this folder.
4. Set variable in section 2
8. Run for Pools A, B, and C. Restart from a clean database if fixture collisions affect a repeat run.

The first request in each collection is runtime setup and is intentionally not named with a `TC-*` ID. Pool B and C test requests create independent fixtures so a failed transition does not invalidate later test cases.

## 4. Run locally with Newman and produce HTML reports

From the `postman` folder, install the pinned local dependencies:

```powershell
npm ci
```

Set credentials only in the current PowerShell process. The values below are placeholders; do not paste real values into this guide or source control.

```powershell
$env:HW06_ADMIN_EMAIL = 'admin@eshop.com'
$env:HW06_ADMIN_PASSWORD = 'Admin123!'
$env:HW06_USER_EMAIL = 'test@eshop.com'
$env:HW06_USER_PASSWORD = 'Test1234!'
$env:HW06_JWT_SECRET = 'super_secret_key_that_should_not_be_here'
```
```
npx --no-install newman run '.\pool_A_FR05_final_testcases.postman_collection.json' `
  --env-var 'baseUrl=http://localhost:3000' `
  --env-var 'studentId=23127234' `
  --reporters "cli,htmlextra" `
  --reporter-htmlextra-export '..\reports\newman\pool_A_FR05_report.html' `
  --reporter-htmlextra-skipSensitiveData

npx --no-install newman run '.\pool_B_FR10_final_testcases.postman_collection.json' `
  --env-var 'baseUrl=http://localhost:3000' `
  --env-var 'studentId=23127234' `
  --env-var "adminEmail=$env:HW06_ADMIN_EMAIL" `
  --env-var "adminPassword=$env:HW06_ADMIN_PASSWORD" `
  --env-var "userEmail=$env:HW06_USER_EMAIL" `
  --env-var "userPassword=$env:HW06_USER_PASSWORD" `
  --env-var "jwtSecret=$env:HW06_JWT_SECRET" `
  --reporters "cli,htmlextra" `
  --reporter-htmlextra-export '..\reports\newman\pool_B_FR10_report.html' `
  --reporter-htmlextra-skipSensitiveData


npx --no-install newman run '.\pool_C_FR15_final_testcases.postman_collection.json' `
  --env-var 'baseUrl=http://localhost:3000' `
  --env-var 'studentId=23127234' `
  --env-var "adminEmail=$env:HW06_ADMIN_EMAIL" `
  --env-var "adminPassword=$env:HW06_ADMIN_PASSWORD" `
  --env-var "userEmail=$env:HW06_USER_EMAIL" `
  --env-var "userPassword=$env:HW06_USER_PASSWORD" `
  --reporters "cli,htmlextra" `
  --reporter-htmlextra-export '..\reports\newman\pool_C_FR15_report.html' `
  --reporter-htmlextra-skipSensitiveDatav
```


```powershell
npm run sanitize:reports
```

The project uses the community `htmlextra` package for the detailed local HTML view. Newman also has an official built-in [HTML reporter](https://github.com/postmanlabs/newman-reporter-html) if the lecturer requires only Postman-maintained reporters.

