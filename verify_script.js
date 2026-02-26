const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000');

    // Wait for the tour to appear
    console.log('Waiting for tour overlay...');
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
    console.log('Simulating 100% completion...');
    await page.evaluate(() => {
      const allCourseIds = ['fire-safety', 'electrical-safety', 'road-safety', 'home-hazards'];
      localStorage.setItem('completedCourses', JSON.stringify(allCourseIds));
      window.location.reload();
    });

    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'master_certificate_view.png' });
    console.log('Master Certificate screenshot taken');

  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    await browser.close();
  }
})();
