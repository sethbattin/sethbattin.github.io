import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  outputDir: './test-results',
  projects: [
  {name: 'default-xlg', use: { width: 1280}},
  {name: 'lrg-max',  use: { width: 1279}},
  {name: 'lrg-min',  use: { width: 960}},
  {name: 'med-max',  use: { width: 959}},
  {name: 'med-min',  use: { width: 540}},
  {name: 'sm',  use: { width: 539}},
  ],
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
