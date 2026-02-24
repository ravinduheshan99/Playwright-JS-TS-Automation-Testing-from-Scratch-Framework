const { expect } = require('@playwright/test');

class OrderSummaryPage {
    constructor(page) {
        this.page = page;
        // Locator for the order reference shown on the summary page
        this.orderSummaryText = page.locator(".col-text");
    }

    // Verifies that the order ID on the summary page matches the expected order ID
    async verifyOrderSummary(orderId) {
        const orderDetails = await this.orderSummaryText.textContent();
        expect(await orderId.includes(orderDetails)).toBeTruthy();
    }
}

module.exports = { OrderSummaryPage };