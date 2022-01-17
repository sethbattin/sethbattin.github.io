import playwright from "playwright";

playwright.firefox.launch({
//  executablePath: '/usr/bin/wslview' 
}).then(async browser => {
  for 
  const width = 960;
  const height = 720;
  const context = await browser.newContext({viewport: {width, height} });
  const page = await context.newPage();
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `homepage-firefox-${width}.png`, fullPage: true })
  await browser.close();
})
