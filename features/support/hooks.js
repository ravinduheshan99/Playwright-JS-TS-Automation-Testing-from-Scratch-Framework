const { Before, After, BeforeStep, AfterStep, setDefaultTimeout, Status } = require("@cucumber/cucumber");
const { POManager } = require('../../pageobjects/POManager');
const playwright = require('@playwright/test');

// Set default timeout for all cucumber steps
setDefaultTimeout(60 * 1000);

// Global setup executed before each scenario
Before(async function () {

    // In Cucumber, "this" represents the World constructor (scenario context).
    // Data stored here (page, poManager, orderId, etc.) can be shared across all steps within the same scenario.
    const browser = await playwright.chromium.launch({ headless: false });
    const context = await browser.newContext();
    this.page = await context.newPage();  // store page in scenario context
    this.poManager = new POManager(this.page);  // initialize Page Object Manager for the scenario
});

// Example hooks showing how execution can be limited to specific tags

// Before({tags:"@Regression"},async function () {
//     const browser = await playwright.chromium.launch({ headless: false });
//     const context = await browser.newContext();
//     this.page = await context.newPage();  // store page in scenario context
//     this.poManager = new POManager(this.page);  // pass the page correctly
// });

// Before({tags:"@Regression" and "@Validation"},async function () {
//     const browser = await playwright.chromium.launch({ headless: false });
//     const context = await browser.newContext();
//     this.page = await context.newPage();  // store page in scenario context
//     this.poManager = new POManager(this.page);  // pass the page correctly
// });

// Before({tags:"@Regression" or "@Validation"},async function () {
//     const browser = await playwright.chromium.launch({ headless: false });
//     const context = await browser.newContext();
//     this.page = await context.newPage();  // store page in scenario context
//     this.poManager = new POManager(this.page);  // pass the page correctly
// });

// Before("@Regression",async function () {
//     const browser = await playwright.chromium.launch({ headless: false });
//     const context = await browser.newContext();
//     this.page = await context.newPage();  // store page in scenario context
//     this.poManager = new POManager(this.page);  // pass the page correctly
// });

// Executes before every step in a scenario
BeforeStep(async function () {
    console.log("I'm executing before each step");
});

// Executes after every step and captures screenshot if a step fails
AfterStep(async function ({result}) {
    console.log("I'm executing after each step");
    if (result.status === Status.FAILED) {
        const screenshot = await this.page.screenshot({ path: `screenshots/${Date.now()}.png` });
        this.attach(screenshot, 'image/png');
    }
});

// Global teardown executed after each scenario
After(async function () {
    console.log("I'm last to execute");
});