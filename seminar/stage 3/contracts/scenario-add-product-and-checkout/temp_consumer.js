import { PactV3 } from '@pact-foundation/pact';
import path from 'path';

const provider = new PactV3({
  dir: path.resolve(process.cwd(), 'pacts'),
  consumer: 'MyConsumer',
  provider: 'MyProvider',
});

provider
  .given('I have a list of products')
  .uponReceiving('a request for all products')
  .withRequest({
    method: 'GET',
    path: '/api/products',
  })
  .willRespondWith({
    status: 200,
    body: [],
  });

await provider.executeTest(async (mockserver) => {
  const response = await fetch(`${mockserver.url}/api/products`);
  console.log(await response.json());
});