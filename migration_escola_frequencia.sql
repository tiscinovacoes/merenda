-- SAGED — Migration: Escola com frequência
-- Execute no SQL Editor do Supabase

ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS attendance_avg NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS attendance_pct NUMERIC DEFAULT 0,
  ADD COLUMN IF NOT EXISTS grade_levels TEXT DEFAULT 'EF I + EF II',
  ADD COLUMN IF NOT EXISTS meals_per_day INTEGER DEFAULT 2,
  ADD COLUMN IF NOT EXISTS monthly_budget NUMERIC DEFAULT 0;

-- Atualiza dados de frequência por escola
UPDATE public.schools SET attendance_avg = 572, attendance_pct = 92, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 18500 WHERE name = 'EM Arlindo Lima';
UPDATE public.schools SET attendance_avg = 421, attendance_pct = 88, grade_levels = 'EF I', meals_per_day = 2, monthly_budget = 14200 WHERE name = 'EM Elpidio Reis';
UPDATE public.schools SET attendance_avg = 698, attendance_pct = 93, grade_levels = 'EF I + EF II', meals_per_day = 3, monthly_budget = 22500 WHERE name = 'EM Franklin Roosevelt';
UPDATE public.schools SET attendance_avg = 476, attendance_pct = 85, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 16800 WHERE name = 'EM Hercules Maymone';
UPDATE public.schools SET attendance_avg = 374, attendance_pct = 91, grade_levels = 'EF I', meals_per_day = 2, monthly_budget = 12300 WHERE name = 'EM Jose Rodrigues Benfica';
UPDATE public.schools SET attendance_avg = 482, attendance_pct = 93, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 15600 WHERE name = 'EM Kame Adania';
UPDATE public.schools SET attendance_avg = 332, attendance_pct = 87, grade_levels = 'EF I', meals_per_day = 2, monthly_budget = 11400 WHERE name = 'EM Licurgo de Oliveira Bastos';
UPDATE public.schools SET attendance_avg = 641, attendance_pct = 93, grade_levels = 'EF I + EF II', meals_per_day = 3, monthly_budget = 20700 WHERE name = 'EM Professora Goncalina Faustina';
UPDATE public.schools SET attendance_avg = 381, attendance_pct = 89, grade_levels = 'EF I', meals_per_day = 2, monthly_budget = 12900 WHERE name = 'EM Nerone Maiolino';
UPDATE public.schools SET attendance_avg = 497, attendance_pct = 92, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 16200 WHERE name = 'EM Plinio Mendes dos Santos';
UPDATE public.schools SET attendance_avg = 325, attendance_pct = 88, grade_levels = 'EF I', meals_per_day = 2, monthly_budget = 11100 WHERE name = 'EM Padre Tomaz Ghirardelli';
UPDATE public.schools SET attendance_avg = 463, attendance_pct = 91, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 15300 WHERE name = 'EM Rita Caceres Mendonca';
UPDATE public.schools SET attendance_avg = 421, attendance_pct = 92, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 13800 WHERE name = 'EM Nagib Raslan';
UPDATE public.schools SET attendance_avg = 541, attendance_pct = 92, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 17700 WHERE name = 'EM Nazira Anache';
UPDATE public.schools SET attendance_avg = 563, attendance_pct = 88, grade_levels = 'EF I + EF II', meals_per_day = 3, monthly_budget = 19200 WHERE name = 'EM Professor Arassuay G. de Castro';
UPDATE public.schools SET attendance_avg = 323, attendance_pct = 92, grade_levels = 'EF I', meals_per_day = 2, monthly_budget = 10500 WHERE name = 'EM Sulivan Silvestre Oliveira';
UPDATE public.schools SET attendance_avg = 441, attendance_pct = 92, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 14400 WHERE name = 'EM Irma Edith Coelho Netto';
UPDATE public.schools SET attendance_avg = 461, attendance_pct = 87, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 15900 WHERE name = 'EM Elizio Ramirez Vieira';
UPDATE public.schools SET attendance_avg = 431, attendance_pct = 92, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 14100 WHERE name = 'EM Professora Arlene M. Almeida';
UPDATE public.schools SET attendance_avg = 553, attendance_pct = 92, grade_levels = 'EF I + EF II', meals_per_day = 2, monthly_budget = 18000 WHERE name = 'EM Academico Antonio Delfino Pereira';

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

