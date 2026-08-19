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
  function renderColaboradoresDashboard(el) {
    const isCoop = state.currentProfile === 'cooperativa';
    const profileName = isCoop ? 'COOPAGRAN (Cooperativa Indubrasil)' : 'Agricultor Familiar Local';
    const orders = SharedState.getOrders ? SharedState.getOrders() : [];
    const pendentes = orders.filter(o => o.status === 'Pendente' || o.status === 'Em separação');

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Painel do Fornecedor — ${profileName}</div>
        <div class="page-subtitle">Gestão de entregas PNAE, ordens de colheita e faturamento</div>
      </div>

      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${orders.length}</div><div class="kpi-label">Pedidos Recebidos</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">⏳</div><div class="kpi-value">${pendentes.length}</div><div class="kpi-label">Aguardando Envio</div></div>
        <div class="kpi-card green"><div class="kpi-icon">🌾</div><div class="kpi-value">100%</div><div class="kpi-label">Certificação AF</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">💰</div><div class="kpi-value">R$ 145.000</div><div class="kpi-label">Faturamento Vigente</div></div>
      </div>

      <div class="card mb-24">
        <div class="card-header"><div class="card-title">📦 Pedidos e Demandas Recebidas da SEMED</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th># Pedido</th><th>Escola Destino</th><th>Valor Total</th><th>Data</th><th>Status</th></tr></thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td><strong>#${String(o.numero).padStart(3, '0')}</strong></td>
                  <td>${o.school || o.escola}</td>
                  <td style="font-family:var(--font-mono);font-weight:700">R$ ${(o.value || 0).toLocaleString('pt-BR')}</td>
                  <td>${o.date || '—'}</td>
                  <td><span class="status-badge ${o.status === 'Entregue' ? 'status-ok' : 'status-warning'}">${o.status}</span></td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="text-align:center;padding:24px">Nenhum pedido recebido</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 2. PEDIDOS COLABORADORES
  function renderColaboradoresPedidos(el) {
    const orders = SharedState.getOrders ? SharedState.getOrders() : [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Ordens de Fornecimento & Pedidos</div>
        <div class="page-subtitle">Acompanhamento e alteração de status de expedição</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Gestão de Pedidos</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th># Pedido</th><th>Escola Destino</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              ${orders.map(o => `
                <tr>
                  <td><strong>#${String(o.numero).padStart(3, '0')}</strong></td>
                  <td>${o.school || o.escola}</td>
                  <td style="font-family:var(--font-mono)">R$ ${(o.value || 0).toLocaleString('pt-BR')}</td>
                  <td><span class="status-badge ${o.status === 'Entregue' ? 'status-ok' : 'status-warning'}">${o.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 3. ESCOLAS COLABORADORES
  function renderColaboradoresEscolas(el) {
    const schools = DATA.schools || [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Escolas Atendidas</div>
        <div class="page-subtitle">Pontos de entrega cadastrados na pauta PNAE</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Lista de Unidades Escolares</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Escola</th><th>Região</th><th>Alunos</th></tr></thead>
            <tbody>
              ${schools.map(s => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td><span class="tag tag-blue">${s.region}</span></td>
                  <td style="font-family:var(--font-mono)">${s.students}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 4. PRODUÇÃO / SAFRA
  function renderColaboradoresProducao(el) {
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Capacidade de Produção & Colheita AF</div>
        <div class="page-subtitle">Calendário agrícola e disponibilidade de safras sazonais</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Produtos Cultivados</div></div>
        <div class="card-body">
          <p>Itens registrados para Chamada Pública PNAE:</p>
          <ul>
            <li>Banana Nanica (Disponível ano todo)</li>
            <li>Tomate Fresco (Safra Ativa)</li>
            <li>Alface Crespa (Safra Ativa)</li>
          </ul>
        </div>
      </div>
    `;
  }

  // 5. RELATÓRIOS COLABORADORES
  function renderColaboradoresRelatorios(el) {
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Prestação de Contas PNAE</div>
        <div class="page-subtitle">Emissão de relatórios para comprovação de fornecimento da Agricultura Familiar</div>
      </div>
      <div class="card">
        <div class="card-body">
          <button class="btn btn-primary" onclick="window.print()">🖨️ Exportar Comprovante PNAE</button>
        </div>
      </div>
    `;
  }

})();
