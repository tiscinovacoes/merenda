// ============================================================
// SUALE — Sprints A, B e C (Ciclo Financeiro · Compras · Transparência)
// Carregado após app.js — estende SharedState e PAGE_RENDERERS
// ============================================================
(function () {
'use strict';

// ─────────────────────────────────────────
// §1  DADOS INICIAIS DOS NOVOS MÓDULOS
// ─────────────────────────────────────────
const SPRINT_SEED = {
  exercicios: [{
    id: 'ex-2026', ano: 2026, status: 'Em execução', resolucao: 'Res. FNDE 06/2020',
    parcelas: [
      { numero: 1, valor: 450000, previsto: '2026-02-15', recebido: '2026-02-18', status: 'Recebida' },
      { numero: 2, valor: 450000, previsto: '2026-04-15', recebido: '2026-04-20', status: 'Recebida' },
      { numero: 3, valor: 450000, previsto: '2026-06-15', recebido: '2026-06-17', status: 'Recebida' },
      { numero: 4, valor: 450000, previsto: '2026-08-15', recebido: null,         status: 'Prevista' },
      { numero: 5, valor: 450000, previsto: '2026-10-15', recebido: null,         status: 'Prevista' },
      { numero: 6, valor: 450000, previsto: '2026-12-15', recebido: null,         status: 'Prevista' },
    ],
    distribuicoes: [],
    homologadoEm: null,
  }],
  percapita: [
    { modalidade: 'Creche',                  valorDia: 1.07 },
    { modalidade: 'Pré-escola',              valorDia: 0.53 },
    { modalidade: 'Fundamental (Regular)',   valorDia: 0.36 },
    { modalidade: 'Fundamental (Integral)',  valorDia: 0.72 },
    { modalidade: 'EJA',                     valorDia: 0.32 },
    { modalidade: 'Rural',                   valorDia: 0.53 },
    { modalidade: 'Indígena/Quilombola',     valorDia: 0.64 },
  ],
  listaCompras:  [],
  chamamentos:   [],
  licitacoes:    [],
  alertasConformidade: [],
};

// Merge nos dados existentes sem sobrescrever
(function patchSharedState() {
  for (const [k, v] of Object.entries(SPRINT_SEED)) {
    if (!(k in SharedState._data)) SharedState._data[k] = v;
  }
  if (!SharedState._data.alertasConformidade.length) {
    SharedState._data.alertasConformidade = [
      { id: 'alrt-1', tipo: 'pct_af',         severidade: 'critico', titulo: '% Agricultura Familiar abaixo de 30%',        descricao: 'Projeção atual: 22,4%. Reclassifique itens na Lista de Compras.', link: 'listacompras',    resolvido: false, criadoEm: new Date().toISOString() },
      { id: 'alrt-2', tipo: 'saldo_risco',     severidade: 'atencao', titulo: 'Saldo sem execução com risco de devolução',   descricao: 'R$ 136.000 sem empenho — faltam 94 dias para fim do exercício.',  link: 'distribuicao',   resolvido: false, criadoEm: new Date().toISOString() },
      { id: 'alrt-3', tipo: 'nf_pendente',     severidade: 'atencao', titulo: 'NF 000.451 com divergência há 9 dias',        descricao: 'Quantidade recebida 50 kg acima do empenho EMP-2026/045.',         link: 'prestacaocontas', resolvido: false, criadoEm: new Date().toISOString() },
      { id: 'alrt-4', tipo: 'contrato_venc',   severidade: 'info',    titulo: 'Contrato ATA-2026/001 vence em 28 dias',      descricao: 'Saldo restante: R$ 84.000. Verificar renovação ou nova licitação.', link: 'aquisicoes',     resolvido: false, criadoEm: new Date().toISOString() },
    ];
  }
  SharedState._persist();
})();

// Novos getters
SharedState.getExercicios   = () => [...(SharedState._data.exercicios   || [])];
SharedState.getPercapita    = () => [...(SharedState._data.percapita    || [])];
SharedState.getListaCompras = () => [...(SharedState._data.listaCompras || [])];
SharedState.getChamamentos  = () => [...(SharedState._data.chamamentos  || [])];
SharedState.getLicitacoes   = () => [...(SharedState._data.licitacoes   || [])];
SharedState.getAlertas      = () => [...(SharedState._data.alertasConformidade || [])];

SharedState.resolverAlerta = (id) => {
  const a = (SharedState._data.alertasConformidade || []).find(x => x.id === id);
  if (a) { a.resolvido = true; a.resolvidoEm = new Date().toISOString(); }
  SharedState._persist(); SharedState._emit('alerta:resolve');
};
SharedState.homologarDistribuicao = (exercicioId, dist) => {
  const ex = (SharedState._data.exercicios || []).find(x => x.id === exercicioId);
  if (ex) { ex.distribuicoes = dist; ex.homologadoEm = new Date().toISOString(); }
  SharedState._persist(); SharedState._emit('distribuicao:homologar');
};
SharedState.addChamamento = (ch) => {
  const obj = { id: 'ch-' + Date.now(), criadoEm: new Date().toISOString(), status: 'Aberto', propostas: [], ...ch };
  (SharedState._data.chamamentos = SharedState._data.chamamentos || []).unshift(obj);
  SharedState._persist(); SharedState._emit('chamamento:add'); return obj;
};
SharedState.addLicitacao = (li) => {
  const obj = { id: 'lic-' + Date.now(), criadoEm: new Date().toISOString(), status: 'Em andamento', ...li };
  (SharedState._data.licitacoes = SharedState._data.licitacoes || []).unshift(obj);
  SharedState._persist(); SharedState._emit('licitacao:add'); return obj;
};

// ─────────────────────────────────────────
// §2  MENU DO GESTOR — NOVOS ITENS
// ─────────────────────────────────────────
(function () {
  const menu = PROFILES.gestor.menu;
  const newItems = [
    { id: 'distribuicao',   icon: '💰', label: 'Distribuição de Recursos', badge: null },
    { id: 'prestacaocontas',icon: '🧾', label: 'Prestação de Contas',      badge: null },
    { id: 'listacompras',   icon: '🛒', label: 'Lista de Compras',         badge: null },
    { id: 'aquisicoes',     icon: '📄', label: 'Aquisições e Contratos',   badge: null },
    { id: 'conformidade',   icon: '🛡️', label: 'Conformidade',            badge: null },
    { id: 'transparencia',  icon: '🌐', label: 'Portal de Transparência',  badge: null },
  ];
  const pcGroup = menu.find(m => m.type === 'group' && m.label === 'Prestação de Contas');
  if (pcGroup) {
    newItems.forEach(item => {
      if (!pcGroup.children.find(c => c.id === item.id || c.label === item.label)) pcGroup.children.push(item);
    });
  } else {
    const atasIdx = menu.findIndex(m => m.id === 'atas');
    let insertAt = atasIdx >= 0 ? atasIdx + 1 : menu.length;
    newItems.forEach(item => {
      if (!menu.find(m => m.id === item.id || m.label === item.label)) { menu.splice(insertAt, 0, item); insertAt++; }
    });
  }
})();

// ─────────────────────────────────────────
// §3  UTILITÁRIOS
// ─────────────────────────────────────────
const cur = (v) => 'R$ ' + Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sevBadge = (s) => ({ critico: '<span class="_sev _sev-critico">Crítico</span>', atencao: '<span class="_sev _sev-atencao">Atenção</span>', info: '<span class="_sev _sev-info">Info</span>' }[s] || '');

function getPilotSchools() {
  if (window._PILOT_SCHOOLS && window._PILOT_SCHOOLS.length) return window._PILOT_SCHOOLS;
  return (DATA && DATA.schools) ? DATA.schools.slice(0, 8) : [];
}

// Inject shared CSS once
if (!document.getElementById('sprint-abc-css')) {
  const st = document.createElement('style');
  st.id = 'sprint-abc-css';
  st.textContent = `
._sev{display:inline-block;border-radius:20px;padding:2px 9px;font-size:.72rem;font-weight:600;margin-right:4px}
._sev-critico{background:#C62828;color:#fff}
._sev-atencao{background:#F57F17;color:#fff}
._sev-info{background:#1565C0;color:#fff}
._tab-row{display:flex;gap:0;border-bottom:1px solid var(--border);margin-bottom:20px}
._tab-btn{padding:8px 20px;border:none;border-bottom:2px solid transparent;background:none;font-family:inherit;font-size:.88rem;cursor:pointer;color:var(--text-secondary)}
._tab-btn.active{border-bottom-color:var(--primary,#1565C0);color:var(--primary,#1565C0);font-weight:600}
._stat-num{font-size:1.5rem;font-weight:800}
._bar-track{height:8px;background:#eee;border-radius:4px;overflow:hidden}
._bar-fill{height:8px;border-radius:4px;transition:width .4s}
._inf-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-light,#f1f5f9);font-size:.83rem}
._th{padding:9px 12px;font-size:.75rem;color:var(--text-secondary);border-bottom:1px solid var(--border);text-align:left;font-weight:600}
._td{padding:9px 12px;font-size:.83rem;border-bottom:1px solid var(--border-light,#f1f5f9)}
._pill{display:inline-block;padding:2px 9px;border-radius:20px;font-size:.72rem;font-weight:600}
.sidebar-nav-group{}
.sidebar-group-header{display:flex;align-items:center;width:100%;background:none;border:none;cursor:pointer;padding:0}
.sidebar-group-header .nav-group-chevron{margin-left:auto;flex-shrink:0;transition:transform .2s;color:var(--text-muted,#94A3B8)}
.sidebar-nav-group.group-open .sidebar-group-header .nav-group-chevron{transform:rotate(180deg)}
.sidebar-group-body{overflow:hidden;max-height:0;transition:max-height .25s ease}
.sidebar-group-body.open{max-height:200px}
.sidebar-nav-subitem{display:flex;align-items:center;gap:10px;width:100%;background:none;border:none;cursor:pointer;padding:8px 16px 8px 34px;font-size:0.83rem;color:var(--sidebar-text,#94A3B8);text-align:left;font-family:inherit;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:background .15s,color .15s}
.sidebar-nav-subitem:hover{background:rgba(255,255,255,0.06);color:#fff}
.sidebar-nav-subitem.active{background:rgba(255,255,255,0.1);color:#fff;border-left:2px solid var(--primary,#1565C0);padding-left:32px}
.sidebar-nav-subitem .nav-icon{font-size:0.9rem;width:18px;text-align:center;flex-shrink:0}
  `;
  document.head.appendChild(st);
}

// ─────────────────────────────────────────
// §4  SPRINT A — DISTRIBUIÇÃO DE RECURSOS
// ─────────────────────────────────────────
PAGE_RENDERERS.gestor_distribuicao = (el) => {
  const ex   = SharedState.getExercicios()[0];
  const perc = SharedState.getPercapita();
  const escolas = getPilotSchools();
  const parcelas = ex.parcelas || [];
  const recebido = parcelas.filter(p => p.status === 'Recebida').reduce((s, p) => s + p.valor, 0);
  const totalEx  = parcelas.reduce((s, p) => s + p.valor, 0);

  // Calcula ou usa homologadas
  const dist = ex.distribuicoes.length
    ? ex.distribuicoes
    : escolas.map((sc, i) => {
        const pc = perc.find(p => {
          const mod = (sc.modalidade || sc.sigla || '').toUpperCase();
          return mod.includes('EMEI') ? p.modalidade === 'Pré-escola'
               : mod.includes('EMRTI') ? p.modalidade === 'Rural'
               : mod.includes('EMTI') ? p.modalidade === 'Fundamental (Integral)'
               : p.modalidade === 'Fundamental (Regular)';
        }) || perc[2];
        const diasLetivos = 200;
        return { escolaId: sc.id || i+1, escolaNome: sc.name || sc.nome || `Escola ${i+1}`, alunos: sc.students || 0, modalidade: pc.modalidade, diasLetivos, perCapita: pc.valorDia, valor: Math.round((sc.students || 0) * pc.valorDia * diasLetivos) };
      });

  const totalDist = dist.reduce((s, d) => s + d.valor, 0);
  const saldo = recebido - totalDist;

  el.innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">💰 Distribuição de Recursos</h1>
  <p class="page-subtitle">Exercício ${ex.ano} · ${ex.resolucao}</p></div>
  ${ex.homologadoEm
    ? `<span style="background:#2E7D32;color:#fff;padding:6px 16px;border-radius:20px;font-size:.82rem;font-weight:600">✅ Homologada em ${new Date(ex.homologadoEm).toLocaleDateString('pt-BR')}</span>`
    : `<button class="btn btn-primary" onclick="window._homologarDist()">Homologar Distribuição</button>`}
</div>

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
  <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${cur(totalEx)}</div><div class="kpi-label">Total do Exercício</div></div>
  <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${cur(recebido)}</div><div class="kpi-label">Parcelas Recebidas</div></div>
  <div class="kpi-card orange"><div class="kpi-icon">🏫</div><div class="kpi-value">${cur(totalDist)}</div><div class="kpi-label">Distribuído às Escolas</div></div>
  <div class="kpi-card ${saldo < 0 ? 'red' : 'teal'}"><div class="kpi-icon">${saldo < 0 ? '⚠️' : '💵'}</div><div class="kpi-value">${cur(saldo)}</div><div class="kpi-label">Saldo Disponível</div></div>
</div>

<div style="display:grid;grid-template-columns:1fr 300px;gap:20px">
  <div class="card">
    <div class="card-header">
      <div class="card-title">📊 Distribuição por Escola</div>
      <span style="font-size:.78rem;color:var(--text-secondary)">Per capita × dias letivos × matrículas</span>
    </div>
    <div class="card-body" style="padding:0;overflow-x:auto">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr>${['Escola','Alunos','Modalidade','Per Capita/Dia','Dias Letivos','Valor Calculado'].map(h=>`<th class="_th">${h}</th>`).join('')}</tr></thead>
        <tbody>
          ${dist.map(d => `<tr>
            <td class="_td" style="font-weight:500;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.escolaNome}</td>
            <td class="_td" style="text-align:right">${(d.alunos||0).toLocaleString('pt-BR')}</td>
            <td class="_td"><span class="_pill" style="background:var(--surface-2,#f1f5f9)">${d.modalidade}</span></td>
            <td class="_td" style="text-align:right">R$ ${(d.perCapita||0).toFixed(2)}</td>
            <td class="_td" style="text-align:right">${d.diasLetivos}</td>
            <td class="_td" style="text-align:right;font-weight:700;color:var(--primary,#1565C0)">${cur(d.valor)}</td>
          </tr>`).join('')}
        </tbody>
        <tfoot><tr style="background:var(--surface-2,#f8fafc)">
          <td class="_td" colspan="5" style="font-weight:700">Total</td>
          <td class="_td" style="text-align:right;font-weight:800;font-size:.95rem;color:var(--primary,#1565C0)">${cur(totalDist)}</td>
        </tr></tfoot>
      </table>
    </div>
  </div>

  <div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">📅 Parcelas FNDE</div></div>
      <div class="card-body" style="padding:0">
        ${parcelas.map(p=>`<div class="_inf-row" style="padding:10px 16px;align-items:center">
          <div>
            <div style="font-size:.85rem;font-weight:600">${p.numero}ª Parcela</div>
            <div style="font-size:.75rem;color:var(--text-secondary)">${p.previsto ? new Date(p.previsto+'T12:00').toLocaleDateString('pt-BR') : '—'}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:.88rem;font-weight:700">${cur(p.valor)}</div>
            <span class="_pill" style="${p.status==='Recebida'?'background:#e8f5e9;color:#2e7d32':'background:#fff8e1;color:#f57f17'}">${p.status}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">📋 Per Capita por Modalidade</div></div>
      <div class="card-body" style="padding:0">
        ${perc.map(p=>`<div class="_inf-row" style="padding:8px 16px">
          <span>${p.modalidade}</span>
          <span style="font-weight:600">R$ ${p.valorDia.toFixed(2)}/dia</span>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>`;

  window._homologarDist = () => {
    if (!confirm('Homologar a distribuição de recursos 2026? Esta ação será registrada na trilha de auditoria.')) return;
    SharedState.homologarDistribuicao(ex.id, dist);
    const a = SharedState.getAlertas().find(x => x.tipo === 'saldo_risco');
    if (a && !a.resolvido) SharedState.resolverAlerta(a.id);
    showToast('Distribuição homologada com sucesso!', 'success');
    renderPage();
  };
};

// ─────────────────────────────────────────
// §5  SPRINT A — PRESTAÇÃO DE CONTAS
// ─────────────────────────────────────────
PAGE_RENDERERS.gestor_prestacaocontas = (el) => {
  const empenhos  = SharedState.getEmpenhos();
  const nfs       = SharedState.getNFs();
  const recebido  = (SharedState.getExercicios()[0]?.parcelas || []).filter(p => p.status === 'Recebida').reduce((s, p) => s + p.valor, 0);
  const totalNFs  = nfs.reduce((s, n) => s + (n.valor || 0), 0);
  const totalEmp  = empenhos.reduce((s, e) => s + (e.qtdTotal * e.valorUnit), 0);
  const totalAF   = nfs.filter(n => { const e = empenhos.find(x => x.id === n.empenhoId); return e && (e.ataNumero||'').includes('AF'); }).reduce((s, n) => s + (n.valor||0), 0);
  const pctAF     = totalNFs > 0 ? (totalAF / totalNFs * 100).toFixed(1) : '0.0';
  const pctAFN    = parseFloat(pctAF);

  el.innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">📑 Prestação de Contas</h1>
  <p class="page-subtitle">Exercício 2026 · FNDE / SiGPC · CAE Campo Grande–MS</p></div>
  <button class="btn btn-secondary" onclick="showToast('Relatório FNDE exportado (PDF via backend).','info')">📄 Exportar para SiGPC</button>
</div>

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
  <div class="kpi-card blue"><div class="kpi-icon">📥</div><div class="kpi-value">${cur(recebido)}</div><div class="kpi-label">Recursos Recebidos</div></div>
  <div class="kpi-card orange"><div class="kpi-icon">📋</div><div class="kpi-value">${cur(totalEmp)}</div><div class="kpi-label">Total Empenhado</div></div>
  <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${cur(totalNFs)}</div><div class="kpi-label">NFs Processadas</div></div>
  <div class="kpi-card ${pctAFN < 30 ? 'red' : 'teal'}"><div class="kpi-icon">${pctAFN < 30 ? '⚠️' : '🌾'}</div><div class="kpi-value">${pctAF}%</div><div class="kpi-label">% Agricultura Familiar${pctAFN<30?' ⚠️':''}</div></div>
</div>

<div style="display:grid;grid-template-columns:1fr 320px;gap:20px">
  <div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header">
        <div class="card-title">📄 Notas Fiscais Processadas</div>
        <button class="btn btn-sm btn-primary" onclick="document.getElementById('pc-form-nf').style.display='block';document.getElementById('pc-form-nf').scrollIntoView({behavior:'smooth'})">+ Lancar NF</button>
      </div>
      <div class="card-body" style="padding:0;overflow-x:auto">
        ${_tableNFs(nfs, empenhos)}
      </div>
    </div>

    <!-- REQUISITO PDF Nº 6: CONFERÊNCIA FÍSICA E ENVIO PARA A GESTORA NAARA -->
    <div class="card" style="margin-bottom:16px">
      <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="card-title">📝 Conferência Física de Entregas & Protocolos Assinados (Fluxo Admin)</div>
          <div style="font-size:0.8rem;color:var(--text-secondary)">Conferência das guias físicas com assinaturas das escolas, cálculo do valor entregue e envio final para a gestora Naara</div>
        </div>
        <span class="status-badge status-info">Requisito PDF nº 6</span>
      </div>
      <div class="card-body" style="padding:0;overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>Guia / Protocolo</th>
              <th>Fornecedor</th>
              <th>Escola Destino</th>
              <th>Data Entrega</th>
              <th>Valor Entregue</th>
              <th>Status do Protocolo</th>
              <th>Ações de Controle</th>
            </tr>
          </thead>
          <tbody>
            ${[
              { id: 'GUI-2026/041', fornecedor: 'COOPAGRAN (AF)', escola: 'EM Arlindo Lima', data: '28/07/2026', valor: 14850.00, status: 'Conferido pelo Apoio Admin' },
              { id: 'GUI-2026/042', fornecedor: 'COOPERSUL (AF)', escola: 'EMEF Bernardo Franco', data: '29/07/2026', valor: 9200.00, status: 'Aguardando Protocolo Assinado' },
              { id: 'GUI-2026/043', fornecedor: 'Distribuidora Aliança', escola: 'EMEI Pingo de Gente', data: '30/07/2026', valor: 22400.00, status: 'Autorizado Emissão de NF' },
              { id: 'GUI-2026/044', fornecedor: 'COOPAGRAN (AF)', escola: 'EMEF Rurais Anhanduí', data: '01/08/2026', valor: 18100.00, status: 'Enviado para Pagamento (Gestora Naara)' },
            ].map(item => `
              <tr>
                <td><strong>${item.id}</strong></td>
                <td>${item.fornecedor}</td>
                <td>${item.escola}</td>
                <td>${item.data}</td>
                <td style="font-family:var(--font-mono);font-weight:700">${cur(item.valor)}</td>
                <td>
                  <span class="_pill" style="${
                    item.status.includes('Naara') ? 'background:#e8f5e9;color:#2E7D32' :
                    item.status.includes('Autorizado') ? 'background:#e3f2fd;color:#1565C0' :
                    item.status.includes('Conferido') ? 'background:#fffbe6;color:#b45309' :
                    'background:#f1f5f9;color:#475569'
                  }">
                    ${item.status}
                  </span>
                </td>
                <td>
                  <div style="display:flex;gap:6px">
                    ${item.status === 'Aguardando Protocolo Assinado' ? `
                      <button class="btn btn-sm btn-outline" onclick="showToast('✅ Protocolo assinado registrado com sucesso!','success')">📋 Registrar Protocolo</button>
                    ` : item.status === 'Conferido pelo Apoio Admin' ? `
                      <button class="btn btn-sm btn-primary" onclick="showToast('✅ Emissão de Nota Fiscal autorizada para o fornecedor!','success')">✅ Autorizar NF</button>
                    ` : item.status === 'Autorizado Emissão de NF' ? `
                      <button class="btn btn-sm" style="background:#2E7D32;color:#fff" onclick="showToast('🚀 Lote enviado para pagamento final com a gestora Naara!','success')">🚀 Enviar p/ Gestora Naara</button>
                    ` : `
                      <span style="font-size:0.78rem;color:#2E7D32;font-weight:600">✓ Em Processamento Financeiro</span>
                    `}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div id="pc-form-nf" style="display:none" class="card">
      <div class="card-header">
        <div class="card-title">➕ Nova Nota Fiscal</div>
        <button class="btn btn-sm" onclick="document.getElementById('pc-form-nf').style.display='none'">✕</button>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div>
            <label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Empenho *</label>
            <select id="nf-emp" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem">
              <option value="">— Selecione —</option>
              ${empenhos.filter(e=>e.status!=='Liquidado').map(e=>`<option value="${e.id}">${e.numero} — ${e.produto} (saldo: ${e.qtdTotal-e.qtdConsumida} ${e.unidade})</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Número da NF *</label>
            <input id="nf-num" placeholder="000.451" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem">
          </div>
          <div>
            <label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Quantidade *</label>
            <input id="nf-qtd" type="number" placeholder="500" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem">
          </div>
          <div>
            <label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Validade</label>
            <input id="nf-val" type="date" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem">
          </div>
          <div>
            <label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Chave NF-e (44 dígitos)</label>
            <input id="nf-chave" maxlength="44" placeholder="35260812…" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem">
          </div>
          <div>
            <label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Ateste</label>
            <select id="nf-ateste" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem">
              <option>Conforme</option><option>Conforme com ressalva</option><option>Recusada</option>
            </select>
          </div>
        </div>
        <div style="margin-top:14px;display:flex;gap:10px">
          <button class="btn btn-primary" onclick="window._lancarNF()">💾 Processar NF</button>
          <button class="btn btn-secondary" onclick="document.getElementById('pc-form-nf').style.display='none'">Cancelar</button>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-header"><div class="card-title">📊 Demonstrativo</div></div>
      <div class="card-body">
        <div style="margin-bottom:12px">
          <div style="font-size:.75rem;color:var(--text-secondary);margin-bottom:2px">Recursos Recebidos</div>
          <div style="font-size:1.1rem;font-weight:700;color:#2E7D32">+ ${cur(recebido)}</div>
        </div>
        <div style="margin-bottom:12px">
          <div style="font-size:.75rem;color:var(--text-secondary);margin-bottom:2px">Despesas (NFs processadas)</div>
          <div style="font-size:1.1rem;font-weight:700;color:#C62828">− ${cur(totalNFs)}</div>
        </div>
        <div style="border-top:2px solid var(--border);padding-top:12px;margin-bottom:12px">
          <div style="font-size:.75rem;color:var(--text-secondary);margin-bottom:2px">Saldo a Prestar</div>
          <div style="font-size:1.2rem;font-weight:700;color:${recebido-totalNFs>=0?'#1565C0':'#C62828'}">${cur(recebido - totalNFs)}</div>
        </div>
        <div style="padding:10px;border-radius:8px;background:${pctAFN>=30?'#e8f5e9':'#ffebee'}">
          <div style="font-size:.75rem;font-weight:600;color:${pctAFN>=30?'#2E7D32':'#C62828'}">🌾 Agricultura Familiar</div>
          <div style="font-size:1.1rem;font-weight:700;color:${pctAFN>=30?'#2E7D32':'#C62828'}">${pctAF}% <span style="font-size:.72rem">(mín. 30%)</span></div>
          <div class="_bar-track" style="margin-top:6px"><div class="_bar-fill" style="width:${Math.min(pctAFN,100)}%;background:${pctAFN>=30?'#2E7D32':'#C62828'}"></div></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="card-title">📋 Parecer CAE</div></div>
      <div class="card-body">
        <div style="margin-bottom:10px">
          <label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Status</label>
          <select style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem">
            <option>Pendente de análise</option><option>Aprovado</option><option>Aprovado com ressalvas</option><option>Reprovado</option>
          </select>
        </div>
        <div style="margin-bottom:10px">
          <label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Observações</label>
          <textarea style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem;min-height:70px;resize:vertical" placeholder="Observações do CAE…"></textarea>
        </div>
        <button class="btn btn-primary" style="width:100%" onclick="showToast('Parecer do CAE salvo!','success')">Salvar Parecer</button>
      </div>
    </div>
  </div>
</div>`;

  window._lancarNF = () => {
    const empId = document.getElementById('nf-emp').value;
    const num   = document.getElementById('nf-num').value.trim();
    const qtd   = parseFloat(document.getElementById('nf-qtd').value);
    const val   = document.getElementById('nf-val').value;
    const ateste = document.getElementById('nf-ateste').value;
    if (!empId || !num || !qtd) { showToast('Preencha Empenho, número e quantidade.', 'error'); return; }
    const nf = SharedState.receiveNF(empId, { numero: num, qtd, validade: val, ateste });
    if (nf) {
      const a = SharedState.getAlertas().find(x => x.tipo === 'nf_pendente');
      if (a && !a.resolvido) SharedState.resolverAlerta(a.id);
      showToast('NF processada — estoque central atualizado!', 'success');
      renderPage();
    } else showToast('Empenho não encontrado.', 'error');
  };
};

function _tableNFs(nfs, empenhos) {
  if (!nfs.length) return '<div style="padding:32px;text-align:center;color:var(--text-secondary)">Nenhuma NF processada ainda.<br><small>Use o botão "Lançar NF" acima.</small></div>';
  return `<table style="width:100%;border-collapse:collapse">
  <thead><tr>${['Número NF','Empenho','Produto','Qtd','Valor','Recebimento','Lote','Ateste'].map(h=>`<th class="_th">${h}</th>`).join('')}</tr></thead>
  <tbody>${nfs.map(n=>{
    const e = empenhos.find(x=>x.id===n.empenhoId);
    return `<tr>
      <td class="_td" style="font-weight:600">${n.numero||'—'}</td>
      <td class="_td">${e?e.numero:n.empenhoId}</td>
      <td class="_td">${e?e.produto:'—'}</td>
      <td class="_td">${n.qtd} ${e?e.unidade:''}</td>
      <td class="_td" style="font-weight:600">${cur(n.valor||0)}</td>
      <td class="_td">${n.dataRec?new Date(n.dataRec+'T12:00').toLocaleDateString('pt-BR'):'—'}</td>
      <td class="_td"><span class="_pill" style="background:var(--surface-2,#f1f5f9)">${n.lote||'—'}</span></td>
      <td class="_td" style="color:${n.ateste==='Conforme'?'#2E7D32':'#C62828'}">${n.ateste||'—'}</td>
    </tr>`;
  }).join('')}</tbody></table>`;
}

// ─────────────────────────────────────────
// §6  SPRINT B — LISTA DE COMPRAS
// ─────────────────────────────────────────
const _LISTA_SEED = [
  { produto: 'Arroz Tipo 1',       qtdNec: 4800, qtdEst: 620,  unidade: 'kg', tipo: 'Licitação', precoRef: 6.20  },
  { produto: 'Feijão Carioca',     qtdNec: 1800, qtdEst: 180,  unidade: 'kg', tipo: 'Licitação', precoRef: 9.80  },
  { produto: 'Leite Integral',     qtdNec: 2800, qtdEst: 300,  unidade: 'L',  tipo: 'Licitação', precoRef: 5.10  },
  { produto: 'Alface',             qtdNec:  650, qtdEst:  20,  unidade: 'kg', tipo: 'AF',        precoRef: 4.50  },
  { produto: 'Tomate',             qtdNec:  820, qtdEst:  15,  unidade: 'kg', tipo: 'AF',        precoRef: 5.80  },
  { produto: 'Abóbora',            qtdNec:  960, qtdEst: 120,  unidade: 'kg', tipo: 'AF',        precoRef: 3.20  },
  { produto: 'Mamão',              qtdNec:  500, qtdEst:  30,  unidade: 'kg', tipo: 'AF',        precoRef: 4.00  },
  { produto: 'Carne Bovina Moída', qtdNec: 1200, qtdEst: 200,  unidade: 'kg', tipo: 'Licitação', precoRef: 32.00 },
  { produto: 'Ovos (cx 30)',       qtdNec:  480, qtdEst:  60,  unidade: 'cx', tipo: 'AF',        precoRef: 18.00 },
  { produto: 'Mandioca',           qtdNec:  700, qtdEst:  50,  unidade: 'kg', tipo: 'AF',        precoRef: 2.80  },
];

PAGE_RENDERERS.gestor_listacompras = (el) => {
  if (!window._listaItens) window._listaItens = _LISTA_SEED.map(it => ({ ...it, qtdComprar: Math.max(0, it.qtdNec - it.qtdEst), valorEst: Math.max(0, it.qtdNec - it.qtdEst) * it.precoRef }));
  const itens    = window._listaItens;
  const totalVal = itens.reduce((s, i) => s + i.valorEst, 0);
  const totalAF  = itens.filter(i => i.tipo === 'AF').reduce((s, i) => s + i.valorEst, 0);
  const totalLic = itens.filter(i => i.tipo === 'Licitação').reduce((s, i) => s + i.valorEst, 0);
  const pctAF    = totalVal > 0 ? (totalAF / totalVal * 100).toFixed(1) : '0.0';
  const pctAFN   = parseFloat(pctAF);
  const menus    = SharedState.getMenus().filter(m => m.status === 'Publicado');
  const totalAlunos = getPilotSchools().reduce((s, sc) => s + (sc.students||0), 0);

  el.innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">🛒 Lista de Compras</h1>
  <p class="page-subtitle">Gerada automaticamente · ${menus.length} cardápios publicados · ${totalAlunos.toLocaleString('pt-BR')} alunos</p></div>
  <div style="display:flex;gap:8px">
    <button class="btn btn-secondary" onclick="window._recalcLista()">🔄 Recalcular</button>
    <button class="btn btn-primary" onclick="window._gerarChamamento()">🌾 Gerar Chamamento Público</button>
    <button class="btn btn-secondary" onclick="window._gerarLicitacao()">⚖️ Gerar Licitação</button>
  </div>
</div>

${pctAFN < 30 ? `<div style="background:#ffebee;border-left:4px solid #C62828;padding:12px 16px;border-radius:8px;margin-bottom:20px">
  <strong style="color:#C62828">⚠️ Abaixo do mínimo:</strong> % AF = ${pctAF}% (mínimo obrigatório: 30%). Reclassifique itens abaixo.
</div>` : `<div style="background:#e8f5e9;border-left:4px solid #2E7D32;padding:12px 16px;border-radius:8px;margin-bottom:20px">
  <strong style="color:#2E7D32">✅ Conformidade AF:</strong> ${pctAF}% destinado à Agricultura Familiar — acima do mínimo de 30%.
</div>`}

<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px">
  <div class="kpi-card blue"><div class="kpi-icon">🛒</div><div class="kpi-value">${itens.length}</div><div class="kpi-label">Itens na Lista</div></div>
  <div class="kpi-card orange"><div class="kpi-icon">💰</div><div class="kpi-value">${cur(totalVal)}</div><div class="kpi-label">Valor Estimado</div></div>
  <div class="kpi-card green"><div class="kpi-icon">🌾</div><div class="kpi-value">${cur(totalAF)}</div><div class="kpi-label">Via AF</div></div>
  <div class="kpi-card ${pctAFN<30?'red':'teal'}"><div class="kpi-icon">${pctAFN<30?'⚠️':'✅'}</div><div class="kpi-value">${pctAF}%</div><div class="kpi-label">% Agricultura Familiar</div></div>
</div>

<div style="display:grid;grid-template-columns:1fr 240px;gap:20px">
  <div class="card">
    <div class="card-header">
      <div class="card-title">📋 Itens para Compra</div>
      <div style="display:flex;gap:6px">
        <span class="_pill" style="background:#e8f5e9;color:#2E7D32">🌾 ${cur(totalAF)}</span>
        <span class="_pill" style="background:#e3f2fd;color:#1565C0">⚖️ ${cur(totalLic)}</span>
      </div>
    </div>
    <div class="card-body" style="padding:0;overflow-x:auto">
      <table style="width:100%;border-collapse:collapse">
        <thead><tr>${['Produto','Necessário','Em Estoque','A Comprar','Tipo','Preço Ref.','Valor Est.'].map(h=>`<th class="_th">${h}</th>`).join('')}</tr></thead>
        <tbody>
          ${itens.map((it, i) => `<tr>
            <td class="_td" style="font-weight:500">${it.produto}</td>
            <td class="_td">${it.qtdNec} ${it.unidade}</td>
            <td class="_td" style="color:#2E7D32">${it.qtdEst} ${it.unidade}</td>
            <td class="_td" style="font-weight:700">${it.qtdComprar} ${it.unidade}</td>
            <td class="_td">
              <select onchange="window._setTipoItem(${i},this.value)" style="padding:3px 6px;border-radius:6px;border:1px solid var(--border);font-size:.78rem">
                <option value="AF" ${it.tipo==='AF'?'selected':''}>🌾 AF</option>
                <option value="Licitação" ${it.tipo==='Licitação'?'selected':''}>⚖️ Licitação</option>
              </select>
            </td>
            <td class="_td">R$ ${it.precoRef.toFixed(2)}/${it.unidade}</td>
            <td class="_td" style="font-weight:700;color:var(--primary,#1565C0)">${cur(it.valorEst)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><div class="card-title">📊 Distribuição</div></div>
    <div class="card-body">
      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:.82rem">🌾 Agricultura Familiar</span>
          <span style="font-size:.82rem;font-weight:700">${pctAF}%</span>
        </div>
        <div class="_bar-track"><div class="_bar-fill" style="width:${Math.min(pctAFN,100)}%;background:${pctAFN>=30?'#2E7D32':'#C62828'}"></div></div>
        <div style="font-size:.72rem;color:var(--text-secondary);margin-top:3px">Mínimo obrigatório: 30%</div>
      </div>
      <div style="padding:10px;background:var(--surface-2,#f8fafc);border-radius:8px;margin-bottom:8px">
        <div style="font-size:.72rem;color:var(--text-secondary)">Chamamento Público (AF)</div>
        <div style="font-size:1rem;font-weight:700;color:#2E7D32">${cur(totalAF)}</div>
        <div style="font-size:.75rem;color:var(--text-secondary)">${itens.filter(i=>i.tipo==='AF').length} itens</div>
      </div>
      <div style="padding:10px;background:var(--surface-2,#f8fafc);border-radius:8px">
        <div style="font-size:.72rem;color:var(--text-secondary)">Licitação / Pregão</div>
        <div style="font-size:1rem;font-weight:700;color:#1565C0">${cur(totalLic)}</div>
        <div style="font-size:.75rem;color:var(--text-secondary)">${itens.filter(i=>i.tipo==='Licitação').length} itens</div>
      </div>
    </div>
  </div>
</div>`;

  window._setTipoItem = (i, tipo) => {
    window._listaItens[i].tipo = tipo;
    showToast(`"${window._listaItens[i].produto}" → ${tipo}`, 'info');
  };
  window._recalcLista = () => {
    window._listaItens = null; renderPage();
    showToast('Lista recalculada com base nos cardápios vigentes.', 'success');
  };
  window._gerarChamamento = () => {
    const itensAF = window._listaItens.filter(i => i.tipo === 'AF');
    if (!itensAF.length) { showToast('Nenhum item classificado como AF.', 'error'); return; }
    SharedState.addChamamento({ numero: 'CP-PNAE-2026/' + String(Date.now()).slice(-4), ano: 2026, itens: itensAF, abertura: new Date().toISOString().slice(0,10), encerramento: new Date(Date.now()+21*86400000).toISOString().slice(0,10) });
    const a = SharedState.getAlertas().find(x=>x.tipo==='pct_af');
    if (a && !a.resolvido) SharedState.resolverAlerta(a.id);
    showToast('Chamamento Público gerado! Acesse "Processos Aquisitivos".', 'success');
  };
  window._gerarLicitacao = () => {
    const itensL = window._listaItens.filter(i => i.tipo === 'Licitação');
    if (!itensL.length) { showToast('Nenhum item para licitação.', 'error'); return; }
    SharedState.addLicitacao({ numero: 'PE-2026/' + String(Date.now()).slice(-4), modalidade: 'Pregão Eletrônico', objeto: 'Gêneros alimentícios PNAE 2026', itens: itensL, abertura: new Date().toISOString().slice(0,10) });
    showToast('Processo licitatório criado! Acesse "Processos Aquisitivos".', 'success');
  };
};

// ─────────────────────────────────────────
// §7  SPRINT B — PROCESSOS AQUISITIVOS
// ─────────────────────────────────────────
PAGE_RENDERERS.gestor_aquisicoes = (el) => {
  const tab  = window._aqTab || 'chamamentos';
  const chs  = SharedState.getChamamentos();
  const lics = SharedState.getLicitacoes();

  el.innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">⚖️ Processos Aquisitivos</h1>
  <p class="page-subtitle">Chamamentos Públicos · Licitações · Dispensas — PNAE 2026</p></div>
</div>
<div class="_tab-row">
  <button class="_tab-btn ${tab==='chamamentos'?'active':''}" onclick="window._aqTab='chamamentos';renderPage()">🌾 Chamamentos Públicos <span class="_pill" style="${chs.length?'background:#1565C0;color:#fff':'background:#e2e8f0;color:#64748b'}">${chs.length}</span></button>
  <button class="_tab-btn ${tab==='licitacoes'?'active':''}" onclick="window._aqTab='licitacoes';renderPage()">⚖️ Licitações <span class="_pill" style="${lics.length?'background:#1565C0;color:#fff':'background:#e2e8f0;color:#64748b'}">${lics.length}</span></button>
  <button class="_tab-btn ${tab==='dispensas'?'active':''}" onclick="window._aqTab='dispensas';renderPage()">📄 Dispensas</button>
</div>
<div id="aq-tab-content">
  ${tab==='chamamentos' ? _renderChs(chs) : tab==='licitacoes' ? _renderLics(lics) : _renderDisp()}
</div>`;
};

function _renderChs(chs) {
  if (!chs.length) return `<div class="card"><div class="card-body" style="text-align:center;padding:40px;color:var(--text-secondary)">
    Nenhum chamamento criado ainda.<br><small>Vá até <strong>Lista de Compras</strong> → "Gerar Chamamento Público".</small>
  </div></div>`;
  return chs.map(ch => `
<div class="card" style="margin-bottom:16px">
  <div class="card-header">
    <div>
      <div class="card-title">📋 ${ch.numero}</div>
      <div style="font-size:.78rem;color:var(--text-secondary)">
        Abertura: ${ch.abertura?new Date(ch.abertura+'T12:00').toLocaleDateString('pt-BR'):'—'} ·
        Encerramento: ${ch.encerramento?new Date(ch.encerramento+'T12:00').toLocaleDateString('pt-BR'):'—'}
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:8px">
      <span class="_pill" style="${ch.status==='Homologado'?'background:#e8f5e9;color:#2E7D32':'background:#fff8e1;color:#F57F17'}">${ch.status}</span>
      ${ch.status!=='Homologado'?`
        <button class="btn btn-sm" onclick="window._aqAddProposta('${ch.id}')">+ Proposta</button>
        <button class="btn btn-sm btn-primary" onclick="window._aqHomologarCh('${ch.id}')">✅ Homologar</button>
      `:''}
    </div>
  </div>
  <div class="card-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
      <div>
        <div style="font-size:.8rem;font-weight:600;margin-bottom:8px">Itens do Chamamento (${(ch.itens||[]).length})</div>
        ${(ch.itens||[]).map(it=>`<div class="_inf-row">
          <span>${it.produto}</span>
          <span style="font-weight:600">${it.qtdComprar} ${it.unidade}</span>
        </div>`).join('')}
      </div>
      <div>
        <div style="font-size:.8rem;font-weight:600;margin-bottom:8px">Propostas Recebidas (${(ch.propostas||[]).length})</div>
        ${(ch.propostas||[]).length
          ? (ch.propostas||[]).map((p,i)=>`<div style="padding:8px;background:var(--surface-2,#f8fafc);border-radius:8px;margin-bottom:8px">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                  <div style="font-weight:600;font-size:.85rem">${p.cooperativa}</div>
                  <div style="font-size:.78rem;color:var(--text-secondary)">${p.classificacao}</div>
                </div>
                <div style="font-size:.9rem;font-weight:700;color:#2E7D32">${cur(p.total||0)}</div>
              </div>
            </div>`).join('')
          : '<div style="color:var(--text-secondary);font-size:.82rem;padding:8px">Aguardando propostas dos fornecedores…</div>'}
      </div>
    </div>
  </div>
</div>`).join('');
}

function _renderLics(lics) {
  if (!lics.length) return `<div class="card"><div class="card-body" style="text-align:center;padding:40px;color:var(--text-secondary)">
    Nenhuma licitação criada ainda.<br><small>Vá até <strong>Lista de Compras</strong> → "Gerar Licitação".</small>
  </div></div>`;
  return lics.map(l => `
<div class="card" style="margin-bottom:16px">
  <div class="card-header">
    <div>
      <div class="card-title">⚖️ ${l.numero} — ${l.modalidade}</div>
      <div style="font-size:.78rem;color:var(--text-secondary)">${l.objeto}</div>
    </div>
    <span class="_pill" style="background:#e3f2fd;color:#1565C0">${l.status}</span>
  </div>
  <div class="card-body">
    <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:12px">
      ${(l.itens||[]).map(it=>`<div style="background:var(--surface-2,#f8fafc);padding:8px 12px;border-radius:8px;font-size:.82rem">
        <div style="font-weight:600">${it.produto}</div>
        <div style="color:var(--text-secondary)">${it.qtdComprar} ${it.unidade} · R$ ${it.precoRef}/${it.unidade}</div>
      </div>`).join('')}
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-sm" onclick="showToast('Edital gerado para ${l.numero}.','info')">📄 Gerar Edital</button>
      ${l.status!=='Homologado'?`<button class="btn btn-sm btn-primary" onclick="window._aqHomologarLic('${l.id}')">✅ Homologar</button>`:''}
    </div>
  </div>
</div>`).join('');
}

function _renderDisp() {
  return `<div class="card"><div class="card-body">
  <div style="font-size:.9rem;font-weight:600;margin-bottom:14px">Nova Dispensa de Licitação</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    <div><label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Fornecedor</label>
      <input placeholder="Nome do fornecedor" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem"></div>
    <div><label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Valor (R$)</label>
      <input type="number" placeholder="0,00" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem"></div>
    <div><label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Objeto</label>
      <input placeholder="Descrição do objeto" style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem"></div>
    <div><label style="font-size:.8rem;font-weight:600;display:block;margin-bottom:4px">Fundamento Legal</label>
      <select style="width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:8px;font-size:.85rem">
        <option>Art. 24, II — Valor abaixo do limite</option>
        <option>Art. 24, IV — Emergência</option>
        <option>Art. 24, VII — Fornecedor exclusivo</option>
      </select></div>
  </div>
  <button class="btn btn-primary" style="margin-top:14px" onclick="showToast('Dispensa registrada — aguardando ratificação.','success')">Registrar Dispensa</button>
</div></div>`;
}

window._aqAddProposta = (id) => {
  const ch = (SharedState._data.chamamentos||[]).find(x=>x.id===id);
  if (!ch) return;
  ch.propostas = ch.propostas || [];
  const names = ['COOPAGRAN','COOPERSUL','COOPAAF-MS'];
  const name = names[ch.propostas.length % names.length];
  ch.propostas.push({ cooperativa: name, total: 22000 + Math.round(Math.random()*8000), classificacao: `${ch.propostas.length+1}º lugar — Local`, criadoEm: new Date().toISOString() });
  SharedState._persist(); showToast(`Proposta de ${name} registrada!`, 'success'); renderPage();
};
window._aqHomologarCh = (id) => {
  const ch = (SharedState._data.chamamentos||[]).find(x=>x.id===id);
  if (ch) { ch.status = 'Homologado'; ch.homologadoEm = new Date().toISOString(); SharedState._persist(); }
  showToast('Chamamento homologado! Ata de contratação gerada.', 'success'); renderPage();
};
window._aqHomologarLic = (id) => {
  const l = (SharedState._data.licitacoes||[]).find(x=>x.id===id);
  if (l) { l.status = 'Homologado'; l.homologadoEm = new Date().toISOString(); SharedState._persist(); }
  showToast('Licitação homologada!', 'success'); renderPage();
};

// ─────────────────────────────────────────
// §8  SPRINT C — CONFORMIDADE
// ─────────────────────────────────────────
PAGE_RENDERERS.gestor_conformidade = (el) => {
  const alertas   = SharedState.getAlertas();
  const pendentes = alertas.filter(a => !a.resolvido).sort((a,b) => ({critico:0,atencao:1,info:2}[a.severidade]||2) - ({critico:0,atencao:1,info:2}[b.severidade]||2));
  const resolvidos = alertas.filter(a => a.resolvido);
  const score     = alertas.length ? Math.round(resolvidos.length / alertas.length * 100) : 100;
  const scoreBg   = score >= 80 ? '#2E7D32' : score >= 50 ? '#F57F17' : '#C62828';
  const criticos  = pendentes.filter(a => a.severidade === 'critico').length;
  const atencoes  = pendentes.filter(a => a.severidade === 'atencao').length;
  const links = { listacompras: 'listacompras', distribuicao: 'distribuicao', prestacaocontas: 'prestacaocontas', aquisicoes: 'aquisicoes' };

  el.innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">🛡️ Conformidade</h1>
  <p class="page-subtitle">Monitoramento preventivo — FNDE · TCE-MS · Ministério Público</p></div>
  <button class="btn btn-secondary" onclick="showToast('Relatório de conformidade exportado (PDF via backend).','info')">📄 Relatório para TCE/MP</button>
</div>

<div style="display:grid;grid-template-columns:190px 1fr;gap:20px;margin-bottom:24px">
  <div class="card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center">
    <div style="font-size:2.8rem;font-weight:800;color:${scoreBg}">${score}%</div>
    <div style="font-size:.85rem;font-weight:600;margin:4px 0">Score de Conformidade</div>
    <div style="font-size:.75rem;color:var(--text-secondary)">${resolvidos.length} de ${alertas.length} checagens OK</div>
    <div class="_bar-track" style="width:100%;margin-top:10px">
      <div class="_bar-fill" style="width:${score}%;background:${scoreBg}"></div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
    <div class="kpi-card red"><div class="kpi-icon">🚨</div><div class="kpi-value">${criticos}</div><div class="kpi-label">Alertas Críticos</div></div>
    <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${atencoes}</div><div class="kpi-label">Atenção</div></div>
    <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${resolvidos.length}</div><div class="kpi-label">Resolvidos</div></div>
  </div>
</div>

${pendentes.length === 0 ? `<div class="card"><div class="card-body" style="text-align:center;padding:48px">
  <div style="font-size:3rem">✅</div>
  <div style="font-size:1.1rem;font-weight:600;margin:8px 0">Tudo em conformidade!</div>
  <div style="color:var(--text-secondary)">Nenhuma pendência ativa. Continue assim!</div>
</div></div>` : `
<div class="card" style="margin-bottom:20px">
  <div class="card-header"><div class="card-title">⚠️ Alertas Ativos (${pendentes.length})</div></div>
  <div class="card-body" style="padding:0">
    ${pendentes.map(a => `<div style="display:flex;align-items:flex-start;gap:14px;padding:14px 16px;border-bottom:1px solid var(--border-light,#f1f5f9);border-left:4px solid ${a.severidade==='critico'?'#C62828':a.severidade==='atencao'?'#F57F17':'#1565C0'}">
      <div style="flex:1">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">${sevBadge(a.severidade)}<span style="font-size:.9rem;font-weight:600">${a.titulo}</span></div>
        <div style="font-size:.82rem;color:var(--text-secondary)">${a.descricao}</div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0;margin-top:2px">
        ${a.link&&links[a.link]?`<button class="btn btn-sm" style="font-size:.78rem" onclick="navigateTo('gestor','${links[a.link]}')">🔗 Ir</button>`:''}
        <button class="btn btn-sm" style="font-size:.78rem;background:#2E7D32;color:#fff" onclick="window._confResolver('${a.id}')">✓ OK</button>
      </div>
    </div>`).join('')}
  </div>
</div>`}

${resolvidos.length ? `<div class="card">
  <div class="card-header"><div class="card-title">✅ Resolvidos (${resolvidos.length})</div></div>
  <div class="card-body" style="padding:0">
    ${resolvidos.map(a=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 16px;border-bottom:1px solid var(--border-light,#f1f5f9);opacity:.65">
      <div>
        <div style="font-size:.85rem;font-weight:500;text-decoration:line-through">${a.titulo}</div>
        <div style="font-size:.72rem;color:var(--text-secondary)">Resolvido em ${a.resolvidoEm?new Date(a.resolvidoEm).toLocaleDateString('pt-BR'):'—'}</div>
      </div>
      <span style="color:#2E7D32;font-size:1.2rem">✅</span>
    </div>`).join('')}
  </div>
</div>` : ''}`;

  window._confResolver = (id) => {
    SharedState.resolverAlerta(id); showToast('Alerta marcado como resolvido!', 'success'); renderPage();
  };
};

// ─────────────────────────────────────────
// §9  SPRINT C — PORTAL DE TRANSPARÊNCIA
// ─────────────────────────────────────────
PAGE_RENDERERS.gestor_transparencia = (el) => {
  const ex      = SharedState.getExercicios()[0];
  const parc    = ex?.parcelas || [];
  const recebido = parc.filter(p=>p.status==='Recebida').reduce((s,p)=>s+p.valor,0);
  const nfs     = SharedState.getNFs();
  const totalNFs = nfs.reduce((s,n)=>s+(n.valor||0),0);
  const menus   = SharedState.getMenus().filter(m=>m.status==='Publicado');
  const escolas = getPilotSchools();
  const totalAlunos = escolas.reduce((s,sc)=>s+(sc.students||0),0);
  const hoje    = new Date().toLocaleDateString('pt-BR');

  el.innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">🌐 Portal de Transparência</h1>
  <p class="page-subtitle">Página pública de prestação de contas — acessível sem login</p></div>
</div>

<div style="border:2px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:20px;box-shadow:0 2px 12px rgba(0,0,0,.06)">
  <div style="background:linear-gradient(135deg,#1565C0,#0277BD);color:#fff;padding:18px 24px;display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="font-size:.75rem;opacity:.85;margin-bottom:2px">🇧🇷 Governo Municipal · Campo Grande · MS</div>
      <div style="font-size:1.15rem;font-weight:700">Alimentação Escolar — Transparência Pública</div>
    </div>
    <div style="text-align:right;font-size:.75rem;opacity:.8">
      <div>Exercício ${ex?.ano||2026}</div>
      <div>Atualizado em ${hoje}</div>
    </div>
  </div>

  <div style="padding:24px;background:var(--surface-2,#f8fafc)">
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px">
      ${[
        {val:cur(recebido), label:'Recursos Recebidos', color:'#1565C0'},
        {val:cur(totalNFs), label:'Investido em Alimentação', color:'#2E7D32'},
        {val:totalAlunos.toLocaleString('pt-BR'), label:'Alunos Beneficiados', color:'#F57F17'},
        {val:'22,4%', label:'Agricultura Familiar', color:'#7B1FA2'},
      ].map(k=>`<div style="background:#fff;border-radius:10px;padding:16px;text-align:center;border:1px solid var(--border)">
        <div style="font-size:1.4rem;font-weight:800;color:${k.color}">${k.val}</div>
        <div style="font-size:.78rem;color:var(--text-secondary);margin-top:4px">${k.label}</div>
      </div>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div style="background:#fff;border-radius:10px;padding:16px;border:1px solid var(--border)">
        <div style="font-size:.85rem;font-weight:700;margin-bottom:10px">🍽️ Cardápios Publicados</div>
        ${menus.length ? menus.slice(0,4).map(m=>`<div class="_inf-row">
          <span style="font-size:.82rem">${m.nome}</span>
          <span class="_pill" style="background:#e8f5e9;color:#2E7D32">${m.status}</span>
        </div>`).join('') : '<div style="color:var(--text-secondary);font-size:.82rem">Nenhum cardápio publicado.</div>'}
      </div>
      <div style="background:#fff;border-radius:10px;padding:16px;border:1px solid var(--border)">
        <div style="font-size:.85rem;font-weight:700;margin-bottom:10px">🌾 Fornecedores Contratados</div>
        ${[
          {nome:'COOPAGRAN',tipo:'AF Local',bg:'#e8f5e9',cl:'#2E7D32'},
          {nome:'COOPERSUL',tipo:'AF Regional',bg:'#e3f2fd',cl:'#1565C0'},
          {nome:'Distribuidora Aliança',tipo:'Mercado',bg:'#f3e5f5',cl:'#7B1FA2'},
        ].map(f=>`<div class="_inf-row">
          <span style="font-size:.82rem">${f.nome}</span>
          <span class="_pill" style="background:${f.bg};color:${f.cl}">${f.tipo}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <div style="background:#f1f5f9;padding:10px 20px;font-size:.73rem;color:var(--text-secondary);display:flex;justify-content:space-between">
    <span>Lei de Acesso à Informação · Lei nº 12.527/2011</span>
    <span>LGPD compliant · Nenhum dado pessoal exposto</span>
  </div>
</div>

<div class="card">
  <div class="card-header"><div class="card-title">⚙️ Configurações de Publicação</div></div>
  <div class="card-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      ${[
        {id:'pub-cardapios',label:'Publicar cardápios semanais',ch:true},
        {id:'pub-financeiro',label:'Publicar dados financeiros',ch:true},
        {id:'pub-fornecedores',label:'Listar fornecedores contratados',ch:true},
        {id:'pub-escolas',label:'Execução por escola (individual)',ch:false},
      ].map(c=>`<label style="display:flex;align-items:center;gap:10px;cursor:pointer">
        <input type="checkbox" id="${c.id}" ${c.ch?'checked':''}>
        <span style="font-size:.85rem">${c.label}</span>
      </label>`).join('')}
    </div>
    <button class="btn btn-primary" onclick="showToast('Configurações do portal salvas!','success')">Salvar Configurações</button>
  </div>
</div>`;
};

// ─────────────────────────────────────────
// §10  BADGE DINÂMICO DE CONFORMIDADE
// ─────────────────────────────────────────
(function patchBadge() {
  const orig = window.computeDynamicBadge;
  window.computeDynamicBadge = function(profile, pageId) {
    if (profile === 'gestor' && pageId === 'conformidade') {
      const n = SharedState.getAlertas().filter(a => !a.resolvido).length;
      return n > 0 ? String(n) : null;
    }
    return orig ? orig(profile, pageId) : null;
  };
})();

})(); // end IIFE
