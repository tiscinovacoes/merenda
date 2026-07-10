/* ============================================
   SAGED — Supabase Data Layer (db.js)
   Carrega dados reais do Supabase e hidrata DATA.*
   Fallback automático para mock se offline/erro
   ============================================ */

const SUPABASE_URL = 'https://xszqqqyvdzoyxokkuqix.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qwKVO7DURZT5jY0FlJs03Q_EYNKoH4L';

// Projeto principal (alimentos PNAE)
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Projeto SAGED (escolas, fichas, pedidos)
const SAGED_URL = 'https://oxanubfolkoulklrhrpr.supabase.co';
const SAGED_KEY = 'sb_publishable_sJaB4lV-Rc-g7gaK_7279Q_G8od5Erh';
const _sb2 = supabase.createClient(SAGED_URL, SAGED_KEY);

// ============================
// STATUS DA CONEXÃO
// ============================
window.DB_STATUS = {
  connected: false,
  lastSync: null,
  error: null,
};

// ============================
// HELPERS
// ============================
async function _fetch(table, options = {}) {
  try {
    let query = _sb.from(table).select(options.select || '*');
    if (options.order) query = query.order(options.order, { ascending: options.asc !== false });
    if (options.limit) query = query.limit(options.limit);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn(`[DB] Erro ao buscar "${table}":`, err.message);
    return null; // null = usar fallback
  }
}

// Dados de frequência por escola (enriquecimento frontend enquanto RLS bloqueia escrita anon)
const ATTENDANCE_DATA = {
  'EM Arlindo Lima':                       { attendance_avg: 572, attendance_pct: 92, grade_levels: 'EF I + EF II', meals_per_day: 2, monthly_budget: 18500 },
  'EM Elpidio Reis':                       { attendance_avg: 421, attendance_pct: 88, grade_levels: 'EF I', meals_per_day: 2, monthly_budget: 14200 },
  'EM Franklin Roosevelt':                 { attendance_avg: 698, attendance_pct: 93, grade_levels: 'EF I + EF II', meals_per_day: 3, monthly_budget: 22500 },
  'EM Hercules Maymone':                   { attendance_avg: 476, attendance_pct: 85, grade_levels: 'EF I + EF II', meals_per_day: 2, monthly_budget: 16800 },
  'EM Jose Rodrigues Benfica':             { attendance_avg: 374, attendance_pct: 91, grade_levels: 'EF I', meals_per_day: 2, monthly_budget: 12300 },
  'EM Kame Adania':                        { attendance_avg: 482, attendance_pct: 93, grade_levels: 'EF I + EF II', meals_per_day: 2, monthly_budget: 15600 },
  'EM Licurgo de Oliveira Bastos':         { attendance_avg: 332, attendance_pct: 87, grade_levels: 'EF I', meals_per_day: 2, monthly_budget: 11400 },
  'EM Professora Goncalina Faustina':      { attendance_avg: 641, attendance_pct: 93, grade_levels: 'EF I + EF II', meals_per_day: 3, monthly_budget: 20700 },
  'EM Nerone Maiolino':                    { attendance_avg: 381, attendance_pct: 89, grade_levels: 'EF I', meals_per_day: 2, monthly_budget: 12900 },
  'EM Plinio Mendes dos Santos':           { attendance_avg: 497, attendance_pct: 92, grade_levels: 'EF I + EF II', meals_per_day: 2, monthly_budget: 16200 },
  'EM Padre Tomaz Ghirardelli':            { attendance_avg: 325, attendance_pct: 88, grade_levels: 'EF I', meals_per_day: 2, monthly_budget: 11100 },
  'EM Rita Caceres Mendonca':              { attendance_avg: 463, attendance_pct: 91, grade_levels: 'EF I + EF II', meals_per_day: 2, monthly_budget: 15300 },
  'EM Nagib Raslan':                       { attendance_avg: 421, attendance_pct: 92, grade_levels: 'EF I + EF II', meals_per_day: 2, monthly_budget: 13800 },
  'EM Nazira Anache':                      { attendance_avg: 541, attendance_pct: 92, grade_levels: 'EF I + EF II', meals_per_day: 2, monthly_budget: 17700 },
  'EM Professor Arassuay G. de Castro':    { attendance_avg: 563, attendance_pct: 88, grade_levels: 'EF I + EF II', meals_per_day: 3, monthly_budget: 19200 },
  'EM Sulivan Silvestre Oliveira':         { attendance_avg: 323, attendance_pct: 92, grade_levels: 'EF I', meals_per_day: 2, monthly_budget: 10500 },
  'EM Irma Edith Coelho Netto':            { attendance_avg: 441, attendance_pct: 92, grade_levels: 'EF I + EF II', meals_per_day: 2, monthly_budget: 14400 },
  'EM Elizio Ramirez Vieira':              { attendance_avg: 461, attendance_pct: 87, grade_levels: 'EF I + EF II', meals_per_day: 2, monthly_budget: 15900 },
  'EM Professora Arlene M. Almeida':       { attendance_avg: 431, attendance_pct: 92, grade_levels: 'EF I + EF II', meals_per_day: 2, monthly_budget: 14100 },
  'EM Academico Antonio Delfino Pereira':  { attendance_avg: 553, attendance_pct: 92, grade_levels: 'EF I + EF II', meals_per_day: 2, monthly_budget: 18000 },
};

