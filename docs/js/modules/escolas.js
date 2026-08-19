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
  // ============================================================
  // MIGRADO DO app.js NA FASE 4.2 (movido, nao reescrito)
  // ============================================================
  // Versoes vigentes das telas da Escola. As definicoes rasas anteriores deste
  // modulo (nao registradas apos a Regra 6) foram descartadas. diretor_* e
  // resp_estoque_* reais seguem no app.js por ora; serao movidos num passo seguinte.

PAGE_RENDERERS.escola_escolas = (el) => {
  const sc = getCurrentSchool();
  const localStock = SharedState.getSchoolStock(sc.name);
  const consumo = SharedState.getConsumo(sc.name).slice(0, 8);
  const pedidos = SharedState.getOrders().filter(o => o.school === sc.name);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Minha Escola — ${sc.name}</div>
      <div class="page-subtitle">Visão consolidada da unidade · ${sc.region} · Diretor(a): ${sc.director}</div>
    </div>

    <div class="grid-2 mb-24">
      <div class="card">
        <div class="card-header"><div class="card-title">📇 Dados da Unidade</div></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.9rem">
            <div><strong>Nome:</strong><br>${sc.name}</div>
            <div><strong>Região:</strong><br>${sc.region}</div>
            <div><strong>Modalidade:</strong><br>${sc.modality || 'Escolar Urbana (Regular)'}</div>
            <div><strong>Diretor(a):</strong><br>${sc.director}</div>
            <div><strong>Alunos:</strong><br>${(sc.students || 0).toLocaleString('pt-BR')}</div>
            <div><strong>Frequência Média:</strong><br>${sc.attendance_avg || 0} (${sc.attendance_pct || 0}%)</div>
            <div><strong>Refeições/Dia:</strong><br>${sc.meals_per_day || 2}</div>
            <div><strong>Orçamento Mensal:</strong><br>${formatCurrency(sc.monthly_budget || 0)}</div>
            <div><strong>Última Entrega:</strong><br>${sc.lastDelivery ? formatDate(sc.lastDelivery) : '—'}</div>
            <div><strong>Estoque Atual:</strong><br><span class="status-badge ${statusClass(sc.stockStatus)}">${statusLabel(sc.stockStatus)}</span></div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📊 Indicadores em Tempo Real</div></div>
        <div class="card-body">
          <div class="kpi-grid" style="grid-template-columns:1fr 1fr;gap:12px">
            <div class="kpi-card blue" style="padding:12px"><div class="kpi-icon">📦</div><div class="kpi-value" style="font-size:1.4rem">${localStock.length}</div><div class="kpi-label">Produtos em Estoque</div></div>
            <div class="kpi-card green" style="padding:12px"><div class="kpi-icon">📝</div><div class="kpi-value" style="font-size:1.4rem">${SharedState.getConsumo(sc.name).length}</div><div class="kpi-label">Consumos Registrados</div></div>
            <div class="kpi-card orange" style="padding:12px"><div class="kpi-icon">🛒</div><div class="kpi-value" style="font-size:1.4rem">${pedidos.length}</div><div class="kpi-label">Pedidos Totais</div></div>
            <div class="kpi-card teal" style="padding:12px"><div class="kpi-icon">🚚</div><div class="kpi-value" style="font-size:1.4rem">${pedidos.filter(o=>o.status==='Entregue').length}</div><div class="kpi-label">Entregas Recebidas</div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-16">
      <div class="card-header"><div class="card-title">🚀 Acesso Rápido</div></div>
      <div class="card-body" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
        <button class="btn btn-outline" onclick="navigateTo('escola','estoque')">📦 Ver Estoque Detalhado</button>
        <button class="btn btn-outline" onclick="navigateTo('escola','consumo')">📝 Registrar Consumo</button>
        <button class="btn btn-outline" onclick="navigateTo('escola','pedidos')">🛒 Solicitar Pedido</button>
        <button class="btn btn-outline" onclick="navigateTo('escola','entregas')">🚚 Confirmar Entregas</button>
      </div>
    </div>
  `;
};

PAGE_RENDERERS.escola_dashboard = (el) => {
  const sc = getCurrentSchool();
  const att = sc.attendance_avg || 572;
  const attPct = sc.attendance_pct || 92;
  const students = sc.students || 620;
  const absent = students - att;
  const products = (typeof DATA !== 'undefined' && DATA.products) ? DATA.products : [];
  const critical = products.filter(p => (p.days_left || p.daysLeft || 99) <= 3).length;
  const orders = (typeof DATA !== 'undefined' && DATA.orders) ? DATA.orders : [];
  const pending = orders.filter(o => o.status === 'Pendente').length;
  const budget = sc.monthly_budget || 18500;
  const consumed = Math.round(att * (sc.meals_per_day || 2) * 0.3);
  const sparkVals = [89,90,95,87,93,90,92,89,92,91,93,90,92,92];

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Dashboard — ${sc.name}</div>
        <div class="page-subtitle">${sc.grade_levels || 'EF I + EF II'} u00b7 ${sc.region || ''} u00b7 Diretor(a): ${sc.director || ''}</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost btn-sm" onclick="navigateTo('escola','consumo')">📝 Registrar Consumo</button>
        <button class="btn btn-primary btn-sm" onclick="navigateTo('escola','pedidos')">🛒 Novo Pedido</button>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(6,1fr);margin-bottom:24px">
      <div class="kpi-card blue"><div class="kpi-icon">👨‍🎓</div><div class="kpi-value">${students.toLocaleString('pt-BR')}</div><div class="kpi-label">Matriculados</div></div>
      <div class="kpi-card green" style="position:relative">
        <div class="kpi-icon">📅</div><div class="kpi-value">${att.toLocaleString('pt-BR')}</div><div class="kpi-label">Presentes Hoje</div>
        <div style="position:absolute;top:10px;right:12px;font-size:0.72rem;font-weight:700;background:#e8f5e9;color:#2E7D32;padding:2px 8px;border-radius:20px">${attPct}%</div>
      </div>
      <div class="kpi-card orange"><div class="kpi-icon">🏠</div><div class="kpi-value">${absent}</div><div class="kpi-label">Ausentes Hoje</div></div>
      <div class="kpi-card red"><div class="kpi-icon">⚠️</div><div class="kpi-value">${critical}</div><div class="kpi-label">Est. Crticos</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🛒</div><div class="kpi-value">${pending}</div><div class="kpi-label">Pedidos Pend.</div></div>
      <div class="kpi-card purple"><div class="kpi-icon">📊</div><div class="kpi-value">${consumed} kg</div><div class="kpi-label">Consumo/Dia Est.</div></div>
    </div>

    <div class="grid-2-1">
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📈 Frequência Escolar — Últimas 2 Semanas</div>
            <span class="status-badge ${attPct >= 90 ? 'status-ok' : attPct >= 80 ? 'status-warning' : 'status-danger'}">${attPct >= 90 ? 'Ótima' : attPct >= 80 ? 'Regular' : 'Atenção'}</span>
          </div>
          <div class="card-body">
            <div style="display:flex;align-items:center;gap:24px;margin-bottom:16px">
              <div style="text-align:center;min-width:120px">
                <div style="font-size:2.4rem;font-weight:800;color:var(--primary)">${attPct}%</div>
                <div style="font-size:0.78rem;color:var(--text-secondary)">Média de Frequência</div>
                <div style="font-size:0.78rem;color:var(--text-secondary)">${att} de ${students} alunos</div>
              </div>
              <div style="flex:1;display:flex;align-items:flex-end;gap:4px;height:56px">
                ${sparkVals.map(v => `<div style="flex:1;background:${v>=90?'var(--primary)':v>=85?'var(--warning)':'var(--danger)'};border-radius:3px 3px 0 0;height:${Math.round((v-82)*8)}px;opacity:0.8"></div>`).join('')}
              </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;font-size:0.7rem;color:var(--text-secondary);text-align:center">
              ${[['05/06',89],['06',90],['09',95],['10',87],['11',93],['12',90],['13',92],['16',89],['17',92],['18',91],['19',93],['20',90],['23',92],['24',92]].map(([d,v]) => `<div><div style="font-weight:600">${v}%</div><div>${d}</div></div>`).join('')}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">🚨 Alertas do Dia</div></div>
          <div class="card-body">
            <div class="alert-list">
              ${critical > 0 ? `<div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>${critical} produto(s)</strong> com estoque crítico — <a href="#" onclick="navigateTo('escola','estoque');return false" style="color:var(--danger)">ver estoque</a></div></div>` : ''}
              ${pending > 0 ? `<div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>${pending} pedido(s)</strong> pendente(s) — <a href="#" onclick="navigateTo('escola','pedidos');return false">ver pedidos</a></div></div>` : ''}
              <div class="alert-item info"><span class="alert-icon">🚚</span><div class="alert-text">Entrega prevista para <strong>amanhã</strong> — COOPAGRAN</div></div>
              ${attPct >= 90 ? `<div class="alert-item" style="background:#e8f5e9;border-left:4px solid #2E7D32;padding:10px 12px;border-radius:0 4px 4px 0;margin-bottom:8px"><span class="alert-icon">✅</span><div class="alert-text">Frequência dentro da meta (<strong>${attPct}%</strong>)</div></div>` : `<div class="alert-item warning"><span class="alert-icon">📅</span><div class="alert-text">Frequência <strong>abaixo de 90%</strong> — verificar</div></div>`}
            </div>
          </div>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="ia-card">
          <div class="ia-card-title">🤖 Sugestão IA</div>
          <div class="ia-suggestion">📦 Com <strong>${att} presentes</strong> e ${sc.meals_per_day||2} refeições/dia — consumo estimado: <strong>${consumed} kg</strong>.</div>
          <div class="ia-suggestion">🛒 Estoque crítico: pedido emergencial recomendado.</div>
          <div style="margin-top:10px"><button class="btn btn-sm" style="background:rgba(255,255,255,0.2);color:white;width:100%" onclick="navigateTo('escola','pedidos')">Criar Pedido →</button></div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">💰 Orçamento Mensal</div></div>
          <div class="card-body">
            <div style="font-size:1.8rem;font-weight:700;color:var(--primary)">R$ ${Math.round(budget*0.55).toLocaleString('pt-BR')}</div>
            <div style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:8px">de R$ ${budget.toLocaleString('pt-BR')} — 55% executado</div>
            <div style="background:var(--border);border-radius:4px;height:8px"><div style="width:55%;height:100%;background:var(--primary);border-radius:4px"></div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">⚡ Acesso Rápido</div></div>
          <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <button class="btn btn-ghost" onclick="navigateTo('escola','consumo')" style="font-size:0.8rem">📝 Consumo</button>
            <button class="btn btn-ghost" onclick="navigateTo('escola','estoque')" style="font-size:0.8rem">📦 Estoque</button>
            <button class="btn btn-ghost" onclick="navigateTo('escola','cardapios')" style="font-size:0.8rem">🍽️ Cardápio</button>
            <button class="btn btn-ghost" onclick="navigateTo('escola','historico')" style="font-size:0.8rem">📋 Histórico</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

// ─── ESCOLA: PLANEJAMENTO ───
PAGE_RENDERERS.escola_planejamento = (el) => {
  const sc = getCurrentSchool();
  const dias = ['Seg','Ter','Qua','Qui','Sex'];
  const allWeekly = SharedState.getWeeklyMenus();
  // Filtra cardápios vinculados a esta escola (ou "Toda a Rede")
  const weeklyPublicados = allWeekly.filter(w => !w.escolasVinculadas || w.escolasVinculadas.length === 0 || w.escolasVinculadas.includes(sc.name));
  const cardapioAtivo = weeklyPublicados[0]; // Mais recente

  // Calcula necessidade semanal a partir do cardápio ativo, se houver
  const alunos = sc.attendance_avg || 572;
  const necessidade = computeSchoolNecessity(cardapioAtivo, alunos);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Planejamento Alimentar — ${sc.name}</div>
      <div class="page-subtitle">${cardapioAtivo ? 'Cardápio ativo: ' + (cardapioAtivo.nome || 'Semanal') : 'Cardápio semanal aprovado pelo Nutricionista'}</div>
    </div>

    ${weeklyPublicados.length > 0 ? `
    <div class="card mb-16" style="border-left:4px solid var(--primary)">
      <div class="card-header"><div class="card-title">🆕 Cardápios Vinculados a esta Escola</div><span class="status-badge status-ok">${weeklyPublicados.length}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table"><thead><tr><th>Cardápio</th><th>Período</th><th>Autor</th><th>Publicado em</th><th>Kcal/Dia</th></tr></thead><tbody>
          ${weeklyPublicados.slice(0, 5).map(w => `
            <tr>
              <td><strong>${w.nome || 'Cardápio Semanal'}</strong></td>
              <td>${w.periodo || '—'}</td>
              <td style="font-size:0.82rem">${w.autor || '—'}</td>
              <td style="font-size:0.82rem">${new Date(w.publicadoEm).toLocaleString('pt-BR')}</td>
              <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${w.kcalMedia || '—'}</td>
            </tr>
          `).join('')}
        </tbody></table>
      </div>
    </div>` : ''}

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">👨‍🎓</div><div class="kpi-value">${alunos}</div><div class="kpi-label">Alunos p/ Refeição</div></div>
      <div class="kpi-card green"><div class="kpi-icon">🍽️</div><div class="kpi-value">${sc.meals_per_day||2}</div><div class="kpi-label">Refeições/Dia</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">📅</div><div class="kpi-value">5</div><div class="kpi-label">Dias Letivos/Sem.</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">💰</div><div class="kpi-value">R$ 1,06</div><div class="kpi-label">Per Capita/Refeição</div></div>
    </div>

    ${cardapioAtivo && cardapioAtivo.refeicoes && cardapioAtivo.refeicoes.length > 0 ? `
    <div class="card">
      <div class="card-header"><div class="card-title">📅 Cardápio Ativo — ${cardapioAtivo.periodo}</div><span class="status-badge status-ok">✓ Publicado</span></div>
      <div class="card-body" style="padding:0;overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Dia</th><th>Café da Manhã</th><th>Almoço</th><th>Lanche</th><th>Total Kcal</th></tr></thead>
          <tbody>
            ${renderMenuByDay(cardapioAtivo.refeicoes)}
          </tbody>
        </table>
      </div>
    </div>` : `
    <div class="card">
      <div class="card-header"><div class="card-title">📅 Cardápio — Semana Padrão</div><span class="status-badge status-info">Modelo Referência</span></div>
      <div class="card-body" style="padding:0;overflow-x:auto">
        <table class="data-table">
          <thead><tr><th style="width:130px">Refeição</th>${dias.map(d=>`<th style="text-align:center">${d}</th>`).join('')}</tr></thead>
          <tbody>
            <tr><td><strong>☀️ Lanche</strong></td>${['Vitamina de Banana','Pão c/ Manteiga','Mingau de Aveia','Vitamina de Banana','Pão c/ Queijo'].map(m=>`<td style="text-align:center;font-size:0.82rem">${m}</td>`).join('')}</tr>
            <tr><td><strong>🍽️ Almoço</strong></td>${['Arroz, Feijão, Frango','Macarrão c/ Carne','Arroz, Feijão, Peixe','Arroz, Feijão, Ovo','Sopa de Legumes'].map(m=>`<td style="text-align:center;font-size:0.82rem">${m}</td>`).join('')}</tr>
          </tbody>
        </table>
      </div>
    </div>`}

    <div class="card" style="margin-top:16px">
      <div class="card-header">
        <div class="card-title">📦 Necessidade Semanal ${cardapioAtivo ? '(calculada do cardápio ativo)' : '(estimada)'}</div>
        ${cardapioAtivo ? '<span class="status-badge status-ok">Automático</span>' : ''}
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
          ${necessidade.map(n => `
            <div style="background:var(--surface-1);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px">
              <div style="font-weight:600;font-size:0.85rem">${n.produto}</div>
              <div style="font-size:1.3rem;font-weight:700;color:var(--primary);margin-top:4px">${n.qtd} ${n.unidade}</div>
              <div style="font-size:0.72rem;color:var(--text-tertiary);margin-top:4px">${n.motivo}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
};

