const { test, expect } = require('@playwright/test');

test('Browser Context Playwright Test', async ({ browser }) => {
    // Creates an isolated context so the test runs with a clean session (no shared cookies/storage).
    const context = await browser.newContext();
    const page = await context.newPage();

    // Block heavy assets to speed up execution and reduce unnecessary network noise during testing.
    //await page.route('**/*.css',route=> route.abort());
    await page.route('**/*.{jpg,png,jpeg}',route=> route.abort());
    
    // Store locators once to avoid repeating selectors and to keep the test easier to maintain.
    const userName = page.locator('#username');
    const password = page.locator("[type='password']");
    const signIn = page.locator('#signInBtn');
    const cardTitiles = page.locator(".card-body a");

    // Network logging helps debug redirects, failed requests, and timing issues during test runs.
    await page.on('request',request=>console.log(request.url()));
    await page.on('response',response=>console.log(response.url(), response.status()));
    
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await userName.fill("rahulshetty");
    await password.fill("Learning@830$3mK2");
    await signIn.click();

    // Reads the inline error banner content shown after a failed login attempt for debugging and assertion.
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    // Clearing inputs first avoids any stale values from the previous attempt affecting the next login.
    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await password.fill("");
    await password.fill("Learning@830$3mK2");
    await signIn.click();

    console.log(await cardTitiles.first().textContent());
    console.log(await cardTitiles.nth(2).textContent());

    // Collects all card titles in one shot, useful for validating lists and logging in a readable format.
    const allTitles = await cardTitiles.allTextContents();
    console.log(allTitles);
});
