/* ============================================
   SUALE — HUB CENTRAL (core_hub.js)
   Sistema de Gestão da Alimentação Escolar
   SEMED · Campo Grande · MS
   ============================================ */

// VERSÃO
var APP_VERSION = '3.0.0-hub';
var APP_BUILD_DATE = '2026-08-18';
window.APP_VERSION = APP_VERSION;
window.APP_BUILD_DATE = APP_BUILD_DATE;

function renderVersionTags() {
  const txt = 'v' + APP_VERSION;
  document.querySelectorAll('[data-app-version]').forEach(el => {
    el.textContent = el.dataset.appVersion === 'full'
      ? `${txt} · ${APP_BUILD_DATE}`
      : txt;
  });
}
window.renderVersionTags = renderVersionTags;

// Sanitização e Escape seguro para renderização DOM
window.escapeHTML = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

var USAR_CATALOGO_LOCAL = window.USAR_CATALOGO_LOCAL !== undefined ? window.USAR_CATALOGO_LOCAL : true;
window.USAR_CATALOGO_LOCAL = USAR_CATALOGO_LOCAL;

// MODAL SYSTEM (Redimensionado e Responsivo)
window.showModal = (title, content, customWidth) => {
  let modal = document.getElementById('global-modal');
  let modalContent = document.getElementById('global-modal-content');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'global-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15, 23, 42, 0.65);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;box-sizing:border-box;';
    
    modalContent = document.createElement('div');
    modalContent.id = 'global-modal-content';
    modalContent.className = 'card';
    modalContent.style.cssText = 'width:95%;max-width:900px;max-height:90vh;background:var(--bg, #ffffff);border-radius:12px;overflow:hidden;box-shadow:0 20px 25px -5px rgba(0,0,0,0.2), 0 10px 10px -5px rgba(0,0,0,0.1);display:flex;flex-direction:column;';
    
    const header = document.createElement('div');
    header.className = 'card-header';
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--border, #e2e8f0);background:var(--surface-1, #f8fafc);flex-shrink:0;';
    
    const titleEl = document.createElement('h3');
    titleEl.id = 'global-modal-title';
    titleEl.style.cssText = 'margin:0;font-size:1.15rem;font-weight:700;color:var(--text-primary, #0f172a);';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = 'background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--text-secondary, #64748b);padding:4px 8px;border-radius:6px;line-height:1;';
    closeBtn.onmouseover = () => closeBtn.style.background = '#e2e8f0';
    closeBtn.onmouseout = () => closeBtn.style.background = 'none';
    closeBtn.onclick = closeModal;
    
    const body = document.createElement('div');
    body.className = 'card-body';
    body.id = 'global-modal-body';
    body.style.cssText = 'padding:20px;overflow-y:auto;max-height:calc(90vh - 70px);box-sizing:border-box;';
    
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }
  
  if (modalContent) {
    modalContent.style.maxWidth = customWidth || '900px';
  }
  
  document.getElementById('global-modal-title').innerText = title;
  document.getElementById('global-modal-body').innerHTML = content;
  modal.style.display = 'flex';
};

window.closeModal = () => {
  const modal = document.getElementById('global-modal');
  if (modal) modal.style.display = 'none';
};

