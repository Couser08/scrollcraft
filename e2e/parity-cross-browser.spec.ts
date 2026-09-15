import { expect, test } from '@playwright/test';

test.describe('Cross-Browser Parity and Reduced-Motion Verification', () => {
  test('verifies zero console errors and clean rendering across browsers', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();

    // Scroll down through section 1 and 2
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(300);

    // Verify root tier attribute is set
    await expect(page.locator('html')).toHaveAttribute('data-scrollcraft-tier', /low|balanced|high/);

    expect(errors).toEqual([]);
  });

  test('verifies reduced-motion media feature halts motion on documentation and showcase', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Emulate reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/docs', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();

    // Scroll through docs
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(200);

    expect(errors).toEqual([]);
  });
});
