const { test, expect } = require('@playwright/test');

test('@Web Popup Validation', async ({ browser }) => {
    // New context keeps alerts/popups and storage isolated from other tests
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    // await page.goto("http://google.com"); 
    // await page.goBack(); 
    // await page.goForward();

    // Visibility assertions confirm the UI toggle works instead of only checking click actions
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();

    // Dialog handlers should be registered before the action that triggers the popup to avoid missing the event
    page.on('dialog', dialog => dialog.accept());
    await page.locator("#confirmbtn").click();
    // page.on('dialog', dialog => dialog.dismiss());

    // Hover is required because the menu options appear only on mouseover
    await page.locator("#mousehover").hover();

    // frameLocator scopes actions to the iframe document, since normal locators cannot see inside frames
    const framesPage = page.frameLocator("#courses-iframe");

    // :visible avoids clicking a hidden duplicate element inside the iframe
    await framesPage.locator("li a[href*='lifetime-access']:visible").click();

    // Extracting a token from the text is a quick way to validate dynamic content without hardcoding the full string
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);
});
