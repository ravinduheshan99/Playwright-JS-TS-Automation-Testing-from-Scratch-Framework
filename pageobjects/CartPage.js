const { expect } = require('@playwright/test');

class CartPage {
    constructor(page) {
        this.page = page;
        // All products listed in the cart
        this.cartProduct = page.locator("div li");
        // Checkout button to proceed to order review
        this.checkoutButton = page.locator("text=Checkout");
    }

    // Verify that a specific product is visible in the cart
    async verifyProductIsDisplayed(productName) {
        // Wait for the last cart item to be rendered to avoid race conditions
        await this.cartProduct.last().waitFor();
        const isProductVisible = await this.page.locator("h3:has-text('" + productName + "')").isVisible();
        expect(isProductVisible).toBeTruthy();
    }

    // Click the checkout button to proceed
    async checkout() {
        await this.checkoutButton.click();
    }
}

module.exports = { CartPage };