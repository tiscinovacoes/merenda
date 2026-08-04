-- ============================================================
-- SUALE — Schema + Seed (Part 2 - Tabelas Financeiras, Estoque e Entregas)
-- ============================================================

-- -- deliveries ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deliveries (
  id SERIAL PRIMARY KEY,
  order_id INTEGER,
  school TEXT,
  date DATE,
  status TEXT,
  driver TEXT,
  photo_url TEXT
);
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_deliveries" ON public.deliveries FOR ALL USING (true);

-- -- incidents -------------------------------------------------
CREATE TABLE IF NOT EXISTS public.incidents (
  id SERIAL PRIMARY KEY,
  school TEXT,
  description TEXT,
  type TEXT,
  status TEXT DEFAULT 'Aberta',
  created_at TIMESTAMPTZ DEFAULT now(),
  photo_url TEXT
);
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_incidents" ON public.incidents FOR ALL USING (true);

-- -- productions (Agricultores) ------------------------------
CREATE TABLE IF NOT EXISTS public.productions (
  id SERIAL PRIMARY KEY,
  farmer TEXT,
  product TEXT,
  area NUMERIC,
  expected NUMERIC,
  available NUMERIC,
  status TEXT
);
ALTER TABLE public.productions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_productions" ON public.productions FOR ALL USING (true);

-- -- stock_adjusts ------------------------------------------
CREATE TABLE IF NOT EXISTS public.stock_adjusts (
  id SERIAL PRIMARY KEY,
  school TEXT,
  product TEXT,
  qty NUMERIC,
  reason TEXT,
  user_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.stock_adjusts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_stock_adjusts" ON public.stock_adjusts FOR ALL USING (true);

-- -- menus --------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menus (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  items JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_menus" ON public.menus FOR ALL USING (true);

-- -- weekly_menus -------------------------------------------
CREATE TABLE IF NOT EXISTS public.weekly_menus (
  id SERIAL PRIMARY KEY,
  week TEXT,
  days JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.weekly_menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_weekly_menus" ON public.weekly_menus FOR ALL USING (true);

-- -- atas ---------------------------------------------------
CREATE TABLE IF NOT EXISTS public.atas (
  id SERIAL PRIMARY KEY,
  numero TEXT,
  fornecedor TEXT,
  valor_global NUMERIC,
  valor_consumido NUMERIC DEFAULT 0,
  vigencia_fim DATE,
  status TEXT
);
ALTER TABLE public.atas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_atas" ON public.atas FOR ALL USING (true);

-- -- ata_products -------------------------------------------
CREATE TABLE IF NOT EXISTS public.ata_products (
  id SERIAL PRIMARY KEY,
  ata_id INTEGER REFERENCES public.atas(id),
  produto TEXT,
  quantidade NUMERIC,
  valor_unitario NUMERIC
);
ALTER TABLE public.ata_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_ata_products" ON public.ata_products FOR ALL USING (true);

-- -- empenhos -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.empenhos (
  id SERIAL PRIMARY KEY,
  numero TEXT,
  ata_id INTEGER REFERENCES public.atas(id),
  data DATE,
  valor NUMERIC,
  status TEXT
);
ALTER TABLE public.empenhos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_empenhos" ON public.empenhos FOR ALL USING (true);

-- -- nfs_recebidas ------------------------------------------
CREATE TABLE IF NOT EXISTS public.nfs_recebidas (
  id SERIAL PRIMARY KEY,
  numero TEXT,
  empenho_id INTEGER REFERENCES public.empenhos(id),
  data_recebimento DATE,
  valor NUMERIC,
  status TEXT
);
ALTER TABLE public.nfs_recebidas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_nfs" ON public.nfs_recebidas FOR ALL USING (true);

-- -- estoque_central ----------------------------------------
CREATE TABLE IF NOT EXISTS public.estoque_central (
  id SERIAL PRIMARY KEY,
  produto TEXT,
  qtd NUMERIC,
  unidade TEXT,
  lotes JSONB DEFAULT '[]'::jsonb
);
ALTER TABLE public.estoque_central ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_estoque_central" ON public.estoque_central FOR ALL USING (true);


-- -- school_stocks ------------------------------------------
CREATE TABLE IF NOT EXISTS public.school_stocks (
  id SERIAL PRIMARY KEY,
  school_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  qty NUMERIC DEFAULT 0,
  unit TEXT,
  last_entry DATE,
  UNIQUE(school_name, product_name)
);
ALTER TABLE public.school_stocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_school_stocks" ON public.school_stocks FOR ALL USING (true);

-- -- RPC: transfer_stock_to_school (Dedução FEFO / Baixa Segura) --
CREATE OR REPLACE FUNCTION transfer_stock_to_school(
  p_school_name TEXT,
  p_product_name TEXT,
  p_qty NUMERIC,
  p_unit TEXT
) RETURNS boolean AS $BODY
DECLARE
  v_central_qty NUMERIC;
BEGIN
  -- 1. Verifica e reduz estoque central
  SELECT qtd INTO v_central_qty FROM public.estoque_central WHERE produto = p_product_name;
  IF v_central_qty IS NULL OR v_central_qty < p_qty THEN
    RAISE EXCEPTION 'Estoque central insuficiente para %', p_product_name;
  END IF;
  
  UPDATE public.estoque_central 
  SET qtd = qtd - p_qty 
  WHERE produto = p_product_name;
  
  -- 2. Incrementa o estoque da escola
  INSERT INTO public.school_stocks (school_name, product_name, qty, unit, last_entry)
  VALUES (p_school_name, p_product_name, p_qty, p_unit, CURRENT_DATE)
  ON CONFLICT (school_name, product_name)
  DO UPDATE SET 
    qty = public.school_stocks.qty + EXCLUDED.qty,
    last_entry = CURRENT_DATE;
    
  RETURN true;
END;
$BODY LANGUAGE plpgsql;


-- -- RPC: consume_school_stock (Baixa de Consumo Diário) --
CREATE OR REPLACE FUNCTION consume_school_stock(
  p_school_name TEXT,
  p_product_name TEXT,
  p_qty NUMERIC
) RETURNS boolean AS $BODY
DECLARE
  v_school_qty NUMERIC;
BEGIN
  SELECT qty INTO v_school_qty FROM public.school_stocks WHERE school_name = p_school_name AND product_name = p_product_name;
  IF v_school_qty IS NULL OR v_school_qty < p_qty THEN
    RAISE EXCEPTION 'Estoque escolar insuficiente para % na escola %', p_product_name, p_school_name;
  END IF;
  
  UPDATE public.school_stocks 
  SET qty = qty - p_qty 
  WHERE school_name = p_school_name AND product_name = p_product_name;
  
  RETURN true;
END;
$BODY LANGUAGE plpgsql;

