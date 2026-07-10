// =============================================
// SAGED — Captura automática de todas as telas
// Gera screenshots para Figma em ./screenshots/
// Execute: npm run test:screenshots
// =============================================
const { test } = require('@playwright/test');
const { login, navigateTo, logout } = require('./helpers');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'screenshots');

const PROFILES = {
  gestor: {
    pages: ['dashboard', 'escolas', 'atas', 'pedidos', 'cooperativas',
            'agricultura', 'estoque', 'planejamento', 'relatorios', 'ia'],
  },
  nutricionista: {
    pages: ['dashboard', 'fichas', 'produtos', 'cardapios', 'planejamento',
            'escolas', 'consumo', 'desperdicios', 'simulacoes', 'ia'],
  },
  escola: {
    pages: ['dashboard', 'planejamento', 'cardapios', 'estoque', 'consumo',
            'pedidos', 'entregas', 'historico', 'relatorios'],
  },
  cooperativa: {
    pages: ['dashboard', 'agricultores', 'produtos', 'estoque', 'pedidos',
            'planejamento', 'rotas', 'contratos', 'entregas', 'relatorios', 'indicadores'],
  },
  agricultor: {
    pages: ['dashboard', 'producao', 'estoque', 'pedidos', 'entregas',
            'calendario', 'relatorios', 'perfil'],
  },
  almoxarifado: {
    pages: ['dashboard', 'separacao', 'carregamento', 'estoque'],
  },
  motorista: {
    pages: ['dashboard', 'entregas', 'ocorrencias', 'historico'],
  },
};

test.describe('Captura de Screenshots para Figma', () => {

  test('Capturar tela de Login', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '00_login.png'),
      fullPage: true,
    });
  });

  for (const [profileId, config] of Object.entries(PROFILES)) {
    test(`Capturar todas as telas: ${profileId}`, async ({ page }) => {
      await login(page, profileId);

      for (let i = 0; i < config.pages.length; i++) {
        const pageId = config.pages[i];
        await navigateTo(page, pageId);
        await page.waitForTimeout(800); // Aguarda gráficos renderizarem

        const filename = `${profileId}_${String(i + 1).padStart(2, '0')}_${pageId}.png`;
        await page.screenshot({
          path: path.join(OUTPUT_DIR, filename),
          fullPage: true,
        });
      }

      await logout(page);
    });
  }
});
