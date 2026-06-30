import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import path from 'path';

const { like, regex } = MatchersV3;


// Pact gộp tất cả interaction vào 1 file 
function makeProvider() {
  return new PactV3({
    dir: path.resolve(process.cwd(), 'pacts'),
    consumer: 'MyConsumer',
    provider: 'MyProvider',
  });
}

// Case 1: Tạo coupon thành công 
await makeProvider()
  .given('I am logged in as admin')
  .uponReceiving('a request to create a new coupon')
  .withRequest({
    method: 'POST',
    path: '/api/admin/coupons',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': regex('^Bearer .+$', 'Bearer abc123token'),
    },
    body: {
      code: 'TET2025',
      type: 'percent',
      discount_value: 15,
      min_order_amount: 200000,
      expired_at: '2027-12-31',
      max_uses_per_user: 1,
    },
  })
  .willRespondWith({
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {
      id: like(1),
      message: like('Coupon created successfully'),
    },
  })
  .executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/admin/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer abc123token',
      },
      body: JSON.stringify({
        code: 'TET2025',
        type: 'percent',
        discount_value: 15,
        min_order_amount: 200000,
        expired_at: '2027-12-31',
        max_uses_per_user: 1,
      }),
    });

    if (res.status !== 200) throw new Error(`Case 1 failed: status ${res.status}`);
    console.log('Case 1 passed:', await res.json());
  });

// Case 2: Trùng code 
await makeProvider()
  .given('a coupon with code DUPLICATE10 already exists')
  .uponReceiving('a request to create a coupon with a duplicate code')
  .withRequest({
    method: 'POST',
    path: '/api/admin/coupons',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': regex('^Bearer .+$', 'Bearer abc123token'),
    },
    body: {
      code: 'DUPLICATE10',
      type: 'percent',
      discount_value: 10,
      min_order_amount: 0,
      expired_at: '2027-12-31',
      max_uses_per_user: 1,
    },
  })
  .willRespondWith({
    status: 400,                         // bug — nên là 400 thay vì 500
    headers: { 'Content-Type': 'application/json' },
    body: {
      error: like('Internal server error'), 
    },
  })
  .executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/admin/coupons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer abc123token',
      },
      body: JSON.stringify({
        code: 'DUPLICATE10',
        type: 'percent',
        discount_value: 10,
        min_order_amount: 0,
        expired_at: '2027-12-31',
        max_uses_per_user: 1,
      }),
    });

    if (res.status !== 400) throw new Error(`Case 2 failed: status ${res.status}`);
    console.log('Case 2 passed:', await res.json());
  });

// Case 3: Không có quyền admin
await makeProvider()
  .given('I am not authenticated as admin')
  .uponReceiving('a request to create coupon without admin token')
  .withRequest({
    method: 'POST',
    path: '/api/admin/coupons',
    headers: { 'Content-Type': 'application/json' },
    body: {
      code: 'NOAUTH01',
      type: 'percent',
      discount_value: 10,
      min_order_amount: 0,
      expired_at: '2027-12-31',
      max_uses_per_user: 1,
    },
  })
  .willRespondWith({
    status: 401,
    headers: { 'Content-Type': 'application/json' },
    body: {
      error: like('Unauthorized'),
    },
  })
  .executeTest(async (mockserver) => {
    const res = await fetch(`${mockserver.url}/api/admin/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // không gửi Authorization
      body: JSON.stringify({
        code: 'NOAUTH01',
        type: 'percent',
        discount_value: 10,
        min_order_amount: 0,
        expired_at: '2027-12-31',
        max_uses_per_user: 1,
      }),
    });

    if (res.status !== 401) throw new Error(`Case 3 failed: status ${res.status}`);
    console.log('Case 3 passed:', await res.json());
  });

console.log('All interactions written to pacts/MyConsumer-MyProvider.json');