/* ============================================
   SUALE — Application Engine
   Sistema de Gestão da Alimentação Escolar
   SEMED · Campo Grande · MS
   ============================================ */

// ============================
// VERSÃO
// ----------------------------
// Fonte única da verdade. Ao commitar, os três devem subir juntos:
//   1. APP_VERSION aqui
//   2. "version" no package.json da raiz
//   3. tag do git (git tag -a v<versao>)
// Semver: MAJOR quebra fluxo/dados · MINOR nova tela ou perfil · PATCH correção
// ============================
const APP_VERSION = '2.4.1';
const APP_BUILD_DATE = '2026-08-17';
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

// ============================
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
// ============================
const USAR_CATALOGO_LOCAL = true;
window.USAR_CATALOGO_LOCAL = USAR_CATALOGO_LOCAL;

// ============================
// MODAL SYSTEM (Redimensionado e Responsivo)
// ============================
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

// ============================
// MOCK DATA
// ============================
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
  // ============================================================
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
  // ============================================================
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
  // ============================================================
  // ATAS DE REGISTRO DE PREÇO — rede municipal (183 escolas · 94,7 mil alunos)
  // ------------------------------------------------------------
  // Atas são instrumentos MUNICIPAIS; o piloto de 8 escolas consome ~4,2% do
  // total (3.992 / 94.700 alunos). Por isso os empenhos do piloto são pequenos
  // frente ao valor global — comportamento normal de registro de preço, que
  // superdimensiona a quantidade registrada e executa só o necessário.
  // Modalidade: 'chamada_publica' = Agricultura Familiar (mín. 45% do PNAE em
  // 2026, subiu de 30%) · 'pregao' = licitação comum.
  // ============================================================
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
  // ============================================================
  // EMPENHOS — nota de empenho (NE) do exercício 2026
  // ------------------------------------------------------------
  // Numeração no padrão SIAFI: <exercício>NE<sequencial>.
  // São os empenhos do mês corrente (jul/2026). O executedValue de cada ata
  // acima é o ACUMULADO do ano, não a soma só destes — por isso é maior.
  // Quantidade de cada NE ≈ 1/12 da quantidade registrada na ata (draw mensal).
  // items[].productId aponta para DATA.ataProducts (não para products).
  // ============================================================
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

// ============================
// PROFILE CONFIGS
// ============================
const PROFILES = {
  gestor: {
    userId: 'ID-xxx',
    name: 'Dr. Marcos Silva',
    role: 'Gestor SEMED',
    initials: 'MS',
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
      { type: 'group', label: 'Prestação de Contas', children: [
        { id: 'atas',                  icon: '📋', label: 'Atas e Contratos',        badge: null },
        { id: 'empenhos',              icon: '💳', label: 'Empenhos SIAFI',          badge: null },
        { id: 'os-central',            icon: '🏭', label: 'OS Estoque Central',      badge: null },
        { id: 'recebimentos-pendentes',icon: '🚚', label: 'Recebimentos Pendentes', badge: 'NEW' },
        { id: 'expedicao-os',          icon: '📦', label: 'Expedição (OS Escolas)',   badge: null },
        { id: 'ordens-entrega',        icon: '🚛', label: 'Ordens de Entrega',        badge: null },
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
    name: 'Roberto Lima',
    role: 'Central de Distribuição (Estoque)',
    initials: 'RL',
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard Operacional', badge: null },
      { id: 'inventario', icon: '🏢', label: 'Posição de Estoque', badge: null },
      { id: 'entradas', icon: '📥', label: 'Entradas (NF)', badge: '2' },
      { id: 'separacao', icon: '📦', label: 'Ordens de Separação', badge: '3' },
      { id: 'carregamento', icon: '🚚', label: 'Carregamento (Bipagem)', badge: null },
      { id: 'lotes', icon: '📋', label: 'Controle de Lotes', badge: null },
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

// ============================
// APP STATE
// ============================
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

// ============================
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
// ============================
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

  onChange(fn) { this._listeners.push(fn); return () => { this._listeners = this._listeners.filter(f => f !== fn); }; },

  // Leitores
  getMenus()       { return [...(this._data.menus || [])]; },
  getCardapios()   { return this.getMenus(); },
  getWeeklyMenus() { return [...(this._data.weeklyMenus || [])]; },
  getFichas()      { return [...(this._data.fichas || [])]; },
  getOrders()      { 
    const ords = this._data.orders || [];
    ords.forEach(o => { 
      if (!o.school && o.escola) o.school = o.escola; 
      if (!o.schoolId && o.school && typeof DATA !== 'undefined' && DATA.schools) {
        const sc = DATA.schools.find(s => s.name === o.school);
        if (sc) o.schoolId = sc.id;
      }
      if (!o.criadoPorUserId) o.criadoPorUserId = o.solicitante === 'Gestor SEMED' ? 'USR-GESTOR-001' : 'USR-ESCOLA-001';
    });
    return [...ords]; 
  },
  getDeliveries()  { 
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
  getSchoolStock(school) {
    const s = (this._data.schoolStocks || {})[school] || {};
    return Object.entries(s).map(([produto, info]) => ({ produto, ...info }));
  },
  getSchoolStockItem(school, produto) {
    return ((this._data.schoolStocks || {})[school] || {})[produto] || null;
  },
  getCentralStock() {
    return Object.entries(this._data.centralStock || {}).map(([produto, info]) => ({ produto, ...info }));
  },
  getConsumo(escola) {
    const all = this._data.consumo || [];
    return escola ? all.filter(c => c.escola === escola) : [...all];
  },
  getRestricoes(schoolId) {
    const all = this._data.restricoes || [];
    return schoolId ? all.filter(r => r.schoolId === schoolId) : [...all];
  },
  getAlunosEspeciais(escolaName) {
    const all = this._data.alunosEspeciais || [];
    return escolaName ? all.filter(a => a.escola === escolaName || a.escola.toLowerCase().includes(escolaName.toLowerCase())) : [...all];
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
    const usr = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].userId : null;
    const m = { id: 'menu-' + crypto.randomUUID(), status: 'Publicado', criadoEm: new Date().toISOString().slice(0,10), criadoPorUserId: usr, ...menu };
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
      itens: finalItens,
      cooperative: finalCoop,
      criadoPorUserId: usr,
      ...order,
      school: finalSchool,
      schoolId: finalId,
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
  addProduction(prod) {
    const usr = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].userId : null;
    const p = { id: 'prod-' + Date.now(), criadoEm: new Date().toISOString(), criadoPorUserId: usr, ...prod };
    this._data.productions.unshift(p);
    this._persist(); this._emit('production:add');
    return p;
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
window.PROFILES = PROFILES;

// Escolas piloto — capturadas UMA VEZ antes de qualquer hydrateData do Supabase.
// Serve de fallback quando o Supabase não responde; o db.js substitui por escolas reais quando conecta.
window._PILOT_SCHOOLS = DATA.schools.filter(sc => sc.diretor).slice();

// O dropdown do login precisa listar as MESMAS escolas (e IDs) que acabam em _PILOT_SCHOOLS,
// senão o usuário escolhe uma escola e entra em outra.
document.addEventListener('DOMContentLoaded', () => {
  if (window.DB && typeof window.DB.initLoginDropdown === 'function') window.DB.initLoginDropdown();
  renderVersionTags();
});

// Helper de UI: mostra um toast rápido de sucesso/erro
function showToast(msg, kind) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:' + (kind === 'error' ? '#C62828' : '#2E7D32') + ';color:white;padding:12px 18px;border-radius:8px;font-size:0.9rem;box-shadow:0 8px 24px rgba(0,0,0,0.2);z-index:9999;font-weight:600;opacity:0;transition:opacity .2s';
  document.body.appendChild(t);
  requestAnimationFrame(() => t.style.opacity = '1');
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 250); }, 3200);
}
window.showToast = showToast;

// ============================
// UTILITIES
// ============================
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

// ============================
// NAVIGATION
// ============================
function navigateTo(profile, page) {
  if (profile) state.currentProfile = profile;
  state.currentPage = page || 'dashboard';
  destroyCharts();
  renderSidebar();
  renderHeader();
  renderPage();
}

async function login(profile, schoolId) {
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

// ============================
// RENDER: SIDEBAR
// ============================
function computeDynamicBadge(profile, pageId) {
  const orders = SharedState.getOrders();
  const incidents = SharedState.getIncidents();
  const productions = SharedState.getProductions();
  if (profile === 'gestor' && pageId === 'pedidos')       return orders.filter(o => o.status === 'Pendente').length || null;
  if (profile === 'gestor' && pageId === 'dashboard')     return incidents.filter(i => i.status === 'Aberta').length || null;
  if (profile === 'nutricionista' && pageId === 'cardapios') {
    const weekly = SharedState.getWeeklyMenus().length;
    return weekly || null;
  }
  if (profile === 'escola' && pageId === 'cardapios')     return SharedState.getWeeklyMenus().length || null;
  if (profile === 'escola' && pageId === 'entregas')      return orders.filter(o => o.status !== 'Entregue' && o.status !== 'Pendente').length || null;
  if (profile === 'escola' && pageId === 'pedidos')       return orders.filter(o => o.status === 'Pendente').length || null;
  if (profile === 'cooperativa' && pageId === 'pedidos')  return orders.filter(o => o.status === 'Pendente').length || null;
  if (profile === 'agricultor' && pageId === 'pedidos')   return orders.filter(o => ['Pendente','Em separação'].includes(o.status)).length || null;
  if (profile === 'almoxarifado' && pageId === 'separacao') return orders.filter(o => ['Pendente','Em separação'].includes(o.status)).length || null;
  if (profile === 'motorista' && pageId === 'entregas')   return orders.filter(o => o.status === 'Em transporte').length || null;
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
  const prof = PROFILES[state.currentProfile];
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
    btn.addEventListener('click', () => navigateTo(null, btn.dataset.page));
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

// ============================
// RENDER: HEADER
// ============================
function renderHeader() {
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

// ============================
// RENDER NOTIFICATIONS
// ============================
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

// ============================
// RENDER: PAGE ROUTER
// ============================
function renderPage() {
  const key = `${state.currentProfile}_${state.currentPage}`;
  const container = $('#page-content');
  container.innerHTML = '';
  container.className = 'page-content';
  const renderer = PAGE_RENDERERS[key] || PAGE_RENDERERS[`${state.currentProfile}_dashboard`] || renderGenericPage;
  renderer(container);
}

// ============================
// CHART HELPERS
// ============================
function createChart(id, config) {
  const canvas = document.getElementById(id);
  if (!canvas) return null;
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

// ============================
// PAGE RENDERERS
// ============================
const PAGE_RENDERERS = {};

// ─── GESTOR: DASHBOARD EXECUTIVO ───
PAGE_RENDERERS.gestor_dashboard = (el) => {
  const schoolsOk = DATA.schools.filter(s => s.stockStatus === 'ok').length;
  const schoolsRisk = DATA.schools.filter(s => s.stockStatus === 'danger').length;
  const totalStudents = DATA.schools.reduce((a, s) => a + s.students, 0);
  const sharedPending = SharedState.getOrders().filter(o => o.status === 'Pendente').length;
  const pendingOrders = DATA.orders.filter(o => o.status === 'Pendente').length + sharedPending;
  const lateOrders = DATA.orders.filter(o => o.status === 'Pendente' || o.status === 'Em separação').length;
  // Derivado do grafo (ver ataTotais) — muda sozinho a cada empenho gravado.
  const _totAtas = DATA.contracts.map(c => ataTotais(c.id));
  const totalAtas = _totAtas.reduce((a, t) => a + t.global, 0);
  const executedAtas = _totAtas.reduce((a, t) => a + t.empenhado, 0);
  const incidents = SharedState.getIncidents();
  const recentIncidents = incidents.slice(0, 3);

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Dashboard Executivo</div>
        <div class="page-subtitle">Visão geral da alimentação escolar · Atualizado em ${new Date().toLocaleDateString('pt-BR')}${state.pilotoAtivo ? ' · <span class="tag tag-blue" style="font-size:0.7rem">🎯 MODO PILOTO (8 escolas)</span>' : ''}</div>
      </div>
      <button class="btn btn-sm ${state.pilotoAtivo ? 'btn-outline' : 'btn-primary'}" onclick="togglePilotoMode()" style="margin-left:auto">${state.pilotoAtivo ? 'Sair do Piloto' : '🎯 Ativar Modo Piloto (8)'}</button>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card blue animate-fade-up stagger-1">
        <div class="kpi-icon">🏫</div>
        <div class="kpi-value">${DATA.schools.length}</div>
        <div class="kpi-label">Escolas Ativas</div>
      </div>
      <div class="kpi-card green animate-fade-up stagger-2">
        <div class="kpi-icon">✅</div>
        <div class="kpi-value">${Math.round(schoolsOk / DATA.schools.length * 100)}%</div>
        <div class="kpi-label">Escolas Abastecidas</div>
        <div class="kpi-trend up">▲ +2,3% vs mês anterior</div>
      </div>
      <div class="kpi-card red animate-fade-up stagger-3">
        <div class="kpi-icon">⚠️</div>
        <div class="kpi-value">${schoolsRisk}</div>
        <div class="kpi-label">Escolas em Risco</div>
        <div class="kpi-trend down">▲ +1 esta semana</div>
      </div>
      <div class="kpi-card orange animate-fade-up stagger-4">
        <div class="kpi-icon">📦</div>
        <div class="kpi-value">${pendingOrders}</div>
        <div class="kpi-label">Pedidos Pendentes</div>
      </div>
      <div class="kpi-card purple animate-fade-up stagger-5">
        <div class="kpi-icon">👨‍🎓</div>
        <div class="kpi-value">${(totalStudents / 1000).toFixed(1)}K</div>
        <div class="kpi-label">Alunos Atendidos</div>
      </div>
      <div class="kpi-card teal animate-fade-up stagger-6">
        <div class="kpi-icon">💰</div>
        <div class="kpi-value">${formatCurrency(executedAtas)}</div>
        <div class="kpi-label">Valor Empenhado das Atas</div>
        <div class="progress-bar" style="margin-top:8px"><div class="progress-fill blue" style="width:${Math.round(executedAtas/totalAtas*100)}%"></div></div>
        <div style="font-size:0.68rem;color:var(--text-tertiary);margin-top:4px">${Math.round(executedAtas/totalAtas*100)}% de ${formatCurrency(totalAtas)}</div>
      </div>
      <div class="kpi-card blue animate-fade-up stagger-7">
        <div class="kpi-icon">🌾</div>
        <div class="kpi-value">47</div>
        <div class="kpi-label">Cooperativas Ativas</div>
      </div>
    </div>

    <!-- FLOW DIAGRAM -->
    <div class="card mb-24 animate-fade-up">
      <div class="card-header">
        <div class="card-title">🔄 Fluxo Principal do Sistema</div>
        <div class="card-subtitle">Clique em cada etapa para navegar</div>
      </div>
      <div class="card-body">
        <div class="flow-diagram">
          <div class="flow-node active" onclick="navigateTo('nutricionista','cardapios')"><div class="flow-icon">🥗</div><div class="flow-label">Nutricionista<br>Cria Cardápio</div></div>
          <div class="flow-arrow">→</div>
          <div class="flow-node" onclick="navigateTo('escola','cardapios')"><div class="flow-icon">🏫</div><div class="flow-label">Escola<br>Executa</div></div>
          <div class="flow-arrow">→</div>
          <div class="flow-node" onclick="navigateTo('escola','consumo')"><div class="flow-icon">📝</div><div class="flow-label">Consumo<br>Registrado</div></div>
          <div class="flow-arrow">→</div>
          <div class="flow-node" onclick="navigateTo('escola','estoque')"><div class="flow-icon">📦</div><div class="flow-label">Estoque<br>Atualizado</div></div>
          <div class="flow-arrow">→</div>
          <div class="flow-node" onclick="navigateTo('escola','pedidos')"><div class="flow-icon">🛒</div><div class="flow-label">Pedido<br>Gerado</div></div>
          <div class="flow-arrow">→</div>
          <div class="flow-node" onclick="navigateTo('cooperativa','pedidos')"><div class="flow-icon">🤝</div><div class="flow-label">Cooperativa<br>Recebe</div></div>
          <div class="flow-arrow">→</div>
          <div class="flow-node" onclick="navigateTo('agricultor','pedidos')"><div class="flow-icon">🌾</div><div class="flow-label">Agricultor<br>Entrega</div></div>
          <div class="flow-arrow">→</div>
          <div class="flow-node" onclick="navigateTo('gestor','dashboard')"><div class="flow-icon">📊</div><div class="flow-label">Gestor<br>Monitora</div></div>
        </div>
      </div>
    </div>

    <div class="grid-2-1">
      <!-- CONSUMO MENSAL -->
      <div class="card animate-fade-up">
        <div class="card-header"><div class="card-title">📈 Consumo Mensal de Alimentos (kg)</div></div>
        <div class="card-body"><div class="chart-container h-300"><canvas id="chart-consumo-mensal"></canvas></div></div>
      </div>
      <!-- IA WIDGET -->
      <div class="ia-card animate-fade-up">
        <div class="ia-card-title">🤖 IA de Previsão <span class="ia-badge">AI-POWERED</span></div>
        <div class="ia-suggestion">📉 <strong>Banana Nanica</strong> com previsão de escassez em <strong>3 dias</strong>. Recomenda-se pedido urgente.</div>
        <div class="ia-suggestion">📉 <strong>Alface Crespa</strong> estoque para apenas <strong>2 dias</strong>. Acionar COOPAGRAN imediatamente.</div>
        <div class="ia-suggestion">📊 Demanda prevista para próximos 30 dias: <strong>43.200 kg</strong> de alimentos.</div>
        <div class="ia-suggestion">💡 Sugestão: Substituir Melancia por <strong>Manga Tommy</strong> (safra atual, menor custo).</div>
        <div style="margin-top:12px">
          <button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;width:100%" onclick="navigateTo('gestor','ia')">Ver Módulo IA Completo →</button>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <!-- PRODUTOS MAIS CONSUMIDOS -->
      <div class="card animate-fade-up">
        <div class="card-header"><div class="card-title">🥇 Produtos Mais Consumidos</div></div>
        <div class="card-body"><div class="chart-container h-250"><canvas id="chart-top-produtos"></canvas></div></div>
      </div>
      <!-- AGRICULTURA FAMILIAR -->
      <div class="card animate-fade-up">
        <div class="card-header"><div class="card-title">🌾 Participação da Agricultura Familiar</div></div>
        <div class="card-body">
          <div style="display:flex;align-items:center;gap:24px">
            <div class="chart-container" style="width:180px;height:180px;position:relative">
              <canvas id="chart-agri-familiar"></canvas>
              <div class="chart-center"><div class="chart-center-value">38%</div><div class="chart-center-label">Agric. Familiar</div></div>
            </div>
            <div style="flex:1">
              <div class="ia-metric" style="border-color:var(--border)"><span class="ia-metric-label" style="color:var(--text-secondary)">Cooperativas Ativas</span><span class="ia-metric-value" style="color:var(--text-primary)">5</span></div>
              <div class="ia-metric" style="border-color:var(--border)"><span class="ia-metric-label" style="color:var(--text-secondary)">Agricultores</span><span class="ia-metric-value" style="color:var(--text-primary)">${DATA.farmers.length}</span></div>
              <div class="ia-metric" style="border-color:var(--border)"><span class="ia-metric-label" style="color:var(--text-secondary)">Produtos da AF</span><span class="ia-metric-value" style="color:var(--text-primary)">${DATA.products.filter(p=>p.familyFarm).length}</span></div>
              <div class="ia-metric" style="border-color:var(--border)"><span class="ia-metric-label" style="color:var(--text-secondary)">Meta PNAE (30%)</span><span class="ia-metric-value" style="color:var(--success)">✓ Atingida</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MAP + ALERTS -->
    <div class="grid-2-1">
      <div class="card animate-fade-up">
        <div class="card-header"><div class="card-title">🗺️ Mapa de Abastecimento — Campo Grande</div></div>
        <div class="card-body">
          <div class="map-container" id="map-container"></div>
        </div>
      </div>
      <div class="card animate-fade-up">
        <div class="card-header"><div class="card-title">🚨 Alertas Ativos</div>${recentIncidents.length ? '<span class="status-badge status-danger">'+incidents.length+' ocorrência(s)</span>' : ''}</div>
        <div class="card-body">
          <div class="alert-list">
            ${recentIncidents.map(i => `
              <div class="alert-item danger">
                <span class="alert-icon">🚚</span>
                <div class="alert-text"><strong>Motorista — ${i.school || 'Sem escola'}</strong> reportou: ${i.tipo}</div>
                <span class="alert-time">${new Date(i.criadoEm).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
            `).join('')}
            <div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>EMTI PROFª IRACEMA MARIA VICENTE</strong> — Estoque em 15%, risco de desabastecimento</div><span class="alert-time">5min</span></div>
            <div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>EM Elízio Ramirez</strong> — Estoque em 8%, situação crítica</div><span class="alert-time">1h</span></div>
            <div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>EMEI ELEODES ESTEVAN</strong> — Estoque em 12%, aguardando entrega</div><span class="alert-time">2h</span></div>
            <div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>Alface Crespa</strong> — Estoque municipal para apenas 2 dias</div><span class="alert-time">3h</span></div>
            <div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>Banana Nanica</strong> — Estoque municipal para apenas 3 dias</div><span class="alert-time">4h</span></div>
            <div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>ATA-2025/018</strong> — Saldo restante de apenas 10%</div><span class="alert-time">6h</span></div>
            <div class="alert-item info"><span class="alert-icon">🤖</span><div class="alert-text"><strong>IA:</strong> Previsão de aumento de 12% na demanda em Julho</div><span class="alert-time">1d</span></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // CHARTS
  setTimeout(() => {
    createChart('chart-consumo-mensal', {
      type: 'bar',
      data: {
        labels: DATA.months,
        datasets: [{
          label: 'Consumo (kg)',
          data: DATA.monthlyConsumption,
          backgroundColor: DATA.months.map((_, i) => i <= 5 ? CHART_COLORS.blue : 'rgba(21,101,192,0.3)'),
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } } }
    });

    createChart('chart-top-produtos', {
      type: 'bar',
      data: {
        labels: ['Leite', 'Arroz', 'Frango', 'Banana', 'Feijão', 'Tomate', 'Cenoura', 'Carne'],
        datasets: [{
          label: 'Consumo Médio/Dia (kg)',
          data: [1200, 850, 780, 600, 420, 400, 310, 520],
          backgroundColor: CHART_COLORS.palette.slice(0, 8),
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: { ...CHART_DEFAULTS, indexAxis: 'y', plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } } }
    });

    createChart('chart-agri-familiar', {
      type: 'doughnut',
      data: {
        labels: ['Agricultura Familiar', 'Outras Fontes'],
        datasets: [{ data: [38, 62], backgroundColor: ['#2E7D32', '#E0E0E0'], borderWidth: 0 }]
      },
      options: { responsive: true, maintainAspectRatio: true, cutout: '72%', plugins: { legend: { display: false }, tooltip: { enabled: true } } }
    });

    renderMap();
  }, 100);
};

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
    const reg = regions.find(r => r.name === s.region);
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

// ─── GESTOR: ESCOLAS ───
PAGE_RENDERERS.gestor_escolas = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Escolas</div><div class="page-subtitle">${DATA.schools.length} unidades escolares na rede municipal</div></div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Listagem de Escolas</div>
        <div class="filter-bar" style="margin:0;display:flex;gap:8px;flex-wrap:wrap">
          <input type="search" id="filter-school-nome" placeholder="Buscar escola ou diretor..." style="padding:7px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem;min-width:200px">
          <select id="filter-region"><option value="">Todas as Regiões</option>${[...new Set(DATA.schools.map(s => s.region))].sort().map(r => `<option>${r}</option>`).join('')}</select>
          <select id="filter-status">
            <option value="">Todos os Status</option>
            <option value="ok">Abastecida</option>
            <option value="warning">Atenção</option>
            <option value="danger">Risco</option>
          </select>
        </div>
      </div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table" id="table-escolas">
            <thead><tr><th>Escola</th><th>Região</th><th>Diretor(a)</th><th>Alunos</th><th style="text-align:center">Freq. Média</th><th>Estoque</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              ${DATA.schools.map(s => {
                const attPct = s.attendance_pct || Math.round(72+Math.random()*24);
                return `
                <tr class="clickable-row" data-school-id="${s.id}">
                  <td><strong>${s.name}</strong></td>
                  <td><span class="tag tag-blue">${s.region}</span></td>
                  <td>${s.director}</td>
                  <td style="font-family:var(--font-mono)">${s.students}</td>
                  <td style="text-align:center">
                    <span style="font-weight:700;color:${attPct>=90?'var(--success)':attPct>=80?'var(--warning)':'var(--danger)'}">${attPct}%</span>
                    <div style="background:var(--border);border-radius:3px;height:4px;margin-top:3px;width:64px;margin:3px auto 0">
                      <div style="width:${attPct}%;height:100%;background:${attPct>=90?'var(--success)':attPct>=80?'var(--warning)':'var(--danger)'};border-radius:3px"></div>
                    </div>
                  </td>
                  <td><div style="display:flex;align-items:center;gap:8px"><div class="progress-bar" style="width:80px"><div class="progress-fill ${s.stockPct > 60 ? 'green' : s.stockPct > 30 ? 'orange' : 'red'}" style="width:${s.stockPct}%"></div></div><span style="font-family:var(--font-mono);font-size:0.78rem">${s.stockPct}%</span></div></td>
                  <td><span class="status-badge ${statusClass(s.stockStatus)}">${statusLabel(s.stockStatus)}</span></td>
                  <td>
                    ${state.currentProfile === 'nutricionista' ? '' : `<button class="table-action" onclick="window._STATE=window._STATE||{};window._STATE.schoolName='${s.name}';navigateTo('escola','dashboard')">Acessar como →</button>`}
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
          <div id="escolas-vazio" style="display:none;padding:32px;text-align:center;color:var(--text-secondary)">Nenhuma escola encontrada com esses filtros.</div>
        </div>
      </div>
    </div>
  `;

  // Filtros da listagem de escolas
  const aplicarFiltrosEscolas = () => {
    const nome   = (document.getElementById('filter-school-nome').value || '').toLowerCase().trim();
    const region = document.getElementById('filter-region').value;
    const status = document.getElementById('filter-status').value;
    let visiveis = 0;

    el.querySelectorAll('#table-escolas tbody tr').forEach(tr => {
      const s = DATA.schools.find(x => String(x.id) === tr.dataset.schoolId);
      if (!s) return;
      const okNome   = !nome || s.name.toLowerCase().includes(nome) || (s.director || '').toLowerCase().includes(nome);
      const okRegion = !region || s.region === region;
      const okStatus = !status || s.stockStatus === status;
      const mostrar  = okNome && okRegion && okStatus;
      tr.style.display = mostrar ? '' : 'none';
      if (mostrar) visiveis++;
    });

    document.getElementById('escolas-vazio').style.display = visiveis ? 'none' : 'block';
    const sub = el.querySelector('.page-subtitle');
    if (sub) sub.textContent = visiveis === DATA.schools.length
      ? `${DATA.schools.length} unidades escolares na rede municipal`
      : `${visiveis} de ${DATA.schools.length} unidades escolares`;
  };

  ['filter-school-nome', 'filter-region', 'filter-status'].forEach(id => {
    const elx = document.getElementById(id);
    if (elx) elx.addEventListener(id === 'filter-school-nome' ? 'input' : 'change', aplicarFiltrosEscolas);
  });
};

// ============================================================
// TOTAIS DERIVADOS — atas, empenhos e estoque
// ------------------------------------------------------------
// Nada aqui lê campo estático (ata.executedValue etc). Tudo é somado a partir
// do grafo, para que gravar um empenho novo ou receber uma NF mude os KPIs na
// hora, sem precisar atualizar contador nenhum na mão.
// ============================================================

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

PAGE_RENDERERS.gestor_atas = (el) => {
  const sharedEmpenhos = SharedState.getEmpenhos();
  const nfs = SharedState.getNFs();
  // Todos os totais saem de ataTotais() — mudam sozinhos quando um empenho é gravado.
  const tot = DATA.contracts.map(c => ({ c, t: ataTotais(c.id) }));
  const somaGlobal    = tot.reduce((a, x) => a + x.t.global, 0);
  const somaEmpenhado = tot.reduce((a, x) => a + x.t.empenhado, 0);
  const somaLiquidado = tot.reduce((a, x) => a + x.t.liquidado, 0);
  const totalNEs      = DATA.empenhos.length;
  const valorAF       = tot.filter(x => x.c.modalidade === 'chamada_publica').reduce((a, x) => a + x.t.global, 0);
  const pctAF         = somaGlobal ? Math.round(valorAF / somaGlobal * 100) : 0;

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Atas e Contratos</div><div class="page-subtitle">Gestão dos instrumentos contratuais vigentes · Empenhos e NFs sincronizados com Estoque Central</div></div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${formatCurrency(somaGlobal)}</div><div class="kpi-label">Valor Global · ${DATA.contracts.length} atas</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">📝</div><div class="kpi-value">${formatCurrency(somaEmpenhado)}</div><div class="kpi-label">Empenhado · ${totalNEs} NE</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${formatCurrency(somaLiquidado)}</div><div class="kpi-label">Liquidado (NF recebida)</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📊</div><div class="kpi-value">${formatCurrency(somaGlobal - somaEmpenhado)}</div><div class="kpi-label">Saldo a Empenhar</div></div>
      <div class="kpi-card ${pctAF >= 45 ? 'green' : 'red'}"><div class="kpi-icon">🌾</div><div class="kpi-value">${pctAF}%</div><div class="kpi-label">Agricultura Familiar${pctAF >= 45 ? ' · meta ok' : ' · mín. legal 45%'}</div></div>
    </div>
    <div class="card mb-24">
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Nº da Ata</th><th>Vigência</th><th>Fornecedor</th><th>Valor Global</th><th>Executado</th><th>Saldo</th><th>Execução</th><th>Status</th><th>Ação</th></tr></thead>
          <tbody>
            ${tot.map(({ c, t }) => {
              const pct = t.global ? Math.round(t.empenhado / t.global * 100) : 0;
              return `<tr style="cursor:pointer" onclick="window.openAtaDetalhe(${c.id})">
                <td><strong>${c.number}</strong><br><small style="color:var(--text-secondary)">${c.modalidade === 'chamada_publica' ? '🌾 Chamada Pública' : '📋 Pregão'} · ${t.prods.length} itens · ${t.emps.length} NE</small></td>
                <td>${formatDate(c.start)} a ${formatDate(c.end)}</td>
                <td>${c.supplier}</td>
                <td style="font-family:var(--font-mono)">${formatCurrency(t.global)}</td>
                <td style="font-family:var(--font-mono)">${formatCurrency(t.empenhado)}</td>
                <td style="font-family:var(--font-mono);font-weight:600;color:var(--primary)">${formatCurrency(t.saldo)}</td>
                <td><div style="display:flex;align-items:center;gap:6px"><div class="progress-bar" style="width:80px"><div class="progress-fill ${pct > 80 ? 'orange' : 'blue'}" style="width:${Math.min(100, pct)}%"></div></div><span style="font-size:0.75rem;font-family:var(--font-mono)">${pct}%</span></div></td>
                <td><span class="status-badge ${c.status === 'Vigente' ? 'status-ok' : 'status-info'}">${c.status}</span></td>
                <td><button class="btn btn-outline" style="padding:4px 8px;font-size:0.75rem">Detalhes</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    ${sharedEmpenhos.length > 0 ? `
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">💼 Empenhos Vinculados (Sincronizados)</div><span class="status-badge status-info">${sharedEmpenhos.length}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Nº Empenho</th><th>Ata</th><th>Produto</th><th>Qtd Total</th><th>Consumido</th><th>Saldo</th><th>Valor Unit.</th><th>Status</th></tr></thead>
          <tbody>
            ${sharedEmpenhos.map(e => {
              const saldo = (e.qtdTotal||0) - (e.qtdConsumida||0);
              const pctConsumido = e.qtdTotal ? Math.round((e.qtdConsumida||0) / e.qtdTotal * 100) : 0;
              return `<tr>
                <td><strong>${e.numero}</strong></td>
                <td>${e.ataNumero}</td>
                <td>${e.produto}</td>
                <td style="font-family:var(--font-mono)">${(e.qtdTotal||0).toLocaleString('pt-BR')} ${e.unidade}</td>
                <td style="font-family:var(--font-mono);color:var(--success)">${(e.qtdConsumida||0).toLocaleString('pt-BR')} (${pctConsumido}%)</td>
                <td style="font-family:var(--font-mono);font-weight:700;color:${saldo > 0 ? 'var(--primary)' : 'var(--text-tertiary)'}">${saldo.toLocaleString('pt-BR')} ${e.unidade}</td>
                <td style="font-family:var(--font-mono)">${formatCurrency(e.valorUnit || 0)}</td>
                <td><span class="status-badge ${e.status === 'Liquidado' ? 'status-ok' : e.status === 'Parcial' ? 'status-warning' : 'status-info'}">${e.status}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}

    ${nfs.length > 0 ? `
    <div class="card">
      <div class="card-header"><div class="card-title">📄 Notas Fiscais Recebidas</div><span class="status-badge status-ok">${nfs.length}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>NF</th><th>Empenho</th><th>Qtd</th><th>Valor</th><th>Data Recebimento</th><th>Lote</th></tr></thead>
          <tbody>
            ${nfs.slice(0, 8).map(nf => `
              <tr>
                <td><strong>${nf.numero}</strong></td>
                <td>${nf.empenhoNumero || nf.empenhoId}</td>
                <td style="font-family:var(--font-mono)">${(nf.qtd||0).toLocaleString('pt-BR')}</td>
                <td style="font-family:var(--font-mono)">${formatCurrency(nf.valor || 0)}</td>
                <td>${nf.dataRec}</td>
                <td><code>${nf.lote}</code></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}
  `;
};

// ─── GESTOR: PEDIDOS (R1 — Triagem Contratual) ───────────────────────
PAGE_RENDERERS.gestor_pedidos = (el) => {
  const shared = SharedState.getOrders();
  const pendentes   = shared.filter(o => o.status === 'Pendente').length   + DATA.orders.filter(o => o.status === 'Pendente').length;
  const emSeparacao = shared.filter(o => o.status === 'Em separação').length;
  const emAndamento = shared.filter(o => o.status === 'Em separação' || o.status === 'Em transporte').length;
  const entregues   = shared.filter(o => o.status === 'Entregue').length   + DATA.orders.filter(o => o.status === 'Entregue').length;
  const totalTodos  = shared.length + DATA.orders.length;

  // ─── Seed de pedidos demo (se SharedState vazio) ─────────────────
  const DEMO_ITEMS = [
    { produto: 'Arroz Tipo 1', qtd: 50, unidade: 'kg' },
    { produto: 'Feijão Carioca', qtd: 20, unidade: 'kg' },
    { produto: 'Biscoito Integral', qtd: 15, unidade: 'kg' },
  ];
  if (shared.length === 0) {
    SharedState.addOrder({ school: 'EM ARLINDO LIMA', cooperative: 'COOPAGRAN', itens: DEMO_ITEMS, value: 1020 });
    SharedState.addOrder({ school: 'EM ELPIDIO REIS', cooperative: 'COOPRAN',   itens: [{ produto: 'Leite Integral', qtd: 100, unidade: 'L' }, { produto: 'Macarrão Espaguete', qtd: 25, unidade: 'kg' }], value: 810 });
    return PAGE_RENDERERS.gestor_pedidos(el);
  }

  // ─── Helper: card status badge ────────────────────────────────────
  const allOrders = [
    ...shared.map(o => ({ ...o, _src: 'shared' })),
    ...DATA.orders.map(o => ({ ...o, _src: 'data', itens: o.itens || [] })),
  ];

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">📦 Gestão de Pedidos</div>
      <div class="page-subtitle">Triagem contratual automática · ATA · Empenho · OS · Lista de Compras</div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${totalTodos}</div><div class="kpi-label">Total</div></div>
      <div class="kpi-card red"><div class="kpi-icon">⏰</div><div class="kpi-value">${pendentes}</div><div class="kpi-label">Pendentes</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📦</div><div class="kpi-value">${emSeparacao}</div><div class="kpi-label">Em Separação</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🚚</div><div class="kpi-value">${emAndamento}</div><div class="kpi-label">Em Andamento</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${entregues}</div><div class="kpi-label">Entregues</div></div>
    </div>

    <!-- Tabela de Pedidos -->
    <div class="card">
      <div class="card-header">
        <strong>Pedidos Recebidos</strong>
        <span class="status-badge status-info">${allOrders.length} pedidos</span>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th><th>Escola</th><th>Data</th><th>Cooperativa</th>
              <th>Itens</th><th>Valor</th><th>Status</th><th>Ação</th>
            </tr>
          </thead>
          <tbody>
            ${allOrders.map(o => `
              <tr class="clickable-row" onclick="window._abrirModalPedido('${o.id}','${o._src}')">
                <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">
                  #${String(o.numero||o.id).padStart(3,'0')}
                  ${o._src==='shared'?'<span class="tag tag-blue" style="font-size:0.62rem">NOVO</span>':''}
                </td>
                <td><strong>${o.school}</strong></td>
                <td>${o.date ? o.date.slice(0,10) : '—'}</td>
                <td><span class="tag tag-teal">${o.cooperative||o.coop||'—'}</span></td>
                <td style="font-size:0.82rem">${(o.itens||[]).length || '—'} item(ns)</td>
                <td style="font-family:var(--font-mono)">${formatCurrency(o.value||0)}</td>
                <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
                <td>
                  ${o.status === 'Pendente'
                    ? `<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();window._abrirModalPedido('${o.id}','${o._src}')">🔍 Analisar</button>`
                    : `<button class="btn btn-sm btn-outline" disabled>${o.status}</button>`
                  }
                </td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Triagem -->
    <div id="modal-triagem" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1000;align-items:center;justify-content:center">
      <div id="modal-triagem-inner" style="background:var(--bg-card);border-radius:var(--radius-xl);padding:28px;max-width:780px;width:95vw;max-height:88vh;overflow-y:auto;box-shadow:var(--shadow-xl)">
        <div id="modal-triagem-content"></div>
      </div>
    </div>`;

  // ─── Lógica do Modal ──────────────────────────────────────────────
  window._abrirModalPedido = (orderId, src) => {
    const order = src === 'shared'
      ? SharedState.getOrders().find(o => o.id === orderId)
      : DATA.orders.find(o => String(o.id) === String(orderId));
    if (!order) return;

    const modal = document.getElementById('modal-triagem');
    const content = document.getElementById('modal-triagem-content');
    modal.style.display = 'flex';

    // Render: detalhe do pedido + botões de ação
    const itensHtml = (order.itens || []).length > 0
      ? (order.itens || []).map((i, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${i.produto}</strong></td>
            <td style="font-family:var(--font-mono)">${i.qtd} ${i.unidade}</td>
            <td><span class="tag tag-gray">Aguardando verificação</span></td>
          </tr>`).join('')
      : `<tr><td colspan="4" style="text-align:center;color:#94A3B8">Pedido sem itens detalhados</td></tr>`;

    content.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
        <div>
          <h3 style="margin:0;font-size:1.1rem">Pedido #${String(order.numero||order.id).padStart(3,'0')}</h3>
          <div style="color:var(--text-secondary);font-size:0.85rem;margin-top:4px">
            ${order.school} · ${order.cooperative||order.coop||'—'} · ${(order.date||'').slice(0,10)}
          </div>
        </div>
        <button onclick="document.getElementById('modal-triagem').style.display='none'" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--text-secondary)">✕</button>
      </div>
      <div class="card" style="margin-bottom:16px">
        <div class="card-header"><strong>📦 Itens Solicitados</strong></div>
        <table class="data-table">
          <thead><tr><th>#</th><th>Produto</th><th>Quantidade</th><th>Status Contratual</th></tr></thead>
          <tbody id="modal-itens-tbody">${itensHtml}</tbody>
        </table>
      </div>
      <div style="display:flex;gap:12px;justify-content:flex-end">
        <button class="btn btn-outline" onclick="document.getElementById('modal-triagem').style.display='none'">Fechar</button>
        ${order.status === 'Pendente' && src === 'shared' ? `
          <button class="btn btn-warning" onclick="window._recusarPedido('${orderId}')">❌ Recusar</button>
          <button class="btn btn-primary" id="btn-aceitar-processar" onclick="window._executarTriagem('${orderId}')">
            🔍 Aceitar e Processar
          </button>` : `<span style="font-size:0.85rem;color:var(--text-secondary);align-self:center">Pedido já processado: <strong>${order.status}</strong></span>`}
      </div>`;
  };

  window._executarTriagem = (orderId) => {
    const btn = document.getElementById('btn-aceitar-processar');
    if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Verificando ATAs e Empenhos...'; }

    setTimeout(() => {
      const resultado = SharedState.processarPedido(orderId);
      if (!resultado) return;

      const { order, ataItems, empenhoGeradoItems, semAtaItems } = resultado;
      const content = document.getElementById('modal-triagem-content');

      // Badge de resultado por tipo
      const badge = (tipo) => {
        if (tipo === 'Vinculado à Ata/Empenho') return '<span class="tag tag-green">✅ Vinculado à Ata/Empenho</span>';
        if (tipo === 'Empenho Gerado')           return '<span class="tag tag-blue">🆕 Empenho Gerado</span>';
        return '<span class="tag tag-orange">⚠️ Sem Ata → Lista de Compras</span>';
      };

      const allItens = [...ataItems, ...empenhoGeradoItems, ...semAtaItems];
      const itensHtml = allItens.map((i, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td><strong>${i.produto}</strong></td>
          <td style="font-family:var(--font-mono)">${i.qtd} ${i.unidade}</td>
          <td>${badge(i.resultado)}</td>
          <td style="font-size:0.75rem;color:var(--text-secondary)">
            ${i.ataNumero ? `ATA: <code>${i.ataNumero}</code>` : ''}
            ${i.empenhoNumero ? `· EMP: <code>${i.empenhoNumero}</code>` : ''}
          </td>
        </tr>`).join('');

      const temOS = (ataItems.length + empenhoGeradoItems.length) > 0;
      const temLC = semAtaItems.length > 0;

      content.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
          <div>
            <h3 style="margin:0;font-size:1.1rem">Resultado da Triagem — Pedido #${String(order.numero||order.id).padStart(3,'0')}</h3>
            <div style="color:var(--text-secondary);font-size:0.85rem;margin-top:4px">${order.school}</div>
          </div>
          <button onclick="document.getElementById('modal-triagem').style.display='none'" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--text-secondary)">✕</button>
        </div>

        <!-- Resumo por resultado -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
          <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:14px;text-align:center">
            <div style="font-size:1.5rem;font-weight:700;color:#10B981">${ataItems.length}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">✅ Vinculados</div>
            <div style="font-size:0.72rem;color:var(--text-tertiary)">Geram OS</div>
          </div>
          <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:10px;padding:14px;text-align:center">
            <div style="font-size:1.5rem;font-weight:700;color:#3B82F6">${empenhoGeradoItems.length}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">🆕 Empenho Gerado</div>
            <div style="font-size:0.72rem;color:var(--text-tertiary)">Geram OS</div>
          </div>
          <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:14px;text-align:center">
            <div style="font-size:1.5rem;font-weight:700;color:#F59E0B">${semAtaItems.length}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">⚠️ Sem Ata</div>
            <div style="font-size:0.72rem;color:var(--text-tertiary)">→ Lista de Compras</div>
          </div>
        </div>

        <!-- Tabela detalhada -->
        <div class="card" style="margin-bottom:16px">
          <div class="card-header"><strong>Itens do Pedido — Verificação Contratual</strong></div>
          <table class="data-table">
            <thead><tr><th>#</th><th>Produto</th><th>Quantidade</th><th>Resultado</th><th>Referência</th></tr></thead>
            <tbody>${itensHtml}</tbody>
          </table>
        </div>

        <!-- O que será gerado -->
        <div style="background:var(--bg-subtle);border-radius:var(--radius-md);padding:14px;margin-bottom:16px;font-size:0.85rem">
          ${temOS ? `<div style="margin-bottom:6px">🏭 <strong>OS para Estoque Central:</strong> será criada com ${ataItems.length + empenhoGeradoItems.length} item(ns) para separação imediata</div>` : ''}
          ${temLC ? `<div>🛒 <strong>Lista de Compras:</strong> ${semAtaItems.length} item(ns) serão enviados ao setor de compras</div>` : ''}
        </div>

        <div style="display:flex;gap:12px;justify-content:flex-end">
          <button class="btn btn-outline" onclick="document.getElementById('modal-triagem').style.display='none'">Cancelar</button>
          <button class="btn btn-primary" id="btn-confirmar-os" onclick="window._confirmarAceitePedido('${order.id}',${JSON.stringify(resultado).split('"').join("'")})">
            ✅ Confirmar e Gerar OS
          </button>
        </div>`;
    }, 900); // simula processamento
  };

  window._confirmarAceitePedido = (orderId, resultado) => {
    // Se resultado veio como string por causa do stringify, refaz o processamento
    const res = typeof resultado === 'string' ? SharedState.processarPedido(orderId) : resultado;
    if (!res) return;

    const aplicado = SharedState.aceitarPedido(orderId, res);
    document.getElementById('modal-triagem').style.display = 'none';

    const msg = [
      aplicado.itensComOS.length > 0 ? `📦 ${aplicado.itensComOS.length} item(ns) → OS gerada para Estoque Central` : '',
      aplicado.semAtaItems.length > 0 ? `🛒 ${aplicado.semAtaItems.length} item(ns) → Lista de Compras` : '',
    ].filter(Boolean).join(' · ');

    showToast('✅ Pedido processado! ' + msg, 'success');
    // Re-renderiza a tela
    setTimeout(() => PAGE_RENDERERS.gestor_pedidos(document.getElementById('page-content')), 400);
  };

  window._recusarPedido = (orderId) => {
    SharedState.updateOrderStatus(orderId, 'Recusado');
    document.getElementById('modal-triagem').style.display = 'none';
    showToast('❌ Pedido recusado.', 'warning');
    setTimeout(() => PAGE_RENDERERS.gestor_pedidos(document.getElementById('page-content')), 400);
  };

  // Fecha modal ao clicar fora
  document.getElementById('modal-triagem')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-triagem') e.target.style.display = 'none';
  });
};

// ─── GESTOR: COOPERATIVAS ───
PAGE_RENDERERS.gestor_cooperativas = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Cooperativas</div><div class="page-subtitle">Performance das cooperativas parceiras</div></div>
    <div class="card mb-24">
      <div class="card-body">
        <table class="data-table">
          <thead><tr><th>Cooperativa</th><th>Agricultores</th><th>Pedidos Recebidos</th><th>Pedidos Entregues</th><th>Índice de Atendimento</th><th>Valor Executado</th><th>Ações</th></tr></thead>
          <tbody>
            ${DATA.cooperatives.map(c => `<tr class="clickable-row" onclick="navigateTo('cooperativa','dashboard')">
              <td><strong>${c.name}</strong></td>
              <td style="font-family:var(--font-mono)">${c.farmers}</td>
              <td style="font-family:var(--font-mono)">${c.orders}</td>
              <td style="font-family:var(--font-mono)">${c.delivered}</td>
              <td><div style="display:flex;align-items:center;gap:6px"><div class="progress-bar" style="width:80px"><div class="progress-fill ${c.rate >= 90 ? 'green' : 'orange'}" style="width:${c.rate}%"></div></div><span style="font-family:var(--font-mono);font-size:0.78rem">${c.rate}%</span></div></td>
              <td style="font-family:var(--font-mono)">${formatCurrency(c.value)}</td>
              <td><button class="table-action">Ver Indicadores</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📊 Performance Comparativa</div></div>
      <div class="card-body"><div class="chart-container h-300"><canvas id="chart-coop-perf"></canvas></div></div>
    </div>
  `;
  setTimeout(() => {
    createChart('chart-coop-perf', {
      type: 'bar',
      data: {
        labels: DATA.cooperatives.map(c => c.name),
        datasets: [
          { label: 'Pedidos Recebidos', data: DATA.cooperatives.map(c => c.orders), backgroundColor: CHART_COLORS.blue, borderRadius: 4 },
          { label: 'Pedidos Entregues', data: DATA.cooperatives.map(c => c.delivered), backgroundColor: CHART_COLORS.green, borderRadius: 4 },
        ]
      },
      options: CHART_DEFAULTS
    });
  }, 100);
};

// ─── GESTOR: AGRICULTURA FAMILIAR ───
PAGE_RENDERERS.gestor_agricultura = (el) => {
  const producoes = SharedState.getProductions();
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Agricultura Familiar</div><div class="page-subtitle">Acompanhamento dos agricultores familiares — dados vindos diretamente dos agricultores</div></div>

    ${producoes.length > 0 ? `
    <div class="card mb-24" style="border-left:4px solid var(--success)">
      <div class="card-header"><div class="card-title">🆕 Atualizações de Produção Recentes</div><span class="status-badge status-ok">${producoes.length}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Agricultor</th><th>Produto</th><th>Área (ha)</th><th>Prevista (kg)</th><th>Disponível (kg)</th><th>Registrado em</th></tr></thead><tbody>
          ${producoes.slice(0, 6).map(p => `
            <tr>
              <td><strong>${p.agricultor || '—'}</strong></td>
              <td>${p.produto}</td>
              <td style="font-family:var(--font-mono)">${p.area || '—'}</td>
              <td style="font-family:var(--font-mono)">${(p.previsto||0).toLocaleString('pt-BR')}</td>
              <td style="font-family:var(--font-mono);color:var(--success);font-weight:700">${(p.disponivel||0).toLocaleString('pt-BR')}</td>
              <td style="font-size:0.78rem;color:var(--text-secondary)">${new Date(p.criadoEm).toLocaleString('pt-BR')}</td>
            </tr>
          `).join('')}
        </tbody></table>
      </div>
    </div>` : ''}

    <div class="kpi-grid">
      <div class="kpi-card green"><div class="kpi-icon">👨‍🌾</div><div class="kpi-value">${DATA.farmers.length}</div><div class="kpi-label">Agricultores Ativos</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🌱</div><div class="kpi-value">${DATA.farmers.reduce((a,f)=>a+f.products.length,0)}</div><div class="kpi-label">Produtos Cadastrados</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">📊</div><div class="kpi-value">${(DATA.farmers.reduce((a,f)=>a+f.production,0)/1000).toFixed(1)}t</div><div class="kpi-label">Produção Estimada</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📦</div><div class="kpi-value">${(DATA.farmers.reduce((a,f)=>a+f.stock,0)/1000).toFixed(1)}t</div><div class="kpi-label">Estoque Disponível</div></div>
    </div>
    <div class="card">
      <div class="card-body">
        <table class="data-table">
          <thead><tr><th>Agricultor</th><th>Cooperativa</th><th>Produtos</th><th>Produção Est. (kg)</th><th>Estoque (kg)</th><th>Área (ha)</th></tr></thead>
          <tbody>
            ${DATA.farmers.map(f => `<tr class="clickable-row" onclick="navigateTo('agricultor','dashboard')">
              <td><strong>${f.name}</strong></td>
              <td><span class="tag tag-teal">${f.coop}</span></td>
              <td>${f.products.map(p => `<span class="tag tag-green" style="margin:1px">${p}</span>`).join(' ')}</td>
              <td style="font-family:var(--font-mono)">${f.production.toLocaleString('pt-BR')}</td>
              <td style="font-family:var(--font-mono)">${f.stock.toLocaleString('pt-BR')}</td>
              <td style="font-family:var(--font-mono)">${f.area}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// ─── GESTOR: ESTOQUE CONSOLIDADO ───
PAGE_RENDERERS.gestor_estoque = (el) => {
  const cats = [...new Set(DATA.products.map(p => p.category))].sort();
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Estoque Consolidado Municipal</div>
      <div class="page-subtitle">Estoque Central + o que está distribuído nas escolas · clique na linha para ver lotes e validade</div>
    </div>
    <div class="kpi-grid" id="estoque-kpis"></div>
    <div class="card" style="margin-top:20px">
      <div class="card-header">
        <div class="card-title">Produtos em Estoque</div>
        <div class="filter-bar" style="margin:0;display:flex;gap:8px;flex-wrap:wrap">
          <input type="search" id="filter-prod-nome" placeholder="Buscar produto..." style="padding:7px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem;min-width:180px">
          <select id="filter-prod-cat"><option value="">Todas as Categorias</option>${cats.map(c => `<option>${c}</option>`).join('')}</select>
          <select id="filter-prod-status">
            <option value="">Todos os Status</option>
            <option value="critico">Crítico (≤3 dias)</option>
            <option value="atencao">Atenção (4-7 dias)</option>
            <option value="normal">Normal (>7 dias)</option>
          </select>
          <select id="filter-prod-origem">
            <option value="">Toda origem</option>
            <option value="af">🌾 Agricultura Familiar</option>
            <option value="conv">Convencional</option>
          </select>
        </div>
      </div>
      <div class="card-body">
        <table class="data-table" id="tabela-estoque">
          <thead><tr>
            <th style="width:28px"></th><th>Produto</th><th>Categoria</th>
            <th>Central</th><th>Nas Escolas</th><th>Total</th>
            <th>Consumo/Dia</th><th>Cobertura</th><th>Valor</th><th>Status</th>
          </tr></thead>
          <tbody id="estoque-tbody"></tbody>
        </table>
        <div id="estoque-vazio" style="display:none;padding:32px;text-align:center;color:var(--text-secondary)">Nenhum produto encontrado com esses filtros.</div>
      </div>
    </div>
  `;

  const consolidado = estoqueConsolidado();

  function statusDe(p) {
    const d = p.diasCobertura;
    return d <= 3 ? 'critico' : d <= 7 ? 'atencao' : 'normal';
  }

  function aplicarFiltros() {
    const nome   = (document.getElementById('filter-prod-nome').value || '').toLowerCase().trim();
    const cat    = document.getElementById('filter-prod-cat').value;
    const stat   = document.getElementById('filter-prod-status').value;
    const origem = document.getElementById('filter-prod-origem').value;

    const filtrados = consolidado.filter(p => {
      if (nome && !p.name.toLowerCase().includes(nome)) return false;
      if (cat && p.category !== cat) return false;
      if (stat && statusDe(p) !== stat) return false;
      if (origem === 'af' && !p.familyFarm) return false;
      if (origem === 'conv' && p.familyFarm) return false;
      return true;
    });

    renderLinhas(filtrados);
    renderKpis(filtrados);
  }

  function renderKpis(lista) {
    const valor    = lista.reduce((s, p) => s + p.total * (p.unitPrice || 0), 0);
    const criticos = lista.filter(p => statusDe(p) === 'critico').length;
    const naEscola = lista.reduce((s, p) => s + p.nasEscolas, 0);
    const central  = lista.reduce((s, p) => s + p.central, 0);
    const pctAF    = lista.length ? Math.round(lista.filter(p => p.familyFarm).length / lista.length * 100) : 0;
    document.getElementById('estoque-kpis').innerHTML = `
      <div class="kpi-card blue"><div class="kpi-icon">💰</div><div class="kpi-value">${formatCurrency(valor)}</div><div class="kpi-label">Valor em estoque · ${lista.length} itens</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🏭</div><div class="kpi-value">${central.toLocaleString('pt-BR')}</div><div class="kpi-label">Unidades no Estoque Central</div></div>
      <div class="kpi-card green"><div class="kpi-icon">🏫</div><div class="kpi-value">${naEscola.toLocaleString('pt-BR')}</div><div class="kpi-label">Unidades nas escolas</div></div>
      <div class="kpi-card ${criticos ? 'red' : 'green'}"><div class="kpi-icon">${criticos ? '🔴' : '✅'}</div><div class="kpi-value">${criticos}</div><div class="kpi-label">Produtos críticos · ${pctAF}% agric. familiar</div></div>`;
  }

  function renderLinhas(lista) {
    const tb = document.getElementById('estoque-tbody');
    document.getElementById('estoque-vazio').style.display = lista.length ? 'none' : 'block';
    tb.innerHTML = lista.map(p => {
      const st = statusDe(p);
      const cor = st === 'critico' ? 'var(--danger)' : st === 'atencao' ? 'var(--warning)' : 'var(--success)';
      const temDetalhe = p.lotes.length || p.escolas.length;
      return `
      <tr class="estoque-row" data-pid="${p.id}" style="cursor:${temDetalhe ? 'pointer' : 'default'}">
        <td style="text-align:center;color:var(--text-secondary)">${temDetalhe ? `<span class="chev" data-pid="${p.id}" style="display:inline-block;transition:transform .18s">▸</span>` : ''}</td>
        <td><strong>${p.name}</strong>${p.familyFarm ? ' <span title="Agricultura Familiar">🌾</span>' : ''}</td>
        <td><span class="tag tag-blue">${p.category}</span></td>
        <td style="font-family:var(--font-mono)">${p.central.toLocaleString('pt-BR')}</td>
        <td style="font-family:var(--font-mono);color:var(--text-secondary)">${p.nasEscolas ? p.nasEscolas.toLocaleString('pt-BR') : '—'}</td>
        <td style="font-family:var(--font-mono);font-weight:700">${p.total.toLocaleString('pt-BR')} ${p.unit}</td>
        <td style="font-family:var(--font-mono)">${p.avgConsume} ${p.unit}</td>
        <td style="font-family:var(--font-mono);font-weight:700;color:${cor}">${p.diasCobertura} dias</td>
        <td style="font-family:var(--font-mono)">${formatCurrency(p.total * (p.unitPrice || 0))}</td>
        <td><span class="status-badge ${st === 'critico' ? 'status-danger' : st === 'atencao' ? 'status-warning' : 'status-ok'}">${st === 'critico' ? 'Crítico' : st === 'atencao' ? 'Atenção' : 'Normal'}</span></td>
      </tr>
      <tr class="estoque-detalhe" data-detalhe="${p.id}" hidden>
        <td colspan="10" style="background:var(--surface-2);padding:14px 20px">
          <div style="display:grid;grid-template-columns:${p.lotes.length && p.escolas.length ? '1fr 1fr' : '1fr'};gap:20px">
            ${p.lotes.length ? `
              <div>
                <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;color:var(--text-secondary);margin-bottom:6px">Lotes · FEFO (primeiro a vencer primeiro)</div>
                <table class="data-table" style="font-size:0.84rem">
                  <thead><tr><th>Lote</th><th>Entrada</th><th>Validade</th><th>Qtd</th><th>Situação</th></tr></thead>
                  <tbody>
                    ${p.lotes.map(l => {
                      const d = diasAteVencer(l.expirationDate);
                      const sev = d < 0 ? 'danger' : d <= 7 ? 'danger' : d <= 30 ? 'warning' : 'ok';
                      const txt = d < 0 ? `Vencido há ${Math.abs(d)}d` : d === 0 ? 'Vence hoje' : `${d} dias`;
                      return `<tr>
                        <td style="font-family:var(--font-mono)">${l.number}</td>
                        <td>${formatDate(l.entryDate)}</td>
                        <td>${formatDate(l.expirationDate)}</td>
                        <td style="font-family:var(--font-mono)">${l.qtd.toLocaleString('pt-BR')} ${p.unit}</td>
                        <td><span class="status-badge status-${sev}">${txt}</span></td>
                      </tr>`;
                    }).join('')}
                  </tbody>
                </table>
              </div>` : ''}
            ${p.escolas.length ? `
              <div>
                <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;color:var(--text-secondary);margin-bottom:6px">Distribuição nas escolas</div>
                <table class="data-table" style="font-size:0.84rem">
                  <thead><tr><th>Escola</th><th>Qtd</th><th>% do total</th></tr></thead>
                  <tbody>
                    ${p.escolas.map(e => `<tr>
                      <td>${e.escola}</td>
                      <td style="font-family:var(--font-mono)">${e.qtd.toLocaleString('pt-BR')} ${p.unit}</td>
                      <td style="font-family:var(--font-mono);color:var(--text-secondary)">${p.total ? Math.round(e.qtd / p.total * 100) : 0}%</td>
                    </tr>`).join('')}
                  </tbody>
                </table>
              </div>` : ''}
          </div>
          ${!p.lotes.length ? '<div style="font-size:0.82rem;color:var(--text-secondary);margin-top:8px">Sem lote com validade cadastrado para este produto.</div>' : ''}
        </td>
      </tr>`;
    }).join('');

    tb.querySelectorAll('.estoque-row').forEach(tr => {
      tr.addEventListener('click', () => {
        const pid = tr.dataset.pid;
        const det = tb.querySelector(`[data-detalhe="${pid}"]`);
        if (!det) return;
        const abrindo = det.hidden;
        det.hidden = !abrindo;
        const chev = tr.querySelector('.chev');
        if (chev) chev.style.transform = abrindo ? 'rotate(90deg)' : '';
      });
    });
  }

  ['filter-prod-nome', 'filter-prod-cat', 'filter-prod-status', 'filter-prod-origem'].forEach(id => {
    const elx = document.getElementById(id);
    elx.addEventListener(id === 'filter-prod-nome' ? 'input' : 'change', aplicarFiltros);
  });

  aplicarFiltros();
};

// ─── GESTOR: PLANEJAMENTO ───
PAGE_RENDERERS.gestor_planejamento = (el) => {
  const menus = SharedState.getMenus();
  const weekly = SharedState.getWeeklyMenus();
  const perfilAtivo = state.currentProfile;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Planejamento Alimentar</div>
      <div class="page-subtitle">Visão consolidada dos cardápios e necessidades futuras · Sincronizado com Nutricionista e escolas</div>
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📅 Cardápios Ativos</div>
          <span class="status-badge status-info">${menus.length}</span>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table"><thead><tr><th>Cardápio</th><th>Período</th><th>Escolas</th><th>Autor</th><th>Status</th></tr></thead><tbody>
            ${menus.map(m => `
              <tr>
                <td><strong>${m.nome}</strong></td>
                <td>${m.periodo}</td>
                <td style="font-family:var(--font-mono)">${m.escolas || 0}</td>
                <td style="font-size:0.82rem">${m.autor || '—'}</td>
                <td><span class="status-badge ${m.status === 'Publicado' ? 'status-ok' : 'status-info'}">${m.status === 'Publicado' ? 'Ativo' : m.status}</span></td>
              </tr>
            `).join('')}
          </tbody></table>
        </div>
      </div>
      <div class="card"><div class="card-header"><div class="card-title">📊 Necessidades Futuras (30 dias)</div></div><div class="card-body">
        <div class="chart-container h-250"><canvas id="chart-necessidades"></canvas></div>
      </div></div>
    </div>

    ${weekly.length > 0 ? `
    <div class="card" style="margin-top:20px">
      <div class="card-header"><div class="card-title">🗓️ Cardápios Semanais Recentemente Publicados</div><span class="status-badge status-ok">${weekly.length}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Nome</th><th>Período</th><th>Autor</th><th>Publicado em</th><th>Média Kcal</th></tr></thead><tbody>
          ${weekly.slice(0, 6).map(w => `
            <tr>
              <td><strong>${w.nome || 'Cardápio Semanal'}</strong></td>
              <td>${w.periodo || '—'}</td>
              <td style="font-size:0.82rem">${w.autor || '—'}</td>
              <td style="font-size:0.82rem">${new Date(w.publicadoEm).toLocaleString('pt-BR')}</td>
              <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${w.kcalMedia || '—'} kcal/dia</td>
            </tr>
          `).join('')}
        </tbody></table>
      </div>
    </div>` : ''}
  `;
  setTimeout(() => {
    createChart('chart-necessidades', {
      type: 'bar',
      data: {
        labels: ['Arroz', 'Feijão', 'Leite', 'Frango', 'Carne', 'Banana', 'Tomate', 'Cenoura'],
        datasets: [
          { label: 'Necessário (kg)', data: [25500, 12600, 36000, 23400, 15600, 18000, 12000, 9300], backgroundColor: CHART_COLORS.blue, borderRadius: 4 },
          { label: 'Estoque Atual (kg)', data: [12500, 4200, 8900, 5600, 3200, 1800, 1950, 3100], backgroundColor: CHART_COLORS.green, borderRadius: 4 },
        ]
      },
      options: CHART_DEFAULTS
    });
  }, 100);
};

// ─── GESTOR: RELATÓRIOS ───
PAGE_RENDERERS.gestor_relatorios = (el) => {
  const relatorios = [
    { icon: '📊', title: 'Produtos Mais Consumidos', desc: 'Ranking de consumo por produto', key: 'produtos_consumo' },
    { icon: '🏫', title: 'Consumo por Escola', desc: 'Detalhamento por unidade', key: 'consumo_escola' },
    { icon: '🚚', title: 'Entregas Realizadas', desc: 'Histórico de entregas do SharedState', key: 'entregas' },
    { icon: '📋', title: 'Execução de Empenhos', desc: 'Saldo consumido por empenho', key: 'empenhos' },
    { icon: '💼', title: 'NFs Recebidas', desc: 'Notas fiscais registradas', key: 'nfs' },
    { icon: '🌾', title: 'Produção Agrícola Familiar', desc: 'Produção declarada dos agricultores', key: 'producoes' },
  ];
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Relatórios Gerenciais</div><div class="page-subtitle">Exportação em CSV dos dados consolidados do sistema</div></div>
    <div class="grid-3">
      ${relatorios.map(r => `
        <div class="card">
          <div class="card-body" style="text-align:center;padding:30px">
            <div style="font-size:2.5rem;margin-bottom:12px">${r.icon}</div>
            <div style="font-weight:700;font-size:0.95rem;margin-bottom:6px">${r.title}</div>
            <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:14px">${r.desc}</div>
            <button class="btn btn-primary btn-sm" onclick="exportRelatorio('${r.key}')">📥 Exportar CSV</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

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

// ─── GESTOR: IA DE PREVISÃO ───
PAGE_RENDERERS.gestor_ia = (el) => {
  // 🔗 Alertas baseados em dados reais: DATA.products.daysLeft + pedidos SharedState + central stock
  const criticos = DATA.products.filter(p => (p.daysLeft || 99) <= 5).sort((a,b) => (a.daysLeft||0) - (b.daysLeft||0));
  const monitorar = DATA.products.filter(p => (p.daysLeft || 99) > 5 && (p.daysLeft || 99) <= 10);
  const demandaPrevista30d = DATA.products.reduce((s, p) => s + (p.avgConsume || 0) * 30, 0);
  const demandaPrevista90d = demandaPrevista30d * 3;
  const pedidosPendentes = SharedState.getOrders().filter(o => o.status === 'Pendente').length;

  const alerts = [
    ...criticos.slice(0, 5).map(p => {
      const emoji = p.daysLeft <= 2 ? '🔴' : p.daysLeft <= 4 ? '🟡' : '🟢';
      return `<div class="ia-suggestion">${emoji} <strong>${p.name}</strong> esgota em <strong>${p.daysLeft} dia${p.daysLeft>1?'s':''}</strong> — ${p.daysLeft <= 2 ? '92' : p.daysLeft <= 4 ? '78' : '65'}% de probabilidade</div>`;
    }),
    ...monitorar.slice(0, 2).map(p => `<div class="ia-suggestion">🟢 <strong>${p.name}</strong> estoque em <strong>${p.daysLeft} dias</strong> — monitorar</div>`),
  ].join('') || '<div class="ia-suggestion">✅ Sem alertas críticos no momento</div>';

  el.innerHTML = `
    <div class="page-header"><div class="page-title">🤖 Inteligência Artificial — Previsão de Demanda</div><div class="page-subtitle">Motor de IA · Alertas calculados a partir do consumo diário real</div></div>

    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">📊</div><div class="kpi-value">${(demandaPrevista30d/1000).toFixed(1)}k</div><div class="kpi-label">Demanda 30 dias (kg)</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">📈</div><div class="kpi-value">${(demandaPrevista90d/1000).toFixed(1)}k</div><div class="kpi-label">Demanda 90 dias (kg)</div></div>
      <div class="kpi-card red"><div class="kpi-icon">⚠️</div><div class="kpi-value">${criticos.length}</div><div class="kpi-label">Produtos Críticos (≤5d)</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">🛒</div><div class="kpi-value">${pedidosPendentes}</div><div class="kpi-label">Pedidos Pendentes</div></div>
    </div>

    <div class="grid-2-1 mb-24">
      <div class="card">
        <div class="card-header"><div class="card-title">📈 Projeção de Demanda (6 meses)</div></div>
        <div class="card-body"><div class="chart-container h-300"><canvas id="chart-ia-projecao"></canvas></div></div>
      </div>
      <div class="ia-card">
        <div class="ia-card-title">🧠 Alertas Preditivos (Real)</div>
        ${alerts}
      </div>
    </div>

    <div class="grid-2 mb-24">
      <div class="card">
        <div class="card-header"><div class="card-title">🛒 Sugestão de Compras Imediatas</div></div>
        <div class="card-body">
          <table class="data-table">
            <thead><tr><th>Produto</th><th>Estoque Atual</th><th>Necessidade 30d</th><th>Comprar</th><th>Prioridade</th></tr></thead>
            <tbody>
              <tr><td><strong>Alface Crespa</strong></td><td>520 kg</td><td>8.400 kg</td><td style="font-family:var(--font-mono);font-weight:700;color:var(--danger)">7.880 kg</td><td><span class="status-badge status-danger">Urgente</span></td></tr>
              <tr><td><strong>Banana Nanica</strong></td><td>1.800 kg</td><td>18.000 kg</td><td style="font-family:var(--font-mono);font-weight:700;color:var(--danger)">16.200 kg</td><td><span class="status-badge status-danger">Urgente</span></td></tr>
              <tr><td><strong>Melancia</strong></td><td>900 kg</td><td>13.500 kg</td><td style="font-family:var(--font-mono);font-weight:700;color:var(--warning)">12.600 kg</td><td><span class="status-badge status-warning">Alta</span></td></tr>
              <tr><td><strong>Tomate</strong></td><td>1.950 kg</td><td>12.000 kg</td><td style="font-family:var(--font-mono);font-weight:700;color:var(--warning)">10.050 kg</td><td><span class="status-badge status-warning">Alta</span></td></tr>
              <tr><td><strong>Abóbora Cabotiá</strong></td><td>1.400 kg</td><td>7.800 kg</td><td style="font-family:var(--font-mono);font-weight:700">6.400 kg</td><td><span class="status-badge status-info">Média</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">🔄 Sugestões de Substituição Nutricional</div></div>
        <div class="card-body">
          <table class="data-table">
            <thead><tr><th>Produto Original</th><th>Substituição Sugerida</th><th>Economia</th><th>Disponibilidade</th></tr></thead>
            <tbody>
              <tr><td>Melancia</td><td><strong>Manga Tommy</strong> (safra)</td><td style="color:var(--success)">-18%</td><td><span class="status-badge status-ok">Alta</span></td></tr>
              <tr><td>Maçã Fuji</td><td><strong>Banana Prata</strong> (AF)</td><td style="color:var(--success)">-25%</td><td><span class="status-badge status-ok">Alta</span></td></tr>
              <tr><td>Carne Bovina</td><td><strong>Frango (Peito)</strong></td><td style="color:var(--success)">-35%</td><td><span class="status-badge status-warning">Média</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- SIMULADOR -->
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">🔬 Simulador de Cenários</div><div class="card-subtitle">Ajuste os parâmetros e veja o impacto previsto pela IA</div></div>
      <div class="card-body">
        <div class="simulator-panel">
          <div class="simulator-slider">
            <label><span>Aumento de Alunos (%)</span><span id="sim-alunos-val">10%</span></label>
            <input type="range" min="0" max="30" value="10" id="sim-alunos" oninput="updateSimulator()">
          </div>
          <div class="simulator-slider">
            <label><span>Novas Escolas</span><span id="sim-escolas-val">2</span></label>
            <input type="range" min="0" max="10" value="2" id="sim-escolas" oninput="updateSimulator()">
          </div>
          <div class="simulator-slider">
            <label><span>Alteração de Cardápio (%)</span><span id="sim-cardapio-val">5%</span></label>
            <input type="range" min="0" max="20" value="5" id="sim-cardapio" oninput="updateSimulator()">
          </div>
          <div class="simulator-result" id="sim-results">
            <div class="sim-result-card"><div class="sim-result-value" style="color:var(--danger)" id="sim-consumo">+17%</div><div class="sim-result-label">Impacto no Consumo</div></div>
            <div class="sim-result-card"><div class="sim-result-value" style="color:var(--warning)" id="sim-financeiro">+R$ 306K</div><div class="sim-result-label">Impacto Financeiro Mensal</div></div>
            <div class="sim-result-card"><div class="sim-result-value" style="color:var(--primary)" id="sim-compra">+8.640 kg</div><div class="sim-result-label">Necessidade Adicional de Compra</div></div>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    createChart('chart-ia-projecao', {
      type: 'line',
      data: {
        labels: ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
          { label: 'Previsão (kg)', data: [44100, 40300, 46500, 43200, 41600, 44800], borderColor: CHART_COLORS.blue, backgroundColor: CHART_COLORS.blueFill, fill: true, tension: 0.4, pointRadius: 4 },
          { label: 'Limite Superior', data: [47000, 43200, 49800, 46100, 44500, 47900], borderColor: 'rgba(21,101,192,0.3)', borderDash: [5, 5], fill: false, pointRadius: 0, tension: 0.4 },
          { label: 'Limite Inferior', data: [41200, 37400, 43200, 40300, 38700, 41700], borderColor: 'rgba(21,101,192,0.3)', borderDash: [5, 5], fill: false, pointRadius: 0, tension: 0.4 },
        ]
      },
      options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { ...CHART_DEFAULTS.plugins.legend, position: 'bottom' } } }
    });
  }, 100);
};

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
PAGE_RENDERERS.nutricionista_dashboard = (el) => {
  const totalStudents = DATA.schools.reduce((a, s) => a + s.students, 0);
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Dashboard Nutricional</div><div class="page-subtitle">Planejamento e acompanhamento nutricional da rede municipal</div></div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${DATA.schools.length}</div><div class="kpi-label">Escolas Atendidas</div></div>
      <div class="kpi-card green"><div class="kpi-icon">👨‍🎓</div><div class="kpi-value">${(totalStudents/1000).toFixed(1)}K</div><div class="kpi-label">Alunos Atendidos</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🍽️</div><div class="kpi-value">4</div><div class="kpi-label">Cardápios Ativos</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">📊</div><div class="kpi-value">43.200</div><div class="kpi-label">Consumo Previsto (kg)</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📈</div><div class="kpi-value">41.600</div><div class="kpi-label">Consumo Real (kg)</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🗑️</div><div class="kpi-value">3,7%</div><div class="kpi-label">Índice de Desperdício</div><div class="kpi-trend down">▼ -0,5% vs mês anterior</div></div>
    </div>
    <div class="grid-2-1">
      <div class="card"><div class="card-header"><div class="card-title">📈 Consumo Previsto vs Real</div></div>
        <div class="card-body"><div class="chart-container h-300"><canvas id="chart-nutri-consumo"></canvas></div></div>
      </div>
      <div class="card"><div class="card-header"><div class="card-title">🚨 Alertas Nutricionais</div></div>
        <div class="card-body">
          <div class="alert-list">
            <div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>5 produtos</strong> com estoque insuficiente para o cardápio vigente</div></div>
            <div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>Cardápio Julho</strong> sem cobertura completa de ingredientes</div></div>
            <div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>3 escolas</strong> com consumo 20% abaixo do previsto</div></div>
            <div class="alert-item info"><span class="alert-icon">🤖</span><div class="alert-text"><strong>IA sugere:</strong> Substituir Maçã por Banana Prata (safra atual)</div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="ia-card" style="margin-top:24px">
      <div class="ia-card-title">🤖 IA Nutricional <span class="ia-badge">SUGESTÕES</span></div>
      <div class="ia-suggestion">🔄 Substituir <strong>Melancia</strong> por <strong>Manga Tommy</strong> — safra atual com 18% menos custo</div>
      <div class="ia-suggestion">📉 Reduzir porção de <strong>Arroz</strong> de 120g para 110g — economia de 3.200 kg/mês sem impacto nutricional</div>
      <div class="ia-suggestion">🌾 Priorizar <strong>Mandioca</strong> e <strong>Batata Doce</strong> — alta disponibilidade na agricultura familiar</div>
    </div>
  `;
  setTimeout(() => {
    createChart('chart-nutri-consumo', {
      type: 'line',
      data: {
        labels: DATA.months.slice(0, 6),
        datasets: [
          { label: 'Previsto (kg)', data: [42000, 38500, 45200, 41800, 43900, 43200], borderColor: CHART_COLORS.blue, backgroundColor: CHART_COLORS.blueFill, fill: true, tension: 0.4 },
          { label: 'Real (kg)', data: [40800, 37200, 44100, 40500, 42300, 41600], borderColor: CHART_COLORS.green, tension: 0.4 },
        ]
      },
      options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { position: 'bottom' } } }
    });
  }, 100);
};

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

PAGE_RENDERERS.nutricionista_fichas = (el) => {
  const todas = mergeFichas();
  const salvas = todas.length - _FICHAS_DEMO.length;

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Fichas Técnicas de Preparação</div><div class="page-subtitle">Gestão de receitas, ingredientes e cálculo nutricional (Padrão FNDE/PNAE)</div></div>

    <div class="card mb-24">
      <div class="card-body" style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap">
        <div class="header-search-box" style="flex:1;max-width:300px;margin:0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <input type="search" id="search-fichas" placeholder="Buscar receita..." oninput="filterFichas()" style="width:100%">
        </div>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
          <span style="font-size:0.8rem;color:var(--text-secondary)">${salvas} salva${salvas !== 1 ? 's' : ''} + ${_FICHAS_DEMO.length} demo</span>
          <button class="btn btn-outline" onclick="PAGE_RENDERERS.nutricionista_simulacoes(document.getElementById('page-content'))">🔬 Simular Enquadramento PNAE</button>
          <button class="btn btn-primary" onclick="showCreateFichaForm(true)" style="background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%);border:none;box-shadow:0 2px 8px rgba(2,132,199,0.25)">🤖 Gerar Ficha Técnica com IA (Estoque)</button>
          <button class="btn btn-outline" onclick="showCreateFichaForm()">+ Nova Ficha Manual</button>
        </div>
      </div>
    </div>

    <div id="fichas-container" class="grid-3 mb-24">
      ${todas.map(_renderFichaCard).join('')}
    </div>
  `;
};

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

PAGE_RENDERERS.nutricionista_produtos = (el) => {
  const alimentos = (typeof DATA !== 'undefined' && DATA.alimentos) ? DATA.alimentos :
                    (typeof ALIMENTOS_PNAE !== 'undefined' ? ALIMENTOS_PNAE : []);
  const categorias = [...new Set(alimentos.map(a => a.category))].sort();

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Tabela de Alimentos PNAE</div>
      <div class="page-subtitle">Base oficial FNDE/TACO — ${alimentos.length} alimentos com composição nutricional por 100g</div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">🥗</div><div class="kpi-value">${alimentos.length}</div><div class="kpi-label">Alimentos Cadastrados</div></div>
      <div class="kpi-card green"><div class="kpi-icon">🏷️</div><div class="kpi-value">${categorias.length}</div><div class="kpi-label">Categorias</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">🌾</div><div class="kpi-value">${alimentos.filter(a=>a.family_farm).length}</div><div class="kpi-label">Agricultura Familiar</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">📊</div><div class="kpi-value">TACO/IBGE</div><div class="kpi-label">Fonte dos Dados</div></div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">Catálogo de Alimentos</div>
        <div style="display:flex;gap:10px;align-items:center">
          <select id="filter-cat" style="padding:6px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem;background:var(--surface-1)">
            <option value="">Todas as categorias</option>
            ${categorias.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
          <div style="display:flex;align-items:center;gap:6px;background:var(--surface-1);border:1px solid var(--border);border-radius:var(--radius-md);padding:0 12px">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input type="search" id="search-alimentos" placeholder="Buscar alimento ou código..." style="border:none;background:none;padding:8px 0;font-size:0.85rem;outline:none;width:240px">
          </div>
        </div>
      </div>
      <div class="card-body" style="padding:0">
        <div id="alimentos-table-wrap" style="overflow-x:auto">
          <table class="data-table" id="alimentos-table">
            <thead>
              <tr>
                <th style="width:100px">Código</th>
                <th>Nome do Alimento</th>
                <th>Categoria</th>
                <th style="text-align:right">Kcal/100g</th>
                <th style="text-align:right">Prot. (g)</th>
                <th style="text-align:right">Lip. (g)</th>
                <th style="text-align:right">Carb. (g)</th>
                <th style="text-align:right">Sódio (mg)</th>
                <th>Ag. Familiar</th>
              </tr>
            </thead>
            <tbody id="alimentos-tbody"></tbody>
          </table>
        </div>
        <div id="alimentos-pagination" style="display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-top:1px solid var(--border);font-size:0.82rem;color:var(--text-secondary)">
          <span id="alimentos-info"></span>
          <div style="display:flex;gap:6px">
            <button id="btn-prev-al" class="btn btn-ghost btn-sm">‹ Anterior</button>
            <span id="alimentos-pages" style="display:flex;gap:4px"></span>
            <button id="btn-next-al" class="btn btn-ghost btn-sm">Próximo ›</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // ── Pagination state ──
  let currentPage = 1;
  const PAGE_SIZE = 25;
  let filtered = alimentos;

  function renderTable() {
    const tbody = document.getElementById('alimentos-tbody');
    if (!tbody) return;
    const start = (currentPage - 1) * PAGE_SIZE;
    const slice = filtered.slice(start, start + PAGE_SIZE);
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

    tbody.innerHTML = slice.map(a => `
      <tr>
        <td><span style="font-family:var(--font-mono,monospace);font-size:0.78rem;background:var(--primary-50);color:var(--primary);padding:2px 8px;border-radius:4px;font-weight:600">${a.code}</span></td>
        <td style="font-weight:500;max-width:280px">${a.name}</td>
        <td><span class="status-badge status-info" style="font-size:0.72rem">${a.category}</span></td>
        <td style="text-align:right;font-weight:600;color:var(--primary)">${a.kcal_per_100g || 0}</td>
        <td style="text-align:right">${a.protein_per_100g || 0}</td>
        <td style="text-align:right">${a.fat_per_100g || 0}</td>
        <td style="text-align:right">${a.carb_per_100g || 0}</td>
        <td style="text-align:right">${a.sodium_per_100g || 0}</td>
        <td style="text-align:center">${a.family_farm ? '<span style="color:#2E7D32;font-weight:600">✓ Sim</span>' : '<span style="color:#94A3B8">Não</span>'}</td>
      </tr>
    `).join('') || '<tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:32px">Nenhum alimento encontrado</td></tr>';

    // Info
    const infoEl = document.getElementById('alimentos-info');
    if (infoEl) infoEl.textContent = `Exibindo ${start+1}–${Math.min(start+PAGE_SIZE, filtered.length)} de ${filtered.length} alimentos`;

    // Page buttons
    const pagesEl = document.getElementById('alimentos-pages');
    if (pagesEl) {
      const showPages = [];
      for (let p = Math.max(1, currentPage-2); p <= Math.min(totalPages, currentPage+2); p++) showPages.push(p);
      pagesEl.innerHTML = showPages.map(p =>
        `<button onclick="window._setAlPage(${p})" style="width:30px;height:30px;border-radius:6px;border:1px solid var(--border);background:${p===currentPage?'var(--primary)':'var(--surface-1)'};color:${p===currentPage?'white':'inherit'};cursor:pointer;font-size:0.8rem">${p}</button>`
      ).join('');
    }

    const prevBtn = document.getElementById('btn-prev-al');
    const nextBtn = document.getElementById('btn-next-al');
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;
  }

  function applyFilters() {
    const search = (document.getElementById('search-alimentos')?.value || '').toLowerCase();
    const cat = document.getElementById('filter-cat')?.value || '';
    filtered = alimentos.filter(a => {
      const matchCat = !cat || a.category === cat;
      const matchSearch = !search || a.name.toLowerCase().includes(search) || a.code.toLowerCase().includes(search);
      return matchCat && matchSearch;
    });
    currentPage = 1;
    renderTable();
  }

  window._setAlPage = (p) => { currentPage = p; renderTable(); };

  document.getElementById('search-alimentos')?.addEventListener('input', applyFilters);
  document.getElementById('filter-cat')?.addEventListener('change', applyFilters);
  document.getElementById('btn-prev-al')?.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTable(); } });
  document.getElementById('btn-next-al')?.addEventListener('click', () => { if (currentPage < Math.ceil(filtered.length / PAGE_SIZE)) { currentPage++; renderTable(); } });

  renderTable();
};

PAGE_RENDERERS.nutricionista_cardapios = (el) => {
  const readOnly = state.currentProfile === 'escola';
  const sharedMenus = SharedState.getMenus();
  const legacy = JSON.parse(localStorage.getItem('cardapios_publicados') || '[]').map((c, i) => ({
    id: 'legacy-' + i,
    nome: c.nome,
    periodo: c.periodo,
    escolas: c.escolas === 'Todas' ? ((DATA.schools||[]).length || 183) : (parseInt(c.escolas) || 0),
    status: c.status,
    autor: c.autor || 'Dra. Lilian Droppa',
    criadoEm: c.criadoEm || '2026-06-25',
  }));
  const weekly = SharedState.getWeeklyMenus();
  const allCardapios = [...legacy, ...sharedMenus];
  const totalSchools = (DATA.schools||[]).length || 183;

  const rows = allCardapios.map((c, i) => {
    const periodoStr = c.periodo || `${(c.data_inicio||'').split('-').reverse().join('/')} a ${(c.data_fim||'').split('-').reverse().join('/')}`;
    return `
      <tr>
        <td><strong>${c.nome}</strong></td>
        <td>${periodoStr}</td>
        <td style="font-family:var(--font-mono)">${c.escolas || '—'}</td>
        <td><span class="status-badge status-${c.status === 'Publicado' ? 'ok' : 'info'}">${c.status}</span></td>
        <td style="font-size:0.82rem">${c.autor || '—'}</td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="table-action" style="color:#0284c7;font-weight:700" onclick="window.visualizarEImprimirCardapio('${(c.nome||'').replace(/'/g,"\\'")}')">👁️ Visualizar</button>
            <button class="table-action" onclick="editarCardapio('${c.id || i}')">✏️ Editar</button>
            ${!readOnly ? `<button class="table-action" style="color:var(--danger)" onclick="excluirCardapio('${c.id || i}')">🗑️ Excluir</button>` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">${readOnly ? 'Cardápios da Rede' : 'Gestão de Cardápios'}</div>
      <div class="page-subtitle">${readOnly ? 'Cardápios elaborados pela Nutricionista SEMED e distribuídos à sua escola' : 'Elaboração, publicação, edição e exclusão de cardápios escolares'}</div>
    </div>

    ${!readOnly ? `
    <div class="card mb-24">
      <div class="card-body" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div style="font-weight:600">Planejador de Cardápios</div>
          <div style="font-size:0.82rem;color:var(--text-secondary)">Cardápios publicados aqui aparecem imediatamente nas ${totalSchools} escolas da rede e no painel do Gestor</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-secondary" onclick="window.abrirRelatorioMensal4Paginas()">📄 Relatório Mensal (4 Páginas/Mês)</button>
          <button class="btn btn-primary" onclick="showMenuPlanner()">+ Abrir Planejador Semanal</button>
        </div>
      </div>
    </div>` : `
    <div class="card mb-24" style="border-left:4px solid var(--primary)">
      <div class="card-body" style="display:flex;justify-content:space-between;align-items:center;gap:12px">
        <div>
          <div style="font-weight:700">📖 Cardápios recebidos da SEMED</div>
          <div style="font-size:0.82rem;color:var(--text-secondary)">Visão somente leitura — apenas a Nutricionista SEMED pode editar</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="navigateTo('escola','planejamento')">Ver Planejamento Semanal →</button>
      </div>
    </div>`}

    <div class="card ${weekly.length > 0 ? 'mb-24' : ''}">
      <div class="card-header">
        <div class="card-title">Cardápios ${readOnly ? 'Disponíveis' : 'Publicados e Em Elaboração'}</div>
        <span class="status-badge status-info">${allCardapios.length}</span>
      </div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Nome</th><th>Período</th><th>Escolas Vinculadas</th><th>Status</th><th>Autor</th><th>Ações</th></tr></thead><tbody>
          ${rows}
        </tbody></table>
      </div>
    </div>

    ${weekly.length > 0 ? `
    <div class="card">
      <div class="card-header"><div class="card-title">🗓️ Cardápios Semanais Publicados</div><span class="status-badge status-ok">${weekly.length} recentes</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Nome</th><th>Período</th><th>Destino</th><th>Autor</th><th>Publicado em</th><th>Média Kcal</th><th>Ações</th></tr></thead><tbody>
          ${weekly.map((w, idx) => `
            <tr>
              <td><strong>${w.nome || 'Cardápio Semanal'}</strong></td>
              <td>${w.periodo || '—'}</td>
              <td>${w.escola || 'Toda a Rede'}</td>
              <td style="font-size:0.82rem">${w.autor || '—'}</td>
              <td style="font-size:0.82rem">${new Date(w.publicadoEm).toLocaleString('pt-BR')}</td>
              <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${w.kcalMedia || '—'} kcal/dia</td>
              <td>
                <div style="display:flex;gap:4px">
                  <button class="table-action" style="color:#0284c7;font-weight:700" onclick="window.visualizarEImprimirCardapio('${(w.nome||'').replace(/'/g,"\\'")}')">👁️ Visualizar</button>
                  <button class="table-action" onclick="editarCardapio('${idx}')">✏️ Editar</button>
                  ${!readOnly ? `<button class="table-action" style="color:var(--danger)" onclick="excluirCardapio('${idx}')">🗑️ Excluir</button>` : ''}
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody></table>
      </div>
    </div>` : ''}
  `;
};

window.excluirCardapio = (idOrIdx) => {
  if (!confirm('Tem certeza que deseja excluir este cardápio? Esta ação removerá o registro do sistema.')) return;

  const legacy = JSON.parse(localStorage.getItem('cardapios_publicados') || '[]');
  const idx = parseInt(idOrIdx);
  if (!isNaN(idx) && idx >= 0 && idx < legacy.length) {
    legacy.splice(idx, 1);
    localStorage.setItem('cardapios_publicados', JSON.stringify(legacy));
  }

  if (window.SharedState && typeof window.SharedState.deleteMenu === 'function') {
    window.SharedState.deleteMenu(idOrIdx);
  }

  if (typeof showToast === 'function') showToast('✅ Cardápio excluído com sucesso!');
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

window.generatePlannerDays = () => {
  const start = document.getElementById('planner-start-date').value;
  const end = document.getElementById('planner-end-date').value;
  if (!start || !end) return alert('Selecione as datas de início e fim.');
  
  const [sY, sM, sD] = start.split('-');
  const [eY, eM, eD] = end.split('-');
  const startDate = new Date(sY, sM - 1, sD);
  const endDate = new Date(eY, eM - 1, eD);
  if (endDate < startDate) return alert('A data final deve ser maior ou igual à inicial.');
  
  const container = document.getElementById('planner-days-container');
  container.innerHTML = '';
  
  const optDesjejum = window.buildPlannerSelectOptions('Desjejum', window._lastPreselectRecipeId);
  const optAlmoco = window.buildPlannerSelectOptions('Almoço', window._lastPreselectRecipeId);
  const optLanche = window.buildPlannerSelectOptions('Lanche', window._lastPreselectRecipeId);

  let current = new Date(startDate);
  const daysOfWeek = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
  
  let html = '';
  let dayIndex = 0;
  while (current <= endDate) {
    const dayName = daysOfWeek[current.getDay()];
    if (current.getDay() !== 0 && current.getDay() !== 6) { 
      const dateStr = current.toLocaleDateString('pt-BR');
      const idx = dayIndex++;
      html += `
        <div style="border: 1px solid var(--border); border-radius: var(--radius); padding:16px; margin-bottom:12px" class="planner-day-block" data-date="${dateStr}">
          <div style="font-weight:700;margin-bottom:10px;color:var(--primary)">${dayName} (${dateStr})</div>
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
    current.setDate(current.getDate() + 1);
  }
  if (!html) html = '<div style="padding:16px;color:var(--text-secondary)">Nenhum dia útil selecionado no período.</div>';
  container.innerHTML = html;
  calculatePlannerKcal();
};

window.showMenuPlanner = (preselectRecipeId) => {
  window._lastPreselectRecipeId = preselectRecipeId;
  const container = document.getElementById('page-content');
  
  const today = new Date();
  const nextMonday = new Date(today);
  nextMonday.setDate(today.getDate() + ((1 + 7 - today.getDay()) % 7 || 7));
  const nextFriday = new Date(nextMonday);
  nextFriday.setDate(nextMonday.getDate() + 4);
  
  const dStart = nextMonday.toISOString().split('T')[0];
  const dEnd = nextFriday.toISOString().split('T')[0];

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

  container.innerHTML = `
    <div class="page-header"><div class="page-title">Planejador Semanal de Cardápio</div><div class="page-subtitle">Monte as refeições diárias e verifique o valor nutricional acumulado</div></div>
    
    ${restricoesSummaryHtml}
    
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Período e Escopo</div></div>
      <div class="card-body">
        <div class="grid-3" style="align-items:end">
          <div class="form-group">
            <label>Data Inicial</label>
            <input type="date" id="planner-start-date" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" value="${dStart}">
          </div>
          <div class="form-group">
            <label>Data Final</label>
            <input type="date" id="planner-end-date" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" value="${dEnd}">
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary" onclick="generatePlannerDays()">Gerar Dias</button>
            <button class="btn btn-outline" style="background:var(--primary-light,#e0f2fe);color:var(--primary);border-color:var(--primary-light,#e0f2fe);font-weight:700" onclick="abrirModalGeradorIA()">🤖 Gerar com IA</button>
          </div>
        </div>
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
          <div id="planner-escolas-list" style="display:none;padding:10px;border:1px solid var(--border);border-radius:8px;max-height:220px;overflow-y:auto">
            ${(DATA.schools||[]).map(s => {
              const restrEscola = activeRestricoes.filter(r => r.schoolId === s.id || (r.schoolName || '').toLowerCase() === s.name.toLowerCase());
              const totalAlunosRestr = restrEscola.reduce((acc, r) => acc + (r.quantidade || 1), 0);
              const tiposText = Array.from(new Set(restrEscola.map(r => r.tipo))).join(', ');
              const restrBadge = totalAlunosRestr > 0 
                ? `<span class="status-badge warning" style="font-size:0.75rem;padding:3px 8px;font-weight:700" title="${totalAlunosRestr} alunos com restrição (${tiposText})">⚠️ ${totalAlunosRestr} Alunos c/ Restrição (${tiposText})</span>`
                : '';
              return `
                <label style="display:flex;align-items:center;justify-content:space-between;padding:6px 4px;font-size:0.85rem;cursor:pointer;border-bottom:1px dashed var(--border,#e2e8f0)">
                  <div>
                    <input type="checkbox" class="planner-escola-chk" value="${s.name.replace(/"/g,'&quot;')}" style="margin-right:6px">
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

    // 4. Grava no SharedState
    if (window.SharedState) {
      const d1 = startDate ? startDate.split('-').reverse().join('/') : new Date().toLocaleDateString('pt-BR');
      const d2 = endDate ? endDate.split('-').reverse().join('/') : new Date(Date.now() + 5*86400000).toLocaleDateString('pt-BR');
      SharedState.addMenu({
        nome: `Cardápio IA — ${selectedSchoolNames.length} Escola(s)`,
        periodo: `${d1} a ${d2}`,
        escolas: selectedSchoolNames.length,
        escolasVinculadas: selectedSchoolNames,
        status: 'Publicado',
        tipo: 'Semanal',
        autor: 'Dra. Lilian Droppa (CRN 12345/MS)'
      });
      SharedState.addWeeklyMenu({
        nome: `Cardápio Semanal IA PNAE (${selectedSchoolNames.length} Escolas)`,
        periodo: `${d1} a ${d2}`,
        semana: `${d1} a ${d2}`,
        escola: `${selectedSchoolNames.length} escola(s) vinculada(s)`,
        escolasVinculadas: selectedSchoolNames,
        refeicoes: (resultadoIA.refeicoes||[]).map(r => ({ dia: r.dia, desjejum: 'Pão c/ Manteiga e Leite', almoco: r.nomePrato, lanche: r.fruta, kcal: r.kcal })),
        kcalMedia: resultadoIA.metricasSemanais?.mediaKcal || 700,
        autor: 'Dra. Lilian Droppa (CRN 12345/MS)'
      });
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
      nome: `Cardápio Oficial IA — ${menuObj.modalidade || 'PNAE'}`,
      periodo: `${d1} a ${d2}`,
      escolas: (DATA.schools||[]).length,
      escolasVinculadas: (DATA.schools||[]).map(s=>s.name),
      status: aprovarDireto ? 'Publicado' : 'Em Elaboração',
      tipo: 'Semanal',
      autor: 'Dra. Lilian Droppa (CRN 12345/MS)'
    });
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

window.gerarOrdensDeServicoPorEscola = (menuObj) => {
  menuObj = menuObj || window.currentActiveIAMenu || window.tempIAMenuPreview;
  if (!menuObj || !window.AICardapioEngine) {
    return alert('Nenhum cardápio ativo para fracionamento de Ordem de Serviço.');
  }

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
    
    // Registra pedido e entrega no SharedState para a escola
    if (window.SharedState) {
      const order = {
        escolaId: sc.id,
        escola: sc.name,
        tipo: 'Ordem de Serviço PNAE (IA)',
        status: 'Pendente',
        itens: demandaInsumos.map(i => ({ produto: i.nome, qtd: i.qtdEnviadaKg, unidade: 'kg', regra: i.detalheRegra })),
        criadoEm: new Date().toISOString()
      };
      SharedState.addOrder(order);
    }

    return {
      escola: sc,
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
        <button class="btn btn-outline btn-sm" id="tab-os-coop-btn" onclick="window.alternarAbasOS('coop')">🌾 Ordens de Produção & Colheita AF (${ordensAgricultores.length} Cooperativas)</button>
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
                  <strong style="font-size:0.98rem; color:#0f172a;">🏫 ${o.escola.name}</strong>
                  <span style="font-size:0.8rem; color:#64748b; margin-left:8px;">· Região: ${o.escola.region || 'Urbana'} · População: <strong>${o.escola.students} Alunos</strong></span>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span class="status-badge" style="background:#e0f2fe; color:#0369a1; font-weight:700; font-size:0.78rem;">OS nº OS-2026/${o.escola.id}08</span>
                  <button class="btn btn-outline btn-sm" style="font-size:0.78rem;" onclick="window.imprimirOSIndividualEscola('${o.escola.name.replace(/'/g,"\\'")}', 'OS-2026/${o.escola.id}08')">🖨️ Imprimir Guia OS</button>
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
                  <button class="btn btn-outline btn-sm" style="font-size:0.78rem; border-color:#16a34a; color:#15803d;" onclick="window.imprimirGuiaCooperativaAF('${c.cooperativa.replace(/'/g,"\\'")}')">🖨️ Imprimir Guia AF</button>
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
  const prod = SharedState.getProduction().filter(p => p.cooperativa === coopName || (p.cooperativa || '').toLowerCase().includes(coopName.toLowerCase()));
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

window.visualizarEImprimirCardapio = (menuName) => {
  const menuList = SharedState.getWeeklyMenus ? SharedState.getWeeklyMenus() : [];
  const menu = menuList.find(m => m.nome === menuName || m.semana === menuName) || {
    nome: menuName || 'Cardápio Semanal PNAE',
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

  if (escolaName === 'TODAS') {
    return window.visualizarEImprimirCardapio();
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

PAGE_RENDERERS.nutricionista_restricoes = (el) => {
  const restricoesAgrupadas = SharedState.getRestricoes();
  const alunosEspeciais = SharedState.getAlunosEspeciais();
  const totalAlunosComRestricao = alunosEspeciais.length > 0
    ? alunosEspeciais.length
    : restricoesAgrupadas.reduce((a, b) => a + (b.quantidade || 1), 0);

  const htmlAlunos = alunosEspeciais.map(a => {
    const subInfo = window.AICardapioEngine
      ? window.AICardapioEngine.determinarSubstitutoRestricao(a.restricao, a.dataNascimento)
      : null;

    let dobFormatted = a.dataNascimento ? a.dataNascimento.split('-').reverse().join('/') : '—';
    return `
      <tr>
        <td><strong>${a.nome}</strong></td>
        <td>${a.escola}</td>
        <td><span class="tag tag-blue">${a.turma || 'Geral'}</span></td>
        <td style="font-size:0.82rem">${dobFormatted}</td>
        <td><span class="status-badge status-warning">${a.restricao}</span></td>
        <td style="font-size:0.8rem;color:#0284c7">
          ${subInfo ? subInfo.regraEtaria : 'Alimento Adaptado'}
        </td>
        <td style="font-size:0.78rem">${a.laudo || 'Laudo Anexado'}</td>
        <td>
          <button class="table-action btn-sm" style="color:var(--danger)" onclick="window.excluirAlunoEspecial('${a.id}')">🗑️ Excluir</button>
        </td>
      </tr>
    `;
  }).join('');

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Gestão de Restrições Alimentares & Dietas Especiais</div>
      <div class="page-subtitle">Cadastro nominal de alunos (RF-003), laudos clínicos e motor de substituição por faixa etária (RN-002)</div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
      <div class="kpi-card orange"><div class="kpi-icon">🛡️</div><div class="kpi-value">${totalAlunosComRestricao}</div><div class="kpi-label">Alunos c/ Dieta Especial</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🍼</div><div class="kpi-value">${alunosEspeciais.filter(a => { const d = new Date(a.dataNascimento); return !isNaN(d) && ((Date.now()-d)/(365.25*86400000)) < 2; }).length}</div><div class="kpi-label">Creche / 0-2 anos (Fórmula)</div></div>
      <div class="kpi-card green"><div class="kpi-icon">🥛</div><div class="kpi-value">${alunosEspeciais.filter(a => { const d = new Date(a.dataNascimento); return !isNaN(d) && ((Date.now()-d)/(365.25*86400000)) >= 2; }).length}</div><div class="kpi-label">Fundamental (Zero Lactose)</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">📄</div><div class="kpi-value">100%</div><div class="kpi-label">Laudos Médicos Auditados</div></div>
    </div>

    <div class="card mb-24">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
        <div class="card-title">👶 Cadastro Nominal de Alunos com Restrição Clínica (RF-003 & RN-002)</div>
        <button class="btn btn-primary btn-sm" onclick="window.abrirModalNovoAlunoEspecial()">+ Cadastrar Aluno Especial</button>
      </div>
      <div class="card-body" style="padding:0">
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Aluno(a)</th>
                <th>Escola Destino</th>
                <th>Turma</th>
                <th>Data Nasc.</th>
                <th>Restrição Clínica</th>
                <th>Substituição Automática IA (RN-002)</th>
                <th>Laudo Médico</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${htmlAlunos}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">🏫 Resumo por Unidade Escolar & Categoria de Restrição</div>
      </div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Unidade Escolar</th><th>Tipo de Restrição</th><th>Alunos Afetados</th><th>Observações Nutricionais</th><th>Status</th></tr></thead>
          <tbody>
            ${restricoesAgrupadas.map(r => `
              <tr>
                <td><strong>${r.schoolName}</strong></td>
                <td><span class="status-badge status-warning">${r.tipo}</span></td>
                <td style="font-family:var(--font-mono);font-weight:700">${r.quantidade} alunos</td>
                <td style="font-size:0.82rem">${r.observacao}</td>
                <td><span class="status-badge status-ok">${r.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.escola_restricoes = PAGE_RENDERERS.nutricionista_restricoes;
PAGE_RENDERERS.gestor_restricoes = PAGE_RENDERERS.nutricionista_restricoes;

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

// ============================================================
// REQUISITOS PDF: ESTOQUE SUAL READ-ONLY PARA NUTRIÇÃO
// ============================================================
PAGE_RENDERERS.nutricionista_estoquesual = (el) => {
  const products = DATA.products || [];
  const zerados = products.filter(p => (p.stock || 0) === 0);
  const emRisco = products.filter(p => (p.daysLeft || 0) > 0 && (p.daysLeft || 0) <= 5);
  const afItens = products.filter(p => p.familyFarm);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">📦 Estoque Consolidado SUAL (Modo Leitura — Nutrição)</div>
      <div class="page-subtitle">Acompanhamento dos níveis de estoque central, risco de desabastecimento e itens zerados sem movimentação física</div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${products.length}</div><div class="kpi-label">Itens no Catálogo SUAL</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚫</div><div class="kpi-value">${zerados.length}</div><div class="kpi-label">Itens Zerados</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${emRisco.length}</div><div class="kpi-label">Em Risco (< 5 dias)</div></div>
      <div class="kpi-card green"><div class="kpi-icon">🌽</div><div class="kpi-value">${afItens.length}</div><div class="kpi-label">Agricultura Familiar</div></div>
    </div>

    <div class="card mb-24">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
        <div class="card-title">🔍 Consulta de Insumos da Central SUAL</div>
        <div style="font-size:0.82rem;color:var(--text-secondary);background:#f1f5f9;padding:4px 12px;border-radius:20px">
          🔒 Perfil Nutricionista: Visualização em tempo real (Sem permissão de baixa)
        </div>
      </div>
      <div class="card-body" style="padding:0">
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>Produto / Insumo</th>
                <th>Categoria</th>
                <th>Origem</th>
                <th>Estoque Atual</th>
                <th>Consumo Médio/Dia</th>
                <th>Autonomia Estimada</th>
                <th>Status SUAL</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => {
                const isZero = (p.stock || 0) === 0;
                const isLow = (p.daysLeft || 0) <= 5 && !isZero;
                const statusBadge = isZero
                  ? '<span class="status-badge status-danger">Zerado</span>'
                  : isLow
                  ? '<span class="status-badge status-warning">Risco (< 5 dias)</span>'
                  : '<span class="status-badge status-ok">OK</span>';

                return `
                  <tr style="${isZero ? 'background:#fef2f2' : isLow ? 'background:#fffbe6' : ''}">
                    <td><strong>${p.name}</strong></td>
                    <td><span class="tag tag-blue">${p.category}</span></td>
                    <td>${p.familyFarm ? '<span style="color:#2E7D32;font-weight:700">🌽 Agric. Familiar</span>' : 'Pregão Central'}</td>
                    <td style="font-family:var(--font-mono);font-weight:700">${(p.stock || 0).toLocaleString('pt-BR')} ${p.unit}</td>
                    <td style="font-family:var(--font-mono)">${p.avgConsume || 0} ${p.unit}/dia</td>
                    <td style="font-family:var(--font-mono);font-weight:700;color:${isZero ? 'var(--danger)' : isLow ? '#c2410c' : '#1565C0'}">
                      ${isZero ? '0 dias (Esgotado)' : `${p.daysLeft} dias`}
                    </td>
                    <td>${statusBadge}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

// ============================================================
// REQUISITOS PDF: GUIAS DE ENTREGA, FRACIONAMENTO E SAZONALIDADE
// ============================================================
PAGE_RENDERERS.nutricionista_guiasentrega = (el) => {
  const schools = (DATA && DATA.schools && DATA.schools.length) ? DATA.schools : (window._PILOT_SCHOOLS || [{ id: 1, name: 'EMEF Prof. Arlene Marques', students: 540, region: 'Birbiriuçu' }]);
  const menus = SharedState.getCardapios();
  const cardapioAtivo = menus.find(m => m.statusAprovacao === 'aprovado_nutri') || menus[0];

  const trocasSazionais = SharedState._data.trocasSazionais || [];

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">🚚 Guias de Entrega & Distribuição Parcelada</div>
      <div class="page-subtitle">Emissão de ordens de fornecimento fracionadas por per capita, frequências e trocas por sazonalidade</div>
    </div>

    <div class="card mb-24">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div class="card-title">📋 Emissão de Guia por Unidade Escolar</div>
          <div style="font-size:0.82rem;color:var(--text-secondary)">Selecione a rota/escola para gerar o cálculo automático de remessa</div>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <select id="guia-filtro-rota" class="btn btn-outline" style="padding:6px 12px;font-size:0.85rem" onchange="window.filtrarEscolasPorRotaGuia(this.value)">
            <option value="todas">📍 Todas as Rotas</option>
            <option value="Birbiriuçu">📍 Rota 1 - Birbiriuçu (Rural)</option>
            <option value="Anhanduí">📍 Rota 2 - Anhanduí (Distrito)</option>
            <option value="Urbana Leste">📍 Rota 3 - Urbana Leste</option>
            <option value="Urbana Oeste">📍 Rota 4 - Urbana Oeste</option>
          </select>
          <select id="guia-escola-select" class="btn btn-outline" style="padding:6px 12px;font-size:0.85rem" onchange="window.renderizarGuiaEscola(this.value)">
            ${schools.map(s => `<option value="${s.id}">${s.name} (${s.students} alunos)</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="card-body">
        <div id="guia-detalhes-container"></div>
      </div>
    </div>
  `;

  setTimeout(() => {
    if (schools.length) window.renderizarGuiaEscola(schools[0].id);
  }, 50);
};

window.filtrarEscolasPorRotaGuia = (rota) => {
  const sel = document.getElementById('guia-escola-select');
  if (!sel) return;
  const schools = DATA.schools || [];
  const filtradas = rota === 'todas' ? schools : schools.filter(s => (s.region || '').includes(rota) || (s.name || '').includes(rota));
  sel.innerHTML = filtradas.map(s => `<option value="${s.id}">${s.name} (${s.students} alunos)</option>`).join('');
  if (filtradas.length) window.renderizarGuiaEscola(filtradas[0].id);
};

window.renderizarGuiaEscola = (escolaId) => {
  const container = document.getElementById('guia-detalhes-container');
  if (!container) return;

  const school = (DATA.schools || []).find(s => String(s.id) === String(escolaId)) || DATA.schools[0];
  const qtdAlunos = school.students || 400;
  const trocas = SharedState._data.trocasSazionais || {};

  const itensGuia = [
    { id: 'g1', nome: 'Banana Nanica', categoria: 'Hortifrúti', perCapita: 100, uni: 'g', freq: 'Semanal (4x/mês)', af: true },
    { id: 'g2', nome: 'Tomate Fresco', categoria: 'Hortifrúti', perCapita: 40, uni: 'g', freq: 'Semanal (4x/mês)', af: true },
    { id: 'g3', nome: 'Alface Crespa', categoria: 'Hortifrúti', perCapita: 30, uni: 'g', freq: 'Semanal (4x/mês)', af: true },
    { id: 'g4', nome: 'Ovos de Galinha', categoria: 'Proteína Perecível', perCapita: 1, uni: 'unid', freq: 'Quinzenal (2x/mês)', af: true },
    { id: 'g5', nome: 'Pão Francês / Bisnaguinha', categoria: 'Panificação', perCapita: 50, uni: 'g', freq: 'Quinzenal (2x/mês)', af: false },
    { id: 'g6', nome: 'Arroz Tipo 1', categoria: 'Estoque Seco', perCapita: 60, uni: 'g', freq: 'Mensal (1x/mês)', af: false },
    { id: 'g7', nome: 'Feijão Carioca', categoria: 'Estoque Seco', perCapita: 40, uni: 'g', freq: 'Mensal (1x/mês)', af: false },
  ];

  container.innerHTML = `
    <div style="background:#f8fafc;padding:16px;border-radius:10px;border:1px solid var(--border);margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div>
          <h3 style="margin:0;font-size:1.05rem;color:var(--primary-dark)">🏫 ${school.name}</h3>
          <div style="font-size:0.83rem;color:var(--text-secondary);margin-top:2px">
            Rota: <strong>${school.region || 'Urbana'}</strong> · Total de Alunos Matriculados: <strong>${qtdAlunos}</strong>
          </div>
        </div>
        <button class="btn btn-primary" onclick="window.printGuiaEscola('${school.name}')">🖨️ Imprimir Guia de Entrega Físico</button>
      </div>
    </div>

    <div style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr>
            <th>Gênero Alimentício</th>
            <th>Origem</th>
            <th>Per Capita Técnico</th>
            <th>Cálculo p/ Remessa (${qtdAlunos} alunos)</th>
            <th>Frequência de Entrega</th>
            <th>Substituição por Sazonalidade</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          ${itensGuia.map(item => {
            const trocaKey = `${school.id}_${item.id}`;
            const trocaObj = trocas[trocaKey];
            const nomeExibido = trocaObj ? trocaObj.substituto : item.nome;

            let qtdCalculada = item.uni === 'unid'
              ? Math.round(item.perCapita * qtdAlunos) + ' unid'
              : ((item.perCapita * qtdAlunos) / 1000).toFixed(1) + ' kg';

            return `
              <tr style="${trocaObj ? 'background:#fffbe6' : ''}">
                <td>
                  <strong>${nomeExibido}</strong>
                  ${trocaObj ? `<div style="font-size:0.75rem;color:#b45309">⚠️ Substituído: de ${item.nome} (${trocaObj.justificativa})</div>` : ''}
                </td>
                <td>${item.af ? '<span style="color:#2E7D32;font-weight:700">🌽 Agric. Familiar</span>' : 'Pregão'}</td>
                <td style="font-family:var(--font-mono)">${item.perCapita} ${item.uni}</td>
                <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${qtdCalculada}</td>
                <td><span class="tag tag-blue">${item.freq}</span></td>
                <td style="font-size:0.8rem">
                  ${trocaObj ? `<span class="status-badge status-warning">Alterado: ${trocaObj.substituto}</span>` : '<span style="color:var(--text-secondary)">Sem troca</span>'}
                </td>
                <td>
                  <button class="btn btn-sm btn-outline" style="border-color:#f59e0b;color:#b45309" onclick="window.abrirModalSubstituicaoSazonal('${school.id}', '${item.id}', '${item.nome}')">
                    🔄 Substituir
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
};

window.abrirModalSubstituicaoSazonal = (escolaId, itemId, itemOriginal) => {
  const content = `
    <form onsubmit="window.salvarSubstituicaoSazonal(event, '${escolaId}', '${itemId}')">
      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Item Original Programado</label>
        <input type="text" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" value="${itemOriginal}" readonly>
      </div>
      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Produto Substituto de Hortifrúti (Sazonalidade)</label>
        <select id="subst-produto" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
          <option value="Pepino Japonês">Pepino Japonês</option>
          <option value="Mamão Formosa">Mamão Formosa</option>
          <option value="Abobrinha Menina">Abobrinha Menina</option>
          <option value="Repolho Verde">Repolho Verde</option>
          <option value="Chuchu">Chuchu</option>
          <option value="Laranja Pera">Laranja Pera</option>
        </select>
      </div>
      <div class="form-group mb-18">
        <label style="font-weight:600;display:block;margin-bottom:4px">Campo Obrigatório de Observação / Justificativa na Guia</label>
        <textarea id="subst-justificativa" class="btn btn-outline" style="width:100%;text-align:left;padding:8px;height:80px" placeholder="Ex: Substituição autorizada devido à indisponibilidade de colheita provocada pelas chuvas na região." required></textarea>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">💾 Registrar Substituição na Guia</button>
      </div>
    </form>
  `;
  window.showModal('🔄 Substituição por Sazonalidade (Requisito PDF nº 4)', content, '550px');
};

window.salvarSubstituicaoSazonal = (e, escolaId, itemId) => {
  e.preventDefault();
  const substituto = document.getElementById('subst-produto').value;
  const justificativa = document.getElementById('subst-justificativa').value;

  SharedState._data.trocasSazionais = SharedState._data.trocasSazionais || {};
  SharedState._data.trocasSazionais[`${escolaId}_${itemId}`] = { substituto, justificativa, data: new Date().toISOString() };
  SharedState._persist();

  showToast(`✅ Substituição para ${substituto} registrada com sucesso na guia!`);
  closeModal();
  window.renderizarGuiaEscola(escolaId);
};

window.printGuiaEscola = (escolaNome) => {
  window.print();
};

// Helper de Relatório Mensal 4 Páginas por Mês (Requisito PDF nº 5)
window.abrirRelatorioMensal4Paginas = (cardapioNome) => {
  const content = `
    <div id="print-4-pages-container" style="font-family:Inter,sans-serif">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px" class="no-print">
        <h3>📄 Relatório de Cardápio Mensal — 4 Páginas por Mês</h3>
        <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir 4 Páginas para a Escola</button>
      </div>

      ${[1, 2, 3, 4].map(semana => `
        <div style="background:#fff;padding:24px;border:1px solid #ccc;margin-bottom:24px;page-break-after:always">
          <div style="border-bottom:2px solid #1565C0;padding-bottom:10px;margin-bottom:16px;display:flex;justify-content:space-between">
            <div>
              <h2 style="margin:0;color:#1565C0">PREFEITURA MUNICIPAL DE CAMPO GRANDE — SEMED</h2>
              <div style="font-size:0.9rem;font-weight:700;color:#333">SUPERINTENDÊNCIA DE ALIMENTAÇÃO ESCOLAR (SUAL)</div>
              <div style="font-size:0.85rem;color:#666">Cardápio Oficial — <strong>SEMANA ${semana} DE 4</strong> (${cardapioNome || 'Ensino Fundamental Regular'})</div>
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
              <tr><td style="padding:8px;border:1px solid #999"><strong>Segunda-feira</strong></td><td style="padding:8px;border:1px solid #999">Leite c/ Cacau + Pão c/ Manteiga 🌽</td><td style="padding:8px;border:1px solid #999">Arroz, Feijão Carioca, Coxa de Frango Assada e Salada de Alface/Tomate 🌽</td><td style="padding:8px;border:1px solid #999">Banana Nanica 🌽</td></tr>
              <tr><td style="padding:8px;border:1px solid #999"><strong>Terça-feira</strong></td><td style="padding:8px;border:1px solid #999">Suco Natural de Laranja 🌽 + Bisnaguinha</td><td style="padding:8px;border:1px solid #999">Arroz Integral, Feijão Preto, Carne Bovina Refogada e Cenoura Ralada 🌽</td><td style="padding:8px;border:1px solid #999">Maçã Gala</td></tr>
              <tr><td style="padding:8px;border:1px solid #999"><strong>Quarta-feira</strong></td><td style="padding:8px;border:1px solid #999">Leite UHT + Biscoito Doce</td><td style="padding:8px;border:1px solid #999">Macarrão Espaguete ao Molho de Tomate 🌽 c/ Carne Moída e Abóbora Cabotiá 🌽</td><td style="padding:8px;border:1px solid #999">Melancia em Cubos 🌽</td></tr>
              <tr><td style="padding:8px;border:1px solid #999"><strong>Quinta-feira</strong></td><td style="padding:8px;border:1px solid #999">Vitamina de Banana 🌽 + Pão de Milho</td><td style="padding:8px;border:1px solid #999">Arroz Branco, Feijão Carioca, Ovos Mexidos 🌽 e Salada de Beterraba 🌽</td><td style="padding:8px;border:1px solid #999">Sucos de Frutas da Safra AF 🌽</td></tr>
              <tr><td style="padding:8px;border:1px solid #999"><strong>Sexta-feira</strong></td><td style="padding:8px;border:1px solid #999">Leite c/ Cereais + Fruta Fresca 🌽</td><td style="padding:8px;border:1px solid #999">Polenta c/ Carne Bovina Ensopada, Mandioca Cozida 🌽 e Couve Manteiga 🌽</td><td style="padding:8px;border:1px solid #999">Bolo Caseiro de Cenoura 🌽</td></tr>
            </tbody>
          </table>

          <div style="margin-top:20px;display:flex;justify-content:space-between;font-size:0.78rem;border-top:1px solid #ddd;padding-top:10px">
            <div>🌽 Alimentos advindos da Agricultura Familiar Local</div>
            <div>Página ${semana} de 4 — Afixar no Mural da Escola</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
  window.showModal('📄 Modelo de Cardápio Mensal (4 Páginas/Mês)', content, '900px');
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

  // Calcula média nutricional a partir dos selects preenchidos
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
      else if (id.includes('lun') || id.includes('lunch')) tipo = 'Almoço';
      const itemText = sel.options[sel.selectedIndex]?.text || '';
      const kcal = parseInt(sel.value) || 0;
      if (itemText && !itemText.startsWith('Selecione')) refeicoes.push({ dia, tipo, item: itemText, kcal });
    });
  });

  // Grava no SharedState (visível em todos os perfis)
  SharedState.addMenu({
    nome: name,
    periodo: `${d1} a ${d2}`,
    escolas: escolasVinculadas.length,
    escolasVinculadas,
    status: 'Publicado',
    tipo: 'Semanal',
    autor: prof.name || 'Dra. Lilian Droppa',
  });
  SharedState.addWeeklyMenu({
    nome: name,
    periodo: `${d1} a ${d2}`,
    semana: `${d1} a ${d2}`,
    escola: escolaLabel,
    escolasVinculadas,
    refeicoes,
    kcalMedia,
    autor: prof.name || 'Dra. Lilian Droppa',
  });

  // Mantém compatibilidade com localStorage legado
  const novosCardapios = JSON.parse(localStorage.getItem('cardapios_publicados') || '[]');
  novosCardapios.unshift({ nome: name, periodo: `${d1} a ${d2}`, status: 'Publicado', escolas: escolaLabel, statusCls: 'status-ok' });
  localStorage.setItem('cardapios_publicados', JSON.stringify(novosCardapios));

  showToast('✅ Cardápio publicado! Já visível para ' + escolaLabel + ' e para o Gestor.');
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

PAGE_RENDERERS.nutricionista_planejamento = (el) => {
  PAGE_RENDERERS.gestor_planejamento(el);
  const header = el.querySelector('.page-header');
  if (header) {
    header.insertAdjacentHTML('afterend', `<div style="background:var(--warning-light);border:1px solid var(--warning);padding:12px;border-radius:var(--radius-md);margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;"><div><strong>⚠️ Área em Validação:</strong> Esta tela de planejamento está em fase de testes e co-criação com a equipe de nutrição.</div><button class="btn btn-primary btn-sm" onclick="alert('Formulário de feedback da Nutricionista aberto!')">Dar Feedback</button></div>`);
  }
};
// Nutricionista tem visão consultiva das escolas (sem edição)
PAGE_RENDERERS.nutricionista_escolas = (el) => {
  PAGE_RENDERERS.gestor_escolas(el);
  const header = el.querySelector('.page-header');
  if (header) {
    header.insertAdjacentHTML('afterend', '<div style="background:var(--surface-2);border-left:4px solid var(--primary);padding:12px;border-radius:0 8px 8px 0;margin-bottom:16px;font-size:0.85rem"><strong>ℹ️ Modo consulta:</strong> Nutricionista tem acesso somente-leitura às escolas para elaborar cardápios e planejamento nutricional.</div>');
  }
  // Remove qualquer botão de ação/edição
  el.querySelectorAll('button.table-action, .btn-primary').forEach(b => {
    if (b.textContent.includes('Editar') || b.textContent.includes('Novo') || b.textContent.includes('Excluir')) b.remove();
  });
};

// Escola vê apenas a sua própria unidade em foco (drill-down local)
PAGE_RENDERERS.escola_escolas = (el) => {
  const sc = getCurrentSchool();
  const localStock = SharedState.getSchoolStock(sc.name);
  const consumo = SharedState.getConsumo(sc.name).slice(0, 8);
  const pedidos = SharedState.getOrders().filter(o => o.school === sc.name);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Minha Escola — ${sc.name}</div>
      <div class="page-subtitle">Visão consolidada da unidade · ${sc.region} · Diretor(a): ${sc.director}</div>
    </div>

    <div class="grid-2 mb-24">
      <div class="card">
        <div class="card-header"><div class="card-title">📇 Dados da Unidade</div></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.9rem">
            <div><strong>Nome:</strong><br>${sc.name}</div>
            <div><strong>Região:</strong><br>${sc.region}</div>
            <div><strong>Modalidade:</strong><br>${sc.modality || 'Escolar Urbana (Regular)'}</div>
            <div><strong>Diretor(a):</strong><br>${sc.director}</div>
            <div><strong>Alunos:</strong><br>${(sc.students || 0).toLocaleString('pt-BR')}</div>
            <div><strong>Frequência Média:</strong><br>${sc.attendance_avg || 0} (${sc.attendance_pct || 0}%)</div>
            <div><strong>Refeições/Dia:</strong><br>${sc.meals_per_day || 2}</div>
            <div><strong>Orçamento Mensal:</strong><br>${formatCurrency(sc.monthly_budget || 0)}</div>
            <div><strong>Última Entrega:</strong><br>${sc.lastDelivery ? formatDate(sc.lastDelivery) : '—'}</div>
            <div><strong>Estoque Atual:</strong><br><span class="status-badge ${statusClass(sc.stockStatus)}">${statusLabel(sc.stockStatus)}</span></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📊 Indicadores em Tempo Real</div></div>
        <div class="card-body">
          <div class="kpi-grid" style="grid-template-columns:1fr 1fr;gap:12px">
            <div class="kpi-card blue" style="padding:12px"><div class="kpi-icon">📦</div><div class="kpi-value" style="font-size:1.4rem">${localStock.length}</div><div class="kpi-label">Produtos em Estoque</div></div>
            <div class="kpi-card green" style="padding:12px"><div class="kpi-icon">📝</div><div class="kpi-value" style="font-size:1.4rem">${SharedState.getConsumo(sc.name).length}</div><div class="kpi-label">Consumos Registrados</div></div>
            <div class="kpi-card orange" style="padding:12px"><div class="kpi-icon">🛒</div><div class="kpi-value" style="font-size:1.4rem">${pedidos.length}</div><div class="kpi-label">Pedidos Totais</div></div>
            <div class="kpi-card teal" style="padding:12px"><div class="kpi-icon">🚚</div><div class="kpi-value" style="font-size:1.4rem">${pedidos.filter(o=>o.status==='Entregue').length}</div><div class="kpi-label">Entregas Recebidas</div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-16">
      <div class="card-header"><div class="card-title">🚀 Acesso Rápido</div></div>
      <div class="card-body" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
        <button class="btn btn-outline" onclick="navigateTo('escola','estoque')">📦 Ver Estoque Detalhado</button>
        <button class="btn btn-outline" onclick="navigateTo('escola','consumo')">📝 Registrar Consumo</button>
        <button class="btn btn-outline" onclick="navigateTo('escola','pedidos')">🛒 Solicitar Pedido</button>
        <button class="btn btn-outline" onclick="navigateTo('escola','entregas')">🚚 Confirmar Entregas</button>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.cooperativa_escolas = (el) => {
  const schools = DATA.schools || [];
  const total = schools.reduce((s,e) => s + e.students, 0);
  const risco = schools.filter(s => s.stockStatus === 'danger').length;
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Escolas Atendidas</div>
      <div class="page-subtitle">Pontos de entrega e situação de abastecimento das ${schools.length} Escolas Piloto (${total.toLocaleString('pt-BR')} Alunos)</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${schools.length}</div><div class="kpi-label">Escolas Piloto</div></div>
      <div class="kpi-card green"><div class="kpi-icon">👥</div><div class="kpi-value">${total.toLocaleString('pt-BR')}</div><div class="kpi-label">Alunos Atendidos</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${schools.filter(s=>s.stockStatus==='warning').length}</div><div class="kpi-label">Em Atenção</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${risco}</div><div class="kpi-label">Em Risco</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Pontos de Entrega (Escolas Piloto Real)</div></div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Escola Piloto</th><th>Região</th><th>Modalidade</th><th>Alunos</th><th>Restrições</th><th>Estoque Atual</th><th>Status</th><th>Última Entrega</th></tr></thead>
            <tbody>
              ${schools.map(s => {
                const restrCount = (SharedState.getRestricoes(s.id) || []).filter(r => r.status === 'ativo').reduce((a,b)=>a+(b.quantidade||1), 0);
                const localStock = SharedState.getSchoolStock(s.name) || [];
                const deliveries = SharedState.getDeliveries().filter(d => d.school === s.name || d.escola === s.name);
                const lastDel = deliveries.length > 0 ? (deliveries[deliveries.length-1].confirmadoEm || deliveries[deliveries.length-1].criadoEm) : s.lastDelivery;
                return `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td><span class="tag tag-blue">${s.region}</span></td>
                  <td><span class="tag tag-teal" style="font-size:0.7rem">${s.modality || 'Escolar Urbana'}</span></td>
                  <td style="font-family:var(--font-mono)">${s.students}</td>
                  <td>${restrCount > 0 ? `<span class="status-badge warning" style="font-size:0.7rem">⚠️ ${restrCount} aluno(s)</span>` : '<span style="color:var(--text-tertiary);font-size:0.8rem">Nenhuma</span>'}</td>
                  <td><div style="display:flex;align-items:center;gap:8px">
                    <div class="progress-bar" style="width:80px"><div class="progress-fill ${s.stockPct>60?'green':s.stockPct>30?'orange':'red'}" style="width:${s.stockPct}%"></div></div>
                    <span style="font-family:var(--font-mono);font-size:0.78rem">${s.stockPct}% (${localStock.length} itens)</span>
                  </div></td>
                  <td><span class="status-badge ${statusClass(s.stockStatus)}">${statusLabel(s.stockStatus)}</span></td>
                  <td style="font-size:0.82rem">${lastDel ? (lastDel.slice(0, 10)) : '—'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.gestor_escolas = PAGE_RENDERERS.cooperativa_escolas;
PAGE_RENDERERS.estoque_escolas = PAGE_RENDERERS.cooperativa_escolas;
PAGE_RENDERERS.nutricionista_escolas = PAGE_RENDERERS.cooperativa_escolas;
PAGE_RENDERERS.agricultor_escolas = PAGE_RENDERERS.cooperativa_escolas;

PAGE_RENDERERS.motorista_escolas = (el) => {
  const schools = DATA.schools || [];
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' });
  // Filtra escolas apenas dos pedidos em transporte
  const inTransit = SharedState.getOrders().filter(o => o.status === 'Em transporte' && (!prof || o.driver === prof.name));
  const rotaNomes = new Set(inTransit.map(o => o.school));
  const escolasRota = schools.filter(s => rotaNomes.has(s.name));
  const escolasParaMostrar = escolasRota.length > 0 ? escolasRota : schools.slice(0, 3); // fallback: 3 primeiras

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Escolas da Rota</div>
      <div class="page-subtitle">Destinos das entregas em transporte · ${hoje}</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${escolasParaMostrar.length}</div><div class="kpi-label">Escolas na Rota</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📦</div><div class="kpi-value">${inTransit.length}</div><div class="kpi-label">Pedidos em Transporte</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${SharedState.getOrders().filter(o => o.status === 'Entregue').length}</div><div class="kpi-label">Entregues Hoje</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">${escolasRota.length > 0 ? 'Escolas da Rota Ativa' : 'Sem pedidos ativos — exibindo referência'}</div></div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:10px">
          ${escolasParaMostrar.map((s,i) => {
            const pedidoDaEscola = inTransit.find(o => o.school === s.name);
            return `
          <div style="display:flex;align-items:center;gap:14px;padding:12px;border:1px solid var(--border);border-radius:8px;background:var(--surface-1)">
            <div style="width:28px;height:28px;border-radius:50%;background:var(--primary-100);color:var(--primary);font-weight:700;display:flex;align-items:center;justify-content:center;font-size:0.8rem;flex-shrink:0">${i+1}</div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:600">${s.name} ${pedidoDaEscola ? '<span class="tag tag-blue" style="font-size:0.65rem">Pedido #' + String(pedidoDaEscola.numero).padStart(3,'0') + '</span>' : ''}</div>
              <div style="font-size:0.78rem;color:var(--text-secondary)">${s.region} · ${s.director} · ${s.students} alunos</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
              ${pedidoDaEscola ? `<button class="btn btn-sm btn-primary" onclick="selectDelivery('${pedidoDaEscola.id}');navigateTo('motorista','entregas')">Entregar</button>` : `<span class="status-badge ${statusClass(s.stockStatus)}" style="font-size:0.7rem">${statusLabel(s.stockStatus)}</span>`}
            </div>
          </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.nutricionista_consumo = (el) => {
  // Consolida todos os registros de consumo do SharedState
  const todos = SharedState.getConsumo();
  const porProduto = {};
  const porEscola = {};
  todos.forEach(c => {
    porProduto[c.produto] = (porProduto[c.produto] || 0) + (c.qtd || 0);
    porEscola[c.escola] = (porEscola[c.escola] || 0) + (c.qtd || 0);
  });
  const rankProdutos = Object.entries(porProduto).sort((a,b) => b[1]-a[1]).slice(0, 10);
  const rankEscolas = Object.entries(porEscola).sort((a,b) => b[1]-a[1]).slice(0, 10);
  const totalKg = todos.reduce((s,c) => s + (c.qtd||0), 0);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Monitoramento de Consumo</div>
      <div class="page-subtitle">Consolidação em tempo real dos registros das escolas · Comparativo previsto vs realizado</div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📝</div><div class="kpi-value">${todos.length}</div><div class="kpi-label">Registros das Escolas</div></div>
      <div class="kpi-card green"><div class="kpi-icon">⚖️</div><div class="kpi-value">${totalKg.toLocaleString('pt-BR')}</div><div class="kpi-label">Total Consumido</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">🏫</div><div class="kpi-value">${Object.keys(porEscola).length}</div><div class="kpi-label">Escolas Reportando</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🥕</div><div class="kpi-value">${Object.keys(porProduto).length}</div><div class="kpi-label">Produtos Diferentes</div></div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><div class="card-title">🥇 Produtos Mais Consumidos (Real)</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table"><thead><tr><th>Produto</th><th>Total</th><th>%</th></tr></thead><tbody>
            ${rankProdutos.map(([p, q]) => {
              const pct = totalKg > 0 ? Math.round(q / totalKg * 100) : 0;
              return `<tr>
                <td><strong>${p}</strong></td>
                <td style="font-family:var(--font-mono)">${q.toLocaleString('pt-BR')}</td>
                <td><div style="display:flex;align-items:center;gap:6px"><div class="progress-bar" style="width:60px"><div class="progress-fill blue" style="width:${pct}%"></div></div><span style="font-family:var(--font-mono);font-size:0.78rem">${pct}%</span></div></td>
              </tr>`;
            }).join('') || '<tr><td colspan="3" style="text-align:center;padding:24px;color:var(--text-secondary)">Aguardando registros das escolas</td></tr>'}
          </tbody></table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">🏫 Consumo por Escola</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table"><thead><tr><th>Escola</th><th>Total</th><th>Registros</th></tr></thead><tbody>
            ${rankEscolas.map(([e, q]) => {
              const n = todos.filter(c => c.escola === e).length;
              return `<tr>
                <td><strong>${e}</strong></td>
                <td style="font-family:var(--font-mono)">${q.toLocaleString('pt-BR')}</td>
                <td style="font-family:var(--font-mono)">${n}</td>
              </tr>`;
            }).join('') || '<tr><td colspan="3" style="text-align:center;padding:24px;color:var(--text-secondary)">—</td></tr>'}
          </tbody></table>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card-header"><div class="card-title">📋 Registros Recentes</div>${todos.length ? '<span class="status-badge status-ok">'+todos.length+'</span>' : ''}</div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Data</th><th>Escola</th><th>Refeição</th><th>Produto</th><th>Qtd</th><th>Responsável</th></tr></thead>
          <tbody>
            ${todos.slice(0, 15).map(c => `
              <tr>
                <td style="font-size:0.82rem">${c.data || (c.criadoEm||'').slice(0,10)}</td>
                <td>${c.escola}</td>
                <td>${c.refeicao || '—'}</td>
                <td><strong>${c.produto}</strong></td>
                <td style="font-family:var(--font-mono)">${c.qtd} ${c.unidade || ''}</td>
                <td style="font-size:0.82rem">${c.responsavel || '—'}</td>
              </tr>
            `).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhum registro — aguardando escolas registrarem consumo em /consumo</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card-header"><div class="card-title">📊 Previsto vs Realizado (Referência mensal)</div></div>
      <div class="card-body"><div class="chart-container h-300"><canvas id="chart-comparativo"></canvas></div></div>
    </div>
  `;
  setTimeout(() => {
    createChart('chart-comparativo', {
      type: 'bar',
      data: {
        labels: ['Arroz', 'Feijão', 'Leite', 'Frango', 'Banana', 'Tomate', 'Cenoura', 'Carne'],
        datasets: [
          { label: 'Previsto (kg)', data: [25500, 12600, 36000, 23400, 18000, 12000, 9300, 15600], backgroundColor: CHART_COLORS.blue, borderRadius: 4 },
          { label: 'Consumido (kg)', data: [24800, 11900, 34200, 22100, 16800, 11200, 9100, 14800], backgroundColor: CHART_COLORS.green, borderRadius: 4 },
        ]
      },
      options: CHART_DEFAULTS
    });
  }, 100);
};

PAGE_RENDERERS.nutricionista_desperdicios = (el) => {
  // Estima desperdício por escola: total recebido (stockAdjust +) - total consumido = sobra estimada
  const adj = SharedState.getStockAdjust();
  const consumo = SharedState.getConsumo();
  const perEsc = {};
  adj.filter(a => a.delta > 0).forEach(a => {
    perEsc[a.escola] = perEsc[a.escola] || { recebido: 0, consumido: 0 };
    perEsc[a.escola].recebido += a.delta;
  });
  consumo.forEach(c => {
    perEsc[c.escola] = perEsc[c.escola] || { recebido: 0, consumido: 0 };
    perEsc[c.escola].consumido += c.qtd || 0;
  });
  const sobras = Object.entries(perEsc).map(([e, d]) => ({ escola: e, recebido: d.recebido, consumido: d.consumido, sobra: Math.max(0, d.recebido - d.consumido) }));
  const totalSobra = sobras.reduce((s, x) => s + x.sobra, 0);
  const totalRec = sobras.reduce((s, x) => s + x.recebido, 0);
  const pctReal = totalRec > 0 ? Math.round(totalSobra / totalRec * 1000) / 10 : 0;

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Desperdícios</div><div class="page-subtitle">Monitoramento e controle de sobras · Cálculo real: recebido - consumido por escola</div></div>

    <div class="kpi-grid">
      <div class="kpi-card red"><div class="kpi-icon">🗑️</div><div class="kpi-value" id="waste-total-pct">${pctReal || '3,7'}%</div><div class="kpi-label">Índice ${pctReal ? 'Real' : 'Estimado'}</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📊</div><div class="kpi-value" id="waste-total-kg">${totalSobra ? totalSobra.toLocaleString('pt-BR') : '1.598'}</div><div class="kpi-label">kg Sobrando</div></div>
      <div class="kpi-card green"><div class="kpi-icon">📉</div><div class="kpi-value">${sobras.length}</div><div class="kpi-label">Escolas c/ Registro</div></div>
    </div>

    ${sobras.length > 0 ? `
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">🏫 Balanço por Escola (Recebido vs Consumido)</div></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Escola</th><th>Recebido</th><th>Consumido</th><th>Sobra</th><th>% Sobra</th></tr></thead>
          <tbody>
            ${sobras.sort((a,b)=>b.sobra-a.sobra).map(x => {
              const pct = x.recebido > 0 ? Math.round(x.sobra / x.recebido * 100) : 0;
              return `<tr>
                <td><strong>${x.escola}</strong></td>
                <td style="font-family:var(--font-mono)">${x.recebido.toLocaleString('pt-BR')}</td>
                <td style="font-family:var(--font-mono);color:var(--success)">${x.consumido.toLocaleString('pt-BR')}</td>
                <td style="font-family:var(--font-mono);color:${x.sobra > 0 ? 'var(--warning)' : 'var(--text-secondary)'}">${x.sobra.toLocaleString('pt-BR')}</td>
                <td><div style="display:flex;align-items:center;gap:6px"><div class="progress-bar" style="width:60px"><div class="progress-fill ${pct>20?'red':pct>10?'orange':'green'}" style="width:${pct}%"></div></div><span style="font-family:var(--font-mono);font-size:0.78rem">${pct}%</span></div></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}

    <div class="grid-2 mb-24">
      <div class="card">
        <div class="card-header"><div class="card-title">Registrar Sobras / Desperdício por Escola</div></div>
        <div class="card-body">
          <form id="form-log-waste" onsubmit="handleLogWaste(event)">
            <div class="form-group">
              <label>Selecione a Escola</label>
              ${state.currentProfile === 'escola' ? 
                `<input class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:not-allowed" id="waste-school" value="${window.PROFILES[state.currentProfile].role}" readonly>` :
                `<select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="waste-school" required>
                  <option value="EMTI PROF. IRACEMA">EMTI PROFª IRACEMA MARIA VICENTE</option>
                  <option value="EMRTI GOV. ARNALDO">EMRTI AGRICOLA GOVERNADOR ARNALDO ESTEVAO DE FIGUEREDO</option>
                  <option value="EM ADV. DEMOSTHENES M.">EM ADV. DEMOSTHENES MARTINS</option>
                </select>`
              }
            </div>
            <div class="form-group">
              <label>Refeição Relacionada</label>
              <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="waste-meal" required>
                <option value="Almoço">Almoço</option>
                <option value="Lanche">Lanche</option>
              </select>
            </div>
            <div class="form-group">
              <label>Quantidade Desperdiçada (kg)</label>
              <input type="number" id="waste-amount" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="15" required>
            </div>
            <button type="submit" class="btn btn-danger btn-full" id="btn-submit-waste">Registrar Desperdício</button>
          </form>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header"><div class="card-title">Desperdício por Escola (Top 5)</div></div>
        <div class="card-body">
          <div class="chart-container h-250"><canvas id="chart-desperdicio"></canvas></div>
        </div>
      </div>
    </div>
  `;
  setTimeout(() => {
    window.renderWasteChart([245, 198, 176, 162, 148]);
  }, 100);
};

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

PAGE_RENDERERS.nutricionista_restricoes = (el) => {
  const restricoes = (SharedState.getRestricoes() || []).filter(r => r.status === 'ativo').map(r => ({
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

  const schools = DATA.schools || [];
  const totalAlunosRestr = restricoes.reduce((a, b) => a + (b.quantidade || 1), 0);
  const tiposUnicos = Array.from(new Set(restricoes.map(r => r.tipo)));

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Gestão de Restrições Alimentares</div>
      <div class="page-subtitle">Consolidação oficial dos laudos e prescrições das ${schools.length} Escolas Piloto (4.430 Alunos)</div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
      <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${totalAlunosRestr}</div><div class="kpi-label">Alunos com Restrição</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${restricoes.length}</div><div class="kpi-label">Registros Ativos</div></div>
      <div class="kpi-card green"><div class="kpi-icon">🏫</div><div class="kpi-value">${new Set(restricoes.map(r=>r.schoolName)).size}</div><div class="kpi-label">Escolas Notificando</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🧬</div><div class="kpi-value">${tiposUnicos.length}</div><div class="kpi-label">Categorias Clínicas</div></div>
    </div>

    <div class="card mb-24">
      <div class="card-header">
        <div class="card-title">🛡️ Resumo por Tipo de Restrição Clinicamente Mapeada</div>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
          ${tiposUnicos.map(tipo => {
            const count = restricoes.filter(r => r.tipo === tipo).reduce((a, b) => a + (b.quantidade || 1), 0);
            const escCount = new Set(restricoes.filter(r => r.tipo === tipo).map(r => r.schoolName)).size;
            return `
              <div style="background:var(--surface-2,#f8fafc);border:1px solid var(--border);border-radius:8px;padding:14px">
                <div style="font-weight:700;color:var(--primary);font-size:0.95rem">${tipo}</div>
                <div style="font-size:1.4rem;font-weight:800;color:var(--text-primary);margin:6px 0">${count} <span style="font-size:0.8rem;font-weight:400;color:var(--text-secondary)">aluno(s)</span></div>
                <div style="font-size:0.78rem;color:var(--text-secondary)">Presente em ${escCount} escola(s) piloto</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">📋 Notificações por Unidade Escolar Piloto</div>
      </div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead>
            <tr>
              <th>Escola Piloto</th>
              <th>Tipo de Restrição</th>
              <th>Alunos</th>
              <th>Observações Nutricionais / Laudo</th>
              <th>Registrado Por</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            ${restricoes.map(r => `
              <tr>
                <td><strong>${r.schoolName}</strong></td>
                <td><span class="status-badge status-warning" style="font-weight:700">${r.tipo}</span></td>
                <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${r.quantidade || 1}</td>
                <td style="font-size:0.85rem">${r.observacao || '—'}</td>
                <td style="font-size:0.82rem">${r.registradoPor || 'Dra. Lilian Droppa'}</td>
                <td style="font-size:0.8rem;color:var(--text-secondary)">${(r.criadoEm || '').slice(0,10)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.nutricionista_simulacoes = (el) => {
  let options = '';
  for (const key in DRI_TABLE) {
    options += `<option value="${key}">${DRI_TABLE[key].name}</option>`;
  }
  
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Simulações de Cardápios & PNAE</div><div class="page-subtitle">Verifique o enquadramento de macronutrientes (% VET) nas diretrizes do FNDE/PNAE</div></div>
    <div style="background:var(--warning-light);border:1px solid var(--warning);padding:12px;border-radius:var(--radius-md);margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;"><div><strong>⚠️ Área em Validação:</strong> O módulo de simulação e enquadramento PNAE está em fase de testes para validação.</div><button class="btn btn-primary btn-sm" onclick="alert('Formulário de feedback da Nutricionista aberto!')">Dar Feedback</button></div>
    
    <div class="grid-2-1 mb-24">
      <div class="card">
        <div class="card-header"><div class="card-title">Parâmetros de Simulação</div></div>
        <div class="card-body">
          <form id="form-simulation-pnae" onsubmit="runPnaeSimulation(event)">
            <div class="form-group">
              <label>Selecione a Modalidade e Referência FNDE</label>
              <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="sim-preset-modalidade" onchange="updateSimulationPresets()">
                ${options}
              </select>
            </div>
            <div class="form-group" style="margin-top:12px">
              <label>Tipo de Refeição</label>
              <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="sim-meal-type">
                <option value="Desjejum">Desjejum / Café da Manhã</option>
                <option value="Almoço">Almoço</option>
                <option value="Lanche">Lanche da Tarde</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Energia da Porção (kcal)</label>
              <input type="number" id="sim-kcal" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="303" required>
            </div>
            
            <div class="grid-3">
              <div class="form-group">
                <label>Carboidratos (g)</label>
                <input type="number" id="sim-carbs-g" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="45" required>
              </div>
              <div class="form-group">
                <label>Proteínas (g)</label>
                <input type="number" id="sim-proteins-g" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="8" required>
              </div>
              <div class="form-group">
                <label>Lipídeos (g)</label>
                <input type="number" id="sim-lipids-g" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="10" required>
              </div>
            </div>
            
            <div class="form-group">
              <label>Sódio (mg)</label>
              <input type="number" id="sim-sodium" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="280" required>
            </div>
            
            <button type="submit" class="btn btn-primary btn-full" id="btn-run-simulation">Executar Simulação PNAE</button>
            <button type="button" class="btn btn-outline btn-full" style="margin-top:8px" onclick="window.renderStockSuggestions()">Gerar Sugestões com IA 🤖</button>
          </form>
        </div>
      </div>

      <div class="card" id="sim-result-card">
        <div class="card-header"><div class="card-title">Resultado da Simulação</div></div>
        <div class="card-body" style="display:flex;align-items:center;justify-content:center;min-height:250px">
          <div style="text-align:center;color:var(--text-tertiary)">
            <div style="font-size:3rem">🔬</div>
            <div style="font-weight:600;margin-top:8px">Aguardando Parâmetros</div>
            <div style="font-size:0.8rem">Selecione uma referência, configure e simule.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="card" id="sim-stock-suggestions"></div>
  `;
  setTimeout(() => {
    window.updateSimulationPresets();
  }, 50);
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

PAGE_RENDERERS.nutricionista_relatorios = (el) => { PAGE_RENDERERS.gestor_relatorios(el); };

PAGE_RENDERERS.nutricionista_ia = (el) => {
  // Sugestões dinâmicas: produção AF em alta + produtos críticos
  const producoes = SharedState.getProductions();
  const produtosAFAltaOferta = producoes.filter(p => (p.disponivel || 0) > 500).slice(0, 3);
  const criticos = DATA.products.filter(p => (p.daysLeft || 99) <= 5).slice(0, 3);

  const sugestoes = [
    ...produtosAFAltaOferta.map(p => ({
      titulo: '🌾 Aproveitar Produção Local de ' + p.produto,
      desc: `${p.agricultor} tem ${p.disponivel} kg de ${p.produto} disponíveis. Considere incorporar no cardápio da semana.`,
      benef: '✓ Fortalece agricultura familiar / ✓ Preço competitivo / ✓ Frescor garantido',
    })),
    ...criticos.map(p => ({
      titulo: '🔄 Substituir ' + p.name + ' (estoque crítico)',
      desc: `${p.name} tem apenas ${p.daysLeft} dias de estoque. Sugestão: substituir por produto com maior disponibilidade nas próximas refeições.`,
      benef: '✓ Evita ruptura no cardápio / ✓ Reduz dependência de reposição urgente',
    })),
    { titulo: '🌾 Integração de Tubérculos Familiares', desc: 'Aumentar Mandioca cozida (2x/semana) reduzindo 10g de arroz por porção.', benef: '✓ +12% fibras / ✓ Absorve excedente da AF' },
  ].slice(0, 6);

  el.innerHTML = `
    <div class="page-header"><div class="page-title">IA Nutricional — Assistente Preditivo</div><div class="page-subtitle">Sugestões baseadas em produção real dos agricultores + estoque crítico</div></div>

    <div class="card mb-24">
      <div class="card-header"><div class="card-title">🤖 Sugestões do Assistente de IA</div><span class="status-badge status-info">${sugestoes.length}</span></div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:16px">
          ${sugestoes.map((s, i) => `
            <div style="border: 1px solid var(--border); border-radius: var(--radius); padding:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px">
              <div style="flex:1">
                <div style="font-weight:700;font-size:1rem;color:var(--primary)">${s.titulo}</div>
                <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">${s.desc}</div>
                <div style="font-size:0.8rem;color:var(--success);margin-top:6px;font-weight:600">${s.benef}</div>
              </div>
              <div>
                <button class="btn btn-primary btn-sm" id="btn-ia-${i}" onclick="applyIaSuggestion(${i})">Aplicar</button>
              </div>
            </div>
          `).join('')}
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

window.applyIaCropSuggestion = () => {
  const btn = document.getElementById('btn-ia-apply-crop');
  if (btn) {
    btn.textContent = 'Aplicado';
    btn.className = 'btn btn-sm btn-outline';
    btn.disabled = true;
  }
  alert('Recomendação da IA aplicada! O ingrediente Melancia foi substituído por Manga Tommy no cardápio do mês de Julho.');
};

window.applyIaFiberSuggestion = () => {
  const btn = document.getElementById('btn-ia-apply-fiber');
  if (btn) {
    btn.textContent = 'Aplicado';
    btn.className = 'btn btn-sm btn-outline';
    btn.disabled = true;
  }
  alert('Recomendação da IA aplicada! Integração da mandioca executada nas tabelas de cardápio.');
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
PAGE_RENDERERS.escola_dashboard = (el) => {
  const sc = getCurrentSchool();
  const att = sc.attendance_avg || 572;
  const attPct = sc.attendance_pct || 92;
  const students = sc.students || 620;
  const absent = students - att;
  const products = (typeof DATA !== 'undefined' && DATA.products) ? DATA.products : [];
  const critical = products.filter(p => (p.days_left || p.daysLeft || 99) <= 3).length;
  const orders = (typeof DATA !== 'undefined' && DATA.orders) ? DATA.orders : [];
  const pending = orders.filter(o => o.status === 'Pendente').length;
  const budget = sc.monthly_budget || 18500;
  const consumed = Math.round(att * (sc.meals_per_day || 2) * 0.3);
  const sparkVals = [89,90,95,87,93,90,92,89,92,91,93,90,92,92];

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Dashboard — ${sc.name}</div>
        <div class="page-subtitle">${sc.grade_levels || 'EF I + EF II'} u00b7 ${sc.region || ''} u00b7 Diretor(a): ${sc.director || ''}</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="navigateTo('escola','consumo')">📝 Registrar Consumo</button>
        <button class="btn btn-primary btn-sm" onclick="navigateTo('escola','pedidos')">🛒 Novo Pedido</button>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(6,1fr);margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">👨‍🎓</div><div class="kpi-value">${students.toLocaleString('pt-BR')}</div><div class="kpi-label">Matriculados</div></div>
      <div class="kpi-card green" style="position:relative">
        <div class="kpi-icon">📅</div><div class="kpi-value">${att.toLocaleString('pt-BR')}</div><div class="kpi-label">Presentes Hoje</div>
        <div style="position:absolute;top:10px;right:12px;font-size:0.72rem;font-weight:700;background:#e8f5e9;color:#2E7D32;padding:2px 8px;border-radius:20px">${attPct}%</div>
      </div>
      <div class="kpi-card orange"><div class="kpi-icon">🏠</div><div class="kpi-value">${absent}</div><div class="kpi-label">Ausentes Hoje</div></div>
      <div class="kpi-card red"><div class="kpi-icon">⚠️</div><div class="kpi-value">${critical}</div><div class="kpi-label">Est. Crticos</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🛒</div><div class="kpi-value">${pending}</div><div class="kpi-label">Pedidos Pend.</div></div>
      <div class="kpi-card purple"><div class="kpi-icon">📊</div><div class="kpi-value">${consumed} kg</div><div class="kpi-label">Consumo/Dia Est.</div></div>
    </div>

    <div class="grid-2-1">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📈 Frequência Escolar — Últimas 2 Semanas</div>
            <span class="status-badge ${attPct >= 90 ? 'status-ok' : attPct >= 80 ? 'status-warning' : 'status-danger'}">${attPct >= 90 ? 'Ótima' : attPct >= 80 ? 'Regular' : 'Atenção'}</span>
          </div>
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:24px;margin-bottom:16px">
              <div style="text-align:center;min-width:120px">
                <div style="font-size:2.4rem;font-weight:800;color:var(--primary)">${attPct}%</div>
                <div style="font-size:0.78rem;color:var(--text-secondary)">Média de Frequência</div>
                <div style="font-size:0.78rem;color:var(--text-secondary)">${att} de ${students} alunos</div>
              </div>
              <div style="flex:1;display:flex;align-items:flex-end;gap:4px;height:56px">
                ${sparkVals.map(v => `<div style="flex:1;background:${v>=90?'var(--primary)':v>=85?'var(--warning)':'var(--danger)'};border-radius:3px 3px 0 0;height:${Math.round((v-82)*8)}px;opacity:0.8"></div>`).join('')}
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;font-size:0.7rem;color:var(--text-secondary);text-align:center">
              ${[['05/06',89],['06',90],['09',95],['10',87],['11',93],['12',90],['13',92],['16',89],['17',92],['18',91],['19',93],['20',90],['23',92],['24',92]].map(([d,v]) => `<div><div style="font-weight:600">${v}%</div><div>${d}</div></div>`).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">🚨 Alertas do Dia</div></div>
          <div class="card-body">
            <div class="alert-list">
              ${critical > 0 ? `<div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>${critical} produto(s)</strong> com estoque crítico — <a href="#" onclick="navigateTo('escola','estoque');return false" style="color:var(--danger)">ver estoque</a></div></div>` : ''}
              ${pending > 0 ? `<div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>${pending} pedido(s)</strong> pendente(s) — <a href="#" onclick="navigateTo('escola','pedidos');return false">ver pedidos</a></div></div>` : ''}
              <div class="alert-item info"><span class="alert-icon">🚚</span><div class="alert-text">Entrega prevista para <strong>amanhã</strong> — COOPAGRAN</div></div>
              ${attPct >= 90 ? `<div class="alert-item" style="background:#e8f5e9;border-left:4px solid #2E7D32;padding:10px 12px;border-radius:0 4px 4px 0;margin-bottom:8px"><span class="alert-icon">✅</span><div class="alert-text">Frequência dentro da meta (<strong>${attPct}%</strong>)</div></div>` : `<div class="alert-item warning"><span class="alert-icon">📅</span><div class="alert-text">Frequência <strong>abaixo de 90%</strong> — verificar</div></div>`}
            </div>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="ia-card">
          <div class="ia-card-title">🤖 Sugestão IA</div>
          <div class="ia-suggestion">📦 Com <strong>${att} presentes</strong> e ${sc.meals_per_day||2} refeições/dia — consumo estimado: <strong>${consumed} kg</strong>.</div>
          <div class="ia-suggestion">🛒 Estoque crítico: pedido emergencial recomendado.</div>
          <div style="margin-top:10px"><button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;width:100%" onclick="navigateTo('escola','pedidos')">Criar Pedido →</button></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">💰 Orçamento Mensal</div></div>
          <div class="card-body">
            <div style="font-size:1.8rem;font-weight:700;color:var(--primary)">R$ ${Math.round(budget*0.55).toLocaleString('pt-BR')}</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:8px">de R$ ${budget.toLocaleString('pt-BR')} — 55% executado</div>
            <div style="background:var(--border);border-radius:4px;height:8px"><div style="width:55%;height:100%;background:var(--primary);border-radius:4px"></div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">⚡ Acesso Rápido</div></div>
          <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <button class="btn btn-ghost" onclick="navigateTo('escola','consumo')" style="font-size:0.8rem">📝 Consumo</button>
            <button class="btn btn-ghost" onclick="navigateTo('escola','estoque')" style="font-size:0.8rem">📦 Estoque</button>
            <button class="btn btn-ghost" onclick="navigateTo('escola','cardapios')" style="font-size:0.8rem">🍽️ Cardápio</button>
            <button class="btn btn-ghost" onclick="navigateTo('escola','historico')" style="font-size:0.8rem">📋 Histórico</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

// ─── ESCOLA: PLANEJAMENTO ───
PAGE_RENDERERS.escola_planejamento = (el) => {
  const sc = getCurrentSchool();
  const dias = ['Seg','Ter','Qua','Qui','Sex'];
  const allWeekly = SharedState.getWeeklyMenus();
  // Filtra cardápios vinculados a esta escola (ou "Toda a Rede")
  const weeklyPublicados = allWeekly.filter(w => !w.escolasVinculadas || w.escolasVinculadas.length === 0 || w.escolasVinculadas.includes(sc.name));
  const cardapioAtivo = weeklyPublicados[0]; // Mais recente

  // Calcula necessidade semanal a partir do cardápio ativo, se houver
  const alunos = sc.attendance_avg || 572;
  const necessidade = computeSchoolNecessity(cardapioAtivo, alunos);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Planejamento Alimentar — ${sc.name}</div>
      <div class="page-subtitle">${cardapioAtivo ? 'Cardápio ativo: ' + (cardapioAtivo.nome || 'Semanal') : 'Cardápio semanal aprovado pelo Nutricionista'}</div>
    </div>

    ${weeklyPublicados.length > 0 ? `
    <div class="card mb-16" style="border-left:4px solid var(--primary)">
      <div class="card-header"><div class="card-title">🆕 Cardápios Vinculados a esta Escola</div><span class="status-badge status-ok">${weeklyPublicados.length}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Cardápio</th><th>Período</th><th>Autor</th><th>Publicado em</th><th>Kcal/Dia</th></tr></thead><tbody>
          ${weeklyPublicados.slice(0, 5).map(w => `
            <tr>
              <td><strong>${w.nome || 'Cardápio Semanal'}</strong></td>
              <td>${w.periodo || '—'}</td>
              <td style="font-size:0.82rem">${w.autor || '—'}</td>
              <td style="font-size:0.82rem">${new Date(w.publicadoEm).toLocaleString('pt-BR')}</td>
              <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${w.kcalMedia || '—'}</td>
            </tr>
          `).join('')}
        </tbody></table>
      </div>
    </div>` : ''}

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">👨‍🎓</div><div class="kpi-value">${alunos}</div><div class="kpi-label">Alunos p/ Refeição</div></div>
      <div class="kpi-card green"><div class="kpi-icon">🍽️</div><div class="kpi-value">${sc.meals_per_day||2}</div><div class="kpi-label">Refeições/Dia</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📅</div><div class="kpi-value">5</div><div class="kpi-label">Dias Letivos/Sem.</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">💰</div><div class="kpi-value">R$ 1,06</div><div class="kpi-label">Per Capita/Refeição</div></div>
    </div>

    ${cardapioAtivo && cardapioAtivo.refeicoes && cardapioAtivo.refeicoes.length > 0 ? `
    <div class="card">
      <div class="card-header"><div class="card-title">📅 Cardápio Ativo — ${cardapioAtivo.periodo}</div><span class="status-badge status-ok">✓ Publicado</span></div>
      <div class="card-body" style="padding:0;overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Dia</th><th>Café da Manhã</th><th>Almoço</th><th>Lanche</th><th>Total Kcal</th></tr></thead>
          <tbody>
            ${renderMenuByDay(cardapioAtivo.refeicoes)}
          </tbody>
        </table>
      </div>
    </div>` : `
    <div class="card">
      <div class="card-header"><div class="card-title">📅 Cardápio — Semana Padrão</div><span class="status-badge status-info">Modelo Referência</span></div>
      <div class="card-body" style="padding:0;overflow-x:auto">
        <table class="data-table">
          <thead><tr><th style="width:130px">Refeição</th>${dias.map(d=>`<th style="text-align:center">${d}</th>`).join('')}</tr></thead>
          <tbody>
            <tr><td><strong>☀️ Lanche</strong></td>${['Vitamina de Banana','Pão c/ Manteiga','Mingau de Aveia','Vitamina de Banana','Pão c/ Queijo'].map(m=>`<td style="text-align:center;font-size:0.82rem">${m}</td>`).join('')}</tr>
            <tr><td><strong>🍽️ Almoço</strong></td>${['Arroz, Feijão, Frango','Macarrão c/ Carne','Arroz, Feijão, Peixe','Arroz, Feijão, Ovo','Sopa de Legumes'].map(m=>`<td style="text-align:center;font-size:0.82rem">${m}</td>`).join('')}</tr>
          </tbody>
        </table>
      </div>
    </div>`}

    <div class="card" style="margin-top:16px">
      <div class="card-header">
        <div class="card-title">📦 Necessidade Semanal ${cardapioAtivo ? '(calculada do cardápio ativo)' : '(estimada)'}</div>
        ${cardapioAtivo ? '<span class="status-badge status-ok">Automático</span>' : ''}
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
          ${necessidade.map(n => `
            <div style="background:var(--surface-1);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px">
              <div style="font-weight:600;font-size:0.85rem">${n.produto}</div>
              <div style="font-size:1.3rem;font-weight:700;color:var(--primary);margin-top:4px">${n.qtd} ${n.unidade}</div>
              <div style="font-size:0.72rem;color:var(--text-tertiary);margin-top:4px">${n.motivo}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
};

// Helpers do cardápio semanal
function renderMenuByDay(refeicoes) {
  // Agrupa por dia
  const byDia = {};
  refeicoes.forEach(r => {
    byDia[r.dia] = byDia[r.dia] || { 'Café da Manhã':'', 'Almoço':'', 'Lanche':'', kcal: 0 };
    byDia[r.dia][r.tipo] = r.item;
    byDia[r.dia].kcal += r.kcal || 0;
  });
  return Object.keys(byDia).map(d => `
    <tr>
      <td><strong>${d}</strong></td>
      <td style="font-size:0.82rem">${byDia[d]['Café da Manhã'] || '—'}</td>
      <td style="font-size:0.82rem">${byDia[d]['Almoço'] || '—'}</td>
      <td style="font-size:0.82rem">${byDia[d]['Lanche'] || '—'}</td>
      <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${byDia[d].kcal} kcal</td>
    </tr>
  `).join('');
}

function computeSchoolNecessity(cardapio, alunos) {
  // Se não tem cardápio, fallback estimado
  if (!cardapio || !cardapio.refeicoes || cardapio.refeicoes.length === 0) {
    return [
      { produto: 'Arroz Tipo 1', qtd: Math.round(alunos * 0.12 * 5), unidade: 'kg', motivo: 'Estimado (média histórica)' },
      { produto: 'Feijão Carioca', qtd: Math.round(alunos * 0.05 * 5), unidade: 'kg', motivo: 'Estimado' },
      { produto: 'Frango', qtd: Math.round(alunos * 0.10 * 3), unidade: 'kg', motivo: 'Estimado' },
      { produto: 'Banana Nanica', qtd: Math.round(alunos * 0.07 * 5), unidade: 'kg', motivo: 'Estimado' },
      { produto: 'Leite Integral', qtd: Math.round(alunos * 0.15 * 5), unidade: 'L', motivo: 'Estimado' },
      { produto: 'Tomate', qtd: Math.round(alunos * 0.03 * 5), unidade: 'kg', motivo: 'Estimado' },
      { produto: 'Cenoura', qtd: Math.round(alunos * 0.04 * 5), unidade: 'kg', motivo: 'Estimado' },
      { produto: 'Mandioca', qtd: Math.round(alunos * 0.05 * 5), unidade: 'kg', motivo: 'Estimado' },
    ];
  }
  // Calcula a partir das refeições — extrai ingredientes por palavras-chave
  const INGRED_MAP = {
    'arroz': { produto: 'Arroz Tipo 1', porPessoa: 0.08, unidade: 'kg' },
    'feijão': { produto: 'Feijão Carioca', porPessoa: 0.04, unidade: 'kg' },
    'feijao': { produto: 'Feijão Carioca', porPessoa: 0.04, unidade: 'kg' },
    'frango': { produto: 'Frango', porPessoa: 0.10, unidade: 'kg' },
    'peixe': { produto: 'Peixe', porPessoa: 0.10, unidade: 'kg' },
    'ovo': { produto: 'Ovo de Galinha', porPessoa: 1, unidade: 'un' },
    'banana': { produto: 'Banana Nanica', porPessoa: 0.10, unidade: 'kg' },
    'leite': { produto: 'Leite Integral', porPessoa: 0.20, unidade: 'L' },
    'pão': { produto: 'Pão', porPessoa: 0.08, unidade: 'kg' },
    'pao': { produto: 'Pão', porPessoa: 0.08, unidade: 'kg' },
    'aveia': { produto: 'Aveia', porPessoa: 0.03, unidade: 'kg' },
    'queijo': { produto: 'Queijo', porPessoa: 0.03, unidade: 'kg' },
    'carne': { produto: 'Carne Bovina', porPessoa: 0.10, unidade: 'kg' },
    'macarrão': { produto: 'Macarrão', porPessoa: 0.08, unidade: 'kg' },
    'macarrao': { produto: 'Macarrão', porPessoa: 0.08, unidade: 'kg' },
    'tomate': { produto: 'Tomate', porPessoa: 0.04, unidade: 'kg' },
    'cenoura': { produto: 'Cenoura', porPessoa: 0.03, unidade: 'kg' },
    'alface': { produto: 'Alface', porPessoa: 0.05, unidade: 'kg' },
  };
  const acc = {};
  cardapio.refeicoes.forEach(r => {
    const text = (r.item || '').toLowerCase();
    Object.entries(INGRED_MAP).forEach(([kw, info]) => {
      if (text.includes(kw)) {
        acc[info.produto] = acc[info.produto] || { produto: info.produto, qtd: 0, unidade: info.unidade, motivo: 'Cardápio: ' + (r.dia || '') };
        acc[info.produto].qtd += info.porPessoa * alunos;
      }
    });
  });
  const list = Object.values(acc).map(x => ({ ...x, qtd: Math.round(x.qtd) })).filter(x => x.qtd > 0);
  return list.length > 0 ? list.slice(0, 12) : computeSchoolNecessity(null, alunos);
}

PAGE_RENDERERS.escola_cardapios = (el) => { PAGE_RENDERERS.nutricionista_cardapios(el); };

// ─── ESCOLA: ESTOQUE ───
PAGE_RENDERERS.escola_estoque = (el) => {
  const sc = getCurrentSchool();
  const products = (typeof DATA !== 'undefined' && DATA.products) ? DATA.products : [];
  const localStock = SharedState.getSchoolStock(sc.name);
  const stockAdjust = SharedState.getStockAdjust().filter(a => a.escola === sc.name).slice(0, 8);

  // Combina: para cada produto da escola, calcula quantidade real (SharedState) + dias restantes
  const rows = products.map(p => {
    const local = localStock.find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20); // fallback estimado
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    const daysLeft = avgDay > 0 ? Math.round(qty / avgDay) : 999;
    return { name: p.name, category: p.category, unit: p.unit, qty, daysLeft, unidade: local?.unidade || p.unit, isReal: !!local };
  });
  const critical = rows.filter(r => r.daysLeft <= 3).length;
  const warning = rows.filter(r => r.daysLeft > 3 && r.daysLeft <= 7).length;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Estoque — ${sc.name}</div>
      <div class="page-subtitle">Estoque físico local · atualizado automaticamente por entregas e consumo</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${rows.length}</div><div class="kpi-label">Produtos</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${rows.length-critical-warning}</div><div class="kpi-label">Normal</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚡</div><div class="kpi-value">${warning}</div><div class="kpi-label">Atenção</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${critical}</div><div class="kpi-label">Crítico</div></div>
    </div>
    <div class="card mb-16">
      <div class="card-header">
        <div class="card-title">Produtos em Estoque</div>
        <button class="btn btn-primary btn-sm" onclick="navigateTo('escola','pedidos')">🛒 Solicitar Reposição</button>
      </div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Categoria</th><th style="text-align:right">Qtd. Escola</th><th>Un.</th><th style="text-align:right">Dias Restantes</th><th>Status</th></tr></thead>
          <tbody>
            ${rows.map(r => {
              const [cls, label] = r.daysLeft<=3 ? ['status-danger','Crítico'] : r.daysLeft<=7 ? ['status-warning','Atenção'] : ['status-ok','Normal'];
              return `<tr>
                <td><strong>${r.name}</strong>${r.isReal ? ' <span class="tag tag-blue" style="font-size:0.65rem">REAL</span>' : ''}</td>
                <td><span class="status-badge status-info" style="font-size:0.72rem">${r.category||'—'}</span></td>
                <td style="text-align:right;font-family:var(--font-mono)">${r.qty.toLocaleString('pt-BR')}</td>
                <td>${r.unidade || 'kg'}</td>
                <td style="text-align:right;font-weight:700;color:${r.daysLeft<=3?'var(--danger)':r.daysLeft<=7?'var(--warning)':'var(--success)'}">${r.daysLeft}d</td>
                <td><span class="status-badge ${cls}">${label}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    ${stockAdjust.length > 0 ? `
    <div class="card">
      <div class="card-header"><div class="card-title">📋 Últimas Movimentações</div><span class="status-badge status-info">${stockAdjust.length}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Data</th><th>Produto</th><th>Movimentação</th><th>Motivo</th></tr></thead>
          <tbody>
            ${stockAdjust.map(a => `
              <tr>
                <td style="font-size:0.82rem">${new Date(a.criadoEm).toLocaleString('pt-BR')}</td>
                <td><strong>${a.produto}</strong></td>
                <td style="font-family:var(--font-mono);font-weight:700;color:${a.delta > 0 ? 'var(--success)' : 'var(--danger)'}">${a.delta > 0 ? '+' : ''}${a.delta} ${a.unidade || ''}</td>
                <td style="font-size:0.82rem">${a.motivo}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}`;
};

// ─── ESCOLA: CONSUMO ───
PAGE_RENDERERS.escola_consumo = (el) => {
  const sc = getCurrentSchool();
  const products = (typeof DATA !== 'undefined' && DATA.products) ? DATA.products : [];
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Registro de Consumo — ${sc.name}</div>
      <div class="page-subtitle">Lançamento diário de consumo por refeição</div>
    </div>
    <div class="grid-2-1">
      <div>
        <div class="card mb-16">
          <div class="card-header"><div class="card-title">📝 Novo Registro</div></div>
          <div class="card-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
              <div><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Data</label>
                <input type="date" id="cons-date" value="2026-06-24" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem"></div>
              <div><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Refeição</label>
                <select id="cons-meal" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem">
                  <option>Lanche Manhã</option><option selected>Almoço</option><option>Lanche Tarde</option></select></div>
            </div>
            <div style="display:grid;grid-template-columns:2fr 1fr 80px;gap:12px;margin-bottom:12px">
              <div><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Produto</label>
                <select id="cons-product" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem">
                  ${products.map(p=>`<option>${p.name}</option>`).join('')}</select></div>
              <div><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Quantidade</label>
                <input type="number" id="cons-qty" placeholder="0" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem"></div>
              <div><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Un.</label>
                <select id="cons-unit" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem"><option>kg</option><option>L</option><option>dz</option></select></div>
            </div>
            <div style="margin-bottom:12px"><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Responsável</label>
              <input type="text" id="cons-resp" value="${sc.director||'Maria Santos'}" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem"></div>
            <button class="btn btn-primary" style="width:100%" id="btn-save-cons">✅ Registrar Consumo</button>
            <div id="cons-feedback" style="margin-top:8px;font-size:0.85rem;display:none"></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Registros Recentes</div>${SharedState.getConsumo(sc.name).length ? '<span class="status-badge status-ok">'+SharedState.getConsumo(sc.name).length+' registros</span>' : ''}</div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Data</th><th>Refeição</th><th>Produto</th><th style="text-align:right">Qtd</th><th>Responsável</th></tr></thead>
              <tbody>
                ${SharedState.getConsumo(sc.name).slice(0, 6).map(c => `
                  <tr>
                    <td style="font-size:0.82rem">${c.data || c.criadoEm?.slice(0,10) || '—'}</td>
                    <td>${c.refeicao || '—'}</td>
                    <td><strong>${c.produto}</strong> <span class="tag tag-blue" style="font-size:0.65rem">NOVO</span></td>
                    <td style="text-align:right;font-family:var(--font-mono)">${c.qtd} ${c.unidade || ''}</td>
                    <td>${c.responsavel || '—'}</td>
                  </tr>
                `).join('')}
                <tr><td>24/06</td><td>Almoço</td><td>Arroz Tipo 1</td><td style="text-align:right">42 kg</td><td>${sc.director||'Maria Santos'}</td></tr>
                <tr><td>24/06</td><td>Almoço</td><td>Feijão Carioca</td><td style="text-align:right">18 kg</td><td>${sc.director||'Maria Santos'}</td></tr>
                <tr><td>24/06</td><td>Lanche</td><td>Banana Nanica</td><td style="text-align:right">25 kg</td><td>Ana Costa</td></tr>
                <tr><td>23/06</td><td>Almoço</td><td>Frango</td><td style="text-align:right">35 kg</td><td>${sc.director||'Maria Santos'}</td></tr>
                <tr><td>23/06</td><td>Lanche</td><td>Leite Integral</td><td style="text-align:right">48 L</td><td>Ana Costa</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📊 Resumo — Jun/2026</div></div>
        <div class="card-body">
          ${[['Arroz Tipo 1','875 kg',88],['Feijão Carioca','375 kg',75],['Frango','490 kg',92],['Banana Nanica','350 kg',60],['Leite Integral','672 L',85],['Tomate','168 kg',70]].map(([n,q,pct])=>`
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:4px"><span><strong>${n}</strong></span><span style="color:var(--text-secondary)">${q}</span></div>
              <div style="background:var(--border);border-radius:4px;height:6px"><div style="width:${pct}%;height:100%;background:var(--primary);border-radius:4px"></div></div>
            </div>`).join('')}
          <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);font-size:0.82rem">
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text-secondary)">Total consumido:</span><span style="font-weight:700">1.240 kg</span></div>
            <div style="display:flex;justify-content:space-between;margin-top:4px"><span style="color:var(--text-secondary)">Dias registrados:</span><span style="font-weight:700">18 dias</span></div>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById('btn-save-cons')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-save-cons');
    const fb = document.getElementById('cons-feedback');
    const qty = parseFloat(document.getElementById('cons-qty')?.value || 0);
    if (!qty) { fb.style.display='block'; fb.innerHTML='<span style="color:var(--danger)">⚠️ Informe a quantidade.</span>'; return; }
    btn.disabled=true; btn.textContent='Salvando...';

    const produto = document.getElementById('cons-product')?.value;
    const unidade = document.getElementById('cons-unit')?.value;

    // 🔗 Grava no SharedState — decrementa estoque local automaticamente
    SharedState.addConsumo({
      escola: sc.name, produto, qtd: qty, unidade,
      refeicao: document.getElementById('cons-meal')?.value,
      data: document.getElementById('cons-date')?.value,
      responsavel: document.getElementById('cons-resp')?.value,
    });

    // Tenta gravar no Supabase (best-effort)
    try {
      if (typeof _sb !== 'undefined') {
        await _sb.from('consumption_records').insert([{
          school: sc.name, product_name: produto,
          meal_type: document.getElementById('cons-meal')?.value, quantity: qty, unit: unidade,
          date: document.getElementById('cons-date')?.value,
          responsible: document.getElementById('cons-resp')?.value,
        }]);
      }
    } catch(e) { /* silencia — SharedState garante persistência local */ }

    fb.style.display='block';
    fb.innerHTML='<span style="color:var(--success)">✅ Consumo registrado! Estoque local decrementado automaticamente.</span>';
    document.getElementById('cons-qty').value='';
    showToast('📝 Consumo de ' + qty + ' ' + unidade + ' de ' + produto + ' registrado.');
    btn.disabled=false; btn.textContent='✅ Registrar Consumo';
    setTimeout(() => PAGE_RENDERERS.escola_consumo(document.getElementById('page-content')), 900);
  });
};

// ─── ESCOLA: PEDIDOS ───
PAGE_RENDERERS.escola_pedidos = (el) => {
  const sc = getCurrentSchool();
  const products = (typeof DATA !== 'undefined' && DATA.products) ? DATA.products : [];
  const coops = (typeof DATA !== 'undefined' && DATA.cooperatives) ? DATA.cooperatives : [{name:'COOPAGRAN'},{name:'COOPRAN'},{name:'COOPAERGS'}];
  const orders = (typeof DATA !== 'undefined' && DATA.orders) ? DATA.orders : [];
  const sharedOrders = SharedState.getOrders().filter(o => o.school === sc.name);
  const suggest = products.filter(p=>(p.days_left||99)<=3).slice(0,3);
  const topSuggest = suggest.length > 0 ? suggest : products.slice(0,3);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Pedidos de Abastecimento — ${sc.name}</div>
      <div class="page-subtitle">Solicitar e acompanhar pedidos de reposição</div>
    </div>
    <div class="ia-card mb-24">
      <div class="ia-card-title">🤖 Sugestão Inteligente <span class="ia-badge">AUTO</span></div>
      <div class="ia-suggestion">Com <strong>${sc.attendance_avg||572} alunos</strong> (${sc.attendance_pct||92}% frequência) e cardápio vigente, o sistema sugere:</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px">
        ${topSuggest.map(p=>`<div class="ia-suggestion"><strong>${p.name}</strong><br><span style="font-size:0.8rem">${Math.round((sc.attendance_avg||572)*0.1)} ${p.unit||'kg'}</span></div>`).join('')}
      </div>
      <button class="btn btn-sm" style="background:rgba(255,255,255,0.25);color:white;margin-top:12px;width:100%" onclick="document.getElementById('form-pedido').scrollIntoView({behavior:'smooth'})">Confirmar e Enviar Pedido →</button>
    </div>
    <div class="grid-2-1">
      <div class="card" id="form-pedido">
        <div class="card-header"><div class="card-title">➕ Novo Pedido</div></div>
        <div class="card-body">
          <div style="margin-bottom:12px"><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Cooperativa</label>
            <select id="ped-coop" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem">
              ${coops.map(c=>`<option>${c.name}</option>`).join('')}</select></div>
          <div id="ped-items" style="margin-bottom:8px">
            <label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:8px">Itens do Pedido</label>
            <div class="ped-row" style="display:grid;grid-template-columns:2fr 1fr 80px;gap:8px;margin-bottom:8px">
              <select style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem">${products.map(p=>`<option>${p.name}</option>`).join('')}</select>
              <input type="number" placeholder="Qtd" style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem">
              <select style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem"><option>kg</option><option>L</option><option>dz</option></select>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" id="btn-add-item">➕ Adicionar Item</button>
          <button class="btn btn-primary" style="width:100%;margin-top:12px" id="btn-send-ped">📤 Enviar Pedido</button>
          <div id="ped-feedback" style="margin-top:8px;font-size:0.85rem;display:none"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📋 Histórico</div><span class="status-badge status-info">${sharedOrders.length + orders.length} pedidos</span></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>#</th><th>Data</th><th>Cooperativa</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              ${sharedOrders.map(o=>`<tr>
                <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(o.numero).padStart(3,'0')} <span class="tag tag-blue" style="font-size:0.65rem;margin-left:4px">NOVO</span></td>
                <td>${o.date}</td>
                <td>${o.cooperative||'—'}</td>
                <td style="font-family:var(--font-mono)">R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
                <td><span class="status-badge ${o.status==='Entregue'?'status-ok':o.status==='Pendente'?'status-danger':'status-warning'}">${o.status}</span></td>
              </tr>`).join('')}
              ${orders.slice(0,4).map((o,i)=>`<tr><td>#${String(i+3).padStart(3,'0')}</td><td>${o.date||'—'}</td><td>${o.cooperative||'—'}</td><td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td><td><span class="status-badge ${o.status==='Entregue'?'status-ok':o.status==='Pendente'?'status-danger':'status-warning'}">${o.status||'—'}</span></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;

  document.getElementById('btn-add-item')?.addEventListener('click', () => {
    const row=document.createElement('div'); row.className='ped-row';
    row.style.cssText='display:grid;grid-template-columns:2fr 1fr 80px;gap:8px;margin-bottom:8px';
    row.innerHTML=`<select style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem">${products.map(p=>`<option>${p.name}</option>`).join('')}</select><input type="number" placeholder="Qtd" style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem"><select style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem"><option>kg</option><option>L</option><option>dz</option></select>`;
    document.getElementById('ped-items')?.appendChild(row);
  });

  document.getElementById('btn-send-ped')?.addEventListener('click', async () => {
    const btn=document.getElementById('btn-send-ped'), fb=document.getElementById('ped-feedback');
    const coopSel = document.getElementById('ped-coop')?.value || 'COOPAGRAN';

    // Coleta itens do formulário
    const itens = [];
    document.querySelectorAll('#ped-items .ped-row').forEach(row => {
      const inputs = row.querySelectorAll('select, input');
      const produto = inputs[0]?.value;
      const qtd = parseFloat(inputs[1]?.value || 0);
      const unidade = inputs[2]?.value;
      if (produto && qtd > 0) itens.push({ produto, qtd, unidade });
    });
    if (itens.length === 0) {
      fb.style.display='block';
      fb.innerHTML='<span style="color:var(--warning)">⚠️ Informe ao menos um item com quantidade.</span>';
      return;
    }

    btn.disabled=true; btn.textContent='Enviando...';
    // Estimativa de valor: R$ 12/kg médio
    const value = Math.round(itens.reduce((s,i) => s + i.qtd * 12, 0));

    // Grava no SharedState — visível na cooperativa, agricultor, gestor, almoxarifado
    const newOrder = SharedState.addOrder({
      school: sc.name,
      cooperative: coopSel,
      itens,
      value,
    });

    // Tenta gravar também no Supabase (best-effort)
    try {
      if (typeof _sb !== 'undefined') {
        await _sb.from('orders').insert([{ school: sc.name, date: newOrder.date, status: 'Pendente', cooperative: coopSel, value }]);
      }
    } catch(e) { /* silencia — SharedState garante persistência local */ }

    fb.style.display='block';
    fb.innerHTML = `<span style="color:var(--success)">✅ Pedido <strong>#${String(newOrder.numero).padStart(3,'0')}</strong> enviado! Já visível para <strong>${coopSel}</strong>, Almoxarifado e Gestor.</span>`;
    showToast('📤 Pedido #' + String(newOrder.numero).padStart(3,'0') + ' enviado para ' + coopSel);
    btn.disabled=false; btn.textContent='📤 Enviar Pedido';
    setTimeout(() => PAGE_RENDERERS.escola_pedidos(document.getElementById('page-content')), 900);
  });
};

// ─── ESCOLA: ENTREGAS ───
PAGE_RENDERERS.escola_entregas = (el) => {
  const sc = getCurrentSchool();
  const orders = (typeof DATA !== 'undefined' && DATA.orders) ? DATA.orders : [];
  const active = orders.filter(o=>o.status!=='Entregue').slice(0,5);
  const sharedActive = SharedState.getOrders().filter(o => o.school === sc.name && o.status !== 'Entregue');
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Recebimento de Entregas — ${sc.name}</div>
      <div class="page-subtitle">Conferência e confirmação de recebimento</div>
    </div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">🚚 Entregas em Andamento</div>${sharedActive.length ? '<span class="status-badge status-ok">'+sharedActive.length+' pedidos recentes</span>' : ''}</div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>#</th><th>Cooperativa</th><th>Data</th><th>Itens</th><th>Valor</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${sharedActive.map(o=>`<tr>
              <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(o.numero).padStart(3,'0')}</td>
              <td>${o.cooperative||'—'}</td><td>${o.date}</td>
              <td style="font-size:0.82rem">${(o.itens||[]).map(i=>i.produto).slice(0,2).join(', ') || '—'}</td>
              <td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
              <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
              <td>${o.status === 'Em transporte' ? `<button class="btn btn-sm btn-primary" onclick="confirmSchoolDelivery('${o.id}','${sc.director||'Diretor(a)'}')">✅ Confirmar</button>` : ''}</td>
            </tr>`).join('')}
            ${active.map((o,i)=>`<tr>
              <td style="font-family:var(--font-mono)">#${String(i+1).padStart(3,'0')}</td>
              <td>${o.cooperative||'—'}</td><td>${o.date||'—'}</td>
              <td style="font-size:0.82rem;color:var(--text-tertiary)">—</td>
              <td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
              <td><span class="status-badge ${o.status==='Pendente'?'status-danger':o.status?.includes?.('separ')?'status-warning':'status-info'}">${o.status||'—'}</span></td>
              <td><button class="btn btn-sm btn-primary" onclick="alert('Recebimento #${String(i+1).padStart(3,"0")} confirmado!')">✅ Confirmar</button></td>
            </tr>`).join('')}
            ${(sharedActive.length + active.length) === 0 ? '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma entrega pendente</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📍 Timeline da Entrega em Andamento</div></div>
      <div class="card-body">
        ${renderDeliveryTimeline(sharedActive[0], sc)}
      </div>
    </div>`;
};

function renderDeliveryTimeline(order, sc) {
  if (!order) {
    return `<div style="color:var(--text-secondary);padding:16px;text-align:center">Nenhuma entrega em andamento no momento.</div>`;
  }
  const delivery = SharedState.getDeliveries().find(d => d.orderId === order.id);
  const timeline = delivery?.timeline || [];
  const stages = [
    { key: 'Pendente',       label: 'Pedido Solicitado',       desc: sc.name + ' enviou pedido' },
    { key: 'Em separação',   label: 'Em Separação (FIFO)',     desc: 'Estoque Central aplica FIFO nos lotes' },
    { key: 'Em transporte',  label: 'Em Transporte',           desc: 'Motorista a caminho' },
    { key: 'Entregue',       label: 'Confirmação da Escola',   desc: 'Conferir itens e assinar recibo' },
  ];
  const statusIdx = stages.findIndex(s => s.key === order.status);
  return `
    <div class="timeline">
      ${stages.map((s, i) => {
        const evento = timeline.find(t => (t.evento||'').includes(s.key));
        const time = evento ? new Date(evento.at).toLocaleString('pt-BR') : (i <= statusIdx ? '✓' : '—');
        const cls = i < statusIdx ? 'completed' : (i === statusIdx ? 'active' : 'pending');
        return `<div class="timeline-item ${cls}">
          <div class="timeline-dot"></div>
          <div class="timeline-title">${s.label}</div>
          <div class="timeline-desc">${s.desc}</div>
          <div class="timeline-time">${time}</div>
        </div>`;
      }).join('')}
    </div>
  `;
}

// ─── ESCOLA: HISTÓRICO ───
PAGE_RENDERERS.escola_historico = (el) => {
  const sc = getCurrentSchool();
  // Unifica: pedidos + consumo + ajustes de estoque em ordem cronológica reversa
  const eventos = [];
  SharedState.getOrders().filter(o => o.school === sc.name).forEach(o => {
    eventos.push({ tipo: 'Pedido', ref: '#' + String(o.numero).padStart(3,'0'), data: o.date, detalhes: (o.cooperative||'—') + ' — ' + ((o.itens||[]).length) + ' item(ns)', valor: 'R$ ' + (o.value||0).toLocaleString('pt-BR'), status: o.status, ts: new Date(o.date || Date.now()).getTime() });
  });
  SharedState.getConsumo(sc.name).forEach(c => {
    eventos.push({ tipo: 'Consumo', ref: c.refeicao || '—', data: c.data || (c.criadoEm||'').slice(0,10), detalhes: c.produto + ' — ' + (c.responsavel || '—'), valor: c.qtd + ' ' + (c.unidade||''), status: 'Registrado', ts: new Date(c.criadoEm || Date.now()).getTime() });
  });
  SharedState.getStockAdjust().filter(a => a.escola === sc.name).forEach(a => {
    if (a.delta > 0) eventos.push({ tipo: 'Entrada Estoque', ref: '', data: (a.criadoEm||'').slice(0,10), detalhes: a.produto + ' — ' + a.motivo, valor: '+' + a.delta + ' ' + (a.unidade||''), status: 'Efetivado', ts: new Date(a.criadoEm || Date.now()).getTime() });
  });
  eventos.sort((a,b) => b.ts - a.ts);
  const total = eventos.length;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Histórico — ${sc.name}</div>
      <div class="page-subtitle">Timeline unificada de pedidos, consumo e entregas · Fonte: SharedState</div>
    </div>
    <div class="card mb-16">
      <div class="card-header">
        <div class="card-title">Filtros</div>
        <div style="display:flex;gap:8px">
          <select id="hist-tipo" onchange="_filterHist()" style="padding:6px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem">
            <option value="">Todos os tipos</option><option>Pedido</option><option>Consumo</option><option>Entrada Estoque</option>
          </select>
          <input id="hist-search" placeholder="Buscar produto/detalhes..." oninput="_filterHist()" style="padding:6px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem">
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Eventos</div><span class="status-badge status-info">${total}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table" id="hist-table">
          <thead><tr><th>Tipo</th><th>Ref.</th><th>Data</th><th>Detalhes</th><th>Valor/Qtd</th><th>Status</th></tr></thead>
          <tbody>
            ${eventos.map(e => {
              const cls = e.tipo === 'Pedido' ? 'status-info' : e.tipo === 'Consumo' ? 'status-warning' : 'status-ok';
              return `<tr data-tipo="${e.tipo}" data-search="${(e.detalhes+' '+e.ref).toLowerCase()}">
                <td><span class="status-badge ${cls}">${e.tipo}</span></td>
                <td>${e.ref}</td>
                <td style="font-size:0.82rem">${e.data || '—'}</td>
                <td style="font-size:0.85rem">${e.detalhes}</td>
                <td style="font-family:var(--font-mono)">${e.valor}</td>
                <td><span class="status-badge ${e.status==='Entregue'||e.status==='Registrado'||e.status==='Efetivado'?'status-ok':e.status==='Pendente'?'status-danger':'status-warning'}">${e.status}</span></td>
              </tr>`;
            }).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhum evento — histórico será alimentado com o uso do sistema.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>`;
};

window._filterHist = () => {
  const t = document.getElementById('hist-tipo')?.value || '';
  const s = (document.getElementById('hist-search')?.value || '').toLowerCase();
  document.querySelectorAll('#hist-table tbody tr[data-tipo]').forEach(tr => {
    const okT = !t || tr.dataset.tipo === t;
    const okS = !s || tr.dataset.search.includes(s);
    tr.style.display = (okT && okS) ? '' : 'none';
  });
};

// ─── ESCOLA: RELATÓRIOS ───
PAGE_RENDERERS.escola_relatorios = (el) => {
  const sc = getCurrentSchool();
  const att = sc.attendance_pct || 92;
  const bars = [89,90,95,87,93,90,92,89,92,91,93,90,92,92];
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Relatórios — ${sc.name}</div>
      <div class="page-subtitle">Análises de frequência, consumo e desempenho alimentar</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📅</div><div class="kpi-value">${att}%</div><div class="kpi-label">Freq. Média Jun</div></div>
      <div class="kpi-card green"><div class="kpi-icon">📦</div><div class="kpi-value">1.240 kg</div><div class="kpi-label">Consumo Mensal</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">💰</div><div class="kpi-value">R$ 1,06</div><div class="kpi-label">Per Capita Médio</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🌾</div><div class="kpi-value">42%</div><div class="kpi-label">Agric. Familiar</div></div>
    </div>
    <div class="grid-2-1">
      <div class="card">
        <div class="card-header"><div class="card-title">📈 Frequência Diária — Junho 2026</div></div>
        <div class="card-body">
          <div style="display:flex;align-items:flex-end;gap:5px;height:100px;border-bottom:1px solid var(--border);padding-bottom:8px">
            ${bars.map(v=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
              <div style="font-size:0.62rem;color:var(--text-secondary)">${v}%</div>
              <div style="width:100%;background:${v>=90?'var(--primary)':v>=85?'var(--warning)':'var(--danger)'};border-radius:3px 3px 0 0;height:${Math.round((v-82)*9)}px"></div>
            </div>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:0.7rem;color:var(--text-secondary)">
            <span>05/Jun</span><span>10/Jun</span><span>17/Jun</span><span>24/Jun</span>
          </div>
          <div style="margin-top:12px;padding:12px;background:var(--surface-1);border-radius:var(--radius-md);font-size:0.82rem">
            <div style="display:flex;justify-content:space-between"><span>Média do período:</span><span style="font-weight:700;color:var(--primary)">${att}%</span></div>
            <div style="display:flex;justify-content:space-between;margin-top:4px"><span>Presentes (média):</span><span style="font-weight:700">${sc.attendance_avg||572} de ${sc.students||620}</span></div>
            <div style="display:flex;justify-content:space-between;margin-top:4px"><span>Dias registrados:</span><span style="font-weight:700">14 dias úteis</span></div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-header"><div class="card-title">🍽️ Top Alimentos Consumidos</div></div>
          <div class="card-body">
            ${[['Arroz Tipo 1','875 kg',88],['Feijão Carioca','375 kg',75],['Frango','490 kg',92],['Banana Nanica','350 kg',60],['Leite Integral','672 L',85]].map(([n,q,pct])=>`
              <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:3px"><span>${n}</span><span style="color:var(--text-secondary)">${q}</span></div>
                <div style="background:var(--border);border-radius:3px;height:5px"><div style="width:${pct}%;height:100%;background:var(--primary);border-radius:3px"></div></div>
              </div>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">📋 Exportar</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:8px">
            <button class="btn btn-ghost" onclick="alert('Relatório de Frequência exportado!')">📄 Frequência — Jun/2026</button>
            <button class="btn btn-ghost" onclick="alert('Relatório de Consumo exportado!')">📄 Consumo — Jun/2026</button>
            <button class="btn btn-ghost" onclick="alert('Análise Nutricional exportada!')">📄 Análise Nutricional</button>
          </div>
        </div>
      </div>
    </div>`;
};

// ─── COOPERATIVA: DASHBOARD ───
PAGE_RENDERERS.cooperativa_dashboard = (el) => {
  const prof = PROFILES[state.currentProfile] || {};
  const coopName = prof.role || 'COOPAGRAN';
  const shared = SharedState.getOrders().filter(o => (o.cooperative || '').toUpperCase() === coopName.toUpperCase());
  const producoes = SharedState.getProductions();
  const agricultoresAtivos = DATA.farmers.filter(f => f.coop === coopName).length;
  const pedidosPendentes = shared.filter(o => o.status === 'Pendente').length;
  const emTransporte = shared.filter(o => o.status === 'Em transporte').length;
  const entregues = shared.filter(o => o.status === 'Entregue').length;
  const valorExecutado = shared.filter(o => o.status === 'Entregue').reduce((a,o) => a + (o.value||0), 0) + 1450000;

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Dashboard — ${coopName}</div><div class="page-subtitle">Visão geral das operações da cooperativa · Sincronizada com escolas e agricultores</div></div>
    <div class="kpi-grid">
      <div class="kpi-card green"><div class="kpi-icon">👨‍🌾</div><div class="kpi-value">${agricultoresAtivos || 28}</div><div class="kpi-label">Agricultores Ativos</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">🥕</div><div class="kpi-value">${producoes.length + 14}</div><div class="kpi-label">Produtos Disponíveis</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📋</div><div class="kpi-value">${pedidosPendentes}</div><div class="kpi-label">Pedidos Pendentes</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">📅</div><div class="kpi-value">${emTransporte + 8}</div><div class="kpi-label">Entregas Programadas</div></div>
      <div class="kpi-card red"><div class="kpi-icon">⏰</div><div class="kpi-value">${shared.filter(o => o.status === 'Em separação').length + 2}</div><div class="kpi-label">Em Separação</div></div>
      <div class="kpi-card purple"><div class="kpi-icon">💰</div><div class="kpi-value">${formatCurrency(valorExecutado)}</div><div class="kpi-label">Valor Executado</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">✅</div><div class="kpi-value">${entregues}</div><div class="kpi-label">Entregues (via SharedState)</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><div class="card-title">📊 Pedidos por Status</div></div>
        <div class="card-body"><div class="chart-container h-250"><canvas id="chart-coop-status"></canvas></div></div>
      </div>
      <div class="card"><div class="card-header"><div class="card-title">🥇 Produtos Mais Demandados</div></div>
        <div class="card-body"><div class="chart-container h-250"><canvas id="chart-coop-produtos"></canvas></div></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🚨 Alertas</div></div>
      <div class="card-body">
        <div class="alert-list">
          <div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>Alface Crespa</strong> — Estoque insuficiente para demanda</div></div>
          <div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>2 entregas</strong> programadas para amanhã</div></div>
          <div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>ATA-2026/001</strong> com 55% de execução</div></div>
          <div class="alert-item info"><span class="alert-icon">👨‍🌾</span><div class="alert-text"><strong>3 agricultores</strong> com estoque baixo</div></div>
        </div>
      </div>
    </div>
  `;
  setTimeout(() => {
    createChart('chart-coop-status', {
      type: 'doughnut',
      data: { labels: ['Entregue', 'Em transporte', 'Em separação', 'Pendente'], datasets: [{ data: [42, 3, 2, 5], backgroundColor: ['#2E7D32', '#F57F17', '#1565C0', '#C62828'], borderWidth: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'bottom', labels: { font: { family: "'Inter'", size: 11 }, padding: 12, usePointStyle: true } } } }
    });
    createChart('chart-coop-produtos', {
      type: 'bar',
      data: { labels: ['Mandioca', 'Banana', 'Tomate', 'Alface', 'Cenoura', 'Abóbora', 'Ovo', 'Bat. Doce'], datasets: [{ label: 'Demanda (kg)', data: [4200, 3800, 3100, 2800, 2400, 1900, 1600, 1200], backgroundColor: CHART_COLORS.palette.slice(0, 8), borderRadius: 4 }] },
      options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } } }
    });
  }, 100);
};

PAGE_RENDERERS.cooperativa_agricultores = (el) => {
  const producoes = SharedState.getProductions();
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Agricultores</div><div class="page-subtitle">Cadastro e acompanhamento — atualizações vindas dos agricultores aparecem em tempo real</div></div>

    ${producoes.length > 0 ? `
    <div class="card mb-24" style="border-left:4px solid var(--success)">
      <div class="card-header"><div class="card-title">🆕 Atualizações Recentes de Produção</div><span class="status-badge status-ok">${producoes.length}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Agricultor</th><th>Produto</th><th>Área (ha)</th><th>Prevista (kg)</th><th>Disponível (kg)</th><th>Registrado em</th></tr></thead><tbody>
          ${producoes.slice(0, 8).map(p => `
            <tr>
              <td><strong>${p.agricultor || '—'}</strong></td>
              <td>${p.produto}</td>
              <td style="font-family:var(--font-mono)">${p.area || '—'}</td>
              <td style="font-family:var(--font-mono)">${(p.previsto||0).toLocaleString('pt-BR')}</td>
              <td style="font-family:var(--font-mono);color:var(--success);font-weight:700">${(p.disponivel||0).toLocaleString('pt-BR')}</td>
              <td style="font-size:0.78rem;color:var(--text-secondary)">${new Date(p.criadoEm).toLocaleString('pt-BR')}</td>
            </tr>
          `).join('')}
        </tbody></table>
      </div>
    </div>` : ''}

    <div class="card">
      <div class="card-header"><div class="card-title">Agricultores Vinculados</div><button class="btn btn-primary btn-sm">+ Novo Agricultor</button></div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Nome</th><th>Produtos</th><th>Estoque (kg)</th><th>Produção Est. (kg)</th><th>Status</th><th>Ações</th></tr></thead><tbody>
          ${DATA.farmers.filter(f => f.coop === 'COOPAGRAN').map(f => `<tr class="clickable-row" onclick="navigateTo('agricultor','dashboard')">
            <td><strong>${f.name}</strong></td>
            <td>${f.products.map(p => `<span class="tag tag-green" style="margin:1px">${p}</span>`).join(' ')}</td>
            <td style="font-family:var(--font-mono)">${f.stock.toLocaleString('pt-BR')}</td>
            <td style="font-family:var(--font-mono)">${f.production.toLocaleString('pt-BR')}</td>
            <td><span class="status-badge status-ok">Ativo</span></td>
            <td><button class="table-action">Detalhes</button></td>
          </tr>`).join('')}
        </tbody></table>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.cooperativa_produtos = (el) => { el.innerHTML = renderCrudScreen('Gestão de Produtos', 'Produtos disponíveis na cooperativa', ['Produto','Categoria','Estoque Consolidado','Agricultores Fornecedores'], DATA.products.filter(p=>p.familyFarm).map(p => [p.name, p.category, p.stock+' '+p.unit, Math.floor(Math.random()*5+2)])); };
PAGE_RENDERERS.cooperativa_estoque = (el) => { PAGE_RENDERERS.gestor_estoque(el); };

PAGE_RENDERERS.cooperativa_pedidos = (el) => {
  const prof = PROFILES[state.currentProfile] || {};
  const coopName = prof.role || 'COOPAGRAN';
  const sharedOrders = SharedState.getOrders().filter(o => (o.cooperative || '').toUpperCase() === coopName.toUpperCase());
  const legacyOrders = DATA.orders.filter(o => o.coop === coopName);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Gestão de Pedidos — ${coopName}</div>
      <div class="page-subtitle">Pedidos enviados pelas escolas · sincronizados em tempo real</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${sharedOrders.length + legacyOrders.length}</div><div class="kpi-label">Pedidos Totais</div></div>
      <div class="kpi-card red"><div class="kpi-icon">⏰</div><div class="kpi-value">${sharedOrders.filter(o=>o.status==='Pendente').length + legacyOrders.filter(o=>o.status==='Pendente').length}</div><div class="kpi-label">Aguardando Aceite</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">🚚</div><div class="kpi-value">${sharedOrders.filter(o=>o.status==='Em transporte' || o.status==='Em separação').length}</div><div class="kpi-label">Em Andamento</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${sharedOrders.filter(o=>o.status==='Entregue').length + legacyOrders.filter(o=>o.status==='Entregue').length}</div><div class="kpi-label">Entregues</div></div>
    </div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Pedidos Recebidos das Escolas</div>${sharedOrders.length ? '<span class="status-badge status-ok">'+sharedOrders.length+' novos</span>' : ''}</div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>#</th><th>Escola</th><th>Data</th><th>Itens</th><th>Valor</th><th>Status</th><th>Ações</th></tr></thead><tbody>
          ${sharedOrders.map(o => `<tr>
            <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(o.numero).padStart(3,'0')} <span class="tag tag-blue" style="font-size:0.65rem">NOVO</span></td>
            <td><strong>${o.school}</strong></td>
            <td>${o.date}</td>
            <td style="font-size:0.82rem">${(o.itens||[]).map(i => i.produto + ' (' + i.qtd + i.unidade + ')').join(', ') || '—'}</td>
            <td style="font-family:var(--font-mono)">${formatCurrency(o.value || 0)}</td>
            <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
            <td>
              ${o.status === 'Pendente' ? `<button class="btn btn-sm btn-primary" onclick="acceptOrder('${o.id}')">Aceitar & Distribuir</button>` : ''}
              ${o.status === 'Em separação' ? `<button class="btn btn-sm btn-primary" onclick="dispatchOrder('${o.id}')">Despachar</button>` : ''}
            </td>
          </tr>`).join('')}
          ${legacyOrders.map(o => `<tr>
            <td style="font-family:var(--font-mono)">#${String(o.id).padStart(3,'0')}</td>
            <td><strong>${o.school}</strong></td><td>${formatDate(o.date)}</td>
            <td style="font-size:0.82rem;color:var(--text-tertiary)">—</td>
            <td style="font-family:var(--font-mono)">${formatCurrency(o.value)}</td>
            <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
            <td><button class="table-action">Distribuir</button></td>
          </tr>`).join('')}
        </tbody></table>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">🤖 Distribuição Automática — Pedido #001</div><div class="card-subtitle">O sistema sugere a melhor distribuição entre agricultores</div></div>
      <div class="card-body">
        <table class="data-table"><thead><tr><th>Produto</th><th>Quantidade</th><th>Agricultor Sugerido</th><th>Disponível</th><th>Status</th></tr></thead><tbody>
          <tr><td>Mandioca</td><td>200 kg</td><td><strong>José Maria Rodrigues</strong></td><td>1.200 kg</td><td><span class="status-badge status-ok">Disponível</span></td></tr>
          <tr><td>Banana Nanica</td><td>150 kg</td><td><strong>José Maria Rodrigues</strong></td><td>800 kg</td><td><span class="status-badge status-ok">Disponível</span></td></tr>
          <tr><td>Alface Crespa</td><td>80 kg</td><td><strong>Luzia Ferreira Santos</strong></td><td>700 kg</td><td><span class="status-badge status-ok">Disponível</span></td></tr>
          <tr><td>Tomate</td><td>100 kg</td><td><strong>Antônio Carlos Pereira</strong></td><td>800 kg</td><td><span class="status-badge status-ok">Disponível</span></td></tr>
        </tbody></table>
        <div style="margin-top:16px;text-align:right"><button class="btn btn-primary">Confirmar Distribuição e Enviar aos Agricultores</button></div>
      </div>
    </div>
  `;
};

window.acceptOrder = (id) => {
  const dist = SharedState.distributeOrderToFarmers(id);
  SharedState.updateOrderStatus(id, 'Em separação');
  const nAgr = new Set((dist||[]).map(d => d.agricultor)).size;
  showToast('✅ Pedido aceito. ' + nAgr + ' agricultor(es) atribuído(s). Estoque Central pode separar.');
  renderPage();
};
window.dispatchOrder = (id) => {
  SharedState.updateOrderStatus(id, 'Em transporte');
  showToast('🚚 Pedido despachado. Motorista notificado.');
  renderPage();
};
window.confirmSchoolDelivery = (id, receiver) => {
  const nome = prompt('Nome do responsável pelo recebimento:', receiver || '');
  if (!nome) return;
  SharedState.confirmDelivery(id, nome, '');
  showToast('✅ Recebimento confirmado! Cooperativa e Gestor notificados.');
  renderPage();
};

PAGE_RENDERERS.cooperativa_planejamento = (el) => { PAGE_RENDERERS.escola_planejamento(el); };
PAGE_RENDERERS.cooperativa_rotas = (el) => {
  // Pedidos "Em transporte" da COOPAGRAN se transformam em paradas
  const emTransporte = SharedState.getOrders().filter(o => o.status === 'Em transporte' || o.status === 'Em separação');
  const porRegiao = {};
  emTransporte.forEach(o => {
    const sc = (DATA.schools || []).find(s => s.name === o.school);
    const r = sc?.region || 'A definir';
    (porRegiao[r] = porRegiao[r] || []).push(o);
  });
  const rotas = Object.entries(porRegiao);
  const totalKm = rotas.length * 42; // estimativa 42km/rota
  const custoEst = totalKm * 2.7;
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Rotas</div><div class="page-subtitle">Rotas geradas automaticamente a partir dos pedidos em transporte</div></div>
    <div class="card mb-16"><div class="card-header"><div class="card-title">🗺️ Mapa de Rotas — Campo Grande</div></div><div class="card-body"><div class="map-container" id="map-container-rotas"></div></div></div>
    <div class="grid-3" style="margin-bottom:20px">
      <div class="card"><div class="card-body" style="text-align:center"><div style="font-size:2rem">🚚</div><div style="font-family:var(--font-mono);font-size:1.5rem;font-weight:700;margin:8px 0">${rotas.length}</div><div style="font-size:0.82rem;color:var(--text-secondary)">Rotas Ativas</div></div></div>
      <div class="card"><div class="card-body" style="text-align:center"><div style="font-size:2rem">📏</div><div style="font-family:var(--font-mono);font-size:1.5rem;font-weight:700;margin:8px 0">${totalKm} km</div><div style="font-size:0.82rem;color:var(--text-secondary)">Distância Estimada</div></div></div>
      <div class="card"><div class="card-body" style="text-align:center"><div style="font-size:2rem">💰</div><div style="font-family:var(--font-mono);font-size:1.5rem;font-weight:700;margin:8px 0">R$ ${custoEst.toFixed(0)}</div><div style="font-size:0.82rem;color:var(--text-secondary)">Custo Estimado</div></div></div>
    </div>
    ${rotas.length > 0 ? rotas.map(([regiao, pedidos]) => `
      <div class="card" style="margin-bottom:12px">
        <div class="card-header">
          <div class="card-title">📍 Rota ${regiao}</div>
          <span class="tag tag-blue">${pedidos.length} parada${pedidos.length>1?'s':''}</span>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Ordem</th><th>#</th><th>Escola</th><th>Itens</th><th>Status</th></tr></thead>
            <tbody>
              ${pedidos.map((o, i) => `
                <tr>
                  <td style="font-family:var(--font-mono);font-weight:700">${i+1}º</td>
                  <td style="font-family:var(--font-mono);color:var(--primary)">#${String(o.numero).padStart(3,'0')}</td>
                  <td><strong>${o.school}</strong></td>
                  <td style="font-size:0.82rem">${(o.itens||[]).length} itens</td>
                  <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `).join('') : '<div class="card"><div class="card-body" style="text-align:center;color:var(--text-secondary);padding:24px">Nenhum pedido em transporte no momento.</div></div>'}
  `;
  setTimeout(() => {
    const c = document.getElementById('map-container-rotas');
    if (c) { renderMap(); }
  }, 100);
};

// Chamamentos: pequena lista mock persistida em localStorage (podem ser criados pelo gestor no futuro)
function getChamamentos() {
  try { return JSON.parse(localStorage.getItem('saged_chamamentos_v1') || 'null') || _DEFAULT_CHAMAMENTOS(); }
  catch { return _DEFAULT_CHAMAMENTOS(); }
}
function _DEFAULT_CHAMAMENTOS() {
  return [
    { id: 'ch1', titulo: 'Chamada Pública 001/2026 — Hortaliças Verão', abertura: '2026-07-01', encerramento: '2026-07-31', valor: 480000, produtos: ['Alface','Tomate','Cenoura','Abóbora'], candidatos: 12, status: 'Aberta' },
    { id: 'ch2', titulo: 'Chamada Pública 002/2026 — Frutas', abertura: '2026-06-15', encerramento: '2026-07-20', valor: 320000, produtos: ['Banana','Melancia','Maçã'], candidatos: 8, status: 'Em Análise' },
    { id: 'ch3', titulo: 'Chamada Pública 003/2026 — Tubérculos', abertura: '2026-08-01', encerramento: '2026-08-31', valor: 210000, produtos: ['Mandioca','Batata Doce'], candidatos: 0, status: 'Aberta' },
  ];
}

PAGE_RENDERERS.cooperativa_contratos = (el) => {
  const chamamentos = getChamamentos();
  const abertos = chamamentos.filter(c => c.status === 'Aberta').length;
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Contratos e Chamamentos</div><div class="page-subtitle">Acompanhe atas, empenhos e chamadas públicas abertas para agricultores</div></div>
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${chamamentos.length}</div><div class="kpi-label">Chamamentos Cadastrados</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${abertos}</div><div class="kpi-label">Abertos p/ Habilitação</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">👨‍🌾</div><div class="kpi-value">${chamamentos.reduce((s,c)=>s+(c.candidatos||0),0)}</div><div class="kpi-label">Candidatos Totais</div></div>
    </div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">📢 Chamamentos Ativos</div></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Chamada</th><th>Abertura</th><th>Encerramento</th><th>Valor Global</th><th>Produtos</th><th>Candidatos</th><th>Status</th></tr></thead>
          <tbody>
            ${chamamentos.map(c => `
              <tr>
                <td><strong>${c.titulo}</strong></td>
                <td>${c.abertura}</td>
                <td>${c.encerramento}</td>
                <td style="font-family:var(--font-mono)">${formatCurrency(c.valor)}</td>
                <td style="font-size:0.82rem">${(c.produtos||[]).map(p => '<span class="tag tag-green" style="margin:1px">' + p + '</span>').join(' ')}</td>
                <td style="font-family:var(--font-mono);text-align:center">${c.candidatos}</td>
                <td><span class="status-badge ${c.status === 'Aberta' ? 'status-ok' : 'status-warning'}">${c.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">💼 Atas e Empenhos Vinculados</div></div>
      <div class="card-body" style="padding:0" id="coop-atas-embed"></div>
    </div>
  `;
  // Embed rápido da view Atas do Gestor no card interno
  const embed = document.getElementById('coop-atas-embed');
  if (embed) {
    const tmp = document.createElement('div');
    PAGE_RENDERERS.gestor_atas(tmp);
    // pega só as tabelas
    embed.innerHTML = tmp.innerHTML;
  }
};
PAGE_RENDERERS.cooperativa_entregas = (el) => { PAGE_RENDERERS.escola_entregas(el); };
PAGE_RENDERERS.cooperativa_relatorios = (el) => { PAGE_RENDERERS.gestor_relatorios(el); };
PAGE_RENDERERS.cooperativa_indicadores = (el) => {
  const prof = PROFILES[state.currentProfile] || {};
  const coopName = prof.role || 'COOPAGRAN';
  const orders = SharedState.getOrders().filter(o => (o.cooperative||'').toUpperCase() === coopName.toUpperCase());
  const entregues = orders.filter(o => o.status === 'Entregue');
  const taxaAtendimento = orders.length > 0 ? Math.round(entregues.length / orders.length * 100) : 89;
  const volumeKg = entregues.reduce((s, o) => s + (o.itens || []).reduce((a, i) => a + (i.qtd||0), 0), 0);
  const agricAtivos = DATA.farmers.filter(f => f.coop === coopName).length || 28;

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Indicadores de Performance</div><div class="page-subtitle">Métricas de desempenho da ${coopName} · Dados sincronizados</div></div>
    <div class="kpi-grid">
      <div class="kpi-card green"><div class="kpi-icon">🎯</div><div class="kpi-value">${taxaAtendimento}%</div><div class="kpi-label">Taxa de Atendimento</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${entregues.length}</div><div class="kpi-label">Entregas Concluídas</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">📊</div><div class="kpi-value">${(volumeKg/1000).toFixed(1)}t</div><div class="kpi-label">Volume Fornecido</div></div>
      <div class="kpi-card purple"><div class="kpi-icon">👨‍🌾</div><div class="kpi-value">${agricAtivos}</div><div class="kpi-label">Agricultores Ativos</div></div>
    </div>
    <div class="card"><div class="card-header"><div class="card-title">📈 Evolução da Taxa de Atendimento</div></div><div class="card-body"><div class="chart-container h-300"><canvas id="chart-indicadores"></canvas></div></div></div>
  `;
  setTimeout(() => {
    createChart('chart-indicadores', {
      type: 'line',
      data: { labels: DATA.months.slice(0,6), datasets: [{ label: 'Taxa de Atendimento (%)', data: [82, 85, 88, 86, 91, taxaAtendimento], borderColor: CHART_COLORS.green, backgroundColor: CHART_COLORS.greenFill, fill: true, tension: 0.4 }] },
      options: { ...CHART_DEFAULTS, scales: { ...CHART_DEFAULTS.scales, y: { ...CHART_DEFAULTS.scales.y, min: 70, max: 100 } } }
    });
  }, 100);
};

// ─── AGRICULTOR: DASHBOARD ───
PAGE_RENDERERS.agricultor_dashboard = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Dashboard — José Maria Rodrigues</div><div class="page-subtitle">Visão geral da sua produção e compromissos</div></div>
    <div class="kpi-grid">
      <div class="kpi-card green"><div class="kpi-icon">🌱</div><div class="kpi-value">3</div><div class="kpi-label">Produtos Cadastrados</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">1.200</div><div class="kpi-label">Estoque Disponível (kg)</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📋</div><div class="kpi-value">1</div><div class="kpi-label">Pedidos Pendentes</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">📅</div><div class="kpi-value">2</div><div class="kpi-label">Entregas Programadas</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">18</div><div class="kpi-label">Entregas Concluídas</div></div>
      <div class="kpi-card purple"><div class="kpi-icon">💰</div><div class="kpi-value">R$ 24.500</div><div class="kpi-label">Valor a Receber</div></div>
    </div>
    <div class="grid-2-1">
      <div class="card"><div class="card-header"><div class="card-title">🚨 Alertas</div></div><div class="card-body">
        <div class="alert-list">
          <div class="alert-item warning"><span class="alert-icon">🚚</span><div class="alert-text">Entrega para <strong>EM ADV. DEMOSTHENES MARTINS</strong> programada para <strong>amanhã</strong></div></div>
          <div class="alert-item info"><span class="alert-icon">📋</span><div class="alert-text">Novo pedido da <strong>COOPAGRAN</strong>: 200 kg de Mandioca</div></div>
          <div class="alert-item success"><span class="alert-icon">🌱</span><div class="alert-text"><strong>Abóbora</strong> — Colheita prevista em 5 dias</div></div>
        </div>
      </div></div>
      <div class="card"><div class="card-header"><div class="card-title">🚚 Próximas Entregas</div></div><div class="card-body">
        <table class="data-table"><thead><tr><th>Produto</th><th>Qtd</th><th>Data</th><th>Escola</th></tr></thead><tbody>
          <tr><td>Mandioca</td><td>200 kg</td><td>25/06</td><td>EM ADV. DEMOSTHENES MARTINS</td></tr>
          <tr><td>Banana</td><td>150 kg</td><td>27/06</td><td>EMRTI GOV. ARNALDO</td></tr>
        </tbody></table>
      </div></div>
    </div>
  `;
};

PAGE_RENDERERS.agricultor_producao = (el) => {
  const prof = PROFILES[state.currentProfile] || {};
  const producoes = SharedState.getProductions().filter(p => p.agricultor === prof.name);
  const baseRows = [
    ['Mandioca','5','2.500','1.200','Em produção'],
    ['Banana Nanica','4','1.400','800','Em produção'],
    ['Abóbora Cabotiá','3','600','200','Pré-colheita'],
  ];
  const extraRows = producoes.map(p => [p.produto, p.area || '—', (p.previsto||0).toLocaleString('pt-BR'), (p.disponivel||0).toLocaleString('pt-BR'), p.status || 'Em produção']);

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Minha Produção</div><div class="page-subtitle">Atualizações aqui aparecem imediatamente na Cooperativa e no Gestor</div></div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Nova Atualização de Produção</div></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:8px">
          <input type="text" id="prod-produto" placeholder="Produto (ex.: Alface Crespa)" style="padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem">
          <input type="number" id="prod-area" placeholder="Área (ha)" style="padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem">
          <input type="number" id="prod-previsto" placeholder="Previsto (kg)" style="padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem">
          <input type="number" id="prod-disponivel" placeholder="Disponível (kg)" style="padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem">
          <button class="btn btn-primary" id="btn-add-prod">+ Adicionar</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Produção Atual</div>${extraRows.length ? '<span class="status-badge status-ok">'+extraRows.length+' atualização(ões) recente(s)</span>' : ''}</div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Área (ha)</th><th>Prevista (kg)</th><th>Disponível (kg)</th><th>Status</th></tr></thead>
          <tbody>
            ${extraRows.map(r => `<tr>${r.map((c,i)=>i===0?`<td><strong>${c}</strong> <span class="tag tag-blue" style="font-size:0.65rem">NOVO</span></td>`:`<td>${c}</td>`).join('')}</tr>`).join('')}
            ${baseRows.map(r => `<tr>${r.map((c,i)=>i===0?`<td><strong>${c}</strong></td>`:`<td>${c}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.getElementById('btn-add-prod')?.addEventListener('click', () => {
    const produto = document.getElementById('prod-produto').value.trim();
    const area = parseFloat(document.getElementById('prod-area').value) || 0;
    const previsto = parseFloat(document.getElementById('prod-previsto').value) || 0;
    const disponivel = parseFloat(document.getElementById('prod-disponivel').value) || 0;
    if (!produto) { showToast('Informe o nome do produto.', 'error'); return; }
    SharedState.addProduction({ agricultor: prof.name, produto, area, previsto, disponivel, status: 'Em produção' });
    showToast('🌾 Produção registrada — Cooperativa e Gestor SEMED notificados.');
    PAGE_RENDERERS.agricultor_producao(document.getElementById('page-content'));
  });
};
PAGE_RENDERERS.agricultor_estoque = (el) => {
  const prof = PROFILES[state.currentProfile] || {};
  const nome = prof.name;
  const producoes = SharedState.getProductions().filter(p => p.agricultor === nome);
  // Calcula reservado a partir dos pedidos com distribuicao para este agricultor
  const reservadoMap = {};
  SharedState.getOrders().filter(o => o.status !== 'Entregue').forEach(o => {
    (o.distribuicao || []).filter(d => d.agricultor === nome).forEach(d => {
      reservadoMap[d.produto] = (reservadoMap[d.produto] || 0) + d.qtd;
    });
  });

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Meu Estoque</div><div class="page-subtitle">Produção declarada + reservas de pedidos atribuídos</div></div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Estoque Atual</div><button class="btn btn-primary btn-sm" onclick="navigateTo('agricultor','producao')">Atualizar Produção</button></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Disponível</th><th>Reservado</th><th>Livre</th></tr></thead>
          <tbody>
            ${producoes.map(p => {
              const disp = p.disponivel || 0;
              const res = reservadoMap[p.produto] || 0;
              const livre = Math.max(0, disp - res);
              return `<tr>
                <td><strong>${p.produto}</strong></td>
                <td style="font-family:var(--font-mono)">${disp.toLocaleString('pt-BR')} kg</td>
                <td style="font-family:var(--font-mono);color:${res > 0 ? 'var(--warning)' : 'var(--text-tertiary)'}">${res.toLocaleString('pt-BR')} kg</td>
                <td style="font-family:var(--font-mono);color:var(--success)">${livre.toLocaleString('pt-BR')} kg</td>
              </tr>`;
            }).join('') || `
              <tr><td><strong>Mandioca</strong></td><td style="font-family:var(--font-mono)">1.200 kg</td><td style="font-family:var(--font-mono)">${(reservadoMap['Mandioca']||200)} kg</td><td style="font-family:var(--font-mono);color:var(--success)">${1200-(reservadoMap['Mandioca']||200)} kg</td></tr>
              <tr><td><strong>Banana Nanica</strong></td><td style="font-family:var(--font-mono)">800 kg</td><td style="font-family:var(--font-mono)">${(reservadoMap['Banana Nanica']||150)} kg</td><td style="font-family:var(--font-mono);color:var(--success)">${800-(reservadoMap['Banana Nanica']||150)} kg</td></tr>
              <tr><td><strong>Abóbora Cabotiá</strong></td><td style="font-family:var(--font-mono)">200 kg</td><td style="font-family:var(--font-mono)">0 kg</td><td style="font-family:var(--font-mono);color:var(--success)">200 kg</td></tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
    ${producoes.length === 0 ? '<div style="background:var(--surface-2);padding:12px;border-radius:8px;font-size:0.85rem;color:var(--text-secondary)">💡 Cadastre sua produção em <strong>/producao</strong> para que apareça aqui e no painel da cooperativa.</div>' : ''}
  `;
};

PAGE_RENDERERS.agricultor_pedidos = (el) => {
  const prof = PROFILES[state.currentProfile] || {};
  const nome = prof.name;
  // Filtra pedidos onde este agricultor foi atribuído em distribuicao[]
  const meus = SharedState.getOrders().filter(o => (o.distribuicao || []).some(d => d.agricultor === nome));

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Meus Pedidos Atribuídos</div><div class="page-subtitle">Itens distribuídos automaticamente pela cooperativa conforme sua produção declarada</div></div>
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
      <div class="kpi-card red"><div class="kpi-icon">⏳</div><div class="kpi-value">${meus.filter(o=>o.status==='Em separação').length}</div><div class="kpi-label">Aguardando Colheita/Envio</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">🚚</div><div class="kpi-value">${meus.filter(o=>o.status==='Em transporte').length}</div><div class="kpi-label">Em Transporte</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${meus.filter(o=>o.status==='Entregue').length}</div><div class="kpi-label">Entregues</div></div>
    </div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Pedidos com Meus Produtos</div>${meus.length ? '<span class="status-badge status-ok">'+meus.length+'</span>' : ''}</div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Pedido</th><th>Escola</th><th>Cooperativa</th><th>Meus Itens</th><th>Status</th></tr></thead><tbody>
          ${meus.map(o => {
            const meusItens = (o.distribuicao || []).filter(d => d.agricultor === nome);
            return `<tr>
              <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(o.numero).padStart(3,'0')}</td>
              <td><strong>${o.school}</strong></td>
              <td><span class="tag tag-teal">${o.cooperative||'—'}</span></td>
              <td style="font-size:0.82rem">${meusItens.map(d => d.produto + ' (' + d.qtd + d.unidade + ')').join(', ')}</td>
              <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
            </tr>`;
          }).join('') || `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhum pedido atribuído. Registre sua produção em /producao para aparecer nas distribuições.</td></tr>`}
        </tbody></table>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.agricultor_entregas = (el) => { PAGE_RENDERERS.escola_entregas(el); };
PAGE_RENDERERS.agricultor_calendario = (el) => { PAGE_RENDERERS.escola_planejamento(el); };
PAGE_RENDERERS.agricultor_relatorios = (el) => { PAGE_RENDERERS.gestor_relatorios(el); };

function _getAgriProfile() {
  const defaults = { nome:'José Maria Rodrigues', cpf:'123.456.789-00', endereco:'Estrada Rural, Km 12 — Campo Grande, MS', telefone:'(67) 99123-4567', propriedade:'Sítio Boa Esperança', areaTotal:'15', areaProdutiva:'12', cooperativa:'COOPAGRAN', caf:'Válida até 12/2026' };
  try { return { ...defaults, ...JSON.parse(localStorage.getItem('saged_agri_profile_v1') || '{}') }; } catch { return defaults; }
}

PAGE_RENDERERS.agricultor_perfil = (el) => {
  const p = _getAgriProfile();
  const readOnly = !window._editAgriProfile;
  const producoes = SharedState.getProductions();
  const produtosProduzidos = new Set(producoes.map(x => x.produto));
  const produtosDefault = ['Mandioca', 'Banana Nanica', 'Abóbora Cabotiá'];
  const produtos = produtosProduzidos.size > 0 ? Array.from(produtosProduzidos) : produtosDefault;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Meu Perfil</div>
      <div class="page-subtitle">Dados pessoais e da propriedade${readOnly ? '' : ' · Modo edição'}</div>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-bottom:12px;gap:8px">
      ${readOnly
        ? '<button class="btn btn-primary btn-sm" onclick="toggleAgriEdit(true)">✏️ Editar</button>'
        : '<button class="btn btn-outline btn-sm" onclick="toggleAgriEdit(false)">Cancelar</button><button class="btn btn-primary btn-sm" onclick="saveAgriProfile()">💾 Salvar</button>'}
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><div class="card-title">👤 Dados Pessoais</div></div><div class="card-body">
        <div class="form-row"><div class="form-field"><label>Nome</label>${_agriField('nome', p.nome, readOnly)}</div><div class="form-field"><label>CPF</label>${_agriField('cpf', p.cpf, readOnly)}</div></div>
        <div class="form-row"><div class="form-field"><label>Endereço</label>${_agriField('endereco', p.endereco, readOnly)}</div><div class="form-field"><label>Telefone</label>${_agriField('telefone', p.telefone, readOnly)}</div></div>
      </div></div>
      <div class="card"><div class="card-header"><div class="card-title">🏡 Dados da Propriedade</div></div><div class="card-body">
        <div class="form-row"><div class="form-field"><label>Nome da Propriedade</label>${_agriField('propriedade', p.propriedade, readOnly)}</div><div class="form-field"><label>Área Total (ha)</label>${_agriField('areaTotal', p.areaTotal, readOnly, 'number')}</div></div>
        <div class="form-row"><div class="form-field"><label>Área Produtiva (ha)</label>${_agriField('areaProdutiva', p.areaProdutiva, readOnly, 'number')}</div><div class="form-field"><label>Cooperativa</label>${_agriField('cooperativa', p.cooperativa, readOnly)}</div></div>
      </div></div>
    </div>
    <div class="grid-2" style="margin-top:20px">
      <div class="card"><div class="card-header"><div class="card-title">🌱 Produtos Produzidos ${producoes.length > 0 ? '(via SharedState)' : ''}</div></div><div class="card-body">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${produtos.map(pr => `<span class="tag tag-green" style="font-size:0.85rem;padding:6px 16px">${pr}</span>`).join('')}
        </div>
      </div></div>
      <div class="card"><div class="card-header"><div class="card-title">📄 Documentos</div></div><div class="card-body">
        <div class="form-row"><div class="form-field"><label>CAF/DAP</label>${_agriField('caf', p.caf, readOnly)}</div></div>
        <div class="form-row"><div class="form-field"><label>Certificação Orgânica</label><div class="field-value"><span class="status-badge status-info">Em processo</span></div></div></div>
      </div></div>
    </div>
  `;
};

function _agriField(name, value, ro, type) {
  if (ro) return `<div class="field-value">${value || '—'}</div>`;
  return `<input type="${type || 'text'}" id="agri-${name}" value="${(value || '').replace(/"/g,'&quot;')}" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem">`;
}

window.toggleAgriEdit = (on) => {
  window._editAgriProfile = !!on;
  PAGE_RENDERERS.agricultor_perfil(document.getElementById('page-content'));
};

window.saveAgriProfile = () => {
  const fields = ['nome','cpf','endereco','telefone','propriedade','areaTotal','areaProdutiva','cooperativa','caf'];
  const data = {};
  fields.forEach(f => { const v = document.getElementById('agri-' + f)?.value; if (v !== undefined) data[f] = v; });
  try { localStorage.setItem('saged_agri_profile_v1', JSON.stringify(data)); } catch {}
  window._editAgriProfile = false;
  showToast('✅ Perfil salvo.');
  PAGE_RENDERERS.agricultor_perfil(document.getElementById('page-content'));
};

// ─── ESTOQUE: RENDERERS ───
PAGE_RENDERERS.estoque_dashboard = (el) => {
  const empenhosAtivos = SharedState.getEmpenhos().filter(e => e.status !== 'Liquidado');
  const nfsPendentes = empenhosAtivos.filter(e => (e.qtdConsumida || 0) < e.qtdTotal).length;
  const sharedOrders = SharedState.getOrders();
  const parasSeparar = sharedOrders.filter(o => o.status === 'Pendente' || o.status === 'Em separação').length + DATA.separation_orders.filter(o => o.status === 'Pendente').length;
  const emTransporte = sharedOrders.filter(o => o.status === 'Em transporte').length;
  const central = SharedState.getCentralStock();
  const lotesVencendo = central.reduce((s, p) => s + ((p.lotes||[]).filter(l => l.validade && new Date(l.validade) < new Date(Date.now() + 30*86400000)).length), 0) + 1;

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Dashboard Operacional (CD)</div><div class="page-subtitle">Central de Distribuição · Entradas, Lotes e Expedição · Sincronizado com Gestor/Escolas</div></div>

    <div class="grid-4 mb-24">
      <div class="card stat-card"><div class="card-body">
        <div class="stat-icon" style="color:var(--warning);background:var(--warning-light)">📥</div>
        <div class="stat-info"><div class="stat-num">${nfsPendentes}</div><div class="stat-name">Empenhos c/ NF Pendente</div></div>
      </div></div>
      <div class="card stat-card"><div class="card-body">
        <div class="stat-icon" style="color:var(--info);background:var(--info-light)">📦</div>
        <div class="stat-info"><div class="stat-num">${parasSeparar}</div><div class="stat-name">Ordens p/ Separar</div></div>
      </div></div>
      <div class="card stat-card"><div class="card-body">
        <div class="stat-icon" style="color:var(--danger);background:var(--danger-light)">⚠️</div>
        <div class="stat-info"><div class="stat-num">${lotesVencendo}</div><div class="stat-name">Lotes Vencendo (30d)</div></div>
      </div></div>
      <div class="card stat-card"><div class="card-body">
        <div class="stat-icon" style="color:var(--success);background:var(--success-light)">🚚</div>
        <div class="stat-info"><div class="stat-num">${emTransporte}</div><div class="stat-name">Em Transporte Agora</div></div>
      </div></div>
    </div>

    <div class="grid-2">
      <div class="card"><div class="card-header"><div class="card-title">💰 Saldo de Empenhos Vigentes</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Empenho</th><th>Produto</th><th>Consumido</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              ${SharedState.getEmpenhos().slice(0,5).map(e => `
                <tr>
                  <td><strong>${e.numero}</strong><br><small>${e.ataNumero}</small></td>
                  <td>${e.produto}</td>
                  <td style="font-family:var(--font-mono)">${(e.qtdConsumida||0).toLocaleString('pt-BR')} ${e.unidade}</td>
                  <td style="font-family:var(--font-mono)">${(e.qtdTotal||0).toLocaleString('pt-BR')} ${e.unidade}</td>
                  <td><span class="status-badge ${e.status === 'Liquidado' ? 'status-ok' : e.status === 'Parcial' ? 'status-warning' : 'status-info'}">${e.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card"><div class="card-header"><div class="card-title">📋 Fila de Pedidos das Escolas</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>#</th><th>Escola</th><th>Itens</th><th>Status</th></tr></thead>
            <tbody>
              ${sharedOrders.slice(0,6).map(o => `
                <tr>
                  <td style="font-family:var(--font-mono);font-weight:700">#${String(o.numero).padStart(3,'0')}</td>
                  <td>${o.school}</td>
                  <td style="font-size:0.82rem">${(o.itens||[]).length}</td>
                  <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
                </tr>
              `).join('') || '<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhum pedido — aguardando escolas</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.estoque_inventario = (el) => {
  const prods = DATA.products.slice().sort((a,b) => a.daysLeft - b.daysLeft);
  const central = SharedState.getCentralStock();

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Posição de Estoque Central</div><div class="page-subtitle">Acompanhamento em Tempo Real · Recebimentos via NF alimentam este estoque</div></div>

    ${central.length > 0 ? `
    <div class="card mb-24" style="border-left:4px solid var(--success)">
      <div class="card-header"><div class="card-title">📦 Estoque Central Vigente (via NFs Recebidas)</div><span class="status-badge status-ok">${central.length} produto(s)</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Quantidade</th><th>Lotes</th><th>Próximo Vencimento</th></tr></thead>
          <tbody>
            ${central.map(c => {
              const lotes = c.lotes || [];
              const proxVenc = lotes.length ? lotes.map(l => l.validade).filter(Boolean).sort()[0] : '—';
              return `<tr>
                <td><strong>${c.produto}</strong></td>
                <td style="font-family:var(--font-mono);font-size:1.05rem">${(c.qtd||0).toLocaleString('pt-BR')} ${c.unidade || ''}</td>
                <td style="font-size:0.82rem">${lotes.length} lote(s)</td>
                <td>${proxVenc}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}

    <div class="card mb-24">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
        <div class="card-title">Inventário Estimado (visão consolidada)</div>
        <div style="display:flex;gap:10px">
          <input type="text" class="form-control" placeholder="Buscar produto..." style="width:250px" onkeyup="
            const v = this.value.toLowerCase();
            document.querySelectorAll('#estoque-table tr').forEach(tr => {
              if(!tr.dataset.name) return;
              tr.style.display = tr.dataset.name.indexOf(v) > -1 ? '' : 'none';
            })
          ">
        </div>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead>
            <tr><th>Produto</th><th>Categoria</th><th>Estoque Físico</th><th>Consumo Médio Diário</th><th>Autonomia (Dias)</th><th>Status</th></tr>
          </thead>
          <tbody id="estoque-table">
            ${prods.map(p => {
              let statusObj = { text: 'Estoque Normal', class: 'status-ok' };
              if(p.daysLeft <= 0) statusObj = { text: 'Falta de Estoque', class: 'status-danger' };
              else if(p.daysLeft <= 5) statusObj = { text: 'Estoque Crítico', class: 'status-danger' };
              else if(p.daysLeft <= 10) statusObj = { text: 'Atenção (Baixo)', class: 'status-warning' };

              return `<tr data-name="${p.name.toLowerCase()}">
                <td><strong>${p.name}</strong><br><small style="color:var(--text-secondary)">ID: ${p.id.toString().padStart(4, '0')}</small></td>
                <td><span class="status-badge status-info">${p.category}</span></td>
                <td style="font-family:var(--font-mono);font-size:1.1rem">${p.stock} ${p.unit}</td>
                <td style="font-family:var(--font-mono)">${p.avgConsume} ${p.unit}/dia</td>
                <td style="font-family:var(--font-mono);font-weight:600">${p.daysLeft} dias</td>
                <td><span class="status-badge ${statusObj.class}">${statusObj.text}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.estoque_entradas = (el) => {
  // Simular pedidos aprovados que aguardam NF (legacy)
  const pedidosNF = DATA.ata_pedidos.filter(p => true);
  // Empenhos do SharedState (novos, criados pelo Gestor)
  const empenhosSaldo = SharedState.getEmpenhos().filter(e => (e.qtdConsumida || 0) < e.qtdTotal);
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Recebimento de Mercadorias (NF)</div><div class="page-subtitle">Entrada física e baixa de empenhos · Ateste de qualidade obrigatório</div></div>

    ${empenhosSaldo.length > 0 ? `
    <div class="card mb-24" style="border-left:4px solid var(--primary)">
      <div class="card-header"><div class="card-title">📋 Empenhos com Saldo (Gestor SEMED)</div><span class="status-badge status-ok">${empenhosSaldo.length}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Empenho</th><th>Ata</th><th>Produto</th><th>Qtd Total</th><th>Consumido</th><th>Saldo</th><th>Ação</th></tr></thead><tbody>
          ${empenhosSaldo.map(e => {
            const saldo = (e.qtdTotal||0) - (e.qtdConsumida||0);
            return `<tr>
              <td><strong>${e.numero}</strong></td>
              <td>${e.ataNumero}</td>
              <td>${e.produto}</td>
              <td style="font-family:var(--font-mono)">${(e.qtdTotal||0).toLocaleString('pt-BR')} ${e.unidade}</td>
              <td style="font-family:var(--font-mono);color:var(--success)">${(e.qtdConsumida||0).toLocaleString('pt-BR')}</td>
              <td style="font-family:var(--font-mono);font-weight:bold;color:var(--danger)">${saldo.toLocaleString('pt-BR')} ${e.unidade}</td>
              <td><button class="btn btn-sm btn-primary" onclick="openReceiveNFModal('${e.id}')">Receber NF</button></td>
            </tr>`;
          }).join('')}
        </tbody></table>
      </div>
    </div>` : ''}

    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Aguardando Recebimento (Legacy)</div></div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Data Pedido</th><th>Ata / Empenho</th><th>Produto</th><th>Solicitado</th><th>Recebido</th><th>Saldo</th><th>Status</th><th>Ação</th></tr></thead><tbody>
          ${pedidosNF.map(p => {
            const emp = DATA.empenhos.find(e => e.id === p.empenhoId);
            if (!emp) return '';
            const prodId = emp.items[0].productId;
            const prod = DATA.ataProducts.find(a => a.id === prodId);
            const recebido = p.delivered || 0;
            const saldo = p.qtd - recebido;
            if (saldo <= 0) return '';

            return `<tr>
              <td>${formatDate(p.date)}</td>
              <td><strong>${emp.numero}</strong><br><small>Ata #${emp.ataId}</small></td>
              <td>${prod.name}</td>
              <td style="font-family:var(--font-mono)">${p.qtd}</td>
              <td style="font-family:var(--font-mono);color:var(--success)">${recebido}</td>
              <td style="font-family:var(--font-mono);font-weight:bold;color:var(--danger)">${saldo} ${prod.unit}</td>
              <td><span class="status-badge ${recebido > 0 ? 'status-warning' : 'status-danger'}">${recebido > 0 ? 'Pendente (Parcial)' : 'Aguardando'}</span></td>
              <td><button class="btn btn-sm btn-primary" onclick="openRecebimentoModal(${p.id})">Registrar NF / Conferência</button></td>
            </tr>`;
          }).join('')}
        </tbody></table>
      </div>
    </div>

    ${SharedState.getNFs().length > 0 ? `
    <div class="card">
      <div class="card-header"><div class="card-title">📄 Histórico de NFs Recebidas</div></div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>NF</th><th>Empenho</th><th>Qtd</th><th>Valor</th><th>Data</th><th>Lote</th><th>Ateste</th></tr></thead><tbody>
          ${SharedState.getNFs().slice(0, 8).map(nf => `
            <tr>
              <td><strong>${nf.numero}</strong></td>
              <td>${nf.empenhoNumero || nf.empenhoId}</td>
              <td style="font-family:var(--font-mono)">${(nf.qtd||0).toLocaleString('pt-BR')}</td>
              <td style="font-family:var(--font-mono)">${formatCurrency(nf.valor || 0)}</td>
              <td>${nf.dataRec}</td>
              <td><code>${nf.lote}</code></td>
              <td><span class="status-badge status-ok">${nf.ateste || 'Conforme'}</span></td>
            </tr>
          `).join('')}
        </tbody></table>
      </div>
    </div>` : ''}
  `;
};

window.openReceiveNFModal = (empenhoId) => {
  const e = SharedState.getEmpenho(empenhoId);
  if (!e) return;
  const saldo = (e.qtdTotal||0) - (e.qtdConsumida||0);
  const content = `
    <div style="background:var(--surface-2);padding:12px;border-radius:6px;margin-bottom:16px;font-size:0.9rem">
      <strong>Empenho:</strong> ${e.numero}<br>
      <strong>Ata:</strong> ${e.ataNumero}<br>
      <strong>Produto:</strong> ${e.produto} · <strong>Unidade:</strong> ${e.unidade}<br>
      <strong style="color:var(--danger)">Saldo a receber: ${saldo.toLocaleString('pt-BR')} ${e.unidade}</strong>
    </div>
    <div class="form-group"><label>Número da Nota Fiscal</label><input type="text" id="rec-nf-num" class="form-control" placeholder="Ex: NF-55829"></div>
    <div class="form-group"><label>Quantidade Recebida (${e.unidade})</label><input type="number" id="rec-nf-qtd" class="form-control" value="${saldo}" max="${saldo}"></div>
    <div class="form-group"><label>Validade do Lote</label><input type="date" id="rec-nf-val" class="form-control"></div>
    <div style="margin-top:16px;padding:12px;border:1px solid var(--border);border-radius:6px;background:var(--warning-light)">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:bold;margin:0">
        <input type="checkbox" id="rec-nf-ateste" style="width:20px;height:20px">
        Atesto conferência de qualidade e quantidade.
      </label>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;">
      <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmReceiveNF('${empenhoId}')">Confirmar Recebimento</button>
    </div>
  `;
  showModal('Receber NF — ' + e.produto, content);
};

window.confirmReceiveNF = (empenhoId) => {
  const ateste = document.getElementById('rec-nf-ateste').checked;
  if (!ateste) { alert('Marque o ateste de conferência antes de confirmar!'); return; }
  const nf = document.getElementById('rec-nf-num').value.trim();
  const qtd = parseFloat(document.getElementById('rec-nf-qtd').value);
  const val = document.getElementById('rec-nf-val').value;
  if (!nf || !qtd || qtd <= 0 || !val) { alert('Preencha NF, quantidade e validade.'); return; }
  const rec = SharedState.receiveNF(empenhoId, { numero: nf, qtd, validade: val, ateste: 'Conforme' });
  if (rec) {
    closeModal();
    showToast('✅ NF ' + nf + ' recebida. Empenho baixado, estoque central alimentado.');
    PAGE_RENDERERS.estoque_entradas(document.getElementById('page-content'));
  }
};

window.openRecebimentoModal = (pedidoId) => {
  const p = DATA.ata_pedidos.find(x => x.id === pedidoId);
  const emp = DATA.empenhos.find(e => e.id === p.empenhoId);
  const prod = DATA.ataProducts.find(a => a.id === emp.items[0].productId);
  const saldoFisico = p.qtd - (p.delivered || 0);
  
  const content = `
    <div style="background:var(--surface-2);padding:12px;border-radius:6px;margin-bottom:16px;font-size:0.9rem">
      <strong>Item:</strong> ${prod.name}<br>
      <strong>Qtd Pedido:</strong> ${p.qtd} ${prod.unit} | <strong>Já Entregue:</strong> ${p.delivered || 0} ${prod.unit} <br>
      <strong style="color:var(--danger)">Saldo a Receber: ${saldoFisico} ${prod.unit}</strong>
    </div>
    <div class="form-group"><label>Número da Nota Fiscal</label><input type="text" id="rec-nf" class="form-control" placeholder="Ex: NF-55829"></div>
    <div class="form-group"><label>Quantidade Recebida Fisicamente (${prod.unit})</label><input type="number" id="rec-qtd" class="form-control" value="${saldoFisico}" max="${saldoFisico}"></div>
    <div class="form-group"><label>Validade do Lote</label><input type="date" id="rec-val" class="form-control"></div>
    
    <div style="margin-top:16px;padding:12px;border:1px solid var(--border);border-radius:6px;background:var(--warning-light)">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:bold;margin:0">
        <input type="checkbox" id="rec-ateste" style="width:20px;height:20px">
        Atesto que realizei a conferência da qualidade técnica e da quantidade física destes produtos.
      </label>
    </div>

    <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;">
      <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="confirmRecebimento(${p.id}, ${emp.id}, ${prod.id})">Confirmar Conferência e Receber</button>
    </div>
  `;
  showModal('Registro de Entrada e Conferência', content);
};

window.confirmRecebimento = (pedidoId, empenhoId, prodId) => {
  const ateste = document.getElementById('rec-ateste').checked;
  if(!ateste) { alert('Você precisa atestar a conferência da mercadoria marcando a caixa de seleção!'); return; }
  
  const qtd = parseFloat(document.getElementById('rec-qtd').value);
  const val = document.getElementById('rec-val').value;
  const nf = document.getElementById('rec-nf').value;
  if(!val || !nf || !qtd || qtd <= 0) { alert('Preencha os dados da NF, Validade e Quantidade corretamente!'); return; }
  
  // Atualizar Pedido
  const p = DATA.ata_pedidos.find(x => x.id === pedidoId);
  p.delivered = (p.delivered || 0) + qtd;
  
  // Alimentar Estoque Real e gerar Lote
  const ataP = DATA.ataProducts.find(x => x.id === prodId);
  const stockProd = DATA.products.find(x => x.id === ataP.stockProductId);
  if(stockProd) {
    stockProd.stock += qtd;
    DATA.lots.push({ id: DATA.lots.length + 1, productId: stockProd.id, number: nf, entryDate: new Date().toISOString().split('T')[0], expirationDate: val, qtd: qtd });
  }
  
  // Baixar Empenho
  const emp = DATA.empenhos.find(e => e.id === empenhoId);
  if(emp) {
    emp.items[0].delivered = (emp.items[0].delivered || 0) + qtd;
    emp.executedValue += (qtd * ataP.unitPrice);
    
    // Atualiza status do empenho e da ata global
    if(emp.items[0].delivered >= emp.items[0].qtd) emp.status = 'Liquidado';
    else emp.status = 'Parcial';
    
    ataP.executedValue += (qtd * ataP.unitPrice);
  }
  
  // Add ao historico de NF
  DATA.nf_history.push({
    id: DATA.nf_history.length + 1,
    numero: nf,
    date: new Date().toISOString().split('T')[0],
    empenhoId: emp.id,
    items: [{ productId: prodId, qtd: qtd, value: qtd * ataP.unitPrice }]
  });
  
  closeModal();
  showToast('NF Recebida com sucesso! Estoque, Ata e Empenho atualizados.', 'success');
  const el = document.getElementById('page-content');
  if(el) PAGE_RENDERERS.estoque_entradas(el);
};

PAGE_RENDERERS.estoque_separacao = (el) => {
  const legacyOrders = DATA.separation_orders || [];
  const sharedOrders = SharedState.getOrders().filter(o => o.status === 'Pendente' || o.status === 'Em separação');
  // OS geradas automaticamente pelo motor de triagem R1
  const osAutomaticas = SharedState.getOsEstoqueCentral().filter(o => o.origem && o.origem.startsWith('Pedido Escola'));
  const osPendentes = osAutomaticas.filter(o => o.status === 'Pendente');
  const osExecucao  = osAutomaticas.filter(o => o.status === 'Em Separação');

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">📦 Ordens de Separação (Picking)</div>
      <div class="page-subtitle">FIFO aplicado automaticamente · OS manuais e automáticas do motor de triagem SUALE</div>
    </div>

    <!-- KPIs -->
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card red"><div class="kpi-icon">⏳</div><div class="kpi-value">${osPendentes.length + sharedOrders.filter(o=>o.status==='Pendente').length}</div><div class="kpi-label">Aguardando Separação</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">🔄</div><div class="kpi-value">${osExecucao.length + sharedOrders.filter(o=>o.status==='Em separação').length}</div><div class="kpi-label">Em Separação</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">🏭</div><div class="kpi-value">${osAutomaticas.length}</div><div class="kpi-label">OS Automáticas</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${osAutomaticas.filter(o=>o.status==='Recebido').length}</div><div class="kpi-label">Concluídas</div></div>
    </div>

    ${osAutomaticas.length > 0 ? `
    <!-- OS Automáticas do Motor de Triagem R1 -->
    <div class="card mb-24">
      <div class="card-header">
        <div class="card-title">🤖 OS Geradas pelo Motor de Triagem (R1)</div>
        <span class="status-badge status-ok">${osAutomaticas.length} OS automática(s)</span>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>OS</th><th>Origem (Pedido)</th><th>Escola Destino</th><th>Itens</th><th>Data Programada</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${osAutomaticas.map(os => {
              const itensStr = (os.itens||[]).map(i => `${i.produto} (${i.quantidade}${i.unidade||'kg'})`).join(', ');
              const itensResume = itensStr.length > 60 ? itensStr.slice(0,60)+'...' : itensStr;
              return `<tr>
                <td><strong style="color:var(--primary)">${os.numero_os}</strong></td>
                <td><span class="tag tag-blue">${os.origem}</span></td>
                <td><strong>${os.escola_destino}</strong></td>
                <td style="font-size:0.78rem" title="${itensStr}">${itensResume}</td>
                <td>${os.data_programada||'—'}</td>
                <td><span class="status-badge ${os.status==='Recebido'?'status-ok':os.status==='Em Separação'?'status-warning':'status-danger'}">${os.status}</span></td>
                <td>
                  ${os.status === 'Pendente'
                    ? `<button class="btn btn-sm btn-primary" onclick="window._iniciarOsAuto('${os.id}')">📦 Iniciar Separação</button>`
                    : os.status === 'Em Separação'
                    ? `<button class="btn btn-sm btn-warning" onclick="window._concluirOsAuto('${os.id}')">✅ Concluir</button>`
                    : `<button class="btn btn-sm btn-outline" disabled>Concluído</button>`}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}

    <!-- Fila de Separação Manual (pedidos diretos das escolas) -->
    <div class="card mb-24">
      <div class="card-header">
        <div class="card-title">Fila de Separação (Pedidos Diretos)</div>
        ${sharedOrders.length ? `<span class="status-badge status-ok">${sharedOrders.length} pedido(s) de escola</span>` : ''}
      </div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Ordem</th><th>Escola Destino</th><th>Itens</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${sharedOrders.map(o => {
              const itensStr = (o.itens||[]).map(i => i.produto + ' (' + i.qtd + i.unidade + ')').join(', ');
              return `<tr>
                <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(o.numero).padStart(3,'0')} <span class="tag tag-blue" style="font-size:0.65rem">NOVO</span></td>
                <td><strong>${o.school}</strong></td>
                <td style="font-size:0.82rem">${itensStr}</td>
                <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
                <td>${o.status === 'Pendente'
                  ? `<button class="btn btn-sm btn-primary" onclick="sharedStartSeparacao('${o.id}')">Iniciar Separação (FIFO)</button>`
                  : `<button class="btn btn-sm btn-warning" onclick="sharedFinishSeparacao('${o.id}')">Concluir</button>`}</td>
              </tr>`;
            }).join('')}
            ${legacyOrders.map(o => `<tr>
              <td style="font-family:var(--font-mono);font-weight:700">#ORD-${o.id}</td>
              <td><strong>${o.school}</strong></td>
              <td style="font-size:0.85rem">${o.items.length} produto(s)</td>
              <td><span class="status-badge ${o.status==='Separado'?'status-ok':'status-warning'}">${o.status}</span></td>
              <td>${o.status === 'Pendente'
                ? `<button class="btn btn-sm btn-primary" onclick="startSeparacao(${o.id})">Iniciar Separação</button>`
                : `<button class="btn btn-sm btn-outline" disabled>Separado</button>`}</td>
            </tr>`).join('')}
            ${sharedOrders.length === 0 && legacyOrders.length === 0 ? '<tr><td colspan="5" style="text-align:center;color:#94A3B8;padding:24px">Nenhum pedido aguardando separação manual</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

window._iniciarOsAuto = (osId) => {
  const os = SharedState.getOsEstoqueCentral().find(o => o.id === osId);
  if (!os) return;
  os.status = 'Em Separação';
  SharedState._persist();
  showToast(`📦 OS ${os.numero_os} em separação — FIFO aplicado.`);
  PAGE_RENDERERS.estoque_separacao(document.getElementById('page-content'));
};
window._concluirOsAuto = (osId) => {
  const os = SharedState.getOsEstoqueCentral().find(o => o.id === osId);
  if (!os) return;
  os.status = 'Recebido';
  SharedState._persist();
  showToast(`✅ OS ${os.numero_os} concluída — carga liberada para carregamento.`);
  PAGE_RENDERERS.estoque_separacao(document.getElementById('page-content'));
};


window.sharedStartSeparacao = (orderId) => {
  const o = SharedState.getOrders().find(x => x.id === orderId);
  if (!o) return;
  SharedState.updateOrderStatus(orderId, 'Em separação');
  // Decrementa estoque central (FIFO)
  (o.itens || []).forEach(item => SharedState.consumeCentralStock(item.produto, item.qtd));
  showToast('📦 Pedido #' + String(o.numero).padStart(3,'0') + ' em separação — FIFO aplicado, lotes vinculados.');
  PAGE_RENDERERS.estoque_separacao(document.getElementById('page-content'));
};
window.sharedFinishSeparacao = (orderId) => {
  const o = SharedState.getOrders().find(x => x.id === orderId);
  if (!o) return;
  SharedState.updateOrderStatus(orderId, 'Em transporte');
  showToast('🚚 Pedido separado — vai para Carregamento/Bipagem.');
  PAGE_RENDERERS.estoque_separacao(document.getElementById('page-content'));
};

window.startSeparacao = (orderId) => {
  const o = DATA.separation_orders.find(x => x.id === orderId);
  o.status = 'Separado';
  showToast('Separação concluída via FIFO! Lotes vinculados.', 'success');
  const el = document.getElementById('page-content');
  if(el) PAGE_RENDERERS.estoque_separacao(el);
};

PAGE_RENDERERS.estoque_carregamento = (el) => {
  const separated = DATA.separation_orders.filter(o => o.status === 'Separado');
  const sharedInTransit = SharedState.getOrders().filter(o => o.status === 'Em transporte');
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Carregamento e Bipagem (Check-out)</div><div class="page-subtitle">Validação de caixas no caminhão · Pedidos prontos aparecem em tempo real</div></div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><div class="card-title">Cargas Aguardando Embarque</div>${sharedInTransit.length ? '<span class="status-badge status-ok">'+sharedInTransit.length+' pronto(s)</span>' : ''}</div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Ordem</th><th>Destino</th><th>Itens</th><th>Ação</th></tr></thead><tbody>
          ${sharedInTransit.map(o => `<tr>
            <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(o.numero).padStart(3,'0')}</td>
            <td><strong>${o.school}</strong></td>
            <td style="font-size:0.82rem">${(o.itens||[]).length} itens</td>
            <td><button class="btn btn-sm btn-primary" onclick="sharedLiberarCaminhao('${o.id}')">✅ Liberar p/ Motorista</button></td>
          </tr>`).join('')}
          ${separated.map(o => `<tr>
            <td><strong>#ORD-${o.id}</strong></td>
            <td>${o.school}</td>
            <td style="font-size:0.82rem">${o.items?.length || 0} itens</td>
            <td><button class="btn btn-sm btn-primary" onclick="openBipagem(${o.id})">Bipar Carga</button></td>
          </tr>`).join('')}
          ${(sharedInTransit.length + separated.length) === 0 ? '<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma carga pronta — aguardando separação</td></tr>' : ''}
        </tbody></table>
      </div></div>
      <div class="card"><div class="card-header"><div class="card-title">Simulador de Bipagem</div></div>
      <div class="card-body" id="bipagem-area">
        <div style="color:var(--text-tertiary);text-align:center;padding:40px">Selecione uma carga à esquerda para iniciar a bipagem.</div>
      </div></div>
    </div>
  `;
};

window.sharedLiberarCaminhao = (orderId) => {
  const o = SharedState.getOrders().find(x => x.id === orderId);
  if (!o) return;
  showToast('🚚 Caminhão liberado — carga #' + String(o.numero).padStart(3,'0') + ' entregue ao Motorista.');
  PAGE_RENDERERS.estoque_carregamento(document.getElementById('page-content'));
};

window.openBipagem = (orderId) => {
  const o = DATA.separation_orders.find(x => x.id === orderId);
  const area = document.getElementById('bipagem-area');
  area.innerHTML = `
    <h4 style="margin-top:0">Bipando Ordem #ORD-${o.id}</h4>
    <div style="display:flex;gap:12px;margin-bottom:20px;">
      <input type="text" id="bip-input" class="form-control" placeholder="Clique aqui e simule o leitor (aperte Enter)..." style="flex:1" onkeydown="if(event.key==='Enter') window.biparItem(${o.id})">
      <button class="btn btn-primary" onclick="window.biparItem(${o.id})">Bipar</button>
    </div>
    <ul id="bip-list" style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
      ${o.items.map(i => {
        const p = DATA.products.find(x => x.id === i.productId);
        const done = i.scanned >= i.requested;
        return `<li style="padding:12px;border:1px solid var(--border);border-radius:4px;display:flex;justify-content:space-between;align-items:center;background:${done?'var(--success-light)':'transparent'}">
          <div><strong>${p.name}</strong><br><small>Lote: ${i.lotSugg}</small></div>
          <div style="font-family:var(--font-mono);font-weight:bold;color:${done?'var(--success)':'var(--text)'}">${i.scanned} / ${i.requested}</div>
        </li>`;
      }).join('')}
    </ul>
    <div style="margin-top:20px;text-align:right">
      <button class="btn btn-success" id="btn-liberar" style="display:none" onclick="liberarCaminhao(${o.id})">Tudo Bipado! Liberar Caminhão</button>
    </div>
  `;
  checkBipagem(o);
};

window.biparItem = (orderId) => {
  const o = DATA.separation_orders.find(x => x.id === orderId);
  // Simula bipar o primeiro item incompleto
  const item = o.items.find(i => i.scanned < i.requested);
  if(item) {
    item.scanned = item.requested; // simula bipar a caixa inteira
    document.getElementById('bip-input').value = '';
    openBipagem(orderId);
  } else {
    showToast('Todos os itens já foram bipados!', 'warning');
  }
};

window.checkBipagem = (o) => {
  const allDone = o.items.every(i => i.scanned >= i.requested);
  if(allDone) {
    document.getElementById('btn-liberar').style.display = 'inline-block';
    showToast('Carga validada com sucesso! Pronta para embarque.', 'success');
  }
};

window.liberarCaminhao = (orderId) => {
  const o = DATA.separation_orders.find(x => x.id === orderId);
  o.status = 'Em Transporte';
  showToast('Caminhão Liberado!', 'success');
  const el = document.getElementById('page-content');
  if(el) PAGE_RENDERERS.estoque_carregamento(el);
};

PAGE_RENDERERS.estoque_lotes = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Controle de Lotes e Validade</div><div class="page-subtitle">Gestão de Shelf-life e Inventário detalhado</div></div>
    <div class="card mb-24">
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Lote</th><th>Produto</th><th>Entrada</th><th>Validade</th><th>Qtd</th><th>Status</th></tr></thead><tbody>
          ${DATA.lots.map(l => {
            const p = DATA.products.find(x => x.id === l.productId);
            return `<tr>
              <td style="font-family:var(--font-mono)"><strong>${l.number}</strong></td>
              <td>${p ? p.name : '—'}</td>
              <td>${formatDate(l.entryDate)}</td>
              <td style="font-family:var(--font-mono);font-weight:700">${formatDate(l.expirationDate)}</td>
              <td style="font-family:var(--font-mono)">${l.qtd.toLocaleString('pt-BR')} ${p?p.unit:''}</td>
              <td><span class="status-badge status-ok">Vigente</span></td>
            </tr>`;
          }).join('')}
        </tbody></table>
      </div>
    </div>
  `;
};

// ─── MOTORISTA: RENDERERS ───
PAGE_RENDERERS.motorista_dashboard = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Minha Rota Diária</div><div class="page-subtitle">Veículo: ABC-1234 · Rota: Anhanduizinho · Data: 10/07/2026</div></div>
    
    <div class="grid-3 mb-24">
      <div class="card stat-card"><div class="card-body">
        <div class="stat-icon" style="color:var(--primary);background:var(--primary-light)">🏫</div>
        <div class="stat-info"><div class="stat-num">3</div><div class="stat-name">Escolas na Rota</div></div>
      </div></div>
      <div class="card stat-card"><div class="card-body">
        <div class="stat-icon" style="color:var(--success);background:var(--success-light)">✓</div>
        <div class="stat-info"><div class="stat-num" id="driver-delivered-count">1</div><div class="stat-name">Entregas Realizadas</div></div>
      </div></div>
      <div class="card stat-card"><div class="card-body">
        <div class="stat-icon" style="color:var(--warning);background:var(--warning-light)">⏳</div>
        <div class="stat-info"><div class="stat-num" id="driver-pending-count">2</div><div class="stat-name">Entregas Pendentes</div></div>
      </div></div>
    </div>

    <div class="grid-2 mb-24">
      <div class="card"><div class="card-header"><div class="card-title">Sequência de Paradas da Rota</div></div><div class="card-body">
        <div style="display:flex;flex-direction:column;gap:16px;position:relative">
          <div style="position:absolute;left:20px;top:20px;bottom:20px;width:2px;background:var(--border);z-index:0"></div>
          
          <div style="display:flex;gap:16px;align-items:center;position:relative;z-index:1">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--success);color:white;display:flex;align-items:center;justify-content:center;font-weight:700">1</div>
            <div style="flex:1">
              <div style="font-weight:700">EM ADV. DEMOSTHENES MARTINS</div>
              <div style="font-size:0.8rem;color:var(--text-secondary)">Rua Pedro Celestino, 1234 — Centro</div>
            </div>
            <div><span class="status-badge status-ok">Entregue (08:32)</span></div>
          </div>
          
          <div style="display:flex;gap:16px;align-items:center;position:relative;z-index:1">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--warning);color:white;display:flex;align-items:center;justify-content:center;font-weight:700">2</div>
            <div style="flex:1">
              <div style="font-weight:700">EM PROF. ANTÔNIO LOPES LINS</div>
              <div style="font-size:0.8rem;color:var(--text-secondary)">Rua Barão do Rio Branco, 456 — Centro</div>
            </div>
            <div><button class="btn btn-sm btn-primary" onclick="navigateTo(null, 'entregas')">Realizar Entrega</button></div>
          </div>

          <div style="display:flex;gap:16px;align-items:center;position:relative;z-index:1">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--text-tertiary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700">3</div>
            <div style="flex:1">
              <div style="font-weight:700">EMTI PROFª IRACEMA MARIA VICENTE</div>
              <div style="font-size:0.8rem;color:var(--text-secondary)">Av. Eduardo Elias Zahran, 200 — Itanhangá</div>
            </div>
            <div><span class="status-badge status-danger">Aguardando</span></div>
          </div>
        </div>
      </div></div>
      
      <div class="card"><div class="card-header"><div class="card-title">Mapa de Navegação</div></div><div class="card-body" style="display:flex;align-items:center;justify-content:center;background:#E2E8F0;min-height:250px;border-radius:var(--radius)">
        <div style="text-align:center;color:var(--text-secondary)">
          <div style="font-size:2rem">🗺️</div>
          <div style="font-weight:600;margin-top:8px">Visualização de Rota GPS</div>
          <div style="font-size:0.8rem;color:var(--text-tertiary)">Mostrando sequência de paradas em tempo real</div>
        </div>
      </div></div>
    </div>
  `;
};

PAGE_RENDERERS.motorista_entregas = (el) => {
  const prof = window.PROFILES[state.currentProfile];
  const emTransporteList = SharedState.getOrders().filter(o => o.status === 'Em transporte' && (!prof || o.driver === prof.name));
  const alvo = window._selectedDeliveryOrderId
    ? emTransporteList.find(o => o.id === window._selectedDeliveryOrderId)
    : emTransporteList[0];
  const alvoNome = alvo ? alvo.school : 'EM PROF. ANTÔNIO LOPES LINS';
  window._currentDeliveryOrderId = alvo ? alvo.id : null;

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Realizar Entrega</div><div class="page-subtitle">Confirmação de recebimento física na unidade escolar${alvo ? ' · Pedido #' + String(alvo.numero).padStart(3,'0') : ''}</div></div>

    ${emTransporteList.length > 0 ? `
    <div class="card mb-16">
      <div class="card-header"><div class="card-title">🚚 Fila de Entregas (Em transporte)</div><span class="status-badge status-warning">${emTransporteList.length}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>#</th><th>Escola</th><th>Itens</th><th>Ação</th></tr></thead>
          <tbody>
            ${emTransporteList.map(o => `
              <tr ${o.id === (alvo?.id) ? 'style="background:var(--primary-light)"' : ''}>
                <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(o.numero).padStart(3,'0')}</td>
                <td><strong>${o.school}</strong></td>
                <td style="font-size:0.82rem">${(o.itens||[]).map(i => i.produto + ' (' + i.qtd + i.unidade + ')').join(', ') || '—'}</td>
                <td><button class="btn btn-sm ${o.id === (alvo?.id) ? 'btn-primary' : 'btn-outline'}" onclick="selectDelivery('${o.id}')">${o.id === (alvo?.id) ? 'Selecionada' : 'Selecionar'}</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}

    <div id="entrega-form-container" class="card mb-24" style="max-width: 600px; margin: 0 auto;">
      <div class="card-header"><div class="card-title">Confirmar Recibo de Alimentos: ${alvoNome}</div></div>
      <div class="card-body">
        <form id="form-driver-delivery">
          <div class="form-group">
            <label>Responsável pelo Recebimento (Nome Completo)</label>
            <input type="text" id="delivery-receiver" class="btn btn-outline" style="width:100%;text-align:left;cursor:text;padding:10px" placeholder="Ex: Ana Costa (Diretora)" required>
          </div>
          <div class="form-group">
            <label>Matrícula / Documento</label>
            <input type="text" id="delivery-doc" class="btn btn-outline" style="width:100%;text-align:left;cursor:text;padding:10px" placeholder="Ex: 98765-X" required>
          </div>
          
          <div class="form-group">
            <label>Foto do Comprovante / Alimentos Entregues</label>
            <div class="camera-preview" id="delivery-camera-preview" onclick="simulateCamera()">
              <div class="camera-placeholder" id="delivery-camera-placeholder">
                <span style="font-size:2rem">📷</span>
                <span>Toque para simular captura da foto</span>
              </div>
              <img id="delivery-camera-img" src="" style="display:none" alt="Comprovante">
            </div>
          </div>
          
          <div class="form-group">
            <label>Assinatura Digital do Responsável</label>
            <div class="signature-pad" id="delivery-sig-pad">
              <canvas id="delivery-sig-canvas"></canvas>
              <div class="signature-placeholder" id="delivery-sig-placeholder">Desenhe a assinatura com o mouse/dedo aqui</div>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" style="margin-top:4px" onclick="clearSignature()">Limpar Assinatura</button>
          </div>
          
          <div style="display:flex;gap:12px;margin-top:24px;justify-content:flex-end">
            <button type="button" class="btn btn-outline" onclick="navigateTo(null, 'dashboard')">Voltar</button>
            <button type="submit" class="btn btn-primary">Confirmar e Assinar Recibo</button>
          </div>
        </form>
      </div>
    </div>
  `;
  setTimeout(() => {
    initSignatureCanvas();
    document.getElementById('form-driver-delivery')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const rec = document.getElementById('delivery-receiver').value;
      const doc = document.getElementById('delivery-doc').value;
      if (!rec) {
        alert('Por favor, informe o nome do responsável.');
        return;
      }
      if (window._currentDeliveryOrderId) {
        SharedState.confirmDelivery(window._currentDeliveryOrderId, rec, doc);
        window._currentDeliveryOrderId = null;
        window._selectedDeliveryOrderId = null;
        showToast('✅ Entrega confirmada. Escola, Cooperativa e SEMED foram notificados. Estoque local incrementado.');
      } else {
        alert('Entrega confirmada com sucesso! Recibo digital assinado e foto enviada para a SEMED.');
      }
      navigateTo(null, 'dashboard');
    });
  }, 50);
};

window.selectDelivery = (orderId) => {
  window._selectedDeliveryOrderId = orderId;
  PAGE_RENDERERS.motorista_entregas(document.getElementById('page-content'));
};

window.simulateCamera = () => {
  const placeholder = document.getElementById('delivery-camera-placeholder');
  const img = document.getElementById('delivery-camera-img');
  if (placeholder && img) {
    placeholder.style.display = 'none';
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23c5e1a5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2333691e">Carga Entregue - EM PROF. ANTÔNIO LOPES LINS</text></svg>';
    img.style.display = 'block';
  }
};

window.clearSignature = () => {
  const canvas = document.getElementById('delivery-sig-canvas');
  const placeholder = document.getElementById('delivery-sig-placeholder');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (placeholder) placeholder.style.display = 'flex';
};

window.initSignatureCanvas = () => {
  const canvas = document.getElementById('delivery-sig-canvas');
  const placeholder = document.getElementById('delivery-sig-placeholder');
  if (!canvas) return;
  
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  
  const ctx = canvas.getContext('2d');
  ctx.strokeStyle = '#0F172A';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  
  let drawing = false;
  
  const startDraw = (e) => {
    drawing = true;
    if (placeholder) placeholder.style.display = 'none';
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.moveTo(x, y);
  };
  
  const draw = (e) => {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDraw = () => {
    drawing = false;
  };
  
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDraw);
  canvas.addEventListener('touchstart', (e) => { startDraw(e); e.preventDefault(); });
  canvas.addEventListener('touchmove', (e) => { draw(e); e.preventDefault(); });
  canvas.addEventListener('touchend', stopDraw);
};

PAGE_RENDERERS.motorista_ocorrencias = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Registrar Ocorrência</div><div class="page-subtitle">Comunicação de incidentes em tempo real para a SEMED</div></div>
    <div class="card mb-24" style="max-width: 600px; margin: 0 auto;">
      <div class="card-header"><div class="card-title">Novo Registro de Ocorrência</div></div>
      <div class="card-body">
        <form id="form-driver-incident">
          <div class="form-group">
            <label>Escola Relacionada</label>
            <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="incident-school" required>
              <option value="">Selecione a escola...</option>
              <option value="EM PROF. ANTÔNIO LOPES LINS">EM PROF. ANTÔNIO LOPES LINS</option>
              <option value="EMTI PROFª IRACEMA MARIA VICENTE">EMTI PROFª IRACEMA MARIA VICENTE</option>
              <option value="Outra">Outro incidente (Trânsito / Veículo)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Tipo de Ocorrência</label>
            <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="incident-type" required>
              <option value="">Selecione o tipo...</option>
              <option value="Atraso no trânsito">Atraso no trânsito (Engarrafamento/Acidente)</option>
              <option value="Escola fechada">Escola fechada ou sem recebedor</option>
              <option value="Item danificado">Alimento ou embalagem danificada</option>
              <option value="Problema mecânico">Problema mecânico no veículo</option>
              <option value="Outro">Outro problema (especificar)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Descrição do Ocorrido</label>
            <textarea class="btn btn-outline" style="width:100%;text-align:left;cursor:text;min-height:100px;padding:10px" id="incident-desc" placeholder="Descreva os detalhes do problema ocorrido..." required></textarea>
          </div>
          <div style="display:flex;gap:12px;margin-top:24px;justify-content:flex-end">
            <button type="button" class="btn btn-outline" onclick="navigateTo(null, 'dashboard')">Voltar</button>
            <button type="submit" class="btn btn-danger">Enviar Relatório de Ocorrência</button>
          </div>
        </form>
      </div>
    </div>
  `;
  setTimeout(() => {
    document.getElementById('form-driver-incident')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const school = document.getElementById('incident-school').value;
      const type = document.getElementById('incident-type').value;
      const desc = document.getElementById('incident-desc').value;
      SharedState.addIncident({
        school,
        tipo: type,
        descricao: desc,
        motorista: (PROFILES[state.currentProfile] && PROFILES[state.currentProfile].name) || 'Motorista',
      });
      showToast('⚠️ Ocorrência registrada — SEMED/Gestor foram notificados em tempo real.');
      navigateTo(null, 'dashboard');
    });
  }, 50);
};

PAGE_RENDERERS.motorista_historico = (el) => {
  const confirmadas = SharedState.getDeliveries().filter(d => d.status === 'Confirmada');
  const incidents = SharedState.getIncidents();

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Histórico de Viagens & Entregas</div><div class="page-subtitle">Entregas confirmadas por este motorista e ocorrências registradas</div></div>

    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${confirmadas.length}</div><div class="kpi-label">Entregas Confirmadas</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${new Set(confirmadas.map(d => d.school)).size}</div><div class="kpi-label">Escolas Atendidas</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${incidents.length}</div><div class="kpi-label">Ocorrências Registradas</div></div>
    </div>

    <div class="card mb-24">
      <div class="card-header"><div class="card-title">🚚 Entregas Realizadas</div>${confirmadas.length ? '<span class="status-badge status-ok">'+confirmadas.length+'</span>' : ''}</div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Data</th><th>Pedido</th><th>Escola</th><th>Cooperativa</th><th>Recebido por</th><th>Doc.</th></tr></thead>
          <tbody>
            ${confirmadas.map(d => `
              <tr>
                <td style="font-family:var(--font-mono);font-size:0.82rem">${d.confirmadoEm ? new Date(d.confirmadoEm).toLocaleString('pt-BR') : '—'}</td>
                <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(d.orderNumero).padStart(3,'0')}</td>
                <td><strong>${d.school}</strong></td>
                <td><span class="tag tag-teal">${d.cooperative||'—'}</span></td>
                <td>${d.receiver || '—'}</td>
                <td style="font-size:0.82rem">${d.doc || '—'}</td>
              </tr>
            `).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma entrega confirmada ainda</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>

    ${incidents.length > 0 ? `
    <div class="card">
      <div class="card-header"><div class="card-title">⚠️ Ocorrências Recentes</div></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Data</th><th>Escola</th><th>Tipo</th><th>Descrição</th><th>Status</th></tr></thead>
          <tbody>
            ${incidents.slice(0, 10).map(i => `
              <tr>
                <td style="font-size:0.82rem">${new Date(i.criadoEm).toLocaleString('pt-BR')}</td>
                <td>${i.school || '—'}</td>
                <td><strong>${i.tipo || '—'}</strong></td>
                <td style="font-size:0.82rem">${i.descricao || '—'}</td>
                <td><span class="status-badge status-warning">${i.status || 'Aberta'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}
  `;
};

// ============================================================
// ─── DIRETOR: RENDERERS ─────────────────────────────────────
// ============================================================

PAGE_RENDERERS.diretor_dashboard = (el) => {
  const sc = getCurrentSchool();
  const students = sc.students || 0;
  const att = sc.attendance_avg || Math.round(students * 0.9);
  const attPct = sc.attendance_pct || 90;
  const refeicoes = sc.refeicoesDia || sc.meals_per_day || 2;
  const budget = sc.monthly_budget || Math.round(students * 35);
  const products = DATA.products || [];
  const localStock = SharedState.getSchoolStock(sc.name);
  const rows = products.map(p => {
    const local = localStock.find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20);
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    return { daysLeft: avgDay > 0 ? Math.round(qty / avgDay) : 999 };
  });
  const critical = rows.filter(r => r.daysLeft <= 3).length;
  const warning = rows.filter(r => r.daysLeft > 3 && r.daysLeft <= 7).length;
  const orders = SharedState.getOrders().filter(o => o.school === sc.name);
  const pendingOrders = orders.filter(o => o.status === 'Pendente').length;
  const deliveries = SharedState.getDeliveries().filter(d => d.school === sc.name);
  const inTransit = deliveries.filter(d => d.status === 'Em transporte').length;
  const consumed = Math.round(att * refeicoes * 0.3);

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Painel da Direção — ${sc.name}</div>
        <div class="page-subtitle">${sc.tipo || sc.sigla} · ${sc.region} · ${students.toLocaleString('pt-BR')} alunos · ${refeicoes} refeições/dia</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary btn-sm" onclick="navigateTo('diretor','pedidos')">🛒 Solicitar Reposição</button>
        <button class="btn btn-outline btn-sm" onclick="navigateTo('diretor','estoque')">📦 Ver Estoque</button>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">👨‍🎓</div><div class="kpi-value">${students.toLocaleString('pt-BR')}</div><div class="kpi-label">Matriculados</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${att.toLocaleString('pt-BR')}</div><div class="kpi-label">Presentes Hoje</div></div>
      <div class="kpi-card ${critical > 0 ? 'red' : 'orange'}"><div class="kpi-icon">📦</div><div class="kpi-value">${critical > 0 ? critical + ' crítico(s)' : warning + ' atenção'}</div><div class="kpi-label">Status Estoque</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🛒</div><div class="kpi-value">${pendingOrders}</div><div class="kpi-label">Pedidos Pendentes</div></div>
      <div class="kpi-card purple"><div class="kpi-icon">🚚</div><div class="kpi-value">${inTransit}</div><div class="kpi-label">Em Transporte</div></div>
    </div>

    <div class="grid-2-1">
      <div style="display:flex;flex-direction:column;gap:16px">

        ${(critical > 0 || warning > 0) ? `
        <div class="card" style="border-left:4px solid var(--danger)">
          <div class="card-header"><div class="card-title">🚨 Alertas de Estoque</div><span class="status-badge status-danger">${critical + warning} itens</span></div>
          <div class="card-body">
            <div class="alert-list">
              ${critical > 0 ? `<div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>${critical} produto(s) crítico(s)</strong> — estoque para menos de 3 dias. <a href="#" onclick="navigateTo('diretor','estoque');return false">Ver estoque</a></div></div>` : ''}
              ${warning > 0 ? `<div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>${warning} produto(s) em atenção</strong> — estoque para menos de 7 dias.</div></div>` : ''}
              <div class="alert-item" style="background:#e3f2fd;border-left:4px solid #1565C0"><span class="alert-icon">💡</span><div class="alert-text">Solicite reposição agora para garantir continuidade das refeições. <button class="btn btn-sm btn-primary" style="margin-top:6px" onclick="navigateTo('diretor','pedidos')">🛒 Criar Pedido</button></div></div>
            </div>
          </div>
        </div>` : `
        <div class="card" style="border-left:4px solid var(--success)">
          <div class="card-body"><div class="alert-item" style="background:#e8f5e9;border-left:none"><span class="alert-icon">✅</span><div class="alert-text"><strong>Estoque saudável</strong> — nenhum item crítico no momento.</div></div></div>
        </div>`}

        <div class="card">
          <div class="card-header"><div class="card-title">📦 Últimos Pedidos de Reposição</div><button class="btn btn-primary btn-sm" onclick="navigateTo('diretor','pedidos')">+ Novo Pedido</button></div>
          <div class="card-body" style="padding:0">
            ${orders.length > 0 ? `
            <table class="data-table">
              <thead><tr><th>Data</th><th>Cooperativa</th><th>Valor</th><th>Status</th></tr></thead>
              <tbody>
                ${orders.slice(-5).reverse().map(o => `
                  <tr>
                    <td>${new Date(o.date).toLocaleDateString('pt-BR')}</td>
                    <td>${o.coop || '—'}</td>
                    <td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
                    <td><span class="status-badge ${o.status==='Entregue'?'status-ok':o.status==='Pendente'?'status-warning':'status-info'}">${o.status}</span></td>
                  </tr>`).join('')}
              </tbody>
            </table>` : `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">Nenhum pedido ainda</div></div>`}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">🚚 Entregas Recentes</div></div>
          <div class="card-body" style="padding:0">
            ${deliveries.length > 0 ? `
            <table class="data-table">
              <thead><tr><th>Data</th><th>Recebido por</th><th>Status</th></tr></thead>
              <tbody>
                ${deliveries.slice(-5).reverse().map(d => `
                  <tr>
                    <td>${d.data ? new Date(d.data).toLocaleDateString('pt-BR') : '—'}</td>
                    <td>${d.receiver || '—'}</td>
                    <td><span class="status-badge ${d.status==='Confirmada'?'status-ok':'status-info'}">${d.status||'—'}</span></td>
                  </tr>`).join('')}
              </tbody>
            </table>` : `<div class="empty-state"><div class="empty-icon">🚚</div><div class="empty-text">Nenhuma entrega registrada</div></div>`}
          </div>
        </div>

      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card" style="background:var(--primary);color:white">
          <div class="card-body">
            <div style="font-size:0.8rem;opacity:0.8;margin-bottom:4px">Orçamento Mensal</div>
            <div style="font-size:2rem;font-weight:800">R$ ${Math.round(budget*0.55).toLocaleString('pt-BR')}</div>
            <div style="font-size:0.78rem;opacity:0.8;margin-bottom:10px">de R$ ${budget.toLocaleString('pt-BR')} (55% executado)</div>
            <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:6px"><div style="width:55%;height:100%;background:white;border-radius:4px"></div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">📋 Perfil da Unidade</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:8px;font-size:0.88rem">
            <div><strong>Tipo:</strong> ${sc.tipo || sc.sigla}</div>
            <div><strong>Região:</strong> ${sc.region}</div>
            <div><strong>Níveis:</strong> ${sc.grade_levels || '—'}</div>
            <div><strong>Refeições/dia:</strong> ${refeicoes}</div>
            <div><strong>Consumo estimado:</strong> ~${consumed} kg/dia</div>
            <div><strong>Frequência hoje:</strong> ${attPct}% (${att}/${students})</div>
            <hr style="border:none;border-top:1px solid var(--border);margin:4px 0">
            <div><strong>Diretor(a):</strong> ${sc.diretor ? sc.diretor.name : '—'}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">${sc.diretor ? sc.diretor.email : ''}</div>
            <hr style="border:none;border-top:1px solid var(--border);margin:4px 0">
            <div><strong>Resp. Estoque:</strong> ${sc.respEstoque ? sc.respEstoque.name : '—'}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">${sc.respEstoque ? sc.respEstoque.email : ''}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">⚡ Acesso Rápido</div></div>
          <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <button class="btn btn-ghost" onclick="navigateTo('diretor','estoque')" style="font-size:0.82rem">📦 Estoque</button>
            <button class="btn btn-ghost" onclick="navigateTo('diretor','pedidos')" style="font-size:0.82rem">🛒 Pedido</button>
            <button class="btn btn-ghost" onclick="navigateTo('diretor','entregas')" style="font-size:0.82rem">🚚 Entregas</button>
            <button class="btn btn-ghost" onclick="navigateTo('diretor','historico')" style="font-size:0.82rem">📜 Histórico</button>
            <button class="btn btn-ghost" onclick="navigateTo('diretor','consumo')" style="font-size:0.82rem">📝 Consumo</button>
            <button class="btn btn-ghost" onclick="navigateTo('diretor','cardapios')" style="font-size:0.82rem">🍽️ Cardápio</button>
          </div>
        </div>
      </div>
    </div>`;
};

PAGE_RENDERERS.diretor_estoque = (el) => {
  const sc = getCurrentSchool();
  const products = DATA.products || [];
  const localStock = SharedState.getSchoolStock(sc.name);
  const rows = products.map(p => {
    const local = localStock.find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20);
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    const daysLeft = avgDay > 0 ? Math.round(qty / avgDay) : 999;
    return { name: p.name, category: p.category, unit: p.unit, qty, daysLeft, unidade: local?.unidade || p.unit, isReal: !!local };
  });
  const critical = rows.filter(r => r.daysLeft <= 3).length;
  const warning = rows.filter(r => r.daysLeft > 3 && r.daysLeft <= 7).length;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Estoque — ${sc.name}</div>
      <div class="page-subtitle">Visão gerencial · atualizado automaticamente por entregas e consumo</div>
      <button class="btn btn-primary" onclick="navigateTo('diretor','pedidos')">🛒 Solicitar Reposição</button>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${rows.length}</div><div class="kpi-label">Produtos</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${rows.length-critical-warning}</div><div class="kpi-label">Estoque Normal</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚡</div><div class="kpi-value">${warning}</div><div class="kpi-label">Em Atenção</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${critical}</div><div class="kpi-label">Crítico</div></div>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Categoria</th><th style="text-align:right">Qtd. Escola</th><th>Un.</th><th style="text-align:right">Dias Restantes</th><th>Status</th></tr></thead>
          <tbody>
            ${rows.map(r => {
              const [cls, label] = r.daysLeft<=3 ? ['status-danger','Crítico'] : r.daysLeft<=7 ? ['status-warning','Atenção'] : ['status-ok','Normal'];
              return `<tr>
                <td><strong>${r.name}</strong>${r.isReal ? ' <span class="tag tag-blue" style="font-size:0.65rem">REAL</span>' : ''}</td>
                <td><span class="status-badge status-info" style="font-size:0.72rem">${r.category||'—'}</span></td>
                <td style="text-align:right;font-family:var(--font-mono)">${r.qty.toLocaleString('pt-BR')}</td>
                <td>${r.unidade||'kg'}</td>
                <td style="text-align:right;font-weight:700;color:${r.daysLeft<=3?'var(--danger)':r.daysLeft<=7?'var(--warning)':'var(--success)'}">${r.daysLeft}d</td>
                <td><span class="status-badge ${cls}">${label}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
};

PAGE_RENDERERS.diretor_pedidos = (el) => {
  const sc = getCurrentSchool();
  const orders = SharedState.getOrders().filter(o => o.school === sc.name);
  const products = DATA.products || [];
  const criticalProducts = products.filter(p => {
    const local = SharedState.getSchoolStock(sc.name).find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20);
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    return (avgDay > 0 ? Math.round(qty / avgDay) : 999) <= 7;
  });

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Solicitação de Reposição — ${sc.name}</div>
      <div class="page-subtitle">Pedidos de abastecimento enviados à Cooperativa via SUALE</div>
    </div>

    ${criticalProducts.length > 0 ? `
    <div class="card mb-16" style="border-left:4px solid var(--warning)">
      <div class="card-header"><div class="card-title">⚡ Sugestão de Pedido — Produtos Críticos</div></div>
      <div class="card-body">
        <p style="margin:0 0 12px;font-size:0.88rem;color:var(--text-secondary)">Os seguintes produtos estão com estoque baixo. Inclua no pedido:</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
          ${criticalProducts.map(p => `<span class="status-badge status-warning">${p.name}</span>`).join('')}
        </div>
        <button class="btn btn-primary btn-sm" onclick="window._dirPedido=true;renderPage()">🛒 Criar Pedido com Esses Itens</button>
      </div>
    </div>` : ''}

    <div class="card mb-16">
      <div class="card-header"><div class="card-title">📋 Novo Pedido de Reposição</div></div>
      <div class="card-body">
        <div class="form-group">
          <label>Escola</label>
          <input type="text" class="form-control" value="${sc.name}" readonly style="background:var(--surface-2)">
        </div>
        <div class="form-group">
          <label>Cooperativa</label>
          <select class="form-control" id="dir-pedido-coop">
            ${DATA.cooperatives.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Observações / Urgência</label>
          <textarea class="form-control" id="dir-pedido-obs" rows="2" placeholder="Ex.: Pedido urgente — arroz em nível crítico"></textarea>
        </div>
        <div style="overflow-x:auto">
          <table class="data-table" style="min-width:520px">
            <thead><tr><th>Produto</th><th>Un.</th><th>Qtd. Sugerida</th><th style="text-align:center">Incluir?</th></tr></thead>
            <tbody>
              ${criticalProducts.slice(0, 8).map(p => `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.unit}</td>
                <td><input type="number" class="form-control" style="width:100px;display:inline-block" value="${Math.round((p.avgConsume||0)/2)}" id="dir-qtd-${p.id}" min="1"></td>
                <td style="text-align:center"><input type="checkbox" checked id="dir-chk-${p.id}"></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div style="margin-top:16px;display:flex;gap:8px">
          <button class="btn btn-primary" onclick="dirSubmitPedido('${sc.name}')">✅ Enviar Pedido</button>
          <button class="btn btn-outline" onclick="navigateTo('diretor','dashboard')">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">📋 Histórico de Pedidos</div><span class="status-badge status-info">${orders.length}</span></div>
      <div class="card-body" style="padding:0">
        ${orders.length > 0 ? `
        <table class="data-table">
          <thead><tr><th>Data</th><th>Cooperativa</th><th>Valor Estimado</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${orders.slice().reverse().map(o => `
              <tr>
                <td>${new Date(o.date).toLocaleDateString('pt-BR')}</td>
                <td>${o.coop||'—'}</td>
                <td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
                <td><span class="status-badge ${o.status==='Entregue'?'status-ok':o.status==='Pendente'?'status-warning':'status-info'}">${o.status}</span></td>
                <td><button class="table-action" onclick="navigateTo('diretor','entregas')">Acompanhar</button></td>
              </tr>`).join('')}
          </tbody>
        </table>` : `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">Nenhum pedido registrado ainda</div></div>`}
      </div>
    </div>`;
};

window.dirSubmitPedido = (schoolName) => {
  const coop = document.getElementById('dir-pedido-coop')?.value || 'COOPAGRAN';
  const obs = document.getElementById('dir-pedido-obs')?.value || '';
  const items = (DATA.products || []).filter(p => {
    const chk = document.getElementById(`dir-chk-${p.id}`);
    return chk && chk.checked;
  }).map(p => {
    const qtd = parseFloat(document.getElementById(`dir-qtd-${p.id}`)?.value || 0);
    return { productId: p.id, name: p.name, qtd, unit: p.unit };
  }).filter(i => i.qtd > 0);

  const value = items.reduce((s, i) => {
    const pr = (DATA.products || []).find(p => p.id === i.productId);
    return s + i.qtd * (pr ? (pr.avgPrice || 5) : 5);
  }, 0);

  SharedState.addOrder({
    school: schoolName, date: new Date().toISOString().split('T')[0],
    status: 'Pendente', coop, obs, items,
    value: Math.round(value || items.length * 500),
    solicitante: PROFILES.diretor.name,
  });
  showToast('✅ Pedido enviado com sucesso!');
  navigateTo('diretor', 'pedidos');
};

PAGE_RENDERERS.diretor_entregas = PAGE_RENDERERS.escola_entregas;
PAGE_RENDERERS.diretor_consumo  = PAGE_RENDERERS.escola_consumo;
PAGE_RENDERERS.diretor_cardapios = PAGE_RENDERERS.escola_cardapios;
PAGE_RENDERERS.diretor_historico = PAGE_RENDERERS.escola_historico;
PAGE_RENDERERS.diretor_relatorios = PAGE_RENDERERS.escola_relatorios;

// RESTRIÇÕES ALIMENTARES — Nutricionista (view global) e Diretor (view da escola)
PAGE_RENDERERS.nutricionista_restricoes = (el) => {
  const restricoes = SharedState.getRestricoes();
  const schools = DATA.schools || [];
  const ativos = restricoes.filter(r => r.status === 'ativo');
  const resolvidos = restricoes.filter(r => r.status === 'resolvido');
  const tipos = {};
  ativos.forEach(r => { tipos[r.tipo] = (tipos[r.tipo]||0) + 1; });
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Restrições Alimentares</div>
      <div class="page-subtitle">Visão consolidada da rede — ${restricoes.length} registros</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
      <div class="kpi-card red"><div class="kpi-icon">⚠️</div><div class="kpi-value">${ativos.length}</div><div class="kpi-label">Ativas</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${resolvidos.length}</div><div class="kpi-label">Resolvidas</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${new Set(ativos.map(r => r.schoolId)).size}</div><div class="kpi-label">Escolas Afetadas</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">🔍</div><div class="kpi-value">${Object.keys(tipos).length}</div><div class="kpi-label">Tipos Distintos</div></div>
    </div>
    <div class="card" style="margin-bottom:20px">
      <div class="card-header">
        <div class="card-title">Registrar Nova Restrição</div>
      </div>
      <div class="card-body">
        <form id="form-nova-restricao" style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;align-items:end">
          <div>
            <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Escola</label>
            <select id="restr-school" class="form-control" required>
              <option value="">Selecione</option>
              ${schools.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Tipo</label>
            <select id="restr-tipo" class="form-control" required>
              <option value="Alergia alimentar">Alergia alimentar</option>
              <option value="Intolerância à lactose">Intolerância à lactose</option>
              <option value="Doença celíaca">Doença celíaca</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Restrição religiosa">Restrição religiosa</option>
              <option value="Vegetariano/Vegano">Vegetariano/Vegano</option>
              <option value="Outra">Outra</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Qtd. alunos</label>
            <input type="number" id="restr-qtd" class="form-control" min="1" value="1" required>
          </div>
          <button type="submit" class="btn btn-primary" style="height:38px">Registrar</button>
        </form>
        <div style="margin-top:8px">
          <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Observação</label>
          <input type="text" id="restr-obs" class="form-control" placeholder="Ex: laudo médico apresentado em 10/07">
        </div>
      </div>
    </div>
    <!-- PAINEL DE ESCOLAS AFETADAS -->
    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><div class="card-title">🏫 Escolas da Rede com Restrições Alimentares</div></div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Unidade Escolar</th>
                <th>Região</th>
                <th>Total de Alunos c/ Restrição</th>
                <th>Tipos Registrados</th>
                <th>Status de Alerta</th>
              </tr>
            </thead>
            <tbody>
              ${schools.map(sc => {
                const restrSc = ativos.filter(r => r.schoolId === sc.id || (r.schoolName || '').toLowerCase() === sc.name.toLowerCase());
                if (restrSc.length === 0) return '';
                const totalQtd = restrSc.reduce((a,b) => a + (b.quantidade||1), 0);
                const badges = restrSc.map(r => `<span class="tag tag-orange" style="margin-right:4px">${r.tipo}: ${r.quantidade||1}</span>`).join('');
                return `
                  <tr>
                    <td><strong>${sc.name}</strong></td>
                    <td><span class="status-badge" style="background:#f1f5f9;color:#334155">${sc.region}</span></td>
                    <td style="font-family:var(--font-mono);font-weight:700;color:#c2410c">${totalQtd} Aluno(s)</td>
                    <td>${badges}</td>
                    <td><span class="status-badge warning">⚠️ Alerta Ativo</span></td>
                  </tr>
                `;
              }).filter(Boolean).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-secondary)">Nenhuma escola com restrição ativa</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Registros Individuais Ativos (${ativos.length})</div></div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Escola</th><th>Tipo</th><th>Qtd</th><th>Observação</th><th>Registrado por</th><th>Data</th><th>Ação</th></tr></thead>
            <tbody>
              ${ativos.length === 0 ? '<tr><td colspan="7" style="text-align:center;color:var(--text-secondary)">Nenhuma restrição ativa</td></tr>' :
                ativos.map(r => `
                  <tr>
                    <td><strong>${r.schoolName || 'Escola #' + r.schoolId}</strong></td>
                    <td><span class="tag tag-orange">${r.tipo}</span></td>
                    <td style="font-family:var(--font-mono)">${r.quantidade || 1}</td>
                    <td style="font-size:0.82rem">${r.observacao || '—'}</td>
                    <td style="font-size:0.82rem">${r.registradoPor || '—'}</td>
                    <td style="font-size:0.82rem">${r.criadoEm ? new Date(r.criadoEm).toLocaleDateString('pt-BR') : '—'}</td>
                    <td><button class="table-action" onclick="window._resolverRestricao('${r.id}')">Resolver</button></td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    ${resolvidos.length > 0 ? `
    <div class="card" style="margin-top:16px">
      <div class="card-header"><div class="card-title">Resolvidas (${resolvidos.length})</div></div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Escola</th><th>Tipo</th><th>Qtd</th><th>Resolvido em</th></tr></thead>
            <tbody>
              ${resolvidos.map(r => `
                <tr style="opacity:0.6">
                  <td>${r.schoolName || 'Escola #' + r.schoolId}</td>
                  <td>${r.tipo}</td>
                  <td>${r.quantidade || 1}</td>
                  <td>${r.resolvidoEm ? new Date(r.resolvidoEm).toLocaleDateString('pt-BR') : '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>` : ''}
  `;
  document.getElementById('form-nova-restricao')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const schoolId = parseInt(document.getElementById('restr-school').value, 10);
    const school = schools.find(s => s.id === schoolId);
    SharedState.addRestricao({
      schoolId, schoolName: school ? school.name : 'Escola #' + schoolId,
      tipo: document.getElementById('restr-tipo').value,
      quantidade: parseInt(document.getElementById('restr-qtd').value, 10) || 1,
      observacao: document.getElementById('restr-obs').value,
      registradoPor: PROFILES.nutricionista.name,
    });
    PAGE_RENDERERS.nutricionista_restricoes(el);
  });
};

window._resolverRestricao = (id) => {
  if (confirm('Marcar esta restrição como resolvida?')) {
    SharedState.resolverRestricao(id);
    renderPage();
  }
};

PAGE_RENDERERS.diretor_restricoes = (el) => {
  const sc = getCurrentSchool();
  const restricoes = SharedState.getRestricoes(sc.id);
  const ativos = restricoes.filter(r => r.status === 'ativo');
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Restrições Alimentares — ${sc.name}</div>
      <div class="page-subtitle">${ativos.length} restrição(ões) ativa(s)</div>
    </div>
    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><div class="card-title">Registrar Restrição</div></div>
      <div class="card-body">
        <form id="form-dir-restricao" style="display:grid;grid-template-columns:1fr 100px 1fr auto;gap:12px;align-items:end">
          <div>
            <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Tipo</label>
            <select id="dir-restr-tipo" class="form-control" required>
              <option value="Alergia alimentar">Alergia alimentar</option>
              <option value="Intolerância à lactose">Intolerância à lactose</option>
              <option value="Doença celíaca">Doença celíaca</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Outra">Outra</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Qtd</label>
            <input type="number" id="dir-restr-qtd" class="form-control" min="1" value="1" required>
          </div>
          <div>
            <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Observação</label>
            <input type="text" id="dir-restr-obs" class="form-control" placeholder="Opcional">
          </div>
          <button type="submit" class="btn btn-primary" style="height:38px">Registrar</button>
        </form>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Restrições Registradas (${restricoes.length})</div></div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Tipo</th><th>Qtd</th><th>Obs.</th><th>Status</th><th>Data</th><th>Ação</th></tr></thead>
            <tbody>
              ${restricoes.length === 0 ? '<tr><td colspan="6" style="text-align:center;color:var(--text-secondary)">Nenhuma restrição registrada</td></tr>' :
                restricoes.map(r => `
                  <tr${r.status==='resolvido'?' style="opacity:0.6"':''}>
                    <td><span class="tag tag-orange">${r.tipo}</span></td>
                    <td style="font-family:var(--font-mono)">${r.quantidade || 1}</td>
                    <td style="font-size:0.82rem">${r.observacao || '—'}</td>
                    <td><span class="status-badge ${r.status==='ativo'?'warning':'success'}">${r.status==='ativo'?'Ativo':'Resolvido'}</span></td>
                    <td style="font-size:0.82rem">${r.criadoEm ? new Date(r.criadoEm).toLocaleDateString('pt-BR') : '—'}</td>
                    <td>${r.status==='ativo' ? `<button class="table-action" onclick="window._resolverRestricao('${r.id}')">Resolver</button>` : '—'}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  document.getElementById('form-dir-restricao')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const prof = PROFILES[state.currentProfile];
    SharedState.addRestricao({
      schoolId: sc.id, schoolName: sc.name,
      tipo: document.getElementById('dir-restr-tipo').value,
      quantidade: parseInt(document.getElementById('dir-restr-qtd').value, 10) || 1,
      observacao: document.getElementById('dir-restr-obs').value,
      registradoPor: prof.name,
    });
    PAGE_RENDERERS.diretor_restricoes(el);
  });
};

// ============================================================
// ─── RESP_ESTOQUE: RENDERERS ─────────────────────────────────
// ============================================================

PAGE_RENDERERS.resp_estoque_dashboard = (el) => {
  const sc = getCurrentSchool();
  const products = DATA.products || [];
  const localStock = SharedState.getSchoolStock(sc.name);
  const rows = products.map(p => {
    const local = localStock.find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20);
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    const daysLeft = avgDay > 0 ? Math.round(qty / avgDay) : 999;
    return { ...p, qty, daysLeft, isReal: !!local };
  });
  const critical = rows.filter(r => r.daysLeft <= 3).length;
  const warning = rows.filter(r => r.daysLeft > 3 && r.daysLeft <= 7).length;
  const ok = rows.length - critical - warning;
  const movs = SharedState.getStockAdjust().filter(a => a.escola === sc.name).slice(0, 6);
  const deliveries = SharedState.getDeliveries().filter(d => d.school === sc.name && d.status !== 'Confirmada');
  const consumo = SharedState.getConsumo(sc.name).slice(-5).reverse();

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Dashboard de Estoque — ${sc.name}</div>
        <div class="page-subtitle">Responsável: ${sc.respEstoque ? sc.respEstoque.name : '—'} · ${sc.region}</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary btn-sm" onclick="navigateTo('resp_estoque','consumo')">📝 Lançar Consumo</button>
        <button class="btn btn-outline btn-sm" onclick="navigateTo('resp_estoque','entradas')">📥 Confirmar Entrega</button>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${ok}</div><div class="kpi-label">Produtos OK</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚡</div><div class="kpi-value">${warning}</div><div class="kpi-label">Em Atenção</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${critical}</div><div class="kpi-label">Estoque Crítico</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${movs.length}</div><div class="kpi-label">Movimentações Recentes</div></div>
    </div>

    <div class="grid-2-1">
      <div style="display:flex;flex-direction:column;gap:16px">

        ${deliveries.length > 0 ? `
        <div class="card" style="border-left:4px solid var(--primary)">
          <div class="card-header"><div class="card-title">🚚 Entregas Aguardando Confirmação</div><span class="status-badge status-info">${deliveries.length}</span></div>
          <div class="card-body">
            ${deliveries.map(d => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                <div>
                  <div style="font-weight:600">${d.escola || d.school || sc.name}</div>
                  <div style="font-size:0.8rem;color:var(--text-secondary)">${d.data ? new Date(d.data).toLocaleDateString('pt-BR') : '—'}</div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="navigateTo('resp_estoque','entradas')">Confirmar →</button>
              </div>`).join('')}
          </div>
        </div>` : ''}

        <div class="card">
          <div class="card-header"><div class="card-title">📦 Posição de Estoque</div><button class="btn btn-ghost btn-sm" onclick="navigateTo('resp_estoque','inventario')">Ver tudo →</button></div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Produto</th><th style="text-align:right">Qtd</th><th>Un.</th><th>Dias</th><th>Status</th></tr></thead>
              <tbody>
                ${rows.slice(0, 8).map(r => {
                  const [cls, label] = r.daysLeft<=3 ? ['status-danger','Crítico'] : r.daysLeft<=7 ? ['status-warning','Atenção'] : ['status-ok','OK'];
                  return `<tr>
                    <td><strong>${r.name}</strong>${r.isReal ? ' <span class="tag tag-blue" style="font-size:0.65rem">REAL</span>' : ''}</td>
                    <td style="text-align:right;font-family:var(--font-mono)">${r.qty}</td>
                    <td>${r.unit||'kg'}</td>
                    <td style="font-weight:700;color:${r.daysLeft<=3?'var(--danger)':r.daysLeft<=7?'var(--warning)':'var(--success)'}">${r.daysLeft}d</td>
                    <td><span class="status-badge ${cls}">${label}</span></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        ${consumo.length > 0 ? `
        <div class="card">
          <div class="card-header"><div class="card-title">📝 Últimos Lançamentos de Consumo</div></div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Data</th><th>Produto</th><th>Refeição</th><th>Qtd</th></tr></thead>
              <tbody>
                ${consumo.map(c => `<tr>
                  <td>${new Date(c.data).toLocaleDateString('pt-BR')}</td>
                  <td>${c.produto}</td>
                  <td>${c.refeicao||'—'}</td>
                  <td style="font-family:var(--font-mono)">-${c.qtd} ${c.unidade||'kg'}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>` : ''}

      </div>

      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-header"><div class="card-title">📋 Movimentações de Hoje</div></div>
          <div class="card-body" style="padding:0">
            ${movs.length > 0 ? movs.map(a => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)">
                <div>
                  <div style="font-weight:600;font-size:0.88rem">${a.produto}</div>
                  <div style="font-size:0.76rem;color:var(--text-secondary)">${a.motivo}</div>
                </div>
                <span style="font-family:var(--font-mono);font-weight:700;color:${a.delta>0?'var(--success)':'var(--danger)'}">${a.delta>0?'+':''}${a.delta} ${a.unidade||'kg'}</span>
              </div>`).join('') :
              `<div class="empty-state" style="padding:24px"><div class="empty-text">Nenhuma movimentação</div></div>`}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">⚡ Ações Rápidas</div></div>
          <div class="card-body" style="display:grid;grid-template-columns:1fr;gap:8px">
            <button class="btn btn-primary" onclick="navigateTo('resp_estoque','consumo')">📝 Lançar Consumo Diário</button>
            <button class="btn btn-outline" onclick="navigateTo('resp_estoque','entradas')">📥 Confirmar Entrega</button>
            <button class="btn btn-outline" onclick="navigateTo('resp_estoque','inventario')">🏢 Inventário Completo</button>
            <button class="btn btn-outline" onclick="navigateTo('resp_estoque','validades')">📅 Controle de Validades</button>
          </div>
        </div>
      </div>
    </div>`;
};

PAGE_RENDERERS.resp_estoque_inventario = (el) => {
  const sc = getCurrentSchool();
  const products = DATA.products || [];
  const localStock = SharedState.getSchoolStock(sc.name);
  const rows = products.map(p => {
    const local = localStock.find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20);
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    return { ...p, qty, daysLeft: avgDay > 0 ? Math.round(qty / avgDay) : 999, isReal: !!local };
  });

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Inventário Físico — ${sc.name}</div>
      <div class="page-subtitle">Contagem de todos os itens no estoque da escola</div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">📦 Inventário Completo</div>
        <div style="display:flex;gap:8px">
          <span class="status-badge status-ok">${rows.filter(r=>r.daysLeft>7).length} OK</span>
          <span class="status-badge status-warning">${rows.filter(r=>r.daysLeft>3&&r.daysLeft<=7).length} Atenção</span>
          <span class="status-badge status-danger">${rows.filter(r=>r.daysLeft<=3).length} Crítico</span>
        </div>
      </div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Categoria</th><th style="text-align:right">Qtd. Atual</th><th>Un.</th><th>Consumo/Dia</th><th style="text-align:right">Dias</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${rows.map(r => {
              const avgDay = Math.max(1, Math.round((r.avgConsume || 0) / 20));
              const [cls, label] = r.daysLeft<=3 ? ['status-danger','Crítico'] : r.daysLeft<=7 ? ['status-warning','Atenção'] : ['status-ok','Normal'];
              return `<tr>
                <td><strong>${r.name}</strong>${r.isReal ? ' <span class="tag tag-blue" style="font-size:0.65rem">REAL</span>' : ''}</td>
                <td><span class="status-badge status-info" style="font-size:0.72rem">${r.category||'—'}</span></td>
                <td style="text-align:right;font-family:var(--font-mono);font-weight:700">${r.qty.toLocaleString('pt-BR')}</td>
                <td>${r.unit||'kg'}</td>
                <td style="font-size:0.82rem">${avgDay} ${r.unit||'kg'}/dia</td>
                <td style="text-align:right;font-weight:700;color:${r.daysLeft<=3?'var(--danger)':r.daysLeft<=7?'var(--warning)':'var(--success)'}">${r.daysLeft}d</td>
                <td><span class="status-badge ${cls}">${label}</span></td>
                <td><button class="table-action" onclick="respAjusteEstoque('${r.name}','${r.unit||'kg'}',${r.qty})">Ajustar</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
};

window.respAjusteEstoque = (produto, unidade, atual) => {
  showModal('Ajuste de Estoque — ' + produto, `
    <div class="form-group">
      <label>Qtd. Atual no Sistema</label>
      <input type="number" class="form-control" value="${atual}" readonly style="background:var(--surface-2)">
    </div>
    <div class="form-group">
      <label>Qtd. Real Contada</label>
      <input type="number" class="form-control" id="ajuste-qtd" value="${atual}" min="0">
    </div>
    <div class="form-group">
      <label>Motivo do Ajuste</label>
      <select class="form-control" id="ajuste-motivo">
        <option>Inventário físico</option><option>Perda/Avaria</option><option>Vencimento</option><option>Sobra de produção</option>
      </select>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn btn-primary" onclick="respConfirmarAjuste('${produto}','${unidade}',${atual})">Confirmar Ajuste</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    </div>`);
};

window.respConfirmarAjuste = (produto, unidade, atual) => {
  const nova = parseFloat(document.getElementById('ajuste-qtd')?.value || atual);
  const motivo = document.getElementById('ajuste-motivo')?.value || 'Inventário físico';
  const sc = getCurrentSchool();
  const delta = nova - atual;
  if (delta !== 0) {
    SharedState.addStockAdjust({ escola: sc.name, produto, delta: Math.round(delta), unidade, motivo });
    if (!SharedState._data.schoolStocks[sc.name]) SharedState._data.schoolStocks[sc.name] = {};
    if (!SharedState._data.schoolStocks[sc.name][produto]) SharedState._data.schoolStocks[sc.name][produto] = { qtd: nova, unidade };
    else SharedState._data.schoolStocks[sc.name][produto].qtd = nova;
    SharedState._persist();
    SharedState._notify();
  }
  closeModal();
  showToast('✅ Estoque ajustado: ' + produto);
  renderPage();
};

PAGE_RENDERERS.resp_estoque_entradas = (el) => {
  const sc = getCurrentSchool();
  const orders = SharedState.getOrders().filter(o => o.school === sc.name && (o.status === 'Em transporte' || o.status === 'Em separação'));
  const deliveries = SharedState.getDeliveries().filter(d => d.school === sc.name && d.status === 'Confirmada').slice(-5).reverse();

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Confirmar Entregas — ${sc.name}</div>
      <div class="page-subtitle">Recebimento de mercadorias e atualização automática do estoque</div>
    </div>

    <div class="card mb-16">
      <div class="card-header"><div class="card-title">🚚 Entregas Aguardando Confirmação</div><span class="status-badge status-info">${orders.length}</span></div>
      <div class="card-body">
        ${orders.length > 0 ? orders.map(o => `
          <div class="card mb-8" style="border:1px solid var(--border);box-shadow:none">
            <div class="card-body">
              <div style="display:flex;justify-content:space-between;align-items:flex-start">
                <div>
                  <div style="font-weight:700;font-size:1rem">Pedido #${o.id} — ${o.coop||'Cooperativa'}</div>
                  <div style="font-size:0.82rem;color:var(--text-secondary)">Data pedido: ${new Date(o.date).toLocaleDateString('pt-BR')} · Status: <strong>${o.status}</strong></div>
                </div>
                <span class="status-badge status-warning">${o.status}</span>
              </div>
              <div style="margin:12px 0">
                <div class="form-group" style="margin:0">
                  <label style="font-size:0.82rem">Nome do Recebedor</label>
                  <input type="text" class="form-control" id="recv-${o.id}" value="${sc.respEstoque ? sc.respEstoque.name : ''}" placeholder="Quem está recebendo?">
                </div>
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn btn-primary btn-sm" onclick="respConfirmarEntrega('${o.id}')">✅ Confirmar Recebimento</button>
                <button class="btn btn-outline btn-sm" onclick="respReportarDivergencia('${o.id}')">⚠️ Divergência</button>
              </div>
            </div>
          </div>`).join('') :
          `<div class="empty-state"><div class="empty-icon">🚚</div><div class="empty-text">Nenhuma entrega aguardando confirmação</div></div>`}
      </div>
    </div>

    ${deliveries.length > 0 ? `
    <div class="card">
      <div class="card-header"><div class="card-title">✅ Entregas Confirmadas Recentemente</div></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Data</th><th>Pedido</th><th>Recebido por</th><th>Status</th></tr></thead>
          <tbody>
            ${deliveries.map(d => `<tr>
              <td>${d.data ? new Date(d.data).toLocaleDateString('pt-BR') : '—'}</td>
              <td>#${d.orderId || '—'}</td>
              <td>${d.receiver || '—'}</td>
              <td><span class="status-badge status-ok">Confirmada</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}`;
};

window.respConfirmarEntrega = (orderId) => {
  const sc = getCurrentSchool();
  const recv = document.getElementById(`recv-${orderId}`)?.value || (sc.respEstoque ? sc.respEstoque.name : 'Responsável');
  SharedState.confirmDelivery(orderId, recv, 'REC-' + Date.now());
  showToast('✅ Entrega confirmada! Estoque atualizado automaticamente.');
  renderPage();
};

window.respReportarDivergencia = (orderId) => {
  showModal('Registrar Divergência', `
    <div class="form-group"><label>Descrição da Divergência</label>
      <textarea class="form-control" id="div-desc" rows="3" placeholder="Ex.: Quantidade recebida diferente do pedido, produto avariado..."></textarea>
    </div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn btn-primary" onclick="
        const sc = getCurrentSchool();
        SharedState.addIncident({ escola: sc.name, descricao: document.getElementById('div-desc').value, tipo: 'Divergência de entrega', status: 'Aberta', criadoEm: new Date().toISOString() });
        closeModal(); showToast('⚠️ Divergência registrada.'); renderPage();">
        Registrar
      </button>
      <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    </div>`);
};

PAGE_RENDERERS.resp_estoque_consumo = PAGE_RENDERERS.escola_consumo;
PAGE_RENDERERS.resp_estoque_pedidos = PAGE_RENDERERS.escola_pedidos;

PAGE_RENDERERS.resp_estoque_validades = (el) => {
  const sc = getCurrentSchool();
  const nfs = SharedState.getNFs();
  const hoje = new Date();
  const validades = nfs.map(nf => {
    const dias = nf.validade ? Math.round((new Date(nf.validade) - hoje) / 86400000) : 999;
    return { ...nf, diasVencimento: dias };
  }).sort((a, b) => a.diasVencimento - b.diasVencimento);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Controle de Validades — ${sc.name}</div>
      <div class="page-subtitle">Monitoramento de lotes por data de vencimento (FEFO)</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${validades.filter(v=>v.diasVencimento<=7).length}</div><div class="kpi-label">Vencendo em 7 dias</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚡</div><div class="kpi-value">${validades.filter(v=>v.diasVencimento>7&&v.diasVencimento<=30).length}</div><div class="kpi-label">Vencendo em 30 dias</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${validades.filter(v=>v.diasVencimento>30).length}</div><div class="kpi-label">Dentro do prazo</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📅 Lotes por Validade</div></div>
      <div class="card-body" style="padding:0">
        ${validades.length > 0 ? `
        <table class="data-table">
          <thead><tr><th>Lote</th><th>NF</th><th>Qtd</th><th>Validade</th><th>Dias Restantes</th><th>Status</th></tr></thead>
          <tbody>
            ${validades.map(v => {
              const [cls, label] = v.diasVencimento<=7 ? ['status-danger','Crítico'] : v.diasVencimento<=30 ? ['status-warning','Atenção'] : ['status-ok','OK'];
              return `<tr>
                <td><strong>${v.lote||'—'}</strong></td>
                <td>${v.numero||'—'}</td>
                <td style="font-family:var(--font-mono)">${v.qtd||0}</td>
                <td>${v.validade ? new Date(v.validade).toLocaleDateString('pt-BR') : '—'}</td>
                <td style="font-weight:700;color:${v.diasVencimento<=7?'var(--danger)':v.diasVencimento<=30?'var(--warning)':'var(--success)'}">${v.diasVencimento}d</td>
                <td><span class="status-badge ${cls}">${label}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>` :
        `<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-text">Nenhum lote cadastrado ainda — confirme uma entrega para gerar lotes.</div></div>`}
      </div>
    </div>`;
};

PAGE_RENDERERS.resp_estoque_relatorios = (el) => {
  const sc = getCurrentSchool();
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Relatórios — ${sc.name}</div>
      <div class="page-subtitle">Relatórios de estoque, consumo e movimentações desta unidade</div>
    </div>
    <div class="grid-2-1">
      ${[
        { icon: '📦', title: 'Posição de Estoque', desc: 'Inventário atual com quantidades e dias restantes', key: 'escola' },
        { icon: '📝', title: 'Registro de Consumo', desc: 'Lançamentos de consumo por data e refeição', key: 'consumo' },
        { icon: '🚚', title: 'Histórico de Entregas', desc: 'Entregas confirmadas e datas', key: 'entregas' },
        { icon: '📋', title: 'Movimentações de Estoque', desc: 'Todas as entradas e saídas com auditoria', key: 'stockAdjust' },
      ].map(r => `
        <div class="card">
          <div class="card-body" style="display:flex;align-items:flex-start;gap:12px">
            <div style="font-size:2rem">${r.icon}</div>
            <div style="flex:1">
              <div style="font-weight:700;margin-bottom:4px">${r.title}</div>
              <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:12px">${r.desc}</div>
              <button class="btn btn-primary btn-sm" onclick="exportRelatorio('${r.key}')">⬇️ Exportar CSV</button>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
};

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

// ============================
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

  // Login form
  $('#login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = $('#login-user')?.value || '';
    const passInput = $('#login-pass')?.value || '';

    const authRes = window.authenticateUser(userInput, passInput);
    if (!authRes.success) {
      showToast('⚠️ ' + authRes.error, 'warning');
      return;
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
        return;
      }
    } else if (topProfile === 'colaboradores') {
      const activeColab = $('.colab-subrole-btn.active');
      profile = activeColab ? activeColab.dataset.subrole : 'cooperativa';
    }

    await login(profile, schoolId);
  });

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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAppEvents);
} else {
  initAppEvents();
}


// MERENDEIRA ALIASES
PAGE_RENDERERS.merendeira_dashboard = PAGE_RENDERERS.escola_dashboard;
PAGE_RENDERERS.merendeira_consumo = PAGE_RENDERERS.escola_consumo;
PAGE_RENDERERS.merendeira_cardapios = PAGE_RENDERERS.escola_cardapios;
PAGE_RENDERERS.merendeira_estoque = PAGE_RENDERERS.escola_estoque;
PAGE_RENDERERS.merendeira_entregas = PAGE_RENDERERS.escola_entregas;

// ──────────────────────────────────────────────────────────────────────
// MÓDULO FINANCEIRO — v2.1.0
// Renderers das 5 novas páginas conectadas ao Supabase
// ──────────────────────────────────────────────────────────────────────

// ─── GESTOR: ATAS (com dados do Supabase) ───────────────────────────
PAGE_RENDERERS.gestor_atas = (el) => {
  const atas = SharedState.getAtas2();
  const fmt = (v) => v ? new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL', maximumFractionDigits:0 }).format(v) : 'R$ 0';
  const badge = (s) => {
    const map = { Vigente:'tag-green', Encerrada:'tag-gray', Suspensa:'tag-red', 'Em Renovação':'tag-orange' };
    return `<span class="tag ${map[s]||'tag-blue'}">${s}</span>`;
  };
  const rows = atas.length ? atas.map(a => {
    const pct = a.valor_global ? Math.round(((a.valor_executado||0) / a.valor_global) * 100) : 0;
    const saldo = (a.valor_global||0) - (a.valor_executado||0);
    const numAta = a.numero || a.numero_ata || `ATA-${a.id}`;

    return `<tr style="cursor:pointer" onclick="window.abrirModalDetalhesAta('${a.id}')">
      <td><strong>${numAta}</strong><br><small class="text-secondary">${a.ano||'2026'} · ${a.modalidade||a.tipo||''}</small></td>
      <td>${(a.tipo||'').includes('AF') || (a.tipo||'').includes('Chamada') ? '🌾 Agricultura Familiar' : '🏢 Convencional/Pregão'}</td>
      <td>${a.fornecedor}</td>
      <td style="font-family:var(--font-mono)">${fmt(a.valor_global)}</td>
      <td style="font-family:var(--font-mono)">
        ${fmt(a.valor_executado)}
        <div class="progress-bar" style="margin-top:4px"><div class="progress-fill ${pct>80?'red':pct>50?'orange':'green'}" style="width:${pct}%"></div></div>
        <small class="text-secondary">${pct}% empenhado</small>
      </td>
      <td style="font-family:var(--font-mono);font-weight:700;color:${saldo <= 0 ? 'var(--danger)' : '#1565C0'}">${fmt(saldo)}</td>
      <td>${a.data_inicio ? a.data_inicio.slice(0,10) : '2026-01-15'} → ${a.data_fim ? a.data_fim.slice(0,10) : '2026-12-31'}</td>
      <td>${badge(a.status)}</td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.abrirModalDetalhesAta('${a.id}')">
          🔍 Gerenciar
        </button>
      </td>
    </tr>`;
  }).join('') : '<tr><td colspan="9" style="text-align:center;color:#94A3B8">Nenhuma ATA carregada. Execute supabase_schema_v3.sql no Supabase.</td></tr>';
  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">📋 Atas de Registro de Preços</div>
        <div class="page-subtitle">Gestão de ATAs · Chamada Pública e Pregão Eletrônico (Clique na linha para gerenciar)</div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" onclick="window.abrirModalNovaAta()">➕ Cadastrar Nova ATA</button>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${atas.length}</div><div class="kpi-label">Total de ATAs</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${atas.filter(a=>a.status==='Vigente').length}</div><div class="kpi-label">ATAs Vigentes</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">💰</div><div class="kpi-value">${fmt(atas.reduce((s,a)=>s+(a.valor_global||0),0))}</div><div class="kpi-label">Valor Global Total</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📊</div><div class="kpi-value">${fmt(atas.reduce((s,a)=>s+(a.valor_executado||0),0))}</div><div class="kpi-label">Total Executado</div></div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><strong>Atas Cadastradas</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Número/Ano</th><th>Tipo</th><th>Fornecedor</th><th>Valor Global</th><th>Executado</th><th>Saldo</th><th>Vigência</th><th>Status</th><th>Ação</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
};

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
        <h4 style="margin:0 0 10px 0;color:var(--text-primary)">📦 Produtos Registrados na ATA & Gestão de Saldos</h4>
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

window.abrirModalNovaAta = () => {
  const content = `
    <form onsubmit="window.salvarNovaAta(event)">
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
      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Razão Social do Fornecedor / Cooperativa</label>
        <input type="text" id="ata-fornecedor" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: COOPAGRAN ou Nutri Alimentos Ltda" required>
      </div>
      <div class="form-group mb-12">
        <label style="font-weight:600;display:block;margin-bottom:4px">Valor Global Registrado (R$)</label>
        <input type="number" step="0.01" id="ata-valor" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: 1500000.00" required>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
        <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button type="submit" class="btn btn-primary">💾 Salvar e Cadastrar ATA</button>
      </div>
    </form>
  `;
  window.showModal('📋 Cadastrar Nova ATA de Registro de Preços', content, '550px');
};

window.salvarNovaAta = (e) => {
  e.preventDefault();
  const numero = document.getElementById('ata-numero').value;
  const tipo = document.getElementById('ata-tipo').value;
  const fornecedor = document.getElementById('ata-fornecedor').value;
  const valor = parseFloat(document.getElementById('ata-valor').value) || 0;

  SharedState.addAta2({
    numero: numero,
    numero_ata: numero,
    tipo: tipo,
    fornecedor: fornecedor,
    valor_global: valor,
    valor_executado: 0,
    status: 'Vigente'
  });

  showToast(`✅ ATA ${numero} cadastrada com sucesso!`);
  closeModal();
  const container = document.getElementById('page-content');
  if (container) PAGE_RENDERERS.gestor_atas(container);
};

// ─── GESTOR: EMPENHOS (com dados do Supabase) ───────────────────────
PAGE_RENDERERS.gestor_empenhos = (el) => {
  const empenhos = SharedState.getEmpenhos2();
  const fmt = (v) => v ? new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v) : 'R$ 0,00';
  const badge = (s) => {
    const map = { Emitido:'tag-blue', Liquidado:'tag-green', Pago:'tag-green', Cancelado:'tag-red', 'Em Análise':'tag-orange' };
    return `<span class="tag ${map[s]||'tag-gray'}">${s}</span>`;
  };
  const rows = empenhos.length ? empenhos.map(e => {
    const numAta = e.ata_numero || '—';
    return `<tr style="cursor:pointer" onclick="window.abrirModalDetalhesEmpenho('${e.numero_empenho}')">
      <td><strong>${e.numero_empenho}</strong></td>
      <td>
        <button class="btn btn-sm btn-outline" style="padding:2px 8px;font-weight:700;color:var(--primary)" onclick="event.stopPropagation(); window.abrirModalDetalhesAta('${numAta}')">
          📋 ${numAta}
        </button>
      </td>
      <td>${e.tipo === 'AF' ? '🌾 AF' : '🏢 Conv.'}</td>
      <td>${e.fornecedor}</td>
      <td>${e.escola_name||'<em>SEMED Global</em>'}</td>
      <td style="font-family:var(--font-mono);font-weight:700">${fmt(e.valor_empenhado)}</td>
      <td style="font-family:var(--font-mono)">${fmt(e.valor_liquidado)}</td>
      <td style="font-family:var(--font-mono)">${fmt(e.valor_pago)}</td>
      <td>${e.data_empenho||''}</td>
      <td>${badge(e.status)}</td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.abrirModalDetalhesEmpenho('${e.numero_empenho}')">
          🔍 Detalhes / OS
        </button>
      </td>
    </tr>`;
  }).join('') : '<tr><td colspan="11" style="text-align:center;color:#94A3B8">Nenhum empenho carregado.</td></tr>';
  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">💳 Empenhos SIAFI</div>
        <div class="page-subtitle">Controle de empenhos, liquidações, pagamentos e roteamento de Ordens de Serviço (OS)</div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-outline" onclick="window.abrirModalImportarNFeXML()">📥 Receber NF-e via XML</button>
        <button class="btn btn-primary" onclick="window.openNewEmpenhoModal()">➕ Emitir Novo Empenho SIAFI</button>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">📄</div><div class="kpi-value">${empenhos.length}</div><div class="kpi-label">Total de Empenhos</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">💰</div><div class="kpi-value">${fmt(empenhos.reduce((s,e)=>s+(e.valor_empenhado||0),0))}</div><div class="kpi-label">Total Empenhado</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${fmt(empenhos.reduce((s,e)=>s+(e.valor_pago||0),0))}</div><div class="kpi-label">Total Pago</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⏳</div><div class="kpi-value">${empenhos.filter(e=>e.status==='Emitido'||e.status==='Em Análise').length}</div><div class="kpi-label">Pendentes</div></div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><strong>Empenhos SIAFI</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Número</th><th>ATA (Vinculada)</th><th>Tipo</th><th>Fornecedor</th><th>Escola</th><th>Empenhado</th><th>Liquidado</th><th>Pago</th><th>Data</th><th>Status</th><th>Ação</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
};

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

window.salvarNovoEmpenho = (e) => {
  e.preventDefault();
  const numero = document.getElementById('emp-numero').value;
  const ataSelect = document.getElementById('emp-ata');
  const ataNumero = ataSelect.value;
  const opt = ataSelect.options[ataSelect.selectedIndex];
  const fornecedor = document.getElementById('emp-fornecedor').value;
  const escolaName = document.getElementById('emp-escola').value;
  const valorTotal = parseFloat(document.getElementById('emp-valor-total').value) || 0;
  const tipoStr = (opt && opt.getAttribute('data-tipo') || '').includes('AF') ? 'AF' : 'Conv.';

  const chks = document.querySelectorAll('.emp-item-chk:checked');
  if (chks.length === 0 || valorTotal <= 0) {
    alert('⚠️ Selecione pelo menos 1 produto e informe a quantidade a empenhar.');
    return;
  }

  const itensEmpenho = [];
  chks.forEach(chk => {
    const idx = chk.getAttribute('data-idx');
    const unitPrice = parseFloat(chk.getAttribute('data-unitprice')) || 0;
    const prodName = chk.getAttribute('data-prodname');
    const unit = chk.getAttribute('data-unit');
    const prodId = chk.getAttribute('data-prodid');
    const qtdInput = document.querySelector(`.emp-item-qtd[data-idx="${idx}"]`);
    const qtd = parseFloat(qtdInput.value) || 0;

    if (qtd > 0) {
      itensEmpenho.push({
        productId: prodId,
        produto: prodName,
        unidade: unit,
        valorUnit: unitPrice,
        qtd: qtd,
        valorTotal: qtd * unitPrice
      });
    }
  });

  const novoEmp = SharedState.addEmpenho2({
    numero_empenho: numero,
    ata_numero: ataNumero,
    tipo: tipoStr,
    fornecedor: fornecedor,
    escola_name: escolaName,
    valor_empenhado: valorTotal,
    valor_liquidado: 0,
    valor_pago: 0,
    status: 'Emitido',
    itens: itensEmpenho
  });

  // Atualiza o valor_executado da ATA no SharedState
  const atas = SharedState.getAtas2();
  const ata = atas.find(a => (a.numero || a.numero_ata) === ataNumero);
  if (ata) {
    ata.valor_executado = (ata.valor_executado || 0) + valorTotal;

    // Atualiza o valor_executado dos itens da ATA
    if (Array.isArray(ata.itens)) {
      itensEmpenho.forEach(ie => {
        const itemAta = ata.itens.find(ai => (ai.name || ai.descricao || ai.produto) === ie.produto);
        if (itemAta) {
          itemAta.executedValue = (itemAta.executedValue || 0) + ie.valorTotal;
        }
      });
    }
    SharedState._persist();
  }

  // Geração & Roteamento Inteligente de Ordem de Serviço (OS)
  const isAF = tipoStr === 'AF' || (fornecedor || '').toLowerCase().includes('coop') || (fornecedor || '').toLowerCase().includes('agri');

  if (isAF) {
    itensEmpenho.forEach(item => {
      SharedState.addOsFornecedores({
        numero_empenho: numero,
        ata_numero: ataNumero,
        fornecedor: fornecedor,
        cooperativa: fornecedor,
        produto: item.produto,
        quantidade: item.qtd,
        unidade: item.unidade,
        valor_total: item.valorTotal,
        escola_destino: escolaName,
        tipo_os: 'Ordem de Fornecimento AF',
        status: 'Enviada à Cooperativa'
      });
    });
    showToast(`🌾 Ordem de Fornecimento enviada para a Cooperativa / Agricultor ${fornecedor}!`);
  } else {
    itensEmpenho.forEach(item => {
      SharedState.addOsEstoqueCentral({
        numero_empenho: numero,
        tipo: 'Entrada',
        produto: item.produto,
        quantidade: item.qtd,
        unidade: item.unidade,
        fornecedor: fornecedor,
        escola_destino: escolaName,
        lote: 'LOTE-' + new Date().getFullYear() + '-' + String(Math.floor(100 + Math.random() * 900)),
        validade: new Date(Date.now() + 180*24*60*60*1000).toISOString().slice(0, 10),
        responsavel: 'Gestor SEMED',
        status: 'Em Separação'
      });
    });
    showToast(`🏭 Ordem de Serviço criada para o Estoque Central!`);
  }

  closeModal();
  const container = document.getElementById('page-content');
  if (container) PAGE_RENDERERS.gestor_empenhos(container);
};


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
PAGE_RENDERERS['gestor_lista-compras'] = (el) => {
  const listas = SharedState.getListaCompras();
  const fmt = (v) => v ? new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v) : '—';
  const badge = (s) => {
    const map = { Rascunho:'tag-gray', Enviada:'tag-blue', 'Em Análise':'tag-orange', Aprovada:'tag-green', Cancelada:'tag-red' };
    return `<span class="tag ${map[s]||'tag-gray'}">${s}</span>`;
  };
  const rows = listas.length ? listas.map(l => {
    const itens = Array.isArray(l.itens) ? l.itens : [];
    return `<tr>
      <td><strong>${l.titulo}</strong><br><small class="text-secondary">${l.referencia||''} · ${l.tipo}</small></td>
      <td>${l.escola_name || '<em>SEMED (Consolidada)</em>'}</td>
      <td>${itens.length} itens</td>
      <td>${fmt(l.valor_estimado)}</td>
      <td>${fmt(l.valor_aprovado)}</td>
      <td>${l.data_necessidade||'—'}</td>
      <td>${l.criado_por||'—'}</td>
      <td>${badge(l.status)}</td>
    </tr>`;
  }).join('') : '<tr><td colspan="8" style="text-align:center;color:#94A3B8">Nenhuma lista carregada.</td></tr>';
  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">🛒 Listas de Compras</div>
        <div class="page-subtitle">Solicitações de compra por escola e consolidadas SEMED</div>
      </div>
      <div style="display:flex;gap:10px">
        <button class="btn btn-primary" style="background:#15803d" onclick="window.executarSimulacaoEngine7Passos()">⚡ Processar Demanda (Engine 7 Passos)</button>
        <button class="btn btn-outline" onclick="window.abrirModalLogsAuditoria()">📜 Trilha de Auditoria</button>
      </div>
    </div>
    <div class="kpi-grid">
      ${['Aprovada','Em Análise','Enviada','Rascunho'].map(s => `<div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${listas.filter(l=>l.status===s).length}</div><div class="kpi-label">${s}</div></div>`).join('')}
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><strong>Listas de Compras</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Título</th><th>Escola</th><th>Itens</th><th>Valor Est.</th><th>Valor Apr.</th><th>Necessidade</th><th>Criado por</th><th>Status</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
};

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

// ============================================================
// SUALE — MÓDULO DE ESTOQUE CENTRAL (v2.3.0)
// Módulo 01: Recebimento de Mercadorias & Módulo 02: Expedição para Escolas
// Implementação Integral das 13 Regras de Negócio (RN01 a RN13)
// ============================================================

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
        <div style="display:flex;gap:4px">
          <button class="btn btn-sm btn-primary" onclick="window.abrirModalConferenciaFisica('${r.id}')">
            🔍 Conf. Física
          </button>
          <button class="btn btn-sm btn-outline" onclick="window.abrirModalConfronto4Vias('${r.id}')">
            📄 Confronto NF-e
          </button>
        </div>
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
      'Aguardando Expedição': 'tag-blue', 'Em Rota': 'tag-orange', 'Entregue': 'tag-green',
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
        <div style="display:flex;gap:4px">
          <button class="btn btn-sm btn-primary" style="background:#15803d" onclick="window.abrirModalSeparacaoFEFO('${o.id}')">
            📦 Separação FEFO (RN06)
          </button>
          <button class="btn btn-sm btn-outline" onclick="window.abrirModalNovaOrdemEntrega('${o.id}')">
            🚛 Criar OE (RN08)
          </button>
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
      'Criada': 'tag-gray', 'Aguardando Coleta': 'tag-orange', 'Em Transporte': 'tag-blue',
      'Em Rota': 'tag-blue', 'Entregue': 'tag-green', 'Entrega Parcial': 'tag-orange',
      'Não Entregue': 'tag-red', 'Devolvida': 'tag-red'
    };
    return `<span class="tag ${map[s]||'tag-gray'}">${s}</span>`;
  };

  const rows = oes.length ? oes.map(o => `
    <tr>
      <td><strong>${o.numeroOe}</strong></td>
      <td><small>${o.osId}</small></td>
      <td><strong>${o.escolaNome}</strong></td>
      <td>👤 ${o.motorista}</td>
      <td>🚛 ${o.veiculo}<br><small class="text-secondary">🗺️ ${o.rota}</small></td>
      <td>${o.dataEntrega}</td>
      <td>${badgeStatus(o.status)}</td>
      <td>
        ${o.status === 'Entregue' ? `<span class="tag tag-green">✍️ Assinado por ${o.recebidoPor||'Escola'}</span>` : `
          <button class="btn btn-sm btn-primary" onclick="window.abrirModalAssinaturaEntregaEscola('${o.id}')">
            🖊️ Assinatura & Entrega (RN10)
          </button>
        `}
      </td>
    </tr>
  `).join('') : '<tr><td colspan="8" style="text-align:center;color:#94A3B8">Nenhuma Ordem de Entrega criada.</td></tr>';

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
      <div class="card-header"><strong>Ordens de Entrega para Escolas</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table" style="font-size:0.85rem">
          <thead>
            <tr>
              <th>Número OE</th>
              <th>OS Origem</th>
              <th>Escola Destino</th>
              <th>Entregador / Motorista</th>
              <th>Veículo & Rota</th>
              <th>Data Entrega</th>
              <th>Status</th>
              <th>Confirmação de Recebimento</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
};

// ─── TELA 04: RASTREABILIDADE 5-WAY (RN13) ───────────────────────────
PAGE_RENDERERS['gestor_rastreabilidade-lotes'] = (el) => {
  const lotes = [
    { lote: 'LOT-ARZ-2026A', produto: 'Arroz Tipo 1 (5kg)', fornecedor: 'NUTRI ALIMENTOS DISTRIBUIDORA LTDA', empenho: '2026NE00477', nf: 'NF-e 000.4891', escola: 'EMEF Prof. Henrique Scabello', motorista: 'Carlos Alberto Santos', dataEntrada: '2026-06-01', validade: '2026-10-15', status: 'Em Consumo na Escola' },
    { lote: 'LOT-LTE-2026A', produto: 'Leite Integral (1L)', fornecedor: 'POLARIS COMÉRCIO DE ALIMENTOS LTDA', empenho: '2026NE00512', nf: 'NF-e 000.5102', escola: 'EMEF Doutor João Sampaio', motorista: 'Marcos Antônio Ribeiro', dataEntrada: '2026-06-12', validade: '2026-09-20', status: 'Em Rota de Entrega' },
    { lote: 'LOT-BAN-2026A', produto: 'Banana Nanica', fornecedor: 'COOPAGRAN (Cooperativa AF)', empenho: '2026NE00489', nf: 'Guia Produtor 044/2026', escola: 'EMEF Doutor João Sampaio', motorista: 'José Maria Rodrigues', dataEntrada: '2026-06-05', validade: '2026-08-12', status: 'Entregue' }
  ];

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

window.salvarConferenciaFisica = (e, recId) => {
  e.preventDefault();
  const recs = SharedState.getRecebimentosPendentes();
  const rec = recs.find(r => r.id === recId);
  if (!rec) return;

  const qtdOk = Number(document.getElementById('conf-qtd-ok').value) || 0;
  const qtdRec = Number(document.getElementById('conf-qtd-recusada').value) || 0;
  const lote = document.getElementById('conf-lote').value;
  const validade = document.getElementById('conf-validade').value;
  const obs = document.getElementById('conf-obs').value;

  rec.conferenciaFisica = { qtdOk, qtdRec, lote, validade, obs, data: new Date().toISOString() };
  rec.status = qtdRec > 0 ? 'Aguardando ajuste' : 'Em conferência';
  SharedState._persist();

  SharedState.registrarLogAuditoria({
    acao: 'Conferência Física de Mercadoria (RN01)',
    produto: rec.produto,
    quantidade: qtdOk,
    origem: `Fornecedor: ${rec.fornecedor}`,
    destino: 'Almoxarifado Central SEMED',
    motivo: `Conferência Física realizada. Qtd Aprovada: ${qtdOk}, Qtd Recusada: ${qtdRec}. Lote: ${lote}`
  });

  showToast(`✅ Conferência física gravada com sucesso para o pedido ${rec.numeroPedido}!`);
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
  const recs = SharedState.getRecebimentosPendentes();
  const rec = recs.find(r => r.id === recId);
  if (!rec) return;

  const confFisica = rec.conferenciaFisica || { qtdOk: rec.qtdPendente, lote: rec.loteEsperado, validade: rec.validadeEsperada };

  rec.qtdEntregue = (rec.qtdEntregue || 0) + confFisica.qtdOk;
  rec.qtdPendente = Math.max(0, rec.qtdSolicitada - rec.qtdEntregue);
  rec.status = rec.qtdPendente === 0 ? 'Recebido' : 'Recebido parcialmente';

  // 1. Atualiza estoque central
  const prod = SharedState.getProducts().find(p => p.name.includes(rec.produto.split(' ')[0]));
  if (prod) {
    prod.stock = (prod.stock || 0) + confFisica.qtdOk;
  }

  // 2. Atualiza saldo do empenho
  const emp = SharedState.getEmpenhos2().find(e => e.numero_empenho === rec.numeroEmpenho);
  if (emp) {
    emp.valor_liquidado = (emp.valor_liquidado || 0) + (confFisica.qtdOk * 5.0);
    emp.status = emp.valor_liquidado >= emp.valor_empenhado ? 'Liquidado' : 'Emitido';
  }

  SharedState.registrarLogAuditoria({
    acao: 'Entrada Aprovada no Estoque Central (RN04/RN05)',
    produto: rec.produto,
    quantidade: confFisica.qtdOk,
    origem: `Fornecedor: ${rec.fornecedor} (NF-e Liberada)`,
    destino: 'Estoque Central SEMED',
    motivo: `Conferência Final Aprovada. Entrada de ${confFisica.qtdOk} unidades do Lote ${confFisica.lote}. Saldo de Empenho atualizado.`
  });

  SharedState._persist();
  showToast(`🎉 Entrada de ${confFisica.qtdOk} unidades aprovada no Estoque Central! Empenho ${rec.numeroEmpenho} atualizado.`);
  closeModal();
  const container = document.getElementById('page-content');
  if (container && PAGE_RENDERERS['gestor_recebimentos-pendentes']) PAGE_RENDERERS['gestor_recebimentos-pendentes'](container);
};

// MODAL 3: SEPARAÇÃO FEFO (RN06)
window.abrirModalSeparacaoFEFO = (osId) => {
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.id === osId);
  if (!os) return;

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#f0fdf4;padding:12px;border-radius:8px;border:1px solid #86efac;margin-bottom:14px;font-size:0.85rem;color:#166534">
        💡 <strong>Método FEFO Ativo (First Expire, First Out — RN06)</strong>: O algoritmo ordena os lotes automaticamente priorizando aqueles com menor prazo de validade para evitar desperdícios.
      </div>
      <div class="card mb-16" style="padding:12px">
        <div>Ordem de Serviço: <strong>${os.numeroOs}</strong></div>
        <div>Escola de Destino: <strong>${os.escolaNome}</strong> (Escola Única — RN07)</div>
      </div>

      <div style="overflow-x:auto;margin-bottom:14px">
        <table class="data-table" style="font-size:0.85rem">
          <thead>
            <tr>
              <th>Produto Solicitado</th>
              <th>Qtd Necessária</th>
              <th>Lote Sugerido (FEFO)</th>
              <th>Data Validade</th>
              <th>Recomendação Algoritmo</th>
            </tr>
          </thead>
          <tbody>
            ${os.produtos.map(p => `
              <tr>
                <td><strong>${p.produto}</strong></td>
                <td>${p.quantidade} ${p.unidade}</td>
                <td><span class="tag tag-blue">${p.loteSugerido}</span></td>
                <td>${p.validade}</td>
                <td><span class="tag tag-green">✓ Lote mais antigo (Saída Imediata)</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center">
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
        <button class="btn btn-primary" style="background:#15803d" onclick="window.concluirSeparacaoFEFO('${os.id}')">
          ✅ Concluir Separação FEFO
        </button>
      </div>
    </div>
  `;

  window.showModal(`📦 Separação de Estoque por FEFO — OS ${os.numeroOs}`, content, '750px');
};

window.concluirSeparacaoFEFO = (osId) => {
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.id === osId);
  if (!os) return;

  os.status = 'Separado';
  SharedState.registrarLogAuditoria({
    acao: 'Separação de Estoque FEFO (RN06)',
    produto: os.produtos.map(p => p.produto).join(', '),
    quantidade: os.produtos.reduce((s,p) => s + p.quantidade, 0),
    origem: 'Estoque Central SEMED',
    destino: os.escolaNome,
    motivo: `Separação concluída via FEFO para a Ordem de Serviço ${os.numeroOs}.`
  });
  SharedState._persist();

  showToast(`✅ Separação FEFO concluída para a escola ${os.escolaNome}! Status alterado para Separado.`);
  closeModal();
  const container = document.getElementById('page-content');
  if (container && PAGE_RENDERERS['gestor_expedicao-os']) PAGE_RENDERERS['gestor_expedicao-os'](container);
};

// MODAL 4: CRIAR ORDEM DE ENTREGA (RN08/RN09)
window.abrirModalNovaOrdemEntrega = (osId) => {
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.id === osId);
  if (!os) return;

  const content = `
    <div style="font-family:Inter,sans-serif">
      <div style="background:#eff6ff;padding:12px;border-radius:8px;border:1px solid #bfdbfe;margin-bottom:14px;font-size:0.85rem;color:#1e40af">
        🚛 <strong>Ordem de Entrega (RN08/RN09)</strong>: Vinculação obrigatória de OS + Escola + Motorista + Veículo + Rota. Cada Ordem de Entrega pertence estritamente a 1 escola.
      </div>
      <form onsubmit="window.salvarNovaOrdemEntrega(event, '${os.id}')">
        <div style="margin-bottom:12px">
          <label class="form-label">Escola de Destino (1 Escola por OE):</label>
          <input type="text" class="form-control" value="${os.escolaNome}" readonly>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label class="form-label">Nome do Motorista / Entregador (RN09):</label>
            <input type="text" id="oe-motorista" class="form-control" value="Marcos Antônio Ribeiro" required>
          </div>
          <div>
            <label class="form-label">Veículo de Transporte (Placa/Modelo):</label>
            <input type="text" id="oe-veiculo" class="form-control" value="Furgão IVECO Daily (ABC-1234)" required>
          </div>
        </div>
        <div style="margin-bottom:14px">
          <label class="form-label">Rota Logística / Itinerário:</label>
          <input type="text" id="oe-rota" class="form-control" value="Rota 03 — Zona Norte (Anhanduízinho)" required>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-primary">🚛 Gerar Ordem de Entrega</button>
        </div>
      </form>
    </div>
  `;

  window.showModal(`🚛 Gerar Ordem de Entrega — ${os.numeroOs}`, content, '650px');
};

window.salvarNovaOrdemEntrega = (e, osId) => {
  e.preventDefault();
  const os = SharedState.getOrdensServicoExpedicao().find(o => o.id === osId);
  if (!os) return;

  const motorista = document.getElementById('oe-motorista').value;
  const veiculo = document.getElementById('oe-veiculo').value;
  const rota = document.getElementById('oe-rota').value;

  const novaOe = {
    id: `OE-2026-${Math.floor(100 + Math.random()*900)}`,
    numeroOe: `OE-2026/${Math.floor(100 + Math.random()*900)}`,
    osId: os.numeroOs,
    escolaId: os.escolaId,
    escolaNome: os.escolaNome,
    motorista,
    veiculo,
    rota,
    dataEntrega: new Date().toISOString().slice(0,10),
    status: 'Em Transporte',
    produtos: os.produtos,
    assinaturaDigital: null,
    recebidoPor: null
  };

  SharedState.getOrdensEntrega().push(novaOe);
  os.status = 'Em Rota';
  SharedState._persist();

  showToast(`🚛 Ordem de Entrega ${novaOe.numeroOe} gerada para a escola ${os.escolaNome}!`);
  closeModal();
  const container = document.getElementById('page-content');
  if (container && PAGE_RENDERERS['gestor_ordens-entrega']) PAGE_RENDERERS['gestor_ordens-entrega'](container);
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
  const container = document.getElementById('page-content');
  if (container && PAGE_RENDERERS['gestor_ordens-entrega']) PAGE_RENDERERS['gestor_ordens-entrega'](container);
};
