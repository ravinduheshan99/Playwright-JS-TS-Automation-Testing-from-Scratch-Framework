import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/angularpractice/');
  await page.locator('form input[name="name"]').click();
  await page.locator('form input[name="name"]').press('CapsLock');
  await page.locator('form input[name="name"]').fill('R');
  await page.locator('form input[name="name"]').press('CapsLock');
  await page.locator('form input[name="name"]').fill('Ravindu ');
  await page.locator('form input[name="name"]').press('CapsLock');
  await page.locator('form input[name="name"]').fill('Ravindu H');
  await page.locator('form input[name="name"]').press('CapsLock');
  await page.locator('form input[name="name"]').fill('Ravindu Haputhanthri');
  await page.locator('input[name="email"]').click();
  await page.locator('input[name="email"]').fill('ravinduheshan99@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Password' }).fill('R');
  await page.getByRole('textbox', { name: 'Password' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Password' }).fill('Rv@test123');
  await page.getByRole('checkbox', { name: 'Check me out if you Love' }).check();
  await page.getByRole('radio', { name: 'Employed' }).check();
  await page.locator('input[name="bday"]').fill('1999-12-06');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByText('× Success! The Form has been')).toBeVisible();
  await expect(page.locator('form-comp')).toContainText('× Success! The Form has been submitted successfully!.');
});