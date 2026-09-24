# Guia de Migrações SQL — SUALE (SEMED Campo Grande)

Este diretório gerencia o ciclo de vida e a integridade de banco de dados do sistema SUALE seguindo as práticas de **Zero-Downtime Migration**, **Database Optimizer** e **Segurança de Credenciais (cred-omega)**.

---

## 📁 Estrutura de Arquivos

| Arquivo | Descrição |
| :--- | :--- |
| `001_performance_indexes_and_jsonb_gin.sql` | Criação idempotente de índices B-Tree em Foreign Keys, índices compostos de consulta e índices GIN para subitens em colunas JSONB. |
| `001_performance_indexes_rollback.sql` | Script de reversão (Rollback) limpo e seguro para reverter todos os índices criados na migração 001. |
| `002_verification_queries.sql` | Consultas analíticas (`EXPLAIN ANALYZE`, tamanho de índices e auditoria de FKs não indexadas). |

---

## 🚀 Como Aplicar no Supabase / PostgreSQL

### Opção 1: Via Supabase Dashboard (SQL Editor)
1. Acesse o painel do seu projeto Supabase.
2. Navegue até **SQL Editor** -> **New Query**.
3. Copie e cole o conteúdo de `001_performance_indexes_and_jsonb_gin.sql`.
4. Clique em **Run**.
5. Em seguida, execute as consultas de `002_verification_queries.sql` para auditar a criação.

### Opção 2: Via CLI / psql
```bash
psql "$DATABASE_URL" -f migrations/001_performance_indexes_and_jsonb_gin.sql
psql "$DATABASE_URL" -f migrations/002_verification_queries.sql
```

---

## 🛡️ Diretrizes de Zero-Downtime & Performance

1. **Idempotência**: Todos os comandos usam `IF NOT EXISTS` para permitir reexecução segura sem quebrar pipelines.
2. **PostgreSQL em Produção**: Em ambientes de altíssimo tráfego com tabelas volumosas, pode-se usar a sintaxe `CREATE INDEX CONCURRENTLY` (fora de bloco de transação).
3. **Colunas JSONB**: Índices GIN permitem que buscas usando o operador de contenção `@>` (ex: `WHERE itens @> '[{"codigo": "AF-001"}]'`) sejam executadas em milissegundos sem escanear a tabela inteira.
