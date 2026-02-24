const { expect } = require('@playwright/test');

class OrderConfirmationPage {
    constructor(page) {
        this.page = page;
        // Confirmation message shown after order placement
        this.orderConfirmationText = page.locator(".hero-primary");
        // Order ID displayed on the confirmation page
        this.orderID = page.locator(".em-spacer-1 .ng-star-inserted");
        // Button to navigate to "My Orders" page
        this.myOrders = page.locator("button[routerlink*='myorders']");
    }

    // Verifies order placement success and returns the generated order ID
    async verifyOrderDetails() {
        expect(await this.orderConfirmationText).toHaveText(" Thankyou for the order. ");
        const orderId = await this.orderID.textContent();
        console.log("Successfully Placed the New Order with Order ID: " + orderId);
        return orderId;
    }

    // Navigates to "My Orders" page
    async goToMyOrders() {
        await this.myOrders.click();
    }
}

module.exports = { OrderConfirmationPage };