// Mapeia snake_case do Supabase para camelCase do DATA mock
function mapSchool(r) {
  // Prioriza dados do Supabase; se attendance_avg = 0 (RLS bloqueia escrita anon), usa lookup local
  const att = ATTENDANCE_DATA[r.name] || {};
  const att_avg = (r.attendance_avg && r.attendance_avg > 0) ? r.attendance_avg : (att.attendance_avg || 0);
  const att_pct = (r.attendance_pct && r.attendance_pct > 0) ? r.attendance_pct : (att.attendance_pct || 0);
  return {
    id: r.id,
    name: r.name,
    region: r.region,
    director: r.director,
    students: r.students,
    stockStatus: r.stock_status,
    lastDelivery: r.last_delivery,
    stockPct: r.stock_pct,
    // Frequência
    attendance_avg: att_avg,
    attendance_pct: att_pct,
    grade_levels: r.grade_levels || att.grade_levels || 'EF I + EF II',
    meals_per_day: r.meals_per_day || att.meals_per_day || 2,
    monthly_budget: r.monthly_budget || att.monthly_budget || 0,
    modality: r.modality || 'Escolar Urbana (Regular)',
    address: r.address || '',
    phone: r.phone || '',
  };
}

function mapProduct(r) {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    unit: r.unit,
    stock: r.stock,
    avgConsume: r.avg_consume,
    daysLeft: r.days_left,
    familyFarm: r.family_farm,
  };
}

function mapCooperative(r) {
  return {
    id: r.id,
    name: r.name,
    farmers: r.farmers_count,
    orders: r.orders,
    delivered: r.delivered,
    rate: r.rate,
    value: r.value,
  };
}

function mapFarmer(r) {
  return {
    id: r.id,
    name: r.name,
    coop: r.cooperative,
    products: r.products || [],
    production: r.production,
    stock: r.stock,
    area: r.area,
  };
}

function mapContract(r) {
  return {
    id: r.id,
    number: r.number,
    start: r.start_date,
    end: r.end_date,
    supplier: r.supplier,
    globalValue: r.global_value,
    executedValue: r.executed_value,
    status: r.status,
  };
}

function mapOrder(r) {
  return {
    id: r.id,
    school: r.school,
    date: r.date,
    status: r.status,
    coop: r.cooperative,
    value: r.value,
  };
}

