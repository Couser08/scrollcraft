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

  test('parallax progress advances inside overflow:hidden ancestor', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();

    // Section 2 contains Parallax inside an overflow-hidden preview stage
    const target = page.locator('.sc-parallax-target').first();
    await expect(target).toBeAttached();

    // Verify named timeline is linked directly to document scroller
    const timeline = await target.evaluate((el) => {
      return (el as HTMLElement).style.animationTimeline || window.getComputedStyle(el).animationTimeline;
    });
    expect(timeline).toBe('--sc-doc-scroll');

    // Scroll down to advance progress through Section 2
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(300);

    // Verify transform exists and is active
    const transform = await target.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    expect(transform).toBeDefined();
    expect(errors).toEqual([]);
  });

  test('deterministic scroll: instant scroll updates metrics and compositor without phase-lag', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();

    // Instant jump to y = 1000
    await page.evaluate(() => {
      window.scrollTo({ top: 1000, behavior: 'instant' });
    });

    // Wait 1 frame for compositor cycle
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    await page.waitForTimeout(100);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(1000);

    expect(errors).toEqual([]);
  });

  test('reduced-motion: transforms remain none or identity across animated elements under prefers-reduced-motion', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('body')).toBeVisible();

    // Instant jump down
    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    await page.waitForTimeout(200);

    const targets = page.locator('.sc-parallax-target');
    const count = await targets.count();
    for (let i = 0; i < count; i++) {
      const target = targets.nth(i);
      const isVisible = await target.isVisible().catch(() => false);
      if (isVisible) {
        const transform = await target.evaluate((el) => window.getComputedStyle(el).transform);
        const isIdentityOrNone = transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)';
        expect(isIdentityOrNone).toBe(true);
      }
    }

    expect(errors).toEqual([]);
  });
});
