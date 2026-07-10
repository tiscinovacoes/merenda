// =============================================
// SAGED — Teste: Perfil Escola (9 telas)
// =============================================
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('./helpers');

test.describe('Escola', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, 'escola');
  });

  test('Dashboard Escola — KPIs visíveis', async ({ page }) => {
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/Dashboard|Escola/i);
    const kpis = page.locator('.kpi-card');
    expect(await kpis.count()).toBeGreaterThanOrEqual(3);
  });

  test('Planejamento — Calendário alimentar', async ({ page }) => {
    await navigateTo(page, 'planejamento');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/planejamento|semana|cardápio/i);
  });

  test('Cardápios — Menu da escola', async ({ page }) => {
    await navigateTo(page, 'cardapios');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/cardápio|refeição|lanche/i);
  });

  test('Estoque — Controle de produtos', async ({ page }) => {
    await navigateTo(page, 'estoque');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/estoque|produto|quantidade|kg/i);
  });

  test('Consumo — Registro diário', async ({ page }) => {
    await navigateTo(page, 'consumo');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/consumo|registro|refeição/i);
  });

  test('Pedidos — Solicitações de abastecimento', async ({ page }) => {
    await navigateTo(page, 'pedidos');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/pedido|solicitação|abastecimento|status/i);
  });

  test('Entregas — Recebimento de insumos', async ({ page }) => {
    await navigateTo(page, 'entregas');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/entrega|recebimento|nota/i);
  });

  test('Histórico — Registros anteriores', async ({ page }) => {
    await navigateTo(page, 'historico');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/histórico|registro|anterior/i);
  });

  test('Relatórios — Exportações', async ({ page }) => {
    await navigateTo(page, 'relatorios');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/relatório|exportar|gerar/i);
  });

  test('Navegação completa sem erro', async ({ page }) => {
    const pages = ['dashboard', 'planejamento', 'cardapios', 'estoque', 
                   'consumo', 'pedidos', 'entregas', 'historico', 'relatorios'];
    for (const p of pages) {
      await navigateTo(page, p);
      const content = await page.locator('#page-content').textContent();
      expect(content.length).toBeGreaterThan(50);
    }
  });
});
