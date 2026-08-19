/* ============================================
   SUALE — Módulo Gestor SEMED (js/modules/gestor.js)
   Perfil: Gestor SEMED / Administração Central
   ============================================ */

(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  // REGISTRO DE RENDERERS DO GESTOR (Assinatura: (el) => { el.innerHTML = ...; })
  //
  // Regra 6 do PLANO_MODULARIZACAO_APP.md: não registrar chave cuja versão em
  // app.js é mais completa. Auditoria de 2026-08-18 constatou que dashboard, atas,
  // empenhos, escolas, planejamento, relatorios, os-central, lista-compras e
  // os-fornecedores são mais ricas em app.js (charts, modais de detalhe, export
  // CSV, FEFO). Registrá-las aqui as substituiria por versões mais pobres assim
  // que a ordem dos <script> mudasse. As funções seguem definidas abaixo,
  // prontas para assumir quando forem migradas de verdade.
  //
  // Migradas e ativas (sem equivalente em app.js):
  PAGE_RENDERERS['gestor_audit-log'] = renderGestorAuditLog;

  // 1. DASHBOARD EXECUTIVO GESTOR
  function renderGestorDashboard(el) {
    const schools = DATA.schools || [];
    const totalStudents = schools.reduce((a, s) => a + s.students, 0);
    const contracts = DATA.contracts || [];
    const orders = SharedState.getOrders ? SharedState.getOrders() : [];
    const pendingOrders = orders.filter(o => o.status === 'Pendente').length;

    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Painel Executivo SEMED — Campo Grande</div>
        <div class="page-subtitle">Visão macro estratégica do abastecimento escolar PNAE e atos contratuais</div>
      </div>

      <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:24px">
        <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${schools.length}</div><div class="kpi-label">Escolas Atendidas</div></div>
        <div class="kpi-card green"><div class="kpi-icon">👥</div><div class="kpi-value">${totalStudents.toLocaleString('pt-BR')}</div><div class="kpi-label">Alunos Atendidos</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">📋</div><div class="kpi-value">${contracts.length}</div><div class="kpi-label">Atas/Contratos Vigentes</div></div>
        <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${pendingOrders}</div><div class="kpi-label">Pedidos Pendentes</div></div>
      </div>

      <div class="grid-2 mb-24">
        <div class="card">
          <div class="card-header"><div class="card-title">📜 Atas de Registro de Preços</div></div>
          <div class="card-body" style="padding:0">
            <table class="data-table">
              <thead><tr><th>ATA nº</th><th>Fornecedor</th><th>Tipo</th></tr></thead>
              <tbody>
                ${contracts.slice(0, 5).map(c => `
                  <tr>
                    <td><strong>${c.number || c.numero || 'ATA-2026/01'}</strong></td>
                    <td>${c.supplier || c.fornecedor || '—'}</td>
                    <td><span class="tag tag-blue">${c.type || 'Pregão'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">⚡ Ações de Governança</div></div>
          <div class="card-body" style="display:flex;flex-direction:column;gap:12px">
            <button class="btn btn-primary" onclick="window.abrirModalNovaAta()">+ Cadastrar Nova ATA RP</button>
            <button class="btn btn-outline" onclick="window.abrirModalLogsAuditoria()">📜 Trilha de Auditoria Geral</button>
            <button class="btn btn-outline" onclick="navigateTo('gestor','relatorios')">📊 Relatórios de Gestão Executiva</button>
          </div>
        </div>
      </div>
    `;
  }

  // 2. ATAS
  function renderGestorAtas(el) {
    const atas = SharedState.getAtas2 ? SharedState.getAtas2() : [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Gestão de Atas de Registro de Preços (RP)</div>
        <div class="page-subtitle">Controle de saldo global, empenhado e saldos remanescentes</div>
      </div>
      <div class="card mb-24">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div class="card-title">📜 Atas Cadastradas</div>
          <button class="btn btn-primary btn-sm" onclick="window.abrirModalNovaAta()">+ Nova ATA RP</button>
        </div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>ATA nº</th><th>Modalidade</th><th>Fornecedor</th><th>Valor Global</th><th>Executado</th><th>Saldo</th></tr></thead>
            <tbody>
              ${atas.map(a => {
                const global = a.valor_global || 0;
                const exec = a.valor_executado || 0;
                const saldo = global - exec;
                return `
                  <tr>
                    <td><strong>${a.numero || a.numero_ata}</strong></td>
                    <td><span class="tag tag-blue">${a.tipo || 'Pregão'}</span></td>
                    <td>${a.fornecedor}</td>
                    <td style="font-family:var(--font-mono)">R$ ${global.toLocaleString('pt-BR')}</td>
                    <td style="font-family:var(--font-mono);color:var(--warning)">R$ ${exec.toLocaleString('pt-BR')}</td>
                    <td style="font-family:var(--font-mono);font-weight:700;color:var(--success)">R$ ${saldo.toLocaleString('pt-BR')}</td>
                  </tr>
                `;
              }).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px">Nenhuma ATA cadastrada</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 3. EMPENHOS
  function renderGestorEmpenhos(el) {
    const empenhos = SharedState.getEmpenhos2 ? SharedState.getEmpenhos2() : [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Empenhos SIAFI / SEMED</div>
        <div class="page-subtitle">Emissão, liquidação e acompanhamento de empenhos vinculados às Atas</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">Empenhos Emitidos</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Empenho nº</th><th>ATA nº</th><th>Fornecedor</th><th>Valor Empenhado</th><th>Status</th></tr></thead>
            <tbody>
              ${empenhos.map(e => `
                <tr>
                  <td><strong>${e.numero_empenho}</strong></td>
                  <td>${e.ata_numero || '—'}</td>
                  <td>${e.fornecedor}</td>
                  <td style="font-family:var(--font-mono);font-weight:700">R$ ${(e.valor_empenhado || 0).toLocaleString('pt-BR')}</td>
                  <td><span class="status-badge ${e.status === 'Liquidado' ? 'status-ok' : 'status-info'}">${e.status || 'Emitido'}</span></td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="text-align:center;padding:24px">Nenhum empenho emitido</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 4. CONTRATOS
  function renderGestorContratos(el) {
    renderGestorAtas(el);
  }

  // 5. ESCOLAS GESTOR
  function renderGestorEscolas(el) {
    const schools = DATA.schools || [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Rede Escolar Atendida (${schools.length} Escolas)</div>
        <div class="page-subtitle">Mapa geral de unidades, regiões e status de abastecimento</div>
      </div>
      <div class="card">
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Unidade Escolar</th><th>Região</th><th>Alunos</th><th>Diretor(a)</th></tr></thead>
            <tbody>
              ${schools.map(s => `
                <tr>
                  <td><strong>${s.name}</strong></td>
                  <td><span class="tag tag-blue">${s.region}</span></td>
                  <td style="font-family:var(--font-mono)">${s.students}</td>
                  <td>${s.director || s.diretor || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 6. PLANEJAMENTO GESTOR
  function renderGestorPlanejamento(el) {
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Planejamento Orçamentário e Nutricional SEMED</div>
        <div class="page-subtitle">Consolidação de metas e teto orçamentário do PNAE</div>
      </div>
      <div class="card">
        <div class="card-body">
          <p>Visão de planejamento orçamentário ativa.</p>
        </div>
      </div>
    `;
  }

  // 7. RELATÓRIOS GESTOR
  function renderGestorRelatorios(el) {
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Relatórios Executivos de Gestão</div>
        <div class="page-subtitle">Indicadores consolidados PNAE, repasses e auditoria pública</div>
      </div>
      <div class="card">
        <div class="card-body">
          <button class="btn btn-primary" onclick="window.abrirModalLogsAuditoria()">📜 Ver Trilha de Auditoria Completa</button>
        </div>
      </div>
    `;
  }

  // 8. AUDIT LOG GESTOR
  function renderGestorAuditLog(el) {
    const logs = SharedState.getLogsAuditoria ? SharedState.getLogsAuditoria() : [];
    el.innerHTML = `
      <div class="page-header">
        <div class="page-title">Trilha de Auditoria & Transparência Pública</div>
        <div class="page-subtitle">Registro imutável de todas as movimentações e ações no sistema</div>
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">📜 Registros de Auditoria</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Data/Hora</th><th>Ação</th><th>Insumo/Item</th><th>Origem → Destino</th><th>Motivo</th></tr></thead>
            <tbody>
              ${logs.map(l => `
                <tr>
                  <td style="font-size:0.8rem">${l.data || '—'}</td>
                  <td><span class="tag tag-blue">${l.acao}</span></td>
                  <td><strong>${l.produto || '—'}</strong></td>
                  <td style="font-size:0.82rem">${l.origem || '—'} → ${l.destino || '—'}</td>
                  <td style="font-size:0.82rem">${l.motivo || '—'}</td>
                </tr>
              `).join('') || '<tr><td colspan="5" style="text-align:center;padding:24px">Nenhum log gravado ainda</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 9. OS CENTRAL GESTOR
  function renderGestorOsCentral(el) {
    if (typeof PAGE_RENDERERS['estoque_os-central'] === 'function') {
      PAGE_RENDERERS['estoque_os-central'](el);
      return;
    }
    renderGestorDashboard(el);
  }

  // 10. LISTA COMPRAS GESTOR
  function renderGestorListaCompras(el) {
    if (typeof PAGE_RENDERERS['estoque_lista-compras'] === 'function') {
      PAGE_RENDERERS['estoque_lista-compras'](el);
      return;
    }
    renderGestorDashboard(el);
  }

  // 11. OS FORNECEDORES GESTOR
  function renderGestorOsFornecedores(el) {
    if (typeof PAGE_RENDERERS['estoque_os-fornecedores'] === 'function') {
      PAGE_RENDERERS['gestor_os-fornecedores'](el);
      return;
    }
    renderGestorDashboard(el);
  }

  // HELPER GLOBAL DA NOVA ATA
  window.abrirModalNovaAta = () => {
    const content = `
      <form onsubmit="window.salvarNovaAta(event)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group mb-12">
            <label style="font-weight:600;display:block;margin-bottom:4px">Número/Ano da ATA</label>
            <input type="text" id="ata-numero" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: ATA-2026/050" required>
          </div>
          <div class="form-group mb-12">
            <label style="font-weight:600;display:block;margin-bottom:4px">Modalidade / Tipo</label>
            <select id="ata-tipo" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" required>
              <option value="Chamada Pública (AF)">🌾 Chamada Pública (Agricultura Familiar)</option>
              <option value="Pregão Eletrônico">🏢 Pregão Eletrônico</option>
            </select>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div class="form-group mb-12">
            <label style="font-weight:600;display:block;margin-bottom:4px">Fornecedor / Cooperativa</label>
            <input type="text" id="ata-fornecedor" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: COOPAGRAN" required>
          </div>
          <div class="form-group mb-12">
            <label style="font-weight:600;display:block;margin-bottom:4px">Valor Global (R$)</label>
            <input type="number" step="0.01" id="ata-valor" class="btn btn-outline" style="width:100%;text-align:left;padding:8px" placeholder="Ex: 1500000.00" required>
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:16px">
          <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
          <button type="submit" class="btn btn-primary">💾 Salvar Nova ATA</button>
        </div>
      </form>
    `;
    window.showModal('📜 Cadastrar Nova ATA de Registro de Preços', content, '650px');
  };

  window.salvarNovaAta = (e) => {
    e.preventDefault();
    const numero = document.getElementById('ata-numero').value;
    const tipo = document.getElementById('ata-tipo').value;
    const fornecedor = document.getElementById('ata-fornecedor').value;
    const valor_global = parseFloat(document.getElementById('ata-valor').value || 0);

    SharedState.addAta2({ numero, tipo, fornecedor, valor_global });
    showToast(`✅ ATA ${numero} cadastrada com sucesso!`);
    closeModal();
    const container = document.getElementById('page-content');
    if (container) renderGestorAtas(container);
  };

  window.abrirModalLogsAuditoria = () => {
    const logs = SharedState.getLogsAuditoria ? SharedState.getLogsAuditoria() : [];
    const html = `
      <div style="padding:10px">
        <h3>📜 Trilha de Auditoria Geral — Transparência SEMED</h3>
        <table class="data-table">
          <thead><tr><th>Data/Hora</th><th>Ação</th><th>Insumo</th><th>Origem → Destino</th></tr></thead>
          <tbody>
            ${logs.map(l => `
              <tr>
                <td>${l.data || '—'}</td>
                <td><span class="tag tag-blue">${l.acao}</span></td>
                <td>${l.produto || '—'}</td>
                <td>${l.origem || '—'} → ${l.destino || '—'}</td>
              </tr>
            `).join('') || '<tr><td colspan="4" style="text-align:center;padding:16px">Nenhum log gravado</td></tr>'}
          </tbody>
        </table>
      </div>
    `;
    window.showModal('📜 Trilha de Auditoria', html, '850px');
  };

})();
