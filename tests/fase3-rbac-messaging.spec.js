// ==============================================================================
// SUALE — Testes Unitários e E2E da Fase 3: RBAC & Mensageria WhatsApp
// ==============================================================================
const { test, expect } = require('@playwright/test');

test.describe('Fase 3: RBAC & Mensageria WhatsApp (Evolution API)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(500);
  });

  test('Módulo SUALE_RBAC está carregado e exposto globalmente', async ({ page }) => {
    const rbacExists = await page.evaluate(() => typeof window.SUALE_RBAC === 'object');
    expect(rbacExists).toBe(true);

    const canExists = await page.evaluate(() => typeof window.can === 'function');
    expect(canExists).toBe(true);
  });

  test('Matriz RBAC respeita o princípio de menor privilégio (Least Privilege)', async ({ page }) => {
    const checks = await page.evaluate(() => {
      const rbac = window.SUALE_RBAC;
      return {
        // Gestor pode aprovar atas e ler relatórios
        gestorApproveAta: rbac.can('gestor', 'approve', 'atas'),
        gestorReadDashboard: rbac.can('gestor', 'read', 'dashboard'),
        
        // Nutricionista pode criar cardápios, mas NÃO pode aprovar empenhos
        nutriCreateCardapio: rbac.can('nutricionista', 'create', 'cardapios'),
        nutriApproveEmpenho: rbac.can('nutricionista', 'approve', 'empenhos'),

        // Motorista pode reportar ocorrência, mas NÃO pode criar cardápio
        motoristaCreateOcorrencia: rbac.can('motorista', 'create', 'ocorrencias'),
        motoristaCreateCardapio: rbac.can('motorista', 'create', 'cardapios'),

        // Escola pode confirmar recebimento de entrega, mas NÃO pode editar atas
        escolaUpdateEntrega: rbac.can('escola', 'update', 'entregas'),
        escolaUpdateAta: rbac.can('escola', 'update', 'atas'),
      };
    });

    expect(checks.gestorApproveAta).toBe(true);
    expect(checks.gestorReadDashboard).toBe(true);
    expect(checks.nutriCreateCardapio).toBe(true);
    expect(checks.nutriApproveEmpenho).toBe(false);
    expect(checks.motoristaCreateOcorrencia).toBe(true);
    expect(checks.motoristaCreateCardapio).toBe(false);
    expect(checks.escolaUpdateEntrega).toBe(true);
    expect(checks.escolaUpdateAta).toBe(false);
  });

  test('SUALE_RBAC.getAllowedPages retorna o conjunto correto de páginas por perfil', async ({ page }) => {
    const pages = await page.evaluate(() => {
      const rbac = window.SUALE_RBAC;
      return {
        motorista: rbac.getAllowedPages('motorista'),
        escola: rbac.getAllowedPages('escola'),
        gestor: rbac.getAllowedPages('gestor'),
      };
    });

    expect(pages.motorista).toEqual(['dashboard', 'entregas', 'ocorrencias', 'historico']);
    expect(pages.escola).toContain('cardapios');
    expect(pages.escola).toContain('estoque');
    expect(pages.gestor).toContain('atas');
    expect(pages.gestor).toContain('ia');
  });

  test('Módulo SUALE_MESSAGING formata telefone e opera em Modo Sandbox sem erro', async ({ page }) => {
    const messagingResult = await page.evaluate(async () => {
      const msg = window.SUALE_MESSAGING;
      const formatted = msg.formatCleanPhone('(67) 99988-7766');

      // Envia notificação em modo sandbox
      const resDelivery = await msg.notifySchoolDelivery(
        'EM ADV. DEMOSTHENES MARTINS',
        'Carlos Silva',
        'PED-2026-089',
        formatted
      );

      const resIncident = await msg.notifyDriverIncident(
        'Carlos Silva',
        'Rota 01 - Segredo',
        'Atraso por chuva torrencial',
        formatted
      );

      return {
        formattedPhone: formatted,
        deliveryMode: resDelivery.mode,
        deliverySuccess: resDelivery.success,
        incidentSuccess: resIncident.success,
      };
    });

    expect(messagingResult.formattedPhone).toBe('5567999887766');
    expect(messagingResult.deliverySuccess).toBe(true);
    expect(messagingResult.deliveryMode).toBe('sandbox');
    expect(messagingResult.incidentSuccess).toBe(true);
  });
});