// ============================
// FUNÇÕES PÚBLICAS DE FETCH
// ============================
window.DB = {

  async fetchSchools() {
    try {
      const { data, error } = await _sb2.from('schools').select('*').order('name');
      if (error || !data || data.length === 0) throw new Error('empty');
      console.log(`[DB] ${data.length} escolas carregadas do Supabase`);
      return data.map(mapSchool);
    } catch {
      console.warn('[DB] Escolas: usando mock local');
      return null;
    }
  },

  async fetchProducts() {
    const rows = await _fetch('products', { order: 'name' });
    return rows ? rows.map(mapProduct) : null;
  },

  async fetchCooperatives() {
    const rows = await _fetch('cooperatives', { order: 'name' });
    return rows ? rows.map(mapCooperative) : null;
  },

  async fetchFarmers() {
    const rows = await _fetch('farmers', { order: 'name' });
    return rows ? rows.map(mapFarmer) : null;
  },

  async fetchContracts() {
    const rows = await _fetch('contracts', { order: 'start_date' });
    return rows ? rows.map(mapContract) : null;
  },

  async fetchOrders() {
    const rows = await _fetch('orders', { order: 'date', asc: false });
    return rows ? rows.map(mapOrder) : null;
  },

  async fetchFichasTecnicas() {
    const rows = await _fetch('fichas_tecnicas', { order: 'name' });
    return rows || null;
  },

  // Salva nova ficha técnica no Supabase
  async saveFichaTecnica(ficha) {
    try {
      const { error } = await _sb.from('fichas_tecnicas').insert([ficha]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('[DB] Erro ao salvar ficha:', err.message);
      return false;
    }
  },

  // Busca alimentos da tabela Supabase; fallback para ALIMENTOS_PNAE local
  async fetchAlimentosPnae() {
    try {
      const { data, error } = await _sb.from('alimentos_pnae').select('*').order('name');
      if (error || !data || data.length === 0) throw new Error('empty');
      console.log(`[DB] ${data.length} alimentos carregados do Supabase`);
      return data;
    } catch {
      // Fallback para o arquivo alimentos.js local
      if (typeof ALIMENTOS_PNAE !== 'undefined' && ALIMENTOS_PNAE.length > 0) {
        console.log(`[DB] ${ALIMENTOS_PNAE.length} alimentos carregados localmente (PNAE offline)`);
        return ALIMENTOS_PNAE;
      }
      return [];
    }
  },

  // Busca alimentos por termo (local ou Supabase)
  async searchAlimentos(term) {
    const all = typeof ALIMENTOS_PNAE !== 'undefined' ? ALIMENTOS_PNAE : [];
    if (!term) return all.slice(0, 50);
    const q = term.toLowerCase();
    return all.filter(a => a.name.toLowerCase().includes(q) || a.code.toLowerCase().includes(q)).slice(0, 50);
  },

  // ============================
  // HIDRATAÇÃO PRINCIPAL
  // Busca todos os dados e sobrescreve DATA.*
  // ============================
  async hydrateData() {
    console.log('[DB] Conectando ao Supabase...');

    const [schools, products, cooperatives, farmers, contracts, orders, alimentos] = await Promise.all([
      this.fetchSchools(),
      this.fetchProducts(),
      this.fetchCooperatives(),
      this.fetchFarmers(),
      this.fetchContracts(),
      this.fetchOrders(),
      this.fetchAlimentosPnae(),
    ]);

    let anyLoaded = false;

    if (schools && schools.length > 0) { DATA.schools = schools; anyLoaded = true; }
    if (products && products.length > 0) { DATA.products = products; anyLoaded = true; }
    if (cooperatives && cooperatives.length > 0) { DATA.cooperatives = cooperatives; anyLoaded = true; }
    if (farmers && farmers.length > 0) { DATA.farmers = farmers; anyLoaded = true; }
    if (contracts && contracts.length > 0) { DATA.contracts = contracts; anyLoaded = true; }
    if (orders && orders.length > 0) { DATA.orders = orders; anyLoaded = true; }

    // Alimentos PNAE sempre disponíveis (Supabase ou local)
    if (alimentos && alimentos.length > 0) {
      DATA.alimentos = alimentos;
      console.log(`[DB] ${alimentos.length} alimentos PNAE disponíveis`);
    }

    window.DB_STATUS.connected = anyLoaded;
    window.DB_STATUS.alimentosCount = (alimentos || []).length;
    window.DB_STATUS.lastSync = new Date();
    window.DB_STATUS.error = anyLoaded ? null : 'Sem dados no Supabase — usando dados demo';

    if (anyLoaded) {
      console.log(`[DB] ✅ Dados carregados do Supabase (${new Date().toLocaleTimeString('pt-BR')})`);
    } else {
      console.warn('[DB] ⚠️ Supabase sem dados — usando mock local');
    }

    return anyLoaded;
  },
};

