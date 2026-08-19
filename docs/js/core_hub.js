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

// ============================================================
// ESTADO GLOBAL E DADOS (migrados do app.js na Fase 3.2)
// ============================================================
// Estes blocos vinham do app.js, que carrega DEPOIS deste arquivo. Ficam aqui
// para que o app.js possa ser desmontado sem levar o estado consigo.
//
// IMPORTANTE: DATA e declarado com `const`, portanto NAO e propriedade de
// `window` automaticamente. Codigo que fizer `window.DATA` recebia undefined —
// isso ja causou bug real (resolverColaboradorParaProduto). O export explicito
// no fim deste bloco resolve para ambos os estilos de acesso.

// MOCK DATA

const DATA = {
  schools: [
    {
      id: 1, name: 'EM ADV. DEMOSTHENES MARTINS', sigla: 'EM', tipo: 'Escola Municipal',
      region: 'Segredo', students: 454, refeicoesDia: 2, grade_levels: 'EF I + EF II',
      stockStatus: 'ok', lastDelivery: '2026-07-10', stockPct: 82,
      attendance_pct: 91, attendance_avg: 413, monthly_budget: 12500,
      diretor: { name: 'Profa. Maria Amélia Santos', matricula: 'SEMED-11001', cpf: '111.222.333-01', telefone: '(67) 98111-0001', email: 'direcao.demosthenes@semed.ms.gov.br', initials: 'MS' },
      respEstoque: { name: 'Carlos Eduardo Lima', matricula: 'SEMED-11002', cpf: '111.222.333-02', telefone: '(67) 98111-0002', email: 'estoque.demosthenes@semed.ms.gov.br', initials: 'CL' },
      merendeira: { name: 'Josefina Ribeiro Alves', matricula: 'SEMED-11003', cpf: '111.222.333-03', telefone: '(67) 98111-0003', email: 'cozinha.demosthenes@semed.ms.gov.br', initials: 'JA' },
    },
    {
      id: 2, name: 'EM PROF. ANTÔNIO LOPES LINS', sigla: 'EM', tipo: 'Escola Municipal',
      region: 'Lagoa', students: 1698, refeicoesDia: 2, grade_levels: 'EF I + EF II',
      stockStatus: 'warning', lastDelivery: '2026-07-05', stockPct: 38,
      attendance_pct: 88, attendance_avg: 1494, monthly_budget: 45000,
      diretor: { name: 'Prof. João Carlos Oliveira', matricula: 'SEMED-12001', cpf: '222.333.444-01', telefone: '(67) 98222-0001', email: 'direcao.antoniolins@semed.ms.gov.br', initials: 'JO' },
      respEstoque: { name: 'Fernanda Aparecida Costa', matricula: 'SEMED-12002', cpf: '222.333.444-02', telefone: '(67) 98222-0002', email: 'estoque.antoniolins@semed.ms.gov.br', initials: 'FC' },
      merendeira: { name: 'Aparecida Souza Lima', matricula: 'SEMED-12003', cpf: '222.333.444-03', telefone: '(67) 98222-0003', email: 'cozinha.antoniolins@semed.ms.gov.br', initials: 'AL' },
    },
    {
      id: 3, name: 'EMRTI AGRICOLA GOVERNADOR ARNALDO ESTEVAO DE FIGUEREDO', sigla: 'EMRTI', tipo: 'Escola Rural Integral',
      region: 'Rural', students: 436, refeicoesDia: 4, grade_levels: 'EF I + EF II + EM',
      stockStatus: 'ok', lastDelivery: '2026-07-12', stockPct: 91,
      attendance_pct: 94, attendance_avg: 410, monthly_budget: 22000,
      diretor: { name: 'Profa. Ana Cristina Pereira', matricula: 'SEMED-13001', cpf: '333.444.555-01', telefone: '(67) 98333-0001', email: 'direcao.arnaldo@semed.ms.gov.br', initials: 'AP' },
      respEstoque: { name: 'Sebastião Gonçalves Neto', matricula: 'SEMED-13002', cpf: '333.444.555-02', telefone: '(67) 98333-0002', email: 'estoque.arnaldo@semed.ms.gov.br', initials: 'SN' },
      merendeira: { name: 'Ivone Martins da Rosa', matricula: 'SEMED-13003', cpf: '333.444.555-03', telefone: '(67) 98333-0003', email: 'cozinha.arnaldo@semed.ms.gov.br', initials: 'IR' },
    },
    {
      id: 4, name: 'EMTI PROFª IRACEMA MARIA VICENTE', sigla: 'EMTI', tipo: 'Escola de Tempo Integral',
      region: 'Bandeira', students: 539, refeicoesDia: 4, grade_levels: 'EF I + EF II',
      stockStatus: 'danger', lastDelivery: '2026-06-28', stockPct: 15,
      attendance_pct: 86, attendance_avg: 463, monthly_budget: 28000,
      diretor: { name: 'Prof. Antônio Carlos Mendes', matricula: 'SEMED-14001', cpf: '444.555.666-01', telefone: '(67) 98444-0001', email: 'direcao.iracema@semed.ms.gov.br', initials: 'AM' },
      respEstoque: { name: 'Rosa Maria Alves Barbosa', matricula: 'SEMED-14002', cpf: '444.555.666-02', telefone: '(67) 98444-0002', email: 'estoque.iracema@semed.ms.gov.br', initials: 'RB' },
      merendeira: { name: 'Neuza Aparecida Ferreira', matricula: 'SEMED-14003', cpf: '444.555.666-03', telefone: '(67) 98444-0003', email: 'cozinha.iracema@semed.ms.gov.br', initials: 'NF' },
    },
    {
      id: 5, name: 'EMEI CLEOMAR BAPTISTA DOS SANTOS', sigla: 'EMEI', tipo: 'Educação Infantil',
      region: 'Anhanduizinho', students: 128, refeicoesDia: 4, grade_levels: 'Maternal + Pré-escola',
      stockStatus: 'ok', lastDelivery: '2026-07-11', stockPct: 75,
      attendance_pct: 90, attendance_avg: 115, monthly_budget: 8500,
      diretor: { name: 'Profa. Fernanda Lima Souza', matricula: 'SEMED-15001', cpf: '555.666.777-01', telefone: '(67) 98555-0001', email: 'direcao.cleomar@semed.ms.gov.br', initials: 'FS' },
      respEstoque: { name: 'Paulo Roberto Santos', matricula: 'SEMED-15002', cpf: '555.666.777-02', telefone: '(67) 98555-0002', email: 'estoque.cleomar@semed.ms.gov.br', initials: 'PS' },
      merendeira: { name: 'Marlene Duarte Silva', matricula: 'SEMED-15003', cpf: '555.666.777-03', telefone: '(67) 98555-0003', email: 'cozinha.cleomar@semed.ms.gov.br', initials: 'MD' },
    },
    {
      id: 6, name: 'EMEI PROFª EMY ISHIDA NASCIMENTO NOGUEIRA', sigla: 'EMEI', tipo: 'Educação Infantil',
      region: 'Prosa', students: 191, refeicoesDia: 4, grade_levels: 'Maternal + Pré-escola',
      stockStatus: 'ok', lastDelivery: '2026-07-09', stockPct: 88,
      attendance_pct: 92, attendance_avg: 176, monthly_budget: 11000,
      diretor: { name: 'Profa. Sandra Ishida Martins', matricula: 'SEMED-16001', cpf: '666.777.888-01', telefone: '(67) 98666-0001', email: 'direcao.emy@semed.ms.gov.br', initials: 'SM' },
      respEstoque: { name: 'Marcos Vinícius Rodrigues', matricula: 'SEMED-16002', cpf: '666.777.888-02', telefone: '(67) 98666-0002', email: 'estoque.emy@semed.ms.gov.br', initials: 'MR' },
      merendeira: { name: 'Cecília Nogueira Prado', matricula: 'SEMED-16003', cpf: '666.777.888-03', telefone: '(67) 98666-0003', email: 'cozinha.emy@semed.ms.gov.br', initials: 'CP' },
    },
    {
      id: 7, name: 'EMEI CLOTILDE CHAIA', sigla: 'EMEI', tipo: 'Educação Infantil',
      region: 'Imbirussu', students: 192, refeicoesDia: 4, grade_levels: 'Maternal + Pré-escola',
      stockStatus: 'warning', lastDelivery: '2026-07-02', stockPct: 42,
      attendance_pct: 89, attendance_avg: 171, monthly_budget: 11200,
      diretor: { name: 'Profa. Patrícia da Silva Chaia', matricula: 'SEMED-17001', cpf: '777.888.999-01', telefone: '(67) 98777-0001', email: 'direcao.clotilde@semed.ms.gov.br', initials: 'PC' },
      respEstoque: { name: 'Gilberto Nascimento Costa', matricula: 'SEMED-17002', cpf: '777.888.999-02', telefone: '(67) 98777-0002', email: 'estoque.clotilde@semed.ms.gov.br', initials: 'GC' },
      merendeira: { name: 'Terezinha Gomes Chaia', matricula: 'SEMED-17003', cpf: '777.888.999-03', telefone: '(67) 98777-0003', email: 'cozinha.clotilde@semed.ms.gov.br', initials: 'TC' },
    },
    {
      id: 8, name: 'EMEI ELEODES ESTEVAN', sigla: 'EMEI', tipo: 'Educação Infantil',
      region: 'Centro', students: 354, refeicoesDia: 4, grade_levels: 'Maternal + Pré-escola',
      stockStatus: 'ok', lastDelivery: '2026-07-14', stockPct: 95,
      attendance_pct: 93, attendance_avg: 329, monthly_budget: 19500,
      diretor: { name: 'Prof. Roberto Estevan Filho', matricula: 'SEMED-18001', cpf: '888.999.000-01', telefone: '(67) 98888-0001', email: 'direcao.eleodes@semed.ms.gov.br', initials: 'RE' },
      respEstoque: { name: 'Cleusa Maria Santos', matricula: 'SEMED-18002', cpf: '888.999.000-02', telefone: '(67) 98888-0002', email: 'estoque.eleodes@semed.ms.gov.br', initials: 'CS' },
      merendeira: { name: 'Vera Lúcia Estevan', matricula: 'SEMED-18003', cpf: '888.999.000-03', telefone: '(67) 98888-0003', email: 'cozinha.eleodes@semed.ms.gov.br', initials: 'VE' },
    },
  ],
  // ESTOQUE CENTRAL — 8 escolas piloto
  // ------------------------------------------------------------
  // Base de cálculo: 3.992 alunos · 11.664 refeições/dia · 22 dias letivos/mês
  // avgConsume = refeições/dia × per capita técnico do produto (peso cru)
  // unitPrice: preços reais de jul/2026 — ver `precoFonte` em cada item.
  //   AF  = CODEAGRO/SP, Compras Públicas da Agricultura Familiar (abr-jun/2026)
  //   CEASA = CEASA/MS, boletim 18ª semana/2026 (atacado)
  //   FORT  = Fort Atacadista, encarte mai-jun/2026
  //   PROCON = pesquisa PROCON-PB 2026
  //   EST   = estimativa de mercado (não foi localizado preço oficial publicado)
  // Memória de cálculo completa: vault SUALE → Precos_e_Estoque_Real_2026.md
  products: [
    { id: 1,  name: 'Arroz Tipo 1',                  category: 'Grãos',       unit: 'kg',   unitPrice: 4.80,  precoFonte: 'EST',    stock: 7000, avgConsume: 350,  daysLeft: 20, familyFarm: false },
    { id: 2,  name: 'Feijão Carioca',                category: 'Grãos',       unit: 'kg',   unitPrice: 9.39,  precoFonte: 'PROCON', stock: 4380, avgConsume: 292,  daysLeft: 15, familyFarm: false },
    { id: 3,  name: 'Banana Nanica',                 category: 'Frutas',      unit: 'kg',   unitPrice: 4.26,  precoFonte: 'AF',     stock: 1680, avgConsume: 560,  daysLeft: 3,  familyFarm: true },
    { id: 4,  name: 'Maçã Gala',                     category: 'Frutas',      unit: 'kg',   unitPrice: 9.28,  precoFonte: 'AF',     stock: 1398, avgConsume: 233,  daysLeft: 6,  familyFarm: false },
    { id: 5,  name: 'Alface Crespa',                 category: 'Hortaliças',  unit: 'kg',   unitPrice: 5.50,  precoFonte: 'AF',     stock: 466,  avgConsume: 233,  daysLeft: 2,  familyFarm: true },
    { id: 6,  name: 'Tomate',                        category: 'Hortaliças',  unit: 'kg',   unitPrice: 3.99,  precoFonte: 'AF',     stock: 1460, avgConsume: 292,  daysLeft: 5,  familyFarm: true },
    { id: 7,  name: 'Cenoura',                       category: 'Hortaliças',  unit: 'kg',   unitPrice: 4.09,  precoFonte: 'AF',     stock: 3500, avgConsume: 350,  daysLeft: 10, familyFarm: true },
    { id: 8,  name: 'Leite Integral',                category: 'Laticínios',  unit: 'L',    unitPrice: 3.41,  precoFonte: 'AF',     stock: 8400, avgConsume: 1200, daysLeft: 7,  familyFarm: false },
    { id: 9,  name: 'Frango (Coxa/Sobrecoxa)',       category: 'Proteínas',   unit: 'kg',   unitPrice: 6.85,  precoFonte: 'FORT',   stock: 1960, avgConsume: 280,  daysLeft: 7,  familyFarm: false },
    { id: 10, name: 'Carne Bovina (Acém)',           category: 'Proteínas',   unit: 'kg',   unitPrice: 28.50, precoFonte: 'EST',    stock: 1398, avgConsume: 233,  daysLeft: 6,  familyFarm: false },
    { id: 11, name: 'Mandioca',                      category: 'Tubérculos',  unit: 'kg',   unitPrice: 3.47,  precoFonte: 'AF',     stock: 3360, avgConsume: 280,  daysLeft: 12, familyFarm: true },
    { id: 12, name: 'Batata Doce',                   category: 'Tubérculos',  unit: 'kg',   unitPrice: 3.50,  precoFonte: 'AF',     stock: 819,  avgConsume: 117,  daysLeft: 7,  familyFarm: true },
    { id: 13, name: 'Ovo de Galinha',                category: 'Proteínas',   unit: 'dz',   unitPrice: 12.00, precoFonte: 'EST',    stock: 679,  avgConsume: 97,   daysLeft: 7,  familyFarm: true },
    { id: 14, name: 'Óleo de Soja',                  category: 'Gorduras',    unit: 'L',    unitPrice: 7.20,  precoFonte: 'EST',    stock: 870,  avgConsume: 58,   daysLeft: 15, familyFarm: false },
    { id: 15, name: 'Açúcar Cristal',                category: 'Condimentos', unit: 'kg',   unitPrice: 3.90,  precoFonte: 'EST',    stock: 2106, avgConsume: 117,  daysLeft: 18, familyFarm: false },
    { id: 16, name: 'Macarrão Espaguete',            category: 'Grãos',       unit: 'kg',   unitPrice: 6.50,  precoFonte: 'EST',    stock: 638,  avgConsume: 58,   daysLeft: 11, familyFarm: false },
    { id: 17, name: 'Abóbora Cabotiá',               category: 'Hortaliças',  unit: 'kg',   unitPrice: 4.48,  precoFonte: 'AF',     stock: 935,  avgConsume: 187,  daysLeft: 5,  familyFarm: true },
    { id: 18, name: 'Melancia',                      category: 'Frutas',      unit: 'kg',   unitPrice: 3.96,  precoFonte: 'AF',     stock: 466,  avgConsume: 233,  daysLeft: 2,  familyFarm: true },
    { id: 19, name: 'Farinha de Trigo',              category: 'Grãos',       unit: 'kg',   unitPrice: 4.50,  precoFonte: 'EST',    stock: 1674, avgConsume: 93,   daysLeft: 18, familyFarm: false },
    { id: 20, name: 'Leite em Pó',                   category: 'Laticínios',  unit: 'kg',   unitPrice: 32.00, precoFonte: 'EST',    stock: 720,  avgConsume: 60,   daysLeft: 12, familyFarm: false },
    { id: 21, name: 'Fórmula infantil (Partida)',    category: 'Especiais',   unit: 'Lata', unitPrice: 38.00, precoFonte: 'EST',    stock: 260,  avgConsume: 20,   daysLeft: 13, familyFarm: false },
    { id: 22, name: 'Fórmula infantil (Seguimento)', category: 'Especiais',   unit: 'Lata', unitPrice: 34.50, precoFonte: 'EST',    stock: 0,    avgConsume: 15,   daysLeft: 0,  familyFarm: false },
    { id: 23, name: 'Carne Bovina - Patinho',        category: 'Proteínas',   unit: 'kg',   unitPrice: 34.90, precoFonte: 'EST',    stock: 1165, avgConsume: 233,  daysLeft: 5,  familyFarm: false },
    { id: 24, name: 'Carne Bovina - Músculo Moído',  category: 'Proteínas',   unit: 'kg',   unitPrice: 29.90, precoFonte: 'FORT',   stock: 1398, avgConsume: 233,  daysLeft: 6,  familyFarm: false },
    { id: 25, name: 'Filé de Tilápia',               category: 'Proteínas',   unit: 'kg',   unitPrice: 34.90, precoFonte: 'EST',    stock: 350,  avgConsume: 70,   daysLeft: 5,  familyFarm: false },
    { id: 26, name: 'Beterraba',                     category: 'Hortaliças',  unit: 'kg',   unitPrice: 4.64,  precoFonte: 'AF',     stock: 1200, avgConsume: 120,  daysLeft: 10, familyFarm: true },
    { id: 27, name: 'Couve Manteiga',                category: 'Hortaliças',  unit: 'kg',   unitPrice: 5.92,  precoFonte: 'AF',     stock: 340,  avgConsume: 85,   daysLeft: 4,  familyFarm: true },
    { id: 28, name: 'Batata Inglesa',                category: 'Tubérculos',  unit: 'kg',   unitPrice: 4.20,  precoFonte: 'CEASA',  stock: 2100, avgConsume: 175,  daysLeft: 12, familyFarm: false },
  ],
  cooperatives: [
    { id: 1, name: 'COOPAGRAN', farmers: 28, orders: 47, delivered: 42, rate: 89, value: 1450000 },
    { id: 2, name: 'COOPRAN', farmers: 19, orders: 35, delivered: 33, rate: 94, value: 980000 },
    { id: 3, name: 'COOPAERGS', farmers: 22, orders: 41, delivered: 38, rate: 93, value: 1120000 },
    { id: 4, name: 'COOPASUL', farmers: 15, orders: 28, delivered: 24, rate: 86, value: 720000 },
    { id: 5, name: 'COOPERVIDA', farmers: 12, orders: 22, delivered: 21, rate: 95, value: 540000 },
  ],
  farmers: [
    { id: 1, name: 'José Maria Rodrigues', coop: 'COOPAGRAN', products: ['Mandioca', 'Banana Nanica', 'Abóbora'], production: 4500, stock: 1200, area: 12 },
    { id: 2, name: 'Antônio Carlos Pereira', coop: 'COOPAGRAN', products: ['Tomate', 'Alface', 'Cenoura'], production: 3200, stock: 800, area: 8 },
    { id: 3, name: 'Maria Aparecida Silva', coop: 'COOPRAN', products: ['Ovo de Galinha', 'Mandioca'], production: 5800, stock: 2100, area: 15 },
    { id: 4, name: 'Francisco Souza Lima', coop: 'COOPAERGS', products: ['Batata Doce', 'Melancia', 'Abóbora'], production: 3800, stock: 900, area: 10 },
    { id: 5, name: 'Luzia Ferreira Santos', coop: 'COOPAGRAN', products: ['Alface', 'Tomate', 'Cenoura', 'Abóbora'], production: 2900, stock: 700, area: 6 },
    { id: 6, name: 'Pedro Henrique Alves', coop: 'COOPRAN', products: ['Banana Nanica', 'Melancia'], production: 4100, stock: 1500, area: 14 },
    { id: 7, name: 'Ana Paula Martins', coop: 'COOPAERGS', products: ['Mandioca', 'Batata Doce'], production: 3500, stock: 1100, area: 9 },
    { id: 8, name: 'Raimundo da Costa', coop: 'COOPASUL', products: ['Tomate', 'Cenoura', 'Alface'], production: 2600, stock: 600, area: 5 },
    { id: 9, name: 'Sebastião Oliveira', coop: 'COOPASUL', products: ['Ovo de Galinha', 'Banana Nanica'], production: 3900, stock: 1300, area: 11 },
    { id: 10, name: 'Terezinha Barbosa', coop: 'COOPERVIDA', products: ['Abóbora', 'Mandioca', 'Batata Doce'], production: 4200, stock: 1000, area: 13 },
    { id: 11, name: 'Valdir Nascimento', coop: 'COOPERVIDA', products: ['Melancia', 'Tomate'], production: 2800, stock: 500, area: 7 },
    { id: 12, name: 'Cleusa Maria dos Santos', coop: 'COOPAGRAN', products: ['Cenoura', 'Alface', 'Tomate'], production: 3100, stock: 850, area: 8 },
    { id: 13, name: 'Gilberto Machado', coop: 'COOPRAN', products: ['Mandioca', 'Abóbora'], production: 4600, stock: 1800, area: 16 },
    { id: 14, name: 'Rosalina Gonçalves', coop: 'COOPAERGS', products: ['Banana Nanica', 'Batata Doce', 'Melancia'], production: 3400, stock: 950, area: 10 },
    { id: 15, name: 'Osvaldo Campos Neto', coop: 'COOPASUL', products: ['Ovo de Galinha', 'Cenoura'], production: 5200, stock: 2000, area: 18 },
  ],
  // ATAS DE REGISTRO DE PREÇO — rede municipal (183 escolas · 94,7 mil alunos)
  // ------------------------------------------------------------
  // Atas são instrumentos MUNICIPAIS; o piloto de 8 escolas consome ~4,2% do
  // total (3.992 / 94.700 alunos). Por isso os empenhos do piloto são pequenos
  // frente ao valor global — comportamento normal de registro de preço, que
  // superdimensiona a quantidade registrada e executa só o necessário.
  // Modalidade: 'chamada_publica' = Agricultura Familiar (mín. 45% do PNAE em
  // 2026, subiu de 30%) · 'pregao' = licitação comum.
  contracts: [
    { id: 1, number: 'ATA-2026/001', start: '2026-01-15', end: '2026-12-31', supplier: 'COOPAGRAN',                          modalidade: 'chamada_publica', globalValue: 5196400.00,  executedValue: 1719120.00, status: 'Vigente' },
    { id: 2, number: 'ATA-2026/002', start: '2026-02-01', end: '2026-12-31', supplier: 'COOPRAN / COOPAERGS',                modalidade: 'chamada_publica', globalValue: 6829900.00,  executedValue: 2360245.00, status: 'Vigente' },
    { id: 3, number: 'ATA-2025/049', start: '2025-05-10', end: '2026-05-09', supplier: 'COMERCIAL LOTUS LTDA',               modalidade: 'pregao',          globalValue: 13121.00,    executedValue: 3040.00,    status: 'Encerrada' },
    { id: 4, number: 'ATA-2026/018', start: '2026-02-10', end: '2027-02-09', supplier: 'POLARIS COMÉRCIO DE ALIMENTOS LTDA', modalidade: 'pregao',          globalValue: 10806716.40, executedValue: 4250000.00, status: 'Vigente' },
    { id: 5, number: 'ATA-2026/031', start: '2026-03-05', end: '2027-03-04', supplier: 'NUTRI ALIMENTOS DISTRIBUIDORA LTDA', modalidade: 'pregao',          globalValue: 10040700.00, executedValue: 3228210.00, status: 'Vigente' },
    { id: 6, number: 'ATA-2026/042', start: '2026-04-12', end: '2027-04-11', supplier: 'AVINORTE DISTRIBUIDORA DE AVES LTDA',modalidade: 'pregao',          globalValue: 4176000.00,  executedValue: 1376100.00, status: 'Vigente' },
  ],
  orders: [
    { id: 1, school: 'EMTI PROFª IRACEMA MARIA VICENTE', date: '2026-06-24', status: 'Pendente', coop: 'COOPAGRAN', value: 8500 },
    { id: 2, school: 'EMEI ELEODES ESTEVAN', date: '2026-06-24', status: 'Pendente', coop: 'COOPRAN', value: 7200 },
    { id: 3, school: 'EM ADV. DEMOSTHENES MARTINS', date: '2026-06-23', status: 'Em separação', coop: 'COOPAERGS', value: 9100 },
    { id: 4, school: 'EM PROF. ANTÔNIO LOPES LINS', date: '2026-06-23', status: 'Em transporte', coop: 'COOPAGRAN', value: 6800 },
    { id: 5, school: 'EMEI CLOTILDE CHAIA', date: '2026-06-22', status: 'Entregue', coop: 'COOPASUL', value: 5400 },
    { id: 6, school: 'EMEI PROFª EMY ISHIDA NASCIMENTO NOGUEIRA', date: '2026-06-22', status: 'Entregue', coop: 'COOPERVIDA', value: 7600 },
    { id: 7, school: 'EM PROF. ANTÔNIO LOPES LINS', date: '2026-06-21', status: 'Entregue', coop: 'COOPRAN', value: 4900 },
    { id: 8, school: 'EM ADV. DEMOSTHENES MARTINS', date: '2026-06-20', status: 'Entregue', coop: 'COOPAERGS', value: 8200 },
  ],
  // Itens de cada ata. globalValue = maxQtd × unitPrice (quantidade registrada).
  // executedValue = quanto já foi empenhado/consumido do item.
  // Todo ataProduct aponta para o item de estoque correspondente via stockProductId.
  ataProducts: [
    // ── ATA-2026/001 · COOPAGRAN · Chamada Pública (Agricultura Familiar) ──
    { id: 1,  ataId: 1, name: 'Banana Nanica',                     unit: 'kg',   maxQtd: 400000, unitPrice: 4.26,  globalValue: 1704000.00, executedValue: 612000.00,  stockProductId: 3 },
    { id: 2,  ataId: 1, name: 'Mandioca (raiz, descascada)',       unit: 'kg',   maxQtd: 200000, unitPrice: 3.47,  globalValue: 694000.00,  executedValue: 208200.00,  stockProductId: 11 },
    { id: 3,  ataId: 1, name: 'Abóbora Cabotiá',                   unit: 'kg',   maxQtd: 120000, unitPrice: 4.48,  globalValue: 537600.00,  executedValue: 161280.00,  stockProductId: 17 },
    { id: 4,  ataId: 1, name: 'Melancia',                          unit: 'kg',   maxQtd: 150000, unitPrice: 3.96,  globalValue: 594000.00,  executedValue: 237600.00,  stockProductId: 18 },
    { id: 5,  ataId: 1, name: 'Batata Doce Rosada',                unit: 'kg',   maxQtd: 100000, unitPrice: 3.50,  globalValue: 350000.00,  executedValue: 105000.00,  stockProductId: 12 },
    { id: 6,  ataId: 1, name: 'Couve Manteiga',                    unit: 'kg',   maxQtd: 40000,  unitPrice: 5.92,  globalValue: 236800.00,  executedValue: 71040.00,   stockProductId: 27 },
    { id: 7,  ataId: 1, name: 'Ovo de Galinha (caipira)',          unit: 'dz',   maxQtd: 90000,  unitPrice: 12.00, globalValue: 1080000.00, executedValue: 324000.00,  stockProductId: 13 },

    // ── ATA-2026/002 · COOPRAN / COOPAERGS · Chamada Pública (Agricultura Familiar) ──
    { id: 8,  ataId: 2, name: 'Tomate Salada',                     unit: 'kg',   maxQtd: 250000, unitPrice: 3.99,  globalValue: 997500.00,  executedValue: 349125.00,  stockProductId: 6 },
    { id: 9,  ataId: 2, name: 'Cenoura',                           unit: 'kg',   maxQtd: 300000, unitPrice: 4.09,  globalValue: 1227000.00, executedValue: 429450.00,  stockProductId: 7 },
    { id: 10, ataId: 2, name: 'Alface Crespa',                     unit: 'kg',   maxQtd: 120000, unitPrice: 5.50,  globalValue: 660000.00,  executedValue: 264000.00,  stockProductId: 5 },
    { id: 11, ataId: 2, name: 'Beterraba',                         unit: 'kg',   maxQtd: 130000, unitPrice: 4.64,  globalValue: 603200.00,  executedValue: 180960.00,  stockProductId: 26 },
    { id: 12, ataId: 2, name: 'Leite Integral Pasteurizado',       unit: 'L',    maxQtd: 380000, unitPrice: 3.41,  globalValue: 1295800.00, executedValue: 583110.00,  stockProductId: 8 },
    { id: 13, ataId: 2, name: 'Maçã Gala',                         unit: 'kg',   maxQtd: 130000, unitPrice: 9.28,  globalValue: 1206400.00, executedValue: 301600.00,  stockProductId: 4 },
    { id: 14, ataId: 2, name: 'Batata Inglesa',                    unit: 'kg',   maxQtd: 200000, unitPrice: 4.20,  globalValue: 840000.00,  executedValue: 252000.00,  stockProductId: 28 },

    // ── ATA-2025/049 · COMERCIAL LOTUS LTDA · Pregão (fórmulas infantis) ──
    { id: 15, ataId: 3, name: 'Fórmula infantil - Partida (Aptamil)',    unit: 'Lata', maxQtd: 220,   unitPrice: 38.00, globalValue: 8360.00,   executedValue: 3040.00, stockProductId: 21 },
    { id: 16, ataId: 3, name: 'Fórmula infantil - Seguimento (Nestogeno)',unit: 'Lata', maxQtd: 138,   unitPrice: 34.50, globalValue: 4761.00,   executedValue: 0.00,    stockProductId: 22 },

    // ── ATA-2026/018 · POLARIS · Pregão (carnes e pescado) ──
    { id: 17, ataId: 4, name: 'Carne Bovina - Patinho em cubos (Talismã)', unit: 'kg', maxQtd: 117436, unitPrice: 34.90, globalValue: 4098516.40, executedValue: 1750000.00, stockProductId: 23 },
    { id: 18, ataId: 4, name: 'Carne Bovina - Músculo Moído (Talismã)',    unit: 'kg', maxQtd: 180000, unitPrice: 29.90, globalValue: 5382000.00, executedValue: 2100000.00, stockProductId: 24 },
    { id: 19, ataId: 4, name: 'Filé de Tilápia (Bello)',                   unit: 'kg', maxQtd: 38000,  unitPrice: 34.90, globalValue: 1326200.00, executedValue: 400000.00,  stockProductId: 25 },

    // ── ATA-2026/031 · NUTRI ALIMENTOS · Pregão (secos e mercearia) ──
    { id: 20, ataId: 5, name: 'Arroz Tipo 1 (longo fino)',         unit: 'kg',   maxQtd: 900000, unitPrice: 4.80,  globalValue: 4320000.00, executedValue: 1512000.00, stockProductId: 1 },
    { id: 21, ataId: 5, name: 'Feijão Carioca Tipo 1',             unit: 'kg',   maxQtd: 380000, unitPrice: 9.39,  globalValue: 3568200.00, executedValue: 1070460.00, stockProductId: 2 },
    { id: 22, ataId: 5, name: 'Óleo de Soja Refinado',             unit: 'L',    maxQtd: 75000,  unitPrice: 7.20,  globalValue: 540000.00,  executedValue: 162000.00,  stockProductId: 14 },
    { id: 23, ataId: 5, name: 'Açúcar Cristal',                    unit: 'kg',   maxQtd: 150000, unitPrice: 3.90,  globalValue: 585000.00,  executedValue: 175500.00,  stockProductId: 15 },
    { id: 24, ataId: 5, name: 'Macarrão Espaguete',                unit: 'kg',   maxQtd: 75000,  unitPrice: 6.50,  globalValue: 487500.00,  executedValue: 146250.00,  stockProductId: 16 },
    { id: 25, ataId: 5, name: 'Farinha de Trigo Especial',         unit: 'kg',   maxQtd: 120000, unitPrice: 4.50,  globalValue: 540000.00,  executedValue: 162000.00,  stockProductId: 19 },

    // ── ATA-2026/042 · AVINORTE · Pregão (aves e bovinos) ──
    { id: 26, ataId: 6, name: 'Frango - Coxa e Sobrecoxa congelada', unit: 'kg', maxQtd: 360000, unitPrice: 6.85,  globalValue: 2466000.00, executedValue: 863100.00,  stockProductId: 9 },
    { id: 27, ataId: 6, name: 'Carne Bovina - Acém em cubos',        unit: 'kg', maxQtd: 60000,  unitPrice: 28.50, globalValue: 1710000.00, executedValue: 513000.00,  stockProductId: 10 },
  ],
  // Lotes com validade — alimentam o controle FEFO (primeiro a vencer, primeiro a sair).
  // productId aponta para DATA.products. qtd deve fechar com o stock do produto.
  lots: [
    { id: 1, productId: 23, number: 'L-PAT-2607', entryDate: '2026-07-17', expirationDate: '2026-10-17', qtd: 1165 },
    { id: 2, productId: 1,  number: 'L-ARR-2607', entryDate: '2026-07-09', expirationDate: '2027-07-09', qtd: 7000 },
    { id: 3, productId: 24, number: 'L-MUS-2607', entryDate: '2026-07-18', expirationDate: '2026-10-18', qtd: 1398 },
    { id: 4, productId: 2,  number: 'L-FEI-2607', entryDate: '2026-07-11', expirationDate: '2027-04-11', qtd: 4380 },
    { id: 5, productId: 9,  number: 'L-FRA-2607', entryDate: '2026-07-15', expirationDate: '2026-11-15', qtd: 1960 },
    { id: 6, productId: 8,  number: 'L-LEI-2607', entryDate: '2026-07-20', expirationDate: '2026-08-04', qtd: 8400 },
    { id: 7, productId: 3,  number: 'L-BAN-2607', entryDate: '2026-07-13', expirationDate: '2026-08-01', qtd: 1680 },
    { id: 8, productId: 15, number: 'L-ACU-2606', entryDate: '2026-06-24', expirationDate: '2028-06-24', qtd: 2106 },
  ],
  separation_orders: [
    { id: 1, pedidoId: 301, school: 'EM ADV. DEMOSTHENES MARTINS', items: [{ productId: 1, requested: 120, lotSugg: 'L-ARR-092', scanned: 0 }], status: 'Pendente' }
  ],
  // EMPENHOS — nota de empenho (NE) do exercício 2026
  // ------------------------------------------------------------
  // Numeração no padrão SIAFI: <exercício>NE<sequencial>.
  // São os empenhos do mês corrente (jul/2026). O executedValue de cada ata
  // acima é o ACUMULADO do ano, não a soma só destes — por isso é maior.
  // Quantidade de cada NE ≈ 1/12 da quantidade registrada na ata (draw mensal).
  // items[].productId aponta para DATA.ataProducts (não para products).
  empenhos: [
    { id: 1,  ataId: 5, numero: '2026NE00477', date: '2026-07-02', totalValue: 360000.00, executedValue: 360000.00, status: 'Liquidado', items: [{ productId: 20, qtd: 75000, value: 360000.00, delivered: 75000 }] },
    { id: 2,  ataId: 5, numero: '2026NE00478', date: '2026-07-02', totalValue: 297663.00, executedValue: 187800.00, status: 'Parcial',   items: [{ productId: 21, qtd: 31700, value: 297663.00, delivered: 20000 }] },
    { id: 3,  ataId: 1, numero: '2026NE00489', date: '2026-07-06', totalValue: 141858.00, executedValue: 141858.00, status: 'Liquidado', items: [{ productId: 1,  qtd: 33300, value: 141858.00, delivered: 33300 }] },
    { id: 4,  ataId: 6, numero: '2026NE00501', date: '2026-07-08', totalValue: 205500.00, executedValue: 123300.00, status: 'Parcial',   items: [{ productId: 26, qtd: 30000, value: 205500.00, delivered: 18000 }] },
    { id: 5,  ataId: 4, numero: '2026NE00512', date: '2026-07-10', totalValue: 342020.00, executedValue: 342020.00, status: 'Liquidado', items: [{ productId: 17, qtd: 9800,  value: 342020.00, delivered: 9800 }] },
    { id: 6,  ataId: 4, numero: '2026NE00513', date: '2026-07-10', totalValue: 448500.00, executedValue: 269100.00, status: 'Parcial',   items: [{ productId: 18, qtd: 15000, value: 448500.00, delivered: 9000 }] },
    { id: 7,  ataId: 2, numero: '2026NE00524', date: '2026-07-14', totalValue: 108097.00, executedValue: 108097.00, status: 'Liquidado', items: [{ productId: 12, qtd: 31700, value: 108097.00, delivered: 31700 }] },
    { id: 8,  ataId: 2, numero: '2026NE00525', date: '2026-07-16', totalValue: 82992.00,  executedValue: 0.00,      status: 'Pendente',  items: [{ productId: 8,  qtd: 20800, value: 82992.00,  delivered: 0 }] },
    { id: 9,  ataId: 2, numero: '2026NE00526', date: '2026-07-16', totalValue: 102250.00, executedValue: 61350.00,  status: 'Parcial',   items: [{ productId: 9,  qtd: 25000, value: 102250.00, delivered: 15000 }] },
    { id: 10, ataId: 1, numero: '2026NE00531', date: '2026-07-21', totalValue: 90000.00,  executedValue: 0.00,      status: 'Pendente',  items: [{ productId: 7,  qtd: 7500,  value: 90000.00,  delivered: 0 }] },
  ],
  nf_history: [
    { id: 1, empenhoId: 1, date: '2026-07-09', numero: 'NF-e 018452', items: [{ productId: 20, qtd: 75000, value: 360000.00 }] },
    { id: 2, empenhoId: 2, date: '2026-07-11', numero: 'NF-e 018477', items: [{ productId: 21, qtd: 20000, value: 187800.00 }] },
    { id: 3, empenhoId: 3, date: '2026-07-13', numero: 'NF-e 004120', items: [{ productId: 1,  qtd: 33300, value: 141858.00 }] },
    { id: 4, empenhoId: 4, date: '2026-07-15', numero: 'NF-e 092330', items: [{ productId: 26, qtd: 18000, value: 123300.00 }] },
    { id: 5, empenhoId: 5, date: '2026-07-17', numero: 'NF-e 055901', items: [{ productId: 17, qtd: 9800,  value: 342020.00 }] },
    { id: 6, empenhoId: 6, date: '2026-07-18', numero: 'NF-e 055918', items: [{ productId: 18, qtd: 9000,  value: 269100.00 }] },
    { id: 7, empenhoId: 7, date: '2026-07-20', numero: 'NF-e 007733', items: [{ productId: 12, qtd: 31700, value: 108097.00 }] },
    { id: 8, empenhoId: 9, date: '2026-07-23', numero: 'NF-e 007801', items: [{ productId: 9,  qtd: 15000, value: 61350.00 }] },
  ],
  ata_pedidos: [
    { id: 1, empenhoId: 1, date: '2026-06-16', qtd: 5031, value: 120000 },
    { id: 2, empenhoId: 2, date: '2026-06-22', qtd: 1432, value: 50000 }
  ],
  regions: ['Anhanduizinho', 'Bandeira', 'Centro', 'Imbirussu', 'Lagoa', 'Prosa', 'Segredo'],
  monthlyConsumption: [42000, 38500, 45200, 41800, 43900, 39700, 44100, 40300, 46500, 43200, 41600, 44800],
  months: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
};

