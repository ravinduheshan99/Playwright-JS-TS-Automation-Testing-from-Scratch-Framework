const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('../utils/APIUtils');

const loginPayLoad = { userEmail: "test@gmail.com", userPassword: "test@123" };
const orderPayLoad = { orders: [{ country: "Sri Lanka", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
let response;

const fakePayLoadOrders = { data: [], message: "No Orders" };

test.beforeAll('testToBeExecutedBeforeAll', async () => {
  // Use API setup to generate a valid token (and an order if needed) so UI can start authenticated.
  const apiContext = await request.newContext();
  const apiUtils = new APIUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
  console.log("Login Token Received Successfully : " + response.token);
  console.log("New Order Created Successfully. Order Id : " + response.orderId);
});

test('Place the Order', async ({ page }) => {
  const products = page.locator(".card-body");

  // Inject token into localStorage before app loads to bypass UI login and open the app as an authenticated user.
  await page.addInitScript(value => {
    window.localStorage.setItem('token', value);
  }, response.token);

  // Mock the "get orders" API response to simulate a "No Orders" state and validate UI behavior for empty data.
  await page.route("**/api/ecom/order/get-orders-for-customer/**", async (route) => {
    const original = await route.fetch();
    await route.fulfill({
      response: original,
      contentType: 'application/json',
      body: JSON.stringify(fakePayLoadOrders),
    });
  });

  await page.goto("https://rahulshettyacademy.com/client/");

  await products.last().waitFor();
  await page.locator("button[routerlink*='myorders']").click();

  // Wait for the orders API call so the assertion/log is done after the UI finishes rendering the empty state.
  await page.waitForResponse("**/api/ecom/order/get-orders-for-customer/**");

  const myOrdersPageText = await page.locator(".mt-4").textContent()
  console.log("My orders page text, when no orders are there is: " + myOrdersPageText);
});