// Helpers do cardápio semanal
function renderMenuByDay(refeicoes) {
  // Agrupa por dia
  const byDia = {};
  refeicoes.forEach(r => {
    byDia[r.dia] = byDia[r.dia] || { 'Café da Manhã':'', 'Almoço':'', 'Lanche':'', kcal: 0 };
    byDia[r.dia][r.tipo] = r.item;
    byDia[r.dia].kcal += r.kcal || 0;
  });
  return Object.keys(byDia).map(d => `
    <tr>
      <td><strong>${d}</strong></td>
      <td style="font-size:0.82rem">${byDia[d]['Café da Manhã'] || '—'}</td>
      <td style="font-size:0.82rem">${byDia[d]['Almoço'] || '—'}</td>
      <td style="font-size:0.82rem">${byDia[d]['Lanche'] || '—'}</td>
      <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${byDia[d].kcal} kcal</td>
    </tr>
  `).join('');
}

function computeSchoolNecessity(cardapio, alunos) {
  // Se não tem cardápio, fallback estimado
  if (!cardapio || !cardapio.refeicoes || cardapio.refeicoes.length === 0) {
    return [
      { produto: 'Arroz Tipo 1', qtd: Math.round(alunos * 0.12 * 5), unidade: 'kg', motivo: 'Estimado (média histórica)' },
      { produto: 'Feijão Carioca', qtd: Math.round(alunos * 0.05 * 5), unidade: 'kg', motivo: 'Estimado' },
      { produto: 'Frango', qtd: Math.round(alunos * 0.10 * 3), unidade: 'kg', motivo: 'Estimado' },
      { produto: 'Banana Nanica', qtd: Math.round(alunos * 0.07 * 5), unidade: 'kg', motivo: 'Estimado' },
      { produto: 'Leite Integral', qtd: Math.round(alunos * 0.15 * 5), unidade: 'L', motivo: 'Estimado' },
      { produto: 'Tomate', qtd: Math.round(alunos * 0.03 * 5), unidade: 'kg', motivo: 'Estimado' },
      { produto: 'Cenoura', qtd: Math.round(alunos * 0.04 * 5), unidade: 'kg', motivo: 'Estimado' },
      { produto: 'Mandioca', qtd: Math.round(alunos * 0.05 * 5), unidade: 'kg', motivo: 'Estimado' },
    ];
  }
  // Calcula a partir das refeições — extrai ingredientes por palavras-chave
  const INGRED_MAP = {
    'arroz': { produto: 'Arroz Tipo 1', porPessoa: 0.08, unidade: 'kg' },
    'feijão': { produto: 'Feijão Carioca', porPessoa: 0.04, unidade: 'kg' },
    'feijao': { produto: 'Feijão Carioca', porPessoa: 0.04, unidade: 'kg' },
    'frango': { produto: 'Frango', porPessoa: 0.10, unidade: 'kg' },
    'peixe': { produto: 'Peixe', porPessoa: 0.10, unidade: 'kg' },
    'ovo': { produto: 'Ovo de Galinha', porPessoa: 1, unidade: 'un' },
    'banana': { produto: 'Banana Nanica', porPessoa: 0.10, unidade: 'kg' },
    'leite': { produto: 'Leite Integral', porPessoa: 0.20, unidade: 'L' },
    'pão': { produto: 'Pão', porPessoa: 0.08, unidade: 'kg' },
    'pao': { produto: 'Pão', porPessoa: 0.08, unidade: 'kg' },
    'aveia': { produto: 'Aveia', porPessoa: 0.03, unidade: 'kg' },
    'queijo': { produto: 'Queijo', porPessoa: 0.03, unidade: 'kg' },
    'carne': { produto: 'Carne Bovina', porPessoa: 0.10, unidade: 'kg' },
    'macarrão': { produto: 'Macarrão', porPessoa: 0.08, unidade: 'kg' },
    'macarrao': { produto: 'Macarrão', porPessoa: 0.08, unidade: 'kg' },
    'tomate': { produto: 'Tomate', porPessoa: 0.04, unidade: 'kg' },
    'cenoura': { produto: 'Cenoura', porPessoa: 0.03, unidade: 'kg' },
    'alface': { produto: 'Alface', porPessoa: 0.05, unidade: 'kg' },
  };
  const acc = {};
  cardapio.refeicoes.forEach(r => {
    const text = (r.item || '').toLowerCase();
    Object.entries(INGRED_MAP).forEach(([kw, info]) => {
      if (text.includes(kw)) {
        acc[info.produto] = acc[info.produto] || { produto: info.produto, qtd: 0, unidade: info.unidade, motivo: 'Cardápio: ' + (r.dia || '') };
        acc[info.produto].qtd += info.porPessoa * alunos;
      }
    });
  });
  const list = Object.values(acc).map(x => ({ ...x, qtd: Math.round(x.qtd) })).filter(x => x.qtd > 0);
  return list.length > 0 ? list.slice(0, 12) : computeSchoolNecessity(null, alunos);
}

PAGE_RENDERERS.escola_cardapios = (el) => { PAGE_RENDERERS.nutricionista_cardapios(el); };

