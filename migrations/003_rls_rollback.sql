-- ==============================================================================
-- SUALE (SEMED Campo Grande) — Migration 003 Rollback
-- Descrição: Reversão das políticas de RLS e retorno ao modo sem restrição
-- ==============================================================================

DROP POLICY IF EXISTS p_schools_public_select ON public.schools;
DROP POLICY IF EXISTS p_alimentos_public_select ON public.alimentos;
DROP POLICY IF EXISTS p_cardapios_public_select ON public.cardapios;
DROP POLICY IF EXISTS p_orders_select ON public.orders;
DROP POLICY IF EXISTS p_orders_insert ON public.orders;
DROP POLICY IF EXISTS p_empenhos_select ON public.empenhos;
DROP POLICY IF EXISTS p_empenhos_write_auth ON public.empenhos;
DROP POLICY IF EXISTS p_atas_select ON public.atas;
DROP POLICY IF EXISTS p_audit_select_auth ON public.server_audit_trail;

ALTER TABLE IF EXISTS public.schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alimentos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cardapios DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.empenhos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.atas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.restricoes_alimentares DISABLE ROW LEVEL SECURITY;
