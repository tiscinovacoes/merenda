-- ============================================================
-- SUALE / Vigia Educa — Schema & Seed SQL v2.1.0
-- Módulo Financeiro & Contratos
-- Tabelas: atas, empenhos, os_estoque_central, lista_compras,
--          os_fornecedores (agricultores & cooperativas)
-- Cole este script no SQL Editor do Supabase e clique em Run
-- ============================================================

-- 0. LIMPEZA DE VERSÕES ANTERIORES (se existirem)
DROP TABLE IF EXISTS public.atas                    CASCADE;
DROP TABLE IF EXISTS public.empenhos                CASCADE;
DROP TABLE IF EXISTS public.os_estoque_central      CASCADE;
DROP TABLE IF EXISTS public.lista_compras           CASCADE;
DROP TABLE IF EXISTS public.os_fornecedores         CASCADE;

-- ── 1. TABELA: atas (Atas de Registro de Preços) ─────────────
-- ATA é o contrato-mãe. Empenhos e OS de fornecedores referenciam atas.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.atas (
  id                SERIAL PRIMARY KEY,
  numero            TEXT NOT NULL,           -- ex.: 'ATA-2026/001'
  ano               INTEGER NOT NULL DEFAULT 2026,
  tipo              TEXT NOT NULL DEFAULT 'Convencional',
                                             -- 'AF' = Agricultura Familiar
                                             -- 'Convencional' = Pregão/Licitação
  fornecedor        TEXT NOT NULL,           -- nome da coop ou empresa
  cnpj_cpf          TEXT,
  objeto            TEXT,                   -- descrição do objeto licitado
  modalidade        TEXT DEFAULT 'Pregão Eletrônico',
  processo          TEXT,                   -- número do processo administrativo
  valor_global      NUMERIC(14,2) DEFAULT 0,
  valor_executado   NUMERIC(14,2) DEFAULT 0,
  saldo_disponivel  NUMERIC(14,2) GENERATED ALWAYS AS (valor_global - valor_executado) STORED,
  data_inicio       DATE NOT NULL,
  data_fim          DATE NOT NULL,
  status            TEXT NOT NULL DEFAULT 'Vigente',
                                             -- 'Vigente', 'Encerrada', 'Suspensa', 'Em Renovação'
  itens             JSONB DEFAULT '[]'::jsonb,
                                             -- [{"codigo","descricao","unidade","qtd_registrada","preco_unit","qtd_executada"}]
  observacoes       TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.atas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_atas"  ON public.atas FOR SELECT USING (true);
CREATE POLICY "anon_ins_atas"  ON public.atas FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_upd_atas"  ON public.atas FOR UPDATE USING (true);

INSERT INTO public.atas
  (numero, ano, tipo, fornecedor, cnpj_cpf, objeto, modalidade, processo,
   valor_global, valor_executado, data_inicio, data_fim, status, itens) VALUES

('ATA-2026/001', 2026, 'AF', 'COOPAGRAN',
 '00.123.456/0001-78',
 'Aquisição de gêneros alimentícios da Agricultura Familiar para merenda escolar',
 'Chamada Pública', 'SEMED-2026-CP-001',
 5200000.00, 2860000.00, '2026-01-15', '2026-12-31', 'Vigente',
 '[{"codigo":"AF-001","descricao":"Arroz Tipo 1","unidade":"kg","qtd_registrada":150000,"preco_unit":4.50,"qtd_executada":82000},
   {"codigo":"AF-002","descricao":"Feijao Carioca","unidade":"kg","qtd_registrada":60000,"preco_unit":7.20,"qtd_executada":31000},
   {"codigo":"AF-003","descricao":"Banana Nanica","unidade":"kg","qtd_registrada":50000,"preco_unit":3.80,"qtd_executada":28000}]'::jsonb),

('ATA-2026/002', 2026, 'AF', 'COOPRAN / COOPAERGS',
 '00.234.567/0001-89',
 'Fornecimento de hortifrutigranjeiros e proteínas da Agricultura Familiar',
 'Chamada Pública', 'SEMED-2026-CP-002',
 4800000.00, 2160000.00, '2026-02-01', '2026-12-31', 'Vigente',
 '[{"codigo":"AF-010","descricao":"Tomate","unidade":"kg","qtd_registrada":40000,"preco_unit":5.50,"qtd_executada":18000},
   {"codigo":"AF-011","descricao":"Cenoura","unidade":"kg","qtd_registrada":35000,"preco_unit":4.20,"qtd_executada":14000},
   {"codigo":"AF-012","descricao":"Ovo de Galinha","unidade":"dz","qtd_registrada":20000,"preco_unit":14.00,"qtd_executada":9000}]'::jsonb),

('ATA-2025/018', 2025, 'Convencional', 'Distribuidora Aliança Ltda',
 '12.345.678/0001-00',
 'Aquisição de gêneros alimentícios processados e industrializados — Pregão Eletrônico',
 'Pregão Eletrônico', 'SEMED-2025-PE-018',
 6500000.00, 5850000.00, '2025-07-01', '2026-06-30', 'Vigente',
 '[{"codigo":"CV-001","descricao":"Oleo de Soja","unidade":"L","qtd_registrada":30000,"preco_unit":8.90,"qtd_executada":27000},
   {"codigo":"CV-002","descricao":"Acucar Cristal","unidade":"kg","qtd_registrada":50000,"preco_unit":4.10,"qtd_executada":44000},
   {"codigo":"CV-003","descricao":"Farinha de Trigo","unidade":"kg","qtd_registrada":60000,"preco_unit":3.70,"qtd_executada":54000}]'::jsonb),

('ATA-2026/003', 2026, 'AF', 'COOPASUL / COOPERVIDA',
 '00.345.678/0001-90',
 'Fornecimento de tubérculos, raízes e frutos da Agricultura Familiar',
 'Chamada Pública', 'SEMED-2026-CP-003',
 1800000.00, 540000.00, '2026-03-01', '2027-02-28', 'Vigente',
 '[{"codigo":"AF-020","descricao":"Mandioca","unidade":"kg","qtd_registrada":30000,"preco_unit":3.20,"qtd_executada":9000},
   {"codigo":"AF-021","descricao":"Batata Doce","unidade":"kg","qtd_registrada":25000,"preco_unit":4.50,"qtd_executada":7500},
   {"codigo":"AF-022","descricao":"Abobora Cabotia","unidade":"kg","qtd_registrada":20000,"preco_unit":4.80,"qtd_executada":6000}]'::jsonb);


-- ── 2. TABELA: empenhos (Empenhos SIAFI vinculados às Atas) ──
-- Cada empenho é uma ordem de compra formal gerada contra uma ATA.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.empenhos (
  id                SERIAL PRIMARY KEY,
  numero_empenho    TEXT NOT NULL UNIQUE,   -- ex.: '2026NE000341'
  ata_id            INTEGER REFERENCES public.atas(id) ON DELETE SET NULL,
  ata_numero        TEXT,                   -- cópia denormalizada para exibição
  tipo              TEXT NOT NULL DEFAULT 'AF',
                                            -- 'AF' | 'Convencional'
  fornecedor        TEXT NOT NULL,
  escola_id         INTEGER REFERENCES public.schools(id) ON DELETE SET NULL,
  escola_name       TEXT,                   -- null = empenho global SEMED
  valor_empenhado   NUMERIC(14,2) NOT NULL DEFAULT 0,
  valor_liquidado   NUMERIC(14,2) DEFAULT 0,
  valor_pago        NUMERIC(14,2) DEFAULT 0,
  saldo_liquidar    NUMERIC(14,2) GENERATED ALWAYS AS (valor_empenhado - valor_liquidado) STORED,
  status            TEXT NOT NULL DEFAULT 'Emitido',
                                            -- 'Emitido', 'Liquidado', 'Pago', 'Cancelado', 'Em Análise'
  data_empenho      DATE NOT NULL DEFAULT CURRENT_DATE,
  data_vencimento   DATE,
  itens             JSONB DEFAULT '[]'::jsonb,
                                            -- [{"produto","quantidade","unidade","preco_unit","subtotal"}]
  nota_fiscal       TEXT,                  -- número da NF vinculada
  observacoes       TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.empenhos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_empenhos" ON public.empenhos FOR SELECT USING (true);
CREATE POLICY "anon_all_empenhos" ON public.empenhos FOR ALL USING (true);

INSERT INTO public.empenhos
  (numero_empenho, ata_id, ata_numero, tipo, fornecedor, escola_id, escola_name,
   valor_empenhado, valor_liquidado, valor_pago, status,
   data_empenho, data_vencimento, itens) VALUES

('2026NE000341', 1, 'ATA-2026/001', 'AF', 'COOPAGRAN', 1, 'EM Arlindo Lima',
 18500.00, 18500.00, 18500.00, 'Pago',
 '2026-07-10', '2026-07-31',
 '[{"produto":"Arroz Tipo 1","quantidade":3000,"unidade":"kg","preco_unit":4.50,"subtotal":13500},
   {"produto":"Feijao Carioca","quantidade":600,"unidade":"kg","preco_unit":7.20,"subtotal":4320}]'::jsonb),

('2026NE000342', 1, 'ATA-2026/001', 'AF', 'COOPAGRAN', 3, 'EM Franklin Roosevelt',
 22500.00, 22500.00, 0.00, 'Liquidado',
 '2026-07-15', '2026-08-15',
 '[{"produto":"Arroz Tipo 1","quantidade":3500,"unidade":"kg","preco_unit":4.50,"subtotal":15750},
   {"produto":"Banana Nanica","quantidade":1800,"unidade":"kg","preco_unit":3.80,"subtotal":6840}]'::jsonb),

('2026NE000343', 2, 'ATA-2026/002', 'AF', 'COOPRAN / COOPAERGS', 4, 'EM Hercules Maymone',
 9800.00, 0.00, 0.00, 'Emitido',
 '2026-07-28', '2026-08-20',
 '[{"produto":"Tomate","quantidade":800,"unidade":"kg","preco_unit":5.50,"subtotal":4400},
   {"produto":"Cenoura","quantidade":600,"unidade":"kg","preco_unit":4.20,"subtotal":2520},
   {"produto":"Ovo de Galinha","quantidade":200,"unidade":"dz","preco_unit":14.00,"subtotal":2800}]'::jsonb),

('2026NE000344', 3, 'ATA-2025/018', 'Convencional', 'Distribuidora Aliança Ltda', NULL, NULL,
 45000.00, 45000.00, 45000.00, 'Pago',
 '2026-06-01', '2026-06-30',
 '[{"produto":"Oleo de Soja","quantidade":2000,"unidade":"L","preco_unit":8.90,"subtotal":17800},
   {"produto":"Acucar Cristal","quantidade":3000,"unidade":"kg","preco_unit":4.10,"subtotal":12300},
   {"produto":"Farinha de Trigo","quantidade":4000,"unidade":"kg","preco_unit":3.70,"subtotal":14800}]'::jsonb);


-- ── 3. TABELA: os_estoque_central (OS do Almoxarifado Central) ─
-- Registra toda movimentação do estoque central:
-- entradas de fornecedores, transferências para escolas, ajustes.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.os_estoque_central (
  id                SERIAL PRIMARY KEY,
  numero_os         TEXT NOT NULL UNIQUE,   -- ex.: 'OS-CENTRAL-2026/001'
  tipo              TEXT NOT NULL,
                                            -- 'Entrada' | 'Saída' | 'Transferência' | 'Ajuste'
  empenho_id        INTEGER REFERENCES public.empenhos(id) ON DELETE SET NULL,
  empenho_numero    TEXT,
  fornecedor        TEXT,                   -- preenchido em Entradas
  escola_destino_id INTEGER REFERENCES public.schools(id) ON DELETE SET NULL,
  escola_destino    TEXT,                   -- preenchido em Transferências
  produto           TEXT NOT NULL,
  quantidade        NUMERIC(12,2) NOT NULL,
  unidade           TEXT NOT NULL DEFAULT 'kg',
  lote              TEXT,
  validade          DATE,
  status            TEXT NOT NULL DEFAULT 'Pendente',
                                            -- 'Pendente', 'Em Separação', 'Expedido', 'Recebido', 'Cancelado'
  responsavel       TEXT,
  data_programada   DATE,
  data_execucao     DATE,
  observacoes       TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.os_estoque_central ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_os_central" ON public.os_estoque_central FOR SELECT USING (true);
CREATE POLICY "anon_all_os_central" ON public.os_estoque_central FOR ALL USING (true);

INSERT INTO public.os_estoque_central
  (numero_os, tipo, empenho_numero, fornecedor, escola_destino_id, escola_destino,
   produto, quantidade, unidade, lote, validade, status, responsavel, data_programada) VALUES

('OS-CENTRAL-2026/001', 'Entrada', '2026NE000344', 'Distribuidora Aliança Ltda',
 NULL, NULL,
 'Arroz Tipo 1', 8000.00, 'kg', 'L-ARR-2026/01', '2027-02-15',
 'Recebido', 'Ana Lima (Almoxarifado)', '2026-07-05'),

('OS-CENTRAL-2026/002', 'Transferência', NULL, NULL,
 1, 'EM Arlindo Lima',
 'Arroz Tipo 1', 500.00, 'kg', 'L-ARR-2026/01', '2027-02-15',
 'Expedido', 'Carlos Mota (Motorista)', '2026-07-28'),

('OS-CENTRAL-2026/003', 'Transferência', NULL, NULL,
 3, 'EM Franklin Roosevelt',
 'Feijao Carioca', 350.00, 'kg', 'L-FEJ-2026/01', '2026-12-20',
 'Expedido', 'Carlos Mota (Motorista)', '2026-07-29'),

('OS-CENTRAL-2026/004', 'Transferência', NULL, NULL,
 4, 'EM Hercules Maymone',
 'Arroz Tipo 1', 200.00, 'kg', 'L-ARR-2026/01', '2027-02-15',
 'Pendente', 'Carlos Mota (Motorista)', '2026-08-05'),

('OS-CENTRAL-2026/005', 'Entrada', '2026NE000341', 'COOPAGRAN',
 NULL, NULL,
 'Banana Nanica', 1800.00, 'kg', 'L-BAN-2026/12', '2026-08-10',
 'Recebido', 'Ana Lima (Almoxarifado)', '2026-08-01'),

('OS-CENTRAL-2026/006', 'Ajuste', NULL, NULL,
 NULL, NULL,
 'Leite Integral', -50.00, 'L', 'L-LEI-2026/05', NULL,
 'Expedido', 'Ana Lima (Almoxarifado)', '2026-08-02');


-- ── 4. TABELA: lista_compras (Lista de Compras Programadas) ──
-- Listas de necessidades geradas pelas escolas ou pela SEMED,
-- que alimentam o processo de empenho e OS de fornecedores.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.lista_compras (
  id                SERIAL PRIMARY KEY,
  titulo            TEXT NOT NULL,
  referencia        TEXT,                  -- ex.: 'Agosto/2026', 'Semana 32'
  escola_id         INTEGER REFERENCES public.schools(id) ON DELETE SET NULL,
  escola_name       TEXT,                  -- null = lista consolidada SEMED
  tipo              TEXT NOT NULL DEFAULT 'Mensal',
                                           -- 'Mensal', 'Semanal', 'Emergencial', 'Consolidada SEMED'
  status            TEXT NOT NULL DEFAULT 'Rascunho',
                                           -- 'Rascunho', 'Enviada', 'Em Análise', 'Aprovada', 'Cancelada'
  itens             JSONB DEFAULT '[]'::jsonb,
                                           -- [{"produto","unidade","qtd_solicitada","qtd_aprovada","justificativa"}]
  valor_estimado    NUMERIC(14,2) DEFAULT 0,
  valor_aprovado    NUMERIC(14,2) DEFAULT 0,
  criado_por        TEXT DEFAULT 'Sistema',
  aprovado_por      TEXT,
  data_necessidade  DATE,
  created_at        TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.lista_compras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_lista" ON public.lista_compras FOR SELECT USING (true);
CREATE POLICY "anon_all_lista" ON public.lista_compras FOR ALL USING (true);

INSERT INTO public.lista_compras
  (titulo, referencia, escola_id, escola_name, tipo, status, itens,
   valor_estimado, valor_aprovado, criado_por, aprovado_por, data_necessidade) VALUES

('Reposição de Agosto — EM Arlindo Lima', 'Agosto/2026', 1, 'EM Arlindo Lima',
 'Mensal', 'Aprovada',
 '[{"produto":"Arroz Tipo 1","unidade":"kg","qtd_solicitada":300,"qtd_aprovada":300,"justificativa":"Consumo mensal previsto"},
   {"produto":"Feijao Carioca","unidade":"kg","qtd_solicitada":120,"qtd_aprovada":120,"justificativa":"Cardapio agosto"},
   {"produto":"Banana Nanica","unidade":"kg","qtd_solicitada":200,"qtd_aprovada":180,"justificativa":"Lanche semanal"}]'::jsonb,
 3420.00, 3180.00, 'Maria Santos (Diretora)', 'Dra. Lilian Droppa', '2026-08-01'),

('Emergência — EM Hercules Maymone', 'Agosto/2026', 4, 'EM Hercules Maymone',
 'Emergencial', 'Enviada',
 '[{"produto":"Arroz Tipo 1","unidade":"kg","qtd_solicitada":200,"qtd_aprovada":null,"justificativa":"Estoque zerado — risco de interrupção"},
   {"produto":"Feijao Carioca","unidade":"kg","qtd_solicitada":80,"qtd_aprovada":null,"justificativa":"Estoque zerado"}]'::jsonb,
 1976.00, 0.00, 'Carlos Pereira (Diretor)', NULL, '2026-08-04'),

('Lista Consolidada SEMED — Agosto/2026', 'Agosto/2026', NULL, NULL,
 'Consolidada SEMED', 'Em Análise',
 '[{"produto":"Arroz Tipo 1","unidade":"kg","qtd_solicitada":8000,"qtd_aprovada":null,"justificativa":"Demanda consolidada 8 escolas"},
   {"produto":"Leite Integral","unidade":"L","qtd_solicitada":12000,"qtd_aprovada":null,"justificativa":"Demanda consolidada 8 escolas"},
   {"produto":"Frango Coxa Sobrecoxa","unidade":"kg","qtd_solicitada":5000,"qtd_aprovada":null,"justificativa":"Demanda consolidada 8 escolas"}]'::jsonb,
 98400.00, 0.00, 'Dra. Lilian Droppa (Nutricionista)', NULL, '2026-08-10'),

('Reposição — EM Elpidio Reis', 'Semana 32/2026', 2, 'EM Elpidio Reis',
 'Semanal', 'Aprovada',
 '[{"produto":"Leite Integral","unidade":"L","qtd_solicitada":400,"qtd_aprovada":400,"justificativa":"Lanche 5 dias x 80 alunos x 1L"},
   {"produto":"Banana Nanica","unidade":"kg","qtd_solicitada":150,"qtd_aprovada":150,"justificativa":"Vitamina 3x/semana"}]'::jsonb,
 3970.00, 3970.00, 'Joao Oliveira (Diretor)', 'Dra. Lilian Droppa', '2026-08-04');