// SHARED STATE
// ---------------------------
// Estado interligado entre todos os perfis. Persistido em localStorage
// para que mudanças feitas por um perfil apareçam quando qualquer outro
// perfil abrir a tela correspondente.
//
// Entidades:
// - menus         → cardápios publicados/em elaboração (Nutricionista → Escola/Gestor)
// - weeklyMenus   → cardápios semanais por escola (Nutricionista → Escola/Cooperativa/Agricultor)
// - fichas        → fichas técnicas (Nutricionista → Escola/Gestor)
// - orders        → pedidos de abastecimento (Escola → Cooperativa/Agricultor/Almoxarifado/Gestor)
// - deliveries    → entregas em andamento e realizadas (Motorista/Cooperativa → Escola/Gestor)
// - incidents     → ocorrências (Motorista → Gestor/Escola)
// - productions   → atualizações de produção (Agricultor → Cooperativa/Gestor)
// - stockAdjust   → ajustes de estoque por escola (Escola/Almoxarifado → Gestor)
const SHARED_STATE_KEY = 'saged_shared_state_v2';

const SharedState = {
  _data: null,
  _listeners: [],

  _defaults() {
    return {
      menus: [
        { id: 'menu-jun-reg',   nome: 'Cardápio Junho/2026 — Regular',  periodo: '01/06 a 30/06', escolas: 152, status: 'Publicado',    tipo: 'Regular',  autor: 'Dra. Lilian Droppa', criadoEm: '2026-05-25' },
        { id: 'menu-jun-int',   nome: 'Cardápio Junho/2026 — Integral', periodo: '01/06 a 30/06', escolas: 31,  status: 'Publicado',    tipo: 'Integral', autor: 'Dra. Lilian Droppa', criadoEm: '2026-05-25' },
        { id: 'menu-jul-reg',   nome: 'Cardápio Julho/2026 — Regular',  periodo: '01/07 a 31/07', escolas: 0,   status: 'Em Elaboração', tipo: 'Regular', autor: 'Dra. Lilian Droppa', criadoEm: '2026-06-18' },
      ],
      weeklyMenus: [],   // { id, semana, escola|'REDE', refeicoes:[{dia,tipo,item,kcal}], kcalMedia, publicadoEm, autor }
      fichas: [],        // fichas criadas em runtime (as demo ficam em _FICHAS_DEMO)
      orders: [],        // pedidos criados pela escola em runtime
      deliveries: [],    // eventos de entrega (status, confirmação, foto, assinatura)
      incidents: [],     // ocorrências do motorista
      productions: [],   // atualizações de produção do agricultor
      stockAdjust: [],   // ajustes de estoque (audit-log de movimentações)
      // ── FINANCEIRO / CONTRATOS (v2.1.0) ──
      atas2: [],            // Atas de Registro de Preços (do Supabase)
      empenhos2: [],        // Empenhos SIAFI (do Supabase)
      os_estoque_central: [], // OS do Almoxarifado Central
      lista_compras: [],    // Listas de compras por escola
      os_fornecedores: [],  // OS para cooperativas e agricultores
      // ── LOGÍSTICA / CONTÁBIL (legacy — empenhos locais) ──
      empenhos: [
        // Seed: 2 empenhos vinculados às atas existentes em DATA.contracts
        { id: 'emp-2026-045', numero: 'EMP-2026/045', ataId: 1, ataNumero: 'ATA-2026/001', produto: 'Arroz Tipo 1',    unidade: 'kg', qtdTotal: 5000, qtdConsumida: 0, valorUnit: 6.20, status: 'Ativo', criadoEm: '2026-06-10' },
        { id: 'emp-2026-046', numero: 'EMP-2026/046', ataId: 1, ataNumero: 'ATA-2026/001', produto: 'Feijão Carioca',  unidade: 'kg', qtdTotal: 2000, qtdConsumida: 0, valorUnit: 9.80, status: 'Ativo', criadoEm: '2026-06-10' },
        { id: 'emp-2026-102', numero: 'EMP-2026/102', ataId: 2, ataNumero: 'ATA-2026/002', produto: 'Leite Integral',  unidade: 'L',  qtdTotal: 3000, qtdConsumida: 0, valorUnit: 5.10, status: 'Ativo', criadoEm: '2026-06-22' },
      ],
      nfsRecebidas: [], // { id, empenhoId, numero, qtd, dataRec, validade, ateste, lote }
      schoolStocks: {}, // { [escolaName]: { [produto]: { qtd, unidade, ultimaEntrada } } }
      centralStock: {}, // Estoque do Estoque Central (por produto)
      consumo: [],      // { id, escola, produto, qtd, unidade, refeicao, data, responsavel }
      restricoes: [
        { id: 'restr-101', schoolId: 1, schoolName: 'EM ADV. DEMOSTHENES MARTINS', tipo: 'Intolerância à lactose', quantidade: 12, observacao: 'Laudo médico pré-escola e EF1', status: 'ativo', registradoPor: 'Dra. Lilian Droppa', criadoEm: '2026-06-15' },
        { id: 'restr-102', schoolId: 1, schoolName: 'EM ADV. DEMOSTHENES MARTINS', tipo: 'Doença celíaca', quantidade: 4, observacao: 'Sem glúten estrito (cantina separada)', status: 'ativo', registradoPor: 'Dra. Lilian Droppa', criadoEm: '2026-06-18' },
        { id: 'restr-103', schoolId: 2, schoolName: 'EM PROF. ANTÔNIO LOPES LINS', tipo: 'Diabetes', quantidade: 4, observacao: 'Controle de açúcares', status: 'ativo', registradoPor: 'Dra. Lilian Droppa', criadoEm: '2026-06-20' },
        { id: 'restr-104', schoolId: 2, schoolName: 'EM PROF. ANTÔNIO LOPES LINS', tipo: 'Vegetariano/Vegano', quantidade: 2, observacao: 'Substituição de proteína animal', status: 'ativo', registradoPor: 'Dra. Lilian Droppa', criadoEm: '2026-06-22' },
        { id: 'restr-105', schoolId: 3, schoolName: 'EMRTI AGRICOLA GOVERNADOR ARNALDO ESTEVAO DE FIGUEREDO', tipo: 'Doença celíaca', quantidade: 14, observacao: 'Dieta celíaca PNAE', status: 'ativo', registradoPor: 'Dra. Lilian Droppa', criadoEm: '2026-06-25' },
        { id: 'restr-106', schoolId: 3, schoolName: 'EMRTI AGRICOLA GOVERNADOR ARNALDO ESTEVAO DE FIGUEREDO', tipo: 'Intolerância à lactose', quantidade: 28, observacao: 'Zero lactose', status: 'ativo', registradoPor: 'Dra. Lilian Droppa', criadoEm: '2026-06-26' },
        { id: 'restr-107', schoolId: 4, schoolName: 'EMTI PROFª IRACEMA MARIA VICENTE', tipo: 'Doença celíaca', quantidade: 30, observacao: 'Alunos tempo integral', status: 'ativo', registradoPor: 'Dra. Lilian Droppa', criadoEm: '2026-07-01' },
        { id: 'restr-108', schoolId: 4, schoolName: 'EMTI PROFª IRACEMA MARIA VICENTE', tipo: 'Intolerância à lactose', quantidade: 72, observacao: 'Demanda de leite vegetal/zero lactose', status: 'ativo', registradoPor: 'Dra. Lilian Droppa', criadoEm: '2026-07-02' },
      ],
      alunosEspeciais: [
        { id: 'aluno-101', nome: 'Matheus Henrique Silva', escola: 'EM ADV. DEMOSTHENES MARTINS', turma: 'Creche II-B', dataNascimento: '2024-09-12', restricao: 'Intolerância à lactose', laudo: 'Laudo Dr. Carlos Rossi - CRM 4521', registradoEm: '2026-02-10' },
        { id: 'aluno-102', nome: 'Sophia Victoria Oliveira', escola: 'EM ADV. DEMOSTHENES MARTINS', turma: 'EF 3º Ano A', dataNascimento: '2018-04-20', restricao: 'Doença celíaca', laudo: 'Laudo Dra. Ana Lima - CRM 8821', registradoEm: '2026-03-05' },
        { id: 'aluno-103', nome: 'Gabriel Souza Santos', escola: 'EM PROF. ANTÔNIO LOPES LINS', turma: 'EF 5º Ano C', dataNascimento: '2016-11-15', restricao: 'Diabetes', laudo: 'Laudo Dr. Roberto Mello', registradoEm: '2026-03-12' },
        { id: 'aluno-104', nome: 'Enzo Gabriel Santos', escola: 'EMRTI AGRICOLA GOVERNADOR ARNALDO ESTEVAO DE FIGUEREDO', turma: 'Berçário I', dataNascimento: '2025-01-10', restricao: 'Intolerância à lactose', laudo: 'Laudo Dra. Juliana - CRM 9012', registradoEm: '2026-04-01' }
      ],
      lastEventAt: null,
    };
  },

  init() {
    try {
      const raw = localStorage.getItem(SHARED_STATE_KEY);
      if (raw) {
        this._data = JSON.parse(raw);
        // Garante que campos novos existam se o schema for atualizado
        const defs = this._defaults();
        for (const k of Object.keys(defs)) {
          if (!(k in this._data) || (Array.isArray(defs[k]) && defs[k].length > 0 && (!this._data[k] || this._data[k].length === 0))) {
            this._data[k] = defs[k];
          }
        }
      } else {
        this._data = this._defaults();
        this._persist();
      }
    } catch (e) {
      console.warn('[SharedState] Falha ao carregar; usando defaults.', e);
      this._data = this._defaults();
    }

    // Sincroniza entre abas do navegador: se outra aba mudou o estado,
    // recarrega e re-renderiza a página atual do perfil ativo.
    window.addEventListener('storage', (ev) => {
      if (ev.key === SHARED_STATE_KEY && ev.newValue) {
        try {
          this._data = JSON.parse(ev.newValue);
          this._emit('external');
          if (typeof renderPage === 'function' && state.currentPage) {
            renderSidebar && renderSidebar();
            renderPage();
          }
        } catch {}
      }
    });
  },

  _persist() {
    try {
      this._data.lastEventAt = new Date().toISOString();
      localStorage.setItem(SHARED_STATE_KEY, JSON.stringify(this._data));
    } catch (e) {
      console.warn('[SharedState] Falha ao persistir.', e);
    }
  },

  _emit(event) {
    this._listeners.forEach(fn => { try { fn(event, this._data); } catch {} });
  },

  _notify(event) {
    this._emit(event || 'change');
  },

  onChange(fn) { this._listeners.push(fn); return () => { this._listeners = this._listeners.filter(f => f !== fn); }; },

  // Leitores & Aliases de compatibilidade
  getMenus()       { return [...(this._data.menus || [])]; },
  getMenu()        { return this.getMenus(); },
  getCardapios()   { return this.getMenus(); },
  getWeeklyMenus() { return [...(this._data.weeklyMenus || [])]; },
  getFichas()      { return [...(this._data.fichas || [])]; },
  getFicha()       { return this.getFichas(); },
  getOrder()       { return this.getOrders(); },
  getProduction()  { return this.getProductions(); },
  getDelivery()    { return this.getDeliveries(); },
  getIncident()    { return this.getIncidents(); },
  getOrders()      { 
    const ords = this._data.orders || [];
    ords.forEach(o => { 
      if (!o.school && o.escola) o.school = o.escola; 
      if (!o.escola && o.school) o.escola = o.school;
      if (!o.escola_name) o.escola_name = o.school || o.escola;
      if (!o.cooperative && o.cooperativa) o.cooperative = o.cooperativa;
      if (!o.cooperativa && o.cooperative) o.cooperativa = o.cooperative;
      if (!o.schoolId && o.school && typeof DATA !== 'undefined' && DATA.schools) {
        const sc = DATA.schools.find(s => s.name === o.school);
        if (sc) o.schoolId = sc.id;
      }
      if (!o.criadoPorUserId) o.criadoPorUserId = o.solicitante === 'Gestor SEMED' ? 'USR-GESTOR-001' : 'USR-ESCOLA-001';

      // Normalização de Itens Internos (Fix C3/A5 & NOVO 1)
      const rawItens = o.itens || o.items || [];
      o.itens = rawItens.map(i => {
        const prod = i.produto || i.name || i.descricao || 'Gênero Alimentício';
        const un = i.unidade || i.unit || 'kg';
        const qtd = parseFloat(i.quantidade || i.qtd || i.quantity || 0);
        const pUnit = parseFloat(i.valorUnit || i.unitPrice || i.preco_unitario || 0);
        const pTot = parseFloat(i.valorTotal || i.subtotal || 0) || (qtd * pUnit);
        return {
          id: i.id || 'item-' + (i.productId || crypto.randomUUID()),
          produto: prod,
          name: prod,
          descricao: prod,
          unidade: un,
          unit: un,
          quantidade: qtd,
          qtd: qtd,
          valorUnit: pUnit,
          unitPrice: pUnit,
          valorTotal: pTot
        };
      });
      o.items = o.itens;
    });
    return [...ords]; 
  },
  getDeliveries()  { 
    if ((!this._data.deliveries || this._data.deliveries.length === 0) && typeof DATA !== 'undefined' && DATA.deliveries) {
      this._data.deliveries = [...DATA.deliveries];
    }
    const dels = this._data.deliveries || [];
    dels.forEach(d => {
      if (!d.schoolId && d.school && typeof DATA !== 'undefined' && DATA.schools) {
        const sc = DATA.schools.find(s => s.name === d.school);
        if (sc) d.schoolId = sc.id;
      }
      if (!d.criadoPorUserId) d.criadoPorUserId = 'USR-MOTORISTA-001'; // Maioria gerida/confirmada pelo motorista ou sistema
    });
    return [...dels]; 
  },
  getIncidents()   { 
    const incs = this._data.incidents || [];
    incs.forEach(i => {
      if (!i.schoolId && (i.escola || i.school) && typeof DATA !== 'undefined' && DATA.schools) {
        const sc = DATA.schools.find(s => s.name === (i.escola || i.school));
        if (sc) i.schoolId = sc.id;
      }
      if (!i.criadoPorUserId) i.criadoPorUserId = i.motorista ? 'USR-MOTORISTA-001' : 'USR-ESCOLA-001';
    });
    return [...incs]; 
  },
  getProductions() { return [...(this._data.productions || [])]; },
  getStockAdjust() { return [...(this._data.stockAdjust || [])]; },
  getEmpenhos()    { return [...(this._data.empenhos || [])]; },
  getEmpenho(id)   { return (this._data.empenhos || []).find(e => e.id === id) || null; },
  getEmpenhosByAta(ataId) { return (this._data.empenhos || []).filter(e => e.ataId === ataId); },
  getNFs()         { return [...(this._data.nfsRecebidas || [])]; },
  getNFsByEmpenho(empenhoId) { return (this._data.nfsRecebidas || []).filter(n => n.empenhoId === empenhoId); },
  // ── Getters v2.1.0 (dados do Supabase com fallback automático simulado PNAE 2026) ──
  getAtas2() {
    if ((!this._data.atas2 || this._data.atas2.length === 0) && typeof DATA !== 'undefined' && DATA.contracts && DATA.contracts.length > 0) {
      this._data.atas2 = DATA.contracts.map(c => ({
        id: c.id,
        numero: c.number,
        numero_ata: c.number,
        tipo: c.modalidade === 'chamada_publica' ? 'Chamada Pública (AF)' : 'Pregão Eletrônico',
        fornecedor: c.supplier,
        valor_global: c.globalValue,
        valor_executado: c.executedValue,
        data_inicio: c.start,
        data_fim: c.end,
        status: c.status,
        itens: (DATA.ataProducts || []).filter(ap => ap.ataId === c.id)
      }));
      this._persist();
    }
    return [...(this._data.atas2 || [])];
  },
  getEmpenhos2() {
    if (!this._data.empenhos2 || this._data.empenhos2.length === 0) {
      this._data.empenhos2 = [
        { id: 'emp-101', numero_empenho: '2026NE00477', ata_numero: 'ATA-2026/031', tipo: 'Conv.', fornecedor: 'NUTRI ALIMENTOS DISTRIBUIDORA LTDA', escola_name: 'SEMED Global', valor_empenhado: 360000.00, valor_liquidado: 360000.00, valor_pago: 360000.00, data_empenho: '2026-06-01', status: 'Liquidado' },
        { id: 'emp-102', numero_empenho: '2026NE00478', ata_numero: 'ATA-2026/031', tipo: 'Conv.', fornecedor: 'NUTRI ALIMENTOS DISTRIBUIDORA LTDA', escola_name: 'SEMED Global', valor_empenhado: 297663.00, valor_liquidado: 150000.00, valor_pago: 150000.00, data_empenho: '2026-06-02', status: 'Emitido' },
        { id: 'emp-103', numero_empenho: '2026NE00489', ata_numero: 'ATA-2026/001', tipo: 'AF',    fornecedor: 'COOPAGRAN', escola_name: 'SEMED Global', valor_empenhado: 141858.00, valor_liquidado: 141858.00, valor_pago: 141858.00, data_empenho: '2026-06-05', status: 'Liquidado' },
        { id: 'emp-104', numero_empenho: '2026NE00501', ata_numero: 'ATA-2026/042', tipo: 'Conv.', fornecedor: 'AVINORTE DISTRIBUIDORA DE AVES LTDA', escola_name: 'SEMED Global', valor_empenhado: 205500.00, valor_liquidado: 100000.00, valor_pago: 100000.00, data_empenho: '2026-06-10', status: 'Emitido' },
        { id: 'emp-105', numero_empenho: '2026NE00512', ata_numero: 'ATA-2026/018', tipo: 'Conv.', fornecedor: 'POLARIS COMÉRCIO DE ALIMENTOS LTDA', escola_name: 'SEMED Global', valor_empenhado: 342020.00, valor_liquidado: 342020.00, valor_pago: 342020.00, data_empenho: '2026-06-12', status: 'Liquidado' },
        { id: 'emp-106', numero_empenho: '2026NE00513', ata_numero: 'ATA-2026/018', tipo: 'Conv.', fornecedor: 'POLARIS COMÉRCIO DE ALIMENTOS LTDA', escola_name: 'SEMED Global', valor_empenhado: 448500.00, valor_liquidado: 200000.00, valor_pago: 200000.00, data_empenho: '2026-06-15', status: 'Emitido' },
        { id: 'emp-107', numero_empenho: '2026NE00524', ata_numero: 'ATA-2026/002', tipo: 'AF',    fornecedor: 'COOPRAN / COOPAERGS', escola_name: 'SEMED Global', valor_empenhado: 108097.00, valor_liquidado: 108097.00, valor_pago: 108097.00, data_empenho: '2026-06-20', status: 'Liquidado' },
        { id: 'emp-108', numero_empenho: '2026NE00525', ata_numero: 'ATA-2026/002', tipo: 'AF',    fornecedor: 'COOPRAN / COOPAERGS', escola_name: 'SEMED Global', valor_empenhado: 82992.00,  valor_liquidado: 0.00,      valor_pago: 0.00,      data_empenho: '2026-06-22', status: 'Emitido' },
        { id: 'emp-109', numero_empenho: '2026NE00526', ata_numero: 'ATA-2026/002', tipo: 'AF',    fornecedor: 'COOPRAN / COOPAERGS', escola_name: 'SEMED Global', valor_empenhado: 102250.00, valor_liquidado: 50000.00,  valor_pago: 50000.00,  data_empenho: '2026-06-25', status: 'Emitido' },
        { id: 'emp-110', numero_empenho: '2026NE00531', ata_numero: 'ATA-2026/001', tipo: 'AF',    fornecedor: 'COOPAGRAN', escola_name: 'SEMED Global', valor_empenhado: 90000.00,   valor_liquidado: 0.00,      valor_pago: 0.00,      data_empenho: '2026-06-28', status: 'Emitido' },
      ];
      this._persist();
    }
    return [...(this._data.empenhos2 || [])];
  },
  addAta2(ata) {
    const a = {
      id: 'ata-' + crypto.randomUUID(),
      data_inicio: new Date().toISOString().slice(0,10),
      data_fim: new Date(Date.now() + 365*24*60*60*1000).toISOString().slice(0,10),
      valor_executado: 0,
      status: 'Vigente',
      ...ata
    };
    (this._data.atas2 = this._data.atas2 || []).unshift(a);
    this._persist(); this._emit('ata:add');
    return a;
  },
  addEmpenho2(empenho) {
    const e = {
      id: 'emp-' + crypto.randomUUID(),
      data_empenho: new Date().toISOString().slice(0,10),
      valor_liquidado: 0,
      valor_pago: 0,
      status: 'Emitido',
      ...empenho
    };
    (this._data.empenhos2 = this._data.empenhos2 || []).unshift(e);
    this._persist(); this._emit('empenho:add');
    return e;
  },
  addOsEstoqueCentral(os) {
    const o = {
      id: 'os-cent-' + crypto.randomUUID(),
      numero_os: 'OS-CENT-' + String(Math.floor(100 + Math.random() * 900)),
      data_programada: new Date().toISOString().slice(0, 10),
      status: 'Pendente',
      ...os
    };
    (this._data.os_estoque_central = this._data.os_estoque_central || []).unshift(o);
    this._persist(); this._emit('os_central:add');
    return o;
  },
  addOsFornecedores(os) {
    const o = {
      id: 'os-forn-' + crypto.randomUUID(),
      numero_os: 'OS-FORN-' + String(Math.floor(100 + Math.random() * 900)),
      data_emissao: new Date().toISOString().slice(0, 10),
      status: 'Emitida',
      ...os
    };
    (this._data.os_fornecedores = this._data.os_fornecedores || []).unshift(o);
    this._persist(); this._emit('os_fornecedores:add');
    return o;
  },
  getOsEstoqueCentral(tipo) { const all = this._data.os_estoque_central || []; return tipo ? all.filter(o => o.tipo === tipo) : [...all]; },
  registrarLogAuditoria(log) {
    const entry = {
      id: 'audit-' + crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      usuario: log.usuario || 'Gestor SEMED',
      acao: log.acao || 'Movimentação',
      produto: log.produto || '—',
      quantidade: log.quantidade || 0,
      origem: log.origem || 'Demanda Cardápio',
      destino: log.destino || 'Estoque Central',
      motivo: log.motivo || 'Atendimento de Demanda',
      ...log
    };
    (this._data.audit_log = this._data.audit_log || []).unshift(entry);
    this._persist();
    return entry;
  },
  getLogsAuditoria() {
    return [...(this._data.audit_log || [])];
  },

  getListaCompras(escoId) { const all = this._data.lista_compras || []; return escoId ? all.filter(l => l.escola_id === escoId) : [...all]; },
  getOsFornecedores(status) { const all = this._data.os_fornecedores || []; return status ? all.filter(o => o.status === status) : [...all]; },
  addGuiaEntrega(guia) {
    this._data.guiaSeq = (this._data.guiaSeq || 0) + 1;
    const g = {
      id: 'guia-' + crypto.randomUUID(),
      numeroGuia: `GUIA-2026/${String(this._data.guiaSeq).padStart(4, '0')}`,
      status: 'Pendente de Emissão',
      criadoEm: new Date().toISOString(),
      ...guia
    };
    (this._data.guiasEntrega = this._data.guiasEntrega || []).unshift(g);
    this._persist(); this._emit('guia:add');
    return g;
  },
  getGuiasEntrega(filtro) {
    const all = this._data.guiasEntrega || [];
    if (!filtro) return [...all];
    return all.filter(g =>
      (!filtro.escolaId || String(g.escolaId) === String(filtro.escolaId)) &&
      (!filtro.colaborador || g.entregador === filtro.colaborador) &&
      (!filtro.produto || (g.produtos || []).some(p => p.produto === filtro.produto))
    );
  },
  marcarGuiaEmitida(guiaId) {
    const g = (this._data.guiasEntrega || []).find(x => x.id === guiaId);
    if (!g) return null;
    g.status = 'Emitida';
    g.dataEmissao = new Date().toISOString();
    if (g.osFornecedorId) {
      const osf = (this._data.os_fornecedores || []).find(o => o.id === g.osFornecedorId);
      if (osf) osf.guia_protocolo = g.numeroGuia;
    }
    this._persist(); this._emit('guia:emitida');
    return g;
  },
  getSchoolStock(school) {
    const s = (this._data.schoolStocks || {})[school] || {};
    return Object.entries(s).map(([produto, info]) => ({ produto, ...info }));
  },
  getSchoolStockItem(school, produto) {
    return ((this._data.schoolStocks || {})[school] || {})[produto] || null;
  },
  getCentralStock() {
    if ((!this._data.centralStock || Object.keys(this._data.centralStock).length === 0) && typeof DATA !== 'undefined' && DATA.centralStock) {
      this._data.centralStock = { ...DATA.centralStock };
    }
    return Object.entries(this._data.centralStock || {}).map(([produto, info]) => ({ produto, ...info }));
  },
  getConsumo(escola) {
    const all = this._data.consumo || [];
    return escola ? all.filter(c => c.escola === escola) : [...all];
  },
  getRestricoes(schoolIdOrName) {
    const all = this._data.restricoes || [];
    if (!schoolIdOrName) return [...all];
    return all.filter(r => 
      r.schoolId == schoolIdOrName || 
      (r.schoolName && typeof schoolIdOrName === 'string' && r.schoolName.toLowerCase().includes(schoolIdOrName.toLowerCase()))
    );
  },
  getAlunosEspeciais(escolaNameOrId) {
    const all = this._data.alunosEspeciais || [];
    if (!escolaNameOrId) return [...all];
    return all.filter(a => {
      if (typeof escolaNameOrId === 'number' || (!isNaN(Number(escolaNameOrId)) && typeof escolaNameOrId !== 'string')) {
        if (a.schoolId == escolaNameOrId) return true;
      }
      return a.escola && typeof escolaNameOrId === 'string' && (a.escola === escolaNameOrId || a.escola.toLowerCase().includes(escolaNameOrId.toLowerCase()));
    });
  },
  addAlunoEspecial(aluno) {
    const a = { id: 'aluno-' + crypto.randomUUID(), registradoEm: new Date().toISOString().slice(0, 10), ...aluno };
    (this._data.alunosEspeciais = this._data.alunosEspeciais || []).unshift(a);
    this._persist(); this._emit('aluno:add'); return a;
  },
  deleteAlunoEspecial(id) {
    this._data.alunosEspeciais = (this._data.alunosEspeciais || []).filter(a => a.id !== id);
    this._persist(); this._emit('aluno:delete');
  },

  addRestricao(restricao) {
    const usr = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].userId : null;
    const r = { id: 'restr-' + crypto.randomUUID(), criadoEm: new Date().toISOString(), status: 'ativo', notificado: false, criadoPorUserId: usr, ...restricao };
    (this._data.restricoes = this._data.restricoes || []).unshift(r);
    this._persist(); this._emit('restricao:add');
    if (window.DB && typeof window.DB.saveRestricao === 'function') {
      window.DB.saveRestricao({
        school_id: r.schoolId, tipo: r.tipo, quantidade: r.quantidade,
        observacao: r.observacao, status: r.status, registrado_por: r.registradoPor,
      });
    }
    return r;
  },

  resolverRestricao(id) {
    const r = (this._data.restricoes || []).find(x => x.id === id);
    if (r) { r.status = 'resolvido'; r.resolvidoEm = new Date().toISOString(); }
    this._persist(); this._emit('restricao:resolve');
    const dbId = id.startsWith('db-') ? parseInt(id.replace('db-',''),10) : null;
    if (dbId && window.DB && typeof window.DB.resolverRestricao === 'function') {
      window.DB.resolverRestricao(dbId);
    }
    return r;
  },

  // Contadores para badges do menu lateral
  countPendingOrders(filter) {
    return (this._data.orders || []).filter(o => o.status === 'Pendente' && (!filter || filter(o))).length;
  },
  countActiveDeliveries(filter) {
    return (this._data.deliveries || []).filter(d => d.status !== 'Confirmada' && d.status !== 'Recebida' && (!filter || filter(d))).length;
  },

  // Escritores — cada ação notifica os assinantes e persiste
  addMenu(menu) {
    const usr = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].userId : 'ID-002';
    const seq = String(Math.floor(100 + Math.random() * 900));
    const cod = menu.codigoCardapio || `CARD-2026/08-${seq}`;
    const m = {
      id: 'menu-' + crypto.randomUUID(),
      codigoCardapio: cod,
      status: 'Em Elaboração',
      criadoEm: new Date().toISOString().slice(0,10),
      criadoPorUserId: usr,
      ...menu
    };
    this._data.menus.unshift(m);
    this._persist(); this._emit('menu:add');
    return m;
  },
  addWeeklyMenu(weekly) {
    const usr = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].userId : null;
    const w = { id: 'wk-' + crypto.randomUUID(), publicadoEm: new Date().toISOString(), criadoPorUserId: usr, ...weekly };
    this._data.weeklyMenus.unshift(w);
    this._persist(); this._emit('weeklyMenu:add');
    return w;
  },
  deleteMenu(id) {
    this._data.menus = (this._data.menus || []).filter(m => m.id !== id);
    this._persist(); this._emit('menu:delete');
  },
  deleteWeeklyMenu(id) {
    this._data.weeklyMenus = (this._data.weeklyMenus || []).filter(w => w.id !== id);
    // Também remove do localStorage legado
    const legacy = JSON.parse(localStorage.getItem('cardapios_publicados') || '[]');
    const idx = parseInt(String(id).replace('legacy-', ''));
    if (!isNaN(idx) && idx >= 0 && idx < legacy.length) {
      legacy.splice(idx, 1);
      localStorage.setItem('cardapios_publicados', JSON.stringify(legacy));
    }
    this._persist(); this._emit('weeklyMenu:delete');
  },
  updateMenu(id, patch) {
    const m = (this._data.menus || []).find(x => x.id === id);
    if (m) { Object.assign(m, patch); this._persist(); this._emit('menu:update'); }
    return m || null;
  },
  updateWeeklyMenu(id, patch) {
    const w = (this._data.weeklyMenus || []).find(x => x.id === id);
    if (w) { Object.assign(w, patch); this._persist(); this._emit('weeklyMenu:update'); }
    return w || null;
  },
  addFicha(ficha) {
    const usr = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].userId : null;
    const f = { id: 'ficha-' + crypto.randomUUID(), criadoEm: new Date().toISOString().slice(0,10), criadoPorUserId: usr, ...ficha };
    this._data.fichas.unshift(f);
    this._persist(); this._emit('ficha:add');
    return f;
  },
  addProduction(prod) {
    const usr = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].userId : null;
    const p = { id: 'prod-' + crypto.randomUUID(), criadoEm: new Date().toISOString(), status: 'Ativo', criadoPorUserId: usr, ...prod };
    this._data.productions = this._data.productions || [];
    this._data.productions.unshift(p);
    this._persist(); this._emit('production:add');
    return p;
  },
  addOrder(order) {
    const usr = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].userId : null;
    const nextNum = ((this._data.orders[0]?.numero) || 100) + 1;
    let finalSchool = order.school || order.escola;
    let finalCoop = order.cooperative || order.coop || 'COOPAGRAN';
    let finalItens = order.itens || order.items || [];
    let finalId = order.schoolId || (typeof DATA !== 'undefined' && DATA.schools ? (DATA.schools.find(s => s.name === finalSchool)?.id || null) : null);
    const o = {
      id: 'ord-' + crypto.randomUUID(),
      numero: nextNum,
      date: new Date().toISOString().slice(0,10),
      status: 'Pendente',
      value: order.value || 0,
      cooperative: finalCoop,
      criadoPorUserId: usr,
      ...order,
      school: finalSchool,
      schoolId: finalId,
      itens: finalItens,
      items: finalItens,
    };
    this._data.orders.unshift(o);
    // Cria automaticamente um registro de entrega vinculado para acompanhamento
    this._data.deliveries.unshift({
      id: 'del-' + crypto.randomUUID(),
      orderId: o.id,
      orderNumero: o.numero,
      school: o.school,
      schoolId: o.schoolId,
      date: o.date,
      status: 'Pendente',
      criadoEm: new Date().toISOString()
    });
    this._persist(); this._emit('order:add');
    return o;
  },
  // Atribui itens do pedido aos agricultores conforme produção disponível
  distributeOrderToFarmers(orderId) {
    const o = this._data.orders.find(x => x.id === orderId);
    if (!o) return null;
    const producoes = this._data.productions || [];
    const distribuicao = [];
    (o.itens || []).forEach(item => {
      // Prioriza agricultor com maior disponibilidade do produto
      const cand = producoes.filter(p => (p.produto || '').toLowerCase().includes((item.produto || '').toLowerCase().split(' ')[0]))
                            .sort((a, b) => (b.disponivel || 0) - (a.disponivel || 0));
      if (cand.length > 0) {
        distribuicao.push({ agricultor: cand[0].agricultor, produto: item.produto, qtd: item.qtd, unidade: item.unidade });
      } else {
        // fallback: primeiro agricultor da cooperativa
        distribuicao.push({ agricultor: 'A definir', produto: item.produto, qtd: item.qtd, unidade: item.unidade });
      }
    });
    o.distribuicao = distribuicao;
    this._persist(); this._emit('order:distribute');
    return distribuicao;
  },

  updateOrderStatus(orderId, status, extra) {
    const o = this._data.orders.find(x => x.id === orderId);
    if (!o) return null;
    o.status = status;
    if (extra) Object.assign(o, extra);
    // Sincroniza a delivery vinculada
    const d = this._data.deliveries.find(x => x.orderId === orderId);
    if (d) {
      d.status = status === 'Entregue' ? 'Confirmada' : (status === 'Em transporte' ? 'Em Transporte' : (status === 'Em separação' ? 'Em Separação' : d.status));
      d.timeline = d.timeline || [];
      d.timeline.push({ at: new Date().toISOString(), evento: 'Status: ' + status });
    }
    this._persist(); this._emit('order:update');
    return o;
  },

  // ──────────────────────────────────────────────────────────────────
  // R1 — MOTOR DE TRIAGEM CONTRATUAL
  // Verifica cada item do pedido contra ATAs e Empenhos disponíveis.
  // Retorna { ataItems, empenhoGeradoItems, semAtaItems }
  // ──────────────────────────────────────────────────────────────────
  processarPedido(orderId) {
    const order = this._data.orders.find(x => x.id === orderId);
    if (!order) return null;

    const atas = this._data.atas2 || [];
    const empenhos = this._data.empenhos2 || [];

    // Produtos com cobertura local (legado) — fallback para demo sem Supabase
    const legacyAtas = this._data.empenhos || [];

    const ataItems = [];       // tem ATA + Empenho ativo → gera OS
    const empenhoGeradoItems = []; // tem ATA mas sem Empenho → cria empenho → gera OS
    const semAtaItems = [];    // sem ATA → vai para Lista de Compras

    (order.itens || []).forEach(item => {
      const nomeProd = (item.produto || '').toLowerCase();

      // Tenta encontrar ATA vigente que contenha o produto nos itens JSONB
      const ataMatch = atas.find(a =>
        a.status === 'Vigente' &&
        Array.isArray(a.itens) &&
        a.itens.some(ai =>
          (ai.descricao || ai.produto || '').toLowerCase().includes(nomeProd.split(' ')[0])
        )
      );

      if (ataMatch) {
        const ataRef = { numero: ataMatch.numero || `ATA-${ataMatch.id}`, id: ataMatch.id };
        const empMatch = empenhos.find(e =>
          (e.ata_numero === ataRef.numero || e.ataId === ataRef.id) &&
          (e.produto || '').toLowerCase().includes(nomeProd.split(' ')[0]) &&
          e.status !== 'Cancelado'
        );

        if (empMatch) {
          ataItems.push({
            ...item,
            ataNumero: ataRef.numero,
            empenhoNumero: empMatch.numero_empenho || empMatch.numero || 'EMP-LOCAL',
            empenhoId: empMatch.id,
            resultado: 'Vinculado à Ata/Empenho',
          });
        } else {
          const novoEmp = {
            id: 'emp-auto-' + crypto.randomUUID(),
            numero_empenho: 'EMP-AUTO-' + crypto.randomUUID().slice(0,8).toUpperCase(),
            ata_numero: ataRef.numero,
            ataId: ataRef.id,
            produto: item.produto,
            valor_empenhado: (item.qtd || 0) * 12,
            valor_liquidado: 0,
            valor_pago: 0,
            status: 'Emitido',
            data_empenho: new Date().toISOString().slice(0, 10),
            escola_name: order.school,
            fornecedor: ataMatch ? ataMatch.fornecedor : 'A definir',
            tipo: 'AF',
          };
          (this._data.empenhos2 = this._data.empenhos2 || []).unshift(novoEmp);
          empenhoGeradoItems.push({
            ...item,
            ataNumero: ataRef.numero,
            empenhoNumero: novoEmp.numero_empenho,
            empenhoId: novoEmp.id,
            resultado: 'Empenho Gerado',
          });
        }
      } else {
        semAtaItems.push({ ...item, resultado: 'Sem Ata' });
      }
    });

    return { order, ataItems, empenhoGeradoItems, semAtaItems };
  },

  // Aplica o resultado da triagem: gera OS + lista de compras, muda status
  aceitarPedido(orderId, resultado) {
    const { order, ataItems, empenhoGeradoItems, semAtaItems } = resultado;
    const itensComOS = [...ataItems, ...empenhoGeradoItems];
    const now = new Date().toISOString();

    // 1. Gera Ordem de Serviço de separação (vai para Estoque Central)
    if (itensComOS.length > 0) {
      const os = {
        id: 'os-auto-' + crypto.randomUUID(),
        numero_os: 'OS-AUTO-' + crypto.randomUUID().slice(0,8).toUpperCase(),
        tipo: 'Saída',
        origem: 'Pedido Escola #' + String(order.numero).padStart(3, '0'),
        pedidoId: order.id,
        escola_destino: order.school,
        status: 'Pendente',
        responsavel: 'Gestor SEMED',
        data_programada: new Date().toISOString().slice(0, 10),
        itens: itensComOS.map(i => ({
          produto: i.produto,
          quantidade: i.qtd,
          unidade: i.unidade,
          ataNumero: i.ataNumero,
          empenhoNumero: i.empenhoNumero,
        })),
        // Para compatibilidade com a tabela de separação existente (campo produto/unidade/quantidade)
        produto: itensComOS.map(i => i.produto).join(', '),
        quantidade: itensComOS.reduce((s, i) => s + (i.qtd || 0), 0),
        unidade: itensComOS[0]?.unidade || 'kg',
        criadoEm: now,
      };
      (this._data.os_estoque_central = this._data.os_estoque_central || []).unshift(os);
    }

    // 2. Envia itens sem ATA para Lista de Compras
    if (semAtaItems.length > 0) {
      const lc = {
        id: 'lc-auto-' + crypto.randomUUID(),      tipo: 'Saída',
        origem: 'Pedido Escola #' + String(order.numero).padStart(3, '0'),
        pedidoId: order.id,
        escola_destino: order.school,
        status: 'Pendente',
        responsavel: 'Gestor SEMED',
        data_programada: new Date().toISOString().slice(0, 10),
        itens: itensComOS.map(i => ({
          produto: i.produto,
          quantidade: i.qtd,
          unidade: i.unidade,
          ataNumero: i.ataNumero,
          empenhoNumero: i.empenhoNumero,
        })),
        // Para compatibilidade com a tabela de separação existente (campo produto/unidade/quantidade)
        produto: itensComOS.map(i => i.produto).join(', '),
        quantidade: itensComOS.reduce((s, i) => s + (i.qtd || 0), 0),
        unidade: itensComOS[0]?.unidade || 'kg',
        criadoEm: now,
      };
      (this._data.os_estoque_central = this._data.os_estoque_central || []).unshift(os);
    }

    // 2. Envia itens sem ATA para Lista de Compras
    if (semAtaItems.length > 0) {
      const lc = {
        id: 'lc-auto-' + Date.now(),
        titulo: 'Lista Automática — Pedido #' + String(order.numero).padStart(3, '0') + ' · ' + order.school,
        tipo: 'Automática',
        referencia: 'Pedido #' + String(order.numero).padStart(3, '0'),
        escola_name: order.school,
        escola_id: order.schoolId || null,
        status: 'Enviada',
        criado_por: 'Motor de Triagem SUALE',
        data_necessidade: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        itens: semAtaItems.map(i => ({ produto: i.produto, qtd: i.qtd, unidade: i.unidade })),
        valor_estimado: semAtaItems.reduce((s, i) => s + (i.qtd || 0) * 12, 0),
        valor_aprovado: null,
        criadoEm: now,
      };
      (this._data.lista_compras = this._data.lista_compras || []).unshift(lc);
    }

    // 3. Atualiza status do pedido
    this.updateOrderStatus(orderId, 'Em separação', {
      processadoEm: now,
      triagem: {
        ataItems: ataItems.length,
        empenhoGerado: empenhoGeradoItems.length,
        semAta: semAtaItems.length,
      },
    });

    this._persist();
    this._emit('pedido:processado');
    return { itensComOS, semAtaItems };
  },
  confirmDelivery(orderId, receiver, doc) {
    const o = this._data.orders.find(x => x.id === orderId);
    if (o) o.status = 'Entregue';
    const d = this._data.deliveries.find(x => x.orderId === orderId);
    if (d) {
      d.status = 'Confirmada';
      d.receiver = receiver;
      d.doc = doc;
      d.confirmadoEm = new Date().toISOString();
      d.timeline = d.timeline || [];
      d.timeline.push({ at: new Date().toISOString(), evento: 'Recebimento confirmado por ' + receiver });
    }
    // 🔗 Incrementa estoque físico da escola
    if (o) {
      this._data.schoolStocks = this._data.schoolStocks || {};
      this._data.schoolStocks[o.school] = this._data.schoolStocks[o.school] || {};
      (o.itens || []).forEach(item => {
        const cur = this._data.schoolStocks[o.school][item.produto] || { qtd: 0, unidade: item.unidade };
        cur.qtd = (cur.qtd || 0) + (item.qtd || 0);
        cur.ultimaEntrada = new Date().toISOString().slice(0,10);
        this._data.schoolStocks[o.school][item.produto] = cur;
        // Registra ajuste (audit log)
        (this._data.stockAdjust = this._data.stockAdjust || []).unshift({
          id: 'adj-' + Date.now() + '-' + Math.random().toString(36).slice(2,6),
          escola: o.school, produto: item.produto, delta: item.qtd, unidade: item.unidade,
          motivo: 'Entrega confirmada — pedido #' + o.numero, criadoEm: new Date().toISOString(),
        });
      });
    }
    this._persist(); this._emit('delivery:confirm');
    return d;
  },
  addIncident(inc) {
    const usr = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].userId : null;
    let finalSchool = inc.escola || inc.school;
    let finalId = inc.schoolId || (typeof DATA !== 'undefined' && DATA.schools ? (DATA.schools.find(s => s.name === finalSchool)?.id || null) : null);
    const i = { id: 'inc-' + Date.now(), criadoEm: new Date().toISOString(), status: 'Aberta', criadoPorUserId: usr, ...inc, escola: finalSchool, schoolId: finalId };
    this._data.incidents.unshift(i);
    this._persist(); this._emit('incident:add');
    return i;
  },
  addStockAdjust(adj) {
    const usr = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].userId : null;
    const a = { id: 'adj-' + Date.now(), criadoEm: new Date().toISOString(), criadoPorUserId: usr, ...adj };
    this._data.stockAdjust.unshift(a);
    this._persist(); this._emit('stock:adjust');
    return a;
  },

  // ── Empenhos & NF (fluxo contábil Gestor → Estoque Central) ──
  addEmpenho(emp) {
    const e = { id: 'emp-' + Date.now(), qtdConsumida: 0, status: 'Ativo', criadoEm: new Date().toISOString().slice(0,10), ...emp };
    this._data.empenhos = this._data.empenhos || [];
    this._data.empenhos.unshift(e);
    this._persist(); this._emit('empenho:add');
    return e;
  },
  // Consome saldo do empenho (usado ao gerar pedido de compra ou ao aprovar)
  consumeEmpenho(empenhoId, qtd) {
    const e = (this._data.empenhos || []).find(x => x.id === empenhoId);
    if (!e) return null;
    e.qtdConsumida = (e.qtdConsumida || 0) + qtd;
    if (e.qtdConsumida >= e.qtdTotal) { e.qtdConsumida = e.qtdTotal; e.status = 'Liquidado'; }
    else e.status = 'Parcial';
    this._persist(); this._emit('empenho:consume');
    return e;
  },
  // Recebimento de NF: baixa empenho + gera lote + incrementa estoque central
  receiveNF(empenhoId, dados) {
    const e = (this._data.empenhos || []).find(x => x.id === empenhoId);
    if (!e) return null;
    const nf = {
      id: 'nf-' + Date.now(),
      empenhoId,
      empenhoNumero: e.numero,
      numero: dados.numero,
      qtd: dados.qtd,
      valor: (dados.qtd || 0) * (e.valorUnit || 0),
      dataRec: dados.dataRec || new Date().toISOString().slice(0,10),
      validade: dados.validade,
      lote: dados.lote || 'L-' + (e.produto || 'PRD').slice(0,3).toUpperCase() + '-' + String(Date.now()).slice(-4),
      ateste: dados.ateste || 'Conforme',
    };
    (this._data.nfsRecebidas = this._data.nfsRecebidas || []).unshift(nf);
    // Baixa empenho
    this.consumeEmpenho(empenhoId, dados.qtd);
    // Incrementa estoque central
    this._data.centralStock = this._data.centralStock || {};
    const cur = this._data.centralStock[e.produto] || { qtd: 0, unidade: e.unidade, lotes: [] };
    cur.qtd = (cur.qtd || 0) + dados.qtd;
    cur.lotes = cur.lotes || [];
    cur.lotes.push({ lote: nf.lote, qtd: dados.qtd, validade: nf.validade, entrada: nf.dataRec });
    this._data.centralStock[e.produto] = cur;
    this._persist(); this._emit('nf:receive');
    return nf;
  },
  // Consome estoque central (usado quando pedido é separado)
  consumeCentralStock(produto, qtd) {
    if (!this._data.centralStock || !this._data.centralStock[produto]) return false;
    const cur = this._data.centralStock[produto];
    cur.qtd = Math.max(0, (cur.qtd || 0) - qtd);
    // FIFO: reduz do lote mais antigo
    if (cur.lotes && cur.lotes.length) {
      let restante = qtd;
      cur.lotes = cur.lotes.filter(l => {
        if (restante <= 0) return true;
        if (l.qtd <= restante) { restante -= l.qtd; return false; }
        l.qtd -= restante; restante = 0; return true;
      });
    }
    this._persist(); this._emit('central:consume');
    return true;
  },

  // ── Consumo escolar (decrementa estoque da escola via FEFO) ──
  addConsumo(reg) {
    const usr = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].userId : null;
    const c = { id: 'cons-' + crypto.randomUUID(), criadoEm: new Date().toISOString(), criadoPorUserId: usr, ...reg };
    (this._data.consumo = this._data.consumo || []).unshift(c);
    // Decrementa estoque local da escola
    this._data.schoolStocks = this._data.schoolStocks || {};
    this._data.schoolStocks[c.escola] = this._data.schoolStocks[c.escola] || {};
    const item = this._data.schoolStocks[c.escola][c.produto];
    if (item) {
      item.qtd = Math.max(0, (item.qtd || 0) - (c.qtd || 0));
      // FEFO: abate do lote mais antigo primeiro
      if (item.lotes && item.lotes.length) {
        item.lotes.sort((a,b) => new Date(a.validade) - new Date(b.validade));
        let restante = c.qtd || 0;
        item.lotes = item.lotes.filter(l => {
          if (restante <= 0) return true;
          if (l.qtd <= restante) { restante -= l.qtd; return false; }
          l.qtd -= restante; restante = 0; return true;
        });
      }
      const adj = {
        id: 'adj-' + crypto.randomUUID(),
        escola: c.escola, produto: c.produto, delta: -(c.qtd || 0), unidade: c.unidade,
        motivo: 'Consumo — ' + (c.refeicao || 'refeição'), criadoEm: new Date().toISOString(),
        criadoPorUserId: usr
      };
      (this._data.stockAdjust = this._data.stockAdjust || []).unshift(adj);
      if (window.DB && typeof window.DB.saveStockAdjust === 'function') {
        window.DB.saveStockAdjust(adj).catch(console.error);
      }
      if (window.DB && typeof window.DB.consumeSchoolStock === 'function') {
        window.DB.consumeSchoolStock(c.escola, c.produto, c.qtd).catch(console.error);
      }
    }
    this._persist(); this._emit('consumo:add');
    return c;
  },

  // Limpa tudo (para debug ou reset)
  reset() { this._data = this._defaults(); this._persist(); this._emit('reset'); },
};

