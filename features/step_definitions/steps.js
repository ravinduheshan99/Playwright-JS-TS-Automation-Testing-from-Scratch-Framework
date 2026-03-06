const { Given, When, Then } = require('@cucumber/cucumber');
const { setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// Increase default step timeout to 60 seconds to handle slower UI actions
setDefaultTimeout(60 * 1000);

// Step for logging into the Ecommerce application using Page Object Model
Given('a login to Ecommerce application with {string} and {string}', async function (username, password) {
    const loginPage = this.poManager.getLoginPage();
    await loginPage.goToLandingPage();
    await loginPage.validLogin(username, password);
});

// Step to search for a product on the dashboard and add it to the cart
When('add {string} to the cart', async function (productName) {
    const dashboardPage = this.poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(productName);
    await dashboardPage.navigateToCart();
});

// Step to verify that the selected product appears in the cart and proceed to checkout
Then('Verify {string} is displayed in the cart', async function (productName) {
    const cartPage = this.poManager.getCartPage();
    await cartPage.verifyProductIsDisplayed(productName);
    await cartPage.checkout();
});

// Step to complete checkout by selecting country, verifying user email, and placing the order
When('Enter {string} as the country in the checkout form and validate the login email of the user is {string} and submit the order', async function (country, loginEmail) {
    const orderReviewPage = this.poManager.getOrderReviewPage();
    await orderReviewPage.searchCountryAndSelect(country);
    await orderReviewPage.verifyUserEmail(loginEmail);
    await orderReviewPage.placeOrder();

    // Capture order id from confirmation page and navigate to order history
    const orderConfirmationPage = this.poManager.getOrderConfirmationPage();
    this.orderId = await orderConfirmationPage.verifyOrderDetails();
    await orderConfirmationPage.goToMyOrders();
});

// Step to verify the placed order exists in the order history and matches the summary details
Then('Verify the order is present in the order history with correct details', async function () {
    const orderHistoryPage = this.poManager.getOrderHistoryPage();
    await orderHistoryPage.verifyNewlyPlacedOrderFromOrderHistrory(this.orderId);

    const orderSummaryPage = this.poManager.getOrderSummaryPage();
    await orderSummaryPage.verifyOrderSummary(this.orderId);
});

// Login step for the second sample application using direct locators instead of Page Objects
Given('a login to Ecommerce2 application with {string} and {string}', async function (username, password) {
    const userName = this.page.locator('#username');
    const passwordLocator = this.page.locator("[type='password']");
    const signIn = this.page.locator('#signInBtn');

    await this.page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await this.page.title());
    await userName.fill(username);
    await passwordLocator.fill(password);
    await signIn.click();
});

// Validation step to confirm the error message appears for invalid login credentials
Then('Verify Error message is displayed for invalid credentials', async function () {
    console.log(await this.page.locator("[style*='block']").textContent());
    await expect(this.page.locator("[style*='block']")).toContainText('Incorrect');
});