-- Seed: registros de consumo (EM Arlindo Lima — últimas 2 semanas)
INSERT INTO public.consumption_records (school, product_name, meal_type, quantity, unit, date, responsible) VALUES
('EM Arlindo Lima','Arroz Tipo 1','Almoco',42,'kg','2026-06-24','Maria Santos'),
('EM Arlindo Lima','Feijao Carioca','Almoco',18,'kg','2026-06-24','Maria Santos'),
('EM Arlindo Lima','Banana Nanica','Lanche',25,'kg','2026-06-24','Ana Costa'),
('EM Arlindo Lima','Frango Coxa Sobrecoxa','Almoco',35,'kg','2026-06-23','Maria Santos'),
('EM Arlindo Lima','Leite Integral','Lanche',48,'L','2026-06-23','Ana Costa'),
('EM Arlindo Lima','Arroz Tipo 1','Almoco',40,'kg','2026-06-23','Maria Santos'),
('EM Arlindo Lima','Feijao Carioca','Almoco',17,'kg','2026-06-23','Maria Santos'),
('EM Arlindo Lima','Tomate','Almoco',12,'kg','2026-06-22','Maria Santos'),
('EM Arlindo Lima','Cenoura','Almoco',15,'kg','2026-06-22','Maria Santos'),
('EM Arlindo Lima','Maca Fuji','Lanche',22,'kg','2026-06-21','Ana Costa'),
('EM Arlindo Lima','Arroz Tipo 1','Almoco',43,'kg','2026-06-21','Maria Santos'),
('EM Arlindo Lima','Mandioca','Almoco',28,'kg','2026-06-20','Maria Santos'),
('EM Arlindo Lima','Leite Integral','Lanche',50,'L','2026-06-20','Ana Costa'),
('EM Arlindo Lima','Banana Nanica','Lanche',24,'kg','2026-06-19','Ana Costa'),
('EM Hercules Maymone','Arroz Tipo 1','Almoco',38,'kg','2026-06-24','Carlos Pereira'),
('EM Hercules Maymone','Feijao Carioca','Almoco',15,'kg','2026-06-24','Carlos Pereira'),
('EM Franklin Roosevelt','Arroz Tipo 1','Almoco',55,'kg','2026-06-24','Ana Costa'),
('EM Franklin Roosevelt','Frango Coxa Sobrecoxa','Almoco',42,'kg','2026-06-24','Ana Costa');

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

-- Seed: frequência EM Arlindo Lima (últimos 14 dias úteis)
INSERT INTO public.attendance_records (school, date, enrolled, present, absent, pct) VALUES
('EM Arlindo Lima','2026-06-24',620,572,48,92),
('EM Arlindo Lima','2026-06-23',620,568,52,92),
('EM Arlindo Lima','2026-06-20',620,583,37,94),
('EM Arlindo Lima','2026-06-19',620,561,59,90),
('EM Arlindo Lima','2026-06-18',620,576,44,93),
('EM Arlindo Lima','2026-06-17',620,558,62,90),
('EM Arlindo Lima','2026-06-16',620,590,30,95),
('EM Arlindo Lima','2026-06-13',620,549,71,89),
('EM Arlindo Lima','2026-06-12',620,571,49,92),
('EM Arlindo Lima','2026-06-11',620,564,56,91),
('EM Arlindo Lima','2026-06-10',620,577,43,93),
('EM Arlindo Lima','2026-06-09',620,542,78,87),
('EM Arlindo Lima','2026-06-06',620,588,32,95),
('EM Arlindo Lima','2026-06-05',620,553,67,89);