SharedState.init();
window.SharedState = SharedState;

// Exports explicitos (ver nota acima sobre const vs window)
window.DATA = DATA;
window.SHARED_STATE_KEY = SHARED_STATE_KEY;

// REGISTRO GLOBAL DE RENDERIZADORES DE PÁGINAS
window.PAGE_RENDERERS = window.PAGE_RENDERERS || {};

// PROFILE CONFIGS

const PROFILES = {
  gestor: {
    userId: 'ID-001',
    name: 'Luiz Raghiant',
    role: 'Gestor SEMED',
    initials: 'LR',
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard Executivo', badge: null },
      { id: 'escolas', icon: '🏫', label: 'Escolas', badge: null },
      { type: 'group', label: 'Operacional', children: [
        { id: 'pedidos', icon: '📦', label: 'Pedidos', badge: '3' },
        { id: 'estoque', icon: '📊', label: 'Estoque Consolidado', badge: null },
        { id: 'planejamento', icon: '📅', label: 'Planejamento Alimentar', badge: null },
      ]},
      { type: 'group', label: 'Colaboradores', children: [
        { id: 'cooperativas', icon: '🤝', label: 'Cooperativas', badge: null },
        { id: 'agricultura', icon: '🌾', label: 'Agricultura Familiar', badge: null },
      ]},
      { type: 'group', label: 'Gerenciamento Estoque', children: [
        { id: 'os-central',            icon: '🏭', label: 'OS Estoque Central',      badge: null },
        { id: 'recebimentos-pendentes',icon: '🚚', label: 'Recebimentos Pendentes', badge: 'NEW' },
        { id: 'expedicao-os',          icon: '📦', label: 'Expedição (OS Escolas)',   badge: null },
        { id: 'ordens-entrega',        icon: '🚛', label: 'Ordens de Entrega',        badge: null },
      ]},
      { type: 'group', label: 'Prestação de Contas', children: [
        { id: 'atas',                  icon: '📋', label: 'Atas e Contratos',        badge: null },
        { id: 'empenhos',              icon: '💳', label: 'Empenhos SIAFI',          badge: null },
        { id: 'rastreabilidade-lotes', icon: '🔍', label: 'Rastreabilidade 5-Way',   badge: null },
        { id: 'listacompras',         icon: '🛒', label: 'Lista de Compras',        badge: null },
        { id: 'os-fornecedores',       icon: '🤝', label: 'OS Fornecedores',         badge: null },
      ]},
      { id: 'relatorios', icon: '📈', label: 'Relatórios', badge: null },
      { id: 'ia', icon: '🤖', label: 'IA de Previsão', badge: null },
    ]
  },
  nutricionista: {
    userId: 'ID-002',
    name: 'Dra. Lilian Droppa',
    role: 'Nutricionista SEMED',
    initials: 'LD',
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard Nutricional', badge: null },
      { id: 'fichas', icon: '📝', label: 'Fichas Técnicas', badge: null },
      { id: 'produtos', icon: '🥕', label: 'Produtos', badge: null },
      { id: 'cardapios', icon: '🍽️', label: 'Cardápios (Viewer, PDF, Romaneio)', badge: null },
      { id: 'planejamento', icon: '📅', label: 'Planejamento Alimentar', badge: null },
      { id: 'estoquesual', icon: '📦', label: 'Estoque SUAL (Consolidado)', badge: null },
      { id: 'guiasentrega', icon: '🚚', label: 'Guias de Entrega & Distr.', badge: null },
      { id: 'escolas', icon: '🏫', label: 'Escolas', badge: null },
      { id: 'consumo', icon: '📈', label: 'Consumo', badge: null },
      { id: 'desperdicios', icon: '🗑️', label: 'Desperdícios', badge: null },
      { id: 'restricoes', icon: '⚠️', label: 'Restrições Alimentares', badge: null },
      { id: 'relatorios', icon: '📊', label: 'Relatórios', badge: null },
      { id: 'ia', icon: '🤖', label: 'IA Nutricional', badge: null },
    ]
  },
  escola: {
    userId: 'ID-003',
    name: 'Maria Santos',
    role: 'EM ADV. DEMOSTHENES MARTINS',
    initials: 'MS',
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
      { id: 'planejamento', icon: '📅', label: 'Planejamento Alimentar', badge: null },
      { id: 'cardapios', icon: '🍽️', label: 'Cardápios', badge: null },
      { id: 'estoque', icon: '📦', label: 'Estoque', badge: '2' },
      { id: 'consumo', icon: '📝', label: 'Registro de Consumo', badge: null },
      { id: 'pedidos', icon: '🛒', label: 'Pedidos de Abastecimento', badge: null },
      { id: 'entregas', icon: '🚚', label: 'Entregas', badge: '1' },
      { id: 'historico', icon: '📜', label: 'Histórico', badge: null },
      { id: 'relatorios', icon: '📈', label: 'Relatórios', badge: null },
    ]
  },
  cooperativa: {
    userId: 'ID-004',
    name: 'Carlos Mendes',
    role: 'COOPAGRAN',
    initials: 'CM',
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
      { id: 'escolas', icon: '🏫', label: 'Escolas Atendidas', badge: null },
      { id: 'agricultores', icon: '👨‍🌾', label: 'Agricultores', badge: null },
      { id: 'produtos', icon: '🥕', label: 'Produtos', badge: null },
      { id: 'estoque', icon: '📦', label: 'Estoque Consolidado', badge: null },
      { id: 'pedidos', icon: '📋', label: 'Pedidos', badge: '2' },
      { id: 'planejamento', icon: '📅', label: 'Planejamento de Entregas', badge: null },
      { id: 'rotas', icon: '🗺️', label: 'Rotas', badge: null },
      { id: 'contratos', icon: '📄', label: 'Contratos e Chamamentos', badge: null },
      { id: 'entregas', icon: '🚚', label: 'Entregas', badge: null },
      { id: 'relatorios', icon: '📈', label: 'Relatórios', badge: null },
      { id: 'indicadores', icon: '🎯', label: 'Indicadores', badge: null },
    ]
  },
  agricultor: {
    userId: 'ID-005',
    name: 'José Maria Rodrigues',
    role: 'Agricultor Familiar',
    initials: 'JR',
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard', badge: null },
      { id: 'escolas', icon: '🏫', label: 'Escolas que Atendo', badge: null },
      { id: 'producao', icon: '🌱', label: 'Minha Produção', badge: null },
      { id: 'estoque', icon: '📦', label: 'Estoque', badge: null },
      { id: 'pedidos', icon: '📋', label: 'Pedidos', badge: '1' },
      { id: 'entregas', icon: '🚚', label: 'Entregas', badge: null },
      { id: 'calendario', icon: '📅', label: 'Calendário', badge: null },
      { id: 'relatorios', icon: '📈', label: 'Relatórios', badge: null },
      { id: 'perfil', icon: '👤', label: 'Perfil', badge: null },
    ]
  },
  estoque: {
    userId: 'ID-006',
    name: 'Fabricio Milano',
    role: 'Central de Distribuição (Estoque)',
    initials: 'FM',
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard Operacional', badge: null },
      { id: 'inventario', icon: '🏢', label: 'Posição de Estoque', badge: null },
      { type: 'group', label: 'Gerenciamento Estoque', children: [
        { id: 'os-central',            icon: '🏭', label: 'OS Estoque Central',      badge: null },
        { id: 'recebimentos-pendentes',icon: '🚚', label: 'Recebimentos Pendentes', badge: 'NEW' },
        { id: 'expedicao-os',          icon: '📦', label: 'Expedição (OS Escolas)',   badge: null },
        { id: 'ordens-entrega',        icon: '🚛', label: 'Ordens de Entrega',        badge: null },
      ]},
      { id: 'lotes', icon: '📋', label: 'Controle de Lotes & Rastreabilidade', badge: null },
      { id: 'escolas', icon: '🏫', label: 'Escolas Atendidas', badge: null },
    ]
  },
  diretor: {
    userId: 'ID-007',
    get _sc() { return state.selectedSchool || (window._PILOT_SCHOOLS||[]).find(s => s.id === state.selectedSchoolId); },
    get name() { const sc = this._sc; return sc && sc.diretor ? sc.diretor.name : 'Diretor(a)'; },
    get role() { const sc = this._sc; return sc ? sc.name : 'Direção Escolar'; },
    get initials() { const sc = this._sc; return sc && sc.diretor ? sc.diretor.initials : 'DE'; },
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Painel da Escola', badge: null },
      { id: 'planejamento', icon: '📅', label: 'Planejamento Alimentar', badge: null },
      { id: 'estoque', icon: '📦', label: 'Estoque da Escola', badge: null },
      { id: 'pedidos', icon: '🛒', label: 'Solicitar Reposição', badge: null },
      { id: 'entregas', icon: '🚚', label: 'Acompanhar Entregas', badge: null },
      { id: 'consumo', icon: '📝', label: 'Consumo Registrado', badge: null },
      { id: 'cardapios', icon: '🍽️', label: 'Cardápio Vigente', badge: null },
      { id: 'restricoes', icon: '⚠️', label: 'Restrições Alimentares', badge: null },
      { id: 'historico', icon: '📜', label: 'Histórico', badge: null },
      { id: 'relatorios', icon: '📈', label: 'Relatórios', badge: null },
    ]
  },
  resp_estoque: {
    userId: 'ID-008',
    get _sc() { return state.selectedSchool || (window._PILOT_SCHOOLS||[]).find(s => s.id === state.selectedSchoolId); },
    get name() { const sc = this._sc; return sc && sc.respEstoque ? sc.respEstoque.name : 'Resp. Estoque'; },
    get role() { const sc = this._sc; return sc ? 'Estoque · ' + (sc.sigla||'') + ' ' + sc.name.split(' ').slice(-2).join(' ') : 'Responsável de Estoque'; },
    get initials() { const sc = this._sc; return sc && sc.respEstoque ? sc.respEstoque.initials : 'RE'; },
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard de Estoque', badge: null },
      { id: 'inventario', icon: '🏢', label: 'Inventário Físico', badge: null },
      { id: 'entradas', icon: '📥', label: 'Confirmar Entregas', badge: null },
      { id: 'consumo', icon: '📝', label: 'Lançar Consumo', badge: null },
      { id: 'pedidos', icon: '🛒', label: 'Pedidos em Aberto', badge: null },
      { id: 'validades', icon: '⏳', label: 'Controle de Validade (FEFO)', badge: null },
      { id: 'relatorios', icon: '📈', label: 'Relatórios', badge: null },
    ]
  },
  merendeira: {
    userId: 'ID-009',
    get _sc() { return state.selectedSchool || (window._PILOT_SCHOOLS||[]).find(s => s.id === state.selectedSchoolId); },
    get name() { const sc = this._sc; return sc && sc.merendeira ? sc.merendeira.name : 'Merendeira Escolar'; },
    get role() { const sc = this._sc; return sc ? 'Cozinha · ' + (sc.sigla||'') + ' ' + sc.name.split(' ').slice(-2).join(' ') : 'Cozinha'; },
    get initials() { const sc = this._sc; return sc && sc.merendeira ? sc.merendeira.initials : 'ME'; },
    menu: [
      { id: 'dashboard', icon: '👩‍🍳', label: 'Painel da Merendeira', badge: null },
      { id: 'consumo', icon: '📝', label: 'Lançamento Ágil de Consumo', badge: null },
      { id: 'cardapios', icon: '🍽️', label: 'Cardápio do Dia', badge: null },
      { id: 'estoque', icon: '📦', label: 'Estoque (Leitura)', badge: null },
      { id: 'entregas', icon: '🚚', label: 'Conferir Entregas', badge: null },
    ]
  },
  motorista: {
    userId: 'ID-010',
    name: 'José Souza',
    role: 'Motorista de Entrega',
    initials: 'JS',
    menu: [
      { id: 'dashboard', icon: '🗺️', label: 'Minha Rota Diária', badge: null },
      { id: 'escolas', icon: '🏫', label: 'Escolas da Rota', badge: null },
      { id: 'entregas', icon: '🚚', label: 'Realizar Entregas', badge: '1' },
      { id: 'ocorrencias', icon: '⚠️', label: 'Registrar Ocorrência', badge: null },
      { id: 'historico', icon: '📜', label: 'Histórico de Viagens', badge: null },
    ]
  }
};
// NÃO reintroduzir `PROFILES.diretor = PROFILES.escola`.
// O perfil `diretor` acima tem menu próprio (school-aware, com getters dinâmicos
// de nome/escola/iniciais) e inclui "Restrições Alimentares" — item que o menu
// genérico da escola não tem. O alias sobrescrevia tudo isso e deixava a tela
// `diretor_restricoes` inatingível, apesar de existir e ser completa.
// Todos os 10 renderers do menu do diretor estão registrados (verificado).
window.PROFILES = PROFILES;

