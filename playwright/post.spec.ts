import { test, expect } from '@playwright/test';

test.describe('post', () => {
  test.beforeEach(async ({ page}) => {
    await page.goto('/starting');
  });
  test('visual', async ({ page }) => {
    expect(await page.screenshot()).toMatchSnapshot('starting.png');
  });
});
