// =============================================
// SAGED — Testes do Almoxarifado Central
// =============================================
const { test, expect } = require('@playwright/test');
const { login, navigateTo, getPageContent } = require('./helpers');

test.describe('Módulo de Almoxarifado Central', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, 'almoxarifado');
  });

  test('Dashboard operacional exibe indicadores principais', async ({ page }) => {
    await expect(page.locator('.page-title')).toContainText('Dashboard Operacional');
    await expect(page.locator('#picking-pending-count')).toHaveText('2');
    await expect(page.locator('#chart-almox-expedicao')).toBeVisible();
  });

  test('Fluxo de separação de pedidos com lote e validade', async ({ page }) => {
    await navigateTo(page, 'separacao');
    await expect(page.locator('.page-title')).toContainText('Separação de Pedidos');
    
    // Iniciar separação do pedido 304
    await page.click('text=Iniciar Separação');
    await expect(page.locator('.card-title')).toContainText('Separando Itens: Pedido #304');
    
    // Tentar concluir sem marcar itens (deve disparar erro/alerta)
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('confira e selecione todos os itens');
      await dialog.accept();
    });
    await page.click('text=Concluir Separação');

    // Marcar itens e concluir
    await page.check('#chk-item-1');
    await page.check('#chk-item-2');
    
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('concluída com sucesso');
      await dialog.accept();
    });
    await page.click('text=Concluir Separação');
    
    // Deve retornar para a lista de separação
    await expect(page.locator('.page-title')).toContainText('Separação de Pedidos');
  });

  test('Carregamento de veículos e atribuição de rotas', async ({ page }) => {
    await navigateTo(page, 'carregamento');
    await expect(page.locator('.page-title')).toContainText('Carregamento e Expedição');
    
    // Simular atribuição de veículo
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('expedida com sucesso');
      await dialog.accept();
    });
    await page.click('text=Expedir Carga');
  });

  test('Consulta de estoque por lote e validade', async ({ page }) => {
    await navigateTo(page, 'estoque');
    await expect(page.locator('.page-title')).toContainText('Estoque Central');
    const tableText = await getPageContent(page);
    expect(tableText).toContain('L-ARR-092');
    expect(tableText).toContain('Validade Curta');
  });
});
