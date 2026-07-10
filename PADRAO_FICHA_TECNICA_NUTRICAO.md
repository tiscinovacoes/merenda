# Padrão de Ficha Técnica, Cardápio e Guia de Compra — Módulo Nutrição (SAGED)

> Especificação derivada do estudo de 4 planilhas reais:
> - `Planilha_PlanPNAE_versao_4atualizada221121 (1).xlsx` — **modelo oficial do FNDE para o PNAE**
>   (Programa Nacional de Alimentação Escolar), fonte normativa.
> - `PER CAPITA 2026 CONSULTA.xlsx`, `Cópia de CÁLCULO AGOSTO 2026.xlsx`, `PÃES E OVOS PRA ANDREIA.xlsx`
>   — planilhas de trabalho da SEMED, camada operacional de compra.
>
> Objetivo: formalizar como regra de negócio, para as telas **Fichas Técnicas** e **Planejamento
> Alimentar** do perfil Nutricionista, o padrão oficial de nutrição já usado pelo FNDE, e mostrar como
> ele se conecta ao cálculo de compra que a SEMED já pratica.

---

## 1. Duas camadas, uma ponte

O estudo revelou que existem **duas camadas complementares**, hoje vivendo em arquivos separados sem
ligação entre si:

```
CAMADA NUTRICIONAL (oficial FNDE)        CAMADA LOGÍSTICA (planilhas SEMED)
───────────────────────────────          ──────────────────────────────────
Tabela de Alimentos (base nutricional)
        ↓
Ficha Técnica de Preparo                  
  → Per capita (bruto) por ingrediente ───→  Per Capita (PC) por gênero/tipo de unidade
        ↓                                          ↓
Cardápio Diário (Seg. a Sex.)                      ↓
        ↓                                          ↓
Adequação Nutricional Semanal              Guia de Compra Mensal
  (% VET vs. referência por faixa etária)     (kg/und/dúzia por fornecedor)
        ↓
Custo do Cardápio (R$/aluno/mês)
```

O elo entre as duas camadas é o **per capita (bruto)**: na ficha técnica oficial ele nasce do
cálculo nutricional (quanto do ingrediente cru é preciso para render a porção líquida planejada);
na planilha de compra municipal (`CÁLCULO AGOSTO`) o mesmo valor é usado, já pronto, como entrada
da coluna `PC`, para multiplicar pelo número de alunos e gerar a guia de compra. **É o mesmo número,
com a mesma origem — hoje ele é apenas copiado manualmente de um mundo para o outro.**

O padrão deste documento cobre as duas camadas e formaliza essa ponte.

---

## 2. Camada Nutricional — o que a planilha oficial do PNAE define

A planilha do FNDE tem 8 abas, cada uma correspondendo a um passo do fluxo de planejamento oficial:

| Aba oficial | Função |
|---|---|
| `Tabela de alimentos` | Base de composição nutricional por 100g (936 alimentos), com sinalização de restrição de uso |
| `Ficha técnica` | Ficha técnica de preparo — 1 receita, seus ingredientes, custo e valor nutricional |
| `Segunda` a `Sexta` | Cardápio diário por refeição/horário, com nutrientes calculados automaticamente |
| `Média semanal (Creche)` | Adequação nutricional semanal para 0–3 anos, vs. referência DRI por nº de refeições/dia |
| `Média semanal (> 3 anos)` | Idem, para pré-escola até EJA, com breakdown %VET (Atwater 4-9-4) |
| `Custos dos cardápios` | Custo por preparação × alunos × frequência mensal |

### 2.1 Tabela de Alimentos (base nutricional)

Uma linha por alimento, com energia (kcal/kJ), proteína, lipídeos, carboidratos, cálcio, ferro,
retinol, vitamina C e sódio **por 100g** — é a fonte de todo cálculo nutricional posterior via
`VLOOKUP` pelo nome do alimento.

Cada linha também carrega uma **classificação de restrição de uso**, hoje codificada só por cor de
célula (legenda no cabeçalho), sem coluna de dado — o que é uma fragilidade a corrigir no sistema:

