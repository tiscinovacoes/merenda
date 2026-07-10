// =============================================
// SAGED — Teste: Login & Navegação Geral
// =============================================
const { test, expect } = require('@playwright/test');
const { login, logout } = require('./helpers');

test.describe('Login e Autenticação', () => {

  test('Tela de login carrega corretamente', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('.login-system-name')).toHaveText('SAGED');
    await expect(page.locator('.login-system-subtitle')).toContainText('Alimentação Escolar');
    const profileBtns = page.locator('.profile-btn');
    await expect(profileBtns).toHaveCount(7);
    await expect(page.locator('.login-stats')).toBeVisible();
    await expect(page.locator('#btn-login')).toBeVisible();
  });

  test('Gestor SEMED selecionado por padrão', async ({ page }) => {
    await page.goto('/index.html');
    const gestorBtn = page.locator('[data-profile="gestor"]');
    await expect(gestorBtn).toHaveClass(/active/);
  });

  const profiles = ['gestor', 'nutricionista', 'escola', 'cooperativa', 'agricultor', 'almoxarifado', 'motorista'];

  for (const profile of profiles) {
    test(`Login como ${profile} funciona`, async ({ page }) => {
      await login(page, profile);
      await expect(page.locator('#screen-app')).toBeVisible();
      await expect(page.locator('.sidebar')).toBeVisible();
      const menuItems = page.locator('.sidebar-nav-item');
      expect(await menuItems.count()).toBeGreaterThan(3);
    });
  }

  test('Logout retorna para login', async ({ page }) => {
    await login(page, 'gestor');
    await logout(page);
    await expect(page.locator('#screen-login')).toBeVisible();
  });

  test('Trocar perfil (Gestor → Escola)', async ({ page }) => {
    await login(page, 'gestor');
    await logout(page);
    await login(page, 'escola');
    await expect(page.locator('#screen-app')).toBeVisible();
  });
});