// APP STATE

let state = {
  currentProfile: 'gestor',
  currentPage: 'dashboard',
  charts: {},
  sidebarCollapsed: false,
  selectedSchoolId: null,   // id da escola piloto selecionada no login
  selectedSchool: null,     // objeto escola capturado antes do hydrateData (imutável durante sessão)
  pilotoAtivo: (() => { try { return localStorage.getItem('saged_piloto_v1') === '1'; } catch { return false; } })(),
};

window.togglePilotoMode = () => {
  state.pilotoAtivo = !state.pilotoAtivo;
  try { localStorage.setItem('saged_piloto_v1', state.pilotoAtivo ? '1' : '0'); } catch {}
  applyPiloto();
  showToast(state.pilotoAtivo ? '🎯 Modo Piloto ativado: 8 escolas.' : '🌐 Modo completo: ' + (window._DATA_SCHOOLS_FULL||[]).length + ' escolas.');
  renderPage();
};

function applyPiloto() {
  if (!window._DATA_SCHOOLS_FULL) window._DATA_SCHOOLS_FULL = DATA.schools.slice();
  DATA.schools = state.pilotoAtivo ? window._DATA_SCHOOLS_FULL.slice(0, 8) : window._DATA_SCHOOLS_FULL.slice();
}

// Dono unico do `state`: o MESMO objeto responde por `state` (bare) e por
// `window.state`. Antes o Hub tinha um objeto e o app.js outro (`let state`),
// o que faria o navigateTo gravar num e o renderPage do Hub ler o outro no dia
// em que o app.js saisse. Ver Fase 3.5 do PLANO_ACAO_POS_AUDITORIA.md.
window.state = state;
window.applyPiloto = applyPiloto;

