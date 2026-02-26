const { test, expect } = require('@playwright/test');

test('Verify New Features', async ({ page }) => {
  // Go to the app
  await page.goto('http://localhost:3000');

  // Wait for the tour to appear
  await page.waitForSelector('.dialogue-overlay', { timeout: 5000 });
  await page.screenshot({ path: 'welcome_tour.png' });
  console.log('Welcome tour screenshot taken');

  // Click through the tour
  let nextButton = await page.$('.tour-btn-next');
  while (nextButton) {
    await nextButton.click();
    await page.waitForTimeout(500);
    nextButton = await page.$('.tour-btn-next');
  }

  // Check dashboard
  await page.screenshot({ path: 'dashboard.png' });
  console.log('Dashboard screenshot taken');

  // Simulate 100% completion to see Master Certificate
  await page.evaluate(() => {
    const courses = JSON.parse(localStorage.getItem('completedCourses') || '[]');
    const allCourseIds = ['fire-safety', 'electrical-safety', 'road-safety', 'home-hazards'];
    localStorage.setItem('completedCourses', JSON.stringify(allCourseIds));
    window.location.reload();
  });

  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'master_certificate_view.png' });
  console.log('Master Certificate screenshot taken');
});
