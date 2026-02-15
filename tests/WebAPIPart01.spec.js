const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');

const loginPayLoad = { userEmail: "test@gmail.com", userPassword: "test@123" };
const orderPayLoad = { orders: [{ country: "Sri Lanka", productOrderedId: "6960eac0c941646b7a8b3e68" }] };
let response;

test.beforeAll('testToBeExecutedBeforeAll', async () => {
    // Use API setup to create prerequisites (token + order) so the UI test starts from a ready state and runs faster.
    const apiContext = await request.newContext();
    const apiUtils = await new APIUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);
    console.log("Login Token Received Successfully : " + response.token);
    console.log("New Order Created Successfully. Order Id : " + response.orderId);
});

test('Place the Order', async ({ page }) => {
    // Keep locators in variables to avoid repeating selectors and to improve readability/maintenance.
    const products = page.locator(".card-body");

    // Inject token into localStorage before the app loads to bypass UI login and start as an authenticated user.
    await page.addInitScript(value => { window.localStorage.setItem('token', value) }, response.token);

    await page.goto("https://rahulshettyacademy.com/client/");

    // Ensures at least one product card is rendered before moving to the orders page (guards against slow initial load).
    await products.last().waitFor();
    console.log(await products.allTextContents());

    await page.locator("button[routerlink*='myorders']").click();

    // Wait for table body to render before querying rows (avoids count=0 race).
    await page.locator("tbody").waitFor();

    const tableRows = await page.locator("tbody tr");

    for (let i = 0; i < await tableRows.count(); ++i) {
        // Row header contains the order id shown in the list view.
        const rowOrderId = await tableRows.nth(i).locator("th").textContent();

        // Some UIs show partial ids, so we use includes() instead of strict equality.
        if (await response.orderId.includes(rowOrderId)) {
            // Clicking the first button in the row opens the order details view for that row.
            await tableRows.nth(i).locator("button").first().click();
            break;
        }
    }

    // Validate that order details page shows the same order reference as the one created via API.
    const orderDetails = await page.locator(".col-text").textContent();
    expect(response.orderId.includes(orderDetails)).toBeTruthy();
});
