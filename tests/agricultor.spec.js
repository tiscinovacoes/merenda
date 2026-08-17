// =============================================
// SUALE — Teste: Perfil Agricultor Familiar (8 telas)
// =============================================
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('./helpers');

test.describe('Agricultor Familiar', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, 'agricultor');
  });

  test('Dashboard Agricultor — KPIs visíveis', async ({ page }) => {
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/Dashboard|Agricultor|Painel/i);
    const kpis = page.locator('.kpi-card');
    expect(await kpis.count()).toBeGreaterThanOrEqual(3);
  });

  test('Produção — Status da produção', async ({ page }) => {
    await navigateTo(page, 'producao');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/produção|safra|plantio|colheita/i);
  });

  test('Estoque — Estoque do agricultor', async ({ page }) => {
    await navigateTo(page, 'estoque');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/estoque|produto|kg|quantidade/i);
  });

  test('Pedidos — Pedidos recebidos', async ({ page }) => {
    await navigateTo(page, 'pedidos');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/pedido|cooperativa|escola|status/i);
  });

  test('Entregas — Entregas realizadas', async ({ page }) => {
    await navigateTo(page, 'entregas');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/entrega|nota|realizada/i);
  });

  test('Calendário — Agenda de entregas', async ({ page }) => {
    await navigateTo(page, 'calendario');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/planejamento|calendário|agenda|cardápio/i);
  });

  test('Relatórios — Relatórios financeiros', async ({ page }) => {
    await navigateTo(page, 'relatorios');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/relatório|financeiro|exportar/i);
  });

  test('Perfil — Dados cadastrais', async ({ page }) => {
    await navigateTo(page, 'perfil');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/perfil|cadastro|DAP|CPF|propriedade/i);
  });

  test('Navegação completa sem erro', async ({ page }) => {
    const pages = ['dashboard', 'producao', 'estoque', 'pedidos', 
                   'entregas', 'calendario', 'relatorios', 'perfil'];
    for (const p of pages) {
      await navigateTo(page, p);
      const content = await page.locator('#page-content').textContent();
      expect(content.length).toBeGreaterThan(50);
    }
  });
});
