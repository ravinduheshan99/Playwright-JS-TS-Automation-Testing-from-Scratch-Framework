import { expect, Page, Locator } from "@playwright/test";

export class OrderSummaryPage {

    page: Page;
    orderSummaryText: Locator;

    constructor(page: Page) {
        this.page = page;
        // Locator for the order reference shown on the summary page
        this.orderSummaryText = page.locator(".col-text");
    }

    // Verifies that the order ID on the summary page matches the expected order ID
    async verifyOrderSummary(orderId: any) {
        const orderDetails = await this.orderSummaryText.textContent();
        expect(await orderId.includes(orderDetails)).toBeTruthy();
    }
}

module.exports = { OrderSummaryPage };