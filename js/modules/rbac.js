/**
 * ==============================================================================
 * SUALE — Sistema de Gestão da Alimentação Escolar (SEMED Campo Grande / MS)
 * Módulo: Controle de Acesso Baseado em Papéis (RBAC & ACL)
 * Padrão Arquitetural: Domain-Driven Design (DDD) & Least Privilege
 * ==============================================================================
 */

(function (window) {
  'use strict';

  // 1. BOUNDED CONTEXTS DO SISTEMA
  const CONTEXTS = {
    GESTAO_ESTRATEGICA: 'gestao_estrategica',
    NUTRICAO_PNAE: 'nutricao_pnae',
    COMPRAS_CONTRATOS: 'compras_contratos',
    LOGISTICA_WMS: 'logistica_wms',
    GESTAO_ESCOLAR: 'gestao_escolar',
    AGRICULTURA_FAMILIAR: 'agricultura_familiar',
    MENSAGERIA: 'mensageria'
  };

  // 2. PERFIS (ROLES) E SUB-PAPEIS
  const ROLES = {
    GESTOR: 'gestor',
    NUTRICIONISTA: 'nutricionista',
    ESCOLA: 'escola',
    ESTOQUE: 'estoque',
    MOTORISTA: 'motorista',
    COMPRAS: 'compras',
    COLABORADORES: 'colaboradores',
    // Subroles
    COOPERATIVA: 'cooperativa',
    AGRICULTOR: 'agricultor',
    DIRETOR: 'diretor',
    RESP_ESTOQUE: 'resp_estoque',
    MERENDEIRA: 'merendeira'
  };

  // 3. RECURSOS DO SISTEMA
  const RESOURCES = {
    DASHBOARD: 'dashboard',
    ESCOLAS: 'escolas',
    ATAS: 'atas',
    EMPENHOS: 'empenhos',
    PEDIDOS: 'pedidos',
    COOPERATIVAS: 'cooperativas',
    AGRICULTORES: 'agricultores',
    ESTOQUE_CENTRAL: 'estoque_central',
    ESTOQUE_ESCOLAR: 'estoque_escolar',
    CARDAPIOS: 'cardapios',
    FICHAS_TECNICAS: 'fichas_tecnicas',
    CONSUMO: 'consumo',
    DESPERDICIOS: 'desperdicios',
    RESTRICOES: 'restricoes',
    ENTREGAS: 'entregas',
    ROTAS: 'rotas',
    OCORRENCIAS: 'ocorrencias',
    RELATORIOS: 'relatorios',
    IA_PREVISAO: 'ia_previsao',
    MENSAGERIA: 'mensageria',
    USUARIOS: 'usuarios'
  };

  // 4. AÇÕES PERMITIDAS
  const ACTIONS = {
    READ: 'read',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    APPROVE: 'approve',
    DISPATCH: 'dispatch'
  };

  // 5. MATRIZ DETERMINÍSTICA DE PERMISSÕES
  // Formato: [role]: { [resource]: [actions] }
  const PERMISSIONS_MATRIX = {
    [ROLES.GESTOR]: {
      [RESOURCES.DASHBOARD]: ['read'],
      [RESOURCES.ESCOLAS]: ['read', 'create', 'update'],
      [RESOURCES.ATAS]: ['read', 'create', 'update', 'approve'],
      [RESOURCES.EMPENHOS]: ['read', 'create', 'update', 'approve'],
      [RESOURCES.PEDIDOS]: ['read', 'approve'],
      [RESOURCES.COOPERATIVAS]: ['read', 'create', 'update'],
      [RESOURCES.AGRICULTORES]: ['read'],
      [RESOURCES.ESTOQUE_CENTRAL]: ['read'],
      [RESOURCES.ESTOQUE_ESCOLAR]: ['read'],
      [RESOURCES.CARDAPIOS]: ['read'],
      [RESOURCES.RESTRICOES]: ['read'],
      [RESOURCES.RELATORIOS]: ['read'],
      [RESOURCES.IA_PREVISAO]: ['read', 'create'],
      [RESOURCES.MENSAGERIA]: ['read', 'dispatch'],
      [RESOURCES.USUARIOS]: ['read', 'create', 'update']
    },
    [ROLES.NUTRICIONISTA]: {
      [RESOURCES.DASHBOARD]: ['read'],
      [RESOURCES.FICHAS_TECNICAS]: ['read', 'create', 'update'],
      [RESOURCES.CARDAPIOS]: ['read', 'create', 'update', 'approve'],
      [RESOURCES.ESCOLAS]: ['read'],
      [RESOURCES.CONSUMO]: ['read', 'create', 'update'],
      [RESOURCES.DESPERDICIOS]: ['read', 'create', 'update'],
      [RESOURCES.RESTRICOES]: ['read', 'create', 'update', 'delete'],
      [RESOURCES.ESTOQUE_ESCOLAR]: ['read'],
      [RESOURCES.PEDIDOS]: ['read', 'create'],
      [RESOURCES.RELATORIOS]: ['read']
    },
    [ROLES.ESCOLA]: {
      [RESOURCES.DASHBOARD]: ['read'],
      [RESOURCES.CARDAPIOS]: ['read'],
      [RESOURCES.ESTOQUE_ESCOLAR]: ['read', 'create', 'update'],
      [RESOURCES.CONSUMO]: ['read', 'create'],
      [RESOURCES.PEDIDOS]: ['read', 'create'],
      [RESOURCES.ENTREGAS]: ['read', 'update'], // confirma recebimento
      [RESOURCES.RESTRICOES]: ['read', 'create'],
      [RESOURCES.RELATORIOS]: ['read']
    },
    [ROLES.ESTOQUE]: {
      [RESOURCES.DASHBOARD]: ['read'],
      [RESOURCES.ESTOQUE_CENTRAL]: ['read', 'create', 'update'],
      [RESOURCES.ENTREGAS]: ['read', 'create', 'dispatch'],
      [RESOURCES.ROTAS]: ['read', 'create', 'update'],
      [RESOURCES.ESCOLAS]: ['read'],
      [RESOURCES.RELATORIOS]: ['read']
    },
    [ROLES.MOTORISTA]: {
      [RESOURCES.DASHBOARD]: ['read'],
      [RESOURCES.ENTREGAS]: ['read', 'update'], // assina e foto
      [RESOURCES.ROTAS]: ['read'],
      [RESOURCES.OCORRENCIAS]: ['read', 'create']
    },
    [ROLES.COMPRAS]: {
      [RESOURCES.DASHBOARD]: ['read'],
      [RESOURCES.ATAS]: ['read', 'create', 'update'],
      [RESOURCES.EMPENHOS]: ['read', 'create', 'update'],
      [RESOURCES.COOPERATIVAS]: ['read'],
      [RESOURCES.PEDIDOS]: ['read'],
      [RESOURCES.RELATORIOS]: ['read']
    },
    [ROLES.COOPERATIVA]: {
      [RESOURCES.DASHBOARD]: ['read'],
      [RESOURCES.AGRICULTORES]: ['read', 'create', 'update'],
      [RESOURCES.PEDIDOS]: ['read', 'update'],
      [RESOURCES.ROTAS]: ['read'],
      [RESOURCES.ENTREGAS]: ['read', 'update'],
      [RESOURCES.RELATORIOS]: ['read']
    },
    [ROLES.AGRICULTOR]: {
      [RESOURCES.DASHBOARD]: ['read'],
      [RESOURCES.PEDIDOS]: ['read'],
      [RESOURCES.ENTREGAS]: ['read'],
      [RESOURCES.RELATORIOS]: ['read']
    }
  };

  // 6. MOTOR RBAC PRINCIPAL
  const SUALE_RBAC = {
    CONTEXTS,
    ROLES,
    RESOURCES,
    ACTIONS,

    /**
     * Verifica se um papel tem permissão para executar uma ação em um recurso
     * @param {string} role Perfil do usuário (gestor, escola, nutricionista, etc)
     * @param {string} action Ação desejada (read, create, update, delete, approve, dispatch)
     * @param {string} resource Recurso de destino (atas, cardapios, pedidos, etc)
     * @param {object} [context] Metadados contextuais (ex: schoolId, subrole)
     * @returns {boolean}
     */
    can(role, action, resource, context) {
      if (!role || !action || !resource) return false;

      // Gestor Geral tem permissão de leitura em tudo
      if (role === ROLES.GESTOR && action === ACTIONS.READ) return true;

      // Trata subroles de colaboradores
      let effectiveRole = role;
      if (role === ROLES.COLABORADORES) {
        effectiveRole = context?.subrole || ROLES.COOPERATIVA;
      }

      const rolePerms = PERMISSIONS_MATRIX[effectiveRole];
      if (!rolePerms) return false;

      const allowedActions = rolePerms[resource];
      if (!allowedActions) return false;

      return allowedActions.includes(action) || allowedActions.includes('*');
    },

    /**
     * Middleware/Guard para execução protegida
     * @param {string} action
     * @param {string} resource
     * @param {Function} allowedFn Executado se permitido
     * @param {Function} [deniedFn] Executado se negado
     */
    guard(action, resource, allowedFn, deniedFn) {
      const currentRole = (window.state && window.state.currentProfile) || ROLES.GESTOR;
      const subrole = window.state && window.state.currentSubrole;

      if (this.can(currentRole, action, resource, { subrole })) {
        if (typeof allowedFn === 'function') return allowedFn();
      } else {
        console.warn(`[RBAC] Acesso negado: Perfil "${currentRole}" tentou "${action}" em "${resource}".`);
        if (typeof deniedFn === 'function') {
          return deniedFn();
        } else if (typeof window.showToast === 'function') {
          window.showToast('⚠️ Ação não permitida para o seu perfil de acesso.', 'warning');
        }
      }
    },

    /**
     * Retorna a lista de páginas permitidas para o menu de navegação de um perfil
     * @param {string} profile
     * @returns {string[]}
     */
    getAllowedPages(profile) {
      const pagePermMap = {
        gestor: ['dashboard', 'escolas', 'atas', 'pedidos', 'cooperativas', 'agricultura', 'estoque', 'planejamento', 'relatorios', 'ia'],
        nutricionista: ['dashboard', 'fichas', 'produtos', 'cardapios', 'planejamento', 'escolas', 'consumo', 'desperdicios', 'restricoes', 'relatorios'],
        escola: ['dashboard', 'planejamento', 'cardapios', 'estoque', 'consumo', 'pedidos', 'entregas', 'historico', 'relatorios'],
        cooperativa: ['dashboard', 'agricultores', 'produtos', 'estoque', 'pedidos', 'planejamento', 'rotas', 'contratos', 'entregas', 'relatorios', 'indicadores'],
        agricultor: ['dashboard', 'producao', 'estoque', 'pedidos', 'entregas', 'calendario', 'relatorios', 'perfil'],
        estoque: ['dashboard', 'inventario', 'entradas', 'separacao', 'carregamento', 'lotes', 'escolas'],
        motorista: ['dashboard', 'entregas', 'ocorrencias', 'historico'],
        compras: ['dashboard', 'atas', 'empenhos', 'pedidos', 'cooperativas', 'relatorios']
      };
      return pagePermMap[profile] || ['dashboard'];
    }
  };

  // Exportação Global
  window.SUALE_RBAC = SUALE_RBAC;
  window.can = SUALE_RBAC.can.bind(SUALE_RBAC);

})(typeof window !== 'undefined' ? window : this);
