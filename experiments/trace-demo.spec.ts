import { test, expect } from '@playwright/test';

test('санаатай буруу assertion ашиглан trace үүсгэх', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page.getByTestId('title')).toHaveText('Products');
  try {
    // Бодит гарчиг Products. Энэ assertion зориудаар унаж trace-д тэмдэглэгдэнэ.
    await expect(page.getByTestId('title')).toHaveText('Wrong title', { timeout: 2000 });
  } finally {
    // Assertion унасан ч session-оос гарч дуусгана.
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('button', { name: 'Logout', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
  }
});
