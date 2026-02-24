class OrderHistoryPage {
    constructor(page) {
        this.page = page;
        // Table body that contains all order rows
        this.orderHistory = page.locator("tbody");
        // Individual rows representing each order
        this.orders = page.locator("tbody tr");
    }

    // Verifies the newly placed order appears in the order history
    async verifyNewlyPlacedOrderFromOrderHistrory(orderId) {
        // Wait until the table is rendered to avoid querying before DOM updates
        await this.orderHistory.waitFor();
        const tableRows = await this.orders;

        for (let i = 0; i < await tableRows.count(); ++i) {
            // Get the order id displayed in the row header
            const rowOrderId = await tableRows.nth(i).locator("th").textContent();
            // Some UIs may show partial IDs, so includes() is safer than strict equality
            if (await orderId.includes(rowOrderId)) {
                // Click the first button in the row to view order details
                await tableRows.nth(i).locator("button").first().click();
                break; // Stop after finding and opening the correct order
            }
        }
    }
}

module.exports = { OrderHistoryPage };