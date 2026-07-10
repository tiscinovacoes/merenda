// =============================================
// SAGED Test Helpers
// Funções reutilizáveis para todos os testes
// =============================================

/**
 * Login no sistema com o perfil especificado
 * @param {import('@playwright/test').Page} page
 * @param {'gestor'|'nutricionista'|'escola'|'cooperativa'|'agricultor'} profile
 */
async function login(page, profile) {
  await page.goto('/index.html');
  await page.waitForSelector('#screen-login', { state: 'visible' });
  await page.click(`[data-profile="${profile}"]`);
  await page.click('#btn-login');
  await page.waitForSelector('#screen-app', { state: 'visible' });
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
  await page.click(`[data-page="${menuId}"]`);
  await page.waitForTimeout(600);
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
