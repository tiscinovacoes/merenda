// =============================================
// SUALE — Teste: Perfil Cooperativa (Operacional Simplificado)
// =============================================
const { test, expect } = require('@playwright/test');
const { login, navigateTo } = require('./helpers');

test.describe('Cooperativa (Operacional Simplificado)', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, 'cooperativa');
  });

  test('Painel Geral — KPIs operacionais visíveis', async ({ page }) => {
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/Painel|Dashboard|Cooperativa|COOPAGRAN/i);
    const kpis = page.locator('.kpi-card');
    expect(await kpis.count()).toBeGreaterThanOrEqual(4);
  });

  test('Ordens de Serviço — Fila de O.S. e ações operacionais', async ({ page }) => {
    await navigateTo(page, 'pedidos');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/Ordem|Serviço|Fornecimento|Escola|Status/i);

    // Modal de detalhes da O.S.
    const btnDetalhes = page.locator('button:has-text("👁️ Detalhes")').first();
    if (await btnDetalhes.isVisible()) {
      await btnDetalhes.click();
      const modal = page.locator('#modal-detalhes-ordem-colab');
      await expect(modal).toBeVisible();
      await expect(modal).toContainText('Ordem de Fornecimento');
      await modal.locator('button:has-text("Fechar")').click();
      await expect(modal).not.toBeVisible();
    }
  });

  test('Cronograma de Entregas — Programação para escolas', async ({ page }) => {
    await navigateTo(page, 'entregas');
    const content = await page.locator('#page-content').textContent();
    expect(content).toMatch(/Cronograma|Entregas|Escola|Data|Status/i);
  });

  test('Navegação das rotas simplificadas e compatibilidade', async ({ page }) => {
    const pages = ['dashboard', 'pedidos', 'entregas'];
    for (const p of pages) {
      await navigateTo(page, p);
      const content = await page.locator('#page-content').textContent();
      expect(content.length).toBeGreaterThan(50);
    }
  });
});
