/* ============================================
   SUALE — Módulo Motorista (js/modules/motorista.js)
   Perfis: Motorista / Logística / Carregamento
   SEMED · Campo Grande · MS
   ============================================ */

(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  // RENDERERS DO MOTORISTA (Assinatura Fixa: (el) => { el.innerHTML = ...; })
  PAGE_RENDERERS['motorista_dashboard'] = renderMotoristaDashboard;
  PAGE_RENDERERS['motorista_entregas'] = renderMotoristaEntregas;
  PAGE_RENDERERS['motorista_ocorrencias'] = renderMotoristaOcorrencias;
  PAGE_RENDERERS['motorista_historico'] = renderMotoristaHistorico;

  function renderMotoristaDashboard(el) {
    el.innerHTML = `
      <div class="page-header"><div class="page-title">Minha Rota Diária</div><div class="page-subtitle">Veículo: ABC-1234 · Rota: Anhanduizinho · Data: 10/07/2026</div></div>
      
      <div class="grid-3 mb-24">
        <div class="card stat-card"><div class="card-body">
          <div class="stat-icon" style="color:var(--primary);background:var(--primary-light)">🏫</div>
          <div class="stat-info"><div class="stat-num">3</div><div class="stat-name">Escolas na Rota</div></div>
        </div></div>
        <div class="card stat-card"><div class="card-body">
          <div class="stat-icon" style="color:var(--success);background:var(--success-light)">✓</div>
          <div class="stat-info"><div class="stat-num" id="driver-delivered-count">1</div><div class="stat-name">Entregas Realizadas</div></div>
        </div></div>
        <div class="card stat-card"><div class="card-body">
          <div class="stat-icon" style="color:var(--warning);background:var(--warning-light)">⏳</div>
          <div class="stat-info"><div class="stat-num" id="driver-pending-count">2</div><div class="stat-name">Entregas Pendentes</div></div>
        </div></div>
      </div>

      <div class="grid-2 mb-24">
        <div class="card"><div class="card-header"><div class="card-title">Sequência de Paradas da Rota</div></div><div class="card-body">
          <div style="display:flex;flex-direction:column;gap:16px;position:relative">
            <div style="position:absolute;left:20px;top:20px;bottom:20px;width:2px;background:var(--border);z-index:0"></div>
            
            <div style="display:flex;gap:16px;align-items:center;position:relative;z-index:1">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--success);color:white;display:flex;align-items:center;justify-content:center;font-weight:700">1</div>
              <div style="flex:1">
                <div style="font-weight:700">EM ADV. DEMOSTHENES MARTINS</div>
                <div style="font-size:0.8rem;color:var(--text-secondary)">Rua Pedro Celestino, 1234 — Centro</div>
              </div>
              <div><span class="status-badge status-ok">Entregue (08:32)</span></div>
            </div>
            
            <div style="display:flex;gap:16px;align-items:center;position:relative;z-index:1">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--warning);color:white;display:flex;align-items:center;justify-content:center;font-weight:700">2</div>
              <div style="flex:1">
                <div style="font-weight:700">EM PROF. ANTÔNIO LOPES LINS</div>
                <div style="font-size:0.8rem;color:var(--text-secondary)">Rua Barão do Rio Branco, 456 — Centro</div>
              </div>
              <div><button class="btn btn-sm btn-primary" onclick="navigateTo(null, 'entregas')">Realizar Entrega</button></div>
            </div>

            <div style="display:flex;gap:16px;align-items:center;position:relative;z-index:1">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--text-tertiary);color:white;display:flex;align-items:center;justify-content:center;font-weight:700">3</div>
              <div style="flex:1">
                <div style="font-weight:700">EMTI PROFª IRACEMA MARIA VICENTE</div>
                <div style="font-size:0.8rem;color:var(--text-secondary)">Av. Eduardo Elias Zahran, 200 — Itanhangá</div>
              </div>
              <div><span class="status-badge status-danger">Aguardando</span></div>
            </div>
          </div>
        </div></div>
        
        <div class="card"><div class="card-header"><div class="card-title">Mapa de Navegação</div></div><div class="card-body" style="display:flex;align-items:center;justify-content:center;background:#E2E8F0;min-height:250px;border-radius:var(--radius)">
          <div style="text-align:center;color:var(--text-secondary)">
            <div style="font-size:2rem">🗺️</div>
            <div style="font-weight:600;margin-top:8px">Visualização de Rota GPS</div>
            <div style="font-size:0.8rem;color:var(--text-tertiary)">Mostrando sequência de paradas em tempo real</div>
          </div>
        </div></div>
      </div>
    `;
  }

  function renderMotoristaEntregas(el) {
    const prof = window.PROFILES ? window.PROFILES[window.state?.currentProfile] : null;
    const emTransporteList = SharedState.getOrders().filter(o => o.status === 'Em transporte' && (!prof || o.driver === prof.name));
    const alvo = window._selectedDeliveryOrderId
      ? emTransporteList.find(o => o.id === window._selectedDeliveryOrderId)
      : emTransporteList[0];
    const alvoNome = alvo ? alvo.school : 'EM PROF. ANTÔNIO LOPES LINS';
    window._currentDeliveryOrderId = alvo ? alvo.id : null;

    el.innerHTML = `
      <div class="page-header"><div class="page-title">Realizar Entrega</div><div class="page-subtitle">Confirmação de recebimento física na unidade escolar${alvo ? ' · Pedido #' + String(alvo.numero).padStart(3,'0') : ''}</div></div>

      ${emTransporteList.length > 0 ? `
      <div class="card mb-16">
        <div class="card-header"><div class="card-title">🚚 Fila de Entregas (Em transporte)</div><span class="status-badge status-warning">${emTransporteList.length}</span></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>#</th><th>Escola</th><th>Itens</th><th>Ação</th></tr></thead>
            <tbody>
              ${emTransporteList.map(o => `
                <tr ${o.id === (alvo?.id) ? 'style="background:var(--primary-light)"' : ''}>
                  <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(o.numero).padStart(3,'0')}</td>
                  <td><strong>${o.school}</strong></td>
                  <td style="font-size:0.82rem">${(o.itens||[]).map(i => i.produto + ' (' + i.qtd + i.unidade + ')').join(', ') || '—'}</td>
                  <td><button class="btn btn-sm ${o.id === (alvo?.id) ? 'btn-primary' : 'btn-outline'}" onclick="selectDelivery('${o.id}')">${o.id === (alvo?.id) ? 'Selecionada' : 'Selecionar'}</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>` : ''}

      <div id="entrega-form-container" class="card mb-24" style="max-width: 600px; margin: 0 auto;">
        <div class="card-header"><div class="card-title">Confirmar Recibo de Alimentos: ${alvoNome}</div></div>
        <div class="card-body">
          <form id="form-driver-delivery">
            <div class="form-group">
              <label>Responsável pelo Recebimento (Nome Completo)</label>
              <input type="text" id="delivery-receiver" class="btn btn-outline" style="width:100%;text-align:left;cursor:text;padding:10px" placeholder="Ex: Ana Costa (Diretora)" required>
            </div>
            <div class="form-group">
              <label>Matrícula / Documento</label>
              <input type="text" id="delivery-doc" class="btn btn-outline" style="width:100%;text-align:left;cursor:text;padding:10px" placeholder="Ex: 98765-X" required>
            </div>
            
            <div class="form-group">
              <label>Foto do Comprovante / Alimentos Entregues</label>
              <div class="camera-preview" id="delivery-camera-preview" onclick="simulateCamera()">
                <div class="camera-placeholder" id="delivery-camera-placeholder">
                  <span style="font-size:2rem">📷</span>
                  <span>Toque para simular captura da foto</span>
                </div>
                <img id="delivery-camera-img" src="" style="display:none" alt="Comprovante">
              </div>
            </div>
            
            <div class="form-group">
              <label>Assinatura Digital do Responsável</label>
              <div class="signature-pad" id="delivery-sig-pad">
                <canvas id="delivery-sig-canvas"></canvas>
                <div class="signature-placeholder" id="delivery-sig-placeholder">Desenhe a assinatura com o mouse/dedo aqui</div>
              </div>
              <button type="button" class="btn btn-ghost btn-sm" style="margin-top:4px" onclick="clearSignature()">Limpar Assinatura</button>
            </div>
            
            <div style="display:flex;gap:12px;margin-top:24px;justify-content:flex-end">
              <button type="button" class="btn btn-outline" onclick="navigateTo(null, 'dashboard')">Voltar</button>
              <button type="submit" class="btn btn-primary">Confirmar e Assinar Recibo</button>
            </div>
          </form>
        </div>
      </div>
    `;
    setTimeout(() => {
      window.initSignatureCanvas && window.initSignatureCanvas();
      document.getElementById('form-driver-delivery')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const rec = document.getElementById('delivery-receiver').value;
        const doc = document.getElementById('delivery-doc').value;
        if (!rec) {
          alert('Por favor, informe o nome do responsável.');
          return;
        }
        if (window._currentDeliveryOrderId) {
          SharedState.confirmDelivery(window._currentDeliveryOrderId, rec, doc);
          window._currentDeliveryOrderId = null;
          window._selectedDeliveryOrderId = null;
          showToast('✅ Entrega confirmada. Escola, Cooperativa e SEMED foram notificados. Estoque local incrementado.');
        } else {
          alert('Entrega confirmada com sucesso! Recibo digital assinado e foto enviada para a SEMED.');
        }
        if (typeof navigateTo === 'function') navigateTo(null, 'dashboard');
      });
    }, 50);
  }

  function renderMotoristaOcorrencias(el) {
    el.innerHTML = `
      <div class="page-header"><div class="page-title">Registrar Ocorrência</div><div class="page-subtitle">Comunicação de incidentes em tempo real para a SEMED</div></div>
      <div class="card mb-24" style="max-width: 600px; margin: 0 auto;">
        <div class="card-header"><div class="card-title">Novo Registro de Ocorrência</div></div>
        <div class="card-body">
          <form id="form-driver-incident">
            <div class="form-group">
              <label>Escola Relacionada</label>
              <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="incident-school" required>
                <option value="">Selecione a escola...</option>
                ${((window.DATA && window.DATA.schools) || []).map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
                <option value="EM Elpídio Reis">EM Elpídio Reis</option>
                <option value="Outra">Outro incidente (Trânsito / Veículo)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tipo de Ocorrência</label>
              <select class="btn btn-outline" style="width:100%;text-align:left;padding:10px" id="incident-type" required>
                <option value="">Selecione o tipo...</option>
                <option value="Atraso no trânsito">Atraso no trânsito (Engarrafamento/Acidente)</option>
                <option value="Escola fechada">Escola fechada ou sem recebedor</option>
                <option value="Item danificado">Alimento ou embalagem danificada</option>
                <option value="Problema mecânico">Problema mecânico no veículo</option>
                <option value="Outro">Outro problema (especificar)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Descrição do Ocorrido</label>
              <textarea class="btn btn-outline" style="width:100%;text-align:left;cursor:text;min-height:100px;padding:10px" id="incident-desc" placeholder="Descreva os detalhes do problema ocorrido..." required></textarea>
            </div>
            <div style="display:flex;gap:12px;margin-top:24px;justify-content:flex-end">
              <button type="button" class="btn btn-outline" onclick="navigateTo(null, 'dashboard')">Voltar</button>
              <button type="submit" class="btn btn-danger">Enviar Relatório de Ocorrência</button>
            </div>
          </form>
        </div>
      </div>
    `;
    setTimeout(() => {
      document.getElementById('form-driver-incident')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const school = document.getElementById('incident-school').value;
        const type = document.getElementById('incident-type').value;
        const desc = document.getElementById('incident-desc').value;
        const profKey = window.state?.currentProfile;
        const driverName = (window.PROFILES && profKey && window.PROFILES[profKey]) ? window.PROFILES[profKey].name : 'Motorista';
        SharedState.addIncident({
          school,
          tipo: type,
          descricao: desc,
          motorista: driverName,
        });
        showToast('⚠️ Ocorrência registrada — SEMED/Gestor foram notificados em tempo real.');
        if (typeof navigateTo === 'function') navigateTo(null, 'dashboard');
      });
    }, 50);
  }

  function renderMotoristaHistorico(el) {
    const confirmadas = SharedState.getDeliveries().filter(d => d.status === 'Confirmada');
    const incidents = SharedState.getIncidents();

    el.innerHTML = `
      <div class="page-header"><div class="page-title">Histórico de Viagens & Entregas</div><div class="page-subtitle">Entregas confirmadas por este motorista e ocorrências registradas</div></div>

      <div class="kpi-grid" style="grid-template-columns:repeat(3,1fr);margin-bottom:20px">
        <div class="kpi-card green"><div class="kpi-icon">✅</div><div class="kpi-value">${confirmadas.length}</div><div class="kpi-label">Entregas Confirmadas</div></div>
        <div class="kpi-card blue"><div class="kpi-icon">🏫</div><div class="kpi-value">${new Set(confirmadas.map(d => d.school)).size}</div><div class="kpi-label">Escolas Atendidas</div></div>
        <div class="kpi-card orange"><div class="kpi-icon">⚠️</div><div class="kpi-value">${incidents.length}</div><div class="kpi-label">Ocorrências Registradas</div></div>
      </div>

      <div class="card mb-24">
        <div class="card-header"><div class="card-title">🚚 Entregas Realizadas</div>${confirmadas.length ? '<span class="status-badge status-ok">'+confirmadas.length+'</span>' : ''}</div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Data</th><th>Pedido</th><th>Escola</th><th>Cooperativa</th><th>Recebido por</th><th>Doc.</th></tr></thead>
            <tbody>
              ${confirmadas.map(d => `
                <tr>
                  <td style="font-family:var(--font-mono);font-size:0.82rem">${d.confirmadoEm ? new Date(d.confirmadoEm).toLocaleString('pt-BR') : '—'}</td>
                  <td style="font-family:var(--font-mono);color:var(--primary);font-weight:700">#${String(d.orderNumero).padStart(3,'0')}</td>
                  <td><strong>${d.school}</strong></td>
                  <td><span class="tag tag-teal">${d.cooperative||'—'}</span></td>
                  <td>${d.receiver || '—'}</td>
                  <td style="font-size:0.82rem">${d.doc || '—'}</td>
                </tr>
              `).join('') || '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--text-secondary)">Nenhuma entrega confirmada ainda</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      ${incidents.length > 0 ? `
      <div class="card">
        <div class="card-header"><div class="card-title">⚠️ Ocorrências Recentes</div></div>
        <div class="card-body" style="padding:0">
          <table class="data-table">
            <thead><tr><th>Data</th><th>Escola</th><th>Tipo</th><th>Descrição</th><th>Status</th></tr></thead>
            <tbody>
              ${incidents.slice(0, 10).map(i => `
                <tr>
                  <td style="font-size:0.82rem">${new Date(i.criadoEm).toLocaleString('pt-BR')}</td>
                  <td>${i.school || '—'}</td>
                  <td><strong>${i.tipo || '—'}</strong></td>
                  <td style="font-size:0.82rem">${i.descricao || '—'}</td>
                  <td><span class="status-badge status-warning">${i.status || 'Aberta'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>` : ''}
    `;
  }

  // HELPERS AUXILIARES DO MOTORISTA
  window.selectDelivery = (orderId) => {
    window._selectedDeliveryOrderId = orderId;
    if (typeof PAGE_RENDERERS.motorista_entregas === 'function') {
      PAGE_RENDERERS.motorista_entregas(document.getElementById('page-content'));
    }
  };

  window.simulateCamera = () => {
    const placeholder = document.getElementById('delivery-camera-placeholder');
    const img = document.getElementById('delivery-camera-img');
    if (placeholder && img) {
      placeholder.style.display = 'none';
      img.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23c5e1a5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%2333691e">Carga Entregue - EM PROF. ANTÔNIO LOPES LINS</text></svg>';
      img.style.display = 'block';
    }
  };

  window.clearSignature = () => {
    const canvas = document.getElementById('delivery-sig-canvas');
    const placeholder = document.getElementById('delivery-sig-placeholder');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (placeholder) placeholder.style.display = 'flex';
  };

  window.initSignatureCanvas = () => {
    const canvas = document.getElementById('delivery-sig-canvas');
    const placeholder = document.getElementById('delivery-sig-placeholder');
    if (!canvas) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    
    let drawing = false;
    
    const startDraw = (e) => {
      drawing = true;
      if (placeholder) placeholder.style.display = 'none';
      ctx.beginPath();
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      ctx.moveTo(x, y);
    };
    
    const draw = (e) => {
      if (!drawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    };
    
    const stopDraw = () => {
      drawing = false;
    };
    
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDraw);
    canvas.addEventListener('touchstart', (e) => { startDraw(e); e.preventDefault(); });
    canvas.addEventListener('touchmove', (e) => { draw(e); e.preventDefault(); });
    canvas.addEventListener('touchend', stopDraw);
  };
})();
