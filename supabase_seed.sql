-- ============================================================
-- SUALE — Schema + Seed (tabelas principais)
-- Cole este arquivo no SQL Editor do Supabase e clique Run
-- https://supabase.com/dashboard/project/xszqqqyvdzoyxokkuqix/sql/new
-- ============================================================

-- ── schools ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.schools (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT,
  director TEXT,
  students INTEGER DEFAULT 0,
  stock_status TEXT DEFAULT 'ok',
  last_delivery DATE,
  stock_pct INTEGER DEFAULT 0
);
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_schools" ON public.schools FOR SELECT USING (true);

INSERT INTO public.schools (name, region, director, students, stock_status, last_delivery, stock_pct) VALUES
('EM ADV. DEMOSTHENES MARTINS','Segredo','Profa. Maria Amélia Santos',454,'ok','2026-07-10',82),
('EM PROF. ANTÔNIO LOPES LINS','Lagoa','Prof. João Carlos Oliveira',1698,'warning','2026-07-05',38),
('EMRTI AGRICOLA GOVERNADOR ARNALDO ESTEVAO DE FIGUEREDO','Rural','Profa. Ana Cristina Pereira',436,'ok','2026-07-12',91),
('EMTI PROFª IRACEMA MARIA VICENTE','Bandeira','Prof. Antônio Carlos Mendes',539,'danger','2026-06-28',15),
('EMEI CLEOMAR BAPTISTA DOS SANTOS','Anhanduizinho','Profa. Fernanda Lima Souza',128,'ok','2026-07-11',75),
('EMEI PROFª EMY ISHIDA NASCIMENTO NOGUEIRA','Prosa','Profa. Sandra Ishida Martins',191,'ok','2026-07-09',88),
('EMEI CLOTILDE CHAIA','Imbirussu','Profa. Patrícia da Silva Chaia',192,'warning','2026-07-02',42),
('EMEI ELEODES ESTEVAN','Centro','Prof. Roberto Estevan Filho',354,'ok','2026-07-14',95);

-- ── products ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT DEFAULT 'kg',
  stock NUMERIC DEFAULT 0,
  avg_consume NUMERIC DEFAULT 0,
  days_left INTEGER DEFAULT 0,
  family_farm BOOLEAN DEFAULT false
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_products" ON public.products FOR SELECT USING (true);

INSERT INTO public.products (name, category, unit, stock, avg_consume, days_left, family_farm) VALUES
('Arroz Tipo 1','Graos','kg',12500,850,14,false),
('Feijao Carioca','Graos','kg',4200,420,10,false),
('Banana Nanica','Frutas','kg',1800,600,3,true),
('Maca Fuji','Frutas','kg',2300,350,6,false),
('Alface Crespa','Hortalicas','kg',520,280,2,true),
('Tomate','Hortalicas','kg',1950,400,5,true),
('Cenoura','Hortalicas','kg',3100,310,10,true),
('Leite Integral','Laticinios','L',8900,1200,7,false),
('Frango Coxa Sobrecoxa','Proteinas','kg',5600,780,7,false),
('Carne Bovina Acem','Proteinas','kg',3200,520,6,false),
('Mandioca','Tuberculos','kg',4800,380,12,true),
('Batata Doce','Tuberculos','kg',2100,290,7,true),
('Ovo de Galinha','Proteinas','dz',3400,480,7,true),
('Oleo de Soja','Gorduras','L',2800,180,15,false),
('Acucar Cristal','Condimentos','kg',4500,250,18,false),
('Macarrao Espaguete','Graos','kg',3600,320,11,false),
('Abobora Cabotia','Hortalicas','kg',1400,260,5,true),
('Melancia','Frutas','kg',900,450,2,true),
('Farinha de Trigo','Graos','kg',5200,280,18,false),
('Leite em Po','Laticinios','kg',1800,150,12,false);

-- ── cooperatives ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.cooperatives (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  farmers_count INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  delivered INTEGER DEFAULT 0,
  rate NUMERIC DEFAULT 0,
  value NUMERIC DEFAULT 0
);
ALTER TABLE public.cooperatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_cooperatives" ON public.cooperatives FOR SELECT USING (true);

INSERT INTO public.cooperatives (name, farmers_count, orders, delivered, rate, value) VALUES
('COOPAGRAN',28,47,42,89,1450000),
('COOPRAN',19,35,33,94,980000),
('COOPAERGS',22,41,38,93,1120000),
('COOPASUL',15,28,24,86,720000),
('COOPERVIDA',12,22,21,95,540000);

-- ── farmers ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.farmers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  cooperative TEXT,
  products TEXT[],
  production NUMERIC DEFAULT 0,
  stock NUMERIC DEFAULT 0,
  area NUMERIC DEFAULT 0
);
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_farmers" ON public.farmers FOR SELECT USING (true);

