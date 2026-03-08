const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://eventhub.rahulshettyacademy.com';
const USERNAME = 'testrhh@gmail.com';
const PASSWORD = 'Test@123';

// Helper to generate a future date string (YYYY-MM-DDTHH:mm)
function futureDateValue(daysAhead = 2) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(18, 0, 0, 0); // 6:00 PM
  return d.toISOString().slice(0, 16);
}

// Reusable login helper
async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByPlaceholder('you@email.com').fill(USERNAME);
  await page.getByLabel('Password').fill(PASSWORD);
  await page.locator('#login-btn').click();
  await expect(page.getByRole('link', { name: 'Browse Events →' })).toBeVisible();
}

test('Assessment: Full booking flow with event creation', async ({ page }) => {
  // Step 1: Login
  await login(page);

  // Step 2: Create a new event
  await page.goto(`${BASE_URL}/admin/events`);
  const eventTitle = `Test Event ${Date.now()}`;
  await page.locator('#event-title-input').fill(eventTitle);
  await page.locator('#admin-event-form textarea').fill('Automated test event description');
  await page.getByLabel('City').fill('Test City');
  await page.getByLabel('Venue').fill('Test Venue');
  await page.getByLabel('Event Date & Time').fill(futureDateValue());
  await page.getByLabel('Price ($)').fill('100');
  await page.getByLabel('Total Seats').fill('50');
  await page.locator('#add-event-btn').click();
  await expect(page.getByText('Event created!')).toBeVisible();

  // Step 3: Find the event card and capture seats
  await page.goto(`${BASE_URL}/events`);
  const eventCards = page.locator('[data-testid="event-card"]');
  await expect(eventCards.first()).toBeVisible();
  const myEventCard = eventCards.filter({ hasText: eventTitle });
  await expect(myEventCard).toBeVisible({ timeout: 5000 });
  const seatText = await myEventCard.locator(':text("seat")').first().innerText();
  const seatsBeforeBooking = parseInt(seatText.match(/\d+/)[0], 10);

  // Step 4: Start booking
  await myEventCard.locator('[data-testid="book-now-btn"]').click();

  // Step 5: Fill booking form
  await expect(page.locator('#ticket-count')).toHaveText('1');
  await page.getByLabel('Full Name').fill('Test User');
  await page.locator('#customer-email').fill('testrhh@gmail.com');
  await page.getByPlaceholder('+91 98765 43210').fill('9876543210');
  await page.locator('.confirm-booking-btn').click();

  // Step 6: Verify booking confirmation
  const bookingRefEl = page.locator('.booking-ref').first();
  await expect(bookingRefEl).toBeVisible();
  const bookingRef = (await bookingRefEl.innerText()).trim();

  // Step 7: Verify in My Bookings
  await page.getByRole('link', { name: 'View My Bookings' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/bookings`);
  const bookingCards = page.locator('#booking-card');
  await expect(bookingCards.first()).toBeVisible();
  const myBookingCard = bookingCards.filter({ has: page.locator('.booking-ref', { hasText: bookingRef }) });
  await expect(myBookingCard).toBeVisible();
  await expect(myBookingCard).toContainText(eventTitle);

  // Step 8: Verify seat reduction
  await page.goto(`${BASE_URL}/events`);
  await expect(eventCards.first()).toBeVisible();
  const myEventCard2 = eventCards.filter({ hasText: eventTitle });
  await expect(myEventCard2).toBeVisible();
  const seatTextAfter = await myEventCard2.locator(':text("seat")').first().innerText();
  const seatsAfterBooking = parseInt(seatTextAfter.match(/\d+/)[0], 10);
  expect(seatsAfterBooking).toBe(seatsBeforeBooking - 1);
});
