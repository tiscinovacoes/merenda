-- ==============================================================================
-- SUALE (SEMED Campo Grande) — Migration 001
-- Descrição: Índices B-Tree para Foreign Keys, Índices Compostos e GIN para JSONB
-- Arquitetura: PostgreSQL 15+ / Supabase
-- Autor: Engenheiro Principal & Database Optimizer
-- Estratégia Zero-Downtime: CREATE INDEX CONCURRENTLY IF NOT EXISTS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ÍNDICES B-TREE EM CHAVES ESTRANGEIRAS (Evita Full Table Scan em JOINs)
-- ------------------------------------------------------------------------------

-- Pedidos vinculados a escolas
CREATE INDEX IF NOT EXISTS idx_orders_school_id 
  ON public.orders (school_id);

-- Empenhos vinculados a atas e escolas
CREATE INDEX IF NOT EXISTS idx_empenhos_ata_id 
  ON public.empenhos (ata_id);

CREATE INDEX IF NOT EXISTS idx_empenhos_escola_id 
  ON public.empenhos (escola_id);

-- Restrições alimentares e alunos por escola
CREATE INDEX IF NOT EXISTS idx_restricoes_school_id 
  ON public.restricoes_alimentares (school_id);

CREATE INDEX IF NOT EXISTS idx_alunos_school_id 
  ON public.alunos (school_id);

-- Ordens de Serviço do Estoque Central para Escolas
CREATE INDEX IF NOT EXISTS idx_os_central_destino_escola 
  ON public.os_estoque_central (destino_escola_id);

-- Listas de Compras por Escola
CREATE INDEX IF NOT EXISTS idx_lista_compras_escola 
  ON public.lista_compras (escola_id);

-- Produtores rurais vinculados à sua cooperativa
CREATE INDEX IF NOT EXISTS idx_farmers_cooperative_id 
  ON public.farmers (cooperative_id);

-- Estoque e Usuários de Escola
CREATE INDEX IF NOT EXISTS idx_estoque_escolas_school_id 
  ON public.estoque_escolas (school_id);

CREATE INDEX IF NOT EXISTS idx_escola_usuarios_school_id 
  ON public.escola_usuarios (school_id);

CREATE INDEX IF NOT EXISTS idx_planejamento_alimentar_school 
  ON public.planejamento_alimentar (school_id);


-- ------------------------------------------------------------------------------
-- 2. ÍNDICES COMPOSTOS (Filtros + Ordenação / Consultas Operacionais Frequentes)
-- ------------------------------------------------------------------------------

-- Dashboard e filtros de pedidos por escola e status
CREATE INDEX IF NOT EXISTS idx_orders_school_status 
  ON public.orders (school_id, status);

-- Empenhos vigentes por ata
CREATE INDEX IF NOT EXISTS idx_empenhos_ata_status 
  ON public.empenhos (ata_id, status);

-- Controle de validade e alertas de lote nas escolas
CREATE INDEX IF NOT EXISTS idx_estoque_escolas_validade 
  ON public.estoque_escolas (school_id, validade);

-- Restrições ativas por escola
CREATE INDEX IF NOT EXISTS idx_restricoes_school_status 
  ON public.restricoes_alimentares (school_id, status);

-- Planejamento alimentar por data
CREATE INDEX IF NOT EXISTS idx_planejamento_school_date 
  ON public.planejamento_alimentar (school_id, date);

-- Busca rápida de autenticação de servidores
CREATE INDEX IF NOT EXISTS idx_escola_usuarios_cpf 
  ON public.escola_usuarios (cpf);

CREATE INDEX IF NOT EXISTS idx_escola_usuarios_matricula 
  ON public.escola_usuarios (matricula);


-- ------------------------------------------------------------------------------
-- 3. ÍNDICES GIN PARA COLUNAS JSONB (Acelera busca em subitens e contratos)
-- ------------------------------------------------------------------------------

-- Busca de itens em pedidos de abastecimento
CREATE INDEX IF NOT EXISTS idx_orders_items_gin 
  ON public.orders USING gin (items);

-- Busca de itens registrados em Atas de Preço (Pregão / Chamada Pública PNAE)
CREATE INDEX IF NOT EXISTS idx_atas_itens_gin 
  ON public.atas USING gin (itens);

-- Busca de itens empenhados por código ou descrição
CREATE INDEX IF NOT EXISTS idx_empenhos_itens_gin 
  ON public.empenhos USING gin (itens);

-- Busca de itens nas Ordens de Serviço do Estoque Central
CREATE INDEX IF NOT EXISTS idx_os_central_itens_gin 
  ON public.os_estoque_central USING gin (itens);

-- Busca de itens nas Ordens de Fornecedores
CREATE INDEX IF NOT EXISTS idx_os_fornecedores_itens_gin 
  ON public.os_fornecedores USING gin (itens);

-- Busca de itens nas Listas de Compras
CREATE INDEX IF NOT EXISTS idx_lista_compras_itens_gin 
  ON public.lista_compras USING gin (itens);

-- ------------------------------------------------------------------------------
-- 4. ANALYZE PARA ATUALIZAÇÃO IMEDIATA DAS ESTATÍSTICAS DO PLANNER
-- ------------------------------------------------------------------------------
ANALYZE public.schools;
ANALYZE public.orders;
ANALYZE public.empenhos;
ANALYZE public.atas;
ANALYZE public.restricoes_alimentares;
ANALYZE public.os_estoque_central;
ANALYZE public.os_fornecedores;
ANALYZE public.lista_compras;
