import { Verifier } from '@pact-foundation/pact';
import path from 'path';

new Verifier({
  providerBaseUrl: 'http://localhost:3000', // URL Backend thật của bạn
  pactUrls: [ path.resolve(process.cwd(), "./pacts/AdminConsumer-AdminProvider.json") ],
})
  .verifyProvider()
  .then(() => {
    console.log('Public Admin APIs Verification Complete!');
  });