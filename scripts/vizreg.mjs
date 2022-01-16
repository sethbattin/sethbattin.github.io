import puppeteer from "puppeteer";

puppeteer.launch({
//  executablePath: '/usr/bin/wslview' 
}).then(async browser => {
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  const dims = await page.evaluate(() => {
  return {
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
          deviceScaleFactor: window.devicePixelRatio,
        };
  });

  console.log({dims});
  await browser.close();
})
