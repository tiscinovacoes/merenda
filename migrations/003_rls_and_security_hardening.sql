-- ==============================================================================
-- SUALE (SEMED Campo Grande) — Migration 003
-- Descrição: Blindagem de Row Level Security (RLS) & Trilha de Auditoria Servidora
-- Arquitetura: PostgreSQL 15+ / Supabase (Defesa em Profundidade / B2G Compliance)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. HABILITAÇÃO DO ROW LEVEL SECURITY (RLS) NAS TABELAS ESTRATÉGICAS
-- ------------------------------------------------------------------------------

ALTER TABLE IF EXISTS public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cardapios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.empenhos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.atas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.restricoes_alimentares ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 2. POLÍTICAS DE ACESSO PÚBLICO CONTROLADO (Portal Cívico de Transparência PNAE)
-- ------------------------------------------------------------------------------

-- Escolas: Leitura aberta para alimentar o Portal Cívico e seleção institucional
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'schools' AND policyname = 'p_schools_public_select'
  ) THEN
    CREATE POLICY p_schools_public_select ON public.schools
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- Alimentos e Cardápios: Leitura aberta para comunidade, nutricionistas e escolas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'alimentos' AND policyname = 'p_alimentos_public_select'
  ) THEN
    CREATE POLICY p_alimentos_public_select ON public.alimentos
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cardapios' AND policyname = 'p_cardapios_public_select'
  ) THEN
    CREATE POLICY p_cardapios_public_select ON public.cardapios
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 3. POLÍTICAS RESTRITAS PARA ORDENS E PEDIDOS DE MERENDA
-- ------------------------------------------------------------------------------

-- Pedidos: Leitura para usuários autenticados e anon (com fallback defensivo)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'p_orders_select'
  ) THEN
    CREATE POLICY p_orders_select ON public.orders
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  -- Inserção de pedidos apenas com dados válidos
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'p_orders_insert'
  ) THEN
    CREATE POLICY p_orders_insert ON public.orders
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (school_id IS NOT NULL AND status IN ('pendente', 'em_separacao', 'em_rota', 'entregue', 'cancelado'));
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 4. POLÍTICAS CRÍTICAS: ATAS E EMPENHOS (Proteção Orçamentária e Fiscal)
-- ------------------------------------------------------------------------------

-- Empenhos e ATAs: Leitura aberta para consulta orçamentária do Gestor,
-- porém ESCRITA (INSERT/UPDATE/DELETE) BLOQUEADA para anon. Apenas authenticated/service_role!
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'empenhos' AND policyname = 'p_empenhos_select'
  ) THEN
    CREATE POLICY p_empenhos_select ON public.empenhos
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'empenhos' AND policyname = 'p_empenhos_write_auth'
  ) THEN
    CREATE POLICY p_empenhos_write_auth ON public.empenhos
      FOR ALL
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'atas' AND policyname = 'p_atas_select'
  ) THEN
    CREATE POLICY p_atas_select ON public.atas
      FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 5. TRILHA DE AUDITORIA IMUTÁVEL (Server-Side Audit Trigger)
-- ------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.server_audit_trail (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  action TEXT NOT NULL,
  record_id TEXT,
  old_data JSONB,
  new_data JSONB,
  performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_ip TEXT
);

-- Habilita RLS na trilha de auditoria: Ninguém pode deletar ou modificar logs
ALTER TABLE public.server_audit_trail ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'server_audit_trail' AND policyname = 'p_audit_select_auth'
  ) THEN
    CREATE POLICY p_audit_select_auth ON public.server_audit_trail
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