-- ── 5. TABELA: os_fornecedores (OS para Cooperativas / Agricultores) ─
-- Ordens de Serviço de entrega emitidas diretamente para cooperativas
-- e agricultores familiares, vinculadas às ATAs.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE public.os_fornecedores (
  id                      SERIAL PRIMARY KEY,
  numero_os               TEXT NOT NULL UNIQUE,  -- ex.: 'OS-FORN-2026/001'
  tipo_fornecedor         TEXT NOT NULL,
                                                 -- 'Cooperativa' | 'Agricultor Familiar'
  ata_id                  INTEGER REFERENCES public.atas(id) ON DELETE SET NULL,
  ata_numero              TEXT,
  empenho_id              INTEGER REFERENCES public.empenhos(id) ON DELETE SET NULL,
  empenho_numero          TEXT,
  cooperativa             TEXT,                  -- nome da cooperativa
  agricultor              TEXT,                  -- nome do agricultor (se direto)
  cnpj_cpf                TEXT,
  escola_destino_id       INTEGER REFERENCES public.schools(id) ON DELETE SET NULL,
  escola_destino          TEXT,                  -- null = entrega no almoxarifado central
  itens                   JSONB DEFAULT '[]'::jsonb,
                                                 -- [{"produto","qtd_pedida","qtd_entregue","unidade","preco_unit","lote","validade"}]
  valor_total             NUMERIC(14,2) DEFAULT 0,
  status                  TEXT NOT NULL DEFAULT 'Emitida',
                                                 -- 'Emitida', 'Confirmada pelo Fornecedor',
                                                 -- 'Em Preparação', 'Em Rota', 'Entregue Parcialmente',
                                                 -- 'Entregue', 'Cancelada', 'Com Pendência'
  data_emissao            DATE NOT NULL DEFAULT CURRENT_DATE,
  data_entrega_prevista   DATE,
  data_entrega_real       DATE,
  responsavel_recebimento TEXT,
  guia_protocolo          TEXT,                  -- número da guia física assinada
  foto_entrega_url        TEXT,
  observacoes             TEXT,
  created_at              TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.os_fornecedores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_sel_os_forn" ON public.os_fornecedores FOR SELECT USING (true);
CREATE POLICY "anon_all_os_forn" ON public.os_fornecedores FOR ALL USING (true);

INSERT INTO public.os_fornecedores
  (numero_os, tipo_fornecedor, ata_id, ata_numero, empenho_id, empenho_numero,
   cooperativa, agricultor, escola_destino_id, escola_destino,
   itens, valor_total, status,
   data_emissao, data_entrega_prevista, data_entrega_real,
   responsavel_recebimento, guia_protocolo) VALUES

('OS-FORN-2026/001', 'Cooperativa', 1, 'ATA-2026/001', 1, '2026NE000341',
 'COOPAGRAN', NULL, 1, 'EM Arlindo Lima',
 '[{"produto":"Arroz Tipo 1","qtd_pedida":500,"qtd_entregue":500,"unidade":"kg","preco_unit":4.50,"lote":"L-ARR-COOP-001","validade":"2027-02-15"},
   {"produto":"Feijao Carioca","qtd_pedida":180,"qtd_entregue":180,"unidade":"kg","preco_unit":7.20,"lote":"L-FEJ-COOP-001","validade":"2026-12-20"}]'::jsonb,
 3546.00, 'Entregue',
 '2026-07-25', '2026-07-28', '2026-07-28',
 'Maria Santos', 'GUI-2026/041'),

