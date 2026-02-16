const { test, expect } = require('@playwright/test');

test('Security Test Request Intercept', async ({ page }) => {
    const un = page.locator('#userEmail');
    const pw = page.locator('#userPassword');
    const login = page.locator("[value='Login']");
    const products = page.locator(".card-body");
    const loginEmail = "test@gmail.com";

    await page.goto('https://rahulshettyacademy.com/client/auth/login');
    await un.fill(loginEmail);
    await pw.fill("test@123");
    await login.click();
    await page.waitForLoadState('networkidle');
    await products.last().waitFor();
    await page.locator("button[routerlink*='myorders']").click();

    // Intercept the order-details request and tamper the order id to validate authorization is enforced server-side.
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({ url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=123456789' })
    )

    await page.locator("button:has-text('View')").first().click();

    // Confirms the app blocks access when the requested order id does not belong to the logged-in user.
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
});
