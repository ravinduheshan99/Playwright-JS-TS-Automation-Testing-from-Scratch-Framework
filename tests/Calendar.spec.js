const { test, expect } = require('@playwright/test');

test('Calendar Validations', async ({ browser }) => {
    // Create a fresh context to ensure calendar state is not affected by previous tests
    const context = await browser.newContext();
    const page = await context.newPage();

    // Test data kept separate so date changes do not affect test logic
    const year = "1999";
    const month = "12";
    const date = "6";

    // Expected order matches the input fields: month, day, year
    const expectedList = [month, date, year];

    await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/offers');

    // Open the date picker widget
    await page.locator(".react-date-picker__calendar-button__icon").click();

    // Switch from day view to year selection by navigating up the calendar hierarchy
    await page.locator(".react-calendar__navigation__label__labelText").click();
    await page.locator(".react-calendar__navigation__label__labelText").click();

    // Navigate across year ranges until the required year becomes visible
    await page.locator(".react-calendar__navigation__arrow").nth(1).click();
    await page.locator(".react-calendar__navigation__arrow").nth(1).click();
    await page.locator(".react-calendar__navigation__arrow").nth(1).click();

    // Select year, month, and date in sequence to populate the input fields
    await page.getByText(year).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(month) - 1).click();
    await page.locator("//abbr[text()='" + date + "']").click();

    // Capture the final date values from the input fields for validation
    const finalDateInputs = await page.locator(".react-date-picker__inputGroup__input");

    // Validate each part of the selected date against the expected values
    for (let i = 0; i < expectedList.length; i++) {
        const value = await finalDateInputs.nth(i).inputValue();
        expect(value).toEqual(expectedList[i]);
    }
});
