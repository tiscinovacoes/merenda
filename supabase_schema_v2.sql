-- ============================================================
-- SUALE / Vigia Educa — Schema & Seed SQL v2.0.0
-- Script de Reestruturação Supabase — 8 Escolas Piloto
-- Cole este script no SQL Editor do Supabase e clique em Run
-- ============================================================

-- 1. LIMPEZA DE TABELAS DUPLICADAS / OBSOLETAS
DROP TABLE IF EXISTS public.consumption_records CASCADE;
DROP TABLE IF EXISTS public.pedidos CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.planejamento_alimentar CASCADE;
DROP TABLE IF EXISTS public.estoque_central CASCADE;
DROP TABLE IF EXISTS public.estoque_escolas CASCADE;
DROP TABLE IF EXISTS public.cardapios CASCADE;
DROP TABLE IF EXISTS public.alunos CASCADE;
DROP TABLE IF EXISTS public.schools CASCADE;

-- ── 2. TABELA: schools (Apenas as 8 Escolas do Piloto) ───────
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
CREATE POLICY "anon_sel_schools" ON public.schools FOR SELECT USING (true);
CREATE POLICY "anon_ins_schools" ON public.schools FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_upd_schools" ON public.schools FOR UPDATE USING (true);

INSERT INTO public.schools (id, name, region, director, students, stock_status, last_delivery, stock_pct, attendance_avg, attendance_pct, grade_levels, meals_per_day, monthly_budget, address, phone) VALUES
(1, 'EM Arlindo Lima', 'Anhanduizinho', 'Maria Santos', 620, 'ok', '2026-07-28', 82, 572, 92, 'EF I + EF II', 2, 18500.00, 'R. Pedro Celestino, 1200 - Centro', '(67) 3314-9001'),
(2, 'EM Elpidio Reis', 'Bandeira', 'Joao Oliveira', 480, 'warning', '2026-07-25', 38, 421, 88, 'EF I', 2, 14200.00, 'Av. Cafezais, 450 - Mata do Jacinto', '(67) 3314-9002'),
(3, 'EM Franklin Roosevelt', 'Centro', 'Ana Costa', 750, 'ok', '2026-07-30', 91, 698, 93, 'EF I + EF II', 3, 22500.00, 'R. 13 de Maio, 890 - Centro', '(67) 3314-9003'),
(4, 'EM Hercules Maymone', 'Imbirussu', 'Carlos Pereira', 560, 'danger', '2026-07-20', 15, 476, 85, 'EF I + EF II', 2, 16800.00, 'R. Joana D’Arc, 210 - Vila Palmira', '(67) 3314-9004'),
(5, 'EM Jose Rodrigues Benfica', 'Lagoa', 'Fernanda Lima', 410, 'ok', '2026-07-27', 75, 374, 91, 'EF I', 2, 12300.00, 'R. Amambai, 340 - Jardim Tijuca', '(67) 3314-9005'),
(6, 'EM Kame Adania', 'Prosa', 'Roberto Alves', 520, 'ok', '2026-07-29', 88, 482, 93, 'EF I + EF II', 2, 15600.00, 'Av. Noroeste, 1150 - Carandá Bosque', '(67) 3314-9006'),
(7, 'EM Licurgo de Oliveira Bastos', 'Segredo', 'Patricia Souza', 380, 'warning', '2026-07-22', 42, 332, 87, 'EF I', 2, 11400.00, 'R. Tamandaré, 560 - Vila Nasser', '(67) 3314-9007'),
(8, 'EM Professora Goncalina Faustina', 'Anhanduizinho', 'Marcos Silva', 690, 'ok', '2026-07-31', 95, 641, 93, 'EF I + EF II', 3, 20700.00, 'R. Guaicurus, 780 - Jardim Centenário', '(67) 3314-9008');

-- Adjust sequence for schools
SELECT setval('schools_id_seq', (SELECT MAX(id) FROM public.schools));

