// =============================================
// SAGED — Teste: Perfil Cooperativa (11 telas)
// =============================================
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('./helpers');

test.describe('Cooperativa', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, 'cooperativa');
  });

  test('Dashboard Cooperativa — KPIs visíveis', async ({ page }) => {
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/Dashboard|Cooperativa/i);
    const kpis = page.locator('.kpi-card');
    expect(await kpis.count()).toBeGreaterThanOrEqual(3);
  });

  test('Agricultores — Lista de associados', async ({ page }) => {
    await navigateTo(page, 'agricultores');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/agricultor|associado|DAP/i);
  });

  test('Produtos — Catálogo de produtos', async ({ page }) => {
    await navigateTo(page, 'produtos');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/produto|kg|preço/i);
  });

  test('Estoque — Controle de estoque', async ({ page }) => {
    await navigateTo(page, 'estoque');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/estoque|produto|quantidade/i);
  });

  test('Pedidos — Pedidos recebidos', async ({ page }) => {
    await navigateTo(page, 'pedidos');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/pedido|escola|status/i);
  });

  test('Planejamento — Planejamento de produção', async ({ page }) => {
    await navigateTo(page, 'planejamento');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/planejamento|produção|demanda/i);
  });

  test('Rotas — Planejamento logístico', async ({ page }) => {
    await navigateTo(page, 'rotas');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/rota|entrega|logística|veículo/i);
  });

  test('Contratos — Atas vigentes', async ({ page }) => {
    await navigateTo(page, 'contratos');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/contrato|ata|vigente|valor/i);
  });

  test('Entregas — Histórico de entregas', async ({ page }) => {
    await navigateTo(page, 'entregas');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/entrega|nota|escola/i);
  });

  test('Relatórios — Relatórios operacionais', async ({ page }) => {
    await navigateTo(page, 'relatorios');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/relatório|exportar|gerar/i);
  });

  test('Indicadores — Performance da cooperativa', async ({ page }) => {
    await navigateTo(page, 'indicadores');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/indicador|performance|meta|eficiência/i);
  });

  test('Navegação completa sem erro', async ({ page }) => {
    const pages = ['dashboard', 'agricultores', 'produtos', 'estoque', 'pedidos',
                   'planejamento', 'rotas', 'contratos', 'entregas', 'relatorios', 'indicadores'];
    for (const p of pages) {
      await navigateTo(page, p);
      const content = await page.locator('#page-content').textContent();
      expect(content.length).toBeGreaterThan(50);
    }
  });
});
