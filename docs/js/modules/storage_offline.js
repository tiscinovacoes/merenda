/* ============================================================
   SUALE — Storage Offline-First & Outbox Sync (storage_offline.js)
   Gerenciador de persistência local via IndexedDB (Dexie.js)
   Garante funcionamento offline para Escolas e Motoristas
   Versão: v3.3.0
   ============================================================ */

(function (window) {
  'use strict';

  let db = null;
  let isSyncing = false;

  // Inicialização do Banco Local IndexedDB via Dexie
  function initIndexedDB() {
    if (typeof Dexie === 'undefined') {
      console.warn('[Storage Offline] Dexie.js não encontrado no DOM. Operando em modo de fallback.');
      return null;
    }

    try {
      if (!db) {
        db = new Dexie('SUALE_LocalDB');
        db.version(1).stores({
          entregas_pendentes: '++id, escola_id, ordem_id, data, syncd, criado_em',
          pedidos_pendentes: '++id, escola_id, semana, syncd, criado_em',
          cache_alimentos: 'id, nome, categoria',
          cache_cardapios: 'escola_id, semana',
          app_state: 'key'
        });
        console.log('[Storage Offline] IndexedDB SUALE_LocalDB inicializado com sucesso.');
      }
      return db;
    } catch (err) {
      console.error('[Storage Offline] Erro ao instanciar Dexie:', err);
      return null;
    }
  }

  // Atualizador do Badge Visual de Conectividade no Header
  function updateUIStatus(state, details = '') {
    const badge = document.getElementById('db-status-badge');
    const dot = document.getElementById('db-status-dot');
    const label = document.getElementById('db-status-label');

    if (!badge || !dot || !label) return;

    if (state === 'online') {
      badge.style.background = 'rgba(46, 125, 50, 0.12)';
      badge.style.color = '#2E7D32';
      badge.style.border = '1px solid rgba(46, 125, 50, 0.25)';
      dot.style.background = '#2E7D32';
      label.textContent = '🟢 Online · Nuvem Ativa';
      badge.title = 'Conectado ao Supabase PostgreSQL com replicação em tempo real.';
    } else if (state === 'pending') {
      badge.style.background = 'rgba(245, 124, 0, 0.15)';
      badge.style.color = '#E65100';
      badge.style.border = '1px solid rgba(245, 124, 0, 0.35)';
      dot.style.background = '#F57C00';
      label.textContent = `🟡 Offline · ${details || 'Itens'} localmente`;
      badge.title = 'Registros gravados no dispositivo. Serão transmitidos automaticamente assim que a conexão retornar.';
    } else if (state === 'syncing') {
      badge.style.background = 'rgba(21, 101, 192, 0.15)';
      badge.style.color = '#1565C0';
      badge.style.border = '1px solid rgba(21, 101, 192, 0.35)';
      dot.style.background = '#1565C0';
      label.textContent = '🔵 Sincronizando...';
      badge.title = 'Transmitindo registros pendentes para o servidor da SEMED.';
    } else if (state === 'offline') {
      badge.style.background = 'rgba(198, 40, 40, 0.12)';
      badge.style.color = '#C62828';
      badge.style.border = '1px solid rgba(198, 40, 40, 0.25)';
      dot.style.background = '#C62828';
      label.textContent = '🔴 Modo Offline (IndexedDB)';
      badge.title = 'Sem conexão de rede. Trabalhando 100% no disco local seguro.';
    }
  }

  // Salvar entrega no IndexedDB (Offline ou Fila Outbox)
  async function saveDeliveryOffline(deliveryData) {
    const local = initIndexedDB();
    const payload = {
      escola_id: deliveryData.escola_id || deliveryData.schoolId || '',
      ordem_id: deliveryData.ordem_id || deliveryData.orderId || ('ENT-' + Date.now()),
      data: deliveryData.data || new Date().toISOString().split('T')[0],
      itens: deliveryData.itens || deliveryData.items || [],
      recebedor_nome: deliveryData.recebedor_nome || deliveryData.receiverName || '',
      recebedor_cargo: deliveryData.recebedor_cargo || deliveryData.receiverRole || 'Merendeira / Direção',
      assinatura_svg: deliveryData.assinatura_svg || deliveryData.signature || '',
      motorista_id: deliveryData.motorista_id || deliveryData.driverId || '',
      geoloc: deliveryData.geoloc || null,
      syncd: 0,
      criado_em: new Date().toISOString()
    };

    if (local) {
      try {
        const id = await local.entregas_pendentes.add(payload);
        payload.id = id;
        console.log('[Storage Offline] Entrega salva no IndexedDB:', id);
      } catch (e) {
        console.warn('[Storage Offline] Erro ao gravar no IndexedDB, usando fallback:', e);
      }
    }

    // Atualiza status e tenta sincronizar se estiver online
    await checkAndRefreshStatus();
    if (navigator.onLine) {
      triggerOutboxSync();
    }
    return payload;
  }

  // Salvar pedido da escola no IndexedDB
  async function saveOrderOffline(orderData) {
    const local = initIndexedDB();
    const payload = {
      escola_id: orderData.escola_id || orderData.schoolId || '',
      escola_nome: orderData.escola_nome || orderData.schoolName || '',
      semana: orderData.semana || 'Semana Atual',
      itens: orderData.itens || orderData.items || [],
      observacoes: orderData.observacoes || '',
      syncd: 0,
      criado_em: new Date().toISOString()
    };

    if (local) {
      try {
        const id = await local.pedidos_pendentes.add(payload);
        payload.id = id;
        console.log('[Storage Offline] Pedido salvo no IndexedDB:', id);
      } catch (e) {
        console.warn('[Storage Offline] Erro ao gravar pedido no IndexedDB:', e);
      }
    }

    await checkAndRefreshStatus();
    if (navigator.onLine) {
      triggerOutboxSync();
    }
    return payload;
  }

  // Contagem de itens pendentes para sincronização
  async function getSyncCounts() {
    const local = initIndexedDB();
    if (!local) return { pendingDeliveries: 0, pendingOrders: 0, totalPending: 0 };

    try {
      const delCount = await local.entregas_pendentes.where('syncd').equals(0).count();
      const ordCount = await local.pedidos_pendentes.where('syncd').equals(0).count();
      return {
        pendingDeliveries: delCount,
        pendingOrders: ordCount,
        totalPending: delCount + ordCount
      };
    } catch (e) {
      return { pendingDeliveries: 0, pendingOrders: 0, totalPending: 0 };
    }
  }

  // Verificação e atualização do status visual
  async function checkAndRefreshStatus() {
    const counts = await getSyncCounts();
    if (!navigator.onLine) {
      if (counts.totalPending > 0) {
        updateUIStatus('pending', `${counts.totalPending} pendentes`);
      } else {
        updateUIStatus('offline');
      }
    } else {
      if (counts.totalPending > 0) {
        updateUIStatus('pending', `${counts.totalPending} para enviar`);
      } else {
        updateUIStatus('online');
      }
    }
  }

  // Motor de Sincronização Outbox (Disparo em Lote para o Supabase)
  async function triggerOutboxSync() {
    if (isSyncing || !navigator.onLine) return;

    const local = initIndexedDB();
    if (!local) return;

    const counts = await getSyncCounts();
    if (counts.totalPending === 0) {
      updateUIStatus('online');
      return;
    }

    isSyncing = true;
    updateUIStatus('syncing');

    try {
      const sb = window.DB_CLIENT || (window.initClient && window.initClient());

      // 1. Sincronizar Entregas Pendentes
      const pendingDeliveries = await local.entregas_pendentes.where('syncd').equals(0).toArray();
      for (const item of pendingDeliveries) {
        let success = false;

        if (sb && typeof sb.rpc === 'function') {
          try {
            // Tenta chamar a Stored Procedure transacional no Postgres
            const { data, error } = await sb.rpc('fn_confirmar_entrega_fefo', {
              p_escola_id: String(item.escola_id),
              p_ordem_id: String(item.ordem_id),
              p_itens_conferidos: item.itens,
              p_recebedor_nome: item.recebedor_nome,
              p_assinatura_svg: item.assinatura_svg,
              p_motorista_id: String(item.motorista_id || ''),
              p_geoloc: item.geoloc || {}
            });
            if (!error) success = true;
          } catch (rpcErr) {
            console.warn('[Sync Outbox] RPC indisponível, tentando fallback de inserção direta:', rpcErr);
          }
        }

        // Fallback para inserção na tabela orders se a RPC não responder
        if (!success && sb) {
          try {
            const { error: insertErr } = await sb.from('orders').upsert({
              order_id: item.ordem_id,
              school_id: item.escola_id,
              items: item.itens,
              status: 'entregue',
              delivered_at: item.data,
              signature: item.assinatura_svg
            });
            if (!insertErr) success = true;
          } catch (e) {
            console.warn('[Sync Outbox] Falha no fallback de ordem:', e);
          }
        }

        if (success) {
          await local.entregas_pendentes.update(item.id, { syncd: 1 });
          console.log(`[Sync Outbox] Entrega ${item.ordem_id} sincronizada com sucesso.`);
        }
      }

      // 2. Sincronizar Pedidos Pendentes
      const pendingOrders = await local.pedidos_pendentes.where('syncd').equals(0).toArray();
      for (const ord of pendingOrders) {
        let ordSuccess = false;

        if (sb && typeof sb.rpc === 'function') {
          try {
            const { data, error } = await sb.rpc('fn_processar_pedido_escola', {
              p_school_id: String(ord.escola_id),
              p_semana: ord.semana,
              p_itens: ord.itens,
              p_observacoes: ord.observacoes
            });
            if (!error) ordSuccess = true;
          } catch (e) {
            console.warn('[Sync Outbox] Erro na RPC de pedido:', e);
          }
        }

        if (!ordSuccess && sb) {
          try {
            const { error } = await sb.from('orders').insert({
              school_id: ord.escola_id,
              school_name: ord.escola_nome,
              items: ord.itens,
              status: 'pendente'
            });
            if (!error) ordSuccess = true;
          } catch (e) {
            console.warn('[Sync Outbox] Falha na gravação direta de pedido:', e);
          }
        }

        if (ordSuccess) {
          await local.pedidos_pendentes.update(ord.id, { syncd: 1 });
          console.log(`[Sync Outbox] Pedido ${ord.id} da escola ${ord.escola_id} sincronizado.`);
        }
      }

      if (window.showToast) {
        window.showToast('✅ Dados offline sincronizados com o Supabase!', 'success');
      }
    } catch (syncErr) {
      console.error('[Sync Outbox] Erro geral durante sincronização:', syncErr);
    } finally {
      isSyncing = false;
      await checkAndRefreshStatus();
    }
  }

  // Hidratação do estado do app a partir do IndexedDB
  async function hydrateSharedState() {
    const local = initIndexedDB();
    if (!local) return null;

    try {
      const record = await local.app_state.get('shared_data_snapshot');
      if (record && record.value) {
        console.log('[Storage Offline] Snapshot carregado do IndexedDB com sucesso.');
        return record.value;
      }
    } catch (e) {
      console.warn('[Storage Offline] Não foi possível ler snapshot do IndexedDB:', e);
    }
    return null;
  }

  // Persistência com Write-Behind no IndexedDB
  let _persistDebounce = null;
  function persistSharedStateAsync(data) {
    if (_persistDebounce) clearTimeout(_persistDebounce);
    _persistDebounce = setTimeout(async () => {
      const local = initIndexedDB();
      if (!local) return;
      try {
        await local.app_state.put({ key: 'shared_data_snapshot', value: data, atualizado_em: new Date().toISOString() });
      } catch (err) {
        console.warn('[Storage Offline] Erro no Write-Behind do IndexedDB:', err);
      }
    }, 150);
  }

  // Escutadores de Eventos de Conexão de Rede
  window.addEventListener('online', () => {
    console.log('[Storage Offline] Conexão detectada (online). Iniciando sincronização...');
    checkAndRefreshStatus();
    triggerOutboxSync();
  });

  window.addEventListener('offline', () => {
    console.warn('[Storage Offline] Conexão perdida (offline). Entrando em modo local.');
    checkAndRefreshStatus();
  });

  // Inicialização e registro no escopo global
  window.SUALE_Storage = {
    init: initIndexedDB,
    saveDeliveryOffline,
    saveOrderOffline,
    getSyncCounts,
    triggerOutboxSync,
    checkAndRefreshStatus,
    updateUIStatus,
    hydrateSharedState,
    persistSharedStateAsync
  };

  // Verificação inicial quando a página carrega
  window.addEventListener('DOMContentLoaded', () => {
    initIndexedDB();
    checkAndRefreshStatus();
  });

})(typeof window !== 'undefined' ? window : this);
