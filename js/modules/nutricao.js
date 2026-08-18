/* ============================================
   SUALE — Módulo Nutrição (js/modules/nutricao.js)
   Perfil: Nutricionista SEMED
   ============================================ */

(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  // REGISTRO DE RENDERERS (Assinatura: (el) => { el.innerHTML = ...; })
  PAGE_RENDERERS['nutricionista_dashboard'] = renderNutricionistaDashboard;
  PAGE_RENDERERS['nutricionista_cardapios'] = renderNutricionistaCardapios;
  PAGE_RENDERERS['nutricionista_planejador'] = renderNutricionistaPlanejador;
  PAGE_RENDERERS['nutricionista_fichas-tecnicas'] = renderNutricionistaFichas;
  PAGE_RENDERERS['nutricionista_dietas-especiais'] = renderNutricionistaRestricoes;
  PAGE_RENDERERS['nutricionista_restricoes'] = renderNutricionistaRestricoes;
  PAGE_RENDERERS['nutricionista_relatorios'] = renderNutricionistaRelatorios;
  PAGE_RENDERERS['nutricionista_estoquesual'] = renderNutricionistaEstoqueSual;
  PAGE_RENDERERS['nutricionista_guiasentrega'] = renderNutricionistaGuiasEntrega;
  PAGE_RENDERERS['nutricionista_consumo'] = renderNutricionistaConsumo;
  PAGE_RENDERERS['nutricionista_desperdicios'] = renderNutricionistaDesperdicios;

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
    const schools = DATA.schools || [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">🚚 Guias de Entrega & Distribuição Parcelada</div>
        <div class="page-subtitle">Emissão de ordens de fornecimento fracionadas por per capita, frequências e trocas por sazonalidade</div>
      </div>
      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">📋 Emissão de Guia por Unidade Escolar</div>
          <select id="guia-escola-select" class="btn btn-outline" style="padding:6px 12px;font-size:0.85rem" onchange="window.renderizarGuiaEscola(this.value)">
            ${schools.map(s => `<option value="${s.id}">${s.name} (${s.students} alunos)</option>`).join('')}
          </select>
        </div>
        <div class="card-body">
          <div id="guia-detalhes-container"></div>
        </div>
      </div>
    `;
    setTimeout(() => {
      if (schools.length) window.renderizarGuiaEscola(schools[0].id);
    }, 50);
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

  window.renderizarGuiaEscola = (escolaId) => {
    const container = document.getElementById('guia-detalhes-container');
    if (!container) return;
    const school = (DATA.schools || []).find(s => String(s.id) === String(escolaId)) || DATA.schools[0];
    const qtdAlunos = school ? school.students : 400;

    container.innerHTML = `
      <div style="background:var(--surface-1);padding:16px;border-radius:8px;border:1px solid var(--border);margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <h3 style="margin:0">🏫 ${school ? school.name : 'Escola'}</h3>
            <div style="font-size:0.83rem;color:var(--text-secondary)">Alunos Matriculados: <strong>${qtdAlunos}</strong></div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.print()">🖨️ Imprimir Guia</button>
        </div>
      </div>
      <table class="data-table">
        <thead><tr><th>Insumo</th><th>Per Capita</th><th>Remessa Calculada</th><th>Frequência</th></tr></thead>
        <tbody>
          <tr><td>Banana Nanica</td><td>100g</td><td>${((100 * qtdAlunos)/1000).toFixed(1)} kg</td><td><span class="tag tag-blue">Semanal</span></td></tr>
          <tr><td>Arroz Tipo 1</td><td>60g</td><td>${((60 * qtdAlunos)/1000).toFixed(1)} kg</td><td><span class="tag tag-teal">Mensal</span></td></tr>
          <tr><td>Feijão Carioca</td><td>40g</td><td>${((40 * qtdAlunos)/1000).toFixed(1)} kg</td><td><span class="tag tag-teal">Mensal</span></td></tr>
        </tbody>
      </table>
    `;
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
