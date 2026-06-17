import { PactV3, Verifier } from '@pact-foundation/pact';
import path from 'path';

new Verifier({
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: [ path.resolve(process.cwd(), "./pacts/MyConsumer-MyProvider.json") ],
    })
      .verifyProvider()
      .then(() => {
        console.log('Pact Verification Complete!');
      });