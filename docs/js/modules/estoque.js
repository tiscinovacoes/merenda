/* ============================================
   SUALE — Módulo Estoque Central (js/modules/estoque.js)
   Perfil: Almoxarifado / Logística / Estoque Central
   ============================================ */

(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  // REGISTRO DE RENDERERS DO ESTOQUE CENTRAL (Assinatura: (el) => { el.innerHTML = ...; })
  //
  // Regra 6 do PLANO_MODULARIZACAO_APP.md: não registrar chave cuja versão em
  // app.js é mais completa. As telas de dashboard, entradas/recebimentos-pendentes,
  // separacao/expedicao-os, carregamento/ordens-entrega e os-central são servidas
  // pelos módulos de alta fidelidade do Gestor (conferência física RN01, confronto
  // NF-e, separação FEFO RN06/RN07, motorista/veículo/rota + assinatura digital) —
  // as versões deste módulo são tabelas simples, sem essas ações. As funções seguem
  // definidas abaixo, prontas para assumir quando forem migradas de verdade.
  //
  // Nenhuma chave registrada por enquanto. As antigas `estoque_lista-compras` e
  // `estoque_os-fornecedores` foram removidas por decisão do usuário (2026-08-19):
  // não havia item de menu para elas no perfil Estoque e não devem entrar. As
  // funções seguem abaixo, prontas para quando/se essas telas forem incorporadas
  // ao menu do perfil.

  // 1. DASHBOARD ESTOQUE CENTRAL
  function renderEstoqueDashboard(el) {
    const products = DATA.products || [];
    const os = SharedState.getOsEstoqueCentral ? SharedState.getOsEstoqueCentral() : [];
    const pendentes = os.filter(o => o.status === 'Pendente' || o.status === 'Em Separação');
    const emRisco = products.filter(p => (p.daysLeft || 0) <= 5);

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Almoxarifado Central SEMED — Campo Grande</div>
        <div class="page-subtitle">Gestão de recebimentos, expedição de ordens de serviço e controle de inventário</div>
      </div>

      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${products.length}</div><div class="kpi-label">Itens no Inventário</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">⏳</div><div class="kpi-value">${pendentes.length}</div><div class="kpi-label">OS em Separação</div></div>
        <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${emRisco.length}</div><div class="kpi-label">Itens em Risco (< 5 dias)</div></div>
        <div class="kpi-card green"><div class="kpi-icon">📥</div><div class="kpi-value">100%</div><div class="kpi-label">Validação NFe XML</div></div>
      </div>

      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">📥 Ações de Entrada & Expedição</div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primary btn-sm" onclick="window.abrirModalImportarNFeXML()">📥 Receber NF-e via XML</button>
            <button class="btn btn-outline btn-sm" onclick="window.executarSimulacaoEngine7Passos()">⚡ Rodar Engine Abastecimento</button>
          </div>
        </div>
        <div class="card-body">
          <p style="font-size:0.88rem;color:var(--text-secondary);margin:0">
            Dê entrada física de mercadorias no Almoxarifado Central via chave XML ou processe a Engine de 7 Passos para separar insumos destinados às escolas.
          </p>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">📋 Ordens de Serviço Recentes no Estoque Central</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>OS nº</th><th>Tipo</th><th>Produto</th><th>Quantidade</th><th>Destino/Origem</th><th>Status</th></tr></thead>
            <tbody>
              ${os.slice(0, 8).map(o => `
                <tr>
                  <td><strong>${o.numero_os || 'OS-001'}</strong></td>
                  <td><span class="tag tag-blue">${o.tipo || 'Entrada'}</span></td>
                  <td>${o.produto}</td>
                  <td style="font-family:var(--font-mono);font-weight:700">${o.quantidade} ${o.unidade || 'kg'}</td>
                  <td>${o.escola_destino || o.fornecedor || 'SEMED Central'}</td>
                  <td><span class="status-badge ${o.status === 'Recebido' || o.status === 'Entregue' ? 'status-ok' : 'status-warning'}">${o.status || 'Pendente'}</span></td>
                </tr>
              `).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px">Nenhuma OS registrada</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 2. PRODUTOS / CATÁLOGO
  function renderEstoqueProdutos(el) {
    const products = DATA.products || [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Inventário do Estoque Central</div>
        <div class="page-subtitle">Posição física de insumos, lotes e autonomia estimada</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Insumos em Estoque</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Produto</th><th>Categoria</th><th>Estoque Atual</th><th>Autonomia</th><th>Status</th></tr></thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td><span class="tag tag-blue">${p.category}</span></td>
                  <td style="font-family:var(--font-mono);font-weight:700">${(p.stock || 0).toLocaleString('pt-BR')} ${p.unit}</td>
                  <td style="font-family:var(--font-mono)">${p.daysLeft || 30} dias</td>
                  <td><span class="status-badge ${p.stock === 0 ? 'status-danger' : 'status-ok'}">${p.stock === 0 ? 'Zerado' : 'OK'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 3. ENTRADAS / RECEBIMENTOS
  function renderEstoqueEntradas(el) {
    const os = SharedState.getOsEstoqueCentral ? SharedState.getOsEstoqueCentral().filter(o => o.tipo === 'Entrada') : [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Recebimento de Mercadorias (Entradas)</div>
        <div class="page-subtitle">Validação de NF-e e conferência física no Almoxarifado Central</div>
      </div>
      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">📥 Importação de NF-e</div>
          <button class="btn btn-primary btn-sm" onclick="window.abrirModalImportarNFeXML()">📥 Ler XML de Nota Fiscal</button>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>OS nº</th><th>Fornecedor</th><th>Produto</th><th>Qtd Entregue</th><th>Lote</th><th>Validade</th><th>Status</th></tr></thead>
            <tbody>
              ${os.map(o => `
                <tr>
                  <td><strong>${o.numero_os}</strong></td>
                  <td>${o.fornecedor || '—'}</td>
                  <td>${o.produto}</td>
                  <td style="font-family:var(--font-mono);font-weight:700">${o.quantidade} ${o.unidade}</td>
                  <td>${o.lote || '—'}</td>
                  <td>${o.validade || '—'}</td>
                  <td><span class="status-badge status-ok">${o.status}</span></td>
                </tr>
              `).join('') || '<tr><td colspan="7" style="text-align:center;padding:24px">Nenhuma entrada registrada. Utilize a importação XML acima.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 4. SEPARAÇÃO DE CARGA
  function renderEstoqueSeparacao(el) {
    const os = SharedState.getOsEstoqueCentral ? SharedState.getOsEstoqueCentral().filter(o => o.tipo === 'Saída' || o.tipo === 'Transferência') : [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Separação de Carga & Expedição</div>
        <div class="page-subtitle">Montagem de rotas e ordens de fornecimento para as escolas</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Ordens de Saída</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>OS nº</th><th>Escola Destino</th><th>Produto</th><th>Quantidade</th><th>Status</th></tr></thead>
            <tbody>
              ${os.map(o => `
                <tr>
                  <td><strong>${o.numero_os}</strong></td>
                  <td>${o.escola_destino || '—'}</td>
                  <td>${o.produto}</td>
                  <td style="font-family:var(--font-mono);font-weight:700">${o.quantidade} ${o.unidade}</td>
                  <td><span class="status-badge status-warning">${o.status}</span></td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="text-align:center;padding:24px">Nenhuma ordem em separação no momento.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 5. CARREGAMENTO E ENTREGAS
  function renderEstoqueCarregamento(el) {
    const orders = SharedState.getOrders ? SharedState.getOrders() : [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Ordens de Entrega & Carregamento</div>
        <div class="page-subtitle">Acompanhamento de saídas de veículos do Almoxarifado Central</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Entregas em Rota</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Pedido nº</th><th>Escola Destino</th><th>Fornecedor / Origem</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td><strong>#${String(o.numero).padStart(3, '0')}</strong></td>
                  <td>${o.school || o.escola}</td>
                  <td>${o.cooperative || 'Almox. Central'}</td>
                  <td style="font-family:var(--font-mono)">R$ ${(o.value || 0).toLocaleString('pt-BR')}</td>
                  <td><span class="status-badge ${o.status === 'Entregue' ? 'status-ok' : 'status-warning'}">${o.status}</span></td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="text-align:center;padding:24px">Nenhuma entrega em transporte</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 6. OS CENTRAL
  // Direção única de delegação: estoque → gestor (o Gestor possui estas telas e o
  // perfil Estoque as reaproveita). Nunca delegar de volta a partir do gestor.js,
  // sob pena de recursão infinita. Ver nota nos itens 9–11 do js/modules/gestor.js.
  function renderEstoqueOsCentral(el) {
    if (typeof PAGE_RENDERERS['gestor_os-central'] === 'function') {
      PAGE_RENDERERS['gestor_os-central'](el);
      return;
    }
    renderEstoqueDashboard(el);
  }

  // 7. RELATÓRIOS
  function renderEstoqueRelatorios(el) {
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Relatórios do Estoque Central</div>
        <div class="page-subtitle">Relatório de movimentação de inventário, FEFO e auditoria</div>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Selecione o tipo de relatório desejado:</p>
          <button class="btn btn-outline" onclick="window.abrirModalLogsAuditoria()">📜 Trilha de Auditoria de Movimentações</button>
        </div>
      </div>
    `;
  }

  // 8. LISTA DE COMPRAS
  function renderEstoqueListaCompras(el) {
    if (typeof PAGE_RENDERERS['gestor_lista-compras'] === 'function') {
      PAGE_RENDERERS['gestor_lista-compras'](el);
      return;
    }
    renderEstoqueDashboard(el);
  }

  // 9. OS FORNECEDORES
  function renderEstoqueOsFornecedores(el) {
    if (typeof PAGE_RENDERERS['gestor_os-fornecedores'] === 'function') {
      PAGE_RENDERERS['gestor_os-fornecedores'](el);
      return;
    }
    renderEstoqueDashboard(el);
  }

  // ============================================================
  // MIGRADO DO app.js NA FASE 4.3 (movido, nao reescrito)
  // ============================================================
  // estoque_dashboard, estoque_inventario, estoque_lotes e os 16 helpers de
  // recebimento/separacao/bipagem (usados so por esta familia). As telas de OS
  // (os-central/recebimentos/expedicao/ordens) seguem como aliases para o gestor
  // no fim do app.js. As funcoes render* rasas acima ficaram como dead code.

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

// NOTA: estoque_entradas/separacao/carregamento sao servidos pelos modulos do Gestor (ver ALIASES no fim do arquivo). Os helpers abaixo seguem em uso.
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
  const atesteEl = document.getElementById('rec-ateste');
  const ateste = atesteEl ? atesteEl.checked : true;
  if (!ateste) { alert('Você precisa atestar a conferência da mercadoria marcando a caixa de seleção!'); return; }
  
  const qtd = parseFloat(document.getElementById('rec-qtd')?.value || 0);
  const val = document.getElementById('rec-val')?.value;
  const nf = document.getElementById('rec-nf')?.value;
  if (!val || !nf || !qtd || qtd <= 0) { alert('Preencha os dados da NF, Validade e Quantidade corretamente!'); return; }
  
  // Atualizar Pedido
  DATA.ata_pedidos = DATA.ata_pedidos || [];
  const p = DATA.ata_pedidos.find(x => x.id === pedidoId);
  if (p) p.delivered = (p.delivered || 0) + qtd;
  
  // Alimentar Estoque Real e gerar Lote
  DATA.ataProducts = DATA.ataProducts || [];
  const ataP = DATA.ataProducts.find(x => x.id === prodId);
  const unitPrice = ataP ? (ataP.unitPrice || 0) : 0;
  
  DATA.products = DATA.products || [];
  const stockProd = ataP ? DATA.products.find(x => x.id === ataP.stockProductId) : null;
  if (stockProd) {
    stockProd.stock = (stockProd.stock || 0) + qtd;
    DATA.lots = DATA.lots || [];
    DATA.lots.push({ id: DATA.lots.length + 1, productId: stockProd.id, number: nf, entryDate: new Date().toISOString().split('T')[0], expirationDate: val, qtd: qtd });
  }
  
  // Baixar Empenho
  DATA.empenhos = DATA.empenhos || [];
  const emp = DATA.empenhos.find(e => e.id === empenhoId);
  if (emp) {
    if (emp.items && emp.items[0]) {
      emp.items[0].delivered = (emp.items[0].delivered || 0) + qtd;
      if (emp.items[0].delivered >= (emp.items[0].qtd || 0)) emp.status = 'Liquidado';
      else emp.status = 'Parcial';
    }
    emp.executedValue = (emp.executedValue || 0) + (qtd * unitPrice);
    if (ataP) ataP.executedValue = (ataP.executedValue || 0) + (qtd * unitPrice);
  }
  
  // Add ao historico de NF
  DATA.nf_history = DATA.nf_history || [];
  DATA.nf_history.push({
    id: DATA.nf_history.length + 1,
    numero: nf,
    date: new Date().toISOString().split('T')[0],
    empenhoId: emp ? emp.id : empenhoId,
    items: [{ productId: prodId, qtd: qtd, value: qtd * unitPrice }]
  });

  if (window.SharedState && typeof window.SharedState.registrarLogAuditoria === 'function') {
    window.SharedState.registrarLogAuditoria({
      usuario: (typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].name : 'Estoque Central',
      acao: 'Entrada de Mercadoria / NF',
      produto: stockProd ? stockProd.name : (ataP ? ataP.name : 'Insumo'),
      quantidade: qtd,
      origem: `NF ${nf}`,
      destino: 'Estoque Central',
      motivo: 'Recebimento e Conferência Física'
    });
  }
  
  closeModal();
  showToast('✅ NF Recebida com sucesso! Estoque, Ata e Empenho atualizados.', 'success');
  const el = document.getElementById('page-content');
  if (el && PAGE_RENDERERS.estoque_entradas) PAGE_RENDERERS.estoque_entradas(el);
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
  SharedState.updateOrderStatus(orderId, 'Separado');
  showToast('✅ Pedido #' + String(o.numero).padStart(3,'0') + ' marcado como SEPARADO! Redirecionando para Carregamento (Bipagem)...');
  navigateTo(state.currentProfile, 'carregamento');
};

window.startSeparacao = (orderId) => {
  const o = DATA.separation_orders.find(x => x.id === orderId);
  if (o) o.status = 'Separado';
  showToast('Separação concluída via FIFO! Lotes vinculados.', 'success');
  navigateTo(state.currentProfile, 'carregamento');
};

window.openSharedBipagem = (orderId) => {
  const o = SharedState.getOrders().find(x => x.id === orderId);
  if (!o) return;
  const area = document.getElementById('bipagem-area');
  if (!area) return;
  area.innerHTML = `
    <h4 style="margin-top:0">Bipando Ordem #${String(o.numero).padStart(3,'0')} (${o.school})</h4>
    <div style="font-size:0.82rem; color:#0369a1; font-weight:600; margin-bottom:12px;">📜 Ref. Cardápio: <strong>${o.cardapioCodigo || 'CARD-2026/08-101'}</strong></div>
    <div style="display:flex;gap:12px;margin-bottom:20px;">
      <input type="text" id="bip-shared-input" class="form-control" placeholder="Clique aqui e simule o leitor (aperte Enter)..." style="flex:1" onkeydown="if(event.key==='Enter') window.confirmarSharedBipagem('${o.id}')">
      <button class="btn btn-primary" onclick="window.confirmarSharedBipagem('${o.id}')">Bipar</button>
    </div>
    <ul id="bip-list" style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
      ${(o.itens || []).map(i => `
        <li style="padding:10px 12px;border:1px solid #bbf7d0;border-radius:6px;display:flex;justify-content:space-between;align-items:center;background:#f0fdf4">
          <div><strong style="color:#14532d;">${i.produto}</strong><br><small style="color:#166534;">Regra: ${i.regra || 'Conforme demanda'}</small></div>
          <div style="font-family:var(--font-mono);font-weight:bold;color:#15803d">${i.qtd} ${i.unidade || 'kg'} (Bipado)</div>
        </li>
      `).join('')}
    </ul>
  `;
};

window.confirmarSharedBipagem = (orderId) => {
  const input = document.getElementById('bip-shared-input');
  if (input) input.value = '';
  showToast('🟢 Item de caixa verificado com sucesso pelo leitor de código de barras!');
};

window.sharedLiberarCaminhao = (orderId) => {
  const o = SharedState.getOrders().find(x => x.id === orderId);
  if (!o) return;
  SharedState.updateOrderStatus(orderId, 'Em transporte');
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

  // === Cross-perfil *_escolas (Fase 4.7): closure para cooperativa_escolas ===
  PAGE_RENDERERS.estoque_escolas = (el) => PAGE_RENDERERS.cooperativa_escolas(el);

})();
