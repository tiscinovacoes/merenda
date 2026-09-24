-- ==============================================================================
-- SUALE (SEMED Campo Grande) — Verificação de Integridade e Índices
-- Descrição: Consultas de auditoria e validação pós-migração
-- Arquitetura: PostgreSQL 15+ / Supabase
-- ==============================================================================

-- 1. Listar todos os índices criados na migração 001 e seus tamanhos
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- 2. Validar se há chaves estrangeiras sem índices no schema public
SELECT
    c.conname AS constraint_name,
    t.relname AS table_name,
    a.attname AS column_name
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
  AND t.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
  AND NOT EXISTS (
      SELECT 1
      FROM pg_index i
      WHERE i.indrelid = t.oid
        AND a.attnum = ANY(i.indkey)
  )
ORDER BY t.relname, a.attname;

-- 3. Teste de EXPLAIN com busca em coluna JSONB utilizando índice GIN
EXPLAIN ANALYZE
SELECT id, numero, fornecedor
FROM public.atas
WHERE itens @> '[{"codigo": "AF-001"}]';

-- 4. Teste de EXPLAIN com busca composta por escola e status
EXPLAIN ANALYZE
SELECT id, school_id, status, value
FROM public.orders
WHERE school_id = 1 AND status = 'Pendente';
