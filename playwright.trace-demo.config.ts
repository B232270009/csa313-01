import { defineConfig, devices } from '@playwright/test';
import mainConfig from './playwright.config';

// Алдаа мөшгих туршилтыг үндсэн 3 тестийн амжилттай тайлангаас тусад нь хадгална.
export default defineConfig({
  ...mainConfig,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  testDir: './experiments',
  outputDir: './test-results/trace-demo',
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'evidence/trace-demo-report', open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    trace: 'on',
    screenshot: 'only-on-failure',
  },
});
