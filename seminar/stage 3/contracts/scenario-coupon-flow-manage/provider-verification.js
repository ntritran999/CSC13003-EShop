import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import "dotenv/config";

new Verifier({
  providerBaseUrl: 'http://localhost:3000',
  pactUrls: [
    path.resolve(process.cwd(), "./pacts/MyConsumer-MyProvider.json"),
  ],
  // Cần admin token thật cho case 1 & 2; case 3 không gửi token  không ảnh hưởng
  requestFilter: (req, res, next) => {
    if (req.path === '/api/admin/coupons' && req.headers['authorization']) {
      req.headers['authorization'] = `Bearer ${process.env.ADMIN_ACCESS_TOKEN}`;
    }
    next();
  },
  stateHandlers: {
    'I am logged in as admin': async () => {
      const listRes = await fetch('http://localhost:3000/api/coupons', {
        headers: { Authorization: `Bearer ${process.env.ADMIN_ACCESS_TOKEN}` },
      });
      const coupons = await listRes.json();
      const existing = coupons.find(c => c.code === 'TET2025');
      if (existing) {
        await fetch(`http://localhost:3000/api/admin/coupons/${existing.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${process.env.ADMIN_ACCESS_TOKEN}` },
        });
      }
      return Promise.resolve();
    },
    'a coupon with code DUPLICATE10 already exists': async () => {
      // gọi API đảm bảo coupon DUPLICATE10 tồn tại trước khi verify
      await fetch('http://localhost:3000/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ADMIN_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          code: 'DUPLICATE10',
          type: 'percent',
          discount_value: 10,
          min_order_amount: 0,
          expired_at: '2027-12-31',
          max_uses_per_user: 1,
        }),
      }).catch(() => {}); 
      return Promise.resolve();
    },
    'I am not authenticated as admin': async () => Promise.resolve(),
  },
})
  .verifyProvider()
  .then(() => {
    console.log('Pact Verification Complete!');
  })
  .catch((err) => {
    console.error('Pact Verification Failed:', err);
    process.exit(1);
  });