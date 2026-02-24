const { test } = require('@playwright/test');
const { customtest } = require('../utils/test-base');
const { POManager } = require('../pageobjects/POManager');

// Parse the JSON test data once to feed multiple data-driven tests.
//JSON->String->JS Object
const dataSet = JSON.parse(JSON.stringify(require('../utils/PlaceOrderTestData.json')));

// Loop over each dataset entry to create separate tests dynamically.
for (const data of dataSet) {

    test(`@Web Client App End to End Automation Scenario ${data.productName}`, async ({ page }) => {
        const poManager = new POManager(page);

        // Login flow using the Page Object for landing and authentication pages.
        const loginPage = poManager.getLoginPage();
        await loginPage.goToLandingPage();
        await loginPage.validLogin(data.loginEmail, data.loginPassword);

        // Dashboard interactions: search product and add it to cart.
        const dashboardPage = poManager.getDashboardPage();
        await dashboardPage.searchProductAddCart(data.productName);
        await dashboardPage.navigateToCart();

        // Cart validations and proceed to checkout.
        const cartPage = poManager.getCartPage();
        await cartPage.verifyProductIsDisplayed(data.productName);
        await cartPage.checkout();

        // Order review page: select country, verify email, and place order.
        const orderReviewPage = poManager.getOrderReviewPage();
        await orderReviewPage.searchCountryAndSelect(data.country);
        await orderReviewPage.verifyUserEmail(data.loginEmail);
        await orderReviewPage.placeOrder();

        // Order confirmation: capture order id and navigate to My Orders.
        const orderConfirmationPage = poManager.getOrderConfirmationPage();
        const orderId = await orderConfirmationPage.verifyOrderDetails();
        await orderConfirmationPage.goToMyOrders();

        // Validate the newly placed order appears correctly in history and summary.
        const orderHistoryPage = poManager.getOrderHistoryPage();
        await orderHistoryPage.verifyNewlyPlacedOrderFromOrderHistrory(orderId);

        const orderSummaryPage = poManager.getOrderSummaryPage();
        await orderSummaryPage.verifyOrderSummary(orderId);
    });

}

// Custom test variant allowing external injection of test data for order.
customtest('Client App End to End Automation Scenario', async ({ page, testDataForOrder }) => {
    const poManager = new POManager(page);

    // Login with provided test data.
    const loginPage = poManager.getLoginPage();
    await loginPage.goToLandingPage();
    await loginPage.validLogin(testDataForOrder.loginEmail, testDataForOrder.loginPassword);

    // Dashboard actions: search product and add to cart.
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(testDataForOrder.productName);
    await dashboardPage.navigateToCart();

    // Verify product is displayed and proceed to checkout.
    const cartPage = poManager.getCartPage();
    await cartPage.verifyProductIsDisplayed(testDataForOrder.productName);
    await cartPage.checkout();
});