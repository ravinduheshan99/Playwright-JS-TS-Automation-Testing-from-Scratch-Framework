//const { LoginPage } = require('./LoginPage');
import { LoginPage } from './LoginPage';
//const { DashboardPage } = require('./DashboardPage');
import { DashboardPage } from './DashboardPage';
//const { CartPage } = require('./CartPage');
import { CartPage } from './CartPage';
//const { OrderReviewPage } = require('./OrderReviewPage');
import { OrderReviewPage } from './OrderReviewPage';
//const { OrderConfirmationPage } = require('./OrderConfirmationPage');
import { OrderConfirmationPage } from './OrderConfirmationPage';
//const { OrderHistoryPage } = require('./OrderHistoryPage');
import { OrderHistoryPage } from './OrderHistoryPage';
//const { OrderSummaryPage } = require('./OrderSummaryPage');
import { OrderSummaryPage } from './OrderSummaryPage';
import { Page } from '@playwright/test';

// Page Object Manager centralizes all page object instances for a single test page context.
export class POManager {

    page:Page;
    loginPage:LoginPage;
    dashboardPage:DashboardPage;
    cartPage:CartPage;
    orderReviewPage:OrderReviewPage;
    orderConfirmationPage:OrderConfirmationPage;
    orderHistoryPage:OrderHistoryPage;
    orderSummaryPage:OrderSummaryPage;

    constructor(page:Page) {
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