('OS-FORN-2026/002', 'Cooperativa', 2, 'ATA-2026/002', NULL, NULL,
 'COOPRAN', NULL, 2, 'EM Elpidio Reis',
 '[{"produto":"Banana Nanica","qtd_pedida":200,"qtd_entregue":null,"unidade":"kg","preco_unit":3.80,"lote":null,"validade":null},
   {"produto":"Leite Integral","qtd_pedida":400,"qtd_entregue":null,"unidade":"L","preco_unit":4.20,"lote":null,"validade":null}]'::jsonb,
 2440.00, 'Confirmada pelo Fornecedor',
 '2026-08-01', '2026-08-05', NULL,
 NULL, NULL),

('OS-FORN-2026/003', 'Agricultor Familiar', 1, 'ATA-2026/001', NULL, NULL,
 'COOPAGRAN', 'Jose Maria Rodrigues', NULL, NULL,
 '[{"produto":"Mandioca","qtd_pedida":800,"qtd_entregue":null,"unidade":"kg","preco_unit":3.20,"lote":null,"validade":null},
   {"produto":"Abobora Cabotia","qtd_pedida":400,"qtd_entregue":null,"unidade":"kg","preco_unit":4.80,"lote":null,"validade":null}]'::jsonb,
 4480.00, 'Emitida',
 '2026-08-02', '2026-08-08', NULL,
 NULL, NULL),

