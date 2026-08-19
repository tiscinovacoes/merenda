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


  // === Migrado do app.js (Fase 4) ===
  PAGE_RENDERERS.nutricionista_dashboard = (el) => {
    const totalStudents = DATA.schools.reduce((a, s) => a + s.students, 0);
    el.innerHTML = `
      <div class="page-header"><div class="page-title">Dashboard Nutricional</div><div class="page-subtitle">Planejamento e acompanhamento nutricional da rede municipal</div></div>
      <div class="kpi-grid">
        <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${DATA.schools.length}</div><div class="kpi-label">Escolas Atendidas</div></div>
        <div class="kpi-card green"><div class="kpi-icon">👨‍🎓</div><div class="kpi-value">${(totalStudents/1000).toFixed(1)}K</div><div class="kpi-label">Alunos Atendidos</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">🍽️</div><div class="kpi-value">4</div><div class="kpi-label">Cardápios Ativos</div></div>
        <div class="kpi-card blue"><div class="kpi-icon">📊</div><div class="kpi-value">43.200</div><div class="kpi-label">Consumo Previsto (kg)</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">📈</div><div class="kpi-value">41.600</div><div class="kpi-label">Consumo Real (kg)</div></div>
        <div class="kpi-card red"><div class="kpi-icon">🗑️</div><div class="kpi-value">3,7%</div><div class="kpi-label">Índice de Desperdício</div><div class="kpi-trend down">▼ -0,5% vs mês anterior</div></div>
      </div>
      <div class="grid-2-1">
        <div class="card"><div class="card-header"><div class="card-title">📈 Consumo Previsto vs Real</div></div>
          <div class="card-body"><div class="chart-container h-300"><canvas id="chart-nutri-consumo"></canvas></div></div>
        </div>
        <div class="card"><div class="card-header"><div class="card-title">🚨 Alertas Nutricionais</div></div>
          <div class="card-body">
            <div class="alert-list">
              <div class="alert-item danger"><span class="alert-icon">🔴</span><div class="alert-text"><strong>5 produtos</strong> com estoque insuficiente para o cardápio vigente</div></div>
              <div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>Cardápio Julho</strong> sem cobertura completa de ingredientes</div></div>
              <div class="alert-item warning"><span class="alert-icon">🟡</span><div class="alert-text"><strong>3 escolas</strong> com consumo 20% abaixo do previsto</div></div>
              <div class="alert-item info"><span class="alert-icon">🤖</span><div class="alert-text"><strong>IA sugere:</strong> Substituir Maçã por Banana Prata (safra atual)</div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="ia-card" style="margin-top:24px">
        <div class="ia-card-title">🤖 IA Nutricional <span class="ia-badge">SUGESTÕES</span></div>
        <div class="ia-suggestion">🔄 Substituir <strong>Melancia</strong> por <strong>Manga Tommy</strong> — safra atual com 18% menos custo</div>
        <div class="ia-suggestion">📉 Reduzir porção de <strong>Arroz</strong> de 120g para 110g — economia de 3.200 kg/mês sem impacto nutricional</div>
        <div class="ia-suggestion">🌾 Priorizar <strong>Mandioca</strong> e <strong>Batata Doce</strong> — alta disponibilidade na agricultura familiar</div>
      </div>
    `;
    setTimeout(() => {
      createChart('chart-nutri-consumo', {
        type: 'line',
        data: {
          labels: DATA.months.slice(0, 6),
          datasets: [
            { label: 'Previsto (kg)', data: [42000, 38500, 45200, 41800, 43900, 43200], borderColor: CHART_COLORS.blue, backgroundColor: CHART_COLORS.blueFill, fill: true, tension: 0.4 },
            { label: 'Real (kg)', data: [40800, 37200, 44100, 40500, 42300, 41600], borderColor: CHART_COLORS.green, tension: 0.4 },
          ]
        },
        options: { ...CHART_DEFAULTS, plugins: { ...CHART_DEFAULTS.plugins, legend: { position: 'bottom' } } }
      });
    }, 100);
  };

  PAGE_RENDERERS.nutricionista_fichas = (el) => {
    const todas = mergeFichas();
    const salvas = todas.length - _FICHAS_DEMO.length;
  
    el.innerHTML = `
      <div class="page-header"><div class="page-title">Fichas Técnicas de Preparação</div><div class="page-subtitle">Gestão de receitas, ingredientes e cálculo nutricional (Padrão FNDE/PNAE)</div></div>
  
      <div class="card mb-24">
        <div class="card-body" style="display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap">
          <div class="header-search-box" style="flex:1;max-width:300px;margin:0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            <input type="search" id="search-fichas" placeholder="Buscar receita..." oninput="filterFichas()" style="width:100%">
          </div>
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="font-size:0.8rem;color:var(--text-secondary)">${salvas} salva${salvas !== 1 ? 's' : ''} + ${_FICHAS_DEMO.length} demo</span>
            <button class="btn btn-outline" onclick="PAGE_RENDERERS.nutricionista_simulacoes(document.getElementById('page-content'))">🔬 Simular Enquadramento PNAE</button>
            <button class="btn btn-primary" onclick="showCreateFichaForm(true)" style="background:linear-gradient(135deg, #0284c7 0%, #0369a1 100%);border:none;box-shadow:0 2px 8px rgba(2,132,199,0.25)">🤖 Gerar Ficha Técnica com IA (Estoque)</button>
            <button class="btn btn-outline" onclick="showCreateFichaForm()">+ Nova Ficha Manual</button>
          </div>
        </div>
      </div>
  
      <div id="fichas-container" class="grid-3 mb-24">
        ${todas.map(_renderFichaCard).join('')}
      </div>
    `;
  };

  PAGE_RENDERERS.nutricionista_produtos = (el) => {
    const alimentos = (typeof DATA !== 'undefined' && DATA.alimentos) ? DATA.alimentos :
                      (typeof ALIMENTOS_PNAE !== 'undefined' ? ALIMENTOS_PNAE : []);
    const categorias = [...new Set(alimentos.map(a => a.category))].sort();
  
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Tabela de Alimentos PNAE</div>
        <div class="page-subtitle">Base oficial FNDE/TACO — ${alimentos.length} alimentos com composição nutricional por 100g</div>
      </div>
  
      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card blue"><div class="kpi-icon">🥗</div><div class="kpi-value">${alimentos.length}</div><div class="kpi-label">Alimentos Cadastrados</div></div>
        <div class="kpi-card green"><div class="kpi-icon">🏷️</div><div class="kpi-value">${categorias.length}</div><div class="kpi-label">Categorias</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">🌾</div><div class="kpi-value">${alimentos.filter(a=>a.family_farm).length}</div><div class="kpi-label">Agricultura Familiar</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">📊</div><div class="kpi-value">TACO/IBGE</div><div class="kpi-label">Fonte dos Dados</div></div>
      </div>
  
      <div class="card">
        <div class="card-header">
          <div class="card-title">Catálogo de Alimentos</div>
          <div style="display:flex;gap:10px;align-items:center">
            <select id="filter-cat" style="padding:6px 12px;border:1px solid var(--border);border-radius:var(--radius-md);font-size:0.85rem;background:var(--surface-1)">
              <option value="">Todas as categorias</option>
              ${categorias.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <div style="display:flex;align-items:center;gap:6px;background:var(--surface-1);border:1px solid var(--border);border-radius:var(--radius-md);padding:0 12px">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <input type="search" id="search-alimentos" placeholder="Buscar alimento ou código..." style="border:none;background:none;padding:8px 0;font-size:0.85rem;outline:none;width:240px">
            </div>
          </div>
        </div>
        <div class="card-body" style="padding:0">
          <div id="alimentos-table-wrap" style="overflow-x:auto">
            <table class="data-table" id="alimentos-table">
              <thead>
                <tr>
                  <th style="width:100px">Código</th>
                  <th>Nome do Alimento</th>
                  <th>Categoria</th>
                  <th style="text-align:right">Kcal/100g</th>
                  <th style="text-align:right">Prot. (g)</th>
                  <th style="text-align:right">Lip. (g)</th>
                  <th style="text-align:right">Carb. (g)</th>
                  <th style="text-align:right">Sódio (mg)</th>
                  <th>Ag. Familiar</th>
                </tr>
              </thead>
              <tbody id="alimentos-tbody"></tbody>
            </table>
          </div>
          <div id="alimentos-pagination" style="display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-top:1px solid var(--border);font-size:0.82rem;color:var(--text-secondary)">
            <span id="alimentos-info"></span>
            <div style="display:flex;gap:6px">
              <button id="btn-prev-al" class="btn btn-ghost btn-sm">‹ Anterior</button>
              <span id="alimentos-pages" style="display:flex;gap:4px"></span>
              <button id="btn-next-al" class="btn btn-ghost btn-sm">Próximo ›</button>
            </div>
          </div>
        </div>
      </div>
    `;
  
    // ── Pagination state ──
    let currentPage = 1;
    const PAGE_SIZE = 25;
    let filtered = alimentos;
  
    function renderTable() {
      const tbody = document.getElementById('alimentos-tbody');
      if (!tbody) return;
      const start = (currentPage - 1) * PAGE_SIZE;
      const slice = filtered.slice(start, start + PAGE_SIZE);
      const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  
      tbody.innerHTML = slice.map(a => `
        <tr>
          <td><span style="font-family:var(--font-mono,monospace);font-size:0.78rem;background:var(--primary-50);color:var(--primary);padding:2px 8px;border-radius:4px;font-weight:600">${a.code}</span></td>
          <td style="font-weight:500;max-width:280px">${a.name}</td>
          <td><span class="status-badge status-info" style="font-size:0.72rem">${a.category}</span></td>
          <td style="text-align:right;font-weight:600;color:var(--primary)">${a.kcal_per_100g || 0}</td>
          <td style="text-align:right">${a.protein_per_100g || 0}</td>
          <td style="text-align:right">${a.fat_per_100g || 0}</td>
          <td style="text-align:right">${a.carb_per_100g || 0}</td>
          <td style="text-align:right">${a.sodium_per_100g || 0}</td>
          <td style="text-align:center">${a.family_farm ? '<span style="color:#2E7D32;font-weight:600">✓ Sim</span>' : '<span style="color:#94A3B8">Não</span>'}</td>
        </tr>
      `).join('') || '<tr><td colspan="9" style="text-align:center;color:var(--text-secondary);padding:32px">Nenhum alimento encontrado</td></tr>';
  
      // Info
      const infoEl = document.getElementById('alimentos-info');
      if (infoEl) infoEl.textContent = `Exibindo ${start+1}–${Math.min(start+PAGE_SIZE, filtered.length)} de ${filtered.length} alimentos`;
  
      // Page buttons
      const pagesEl = document.getElementById('alimentos-pages');
      if (pagesEl) {
        const showPages = [];
        for (let p = Math.max(1, currentPage-2); p <= Math.min(totalPages, currentPage+2); p++) showPages.push(p);
        pagesEl.innerHTML = showPages.map(p =>
          `<button onclick="window._setAlPage(${p})" style="width:30px;height:30px;border-radius:6px;border:1px solid var(--border);background:${p===currentPage?'var(--primary)':'var(--surface-1)'};color:${p===currentPage?'white':'inherit'};cursor:pointer;font-size:0.8rem">${p}</button>`
        ).join('');
      }
  
      const prevBtn = document.getElementById('btn-prev-al');
      const nextBtn = document.getElementById('btn-next-al');
      if (prevBtn) prevBtn.disabled = currentPage === 1;
      if (nextBtn) nextBtn.disabled = currentPage === totalPages;
    }
  
    function applyFilters() {
      const search = (document.getElementById('search-alimentos')?.value || '').toLowerCase();
      const cat = document.getElementById('filter-cat')?.value || '';
      filtered = alimentos.filter(a => {
        const matchCat = !cat || a.category === cat;
        const matchSearch = !search || a.name.toLowerCase().includes(search) || a.code.toLowerCase().includes(search);
        return matchCat && matchSearch;
      });
      currentPage = 1;
      renderTable();
    }
  
    window._setAlPage = (p) => { currentPage = p; renderTable(); };
  
    document.getElementById('search-alimentos')?.addEventListener('input', applyFilters);
    document.getElementById('filter-cat')?.addEventListener('change', applyFilters);
    document.getElementById('btn-prev-al')?.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderTable(); } });
    document.getElementById('btn-next-al')?.addEventListener('click', () => { if (currentPage < Math.ceil(filtered.length / PAGE_SIZE)) { currentPage++; renderTable(); } });
  
    renderTable();
  };

  PAGE_RENDERERS.nutricionista_cardapios = (el) => {
    const readOnly = state.currentProfile === 'escola';
    const sharedMenus = SharedState.getMenus();
    const legacy = JSON.parse(localStorage.getItem('cardapios_publicados') || '[]').map((c, i) => ({
      id: 'legacy-' + i,
      nome: c.nome,
      periodo: c.periodo,
      escolas: c.escolas === 'Todas' ? ((DATA.schools||[]).length || 183) : (parseInt(c.escolas) || 0),
      status: c.status,
      autor: c.autor || 'Dra. Lilian Droppa',
      criadoEm: c.criadoEm || '2026-06-25',
    }));
    const allCardapios = [...legacy, ...sharedMenus];
    const totalSchools = (DATA.schools||[]).length || 183;
  
    // Separar em Elaboração x Publicados
    const emElaboracao = allCardapios.filter(c => c.status !== 'Publicado');
    const publicados    = allCardapios.filter(c => c.status === 'Publicado');
  
    // Helper para linha da tabela principal
    const _row = (c, i, allowEdit, allowPublish) => {
      const periodoStr = c.periodo || `${(c.data_inicio||'').split('-').reverse().join('/')} a ${(c.data_fim||'').split('-').reverse().join('/')}`;
      return `
        <tr>
          <td>
            <span class="tag tag-blue" style="font-size:0.75rem; font-family:var(--font-mono); margin-right:4px;">${c.codigoCardapio || 'CARD-2026/08-101'}</span>
            <strong>${c.nome}</strong>
          </td>
          <td>${periodoStr}</td>
          <td style="font-family:var(--font-mono)">${c.escolas || '—'}</td>
          <td style="font-size:0.82rem">${c.autor || '—'} <span style="font-size:0.7rem; color:#64748b;">(${c.criadoPorUserId || 'ID-002'})</span></td>
          <td>
            <div style="display:flex;gap:4px;flex-wrap:wrap">
              <button class="table-action" style="color:#0284c7;font-weight:700" onclick="window.visualizarEImprimirCardapio('${(c.nome||'').replace(/'/g,"\\'")}')">👁️ Visualizar</button>
              ${allowEdit ? `<button class="table-action" onclick="editarCardapio('${c.id || i}')">✏️ Editar</button>` : ''}
              ${allowPublish && !readOnly ? `<button class="table-action" style="color:#16a34a;font-weight:700;border:1px solid #16a34a;border-radius:4px;padding:2px 8px" onclick="window.publicarCardapio('${c.id || i}')">🚀 Publicar</button>` : ''}
              ${!readOnly ? `<button class="table-action" style="color:var(--danger)" onclick="excluirCardapio('${c.id || i}')">🗑️ Excluir</button>` : ''}
            </div>
          </td>
        </tr>`;
    };
  
    const _emptyRow = (cols, msg) =>
      `<tr><td colspan="${cols}" style="text-align:center;padding:24px;color:var(--text-secondary);font-style:italic">${msg}</td></tr>`;
  
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">${readOnly ? 'Cardápios da Rede' : 'Gestão de Cardápios'}</div>
        <div class="page-subtitle">${readOnly ? 'Cardápios elaborados pela Nutricionista SEMED e distribuídos à sua escola' : 'Elaboração, publicação, edição e exclusão de cardápios escolares'}</div>
      </div>
  
      ${!readOnly ? `
      <div class="card mb-24">
        <div class="card-body" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div>
            <div style="font-weight:600">Planejador de Cardápios</div>
            <div style="font-size:0.82rem;color:var(--text-secondary)">Cardápios publicados aqui aparecem imediatamente nas ${totalSchools} escolas da rede e no painel do Gestor</div>
          </div>
          <div style="display:flex;gap:10px">
            <button class="btn btn-secondary" onclick="window.abrirRelatorioMensal4Paginas()">📄 Relatório Mensal (4 Páginas/Mês)</button>
            <button class="btn btn-primary" onclick="showMenuPlanner()">+ Abrir Planejador Semanal</button>
          </div>
        </div>
      </div>` : `
      <div class="card mb-24" style="border-left:4px solid var(--primary)">
        <div class="card-body" style="display:flex;justify-content:space-between;align-items:center;gap:12px">
          <div>
            <div style="font-weight:700">📖 Cardápios recebidos da SEMED</div>
            <div style="font-size:0.82rem;color:var(--text-secondary)">Visão somente leitura — apenas a Nutricionista SEMED pode editar</div>
          </div>
          <button class="btn btn-outline btn-sm" onclick="navigateTo('escola','planejamento')">Ver Planejamento Semanal →</button>
        </div>
      </div>`}
  
      <!-- SEÇÃO 1: Em Elaboração -->
      <div class="card mb-24">
        <div class="card-header">
          <div class="card-title">✏️ Cardápios em Elaboração</div>
          <span class="status-badge status-info">${emElaboracao.length}</span>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table"><thead><tr><th>Nome</th><th>Período</th><th>Escolas Vinculadas</th><th>Autor</th><th>Ações</th></tr></thead><tbody>
            ${emElaboracao.length > 0
              ? emElaboracao.map((c, i) => _row(c, i, true, true)).join('')
              : _emptyRow(5, 'Nenhum cardápio em elaboração no momento')}
          </tbody></table>
        </div>
      </div>
  
      <!-- SEÇÃO 2: Publicados -->
      <div class="card mb-24">
        <div class="card-header">
          <div class="card-title">✅ Cardápios Publicados</div>
          <span class="status-badge status-ok">${publicados.length}</span>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table"><thead><tr><th>Nome</th><th>Período</th><th>Escolas Vinculadas</th><th>Autor</th><th>Ações</th></tr></thead><tbody>
            ${publicados.length > 0
              ? publicados.map((c, i) => _row(c, i, false, false)).join('')
              : _emptyRow(5, 'Nenhum cardápio publicado ainda')}
          </tbody></table>
        </div>
      </div>
  
    `;
  };

  PAGE_RENDERERS.nutricionista_estoquesual = (el) => {
    const products = DATA.products || [];
    const zerados = products.filter(p => (p.stock || 0) === 0);
    const emRisco = products.filter(p => (p.daysLeft || 0) > 0 && (p.daysLeft || 0) <= 5);
    const afItens = products.filter(p => p.familyFarm);
  
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">📦 Estoque Consolidado SUAL (Modo Leitura — Nutrição)</div>
        <div class="page-subtitle">Acompanhamento dos níveis de estoque central, risco de desabastecimento e itens zerados sem movimentação física</div>
      </div>
  
      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card blue"><div class="kpi-icon">📦</div><div class="kpi-value">${products.length}</div><div class="kpi-label">Itens no Catálogo SUAL</div></div>
        <div class="kpi-card red"><div class="kpi-icon">🚫</div><div class="kpi-value">${zerados.length}</div><div class="kpi-label">Itens Zerados</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${emRisco.length}</div><div class="kpi-label">Em Risco (< 5 dias)</div></div>
        <div class="kpi-card green"><div class="kpi-icon">🌽</div><div class="kpi-value">${afItens.length}</div><div class="kpi-label">Agricultura Familiar</div></div>
      </div>
  
      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">🔍 Consulta de Insumos da Central SUAL</div>
          <div style="font-size:0.82rem;color:var(--text-secondary);background:#f1f5f9;padding:4px 12px;border-radius:20px">
            🔒 Perfil Nutricionista: Visualização em tempo real (Sem permissão de baixa)
          </div>
        </div>
        <div class="card-body" style="padding:0">
          <div style="overflow-x:auto">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Produto / Insumo</th>
                  <th>Categoria</th>
                  <th>Origem</th>
                  <th>Estoque Atual</th>
                  <th>Consumo Médio/Dia</th>
                  <th>Autonomia Estimada</th>
                  <th>Status SUAL</th>
                </tr>
              </thead>
              <tbody>
                ${products.map(p => {
                  const isZero = (p.stock || 0) === 0;
                  const isLow = (p.daysLeft || 0) <= 5 && !isZero;
                  const statusBadge = isZero
                    ? '<span class="status-badge status-danger">Zerado</span>'
                    : isLow
                    ? '<span class="status-badge status-warning">Risco (< 5 dias)</span>'
                    : '<span class="status-badge status-ok">OK</span>';
  
                  return `
                    <tr style="${isZero ? 'background:#fef2f2' : isLow ? 'background:#fffbe6' : ''}">
                      <td><strong>${p.name}</strong></td>
                      <td><span class="tag tag-blue">${p.category}</span></td>
                      <td>${p.familyFarm ? '<span style="color:#2E7D32;font-weight:700">🌽 Agric. Familiar</span>' : 'Pregão Central'}</td>
                      <td style="font-family:var(--font-mono);font-weight:700">${(p.stock || 0).toLocaleString('pt-BR')} ${p.unit}</td>
                      <td style="font-family:var(--font-mono)">${p.avgConsume || 0} ${p.unit}/dia</td>
                      <td style="font-family:var(--font-mono);font-weight:700;color:${isZero ? 'var(--danger)' : isLow ? '#c2410c' : '#1565C0'}">
                        ${isZero ? '0 dias (Esgotado)' : `${p.daysLeft} dias`}
                      </td>
                      <td>${statusBadge}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  };

  PAGE_RENDERERS.nutricionista_planejamento = (el) => {
    PAGE_RENDERERS.gestor_planejamento(el);
    const header = el.querySelector('.page-header');
    if (header) {
      header.insertAdjacentHTML('afterend', `<div style="background:var(--warning-light);border:1px solid var(--warning);padding:12px;border-radius:var(--radius-md);margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;"><div><strong>⚠️ Área em Validação:</strong> Esta tela de planejamento está em fase de testes e co-criação com a equipe de nutrição.</div><button class="btn btn-primary btn-sm" onclick="alert('Formulário de feedback da Nutricionista aberto!')">Dar Feedback</button></div>`);
    }
  };

  PAGE_RENDERERS.nutricionista_consumo = (el) => {
    // Consolida todos os registros de consumo do SharedState
    const todos = SharedState.getConsumo();
    const porProduto = {};
    const porEscola = {};
    todos.forEach(c => {
      porProduto[c.produto] = (porProduto[c.produto] || 0) + (c.qtd || 0);
      porEscola[c.escola] = (porEscola[c.escola] || 0) + (c.qtd || 0);
    });
    const rankProdutos = Object.entries(porProduto).sort((a,b) => b[1]-a[1]).slice(0, 10);
    const rankEscolas = Object.entries(porEscola).sort((a,b) => b[1]-a[1]).slice(0, 10);
    const totalKg = todos.reduce((s,c) => s + (c.qtd||0), 0);
  
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Monitoramento de Consumo</div>
        <div class="page-subtitle">Consolidação em tempo real dos registros das escolas · Comparativo previsto vs realizado</div>
      </div>
  
      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
        <div class="kpi-card blue"><div class="kpi-icon">📝</div><div class="kpi-value">${todos.length}</div><div class="kpi-label">Registros das Escolas</div></div>
        <div class="kpi-card green"><div class="kpi-icon">⚖️</div><div class="kpi-value">${totalKg.toLocaleString('pt-BR')}</div><div class="kpi-label">Total Consumido</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">🏫</div><div class="kpi-value">${Object.keys(porEscola).length}</div><div class="kpi-label">Escolas Reportando</div></div>
        <div class="kpi-card teal"><div class="kpi-icon">🥕</div><div class="kpi-value">${Object.keys(porProduto).length}</div><div class="kpi-label">Produtos Diferentes</div></div>
      </div>
  
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><div class="card-title">🥇 Produtos Mais Consumidos (Real)</div></div>
          <div class="card-body" style="padding:0">
            <table class="data-table"><thead><tr><th>Produto</th><th>Total</th><th>%</th></tr></thead><tbody>
              ${rankProdutos.map(([p, q]) => {
                const pct = totalKg > 0 ? Math.round(q / totalKg * 100) : 0;
                return `<tr>
                  <td><strong>${p}</strong></td>
                  <td style="font-family:var(--font-mono)">${q.toLocaleString('pt-BR')}</td>
                  <td><div style="display:flex;align-items:center;gap:6px"><div class="progress-bar" style="width:60px"><div class="progress-fill blue" style="width:${pct}%"></div></div><span style="font-family:var(--font-mono);font-size:0.78rem">${pct}%</span></div></td>
                </tr>`;
              }).join('') || '<tr><td colspan="3" style="text-align:center;padding:24px;color:var(--text-secondary)">Aguardando registros das escolas</td></tr>'}
            </tbody></table>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">🏫 Consumo por Escola</div></div>
          <div class="card-body" style="padding:0">
            <table class="data-table"><thead><tr><th>Escola</th><th>Total</th><th>Registros</th></tr></thead><tbody>
              ${rankEscolas.map(([e, q]) => {
                const n = todos.filter(c => c.escola === e).length;
                return `<tr>
                  <td><strong>${e}</strong></td>
                  <td style="font-family:var(--font-mono)">${q.toLocaleString('pt-BR')}</td>
                  <td style="font-family:var(--font-mono)">${n}</td>
                </tr>`;
              }).join('') || '<tr><td colspan="3" style="text-align:center;padding:24px;color:var(--text-secondary)">—</td></tr>'}
            </tbody></table>
          </div>
        </div>
      </div>
  
      <div class="card" style="margin-top:16px">
        <div class="card-header"><div class="card-title">📋 Registros Recentes</div>${todos.length ? '<span class="status-badge status-ok">'+todos.length+'</span>' : ''}</div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Data</th><th>Escola</th><th>Refeição</th><th>Produto</th><th>Qtd</th><th>Responsável</th></tr></thead>
            <tbody>
              ${todos.slice(0, 15).map(c => `
                <tr>
                  <td style="font-size:0.82rem">${c.data || (c.criadoEm||'').slice(0,10)}</td>
                  <td>${c.escola}</td>
                  <td>${c.refeicao || '—'}</td>
                  <td><strong>${c.produto}</strong></td>
                  <td style="font-family:var(--font-mono)">${c.qtd} ${c.unidade || ''}</td>
                  <td style="font-size:0.82rem">${c.responsavel || '—'}</td>
                </tr>
              `).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhum registro — aguardando escolas registrarem consumo em /consumo</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
  
      <div class="card" style="margin-top:16px">
        <div class="card-header"><div class="card-title">📊 Previsto vs Realizado (Referência mensal)</div></div>
        <div class="card-body"><div class="chart-container h-300"><canvas id="chart-comparativo"></canvas></div></div>
      </div>
    `;
    setTimeout(() => {
      createChart('chart-comparativo', {
        type: 'bar',
        data: {
          labels: ['Arroz', 'Feijão', 'Leite', 'Frango', 'Banana', 'Tomate', 'Cenoura', 'Carne'],
          datasets: [
            { label: 'Previsto (kg)', data: [25500, 12600, 36000, 23400, 18000, 12000, 9300, 15600], backgroundColor: CHART_COLORS.blue, borderRadius: 4 },
            { label: 'Consumido (kg)', data: [24800, 11900, 34200, 22100, 16800, 11200, 9100, 14800], backgroundColor: CHART_COLORS.green, borderRadius: 4 },
          ]
        },
        options: CHART_DEFAULTS
      });
    }, 100);
  };

  PAGE_RENDERERS.nutricionista_desperdicios = (el) => {
    // Estima desperdício por escola: total recebido (stockAdjust +) - total consumido = sobra estimada
    const adj = SharedState.getStockAdjust();
    const consumo = SharedState.getConsumo();
    const perEsc = {};
    adj.filter(a => a.delta > 0).forEach(a => {
      perEsc[a.escola] = perEsc[a.escola] || { recebido: 0, consumido: 0 };
      perEsc[a.escola].recebido += a.delta;
    });
    consumo.forEach(c => {
      perEsc[c.escola] = perEsc[c.escola] || { recebido: 0, consumido: 0 };
      perEsc[c.escola].consumido += c.qtd || 0;
    });
    const sobras = Object.entries(perEsc).map(([e, d]) => ({ escola: e, recebido: d.recebido, consumido: d.consumido, sobra: Math.max(0, d.recebido - d.consumido) }));
    const totalSobra = sobras.reduce((s, x) => s + x.sobra, 0);
    const totalRec = sobras.reduce((s, x) => s + x.recebido, 0);
    const pctReal = totalRec > 0 ? Math.round(totalSobra / totalRec * 1000) / 10 : 0;
  
    el.innerHTML = `
      <div class="page-header"><div class="page-title">Gestão de Desperdícios</div><div class="page-subtitle">Monitoramento e controle de sobras · Cálculo real: recebido - consumido por escola</div></div>
  
      <div class="kpi-grid">
        <div class="kpi-card red"><div class="kpi-icon">🗑️</div><div class="kpi-value" id="waste-total-pct">${pctReal || '3,7'}%</div><div class="kpi-label">Índice ${pctReal ? 'Real' : 'Estimado'}</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">📊</div><div class="kpi-value" id="waste-total-kg">${totalSobra ? totalSobra.toLocaleString('pt-BR') : '1.598'}</div><div class="kpi-label">kg Sobrando</div></div>
        <div class="kpi-card green"><div class="kpi-icon">📉</div><div class="kpi-value">${sobras.length}</div><div class="kpi-label">Escolas c/ Registro</div></div>
      </div>
  
      ${sobras.length > 0 ? `
      <div class="card mb-24">
        <div class="card-header"><div class="card-title">🏫 Balanço por Escola (Recebido vs Consumido)</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Escola</th><th>Recebido</th><th>Consumido</th><th>Sobra</th><th>% Sobra</th></tr></thead>
            <tbody>
              ${sobras.sort((a,b)=>b.sobra-a.sobra).map(x => {
                const pct = x.recebido > 0 ? Math.round(x.sobra / x.recebido * 100) : 0;
                return `<tr>
                  <td><strong>${x.escola}</strong></td>
                  <td style="font-family:var(--font-mono)">${x.recebido.toLocaleString('pt-BR')}</td>
                  <td style="font-family:var(--font-mono);color:var(--success)">${x.consumido.toLocaleString('pt-BR')}</td>
                  <td style="font-family:var(--font-mono);color:${x.sobra > 0 ? 'var(--warning)' : 'var(--text-secondary)'}">${x.sobra.toLocaleString('pt-BR')}</td>
                  <td><div style="display:flex;align-items:center;gap:6px"><div class="progress-bar" style="width:60px"><div class="progress-fill ${pct>20?'red':pct>10?'orange':'green'}" style="width:${pct}%"></div></div><span style="font-family:var(--font-mono);font-size:0.78rem">${pct}%</span></div></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>` : ''}
  
      <div class="grid-2 mb-24">
        <div class="card">
          <div class="card-header"><div class="card-title">Registrar Sobras / Desperdício por Escola</div></div>
          <div class="card-body">
            <form id="form-log-waste" onsubmit="handleLogWaste(event)">
              <div class="form-group">
                <label>Selecione a Escola</label>
                ${state.currentProfile === 'escola' ? 
                  `<input class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:not-allowed" id="waste-school" value="${window.PROFILES[state.currentProfile].role}" readonly>` :
                  `<select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="waste-school" required>
                    <option value="EMTI PROF. IRACEMA">EMTI PROFª IRACEMA MARIA VICENTE</option>
                    <option value="EMRTI GOV. ARNALDO">EMRTI AGRICOLA GOVERNADOR ARNALDO ESTEVAO DE FIGUEREDO</option>
                    <option value="EM ADV. DEMOSTHENES M.">EM ADV. DEMOSTHENES MARTINS</option>
                  </select>`
                }
              </div>
              <div class="form-group">
                <label>Refeição Relacionada</label>
                <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="waste-meal" required>
                  <option value="Almoço">Almoço</option>
                  <option value="Lanche">Lanche</option>
                </select>
              </div>
              <div class="form-group">
                <label>Quantidade Desperdiçada (kg)</label>
                <input type="number" id="waste-amount" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="15" required>
              </div>
              <button type="submit" class="btn btn-danger btn-full" id="btn-submit-waste">Registrar Desperdício</button>
            </form>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header"><div class="card-title">Desperdício por Escola (Top 5)</div></div>
          <div class="card-body">
            <div class="chart-container h-250"><canvas id="chart-desperdicio"></canvas></div>
          </div>
        </div>
      </div>
    `;
    setTimeout(() => {
      window.renderWasteChart([245, 198, 176, 162, 148]);
    }, 100);
  };

  PAGE_RENDERERS.nutricionista_simulacoes = (el) => {
    let options = '';
    for (const key in DRI_TABLE) {
      options += `<option value="${key}">${DRI_TABLE[key].name}</option>`;
    }
    
    el.innerHTML = `
      <div class="page-header"><div class="page-title">Simulações de Cardápios & PNAE</div><div class="page-subtitle">Verifique o enquadramento de macronutrientes (% VET) nas diretrizes do FNDE/PNAE</div></div>
      <div style="background:var(--warning-light);border:1px solid var(--warning);padding:12px;border-radius:var(--radius-md);margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;"><div><strong>⚠️ Área em Validação:</strong> O módulo de simulação e enquadramento PNAE está em fase de testes para validação.</div><button class="btn btn-primary btn-sm" onclick="alert('Formulário de feedback da Nutricionista aberto!')">Dar Feedback</button></div>
      
      <div class="grid-2-1 mb-24">
        <div class="card">
          <div class="card-header"><div class="card-title">Parâmetros de Simulação</div></div>
          <div class="card-body">
            <form id="form-simulation-pnae" onsubmit="runPnaeSimulation(event)">
              <div class="form-group">
                <label>Selecione a Modalidade e Referência FNDE</label>
                <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="sim-preset-modalidade" onchange="updateSimulationPresets()">
                  ${options}
                </select>
              </div>
              <div class="form-group" style="margin-top:12px">
                <label>Tipo de Refeição</label>
                <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="sim-meal-type">
                  <option value="Desjejum">Desjejum / Café da Manhã</option>
                  <option value="Almoço">Almoço</option>
                  <option value="Lanche">Lanche da Tarde</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>Energia da Porção (kcal)</label>
                <input type="number" id="sim-kcal" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="303" required>
              </div>
              
              <div class="grid-3">
                <div class="form-group">
                  <label>Carboidratos (g)</label>
                  <input type="number" id="sim-carbs-g" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="45" required>
                </div>
                <div class="form-group">
                  <label>Proteínas (g)</label>
                  <input type="number" id="sim-proteins-g" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="8" required>
                </div>
                <div class="form-group">
                  <label>Lipídeos (g)</label>
                  <input type="number" id="sim-lipids-g" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="10" required>
                </div>
              </div>
              
              <div class="form-group">
                <label>Sódio (mg)</label>
                <input type="number" id="sim-sodium" class="btn btn-outline" style="width:100%;text-align:left;padding:10px;cursor:text" value="280" required>
              </div>
              
              <button type="submit" class="btn btn-primary btn-full" id="btn-run-simulation">Executar Simulação PNAE</button>
              <button type="button" class="btn btn-outline btn-full" style="margin-top:8px" onclick="window.renderStockSuggestions()">Gerar Sugestões com IA 🤖</button>
            </form>
          </div>
        </div>
  
        <div class="card" id="sim-result-card">
          <div class="card-header"><div class="card-title">Resultado da Simulação</div></div>
          <div class="card-body" style="display:flex;align-items:center;justify-content:center;min-height:250px">
            <div style="text-align:center;color:var(--text-tertiary)">
              <div style="font-size:3rem">🔬</div>
              <div style="font-weight:600;margin-top:8px">Aguardando Parâmetros</div>
              <div style="font-size:0.8rem">Selecione uma referência, configure e simule.</div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="card" id="sim-stock-suggestions"></div>
    `;
    setTimeout(() => {
      window.updateSimulationPresets();
    }, 50);
  };

  PAGE_RENDERERS.nutricionista_relatorios = (el) => { PAGE_RENDERERS.gestor_relatorios(el); };

  PAGE_RENDERERS.nutricionista_ia = (el) => {
    // Sugestões dinâmicas: produção AF em alta + produtos críticos
    const producoes = SharedState.getProductions();
    const produtosAFAltaOferta = producoes.filter(p => (p.disponivel || 0) > 500).slice(0, 3);
    const criticos = DATA.products.filter(p => (p.daysLeft || 99) <= 5).slice(0, 3);
  
    const sugestoes = [
      ...produtosAFAltaOferta.map(p => ({
        titulo: '🌾 Aproveitar Produção Local de ' + p.produto,
        desc: `${p.agricultor} tem ${p.disponivel} kg de ${p.produto} disponíveis. Considere incorporar no cardápio da semana.`,
        benef: '✓ Fortalece agricultura familiar / ✓ Preço competitivo / ✓ Frescor garantido',
      })),
      ...criticos.map(p => ({
        titulo: '🔄 Substituir ' + p.name + ' (estoque crítico)',
        desc: `${p.name} tem apenas ${p.daysLeft} dias de estoque. Sugestão: substituir por produto com maior disponibilidade nas próximas refeições.`,
        benef: '✓ Evita ruptura no cardápio / ✓ Reduz dependência de reposição urgente',
      })),
      { titulo: '🌾 Integração de Tubérculos Familiares', desc: 'Aumentar Mandioca cozida (2x/semana) reduzindo 10g de arroz por porção.', benef: '✓ +12% fibras / ✓ Absorve excedente da AF' },
    ].slice(0, 6);
  
    el.innerHTML = `
      <div class="page-header"><div class="page-title">IA Nutricional — Assistente Preditivo</div><div class="page-subtitle">Sugestões baseadas em produção real dos agricultores + estoque crítico</div></div>
  
      <div class="card mb-24">
        <div class="card-header"><div class="card-title">🤖 Sugestões do Assistente de IA</div><span class="status-badge status-info">${sugestoes.length}</span></div>
        <div class="card-body">
          <div style="display:flex;flex-direction:column;gap:16px">
            ${sugestoes.map((s, i) => `
              <div style="border: 1px solid var(--border); border-radius: var(--radius); padding:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px">
                <div style="flex:1">
                  <div style="font-weight:700;font-size:1rem;color:var(--primary)">${s.titulo}</div>
                  <div style="font-size:0.85rem;color:var(--text-secondary);margin-top:4px">${s.desc}</div>
                  <div style="font-size:0.8rem;color:var(--success);margin-top:6px;font-weight:600">${s.benef}</div>
                </div>
                <div>
                  <button class="btn btn-primary btn-sm" id="btn-ia-${i}" onclick="applyIaSuggestion(${i})">Aplicar</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  };

  PAGE_RENDERERS.nutricionista_restricoes = (el) => {
    const restricoes = SharedState.getRestricoes();
    const schools = DATA.schools || [];
    const ativos = restricoes.filter(r => r.status === 'ativo');
    const resolvidos = restricoes.filter(r => r.status === 'resolvido');
    const tipos = {};
    ativos.forEach(r => { tipos[r.tipo] = (tipos[r.tipo]||0) + 1; });
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Restrições Alimentares</div>
        <div class="page-subtitle">Visão consolidada da rede — ${restricoes.length} registros</div>
      </div>
      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card red"><div class="kpi-icon">⚠️</div><div class="kpi-value">${ativos.length}</div><div class="kpi-label">Ativas</div></div>
        <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${resolvidos.length}</div><div class="kpi-label">Resolvidas</div></div>
        <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${new Set(ativos.map(r => r.schoolId)).size}</div><div class="kpi-label">Escolas Afetadas</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">🔍</div><div class="kpi-value">${Object.keys(tipos).length}</div><div class="kpi-label">Tipos Distintos</div></div>
      </div>
      <div class="card" style="margin-bottom:20px">
        <div class="card-header">
          <div class="card-title">Registrar Nova Restrição</div>
        </div>
        <div class="card-body">
          <form id="form-nova-restricao" style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:12px;align-items:end">
            <div>
              <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Escola</label>
              <select id="restr-school" class="form-control" required>
                <option value="">Selecione</option>
                ${schools.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Tipo</label>
              <select id="restr-tipo" class="form-control" required>
                <option value="Alergia alimentar">Alergia alimentar</option>
                <option value="Intolerância à lactose">Intolerância à lactose</option>
                <option value="Doença celíaca">Doença celíaca</option>
                <option value="Diabetes">Diabetes</option>
                <option value="Restrição religiosa">Restrição religiosa</option>
                <option value="Vegetariano/Vegano">Vegetariano/Vegano</option>
                <option value="Outra">Outra</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Qtd. alunos</label>
              <input type="number" id="restr-qtd" class="form-control" min="1" value="1" required>
            </div>
            <button type="submit" class="btn btn-primary" style="height:38px">Registrar</button>
          </form>
          <div style="margin-top:8px">
            <label style="font-size:0.78rem;font-weight:600;display:block;margin-bottom:4px">Observação</label>
            <input type="text" id="restr-obs" class="form-control" placeholder="Ex: laudo médico apresentado em 10/07">
          </div>
        </div>
      </div>
      <!-- PAINEL DE ESCOLAS AFETADAS -->
      <div class="card" style="margin-bottom:20px">
        <div class="card-header"><div class="card-title">🏫 Escolas da Rede com Restrições Alimentares</div></div>
        <div class="card-body">
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Unidade Escolar</th>
                  <th>Região</th>
                  <th>Total de Alunos c/ Restrição</th>
                  <th>Tipos Registrados</th>
                  <th>Status de Alerta</th>
                </tr>
              </thead>
              <tbody>
                ${schools.map(sc => {
                  const restrSc = ativos.filter(r => r.schoolId === sc.id || (r.schoolName || '').toLowerCase() === sc.name.toLowerCase());
                  if (restrSc.length === 0) return '';
                  const totalQtd = restrSc.reduce((a,b) => a + (b.quantidade||1), 0);
                  const badges = restrSc.map(r => `<span class="tag tag-orange" style="margin-right:4px">${r.tipo}: ${r.quantidade||1}</span>`).join('');
                  return `
                    <tr>
                      <td><strong>${sc.name}</strong></td>
                      <td><span class="status-badge" style="background:#f1f5f9;color:#334155">${sc.region}</span></td>
                      <td style="font-family:var(--font-mono);font-weight:700;color:#c2410c">${totalQtd} Aluno(s)</td>
                      <td>${badges}</td>
                      <td><span class="status-badge warning">⚠️ Alerta Ativo</span></td>
                    </tr>
                  `;
                }).filter(Boolean).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--text-secondary)">Nenhuma escola com restrição ativa</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Registros Individuais Ativos (${ativos.length})</div></div>
        <div class="card-body">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Escola</th><th>Tipo</th><th>Qtd</th><th>Observação</th><th>Registrado por</th><th>Data</th><th>Ação</th></tr></thead>
              <tbody>
                ${ativos.length === 0 ? '<tr><td colspan="7" style="text-align:center;color:var(--text-secondary)">Nenhuma restrição ativa</td></tr>' :
                  ativos.map(r => `
                    <tr>
                      <td><strong>${r.schoolName || 'Escola #' + r.schoolId}</strong></td>
                      <td><span class="tag tag-orange">${r.tipo}</span></td>
                      <td style="font-family:var(--font-mono)">${r.quantidade || 1}</td>
                      <td style="font-size:0.82rem">${r.observacao || '—'}</td>
                      <td style="font-size:0.82rem">${r.registradoPor || '—'}</td>
                      <td style="font-size:0.82rem">${r.criadoEm ? new Date(r.criadoEm).toLocaleDateString('pt-BR') : '—'}</td>
                      <td><button class="table-action" onclick="window._resolverRestricao('${r.id}')">Resolver</button></td>
                    </tr>
                  `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      ${resolvidos.length > 0 ? `
      <div class="card" style="margin-top:16px">
        <div class="card-header"><div class="card-title">Resolvidas (${resolvidos.length})</div></div>
        <div class="card-body">
          <div class="table-wrapper">
            <table class="data-table">
              <thead><tr><th>Escola</th><th>Tipo</th><th>Qtd</th><th>Resolvido em</th></tr></thead>
              <tbody>
                ${resolvidos.map(r => `
                  <tr style="opacity:0.6">
                    <td>${r.schoolName || 'Escola #' + r.schoolId}</td>
                    <td>${r.tipo}</td>
                    <td>${r.quantidade || 1}</td>
                    <td>${r.resolvidoEm ? new Date(r.resolvidoEm).toLocaleDateString('pt-BR') : '—'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>` : ''}
    `;
    document.getElementById('form-nova-restricao')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const schoolId = parseInt(document.getElementById('restr-school').value, 10);
      const school = schools.find(s => s.id === schoolId);
      SharedState.addRestricao({
        schoolId, schoolName: school ? school.name : 'Escola #' + schoolId,
        tipo: document.getElementById('restr-tipo').value,
        quantidade: parseInt(document.getElementById('restr-qtd').value, 10) || 1,
        observacao: document.getElementById('restr-obs').value,
        registradoPor: PROFILES.nutricionista.name,
      });
      PAGE_RENDERERS.nutricionista_restricoes(el);
    });
  };

  // === Cross-perfil *_escolas (Fase 4.7): closure para cooperativa_escolas ===
  PAGE_RENDERERS.nutricionista_escolas = (el) => PAGE_RENDERERS.cooperativa_escolas(el);

})();
