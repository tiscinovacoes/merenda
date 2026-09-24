-- ==============================================================================
-- SUALE (SEMED Campo Grande) — Rollback Migration 001
-- Descrição: Reversão segura de índices B-Tree, Compostos e GIN
-- Arquitetura: PostgreSQL 15+ / Supabase
-- Autor: Engenheiro Principal & Database Optimizer
-- ==============================================================================

-- 1. Remoção de Índices GIN
DROP INDEX IF EXISTS public.idx_lista_compras_itens_gin;
DROP INDEX IF EXISTS public.idx_os_fornecedores_itens_gin;
DROP INDEX IF EXISTS public.idx_os_central_itens_gin;
DROP INDEX IF EXISTS public.idx_empenhos_itens_gin;
DROP INDEX IF EXISTS public.idx_atas_itens_gin;
DROP INDEX IF EXISTS public.idx_orders_items_gin;

-- 2. Remoção de Índices Compostos
DROP INDEX IF EXISTS public.idx_escola_usuarios_matricula;
DROP INDEX IF EXISTS public.idx_escola_usuarios_cpf;
DROP INDEX IF EXISTS public.idx_planejamento_school_date;
DROP INDEX IF EXISTS public.idx_restricoes_school_status;
DROP INDEX IF EXISTS public.idx_estoque_escolas_validade;
DROP INDEX IF EXISTS public.idx_empenhos_ata_status;
DROP INDEX IF EXISTS public.idx_orders_school_status;

-- 3. Remoção de Índices de Chaves Estrangeiras
DROP INDEX IF EXISTS public.idx_planejamento_alimentar_school;
DROP INDEX IF EXISTS public.idx_escola_usuarios_school_id;
DROP INDEX IF EXISTS public.idx_estoque_escolas_school_id;
DROP INDEX IF EXISTS public.idx_farmers_cooperative_id;
DROP INDEX IF EXISTS public.idx_lista_compras_escola;
DROP INDEX IF EXISTS public.idx_os_central_destino_escola;
DROP INDEX IF EXISTS public.idx_alunos_school_id;
DROP INDEX IF EXISTS public.idx_restricoes_school_id;
DROP INDEX IF EXISTS public.idx_empenhos_escola_id;
DROP INDEX IF EXISTS public.idx_empenhos_ata_id;
DROP INDEX IF EXISTS public.idx_orders_school_id;
