const { test, expect } = require('@playwright/test');

// To run only this test file: npx playwright test tests/ClientApp.spec.js 

test('Client App End to End Automation Scenario', async ({ browser }) => {
    // Create an isolated browser context to avoid sharing cookies/session with other tests
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://rahulshettyacademy.com/client/auth/login');

    // Using role- and placeholder-based locators for better stability and accessibility alignment
    await page.getByPlaceholder("email@example.com").fill("test@gmail.com");
    await page.getByPlaceholder("enter your passsword").fill("test@123");
    await page.getByRole("button", { name: 'Login' }).click();

    // Wait for SPA network activity to finish before interacting with product cards
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body").last().waitFor();

    // Filter the product list by visible text to target the correct card before clicking Add To Cart
    await page
        .locator(".card-body")
        .filter({ hasText: 'ZARA COAT 3' })
        .getByRole("button", { name: ' Add To Cart' })
        .click();

    await page.getByRole("listitem").getByRole("button", { name: 'Cart' }).click();
    await page.locator("div li").last().waitFor();

    // Assert that the selected product is present in the cart
    await expect(page.getByText("ZARA COAT 3")).toBeVisible();

    await page.getByRole("button", { name: 'Checkout' }).click();

    // Type sequentially to trigger the country auto-suggestion dropdown
    await page.getByPlaceholder("Select Country").pressSequentially("Sr", { delay: 150 });
    await page.getByRole("button", { name: ' Sri Lanka' }).click();

    // Verify logged-in user identity before placing the order
    await expect(page.getByLabel("test@gmail.com")).toBeVisible();

    await page.getByText("PLACE ORDER").click();

    // Final validation to confirm successful order placement
    await expect(page.getByText("Thankyou for the order.")).toBeVisible();
});
