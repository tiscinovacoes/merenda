/* ============================================
   SUALE — Módulo Estoque Central (js/modules/estoque.js)
   Perfil: Almoxarifado / Logística / Estoque Central
   ============================================ */

(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  // Telas reais do Estoque Central (movidas do app.js na Fase 4.3):
  //   estoque_dashboard, estoque_inventario, estoque_lotes, estoque_escolas
  //   + os helpers de recebimento/separacao/bipagem (usados so por esta familia).
  // As telas de OS (os-central/recebimentos/expedicao/ordens) sao aliases para as
  // telas de alta fidelidade do Gestor, registrados no fim do core_hub.js.

PAGE_RENDERERS.estoque_dashboard = (el) => {
  const sharedOrders = SharedState.getOrders();
  // KPIs coerentes com as sub-telas do fluxo (mesmos getters).
  const recebPendentes = SharedState.getRecebimentosPendentes ? SharedState.getRecebimentosPendentes().filter(r => r.status !== 'Recebido').length : 0;
  const osExped = SharedState.getOrdensServicoExpedicao ? SharedState.getOrdensServicoExpedicao() : [];
  const aSeparar = osExped.filter(o => o.status === 'Aguardando Separação' || o.status === 'Em Separação').length;
  const ordensEntrega = SharedState.getOrdensEntrega ? SharedState.getOrdensEntrega().length : 0;
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const lotes = DATA.lots || [];
  const lotesRisco = lotes.filter(l => { if (!l.expirationDate) return false; const d = Math.ceil((new Date(l.expirationDate) - hoje) / 86400000); return d <= 30; }).length;
  const lotesVencidos = lotes.filter(l => l.expirationDate && new Date(l.expirationDate) < hoje).length;

  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">Dashboard Operacional (CD)</div>
        <div class="page-subtitle">Central de Distribuição · Recebimento → Expedição → Entrega · Sincronizado com Gestor/Escolas</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary btn-sm" onclick="window.abrirModalImportarNFeXML()">📥 Receber NF-e via XML</button>
        <button class="btn btn-outline btn-sm" onclick="window.executarSimulacaoEngine7Passos()">⚡ Rodar Engine Abastecimento</button>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">🚚</div><div class="kpi-value">${recebPendentes}</div><div class="kpi-label">Recebimentos Pendentes</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📦</div><div class="kpi-value">${aSeparar}</div><div class="kpi-label">OS a Separar (Expedição)</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🚛</div><div class="kpi-value">${ordensEntrega}</div><div class="kpi-label">Ordens de Entrega Ativas</div></div>
      <div class="kpi-card ${lotesVencidos ? 'red' : 'green'}"><div class="kpi-icon">${lotesVencidos ? '🚨' : '⏳'}</div><div class="kpi-value">${lotesRisco}</div><div class="kpi-label">Lotes em Risco (≤ 30d)${lotesVencidos ? ` · ${lotesVencidos} vencido(s)` : ''}</div></div>
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
  const criticos = prods.filter(p => (p.daysLeft || 0) <= 5).length;
  const atencao = prods.filter(p => (p.daysLeft || 0) > 5 && (p.daysLeft || 0) <= 10).length;
  const zerados = prods.filter(p => (p.stock || 0) === 0).length;

  el.innerHTML = `
    <div class="page-header"><div class="page-title">Posição de Estoque Central</div><div class="page-subtitle">Acompanhamento em Tempo Real · Recebimentos via NF alimentam este estoque</div></div>

    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${prods.length}</div><div class="kpi-label">Itens no Inventário</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${criticos}</div><div class="kpi-label">Estoque Crítico (≤ 5 dias)</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${atencao}</div><div class="kpi-label">Atenção (6–10 dias)</div></div>
      <div class="kpi-card ${zerados ? 'red' : 'green'}"><div class="kpi-icon">${zerados ? '⛔' : '✅'}</div><div class="kpi-value">${zerados}</div><div class="kpi-label">Itens Zerados</div></div>
    </div>

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
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const loteStatus = (validade) => {
    if (!validade) return { txt: 'Sem validade', cls: 'status-warning', dias: null };
    const dias = Math.ceil((new Date(validade) - hoje) / 86400000);
    if (dias < 0) return { txt: `Vencido há ${Math.abs(dias)}d`, cls: 'status-danger', dias };
    if (dias <= 30) return { txt: `Vence em ${dias}d`, cls: 'status-warning', dias };
    return { txt: 'Vigente', cls: 'status-ok', dias };
  };
  // FEFO: ordena por validade (mais próximo do vencimento primeiro)
  const lots = (DATA.lots || []).slice().sort((a, b) => new Date(a.expirationDate || '2099-12-31') - new Date(b.expirationDate || '2099-12-31'));
  const vencidos = lots.filter(l => { const s = loteStatus(l.expirationDate); return s.dias !== null && s.dias < 0; });
  const vencendo = lots.filter(l => { const s = loteStatus(l.expirationDate); return s.dias !== null && s.dias >= 0 && s.dias <= 30; });

  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">📋 Controle de Lotes & Rastreabilidade</div>
        <div class="page-subtitle">Shelf-life por lote, ordenação FEFO (primeiro a vencer, primeiro a sair) e alerta de validade</div>
      </div>
      <button class="btn btn-outline" onclick="window.abrirModalLogsAuditoria()">📜 Trilha de Rastreabilidade</button>
    </div>
    <div class="kpi-grid">
      <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${lots.length}</div><div class="kpi-label">Lotes Ativos</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⏳</div><div class="kpi-value">${vencendo.length}</div><div class="kpi-label">Vencendo (≤ 30 dias)</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${vencidos.length}</div><div class="kpi-label">Vencidos (bloqueio FEFO)</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🏷️</div><div class="kpi-value">${new Set(lots.map(l => l.productId)).size}</div><div class="kpi-label">Produtos com Lote</div></div>
    </div>
    ${vencidos.length ? `<div class="card mb-24" style="border-left:4px solid var(--danger);margin-top:16px">
      <div class="card-body" style="padding:12px 16px;font-size:0.86rem">
        🚨 <strong>${vencidos.length} lote(s) vencido(s)</strong> — devem ser bloqueados para expedição e destinados a descarte/devolução: ${vencidos.map(l => `<span class="tag tag-red" style="font-size:0.72rem">${l.number}</span>`).join(' ')}
      </div>
    </div>` : ''}
    <div class="card" style="margin-top:16px">
      <div class="card-header"><strong>Lotes em Estoque (ordem FEFO)</strong><span class="tag tag-blue" style="font-size:0.75rem">Primeiro a vencer, primeiro a sair</span></div>
      <div style="overflow-x:auto">
        <table class="data-table"><thead><tr><th>Lote</th><th>Produto</th><th>Entrada</th><th>Validade</th><th>Qtd</th><th>Status</th></tr></thead><tbody>
          ${lots.map(l => {
            const p = DATA.products.find(x => x.id === l.productId);
            const st = loteStatus(l.expirationDate);
            return `<tr>
              <td style="font-family:var(--font-mono)"><strong>${l.number}</strong></td>
              <td>${p ? p.name : '—'}</td>
              <td>${formatDate(l.entryDate)}</td>
              <td style="font-family:var(--font-mono);font-weight:700${st.dias !== null && st.dias < 0 ? ';color:var(--danger)' : ''}">${formatDate(l.expirationDate)}</td>
              <td style="font-family:var(--font-mono)">${l.qtd.toLocaleString('pt-BR')} ${p ? p.unit : ''}</td>
              <td><span class="status-badge ${st.cls}">${st.txt}</span></td>
            </tr>`;
          }).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhum lote registrado.</td></tr>'}
        </tbody></table>
      </div>
    </div>
  `;
};

  // === Cross-perfil *_escolas (Fase 4.7): closure para cooperativa_escolas ===
  PAGE_RENDERERS.estoque_escolas = (el) => PAGE_RENDERERS.cooperativa_escolas(el);

})();
