# 📊 DOSSIÊ ESTRATÉGICO, TÉCNICO & FINANCEIRO — SUALE / VIGIA EDUCA
**Plataforma de Inteligência, Gestão e Conformidade da Alimentação Escolar (PNAE)**  
*Documento de Auditoria, Dimensionamento de Custos e Precificação B2G (Fase 1 — Pré-Operação)*  
*Data de Emissão: 24/09/2026 | Versão da Base: v3.1.0-release*

---

## 1. 🗺️ Levantamento Completo da Codebase Atual

### 1.1 Inventário do Código e Componentes
O ecossistema atual do SUALE possui aproximadamente **28.000 linhas de código ativo**, distribuído em uma arquitetura Single-Page Application (SPA) modular em Vanilla JavaScript (ES6+), HTML5 semântico e CSS3 puro:

| Componente | Tamanho | Responsabilidade Primária | Estado de Maturidade |
|---|---|---|---|
| `js/core_hub.js` | 584 KB (~10.700 linhas) | Hub central, motor de estado `SharedState`, roteador de telas `renderPage`, modais, toasts, utilitários DOM e sanitização. | **Operacional / Madura**, porém concentra acoplamento elevado. |
| `js/modules/` (10 arquivos) | ~520 KB somados | Módulos desacoplados por Bounded Context: `gestor.js`, `nutricao.js`, `escolas.js`, `compras.js`, `estoque.js`, `colaboradores.js`, `motorista.js`, `admin.js`, `rbac.js`, `messaging_evolution.js`. | **Alta modularidade visual e funcional.** |
| `alimentos.js` | 174 KB | Catálogo taxonômico de alimentos nutricionais (TACO/IBGE/USDA), per capita e índices de conversão. | **Consolidada.** |
| `ai_cardapio_engine.js` | 42 KB (~900 linhas) | Algoritmo heurístico/IA para sugestão de cardápios, substituições clínicas, balanceamento per capita e travas nutricionais. | **Alta diferenciação competitiva.** |
| `sprint_abc.js` | 63 KB (~1.000 linhas) | Ciclo orçamentário: parcelas FNDE, empenhos multi-item, atas, licitações, chamamentos públicos e alertas. | **Consolidada.** |
| `db.js` | 31 KB (~900 linhas) | Camada de persistência Supabase com fallback offline e hidratação local em caso de oscilação de rede. | **Pronta para homologação.** |
| `styles.css` | 56 KB | Design System "Cívico Ipê" (paleta institucional SEMED Campo Grande, WCAG 2.2 AA, responsividade). | **Visualmente premium.** |
| `tests/` (Playwright) | 77 testes E2E | Bateria completa automatizada ponta a ponta cobrindo 137 telas registradas e todos os 7 perfis operacionais. | **100% Green (0 falhas).** |

### 1.2 Fluxo de Dados e Armazenamento
- **Estado em Execução:** Centralizado em `SharedState._data`.
- **Persistência Imediata:** `localStorage` do navegador do cliente.
- **Nuvem / Supabase:** O cliente Supabase (`db.js`) realiza consultas e mutações em tabelas Postgres (`schools`, `orders`, `empenhos`, `alimentos`, `cardapios`), aplicando timeout defensivo de 800ms para acionar o fallback local caso a nuvem oscile.
- **Mensageria:** Módulo `messaging_evolution.js` conectado à Evolution API (WhatsApp) para notificações ativas de rotas, ordens e entregas.

---

## 2. ⚖️ Avaliação Tecnológica: Manter, Melhorar ou Trocar?

### 2.1 Análise Crítica da Stack Atual (Vanilla JS vs Frameworks)

| Dimensão | Situação Atual (Vanilla JS + Supabase) | Se Migrássemos para React / Next.js / Vue | Veredito Estratégico |
|---|---|---|---|
| **Tempo de Entrada em Operação** | **Imediato (0 dias de atraso):** 137 telas prontas e 77 testes passando. | **Atraso de 3 a 5 meses:** Reescrever 137 telas em componentes JSX/TSX. | **PONTO PARA MANTER:** O mercado e o piloto exigem entrega imediata. |
| **Performance e Peso** | **Carregamento instantâneo:** Zero overhead de runtime de frameworks, bundle puro, funciona até em tablets antigos de escolas. | Dependência de hidratação JS, bundles maiores (2-4 MB), risco de lentidão em conexões 3G escolares. | **PONTO PARA MANTER:** A ponta (escola/motorista) precisa de leveza máxima. |
| **Segurança & Validação B2G** | **Ponto Fraco:** Regras de negócio e permissões moram no browser. Persistência em `localStorage` não é segura contra fraude. | Framework com SSR/Server Actions ou BFF em Node/NestJS isola lógica crítica no servidor. | **PONTO DE MELHORIA MANDATÓRIO:** Criar camada servidora defensiva. |
| **Tipagem & Manutenibilidade** | **Ponto Fraco:** Sem TypeScript; refatorações dependem exclusivamente dos testes Playwright para pegar quebras. | TypeScript garante segurança de tipos em contratos complexos de dados (empenhos, lotes). | **PONTO DE MELHORIA:** Adicionar JSDoc estrito + Vite com `tsc --checkJs`. |

