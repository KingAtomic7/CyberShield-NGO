const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // First login to get the session cookie
  const loginResponse = await page.request.post('http://localhost:3002/api/auth', {
    headers: { 'Content-Type': 'application/json' },
    data: { action: 'login', username: 'ngo_admin', password: 'Ngo@123' }
  });

  console.log('Login status:', loginResponse.status());
  const loginData = await loginResponse.json();
  console.log('Login result:', loginData);

  // Navigate to dashboard
  await page.goto('http://localhost:3002/dashboard', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // wait for client-side rendering

  // Take screenshot
  await page.screenshot({ path: 'dashboard-screenshot.png', fullPage: true });
  console.log('Screenshot saved to dashboard-screenshot.png');

  await browser.close();
})();