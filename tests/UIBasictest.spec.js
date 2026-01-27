const { test, expect } = require('@playwright/test');

test('Browser Context Playwright Test', async ({ browser }) => {
    // Creates a new isolated browser context (separate cookies, cache, session)
    const context = await browser.newContext();
    // Opens a new page (tab) inside the created browser context
    const page = await context.newPage();
    // Navigates to the application under test
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    // Prints the page title to the console for verification/debugging
    console.log(await page.title());
});

test.only('Page Playwright Test', async ({ page }) => {
    // Uses the default page provided by Playwright test runner
    await page.goto('https://google.com');
    // Logs the page title
    console.log(await page.title());
    // Asserts that the page title matches the expected value
    await expect(page).toHaveTitle('Google');
});