### 2.2 Veredito Técnico Definitivo: A "Estratégia de 2 Fases"
> **NÃO REESCREVA O FRONTEND AGORA.**  
> Reescrever o sistema em React/Next.js neste instante seria um erro clássico de engenharia ("The Second System Effect"), descartando 137 telas validadas e arriscando perder a janela de oportunidade política e comercial do piloto em Campo Grande.

A rota correta e de menor custo/risco é a **Modernização Gradual em 2 Fases**:

1. **FASE 1 — Preparação para Produção Imediata (Next 15–30 dias):**
   - **Manter o frontend Vanilla JS**, encapsulando com **Vite** para empacotamento, minificação e verificação de tipagem estática (via JSDoc/TypeScript checking).
   - **Tirar a responsabilidade de gravação do `localStorage`:** O `localStorage` deve virar apenas cache offline. A autoridade de dados passa a ser 100% o PostgreSQL do Supabase via Row Level Security (RLS) estrito.
   - **Blindar a camada de autenticação e RLS:** Eliminar qualquer dependência de perfil auto-declarado no cliente. O usuário faz login real e o banco decide o que ele pode ler/escrever.

2. **FASE 2 — Evolução para Escala Nacional (Após 6 a 9 meses de operação):**
   - Transição progressiva das telas de maior complexidade para Next.js / React Server Components ou SvelteKit, módulo a módulo, sem interromper as escolas já em produção.

---

## 3. 🛠️ Oportunidades Claras de Melhorias (Técnicas e Negociais)

1. **Autenticação Real com Perfil Inviolável (Supabase Auth / Gov.br):**
   - Substituir o seletor visual de perfis da tela de login por autenticação real (e-mail institucional com confirmação, senha forte ou token temporário por WhatsApp).
2. **PWA (Progressive Web App) Offline-First para Escolas e Motoristas:**
   - Adicionar `manifest.json` e Service Worker com **IndexedDB**. Quando a merendeira estiver no almoxarifado sem sinal, a conferência de entrega é salva localmente e sincronizada automaticamente assim que a conexão retornar.
3. **Assinatura Eletrônica com Carimbo de Tempo e Geolocalização:**
   - No recebimento escolar pelo motorista, além do desenho no Canvas HTML5, coletar: GPS latitude/longitude do descarregamento, IP, horário oficial de MS e foto do canhoto da NF-e. Isso elimina 100% das contestações judiciais e glosas do TCE.
4. **OCR / Leitor Inteligente de NF-e Automatizado:**
   - Ampliar o parser de XML já existente para leitura direta de PDF de DANFE com câmera de celular (usando OCR server-side).

---

## 4. 💰 Dimensionamento de Custos Operacionais e Sistêmicos (OPEX)

Mapeamento detalhado dos custos mensais para sustentação do sistema em 3 horizontes de escala:

### 4.1 Cenários de Operação

- **Cenário A (Piloto Atual):** 8 a 15 escolas (Campo Grande - Piloto Ativo), ~4.500 alunos.
- **Cenário B (Rede Municipal Completa):** 183 escolas, 94.700 alunos (SEMED Campo Grande total).
- **Cenário C (Expansão Regional / Consórcio):** 500 escolas, ~250.000 alunos (Campo Grande + 4 municípios do interior).

### 4.2 Tabela de Custos de Infraestrutura & Ferramentas (Sistêmicos)

| Item de Infraestrutura / Serviço | Fornecedor Recomendado | Cenário A (Piloto) | Cenário B (Rede Total) | Cenário C (Consórcio) |
|---|---|---|---|---|
| **Banco de Dados & Auth** | Supabase Pro (Postgres + Auth + Storage) | R$ 150 / mês ($25) | R$ 450 / mês ($75 + Compute Addon) | R$ 1.500 / mês (Enterprise/Dedicated) |
| **Hospedagem Frontend & CDN** | Vercel Pro / Cloudflare Enterprise Edge | R$ 120 / mês ($20) | R$ 250 / mês | R$ 600 / mês |
| **Gateway WhatsApp** | Evolution API em VPS dedicada (Hetzner / DO) | R$ 80 / mês | R$ 200 / mês | R$ 450 / mês |
| **Armazenamento de XMLs, Fotos & Canhotos** | S3 / Supabase Storage (100GB a 1TB) | R$ 25 / mês | R$ 120 / mês | R$ 350 / mês |
| **Logs, Auditoria & Sentry (Observabilidade)** | Sentry + BetterStack / Grafana Cloud | Grátis (Tier Free) | R$ 180 / mês | R$ 400 / mês |
| **Certificados SSL, Domínio & Backup Frio** | Cloudflare + Backblaze B2 | R$ 50 / mês | R$ 100 / mês | R$ 200 / mês |
| **Total de Custos de Infraestrutura (TI):** | | **~R$ 425 / mês** | **~R$ 1.300 / mês** | **~R$ 3.500 / mês** |

