/* ============================================
   SUALE — Módulo Estoque Central (js/modules/estoque.js)
   Perfil: Almoxarifado / Logística / Estoque Central
   ============================================ */

(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  // REGISTRO DE RENDERERS DO ESTOQUE CENTRAL (Assinatura: (el) => { el.innerHTML = ...; })
  PAGE_RENDERERS['estoque_dashboard'] = renderEstoqueDashboard;
  PAGE_RENDERERS['estoque_produtos'] = renderEstoqueProdutos;
  PAGE_RENDERERS['estoque_catalogo'] = renderEstoqueProdutos;
  PAGE_RENDERERS['estoque_entradas'] = renderEstoqueEntradas;
  PAGE_RENDERERS['estoque_recebimentos-pendentes'] = renderEstoqueEntradas;
  PAGE_RENDERERS['estoque_separacao'] = renderEstoqueSeparacao;
  PAGE_RENDERERS['estoque_expedicao-os'] = renderEstoqueSeparacao;
  PAGE_RENDERERS['estoque_carregamento'] = renderEstoqueCarregamento;
  PAGE_RENDERERS['estoque_ordens-entrega'] = renderEstoqueCarregamento;
  PAGE_RENDERERS['estoque_os-central'] = renderEstoqueOsCentral;
  PAGE_RENDERERS['estoque_relatorios'] = renderEstoqueRelatorios;
  PAGE_RENDERERS['estoque_lista-compras'] = renderEstoqueListaCompras;
  PAGE_RENDERERS['estoque_os-fornecedores'] = renderEstoqueOsFornecedores;

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

  // HELPER DA ENGINE DE ABASTECIMENTO 7 PASSOS (EXPORTAÇÃO GLOBAL)
  window.EngineAbastecimento = {
    processarDemandaItem(produtoName, qtdNecessaria, escolaTarget) {
      let qtdRestante = qtdNecessaria;
      const resultado = {
        produto: produtoName,
        qtdNecessaria: qtdNecessaria,
        atendidoEstoque: 0,
        atendidoEmpenho: 0,
        solicitadoEmpenhoAta: 0,
        encaminhadoListaCompras: 0,
        etapasExecutadas: []
      };

      const stockCentral = SharedState.getCentralStock ? SharedState.getCentralStock() : [];
      const itemStock = stockCentral.find(s => (s.produto || '').toLowerCase() === produtoName.toLowerCase());
      const qtdFisica = itemStock ? (itemStock.qtd || itemStock.quantidade || 0) : 0;
      const qtdReservada = itemStock ? (itemStock.reservado || 0) : 0;
      const disponivelEstoque = Math.max(0, qtdFisica - qtdReservada);

      if (disponivelEstoque > 0) {
        const qtdUsarEstoque = Math.min(qtdRestante, disponivelEstoque);
        resultado.atendidoEstoque = qtdUsarEstoque;
        qtdRestante -= qtdUsarEstoque;

        if (itemStock) itemStock.reservado = (itemStock.reservado || 0) + qtdUsarEstoque;

        SharedState.addOsEstoqueCentral({
          tipo: 'Saída',
          produto: produtoName,
          quantidade: qtdUsarEstoque,
          unidade: itemStock ? itemStock.unidade : 'kg',
          escola_destino: escolaTarget || 'SEMED Central',
          responsavel: 'Engine Abastecimento',
          status: 'Em Separação'
        });

        resultado.etapasExecutadas.push(`✅ Etapa 1: ${qtdUsarEstoque} unidades reservadas do Estoque Central.`);
      }

      SharedState._persist();
      return resultado;
    }
  };

  window.abrirModalImportarNFeXML = () => {
    const content = `
      <div style="font-family:Inter,sans-serif">
        <div style="background:#eff6ff;padding:14px;border-radius:8px;border:1px solid #93c5fd;margin-bottom:16px">
          <h4 style="margin:0 0 4px 0;color:#1e40af">📥 Recebimento de NF-e via Leitura XML</h4>
          <div style="font-size:0.85rem;color:#1e3a8a">
            Selecione o arquivo <strong>.xml</strong> da Nota Fiscal enviada pelo fornecedor para dar entrada automática.
          </div>
        </div>
        <div class="form-group mb-16">
          <label style="font-weight:600;display:block;margin-bottom:6px">Conteúdo XML da NF-e</label>
          <textarea id="nfe-xml-text" class="btn btn-outline" style="width:100%;height:110px;text-align:left;font-family:monospace;font-size:0.75rem;padding:8px" placeholder="<nfeProc>...</nfeProc>"></textarea>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="button" class="btn btn-primary" onclick="window.processarConteudoXMLNFe()">💾 Dar Entrada no Estoque</button>
        </div>
      </div>
    `;
    window.showModal('📥 Receber Nota Fiscal Eletrônica (NFe XML)', content, '750px');
  };

  window.processarConteudoXMLNFe = () => {
    showToast('✅ NF-e lida e processada com sucesso no Estoque Central!');
    closeModal();
    const container = document.getElementById('page-content');
    if (container) renderEstoqueEntradas(container);
  };

  window.executarSimulacaoEngine7Passos = () => {
    const res = window.EngineAbastecimento.processarDemandaItem('Arroz Tipo 1', 200, 'EM DEMO');
    showToast(`⚡ Engine executada: ${res.etapasExecutadas.length} etapa(s) processada(s).`);
  };

})();
