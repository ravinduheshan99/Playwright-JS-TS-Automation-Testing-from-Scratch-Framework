//prompt
/*
Perform below steps manually on browser to understand flow and grab real locators, and then frame a playwright test as per existing framework pageobject standards. create that test file in ravinduheshan99.tests package path

navigate to https://rahulshettyacademy.com/loginpagePractise/
enter username as "rahulshettyacademy" and password as "learning"
select checkbox
click on Sign in button
wait until page is navigated to https://rahulshettyacademy.com/angularpractice/shop page
verify if iphone X product is present on the page
*/

const { test, expect } = require('@playwright/test');
const { POManager } = require('../pageobjects/POManager');

// Test: Login and verify iPhone X product presence

test('Login and verify iPhone X product', async ({ page }) => {
    const poManager = new POManager(page);

    // Navigate to login page and perform login
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await page.fill('#username', 'rahulshettyacademy');
    await page.fill("input[type='password']", 'learning');
    await page.check('#terms');
    await page.click('#signInBtn');

    // Wait for navigation to shop page
    await page.waitForURL('**/angularpractice/shop');

    // Verify if iPhone X product is present
    const productTitles = await page.locator('.card-title').allTextContents();
    expect(productTitles).toContain('iphone X');
});