// ─── ESCOLA: ESTOQUE ───
PAGE_RENDERERS.escola_estoque = (el) => {
  const sc = getCurrentSchool();
  const products = (typeof DATA !== 'undefined' && DATA.products) ? DATA.products : [];
  const localStock = SharedState.getSchoolStock(sc.name);
  const stockAdjust = SharedState.getStockAdjust().filter(a => a.escola === sc.name).slice(0, 8);

  // Combina: para cada produto da escola, calcula quantidade real (SharedState) + dias restantes
  const rows = products.map(p => {
    const local = localStock.find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20); // fallback estimado
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    const daysLeft = avgDay > 0 ? Math.round(qty / avgDay) : 999;
    return { name: p.name, category: p.category, unit: p.unit, qty, daysLeft, unidade: local?.unidade || p.unit, isReal: !!local };
  });
  const critical = rows.filter(r => r.daysLeft <= 3).length;
  const warning = rows.filter(r => r.daysLeft > 3 && r.daysLeft <= 7).length;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Estoque — ${sc.name}</div>
      <div class="page-subtitle">Estoque físico local · atualizado automaticamente por entregas e consumo</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${rows.length}</div><div class="kpi-label">Produtos</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${rows.length-critical-warning}</div><div class="kpi-label">Normal</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚡</div><div class="kpi-value">${warning}</div><div class="kpi-label">Atenção</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${critical}</div><div class="kpi-label">Crítico</div></div>
    </div>
    <div class="card mb-16">
      <div class="card-header">
        <div class="card-title">Produtos em Estoque</div>
        <button class="btn btn-primary btn-sm" onclick="navigateTo('escola','pedidos')">🛒 Solicitar Reposição</button>
      </div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Categoria</th><th style="text-align:right">Qtd. Escola</th><th>Un.</th><th style="text-align:right">Dias Restantes</th><th>Status</th></tr></thead>
          <tbody>
            ${rows.map(r => {
              const [cls, label] = r.daysLeft<=3 ? ['status-danger','Crítico'] : r.daysLeft<=7 ? ['status-warning','Atenção'] : ['status-ok','Normal'];
              return `<tr>
                <td><strong>${r.name}</strong>${r.isReal ? ' <span class="tag tag-blue" style="font-size:0.65rem">REAL</span>' : ''}</td>
                <td><span class="status-badge status-info" style="font-size:0.72rem">${r.category||'—'}</span></td>
                <td style="text-align:right;font-family:var(--font-mono)">${r.qty.toLocaleString('pt-BR')}</td>
                <td>${r.unidade || 'kg'}</td>
                <td style="text-align:right;font-weight:700;color:${r.daysLeft<=3?'var(--danger)':r.daysLeft<=7?'var(--warning)':'var(--success)'}">${r.daysLeft}d</td>
                <td><span class="status-badge ${cls}">${label}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    ${stockAdjust.length > 0 ? `
    <div class="card">
      <div class="card-header"><div class="card-title">📋 Últimas Movimentações</div><span class="status-badge status-info">${stockAdjust.length}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Data</th><th>Produto</th><th>Movimentação</th><th>Motivo</th></tr></thead>
          <tbody>
            ${stockAdjust.map(a => `
              <tr>
                <td style="font-size:0.82rem">${new Date(a.criadoEm).toLocaleString('pt-BR')}</td>
                <td><strong>${a.produto}</strong></td>
                <td style="font-family:var(--font-mono);font-weight:700;color:${a.delta > 0 ? 'var(--success)' : 'var(--danger)'}">${a.delta > 0 ? '+' : ''}${a.delta} ${a.unidade || ''}</td>
                <td style="font-size:0.82rem">${a.motivo}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}`;
};

// ─── ESCOLA: CONSUMO ───
PAGE_RENDERERS.escola_consumo = (el) => {
  const sc = getCurrentSchool();
  const products = (typeof DATA !== 'undefined' && DATA.products) ? DATA.products : [];
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Registro de Consumo — ${sc.name}</div>
      <div class="page-subtitle">Lançamento diário de consumo por refeição</div>
    </div>
    <div class="grid-2-1">
      <div>
        <div class="card mb-16">
          <div class="card-header"><div class="card-title">📝 Novo Registro</div></div>
          <div class="card-body">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px">
              <div><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Data</label>
                <input type="date" id="cons-date" value="2026-06-24" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem"></div>
              <div><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Refeição</label>
                <select id="cons-meal" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem">
                  <option>Lanche Manhã</option><option selected>Almoço</option><option>Lanche Tarde</option></select></div>
            </div>
            <div style="display:grid;grid-template-columns:2fr 1fr 80px;gap:12px;margin-bottom:12px">
              <div><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Produto</label>
                <select id="cons-product" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem">
                  ${products.map(p=>`<option>${p.name}</option>`).join('')}</select></div>
              <div><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Quantidade</label>
                <input type="number" id="cons-qty" placeholder="0" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem"></div>
              <div><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Un.</label>
                <select id="cons-unit" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem"><option>kg</option><option>L</option><option>dz</option></select></div>
            </div>
            <div style="margin-bottom:12px"><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Responsável</label>
              <input type="text" id="cons-resp" value="${sc.director||'Maria Santos'}" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem"></div>
            <button class="btn btn-primary" style="width:100%" id="btn-save-cons">✅ Registrar Consumo</button>
            <div id="cons-feedback" style="margin-top:8px;font-size:0.85rem;display:none"></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Registros Recentes</div>${SharedState.getConsumo(sc.name).length ? '<span class="status-badge status-ok">'+SharedState.getConsumo(sc.name).length+' registros</span>' : ''}</div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Data</th><th>Refeição</th><th>Produto</th><th style="text-align:right">Qtd</th><th>Responsável</th></tr></thead>
              <tbody>
                ${SharedState.getConsumo(sc.name).slice(0, 6).map(c => `
                  <tr>
                    <td style="font-size:0.82rem">${c.data || c.criadoEm?.slice(0,10) || '—'}</td>
                    <td>${c.refeicao || '—'}</td>
                    <td><strong>${c.produto}</strong> <span class="tag tag-blue" style="font-size:0.65rem">NOVO</span></td>
                    <td style="text-align:right;font-family:var(--font-mono)">${c.qtd} ${c.unidade || ''}</td>
                    <td>${c.responsavel || '—'}</td>
                  </tr>
                `).join('')}
                <tr><td>24/06</td><td>Almoço</td><td>Arroz Tipo 1</td><td style="text-align:right">42 kg</td><td>${sc.director||'Maria Santos'}</td></tr>
                <tr><td>24/06</td><td>Almoço</td><td>Feijão Carioca</td><td style="text-align:right">18 kg</td><td>${sc.director||'Maria Santos'}</td></tr>
                <tr><td>24/06</td><td>Lanche</td><td>Banana Nanica</td><td style="text-align:right">25 kg</td><td>Ana Costa</td></tr>
                <tr><td>23/06</td><td>Almoço</td><td>Frango</td><td style="text-align:right">35 kg</td><td>${sc.director||'Maria Santos'}</td></tr>
                <tr><td>23/06</td><td>Lanche</td><td>Leite Integral</td><td style="text-align:right">48 L</td><td>Ana Costa</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📊 Resumo — Jun/2026</div></div>
        <div class="card-body">
          ${[['Arroz Tipo 1','875 kg',88],['Feijão Carioca','375 kg',75],['Frango','490 kg',92],['Banana Nanica','350 kg',60],['Leite Integral','672 L',85],['Tomate','168 kg',70]].map(([n,q,pct])=>`
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:4px"><span><strong>${n}</strong></span><span style="color:var(--text-secondary)">${q}</span></div>
              <div style="background:var(--border);border-radius:4px;height:6px"><div style="width:${pct}%;height:100%;background:var(--primary);border-radius:4px"></div></div>
            </div>`).join('')}
          <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border);font-size:0.82rem">
            <div style="display:flex;justify-content:space-between"><span style="color:var(--text-secondary)">Total consumido:</span><span style="font-weight:700">1.240 kg</span></div>
            <div style="display:flex;justify-content:space-between;margin-top:4px"><span style="color:var(--text-secondary)">Dias registrados:</span><span style="font-weight:700">18 dias</span></div>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById('btn-save-cons')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-save-cons');
    const fb = document.getElementById('cons-feedback');
    const qty = parseFloat(document.getElementById('cons-qty')?.value || 0);
    if (!qty) { fb.style.display='block'; fb.innerHTML='<span style="color:var(--danger)">⚠️ Informe a quantidade.</span>'; return; }
    btn.disabled=true; btn.textContent='Salvando...';

    const produto = document.getElementById('cons-product')?.value;
    const unidade = document.getElementById('cons-unit')?.value;

    // 🔗 Grava no SharedState — decrementa estoque local automaticamente
    SharedState.addConsumo({
      escola: sc.name, produto, qtd: qty, unidade,
      refeicao: document.getElementById('cons-meal')?.value,
      data: document.getElementById('cons-date')?.value,
      responsavel: document.getElementById('cons-resp')?.value,
    });

    // Tenta gravar no Supabase (best-effort)
    try {
      if (typeof _sb !== 'undefined') {
        await _sb.from('consumption_records').insert([{
          school: sc.name, product_name: produto,
          meal_type: document.getElementById('cons-meal')?.value, quantity: qty, unit: unidade,
          date: document.getElementById('cons-date')?.value,
          responsible: document.getElementById('cons-resp')?.value,
        }]);
      }
    } catch(e) { /* silencia — SharedState garante persistência local */ }

    fb.style.display='block';
    fb.innerHTML='<span style="color:var(--success)">✅ Consumo registrado! Estoque local decrementado automaticamente.</span>';
    document.getElementById('cons-qty').value='';
    showToast('📝 Consumo de ' + qty + ' ' + unidade + ' de ' + produto + ' registrado.');
    btn.disabled=false; btn.textContent='✅ Registrar Consumo';
    setTimeout(() => PAGE_RENDERERS.escola_consumo(document.getElementById('page-content')), 900);
  });
};

// ─── ESCOLA: PEDIDOS ───
PAGE_RENDERERS.escola_pedidos = (el) => {
  const sc = getCurrentSchool();
  const products = (typeof DATA !== 'undefined' && DATA.products) ? DATA.products : [];
  const coops = (typeof DATA !== 'undefined' && DATA.cooperatives) ? DATA.cooperatives : [{name:'COOPAGRAN'},{name:'COOPRAN'},{name:'COOPAERGS'}];
  const orders = (typeof DATA !== 'undefined' && DATA.orders) ? DATA.orders : [];
  const sharedOrders = SharedState.getOrders().filter(o => o.school === sc.name);
  const suggest = products.filter(p=>(p.days_left||99)<=3).slice(0,3);
  const topSuggest = suggest.length > 0 ? suggest : products.slice(0,3);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Pedidos de Abastecimento — ${sc.name}</div>
      <div class="page-subtitle">Solicitar e acompanhar pedidos de reposição</div>
    </div>
    <div class="ia-card mb-24">
      <div class="ia-card-title">🤖 Sugestão Inteligente <span class="ia-badge">AUTO</span></div>
      <div class="ia-suggestion">Com <strong>${sc.attendance_avg||572} alunos</strong> (${sc.attendance_pct||92}% frequência) e cardápio vigente, o sistema sugere:</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px">
        ${topSuggest.map(p=>`<div class="ia-suggestion"><strong>${p.name}</strong><br><span style="font-size:0.8rem">${Math.round((sc.attendance_avg||572)*0.1)} ${p.unit||'kg'}</span></div>`).join('')}
      </div>
      <button class="btn btn-sm" style="background:rgba(255,255,255,0.25);color:white;margin-top:12px;width:100%" onclick="document.getElementById('form-pedido').scrollIntoView({behavior:'smooth'})">Confirmar e Enviar Pedido →</button>
    </div>
    <div class="grid-2-1">
      <div class="card" id="form-pedido">
        <div class="card-header"><div class="card-title">➕ Novo Pedido</div></div>
        <div class="card-body">
          <div style="margin-bottom:12px"><label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:4px">Cooperativa</label>
            <select id="ped-coop" style="width:100%;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem">
              ${coops.map(c=>`<option>${c.name}</option>`).join('')}</select></div>
          <div id="ped-items" style="margin-bottom:8px">
            <label style="font-size:0.82rem;font-weight:600;display:block;margin-bottom:8px">Itens do Pedido</label>
            <div class="ped-row" style="display:grid;grid-template-columns:2fr 1fr 80px;gap:8px;margin-bottom:8px">
              <select style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem">${products.map(p=>`<option>${p.name}</option>`).join('')}</select>
              <input type="number" placeholder="Qtd" style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem">
              <select style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem"><option>kg</option><option>L</option><option>dz</option></select>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" id="btn-add-item">➕ Adicionar Item</button>
          <button class="btn btn-primary" style="width:100%;margin-top:12px" id="btn-send-ped">📤 Enviar Pedido</button>
          <div id="ped-feedback" style="margin-top:8px;font-size:0.85rem;display:none"></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📋 Histórico</div><span class="status-badge status-info">${sharedOrders.length + orders.length} pedidos</span></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>#</th><th>Data</th><th>Cooperativa</th><th>Valor</th><th>Status</th></tr></thead>
            <tbody>
              ${sharedOrders.map(o=>`<tr>
                <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(o.numero).padStart(3,'0')} <span class="tag tag-blue" style="font-size:0.65rem;margin-left:4px">NOVO</span></td>
                <td>${o.date}</td>
                <td>${o.cooperative||'—'}</td>
                <td style="font-family:var(--font-mono)">R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
                <td><span class="status-badge ${o.status==='Entregue'?'status-ok':o.status==='Pendente'?'status-danger':'status-warning'}">${o.status}</span></td>
              </tr>`).join('')}
              ${orders.slice(0,4).map((o,i)=>`<tr><td>#${String(i+3).padStart(3,'0')}</td><td>${o.date||'—'}</td><td>${o.cooperative||'—'}</td><td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td><td><span class="status-badge ${o.status==='Entregue'?'status-ok':o.status==='Pendente'?'status-danger':'status-warning'}">${o.status||'—'}</span></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;

  document.getElementById('btn-add-item')?.addEventListener('click', () => {
    const row=document.createElement('div'); row.className='ped-row';
    row.style.cssText='display:grid;grid-template-columns:2fr 1fr 80px;gap:8px;margin-bottom:8px';
    row.innerHTML=`<select style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem">${products.map(p=>`<option>${p.name}</option>`).join('')}</select><input type="number" placeholder="Qtd" style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem"><select style="padding:7px 10px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem"><option>kg</option><option>L</option><option>dz</option></select>`;
    document.getElementById('ped-items')?.appendChild(row);
  });

  document.getElementById('btn-send-ped')?.addEventListener('click', async () => {
    const btn=document.getElementById('btn-send-ped'), fb=document.getElementById('ped-feedback');
    const coopSel = document.getElementById('ped-coop')?.value || 'COOPAGRAN';

    // Coleta itens do formulário
    const itens = [];
    document.querySelectorAll('#ped-items .ped-row').forEach(row => {
      const inputs = row.querySelectorAll('select, input');
      const produto = inputs[0]?.value;
      const qtd = parseFloat(inputs[1]?.value || 0);
      const unidade = inputs[2]?.value;
      if (produto && qtd > 0) itens.push({ produto, qtd, unidade });
    });
    if (itens.length === 0) {
      fb.style.display='block';
      fb.innerHTML='<span style="color:var(--warning)">⚠️ Informe ao menos um item com quantidade.</span>';
      return;
    }

    btn.disabled=true; btn.textContent='Enviando...';
    // Estimativa de valor: R$ 12/kg médio
    const value = Math.round(itens.reduce((s,i) => s + i.qtd * 12, 0));

    // Grava no SharedState — visível na cooperativa, agricultor, gestor, almoxarifado
    const newOrder = SharedState.addOrder({
      school: sc.name,
      cooperative: coopSel,
      itens,
      value,
    });

    // Tenta gravar também no Supabase (best-effort)
    try {
      if (typeof _sb !== 'undefined') {
        const { error } = await _sb.from('orders').insert([{
          school_name: sc.name,
          school_id: sc.id,
          items: itens,
          status: 'Pendente',
          cooperative: coopSel,
          total_value: value,
          date: newOrder.date
        }]);
        if (error) console.warn('Supabase insert orders notice:', error.message);
      }
    } catch(err) { 
      console.warn('Supabase insert orders exception:', err);
    }

    fb.style.display='block';
    fb.innerHTML = `<span style="color:var(--success)">✅ Pedido <strong>#${String(newOrder.numero).padStart(3,'0')}</strong> enviado! Já visível para <strong>${coopSel}</strong>, Almoxarifado e Gestor.</span>`;
    showToast('📤 Pedido #' + String(newOrder.numero).padStart(3,'0') + ' enviado para ' + coopSel);
    btn.disabled=false; btn.textContent='📤 Enviar Pedido';
    setTimeout(() => PAGE_RENDERERS.escola_pedidos(document.getElementById('page-content')), 900);
  });
};

// ─── ESCOLA: ENTREGAS ───
PAGE_RENDERERS.escola_entregas = (el) => {
  const sc = getCurrentSchool();
  const orders = (typeof DATA !== 'undefined' && DATA.orders) ? DATA.orders : [];
  const active = orders.filter(o=>o.status!=='Entregue').slice(0,5);
  const sharedActive = SharedState.getOrders().filter(o => o.school === sc.name && o.status !== 'Entregue');
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Recebimento de Entregas — ${sc.name}</div>
      <div class="page-subtitle">Conferência e confirmação de recebimento</div>
    </div>
    <div class="card mb-24">
      <div class="card-header"><div class="card-title">🚚 Entregas em Andamento</div>${sharedActive.length ? '<span class="status-badge status-ok">'+sharedActive.length+' pedidos recentes</span>' : ''}</div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>#</th><th>Cooperativa</th><th>Data</th><th>Itens</th><th>Valor</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${sharedActive.map(o=>`<tr>
              <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(o.numero).padStart(3,'0')}</td>
              <td>${o.cooperative||'—'}</td><td>${o.date}</td>
              <td style="font-size:0.82rem">${(o.itens||[]).map(i=>i.produto).slice(0,2).join(', ') || '—'}</td>
              <td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
              <td><span class="status-badge ${statusClass(o.status)}">${o.status}</span></td>
              <td>${o.status === 'Em transporte' ? `<button class="btn btn-sm btn-primary" onclick="confirmSchoolDelivery('${o.id}','${sc.director||'Diretor(a)'}')">✅ Confirmar</button>` : ''}</td>
            </tr>`).join('')}
            ${active.map((o,i)=>`<tr>
              <td style="font-family:var(--font-mono)">#${String(i+1).padStart(3,'0')}</td>
              <td>${o.cooperative||'—'}</td><td>${o.date||'—'}</td>
              <td style="font-size:0.82rem;color:var(--text-tertiary)">—</td>
              <td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
              <td><span class="status-badge ${o.status==='Pendente'?'status-danger':o.status?.includes?.('separ')?'status-warning':'status-info'}">${o.status||'—'}</span></td>
              <td><button class="btn btn-sm btn-primary" onclick="alert('Recebimento #${String(i+1).padStart(3,"0")} confirmado!')">✅ Confirmar</button></td>
            </tr>`).join('')}
            ${(sharedActive.length + active.length) === 0 ? '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma entrega pendente</td></tr>' : ''}
          </tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📍 Timeline da Entrega em Andamento</div></div>
      <div class="card-body">
        ${renderDeliveryTimeline(sharedActive[0], sc)}
      </div>
    </div>`;
};

