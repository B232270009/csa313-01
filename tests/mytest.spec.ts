import { test, expect, type Page } from '@playwright/test';

// Давтагдах нэвтрэх алхмууд. Нууц үг нь демо сайтын нийтэд нээлттэй өгөгдөл.
async function login(page: Page, password = 'secret_sauce') {
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  // Тест бүр шинэ browser context-той тул өмнөх тестийн session, сагсыг өвлөхгүй.
  await page.goto('/');
});

test.afterEach(async ({ page }) => {
  // Нэвтэрсэн бол гарна. Сөрөг тестэд session үүсээгүй тул logout байхгүй.
  const menu = page.getByRole('button', { name: 'Open Menu' });
  if (await menu.isVisible()) {
    await menu.click();
    await page.getByRole('button', { name: 'Logout', exact: true }).click();
  }
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
});

test('амжилттай нэвтрэх', async ({ page }) => {
  await login(page);
  // URL болон харагдах гарчгийг хамтад нь шалгаж амжилттай нэвтэрснийг батална.
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(page.getByTestId('title')).toHaveText('Products');
  await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
});

test('буруу нууц үгээр нэвтрэх', async ({ page }) => {
  await login(page, 'wrong_password');
  await expect(page.getByTestId('error')).toHaveText(
    'Epic sadface: Username and password do not match any user in this service',
  );
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.getByTestId('inventory-container')).toHaveCount(0);
});

test('бараа сагсанд нэмэх', async ({ page }) => {
  await login(page);
  await page.getByRole('button', { name: 'Add to cart', exact: true })
    .and(page.getByTestId('add-to-cart-sauce-labs-backpack')).click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');
  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/\/cart\.html$/);
  // Зөвхөн badge бус, сагсны мөрийн нэр болон тоо хэмжээг шалгана.
  const item = page.getByTestId('inventory-item');
  await expect(item).toHaveCount(1);
  await expect(item.getByTestId('inventory-item-name')).toHaveText('Sauce Labs Backpack');
  await expect(item.getByTestId('item-quantity')).toHaveText('1');
  // Демо өгөгдлийг цэвэрлэж, badge арилсныг батална.
  await item.getByRole('button', { name: 'Remove', exact: true }).click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveCount(0);
});
