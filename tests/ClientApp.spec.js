const { test, expect } = require('@playwright/test');


test('Browser Context Playwright Test 2', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();

    const un = page.locator('#userEmail');
    const pw = page.locator('#userPassword');
    const login = page.locator("[value='Login']");
    const productCardTitltes = page.locator(".card-body b");

    await page.goto('https://rahulshettyacademy.com/client/auth/login');
    console.log(await page.title());

    await un.fill("test@gmail.com");
    await pw.fill("test@123");
    await login.click();

    await page.waitForLoadState('networkidle');
    //await productCardTitltes.last().waitFor();
    console.log(await productCardTitltes.allTextContents());
});