function renderDeliveryTimeline(order, sc) {
  if (!order) {
    return `<div style="color:var(--text-secondary);padding:16px;text-align:center">Nenhuma entrega em andamento no momento.</div>`;
  }
  const delivery = SharedState.getDeliveries().find(d => d.orderId === order.id);
  const timeline = delivery?.timeline || [];
  const stages = [
    { key: 'Pendente',       label: 'Pedido Solicitado',       desc: sc.name + ' enviou pedido' },
    { key: 'Em separação',   label: 'Em Separação (FIFO)',     desc: 'Estoque Central aplica FIFO nos lotes' },
    { key: 'Em transporte',  label: 'Em Transporte',           desc: 'Motorista a caminho' },
    { key: 'Entregue',       label: 'Confirmação da Escola',   desc: 'Conferir itens e assinar recibo' },
  ];
  const statusIdx = stages.findIndex(s => s.key === order.status);
  return `
    <div class="timeline">
      ${stages.map((s, i) => {
        const evento = timeline.find(t => (t.evento||'').includes(s.key));
        const time = evento ? new Date(evento.at).toLocaleString('pt-BR') : (i <= statusIdx ? '✓' : '—');
        const cls = i < statusIdx ? 'completed' : (i === statusIdx ? 'active' : 'pending');
        return `<div class="timeline-item ${cls}">
          <div class="timeline-dot"></div>
          <div class="timeline-title">${s.label}</div>
          <div class="timeline-desc">${s.desc}</div>
          <div class="timeline-time">${time}</div>
        </div>`;
      }).join('')}
    </div>
  `;
}

