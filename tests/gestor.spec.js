// =============================================
// SUALE — Teste: Perfil Gestor SEMED (10 telas)
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
    const svg = page.locator('svg, .map-svg, .map-container, .card');
    expect(await svg.count()).toBeGreaterThanOrEqual(1);
  });

  test('Escolas — Tabela com dados', async ({ page }) => {
    await navigateTo(page, 'escolas');
    const rows = page.locator('table tbody tr, .table-row');
    expect(await rows.count()).toBeGreaterThanOrEqual(5);
  });

  test('Atas e Contratos — Lista de contratos e cadastro de ATA com produtos', async ({ page }) => {
    await navigateTo(page, 'atas');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/ATA|Contrato|Vigente/i);

    // Abrir modal de nova ATA
    await page.click('button:has-text("Cadastrar Nova ATA")');
    await expect(page.locator('#ata-numero')).toBeVisible();

    await page.fill('#ata-numero', 'ATA-2026/TESTE99');
    await page.fill('#ata-fornecedor', 'FORNECEDOR TESTE LTDA');
    
    // Preencher produto na ATA
    await page.fill('.ata-prod-nome', 'Leite Integral 1L');
    await page.fill('.ata-prod-unidade', 'L');
    await page.fill('.ata-prod-preco', '4.50');
    await page.fill('.ata-prod-qtd', '1000');

    await page.click('button:has-text("Salvar e Cadastrar ATA")');
    await page.waitForTimeout(500);

    // Verificar se a nova ATA aparece na tabela
    const newContent = await page.locator('#page-content').textContent();
    expect(newContent).toContain('ATA-2026/TESTE99');

    // Testar botão Emitir Empenho nesta ATA
    await page.click('tr:has-text("ATA-2026/TESTE99") button:has-text("Gerenciar")');
    await page.waitForTimeout(500);

    await expect(page.locator('button:has-text("Emitir Empenho nesta ATA")')).toBeVisible();
    await page.click('button:has-text("Emitir Empenho nesta ATA")');
    await expect(page.locator('#emp-numero')).toBeVisible();
    await page.fill('#emp-valor', '1000');
    await page.click('button:has-text("Emitir e Confirmar Empenho")');
    await expect(page.locator('#global-modal-content')).toBeVisible();
    const modalText = await page.locator('#global-modal-content').textContent();
    expect(modalText).toContain('Empenhos SIAFI Vinculados nesta ATA');
    expect(modalText).toMatch(/1\.000,00/);
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
