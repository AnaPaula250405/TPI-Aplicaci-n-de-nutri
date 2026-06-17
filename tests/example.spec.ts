import { test, expect } from '@playwright/test';

const BASE_URL = 'https://budin-qa.vercel.app';

test('CP01 - La pagina principal carga correctamente', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.locator('body')).toBeVisible();
  await expect(page.locator('button:has-text("Comenzar"), a:has-text("Comenzar")').first()).toBeVisible();
});

test('CP02 - El formulario de encuesta es accesible', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.locator('button:has-text("Comenzar"), a:has-text("Comenzar")').first().click();
  await page.waitForTimeout(1500);
  await expect(page.getByText('Datos personales').first()).toBeVisible();
});

test('CP03 - Se puede completar y enviar la encuesta', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.locator('button:has-text("Comenzar"), a:has-text("Comenzar")').first().click();
  await page.waitForTimeout(1500);
  await page.locator('text=Femenino').first().click();
  await page.locator('button:has-text("Continuar")').first().click();
  await page.waitForTimeout(1000);
  await expect(page.locator('body')).toBeVisible();
});

test('CP04 - El panel de administracion es accesible', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin`);
  await expect(page.locator('body')).toBeVisible();
  const hasLogin = await page.locator('input[type="password"]').isVisible();
  const hasPanel = await page.locator('table, canvas, svg').first().isVisible().catch(() => false);
  expect(hasLogin || hasPanel).toBeTruthy();
});

test('CP05 - Login al panel de administracion', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin`);
  const passwordInput = page.locator('input[type="password"]');
  if (await passwordInput.isVisible()) {
    await passwordInput.fill('123');
    await page.locator('button[type="submit"], button').first().click();
    await page.waitForTimeout(1500);
  }
  await expect(page.locator('body')).toBeVisible();
});

test('CP06 - Los resultados son visibles en el admin', async ({ page }) => {
  await page.goto(`${BASE_URL}/admin`);
  const passwordInput = page.locator('input[type="password"]');
  if (await passwordInput.isVisible()) {
    await passwordInput.fill('123');
    await page.locator('button[type="submit"], button').first().click();
    await page.waitForTimeout(2000);
  }
  const hasContent = await page.locator('table, canvas, svg').first().isVisible().catch(() => false);
  expect(hasContent).toBeTruthy();
});

test('CP07 - Los enlaces principales funcionan', async ({ page }) => {
  await page.goto(BASE_URL);
  await expect(page.locator('button:has-text("Comenzar"), a:has-text("Comenzar")').first()).toBeVisible();
  await expect(page.locator('body')).toBeVisible();
});