INSERT INTO public.farmers (name, cooperative, products, production, stock, area) VALUES
('Jose Maria Rodrigues','COOPAGRAN',ARRAY['Mandioca','Banana Nanica','Abobora'],4500,1200,12),
('Antonio Carlos Pereira','COOPAGRAN',ARRAY['Tomate','Alface','Cenoura'],3200,800,8),
('Maria Aparecida Silva','COOPRAN',ARRAY['Ovo de Galinha','Mandioca'],5800,2100,15),
('Francisco Souza Lima','COOPAERGS',ARRAY['Batata Doce','Melancia','Abobora'],3800,900,10),
('Luzia Ferreira Santos','COOPAGRAN',ARRAY['Alface','Tomate','Cenoura','Abobora'],2900,700,6),
('Pedro Henrique Alves','COOPRAN',ARRAY['Banana Nanica','Melancia'],4100,1500,14),
('Ana Paula Martins','COOPAERGS',ARRAY['Mandioca','Batata Doce'],3500,1100,9),
('Raimundo da Costa','COOPASUL',ARRAY['Tomate','Cenoura','Alface'],2600,600,5),
('Sebastiao Oliveira','COOPASUL',ARRAY['Ovo de Galinha','Banana Nanica'],3900,1300,11),
('Terezinha Barbosa','COOPERVIDA',ARRAY['Abobora','Mandioca','Batata Doce'],4200,1000,13),
('Valdir Nascimento','COOPERVIDA',ARRAY['Melancia','Tomate'],2800,500,7),
('Cleusa Maria dos Santos','COOPAGRAN',ARRAY['Cenoura','Alface','Tomate'],3100,850,8),
('Gilberto Machado','COOPRAN',ARRAY['Mandioca','Abobora'],4600,1800,16),
('Rosalina Goncalves','COOPAERGS',ARRAY['Banana Nanica','Batata Doce','Melancia'],3400,950,10),
('Osvaldo Campos Neto','COOPASUL',ARRAY['Ovo de Galinha','Cenoura'],5200,2000,18);

-- ── contracts ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contracts (
  id SERIAL PRIMARY KEY,
  number TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  supplier TEXT,
  global_value NUMERIC DEFAULT 0,
  executed_value NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'Vigente'
);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_contracts" ON public.contracts FOR SELECT USING (true);

INSERT INTO public.contracts (number, start_date, end_date, supplier, global_value, executed_value, status) VALUES
('ATA-2026/001','2026-01-15','2026-12-31','COOPAGRAN',5200000,2860000,'Vigente'),
('ATA-2026/002','2026-02-01','2026-12-31','COOPRAN / COOPAERGS',4800000,2160000,'Vigente'),
('ATA-2025/018','2025-07-01','2026-06-30','Diversos (Pregao)',6500000,5850000,'Vigente'),
('CP-2026/003','2026-03-01','2027-02-28','COOPASUL / COOPERVIDA',1800000,540000,'Vigente');

-- ── orders ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  school TEXT NOT NULL,
  date DATE,
  status TEXT DEFAULT 'Pendente',
  cooperative TEXT,
  value NUMERIC DEFAULT 0
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_orders" ON public.orders FOR SELECT USING (true);

INSERT INTO public.orders (school, date, status, cooperative, value) VALUES
('EMTI PROFª IRACEMA MARIA VICENTE','2026-06-24','Pendente','COOPAGRAN',8500),
('EMEI CLOTILDE CHAIA','2026-06-24','Pendente','COOPRAN',7200),
('EMEI CLEOMAR BAPTISTA DOS SANTOS','2026-06-23','Em separacao','COOPAERGS',9100),
('EM PROF. ANTÔNIO LOPES LINS','2026-06-23','Em transporte','COOPAGRAN',6800),
('EMRTI AGRICOLA GOVERNADOR ARNALDO ESTEVAO DE FIGUEREDO','2026-06-22','Entregue','COOPASUL',5400),
('EMEI ELEODES ESTEVAN','2026-06-22','Entregue','COOPERVIDA',7600),
('EMEI PROFª EMY ISHIDA NASCIMENTO NOGUEIRA','2026-06-21','Entregue','COOPRAN',4900),
('EM ADV. DEMOSTHENES MARTINS','2026-06-20','Entregue','COOPAERGS',8200);

-- ── fichas_tecnicas ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fichas_tecnicas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  meal_type TEXT DEFAULT 'Almoco',
  ingredients JSONB DEFAULT '[]'::jsonb,
  kcal NUMERIC DEFAULT 0,
  rendimento TEXT DEFAULT '300g',
  coccao NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.fichas_tecnicas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_fichas" ON public.fichas_tecnicas FOR SELECT USING (true);
CREATE POLICY "anon_ins_fichas" ON public.fichas_tecnicas FOR INSERT WITH CHECK (true);

INSERT INTO public.fichas_tecnicas (name, meal_type, ingredients, kcal, rendimento, coccao) VALUES
('Arroz com Feijao Tradicional','Almoco','[{"name":"Arroz Tipo 1","bruto":80,"liquido":80,"fc":1.0,"costUnit":4.50}]'::jsonb,425,'300g',0.82),
('Frango Grelhado com Legumes','Almoco','[{"name":"Frango Coxa Sobrecoxa","bruto":130,"liquido":110,"fc":1.18,"costUnit":12.00}]'::jsonb,380,'280g',0.75),
('Vitamina de Banana','Lanche','[{"name":"Banana Nanica","bruto":90,"liquido":72,"fc":1.25,"costUnit":3.50}]'::jsonb,210,'250ml',1.0),
('Pao com Manteiga e Leite','Lanche','[{"name":"Pao Frances","bruto":50,"liquido":50,"fc":1.0,"costUnit":8.00}]'::jsonb,280,'200ml + 50g',1.0);
