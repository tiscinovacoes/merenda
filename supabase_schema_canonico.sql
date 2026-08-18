-- ============================================================
-- SUALE — SCHEMA SQL CANÔNICO & UNIFICADO (v2.6.0)
-- Sistema de Gestão da Alimentação Escolar · SEMED Campo Grande / MS
-- Consolidação integral de todas as tabelas, índices e seeds
-- ============================================================

-- 0. LIMPEZA SEGURA (ORDEM INVERSA DE DEPENDÊNCIAS)
DROP TABLE IF EXISTS public.os_fornecedores         CASCADE;
DROP TABLE IF EXISTS public.os_estoque_central      CASCADE;
DROP TABLE IF EXISTS public.lista_compras           CASCADE;
DROP TABLE IF EXISTS public.empenhos                CASCADE;
DROP TABLE IF EXISTS public.atas                    CASCADE;
DROP TABLE IF EXISTS public.contracts               CASCADE;
DROP TABLE IF EXISTS public.farmers                 CASCADE;
DROP TABLE IF EXISTS public.cooperatives            CASCADE;
DROP TABLE IF EXISTS public.restricoes_alimentares  CASCADE;
DROP TABLE IF EXISTS public.fichas_tecnicas         CASCADE;
DROP TABLE IF EXISTS public.escola_usuarios         CASCADE;
DROP TABLE IF EXISTS public.alunos                  CASCADE;
DROP TABLE IF EXISTS public.estoque_escolas         CASCADE;
DROP TABLE IF EXISTS public.planejamento_alimentar  CASCADE;
DROP TABLE IF EXISTS public.orders                  CASCADE;
DROP TABLE IF EXISTS public.pedidos                 CASCADE;
DROP TABLE IF EXISTS public.cardapios               CASCADE;
DROP TABLE IF EXISTS public.schools                 CASCADE;

