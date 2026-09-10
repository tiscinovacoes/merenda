/* ============================================
   SUALE — Módulo Colaboradores (js/modules/colaboradores.js)
   Perfis Operacionais: Cooperativa / Agricultor Familiar
   Foco: Recebimento de Ordens de Serviço (O.S.) e Cronograma de Entregas
   ============================================ */

(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  // Helpers auxiliares
  const _esc = (t) => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);

  // Helper para obter lista unificada de Ordens de Serviço aplicáveis ao perfil atual
  function _getOrdensDoPerfil() {
    const prof = (window.PROFILES && window.state && window.PROFILES[window.state.currentProfile]) || {};
    const isAgri = (window.state && window.state.currentProfile === 'agricultor');
    const nomeOuCoop = (prof.role || prof.name || 'COOPAGRAN').toUpperCase();

    let allOrders = [];
    if (window.SharedState && typeof window.SharedState.getOrders === 'function') {
      allOrders = window.SharedState.getOrders();
    }

    // Se a lista estiver vazia, fallback para dados mock de DATA.orders enriquecidos
    if (!allOrders || allOrders.length === 0) {
      allOrders = (window.DATA && window.DATA.orders ? window.DATA.orders : []).map((o, idx) => ({
        id: 'ord-' + (o.id || idx + 1),
        numero: o.id || (idx + 101),
        school: o.school || 'EM ADV. DEMOSTHENES MARTINS',
        date: o.date || '2026-06-25',
        dataLimite: o.date || '2026-06-28',
        cooperative: o.coop || 'COOPAGRAN',
        value: o.value || 3450,
        status: o.status || (idx === 0 ? 'Pendente' : (idx === 1 ? 'Em transporte' : 'Entregue')),
        itens: [
          { produto: 'Mandioca', qtd: 200, unidade: 'kg', af: true },
          { produto: 'Banana Nanica', qtd: 150, unidade: 'kg', af: true },
          { produto: 'Alface Crespa', qtd: 80, unidade: 'kg', af: true }
        ]
      }));
    }

    // Filtra por cooperativa ou por atribuição do agricultor
    if (isAgri) {
      const agriName = prof.name || 'José Maria Rodrigues';
      return allOrders.filter(o => {
        const porDist = (o.distribuicao || []).some(d => (d.agricultor || '').toUpperCase() === agriName.toUpperCase());
        const porItens = (o.itens || []).some(i => i.af);
        return porDist || porItens;
      });
    }

    return allOrders.filter(o => {
      const coopMatch = (o.cooperative || o.coop || '').toUpperCase().includes(nomeOuCoop) || nomeOuCoop.includes((o.cooperative || '').toUpperCase());
      return coopMatch || !o.cooperative;
    });
  }

  // ────────────────────────────────────────────────────────────
  // 1. COOPERATIVA: DASHBOARD (PAINEL GERAL)
  // ────────────────────────────────────────────────────────────
  PAGE_RENDERERS.cooperativa_dashboard = (el) => {
    const prof = (window.PROFILES && window.state && window.PROFILES[window.state.currentProfile]) || {};
    const coopName = prof.role || 'COOPAGRAN';
    const ordens = _getOrdensDoPerfil();

    const pendentes = ordens.filter(o => o.status === 'Pendente');
    const emSeparacao = ordens.filter(o => o.status === 'Em separação' || o.status === 'Aceito');
    const emTransporte = ordens.filter(o => o.status === 'Em transporte');
    const entregues = ordens.filter(o => o.status === 'Entregue');

    const totalValor = entregues.reduce((s, o) => s + (o.value || 0), 0) + 145000;
    const aFaturar = pendentes.concat(emSeparacao, emTransporte).reduce((s, o) => s + (o.value || 0), 0) + 24800;

    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div class="page-title">Painel Operacional — ${coopName}</div>
          <div class="page-subtitle">Recepção de Ordens de Serviço e Programação de Entregas da Agricultura Familiar</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline btn-sm" onclick="navigateTo('cooperativa','entregas')">📅 Cronograma de Entregas</button>
          <button class="btn btn-primary btn-sm" onclick="navigateTo('cooperativa','pedidos')">📋 Ver Ordens de Serviço (${pendentes.length})</button>
        </div>
      </div>

      <!-- KPIs Operacionais -->
      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card orange" style="cursor:pointer" onclick="navigateTo('cooperativa','pedidos')">
          <div class="kpi-icon">📋</div>
          <div class="kpi-value">${pendentes.length}</div>
          <div class="kpi-label">O.S. Aguardando Aceite</div>
        </div>
        <div class="kpi-card blue" style="cursor:pointer" onclick="navigateTo('cooperativa','entregas')">
          <div class="kpi-icon">🚚</div>
          <div class="kpi-value">${emSeparacao.length + emTransporte.length}</div>
          <div class="kpi-label">Entregas em Andamento</div>
        </div>
        <div class="kpi-card green">
          <div class="kpi-icon">✅</div>
          <div class="kpi-value">${entregues.length}</div>
          <div class="kpi-label">Entregas Concluídas</div>
        </div>
        <div class="kpi-card purple">
          <div class="kpi-icon">💰</div>
          <div class="kpi-value">${typeof formatCurrency === 'function' ? formatCurrency(aFaturar) : 'R$ ' + aFaturar.toLocaleString('pt-BR')}</div>
          <div class="kpi-label">Previsão a Faturar (O.S.)</div>
        </div>
      </div>

      <!-- Alertas & Próximas Ações -->
      <div class="card mb-24" style="border-left:4px solid var(--primary)">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">🚨 Próximas Entregas Programadas para a Rede Escolar</div>
          <button class="btn btn-sm btn-ghost" onclick="navigateTo('cooperativa','entregas')">Ver Cronograma Completo →</button>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Data Prevista</th>
                <th>Escola de Destino</th>
                <th>Itens a Entregar</th>
                <th>Volume Estimado</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              ${ordens.slice(0, 5).map(o => `
                <tr>
                  <td style="font-family:var(--font-mono);font-weight:600">${_esc(o.date || o.dataLimite || 'A definir')}</td>
                  <td><strong>${_esc(o.school)}</strong></td>
                  <td style="font-size:0.82rem">
                    ${(o.itens || []).map(i => `${_esc(i.produto)} (${i.qtd} ${i.unidade})`).join(', ') || 'Hortifrúti / Legumes da Safra'}
                  </td>
                  <td style="font-family:var(--font-mono)">${(o.itens || []).reduce((s,i) => s + (i.qtd||0), 0) || 350} kg</td>
                  <td><span class="status-badge ${typeof statusClass === 'function' ? statusClass(o.status) : 'status-warning'}">${_esc(o.status)}</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline" style="padding:2px 8px;font-size:0.75rem" onclick="window.abrirModalDetalhesOrdemColaborador('${o.id}')">
                      👁️ Detalhes
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ────────────────────────────────────────────────────────────
  // 2. COOPERATIVA: ORDENS DE SERVIÇO (PEDIDOS)
  // ────────────────────────────────────────────────────────────
  PAGE_RENDERERS.cooperativa_pedidos = (el) => {
    const prof = (window.PROFILES && window.state && window.PROFILES[window.state.currentProfile]) || {};
    const coopName = prof.role || 'COOPAGRAN';
    const ordens = _getOrdensDoPerfil();

    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:gap;gap:12px">
        <div>
          <div class="page-title">Ordens de Serviço de Fornecimento — ${coopName}</div>
          <div class="page-subtitle">Ordens emitidas pela SEMED para fornecimento de gêneros da Agricultura Familiar</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="navigateTo('cooperativa','entregas')">📅 Ir ao Cronograma de Entregas</button>
      </div>

      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">Fila de Ordens de Serviço Recebidas</div>
          <span class="tag tag-blue" style="font-weight:700">${ordens.length} O.S. registradas</span>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nº da O.S.</th>
                <th>Unidade Escolar</th>
                <th>Data Limite</th>
                <th>Produtos & Quantidades</th>
                <th>Valor Previsto</th>
                <th>Status</th>
                <th style="text-align:right">Ações Operacionais</th>
              </tr>
            </thead>
            <tbody>
              ${ordens.map(o => {
                const numStr = String(o.numero || o.id || '101').replace('ord-','');
                const isPendente = (o.status === 'Pendente');
                const isSeparando = (o.status === 'Em separação' || o.status === 'Aceito');
                const isTransporte = (o.status === 'Em transporte');

                return `
                  <tr>
                    <td>
                      <span class="tag tag-blue" style="font-family:var(--font-mono);font-weight:700">#OSC-${numStr}</span>
                    </td>
                    <td><strong>${_esc(o.school)}</strong></td>
                    <td style="font-family:var(--font-mono)">${_esc(o.dataLimite || o.date || '—')}</td>
                    <td style="font-size:0.82rem">
                      ${(o.itens || []).map(i => `<span class="tag tag-green" style="margin:2px 2px 2px 0">${_esc(i.produto)}: ${i.qtd} ${i.unidade}</span>`).join('') || '—'}
                    </td>
                    <td style="font-family:var(--font-mono);font-weight:700;color:var(--text-primary)">
                      ${typeof formatCurrency === 'function' ? formatCurrency(o.value || 0) : 'R$ ' + (o.value || 0).toLocaleString('pt-BR')}
                    </td>
                    <td><span class="status-badge ${typeof statusClass === 'function' ? statusClass(o.status) : 'status-warning'}">${_esc(o.status)}</span></td>
                    <td style="text-align:right">
                      <div style="display:inline-flex;gap:6px;justify-content:flex-end">
                        <button class="btn btn-sm btn-outline" style="padding:3px 8px;font-size:0.75rem" onclick="window.abrirModalDetalhesOrdemColaborador('${o.id}')">
                          👁️ Detalhes
                        </button>
                        ${isPendente ? `
                          <button class="btn btn-sm btn-primary" style="background:#16a34a;border-color:#16a34a;padding:3px 10px;font-size:0.75rem;font-weight:700" onclick="window.aceitarOrdemColaborador('${o.id}')">
                            ✅ Aceitar O.S.
                          </button>
                        ` : ''}
                        ${isSeparando ? `
                          <button class="btn btn-sm btn-primary" style="background:#0284c7;border-color:#0284c7;padding:3px 10px;font-size:0.75rem;font-weight:700" onclick="window.despacharOrdemColaborador('${o.id}')">
                            🚚 Despachar
                          </button>
                        ` : ''}
                        ${isTransporte ? `
                          <button class="btn btn-sm btn-outline" style="color:#16a34a;border-color:#16a34a;padding:3px 8px;font-size:0.75rem;font-weight:700" onclick="window.abrirModalComprovanteEntregaColaborador('${o.id}')">
                            📸 Confirmar Entrega
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ────────────────────────────────────────────────────────────
  // 3. COOPERATIVA: CRONOGRAMA DE ENTREGAS
  // ────────────────────────────────────────────────────────────
  PAGE_RENDERERS.cooperativa_entregas = (el) => {
    const prof = (window.PROFILES && window.state && window.PROFILES[window.state.currentProfile]) || {};
    const coopName = prof.role || 'COOPAGRAN';
    const ordens = _getOrdensDoPerfil();

    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div class="page-title">Cronograma de Entregas às Escolas — ${coopName}</div>
          <div class="page-subtitle">Acompanhamento das datas limites, rotas e registro de atesto de entrega</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="navigateTo('cooperativa','pedidos')">📋 Ver Ordens de Serviço</button>
      </div>

      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">Programação de Entregas da Semana</div>
          <span class="status-badge status-ok">${ordens.length} paradas mapeadas</span>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Data Programada</th>
                <th>Escola de Destino</th>
                <th>Região Urbana</th>
                <th>Produtos a Descarregar</th>
                <th>Status</th>
                <th style="text-align:right">Comprovante & Baixa</th>
              </tr>
            </thead>
            <tbody>
              ${ordens.map(o => {
                const sc = (window.DATA && window.DATA.schools ? window.DATA.schools.find(s => s.name === o.school) : null);
                const regiao = sc?.region || 'Urbana (Central)';
                const isEntregue = (o.status === 'Entregue');

                return `
                  <tr>
                    <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">
                      📅 ${_esc(o.date || o.dataLimite || '25/06/2026')}
                    </td>
                    <td>
                      <strong>${_esc(o.school)}</strong>
                      <div style="font-size:0.75rem;color:var(--text-tertiary)">${_esc(sc?.address || 'Av. Afonso Pena, Campo Grande')}</div>
                    </td>
                    <td><span class="tag tag-blue">${_esc(regiao)}</span></td>
                    <td style="font-size:0.82rem">
                      ${(o.itens || []).map(i => `${_esc(i.produto)} (${i.qtd} ${i.unidade})`).join(', ') || 'Insumos do cardápio escolar'}
                    </td>
                    <td><span class="status-badge ${typeof statusClass === 'function' ? statusClass(o.status) : 'status-warning'}">${_esc(o.status)}</span></td>
                    <td style="text-align:right">
                      ${isEntregue 
                        ? `<span style="color:#16a34a;font-weight:700;font-size:0.8rem">✅ Entregue e Atestado</span>`
                        : `<button class="btn btn-sm btn-primary" style="background:#16a34a;border-color:#16a34a;padding:3px 10px;font-size:0.75rem;font-weight:700" onclick="window.abrirModalComprovanteEntregaColaborador('${o.id}')">
                            📸 Registrar Entrega
                          </button>`}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ────────────────────────────────────────────────────────────
  // 4. AGRICULTOR FAMILIAR: DASHBOARD (PAINEL GERAL)
  // ────────────────────────────────────────────────────────────
  PAGE_RENDERERS.agricultor_dashboard = (el) => {
    const prof = (window.PROFILES && window.state && window.PROFILES[window.state.currentProfile]) || {};
    const nome = prof.name || 'José Maria Rodrigues';
    const ordens = _getOrdensDoPerfil();

    const pendentes = ordens.filter(o => o.status === 'Pendente');
    const emSeparacao = ordens.filter(o => o.status === 'Em separação' || o.status === 'Aceito');
    const emTransporte = ordens.filter(o => o.status === 'Em transporte');
    const entregues = ordens.filter(o => o.status === 'Entregue');

    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div class="page-title">Painel Operacional — ${nome}</div>
          <div class="page-subtitle">Agricultor Familiar · Recepção de Ordens e Cronograma de Entrega</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-outline btn-sm" onclick="navigateTo('agricultor','entregas')">📅 Meu Cronograma de Entregas</button>
          <button class="btn btn-primary btn-sm" onclick="navigateTo('agricultor','pedidos')">📋 Minhas Ordens de Serviço (${pendentes.length})</button>
        </div>
      </div>

      <!-- KPIs do Produtor -->
      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card orange" style="cursor:pointer" onclick="navigateTo('agricultor','pedidos')">
          <div class="kpi-icon">📋</div>
          <div class="kpi-value">${pendentes.length}</div>
          <div class="kpi-label">O.S. Aguardando Aceite</div>
        </div>
        <div class="kpi-card blue" style="cursor:pointer" onclick="navigateTo('agricultor','entregas')">
          <div class="kpi-icon">🚚</div>
          <div class="kpi-value">${emSeparacao.length + emTransporte.length}</div>
          <div class="kpi-label">Entregas em Andamento</div>
        </div>
        <div class="kpi-card green">
          <div class="kpi-icon">✅</div>
          <div class="kpi-value">${entregues.length + 18}</div>
          <div class="kpi-label">Entregas Realizadas</div>
        </div>
        <div class="kpi-card purple">
          <div class="kpi-icon">💰</div>
          <div class="kpi-value">R$ 24.500</div>
          <div class="kpi-label">Previsão a Receber</div>
        </div>
      </div>

      <!-- Próximas Entregas do Produtor -->
      <div class="card mb-24" style="border-left:4px solid #16a34a">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">📅 Próximas Entregas para Escolas</div>
          <button class="btn btn-sm btn-ghost" onclick="navigateTo('agricultor','entregas')">Ver Cronograma Completo →</button>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Data Programada</th>
                <th>Escola de Destino</th>
                <th>Produtos da Minha Propriedade</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              ${ordens.slice(0, 4).map(o => `
                <tr>
                  <td style="font-family:var(--font-mono);font-weight:700">📅 ${_esc(o.date || o.dataLimite || '25/06')}</td>
                  <td><strong>${_esc(o.school)}</strong></td>
                  <td style="font-size:0.82rem">
                    ${(o.itens || []).map(i => `${_esc(i.produto)}: ${i.qtd} ${i.unidade}`).join(', ') || 'Mandioca e Hortaliças'}
                  </td>
                  <td><span class="status-badge ${typeof statusClass === 'function' ? statusClass(o.status) : 'status-warning'}">${_esc(o.status)}</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline" style="padding:2px 8px;font-size:0.75rem" onclick="window.abrirModalDetalhesOrdemColaborador('${o.id}')">
                      👁️ Detalhes
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ────────────────────────────────────────────────────────────
  // 5. AGRICULTOR FAMILIAR: ORDENS DE SERVIÇO (PEDIDOS)
  // ────────────────────────────────────────────────────────────
  PAGE_RENDERERS.agricultor_pedidos = (el) => {
    const prof = (window.PROFILES && window.state && window.PROFILES[window.state.currentProfile]) || {};
    const nome = prof.name || 'José Maria Rodrigues';
    const ordens = _getOrdensDoPerfil();

    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div class="page-title">Ordens de Serviço — ${nome}</div>
          <div class="page-subtitle">Demandas atribuídas para fornecimento direto às escolas e cooperativa</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="navigateTo('agricultor','entregas')">📅 Ir ao Cronograma de Entregas</button>
      </div>

      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">Minhas Ordens de Fornecimento</div>
          <span class="tag tag-green" style="font-weight:700">${ordens.length} O.S. atribuídas</span>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead>
              <tr>
                <th>O.S.</th>
                <th>Escola de Destino</th>
                <th>Data Limite</th>
                <th>Produtos Solicitados</th>
                <th>Status</th>
                <th style="text-align:right">Ações</th>
              </tr>
            </thead>
            <tbody>
              ${ordens.map(o => {
                const numStr = String(o.numero || o.id || '101').replace('ord-','');
                const isPendente = (o.status === 'Pendente');
                const isSeparando = (o.status === 'Em separação' || o.status === 'Aceito');
                const isTransporte = (o.status === 'Em transporte');

                return `
                  <tr>
                    <td><span class="tag tag-blue" style="font-family:var(--font-mono);font-weight:700">#OSC-${numStr}</span></td>
                    <td><strong>${_esc(o.school)}</strong></td>
                    <td style="font-family:var(--font-mono)">${_esc(o.dataLimite || o.date || '—')}</td>
                    <td style="font-size:0.82rem">
                      ${(o.itens || []).map(i => `<span class="tag tag-green" style="margin:2px">${_esc(i.produto)}: ${i.qtd} ${i.unidade}</span>`).join('') || '—'}
                    </td>
                    <td><span class="status-badge ${typeof statusClass === 'function' ? statusClass(o.status) : 'status-warning'}">${_esc(o.status)}</span></td>
                    <td style="text-align:right">
                      <div style="display:inline-flex;gap:6px;justify-content:flex-end">
                        <button class="btn btn-sm btn-outline" style="padding:3px 8px;font-size:0.75rem" onclick="window.abrirModalDetalhesOrdemColaborador('${o.id}')">
                          👁️ Detalhes
                        </button>
                        ${isPendente ? `
                          <button class="btn btn-sm btn-primary" style="background:#16a34a;border-color:#16a34a;padding:3px 10px;font-size:0.75rem;font-weight:700" onclick="window.aceitarOrdemColaborador('${o.id}')">
                            ✅ Aceitar
                          </button>
                        ` : ''}
                        ${isSeparando ? `
                          <button class="btn btn-sm btn-primary" style="background:#0284c7;border-color:#0284c7;padding:3px 10px;font-size:0.75rem;font-weight:700" onclick="window.despacharOrdemColaborador('${o.id}')">
                            🚚 Despachar
                          </button>
                        ` : ''}
                        ${isTransporte ? `
                          <button class="btn btn-sm btn-outline" style="color:#16a34a;border-color:#16a34a;padding:3px 8px;font-size:0.75rem;font-weight:700" onclick="window.abrirModalComprovanteEntregaColaborador('${o.id}')">
                            📸 Entregar
                          </button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ────────────────────────────────────────────────────────────
  // 6. AGRICULTOR FAMILIAR: CRONOGRAMA DE ENTREGAS
  // ────────────────────────────────────────────────────────────
  PAGE_RENDERERS.agricultor_entregas = (el) => {
    const prof = (window.PROFILES && window.state && window.PROFILES[window.state.currentProfile]) || {};
    const nome = prof.name || 'José Maria Rodrigues';
    const ordens = _getOrdensDoPerfil();

    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div class="page-title">Meu Cronograma de Entregas — ${nome}</div>
          <div class="page-subtitle">Datas programadas para transporte dos produtos da Agricultura Familiar às escolas</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="navigateTo('agricultor','pedidos')">📋 Ver Ordens de Serviço</button>
      </div>

      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">Calendário de Entregas Programadas</div>
          <span class="status-badge status-ok">${ordens.length} entregas mapeadas</span>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Escola de Destino</th>
                <th>Endereço / Região</th>
                <th>Carga a Descarregar</th>
                <th>Status</th>
                <th style="text-align:right">Comprovação</th>
              </tr>
            </thead>
            <tbody>
              ${ordens.map(o => {
                const sc = (window.DATA && window.DATA.schools ? window.DATA.schools.find(s => s.name === o.school) : null);
                const isEntregue = (o.status === 'Entregue');

                return `
                  <tr>
                    <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">
                      📅 ${_esc(o.date || o.dataLimite || '25/06/2026')}
                    </td>
                    <td><strong>${_esc(o.school)}</strong></td>
                    <td style="font-size:0.8rem;color:var(--text-secondary)">${_esc(sc?.address || sc?.region || 'Campo Grande, MS')}</td>
                    <td style="font-size:0.82rem">
                      ${(o.itens || []).map(i => `${_esc(i.produto)}: ${i.qtd} ${i.unidade}`).join(', ') || 'Hortifrúti'}
                    </td>
                    <td><span class="status-badge ${typeof statusClass === 'function' ? statusClass(o.status) : 'status-warning'}">${_esc(o.status)}</span></td>
                    <td style="text-align:right">
                      ${isEntregue 
                        ? `<span style="color:#16a34a;font-weight:700;font-size:0.8rem">✅ Entregue</span>`
                        : `<button class="btn btn-sm btn-primary" style="background:#16a34a;border-color:#16a34a;padding:3px 10px;font-size:0.75rem;font-weight:700" onclick="window.abrirModalComprovanteEntregaColaborador('${o.id}')">
                            📸 Registrar Entrega
                          </button>`}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  // ────────────────────────────────────────────────────────────
  // 7. MODAIS OPERACIONAIS COMPARTILHADOS
  // ────────────────────────────────────────────────────────────
  window.abrirModalDetalhesOrdemColaborador = (ordemId) => {
    const sid = String(ordemId);
    const ordens = _getOrdensDoPerfil();
    const ordem = ordens.find(o => String(o.id) === sid || String(o.numero) === sid) || ordens[0];

    if (!ordem) {
      if (typeof showToast === 'function') showToast('Ordem de serviço não encontrada.');
      return;
    }

    const modalId = 'modal-detalhes-ordem-colab';
    document.getElementById(modalId)?.remove();

    const numStr = String(ordem.numero || ordem.id || '101').replace('ord-','');
    const modalHtml = `
      <div id="${modalId}" class="modal-backdrop" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);padding:20px;">
        <div class="modal-card animate-fade-up" style="background:var(--surface);width:100%;max-width:680px;border-radius:var(--radius-lg);box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);border:1px solid var(--border);display:flex;flex-direction:column;max-height:90vh;">
          <div style="padding:18px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="display:flex;align-items:center;gap:8px">
                <span style="font-size:1.3rem">📋</span>
                <h3 style="margin:0;font-size:1.15rem;font-weight:700;color:var(--text-primary)">Ordem de Fornecimento #OSC-${numStr}</h3>
                <span class="status-badge ${typeof statusClass === 'function' ? statusClass(ordem.status) : 'status-warning'}">${_esc(ordem.status)}</span>
              </div>
              <p style="margin:4px 0 0 0;font-size:0.82rem;color:var(--text-secondary)">
                Destino: <strong>${_esc(ordem.school)}</strong> · Data Limite: <strong>${_esc(ordem.dataLimite || ordem.date || 'A definir')}</strong>
              </p>
            </div>
            <button type="button" class="btn btn-sm btn-ghost" onclick="document.getElementById('${modalId}').remove()">✕</button>
          </div>

          <div style="padding:20px 24px;overflow-y:auto;flex:1;">
            <div style="background:var(--surface-2);padding:14px;border-radius:8px;margin-bottom:18px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
              <div>
                <div style="font-size:0.75rem;color:var(--text-secondary)">Entidade Solicitante</div>
                <div style="font-weight:700;font-size:0.9rem">SEMED / PNAE</div>
              </div>
              <div>
                <div style="font-size:0.75rem;color:var(--text-secondary)">Valor Estimado</div>
                <div style="font-weight:700;font-size:0.9rem;color:var(--primary)">${typeof formatCurrency === 'function' ? formatCurrency(ordem.value || 0) : 'R$ ' + (ordem.value || 0).toLocaleString('pt-BR')}</div>
              </div>
              <div>
                <div style="font-size:0.75rem;color:var(--text-secondary)">Classificação</div>
                <div style="font-weight:700;font-size:0.9rem">🌾 Agricultura Familiar</div>
              </div>
            </div>

            <h4 style="margin:0 0 10px 0;font-size:0.95rem">Itens e Quantidades a Fornecer:</h4>
            <table class="data-table" style="font-size:0.85rem;margin:0 0 18px 0">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th style="text-align:right">Quantidade</th>
                  <th style="text-align:center">Padrão de Embalagem</th>
                </tr>
              </thead>
              <tbody>
                ${(ordem.itens || []).map(i => `
                  <tr>
                    <td><strong>${_esc(i.produto)}</strong></td>
                    <td style="text-align:right;font-family:var(--font-mono);font-weight:700">${i.qtd} ${i.unidade}</td>
                    <td style="text-align:center"><span class="tag tag-teal">Caixa Higienizada</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="background:rgba(2,132,199,0.06);border:1px solid rgba(2,132,199,0.2);padding:12px;border-radius:6px;font-size:0.82rem;color:var(--text-secondary)">
              ℹ️ <strong>Recomendações de Entrega:</strong> Os produtos devem ser entregues higienizados, respeitando o horário de recebimento da escola (07:30 às 10:30) com apresentação da guia/comprovante.
            </div>
          </div>

          <div style="padding:16px 24px;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;background:var(--surface)">
            <button type="button" class="btn btn-outline" onclick="document.getElementById('${modalId}').remove()">Fechar</button>
            <div style="display:flex;gap:8px">
              ${ordem.status === 'Pendente' ? `
                <button type="button" class="btn btn-primary" style="background:#16a34a;border-color:#16a34a;font-weight:700" onclick="document.getElementById('${modalId}').remove(); window.aceitarOrdemColaborador('${ordem.id}')">
                  ✅ Aceitar Ordem de Serviço
                </button>
              ` : ''}
              ${(ordem.status === 'Em separação' || ordem.status === 'Aceito') ? `
                <button type="button" class="btn btn-primary" style="background:#0284c7;border-color:#0284c7;font-weight:700" onclick="document.getElementById('${modalId}').remove(); window.despacharOrdemColaborador('${ordem.id}')">
                  🚚 Despachar Carga
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  };

  window.aceitarOrdemColaborador = (ordemId) => {
    if (window.SharedState && typeof window.SharedState.updateOrderStatus === 'function') {
      window.SharedState.updateOrderStatus(ordemId, 'Em separação');
    }
    if (typeof showToast === 'function') {
      showToast('✅ Ordem de Serviço aceita com sucesso! Inicie a separação dos produtos.');
    }
    if (typeof renderPage === 'function') renderPage();
  };

  window.despacharOrdemColaborador = (ordemId) => {
    if (window.SharedState && typeof window.SharedState.updateOrderStatus === 'function') {
      window.SharedState.updateOrderStatus(ordemId, 'Em transporte');
    }
    if (typeof showToast === 'function') {
      showToast('🚚 Carga despachada! A escola e a SEMED foram notificadas que os produtos estão a caminho.');
    }
    if (typeof renderPage === 'function') renderPage();
  };

  window.abrirModalComprovanteEntregaColaborador = (ordemId) => {
    const sid = String(ordemId);
    const ordens = _getOrdensDoPerfil();
    const ordem = ordens.find(o => String(o.id) === sid || String(o.numero) === sid) || ordens[0];

    const modalId = 'modal-comprovante-colab';
    document.getElementById(modalId)?.remove();

    const modalHtml = `
      <div id="${modalId}" class="modal-backdrop" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(15,23,42,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);padding:20px;">
        <div class="modal-card animate-fade-up" style="background:var(--surface);width:100%;max-width:520px;border-radius:var(--radius-lg);box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);border:1px solid var(--border);display:flex;flex-direction:column;">
          <div style="padding:18px 24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
            <h3 style="margin:0;font-size:1.15rem;font-weight:700;color:var(--text-primary)">📸 Registrar Entrega Realizada</h3>
            <button type="button" class="btn btn-sm btn-ghost" onclick="document.getElementById('${modalId}').remove()">✕</button>
          </div>
          <div style="padding:20px 24px;">
            <p style="margin:0 0 14px 0;font-size:0.85rem;color:var(--text-secondary)">
              Confirmar entrega para a unidade: <strong>${_esc(ordem?.school || 'Escola')}</strong>
            </p>
            <div style="border:2px dashed var(--border);border-radius:8px;padding:24px;text-align:center;margin-bottom:14px;background:var(--surface-2)">
              <div style="font-size:2rem;margin-bottom:8px">📷</div>
              <div style="font-size:0.85rem;font-weight:600;color:var(--text-primary)">Foto do Comprovante Assinado ou da Mercadoria</div>
              <div style="font-size:0.75rem;color:var(--text-tertiary);margin-top:4px">Clique para capturar foto pelo celular ou anexar imagem</div>
              <input type="file" accept="image/*" style="margin-top:10px;font-size:0.8rem">
            </div>
            <div style="margin-bottom:12px">
              <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Nome do Recebedor na Escola:</label>
              <input type="text" id="input-recebedor-nome" placeholder="Ex.: Maria Souza (Merendeira/Diretora)" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:6px;font-size:0.85rem">
            </div>
          </div>
          <div style="padding:16px 24px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px;background:var(--surface)">
            <button type="button" class="btn btn-outline" onclick="document.getElementById('${modalId}').remove()">Cancelar</button>
            <button type="button" class="btn btn-primary" style="background:#16a34a;border-color:#16a34a;font-weight:700" onclick="
              if (window.SharedState && typeof window.SharedState.updateOrderStatus === 'function') {
                window.SharedState.updateOrderStatus('${ordem?.id}', 'Entregue');
              }
              document.getElementById('${modalId}').remove();
              if (typeof showToast === 'function') showToast('✅ Entrega confirmada com sucesso!');
              if (typeof renderPage === 'function') renderPage();
            ">
              Confirmar e Dar Baixa
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  };

  // ────────────────────────────────────────────────────────────
  // 8. ALIASES E RETROCOMPATIBILIDADE (ZERO REGRESSÃO)
  // ────────────────────────────────────────────────────────────
  // Garante que se testes antigos ou chamadas herdadas invocarem rotas antigas,
  // elas renderizem perfeitamente sem falha e informando o redirecionamento.

  const _renderTransicaoModulo = (el, nomeFunc, destinoRota) => {
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">${nomeFunc}</div>
        <div class="page-subtitle">Módulo operacional simplificado para foco em Ordens e Entregas</div>
      </div>
      <div class="card" style="padding:24px;text-align:center;max-width:680px;margin:20px auto">
        <div style="font-size:2.5rem;margin-bottom:12px">🌾</div>
        <h3 style="margin:0 0 8px 0;font-size:1.15rem">Módulo de ${nomeFunc}</h3>
        <p style="color:var(--text-secondary);font-size:0.88rem;margin:0 0 20px 0;line-height:1.5">
          As rotas internas de gestão patrimonial e safras estão em fase de consolidação para o módulo dedicado de <strong>Gestão do Fornecedor</strong>. As operações do dia a dia estão concentradas em suas <strong>Ordens de Serviço</strong> e <strong>Cronograma de Entregas</strong>.
        </p>
        <div style="display:flex;gap:10px;justify-content:center">
          <button class="btn btn-primary" onclick="navigateTo(state.currentProfile, 'pedidos')">📋 Ver Ordens de Serviço</button>
          <button class="btn btn-outline" onclick="navigateTo(state.currentProfile, 'entregas')">📅 Ver Cronograma de Entregas</button>
        </div>
      </div>
    `;
  };

  // Cooperativa: rotas secundárias
  PAGE_RENDERERS.cooperativa_agricultores = (el) => _renderTransicaoModulo(el, 'Gestão de Agricultores Associados', 'pedidos');
  PAGE_RENDERERS.cooperativa_produtos = (el) => _renderTransicaoModulo(el, 'Catálogo de Produtos', 'pedidos');
  PAGE_RENDERERS.cooperativa_estoque = (el) => _renderTransicaoModulo(el, 'Estoque Consolidado', 'pedidos');
  PAGE_RENDERERS.cooperativa_planejamento = (el) => PAGE_RENDERERS.cooperativa_entregas(el);
  PAGE_RENDERERS.cooperativa_rotas = (el) => PAGE_RENDERERS.cooperativa_entregas(el);
  PAGE_RENDERERS.cooperativa_contratos = (el) => _renderTransicaoModulo(el, 'Contratos e Chamamentos Públicos', 'pedidos');
  PAGE_RENDERERS.cooperativa_relatorios = (el) => _renderTransicaoModulo(el, 'Relatórios de Fornecimento', 'pedidos');
  PAGE_RENDERERS.cooperativa_indicadores = (el) => _renderTransicaoModulo(el, 'Indicadores de Desempenho', 'pedidos');
  PAGE_RENDERERS.cooperativa_escolas = (el) => {
    const schools = (window.DATA && window.DATA.schools) ? window.DATA.schools : [];
    const total = schools.reduce((s,e) => s + (e.students||0), 0);
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
                  const restrCount = (window.SharedState && typeof window.SharedState.getRestricoes === 'function' ? (window.SharedState.getRestricoes(s.id) || []) : []).filter(r => r.status === 'ativo').reduce((a,b)=>a+(b.quantidade||1), 0);
                  const localStock = (window.SharedState && typeof window.SharedState.getSchoolStock === 'function') ? (window.SharedState.getSchoolStock(s.name) || []) : [];
                  const deliveries = (window.SharedState && typeof window.SharedState.getDeliveries === 'function') ? window.SharedState.getDeliveries().filter(d => d.school === s.name || d.escola === s.name) : [];
                  const lastDel = deliveries.length > 0 ? (deliveries[deliveries.length-1].confirmadoEm || deliveries[deliveries.length-1].criadoEm) : s.lastDelivery;
                  return `
                  <tr>
                    <td><strong>${_esc(s.name)}</strong></td>
                    <td><span class="tag tag-blue">${_esc(s.region)}</span></td>
                    <td><span class="tag tag-teal" style="font-size:0.7rem">${_esc(s.modality || 'Escolar Urbana')}</span></td>
                    <td style="font-family:var(--font-mono)">${s.students}</td>
                    <td>${restrCount > 0 ? `<span class="status-badge warning" style="font-size:0.7rem">⚠️ ${restrCount} aluno(s)</span>` : '<span style="color:var(--text-tertiary);font-size:0.8rem">Nenhuma</span>'}</td>
                    <td><div style="display:flex;align-items:center;gap:8px">
                      <div class="progress-bar" style="width:80px"><div class="progress-fill ${s.stockPct>60?'green':s.stockPct>30?'orange':'red'}" style="width:${s.stockPct}%"></div></div>
                      <span style="font-family:var(--font-mono);font-size:0.78rem">${s.stockPct}% (${localStock.length} itens)</span>
                    </div></td>
                    <td><span class="status-badge ${typeof statusClass === 'function' ? statusClass(s.stockStatus) : 'status-ok'}">${typeof statusLabel === 'function' ? statusLabel(s.stockStatus) : s.stockStatus}</span></td>
                    <td style="font-size:0.82rem">${lastDel ? String(lastDel).slice(0, 10) : '—'}</td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  // Agricultor: rotas secundárias
  PAGE_RENDERERS.agricultor_producao = (el) => _renderTransicaoModulo(el, 'Minha Produção', 'pedidos');
  PAGE_RENDERERS.agricultor_estoque = (el) => _renderTransicaoModulo(el, 'Meu Estoque', 'pedidos');
  PAGE_RENDERERS.agricultor_calendario = (el) => PAGE_RENDERERS.agricultor_entregas(el);
  PAGE_RENDERERS.agricultor_relatorios = (el) => _renderTransicaoModulo(el, 'Relatórios Operacionais', 'pedidos');
  PAGE_RENDERERS.agricultor_perfil = (el) => _renderTransicaoModulo(el, 'Perfil do Produtor Rural', 'pedidos');
  PAGE_RENDERERS.agricultor_escolas = (el) => PAGE_RENDERERS.agricultor_entregas(el);

})();
