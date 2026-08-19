// =============================================
// SUALE — Smoke Test de Renderizadores
// =============================================
// Percorre TODOS os itens de menu de TODOS os perfis, renderiza cada tela no
// container real (#page-content) e falha se houver exceção ou tela vazia.
//
// Por que este arquivo existe:
// A suíte por perfil cobre fluxos específicos, mas não garante que as ~101 telas
// registradas em PAGE_RENDERERS simplesmente renderizam. Foi um teste ad-hoc
// nesta forma que, na auditoria de 2026-08-18, encontrou o mapa do dashboard do
// Gestor quebrado (escola com region 'Rural' fora das 7 regiões fixas do
// renderMap fazia `reg.cx` estourar e derrubar o mapa inteiro) e validou a
// remoção de ~1.000 linhas do app.js sem regressão.
//
// É a rede de segurança exigida pela Fase 6 do PLANO_MODULARIZACAO_APP.md:
// enquanto o app.js for desmontado módulo a módulo, este teste é o que detecta
// uma tela que perdeu o dono.
//
// Contrato verificado: PAGE_RENDERERS[chave](container) — nunca retorno de
// string (ver Seção 4.3 do plano).

const { test, expect } = require('@playwright/test');

test.describe('Smoke — todos os renderizadores de tela', () => {
  test('Toda tela de menu de todo perfil renderiza sem erro', async ({ page }) => {
    const erros = [];
    page.on('pageerror', (e) => erros.push(`[pageerror] ${e.message}`));

    await page.goto('/index.html');
    await page.waitForSelector('#screen-login', { state: 'visible' });

    // Entra no app para que #page-content exista e o estado esteja inicializado.
    await page.click('[data-profile="gestor"]');
    await page.click('#btn-login');
    await page.waitForSelector('#screen-app', { state: 'visible' });

    const resultado = await page.evaluate(() => {
      const flat = (menu) => (menu || []).flatMap(i => i.type === 'group' ? (i.children || []) : [i]);
      const el = document.getElementById('page-content');
      const falhas = [], vazias = [];
      let total = 0;

      // Algumas telas de escola dependem de uma unidade selecionada.
      if (!window.state.selectedSchoolId) {
        const escolas = window._PILOT_SCHOOLS || (window.DATA && window.DATA.schools) || [];
        if (escolas.length) {
          window.state.selectedSchoolId = escolas[0].id;
          window.state.selectedSchool = escolas[0];
        }
      }

      const perfilOriginal = window.state.currentProfile;
      const telaOriginal = window.state.currentPage;

      Object.keys(window.PROFILES).forEach(perfil => {
        flat(window.PROFILES[perfil].menu).forEach(item => {
          if (!item.id) return;
          total++;
          const chave = `${perfil}_${item.id}`;
          const fn = window.PAGE_RENDERERS[chave];

          if (typeof fn !== 'function') {
            falhas.push({ chave, erro: 'CHAVE AUSENTE em PAGE_RENDERERS' });
            return;
          }

          el.innerHTML = '';
          window.state.currentProfile = perfil;
          window.state.currentPage = item.id;

          try {
            fn(el); // contrato: renderer(container)
            if (el.innerHTML.trim().length < 30) vazias.push(chave);
          } catch (e) {
            falhas.push({ chave, erro: e.message });
          }
        });
      });

      window.state.currentProfile = perfilOriginal;
      window.state.currentPage = telaOriginal;
      if (typeof window.destroyCharts === 'function') window.destroyCharts();

      return { total, falhas, vazias, totalChaves: Object.keys(window.PAGE_RENDERERS).length };
    });

    console.log(`[smoke] ${resultado.total} telas de menu · ${resultado.totalChaves} chaves registradas`);

    // Sanidade: se o app não carregou direito, não deixa o teste passar vazio.
    expect(resultado.total, 'nenhuma tela de menu encontrada — PROFILES não carregou?').toBeGreaterThan(50);

    const detalhe = (lista) => lista.map(f => `  - ${f.chave}: ${f.erro}`).join('\n');
    expect(resultado.falhas, `Telas que lançaram erro ou não têm renderer:\n${detalhe(resultado.falhas)}`).toEqual([]);
    expect(resultado.vazias, `Telas que renderizaram vazias:\n  ${resultado.vazias.join('\n  ')}`).toEqual([]);
  });

  test('Nenhum erro nao tratado no console durante a carga inicial', async ({ page }) => {
    const erros = [];
    page.on('pageerror', (e) => erros.push(e.message));

    await page.goto('/index.html');
    await page.waitForSelector('#screen-login', { state: 'visible' });
    await page.click('[data-profile="gestor"]');
    await page.click('#btn-login');
    await page.waitForSelector('#screen-app', { state: 'visible' });
    await page.waitForTimeout(1200); // deixa os setTimeout de charts/mapa rodarem

    expect(erros, `Erros nao tratados no console:\n  ${erros.join('\n  ')}`).toEqual([]);
  });
});