('OS-FORN-2026/004', 'Cooperativa', 3, 'ATA-2025/018', 2, '2026NE000344',
 'Distribuidora Aliança Ltda', NULL, NULL, NULL,
 '[{"produto":"Oleo de Soja","qtd_pedida":2000,"qtd_entregue":2000,"unidade":"L","preco_unit":8.90,"lote":"L-OLE-2026/03","validade":"2027-06-30"},
   {"produto":"Acucar Cristal","qtd_pedida":3000,"qtd_entregue":3000,"unidade":"kg","preco_unit":4.10,"lote":"L-ACU-2026/03","validade":"2027-12-31"}]'::jsonb,
 30100.00, 'Entregue',
 '2026-07-01', '2026-07-10', '2026-07-10',
 'Ana Lima (Almoxarifado)', 'GUI-2026/038'),

('OS-FORN-2026/005', 'Agricultor Familiar', 4, 'ATA-2026/003', NULL, NULL,
 'COOPASUL', 'Terezinha Barbosa', 8, 'EM Professora Goncalina Faustina',
 '[{"produto":"Batata Doce","qtd_pedida":300,"qtd_entregue":null,"unidade":"kg","preco_unit":4.50,"lote":null,"validade":null},
   {"produto":"Abobora Cabotia","qtd_pedida":200,"qtd_entregue":null,"unidade":"kg","preco_unit":4.80,"lote":null,"validade":null}]'::jsonb,
 2310.00, 'Em Preparação',
 '2026-08-03', '2026-08-07', NULL,
 NULL, NULL);


-- ============================================================
-- SCRIPT v2.1.0 CONCLUÍDO COM SUCESSO!
-- Tabelas criadas:
--   ✅ atas             (4 ATAs vigentes)
--   ✅ empenhos         (4 empenhos SIAFI)
--   ✅ os_estoque_central (6 ordens de movimentação)
--   ✅ lista_compras    (4 listas de compras)
--   ✅ os_fornecedores  (5 ordens de serviço)
-- ============================================================
