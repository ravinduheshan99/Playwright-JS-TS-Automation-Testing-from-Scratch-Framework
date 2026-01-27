// @ts-check
import { defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */

const config = ({
  // Directory where Playwright looks for test files
  testDir: './tests',
  // Maximum time allowed for a single test
  timeout: 40 * 1000,
  // Maximum wait time for expect assertions
  expect: { timeout: 40 * 1000 },
  // Generates an HTML report after test execution
  reporter: 'html',

  use: {
    // Default browser (use 'firefox' for Firefox or 'webkit' for Safari)
    browserName: 'chromium',
    // Run browser with UI for easier debugging
    headless: false
  },
});

// Export configuration for Playwright test runner
module.exports = config;

