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

//Install Typescript
//npm install -g typescript
//to concert ts file to js file - tsc demo1.ts
//run the converted js file - node demo1.js

//install cucumber
//npm install @cucumber/cucumber
//npx cucumber-js
//npx cucumber-js features/ErrorValidations.feature
//npx cucumber-js --tags "@Regression"
//npx cucumber-js features/Ecommerce.feature --parallel 2
//npx cucumber-js features/Ecommerce.feature --parallel 2 --format html:cucumber-report.html
//npx cucumber-js --tags "@Regression" --retry 1 --format html:cucumber-report.html
//npm run CucumberRegression

// Create playwright workspace resource in Azure
// Install Azure CLI
// run npm init @azure/microsoft-playwright-testing

// then playwright.service.config.js will be created in the root folder of the project with the below content.

/*
const { defineConfig } = require('@playwright/test');
const { getServiceConfig, ServiceOS } = require('@azure/microsoft-playwright-testing');
const config = require('./playwright.config');

export default defineConfig(
  config,
  getServiceConfig(config, {
    exposeNetwork: '<loopback>',
    timeout: 30000,
    os: ServiceOS.LINUX,
    useCloudHostedBrowsers: true // Set to false if you want to only use reporting and not cloud hosted browsers
  }),
  {
    reporter: [['list'], ['@azure/microsoft-playwright-testing/reporter']],
  }
);
*/

// then run npm uninstall @azure/microsoft-playwright-testing
// then run npm install @azure/playwright @azure/identity
// then run npm install @playwright/test@latest

// Update the config as per below.

/*
const { defineConfig } = require('@playwright/test');
import { createAzurePlaywrightConfig, ServiceOS } from '@azure/playwright';
import { DefaultAzureCredential } from '@azure/identity';
import config from './playwright.config';

export default defineConfig(
  config,
  createAzurePlaywrightConfig(config, {
    exposeNetwork: '<loopback>',
    connectTimeout: 30000,
    os: ServiceOS.LINUX,
    credential: new DefaultAzureCredential() // if serviceAuthType is ENTRA_ID (default)
  })
);
*/

//az login and select the subscription where the resource is created
//set PLAYWRIGHT_SERVICE_URL=wss://westeurope.api.playwright.microsoft.com/playwrightworkspaces/fb8f6efc-153f-418f-8c07-c7ca5d2822da/browsers
//npx playwright test --config=playwright.service.config.js --workers=20

//sign in to Azure Devops using the same free subscription
//push the repo in Azure Devops and create a pipeline with the yaml file as added in the azure-pipeline.yml to run the tests in Azure Playwright Service
//create a service connection in Azure Devops with the same subscription details to authenticate the pipeline with Azure to use the Playwright Service
//create a pipeline variable named PLAYWRIGHT_SERVICE_URL and set the value as the same wss url as set in the local environment variable to use the Playwright Service in Azure for test execution from Azure Devops pipeline
//run the pipeline and view the results in Azure Devops and Azure Playwright Service dashboards

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
