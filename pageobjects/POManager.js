const { LoginPage } = require('./LoginPage');
const { DashboardPage } = require('./DashboardPage');
const { CartPage } = require('./CartPage');
const { OrderReviewPage } = require('./OrderReviewPage');
const { OrderConfirmationPage } = require('./OrderConfirmationPage');
const { OrderHistoryPage } = require('./OrderHistoryPage');
const { OrderSummaryPage } = require('./OrderSummaryPage');

// Page Object Manager centralizes all page object instances for a single test page context.
class POManager {
    constructor(page) {
        this.page = page;

        // Initialize all page objects once to reuse across tests.
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.cartPage = new CartPage(page);
        this.orderReviewPage = new OrderReviewPage(page);
        this.orderConfirmationPage = new OrderConfirmationPage(page);
        this.orderHistoryPage = new OrderHistoryPage(page);
        this.orderSummaryPage = new OrderSummaryPage(page);
    }

    // Getter methods provide controlled access to page objects.
    getLoginPage() {
        return this.loginPage;
    }

    getDashboardPage() {
        return this.dashboardPage;
    }

    getCartPage() {
        return this.cartPage;
    }

    getOrderReviewPage() {
        return this.orderReviewPage;
    }

    getOrderConfirmationPage() {
        return this.orderConfirmationPage;
    }

    getOrderHistoryPage() {
        return this.orderHistoryPage;
    }

    getOrderSummaryPage() {
        return this.orderSummaryPage;
    }
}

module.exports = { POManager };