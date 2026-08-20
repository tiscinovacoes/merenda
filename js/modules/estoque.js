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

// ─── TELA DE FROTA / CADASTRO DE CAMINHÕES (A1b) ──────────────────────
PAGE_RENDERERS.estoque_frota = (el) => {
  const frota = SharedState.getFrota ? SharedState.getFrota() : [];
  const cargas = SharedState.getCargas ? SharedState.getCargas() : [];
  
  const ativos = frota.filter(c => c.status === 'ativo').length;
  const refrig = frota.filter(c => c.refrigerado).length;
  const capTotal = frota.reduce((s, c) => s + (c.capacidadeKg || 0), 0);

  const rows = frota.length ? frota.map(c => {
    const cargaAtiva = cargas.find(cg => cg.caminhaoId === c.id && cg.status !== 'concluida');
    const ocupacaotxt = cargaAtiva ? `${cargaAtiva.pesoTotalKg || 0} / ${c.capacidadeKg} kg` : 'Sem carga em trânsito';
    const pctOcupacao = cargaAtiva ? Math.round(((cargaAtiva.pesoTotalKg || 0) / c.capacidadeKg) * 100) : 0;
    
    return `
      <tr>
        <td><strong style="font-family:var(--font-mono);font-size:1.05rem">${c.placa}</strong></td>
        <td><strong>${c.modelo}</strong></td>
        <td style="font-family:var(--font-mono)">${(c.capacidadeKg || 0).toLocaleString('pt-BR')} kg</td>
        <td>
          <span class="status-badge ${c.refrigerado ? 'status-ok' : 'status-info'}">
            ${c.refrigerado ? '❄️ Refrigerado' : '📦 Carga Seca'}
          </span>
        </td>
        <td>${c.motoristaPadrao || 'Não definido'}</td>
        <td>
          <div style="font-size:0.85rem;font-weight:600">${ocupacaotxt}</div>
          ${cargaAtiva ? `
            <div style="width:100px;background:#e2e8f0;border-radius:4px;height:6px;margin-top:4px;overflow:hidden">
              <div style="width:${Math.min(100, pctOcupacao)}%;background:${pctOcupacao > 90 ? '#b91c1c' : '#15803d'};height:100%"></div>
            </div>
          ` : ''}
        </td>
        <td>
          <span class="status-badge ${c.status === 'ativo' ? 'status-ok' : 'status-danger'}">
            ${c.status === 'ativo' ? '✅ Ativo' : '🔧 Manutenção'}
          </span>
        </td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-sm btn-outline" onclick="window.abrirModalEditarCaminhao('${c.id}')">✏️ Editar</button>
            <button class="btn btn-sm btn-outline" onclick="window.alternarStatusCaminhao('${c.id}')">
              ${c.status === 'ativo' ? '🔧 Manutenção' : '✅ Ativar'}
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('') : '<tr><td colspan="8" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhum veículo cadastrado na frota.</td></tr>';

  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">🚚 Cadastro e Gestão de Frota (Caminhões)</div>
        <div class="page-subtitle">Gestão de veículos da Central de Distribuição, capacidade de carga (kg) e status operacional</div>
      </div>
      <button class="btn btn-primary" onclick="window.abrirModalNovoCaminhao()">➕ Novo Veículo</button>
    </div>

    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">🚚</div><div class="kpi-value">${frota.length}</div><div class="kpi-label">Total de Veículos</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${ativos}</div><div class="kpi-label">Veículos Ativos</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">❄️</div><div class="kpi-value">${refrig}</div><div class="kpi-label">Refrigerados</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚖️</div><div class="kpi-value">${capTotal.toLocaleString('pt-BR')} kg</div><div class="kpi-label">Capacidade Total Frota</div></div>
    </div>

    <div class="card">
      <div class="card-header"><strong>Veículos Cadastrados</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Placa</th>
              <th>Modelo</th>
              <th>Capacidade (kg)</th>
              <th>Tipo</th>
              <th>Motorista Padrão</th>
              <th>Ocupação em Viagem</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </div>
  `;
};

window.abrirModalNovoCaminhao = () => {
  const content = `
    <div class="form-group"><label>Placa do Veículo</label><input type="text" id="cam-placa" class="form-control" placeholder="Ex: ABC-1234"></div>
    <div class="form-group"><label>Modelo / Marca</label><input type="text" id="cam-modelo" class="form-control" placeholder="Ex: Mercedes-Benz Accelo 1016"></div>
    <div class="form-group"><label>Capacidade de Carga (kg)</label><input type="number" id="cam-cap" class="form-control" value="5400"></div>
    <div class="form-group"><label>Motorista Padrão</label><input type="text" id="cam-motorista" class="form-control" placeholder="Ex: Carlos Oliveira"></div>
    <div class="form-group" style="margin-top:12px">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600">
        <input type="checkbox" id="cam-refrig" style="width:18px;height:18px" checked>
        Possui Baú Refrigerado (Câmara Fria)
      </label>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;">
      <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="window.salvarNovoCaminhao()">Salvar Veículo</button>
    </div>
  `;
  showModal('➕ Novo Veículo na Frota', content);
};

window.salvarNovoCaminhao = () => {
  const placa = document.getElementById('cam-placa')?.value.trim();
  const modelo = document.getElementById('cam-modelo')?.value.trim();
  const cap = parseFloat(document.getElementById('cam-cap')?.value || 5400);
  const motorista = document.getElementById('cam-motorista')?.value.trim();
  const refrig = document.getElementById('cam-refrig')?.checked;

  if (!placa || !modelo) { alert('Preencha a placa e o modelo do veículo!'); return; }

  SharedState.addCaminhao({ placa, modelo, capacidadeKg: cap, motoristaPadrao: motorista, refrigerado: refrig, status: 'ativo' });
  closeModal();
  showToast('✅ Veículo adicionado à frota com sucesso!');
  const el = document.getElementById('page-content');
  if (el && PAGE_RENDERERS.estoque_frota) PAGE_RENDERERS.estoque_frota(el);
};

window.abrirModalEditarCaminhao = (id) => {
  const c = SharedState.getFrota().find(x => x.id === id);
  if (!c) return;

  const content = `
    <div class="form-group"><label>Placa do Veículo</label><input type="text" id="cam-placa" class="form-control" value="${c.placa}"></div>
    <div class="form-group"><label>Modelo / Marca</label><input type="text" id="cam-modelo" class="form-control" value="${c.modelo}"></div>
    <div class="form-group"><label>Capacidade de Carga (kg)</label><input type="number" id="cam-cap" class="form-control" value="${c.capacidadeKg}"></div>
    <div class="form-group"><label>Motorista Padrão</label><input type="text" id="cam-motorista" class="form-control" value="${c.motoristaPadrao || ''}"></div>
    <div class="form-group" style="margin-top:12px">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600">
        <input type="checkbox" id="cam-refrig" style="width:18px;height:18px" ${c.refrigerado ? 'checked' : ''}>
        Possui Baú Refrigerado (Câmara Fria)
      </label>
    </div>
    <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:20px;">
      <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="window.salvarEdicaoCaminhao('${c.id}')">Salvar Alterações</button>
    </div>
  `;
  showModal('✏️ Editar Veículo — ' + c.placa, content);
};

window.salvarEdicaoCaminhao = (id) => {
  const placa = document.getElementById('cam-placa')?.value.trim();
  const modelo = document.getElementById('cam-modelo')?.value.trim();
  const cap = parseFloat(document.getElementById('cam-cap')?.value || 5400);
  const motorista = document.getElementById('cam-motorista')?.value.trim();
  const refrig = document.getElementById('cam-refrig')?.checked;

  if (!placa || !modelo) { alert('Preencha a placa e o modelo do veículo!'); return; }

  SharedState.updateCaminhao(id, { placa, modelo, capacidadeKg: cap, motoristaPadrao: motorista, refrigerado: refrig });
  closeModal();
  showToast('✅ Dados do veículo atualizados!');
  const el = document.getElementById('page-content');
  if (el && PAGE_RENDERERS.estoque_frota) PAGE_RENDERERS.estoque_frota(el);
};

window.alternarStatusCaminhao = (id) => {
  const c = SharedState.getFrota().find(x => x.id === id);
  if (!c) return;
  const novo = c.status === 'ativo' ? 'manutencao' : 'ativo';
  SharedState.updateCaminhao(id, { status: novo });
  showToast(`🚚 Veículo ${c.placa} agora está: ${novo === 'ativo' ? 'Ativo' : 'Em Manutenção'}`);
  const el = document.getElementById('page-content');
  if (el && PAGE_RENDERERS.estoque_frota) PAGE_RENDERERS.estoque_frota(el);
};

// ─── TELA DE MONTAGEM DE CARGA (A2 / A2b) ─────────────────────────────────
PAGE_RENDERERS['estoque_montagem-carga'] = (el) => {
  const cargas = SharedState.getCargas ? SharedState.getCargas() : [];
  const frota  = SharedState.getFrota  ? SharedState.getFrota()  : [];
  const oes    = SharedState.getOrdensEntrega ? SharedState.getOrdensEntrega() : [];

  const emMontagem = cargas.filter(c => c.status === 'em_montagem').length;
  const emRota     = cargas.filter(c => c.status === 'em_transporte').length;
  const pesoTotal  = cargas.reduce((s, c) => s + (c.pesoTotalKg || 0), 0);

  // O.E. pendentes (Aguardando carga, sem cargaId)
  const oesPendentes = oes.filter(o => o.status === 'Aguardando carga' && !o.cargaId);
  // O.E. já alocadas em alguma carga (por carga)
  const oesAlocadas  = oes.filter(o => o.cargaId);

  const rowsCarga = cargas.length ? cargas.map(c => {
    const cam = frota.find(f => f.id === c.caminhaoId) || { placa: 'N/A', modelo: '—', capacidadeKg: 5400, motoristaPadrao: 'CD' };
    const pct = Math.round(((c.pesoTotalKg || 0) / cam.capacidadeKg) * 100);
    const emMont = c.status === 'em_montagem';
    const emRot  = c.status === 'em_transporte';
    return `
      <tr>
        <td><strong style="font-family:var(--font-mono)">${c.id}</strong></td>
        <td><strong>${cam.placa}</strong> <small>(${cam.modelo})</small></td>
        <td>${c.motorista || cam.motoristaPadrao}</td>
        <td style="font-family:var(--font-mono)">
          <strong>${(c.pesoTotalKg || 0).toLocaleString('pt-BR')} kg</strong> / ${cam.capacidadeKg.toLocaleString('pt-BR')} kg (${pct}%)
        </td>
        <td><span class="tag tag-blue">${(c.oes || []).length} OE(s)</span></td>
        <td>
          <span class="status-badge ${emMont ? 'status-warning' : (emRot ? 'status-info' : 'status-ok')}">
            ${emMont ? '⚙️ Em Montagem' : (emRot ? '🚚 Em Rota' : '✅ Concluída')}
          </span>
        </td>
        <td>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            ${emMont ? `
              <button class="btn btn-sm btn-primary" onclick="window.abrirModalMontagemCarga('${c.id}')">➕ Add OE</button>
              <button class="btn btn-sm" style="background:#15803d;color:#fff;border:none;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:0.8rem" onclick="window.liberarCarga('${c.id}')">🚀 Liberar para Entrega</button>
            ` : emRot ? `
              <button class="btn btn-sm btn-outline" onclick="window.abrirModalMontagemCarga('${c.id}')">&#128065;️ Ver OEs</button>
            ` : '<span class="tag tag-green">✅ Concluída</span>'}
          </div>
        </td>
      </tr>
    `;
  }).join('') : '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma carga montada. Clique em "Nova Montagem de Carga" para iniciar.</td></tr>';

  // Tabela: O.E. já alocadas por carga
  const rowsAlocadas = oesAlocadas.length ? oesAlocadas.map(o => {
    const cg  = cargas.find(c => c.id === o.cargaId);
    const cam = cg ? (frota.find(f => f.id === cg.caminhaoId) || { placa: '—' }) : { placa: '—' };
    return `
      <tr>
        <td><strong>${o.numeroOe || o.id}</strong></td>
        <td>${o.escolaNome || '—'}</td>
        <td><span class="tag tag-blue">${cam.placa}</span></td>
        <td><span class="status-badge ${o.status === 'Em Transporte' ? 'status-info' : 'status-warning'}">${o.status}</span></td>
        <td>${o.motorista || '—'}</td>
      </tr>
    `;
  }).join('') : '<tr><td colspan="5" style="text-align:center;padding:12px;color:var(--text-secondary)">Nenhuma O.E. alocada em carga.</td></tr>';

  // Tabela: O.E. pendentes
  const rowsPendentes = oesPendentes.length ? oesPendentes.map(o => `
    <tr>
      <td><strong>${o.numeroOe || o.id}</strong></td>
      <td>${o.escolaNome || '—'}</td>
      <td><span class="status-badge status-warning">⏳ Aguardando carga</span></td>
      <td><button class="btn btn-sm btn-primary" onclick="window.abrirModalMontagemCarga('${o.id}')">➕ Alocar</button></td>
    </tr>
  `).join('') : '<tr><td colspan="4" style="text-align:center;padding:12px;color:var(--text-secondary)">Nenhuma O.E. aguardando carga.</td></tr>';

  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">🚛 Montagem de Cargas &amp; Viagens (RN08 / Trava A1)</div>
        <div class="page-subtitle">Agrupamento de Ordens de Entrega por caminhão com trava de peso e motor de sugestão</div>
      </div>
      <button class="btn btn-primary" onclick="window.abrirModalMontagemCarga()">🚚 Nova Montagem de Carga</button>
    </div>

    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi-card orange"><div class="kpi-icon">⚙️</div><div class="kpi-value">${emMontagem}</div><div class="kpi-label">Cargas em Montagem</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🚚</div><div class="kpi-value">${emRota}</div><div class="kpi-label">Cargas em Rota</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">⚖️</div><div class="kpi-value">${pesoTotal.toLocaleString('pt-BR')} kg</div><div class="kpi-label">Peso Total Alocado</div></div>
      <div class="kpi-card green"><div class="kpi-icon">⏳</div><div class="kpi-value">${oesPendentes.length}</div><div class="kpi-label">O.E. Aguardando Carga</div></div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><strong>Cargas Registradas</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr>
            <th>ID Carga</th><th>Caminhão</th><th>Motorista</th><th>Peso / Ocupação</th><th>OE(s)</th><th>Status</th><th>Ação</th>
          </tr></thead>
          <tbody>${rowsCarga}</tbody>
        </table>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div class="card">
        <div class="card-header" style="background:#fef9c3"><strong>⏳ O.E. Pendentes (Aguardando Carga)</strong></div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr><th>O.E.</th><th>Escola</th><th>Status</th><th>Ação</th></tr></thead>
            <tbody>${rowsPendentes}</tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header" style="background:#e0f2fe"><strong>🚚 O.E. Já em Caminhão</strong></div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr><th>O.E.</th><th>Escola</th><th>Caminhão</th><th>Status</th><th>Motorista</th></tr></thead>
            <tbody>${rowsAlocadas}</tbody>
          </table>
        </div>
      </div>
    </div>
  `;
};

// ─── TELA DE RASTREABILIDADE DE FROTA (B9) ────────────────────────────────
PAGE_RENDERERS['estoque_rastreabilidade'] = (el) => {
  const frota  = SharedState.getFrota  ? SharedState.getFrota()  : [];
  const cargas = SharedState.getCargas ? SharedState.getCargas() : [];
  const oes    = SharedState.getOrdensEntrega ? SharedState.getOrdensEntrega() : [];

  // AJUSTE 03 (B9): apenas cargas LIBERADAS (em_transporte). Em Montagem fica na tela Montagem de Carga.
  const cargasEmRota     = cargas.filter(c => c.status === 'em_transporte');
  const cargasConcluidas = cargas.filter(c => c.status === 'concluida');

  // Caminhões com carga liberada/em rota
  const caminhaoIds    = new Set(cargasEmRota.map(c => c.caminhaoId));
  const caminhoeEmRota = frota.filter(cam => caminhaoIds.has(cam.id));

  const rows = caminhoeEmRota.length ? caminhoeEmRota.map(cam => {
    const cg     = cargasEmRota.find(c => c.caminhaoId === cam.id);
    const numOes = cg ? (cg.oes || []).length : 0;
    const peso   = cg ? cg.pesoTotalKg : 0;
    const pct    = Math.round((peso / cam.capacidadeKg) * 100);

    // Parada atual: primeira OE da carga que ainda não foi entregue
    let paradaAtual = '—';
    if (cg && cg.oes && cg.oes.length) {
      const oesRota = cg.oes.map((id, i) => {
        const o = oes.find(x => x.id === id);
        return { idx: i + 1, total: cg.oes.length, nome: o ? (o.escolaNome || id) : id, status: o ? o.status : '' };
      });
      const atual = oesRota.find(o => o.status !== 'Entregue' && o.status !== 'Recebido') || oesRota[oesRota.length - 1];
      paradaAtual = atual ? `Parada ${atual.idx}/${atual.total} \u2014 ${atual.nome}` : '✅ Todas entregues';
    }

    return `
      <tr>
        <td><strong>${cam.placa}</strong> <small>(${cam.modelo})</small></td>
        <td>👤 ${cam.motoristaPadrao || 'Motorista CD'}</td>
        <td><span class="status-badge status-info">🚚 Em Rota</span></td>
        <td><strong style="font-family:var(--font-mono)">${cg ? cg.id : '—'}</strong></td>
        <td><span class="tag tag-blue">${numOes} escola(s)</span></td>
        <td style="font-family:var(--font-mono)">${peso.toLocaleString('pt-BR')} / ${cam.capacidadeKg.toLocaleString('pt-BR')} kg (${pct}%)</td>
        <td><span class="tag tag-teal">📌 ${paradaAtual}</span></td>
        <td><button class="btn btn-sm btn-primary" style="background:#1e40af" onclick="window.abrirModalRastreamentoVeiculo('${cg ? cg.id : ''}')">📡 Rastrear</button></td>
      </tr>
    `;
  }).join('') : '<tr><td colspan="8" style="text-align:center;padding:24px;color:var(--text-secondary)">🟡 Nenhum caminhão em rota no momento. Caminhões em montagem aparecem na tela Montagem de Carga.</td></tr>';

  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">📡 Rastreabilidade Logística &amp; Frota (B9)</div>
        <div class="page-subtitle">Caminhões com carga <strong>liberada / em rota</strong> — parada atual (sem GPS; posição = parada corrente)</div>
      </div>
      <button class="btn btn-outline" onclick="window.abrirModalMontagemCarga()">⚙️ Montagem de Carga</button>
    </div>

    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi-card teal"><div class="kpi-icon">🚚</div><div class="kpi-value">${caminhoeEmRota.length}</div><div class="kpi-label">Caminhões em Rota</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">🛣️</div><div class="kpi-value">${cargasEmRota.length}</div><div class="kpi-label">Cargas em Transporte</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${cargasConcluidas.length}</div><div class="kpi-label">Viagens Concluídas</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚙️</div><div class="kpi-value">${cargas.filter(c=>c.status==='em_montagem').length}</div><div class="kpi-label">Em Montagem (ver aba)</div></div>
    </div>

    <div class="card">
      <div class="card-header"><strong>📡 Painel de Rastreamento — Caminhões em Rota</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr>
            <th>Placa / Modelo</th>
            <th>Motorista</th>
            <th>Status</th>
            <th>Carga</th>
            <th>Escolas</th>
            <th>Peso / Ocupação</th>
            <th>Parada Atual</th>
            <th>Ação</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
};


// ─── TELA DE COBERTURA DE ESTOQUE ESCOLAR (C10) ────────────────────────
PAGE_RENDERERS['estoque_cobertura'] = (el) => {
  const cobertura = SharedState.getCoberturaEscolas ? SharedState.getCoberturaEscolas() : [];
  
  const criticas = cobertura.filter(c => c.status === 'critica').length;
  const adequadas = cobertura.filter(c => c.status === 'adequada').length;
  const abundantes = cobertura.filter(c => c.status === 'abundante').length;

  const rows = cobertura.length ? cobertura.map(c => `
    <tr>
      <td><strong>${c.escola}</strong></td>
      <td style="font-family:var(--font-mono)">${c.alunos} alunos</td>
      <td><strong>${c.cardapioAtivo}</strong></td>
      <td style="font-family:var(--font-mono)">
        <span style="font-weight:700;color:${c.status === 'critica' ? '#b91c1c' : (c.status === 'adequada' ? '#15803d' : '#0369a1')}">
          ${c.diasCobertura} dias
        </span>
      </td>
      <td>
        <span class="status-badge ${c.status === 'critica' ? 'status-danger' : (c.status === 'adequada' ? 'status-ok' : 'status-info')}">
          ${c.status === 'critica' ? '🔴 Crítica (< 5 dias)' : (c.status === 'adequada' ? '🟢 Adequada (5-15 dias)' : '🔵 Abundante (> 15 dias)')}
        </span>
      </td>
      <td>
        <button class="btn btn-sm btn-primary" onclick="window.abrirModalNovaOrdemEntrega('${c.escolaId}')">
          📦 Gerar O.S. Reposição
        </button>
      </td>
    </tr>
  `).join('') : '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-secondary)">Carregando cobertura escolar...</td></tr>';

  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">📊 Cobertura de Estoque Escolar (C10)</div>
        <div class="page-subtitle">Cálculo contínuo de autonomia em dias de merenda por escola e por cardápio ativo</div>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi-card red"><div class="kpi-icon">⚠️</div><div class="kpi-value">${criticas}</div><div class="kpi-label">Escolas em Nível Crítico (< 5d)</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${adequadas}</div><div class="kpi-label">Estoque Adequado (5-15d)</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${abundantes}</div><div class="kpi-label">Estoque Confortável (> 15d)</div></div>
    </div>

    <div class="card">
      <div class="card-header"><strong>Autonomia de Estoque por Escola (C10)</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Escola / EMEF</th>
              <th>Alunos Matriculados</th>
              <th>Cardápio Ativo</th>
              <th>Autonomia Estimada</th>
              <th>Status Cobertura</th>
              <th>Ação Preventiva</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
};

// ─── TELA DE RELATÓRIOS LOGÍSTICOS (E13) ──────────────────────────────
PAGE_RENDERERS['estoque_relatorios'] = (el) => {
  const oes = SharedState.getOrdensEntrega ? SharedState.getOrdensEntrega() : [];
  const cargas = SharedState.getCargas ? SharedState.getCargas() : [];
  const osExp = SharedState.getOrdensServicoExpedicao ? SharedState.getOrdensServicoExpedicao() : [];

  const entregues = oes.filter(o => o.status === 'Entregue').length;
  const taxaSucesso = oes.length ? Math.round((entregues / oes.length) * 100) : 100;
  const pesoTotal = cargas.reduce((s, c) => s + (c.pesoTotalKg || 0), 0);

  const rows = osExp.length ? osExp.map(o => `
    <tr>
      <td><strong style="font-family:var(--font-mono)">${o.numeroOs}</strong></td>
      <td>${o.escolaNome}</td>
      <td>${o.produtos ? o.produtos.map(p => `${p.produto} (${p.quantidade} ${p.unidade})`).join(', ') : '—'}</td>
      <td>${o.dataPrevista || '—'}</td>
      <td><span class="tag ${o.prioridade === 'Alta' ? 'tag-red' : 'tag-gray'}">${o.prioridade}</span></td>
      <td><span class="status-badge ${o.status === 'Entregue' ? 'status-ok' : 'status-warning'}">${o.status}</span></td>
    </tr>
  `).join('') : '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-secondary)">Sem dados de expedição para relatórios.</td></tr>';

  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">📈 Relatórios Operacionais de Expedição & Logística (E13)</div>
        <div class="page-subtitle">Consolidado de movimentações do Estoque Central, saídas, romaneios e indicadores de nível de serviço</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-outline" onclick="window.print()">🖨️ Imprimir Relatório</button>
      </div>
    </div>

    <div class="kpi-grid" style="margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${osExp.length}</div><div class="kpi-label">Total de OS Expedidas</div></div>
      <div class="kpi-card green"><div class="kpi-icon">🎯</div><div class="kpi-value">${taxaSucesso}%</div><div class="kpi-label">Taxa de Sucesso (OTIF)</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">⚖️</div><div class="kpi-value">${pesoTotal.toLocaleString('pt-BR')} kg</div><div class="kpi-label">Volume Total Movimentado</div></div>
    </div>

    <div class="card">
      <div class="card-header"><strong>Histórico Consolidado de Expedição</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Número OS</th>
              <th>Escola Destino</th>
              <th>Itens Expedidos</th>
              <th>Data Prevista</th>
              <th>Prioridade</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
};

// ─── TELA DE OCORRÊNCIAS LOGÍSTICAS (F14/F15) ─────────────────────────
PAGE_RENDERERS['estoque_ocorrencias'] = (el) => {
  const ocorrencias = SharedState.getOcorrencias ? SharedState.getOcorrencias() : [];

  const rows = ocorrencias.length ? ocorrencias.map(oc => `
    <tr>
      <td><strong style="font-family:var(--font-mono)">${oc.id}</strong></td>
      <td><strong>${oc.tipo}</strong></td>
      <td>${oc.escola || 'Estoque Central'}</td>
      <td>🚛 ${oc.placaVeiculo || '—'}<br><small class="text-secondary">👤 ${oc.autor || 'Operador'}</small></td>
      <td style="font-size:0.82rem">${oc.descricao}</td>
      <td style="font-size:0.8rem">${new Date(oc.criadoEm).toLocaleString('pt-BR')}</td>
      <td><span class="status-badge ${oc.status === 'Resolvido' ? 'status-ok' : 'status-danger'}">${oc.status}</span></td>
    </tr>
  `).join('') : '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma ocorrência registrada. Clique em "Nova Ocorrência" para registrar.</td></tr>';

  el.innerHTML = `
    <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div>
        <div class="page-title">⚠️ Livro de Ocorrências Logísticas (F14 / F15)</div>
        <div class="page-subtitle">Registro centralizado de incidentes, avarias na entrega, recusas e desvios de transporte</div>
      </div>
      <button class="btn btn-danger" onclick="window.abrirModalRegistrarOcorrenciaLogistica()">⚠️ Nova Ocorrência</button>
    </div>

    <div class="card">
      <div class="card-header"><strong>Ocorrências Operacionais Registradas</strong></div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo de Ocorrência</th>
              <th>Unidade / Escola</th>
              <th>Veículo / Autor</th>
              <th>Descrição do Incidente</th>
              <th>Data/Hora</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
};

window.abrirModalRegistrarOcorrenciaLogistica = () => {
  const frota = SharedState.getFrota ? SharedState.getFrota().filter(c => c.status === 'ativo') : [];
  const escolas = window.DATA && window.DATA.schools ? window.DATA.schools : [];

  const content = `
    <div style="font-family:Inter,sans-serif">
      <form onsubmit="window.salvarOcorrenciaLogistica(event)">
        <div style="margin-bottom:12px">
          <label class="form-label">Tipo de Ocorrência (F14):</label>
          <select id="oc-tipo" class="form-control" required>
            <option value="Avaria na Embalagem/Produto">Avaria na Embalagem ou Produto</option>
            <option value="Recusa de Recebimento pela Escola">Recusa de Recebimento pela Escola</option>
            <option value="Falta / Divergência de Quantidade">Falta / Divergência de Quantidade</option>
            <option value="Atraso Excessivo na Rota">Atraso Excessivo na Rota</option>
            <option value="Problema Mecânico no Veículo">Problema Mecânico no Veículo</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
          <div>
            <label class="form-label">Veículo Relacionado:</label>
            <select id="oc-veiculo" class="form-control">
              <option value="">Nenhum / Não aplicável</option>
              ${frota.map(c => `<option value="${c.placa}">${c.placa} (${c.modelo})</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="form-label">Escola Relacionada:</label>
            <select id="oc-escola" class="form-control">
              <option value="Estoque Central CD">Estoque Central CD (Interno)</option>
              ${escolas.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="margin-bottom:12px">
          <label class="form-label">Descrição Detalhada do Incidente:</label>
          <textarea id="oc-desc" class="form-control" rows="3" placeholder="Detalhamento da ocorrência..." required></textarea>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:16px">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-danger">⚠️ Gravar Ocorrência</button>
        </div>
      </form>
    </div>
  `;

  showModal('⚠️ Novo Registro de Ocorrência Logística (F14)', content, '600px');
};

window.salvarOcorrenciaLogistica = (e) => {
  e.preventDefault();
  const tipo = document.getElementById('oc-tipo')?.value;
  const veiculo = document.getElementById('oc-veiculo')?.value;
  const escola = document.getElementById('oc-escola')?.value;
  const desc = document.getElementById('oc-desc')?.value;

  SharedState.registrarOcorrencia({
    tipo,
    placaVeiculo: veiculo,
    escola,
    descricao: desc,
    autor: (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].name : 'Operador CD'
  });

  closeModal();
  showToast('⚠️ Ocorrência registrada e disponibilizada no Livro de Ocorrências do Gestor.');
  renderPage();
};

// ─── TELA DE ROTEIRIZAÇÃO (A3 · ORS-ready) ────────────────────────────────
PAGE_RENDERERS['estoque_roteirizacao'] = (el) => {
  const cargas = (SharedState.getCargas ? SharedState.getCargas() : []).filter(c => (c.oes || []).length);
  const frota  = SharedState.getFrota ? SharedState.getFrota() : [];
  const oes    = SharedState.getOrdensEntrega ? SharedState.getOrdensEntrega() : [];
  const mode   = (window.RoutingProvider && window.RoutingProvider.mode) || 'heuristic';

  const cargaCards = cargas.length ? cargas.map(c => {
    const cam = frota.find(f => f.id === c.caminhaoId) || { placa: '—' };
    const seqIds = (c.rotaOrdenada && c.rotaOrdenada.length ? c.rotaOrdenada : c.oes);
    const rows = seqIds.map((id, idx) => {
      const o = oes.find(x => x.id === id);
      if (!o) return '';
      const sc = (window.DATA && DATA.schools) ? DATA.schools.find(s => ('esc-' + s.id) === o.escolaId || s.name === o.escolaNome) : null;
      const peso = SharedState.pesoDaOe ? SharedState.pesoDaOe(o) : 0;
      return `<tr>
        <td><strong>${idx + 1}º</strong></td>
        <td>${o.escolaNome}</td>
        <td>${sc ? (sc.region || '—') : '<span class="text-secondary">—</span>'}</td>
        <td style="font-family:var(--font-mono)">${peso.toLocaleString('pt-BR')} kg</td>
        <td>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm btn-outline" ${idx === 0 ? 'disabled' : ''} onclick="window._moverParadaRota('${c.id}','${id}','up')">↑</button>
            <button class="btn btn-sm btn-outline" ${idx === seqIds.length - 1 ? 'disabled' : ''} onclick="window._moverParadaRota('${c.id}','${id}','down')">↓</button>
          </div>
        </td>
      </tr>`;
    }).join('');
    return `
      <div class="card" style="margin-bottom:16px">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <strong>🚛 Carga ${c.id} · ${cam.placa} · ${(c.oes || []).length} parada(s) · ${c.status === 'em_transporte' ? 'Em Rota' : (c.status === 'concluida' ? 'Concluída' : 'Em Montagem')}</strong>
          <button class="btn btn-sm btn-primary" onclick="window.otimizarRotaCarga('${c.id}')">🧭 Otimizar Rota</button>
        </div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr><th>Ordem</th><th>Escola / Parada</th><th>Região</th><th>Peso</th><th>Reordenar</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  }).join('') : '<div class="card"><div class="card-body" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma carga com paradas. Monte uma carga na tela <strong>Montagem de Carga</strong> para roteirizar.</div></div>';

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">🗺️ Roteirização de Entregas (A3)</div>
      <div class="page-subtitle">Ordem das paradas por região, prioridade e janela de horário — modo <strong>${mode === 'ors' ? 'OpenRouteService' : 'heurística local'}</strong> (ORS-ready)</div>
    </div>
    <div style="background:#eff6ff;padding:8px 12px;border-radius:6px;font-size:0.78rem;color:#1e40af;margin-bottom:14px">
      🛰️ Adaptador <strong>RoutingProvider</strong> pronto para OpenRouteService (endpoints <code>/geocode/search</code> e <code>/optimization</code> — VROOM, com capacidade e janelas). Enquanto <code>SUALE_CONFIG.ORS_KEY</code> estiver vazia, roda em heurística local — ligar a chave não muda as telas.
    </div>
    ${cargaCards}`;
};

})();