| Classificação (cor na planilha) | Regra |
|---|---|
| Aquisição proibida (vermelho) | Não pode ser comprado/servido em nenhuma idade |
| Oferta limitada > 3 anos e proibida ≤ 3 anos (amarelo) | Bloqueado para Creche/CEINF; limitado para os demais |
| Oferta limitada para todas as idades | Permitido, mas com frequência/quantidade restrita |

> No sistema, `classificacao_restricao` deve ser um **campo explícito** no cadastro do alimento
> (enum), não uma cor — cor não é auditável nem filtrável.

### 2.2 Ficha Técnica de Preparo (formato oficial)

Por receita, uma linha por ingrediente:

| Campo oficial | Fórmula | Significado |
|---|---|---|
| Nome (ingrediente) | — | busca na Tabela de Alimentos |
| Per capita (bruto) | input | quantidade crua comprada, por aluno |
| Per capita (líquido) | input | quantidade efetivamente aproveitada após limpeza/preparo |
| Fator de correção | `= bruto / líquido` | quanto se perde no preparo (ex.: casca, aparas) |
| Medida caseira | input | ex.: "1 xícara", "2 colheres" |
| Custo unitário | input | R$ por kg/L do ingrediente |
| Energia, Proteína, Lipídeos, Carboidratos, Cálcio, Ferro, Retinol, Vit. C, Sódio | `= VLOOKUP(nome, Tabela de Alimentos) × per_capita_líquido / 100` | valor nutricional da porção, calculado sobre o **líquido**, não o bruto |
| Rendimento total (g) / Fator de cocção | `= peso_bruto_total / peso_final_pronto` | quanto o preparo rende após cocção |

O **per capita (bruto)** desta tabela é exatamente o valor que a planilha `CÁLCULO AGOSTO` chama de
`PC` — a diferença é que aqui ele nasce calculado a partir do rendimento real da receita
(fator de correção × fator de cocção), e lá é só um número já pronto, copiado manualmente.

### 2.3 Cardápio Diário (Segunda a Sexta)

Uma linha por item servido em cada refeição/horário do dia, com quantidade ofertada (g) e nutrientes
calculados automaticamente:

```
nutriente = VLOOKUP(nome_do_alimento, 'Tabela de alimentos', coluna_nutriente) × quantidade(g) / 100
```

Com linha de total diário (soma de todos os itens do dia).

### 2.4 Adequação Nutricional Semanal

Agrega os totais diários (Segunda a Sexta) em uma média semanal e confere contra tabelas de
referência oficiais (DRI), segmentadas por **faixa etária/modalidade** e por **quantas refeições/dia**
a escola oferece (20% / 30% / 70% das necessidades nutricionais diárias, conforme 1/2/3 refeições):

- Creche (7–11 meses), Creche (1–3 anos)
- Pré-escola, Ensino Fundamental (6–10 e 11–15 anos), Ensino Médio
- EJA (19–30 e 31–60 anos)

O breakdown de energia por macronutriente usa os **fatores de Atwater**: proteína e carboidrato
×4 kcal/g, lipídeo ×9 kcal/g — e o `% VET` (percentual do Valor Energético Total) de cada um deve
cair dentro da faixa de referência (ex.: proteína 10%, lipídeo 15–30%, carboidrato 55–65% do VET,
variando por faixa etária).

### 2.5 Custo do Cardápio

```
custo_total_por_aluno = custo_unitário_ingrediente / unidade_de_compra × per_capita_bruto(g) / 1000
custo_mensal = Σ(custo_total_por_aluno da receita) × nº_de_alunos × vezes_servida_no_mês
```

---

## 3. Camada Logística — Guia de Compra (planilhas municipais)

Esta camada já estava documentada na primeira versão deste padrão a partir de
`PER CAPITA 2026 CONSULTA.xlsx`, `CÁLCULO AGOSTO 2026.xlsx` e `PÃES E OVOS PRA ANDREIA.xlsx`.
Resumo (ver histórico de decisões abaixo para o detalhamento completo):

```
Quantidade Total = Nº de Alunos × Per Capita (bruto) × Frequência ÷ Fator de Conversão
```

