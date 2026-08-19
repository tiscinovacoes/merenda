/* ============================================
   SUALE — Módulo Colaboradores (js/modules/colaboradores.js)
   Perfis: Cooperativa / Agricultor Family Farm
   ============================================ */

(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  // REGISTRO DE RENDERERS DO COLABORADOR (Assinatura: (el) => { el.innerHTML = ...; })
  //
  // Regra 6 do PLANO_MODULARIZACAO_APP.md: não registrar chave cuja versão em
  // app.js é mais completa. A auditoria de 2026-08-18 constatou que todas as telas
  // deste módulo são mais pobres que as de app.js: o dashboard perde os 2 gráficos
  // e usa faturamento fixo; pedidos perde o filtro por cooperativa/agricultor e os
  // botões de aceitar/despachar; escolas cai de 8 para 3 colunas (sem restrições
  // nem estoque local); produção troca o formulário real (SharedState.addProduction)
  // por uma lista estática; relatórios trocam 6 relatórios com export CSV por um
  // único botão de impressão. Nenhuma chave é registrada até a migração real.
  // As funções seguem definidas abaixo, prontas para assumir.
  //
  // NOTA: cooperativa_producao ficou sem registro de propósito — a versão deste
  // módulo é estática e app.js não define essa chave; o menu da cooperativa também
  // não tem o item, então nada regride.

  // 1. DASHBOARD COLABORADORES
  // ============================================================
  // MIGRADO DO app.js NA FASE 4.1 (movido, nao reescrito)
  // ============================================================
  // Estes renderers e helpers vinham do app.js e sao as versoes vigentes, com
  // filtros por cooperativa/agricultor, botoes de aceitar/despachar pedido,
  // formulario real de producao e os graficos do dashboard. Os stubs rasos que
  // existiam aqui foram descartados (Regra 6 do PLANO_MODULARIZACAO_APP.md).
  //
  // Dependencias resolvidas em tempo de chamada (o app.js carrega depois e
  // ainda hospeda helpers compartilhados como renderCrudScreen/cur/statusLabel).

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
  const o = SharedState.getOrders().find(x => x.id === id);
  if (o) {
    o.driver = o.driver || 'Carlos Silva (Placa ABC-1234)';
    o.driver_id = o.driver_id || 'USR-MOTORISTA-001';
    o.placa = o.placa || 'ABC-1234';
  }
  SharedState.updateOrderStatus(id, 'Em transporte');
  showToast('🚚 Pedido despachado. Motorista Carlos Silva notificado!');
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
})();
