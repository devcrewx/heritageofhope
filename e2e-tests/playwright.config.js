/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  timeout: 60_000,
  use: {
    actionTimeout: 15_000,
  },
  testDir: './tests',
  projects: [
    {
      name: 'api',
      testMatch: /.*\.spec\.js/,
    },
    {
      name: 'a11y',
      testMatch: /a11y\.spec\.js/,
      use: {
        baseURL: process.env.WEB_URL || 'https://web-peach-six-y2ufgnodmc.vercel.app',
      },
    },
  ],
}
module.exports = config
