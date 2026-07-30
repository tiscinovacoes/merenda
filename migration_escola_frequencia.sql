-- SUALE — Migration: Escola com frequência
-- Execute no SQL Editor do Supabase

ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS attendance_avg NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS attendance_pct NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS grade_levels TEXT DEFAULT 'EF I + EF II',
  ADD COLUMN IF NOT EXISTS meals_per_day INTEGER DEFAULT 2,
  ADD COLUMN IF NOT EXISTS monthly_budget NUMERIC DEFAULT 0;

-- Atualiza dados de frequência por escola
UPDATE public.schools SET attendance_avg = 413, attendance_pct = 91, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 12500 WHERE name = 'EM ADV. DEMOSTHENES MARTINS';
UPDATE public.schools SET attendance_avg = 1494, attendance_pct = 88, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 45000 WHERE name = 'EM PROF. ANTÔNIO LOPES LINS';
UPDATE public.schools SET attendance_avg = 410, attendance_pct = 94, grade_levels = 'EF I + EF II + EM', meals_per_day = 4, monthly_budget = 22000 WHERE name = 'EMRTI AGRICOLA GOVERNADOR ARNALDO ESTEVAO DE FIGUEREDO';
UPDATE public.schools SET attendance_avg = 463, attendance_pct = 86, grade_levels = 'EF I + EF II', meals_per_day = 4, monthly_budget = 28000 WHERE name = 'EMTI PROFª IRACEMA MARIA VICENTE';
UPDATE public.schools SET attendance_avg = 115, attendance_pct = 90, grade_levels = 'Maternal + Pré-escola', meals_per_day = 4, monthly_budget = 8500 WHERE name = 'EMEI CLEOMAR BAPTISTA DOS SANTOS';
UPDATE public.schools SET attendance_avg = 176, attendance_pct = 92, grade_levels = 'Maternal + Pré-escola', meals_per_day = 4, monthly_budget = 11000 WHERE name = 'EMEI PROFª EMY ISHIDA NASCIMENTO NOGUEIRA';
UPDATE public.schools SET attendance_avg = 171, attendance_pct = 89, grade_levels = 'Maternal + Pré-escola', meals_per_day = 4, monthly_budget = 11200 WHERE name = 'EMEI CLOTILDE CHAIA';
UPDATE public.schools SET attendance_avg = 329, attendance_pct = 93, grade_levels = 'Maternal + Pré-escola', meals_per_day = 4, monthly_budget = 19500 WHERE name = 'EMEI ELEODES ESTEVAN';






















