# JMeter Test Plan — EShop Performance Test (HW05)

Covers the 4 APIs: **Login → Get Product Detail → Add to Cart → Checkout**, with 3 CSV Data Set Configs and token correlation via JSON Extractor.

## Test Plan tree (target structure)

```
Test Plan
└── Thread Group
    ├── CSV Data Set Config — users.csv
    ├── CSV Data Set Config — cart.csv
    ├── CSV Data Set Config — checkout.csv
    ├── HTTP Request Defaults
    ├── HTTP Header Manager (Content-Type: application/json)
    ├── HTTP Request — 01_Login  [POST /api/login]
    │   ├── JSON Extractor (token → authToken)
    │   └── Response Assertion (code = 200)
    ├── HTTP Header Manager (Authorization: Bearer ${authToken})
    ├── HTTP Request — 02_GetProductDetail  [GET /api/products/${product_id}]
    ├── HTTP Request — 03_AddToCart  [POST /api/cart]
    └── HTTP Request — 04_Checkout  [POST /api/checkout]
├── View Results Tree (debug only — disable for real load runs)
├── Aggregate Report
└── Summary Report
```

---

## 1. Thread Group

- Right-click Test Plan → Add → Threads (Users) → Thread Group.
- **Number of Threads (users):** e.g. 20 (start small, scale up per your load scenario).
- **Ramp-up period (seconds):** e.g. 20 (1 thread/sec).
- **Loop Count:** e.g. 5, or check "Infinite" + use a Duration/Scheduler if you need a time-boxed test.
- Leave "Same user on each iteration" unchecked unless you specifically want each thread to reuse the same CSV row across loops.

---

## 2. CSV Data Set Config (x3)

