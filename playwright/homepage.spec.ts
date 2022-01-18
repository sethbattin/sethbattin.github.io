import { expect } from '@playwright/test';
import { test } from './breakpoints-test';

test.describe('homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });
  test('visual', async ({ page, width }) => {
  expect(await page.screenshot()).toMatchSnapshot(`homepage-${width}.png`);
  });
});
