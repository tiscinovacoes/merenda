/* ============================================
   SUALE — Módulo Compras & Contratos (js/modules/compras.js)
   Perfil: Setor de Compras / Gestão Contratual (Ata → Contrato → Empenho → Pedido)
   Ver ESPEC_COMPRAS_CONTRATOS.md
   ============================================ */
(function () {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};
  const P = window.PAGE_RENDERERS;
  const S = () => window.SharedState;

  const brl = (v) => 'R$ ' + Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const kg = (v) => Number(v || 0).toLocaleString('pt-BR');
  const esc = (s) => (window.escapeHTML ? window.escapeHTML(String(s == null ? '' : s)) : String(s == null ? '' : s));
  const toast = (m, t) => window.showToast && window.showToast(m, t);
  const rerender = () => { if (typeof renderPage === 'function') renderPage(); };

  function bar(pct, color) {
    const p = Math.max(0, Math.min(100, pct || 0));
    return `<div style="height:7px;background:#e9edf2;border-radius:6px;overflow:hidden;margin-top:4px">
      <div style="height:100%;width:${p}%;background:${color};transition:width .3s"></div></div>`;
  }
  function statusPill(txt, color) {
    return `<span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:0.72rem;font-weight:600;background:${color}22;color:${color}">${esc(txt)}</span>`;
  }
  const CLR = { ok: '#16a34a', warn: '#d97706', bad: '#dc2626', blue: '#2563eb', gray: '#64748b', purple: '#7c3aed' };
  function corStatus(st) {
    return ({ vigente: CLR.ok, ativo: CLR.ok, emitida: CLR.blue, convertida: CLR.purple, reservado: CLR.warn, parcial: CLR.warn, entregue: CLR.blue, conferida: CLR.blue, liquidada: CLR.ok, liquidado: CLR.ok, aguardando: CLR.gray, divergente: CLR.bad })[st] || CLR.gray;
  }
  function header(title, sub, actions) {
    return `<div class="page-header" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
      <div><div class="page-title">${title}</div><div class="page-subtitle">${sub}</div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${actions || ''}</div></div>`;
  }

  // ─────────────────────────────────────────────────────────────
  // DASHBOARD CONTRATUAL
  // ─────────────────────────────────────────────────────────────
  P.compras_dashboard = (el) => {
    const s = S();
    const atas = s.comprasAtas();
    const contratos = s.comprasContratos();
    const empenhos = s.comprasEmpenhos();
    const pedidos = s.comprasPedidos();
    const os = s.comprasOsCompra().filter(o => o.status === 'emitida');
    // saldos globais por nível (valor)
    let saldoAta = 0, saldoContrato = 0, saldoEmpenho = 0;
    s.comprasAtaItens().forEach(ai => saldoAta += s.comprasSaldoAtaItem(ai.id) * (ai.precoUnit || 0));
    s.comprasContratoItens().forEach(ci => saldoContrato += s.comprasSaldoContratoItem(ci.id) * (ci.precoUnit || 0));
    s.comprasEmpenhoItens().forEach(ei => saldoEmpenho += s.comprasSaldoLivreEmpenhoItem(ei.id) * (ei.precoUnit || 0));
    // cumprimento de entregas
    const pedItens = s.comprasPedidoItens();
    let aEntregar = 0;
    pedItens.forEach(pi => aEntregar += s.comprasSaldoAEntregarPedidoItem(pi.id) * (pi.precoUnit || 0));

    el.innerHTML = header('Dashboard Contratual', 'Visão de saldos em cascata (Ata → Contrato → Empenho) e cumprimento de entregas',
      `<button class="btn btn-outline btn-sm" onclick="window.comprasResetDemo()">↻ Restaurar seed</button>`) + `
      <div class="kpi-grid" style="margin-bottom:24px">
        <div class="kpi-card blue"><div class="kpi-icon">📋</div><div class="kpi-value">${atas.length}</div><div class="kpi-label">Atas vigentes</div><small style="color:var(--text-tertiary)">Saldo ${brl(saldoAta)}</small></div>
        <div class="kpi-card green"><div class="kpi-icon">📄</div><div class="kpi-value">${contratos.length}</div><div class="kpi-label">Contratos</div><small style="color:var(--text-tertiary)">Saldo ${brl(saldoContrato)}</small></div>
        <div class="kpi-card orange"><div class="kpi-icon">💳</div><div class="kpi-value">${empenhos.length}</div><div class="kpi-label">Empenhos</div><small style="color:var(--text-tertiary)">Saldo livre ${brl(saldoEmpenho)}</small></div>
        <div class="kpi-card" style="cursor:pointer" onclick="navigateTo(null,'pedidos')"><div class="kpi-icon">🛒</div><div class="kpi-value">${pedidos.length}</div><div class="kpi-label">Pedidos</div><small style="color:var(--warning)">A entregar ${brl(aEntregar)}</small></div>
      </div>
      ${os.length ? `<div class="card" style="border-left:4px solid ${CLR.blue};margin-bottom:20px"><div style="padding:14px 16px">
        <strong>📥 ${os.length} OS de Compra aguardando conversão em pedido.</strong>
        <button class="btn btn-primary btn-sm" style="margin-left:12px" onclick="navigateTo(null,'oscompra')">Abrir fila →</button></div></div>` : ''}
      <div class="card"><div class="card-header"><h3 class="card-title">Saldo por item da ata (cascata)</h3></div>
      <div style="overflow-x:auto"><table class="data-table"><thead><tr>
        <th>Produto</th><th>Fornecedor</th><th style="text-align:right">Ata</th><th style="text-align:right">Contrato</th><th style="text-align:right">Empenho (livre)</th></tr></thead><tbody>
        ${s.comprasAtaItens().map(ai => {
          const f = s.comprasFornecedor(ai.fornecedorId);
          const sa = s.comprasSaldoAtaItem(ai.id);
          const cis = s.comprasContratoItens().filter(ci => ci.ataItemId === ai.id);
          const sc = cis.reduce((t, ci) => t + s.comprasSaldoContratoItem(ci.id), 0);
          const eis = s.comprasEmpenhoItens().filter(ei => cis.some(ci => ci.id === ei.contratoItemId));
          const se = eis.reduce((t, ei) => t + s.comprasSaldoLivreEmpenhoItem(ei.id), 0);
          return `<tr>
            <td><strong>${esc(ai.produto)}</strong></td>
            <td>${esc(f ? f.razaoSocial : '—')}</td>
            <td style="text-align:right;font-family:var(--font-mono)">${kg(sa)}/${kg(ai.qtdLicitada)} ${ai.unidade}${bar(ai.qtdLicitada ? sa / ai.qtdLicitada * 100 : 0, CLR.blue)}</td>
            <td style="text-align:right;font-family:var(--font-mono)">${kg(sc)} ${ai.unidade}</td>
            <td style="text-align:right;font-family:var(--font-mono);font-weight:600;color:${se > 0 ? CLR.ok : CLR.gray}">${kg(se)} ${ai.unidade}</td>
          </tr>`;
        }).join('')}
      </tbody></table></div></div>`;
  };

  // ─────────────────────────────────────────────────────────────
  // FORNECEDORES (com cumprimento de entregas)
  // ─────────────────────────────────────────────────────────────
  P.compras_fornecedores = (el) => {
    const s = S();
    el.innerHTML = header('Fornecedores', 'Cadastro + cumprimento de entregas (entregue × a entregar)') + `
      <div class="card"><div style="overflow-x:auto"><table class="data-table"><thead><tr>
        <th>Fornecedor</th><th>CNPJ</th><th>Tipo</th><th style="text-align:right">Pedidos</th><th style="text-align:right">A entregar</th><th>Situação</th></tr></thead><tbody>
        ${s.comprasFornecedores().map(f => {
          const peds = s.comprasPedidos(f.id);
          const pis = s.comprasPedidoItens().filter(pi => peds.some(p => p.id === pi.pedidoId));
          const aEntregar = pis.reduce((t, pi) => t + s.comprasSaldoAEntregarPedidoItem(pi.id), 0);
          const sit = aEntregar > 0 ? statusPill('a entregar', CLR.warn) : (peds.length ? statusPill('em dia', CLR.ok) : statusPill('sem pedidos', CLR.gray));
          return `<tr>
            <td><strong>${esc(f.razaoSocial)}</strong></td>
            <td style="font-family:var(--font-mono)">${esc(f.cnpj)}</td>
            <td>${esc(f.tipo)}</td>
            <td style="text-align:right">${peds.length}</td>
            <td style="text-align:right;font-family:var(--font-mono);color:${aEntregar > 0 ? CLR.warn : CLR.ok}">${kg(aEntregar)} kg</td>
            <td>${sit}</td></tr>`;
        }).join('')}
      </tbody></table></div></div>`;
  };

  // ─────────────────────────────────────────────────────────────
  // ATAS (itens produto × fornecedor + saldo)
  // ─────────────────────────────────────────────────────────────
  P.compras_atas = (el) => {
    const s = S();
    el.innerHTML = header('Atas de Registro de Preços', 'O teto licitado — vários produtos × vários fornecedores') +
      s.comprasAtas().map(ata => {
        const itens = s.comprasAtaItens(ata.id);
        const total = itens.reduce((t, ai) => t + ai.qtdLicitada * ai.precoUnit, 0);
        return `<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
          <div><h3 class="card-title">${esc(ata.numero)} · ${esc((s.comprasContratos(ata.id).length))} contrato(s) · ${statusPill(ata.status, corStatus(ata.status))}</h3>
          <small style="color:var(--text-secondary)">${esc(s.comprasFornecedor((s.comprasAtaItens(ata.id)[0]||{}).fornecedorId) ? s.comprasFornecedor((s.comprasAtaItens(ata.id)[0]||{}).fornecedorId).razaoSocial : ata.objeto)} · ${esc(ata.modalidade)} · vigência ${esc(ata.dataInicio)} a ${esc(ata.dataFim)}</small></div>
          <div style="display:flex;align-items:center;gap:12px"><div style="text-align:right"><div style="font-weight:700">${brl(total)}</div><small style="color:var(--text-secondary)">valor licitado</small></div>
          <button class="btn btn-primary btn-sm" onclick="window.comprasAbrirAta('${ata.id}')">🔍 Gerenciar</button></div></div>
          <div style="overflow-x:auto"><table class="data-table"><thead><tr>
            <th>Produto</th><th>Fornecedor</th><th style="text-align:right">Preço un.</th><th style="text-align:right">Licitado</th><th style="text-align:right">Comprometido</th><th style="text-align:right">Saldo ata</th></tr></thead><tbody>
            ${itens.map(ai => {
              const f = s.comprasFornecedor(ai.fornecedorId);
              const sa = s.comprasSaldoAtaItem(ai.id);
              const comprometido = ai.qtdLicitada - sa;
              return `<tr>
                <td><strong>${esc(ai.produto)}</strong></td>
                <td>${esc(f ? f.razaoSocial : '—')}</td>
                <td style="text-align:right;font-family:var(--font-mono)">${brl(ai.precoUnit)}</td>
                <td style="text-align:right;font-family:var(--font-mono)">${kg(ai.qtdLicitada)} ${ai.unidade}</td>
                <td style="text-align:right;font-family:var(--font-mono)">${kg(comprometido)} ${ai.unidade}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-weight:600;color:${sa > 0 ? CLR.ok : CLR.gray}">${kg(sa)} ${ai.unidade}${bar(ai.qtdLicitada ? sa / ai.qtdLicitada * 100 : 0, CLR.blue)}</td>
              </tr>`;
            }).join('')}
          </tbody></table></div></div>`;
      }).join('');
  };

  // ─────────────────────────────────────────────────────────────
  // CONTRATOS
  // ─────────────────────────────────────────────────────────────
  P.compras_contratos = (el) => {
    const s = S();
    el.innerHTML = header('Contratos', 'Por fornecedor, dentro da ata (~metade do licitado) — saldo contrato vs. empenhado') +
      s.comprasContratos().map(ct => {
        const f = s.comprasFornecedor(ct.fornecedorId);
        const ata = s.comprasAtas().find(a => a.id === ct.ataId);
        const itens = s.comprasContratoItens(ct.id);
        const total = itens.reduce((t, ci) => t + ci.qtdContratada * ci.precoUnit, 0);
        return `<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
          <div><h3 class="card-title">${esc(ct.numero)} · ${esc(f ? f.razaoSocial : '')} ${ct.geradoPor === 'cascata' ? statusPill('gerado p/ cascata', CLR.purple) : ''}</h3>
          <small style="color:var(--text-secondary)">Ata ${esc(ata ? ata.numero : '')} · ${esc(s.comprasEmpenhos(ct.id).length)} empenho(s) · ${statusPill(ct.status, corStatus(ct.status))}</small></div>
          <div style="display:flex;align-items:center;gap:12px"><div style="text-align:right"><div style="font-weight:700">${brl(total)}</div><small style="color:var(--text-secondary)">valor contratado</small></div>
          <button class="btn btn-primary btn-sm" onclick="window.comprasAbrirContrato('${ct.id}')">🔍 Gerenciar</button></div></div>
          <div style="overflow-x:auto"><table class="data-table"><thead><tr>
            <th>Produto</th><th style="text-align:right">Contratado</th><th style="text-align:right">Empenhado</th><th style="text-align:right">Saldo contrato</th></tr></thead><tbody>
            ${itens.map(ci => {
              const ai = s.comprasAtaItem(ci.ataItemId);
              const sc = s.comprasSaldoContratoItem(ci.id);
              const emp = ci.qtdContratada - sc;
              return `<tr>
                <td><strong>${esc(ai ? ai.produto : '')}</strong></td>
                <td style="text-align:right;font-family:var(--font-mono)">${kg(ci.qtdContratada)} ${ai ? ai.unidade : ''}</td>
                <td style="text-align:right;font-family:var(--font-mono)">${kg(emp)} ${ai ? ai.unidade : ''}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-weight:600;color:${sc > 0 ? CLR.ok : CLR.gray}">${kg(sc)} ${ai ? ai.unidade : ''}${bar(ci.qtdContratada ? sc / ci.qtdContratada * 100 : 0, CLR.ok)}</td>
              </tr>`;
            }).join('')}
          </tbody></table></div></div>`;
      }).join('');
  };

  // ─────────────────────────────────────────────────────────────
  // EMPENHOS (3 estados: empenhada / reservada / liquidada)
  // ─────────────────────────────────────────────────────────────
  P.compras_empenhos = (el) => {
    const s = S();
    el.innerHTML = header('Empenhos', 'Por contrato · saldo livre = empenhada − reservada − liquidada (a baixa só ocorre na conferência)') +
      s.comprasEmpenhos().map(emp => {
        const ct = s.comprasContrato(emp.contratoId);
        const f = ct ? s.comprasFornecedor(ct.fornecedorId) : null;
        const itens = s.comprasEmpenhoItens(emp.id);
        return `<div class="card" style="margin-bottom:16px"><div class="card-header">
          <h3 class="card-title">${esc(emp.numero)} · ${esc(f ? f.razaoSocial : '')} ${emp.origemPedidoId ? statusPill('gerado p/ cascata', CLR.purple) : ''}</h3>
          <small style="color:var(--text-secondary)">Contrato ${esc(ct ? ct.numero : '')} · dotação ${esc(emp.dotacao)} · ${esc(emp.dataEmpenho)}</small></div>
          <div style="overflow-x:auto"><table class="data-table"><thead><tr>
            <th>Produto</th><th style="text-align:right">Empenhada</th><th style="text-align:right">Reservada</th><th style="text-align:right">Liquidada</th><th style="text-align:right">Saldo livre</th></tr></thead><tbody>
            ${itens.map(ei => {
              const ci = s.comprasContratoItem(ei.contratoItemId);
              const ai = ci ? s.comprasAtaItem(ci.ataItemId) : null;
              const res = s.comprasReservadaEmpenhoItem(ei.id);
              const liq = s.comprasLiquidadaEmpenhoItem(ei.id);
              const livre = s.comprasSaldoLivreEmpenhoItem(ei.id);
              return `<tr>
                <td><strong>${esc(ai ? ai.produto : '')}</strong></td>
                <td style="text-align:right;font-family:var(--font-mono)">${kg(ei.qtdEmpenhada)}</td>
                <td style="text-align:right;font-family:var(--font-mono);color:${CLR.warn}">${kg(res)}</td>
                <td style="text-align:right;font-family:var(--font-mono);color:${CLR.blue}">${kg(liq)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-weight:600;color:${livre > 0 ? CLR.ok : CLR.gray}">${kg(livre)}${bar(ei.qtdEmpenhada ? livre / ei.qtdEmpenhada * 100 : 0, CLR.orange || CLR.warn)}</td>
              </tr>`;
            }).join('')}
          </tbody></table></div></div>`;
      }).join('');
  };

  // ─────────────────────────────────────────────────────────────
  // OS DE COMPRA (fila de demanda) + converter em pedidos
  // ─────────────────────────────────────────────────────────────
  P.compras_oscompra = (el) => {
    const s = S();
    const lista = s.comprasOsCompra();
    el.innerHTML = header('OS de Compra', 'Demanda vinda da Nutrição (cardápio) ou do Estoque (reposição) — lista = previsto − estoque',
      `<button class="btn btn-primary btn-sm" onclick="window.comprasSimularOsCardapio()">➕ Simular OS do cardápio</button>`) +
      (lista.length ? lista.map(os => {
        const itens = s.comprasOsCompraItens(os.id);
        return `<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div><h3 class="card-title">${esc(os.numero)} · ${statusPill(os.status, corStatus(os.status))}</h3>
          <small style="color:var(--text-secondary)">Origem: ${esc(os.origem)} · ${esc(os.solicitante)} · ${esc(os.periodo || os.dataEmissao)}</small></div>
          ${os.status === 'emitida' ? `<button class="btn btn-primary btn-sm" onclick="window.comprasConverterOs('${os.id}')">⚙️ Converter em pedidos (cascata)</button>` : `<span>${statusPill('convertida', CLR.purple)}</span>`}</div>
          <div style="overflow-x:auto"><table class="data-table"><thead><tr>
            <th>Produto</th><th style="text-align:right">Previsto</th><th style="text-align:right">Estoque</th><th style="text-align:right">Necessário</th><th>Fornecedor (via ata)</th></tr></thead><tbody>
            ${itens.map(it => {
              const ai = s.comprasAtaItens().find(a => a.produto === it.produto);
              const f = ai ? s.comprasFornecedor(ai.fornecedorId) : null;
              return `<tr>
                <td><strong>${esc(it.produto)}</strong></td>
                <td style="text-align:right;font-family:var(--font-mono)">${kg(it.qtdPrevista)} ${it.unidade}</td>
                <td style="text-align:right;font-family:var(--font-mono)">${kg(it.qtdEstoque)} ${it.unidade}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-weight:600;color:${CLR.blue}">${kg(it.qtdNecessaria)} ${it.unidade}</td>
                <td>${f ? esc(f.razaoSocial) : statusPill('sem ata', CLR.bad)}</td></tr>`;
            }).join('')}
          </tbody></table></div></div>`;
      }).join('') : `<div class="card"><div style="padding:32px;text-align:center;color:var(--text-secondary)">Nenhuma OS de Compra na fila. Use “Simular OS do cardápio” para demonstrar o fluxo.</div></div>`);
  };

  // ─────────────────────────────────────────────────────────────
  // PEDIDOS (resultado da cascata) + lançar ordem de recebimento
  // ─────────────────────────────────────────────────────────────
  P.compras_pedidos = (el) => {
    const s = S();
    const peds = s.comprasPedidos();
    el.innerHTML = header('Pedidos / Aquisições', 'Gerados pela cascata (reserva de saldo). Entregue × a entregar por item.') +
      (peds.length ? peds.map(p => {
        const f = s.comprasFornecedor(p.fornecedorId);
        const itens = s.comprasPedidoItens(p.id);
        const total = itens.reduce((t, pi) => t + pi.qtdPedida * pi.precoUnit, 0);
        const aberto = itens.reduce((t, pi) => t + s.comprasSaldoAEntregarPedidoItem(pi.id), 0);
        return `<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div><h3 class="card-title">${esc(p.numero)} · ${esc(f ? f.razaoSocial : '')} · ${statusPill(p.status, corStatus(p.status))}</h3>
          <small style="color:var(--text-secondary)">${brl(total)} · ${esc(p.data)}${p.bloqueio ? ' · ' + statusPill('sem saldo p/ ' + kg(p.bloqueio) + ' kg', CLR.bad) : ''}</small></div>
          ${aberto > 0 ? (s.comprasOrdensRecebimento().some(o => o.pedidoId === p.id && o.status === 'aguardando')
              ? statusPill('entrada lançada — aguardando conferência', CLR.blue)
              : `<button class="btn btn-primary btn-sm" onclick="window.comprasLancarOrdem('${p.id}')">📥 Lançar entrada (NF)</button>`)
            : statusPill('entregue', CLR.ok)}</div>
          <div style="overflow-x:auto"><table class="data-table"><thead><tr>
            <th>Produto</th><th>Empenho</th><th style="text-align:right">Pedido</th><th style="text-align:right">Entregue</th><th style="text-align:right">A entregar</th></tr></thead><tbody>
            ${itens.map(pi => {
              const ei = s.comprasEmpenhoItem(pi.empenhoItemId);
              const emp = ei ? s.comprasEmpenho(ei.empenhoId) : null;
              const entregue = s.comprasEntreguePedidoItem(pi.id);
              const falta = s.comprasSaldoAEntregarPedidoItem(pi.id);
              return `<tr>
                <td><strong>${esc(pi.produto)}</strong></td>
                <td><small style="font-family:var(--font-mono)">${esc(emp ? emp.numero : '—')}</small></td>
                <td style="text-align:right;font-family:var(--font-mono)">${kg(pi.qtdPedida)}</td>
                <td style="text-align:right;font-family:var(--font-mono);color:${CLR.blue}">${kg(entregue)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-weight:600;color:${falta > 0 ? CLR.warn : CLR.ok}">${kg(falta)}</td></tr>`;
            }).join('')}
          </tbody></table></div></div>`;
      }).join('') : `<div class="card"><div style="padding:32px;text-align:center;color:var(--text-secondary)">Nenhum pedido ainda. Converta uma OS de Compra para gerar pedidos.</div></div>`);
  };

  // ─────────────────────────────────────────────────────────────
  // NOTAS FISCAIS (dono: Compras)
  // ─────────────────────────────────────────────────────────────
  P.compras_notas = (el) => {
    const s = S();
    const notas = s.comprasNotas();
    el.innerHTML = header('Notas Fiscais', 'Entrada da NF no perfil Compras (a NF não nasce no Estoque)') +
      `<div class="card"><div style="overflow-x:auto"><table class="data-table"><thead><tr>
        <th>NF</th><th>Fornecedor</th><th>Pedido</th><th style="text-align:right">Valor</th><th>Status</th></tr></thead><tbody>
        ${notas.length ? notas.map(nf => {
          const f = s.comprasFornecedor(nf.fornecedorId);
          const p = s.comprasPedido(nf.pedidoId);
          return `<tr><td style="font-family:var(--font-mono)">${esc(nf.numero)}</td><td>${esc(f ? f.razaoSocial : '')}</td>
            <td>${esc(p ? p.numero : '—')}</td><td style="text-align:right;font-family:var(--font-mono)">${brl(nf.valorTotal)}</td>
            <td>${statusPill(nf.status, corStatus(nf.status))}</td></tr>`;
        }).join('') : `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-secondary)">Sem NFs. Uma NF é criada ao lançar a Ordem de Recebimento de um pedido.</td></tr>`}
      </tbody></table></div></div>`;
  };

  // ─────────────────────────────────────────────────────────────
  // ORDENS DE RECEBIMENTO (lançadas aqui, executadas no Estoque)
  // ─────────────────────────────────────────────────────────────
  P.compras_recebimentos = (el) => {
    const s = S();
    const ordens = s.comprasOrdensRecebimento();
    el.innerHTML = header('Ordens de Recebimento', 'Compras lança a NF como entrada → a conferência é feita no Estoque Central. Aqui é só acompanhamento.') +
      `<div class="card" style="border-left:4px solid ${CLR.blue};margin-bottom:16px"><div style="padding:12px 16px;color:var(--text-secondary);font-size:.85rem">
        📥 Ao lançar a entrada (em <strong>Pedidos</strong>), a ordem aparece na fila de <strong>Conferência de Entradas (NF)</strong> do perfil <strong>Estoque Central</strong>.
        A confirmação lá dá a <strong>baixa do volume no empenho</strong> automaticamente.</div></div>` +
      (ordens.length ? ordens.map(o => {
        const f = s.comprasFornecedor(o.fornecedorId);
        const ped = s.comprasPedido(o.pedidoId);
        const itens = s.comprasOrdemRecebimentoItens(o.id);
        const rotulo = o.status === 'aguardando' ? 'aguardando conferência (Estoque)' : o.status + (o.resultado ? ' (' + o.resultado + ')' : '');
        return `<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div><h3 class="card-title">${esc(o.numero)} · ${esc(f ? f.razaoSocial : '')} · ${statusPill(rotulo, corStatus(o.resultado === 'divergente' ? 'divergente' : o.status))}</h3>
          <small style="color:var(--text-secondary)">Pedido ${esc(ped ? ped.numero : '')} · destino ${esc(o.destino)}</small></div></div>
          <div style="overflow-x:auto"><table class="data-table"><thead><tr>
            <th>Produto</th><th style="text-align:right">Esperado</th><th style="text-align:right">Recebido</th><th style="text-align:right">Divergência</th></tr></thead><tbody>
            ${itens.map(ri => `<tr>
              <td><strong>${esc(ri.produto)}</strong></td>
              <td style="text-align:right;font-family:var(--font-mono)">${kg(ri.qtdEsperada)}</td>
              <td style="text-align:right;font-family:var(--font-mono)">${o.status === 'aguardando' ? '—' : kg(ri.qtdRecebida)}</td>
              <td style="text-align:right;font-family:var(--font-mono);color:${ri.divergencia < 0 ? CLR.bad : (ri.divergencia > 0 ? CLR.warn : CLR.ok)}">${o.status === 'aguardando' ? '—' : (ri.divergencia > 0 ? '+' : '') + kg(ri.divergencia)}</td></tr>`).join('')}
          </tbody></table></div></div>`;
      }).join('') : `<div class="card"><div style="padding:32px;text-align:center;color:var(--text-secondary)">Nenhuma entrada lançada. Lance a partir de um pedido em “Pedidos / Aquisições”.</div></div>`);
  };

  // ─────────────────────────────────────────────────────────────
  // ESTOQUE CENTRAL — Conferência de Entradas (NF)  [perfil estoque]
  // Renderer registrado como estoque_conferencianf (roteador: profile_page)
  // ─────────────────────────────────────────────────────────────
  P.estoque_conferencianf = (el) => {
    const s = S();
    const ordens = s.comprasOrdensRecebimento();
    const fila = ordens.filter(o => o.status === 'aguardando');
    const feitas = ordens.filter(o => o.status !== 'aguardando');
    el.innerHTML = header('Conferência de Entradas (NF)', 'Entradas lançadas pelo Compras aguardando conferência física + NF. A confirmação dá baixa no empenho.') +
      `<div class="kpi-grid" style="margin-bottom:20px">
        <div class="kpi-card orange"><div class="kpi-icon">📥</div><div class="kpi-value">${fila.length}</div><div class="kpi-label">Aguardando conferência</div></div>
        <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${feitas.length}</div><div class="kpi-label">Conferidas</div></div>
      </div>` +
      (fila.length ? fila.map(o => {
        const f = s.comprasFornecedor(o.fornecedorId);
        const ped = s.comprasPedido(o.pedidoId);
        const nf = (s.comprasNotas()).find(n => n.id === o.notaFiscalId);
        const itens = s.comprasOrdemRecebimentoItens(o.id);
        return `<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div><h3 class="card-title">${esc(o.numero)} · ${esc(f ? f.razaoSocial : '')}</h3>
          <small style="color:var(--text-secondary)">NF ${esc(nf ? nf.numero : '—')} · Pedido ${esc(ped ? ped.numero : '')} · destino ${esc(o.destino)}</small></div>
          <button class="btn btn-primary btn-sm" onclick="window.comprasAbrirConferencia('${o.id}')">📥 Conferir e confirmar entrada</button></div>
          <div style="overflow-x:auto"><table class="data-table"><thead><tr>
            <th>Produto</th><th style="text-align:right">Qtd na NF (esperado)</th></tr></thead><tbody>
            ${itens.map(ri => `<tr><td><strong>${esc(ri.produto)}</strong></td><td style="text-align:right;font-family:var(--font-mono)">${kg(ri.qtdEsperada)}</td></tr>`).join('')}
          </tbody></table></div></div>`;
      }).join('') : `<div class="card"><div style="padding:32px;text-align:center;color:var(--text-secondary)">Nenhuma entrada aguardando conferência.</div></div>`) +
      (feitas.length ? `<div class="card"><div class="card-header"><h3 class="card-title">Conferidas recentemente</h3></div>
        <div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Ordem</th><th>Fornecedor</th><th>Resultado</th><th>Conferente</th></tr></thead><tbody>
        ${feitas.map(o => { const f = s.comprasFornecedor(o.fornecedorId); return `<tr><td style="font-family:var(--font-mono)">${esc(o.numero)}</td><td>${esc(f ? f.razaoSocial : '')}</td><td>${statusPill(o.resultado || '—', o.resultado === 'divergente' ? CLR.bad : CLR.ok)}</td><td>${esc(o.conferente || '—')}</td></tr>`; }).join('')}
        </tbody></table></div></div>` : '');
  };

  // ─────────────────────────────────────────────────────────────
  // LIQUIDAÇÃO
  // ─────────────────────────────────────────────────────────────
  P.compras_liquidacao = (el) => {
    const s = S();
    const pcs = s.comprasPrestacao();
    el.innerHTML = header('Liquidação', 'A baixa (liquidação) do empenho ocorre na CONFERÊNCIA do Estoque, pelo recebido. Aqui: liquidados e pagamento.') +
      `<div class="card"><div style="overflow-x:auto"><table class="data-table"><thead><tr>
        <th>Empenho</th><th>Ordem</th><th style="text-align:right">Liquidado</th><th style="text-align:right">Pago</th><th>Status</th><th></th></tr></thead><tbody>
        ${pcs.length ? pcs.map(p => {
          const emp = s.comprasEmpenho(p.empenhoId);
          const pago = (p.valorPago || 0) >= (p.valorLiquidado || 0) && p.valorLiquidado > 0;
          return `<tr><td style="font-family:var(--font-mono)">${esc(emp ? emp.numero : p.empenhoId)}</td>
            <td style="font-family:var(--font-mono)">${esc(p.ordemId || '—')}</td>
            <td style="text-align:right;font-family:var(--font-mono)">${brl(p.valorLiquidado)}</td>
            <td style="text-align:right;font-family:var(--font-mono)">${brl(p.valorPago)}</td>
            <td>${statusPill(pago ? 'pago' : 'liquidado', pago ? CLR.ok : CLR.blue)}</td>
            <td style="text-align:right">${pago ? statusPill('pago', CLR.ok) : `<button class="btn btn-primary btn-sm" onclick="window.comprasRegistrarPagamento('${p.id}')">💰 Registrar pagamento</button>`}</td></tr>`;
        }).join('') : `<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma liquidação. Elas surgem quando o Estoque confirma a entrada da NF.</td></tr>`}
      </tbody></table></div></div>`;
  };

  // ─────────────────────────────────────────────────────────────
  // PRESTAÇÃO DE CONTAS
  // ─────────────────────────────────────────────────────────────
  P.compras_prestacao = (el) => {
    const s = S();
    const pcs = s.comprasPrestacao();
    const total = pcs.reduce((t, p) => t + (p.valorLiquidado || 0), 0);
    el.innerHTML = header('Prestação de Contas', 'Liquidação + pagamento por empenho · documentos · relatórios') + `
      <div class="kpi-grid" style="margin-bottom:20px">
        <div class="kpi-card green"><div class="kpi-icon">🧾</div><div class="kpi-value">${pcs.length}</div><div class="kpi-label">Liquidações</div></div>
        <div class="kpi-card blue"><div class="kpi-icon">💰</div><div class="kpi-value" style="font-size:1.3rem">${brl(total)}</div><div class="kpi-label">Valor liquidado</div></div>
      </div>
      <div class="card"><div style="overflow-x:auto"><table class="data-table"><thead><tr>
        <th>Empenho</th><th style="text-align:right">Liquidado</th><th style="text-align:right">Pago</th><th>Data</th><th>Status</th></tr></thead><tbody>
        ${pcs.length ? pcs.map(p => {
          const emp = s.comprasEmpenho(p.empenhoId);
          return `<tr><td style="font-family:var(--font-mono)">${esc(emp ? emp.numero : p.empenhoId)}</td>
            <td style="text-align:right;font-family:var(--font-mono)">${brl(p.valorLiquidado)}</td>
            <td style="text-align:right;font-family:var(--font-mono)">${brl(p.valorPago)}</td>
            <td>${esc(p.dataLiquidacao)}</td><td>${statusPill(p.status, corStatus(p.status))}</td></tr>`;
        }).join('') : `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma liquidação registrada.</td></tr>`}
      </tbody></table></div></div>`;
  };

  // ─────────────────────────────────────────────────────────────
  // RELATÓRIOS (resumo do ciclo)
  // ─────────────────────────────────────────────────────────────
  P.compras_relatorios = (el) => {
    const s = S();
    el.innerHTML = header('Relatórios', 'Resumo do ciclo Ata → Contrato → Empenho → Pedido → Recebimento') + `
      <div class="card"><div style="padding:20px;line-height:1.9">
        <div>📋 Atas: <strong>${s.comprasAtas().length}</strong> · itens ${s.comprasAtaItens().length}</div>
        <div>📄 Contratos: <strong>${s.comprasContratos().length}</strong></div>
        <div>💳 Empenhos: <strong>${s.comprasEmpenhos().length}</strong></div>
        <div>📥 OS de Compra: <strong>${s.comprasOsCompra().length}</strong></div>
        <div>🛒 Pedidos: <strong>${s.comprasPedidos().length}</strong></div>
        <div>📦 Ordens de Recebimento: <strong>${s.comprasOrdensRecebimento().length}</strong></div>
        <div>🧾 Liquidações: <strong>${s.comprasPrestacao().length}</strong></div>
      </div></div>`;
  };

  // ═════════════════════════════════════════════════════════════
  // AÇÕES (window.*)
  // ═════════════════════════════════════════════════════════════
  window.comprasSimularOsCardapio = () => {
    const s = S();
    // Demanda calculada = previsto (cardápio) − estoque atual.
    // Usa produtos REAIS das atas (secos, se existirem), com fornecedor derivado da ata.
    const vig = s.comprasAtas().filter(a => a.status === 'vigente').map(a => a.id);
    const itensAta = s.comprasAtaItens().filter(ai => vig.includes(ai.ataId));
    const querer = ['Arroz', 'Feijão', 'Macarrão', 'Farinha', 'Óleo', 'Frango'];
    let escolhidos = [];
    querer.forEach(n => { const hit = itensAta.find(ai => ai.produto.includes(n) && !escolhidos.includes(ai)); if (hit) escolhidos.push(hit); });
    if (escolhidos.length < 3) escolhidos = itensAta.slice(0, 4);
    escolhidos = escolhidos.slice(0, 4);
    if (!escolhidos.length) return toast('⚠️ Sem atas vigentes para gerar demanda.', 'warning');
    const itens = escolhidos.map((ai, i) => {
      const prev = [4000, 3000, 5000, 2000][i] || 2000;
      const est = [1500, 500, 1500, 0][i] || 0;
      return { produto: ai.produto, unidade: ai.unidade, qtdPrevista: prev, qtdEstoque: est };
    });
    s.comprasEmitirOsCompra({ origem: 'nutricao', solicitante: 'Dra. Lilian Droppa', cardapioId: 'menu-jul-reg', periodo: 'Julho/2026', itens });
    toast('📥 OS de Compra emitida (previsto − estoque) com produtos reais das atas.', 'success');
    rerender();
  };

  window.comprasConverterOs = (osId) => {
    const r = S().comprasConverterOsEmPedidos(osId);
    if (r.erro) return toast('⚠️ ' + r.erro, 'warning');
    const n = (r.pedidos || []).length;
    let msg = `⚙️ Cascata executada: ${n} pedido(s) gerado(s) (reserva de saldo).`;
    if (r.semAta && r.semAta.length) msg += ` Sem ata: ${r.semAta.join(', ')}.`;
    toast(msg, 'success');
    navigateTo(null, 'pedidos');
  };

  window.comprasLancarOrdem = (pedidoId) => {
    const s = S();
    const pedido = s.comprasPedido(pedidoId);
    // NF do fornecedor entra no Compras (dono fiscal)
    const c = s._compras();
    const itens = s.comprasPedidoItens(pedidoId);
    const valor = itens.reduce((t, pi) => t + s.comprasSaldoAEntregarPedidoItem(pi.id) * pi.precoUnit, 0);
    const nf = { id: 'nf-' + Date.now(), numero: s._comprasSeq('nota', 'NF-####'), chaveNfe: '', fornecedorId: pedido.fornecedorId, pedidoId, valorTotal: valor, dataEmissao: new Date().toISOString().slice(0, 10), status: 'em_conferencia' };
    (c.notasFiscais = c.notasFiscais || []).push(nf);
    s._persist();
    const ordem = s.comprasLancarOrdemRecebimento(pedidoId, nf.id);
    if (ordem.erro) return toast('⚠️ ' + ordem.erro, 'warning');
    toast('📦 Ordem de Recebimento ' + ordem.numero + ' enviada ao Estoque.', 'success');
    navigateTo(null, 'recebimentos');
  };

  // Estoque Central executa a conferência (modal). A confirmação dá a baixa no empenho.
  window.comprasAbrirConferencia = (ordemId) => {
    const s = S();
    const itens = s.comprasOrdemRecebimentoItens(ordemId);
    const rows = itens.map(ri => `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #eee">
      <span><strong>${esc(ri.produto)}</strong> · NF/esperado ${kg(ri.qtdEsperada)} kg</span>
      <input type="number" id="rec-${ri.id}" value="${ri.qtdEsperada}" min="0" step="1" style="width:120px;padding:6px;border:1px solid #ccc;border-radius:6px;font-family:var(--font-mono)"></div>`).join('');
    const ov = document.createElement('div');
    ov.id = 'compras-modal-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999';
    ov.innerHTML = `<div style="background:var(--bg-primary,#fff);border-radius:12px;max-width:520px;width:92%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
      <h3 style="margin:0 0 4px">Conferência de entrada (física + NF)</h3>
      <p style="margin:0 0 14px;color:var(--text-secondary);font-size:.85rem">Informe a quantidade efetivamente recebida. Pode divergir da NF — a <strong>baixa do empenho usará o recebido</strong>. Ao confirmar, a entrada da NF é registrada e o volume é baixado no empenho.</p>
      ${rows}
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px">
        <button class="btn btn-outline btn-sm" onclick="document.getElementById('compras-modal-overlay').remove()">Cancelar</button>
        <button class="btn btn-primary btn-sm" onclick="window.comprasConfirmarConferencia('${ordemId}')">Confirmar entrada da NF</button>
      </div></div>`;
    document.body.appendChild(ov);
  };

  window.comprasConfirmarConferencia = (ordemId) => {
    const s = S();
    const itens = s.comprasOrdemRecebimentoItens(ordemId);
    const map = {};
    itens.forEach(ri => { const inp = document.getElementById('rec-' + ri.id); map[ri.id] = inp ? Number(inp.value) : ri.qtdEsperada; });
    const prof = (typeof PROFILES !== 'undefined' && typeof state !== 'undefined' && PROFILES[state.currentProfile]) ? PROFILES[state.currentProfile].name : 'Estoque Central';
    const r = s.comprasConfirmarEntradaEstoque(ordemId, map, prof);
    const ov = document.getElementById('compras-modal-overlay'); if (ov) ov.remove();
    if (r && r.erro) return toast('⚠️ ' + r.erro, 'warning');
    toast('✅ Entrada da NF confirmada. Baixa do volume no empenho aplicada.', 'success');
    rerender();
  };
  // compat: nomes antigos
  window.comprasAbrirRecebimento = (id) => window.comprasAbrirConferencia(id);

  // ═════════════════════════════════════════════════════════════
  // GESTÃO DA ATA (detalhe + anexar CONTRATO)  — espelha o Gestor no novo fluxo
  // ═════════════════════════════════════════════════════════════
  window.comprasAbrirAta = (ataId) => {
    const s = S();
    const ata = s.comprasAtas().find(a => a.id === ataId); if (!ata) return;
    const itens = s.comprasAtaItens(ataId);
    const contratos = s.comprasContratos(ataId);
    const global = itens.reduce((t, ai) => t + ai.qtdLicitada * ai.precoUnit, 0);
    const saldoR = itens.reduce((t, ai) => t + s.comprasSaldoAtaItem(ai.id) * ai.precoUnit, 0);
    const comprometido = global - saldoR;
    const pct = global > 0 ? Math.round(comprometido / global * 100) : 0;
    const content = `
      <div style="background:#f8fafc;padding:16px;border-radius:10px;border:1px solid var(--border);margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:12px">
          <div><h3 style="margin:0;font-size:1.1rem;color:var(--primary-dark,#1565C0)">📋 ${esc(ata.numero)}</h3>
          <div style="font-size:.85rem;color:var(--text-secondary);margin-top:2px">Modalidade: <strong>${esc(ata.modalidade)}</strong> · Vigência: <strong>${esc(ata.dataInicio)} a ${esc(ata.dataFim)}</strong> · ${statusPill(ata.status, corStatus(ata.status))}</div></div>
          <button class="btn btn-primary" onclick="window.comprasNovoContratoForm('${ataId}')">➕ Novo Contrato nesta ATA</button>
        </div>
        <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr);margin:0">
          <div class="kpi-card blue" style="padding:10px"><div class="kpi-label">Valor Global</div><div class="kpi-value" style="font-size:1.05rem">${brl(global)}</div></div>
          <div class="kpi-card orange" style="padding:10px"><div class="kpi-label">Comprometido (${pct}%)</div><div class="kpi-value" style="font-size:1.05rem">${brl(comprometido)}</div></div>
          <div class="kpi-card green" style="padding:10px"><div class="kpi-label">Saldo Disponível</div><div class="kpi-value" style="font-size:1.05rem">${brl(saldoR)}</div></div>
          <div class="kpi-card teal" style="padding:10px"><div class="kpi-label">Itens / Contratos</div><div class="kpi-value" style="font-size:1.05rem">${itens.length} / ${contratos.length}</div></div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <h4 style="margin:0">📦 Produtos & Saldos</h4>
        <button class="btn btn-sm btn-outline" onclick="window.comprasAddItemAtaForm('${ataId}')">➕ Adicionar Produto</button></div>
      <div style="overflow-x:auto;max-height:260px;margin-bottom:20px"><table class="data-table" style="font-size:.85rem"><thead><tr>
        <th>Produto</th><th>Fornecedor</th><th style="text-align:right">Preço</th><th style="text-align:right">Registrado</th><th style="text-align:right">Comprometido</th><th style="text-align:right">Saldo Qtd</th><th style="text-align:right">Saldo R$</th></tr></thead><tbody>
        ${itens.map(ai => { const f = s.comprasFornecedor(ai.fornecedorId); const sa = s.comprasSaldoAtaItem(ai.id); const comp = ai.qtdLicitada - sa;
          return `<tr><td><strong>${esc(ai.produto)}</strong></td><td>${esc(f ? f.razaoSocial : '')}</td>
            <td style="text-align:right;font-family:var(--font-mono)">${brl(ai.precoUnit)}</td>
            <td style="text-align:right;font-family:var(--font-mono);font-weight:700">${kg(ai.qtdLicitada)} ${ai.unidade}</td>
            <td style="text-align:right;font-family:var(--font-mono);color:#c2410c">${kg(comp)} ${ai.unidade}</td>
            <td style="text-align:right;font-family:var(--font-mono);font-weight:700;color:#1565C0">${kg(sa)} ${ai.unidade}</td>
            <td style="text-align:right;font-family:var(--font-mono);font-weight:700;color:${sa <= 0 ? CLR.bad : CLR.ok}">${brl(sa * ai.precoUnit)}</td></tr>`;
        }).join('')}
      </tbody></table></div>
      <h4 style="margin:0 0 10px">📄 Contratos vinculados nesta ATA (${contratos.length})</h4>
      <div style="overflow-x:auto"><table class="data-table" style="font-size:.85rem"><thead><tr>
        <th>Contrato</th><th>Fornecedor</th><th style="text-align:right">Valor</th><th style="text-align:right">Empenhos</th><th>Status</th><th></th></tr></thead><tbody>
        ${contratos.length ? contratos.map(ct => { const f = s.comprasFornecedor(ct.fornecedorId); const cis = s.comprasContratoItens(ct.id); const val = cis.reduce((t, ci) => t + ci.qtdContratada * ci.precoUnit, 0);
          return `<tr><td style="font-family:var(--font-mono)"><strong>${esc(ct.numero)}</strong> ${ct.geradoPor === 'cascata' ? statusPill('cascata', CLR.purple) : ''}</td>
            <td>${esc(f ? f.razaoSocial : '')}</td><td style="text-align:right;font-family:var(--font-mono)">${brl(val)}</td>
            <td style="text-align:right">${s.comprasEmpenhos(ct.id).length}</td><td>${statusPill(ct.status, corStatus(ct.status))}</td>
            <td style="text-align:right"><button class="btn btn-sm btn-outline" onclick="window.comprasAbrirContrato('${ct.id}')">🔍 Gerenciar</button></td></tr>`;
        }).join('') : `<tr><td colspan="6" style="text-align:center;color:#94A3B8;padding:16px">Nenhum contrato ainda. Use “Novo Contrato nesta ATA”.</td></tr>`}
      </tbody></table></div>`;
    window.showModal('📋 Detalhamento & Saldo da ATA — ' + ata.numero, content, '960px');
  };

  // Helpers de seleção nos formulários (marcar item habilita e sugere a qtd)
  window.comprasToggleItem = (iid, checked, sug) => {
    const q = document.getElementById('q-' + iid); if (!q) return;
    q.disabled = !checked;
    q.style.background = checked ? '#fff' : '#f1f5f9';
    if (checked) { if (!q.value || Number(q.value) === 0) q.value = sug; q.focus(); }
    else q.value = '';
  };
  window.comprasMarcarTodos = (scope, marcar) => {
    document.querySelectorAll('.cmp-chk-' + scope).forEach(chk => { chk.checked = marcar; window.comprasToggleItem(chk.dataset.iid, marcar, Number(chk.dataset.sug || 0)); });
  };
  function linhaSelecionavel(scope, iid, produto, saldo, unidade, sug) {
    return `<div style="display:flex;align-items:center;gap:12px;padding:10px 4px;border-bottom:1px solid #eef2f7">
      <input type="checkbox" class="cmp-chk-${scope}" data-iid="${iid}" data-sug="${sug}" id="chk-${iid}" onchange="window.comprasToggleItem('${iid}', this.checked, ${sug})" style="width:18px;height:18px;flex:0 0 auto;cursor:pointer">
      <label for="chk-${iid}" style="flex:1;min-width:0;cursor:pointer"><strong>${esc(produto)}</strong><div style="font-size:.75rem;color:var(--text-secondary)">saldo ${kg(saldo)} ${esc(unidade)}</div></label>
      <input type="number" id="q-${iid}" placeholder="0" min="0" max="${saldo}" step="1" disabled style="width:130px;padding:8px;border:1px solid #ccc;border-radius:6px;font-family:var(--font-mono);text-align:right;background:#f1f5f9">
      <span style="font-size:.8rem;color:var(--text-secondary);width:26px;text-align:left">${esc(unidade)}</span></div>`;
  }

  window.comprasNovoContratoForm = (ataId, fornecedorId) => {
    const s = S();
    const ata = s.comprasAtas().find(a => a.id === ataId); if (!ata) return;
    const itens = s.comprasAtaItens(ataId).filter(ai => s.comprasSaldoAtaItem(ai.id) > 0);
    const forns = [...new Set(itens.map(ai => ai.fornecedorId))];
    if (!forns.length) { toast('⚠️ Sem saldo na ATA para novo contrato.', 'warning'); return; }
    const fid = fornecedorId || forns[0];
    const itensF = itens.filter(ai => ai.fornecedorId === fid);
    const optsForn = forns.map(id => { const f = s.comprasFornecedor(id); return `<option value="${id}" ${id === fid ? 'selected' : ''}>${esc(f ? f.razaoSocial : id)}</option>`; }).join('');
    const rows = itensF.map(ai => { const sa = s.comprasSaldoAtaItem(ai.id); return linhaSelecionavel('ct', 'ct-' + ai.id, ai.produto, sa, ai.unidade, Math.ceil(sa / 2)); }).join('');
    const content = `
      <p style="margin:0 0 12px;color:var(--text-secondary);font-size:.88rem">Selecione <strong>1 ou mais produtos</strong> e informe a quantidade de cada (livre). Contrato por fornecedor, do <strong>saldo da ATA ${esc(ata.numero)}</strong>.</p>
      <div style="margin-bottom:12px"><label style="font-weight:600;font-size:.85rem;display:block;margin-bottom:4px">Fornecedor</label>
        <select id="ct-forn" onchange="window.comprasNovoContratoForm('${ataId}', this.value)" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px">${optsForn}</select></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <div style="font-size:.75rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.03em">Produto · Quantidade a contratar</div>
        <div style="display:flex;gap:6px"><button class="btn btn-sm btn-outline" onclick="window.comprasMarcarTodos('ct',true)">Todos (½ saldo)</button><button class="btn btn-sm btn-outline" onclick="window.comprasMarcarTodos('ct',false)">Limpar</button></div></div>
      <div style="max-height:320px;overflow-y:auto;border:1px solid var(--border,#e2e8f0);border-radius:8px;padding:4px 10px">${rows}</div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px">
        <button class="btn btn-outline btn-sm" onclick="window.comprasAbrirAta('${ataId}')">← Voltar</button>
        <button class="btn btn-primary btn-sm" onclick="window.comprasSalvarContrato('${ataId}','${fid}')">✔️ Criar contrato</button></div>`;
    window.showModal('➕ Novo Contrato — ATA ' + ata.numero, content, '640px');
  };

  window.comprasSalvarContrato = (ataId, fornecedorId) => {
    const s = S();
    const itensF = s.comprasAtaItens(ataId).filter(ai => ai.fornecedorId === fornecedorId && s.comprasSaldoAtaItem(ai.id) > 0);
    const itens = [];
    itensF.forEach(ai => { const chk = document.getElementById('chk-ct-' + ai.id); const q = document.getElementById('q-ct-' + ai.id); if (chk && chk.checked && q && Number(q.value) > 0) itens.push({ ataItemId: ai.id, qtd: Number(q.value) }); });
    if (!itens.length) return toast('⚠️ Marque ao menos 1 produto e informe a quantidade.', 'warning');
    const r = s.comprasCriarContrato(ataId, fornecedorId, itens);
    if (r.erro) return toast('⚠️ ' + r.erro, 'warning');
    toast(`📄 Contrato ${r.contrato.numero} criado com ${itens.length} produto(s).`, 'success');
    window.comprasAbrirAta(ataId); rerender();
  };

  window.comprasAddItemAtaForm = (ataId) => {
    const s = S();
    const ata = s.comprasAtas().find(a => a.id === ataId); if (!ata) return;
    const forns = s.comprasFornecedores();
    const opts = forns.map(f => `<option value="${f.id}">${esc(f.razaoSocial)}</option>`).join('');
    const content = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div style="grid-column:1/3"><label style="font-weight:600;font-size:.85rem">Produto</label><input id="ai-prod" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px"></div>
        <div><label style="font-weight:600;font-size:.85rem">Fornecedor</label><select id="ai-forn" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px">${opts}</select></div>
        <div><label style="font-weight:600;font-size:.85rem">Unidade</label><input id="ai-un" value="kg" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px"></div>
        <div><label style="font-weight:600;font-size:.85rem">Qtd licitada</label><input id="ai-qtd" type="number" min="0" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px"></div>
        <div><label style="font-weight:600;font-size:.85rem">Preço unitário</label><input id="ai-preco" type="number" min="0" step="0.01" style="width:100%;padding:8px;border:1px solid #ccc;border-radius:6px"></div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px">
        <button class="btn btn-outline btn-sm" onclick="window.comprasAbrirAta('${ataId}')">← Voltar</button>
        <button class="btn btn-primary btn-sm" onclick="window.comprasSalvarItemAta('${ataId}')">✔️ Adicionar</button></div>`;
    window.showModal('➕ Adicionar Produto — ATA ' + ata.numero, content, '560px');
  };
  window.comprasSalvarItemAta = (ataId) => {
    const g = (id) => document.getElementById(id);
    const r = S().comprasAdicionarItemAta(ataId, { produto: g('ai-prod').value, fornecedorId: g('ai-forn').value, unidade: g('ai-un').value, qtdLicitada: Number(g('ai-qtd').value), precoUnit: Number(g('ai-preco').value) });
    if (r.erro) return toast('⚠️ ' + r.erro, 'warning');
    toast('📦 Produto adicionado à ATA.', 'success');
    window.comprasAbrirAta(ataId); rerender();
  };

  // ═════════════════════════════════════════════════════════════
  // GESTÃO DO CONTRATO (detalhe + anexar EMPENHO)
  // ═════════════════════════════════════════════════════════════
  window.comprasAbrirContrato = (contratoId) => {
    const s = S();
    const ct = s.comprasContrato(contratoId); if (!ct) return;
    const f = s.comprasFornecedor(ct.fornecedorId);
    const ata = s.comprasAtas().find(a => a.id === ct.ataId);
    const cis = s.comprasContratoItens(contratoId);
    const empenhos = s.comprasEmpenhos(contratoId);
    const val = cis.reduce((t, ci) => t + ci.qtdContratada * ci.precoUnit, 0);
    const saldoR = cis.reduce((t, ci) => t + s.comprasSaldoContratoItem(ci.id) * ci.precoUnit, 0);
    const empR = val - saldoR;
    const content = `
      <div style="background:#f8fafc;padding:16px;border-radius:10px;border:1px solid var(--border);margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:12px">
          <div><h3 style="margin:0;font-size:1.1rem;color:var(--primary-dark,#1565C0)">📄 ${esc(ct.numero)} — ${esc(f ? f.razaoSocial : '')}</h3>
          <div style="font-size:.85rem;color:var(--text-secondary);margin-top:2px">ATA ${esc(ata ? ata.numero : '')} · Vigência: <strong>${esc(ct.dataInicio)} a ${esc(ct.dataFim)}</strong> · ${statusPill(ct.status, corStatus(ct.status))}</div></div>
          <button class="btn btn-primary" onclick="window.comprasNovoEmpenhoForm('${contratoId}')">➕ Novo Empenho neste Contrato</button>
        </div>
        <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin:0">
          <div class="kpi-card blue" style="padding:10px"><div class="kpi-label">Valor Contratado</div><div class="kpi-value" style="font-size:1.05rem">${brl(val)}</div></div>
          <div class="kpi-card orange" style="padding:10px"><div class="kpi-label">Empenhado</div><div class="kpi-value" style="font-size:1.05rem">${brl(empR)}</div></div>
          <div class="kpi-card green" style="padding:10px"><div class="kpi-label">Saldo p/ empenhar</div><div class="kpi-value" style="font-size:1.05rem">${brl(saldoR)}</div></div>
        </div>
      </div>
      <h4 style="margin:0 0 10px">📦 Itens do contrato</h4>
      <div style="overflow-x:auto;max-height:220px;margin-bottom:20px"><table class="data-table" style="font-size:.85rem"><thead><tr>
        <th>Produto</th><th style="text-align:right">Contratado</th><th style="text-align:right">Empenhado</th><th style="text-align:right">Saldo</th></tr></thead><tbody>
        ${cis.map(ci => { const ai = s.comprasAtaItem(ci.ataItemId); const sc = s.comprasSaldoContratoItem(ci.id); const emp = ci.qtdContratada - sc;
          return `<tr><td><strong>${esc(ai ? ai.produto : '')}</strong></td>
            <td style="text-align:right;font-family:var(--font-mono);font-weight:700">${kg(ci.qtdContratada)}</td>
            <td style="text-align:right;font-family:var(--font-mono);color:#c2410c">${kg(emp)}</td>
            <td style="text-align:right;font-family:var(--font-mono);font-weight:700;color:${sc <= 0 ? CLR.bad : CLR.ok}">${kg(sc)}</td></tr>`; }).join('')}
      </tbody></table></div>
      <h4 style="margin:0 0 10px">💳 Empenhos vinculados (${empenhos.length})</h4>
      <div style="overflow-x:auto"><table class="data-table" style="font-size:.85rem"><thead><tr>
        <th>Nº Empenho</th><th>Data</th><th style="text-align:right">Empenhado</th><th style="text-align:right">Saldo livre</th><th>Status</th></tr></thead><tbody>
        ${empenhos.length ? empenhos.map(e => { const eis = s.comprasEmpenhoItens(e.id); const empV = eis.reduce((t, ei) => t + ei.qtdEmpenhada * ei.precoUnit, 0); const livre = eis.reduce((t, ei) => t + s.comprasSaldoLivreEmpenhoItem(ei.id) * ei.precoUnit, 0);
          return `<tr><td style="font-family:var(--font-mono)"><strong>${esc(e.numero)}</strong> ${e.origemPedidoId ? statusPill('cascata', CLR.purple) : ''}</td><td>${esc(e.dataEmpenho)}</td>
            <td style="text-align:right;font-family:var(--font-mono)">${brl(empV)}</td>
            <td style="text-align:right;font-family:var(--font-mono);color:${livre > 0 ? CLR.ok : CLR.gray}">${brl(livre)}</td>
            <td>${statusPill(e.status, corStatus(e.status))}</td></tr>`; }).join('') : `<tr><td colspan="5" style="text-align:center;color:#94A3B8;padding:16px">Nenhum empenho. Use “Novo Empenho neste Contrato”.</td></tr>`}
      </tbody></table></div>`;
    window.showModal('📄 Detalhamento & Saldo do Contrato — ' + ct.numero, content, '900px');
  };

  window.comprasNovoEmpenhoForm = (contratoId) => {
    const s = S();
    const ct = s.comprasContrato(contratoId); if (!ct) return;
    const cis = s.comprasContratoItens(contratoId).filter(ci => s.comprasSaldoContratoItem(ci.id) > 0);
    if (!cis.length) { toast('⚠️ Sem saldo no contrato para novo empenho.', 'warning'); return; }
    const rows = cis.map(ci => { const ai = s.comprasAtaItem(ci.ataItemId); const sc = s.comprasSaldoContratoItem(ci.id); return linhaSelecionavel('emp', 'emp-' + ci.id, ai ? ai.produto : 'item', sc, ai ? ai.unidade : '', sc); }).join('');
    const content = `
      <p style="margin:0 0 12px;color:var(--text-secondary);font-size:.88rem">Selecione <strong>1 ou mais produtos</strong> e informe a quantidade de cada (total ou fracionado), a partir do <strong>saldo do contrato ${esc(ct.numero)}</strong>, conforme a demanda.</p>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <div style="font-size:.75rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.03em">Produto · Quantidade a empenhar</div>
        <div style="display:flex;gap:6px"><button class="btn btn-sm btn-outline" onclick="window.comprasMarcarTodos('emp',true)">Todos (saldo)</button><button class="btn btn-sm btn-outline" onclick="window.comprasMarcarTodos('emp',false)">Limpar</button></div></div>
      <div style="max-height:320px;overflow-y:auto;border:1px solid var(--border,#e2e8f0);border-radius:8px;padding:4px 10px">${rows}</div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px">
        <button class="btn btn-outline btn-sm" onclick="window.comprasAbrirContrato('${contratoId}')">← Voltar</button>
        <button class="btn btn-primary btn-sm" onclick="window.comprasSalvarEmpenho('${contratoId}')">✔️ Emitir empenho</button></div>`;
    window.showModal('➕ Novo Empenho — Contrato ' + ct.numero, content, '620px');
  };

  window.comprasSalvarEmpenho = (contratoId) => {
    const s = S();
    const cis = s.comprasContratoItens(contratoId).filter(ci => s.comprasSaldoContratoItem(ci.id) > 0);
    const itens = [];
    cis.forEach(ci => { const chk = document.getElementById('chk-emp-' + ci.id); const q = document.getElementById('q-emp-' + ci.id); if (chk && chk.checked && q && Number(q.value) > 0) itens.push({ contratoItemId: ci.id, qtd: Number(q.value) }); });
    if (!itens.length) return toast('⚠️ Marque ao menos 1 produto e informe a quantidade.', 'warning');
    const r = s.comprasCriarEmpenho(contratoId, itens);
    if (r.erro) return toast('⚠️ ' + r.erro, 'warning');
    toast(`💳 Empenho ${r.empenho.numero} emitido com ${itens.length} produto(s).`, 'success');
    window.comprasAbrirContrato(contratoId); rerender();
  };

  window.comprasRegistrarPagamento = (pcId) => {
    const s = S();
    const pc = (s._compras().prestacaoContas || []).find(p => p.id === pcId);
    if (!pc) return toast('⚠️ liquidação não encontrada', 'warning');
    pc.valorPago = pc.valorLiquidado; pc.dataPagamento = new Date().toISOString().slice(0, 10); pc.status = 'pago';
    s._persist();
    toast('💰 Pagamento registrado.', 'success');
    rerender();
  };

  window.comprasResetDemo = () => {
    const s = S();
    const d = s._defaults().compras;
    s._data.compras = JSON.parse(JSON.stringify(d));
    s.comprasImportarAtasDoGestor(true); // recarrega as atas unificadas do Gestor
    s._persist();
    toast('↻ Compras restaurado: atas reimportadas do Gestor, transacional zerado.', 'info');
    rerender();
  };
})();