Add each as **Config Element → CSV Data Set Config**, placed directly under the Thread Group (order doesn't matter between the three, but they must all be above the samplers that use them).

### 2.1 users.csv

| Field | Value |
|---|---|
| Filename | `users.csv` (or full path if not in the script's working dir) |
| File Encoding | `UTF-8` |
| Variable Names | `email,password` |
| Ignore First Line | **True** (file has a header row) |
| Delimiter | `,` |
| Allow quoted data? | True |
| Recycle on EOF | True |
| Stop thread on EOF | False |
| Sharing mode | **All threads** |

### 2.2 cart.csv

| Field | Value |
|---|---|
| Filename | `cart.csv` |
| File Encoding | `UTF-8` |
| Variable Names | `product_id,product_name,price,quantity` |
| Ignore First Line | **True** |
| Delimiter | `,` |
| Allow quoted data? | True |
| Recycle on EOF | True |
| Sharing mode | **All threads** |

### 2.3 checkout.csv

| Field | Value |
|---|---|
| Filename | `checkout.csv` |
| File Encoding | `UTF-8` |
| Variable Names | `total_amount,shipping_address` |
| Ignore First Line | **True** |
| Delimiter | `,` |
| Allow quoted data? | True |
| Sharing mode | **All threads** |

> ⚠️ **Vietnamese text tip:** `shipping_address` contains diacritics and embedded commas (e.g. `"227 Nguyen Van Cu, Quan 5, TP.HCM"`). Keep File Encoding = UTF-8, and verify in a debug run (View Results Tree → Request tab) that `${shipping_address}` renders the full quoted string, not just `227 Nguyen Van Cu`. If JMeter splits on the embedded comma, either re-export the CSV with a different delimiter (e.g. `;`) and update the Delimiter field accordingly, or strip commas from the address values.

> ⚠️ **Sharing mode "All threads"** ensures concurrent threads pull *different* rows instead of racing for the same row — important for `users.csv` so you don't get many threads logging in as the same account simultaneously.

---

## 3. HTTP Request Defaults

Add **Config Element → HTTP Request Defaults** under the Thread Group (above the samplers):

- Protocol: `http`
- Server Name or IP: `localhost`
- Port Number: `3000`

This means each individual HTTP Request sampler below only needs to specify its **Path** and **Method** — no need to repeat host/port each time.

---

## 4. HTTP Header Manager — Content-Type (global)

Add **Config Element → HTTP Header Manager**, placed near the top of the Thread Group (applies to all samplers below it):

| Name | Value |
|---|---|
| `Content-Type` | `application/json` |

---

## 5. Sampler 01 — Login (Auth-heavy)

**HTTP Request:**
- Name: `01_Login`
- Method: `POST`
- Path: `/api/login`
- Body Data (raw JSON):
```json
{
  "email": "${email}",
  "password": "${password}"
}
```

### 5.1 JSON Extractor (child of 01_Login)

Add **Post Processor → JSON Extractor**:

| Field | Value |
|---|---|
| Apply to | Main sample only |
| Names of created variables | `authToken` |
| JSON Path expressions | `$.token` |
| Match No. | 1 |
| Default Values | `TOKEN_NOT_FOUND` |

> The API spec says the login response returns a JWT `token` plus `user` info but doesn't fix the exact field name. Run one request in View Results Tree first, inspect the actual JSON body, and adjust the JSON Path (`$.token`, `$.data.token`, `$.accessToken`, etc.) to match the real field. Setting a visible default (`TOKEN_NOT_FOUND`) makes broken extraction obvious immediately in later requests instead of silently failing.

### 5.2 Response Assertion (child of 01_Login, optional but recommended)

Add **Assertions → Response Assertion**: Field to test = "Response Code", Pattern = `200`. This flags login failures (e.g. from FR-02 lockout if a password ever mismatches) clearly in your report instead of letting a bad token cascade into failures on every later step.

---

## 6. HTTP Header Manager — Authorization (Bearer token)

Add another **HTTP Header Manager**, placed **after** `01_Login` and **before** the three authenticated samplers, directly under the Thread Group:

| Name | Value |
|---|---|
| `Authorization` | `Bearer ${authToken}` |

Because it sits after the Login sampler in the same scope, it applies to every sampler below it (`02_GetProductDetail`, `03_AddToCart`, `04_Checkout`) without needing to duplicate it per request. `${authToken}` is re-evaluated per request from the variable set by the JSON Extractor on each iteration.

---

## 7. Sampler 02 — Get Product Detail (Read-heavy)

- Name: `02_GetProductDetail`
- Method: `GET`
- Path: `/api/products/${product_id}`

`${product_id}` comes from `cart.csv`.

---

## 8. Sampler 03 — Add to Cart (Transactional)

- Name: `03_AddToCart`
- Method: `POST`
- Path: `/api/cart`
- Body Data (raw JSON):
```json
{
  "id": ${product_id},
  "name": "${product_name}",
  "price": ${price},
  "quantity": ${quantity}
}
```
(`id`, `price`, `quantity` are numeric — no quotes; `product_name` is a string — keep the quotes.)

---

## 9. Sampler 04 — Checkout (Transactional)

- Name: `04_Checkout`
- Method: `POST`
- Path: `/api/checkout`
- Body Data (raw JSON):
```json
{
  "total_amount": ${total_amount},
  "shipping_address": "${shipping_address}"
}
```

> Note for your test design (not a JMeter setting): per the README, the backend is *supposed* to recalculate `total_amount` server-side and ignore the client value (FR-08). If your homework also covers functional correctness, this is a good candidate for a separate assertion checking whether the returned order total actually matches the cart contents rather than the client-sent `total_amount`.

---

## 10. Listeners (for reporting, not needed during script build)

Add under the Thread Group:
- **View Results Tree** — for debugging only; disable ("Add → Listener", right-click → Disable) before running real load, since it consumes heavy memory at scale.
- **Aggregate Report** — throughput, average/min/max/90-95-99th percentile response times, error %.
- **Summary Report** — quick per-sampler pass/fail counts.

For real load runs, prefer running via CLI (`jmeter -n -t plan.jmx -l results.jtl`) and generating an HTML dashboard report afterward (`jmeter -g results.jtl -o report/`), rather than running with the GUI + listeners attached.

---

## 11. Common pitfalls to double-check before your run

1. **Token field name mismatch** — verify `$.token` against the real login response JSON.
2. **CSV row starvation** — with only 2 rows in `users.csv` and many threads/loops, "Recycle on EOF" = True is essential or threads will error out once rows run out.
3. **Encoding** — set UTF-8 everywhere (CSV Data Set Config *and* HTTP Header Manager's `Content-Type: application/json; charset=UTF-8` if the server is strict about it) so Vietnamese address text isn't mangled.
4. **Header Manager scope/order** — the Bearer-token Header Manager must be positioned *after* `01_Login` in the tree; if placed above it, `${authToken}` won't exist yet on the first request of each iteration (though it will still resolve correctly on subsequent iterations since JMeter re-evaluates the header at request time — so a misplaced order mainly breaks the very first call).
5. **Lockout logic (FR-02)** — since all credentials in `users.csv` are valid, you shouldn't trigger the 3-strikes/30s lockout. If you want a separate test scenario to specifically validate FR-02, that needs its own Thread Group sending intentionally wrong passwords 3+ times in a row for one fixed user.
