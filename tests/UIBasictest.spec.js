const { test, expect } = require('@playwright/test');

test('Page Playwright Test', async ({ page }) => {
    await page.goto('https://google.com');
    console.log(await page.title());
    await expect(page).toHaveTitle('Google');
});

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

test('UI Controls', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();

    const userName = page.locator('#username');
    const password = page.locator("[type='password']");
    const dropdown = page.locator("select.form-control");
    const radioButton = page.locator(".radiotextsty");
    const popupOkButton = page.locator('#okayBtn');
    const checkBox = page.locator("#terms");
    const documentLink = page.locator("[href*='documents-request']");
    const signIn = page.locator('#signInBtn');

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());

    await userName.fill("rahulshettyacademy");
    await password.fill("Learning@830$3mK2");
    await dropdown.selectOption("consult");
    await radioButton.nth(1).click();
    await popupOkButton.click();
    await expect(radioButton.nth(1)).toBeChecked();
    console.log(await radioButton.nth(1).isChecked());

    await checkBox.uncheck();
    expect(await checkBox.isChecked()).toBeFalsy();

    await checkBox.click();
    //await expect(checkBox.isChecked()).toBeTruthy();
    await expect(checkBox).toBeChecked();

    await expect(documentLink).toHaveAttribute("class","blinkingText");

    await signIn.click();
});

test.only('Child Windows Handling', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();

    const userName = page.locator('#username');
    const password = page.locator("[type='password']");
    const dropdown = page.locator("select.form-control");
    const radioButton = page.locator(".radiotextsty");
    const popupOkButton = page.locator('#okayBtn');
    const checkBox = page.locator("#terms");
    const documentLink = page.locator("[href*='documents-request']");
    const signIn = page.locator('#signInBtn');

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());

    const [newPage] = await Promise.all([context.waitForEvent('page'), documentLink.click()]);
    
    const textPage2 = await newPage.locator(".red").textContent();
    console.log(textPage2);

    const arrayText = textPage2.split("@")
    const domainName = arrayText[1].split(" ")[0];
    console.log(domainName);

    await userName.fill("rahulshettyacademy");
    console.log("Username entered successfully: "+ await userName.inputValue());
    await password.fill("Learning@830$3mK2");
    console.log("Password entered successfully: "+ await password.inputValue());
    await dropdown.selectOption("consult");
    await radioButton.nth(1).click();
    await popupOkButton.click();
    await expect(radioButton.nth(1)).toBeChecked();
    await checkBox.click();
    await expect(checkBox).toBeChecked();
    await signIn.click();
    console.log("Successfully SignedIn");
});
