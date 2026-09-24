-- ==============================================================================
-- SUALE (SEMED Campo Grande) — Migration 004
-- Descrição: Matriz Completa de Supabase Auth JWT, RLS e Idempotência (Fase 2)
-- Arquitetura: PostgreSQL 15+ / Supabase Auth (JWT & Security Hardening)
-- ==============================================================================

-- 1. ADICIONA COLUNAS DE IDEMPOTÊNCIA E AUDITORIA JWT
ALTER TABLE IF EXISTS public.orders ADD COLUMN IF NOT EXISTS idempotency_key UUID UNIQUE;
ALTER TABLE IF EXISTS public.empenhos ADD COLUMN IF NOT EXISTS idempotency_key UUID UNIQUE;
ALTER TABLE IF EXISTS public.deliveries ADD COLUMN IF NOT EXISTS idempotency_key UUID UNIQUE;
ALTER TABLE IF EXISTS public.stock_adjusts ADD COLUMN IF NOT EXISTS idempotency_key UUID UNIQUE;
ALTER TABLE IF EXISTS public.cardapios ADD COLUMN IF NOT EXISTS idempotency_key UUID UNIQUE;

-- 2. HABILITA RLS EM TABELAS ADICIONAIS DA FASE 2
ALTER TABLE IF EXISTS public.nfs_recebidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.estoque_escolas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.planejamento_alimentar ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.os_fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.os_estoque_central ENABLE ROW LEVEL SECURITY;

-- 3. POLÍTICAS DE ACESSO BASEADAS EM JWT (auth.uid() / authenticated)

-- NFS Recebidas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'nfs_recebidas' AND policyname = 'p_nfs_select') THEN
    CREATE POLICY p_nfs_select ON public.nfs_recebidas FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'nfs_recebidas' AND policyname = 'p_nfs_insert_auth') THEN
    CREATE POLICY p_nfs_insert_auth ON public.nfs_recebidas FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END $$;

-- Estoque Escolas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'estoque_escolas' AND policyname = 'p_estoque_escolas_select') THEN
    CREATE POLICY p_estoque_escolas_select ON public.estoque_escolas FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'estoque_escolas' AND policyname = 'p_estoque_escolas_write_auth') THEN
    CREATE POLICY p_estoque_escolas_write_auth ON public.estoque_escolas FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Planejamento Alimentar
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'planejamento_alimentar' AND policyname = 'p_planejamento_select') THEN
    CREATE POLICY p_planejamento_select ON public.planejamento_alimentar FOR SELECT TO anon, authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'planejamento_alimentar' AND policyname = 'p_planejamento_write_auth') THEN
    CREATE POLICY p_planejamento_write_auth ON public.planejamento_alimentar FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 4. FUNÇÃO TRIGGER PARA REGISTRO DE AUDITORIA COM USUÁRIO AUTH
CREATE OR REPLACE FUNCTION public.fn_audit_mutation_with_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id TEXT;
BEGIN
  v_user_id := COALESCE(auth.uid()::text, 'anon');
  INSERT INTO public.server_audit_trail (
    table_name,
    action,
    record_id,
    old_data,
    new_data,
    client_ip
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(NEW.id::text, OLD.id::text, 'n/a'),
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    v_user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ativa triggers nas tabelas críticas
DROP TRIGGER IF EXISTS trg_audit_orders ON public.orders;
CREATE TRIGGER trg_audit_orders AFTER INSERT OR UPDATE OR DELETE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.fn_audit_mutation_with_user();

DROP TRIGGER IF EXISTS trg_audit_empenhos ON public.empenhos;
CREATE TRIGGER trg_audit_empenhos AFTER INSERT OR UPDATE OR DELETE ON public.empenhos FOR EACH ROW EXECUTE FUNCTION public.fn_audit_mutation_with_user();
