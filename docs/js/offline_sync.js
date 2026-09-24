/* ==============================================================================
   SUALE — Motor Offline-First & Idempotência (js/offline_sync.js)
   Fila de Mutações Offline em IndexedDB com Chaves UUIDv4 Idempotentes (Sprint 3)
   ============================================================================== */

(function () {
  'use strict';

  const DB_NAME = 'SUALE_OfflineDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'mutation_queue';

  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        return resolve(null);
      }
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (e) {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
      req.onsuccess = function (e) {
        resolve(e.target.result);
      };
      req.onerror = function (e) {
        console.warn('[OfflineSync] Erro ao abrir IndexedDB:', e.target.error);
        resolve(null);
      };
    });
  }

  const OfflineSync = {
    generateUUID: generateUUID,

    async enqueueMutation({ table, action, payload, idempotencyKey }) {
      const id = idempotencyKey || generateUUID();
      const record = {
        id: id,
        table: table,
        action: action || 'INSERT',
        payload: payload || {},
        createdAt: new Date().toISOString(),
        status: 'pending',
        retryCount: 0
      };

      console.log(`[OfflineSync] Enfileirando mutação offline [${table}] ID=${id}`);

      const db = await openDB();
      if (db) {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.put(record);
        } catch (err) {
          console.warn('[OfflineSync] Falha ao salvar no IndexedDB:', err.message);
        }
      }

      // Salva fallback adicional no localStorage para resiliência extra
      try {
        const queueKey = 'SUALE_OFFLINE_QUEUE';
        const existing = JSON.parse(localStorage.getItem(queueKey) || '[]');
        existing.push(record);
        localStorage.setItem(queueKey, JSON.stringify(existing));
      } catch (e) {}

      return record;
    },

    async getPendingMutations() {
      const db = await openDB();
      if (!db) {
        try {
          return JSON.parse(localStorage.getItem('SUALE_OFFLINE_QUEUE') || '[]').filter(r => r.status === 'pending');
        } catch (e) { return []; }
      }
      return new Promise((resolve) => {
        try {
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const req = store.getAll();
          req.onsuccess = function () {
            const list = req.result || [];
            resolve(list.filter(r => r.status === 'pending'));
          };
          req.onerror = function () { resolve([]); };
        } catch (err) {
          resolve([]);
        }
      });
    },

    async markSynced(id) {
      const db = await openDB();
      if (db) {
        try {
          const tx = db.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          store.delete(id);
        } catch (e) {}
      }
      try {
        const queueKey = 'SUALE_OFFLINE_QUEUE';
        const existing = JSON.parse(localStorage.getItem(queueKey) || '[]').filter(r => r.id !== id);
        localStorage.setItem(queueKey, JSON.stringify(existing));
      } catch (e) {}
    },

    async processQueue() {
      if (!navigator.onLine) {
        console.log('[OfflineSync] Dispositivo offline — adiando sincronização da fila');
        return;
      }
      if (!window.DB || !window.DB_STATUS || !window.DB_STATUS.initialized) {
        return;
      }

      const pending = await this.getPendingMutations();
      if (!pending || pending.length === 0) return;

      console.log(`[OfflineSync] Processando ${pending.length} mutações pendentes da fila offline...`);

      for (const item of pending) {
        try {
          let success = false;
          if (window.DB && typeof window.DB.executeRawMutation === 'function') {
            success = await window.DB.executeRawMutation(item);
          }
          if (success) {
            await this.markSynced(item.id);
            console.log(`[OfflineSync] Mutação ID=${item.id} sincronizada com sucesso no Supabase.`);
          }
        } catch (err) {
          console.warn(`[OfflineSync] Erro ao sincronizar item ${item.id}:`, err.message);
        }
      }
    }
  };

  window.OfflineSync = OfflineSync;

  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      console.log('[OfflineSync] Conexão restabelecida! Iniciando sincronização automática.');
      OfflineSync.processQueue();
    });
    setInterval(() => {
      if (navigator.onLine) OfflineSync.processQueue();
    }, 30000);
  }
})();