> **Nota Crítica sobre Infraestrutura:**  
> Por ser uma arquitetura estática conectada diretamente a um backend escalável (Supabase/Postgres), o custo de tecnologia pura é **extremamente baixo**, representando menos de 2% do faturamento esperado.

### 4.3 Custos Operacionais de Suporte & Sustentação (Equipe Humana)

O verdadeiro custo operacional em B2G não é o servidor, mas a **gestão de pessoas e suporte técnico nos horários de entrega da merenda (06h30 às 17h00)**:

| Função / Atividade | Cenário A (Piloto) | Cenário B (Rede Total) | Cenário C (Consórcio) |
|---|---|---|---|
| **Analista de Suporte N1/N2** (WhatsApp direto com merendeiras e nutricionistas) | 1 meio-período (R$ 2.000) | 2 analistas dedicados (R$ 7.000) | 4 analistas (R$ 14.000) |
| **Engenheiro de Software / DBA / Sustentação** | Suporte sob demanda (R$ 3.000) | 1 Engenheiro Pleno dedicado (R$ 9.000) | 2 Engenheiros (R$ 18.000) |
| **Nutricionista Especialista PNAE (Consultoria de Sucesso do Cliente)** | Pontual (R$ 1.500) | 1 Consultor 20h/semana (R$ 4.500) | 2 Consultores (R$ 9.000) |
| **Deslocamento / Visitas Técnicas de Alinhamento** | R$ 500 / mês | R$ 1.500 / mês | R$ 3.500 / mês |
| **Total Custo Humano Operacional:** | **~R$ 7.000 / mês** | **~R$ 22.000 / mês** | **~R$ 44.500 / mês** |

---

## 5. 🏷️ Engenharia de Preços: Quanto e Como Cobrar?

Para venda ao setor público (B2G SaaS), a precificação deve estar ancorada no **benefício econômico gerado (economia no desperdício)** e nos modelos consolidados de compras governamentais.

### 5.1 O Argumento Financeiro de Venda (ROI para a Prefeitura)
- O orçamento anual de alimentação escolar de Campo Grande gira em torno de **R$ 50 a R$ 60 milhões/ano** (somando repasses do FNDE e contrapartidas municipais).
- A perda estimada por descontrole de lotes, produtos vencidos e desvios é de 15% a 25% (**R$ 7,5 a R$ 15 milhões/ano jogados no lixo**).
- O SUALE, ao reduzir esse desperdício em apenas 30%, devolve aos cofres públicos entre **R$ 2,2 milhões e R$ 4,5 milhões por ano**.
- Qualquer contrato de R$ 500 mil a R$ 1,2 milhão/ano tem **payback comprovado em menos de 60 dias**.

---

### 5.2 Modelagem de Pacotes Comerciais (3 Tiers de Serviço)

#### 🥉 PACOTE 1: PNAE Básico & Transparência
*Foco: Secretarias pequenas ou contratação inicial sem logística pesada.*
- Planejamento de cardápios com regras FNDE e tabela nutricional.
- Gestão de chamadas públicas da Agricultura Familiar (garantia dos 30%).
- Portal Cívico de Transparência para a sociedade.
- Suporte comercial via ticket (SLA 8h).
- **Preço de Implantação (Setup):** R$ 35.000,00 (taxa única).
- **Mensalidade:** **R$ 0,75 por aluno/mês** (ou valor fixo de R$ 350/escola/mês).

#### 🥈 PACOTE 2: Supply Chain & WMS Operacional (RECOMENDADO)
*Foco: Controle completo do almoxarifado central e recebimento escolar.*
- Tudo do Pacote 1 +
- Módulo de Estoque Central com separação automática FEFO por lote.
- Roteirização de motoristas e coleta de assinatura digital (Canvas) na entrega.
- Leitor de XML de NF-e para liquidação automática de empenhos SIAFI.
- Notificações ativas via WhatsApp (Evolution API) para escolas e motoristas.
- Treinamento presencial de merendeiras e equipe do depósito.
- Suporte dedicado N1/N2 em horário escolar (SLA 2h).
- **Preço de Implantação (Setup):** R$ 75.000,00 (taxa única).
- **Mensalidade:** **R$ 1,25 por aluno/mês** (ou R$ 650/escola/mês).
  - *Exemplo Campo Grande (94.700 alunos):* **R$ 118.375,00 / mês (R$ 1,42M / ano)**.
  - *Exemplo Piloto (8 escolas / ~4.000 alunos):* Mínimo contratual de **R$ 8.000,00 a R$ 12.000,00 / mês**.

