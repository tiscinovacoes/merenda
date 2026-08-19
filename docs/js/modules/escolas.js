/* ============================================
   SUALE — Módulo Escolas (js/modules/escolas.js)
   Perfis: Escola / Diretor / Merendeira / Resp. Estoque
   ============================================ */

(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  // REGISTRO DE RENDERERS DA ESCOLA (Assinatura: (el) => { el.innerHTML = ...; })
  //
  // Regra 6 do PLANO_MODULARIZACAO_APP.md: não registrar chave cuja versão em
  // app.js é mais completa. A auditoria de 2026-08-18 constatou que dashboard,
  // estoque, consumo, pedidos, entregas, planejamento/cardapios, escolas e
  // restricoes são mais ricas em app.js (frequência/orçamento reais, timeline de
  // status, sugestão IA, itens múltiplos). As funções seguem definidas abaixo,
  // prontas para assumir quando forem migradas de verdade.
  //
  // Migradas e ativas: chaves que app.js não define. Delegam em tempo de chamada
  // para as telas ricas do perfil escola, em vez de servir a versão mais pobre
  // deste módulo (mesmo padrão de alias que app.js usa para os outros subperfis).
  PAGE_RENDERERS['resp_estoque_estoque'] = (el) => PAGE_RENDERERS['escola_estoque'](el);
  PAGE_RENDERERS['resp_estoque_entregas'] = (el) => PAGE_RENDERERS['escola_entregas'](el);
  PAGE_RENDERERS['merendeira_pedidos'] = (el) => PAGE_RENDERERS['escola_pedidos'](el);

  function getCurrentSchoolHelper() {
    if (typeof getCurrentSchool === 'function') return getCurrentSchool();
    const all = (typeof DATA !== 'undefined' && DATA.schools) ? DATA.schools : [];
    if (state && state.selectedSchool) return state.selectedSchool;
    if (state && state.selectedSchoolId) {
      const byId = all.find(sc => sc.id === state.selectedSchoolId);
      if (byId) return byId;
    }
    return all[0] || { name: 'EM DEMO', students: 500, region: 'Centro', director: 'Maria Santos' };
  }

  // 1. DASHBOARD ESCOLA
  function renderEscolaDashboard(el) {
    const sc = getCurrentSchoolHelper();
    const localStock = SharedState.getSchoolStock ? SharedState.getSchoolStock(sc.name) : [];
    const consumo = SharedState.getConsumo ? SharedState.getConsumo(sc.name) : [];
    const pedidos = SharedState.getOrders ? SharedState.getOrders().filter(o => o.school === sc.name) : [];

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Painel da Unidade — ${sc.name}</div>
        <div class="page-subtitle">Gestão escolar local · ${sc.region || 'Região'} · Direção: ${sc.director || sc.diretor || '—'}</div>
      </div>

      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card blue"><div class="kpi-icon">👨‍🎓</div><div class="kpi-value">${sc.students || 500}</div><div class="kpi-label">Alunos Atendidos</div></div>
        <div class="kpi-card green"><div class="kpi-icon">📦</div><div class="kpi-value">${localStock.length || 18}</div><div class="kpi-label">Produtos em Estoque</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">📝</div><div class="kpi-value">${consumo.length}</div><div class="kpi-label">Registros de Consumo</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">🛒</div><div class="kpi-value">${pedidos.length}</div><div class="kpi-label">Pedidos Efetuados</div></div>
      </div>

      <div class="card mb-24">
        <div class="card-header"><div class="card-title">🚀 Ações Rápidas da Escola</div></div>
        <div class="card-body" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
          <button class="btn btn-primary" onclick="navigateTo('escola','consumo')">📝 Registrar Consumo</button>
          <button class="btn btn-outline" onclick="navigateTo('escola','estoque')">📦 Consultar Estoque</button>
          <button class="btn btn-outline" onclick="navigateTo('escola','pedidos')">🛒 Solicitar Pedido</button>
          <button class="btn btn-outline" onclick="navigateTo('escola','entregas')">🚚 Conferir Entregas</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">📅 Cardápio Vigente na Escola</div></div>
        <div class="card-body">
          <p style="font-size:0.88rem;color:var(--text-secondary);margin:0">
            Acesse a aba <strong>Planejamento</strong> no menu lateral para visualizar os ingredientes e o per capita diário.
          </p>
        </div>
      </div>
    `;
  }

  // 2. ESTOQUE DA ESCOLA
  function renderEscolaEstoque(el) {
    const sc = getCurrentSchoolHelper();
    const products = DATA.products || [];
    const localStock = SharedState.getSchoolStock ? SharedState.getSchoolStock(sc.name) : [];

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Estoque Local — ${sc.name}</div>
        <div class="page-subtitle">Inventário físico atualizado por consumo e entregas recebidas</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Itens em Estoque na Escola</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Produto</th><th>Categoria</th><th>Quantidade Local</th><th>Unidade</th></tr></thead>
            <tbody>
              ${products.map(p => {
                const local = localStock.find(l => l.produto === p.name);
                const qty = local ? local.qtd : Math.round((p.stock || 0) / 20);
                return `
                  <tr>
                    <td><strong>${p.name}</strong></td>
                    <td><span class="tag tag-blue">${p.category || 'Geral'}</span></td>
                    <td style="font-family:var(--font-mono);font-weight:700">${qty.toLocaleString('pt-BR')}</td>
                    <td>${p.unit || 'kg'}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 3. CONSUMO DA ESCOLA
  function renderEscolaConsumo(el) {
    const sc = getCurrentSchoolHelper();
    const products = DATA.products || [];
    const consumo = SharedState.getConsumo ? SharedState.getConsumo(sc.name) : [];

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Registro Diário de Consumo — ${sc.name}</div>
        <div class="page-subtitle">Lançamento de alimentos utilizados por refeição</div>
      </div>
      <div class="grid-2-1">
        <div class="card">
          <div class="card-header"><div class="card-title">📝 Novo Lançamento de Consumo</div></div>
          <div class="card-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
              <div><label style="font-size:0.82rem;font-weight:600">Data</label><input type="date" id="cons-date" value="${new Date().toISOString().slice(0,10)}" class="btn btn-outline" style="width:100%"></div>
              <div><label style="font-size:0.82rem;font-weight:600">Refeição</label><select id="cons-meal" class="btn btn-outline" style="width:100%"><option>Almoço</option><option>Lanche Manhã</option><option>Lanche Tarde</option></select></div>
            </div>
            <div style="display:grid;grid-template-columns:2fr 1fr 80px;gap:12px;margin-bottom:12px">
              <div><label style="font-size:0.82rem;font-weight:600">Produto</label><select id="cons-product" class="btn btn-outline" style="width:100%">${products.map(p=>`<option>${p.name}</option>`).join('')}</select></div>
              <div><label style="font-size:0.82rem;font-weight:600">Qtd</label><input type="number" id="cons-qty" placeholder="0" class="btn btn-outline" style="width:100%"></div>
              <div><label style="font-size:0.82rem;font-weight:600">Un.</label><select id="cons-unit" class="btn btn-outline" style="width:100%"><option>kg</option><option>L</option><option>dz</option></select></div>
            </div>
            <button class="btn btn-primary" style="width:100%" id="btn-save-cons">✅ Registrar Consumo</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">📋 Lançamentos Recentes</div></div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Data</th><th>Produto</th><th>Qtd</th></tr></thead>
              <tbody>
                ${consumo.slice(0, 6).map(c => `
                  <tr>
                    <td>${c.data || '—'}</td>
                    <td><strong>${c.produto}</strong></td>
                    <td style="font-family:var(--font-mono)">${c.qtd} ${c.unidade || ''}</td>
                  </tr>
                `).join('') || '<tr><td colspan="3" style="text-align:center;padding:16px">Sem registros recentes</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-save-cons')?.addEventListener('click', () => {
      const prod = document.getElementById('cons-product')?.value;
      const qty = parseFloat(document.getElementById('cons-qty')?.value || 0);
      const unit = document.getElementById('cons-unit')?.value;

      if (!qty) return alert('Informe a quantidade de consumo.');

      SharedState.addConsumo({ escola: sc.name, produto: prod, qtd: qty, unidade: unit, data: document.getElementById('cons-date')?.value, refeicao: document.getElementById('cons-meal')?.value });
      showToast(`📝 Consumo de ${qty} ${unit} de ${prod} registrado com sucesso!`);
      renderEscolaConsumo(document.getElementById('page-content'));
    });
  }

  // 4. PEDIDOS DA ESCOLA
  function renderEscolaPedidos(el) {
    const sc = getCurrentSchoolHelper();
    const products = DATA.products || [];
    const orders = SharedState.getOrders ? SharedState.getOrders().filter(o => o.school === sc.name) : [];

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Pedidos de Abastecimento — ${sc.name}</div>
        <div class="page-subtitle">Solicitar reposição de produtos ao Almoxarifado / Cooperativa</div>
      </div>
      <div class="grid-2-1">
        <div class="card">
          <div class="card-header"><div class="card-title">🛒 Solicitar Novo Pedido</div></div>
          <div class="card-body">
            <div style="margin-bottom:12px"><label style="font-size:0.82rem;font-weight:600">Produto</label><select id="ped-product" class="btn btn-outline" style="width:100%">${products.map(p=>`<option>${p.name}</option>`).join('')}</select></div>
            <div style="margin-bottom:12px"><label style="font-size:0.82rem;font-weight:600">Quantidade Solicitada</label><input type="number" id="ped-qty" placeholder="Qtd" class="btn btn-outline" style="width:100%"></div>
            <button class="btn btn-primary" style="width:100%" id="btn-send-ped">📤 Enviar Pedido</button>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">📋 Histórico de Solicitados</div></div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>#</th><th>Valor</th><th>Status</th></tr></thead>
              <tbody>
                ${orders.map(o => `
                  <tr>
                    <td><strong>#${String(o.numero).padStart(3, '0')}</strong></td>
                    <td style="font-family:var(--font-mono)">R$ ${(o.value || 0).toLocaleString('pt-BR')}</td>
                    <td><span class="status-badge ${o.status === 'Entregue' ? 'status-ok' : 'status-warning'}">${o.status}</span></td>
                  </tr>
                `).join('') || '<tr><td colspan="3" style="text-align:center;padding:16px">Nenhum pedido efetuado</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-send-ped')?.addEventListener('click', () => {
      const prod = document.getElementById('ped-product')?.value;
      const qty = parseFloat(document.getElementById('ped-qty')?.value || 0);

      if (!qty) return alert('Informe a quantidade para o pedido.');

      const newOrder = SharedState.addOrder({ school: sc.name, cooperative: 'COOPAGRAN', itens: [{ produto: prod, qtd: qty, unidade: 'kg' }], value: qty * 12 });
      showToast(`📤 Pedido #${String(newOrder.numero).padStart(3, '0')} enviado com sucesso!`);
      renderEscolaPedidos(document.getElementById('page-content'));
    });
  }

  // 5. ENTREGAS DA ESCOLA
  function renderEscolaEntregas(el) {
    const sc = getCurrentSchoolHelper();
    const orders = SharedState.getOrders ? SharedState.getOrders().filter(o => o.school === sc.name && o.status !== 'Entregue') : [];

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Recebimento de Entregas — ${sc.name}</div>
        <div class="page-subtitle">Conferência física e ateste de recebimento de remessas</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">🚚 Entregas Pendentes de Ateste</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>#</th><th>Origem</th><th>Data</th><th>Status</th><th>Ação</th></tr></thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td><strong>#${String(o.numero).padStart(3, '0')}</strong></td>
                  <td>${o.cooperative || 'Almoxarifado Central'}</td>
                  <td>${o.date || '—'}</td>
                  <td><span class="status-badge status-warning">${o.status}</span></td>
                  <td>
                    <button class="btn btn-sm btn-primary" onclick="window.atestarEntregaEscola(${o.id})">✅ Atestar Recebimento</button>
                  </td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="text-align:center;padding:24px">Nenhuma entrega pendente de ateste no momento.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;

    window.atestarEntregaEscola = (id) => {
      const order = orders.find(o => o.id === id);
      if (order) {
        order.status = 'Entregue';
        SharedState._persist();
        showToast(`✅ Recebimento do Pedido #${String(order.numero).padStart(3, '0')} atestado com sucesso!`);
        renderEscolaEntregas(document.getElementById('page-content'));
      }
    };
  }

  // 6. PLANEJAMENTO
  function renderEscolaPlanejamento(el) {
    const sc = getCurrentSchoolHelper();
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Planejamento Alimentar — ${sc.name}</div>
        <div class="page-subtitle">Cardápio ativo semanal aprovado pela Nutricionista</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📅 Refeições Semanais</div></div>
        <div class="card-body">
          <p>O cardápio vigente nesta unidade inclui alimentos frescos da Agricultura Familiar local.</p>
        </div>
      </div>
    `;
  }

  // 7. PERFIL DA UNIDADE ESCOLAR
  function renderEscolaPerfilUnidade(el) {
    const sc = getCurrentSchoolHelper();
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Minha Escola — ${sc.name}</div>
        <div class="page-subtitle">Visão consolidada da unidade · ${sc.region || 'Região'} · Diretor(a): ${sc.director || sc.diretor || '—'}</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📇 Dados da Unidade</div></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div><strong>Nome:</strong> ${sc.name}</div>
            <div><strong>Região:</strong> ${sc.region || 'Centro'}</div>
            <div><strong>Alunos Matriculados:</strong> ${sc.students || 500}</div>
            <div><strong>Direção:</strong> ${sc.director || sc.diretor || '—'}</div>
          </div>
        </div>
      </div>
    `;
  }

  // 8. RESTRIÇÕES DA ESCOLA
  function renderEscolaRestricoes(el) {
    if (typeof PAGE_RENDERERS['nutricionista_restricoes'] === 'function') {
      PAGE_RENDERERS['nutricionista_restricoes'](el);
      return;
    }
    renderEscolaDashboard(el);
  }

})();
