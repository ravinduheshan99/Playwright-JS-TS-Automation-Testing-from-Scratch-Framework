import { test } from '@playwright/test';
import { customtest } from '../utils_ts/test-base';
import { POManager } from '../pageobjects_ts/POManager';

// Load JSON test data and convert it to a usable JavaScript object for data driven testing.
//JSON->String->JS Object
const dataSet = JSON.parse(JSON.stringify(require('../utils_ts/PlaceOrderTestData.json')));

// Create a separate Playwright test for each dataset entry.
for (const data of dataSet) {

    test(`@Web Client App End to End Automation Scenario ${data.productName}`, async ({ page }) => {
        const poManager = new POManager(page);

        // Login flow
        const loginPage = poManager.getLoginPage();
        await loginPage.goToLandingPage();
        await loginPage.validLogin(data.loginEmail, data.loginPassword);

        // Product search and add to cart
        const dashboardPage = poManager.getDashboardPage();
        await dashboardPage.searchProductAddCart(data.productName);
        await dashboardPage.navigateToCart();

        // Cart validation and checkout
        const cartPage = poManager.getCartPage();
        await cartPage.verifyProductIsDisplayed(data.productName);
        await cartPage.checkout();

        // Order review and order placement
        const orderReviewPage = poManager.getOrderReviewPage();
        await orderReviewPage.searchCountryAndSelect(data.country);
        await orderReviewPage.verifyUserEmail(data.loginEmail);
        await orderReviewPage.placeOrder();

        // Order confirmation and navigation to order history
        const orderConfirmationPage = poManager.getOrderConfirmationPage();
        const orderId = await orderConfirmationPage.verifyOrderDetails();
        await orderConfirmationPage.goToMyOrders();

        // Verify the placed order in order history and summary
        const orderHistoryPage = poManager.getOrderHistoryPage();
        await orderHistoryPage.verifyNewlyPlacedOrderFromOrderHistrory(orderId);

        const orderSummaryPage = poManager.getOrderSummaryPage();
        await orderSummaryPage.verifyOrderSummary(orderId);
    });

}

// Custom Playwright test using extended fixture for injecting order test data
customtest('Client App End to End Automation Scenario', async ({ page, testDataForOrder }) => {
    const poManager = new POManager(page);

    // Login with fixture provided credentials
    const loginPage = poManager.getLoginPage();
    await loginPage.goToLandingPage();
    await loginPage.validLogin(testDataForOrder.loginEmail, testDataForOrder.loginPassword);

    // Product search and cart navigation
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(testDataForOrder.productName);
    await dashboardPage.navigateToCart();

    // Cart validation and checkout
    const cartPage = poManager.getCartPage();
    await cartPage.verifyProductIsDisplayed(testDataForOrder.productName);
    await cartPage.checkout();
});