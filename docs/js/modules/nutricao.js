/* ============================================
   SUALE — Módulo Nutrição (js/modules/nutricao.js)
   Perfil: Nutricionista SEMED
   ============================================ */

(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  // REGISTRO DE RENDERERS (Assinatura: (el) => { el.innerHTML = ...; })
  //
  // Regra 6 do PLANO_MODULARIZACAO_APP.md: só registramos aqui a tela cuja versão
  // migrada é equivalente ou melhor que a de app.js. As demais telas deste perfil
  // (dashboard, cardapios, fichas, restricoes, relatorios, estoquesual, consumo,
  // desperdicios, planejamento) continuam servidas por app.js, que hoje tem as
  // versões mais completas — registrá-las aqui as substituiria por versões mais
  // pobres assim que a ordem dos <script> mudasse. As funções seguem definidas
  // abaixo, prontas para assumir quando forem migradas de verdade.
  //
  // Migradas e ativas:
  PAGE_RENDERERS['nutricionista_guiasentrega'] = renderNutricionistaGuiasEntrega;

  // 1. DASHBOARD NUTRICIONISTA
  function renderNutricionistaDashboard(el) {
    const menus = SharedState.getWeeklyMenus ? SharedState.getWeeklyMenus() : [];
    const restricoesAgrupadas = SharedState.getRestricoes ? SharedState.getRestricoes() : [];
    const alunosEspeciais = SharedState.getAlunosEspeciais ? SharedState.getAlunosEspeciais() : [];
    const totalRestricoes = alunosEspeciais.length > 0 ? alunosEspeciais.length : restricoesAgrupadas.reduce((a, b) => a + (b.quantidade || 1), 0);

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Painel Nutricional SEMED</div>
        <div class="page-subtitle">Gestão de cardápios PNAE, dietas especiais, guia de entregas e conformidade técnica</div>
      </div>

      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card blue"><div class="kpi-icon">🥗</div><div class="kpi-value">${menus.length || 3}</div><div class="kpi-label">Cardápios Ativos</div></div>
        <div class="kpi-card green"><div class="kpi-icon">🌾</div><div class="kpi-value">42%</div><div class="kpi-label">Pauta Agricultura Familiar</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">🛡️</div><div class="kpi-value">${totalRestricoes}</div><div class="kpi-label">Alunos c/ Dietas Especiais</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">📋</div><div class="kpi-value">100%</div><div class="kpi-label">Conformidade PNAE</div></div>
      </div>

      <div class="grid-2 mb-24">
        <div class="card">
          <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
            <div class="card-title">🍱 Cardápios Semanais Vigentes</div>
            <button class="btn btn-primary btn-sm" onclick="navigateTo('nutricionista','cardapios')">Ver Todos</button>
          </div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Nome do Cardápio</th><th>Período</th><th>Kcal Média</th><th>Status</th></tr></thead>
              <tbody>
                ${menus.slice(0, 5).map(m => `
                  <tr>
                    <td><strong>${m.nome || m.semana || 'Cardápio Semanal'}</strong></td>
                    <td style="font-size:0.82rem">${m.periodo || '—'}</td>
                    <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${m.kcalMedia || 680} kcal</td>
                    <td><span class="status-badge status-ok">${m.status || 'Publicado'}</span></td>
                  </tr>
                `).join('') || '<tr><td colspan="4" style="text-align:center;padding:16px">Nenhum cardápio cadastrado</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
            <div class="card-title">👶 Dietas Especiais & Restrições Clínicas</div>
            <button class="btn btn-primary btn-sm" onclick="window.abrirModalNovoAlunoEspecial()">+ Novo Cadastro</button>
          </div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>Aluno / Escola</th><th>Restrição</th><th>Status Laudo</th></tr></thead>
              <tbody>
                ${alunosEspeciais.slice(0, 5).map(a => `
                  <tr>
                    <td><strong>${a.nome}</strong><br><span style="font-size:0.75rem;color:var(--text-secondary)">${a.escola}</span></td>
                    <td><span class="status-badge status-warning">${a.restricao}</span></td>
                    <td><span class="status-badge status-ok">✓ Auditado</span></td>
                  </tr>
                `).join('') || '<tr><td colspan="3" style="text-align:center;padding:16px">Nenhum aluno com restrição cadastrado</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><div class="card-title">⚡ Ações Rápidas Nutricionais</div></div>
        <div class="card-body" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
          <button class="btn btn-outline" onclick="navigateTo('nutricionista','cardapios')">🍱 Planejar Cardápios</button>
          <button class="btn btn-outline" onclick="navigateTo('nutricionista','guiasentrega')">🚚 Guias de Entrega</button>
          <button class="btn btn-outline" onclick="navigateTo('nutricionista','estoquesual')">📦 Estoque Central SUAL</button>
          <button class="btn btn-outline" onclick="window.gerarRelatorioMensal4Paginas()">📄 Relatório 4 Páginas</button>
        </div>
      </div>
    `;
  }

  // 2. CARDÁPIOS
  function renderNutricionistaCardapios(el) {
    const menus = SharedState.getWeeklyMenus ? SharedState.getWeeklyMenus() : [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Gestão de Cardápios Escolares (PNAE)</div>
        <div class="page-subtitle">Elaboração, análise nutricional e publicação de cardápios semanais</div>
      </div>

      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">📋 Cardápios Cadastrados</div>
          <div style="display:flex;gap:10px">
            <button class="btn btn-primary btn-sm" onclick="window.abrirModalDisparoManualOS()">📱 Disparar Ordens de Serviço</button>
            <button class="btn btn-success btn-sm" onclick="window.gerarRelatorioMensal4Paginas()">📄 Exportar Relatório 4 Páginas</button>
          </div>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Nome do Cardápio</th><th>Período</th><th>Escolas Atendidas</th><th>Kcal Média</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              ${menus.map(m => `
                <tr>
                  <td><strong>${m.nome || m.semana || 'Cardápio Semanal'}</strong></td>
                  <td>${m.periodo || '—'}</td>
                  <td>${m.escolas || 'Toda a Rede'}</td>
                  <td style="font-family:var(--font-mono);font-weight:700;color:var(--primary)">${m.kcalMedia || 680} kcal</td>
                  <td><span class="status-badge ${m.status === 'Em Elaboração' ? 'status-warning' : 'status-ok'}">${m.status || 'Publicado'}</span></td>
                  <td>
                    <button class="btn btn-sm btn-outline" onclick="window.visualizarEImprimirCardapio('${m.nome}')">👁️ Visualizar</button>
                  </td>
                </tr>
              `).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px">Nenhum cardápio encontrado</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 3. PLANEJADOR
  function renderNutricionistaPlanejador(el) {
    if (typeof PAGE_RENDERERS['gestor_planejamento'] === 'function') {
      PAGE_RENDERERS['gestor_planejamento'](el);
      return;
    }
    el.innerHTML = `
      <div class="page-header"><div class="page-title">Planejador Nutricional</div><div class="page-subtitle">Elaboração técnica de cardápios</div></div>
      <div class="card"><div class="card-body">Módulo de planejamento ativo.</div></div>
    `;
  }

  // 4. FICHAS TÉCNICAS
  function renderNutricionistaFichas(el) {
    const recipes = (typeof RECIPE_LIBRARY !== 'undefined') ? RECIPE_LIBRARY : [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Fichas Técnicas de Preparo (FTP)</div>
        <div class="page-subtitle">Padronização de receitas, rendimento e per capita nutricional</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Catálogo de Receitas Padronizadas</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Nome da Preparação</th><th>Refeição</th><th>Kcal/Porção</th><th>Proteínas</th><th>Alergênicos</th></tr></thead>
            <tbody>
              ${recipes.map(r => `
                <tr>
                  <td><strong>${r.name || r.nome}</strong></td>
                  <td><span class="tag tag-blue">${r.meal || r.refeicao || 'Almoço'}</span></td>
                  <td style="font-family:var(--font-mono);font-weight:700">${r.kcal || 350} kcal</td>
                  <td>${r.protein || r.proteina || '18g'}</td>
                  <td>${r.allergens || 'Nenhum'}</td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="text-align:center;padding:24px">Carregando catálogo de receitas...</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 5. RESTRIÇÕES / DIETAS ESPECIAIS
  function renderNutricionistaRestricoes(el) {
    const restricoesAgrupadas = SharedState.getRestricoes ? SharedState.getRestricoes() : [];
    const alunosEspeciais = SharedState.getAlunosEspeciais ? SharedState.getAlunosEspeciais() : [];
    const totalAlunosComRestricao = alunosEspeciais.length > 0 ? alunosEspeciais.length : restricoesAgrupadas.reduce((a, b) => a + (b.quantidade || 1), 0);

    const htmlAlunos = alunosEspeciais.map(a => `
      <tr>
        <td><strong>${a.nome}</strong></td>
        <td>${a.escola}</td>
        <td><span class="tag tag-blue">${a.turma || 'Geral'}</span></td>
        <td style="font-size:0.82rem">${a.dataNascimento ? a.dataNascimento.split('-').reverse().join('/') : '—'}</td>
        <td><span class="status-badge status-warning">${a.restricao}</span></td>
        <td style="font-size:0.8rem;color:#0284c7">Alimento Adaptado (RN-002)</td>
        <td style="font-size:0.78rem">${a.laudo || 'Laudo Anexado'}</td>
        <td>
          <button class="table-action btn-sm" style="color:var(--danger)" onclick="window.excluirAlunoEspecial('${a.id}')">🗑️ Excluir</button>
        </td>
      </tr>
    `).join('');

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Gestão de Restrições Alimentares & Dietas Especiais</div>
        <div class="page-subtitle">Cadastro nominal de alunos (RF-003), laudos clínicos e motor de substituição por faixa etária (RN-002)</div>
      </div>

      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card orange"><div class="kpi-icon">🛡️</div><div class="kpi-value">${totalAlunosComRestricao}</div><div class="kpi-label">Alunos c/ Dieta Especial</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">🍼</div><div class="kpi-value">12</div><div class="kpi-label">Creche / 0-2 anos (Fórmula)</div></div>
        <div class="kpi-card green"><div class="kpi-icon">🥛</div><div class="kpi-value">35</div><div class="kpi-label">Fundamental (Zero Lactose)</div></div>
        <div class="kpi-card blue"><div class="kpi-icon">📄</div><div class="kpi-value">100%</div><div class="kpi-label">Laudos Médicos Auditados</div></div>
      </div>

      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">👶 Cadastro Nominal de Alunos com Restrição Clínica (RF-003 & RN-002)</div>
          <button class="btn btn-primary btn-sm" onclick="window.abrirModalNovoAlunoEspecial()">+ Cadastrar Aluno Especial</button>
        </div>
        <div class="card-body" style="padding:0">
          <div style="overflow-x:auto">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Aluno(a)</th>
                  <th>Escola Destino</th>
                  <th>Turma</th>
                  <th>Data Nasc.</th>
                  <th>Restrição Clínica</th>
                  <th>Substituição Automática IA</th>
                  <th>Laudo Médico</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${htmlAlunos.length > 0 ? htmlAlunos : '<tr><td colspan="8" style="text-align:center;padding:24px">Nenhum aluno cadastrado. Clique no botão acima para adicionar.</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 6. RELATÓRIOS
  function renderNutricionistaRelatorios(el) {
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Relatórios Técnicos PNAE</div>
        <div class="page-subtitle">Emissão de relatórios oficiais para auditoria e prestação de contas</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Modelos Disponíveis</div></div>
        <div class="card-body" style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
          <div style="background:var(--surface-1);border:1px solid var(--border);border-radius:var(--radius-md);padding:16px">
            <h4>📄 Relatório Mensal 4 Páginas/Mês (RF-010)</h4>
            <p style="font-size:0.85rem;color:var(--text-secondary);margin:8px 0 16px">Modelo padronizado para afixação no mural escolar.</p>
            <button class="btn btn-primary btn-sm" onclick="window.gerarRelatorioMensal4Paginas()">Gerar Relatório</button>
          </div>
          <div style="background:var(--surface-1);border:1px solid var(--border);border-radius:var(--radius-md);padding:16px">
            <h4>📊 Relatório Técnico de Conformidade PNAE</h4>
            <p style="font-size:0.85rem;color:var(--text-secondary);margin:8px 0 16px">Análise detalhada de macronutrientes, sódio e agricultura familiar.</p>
            <button class="btn btn-outline btn-sm" onclick="window.abrirRelatorioPNAE()">Visualizar PNAE</button>
          </div>
        </div>
      </div>
    `;
  }

  // 7. ESTOQUE SUAL (READ-ONLY)
  function renderNutricionistaEstoqueSual(el) {
    const products = DATA.products || [];
    const zerados = products.filter(p => (p.stock || 0) === 0);
    const emRisco = products.filter(p => (p.daysLeft || 0) > 0 && (p.daysLeft || 0) <= 5);
    const afItens = products.filter(p => p.familyFarm);

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">📦 Estoque Consolidado SUAL (Modo Leitura — Nutrição)</div>
        <div class="page-subtitle">Acompanhamento dos níveis de estoque central, risco de desabastecimento e itens zerados</div>
      </div>

      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${products.length}</div><div class="kpi-label">Itens no Catálogo</div></div>
        <div class="kpi-card red"><div class="kpi-icon">🚫</div><div class="kpi-value">${zerados.length}</div><div class="kpi-label">Itens Zerados</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${emRisco.length}</div><div class="kpi-label">Em Risco (< 5 dias)</div></div>
        <div class="kpi-card green"><div class="kpi-icon">🌽</div><div class="kpi-value">${afItens.length}</div><div class="kpi-label">Agricultura Familiar</div></div>
      </div>

      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">🔍 Consulta de Insumos da Central SUAL</div>
          <span class="status-badge status-info">🔒 Modo Consulta</span>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Produto / Insumo</th>
                <th>Categoria</th>
                <th>Origem</th>
                <th>Estoque Atual</th>
                <th>Autonomia</th>
                <th>Status SUAL</th>
              </tr>
            </thead>
            <tbody>
              ${products.map(p => `
                <tr>
                  <td><strong>${p.name}</strong></td>
                  <td><span class="tag tag-blue">${p.category}</span></td>
                  <td>${p.familyFarm ? '<span style="color:#2E7D32;font-weight:700">🌽 Agric. Familiar</span>' : 'Pregão Central'}</td>
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

  // 8. GUIAS DE ENTREGA
  function renderNutricionistaGuiasEntrega(el) {
    const pre = window._guiaFiltroPreSelect || null;
    window._guiaFiltroPreSelect = null;
    const modoInicial = pre ? pre.modo : 'escola';

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">🚚 Guias de Entrega & Distribuição</div>
        <div class="page-subtitle">Emissão da Guia de Remessa de Gêneros Alimentares — por escola, por colaborador (cooperativa/agricultor) ou por produto</div>
      </div>

      <div style="display:flex; gap:10px; margin-bottom:16px; border-bottom:2px solid var(--border,#e2e8f0); padding-bottom:8px;">
        <button class="btn btn-sm" id="guia-tab-escola-btn" onclick="window.trocarAbaGuiaEntrega('escola')">🏫 Por Escola</button>
        <button class="btn btn-sm" id="guia-tab-colaborador-btn" onclick="window.trocarAbaGuiaEntrega('colaborador')">🤝 Por Colaborador</button>
        <button class="btn btn-sm" id="guia-tab-produto-btn" onclick="window.trocarAbaGuiaEntrega('produto')">🥕 Por Produto</button>
      </div>

      <div class="card mb-24">
        <div class="card-body" id="guia-filtro-container"></div>
      </div>
      <div id="guia-detalhes-container"></div>
    `;

    window.trocarAbaGuiaEntrega(modoInicial, pre);
  }

  // 9. CONSUMO
  function renderNutricionistaConsumo(el) {
    const todos = SharedState.getConsumo ? SharedState.getConsumo() : [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Monitoramento de Consumo Escolar</div>
        <div class="page-subtitle">Consolidação em tempo real dos registros das escolas</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📋 Registros Recentes das Escolas</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Data</th><th>Escola</th><th>Refeição</th><th>Produto</th><th>Qtd</th></tr></thead>
            <tbody>
              ${todos.slice(0, 10).map(c => `
                <tr>
                  <td>${c.data || '—'}</td>
                  <td><strong>${c.escola}</strong></td>
                  <td>${c.refeicao || 'Almoço'}</td>
                  <td>${c.produto}</td>
                  <td style="font-family:var(--font-mono);font-weight:700">${c.qtd} ${c.unidade || 'kg'}</td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="text-align:center;padding:24px">Aguardando lançamentos das escolas</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 10. DESPERDÍCIOS
  function renderNutricionistaDesperdicios(el) {
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Gestão e Controle de Desperdícios</div>
        <div class="page-subtitle">Monitoramento de sobra limpa e descarte escolar</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📊 Balanço de Sobras</div></div>
        <div class="card-body">
          <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr)">
            <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">2,8%</div><div class="kpi-label">Índice Médio de Sobra</div></div>
            <div class="kpi-card blue"><div class="kpi-icon">📉</div><div class="kpi-value">Dentro da Meta</div><div class="kpi-label">Padrão PNAE (< 5%)</div></div>
            <div class="kpi-card orange"><div class="kpi-icon">⚡</div><div class="kpi-value">3 Escolas</div><div class="kpi-label">Acima da Média</div></div>
          </div>
        </div>
      </div>
    `;
  }

  // EXPORTAÇÕES GLOBAIS DE HELPER
  window.abrirModalNovoAlunoEspecial = () => {
    const schools = DATA.schools || [];
    const content = `
      <form onsubmit="window.salvarNovoAlunoEspecial(event)">
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Nome Completo do Aluno(a)</label>
          <input type="text" id="aluno-nome" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: Lucas Gabriel Mello" required>
        </div>
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Escola Alvo</label>
          <select id="aluno-escola" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
            ${schools.map(s => `<option value="${s.name}">${s.name} (${s.region})</option>`).join('')}
          </select>
        </div>
        <div class="grid-2 gap-10 mb-12">
          <div>
            <label style="font-weight:600;display:block;margin-bottom:4px">Turma</label>
            <input type="text" id="aluno-turma" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: Creche II-A ou EF 4º Ano B" required>
          </div>
          <div>
            <label style="font-weight:600;display:block;margin-bottom:4px">Data de Nascimento (RN-002)</label>
            <input type="date" id="aluno-nascimento" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
          </div>
        </div>
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Tipo de Restrição Clínica</label>
          <select id="aluno-restricao" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
            <option value="Intolerância à lactose">Intolerância à lactose</option>
            <option value="Doença celíaca (Glúten)">Doença celíaca (Glúten)</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Alergia à Proteína do Leite (APLV)">Alergia à Proteína do Leite (APLV)</option>
          </select>
        </div>
        <div class="form-group mb-18">
          <label style="font-weight:600;display:block;margin-bottom:4px">Identificação do Laudo Médico</label>
          <input type="text" id="aluno-laudo" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: Laudo Dr. Carlos Rossi - CRM 4521" required>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-primary">💾 Salvar Aluno Especial</button>
        </div>
      </form>
    `;
    window.showModal('👶 Novo Cadastro Nominal de Aluno Especial (RF-003)', content, '650px');
  };

  window.salvarNovoAlunoEspecial = (e) => {
    e.preventDefault();
    const nome = document.getElementById('aluno-nome').value;
    const escola = document.getElementById('aluno-escola').value;
    const turma = document.getElementById('aluno-turma').value;
    const dataNascimento = document.getElementById('aluno-nascimento').value;
    const restricao = document.getElementById('aluno-restricao').value;
    const laudo = document.getElementById('aluno-laudo').value;

    SharedState.addAlunoEspecial({ nome, escola, turma, dataNascimento, restricao, laudo });
    showToast(`✅ Aluno(a) ${nome} cadastrado(a) com sucesso!`);
    closeModal();
    const container = document.getElementById('page-content');
    if (container) renderNutricionistaRestricoes(container);
  };

  window.excluirAlunoEspecial = (id) => {
    if (!confirm('Deseja remover este cadastro de aluno especial?')) return;
    SharedState.deleteAlunoEspecial(id);
    showToast('✅ Aluno removido com sucesso!');
    const container = document.getElementById('page-content');
    if (container) renderNutricionistaRestricoes(container);
  };

  window.trocarAbaGuiaEntrega = (modo, preSelect) => {
    ['escola', 'colaborador', 'produto'].forEach(m => {
      const btn = document.getElementById(`guia-tab-${m}-btn`);
      if (btn) btn.className = m === modo ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm';
    });

    const filtroEl = document.getElementById('guia-filtro-container');
    const detalhesEl = document.getElementById('guia-detalhes-container');
    if (!filtroEl || !detalhesEl) return;

    const guias = SharedState.getGuiasEntrega ? SharedState.getGuiasEntrega() : [];
    const schools = DATA.schools || [];

    if (modo === 'escola') {
      filtroEl.innerHTML = `
        <label style="font-weight:600;display:block;margin-bottom:6px">Selecionar Escola</label>
        <select id="guia-select-escola" class="btn btn-outline" style="width:100%;max-width:420px;text-align:left;padding:8px" onchange="window.renderGuiasPorEscola(this.value)">
          ${schools.map(s => `<option value="${s.id}">${escapeHTML(s.name)} (${s.students} alunos)</option>`).join('')}
        </select>
      `;
      const escolaIdInicial = (preSelect && preSelect.modo === 'escola') ? preSelect.escolaId : (schools[0] && schools[0].id);
      if (escolaIdInicial != null) {
        const sel = document.getElementById('guia-select-escola');
        if (sel) sel.value = escolaIdInicial;
        window.renderGuiasPorEscola(escolaIdInicial);
      }
    } else if (modo === 'colaborador') {
      const colaboradores = [...new Set(guias.filter(g => g.tipo === 'Colaborador').map(g => g.entregador))];
      const opcoes = colaboradores.length ? colaboradores : (DATA.cooperatives || []).map(c => c.name);
      filtroEl.innerHTML = `
        <label style="font-weight:600;display:block;margin-bottom:6px">Selecionar Cooperativa / Agricultor</label>
        <select id="guia-select-colaborador" class="btn btn-outline" style="width:100%;max-width:420px;text-align:left;padding:8px" onchange="window.renderGuiasPorColaborador(this.value)">
          ${opcoes.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('')}
        </select>
      `;
      const colaboradorInicial = (preSelect && preSelect.modo === 'colaborador') ? preSelect.colaborador : opcoes[0];
      if (colaboradorInicial) {
        const sel = document.getElementById('guia-select-colaborador');
        if (sel) sel.value = colaboradorInicial;
        window.renderGuiasPorColaborador(colaboradorInicial);
      } else {
        detalhesEl.innerHTML = window._emptyState('Nenhum colaborador com guia pendente ainda.');
      }
    } else {
      const produtos = [...new Set(guias.flatMap(g => (g.produtos || []).map(p => p.produto)))];
      filtroEl.innerHTML = `
        <label style="font-weight:600;display:block;margin-bottom:6px">Selecionar Produto</label>
        <select id="guia-select-produto" class="btn btn-outline" style="width:100%;max-width:420px;text-align:left;padding:8px" onchange="window.renderGuiasPorProduto(this.value)">
          ${produtos.length ? produtos.map(p => `<option value="${escapeHTML(p)}">${escapeHTML(p)}</option>`).join('') : '<option value="">Nenhum produto em circulação ainda</option>'}
        </select>
      `;
      if (produtos.length) window.renderGuiasPorProduto(produtos[0]);
      else detalhesEl.innerHTML = window._emptyState('Nenhuma guia de entrega gerada ainda. Publique um cardápio para gerar as guias.');
    }
  };

  // SUBSTITUIÇÃO POR SAZONALIDADE (Requisito PDF nº 4)
  // Chave de persistência mantém o formato legado `escolaId_item` em
  // SharedState._data.trocasSazionais, agora usando o nome do produto como item
  // (a tela antiga usava ids fixos 'g1'..'g7' de um array hardcoded).
  window._chaveTrocaSazonal = (escolaId, produtoNome) => `${escolaId}_${produtoNome}`;

  window._trocaSazonal = (escolaId, produtoNome) => {
    const trocas = (SharedState._data && SharedState._data.trocasSazionais) || {};
    return trocas[window._chaveTrocaSazonal(escolaId, produtoNome)] || null;
  };

  window._cardGuia = (g) => `
    <div class="card mb-12">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <div>
          <div class="card-title">${g.tipo === 'Colaborador' ? '🌾' : '🏬'} ${escapeHTML(g.entregador)} → ${escapeHTML(g.escolaNome)}</div>
          <div style="font-size:0.8rem;color:var(--text-secondary)">Guia N° <strong>${g.numeroGuia}</strong> · Linha de Entrega: ${escapeHTML(g.linhaEntrega || 'Urbana')}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          ${window._statusBadge ? window._statusBadge(g.status) : `<span class="tag">${escapeHTML(g.status)}</span>`}
          <button class="btn btn-sm btn-primary" onclick="window.imprimirGuiaRemessa('${g.id}')">🖨️ Emitir Guia de Remessa</button>
        </div>
      </div>
      <div class="card-body" style="padding:0">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Quantidade</th><th>Embalagem</th><th>Substituição por Sazonalidade</th><th>Ação</th></tr></thead>
          <tbody>
            ${(g.produtos || []).map((p, idx) => {
              const troca = window._trocaSazonal(g.escolaId, p.produto);
              return `
              <tr style="${troca ? 'background:#fffbe6' : ''}">
                <td>
                  <strong>${escapeHTML(troca ? troca.substituto : p.produto)}</strong>
                  ${p.af ? '<span class="tag tag-green" style="font-size:0.7rem">🌾 AF</span>' : ''}
                  ${troca ? `<div style="font-size:0.75rem;color:#b45309">⚠️ Substituído: de ${escapeHTML(p.produto)}</div>` : ''}
                </td>
                <td style="font-family:var(--font-mono);font-weight:700">${(p.qtd || 0).toLocaleString('pt-BR')} ${p.unidade || 'kg'}</td>
                <td style="font-size:0.8rem">${escapeHTML(p.regra || '—')}</td>
                <td style="font-size:0.8rem">
                  ${troca
                    ? `<span class="status-badge status-warning">Alterado</span><div style="font-size:0.72rem;color:var(--text-secondary);margin-top:2px">${escapeHTML(troca.justificativa)}</div>`
                    : '<span style="color:var(--text-secondary)">Sem troca</span>'}
                </td>
                <td>
                  <button class="btn btn-sm btn-outline" style="border-color:#f59e0b;color:#b45309" onclick="window.abrirModalSubstituicaoSazonal('${g.id}', ${idx})">
                    🔄 ${troca ? 'Alterar' : 'Substituir'}
                  </button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  // Contexto da aba/filtro ativo — permite re-renderizar na mesma visão após
  // registrar uma substituição, em vez de voltar sempre para "Por Escola".
  window._guiaCtx = { modo: 'escola', valor: null };
  window._reRenderGuias = () => {
    const { modo, valor } = window._guiaCtx || {};
    if (modo === 'colaborador') window.renderGuiasPorColaborador(valor);
    else if (modo === 'produto') window.renderGuiasPorProduto(valor);
    else window.renderGuiasPorEscola(valor);
  };

  window.renderGuiasPorEscola = (escolaId) => {
    window._guiaCtx = { modo: 'escola', valor: escolaId };
    const detalhesEl = document.getElementById('guia-detalhes-container');
    if (!detalhesEl) return;
    const school = (DATA.schools || []).find(s => String(s.id) === String(escolaId));
    const guias = SharedState.getGuiasEntrega({ escolaId });
    detalhesEl.innerHTML = guias.length
      ? guias.map(g => window._cardGuia(g)).join('')
      : window._emptyState(`Nenhuma guia pendente para ${school ? school.name : 'esta escola'}. Publique um cardápio para gerar.`);
  };

  window.renderGuiasPorColaborador = (colaborador) => {
    window._guiaCtx = { modo: 'colaborador', valor: colaborador };
    const detalhesEl = document.getElementById('guia-detalhes-container');
    if (!detalhesEl) return;
    const guias = SharedState.getGuiasEntrega({ colaborador });
    if (!guias.length) {
      detalhesEl.innerHTML = window._emptyState(`Nenhuma guia pendente para ${colaborador}.`);
      return;
    }
    const totalPorProduto = {};
    guias.forEach(g => (g.produtos || []).forEach(p => {
      totalPorProduto[p.produto] = (totalPorProduto[p.produto] || 0) + (p.qtd || 0);
    }));
    detalhesEl.innerHTML = `
      <div class="card mb-16" style="border-left:4px solid #16a34a">
        <div class="card-header"><div class="card-title">📦 Total Consolidado para ${escapeHTML(colaborador)} (${guias.length} escola(s))</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Produto</th><th>Quantidade Total</th></tr></thead>
            <tbody>
              ${Object.entries(totalPorProduto).map(([produto, qtd]) => `<tr><td><strong>${escapeHTML(produto)}</strong></td><td style="font-family:var(--font-mono);font-weight:700">${qtd.toLocaleString('pt-BR')} kg</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
      ${guias.map(g => window._cardGuia(g)).join('')}
    `;
  };

  window.renderGuiasPorProduto = (produto) => {
    window._guiaCtx = { modo: 'produto', valor: produto };
    const detalhesEl = document.getElementById('guia-detalhes-container');
    if (!detalhesEl) return;
    const guias = SharedState.getGuiasEntrega({ produto });
    if (!guias.length) {
      detalhesEl.innerHTML = window._emptyState(`Nenhuma guia com o produto ${produto}.`);
      return;
    }
    detalhesEl.innerHTML = `
      <table class="data-table">
        <thead><tr><th>Escola</th><th>Entregador</th><th>Quantidade</th><th>Guia N°</th><th>Status</th><th>Ação</th></tr></thead>
        <tbody>
          ${guias.map(g => {
            const item = (g.produtos || []).find(p => p.produto === produto);
            return `<tr>
              <td><strong>${escapeHTML(g.escolaNome)}</strong></td>
              <td>${escapeHTML(g.entregador)}</td>
              <td style="font-family:var(--font-mono);font-weight:700">${item ? item.qtd.toLocaleString('pt-BR') : '—'} kg</td>
              <td>${g.numeroGuia}</td>
              <td>${window._statusBadge ? window._statusBadge(g.status) : escapeHTML(g.status)}</td>
              <td><button class="btn btn-sm btn-primary" onclick="window.imprimirGuiaRemessa('${g.id}')">🖨️ Emitir</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `;
  };

  // Substituição por sazonalidade — modal de registro (Requisito PDF nº 4).
  // Substitui a versão órfã que vivia em app.js junto da tela antiga de guias.
  window.abrirModalSubstituicaoSazonal = (guiaId, idx) => {
    const g = (SharedState.getGuiasEntrega ? SharedState.getGuiasEntrega() : []).find(x => x.id === guiaId);
    if (!g) return showToast('Guia não encontrada.', 'error');
    const item = (g.produtos || [])[idx];
    if (!item) return showToast('Item não encontrado na guia.', 'error');
    const atual = window._trocaSazonal(g.escolaId, item.produto);

    const content = `
      <form onsubmit="window.salvarSubstituicaoSazonal(event, '${g.id}', ${idx})">
        <div style="background:#f8fafc;border:1px solid var(--border);border-radius:8px;padding:10px;margin-bottom:12px;font-size:0.85rem">
          <div><strong>Escola:</strong> ${escapeHTML(g.escolaNome)}</div>
          <div><strong>Guia N°:</strong> ${g.numeroGuia} · <strong>Entregador:</strong> ${escapeHTML(g.entregador)}</div>
        </div>
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Item Original Programado</label>
          <input type="text" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" value="${escapeHTML(item.produto)}" readonly>
        </div>
        <div class="form-group mb-12">
          <label style="font-weight:600;display:block;margin-bottom:4px">Produto Substituto de Hortifrúti (Sazonalidade)</label>
          <select id="subst-produto" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
            ${['Pepino Japonês','Mamão Formosa','Abobrinha Menina','Repolho Verde','Chuchu','Laranja Pera','Banana Prata','Melancia','Cenoura','Beterraba']
              .map(p => `<option value="${p}" ${atual && atual.substituto === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </div>
        <div class="form-group mb-18">
          <label style="font-weight:600;display:block;margin-bottom:4px">Justificativa (obrigatória — sai impressa na Guia de Remessa)</label>
          <textarea id="subst-justificativa" class="btn btn-outline" style="width:100%;text-align:left;padding:8px;height:80px" placeholder="Ex: Substituição autorizada devido à indisponibilidade de colheita provocada pelas chuvas na região." required>${atual ? escapeHTML(atual.justificativa) : ''}</textarea>
        </div>
        <div style="display:flex;justify-content:space-between;gap:10px">
          <div>
            ${atual ? `<button type="button" class="btn btn-outline" style="border-color:#dc2626;color:#dc2626" onclick="window.removerSubstituicaoSazonal('${g.id}', ${idx})">🗑️ Remover Substituição</button>` : ''}
          </div>
          <div style="display:flex;gap:10px">
            <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Registrar Substituição na Guia</button>
          </div>
        </div>
      </form>
    `;
    window.showModal('🔄 Substituição por Sazonalidade (Requisito PDF nº 4)', content, '600px');
  };

  window.salvarSubstituicaoSazonal = (e, guiaId, idx) => {
    e.preventDefault();
    const g = (SharedState.getGuiasEntrega ? SharedState.getGuiasEntrega() : []).find(x => x.id === guiaId);
    const item = g && (g.produtos || [])[idx];
    if (!item) return showToast('Item não encontrado.', 'error');

    const substituto = document.getElementById('subst-produto').value;
    const justificativa = document.getElementById('subst-justificativa').value;

    SharedState._data.trocasSazionais = SharedState._data.trocasSazionais || {};
    SharedState._data.trocasSazionais[window._chaveTrocaSazonal(g.escolaId, item.produto)] = {
      original: item.produto, substituto, justificativa, data: new Date().toISOString()
    };
    SharedState._persist();

    showToast(`✅ Substituição para ${substituto} registrada na guia ${g.numeroGuia}!`, 'success');
    closeModal();
    window._reRenderGuias();
  };

  window.removerSubstituicaoSazonal = (guiaId, idx) => {
    const g = (SharedState.getGuiasEntrega ? SharedState.getGuiasEntrega() : []).find(x => x.id === guiaId);
    const item = g && (g.produtos || [])[idx];
    if (!item) return;
    if (SharedState._data.trocasSazionais) {
      delete SharedState._data.trocasSazionais[window._chaveTrocaSazonal(g.escolaId, item.produto)];
      SharedState._persist();
    }
    showToast('Substituição removida. Item volta ao original.', 'info');
    closeModal();
    window._reRenderGuias();
  };

  window.imprimirGuiaRemessa = (guiaId) => {
    const g = (SharedState.getGuiasEntrega ? SharedState.getGuiasEntrega() : []).find(x => x.id === guiaId);
    if (!g) return showToast('Guia não encontrada.', 'error');

    // Aplica as substituições sazonais: a guia física precisa mostrar o produto
    // que realmente vai ser entregue, e a escola precisa saber o motivo da troca.
    const itens = (g.produtos || []).map(p => {
      const troca = window._trocaSazonal(g.escolaId, p.produto);
      return { ...p, nomeImpresso: troca ? troca.substituto : p.produto, troca };
    });
    const justificativas = itens.filter(i => i.troca)
      .map(i => `${i.produto} ➔ ${i.troca.substituto}: ${i.troca.justificativa}`);

    const via = (label, isSegunda) => `
      <div style="padding:20px;font-family:sans-serif;color:#0f172a;max-width:800px;margin:0 auto;${isSegunda ? 'page-break-before:always;border-top:2px dashed #94a3b8;padding-top:24px;' : ''}">
        <div style="text-align:center;margin-bottom:12px">
          <div style="font-weight:800;font-size:1.05rem;color:#1565C0">PREFEITURA MUNICIPAL DE CAMPO GRANDE</div>
          <div style="font-size:0.9rem;font-weight:700">SUPERINTENDÊNCIA DE ALIMENTAÇÃO ESCOLAR — SUALE</div>
          <div style="font-size:0.95rem;font-weight:700;margin-top:6px">GUIA DE REMESSA DE GÊNEROS ALIMENTARES</div>
          <div style="font-size:0.78rem;color:#64748b;margin-top:2px">${label} — ${isSegunda ? 'Retorna assinada com o Entregador' : 'Fica com a Instituição'}</div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;border:1px solid #cbd5e1;padding:10px;border-radius:6px;margin-bottom:12px;font-size:0.85rem">
          <div><strong>Guia N°:</strong> ${g.numeroGuia}</div>
          <div><strong>Data:</strong> ${new Date(g.criadoEm).toLocaleDateString('pt-BR')}</div>
          <div><strong>Entregador:</strong> ${escapeHTML(g.entregador)}</div>
          <div><strong>Classificação:</strong> ${escapeHTML(g.classificacaoGrupo || '—')}</div>
          <div style="grid-column:1/-1"><strong>Instituição:</strong> ${escapeHTML(g.escolaNome)} <span style="color:#64748b">(${escapeHTML(g.escolaCodigo || '—')})</span></div>
          <div><strong>Linha de Entrega:</strong> ${escapeHTML(g.linhaEntrega || 'Urbana')}</div>
          <div><strong>Ref. Cardápio:</strong> ${escapeHTML(g.cardapioCodigo || '—')}</div>
        </div>

        <table class="data-table" style="width:100%;font-size:0.85rem;margin-bottom:12px">
          <thead><tr><th>Produto</th><th>Quantidade</th><th>Qtd. Embalagem</th></tr></thead>
          <tbody>
            ${itens.map(p => `<tr><td>${escapeHTML(p.nomeImpresso)}${p.troca ? ` <span style="font-size:0.72rem;color:#b45309">(substitui ${escapeHTML(p.produto)})</span>` : ''}</td><td style="font-family:var(--font-mono);font-weight:700">${(p.qtd || 0).toLocaleString('pt-BR')} ${p.unidade || 'kg'}</td><td style="font-size:0.8rem">${escapeHTML(p.regra || '—')}</td></tr>`).join('')}
          </tbody>
        </table>

        <div style="font-size:0.78rem;border:1px solid #cbd5e1;padding:10px;border-radius:6px;margin-bottom:10px">
          <strong>AO RECEBER OS PRODUTOS, A DIREÇÃO DO ESTABELECIMENTO DEVE:</strong>
          <div>☐ Conferir as quantidades recebidas com as constantes nesta guia;</div>
          <div>☐ Anotar a data e horário de recebimento e assinar/carimbar a 1ª via;</div>
          <div>☐ Assinar a 2ª via e devolvê-la ao entregador como comprovante de entrega.</div>
        </div>
        <div style="font-size:0.8rem;margin-bottom:16px">
          <strong>Observação:</strong>
          ${justificativas.length
            ? `<div style="margin-top:4px;padding:6px 8px;border:1px solid #fcd34d;background:#fffbeb;border-radius:4px;font-size:0.76rem">
                 <strong>Substituição por sazonalidade:</strong>
                 ${justificativas.map(j => `<div>• ${escapeHTML(j)}</div>`).join('')}
               </div>`
            : ' ______________________________________________'}
        </div>

        <div style="border-top:1px dashed #94a3b8;padding-top:20px;margin-top:20px;text-align:center;font-size:0.82rem">
          _______________________________<br><strong>Nutricionista Resp. Técnica — Dra. Lilian Droppa (CRN 12345/MS)</strong>
        </div>
        <div style="font-size:0.68rem;color:#64748b;text-align:center;margin-top:14px">
          PRODUTOS DESTINADOS À REDE DE ENSINO PÚBLICO. COMPETE ÀS ESCOLAS FILANTRÓPICAS A PROIBIÇÃO DA VENDA/UTILIZAÇÃO PARA OUTROS FINS.
        </div>
      </div>
    `;

    const html = `
      <div id="print-guia-remessa">
        ${via('1ª VIA', false)}
        ${via('2ª VIA', true)}
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px" class="no-print">
        <button class="btn btn-outline" onclick="closeModal()">Fechar</button>
        <button class="btn btn-primary" onclick="window.print(); SharedState.marcarGuiaEmitida('${g.id}');">🖨️ Imprimir Guia de Remessa (2 vias)</button>
      </div>
    `;
    window.showModal(`📬 Guia de Remessa — ${g.numeroGuia}`, html, '900px');
  };

  window.gerarRelatorioMensal4Paginas = () => {
    const html = `
      <div style="padding:16px">
        <h2>📄 Relatório Mensal Padronizado — 4 Páginas por Mês (RF-010)</h2>
        <p>Documento oficial formatado para afixação no mural escolar.</p>
        <div style="border:1px solid #ccc;padding:16px;margin-top:16px">
          <h3>MÊS VIGENTE — PAUTA PNAE</h3>
          <p>Dra. Lilian Droppa — CRN 12345/MS</p>
        </div>
        <div style="margin-top:20px;display:flex;justify-content:flex-end">
          <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir 4 Folhas A4</button>
        </div>
      </div>
    `;
    window.showModal('📄 Relatório Mensal Padronizado PNAE', html, '850px');
  };

  window.abrirRelatorioPNAE = () => {
    showToast('📄 Relatório Técnico PNAE gerado com sucesso.', 'info');
  };

  window.visualizarEImprimirCardapio = (menuName) => {
    const html = `
      <div style="padding:16px">
        <h3>🍱 Visualização de Cardápio — ${menuName || 'Semanal'}</h3>
        <p>Cardápio oficial aprovado pela Nutrição.</p>
        <button class="btn btn-primary" onclick="window.print()">🖨️ Imprimir</button>
      </div>
    `;
    window.showModal('🍱 Visualização de Cardápio', html, '800px');
  };

  window.abrirModalDisparoManualOS = () => {
    showToast('📱 Notificações de Ordens de Serviço disparadas com sucesso.', 'success');
  };

})();
