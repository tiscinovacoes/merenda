// =============================================
// SUALE Smoke Test — itera TODAS as chaves de PAGE_RENDERERS
// Objetivo: pegar renderers que quebram (assinatura incompatível,
// helper faltando, DATA ausente) que os specs por perfil não cobrem.
// Fase 6 do PLANO_MODULARIZACAO_APP.md.
// =============================================
const { test, expect } = require('@playwright/test');
const { login } = require('./helpers');

test('todas as telas de PAGE_RENDERERS renderizam sem exceção', async ({ page }) => {
  const consoleErrors = [];
  page.on('pageerror', (err) => consoleErrors.push(String(err)));

  // Qualquer perfil basta: todos os módulos + app.js registram no mesmo global.
  await login(page, 'gestor');

  const result = await page.evaluate(() => {
    const keys = Object.keys(window.PAGE_RENDERERS || {}).sort();
    const failures = [];
    const container = document.createElement('div');
    container.id = 'smoke-container';
    document.body.appendChild(container);
    for (const key of keys) {
      try {
        container.innerHTML = '';
        const fn = window.PAGE_RENDERERS[key];
        if (typeof fn !== 'function') {
          failures.push({ key, error: 'não é função: ' + typeof fn });
          continue;
        }
        fn(container);
      } catch (e) {
        failures.push({ key, error: String(e && e.message || e) });
      }
    }
    container.remove();
    return { total: keys.length, keys, failures };
  });

  console.log(`\n[SMOKE] ${result.total} telas testadas; ${result.failures.length} falhas.`);
  if (result.failures.length) {
    for (const f of result.failures) console.log(`  ✗ ${f.key}: ${f.error}`);
  }
  if (consoleErrors.length) {
    console.log('[SMOKE] pageerror capturados:');
    for (const e of consoleErrors) console.log('  ! ' + e);
  }

  expect(result.failures, JSON.stringify(result.failures, null, 2)).toEqual([]);
});