// ─── ESCOLA: HISTÓRICO ───
PAGE_RENDERERS.escola_historico = (el) => {
  const sc = getCurrentSchool();
  // Unifica: pedidos + consumo + ajustes de estoque em ordem cronológica reversa
  const eventos = [];
  SharedState.getOrders().filter(o => o.school === sc.name).forEach(o => {
    eventos.push({ tipo: 'Pedido', ref: '#' + String(o.numero).padStart(3,'0'), data: o.date, detalhes: (o.cooperative||'—') + ' — ' + ((o.itens||[]).length) + ' item(ns)', valor: 'R$ ' + (o.value||0).toLocaleString('pt-BR'), status: o.status, ts: new Date(o.date || Date.now()).getTime() });
  });
  SharedState.getConsumo(sc.name).forEach(c => {
    eventos.push({ tipo: 'Consumo', ref: c.refeicao || '—', data: c.data || (c.criadoEm||'').slice(0,10), detalhes: c.produto + ' — ' + (c.responsavel || '—'), valor: c.qtd + ' ' + (c.unidade||''), status: 'Registrado', ts: new Date(c.criadoEm || Date.now()).getTime() });
  });
  SharedState.getStockAdjust().filter(a => a.escola === sc.name).forEach(a => {
    if (a.delta > 0) eventos.push({ tipo: 'Entrada Estoque', ref: '', data: (a.criadoEm||'').slice(0,10), detalhes: a.produto + ' — ' + a.motivo, valor: '+' + a.delta + ' ' + (a.unidade||''), status: 'Efetivado', ts: new Date(a.criadoEm || Date.now()).getTime() });
  });
  eventos.sort((a,b) => b.ts - a.ts);
  const total = eventos.length;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Histórico — ${sc.name}</div>
      <div class="page-subtitle">Timeline unificada de pedidos, consumo e entregas · Fonte: SharedState</div>
    </div>
    <div class="card mb-16">
      <div class="card-header">
        <div class="card-title">Filtros</div>
        <div style="display:flex;gap:8px">
          <select id="hist-tipo" onchange="_filterHist()" style="padding:6px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem">
            <option value="">Todos os tipos</option><option>Pedido</option><option>Consumo</option><option>Entrada Estoque</option>
          </select>
          <input id="hist-search" placeholder="Buscar produto/detalhes..." oninput="_filterHist()" style="padding:6px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.82rem">
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Eventos</div><span class="status-badge status-info">${total}</span></div>
      <div class="card-body" style="padding:0">
        <table class="data-table" id="hist-table">
          <thead><tr><th>Tipo</th><th>Ref.</th><th>Data</th><th>Detalhes</th><th>Valor/Qtd</th><th>Status</th></tr></thead>
          <tbody>
            ${eventos.map(e => {
              const cls = e.tipo === 'Pedido' ? 'status-info' : e.tipo === 'Consumo' ? 'status-warning' : 'status-ok';
              return `<tr data-tipo="${e.tipo}" data-search="${(e.detalhes+' '+e.ref).toLowerCase()}">
                <td><span class="status-badge ${cls}">${e.tipo}</span></td>
                <td>${e.ref}</td>
                <td style="font-size:0.82rem">${e.data || '—'}</td>
                <td style="font-size:0.85rem">${e.detalhes}</td>
                <td style="font-family:var(--font-mono)">${e.valor}</td>
                <td><span class="status-badge ${e.status==='Entregue'||e.status==='Registrado'||e.status==='Efetivado'?'status-ok':e.status==='Pendente'?'status-danger':'status-warning'}">${e.status}</span></td>
              </tr>`;
            }).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhum evento — histórico será alimentado com o uso do sistema.</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>`;
};

window._filterHist = () => {
  const t = document.getElementById('hist-tipo')?.value || '';
  const s = (document.getElementById('hist-search')?.value || '').toLowerCase();
  document.querySelectorAll('#hist-table tbody tr[data-tipo]').forEach(tr => {
    const okT = !t || tr.dataset.tipo === t;
    const okS = !s || tr.dataset.search.includes(s);
    tr.style.display = (okT && okS) ? '' : 'none';
  });
};

// ─── ESCOLA: RELATÓRIOS ───
PAGE_RENDERERS.escola_relatorios = (el) => {
  const sc = getCurrentSchool();
  const att = sc.attendance_pct || 92;
  const bars = [89,90,95,87,93,90,92,89,92,91,93,90,92,92];
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Relatórios — ${sc.name}</div>
      <div class="page-subtitle">Análises de frequência, consumo e desempenho alimentar</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📅</div><div class="kpi-value">${att}%</div><div class="kpi-label">Freq. Média Jun</div></div>
      <div class="kpi-card green"><div class="kpi-icon">📦</div><div class="kpi-value">1.240 kg</div><div class="kpi-label">Consumo Mensal</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">💰</div><div class="kpi-value">R$ 1,06</div><div class="kpi-label">Per Capita Médio</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🌾</div><div class="kpi-value">42%</div><div class="kpi-label">Agric. Familiar</div></div>
    </div>
    <div class="grid-2-1">
      <div class="card">
        <div class="card-header"><div class="card-title">📈 Frequência Diária — Junho 2026</div></div>
        <div class="card-body">
          <div style="display:flex;align-items:flex-end;gap:5px;height:100px;border-bottom:1px solid var(--border);padding-bottom:8px">
            ${bars.map(v=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px">
              <div style="font-size:0.62rem;color:var(--text-secondary)">${v}%</div>
              <div style="width:100%;background:${v>=90?'var(--primary)':v>=85?'var(--warning)':'var(--danger)'};border-radius:3px 3px 0 0;height:${Math.round((v-82)*9)}px"></div>
            </div>`).join('')}
          </div>
          <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:0.7rem;color:var(--text-secondary)">
            <span>05/Jun</span><span>10/Jun</span><span>17/Jun</span><span>24/Jun</span>
          </div>
          <div style="margin-top:12px;padding:12px;background:var(--surface-1);border-radius:var(--radius-md);font-size:0.82rem">
            <div style="display:flex;justify-content:space-between"><span>Média do período:</span><span style="font-weight:700;color:var(--primary)">${att}%</span></div>
            <div style="display:flex;justify-content:space-between;margin-top:4px"><span>Presentes (média):</span><span style="font-weight:700">${sc.attendance_avg||572} de ${sc.students||620}</span></div>
            <div style="display:flex;justify-content:space-between;margin-top:4px"><span>Dias registrados:</span><span style="font-weight:700">14 dias úteis</span></div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-header"><div class="card-title">🍽️ Top Alimentos Consumidos</div></div>
          <div class="card-body">
            ${[['Arroz Tipo 1','875 kg',88],['Feijão Carioca','375 kg',75],['Frango','490 kg',92],['Banana Nanica','350 kg',60],['Leite Integral','672 L',85]].map(([n,q,pct])=>`
              <div style="margin-bottom:10px">
                <div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:3px"><span>${n}</span><span style="color:var(--text-secondary)">${q}</span></div>
                <div style="background:var(--border);border-radius:3px;height:5px"><div style="width:${pct}%;height:100%;background:var(--primary);border-radius:3px"></div></div>
              </div>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">📋 Exportar</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:8px">
            <button class="btn btn-ghost" onclick="alert('Relatório de Frequência exportado!')">📄 Frequência — Jun/2026</button>
            <button class="btn btn-ghost" onclick="alert('Relatório de Consumo exportado!')">📄 Consumo — Jun/2026</button>
            <button class="btn btn-ghost" onclick="alert('Análise Nutricional exportada!')">📄 Análise Nutricional</button>
          </div>
        </div>
      </div>
    </div>`;
};


  // ============================================================
  // DIRETOR e RESP_ESTOQUE: migrados do app.js na Fase 4.2b (movido)
  // ============================================================
  // Completam a familia escola. As aliases diretor_*/resp_estoque_* rodam aqui
  // apos as telas escola_* ja definidas acima; diretor_planejamento usa
  // escola_planejamento (definido) || gestor_planejamento (ainda no app.js) —
  // curto-circuita no primeiro, que e truthy.

PAGE_RENDERERS.diretor_dashboard = (el) => {
  const sc = getCurrentSchool();
  const students = sc.students || 0;
  const att = sc.attendance_avg || Math.round(students * 0.9);
  const attPct = sc.attendance_pct || 90;
  const refeicoes = sc.refeicoesDia || sc.meals_per_day || 2;
  const budget = sc.monthly_budget || Math.round(students * 35);
  const products = DATA.products || [];
  const localStock = SharedState.getSchoolStock(sc.name);
  const rows = products.map(p => {
    const local = localStock.find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20);
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    return { daysLeft: avgDay > 0 ? Math.round(qty / avgDay) : 999 };
  });
  const critical = rows.filter(r => r.daysLeft <= 3).length;
  const warning = rows.filter(r => r.daysLeft > 3 && r.daysLeft <= 7).length;
  const orders = SharedState.getOrders().filter(o => o.school === sc.name);
  const pendingOrders = orders.filter(o => o.status === 'Pendente').length;
  const deliveries = SharedState.getDeliveries().filter(d => d.school === sc.name);
  const inTransit = deliveries.filter(d => d.status === 'Em transporte').length;
  const consumed = Math.round(att * refeicoes * 0.3);

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Painel da Direção — ${sc.name}</div>
        <div class="page-subtitle">${sc.tipo || sc.sigla} · ${sc.region} · ${students.toLocaleString('pt-BR')} alunos · ${refeicoes} refeições/dia</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary btn-sm" onclick="navigateTo('diretor','pedidos')">🛒 Solicitar Reposição</button>
        <button class="btn btn-outline btn-sm" onclick="navigateTo('diretor','estoque')">📦 Ver Estoque</button>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">👨‍🎓</div><div class="kpi-value">${students.toLocaleString('pt-BR')}</div><div class="kpi-label">Matriculados</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${att.toLocaleString('pt-BR')}</div><div class="kpi-label">Presentes Hoje</div></div>
      <div class="kpi-card ${critical > 0 ? 'red' : 'orange'}"><div class="kpi-icon">📦</div><div class="kpi-value">${critical > 0 ? critical + ' crítico(s)' : warning + ' atenção'}</div><div class="kpi-label">Status Estoque</div></div>
      <div class="kpi-card teal"><div class="kpi-icon">🛒</div><div class="kpi-value">${pendingOrders}</div><div class="kpi-label">Pedidos Pendentes</div></div>
      <div class="kpi-card purple"><div class="kpi-icon">🚚</div><div class="kpi-value">${inTransit}</div><div class="kpi-label">Em Transporte</div></div>
    </div>

    <div class="grid-2-1">
      <div style="display:flex;flex-direction:column;gap:16px">

        ${(critical > 0 || warning > 0) ? `
        <div class="card" style="border-left:4px solid var(--danger)">
          <div class="card-header"><div class="card-title">🚨 Alertas de Estoque</div><span class="status-badge status-danger">${critical + warning} itens</span></div>
          <div class="card-body">
            <div class="alert-list">
              ${critical > 0 ? `<div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>${critical} produto(s) crítico(s)</strong> — estoque para menos de 3 dias. <a href="#" onclick="navigateTo('diretor','estoque');return false">Ver estoque</a></div></div>` : ''}
              ${warning > 0 ? `<div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>${warning} produto(s) em atenção</strong> — estoque para menos de 7 dias.</div></div>` : ''}
              <div class="alert-item" style="background:#e3f2fd;border-left:4px solid #1565C0"><span class="alert-icon">💡</span><div class="alert-text">Solicite reposição agora para garantir continuidade das refeições. <button class="btn btn-sm btn-primary" style="margin-top:6px" onclick="navigateTo('diretor','pedidos')">🛒 Criar Pedido</button></div></div>
            </div>
          </div>
        </div>` : `
        <div class="card" style="border-left:4px solid var(--success)">
          <div class="card-body"><div class="alert-item" style="background:#e8f5e9;border-left:none"><span class="alert-icon">✅</span><div class="alert-text"><strong>Estoque saudável</strong> — nenhum item crítico no momento.</div></div></div>
        </div>`}

        <div class="card">
          <div class="card-header"><div class="card-title">📦 Últimos Pedidos de Reposição</div><button class="btn btn-primary btn-sm" onclick="navigateTo('diretor','pedidos')">+ Novo Pedido</button></div>
          <div class="card-body" style="padding:0">
            ${orders.length > 0 ? `
            <table class="data-table">
              <thead><tr><th>Data</th><th>Cooperativa</th><th>Valor</th><th>Status</th></tr></thead>
              <tbody>
                ${orders.slice(-5).reverse().map(o => `
                  <tr>
                    <td>${new Date(o.date).toLocaleDateString('pt-BR')}</td>
                    <td>${o.coop || '—'}</td>
                    <td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
                    <td><span class="status-badge ${o.status==='Entregue'?'status-ok':o.status==='Pendente'?'status-warning':'status-info'}">${o.status}</span></td>
                  </tr>`).join('')}
              </tbody>
            </table>` : `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">Nenhum pedido ainda</div></div>`}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">🚚 Entregas Recentes</div></div>
          <div class="card-body" style="padding:0">
            ${deliveries.length > 0 ? `
            <table class="data-table">
              <thead><tr><th>Data</th><th>Recebido por</th><th>Status</th></tr></thead>
              <tbody>
                ${deliveries.slice(-5).reverse().map(d => `
                  <tr>
                    <td>${d.data ? new Date(d.data).toLocaleDateString('pt-BR') : '—'}</td>
                    <td>${d.receiver || '—'}</td>
                    <td><span class="status-badge ${d.status==='Confirmada'?'status-ok':'status-info'}">${d.status||'—'}</span></td>
                  </tr>`).join('')}
              </tbody>
            </table>` : `<div class="empty-state"><div class="empty-icon">🚚</div><div class="empty-text">Nenhuma entrega registrada</div></div>`}
          </div>
        </div>

      </div>
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card" style="background:var(--primary);color:white">
          <div class="card-body">
            <div style="font-size:0.8rem;opacity:0.8;margin-bottom:4px">Orçamento Mensal</div>
            <div style="font-size:2rem;font-weight:800">R$ ${Math.round(budget*0.55).toLocaleString('pt-BR')}</div>
            <div style="font-size:0.78rem;opacity:0.8;margin-bottom:10px">de R$ ${budget.toLocaleString('pt-BR')} (55% executado)</div>
            <div style="background:rgba(255,255,255,0.2);border-radius:4px;height:6px"><div style="width:55%;height:100%;background:white;border-radius:4px"></div></div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">📋 Perfil da Unidade</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:8px;font-size:0.88rem">
            <div><strong>Tipo:</strong> ${sc.tipo || sc.sigla}</div>
            <div><strong>Região:</strong> ${sc.region}</div>
            <div><strong>Níveis:</strong> ${sc.grade_levels || '—'}</div>
            <div><strong>Refeições/dia:</strong> ${refeicoes}</div>
            <div><strong>Consumo estimado:</strong> ~${consumed} kg/dia</div>
            <div><strong>Frequência hoje:</strong> ${attPct}% (${att}/${students})</div>
            <hr style="border:none;border-top:1px solid var(--border);margin:4px 0">
            <div><strong>Diretor(a):</strong> ${sc.diretor ? sc.diretor.name : '—'}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">${sc.diretor ? sc.diretor.email : ''}</div>
            <hr style="border:none;border-top:1px solid var(--border);margin:4px 0">
            <div><strong>Resp. Estoque:</strong> ${sc.respEstoque ? sc.respEstoque.name : '—'}</div>
            <div style="font-size:0.78rem;color:var(--text-secondary)">${sc.respEstoque ? sc.respEstoque.email : ''}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">⚡ Acesso Rápido</div></div>
          <div class="card-body" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <button class="btn btn-ghost" onclick="navigateTo('diretor','estoque')" style="font-size:0.82rem">📦 Estoque</button>
            <button class="btn btn-ghost" onclick="navigateTo('diretor','pedidos')" style="font-size:0.82rem">🛒 Pedido</button>
            <button class="btn btn-ghost" onclick="navigateTo('diretor','entregas')" style="font-size:0.82rem">🚚 Entregas</button>
            <button class="btn btn-ghost" onclick="navigateTo('diretor','historico')" style="font-size:0.82rem">📜 Histórico</button>
            <button class="btn btn-ghost" onclick="navigateTo('diretor','consumo')" style="font-size:0.82rem">📝 Consumo</button>
            <button class="btn btn-ghost" onclick="navigateTo('diretor','cardapios')" style="font-size:0.82rem">🍽️ Cardápio</button>
          </div>
        </div>
      </div>
    </div>`;
};

PAGE_RENDERERS.diretor_estoque = (el) => {
  const sc = getCurrentSchool();
  const products = DATA.products || [];
  const localStock = SharedState.getSchoolStock(sc.name);
  const rows = products.map(p => {
    const local = localStock.find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20);
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    const daysLeft = avgDay > 0 ? Math.round(qty / avgDay) : 999;
    return { name: p.name, category: p.category, unit: p.unit, qty, daysLeft, unidade: local?.unidade || p.unit, isReal: !!local };
  });
  const critical = rows.filter(r => r.daysLeft <= 3).length;
  const warning = rows.filter(r => r.daysLeft > 3 && r.daysLeft <= 7).length;

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Estoque — ${sc.name}</div>
      <div class="page-subtitle">Visão gerencial · atualizado automaticamente por entregas e consumo</div>
      <button class="btn btn-primary" onclick="navigateTo('diretor','pedidos')">🛒 Solicitar Reposição</button>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${rows.length}</div><div class="kpi-label">Produtos</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${rows.length-critical-warning}</div><div class="kpi-label">Estoque Normal</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚡</div><div class="kpi-value">${warning}</div><div class="kpi-label">Em Atenção</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${critical}</div><div class="kpi-label">Crítico</div></div>
    </div>
    <div class="card">
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Categoria</th><th style="text-align:right">Qtd. Escola</th><th>Un.</th><th style="text-align:right">Dias Restantes</th><th>Status</th></tr></thead>
          <tbody>
            ${rows.map(r => {
              const [cls, label] = r.daysLeft<=3 ? ['status-danger','Crítico'] : r.daysLeft<=7 ? ['status-warning','Atenção'] : ['status-ok','Normal'];
              return `<tr>
                <td><strong>${r.name}</strong>${r.isReal ? ' <span class="tag tag-blue" style="font-size:0.65rem">REAL</span>' : ''}</td>
                <td><span class="status-badge status-info" style="font-size:0.72rem">${r.category||'—'}</span></td>
                <td style="text-align:right;font-family:var(--font-mono)">${r.qty.toLocaleString('pt-BR')}</td>
                <td>${r.unidade||'kg'}</td>
                <td style="text-align:right;font-weight:700;color:${r.daysLeft<=3?'var(--danger)':r.daysLeft<=7?'var(--warning)':'var(--success)'}">${r.daysLeft}d</td>
                <td><span class="status-badge ${cls}">${label}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
};

