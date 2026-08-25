/* ============================================
   SUALE — Módulo Gestor SEMED (js/modules/gestor.js)
   Perfil: Gestor SEMED / Administração Central
   ============================================ */

(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  // Esqueleto pre-Fase-4 (funcoes renderGestor* nao ligadas e modais
  // abrirModalNovaAta/salvarNovaAta/abrirModalLogsAuditoria) removido na Fase 5:
  // as versoes reais vivem no core_hub (ex-app.js). Os renderers reais e os
  // handlers _abrirModalPedido/_executarTriagem/etc. seguem na secao migrada abaixo.

  // === Migrado do app.js (Fase 4) ===
  PAGE_RENDERERS.gestor_dashboard = (el) => {
    // Basic Data
    const totalStudents = DATA.schools.reduce((a, s) => a + s.students, 0);
    const _totAtas = DATA.contracts.map(c => ataTotais(c.id));
    const totalAtas = _totAtas.reduce((a, t) => a + t.global, 0);
    const executedAtas = _totAtas.reduce((a, t) => a + t.empenhado, 0);
    
    const shared = SharedState.getOrders();
    const allOrders = [...DATA.orders, ...shared];
    
    // Derived Metrics for the Dashboard
    const custoPorAluno = executedAtas / (totalStudents || 1);
    const totalRefeicoesMes = totalStudents * 20 * 2; // Estimativa: 20 dias úteis, 2 refeições/dia
    const custoLogistico = allOrders.length * 350; // Mock: R$ 350 por entrega/caminhão (Simulação Frota)
    
    const escolasSeguras = DATA.schools.filter(s => s.stockStatus === 'ok').length;
    const pctEscolasSeguras = Math.round((escolasSeguras / DATA.schools.length) * 100) || 0;
    const escolasRisco = DATA.schools.filter(s => s.stockStatus === 'danger').length;

    const cardapiosAtivos = SharedState.getMenus ? SharedState.getMenus().length : 3; // Fallback
    
    // Novas Métricas (Feedback do Usuário)
    let diasCoberturaGlobal = 15; // fallback
    let pctDescentralizado = 65; // fallback
    try {
      if (typeof estoqueConsolidado === 'function') {
        const consolidado = estoqueConsolidado();
        if (consolidado && consolidado.length > 0) {
          diasCoberturaGlobal = Math.round(consolidado.reduce((acc, p) => acc + (p.diasCobertura || 0), 0) / consolidado.length);
          const valEscolas = consolidado.reduce((acc, p) => acc + (p.nasEscolas * (p.unitPrice || 0)), 0);
          const valCentral = consolidado.reduce((acc, p) => acc + (p.central * (p.unitPrice || 0)), 0);
          if ((valEscolas + valCentral) > 0) {
            pctDescentralizado = Math.round((valEscolas / (valEscolas + valCentral)) * 100);
          }
        }
      }
    } catch(e) {}
    
    // Mock: Custo por escola (ranking). Reflete o valor investido na escola.
    const escolasRanking = [...DATA.schools].sort((a,b) => b.students - a.students).map(s => ({
      name: s.name,
      custo: (executedAtas / totalStudents) * s.students * (0.8 + Math.random()*0.4) // variabilidade
    }));
    const top5 = escolasRanking.slice(0, 5);
    const bottom5 = [...escolasRanking].reverse().slice(0, 5);

    const totalFornecedores = new Set(DATA.contracts.map(c => c.supplier)).size;

    el.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">Painel de Resultados · Alimentação Escolar</div>
          <div class="page-subtitle">Indicadores Executivos · Atualizado em ${new Date().toLocaleDateString('pt-BR')}</div>
        </div>
        <button class="btn btn-sm ${state.pilotoAtivo ? 'btn-outline' : 'btn-primary'}" onclick="togglePilotoMode()" style="margin-left:auto">${state.pilotoAtivo ? 'Sair do Piloto' : '🎯 Ativar Modo Piloto (8 Escolas)'}</button>
      </div>

      <!-- VISÃO MACRO DO PROGRAMA -->
      <div class="kpi-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 24px;">
        <div class="kpi-card" style="border-left: 4px solid var(--primary); background: var(--surface-1);">
          <div class="kpi-icon">🏛️</div>
          <div class="kpi-value" style="font-size: 1.4rem;">${formatCurrency(executedAtas)}</div>
          <div class="kpi-label">Investimento Global SEMED</div>
        </div>
        <div class="kpi-card" style="border-left: 4px solid var(--primary); background: var(--surface-1);">
          <div class="kpi-icon">🏫</div>
          <div class="kpi-value" style="font-size: 1.4rem;">${DATA.schools.length}</div>
          <div class="kpi-label">Escolas Atendidas</div>
        </div>
        <div class="kpi-card" style="border-left: 4px solid var(--primary); background: var(--surface-1);">
          <div class="kpi-icon">🤝</div>
          <div class="kpi-value" style="font-size: 1.4rem;">${totalFornecedores}</div>
          <div class="kpi-label">Fornecedores Cadastrados</div>
        </div>
        <div class="kpi-card" style="border-left: 4px solid var(--primary); background: var(--surface-1);">
          <div class="kpi-icon">👨‍🎓</div>
          <div class="kpi-value" style="font-size: 1.4rem;">${totalStudents.toLocaleString('pt-BR')}</div>
          <div class="kpi-label">Alunos Impactados</div>
        </div>
      </div>
  
      <!-- HERO KPIs (O "Outdoor" da Gestão) -->
      <div class="kpi-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 24px;">
        <!-- LINHA 1 -->
        <div class="kpi-card green animate-fade-up stagger-1">
          <div class="kpi-icon">💰</div>
          <div class="kpi-value">${formatCurrency(custoPorAluno)}</div>
          <div class="kpi-label">Investimento por Aluno (Base Escola)</div>
          <div class="kpi-trend up">✓ Valor injetado diretamente na ponta</div>
        </div>
        <div class="kpi-card blue animate-fade-up stagger-2">
          <div class="kpi-icon">🍽️</div>
          <div class="kpi-value">${(totalRefeicoesMes/1000000).toFixed(1)}M</div>
          <div class="kpi-label">Refeições Garantidas no Mês</div>
          <div class="kpi-trend up">▲ Cobrindo 100% da rede</div>
        </div>
        <div class="kpi-card teal animate-fade-up stagger-3">
          <div class="kpi-icon">🏫</div>
          <div class="kpi-value">${pctEscolasSeguras}%</div>
          <div class="kpi-label">Escolas com Estoque Seguro</div>
          <div class="kpi-trend ${pctEscolasSeguras > 90 ? 'up' : 'down'}">${escolasRisco} escolas em estado de atenção</div>
        </div>
        
        <!-- LINHA 2 -->
        <div class="kpi-card purple animate-fade-up stagger-4">
          <div class="kpi-icon">🔄</div>
          <div class="kpi-value">${pctDescentralizado}%</div>
          <div class="kpi-label">Distribuição de Recursos (Descentralizado)</div>
          <div class="kpi-trend up">Recursos já posicionados nas escolas</div>
        </div>
        <div class="kpi-card orange animate-fade-up stagger-5">
          <div class="kpi-icon">🚚</div>
          <div class="kpi-value">${formatCurrency(custoLogistico)}</div>
          <div class="kpi-label">Simulação de Custo Logístico</div>
          <div class="kpi-trend down">Preparação para futura Gestão de Frota</div>
        </div>
        <div class="kpi-card blue animate-fade-up stagger-6">
          <div class="kpi-icon">📦</div>
          <div class="kpi-value">${diasCoberturaGlobal} dias</div>
          <div class="kpi-label">Orientação do Estoque Consolidado</div>
          <div class="kpi-trend up">Cobertura Global (Central + Escolas)</div>
        </div>
      </div>
  
      <div class="grid-2">
        <!-- RANKING DE CUSTO POR ESCOLA -->
        <div class="card animate-fade-up stagger-5">
          <div class="card-header">
            <div class="card-title">🏆 Top 5 Escolas por Investimento</div>
          </div>
          <div class="card-body">
            <div class="chart-container h-250">
              <canvas id="chart-escolas-ranking"></canvas>
            </div>
          </div>
        </div>
        
        <!-- PAINEL DE QUALIDADE E SEGURANÇA -->
        <div class="card animate-fade-up stagger-6">
          <div class="card-header">
            <div class="card-title">🛡️ Qualidade e Segurança Alimentar</div>
          </div>
          <div class="card-body" style="display:flex; flex-direction:column; gap:20px;">
            <div style="display:flex; align-items:center; gap:24px;">
              <div class="chart-container" style="width:140px;height:140px;position:relative">
                <canvas id="chart-estoque-termometro"></canvas>
                <div class="chart-center"><div class="chart-center-value">${pctEscolasSeguras}%</div><div class="chart-center-label" style="font-size:0.6rem">Em Dia</div></div>
              </div>
              <div style="flex:1">
                <div class="ia-metric" style="border-color:var(--border)"><span class="ia-metric-label">Cardápios Vigentes</span><span class="ia-metric-value" style="color:var(--primary)">${cardapiosAtivos} ativos</span></div>
                <div class="ia-metric" style="border-color:var(--border)"><span class="ia-metric-label">Adequação Nutricional</span><span class="ia-metric-value" style="color:var(--success)">✓ 100% Kcal atendidas</span></div>
                <div class="ia-metric" style="border-color:var(--border)"><span class="ia-metric-label">Agricultura Familiar</span><span class="ia-metric-value" style="color:var(--success)">✓ Meta (38%) Atingida</span></div>
              </div>
            </div>
            <div class="ia-suggestion" style="margin-top:0">
              🤖 <strong>IA Logística:</strong> Agrupar entregas da região Norte (EM Elízio Reis e EM Arlindo Lima) pouparia R$ 700,00 nesta semana.
            </div>
          </div>
        </div>
      </div>
  
      <div class="grid-2">
        <!-- EVOLUÇÃO CUSTO VS ALUNOS -->
        <div class="card animate-fade-up stagger-7">
          <div class="card-header">
            <div class="card-title">📈 Evolução: Custo Total vs Alunos Atendidos</div>
          </div>
          <div class="card-body">
            <div class="chart-container h-250">
              <canvas id="chart-custo-evolucao"></canvas>
            </div>
          </div>
        </div>

        <!-- EXECUÇÃO DAS ATAS -->
        <div class="card animate-fade-up stagger-8">
          <div class="card-header"><div class="card-title">💼 Execução Financeira (Atas e Contratos)</div></div>
          <div class="card-body">
            <div style="margin-bottom:16px;">
              <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                <strong>Total Global: ${formatCurrency(totalAtas)}</strong>
                <span>Empenhado: ${formatCurrency(executedAtas)} (${Math.round((executedAtas/totalAtas)*100)}%)</span>
              </div>
              <div class="progress-bar" style="height:12px;"><div class="progress-fill blue" style="width:${Math.round((executedAtas/totalAtas)*100)}%"></div></div>
            </div>
            <table class="data-table" style="font-size:0.85rem">
              <thead><tr><th>Ata</th><th>Fornecedor</th><th>Saldo %</th></tr></thead>
              <tbody>
                ${DATA.contracts.slice(0,3).map(c => {
                  const t = ataTotais(c.id);
                  const pct = Math.round((t.saldo / t.global)*100);
                  return `<tr>
                    <td>${c.number}</td>
                    <td>${c.supplier.split(' ')[0]}</td>
                    <td><div class="progress-bar" style="width:100%;height:6px"><div class="progress-fill ${pct<20?'red':pct<40?'orange':'green'}" style="width:${pct}%"></div></div></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  
    // CHARTS
    setTimeout(() => {
      // 1. Ranking Escolas
      createChart('chart-escolas-ranking', {
        type: 'bar',
        data: {
          labels: top5.map(s => s.name.replace('EMTI ', '').replace('EM ', '')),
          datasets: [{
            label: 'Investimento (R$)',
            data: top5.map(s => s.custo),
            backgroundColor: CHART_COLORS.teal,
            borderRadius: 4,
          }]
        },
        options: { ...CHART_DEFAULTS, indexAxis: 'y', plugins: { ...CHART_DEFAULTS.plugins, legend: { display: false } } }
      });
  
      // 2. Termômetro de Estoque
      createChart('chart-estoque-termometro', {
        type: 'doughnut',
        data: {
          labels: ['Estoque Adequado', 'Estoque Crítico/Atenção'],
          datasets: [{ data: [pctEscolasSeguras, 100 - pctEscolasSeguras], backgroundColor: ['#10B981', '#EF4444'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: true, cutout: '75%', plugins: { legend: { display: false } } }
      });

      // 3. Custo Evolução
      createChart('chart-custo-evolucao', {
        type: 'line',
        data: {
          labels: DATA.months.slice(0, 6), // Jan to Jun
          datasets: [
            {
              label: 'Custo Total (R$)',
              data: [850000, 840000, 835000, 845000, 820000, 815000],
              borderColor: CHART_COLORS.blue,
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              fill: true,
              yAxisID: 'y',
              tension: 0.4
            },
            {
              label: 'Alunos Atendidos',
              data: [120000, 120500, 121000, 121000, 121500, 122000],
              borderColor: CHART_COLORS.green,
              borderDash: [5, 5],
              yAxisID: 'y1',
              tension: 0.4
            }
          ]
        },
        options: { 
          ...CHART_DEFAULTS,
          interaction: { mode: 'index', intersect: false },
          scales: {
            y: { type: 'linear', display: true, position: 'left' },
            y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false } }
          }
        }
      });
    }, 100);
  };

  PAGE_RENDERERS.gestor_pedidos = (el) => {
    const shared = SharedState.getOrders();
    const pendentes   = shared.filter(o => o.status === 'Pendente').length   + DATA.orders.filter(o => o.status === 'Pendente').length;
    const emSeparacao = shared.filter(o => o.status === 'Em separação').length;
    const emAndamento = shared.filter(o => o.status === 'Em separação' || o.status === 'Em transporte').length;
    const entregues   = shared.filter(o => o.status === 'Entregue').length   + DATA.orders.filter(o => o.status === 'Entregue').length;
    const totalTodos  = shared.length + DATA.orders.length;
  
    // ─── Seed de pedidos demo (se SharedState vazio) ─────────────────
    const DEMO_ITEMS = [
      { produto: 'Arroz Tipo 1', qtd: 50, unidade: 'kg' },
      { produto: 'Feijão Carioca', qtd: 20, unidade: 'kg' },
      { produto: 'Biscoito Integral', qtd: 15, unidade: 'kg' },
    ];
    if (shared.length === 0) {
      SharedState.addOrder({ school: 'EM ARLINDO LIMA', cooperative: 'COOPAGRAN', itens: DEMO_ITEMS, value: 1020 });
      SharedState.addOrder({ school: 'EM ELPIDIO REIS', cooperative: 'COOPRAN',   itens: [{ produto: 'Leite Integral', qtd: 100, unidade: 'L' }, { produto: 'Macarrão Espaguete', qtd: 25, unidade: 'kg' }], value: 810 });
      return PAGE_RENDERERS.gestor_pedidos(el);
    }
  
    // ─── Helper: card status badge ────────────────────────────────────
    const allOrders = [
      ...shared.map(o => ({ ...o, _src: 'shared' })),
      ...DATA.orders.map(o => ({ ...o, _src: 'data', itens: o.itens || [] })),
    ];
  
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">📦 Gestão de Pedidos</div>
        <div class="page-subtitle">Triagem contratual automática · ATA · Empenho · OS · Lista de Compras</div>
      </div>
  
      <!-- KPIs -->
      <div class="kpi-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:20px">
        <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${totalTodos}</div><div class="kpi-label">Total</div></div>
        <div class="kpi-card red"><div class="kpi-icon">⏰</div><div class="kpi-value">${pendentes}</div><div class="kpi-label">Pendentes</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">📦</div><div class="kpi-value">${emSeparacao}</div><div class="kpi-label">Em Separação</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">🚚</div><div class="kpi-value">${emAndamento}</div><div class="kpi-label">Em Andamento</div></div>
        <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${entregues}</div><div class="kpi-label">Entregues</div></div>
      </div>
  
      <!-- Tabela de Pedidos -->
      <div class="card">
        <div class="card-header">
          <strong>Pedidos Recebidos</strong>
          <span class="status-badge status-info">${allOrders.length} pedidos</span>
        </div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th><th>Escola</th><th>Data</th><th>Cooperativa</th>
                <th>Itens</th><th>Valor</th><th>Status</th><th>Ação</th>
              </tr>
            </thead>
            <tbody>
              ${allOrders.map(o => `
                <tr class="clickable-row" onclick="window._abrirModalPedido('${o.id}','${o._src}')">
                  <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">
                    #${String(o.numero||o.id).padStart(3,'0')}
                    ${o._src==='shared'?'<span class="tag tag-blue" style="font-size:0.62rem">NOVO</span>':''}
                  </td>
                  <td><strong>${o.school}</strong></td>
                  <td>${o.date ? o.date.slice(0,10) : '—'}</td>
                  <td><span class="tag tag-teal">${o.cooperative||o.coop||'—'}</span></td>
                  <td style="font-size:0.82rem">${(o.itens||[]).length || '—'} item(ns)</td>
                  <td style="font-family:var(--font-mono)">${formatCurrency(o.value||0)}</td>
                  <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
                  <td>
                    ${o.status === 'Pendente'
                      ? `<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();window._abrirModalPedido('${o.id}','${o._src}')">🔍 Analisar</button>`
                      : `<button class="btn btn-sm btn-outline" disabled>${o.status}</button>`
                    }
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Modal de Triagem -->
      <div id="modal-triagem" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:1000;align-items:center;justify-content:center">
        <div id="modal-triagem-inner" style="background:var(--bg-card);border-radius:var(--radius-xl);padding:28px;max-width:780px;width:95vw;max-height:88vh;overflow-y:auto;box-shadow:var(--shadow-xl)">
          <div id="modal-triagem-content"></div>
        </div>
      </div>`;
  
    // ─── Lógica do Modal ──────────────────────────────────────────────
    window._abrirModalPedido = (orderId, src) => {
      const order = src === 'shared'
        ? SharedState.getOrders().find(o => o.id === orderId)
        : DATA.orders.find(o => String(o.id) === String(orderId));
      if (!order) return;
  
      const modal = document.getElementById('modal-triagem');
      const content = document.getElementById('modal-triagem-content');
      modal.style.display = 'flex';
  
      // Render: detalhe do pedido + botões de ação
      const itensHtml = (order.itens || []).length > 0
        ? (order.itens || []).map((i, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td><strong>${i.produto}</strong></td>
              <td style="font-family:var(--font-mono)">${i.qtd} ${i.unidade}</td>
              <td><span class="tag tag-gray">Aguardando verificação</span></td>
            </tr>`).join('')
        : `<tr><td colspan="4" style="text-align:center;color:#94A3B8">Pedido sem itens detalhados</td></tr>`;
  
      content.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
          <div>
            <h3 style="margin:0;font-size:1.1rem">Pedido #${String(order.numero||order.id).padStart(3,'0')}</h3>
            <div style="color:var(--text-secondary);font-size:0.85rem;margin-top:4px">
              ${order.school} · ${order.cooperative||order.coop||'—'} · ${(order.date||'').slice(0,10)}
            </div>
          </div>
          <button onclick="document.getElementById('modal-triagem').style.display='none'" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--text-secondary)">✕</button>
        </div>
        <div class="card" style="margin-bottom:16px">
          <div class="card-header"><strong>📦 Itens Solicitados</strong></div>
          <table class="data-table">
            <thead><tr><th>#</th><th>Produto</th><th>Quantidade</th><th>Status Contratual</th></tr></thead>
            <tbody id="modal-itens-tbody">${itensHtml}</tbody>
          </table>
        </div>
        <div style="display:flex;gap:12px;justify-content:flex-end">
          <button class="btn btn-outline" onclick="document.getElementById('modal-triagem').style.display='none'">Fechar</button>
          ${order.status === 'Pendente' && src === 'shared' ? `
            <button class="btn btn-warning" onclick="window._recusarPedido('${orderId}')">❌ Recusar</button>
            <button class="btn btn-primary" id="btn-aceitar-processar" onclick="window._executarTriagem('${orderId}')">
              🔍 Aceitar e Processar
            </button>` : `<span style="font-size:0.85rem;color:var(--text-secondary);align-self:center">Pedido já processado: <strong>${order.status}</strong></span>`}
        </div>`;
    };
  
    window._executarTriagem = (orderId) => {
      const btn = document.getElementById('btn-aceitar-processar');
      if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Verificando ATAs e Empenhos...'; }
  
      setTimeout(() => {
        const resultado = SharedState.processarPedido(orderId);
        if (!resultado) return;
  
        const { order, ataItems, empenhoGeradoItems, semAtaItems } = resultado;
        const content = document.getElementById('modal-triagem-content');
  
        // Badge de resultado por tipo
        const badge = (tipo) => {
          if (tipo === 'Vinculado à Ata/Empenho') return '<span class="tag tag-green">✅ Vinculado à Ata/Empenho</span>';
          if (tipo === 'Empenho Gerado')           return '<span class="tag tag-blue">🆕 Empenho Gerado</span>';
          return '<span class="tag tag-orange">⚠️ Sem Ata → Lista de Compras</span>';
        };
  
        const allItens = [...ataItems, ...empenhoGeradoItems, ...semAtaItems];
        const itensHtml = allItens.map((i, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${i.produto}</strong></td>
            <td style="font-family:var(--font-mono)">${i.qtd} ${i.unidade}</td>
            <td>${badge(i.resultado)}</td>
            <td style="font-size:0.75rem;color:var(--text-secondary)">
              ${i.ataNumero ? `ATA: <code>${i.ataNumero}</code>` : ''}
              ${i.empenhoNumero ? `· EMP: <code>${i.empenhoNumero}</code>` : ''}
            </td>
          </tr>`).join('');
  
        const temOS = (ataItems.length + empenhoGeradoItems.length) > 0;
        const temLC = semAtaItems.length > 0;
  
        content.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
            <div>
              <h3 style="margin:0;font-size:1.1rem">Resultado da Triagem — Pedido #${String(order.numero||order.id).padStart(3,'0')}</h3>
              <div style="color:var(--text-secondary);font-size:0.85rem;margin-top:4px">${order.school}</div>
            </div>
            <button onclick="document.getElementById('modal-triagem').style.display='none'" style="background:none;border:none;font-size:1.4rem;cursor:pointer;color:var(--text-secondary)">✕</button>
          </div>
  
          <!-- Resumo por resultado -->
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px">
            <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:14px;text-align:center">
              <div style="font-size:1.5rem;font-weight:700;color:#10B981">${ataItems.length}</div>
              <div style="font-size:0.78rem;color:var(--text-secondary)">✅ Vinculados</div>
              <div style="font-size:0.72rem;color:var(--text-tertiary)">Geram OS</div>
            </div>
            <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.3);border-radius:10px;padding:14px;text-align:center">
              <div style="font-size:1.5rem;font-weight:700;color:#3B82F6">${empenhoGeradoItems.length}</div>
              <div style="font-size:0.78rem;color:var(--text-secondary)">🆕 Empenho Gerado</div>
              <div style="font-size:0.72rem;color:var(--text-tertiary)">Geram OS</div>
            </div>
            <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;padding:14px;text-align:center">
              <div style="font-size:1.5rem;font-weight:700;color:#F59E0B">${semAtaItems.length}</div>
              <div style="font-size:0.78rem;color:var(--text-secondary)">⚠️ Sem Ata</div>
              <div style="font-size:0.72rem;color:var(--text-tertiary)">→ Lista de Compras</div>
            </div>
          </div>
  
          <!-- Tabela detalhada -->
          <div class="card" style="margin-bottom:16px">
            <div class="card-header"><strong>Itens do Pedido — Verificação Contratual</strong></div>
            <table class="data-table">
              <thead><tr><th>#</th><th>Produto</th><th>Quantidade</th><th>Resultado</th><th>Referência</th></tr></thead>
              <tbody>${itensHtml}</tbody>
            </table>
          </div>
  
          <!-- O que será gerado -->
          <div style="background:var(--bg-subtle);border-radius:var(--radius-md);padding:14px;margin-bottom:16px;font-size:0.85rem">
            ${temOS ? `<div style="margin-bottom:6px">🏭 <strong>OS para Estoque Central:</strong> será criada com ${ataItems.length + empenhoGeradoItems.length} item(ns) para separação imediata</div>` : ''}
            ${temLC ? `<div>🛒 <strong>Lista de Compras:</strong> ${semAtaItems.length} item(ns) serão enviados ao setor de compras</div>` : ''}
          </div>
  
          <div style="display:flex;gap:12px;justify-content:flex-end">
            <button class="btn btn-outline" onclick="document.getElementById('modal-triagem').style.display='none'">Cancelar</button>
            <button class="btn btn-primary" id="btn-confirmar-os" onclick="window._confirmarAceitePedido('${order.id}',${JSON.stringify(resultado).split('"').join("'")})">
              ✅ Confirmar e Gerar OS
            </button>
          </div>`;
      }, 900); // simula processamento
    };
  
    window._confirmarAceitePedido = (orderId, resultado) => {
      // Se resultado veio como string por causa do stringify, refaz o processamento
      const res = typeof resultado === 'string' ? SharedState.processarPedido(orderId) : resultado;
      if (!res) return;
  
      const aplicado = SharedState.aceitarPedido(orderId, res);
      document.getElementById('modal-triagem').style.display = 'none';
  
      const msg = [
        aplicado.itensComOS.length > 0 ? `📦 ${aplicado.itensComOS.length} item(ns) → OS gerada para Estoque Central` : '',
        aplicado.semAtaItems.length > 0 ? `🛒 ${aplicado.semAtaItems.length} item(ns) → Lista de Compras` : '',
      ].filter(Boolean).join(' · ');
  
      showToast('✅ Pedido processado! ' + msg, 'success');
      // Re-renderiza a tela
      setTimeout(() => PAGE_RENDERERS.gestor_pedidos(document.getElementById('page-content')), 400);
    };
  
    window._recusarPedido = (orderId) => {
      SharedState.updateOrderStatus(orderId, 'Recusado');
      document.getElementById('modal-triagem').style.display = 'none';
      showToast('❌ Pedido recusado.', 'warning');
      setTimeout(() => PAGE_RENDERERS.gestor_pedidos(document.getElementById('page-content')), 400);
    };
  
    // Fecha modal ao clicar fora
    document.getElementById('modal-triagem')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-triagem') e.target.style.display = 'none';
    });
  };

  PAGE_RENDERERS.gestor_cooperativas = (el) => {
    el.innerHTML = `
      <div class="page-header"><div class="page-title">Gestão de Cooperativas</div><div class="page-subtitle">Performance das cooperativas parceiras</div></div>
      <div class="card mb-24">
        <div class="card-body">
          <table class="data-table">
            <thead><tr><th>Cooperativa</th><th>Agricultores</th><th>Pedidos Recebidos</th><th>Pedidos Entregues</th><th>Índice de Atendimento</th><th>Valor Executado</th><th>Ações</th></tr></thead>
            <tbody>
              ${DATA.cooperatives.map(c => `<tr class="clickable-row" onclick="navigateTo('cooperativa','dashboard')">
                <td><strong>${c.name}</strong></td>
                <td style="font-family:var(--font-mono)">${c.farmers}</td>
                <td style="font-family:var(--font-mono)">${c.orders}</td>
                <td style="font-family:var(--font-mono)">${c.delivered}</td>
                <td><div style="display:flex;align-items:center;gap:6px"><div class="progress-bar" style="width:80px"><div class="progress-fill ${c.rate >= 90 ? 'green' : 'orange'}" style="width:${c.rate}%"></div></div><span style="font-family:var(--font-mono);font-size:0.78rem">${c.rate}%</span></div></td>
                <td style="font-family:var(--font-mono)">${formatCurrency(c.value)}</td>
                <td><button class="table-action">Ver Indicadores</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📊 Performance Comparativa</div></div>
        <div class="card-body"><div class="chart-container h-300"><canvas id="chart-coop-perf"></canvas></div></div>
      </div>
    `;
    setTimeout(() => {
      createChart('chart-coop-perf', {
        type: 'bar',
        data: {
          labels: DATA.cooperatives.map(c => c.name),
          datasets: [
            { label: 'Pedidos Recebidos', data: DATA.cooperatives.map(c => c.orders), backgroundColor: CHART_COLORS.blue, borderRadius: 4 },
            { label: 'Pedidos Entregues', data: DATA.cooperatives.map(c => c.delivered), backgroundColor: CHART_COLORS.green, borderRadius: 4 },
          ]
        },
        options: CHART_DEFAULTS
      });
    }, 100);
  };

  PAGE_RENDERERS.gestor_agricultura = (el) => {
    const producoes = SharedState.getProductions();
    el.innerHTML = `
      <div class="page-header"><div class="page-title">Agricultura Familiar</div><div class="page-subtitle">Acompanhamento dos agricultores familiares — dados vindos diretamente dos agricultores</div></div>
  
      ${producoes.length > 0 ? `
      <div class="card mb-24" style="border-left:4px solid var(--success)">
        <div class="card-header"><div class="card-title">🆕 Atualizações de Produção Recentes</div><span class="status-badge status-ok">${producoes.length}</span></div>
        <div class="card-body" style="padding:0">
          <table class="data-table"><thead><tr><th>Agricultor</th><th>Produto</th><th>Área (ha)</th><th>Prevista (kg)</th><th>Disponível (kg)</th><th>Registrado em</th></tr></thead><tbody>
            ${producoes.slice(0, 6).map(p => `
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
  
      <div class="kpi-grid">
        <div class="kpi-card green"><div class="kpi-icon">👨‍🌾</div><div class="kpi-value">${DATA.farmers.length}</div><div class="kpi-label">Agricultores Ativos</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">🌱</div><div class="kpi-value">${DATA.farmers.reduce((a,f)=>a+f.products.length,0)}</div><div class="kpi-label">Produtos Cadastrados</div></div>
        <div class="kpi-card blue"><div class="kpi-icon">📊</div><div class="kpi-value">${(DATA.farmers.reduce((a,f)=>a+f.production,0)/1000).toFixed(1)}t</div><div class="kpi-label">Produção Estimada</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">📦</div><div class="kpi-value">${(DATA.farmers.reduce((a,f)=>a+f.stock,0)/1000).toFixed(1)}t</div><div class="kpi-label">Estoque Disponível</div></div>
      </div>
      <div class="card">
        <div class="card-body">
          <table class="data-table">
            <thead><tr><th>Agricultor</th><th>Cooperativa</th><th>Produtos</th><th>Produção Est. (kg)</th><th>Estoque (kg)</th><th>Área (ha)</th></tr></thead>
            <tbody>
              ${DATA.farmers.map(f => `<tr class="clickable-row" onclick="navigateTo('agricultor','dashboard')">
                <td><strong>${f.name}</strong></td>
                <td><span class="tag tag-teal">${f.coop}</span></td>
                <td>${f.products.map(p => `<span class="tag tag-green" style="margin:1px">${p}</span>`).join(' ')}</td>
                <td style="font-family:var(--font-mono)">${f.production.toLocaleString('pt-BR')}</td>
                <td style="font-family:var(--font-mono)">${f.stock.toLocaleString('pt-BR')}</td>
                <td style="font-family:var(--font-mono)">${f.area}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  PAGE_RENDERERS.gestor_estoque = (el) => {
    const cats = [...new Set(DATA.products.map(p => p.category))].sort();
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Estoque Consolidado Municipal</div>
        <div class="page-subtitle">Estoque Central + o que está distribuído nas escolas · clique na linha para ver lotes e validade</div>
      </div>
      <div class="kpi-grid" id="estoque-kpis"></div>
      <div class="card" style="margin-top:20px">
        <div class="card-header">
          <div class="card-title">Produtos em Estoque</div>
          <div class="filter-bar" style="margin:0;display:flex;gap:8px;flex-wrap:wrap">
            <input type="search" id="filter-prod-nome" placeholder="Buscar produto..." style="padding:7px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem;min-width:180px">
            <select id="filter-prod-cat"><option value="">Todas as Categorias</option>${cats.map(c => `<option>${c}</option>`).join('')}</select>
            <select id="filter-prod-status">
              <option value="">Todos os Status</option>
              <option value="critico">Crítico (≤3 dias)</option>
              <option value="atencao">Atenção (4-7 dias)</option>
              <option value="normal">Normal (>7 dias)</option>
            </select>
            <select id="filter-prod-origem">
              <option value="">Toda origem</option>
              <option value="af">🌾 Agricultura Familiar</option>
              <option value="conv">Convencional</option>
            </select>
          </div>
        </div>
        <div class="card-body">
          <table class="data-table" id="tabela-estoque">
            <thead><tr>
              <th style="width:28px"></th><th>Produto</th><th>Categoria</th>
              <th>Central</th><th>Nas Escolas</th><th>Total</th>
              <th>Consumo/Dia</th><th>Cobertura</th><th>Valor</th><th>Status</th>
            </tr></thead>
            <tbody id="estoque-tbody"></tbody>
          </table>
          <div id="estoque-vazio" style="display:none;padding:32px;text-align:center;color:var(--text-secondary)">Nenhum produto encontrado com esses filtros.</div>
        </div>
      </div>
    `;
  
    const consolidado = estoqueConsolidado();
  
    function statusDe(p) {
      const d = p.diasCobertura;
      return d <= 3 ? 'critico' : d <= 7 ? 'atencao' : 'normal';
    }
  
    function aplicarFiltros() {
      const nome   = (document.getElementById('filter-prod-nome').value || '').toLowerCase().trim();
      const cat    = document.getElementById('filter-prod-cat').value;
      const stat   = document.getElementById('filter-prod-status').value;
      const origem = document.getElementById('filter-prod-origem').value;
  
      const filtrados = consolidado.filter(p => {
        if (nome && !p.name.toLowerCase().includes(nome)) return false;
        if (cat && p.category !== cat) return false;
        if (stat && statusDe(p) !== stat) return false;
        if (origem === 'af' && !p.familyFarm) return false;
        if (origem === 'conv' && p.familyFarm) return false;
        return true;
      });
  
      renderLinhas(filtrados);
      renderKpis(filtrados);
    }
  
    function renderKpis(lista) {
      const valor    = lista.reduce((s, p) => s + p.total * (p.unitPrice || 0), 0);
      const criticos = lista.filter(p => statusDe(p) === 'critico').length;
      const naEscola = lista.reduce((s, p) => s + p.nasEscolas, 0);
      const central  = lista.reduce((s, p) => s + p.central, 0);
      const pctAF    = lista.length ? Math.round(lista.filter(p => p.familyFarm).length / lista.length * 100) : 0;
      document.getElementById('estoque-kpis').innerHTML = `
        <div class="kpi-card blue"><div class="kpi-icon">💰</div><div class="kpi-value">${formatCurrency(valor)}</div><div class="kpi-label">Valor em estoque · ${lista.length} itens</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">🏭</div><div class="kpi-value">${central.toLocaleString('pt-BR')}</div><div class="kpi-label">Unidades no Estoque Central</div></div>
        <div class="kpi-card green"><div class="kpi-icon">🏫</div><div class="kpi-value">${naEscola.toLocaleString('pt-BR')}</div><div class="kpi-label">Unidades nas escolas</div></div>
        <div class="kpi-card ${criticos ? 'red' : 'green'}"><div class="kpi-icon">${criticos ? '🔴' : '✅'}</div><div class="kpi-value">${criticos}</div><div class="kpi-label">Produtos críticos · ${pctAF}% agric. familiar</div></div>`;
    }
  
    function renderLinhas(lista) {
      const tb = document.getElementById('estoque-tbody');
      document.getElementById('estoque-vazio').style.display = lista.length ? 'none' : 'block';
      tb.innerHTML = lista.map(p => {
        const st = statusDe(p);
        const cor = st === 'critico' ? 'var(--danger)' : st === 'atencao' ? 'var(--warning)' : 'var(--success)';
        const temDetalhe = p.lotes.length || p.escolas.length;
        return `
        <tr class="estoque-row" data-pid="${p.id}" style="cursor:${temDetalhe ? 'pointer' : 'default'}">
          <td style="text-align:center;color:var(--text-secondary)">${temDetalhe ? `<span class="chev" data-pid="${p.id}" style="display:inline-block;transition:transform .18s">▸</span>` : ''}</td>
          <td><strong>${p.name}</strong>${p.familyFarm ? ' <span title="Agricultura Familiar">🌾</span>' : ''}</td>
          <td><span class="tag tag-blue">${p.category}</span></td>
          <td style="font-family:var(--font-mono)">${p.central.toLocaleString('pt-BR')}</td>
          <td style="font-family:var(--font-mono);color:var(--text-secondary)">${p.nasEscolas ? p.nasEscolas.toLocaleString('pt-BR') : '—'}</td>
          <td style="font-family:var(--font-mono);font-weight:700">${p.total.toLocaleString('pt-BR')} ${p.unit}</td>
          <td style="font-family:var(--font-mono)">${p.avgConsume} ${p.unit}</td>
          <td style="font-family:var(--font-mono);font-weight:700;color:${cor}">${p.diasCobertura} dias</td>
          <td style="font-family:var(--font-mono)">${formatCurrency(p.total * (p.unitPrice || 0))}</td>
          <td><span class="status-badge ${st === 'critico' ? 'status-danger' : st === 'atencao' ? 'status-warning' : 'status-ok'}">${st === 'critico' ? 'Crítico' : st === 'atencao' ? 'Atenção' : 'Normal'}</span></td>
        </tr>
        <tr class="estoque-detalhe" data-detalhe="${p.id}" hidden>
          <td colspan="10" style="background:var(--surface-2);padding:14px 20px">
            <div style="display:grid;grid-template-columns:${p.lotes.length && p.escolas.length ? '1fr 1fr' : '1fr'};gap:20px">
              ${p.lotes.length ? `
                <div>
                  <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;color:var(--text-secondary);margin-bottom:6px">Lotes · FEFO (primeiro a vencer primeiro)</div>
                  <table class="data-table" style="font-size:0.84rem">
                    <thead><tr><th>Lote</th><th>Entrada</th><th>Validade</th><th>Qtd</th><th>Situação</th></tr></thead>
                    <tbody>
                      ${p.lotes.map(l => {
                        const d = diasAteVencer(l.expirationDate);
                        const sev = d < 0 ? 'danger' : d <= 7 ? 'danger' : d <= 30 ? 'warning' : 'ok';
                        const txt = d < 0 ? `Vencido há ${Math.abs(d)}d` : d === 0 ? 'Vence hoje' : `${d} dias`;
                        return `<tr>
                          <td style="font-family:var(--font-mono)">${l.number}</td>
                          <td>${formatDate(l.entryDate)}</td>
                          <td>${formatDate(l.expirationDate)}</td>
                          <td style="font-family:var(--font-mono)">${l.qtd.toLocaleString('pt-BR')} ${p.unit}</td>
                          <td><span class="status-badge status-${sev}">${txt}</span></td>
                        </tr>`;
                      }).join('')}
                    </tbody>
                  </table>
                </div>` : ''}
              ${p.escolas.length ? `
                <div>
                  <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;color:var(--text-secondary);margin-bottom:6px">Distribuição nas escolas</div>
                  <table class="data-table" style="font-size:0.84rem">
                    <thead><tr><th>Escola</th><th>Qtd</th><th>% do total</th></tr></thead>
                    <tbody>
                      ${p.escolas.map(e => `<tr>
                        <td>${e.escola}</td>
                        <td style="font-family:var(--font-mono)">${e.qtd.toLocaleString('pt-BR')} ${p.unit}</td>
                        <td style="font-family:var(--font-mono);color:var(--text-secondary)">${p.total ? Math.round(e.qtd / p.total * 100) : 0}%</td>
                      </tr>`).join('')}
                    </tbody>
                  </table>
                </div>` : ''}
            </div>
            ${!p.lotes.length ? '<div style="font-size:0.82rem;color:var(--text-secondary);margin-top:8px">Sem lote com validade cadastrado para este produto.</div>' : ''}
          </td>
        </tr>`;
      }).join('');
  
      tb.querySelectorAll('.estoque-row').forEach(tr => {
        tr.addEventListener('click', () => {
          const pid = tr.dataset.pid;
          const det = tb.querySelector(`[data-detalhe="${pid}"]`);
          if (!det) return;
          const abrindo = det.hidden;
          det.hidden = !abrindo;
          const chev = tr.querySelector('.chev');
          if (chev) chev.style.transform = abrindo ? 'rotate(90deg)' : '';
        });
      });
    }
  
    ['filter-prod-nome', 'filter-prod-cat', 'filter-prod-status', 'filter-prod-origem'].forEach(id => {
      const elx = document.getElementById(id);
      elx.addEventListener(id === 'filter-prod-nome' ? 'input' : 'change', aplicarFiltros);
    });
  
    aplicarFiltros();
  };

  PAGE_RENDERERS.gestor_planejamento = (el) => {
    const menus = SharedState.getMenus();
    const weekly = SharedState.getWeeklyMenus();
    const perfilAtivo = state.currentProfile;
    const activeMenu = menus.find(m => m.status === 'Publicado') || menus[0] || {};
    const periodicidadeStr = (activeMenu.periodicidade || 'mensal').toUpperCase();
    const numSemanas = activeMenu.numSemanas || 5;

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Planejamento Alimentar</div>
        <div class="page-subtitle">Visão consolidada dos cardápios por período (${periodicidadeStr} · ${numSemanas} Semanas) · Sincronizado com Nutricionista e Escolas</div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📅 Cardápios por Período</div>
            <span class="status-badge status-info">${menus.length}</span>
          </div>
          <div class="card-body" style="padding:0">
            <table class="data-table"><thead><tr><th>Cardápio</th><th>Periodicidade</th><th>Período</th><th>Escolas</th><th>Status</th></tr></thead><tbody>
              ${menus.map(m => `
                <tr>
                  <td><strong>${m.nome}</strong></td>
                  <td><span class="tag tag-blue" style="font-size:0.75rem">${(m.periodicidade || 'mensal').toUpperCase()} (${m.numSemanas || 5} sem)</span></td>
                  <td>${m.periodo}</td>
                  <td style="font-family:var(--font-mono)">${m.escolas || 0}</td>
                  <td><span class="status-badge ${m.status === 'Publicado' ? 'status-ok' : 'status-info'}">${m.status === 'Publicado' ? 'Ativo' : m.status}</span></td>
                </tr>
              `).join('')}
            </tbody></table>
          </div>
        </div>
        <div class="card"><div class="card-header"><div class="card-title">📊 Demanda Agregada por Período (${periodicidadeStr})</div></div><div class="card-body">
          <div class="chart-container h-250"><canvas id="chart-necessidades"></canvas></div>
        </div></div>
      </div>
  
      ${weekly.length > 0 ? `
      <div class="card" style="margin-top:20px">
        <div class="card-header"><div class="card-title">🗓️ Semanário de Refeições Publicadas</div><span class="status-badge status-ok">${weekly.length} Semanas</span></div>
        <div class="card-body" style="padding:0">
          <table class="data-table"><thead><tr><th>Semana / Título</th><th>Cardápio Pai</th><th>Autor</th><th>Publicado em</th><th>Média Kcal</th></tr></thead><tbody>
            ${weekly.slice(0, 8).map(w => {
              const menuPai = SharedState.getCardapio(w.cardapioId);
              return `
                <tr>
                  <td><strong>${w.semana || 'Semana 1'}</strong></td>
                  <td><span class="tag tag-purple" style="font-size:0.75rem">${menuPai ? menuPai.nome : 'Cardápio Principal'}</span></td>
                  <td style="font-size:0.82rem">${w.autor || 'Dra. Lilian Droppa'}</td>
                  <td style="font-size:0.82rem">${w.publicadoEm ? new Date(w.publicadoEm).toLocaleDateString('pt-BR') : '25/05/2026'}</td>
                  <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${w.kcalMedia || '720'} kcal/dia</td>
                </tr>
              `;
            }).join('')}
          </tbody></table>
        </div>
      </div>` : ''}
    `;
    setTimeout(() => {
      createChart('chart-necessidades', {
        type: 'bar',
        data: {
          labels: ['Arroz', 'Feijão', 'Leite', 'Frango', 'Carne', 'Banana', 'Tomate', 'Cenoura'],
          datasets: [
            { label: 'Necessário (kg)', data: [25500, 12600, 36000, 23400, 15600, 18000, 12000, 9300], backgroundColor: CHART_COLORS.blue, borderRadius: 4 },
            { label: 'Estoque Atual (kg)', data: [12500, 4200, 8900, 5600, 3200, 1800, 1950, 3100], backgroundColor: CHART_COLORS.green, borderRadius: 4 },
          ]
        },
        options: CHART_DEFAULTS
      });
    }, 100);
  };

  PAGE_RENDERERS.gestor_relatorios = (el) => {
    const relatorios = [
      { icon: '📊', title: 'Produtos Mais Consumidos', desc: 'Ranking de consumo por produto', key: 'produtos_consumo' },
      { icon: '🏫', title: 'Consumo por Escola', desc: 'Detalhamento por unidade', key: 'consumo_escola' },
      { icon: '🚚', title: 'Entregas Realizadas', desc: 'Histórico de entregas do SharedState', key: 'entregas' },
      { icon: '📋', title: 'Execução de Empenhos', desc: 'Saldo consumido por empenho', key: 'empenhos' },
      { icon: '💼', title: 'NFs Recebidas', desc: 'Notas fiscais registradas', key: 'nfs' },
      { icon: '🌾', title: 'Produção Agrícola Familiar', desc: 'Produção declarada dos agricultores', key: 'producoes' },
    ];
    el.innerHTML = `
      <div class="page-header"><div class="page-title">Relatórios Gerenciais</div><div class="page-subtitle">Exportação em CSV dos dados consolidados do sistema</div></div>
      <div class="grid-3">
        ${relatorios.map(r => `
          <div class="card">
            <div class="card-body" style="text-align:center;padding:30px">
              <div style="font-size:2.5rem;margin-bottom:12px">${r.icon}</div>
              <div style="font-weight:700;font-size:0.95rem;margin-bottom:6px">${r.title}</div>
              <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:14px">${r.desc}</div>
              <button class="btn btn-primary btn-sm" onclick="exportRelatorio('${r.key}')">📥 Exportar CSV</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  };

  PAGE_RENDERERS.gestor_ia = (el) => {
    // 🔗 Alertas baseados em dados reais: DATA.products.daysLeft + pedidos SharedState + central stock
    const criticos = DATA.products.filter(p => (p.daysLeft || 99) <= 5).sort((a,b) => (a.daysLeft||0) - (b.daysLeft||0));
    const monitorar = DATA.products.filter(p => (p.daysLeft || 99) > 5 && (p.daysLeft || 99) <= 10);
    const demandaPrevista30d = DATA.products.reduce((s, p) => s + (p.avgConsume || 0) * 30, 0);
    const demandaPrevista90d = demandaPrevista30d * 3;
    const pedidosPendentes = SharedState.getOrders().filter(o => o.status === 'Pendente').length;
  
    const alerts = [
      ...criticos.slice(0, 5).map(p => {
        const emoji = p.daysLeft <= 2 ? '🔴' : p.daysLeft <= 4 ? '🟡' : '🟢';
        return `<div class="ia-suggestion">${emoji} <strong>${p.name}</strong> esgota em <strong>${p.daysLeft} dia${p.daysLeft>1?'s':''}</strong> — ${p.daysLeft <= 2 ? '92' : p.daysLeft <= 4 ? '78' : '65'}% de probabilidade</div>`;
      }),
      ...monitorar.slice(0, 2).map(p => `<div class="ia-suggestion">🟢 <strong>${p.name}</strong> estoque em <strong>${p.daysLeft} dias</strong> — monitorar</div>`),
    ].join('') || '<div class="ia-suggestion">✅ Sem alertas críticos no momento</div>';
  
    el.innerHTML = `
      <div class="page-header"><div class="page-title">🤖 Inteligência Artificial — Previsão de Demanda</div><div class="page-subtitle">Motor de IA · Alertas calculados a partir do consumo diário real</div></div>
  
      <div class="kpi-grid">
        <div class="kpi-card blue"><div class="kpi-icon">📊</div><div class="kpi-value">${(demandaPrevista30d/1000).toFixed(1)}k</div><div class="kpi-label">Demanda 30 dias (kg)</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">📈</div><div class="kpi-value">${(demandaPrevista90d/1000).toFixed(1)}k</div><div class="kpi-label">Demanda 90 dias (kg)</div></div>
        <div class="kpi-card red"><div class="kpi-icon">⚠️</div><div class="kpi-value">${criticos.length}</div><div class="kpi-label">Produtos Críticos (≤5d)</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">🛒</div><div class="kpi-value">${pedidosPendentes}</div><div class="kpi-label">Pedidos Pendentes</div></div>
      </div>
  
      <div class="grid-2-1 mb-24">
        <div class="card">
          <div class="card-header"><div class="card-title">📈 Projeção de Demanda (6 meses)</div></div>
          <div class="card-body"><div class="chart-container h-300"><canvas id="chart-ia-projecao"></canvas></div></div>
        </div>
        <div class="ia-card">
          <div class="ia-card-title">🧠 Alertas Preditivos (Real)</div>
          ${alerts}
        </div>
      </div>
  
      <div class="grid-2 mb-24">
        <div class="card">
          <div class="card-header"><div class="card-title">🛒 Sugestão de Compras Imediatas</div></div>
          <div class="card-body">
            <table class="data-table">
              <thead><tr><th>Produto</th><th>Estoque Atual</th><th>Necessidade 30d</th><th>Comprar</th><th>Prioridade</th></tr></thead>
              <tbody>
                <tr><td><strong>Alface Crespa</strong></td><td>520 kg</td><td>8.400 kg</td><td style="font-family:var(--font-mono);font-weight:700;color:var(--danger)">7.880 kg</td><td><span class="status-badge status-danger">Urgente</span></td></tr>
                <tr><td><strong>Banana Nanica</strong></td><td>1.800 kg</td><td>18.000 kg</td><td style="font-family:var(--font-mono);font-weight:700;color:var(--danger)">16.200 kg</td><td><span class="status-badge status-danger">Urgente</span></td></tr>
                <tr><td><strong>Melancia</strong></td><td>900 kg</td><td>13.500 kg</td><td style="font-family:var(--font-mono);font-weight:700;color:var(--warning)">12.600 kg</td><td><span class="status-badge status-warning">Alta</span></td></tr>
                <tr><td><strong>Tomate</strong></td><td>1.950 kg</td><td>12.000 kg</td><td style="font-family:var(--font-mono);font-weight:700;color:var(--warning)">10.050 kg</td><td><span class="status-badge status-warning">Alta</span></td></tr>
                <tr><td><strong>Abóbora Cabotiá</strong></td><td>1.400 kg</td><td>7.800 kg</td><td style="font-family:var(--font-mono);font-weight:700">6.400 kg</td><td><span class="status-badge status-info">Média</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">🔄 Sugestões de Substituição Nutricional</div></div>
          <div class="card-body">
            <table class="data-table">
              <thead><tr><th>Produto Original</th><th>Substituição Sugerida</th><th>Economia</th><th>Disponibilidade</th></tr></thead>
              <tbody>
                <tr><td>Melancia</td><td><strong>Manga Tommy</strong> (safra)</td><td style="color:var(--success)">-18%</td><td><span class="status-badge status-ok">Alta</span></td></tr>
                <tr><td>Maçã Fuji</td><td><strong>Banana Prata</strong> (AF)</td><td style="color:var(--success)">-25%</td><td><span class="status-badge status-ok">Alta</span></td></tr>
                <tr><td>Carne Bovina</td><td><strong>Frango (Peito)</strong></td><td style="color:var(--success)">-35%</td><td><span class="status-badge status-warning">Média</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      <!-- SIMULADOR -->
      <div class="card mb-24">
        <div class="card-header"><div class="card-title">🔬 Simulador de Cenários</div><div class="card-subtitle">Ajuste os parâmetros e veja o impacto previsto pela IA</div></div>
        <div class="card-body">
          <div class="simulator-panel">
            <div class="simulator-slider">
              <label><span>Aumento de Alunos (%)</span><span id="sim-alunos-val">10%</span></label>
              <input type="range" min="0" max="30" value="10" id="sim-alunos" oninput="updateSimulator()">
            </div>
            <div class="simulator-slider">
              <label><span>Novas Escolas</span><span id="sim-escolas-val">2</span></label>
              <input type="range" min="0" max="10" value="2" id="sim-escolas" oninput="updateSimulator()">
            </div>
            <div class="simulator-slider">
              <label><span>Alteração de Cardápio (%)</span><span id="sim-cardapio-val">5%</span></label>
              <input type="range" min="0" max="20" value="5" id="sim-cardapio" oninput="updateSimulator()">
            </div>
            <div class="simulator-result" id="sim-results">
              <div class="sim-result-card"><div class="sim-result-value" style="color:var(--danger)" id="sim-consumo">+17%</div><div class="sim-result-label">Impacto no Consumo</div></div>
              <div class="sim-result-card"><div class="sim-result-value" style="color:var(--warning)" id="sim-financeiro">+R$ 306K</div><div class="sim-result-label">Impacto Financeiro Mensal</div></div>
              <div class="sim-result-card"><div class="sim-result-value" style="color:var(--primary)" id="sim-compra">+8.640 kg</div><div class="sim-result-label">Necessidade Adicional de Compra</div></div>
            </div>
          </div>
        </div>
      </div>
    `;
  
    setTimeout(() => {
      createChart('chart-ia-projecao', {
        type: 'line',
        data: {
          labels: ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          datasets: [
            { label: 'Previsão (kg)', data: [44100, 40300, 46500, 43200, 41600, 44800], borderColor: CHART_COLORS.blue, backgroundColor: CHART_COLORS.blueFill, fill: true, tension: 0.4, pointRadius: 4 },
            { label: 'Limite Superior', data: [47000, 43200, 49800, 46100, 44500, 47900], borderColor: 'rgba(21,101,192,0.3)', borderDash: [5, 5], fill: false, pointRadius: 0, tension: 0.4 },
            { label: 'Limite Inferior', data: [41200, 37400, 43200, 40300, 38700, 41700], borderColor: 'rgba(21,101,192,0.3)', borderDash: [5, 5], fill: false, pointRadius: 0, tension: 0.4 },
          ]
        },
        options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { ...CHART_DEFAULTS.plugins.legend, position: 'bottom' } } }
      });
    }, 100);
  };

  PAGE_RENDERERS.gestor_restricoes = (el) => PAGE_RENDERERS.nutricionista_restricoes(el);

  PAGE_RENDERERS.gestor_atas = (el) => {
    const atas = SharedState.getAtas2();
    const fmt = (v) => v ? new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL', maximumFractionDigits:0 }).format(v) : 'R$ 0';
    const badge = (s) => {
      const map = { Vigente:'tag-green', Encerrada:'tag-gray', Suspensa:'tag-red', 'Em Renovação':'tag-orange' };
      return `<span class="tag ${map[s]||'tag-blue'}">${s}</span>`;
    };
    const rows = atas.length ? atas.map(a => {
      const pct = a.valor_global ? Math.round(((a.valor_executado||0) / a.valor_global) * 100) : 0;
      const saldo = (a.valor_global||0) - (a.valor_executado||0);
      const numAta = a.numero || a.numero_ata || `ATA-${a.id}`;
  
      return `<tr style="cursor:pointer" onclick="window.abrirModalDetalhesAta('${a.id}')">
        <td><strong>${numAta}</strong><br><small class="text-secondary">${a.ano||'2026'} · ${a.modalidade||a.tipo||''}</small></td>
        <td>${(a.tipo||'').includes('AF') || (a.tipo||'').includes('Chamada') ? '🌾 Agricultura Familiar' : '🏢 Convencional/Pregão'}</td>
        <td>${a.fornecedor}</td>
        <td style="font-family:var(--font-mono)">${fmt(a.valor_global)}</td>
        <td style="font-family:var(--font-mono)">
          ${fmt(a.valor_executado)}
          <div class="progress-bar" style="margin-top:4px"><div class="progress-fill ${pct>80?'red':pct>50?'orange':'green'}" style="width:${pct}%"></div></div>
          <small class="text-secondary">${pct}% empenhado</small>
        </td>
        <td style="font-family:var(--font-mono);font-weight:700;color:${saldo <= 0 ? 'var(--danger)' : '#1565C0'}">${fmt(saldo)}</td>
        <td>${a.data_inicio ? a.data_inicio.slice(0,10) : '2026-01-15'} → ${a.data_fim ? a.data_fim.slice(0,10) : '2026-12-31'}</td>
        <td>${badge(a.status)}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.abrirModalDetalhesAta('${a.id}')">
            🔍 Gerenciar
          </button>
        </td>
      </tr>`;
    }).join('') : '<tr><td colspan="9" style="text-align:center;color:#94A3B8">Nenhuma ATA carregada. Execute supabase_schema_v3.sql no Supabase.</td></tr>';
    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div class="page-title">📋 Atas de Registro de Preços</div>
          <div class="page-subtitle">Gestão de ATAs · Chamada Pública e Pregão Eletrônico (Clique na linha para gerenciar)</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-primary" onclick="window.abrirModalNovaAta()">➕ Cadastrar Nova ATA</button>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${atas.length}</div><div class="kpi-label">Total de ATAs</div></div>
        <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${atas.filter(a=>a.status==='Vigente').length}</div><div class="kpi-label">ATAs Vigentes</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">💰</div><div class="kpi-value">${fmt(atas.reduce((s,a)=>s+(a.valor_global||0),0))}</div><div class="kpi-label">Valor Global Total</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">📊</div><div class="kpi-value">${fmt(atas.reduce((s,a)=>s+(a.valor_executado||0),0))}</div><div class="kpi-label">Total Executado</div></div>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="card-header"><strong>Atas Cadastradas</strong></div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr><th>Número/Ano</th><th>Tipo</th><th>Fornecedor</th><th>Valor Global</th><th>Executado</th><th>Saldo</th><th>Vigência</th><th>Status</th><th>Ação</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  };

  PAGE_RENDERERS.gestor_empenhos = (el) => {
    const empenhos = SharedState.getEmpenhos2();
    const fmt = (v) => v ? new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(v) : 'R$ 0,00';
    const badge = (s) => {
      const map = { Emitido:'tag-blue', Liquidado:'tag-green', Pago:'tag-green', Cancelado:'tag-red', 'Em Análise':'tag-orange' };
      return `<span class="tag ${map[s]||'tag-gray'}">${s}</span>`;
    };
    const rows = empenhos.length ? empenhos.map(e => {
      const numAta = e.ata_numero || '—';
      return `<tr style="cursor:pointer" onclick="window.abrirModalDetalhesEmpenho('${e.numero_empenho}')">
        <td><strong>${e.numero_empenho}</strong></td>
        <td>
          <button class="btn btn-sm btn-outline" style="padding:2px 8px;font-weight:700;color:var(--primary)" onclick="event.stopPropagation(); window.abrirModalDetalhesAta('${numAta}')">
            📋 ${numAta}
          </button>
        </td>
        <td>${e.tipo === 'AF' ? '🌾 AF' : '🏢 Conv.'}</td>
        <td>${e.fornecedor}</td>
        <td>${e.escola_name||'<em>SEMED Global</em>'}</td>
        <td style="font-family:var(--font-mono);font-weight:700">${fmt(e.valor_empenhado)}</td>
        <td style="font-family:var(--font-mono)">${fmt(e.valor_liquidado)}</td>
        <td style="font-family:var(--font-mono)">${fmt(e.valor_pago)}</td>
        <td>${e.data_empenho||''}</td>
        <td>${badge(e.status)}</td>
        <td>
          <button class="btn btn-sm btn-outline" onclick="event.stopPropagation(); window.abrirModalDetalhesEmpenho('${e.numero_empenho}')">
            🔍 Detalhes / OS
          </button>
        </td>
      </tr>`;
    }).join('') : '<tr><td colspan="11" style="text-align:center;color:#94A3B8">Nenhum empenho carregado.</td></tr>';
    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div class="page-title">💳 Empenhos SIAFI</div>
          <div class="page-subtitle">Controle de empenhos, liquidações, pagamentos e roteamento de Ordens de Serviço (OS)</div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-outline" onclick="window.abrirModalImportarNFeXML()">📥 Receber NF-e via XML</button>
          <button class="btn btn-primary" onclick="window.openNewEmpenhoModal()">➕ Emitir Novo Empenho SIAFI</button>
        </div>
      </div>
      <div class="kpi-grid">
        <div class="kpi-card blue"><div class="kpi-icon">📄</div><div class="kpi-value">${empenhos.length}</div><div class="kpi-label">Total de Empenhos</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">💰</div><div class="kpi-value">${fmt(empenhos.reduce((s,e)=>s+(e.valor_empenhado||0),0))}</div><div class="kpi-label">Total Empenhado</div></div>
        <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${fmt(empenhos.reduce((s,e)=>s+(e.valor_pago||0),0))}</div><div class="kpi-label">Total Pago</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">⏳</div><div class="kpi-value">${empenhos.filter(e=>e.status==='Emitido'||e.status==='Em Análise').length}</div><div class="kpi-label">Pendentes</div></div>
      </div>
      <div class="card" style="margin-top:16px">
        <div class="card-header"><strong>Empenhos SIAFI</strong></div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr><th>Número</th><th>ATA (Vinculada)</th><th>Tipo</th><th>Fornecedor</th><th>Escola</th><th>Empenhado</th><th>Liquidado</th><th>Pago</th><th>Data</th><th>Status</th><th>Ação</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </div>`;
  };

  // === Cross-perfil *_escolas (Fase 4.7): closure para cooperativa_escolas ===
  PAGE_RENDERERS.gestor_escolas = (el) => PAGE_RENDERERS.cooperativa_escolas(el);

  // ─── LIVRO DE OCORRÊNCIAS CONSOLIDADO (F15) ─────────────────────────────
  // Reúne num só lugar as ocorrências de TODOS os módulos: incidentes do
  // Motorista (getIncidents) + ocorrências logísticas do Estoque/Motorista
  // (getOcorrencias). Filtro por módulo. É a visão consolidada do Gestor.
  PAGE_RENDERERS.gestor_ocorrencias = (el) => {
    const incs = (SharedState.getIncidents && SharedState.getIncidents()) || [];
    const ocs  = (SharedState.getOcorrencias && SharedState.getOcorrencias()) || [];

    const norm = [
      ...incs.map(i => ({
        id: i.id || 'INC-' + Math.random().toString(36).substr(2, 5),
        data: i.criadoEm || i.data,
        perfil: 'motorista',
        perfilRotulo: '🚚 Motorista',
        tipo: i.tipo || i.type || 'Ocorrência de Transporte',
        unidade: i.escola || i.school || '—',
        autor: i.motorista || 'Motorista',
        descricao: i.descricao || i.desc || '',
        status: i.status || 'Pendente',
        placa: i.placaVeiculo || ''
      })),
      ...ocs.map(o => ({
        id: o.id || 'OC-' + Math.random().toString(36).substr(2, 5),
        data: o.criadoEm || o.data,
        perfil: o.perfil || o.modulo || 'estoque',
        perfilRotulo: o.perfil === 'motorista' || o.modulo === 'motorista' ? '🚚 Motorista' : (o.perfil === 'gestor' ? '👔 Gestor' : (o.perfil === 'escola' ? '🏫 Escola' : (o.perfil === 'nutricionista' ? '🥗 Nutrição' : '🏭 Estoque Central'))),
        tipo: o.tipo || 'Ocorrência',
        unidade: o.escola || o.escolaNome || 'Estoque Central',
        autor: o.autor || 'Operador',
        descricao: o.descricao || o.detalhes || o.motivo || '',
        status: o.status || 'Pendente',
        placa: o.placaVeiculo || ''
      })),
    ].sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0));

    const total = norm.length;
    const abertas = norm.filter(o => o.status === 'Pendente' || o.status === 'Aberta' || o.status === 'Em Análise').length;
    const resolvidas = norm.filter(o => o.status === 'Resolvido' || o.status === 'Fechada').length;

    const rows = norm.length ? norm.map(o => `
      <tr data-perfil="${o.perfil}">
        <td style="font-size:0.8rem;white-space:nowrap">${o.data ? new Date(o.data).toLocaleString('pt-BR') : '—'}</td>
        <td><span class="tag tag-blue">${o.perfilRotulo}</span></td>
        <td><strong>${o.tipo}</strong></td>
        <td>${o.unidade}${o.placa ? `<br><small class="text-secondary">🚛 ${o.placa}</small>` : ''}</td>
        <td><strong>${o.autor}</strong></td>
        <td style="font-size:0.82rem">${o.descricao}</td>
        <td><span class="status-badge ${o.status === 'Resolvido' || o.status === 'Fechada' ? 'status-ok' : 'status-danger'}">${o.status}</span></td>
      </tr>`).join('') : '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma ocorrência registrada na rede.</td></tr>';

    el.innerHTML = `
      <div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
        <div>
          <div class="page-title">⚠️ Livro de Ocorrências Geral da Rede</div>
          <div class="page-subtitle">Registro unificado e transparente — Estoque, Motorista, Escolas, Gestão e Nutrição</div>
        </div>
        <button class="btn btn-primary" onclick="window.abrirModalNovaOcorrencia()">➕ Registrar Ocorrência</button>
      </div>

      <div class="kpi-grid" style="margin-bottom:20px">
        <div class="kpi-card blue"><div class="kpi-icon">📚</div><div class="kpi-value">${total}</div><div class="kpi-label">Total de Ocorrências</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">🔴</div><div class="kpi-value">${abertas}</div><div class="kpi-label">Pendentes / Em Análise</div></div>
        <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${resolvidas}</div><div class="kpi-label">Resolvidas</div></div>
      </div>

      <div class="card">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
          <strong>Livro de Ocorrências Unificado</strong>
          <select class="form-control" style="width:auto" onchange="
            const v = this.value;
            document.querySelectorAll('#tbl-ocorrencias tr[data-perfil]').forEach(tr => {
              tr.style.display = (!v || tr.dataset.perfil === v) ? '' : 'none';
            });
          ">
            <option value="">Todos os perfis de origem</option>
            <option value="estoque">🏭 Estoque Central</option>
            <option value="motorista">🚚 Motorista</option>
            <option value="escola">🏫 Escola</option>
            <option value="gestor">👔 Gestor SEMED</option>
            <option value="nutricionista">🥗 Nutrição</option>
          </select>
        </div>
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr><th>Data/Hora</th><th>Perfil Origem</th><th>Tipo</th><th>Unidade / Local</th><th>Autor</th><th>Descrição</th><th>Status</th></tr></thead>
            <tbody id="tbl-ocorrencias">${rows}</tbody>
          </table>
        </div>
      </div>`;
  };

  PAGE_RENDERERS['estoque_ocorrencias'] = PAGE_RENDERERS['gestor_ocorrencias'];

})();
