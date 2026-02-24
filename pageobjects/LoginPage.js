class LoginPage {
    constructor(page) {
        this.page = page;
        // Login button on the authentication page
        this.logInButton = page.locator("[value='Login']");
        // Email input field
        this.userName = page.locator('#userEmail');
        // Password input field
        this.password = page.locator('#userPassword');
    }

    // Navigate to the login page
    async goToLandingPage() {
        await this.page.goto("https://rahulshettyacademy.com/client/auth/login");
    }

    // Perform login with provided credentials
    async validLogin(username, password) {
        await this.userName.fill(username);
        await this.password.fill(password);
        await this.logInButton.click();
        // Wait for network calls and SPA rendering to settle after login
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = { LoginPage };