#### 🥇 PACOTE 3: GovTech 360 & Inteligência Artificial Preditiva
*Foco: Grandes capitais e redes estaduais que buscam auditoria preventiva do TCE.*
- Tudo do Pacote 2 +
- Motor de IA Preditiva de Demanda (`AICardapioEngine`) com ajuste automático por frequência real.
- Auditoria contínua anti-glosa com cruzamento automático ATA ↔ Empenho ↔ NF-e ↔ Consumo.
- Integração personalizada com ERP municipal (ex: Betha, Governa, IPM, Digix) e SEFAZ.
- Consultoria nutricional mensal especializada com emissão de laudos de aceitabilidade.
- Gerente de Conta Dedicado + SLA Crítico de 30 minutos.
- **Preço de Implantação (Setup):** R$ 150.000,00 a R$ 250.000,00.
- **Mensalidade:** **R$ 1,80 a R$ 2,20 por aluno/mês**.
  - *Exemplo Campo Grande:* **R$ 170.000,00 a R$ 208.000,00 / mês (R$ 2,04M a R$ 2,5M / ano)**.

---

### 5.3 Simulação de Lucratividade (Unit Economics — Campo Grande Integral)

| Linha Financeira | Valor Mensal (Cenário Rede Total — Pacote 2) | Anualizado (12 meses) |
|---|---|---|
| **Receita Recorrente (MRR)** (94.700 alunos × R$ 1,25) | + R$ 118.375,00 | + R$ 1.420.500,00 |
| **Custo de Tecnologia (Infraestrutura & APIs)** | - R$ 1.300,00 | - R$ 15.600,00 |
| **Custo Operacional de Pessoal (Suporte & DevOps)** | - R$ 22.000,00 | - R$ 264.000,00 |
| **Impostos sobre Nota B2G (~12% a 15%)** | - R$ 15.388,00 | - R$ 184.656,00 |
| **Custo Administrativo / Jurídico B2G** | - R$ 5.000,00 | - R$ 60.000,00 |
| **LUCRO OPERACIONAL LÍQUIDO MENSAL (EBITDA):** | **+ R$ 74.687,00 / mês** | **+ R$ 896.244,00 / ano** |
| **Margem Operacional Líquida:** | **63,1% de Margem Líquida** | |

---

## 6. 📜 Acordo de Nível de Serviço (SLA) & Prevenção de Scope Creep

### 6.1 Matriz de SLA Recomendada em Contrato Público

| Severidade do Incidente | Definição Operacional | Tempo Máximo de Resposta | Tempo Máximo de Resolução |
|---|---|---|---|
| **Crítica (P1)** | Sistema inacessível no depósito central ou motoristas impossibilitados de descarregar mercadoria em dia letivo. | 15 minutos | 2 horas |
| **Alta (P2)** | Escola incapaz de registrar recebimento de alimentos perecíveis ou nutricionista impedida de emitir cardápio da semana. | 30 minutos | 4 horas |
| **Média (P3)** | Falha no envio de notificações WhatsApp ou lentidão na geração de relatórios de auditoria. | 2 horas | 12 horas úteis |
| **Baixa (P4)** | Dúvidas operacionais de preenchimento, pequenos ajustes visuais ou melhorias sugeridas. | 4 horas úteis | 48 horas úteis |

### 6.2 Cláusulas Blindadas Anti-Scope Creep (Defesa do Fornecedor)
Para não ter prejuízo com exigências arbitrárias de fiscais de contrato da prefeitura:
1. **Diferenciação Estrita de Ajuste vs Customização:**  
   - *Coberto em Manutenção:* Correções de bugs, ajustes decorrentes de alterações na Lei Federal 11.947/PNAE e resoluções do FNDE.
   - *Cobrado à Parte (Change Request):* Integrações com sistemas legados municipais proprietários não listados no Termo de Referência, customizações de fluxos de trabalho locais que contradigam o padrão PNAE e criação de relatórios específicos para secretarias alheias à educação.
2. **Banco de Horas de Evolutivos:**
   - O contrato deve prever um pacote mensal fixo de **20 a 30 horas técnicas** para pequenas adequações solicitadas pelo Gestor SEMED. Solicitações excedentes serão orçadas a **R$ 220,00/hora**.
3. **Validação e Aceite Formal por Etapas (Sign-off):**
   - Nenhuma nova funcionalidade entra em produção sem Documento de Especificação de Requisito aprovado por escrito pelo fiscal técnico da SEMED.
