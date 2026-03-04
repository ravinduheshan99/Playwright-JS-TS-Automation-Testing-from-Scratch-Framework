import { test as baseTest } from '@playwright/test';

interface TestDataForOrder {
    loginEmail: string;
    loginPassword: string;
    productName: string;
    country: string;
}

// Custom test wrapper to inject reusable test data for order flows as fixtures
export const customtest = baseTest.extend<{ testDataForOrder: TestDataForOrder }>({
    testDataForOrder: {
        loginEmail: "test@gmail.com",
        loginPassword: "test@123",
        productName: "ZARA COAT 3",
        country: "Sri Lanka"
    }
});