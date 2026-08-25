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
        return `<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div><h3 class="card-title">${esc(ata.numero)} · ${statusPill(ata.status, corStatus(ata.status))}</h3>
          <small style="color:var(--text-secondary)">${esc(ata.objeto)} · ${esc(ata.modalidade)} · vigência ${esc(ata.dataInicio)} a ${esc(ata.dataFim)}</small></div>
          <div style="text-align:right"><div style="font-weight:700">${brl(total)}</div><small style="color:var(--text-secondary)">valor licitado</small></div></div>
          <div style="overflow-x:auto"><table class="data-table"><thead><tr>
            <th>Produto</th><th>Fornecedor</th><th style="text-align:right">Preço un.</th><th style="text-align:right">Licitado</th><th style="text-align:right">Contratado</th><th style="text-align:right">Saldo ata</th></tr></thead><tbody>
            ${itens.map(ai => {
              const f = s.comprasFornecedor(ai.fornecedorId);
              const sa = s.comprasSaldoAtaItem(ai.id);
              const contratado = ai.qtdLicitada - sa;
              return `<tr>
                <td><strong>${esc(ai.produto)}</strong></td>
                <td>${esc(f ? f.razaoSocial : '—')}</td>
                <td style="text-align:right;font-family:var(--font-mono)">${brl(ai.precoUnit)}</td>
                <td style="text-align:right;font-family:var(--font-mono)">${kg(ai.qtdLicitada)} ${ai.unidade}</td>
                <td style="text-align:right;font-family:var(--font-mono)">${kg(contratado)} ${ai.unidade}</td>
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
        return `<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div><h3 class="card-title">${esc(ct.numero)} · ${esc(f ? f.razaoSocial : '')} ${ct.geradoPor === 'cascata' ? statusPill('gerado p/ cascata', CLR.purple) : ''}</h3>
          <small style="color:var(--text-secondary)">Ata ${esc(ata ? ata.numero : '')} · ${statusPill(ct.status, corStatus(ct.status))}</small></div>
          <div style="text-align:right"><div style="font-weight:700">${brl(total)}</div><small style="color:var(--text-secondary)">valor contratado</small></div></div>
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
          ${aberto > 0 ? `<button class="btn btn-primary btn-sm" onclick="window.comprasLancarOrdem('${p.id}')">📦 Lançar Ordem de Recebimento</button>` : statusPill('entregue', CLR.ok)}</div>
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
    el.innerHTML = header('Ordens de Recebimento', 'Lançadas no Compras → o Estoque confere (física + NF) e devolve a qtd recebida') +
      (ordens.length ? ordens.map(o => {
        const f = s.comprasFornecedor(o.fornecedorId);
        const ped = s.comprasPedido(o.pedidoId);
        const itens = s.comprasOrdemRecebimentoItens(o.id);
        return `<div class="card" style="margin-bottom:16px"><div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <div><h3 class="card-title">${esc(o.numero)} · ${esc(f ? f.razaoSocial : '')} · ${statusPill(o.status + (o.resultado ? ' (' + o.resultado + ')' : ''), corStatus(o.resultado === 'divergente' ? 'divergente' : o.status))}</h3>
          <small style="color:var(--text-secondary)">Pedido ${esc(ped ? ped.numero : '')} · destino ${esc(o.destino)}</small></div>
          <div style="display:flex;gap:8px">
            ${o.status === 'aguardando' ? `<button class="btn btn-outline btn-sm" onclick="window.comprasAbrirRecebimento('${o.id}')">📥 Simular conferência (Estoque)</button>` : ''}
            ${o.status === 'conferida' ? `<button class="btn btn-primary btn-sm" onclick="window.comprasLiquidar('${o.id}')">✅ Liquidar empenho</button>` : ''}
          </div></div>
          <div style="overflow-x:auto"><table class="data-table"><thead><tr>
            <th>Produto</th><th style="text-align:right">Esperado</th><th style="text-align:right">Recebido</th><th style="text-align:right">Divergência</th></tr></thead><tbody>
            ${itens.map(ri => `<tr>
              <td><strong>${esc(ri.produto)}</strong></td>
              <td style="text-align:right;font-family:var(--font-mono)">${kg(ri.qtdEsperada)}</td>
              <td style="text-align:right;font-family:var(--font-mono)">${o.status === 'aguardando' ? '—' : kg(ri.qtdRecebida)}</td>
              <td style="text-align:right;font-family:var(--font-mono);color:${ri.divergencia < 0 ? CLR.bad : (ri.divergencia > 0 ? CLR.warn : CLR.ok)}">${o.status === 'aguardando' ? '—' : (ri.divergencia > 0 ? '+' : '') + kg(ri.divergencia)}</td></tr>`).join('')}
          </tbody></table></div></div>`;
      }).join('') : `<div class="card"><div style="padding:32px;text-align:center;color:var(--text-secondary)">Nenhuma ordem lançada. Lance a partir de um pedido em “Pedidos / Aquisições”.</div></div>`);
  };

  // ─────────────────────────────────────────────────────────────
  // LIQUIDAÇÃO
  // ─────────────────────────────────────────────────────────────
  P.compras_liquidacao = (el) => {
    const s = S();
    const ordens = s.comprasOrdensRecebimento().filter(o => o.status === 'conferida' || o.status === 'liquidada');
    el.innerHTML = header('Liquidação', 'Baixa do empenho pelo RECEBIDO (não pelo pedido). Divergência gera pendência.') +
      `<div class="card"><div style="overflow-x:auto"><table class="data-table"><thead><tr>
        <th>Ordem</th><th>Pedido</th><th>Resultado</th><th>Status</th><th></th></tr></thead><tbody>
        ${ordens.length ? ordens.map(o => {
          const ped = s.comprasPedido(o.pedidoId);
          return `<tr><td style="font-family:var(--font-mono)">${esc(o.numero)}</td><td>${esc(ped ? ped.numero : '')}</td>
            <td>${statusPill(o.resultado || '—', o.resultado === 'divergente' ? CLR.bad : CLR.ok)}</td>
            <td>${statusPill(o.status, corStatus(o.status))}</td>
            <td style="text-align:right">${o.status === 'conferida' ? `<button class="btn btn-primary btn-sm" onclick="window.comprasLiquidar('${o.id}')">✅ Liquidar</button>` : statusPill('liquidada', CLR.ok)}</td></tr>`;
        }).join('') : `<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma ordem conferida aguardando liquidação.</td></tr>`}
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
    // Demanda calculada = previsto (cardápio) − estoque atual
    S().comprasEmitirOsCompra({
      origem: 'nutricao', solicitante: 'Dra. Lilian Droppa', cardapioId: 'menu-jul-reg', periodo: 'Julho/2026',
      itens: [
        { produto: 'Arroz Tipo 1',       unidade: 'kg', qtdPrevista: 400, qtdEstoque: 150 },
        { produto: 'Feijão Carioca',     unidade: 'kg', qtdPrevista: 300, qtdEstoque: 50 },
        { produto: 'Macarrão Espaguete', unidade: 'kg', qtdPrevista: 500, qtdEstoque: 150 },
        { produto: 'Farinha de Trigo',   unidade: 'kg', qtdPrevista: 200, qtdEstoque: 0 },
      ],
    });
    toast('📥 OS de Compra emitida (previsto − estoque).', 'success');
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

  // Simula o Estoque executando a conferência (modal simples)
  window.comprasAbrirRecebimento = (ordemId) => {
    const s = S();
    const ordem = s.comprasOrdensRecebimento().find(o => o.id === ordemId);
    const itens = s.comprasOrdemRecebimentoItens(ordemId);
    const rows = itens.map(ri => `<div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #eee">
      <span><strong>${esc(ri.produto)}</strong> · esperado ${kg(ri.qtdEsperada)} kg</span>
      <input type="number" id="rec-${ri.id}" value="${ri.qtdEsperada}" min="0" step="1" style="width:120px;padding:6px;border:1px solid #ccc;border-radius:6px;font-family:var(--font-mono)"></div>`).join('');
    const ov = document.createElement('div');
    ov.id = 'compras-modal-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:9999';
    ov.innerHTML = `<div style="background:var(--bg-primary,#fff);border-radius:12px;max-width:520px;width:92%;padding:22px;box-shadow:0 20px 60px rgba(0,0,0,.3)">
      <h3 style="margin:0 0 4px">Conferência física + NF (Estoque)</h3>
      <p style="margin:0 0 14px;color:var(--text-secondary);font-size:.85rem">Informe a quantidade efetivamente recebida. Pode divergir do pedido — a baixa do empenho usará o recebido.</p>
      ${rows}
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px">
        <button class="btn btn-outline btn-sm" onclick="document.getElementById('compras-modal-overlay').remove()">Cancelar</button>
        <button class="btn btn-primary btn-sm" onclick="window.comprasConfirmarRecebimento('${ordemId}')">Confirmar recebimento</button>
      </div></div>`;
    document.body.appendChild(ov);
  };

  window.comprasConfirmarRecebimento = (ordemId) => {
    const s = S();
    const itens = s.comprasOrdemRecebimentoItens(ordemId);
    const map = {};
    itens.forEach(ri => { const inp = document.getElementById('rec-' + ri.id); map[ri.id] = inp ? Number(inp.value) : ri.qtdEsperada; });
    s.comprasRegistrarRecebimento(ordemId, map);
    const ov = document.getElementById('compras-modal-overlay'); if (ov) ov.remove();
    toast('📥 Conferência registrada. Pronto para liquidar no Compras.', 'success');
    rerender();
  };

  window.comprasLiquidar = (ordemId) => {
    const r = S().comprasLiquidar(ordemId);
    if (r.erro) return toast('⚠️ ' + r.erro, 'warning');
    toast('✅ Empenho liquidado pelo recebido (' + r.empenhos + ' empenho[s]).', 'success');
    rerender();
  };

  window.comprasResetDemo = () => {
    const s = S();
    const d = s._defaults().compras;
    s._data.compras = JSON.parse(JSON.stringify(d));
    s._persist();
    toast('↻ Dados de Compras restaurados ao seed.', 'info');
    rerender();
  };
})();
