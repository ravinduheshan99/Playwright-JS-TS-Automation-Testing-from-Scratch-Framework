const {test, expect} = require('@playwright/test');

test('Taking Screenshots', async({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    // Capture element-level screenshot to validate a specific UI component independently.
    await page.locator("#displayed-text").screenshot({path: 'screenshots/elementLevelScreenshot.png'});
    await page.locator("#hide-textbox").click();
    // Capture full page screenshot after UI change to compare overall layout/state.
    await page.screenshot({path: 'screenshots/pageLevelScreenshot.png'});
    await expect(page.locator("#displayed-text")).toBeHidden();
});

test.only('Visual Comparison', async ({ page }) => {
  await page.goto('https://google.com/');
  // Visual regression assertion compares current UI against stored baseline image.
  await expect(page).toHaveScreenshot('landingPage.png');
});
