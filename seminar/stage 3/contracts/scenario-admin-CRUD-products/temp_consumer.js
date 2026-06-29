import { PactV3, MatchersV3 } from "@pact-foundation/pact";
import path from "path";

const provider = new PactV3({
  dir: path.resolve(process.cwd(), "pacts"),
  consumer: "AdminConsumer",
  provider: "AdminProvider",
});

provider
  .uponReceiving("a request to create a new product")
  .withRequest({
    method: "POST",
    path: "/api/products",
    headers: { "Content-Type": "application/json" },
    body: {
      name: "New Admin Product",
      price: 15000000,
      description: "Mô tả sản phẩm mới",
      imageUrl: "http://example.com/image.png",
      category_id: 2,
    },
  })
  .willRespondWith({
    status: 200
  });

provider
  .uponReceiving("a request to update a product by id")
  .withRequest({
    method: "PUT",
    path: "/api/products/1",
    headers: { "Content-Type": "application/json" },
    body: {
      name: "Updated Product Name",
      price: 20000000,
    },
  })
  .willRespondWith({
    status: 200
  });

provider
  .uponReceiving("a request to delete a product by id")
  .withRequest({
    method: "DELETE",
    path: "/api/products/1",
  })
  .willRespondWith({
    status: 200
  });

await provider.executeTest(async (mockserver) => {
  const baseUrl = mockserver.url;

  const resPost = await fetch(`${baseUrl}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "New Admin Product",
      price: 15000000,
      description: "Mô tả sản phẩm mới",
      imageUrl: "http://example.com/image.png",
      category_id: 2,
       
    }),
  });
  console.log("Consumer Mock CREATE Status:", resPost.status);

  const resPut = await fetch(`${baseUrl}/api/products/1`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Updated Product Name", price: 20000000 }),
  });
  console.log("Consumer Mock UPDATE Status:", resPut.status);

  const resDelete = await fetch(`${baseUrl}/api/products/1`, {
    method: "DELETE",
  });
  console.log("Consumer Mock DELETE Status:", resDelete.status);
});
