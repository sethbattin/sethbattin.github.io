import { test as base } from '@playwright/test';

export type TestOptions = {
  width: number;
};

export const test = base.extend<TestOptions>({
  width: 1280,
  page: async ({ page, width }, use) => {
    await page.setViewportSize({width, height: 720});
    await use(page);
  }
})
