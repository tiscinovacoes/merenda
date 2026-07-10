/* ============================================
   SAGED — Application Engine
   Sistema de Gestão da Alimentação Escolar
   SEMED · Campo Grande · MS
   ============================================ */

// ============================
// MOCK DATA
// ============================
const DATA = {
  schools: [
    { id: 1, name: 'EM Arlindo Lima', region: 'Anhanduizinho', director: 'Maria Santos', students: 620, stockStatus: 'ok', lastDelivery: '2026-06-20', stockPct: 82 },
    { id: 2, name: 'EM Elpídio Reis', region: 'Bandeira', director: 'João Oliveira', students: 480, stockStatus: 'warning', lastDelivery: '2026-06-15', stockPct: 38 },
    { id: 3, name: 'EM Franklin Roosevelt', region: 'Centro', director: 'Ana Costa', students: 750, stockStatus: 'ok', lastDelivery: '2026-06-22', stockPct: 91 },
    { id: 4, name: 'EM Hércules Maymone', region: 'Imbirussu', director: 'Carlos Pereira', students: 560, stockStatus: 'danger', lastDelivery: '2026-06-08', stockPct: 15 },
    { id: 5, name: 'EM José Rodrigues Benfica', region: 'Lagoa', director: 'Fernanda Lima', students: 410, stockStatus: 'ok', lastDelivery: '2026-06-21', stockPct: 75 },
    { id: 6, name: 'EM Kamé Adania', region: 'Prosa', director: 'Roberto Alves', students: 520, stockStatus: 'ok', lastDelivery: '2026-06-19', stockPct: 88 },
    { id: 7, name: 'EM Licurgo de Oliveira Bastos', region: 'Segredo', director: 'Patricia Souza', students: 380, stockStatus: 'warning', lastDelivery: '2026-06-12', stockPct: 42 },
    { id: 8, name: 'EM Professora Gonçalina Faustina', region: 'Anhanduizinho', director: 'Marcos Silva', students: 690, stockStatus: 'ok', lastDelivery: '2026-06-23', stockPct: 95 },
    { id: 9, name: 'EM Nerone Maiolino', region: 'Bandeira', director: 'Luciana Ferreira', students: 430, stockStatus: 'danger', lastDelivery: '2026-06-05', stockPct: 12 },
    { id: 10, name: 'EM Plínio Mendes dos Santos', region: 'Centro', director: 'Adriana Rocha', students: 540, stockStatus: 'ok', lastDelivery: '2026-06-22', stockPct: 79 },
    { id: 11, name: 'EM Padre Tomaz Ghirardelli', region: 'Imbirussu', director: 'Luis Martins', students: 370, stockStatus: 'warning', lastDelivery: '2026-06-14', stockPct: 35 },
    { id: 12, name: 'EM Rita Cáceres Mendonça', region: 'Lagoa', director: 'Silvia Campos', students: 510, stockStatus: 'ok', lastDelivery: '2026-06-20', stockPct: 72 },
    { id: 13, name: 'EM Nagib Raslan', region: 'Prosa', director: 'Eduardo Nunes', students: 460, stockStatus: 'ok', lastDelivery: '2026-06-21', stockPct: 85 },
    { id: 14, name: 'EM Nazira Anache', region: 'Segredo', director: 'Renata Vieira', students: 590, stockStatus: 'ok', lastDelivery: '2026-06-18', stockPct: 68 },
    { id: 15, name: 'EM Professor Arassuay G. de Castro', region: 'Anhanduizinho', director: 'Pedro Barbosa', students: 640, stockStatus: 'warning', lastDelivery: '2026-06-10', stockPct: 30 },
    { id: 16, name: 'EM Sulivan Silvestre Oliveira', region: 'Bandeira', director: 'Claudia Moraes', students: 350, stockStatus: 'ok', lastDelivery: '2026-06-22', stockPct: 90 },
    { id: 17, name: 'EM Irmã Edith Coelho Netto', region: 'Centro', director: 'Fábio Cardoso', students: 480, stockStatus: 'ok', lastDelivery: '2026-06-23', stockPct: 87 },
    { id: 18, name: 'EM Elízio Ramirez Vieira', region: 'Imbirussu', director: 'Juliana Melo', students: 530, stockStatus: 'danger', lastDelivery: '2026-06-03', stockPct: 8 },
    { id: 19, name: 'EM Professora Arlene M. Almeida', region: 'Lagoa', director: 'Ricardo Pinto', students: 470, stockStatus: 'ok', lastDelivery: '2026-06-19', stockPct: 76 },
    { id: 20, name: 'EM Acadêmico Antônio Delfino Pereira', region: 'Prosa', director: 'Beatriz Ramos', students: 600, stockStatus: 'ok', lastDelivery: '2026-06-21', stockPct: 83 },
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
    { id: 3, number: 'ATA-2025/018', start: '2025-07-01', end: '2026-06-30', supplier: 'Diversos (Pregão)', globalValue: 6500000, executedValue: 5850000, status: 'Vigente' },
    { id: 4, number: 'CP-2026/003', start: '2026-03-01', end: '2027-02-28', supplier: 'COOPASUL / COOPERVIDA', globalValue: 1800000, executedValue: 540000, status: 'Vigente' },
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
      { id: 'atas', icon: '📋', label: 'Atas e Contratos', badge: null },
      { id: 'pedidos', icon: '📦', label: 'Pedidos', badge: '3' },
      { id: 'cooperativas', icon: '🤝', label: 'Cooperativas', badge: null },
      { id: 'agricultura', icon: '🌾', label: 'Agricultura Familiar', badge: null },
      { id: 'estoque', icon: '📊', label: 'Estoque Consolidado', badge: null },
      { id: 'planejamento', icon: '📅', label: 'Planejamento Alimentar', badge: null },
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
      { id: 'cardapios', icon: '🍽️', label: 'Cardápios', badge: null },
      { id: 'planejamento', icon: '📅', label: 'Planejamento Alimentar', badge: null },
      { id: 'escolas', icon: '🏫', label: 'Escolas', badge: null },
      { id: 'consumo', icon: '📈', label: 'Consumo', badge: null },
      { id: 'desperdicios', icon: '🗑️', label: 'Desperdícios', badge: null },
      { id: 'simulacoes', icon: '🔬', label: 'Simulações', badge: null },
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
      { id: 'escolas', icon: '🏫', label: 'Escolas da Rede', badge: null },
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
  almoxarifado: {
    name: 'Roberto Lima',
    role: 'Almoxarifado Central',
    initials: 'RL',
    menu: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard Operacional', badge: null },
      { id: 'escolas', icon: '🏫', label: 'Escolas / Destinos', badge: null },
      { id: 'separacao', icon: '📦', label: 'Separação de Pedidos', badge: '2' },
      { id: 'carregamento', icon: '🚚', label: 'Carregamento', badge: null },
      { id: 'estoque', icon: '📋', label: 'Lotes & Validade', badge: null },
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
};

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

async function login(profile) {
  state.currentProfile = profile;
  state.currentPage = 'dashboard';
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
function renderSidebar() {
  const prof = PROFILES[state.currentProfile];
  $('#sidebar-avatar').textContent = prof.initials;
  $('#sidebar-user-name').textContent = prof.name;
  $('#sidebar-user-role').textContent = prof.role;
  const nav = $('#sidebar-nav');
  nav.innerHTML = prof.menu.map(item => `
    <button class="sidebar-nav-item ${item.id === state.currentPage ? 'active' : ''}" data-page="${item.id}" type="button">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
    </button>
  `).join('');
  nav.querySelectorAll('.sidebar-nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(null, btn.dataset.page));
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
  const menuItem = prof.menu.find(m => m.id === state.currentPage);
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
  const pendingOrders = DATA.orders.filter(o => o.status === 'Pendente').length;
  const lateOrders = DATA.orders.filter(o => o.status === 'Pendente' || o.status === 'Em separação').length;
  const totalAtas = DATA.contracts.reduce((a, c) => a + c.globalValue, 0);
  const executedAtas = DATA.contracts.reduce((a, c) => a + c.executedValue, 0);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Dashboard Executivo</div>
      <div class="page-subtitle">Visão geral da alimentação escolar do município · Atualizado em ${new Date().toLocaleDateString('pt-BR')}</div>
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
        <div class="card-header"><div class="card-title">🚨 Alertas Ativos</div></div>
        <div class="card-body">
          <div class="alert-list">
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
                    <button class="table-action" onclick="window._STATE=window._STATE||{};window._STATE.schoolName='${s.name}';navigateTo('escola','dashboard')">Ver Perfil →</button>
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
PAGE_RENDERERS.gestor_atas = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Atas e Contratos</div><div class="page-subtitle">Gestão dos instrumentos contratuais vigentes</div></div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${DATA.contracts.length}</div><div class="kpi-label">Atas Vigentes</div></div>
      <div class="kpi-card green"><div class="kpi-icon">💰</div><div class="kpi-value">${formatCurrency(DATA.contracts.reduce((a,c)=>a+c.globalValue,0))}</div><div class="kpi-label">Valor Global</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">✅</div><div class="kpi-value">${formatCurrency(DATA.contracts.reduce((a,c)=>a+c.executedValue,0))}</div><div class="kpi-label">Executado</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📊</div><div class="kpi-value">${formatCurrency(DATA.contracts.reduce((a,c)=>a+c.globalValue-c.executedValue,0))}</div><div class="kpi-label">Saldo Disponível</div></div>
    </div>
    <div class="card">
      <div class="card-body">
        <table class="data-table">
          <thead><tr><th>Nº da Ata</th><th>Vigência</th><th>Fornecedor</th><th>Valor Global</th><th>Executado</th><th>Saldo</th><th>Execução</th><th>Status</th></tr></thead>
          <tbody>
            ${DATA.contracts.map(c => {
              const pct = Math.round(c.executedValue / c.globalValue * 100);
              return `<tr>
                <td><strong>${c.number}</strong></td>
                <td>${formatDate(c.start)} a ${formatDate(c.end)}</td>
                <td>${c.supplier}</td>
                <td style="font-family:var(--font-mono)">${formatCurrency(c.globalValue)}</td>
                <td style="font-family:var(--font-mono)">${formatCurrency(c.executedValue)}</td>
                <td style="font-family:var(--font-mono)">${formatCurrency(c.globalValue - c.executedValue)}</td>
                <td><div style="display:flex;align-items:center;gap:6px"><div class="progress-bar" style="width:80px"><div class="progress-fill ${pct > 80 ? 'orange' : 'blue'}" style="width:${pct}%"></div></div><span style="font-size:0.75rem;font-family:var(--font-mono)">${pct}%</span></div></td>
                <td><span class="status-badge status-ok">${c.status}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// ─── GESTOR: PEDIDOS ───
PAGE_RENDERERS.gestor_pedidos = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Pedidos</div><div class="page-subtitle">Acompanhe todos os pedidos de abastecimento</div></div>
    <div class="tabs">
      <button class="tab-btn active">Todos</button>
      <button class="tab-btn">Pendentes</button>
      <button class="tab-btn">Em Atendimento</button>
      <button class="tab-btn">Finalizados</button>
    </div>
    <div class="card">
      <div class="card-body">
        <table class="data-table">
          <thead><tr><th>#</th><th>Escola</th><th>Data</th><th>Cooperativa</th><th>Valor</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${DATA.orders.map(o => `<tr>
              <td style="font-family:var(--font-mono)">#${String(o.id).padStart(3, '0')}</td>
              <td><strong>${o.school}</strong></td>
              <td>${formatDate(o.date)}</td>
              <td><span class="tag tag-teal">${o.coop}</span></td>
              <td style="font-family:var(--font-mono)">${formatCurrency(o.value)}</td>
              <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
              <td><button class="table-action">Detalhes</button></td>
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
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Agricultura Familiar</div><div class="page-subtitle">Acompanhamento dos agricultores familiares do programa</div></div>
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
          <thead><tr><th>Produto</th><th>Categoria</th><th>Estoque Total</th><th>Consumo Médio/Dia</th><th>Dias de Cobertura</th><th>Agric. Familiar</th><th>Status</th></tr></thead>
          <tbody>
            ${DATA.products.map(p => `<tr>
              <td><strong>${p.name}</strong></td>
              <td><span class="tag tag-blue">${p.category}</span></td>
              <td style="font-family:var(--font-mono)">${p.stock.toLocaleString('pt-BR')} ${p.unit}</td>
              <td style="font-family:var(--font-mono)">${p.avgConsume} ${p.unit}</td>
              <td style="font-family:var(--font-mono);font-weight:700;color:${p.daysLeft <= 3 ? 'var(--danger)' : p.daysLeft <= 7 ? 'var(--warning)' : 'var(--success)'}">${p.daysLeft} dias</td>
              <td>${p.familyFarm ? '<span class="tag tag-green">✓ Sim</span>' : '<span class="tag" style="background:#F5F5F5;color:#9E9E9E">Não</span>'}</td>
              <td><span class="status-badge ${p.daysLeft <= 3 ? 'status-danger' : p.daysLeft <= 7 ? 'status-warning' : 'status-ok'}">${p.daysLeft <= 3 ? 'Crítico' : p.daysLeft <= 7 ? 'Atenção' : 'Normal'}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

// ─── GESTOR: PLANEJAMENTO ───
PAGE_RENDERERS.gestor_planejamento = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Planejamento Alimentar</div><div class="page-subtitle">Visão consolidada dos cardápios e necessidades futuras</div></div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><div class="card-title">📅 Cardápios Ativos</div></div><div class="card-body">
        <table class="data-table"><thead><tr><th>Cardápio</th><th>Período</th><th>Escolas</th><th>Status</th></tr></thead><tbody>
          <tr><td><strong>Cardápio Junho/2026</strong></td><td>01/06 a 30/06/2026</td><td>183</td><td><span class="status-badge status-ok">Ativo</span></td></tr>
          <tr><td><strong>Cardápio Julho/2026</strong></td><td>01/07 a 31/07/2026</td><td>183</td><td><span class="status-badge status-info">Em Elaboração</span></td></tr>
        </tbody></table>
      </div></div>
      <div class="card"><div class="card-header"><div class="card-title">📊 Necessidades Futuras (30 dias)</div></div><div class="card-body">
        <div class="chart-container h-250"><canvas id="chart-necessidades"></canvas></div>
      </div></div>
    </div>
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
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Relatórios Gerenciais</div><div class="page-subtitle">Relatórios consolidados para gestão executiva</div></div>
    <div class="grid-3">
      ${[
        { icon: '📊', title: 'Produtos Mais Consumidos', desc: 'Ranking de consumo por produto e período' },
        { icon: '🏫', title: 'Consumo por Escola', desc: 'Detalhamento por unidade escolar' },
        { icon: '🗺️', title: 'Consumo por Região', desc: 'Análise regional de consumo' },
        { icon: '🚚', title: 'Entregas Realizadas', desc: 'Histórico de entregas e performance' },
        { icon: '📋', title: 'Execução das Atas', desc: 'Acompanhamento financeiro dos contratos' },
        { icon: '🌾', title: 'Agricultura Familiar', desc: 'Participação e indicadores da AF' },
      ].map(r => `
        <div class="card" style="cursor:pointer">
          <div class="card-body" style="text-align:center;padding:30px">
            <div style="font-size:2.5rem;margin-bottom:12px">${r.icon}</div>
            <div style="font-weight:700;font-size:0.95rem;margin-bottom:6px">${r.title}</div>
            <div style="font-size:0.82rem;color:var(--text-secondary)">${r.desc}</div>
            <button class="btn btn-outline btn-sm" style="margin-top:14px">Gerar Relatório</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

// ─── GESTOR: IA DE PREVISÃO ───
PAGE_RENDERERS.gestor_ia = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">🤖 Inteligência Artificial — Previsão de Demanda</div><div class="page-subtitle">Motor de IA para previsão, simulação e otimização do abastecimento escolar</div></div>

    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">📊</div><div class="kpi-value">43.200</div><div class="kpi-label">Demanda Prevista 30 dias (kg)</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">📈</div><div class="kpi-value">128.500</div><div class="kpi-label">Demanda Prevista 90 dias (kg)</div></div>
      <div class="kpi-card red"><div class="kpi-icon">⚠️</div><div class="kpi-value">5</div><div class="kpi-label">Produtos Críticos</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">94%</div><div class="kpi-label">Acurácia do Modelo</div></div>
    </div>

    <div class="grid-2-1 mb-24">
      <div class="card">
        <div class="card-header"><div class="card-title">📈 Projeção de Demanda (6 meses)</div></div>
        <div class="card-body"><div class="chart-container h-300"><canvas id="chart-ia-projecao"></canvas></div></div>
      </div>
      <div class="ia-card">
        <div class="ia-card-title">🧠 Alertas Preditivos</div>
        <div class="ia-suggestion">🔴 <strong>Alface Crespa</strong> esgota em <strong>2 dias</strong> — 87% de probabilidade</div>
        <div class="ia-suggestion">🔴 <strong>Banana Nanica</strong> esgota em <strong>3 dias</strong> — 92% de probabilidade</div>
        <div class="ia-suggestion">🟡 <strong>Melancia</strong> esgota em <strong>4 dias</strong> — 78% de probabilidade</div>
        <div class="ia-suggestion">🟡 <strong>Tomate</strong> abaixo do ideal em <strong>5 dias</strong> — 71% de probabilidade</div>
        <div class="ia-suggestion">🟢 <strong>Batata Doce</strong> estoque em <strong>7 dias</strong> — monitorar</div>
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

PAGE_RENDERERS.nutricionista_fichas = (el) => {
  const fichasSalvas = JSON.parse(localStorage.getItem('fichas_tecnicas') || '[]');
  const todas = [..._FICHAS_DEMO, ...fichasSalvas];

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Fichas Técnicas de Preparação</div><div class="page-subtitle">Gestão de receitas, ingredientes e cálculo nutricional (Padrão FNDE/PNAE)</div></div>

    <div class="card mb-24">
      <div class="card-body" style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap">
        <div class="header-search-box" style="flex:1;max-width:300px;margin:0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <input type="search" id="search-fichas" placeholder="Buscar receita..." oninput="filterFichas()" style="width:100%">
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:0.8rem;color:var(--text-secondary)">${fichasSalvas.length} salva${fichasSalvas.length !== 1 ? 's' : ''} + ${_FICHAS_DEMO.length} demo</span>
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
    <div class="autocomplete-item" onclick="window.selectIngredienteForId(${ingredienteId}, '${a.name.replace(/'/g, "\\'")}')">
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

  // Salvar no localStorage (simulando Supabase)
  let fichas = JSON.parse(localStorage.getItem('fichas_tecnicas') || '[]');
  fichas.push(receita);
  localStorage.setItem('fichas_tecnicas', JSON.stringify(fichas));

  // Adicionar também ao DATA.produtos para aparecer nos cardápios
  if (!DATA.receitas) DATA.receitas = [];
  DATA.receitas.push(receita);

  alert(`Ficha técnica de "${nome}" criada e salva com sucesso! ✓\n\nEnergia: ${receita.totais.kcal.toFixed(0)} kcal\nProteína: ${receita.totais.proteinas.toFixed(1)}g\nCarboidratos: ${receita.totais.carbos.toFixed(1)}g`);

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
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Cardápios</div><div class="page-subtitle">Elaboração, publicação e vinculação de cardápios escolares</div></div>
    
    <div class="card mb-24">
      <div class="card-body" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div style="font-weight:600">Planejador de Cardápios</div>
        <button class="btn btn-primary" onclick="showMenuPlanner()">+ Abrir Planejador Semanal</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">Cardápios Publicados</div></div>
      <div class="card-body">
        <table class="data-table"><thead><tr><th>Nome</th><th>Período</th><th>Escolas Vinculadas</th><th>Status</th><th>Ações</th></tr></thead><tbody>
          <tr><td><strong>Cardápio Junho/2026 — Regular</strong></td><td>01/06 a 30/06</td><td>152</td><td><span class="status-badge status-ok">Publicado</span></td><td><button class="table-action">Visualizar</button></td></tr>
          <tr><td><strong>Cardápio Junho/2026 — Integral</strong></td><td>01/06 a 30/06</td><td>31</td><td><span class="status-badge status-ok">Publicado</span></td><td><button class="table-action">Visualizar</button></td></tr>
          <tr><td><strong>Cardápio Julho/2026 — Regular</strong></td><td>01/07 a 31/07</td><td>—</td><td><span class="status-badge status-info">Em Elaboração</span></td><td><button class="table-action">Editar</button></td></tr>
        </tbody></table>
      </div>
    </div>
  `;
};

window.showMenuPlanner = () => {
  const container = document.getElementById('page-content');
  container.innerHTML = `
    <div class="page-header"><div class="page-title">Planejador Semanal de Cardápio</div><div class="page-subtitle">Monte as refeições diárias e verifique o valor nutricional acumulado</div></div>
    
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Elaboração do Menu Semanal</div></div>
      <div class="card-body">
        <div style="display:flex;gap:12px;flex-direction:column">
          <div style="border: 1px solid var(--border); border-radius: var(--radius); padding:16px; margin-bottom:12px">
            <div style="font-weight:700;margin-bottom:10px;color:var(--primary)">Segunda-Feira</div>
            <div class="grid-3">
              <div class="form-group">
                <label>Café da Manhã</label>
                <select class="btn btn-outline" style="width:100%;text-align:left;padding:8px" id="planner-mon-breakfast" onchange="calculatePlannerKcal()">
                  <option value="280">Pão com Manteiga e Leite (280 kcal)</option>
                  <option value="210">Vitamina de Banana (210 kcal)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Almoço</label>
                <select class="btn btn-outline" style="width:100%;text-align:left;padding:8px" id="planner-mon-lunch" onchange="calculatePlannerKcal()">
                  <option value="425">Arroz com Feijão Tradicional (425 kcal)</option>
                  <option value="380">Frango Grelhado com Legumes (380 kcal)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Lanche da Tarde</label>
                <select class="btn btn-outline" style="width:100%;text-align:left;padding:8px" id="planner-mon-snack" onchange="calculatePlannerKcal()">
                  <option value="80">Melancia Picada (80 kcal)</option>
                  <option value="210">Vitamina de Banana (210 kcal)</option>
                </select>
              </div>
            </div>
          </div>

          <div style="border: 1px solid var(--border); border-radius: var(--radius); padding:16px; margin-bottom:12px">
            <div style="font-weight:700;margin-bottom:10px;color:var(--primary)">Terça-Feira</div>
            <div class="grid-3">
              <div class="form-group">
                <label>Café da Manhã</label>
                <select class="btn btn-outline" style="width:100%;text-align:left;padding:8px" id="planner-tue-breakfast" onchange="calculatePlannerKcal()">
                  <option value="210">Vitamina de Banana (210 kcal)</option>
                  <option value="280">Pão com Manteiga e Leite (280 kcal)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Almoço</label>
                <select class="btn btn-outline" style="width:100%;text-align:left;padding:8px" id="planner-tue-lunch" onchange="calculatePlannerKcal()">
                  <option value="380">Frango Grelhado com Legumes (380 kcal)</option>
                  <option value="425">Arroz com Feijão Tradicional (425 kcal)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Lanche da Tarde</label>
                <select class="btn btn-outline" style="width:100%;text-align:left;padding:8px" id="planner-tue-snack" onchange="calculatePlannerKcal()">
                  <option value="90">Banana Nanica (90 kcal)</option>
                  <option value="210">Vitamina de Banana (210 kcal)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style="margin-top:20px;padding:16px;background:var(--primary-light);border-radius:var(--radius);display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-weight:700">Média Nutricional Diária Calculada</div>
            <div style="font-size:0.85rem;color:var(--text-secondary)">Meta recomendada PNAE: 650 a 800 kcal/dia</div>
          </div>
          <div style="font-size:1.6rem;font-weight:800;color:var(--primary)" id="planner-total-kcal">785 kcal</div>
        </div>

        <div style="display:flex;gap:12px;margin-top:20px;justify-content:flex-end">
          <button class="btn btn-outline" onclick="cancelMenuPlanner()">Cancelar</button>
          <button class="btn btn-primary" onclick="saveWeeklyMenu()">Publicar Cardápio Semanal</button>
        </div>
      </div>
    </div>
  `;
};

window.calculatePlannerKcal = () => {
  const b1 = parseInt(document.getElementById('planner-mon-breakfast').value) || 0;
  const l1 = parseInt(document.getElementById('planner-mon-lunch').value) || 0;
  const s1 = parseInt(document.getElementById('planner-mon-snack').value) || 0;
  const total = b1 + l1 + s1;
  document.getElementById('planner-total-kcal').textContent = `${total} kcal`;
};

window.cancelMenuPlanner = () => {
  const container = document.getElementById('page-content');
  PAGE_RENDERERS.nutricionista_cardapios(container);
};

window.saveWeeklyMenu = () => {
  alert('Cardápio semanal publicado com sucesso e distribuído para a rede escolar!');
  const container = document.getElementById('page-content');
  PAGE_RENDERERS.nutricionista_cardapios(container);
};

PAGE_RENDERERS.nutricionista_planejamento = (el) => { PAGE_RENDERERS.gestor_planejamento(el); };
PAGE_RENDERERS.nutricionista_escolas = (el) => { PAGE_RENDERERS.gestor_escolas(el); };

// Painel de escolas compartilhado: escola vê todas da rede (para referência),
// cooperativa vê pontos de entrega, almoxarifado vê destinos, motorista vê sua rota
PAGE_RENDERERS.escola_escolas = (el) => {
  const schools = DATA.schools || [];
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Escolas da Rede Municipal</div>
      <div class="page-subtitle">${schools.length} unidades — consulte contatos e situação de abastecimento</div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Listagem de Escolas</div>
        <div class="filter-bar" style="margin:0">
          <select id="filter-region-e" onchange="window._filterEscolasTable('filter-region-e','filter-status-e','table-escolas-e')">
            <option value="">Todas as Regiões</option>
            ${[...new Set(schools.map(s=>s.region))].sort().map(r=>`<option>${r}</option>`).join('')}
          </select>
          <select id="filter-status-e" onchange="window._filterEscolasTable('filter-region-e','filter-status-e','table-escolas-e')">
            <option value="">Todos os Status</option>
            <option value="ok">Abastecida</option><option value="warning">Atenção</option><option value="danger">Risco</option>
          </select>
        </div>
      </div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table" id="table-escolas-e">
            <thead><tr><th>Escola</th><th>Região</th><th>Modalidade</th><th>Diretor(a)</th><th>Alunos</th><th>Estoque</th><th>Status</th><th>Última Entrega</th></tr></thead>
            <tbody>
              ${schools.map(s => `
              <tr>
                <td><strong>${s.name}</strong></td>
                <td><span class="tag tag-blue">${s.region}</span></td>
                <td><span class="tag tag-teal" style="font-size:0.7rem">${s.modality || 'Escolar Urbana'}</span></td>
                <td>${s.director}</td>
                <td style="font-family:var(--font-mono)">${s.students}</td>
                <td><div style="display:flex;align-items:center;gap:8px">
                  <div class="progress-bar" style="width:80px"><div class="progress-fill ${s.stockPct>60?'green':s.stockPct>30?'orange':'red'}" style="width:${s.stockPct}%"></div></div>
                  <span style="font-family:var(--font-mono);font-size:0.78rem">${s.stockPct}%</span>
                </div></td>
                <td><span class="status-badge ${statusClass(s.stockStatus)}">${statusLabel(s.stockStatus)}</span></td>
                <td style="font-size:0.82rem">${s.lastDelivery ? formatDate(s.lastDelivery) : '—'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
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
                <td><button class="table-action" onclick="alert('Programar entrega para ${s.name.replace(/'/g,"\\'")}')">Programar →</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.agricultor_escolas = (el) => { PAGE_RENDERERS.cooperativa_escolas(el); };

PAGE_RENDERERS.almoxarifado_escolas = (el) => {
  const schools = DATA.schools || [];
  const porRegiao = {};
  schools.forEach(s => {
    if (!porRegiao[s.region]) porRegiao[s.region] = [];
    porRegiao[s.region].push(s);
  });
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Escolas / Destinos de Entrega</div>
      <div class="page-subtitle">Organização por região para roteamento de cargas</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${schools.length}</div><div class="kpi-label">Destinos</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🗺️</div><div class="kpi-value">${Object.keys(porRegiao).length}</div><div class="kpi-label">Regiões</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${schools.filter(s=>s.stockStatus!=='ok').length}</div><div class="kpi-label">Precisam Reabastecimento</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${schools.filter(s=>s.stockStatus==='ok').length}</div><div class="kpi-label">Abastecidas</div></div>
    </div>
    ${Object.entries(porRegiao).sort().map(([regiao, esc]) => `
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <div class="card-title">📍 ${regiao}</div>
        <span class="tag tag-blue">${esc.length} escola${esc.length>1?'s':''}</span>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
          ${esc.map(s => `
          <div style="border:1px solid var(--border);border-radius:8px;padding:12px;background:var(--surface-1)">
            <div style="font-weight:600;margin-bottom:6px">${s.name}</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:8px">${s.modality || 'Escolar Urbana'} · ${s.students} alunos · Dir: ${s.director}</div>
            <div style="display:flex;align-items:center;justify-content:space-between">
              <div style="display:flex;align-items:center;gap:6px">
                <div class="progress-bar" style="width:70px"><div class="progress-fill ${s.stockPct>60?'green':s.stockPct>30?'orange':'red'}" style="width:${s.stockPct}%"></div></div>
                <span style="font-size:0.78rem;font-family:var(--font-mono)">${s.stockPct}%</span>
              </div>
              <span class="status-badge ${statusClass(s.stockStatus)}" style="font-size:0.7rem">${statusLabel(s.stockStatus)}</span>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>`).join('')}
  `;
};

PAGE_RENDERERS.motorista_escolas = (el) => {
  const schools = DATA.schools || [];
  const hoje = new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' });
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Escolas da Rota</div>
      <div class="page-subtitle">Destinos de entrega · ${hoje}</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${schools.length}</div><div class="kpi-label">Total de Escolas</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📦</div><div class="kpi-value">${schools.filter(s=>s.stockStatus!=='ok').length}</div><div class="kpi-label">Aguardam Entrega</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${schools.filter(s=>s.stockStatus==='ok').length}</div><div class="kpi-label">Abastecidas</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Lista de Escolas para Entrega</div></div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:10px">
          ${schools.sort((a,b) => (a.stockStatus==='danger'?0:a.stockStatus==='warning'?1:2) - (b.stockStatus==='danger'?0:b.stockStatus==='warning'?1:2)).map((s,i) => `
          <div style="display:flex;align-items:center;gap:14px;padding:12px;border:1px solid var(--border);border-radius:8px;background:var(--surface-1)">
            <div style="width:28px;height:28px;border-radius:50%;background:var(--primary-100);color:var(--primary);font-weight:700;display:flex;align-items:center;justify-content:center;font-size:0.8rem;flex-shrink:0">${i+1}</div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:600">${s.name}</div>
              <div style="font-size:0.78rem;color:var(--text-secondary)">${s.region} · ${s.director} · ${s.students} alunos</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
              <div class="progress-bar" style="width:60px"><div class="progress-fill ${s.stockPct>60?'green':s.stockPct>30?'orange':'red'}" style="width:${s.stockPct}%"></div></div>
              <span style="font-size:0.78rem;font-family:var(--font-mono)">${s.stockPct}%</span>
              <span class="status-badge ${statusClass(s.stockStatus)}" style="font-size:0.7rem">${statusLabel(s.stockStatus)}</span>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.nutricionista_consumo = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Monitoramento de Consumo</div><div class="page-subtitle">Comparativo entre consumo previsto e realizado</div></div>
    <div class="card"><div class="card-header"><div class="card-title">📊 Comparativo por Produto</div></div><div class="card-body"><div class="chart-container h-300"><canvas id="chart-comparativo"></canvas></div></div></div>
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
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Desperdícios</div><div class="page-subtitle">Monitoramento e controle de sobras e desperdício de alimentos</div></div>
    
    <div class="kpi-grid">
      <div class="kpi-card red"><div class="kpi-icon">🗑️</div><div class="kpi-value" id="waste-total-pct">3,7%</div><div class="kpi-label">Índice Geral</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📊</div><div class="kpi-value" id="waste-total-kg">1.598</div><div class="kpi-label">kg Desperdiçados/Mês</div></div>
      <div class="kpi-card green"><div class="kpi-icon">📉</div><div class="kpi-value">-0,5%</div><div class="kpi-label">vs Mês Anterior</div></div>
    </div>

    <div class="grid-2 mb-24">
      <div class="card">
        <div class="card-header"><div class="card-title">Registrar Sobras / Desperdício por Escola</div></div>
        <div class="card-body">
          <form id="form-log-waste" onsubmit="handleLogWaste(event)">
            <div class="form-group">
              <label>Selecione a Escola</label>
              <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="waste-school" required>
                <option value="EM Hércules M.">EM Hércules Maymone</option>
                <option value="EM Franklin R.">EM Franklin Roosevelt</option>
                <option value="EM Arlindo L.">EM Arlindo Lima</option>
              </select>
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

function getStockSuggestions(targetKcal) {
  return RECIPE_LIBRARY.map(recipe => {
    const linkedIngredients = recipe.ingredients.map(ing => {
      const product = DATA.products.find(p => p.name === ing.name);
      return { ...ing, product };
    });
    const missing = linkedIngredients.filter(i => !i.product);
    const worstDaysLeft = linkedIngredients.reduce((min, i) => i.product ? Math.min(min, i.product.daysLeft) : min, Infinity);
    const familyFarmCount = linkedIngredients.filter(i => i.product && i.product.familyFarm).length;
    const kcalDiff = Math.abs(recipe.kcal - targetKcal);
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
  const suggestions = getStockSuggestions(kcal);

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

PAGE_RENDERERS.nutricionista_simulacoes = (el) => {
  let options = '';
  for (const key in DRI_TABLE) {
    options += `<option value="${key}">${DRI_TABLE[key].name}</option>`;
  }
  
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Simulações de Cardápios & PNAE</div><div class="page-subtitle">Verifique o enquadramento de macronutrientes (% VET) nas diretrizes do FNDE/PNAE</div></div>
    
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
  window.renderStockSuggestions();
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
  `;
  window.renderStockSuggestions();
};

PAGE_RENDERERS.nutricionista_relatorios = (el) => { PAGE_RENDERERS.gestor_relatorios(el); };

PAGE_RENDERERS.nutricionista_ia = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">IA Nutricional — Assistente Preditivo</div><div class="page-subtitle">Análise de carências nutricionais e otimização por IA</div></div>
    
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">🤖 Sugestões do Assistente de IA</div></div>
      <div class="card-body">
        <div style="display:flex;flex-direction:column;gap:16px">
          <div style="border: 1px solid var(--border); border-radius: var(--radius); padding:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px">
            <div style="flex:1">
              <div style="font-weight:700;font-size:1rem;color:var(--primary)">🔄 Substituição Estratégica de Safra</div>
              <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">Substituir Melancia por Manga Tommy no cardápio de lanche. A Manga Tommy está com alta oferta de produtores da COOPAGRAN este mês.</div>
              <div style="font-size:0.8rem;color:var(--success);margin-top:6px;font-weight:600">✓ Redução de 18% no custo global / ✓ Fortalece a agricultura familiar local</div>
            </div>
            <div>
              <button class="btn btn-primary btn-sm" id="btn-ia-apply-crop" onclick="applyIaCropSuggestion()">Aplicar no Cardápio</button>
            </div>
          </div>

          <div style="border: 1px solid var(--border); border-radius: var(--radius); padding:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px">
            <div style="flex:1">
              <div style="font-weight:700;font-size:1rem;color:var(--primary)">🌾 Integração de Tubérculos Familiares</div>
              <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">Aumentar a porção de Mandioca cozida nas refeições escolares, reduzindo 10g da porção de arroz.</div>
              <div style="font-size:0.8rem;color:var(--success);margin-top:6px;font-weight:600">✓ Aumenta consumo de fibras em 12% / ✓ Absorve o excedente de produção local</div>
            </div>
            <div>
              <button class="btn btn-primary btn-sm" id="btn-ia-apply-fiber" onclick="applyIaFiberSuggestion()">Aplicar no Cardápio</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
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
  const name = (window._STATE && window._STATE.schoolName) ? window._STATE.schoolName : 'EM Arlindo Lima';
  const all = (typeof DATA !== 'undefined' && DATA.schools) ? DATA.schools : [];
  return all.find(sc => sc.name === name) || {
    name, students: 620, attendance_avg: 572, attendance_pct: 92,
    stock_pct: 82, grade_levels: 'EF I + EF II', meals_per_day: 2,
    monthly_budget: 18500, region: 'Anhanduizinho', director: 'Maria Santos'
  };
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
        <div class="page-subtitle">${sc.grade_levels || 'EF I + EF II'} \u00b7 ${sc.region || ''} \u00b7 Diretor(a): ${sc.director || ''}</div>
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
  const lanche = ['Vitamina de Banana','Pão c/ Manteiga','Mingau de Aveia','Vitamina de Banana','Pão c/ Queijo'];
  const almoco = ['Arroz, Feijão, Frango Grelhado','Macarrão c/ Carne Moída','Arroz, Feijão, Peixe Assado','Arroz, Feijão, Ovo Cozido','Sopa de Legumes c/ Frango'];
  const dias = ['Seg','Ter','Qua','Qui','Sex'];
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Planejamento Alimentar — ${sc.name}</div>
      <div class="page-subtitle">Cardápio semanal aprovado pelo Nutricionista — Junho 2026</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">👨‍🎓</div><div class="kpi-value">${sc.attendance_avg||572}</div><div class="kpi-label">Alunos p/ Refeição</div></div>
      <div class="kpi-card green"><div class="kpi-icon">🍽️</div><div class="kpi-value">${sc.meals_per_day||2}</div><div class="kpi-label">Refeições/Dia</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📅</div><div class="kpi-value">5</div><div class="kpi-label">Dias Letivos/Sem.</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">💰</div><div class="kpi-value">R$ 1,06</div><div class="kpi-label">Per Capita/Refeição</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📅 Cardápio — Semana 23–27/Jun</div><span class="status-badge status-ok">✓ Aprovado</span></div>
      <div class="card-body" style="padding:0;overflow-x:auto">
        <table class="data-table">
          <thead><tr><th style="width:130px">Refeição</th>${dias.map(d=>`<th style="text-align:center">${d}</th>`).join('')}</tr></thead>
          <tbody>
            <tr>
              <td><strong>☀️ Lanche</strong><div style="font-size:0.75rem;color:var(--text-secondary)">09h30</div></td>
              ${lanche.map(m=>`<td style="text-align:center;font-size:0.82rem;padding:12px 8px">${m}</td>`).join('')}
            </tr>
            <tr>
              <td><strong>🍽️ Almoço</strong><div style="font-size:0.75rem;color:var(--text-secondary)">11h30</div></td>
              ${almoco.map(m=>`<td style="text-align:center;font-size:0.82rem;padding:12px 8px">${m}</td>`).join('')}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card-header"><div class="card-title">📦 Necessidade Semanal</div></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
          ${[['Arroz Tipo 1','210 kg'],['Feijão Carioca','90 kg'],['Frango','175 kg'],['Banana Nanica','125 kg'],['Leite Integral','240 L'],['Tomate','60 kg'],['Cenoura','75 kg'],['Mandioca','80 kg']].map(([n,q])=>`
            <div style="background:var(--surface-1);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px">
              <div style="font-weight:600;font-size:0.85rem">${n}</div>
              <div style="font-size:1.3rem;font-weight:700;color:var(--primary);margin-top:4px">${q}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
};

PAGE_RENDERERS.escola_cardapios = (el) => { PAGE_RENDERERS.nutricionista_cardapios(el); };

// ─── ESCOLA: ESTOQUE ───
PAGE_RENDERERS.escola_estoque = (el) => {
  const sc = getCurrentSchool();
  const products = (typeof DATA !== 'undefined' && DATA.products) ? DATA.products : [];
  const critical = products.filter(p=>(p.days_left||99)<=3).length;
  const warning = products.filter(p=>(p.days_left||99)>3&&(p.days_left||99)<=7).length;
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Estoque — ${sc.name}</div>
      <div class="page-subtitle">Controle de produtos, entradas e saídas</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${products.length}</div><div class="kpi-label">Produtos</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${products.length-critical-warning}</div><div class="kpi-label">Normal</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚡</div><div class="kpi-value">${warning}</div><div class="kpi-label">Atenção</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${critical}</div><div class="kpi-label">Crítico</div></div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">Produtos em Estoque</div>
        <button class="btn btn-primary btn-sm" onclick="navigateTo('escola','pedidos')">🛒 Solicitar Reposição</button>
      </div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Categoria</th><th style="text-align:right">Qtd. Escola</th><th>Un.</th><th style="text-align:right">Dias Restantes</th><th>Status</th></tr></thead>
          <tbody>
            ${products.map(p => {
              const schoolQty = Math.round((p.stock||0)/20);
              const daysLeft = p.days_left || p.daysLeft || 0;
              const [cls, label] = daysLeft<=3 ? ['status-danger','Crítico'] : daysLeft<=7 ? ['status-warning','Atenção'] : ['status-ok','Normal'];
              return `<tr>
                <td><strong>${p.name}</strong></td>
                <td><span class="status-badge status-info" style="font-size:0.72rem">${p.category||'—'}</span></td>
                <td style="text-align:right;font-family:var(--font-mono)">${schoolQty}</td>
                <td>${p.unit||'kg'}</td>
                <td style="text-align:right;font-weight:700;color:${daysLeft<=3?'var(--danger)':daysLeft<=7?'var(--warning)':'var(--success)'}">${daysLeft}d</td>
                <td><span class="status-badge ${cls}">${label}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
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
          <div class="card-header"><div class="card-title">Registros Recentes</div></div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Data</th><th>Refeição</th><th>Produto</th><th style="text-align:right">Qtd</th><th>Responsável</th></tr></thead>
              <tbody>
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
    try {
      const { error } = await _sb.from('consumption_records').insert([{
        school: sc.name, product_name: document.getElementById('cons-product')?.value,
        meal_type: document.getElementById('cons-meal')?.value, quantity: qty,
        unit: document.getElementById('cons-unit')?.value,
        date: document.getElementById('cons-date')?.value,
        responsible: document.getElementById('cons-resp')?.value,
      }]);
      if (error) throw error;
      fb.style.display='block'; fb.innerHTML='<span style="color:var(--success)">✅ Consumo registrado!</span>';
      document.getElementById('cons-qty').value='';
    } catch(e) {
      fb.style.display='block'; fb.innerHTML=`<span style="color:var(--danger)">⚠️ ${e.message||'Erro ao salvar.'}</span>`;
    } finally { btn.disabled=false; btn.textContent='✅ Registrar Consumo'; }
  });
};

// ─── ESCOLA: PEDIDOS ───
PAGE_RENDERERS.escola_pedidos = (el) => {
  const sc = getCurrentSchool();
  const products = (typeof DATA !== 'undefined' && DATA.products) ? DATA.products : [];
  const coops = (typeof DATA !== 'undefined' && DATA.cooperatives) ? DATA.cooperatives : [{name:'COOPAGRAN'},{name:'COOPRAN'},{name:'COOPAERGS'}];
  const orders = (typeof DATA !== 'undefined' && DATA.orders) ? DATA.orders : [];
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
        <div class="card-header"><div class="card-title">📋 Histórico</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>#</th><th>Data</th><th>Cooperativa</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>#001</td><td>24/06</td><td>COOPAGRAN</td><td>R$ 8.500</td><td><span class="status-badge status-danger">Pendente</span></td></tr>
              <tr><td>#002</td><td>20/06</td><td>COOPAGRAN</td><td>R$ 8.200</td><td><span class="status-badge status-ok">Entregue</span></td></tr>
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
    btn.disabled=true; btn.textContent='Enviando...';
    try {
      const {error}=await _sb.from('orders').insert([{school:sc.name,date:new Date().toISOString().split('T')[0],status:'Pendente',cooperative:document.getElementById('ped-coop')?.value,value:Math.round(Math.random()*5000+3000)}]);
      if(error) throw error;
      fb.style.display='block'; fb.innerHTML='<span style="color:var(--success)">✅ Pedido enviado!</span>';
    } catch(e) {
      fb.style.display='block'; fb.innerHTML=`<span style="color:var(--danger)">⚠️ ${e.message||'Erro.'}</span>`;
    } finally { btn.disabled=false; btn.textContent='📤 Enviar Pedido'; }
  });
};

// ─── ESCOLA: ENTREGAS ───
PAGE_RENDERERS.escola_entregas = (el) => {
  const sc = getCurrentSchool();
  const orders = (typeof DATA !== 'undefined' && DATA.orders) ? DATA.orders : [];
  const active = orders.filter(o=>o.status!=='Entregue').slice(0,5);
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Recebimento de Entregas — ${sc.name}</div>
      <div class="page-subtitle">Conferência e confirmação de recebimento</div>
    </div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">🚚 Entregas em Andamento</div></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>#</th><th>Cooperativa</th><th>Data</th><th>Valor</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${active.map((o,i)=>`<tr>
              <td style="font-family:var(--font-mono)">#${String(i+1).padStart(3,'0')}</td>
              <td>${o.cooperative||'—'}</td><td>${o.date||'—'}</td>
              <td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
              <td><span class="status-badge ${o.status==='Pendente'?'status-danger':o.status?.includes?.('separ')?'status-warning':'status-info'}">${o.status||'—'}</span></td>
              <td><button class="btn btn-sm btn-primary" onclick="alert('Recebimento #${String(i+1).padStart(3,"0")} confirmado!')">✅ Confirmar</button></td>
            </tr>`).join('')||'<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma entrega pendente</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📍 Timeline da Entrega em Andamento</div></div>
      <div class="card-body">
        <div class="timeline">
          <div class="timeline-item completed"><div class="timeline-dot"></div><div class="timeline-title">Pedido Solicitado</div><div class="timeline-desc">${sc.name} enviou pedido</div><div class="timeline-time">22/06/2026 — 09:15</div></div>
          <div class="timeline-item completed"><div class="timeline-dot"></div><div class="timeline-title">Aceito pela Cooperativa</div><div class="timeline-desc">COOPAGRAN confirmou e iniciou separação</div><div class="timeline-time">22/06/2026 — 14:30</div></div>
          <div class="timeline-item completed"><div class="timeline-dot"></div><div class="timeline-title">Em Separação</div><div class="timeline-desc">Produtos sendo separados pelos agricultores</div><div class="timeline-time">23/06/2026 — 08:00</div></div>
          <div class="timeline-item active"><div class="timeline-dot"></div><div class="timeline-title">Em Transporte</div><div class="timeline-desc">Veículo saiu — ETA: amanhã até 10h</div><div class="timeline-time">24/06/2026 — 07:30</div></div>
          <div class="timeline-item pending"><div class="timeline-dot"></div><div class="timeline-title">Aguardando Confirmação na Escola</div><div class="timeline-desc">Conferir itens e assinar recibo</div><div class="timeline-time">—</div></div>
        </div>
      </div>
    </div>`;
};

// ─── ESCOLA: HISTÓRICO ───
PAGE_RENDERERS.escola_historico = (el) => {
  const sc = getCurrentSchool();
  const orders = (typeof DATA !== 'undefined' && DATA.orders) ? DATA.orders : [];
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Histórico — ${sc.name}</div>
      <div class="page-subtitle">Consulta histórica de pedidos, consumo e entregas</div>
    </div>
    <div class="card mb-16">
      <div class="card-header">
        <div class="card-title">Filtros</div>
        <div style="display:flex;gap:8px">
          <select style="padding:6px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem"><option>Todos os tipos</option><option>Pedido</option><option>Consumo</option><option>Entrega</option></select>
          <input type="month" value="2026-06" style="padding:6px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem">
          <button class="btn btn-primary btn-sm">🔍 Filtrar</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Tipo</th><th>Ref.</th><th>Data</th><th>Detalhes</th><th>Valor/Qtd</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td><span class="status-badge status-info">Pedido</span></td><td>#003</td><td>24/06</td><td>COOPAGRAN — 5 produtos</td><td>R$ 8.500</td><td><span class="status-badge status-danger">Pendente</span></td></tr>
            <tr><td><span class="status-badge status-warning">Consumo</span></td><td>Jun/2026</td><td>24/06</td><td>Almoço — ${sc.attendance_avg||572} alunos</td><td>95 kg</td><td><span class="status-badge status-ok">Registrado</span></td></tr>
            <tr><td><span class="status-badge status-ok">Entrega</span></td><td>#002</td><td>20/06</td><td>COOPAGRAN — 8 produtos</td><td>R$ 8.200</td><td><span class="status-badge status-ok">Confirmada</span></td></tr>
            ${orders.slice(0,5).map((o,i)=>`<tr>
              <td><span class="status-badge status-info">Pedido</span></td>
              <td>#${String(i+10).padStart(3,'0')}</td><td>${o.date||'—'}</td>
              <td>${o.cooperative||'—'}</td>
              <td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
              <td><span class="status-badge ${o.status==='Entregue'?'status-ok':o.status==='Pendente'?'status-danger':'status-warning'}">${o.status||'—'}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
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
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Dashboard — COOPAGRAN</div><div class="page-subtitle">Visão geral das operações da cooperativa</div></div>
    <div class="kpi-grid">
      <div class="kpi-card green"><div class="kpi-icon">👨‍🌾</div><div class="kpi-value">28</div><div class="kpi-label">Agricultores Ativos</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">🥕</div><div class="kpi-value">14</div><div class="kpi-label">Produtos Disponíveis</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📋</div><div class="kpi-value">5</div><div class="kpi-label">Pedidos Pendentes</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">📅</div><div class="kpi-value">8</div><div class="kpi-label">Entregas Programadas</div></div>
      <div class="kpi-card red"><div class="kpi-icon">⏰</div><div class="kpi-value">2</div><div class="kpi-label">Entregas em Atraso</div></div>
      <div class="kpi-card purple"><div class="kpi-icon">💰</div><div class="kpi-value">${formatCurrency(1450000)}</div><div class="kpi-label">Valor Executado</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">📊</div><div class="kpi-value">${formatCurrency(5200000 - 2860000)}</div><div class="kpi-label">Saldo Contratual</div></div>
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
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Agricultores</div><div class="page-subtitle">Cadastro e acompanhamento dos agricultores vinculados</div></div>
    <div class="card">
      <div class="card-header"><div class="card-title">Agricultores Vinculados</div><button class="btn btn-primary btn-sm">+ Novo Agricultor</button></div>
      <div class="card-body">
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
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Pedidos</div><div class="page-subtitle">Pedidos recebidos das escolas e distribuição para agricultores</div></div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Pedidos Recebidos</div></div>
      <div class="card-body">
        <table class="data-table"><thead><tr><th>#</th><th>Escola</th><th>Data</th><th>Valor</th><th>Status</th><th>Ações</th></tr></thead><tbody>
          ${DATA.orders.filter(o => o.coop === 'COOPAGRAN').map(o => `<tr>
            <td style="font-family:var(--font-mono)">#${String(o.id).padStart(3,'0')}</td>
            <td><strong>${o.school}</strong></td><td>${formatDate(o.date)}</td>
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

PAGE_RENDERERS.cooperativa_planejamento = (el) => { PAGE_RENDERERS.escola_planejamento(el); };
PAGE_RENDERERS.cooperativa_rotas = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Rotas</div><div class="page-subtitle">Otimização de rotas de entrega</div></div>
    <div class="card"><div class="card-header"><div class="card-title">🗺️ Mapa de Rotas — Campo Grande</div></div><div class="card-body"><div class="map-container" id="map-container-rotas"></div></div></div>
    <div class="grid-3" style="margin-top:20px">
      <div class="card"><div class="card-body" style="text-align:center"><div style="font-size:2rem">🚚</div><div style="font-family:var(--font-mono);font-size:1.5rem;font-weight:700;margin:8px 0">3</div><div style="font-size:0.82rem;color:var(--text-secondary)">Rotas Otimizadas</div></div></div>
      <div class="card"><div class="card-body" style="text-align:center"><div style="font-size:2rem">📏</div><div style="font-family:var(--font-mono);font-size:1.5rem;font-weight:700;margin:8px 0">127 km</div><div style="font-size:0.82rem;color:var(--text-secondary)">Distância Total</div></div></div>
      <div class="card"><div class="card-body" style="text-align:center"><div style="font-size:2rem">💰</div><div style="font-family:var(--font-mono);font-size:1.5rem;font-weight:700;margin:8px 0">R$ 340</div><div style="font-size:0.82rem;color:var(--text-secondary)">Custo Estimado</div></div></div>
    </div>
  `;
  setTimeout(() => {
    const c = document.getElementById('map-container-rotas');
    if (c) { renderMap(); }
  }, 100);
};
PAGE_RENDERERS.cooperativa_contratos = (el) => { PAGE_RENDERERS.gestor_atas(el); };
PAGE_RENDERERS.cooperativa_entregas = (el) => { PAGE_RENDERERS.escola_entregas(el); };
PAGE_RENDERERS.cooperativa_relatorios = (el) => { PAGE_RENDERERS.gestor_relatorios(el); };
PAGE_RENDERERS.cooperativa_indicadores = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Indicadores de Performance</div><div class="page-subtitle">Métricas de desempenho da COOPAGRAN</div></div>
    <div class="kpi-grid">
      <div class="kpi-card green"><div class="kpi-icon">🎯</div><div class="kpi-value">89%</div><div class="kpi-label">Taxa de Atendimento</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">📅</div><div class="kpi-value">94%</div><div class="kpi-label">Entregas no Prazo</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">📊</div><div class="kpi-value">12.4t</div><div class="kpi-label">Volume Fornecido</div></div>
      <div class="kpi-card purple"><div class="kpi-icon">👨‍🌾</div><div class="kpi-value">28</div><div class="kpi-label">Participação por Agricultor</div></div>
    </div>
    <div class="card"><div class="card-header"><div class="card-title">📈 Evolução da Taxa de Atendimento</div></div><div class="card-body"><div class="chart-container h-300"><canvas id="chart-indicadores"></canvas></div></div></div>
  `;
  setTimeout(() => {
    createChart('chart-indicadores', {
      type: 'line',
      data: { labels: DATA.months.slice(0,6), datasets: [{ label: 'Taxa de Atendimento (%)', data: [82, 85, 88, 86, 91, 89], borderColor: CHART_COLORS.green, backgroundColor: CHART_COLORS.greenFill, fill: true, tension: 0.4 }] },
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

PAGE_RENDERERS.agricultor_producao = (el) => { el.innerHTML = renderCrudScreen('Minha Produção', 'Cadastro e acompanhamento da produção agrícola', ['Produto','Área Plantada (ha)','Produção Prevista (kg)','Produção Disponível (kg)','Status'], [['Mandioca','5','2.500','1.200','Em produção'],['Banana Nanica','4','1.400','800','Em produção'],['Abóbora Cabotiá','3','600','200','Pré-colheita']]); };
PAGE_RENDERERS.agricultor_estoque = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Estoque</div><div class="page-subtitle">Controle de produtos disponíveis para venda</div></div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Estoque Atual</div><button class="btn btn-primary btn-sm">Atualizar Estoque</button></div>
      <div class="card-body">
        <table class="data-table"><thead><tr><th>Produto</th><th>Disponível (kg)</th><th>Reservado (kg)</th><th>Livre (kg)</th></tr></thead><tbody>
          <tr><td><strong>Mandioca</strong></td><td style="font-family:var(--font-mono)">1.200</td><td style="font-family:var(--font-mono)">200</td><td style="font-family:var(--font-mono);color:var(--success)">1.000</td></tr>
          <tr><td><strong>Banana Nanica</strong></td><td style="font-family:var(--font-mono)">800</td><td style="font-family:var(--font-mono)">150</td><td style="font-family:var(--font-mono);color:var(--success)">650</td></tr>
          <tr><td><strong>Abóbora Cabotiá</strong></td><td style="font-family:var(--font-mono)">200</td><td style="font-family:var(--font-mono)">0</td><td style="font-family:var(--font-mono);color:var(--success)">200</td></tr>
        </tbody></table>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.agricultor_pedidos = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Gestão de Pedidos</div><div class="page-subtitle">Pedidos recebidos da cooperativa</div></div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Pedidos Recebidos</div></div>
      <div class="card-body">
        <table class="data-table"><thead><tr><th>Pedido</th><th>Produto</th><th>Quantidade</th><th>Data Limite</th><th>Status</th><th>Ações</th></tr></thead><tbody>
          <tr><td>#P-001</td><td><strong>Mandioca</strong></td><td>200 kg</td><td>25/06/2026</td><td><span class="status-badge status-danger">Pendente</span></td>
            <td><button class="btn btn-sm btn-success">Aceitar</button> <button class="btn btn-sm btn-outline">Ajustar</button></td></tr>
          <tr><td>#P-002</td><td><strong>Banana Nanica</strong></td><td>150 kg</td><td>27/06/2026</td><td><span class="status-badge status-ok">Confirmado</span></td>
            <td><button class="btn btn-sm btn-outline">Detalhes</button></td></tr>
        </tbody></table>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.agricultor_entregas = (el) => { PAGE_RENDERERS.escola_entregas(el); };
PAGE_RENDERERS.agricultor_calendario = (el) => { PAGE_RENDERERS.escola_planejamento(el); };
PAGE_RENDERERS.agricultor_relatorios = (el) => { PAGE_RENDERERS.gestor_relatorios(el); };

PAGE_RENDERERS.agricultor_perfil = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Meu Perfil</div><div class="page-subtitle">Dados pessoais e da propriedade</div></div>
    <div class="grid-2">
      <div class="card"><div class="card-header"><div class="card-title">👤 Dados Pessoais</div></div><div class="card-body">
        <div class="form-row"><div class="form-field"><label>Nome</label><div class="field-value">José Maria Rodrigues</div></div><div class="form-field"><label>CPF</label><div class="field-value">123.456.789-00</div></div></div>
        <div class="form-row"><div class="form-field"><label>Endereço</label><div class="field-value">Estrada Rural, Km 12 — Campo Grande, MS</div></div><div class="form-field"><label>Telefone</label><div class="field-value">(67) 99123-4567</div></div></div>
      </div></div>
      <div class="card"><div class="card-header"><div class="card-title">🏡 Dados da Propriedade</div></div><div class="card-body">
        <div class="form-row"><div class="form-field"><label>Nome da Propriedade</label><div class="field-value">Sítio Boa Esperança</div></div><div class="form-field"><label>Área Total</label><div class="field-value">15 hectares</div></div></div>
        <div class="form-row"><div class="form-field"><label>Área Produtiva</label><div class="field-value">12 hectares</div></div><div class="form-field"><label>Cooperativa</label><div class="field-value">COOPAGRAN</div></div></div>
      </div></div>
    </div>
    <div class="grid-2" style="margin-top:20px">
      <div class="card"><div class="card-header"><div class="card-title">🌱 Produtos Produzidos</div></div><div class="card-body">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <span class="tag tag-green" style="font-size:0.85rem;padding:6px 16px">🥔 Mandioca</span>
          <span class="tag tag-green" style="font-size:0.85rem;padding:6px 16px">🍌 Banana Nanica</span>
          <span class="tag tag-green" style="font-size:0.85rem;padding:6px 16px">🎃 Abóbora Cabotiá</span>
        </div>
      </div></div>
      <div class="card"><div class="card-header"><div class="card-title">📄 Documentos</div></div><div class="card-body">
        <div class="form-row"><div class="form-field"><label>CAF/DAP</label><div class="field-value"><span class="status-badge status-ok">Válida até 12/2026</span></div></div></div>
        <div class="form-row"><div class="form-field"><label>Certificação Orgânica</label><div class="field-value"><span class="status-badge status-info">Em processo</span></div></div></div>
      </div></div>
    </div>
  `;
};

// ─── ALMOXARIFADO: RENDERERS ───
PAGE_RENDERERS.almoxarifado_dashboard = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Dashboard Operacional</div><div class="page-subtitle">Controle de separação e expedição de alimentos</div></div>
    
    <div class="grid-4 mb-24">
      <div class="card stat-card"><div class="card-body">
        <div class="stat-icon" style="color:var(--warning);background:var(--warning-light)">📦</div>
        <div class="stat-info"><div class="stat-num" id="picking-pending-count">2</div><div class="stat-name">Pedidos para Separar</div></div>
      </div></div>
      <div class="card stat-card"><div class="card-body">
        <div class="stat-icon" style="color:var(--info);background:var(--info-light)">🚚</div>
        <div class="stat-info"><div class="stat-num">3</div><div class="stat-name">Veículos na Rota</div></div>
      </div></div>
      <div class="card stat-card"><div class="card-body">
        <div class="stat-icon" style="color:var(--danger);background:var(--danger-light)">⚠️</div>
        <div class="stat-info"><div class="stat-num">1</div><div class="stat-name">Lotes Vencendo (30d)</div></div>
      </div></div>
      <div class="card stat-card"><div class="card-body">
        <div class="stat-icon" style="color:var(--success);background:var(--success-light)">✓</div>
        <div class="stat-info"><div class="stat-num">14</div><div class="stat-name">Entregas Concluídas</div></div>
      </div></div>
    </div>

    <div class="grid-2 mb-24">
      <div class="card"><div class="card-header"><div class="card-title">Expedição Diária</div></div><div class="card-body" style="height:250px">
        <canvas id="chart-almox-expedicao"></canvas>
      </div></div>
      <div class="card"><div class="card-header"><div class="card-title">Status dos Veículos de Entrega</div></div><div class="card-body">
        <table class="data-table"><thead><tr><th>Placa / Motorista</th><th>Rota</th><th>Carga (%)</th><th>Status</th></tr></thead><tbody>
          <tr><td><strong>ABC-1234</strong> / José Souza</td><td>Anhanduizinho</td><td style="font-family:var(--font-mono)">85%</td><td><span class="status-badge status-warning">Em trânsito</span></td></tr>
          <tr><td><strong>DEF-5678</strong> / Marcos Lima</td><td>Bandeira</td><td style="font-family:var(--font-mono)">95%</td><td><span class="status-badge status-ok">Entregue</span></td></tr>
          <tr><td><strong>GHI-9012</strong> / Valdir Neto</td><td>Imbirussu</td><td style="font-family:var(--font-mono)">10%</td><td><span class="status-badge status-danger">Carregando</span></td></tr>
        </tbody></table>
      </div></div>
    </div>
  `;
  setTimeout(() => {
    createChart('chart-almox-expedicao', {
      type: 'bar',
      data: {
        labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
        datasets: [{ label: 'Pedidos Expedidos', data: [12, 15, 18, 14, 16], backgroundColor: CHART_COLORS.blue }]
      },
      options: { ...CHART_DEFAULTS }
    });
  }, 50);
};

PAGE_RENDERERS.almoxarifado_separacao = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Separação de Pedidos</div><div class="page-subtitle">Separação e pesagem de insumos por lote e validade</div></div>
    <div id="separacao-workspace">
      <div class="card mb-24">
        <div class="card-header"><div class="card-title">Fila de Separação</div></div>
        <div class="card-body">
          <table class="data-table"><thead><tr><th>Pedido</th><th>Escola Destino</th><th>Itens</th><th>Data Solicitação</th><th>Status</th><th>Ações</th></tr></thead><tbody>
            <tr><td><strong>#PED-304</strong></td><td>EM Hércules Maymone</td><td>Arroz (120kg), Feijão (40kg)</td><td>10/07/2026</td><td><span class="status-badge status-danger">Pendente</span></td>
              <td><button class="btn btn-sm btn-primary" onclick="startPicking('304', 'EM Hércules Maymone', 'Arroz (120kg), Feijão (40kg)')">Iniciar Separação</button></td></tr>
            <tr><td><strong>#PED-305</strong></td><td>EM Nerone Maiolino</td><td>Leite (90L), Maçã (30kg)</td><td>10/07/2026</td><td><span class="status-badge status-danger">Pendente</span></td>
              <td><button class="btn btn-sm btn-primary" onclick="startPicking('305', 'EM Nerone Maiolino', 'Leite (90L), Maçã (30kg)')">Iniciar Separação</button></td></tr>
            <tr><td><strong>#PED-301</strong></td><td>EM Arlindo Lima</td><td>Banana (150kg), Alface (20kg)</td><td>09/07/2026</td><td><span class="status-badge status-ok">Separado</span></td>
              <td><button class="btn btn-sm btn-outline" disabled>Concluído</button></td></tr>
          </tbody></table>
        </div>
      </div>
    </div>
  `;
};

window.startPicking = (id, school, items) => {
  const container = document.getElementById('separacao-workspace');
  if (!container) return;
  container.innerHTML = `
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Separando Itens: Pedido #${id} — ${school}</div></div>
      <div class="card-body">
        <div style="margin-bottom: 16px; padding: 12px; background: var(--warning-light); border-radius: var(--radius); font-weight: 500; font-size: 0.9rem">
          ⚠️ ATENÇÃO: Verifique o lote e a validade física de cada item antes de bipar/confirmar.
        </div>
        <table class="data-table"><thead><tr><th>Confirmar</th><th>Produto</th><th>Solicitado</th><th>Lote Selecionado</th><th>Validade</th><th>Status</th></tr></thead><tbody>
          <tr>
            <td><input type="checkbox" id="chk-item-1" style="width:20px;height:20px;cursor:pointer"></td>
            <td><strong>Arroz Integral Tipo 1</strong></td>
            <td>120 kg</td>
            <td><code>L-ARR-092</code></td>
            <td style="color:var(--success)">12/2026</td>
            <td><span class="status-badge status-info">Pronto para binar</span></td>
          </tr>
          <tr>
            <td><input type="checkbox" id="chk-item-2" style="width:20px;height:20px;cursor:pointer"></td>
            <td><strong>Feijão Carioca</strong></td>
            <td>40 kg</td>
            <td><code>L-FEI-012</code></td>
            <td style="color:var(--warning)">09/2026</td>
            <td><span class="status-badge status-info">Pronto para binar</span></td>
          </tr>
        </tbody></table>
        <div style="display:flex;gap:12px;margin-top:20px;justify-content:flex-end">
          <button class="btn btn-outline" onclick="cancelPicking()">Cancelar</button>
          <button class="btn btn-primary" onclick="completePicking('${id}')">Concluir Separação (Gerar Etiqueta)</button>
        </div>
      </div>
    </div>
  `;
};

window.cancelPicking = () => {
  const el = document.getElementById('page-content');
  if (el) PAGE_RENDERERS.almoxarifado_separacao(el);
};

window.completePicking = (id) => {
  const c1 = document.getElementById('chk-item-1')?.checked;
  const c2 = document.getElementById('chk-item-2')?.checked;
  if (!c1 || !c2) {
    alert('Erro: Por favor, confira e selecione todos os itens do pedido antes de concluir!');
    return;
  }
  alert(`Separação do pedido #${id} concluída com sucesso! Etiqueta de código de barras gerada.`);
  const el = document.getElementById('page-content');
  if (el) PAGE_RENDERERS.almoxarifado_separacao(el);
};

PAGE_RENDERERS.almoxarifado_carregamento = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Carregamento e Expedição</div><div class="page-subtitle">Distribuição e atribuição de rotas aos motoristas</div></div>
    <div class="grid-2 mb-24">
      <div class="card"><div class="card-header"><div class="card-title">Cargas Separadas (Aguardando Veículo)</div></div><div class="card-body">
        <table class="data-table"><thead><tr><th>Pedido</th><th>Destino</th><th>Veículo / Rota</th><th>Ação</th></tr></thead><tbody>
          <tr><td><strong>#PED-301</strong></td><td>EM Arlindo Lima</td><td><select id="sel-vehicle-301" class="btn btn-sm btn-outline"><option value="ABC-1234">ABC-1234 (Anhanduizinho)</option><option value="DEF-5678">DEF-5678 (Bandeira)</option></select></td>
            <td><button class="btn btn-sm btn-primary" onclick="assignVehicle('301')">Expedir Carga</button></td></tr>
          <tr><td><strong>#PED-302</strong></td><td>EM Elpídio Reis</td><td><select id="sel-vehicle-302" class="btn btn-sm btn-outline"><option value="DEF-5678">DEF-5678 (Bandeira)</option><option value="ABC-1234">ABC-1234 (Anhanduizinho)</option></select></td>
            <td><button class="btn btn-sm btn-primary" onclick="assignVehicle('302')">Expedir Carga</button></td></tr>
        </tbody></table>
      </div></div>
      <div class="card"><div class="card-header"><div class="card-title">Status de Embarque</div></div><div class="card-body">
        <table class="data-table"><thead><tr><th>Veículo</th><th>Motorista</th><th>Status</th><th>Pedidos Atribuídos</th></tr></thead><tbody>
          <tr><td><strong>ABC-1234</strong></td><td>José Souza</td><td><span class="status-badge status-ok">Carregado / Pronto</span></td><td>#PED-299, #PED-300</td></tr>
          <tr><td><strong>DEF-5678</strong></td><td>Marcos Lima</td><td><span class="status-badge status-warning">Carregando</span></td><td>#PED-302</td></tr>
        </tbody></table>
      </div></div>
    </div>
  `;
};

window.assignVehicle = (id) => {
  const sel = document.getElementById(`sel-vehicle-${id}`);
  const val = sel ? sel.value : 'Veículo';
  alert(`Carga do Pedido #${id} vinculada ao veículo ${val} e expedida com sucesso para entrega!`);
};

PAGE_RENDERERS.almoxarifado_estoque = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Estoque Central — Lotes & Validade</div><div class="page-subtitle">Controle de validades e rastreabilidade dos alimentos</div></div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Inventário Detalhado por Lote</div></div>
      <div class="card-body">
        <table class="data-table"><thead><tr><th>Produto</th><th>Categoria</th><th>Lote</th><th>Validade</th><th>Qtd. Estoque</th><th>Status</th></tr></thead><tbody>
          <tr><td><strong>Arroz Integral Tipo 1</strong></td><td>Grãos</td><td><code>L-ARR-092</code></td><td style="font-family:var(--font-mono)">15/12/2026</td><td style="font-family:var(--font-mono)">12.500 kg</td><td><span class="status-badge status-ok">Vigente</span></td></tr>
          <tr><td><strong>Feijão Carioca</strong></td><td>Grãos</td><td><code>L-FEI-012</code></td><td style="font-family:var(--font-mono)">10/09/2026</td><td style="font-family:var(--font-mono)">4.200 kg</td><td><span class="status-badge status-warning">Validade Curta</span></td></tr>
          <tr><td><strong>Banana Nanica</strong></td><td>Frutas</td><td><code>L-BAN-482</code></td><td style="font-family:var(--font-mono)">15/07/2026</td><td style="font-family:var(--font-mono)">1.800 kg</td><td><span class="status-badge status-danger">Validade Crítica (5d)</span></td></tr>
          <tr><td><strong>Leite Integral</strong></td><td>Laticínios</td><td><code>L-LEI-102</code></td><td style="font-family:var(--font-mono)">20/10/2026</td><td style="font-family:var(--font-mono)">8.900 L</td><td><span class="status-badge status-ok">Vigente</span></td></tr>
          <tr><td><strong>Maçã Fuji</strong></td><td>Frutas</td><td><code>L-MAC-220</code></td><td style="font-family:var(--font-mono)">22/07/2026</td><td style="font-family:var(--font-mono)">2.300 kg</td><td><span class="status-badge status-warning">Validade Curta</span></td></tr>
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
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Realizar Entrega</div><div class="page-subtitle">Confirmação de recebimento física na unidade escolar</div></div>
    <div id="entrega-form-container" class="card mb-24" style="max-width: 600px; margin: 0 auto;">
      <div class="card-header"><div class="card-title">Confirmar Recibo de Alimentos: EM Elpídio Reis</div></div>
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
      if (!rec) {
        alert('Por favor, informe o nome do responsável.');
        return;
      }
      alert('Entrega confirmada com sucesso! Recibo digital assinado e foto enviada para a SEMED.');
      navigateTo(null, 'dashboard');
    });
  }, 50);
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
      alert(`Ocorrência de "${type}" enviada com sucesso para a SEMED. Equipe de suporte foi notificada.`);
      navigateTo(null, 'dashboard');
    });
  }, 50);
};

PAGE_RENDERERS.motorista_historico = (el) => {
  el.innerHTML = `
    <div class="page-header"><div class="page-title">Histórico de Viagens & Entregas</div><div class="page-subtitle">Histórico de entregas realizadas por este veículo</div></div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">Viagens Recentes</div></div>
      <div class="card-body">
        <table class="data-table"><thead><tr><th>Data</th><th>Veículo</th><th>Rota / Região</th><th>Escolas Atendidas</th><th>Status</th></tr></thead><tbody>
          <tr><td style="font-family:var(--font-mono)">10/07/2026</td><td>ABC-1234</td><td>Anhanduizinho</td><td>EM Arlindo Lima, EM Elpídio Reis</td><td><span class="status-badge status-warning">Em andamento</span></td></tr>
          <tr><td style="font-family:var(--font-mono)">09/07/2026</td><td>ABC-1234</td><td>Centro</td><td>EM Franklin Roosevelt, EM Plínio Mendes</td><td><span class="status-badge status-ok">Concluído</span></td></tr>
          <tr><td style="font-family:var(--font-mono)">08/07/2026</td><td>ABC-1234</td><td>Segredo</td><td>EM Licurgo Bastos, EM Nazira Anache</td><td><span class="status-badge status-ok">Concluído</span></td></tr>
          <tr><td style="font-family:var(--font-mono)">07/07/2026</td><td>ABC-1234</td><td>Lagoa</td><td>EM Benfica, EM Rita Cáceres</td><td><span class="status-badge status-ok">Concluído</span></td></tr>
        </tbody></table>
      </div>
    </div>
  `;
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
  // Profile selector
  $$('.profile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.profile-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Login form
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const activeProfile = $('.profile-btn.active');
    const profile = activeProfile ? activeProfile.dataset.profile : 'gestor';
    await login(profile);
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
