/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  timeout: 60_000,
  use: {
    // Base trace and other options can be enabled when debugging
    actionTimeout: 15_000,
  },
  testDir: './tests',
}
module.exports = config
