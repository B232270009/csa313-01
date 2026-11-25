import { defineConfig, devices } from '@playwright/test';
import mainConfig from './playwright.config';

// Шинэ тайланг Git-д хадгалсан trace нотолгооноос тусад нь үүсгэнэ.
export default defineConfig({
  ...mainConfig,
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  testDir: './experiments',
  outputDir: './test-results/trace-demo',
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-trace-demo-report', open: 'never' }]],
});
