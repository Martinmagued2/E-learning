const { test, expect } = require('@playwright/test');

test('Verify All New Features', async ({ page }) => {
  // Capture console logs
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // Go to the app
  await page.goto('http://localhost:3000');

  // 1. Verify Dialogue Tour
  const nextBtn = page.locator('#nextDialogue');
  await nextBtn.waitFor({ state: 'visible', timeout: 10000 });

  // Click through the tour
  let count = 0;
  while (await nextBtn.isVisible() && count < 10) {
      await nextBtn.click();
      await page.waitForTimeout(500);
      count++;
  }

  // 2. Enter Name and Start
  await page.fill('#studentName', 'Test Student');
  await page.click('#startBtn');

  // 3. Verify Dashboard Tools
  const toolsSection = page.locator('.tools-section');
  await expect(toolsSection).toBeVisible();

  // 4. Verify Mini Games Menu
  await page.click('#openMiniGames');

  const gamesMenu = page.locator('.games-menu');
  await expect(gamesMenu).toBeVisible();

  const games = [
      'محاكي الطوارئ',
      'تحدي الملابس الواقية',
      'غرفة الهروب',
      'أوجد الاختلافات الخطرة',
      'خريطة المخاطر',
      'أركيد السلامة'
  ];

  for (const game of games) {
      const gameItem = page.locator(`.game-menu-item:has-text("${game}")`);
      await expect(gameItem).toBeVisible();
  }

  // Close mini games menu
  await page.keyboard.press('Escape');

  // 5. Verify Master Certificate
  await page.evaluate(() => {
    localStorage.setItem('completedCourses', JSON.stringify(['fire-safety', 'electrical-safety', 'road-safety', 'home-hazards']));
    window.location.reload();
  });

  // After reload, we are on the welcome screen again.
  const startBtn = page.locator('#startBtn');
  await expect(startBtn).toBeVisible({ timeout: 10000 });
  await startBtn.click();

  // Now on dashboard, wait for certificates grid to load
  await page.waitForSelector('#certificatesGrid');

  // Use a more specific locator for the gold master certificate button
  const masterCertBtn = page.locator('.master-cert .gold-btn');
  await expect(masterCertBtn).toBeVisible({ timeout: 10000 });

  await page.screenshot({ path: 'screenshots/master_certificate_entry.png' });
});
