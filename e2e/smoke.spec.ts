import { expect, test } from '@playwright/test';

test.describe('Smoke Verification Suite', () => {
  test('home page remains scrollable without runtime errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('main').first()).toBeVisible();
    await page.mouse.wheel(0, 1800);
    await expect(page.locator('body')).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('docs page remains scrollable without runtime errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/docs', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('main').first()).toBeVisible();
    await page.mouse.wheel(0, 1200);

    expect(errors).toEqual([]);
  });

  test('showcase page remains scrollable without runtime errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto('/showcase', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('main').first()).toBeVisible();
    await page.mouse.wheel(0, 1500);

    expect(errors).toEqual([]);
  });
});
