// =============================================
// SUALE — Testes do Motorista de Entrega
// =============================================
const { test, expect } = require('@playwright/test');
const { login, navigateTo, getPageContent } = require('./helpers');

test.describe('Módulo do Motorista de Entrega', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, 'motorista');
  });

  test('Visualização da rota diária e sequências de parada', async ({ page }) => {
    await expect(page.locator('.page-title')).toContainText('Minha Rota Diária');
    await expect(page.locator('#driver-pending-count')).toBeVisible();
    const pageText = await getPageContent(page);
    expect(pageText).toMatch(/EM PROF|EMTI PROF|EM ADV|SEMED/i);
  });

  test('Fluxo completo de confirmação de entrega com assinatura e foto', async ({ page }) => {
    await navigateTo(page, 'entregas');
    await expect(page.locator('.card-title')).toContainText('Confirmar Recibo de Alimentos');
    
    // Preencher campos do recibo
    await page.fill('#delivery-receiver', 'Ana Paula da Silva');
    await page.fill('#delivery-doc', '90210-X');
    
    // Simular clique na câmera (gerará foto mockada)
    await page.click('#delivery-camera-preview');
    await expect(page.locator('#delivery-camera-img')).toBeVisible();
    
    // Simular desenho na assinatura
    const sigPad = page.locator('#delivery-sig-canvas');
    const box = await sigPad.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 10, box.y + 10);
      await page.mouse.down();
      await page.mouse.move(box.x + 100, box.y + 50);
      await page.mouse.up();
    }
    
    // Submeter formulário
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('Entrega confirmada com sucesso');
      await dialog.accept();
    });
    await page.click('#form-driver-delivery button[type="submit"]');
    
    // Deve retornar para o Dashboard com a entrega atualizada
    await expect(page.locator('.page-title')).toContainText('Minha Rota Diária');
  });

  test('Registro de ocorrência na rota', async ({ page }) => {
    await navigateTo(page, 'ocorrencias');
    await expect(page.locator('.page-title')).toContainText('Registrar Ocorrência');
    
    // Preencher formulário
    await page.selectOption('#incident-school', 'EM Elpídio Reis');
    await page.selectOption('#incident-type', 'Escola fechada');
    await page.fill('#incident-desc', 'A escola se encontrava trancada no momento da entrega programada.');
    
    // Submeter
    page.once('dialog', async dialog => {
      expect(dialog.message()).toContain('enviada com sucesso');
      await dialog.accept();
    });
    await page.click('#form-driver-incident button[type="submit"]');
    
    // Deve retornar para a rota diária
    await expect(page.locator('.page-title')).toContainText('Minha Rota Diária');
  });

  test('Histórico de viagens realizadas', async ({ page }) => {
    await navigateTo(page, 'historico');
    await expect(page.locator('.page-title')).toContainText('Histórico de Viagens');
    const tableText = await getPageContent(page);
    expect(tableText).toMatch(/Histórico|Entregas|Confirmada|Concluído/i);
  });
});
