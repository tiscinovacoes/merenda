/**
 * ==============================================================================
 * SUALE — Sistema de Gestão da Alimentação Escolar (SEMED Campo Grande / MS)
 * Módulo: Mensageria & Integração WhatsApp (Evolution API Gateway)
 * Reuso Arquitetural: Padrão resiliente derivado de D:\Projetos\Poli
 * Fuso Horário de Referência: America/Campo_Grande (UTC-4)
 * ==============================================================================
 */

(function (window) {
  'use strict';

  // 1. CONFIGURAÇÃO DE AMBIENTE & INSTÂNCIA
  const _env = (typeof window !== 'undefined' && (window.__ENV__ || window.ENV)) || {};
  const EVOLUTION_API_URL = _env.EVOLUTION_API_URL || (typeof localStorage !== 'undefined' && localStorage.getItem('SUALE_EVOLUTION_URL')) || '';
  const EVOLUTION_API_KEY = _env.EVOLUTION_API_KEY || (typeof localStorage !== 'undefined' && localStorage.getItem('SUALE_EVOLUTION_KEY')) || '';
  const INSTANCE_NAME = _env.EVOLUTION_INSTANCE_NAME || (typeof localStorage !== 'undefined' && localStorage.getItem('SUALE_EVOLUTION_INSTANCE')) || 'suale-notificacoes';

  /**
   * Sanitiza e formata número de telefone para padrão internacional E.164 (Brasil / MS)
   * Suporta números com DDD 67 (Campo Grande e MS)
   */
  function formatCleanPhone(raw) {
    if (!raw) return '';
    let clean = String(raw).replace('@s.whatsapp.net', '').replace(/@lid$/, '').replace(/\D/g, '');
    
    // Adiciona DDI 55 se ausente
    if (clean.length === 10 || clean.length === 11) {
      clean = '55' + clean;
    }
    return clean;
  }

  /**
   * Retorna carimbo de data/hora no fuso oficial de Mato Grosso do Sul
   */
  function getCampoGrandeTimestamp() {
    return new Date().toLocaleTimeString('pt-BR', {
      timeZone: 'America/Campo_Grande',
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    });
  }

  // 2. DISPATCHER HTTP EVOLUTION API
  async function dispatchWhatsAppMessage(phone, text, delayMs = 1200) {
    const cleanNumber = formatCleanPhone(phone);
    if (!cleanNumber) {
      console.warn('[Messaging] Número de telefone inválido para envio:', phone);
      return { success: false, error: 'Telefone inválido' };
    }

    const payload = {
      number: cleanNumber,
      text: text.trim(),
      delay: delayMs,
      linkPreview: true
    };

    // Modo Sandbox / Fallback se URL ou Key não estiverem configuradas
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
      const simulatedMsg = `[WHATSAPP MOCK · ${getCampoGrandeTimestamp()}] Para: +${cleanNumber}\n${text}`;
      console.info('[Messaging:Sandbox]', simulatedMsg);
      
      // Registra evento no drawer de notificações do SUALE
      if (window.SharedState && typeof window.SharedState.addNotification === 'function') {
        window.SharedState.addNotification({
          title: 'WhatsApp Enviado (Simulação)',
          body: text.substring(0, 120) + '...',
          type: 'whatsapp',
          time: 'Agora'
        });
      }

      return {
        success: true,
        mode: 'sandbox',
        simulatedAt: new Date().toISOString(),
        recipient: cleanNumber
      };
    }

    try {
      const endpoint = `${EVOLUTION_API_URL.replace(/\/$/, '')}/message/sendText/${INSTANCE_NAME}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log(`[Messaging] Mensagem entregue via WhatsApp (+${cleanNumber})`);
        return { success: true, data };
      } else {
        const errText = await response.text();
        console.warn(`[Messaging] Falha ao enviar WhatsApp (+${cleanNumber}):`, errText);
        return { success: false, error: errText };
      }
    } catch (err) {
      console.warn(`[Messaging] Erro de rede ou timeout no envio (+${cleanNumber}):`, err.message);
      return { success: false, error: err.message, fallback: 'local_queue' };
    }
  }

  // 3. TEMPLATES DE NOTIFICAÇÃO DO PNAE (SEMED CAMPO GRANDE)
  const SUALE_MESSAGING = {
    formatCleanPhone,
    dispatchWhatsAppMessage,

    /**
     * Notifica a Direção Escolar sobre a saída e previsão da entrega de merenda
     */
    async notifySchoolDelivery(schoolName, driverName, orderId, phone = '67999887766') {
      const hora = getCampoGrandeTimestamp();
      const text = `🚚 *SUALE / SEMED — Alerta de Entrega*\n\nPrezada Direção da *${schoolName}*,\n\nO motorista *${driverName}* iniciou o deslocamento para entrega da remessa da alimentação escolar (*Pedido #${orderId}*).\n\n⏰ Horário de saída: ${hora}\n📍 Unidade de destino: ${schoolName}\n\nFavor designar a equipe da cozinha/estoque para conferência da Nota e assinatura do termo digital.`;
      
      const res = await dispatchWhatsAppMessage(phone, text);
      if (typeof window.showToast === 'function') {
        window.showToast(`📲 Alerta WhatsApp enviado para ${schoolName}!`, 'info');
      }
      return res;
    },

    /**
     * Notifica o Almoxarifado Central sobre incidente/atraso na rota
     */
    async notifyDriverIncident(driverName, routeName, incidentType, phone = '67988776655') {
      const hora = getCampoGrandeTimestamp();
      const text = `⚠️ *SUALE / Logística — Registro de Ocorrência na Rota*\n\nO motorista *${driverName}* reportou uma ocorrência durante a execução da rota *${routeName}*:\n\n• *Tipo de Ocorrência:* ${incidentType}\n• *Registro:* ${hora} (Fuso Campo Grande)\n\nA Central de Distribuição foi notificada para reprogramação de entregas.`;

      return await dispatchWhatsAppMessage(phone, text);
    },

    /**
     * Notifica a Cooperativa ou Produtor Familiar sobre emissão de nova OS
     */
    async notifySupplierPurchaseOrder(supplierName, osNumber, totalValue, phone = '67991234567') {
      const formattedVal = Number(totalValue || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      const text = `🌾 *SUALE / SEMED — Nova Ordem de Fornecimento PNAE*\n\nPrezada cooperativa/produtor *${supplierName}*,\n\nFoi emitido o fornecimento *${osNumber}* no valor de *${formattedVal}*.\n\nFavor acessar o portal do colaborador para download da grade de distribuição e cronograma das escolas piloto.`;

      return await dispatchWhatsAppMessage(phone, text);
    },

    /**
     * Notifica Nutricionista e Gestor sobre item de estoque com validade crítica (< 5 dias)
     */
    async notifyStockExpirationRisk(schoolName, productName, daysLeft, phone = '67992345678') {
      const text = `🚨 *SUALE / Nutrição — Alerta de Validade Próxima*\n\nIdentificado lote de *${productName}* na unidade *${schoolName}* com validade em *${daysLeft} dias*.\n\nFavor priorizar a inserção deste insumo no cardápio semanal para evitar desperdício alimentar.`;

      return await dispatchWhatsAppMessage(phone, text);
    }
  };

  // Exportação Global
  window.SUALE_MESSAGING = SUALE_MESSAGING;

})(typeof window !== 'undefined' ? window : this);
