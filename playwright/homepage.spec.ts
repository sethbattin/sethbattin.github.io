import { test, expect } from '@playwright/test';

test.describe('homepage', () => {
  test.beforeEach(async ({ page}) => {
    await page.goto('/');
  });
  test('visual', async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot('homepage.png');
  });
});
