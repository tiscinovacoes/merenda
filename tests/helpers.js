// =============================================
// SUALE Test Helpers
// Funções reutilizáveis para todos os testes
// =============================================

/**
 * Login no sistema com o perfil especificado
 * @param {import('@playwright/test').Page} page
 * @param {'gestor'|'nutricionista'|'escola'|'cooperativa'|'agricultor'} profile
 */
async function login(page, profile) {
  let p = profile === 'almoxarifado' ? 'estoque' : profile;
  await page.goto('/index.html');
  await page.waitForSelector('#screen-login', { state: 'visible' });

  if (p === 'cooperativa' || p === 'agricultor') {
    const colabBtn = page.locator('[data-profile="colaboradores"]');
    if (await colabBtn.isVisible()) {
      await colabBtn.click();
      const subBtn = page.locator(`[data-subrole="${p}"]`);
      if (await subBtn.isVisible()) {
        await subBtn.click();
      }
    } else {
      await page.click(`[data-profile="${p}"]`);
    }
  } else if (['diretor', 'merendeira', 'resp_estoque'].includes(p)) {
    const escolaBtn = page.locator('[data-profile="escola"]');
    if (await escolaBtn.isVisible()) {
      await escolaBtn.click();
      const subBtn = page.locator(`[data-subrole="${p}"]`);
      if (await subBtn.isVisible()) {
        await subBtn.click();
      }
    } else {
      await page.click(`[data-profile="${p}"]`);
    }
  } else {
    const btn = page.locator(`[data-profile="${p}"]`);
    if (await btn.isVisible()) {
      await btn.click();
    }
  }

  await page.click('#btn-login');
  await page.waitForSelector('#screen-app', { state: 'visible' });
  await page.waitForSelector('.page-title', { state: 'visible', timeout: 5000 }).catch(() => {});
}

/**
 * Logout do sistema
 * @param {import('@playwright/test').Page} page
 */
async function logout(page) {
  await page.click('#btn-logout');
  await page.waitForSelector('#screen-login', { state: 'visible' });
}

/**
 * Navegar para uma tela via sidebar
 * @param {import('@playwright/test').Page} page
 * @param {string} menuId - ID do menu item (ex: 'dashboard', 'escolas')
 */
async function navigateTo(page, menuId) {
  const item = page.locator(`[data-page="${menuId}"]`);
  if (await item.count() > 0) {
    if (!(await item.isVisible())) {
      const parentGroup = page.locator('.sidebar-group-toggle').first();
      if (await parentGroup.isVisible()) {
        await parentGroup.click().catch(() => {});
      }
    }
    await item.click();
  } else {
    // Fallback: navegação direta via JS se o item não estiver no menu do perfil
    await page.evaluate((p) => { if (typeof window.navigateTo === 'function') window.navigateTo(null, p); }, menuId);
  }
  await page.waitForSelector('.page-title', { state: 'visible', timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);
}

/**
 * Retorna o texto do conteúdo principal
 * @param {import('@playwright/test').Page} page
 */
async function getPageContent(page) {
  return await page.locator('#page-content').textContent();
}

module.exports = {
  login,
  logout,
  navigateTo,
  getPageContent,
};
