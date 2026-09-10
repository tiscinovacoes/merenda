/* ============================================
   SUALE — Módulo Administração (js/modules/admin.js)
   Perfil: Gestor — Usuários & Acessos + Auditoria/Logs de atividade por perfil
   ============================================ */
(function () {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};
  const P = window.PAGE_RENDERERS;
  const S = () => window.SharedState;
  const esc = (s) => (window.escapeHTML ? window.escapeHTML(String(s == null ? '' : s)) : String(s == null ? '' : s));
  const toast = (m, t) => window.showToast && window.showToast(m, t);
  const rerender = () => { if (typeof renderPage === 'function') renderPage(); };

  // Perfis do sistema (rótulo + cor) — fonte única p/ pills
  const PERFIS = {
    gestor:        { label: 'Gestor SEMED',        cor: '#2563eb' },
    nutricionista: { label: 'Nutricionista',       cor: '#16a34a' },
    escola:        { label: 'Escola',              cor: '#7c3aed' },
    diretor:       { label: 'Escola (Diretor)',    cor: '#7c3aed' },
    resp_estoque:  { label: 'Escola (Estoque)',    cor: '#7c3aed' },
    merendeira:    { label: 'Escola (Merendeira)', cor: '#7c3aed' },
    cooperativa:   { label: 'Cooperativa',         cor: '#0891b2' },
    agricultor:    { label: 'Agricultor Familiar', cor: '#65a30d' },
    estoque:       { label: 'Estoque Central',     cor: '#d97706' },
    compras:       { label: 'Compras & Contratos', cor: '#db2777' },
    sistema:       { label: 'Sistema',             cor: '#64748b' },
  };
  const perfilInfo = (p) => PERFIS[p] || { label: p || '—', cor: '#64748b' };
  function pill(perfil) { const i = perfilInfo(perfil); return `<span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:.72rem;font-weight:600;background:${i.cor}22;color:${i.cor}">${esc(i.label)}</span>`; }
  function statusPill(st) { const ok = st === 'ativo'; const c = ok ? '#16a34a' : '#dc2626'; return `<span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:.72rem;font-weight:600;background:${c}22;color:${c}">${ok ? 'ativo' : 'inativo'}</span>`; }
  function header(title, sub, actions) {
    return `<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div><div class="page-title">${title}</div><div class="page-subtitle">${sub}</div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${actions || ''}</div></div>`;
  }
  const fmtHora = (iso) => { try { return new Date(iso).toLocaleString('pt-BR'); } catch { return iso; } };
  const opcoesPerfil = (sel) => Object.keys(PERFIS).filter(p => !['sistema', 'diretor', 'resp_estoque', 'merendeira'].includes(p))
    .map(p => `<option value="${p}" ${p === sel ? 'selected' : ''}>${esc(PERFIS[p].label)}</option>`).join('');

  // ═════════════════════════════════════════════════════════════
  // AUDITORIA / LOGS — o que cada perfil está fazendo
  // ═════════════════════════════════════════════════════════════
  let logFiltro = { perfil: '', busca: '' };
  P.gestor_auditoria = (el) => {
    const s = S();
    const todos = s.getAtividades();
    const lista = s.getAtividades(logFiltro);
    const perfisAtivos = [...new Set(todos.map(a => a.perfil))];
    const ultimo = todos[0];
    const chips = ['', ...perfisAtivos].map(p => {
      const ativo = logFiltro.perfil === p;
      const lbl = p === '' ? 'Todos' : perfilInfo(p).label;
      const cor = p === '' ? '#334155' : perfilInfo(p).cor;
      return `<button onclick="window.adminFiltrarLog('${p}')" style="padding:5px 12px;border-radius:14px;font-size:.78rem;font-weight:600;cursor:pointer;border:1px solid ${cor}${ativo ? '' : '55'};background:${ativo ? cor : cor + '15'};color:${ativo ? '#fff' : cor}">${esc(lbl)}</button>`;
    }).join('');
    el.innerHTML = header('Auditoria / Logs', 'Trilha de atividade por perfil — quem fez o quê e quando (últimos 500 eventos)',
      `<button class="btn btn-outline btn-sm" onclick="window.adminLimparLog()">🗑️ Limpar logs</button>`) + `
      <div class="kpi-grid" style="margin-bottom:18px">
        <div class="kpi-card blue"><div class="kpi-icon">📜</div><div class="kpi-value">${todos.length}</div><div class="kpi-label">Eventos registrados</div></div>
        <div class="kpi-card green"><div class="kpi-icon">👥</div><div class="kpi-value">${perfisAtivos.length}</div><div class="kpi-label">Perfis com atividade</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">⏱️</div><div class="kpi-value" style="font-size:.95rem">${ultimo ? esc(fmtHora(ultimo.timestamp)) : '—'}</div><div class="kpi-label">Último evento</div></div>
      </div>
      <div class="card" style="margin-bottom:14px"><div style="padding:12px 16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center">
        <div style="display:flex;gap:6px;flex-wrap:wrap">${chips}</div>
        <input id="log-busca" value="${esc(logFiltro.busca)}" oninput="window.adminBuscarLog(this.value)" placeholder="🔎 buscar ação, tela, usuário…" style="flex:1;min-width:200px;padding:8px;border:1px solid var(--border,#e2e8f0);border-radius:8px">
      </div></div>
      <div class="card"><div style="overflow-x:auto;max-height:60vh"><table class="data-table"><thead><tr>
        <th>Quando</th><th>Perfil</th><th>Usuário</th><th>Ação</th><th>Tela</th><th>Detalhe</th></tr></thead><tbody>
        ${lista.length ? lista.map(a => `<tr>
          <td style="white-space:nowrap;font-size:.8rem;color:var(--text-secondary)">${esc(fmtHora(a.timestamp))}</td>
          <td>${pill(a.perfil)}</td>
          <td>${esc(a.usuario)}</td>
          <td><strong>${esc(a.acao)}</strong></td>
          <td><span style="font-family:var(--font-mono);font-size:.8rem">${esc(a.tela || '—')}</span></td>
          <td style="color:var(--text-secondary)">${esc(a.detalhe || '')}</td></tr>`).join('')
        : `<tr><td colspan="6" style="text-align:center;padding:28px;color:var(--text-secondary)">Nenhum evento${logFiltro.perfil || logFiltro.busca ? ' para o filtro atual' : ' ainda — navegue pelos perfis para gerar a trilha'}.</td></tr>`}
      </tbody></table></div></div>`;
  };
  window.adminFiltrarLog = (perfil) => { logFiltro.perfil = perfil; rerender(); };
  window.adminBuscarLog = (v) => { logFiltro.busca = v; const el = document.getElementById('page-content'); if (el) P.gestor_auditoria(el); const inp = document.getElementById('log-busca'); if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); } };
  window.adminLimparLog = () => { if (!confirm('Limpar toda a trilha de atividade?')) return; S().limparAtividades(); toast('🗑️ Logs limpos.', 'info'); rerender(); };

  // ═════════════════════════════════════════════════════════════
  // USUÁRIOS & ACESSOS — cadastro para acesso aos perfis
  // ═════════════════════════════════════════════════════════════
  P.gestor_usuarios = (el) => {
    const s = S();
    const usuarios = s.getUsuarios();
    const ativos = usuarios.filter(u => u.status === 'ativo').length;
    const porPerfil = {}; usuarios.forEach(u => porPerfil[u.perfil] = (porPerfil[u.perfil] || 0) + 1);
    el.innerHTML = header('Usuários & Acessos', 'Cadastro de usuários e o perfil que cada um acessa no sistema',
      `<button class="btn btn-primary btn-sm" onclick="window.adminNovoUsuario()">➕ Novo usuário</button>`) + `
      <div class="kpi-grid" style="margin-bottom:18px">
        <div class="kpi-card blue"><div class="kpi-icon">👤</div><div class="kpi-value">${usuarios.length}</div><div class="kpi-label">Usuários</div></div>
        <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${ativos}</div><div class="kpi-label">Ativos</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">🗂️</div><div class="kpi-value">${Object.keys(porPerfil).length}</div><div class="kpi-label">Perfis em uso</div></div>
      </div>
      <div class="card"><div style="overflow-x:auto"><table class="data-table"><thead><tr>
        <th>Nome</th><th>Login</th><th>Perfil de acesso</th><th>Cargo</th><th>Status</th><th>Desde</th><th style="text-align:right">Ações</th></tr></thead><tbody>
        ${usuarios.map(u => `<tr>
          <td><strong>${esc(u.nome)}</strong></td>
          <td style="font-family:var(--font-mono);font-size:.85rem">${esc(u.login)}</td>
          <td>${pill(u.perfil)}</td>
          <td style="color:var(--text-secondary)">${esc(u.cargo || '')}</td>
          <td>${statusPill(u.status)}</td>
          <td style="font-size:.8rem;color:var(--text-secondary)">${esc(u.criadoEm || '')}</td>
          <td style="text-align:right;white-space:nowrap">
            <button class="btn btn-sm btn-outline" onclick="window.adminEditarUsuario('${u.id}')">✏️</button>
            <button class="btn btn-sm btn-outline" onclick="window.adminToggleUsuario('${u.id}')">${u.status === 'ativo' ? '🚫' : '✅'}</button>
            <button class="btn btn-sm btn-outline" style="border-color:#dc2626;color:#dc2626" onclick="window.adminRemoverUsuario('${u.id}')">🗑️</button>
          </td></tr>`).join('')}
      </tbody></table></div></div>`;
  };

  function formUsuario(u) {
    u = u || {};
    return `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="grid-column:1/3"><label style="font-weight:600;font-size:.85rem">Nome completo</label>
          <input id="u-nome" value="${esc(u.nome || '')}" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px"></div>
        <div><label style="font-weight:600;font-size:.85rem">Login (usuário)</label>
          <input id="u-login" value="${esc(u.login || '')}" placeholder="nome.sobrenome" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px"></div>
        <div><label style="font-weight:600;font-size:.85rem">Perfil de acesso</label>
          <select id="u-perfil" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px">${opcoesPerfil(u.perfil)}</select></div>
        <div><label style="font-weight:600;font-size:.85rem">Cargo / Organização</label>
          <input id="u-cargo" value="${esc(u.cargo || '')}" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px"></div>
        <div><label style="font-weight:600;font-size:.85rem">Status</label>
          <select id="u-status" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px">
            <option value="ativo" ${u.status !== 'inativo' ? 'selected' : ''}>Ativo</option>
            <option value="inativo" ${u.status === 'inativo' ? 'selected' : ''}>Inativo</option></select></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px">
        <button class="btn btn-outline btn-sm" onclick="window.closeModal()">Cancelar</button>
        <button class="btn btn-primary btn-sm" onclick="window.adminSalvarUsuario('${u.id || ''}')">✔️ Salvar</button></div>`;
  }
  window.adminNovoUsuario = () => window.showModal('➕ Novo usuário', formUsuario({}), '560px');
  window.adminEditarUsuario = (id) => { const u = S().getUsuarios().find(x => x.id === id); if (u) window.showModal('✏️ Editar usuário — ' + esc(u.nome), formUsuario(u), '560px'); };
  window.adminSalvarUsuario = (id) => {
    const g = (x) => document.getElementById(x);
    const dados = { nome: g('u-nome').value.trim(), login: g('u-login').value.trim(), perfil: g('u-perfil').value, cargo: g('u-cargo').value.trim(), status: g('u-status').value };
    if (!dados.nome || !dados.login) return toast('⚠️ Preencha nome e login.', 'warning');
    const s = S();
    if (id) s.updateUsuario(id, dados); else s.addUsuario(dados);
    window.closeModal();
    toast(id ? '✔️ Usuário atualizado.' : '👤 Usuário cadastrado.', 'success');
    rerender();
  };
  window.adminToggleUsuario = (id) => { S().toggleUsuarioStatus(id); rerender(); };
  window.adminRemoverUsuario = (id) => {
    const u = S().getUsuarios().find(x => x.id === id);
    if (!confirm('Remover o usuário "' + (u ? u.nome : '') + '"?')) return;
    S().removeUsuario(id); toast('🗑️ Usuário removido.', 'info'); rerender();
  };
})();
