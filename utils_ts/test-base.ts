import { test as baseTest } from '@playwright/test';

// Interface defining the structure of order related test data
interface TestDataForOrder {
    loginEmail: string;
    loginPassword: string;
    productName: string;
    country: string;
}

// Custom Playwright test extension used to inject reusable test data as a fixture
export const customtest = baseTest.extend<{ testDataForOrder: TestDataForOrder }>({
    
    // Default test data used in order placement scenarios
    testDataForOrder: {
        loginEmail: "test@gmail.com",
        loginPassword: "test@123",
        productName: "ZARA COAT 3",
        country: "Sri Lanka"
    }
});