-- ── 3. TABELA: orders (Pedidos de Abastecimento) ────────────
CREATE TABLE public.orders (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Pendente', -- Pendente, Em análise, Aceito, Em separação, Em transporte, Entregue, Cancelado
  cooperative TEXT,
  value NUMERIC(12,2) DEFAULT 0.00,
  items JSONB DEFAULT '[]'::jsonb,
  justification TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "anon_ins_orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_upd_orders" ON public.orders FOR UPDATE USING (true);

INSERT INTO public.orders (school_id, school_name, date, status, cooperative, value, items, justification) VALUES
(4, 'EM Hercules Maymone', '2026-08-01', 'Pendente', 'COOPAGRAN', 8500.00, '[{"product":"Arroz Tipo 1","qty":300,"unit":"kg"},{"product":"Feijao Carioca","qty":150,"unit":"kg"}]'::jsonb, 'Estoque abaixo de 15% - Necessidade emergencial'),
(2, 'EM Elpidio Reis', '2026-08-02', 'Em separação', 'COOPRAN', 6800.00, '[{"product":"Banana Nanica","qty":200,"unit":"kg"},{"product":"Leite Integral","qty":400,"unit":"L"}]'::jsonb, 'Reposição semanal de perecíveis'),
(7, 'EM Licurgo de Oliveira Bastos', '2026-08-03', 'Em transporte', 'COOPASUL', 5400.00, '[{"product":"Carne Bovina Acem","qty":120,"unit":"kg"},{"product":"Tomate","qty":100,"unit":"kg"}]'::jsonb, 'Atendimento ao planejamento semanal'),
(1, 'EM Arlindo Lima', '2026-07-28', 'Entregue', 'COOPAGRAN', 14850.00, '[{"product":"Arroz Tipo 1","qty":500,"unit":"kg"},{"product":"Frango Coxa Sobrecoxa","qty":350,"unit":"kg"}]'::jsonb, 'Entrega mensal consolidada');

-- ── 4. TABELA: planejamento_alimentar ────────────────────────
CREATE TABLE public.planejamento_alimentar (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL, -- Cafe da Manha, Lanche, Almoco, Jantar
  ficha_tecnica_id INTEGER,
  menu_name TEXT NOT NULL,
  expected_students INTEGER NOT NULL DEFAULT 0,
  ingredients_summary JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'Publicado', -- Rascunho, Aprovado, Publicado
  created_by TEXT DEFAULT 'Nutricionista SEMED',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.planejamento_alimentar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_planejamento" ON public.planejamento_alimentar FOR SELECT USING (true);
CREATE POLICY "anon_ins_planejamento" ON public.planejamento_alimentar FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_upd_planejamento" ON public.planejamento_alimentar FOR UPDATE USING (true);

INSERT INTO public.planejamento_alimentar (school_id, school_name, date, meal_type, menu_name, expected_students, ingredients_summary, status) VALUES
(1, 'EM Arlindo Lima', '2026-08-04', 'Almoco', 'Arroz com Feijao Tradicional e Frango Grelhado', 570, '[{"product":"Arroz Tipo 1","qty":45.6},{"product":"Feijao Carioca","qty":22.8},{"product":"Frango Coxa Sobrecoxa","qty":68.4}]'::jsonb, 'Publicado'),
(1, 'EM Arlindo Lima', '2026-08-04', 'Lanche', 'Vitamina de Banana com Pao Integral', 570, '[{"product":"Banana Nanica","qty":51.3},{"product":"Leite Integral","qty":114.0}]'::jsonb, 'Publicado'),
(3, 'EM Franklin Roosevelt', '2026-08-04', 'Almoco', 'Galinhada com Salada de Alface e Tomate', 700, '[{"product":"Arroz Tipo 1","qty":56.0},{"product":"Frango Coxa Sobrecoxa","qty":84.0},{"product":"Tomate","qty":21.0}]'::jsonb, 'Publicado'),
(4, 'EM Hercules Maymone', '2026-08-04', 'Almoco', 'Macarronada com Carne Moida (Acem)', 470, '[{"product":"Macarrao Espaguete","qty":37.6},{"product":"Carne Bovina Acem","qty":47.0}]'::jsonb, 'Publicado');

-- ── 5. TABELAS: estoque_central & estoque_escolas ─────────────
CREATE TABLE public.estoque_central (
  id SERIAL PRIMARY KEY,
  product_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  quantity NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  min_quantity NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  status TEXT DEFAULT 'ok', -- ok, warning, danger
  expiration_date DATE,
  lots JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.estoque_central ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_est_central" ON public.estoque_central FOR SELECT USING (true);
CREATE POLICY "anon_all_est_central" ON public.estoque_central FOR ALL USING (true);

INSERT INTO public.estoque_central (product_name, category, unit, quantity, min_quantity, status, expiration_date, lots) VALUES
('Arroz Tipo 1', 'Graos', 'kg', 12500.00, 2000.00, 'ok', '2027-02-15', '[{"lote":"L-ARR-2026/01","qtd":8000,"validade":"2027-02-15"},{"lote":"L-ARR-2026/02","qtd":4500,"validade":"2027-04-10"}]'::jsonb),
('Feijao Carioca', 'Graos', 'kg', 4200.00, 1000.00, 'ok', '2026-12-20', '[{"lote":"L-FEJ-2026/01","qtd":4200,"validade":"2026-12-20"}]'::jsonb),
('Leite Integral', 'Laticinios', 'L', 8900.00, 1500.00, 'ok', '2026-09-10', '[{"lote":"L-LEI-2026/05","qtd":8900,"validade":"2026-09-10"}]'::jsonb),
('Frango Coxa Sobrecoxa', 'Proteinas', 'kg', 5600.00, 1200.00, 'ok', '2026-08-30', '[{"lote":"L-FRA-2026/03","qtd":5600,"validade":"2026-08-30"}]'::jsonb),
('Banana Nanica', 'Frutas', 'kg', 1800.00, 800.00, 'warning', '2026-08-08', '[{"lote":"L-BAN-2026/12","qtd":1800,"validade":"2026-08-08"}]'::jsonb);

CREATE TABLE public.estoque_escolas (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT DEFAULT 'Geral',
  unit TEXT NOT NULL DEFAULT 'kg',
  quantity NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  min_quantity NUMERIC(12,2) NOT NULL DEFAULT 10.00,
  status TEXT DEFAULT 'ok', -- ok, warning, danger
  next_expiration DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.estoque_escolas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_est_escolas" ON public.estoque_escolas FOR SELECT USING (true);
CREATE POLICY "anon_all_est_escolas" ON public.estoque_escolas FOR ALL USING (true);

INSERT INTO public.estoque_escolas (school_id, school_name, product_name, category, unit, quantity, min_quantity, status, next_expiration) VALUES
(1, 'EM Arlindo Lima', 'Arroz Tipo 1', 'Graos', 'kg', 450.00, 80.00, 'ok', '2027-02-15'),
(1, 'EM Arlindo Lima', 'Feijao Carioca', 'Graos', 'kg', 180.00, 40.00, 'ok', '2026-12-20'),
(1, 'EM Arlindo Lima', 'Banana Nanica', 'Frutas', 'kg', 95.00, 30.00, 'ok', '2026-08-08'),
(4, 'EM Hercules Maymone', 'Arroz Tipo 1', 'Graos', 'kg', 25.00, 80.00, 'danger', '2027-02-15'),
(4, 'EM Hercules Maymone', 'Feijao Carioca', 'Graos', 'kg', 12.00, 40.00, 'danger', '2026-12-20'),
(2, 'EM Elpidio Reis', 'Leite Integral', 'Laticinios', 'L', 45.00, 100.00, 'warning', '2026-09-10');

-- ── 6. TABELA: cardapios ─────────────────────────────────────
CREATE TABLE public.cardapios (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  modality TEXT NOT NULL DEFAULT 'EF I + EF II', -- EF I, EF II, EMEI, EJA
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Vigente', -- Vigente, Historico, Rascunho
  nutritionist_name TEXT DEFAULT 'Dra. Lilian Droppa',
  weekly_data JSONB DEFAULT '{}'::jsonb,
  avg_kcal INTEGER DEFAULT 450,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.cardapios ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_cardapios" ON public.cardapios FOR SELECT USING (true);
CREATE POLICY "anon_all_cardapios" ON public.cardapios FOR ALL USING (true);

INSERT INTO public.cardapios (title, modality, period_start, period_end, status, nutritionist_name, weekly_data, avg_kcal) VALUES
('Cardapio Padrao Agosto 2026 - Ensino Fundamental', 'EF I + EF II', '2026-08-01', '2026-08-31', 'Vigente', 'Dra. Lilian Droppa', '{"segunda":{"almoco":"Arroz, Feijao, Frango Grelhado, Salada"},"terca":{"almoco":"Galinhada, Maioba, Melancia"},"quarta":{"almoco":"Macarronada a Bolonhesa, Fruta"},"quinta":{"almoco":"Arroz, Feijao, Carne Ensopada com Mandioca"},"sexta":{"almoco":"Risoto de Frango, Salada de Alface e Tomate"}}'::jsonb, 465),
('Cardapio Julho 2026 - Ensino Fundamental', 'EF I + EF II', '2026-07-01', '2026-07-31', 'Historico', 'Dra. Lilian Droppa', '{"segunda":{"almoco":"Arroz, Feijao, Ovos Mexidos"},"terca":{"almoco":"Sopa de Ervilha com Carne"},"quarta":{"almoco":"Arroz, Feijao, Polenta com Frango"}}'::jsonb, 440);

-- ── 7. TABELA: alunos ────────────────────────────────────────
CREATE TABLE public.alunos (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES public.schools(id) ON DELETE CASCADE,
  school_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  grade_level TEXT NOT NULL, -- 1º Ano, 2º Ano, etc.
  age_group TEXT NOT NULL, -- 1 a 3 anos, 4 a 5 anos, 6 a 10 anos, 11 a 15 anos
  shift TEXT NOT NULL DEFAULT 'Matutino', -- Matutino, Vespertino, Integral
  dietary_restriction TEXT DEFAULT 'Nenhuma', -- Nenhuma, Intolerancia a Lactose, Diabetes, Celíaco, Alergia a Ovo
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.alunos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_alunos" ON public.alunos FOR SELECT USING (true);
CREATE POLICY "anon_all_alunos" ON public.alunos FOR ALL USING (true);

INSERT INTO public.alunos (school_id, school_name, student_name, grade_level, age_group, shift, dietary_restriction) VALUES
(1, 'EM Arlindo Lima', 'Gabriel Souza Silva', '4º Ano A', '6 a 10 anos', 'Matutino', 'Nenhuma'),
(1, 'EM Arlindo Lima', 'Beatriz Lima Santos', '5º Ano B', '6 a 10 anos', 'Vespertino', 'Intolerancia a Lactose'),
(1, 'EM Arlindo Lima', 'Lucas Ferreira Rocha', '2º Ano A', '6 a 10 anos', 'Matutino', 'Diabetes'),
(3, 'EM Franklin Roosevelt', 'Mariana Alves Costa', '7º Ano C', '11 a 15 anos', 'Integral', 'Nenhuma'),
(3, 'EM Franklin Roosevelt', 'Enzo Gabriel Oliveira', '6º Ano A', '11 a 15 anos', 'Matutino', 'Celíaco'),
(4, 'EM Hercules Maymone', 'Sophia Martins Ribeiro', '3º Ano B', '6 a 10 anos', 'Vespertino', 'Alergia a Ovo'),
(8, 'EM Professora Goncalina Faustina', 'Pedro Henrique Barbosa', '8º Ano A', '11 a 15 anos', 'Integral', 'Nenhuma');

-- ============================================================
-- SCRIPT CONCLUÍDO COM SUCESSO!
-- As 8 escolas do teste piloto e todas as 6 tabelas estão ativas.
-- ============================================================