PAGE_RENDERERS.diretor_pedidos = (el) => {
  const sc = getCurrentSchool();
  const orders = SharedState.getOrders().filter(o => o.school === sc.name);
  const products = DATA.products || [];
  const criticalProducts = products.filter(p => {
    const local = SharedState.getSchoolStock(sc.name).find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20);
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    return (avgDay > 0 ? Math.round(qty / avgDay) : 999) <= 7;
  });

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Solicitação de Reposição — ${sc.name}</div>
      <div class="page-subtitle">Pedidos de abastecimento enviados à Cooperativa via SUALE</div>
    </div>

    ${criticalProducts.length > 0 ? `
    <div class="card mb-16" style="border-left:4px solid var(--warning)">
      <div class="card-header"><div class="card-title">⚡ Sugestão de Pedido — Produtos Críticos</div></div>
      <div class="card-body">
        <p style="margin:0 0 12px;font-size:0.88rem;color:var(--text-secondary)">Os seguintes produtos estão com estoque baixo. Inclua no pedido:</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
          ${criticalProducts.map(p => `<span class="status-badge status-warning">${p.name}</span>`).join('')}
        </div>
        <button class="btn btn-primary btn-sm" onclick="window._dirPedido=true;renderPage()">🛒 Criar Pedido com Esses Itens</button>
      </div>
    </div>` : ''}

    <div class="card mb-16">
      <div class="card-header"><div class="card-title">📋 Novo Pedido de Reposição</div></div>
      <div class="card-body">
        <div class="form-group">
          <label>Escola</label>
          <input type="text" class="form-control" value="${sc.name}" readonly style="background:var(--surface-2)">
        </div>
        <div class="form-group">
          <label>Cooperativa</label>
          <select class="form-control" id="dir-pedido-coop">
            ${DATA.cooperatives.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Observações / Urgência</label>
          <textarea class="form-control" id="dir-pedido-obs" rows="2" placeholder="Ex.: Pedido urgente — arroz em nível crítico"></textarea>
        </div>
        <div style="overflow-x:auto">
          <table class="data-table" style="min-width:520px">
            <thead><tr><th>Produto</th><th>Un.</th><th>Qtd. Sugerida</th><th style="text-align:center">Incluir?</th></tr></thead>
            <tbody>
              ${criticalProducts.slice(0, 8).map(p => `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td>${p.unit}</td>
                <td><input type="number" class="form-control" style="width:100px;display:inline-block" value="${Math.round((p.avgConsume||0)/2)}" id="dir-qtd-${p.id}" min="1"></td>
                <td style="text-align:center"><input type="checkbox" checked id="dir-chk-${p.id}"></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div style="margin-top:16px;display:flex;gap:8px">
          <button class="btn btn-primary" onclick="dirSubmitPedido('${sc.name}')">✅ Enviar Pedido</button>
          <button class="btn btn-outline" onclick="navigateTo('diretor','dashboard')">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">📋 Histórico de Pedidos</div><span class="status-badge status-info">${orders.length}</span></div>
      <div class="card-body" style="padding:0">
        ${orders.length > 0 ? `
        <table class="data-table">
          <thead><tr><th>Data</th><th>Cooperativa</th><th>Valor Estimado</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${orders.slice().reverse().map(o => `
              <tr>
                <td>${new Date(o.date).toLocaleDateString('pt-BR')}</td>
                <td>${o.coop||'—'}</td>
                <td>R$ ${(o.value||0).toLocaleString('pt-BR')}</td>
                <td><span class="status-badge ${o.status==='Entregue'?'status-ok':o.status==='Pendente'?'status-warning':'status-info'}">${o.status}</span></td>
                <td><button class="table-action" onclick="navigateTo('diretor','entregas')">Acompanhar</button></td>
              </tr>`).join('')}
          </tbody>
        </table>` : `<div class="empty-state"><div class="empty-icon">📋</div><div class="empty-text">Nenhum pedido registrado ainda</div></div>`}
      </div>
    </div>`;
};

window.dirSubmitPedido = (schoolName) => {
  const coop = document.getElementById('dir-pedido-coop')?.value || 'COOPAGRAN';
  const obs = document.getElementById('dir-pedido-obs')?.value || '';
  const items = (DATA.products || []).filter(p => {
    const chk = document.getElementById(`dir-chk-${p.id}`);
    return chk && chk.checked;
  }).map(p => {
    const qtd = parseFloat(document.getElementById(`dir-qtd-${p.id}`)?.value || 0);
    return { productId: p.id, name: p.name, qtd, unit: p.unit };
  }).filter(i => i.qtd > 0);

  const value = items.reduce((s, i) => {
    const pr = (DATA.products || []).find(p => p.id === i.productId);
    return s + i.qtd * (pr ? (pr.avgPrice || 5) : 5);
  }, 0);

  SharedState.addOrder({
    school: schoolName, date: new Date().toISOString().split('T')[0],
    status: 'Pendente', coop, obs, items,
    value: Math.round(value || items.length * 500),
    solicitante: PROFILES.diretor.name,
  });
  showToast('✅ Pedido enviado com sucesso!');
  navigateTo('diretor', 'pedidos');
};

PAGE_RENDERERS.diretor_entregas = PAGE_RENDERERS.escola_entregas;
PAGE_RENDERERS.diretor_consumo  = PAGE_RENDERERS.escola_consumo;
PAGE_RENDERERS.diretor_cardapios = PAGE_RENDERERS.escola_cardapios;
PAGE_RENDERERS.diretor_planejamento = PAGE_RENDERERS.escola_planejamento || PAGE_RENDERERS.gestor_planejamento;
PAGE_RENDERERS.diretor_historico = PAGE_RENDERERS.escola_historico;
PAGE_RENDERERS.diretor_relatorios = PAGE_RENDERERS.escola_relatorios;

PAGE_RENDERERS.diretor_restricoes = (el) => {
  const sc = getCurrentSchool();
  const restricoes = SharedState.getRestricoes(sc.id);
  const ativos = restricoes.filter(r => r.status === 'ativo');
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Restrições Alimentares — ${sc.name}</div>
      <div class="page-subtitle">${ativos.length} restrição(ões) ativa(s)</div>
    </div>
    <div class="card" style="margin-bottom:20px">
      <div class="card-header"><div class="card-title">Registrar Restrição</div></div>
      <div class="card-body">
        <form id="form-dir-restricao" style="display:grid;grid-template-columns:1fr 100px 1fr auto;gap:12px;align-items:end">
          <div>
            <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Tipo</label>
            <select id="dir-restr-tipo" class="form-control" required>
              <option value="Alergia alimentar">Alergia alimentar</option>
              <option value="Intolerância à lactose">Intolerância à lactose</option>
              <option value="Doença celíaca">Doença celíaca</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Outra">Outra</option>
            </select>
          </div>
          <div>
            <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Qtd</label>
            <input type="number" id="dir-restr-qtd" class="form-control" min="1" value="1" required>
          </div>
          <div>
            <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Observação</label>
            <input type="text" id="dir-restr-obs" class="form-control" placeholder="Opcional">
          </div>
          <button type="submit" class="btn btn-primary" style="height:38px">Registrar</button>
        </form>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">Restrições Registradas (${restricoes.length})</div></div>
      <div class="card-body">
        <div class="table-wrapper">
          <table class="data-table">
            <thead><tr><th>Tipo</th><th>Qtd</th><th>Obs.</th><th>Status</th><th>Data</th><th>Ação</th></tr></thead>
            <tbody>
              ${restricoes.length === 0 ? '<tr><td colspan="6" style="text-align:center;color:var(--text-secondary)">Nenhuma restrição registrada</td></tr>' :
                restricoes.map(r => `
                  <tr${r.status==='resolvido'?' style="opacity:0.6"':''}>
                    <td><span class="tag tag-orange">${r.tipo}</span></td>
                    <td style="font-family:var(--font-mono)">${r.quantidade || 1}</td>
                    <td style="font-size:0.82rem">${r.observacao || '—'}</td>
                    <td><span class="status-badge ${r.status==='ativo'?'warning':'success'}">${r.status==='ativo'?'Ativo':'Resolvido'}</span></td>
                    <td style="font-size:0.82rem">${r.criadoEm ? new Date(r.criadoEm).toLocaleDateString('pt-BR') : '—'}</td>
                    <td>${r.status==='ativo' ? `<button class="table-action" onclick="window._resolverRestricao('${r.id}')">Resolver</button>` : '—'}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  document.getElementById('form-dir-restricao')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const prof = PROFILES[state.currentProfile];
    SharedState.addRestricao({
      schoolId: sc.id, schoolName: sc.name,
      tipo: document.getElementById('dir-restr-tipo').value,
      quantidade: parseInt(document.getElementById('dir-restr-qtd').value, 10) || 1,
      observacao: document.getElementById('dir-restr-obs').value,
      registradoPor: prof.name,
    });
    PAGE_RENDERERS.diretor_restricoes(el);
  });
};

PAGE_RENDERERS.resp_estoque_dashboard = (el) => {
  const sc = getCurrentSchool();
  const products = DATA.products || [];
  const localStock = SharedState.getSchoolStock(sc.name);
  const rows = products.map(p => {
    const local = localStock.find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20);
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    const daysLeft = avgDay > 0 ? Math.round(qty / avgDay) : 999;
    return { ...p, qty, daysLeft, isReal: !!local };
  });
  const critical = rows.filter(r => r.daysLeft <= 3).length;
  const warning = rows.filter(r => r.daysLeft > 3 && r.daysLeft <= 7).length;
  const ok = rows.length - critical - warning;
  const movs = SharedState.getStockAdjust().filter(a => a.escola === sc.name).slice(0, 6);
  const deliveries = SharedState.getDeliveries().filter(d => d.school === sc.name && d.status !== 'Confirmada');
  const consumo = SharedState.getConsumo(sc.name).slice(-5).reverse();

  el.innerHTML = `
    <div class="page-header">
      <div>
        <div class="page-title">Dashboard de Estoque — ${sc.name}</div>
        <div class="page-subtitle">Responsável: ${sc.respEstoque ? sc.respEstoque.name : '—'} · ${sc.region}</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-primary btn-sm" onclick="navigateTo('resp_estoque','consumo')">📝 Lançar Consumo</button>
        <button class="btn btn-outline btn-sm" onclick="navigateTo('resp_estoque','entradas')">📥 Confirmar Entrega</button>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${ok}</div><div class="kpi-label">Produtos OK</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚡</div><div class="kpi-value">${warning}</div><div class="kpi-label">Em Atenção</div></div>
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${critical}</div><div class="kpi-label">Estoque Crítico</div></div>
      <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${movs.length}</div><div class="kpi-label">Movimentações Recentes</div></div>
    </div>

    <div class="grid-2-1">
      <div style="display:flex;flex-direction:column;gap:16px">

        ${deliveries.length > 0 ? `
        <div class="card" style="border-left:4px solid var(--primary)">
          <div class="card-header"><div class="card-title">🚚 Entregas Aguardando Confirmação</div><span class="status-badge status-info">${deliveries.length}</span></div>
          <div class="card-body">
            ${deliveries.map(d => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)">
                <div>
                  <div style="font-weight:600">${d.escola || d.school || sc.name}</div>
                  <div style="font-size:0.8rem;color:var(--text-secondary)">${d.data ? new Date(d.data).toLocaleDateString('pt-BR') : '—'}</div>
                </div>
                <button class="btn btn-primary btn-sm" onclick="navigateTo('resp_estoque','entradas')">Confirmar →</button>
              </div>`).join('')}
          </div>
        </div>` : ''}

        <div class="card">
          <div class="card-header"><div class="card-title">📦 Posição de Estoque</div><button class="btn btn-ghost btn-sm" onclick="navigateTo('resp_estoque','inventario')">Ver tudo →</button></div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Produto</th><th style="text-align:right">Qtd</th><th>Un.</th><th>Dias</th><th>Status</th></tr></thead>
              <tbody>
                ${rows.slice(0, 8).map(r => {
                  const [cls, label] = r.daysLeft<=3 ? ['status-danger','Crítico'] : r.daysLeft<=7 ? ['status-warning','Atenção'] : ['status-ok','OK'];
                  return `<tr>
                    <td><strong>${r.name}</strong>${r.isReal ? ' <span class="tag tag-blue" style="font-size:0.65rem">REAL</span>' : ''}</td>
                    <td style="text-align:right;font-family:var(--font-mono)">${r.qty}</td>
                    <td>${r.unit||'kg'}</td>
                    <td style="font-weight:700;color:${r.daysLeft<=3?'var(--danger)':r.daysLeft<=7?'var(--warning)':'var(--success)'}">${r.daysLeft}d</td>
                    <td><span class="status-badge ${cls}">${label}</span></td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        ${consumo.length > 0 ? `
        <div class="card">
          <div class="card-header"><div class="card-title">📝 Últimos Lançamentos de Consumo</div></div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Data</th><th>Produto</th><th>Refeição</th><th>Qtd</th></tr></thead>
              <tbody>
                ${consumo.map(c => `<tr>
                  <td>${new Date(c.data).toLocaleDateString('pt-BR')}</td>
                  <td>${c.produto}</td>
                  <td>${c.refeicao||'—'}</td>
                  <td style="font-family:var(--font-mono)">-${c.qtd} ${c.unidade||'kg'}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </div>` : ''}

      </div>

      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-header"><div class="card-title">📋 Movimentações de Hoje</div></div>
          <div class="card-body" style="padding:0">
            ${movs.length > 0 ? movs.map(a => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)">
                <div>
                  <div style="font-weight:600;font-size:0.88rem">${a.produto}</div>
                  <div style="font-size:0.76rem;color:var(--text-secondary)">${a.motivo}</div>
                </div>
                <span style="font-family:var(--font-mono);font-weight:700;color:${a.delta>0?'var(--success)':'var(--danger)'}">${a.delta>0?'+':''}${a.delta} ${a.unidade||'kg'}</span>
              </div>`).join('') :
              `<div class="empty-state" style="padding:24px"><div class="empty-text">Nenhuma movimentação</div></div>`}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">⚡ Ações Rápidas</div></div>
          <div class="card-body" style="display:grid;grid-template-columns:1fr;gap:8px">
            <button class="btn btn-primary" onclick="navigateTo('resp_estoque','consumo')">📝 Lançar Consumo Diário</button>
            <button class="btn btn-outline" onclick="navigateTo('resp_estoque','entradas')">📥 Confirmar Entrega</button>
            <button class="btn btn-outline" onclick="navigateTo('resp_estoque','inventario')">🏢 Inventário Completo</button>
            <button class="btn btn-outline" onclick="navigateTo('resp_estoque','validades')">📅 Controle de Validades</button>
          </div>
        </div>
      </div>
    </div>`;
};

PAGE_RENDERERS.resp_estoque_inventario = (el) => {
  const sc = getCurrentSchool();
  const products = DATA.products || [];
  const localStock = SharedState.getSchoolStock(sc.name);
  const rows = products.map(p => {
    const local = localStock.find(l => l.produto === p.name);
    const qty = local ? local.qtd : Math.round((p.stock || 0) / 20);
    const avgDay = Math.max(1, Math.round((p.avgConsume || 0) / 20));
    return { ...p, qty, daysLeft: avgDay > 0 ? Math.round(qty / avgDay) : 999, isReal: !!local };
  });

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Inventário Físico — ${sc.name}</div>
      <div class="page-subtitle">Contagem de todos os itens no estoque da escola</div>
    </div>
    <div class="card">
      <div class="card-header">
        <div class="card-title">📦 Inventário Completo</div>
        <div style="display:flex;gap:8px">
          <span class="status-badge status-ok">${rows.filter(r=>r.daysLeft>7).length} OK</span>
          <span class="status-badge status-warning">${rows.filter(r=>r.daysLeft>3&&r.daysLeft<=7).length} Atenção</span>
          <span class="status-badge status-danger">${rows.filter(r=>r.daysLeft<=3).length} Crítico</span>
        </div>
      </div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Categoria</th><th style="text-align:right">Qtd. Atual</th><th>Un.</th><th>Consumo/Dia</th><th style="text-align:right">Dias</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            ${rows.map(r => {
              const avgDay = Math.max(1, Math.round((r.avgConsume || 0) / 20));
              const [cls, label] = r.daysLeft<=3 ? ['status-danger','Crítico'] : r.daysLeft<=7 ? ['status-warning','Atenção'] : ['status-ok','Normal'];
              return `<tr>
                <td><strong>${r.name}</strong>${r.isReal ? ' <span class="tag tag-blue" style="font-size:0.65rem">REAL</span>' : ''}</td>
                <td><span class="status-badge status-info" style="font-size:0.72rem">${r.category||'—'}</span></td>
                <td style="text-align:right;font-family:var(--font-mono);font-weight:700">${r.qty.toLocaleString('pt-BR')}</td>
                <td>${r.unit||'kg'}</td>
                <td style="font-size:0.82rem">${avgDay} ${r.unit||'kg'}/dia</td>
                <td style="text-align:right;font-weight:700;color:${r.daysLeft<=3?'var(--danger)':r.daysLeft<=7?'var(--warning)':'var(--success)'}">${r.daysLeft}d</td>
                <td><span class="status-badge ${cls}">${label}</span></td>
                <td><button class="table-action" onclick="respAjusteEstoque('${r.name}','${r.unit||'kg'}',${r.qty})">Ajustar</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
};

window.respAjusteEstoque = (produto, unidade, atual) => {
  showModal('Ajuste de Estoque — ' + produto, `
    <div class="form-group">
      <label>Qtd. Atual no Sistema</label>
      <input type="number" class="form-control" value="${atual}" readonly style="background:var(--surface-2)">
    </div>
    <div class="form-group">
      <label>Qtd. Real Contada</label>
      <input type="number" class="form-control" id="ajuste-qtd" value="${atual}" min="0">
    </div>
    <div class="form-group">
      <label>Motivo do Ajuste</label>
      <select class="form-control" id="ajuste-motivo">
        <option>Inventário físico</option><option>Perda/Avaria</option><option>Vencimento</option><option>Sobra de produção</option>
      </select>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px">
      <button class="btn btn-primary" onclick="respConfirmarAjuste('${produto}','${unidade}',${atual})">Confirmar Ajuste</button>
      <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    </div>`);
};

window.respConfirmarAjuste = (produto, unidade, atual) => {
  const nova = parseFloat(document.getElementById('ajuste-qtd')?.value || atual);
  const motivo = document.getElementById('ajuste-motivo')?.value || 'Inventário físico';
  const sc = getCurrentSchool();
  const delta = nova - atual;
  if (delta !== 0) {
    SharedState.addStockAdjust({ escola: sc.name, produto, delta: Math.round(delta), unidade, motivo });
    if (!SharedState._data.schoolStocks[sc.name]) SharedState._data.schoolStocks[sc.name] = {};
    if (!SharedState._data.schoolStocks[sc.name][produto]) SharedState._data.schoolStocks[sc.name][produto] = { qtd: nova, unidade };
    else SharedState._data.schoolStocks[sc.name][produto].qtd = nova;
    SharedState._persist();
    SharedState._notify();
  }
  closeModal();
  showToast('✅ Estoque ajustado: ' + produto);
  renderPage();
};

PAGE_RENDERERS.resp_estoque_entradas = (el) => {
  const sc = getCurrentSchool();
  const orders = SharedState.getOrders().filter(o => o.school === sc.name && (o.status === 'Em transporte' || o.status === 'Em separação'));
  const deliveries = SharedState.getDeliveries().filter(d => d.school === sc.name && d.status === 'Confirmada').slice(-5).reverse();

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Confirmar Entregas — ${sc.name}</div>
      <div class="page-subtitle">Recebimento de mercadorias e atualização automática do estoque</div>
    </div>

    <div class="card mb-16">
      <div class="card-header"><div class="card-title">🚚 Entregas Aguardando Confirmação</div><span class="status-badge status-info">${orders.length}</span></div>
      <div class="card-body">
        ${orders.length > 0 ? orders.map(o => `
          <div class="card mb-8" style="border:1px solid var(--border);box-shadow:none">
            <div class="card-body">
              <div style="display:flex;justify-content:space-between;align-items:flex-start">
                <div>
                  <div style="font-weight:700;font-size:1rem">Pedido #${o.id} — ${o.coop||'Cooperativa'}</div>
                  <div style="font-size:0.82rem;color:var(--text-secondary)">Data pedido: ${new Date(o.date).toLocaleDateString('pt-BR')} · Status: <strong>${o.status}</strong></div>
                </div>
                <span class="status-badge status-warning">${o.status}</span>
              </div>
              <div style="margin:12px 0">
                <div class="form-group" style="margin:0">
                  <label style="font-size:0.82rem">Nome do Recebedor</label>
                  <input type="text" class="form-control" id="recv-${o.id}" value="${sc.respEstoque ? sc.respEstoque.name : ''}" placeholder="Quem está recebendo?">
                </div>
              </div>
              <div style="display:flex;gap:8px">
                <button class="btn btn-primary btn-sm" onclick="respConfirmarEntrega('${o.id}')">✅ Confirmar Recebimento</button>
                <button class="btn btn-outline btn-sm" onclick="respReportarDivergencia('${o.id}')">⚠️ Divergência</button>
              </div>
            </div>
          </div>`).join('') :
          `<div class="empty-state"><div class="empty-icon">🚚</div><div class="empty-text">Nenhuma entrega aguardando confirmação</div></div>`}
      </div>
    </div>

    ${deliveries.length > 0 ? `
    <div class="card">
      <div class="card-header"><div class="card-title">✅ Entregas Confirmadas Recentemente</div></div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Data</th><th>Pedido</th><th>Recebido por</th><th>Status</th></tr></thead>
          <tbody>
            ${deliveries.map(d => `<tr>
              <td>${d.data ? new Date(d.data).toLocaleDateString('pt-BR') : '—'}</td>
              <td>#${d.orderId || '—'}</td>
              <td>${d.receiver || '—'}</td>
              <td><span class="status-badge status-ok">Confirmada</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>` : ''}`;
};

window.respConfirmarEntrega = (orderId) => {
  const sc = getCurrentSchool();
  const recv = document.getElementById(`recv-${orderId}`)?.value || (sc.respEstoque ? sc.respEstoque.name : 'Responsável');
  SharedState.confirmDelivery(orderId, recv, 'REC-' + Date.now());
  showToast('✅ Entrega confirmada! Estoque atualizado automaticamente.');
  renderPage();
};

window.respReportarDivergencia = (orderId) => {
  showModal('Registrar Divergência', `
    <div class="form-group"><label>Descrição da Divergência</label>
      <textarea class="form-control" id="div-desc" rows="3" placeholder="Ex.: Quantidade recebida diferente do pedido, produto avariado..."></textarea>
    </div>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="btn btn-primary" onclick="
        const sc = getCurrentSchool();
        SharedState.addIncident({ escola: sc.name, descricao: document.getElementById('div-desc').value, tipo: 'Divergência de entrega', status: 'Aberta', criadoEm: new Date().toISOString() });
        closeModal(); showToast('⚠️ Divergência registrada.'); renderPage();">
        Registrar
      </button>
      <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
    </div>`);
};

PAGE_RENDERERS.resp_estoque_consumo = PAGE_RENDERERS.escola_consumo;
PAGE_RENDERERS.resp_estoque_pedidos = PAGE_RENDERERS.escola_pedidos;

PAGE_RENDERERS.resp_estoque_validades = (el) => {
  const sc = getCurrentSchool();
  const nfs = SharedState.getNFs();
  const hoje = new Date();
  const validades = nfs.map(nf => {
    const dias = nf.validade ? Math.round((new Date(nf.validade) - hoje) / 86400000) : 999;
    return { ...nf, diasVencimento: dias };
  }).sort((a, b) => a.diasVencimento - b.diasVencimento);

  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Controle de Validades — ${sc.name}</div>
      <div class="page-subtitle">Monitoramento de lotes por data de vencimento (FEFO)</div>
    </div>
    <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
      <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${validades.filter(v=>v.diasVencimento<=7).length}</div><div class="kpi-label">Vencendo em 7 dias</div></div>
      <div class="kpi-card orange"><div class="kpi-icon">⚡</div><div class="kpi-value">${validades.filter(v=>v.diasVencimento>7&&v.diasVencimento<=30).length}</div><div class="kpi-label">Vencendo em 30 dias</div></div>
      <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${validades.filter(v=>v.diasVencimento>30).length}</div><div class="kpi-label">Dentro do prazo</div></div>
    </div>
    <div class="card">
      <div class="card-header"><div class="card-title">📅 Lotes por Validade</div></div>
      <div class="card-body" style="padding:0">
        ${validades.length > 0 ? `
        <table class="data-table">
          <thead><tr><th>Lote</th><th>NF</th><th>Qtd</th><th>Validade</th><th>Dias Restantes</th><th>Status</th></tr></thead>
          <tbody>
            ${validades.map(v => {
              const [cls, label] = v.diasVencimento<=7 ? ['status-danger','Crítico'] : v.diasVencimento<=30 ? ['status-warning','Atenção'] : ['status-ok','OK'];
              return `<tr>
                <td><strong>${v.lote||'—'}</strong></td>
                <td>${v.numero||'—'}</td>
                <td style="font-family:var(--font-mono)">${v.qtd||0}</td>
                <td>${v.validade ? new Date(v.validade).toLocaleDateString('pt-BR') : '—'}</td>
                <td style="font-weight:700;color:${v.diasVencimento<=7?'var(--danger)':v.diasVencimento<=30?'var(--warning)':'var(--success)'}">${v.diasVencimento}d</td>
                <td><span class="status-badge ${cls}">${label}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>` :
        `<div class="empty-state"><div class="empty-icon">📅</div><div class="empty-text">Nenhum lote cadastrado ainda — confirme uma entrega para gerar lotes.</div></div>`}
      </div>
    </div>`;
};

PAGE_RENDERERS.resp_estoque_relatorios = (el) => {
  const sc = getCurrentSchool();
  el.innerHTML = `
    <div class="page-header">
      <div class="page-title">Relatórios — ${sc.name}</div>
      <div class="page-subtitle">Relatórios de estoque, consumo e movimentações desta unidade</div>
    </div>
    <div class="grid-2-1">
      ${[
        { icon: '📦', title: 'Posição de Estoque', desc: 'Inventário atual com quantidades e dias restantes', key: 'escola' },
        { icon: '📝', title: 'Registro de Consumo', desc: 'Lançamentos de consumo por data e refeição', key: 'consumo' },
        { icon: '🚚', title: 'Histórico de Entregas', desc: 'Entregas confirmadas e datas', key: 'entregas' },
        { icon: '📋', title: 'Movimentações de Estoque', desc: 'Todas as entradas e saídas com auditoria', key: 'stockAdjust' },
      ].map(r => `
        <div class="card">
          <div class="card-body" style="display:flex;align-items:flex-start;gap:12px">
            <div style="font-size:2rem">${r.icon}</div>
            <div style="flex:1">
              <div style="font-weight:700;margin-bottom:4px">${r.title}</div>
              <div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:12px">${r.desc}</div>
              <button class="btn btn-primary btn-sm" onclick="exportRelatorio('${r.key}')">⬇️ Exportar CSV</button>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
};


  // === Migrado do app.js (Fase 4) ===
  PAGE_RENDERERS.escola_restricoes = (el) => PAGE_RENDERERS.nutricionista_restricoes(el);

  PAGE_RENDERERS.merendeira_dashboard = PAGE_RENDERERS.escola_dashboard;

  PAGE_RENDERERS.merendeira_consumo = PAGE_RENDERERS.escola_consumo;

  PAGE_RENDERERS.merendeira_cardapios = PAGE_RENDERERS.escola_cardapios;

  PAGE_RENDERERS.merendeira_estoque = PAGE_RENDERERS.escola_estoque;

  PAGE_RENDERERS.merendeira_entregas = PAGE_RENDERERS.escola_entregas;

})();
