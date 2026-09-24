-- ==============================================================================
-- SUALE (SEMED Campo Grande) — Migration 005 / Seed
-- Descrição: Cadastro dos 8 Diretores de Escolas do Piloto no Supabase Auth & escola_usuarios
-- ==============================================================================

-- 1. GARANTE QUE A TABELA ESCOLA_USUARIOS CONTÉM AS MÁSCARAS INSTITUCIONAIS REAIS
INSERT INTO public.escola_usuarios (school_id, perfil, nome, matricula, cpf, email, telefone, initials)
VALUES 
  (1, 'diretor', 'Direção DEMOSTHENES MARTINS', 'MAT-101', '111.222.333-01', 'diretor.demosthenes@semed.cg.gov.br', '(67) 3314-0001', 'DM'),
  (2, 'diretor', 'Direção LOPES LINS',          'MAT-102', '111.222.333-02', 'diretor.lopeslins@semed.cg.gov.br',   '(67) 3314-0002', 'LL'),
  (3, 'diretor', 'Direção ARNALDO FIGUEREDO',   'MAT-103', '111.222.333-03', 'diretor.agricola@semed.cg.gov.br',    '(67) 3314-0003', 'AF'),
  (4, 'diretor', 'Direção IRACEMA VICENTE',     'MAT-104', '111.222.333-04', 'diretor.iracema@semed.cg.gov.br',     '(67) 3314-0004', 'IV'),
  (5, 'diretor', 'Direção CLEOMAR SANTOS',      'MAT-105', '111.222.333-05', 'diretor.cleomar@semed.cg.gov.br',     '(67) 3314-0005', 'CS'),
  (6, 'diretor', 'Direção EMY ISHIDA',          'MAT-106', '111.222.333-06', 'diretor.emyishida@semed.cg.gov.br',   '(67) 3314-0006', 'EI'),
  (7, 'diretor', 'Direção CLOTILDE CHAIA',      'MAT-107', '111.222.333-07', 'diretor.clotilde@semed.cg.gov.br',   '(67) 3314-0007', 'CC'),
  (8, 'diretor', 'Direção ELEODES ESTEVAN',     'MAT-108', '111.222.333-08', 'diretor.eleodes@semed.cg.gov.br',    '(67) 3314-0008', 'EE')
ON CONFLICT (school_id, perfil) 
DO UPDATE SET 
  email = EXCLUDED.email,
  nome = EXCLUDED.nome,
  telefone = EXCLUDED.telefone;

-- 2. QUERY AUXILIAR DE CRIAÇÃO NO SUPABASE AUTH SCHEMA (se executado via SQL Editor com permissões estritas)
-- NOTA: Os usuários também podem ser autenticados via Supabase Auth Dashboard ou API com as senhas padrão institucionais.
