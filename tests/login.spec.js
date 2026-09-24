// =============================================
// SUALE — Teste: Portal Público, Login & Navegação Geral (v3.0.0 Cívico Ipê)
// =============================================
const { test, expect } = require('@playwright/test');
const { login, logout } = require('./helpers');

test.describe('Portal Público & Autenticação Institucional', () => {

  test('Portal Público carrega por padrão na raiz com indicadores das 8 escolas piloto', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    await expect(page.locator('.public-hero h1')).toContainText('Alimentação Escolar Servida com Transparência');
    await expect(page.locator('.civic-pnae-badge')).toContainText('SELO VERDE PNAE');
    await expect(page.locator('.public-stats-grid .stat-card-ipe')).toHaveCount(4);
    await expect(page.locator('#public-schools-list .stat-card-ipe')).toHaveCount(8);
    await expect(page.locator('button:has-text("Acesso Restrito")')).toBeVisible();
  });

  test('Filtro e busca de escolas piloto no Portal Público', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    await page.waitForSelector('#public-school-search', { state: 'visible' });
    await page.fill('#public-school-search', 'Demosthenes');
    await page.waitForTimeout(300);
    const cards = page.locator('#public-schools-list .stat-card-ipe');
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText('DEMOSTHENES');
  });

  test('Alternância entre Portal Público e Tela de Login Institucional', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    
    // 1. Clica em Acesso Restrito para revelar a tela de login
    const btnRestrito = page.locator('button:has-text("Acesso Restrito")');
    await btnRestrito.click();
    await expect(page.locator('#screen-login')).toBeVisible();
    const profileBtns = page.locator('.profile-btn');
    await expect(profileBtns).toHaveCount(7);
    await expect(page.locator('#btn-login')).toBeVisible();

    // 2. Clica no botão de Portal Público para retornar à transparência
    const btnPublico = page.locator('.btn-portal-pub');
    await btnPublico.click();
    await expect(page.locator('.public-hero h1')).toBeVisible();
    await expect(page.locator('#screen-login')).toBeHidden();
  });

  test('Gestor SEMED selecionado por padrão na tela de login', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(300);
    const btnRestrito = page.locator('button:has-text("Acesso Restrito")');
    if (await btnRestrito.isVisible()) {
      await btnRestrito.click();
    }
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
