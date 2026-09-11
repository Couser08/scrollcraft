import { expect, test } from '@playwright/test';

test('home and documentation remain scrollable without runtime errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('main').first()).toBeVisible();
  await page.mouse.wheel(0, 1800);
  await expect(page.locator('body')).toBeVisible();

  await page.goto('/docs', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('main').first()).toBeVisible();
  await page.mouse.wheel(0, 1200);

  expect(errors).toEqual([]);
});
