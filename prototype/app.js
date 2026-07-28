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
const APP_VERSION = '1.1.0';
const APP_BUILD_DATE = '2026-07-28';
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
// MODAL SYSTEM
// ============================
window.showModal = (title, content) => {
  let modal = document.getElementById('global-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'global-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:9999;';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'card';
    modalContent.style.cssText = 'width:90%;max-width:500px;background:var(--bg);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-lg);';
    
    const header = document.createElement('div');
    header.className = 'card-header';
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;';
    
    const titleEl = document.createElement('h3');
    titleEl.id = 'global-modal-title';
    titleEl.style.margin = '0';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = 'background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--text-secondary);';
    closeBtn.onclick = closeModal;
    
    const body = document.createElement('div');
    body.className = 'card-body';
    body.id = 'global-modal-body';
    
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    modalContent.appendChild(header);
    modalContent.appendChild(body);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
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
  products: [
    { id: 1, name: 'Arroz Tipo 1', category: 'Grãos', unit: 'kg', stock: 12500, avgConsume: 850, daysLeft: 14, familyFarm: false },
    { id: 2, name: 'Feijão Carioca', category: 'Grãos', unit: 'kg', stock: 4200, avgConsume: 420, daysLeft: 10, familyFarm: false },
    { id: 3, name: 'Banana Nanica', category: 'Frutas', unit: 'kg', stock: 1800, avgConsume: 600, daysLeft: 3, familyFarm: true },
    { id: 4, name: 'Maçã Fuji', category: 'Frutas', unit: 'kg', stock: 2300, avgConsume: 350, daysLeft: 6, familyFarm: false },
    { id: 5, name: 'Alface Crespa', category: 'Hortaliças', unit: 'kg', stock: 520, avgConsume: 280, daysLeft: 2, familyFarm: true },
    { id: 6, name: 'Tomate', category: 'Hortaliças', unit: 'kg', stock: 1950, avgConsume: 400, daysLeft: 5, familyFarm: true },
    { id: 7, name: 'Cenoura', category: 'Hortaliças', unit: 'kg', stock: 3100, avgConsume: 310, daysLeft: 10, familyFarm: true },
    { id: 8, name: 'Leite Integral', category: 'Laticínios', unit: 'L', stock: 8900, avgConsume: 1200, daysLeft: 7, familyFarm: false },
    { id: 9, name: 'Frango (Coxa/Sobrecoxa)', category: 'Proteínas', unit: 'kg', stock: 5600, avgConsume: 780, daysLeft: 7, familyFarm: false },
    { id: 10, name: 'Carne Bovina (Acém)', category: 'Proteínas', unit: 'kg', stock: 3200, avgConsume: 520, daysLeft: 6, familyFarm: false },
    { id: 11, name: 'Mandioca', category: 'Tubérculos', unit: 'kg', stock: 4800, avgConsume: 380, daysLeft: 12, familyFarm: true },
    { id: 12, name: 'Batata Doce', category: 'Tubérculos', unit: 'kg', stock: 2100, avgConsume: 290, daysLeft: 7, familyFarm: true },
    { id: 13, name: 'Ovo de Galinha', category: 'Proteínas', unit: 'dz', stock: 3400, avgConsume: 480, daysLeft: 7, familyFarm: true },
    { id: 14, name: 'Óleo de Soja', category: 'Gorduras', unit: 'L', stock: 2800, avgConsume: 180, daysLeft: 15, familyFarm: false },
    { id: 15, name: 'Açúcar Cristal', category: 'Condimentos', unit: 'kg', stock: 4500, avgConsume: 250, daysLeft: 18, familyFarm: false },
    { id: 16, name: 'Macarrão Espaguete', category: 'Grãos', unit: 'kg', stock: 3600, avgConsume: 320, daysLeft: 11, familyFarm: false },
    { id: 17, name: 'Abóbora Cabotiá', category: 'Hortaliças', unit: 'kg', stock: 1400, avgConsume: 260, daysLeft: 5, familyFarm: true },
    { id: 18, name: 'Melancia', category: 'Frutas', unit: 'kg', stock: 900, avgConsume: 450, daysLeft: 2, familyFarm: true },
    { id: 19, name: 'Farinha de Trigo', category: 'Grãos', unit: 'kg', stock: 5200, avgConsume: 280, daysLeft: 18, familyFarm: false },
    { id: 20, name: 'Leite em Pó', category: 'Laticínios', unit: 'kg', stock: 1800, avgConsume: 150, daysLeft: 12, familyFarm: false },
    { id: 21, name: 'Fórmula infantil (Partida)', category: 'Especiais', unit: 'Lata', stock: 2000, avgConsume: 150, daysLeft: 13, familyFarm: false },
    { id: 22, name: 'Fórmula infantil (Seguimento)', category: 'Especiais', unit: 'Lata', stock: 0, avgConsume: 100, daysLeft: 0, familyFarm: false },
    { id: 23, name: 'Carne Bovina - Patinho', category: 'Proteínas', unit: 'kg', stock: 1500, avgConsume: 300, daysLeft: 5, familyFarm: false },
    { id: 24, name: 'Carne Bovina - Músculo', category: 'Proteínas', unit: 'kg', stock: 2500, avgConsume: 400, daysLeft: 6, familyFarm: false },
    { id: 25, name: 'Filé de Tilápia', category: 'Proteínas', unit: 'kg', stock: 450, avgConsume: 100, daysLeft: 4, familyFarm: false },
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
  contracts: [
    { id: 1, number: 'ATA-2026/001', start: '2026-01-15', end: '2026-12-31', supplier: 'COOPAGRAN', globalValue: 5200000, executedValue: 2860000, status: 'Vigente' },
    { id: 2, number: 'ATA-2026/002', start: '2026-02-01', end: '2026-12-31', supplier: 'COOPRAN / COOPAERGS', globalValue: 4800000, executedValue: 2160000, status: 'Vigente' },
    { id: 3, number: 'ATA-2025/049', start: '2025-05-10', end: '2026-05-09', supplier: 'COMERCIAL LOTUS LTDA', globalValue: 13141.78, executedValue: 2000, status: 'Vigente' },
    { id: 4, number: 'ATA-2026/018', start: '2026-02-10', end: '2027-02-09', supplier: 'POLARIS COMÉRCIO DE ALIMENTOS LTDA', globalValue: 10817277.56, executedValue: 4250000, status: 'Vigente' },
  ],
  orders: [
    { id: 1, school: 'EM Hércules Maymone', date: '2026-06-24', status: 'Pendente', coop: 'COOPAGRAN', value: 8500 },
    { id: 2, school: 'EM Nerone Maiolino', date: '2026-06-24', status: 'Pendente', coop: 'COOPRAN', value: 7200 },
    { id: 3, school: 'EM Elízio Ramirez Vieira', date: '2026-06-23', status: 'Em separação', coop: 'COOPAERGS', value: 9100 },
    { id: 4, school: 'EM Elpídio Reis', date: '2026-06-23', status: 'Em transporte', coop: 'COOPAGRAN', value: 6800 },
    { id: 5, school: 'EM Licurgo de Oliveira Bastos', date: '2026-06-22', status: 'Entregue', coop: 'COOPASUL', value: 5400 },
    { id: 6, school: 'EM Prof. Arassuay G. de Castro', date: '2026-06-22', status: 'Entregue', coop: 'COOPERVIDA', value: 7600 },
    { id: 7, school: 'EM Padre Tomaz Ghirardelli', date: '2026-06-21', status: 'Entregue', coop: 'COOPRAN', value: 4900 },
    { id: 8, school: 'EM Arlindo Lima', date: '2026-06-20', status: 'Entregue', coop: 'COOPAERGS', value: 8200 },
  ],
  ataProducts: [
    { id: 1, ataId: 3, name: 'Fórmula infantil - Tipo partida (Aptamil)', unit: 'Lata', maxQtd: 140800, unitPrice: 0.04, globalValue: 5632, executedValue: 2000, stockProductId: 21 },
    { id: 2, ataId: 3, name: 'Fórmula infantil - Seguimento (Nestogeno)', unit: 'Lata', maxQtd: 250326, unitPrice: 0.03, globalValue: 7509.78, executedValue: 0, stockProductId: 22 },
    { id: 3, ataId: 4, name: 'Carne Bovina - Patinho em cubos (Talismã)', unit: 'Kg', maxQtd: 117436, unitPrice: 23.85, globalValue: 2800848.60, executedValue: 1200000, stockProductId: 23 },
    { id: 4, ataId: 4, name: 'Carne Bovina - Músculo Moído (Talismã)', unit: 'Kg', maxQtd: 421457, unitPrice: 16.88, globalValue: 7114194.16, executedValue: 3000000, stockProductId: 24 },
    { id: 5, ataId: 4, name: 'Filé de Tilápia (Bello)', unit: 'Kg', maxQtd: 25852, unitPrice: 34.90, globalValue: 902234.80, executedValue: 50000, stockProductId: 25 }
  ],
  lots: [
    { id: 1, productId: 23, number: 'L-PAT-001', entryDate: '2026-06-15', expirationDate: '2026-09-15', qtd: 1500 },
    { id: 2, productId: 1, number: 'L-ARR-092', entryDate: '2026-05-10', expirationDate: '2026-12-15', qtd: 12500 }
  ],
  separation_orders: [
    { id: 1, pedidoId: 301, school: 'EM Arlindo Lima', items: [{ productId: 1, requested: 120, lotSugg: 'L-ARR-092', scanned: 0 }], status: 'Pendente' }
  ],
  empenhos: [
    { id: 1, ataId: 4, numero: 'EMP-2026/045', date: '2026-06-15', totalValue: 120000, executedValue: 120000, status: 'Liquidado', items: [{ productId: 3, qtd: 5031, value: 120000, delivered: 5031 }] },
    { id: 2, ataId: 4, numero: 'EMP-2026/102', date: '2026-06-20', totalValue: 50000, executedValue: 20000, status: 'Parcial', items: [{ productId: 5, qtd: 1432, value: 50000, delivered: 573 }] }
  ],
  nf_history: [
    { id: 1, empenhoId: 1, date: '2026-06-18', numero: 'NF-1023', items: [{ productId: 3, qtd: 5031, value: 120000 }] },
    { id: 2, empenhoId: 2, date: '2026-06-25', numero: 'NF-1089', items: [{ productId: 5, qtd: 573, value: 20000 }] }
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
        { id: 'atas', icon: '📋', label: 'Atas e Contratos', badge: null },
      ]},
      { id: 'relatorios', icon: '📈', label: 'Relatórios', badge: null },
      { id: 'ia', icon: '🤖', label: 'IA de Previsão', badge: null },
    ]
  },
  nutricionista: {
    name: 'Dra. Camila Andrade',
    role: 'Nutricionista SEMED',
    initials: 'CA',
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard Nutricional', badge: null },
      { id: 'fichas', icon: '📝', label: 'Fichas Técnicas', badge: null },
      { id: 'produtos', icon: '🥕', label: 'Produtos', badge: null },
      { id: 'cardapios', icon: '🍽️', label: 'Cardápios (Viewer, PDF, Romaneio)', badge: null },
      { id: 'planejamento', icon: '📅', label: 'Planejamento Alimentar', badge: null },
      { id: 'escolas', icon: '🏫', label: 'Escolas', badge: null },
      { id: 'consumo', icon: '📈', label: 'Consumo', badge: null },
      { id: 'desperdicios', icon: '🗑️', label: 'Desperdícios', badge: null },
      { id: 'restricoes', icon: '⚠️', label: 'Restrições Alimentares', badge: null },
      { id: 'relatorios', icon: '📊', label: 'Relatórios', badge: null },
      { id: 'ia', icon: '🤖', label: 'IA Nutricional', badge: null },
    ]
  },
  escola: {
    name: 'Maria Santos',
    role: 'EM Arlindo Lima',
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
    get _sc() { return state.selectedSchool || (window._PILOT_SCHOOLS||[]).find(s => s.id === state.selectedSchoolId); },
    get name() { const sc = this._sc; return sc && sc.diretor ? sc.diretor.name : 'Diretor(a)'; },
    get role() { const sc = this._sc; return sc ? sc.name : 'Direção Escolar'; },
    get initials() { const sc = this._sc; return sc && sc.diretor ? sc.diretor.initials : 'DE'; },
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Painel da Escola', badge: null },
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
        { id: 'menu-jun-reg',   nome: 'Cardápio Junho/2026 — Regular',  periodo: '01/06 a 30/06', escolas: 152, status: 'Publicado',    tipo: 'Regular',  autor: 'Dra. Camila Andrade', criadoEm: '2026-05-25' },
        { id: 'menu-jun-int',   nome: 'Cardápio Junho/2026 — Integral', periodo: '01/06 a 30/06', escolas: 31,  status: 'Publicado',    tipo: 'Integral', autor: 'Dra. Camila Andrade', criadoEm: '2026-05-25' },
        { id: 'menu-jul-reg',   nome: 'Cardápio Julho/2026 — Regular',  periodo: '01/07 a 31/07', escolas: 0,   status: 'Em Elaboração', tipo: 'Regular', autor: 'Dra. Camila Andrade', criadoEm: '2026-06-18' },
      ],
      weeklyMenus: [],   // { id, semana, escola|'REDE', refeicoes:[{dia,tipo,item,kcal}], kcalMedia, publicadoEm, autor }
      fichas: [],        // fichas criadas em runtime (as demo ficam em _FICHAS_DEMO)
      orders: [],        // pedidos criados pela escola em runtime
      deliveries: [],    // eventos de entrega (status, confirmação, foto, assinatura)
      incidents: [],     // ocorrências do motorista
      productions: [],   // atualizações de produção do agricultor
      stockAdjust: [],   // ajustes de estoque (audit-log de movimentações)
      // ── LOGÍSTICA / CONTÁBIL (novas entidades) ──
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
      restricoes: [],   // { id, schoolId, schoolName, tipo, quantidade, observacao, status, registradoPor, criadoEm }
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
          if (!(k in this._data)) this._data[k] = defs[k];
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
  getWeeklyMenus() { return [...(this._data.weeklyMenus || [])]; },
  getFichas()      { return [...(this._data.fichas || [])]; },
  getOrders()      { return [...(this._data.orders || [])]; },
  getDeliveries()  { return [...(this._data.deliveries || [])]; },
  getIncidents()   { return [...(this._data.incidents || [])]; },
  getProductions() { return [...(this._data.productions || [])]; },
  getStockAdjust() { return [...(this._data.stockAdjust || [])]; },
  getEmpenhos()    { return [...(this._data.empenhos || [])]; },
  getEmpenho(id)   { return (this._data.empenhos || []).find(e => e.id === id) || null; },
  getEmpenhosByAta(ataId) { return (this._data.empenhos || []).filter(e => e.ataId === ataId); },
  getNFs()         { return [...(this._data.nfsRecebidas || [])]; },
  getNFsByEmpenho(empenhoId) { return (this._data.nfsRecebidas || []).filter(n => n.empenhoId === empenhoId); },
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

  addRestricao(restricao) {
    const r = { id: 'restr-' + Date.now(), criadoEm: new Date().toISOString(), status: 'ativo', notificado: false, ...restricao };
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
    const m = { id: 'menu-' + Date.now(), status: 'Publicado', criadoEm: new Date().toISOString().slice(0,10), ...menu };
    this._data.menus.unshift(m);
    this._persist(); this._emit('menu:add');
    return m;
  },
  addWeeklyMenu(weekly) {
    const w = { id: 'wk-' + Date.now(), publicadoEm: new Date().toISOString(), ...weekly };
    this._data.weeklyMenus.unshift(w);
    this._persist(); this._emit('weeklyMenu:add');
    return w;
  },
  addFicha(ficha) {
    const f = { id: 'ficha-' + Date.now(), criadoEm: new Date().toISOString().slice(0,10), ...ficha };
    this._data.fichas.unshift(f);
    this._persist(); this._emit('ficha:add');
    return f;
  },
  addOrder(order) {
    const nextNum = ((this._data.orders[0]?.numero) || 100) + 1;
    const o = {
      id: 'ord-' + Date.now(),
      numero: nextNum,
      date: new Date().toISOString().slice(0,10),
      status: 'Pendente',
      value: 0,
      itens: [],
      ...order,
    };
    this._data.orders.unshift(o);
    // Cria automaticamente um registro de entrega vinculado para acompanhamento
    this._data.deliveries.unshift({
      id: 'del-' + Date.now(),
      orderId: o.id,
      orderNumero: o.numero,
      school: o.school,
      cooperative: o.cooperative,
      status: 'Aguardando Cooperativa',
      criadoEm: new Date().toISOString(),
      timeline: [{ at: new Date().toISOString(), evento: 'Pedido enviado pela escola' }],
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
    const i = { id: 'inc-' + Date.now(), criadoEm: new Date().toISOString(), status: 'Aberta', ...inc };
    this._data.incidents.unshift(i);
    this._persist(); this._emit('incident:add');
    return i;
  },
  addProduction(prod) {
    const p = { id: 'prod-' + Date.now(), criadoEm: new Date().toISOString(), ...prod };
    this._data.productions.unshift(p);
    this._persist(); this._emit('production:add');
    return p;
  },
  addStockAdjust(adj) {
    const a = { id: 'adj-' + Date.now(), criadoEm: new Date().toISOString(), ...adj };
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

  // ── Consumo escolar (decrementa estoque da escola) ──
  addConsumo(reg) {
    const c = { id: 'cons-' + Date.now(), criadoEm: new Date().toISOString(), ...reg };
    (this._data.consumo = this._data.consumo || []).unshift(c);
    // Decrementa estoque local da escola
    this._data.schoolStocks = this._data.schoolStocks || {};
    this._data.schoolStocks[c.escola] = this._data.schoolStocks[c.escola] || {};
    const item = this._data.schoolStocks[c.escola][c.produto];
    if (item) {
      item.qtd = Math.max(0, (item.qtd || 0) - (c.qtd || 0));
      const adj = {
        id: 'adj-' + Date.now() + '-' + Math.random().toString(36).slice(2,6),
        escola: c.escola, produto: c.produto, delta: -(c.qtd || 0), unidade: c.unidade,
        motivo: 'Consumo — ' + (c.refeicao || 'refeição'), criadoEm: new Date().toISOString(),
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

  // Hidrata DATA com dados reais do Supabase
  if (window.DB) {
    await window.DB.hydrateData();
    updateDbStatusBadge();
  }

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
  $('#sidebar-user-role').textContent = prof.role;
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
  $('#header-user-role').textContent = prof.role;
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
    { icon: '🔴', title: 'Estoque Crítico', desc: 'EM Hércules Maymone com estoque abaixo de 15%', time: '5 min', unread: true },
    { icon: '🔴', title: 'Entrega Atrasada', desc: 'Pedido #003 da EM Elízio Ramirez Vieira', time: '1h', unread: true },
    { icon: '🟡', title: 'Novo Pedido', desc: 'EM Nerone Maiolino solicitou abastecimento', time: '2h', unread: true },
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
  const totalAtas = DATA.contracts.reduce((a, c) => a + c.globalValue, 0);
  const executedAtas = DATA.contracts.reduce((a, c) => a + c.executedValue, 0);
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
        <div class="kpi-label">Valor Executado das Atas</div>
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
            <div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>EM Hércules Maymone</strong> — Estoque em 15%, risco de desabastecimento</div><span class="alert-time">5min</span></div>
            <div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>EM Elízio Ramirez</strong> — Estoque em 8%, situação crítica</div><span class="alert-time">1h</span></div>
            <div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>EM Nerone Maiolino</strong> — Estoque em 12%, aguardando entrega</div><span class="alert-time">2h</span></div>
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
        <div class="filter-bar" style="margin:0">
          <select id="filter-region"><option value="">Todas as Regiões</option>${DATA.regions.map(r => `<option>${r}</option>`).join('')}</select>
          <select id="filter-status"><option value="">Todos os Status</option><option>ok</option><option>warning</option><option>danger</option></select>
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
        </div>
      </div>
    </div>
  `;
};

// ─── GESTOR: ATAS E CONTRATOS ───
window.openAtaDetalhe = (ataId) => {
  const container = document.getElementById('page-content');
  const ata = DATA.contracts.find(a => a.id === ataId);
  if (!ata) return;
  const prods = DATA.ataProducts.filter(p => p.ataId === ataId);
  const emps = DATA.empenhos.filter(e => e.ataId === ataId);
  
  container.innerHTML = `
    <div class="page-header" style="display:flex;align-items:center;gap:12px">
      <button class="btn btn-outline" onclick="PAGE_RENDERERS.gestor_atas(document.getElementById('page-content'))">🔙 Voltar</button>
      <div>
        <div class="page-title">Ata nº ${ata.number}</div>
        <div class="page-subtitle">Fornecedor: ${ata.supplier} | Vigência: ${formatDate(ata.start)} a ${formatDate(ata.end)}</div>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">💰</div><div class="kpi-value">${formatCurrency(ata.globalValue)}</div><div class="kpi-label">Valor Global</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${formatCurrency(ata.executedValue)}</div><div class="kpi-label">Executado</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📊</div><div class="kpi-value">${formatCurrency(ata.globalValue - ata.executedValue)}</div><div class="kpi-label">Saldo Restante</div></div>
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
            <thead><tr><th>Produto</th><th>Global</th><th>Executado</th><th>Saldo</th></tr></thead>
            <tbody>
              ${prods.map(p => `
                <tr>
                  <td><strong>${p.name}</strong><br><small style="color:var(--text-secondary)">Unid: ${p.unit} | Preço: ${formatCurrency(p.unitPrice)}</small></td>
                  <td style="font-family:var(--font-mono)">${formatCurrency(p.globalValue)}</td>
                  <td style="font-family:var(--font-mono)">${formatCurrency(p.executedValue)}</td>
                  <td style="font-family:var(--font-mono);font-weight:600;color:var(--primary)">${formatCurrency(p.globalValue - p.executedValue)}</td>
                </tr>
              `).join('')}
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
                <div style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px">Qtd Solicitada: ${e.items[0]?.qtd} | Qtd Entregue: ${e.items[0]?.delivered} | Saldo Físico: ${e.items[0]?.qtd - e.items[0]?.delivered}</div>
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
      <div style="font-size:0.85rem;margin-top:4px;color:var(--primary)">Saldo Físico (Qtd) Restante: ${e.items[0]?.qtd - e.items[0]?.delivered}</div>
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


window.openModalEmpenho = (ataId) => {
  showModal('Novo Empenho', `
    <div class="form-group">
      <label>Produto</label>
      <select id="ata-empenho-prod" style="width:100%;padding:10px;border-radius:var(--radius-md);border:1px solid var(--border)">
        ${DATA.ataProducts.filter(p=>p.ataId===ataId).map(p=>`<option value="${p.id}">${p.name} (Saldo Restante na Ata: ${formatCurrency(p.globalValue - p.executedValue)})</option>`).join('')}
      </select>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label>Nº do Empenho</label>
        <input type="text" id="ata-empenho-numero" placeholder="Ex: 2026 NE 00477 0909F">
      </div>
      <div class="form-group">
        <label>Quantidade a empenhar</label>
        <input type="number" id="ata-empenho-qtd" placeholder="Qtd">
      </div>
    </div>
    <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="window.saveEmpenho(${ataId})">Gravar Empenho</button>
  `);
};

window.saveEmpenho = (ataId) => {
  const prodId = parseInt(document.getElementById('ata-empenho-prod').value);
  const empenho = document.getElementById('ata-empenho-numero').value;
  const qtd = parseInt(document.getElementById('ata-empenho-qtd').value);
  if(!empenho || !qtd) return alert('Preencha os campos.');
  
  const prod = DATA.ataProducts.find(p => p.id === prodId);
  const totalValue = qtd * prod.unitPrice;
  
  DATA.empenhos.push({
    id: DATA.empenhos.length + 1,
    ataId: ataId,
    numero: empenho,
    date: new Date().toISOString().split('T')[0],
    totalValue: totalValue,
    executedValue: 0,
    status: 'Pendente',
    items: [{ productId: prodId, qtd: qtd, value: totalValue, delivered: 0 }]
  });
  
  closeModal();
  window.showToast('Empenho gravado com sucesso!', 'success');
  window.openAtaDetalhe(ataId);
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
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Atas e Contratos</div><div class="page-subtitle">Gestão dos instrumentos contratuais vigentes · Empenhos e NFs sincronizados com Estoque Central</div></div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${DATA.contracts.length}</div><div class="kpi-label">Atas Vigentes</div></div>
      <div class="kpi-card green"><div class="kpi-icon">💰</div><div class="kpi-value">${formatCurrency(DATA.contracts.reduce((a,c)=>a+c.globalValue,0))}</div><div class="kpi-label">Valor Global</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">✅</div><div class="kpi-value">${formatCurrency(DATA.contracts.reduce((a,c)=>a+c.executedValue,0))}</div><div class="kpi-label">Executado</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📊</div><div class="kpi-value">${formatCurrency(DATA.contracts.reduce((a,c)=>a+c.globalValue-c.executedValue,0))}</div><div class="kpi-label">Saldo Disponível</div></div>
    </div>
    <div class="card mb-24">
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Nº da Ata</th><th>Vigência</th><th>Fornecedor</th><th>Valor Global</th><th>Executado</th><th>Saldo</th><th>Execução</th><th>Status</th><th>Ação</th></tr></thead>
          <tbody>
            ${DATA.contracts.map(c => {
              const pct = Math.round(c.executedValue / c.globalValue * 100);
              return `<tr style="cursor:pointer" onclick="window.openAtaDetalhe(${c.id})">
                <td><strong>${c.number}</strong></td>
                <td>${formatDate(c.start)} a ${formatDate(c.end)}</td>
                <td>${c.supplier}</td>
                <td style="font-family:var(--font-mono)">${formatCurrency(c.globalValue)}</td>
                <td style="font-family:var(--font-mono)">${formatCurrency(c.executedValue)}</td>
                <td style="font-family:var(--font-mono);font-weight:600;color:var(--primary)">${formatCurrency(c.globalValue - c.executedValue)}</td>
                <td><div style="display:flex;align-items:center;gap:6px"><div class="progress-bar" style="width:80px"><div class="progress-fill ${pct > 80 ? 'orange' : 'blue'}" style="width:${pct}%"></div></div><span style="font-size:0.75rem;font-family:var(--font-mono)">${pct}%</span></div></td>
                <td><span class="status-badge status-ok">${c.status}</span></td>
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

// ─── GESTOR: PEDIDOS ───
PAGE_RENDERERS.gestor_pedidos = (el) => {
  const shared = SharedState.getOrders();
  const totalShared = shared.length;
  const pendentes = shared.filter(o => o.status === 'Pendente').length + DATA.orders.filter(o => o.status === 'Pendente').length;
  const emAndamento = shared.filter(o => o.status === 'Em separação' || o.status === 'Em transporte').length + DATA.orders.filter(o => o.status === 'Em separação' || o.status === 'Em transporte').length;

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Pedidos</div><div class="page-subtitle">Acompanhe todos os pedidos de abastecimento · Escolas → Cooperativas → Agricultores</div></div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${totalShared + DATA.orders.length}</div><div class="kpi-label">Pedidos Totais</div></div>
      <div class="kpi-card red"><div class="kpi-icon">⏰</div><div class="kpi-value">${pendentes}</div><div class="kpi-label">Pendentes</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">🚚</div><div class="kpi-value">${emAndamento}</div><div class="kpi-label">Em Andamento</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${shared.filter(o=>o.status==='Entregue').length + DATA.orders.filter(o=>o.status==='Entregue').length}</div><div class="kpi-label">Entregues</div></div>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>#</th><th>Escola</th><th>Data</th><th>Cooperativa</th><th>Itens</th><th>Valor</th><th>Status</th></tr></thead>
          <tbody>
            ${shared.map(o => `<tr>
              <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(o.numero).padStart(3, '0')} <span class="tag tag-blue" style="font-size:0.65rem">NOVO</span></td>
              <td><strong>${o.school}</strong></td>
              <td>${o.date}</td>
              <td><span class="tag tag-teal">${o.cooperative || '—'}</span></td>
              <td style="font-size:0.82rem">${(o.itens||[]).length} item(ns)</td>
              <td style="font-family:var(--font-mono)">${formatCurrency(o.value || 0)}</td>
              <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
            </tr>`).join('')}
            ${DATA.orders.map(o => `<tr>
              <td style="font-family:var(--font-mono)">#${String(o.id).padStart(3, '0')}</td>
              <td><strong>${o.school}</strong></td>
              <td>${formatDate(o.date)}</td>
              <td><span class="tag tag-teal">${o.coop}</span></td>
              <td style="font-size:0.82rem;color:var(--text-tertiary)">—</td>
              <td style="font-family:var(--font-mono)">${formatCurrency(o.value)}</td>
              <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
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
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Estoque Consolidado Municipal</div><div class="page-subtitle">Visão unificada do estoque de todas as escolas</div></div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Produtos em Estoque</div>
        <div class="filter-bar" style="margin:0">
          <select><option value="">Todas as Categorias</option><option>Grãos</option><option>Frutas</option><option>Hortaliças</option><option>Proteínas</option><option>Laticínios</option></select>
        </div>
      </div>
      <div class="card-body">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Categoria</th><th>Estoque Total</th><th>Pedidos Pendentes</th><th>Consumo Médio/Dia</th><th>Dias de Cobertura</th><th>Status</th></tr></thead>
          <tbody>
            ${DATA.products.map(p => {
              // Calcula pedidos pendentes a partir das atas
              const aProds = DATA.ataProducts.filter(ap => ap.stockProductId === p.id);
              let pendente = 0;
              aProds.forEach(ap => {
                const emps = DATA.empenhos.filter(e => e.items[0].productId === ap.id);
                emps.forEach(e => {
                  const pedidos = (DATA.ata_pedidos || []).filter(pd => pd.empenhoId === e.id);
                  const requested = pedidos.reduce((sum, pd) => sum + pd.qtd, 0);
                  const nfs = (DATA.nf_history || []).filter(nf => nf.empenhoId === e.id);
                  const delivered = nfs.reduce((sum, nf) => sum + nf.items[0].qtd, 0);
                  pendente += Math.max(0, requested - delivered);
                });
              });
              
              return `<tr>
              <td><strong>${p.name}</strong></td>
              <td><span class="tag tag-blue">${p.category}</span></td>
              <td style="font-family:var(--font-mono);font-weight:700">${p.stock.toLocaleString('pt-BR')} ${p.unit}</td>
              <td style="font-family:var(--font-mono);color:var(--warning)">${pendente > 0 ? pendente.toLocaleString('pt-BR') + ' ' + p.unit : '—'}</td>
              <td style="font-family:var(--font-mono)">${p.avgConsume} ${p.unit}</td>
              <td style="font-family:var(--font-mono);font-weight:700;color:${p.daysLeft <= 3 ? 'var(--danger)' : p.daysLeft <= 7 ? 'var(--warning)' : 'var(--success)'}">${p.daysLeft} dias</td>
              <td><span class="status-badge ${p.daysLeft <= 3 ? 'status-danger' : p.daysLeft <= 7 ? 'status-warning' : 'status-ok'}">${p.daysLeft <= 3 ? 'Crítico' : p.daysLeft <= 7 ? 'Atenção' : 'Normal'}</span></td>
            </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
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
  const porcao = f.porcao || (f.ingredientes ? f.ingredientes.reduce((s, i) => s + (i.quantidade || 0), 0) + 'g' : '—');
  const descricao = f.descricao || (f.ingredientes ? f.ingredientes.map(i => i.nome).filter(Boolean).join(', ') : '');
  const onclick = isDemo ? `viewFichaDetails('${f.id}')` : `viewFichaDetails('${f.id}')`;
  return `
    <div class="card ficha-card" data-name="${(f.nome || '').toLowerCase()}" style="cursor:pointer" onclick="${onclick}">
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
    const k = (f.id || f.nome || '').toLowerCase();
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
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:0.8rem;color:var(--text-secondary)">${salvas} salva${salvas !== 1 ? 's' : ''} + ${_FICHAS_DEMO.length} demo</span>
          <button class="btn btn-outline" onclick="PAGE_RENDERERS.nutricionista_simulacoes(document.getElementById('page-content'))">🔬 Simular Enquadramento PNAE</button>
          <button class="btn btn-primary" onclick="showCreateFichaForm()">+ Nova Ficha Técnica</button>
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

  // Fichas salvas pelo usuário — renderizar diretamente
  const fichasSalvas = JSON.parse(localStorage.getItem('fichas_tecnicas') || '[]');
  const fichaSalva = fichasSalvas.find(f => String(f.id) === String(recipeId));
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

window.showCreateFichaForm = () => {
  window.fichaFormState = {
    nome: '',
    tipo: 'Almoço',
    ingredientes: [],
    totais: { kcal: 0, carbos: 0, proteinas: 0, lipidios: 0, sodio: 0 }
  };

  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="page-header">
      <div class="page-title">Nova Ficha Técnica</div>
      <div class="page-subtitle">Cadastre receita com múltiplos ingredientes seguindo o padrão PNAE/FNDE</div>
    </div>
    <div class="card" style="max-width:900px;margin:0 auto">
      <div class="card-header">
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

  const nome = document.getElementById('ficha-name').value;
  const tipo = document.getElementById('ficha-type').value;
  const ingredientes = window.fichaFormState.ingredientes;

  if (!nome || ingredientes.length === 0) {
    alert('Preencha o nome e adicione ao menos um ingrediente!');
    return;
  }

  // Criar objeto da receita
  const receita = {
    id: Date.now(),
    nome,
    tipo,
    ingredientes,
    totais: window.fichaFormState.totais,
    dataCriacao: new Date().toISOString().split('T')[0],
    nutricionista: 'Dra. Camila Andrade',
    ativo: true
  };

  // Salvar no localStorage (cache local imediato)
  let fichas = JSON.parse(localStorage.getItem('fichas_tecnicas') || '[]');
  fichas.push(receita);
  localStorage.setItem('fichas_tecnicas', JSON.stringify(fichas));

  // Persiste no Supabase (best-effort — localStorage já garante a UI)
  if (window.DB && typeof window.DB.saveFichaTecnica === 'function') {
    window.DB.saveFichaTecnica(receita).then(ok => {
      if (!ok) console.warn('[Fichas] Não foi possível persistir no Supabase — mantida apenas em localStorage');
    });
  }

  // Publica no SharedState para que Escola/Gestor também vejam
  SharedState.addFicha(receita);

  // Adicionar também ao DATA.produtos para aparecer nos cardápios
  if (!DATA.receitas) DATA.receitas = [];
  DATA.receitas.push(receita);

  alert(`Ficha técnica de "${nome}" criada e salva com sucesso! ✓nnEnergia: ${receita.totais.kcal.toFixed(0)} kcalnProteína: ${receita.totais.proteinas.toFixed(1)}gnCarboidratos: ${receita.totais.carbos.toFixed(1)}g`);

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
    autor: c.autor || 'Dra. Camila Andrade',
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
          ${(!readOnly && c.status !== 'Publicado')
            ? `<button class="table-action" onclick="viewCardapio('${c.id || i}')">Editar</button>`
            : `<button class="table-action" onclick="viewCardapio('${c.id || i}')">Visualizar</button>`}
        </td>
      </tr>
    `;
  }).join('');

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">${readOnly ? 'Cardápios da Rede' : 'Gestão de Cardápios'}</div>
      <div class="page-subtitle">${readOnly ? 'Cardápios elaborados pela Nutricionista SEMED e distribuídos à sua escola' : 'Elaboração, publicação e vinculação de cardápios escolares'}</div>
    </div>

    ${!readOnly ? `
    <div class="card mb-24">
      <div class="card-body" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div style="font-weight:600">Planejador de Cardápios</div>
          <div style="font-size:0.82rem;color:var(--text-secondary)">Cardápios publicados aqui aparecem imediatamente nas ${totalSchools} escolas da rede e no painel do Gestor</div>
        </div>
        <button class="btn btn-primary" onclick="showMenuPlanner()">+ Abrir Planejador Semanal</button>
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
        <table class="data-table"><thead><tr><th>Nome</th><th>Período</th><th>Destino</th><th>Autor</th><th>Publicado em</th><th>Média Kcal</th></tr></thead><tbody>
          ${weekly.map(w => `
            <tr>
              <td><strong>${w.nome || 'Cardápio Semanal'}</strong></td>
              <td>${w.periodo || '—'}</td>
              <td>${w.escola || 'Toda a Rede'}</td>
              <td style="font-size:0.82rem">${w.autor || '—'}</td>
              <td style="font-size:0.82rem">${new Date(w.publicadoEm).toLocaleString('pt-BR')}</td>
              <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${w.kcalMedia || '—'} kcal/dia</td>
            </tr>
          `).join('')}
        </tbody></table>
      </div>
    </div>` : ''}
  `;
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

  container.innerHTML = `
    <div class="page-header"><div class="page-title">Planejador Semanal de Cardápio</div><div class="page-subtitle">Monte as refeições diárias e verifique o valor nutricional acumulado</div></div>
    
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
          <button class="btn btn-primary" onclick="generatePlannerDays()">Gerar Dias</button>
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
          <div id="planner-escolas-list" style="display:none;padding:10px;border:1px solid var(--border);border-radius:8px;max-height:180px;overflow-y:auto">
            ${(DATA.schools||[]).map(s => `
              <label style="display:block;padding:4px 0;font-size:0.85rem;cursor:pointer">
                <input type="checkbox" class="planner-escola-chk" value="${s.name.replace(/"/g,'&quot;')}" style="margin-right:6px">${s.name} <span style="color:var(--text-tertiary);font-size:0.78rem">· ${s.region}</span>
              </label>
            `).join('')}
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
    autor: prof.name || 'Dra. Camila Andrade',
  });
  SharedState.addWeeklyMenu({
    nome: name,
    periodo: `${d1} a ${d2}`,
    semana: `${d1} a ${d2}`,
    escola: escolaLabel,
    escolasVinculadas,
    refeicoes,
    kcalMedia,
    autor: prof.name || 'Dra. Camila Andrade',
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
      <div class="page-subtitle">Pontos de entrega e situação de abastecimento</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${schools.length}</div><div class="kpi-label">Escolas</div></div>
      <div class="kpi-card green"><div class="kpi-icon">👥</div><div class="kpi-value">${total.toLocaleString('pt-BR')}</div><div class="kpi-label">Alunos Atendidos</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${schools.filter(s=>s.stockStatus==='warning').length}</div><div class="kpi-label">Em Atenção</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${risco}</div><div class="kpi-label">Em Risco</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Pontos de Entrega</div></div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Escola</th><th>Região</th><th>Modalidade</th><th>Alunos</th><th>Estoque Atual</th><th>Status</th><th>Última Entrega</th><th>Ação</th></tr></thead>
            <tbody>
              ${schools.sort((a,b) => a.stockPct - b.stockPct).map(s => `
              <tr>
                <td><strong>${s.name}</strong></td>
                <td><span class="tag tag-blue">${s.region}</span></td>
                <td><span class="tag tag-teal" style="font-size:0.7rem">${s.modality || 'Escolar Urbana'}</span></td>
                <td style="font-family:var(--font-mono)">${s.students}</td>
                <td><div style="display:flex;align-items:center;gap:8px">
                  <div class="progress-bar" style="width:80px"><div class="progress-fill ${s.stockPct>60?'green':s.stockPct>30?'orange':'red'}" style="width:${s.stockPct}%"></div></div>
                  <span style="font-family:var(--font-mono);font-size:0.78rem">${s.stockPct}%</span>
                </div></td>
                <td><span class="status-badge ${statusClass(s.stockStatus)}">${statusLabel(s.stockStatus)}</span></td>
                <td style="font-size:0.82rem">${s.lastDelivery ? formatDate(s.lastDelivery) : '—'}</td>
                <td><button class="table-action" onclick="alert('Programar entrega para ${s.name.replace(/'/g,"'")}')">Programar →</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.agricultor_escolas = (el) => { PAGE_RENDERERS.cooperativa_escolas(el); };

PAGE_RENDERERS.estoque_escolas = (el) => {
  const schools = DATA.schools || [];
  const regioes = {};
  schools.forEach(s => { (regioes[s.region] = regioes[s.region] || []).push(s); });
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Escolas Atendidas</div>
      <div class="page-subtitle">Unidades escolares agrupadas por região de distribuição</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${schools.length}</div><div class="kpi-label">Escolas</div></div>
      <div class="kpi-card green"><div class="kpi-icon">🗺️</div><div class="kpi-value">${Object.keys(regioes).length}</div><div class="kpi-label">Regiões</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${schools.filter(s=>s.stockStatus==='warning').length}</div><div class="kpi-label">Em Atenção</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${schools.filter(s=>s.stockStatus==='danger').length}</div><div class="kpi-label">Em Risco</div></div>
    </div>
    ${Object.entries(regioes).map(([regiao, list]) => `
      <div class="card" style="margin-bottom:16px">
        <div class="card-header"><div class="card-title">${regiao} <span class="tag tag-blue" style="font-size:0.7rem">${list.length} escola(s)</span></div></div>
        <div class="card-body" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px">
          ${list.map(s => `
            <div style="border:1px solid var(--border);border-radius:8px;padding:12px">
              <div style="font-weight:600;margin-bottom:4px">${s.name}</div>
              <div style="font-size:0.78rem;color:var(--text-secondary);margin-bottom:8px">${s.sigla || ''} · ${s.students} alunos · ${s.director || (s.diretor ? s.diretor.name : '')}</div>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="progress-bar" style="width:80px"><div class="progress-fill ${s.stockPct>60?'green':s.stockPct>30?'orange':'red'}" style="width:${s.stockPct}%"></div></div>
                <span class="status-badge ${statusClass(s.stockStatus)}" style="font-size:0.7rem">${statusLabel(s.stockStatus)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `;
};

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
                  <option value="EM Hércules M.">EM Hércules Maymone</option>
                  <option value="EM Franklin R.">EM Franklin Roosevelt</option>
                  <option value="EM Arlindo L.">EM Arlindo Lima</option>
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
      labels: ['EM Hércules M.', 'EM Franklin R.', 'EM Arlindo L.', 'EM Elpídio R.', 'EM José R.B.'],
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

window.addToPlanner = (recipeId) => {
  alert('A receita será selecionada no Planejador Semanal.');
  // Em um sistema real, salvaríamos no estado qual receita pré-selecionar. 
  // Aqui abrimos direto a tela.
  window.showMenuPlanner();
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
          <div class="alert-item warning"><span class="alert-icon">🚚</span><div class="alert-text">Entrega para <strong>EM Arlindo Lima</strong> programada para <strong>amanhã</strong></div></div>
          <div class="alert-item info"><span class="alert-icon">📋</span><div class="alert-text">Novo pedido da <strong>COOPAGRAN</strong>: 200 kg de Mandioca</div></div>
          <div class="alert-item success"><span class="alert-icon">🌱</span><div class="alert-text"><strong>Abóbora</strong> — Colheita prevista em 5 dias</div></div>
        </div>
      </div></div>
      <div class="card"><div class="card-header"><div class="card-title">🚚 Próximas Entregas</div></div><div class="card-body">
        <table class="data-table"><thead><tr><th>Produto</th><th>Qtd</th><th>Data</th><th>Escola</th></tr></thead><tbody>
          <tr><td>Mandioca</td><td>200 kg</td><td>25/06</td><td>EM Arlindo Lima</td></tr>
          <tr><td>Banana</td><td>150 kg</td><td>27/06</td><td>EM Franklin R.</td></tr>
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

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Ordens de Separação (Picking)</div><div class="page-subtitle">Sistema sugere os lotes baseado em FIFO (First-In, First-Out) · Pedidos das escolas em tempo real</div></div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Fila de Separação</div>${sharedOrders.length ? '<span class="status-badge status-ok">'+sharedOrders.length+' pedido(s) da escola</span>' : ''}</div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Ordem</th><th>Escola Destino</th><th>Itens</th><th>Status</th><th>Ações</th></tr></thead><tbody>
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
        </tbody></table>
      </div>
    </div>
  `;
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
              <div style="font-weight:700">EM Arlindo Lima</div>
              <div style="font-size:0.8rem;color:var(--text-secondary)">Rua Pedro Celestino, 1234 — Centro</div>
            </div>
            <div><span class="status-badge status-ok">Entregue (08:32)</span></div>
          </div>
          
          <div style="display:flex;gap:16px;align-items:center;position:relative;z-index:1">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--warning);color:white;display:flex;align-items:center;justify-content:center;font-weight:700">2</div>
            <div style="flex:1">
              <div style="font-weight:700">EM Elpídio Reis</div>
              <div style="font-size:0.8rem;color:var(--text-secondary)">Rua Barão do Rio Branco, 456 — Centro</div>
            </div>
            <div><button class="btn btn-sm btn-primary" onclick="navigateTo(null, 'entregas')">Realizar Entrega</button></div>
          </div>

          <div style="display:flex;gap:16px;align-items:center;position:relative;z-index:1">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--text-tertiary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700">3</div>
            <div style="flex:1">
              <div style="font-weight:700">EM Hércules Maymone</div>
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
  const alvoNome = alvo ? alvo.school : 'EM Elpídio Reis';
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
    img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23c5e1a5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2333691e">Carga Entregue - EM Elpidio Reis</text></svg>';
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
              <option value="EM Elpídio Reis">EM Elpídio Reis</option>
              <option value="EM Hércules Maymone">EM Hércules Maymone</option>
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
    <div class="card">
      <div class="card-header"><div class="card-title">Registros Ativos (${ativos.length})</div></div>
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
    SharedState._data.stockAdjust.push({ id: Date.now(), escola: sc.name, produto, delta: Math.round(delta), unidade, motivo, criadoEm: new Date().toISOString() });
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

function renderGenericPage(el) {
  const menuItem = PROFILES[state.currentProfile].menu.find(m => m.id === state.currentPage);
  const label = menuItem ? menuItem.label : state.currentPage;
  el.innerHTML = `
    <div class="page-header"><div class="page-title">${label}</div><div class="page-subtitle">Conteúdo em desenvolvimento</div></div>
    <div class="card"><div class="card-body"><div class="empty-state"><div class="empty-icon">🚧</div><div class="empty-text">Esta tela está em construção</div></div></div></div>
  `;
}

// ============================
// EVENT LISTENERS
// ============================
document.addEventListener('DOMContentLoaded', () => {
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

  // Login form
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const activeProfile = $('.profile-btn.active');
    const topProfile = activeProfile ? activeProfile.dataset.profile : 'gestor';

    let profile = topProfile;
    let schoolId = null;

    if (topProfile === 'escola') {
      const activeSub = $('.subrole-btn.active');
      profile = activeSub ? activeSub.dataset.subrole : 'diretor';
      const sel = $('#school-picker-select');
      if (sel && sel.value) schoolId = parseInt(sel.value, 10);
    } else if (topProfile === 'colaboradores') {
      const activeColab = $('.colab-subrole-btn.active');
      profile = activeColab ? activeColab.dataset.subrole : 'cooperativa';
    }

    await login(profile, schoolId);
  });

  // Logout
  $('#btn-logout').addEventListener('click', logout);

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
});


// MERENDEIRA ALIASES
PAGE_RENDERERS.merendeira_dashboard = PAGE_RENDERERS.escola_dashboard;
PAGE_RENDERERS.merendeira_consumo = PAGE_RENDERERS.escola_consumo;
PAGE_RENDERERS.merendeira_cardapios = PAGE_RENDERERS.escola_cardapios;
PAGE_RENDERERS.merendeira_estoque = PAGE_RENDERERS.escola_estoque;
PAGE_RENDERERS.merendeira_entregas = PAGE_RENDERERS.escola_entregas;