| `tipo_calculo` | Fórmula | Exemplo real |
|---|---|---|
| **PESO** | `alunos × pc(g) × freq ÷ 1000` | Tomate: 3505 × 55g × 1 = 192,775 kg |
| **CONTAGEM_POR_PESO_MÉDIO** | `alunos × pc(g) × freq ÷ peso_médio_unidade(g)` | Ovo (50g): 282 × 70g × 2 ÷ 50 = 789,6 und |
| **UNIDADE_FIXA** | `alunos × freq` | Pão: 282 × 6 = 1.692 und (per capita só informativo) |

Agregada por Região → Tipo de Unidade → Produto → Fornecedor, com subtotal por grupo e total geral.

Esta camada consome o **per capita (bruto)** que, na camada nutricional, é resultado do cálculo da
Ficha Técnica de Preparo (seção 2.2) — não deveria ser um valor digitado à parte.

---

## 4. Hierarquia de entidades (modelo consolidado)

```
Alimento (Tabela de Alimentos): nome, composição nutricional/100g, classificacao_restricao
   ↓ usado em
Ficha Técnica de Preparo (receita): ingredientes com per_capita_bruto/líquido, fator_correção,
   custo_unitário, rendimento, fator_cocção → nutrientes calculados e custo por porção
   ↓ compõe
Cardápio (Segunda a Sexta, por Refeição/Horário): lista de preparações/alimentos servidos
   ↓ agregado em
Adequação Nutricional Semanal: por faixa etária/modalidade, vs. referência DRI
   ↓ e também alimenta
Tipo de Unidade (EMEI Urbana, Escola Rural, Entidade, Integral Urbana, CEINF...)
   └─ Escola (pode ter per capita próprio — override do Tipo de Unidade)
Ficha de Per Capita (compra) = Produto × (Tipo de Unidade OU Escola) × Refeição
   → per_capita (= per capita bruto da Ficha Técnica), frequência, vigência (início/fim)
   ↓ calcula
Guia de Compra Mensal = Σ(alunos × per_capita × frequência ÷ fator_conversão), por Fornecedor
Custo Mensal = Σ(custo_por_aluno da preparação × alunos × vezes_servida_no_mês)
```

### Regra de override (per capita por escola)

1. Todo produto tem um per capita padrão por Tipo de Unidade (herdado da Ficha Técnica de Preparo).
2. Uma Escola específica pode ter um registro de per capita próprio, que **sempre prevalece** sobre o
   padrão do Tipo de Unidade no cálculo da guia.
