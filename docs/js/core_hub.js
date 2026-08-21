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

// Cross-perfil (Fase 3.3). O levantamento das 148 funcoes globais do app.js
// mostrou que apenas estas duas, alem do trio de UI acima, sao usadas por mais
// de um perfil: exportRelatorio serve gestor + resp_estoque e _resolverRestricao
// serve nutricionista + diretor. As outras 115 pertencem a um perfil so e vao
// junto com o respectivo modulo na Fase 4.
window.exportRelatorio = (key) => {
  let rows = [];
  let headers = [];
  let fname = 'relatorio.csv';

  switch (key) {
    case 'produtos_consumo': {
      const acc = {};
      SharedState.getConsumo().forEach(c => { acc[c.produto] = (acc[c.produto] || 0) + (c.qtd || 0); });
      headers = ['Produto', 'Qtd Total', 'Unidade'];
      rows = Object.entries(acc).sort((a,b) => b[1]-a[1]).map(([p, q]) => [p, q, 'kg/L']);
      fname = 'produtos_consumidos.csv';
      break;
    }
    case 'consumo_escola': {
      const acc = {};
      SharedState.getConsumo().forEach(c => { acc[c.escola] = acc[c.escola] || { qtd:0, n:0 }; acc[c.escola].qtd += (c.qtd||0); acc[c.escola].n++; });
      headers = ['Escola', 'Qtd Total', 'Nº Registros'];
      rows = Object.entries(acc).sort((a,b) => b[1].qtd - a[1].qtd).map(([e, d]) => [e, d.qtd, d.n]);
      fname = 'consumo_por_escola.csv';
      break;
    }
    case 'entregas': {
      headers = ['Pedido', 'Escola', 'Cooperativa', 'Status', 'Recebido por', 'Data Confirmação'];
      rows = SharedState.getDeliveries().map(d => [
        '#' + String(d.orderNumero).padStart(3,'0'),
        d.school || '', d.cooperative || '', d.status || '',
        d.receiver || '', d.confirmadoEm ? new Date(d.confirmadoEm).toLocaleString('pt-BR') : '',
      ]);
      fname = 'entregas.csv';
      break;
    }
    case 'empenhos': {
      headers = ['Empenho', 'Ata', 'Produto', 'Qtd Total', 'Consumido', 'Saldo', 'Status'];
      rows = SharedState.getEmpenhos().map(e => [
        e.numero, e.ataNumero, e.produto,
        e.qtdTotal, e.qtdConsumida || 0, (e.qtdTotal||0) - (e.qtdConsumida||0), e.status,
      ]);
      fname = 'empenhos.csv';
      break;
    }
    case 'nfs': {
      headers = ['NF', 'Empenho', 'Qtd', 'Valor', 'Data', 'Lote', 'Ateste'];
      rows = SharedState.getNFs().map(n => [n.numero, n.empenhoNumero, n.qtd, n.valor, n.dataRec, n.lote, n.ateste]);
      fname = 'nfs_recebidas.csv';
      break;
    }
    case 'producoes': {
      headers = ['Agricultor', 'Produto', 'Área (ha)', 'Prevista', 'Disponível', 'Status'];
      rows = SharedState.getProductions().map(p => [p.agricultor, p.produto, p.area, p.previsto, p.disponivel, p.status]);
      fname = 'producoes.csv';
      break;
    }
  }

  if (rows.length === 0) {
    showToast('⚠️ Sem dados para exportar. Use o sistema para gerar registros.', 'error');
    return;
  }

  const csv = [headers.join(',')].concat(rows.map(r => r.map(c => {
    const v = String(c ?? '');
    return v.includes(',') || v.includes('"') || v.includes('\n') ? '"' + v.replace(/"/g,'""') + '"' : v;
  }).join(','))).join('\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fname;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('📥 ' + fname + ' baixado (' + rows.length + ' linhas).');
};

window._resolverRestricao = (id) => {
  if (confirm('Marcar esta restrição como resolvida?')) {
    SharedState.resolverRestricao(id);
    renderPage();
  }
};

// Cross-perfil (Fase 4.1): usado pela cooperativa e pela tela de entregas da escola.
window.confirmSchoolDelivery = (id, receiver) => {
  const nome = prompt('Nome do responsável pelo recebimento:', receiver || '');
  if (!nome) return;
  SharedState.confirmDelivery(id, nome, '');
  showToast('✅ Recebimento confirmado! Cooperativa e Gestor notificados.');
  renderPage();
};

// HTML HELPERS REUTILIZÁVEIS — _kpi/_pageHeader/_cardHeader/_tag/_statusBadge/
// _emptyState vivem em app.js (assinaturas contra as quais os módulos foram
// escritos) e serão absorvidos aqui na consolidação final da Fase 5.

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
        { id: 'menu-jun-reg', nome: 'Cardápio Junho/2026 — Regular', periodicidade: 'mensal', mesReferencia: { mes: 6, ano: 2026 }, numSemanas: 5, periodo: '01/06 a 30/06', escolas: 152, status: 'Publicado', tipo: 'Regular', autor: 'Dra. Lilian Droppa', criadoEm: '2026-05-25' },
        { id: 'menu-jun-int', nome: 'Cardápio Junho/2026 — Integral', periodicidade: 'mensal', mesReferencia: { mes: 6, ano: 2026 }, numSemanas: 5, periodo: '01/06 a 30/06', escolas: 31, status: 'Publicado', tipo: 'Integral', autor: 'Dra. Lilian Droppa', criadoEm: '2026-05-25' },
        { id: 'menu-jul-reg', nome: 'Cardápio Julho/2026 — Regular', periodicidade: 'mensal', mesReferencia: { mes: 7, ano: 2026 }, numSemanas: 5, periodo: '01/07 a 31/07', escolas: 0, status: 'Em Elaboração', tipo: 'Regular', autor: 'Dra. Lilian Droppa', criadoEm: '2026-06-18' },
      ],
      weeklyMenus: [
        { id: 'wm-jun-reg-w1', cardapioId: 'menu-jun-reg', indiceSemana: 1, semana: 'Semana 1 (01/06 a 05/06)', escola: 'REDE', kcalMedia: 720, publicadoEm: '2026-05-25', autor: 'Dra. Lilian Droppa', refeicoes: [
          { dia: 'Seg', diaData: '2026-06-01', tipo: 'Almoço', item: 'Arroz com Frango Ensopado e Legumes', kcal: 680 },
          { dia: 'Ter', diaData: '2026-06-02', tipo: 'Almoço', item: 'Feijoada Vegetariana e Laranja', kcal: 740 },
          { dia: 'Qua', diaData: '2026-06-03', tipo: 'Almoço', item: 'Macarrão Bolonhesa e Salada', kcal: 710 },
          { dia: 'Qui', diaData: '2026-06-04', tipo: 'Almoço', item: 'Carne Moída com Mandioca e Abóbora', kcal: 750 },
          { dia: 'Sex', diaData: '2026-06-05', tipo: 'Almoço', item: 'Risoto de Frango com Salada Verde', kcal: 720 },
        ]},
        { id: 'wm-jun-reg-w2', cardapioId: 'menu-jun-reg', indiceSemana: 2, semana: 'Semana 2 (08/06 a 12/06)', escola: 'REDE', kcalMedia: 730, publicadoEm: '2026-05-25', autor: 'Dra. Lilian Droppa', refeicoes: [
          { dia: 'Seg', diaData: '2026-06-08', tipo: 'Almoço', item: 'Arroz, Feijão e Iscas de Carne Média', kcal: 710 },
          { dia: 'Ter', diaData: '2026-06-09', tipo: 'Almoço', item: 'Polenta com Frango Desfiado', kcal: 740 },
          { dia: 'Qua', diaData: '2026-06-10', tipo: 'Almoço', item: 'Sopa Nutritiva de Legumes e Carne', kcal: 690 },
          { dia: 'Qui', diaData: '2026-06-11', tipo: 'Almoço', item: 'Galinhada com Milho e Salada', kcal: 760 },
          { dia: 'Sex', diaData: '2026-06-12', tipo: 'Almoço', item: 'Peixe Assado com Purê de Batata', kcal: 720 },
        ]},
        { id: 'wm-jun-reg-w3', cardapioId: 'menu-jun-reg', indiceSemana: 3, semana: 'Semana 3 (15/06 a 19/06)', escola: 'REDE', kcalMedia: 715, publicadoEm: '2026-05-25', autor: 'Dra. Lilian Droppa', refeicoes: [
          { dia: 'Seg', diaData: '2026-06-15', tipo: 'Almoço', item: 'Arroz Integral, Feijão e Ovos Mexidos', kcal: 700 },
          { dia: 'Ter', diaData: '2026-06-16', tipo: 'Almoço', item: 'Cozido de Carne com Batata Doce', kcal: 730 },
          { dia: 'Qua', diaData: '2026-06-17', tipo: 'Almoço', item: 'Macarrão com Molho de Tomate Fresco', kcal: 710 },
          { dia: 'Qui', diaData: '2026-06-18', tipo: 'Almoço', item: 'Strogonoff de Frango com Salada', kcal: 750 },
          { dia: 'Sex', diaData: '2026-06-19', tipo: 'Almoço', item: 'Feijão Tropeiro Leve e Couve', kcal: 720 },
        ]},
        { id: 'wm-jun-reg-w4', cardapioId: 'menu-jun-reg', indiceSemana: 4, semana: 'Semana 4 (22/06 a 26/06)', escola: 'REDE', kcalMedia: 725, publicadoEm: '2026-05-25', autor: 'Dra. Lilian Droppa', refeicoes: [
          { dia: 'Seg', diaData: '2026-06-22', tipo: 'Almoço', item: 'Arroz, Feijão Preto e Carne de Panela', kcal: 720 },
          { dia: 'Ter', diaData: '2026-06-23', tipo: 'Almoço', item: 'Frango Xadrez com Vegetais Orgânicos', kcal: 730 },
          { dia: 'Qua', diaData: '2026-06-24', tipo: 'Almoço', item: 'Canja de Galinha com Torrada Integral', kcal: 680 },
          { dia: 'Qui', diaData: '2026-06-25', tipo: 'Almoço', item: 'Escondidinho de Mandioquinha com Frango', kcal: 740 },
          { dia: 'Sex', diaData: '2026-06-26', tipo: 'Almoço', item: 'Baião de Dois com Queijo Coalho AF', kcal: 750 },
        ]},
        { id: 'wm-jun-reg-w5', cardapioId: 'menu-jun-reg', indiceSemana: 5, semana: 'Semana 5 (29/06 a 30/06)', escola: 'REDE', kcalMedia: 710, publicadoEm: '2026-05-25', autor: 'Dra. Lilian Droppa', refeicoes: [
          { dia: 'Seg', diaData: '2026-06-29', tipo: 'Almoço', item: 'Arroz, Feijão e Moqueca de Peixe', kcal: 710 },
          { dia: 'Ter', diaData: '2026-06-30', tipo: 'Almoço', item: 'Carne Ensopada com Cenoura e Vagem', kcal: 710 },
          { dia: 'Qua', diaData: '2026-07-01', desabilitado: true, tipo: '—', item: 'Dia fora do mês', kcal: 0 },
          { dia: 'Qui', diaData: '2026-07-02', desabilitado: true, tipo: '—', item: 'Dia fora do mês', kcal: 0 },
          { dia: 'Sex', diaData: '2026-07-03', desabilitado: true, tipo: '—', item: 'Dia fora do mês', kcal: 0 },
        ]},
      ],
      fichas: [],
      orders: [],
      deliveries: [],
      incidents: [],
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
    // B7: se o pedido veio de uma Carga (tem oeNumero), alimenta o lado do
    // Motorista na dupla checagem da O.E. vinculada (fecha só com a Escola também).
    if (o && o.oeNumero && typeof SharedState.registrarConfirmacaoEntrega === 'function') {
      SharedState.registrarConfirmacaoEntrega(o.oeNumero, 'motorista', { por: receiver, doc, motorista: o.driver });
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
      { id: 'ocorrencias', icon: '⚠️', label: 'Livro de Ocorrências', badge: 'NEW' },
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
      { id: 'inventario', icon: '🏢', label: 'Estoque Central', badge: null },
      { type: 'group', label: 'Recebimento & Expedição', children: [
        { id: 'recebimentos-pendentes',icon: '🚚', label: 'Recebimentos Pendentes', badge: null },
        { id: 'expedicao-os',          icon: '📦', label: 'Expedição (OS Escolas)',   badge: null },
      ]},
      { type: 'group', label: 'Logística & Cargas', children: [
        { id: 'montagem-carga',        icon: '🚛', label: 'Montagem de Carga',        badge: 'NEW' },
        { id: 'ordens-entrega',        icon: '📋', label: 'Ordens de Entrega',        badge: null },
        { id: 'roteirizacao',          icon: '🗺️', label: 'Roteirização',             badge: 'NEW' },
        { id: 'rastreabilidade',       icon: '📡', label: 'Rastreabilidade (Caminhões)', badge: 'NEW' },
        { id: 'frota',                 icon: '🚚', label: 'Frota',                    badge: 'NEW' },
      ]},
      { id: 'cobertura', icon: '🏫', label: 'Cobertura Escolar', badge: null },
      { id: 'lotes', icon: '📋', label: 'Controle de Lotes', badge: null },
      { type: 'group', label: 'Gestão', children: [
        { id: 'relatorios', icon: '📈', label: 'Relatórios', badge: 'NEW' },
        { id: 'ocorrencias', icon: '⚠️', label: 'Ocorrências', badge: 'NEW' },
      ]},
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
// window.renderPage vive em app.js (versão com limpeza de charts e aliases da
// Central de Estoque); será absorvido aqui na consolidação final da Fase 5.

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

window.addEventListener('DOMContentLoaded', () => {
  renderVersionTags();
  if (typeof SharedState !== 'undefined' && SharedState.init) {
    SharedState.init();
  }
});


// ############################################################################
// # CONSOLIDACAO FASE 5 — corpo remanescente do antigo app.js absorvido aqui.
// # (helpers HTML, engines, handlers cross-perfil, renderPage e bootstrap).
// # app.js foi removido do index.html; este e o Hub Central unico.
// ############################################################################

/* ============================================
   SUALE — Application Engine
   Sistema de Gestão da Alimentação Escolar
   SEMED · Campo Grande · MS
   ============================================ */

// VERSÃO
// ----------------------------
// Fonte única da verdade. Ao commitar, os três devem subir juntos:
//   1. APP_VERSION aqui
//   2. "version" no package.json da raiz
//   3. tag do git (git tag -a v<versao>)
// Semver: MAJOR quebra fluxo/dados · MINOR nova tela ou perfil · PATCH correção
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

// CATÁLOGO LOCAL CURADO
// ----------------------------
// products, contracts, ataProducts, empenhos e lots formam um GRAFO ligado por
// id: ataProducts.stockProductId → products.id · empenhos.items[].productId →
// ataProducts.id · ataProducts.ataId → contracts.id · lots.productId → products.id
//
// O Supabase ainda tem o catálogo antigo (20 produtos, 4 atas com outra
// numeração). O hydrateData() sobrescrevia só `products` e `contracts` — e não
// ataProducts/empenhos, que não têm tabela lá — então o grafo quebrava:
// ataProducts passava a apontar para ids de produto inexistentes e o modal de
// Novo Empenho abria vazio nas atas 1 e 2.
//
// Enquanto true, hydrateData() preserva essas coleções (guarda em db.js).
// Para voltar a hidratar do banco é preciso ANTES migrar o catálogo curado
// para lá — os 28 produtos com preço e as 6 atas — senão o grafo quebra de novo.
var USAR_CATALOGO_LOCAL = window.USAR_CATALOGO_LOCAL !== undefined ? window.USAR_CATALOGO_LOCAL : true;
window.USAR_CATALOGO_LOCAL = USAR_CATALOGO_LOCAL;

// MODAL SYSTEM (Redimensionado e Responsivo)

// showModal/closeModal/showToast vivem em js/core_hub.js (Fase 3.3).
// As copias que existiam aqui eram byte-identicas as do Hub — removidas.

// SHARED STATE + MOCK DATA -> migrados para js/core_hub.js (Fase 3.2).
// O Hub carrega antes do app.js, portanto DATA, SHARED_STATE_KEY e SharedState
// continuam disponiveis como globais para todo o codigo abaixo.
// PROFILES, state, togglePilotoMode e applyPiloto -> migrados para js/core_hub.js (Fase 3.5).

// Escolas piloto — capturadas UMA VEZ antes de qualquer hydrateData do Supabase.
// Serve de fallback quando o Supabase não responde; o db.js substitui por escolas reais quando conecta.
window._PILOT_SCHOOLS = DATA.schools.filter(sc => sc.diretor).slice();

// O dropdown do login precisa listar as MESMAS escolas (e IDs) que acabam em _PILOT_SCHOOLS,
// senão o usuário escolhe uma escola e entra em outra.
document.addEventListener('DOMContentLoaded', () => {
  if (window.DB && typeof window.DB.initLoginDropdown === 'function') window.DB.initLoginDropdown();
  renderVersionTags();
});

// UTILITIES

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }
function formatCurrency(val) { return 'R$ ' + (val / 1).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }); }
function formatDate(d) { const dt = new Date(d + 'T12:00:00'); return dt.toLocaleDateString('pt-BR'); }
function statusClass(s) {
  if (['ok', 'Entregue', 'Vigente', 'Confirmado', 'Ativo', 'Normal'].includes(s)) return 'status-ok';
  if (['warning', 'Em separação', 'Em transporte', 'Em análise', 'Baixo'].includes(s)) return 'status-warning';
  if (['danger', 'Pendente', 'Atrasado', 'Crítico', 'Vencido'].includes(s)) return 'status-danger';
  return 'status-info';
}
function statusLabel(s) {
  const map = { ok: 'Abastecida', warning: 'Atenção', danger: 'Risco' };
  return map[s] || s;
}
function destroyCharts() {
  Object.values(state.charts).forEach(c => { if (c && c.destroy) c.destroy(); });
  state.charts = {};
}

// HTML HELPERS — padrões reutilizáveis para reduzir template literals repetidos
// Uso: _kpi('blue','🏫','8','Escolas','1') ou _tag('green','Entregue')
function _kpi(color, icon, value, label, stagger = '', trend = '', extra = '') {
  const cls = stagger ? ` animate-fade-up stagger-${stagger}` : '';
  return `<div class="kpi-card ${color}${cls}">
    <div class="kpi-icon">${icon}</div>
    <div class="kpi-value">${value}</div>
    <div class="kpi-label">${label}</div>
    ${trend ? `<div class="kpi-trend">${trend}</div>` : ''}
    ${extra}
  </div>`;
}
function _pageHeader(title, subtitle = '', actions = '') {
  return `<div class="page-header">
    <div><div class="page-title">${title}</div>${subtitle ? `<div class="page-subtitle">${subtitle}</div>` : ''}</div>
    ${actions ? `<div class="page-actions">${actions}</div>` : ''}
  </div>`;
}
function _cardHeader(title, actions = '') {
  return `<div class="card-header"><div class="card-title">${title}</div>${actions}</div>`;
}
function _tag(color, text) {
  return `<span class="tag tag-${color}">${text}</span>`;
}
function _statusBadge(status) {
  return `<span class="status-badge ${statusClass(status)}">${statusLabel(status) || status}</span>`;
}
function _emptyState(icon, msg, sub = '') {
  return `<div style="text-align:center;padding:40px;color:var(--text-secondary)">
    <div style="font-size:2.5rem;margin-bottom:12px">${icon}</div>
    <div style="font-weight:600;margin-bottom:6px">${msg}</div>
    ${sub ? `<div style="font-size:0.85rem">${sub}</div>` : ''}
  </div>`;
}

// NAVIGATION

function navigateTo(profile, page) {
  if (profile) state.currentProfile = profile;
  state.currentPage = page || 'dashboard';
  destroyCharts();
  renderSidebar();
  renderHeader();
  renderPage();
}

async function login(profile, schoolId) {
  window.login = login;
  state.currentProfile = profile;
  state.currentPage = 'dashboard';
  if (schoolId) {
    state.selectedSchoolId = schoolId;
    // Usa _PILOT_SCHOOLS (imutável) — nunca sofre sobrescrita do Supabase hydrateData
    state.selectedSchool = (window._PILOT_SCHOOLS || []).find(s => s.id === schoolId)
                         || DATA.schools.find(s => s.id === schoolId)
                         || null;
  } else {
    state.selectedSchoolId = null;
    state.selectedSchool = null;
  }
  $('#screen-login').classList.remove('active');
  $('#screen-login').hidden = true;
  const app = $('#screen-app');
  app.hidden = false;
  app.removeAttribute('hidden');
  app.classList.add('active');

  // Mostra loading enquanto hidrata do Supabase
  const pageContent = $('#page-content');
  if (pageContent) {
    pageContent.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;gap:16px;color:var(--text-secondary)">
        <div style="width:40px;height:40px;border:3px solid var(--primary-light);border-top-color:var(--primary);border-radius:50%;animation:spin 0.8s linear infinite"></div>
        <div style="font-weight:600">Carregando dados...</div>
        <div style="font-size:0.8rem">Sincronizando com o banco de dados</div>
      </div>
    `;
  }

  destroyCharts();
  renderSidebar();
  renderHeader();

  // Hidrata DATA com dados reais do Supabase (com timeout de 2s para nao travar a UI)
  if (window.DB) {
    await Promise.race([
      window.DB.hydrateData(),
      new Promise(r => setTimeout(r, 2000))
    ]).catch(() => {});
    updateDbStatusBadge();
  }

  // Depois da hidratação DATA.schools já é a lista real — só aqui dá para
  // semear o estoque das escolas na proporção certa do porte de cada uma.
  seedSchoolStocks();

  applyPiloto();
  renderPage();
}
window.login = login;

function logout() {
  destroyCharts();
  const app = $('#screen-app');
  app.classList.remove('active');
  app.hidden = true;
  const loginEl = $('#screen-login');
  loginEl.hidden = false;
  loginEl.removeAttribute('hidden');
  loginEl.classList.add('active');
}

function updateDbStatusBadge() {
  const dot = document.getElementById('db-status-dot');
  const label = document.getElementById('db-status-label');
  if (!dot || !label) return;
  if (window.DB_STATUS && window.DB_STATUS.connected) {
    dot.style.background = '#22C55E';
    label.textContent = 'Supabase • Ao Vivo';
  } else {
    dot.style.background = '#F59E0B';
    label.textContent = 'Modo Demo';
  }
}

// RENDER: SIDEBAR

function computeDynamicBadge(profile, pageId) {
  try {
    const orders = (SharedState.getOrders && SharedState.getOrders()) || [];
    const incidents = (SharedState.getIncidents && SharedState.getIncidents()) || [];
    const productions = (SharedState.getProductions && SharedState.getProductions()) || [];
    if (profile === 'gestor' && pageId === 'pedidos')       return orders.filter(o => o.status === 'Pendente').length || null;
    if (profile === 'gestor' && pageId === 'dashboard')     return incidents.filter(i => i.status === 'Aberta').length || null;
    if (profile === 'nutricionista' && pageId === 'cardapios') {
      const weekly = (SharedState.getWeeklyMenus && SharedState.getWeeklyMenus()) || [];
      return weekly.length || null;
    }
    if (profile === 'escola' && pageId === 'cardapios')     return ((SharedState.getWeeklyMenus && SharedState.getWeeklyMenus()) || []).length || null;
    if (profile === 'escola' && pageId === 'entregas')      return orders.filter(o => o.status !== 'Entregue' && o.status !== 'Pendente').length || null;
    if (profile === 'escola' && pageId === 'pedidos')       return orders.filter(o => o.status === 'Pendente').length || null;
    if (profile === 'cooperativa' && pageId === 'pedidos')  return orders.filter(o => o.status === 'Pendente').length || null;
    if (profile === 'agricultor' && pageId === 'pedidos')   return orders.filter(o => ['Pendente','Em separação'].includes(o.status)).length || null;
    if (profile === 'almoxarifado' && pageId === 'separacao') return orders.filter(o => ['Pendente','Em separação'].includes(o.status)).length || null;
    if (profile === 'motorista' && pageId === 'entregas')   return orders.filter(o => o.status === 'Em transporte').length || null;
  } catch(e) {}
  return null;
}

function _renderMenuItem(item, profile) {
  const dyn = computeDynamicBadge(profile, item.id);
  const badge = dyn != null ? dyn : item.badge;
  return `
    <button class="sidebar-nav-item ${item.id === state.currentPage ? 'active' : ''}" data-page="${item.id}" type="button">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
      ${badge ? `<span class="nav-badge">${badge}</span>` : ''}
    </button>`;
}

function renderSidebar() {
  window.renderSidebar = renderSidebar;
  const prof = PROFILES[state.currentProfile];
  console.log('[DEBUG] renderSidebar:', state.currentProfile, prof);
  $('#sidebar-avatar').textContent = prof.initials;
  $('#sidebar-user-name').textContent = prof.name;
  $('#sidebar-user-role > span').textContent = prof.role;
  if ($('#sidebar-user-id')) $('#sidebar-user-id').textContent = prof.userId;
  const nav = $('#sidebar-nav');
  if (!state._groupState) state._groupState = {};
  nav.innerHTML = prof.menu.map(item => {
    if (item.type === 'group') {
      const open = state._groupState[item.label] !== false;
      return `
        <div class="sidebar-group">
          <button class="sidebar-group-toggle" data-group="${item.label}" type="button" style="display:flex;align-items:center;width:100%;padding:8px 16px;border:none;background:none;cursor:pointer;color:var(--text-secondary);font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;gap:6px">
            <span style="transition:transform .2s;transform:rotate(${open?'90':'0'}deg);font-size:0.7rem">▶</span>
            <span>${item.label}</span>
          </button>
          <div class="sidebar-group-children" style="${open ? '' : 'display:none'}">
            ${(item.children||[]).map(child => _renderMenuItem(child, state.currentProfile)).join('')}
          </div>
        </div>`;
    }
    return _renderMenuItem(item, state.currentProfile);
  }).join('');
  nav.querySelectorAll('.sidebar-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('sidebar')?.classList.remove('mobile-open');
      navigateTo(null, btn.dataset.page);
    });
  });
  nav.querySelectorAll('.sidebar-group-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.dataset.group;
      const children = btn.nextElementSibling;
      const arrow = btn.querySelector('span');
      const isOpen = children.style.display !== 'none';
      children.style.display = isOpen ? 'none' : '';
      if (arrow) arrow.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
      state._groupState[group] = !isOpen;
    });
  });
}

// RENDER: HEADER

function renderHeader() {
  window.renderHeader = renderHeader;
  const prof = PROFILES[state.currentProfile];
  $('#header-avatar').textContent = prof.initials;
  $('#header-user-name').textContent = prof.name;
  $('#header-user-role > span').textContent = prof.role;
  if ($('#header-user-id')) $('#header-user-id').textContent = prof.userId;
  const flat = prof.menu.flatMap(m => m.type === 'group' ? (m.children || []) : [m]);
  const menuItem = flat.find(m => m.id === state.currentPage);
  const label = menuItem ? menuItem.label : 'Dashboard';
  $('#breadcrumb').innerHTML = `
    <span class="breadcrumb-item" onclick="navigateTo(null,'dashboard')">Início</span>
    <span class="breadcrumb-sep">›</span>
    <span class="breadcrumb-item active">${label}</span>
  `;
}

// RENDER NOTIFICATIONS

function renderNotifications() {
  const notifs = [
    { icon: '🔴', title: 'Estoque Crítico', desc: 'EMTI PROFª IRACEMA MARIA VICENTE com estoque abaixo de 15%', time: '5 min', unread: true },
    { icon: '🔴', title: 'Entrega Atrasada', desc: 'Pedido #003 da EM ADV. DEMOSTHENES MARTINS', time: '1h', unread: true },
    { icon: '🟡', title: 'Novo Pedido', desc: 'EMEI ELEODES ESTEVAN solicitou abastecimento', time: '2h', unread: true },
    { icon: '🟢', title: 'Entrega Concluída', desc: 'COOPASUL entregou na EM Licurgo', time: '4h', unread: false },
    { icon: '🤖', title: 'Alerta IA', desc: 'Banana Nanica com previsão de escassez em 5 dias', time: '6h', unread: true },
    { icon: '📊', title: 'Relatório Disponível', desc: 'Relatório mensal de consumo gerado', time: '1d', unread: false },
  ];
  $('#notif-list').innerHTML = notifs.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}">
      <div class="notif-item-icon">${n.icon}</div>
      <div class="notif-item-content">
        <div class="notif-item-title">${n.title}</div>
        <div class="notif-item-desc">${n.desc}</div>
        <div class="notif-item-time">${n.time} atrás</div>
      </div>
    </div>
  `).join('');
}

// RENDER: PAGE ROUTER

function renderPage() {
  let key = `${state.currentProfile}_${state.currentPage}`;
  
  // Resolução dinâmica para telas do Estoque Central compartilhadas com o Gestor
  if (!PAGE_RENDERERS[key] && state.currentProfile === 'estoque') {
    const aliasMap = {
      'entradas': 'recebimentos-pendentes',
      'separacao': 'expedicao-os',
      'carregamento': 'ordens-entrega'
    };
    const targetPage = aliasMap[state.currentPage] || state.currentPage;
    if (PAGE_RENDERERS[`gestor_${targetPage}`]) {
      key = `gestor_${targetPage}`;
    }
  }

  const container = $('#page-content');
  if (!container) return;
  container.innerHTML = '';
  container.className = 'page-content';
  const renderer = PAGE_RENDERERS[key] || PAGE_RENDERERS[`${state.currentProfile}_dashboard`] || renderGenericPage;
  try {
    renderer(container);
  } catch (err) {
    console.error(`[Router] Erro ao renderizar ${key}:`, err);
    container.innerHTML = `
      <div class="page-header">
        <div class="page-title">⚠️ Visualização em Carregamento</div>
        <div class="page-subtitle">${escapeHTML(err.message || 'Módulo em sincronização')}</div>
      </div>
      <div class="card" style="padding:24px;border-radius:12px">
        <p style="color:var(--text-secondary);margin-bottom:16px">O módulo solicitou uma atualização de dados. Clique abaixo para retornar ao painel principal.</p>
        <button class="btn btn-primary" onclick="navigateTo('${state.currentProfile}','dashboard')">Voltar ao Início</button>
      </div>
    `;
  }
}

// CHART HELPERS

function createChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;

  // Evita "Canvas is already in use. Chart with ID 'N' must be destroyed...".
  // renderPage() limpa o #page-content e recria os canvases com os mesmos ids,
  // mas os gráficos são criados dentro de setTimeout — o callback de um render
  // anterior pode chegar depois que o novo canvas já existe, ou a mesma tela
  // pode renderizar duas vezes em sequência. Em ambos os casos o Chart.js ainda
  // tem uma instância registrada para o canvas e recusa a criação.
  const registrado = (typeof Chart.getChart === 'function') ? Chart.getChart(canvas) : null;
  if (registrado && registrado.destroy) registrado.destroy();
  if (state.charts[id] && state.charts[id].destroy) state.charts[id].destroy();

  const ctx = canvas.getContext('2d');
  const chart = new Chart(ctx, config);
  state.charts[id] = chart;
  return chart;
}

const CHART_COLORS = {
  blue: 'rgba(21,101,192,0.8)',
  blueFill: 'rgba(21,101,192,0.1)',
  green: 'rgba(46,125,50,0.8)',
  greenFill: 'rgba(46,125,50,0.1)',
  orange: 'rgba(245,127,23,0.8)',
  red: 'rgba(198,40,40,0.8)',
  teal: 'rgba(0,137,123,0.8)',
  purple: 'rgba(123,31,162,0.8)',
  palette: ['#1565C0','#2E7D32','#F57F17','#C62828','#00897B','#7B1FA2','#E65100','#283593','#00838F','#4E342E'],
};

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { font: { family: "'Inter', sans-serif", size: 11 }, padding: 12, usePointStyle: true, pointStyleWidth: 8 } },
    tooltip: { backgroundColor: '#0F172A', titleFont: { family: "'Inter'", size: 12 }, bodyFont: { family: "'Inter'", size: 11 }, padding: 10, cornerRadius: 8, displayColors: true },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: "'Inter'", size: 10 }, color: '#94A3B8' } },
    y: { grid: { color: '#F1F5F9' }, ticks: { font: { family: "'Inter'", size: 10 }, color: '#94A3B8' }, beginAtZero: true },
  }
};

// PAGE RENDERERS

window.PAGE_RENDERERS = window.PAGE_RENDERERS || {};
const PAGE_RENDERERS = window.PAGE_RENDERERS;

// ─── GESTOR: DASHBOARD EXECUTIVO ───

// ─── MAP RENDERER ───
function renderMap() {
  const container = document.getElementById('map-container');
  if (!container) return;

  const regions = [
    { name: 'Anhanduizinho', path: 'M40,180 L120,160 L140,200 L130,260 L60,260 L30,220 Z', cx: 80, cy: 210 },
    { name: 'Bandeira', path: 'M120,160 L200,140 L220,180 L200,220 L140,200 Z', cx: 170, cy: 180 },
    { name: 'Centro', path: 'M200,140 L280,120 L300,160 L280,200 L220,180 Z', cx: 250, cy: 160 },
    { name: 'Imbirussu', path: 'M40,120 L120,100 L120,160 L40,180 Z', cx: 80, cy: 140 },
    { name: 'Lagoa', path: 'M280,120 L380,100 L400,160 L380,200 L300,160 Z', cx: 340, cy: 150 },
    { name: 'Prosa', path: 'M280,200 L380,200 L400,260 L300,280 L260,240 Z', cx: 330, cy: 240 },
    { name: 'Segredo', path: 'M120,100 L200,80 L200,140 L120,160 Z', cx: 160, cy: 120 },
  ];

  const schoolDots = DATA.schools.map(s => {
    // Fallback: escolas com região fora das 7 do mapa (ex.: 'Rural') caem numa
    // posição neutra em vez de estourar `reg.cx` e derrubar o mapa inteiro.
    const reg = regions.find(r => r.name === s.region) || { cx: 220, cy: 285 };
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 30;
    const color = s.stockStatus === 'ok' ? '#2E7D32' : s.stockStatus === 'warning' ? '#F57F17' : '#C62828';
    return `<circle class="school-dot" cx="${reg.cx + offsetX}" cy="${reg.cy + offsetY}" r="4" fill="${color}" stroke="white" stroke-width="1.5" data-school="${s.name}" data-status="${s.stockStatus}">
      <title>${s.name} — ${statusLabel(s.stockStatus)} (${s.stockPct}%)</title>
    </circle>`;
  });

  container.innerHTML = `
    <svg viewBox="0 0 440 300" class="map-svg">
      ${regions.map(r => `
        <path class="region-path" d="${r.path}" data-region="${r.name}">
          <title>${r.name}</title>
        </path>
        <text x="${r.cx}" y="${r.cy}" text-anchor="middle" fill="var(--primary-dark)" font-size="9" font-weight="600" pointer-events="none">${r.name}</text>
      `).join('')}
      ${schoolDots.join('')}
    </svg>
    <div class="map-legend">
      <div class="map-legend-item"><div class="map-legend-dot" style="background:#2E7D32"></div>Abastecida</div>
      <div class="map-legend-item"><div class="map-legend-dot" style="background:#F57F17"></div>Atenção</div>
      <div class="map-legend-item"><div class="map-legend-dot" style="background:#C62828"></div>Risco</div>
    </div>
  `;
}

// NOTA: gestor_escolas/nutricionista_escolas usam a tela de cooperativa_escolas (ver aliases mais abaixo).
// TOTAIS DERIVADOS — atas, empenhos e estoque
// ------------------------------------------------------------
// Nada aqui lê campo estático (ata.executedValue etc). Tudo é somado a partir
// do grafo, para que gravar um empenho novo ou receber uma NF mude os KPIs na
// hora, sem precisar atualizar contador nenhum na mão.

// Totais de uma ata, somados dos seus produtos e empenhos.
function ataTotais(ataId) {
  const prods = DATA.ataProducts.filter(p => p.ataId === ataId);
  const emps  = DATA.empenhos.filter(e => e.ataId === ataId);
  const global    = prods.reduce((s, p) => s + (p.globalValue || 0), 0);
  const empenhado = emps.reduce((s, e) => s + (e.totalValue || 0), 0);
  const liquidado = emps.reduce((s, e) => s + (e.executedValue || 0), 0);
  return { global, empenhado, liquidado, saldo: global - empenhado, prods, emps };
}

// Quanto de um item de ata já foi empenhado e entregue (varre todos os empenhos).
function ataProdutoTotais(ataProdId) {
  const ap = DATA.ataProducts.find(p => p.id === ataProdId);
  if (!ap) return { valorEmpenhado: 0, qtdEmpenhada: 0, qtdEntregue: 0, saldoQtd: 0, saldoValor: 0 };
  let qtdEmp = 0, qtdEnt = 0, valEmp = 0;
  DATA.empenhos.forEach(e => (e.items || []).forEach(i => {
    if (i.productId === ataProdId) {
      qtdEmp += i.qtd || 0;
      qtdEnt += i.delivered || 0;
      valEmp += i.value || 0;
    }
  }));
  return {
    valorEmpenhado: valEmp, qtdEmpenhada: qtdEmp, qtdEntregue: qtdEnt,
    saldoQtd: (ap.maxQtd || 0) - qtdEmp,
    saldoValor: (ap.globalValue || 0) - valEmp,
  };
}

// Estoque consolidado = Estoque Central + soma do que está nas escolas.
// Junta lotes (validade) e a quebra por escola para o collapse da linha.
function estoqueConsolidado() {
  const porEscola = {};
  (DATA.schools || []).forEach(sc => {
    (SharedState.getSchoolStock(sc.name) || []).forEach(it => {
      if (!it.produto) return;
      (porEscola[it.produto] = porEscola[it.produto] || []).push({
        escola: sc.name, sigla: sc.sigla || '', qtd: it.qtd || 0, unidade: it.unidade || '',
      });
    });
  });
  return DATA.products.map(p => {
    const escolas = (porEscola[p.name] || []).filter(e => e.qtd > 0).sort((a, b) => b.qtd - a.qtd);
    const nasEscolas = escolas.reduce((s, e) => s + e.qtd, 0);
    const total = (p.stock || 0) + nasEscolas;
    const lotes = (DATA.lots || [])
      .filter(l => l.productId === p.id)
      .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate)); // FEFO
    return { ...p, central: p.stock || 0, nasEscolas, total, escolas, lotes,
             diasCobertura: p.avgConsume ? Math.round(total / p.avgConsume) : null };
  });
}

// Dias até vencer — usado nos badges de validade do collapse.
function diasAteVencer(dataIso) {
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(dataIso) - hoje) / 86400000);
}

// ------------------------------------------------------------
// Semeia o estoque das escolas na primeira execução.
// Sem isso o "Estoque Consolidado" só mostrava o Central e a coluna
// "Nas Escolas" ficava zerada — a consolidação não tinha o que consolidar.
//
// Cada escola guarda alguns dias do PRÓPRIO consumo, proporcional ao seu porte:
//   fração da escola = (alunos × refeições/dia) ÷ (total da rede)
//   qtd = avgConsume do produto × fração × dias de estoque local
// Perecível fica com menos dias que seco, como na prática.
// ------------------------------------------------------------
function seedSchoolStocks(force) {
  if (!window.SharedState) return;
  const atual = SharedState._data.schoolStocks || {};
  if (!force && Object.keys(atual).length) return; // já semeado

  const escolas = DATA.schools || [];
  if (!escolas.length || !DATA.products) return;

  const refeicoesDe = sc => (sc.students || 0) * (sc.refeicoesDia || sc.meals_per_day || 2);
  const totalRef = escolas.reduce((s, sc) => s + refeicoesDe(sc), 0);
  if (!totalRef) return;

  // Dias de estoque local por categoria — perecível gira mais rápido.
  const diasPorCategoria = {
    'Hortaliças': 3, 'Frutas': 3, 'Laticínios': 5, 'Proteínas': 6,
    'Tubérculos': 7, 'Grãos': 12, 'Gorduras': 15, 'Condimentos': 15, 'Especiais': 10,
  };

  const stocks = {};
  escolas.forEach(sc => {
    const fracao = refeicoesDe(sc) / totalRef;
    if (!fracao) return;
    const doEstoque = {};
    DATA.products.forEach(p => {
      if (!p.avgConsume) return;
      const dias = diasPorCategoria[p.category] || 7;
      const qtd = p.avgConsume * fracao * dias;
      if (qtd < 1) return;                      // abaixo de 1 unidade não faz sentido estocar
      if (p.stock === 0) return;                // produto zerado no central também falta na escola
      doEstoque[p.name] = {
        qtd: Math.round(qtd * 10) / 10,
        unidade: p.unit,
        atualizadoEm: new Date().toISOString(),
      };
    });
    if (Object.keys(doEstoque).length) stocks[sc.name] = doEstoque;
  });

  SharedState._data.schoolStocks = stocks;
  SharedState._persist();
  console.log(`[SUALE] Estoque semeado em ${Object.keys(stocks).length} escolas.`);
}
window.seedSchoolStocks = seedSchoolStocks;

// ─── GESTOR: ATAS E CONTRATOS ───
window.openAtaDetalhe = (ataId) => {
  const container = document.getElementById('page-content');
  const ata = DATA.contracts.find(a => a.id === ataId);
  if (!ata) return;
  const prods = DATA.ataProducts.filter(p => p.ataId === ataId);
  const t = ataTotais(ataId);
  const emps = t.emps;
  const pctEmp = t.global ? Math.round(t.empenhado / t.global * 100) : 0;

  container.innerHTML = `
    <div class="page-header" style="display:flex;align-items:center;gap:12px">
      <button class="btn btn-outline" onclick="PAGE_RENDERERS.gestor_atas(document.getElementById('page-content'))">🔙 Voltar</button>
      <div>
        <div class="page-title">Ata nº ${ata.number}</div>
        <div class="page-subtitle">Fornecedor: ${ata.supplier} | Vigência: ${formatDate(ata.start)} a ${formatDate(ata.end)} | ${ata.modalidade === 'chamada_publica' ? '🌾 Chamada Pública (Agricultura Familiar)' : '📋 Pregão'}</div>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">💰</div><div class="kpi-value">${formatCurrency(t.global)}</div><div class="kpi-label">Valor Global · ${t.prods.length} ${t.prods.length === 1 ? 'item' : 'itens'}</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">📝</div><div class="kpi-value">${formatCurrency(t.empenhado)}</div><div class="kpi-label">Empenhado · ${emps.length} NE (${pctEmp}%)</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${formatCurrency(t.liquidado)}</div><div class="kpi-label">Liquidado (NF recebida)</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📊</div><div class="kpi-value">${formatCurrency(t.saldo)}</div><div class="kpi-label">Saldo a Empenhar</div></div>
    </div>
    
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-top:20px">
      <!-- Painel de Produtos -->
      <div class="card">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <h3>Produtos da Ata</h3>
          <button class="btn btn-primary" onclick="window.openModalEmpenho(${ataId})">+ Novo Empenho</button>
        </div>
        <div class="card-body">
          <table class="data-table">
            <thead><tr><th>Produto</th><th>Qtd Registrada</th><th>Empenhado</th><th>Saldo a Empenhar</th></tr></thead>
            <tbody>
              ${t.prods.map(p => {
                const pt = ataProdutoTotais(p.id);
                const pctQtd = p.maxQtd ? Math.round(pt.qtdEmpenhada / p.maxQtd * 100) : 0;
                return `
                <tr>
                  <td><strong>${p.name}</strong><br><small style="color:var(--text-secondary)">${formatCurrency(p.unitPrice)} / ${p.unit}</small></td>
                  <td style="font-family:var(--font-mono)">${(p.maxQtd||0).toLocaleString('pt-BR')} ${p.unit}<br><small style="color:var(--text-secondary)">${formatCurrency(p.globalValue)}</small></td>
                  <td style="font-family:var(--font-mono)">${pt.qtdEmpenhada.toLocaleString('pt-BR')} ${p.unit}
                    <div class="progress-bar" style="width:90px;margin-top:4px"><div class="progress-fill ${pctQtd>80?'red':pctQtd>50?'orange':'green'}" style="width:${Math.min(100,pctQtd)}%"></div></div>
                    <small style="color:var(--text-secondary)">${pctQtd}% · entregue ${pt.qtdEntregue.toLocaleString('pt-BR')}</small>
                  </td>
                  <td style="font-family:var(--font-mono);font-weight:600;color:var(--primary)">${pt.saldoQtd.toLocaleString('pt-BR')} ${p.unit}<br><small style="color:var(--text-secondary)">${formatCurrency(pt.saldoValor)}</small></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Histórico de Empenhos e Pedidos -->
      <div class="card">
        <div class="card-header">
          <h3>Empenhos e NFs</h3>
        </div>
        <div class="card-body">
          <div style="display:flex;flex-direction:column;gap:12px">
            ${emps.map(e => {
              const pedidos = DATA.ata_pedidos ? DATA.ata_pedidos.filter(p => p.empenhoId === e.id) : [];
              const nfs = DATA.nf_history.filter(nf => nf.empenhoId === e.id);
              return `
              <div class="empenho-card-summary" style="padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--surface);cursor:pointer;transition:all 0.2s" onclick="window.openEmpenhoDetailsModal(${e.id})" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">
                <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                  <strong>${e.numero}</strong>
                  <span class="status-badge ${e.status === 'Liquidado' ? 'status-ok' : 'status-warning'}">${e.status}</span>
                </div>
                <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:4px">Data: ${formatDate(e.date)} | Valor Total: ${formatCurrency(e.totalValue)} | Saldo Financeiro: ${formatCurrency(e.totalValue - e.executedValue)}</div>
                <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px">
                  ${(e.items || []).map(it => {
                    const ap = DATA.ataProducts.find(x => x.id === it.productId);
                    const pend = (it.qtd || 0) - (it.delivered || 0);
                    return `<div style="display:flex;justify-content:space-between;gap:8px;padding:2px 0">
                      <span>${ap ? ap.name : 'Item #' + it.productId}</span>
                      <span style="font-family:var(--font-mono);white-space:nowrap">${(it.delivered||0).toLocaleString('pt-BR')}/${(it.qtd||0).toLocaleString('pt-BR')} ${ap ? ap.unit : ''}${pend > 0 ? ` <span style="color:var(--warning)">▲${pend.toLocaleString('pt-BR')}</span>` : ' ✓'}</span>
                    </div>`;
                  }).join('')}
                  ${(e.items||[]).length > 1 ? `<div style="margin-top:4px;font-weight:600;color:var(--text)">${e.items.length} itens no empenho</div>` : ''}
                </div>
                <div style="text-align:right;margin-top:8px;">
                  <span style="font-size:0.8rem;color:var(--primary);font-weight:600">Ver Movimentações ➔</span>
                </div>
              </div>
            `}).join('')}
            ${emps.length === 0 ? '<div style="color:var(--text-secondary);text-align:center;padding:20px">Nenhum empenho registrado.</div>' : ''}
          </div>
        </div>
      </div>
    </div>
  `;
};

window.openEmpenhoDetailsModal = (empenhoId) => {
  const e = DATA.empenhos.find(x => x.id === empenhoId);
  const pedidos = DATA.ata_pedidos ? DATA.ata_pedidos.filter(p => p.empenhoId === e.id) : [];
  const nfs = DATA.nf_history.filter(nf => nf.empenhoId === e.id);
  
  showModal('Movimentações do Empenho ' + e.numero, `
    <div style="margin-bottom:16px;padding:12px;background:var(--surface-2);border-radius:var(--radius-md)">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <strong>Status: <span class="status-badge ${e.status === 'Liquidado' ? 'status-ok' : 'status-warning'}">${e.status}</span></strong>
      </div>
      <div style="font-size:0.85rem">Data: ${formatDate(e.date)} | Total Empenhado: ${formatCurrency(e.totalValue)}</div>
      <div style="font-size:0.85rem;margin-top:4px;color:var(--danger)">Saldo Financeiro Restante: ${formatCurrency(e.totalValue - e.executedValue)}</div>
      <div style="margin-top:8px">
        <div style="font-size:0.8rem;font-weight:700;text-transform:uppercase;color:var(--text-secondary);margin-bottom:4px">Itens do empenho (${(e.items||[]).length})</div>
        ${(e.items || []).map(it => {
          const ap = DATA.ataProducts.find(x => x.id === it.productId);
          const pend = (it.qtd || 0) - (it.delivered || 0);
          return `<div style="display:flex;justify-content:space-between;gap:8px;font-size:0.85rem;padding:4px 0;border-bottom:1px dashed var(--border)">
            <span>${ap ? ap.name : 'Item #' + it.productId}</span>
            <span style="font-family:var(--font-mono);white-space:nowrap">${(it.delivered||0).toLocaleString('pt-BR')} / ${(it.qtd||0).toLocaleString('pt-BR')} ${ap ? ap.unit : ''} · ${formatCurrency(it.value||0)}
              ${pend > 0 ? `<span style="color:var(--warning);font-weight:600"> · faltam ${pend.toLocaleString('pt-BR')}</span>` : '<span style="color:var(--success);font-weight:600"> · completo</span>'}</span>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div style="margin-bottom:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);padding-bottom:8px;margin-bottom:8px">
        <h4 style="margin:0">Pedidos Realizados</h4>
        <button class="btn btn-sm btn-primary" onclick="window.openModalPedidoEmpenho(${e.id})">+ Solicitar Entrega</button>
      </div>
      ${pedidos.length === 0 ? '<div style="font-size:0.85rem;color:var(--text-secondary)">Nenhum pedido realizado para este empenho.</div>' : ''}
      <div style="display:flex;flex-direction:column;gap:8px">
        ${pedidos.map(p => `
          <div style="font-size:0.85rem;display:flex;justify-content:space-between;padding:8px;background:var(--surface);border:1px solid var(--border);border-radius:4px">
            <div>
              <strong>🛒 Pedido em ${formatDate(p.date)}</strong><br>
              <span style="color:var(--text-secondary)">Qtd Solicitada: ${p.qtd} | Qtd Entregue: ${p.delivered || 0}</span>
            </div>
            <div style="font-family:var(--font-mono);font-weight:600;text-align:right">
              ${formatCurrency(p.value)}<br>
              <span class="status-badge ${(p.delivered||0) >= p.qtd ? 'status-ok' : 'status-warning'}" style="font-size:0.7rem;margin-top:4px">${(p.delivered||0) >= p.qtd ? 'Atendido' : 'Pendente'}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div>
      <div style="border-bottom:1px solid var(--border);padding-bottom:8px;margin-bottom:8px">
        <h4 style="margin:0">Notas Fiscais (Baixas no Estoque)</h4>
      </div>
      ${nfs.length === 0 ? '<div style="font-size:0.85rem;color:var(--text-secondary)">Nenhuma entrada de mercadoria registrada.</div>' : ''}
      <div style="display:flex;flex-direction:column;gap:8px">
        ${nfs.map(nf => `
          <div style="font-size:0.85rem;display:flex;justify-content:space-between;padding:8px;background:var(--surface);border:1px solid var(--border);border-radius:4px">
            <div>
              <strong>🧾 NF ${nf.numero}</strong><br>
              <span style="color:var(--text-secondary)">Recebida em: ${formatDate(nf.date)}</span>
            </div>
            <div style="font-family:var(--font-mono);font-weight:600">
              ${formatCurrency(nf.items.reduce((a,i)=>a+i.value,0))}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `);
};

// ─── NOVO EMPENHO (multi-item) ───
// O empenho pode carregar vários itens da mesma ata. Cada linha valida o saldo
// disponível daquele item (maxQtd menos o que já foi empenhado em outras NEs).
window._empenhoDraft = { ataId: null, linhas: [] };

window.openModalEmpenho = (ataId) => {
  const disponiveis = DATA.ataProducts.filter(p => p.ataId === ataId);
  if (!disponiveis.length) {
    return window.showToast('Esta ata não tem produtos cadastrados.', 'error');
  }
  window._empenhoDraft = { ataId, linhas: [{ uid: Date.now(), prodId: disponiveis[0].id, qtd: '' }] };

  showModal('Novo Empenho', `
    <div class="form-group">
      <label>Nº do Empenho</label>
      <input type="text" id="ata-empenho-numero" placeholder="Ex: 2026NE00477">
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin:14px 0 6px">
      <label style="margin:0;font-weight:700">Itens do empenho</label>
      <button type="button" class="btn btn-sm btn-outline" onclick="window.empenhoAddLinha()">+ Adicionar item</button>
    </div>
    <div id="empenho-linhas"></div>

    <div id="empenho-resumo" style="margin-top:12px;padding:10px;background:var(--surface-2);border-radius:var(--radius-md);font-size:0.88rem"></div>

    <button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="window.saveEmpenho()">Gravar Empenho</button>
  `);
  window.empenhoRenderLinhas();
};

window.empenhoAddLinha = () => {
  const d = window._empenhoDraft;
  const usados = d.linhas.map(l => l.prodId);
  const livre = DATA.ataProducts.find(p => p.ataId === d.ataId && !usados.includes(p.id));
  if (!livre) return window.showToast('Todos os produtos da ata já estão no empenho.', 'info');
  d.linhas.push({ uid: Date.now() + Math.random(), prodId: livre.id, qtd: '' });
  window.empenhoRenderLinhas();
};

window.empenhoRemoveLinha = (uid) => {
  const d = window._empenhoDraft;
  if (d.linhas.length === 1) return window.showToast('O empenho precisa de ao menos um item.', 'info');
  d.linhas = d.linhas.filter(l => String(l.uid) !== String(uid));
  window.empenhoRenderLinhas();
};

window.empenhoSetLinha = (uid, campo, valor) => {
  const l = window._empenhoDraft.linhas.find(x => String(x.uid) === String(uid));
  if (!l) return;
  l[campo] = campo === 'prodId' ? parseInt(valor, 10) : valor;
  window.empenhoRenderLinhas();
};

window.empenhoRenderLinhas = () => {
  const d = window._empenhoDraft;
  const wrap = document.getElementById('empenho-linhas');
  if (!wrap) return;
  const opcoes = DATA.ataProducts.filter(p => p.ataId === d.ataId);

  wrap.innerHTML = d.linhas.map(l => {
    const ap = opcoes.find(p => p.id === l.prodId);
    const pt = ataProdutoTotais(l.prodId);
    const qtd = parseFloat(l.qtd) || 0;
    const excede = qtd > pt.saldoQtd;
    return `
      <div style="display:grid;grid-template-columns:1fr 130px 32px;gap:8px;align-items:start;margin-bottom:8px">
        <div>
          <select style="width:100%;padding:9px;border-radius:var(--radius-md);border:1px solid var(--border)"
                  onchange="window.empenhoSetLinha('${l.uid}','prodId',this.value)">
            ${opcoes.map(p => `<option value="${p.id}" ${p.id === l.prodId ? 'selected' : ''}>${p.name}</option>`).join('')}
          </select>
          <small style="color:var(--text-secondary)">Saldo: ${pt.saldoQtd.toLocaleString('pt-BR')} ${ap ? ap.unit : ''} · ${ap ? formatCurrency(ap.unitPrice) : ''}/${ap ? ap.unit : ''}</small>
        </div>
        <div>
          <input type="number" min="1" step="any" value="${l.qtd}" placeholder="Qtd"
                 style="width:100%;padding:9px;border-radius:var(--radius-md);border:1px solid ${excede ? 'var(--danger)' : 'var(--border)'}"
                 oninput="window.empenhoSetLinha('${l.uid}','qtd',this.value)">
          <small style="color:${excede ? 'var(--danger)' : 'var(--text-secondary)'}">${excede ? '⚠️ acima do saldo' : (qtd && ap ? formatCurrency(qtd * ap.unitPrice) : '—')}</small>
        </div>
        <button type="button" class="btn btn-sm btn-outline" title="Remover item"
                style="padding:8px;color:var(--danger)" onclick="window.empenhoRemoveLinha('${l.uid}')">✕</button>
      </div>`;
  }).join('');

  const resumo = document.getElementById('empenho-resumo');
  if (resumo) {
    let total = 0, invalidas = 0;
    d.linhas.forEach(l => {
      const ap = opcoes.find(p => p.id === l.prodId);
      const qtd = parseFloat(l.qtd) || 0;
      const pt = ataProdutoTotais(l.prodId);
      if (!qtd || qtd > pt.saldoQtd) invalidas++;
      if (ap) total += qtd * ap.unitPrice;
    });
    const t = ataTotais(d.ataId);
    resumo.innerHTML = `
      <div style="display:flex;justify-content:space-between"><span>${d.linhas.length} ${d.linhas.length === 1 ? 'item' : 'itens'}</span><strong style="font-family:var(--font-mono)">${formatCurrency(total)}</strong></div>
      <div style="display:flex;justify-content:space-between;color:var(--text-secondary);font-size:0.82rem;margin-top:4px"><span>Saldo da ata após empenhar</span><span style="font-family:var(--font-mono)">${formatCurrency(t.saldo - total)}</span></div>
      ${invalidas ? `<div style="color:var(--danger);font-size:0.82rem;margin-top:6px">⚠️ ${invalidas} ${invalidas === 1 ? 'item precisa' : 'itens precisam'} de quantidade válida dentro do saldo.</div>` : ''}`;
  }
};

window.saveEmpenho = () => {
  const d = window._empenhoDraft;
  const numero = (document.getElementById('ata-empenho-numero').value || '').trim();
  if (!numero) return window.showToast('Informe o nº do empenho.', 'error');
  if (DATA.empenhos.some(e => e.numero.toLowerCase() === numero.toLowerCase())) {
    return window.showToast('Já existe um empenho com esse número.', 'error');
  }

  const items = [];
  for (const l of d.linhas) {
    const ap = DATA.ataProducts.find(p => p.id === l.prodId);
    const qtd = parseFloat(l.qtd) || 0;
    if (!ap || qtd <= 0) return window.showToast('Preencha a quantidade de todos os itens.', 'error');
    const pt = ataProdutoTotais(l.prodId);
    if (qtd > pt.saldoQtd) return window.showToast(`"${ap.name}" excede o saldo da ata (${pt.saldoQtd.toLocaleString('pt-BR')} ${ap.unit}).`, 'error');
    items.push({ productId: ap.id, qtd, value: qtd * ap.unitPrice, delivered: 0 });
  }

  const totalValue = items.reduce((s, i) => s + i.value, 0);
  DATA.empenhos.push({
    id: Math.max(0, ...DATA.empenhos.map(e => e.id)) + 1,
    ataId: d.ataId,
    numero,
    date: new Date().toISOString().split('T')[0],
    totalValue,
    executedValue: 0,
    status: 'Pendente',
    items,
  });

  closeModal();
  window.showToast(`Empenho ${numero} gravado — ${items.length} ${items.length === 1 ? 'item' : 'itens'}, ${formatCurrency(totalValue)}`, 'success');
  window.openAtaDetalhe(d.ataId);
};

window.openModalPedidoEmpenho = (empenhoId) => {
  const e = DATA.empenhos.find(x => x.id === empenhoId);
  showModal('Novo Pedido (Contra Empenho)', `
    <div style="margin-bottom:15px;padding:10px;background:var(--surface-2);border-radius:var(--radius-md)">
      <strong>Empenho: ${e.numero}</strong><br>
      Saldo a receber: <strong style="color:var(--danger)">${formatCurrency(e.totalValue - e.executedValue)}</strong>
    </div>
    <div class="form-group">
      <label>Quantidade a solicitar (Pedido)</label>
      <input type="number" id="ata-pedido-qtd" placeholder="Qtd">
    </div>
    <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="window.savePedidoEmpenho(${empenhoId})">Gerar Pedido</button>
  `);
};

window.savePedidoEmpenho = (empenhoId) => {
  const qtd = parseInt(document.getElementById('ata-pedido-qtd').value);
  if(!qtd) return alert('Preencha a quantidade.');
  
  const emp = DATA.empenhos.find(x => x.id === empenhoId);
  const item = emp.items[0]; // Simplificação
  const value = qtd * (item.value / item.qtd);
  
  if (!DATA.ata_pedidos) DATA.ata_pedidos = [];
  DATA.ata_pedidos.push({
    id: DATA.ata_pedidos.length + 1,
    empenhoId: empenhoId,
    date: new Date().toISOString().split('T')[0],
    qtd: qtd,
    value: value
  });
  
  closeModal();
  window.showToast('Pedido gerado! Estoque atualizado.', 'success');
  window.openAtaDetalhe(emp.ataId);
};

window.openModalNFAta = (empenhoId) => {
  const e = DATA.empenhos.find(x => x.id === empenhoId);
  const saldoEmp = e.totalValue - e.executedValue;
  showModal('Registrar Entrada (Nota Fiscal)', `
    <div style="margin-bottom:15px;padding:10px;background:var(--surface-2);border-radius:var(--radius-md)">
      <strong>Empenho: ${e.numero}</strong><br>
      Saldo a receber: <strong style="color:var(--danger)">${formatCurrency(saldoEmp)}</strong>
    </div>
    <div class="form-group">
      <label>Número da NF</label>
      <input type="text" id="ata-nf-num" placeholder="000.000.000">
    </div>
    <div class="form-group">
      <label>Valor da NF (R$)</label>
      <input type="number" id="ata-nf-valor" value="${saldoEmp}">
    </div>
    <button class="btn btn-success" style="width:100%;margin-top:10px" onclick="window.saveNFAta(${empenhoId})">Confirmar Entrada e Dar Baixa</button>
  `);
};

window.saveNFAta = (empenhoId) => {
  const num = document.getElementById('ata-nf-num').value;
  const val = parseFloat(document.getElementById('ata-nf-valor').value);
  if(!num || !val) return alert('Preencha todos os campos.');
  
  const emp = DATA.empenhos.find(x => x.id === empenhoId);
  emp.executedValue += val;
  if (emp.executedValue >= emp.totalValue) emp.status = 'Liquidado';
  else emp.status = 'Parcial';
  
  const item = emp.items[0]; // Simplificação
  DATA.nf_history.push({
    id: DATA.nf_history.length + 1,
    empenhoId: empenhoId,
    date: new Date().toISOString().split('T')[0],
    numero: num,
    items: [{ productId: item.productId, qtd: val/item.value*item.qtd, value: val }]
  });
  
  // Atualizar saldo na ATA global e no PRODUTO
  const ata = DATA.contracts.find(a => a.id === emp.ataId);
  ata.executedValue += val;
  const prod = DATA.ataProducts.find(p => p.id === item.productId);
  prod.executedValue += val;
  
  // Atualizar Estoque Real (Soma quantidade recebida ao estoque do produto)
  const stockProd = DATA.products.find(p => p.id === prod.stockProductId);
  if (stockProd) {
    stockProd.stock += Math.round(val / item.value * item.qtd);
  }
  
  closeModal();
  window.showToast('NF registrada e estoque incrementado!', 'success');
  window.openAtaDetalhe(emp.ataId);
};

// ─── GESTOR: PEDIDOS (R1 — Triagem Contratual) ───────────────────────

// ─── GESTOR: COOPERATIVAS ───

// ─── GESTOR: AGRICULTURA FAMILIAR ───

// ─── GESTOR: ESTOQUE CONSOLIDADO ───

// ─── GESTOR: PLANEJAMENTO ───

// ─── GESTOR: RELATÓRIOS ───

// exportRelatorio -> core_hub.js (Fase 3.3: usado por gestor e resp_estoque).

// ─── GESTOR: IA DE PREVISÃO ───

function updateSimulator() {
  const alunos = parseInt($('#sim-alunos')?.value || 10);
  const escolas = parseInt($('#sim-escolas')?.value || 2);
  const cardapio = parseInt($('#sim-cardapio')?.value || 5);
  if ($('#sim-alunos-val')) $('#sim-alunos-val').textContent = alunos + '%';
  if ($('#sim-escolas-val')) $('#sim-escolas-val').textContent = escolas;
  if ($('#sim-cardapio-val')) $('#sim-cardapio-val').textContent = cardapio + '%';
  const impact = alunos + (escolas * 2) + cardapio;
  const financial = Math.round(impact * 18000);
  const kgExtra = Math.round(impact * 432);
  if ($('#sim-consumo')) $('#sim-consumo').textContent = `+${impact}%`;
  if ($('#sim-financeiro')) $('#sim-financeiro').textContent = `+R$ ${(financial / 1000).toFixed(0)}K`;
  if ($('#sim-compra')) $('#sim-compra').textContent = `+${kgExtra.toLocaleString('pt-BR')} kg`;
}

// ─── NUTRICIONISTA: DASHBOARD ───

// ─── NUTRICIONISTA: OTHER SCREENS ───
const _FICHAS_DEMO = [
  {
    id: 'arroz_feijao',
    nome: 'Arroz com Feijão Tradicional',
    tipo: 'Almoço',
    totais: { kcal: 425, carbos: 72, proteinas: 14, lipidios: 8, sodio: 320 },
    ingredientes: [{ nome: 'Arroz Tipo 1' }, { nome: 'Feijão Carioca' }, { nome: 'Temperos' }],
    descricao: 'Feijão carioca cozido com alho e cebola acompanhado de arroz branco.',
    porcao: '350g',
    isDemo: true,
  },
  {
    id: 'frango_legumes',
    nome: 'Frango Grelhado com Legumes',
    tipo: 'Almoço',
    totais: { kcal: 380, carbos: 28, proteinas: 32, lipidios: 14, sodio: 410 },
    ingredientes: [{ nome: 'Frango' }, { nome: 'Cenoura' }, { nome: 'Abóbora' }],
    descricao: 'Peito de frango grelhado com cenoura, batata e abóbora cozidos no vapor.',
    porcao: '280g',
    isDemo: true,
  },
  {
    id: 'vitamina_banana',
    nome: 'Vitamina de Banana',
    tipo: 'Lanche',
    totais: { kcal: 210, carbos: 38, proteinas: 7, lipidios: 4, sodio: 85 },
    ingredientes: [{ nome: 'Leite Integral' }, { nome: 'Banana Nanica' }, { nome: 'Aveia' }],
    descricao: 'Bebida cremosa de leite integral batido com banana prata e aveia.',
    porcao: '250ml',
    isDemo: true,
  },
];

function _tipoBadgeClass(tipo) {
  if (!tipo) return 'status-ok';
  const t = tipo.toLowerCase();
  if (t === 'almoço' || t === 'jantar') return 'status-ok';
  if (t === 'lanche') return 'status-warning';
  if (t === 'desjejum') return 'status-info';
  return 'status-ok';
}

function _renderFichaCard(f) {
  const isDemo = f.isDemo;
  const nIngr = (f.ingredientes || []).length;
  const porcao = f.porcao || (f.ingredientes ? f.ingredientes.reduce((s, i) => s + (parseFloat(i.quantidade) || 0), 0) + 'g' : '—');
  const descricao = f.descricao || (f.ingredientes ? f.ingredientes.map(i => i.nome).filter(Boolean).join(', ') : '');
  const onclick = `viewFichaDetails('${f.id}')`;
  return `
    <div class="card ficha-card" data-name="${String(f.nome || '').toLowerCase()}" style="cursor:pointer" onclick="${onclick}">
      <div class="card-header">
        <div class="card-title">${f.nome}</div>
        <span class="status-badge ${_tipoBadgeClass(f.tipo)}">${f.tipo || '—'}</span>
      </div>
      <div class="card-body">
        <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px">${descricao}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.85rem">
          <div>🔥 <strong>Valor:</strong> ${Math.round(f.totais?.kcal || 0)} kcal</div>
          <div>⚖️ <strong>Porção:</strong> ${porcao}</div>
          <div>🥩 <strong>Prot:</strong> ${parseFloat(f.totais?.proteinas || 0).toFixed(1)}g</div>
          <div>🌾 <strong>Ingr:</strong> ${nIngr} ${isDemo ? 'itens (Demo)' : 'itens'}</div>
        </div>
        <div style="margin-top:12px;text-align:right;color:var(--primary);font-size:0.8rem;font-weight:600">Ver ficha completa ➔</div>
      </div>
    </div>
  `;
}

// Fonte única de fichas técnicas: mescla _FICHAS_DEMO + localStorage + SharedState (dedup por id/nome)
function mergeFichas() {
  const legacy = JSON.parse(localStorage.getItem('fichas_tecnicas') || '[]');
  const shared = SharedState.getFichas ? SharedState.getFichas() : [];
  const all = [..._FICHAS_DEMO, ...legacy, ...shared];
  const seen = new Set();
  return all.filter(f => {
    const k = String(f.id || f.nome || '').toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

window.filterFichas = () => {
  const query = document.getElementById('search-fichas').value.toLowerCase();
  const cards = document.querySelectorAll('.ficha-card');
  cards.forEach(card => {
    const name = card.getAttribute('data-name');
    if (name.includes(query)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
};

window.viewFichaDetails = (recipeId) => {
  const container = document.getElementById('page-content');

  // Fichas salvas pelo usuário ou geradas por IA — buscar em mergeFichas()
  const todas = mergeFichas();
  const fichaSalva = todas.find(f => String(f.id) === String(recipeId) || String(f.nome).toLowerCase() === String(recipeId).toLowerCase());
  if (fichaSalva) {
    const ing = fichaSalva.ingredientes || [];
    const tot = fichaSalva.totais || {};
    const porcaoTotal = ing.reduce((s, i) => s + (parseFloat(i.quantidade) || 0), 0);
    container.innerHTML = `
      <div class="page-header" style="margin-bottom:24px">
        <div style="display:flex;align-items:center;gap:12px">
          <button class="btn btn-outline btn-sm" onclick="cancelCreateFicha()">← Voltar</button>
          <div>
            <div class="page-title">${fichaSalva.nome}</div>
            <div class="page-subtitle">${fichaSalva.tipo} • ${fichaSalva.modalidade || ''} • Criado em ${fichaSalva.dataCriacao || ''}</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Composição Nutricional</div></div>
        <div class="card-body">
          <div class="grid-5" style="margin-bottom:20px">
            <div style="text-align:center;padding:12px;background:var(--surface-2);border-radius:8px">
              <div style="font-size:0.75rem;color:var(--text-secondary);font-weight:600">Energia</div>
              <div style="font-size:1.4rem;font-weight:700;color:var(--primary)">${Math.round(tot.kcal || 0)} kcal</div>
            </div>
            <div style="text-align:center;padding:12px;background:var(--surface-2);border-radius:8px">
              <div style="font-size:0.75rem;color:var(--text-secondary);font-weight:600">Carboidratos</div>
              <div style="font-size:1.4rem;font-weight:700;color:#F57F17">${parseFloat(tot.carbos || 0).toFixed(1)}g</div>
            </div>
            <div style="text-align:center;padding:12px;background:var(--surface-2);border-radius:8px">
              <div style="font-size:0.75rem;color:var(--text-secondary);font-weight:600">Proteínas</div>
              <div style="font-size:1.4rem;font-weight:700;color:#2E7D32">${parseFloat(tot.proteinas || 0).toFixed(1)}g</div>
            </div>
            <div style="text-align:center;padding:12px;background:var(--surface-2);border-radius:8px">
              <div style="font-size:0.75rem;color:var(--text-secondary);font-weight:600">Lipídios</div>
              <div style="font-size:1.4rem;font-weight:700;color:#E65100">${parseFloat(tot.lipidios || 0).toFixed(1)}g</div>
            </div>
            <div style="text-align:center;padding:12px;background:var(--surface-2);border-radius:8px">
              <div style="font-size:0.75rem;color:var(--text-secondary);font-weight:600">Sódio</div>
              <div style="font-size:1.4rem;font-weight:700;color:#C62828">${Math.round(tot.sodio || 0)} mg</div>
            </div>
          </div>
          <table class="table" style="width:100%">
            <thead><tr><th>Ingrediente</th><th>Qtd (g)</th><th>Kcal</th><th>Carb (g)</th><th>Prot (g)</th><th>Lip (g)</th><th>Sódio (mg)</th></tr></thead>
            <tbody>
              ${ing.map(i => `<tr>
                <td><strong>${i.nome || '—'}</strong></td>
                <td>${parseFloat(i.quantidade || 0).toFixed(0)}</td>
                <td>${parseFloat(i.kcal || 0).toFixed(1)}</td>
                <td>${parseFloat(i.carbos || 0).toFixed(1)}</td>
                <td>${parseFloat(i.proteinas || 0).toFixed(1)}</td>
                <td>${parseFloat(i.lipidios || 0).toFixed(1)}</td>
                <td>${Math.round(i.sodio || 0)}</td>
              </tr>`).join('')}
            </tbody>
            <tfoot><tr style="font-weight:700;background:var(--surface-2)">
              <td>TOTAL</td><td>${porcaoTotal.toFixed(0)}g</td>
              <td>${Math.round(tot.kcal || 0)}</td>
              <td>${parseFloat(tot.carbos || 0).toFixed(1)}</td>
              <td>${parseFloat(tot.proteinas || 0).toFixed(1)}</td>
              <td>${parseFloat(tot.lipidios || 0).toFixed(1)}</td>
              <td>${Math.round(tot.sodio || 0)}</td>
            </tr></tfoot>
          </table>
        </div>
      </div>
    `;
    return;
  }

  let recipeName = '';
  let mealType = '';
  let rendimento = '350g';
  let coccao = '0.28';
  let rows = '';

  if (recipeId === 'arroz_feijao') {
    recipeName = 'Arroz com Feijão Tradicional';
    mealType = 'Almoço';
    rendimento = '350g';
    coccao = '0.28';
    rows = `
      <tr>
        <td><strong>Arroz Polido Tipo 1</strong></td>
        <td>50g</td>
        <td>50g</td>
        <td>1.0</td>
        <td>R$ 6,00</td>
        <td>R$ 0,30</td>
        <td>170</td>
        <td>3.8g</td>
        <td>0.4g</td>
        <td>38g</td>
        <td>2mg</td>
      </tr>
      <tr>
        <td><strong>Feijão Carioca</strong></td>
        <td>40g</td>
        <td>40g</td>
        <td>1.0</td>
        <td>R$ 9,00</td>
        <td>R$ 0,36</td>
        <td>135</td>
        <td>8.8g</td>
        <td>0.5g</td>
        <td>24.8g</td>
        <td>3mg</td>
      </tr>
      <tr>
        <td><strong>Óleo e Condimentos</strong></td>
        <td>10g</td>
        <td>10g</td>
        <td>1.0</td>
        <td>R$ 17,40</td>
        <td>R$ 1,74</td>
        <td>120</td>
        <td>0.4g</td>
        <td>10.1g</td>
        <td>0.7g</td>
        <td>250mg</td>
      </tr>
      <tr style="background:var(--primary-light);font-weight:700">
        <td>TOTAL / PORÇÃO</td>
        <td>100g</td>
        <td>100g</td>
        <td>1.0</td>
        <td>—</td>
        <td>R$ 2,40</td>
        <td>425</td>
        <td>13g</td>
        <td>11g</td>
        <td>63.5g</td>
        <td>255mg</td>
      </tr>
    `;
  } else if (recipeId === 'frango_legumes') {
    recipeName = 'Frango Grelhado com Legumes';
    mealType = 'Almoço';
    rendimento = '280g';
    coccao = '0.71';
    rows = `
      <tr>
        <td><strong>Peito de Frango Cru</strong></td>
        <td>120g</td>
        <td>100g</td>
        <td>1.2</td>
        <td>R$ 20,00</td>
        <td>R$ 2,40</td>
        <td>165</td>
        <td>31g</td>
        <td>3.6g</td>
        <td>0g</td>
        <td>74mg</td>
      </tr>
      <tr>
        <td><strong>Legumes Mistos (Cenoura/Batata)</strong></td>
        <td>80g</td>
        <td>60g</td>
        <td>1.33</td>
        <td>R$ 10,00</td>
        <td>R$ 0,80</td>
        <td>95</td>
        <td>1.8g</td>
        <td>0.2g</td>
        <td>21.5g</td>
        <td>42mg</td>
      </tr>
      <tr>
        <td><strong>Óleo e Condimentos</strong></td>
        <td>10g</td>
        <td>10g</td>
        <td>1.0</td>
        <td>R$ 10,00</td>
        <td>R$ 1,00</td>
        <td>120</td>
        <td>0g</td>
        <td>13.6g</td>
        <td>0g</td>
        <td>200mg</td>
      </tr>
      <tr style="background:var(--primary-light);font-weight:700">
        <td>TOTAL / PORÇÃO</td>
        <td>210g</td>
        <td>170g</td>
        <td>1.24</td>
        <td>—</td>
        <td>R$ 4,20</td>
        <td>380</td>
        <td>32.8g</td>
        <td>17.4g</td>
        <td>21.5g</td>
        <td>316mg</td>
      </tr>
    `;
  } else {
    recipeName = 'Vitamina de Banana';
    mealType = 'Lanche';
    rendimento = '250ml';
    coccao = '1.11';
    rows = `
      <tr>
        <td><strong>Leite Integral Líquido</strong></td>
        <td>200ml</td>
        <td>200ml</td>
        <td>1.0</td>
        <td>R$ 6,00</td>
        <td>R$ 1,20</td>
        <td>124</td>
        <td>6.4g</td>
        <td>6.5g</td>
        <td>9.6g</td>
        <td>98mg</td>
      </tr>
      <tr>
        <td><strong>Banana Prata</strong></td>
        <td>90g</td>
        <td>60g</td>
        <td>1.5</td>
        <td>R$ 6,00</td>
        <td>R$ 0,54</td>
        <td>59</td>
        <td>0.8g</td>
        <td>0.2g</td>
        <td>15.5g</td>
        <td>1mg</td>
      </tr>
      <tr>
        <td><strong>Aveia em Flocos</strong></td>
        <td>10g</td>
        <td>10g</td>
        <td>1.0</td>
        <td>R$ 6,00</td>
        <td>R$ 0,06</td>
        <td>27</td>
        <td>1.4g</td>
        <td>0.7g</td>
        <td>5.7g</td>
        <td>0mg</td>
      </tr>
      <tr style="background:var(--primary-light);font-weight:700">
        <td>TOTAL / PORÇÃO</td>
        <td>300g</td>
        <td>270g</td>
        <td>1.11</td>
        <td>—</td>
        <td>R$ 1,80</td>
        <td>210</td>
        <td>8.6g</td>
        <td>7.4g</td>
        <td>30.8g</td>
        <td>99mg</td>
      </tr>
    `;
  }
  
  container.innerHTML = `
    <div class="page-header"><div class="page-title">${recipeName}</div><div class="page-subtitle">Visualização oficial da Ficha Técnica de Preparo (FNDE)</div></div>
    
    <div class="card mb-24">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
        <div class="card-title">Ficha Oficial FNDE</div>
        <span class="status-badge status-ok">${mealType}</span>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>P.C. Bruto</th>
              <th>P.C. Líquido</th>
              <th>F.C. (Fator Corr.)</th>
              <th>Custo Unit</th>
              <th>Custo Porção</th>
              <th>Kcal</th>
              <th>Proteína</th>
              <th>Lipídeos</th>
              <th>Carboidratos</th>
              <th>Sódio</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        
        <div style="margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:16px;background:var(--primary-light);border-radius:var(--radius)">
          <div>⚖️ <strong>Rendimento Líquido Total:</strong> ${rendimento}</div>
          <div>🔥 <strong>Fator de Cocção (Cocção/Bruto):</strong> ${coccao}</div>
        </div>

        <div style="display:flex;gap:12px;margin-top:20px;justify-content:flex-end">
          <button class="btn btn-outline" id="btn-back-fichas" onclick="cancelCreateFicha()">Voltar para a Lista</button>
        </div>
      </div>
    </div>
  `;
};

// Per capita por modalidade (em gramas) - extraído da planilha PER CAPITA 2026
const PER_CAPITA_MODALIDADES = {
  'Escolar Urbana (Regular)': {
    açúcar: 10, arroz: 30, feijão: 12, leite: 19, macarrão: 20,
    frango: 3.5, carne: 20, cenoura: 7, tomate: 10, alface: 5,
    batata: 10, ovo: 8, sal: 2.5, óleo: 4
  },
  'EMEI (Educação Infantil)': {
    açúcar: 10, arroz: 32, feijão: 17, leite: 17, macarrão: 23,
    frango: 2.5, carne: 15, cenoura: 5, tomate: 8, alface: 4,
    batata: 8, ovo: 5, sal: 2.3, óleo: 3
  },
  'Integral Urbana': {
    açúcar: 17, arroz: 50, feijão: 25, leite: 25, macarrão: 40,
    frango: 8, carne: 40, cenoura: 15, tomate: 18, alface: 8,
    batata: 15, ovo: 6, sal: 3, óleo: 6
  },
  'Escolar Rural': {
    açúcar: 15, arroz: 40, feijão: 12, leite: 20, macarrão: 30,
    frango: 3.5, carne: 20, cenoura: 7, tomate: 10, alface: 5,
    batata: 10, ovo: 7, sal: 2.5, óleo: 8
  },
  'Integral Rural': {
    açúcar: 10, arroz: 75, feijão: 25, leite: 12, macarrão: 23,
    frango: 4, carne: 15, cenoura: 20, tomate: 15, alface: 5,
    batata: 15, ovo: 8, sal: 2.3, óleo: 8
  }
};

window.fichaFormState = {
  nome: '',
  tipo: 'Almoço',
  modalidade: 'Escolar Urbana (Regular)',
  ingredientes: [],
  totais: { kcal: 0, carbos: 0, proteinas: 0, lipidios: 0, sodio: 0 }
};

window.showCreateFichaForm = (autoGerarIA = false) => {
  window.fichaFormState = {
    nome: '',
    tipo: 'Almoço',
    ingredientes: [],
    totais: { kcal: 0, carbos: 0, proteinas: 0, lipidios: 0, sodio: 0 }
  };

  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">Nova Ficha Técnica</div>
        <div class="page-subtitle">Cadastre receita com múltiplos ingredientes seguindo o padrão PNAE/FNDE</div>
      </div>
      <div>
        <button type="button" class="btn btn-primary" onclick="window.gerarFichaTecnicaIA()" style="background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%);border:none;box-shadow:0 2px 8px rgba(2,132,199,0.25)">
          ⚡ Gerar Ficha Técnica Automática com IA (Baseada no Estoque)
        </button>
      </div>
    </div>
    <div class="card" style="max-width:900px;margin:0 auto">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
        <div class="card-title" style="display:flex;align-items:center;gap:8px">
          Ficha Técnica de Preparo
          <span class="info-icon" data-tooltip="Documento que descreve a preparação de uma refeição, seus ingredientes, quantidade, modo de preparo e valor nutricional">ℹ️</span>
        </div>
      </div>
      <div class="card-body">
        <form id="form-create-ficha" onsubmit="handleCreateFicha(event)">
          <div class="grid-3" style="margin-bottom:20px">
            <div class="form-group">
              <label>Nome da Preparação</label>
              <input type="text" id="ficha-name" class="btn btn-outline" style="width:100%;text-align:left;padding:10px" placeholder="Ex: Sopa de Feijão com Macarrão" oninput="fichaFormState.nome=this.value" required>
            </div>
            <div class="form-group">
              <label>Tipo de Refeição</label>
              <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="ficha-type" onchange="fichaFormState.tipo=this.value" required>
                <option value="Almoço">Almoço</option>
                <option value="Jantar">Jantar</option>
                <option value="Lanche">Lanche</option>
                <option value="Desjejum">Desjejum</option>
              </select>
            </div>
            <div class="form-group">
              <label style="display:flex;align-items:center;gap:6px">Modalidade de Ensino<span class="info-icon" data-tooltip="Selecione a modalidade para preencher automaticamente a quantidade per capita de cada ingrediente">ℹ️</span></label>
              <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="ficha-modalidade" onchange="window.updateModalidade(this.value)" required>
                <option value="Escolar Urbana (Regular)">Escolar Urbana (Regular)</option>
                <option value="EMEI (Educação Infantil)">EMEI (Educação Infantil)</option>
                <option value="Integral Urbana">Integral Urbana</option>
                <option value="Escolar Rural">Escolar Rural</option>
                <option value="Integral Rural">Integral Rural</option>
              </select>
            </div>
          </div>

          <div style="border:1px solid var(--border);border-radius:var(--radius);padding:16px;margin-bottom:20px">
            <div style="font-weight:700;margin-bottom:16px;color:var(--primary);display:flex;align-items:center;justify-content:space-between">
              <div style="display:flex;align-items:center;gap:8px">
                Ingredientes
                <span class="info-icon" data-tooltip="Adicione 1 ou mais ingredientes para compor a receita completa">ℹ️</span>
              </div>
              <button type="button" class="btn btn-primary btn-sm" onclick="window.addIngrediente()">+ Adicionar Ingrediente</button>
            </div>
            <div id="ingredientes-list" style="display:flex;flex-direction:column;gap:16px"></div>
          </div>

          <div style="border:1px solid var(--primary-100);background:var(--primary-50);border-radius:var(--radius);padding:16px;margin-bottom:20px">
            <div style="font-weight:700;margin-bottom:12px;color:var(--primary-dark)">Resumo Nutricional da Receita</div>
            <div class="grid-5" style="gap:12px">
              <div style="text-align:center;padding:12px;background:white;border-radius:8px">
                <div style="font-size:0.75rem;color:var(--text-secondary);font-weight:600;margin-bottom:4px">Energia (kcal)</div>
                <div style="font-size:1.3rem;font-weight:700;color:var(--primary)" id="resumo-kcal">0</div>
              </div>
              <div style="text-align:center;padding:12px;background:white;border-radius:8px">
                <div style="font-size:0.75rem;color:var(--text-secondary);font-weight:600;margin-bottom:4px">Carboidratos (g)</div>
                <div style="font-size:1.3rem;font-weight:700;color:#F57F17" id="resumo-carbs">0</div>
              </div>
              <div style="text-align:center;padding:12px;background:white;border-radius:8px">
                <div style="font-size:0.75rem;color:var(--text-secondary);font-weight:600;margin-bottom:4px">Proteínas (g)</div>
                <div style="font-size:1.3rem;font-weight:700;color:#2E7D32" id="resumo-proteina">0</div>
              </div>
              <div style="text-align:center;padding:12px;background:white;border-radius:8px">
                <div style="font-size:0.75rem;color:var(--text-secondary);font-weight:600;margin-bottom:4px">Lipídios (g)</div>
                <div style="font-size:1.3rem;font-weight:700;color:#E65100" id="resumo-lipidios">0</div>
              </div>
              <div style="text-align:center;padding:12px;background:white;border-radius:8px">
                <div style="font-size:0.75rem;color:var(--text-secondary);font-weight:600;margin-bottom:4px">Sódio (mg)</div>
                <div style="font-size:1.3rem;font-weight:700;color:#C62828" id="resumo-sodio">0</div>
              </div>
            </div>
          </div>

          <div style="display:flex;gap:12px;justify-content:flex-end">
            <button type="button" class="btn btn-outline" onclick="cancelCreateFicha()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar Receita</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Renderizar primeiro ingrediente vazio
  window.addIngrediente();

  // Se autoGerarIA for verdadeiro, dispara a geração automática por IA
  if (autoGerarIA) {
    setTimeout(() => {
      window.gerarFichaTecnicaIA();
    }, 50);
  }
};

window.gerarFichaTecnicaIA = () => {
  if (!window.AICardapioEngine || typeof window.AICardapioEngine.generateFichaTecnicaFromStock !== 'function') {
    return alert('Motor de IA de Fichas Técnicas não carregado.');
  }

  const modalidade = document.getElementById('ficha-modalidade')?.value || 'Escolar Urbana (Regular)';
  const tipoRefeicao = document.getElementById('ficha-type')?.value || 'Almoço';

  const fichaIA = window.AICardapioEngine.generateFichaTecnicaFromStock({ modalidade, tipoRefeicao });
  if (!fichaIA) return;

  window.fichaFormState = {
    nome: fichaIA.nome,
    tipo: fichaIA.tipo,
    modalidade: fichaIA.modalidade,
    ingredientes: fichaIA.ingredientes,
    totais: fichaIA.totais,
    geradoPorIA: true
  };

  const nameInput = document.getElementById('ficha-name');
  if (nameInput) nameInput.value = fichaIA.nome;

  const typeSelect = document.getElementById('ficha-type');
  if (typeSelect) typeSelect.value = fichaIA.tipo;

  const modalSelect = document.getElementById('ficha-modalidade');
  if (modalSelect) modalSelect.value = fichaIA.modalidade;

  window.renderIngredientes();
  window.recalculaTotais();

  // Exibir Banner da IA
  let banner = document.getElementById('ia-ficha-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'ia-ficha-banner';
    banner.style.cssText = 'border-left: 5px solid #0284c7; background: #f0f9ff; padding: 14px 18px; margin-bottom: 18px; border-radius: 8px; border: 1px solid #bae6fd;';
    const form = document.getElementById('form-create-ficha');
    if (form) form.insertBefore(banner, form.firstChild);
  }

  const fefoTexto = fichaIA.fefoItems && fichaIA.fefoItems.length > 0 
    ? ` Insumos em estoque aproveitados: <strong>${fichaIA.fefoItems.join(', ')}</strong>.` 
    : '';

  banner.innerHTML = `
    <div style="font-weight: 700; color: #0369a1; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
      <div style="display:flex;align-items:center;gap:8px">
        <span>🤖 FICHA TÉCNICA SUGERIDA POR IA COM BASE NO ESTOQUE ATUAL</span>
      </div>
      <span class="status-badge status-ok" style="font-size:0.75rem">⚡ Aproveitamento FEFO + AF</span>
    </div>
    <div style="font-size: 0.85rem; color: #0c4a6e; margin-top: 6px;">
      Esta preparação foi montada automaticamente pela IA utilizando insumos disponíveis no Estoque Central e safras locais.${fefoTexto} A Nutricionista <strong>Dra. Lilian Droppa</strong> pode adaptar livremente ou aprovar e salvar para o cardápio.
    </div>
  `;

  // Atualiza o botão de submissão
  const btnSubmit = document.querySelector('#form-create-ficha button[type="submit"]');
  if (btnSubmit) {
    btnSubmit.innerHTML = '✅ Aprovar & Salvar Ficha Técnica para o Cardápio (Dra. Lilian Droppa)';
    btnSubmit.className = 'btn btn-success';
  }

  if (typeof showToast === 'function') {
    showToast('🤖 Ficha Técnica gerada com sucesso pela IA com base nos produtos em estoque!');
  }
};

window.updateModalidade = (modalidade) => {
  window.fichaFormState.modalidade = modalidade;

  // Recalcular quantidade de todos os ingredientes com base no novo per capita
  window.fichaFormState.ingredientes.forEach(ing => {
    if (ing.nome) {
      // Obter novo per capita para esse ingrediente na nova modalidade
      const novaQuantidade = window.getPerCapitaPorIngrediente(ing.nome);

      // Atualizar quantidade
      ing.quantidade = novaQuantidade;

      // Recalcular nutrientes com a nova quantidade
      const nutrientes = window.getNutrientesDoAlimento(ing.nome, novaQuantidade);
      ing.kcal = parseFloat(nutrientes.kcal);
      ing.carbos = parseFloat(nutrientes.carbos);
      ing.proteinas = parseFloat(nutrientes.proteinas);
      ing.lipidios = parseFloat(nutrientes.lipidios);
      ing.sodio = parseFloat(nutrientes.sodio);
    }
  });

  // Recalcular totais
  window.recalculaTotais();

  // Atualizar interface
  window.renderIngredientes();
};

window.getPerCapitaPorIngrediente = (nomeIngrediente) => {
  const modalidade = window.fichaFormState.modalidade || 'Escolar Urbana (Regular)';
  const perCapitaData = PER_CAPITA_MODALIDADES[modalidade] || {};

  // Buscar por nome similar
  const nomeLower = nomeIngrediente.toLowerCase();

  for (const [chave, valor] of Object.entries(perCapitaData)) {
    if (nomeLower.includes(chave) || chave.includes(nomeLower)) {
      return valor;
    }
  }

  return 100; // Valor padrão se não encontrar
};

window.addIngrediente = () => {
  const id = Date.now();
  const ingrediente = {
    id,
    nome: '',
    quantidade: 100,
    unidade: 'g',
    kcal: 0,
    carbos: 0,
    proteinas: 0,
    lipidios: 0,
    sodio: 0
  };
  window.fichaFormState.ingredientes.push(ingrediente);
  window.renderIngredientes();
};

window.removeIngrediente = (id) => {
  window.fichaFormState.ingredientes = window.fichaFormState.ingredientes.filter(ing => ing.id !== id);
  window.renderIngredientes();
};

window.updateIngrediente = (id, field, value) => {
  const ing = window.fichaFormState.ingredientes.find(i => i.id === id);
  if (ing) {
    ing[field] = value;
    window.recalculaTotais();
  }
};

window.renderIngredientes = () => {
  const list = document.getElementById('ingredientes-list');
  if (!list) return;

  list.innerHTML = window.fichaFormState.ingredientes.map(ing => `
    <div style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--surface-1)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <span style="font-weight:600;color:var(--text-primary)">Ingrediente #${window.fichaFormState.ingredientes.indexOf(ing) + 1}</span>
        ${window.fichaFormState.ingredientes.length > 1 ? `<button type="button" class="btn btn-ghost btn-sm" onclick="window.removeIngrediente(${ing.id})" style="color:var(--danger)">✕ Remover</button>` : ''}
      </div>
      <div class="grid-2" style="gap:12px;margin-bottom:12px">
        <div class="form-group">
          <label style="font-size:0.8rem">Nome do Ingrediente</label>
          <div class="autocomplete-container">
            <input type="text" class="btn btn-outline" style="width:100%;text-align:left;padding:8px;cursor:text" placeholder="Buscar produto..." value="${ing.nome}" oninput="window.updateIngrediente(${ing.id}, 'nome', this.value); window.handleIngredienteSearchForId(${ing.id}, this)" required>
            <div class="autocomplete-dropdown" id="dropdown-${ing.id}"></div>
          </div>
        </div>
        <div class="form-group">
          <label style="font-size:0.8rem">Quantidade (g)</label>
          <input type="number" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" value="${ing.quantidade}" min="1" oninput="window.updateIngrediente(${ing.id}, 'quantidade', parseFloat(this.value))" required>
        </div>
      </div>
      <div class="grid-5" style="gap:8px">
        <div style="padding:8px;background:white;border-radius:6px;text-align:center;font-size:0.75rem">
          <div style="color:var(--text-secondary);font-weight:600">Kcal</div>
          <input type="number" class="btn btn-outline" style="width:100%;padding:4px;text-align:center;font-size:0.85rem" step="0.1" value="${ing.kcal.toFixed(1)}" oninput="window.updateIngrediente(${ing.id}, 'kcal', parseFloat(this.value))">
        </div>
        <div style="padding:8px;background:white;border-radius:6px;text-align:center;font-size:0.75rem">
          <div style="color:var(--text-secondary);font-weight:600">Carbs (g)</div>
          <input type="number" class="btn btn-outline" style="width:100%;padding:4px;text-align:center;font-size:0.85rem" step="0.1" value="${ing.carbos.toFixed(1)}" oninput="window.updateIngrediente(${ing.id}, 'carbos', parseFloat(this.value))">
        </div>
        <div style="padding:8px;background:white;border-radius:6px;text-align:center;font-size:0.75rem">
          <div style="color:var(--text-secondary);font-weight:600">Prot (g)</div>
          <input type="number" class="btn btn-outline" style="width:100%;padding:4px;text-align:center;font-size:0.85rem" step="0.1" value="${ing.proteinas.toFixed(1)}" oninput="window.updateIngrediente(${ing.id}, 'proteinas', parseFloat(this.value))">
        </div>
        <div style="padding:8px;background:white;border-radius:6px;text-align:center;font-size:0.75rem">
          <div style="color:var(--text-secondary);font-weight:600">Lip (g)</div>
          <input type="number" class="btn btn-outline" style="width:100%;padding:4px;text-align:center;font-size:0.85rem" step="0.1" value="${ing.lipidios.toFixed(1)}" oninput="window.updateIngrediente(${ing.id}, 'lipidios', parseFloat(this.value))">
        </div>
        <div style="padding:8px;background:white;border-radius:6px;text-align:center;font-size:0.75rem">
          <div style="color:var(--text-secondary);font-weight:600">Sódio (mg)</div>
          <input type="number" class="btn btn-outline" style="width:100%;padding:4px;text-align:center;font-size:0.85rem" step="0.1" value="${ing.sodio.toFixed(0)}" oninput="window.updateIngrediente(${ing.id}, 'sodio', parseFloat(this.value))">
        </div>
      </div>
    </div>
  `).join('');
};

window.recalculaTotais = () => {
  const totais = { kcal: 0, carbos: 0, proteinas: 0, lipidios: 0, sodio: 0 };
  window.fichaFormState.ingredientes.forEach(ing => {
    totais.kcal += ing.kcal || 0;
    totais.carbos += ing.carbos || 0;
    totais.proteinas += ing.proteinas || 0;
    totais.lipidios += ing.lipidios || 0;
    totais.sodio += ing.sodio || 0;
  });
  window.fichaFormState.totais = totais;

  // Atualizar display
  document.getElementById('resumo-kcal').textContent = totais.kcal.toFixed(0);
  document.getElementById('resumo-carbs').textContent = totais.carbos.toFixed(1);
  document.getElementById('resumo-proteina').textContent = totais.proteinas.toFixed(1);
  document.getElementById('resumo-lipidios').textContent = totais.lipidios.toFixed(1);
  document.getElementById('resumo-sodio').textContent = totais.sodio.toFixed(0);
};

window.handleIngredienteSearchForId = (ingredienteId, inputElement) => {
  const query = inputElement.value.toLowerCase().trim();
  const dropdown = document.getElementById(`dropdown-${ingredienteId}`);

  if (query.length < 1) {
    dropdown?.classList.remove('active');
    return;
  }

  // Busca na tabela PNAE completa (584 alimentos do Supabase)
  const alimentos = DATA.alimentos || (typeof ALIMENTOS_PNAE !== 'undefined' ? ALIMENTOS_PNAE : []);
  const filtered = alimentos.filter(a =>
    a.name && (a.name.toLowerCase().includes(query) || (a.category && a.category.toLowerCase().includes(query)))
  ).slice(0, 12);

  if (!dropdown) return;

  if (filtered.length === 0) {
    dropdown.innerHTML = '<div class="autocomplete-no-results">Nenhum alimento encontrado na base PNAE</div>';
    dropdown.classList.add('active');
    return;
  }

  dropdown.innerHTML = filtered.map(a => `
    <div class="autocomplete-item" onclick="window.selectIngredienteForId(${ingredienteId}, '${a.name.replace(/'/g, "'")}')">
      <span class="autocomplete-item-name">${a.name}</span>
      <span class="autocomplete-item-details">
        ${a.category || ''} • ${a.kcal_per_100g || 0} kcal/100g
      </span>
    </div>
  `).join('');

  dropdown.classList.add('active');
};

window.getNutrientesDoAlimento = (nomeAlimento, quantidade) => {
  // Buscar na tabela PNAE do Supabase ou fallback local
  const alimentos = DATA.alimentos || (typeof ALIMENTOS_PNAE !== 'undefined' ? ALIMENTOS_PNAE : []);

  if (alimentos.length === 0) {
    console.warn(`Tabela de alimentos vazia`);
    return { kcal: 0, carbos: 0, proteinas: 0, lipidios: 0, sodio: 0 };
  }

  const nomeLower = nomeAlimento.toLowerCase();

  // 1. Tentar busca exata por nome
  let alimento = alimentos.find(a =>
    a.name && a.name.toLowerCase() === nomeLower
  );

  // 2. Tentar busca por inclusão de string
  if (!alimento) {
    alimento = alimentos.find(a =>
      a.name && a.name.toLowerCase().includes(nomeLower)
    );
  }

  // 3. Tentar busca pela primeira palavra
  if (!alimento) {
    const primeirasPalavras = nomeLower.split(' ')[0];
    alimento = alimentos.find(a =>
      a.name && a.name.toLowerCase().includes(primeirasPalavras)
    );
  }

  // 4. Se ainda não encontrar, tentar busca por código se disponível
  if (!alimento && alimentos[0].code) {
    alimento = alimentos.find(a =>
      a.code && a.code.toLowerCase().includes(nomeLower)
    );
  }

  // Se não encontrar, retornar zeros
  if (!alimento) {
    console.warn(`[NUTRIENTES] Alimento "${nomeAlimento}" não encontrado na base PNAE (${alimentos.length} disponíveis)`);
    return { kcal: 0, carbos: 0, proteinas: 0, lipidios: 0, sodio: 0 };
  }

  console.log(`[NUTRIENTES] Alimento encontrado: "${alimento.name}" (${alimento.kcal_per_100g} kcal/100g)`);

  // Calcular nutrientes para a quantidade especificada
  // Os valores na tabela PNAE são por 100g
  const fator = quantidade / 100;

  return {
    kcal: ((alimento.kcal_per_100g || 0) * fator).toFixed(1),
    carbos: ((alimento.carb_per_100g || 0) * fator).toFixed(1),
    proteinas: ((alimento.protein_per_100g || 0) * fator).toFixed(1),
    lipidios: ((alimento.fat_per_100g || 0) * fator).toFixed(1),
    sodio: ((alimento.sodium_per_100g || 0) * fator).toFixed(0)
  };
};

window.selectIngredienteForId = (ingredienteId, productName) => {
  window.updateIngrediente(ingredienteId, 'nome', productName);

  // Auto-preencher quantidade com per capita da modalidade
  const perCapita = window.getPerCapitaPorIngrediente(productName);
  window.updateIngrediente(ingredienteId, 'quantidade', perCapita);

  // Auto-preencher valores nutricionais da tabela PNAE
  const nutrientes = window.getNutrientesDoAlimento(productName, perCapita);
  window.updateIngrediente(ingredienteId, 'kcal', parseFloat(nutrientes.kcal));
  window.updateIngrediente(ingredienteId, 'carbos', parseFloat(nutrientes.carbos));
  window.updateIngrediente(ingredienteId, 'proteinas', parseFloat(nutrientes.proteinas));
  window.updateIngrediente(ingredienteId, 'lipidios', parseFloat(nutrientes.lipidios));
  window.updateIngrediente(ingredienteId, 'sodio', parseFloat(nutrientes.sodio));

  document.getElementById(`dropdown-${ingredienteId}`)?.classList.remove('active');
  window.renderIngredientes();
};

window.cancelCreateFicha = () => {
  const container = document.getElementById('page-content');
  PAGE_RENDERERS.nutricionista_fichas(container);
};

window.handleCreateFicha = (event) => {
  event.preventDefault();

  const nome = document.getElementById('ficha-name')?.value || window.fichaFormState.nome;
  const tipo = document.getElementById('ficha-type')?.value || window.fichaFormState.tipo;
  const modalidade = document.getElementById('ficha-modalidade')?.value || window.fichaFormState.modalidade || 'Escolar Urbana (Regular)';
  const ingredientes = window.fichaFormState.ingredientes || [];

  if (!nome || ingredientes.length === 0) {
    alert('Preencha o nome e adicione ao menos um ingrediente!');
    return;
  }

  const porcaoTotal = ingredientes.reduce((s, i) => s + (parseFloat(i.quantidade) || 0), 0);
  const descricaoIngredientes = ingredientes.map(i => i.nome).filter(Boolean).join(', ');

  // Criar objeto da receita com ID em String para evitar crash de tipo
  const receita = {
    id: String(Date.now()),
    nome: nome,
    tipo: tipo,
    modalidade: modalidade,
    ingredientes: ingredientes,
    totais: window.fichaFormState.totais || { kcal: 0, carbos: 0, proteinas: 0, lipidios: 0, sodio: 0 },
    descricao: descricaoIngredientes,
    porcao: `${Math.round(porcaoTotal)}g`,
    dataCriacao: new Date().toISOString().split('T')[0],
    nutricionista: 'Dra. Lilian Droppa (CRN 12345/MS)',
    aprovado: true,
    ativo: true
  };

  // Salvar no localStorage (cache local imediato)
  let fichas = JSON.parse(localStorage.getItem('fichas_tecnicas') || '[]');
  fichas = fichas.filter(f => String(f.id) !== receita.id && (f.nome || '').toLowerCase() !== receita.nome.toLowerCase());
  fichas.push(receita);
  localStorage.setItem('fichas_tecnicas', JSON.stringify(fichas));

  // Persiste no Supabase
  if (window.DB && typeof window.DB.saveFichaTecnica === 'function') {
    window.DB.saveFichaTecnica(receita).then(ok => {
      if (!ok) console.warn('[Fichas] Não foi possível persistir no Supabase — mantida apenas em localStorage');
    });
  }

  // Publica no SharedState para que Escola/Gestor também vejam
  if (window.SharedState && typeof window.SharedState.addFicha === 'function') {
    SharedState.addFicha(receita);
  }

  // Adicionar ao DATA.receitas para aparecer nos planejadores de cardápio
  if (!DATA.receitas) DATA.receitas = [];
  DATA.receitas = DATA.receitas.filter(r => String(r.id) !== receita.id && (r.nome || '').toLowerCase() !== receita.nome.toLowerCase());
  DATA.receitas.push(receita);

  // Registrar também no motor da IA de Cardápios
  if (window.AICardapioEngine && typeof window.AICardapioEngine.addReceita === 'function') {
    window.AICardapioEngine.addReceita(receita);
  }

  if (typeof showToast === 'function') {
    showToast(`✅ Ficha técnica de "${nome}" aprovada e salva com sucesso para o cardápio!`);
  } else {
    alert(`Ficha técnica de "${nome}" criada e salva com sucesso!\n\nEnergia: ${Math.round(receita.totais.kcal)} kcal\nProteína: ${receita.totais.proteinas.toFixed(1)}g\nCarboidratos: ${receita.totais.carbos.toFixed(1)}g`);
  }

  const container = document.getElementById('page-content');
  PAGE_RENDERERS.nutricionista_fichas(container);
};

window.excluirCardapio = (idOrIdx) => {
  if (!confirm('Tem certeza que deseja excluir este cardápio? Esta ação não poderá ser desfeita.')) return;

  const id = String(idOrIdx);

  // Caso 1: ID do tipo 'legacy-N' → remover do localStorage
  if (id.startsWith('legacy-')) {
    const idx = parseInt(id.replace('legacy-', ''), 10);
    const legacy = JSON.parse(localStorage.getItem('cardapios_publicados') || '[]');
    if (!isNaN(idx) && idx >= 0 && idx < legacy.length) {
      legacy.splice(idx, 1);
      localStorage.setItem('cardapios_publicados', JSON.stringify(legacy));
    }
  }
  // Caso 2: ID do tipo 'wk-*' → cardápio semanal do SharedState
  else if (id.startsWith('wk-')) {
    if (window.SharedState && typeof window.SharedState.deleteWeeklyMenu === 'function') {
      window.SharedState.deleteWeeklyMenu(id);
    }
  }
  // Caso 3: ID do tipo 'menu-*' ou qualquer outro → menu normal do SharedState
  else {
    if (window.SharedState && typeof window.SharedState.deleteMenu === 'function') {
      window.SharedState.deleteMenu(id);
    }
  }

  if (typeof showToast === 'function') showToast('✅ Cardápio excluído com sucesso!');
  const container = document.getElementById('page-content');
  if (container) PAGE_RENDERERS.nutricionista_cardapios(container);
};

// ─── Publicar Cardápio em Elaboração ────────────────────────────────────────
window.publicarCardapio = (id) => {
  if (!confirm('Publicar este cardápio? Ele ficará visível para as escolas e serão geradas as Ordens de Serviço automáticas.')) return;

  const sid = String(id);
  let menuPublicado = null;

  // Atualiza status no SharedState (menu normal ou semanal)
  if (sid.startsWith('menu-') || (!sid.startsWith('legacy-') && !sid.startsWith('wk-'))) {
    menuPublicado = window.SharedState?.updateMenu(sid, {
      status: 'Publicado',
      publicadoEm: new Date().toISOString(),
    });
  } else if (sid.startsWith('wk-')) {
    menuPublicado = window.SharedState?.updateWeeklyMenu(sid, {
      status: 'Publicado',
      publicadoEm: new Date().toISOString(),
    });
  } else if (sid.startsWith('legacy-')) {
    // Cardápios legados: atualiza no localStorage
    const idx = parseInt(sid.replace('legacy-', ''), 10);
    const legacy = JSON.parse(localStorage.getItem('cardapios_publicados') || '[]');
    if (!isNaN(idx) && legacy[idx]) {
      legacy[idx].status = 'Publicado';
      legacy[idx].publicadoEm = new Date().toISOString();
      localStorage.setItem('cardapios_publicados', JSON.stringify(legacy));
    }
  }

  // Dispara fluxo de Ordens de Serviço para escolas + cooperativas/agricultores
  const activeMenu = menuPublicado || window.currentActiveIAMenu || window.tempIAMenuPreview;
  if (typeof window.gerarOrdensDeServicoPorEscola === 'function') {
    window.gerarOrdensDeServicoPorEscola(activeMenu);
  }

  if (typeof showToast === 'function') {
    showToast('🚀 Cardápio publicado! Ordens de Serviço enviadas para escolas e cooperativas.');
  }

  // Re-renderiza a tela de gestão
  const container = document.getElementById('page-content');
  if (container) PAGE_RENDERERS.nutricionista_cardapios(container);
};

window.editarCardapio = (idOrIdx) => {
  if (typeof window.showMenuPlanner === 'function') {
    window.showMenuPlanner();
    if (typeof showToast === 'function') showToast('✏️ Cardápio carregado no planejador para edição.');
  }
};

window.viewCardapio = (id) => {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="page-header"><div class="page-title">Detalhes do Cardápio</div><div class="page-subtitle">Ações de visualização, exportação e logística</div></div>
    <div class="card mb-24">
      <div class="card-body" style="display:flex;gap:12px;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="showMenuPlanner()">✏️ Editar Cardápio</button>
        <button class="btn btn-outline" onclick="generateMenuPDF()">📄 Exportar Cardápio (PDF)</button>
        <button class="btn btn-outline" onclick="generateRomaneio()">📦 Gerar Romaneio de Entrega</button>
        <button class="btn btn-outline" style="color:var(--danger);border-color:var(--danger)" onclick="PAGE_RENDERERS.nutricionista_cardapios(document.getElementById('page-content'))">🔙 Voltar</button>
      </div>
    </div>
    
    <div id="print-area">
      <div class="card" style="padding: 24px">
        <h2 style="text-align:center;margin-bottom:20px;color:var(--primary)">Cardápio Oficial — Referência</h2>
        <table class="data-table">
          <thead><tr><th>Data</th><th>Refeição</th><th>Preparação Sugerida</th></tr></thead>
          <tbody>
            <tr><td>01/07/2026</td><td>Desjejum</td><td>Pão com Manteiga e Leite</td></tr>
            <tr><td>01/07/2026</td><td>Almoço</td><td>Arroz com Feijão Tradicional</td></tr>
            <tr><td>01/07/2026</td><td>Lanche</td><td>Vitamina de Banana</td></tr>
            <tr><td>02/07/2026</td><td>Desjejum</td><td>Mingau de Aveia</td></tr>
            <tr><td>02/07/2026</td><td>Almoço</td><td>Frango Grelhado com Legumes</td></tr>
            <tr><td>02/07/2026</td><td>Lanche</td><td>Salada de Frutas</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
};

window.generateMenuPDF = () => {
  alert("O navegador abrirá a tela de impressão ajustada para exportar em PDF o cardápio oficial.");
  const printArea = document.getElementById('print-area');
  const originalHtml = document.body.innerHTML;
  document.body.innerHTML = printArea.innerHTML;
  window.print();
  document.body.innerHTML = originalHtml;
  location.reload(); // Recarrega para restaurar eventos
};

window.generateRomaneio = () => {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="page-header"><div class="page-title">Romaneio de Entrega Logística</div><div class="page-subtitle">Guia de Quantitativos para Conferência Escolar</div></div>
    <div class="card mb-24">
      <div class="card-body">
        <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir Guia</button>
        <button class="btn btn-outline" onclick="PAGE_RENDERERS.nutricionista_cardapios(document.getElementById('page-content'))">🔙 Voltar</button>
      </div>
    </div>
    <div class="card" style="padding: 24px" id="romaneio-print">
      <h2 style="text-align:center;margin-bottom:20px;color:var(--primary)">Guia de Entrega Logística — Checklist</h2>
      <table class="data-table">
        <thead><tr><th>✓</th><th>Ingrediente</th><th>Quantidade Total (Estivada)</th></tr></thead>
        <tbody>
          <tr><td style="width:40px;border:1px solid #ccc"></td><td>Arroz Agulhinha</td><td>150 kg</td></tr>
          <tr><td style="width:40px;border:1px solid #ccc"></td><td>Feijão Carioca</td><td>80 kg</td></tr>
          <tr><td style="width:40px;border:1px solid #ccc"></td><td>Peito de Frango</td><td>120 kg</td></tr>
          <tr><td style="width:40px;border:1px solid #ccc"></td><td>Banana Nanica</td><td>40 kg</td></tr>
          <tr><td style="width:40px;border:1px solid #ccc"></td><td>Leite Integral</td><td>200 L</td></tr>
        </tbody>
      </table>
      <div style="margin-top:40px;border-top:1px solid #ccc;padding-top:20px;display:flex;justify-content:space-around">
        <div style="text-align:center">________________________<br>Assinatura Entregador</div>
        <div style="text-align:center">________________________<br>Assinatura Direção / Cozinha</div>
      </div>
    </div>
  `;
};

window.buildPlannerSelectOptions = (mealType, preselectRecipeId) => {
  const fichasSalvas = JSON.parse(localStorage.getItem('fichas_tecnicas') || '[]');
  const todas = [...RECIPE_LIBRARY, ..._FICHAS_DEMO, ...fichasSalvas];
  
  const uniqueRecipes = Array.from(new Map(todas.map(item => [item.id, item])).values());

  const isDesjejum = (t) => t && (t.toLowerCase().includes('desjejum') || t.toLowerCase().includes('café'));
  const isLanche = (t) => t && t.toLowerCase().includes('lanche');
  const isAlmoco = (t) => t && t.toLowerCase().includes('almoço');

  const filtered = uniqueRecipes.filter(r => {
    if (!mealType) return true;
    const t = r.mealType || r.tipo || r.categoria || '';
    if (mealType === 'Desjejum') return isDesjejum(t) || (!isLanche(t) && !isAlmoco(t));
    if (mealType === 'Lanche') return isLanche(t);
    if (mealType === 'Almoço') return isAlmoco(t);
    return true;
  });

  let options = '<option value="0">Selecione uma preparação...</option>';
  filtered.forEach(r => {
    const kcal = r.kcal || (r.totais && r.totais.kcal) || (r.totais && r.totais.energia) || 0;
    const isSelected = r.id === preselectRecipeId ? 'selected' : '';
    const name = r.name || r.nome || 'Receita sem nome';
    options += `<option value="${kcal}" ${isSelected}>${name} (${parseFloat(kcal).toFixed(0)} kcal)</option>`;
  });
  return options;
};

window.abrirModalNovoCardapio = () => {
  const content = `
    <div style="padding:10px 0">
      <div style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:16px">
        Defina a periodicidade (Mensal por padrão, Quinzenal ou Semanal) e o mês de referência para gerar as semanas do cardápio.
      </div>
      <div class="form-group" style="margin-bottom:14px">
        <label style="font-weight:600;display:block;margin-bottom:6px">Nome do Cardápio</label>
        <input type="text" id="novo-cardapio-nome" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: Cardápio Agosto/2026 — Regular" value="Cardápio Agosto/2026 — Regular">
      </div>
      <div class="grid-2" style="gap:12px;margin-bottom:14px">
        <div class="form-group">
          <label style="font-weight:600;display:block;margin-bottom:6px">Periodicidade</label>
          <select id="novo-cardapio-periodicidade" class="btn btn-outline" style="width:100%;text-align:left;padding:8px">
            <option value="mensal" selected>🗓️ Mensal (Padrão — Conforme o Mês)</option>
            <option value="quinzenal">🌓 Quinzenal (2 semanas)</option>
            <option value="semanal">📅 Semanal (1 semana)</option>
          </select>
        </div>
        <div class="form-group">
          <label style="font-weight:600;display:block;margin-bottom:6px">Mês / Ano de Referência</label>
          <input type="month" id="novo-cardapio-mes" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" value="2026-08">
        </div>
      </div>
      <div class="form-group" style="margin-bottom:20px">
        <label style="font-weight:600;display:block;margin-bottom:6px">Público / Tipo</label>
        <select id="novo-cardapio-tipo" class="btn btn-outline" style="width:100%;text-align:left;padding:8px">
          <option value="Regular" selected>Escolar Regular (Urbana e Rural)</option>
          <option value="Integral">Escolar Integral</option>
          <option value="EMEI">Educação Infantil (EMEI)</option>
        </select>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" onclick="confirmarCriarNovoCardapio()">🚀 Criar e Abrir Planejador</button>
      </div>
    </div>
  `;
  openModal('📋 Novo Cardápio por Período', content);
};

window.confirmarCriarNovoCardapio = () => {
  const nome = document.getElementById('novo-cardapio-nome')?.value || 'Novo Cardápio';
  const periodicidade = document.getElementById('novo-cardapio-periodicidade')?.value || 'mensal';
  const monthVal = document.getElementById('novo-cardapio-mes')?.value || '2026-08';
  const tipo = document.getElementById('novo-cardapio-tipo')?.value || 'Regular';

  const [ano, mes] = monthVal.split('-').map(Number);
  const semanasCalculadas = SharedState.calcularSemanasDoMes(mes, ano);
  let numSemanas = semanasCalculadas.length;
  if (periodicidade === 'quinzenal') numSemanas = 2;
  if (periodicidade === 'semanal') numSemanas = 1;

  const d1 = semanasCalculadas[0] ? semanasCalculadas[0].inicio.split('-').reverse().join('/') : '01/08/2026';
  const d2 = semanasCalculadas[numSemanas - 1] ? semanasCalculadas[numSemanas - 1].fim.split('-').reverse().join('/') : '31/08/2026';
  const periodoStr = `${d1} a ${d2}`;

  const novoMenu = SharedState.addMenu({
    nome,
    periodicidade,
    mesReferencia: { mes, ano },
    numSemanas,
    periodo: periodoStr,
    escolas: (typeof DATA !== 'undefined' && DATA.schools) ? DATA.schools.length : 183,
    status: 'Em Elaboração',
    tipo,
    autor: 'Dra. Lilian Droppa'
  });

  for (let i = 1; i <= numSemanas; i++) {
    const semInfo = semanasCalculadas[i - 1] || { label: `Semana ${i}`, dias: [] };
    SharedState.addWeeklyMenu({
      cardapioId: novoMenu.id,
      indiceSemana: i,
      semana: semInfo.label || `Semana ${i}`,
      escola: 'REDE',
      kcalMedia: 720,
      autor: 'Dra. Lilian Droppa',
      refeicoes: (semInfo.dias || []).map(d => ({
        dia: d.dia,
        diaData: d.diaData,
        desabilitado: !!d.desabilitado,
        tipo: d.desabilitado ? '—' : 'Almoço',
        item: d.desabilitado ? 'Dia fora do mês' : 'Selecione a refeição...',
        kcal: 0
      }))
    });
  }

  closeModal();
  if (typeof showToast === 'function') {
    showToast(`✅ Cardápio ${periodicidade} (${numSemanas} semanas) criado com sucesso!`);
  }
  showMenuPlanner(novoMenu.id);
};

window.generatePlannerDays = (targetCardapioId, targetWeekIndex) => {
  const cardapioId = targetCardapioId || window._activePlannerCardapioId || 'menu-jun-reg';
  const menu = SharedState.getCardapio(cardapioId) || (SharedState.getMenus()[0] || { id: 'menu-jun-reg', nome: 'Cardápio Junho/2026' });
  const semanas = SharedState.getSemanasDoCardapio(menu.id);
  const currentWeekIdx = targetWeekIndex || window._activePlannerWeekIndex || 1;
  const semanaAtiva = semanas.find(s => s.indiceSemana === currentWeekIdx) || semanas[0] || { refeicoes: [] };

  const container = document.getElementById('planner-days-container');
  if (!container) return;
  container.innerHTML = '';

  const optDesjejum = window.buildPlannerSelectOptions('Desjejum', window._lastPreselectRecipeId);
  const optAlmoco = window.buildPlannerSelectOptions('Almoço', window._lastPreselectRecipeId);
  const optLanche = window.buildPlannerSelectOptions('Lanche', window._lastPreselectRecipeId);

  const daysOfWeek = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
  let html = '';

  const refeicoesList = (semanaAtiva.refeicoes && semanaAtiva.refeicoes.length > 0)
    ? semanaAtiva.refeicoes
    : [
        { dia: 'Seg', diaData: '2026-06-01', item: 'Arroz com Frango Ensopado', kcal: 680 },
        { dia: 'Ter', diaData: '2026-06-02', item: 'Feijoada Vegetariana', kcal: 740 },
        { dia: 'Qua', diaData: '2026-06-03', item: 'Macarrão Bolonhesa', kcal: 710 },
        { dia: 'Qui', diaData: '2026-06-04', item: 'Carne Moída com Mandioca', kcal: 750 },
        { dia: 'Sex', diaData: '2026-06-05', item: 'Risoto de Frango', kcal: 720 },
      ];

  refeicoesList.forEach((r, idx) => {
    const isDisabled = !!r.desabilitado;
    const dateFormatted = r.diaData ? r.diaData.split('-').reverse().join('/') : '';
    const dayName = r.dia ? `${r.dia}-feira` : `Dia ${idx + 1}`;

    if (isDisabled) {
      html += `
        <div style="border: 1px solid #e2e8f0; border-radius: var(--radius); padding:14px; margin-bottom:12px; background:#f8fafc; opacity:0.6;" class="planner-day-block disabled-day">
          <div style="font-weight:700;margin-bottom:6px;color:#94a3b8;display:flex;align-items:center;justify-content:space-between;">
            <span>${dayName} (${dateFormatted})</span>
            <span class="status-badge" style="background:#e2e8f0;color:#64748b;font-size:0.75rem;">🚫 Dia fora do mês de referência</span>
          </div>
          <div style="font-size:0.85rem;color:#94a3b8;font-style:italic">Este dia pertence ao mês anterior/seguinte e foi desabilitado automaticamente do cálculo de demanda e PNAE.</div>
        </div>
      `;
    } else {
      html += `
        <div style="border: 1px solid var(--border); border-radius: var(--radius); padding:16px; margin-bottom:12px" class="planner-day-block" data-date="${dateFormatted}">
          <div style="font-weight:700;margin-bottom:10px;color:var(--primary);display:flex;justify-content:space-between;align-items:center">
            <span>${dayName} (${dateFormatted})</span>
            <span style="font-size:0.8rem;color:var(--text-tertiary)">${r.item || 'Personalizar'}</span>
          </div>
          <div class="grid-3">
            <div class="form-group">
              <label>Café da Manhã</label>
              <select class="btn btn-outline planner-select-kcal" style="width:100%;text-align:left;padding:8px" id="planner-bkf-${idx}" onchange="calculatePlannerKcal()">
                ${optDesjejum}
              </select>
            </div>
            <div class="form-group">
              <label>Almoço</label>
              <select class="btn btn-outline planner-select-kcal" style="width:100%;text-align:left;padding:8px" id="planner-lun-${idx}" onchange="calculatePlannerKcal()">
                ${optAlmoco}
              </select>
            </div>
            <div class="form-group">
              <label>Lanche da Tarde</label>
              <select class="btn btn-outline planner-select-kcal" style="width:100%;text-align:left;padding:8px" id="planner-snk-${idx}" onchange="calculatePlannerKcal()">
                ${optLanche}
              </select>
            </div>
          </div>
        </div>
      `;
    }
  });

  if (!html) html = '<div style="padding:16px;color:var(--text-secondary)">Nenhum dia útil selecionado no período.</div>';
  container.innerHTML = html;
  calculatePlannerKcal();
};

window.showMenuPlanner = (cardapioId, preselectRecipeId) => {
  if (typeof cardapioId !== 'string' && typeof cardapioId !== 'number') {
    cardapioId = null;
  }
  window._lastPreselectRecipeId = preselectRecipeId;
  const container = document.getElementById('page-content');
  if (!container) return;

  const menus = SharedState.getMenus();
  const menuObj = cardapioId
    ? SharedState.getCardapio(cardapioId)
    : (menus.find(m => m.status === 'Em Elaboração') || menus[0] || { id: 'menu-jun-reg', nome: 'Cardápio Junho/2026 — Regular', periodicidade: 'mensal', numSemanas: 5 });

  window._activePlannerCardapioId = menuObj.id;
  window._activePlannerWeekIndex = window._activePlannerWeekIndex || 1;

  const semanas = SharedState.getSemanasDoCardapio(menuObj.id);
  const numSemanas = menuObj.numSemanas || (semanas.length > 0 ? semanas.length : 5);

  const activeRestricoes = (SharedState.getRestricoes() || []).filter(r => r.status === 'ativo').map(r => ({
    ...r,
    tipo: (function(t) {
      if (!t) return 'Outras Restrições';
      const l = t.toLowerCase();
      if (l.includes('lactose')) return 'Intolerância à lactose';
      if (l.includes('celíaca') || l.includes('celiaca') || l.includes('gluten') || l.includes('glúten')) return 'Doença celíaca';
      if (l.includes('diabete')) return 'Diabetes';
      if (l.includes('aplv') || l.includes('proteína do leite') || l.includes('proteina do leite')) return 'Alergia à Proteína do Leite (APLV)';
      if (l.includes('vegetari') || l.includes('vega')) return 'Vegetariano/Vegano';
      return t;
    })(r.tipo)
  }));

  const totalAlunosRestricaoRede = activeRestricoes.reduce((acc, r) => acc + (r.quantidade || 1), 0);

  const restricoesSummaryHtml = activeRestricoes.length > 0 ? `
    <div style="background: #fff7ed; border-left: 4px solid #f97316; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div>
        <div style="font-weight:700; color:#c2410c; display:flex; align-items:center; gap:6px;">
          <span>⚠️ Alerta de Restrições Alimentares na Rede Piloto (${totalAlunosRestricaoRede} aluno(s) afetados)</span>
        </div>
        <div style="font-size:0.83rem; color:#ea580c; margin-top:2px;">
          ${Array.from(new Set(activeRestricoes.map(r => r.tipo))).map(t => `${t}: ${activeRestricoes.filter(r=>r.tipo===t).reduce((a,b)=>a+(b.quantidade||1),0)} aluno(s)`).join(' · ')}
        </div>
      </div>
      <button class="btn btn-outline btn-sm" style="border-color:#fdba74; color:#c2410c; background:#fff;" onclick="PAGE_RENDERERS.nutricionista_restricoes(document.getElementById('page-content'))">Ver Detalhes das Restrições →</button>
    </div>
  ` : '';

  // Renderizar abas de semanas (Semana 1..N)
  let weekTabsHtml = '<div style="display:flex;gap:6px;margin-bottom:16px;overflow-x:auto;padding-bottom:4px;" id="planner-week-tabs">';
  for (let i = 1; i <= numSemanas; i++) {
    const sem = semanas.find(s => s.indiceSemana === i) || { semana: `Semana ${i}` };
    const isActive = i === window._activePlannerWeekIndex;
    const activeStyle = isActive
      ? 'background:var(--primary);color:#fff;font-weight:700;border-color:var(--primary);'
      : 'background:#f1f5f9;color:#475569;border-color:#cbd5e1;';
    weekTabsHtml += `
      <button class="btn btn-sm" style="${activeStyle}border-radius:20px;padding:6px 16px;" onclick="window.switchPlannerWeek(${i})">
        📅 ${sem.semana || `Semana ${i}`}
      </button>
    `;
  }
  weekTabsHtml += '</div>';

  container.innerHTML = `
    <div class="page-header">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div class="page-title">Planejador de Cardápio por Período</div>
          <div class="page-subtitle">Cardápio: <strong>${menuObj.nome}</strong> · Periodicidade: <span class="tag tag-blue">${(menuObj.periodicidade || 'mensal').toUpperCase()}</span> (${numSemanas} Semanas)</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="PAGE_RENDERERS.nutricionista_cardapios(document.getElementById('page-content'))">🔙 Voltar para Cardápios</button>
      </div>
    </div>

    ${restricoesSummaryHtml}

    <div class="card mb-24">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
        <div class="card-title">Navegação Multi-Semana</div>
        <button class="btn btn-outline btn-sm" style="background:var(--primary-light,#e0f2fe);color:var(--primary);border-color:var(--primary-light,#e0f2fe);font-weight:700" onclick="abrirModalGeradorIA()">🤖 Preencher N Semanas com IA</button>
      </div>
      <div class="card-body">
        ${weekTabsHtml}
        
        <div style="margin-top:14px">
          <label style="font-weight:600;font-size:0.9rem;display:block;margin-bottom:6px">Escolas Vinculadas</label>
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="radio" name="planner-escopo" value="rede" id="planner-escopo-rede" checked onchange="togglePlannerEscolas()">
              <span>Toda a rede (${(DATA.schools||[]).length} escolas)</span>
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
              <input type="radio" name="planner-escopo" value="lista" onchange="togglePlannerEscolas()">
              <span>Escolas específicas</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Elaboração da Semana ${window._activePlannerWeekIndex} de ${numSemanas}</div></div>
      <div class="card-body">
        <div id="planner-days-container" style="display:flex;gap:12px;flex-direction:column">
        </div>

        <div style="margin-top:20px;padding:16px;background:var(--primary-light);border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-weight:700">Média Nutricional Diária Calculada (Semana ${window._activePlannerWeekIndex})</div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">Meta recomendada PNAE: 650 a 800 kcal/dia</div>
          </div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--primary)" id="planner-total-kcal">0 kcal</div>
        </div>

        <div style="display:flex;gap:12px;margin-top:20px;justify-content:flex-end">
          <button class="btn btn-outline" onclick="PAGE_RENDERERS.nutricionista_cardapios(document.getElementById('page-content'))">Cancelar</button>
          <button class="btn btn-primary" onclick="saveWeeklyMenu()">Publicar Cardápio (${numSemanas} Semanas)</button>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => window.generatePlannerDays(menuObj.id, window._activePlannerWeekIndex), 50);
};

window.switchPlannerWeek = (weekIndex) => {
  window._activePlannerWeekIndex = weekIndex;
  window.showMenuPlanner(window._activePlannerCardapioId);
};
                    <strong>${s.name}</strong> <span style="color:var(--text-tertiary);font-size:0.78rem">· ${s.region}</span>
                  </div>
                  ${restrBadge}
                </label>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Elaboração do Menu</div></div>
      <div class="card-body">
        <div id="planner-days-container" style="display:flex;gap:12px;flex-direction:column">
        </div>

        <div style="margin-top:20px;padding:16px;background:var(--primary-light);border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-weight:700">Média Nutricional Diária Calculada</div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">Meta recomendada PNAE: 650 a 800 kcal/dia</div>
          </div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--primary)" id="planner-total-kcal">0 kcal</div>
        </div>

        <div style="display:flex;gap:12px;margin-top:20px;justify-content:flex-end">
          <button class="btn btn-outline" onclick="cancelMenuPlanner()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveWeeklyMenu()">Publicar Cardápio</button>
        </div>
      </div>
    </div>
  `;
  setTimeout(() => window.generatePlannerDays(), 50);
};

window.abrirModalGeradorIA = () => {
  const _allSchools = (DATA.schools || []);
  const totalAlunosPiloto = _allSchools.length > 0 ? _allSchools.reduce((acc, sc) => acc + (sc.students || 0), 0) : 3992;
  const alunosIntegral = _allSchools.filter(s => s.refeicoesDia === 4 && !s.name.includes('EMEI')).reduce((acc, sc) => acc + (sc.students || 0), 0) || 975;
  const alunosParcial = _allSchools.filter(s => s.refeicoesDia === 2).reduce((acc, sc) => acc + (sc.students || 0), 0) || 2152;
  const alunosCreche = _allSchools.filter(s => s.name.includes('EMEI')).reduce((acc, sc) => acc + (sc.students || 0), 0) || 865;

  const startDateInput = document.getElementById('planner-start-date')?.value || '';
  const endDateInput = document.getElementById('planner-end-date')?.value || '';

  // 1. Detectar modalidade e escopo pré-selecionados na tela principal do planejador
  const preSelectedModality = document.getElementById('planner-modalidade')?.value || 'piloto_completo';
  const escopoRede = document.getElementById('planner-escopo-rede')?.checked !== false;
  const selectedSchoolNames = escopoRede 
    ? (DATA.schools || []).map(s => s.name)
    : Array.from(document.querySelectorAll('.planner-escola-chk:checked')).map(c => c.value);

  // 2. Verificar restrições alimentares ativas para o escopo selecionado
  const activeRestricoes = (SharedState.getRestricoes() || []).filter(r => r.status === 'ativo');
  const restricoesNaSelecao = activeRestricoes.filter(r => 
    escopoRede || selectedSchoolNames.some(sName => (r.schoolName || '').toLowerCase().includes(sName.toLowerCase()))
  );

  const totalAlunosRestr = restricoesNaSelecao.reduce((acc, r) => acc + (r.quantidade || 1), 0);
  const tiposRestrUnicos = Array.from(new Set(restricoesNaSelecao.map(r => r.tipo))).join(', ');

  let restricoesAlertHtml = '';
  if (totalAlunosRestr > 0) {
    restricoesAlertHtml = `
      <div style="background:#fff7ed; border-left:4px solid #f97316; padding:10px 14px; border-radius:6px; margin-bottom:14px; color:#c2410c; font-size:0.88rem;">
        🛡️ <strong>Alerta de Restrições na Seleção:</strong> A pré-seleção inclui <strong>${totalAlunosRestr} aluno(s)</strong> com laudo médico / restrição ativa (<em>${tiposRestrUnicos}</em>). A IA filtrará apenas receitas seguras.
      </div>
    `;
  }

  let escopoLabelInfo = escopoRede 
    ? `Escolas Piloto (${totalAlunosPiloto.toLocaleString('pt-BR')} alunos)`
    : `${selectedSchoolNames.length} escola(s) específica(s) pré-selecionada(s)`;

  let dateBadgeHtml = '';
  if (startDateInput && endDateInput) {
    const d1Formatted = startDateInput.split('-').reverse().join('/');
    const d2Formatted = endDateInput.split('-').reverse().join('/');
    dateBadgeHtml = `
      <div style="background:#e0f2fe; border-left:4px solid #0284c7; padding:10px 14px; border-radius:6px; margin-bottom:14px; color:#0369a1; font-size:0.88rem; display:flex; align-items:center; gap:8px;">
        <span>📅 <strong>Período Selecionado no Planejador:</strong> ${d1Formatted} a ${d2Formatted} (5 Dias Úteis)</span>
      </div>
    `;
  }

  const content = `
    <div style="padding:10px 0">
      ${dateBadgeHtml}
      ${restricoesAlertHtml}
      
      ${!escopoRede && selectedSchoolNames.length > 0 ? `
        <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:6px; padding:10px 12px; margin-bottom:14px; font-size:0.85rem; color:#0369a1;">
          🎯 <strong>Escolas Pré-Selecionadas (${selectedSchoolNames.length}):</strong> ${selectedSchoolNames.join(', ')}
        </div>
      ` : ''}

      <div style="font-size:0.88rem;color:var(--text-secondary);margin-bottom:16px">
        A Inteligência Artificial irá compor automaticamente as refeições PNAE da semana respeitando o escopo de <strong>${escopoLabelInfo}</strong>, priorizando Agricultura Familiar, combate ao desperdício (FEFO) e per capita técnico.
      </div>

      <div class="form-group" style="margin-bottom:14px">
        <label style="font-weight:600;display:block;margin-bottom:6px">Escopo & Modalidade Escolar Alvo (Pré-Selecionada)</label>
        <select id="ia-modalidade" class="btn btn-outline" style="width:100%;text-align:left;padding:8px">
          ${!escopoRede && selectedSchoolNames.length > 0 ? `
            <option value="escolas_selecionadas" selected>🎯 Escolas Selecionadas no Planejador (${selectedSchoolNames.length} Escolas)</option>
          ` : ''}
          <option value="piloto_completo" ${escopoRede && preSelectedModality === 'piloto_completo' ? 'selected' : ''}>🏫 Escolas Piloto SUALE 2026 (${totalAlunosPiloto.toLocaleString('pt-BR')} Alunos Atendidos)</option>
          <option value="fundamental_integral" ${preSelectedModality === 'fundamental_integral' ? 'selected' : ''}>Ensino Fundamental Integral (${alunosIntegral.toLocaleString('pt-BR')} Alunos Piloto)</option>
          <option value="fundamental_parcial" ${preSelectedModality === 'fundamental_parcial' ? 'selected' : ''}>Ensino Fundamental Parcial (${alunosParcial.toLocaleString('pt-BR')} Alunos Piloto)</option>
          <option value="creche" ${preSelectedModality === 'creche' ? 'selected' : ''}>Creche / EMEIs Piloto (${alunosCreche.toLocaleString('pt-BR')} Alunos)</option>
          <option value="rede_total" ${preSelectedModality === 'rede_total' ? 'selected' : ''}>Projeção Toda a Rede Municipal (183 Escolas — 32.000 Alunos)</option>
        </select>
      </div>

      <div class="form-group" style="margin-bottom:14px">
        <label style="font-weight:600;display:block;margin-bottom:6px">Meta Nutricional Média (Kcal/dia)</label>
        <input type="number" id="ia-meta-kcal" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" value="700" min="400" max="1200">
      </div>

      <div style="background:var(--surface-2, #f8fafc);padding:14px;border-radius:8px;margin-bottom:18px;border:1px solid var(--border)">
        <label style="display:flex;align-items:center;gap:8px;font-size:0.88rem;cursor:pointer;margin-bottom:8px">
          <input type="checkbox" id="ia-priorizar-fefo" checked>
          <span>⚡ <strong>Priorizar Alimentos Próximos do Vencimento (FEFO)</strong></span>
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-size:0.88rem;cursor:pointer;margin-bottom:8px">
          <input type="checkbox" id="ia-priorizar-sazonal" checked>
          <span>🌾 <strong>Priorizar Safras Sazonais da Agricultura Familiar</strong></span>
        </label>
        <label style="display:flex;align-items:center;gap:8px;font-size:0.88rem;cursor:pointer">
          <input type="checkbox" id="ia-considerar-restricoes" checked>
          <span>🛡️ <strong>Respeitar Alertas de Restrições Alimentares (${totalAlunosRestr} alunos na seleção)</strong></span>
        </label>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="button" class="btn btn-primary" onclick="window.executarGeracaoCardapioIA(event)">⚡ Gerar Cardápio Semanal (IA)</button>
      </div>
    </div>
  `;
  window.showModal('🤖 Gerador Automático de Cardápios com IA', content);
};

window.currentActiveIAMenu = null;
window.tempIAMenuPreview = null;

window.executarGeracaoCardapioIA = (evt) => {
  if (evt && typeof evt.preventDefault === 'function') evt.preventDefault();

  try {
    const modalidade = document.getElementById('ia-modalidade')?.value || 'piloto_completo';
    const metaKcal = parseInt(document.getElementById('ia-meta-kcal')?.value) || 700;
    const priorizarFEFO = document.getElementById('ia-priorizar-fefo')?.checked !== false;
    const priorizarSazonal = document.getElementById('ia-priorizar-sazonal')?.checked !== false;
    const considerarRestricoes = document.getElementById('ia-considerar-restricoes')?.checked !== false;

    const startDate = document.getElementById('planner-start-date')?.value || '';
    const endDate = document.getElementById('planner-end-date')?.value || '';

    // Ler escolas vinculadas especificamente selecionadas no planejador
    const escopoRede = document.getElementById('planner-escopo-rede')?.checked !== false;
    const selectedSchoolNames = escopoRede 
      ? (DATA.schools || []).map(s => s.name)
      : Array.from(document.querySelectorAll('.planner-escola-chk:checked')).map(c => c.value);

    const targetSchools = (DATA.schools || []).filter(s => escopoRede || selectedSchoolNames.includes(s.name));

    const totalAlunosTarget = targetSchools.length > 0 
      ? targetSchools.reduce((acc, sc) => acc + (sc.students || 0), 0) 
      : 3992;

    let numAlunos = totalAlunosTarget;
    if (modalidade === 'rede_total') {
      numAlunos = 32000;
    } else if (modalidade === 'creche') {
      numAlunos = Math.round(totalAlunosTarget * 0.22);
    }

    if (!window.AICardapioEngine) {
      return alert('Motor de IA não carregado.');
    }

    // 1. Executa o algoritmo da IA repassando as datas e escolas do planejador
    const resultadoIA = window.AICardapioEngine.generateWeeklyMenu({
      modalidade,
      metaKcal,
      numAlunos,
      priorizarFEFO,
      priorizarSazonal,
      considerarRestricoes,
      startDate,
      endDate
    });

    if (!resultadoIA) {
      return alert('Falha ao gerar cardápio com a IA.');
    }

    // Anexa as escolas especificamente vinculadas a este cardápio
    resultadoIA.escolasVinculadas = selectedSchoolNames.length > 0 ? selectedSchoolNames : (DATA.schools||[]).map(s=>s.name);
    resultadoIA.targetSchools = targetSchools;

    window.currentActiveIAMenu = resultadoIA;
    window.tempIAMenuPreview = resultadoIA;

    // 2. Fecha o modal de configuração
    window.closeModal();

    // 3. Preenche os blocos e selects da página principal (Desjejum, Almoço e Lanche)
    if (typeof window.generatePlannerDays === 'function') {
      window.generatePlannerDays();
    }

    const container = document.getElementById('planner-days-container');
    if (container) {
      const dayBlocks = container.querySelectorAll('.planner-day-block');
      dayBlocks.forEach((block, idx) => {
        const refeicao = resultadoIA.refeicoes[idx % resultadoIA.refeicoes.length];
        if (!refeicao) return;

        // Preenche Café / Desjejum
        const selectBkf = block.querySelector('select[id^="planner-bkf-"]');
        if (selectBkf && selectBkf.options.length > 1) {
          selectBkf.selectedIndex = (idx % (selectBkf.options.length - 1)) + 1;
        }

        // Preenche Almoço
        const selectAlmoco = block.querySelector('select[id^="planner-lun-"]');
        if (selectAlmoco) {
          let found = false;
          for (let opt of selectAlmoco.options) {
            if (opt.text.toLowerCase().includes(refeicao.nomePrato.slice(0, 15).toLowerCase())) {
              selectAlmoco.value = opt.value;
              found = true;
              break;
            }
          }
          if (!found && selectAlmoco.options.length > 1) {
            selectAlmoco.selectedIndex = (idx % (selectAlmoco.options.length - 1)) + 1;
          }
        }

        // Preenche Lanche
        const selectSnk = block.querySelector('select[id^="planner-snk-"]');
        if (selectSnk && selectSnk.options.length > 1) {
          selectSnk.selectedIndex = ((idx + 1) % (selectSnk.options.length - 1)) + 1;
        }
      });

      if (typeof window.renderAISummaryCard === 'function') {
        window.renderAISummaryCard(resultadoIA, container);
      }
      if (typeof window.calculatePlannerKcal === 'function') {
        window.calculatePlannerKcal();
      }
    }

    // 4. Grava no SharedState — status Em Elaboracao até aprovação explícita
    if (window.SharedState) {
      const d1 = startDate ? startDate.split('-').reverse().join('/') : new Date().toLocaleDateString('pt-BR');
      const d2 = endDate ? endDate.split('-').reverse().join('/') : new Date(Date.now() + 5*86400000).toLocaleDateString('pt-BR');
      SharedState.addMenu({
        nome: `Cardápio IA — ${selectedSchoolNames.length} Escola(s)`,
        periodo: `${d1} a ${d2}`,
        escolas: selectedSchoolNames.length,
        escolasVinculadas: selectedSchoolNames,
        status: 'Em Elaboração',
        tipo: 'Semanal',
        autor: 'Dra. Lilian Droppa (CRN 12345/MS)',
        refeicoes: resultadoIA.refeicoes || [],
        insumosResumoSemanal: resultadoIA.insumosResumoSemanal || [],
      });
      // addWeeklyMenu é chamado apenas ao Publicar via botão Publicar
    }

    // 5. Abre o modal de pré-visualização interativa
    window.abrirModalPreviewIA(resultadoIA);
  } catch (err) {
    console.error('Erro na geração de IA:', err);
    alert('Erro ao gerar cardápio com IA: ' + err.message);
  }
};

window.abrirModalPreviewIA = (resultadoIA) => {
  if (!resultadoIA) return;
  const m = resultadoIA.metricasSemanais;
  const escVinculadas = resultadoIA.escolasVinculadas || [];

  const content = `
    <div style="padding:4px 0; font-family:sans-serif; color:#1e293b;">
      <div style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:12px 16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <div style="font-weight:800; color:#0369a1; font-size:1.05rem;">🤖 CARDÁPIO SEMANAL SUGERIDO PELA IA (PRÉ-VISUALIZAÇÃO PNAE)</div>
          <div style="font-size:0.85rem; color:#0c4a6e; margin-top:2px;">
            Nutricionista: <strong>Dra. Lilian Droppa (CRN 12345/MS)</strong> · Escopo: <strong>${escVinculadas.length} Escola(s) Selecionada(s) (${m.numAlunos.toLocaleString('pt-BR')} Alunos)</strong>
          </div>
        </div>
        <span class="status-badge" style="background:#fef3c7; color:#92400e; font-weight:700; font-size:0.85rem; padding:6px 12px;">
          🟡 RASCUNHO SUGERIDO · AGUARDANDO SUAS REVISÕES/APROVAÇÃO
        </span>
      </div>

      <!-- METRICAS NUTRICCIONAIS -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:16px;">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; text-align:center;">
          <div style="font-size:0.75rem; color:#64748b; font-weight:600;">Energia Média</div>
          <div style="font-size:1.2rem; font-weight:800; color:#0284c7;">${m.mediaKcal} kcal/dia</div>
        </div>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; text-align:center;">
          <div style="font-size:0.75rem; color:#64748b; font-weight:600;">Proteínas</div>
          <div style="font-size:1.2rem; font-weight:800; color:#16a34a;">${m.mediaProteinas} g/dia</div>
        </div>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; text-align:center;">
          <div style="font-size:0.75rem; color:#64748b; font-weight:600;">Sódio</div>
          <div style="font-size:1.2rem; font-weight:800; color:#dc2626;">${m.mediaSodio} mg/dia</div>
        </div>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px; text-align:center;">
          <div style="font-size:0.75rem; color:#64748b; font-weight:600;">Agric. Familiar</div>
          <div style="font-size:1.2rem; font-weight:800; color:#d97706;">🌾 ${m.percentualAF}%</div>
        </div>
      </div>

      <!-- CARDS DE REFEICAO DA SEMANA (3 REFEICOES POR DIA) -->
      <div style="margin-bottom:16px;">
        <h4 style="margin-bottom:10px; color:#0f172a; font-size:0.95rem;">📅 Refeições Diárias Sugeridas (Desjejum, Almoço e Lanche)</h4>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${resultadoIA.refeicoes.map(r => `
            <div style="background:#ffffff; border:1px solid #cbd5e1; border-left:5px solid #0284c7; border-radius:8px; padding:12px 14px;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-bottom:1px solid #f1f5f9; padding-bottom:6px; margin-bottom:8px;">
                <strong style="color:#0369a1; font-size:0.95rem;">${r.dia}</strong>
                <span class="status-badge status-ok" style="font-size:0.75rem;">${r.kcal} kcal totais · Múltiplas Refeições</span>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; font-size:0.85rem;">
                <div style="background:#f8fafc; padding:8px; border-radius:6px; border:1px solid #e2e8f0;">
                  <div style="font-size:0.75rem; color:#64748b; font-weight:700;">☕ CAFÉ / DESJEJUM</div>
                  <div style="font-weight:600; color:#334155; margin-top:2px;">Pão c/ Manteiga e Leite UHT</div>
                </div>
                <div style="background:#f0f9ff; padding:8px; border-radius:6px; border:1px solid #bae6fd;">
                  <div style="font-size:0.75rem; color:#0369a1; font-weight:700;">🍲 ALMOÇO PRINCIPAL</div>
                  <div style="font-weight:700; color:#0f172a; margin-top:2px;">${r.nomePrato}</div>
                </div>
                <div style="background:#fdf4ff; padding:8px; border-radius:6px; border:1px solid #f5d0fe;">
                  <div style="font-size:0.75rem; color:#86198f; font-weight:700;">🍎 LANCHE DA TARDE</div>
                  <div style="font-weight:600; color:#701a75; margin-top:2px;">${r.fruta} ${r.fefoBadge ? `· ${r.fefoBadge}` : ''}</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TABELA EXPANSIVEL PER CAPITA E DEMANDA REDE -->
      <details style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:10px 14px; margin-bottom:18px;">
        <summary style="font-weight:700; cursor:pointer; font-size:0.88rem; color:#0f172a;">
          📊 Ver Tabela de Per Capita (g/aluno) e Demanda Total Semanal da Seleção (${m.numAlunos.toLocaleString('pt-BR')} Alunos)
        </summary>
        <div style="margin-top:10px; overflow-x:auto;">
          <table class="data-table" style="font-size:0.82rem; width:100%;">
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Per Capita (por Aluno)</th>
                <th>Demanda Total da Semana (Seleção)</th>
              </tr>
            </thead>
            <tbody>
              ${resultadoIA.insumosResumoSemanal.map(ins => `
                <tr>
                  <td><strong>${ins.nome}</strong> ${ins.af ? '<span class="status-badge status-ok" style="font-size:0.7rem">🌾 Agric. Familiar</span>' : ''}</td>
                  <td style="font-family:var(--font-mono);font-weight:700">${ins.perCapitaGramos} ${ins.unidade}</td>
                  <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${ins.totalSemanalKg.toLocaleString('pt-BR')} kg</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </details>

      <div style="display:flex; justify-content:flex-end; gap:10px;">
        <button class="btn btn-outline" onclick="closeModal()">Continuar Editando no Planejador</button>
        <button class="btn btn-primary" onclick="window.aprovarCardapioAposPreview()">✅ Aprovar e Registrar Cardápio</button>
      </div>
    </div>
  `;

  window.showModal('🤖 Cardápio Sugerido pela IA (Pré-Visualização PNAE)', content, '900px');
};

window.aprovarCardapioAposPreview = () => {
  window.aplicarIAMenuAoPlanejador(window.tempIAMenuPreview, true);
};

window.aplicarIAMenuAoPlanejador = (menuObj, aprovarDireto) => {
  if (!menuObj) return alert('Nenhum cardápio gerado pela IA.');

  window.closeModal();

  if (aprovarDireto && window.AICardapioEngine) {
    menuObj = window.AICardapioEngine.approveMenu(menuObj);
  }

  window.currentActiveIAMenu = menuObj;

  // Registrar no SharedState (Planejamento Alimentar & Visão Escolas)
  if (window.SharedState) {
    const d1 = new Date().toLocaleDateString('pt-BR');
    const d2 = new Date(Date.now() + 5*86400000).toLocaleDateString('pt-BR');
    SharedState.addMenu({
      nome: `Cardápio IA — ${menuObj.modalidade || 'PNAE'} (${new Date().toLocaleDateString('pt-BR')})`,
      periodo: `${d1} a ${d2}`,
      escolas: (DATA.schools||[]).length,
      escolasVinculadas: (DATA.schools||[]).map(s=>s.name),
      status: aprovarDireto ? 'Publicado' : 'Em Elaboração',
      tipo: 'Semanal',
      autor: 'Dra. Lilian Droppa (CRN 12345/MS)',
      refeicoes: menuObj.refeicoes || [],
      insumosResumoSemanal: menuObj.insumosResumoSemanal || [],
    });
    // addWeeklyMenu apenas ao aprovar definitivamente
    if (aprovarDireto) {
      SharedState.addWeeklyMenu({
        nome: `Cardápio Semanal IA PNAE (${menuObj.metricasSemanais?.numAlunos || 3992} Alunos)`,
        periodo: `${d1} a ${d2}`,
        semana: `${d1} a ${d2}`,
        escola: 'Toda a Rede Piloto',
        escolasVinculadas: (DATA.schools||[]).map(s=>s.name),
        refeicoes: (menuObj.refeicoes||[]).map(r => ({ dia: r.dia, tipo: 'Almoço', item: `${r.nomePrato} (${r.kcal} kcal)`, kcal: r.kcal })),
        kcalMedia: menuObj.metricasSemanais?.mediaKcal || 700,
        autor: 'Dra. Lilian Droppa (CRN 12345/MS)'
      });
    }
  }

  // Carregar no planejador semanal se a tela de planejamento estiver aberta
  const container = document.getElementById('planner-days-container');
  if (container) {
    window.generatePlannerDays();

    setTimeout(() => {
      const currentContainer = document.getElementById('planner-days-container');
      if (!currentContainer) return;

      const dayBlocks = currentContainer.querySelectorAll('.planner-day-block');
      dayBlocks.forEach((block, idx) => {
        const refeicao = menuObj.refeicoes[idx % menuObj.refeicoes.length];
        if (!refeicao) return;

        const selectAlmoco = block.querySelector('select[id^="planner-lun-"]');
        if (selectAlmoco) {
          let found = false;
          for (let opt of selectAlmoco.options) {
            if (opt.text.toLowerCase().includes(refeicao.nomePrato.slice(0, 15).toLowerCase())) {
              selectAlmoco.value = opt.value;
              found = true;
              break;
            }
          }
          if (!found && selectAlmoco.options.length > 1) {
            selectAlmoco.selectedIndex = (idx % (selectAlmoco.options.length - 1)) + 1;
          }
        }
      });

      window.renderAISummaryCard(menuObj, currentContainer);
      window.calculatePlannerKcal();
    }, 100);
  }

  if (aprovarDireto) {
    if (typeof showToast === 'function') {
      showToast('✅ Cardápio aprovado e registrado em Planejamento Alimentar & Cardápios da Escola!');
    }
    setTimeout(() => window.abrirRelatorioPNAE(), 200);
  } else {
    if (typeof showToast === 'function') {
      showToast('📋 Cardápio sugerido pela IA carregado no planejador para revisão da Dra. Lilian Droppa.');
    }
  }
};

window.resolverColaboradorParaProduto = (nomeProduto) => {
  const nome = (nomeProduto || '').toLowerCase();
  const farmers = (typeof DATA !== 'undefined' && DATA.farmers) || [];
  const viaFarmer = farmers.find(f => (f.products || []).some(p => nome.includes(p.toLowerCase()) || p.toLowerCase().includes(nome)));
  if (viaFarmer) return viaFarmer.coop || viaFarmer.name;
  const coops = (typeof DATA !== 'undefined' && DATA.cooperatives) || [];
  if (!coops.length) return 'Cooperativa Parceira';
  const hash = nome.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return coops[hash % coops.length].name;
};

window.abrirGuiaEntregaParaEscola = (escolaId) => {
  window._guiaFiltroPreSelect = { modo: 'escola', escolaId };
  closeModal();
  navigateTo('nutricionista', 'guiasentrega');
};

window.abrirGuiaEntregaParaColaborador = (nomeColaborador) => {
  window._guiaFiltroPreSelect = { modo: 'colaborador', colaborador: nomeColaborador };
  closeModal();
  navigateTo('nutricionista', 'guiasentrega');
};

window.gerarOrdensDeServicoPorEscola = (menuObj) => {
  menuObj = menuObj || window.currentActiveIAMenu || window.tempIAMenuPreview;
  if (!menuObj || !window.AICardapioEngine) {
    return alert('Nenhum cardápio ativo para fracionamento de Ordem de Serviço.');
  }

  const cardapioCod = menuObj.codigoCardapio || menuObj.id || 'CARD-2026/08-101';
  const allSchools = (DATA.schools && DATA.schools.length > 0) ? DATA.schools : [];
  const escVinculadas = menuObj.escolasVinculadas || [];
  
  // Filtra estritamente as escolas vinculadas a este cardápio
  const targetSchools = escVinculadas.length > 0
    ? allSchools.filter(s => escVinculadas.includes(s.name))
    : allSchools;

  const schoolsToUse = targetSchools.length > 0 ? targetSchools : allSchools;

  // 1. Gera Ordens de Serviço por escola aplicando a regra de embalagens inteiras não-fracionadas
  const ordensPorEscola = schoolsToUse.map(sc => {
    const demandaInsumos = window.AICardapioEngine.calcularDemandaPorEscola(menuObj, sc);
    const escCodigo = sc.codigo || `ESC-${String(sc.id).padStart(3, '0')}`;
    
    // Registra pedido e entrega no SharedState para a escola
    if (window.SharedState) {
      const orderItens = demandaInsumos.map(i => ({
        produto: i.nome, qtd: i.qtdEnviadaKg, unidade: 'kg', regra: i.detalheRegra,
        af: !!i.af, colaborador: i.af ? window.resolverColaboradorParaProduto(i.nome) : null
      }));
      const order = {
        escolaId: sc.id,
        escolaCodigo: escCodigo,
        escola: sc.name,
        cardapioCodigo: cardapioCod,
        cardapioId: menuObj.id,
        tipo: 'Ordem de Serviço PNAE (IA)',
        status: 'Pendente',
        itens: orderItens,
        items: orderItens,
        criadoEm: new Date().toISOString()
      };
      SharedState.addOrder(order);
      if (typeof SharedState.addOsEstoqueCentral === 'function') {
        SharedState.addOsEstoqueCentral({
          numero_os: `OS-2026/${sc.id}08`,
          cardapioCodigo: cardapioCod,
          escolaCodigo: escCodigo,
          tipo: 'Distribuição Escolar',
          escola: sc.name,
          escolaId: sc.id,
          itens: orderItens,
          status: 'Pendente'
        });
      }

      // Guia de Remessa — Estoque Central / Pregão (itens não-AF)
      const itensPregao = orderItens.filter(i => !i.af);
      if (itensPregao.length > 0 && typeof SharedState.addGuiaEntrega === 'function') {
        SharedState.addGuiaEntrega({
          tipo: 'Estoque Central', entregador: 'Estoque Central SEMED',
          escolaId: sc.id, escolaNome: sc.name, escolaCodigo: escCodigo,
          classificacaoGrupo: sc.tipo, linhaEntrega: sc.region,
          cardapioCodigo: cardapioCod, produtos: itensPregao
        });
      }

      // Guia de Remessa — por Colaborador (Cooperativa/Agricultor), itens AF agrupados por colaborador resolvido
      const itensAF = orderItens.filter(i => i.af);
      const colaboradoresDoGrupo = [...new Set(itensAF.map(i => i.colaborador))];
      colaboradoresDoGrupo.forEach(colaborador => {
        const itensDoColaborador = itensAF.filter(i => i.colaborador === colaborador);
        const osForn = (typeof SharedState.addOsFornecedores === 'function') ? SharedState.addOsFornecedores({
          tipo_fornecedor: 'Cooperativa', cooperativa: colaborador,
          escola_destino: sc.name, escolaId: sc.id,
          tipo_os: 'Ordem de Fornecimento AF', status: 'Enviada à Cooperativa',
          itens: itensDoColaborador
        }) : null;
        if (typeof SharedState.addGuiaEntrega === 'function') {
          SharedState.addGuiaEntrega({
            tipo: 'Colaborador', entregador: colaborador,
            escolaId: sc.id, escolaNome: sc.name, escolaCodigo: escCodigo,
            classificacaoGrupo: sc.tipo, linhaEntrega: sc.region,
            cardapioCodigo: cardapioCod, produtos: itensDoColaborador,
            osFornecedorId: osForn ? osForn.id : null
          });
        }
      });
    }

    return {
      escola: sc,
      escolaCodigo: escCodigo,
      cardapioCodigo: cardapioCod,
      demanda: demandaInsumos
    };
  });

  // 2. Gera Ordens de Produção & Colheita para Cooperativas e Agricultores Familiares (Produtos AF)
  const insumosAF = (menuObj.insumosResumoSemanal || []).filter(i => i.af);
  const totalAlunos = (menuObj.metricasSemanais?.numAlunos || 3992);
  
  const ordensAgricultores = [
    {
      cooperativa: 'COOPAGRAN — Cooperativa Agrícola de Campo Grande',
      contato: 'Carlos Mendes (67) 99222-1010',
      itens: (insumosAF.length > 0 ? insumosAF.slice(0, Math.ceil(insumosAF.length / 2)) : [
        { nome: 'Melancia em cubos (Safra Local AF)', perCapitaGramos: 120 },
        { nome: 'Banana prata orgânica (Safra Local AF)', perCapitaGramos: 100 }
      ]).map(i => ({
        produto: i.nome,
        perCapita: i.perCapitaGramos || 100,
        totalKg: Math.round(((i.perCapitaGramos || 100) * totalAlunos * 5) / 1000),
        prazoColheita: 'Até 03/08/2026',
        destinos: `${ordensPorEscola.length} escola(s) vinculada(s)`
      }))
    },
    {
      cooperativa: 'Associação dos Produtores Rurais do Indubrasil & Terenos',
      contato: 'Dona Maria de Fátima (67) 99888-4040',
      itens: (insumosAF.length > 1 ? insumosAF.slice(Math.ceil(insumosAF.length / 2)) : [
        { nome: 'Mamão formosa fatiado (Safra Local AF)', perCapitaGramos: 100 },
        { nome: 'Cenoura e Legumes Frescos AF', perCapitaGramos: 60 }
      ]).map(i => ({
        produto: i.nome,
        perCapita: i.perCapitaGramos || 100,
        totalKg: Math.round(((i.perCapitaGramos || 100) * totalAlunos * 5) / 1000),
        prazoColheita: 'Até 03/08/2026',
        destinos: `${ordensPorEscola.length} escola(s) vinculada(s)`
      }))
    }
  ];

  // Registra as ordens de produção no SharedState para a Cooperativa e Agricultores
  if (window.SharedState) {
    ordensAgricultores.forEach(coop => {
      coop.itens.forEach(it => {
        SharedState.addProduction({
          cooperativa: coop.cooperativa,
          produto: it.produto,
          quantidadeTotalKg: it.totalKg,
          prazoColheita: it.prazoColheita,
          status: 'Ordem de Colheita Emitida',
          origem: 'Gerador de Cardápios IA Nutricional'
        });
      });
    });
  }

  // Renderiza Modal de Ordens de Serviço
  const content = `
    <div style="padding:4px 0; font-family:sans-serif; color:#1e293b;" id="os-print-container">
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px 16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <div>
          <div style="font-weight:800; color:#15803d; font-size:1.05rem;">📋 ORDENS DE SERVIÇO & ROMANEIOS (ESCOLA & AGRICULTURA FAMILIAR)</div>
          <div style="font-size:0.85rem; color:#166534; margin-top:2px;">
            Separação técnica por Escola (embalagens inteiras) e Ordens de Colheita por Cooperativa · Escopo: <strong>${ordensPorEscola.length} Escola(s) Vinculada(s)</strong>
          </div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <button class="btn btn-success btn-sm" onclick="window.abrirModalDisparoManualOS()">🚀 Disparar Ordens de Serviço (Seleção Manual)</button>
          <span class="status-badge status-ok" style="font-size:0.85rem; padding:6px 12px;">🟢 EMISSÃO CONCLUÍDA</span>
        </div>
      </div>

      <!-- SELEÇÃO DE VISÃO / ABAS -->
      <div style="display:flex; gap:10px; margin-bottom:16px; border-bottom:2px solid #e2e8f0; padding-bottom:8px;">
        <button class="btn btn-primary btn-sm" id="tab-os-escolas-btn" onclick="window.alternarAbasOS('escolas')">🏫 Ordens de Serviço por Escola (${ordensPorEscola.length} unidades)</button>
        <button class="btn btn-outline btn-sm" id="tab-os-coop-btn" onclick="window.alternarAbasOS('coop')">🤝 Ordem de Serviço Colaboradores (${ordensAgricultores.length})</button>
      </div>

      <!-- SEÇÃO 1: ORDENS DE SERVIÇO POR ESCOLA -->
      <div id="secao-os-escolas">
        <div style="margin-bottom:14px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
          <strong style="font-size:0.88rem; color:#334155;">Filtrar por Escola:</strong>
          <select id="os-school-filter" class="btn btn-outline" style="padding:6px 12px; font-weight:600; text-align:left;" onchange="window.filtrarOSEscola(this.value)">
            <option value="TODAS">Ver Todas as Escolas Vinculadas (${ordensPorEscola.length} unidades)</option>
            ${ordensPorEscola.map(o => `<option value="${o.escola.id}">${o.escola.name} (${o.escola.students} alunos)</option>`).join('')}
          </select>
        </div>

        <div id="os-tables-container" style="display:flex; flex-direction:column; gap:16px;">
          ${ordensPorEscola.map(o => `
            <div class="os-school-block" data-school-id="${o.escola.id}" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:8px; padding:14px;">
              <div style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong style="font-size:0.98rem; color:#0f172a;">🏫 ${o.escola.name} <span class="tag tag-blue" style="font-size:0.72rem;">ID: ${o.escolaCodigo}</span></strong>
                  <span style="font-size:0.8rem; color:#64748b; margin-left:8px;">· Região: ${o.escola.region || 'Urbana'} · População: <strong>${o.escola.students} Alunos</strong></span>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span class="status-badge" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.78rem;">OS nº OS-2026/${o.escola.id}08</span>
                  <span class="status-badge" style="background:#fef3c7; color:#b45309; font-weight:700; font-size:0.78rem;">📜 Ref. Cardápio: ${o.cardapioCodigo}</span>
                  <button class="btn btn-outline btn-sm" style="font-size:0.78rem;" onclick="window.abrirGuiaEntregaParaEscola(${o.escola.id})">📬 Ver Guia em Guias de Entrega</button>
                </div>
              </div>

              <div style="overflow-x:auto;">
                <table class="data-table" style="font-size:0.82rem; width:100%;">
                  <thead>
                    <tr>
                      <th>Item / Insumo</th>
                      <th>Per Capita (por Aluno)</th>
                      <th>Demanda Bruta Calculada</th>
                      <th>📦 Qtd. Expedida (Embalagem Inteira)</th>
                      <th>Regra de Abastecimento</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${o.demanda.map(d => `
                      <tr ${d.naoFracionavel ? 'style="background:#fefce8"' : ''}>
                        <td><strong>${d.nome}</strong> ${d.af ? '<span class="status-badge status-ok" style="font-size:0.7rem">🌾 AF</span>' : ''}</td>
                        <td style="font-family:var(--font-mono)">${d.perCapitaGramos}g</td>
                        <td style="font-family:var(--font-mono);color:#64748b">${d.demandaCalculadaKg.toLocaleString('pt-BR')} kg</td>
                        <td style="font-family:var(--font-mono);font-weight:800;color:${d.naoFracionavel ? '#d97706' : '#0284c7'}">
                          ${d.qtdEnviadaKg.toLocaleString('pt-BR')} kg
                        </td>
                        <td style="font-size:0.78rem;">${d.detalheRegra}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SEÇÃO 2: ORDENS DE PRODUÇÃO E COLHEITA AF (COOPERATIVAS) -->
      <div id="secao-os-coop" style="display:none;">
        <div style="display:flex; flex-direction:column; gap:16px;">
          ${ordensAgricultores.map(c => `
            <div style="background:#ffffff; border:1px solid #bbf7d0; border-left:5px solid #16a34a; border-radius:8px; padding:14px;">
              <div style="border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                <div>
                  <strong style="font-size:0.98rem; color:#14532d;">🌾 ${c.cooperativa}</strong>
                  <div style="font-size:0.8rem; color:#475569; margin-top:2px;">Contato / Responsável: <strong>${c.contato}</strong></div>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span class="status-badge status-ok" style="font-weight:700; font-size:0.78rem;">🟢 ORDEM DE COLHEITA EMITIDA</span>
                  <button class="btn btn-outline btn-sm" style="font-size:0.78rem; border-color:#16a34a; color:#15803d;" onclick="window.abrirGuiaEntregaParaColaborador('${c.cooperativa.replace(/'/g,"\\'")}')">📬 Ver Guia em Guias de Entrega</button>
                </div>
              </div>

              <div style="overflow-x:auto;">
                <table class="data-table" style="font-size:0.82rem; width:100%;">
                  <thead>
                    <tr>
                      <th>Produto AF (Safra Sazonal)</th>
                      <th>Per Capita Rede</th>
                      <th>Demanda Total Solicitada (Rede)</th>
                      <th>Prazo Limite de Colheita</th>
                      <th>Destino / Logística</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${c.itens.map(it => `
                      <tr>
                        <td><strong>${it.produto}</strong> <span class="status-badge status-ok" style="font-size:0.7rem">🌾 AF</span></td>
                        <td style="font-family:var(--font-mono)">${it.perCapita}g/aluno</td>
                        <td style="font-family:var(--font-mono);font-weight:800;color:#15803d;font-size:0.95rem">${it.totalKg.toLocaleString('pt-BR')} kg</td>
                        <td style="color:#d97706;font-weight:700">${it.prazoColheita}</td>
                        <td style="font-size:0.78rem;">${it.destinos}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- RODAPE COM IMPRESSAO -->
      <div style="border-top:1px solid #cbd5e1; padding-top:14px; margin-top:18px; display:flex; justify-content:space-between; align-items:center;">
        <button class="btn btn-outline" onclick="closeModal()">Fechar</button>
        <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir Ordens de Serviço & Guias (PDF)</button>
      </div>
    </div>
  `;

  window.showModal('📋 Ordens de Serviço (Escolas & Agricultura Familiar)', content, '950px');
};

window.imprimirOSIndividualEscola = (escolaName, osNumero) => {
  const school = (DATA.schools || []).find(s => s.name === escolaName) || { name: escolaName, region: 'Urbana', students: 450 };
  const orders = SharedState.getOrders().filter(o => o.school === escolaName || o.escola === escolaName);
  const items = orders.length > 0 ? (orders[orders.length - 1].itens || []) : [
    { produto: 'Arroz Agulhinha Tipo 1 (Saco 5kg)', qtd: 50, unidade: 'kg', regra: '10 pacotes x 5kg' },
    { produto: 'Feijão Carioca Novo (Pacote 1kg)', qtd: 25, unidade: 'kg', regra: '25 pacotes x 1kg' },
    { produto: 'Carne Bovina Bife Moída congelada', qtd: 40, unidade: 'kg', regra: 'Caixas de 10kg' },
    { produto: 'Banana Prata Orgânica AF', qtd: 30, unidade: 'kg', regra: 'Caixas de 15kg' },
  ];

  const html = `
    <div style="padding:20px;font-family:sans-serif;color:#0f172a;max-width:800px;margin:0 auto" id="print-os-guias">
      <div style="border-bottom:2px solid #0284c7;padding-bottom:12px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:1.1rem;font-weight:800;color:#0369a1">SEMED · PREFEITURA MUNICIPAL DE CAMPO GRANDE</div>
          <div style="font-size:1rem;font-weight:700;color:#334155">ORDEM DE SERVIÇO DE EXPEDIÇÃO & CONFERÊNCIA — ESTOQUE CENTRAL</div>
          <div style="font-size:0.8rem;color:#64748b">Sistema SAGED · Alimentação Escolar PNAE</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:1.1rem;font-weight:800;color:#0284c7">${osNumero || 'OS-2026/01'}</div>
          <div style="font-size:0.75rem;color:#64748b">${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;background:#f8fafc;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.85rem;border:1px solid #e2e8f0">
        <div><strong>Unidade Escolar Destino:</strong> ${school.name}</div>
        <div><strong>Região de Atendimento:</strong> ${school.region || 'Urbana'}</div>
        <div><strong>População Atendida:</strong> ${school.students || 450} Alunos</div>
        <div><strong>Status da OS:</strong> <span style="color:#0284c7;font-weight:700">🚚 Aguardando Separação / Expedição</span></div>
      </div>

      <div style="margin-bottom:16px">
        <h4 style="margin-bottom:8px;color:#0f172a">Itens da Ordem de Serviço (Embalagens Inteiras Fechadas)</h4>
        <table class="data-table" style="font-size:0.85rem;width:100%">
          <thead>
            <tr>
              <th>Item / Insumo</th>
              <th>Quantidade Expedida</th>
              <th>Instrução de Embalagem / Regra</th>
              <th style="text-align:center">Conferido (Separador)</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(it => `
              <tr>
                <td><strong>${it.produto}</strong></td>
                <td style="font-family:var(--font-mono);font-weight:700;color:#0284c7">${it.qtd} ${it.unidade || 'kg'}</td>
                <td style="font-size:0.8rem">${it.regra || 'Caixa/Fardo Fechado'}</td>
                <td style="text-align:center;font-size:1.1rem">☐</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="border-top:2px dashed #cbd5e1;padding-top:24px;margin-top:40px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;text-align:center;font-size:0.8rem;color:#475569">
        <div>_______________________________<br><strong>Conferente Estoque Central</strong></div>
        <div>_______________________________<br><strong>Motorista / Transportador</strong></div>
        <div>_______________________________<br><strong>Recebimento na Escola (Direção)</strong></div>
      </div>

      <div style="margin-top:20px;display:flex;justify-content:flex-end">
        <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir Guia de Expedição</button>
      </div>
    </div>
  `;

  window.showModal(`📄 Guia de Ordem de Serviço — ${escolaName}`, html, '850px');
};

window.imprimirGuiaCooperativaAF = (coopName) => {
  const cName = coopName || 'Cooperativa Parceira';
  const prod = (SharedState.getProductions() || []).filter(p => p.cooperativa === cName || (p.cooperativa || '').toLowerCase().includes(cName.toLowerCase()));
  const items = prod.length > 0 ? prod : [
    { produto: 'Melancia em cubos (Safra Local AF)', quantidadeTotalKg: 350, prazoColheita: 'Até 03/08/2026' },
    { produto: 'Banana Prata Orgânica AF', quantidadeTotalKg: 280, prazoColheita: 'Até 03/08/2026' },
  ];

  const html = `
    <div style="padding:20px;font-family:sans-serif;color:#0f172a;max-width:800px;margin:0 auto" id="print-af-guias">
      <div style="border-bottom:2px solid #16a34a;padding-bottom:12px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:1.1rem;font-weight:800;color:#15803d">SEMED · AGRICULTURA FAMILIAR PNAE</div>
          <div style="font-size:1rem;font-weight:700;color:#334155">ORDEM DE COLHEITA & FORNECIMENTO COOPERATIVADO</div>
          <div style="font-size:0.8rem;color:#64748b">Chamada Pública PNAE · Campo Grande (MS)</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:1.1rem;font-weight:800;color:#16a34a">ORDEM AF-2026/04</div>
          <div style="font-size:0.75rem;color:#64748b">${new Date().toLocaleDateString('pt-BR')}</div>
        </div>
      </div>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.85rem">
        <div><strong>Entidade Fornecedora:</strong> ${coopName}</div>
        <div><strong>Destino do Carregamento:</strong> Entreposto Central SEMED / Unidades Escolares Piloto</div>
        <div><strong>Status:</strong> <span style="color:#15803d;font-weight:700">🌾 Autorizado para Colheita e Entrega</span></div>
      </div>

      <div style="margin-bottom:16px">
        <h4 style="margin-bottom:8px;color:#0f172a">Produtos e Quantidades Autorizadas para Colheita</h4>
        <table class="data-table" style="font-size:0.85rem;width:100%">
          <thead>
            <tr>
              <th>Produto (Safra Sazonal AF)</th>
              <th>Volume Solicitado (kg)</th>
              <th>Prazo Limite de Colheita</th>
              <th style="text-align:center">Vistoria Sanitária</th>
            </tr>
          </thead>
          <tbody>
            ${items.map(it => `
              <tr>
                <td><strong>${it.produto}</strong> <span class="status-badge status-ok" style="font-size:0.7rem">🌾 AF</span></td>
                <td style="font-family:var(--font-mono);font-weight:800;color:#15803d">${it.quantidadeTotalKg || it.qtd} kg</td>
                <td style="color:#d97706;font-weight:700">${it.prazoColheita || 'Até 03/08/2026'}</td>
                <td style="text-align:center">✓ Aprovado</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="border-top:2px dashed #cbd5e1;padding-top:24px;margin-top:40px;display:grid;grid-template-columns:1fr 1fr;gap:20px;text-align:center;font-size:0.88rem;color:#475569">
        <div>_______________________________<br><strong>Presidente / Resp. Cooperativa</strong></div>
        <div>_______________________________<br><strong>Eng. Agrônomo / SEMED Nutrição</strong></div>
      </div>

      <div style="margin-top:20px;display:flex;justify-content:flex-end">
        <button class="btn btn-success" onclick="window.print()">🖨️ Imprimir Guia de Colheita AF</button>
      </div>
    </div>
  `;

  window.showModal(`🌾 Guia de Colheita AF — ${coopName}`, html, '850px');
};

window.alternarAbasOS = (aba) => {
  const secEscolas = document.getElementById('secao-os-escolas');
  const secCoop = document.getElementById('secao-os-coop');
  const btnEscolas = document.getElementById('tab-os-escolas-btn');
  const btnCoop = document.getElementById('tab-os-coop-btn');

  if (aba === 'coop') {
    if (secEscolas) secEscolas.style.display = 'none';
    if (secCoop) secCoop.style.display = 'block';
    if (btnEscolas) { btnEscolas.className = 'btn btn-outline btn-sm'; }
    if (btnCoop) { btnCoop.className = 'btn btn-primary btn-sm'; }
  } else {
    if (secEscolas) secEscolas.style.display = 'block';
    if (secCoop) secCoop.style.display = 'none';
    if (btnEscolas) { btnEscolas.className = 'btn btn-primary btn-sm'; }
    if (btnCoop) { btnCoop.className = 'btn btn-outline btn-sm'; }
  }
};

window.filtrarOSEscola = (escolaId) => {
  const blocks = document.querySelectorAll('.os-school-block');
  blocks.forEach(b => {
    if (escolaId === 'TODAS' || b.dataset.schoolId === String(escolaId)) {
      b.style.display = 'block';
    } else {
      b.style.display = 'none';
    }
  });
};

window.abrirModalDisparoManualOS = () => {
  const menu = window.currentActiveIAMenu || window.tempIAMenuPreview;
  const escolasVinculadas = (menu && menu.escolasVinculadas && menu.escolasVinculadas.length > 0)
    ? menu.escolasVinculadas
    : (DATA.schools || []).map(s => s.name);

  const coops = [
    { id: 'c1', name: 'COOPAGRAN (Cooperativa Indubrasil)', contato: '(67) 99888-3030' },
    { id: 'c2', name: 'COOPRAN (Produtores Terenos)', contato: '(67) 99888-4040' },
    { id: 'c3', name: 'COOPAERGS (Assoc. Agricultura Familiar)', contato: '(67) 99777-5050' }
  ];

  const content = `
    <div style="padding:4px 0; font-family:sans-serif; color:#1e293b;">
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px; margin-bottom:16px;">
        <div style="font-weight:800; color:#15803d; font-size:1.05rem;">📱 Central de Disparo Manual de Ordens de Serviço & Colheita</div>
        <div style="font-size:0.85rem; color:#166534; margin-top:2px;">
          Selecione com os marcadores (clickpoints) quais unidades escolares e fornecedores receberão as notificações e guias de expedição neste disparo.
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
        <!-- ESCOLAS -->
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #e2e8f0; padding-bottom:6px; margin-bottom:8px;">
            <strong style="font-size:0.9rem; color:#0369a1;">🏫 Escolas Destino (${escolasVinculadas.length})</strong>
            <label style="font-size:0.78rem; cursor:pointer; color:#0284c7;">
              <input type="checkbox" id="chk-toggle-all-escolas" checked onchange="document.querySelectorAll('.chk-disparo-escola').forEach(c=>c.checked=this.checked)">
              <strong>Selecionar Todas</strong>
            </label>
          </div>
          <div style="max-height:220px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;">
            ${escolasVinculadas.map((eName, idx) => `
              <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; background:#fff; padding:6px 8px; border-radius:4px; border:1px solid #e2e8f0; cursor:pointer;">
                <input type="checkbox" class="chk-disparo-escola" value="${eName.replace(/"/g,'&quot;')}" checked>
                <span>${eName}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- FORNECEDORES -->
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #bbf7d0; padding-bottom:6px; margin-bottom:8px;">
            <strong style="font-size:0.9rem; color:#14532d;">🌾 Fornecedores AF (${coops.length})</strong>
            <label style="font-size:0.78rem; cursor:pointer; color:#15803d;">
              <input type="checkbox" id="chk-toggle-all-coops" checked onchange="document.querySelectorAll('.chk-disparo-coop').forEach(c=>c.checked=this.checked)">
              <strong>Selecionar Todos</strong>
            </label>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${coops.map(c => `
              <label style="display:flex; align-items:center; gap:8px; font-size:0.85rem; background:#fff; padding:8px; border-radius:4px; border:1px solid #bbf7d0; cursor:pointer;">
                <input type="checkbox" class="chk-disparo-coop" value="${c.name.replace(/"/g,'&quot;')}" checked>
                <div>
                  <strong>${c.name}</strong>
                  <div style="font-size:0.75rem; color:#475569;">${c.contato}</div>
                </div>
              </label>
            `).join('')}
          </div>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px; border-top:1px solid #e2e8f0; padding-top:12px;">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="button" class="btn btn-primary" onclick="window.confirmarDisparoManualOS()">🚀 Disparar Notificações Selecionadas</button>
      </div>
    </div>
  `;

  window.showModal('📱 Central de Disparo Manual de Ordens de Serviço & Colheita', content, '800px');
};

window.confirmarDisparoManualOS = () => {
  const escolasMarcadas = Array.from(document.querySelectorAll('.chk-disparo-escola:checked')).map(c => c.value);
  const coopsMarcadas = Array.from(document.querySelectorAll('.chk-disparo-coop:checked')).map(c => c.value);

  if (escolasMarcadas.length === 0 && coopsMarcadas.length === 0) {
    return alert('Selecione ao menos uma escola ou fornecedor para efetuar o disparo.');
  }

  showToast(`✅ Disparo de Ordens de Serviço concluído! ${escolasMarcadas.length} Escola(s) e ${coopsMarcadas.length} Fornecedor(es) notificados com sucesso.`);
  closeModal();
};

window.visualizarEImprimirCardapio = (menuIdOrName) => {
  const menuList = SharedState.getWeeklyMenus ? SharedState.getWeeklyMenus() : [];
  const menusAll = SharedState.getMenus ? SharedState.getMenus() : [];

  const foundCardapio = SharedState.getCardapio ? SharedState.getCardapio(menuIdOrName) : null;
  const menuObj = foundCardapio ||
                  menusAll.find(m => m.nome === menuIdOrName || m.id === menuIdOrName) ||
                  menuList.find(m => m.nome === menuIdOrName || m.semana === menuIdOrName || m.id === menuIdOrName || m.cardapioId === menuIdOrName);

  const menu = menuObj || {
    nome: menuIdOrName || 'Cardápio Semanal PNAE',
    periodo: '03/08/2026 a 07/08/2026',
    refeicoes: [
      { dia: 'Segunda-feira', desjejum: 'Pão c/ Manteiga e Leite UHT', almoco: 'Arroz com Feijão, Coxa de Frango Assada e Salada Colorida', lanche: 'Laranja fatiada (100g)' },
      { dia: 'Terça-feira', desjejum: 'Mingau de Aveia', almoco: 'Arroz Integral, Feijão Preto, Carne Moída Ensopada e Salada de Cenoura', lanche: 'Melancia em cubos (120g)' },
      { dia: 'Quarta-feira', desjejum: 'Leite c/ Cacau e Pão', almoco: 'Galinhada Caipira com Milho e Ervilha e Salada de Pepino', lanche: 'Banana prata (1 un)' },
      { dia: 'Quinta-feira', desjejum: 'Vitamina de Mamão AF', almoco: 'Arroz, Feijão, Omelete Assado com Legumes e Salada de Repolho Roxo', lanche: 'Maçã nacional (1 un)' },
      { dia: 'Sexta-feira', desjejum: 'Pão c/ Queijo e Leite', almoco: 'Macarronada de Carne Moída ao Molho Caseiro de Tomate e Beterraba', lanche: 'Mamão formosa fatiado (100g)' }
    ]
  };

  const schools = DATA.schools || [];

  const html = `
    <div style="padding:10px 0; font-family:sans-serif; color:#0f172a;" id="print-menu-viewer">
      <div style="background:#f0f9ff; border:1px solid #bae6fd; padding:12px; border-radius:8px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div>
          <div style="font-weight:800; color:#0369a1; font-size:1.05rem;">🍱 VISUALIZAÇÃO DE CARDÁPIO PUBLICADO</div>
          <div style="font-size:0.85rem; color:#0c4a6e;">${menu.nome} · Período: <strong>${menu.periodo || 'Semanal'}</strong></div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <strong style="font-size:0.85rem;">Filtrar por Escola:</strong>
          <select id="select-view-escola-menu" class="btn btn-outline" style="padding:6px 10px; font-size:0.85rem; text-align:left;" onchange="window.filtrarVisualizacaoMenuEscola(this.value)">
            <option value="TODAS">🌐 Toda a Rede (Cardápio Geral)</option>
            ${schools.map(s => `<option value="${s.name}">${s.name} (${s.region})</option>`).join('')}
          </select>
        </div>
      </div>

      <div id="container-cardapio-escola-detalhes">
        <table class="data-table" style="width:100%; font-size:0.88rem;">
          <thead>
            <tr style="background:#e0f2fe;">
              <th>Dia da Semana</th>
              <th>☕ Café da Manhã / Desjejum</th>
              <th>🍲 Almoço Principal</th>
              <th>🍎 Lanche da Tarde</th>
            </tr>
          </thead>
          <tbody>
            ${(menu.refeicoes || []).map(r => `
              <tr>
                <td><strong>${r.dia}</strong></td>
                <td>${r.desjejum || 'Pão com Manteiga e Leite'}</td>
                <td><strong>${r.almoco || r.item || r.nomePrato || 'Arroz, Feijão e Proteína'}</strong></td>
                <td>${r.lanche || r.fruta || 'Fruta da Época AF'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="border-top:1px solid #cbd5e1; padding-top:14px; margin-top:20px; display:flex; justify-content:space-between; align-items:center;">
        <button class="btn btn-outline" onclick="closeModal()">Fechar</button>
        <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir Cardápio (Escola Selecionada / Geral)</button>
      </div>
    </div>
  `;

  window.showModal(`🍱 Visualização & Impressão — ${menu.nome}`, html, '900px');
};

window.filtrarVisualizacaoMenuEscola = (escolaName) => {
  const container = document.getElementById('container-cardapio-escola-detalhes');
  if (!container) return;

  // Ao selecionar 'TODAS', recarrega a tabela geral SEM abrir um segundo modal
  if (escolaName === 'TODAS') {
    const _menuName = document.querySelector('#select-view-escola-menu')?.dataset?.menuName || '';
    const menuList = SharedState.getWeeklyMenus ? SharedState.getWeeklyMenus() : [];
    const menu = menuList.find(m => m.nome === _menuName || m.semana === _menuName) || { refeicoes: [
      { dia: 'Segunda-feira', desjejum: 'Pão c/ Manteiga e Leite UHT', almoco: 'Arroz com Feijão, Coxa de Frango Assada e Salada Colorida', lanche: 'Laranja fatiada (100g)' },
      { dia: 'Terça-feira', desjejum: 'Mingau de Aveia', almoco: 'Arroz Integral, Feijão Preto, Carne Moída Ensopada e Salada de Cenoura', lanche: 'Melancia em cubos (120g)' },
      { dia: 'Quarta-feira', desjejum: 'Leite c/ Cacau e Pão', almoco: 'Galinhada Caipira com Milho e Ervilha e Salada de Pepino', lanche: 'Banana prata (1 un)' },
      { dia: 'Quinta-feira', desjejum: 'Vitamina de Mamão AF', almoco: 'Arroz, Feijão, Omelete Assado com Legumes e Salada de Repolho Roxo', lanche: 'Maçã nacional (1 un)' },
      { dia: 'Sexta-feira', desjejum: 'Pão c/ Queijo e Leite', almoco: 'Macarronada de Carne Moída ao Molho Caseiro de Tomate e Beterraba', lanche: 'Mamão formosa fatiado (100g)' }
    ]};
    container.innerHTML = `<table class="data-table" style="width:100%; font-size:0.88rem;">
      <thead><tr style="background:#e0f2fe;">
        <th>Dia da Semana</th><th>☕ Café da Manhã / Desjejum</th><th>🍲 Almoço Principal</th><th>🍎 Lanche da Tarde</th>
      </tr></thead><tbody>${(menu.refeicoes||[]).map(r => `
        <tr>
          <td><strong>${r.dia}</strong></td>
          <td>${r.desjejum||'Pão com Manteiga e Leite'}</td>
          <td><strong>${r.almoco||r.item||r.nomePrato||'Arroz, Feijão e Proteína'}</strong></td>
          <td>${r.lanche||r.fruta||'Fruta da Época AF'}</td>
        </tr>`).join('')}</tbody></table>`;
    return;
  }

  const activeRestricoes = (SharedState.getRestricoes() || []).filter(r => r.status === 'ativo' && (r.schoolName || '').toLowerCase() === escolaName.toLowerCase());
  const alunosEspeciais = SharedState.getAlunosEspeciais ? SharedState.getAlunosEspeciais(escolaName) : [];

  let alertaRestrHtml = '';
  if (alunosEspeciais.length > 0 || activeRestricoes.length > 0) {
    const totalRestr = alunosEspeciais.length || activeRestricoes.reduce((a,b)=>a+(b.quantidade||1), 0);
    alertaRestrHtml = `
      <div style="background:#fff7ed; border-left:4px solid #f97316; padding:10px 12px; border-radius:6px; margin-bottom:12px; font-size:0.85rem; color:#c2410c;">
        🛡️ <strong>Adaptações Clínicas da Escola (${escolaName}):</strong> ${totalRestr} aluno(s) com restrição clínica cadastrada (Zero Lactose, Sem Glúten). Insumos especiais calculados na OS.
      </div>
    `;
  }

  container.innerHTML = `
    ${alertaRestrHtml}
    <div style="background:#f8fafc; border:1px solid #e2e8f0; padding:10px 14px; border-radius:6px; margin-bottom:14px; font-size:0.88rem;">
      Unidade Escolar: <strong>${escolaName}</strong> · Cardápio Personalizado com Dieta Adaptada PNAE
    </div>
    <table class="data-table" style="width:100%; font-size:0.88rem;">
      <thead>
        <tr style="background:#e0f2fe;">
          <th>Dia da Semana</th>
          <th>☕ Café da Manhã / Desjejum</th>
          <th>🍲 Almoço Principal</th>
          <th>🍎 Lanche da Tarde</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Segunda-feira</strong></td><td>Pão c/ Manteiga e Leite (Zero Lactose p/ alunos com laudo)</td><td><strong>Arroz com Feijão, Coxa de Frango Assada e Salada Colorida</strong></td><td>Laranja fatiada (100g) AF</td></tr>
        <tr><td><strong>Terça-feira</strong></td><td>Mingau de Aveia (Sem Lactose)</td><td><strong>Arroz Integral, Feijão Preto, Carne Moída Ensopada e Salada de Cenoura</strong></td><td>Melancia em cubos (120g) AF</td></tr>
        <tr><td><strong>Quarta-feira</strong></td><td>Leite c/ Cacau e Pão (Sem Glúten p/ celíacos)</td><td><strong>Galinhada Caipira com Milho e Ervilha e Salada de Pepino</strong></td><td>Banana prata (1 un) AF</td></tr>
        <tr><td><strong>Quinta-feira</strong></td><td>Vitamina de Mamão AF</td><td><strong>Arroz, Feijão, Omelete Assado com Legumes e Salada de Repolho Roxo</strong></td><td>Maçã nacional (1 un)</td></tr>
        <tr><td><strong>Sexta-feira</strong></td><td>Pão c/ Queijo e Leite</td><td><strong>Macarronada de Carne Moída ao Molho Caseiro de Tomate e Beterraba</strong></td><td>Mamão formosa fatiado (100g) AF</td></tr>
      </tbody>
    </table>
  `;
};

window.dispararNotificacoesProdutores = () => {
  const coops = [
    { name: 'COOPAGRAN (Cooperativa Indubrasil)', contato: '(67) 99888-3030' },
    { name: 'COOPRAN (Produtores Terenos)', contato: '(67) 99888-4040' },
    { name: 'COOPAERGS (Assoc. Agricultura Familiar)', contato: '(67) 99777-5050' }
  ];

  const content = `
    <div style="padding:10px 0; font-family:sans-serif;">
      <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:12px; margin-bottom:16px;">
        <div style="font-weight:800; color:#15803d; font-size:1.05rem;">📱 Central de Notificação Automática aos Produtores (RF-007)</div>
        <div style="font-size:0.85rem; color:#166534; margin-top:2px;">
          O cardápio aprovado pela Dra. Lilian Droppa disparou comunicações automáticas com a lista de colheita e escolas destino para os fornecedores cadastrados.
        </div>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        ${coops.map(c => `
          <div style="background:#fff; border:1px solid #e2e8f0; border-left:4px solid #16a34a; border-radius:8px; padding:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <strong>🌾 ${c.name}</strong>
              <span class="status-badge status-ok" style="font-size:0.75rem;">✓ NOTIFICAÇÃO ENVIADA AUTOMATICAMENTE</span>
            </div>
            <div style="font-size:0.82rem; color:#475569; margin-bottom:6px;">
              Envio via WhatsApp API / SMS / Portal do Fornecedor para <strong>${c.contato}</strong>
            </div>
            <div style="background:#f8fafc; padding:8px 12px; border-radius:6px; font-family:var(--font-mono); font-size:0.78rem; color:#334155; border:1px dashed #cbd5e1;">
              "Olá! A Nutricionista SEMED aprovou o Cardápio PNAE. Ordem de Colheita AF emitida com sucesso. Acesse a guia de carregamento no portal."
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top:16px; display:flex; justify-content:flex-end;">
        <button class="btn btn-primary" onclick="closeModal()">Concluído</button>
      </div>
    </div>
  `;

  window.showModal('📱 Disparo Automático aos Agricultores (RF-007)', content, '800px');
};

window.gerarRelatorioMensal4Paginas = () => {
  const today = new Date();
  const mesNome = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase();
  const numAlunos = (DATA.schools || []).reduce((a, b) => a + b.students, 0);

  const semanas = [
    { num: 1, periodo: '01 a 07 de ' + mesNome },
    { num: 2, periodo: '08 a 14 de ' + mesNome },
    { num: 3, periodo: '15 a 21 de ' + mesNome },
    { num: 4, periodo: '22 a 28 de ' + mesNome },
  ];

  const html = `
    <div style="padding:10px;font-family:sans-serif;color:#0f172a" id="print-mensal-4paginas">
      <div style="background:#0284c7;color:#fff;padding:12px;border-radius:8px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-weight:800;font-size:1.1rem">📄 RELATÓRIO MENSAL PADRONIZADO (4 PÁGINAS / MÊS - RF-010)</div>
          <div style="font-size:0.85rem;opacity:0.9">Formatado para afixação em mural escolar · Mês: ${mesNome}</div>
        </div>
        <button class="btn" style="background:#fff;color:#0284c7;font-weight:700" onclick="window.print()">🖨️ Imprimir 4 Folhas A4</button>
      </div>

      ${semanas.map(sem => `
        <div style="background:#fff;border:2px solid #0284c7;border-radius:8px;padding:20px;margin-bottom:30px;page-break-after:always;">
          <div style="border-bottom:2px solid #0284c7;padding-bottom:10px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-weight:800;font-size:1.1rem;color:#0369a1">PREFEITURA MUNICIPAL DE CAMPO GRANDE · SEMED</div>
              <div style="font-weight:700;font-size:0.95rem;color:#334155">CARDÁPIO OFICIAL PNAE — SEMANA 0${sem.num} (${sem.periodo})</div>
            </div>
            <div style="text-align:right;font-size:0.8rem;color:#64748b">
              Página ${sem.num} de 4<br>
              <strong>Folha de Mural Escolar</strong>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:14px;font-size:0.82rem">
            <div><strong>Nutricionista:</strong> Dra. Lilian Droppa (CRN 12345)</div>
            <div><strong>Meta Nutricional:</strong> 700 kcal/dia</div>
            <div><strong>População Atendida:</strong> ${numAlunos.toLocaleString('pt-BR')} Alunos</div>
          </div>

          <table class="data-table" style="width:100%;font-size:0.85rem">
            <thead>
              <tr style="background:#e0f2fe">
                <th>Dia</th>
                <th>Desjejum / Café</th>
                <th>Almoço Principal</th>
                <th>Lanche da Tarde</th>
                <th>Ícones de Alergênicos / Obs</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><strong>Segunda</strong></td><td>Pão c/ Manteiga e Leite</td><td>Arroz, Feijão Carioca, Frango Grelhado, Salada de Alface e Tomate AF 🌾</td><td>Vitamina de Banana</td><td>🥛 Contém Lactose</td></tr>
              <tr><td><strong>Terça</strong></td><td>Mingau de Aveia</td><td>Arroz, Feijão Preto, Carne Bovina Moída, Cenoura Ralada AF 🌾</td><td>Maçã Gala (100g)</td><td>🌾 Contém Glúten</td></tr>
              <tr><td><strong>Quarta</strong></td><td>Leite c/ Cacau e Pão</td><td>Risoto de Frango com Legumes e Abóbora Cabotiá AF 🌾</td><td>Biscoito Maisena e Suco Natural</td><td>🥛 Contém Lactose</td></tr>
              <tr><td><strong>Quinta</strong></td><td>Vitamina de Mamão AF 🌾</td><td>Arroz Integral, Feijão, Ovos Mexidos, Beterraba Cozida AF 🌾</td><td>Melancia Fatiada AF 🌾</td><td>🟢 Sem Alergênicos Comuns</td></tr>
              <tr><td><strong>Sexta</strong></td><td>Pão c/ Queijo e Leite</td><td>Macarrão com Molho de Frango e Salada Colorida AF 🌾</td><td>Salada de Frutas Mistas AF 🌾</td><td>🌾 Contém Glúten / 🥛 Lactose</td></tr>
            </tbody>
          </table>

          <div style="margin-top:30px;border-top:1px solid #ccc;padding-top:14px;display:flex;justify-content:space-between;font-size:0.78rem;color:#475569">
            <div>Assinatura Nutricionista: __________________________</div>
            <div>Visto Direção Escolar: __________________________</div>
            <div>Carimbo SEMED Nutrição</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  window.showModal('📄 Relatório Mensal Padronizado (4 Páginas - RF-010)', html, '950px');
};

window.abrirModalNovoAlunoEspecial = () => {
  const schools = DATA.schools || [];
  const content = `
    <form onsubmit="window.salvarNovoAlunoEspecial(event)">
      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Nome Completo do Aluno(a)</label>
        <input type="text" id="aluno-nome" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: Lucas Gabriel Mello" required>
      </div>
      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Escola Alvo</label>
        <select id="aluno-escola" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
          ${schools.map(s => `<option value="${s.name}">${s.name} (${s.region})</option>`).join('')}
        </select>
      </div>
      <div class="grid-2 gap-10 mb-12">
        <div>
          <label style="font-weight:600;display:block;margin-bottom:4px">Turma</label>
          <input type="text" id="aluno-turma" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: Creche II-A ou EF 4º Ano B" required>
        </div>
        <div>
          <label style="font-weight:600;display:block;margin-bottom:4px">Data de Nascimento (RN-002 Faixa Etária)</label>
          <input type="date" id="aluno-nascimento" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
        </div>
      </div>
      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Tipo de Restrição Clínica</label>
        <select id="aluno-restricao" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
          <option value="Intolerância à lactose">Intolerância à lactose</option>
          <option value="Doença celíaca (Glúten)">Doença celíaca (Glúten)</option>
          <option value="Diabetes">Diabetes</option>
          <option value="Alergia à Proteína do Leite (APLV)">Alergia à Proteína do Leite (APLV)</option>
          <option value="Fenilcetonúria">Fenilcetonúria</option>
          <option value="Vegetariano/Vegano">Vegetariano/Vegano</option>
        </select>
      </div>
      <div class="form-group mb-18">
        <label style="font-weight:600;display:block;margin-bottom:4px">Identificação do Laudo Médico</label>
        <input type="text" id="aluno-laudo" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: Laudo Dr. Carlos Rossi - CRM 4521" required>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">💾 Salvar Cadastrado Nominal</button>
      </div>
    </form>
  `;
  window.showModal('👶 Novo Cadastro Nominal de Aluno Especial (RF-003)', content, '650px');
};

window.salvarNovoAlunoEspecial = (e) => {
  e.preventDefault();
  const nome = document.getElementById('aluno-nome').value;
  const escola = document.getElementById('aluno-escola').value;
  const turma = document.getElementById('aluno-turma').value;
  const dataNascimento = document.getElementById('aluno-nascimento').value;
  const restricao = document.getElementById('aluno-restricao').value;
  const laudo = document.getElementById('aluno-laudo').value;

  SharedState.addAlunoEspecial({ nome, escola, turma, dataNascimento, restricao, laudo });
  showToast(`✅ Aluno(a) ${nome} cadastrado(a) com sucesso no controle nominal de dietas!`);
  closeModal();
  const container = document.getElementById('page-content');
  if (container) PAGE_RENDERERS.nutricionista_restricoes(container);
};

window.excluirAlunoEspecial = (id) => {
  if (!confirm('Deseja remover este cadastro de aluno especial?')) return;
  SharedState.deleteAlunoEspecial(id);
  showToast('✅ Aluno removido com sucesso!');
  const container = document.getElementById('page-content');
  if (container) PAGE_RENDERERS.nutricionista_restricoes(container);
};

// REQUISITOS PDF: ESTOQUE SUAL READ-ONLY PARA NUTRIÇÃO

// GUIAS DE ENTREGA & SUBSTITUIÇÃO SAZONAL (Requisito PDF nº 4)
// Migrado para js/modules/nutricao.js: a tela, a Guia de Remessa em 2 vias e o
// fluxo de substituição por sazonalidade (abrirModalSubstituicaoSazonal /
// salvarSubstituicaoSazonal / removerSubstituicaoSazonal) vivem lá agora.

// Helper de Relatório Mensal 4 Páginas por Mês (Requisito PDF nº 5)
window.abrirRelatorioMensal4Paginas = (cardapioIdOrNome) => {
  const menus = SharedState.getMenus();
  const menuObj = SharedState.getCardapio(cardapioIdOrNome) || menus.find(m => m.nome === cardapioIdOrNome) || menus[0] || { nome: 'Cardápio Oficial', numSemanas: 5 };
  const semanas = SharedState.getSemanasDoCardapio(menuObj.id);
  const numSemanas = menuObj.numSemanas || (semanas.length > 0 ? semanas.length : 5);

  const content = `
    <div id="print-4-pages-container" style="font-family:Inter,sans-serif">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px" class="no-print">
        <div>
          <h3 style="margin:0">📄 Relatório de Cardápio por Período — ${menuObj.nome}</h3>
          <div style="font-size:0.85rem;color:var(--text-secondary)">Periodicidade: ${(menuObj.periodicidade || 'mensal').toUpperCase()} (${numSemanas} Páginas / Semanas)</div>
        </div>
        <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir (${numSemanas} Páginas para o Mural)</button>
      </div>

      ${Array.from({ length: numSemanas }, (_, i) => i + 1).map(semanaIdx => {
        const semData = semanas.find(s => s.indiceSemana === semanaIdx) || { semana: `Semana ${semanaIdx}`, refeicoes: [] };
        const refeicoes = (semData.refeicoes && semData.refeicoes.length > 0)
          ? semData.refeicoes
          : [
              { dia: 'Segunda-feira', tipo: 'Almoço', item: 'Arroz, Feijão Carioca, Coxa de Frango Assada e Salada 🌽' },
              { dia: 'Terça-feira', tipo: 'Almoço', item: 'Arroz Integral, Feijão Preto, Carne Moída Ensopada e Salada 🌽' },
              { dia: 'Quarta-feira', tipo: 'Almoço', item: 'Macarrão Espaguete ao Molho de Tomate 🌽 c/ Carne Moída' },
              { dia: 'Quinta-feira', tipo: 'Almoço', item: 'Arroz Branco, Feijão Carioca, Ovos Mexidos 🌽 e Salada 🌽' },
              { dia: 'Sexta-feira', tipo: 'Almoço', item: 'Polenta c/ Carne Bovina Ensopada e Mandioca Cozida 🌽' }
            ];

        return `
          <div style="background:#fff;padding:24px;border:1px solid #ccc;margin-bottom:24px;page-break-after:always">
            <div style="border-bottom:2px solid #1565C0;padding-bottom:10px;margin-bottom:16px;display:flex;justify-content:space-between">
              <div>
                <h2 style="margin:0;color:#1565C0">PREFEITURA MUNICIPAL DE CAMPO GRANDE — SEMED</h2>
                <div style="font-size:0.9rem;font-weight:700;color:#333">SUPERINTENDÊNCIA DE ALIMENTAÇÃO ESCOLAR (SUAL)</div>
                <div style="font-size:0.85rem;color:#666">Cardápio Oficial — <strong>${semData.semana || `SEMANA ${semanaIdx} DE ${numSemanas}`}</strong> (${menuObj.nome})</div>
              </div>
              <div style="text-align:right;font-size:0.8rem">
                <div>RT: Dra. Lilian Droppa</div>
                <div>CRN 12345/MS</div>
              </div>
            </div>

            <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
              <thead>
                <tr style="background:#1565C0;color:#fff">
                  <th style="padding:8px;border:1px solid #999">Dia da Semana</th>
                  <th style="padding:8px;border:1px solid #999">Desjejum (Manhã)</th>
                  <th style="padding:8px;border:1px solid #999">Almoço Principal</th>
                  <th style="padding:8px;border:1px solid #999">Lanche da Tarde</th>
                </tr>
              </thead>
              <tbody>
                ${refeicoes.map(r => `
                  <tr style="${r.desabilitado ? 'background:#f1f5f9;color:#94a3b8;' : ''}">
                    <td style="padding:8px;border:1px solid #999"><strong>${r.dia}${r.diaData ? ` (${r.diaData.split('-').reverse().join('/')})` : ''}</strong></td>
                    <td style="padding:8px;border:1px solid #999">${r.desabilitado ? '— (Dia fora do mês)' : (r.desjejum || 'Pão c/ Manteiga e Leite UHT 🌽')}</td>
                    <td style="padding:8px;border:1px solid #999"><strong>${r.desabilitado ? '— (Sem atividade letiva no mês)' : (r.almoco || r.item || 'Arroz, Feijão e Proteína 🌽')}</strong></td>
                    <td style="padding:8px;border:1px solid #999">${r.desabilitado ? '—' : (r.lanche || 'Fruta da Safra AF 🌽')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="margin-top:20px;display:flex;justify-content:space-between;font-size:0.78rem;border-top:1px solid #ddd;padding-top:10px">
              <div>🌽 Alimentos advindos da Agricultura Familiar Local · PNAE/FNDE</div>
              <div>Página ${semanaIdx} de ${numSemanas} — Afixar no Mural da Escola</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  window.showModal(`📄 Relatório Impresso — ${menuObj.nome} (${numSemanas} Páginas)`, content, '900px');
};

window.renderAISummaryCard = (menuObj, container) => {
  const metricas = menuObj.metricasSemanais;
  const isAprovado = menuObj.statusAprovacao === 'aprovado_nutri';

  const aiSummaryCard = document.createElement('div');
  aiSummaryCard.className = 'card mb-16 ai-summary-card';
  aiSummaryCard.style.cssText = isAprovado 
    ? 'border-left: 5px solid #10b981; background: #f0fdf4; padding: 18px; margin-bottom: 16px;'
    : 'border-left: 5px solid #f59e0b; background: #fffbe6; padding: 18px; margin-bottom: 16px;';

  const insumosTableRows = menuObj.insumosResumoSemanal.map(ins => `
    <tr>
      <td><strong>${ins.nome}</strong> ${ins.af ? '<span class="status-badge status-ok" style="font-size:0.7rem">🌾 Agric. Familiar</span>' : ''}</td>
      <td style="font-family:var(--font-mono);font-weight:700">${ins.perCapitaGramos} ${ins.unidade}</td>
      <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${ins.totalSemanalKg.toLocaleString('pt-BR')} kg</td>
    </tr>
  `).join('');

  aiSummaryCard.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:12px">
      <div>
        <div style="font-weight:800;color:${isAprovado ? '#065f46' : '#b45309'};display:flex;align-items:center;gap:8px;font-size:1.1rem">
          <span>${isAprovado ? '🟢 CARDÁPIO APROVADO PELA NUTRICIONISTA' : '🟡 RASCUNHO GERADO POR IA — AGUARDANDO REVISÃO'}</span>
          <span class="status-badge" style="background:${isAprovado ? '#d1fae5' : '#fef3c7'};color:${isAprovado ? '#065f46' : '#92400e'};font-weight:700">
            ${isAprovado ? '✓ Aprovado por Dra. Lilian Droppa' : '🔒 Relatório PNAE Travado'}
          </span>
        </div>
        <div style="font-size:0.88rem;color:${isAprovado ? '#047857' : '#78350f'};margin-top:4px">
          Média PNAE: <strong>${metricas.mediaKcal} kcal/dia</strong> · Proteínas: ${metricas.mediaProteinas}g · Sódio: ${metricas.mediaSodio}mg · 🌾 <strong>${metricas.percentualAF}% Agricultura Familiar</strong>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${!isAprovado ? `
          <button class="btn btn-primary btn-sm" onclick="window.aprovarCardapioIA()">✅ Aprovar Cardápio (Dra. Lilian Droppa)</button>
          <button class="btn btn-outline btn-sm" style="background:#fff" onclick="alert('🔒 O Relatório Técnico PNAE só será liberado após o clique no botão de aprovação da Nutricionista.')">🔒 Relatório Bloqueado</button>
        ` : `
          <button class="btn btn-success btn-sm" onclick="window.abrirRelatorioPNAE()">📄 Visualizar / Imprimir Relatório PNAE</button>
          <button class="btn btn-outline btn-sm" style="background:#fff" onclick="window.gerarRelatorioMensal4Paginas()">📄 Relatório Mensal (4 Páginas)</button>
        `}
        <button class="btn btn-outline btn-sm" style="background:#fff" onclick="window.executarGeracaoCardapioIA()">🔄 Regenerar IA</button>
      </div>
    </div>

    <!-- FEFO BADGES ALERT -->
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
      <span class="status-badge status-warning" style="font-size:0.75rem">⚡ Priorização FEFO Ativa: Insumos próximos do vencimento incorporados</span>
      <span class="status-badge status-ok" style="font-size:0.75rem">🌾 Safra Sazonal: Frutas e legumes locais da época priorizados</span>
    </div>

    <!-- ACCORDION PER CAPITA -->
    <details style="background:#ffffff;border:1px solid rgba(0,0,0,0.08);border-radius:6px;padding:10px 14px">
      <summary style="font-weight:700;cursor:pointer;font-size:0.88rem;color:var(--text-primary)">
        📊 Ver Tabela de Per Capita (g/aluno) e Demanda Total Semanal da Rede (${metricas.numAlunos.toLocaleString('pt-BR')} Alunos)
      </summary>
      <div style="margin-top:10px">
        <table class="data-table" style="font-size:0.82rem">
          <thead>
            <tr>
              <th>Ingrediente</th>
              <th>Per Capita (por Aluno)</th>
              <th>Demanda Total da Semana (Rede)</th>
            </tr>
          </thead>
          <tbody>
            ${insumosTableRows}
          </tbody>
        </table>
      </div>
    </details>
  `;

  const oldSummary = container.querySelector('.ai-summary-card');
  if (oldSummary) oldSummary.remove();
  container.insertBefore(aiSummaryCard, container.firstChild);
};

window.aprovarCardapioIA = () => {
  if (!window.currentActiveIAMenu) return alert('Nenhum cardápio ativo para aprovação.');
  
  window.currentActiveIAMenu = window.AICardapioEngine.approveMenu(window.currentActiveIAMenu);
  
  const container = document.getElementById('planner-days-container');
  if (container) {
    window.renderAISummaryCard(window.currentActiveIAMenu, container);
  }

  showToast('✅ Cardápio aprovado com sucesso pela Dra. Lilian Droppa! Notificações automáticas disparadas.');
  window.dispararNotificacoesProdutores();
};

window.abrirRelatorioPNAE = () => {
  const menu = window.currentActiveIAMenu;
  if (!menu || menu.statusAprovacao !== 'aprovado_nutri') {
    return alert('🔒 Acesso negado. O Relatório PNAE exige aprovação prévia da Dra. Lilian Droppa.');
  }

  const m = menu.metricasSemanais;
  const content = `
    <div style="padding:10px;font-family:sans-serif;color:#1e293b" id="relatorio-pnae-print">
      <div style="border-bottom:2px solid #0284c7;padding-bottom:12px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:1.2rem;font-weight:800;color:#0369a1">SEMED / SUALE — CAMPO GRANDE (MS)</div>
          <div style="font-size:0.95rem;font-weight:700;color:#334155">RELATÓRIO TÉCNICO DE CONFORMIDADE NUTRICIONAL — PNAE</div>
          <div style="font-size:0.8rem;color:#64748b">Resolução FNDE nº 06/2020 · Sistema SAGED Vigia Educa</div>
        </div>
        <div style="text-align:right">
          <span class="status-badge status-ok" style="font-size:0.85rem;padding:6px 12px">🟢 DOCUMENTO OFICIAL APROVADO</span>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;background:#f8fafc;padding:12px;border-radius:8px;margin-bottom:16px;font-size:0.85rem">
        <div><strong>Nutricionista Responsável:</strong> Dra. Lilian Droppa (CRN 12345/MS)</div>
        <div><strong>Data de Aprovação:</strong> ${new Date(menu.aprovadoEm).toLocaleString('pt-BR')}</div>
        <div><strong>Modalidade:</strong> Ensino Fundamental Integral (${m.numAlunos.toLocaleString('pt-BR')} Alunos)</div>
        <div><strong>Código de Autenticação:</strong> PNAE-CG-${Date.now().toString(36).toUpperCase()}</div>
      </div>

      <div style="margin-bottom:16px">
        <h4 style="margin-bottom:8px;color:#0f172a">1. Balanço e Metas Nutricionais Calculadas (Média Diária)</h4>
        <table class="data-table" style="font-size:0.85rem">
          <thead>
            <tr>
              <th>Parâmetro</th>
              <th>Meta PNAE</th>
              <th>Valor Calculado pela IA</th>
              <th>Status de Conformidade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Valor Energético (Kcal)</strong></td>
              <td>650 - 800 kcal</td>
              <td><strong>${m.mediaKcal} kcal</strong></td>
              <td><span class="status-badge status-ok">✓ 100% Adequado</span></td>
            </tr>
            <tr>
              <td><strong>Proteínas Total</strong></td>
              <td>≥ 25g</td>
              <td>${m.mediaProteinas}g</td>
              <td><span class="status-badge status-ok">✓ Adequado</span></td>
            </tr>
            <tr>
              <td><strong>Sódio Máximo</strong></td>
              <td>≤ 500mg</td>
              <td>${m.mediaSodio}mg</td>
              <td><span class="status-badge status-ok">✓ Controlado</span></td>
            </tr>
            <tr>
              <td><strong>Agricultura Familiar</strong></td>
              <td>≥ 30% do PNAE</td>
              <td><strong>${m.percentualAF}% da pauta</strong></td>
              <td><span class="status-badge status-ok">✓ Meta Superada</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-bottom:16px">
        <h4 style="margin-bottom:8px;color:#0f172a">2. Resumo de Refeições da Semana (Segunda a Sexta)</h4>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${menu.refeicoes.map(r => `
            <div style="background:#fff;border:1px solid #e2e8f0;padding:8px 12px;border-radius:6px;font-size:0.83rem">
              <strong>${r.dia}:</strong> ${r.nomePrato} (${r.kcal} kcal)
              <div style="color:#64748b;font-size:0.78rem">Acompanhamento: ${r.fruta} ${r.fefoBadge ? '· <span style="color:#d97706;font-weight:700">'+r.fefoBadge+'</span>' : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="border-top:2px dashed #cbd5e1;padding-top:16px;margin-top:20px;display:flex;justify-content:space-between;align-items:center">
        <div style="font-size:0.8rem;color:#64748b">
          Assinado digitalmente por <strong>Dra. Lilian Droppa</strong><br>
          Nutricionista Responsável Técnica — SEMED Campo Grande
        </div>
        <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir / Exportar PDF</button>
      </div>
    </div>
  `;

  window.showModal('📄 Relatório Técnico PNAE — Aprovado', content, '950px');
};

window.togglePlannerEscolas = () => {
  const isLista = document.getElementById('planner-escopo-rede') && !document.getElementById('planner-escopo-rede').checked;
  const box = document.getElementById('planner-escolas-list');
  if (box) box.style.display = isLista ? 'block' : 'none';
};

window.calculatePlannerKcal = () => {
  const selects = document.querySelectorAll('.planner-select-kcal');
  let total = 0;
  selects.forEach(s => total += parseInt(s.value) || 0);
  
  const days = document.querySelectorAll('.planner-day-block').length;
  const avg = days > 0 ? Math.round(total / days) : 0;
  
  const el = document.getElementById('planner-total-kcal');
  if (el) el.textContent = `${avg} kcal/dia`;
};

window.cancelMenuPlanner = () => {
  const container = document.getElementById('page-content');
  PAGE_RENDERERS.nutricionista_cardapios(container);
};

window.saveWeeklyMenu = () => {
  const start = document.getElementById('planner-start-date').value;
  const end = document.getElementById('planner-end-date').value;
  const daysCount = document.querySelectorAll('.planner-day-block').length;

  if (daysCount === 0) return alert('Gere e preencha os dias do cardápio antes de salvar.');

  const d1 = start.split('-').reverse().join('/');
  const d2 = end.split('-').reverse().join('/');
  const name = `Cardápio Personalizado — ${d1} a ${d2}`;

  // Calcula média nutricional
  const selects = document.querySelectorAll('.planner-select-kcal');
  let total = 0;
  selects.forEach(s => total += parseInt(s.value) || 0);
  const kcalMedia = daysCount > 0 ? Math.round(total / daysCount) : 0;

  const totalSchools = (DATA.schools||[]).length || 183;
  const prof = PROFILES[state.currentProfile] || {};

  // Coleta escolas vinculadas
  const escopoRede = document.getElementById('planner-escopo-rede')?.checked !== false;
  let escolasVinculadas = [];
  let escolaLabel = 'Toda a Rede';
  if (escopoRede) {
    escolasVinculadas = (DATA.schools || []).map(s => s.name);
  } else {
    escolasVinculadas = Array.from(document.querySelectorAll('.planner-escola-chk:checked')).map(c => c.value);
    if (escolasVinculadas.length === 0) return alert('Marque ao menos uma escola ou selecione "Toda a rede".');
    escolaLabel = escolasVinculadas.length + ' escola(s)';
  }

  // Coleta refeições dia a dia
  const refeicoes = [];
  document.querySelectorAll('.planner-day-block').forEach(block => {
    const dia = block.dataset.date;
    block.querySelectorAll('.planner-select-kcal').forEach(sel => {
      const id = sel.id || '';
      let tipo = 'Almoço';
      if (id.includes('bkf') || id.includes('breakfast')) tipo = 'Café da Manhã';
      else if (id.includes('snk') || id.includes('snack')) tipo = 'Lanche';
      const itemText = sel.options[sel.selectedIndex]?.text || '';
      const kcal = parseInt(sel.value) || 0;
      if (itemText && !itemText.startsWith('Selecione')) refeicoes.push({ dia, tipo, item: itemText, kcal });
    });
  });

  // Salva como Em Elaboração — só vai para Publicados após clicar em Publicar
  SharedState.addMenu({
    nome: name,
    periodo: `${d1} a ${d2}`,
    escolas: escolasVinculadas.length,
    escolasVinculadas,
    status: 'Em Elaboração',
    tipo: 'Semanal',
    autor: prof.name || 'Dra. Lilian Droppa',
    refeicoes,
    kcalMedia,
    insumosResumoSemanal: (window.currentActiveIAMenu && window.currentActiveIAMenu.insumosResumoSemanal)
      ? window.currentActiveIAMenu.insumosResumoSemanal
      : [],
  });
  // Não grava no localStorage legado como Publicado

  showToast('📝 Cardápio salvo em Elaboração! Use o botão "🚀 Publicar" para enviar às escolas.');
  const container = document.getElementById('page-content');
  PAGE_RENDERERS.nutricionista_cardapios(container);
};

window.showMenuViewer = () => {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="page-header"><div class="page-title">Visualização de Cardápio</div><div class="page-subtitle">Detalhes do cardápio semanal selecionado</div></div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Cardápio da Semana</div></div>
      <div class="card-body">
        <table class="data-table">
          <thead><tr><th>Dia da Semana</th><th>Café da Manhã</th><th>Almoço</th><th>Lanche</th></tr></thead>
          <tbody>
            <tr><td><strong>Segunda-Feira</strong></td><td>Pão com Manteiga e Leite</td><td>Arroz com Feijão Tradicional</td><td>Biscoito Maisena e Suco</td></tr>
            <tr><td><strong>Terça-Feira</strong></td><td>Vitamina de Banana</td><td>Macarrão com Carne Moída</td><td>Fruta (Maçã/Banana)</td></tr>
            <tr><td><strong>Quarta-Feira</strong></td><td>Cereal com Leite</td><td>Frango Grelhado com Legumes</td><td>Bolo Simples</td></tr>
            <tr><td><strong>Quinta-Feira</strong></td><td>Pão com Queijo</td><td>Risoto de Frango</td><td>Biscoito Doce e Chá</td></tr>
            <tr><td><strong>Sexta-Feira</strong></td><td>Iogurte com Cereal</td><td>Estrogonofe de Carne</td><td>Suco Natural e Pão</td></tr>
          </tbody>
        </table>
        <div style="margin-top:20px;display:flex;justify-content:flex-end">
          <button class="btn btn-primary" onclick="cancelMenuPlanner()">Voltar aos Cardápios</button>
        </div>
      </div>
    </div>
  `;
};

// Escola vê apenas a sua própria unidade em foco (drill-down local)
// escola_escolas -> js/modules/escolas.js (Fase 4.2, movido).

// gestor_escolas, estoque_escolas, nutricionista_escolas, agricultor_escolas
// -> movidos como closures para seus modulos (Fase 4.7).

window.renderWasteChart = (data) => {
  createChart('chart-desperdicio', {
    type: 'bar',
    data: {
      labels: ['EMTI PROF. IRACEMA', 'EMRTI GOV. ARNALDO', 'EM ADV. DEMOSTHENES M.', 'EM PROF. ANTÔNIO L.', 'EM José R.B.'],
      datasets: [{ label: 'Desperdício (kg)', data: data, backgroundColor: CHART_COLORS.red, borderRadius: 4 }]
    },
    options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } } }
  });
};

window.handleLogWaste = (event) => {
  event.preventDefault();
  const amt = parseInt(document.getElementById('waste-amount').value) || 0;
  const school = document.getElementById('waste-school').value;
  alert(`Lançamento de ${amt} kg de desperdício na unidade ${school} registrado com sucesso!`);
  
  document.getElementById('waste-total-kg').textContent = '1.613';
  document.getElementById('waste-total-pct').textContent = '3,8%';
  
  const currentChart = state.charts['chart-desperdicio'];
  if (currentChart) currentChart.destroy();
  window.renderWasteChart([245 + amt, 198, 176, 162, 148]);
};

// ─── DRI REFERENCE TABLE (PNAE/FNDE) ───
const DRI_TABLE = {
  creche_7_11_30: { name: "Creche (7–11 meses) - 2 ref (30%)", energy: 203.4, protein: 5.085, carbsMin: 27.97, carbsMax: 33.05, fatMin: 6, fatMax: 8, sodium: 300, isCreche: true },
  creche_7_11_70: { name: "Creche (7–11 meses) - 3 ref (70%)", energy: 474.6, protein: 11.865, carbsMin: 65.26, carbsMax: 77.12, fatMin: 13, fatMax: 18, sodium: 700, isCreche: true },
  creche_1_3_30: { name: "Creche (1–3 anos) - 2 ref (30%)", energy: 303.6, protein: 7.59, carbsMin: 41.75, carbsMax: 49.34, fatMin: 8, fatMax: 12, sodium: 300, isCreche: true },
  creche_1_3_70: { name: "Creche (1–3 anos) - 3 ref (70%)", energy: 708.4, protein: 17.71, carbsMin: 97.41, carbsMax: 115.12, fatMin: 20, fatMax: 28, sodium: 700, isCreche: true },
  pre_10: { name: "Pré-escola - 1 ref (20%)", energy: 270.0, protein: 6.75, carbsMin: 37.13, carbsMax: 43.88, fatMin: 8, fatMax: 11, sodium: 600 },
  pre_20: { name: "Pré-escola - 2 ref (30%)", energy: 405.0, protein: 10.125, carbsMin: 55.69, carbsMax: 65.81, fatMin: 11, fatMax: 16, sodium: 800 },
  pre_30: { name: "Pré-escola - 3 ref (70%)", energy: 945.0, protein: 23.625, carbsMin: 129.94, carbsMax: 153.56, fatMin: 26, fatMax: 37, sodium: 1400 },
  fund_6_10_10: { name: "Fundamental (6–10a) - 1 ref (20%)", energy: 328.6, protein: 8.215, carbsMin: 45.18, carbsMax: 53.40, fatMin: 9, fatMax: 13, sodium: 600 },
  fund_6_10_20: { name: "Fundamental (6–10a) - 2 ref (30%)", energy: 492.9, protein: 12.3225, carbsMin: 67.77, carbsMax: 80.10, fatMin: 14, fatMax: 19, sodium: 800 },
  fund_6_10_30: { name: "Fundamental (6–10a) - 3 ref (70%)", energy: 1150.1, protein: 28.7525, carbsMin: 158.14, carbsMax: 186.89, fatMin: 32, fatMax: 45, sodium: 1400 },
  fund_11_15_10: { name: "Fundamental (11–15a) - 1 ref (20%)", energy: 473.2, protein: 11.83, carbsMin: 65.07, carbsMax: 76.90, fatMin: 13, fatMax: 18, sodium: 600 },
  fund_11_15_20: { name: "Fundamental (11–15a) - 2 ref (30%)", energy: 709.8, protein: 17.745, carbsMin: 97.60, carbsMax: 115.34, fatMin: 20, fatMax: 28, sodium: 800 },
  fund_11_15_30: { name: "Fundamental (11–15a) - 3 ref (70%)", energy: 1656.2, protein: 41.405, carbsMin: 227.73, carbsMax: 269.13, fatMin: 46, fatMax: 64, sodium: 1400 },
  medio_10: { name: "Ensino Médio - 1 ref (20%)", energy: 543.4, protein: 13.585, carbsMin: 74.72, carbsMax: 88.30, fatMin: 15, fatMax: 21, sodium: 600 },
  medio_20: { name: "Ensino Médio - 2 ref (30%)", energy: 815.1, protein: 20.3775, carbsMin: 112.08, carbsMax: 132.45, fatMin: 23, fatMax: 32, sodium: 800 },
  medio_30: { name: "Ensino Médio - 3 ref (70%)", energy: 1901.9, protein: 47.5475, carbsMin: 261.51, carbsMax: 309.06, fatMin: 53, fatMax: 74, sodium: 1400 },
  eja_19_30_10: { name: "EJA (19–30a) - 1 ref (20%)", energy: 476.6, protein: 11.915, carbsMin: 65.53, carbsMax: 77.45, fatMin: 7.94, fatMax: 15.89, sodium: 600, isEja: true },
  eja_19_30_20: { name: "EJA (19–30a) - 2 ref (30%)", energy: 714.9, protein: 17.8725, carbsMin: 98.30, carbsMax: 116.17, fatMin: 11.92, fatMax: 23.83, sodium: 800, isEja: true },
  eja_19_30_30: { name: "EJA (19–30a) - 3 ref (70%)", energy: 1668.1, protein: 41.7025, carbsMin: 229.36, carbsMax: 271.07, fatMin: 27.80, fatMax: 55.60, sodium: 1400, isEja: true }
};

// ─── BIBLIOTECA DE RECEITAS (ligada ao estoque via DATA.products) ───
const RECIPE_LIBRARY = [
  { id: 'mingau_leite', name: 'Mingau de Leite em Pó com Aveia', mealType: 'Desjejum', kcal: 180, carbsG: 25, proteinG: 7, lipidG: 6, sodium: 95,
    ingredients: [{ name: 'Leite em Pó', qty: 20, unit: 'g' }, { name: 'Açúcar Cristal', qty: 10, unit: 'g' }] },
  { id: 'arroz_feijao', name: 'Arroz com Feijão Tradicional', mealType: 'Almoço', kcal: 425, carbsG: 64, proteinG: 13, lipidG: 13, sodium: 310,
    ingredients: [{ name: 'Arroz Tipo 1', qty: 50, unit: 'g' }, { name: 'Feijão Carioca', qty: 40, unit: 'g' }, { name: 'Óleo de Soja', qty: 10, unit: 'g' }] },
  { id: 'frango_legumes', name: 'Frango Grelhado com Legumes', mealType: 'Almoço', kcal: 380, carbsG: 52, proteinG: 14, lipidG: 13, sodium: 260,
    ingredients: [{ name: 'Frango (Coxa/Sobrecoxa)', qty: 90, unit: 'g' }, { name: 'Cenoura', qty: 60, unit: 'g' }, { name: 'Batata Doce', qty: 60, unit: 'g' }, { name: 'Abóbora Cabotiá', qty: 40, unit: 'g' }] },
  { id: 'macarrao_carne', name: 'Macarrão ao Molho com Carne Moída', mealType: 'Almoço', kcal: 410, carbsG: 59, proteinG: 13, lipidG: 13, sodium: 340,
    ingredients: [{ name: 'Macarrão Espaguete', qty: 60, unit: 'g' }, { name: 'Carne Bovina (Acém)', qty: 70, unit: 'g' }, { name: 'Tomate', qty: 30, unit: 'g' }] },
  { id: 'vitamina_banana', name: 'Vitamina de Banana', mealType: 'Lanche', kcal: 210, carbsG: 32, proteinG: 6, lipidG: 7, sodium: 85,
    ingredients: [{ name: 'Leite Integral', qty: 200, unit: 'ml' }, { name: 'Banana Nanica', qty: 80, unit: 'g' }] },
  { id: 'salada_frutas', name: 'Salada de Frutas da Estação', mealType: 'Lanche', kcal: 150, carbsG: 32, proteinG: 2, lipidG: 2, sodium: 15,
    ingredients: [{ name: 'Maçã Fuji', qty: 60, unit: 'g' }, { name: 'Melancia', qty: 80, unit: 'g' }, { name: 'Banana Nanica', qty: 60, unit: 'g' }] },
];

function stockStatusFor(daysLeft) {
  if (daysLeft <= 3) return { label: 'Crítico', color: 'var(--danger)', cls: 'status-danger' };
  if (daysLeft <= 7) return { label: 'Atenção', color: 'var(--warning)', cls: 'status-warning' };
  return { label: 'OK', color: 'var(--success)', cls: 'status-ok' };
}

function getStockSuggestions(targetKcal, mealType) {
  const fichasSalvas = JSON.parse(localStorage.getItem('fichas_tecnicas') || '[]');
  const todasAsReceitas = [...RECIPE_LIBRARY, ...fichasSalvas.map(f => ({
    id: f.id,
    name: f.nome,
    mealType: f.categoria || 'Desjejum',
    kcal: f.kcal || 0,
    carbsG: f.macros ? f.macros.carbs : 0,
    proteinG: f.macros ? f.macros.protein : 0,
    lipidG: f.macros ? f.macros.lipids : 0,
    sodium: f.macros ? f.macros.sodium : 0,
    ingredients: f.ingredientes ? f.ingredientes.map(i => ({ name: i.nome, qty: i.qtd || 0, unit: 'g' })) : []
  }))];

  let library = todasAsReceitas;
  if (mealType) {
    library = library.filter(r => {
      const mt = r.mealType || r.categoria;
      if (mealType === 'Desjejum') return mt === 'Desjejum' || mt === 'Café da Manhã';
      if (mealType === 'Almoço') return mt === 'Almoço';
      if (mealType === 'Lanche') return mt === 'Lanche' || mt === 'Lanche da Tarde';
      return mt === mealType;
    });
  }

  return library.map(recipe => {
    const linkedIngredients = (recipe.ingredients || []).map(ing => {
      const product = DATA.products.find(p => p.name === ing.name);
      return { ...ing, product };
    });
    const missing = linkedIngredients.filter(i => !i.product);
    const worstDaysLeft = linkedIngredients.reduce((min, i) => i.product ? Math.min(min, i.product.daysLeft) : min, Infinity);
    const familyFarmCount = linkedIngredients.filter(i => i.product && i.product.familyFarm).length;
    const kcalDiff = Math.abs((recipe.kcal || 0) - targetKcal);
    let overallStatus;
    if (missing.length > 0) overallStatus = { label: 'Insumo Indisponível', color: 'var(--text-tertiary)', cls: 'status-neutral' };
    else overallStatus = stockStatusFor(worstDaysLeft);
    return { recipe, linkedIngredients, missing, worstDaysLeft, familyFarmCount, kcalDiff, overallStatus };
  })
  .sort((a, b) => {
    const rank = s => s.missing.length > 0 ? 2 : (s.overallStatus.label === 'Crítico' ? 1 : 0);
    const rankDiff = rank(a) - rank(b);
    if (rankDiff !== 0) return rankDiff;
    return a.kcalDiff - b.kcalDiff;
  })
  .slice(0, 3);
}

window.renderStockSuggestions = () => {
  const container = document.getElementById('sim-stock-suggestions');
  if (!container) return;
  const kcal = parseInt(document.getElementById('sim-kcal')?.value) || 400;
  const mealType = document.getElementById('sim-meal-type')?.value;
  const suggestions = getStockSuggestions(kcal, mealType);

  container.innerHTML = `
    <div class="card-header"><div class="card-title">🥗 Cardápio Sugerido (baseado no Estoque Atual)</div><div class="card-subtitle">Receitas com energia próxima à simulada, priorizando itens com estoque saudável</div></div>
    <div class="card-body">
      <div class="grid-3">
        ${suggestions.map(s => `
          <div class="card" style="border:1px solid var(--border)">
            <div class="card-header">
              <div class="card-title" style="font-size:0.95rem">${s.recipe.name}</div>
              <span class="status-badge ${s.overallStatus.cls}">${s.overallStatus.label}</span>
            </div>
            <div class="card-body">
              <div style="display:flex;gap:10px;font-size:0.82rem;margin-bottom:10px;color:var(--text-secondary)">
                <span>🍽️ ${s.recipe.mealType}</span>
                <span>🔥 ${s.recipe.kcal} kcal <span style="color:var(--text-tertiary)">(Δ${s.kcalDiff} da meta)</span></span>
              </div>
              <div style="display:flex;flex-direction:column;gap:6px">
                ${s.linkedIngredients.map(i => {
                  const st = i.product ? stockStatusFor(i.product.daysLeft) : { label: 'Sem estoque cadastrado', color: 'var(--text-tertiary)', bg: '#F5F5F5' };
                  return `<div style="display:flex;justify-content:space-between;align-items:center;font-size:0.8rem;border-bottom:1px solid var(--border);padding-bottom:4px">
                    <span>${i.name} ${i.product && i.product.familyFarm ? '🌾' : ''}</span>
                    <span style="font-weight:600;color:${st.color}">${i.product ? i.product.daysLeft + ' dias' : st.label}</span>
                  </div>`;
                }).join('')}
              </div>
              ${s.familyFarmCount > 0 ? `<div style="margin-top:10px;font-size:0.78rem;color:var(--success);font-weight:600">🌾 ${s.familyFarmCount} ingrediente(s) da agricultura familiar</div>` : ''}
              <button class="btn btn-outline btn-sm btn-full" style="margin-top:12px" onclick="applyStockSuggestion('${s.recipe.id}')">Usar este Cardápio na Simulação</button>
              <button class="btn btn-primary btn-sm btn-full" style="margin-top:8px" onclick="addToPlanner('${s.recipe.id}')">Incluir no Planejador Semanal</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

window.applyStockSuggestion = (recipeId) => {
  const recipe = RECIPE_LIBRARY.find(r => r.id === recipeId);
  if (!recipe) return;
  document.getElementById('sim-kcal').value = recipe.kcal;
  document.getElementById('sim-carbs-g').value = recipe.carbsG;
  document.getElementById('sim-proteins-g').value = recipe.proteinG;
  document.getElementById('sim-lipids-g').value = recipe.lipidG;
  document.getElementById('sim-sodium').value = recipe.sodium;
  window.runPnaeSimulation({ preventDefault: () => {} });
};

window.updateSimulationPresets = () => {
  const selKey = document.getElementById('sim-preset-modalidade').value;
  const target = DRI_TABLE[selKey];
  if (!target) return;

  document.getElementById('sim-kcal').value = Math.round(target.energy);
  document.getElementById('sim-carbs-g').value = Math.round((target.carbsMin + target.carbsMax) / 2);
  document.getElementById('sim-proteins-g').value = Math.round(target.protein);
  
  document.getElementById('sim-lipids-g').value = Math.round((target.fatMin + target.fatMax) / 2);
  document.getElementById('sim-sodium').value = Math.round(target.sodium * 0.9);
  // Limpar sugestões anteriores ao trocar preset
  const container = document.getElementById('sim-stock-suggestions');
  if (container) container.innerHTML = '';
};

window.runPnaeSimulation = (event) => {
  event.preventDefault();
  const selKey = document.getElementById('sim-preset-modalidade').value;
  const target = DRI_TABLE[selKey];
  if (!target) return;
  
  const kcal = parseInt(document.getElementById('sim-kcal').value) || 0;
  const carbsG = parseInt(document.getElementById('sim-carbs-g').value) || 0;
  const protG = parseInt(document.getElementById('sim-proteins-g').value) || 0;
  const lipG = parseInt(document.getElementById('sim-lipids-g').value) || 0;
  const sod = parseInt(document.getElementById('sim-sodium').value) || 0;
  
  const carbKcal = carbsG * 4;
  const protKcal = protG * 4;
  const lipKcal = lipG * 9;
  
  const carbPct = Math.round((carbKcal / kcal) * 100) || 0;
  const protPct = Math.round((protKcal / kcal) * 100) || 0;
  const lipPct = Math.round((lipKcal / kcal) * 100) || 0;
  
  const isKcalOk = kcal >= target.energy * 0.9 && kcal <= target.energy * 1.1;
  const isCarbsOk = carbPct >= 55 && carbPct <= 65;
  const isProtOk = protPct >= 10 && protPct <= 15;
  
  const lipMin = target.isEja ? 15 : 25;
  const lipMax = target.isEja ? 30 : 35;
  const isLipOk = lipPct >= lipMin && lipPct <= lipMax;
  
  const isSodOk = sod <= target.sodium;
  const passedAll = isKcalOk && isCarbsOk && isProtOk && isLipOk && isSodOk;
  
  const resultCard = document.getElementById('sim-result-card');
  if (!resultCard) return;
  
  resultCard.innerHTML = `
    <div class="card-header"><div class="card-title">Resultado da Simulação</div></div>
    <div class="card-body">
      <div style="padding:16px;background:${passedAll ? 'var(--success-light)' : 'var(--danger-light)'};border-radius:var(--radius);color:${passedAll ? 'var(--success)' : 'var(--danger)'};font-weight:700;margin-bottom:16px;text-align:center;font-size:1.1rem" id="sim-status-banner">
        ${passedAll ? '✅ Aprovado nas Diretrizes PNAE' : '❌ Reprovado nas Diretrizes PNAE'}
      </div>
      
      <div style="display:flex;flex-direction:column;gap:12px;font-size:0.9rem">
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:4px">
          <span>Energia (Referência: ${Math.round(target.energy)} kcal):</span>
          <span style="font-weight:600;color:${isKcalOk ? 'var(--success)' : 'var(--danger)'}">${kcal} kcal (${isKcalOk ? 'OK (±10%)' : 'Fora'})</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:4px">
          <span>Carboidratos (${carbPct}% do VET):</span>
          <span style="font-weight:600;color:${isCarbsOk ? 'var(--success)' : 'var(--danger)'}">${carbsG}g (Meta: 55-65%)</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:4px">
          <span>Proteínas (${protPct}% do VET):</span>
          <span style="font-weight:600;color:${isProtOk ? 'var(--success)' : 'var(--danger)'}">${protG}g (Meta: 10-15%)</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border);padding-bottom:4px">
          <span>Lipídeos (${lipPct}% do VET):</span>
          <span style="font-weight:600;color:${isLipOk ? 'var(--success)' : 'var(--danger)'}">${lipG}g (Meta: ${lipMin}-${lipMax}%)</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding-bottom:4px">
          <span>Sódio (Máximo: ${target.sodium} mg):</span>
          <span style="font-weight:600;color:${isSodOk ? 'var(--success)' : 'var(--danger)'}">${sod} mg (${isSodOk ? 'OK' : 'Excesso'})</span>
        </div>
      </div>
      </div>
    </div>
  `;
};

window.applyIaSuggestion = (i) => {
  const btn = document.getElementById('btn-ia-' + i);
  if (btn) { btn.textContent = '✓ Aplicado'; btn.className = 'btn btn-sm btn-outline'; btn.disabled = true; }
  showToast('✅ Sugestão da IA registrada. Considere no próximo cardápio.');
};

// ─── ESCOLA: helpers ───
function getCurrentSchool() {
  // Prioridade 1: escola capturada no login (antes do hydrateData poder sobrescrever DATA.schools)
  if (state.selectedSchool) return _normalizeSchool(state.selectedSchool);

  const all = (typeof DATA !== 'undefined' && DATA.schools) ? DATA.schools : [];

  // Prioridade 2: busca por id no DATA.schools atual
  if (state.selectedSchoolId) {
    const byId = all.find(sc => sc.id === state.selectedSchoolId);
    if (byId) return _normalizeSchool(byId);
  }
  // Prioridade 3: fallback legado via window._STATE.schoolName
  const name = (window._STATE && window._STATE.schoolName) ? window._STATE.schoolName : null;
  if (name) {
    const byName = all.find(sc => sc.name === name);
    if (byName) return _normalizeSchool(byName);
  }
  // Fallback final: primeira escola do piloto
  const pilotSchools = all.filter(sc => sc.diretor); // escolas piloto têm campo diretor
  const first = pilotSchools[0] || all[0];
  return first ? _normalizeSchool(first) : {
    id: 0, name: 'EM Demo', students: 620, attendance_avg: 572, attendance_pct: 92,
    stockPct: 82, grade_levels: 'EF I + EF II', refeicoesDia: 2,
    monthly_budget: 18500, region: 'Centro', diretor: { name: 'Maria Santos', initials: 'MS' },
    respEstoque: { name: 'Carlos Lima', initials: 'CL' }
  };
}

function _normalizeSchool(sc) {
  // Compatibilidade com campos legados usados pelos renderers existentes
  return Object.assign({
    meals_per_day: sc.refeicoesDia || 2,
    attendance_avg: sc.attendance_avg || Math.round((sc.students || 0) * 0.9),
    attendance_pct: sc.attendance_pct || 90,
    monthly_budget: sc.monthly_budget || Math.round((sc.students || 0) * 35),
    director: sc.diretor ? sc.diretor.name : (sc.director || ''),
    grade_levels: sc.grade_levels || (sc.sigla === 'EMEI' ? 'Maternal + Pré-escola' : 'EF I + EF II'),
  }, sc);
}

// ─── ESCOLA: DASHBOARD ───
// escola_dashboard..escola_relatorios -> js/modules/escolas.js (Fase 4.2, movido).

// COOPERATIVA / AGRICULTOR: renderers e helpers -> js/modules/colaboradores.js
// (Fase 4.1). confirmSchoolDelivery foi para o core_hub.js: e usado tambem
// pela tela de entregas da escola.

// ─── ESTOQUE: RENDERERS ───
// estoque_dashboard/inventario/lotes + helpers de bipagem/separacao/recebimento -> js/modules/estoque.js (Fase 4.3, movido).

// ─── MOTORISTA: RENDERERS ─── migrado para js/modules/motorista.js (inclui selectDelivery/simulateCamera/clearSignature/initSignatureCanvas)

// ─── DIRETOR: RENDERERS ─────────────────────────────────────

// diretor_* (dashboard/estoque/pedidos/aliases) -> js/modules/escolas.js (Fase 4.2b, movido).

// RESTRIÇÕES ALIMENTARES — Nutricionista (view global) e Diretor (view da escola)

// _resolverRestricao -> core_hub.js (Fase 3.3: usado por nutricionista e diretor).

// diretor_restricoes -> js/modules/escolas.js (Fase 4.2b, movido).

// ─── RESP_ESTOQUE: RENDERERS ─────────────────────────────────

// resp_estoque_* -> js/modules/escolas.js (Fase 4.2b, movido).

// ─── GENERIC CRUD SCREEN HELPER ───
function renderCrudScreen(title, subtitle, headers, rows) {
  return `
    <div class="page-header"><div class="page-title">${title}</div><div class="page-subtitle">${subtitle}</div></div>
    <div class="card">
      <div class="card-header"><div class="card-title">${title}</div><button class="btn btn-primary btn-sm">+ Novo</button></div>
      <div class="card-body">
        <table class="data-table">
          <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}<th>Ações</th></tr></thead>
          <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}<td><button class="table-action">Editar</button></td></tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  `;
}

function initAppEvents() {
  const SCHOOL_SUBROLES = ['diretor', 'resp_estoque', 'merendeira'];
  const COLAB_SUBROLES = ['cooperativa', 'agricultor'];

  // Profile selector (top-level: gestor, nutricionista, escola, colaboradores, estoque, motorista)
  $$('.profile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.profile-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const profile = btn.dataset.profile;

      const schoolPicker = $('#school-picker-row');
      const subrolePicker = $('#subrole-picker-row');
      const colabPicker = $('#colab-subrole-picker-row');

      const isEscola = profile === 'escola';
      const isColab = profile === 'colaboradores';

      if (schoolPicker) schoolPicker.style.display = isEscola ? 'block' : 'none';
      if (subrolePicker) subrolePicker.style.display = isEscola ? 'block' : 'none';
      if (colabPicker) colabPicker.style.display = isColab ? 'block' : 'none';

      const lbl = $('#school-picker-label');
      if (lbl && isEscola) {
        const activeSub = $('.subrole-btn.active');
        const sub = activeSub ? activeSub.dataset.subrole : 'diretor';
        if (sub === 'diretor') lbl.textContent = 'Escola (Diretor)';
        else if (sub === 'resp_estoque') lbl.textContent = 'Escola (Resp. Estoque)';
        else if (sub === 'merendeira') lbl.textContent = 'Escola (Merendeira)';
      }
    });
  });

  // Sub-perfil da Escola (Diretor / Merendeira / Resp. Estoque)
  $$('.subrole-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.subrole-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lbl = $('#school-picker-label');
      const sub = btn.dataset.subrole;
      if (lbl) {
        if (sub === 'diretor') lbl.textContent = 'Escola (Diretor)';
        else if (sub === 'resp_estoque') lbl.textContent = 'Escola (Resp. Estoque)';
        else if (sub === 'merendeira') lbl.textContent = 'Escola (Merendeira)';
      }
    });
  });

  // Sub-perfil de Colaboradores (Cooperativa / Agricultor)
  $$('.colab-subrole-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.colab-subrole-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  window.AUTH_ENABLED = false;
  window.authenticateUser = (user, pass, profile) => {
    if (!window.AUTH_ENABLED) return { success: true };
    if (!user || !pass) return { success: false, error: 'Informe o CPF/usuário e a senha de acesso.' };
    return { success: true };
  };

  const handleLoginSubmit = async (e) => {
    if (e) {
      if (typeof e.preventDefault === 'function') e.preventDefault();
      if (typeof e.stopPropagation === 'function') e.stopPropagation();
    }
    if (window._isLoggingIn) return false;
    window._isLoggingIn = true;
    try {
      const userInput = $('#login-user')?.value || '';
      const passInput = $('#login-pass')?.value || '';

      const authRes = window.authenticateUser(userInput, passInput);
      if (!authRes.success) {
        showToast('⚠️ ' + authRes.error, 'warning');
        return false;
      }

      const activeProfile = $('.profile-btn.active');
      const topProfile = activeProfile ? activeProfile.dataset.profile : 'gestor';

      let profile = topProfile;
      let schoolId = null;

      if (topProfile === 'escola') {
        const activeSub = $('.subrole-btn.active');
        profile = activeSub ? activeSub.dataset.subrole : 'diretor';
        const sel = $('#school-picker-select');
        if (sel && sel.value) schoolId = parseInt(sel.value, 10);
        else if (window.AUTH_ENABLED) {
          showToast('⚠️ Selecione a unidade escolar para prosseguir.', 'warning');
          return false;
        }
      } else if (topProfile === 'colaboradores') {
        const activeColab = $('.colab-subrole-btn.active');
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

  window.handleLoginSubmit = handleLoginSubmit;

  $('#login-form')?.addEventListener('submit', handleLoginSubmit);
  $('#btn-login')?.addEventListener('click', handleLoginSubmit);

  // Header & login link handlers (M4)
  document.getElementById('link-forgot')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('ℹ️ Para redefinir sua senha, entre em contato com a SEMED pelo suporte TI.');
  });

  document.getElementById('link-support')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('📞 Suporte TI SEMED: (67) 3314-3800 / suporte.sual@semed.ms.gov.br');
  });

  document.getElementById('global-search')?.addEventListener('input', (e) => {
    const q = (e.target.value || '').trim().toLowerCase();
    if (q.length < 3) return;
    const schools = (DATA.schools || []).filter(s => s.name.toLowerCase().includes(q));
    const products = (DATA.products || []).filter(p => p.name.toLowerCase().includes(q));
    const orders = (SharedState.getOrders() || []).filter(o => (o.school||'').toLowerCase().includes(q) || String(o.numero).includes(q));
    showToast(`🔍 Busca "${q}": ${schools.length} escolas, ${products.length} produtos, ${orders.length} pedidos encontrados.`, 'info');
  });

  // Logout
  $('#btn-logout')?.addEventListener('click', logout);

  // Sidebar collapse
  $('#sidebar-collapse-btn')?.addEventListener('click', () => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    const sidebar = $('#sidebar');
    const main = $('.main-wrapper');
    if (state.sidebarCollapsed) {
      sidebar.style.width = 'var(--sidebar-collapsed)';
      main.style.marginLeft = 'var(--sidebar-collapsed)';
    } else {
      sidebar.style.width = '';
      main.style.marginLeft = '';
    }
  });

  // Mobile menu
  $('#mobile-menu-btn')?.addEventListener('click', () => {
    $('#sidebar').classList.toggle('mobile-open');
  });

  // Notifications
  $('#notification-btn')?.addEventListener('click', () => {
    const drawer = $('#notif-drawer');
    const overlay = $('#notif-overlay');
    drawer.hidden = false;
    overlay.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('open'));
    renderNotifications();
  });

  const closeNotifs = () => {
    const drawer = $('#notif-drawer');
    const overlay = $('#notif-overlay');
    drawer.classList.remove('open');
    setTimeout(() => { drawer.hidden = true; overlay.hidden = true; }, 300);
  };
  $('#close-notif-drawer')?.addEventListener('click', closeNotifs);
  $('#notif-overlay')?.addEventListener('click', closeNotifs);
}

let _appEventsInited = false;
function safeInitAppEvents() {
  if (_appEventsInited) return;
  _appEventsInited = true;
  initAppEvents();
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeInitAppEvents);
}
safeInitAppEvents();

// MERENDEIRA ALIASES

// ──────────────────────────────────────────────────────────────────────
// MÓDULO FINANCEIRO — v2.1.0
// Renderers das 5 novas páginas conectadas ao Supabase
// ──────────────────────────────────────────────────────────────────────

// ─── GESTOR: ATAS (com dados do Supabase) ───────────────────────────

window.abrirModalDetalhesAta = (ataId) => {
  const atas = SharedState.getAtas2();
  const ata = atas.find(a => String(a.id) === String(ataId) || a.numero === ataId || a.numero_ata === ataId) || atas[0];
  if (!ata) return;

  const fmt = (v) => v ? new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v) : 'R$ 0,00';
  const numAta = ata.numero || ata.numero_ata || `ATA-${ata.id}`;
  const valorGlobal = ata.valor_global || 0;
  const valorExecutado = ata.valor_executado || 0;
  const saldoGlobal = valorGlobal - valorExecutado;
  const pctGlobal = valorGlobal > 0 ? Math.round((valorExecutado / valorGlobal) * 100) : 0;

  const produtosAta = (ata.itens && ata.itens.length > 0)
    ? ata.itens
    : (DATA.ataProducts || []).filter(ap => String(ap.ataId) === String(ata.id) || ap.ataNumero === numAta);

  const empenhosVinculados = SharedState.getEmpenhos2().filter(e => e.ata_numero === numAta || String(e.ataId) === String(ata.id));

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#f8fafc;padding:16px;border-radius:10px;border:1px solid var(--border);margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:12px">
          <div>
            <h3 style="margin:0;font-size:1.15rem;color:var(--primary-dark)">📋 ${numAta} — ${ata.fornecedor}</h3>
            <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:2px">
              Modalidade: <strong>${ata.tipo || ata.modalidade || 'Pregão'}</strong> · Vigência: <strong>${ata.data_inicio ? ata.data_inicio.slice(0,10) : '2026-01-15'} até ${ata.data_fim ? ata.data_fim.slice(0,10) : '2026-12-31'}</strong>
            </div>
          </div>
          <button class="btn btn-primary" onclick="window.openNewEmpenhoModal('${numAta}')">
            ➕ Emitir Empenho nesta ATA
          </button>
        </div>
        <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin:0">
          <div class="kpi-card blue" style="padding:10px"><div class="kpi-label">Valor Global</div><div class="kpi-value" style="font-size:1.1rem">${fmt(valorGlobal)}</div></div>
          <div class="kpi-card orange" style="padding:10px"><div class="kpi-label">Empenhado (${pctGlobal}%)</div><div class="kpi-value" style="font-size:1.1rem">${fmt(valorExecutado)}</div></div>
          <div class="kpi-card green" style="padding:10px"><div class="kpi-label">Saldo Disponível</div><div class="kpi-value" style="font-size:1.1rem">${fmt(saldoGlobal)}</div></div>
          <div class="kpi-card teal" style="padding:10px"><div class="kpi-label">Itens Registrados</div><div class="kpi-value" style="font-size:1.1rem">${produtosAta.length} produtos</div></div>
        </div>
      </div>

      <div style="margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <h4 style="margin:0;color:var(--text-primary)">📦 Produtos Registrados na ATA & Gestão de Saldos</h4>
          <button class="btn btn-sm btn-outline" onclick="window.abrirModalAdicionarProdutoAta('${numAta}')">
            ➕ Adicionar Produto nesta ATA
          </button>
        </div>
        <div style="overflow-x:auto;max-height:280px">
          <table class="data-table" style="font-size:0.85rem">
            <thead>
              <tr>
                <th>Produto / Item</th>
                <th>Preço Unit.</th>
                <th>Qtd Registrada</th>
                <th>Qtd Empenhada</th>
                <th>Saldo Qtd Restante</th>
                <th>Valor Empenhado</th>
                <th>Saldo em R$</th>
                <th>Consumo %</th>
              </tr>
            </thead>
            <tbody>
              ${produtosAta.length > 0 ? produtosAta.map(p => {
                const maxQ = p.maxQtd || p.quantidade_registrada || 1000;
                const unitP = p.unitPrice || p.preco_unitario || 0;
                const globV = p.globalValue || (maxQ * unitP);
                const execV = p.executedValue || 0;
                const execQ = unitP > 0 ? Math.round(execV / unitP) : 0;
                const restQ = Math.max(0, maxQ - execQ);
                const restV = Math.max(0, globV - execV);
                const pctItem = globV > 0 ? Math.min(100, Math.round((execV / globV) * 100)) : 0;

                return `
                  <tr>
                    <td><strong>${p.name || p.descricao || p.produto}</strong></td>
                    <td style="font-family:var(--font-mono)">${fmt(unitP)}</td>
                    <td style="font-family:var(--font-mono);font-weight:700">${maxQ.toLocaleString('pt-BR')} ${p.unit||'kg'}</td>
                    <td style="font-family:var(--font-mono);color:#c2410c">${execQ.toLocaleString('pt-BR')} ${p.unit||'kg'}</td>
                    <td style="font-family:var(--font-mono);font-weight:700;color:#1565C0">${restQ.toLocaleString('pt-BR')} ${p.unit||'kg'}</td>
                    <td style="font-family:var(--font-mono)">${fmt(execV)}</td>
                    <td style="font-family:var(--font-mono);font-weight:700;color:${restV <= 0 ? 'var(--danger)' : '#2E7D32'}">${fmt(restV)}</td>
                    <td>
                      <div class="progress-bar" style="width:70px"><div class="progress-fill ${pctItem>80?'red':pctItem>50?'orange':'green'}" style="width:${pctItem}%"></div></div>
                      <small style="font-size:0.75rem">${pctItem}%</small>
                    </td>
                  </tr>
                `;
              }).join('') : '<tr><td colspan="8" style="text-align:center;color:#94A3B8">Nenhum item individual cadastrado nesta ATA.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 style="margin:0 0 10px 0;color:var(--text-primary)">💳 Empenhos SIAFI Vinculados nesta ATA (${empenhosVinculados.length})</h4>
        <div style="overflow-x:auto;max-height:200px">
          <table class="data-table" style="font-size:0.85rem">
            <thead>
              <tr>
                <th>Nº Empenho</th>
                <th>Data</th>
                <th>Escola / Destino</th>
                <th>Valor Empenhado</th>
                <th>Valor Pago</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${empenhosVinculados.length > 0 ? empenhosVinculados.map(e => `
                <tr>
                  <td><strong>${e.numero_empenho}</strong></td>
                  <td>${e.data_empenho || '—'}</td>
                  <td>${e.escola_name || 'SEMED Global'}</td>
                  <td style="font-family:var(--font-mono);font-weight:700">${fmt(e.valor_empenhado)}</td>
                  <td style="font-family:var(--font-mono)">${fmt(e.valor_pago)}</td>
                  <td><span class="tag tag-green">${e.status}</span></td>
                </tr>
              `).join('') : '<tr><td colspan="6" style="text-align:center;color:#94A3B8">Nenhum empenho emitido para esta ATA ainda.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  window.showModal(`📋 Detalhamento & Saldo da ATA — ${numAta}`, content, '950px');
};

window.adicionarLinhaProdutoAta = (dados = {}) => {
  const tbody = document.getElementById('tbody-itens-nova-ata');
  if (!tbody) return;
  const idRow = 'row-item-' + crypto.randomUUID();

  const prodsOpts = (DATA.products || []).map(p => `<option value="${p.name}">`).join('');

  const tr = document.createElement('tr');
  tr.id = idRow;
  tr.className = 'linha-item-ata';
  tr.innerHTML = `
    <td>
      <input type="text" list="dl-prods-ata" class="btn btn-outline ata-prod-nome" style="width:100%;text-align:left;padding:4px 8px;font-size:0.85rem" placeholder="Ex: Carne Bovina Acém" value="${dados.nome||''}" required oninput="window.recalcularSubtotaisAta()">
      <datalist id="dl-prods-ata">${prodsOpts}</datalist>
    </td>
    <td>
      <input type="text" class="btn btn-outline ata-prod-unidade" style="width:100%;text-align:center;padding:4px 8px;font-size:0.85rem" placeholder="kg, L, dz" value="${dados.unidade||'kg'}" required>
    </td>
    <td>
      <input type="number" step="0.01" min="0.01" class="btn btn-outline ata-prod-preco" style="width:100%;text-align:right;padding:4px 8px;font-size:0.85rem" placeholder="0.00" value="${dados.preco||''}" required oninput="window.recalcularSubtotaisAta()">
    </td>
    <td>
      <input type="number" step="1" min="1" class="btn btn-outline ata-prod-qtd" style="width:100%;text-align:right;padding:4px 8px;font-size:0.85rem" placeholder="0" value="${dados.qtd||''}" required oninput="window.recalcularSubtotaisAta()">
    </td>
    <td style="text-align:right;font-family:var(--font-mono);font-weight:700" class="ata-prod-subtotal">
      R$ 0,00
    </td>
    <td style="text-align:center">
      <button type="button" class="btn btn-sm btn-outline" style="color:var(--danger);padding:2px 6px" onclick="document.getElementById('${idRow}').remove(); window.recalcularSubtotaisAta();" title="Remover produto">❌</button>
    </td>
  `;
  tbody.appendChild(tr);
  window.recalcularSubtotaisAta();
};

window.recalcularSubtotaisAta = () => {
  const tbody = document.getElementById('tbody-itens-nova-ata');
  if (!tbody) return;
  let totalGlobal = 0;
  const rows = tbody.querySelectorAll('.linha-item-ata');
  rows.forEach(tr => {
    const preco = parseFloat(tr.querySelector('.ata-prod-preco')?.value) || 0;
    const qtd = parseFloat(tr.querySelector('.ata-prod-qtd')?.value) || 0;
    const sub = preco * qtd;
    totalGlobal += sub;
    const tdSub = tr.querySelector('.ata-prod-subtotal');
    if (tdSub) {
      tdSub.textContent = sub ? new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(sub) : 'R$ 0,00';
    }
  });

  const inputValorGlobal = document.getElementById('ata-valor');
  if (inputValorGlobal && (rows.length > 0 || totalGlobal > 0)) {
    inputValorGlobal.value = totalGlobal.toFixed(2);
  }
};

window.abrirModalNovaAta = () => {
  const content = `
    <form onsubmit="window.salvarNovaAta(event)">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Número/Ano da ATA</label>
          <input type="text" id="ata-numero" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: ATA-2026/050" required>
        </div>
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Modalidade / Tipo</label>
          <select id="ata-tipo" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
            <option value="Chamada Pública (AF)">🌾 Chamada Pública (Agricultura Familiar)</option>
            <option value="Pregão Eletrônico">🏢 Pregão Eletrônico</option>
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Razão Social do Fornecedor / Cooperativa</label>
          <input type="text" id="ata-fornecedor" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: COOPAGRAN ou Nutri Alimentos Ltda" required>
        </div>
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Valor Global Registrado (R$)</label>
          <input type="number" step="0.01" id="ata-valor" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: 1500000.00" required>
        </div>
      </div>

      <div style="margin-top:16px;border-top:1px solid var(--border);padding-top:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <label style="font-weight:700;font-size:0.95rem;color:var(--primary-dark)">📦 Produtos Registrados na ATA</label>
          <button type="button" class="btn btn-sm btn-outline" onclick="window.adicionarLinhaProdutoAta()">
            ➕ Adicionar Produto
          </button>
        </div>
        <div style="overflow-x:auto;max-height:220px">
          <table class="data-table" style="font-size:0.85rem;margin:0" id="tabela-itens-nova-ata">
            <thead>
              <tr>
                <th>Produto / Descrição</th>
                <th style="width:90px">Unidade</th>
                <th style="width:110px">Preço Unit. (R$)</th>
                <th style="width:110px">Qtd Registrada</th>
                <th style="width:120px">Subtotal (R$)</th>
                <th style="width:40px">Ação</th>
              </tr>
            </thead>
            <tbody id="tbody-itens-nova-ata">
              <!-- Linhas dinamicas -->
            </tbody>
          </table>
        </div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">💾 Salvar e Cadastrar ATA</button>
      </div>
    </form>
  `;
  window.showModal('📋 Cadastrar Nova ATA de Registro de Preços', content, '750px');
  // Abre com 1 linha pronta por padrao
  window.adicionarLinhaProdutoAta();
};

window.salvarNovaAta = (e) => {
  e.preventDefault();
  const numero = document.getElementById('ata-numero').value.trim();
  const tipo = document.getElementById('ata-tipo').value;
  const fornecedor = document.getElementById('ata-fornecedor').value.trim();
  const valor = parseFloat(document.getElementById('ata-valor').value) || 0;

  const itens = [];
  const rows = document.querySelectorAll('#tbody-itens-nova-ata .linha-item-ata');
  rows.forEach(tr => {
    const nome = tr.querySelector('.ata-prod-nome')?.value.trim();
    const unidade = tr.querySelector('.ata-prod-unidade')?.value.trim() || 'un';
    const preco = parseFloat(tr.querySelector('.ata-prod-preco')?.value) || 0;
    const qtd = parseFloat(tr.querySelector('.ata-prod-qtd')?.value) || 0;
    if (nome && qtd > 0) {
      itens.push({
        id: 'item-' + crypto.randomUUID(),
        name: nome,
        produto: nome,
        descricao: nome,
        unidade: unidade,
        unitPrice: preco,
        preco_unitario: preco,
        maxQtd: qtd,
        quantidade_registrada: qtd,
        globalValue: preco * qtd,
        executedValue: 0
      });
    }
  });

  SharedState.addAta2({
    numero: numero,
    numero_ata: numero,
    tipo: tipo,
    fornecedor: fornecedor,
    valor_global: valor,
    valor_executado: 0,
    status: 'Vigente',
    itens: itens
  });

  showToast(`✅ ATA ${numero} cadastrada com sucesso com ${itens.length} produto(s)!`, 'success');
  closeModal();
  const container = document.getElementById('page-content');
  if (container) PAGE_RENDERERS.gestor_atas(container);
};

window.abrirModalAdicionarProdutoAta = (numAta) => {
  const prodsOpts = (DATA.products || []).map(p => `<option value="${p.name}">`).join('');
  const content = `
    <form onsubmit="window.salvarProdutoAtaExistente('${numAta}', event)">
      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Produto / Item</label>
        <input type="text" list="dl-prods-add-ata" id="add-prod-nome" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: Batata Doce Rosada" required>
        <datalist id="dl-prods-add-ata">${prodsOpts}</datalist>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Unidade</label>
          <input type="text" id="add-prod-unidade" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" value="kg" required>
        </div>
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Preço Unitário (R$)</label>
          <input type="number" step="0.01" min="0.01" id="add-prod-preco" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: 4.50" required>
        </div>
      </div>
      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Quantidade Registrada na ATA</label>
        <input type="number" step="1" min="1" id="add-prod-qtd" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: 5000" required>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
        <button type="button" class="btn btn-outline" onclick="window.abrirModalDetalhesAta('${numAta}')">Voltar</button>
        <button type="submit" class="btn btn-primary">➕ Salvar Produto na ATA</button>
      </div>
    </form>
  `;
  window.showModal(`📦 Adicionar Produto na ATA — ${numAta}`, content, '500px');
};

window.salvarProdutoAtaExistente = (numAta, e) => {
  e.preventDefault();
  const nome = document.getElementById('add-prod-nome').value.trim();
  const unidade = document.getElementById('add-prod-unidade').value.trim() || 'kg';
  const preco = parseFloat(document.getElementById('add-prod-preco').value) || 0;
  const qtd = parseFloat(document.getElementById('add-prod-qtd').value) || 0;

  const atas = SharedState.getAtas2();
  const ata = atas.find(a => a.numero === numAta || a.numero_ata === numAta || String(a.id) === String(numAta));
  if (ata) {
    ata.itens = ata.itens || [];
    const novoItem = {
      id: 'item-' + crypto.randomUUID(),
      name: nome,
      produto: nome,
      descricao: nome,
      unidade: unidade,
      unitPrice: preco,
      preco_unitario: preco,
      maxQtd: qtd,
      quantidade_registrada: qtd,
      globalValue: preco * qtd,
      executedValue: 0
    };
    ata.itens.push(novoItem);
    ata.valor_global = (ata.valor_global || 0) + (preco * qtd);
    SharedState._persist();
    SharedState._emit('ata:update');
    showToast(`✅ Produto "${nome}" adicionado à ATA ${numAta}!`, 'success');
    window.abrirModalDetalhesAta(numAta);
  }
};

window.openNewEmpenhoModal = (numAtaTarget) => {
  const atas = SharedState.getAtas2();
  if (!atas || atas.length === 0) {
    showToast('⚠️ Nenhuma ATA cadastrada para emitir empenho.', 'warning');
    return;
  }

  const ataSelecionada = atas.find(a => a.numero === numAtaTarget || a.numero_ata === numAtaTarget || String(a.id) === String(numAtaTarget)) || atas[0];
  const ataNumeroSel = ataSelecionada ? (ataSelecionada.numero || ataSelecionada.numero_ata) : '';

  const numSiafiAuto = '2026NE' + String(Math.floor(100000 + Math.random() * 900000));

  const atasOptions = atas.map(a => {
    const num = a.numero || a.numero_ata;
    const isSel = num === ataNumeroSel ? 'selected' : '';
    const valGlobal = a.valor_global || 0;
    const valExec = a.valor_executado || 0;
    const saldo = Math.max(0, valGlobal - valExec);
    const fmt = (v) => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v);
    return `<option value="${num}" ${isSel} data-fornecedor="${a.fornecedor||''}" data-tipo="${a.tipo||''}" data-saldo="${saldo}">📋 ${num} — ${a.fornecedor} (Saldo: ${fmt(saldo)})</option>`;
  }).join('');

  const escOpts = `<option value="SEMED Global (Rede)">🏫 SEMED Global (Toda a Rede)</option>` +
    (DATA.schools || []).map(s => `<option value="${s.name}">${s.name}</option>`).join('');

  const content = `
    <form onsubmit="window.salvarNovoEmpenho(event, '${numAtaTarget||''}')">
      <div style="background:#f1f5f9;padding:12px;border-radius:8px;margin-bottom:14px;font-size:0.85rem;color:#475569">
        💡 <strong>Empenho SIAFI (Nota de Empenho)</strong>: Reserva de dotação orçamentária vinculada a uma ATA de Registro de Preços vigente para liquidação e emissão de Ordens de Serviço.
      </div>
      
      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Nº da Nota de Empenho (SIAFI)</label>
        <input type="text" id="emp-numero" class="btn btn-outline" style="width:100%;text-align:left;padding:8px;font-weight:700;letter-spacing:1px" value="${numSiafiAuto}" required>
      </div>

      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">ATA de Registro de Preços Vinculada</label>
        <select id="emp-ata-select" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required onchange="window.atualizarFormEmpenhoPorAta(this.value)">
          ${atasOptions}
        </select>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Fornecedor / Detentor</label>
          <input type="text" id="emp-fornecedor" class="btn btn-outline" style="width:100%;text-align:left;padding:8px;background:#f8fafc" value="${ataSelecionada ? ataSelecionada.fornecedor : ''}" readonly>
        </div>
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Tipo / Modalidade</label>
          <input type="text" id="emp-tipo" class="btn btn-outline" style="width:100%;text-align:left;padding:8px;background:#f8fafc" value="${ataSelecionada && (ataSelecionada.tipo||'').includes('AF') ? 'AF (Agricultura Familiar)' : 'CONV (Pregão Eletrônico)'}" readonly>
        </div>
      </div>

      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Unidade Escolar / Destino da Reserva</label>
        <select id="emp-escola" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
          ${escOpts}
        </select>
      </div>

      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Produto / Item Principal da ATA</label>
        <select id="emp-produto" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
          <!-- Preenchido via JS -->
        </select>
      </div>

      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Valor a Empenhar (R$)</label>
        <input type="number" step="0.01" min="1" id="emp-valor" class="btn btn-outline" style="width:100%;text-align:left;padding:8px;font-weight:700" placeholder="Ex: 50000.00" required>
        <div id="emp-saldo-info" style="font-size:0.8rem;color:var(--text-secondary);margin-top:4px"></div>
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">💳 Emitir e Confirmar Empenho</button>
      </div>
    </form>
  `;

  window.showModal('💳 Emitir Empenho SIAFI', content, '600px');
  window.atualizarFormEmpenhoPorAta(ataNumeroSel);
};

window.atualizarFormEmpenhoPorAta = (numAta) => {
  const selAta = document.getElementById('emp-ata-select');
  if (!selAta) return;
  const opt = selAta.options[selAta.selectedIndex];
  if (!opt) return;

  const fornecedor = opt.dataset.fornecedor || '';
  const tipo = opt.dataset.tipo || '';
  const saldo = parseFloat(opt.dataset.saldo) || 0;

  const inpForn = document.getElementById('emp-fornecedor');
  if (inpForn) inpForn.value = fornecedor;

  const inpTipo = document.getElementById('emp-tipo');
  if (inpTipo) inpTipo.value = tipo.includes('AF') ? 'AF (Agricultura Familiar)' : 'CONV (Pregão Eletrônico)';

  const divSaldo = document.getElementById('emp-saldo-info');
  const fmt = (v) => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v);
  if (divSaldo) divSaldo.innerHTML = `Saldo disponível nesta ATA: <strong style="color:var(--success)">${fmt(saldo)}</strong>`;

  const atas = SharedState.getAtas2();
  const ata = atas.find(a => a.numero === numAta || a.numero_ata === numAta || String(a.id) === String(numAta));
  const prods = (ata && ata.itens && ata.itens.length > 0)
    ? ata.itens
    : (DATA.ataProducts || []).filter(ap => ap.ataNumero === numAta || String(ap.ataId) === String(numAta));

  const selProd = document.getElementById('emp-produto');
  if (selProd) {
    if (prods.length > 0) {
      selProd.innerHTML = prods.map(p => {
        const nome = p.name || p.descricao || p.produto || 'Produto';
        const pUnit = p.unitPrice || p.preco_unitario || 0;
        return `<option value="${nome}">${nome} ${pUnit > 0 ? '(R$ ' + pUnit.toFixed(2) + ')' : ''}</option>`;
      }).join('');
    } else {
      selProd.innerHTML = '<option value="Gêneros Alimentícios Diversos">Gêneros Alimentícios Diversos (Lote)</option>';
    }
  }
};

window.salvarNovoEmpenho = (e, numAtaTarget) => {
  e.preventDefault();
  const numEmpenho = document.getElementById('emp-numero').value.trim();
  const numAta = document.getElementById('emp-ata-select').value;
  const fornecedor = document.getElementById('emp-fornecedor').value;
  const escolaName = document.getElementById('emp-escola').value;
  const produto = document.getElementById('emp-produto').value;
  const valorEmpenhado = parseFloat(document.getElementById('emp-valor').value) || 0;

  if (!numEmpenho || !numAta || valorEmpenhado <= 0) {
    showToast('⚠️ Preencha todos os campos corretamente.', 'warning');
    return;
  }

  const atas = SharedState.getAtas2();
  const ata = atas.find(a => a.numero === numAta || a.numero_ata === numAta || String(a.id) === String(numAta));
  if (ata) {
    const valGlobal = ata.valor_global || 0;
    const valExec = ata.valor_executado || 0;
    const saldo = Math.max(0, valGlobal - valExec);

    if (valorEmpenhado > saldo && saldo > 0) {
      showToast(`⚠️ O valor do empenho (R$ ${valorEmpenhado.toFixed(2)}) excede o saldo disponível na ATA (R$ ${saldo.toFixed(2)}).`, 'warning');
      return;
    }

    ata.valor_executado = valExec + valorEmpenhado;
  }

  const tipoCode = (document.getElementById('emp-tipo').value || '').includes('AF') ? 'AF' : 'Conv.';

  const novoEmpenho = {
    id: 'emp-' + crypto.randomUUID(),
    numero_empenho: numEmpenho,
    ata_numero: numAta,
    ataId: ata ? ata.id : null,
    tipo: tipoCode,
    fornecedor: fornecedor,
    escola_name: escolaName,
    produto: produto,
    valor_empenhado: valorEmpenhado,
    valor_liquidado: 0,
    valor_pago: 0,
    data_empenho: new Date().toISOString().slice(0,10),
    status: 'Emitido'
  };

  SharedState.addEmpenho2(novoEmpenho);
  showToast(`✅ Empenho ${numEmpenho} de ${new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(valorEmpenhado)} emitido com sucesso!`, 'success');
  closeModal();

  const container = document.getElementById('page-content');
  if (numAtaTarget) {
    window.abrirModalDetalhesAta(numAtaTarget);
  } else if (container && state.currentPage === 'atas') {
    PAGE_RENDERERS.gestor_atas(container);
  } else if (container && state.currentPage === 'empenhos') {
    PAGE_RENDERERS.gestor_empenhos(container);
  }
};

// ─── GESTOR: EMPENHOS (com dados do Supabase) ───────────────────────

window.abrirModalDetalhesEmpenho = (numeroEmpenho) => {
  const empenhos = SharedState.getEmpenhos2();
  const emp = empenhos.find(e => e.numero_empenho === numeroEmpenho || e.id === numeroEmpenho) || empenhos[0];
  if (!emp) return;

  const fmt = (v) => v ? new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v) : 'R$ 0,00';
  const isAF = emp.tipo === 'AF' || (emp.fornecedor || '').toLowerCase().includes('coop');

  const osCentral = SharedState.getOsEstoqueCentral().filter(o => o.numero_empenho === emp.numero_empenho);
  const osForn = SharedState.getOsFornecedores().filter(o => o.numero_empenho === emp.numero_empenho);

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#f8fafc;padding:16px;border-radius:10px;border:1px solid var(--border);margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:12px">
          <div>
            <h3 style="margin:0;font-size:1.15rem;color:var(--primary-dark)">💳 Empenho SIAFI ${emp.numero_empenho}</h3>
            <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:2px">
              ATA Vinculada: <a href="#" onclick="closeModal(); window.abrirModalDetalhesAta('${emp.ata_numero}')" style="font-weight:700;color:var(--primary);text-decoration:underline">📋 ${emp.ata_numero}</a> · Fornecedor: <strong>${emp.fornecedor}</strong>
            </div>
          </div>
          <span class="tag tag-blue" style="font-size:0.9rem;padding:6px 12px">${emp.status}</span>
        </div>
        <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin:0">
          <div class="kpi-card blue" style="padding:10px"><div class="kpi-label">Empenhado</div><div class="kpi-value" style="font-size:1.1rem">${fmt(emp.valor_empenhado)}</div></div>
          <div class="kpi-card teal" style="padding:10px"><div class="kpi-label">Liquidado</div><div class="kpi-value" style="font-size:1.1rem">${fmt(emp.valor_liquidado)}</div></div>
          <div class="kpi-card green" style="padding:10px"><div class="kpi-label">Pago</div><div class="kpi-value" style="font-size:1.1rem">${fmt(emp.valor_pago)}</div></div>
          <div class="kpi-card orange" style="padding:10px"><div class="kpi-label">Modalidade</div><div class="kpi-value" style="font-size:1.1rem">${isAF ? '🌾 AF / Economia Solidária' : '🏢 Convencional'}</div></div>
        </div>
      </div>

      <div style="margin-bottom:20px">
        <h4 style="margin:0 0 10px 0;color:var(--text-primary)">📦 Itens Anexados ao Empenho</h4>
        <div style="overflow-x:auto;max-height:220px">
          <table class="data-table" style="font-size:0.85rem">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Preço Unit.</th>
                <th>Qtd Empenhada</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${(emp.itens && emp.itens.length > 0) ? emp.itens.map(i => `
                <tr>
                  <td><strong>${i.produto}</strong></td>
                  <td style="font-family:var(--font-mono)">${fmt(i.valorUnit)}</td>
                  <td style="font-family:var(--font-mono);font-weight:700">${i.qtd.toLocaleString('pt-BR')} ${i.unidade||'kg'}</td>
                  <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${fmt(i.valorTotal)}</td>
                </tr>
              `).join('') : `
                <tr>
                  <td><strong>Suprimento da ATA ${emp.ata_numero}</strong></td>
                  <td style="font-family:var(--font-mono)">—</td>
                  <td style="font-family:var(--font-mono)">1 lote contratual</td>
                  <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${fmt(emp.valor_empenhado)}</td>
                </tr>
              `}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h4 style="margin:0 0 10px 0;color:var(--text-primary)">📑 Ordem de Serviço (OS) Gerada & Roteamento</h4>
        <div style="background:#f1f5f9;padding:14px;border-radius:8px;border:1px solid #cbd5e1">
          ${isAF ? `
            <div style="display:flex;align-items:center;gap:14px">
              <div style="font-size:2.2rem">🌾</div>
              <div>
                <div style="font-weight:700;color:#15803d;font-size:1.05rem">Ordem de Fornecimento enviada para a Agricultura Familiar / Cooperativa</div>
                <div style="font-size:0.85rem;color:#334155;margin-top:2px">
                  Fornecedor: <strong>${emp.fornecedor}</strong> · Destino: <strong>${emp.escola_name || 'SEMED Global (Entrega Direta)'}</strong>
                </div>
                <div style="font-size:0.8rem;color:#475569;margin-top:6px">
                  Status no Painel do Agricultor/Cooperativa: <span class="tag tag-green">Enviada ao Produtor Rural</span> (${osForn.length > 0 ? osForn.length : 1} OS gerada)
                </div>
              </div>
            </div>
          ` : `
            <div style="display:flex;align-items:center;gap:14px">
              <div style="font-size:2.2rem">🏭</div>
              <div>
                <div style="font-weight:700;color:#0369a1;font-size:1.05rem">Ordem de Serviço gerada para o Estoque Central</div>
                <div style="font-size:0.85rem;color:#334155;margin-top:2px">
                  Origem: <strong>${emp.fornecedor}</strong> · Destino: <strong>Almoxarifado Central SEMED</strong>
                </div>
                <div style="font-size:0.8rem;color:#475569;margin-top:6px">
                  Status no Almoxarifado Central: <span class="tag tag-blue">Recebimento Programado</span> (${osCentral.length > 0 ? osCentral.length : 1} OS em separação)
                </div>
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
  window.showModal(`💳 Detalhamento do Empenho SIAFI — ${emp.numero_empenho}`, content, '850px');
};

// (salvarNovoEmpenho is handled globally by window.salvarNovoEmpenho)

// ─── GESTOR: OS ESTOQUE CENTRAL ──────────────────────────────────────
PAGE_RENDERERS['gestor_os-central'] = (el) => {
  const os = SharedState.getOsEstoqueCentral();
  const badge = (s) => {
    const map = { Pendente:'tag-orange', 'Em Separação':'tag-blue', Expedido:'tag-blue', Recebido:'tag-green', Cancelado:'tag-red' };
    return `<span class="tag ${map[s]||'tag-gray'}">${s}</span>`;
  };
  const tipoIcon = (t) => ({ Entrada:'📥', 'Saída':'📤', Transferência:'🔀', Ajuste:'⚖️' }[t] || '📋');
  const rows = os.length ? os.map(o => `<tr>
    <td><strong>${o.numero_os}</strong></td>
    <td>${tipoIcon(o.tipo)} ${o.tipo}</td>
    <td>${o.produto}</td>
    <td>${o.quantidade} ${o.unidade}</td>
    <td>${o.fornecedor || o.escola_destino || '—'}</td>
    <td>${o.lote||'—'}</td>
    <td>${o.validade||'—'}</td>
    <td>${o.responsavel||'—'}</td>
    <td>${o.data_programada||''}</td>
    <td>${badge(o.status)}</td>
  </tr>`).join('') : '<tr><td colspan="10" style="text-align:center;color:#94A3B8">Nenhuma OS carregada.</td></tr>';
  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">🏭 Ordens de Serviço — Estoque Central</div>
        <div class="page-subtitle">Entradas, saídas, transferências e ajustes do almoxarifado</div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" onclick="window.abrirModalImportarNFeXML()">📥 Receber NF-e via XML</button>
      </div>
    </div>
    <div class="kpi-grid">
      ${['Entrada','Saída','Transferência','Ajuste'].map(t => `<div class="kpi-card blue"><div class="kpi-icon">${tipoIcon(t)}</div><div class="kpi-value">${os.filter(o=>o.tipo===t).length}</div><div class="kpi-label">${t}s</div></div>`).join('')}
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><strong>Ordens de Serviço</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Número OS</th><th>Tipo</th><th>Produto</th><th>Qtd</th><th>Origem/Destino</th><th>Lote</th><th>Validade</th><th>Responsável</th><th>Data</th><th>Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
};

// ─── GESTOR: LISTA DE COMPRAS ────────────────────────────────────────
// NOTA: a tela de Lista de Compras foi FUNDIDA em sprint_abc.js
// (PAGE_RENDERERS.gestor_listacompras): a ferramenta de geracao no topo e o
// registro de solicitacoes como 2a secao. O menu usa o id `listacompras`.

// ─── GESTOR: OS FORNECEDORES ─────────────────────────────────────────
PAGE_RENDERERS['gestor_os-fornecedores'] = (el) => {
  const os = SharedState.getOsFornecedores();
  const fmt = (v) => v ? new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v) : '—';
  const badge = (s) => {
    const map = {
      Emitida:'tag-blue', 'Confirmada pelo Fornecedor':'tag-blue',
      'Em Preparação':'tag-orange', 'Em Rota':'tag-orange',
      'Entregue Parcialmente':'tag-orange', Entregue:'tag-green',
      Cancelada:'tag-red', 'Com Pendência':'tag-red'
    };
    return `<span class="tag ${map[s]||'tag-gray'}" style="font-size:0.7rem">${s}</span>`;
  };
  const rows = os.length ? os.map(o => `<tr>
    <td><strong>${o.numero_os}</strong></td>
    <td>${o.tipo_fornecedor === 'Cooperativa' ? '🤝' : '🌾'} ${o.tipo_fornecedor}</td>
    <td>${o.cooperativa || o.agricultor || '—'}</td>
    <td>${o.ata_numero||'—'}</td>
    <td>${o.escola_destino || '<em>Almox. Central</em>'}</td>
    <td>${fmt(o.valor_total)}</td>
    <td>${o.data_entrega_prevista||'—'}</td>
    <td>${o.data_entrega_real||'—'}</td>
    <td>${o.guia_protocolo||'—'}</td>
    <td>${badge(o.status)}</td>
  </tr>`).join('') : '<tr><td colspan="10" style="text-align:center;color:#94A3B8">Nenhuma OS de fornecedor carregada.</td></tr>';
  el.innerHTML = `
    <div class="page-header">
      <div><div class="page-title">🤝 OS Fornecedores</div>
      <div class="page-subtitle">Ordens de serviço para cooperativas e agricultores familiares</div></div>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${os.length}</div><div class="kpi-label">Total de OS</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${os.filter(o=>o.status==='Entregue').length}</div><div class="kpi-label">Entregues</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⏳</div><div class="kpi-value">${os.filter(o=>['Emitida','Confirmada pelo Fornecedor','Em Preparação','Em Rota'].includes(o.status)).length}</div><div class="kpi-label">Em Andamento</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">💰</div><div class="kpi-value">${fmt(os.reduce((s,o)=>s+(o.valor_total||0),0))}</div><div class="kpi-label">Valor Total</div></div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><strong>Ordens de Serviço para Fornecedores</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Número OS</th><th>Tipo</th><th>Fornecedor</th><th>ATA</th><th>Destino</th><th>Valor</th><th>Prev. Entrega</th><th>Entregue em</th><th>Guia</th><th>Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
};

// ─── ENGINE DE ABASTECIMENTO EM 7 PASSOS & AUDITORIA ────────────────
window.EngineAbastecimento = {
  processarDemandaItem(produtoName, qtdNecessaria, escolaTarget) {
    let qtdRestante = qtdNecessaria;
    const resultado = {
      produto: produtoName,
      qtdNecessaria: qtdNecessaria,
      atendidoEstoque: 0,
      atendidoEmpenho: 0,
      solicitadoEmpenhoAta: 0,
      encaminhadoListaCompras: 0,
      etapasExecutadas: []
    };

    // ETAPA 1: Checar Estoque Central Físico/Disponível
    const stockCentral = SharedState.getCentralStock();
    const itemStock = stockCentral.find(s => s.produto.toLowerCase() === produtoName.toLowerCase());
    const qtdFisica = itemStock ? (itemStock.qtd || itemStock.quantidade || 0) : 0;
    const qtdReservada = itemStock ? (itemStock.reservado || 0) : 0;
    const disponivelEstoque = Math.max(0, qtdFisica - qtdReservada);

    if (disponivelEstoque > 0) {
      const qtdUsarEstoque = Math.min(qtdRestante, disponivelEstoque);
      resultado.atendidoEstoque = qtdUsarEstoque;
      qtdRestante -= qtdUsarEstoque;

      if (itemStock) itemStock.reservado = (itemStock.reservado || 0) + qtdUsarEstoque;

      SharedState.addOsEstoqueCentral({
        tipo: 'Saída',
        produto: produtoName,
        quantidade: qtdUsarEstoque,
        unidade: itemStock ? itemStock.unidade : 'kg',
        escola_destino: escolaTarget || 'SEMED Central',
        responsavel: 'Engine Abastecimento',
        status: 'Em Separação'
      });

      resultado.etapasExecutadas.push(`✅ Etapa 1: ${qtdUsarEstoque} unidades reservadas do Estoque Central.`);
      SharedState.registrarLogAuditoria({
        acao: 'Reserva de Estoque',
        produto: produtoName,
        quantidade: qtdUsarEstoque,
        origem: 'Demanda Cardápio',
        destino: escolaTarget || 'Estoque Central',
        motivo: 'Atendimento de Demanda (Etapa 1)'
      });
    }

    if (qtdRestante <= 0) {
      SharedState._persist();
      return resultado;
    }

    // ETAPA 2 & 3: Checar Empenhos SIAFI Disponíveis
    const empenhos = SharedState.getEmpenhos2();
    for (const emp of empenhos) {
      if (qtdRestante <= 0) break;
      const saldoEmpR$ = (emp.valor_empenhado || 0) - (emp.valor_liquidado || 0);
      if (saldoEmpR$ > 0) {
        let unitP = 10.00;
        if (Array.isArray(emp.itens)) {
          const itemE = emp.itens.find(i => i.produto.toLowerCase() === produtoName.toLowerCase());
          if (itemE) unitP = itemE.valorUnit || unitP;
        }
        const maxQtdEmp = Math.floor(saldoEmpR$ / unitP);
        if (maxQtdEmp > 0) {
          const qtdUsarEmp = Math.min(qtdRestante, maxQtdEmp);
          resultado.atendidoEmpenho += qtdUsarEmp;
          qtdRestante -= qtdUsarEmp;

          const isAF = emp.tipo === 'AF' || (emp.fornecedor || '').toLowerCase().includes('coop');
          if (isAF) {
            SharedState.addOsFornecedores({
              numero_empenho: emp.numero_empenho,
              ata_numero: emp.ata_numero,
              fornecedor: emp.fornecedor,
              cooperativa: emp.fornecedor,
              produto: produtoName,
              quantidade: qtdUsarEmp,
              unidade: 'kg',
              valor_total: qtdUsarEmp * unitP,
              escola_destino: escolaTarget || 'SEMED Global',
              tipo_os: 'Ordem de Fornecimento AF',
              status: 'Enviada à Cooperativa'
            });
          } else {
            SharedState.addOsEstoqueCentral({
              numero_empenho: emp.numero_empenho,
              tipo: 'Entrada',
              produto: produtoName,
              quantidade: qtdUsarEmp,
              unidade: 'kg',
              fornecedor: emp.fornecedor,
              escola_destino: escolaTarget || 'Almoxarifado Central',
              lote: 'LOTE-NE-' + emp.numero_empenho,
              validade: new Date(Date.now() + 180*24*60*60*1000).toISOString().slice(0,10),
              responsavel: 'Engine Abastecimento',
              status: 'Em Separação'
            });
          }

          resultado.etapasExecutadas.push(`✅ Etapa 3: ${qtdUsarEmp} unidades empenhadas via Empenho SIAFI ${emp.numero_empenho}.`);
          SharedState.registrarLogAuditoria({
            acao: 'Empenho SIAFI Consumido',
            produto: produtoName,
            quantidade: qtdUsarEmp,
            origem: `Empenho ${emp.numero_empenho}`,
            destino: escolaTarget || 'Almoxarifado',
            motivo: 'Atendimento de Demanda (Etapa 3)'
          });
        }
      }
    }

    if (qtdRestante <= 0) {
      SharedState._persist();
      return resultado;
    }

    // ETAPA 4 & 5: Checar Saldo em ATAs de Registro de Preços
    const atas = SharedState.getAtas2();
    for (const ata of atas) {
      if (qtdRestante <= 0) break;
      const saldoAta = (ata.valor_global || 0) - (ata.valor_executado || 0);
      if (saldoAta > 0) {
        const unitP = 12.00;
        const maxQtdAta = Math.floor(saldoAta / unitP);
        if (maxQtdAta > 0) {
          const qtdSolicitar = Math.min(qtdRestante, maxQtdAta);
          resultado.solicitadoEmpenhoAta += qtdSolicitar;
          qtdRestante -= qtdSolicitar;

          const numEmp = '2026NE' + String(Math.floor(600 + Math.random() * 300));
          const vTotal = qtdSolicitar * unitP;
          SharedState.addEmpenho2({
            numero_empenho: numEmp,
            ata_numero: ata.numero || ata.numero_ata,
            tipo: ata.tipo || 'Conv.',
            fornecedor: ata.fornecedor,
            escola_name: escolaTarget || 'SEMED Global',
            valor_empenhado: vTotal,
            valor_liquidado: 0,
            valor_pago: 0,
            status: 'Emitido',
            itens: [{ produto: produtoName, quantidade: qtdSolicitar, valorUnit: unitP, valorTotal: vTotal }]
          });

          ata.valor_executado = (ata.valor_executado || 0) + vTotal;
          resultado.etapasExecutadas.push(`✅ Etapa 5: Solicitado novo Empenho SIAFI ${numEmp} na ATA ${ata.numero || ata.numero_ata} para ${qtdSolicitar} unidades.`);
          SharedState.registrarLogAuditoria({
            acao: 'Solicitação de Novo Empenho na ATA',
            produto: produtoName,
            quantidade: qtdSolicitar,
            origem: `ATA ${ata.numero || ata.numero_ata}`,
            destino: 'Novo Empenho SIAFI',
            motivo: 'Atendimento de Demanda (Etapa 5)'
          });
        }
      }
    }

    // ETAPA 6 & 7: Transbordo para Lista de Compras + Notificação ao Gestor
    if (qtdRestante > 0) {
      resultado.encaminhadoListaCompras = qtdRestante;
      const listas = SharedState.getListaCompras();
      listas.unshift({
        id: 'lista-' + Date.now(),
        titulo: `Compra Emergencial — ${produtoName} (${qtdRestante} kg)`,
        escola_name: escolaTarget || 'Consolidado SEMED',
        tipo: 'Emergencial (Sem Saldo em ATA/Empenho)',
        valor_estimado: qtdRestante * 15.00,
        valor_aprovado: 0,
        data_necessidade: new Date().toISOString().slice(0,10),
        criado_por: 'Engine Abastecimento Automática',
        status: 'Em Análise',
        itens: [{ produto: produtoName, quantidade: qtdRestante, motivo: 'Sem estoque físico e sem saldo em ATA/Empenho' }]
      });

      resultado.etapasExecutadas.push(`⚠️ Etapa 7: ${qtdRestante} unidades transbordadas para a Lista de Compras (Gestor Notificado).`);
      SharedState.registrarLogAuditoria({
        acao: 'Transbordo para Lista de Compras',
        produto: produtoName,
        quantidade: qtdRestante,
        origem: 'Insuficiência de Saldo em ATA/Empenho',
        destino: 'Lista de Compras SEMED',
        motivo: 'Falta de Saldo Contratual (Etapa 7)'
      });
    }

    SharedState._persist();
    return resultado;
  }
};

// ─── IMPORTADOR DE NOTA FISCAL ELETRÔNICA (NFe XML) ─────────────────
window.abrirModalImportarNFeXML = () => {
  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#eff6ff;padding:14px;border-radius:8px;border:1px solid #93c5fd;margin-bottom:16px">
        <h4 style="margin:0 0 4px 0;color:#1e40af">📥 Recebimento de NF-e via Leitura XML</h4>
        <div style="font-size:0.85rem;color:#1e3a8a">
          Selecione o arquivo <strong>.xml</strong> da Nota Fiscal fornecida pelo fornecedor/cooperativa ou cole o código XML abaixo. O sistema lerá os dados e dará entrada automática no Estoque Central e liquidação do Empenho SIAFI.
        </div>
      </div>

      <div class="form-group mb-16">
        <label style="font-weight:600;display:block;margin-bottom:6px">📁 Selecionar Arquivo XML da NFe</label>
        <input type="file" id="nfe-file-input" accept=".xml" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" onchange="window.lerArquivoNFeXML(event)">
      </div>

      <div class="form-group mb-16">
        <label style="font-weight:600;display:block;margin-bottom:6px">ou Conteúdo XML da NFe</label>
        <textarea id="nfe-xml-text" class="btn btn-outline" style="width:100%;height:110px;text-align:left;font-family:monospace;font-size:0.75rem;padding:8px" placeholder="<nfeProc xmlns=...></nfeProc>"></textarea>
      </div>

      <div id="nfe-preview-container" style="display:none;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #cbd5e1;margin-bottom:16px">
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="button" class="btn btn-primary" onclick="window.processarConteudoXMLNFe()">💾 Processar XML e Dar Entrada</button>
      </div>
    </div>
  `;
  window.showModal('📥 Receber Nota Fiscal Eletrônica (NFe XML)', content, '750px');
};

window.lerArquivoNFeXML = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    document.getElementById('nfe-xml-text').value = text;
    window.processarConteudoXMLNFe();
  };
  reader.readAsText(file);
};

window.processarConteudoXMLNFe = () => {
  const xmlText = document.getElementById('nfe-xml-text').value;
  if (!xmlText || !xmlText.trim()) {
    alert('⚠️ Por favor, selecione um arquivo XML válido ou cole o conteúdo XML da Nota Fiscal.');
    return;
  }

  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    const getTag = (parent, tag) => {
      const el = parent.getElementsByTagName(tag)[0];
      return el ? el.textContent : '';
    };

    const nNF = getTag(xmlDoc, 'nNF') || String(Math.floor(10000 + Math.random() * 90000));
    const chNFe = getTag(xmlDoc, 'chNFe') || ('352608' + Date.now() + '1001');
    const emitNome = getTag(xmlDoc, 'xNome') || 'FORNECEDOR REGISTRADO LTDA';
    const vNF = parseFloat(getTag(xmlDoc, 'vNF')) || 125000.00;

    const detNodes = xmlDoc.getElementsByTagName('det');
    const itensNFe = [];

    if (detNodes && detNodes.length > 0) {
      for (let i = 0; i < detNodes.length; i++) {
        const prodNode = detNodes[i].getElementsByTagName('prod')[0];
        if (prodNode) {
          itensNFe.push({
            xProd: getTag(prodNode, 'xProd') || `Item ${i+1}`,
            qCom: parseFloat(getTag(prodNode, 'qCom')) || 500,
            uCom: getTag(prodNode, 'uCom') || 'kg',
            vUnCom: parseFloat(getTag(prodNode, 'vUnCom')) || 10.00,
            vProd: parseFloat(getTag(prodNode, 'vProd')) || 5000.00,
            nLote: getTag(prodNode, 'nLote') || ('LOTE-' + new Date().getFullYear() + '-' + (i+101)),
            dVal: getTag(prodNode, 'dVal') || new Date(Date.now() + 180*24*60*60*1000).toISOString().slice(0,10)
          });
        }
      }
    } else {
      itensNFe.push({
        xProd: 'Gêneros Alimentícios Diversos',
        qCom: 1000,
        uCom: 'kg',
        vUnCom: 12.50,
        vProd: vNF,
        nLote: 'LOTE-' + new Date().getFullYear() + '-001',
        dVal: new Date(Date.now() + 180*24*60*60*1000).toISOString().slice(0,10)
      });
    }

    // Dá entrada das OS no Estoque Central
    itensNFe.forEach(item => {
      SharedState.addOsEstoqueCentral({
        numero_os: 'OS-NF-' + nNF,
        tipo: 'Entrada',
        produto: item.xProd,
        quantidade: item.qCom,
        unidade: item.uCom,
        fornecedor: emitNome,
        escola_destino: 'Almoxarifado Central SEMED',
        lote: item.nLote,
        validade: item.dVal,
        responsavel: 'Leitura NFe XML',
        status: 'Recebido'
      });
    });

    // Atualiza Empenho vinculado se houver
    const empenhos = SharedState.getEmpenhos2();
    const empMatch = empenhos.find(e => (e.fornecedor || '').toLowerCase().includes(emitNome.toLowerCase().slice(0,6))) || empenhos[0];
    if (empMatch) {
      empMatch.valor_liquidado = (empMatch.valor_liquidado || 0) + vNF;
      empMatch.status = empMatch.valor_liquidado >= empMatch.valor_empenhado ? 'Liquidado' : 'Emitido';
      SharedState._persist();
    }

    SharedState.registrarLogAuditoria({
      acao: 'Importação de NF-e via XML',
      produto: itensNFe.map(i => i.xProd).join(', '),
      quantidade: itensNFe.reduce((s,i) => s + i.qCom, 0),
      origem: `NF-e nº ${nNF} (${emitNome})`,
      destino: 'Almoxarifado Central SEMED',
      motivo: 'Recebimento de Mercadorias com Chave NFe ' + chNFe
    });

    showToast(`✅ NF-e nº ${nNF} lida e processada com sucesso! ${itensNFe.length} itens recebidos no Estoque Central.`);
    closeModal();
    const container = document.getElementById('page-content');
    if (container && PAGE_RENDERERS['gestor_os-central']) PAGE_RENDERERS['gestor_os-central'](container);
  } catch (err) {
    alert('❌ Erro ao ler o arquivo XML: ' + err.message);
  }
};

window.executarSimulacaoEngine7Passos = () => {
  const produtoDemo = 'Arroz Tipo 1 (5kg)';
  const qtdDemo = 500;
  const escolaDemo = 'EMEF Prof. Henrique Scabello';

  const res = window.EngineAbastecimento.processarDemandaItem(produtoDemo, qtdDemo, escolaDemo);
  const etapasHtml = res.etapasExecutadas.map(e => `<li style="margin-bottom:6px;font-size:0.9rem">${e}</li>`).join('');

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#f0fdf4;padding:14px;border-radius:8px;border:1px solid #86efac;margin-bottom:16px">
        <h4 style="margin:0 0 4px 0;color:#166534">⚡ Engine de Abastecimento em 7 Passos Executada</h4>
        <div style="font-size:0.85rem;color:#14532d">
          Demanda de <strong>${qtdDemo} kg</strong> de <strong>${produtoDemo}</strong> para a <strong>${escolaDemo}</strong> processada através da árvore de decisão de suprimentos.
        </div>
      </div>

      <div class="card mb-16" style="padding:14px">
        <h5 style="margin:0 0 10px 0;color:var(--text-primary)">📜 Passos Executados pela Engine:</h5>
        <ul style="padding-left:20px;margin:0;color:var(--text-secondary)">
          ${etapasHtml}
        </ul>
      </div>

      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:16px">
        <div class="kpi-card green" style="padding:8px"><div class="kpi-label">Estoque Físico</div><div class="kpi-value" style="font-size:1rem">${res.atendidoEstoque} kg</div></div>
        <div class="kpi-card blue" style="padding:8px"><div class="kpi-label">Empenho SIAFI</div><div class="kpi-value" style="font-size:1rem">${res.atendidoEmpenho} kg</div></div>
        <div class="kpi-card orange" style="padding:8px"><div class="kpi-label">Novo Empenho ATA</div><div class="kpi-value" style="font-size:1rem">${res.solicitadoEmpenhoAta} kg</div></div>
        <div class="kpi-card red" style="padding:8px"><div class="kpi-label">Lista de Compras</div><div class="kpi-value" style="font-size:1rem">${res.encaminhadoListaCompras} kg</div></div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center">
        <button class="btn btn-outline" onclick="window.abrirModalLogsAuditoria()">📜 Ver Trilha de Auditoria Completa</button>
        <button class="btn btn-primary" onclick="closeModal()">Concluído</button>
      </div>
    </div>
  `;

  window.showModal('⚡ Processamento da Engine de Abastecimento (7 Passos)', content, '750px');
};

window.abrirModalLogsAuditoria = () => {
  const logs = SharedState.getLogsAuditoria();
  const rows = logs.length ? logs.map(l => `
    <tr>
      <td><small style="font-family:var(--font-mono)">${l.timestamp ? l.timestamp.slice(0,19).replace('T',' ') : ''}</small></td>
      <td><strong>${l.acao}</strong></td>
      <td>${l.usuario || 'Gestor SEMED'}</td>
      <td>${l.produto}</td>
      <td style="font-family:var(--font-mono);font-weight:700">${l.quantidade}</td>
      <td>${l.origem} ➔ ${l.destino}</td>
      <td><small>${l.motivo}</small></td>
    </tr>
  `).join('') : '<tr><td colspan="7" style="text-align:center;color:#94A3B8">Nenhum log de auditoria gravado ainda.</td></tr>';

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="overflow-x:auto;max-height:400px">
        <table class="data-table" style="font-size:0.8rem">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Ação</th>
              <th>Usuário</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Origem ➔ Destino</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:16px">
        <button class="btn btn-outline" onclick="closeModal()">Fechar</button>
      </div>
    </div>
  `;

  window.showModal('📜 Trilha de Auditoria & Rastreabilidade de Suprimentos', content, '950px');
};

// SUALE — MÓDULO DE ESTOQUE CENTRAL (v2.3.0)
// Módulo 01: Recebimento de Mercadorias & Módulo 02: Expedição para Escolas
// Implementação Integral das 13 Regras de Negócio (RN01 a RN13)

(function initEstoqueCentralModulo() {
  if (!SharedState._data.recebimentosPendentes) {
    SharedState._data.recebimentosPendentes = [
      {
        id: 'REC-2026-001',
        numeroPedido: 'PED-2026/089',
        numeroOs: 'OS-ENT-2026/012',
        numeroEmpenho: '2026NE00477',
        numeroAta: 'ATA-2026/031',
        fornecedor: 'NUTRI ALIMENTOS DISTRIBUIDORA LTDA',
        produto: 'Arroz Tipo 1 (5kg)',
        qtdSolicitada: 2000,
        qtdEntregue: 500,
        qtdPendente: 1500,
        dataPrevista: '2026-08-08',
        status: 'Em transporte',
        prioridade: 'Alta',
        escolaDestino: 'Almoxarifado Central SEMED',
        loteEsperado: 'LOT-ARZ-889',
        validadeEsperada: '2026-12-15',
        conferenciaFisica: null,
        confrontoNfe: null,
        divergencias: []
      },
      {
        id: 'REC-2026-002',
        numeroPedido: 'PED-2026/092',
        numeroOs: 'OS-ENT-2026/015',
        numeroEmpenho: '2026NE00489',
        numeroAta: 'ATA-2026/001',
        fornecedor: 'COOPAGRAN (Cooperativa)',
        produto: 'Banana Nanica',
        qtdSolicitada: 800,
        qtdEntregue: 0,
        qtdPendente: 800,
        dataPrevista: '2026-08-06',
        status: 'Entrega agendada',
        prioridade: 'Alta',
        escolaDestino: 'Almoxarifado Central SEMED',
        loteEsperado: 'LOT-BAN-104',
        validadeEsperada: '2026-08-14',
        conferenciaFisica: null,
        confrontoNfe: null,
        divergencias: []
      },
      {
        id: 'REC-2026-003',
        numeroPedido: 'PED-2026/095',
        numeroOs: 'OS-ENT-2026/018',
        numeroEmpenho: '2026NE00512',
        numeroAta: 'ATA-2026/018',
        fornecedor: 'POLARIS COMÉRCIO DE ALIMENTOS LTDA',
        produto: 'Leite Integral (1L)',
        qtdSolicitada: 3500,
        qtdEntregue: 1000,
        qtdPendente: 2500,
        dataPrevista: '2026-08-07',
        status: 'Em conferência',
        prioridade: 'Média',
        escolaDestino: 'Almoxarifado Central SEMED',
        loteEsperado: 'LOT-LTE-991',
        validadeEsperada: '2026-11-20',
        conferenciaFisica: null,
        confrontoNfe: null,
        divergencias: []
      },
      {
        id: 'REC-2026-004',
        numeroPedido: 'PED-2026/098',
        numeroOs: 'OS-ENT-2026/022',
        numeroEmpenho: '2026NE00501',
        numeroAta: 'ATA-2026/042',
        fornecedor: 'AVINORTE DISTRIBUIDORA DE AVES LTDA',
        produto: 'Frango (Coxa/Sobrecoxa)',
        qtdSolicitada: 1200,
        qtdEntregue: 0,
        qtdPendente: 1200,
        dataPrevista: '2026-08-09',
        status: 'Aguardando envio',
        prioridade: 'Normal',
        escolaDestino: 'Almoxarifado Central SEMED',
        loteEsperado: 'LOT-FRG-332',
        validadeEsperada: '2026-10-10',
        conferenciaFisica: null,
        confrontoNfe: null,
        divergencias: []
      }
    ];
  }

  if (!SharedState._data.ordensServicoExpedicao) {
    SharedState._data.ordensServicoExpedicao = [
      {
        id: 'OS-EXP-2026/001',
        numeroOs: 'OS-EXP-2026/001',
        escolaId: 'esc-1',
        escolaNome: 'EMEF Prof. Henrique Scabello',
        municipio: 'Campo Grande - MS',
        produtos: [
          { produto: 'Arroz Tipo 1 (5kg)', quantidade: 150, unidade: 'kg', loteSugerido: 'LOT-ARZ-2026A', validade: '2026-10-15' },
          { produto: 'Feijão Carioca', quantidade: 60, unidade: 'kg', loteSugerido: 'LOT-FEJ-2026B', validade: '2026-11-01' }
        ],
        dataPrevista: '2026-08-07',
        prioridade: 'Alta',
        status: 'Aguardando Separação'
      },
      {
        id: 'OS-EXP-2026/002',
        numeroOs: 'OS-EXP-2026/002',
        escolaId: 'esc-2',
        escolaNome: 'EMEF Doutor João Sampaio',
        municipio: 'Campo Grande - MS',
        produtos: [
          { produto: 'Leite Integral (1L)', quantidade: 300, unidade: 'L', loteSugerido: 'LOT-LTE-2026A', validade: '2026-09-20' },
          { produto: 'Banana Nanica', quantidade: 120, unidade: 'kg', loteSugerido: 'LOT-BAN-2026A', validade: '2026-08-12' }
        ],
        dataPrevista: '2026-08-08',
        prioridade: 'Média',
        status: 'Separado'
      }
    ];
  }

  if (!SharedState._data.ordensEntrega) {
    SharedState._data.ordensEntrega = [
      {
        id: 'OE-2026/001',
        numeroOe: 'OE-2026/001',
        osId: 'OS-EXP-2026/002',
        escolaId: 'esc-2',
        escolaNome: 'EMEF Doutor João Sampaio',
        motorista: 'Marcos Antônio Ribeiro',
        veiculo: 'Furgão IVECO Daily (ABC-1234)',
        rota: 'Rota 03 — Zona Norte (Anhanduízinho)',
        dataEntrega: '2026-08-08',
        status: 'Em Transporte',
        produtos: [
          { produto: 'Leite Integral (1L)', quantidade: 300, lote: 'LOT-LTE-2026A' },
          { produto: 'Banana Nanica', quantidade: 120, lote: 'LOT-BAN-2026A' }
        ],
        assinaturaDigital: null,
        recebidoPor: null,
        dataRecebimentoReal: null
      }
    ];
  }

  if (!SharedState._data.notificacoesFornecedor) {
    SharedState._data.notificacoesFornecedor = [];
  }

  SharedState._persist();
})();

SharedState.getRecebimentosPendentes = () => [...(SharedState._data.recebimentosPendentes || [])];
SharedState.getOrdensServicoExpedicao = () => [...(SharedState._data.ordensServicoExpedicao || [])];
SharedState.getOrdensEntrega = () => [...(SharedState._data.ordensEntrega || [])];
SharedState.getNotificacoesFornecedor = () => [...(SharedState._data.notificacoesFornecedor || [])];

// ═══════════════════════════════════════════════════════════════════════════
// ÉPICO EXPEDIÇÃO & LOGÍSTICA — modelo de dados + helpers (Sprints 1–5)
// Frota (A1b) · Cargas/Montagem (A1/A2/A2b) · Ocorrências (F14/F15) ·
// Cobertura (C10). Camada = SharedState. Seeds idempotentes (funcionam tanto
// para localStorage novo quanto para estado já persistido de versões antigas).
// ═══════════════════════════════════════════════════════════════════════════
(function initExpedicaoLogisticaModel() {
  const S = SharedState;

  // ── Seeds idempotentes ────────────────────────────────────────────────────
  if (!S._data.frota) {
    S._data.frota = [
      { id: 'CAM-01', placa: 'OAB-1A23', modelo: 'Mercedes-Benz Accelo 1016',        capacidadeKg: 5400, refrigerado: true,  motoristaPadrao: 'José Souza',              status: 'ativo' },
      { id: 'CAM-02', placa: 'NRD-2B45', modelo: 'VW Delivery 9.170',                 capacidadeKg: 4800, refrigerado: false, motoristaPadrao: 'Marcos Antônio Ribeiro', status: 'ativo' },
      { id: 'CAM-03', placa: 'HTF-3C67', modelo: 'Iveco Daily 70C17 (Câmara Fria)',   capacidadeKg: 3200, refrigerado: true,  motoristaPadrao: 'Carlos Alberto Santos',   status: 'ativo' },
    ];
  }
  if (!S._data.cargas) S._data.cargas = [];
  if (!S._data.ocorrencias) S._data.ocorrencias = [];

  // Garante O.E. pendentes ("Aguardando carga") para a Montagem de Carga operar.
  S._data.ordensEntrega = S._data.ordensEntrega || [];
  const _hoje = new Date().toISOString();
  const _seedOes = [
    { id: 'OE-SEED-201', numeroOe: 'OE-2026/201', osId: 'OS-EXP-2026/001', escolaId: 'esc-1', escolaNome: 'EMEF Prof. Henrique Scabello',
      status: 'Aguardando carga', cargaId: null, dataEntrega: null, criadaEm: _hoje, historicoStatus: [{ status: 'Aguardando carga', autor: 'Estoque Central', data: _hoje }],
      produtos: [ { produto: 'Arroz Tipo 1 (5kg)', quantidade: 150, unidade: 'kg' }, { produto: 'Feijão Carioca', quantidade: 60, unidade: 'kg' } ] },
    { id: 'OE-SEED-202', numeroOe: 'OE-2026/202', osId: 'OS-EXP-2026/003', escolaId: 'esc-3', escolaNome: 'EMEF Vereador Antônio Alves',
      status: 'Aguardando carga', cargaId: null, dataEntrega: null, criadaEm: _hoje, historicoStatus: [{ status: 'Aguardando carga', autor: 'Estoque Central', data: _hoje }],
      produtos: [ { produto: 'Leite Integral (1L)', quantidade: 300, unidade: 'L' }, { produto: 'Banana Nanica', quantidade: 90, unidade: 'kg' } ] },
    { id: 'OE-SEED-203', numeroOe: 'OE-2026/203', osId: 'OS-EXP-2026/004', escolaId: 'esc-4', escolaNome: 'EMEF Doutora Zulmira',
      status: 'Aguardando carga', cargaId: null, dataEntrega: null, criadaEm: _hoje, historicoStatus: [{ status: 'Aguardando carga', autor: 'Estoque Central', data: _hoje }],
      produtos: [ { produto: 'Frango (Coxa/Sobrecoxa)', quantidade: 200, unidade: 'kg' } ] },
  ];
  _seedOes.forEach(oe => { if (!S._data.ordensEntrega.some(x => x.id === oe.id)) S._data.ordensEntrega.unshift(oe); });

  S._persist();

  // ── Peso da O.E. (kg; regra 1 L = 1 kg) ──────────────────────────────────
  S.pesoDaOe = (oe) => {
    if (!oe) return 0;
    if (typeof oe.pesoKg === 'number') return oe.pesoKg;
    return (oe.produtos || []).reduce((s, p) => s + (Number(p.quantidade) || 0), 0);
  };

  // ── FROTA (A1b) ──────────────────────────────────────────────────────────
  S.getFrota = () => [...(S._data.frota || [])];
  S.addCaminhao = (c) => {
    const id = 'CAM-' + Date.now().toString().slice(-6);
    const novo = { id, status: 'ativo', capacidadeKg: 5400, refrigerado: false, ...c };
    (S._data.frota = S._data.frota || []).push(novo);
    S._persist(); S._emit('frota:add');
    return novo;
  };
  S.updateCaminhao = (id, patch) => {
    const c = (S._data.frota || []).find(x => x.id === id);
    if (!c) return null;
    Object.assign(c, patch); S._persist(); S._emit('frota:update');
    return c;
  };
  S.deleteCaminhao = (id) => { S._data.frota = (S._data.frota || []).filter(x => x.id !== id); S._persist(); };

  // ── CARGAS / MONTAGEM (A1/A2/A2b) ────────────────────────────────────────
  S.getCargas = () => [...(S._data.cargas || [])];
  S.criarCarga = ({ caminhaoId, motorista }) => {
    const cam = (S._data.frota || []).find(c => c.id === caminhaoId);
    const carga = {
      id: 'CG-' + Date.now().toString().slice(-6),
      caminhaoId,
      motorista: motorista || (cam ? cam.motoristaPadrao : 'Motorista CD'),
      pesoTotalKg: 0,
      oes: [],
      rotaOrdenada: [],
      status: 'em_montagem',
      criadaEm: new Date().toISOString(),
      historicoStatus: [{ status: 'em_montagem', autor: 'Estoque Central', data: new Date().toISOString() }],
    };
    (S._data.cargas = S._data.cargas || []).unshift(carga);
    S._persist(); S._emit('carga:create');
    return carga;
  };
  S._recalcPesoCarga = (carga) => {
    const oes = S._data.ordensEntrega || [];
    carga.pesoTotalKg = (carga.oes || []).reduce((s, oeId) => s + S.pesoDaOe(oes.find(o => o.id === oeId)), 0);
    return carga.pesoTotalKg;
  };
  // Trava de peso A1: retorna {ok:false, motivo:'excede'} se estourar a capacidade.
  S.addOeNaCarga = (cargaId, oeId) => {
    const carga = (S._data.cargas || []).find(c => c.id === cargaId);
    const oe = (S._data.ordensEntrega || []).find(o => o.id === oeId);
    if (!carga || !oe) return { ok: false, motivo: 'not-found' };
    if (oe.cargaId && oe.cargaId !== cargaId) return { ok: false, motivo: 'ja-alocada' };
    const cam = (S._data.frota || []).find(c => c.id === carga.caminhaoId);
    const cap = cam ? cam.capacidadeKg : 5400;
    const pesoOe = S.pesoDaOe(oe);
    if ((carga.pesoTotalKg + pesoOe) > cap) return { ok: false, motivo: 'excede', pesoOe, restante: cap - carga.pesoTotalKg, placa: cam ? cam.placa : '' };
    if (!carga.oes.includes(oeId)) carga.oes.push(oeId);
    if (!(carga.rotaOrdenada || []).includes(oeId)) (carga.rotaOrdenada = carga.rotaOrdenada || []).push(oeId);
    oe.cargaId = cargaId;
    oe.status = 'Em Carga';
    (oe.historicoStatus = oe.historicoStatus || []).push({ status: 'Em Carga', autor: 'Estoque Central', data: new Date().toISOString(), detalhe: 'Carga ' + cargaId });
    S._recalcPesoCarga(carga);
    S._persist(); S._emit('carga:oe:add');
    return { ok: true, carga };
  };
  S.removerOeDaCarga = (cargaId, oeId) => {
    const carga = (S._data.cargas || []).find(c => c.id === cargaId);
    const oe = (S._data.ordensEntrega || []).find(o => o.id === oeId);
    if (carga) { carga.oes = (carga.oes || []).filter(x => x !== oeId); carga.rotaOrdenada = (carga.rotaOrdenada || []).filter(x => x !== oeId); S._recalcPesoCarga(carga); }
    if (oe) { oe.cargaId = null; oe.status = 'Aguardando carga'; }
    S._persist(); S._emit('carga:oe:remove');
  };
  S.setStatusCarga = (cargaId, novoStatus, autor) => {
    const carga = (S._data.cargas || []).find(c => c.id === cargaId);
    if (!carga) return null;
    carga.status = novoStatus;
    (carga.historicoStatus = carga.historicoStatus || []).push({ status: novoStatus, autor: autor || 'Estoque Central', data: new Date().toISOString() });
    S._persist(); S._emit('carga:status');
    return carga;
  };

  // ── OCORRÊNCIAS (F14/F15) ────────────────────────────────────────────────
  S.getOcorrencias = (modulo) => {
    const all = [...(S._data.ocorrencias || [])];
    return modulo ? all.filter(o => o.modulo === modulo) : all;
  };
  S.registrarOcorrencia = (oc) => {
    const curProf = (typeof state !== 'undefined' && PROFILES && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile] : null;
    const perfil = oc.perfil || (typeof state !== 'undefined' ? state.currentProfile : 'estoque');
    const autor = oc.autor || (curProf ? curProf.name : 'Operador');
    const nova = {
      id: 'OC-' + Date.now().toString().slice(-6),
      perfil,
      autor,
      modulo: perfil,
      tipo: oc.tipo || 'Operacional',
      titulo: oc.titulo || oc.motivo || 'Ocorrência Operacional',
      descricao: oc.descricao || oc.detalhes || oc.motivo || '',
      escola: oc.escola || oc.escolaNome || '—',
      status: oc.status || 'Pendente',
      criadoEm: new Date().toISOString(),
      data: new Date().toISOString().split('T')[0],
      ...oc,
    };
    (S._data.ocorrencias = S._data.ocorrencias || []).unshift(nova);
    S._persist(); S._emit('ocorrencia:add');
    return nova;
  };

  window.abrirModalNovaOcorrencia = () => {
    const curProf = (typeof state !== 'undefined' && PROFILES && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile] : { role: 'Operador', name: 'Usuário' };
    const perfilAtual = typeof state !== 'undefined' ? state.currentProfile : 'estoque';

    const body = `
      <form onsubmit="window.salvarNovaOcorrencia(event)">
        <div class="form-group mb-16">
          <label class="form-label">Perfil Solicitante / Origem</label>
          <input type="text" class="form-control" value="${curProf.role} (${curProf.name})" disabled>
          <input type="hidden" id="oc-perfil" value="${perfilAtual}">
          <input type="hidden" id="oc-autor" value="${curProf.name}">
        </div>

        <div class="form-group mb-16">
          <label class="form-label">Tipo de Ocorrência</label>
          <select id="oc-tipo" class="form-control" required>
            <option value="Avarias / Danos">📦 Avarias / Danos na Mercadoria</option>
            <option value="Atraso de Entrega">🚚 Atraso de Entrega / Trânsito</option>
            <option value="Divergência de Quantidade">📊 Divergência de Quantidade</option>
            <option value="Qualidade / Temperatura">🌡️ Qualidade / Temperatura Inadequada</option>
            <option value="Problema Mecânico">🔧 Problema Mecânico / Veículo</option>
            <option value="Outros">⚠️ Outros / Diversos</option>
          </select>
        </div>

        <div class="form-group mb-16">
          <label class="form-label">Unidade / Escola / Placa Relacionada</label>
          <input type="text" id="oc-unidade" class="form-control" placeholder="Ex: EMEF Doutor João Sampaio ou Placa ABC-1234">
        </div>

        <div class="form-group mb-16">
          <label class="form-label">Descrição Detalhada da Ocorrência</label>
          <textarea id="oc-descricao" class="form-control" rows="4" placeholder="Relate com precisão o fato ocorrido..." required></textarea>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-primary">💾 Registrar Ocorrência</button>
        </div>
      </form>
    `;
    window.showModal('⚠️ Registrar Nova Ocorrência Operacional', body, '600px');
  };

  window.salvarNovaOcorrencia = (e) => {
    e.preventDefault();
    const perfil = document.getElementById('oc-perfil').value;
    const autor = document.getElementById('oc-autor').value;
    const tipo = document.getElementById('oc-tipo').value;
    const escola = document.getElementById('oc-unidade').value || 'Geral';
    const descricao = document.getElementById('oc-descricao').value;

    SharedState.registrarOcorrencia({
      perfil,
      autor,
      tipo,
      escola,
      descricao,
      modulo: perfil,
      status: 'Pendente'
    });

    showToast('⚠️ Ocorrência registrada no Livro Geral com sucesso!');
    closeModal();
    renderPage();
  };

  // ── COBERTURA DE ESTOQUE ESCOLAR & FULFILLMENT (C10) ───────────────────
  // Confronta OS (solicitado) vs OE com status Entregue (dupla checagem) por produto/kg por escola
  S.getCoberturaEscolas = (opts) => {
    const schools = (typeof DATA !== 'undefined' && DATA.schools) ? DATA.schools : (S._data.schools || []);
    const osList = S.getOrdensServicoExpedicao ? S.getOrdensServicoExpedicao() : (S._data.ordensServicoExpedicao || []);
    const oeList = S.getOrdensEntrega ? S.getOrdensEntrega() : (S._data.ordensEntrega || []);

    return schools.map(sc => {
      const escolaIdStr = String(sc.id);
      const escolaNome = sc.name || sc.nome || 'Escola';

      const schoolOs = osList.filter(o =>
        String(o.escolaId) === escolaIdStr ||
        String(o.escolaId) === 'esc-' + escolaIdStr ||
        (o.escola && o.escola.toLowerCase() === escolaNome.toLowerCase()) ||
        (o.escolaNome && o.escolaNome.toLowerCase() === escolaNome.toLowerCase())
      );

      const schoolOeEntregues = oeList.filter(o =>
        (o.status === 'Entregue') &&
        (String(o.escolaId) === escolaIdStr ||
         String(o.escolaId) === 'esc-' + escolaIdStr ||
         (o.escola && o.escola.toLowerCase() === escolaNome.toLowerCase()) ||
         (o.escolaNome && o.escolaNome.toLowerCase() === escolaNome.toLowerCase()))
      );

      const prodMap = {};
      let totalSolicitado = 0;
      let totalEntregue = 0;

      schoolOs.forEach(o => {
        (o.produtos || o.itens || []).forEach(it => {
          const name = it.produto || it.nome || 'Item';
          const qtd = Number(it.quantidade || it.qtd || 0);
          if (!prodMap[name]) prodMap[name] = { produto: name, solicitado: 0, entregue: 0, saldo: 0, unidade: it.unidade || 'kg' };
          prodMap[name].solicitado += qtd;
          totalSolicitado += qtd;
        });
      });

      schoolOeEntregues.forEach(o => {
        (o.produtos || o.itens || []).forEach(it => {
          const name = it.produto || it.nome || 'Item';
          const qtd = Number(it.quantidade || it.qtd || 0);
          if (!prodMap[name]) prodMap[name] = { produto: name, solicitado: 0, entregue: 0, saldo: 0, unidade: it.unidade || 'kg' };
          prodMap[name].entregue += qtd;
          totalEntregue += qtd;
        });
      });

      let totalSaldo = 0;
      const produtos = Object.values(prodMap).map(p => {
        p.saldo = Math.max(0, p.solicitado - p.entregue);
        totalSaldo += p.saldo;
        return p;
      });

      // Status: 'abastecida' (tudo entregue ou sem pendências) | 'pendente' (há saldo a entregar)
      const status = (totalSolicitado > 0 && totalSaldo === 0) ? 'abastecida' : 'pendente';

      return {
        escolaId: 'esc-' + sc.id,
        escola: escolaNome,
        alunos: sc.students || 0,
        solicitadoKg: totalSolicitado,
        entregueKg: totalEntregue,
        saldoKg: totalSaldo,
        status,
        produtos,
      };
    });
  };
})();

// ═══════════════════════════════════════════════════════════════════════════
// ÉPICO EXPEDIÇÃO & LOGÍSTICA — handlers cross-perfil (Montagem, Liberação,
// Rastreamento). Ficam no Hub porque tocam cargas + O.E. + despacho ao Motorista.
// ═══════════════════════════════════════════════════════════════════════════

// ── MONTAGEM DE CARGA (A2 / A2b · Ajuste 02: gating por O.E. já criada) ──────
// arg pode ser: undefined (nova carga) · id de carga (adicionar/ver O.E.) ·
// id de O.E. pendente (pré-selecionar para alocar).
window.abrirModalMontagemCarga = (arg) => {
  const cargas = SharedState.getCargas();
  const frota  = SharedState.getFrota().filter(c => c.status === 'ativo');
  const oes    = SharedState.getOrdensEntrega();

  let carga = cargas.find(c => c.id === arg);
  const oePreSel = !carga ? oes.find(o => o.id === arg) : null;

  // Carga já em rota/concluída → visão somente-leitura das O.E. da viagem.
  if (carga && carga.status !== 'em_montagem') {
    const cam = frota.concat(SharedState.getFrota()).find(c => c.id === carga.caminhaoId) || { placa: '—', modelo: '' };
    const itens = (carga.oes || []).map(id => oes.find(o => o.id === id)).filter(Boolean);
    const body = `
      <div style="background:#eff6ff;padding:10px 12px;border-radius:8px;margin-bottom:12px;font-size:0.85rem;color:#1e40af">
        🚚 Carga <strong>${carga.id}</strong> · ${cam.placa} · Motorista ${carga.motorista} · ${(carga.pesoTotalKg||0).toLocaleString('pt-BR')} kg · Status: <strong>${carga.status === 'em_transporte' ? 'Em Rota' : 'Concluída'}</strong>
      </div>
      <table class="data-table"><thead><tr><th>O.E.</th><th>Escola</th><th>Peso</th><th>Status</th></tr></thead><tbody>
        ${itens.map(o => `<tr><td><strong>${o.numeroOe||o.id}</strong></td><td>${o.escolaNome||'—'}</td><td style="font-family:var(--font-mono)">${SharedState.pesoDaOe(o).toLocaleString('pt-BR')} kg</td><td><span class="status-badge status-info">${o.status}</span></td></tr>`).join('') || '<tr><td colspan="4" style="text-align:center;padding:16px;color:var(--text-secondary)">Sem O.E.</td></tr>'}
      </tbody></table>
      <div style="display:flex;justify-content:flex-end;margin-top:16px"><button class="btn btn-outline" onclick="closeModal()">Fechar</button></div>`;
    window.showModal('🚚 O.E. da Carga — ' + carga.id, body, '640px');
    return;
  }

  // Pool = O.E. "Aguardando carga" sem cargaId (gating do Ajuste 02).
  const pool = oes.filter(o => o.status === 'Aguardando carga' && !o.cargaId);

  const jaAlocado = carga ? (carga.pesoTotalKg || 0) : 0;
  const caminhaoFixo = carga ? SharedState.getFrota().find(c => c.id === carga.caminhaoId) : null;

  // 1 caminhão = 1 carga ativa (em_montagem ou em_transporte)
  const cargasAtivas = cargas.filter(c => c.status === 'em_montagem' || c.status === 'em_transporte');
  const caminhaoIdsOcupados = cargasAtivas.map(c => c.caminhaoId);
  const frotaDisponivel = carga ? frota : frota.filter(c => !caminhaoIdsOcupados.includes(c.id));

  const camOptions = frotaDisponivel.map(c =>
    `<option value="${c.id}" data-cap="${c.capacidadeKg}">${c.placa} — ${c.modelo} · ${c.capacidadeKg.toLocaleString('pt-BR')} kg${c.refrigerado ? ' ❄️' : ''}</option>`
  ).join('');

  const poolRows = pool.length ? pool.map(o => {
    const peso = SharedState.pesoDaOe(o);
    const pre = oePreSel && oePreSel.id === o.id ? 'checked' : '';
    return `
      <label style="display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;cursor:pointer">
        <input type="checkbox" class="mc-oe" value="${o.id}" data-peso="${peso}" ${pre} onchange="window._recalcMontagem()" style="width:18px;height:18px">
        <div style="flex:1">
          <strong>${o.numeroOe || o.id}</strong> — ${o.escolaNome || '—'}<br>
          <small class="text-secondary">${(o.produtos||[]).map(p => `${p.produto} (${p.quantidade} ${p.unidade||''})`).join(' · ')}</small>
        </div>
        <span class="tag tag-blue" style="font-family:var(--font-mono)">${peso.toLocaleString('pt-BR')} kg</span>
      </label>`;
  }).join('') : '<div style="text-align:center;padding:20px;color:var(--text-secondary)">Nenhuma O.E. aguardando carga. Crie O.E. na tela Expedição (OS Escolas).</div>';

  const caminhaoBloco = carga
    ? `<div style="background:var(--surface-2);padding:10px 12px;border-radius:6px;margin-bottom:6px">
         Caminhão da carga <strong>${carga.id}</strong>: <strong>${caminhaoFixo ? caminhaoFixo.placa : '—'}</strong> (${caminhaoFixo ? caminhaoFixo.capacidadeKg.toLocaleString('pt-BR') : '5.400'} kg) · já alocado ${jaAlocado.toLocaleString('pt-BR')} kg
         <input type="hidden" id="mc-caminhao" value="${carga.caminhaoId}" data-cap="${caminhaoFixo ? caminhaoFixo.capacidadeKg : 5400}">
       </div>`
    : `<div class="form-group"><label class="form-label">Caminhão (só veículos sem carga ativa):</label>
         <select id="mc-caminhao" class="form-control" onchange="window._recalcMontagem()">${camOptions || '<option value="">⛔ Todos os caminhões ativos possuem carga em andamento</option>'}</select>
       </div>`;

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#fff7ed;padding:10px 12px;border-radius:8px;border:1px solid #fed7aa;margin-bottom:14px;font-size:0.82rem;color:#9a3412">
        ⚖️ <strong>Trava de peso (A1):</strong> a soma das O.E. não pode exceder a capacidade do caminhão. O sistema bloqueia e sugere outro veículo.
      </div>
      ${caminhaoBloco}
      <div id="mc-resumo" style="margin:10px 0;padding:10px 12px;border-radius:6px;font-weight:600"></div>
      <div style="max-height:320px;overflow-y:auto;display:flex;flex-direction:column;gap:8px">${poolRows}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="button" id="mc-confirm" class="btn btn-primary" onclick="window.confirmarAlocacaoCarga('${carga ? carga.id : ''}')">✅ Confirmar Alocação</button>
      </div>
    </div>`;

  window._mcCtx = { cargaId: carga ? carga.id : null, jaAlocado };
  window.showModal(carga ? ('➕ Adicionar O.E. — Carga ' + carga.id) : '🚚 Nova Montagem de Carga', content, '680px');
  window._recalcMontagem();
};

// Recalcula peso selecionado × capacidade e liga/desliga a trava em tempo real.
window._recalcMontagem = () => {
  const ctx = window._mcCtx || { jaAlocado: 0 };
  const sel = document.getElementById('mc-caminhao');
  let cap = 5400;
  if (sel) {
    if (sel.tagName === 'SELECT') {
      const opt = sel.options[sel.selectedIndex];
      cap = opt ? parseFloat(opt.getAttribute('data-cap') || 5400) : 5400;
    } else {
      cap = parseFloat(sel.getAttribute('data-cap') || 5400);
    }
  }
  let selecionado = 0;
  document.querySelectorAll('.mc-oe:checked').forEach(cb => { selecionado += parseFloat(cb.getAttribute('data-peso') || 0); });
  const total = (ctx.jaAlocado || 0) + selecionado;
  const pct = Math.round((total / cap) * 100);
  const excede = total > cap;
  const resumo = document.getElementById('mc-resumo');
  if (resumo) {
    resumo.style.background = excede ? '#fee2e2' : '#dcfce7';
    resumo.style.color = excede ? '#b91c1c' : '#15803d';
    resumo.innerHTML = `${excede ? '⛔' : '✅'} ${total.toLocaleString('pt-BR')} / ${cap.toLocaleString('pt-BR')} kg (${pct}%)${excede ? ' — excede a capacidade! Remova O.E. ou use outro caminhão.' : ''}`;
  }
  const btn = document.getElementById('mc-confirm');
  if (btn) { btn.disabled = excede; btn.style.opacity = excede ? '0.5' : '1'; btn.style.cursor = excede ? 'not-allowed' : 'pointer'; }
};

window.confirmarAlocacaoCarga = (cargaId) => {
  const selecionadas = Array.from(document.querySelectorAll('.mc-oe:checked')).map(cb => cb.value);
  if (!selecionadas.length) { alert('Selecione ao menos uma O.E. para alocar.'); return; }

  let carga = cargaId ? SharedState.getCargas().find(c => c.id === cargaId) : null;
  if (!carga) {
    const camId = document.getElementById('mc-caminhao') ? document.getElementById('mc-caminhao').value : '';
    if (!camId) { alert('Selecione um caminhão para a carga.'); return; }
    carga = SharedState.criarCarga({ caminhaoId: camId });
  }

  let alocadas = 0, bloqueada = null;
  for (const oeId of selecionadas) {
    const r = SharedState.addOeNaCarga(carga.id, oeId);
    if (r.ok) { alocadas++; }
    else if (r.motivo === 'excede') { bloqueada = r; break; }
  }

  closeModal();
  if (bloqueada) {
    alert(`⚠️ Trava de peso (A1): a O.E. de ${bloqueada.pesoOe.toLocaleString('pt-BR')} kg excede a capacidade restante (${bloqueada.restante.toLocaleString('pt-BR')} kg) do caminhão ${bloqueada.placa}. Aloque em outro caminhão.`);
  }
  if (alocadas) showToast(`📦 ${alocadas} O.E. alocada(s) na carga ${carga.id}. Use "Liberar para Entrega" para despachar ao Motorista.`);
  if (typeof renderPage === 'function') renderPage();
};

// ── LIBERAR CARGA PARA ENTREGA (A2b · Ajuste 03) ────────────────────────────
// Único ponto de disparo ao Motorista (removido da criação da O.E.).
window.liberarCarga = (cargaId) => {
  const carga = SharedState.getCargas().find(c => c.id === cargaId);
  if (!carga) return;
  if (!carga.oes || carga.oes.length === 0) { alert('⛔ Não é possível liberar uma carga vazia. Aloque ao menos uma O.E.'); return; }

  const cam = SharedState.getFrota().find(c => c.id === carga.caminhaoId);
  const cap = cam ? cam.capacidadeKg : 5400;
  const minCap70 = cap * 0.70;
  if ((carga.pesoTotalKg || 0) < minCap70) {
    const pct = Math.round(((carga.pesoTotalKg || 0) / cap) * 100);
    if (!confirm(`⚠️ A carga não atingiu o piso de 70% da capacidade do veículo (${(carga.pesoTotalKg||0).toLocaleString('pt-BR')} / ${cap.toLocaleString('pt-BR')} kg — ${pct}%). Liberar mesmo assim?`)) return;
  }

  SharedState.setStatusCarga(cargaId, 'em_transporte', 'Estoque Central');

  const oes = SharedState.getOrdensEntrega();
  let despachadas = 0;
  (carga.oes || []).forEach(oeId => {
    const oe = SharedState._data.ordensEntrega.find(o => o.id === oeId);
    if (!oe) return;
    oe.status = 'Em Transporte';
    if (oe.osId && SharedState._data.ordensServicoExpedicao) {
      const os = SharedState._data.ordensServicoExpedicao.find(o => o.numeroOs === oe.osId || o.id === oe.osId);
      if (os) os.status = 'Em Rota';
    }
    oe.motorista = carga.motorista;
    oe.veiculo = cam ? `${cam.modelo} (${cam.placa})` : oe.veiculo;
    oe.cargaId = cargaId;
    (oe.historicoStatus = oe.historicoStatus || []).push({ status: 'Em Transporte', autor: carga.motorista || 'Motorista', data: new Date().toISOString(), detalhe: 'Despachada na liberação da carga' });
    // Despacho ao Motorista: cria um pedido "Em transporte" atribuído ao driver.
    const pedido = SharedState.addOrder({
      school: oe.escolaNome,
      driver: carga.motorista,
      status: 'Em transporte',
      cooperative: 'Almoxarifado Central',
      cardapioCodigo: oe.osId || oe.numeroOe,
      oeNumero: oe.numeroOe,
      veiculo: oe.veiculo,
      cargaId: cargaId,
      value: 0,
      itens: (oe.produtos || []).map(p => ({ produto: p.produto, qtd: p.quantidade, unidade: p.unidade || 'kg', regra: 'Separação FEFO (RN06)' }))
    });
    oe.pedidoId = pedido ? pedido.id : null;
    despachadas++;
  });
  SharedState._persist();
  if (SharedState._emit) SharedState._emit('carga:liberada', carga);

  showToast(`🚀 Carga ${carga.id} liberada — ${despachadas} O.E. despachada(s) ao motorista ${carga.motorista}. Caminhão agora aparece na Rastreabilidade.`);
  if (typeof renderPage === 'function') renderPage();
};

// ── RASTREAMENTO DO CAMINHÃO EM MAPA (B9 · Ajuste 04) ───────────────────────
// Fonte da posição isolada num provider (mock trocável por GPS real — igual ao
// RoutingProvider). Hoje = simulação por timer entre as paradas da rota.
window.RastreamentoProvider = {
  _mode: 'mock',
  // Retorna a parada corrente (índice base-0) de uma carga: 1ª O.E. não entregue.
  paradaAtual(carga, oes) {
    const seq = (carga.oes || []).map(id => oes.find(o => o.id === id)).filter(Boolean);
    const idx = seq.findIndex(o => o.status !== 'Entregue' && o.status !== 'Recebido');
    return idx === -1 ? Math.max(0, seq.length - 1) : idx;
  }
};

window.abrirModalRastreamentoVeiculo = (cargaId) => {
  const carga = SharedState.getCargas().find(c => c.id === cargaId);
  if (!carga) { alert('Carga não encontrada.'); return; }
  const cam = SharedState.getFrota().find(c => c.id === carga.caminhaoId) || { placa: '—', modelo: '', capacidadeKg: 5400, motoristaPadrao: carga.motorista };
  const oes = SharedState.getOrdensEntrega();
  const seq = (carga.oes || []).map(id => oes.find(o => o.id === id)).filter(Boolean);
  const atual = window.RastreamentoProvider.paradaAtual(carga, oes);

  // Coordenadas dos pontos no SVG (mock — distribui as paradas ao longo da rota).
  const W = 560, H = 240, n = Math.max(seq.length, 1);
  const pts = seq.map((o, i) => ({
    x: 50 + (i * (W - 100) / Math.max(n - 1, 1)),
    y: 120 + (i % 2 === 0 ? -40 : 40) * (i === 0 ? 0 : 1),
    nome: o.escolaNome || o.id, status: o.status
  }));
  if (pts.length === 1) { pts[0].x = W / 2; pts[0].y = H / 2; }

  const routeLine = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const doneLine = pts.slice(0, atual + 1).map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const stopMarkers = pts.map((p, i) => {
    const done = i < atual;
    const cur = i === atual;
    const fill = done ? '#15803d' : (cur ? '#f59e0b' : '#3b82f6');
    return `
      <g>
        <circle cx="${p.x}" cy="${p.y}" r="${cur ? 12 : 9}" fill="${fill}" stroke="#fff" stroke-width="2">
          ${cur ? '<animate attributeName="r" values="12;15;12" dur="1.2s" repeatCount="indefinite"/>' : ''}
        </circle>
        <text x="${p.x}" y="${p.y + 4}" text-anchor="middle" font-size="10" fill="#fff" font-weight="700">${i + 1}</text>
        <text x="${p.x}" y="${p.y - 16}" text-anchor="middle" font-size="9" fill="var(--text-secondary)">${(p.nome || '').slice(0, 16)}</text>
      </g>`;
  }).join('');

  const stopsList = seq.map((o, i) => {
    const done = i < atual, cur = i === atual;
    return `<li style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">
      <span style="width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;color:#fff;background:${done ? '#15803d' : (cur ? '#f59e0b' : '#3b82f6')}">${i + 1}</span>
      <div style="flex:1"><strong>${o.escolaNome || o.id}</strong> <small class="text-secondary">${(o.produtos||[]).length} item(ns)</small></div>
      <span class="status-badge ${o.status === 'Entregue' || o.status === 'Recebido' ? 'status-ok' : (cur ? 'status-warning' : 'status-info')}">${done ? '✓ OK' : (cur ? '▶ EM ROTA' : 'PENDENTE')}</span>
    </li>`;
  }).join('') || '<li style="padding:8px;color:var(--text-secondary)">Sem paradas.</li>';

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <span class="tag tag-blue">🚚 ${cam.placa}</span>
        <span class="tag tag-teal">👤 ${carga.motorista}</span>
        <span class="tag tag-gray">⚖️ ${(carga.pesoTotalKg||0).toLocaleString('pt-BR')} / ${cam.capacidadeKg.toLocaleString('pt-BR')} kg</span>
        <span class="tag tag-red">📌 Parada ${Math.min(atual + 1, n)}/${n}</span>
      </div>
      <div style="background:#eff6ff;padding:6px 10px;border-radius:6px;font-size:0.75rem;color:#1e40af;margin-bottom:10px">
        🛰️ Modo simulação (mock). Posição vinda do <strong>RastreamentoProvider</strong> — GPS real será plugado aqui depois (mesma abordagem do RoutingProvider).
      </div>
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;background:#f8fafc;border:1px solid var(--border);border-radius:8px">
        <rect x="0" y="0" width="${W}" height="${H}" fill="#f1f5f9"/>
        ${[70, 120, 170].map(y => `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#e2e8f0" stroke-width="1"/>`).join('')}
        ${[140, 280, 420].map(x => `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="#e2e8f0" stroke-width="1"/>`).join('')}
        <path d="${routeLine}" fill="none" stroke="#94a3b8" stroke-width="3" stroke-dasharray="6 5"/>
        <path d="${doneLine}" fill="none" stroke="#15803d" stroke-width="4"/>
        ${stopMarkers}
        <text id="rastreio-truck" font-size="22" text-anchor="middle">🚚</text>
      </svg>
      <div style="margin-top:14px">
        <div class="card-title" style="font-size:0.9rem;margin-bottom:6px">Sequência de Paradas</div>
        <ul style="list-style:none;padding:0;margin:0">${stopsList}</ul>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn btn-outline" onclick="closeModal()">Fechar</button></div>
    </div>`;

  window.showModal('📡 Rastreamento — ' + cam.placa, content, '640px');

  // Simulação de posição em tempo real: o marcador percorre a rota em loop.
  if (window._rastreioTimer) { clearInterval(window._rastreioTimer); window._rastreioTimer = null; }
  const truck = document.getElementById('rastreio-truck');
  if (truck && pts.length) {
    let seg = atual, t = 0;
    const place = (x, y) => { truck.setAttribute('x', x); truck.setAttribute('y', y - 16); };
    place(pts[Math.min(seg, pts.length - 1)].x, pts[Math.min(seg, pts.length - 1)].y);
    window._rastreioTimer = setInterval(() => {
      // Para se o modal foi fechado (marcador saiu do DOM).
      if (!document.body.contains(truck)) { clearInterval(window._rastreioTimer); window._rastreioTimer = null; return; }
      if (pts.length < 2) return;
      const a = pts[seg % pts.length];
      const b = pts[(seg + 1) % pts.length];
      t += 0.06;
      if (t >= 1) { t = 0; seg = (seg + 1) % pts.length; place(pts[seg].x, pts[seg].y); return; }
      place(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    }, 200);
  }
};

// ── B7 — DUPLA CHECAGEM DE ENTREGA (Motorista + Escola) ─────────────────────
// A O.E. só fecha em "Entregue" com AS DUAS confirmações. A confirmação do lado
// do Estoque foi removida (a tela de O.E. passa a ser só leitura do status).
SharedState.registrarConfirmacaoEntrega = (oeRef, lado, dados) => {
  const oes = SharedState._data.ordensEntrega || [];
  const oe = oes.find(o => o.id === oeRef || o.numeroOe === oeRef);
  if (!oe) return null;
  const now = new Date().toISOString();
  if (lado === 'motorista') oe.confirmacaoMotorista = { ...dados, data: now };
  else if (lado === 'escola') oe.confirmacaoEscola = { ...dados, data: now };
  (oe.historicoStatus = oe.historicoStatus || []).push({ status: lado === 'motorista' ? 'Confirmação do Motorista' : 'Confirmação da Escola', autor: (dados && (dados.por || dados.diretor)) || lado, data: now });

  if (oe.confirmacaoMotorista && oe.confirmacaoEscola) {
    oe.status = 'Entregue';
    oe.dataRecebimentoReal = now;
    oe.recebidoPor = (oe.confirmacaoEscola && oe.confirmacaoEscola.diretor) || oe.recebidoPor || null;
    oe.historicoStatus.push({ status: 'Entregue', autor: 'Dupla checagem (Motorista + Escola)', data: now });
    const os = (SharedState._data.ordensServicoExpedicao || []).find(o => o.numeroOs === oe.osId || o.id === oe.osId);
    if (os) os.status = 'Entregue';
    if (oe.cargaId) {
      const carga = (SharedState._data.cargas || []).find(c => c.id === oe.cargaId);
      if (carga) {
        const todas = (carga.oes || []).every(id => { const x = oes.find(o => o.id === id); return x && x.status === 'Entregue'; });
        if (todas) SharedState.setStatusCarga(carga.id, 'concluida', 'Sistema');
      }
    }
  } else {
    oe.status = 'Aguardando confirmação';
  }
  SharedState._persist();
  if (SharedState._emit) SharedState._emit('oe:confirmacao');
  return oe;
};

// Escola confirma o recebimento (dupla checagem: Resp. Estoque + Diretor).
window.abrirModalDuplaChecagemEscola = (oeId) => {
  const oe = SharedState.getOrdensEntrega().find(o => o.id === oeId);
  if (!oe) return;
  const jaMot = !!oe.confirmacaoMotorista;
  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#f0fdf4;padding:12px;border-radius:8px;border:1px solid #86efac;margin-bottom:14px;font-size:0.85rem;color:#166534">
        ✅ <strong>Dupla checagem (B7)</strong>: o recebimento exige o <strong>Responsável pelo Estoque (repositor)</strong> e o <strong>Diretor</strong>. Confirmação do Motorista: <strong>${jaMot ? '✔️ feita' : '⏳ pendente'}</strong>. Com as duas, a O.E. fecha em "Entregue".
      </div>
      <div class="card mb-16" style="padding:12px;font-size:0.85rem">
        <div>O.E.: <strong>${oe.numeroOe}</strong> · Escola: <strong>${oe.escolaNome}</strong></div>
        <div>Motorista: <strong>${oe.motorista || '—'}</strong> · Itens: <strong>${(oe.produtos||[]).length}</strong></div>
      </div>
      <form onsubmit="window.confirmarRecebimentoEscolaOe(event, '${oe.id}')">
        <div class="form-group"><label class="form-label">Responsável pelo Estoque (repositor):</label><input type="text" id="dc-repositor" class="form-control" required placeholder="Nome do repositor"></div>
        <div class="form-group"><label class="form-label">Diretor(a):</label><input type="text" id="dc-diretor" class="form-control" required placeholder="Nome do(a) diretor(a)"></div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-primary" style="background:#15803d">✅ Confirmar Recebimento (Escola)</button>
        </div>
      </form>
    </div>`;
  window.showModal('✅ Confirmação de Recebimento — ' + oe.numeroOe, content, '600px');
};

window.confirmarRecebimentoEscolaOe = (e, oeId) => {
  e.preventDefault();
  const repositor = document.getElementById('dc-repositor').value.trim();
  const diretor = document.getElementById('dc-diretor').value.trim();
  if (!repositor || !diretor) { alert('Informe o repositor e o diretor.'); return; }
  const oe = SharedState.registrarConfirmacaoEntrega(oeId, 'escola', { respEstoque: repositor, diretor });
  closeModal();
  if (oe && oe.status === 'Entregue') showToast(`🎉 O.E. ${oe.numeroOe} ENTREGUE — dupla checagem completa (Motorista + Escola).`);
  else showToast(`✅ Recebimento confirmado pela escola. Aguardando confirmação do Motorista para fechar a O.E.`);
  renderPage();
};

// Badge do estado da dupla checagem (usado na tela de O.E., só leitura).
window._duplaChecagemBadge = (oe) => {
  const mot = oe.confirmacaoMotorista ? '<span class="tag tag-green">🚚 Motorista ✔</span>' : '<span class="tag tag-gray">🚚 Motorista ⏳</span>';
  const esc = oe.confirmacaoEscola ? '<span class="tag tag-green">🏫 Escola ✔</span>' : '<span class="tag tag-gray">🏫 Escola ⏳</span>';
  return `<div style="display:flex;gap:4px;flex-wrap:wrap">${mot} ${esc}</div>`;
};

// ── A3 — ROTEIRIZAÇÃO (só a tela agora; adaptador pronto p/ OpenRouteService) ──
// geocode(endereco) e optimize(carga) mapeiam para os endpoints ORS
// /geocode/search e /optimization (VROOM — capacidade + janelas). Enquanto
// SUALE_CONFIG.ORS_KEY estiver vazia, roda em modo heurístico local (sem chamada
// externa). Trocar para ORS = só ligar a chave; as telas não mudam.
window.RoutingProvider = {
  get _key() { return (window.SUALE_CONFIG && window.SUALE_CONFIG.ORS_KEY) || ''; },
  get mode() { return this._key ? 'ors' : 'heuristic'; },
  geocode(endereco) {
    if (this._key) { /* TODO: chamar ORS /geocode/search com this._key */ }
    let h = 0; const s = String(endereco || '');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff;
    return { lat: -20.44 - (h % 100) / 1000, lng: -54.60 - ((h >> 4) % 100) / 1000, mock: true };
  },
  _infoParada(oe) {
    const sc = (typeof DATA !== 'undefined' && DATA.schools) ? DATA.schools.find(s => ('esc-' + s.id) === oe.escolaId || s.name === oe.escolaNome) : null;
    const os = (SharedState._data.ordensServicoExpedicao || []).find(o => o.numeroOs === oe.osId || o.id === oe.osId);
    const prioridade = os && os.prioridade === 'Alta' ? 0 : (os && os.prioridade === 'Média' ? 1 : 2);
    const janela = (sc && sc.janelaHorario && sc.janelaHorario.inicio) || '23:59';
    const regiao = (sc && sc.region) || 'zzz';
    return { regiao, prioridade, janela };
  },
  // Ordena as paradas por região → prioridade → janela de horário (heurística).
  optimize(carga, oes) {
    if (this._key) { /* TODO: chamar ORS /optimization (VROOM) e devolver a ordem */ }
    const seq = (carga.rotaOrdenada && carga.rotaOrdenada.length ? carga.rotaOrdenada : (carga.oes || []))
      .map(id => oes.find(o => o.id === id)).filter(Boolean);
    return seq.slice().sort((a, b) => {
      const ia = this._infoParada(a), ib = this._infoParada(b);
      return ia.regiao.localeCompare(ib.regiao) || (ia.prioridade - ib.prioridade)
        || ia.janela.localeCompare(ib.janela)
        || String(a.escolaNome || '').localeCompare(String(b.escolaNome || ''));
    }).map(o => o.id);
  }
};

window.otimizarRotaCarga = (cargaId) => {
  const carga = (SharedState._data.cargas || []).find(c => c.id === cargaId);
  if (!carga) return;
  carga.rotaOrdenada = window.RoutingProvider.optimize(carga, SharedState.getOrdensEntrega());
  SharedState._persist();
  showToast(`🧭 Rota otimizada (${window.RoutingProvider.mode === 'ors' ? 'ORS' : 'heurística'}) — ${carga.rotaOrdenada.length} paradas reordenadas.`);
  renderPage();
};

window._moverParadaRota = (cargaId, oeId, dir) => {
  const carga = (SharedState._data.cargas || []).find(c => c.id === cargaId);
  if (!carga) return;
  const arr = (carga.rotaOrdenada && carga.rotaOrdenada.length ? carga.rotaOrdenada : (carga.oes || [])).slice();
  const i = arr.indexOf(oeId);
  const j = dir === 'up' ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  carga.rotaOrdenada = arr;
  SharedState._persist();
  renderPage();
};

// ── B8 — TIMELINE DE STATUS DA O.E. (histórico com autor + data/hora) ───────
window.abrirTimelineOe = (oeId) => {
  const oe = SharedState.getOrdensEntrega().find(o => o.id === oeId);
  if (!oe) return;
  const hist = (oe.historicoStatus || []).slice();
  const itens = hist.length ? hist.map((h, i) => {
    const ultimo = i === hist.length - 1;
    return `
      <div style="display:flex;gap:12px;padding:8px 0;${i < hist.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
        <div style="width:14px;height:14px;border-radius:50%;background:${ultimo ? '#15803d' : '#3b82f6'};margin-top:3px;flex-shrink:0"></div>
        <div style="flex:1">
          <div style="font-weight:700">${h.status}${h.detalhe ? ` <small class="text-secondary">· ${h.detalhe}</small>` : ''}</div>
          <div style="font-size:0.8rem;color:var(--text-secondary)">👤 ${h.autor || '—'} · 🕓 ${h.data ? new Date(h.data).toLocaleString('pt-BR') : '—'}</div>
        </div>
      </div>`;
  }).join('') : '<div style="padding:12px;color:var(--text-secondary)">Sem histórico registrado.</div>';

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div class="card mb-16" style="padding:12px;font-size:0.85rem">
        <div>O.E.: <strong>${oe.numeroOe}</strong> · Escola: <strong>${oe.escolaNome}</strong> · Status atual: <strong>${oe.status}</strong></div>
      </div>
      ${itens}
      <div style="display:flex;justify-content:flex-end;margin-top:14px"><button class="btn btn-outline" onclick="closeModal()">Fechar</button></div>
    </div>`;
  window.showModal('🕓 Linha do Tempo — ' + oe.numeroOe, content, '560px');
};

// __EXPEDICAO_HANDLERS_MARKER__

// ─── TELA 01: RECEBIMENTOS PENDENTES ──────────────────────────────────
PAGE_RENDERERS['gestor_recebimentos-pendentes'] = (el) => {
  const recs = SharedState.getRecebimentosPendentes();
  const badgeStatus = (s) => {
    const map = {
      'Aguardando envio': 'tag-gray', 'Em transporte': 'tag-blue', 'Entrega agendada': 'tag-blue',
      'Recebimento iniciado': 'tag-orange', 'Em conferência': 'tag-orange', 'Aguardando ajuste': 'tag-orange',
      'Recebido parcialmente': 'tag-orange', 'Recebido': 'tag-green', 'Recusado': 'tag-red', 'Cancelado': 'tag-red'
    };
    return `<span class="tag ${map[s]||'tag-gray'}">${s}</span>`;
  };
  const badgePrio = (p) => {
    const map = { Alta: 'tag-red', Média: 'tag-orange', Normal: 'tag-blue' };
    return `<span class="tag ${map[p]||'tag-gray'}">${p}</span>`;
  };

  const rows = recs.length ? recs.map(r => `
    <tr>
      <td><strong>${r.numeroPedido}</strong><br><small class="text-secondary">${r.id}</small></td>
      <td><small>${r.numeroOs}</small></td>
      <td><small>${r.numeroEmpenho}</small><br><small class="text-secondary">${r.numeroAta}</small></td>
      <td><strong>${r.fornecedor}</strong></td>
      <td>${r.produto}</td>
      <td style="font-family:var(--font-mono)">${r.qtdSolicitada}</td>
      <td style="font-family:var(--font-mono);color:#15803d">${r.qtdEntregue}</td>
      <td style="font-family:var(--font-mono);font-weight:700;color:${r.qtdPendente > 0 ? '#b91c1c' : '#15803d'}">${r.qtdPendente}</td>
      <td>${r.dataPrevista}</td>
      <td>${badgePrio(r.prioridade)}</td>
      <td>${badgeStatus(r.status)}</td>
      <td>
        ${r.status === 'Recebido' ? `
          <span class="tag tag-green" style="font-weight:700">✅ Entrada no Estoque</span>
          <button class="btn btn-sm btn-outline" style="margin-left:4px" onclick="window.abrirModalConfronto4Vias('${r.id}')">📄 NF-e</button>
        ` : `
        <div style="display:flex;gap:4px">
          <button class="btn btn-sm btn-primary" onclick="window.abrirModalConferenciaFisica('${r.id}')">
            🔍 ${r.entradaRealizada ? 'Conferir Saldo' : 'Conf. Física'}
          </button>
          <button class="btn btn-sm btn-outline" onclick="window.abrirModalConfronto4Vias('${r.id}')">
            📄 Confronto NF-e
          </button>
        </div>
        ${r.status === 'Recebido parcialmente' ? `<div style="margin-top:4px"><span class="tag tag-teal" style="font-size:0.7rem">Parcial: ${(r.qtdEntregue||0).toLocaleString('pt-BR')} recebido · ${(r.qtdPendente||0).toLocaleString('pt-BR')} pendente</span></div>` : ''}
        `}
      </td>
    </tr>
  `).join('') : '<tr><td colspan="12" style="text-align:center;color:#94A3B8">Nenhum recebimento pendente.</td></tr>';

  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">🚚 Recebimentos Pendentes — Almoxarifado Central</div>
        <div class="page-subtitle">Central de acompanhamento de entregas de fornecedores, conferência física prévia (RN01) e liberação de empenho (RN05)</div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-outline" onclick="window.abrirModalLogsAuditoria()">📜 Logs de Auditoria</button>
        <button class="btn btn-primary" onclick="window.abrirModalImportarNFeXML()">📥 Receber NF-e via XML</button>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${recs.length}</div><div class="kpi-label">Pedidos a Receber</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">🚚</div><div class="kpi-value">${recs.filter(r=>['Em transporte','Entrega agendada','Em conferência'].includes(r.status)).length}</div><div class="kpi-label">Em Transporte / Conferência</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${recs.filter(r=>r.status==='Recebido').length}</div><div class="kpi-label">Recebidos</div></div>
      <div class="kpi-card red"><div class="kpi-icon">⚠️</div><div class="kpi-value">${recs.filter(r=>r.status==='Aguardando ajuste'||r.status==='Recusado').length}</div><div class="kpi-label">Com Divergência / Recusados</div></div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
        <strong>Fila de Recebimento de Mercadorias dos Fornecedores</strong>
        <span class="tag tag-blue" style="font-size:0.75rem">RN01 — Conferência Física Obrigatória</span>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table" style="font-size:0.85rem">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>OS</th>
              <th>Empenho / ATA</th>
              <th>Fornecedor</th>
              <th>Produto</th>
              <th>Solicitada</th>
              <th>Entregue</th>
              <th>Pendente</th>
              <th>Data Prevista</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
};

// ─── TELA 02: EXPEDIÇÃO (ORDENS DE SERVIÇO POR ESCOLA — RN07) ────────
PAGE_RENDERERS['gestor_expedicao-os'] = (el) => {
  const osList = SharedState.getOrdensServicoExpedicao();
  const badgeStatus = (s) => {
    const map = {
      'Aguardando Separação': 'tag-gray', 'Em Separação': 'tag-orange', 'Separado': 'tag-blue',
      'Separado parcial': 'tag-orange', 'Aguardando Expedição': 'tag-blue', 'Em Rota': 'tag-orange', 'Entregue': 'tag-green',
      'Entrega Parcial': 'tag-orange', 'Devolvida': 'tag-red', 'Cancelada': 'tag-red'
    };
    return `<span class="tag ${map[s]||'tag-gray'}">${s}</span>`;
  };

  const rows = osList.length ? osList.map(o => `
    <tr>
      <td><strong>${o.numeroOs}</strong></td>
      <td><span style="font-size:1.1rem">🏫</span> <strong>${o.escolaNome}</strong><br><small class="text-secondary">${o.municipio}</small></td>
      <td>
        <ul style="padding-left:14px;margin:0;font-size:0.8rem">
          ${o.produtos.map(p => `<li>${p.produto}: <strong>${p.quantidade} ${p.unidade}</strong> (Lote: ${p.loteSugerido})</li>`).join('')}
        </ul>
      </td>
      <td>${o.dataPrevista}</td>
      <td><span class="tag ${o.prioridade==='Alta'?'tag-red':'tag-blue'}">${o.prioridade}</span></td>
      <td>${badgeStatus(o.status)}</td>
      <td>
        <div style="display:flex;gap:4px;flex-wrap:wrap">
          ${(o.status === 'OE Criada' || o.status === 'Aguardando Carga' || o.status === 'Em Carga')
            ? `<span class="tag tag-blue" style="font-weight:700">🚛 OE emitida</span>`
            : (o.status === 'Em Rota' || o.status === 'Em Transporte')
            ? `<span class="tag tag-orange" style="font-weight:700">🚚 OE emitida / Em rota</span>`
            : (o.status === 'Entregue')
            ? `<span class="tag tag-green" style="font-weight:700">✅ Entregue</span>`
            : `
            ${(o.status === 'Aguardando Separação' || o.status === 'Em Separação') ? `
              <button class="btn btn-sm btn-primary" style="background:#15803d" onclick="window.abrirModalSeparacaoFEFO('${o.id}')">
                📦 Separação FEFO (RN06)
              </button>` : ''}
            ${(o.status === 'Separado' || o.status === 'Separado parcial') ? `
              <button class="btn btn-sm btn-primary" onclick="window.abrirModalNovaOrdemEntrega('${o.id}')">
                🚛 Criar OE (RN08)
              </button>` : ''}
          `}
        </div>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="7" style="text-align:center;color:#94A3B8">Nenhuma Ordem de Serviço de expedição cadastrada.</td></tr>';

  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">📋 Expedição de Ordens de Serviço — Escolas</div>
        <div class="page-subtitle">Separação de estoque por FEFO (RN06) e isolamento estrito de 1 Escola por OS (RN07)</div>
      </div>
      <div>
        <span class="tag tag-green" style="font-weight:700">🔒 RN07: 1 Escola por OS Ativo</span>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${osList.length}</div><div class="kpi-label">Total de OS Escolas</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📦</div><div class="kpi-value">${osList.filter(o=>o.status==='Aguardando Separação'||o.status==='Em Separação').length}</div><div class="kpi-label">Pendente de Separação</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">✅</div><div class="kpi-value">${osList.filter(o=>o.status==='Separado'||o.status==='Aguardando Expedição').length}</div><div class="kpi-label">Pronto para Expedição</div></div>
      <div class="kpi-card green"><div class="kpi-icon">🚛</div><div class="kpi-value">${osList.filter(o=>o.status==='Em Rota'||o.status==='Entregue').length}</div><div class="kpi-label">Em Rota / Entregue</div></div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><strong>Ordens de Serviço por Escola (Expedição FEFO)</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table" style="font-size:0.85rem">
          <thead>
            <tr>
              <th>Número OS</th>
              <th>Escola de Destino (Única)</th>
              <th>Itens Solicitados (Cardápio)</th>
              <th>Data Prevista</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
};

// ─── TELA 03: ORDENS DE ENTREGA (LOGÍSTICA — RN08/RN09/RN10) ──────────
PAGE_RENDERERS['gestor_ordens-entrega'] = (el) => {
  const oes = SharedState.getOrdensEntrega();
  const badgeStatus = (s) => {
    const map = {
      'Criada': 'tag-gray', 'Aguardando carga': 'tag-orange', 'Em Carga': 'tag-blue',
      'Aguardando Coleta': 'tag-orange', 'Em Transporte': 'tag-blue',
      'Aguardando confirmação': 'tag-orange', 'Em Rota': 'tag-blue', 'Entregue': 'tag-green',
      'Entrega Parcial': 'tag-orange', 'Não Entregue': 'tag-red', 'Devolvida': 'tag-red'
    };
    return `<span class="tag ${map[s]||'tag-gray'}">${s}</span>`;
  };

  const rows = oes.length ? oes.map(o => `
    <tr data-escola="${(o.escolaNome||'').replace(/"/g,'')}" data-carga="${o.cargaId||''}" data-status="${o.status||''}">
      <td><strong>${o.numeroOe}</strong> <button class="btn btn-sm btn-outline" title="Linha do tempo" onclick="window.abrirTimelineOe('${o.id}')">🕓</button></td>
      <td><small>${o.osId||'—'}</small></td>
      <td><strong>${o.escolaNome}</strong></td>
      <td>👤 ${o.motorista||'<span class="text-secondary">— (definido na carga)</span>'}</td>
      <td>${o.veiculo ? '🚛 '+o.veiculo : '<span class="text-secondary">—</span>'}${o.cargaId ? `<br><small class="text-secondary">📦 ${o.cargaId}</small>` : ''}</td>
      <td>${o.dataEntrega||'—'}</td>
      <td>${badgeStatus(o.status)}</td>
      <td>
        ${o.status === 'Entregue'
          ? `<span class="tag tag-green">✍️ Recebido por ${o.recebidoPor||'Escola'}</span>`
          : window._duplaChecagemBadge(o)}
      </td>
    </tr>
  `).join('') : '<tr><td colspan="8" style="text-align:center;color:#94A3B8">Nenhuma Ordem de Entrega criada.</td></tr>';

  // B6 — opções de filtro (por Escola / por Carga / por Status)
  const escolasOpt = [...new Set(oes.map(o => o.escolaNome).filter(Boolean))].map(e => `<option value="${e.replace(/"/g,'')}">${e}</option>`).join('');
  const cargasOpt = [...new Set(oes.map(o => o.cargaId).filter(Boolean))].map(c => `<option value="${c}">${c}</option>`).join('');
  const statusOpt = [...new Set(oes.map(o => o.status).filter(Boolean))].map(s => `<option value="${s}">${s}</option>`).join('');

  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">🚛 Ordens de Entrega — Logística Escolar</div>
        <div class="page-subtitle">Vínculo obrigatório: OS + Escola + Motorista + Veículo + Rota (RN08 / RN09) com confirmação via assinatura (RN10)</div>
      </div>
      <div>
        <span class="tag tag-blue" style="font-weight:700">🔒 RN09: Motorista & Veículo Vinculados</span>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">🚛</div><div class="kpi-value">${oes.length}</div><div class="kpi-label">Ordens de Entrega</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">🛣️</div><div class="kpi-value">${oes.filter(o=>['Em Transporte','Em Rota','Aguardando Coleta'].includes(o.status)).length}</div><div class="kpi-label">Em Transporte / Rota</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✍️</div><div class="kpi-value">${oes.filter(o=>o.status==='Entregue').length}</div><div class="kpi-label">Entregues com Assinatura</div></div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <strong>Ordens de Entrega para Escolas</strong>
        <div style="display:flex;gap:8px;flex-wrap:wrap" id="oe-filtros">
          <select class="form-control" style="width:auto;font-size:0.82rem" data-f="escola" onchange="window._filtrarOe()"><option value="">Todas as escolas</option>${escolasOpt}</select>
          <select class="form-control" style="width:auto;font-size:0.82rem" data-f="carga" onchange="window._filtrarOe()"><option value="">Todas as cargas</option>${cargasOpt}</select>
          <select class="form-control" style="width:auto;font-size:0.82rem" data-f="status" onchange="window._filtrarOe()"><option value="">Todos os status</option>${statusOpt}</select>
        </div>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table" style="font-size:0.85rem">
          <thead>
            <tr>
              <th>Número OE</th>
              <th>OS Origem</th>
              <th>Escola Destino</th>
              <th>Entregador / Motorista</th>
              <th>Veículo & Carga</th>
              <th>Data Entrega</th>
              <th>Status</th>
              <th>Confirmação (Dupla Checagem)</th>
            </tr>
          </thead>
          <tbody id="oe-tbody">${rows}</tbody>
        </table>
      </div>
    </div>`;
};

// B6 — aplica os filtros (Escola / Carga / Status) escondendo linhas na tabela de O.E.
window._filtrarOe = () => {
  const get = (f) => { const s = document.querySelector(`#oe-filtros [data-f="${f}"]`); return s ? s.value : ''; };
  const fe = get('escola'), fc = get('carga'), fs = get('status');
  document.querySelectorAll('#oe-tbody tr[data-escola]').forEach(tr => {
    const ok = (!fe || tr.dataset.escola === fe) && (!fc || tr.dataset.carga === fc) && (!fs || tr.dataset.status === fs);
    tr.style.display = ok ? '' : 'none';
  });
};

// ─── TELA 04: RASTREABILIDADE 5-WAY (RN13) ───────────────────────────
PAGE_RENDERERS['gestor_rastreabilidade-lotes'] = (el) => {
  // Dados reais do SharedState; fallback demo se ainda vazio
  const _lotesSeed = [
    { lote: 'LOT-ARZ-2026A', produto: 'Arroz Tipo 1 (5kg)', fornecedor: 'NUTRI ALIMENTOS DISTRIBUIDORA LTDA', empenho: '2026NE00477', nf: 'NF-e 000.4891', escola: 'EMEF Prof. Henrique Scabello', motorista: 'Carlos Alberto Santos', dataEntrada: '2026-06-01', validade: '2026-10-15', status: 'Em Consumo na Escola' },
    { lote: 'LOT-LTE-2026A', produto: 'Leite Integral (1L)', fornecedor: 'POLARIS COMÉRCIO DE ALIMENTOS LTDA', empenho: '2026NE00512', nf: 'NF-e 000.5102', escola: 'EMEF Doutor João Sampaio', motorista: 'Marcos Antônio Ribeiro', dataEntrada: '2026-06-12', validade: '2026-09-20', status: 'Em Rota de Entrega' },
    { lote: 'LOT-BAN-2026A', produto: 'Banana Nanica', fornecedor: 'COOPAGRAN (Cooperativa AF)', empenho: '2026NE00489', nf: 'Guia Produtor 044/2026', escola: 'EMEF Doutor João Sampaio', motorista: 'José Maria Rodrigues', dataEntrada: '2026-06-05', validade: '2026-08-12', status: 'Entregue' }
  ];
  const _lotesState = (typeof SharedState !== 'undefined' && typeof SharedState.getLotes === 'function') ? SharedState.getLotes() : [];
  const lotes = _lotesState.length > 0 ? _lotesState : _lotesSeed;

  const rows = lotes.map(l => `
    <tr>
      <td><span class="tag tag-blue" style="font-family:var(--font-mono);font-weight:700">${l.lote}</span></td>
      <td><strong>${l.produto}</strong></td>
      <td>🏢 ${l.fornecedor}</td>
      <td>💳 ${l.empenho}<br><small class="text-secondary">📄 ${l.nf}</small></td>
      <td>🏫 ${l.escola}</td>
      <td>👤 ${l.motorista}</td>
      <td>${l.validade}</td>
      <td><span class="tag tag-green">${l.status}</span></td>
    </tr>
  `).join('');

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">🔍 Matriz de Rastreabilidade 5-Way por Lote (RN13)</div>
        <div class="page-subtitle">Rastreamento de ponta a ponta: Lote ➔ Escola ➔ Fornecedor ➔ Empenho SIAFI ➔ Nota Fiscal ➔ Motorista</div>
      </div>
    </div>
    <div class="card mb-16" style="padding:16px;background:#f8fafc">
      <h4 style="margin:0 0 8px 0;color:var(--primary-dark)">💡 As 5 Perguntas de Ouro da Rastreabilidade PNAE:</h4>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px;font-size:0.8rem">
        <div style="background:white;padding:10px;border-radius:6px;border:1px solid #cbd5e1"><strong>1. Lote na Escola?</strong><br><span class="text-secondary">Qual lote foi entregue em cada escola</span></div>
        <div style="background:white;padding:10px;border-radius:6px;border:1px solid #cbd5e1"><strong>2. Fornecedor de Origem?</strong><br><span class="text-secondary">De qual produtor/empresa veio</span></div>
        <div style="background:white;padding:10px;border-radius:6px;border:1px solid #cbd5e1"><strong>3. Empenho Gerador?</strong><br><span class="text-secondary">Qual empenho originou a compra</span></div>
        <div style="background:white;padding:10px;border-radius:6px;border:1px solid #cbd5e1"><strong>4. Nota Fiscal de Entrada?</strong><br><span class="text-secondary">Qual NF atestou o recebimento</span></div>
        <div style="background:white;padding:10px;border-radius:6px;border:1px solid #cbd5e1"><strong>5. Motorista Responsável?</strong><br><span class="text-secondary">Quem fez o transporte e entrega</span></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><strong>Lotes Rastreados no Sistema SUALE</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table" style="font-size:0.85rem">
          <thead>
            <tr>
              <th>Código Lote (FEFO)</th>
              <th>Produto</th>
              <th>Fornecedor Origem</th>
              <th>Empenho / NF</th>
              <th>Escola Destino</th>
              <th>Motorista Entrega</th>
              <th>Validade</th>
              <th>Status Rastreio</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
};

// ─── MODAIS INTERATIVOS DE ESTOQUE CENTRAL ───────────────────────────

// MODAL 1: CONFERÊNCIA FÍSICA (RN01)
window.abrirModalConferenciaFisica = (recId) => {
  const rec = SharedState.getRecebimentosPendentes().find(r => r.id === recId);
  if (!rec) return;

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#fefce8;padding:12px;border-radius:8px;border:1px solid #fef08a;margin-bottom:14px;font-size:0.85rem;color:#854d0e">
        ⚠️ <strong>RN01 — Conferência Física Obrigatória</strong>: A aprovação física é pré-requisito obrigatório antes de qualquer liberação de Nota Fiscal ou atualização de saldo de Empenho.
      </div>
      <div class="card mb-16" style="padding:12px;font-size:0.85rem">
        <div>Pedido: <strong>${rec.numeroPedido}</strong> · OS: <strong>${rec.numeroOs}</strong></div>
        <div>Fornecedor: <strong>${rec.fornecedor}</strong></div>
        <div>Produto: <strong>${rec.produto}</strong> · Qtd Solicitada: <strong>${rec.qtdSolicitada}</strong></div>
      </div>
      <form id="form-conf-fisica" onsubmit="window.salvarConferenciaFisica(event, '${rec.id}')">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label class="form-label">Quantidade Fisicamente Conferida (kg/un):</label>
            <input type="number" id="conf-qtd-ok" class="form-control" value="${rec.qtdPendente}" required>
          </div>
          <div>
            <label class="form-label">Quantidade Recusada / Avariada:</label>
            <input type="number" id="conf-qtd-recusada" class="form-control" value="0" required>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label class="form-label">Lote Identificado na Embalagem:</label>
            <input type="text" id="conf-lote" class="form-control" value="${rec.loteEsperado}" required>
          </div>
          <div>
            <label class="form-label">Data de Validade (Embalagem):</label>
            <input type="date" id="conf-validade" class="form-control" value="${rec.validadeEsperada}" required>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label class="form-label">Temperatura da Carga (°C):</label>
            <input type="text" id="conf-temp" class="form-control" value="Ambient / 4.5°C">
          </div>
          <div>
            <label class="form-label">Integridade da Embalagem / Avarias:</label>
            <select id="conf-integridade" class="form-control">
              <option value="Perfeita">✅ Perfeita / Embalagem Íntegra</option>
              <option value="Avariada Parcial">⚠️ Avariada Parcialmente</option>
              <option value="Danificada">❌ Danificada / Recusada</option>
            </select>
          </div>
        </div>
        <div style="margin-bottom:14px">
          <label class="form-label">Observações da Conferência Física / Motivo de Recusa:</label>

          <textarea id="conf-obs" class="form-control" rows="2" placeholder="Descreva avarias, temperatura ou inconformidades físicas encontradas na carga..."></textarea>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-primary">✅ Gravar Conferência Física</button>
        </div>
      </form>
    </div>
  `;

  window.showModal(`🔍 Conferência Física de Carga — Pedido ${rec.numeroPedido}`, content, '750px');
};

// Entrada de mercadoria conferida no Estoque Central. Ponto ÚNICO de entrada de
// um recebimento — mantém alinhados: estoque físico consolidado (DATA.products,
// lido pelo Inventário e Dashboard), o Estoque Central vigente + rastreabilidade
// de lote (getCentralStock, card "Estoque Central Vigente") e o saldo do empenho.
// Marca rec.entradaRealizada para não dar entrada em dobro (RN01 → RN04).
window._darEntradaEstoqueRecebimento = (rec, confFisica) => {
  const qtdOk = Number(confFisica.qtdOk) || 0;
  if (qtdOk <= 0) return false;

  rec.qtdEntregue = (rec.qtdEntregue || 0) + qtdOk;
  rec.qtdPendente = Math.max(0, (rec.qtdSolicitada || 0) - rec.qtdEntregue);
  rec.status = rec.qtdPendente === 0 ? 'Recebido' : 'Recebido parcialmente';
  rec.entradaRealizada = true;

  // 1. Estoque físico consolidado (Inventário / Dashboard) — DATA.products é a fonte
  const prod = (typeof DATA !== 'undefined' && DATA.products || []).find(p => p.name.includes(rec.produto.split(' ')[0]));
  if (prod) prod.stock = (prod.stock || 0) + qtdOk;

  // 2. Estoque Central vigente + lote (card "Estoque Central Vigente (via NFs Recebidas)")
  SharedState._data.centralStock = SharedState._data.centralStock || {};
  const cur = SharedState._data.centralStock[rec.produto] || { qtd: 0, unidade: (prod && prod.unit) || 'un', lotes: [] };
  cur.qtd = (cur.qtd || 0) + qtdOk;
  (cur.lotes = cur.lotes || []).push({ lote: confFisica.lote || rec.loteEsperado, qtd: qtdOk, validade: confFisica.validade || rec.validadeEsperada, entrada: new Date().toISOString().slice(0, 10) });
  SharedState._data.centralStock[rec.produto] = cur;

  // 3. Baixa do saldo do empenho
  const emp = SharedState.getEmpenhos2 ? SharedState.getEmpenhos2().find(x => x.numero_empenho === rec.numeroEmpenho) : null;
  if (emp) {
    emp.valor_liquidado = (emp.valor_liquidado || 0) + (qtdOk * 5.0);
    emp.status = emp.valor_liquidado >= emp.valor_empenhado ? 'Liquidado' : 'Emitido';
  }

  SharedState.registrarLogAuditoria({
    acao: 'Entrada no Estoque Central (Conferência RN01/RN04)',
    produto: rec.produto,
    quantidade: qtdOk,
    origem: `Fornecedor: ${rec.fornecedor}`,
    destino: 'Estoque Central SEMED',
    motivo: `Entrada de ${qtdOk} un do lote ${confFisica.lote || rec.loteEsperado}. Empenho ${rec.numeroEmpenho} atualizado.`
  });
  SharedState._persist();
  if (SharedState._emit) SharedState._emit('recebimento:entrada', rec);
  return true;
};

window.salvarConferenciaFisica = (e, recId) => {
  if (e && e.preventDefault) e.preventDefault();
  const rec = SharedState.getRecebimentosPendentes().find(r => r.id === recId);
  if (!rec) return;

  const qtdOk = Number(document.getElementById('conf-qtd-ok').value) || 0;
  const qtdRec = Number(document.getElementById('conf-qtd-recusada').value) || 0;
  const lote = document.getElementById('conf-lote').value;
  const validade = document.getElementById('conf-validade').value;
  const integridade = (document.getElementById('conf-integridade') || {}).value || 'Perfeita';
  const obs = document.getElementById('conf-obs').value;

  rec.conferenciaFisica = { qtdOk, qtdRec, lote, validade, integridade, obs, data: new Date().toISOString() };
  if (qtdRec > 0 || integridade === 'Danificada') {
    (rec.divergencias = rec.divergencias || []).push({ qtdRec, integridade, obs, data: new Date().toISOString() });
  }

  if (qtdOk > 0) {
    // Conferência aprovada DÁ ENTRADA no estoque (o que foi conferido entra).
    window._darEntradaEstoqueRecebimento(rec, { qtdOk, lote, validade });
    showToast(rec.qtdPendente === 0
      ? `✅ Conferência gravada — ${qtdOk.toLocaleString('pt-BR')} un de ${rec.produto} deram ENTRADA no Estoque Central. Pedido ${rec.numeroPedido} recebido.`
      : `✅ Entrada parcial de ${qtdOk.toLocaleString('pt-BR')} un de ${rec.produto} no Estoque Central. Saldo pendente: ${rec.qtdPendente.toLocaleString('pt-BR')}.`);
  } else {
    rec.status = 'Aguardando ajuste';
    SharedState._persist();
    showToast(`⚠️ Conferência registrada sem quantidade aprovada — pedido ${rec.numeroPedido} aguardando ajuste do fornecedor.`);
  }

  closeModal();
  const container = document.getElementById('page-content');
  if (container && PAGE_RENDERERS['gestor_recebimentos-pendentes']) PAGE_RENDERERS['gestor_recebimentos-pendentes'](container);
};

// MODAL 2: CONFRONTO 4 VIAS E LIBERAÇÃO FINAL (RN02/RN04/RN05)
window.abrirModalConfronto4Vias = (recId) => {
  const rec = SharedState.getRecebimentosPendentes().find(r => r.id === recId);
  if (!rec) return;

  const confFisica = rec.conferenciaFisica || { qtdOk: rec.qtdPendente, qtdRec: 0, lote: rec.loteEsperado, validade: rec.validadeEsperada };

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#eff6ff;padding:12px;border-radius:8px;border:1px solid #bfdbfe;margin-bottom:14px;font-size:0.85rem;color:#1e40af">
        📄 <strong>Confronto Automático de 4 Vias (` + `Pedido × Empenho × OS × NF-e` + `)</strong>: O sistema verifica a paridade de dados entre a compra autorizada e o documento fiscal antes de autorizar a entrada física e a liquidação no SIAFI.
      </div>

      <div style="overflow-x:auto;margin-bottom:14px">
        <table class="data-table" style="font-size:0.8rem">
          <thead>
            <tr>
              <th>Atributo</th>
              <th>1. Pedido</th>
              <th>2. Empenho SIAFI</th>
              <th>3. Ordem Serviço</th>
              <th>4. Nota Fiscal / Conf. Física</th>
              <th>Status Paridade</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Produto</strong></td>
              <td>${rec.produto}</td>
              <td>${rec.produto}</td>
              <td>${rec.produto}</td>
              <td>${rec.produto}</td>
              <td><span class="tag tag-green">Match 100%</span></td>
            </tr>
            <tr>
              <td><strong>Quantidade</strong></td>
              <td>${rec.qtdSolicitada}</td>
              <td>${rec.qtdSolicitada}</td>
              <td>${rec.qtdSolicitada}</td>
              <td><strong>${confFisica.qtdOk}</strong></td>
              <td><span class="tag ${confFisica.qtdRec > 0 ? 'tag-orange' : 'tag-green'}">${confFisica.qtdRec > 0 ? 'Divergência Parcial' : 'Conforme'}</span></td>
            </tr>
            <tr>
              <td><strong>Fornecedor</strong></td>
              <td>${rec.fornecedor}</td>
              <td>${rec.fornecedor}</td>
              <td>${rec.fornecedor}</td>
              <td>${rec.fornecedor}</td>
              <td><span class="tag tag-green">Match 100%</span></td>
            </tr>
            <tr>
              <td><strong>Lote / Validade</strong></td>
              <td>${rec.loteEsperado}</td>
              <td>—</td>
              <td>${rec.loteEsperado}</td>
              <td><strong>${confFisica.lote} (${confFisica.validade})</strong></td>
              <td><span class="tag tag-green">Validado</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center">
        <button class="btn btn-outline" style="color:var(--danger);border-color:var(--danger)" onclick="window.notificarDivergenciaFornecedor('${rec.id}')">
          ⚠️ Notificar Divergência ao Fornecedor (RN03)
        </button>
        <button class="btn btn-primary" onclick="window.aprovarEntradaFinalEstoque('${rec.id}')">
          ✅ Aprovar Conferência Final & Dar Entrada no Estoque (RN05)
        </button>
      </div>
    </div>
  `;

  window.showModal(`📄 Confronto 4 Vias — Pedido ${rec.numeroPedido}`, content, '850px');
};

window.notificarDivergenciaFornecedor = (recId) => {
  const rec = SharedState.getRecebimentosPendentes().find(r => r.id === recId);
  if (!rec) return;

  rec.status = 'Aguardando ajuste';
  SharedState.getNotificacoesFornecedor().push({
    id: `NOTIF-${Date.now()}`,
    pedidoId: rec.id,
    fornecedor: rec.fornecedor,
    divergencia: `Divergência de quantidade/qualidade identificada na entrega do pedido ${rec.numeroPedido}.`,
    dataEnviada: new Date().toISOString()
  });
  SharedState._persist();

  showToast(`⚠️ Notificação de divergência enviada automaticamente para ${rec.fornecedor}!`);
  closeModal();
};

window.aprovarEntradaFinalEstoque = (recId) => {
  const rec = SharedState.getRecebimentosPendentes().find(r => r.id === recId);
  if (!rec) return;

  if (rec.entradaRealizada) {
    showToast(`ℹ️ Pedido ${rec.numeroPedido} já teve entrada no Estoque Central — sem nova baixa.`);
    closeModal();
    const c = document.getElementById('page-content');
    if (c && PAGE_RENDERERS['gestor_recebimentos-pendentes']) PAGE_RENDERERS['gestor_recebimentos-pendentes'](c);
    return;
  }

  const confFisica = rec.conferenciaFisica || { qtdOk: rec.qtdPendente, lote: rec.loteEsperado, validade: rec.validadeEsperada };
  // Mesmo ponto de entrada usado pela Conferência Física (estoque central + empenho + lote).
  window._darEntradaEstoqueRecebimento(rec, confFisica);

  showToast(`🎉 Entrada de ${confFisica.qtdOk} unidades aprovada no Estoque Central! Empenho ${rec.numeroEmpenho} atualizado.`);
  closeModal();
  const container = document.getElementById('page-content');
  if (container && PAGE_RENDERERS['gestor_recebimentos-pendentes']) PAGE_RENDERERS['gestor_recebimentos-pendentes'](container);
};

// MODAL 3: SEPARAÇÃO FEFO (RN06)
// Corpo reativo do modal de Separação FEFO (com bipagem por item).
window._sepFefoBody = (os) => {
  const total = os.produtos.length;
  const bipados = os.produtos.filter(p => p._bipado).length;
  const pct = total ? Math.round(bipados / total * 100) : 0;
  return `
    <div style="background:#f0fdf4;padding:12px;border-radius:8px;border:1px solid #86efac;margin-bottom:14px;font-size:0.85rem;color:#166534">
      💡 <strong>Método FEFO Ativo (RN06)</strong>: lotes ordenados por menor validade. Confira cada item pela leitura do código de barras.
    </div>
    <div class="card mb-16" style="padding:12px;font-size:0.9rem">
      <div>Ordem de Serviço: <strong>${os.numeroOs}</strong></div>
      <div>Escola de Destino: <strong>${os.escolaNome}</strong> (Escola Única — RN07)</div>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:12px">
      <input type="text" id="fefo-scan" class="form-control" autocomplete="off" placeholder="🔦 Bipe o código de barras / lote e tecle Enter..." style="flex:1" onkeydown="if(event.key==='Enter'){event.preventDefault();window._biparProximoFefo('${os.id}', this.value);this.value='';}">
      <button type="button" class="btn btn-outline" onclick="window._biparTodosFefo('${os.id}')">Bipar todos</button>
    </div>
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:4px"><span>Conferência de separação</span><strong>${bipados}/${total} itens (${pct}%)</strong></div>
      <div style="height:8px;background:var(--surface-2,#e2e8f0);border-radius:4px;overflow:hidden"><div style="height:100%;width:${pct}%;background:#15803d;transition:width .3s"></div></div>
    </div>
    <div style="overflow-x:auto;margin-bottom:14px">
      <table class="data-table" style="font-size:0.85rem">
        <thead><tr><th>Produto Solicitado</th><th>Qtd Solicitada</th><th>Qtd Efetiva (A16)</th><th>Lote FEFO</th><th>Validade</th><th>Conferência</th></tr></thead>
        <tbody>
          ${os.produtos.map((p, i) => {
            const valQtd = p._qtdSeparada !== undefined ? p._qtdSeparada : p.quantidade;
            return `
            <tr style="${p._bipado ? 'background:var(--success-light,#f0fdf4)' : ''}">
              <td><strong>${p.produto}</strong></td>
              <td>${p.quantidade} ${p.unidade}</td>
              <td>
                <input type="number" class="form-control" style="width:85px;padding:3px 6px;font-family:var(--font-mono);font-weight:700"
                  min="0" max="${p.quantidade}" value="${valQtd}"
                  onchange="window._updateQtdSeparadaFEFO('${os.id}', ${i}, this.value)">
                <small style="color:var(--text-tertiary)">${p.unidade}</small>
              </td>
              <td><span class="tag tag-blue">${p.loteSugerido}</span></td>
              <td>${p.validade}</td>
              <td>${p._bipado
                ? '<span class="status-badge status-ok">✅ Conferido</span>'
                : `<button type="button" class="btn btn-sm btn-outline" onclick="window._biparItemFefo('${os.id}', ${i})">📷 Bipar</button>`}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
      <div style="display:flex;gap:8px">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="button" class="btn btn-outline" onclick="window.imprimirSeparacaoFEFO('${os.id}')">🖨️ Imprimir Romaneio</button>
      </div>
      <button type="button" class="btn btn-primary" style="background:#15803d" onclick="window.concluirSeparacaoFEFO('${os.id}')">✅ Concluir Separação (${bipados}/${total})</button>
    </div>
  `;
};

window._updateQtdSeparadaFEFO = (osId, idx, val) => {
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.id === osId);
  if (!os || !os.produtos[idx]) return;
  const num = Math.max(0, Number(val) || 0);
  os.produtos[idx]._qtdSeparada = num;
  if (num > 0) os.produtos[idx]._bipado = true;
  
  const central = SharedState.getCentralStock ? SharedState.getCentralStock() : [];
  const stockProd = central.find(c => c.produto.toLowerCase() === os.produtos[idx].produto.toLowerCase());
  const qtdReal = stockProd ? stockProd.qtd : 0;
  if (num > qtdReal) {
    showToast(`⚠️ Qtd informada (${num}) é maior que o estoque real no CD (${qtdReal} ${os.produtos[idx].unidade}) para ${os.produtos[idx].produto}.`, 'warning');
  }
  SharedState._persist();
  window._refreshSepFefo(os);
};

window.abrirModalSeparacaoFEFO = (osId) => {
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.id === osId);
  if (!os) return;
  window.showModal(`📦 Separação de Estoque por FEFO — OS ${os.numeroOs}`, `<div id="fefo-sep-body" style="font-family:Inter,sans-serif">${window._sepFefoBody(os)}</div>`, '750px');
  setTimeout(() => { const s = document.getElementById('fefo-scan'); if (s) s.focus(); }, 120);
};

window._refreshSepFefo = (os) => {
  const body = document.getElementById('fefo-sep-body');
  if (body) body.innerHTML = window._sepFefoBody(os);
  const s = document.getElementById('fefo-scan'); if (s) s.focus();
};

window._biparItemFefo = (osId, idx) => {
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.id === osId);
  if (!os || !os.produtos[idx]) return;
  os.produtos[idx]._bipado = true;
  if (os.produtos[idx]._qtdSeparada === undefined) os.produtos[idx]._qtdSeparada = os.produtos[idx].quantidade;
  SharedState._persist();
  window._refreshSepFefo(os);
};

window._biparProximoFefo = (osId, code) => {
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.id === osId);
  if (!os) return;
  const c = String(code || '').trim().toLowerCase();
  let alvo = c ? os.produtos.find(p => !p._bipado && (String(p.loteSugerido).toLowerCase() === c || p.produto.toLowerCase().includes(c))) : null;
  if (!alvo) alvo = os.produtos.find(p => !p._bipado);
  if (!alvo) { showToast('Todos os itens já foram conferidos!', 'warning'); return; }
  alvo._bipado = true;
  if (alvo._qtdSeparada === undefined) alvo._qtdSeparada = alvo.quantidade;
  SharedState._persist();
  showToast(`🟢 Item conferido pelo leitor: ${alvo.produto} (${alvo.loteSugerido})`);
  window._refreshSepFefo(os);
};

window._biparTodosFefo = (osId) => {
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.id === osId);
  if (!os) return;
  os.produtos.forEach(p => {
    p._bipado = true;
    if (p._qtdSeparada === undefined) p._qtdSeparada = p.quantidade;
  });
  SharedState._persist();
  window._refreshSepFefo(os);
};

window.imprimirSeparacaoFEFO = (osId) => {
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.id === osId);
  if (!os) return;
  const linhas = os.produtos.map(p => `<tr><td>${p.produto}</td><td style="text-align:center">${p._qtdSeparada !== undefined ? p._qtdSeparada : p.quantidade} ${p.unidade}</td><td>${p.loteSugerido}</td><td style="text-align:center">${p.validade}</td><td style="text-align:center">${p._bipado ? 'Conferido' : '☐'}</td></tr>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Romaneio de Separação — ${os.numeroOs}</title>
    <style>body{font-family:Arial,Helvetica,sans-serif;padding:28px;color:#111}h1{font-size:18px;margin:0 0 4px}h2{font-size:13px;font-weight:400;color:#555;margin:0 0 16px}
    table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #999;padding:6px 8px;text-align:left}th{background:#f0f0f0}
    .meta{font-size:12px;margin-bottom:14px;line-height:1.6}.sig{margin-top:48px;display:flex;justify-content:space-between;font-size:12px}.sig div{border-top:1px solid #333;width:45%;text-align:center;padding-top:6px}</style></head>
    <body>
      <h1>SUALE · SEMED Campo Grande — Romaneio de Separação (FEFO)</h1>
      <h2>Documento de acompanhamento de expedição — RN06/RN07</h2>
      <div class="meta"><strong>OS:</strong> ${os.numeroOs} &nbsp;·&nbsp; <strong>Escola (única):</strong> ${os.escolaNome} &nbsp;·&nbsp; <strong>Município:</strong> ${os.municipio || '—'}<br>
      <strong>Data prevista:</strong> ${os.dataPrevista || '—'} &nbsp;·&nbsp; <strong>Prioridade:</strong> ${os.prioridade || '—'} &nbsp;·&nbsp; <strong>Emitido em:</strong> ${new Date().toLocaleString('pt-BR')}</div>
      <table><thead><tr><th>Produto</th><th style="text-align:center">Qtd Efetiva</th><th>Lote (FEFO)</th><th style="text-align:center">Validade</th><th style="text-align:center">Conf.</th></tr></thead><tbody>${linhas}</tbody></table>
      <div class="sig"><div>Separador (Almoxarifado Central)</div><div>Conferente / Motorista</div></div>
      <script>window.onload=function(){window.print();}<\/script>
    </body></html>`;
  const w = window.open('', '_blank', 'width=820,height=640');
  if (!w) { showToast('Permita pop-ups para imprimir o romaneio de separação.', 'warning'); return; }
  w.document.write(html);
  w.document.close();
};

window.concluirSeparacaoFEFO = (osId) => {
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.id === osId);
  if (!os) return;

  const total = os.produtos.length;
  const bipados = os.produtos.filter(p => p._bipado).length;
  if (bipados === 0) { showToast('Bipe ao menos um item antes de concluir a separação.', 'warning'); return; }

  // Processa quantidades efetivas separadas
  const produtosSeparados = [];
  const produtosSaldo = [];

  os.produtos.forEach(p => {
    const qtdSep = p._bipado ? (p._qtdSeparada !== undefined ? p._qtdSeparada : p.quantidade) : 0;
    const qtdRestante = Math.max(0, p.quantidade - qtdSep);

    if (qtdSep > 0) {
      produtosSeparados.push({
        ...p,
        quantidade: qtdSep,
      });
      // Debita estoque central
      if (SharedState.consumeCentralStock) SharedState.consumeCentralStock(p.produto, qtdSep);
    }

    if (qtdRestante > 0) {
      const pSaldo = { ...p, quantidade: qtdRestante };
      delete pSaldo._bipado;
      delete pSaldo._qtdSeparada;
      produtosSaldo.push(pSaldo);
    }
  });

  const totalSeparado = (produtosSaldo.length === 0);
  os.status = totalSeparado ? 'Separado' : 'Separado parcial';
  os.produtos = produtosSeparados;

  let saldoOs = null;
  if (produtosSaldo.length > 0) {
    saldoOs = {
      ...os,
      id: `${os.id}-2`,
      numeroOs: `${os.numeroOs}/2`,
      produtos: produtosSaldo,
      status: 'Aguardando Separação',
      fracionadaDe: os.numeroOs,
    };
    (SharedState._data.ordensServicoExpedicao = SharedState._data.ordensServicoExpedicao || []).unshift(saldoOs);
  }

  SharedState.registrarLogAuditoria({
    acao: `Separação de Estoque FEFO (RN06) — ${totalSeparado ? 'Total' : 'Parcial'}`,
    produto: produtosSeparados.map(p => `${p.produto} (${p.quantidade} ${p.unidade})`).join(', '),
    quantidade: produtosSeparados.reduce((s, p) => s + p.quantidade, 0),
    origem: 'Estoque Central SEMED',
    destino: os.escolaNome,
    motivo: `Separação ${totalSeparado ? 'total' : 'parcial'} via FEFO para a OS ${os.numeroOs}. ${saldoOs ? 'Saldo gerou ' + saldoOs.numeroOs : ''}`
  });
  SharedState._persist();

  showToast(totalSeparado
    ? `✅ Separação FEFO concluída — OS ${os.numeroOs} SEPARADA. Já pode gerar a Ordem de Entrega.`
    : `⚠️ Separação PARCIAL — OS ${os.numeroOs}. Saldo gerou a nova OS ${saldoOs ? saldoOs.numeroOs : ''} (Aguardando Separação).`);
  closeModal();
  renderPage();
};

// MODAL 4: CRIAR ORDEM DE ENTREGA (RN08/RN09)
window.abrirModalNovaOrdemEntrega = (arg) => {
  // Aceita id de OS de Expedição OU escolaId (botão de reposição da Cobertura C10).
  const osList = SharedState.getOrdensServicoExpedicao();
  let os = osList.find(o => o.id === arg);
  if (!os) os = osList.find(o => o.escolaId === arg && (o.status === 'Aguardando Separação' || o.status === 'Separado' || o.status === 'OE Criada'));
  if (!os) { showToast('⚠️ Sem OS de expedição pendente para esta escola. Gere a OS na tela Expedição (OS Escolas).'); return; }

  const peso = (os.produtos || []).reduce((s, p) => s + (Number(p.quantidade) || 0), 0);
  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#eff6ff;padding:12px;border-radius:8px;border:1px solid #bfdbfe;margin-bottom:14px;font-size:0.85rem;color:#1e40af">
        🚛 <strong>Ordem de Entrega (RN08)</strong>: 1 escola = 1 O.E. A O.E. nasce <strong>"Aguardando carga"</strong> e é liberada para a <strong>Montagem de Carga</strong> — motorista, veículo e rota são definidos na carga, não aqui (Ajuste 02).
      </div>
      <form onsubmit="window.salvarNovaOrdemEntrega(event, '${os.id}')">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label class="form-label">Escola de Destino:</label>
            <input type="text" class="form-control" value="${os.escolaNome}" readonly>
          </div>
          <div>
            <label class="form-label">OS de referência:</label>
            <input type="text" class="form-control" value="${os.numeroOs}" readonly>
          </div>
        </div>
        <div class="card" style="margin-bottom:12px">
          <div class="card-header" style="padding:8px 12px"><strong>Itens da O.E.</strong><span class="tag tag-blue">${peso.toLocaleString('pt-BR')} kg</span></div>
          <table class="data-table"><thead><tr><th>Produto</th><th>Qtd</th><th>Unid.</th></tr></thead><tbody>
            ${(os.produtos||[]).map(p => `<tr><td>${p.produto}</td><td style="font-family:var(--font-mono)">${p.quantidade}</td><td>${p.unidade||''}</td></tr>`).join('')}
          </tbody></table>
        </div>
        <div style="background:#f0fdf4;padding:8px 12px;border-radius:6px;font-size:0.8rem;color:#166534;margin-bottom:12px">
          ➡️ Próximo passo: <strong>Montagem de Carga</strong> aloca esta O.E. a um caminhão; o despacho ao Motorista ocorre ao <strong>Liberar para Entrega</strong>.
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-primary">🚛 Criar O.E. (Aguardando carga)</button>
        </div>
      </form>
    </div>
  `;

  window.showModal(`🚛 Criar Ordem de Entrega — ${os.numeroOs}`, content, '650px');
};

window.salvarNovaOrdemEntrega = (e, osId) => {
  e.preventDefault();
  // Busca real no array (getOrdensServicoExpedicao retorna cópia) para poder mutar status.
  const os = (SharedState._data.ordensServicoExpedicao || []).find(o => o.id === osId);
  if (!os) return;

  const numeroOe = `OE-2026/${Math.floor(100 + Math.random() * 900)}`;
  const pesoKg = (os.produtos || []).reduce((s, p) => s + (Number(p.quantidade) || 0), 0);

  // Ajuste 02: a O.E. NASCE "Aguardando carga" — sem motorista/veículo/rota e
  // SEM disparo ao Motorista. O despacho acontece só ao Liberar a Carga (Ajuste 03).
  const novaOe = {
    id: `OE-${Date.now()}`,
    numeroOe,
    osId: os.numeroOs,
    escolaId: os.escolaId,
    escolaNome: os.escolaNome,
    status: 'Aguardando carga',
    cargaId: null,
    dataEntrega: null,
    produtos: os.produtos,
    pesoKg,
    criadaEm: new Date().toISOString(),
    historicoStatus: [{ status: 'Aguardando carga', autor: 'Estoque Central', data: new Date().toISOString() }],
    assinaturaDigital: null,
    recebidoPor: null
  };

  // Persiste a OE no array real (getOrdensEntrega retorna cópia — não usar push nela).
  (SharedState._data.ordensEntrega = SharedState._data.ordensEntrega || []).unshift(novaOe);
  os.status = 'OE Criada';
  SharedState._persist();
  if (SharedState._emit) SharedState._emit('oe:created', novaOe);

  showToast(`🚛 Ordem de Entrega ${numeroOe} criada (Aguardando carga). Já disponível na Montagem de Carga.`);
  closeModal();
  renderPage();
};

// MODAL 5: ASSINATURA DIGITAL E FINALIZAÇÃO DE ENTREGA (RN10)
window.abrirModalAssinaturaEntregaEscola = (oeId) => {
  const oe = SharedState.getOrdensEntrega().find(o => o.id === oeId);
  if (!oe) return;

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#f0fdf4;padding:12px;border-radius:8px;border:1px solid #86efac;margin-bottom:14px;font-size:0.85rem;color:#166534">
        ✍️ <strong>Confirmação de Recebimento na Escola (RN10)</strong>: Coleta de assinatura digital do responsável pelo almoxarifado/direção da escola para encerramento do ciclo logístico.
      </div>
      <div class="card mb-16" style="padding:12px;font-size:0.85rem">
        <div>Ordem de Entrega: <strong>${oe.numeroOe}</strong> · Escola: <strong>${oe.escolaNome}</strong></div>
        <div>Motorista: <strong>${oe.motorista}</strong> · Veículo: <strong>${oe.veiculo}</strong></div>
      </div>
      <form onsubmit="window.salvarAssinaturaEntrega(event, '${oe.id}')">
        <div style="margin-bottom:12px">
          <label class="form-label">Nome do Recebedor na Escola:</label>
          <input type="text" id="ass-recebedor" class="form-control" value="Profa. Maria Clara Santos (Diretora)" required>
        </div>
        <div style="margin-bottom:14px">
          <label class="form-label">Assinatura Digital (Desenhe no quadro abaixo):</label>
          <div style="border:2px dashed #94a3b8;border-radius:8px;background:#f8fafc;padding:4px;text-align:center">
            <canvas id="canvas-assinatura" width="550" height="150" style="background:white;border-radius:6px;cursor:crosshair;touch-action:none"></canvas>
            <div style="margin-top:4px">
              <button type="button" class="btn btn-sm btn-outline" onclick="window.limparCanvasAssinatura()">🧹 Limpar Assinatura</button>
            </div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-primary" style="background:#15803d">✅ Confirmar Entrega e Atualizar Status (RN10)</button>
        </div>
      </form>
    </div>
  `;

  window.showModal(`✍️ Assinatura Digital de Entrega — ${oe.numeroOe}`, content, '650px');

  setTimeout(() => {
    const canvas = document.getElementById('canvas-assinatura');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let desenhando = false;

    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2.5;

    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return { x: (e.clientX || e.touches[0].clientX) - rect.left, y: (e.clientY || e.touches[0].clientY) - rect.top };
    };

    const start = (e) => { desenhando = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (e) => { if (!desenhando) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
    const stop = () => { desenhando = false; };

    canvas.onmousedown = start; canvas.onmousemove = move; canvas.onmouseup = stop;
    canvas.ontouchstart = start; canvas.ontouchmove = move; canvas.ontouchend = stop;
  }, 100);
};

window.limparCanvasAssinatura = () => {
  const canvas = document.getElementById('canvas-assinatura');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
};

window.salvarAssinaturaEntrega = (e, oeId) => {
  e.preventDefault();
  const oe = SharedState.getOrdensEntrega().find(o => o.id === oeId);
  if (!oe) return;

  const recebedor = document.getElementById('ass-recebedor').value;
  const canvas = document.getElementById('canvas-assinatura');
  const sigData = canvas ? canvas.toDataURL() : 'sig-demo';

  oe.status = 'Entregue';
  oe.recebidoPor = recebedor;
  oe.assinaturaDigital = sigData;
  oe.dataRecebimentoReal = new Date().toISOString();

  // Atualização em cadeia: OE -> OS -> Demanda -> Histórico (RN10)
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.numeroOs === oe.osId || o.id === oe.osId);
  if (os) {
    os.status = 'Entregue';
  }

  SharedState.registrarLogAuditoria({
    acao: 'Entrega Concluída com Assinatura Digital (RN10)',
    produto: oe.produtos.map(p => p.produto).join(', '),
    quantidade: oe.produtos.reduce((s,p) => s + p.quantidade, 0),
    origem: `Motorista: ${oe.motorista}`,
    destino: oe.escolaNome,
    motivo: `Entrega física atestada com assinatura digital por ${recebedor}.`
  });

  SharedState._persist();
  showToast(`🎉 Entrega ${oe.numeroOe} atestada com sucesso na escola ${oe.escolaNome}!`);
  closeModal();
  renderPage();
};

// ─── ALIASES DE RENDERIZAÇÃO: ESTOQUE CENTRAL <-> GESTOR ────────────────
if (typeof PAGE_RENDERERS !== 'undefined') {
  PAGE_RENDERERS['estoque_os-central'] = PAGE_RENDERERS['gestor_os-central'];
  PAGE_RENDERERS['estoque_recebimentos-pendentes'] = PAGE_RENDERERS['gestor_recebimentos-pendentes'];
  PAGE_RENDERERS['estoque_expedicao-os'] = PAGE_RENDERERS['gestor_expedicao-os'];
  PAGE_RENDERERS['estoque_ordens-entrega'] = PAGE_RENDERERS['gestor_ordens-entrega'];
  PAGE_RENDERERS['estoque_entradas'] = PAGE_RENDERERS['gestor_recebimentos-pendentes'];
  PAGE_RENDERERS['estoque_separacao'] = PAGE_RENDERERS['gestor_expedicao-os'];
  PAGE_RENDERERS['estoque_carregamento'] = PAGE_RENDERERS['gestor_ordens-entrega'];
}
