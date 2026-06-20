import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import "dotenv/config";

new Verifier({
      providerBaseUrl: 'http://localhost:3000',
      pactUrls: [ path.resolve(process.cwd(), "./pacts/contract.json") ],
      requestFilter: (req, res, next) => {
        req.headers['authorization'] = `Bearer ${process.env.ACCESS_TOKEN}`;
        next();
      },
    })
      .verifyProvider()
      .then(() => {
        console.log('Pact Verification Complete!');
      });