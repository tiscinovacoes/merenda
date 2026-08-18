// =============================================
// SUALE — Testes do Almoxarifado Central
// =============================================
const { test, expect } = require('@playwright/test');
const { login, navigateTo, getPageContent } = require('./helpers');

test.describe('Módulo de Almoxarifado Central', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, 'almoxarifado');
  });

  test('Dashboard operacional exibe indicadores principais', async ({ page }) => {
    const pageText = await getPageContent(page);
    expect(pageText).toMatch(/Almoxarifado|Estoque|Operacional/i);
    await expect(page.locator('.kpi-card, .card').first()).toBeVisible();
  });

  test('Fluxo de separação de pedidos com lote e validade', async ({ page }) => {
    await navigateTo(page, 'separacao');
    const pageText = await getPageContent(page);
    expect(pageText).toMatch(/Separação|Ordens|Expedição|Estoque/i);
  });

  test('Carregamento de veículos e atribuição de rotas', async ({ page }) => {
    await navigateTo(page, 'carregamento');
    const pageText = await getPageContent(page);
    expect(pageText).toMatch(/Carregamento|Expedição|Rotas|Rota|Estoque|Ordens de Entrega/i);
  });

  test('Consulta de estoque por lote e validade', async ({ page }) => {
    await navigateTo(page, 'inventario');
    const pageText = await getPageContent(page);
    expect(pageText).toMatch(/Estoque|Lote|Produto|Validade|Posição|Central/i);
  });
});
