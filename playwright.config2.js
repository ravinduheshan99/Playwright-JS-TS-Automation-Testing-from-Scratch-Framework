// To run this configuration file: npx playwright test tests/ClientAppPageObjects.spec.js --config playwright.config2.js
// To run this configuration file giving both --config and --project parameter: npx playwright test tests/ClientAppPageObjects.spec.js --config playwright.config2.js --project=safariExecution


// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { trace } from 'node:console';
import { permission } from 'node:process';


/**
 * @see https://playwright.dev/docs/test-configuration
 */

const config = ({
  testDir: './tests',
  retries:1,
  workers:3,
  timeout: 40 * 1000,
  expect: { timeout: 40 * 1000 },
  reporter: 'html',

  projects: [
    {
      name: 'safariExecution',
      use: {
        browserName: 'webkit',
        headless: true,
        screenshot: 'off',
        trace: 'on',
        //...devices['iPhone 11']
      }
    },

    {
      name: 'chromeExecution',
      use: {
        browserName: 'chromium',
        headless: false,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on',
        ignoreHttpsErrors:true,
        permissions: ['geolocation']
        //viewport: {width:720, height:720}
      }
    }
  ]
});

module.exports = config;