-- ─────────────────────────────────────────────────────────────
-- 1. TABELA: schools (Unidades Escolares)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.schools (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  region TEXT NOT NULL,
  director TEXT NOT NULL,
  students INTEGER NOT NULL DEFAULT 0,
  stock_status TEXT NOT NULL DEFAULT 'ok',
  last_delivery DATE,
  stock_pct INTEGER NOT NULL DEFAULT 0,
  attendance_avg INTEGER DEFAULT 0,
  attendance_pct INTEGER DEFAULT 0,
  grade_levels TEXT DEFAULT 'EF I + EF II',
  meals_per_day INTEGER DEFAULT 2,
  monthly_budget NUMERIC(12,2) DEFAULT 0,
  modality TEXT DEFAULT 'Escolar Urbana (Regular)',
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_schools_all" ON public.schools FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.schools (id, name, region, director, students, stock_status, last_delivery, stock_pct, attendance_avg, attendance_pct, grade_levels, meals_per_day, monthly_budget, address, phone) VALUES
(1, 'EM ADV. DEMOSTHENES MARTINS', 'Segredo', 'Maria Santos', 454, 'ok', '2026-07-28', 82, 413, 91, 'EF I + EF II', 2, 12500.00, 'R. Pedro Celestino, 1200 - Centro', '(67) 3314-9001'),
(2, 'EM PROF. ANTÔNIO LOPES LINS', 'Lagoa', 'Joao Oliveira', 1698, 'warning', '2026-07-25', 38, 1494, 88, 'EF I + EF II', 2, 45000.00, 'Av. Cafezais, 450 - Mata do Jacinto', '(67) 3314-9002'),
(3, 'EMRTI AGRICOLA GOV. ARNALDO ESTEVAO DE FIGUEREDO', 'Rural', 'Ana Costa', 436, 'ok', '2026-07-30', 91, 410, 94, 'EF I + EF II + EM', 4, 22000.00, 'Rod. MS-040, km 22 - Campo Grande', '(67) 3314-9003'),
(4, 'EMTI PROFª IRACEMA MARIA VICENTE', 'Bandeira', 'Carlos Pereira', 539, 'danger', '2026-07-20', 15, 463, 86, 'EF I + EF II', 4, 28000.00, 'R. Joana D’Arc, 210 - Vila Palmira', '(67) 3314-9004'),
(5, 'EMEI CLEOMAR BAPTISTA DOS SANTOS', 'Anhanduizinho', 'Fernanda Lima', 128, 'ok', '2026-07-27', 75, 115, 90, 'Maternal + Pré-escola', 4, 8500.00, 'R. Amambai, 340 - Jardim Tijuca', '(67) 3314-9005'),
(6, 'EMEI PROFª EMY ISHIDA NASCIMENTO NOGUEIRA', 'Prosa', 'Roberto Alves', 191, 'ok', '2026-07-29', 88, 176, 92, 'Maternal + Pré-escola', 4, 11000.00, 'Av. Noroeste, 1150 - Carandá Bosque', '(67) 3314-9006'),
(7, 'EMEI CLOTILDE CHAIA', 'Imbirussu', 'Patricia Souza', 192, 'warning', '2026-07-22', 42, 171, 89, 'Maternal + Pré-escola', 4, 11200.00, 'R. Tamandaré, 560 - Vila Nasser', '(67) 3314-9007'),
(8, 'EMEI ELEODES ESTEVAN', 'Centro', 'Marcos Silva', 354, 'ok', '2026-07-31', 95, 329, 93, 'Maternal + Pré-escola', 4, 19500.00, 'R. Guaicurus, 780 - Centro', '(67) 3314-9008');

SELECT setval('schools_id_seq', (SELECT MAX(id) FROM public.schools));

-- ─────────────────────────────────────────────────────────────
-- 2. TABELA: orders (Pedidos de Abastecimento)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  cooperative TEXT DEFAULT 'COOPAGRAN',
  status TEXT NOT NULL DEFAULT 'Pendente',
  value NUMERIC(12,2) DEFAULT 0,
  solicitante TEXT DEFAULT 'Diretor',
  data_solicitacao DATE DEFAULT CURRENT_DATE,
  data_entrega_prevista DATE,
  items JSONB DEFAULT '[]'::jsonb,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_orders_all" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- 3. TABELA: restricoes_alimentares & alunos
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.restricoes_alimentares (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES public.schools(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  observacao TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  registrado_por TEXT DEFAULT 'Dra. Lilian Droppa',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.restricoes_alimentares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_restricoes_all" ON public.restricoes_alimentares FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.alunos (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES public.schools(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  turma TEXT,
  data_nascimento DATE,
  restricao TEXT NOT NULL,
  laudo TEXT,
  registrado_em DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_alunos_all" ON public.alunos FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- 4. TABELA: atas (Atas de Registro de Preços)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.atas (
  id SERIAL PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  ano INTEGER NOT NULL DEFAULT 2026,
  tipo TEXT NOT NULL DEFAULT 'Convencional',
  fornecedor TEXT NOT NULL,
  cnpj_cpf TEXT,
  objeto TEXT,
  modalidade TEXT DEFAULT 'Pregão Eletrônico',
  processo TEXT,
  valor_global NUMERIC(14,2) DEFAULT 0,
  valor_executado NUMERIC(14,2) DEFAULT 0,
  saldo_disponivel NUMERIC(14,2) GENERATED ALWAYS AS (valor_global - valor_executado) STORED,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Vigente',
  itens JSONB DEFAULT '[]'::jsonb,
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.atas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_atas_all" ON public.atas FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- 5. TABELA: empenhos (Empenhos Orçamentários SIAFI)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.empenhos (
  id SERIAL PRIMARY KEY,
  numero_empenho TEXT NOT NULL UNIQUE,
  ata_id INTEGER REFERENCES public.atas(id) ON DELETE SET NULL,
  ata_numero TEXT NOT NULL,
  tipo TEXT DEFAULT 'Conv.',
  fornecedor TEXT NOT NULL,
  escola_id INTEGER REFERENCES public.schools(id) ON DELETE SET NULL,
  escola_name TEXT DEFAULT 'SEMED Global',
  valor_empenhado NUMERIC(14,2) NOT NULL DEFAULT 0,
  valor_liquidado NUMERIC(14,2) NOT NULL DEFAULT 0,
  valor_pago NUMERIC(14,2) NOT NULL DEFAULT 0,
  saldo_a_liquidar NUMERIC(14,2) GENERATED ALWAYS AS (valor_empenhado - valor_liquidado) STORED,
  data_empenho DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Emitido',
  itens JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.empenhos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_empenhos_all" ON public.empenhos FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- 6. TABELAS: os_estoque_central & os_fornecedores & lista_compras
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.os_estoque_central (
  id SERIAL PRIMARY KEY,
  numero_os TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL DEFAULT 'Expedicao',
  destino_escola_id INTEGER REFERENCES public.schools(id) ON DELETE SET NULL,
  destino_escola_name TEXT NOT NULL,
  data_programada DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  itens JSONB DEFAULT '[]'::jsonb,
  motorista TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.os_estoque_central ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_os_central_all" ON public.os_estoque_central FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.os_fornecedores (
  id SERIAL PRIMARY KEY,
  numero_os TEXT NOT NULL UNIQUE,
  fornecedor TEXT NOT NULL,
  tipo_fornecedor TEXT DEFAULT 'Cooperativa',
  data_emissao DATE NOT NULL DEFAULT CURRENT_DATE,
  prazo_entrega DATE,
  status TEXT NOT NULL DEFAULT 'Emitida',
  itens JSONB DEFAULT '[]'::jsonb,
  valor_total NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.os_fornecedores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_os_forn_all" ON public.os_fornecedores FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.lista_compras (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  escola_id INTEGER REFERENCES public.schools(id) ON DELETE SET NULL,
  escola_name TEXT,
  mes_referencia TEXT DEFAULT '08/2026',
  valor_total NUMERIC(12,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Em elaboracao',
  itens JSONB DEFAULT '[]'::jsonb,
  criado_por TEXT DEFAULT 'Nutricionista',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.lista_compras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_lista_compras_all" ON public.lista_compras FOR ALL USING (true) WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────
-- 7. TABELAS: cooperatives & farmers
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.cooperatives (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  cnpj TEXT,
  president TEXT,
  phone TEXT,
  region TEXT DEFAULT 'Campo Grande e Região',
  farmers_count INTEGER DEFAULT 0,
  active_contracts INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cooperatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_cooperatives_all" ON public.cooperatives FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.farmers (
  id SERIAL PRIMARY KEY,
  cooperative_id INTEGER REFERENCES public.cooperatives(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  cpf TEXT,
  property_name TEXT,
  dap_caf TEXT,
  main_crops TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_farmers_all" ON public.farmers FOR ALL USING (true) WITH CHECK (true);

-- ── 8. ÍNDICES DE DESEMPENHO ─────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_school_id ON public.orders(school_id);
CREATE INDEX IF NOT EXISTS idx_empenhos_ata_id ON public.empenhos(ata_id);
CREATE INDEX IF NOT EXISTS idx_restricoes_school_id ON public.restricoes_alimentares(school_id);
CREATE INDEX IF NOT EXISTS idx_alunos_school_id ON public.alunos(school_id);
CREATE INDEX IF NOT EXISTS idx_os_central_escola ON public.os_estoque_central(destino_escola_id);
