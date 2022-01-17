import { expect } from '@playwright/test';
import { test } from './breakpoints-test';

test.describe('post', () => {
  test.beforeEach(async ({ page}) => {
    await page.goto('/starting');
  });
  test('visual', async ({ page, width }) => {
  expect(await page.screenshot()).toMatchSnapshot(`starting-${width}.png`);
  });
});