window.showToast = (msg, type='success') => {
  let toast = document.createElement('div');
  toast.innerText = msg;
  toast.style.cssText = `position:fixed;bottom:20px;right:20px;background:var(--${type});color:white;padding:12px 24px;border-radius:var(--radius-md);box-shadow:var(--shadow-lg);z-index:10000;font-weight:600;opacity:0;transition:opacity 0.3s;`;
  document.body.appendChild(toast);
  setTimeout(() => toast.style.opacity = '1', 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// HTML HELPERS REUTILIZÁVEIS
window._kpi = (title, val, sub, icon, trend) => `
  <div class="kpi-card">
    <div class="kpi-icon">${icon || '📊'}</div>
    <div class="kpi-title">${escapeHTML(title)}</div>
    <div class="kpi-value">${escapeHTML(val)}</div>
    ${sub ? `<div class="kpi-sub ${trend || ''}">${escapeHTML(sub)}</div>` : ''}
  </div>
`;

window._pageHeader = (title, subtitle, actionsHtml) => `
  <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
    <div>
      <h1 class="page-title" style="margin:0;font-size:1.75rem;font-weight:800;color:var(--text-primary,#0f172a);">${escapeHTML(title)}</h1>
      ${subtitle ? `<p class="page-subtitle" style="margin:4px 0 0 0;color:var(--text-secondary,#64748b);font-size:0.9rem;">${escapeHTML(subtitle)}</p>` : ''}
    </div>
    ${actionsHtml ? `<div class="header-actions" style="display:flex;gap:12px;">${actionsHtml}</div>` : ''}
  </div>
`;

window._cardHeader = (title, badge, actionBtn) => `
  <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--border,#e2e8f0);">
    <div style="display:flex;align-items:center;gap:8px;">
      <h3 style="margin:0;font-size:1.1rem;font-weight:700;">${escapeHTML(title)}</h3>
      ${badge ? `<span class="badge badge-info">${escapeHTML(badge)}</span>` : ''}
    </div>
    ${actionBtn || ''}
  </div>
`;

window._tag = (text, type = 'neutral') => `<span class="tag tag-${type}">${escapeHTML(text)}</span>`;

window._statusBadge = (status) => {
  const map = {
    'Pendente': 'warning', 'Em separação': 'info', 'Separado': 'info',
    'Em transporte': 'primary', 'Em Rota': 'primary', 'Entregue': 'success',
    'Liquidado': 'success', 'Parcial': 'warning', 'Publicado': 'success',
    'Em Elaboração': 'neutral', 'Vigente': 'success', 'Encerrada': 'danger',
  };
  const cls = map[status] || 'neutral';
  return `<span class="badge badge-${cls}">${escapeHTML(status)}</span>`;
};

window._emptyState = (msg = 'Nenhum registro encontrado.') => `
  <div style="padding:40px 20px;text-align:center;color:var(--text-secondary,#64748b);">
    <div style="font-size:2rem;margin-bottom:8px;">📭</div>
    <p style="margin:0;font-size:0.9rem;">${escapeHTML(msg)}</p>
  </div>
`;

// REGISTRO GLOBAL DE RENDERIZADORES DE PÁGINAS
window.PAGE_RENDERERS = window.PAGE_RENDERERS || {};

// APP STATE GLOBAL
window.state = window.state || {
  currentProfile: 'gestor',
  currentPage: 'dashboard',
  charts: {},
  sidebarCollapsed: false,
  selectedSchoolId: null,
  selectedSchool: null,
  pilotoAtivo: (() => { try { return localStorage.getItem('saged_piloto_v1') === '1'; } catch { return false; } })(),
};

window.togglePilotoMode = () => {
  if (window.state) window.state.pilotoAtivo = !window.state.pilotoAtivo;
  try { localStorage.setItem('saged_piloto_v1', window.state?.pilotoAtivo ? '1' : '0'); } catch {}
  if (typeof applyPiloto === 'function') applyPiloto();
  showToast(window.state?.pilotoAtivo ? '🎯 Modo Piloto ativado: 8 escolas.' : '🌐 Modo completo: ' + (window._DATA_SCHOOLS_FULL||[]).length + ' escolas.');
  if (typeof renderPage === 'function') renderPage();
};

function applyPiloto() {
  if (!window.DATA) return;
  if (!window._DATA_SCHOOLS_FULL) window._DATA_SCHOOLS_FULL = window.DATA.schools ? window.DATA.schools.slice() : [];
  if (window.DATA.schools && window.state) {
    window.DATA.schools = window.state.pilotoAtivo ? window._DATA_SCHOOLS_FULL.slice(0, 8) : window._DATA_SCHOOLS_FULL.slice();
  }
}
window.applyPiloto = applyPiloto;

// CONTRATO FIXO E IMUTÁVEL DO ROTEADOR: renderer(containerElement)
// Assinatura universal: (el) => { el.innerHTML = ...; }
window.renderPage = (pageKey) => {
  const targetPage = pageKey || window.state?.currentPage || 'dashboard';
  if (window.state) window.state.currentPage = targetPage;
  
  const contentEl = document.getElementById('page-content');
  if (!contentEl) return;

  const profileKey = window.state?.currentProfile || 'gestor';
  const fullRendererKey = `${profileKey}_${targetPage}`;

  // 1. Tenta o renderer específico do perfil com assinatura (el)
  if (typeof window.PAGE_RENDERERS[fullRendererKey] === 'function') {
    window.PAGE_RENDERERS[fullRendererKey](contentEl);
    return;
  }
  
  // 2. Tenta o renderer genérico com assinatura (el)
  if (typeof window.PAGE_RENDERERS[targetPage] === 'function') {
    window.PAGE_RENDERERS[targetPage](contentEl);
    return;
  }

  // 3. Fallback se app.js original tiver função global
  if (typeof window.renderPageOriginal === 'function') {
    window.renderPageOriginal(pageKey);
  }
};

window.login = window.login || async function(profile, schoolId) {
  if (typeof state !== 'undefined') {
    state.currentProfile = profile;
    state.currentPage = 'dashboard';
    if (schoolId) state.selectedSchoolId = schoolId;
  }
  const loginScreen = document.getElementById('screen-login');
  if (loginScreen) {
    loginScreen.classList.remove('active');
    loginScreen.hidden = true;
  }
  const appScreen = document.getElementById('screen-app');
  if (appScreen) {
    appScreen.hidden = false;
    appScreen.removeAttribute('hidden');
    appScreen.classList.add('active');
  }
  if (typeof renderSidebar === 'function') renderSidebar();
  if (typeof renderHeader === 'function') renderHeader();
  if (typeof renderPage === 'function') renderPage();
};

window.handleLoginSubmit = async function(e) {
  if (e) {
    if (typeof e.preventDefault === 'function') e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
  }
  if (window._isLoggingIn) return false;
  window._isLoggingIn = true;
  try {
    const activeProfile = document.querySelector('.profile-btn.active');
    const topProfile = activeProfile ? activeProfile.dataset.profile : 'gestor';

    let profile = topProfile;
    let schoolId = null;

    if (topProfile === 'escola') {
      const activeSub = document.querySelector('.subrole-btn.active');
      profile = activeSub ? activeSub.dataset.subrole : 'diretor';
      const sel = document.querySelector('#school-picker-select');
      if (sel && sel.value) schoolId = parseInt(sel.value, 10);
    } else if (topProfile === 'colaboradores') {
      const activeColab = document.querySelector('.colab-subrole-btn.active');
      profile = activeColab ? activeColab.dataset.subrole : 'cooperativa';
    }

    if (typeof window.login === 'function') {
      await window.login(profile, schoolId);
    }
  } finally {
    window._isLoggingIn = false;
  }
  return false;
};

window.addEventListener('DOMContentLoaded', () => {
  renderVersionTags();
  if (typeof SharedState !== 'undefined' && SharedState.init) {
    SharedState.init();
  }
});
