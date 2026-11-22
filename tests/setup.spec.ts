import { test, expect } from '@playwright/test';

// A local page checks the installed browser, locators and assertions without network access.
test('browser setup is ready', async ({ page }) => {
  await page.setContent('<h1>Lab 1</h1><button type="button" onclick="this.textContent=\'Ready\'">Start</button>');
  await expect(page.getByRole('heading', { name: 'Lab 1' })).toBeVisible();
  await page.getByRole('button', { name: 'Start', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Ready', exact: true })).toBeVisible();
});
