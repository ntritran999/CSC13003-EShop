import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import "dotenv/config"; // Đọc token từ file .env

new Verifier({
  providerBaseUrl: 'http://localhost:3000', 
  pactUrls: [ path.resolve(process.cwd(), "./pacts/AdminConsumer-AdminProvider.json") ],
  
  // BỘ LỌC REQUEST: Tự động thêm Token Admin vào Header trước khi bắn test sang Backend thật
  requestFilter: (req, res, next) => {
    req.headers['authorization'] = `Bearer ${process.env.ACCESS_TOKEN}`;
    next();
  },
})
  .verifyProvider()
  .then(() => {
    console.log('Secure Admin CRUD APIs Verification Complete!');
  })
  .catch(err => console.error("Verification failed:", err));