// CONTRATO FIXO E IMUTÁVEL DO ROTEADOR: renderer(containerElement)
// Assinatura universal: (el) => { el.innerHTML = ...; }
//
// ⚠️ Ver Seção 4.3 do PLANO_MODULARIZACAO_APP.md. Nenhum renderer deve depender
// de valor de retorno. Esta função precisa ser um SUPERCONJUNTO do renderPage()
// do app.js enquanto os dois coexistirem — o app.js carrega por último e a sua
// versão é a vigente hoje; qualquer comportamento que exista lá e falte aqui
// vira regressão silenciosa no dia em que o app.js sair.
//
// Paridade implementada com o app.js: reset do container, resolução dinâmica de
// aliases do perfil `estoque`, fallback para o dashboard do perfil e error
// boundary com tela de recuperação.
window.renderPage = (pageKey) => {
  const targetPage = pageKey || window.state?.currentPage || 'dashboard';
  if (window.state) window.state.currentPage = targetPage;

  const contentEl = document.getElementById('page-content');
  if (!contentEl) return;

  const profileKey = window.state?.currentProfile || 'gestor';
  let key = `${profileKey}_${targetPage}`;

  // Telas da Central de Estoque compartilhadas com o Gestor: o menu do perfil
  // `estoque` usa ids curtos que apontam para os módulos de alta fidelidade do
  // Gestor. Mantém a mesma tabela do app.js.
  if (!window.PAGE_RENDERERS[key] && profileKey === 'estoque') {
    const aliasMap = {
      'entradas': 'recebimentos-pendentes',
      'separacao': 'expedicao-os',
      'carregamento': 'ordens-entrega'
    };
    const targetAlias = aliasMap[targetPage] || targetPage;
    if (window.PAGE_RENDERERS[`gestor_${targetAlias}`]) key = `gestor_${targetAlias}`;
  }

  contentEl.innerHTML = '';
  contentEl.className = 'page-content';

  const renderer = window.PAGE_RENDERERS[key]
    || window.PAGE_RENDERERS[targetPage]
    || window.PAGE_RENDERERS[`${profileKey}_dashboard`];

  if (typeof renderer !== 'function') {
    contentEl.innerHTML = `
      <div style="padding:32px;text-align:center;">
        <h2 style="color:var(--text-primary,#0f172a);">Tela não encontrada</h2>
        <p style="color:var(--text-secondary,#64748b);">Página solicitada: <code>${escapeHTML(key)}</code></p>
        <button class="btn btn-primary" onclick="renderPage('dashboard')">Voltar ao Dashboard</button>
      </div>
    `;
    return;
  }

  try {
    renderer(contentEl);
  } catch (err) {
    console.error(`[Router] Erro ao renderizar ${key}:`, err);
    contentEl.innerHTML = `
      <div class="page-header">
        <div class="page-title">⚠️ Visualização em Carregamento</div>
        <div class="page-subtitle">${escapeHTML(err.message || 'Módulo em sincronização')}</div>
      </div>
      <div class="card" style="padding:24px;border-radius:12px">
        <p style="color:var(--text-secondary);margin-bottom:16px">O módulo solicitou uma atualização de dados. Clique abaixo para retornar ao painel principal.</p>
        <button class="btn btn-primary" onclick="navigateTo('${profileKey}','dashboard')">Voltar ao Início</button>
      </div>
    `;
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