3. A interface deve sinalizar visualmente quais escolas têm per capita diferenciado (hoje isso só
   existe como aviso manual em célula, ex.: aba `LEITENESTOGENO`: *"CADA EMEI TERÁ PER CAPITA
   DIFERENCIADO — NÃO USAR O PER CAPITA GERAL"*).

---

## 5. Regras de negócio (RN)

O protótipo já define RN01–RN06 (`Perfil_Nutricionista_SEMED_MVP.md`). Este padrão adiciona:

**Camada nutricional (do modelo oficial FNDE):**

- **RN13** — Nenhum alimento com `classificacao_restricao = Aquisição proibida` pode ser adicionado a
  uma ficha técnica ou cardápio.
- **RN14** — Um alimento `Oferta limitada/proibida ≤ 3 anos` não pode ser usado em cardápio de Creche
  (0–3 anos); o sistema deve bloquear, não apenas alertar.
- **RN15** — Per capita (bruto) de uma ficha técnica é sempre calculado a partir do per capita
  (líquido) e do fator de correção — nunca digitado diretamente; o fator de correção deve ter fonte
  documentada (tabela de fatores de correção do próprio FNDE) quando não for medido localmente.
- **RN16** — A adequação nutricional semanal (% VET por macronutriente) deve ser recalculada
  automaticamente a cada alteração de cardápio e comparada contra a referência da faixa
  etária/modalidade da escola; cardápios fora da faixa devem ser sinalizados antes da publicação
  (reforça RN06 — *"nenhum cardápio pode ser publicado sem validação nutricional"*).
- **RN17** — Custo mensal do cardápio é recalculado a cada alteração de per capita, custo unitário ou
  número de alunos — nunca um valor congelado.

**Camada logística (herdadas/atualizadas da primeira versão deste padrão):**

- **RN07** — Todo produto deve ter `tipo_calculo` definido (PESO / CONTAGEM_POR_PESO_MÉDIO /
  UNIDADE_FIXA); sem isso o sistema não gera guia.
- **RN08** — Per capita de Escola (override) sempre prevalece sobre o do Tipo de Unidade.
- **RN09** — Alteração de per capita cria um novo registro com vigência; não sobrescreve o anterior.
- **RN10** — Código de produto único e obrigatório antes de gerar guia.
- **RN11** — Per capita obrigatório e numérico antes da vigência iniciar (equivalente a impedir o
  `#REF!` hoje presente nas planilhas de origem).
- **RN12** — Dados obsoletos são arquivados, nunca deixados como abas/registros "não usar" ativos.

---

## 6. Mapeamento para as telas do protótipo

| Tela existente | O que este padrão formaliza |
|---|---|
| **TELA 02 — Cadastro de Produtos** | Vira "Cadastro de Alimentos": nutrientes/100g, `classificacao_restricao`, `tipo_calculo`, `peso_medio_unidade`, código (RN07, RN10, RN13, RN14) |
| **TELA 03 — Fichas Técnicas** | Passa a seguir o layout oficial: per capita bruto/líquido, fator de correção, custo unitário, nutrientes calculados por VLOOKUP, rendimento e fator de cocção (seção 2.2) |
| **TELA 04 — Gestão de Cardápios** | Estrutura diária por Refeição/Horário (seção 2.3), com nutrientes agregados automaticamente |
| **TELA 05 — Planejamento Alimentar → Cálculo Automático** | Fórmula da seção 3, usando o per capita bruto vindo da Ficha Técnica (RN15) |
| **Novo (sugerido): Adequação Nutricional** | Tela de comparação cardápio × referência DRI por faixa etária/modalidade (seção 2.4, RN16) — hoje não existe no protótipo, mas é o coração do modelo oficial do FNDE |
| **Novo (sugerido): Custos do Cardápio** | Custo por preparação × alunos × frequência mensal (seção 2.5, RN17) — também ausente hoje |
| **Novo (sugerido): Histórico de Per Capita** | Consulta às vigências (RN09) |

---

## 7. Anexo — Tabela de referência nutricional (DRI) extraída da planilha oficial

Valores oficiais de energia e macronutrientes por faixa etária/modalidade, conforme
`Planilha_PlanPNAE_versao_4atualizada221121 (1).xlsx`, abas `Média semanal (Creche)` e
`Média semanal (> 3 anos)`. O sistema deve carregar esta tabela como dado de referência (seed),
não como cálculo — são valores fixos definidos pelo FNDE, usados para validar a adequação de cada
cardápio (RN16).

> % do VET (Valor Energético Total) por macronutriente: Proteína 10%, Lipídeos 15–30% (varia por
> faixa), Carboidratos 55–65% (varia por faixa) — aplicados sobre a energia de referência abaixo.

### Creche (0–3 anos) — referência tem colunas extras de Cálcio, Ferro, Retinol, Vit. C

| Faixa etária | Nº refeições/dia | % necessidade/dia | Energia (kcal) | Proteína (g) | Lipídeos (g) | Carboidratos (g) | Ca (mg) | Fe (mg) | Vit. A (µg) | Vit. C (mg) |
|---|---|---|---|---|---|---|---|---|---|---|
| Creche (7–11 meses) | 2 refeições | 30% | 203,4 | 5,085 | 6–8 | 27,97–33,05 | 78 | 2 | 150 | 15 |
| Creche (7–11 meses) | 3 refeições | 70% | 474,6 | 11,865 | 13–18 | 65,26–77,12 | 182 | 5 | 350 | 35 |
| Creche (1–3 anos) | 2 refeições | 30% | 303,6 | 7,59 | 8–12 | 41,75–49,34 | 150 | 1 | 63 | 4 |
| Creche (1–3 anos) | 3 refeições | 70% | 708,4 | 17,71 | 20–28 | 97,41–115,12 | 350 | 2 | 147 | 9 |

### > 3 anos — referência tem coluna de Sódio (não Cálcio/Ferro/Vit. A/C)

| Modalidade | Nº refeições/dia | % necessidade/dia | Energia (kcal) | Proteína (g) | Lipídeos (g) | Carboidratos (g) | Sódio (mg) |
|---|---|---|---|---|---|---|---|
| Pré-escola | 1 | 20% | 270,0 | 6,75 | 8–11 | 37,13–43,88 | 600 |
| Pré-escola | 2 | 30% | 405,0 | 10,125 | 11–16 | 55,69–65,81 | 800 |
| Pré-escola | 3 | 70% | 945,0 | 23,625 | 26–37 | 129,94–153,56 | 1400 |
| Fundamental (6–10a) | 1 | 20% | 328,6 | 8,215 | 9–13 | 45,18–53,40 | 600 |
| Fundamental (6–10a) | 2 | 30% | 492,9 | 12,3225 | 14–19 | 67,77–80,10 | 800 |
| Fundamental (6–10a) | 3 | 70% | 1150,1 | 28,7525 | 32–45 | 158,14–186,89 | 1400 |
| Fundamental (11–15a) | 1 | 20% | 473,2 | 11,83 | 13–18 | 65,07–76,90 | 600 |
| Fundamental (11–15a) | 2 | 30% | 709,8 | 17,745 | 20–28 | 97,60–115,34 | 800 |
| Fundamental (11–15a) | 3 | 70% | 1656,2 | 41,405 | 46–64 | 227,73–269,13 | 1400 |
| Ensino Médio | 1 | 20% | 543,4 | 13,585 | 15–21 | 74,72–88,30 | 600 |
| Ensino Médio | 2 | 30% | 815,1 | 20,3775 | 23–32 | 112,08–132,45 | 800 |
| Ensino Médio | 3 | 70% | 1901,9 | 47,5475 | 53–74 | 261,51–309,06 | 1400 |
| EJA (19–30a) | 1 | 20% | 476,6 | 11,915 | 7,94–15,89 | 65,53–77,45 | 600 |
| EJA (19–30a) | 2 | 30% | 714,9 | 17,8725 | 11,92–23,83 | 98,30–116,17 | 800 |
| EJA (19–30a) | 3 | 70% | 1668,1 | 41,7025 | 27,80–55,60 | 229,36–271,07 | 1400 |
| EJA (31–60a) | 1 | 20% | 459,0 | 11,475 | 7,65–15,30 | 63,11–74,59 | 600 |
| EJA (31–60a) | 2 | 30% | 688,5 | 17,2125 | 11,48–22,95 | 94,67–111,88 | 800 |
| EJA (31–60a) | 3 | 70% | 1607,0 | 40,1625 | 26,78–53,55 | 220,89–261,06 | 1400 |

> Nota: para EJA, o intervalo de lipídeos usa faixa 15–30% do VET (diferente das demais modalidades,
> que usam 25–35%) — conferido linha a linha na planilha oficial, não é erro de transcrição.

---

## 8. Checklist de qualidade ao migrar dados das planilhas atuais

- [ ] Nenhuma célula de per capita com fórmula quebrada (`#REF!`) — presente hoje em `PER CAPITA...xlsx`, abas `EMEIS` e `ALCÍDIO PIMENTEL`
- [ ] Abas "NÃO USAR" excluídas, não migradas (6 abas em `PER CAPITA...xlsx`)
- [ ] Todo alimento da Tabela de Alimentos classificado quanto à restrição de uso — hoje só existe como cor de célula, sem coluna de dado
- [ ] Todo produto de compra com `tipo_calculo` classificado (maioria PESO; conferir manualmente os por-unidade como pão e por-peso-médio como ovo)
- [ ] Escolas com per capita individual (ex.: EMEIs do `LEITENESTOGENO`, escolas rurais do `RURAIS`) migradas como overrides, não fundidas ao padrão do tipo
- [ ] Códigos de produto conferidos e sem duplicidade antes da primeira guia gerada pelo sistema
- [ ] Fator de correção de cada ficha técnica documentado (fonte: medição local ou tabela oficial de fatores de correção do FNDE)
