const { test, expect } = require('@playwright/test');

// ==================== Playwright Test Execution Commands ====================

// install node js and pass in the system path variables
// npm init playwright

// Run all test files
// npx playwright test

// Run a specific test file
// npx playwright test tests/ClientApp.spec.js

// Run all test files in UI mode
// npx playwright test --ui

// Run a specific test file in debug (Inspector) mode
// npx playwright test tests/SpecialLocators.spec.js --debug

// Launch Playwright Codegen for recording tests
// npx playwright codegen https://rahulshettyacademy.com/angularpractice/

// To run playwright.config2.js:
// npx playwright test tests/ClientAppPageObjects.spec.js --config playwright.config2.js

// To run playwright.config2.js with specific project:
// npx playwright test tests/ClientAppPageObjects.spec.js --config playwright.config2.js --project=safariExecution

// Run testcases which have @Web annotation only
// npx playwright test --grep @Web

// Install reporting & excel dependencies
// npm install exceljs
// npm i -D @playwright/test allure-playwright
// npm install -g allure-commandline --save-dev

// Run tests with Allure reporter
// npx playwright test --grep @Web --reporter=line,allure-playwright
// allure generate ./allure-results --clean
// allure open ./allure-report

// Run npm scripts
// npm run APITests , npm run WebTests, npm run SafariNewConfig 

// Jenkins trigger
// java -jar jenkins.war -httpPort=9090
// Windows: npm run "%Script%"
// Mac: shell - npm run "$Script"

// ============================================================================


test('Page Playwright Test', async ({ page }) => {
    await page.goto('https://google.com');
    console.log(await page.title());
    // Validates the page title with auto-wait, ensuring navigation completed and the expected page is loaded.
    await expect(page).toHaveTitle('Google');
});

test('@Web Browser Context Playwright Test', async ({ browser }) => {
    // Creates an isolated context so the test runs with a clean session (no shared cookies/storage).
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Store locators once to avoid repeating selectors and to keep the test easier to maintain.
    const userName = page.locator('#username');
    const password = page.locator("[type='password']");
    const signIn = page.locator('#signInBtn');
    const cardTitiles = page.locator(".card-body a");
    
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());

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

test('@Web UI Controls', async({browser})=>{
    // Separate context keeps this UI-controls test independent from other tests' login state.
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

    // Uses selectOption to pick a stable value from a native <select> dropdown.
    await dropdown.selectOption("consult");

    await radioButton.nth(1).click();

    // Confirms the modal that appears after selecting a specific radio option so the flow can continue.
    await popupOkButton.click();

    await expect(radioButton.nth(1)).toBeChecked();
    console.log(await radioButton.nth(1).isChecked());

    await checkBox.uncheck();
    expect(await checkBox.isChecked()).toBeFalsy();

    await checkBox.click();

    // Locator-based assertion auto-waits and is more reliable than asserting a boolean immediately.
    await expect(checkBox).toBeChecked();

    // Validates that the link has the expected class applied, which usually indicates UI state/behavior (blinking text).
    await expect(documentLink).toHaveAttribute("class","blinkingText");

    await signIn.click();
});

test('Child Windows Handling', async({browser})=>{
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

    // Waits for the child tab to open while clicking the link, preventing race conditions between the click and event listener.
    const [newPage] = await Promise.all([context.waitForEvent('page'), documentLink.click()]);
    
    const textPage2 = await newPage.locator(".red").textContent();
    console.log(textPage2);

    // Extracts the domain from the text so it can be reused later as test data if needed.
    const arrayText = textPage2.split("@")
    const domainName = arrayText[1].split(" ")[0];
    console.log(domainName);

    await userName.fill("rahulshettyacademy");

    // inputValue() confirms what is actually present in the field (useful when debugging typing/fill issues).
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
