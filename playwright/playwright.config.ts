import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  outputDir: './test-results',
  reporter: [ [ 'html'
    // this just breaks the show-report subcommand :(
    //, { outputFolder: './playwright/html-report' } 
   ] ],
  testDir: '.',
  use: {
    browserName: 'firefox',  
  },
  webServer: {
    command: 'npm run start',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
};
export default config;
