// =============================================
// SUALE — Teste: Perfil Nutricionista (10 telas)
// =============================================
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('./helpers');

test.describe('Nutricionista SEMED', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, 'nutricionista');
  });

  test('Dashboard Nutricional — KPIs visíveis', async ({ page }) => {
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/Dashboard|Nutricional/i);
    const kpis = page.locator('.kpi-card');
    expect(await kpis.count()).toBeGreaterThanOrEqual(3);
  });

  test('Fichas Técnicas — Busca e visualização', async ({ page }) => {
    await navigateTo(page, 'fichas');
    const content = await page.locator('#page-content').textContent();
    expect(content.length).toBeGreaterThan(50);
  });

  test('Produtos — Tabela nutricional', async ({ page }) => {
    await navigateTo(page, 'produtos');
    const content = await page.locator('#page-content').textContent();
    expect(content.length).toBeGreaterThan(50);
  });

  test('Cardápios — Planejamento semanal interativo', async ({ page }) => {
    await navigateTo(page, 'cardapios');
    const content = await page.locator('#page-content').textContent();
    expect(content.length).toBeGreaterThan(50);
  });

  test('Planejamento — Visão de planejamento', async ({ page }) => {
    await navigateTo(page, 'planejamento');
    const content = await page.locator('#page-content').textContent();
    expect(content.length).toBeGreaterThan(50);
  });

  test('Escolas — Status nutricional por escola', async ({ page }) => {
    await navigateTo(page, 'escolas');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/escola|EM |aluno/i);
  });

  test('Consumo — Dados de consumo', async ({ page }) => {
    await navigateTo(page, 'consumo');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/consumo|refeição|porção/i);
  });

  test('Desperdícios — Lançamento e recálculo', async ({ page }) => {
    await navigateTo(page, 'desperdicios');
    await expect(page.locator('#waste-amount')).toBeVisible();
    
    await page.fill('#waste-amount', '20');
    
    // Mock dialog handler
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('registrado com sucesso');
      await dialog.accept();
    });
    
    await page.click('#btn-submit-waste');
    
    // Check updated totals
    const totalKg = await page.locator('#waste-total-kg').textContent();
    expect(totalKg).toBe('1.613');
  });

  test('Cardápios — Dimensionamento de Estoque/Compras e Emissão de OS ao Publicar', async ({ page }) => {
    await navigateTo(page, 'cardapios');
    
    // Verifica presença do botão Suprimentos em algum cardápio
    const btnSuprimentos = page.locator('button:has-text("📦 Suprimentos")').first();
    await expect(btnSuprimentos).toBeVisible();

    // Clica no botão Suprimentos e valida a abertura do modal de dimensionamento
    await btnSuprimentos.click();
    const modal = page.locator('#modal-dimensionamento-cardapio');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('Dimensionamento & Suprimentos');
    await expect(modal).toContainText('Insumos da Ficha Técnica');
    await expect(modal).toContainText('Estoque CD');

    // Fecha o modal pelo botão Cancelar
    await modal.locator('button:has-text("Cancelar")').click();
    await expect(modal).not.toBeVisible();

    // Se houver botão Publicar em cardápio em elaboração, testa o fluxo completo de publicação e disparo de OS
    const btnPublicar = page.locator('button:has-text("🚀 Publicar")').first();
    if (await btnPublicar.isVisible()) {
      await btnPublicar.click();
      await expect(modal).toBeVisible();

      // Confirma a publicação no modal
      const btnConfirmar = page.locator('#btn-confirmar-publicacao-cardapio');
      await expect(btnConfirmar).toBeVisible();
      await btnConfirmar.click();

      // Modal deve se fechar e lista de cardápios deve recarregar
      await expect(modal).not.toBeVisible();

      // Checa se no SharedState ou na tela uma OS de Compra foi emitida
      const osCount = await page.evaluate(() => {
        return window.SharedState && window.SharedState.comprasOsCompra ? window.SharedState.comprasOsCompra().length : 0;
      });
      expect(osCount).toBeGreaterThanOrEqual(1);
    }
  });

  test('Navegação completa sem erro', async ({ page }) => {
    const pages = ['dashboard', 'fichas', 'produtos', 'cardapios', 'planejamento', 'estoquesual', 'guiasentrega',
                   'escolas', 'consumo', 'desperdicios', 'restricoes', 'relatorios'];
    for (const p of pages) {
      await navigateTo(page, p);
      const content = await page.locator('#page-content').textContent();
      expect(content.length).toBeGreaterThan(20);
    }
  });
});

