// =============================================
// SAGED — Teste: Perfil Gestor SEMED (10 telas)
// =============================================
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('./helpers');

test.describe('Gestor SEMED', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, 'gestor');
  });

  test('Dashboard Executivo — KPIs visíveis', async ({ page }) => {
    const content = await page.locator('#page-content').textContent();
    expect(content).toContain('Dashboard Executivo');
    
    // KPI cards devem estar visíveis
    const kpis = page.locator('.kpi-card');
    expect(await kpis.count()).toBeGreaterThanOrEqual(4);
  });

  test('Dashboard Executivo — Fluxo Principal visível', async ({ page }) => {
    const flow = page.locator('.flow-diagram, .flow-container, .flowchart');
    expect(await flow.count()).toBeGreaterThanOrEqual(1);
  });

  test('Dashboard Executivo — Gráficos renderizados', async ({ page }) => {
    await page.waitForTimeout(1000); // Aguarda Chart.js renderizar
    const canvases = page.locator('canvas');
    expect(await canvases.count()).toBeGreaterThanOrEqual(2);
  });

  test('Dashboard Executivo — Mapa SVG visível', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const svg = page.locator('svg.map-svg, .map-container svg, .map-section svg');
    expect(await svg.count()).toBeGreaterThanOrEqual(1);
  });

  test('Escolas — Tabela com dados', async ({ page }) => {
    await navigateTo(page, 'escolas');
    const rows = page.locator('table tbody tr, .table-row');
    expect(await rows.count()).toBeGreaterThanOrEqual(5);
  });

  test('Atas e Contratos — Lista de contratos', async ({ page }) => {
    await navigateTo(page, 'atas');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/ATA|Contrato|Vigente/i);
  });

  test('Pedidos — Tabela de pedidos', async ({ page }) => {
    await navigateTo(page, 'pedidos');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/Pendente|Em separação|Entregue|Em transporte/i);
  });

  test('Cooperativas — Lista de cooperativas', async ({ page }) => {
    await navigateTo(page, 'cooperativas');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/COOPAGRAN|COOPRAN|COOPAERGS|COOPASUL|COOPERVIDA/i);
  });

  test('Agricultura Familiar — Lista de agricultores', async ({ page }) => {
    await navigateTo(page, 'agricultura');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/agricultor|DAP|produção/i);
  });

  test('Estoque Consolidado — Tabela de produtos', async ({ page }) => {
    await navigateTo(page, 'estoque');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/Arroz|Feijão|Leite|estoque/i);
  });

  test('Planejamento Alimentar — Calendário', async ({ page }) => {
    await navigateTo(page, 'planejamento');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/planejamento|semana|calendário/i);
  });

  test('Relatórios — Opções de relatório', async ({ page }) => {
    await navigateTo(page, 'relatorios');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/relatório|exportar|gerar/i);
  });

  test('IA de Previsão — Dashboard preditivo', async ({ page }) => {
    await navigateTo(page, 'ia');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/previsão|demanda|IA|inteligência/i);
  });

  test('IA de Previsão — Simulador de Cenários', async ({ page }) => {
    await navigateTo(page, 'ia');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    const sliders = page.locator('input[type="range"]');
    expect(await sliders.count()).toBeGreaterThanOrEqual(1);
  });

  test('Navegação completa por todas as telas sem erro', async ({ page }) => {
    const pages = ['dashboard', 'escolas', 'atas', 'pedidos', 'cooperativas', 
                   'agricultura', 'estoque', 'planejamento', 'relatorios', 'ia'];
    
    for (const p of pages) {
      await navigateTo(page, p);
      // Verifica que o conteúdo principal foi renderizado
      const content = await page.locator('#page-content').textContent();
      expect(content.length).toBeGreaterThan(50);
    }
  });
});
