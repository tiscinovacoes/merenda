/* ============================================
   SUALE — Supabase Data Layer (db.js)
   Carrega dados reais do Supabase e hidrata DATA.*
   Fallback automático para mock se offline/erro
   ============================================ */

const SUPABASE_URL = 'https://xszqqqyvdzoyxokkuqix.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qwKVO7DURZT5jY0FlJs03Q_EYNKoH4L';

// Projeto principal (alimentos PNAE)
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Projeto SUALE (escolas, fichas, pedidos)
const SUALE_URL = 'https://oxanubfolkoulklrhrpr.supabase.co';
const SUALE_KEY = 'sb_publishable_sJaB4lV-Rc-g7gaK_7279Q_G8od5Erh';
const _sb2 = supabase.createClient(SUALE_URL, SUALE_KEY);

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

  async fetchEscolaUsuarios() {
    try {
      const { data, error } = await _sb2
        .from('escola_usuarios')
        .select('school_id,perfil,nome,matricula,cpf,email,telefone,initials')
        .eq('ativo', true);
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('[DB] escola_usuarios:', err.message);
      return [];
    }
  },

  // Popula o dropdown de escolas no login e alinha _PILOT_SCHOOLS à mesma fonte.
  // Os dois PRECISAM sair da mesma consulta: se o dropdown listar escolas do Supabase
  // enquanto _PILOT_SCHOOLS ainda tem as mock locais, o usuário escolhe uma e entra em outra.
  async initLoginDropdown() {
    try {
      const [schools, usuarios] = await Promise.all([this.fetchSchools(), this.fetchEscolaUsuarios()]);
      if (!schools || schools.length === 0) return;

      const userMap = {};
      for (const u of usuarios) {
        if (!userMap[u.school_id]) userMap[u.school_id] = {};
        userMap[u.school_id][u.perfil] = {
          name: u.nome, matricula: u.matricula, cpf: u.cpf,
          email: u.email, telefone: u.telefone, initials: u.initials,
        };
      }
      for (const sc of schools) {
        const u = userMap[sc.id] || {};
        sc.diretor     = u.diretor      || null;
        sc.respEstoque = u.resp_estoque || null;
        sc.merendeira  = u.merendeira   || null;
      }

      const comDiretor = schools.filter(sc => sc.diretor);
      if (comDiretor.length === 0) return;
      window._PILOT_SCHOOLS = comDiretor;

      const sel = document.getElementById('school-picker-select');
      if (sel) {
        sel.innerHTML = '<option value="">— Selecione a unidade escolar —</option>' +
          comDiretor.map(s => `<option value="${s.id}">${s.name} (${s.region} · ${s.students || 0} alunos)</option>`).join('');
      }
      console.log(`[DB] Dropdown de login: ${comDiretor.length} escolas (alinhado com _PILOT_SCHOOLS)`);
    } catch { /* mantém opções hardcoded do HTML e _PILOT_SCHOOLS local */ }
  },

  async fetchRestricoes(schoolId) {
    try {
      let q = _sb2.from('restricoes_alimentares').select('*').order('criado_em', { ascending: false });
      if (schoolId) q = q.eq('school_id', schoolId);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('[DB] restricoes_alimentares:', err.message);
      return [];
    }
  },

  async saveRestricao(payload) {
    try {
      const { data, error } = await _sb2.from('restricoes_alimentares').insert([payload]).select().single();
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[DB] saveRestricao:', err.message);
      return null;
    }
  },

  async resolverRestricao(id) {
    try {
      const { error } = await _sb2.from('restricoes_alimentares')
        .update({ status: 'resolvido', atualizado_em: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('[DB] resolverRestricao:', err.message);
      return false;
    }
  },

  async marcarNotificado(id) {
    try {
      await _sb2.from('restricoes_alimentares').update({ notificado: true }).eq('id', id);
    } catch {}
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

  // -------------------------
  // MÓDULOS DE COMPRAS & ESTOQUE (SUALE)
  // -------------------------
  
  async fetchAtas() {
    return await _fetch('atas', { order: 'numero' });
  },
  
  async fetchAtaProducts(ataId) {
    try {
      const { data, error } = await _sb.from('ata_products').select('*').eq('ata_id', ataId);
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn(`[DB] Erro ao buscar produtos da ata ${ataId}:`, err.message);
      return [];
    }
  },

  async fetchEmpenhos() {
    return await _fetch('empenhos', { order: 'criado_em', asc: false });
  },

  async saveEmpenho(empenho) {
    try {
      const { data, error } = await _sb.from('empenhos').insert([empenho]).select();
      if (error) throw error;
      return data ? data[0] : null;
    } catch (err) {
      console.warn('[DB] Erro ao salvar empenho:', err.message);
      return null;
    }
  },

  async updateEmpenho(empenhoId, updatePayload) {
    try {
      const { error } = await _sb.from('empenhos').update(updatePayload).eq('id', empenhoId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('[DB] Erro ao atualizar empenho:', err.message);
      return false;
    }
  },

  async fetchNFsRecebidas() {
    return await _fetch('nfs_recebidas', { order: 'data_recebimento', asc: false });
  },

  async saveNFRecebida(nf) {
    try {
      const { data, error } = await _sb.from('nfs_recebidas').insert([nf]).select();
      if (error) throw error;
      return data ? data[0] : null;
    } catch (err) {
      console.warn('[DB] Erro ao salvar NF:', err.message);
      return null;
    }
  },

  async fetchEstoqueCentral() {
    return await _fetch('estoque_central', { order: 'produto' });
  },

  async updateEstoqueCentral(produtoId, updatePayload) {
    try {
      const { error } = await _sb.from('estoque_central')
        .update(updatePayload)
        .eq('id', produtoId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('[DB] Erro ao atualizar estoque central:', err.message);
      return false;
    }
  },

  async saveDelivery(delivery) {
    try {
      const { data, error } = await _sb.from('deliveries').insert([delivery]).select();
      if (error) throw error;
      return data ? data[0] : null;
    } catch (err) {
      console.warn('[DB] Erro ao salvar delivery:', err.message);
      return null;
    }
  },

  async saveIncident(incident) {
    try {
      const { data, error } = await _sb.from('incidents').insert([incident]).select();
      if (error) throw error;
      return data ? data[0] : null;
    } catch (err) {
      console.warn('[DB] Erro ao salvar incident:', err.message);
      return null;
    }
  },

  async saveProduction(production) {
    try {
      const { data, error } = await _sb.from('productions').insert([production]).select();
      if (error) throw error;
      return data ? data[0] : null;
    } catch (err) {
      console.warn('[DB] Erro ao salvar production:', err.message);
      return null;
    }
  },

  async saveStockAdjust(adjust) {
    try {
      const { data, error } = await _sb.from('stock_adjusts').insert([adjust]).select();
      if (error) throw error;
      return data ? data[0] : null;
    } catch (err) {
      console.warn('[DB] Erro ao salvar stock adjust:', err.message);
      return null;
    }
  },

  async saveMenu(menu) {
    try {
      const { data, error } = await _sb.from('menus').insert([menu]).select();
      if (error) throw error;
      return data ? data[0] : null;
    } catch (err) {
      console.warn('[DB] Erro ao salvar menu:', err.message);
      return null;
    }
  },

  async saveWeeklyMenu(weeklyMenu) {
    try {
      const { data, error } = await _sb.from('weekly_menus').insert([weeklyMenu]).select();
      if (error) throw error;
      return data ? data[0] : null;
    } catch (err) {
      console.warn('[DB] Erro ao salvar weekly menu:', err.message);
      return null;
    }
  },

  async transferStockToSchool(schoolName, productName, qty, unit) {
    try {
      const { data, error } = await _sb.rpc('transfer_stock_to_school', {
        p_school_name: schoolName,
        p_product_name: productName,
        p_qty: qty,
        p_unit: unit
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[DB] Erro no RPC transfer_stock_to_school:', err.message);
      return false;
    }
  },

  async uploadComprovante(file) {
    try {
      const fileName = `comprovante-${Date.now()}-${file.name}`;
      const { data, error } = await _sb.storage.from('comprovantes').upload(fileName, file);
      if (error) throw error;
      const { data: pubData } = _sb.storage.from('comprovantes').getPublicUrl(fileName);
      return pubData ? pubData.publicUrl : null;
    } catch (err) {
      console.warn('[DB] Erro no upload Supabase Storage:', err.message);
      return null;
    }
  },

  async consumeSchoolStock(schoolName, productName, qty) {
    try {
      const { data, error } = await _sb.rpc('consume_school_stock', {
        p_school_name: schoolName,
        p_product_name: productName,
        p_qty: qty
      });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[DB] Erro no RPC consume_school_stock:', err.message);
      return false;
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
  
  async fetchProductions() {
    try {
      const { data, error } = await _sb.from('productions').select('*');
      if (error) throw error;
      return data || [];
    } catch(e) {
      console.warn('[DB] productions:', e.message || e);
      return [];
    }
  },
  async fetchStockAdjusts() {
    try {
      const { data, error } = await _sb.from('stock_adjusts').select('*');
      if (error) throw error;
      return data || [];
    } catch(e) {
      console.warn('[DB] stock_adjusts:', e.message || e);
      return [];
    }
  },

  async hydrateData() {
    console.log('[DB] Conectando ao Supabase...');

    const [schools, escolaUsuarios, products, cooperatives, farmers, contracts, orders, alimentos, restricoes, atas, empenhos, nfs, estoque_central, productions, stockAdjusts] = await Promise.all([
      this.fetchSchools(),
      this.fetchEscolaUsuarios(),
      this.fetchProducts(),
      this.fetchCooperatives(),
      this.fetchFarmers(),
      this.fetchContracts(),
      this.fetchOrders(),
      this.fetchAlimentosPnae(),
      this.fetchRestricoes(),
      this.fetchAtas(),
      this.fetchEmpenhos(),
      this.fetchNFsRecebidas(),
      this.fetchEstoqueCentral(),
      this.fetchProductions(),
      this.fetchStockAdjusts()
    ]);

    // Enriquece escolas com usuários por função
    if (schools && schools.length > 0 && escolaUsuarios.length > 0) {
      const userMap = {};
      for (const u of escolaUsuarios) {
        if (!userMap[u.school_id]) userMap[u.school_id] = {};
        userMap[u.school_id][u.perfil] = {
          name: u.nome, matricula: u.matricula, cpf: u.cpf,
          email: u.email, telefone: u.telefone, initials: u.initials,
        };
      }
      for (const sc of schools) {
        const u = userMap[sc.id] || {};
        sc.diretor     = u.diretor      || null;
        sc.respEstoque = u.resp_estoque || null;
        sc.merendeira  = u.merendeira   || null;
      }
      // Atualiza _PILOT_SCHOOLS com escolas reais que tenham diretor cadastrado
      window._PILOT_SCHOOLS = schools.filter(sc => sc.diretor);
      console.log(`[DB] ${escolaUsuarios.length} usuários de escola carregados`);
    }

    let anyLoaded = false;

    // Sincroniza restrições do DB para o SharedState (sem duplicar)
    if (restricoes && restricoes.length > 0 && window.SharedState) {
      const existingIds = new Set((window.SharedState.getRestricoes() || []).map(r => 'db-' + r.id));
      restricoes.forEach(r => {
        const localId = 'db-' + r.id;
        if (!existingIds.has(localId)) {
          const escola = schools ? schools.find(s => s.id === r.school_id) : null;
          window.SharedState._data.restricoes = window.SharedState._data.restricoes || [];
          window.SharedState._data.restricoes.push({
            id: localId,
            schoolId: r.school_id,
            schoolName: escola ? escola.name : 'Escola #' + r.school_id,
            tipo: r.tipo,
            quantidade: r.quantidade,
            observacao: r.observacao || '',
            status: r.status,
            registradoPor: r.registrado_por || '',
            notificado: r.notificado,
            criadoEm: r.criado_em,
            resolvidoEm: r.status === 'resolvido' ? r.atualizado_em : null,
          });
        }
      });
    }

    // O catálogo curado (products + contracts) é mantido local enquanto a flag
    // USAR_CATALOGO_LOCAL estiver ligada em app.js. Sobrescrever só metade do
    // grafo (products/contracts vêm do banco, ataProducts/empenhos não existem
    // lá) quebra as referências por id e esvazia o modal de empenho.
    const _catalogoLocal = window.USAR_CATALOGO_LOCAL === true;
    if (_catalogoLocal) {
      console.log('[DB] Catálogo local curado ativo — products/contracts não serão sobrescritos.');
    }

    if (schools && schools.length > 0) { DATA.schools = schools; anyLoaded = true; }
    if (!_catalogoLocal && products && products.length > 0) { DATA.products = products; anyLoaded = true; }
    if (cooperatives && cooperatives.length > 0) { DATA.cooperatives = cooperatives; anyLoaded = true; }
    if (farmers && farmers.length > 0) { DATA.farmers = farmers; anyLoaded = true; }
    if (!_catalogoLocal && contracts && contracts.length > 0) { DATA.contracts = contracts; anyLoaded = true; }
    if (orders && orders.length > 0) { DATA.orders = orders; anyLoaded = true; }

    // Injeta dados das novas tabelas no SharedState
    if (window.SharedState) {
      if (atas && atas.length > 0) { DATA.atas = atas; anyLoaded = true; }
      if (empenhos && empenhos.length > 0) { window.SharedState._data.empenhos = empenhos; anyLoaded = true; }
      if (nfs && nfs.length > 0) { window.SharedState._data.nfsRecebidas = nfs; anyLoaded = true; }
      if (estoque_central && estoque_central.length > 0) {
        // O estoque_central vem como array de linhas: { produto, qtd, unidade, lotes: [...] }
        // O SharedState armazena como dicionário
        const scMap = {};
        estoque_central.forEach(item => {
          scMap[item.produto] = { qtd: item.qtd, unidade: item.unidade, lotes: item.lotes || [] };
        });
        window.SharedState._data.centralStock = scMap;
        anyLoaded = true;
      }
      window.SharedState._persist();
    }

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

