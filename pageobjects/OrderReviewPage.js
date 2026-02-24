const { expect } = require('@playwright/test');

class OrderReviewPage {
    constructor(page) {
        this.page = page;
        // Input field for selecting the country during checkout
        this.country = page.locator("[placeholder*='Country']");
        // Container that shows the autocomplete dropdown for countries
        this.countryResults = page.locator(".ta-results");
        // Displays the logged-in user's email on the review page
        this.loggedInUserEmail = page.locator(".user__name [type='text']");
        // Button to finalize the order
        this.submitOrder = page.locator(".action__submit");
    }

    // Types in the country field and selects the matching country from suggestions
    async searchCountryAndSelect(country) {
        await this.country.pressSequentially("Sr", { delay: 150 });
        await this.countryResults.waitFor();
        const countryOptionsCount = await this.countryResults.locator("button").count();

        for (let i = 0; i < countryOptionsCount; ++i) {
            const countryName = await this.countryResults.locator("button").nth(i).textContent();
            if (countryName.trim() === country) {
                await this.countryResults.locator("button").nth(i).click();
                break; // Stop once the intended country is selected
            }
        }
    }

    // Validates that the logged-in user's email matches the expected email
    async verifyUserEmail(loginEmail) {
        expect(await this.loggedInUserEmail.first()).toHaveText(loginEmail);
    }

    // Clicks the submit button to place the order
    async placeOrder() {
        await this.submitOrder.click();
    }
}

module.exports = { OrderReviewPage };