-- Tabela de registros de consumo
CREATE TABLE IF NOT EXISTS public.consumption_records (
  id SERIAL PRIMARY KEY,
  school_id INTEGER REFERENCES public.schools(id) ON DELETE CASCADE,
  school TEXT NOT NULL,
  product_name TEXT NOT NULL,
  meal_type TEXT DEFAULT 'Almoco',
  quantity NUMERIC DEFAULT 0,
  unit TEXT DEFAULT 'kg',
  date DATE DEFAULT CURRENT_DATE,
  responsible TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.consumption_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_consumption" ON public.consumption_records FOR SELECT USING (true);
CREATE POLICY "anon_ins_consumption" ON public.consumption_records FOR INSERT WITH CHECK (true);

-- Seed: registros de consumo (EM ADV. DEMOSTHENES MARTINS — últimas 2 semanas)
INSERT INTO public.consumption_records (school, product_name, meal_type, quantity, unit, date, responsible) VALUES
('EM ADV. DEMOSTHENES MARTINS','Arroz Tipo 1','Almoco',42,'kg','2026-06-24','Maria Santos'),
('EM ADV. DEMOSTHENES MARTINS','Feijao Carioca','Almoco',18,'kg','2026-06-24','Maria Santos'),
('EM ADV. DEMOSTHENES MARTINS','Banana Nanica','Lanche',25,'kg','2026-06-24','Ana Costa'),
('EM ADV. DEMOSTHENES MARTINS','Frango Coxa Sobrecoxa','Almoco',35,'kg','2026-06-23','Maria Santos'),
('EM ADV. DEMOSTHENES MARTINS','Leite Integral','Lanche',48,'L','2026-06-23','Ana Costa'),
('EM ADV. DEMOSTHENES MARTINS','Arroz Tipo 1','Almoco',40,'kg','2026-06-23','Maria Santos'),
('EM ADV. DEMOSTHENES MARTINS','Feijao Carioca','Almoco',17,'kg','2026-06-23','Maria Santos'),
('EM ADV. DEMOSTHENES MARTINS','Tomate','Almoco',12,'kg','2026-06-22','Maria Santos'),
('EM ADV. DEMOSTHENES MARTINS','Cenoura','Almoco',15,'kg','2026-06-22','Maria Santos'),
('EM ADV. DEMOSTHENES MARTINS','Maca Fuji','Lanche',22,'kg','2026-06-21','Ana Costa'),
('EM ADV. DEMOSTHENES MARTINS','Arroz Tipo 1','Almoco',43,'kg','2026-06-21','Maria Santos'),
('EM ADV. DEMOSTHENES MARTINS','Mandioca','Almoco',28,'kg','2026-06-20','Maria Santos'),
('EM ADV. DEMOSTHENES MARTINS','Leite Integral','Lanche',50,'L','2026-06-20','Ana Costa'),
('EM ADV. DEMOSTHENES MARTINS','Banana Nanica','Lanche',24,'kg','2026-06-19','Ana Costa'),
('EMTI PROFª IRACEMA MARIA VICENTE','Arroz Tipo 1','Almoco',38,'kg','2026-06-24','Carlos Pereira'),
('EMTI PROFª IRACEMA MARIA VICENTE','Feijao Carioca','Almoco',15,'kg','2026-06-24','Carlos Pereira'),
('EMRTI AGRICOLA GOVERNADOR ARNALDO ESTEVAO DE FIGUEREDO','Arroz Tipo 1','Almoco',55,'kg','2026-06-24','Ana Costa'),
('EMRTI AGRICOLA GOVERNADOR ARNALDO ESTEVAO DE FIGUEREDO','Frango Coxa Sobrecoxa','Almoco',42,'kg','2026-06-24','Ana Costa');

-- Tabela de frequência diária
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id SERIAL PRIMARY KEY,
  school TEXT NOT NULL,
  date DATE NOT NULL,
  enrolled INTEGER DEFAULT 0,
  present INTEGER DEFAULT 0,
  absent INTEGER DEFAULT 0,
  pct NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_attendance" ON public.attendance_records FOR SELECT USING (true);
CREATE POLICY "anon_ins_attendance" ON public.attendance_records FOR INSERT WITH CHECK (true);

-- Seed: frequência EM ADV. DEMOSTHENES MARTINS (últimos 14 dias úteis)
INSERT INTO public.attendance_records (school, date, enrolled, present, absent, pct) VALUES
('EM ADV. DEMOSTHENES MARTINS','2026-06-24',620,572,48,92),
('EM ADV. DEMOSTHENES MARTINS','2026-06-23',620,568,52,92),
('EM ADV. DEMOSTHENES MARTINS','2026-06-20',620,583,37,94),
('EM ADV. DEMOSTHENES MARTINS','2026-06-19',620,561,59,90),
('EM ADV. DEMOSTHENES MARTINS','2026-06-18',620,576,44,93),
('EM ADV. DEMOSTHENES MARTINS','2026-06-17',620,558,62,90),
('EM ADV. DEMOSTHENES MARTINS','2026-06-16',620,590,30,95),
('EM ADV. DEMOSTHENES MARTINS','2026-06-13',620,549,71,89),
('EM ADV. DEMOSTHENES MARTINS','2026-06-12',620,571,49,92),
('EM ADV. DEMOSTHENES MARTINS','2026-06-11',620,564,56,91),
('EM ADV. DEMOSTHENES MARTINS','2026-06-10',620,577,43,93),
('EM ADV. DEMOSTHENES MARTINS','2026-06-09',620,542,78,87),
('EM ADV. DEMOSTHENES MARTINS','2026-06-06',620,588,32,95),
('EM ADV. DEMOSTHENES MARTINS','2026-06-05',620,553,67,89);
