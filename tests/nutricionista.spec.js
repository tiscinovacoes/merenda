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

  test('Fichas Técnicas — Busca e criação de ficha', async ({ page }) => {
    await navigateTo(page, 'fichas');
    // Check search input
    await expect(page.locator('#search-fichas')).toBeVisible();
    await page.fill('#search-fichas', 'arroz');
    // Only Arroz card should be visible
    await expect(page.locator('.ficha-card').first()).toBeVisible();
    await expect(page.locator('.ficha-card').filter({ hasText: 'Vitamina de banana' })).not.toBeVisible();
    
    // Clear search
    await page.fill('#search-fichas', '');
    
    // Open new recipe form
    await page.click('button:has-text("Nova Ficha Técnica")');
    await expect(page.locator('#ficha-name')).toBeVisible();
    await page.fill('#ficha-name', 'Sopa de Ervilha');
    await page.fill('#ficha-ing-name', 'Ervilha Crua');
    await page.fill('#ficha-ing-bruto', '50');
    await page.fill('#ficha-ing-liquido', '45');
    await page.fill('#ficha-ing-cost-unit', '12.00');
    await page.fill('#ficha-kcal', '310');
    await page.click('#form-create-ficha button[type="submit"]');
    
    // Form should return to list
    await expect(page.locator('button:has-text("Nova Ficha Técnica")')).toBeVisible();
  });

  test('Produtos — Tabela nutricional', async ({ page }) => {
    await navigateTo(page, 'produtos');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/produto|kcal|proteína|nutricional/i);
  });

  test('Cardápios — Planejamento semanal interativo', async ({ page }) => {
    await navigateTo(page, 'cardapios');
    await page.click('button:has-text("Abrir Planejador Semanal")');
    
    // Select different options
    await page.selectOption('#planner-mon-breakfast', '210'); // Vitamina de banana
    
    // Kcal should update
    const totalKcal = await page.locator('#planner-total-kcal').textContent();
    expect(totalKcal).not.toBeNull();
    
    await page.click('button:has-text("Publicar Cardápio Semanal")');
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

  test('Simulações — Cenários nutricionais e enquadramento PNAE', async ({ page }) => {
    await navigateTo(page, 'simulacoes');
    await expect(page.locator('#sim-kcal')).toBeVisible();
    
    // Select modalidade preset
    await page.selectOption('#sim-preset-modalidade', 'fund_6_10_20');
    
    // Type parameters matching the fund_6_10_20 DRI energy (492.9 kcal target)
    await page.fill('#sim-kcal', '480');
    await page.fill('#sim-carbs-g', '70');
    await page.fill('#sim-proteins-g', '12');
    await page.fill('#sim-lipids-g', '16');
    await page.fill('#sim-sodium', '320');
    
    await page.click('#btn-run-simulation');
    
    // Check approval status
    const bannerText = await page.locator('#sim-status-banner').textContent();
    expect(bannerText).toContain('Aprovado');
  });

  test('IA — Sugestões e aplicação no cardápio', async ({ page }) => {
    await navigateTo(page, 'ia');
    await expect(page.locator('#btn-ia-apply-crop')).toBeVisible();
    await page.click('#btn-ia-apply-crop');
    
    // Button text should change to Applied
    const btnText = await page.locator('#btn-ia-apply-crop').textContent();
    expect(btnText).toBe('Aplicado');
  });

  test('Estoque SUAL Consolidado — Modo Leitura Read-Only', async ({ page }) => {
    await navigateTo(page, 'estoquesual');
    const content = await page.locator('#page-content').textContent();
    expect(content.length).toBeGreaterThan(20);
  });

  test('Guias de Entrega & Distribuição Parcelada — Emissão e Troca Sazonal', async ({ page }) => {
    await navigateTo(page, 'guiasentrega');
    const content = await page.locator('#page-content').textContent();
    expect(content.length).toBeGreaterThan(20);
  });

  test('Navegação completa sem erro', async ({ page }) => {
    const pages = ['dashboard', 'fichas', 'produtos', 'cardapios', 'planejamento', 'estoquesual', 'guiasentrega',
                   'escolas', 'consumo', 'desperdicios', 'restricoes', 'simulacoes', 'ia'];
    for (const p of pages) {
      await navigateTo(page, p);
      const content = await page.locator('#page-content').textContent();
      expect(content.length).toBeGreaterThan(20);
    }
  });
});
