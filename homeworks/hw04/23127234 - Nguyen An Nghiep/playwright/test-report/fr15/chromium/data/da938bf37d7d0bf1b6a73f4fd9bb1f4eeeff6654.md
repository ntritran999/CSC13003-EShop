# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr15.product-crud.spec.ts >> FR-15 Product CRUD - Run by: 23127234 >> TC_FR15_21 - unauth-create - http-401
- Location: tests\fr15.product-crud.spec.ts:170:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 401
Received: 200
```

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  [{"category_id": 1, "description": "HW04 unauthenticated authorization check", "id": 22, "imageUrl": "https://placehold.co/100", "name": "HW04 Unauthorized Create-TC_FR15_21-chromium", "price": 100000}]
```

# Test source

```ts
  97  |       description: "HW04 Playwright data",
  98  |       imageUrl: "https://placehold.co/100",
  99  |       category_id: 1,
  100 |     },
  101 |   });
  102 |   expect(response.status()).toBe(200);
  103 |   return (await response.json()).id;
  104 | }
  105 | 
  106 | async function deleteProductApi(
  107 |   request: APIRequestContext,
  108 |   adminToken: string,
  109 |   id: number,
  110 | ): Promise<void> {
  111 |   const response = await request.delete(`${API_URL}/api/products/${id}`, {
  112 |     headers: { Authorization: `Bearer ${adminToken}` },
  113 |   });
  114 |   expect(response.status()).toBe(200);
  115 | }
  116 | 
  117 | async function cleanupByName(
  118 |   request: APIRequestContext,
  119 |   adminToken: string,
  120 |   name: string,
  121 | ): Promise<void> {
  122 |   if (!name) return;
  123 |   const matches = (await products(request)).filter(
  124 |     (product) => product.name === name,
  125 |   );
  126 |   for (const product of matches) {
  127 |     await deleteProductApi(request, adminToken, product.id);
  128 |   }
  129 |   const remaining = (await products(request)).filter(
  130 |     (product) => product.name === name,
  131 |   );
  132 |   expect(remaining).toHaveLength(0);
  133 | }
  134 | 
  135 | async function selectCsvCategory(
  136 |   form: Locator,
  137 |   categoryStrategy: string,
  138 | ): Promise<number> {
  139 |   if (categoryStrategy !== "first") {
  140 |     throw new Error(`Unsupported create category strategy: ${categoryStrategy}`);
  141 |   }
  142 |   const category = form.locator("select");
  143 |   const firstValue = await category
  144 |     .locator('option:not([value=""])')
  145 |     .first()
  146 |     .getAttribute("value");
  147 |   expect(firstValue).not.toBeNull();
  148 |   await category.selectOption(firstValue!);
  149 |   return Number(firstValue);
  150 | }
  151 | 
  152 | function productName(row: Fr15Row, browser: string): string {
  153 |   const length = row["Name Length"] ? Number(row["Name Length"]) : undefined;
  154 |   if (length === 0) return "";
  155 |   if (length !== undefined) {
  156 |     const prefix = `${row["Test ID"]}-${browser}-`;
  157 |     return (prefix + "x".repeat(length)).slice(0, length);
  158 |   }
  159 |   return `${row.Name}-${row["Test ID"]}-${browser}`;
  160 | }
  161 | 
  162 | function rowByName(page: Page, name: string) {
  163 |   return page.locator("table tbody tr").filter({
  164 |     has: page.getByRole("cell", { name, exact: true }),
  165 |   });
  166 | }
  167 | 
  168 | test.describe("FR-15 Product CRUD - Run by: 23127234", () => {
  169 |   for (const row of rows) {
  170 |     test(`${row["Test ID"]} - ${row.Action} - ${row.Expected}`, async ({
  171 |       page,
  172 |       request,
  173 |     }, testInfo) => {
  174 |       const name = productName(row, testInfo.project.name);
  175 |       const adminToken = await loginApi(request, ADMIN_EMAIL, ADMIN_PASSWORD);
  176 |       await cleanupByName(request, adminToken, name);
  177 |       if (name) {
  178 |         await cleanupByName(request, adminToken, `${name}-updated`);
  179 |         await cleanupByName(request, adminToken, `${name}-user-update`);
  180 |       }
  181 | 
  182 |       if (row.Action === "unauth-create") {
  183 |         try {
  184 |           const response = await request.post(`${API_URL}/api/products`, {
  185 |             data: {
  186 |               name,
  187 |               price: Number(row.Price),
  188 |               description: "HW04 unauthenticated authorization check",
  189 |               imageUrl: "https://placehold.co/100",
  190 |               category_id: 1,
  191 |             },
  192 |           });
  193 |           expect.soft(response.status()).toBe(401);
  194 |           const matches = (await products(request)).filter(
  195 |             (product) => product.name === name,
  196 |           );
> 197 |           expect(matches).toHaveLength(0);
      |                           ^ Error: expect(received).toHaveLength(expected)
  198 |         } finally {
  199 |           await cleanupByName(request, adminToken, name);
  200 |         }
  201 |         return;
  202 |       }
  203 | 
  204 |       if (row.Action === "user-update" || row.Action === "user-delete") {
  205 |         const userToken = await loginApi(request, USER_EMAIL, USER_PASSWORD);
  206 |         const productId = await createProductApi(
  207 |           request,
  208 |           adminToken,
  209 |           name,
  210 |           Number(row.Price),
  211 |         );
  212 |         try {
  213 |           if (row.Action === "user-update") {
  214 |             const response = await request.put(
  215 |               `${API_URL}/api/products/${productId}`,
  216 |               {
  217 |                 headers: { Authorization: `Bearer ${userToken}` },
  218 |                 data: {
  219 |                   name: `${name}-user-update`,
  220 |                   price: Number(row.Price),
  221 |                   description: "Unauthorized regular-user update",
  222 |                   imageUrl: "https://placehold.co/100",
  223 |                   category_id: 1,
  224 |                 },
  225 |               },
  226 |             );
  227 |             expect.soft(response.status()).toBe(403);
  228 |             const stored = (await products(request)).filter(
  229 |               (product) => product.id === productId,
  230 |             );
  231 |             expect(stored).toHaveLength(1);
  232 |             expect(stored[0].name).toBe(name);
  233 |           } else {
  234 |             const response = await request.delete(
  235 |               `${API_URL}/api/products/${productId}`,
  236 |               {
  237 |                 headers: { Authorization: `Bearer ${userToken}` },
  238 |               },
  239 |             );
  240 |             expect.soft(response.status()).toBe(403);
  241 |             const stored = (await products(request)).filter(
  242 |               (product) => product.id === productId,
  243 |             );
  244 |             expect(stored).toHaveLength(1);
  245 |           }
  246 |         } finally {
  247 |           await deleteProductApi(request, adminToken, productId);
  248 |         }
  249 |         return;
  250 |       }
  251 | 
  252 |       await loginAndOpenProducts(page);
  253 | 
  254 |       if (row.Action === "missing-category") {
  255 |         const category = page.locator("form select");
  256 |         await expect.soft(category.locator('option[value=""]')).toHaveCount(1);
  257 |         await expect.soft(category).toHaveAttribute("required", "");
  258 |         return;
  259 |       }
  260 | 
  261 |       if (row.Action === "invalid-category") {
  262 |         const category = page.locator("form select");
  263 |         await expect(category.locator('option[value="99999"]')).toHaveCount(0);
  264 |         await expect(category).not.toHaveValue("99999");
  265 |         return;
  266 |       }
  267 | 
  268 |       if (row.Action === "create") {
  269 |         try {
  270 |           const form = page.locator("form").filter({ hasText: /sản phẩm/i });
  271 |           const nameInput = form.getByPlaceholder(/tên sản phẩm/i);
  272 |           if (name) await nameInput.fill(name);
  273 |           const priceInput = form.getByPlaceholder(/giá tiền/i);
  274 |           if (row.Price === "abc") {
  275 |             await priceInput.pressSequentially("abc");
  276 |           } else {
  277 |             await priceInput.fill(row.Price);
  278 |           }
  279 |           const expectedCategoryId = await selectCsvCategory(form, row.Category);
  280 |           const submitButton = form.getByRole("button", {
  281 |             name: /lưu sản phẩm/i,
  282 |           });
  283 |           const formIsValid = await form.evaluate(
  284 |             (element: HTMLFormElement) => element.checkValidity(),
  285 |           );
  286 | 
  287 |           if (row.Expected === "created") {
  288 |             expect(formIsValid).toBe(true);
  289 |             const [response] = await Promise.all([
  290 |               page.waitForResponse(
  291 |                 (candidate) =>
  292 |                   candidate.url().endsWith("/api/products") &&
  293 |                   candidate.request().method() === "POST",
  294 |               ),
  295 |               submitButton.click(),
  296 |             ]);
  297 |             expect(response.status()).toBe(200);
```