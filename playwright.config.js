// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { trace } from 'node:console';


/**
 * @see https://playwright.dev/docs/test-configuration
 */

const config = ({
  testDir: './tests',
  timeout: 40 * 1000,
  expect: { timeout: 40 * 1000 },
  reporter: 'html',

  use: {
    browserName: 'chromium',
    headless: false,
    screenshot : 'on',
    trace : 'on'
  },
});

module.exports = config;

