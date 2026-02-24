const base = require('@playwright/test');

// Custom test wrapper to inject reusable test data for order flows as fixtures
exports.customtest = base.test.extend({
    testDataForOrder: {
        loginEmail: "test@gmail.com",
        loginPassword: "test@123",
        productName: "ZARA COAT 3",
        country: "Sri Lanka"
    }
});