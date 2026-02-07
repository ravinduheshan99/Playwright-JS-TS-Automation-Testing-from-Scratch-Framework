const { test, expect } = require('@playwright/test');

test('Browser Context Playwright Test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const userName = page.locator('#username');
    const password = page.locator("[type='password']");
    const signIn = page.locator('#signInBtn');
    const cardTitiles = page.locator(".card-body a");
    
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());

    await userName.fill("rahulshetty");
    await password.fill("Learning@830$3mK2");
    await signIn.click();
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await password.fill("");
    await password.fill("Learning@830$3mK2");
    await signIn.click();

    console.log(await cardTitiles.first().textContent());
    console.log(await cardTitiles.nth(2).textContent());

    const allTitles = await cardTitiles.allTextContents();
    console.log(allTitles);
});



test('Page Playwright Test', async ({ page }) => {
    await page.goto('https://google.com');
    console.log(await page.title());
    await expect(page).toHaveTitle('Google');
});
