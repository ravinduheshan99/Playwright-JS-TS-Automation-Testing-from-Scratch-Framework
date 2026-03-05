const { Before, After, BeforeStep, AfterStep, setDefaultTimeout, Status } = require("@cucumber/cucumber");
const { POManager } = require('../../pageobjects/POManager');
const playwright = require('@playwright/test');

setDefaultTimeout(60 * 1000);

Before(async function () {
    const browser = await playwright.chromium.launch({ headless: false });
    const context = await browser.newContext();
    this.page = await context.newPage();  // store page in scenario context
    this.poManager = new POManager(this.page);  // pass the page correctly
});

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

BeforeStep(async function () {
    console.log("I'm executing before each step");
});

AfterStep(async function ({result}) {
    console.log("I'm executing after each step");
    if (result.status === Status.FAILED) {
        const screenshot = await this.page.screenshot({ path: `screenshots/${Date.now()}.png` });
        this.attach(screenshot, 'image/png');
    }
});

After(async function () {
    console.log("I'm last to execute");
});