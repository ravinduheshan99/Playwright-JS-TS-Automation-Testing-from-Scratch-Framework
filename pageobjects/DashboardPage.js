class DashboardPage {
    constructor(page) {
        this.page = page;
        // All product cards on the dashboard
        this.products = page.locator(".card-body");
        // Product names inside the cards
        this.productsText = page.locator(".card-body b");
        // Cart button to navigate to the shopping cart
        this.cart = page.locator("[routerlink*='cart']");
    }

    // Search for a specific product by name and add it to the cart
    async searchProductAddCart(productName) {
        // Wait until at least one product card is visible
        await this.products.last().waitFor();
        console.log(await this.productsText.allTextContents());

        const count = await this.products.count();

        for (let i = 0; i < count; ++i) {
            // Compare product name in the card
            if (await this.products.nth(i).locator("b").textContent() === productName) {
                // Click "Add To Cart" button inside the correct product card
                await this.products.nth(i).locator("text= Add To Cart").click();
                break; // Stop after adding the intended product
            }
        }
    }

    // Navigate to the cart page
    async navigateToCart() {
        await this.cart.click();
    }
}

module.exports = { DashboardPage };