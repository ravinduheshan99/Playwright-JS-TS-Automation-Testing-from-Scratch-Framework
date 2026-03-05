const { Given, When, Then } = require('@cucumber/cucumber');
const { setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

setDefaultTimeout(60 * 1000);

Given('a login to Ecommerce application with {string} and {string}', async function (username, password) {
    // Login flow using the Page Object for landing and authentication pages.
    const loginPage = this.poManager.getLoginPage();
    await loginPage.goToLandingPage();
    await loginPage.validLogin(username, password);
});

When('add {string} to the cart', async function (productName) {
    // Dashboard interactions: search product and add it to cart.
    const dashboardPage = this.poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(productName);
    await dashboardPage.navigateToCart();
});

Then('Verify {string} is displayed in the cart', async function (productName) {
    // Cart validations and proceed to checkout.
    const cartPage = this.poManager.getCartPage();
    await cartPage.verifyProductIsDisplayed(productName);
    await cartPage.checkout();
});

When('Enter {string} as the country in the checkout form and validate the login email of the user is {string} and submit the order', async function (country, loginEmail) {
    // Order review page: select country, verify email, and place order.
    const orderReviewPage = this.poManager.getOrderReviewPage();
    await orderReviewPage.searchCountryAndSelect(country);
    await orderReviewPage.verifyUserEmail(loginEmail);
    await orderReviewPage.placeOrder();

    // Order confirmation: capture order id and navigate to My Orders.
    const orderConfirmationPage = this.poManager.getOrderConfirmationPage();
    this.orderId = await orderConfirmationPage.verifyOrderDetails();
    await orderConfirmationPage.goToMyOrders();
});

Then('Verify the order is present in the order history with correct details', async function () {
    // Validate the newly placed order appears correctly in history and summary.
    const orderHistoryPage = this.poManager.getOrderHistoryPage();
    await orderHistoryPage.verifyNewlyPlacedOrderFromOrderHistrory(this.orderId);
    const orderSummaryPage = this.poManager.getOrderSummaryPage();
    await orderSummaryPage.verifyOrderSummary(this.orderId);
});

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

Then('Verify Error message is displayed for invalid credentials', async function () {
    console.log(await this.page.locator("[style*='block']").textContent());
    await expect(this.page.locator("[style*='block']")).toContainText('Incorrect');
});