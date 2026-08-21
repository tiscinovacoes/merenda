# 🛠️ PROMPT DE EXECUÇÃO — Antigravity · Cardápio por período (mensal/quinzenal/semanal)

**Tarefa:** trocar a estrutura do cardápio de **semanal fixo** para **período configurável** (mensal padrão, sem travar quinzenal/semanal), no perfil **Nutricionista** e seus reflexos.
**Papel:** você é o desenvolvedor. O refinamento/PO já foi feito (Claude, com o cliente) e está **fechado** — não reabrir decisões.

---

## Leia primeiro (obrigatório, nesta ordem)
1. `F:\Nova cofre\ATIVIDADE_LOG.md` — topo (contexto do que já está no ar).
2. Este arquivo (decisões travadas + superfície de mudança).

## 🚦 Branch & publicação (regra de ouro — NÃO PUBLICAR SOZINHO)
- Trabalhe **somente** na branch **`fix/guias-entrega-e-limpeza-appjs`** (homologação). Commit/push **só nessa branch**.
- **NUNCA** faça push/merge para **`master`** (é PRODUÇÃO; a promoção `fix → master` é aprovação humana, feita por outra pessoa).

## ⚠️ NÃO recriar o que já existe
O épico de Expedição & Logística **está em produção** — não mexa nele além do necessário. O **`cardapioId` já se propaga** para OS/OE; **reaproveite**, não recrie. A grade semanal atual (`weeklyMenus` + `refeicoes:[{dia,tipo,item,kcal}]`) **continua sendo o tijolo** — você vai **empilhar N semanas**, não reescrever a grade.

## Contexto de arquitetura (regras que NÃO mudam)
- Front puro, sem build. `js/core_hub.js` (carrega por ÚLTIMO) + `js/modules/*.js`. `PAGE_RENDERERS[key] = (el)=>{el.innerHTML=…}` (nunca retornar string).
- **`SharedState`** (singleton + `localStorage` `saged_shared_state_v2` + EventBus). Mutar `SharedState._data.X` + `_persist()` (getters retornam cópia).
- **`docs/` é o deploy — manter `js/` ↔ `docs/` idênticos, arquivo a arquivo.**
- Padrão visual: `kpi-grid`/`kpi-card`, `card`, `data-table`, `tag`, `status-badge`.

---

## Decisões travadas (modelo)
1. **Estrutura:** cardápio = **N semanas distintas** (a grade seg–sex atual por semana). `semanal=1`, `quinzenal=2`, `mensal=4 ou 5`.
2. **Periodicidade por cardápio** (escolhida na **criação**): `mensal` (padrão) / `quinzenal` / `semanal`. Cardápios de períodos diferentes podem conviver.
3. **Mensal = nº de semanas conforme o calendário do mês** (4 ou 5). O cardápio tem **mês/ano de referência** (quinzenal = 2 semanas a partir de uma data; semanal = 1).
4. **Demanda/O.S. = por período inteiro** (soma das N semanas). **As entregas seguem fracionadas** por estoque/cobertura — **período do cardápio ≠ frequência de entrega**.
5. Defaults: dias **seg–sex**; semana parcial no começo/fim do mês tem os dias fora do mês **desabilitados**; **feriados** ficam para fase futura; labels "semanal/semana" mostram a **periodicidade real**; cardápios mock atuais **recomeçam** com exemplos mensais.

---

## Superfície de mudança (o que fazer)

### 1) Modelo de dados — cardápio com período + N semanas
**Arquivos:** `SharedState` em `js/core_hub.js` (`_data.menus`, `_data.weeklyMenus`, getters `getMenus/getCardapios/getWeeklyMenus` ~linha 612–615).
- No **cabeçalho do cardápio** (`menus`): adicionar `periodicidade` ('mensal'|'quinzenal'|'semanal'), `mesReferencia` (`{mes, ano}`) ou `dataInicio`/`dataFim`, e `numSemanas` (derivado do calendário — ver item 8).
- Na **grade** (`weeklyMenus`): cada entrada é **uma semana de um cardápio** — vincular `cardapioId` + `indiceSemana` (1..N). Manter `refeicoes:[{dia,tipo,item,kcal}]`.
- Helpers novos: `getSemanasDoCardapio(cardapioId)` (retorna as N semanas ordenadas), `getCardapio(cardapioId)`.
- **AC:** um cardápio resolve suas N semanas; `semanal`/`quinzenal`/`mensal` diferem só no `numSemanas`; nada quebra em quem lê `weeklyMenus`.

### 2) Criação de cardápio — escolher periodicidade + período
**Arquivos:** modal de novo cardápio (fluxo de `nutricionista_cardapios` em `js/modules/nutricao.js` + handlers em `js/core_hub.js`).
- No modal: seletor **Periodicidade** (mensal padrão / quinzenal / semanal) + **Mês/Ano** (ou data início). Ao confirmar, **gerar os N slots de semana** vazios (conforme item 8), já vinculados ao `cardapioId`.
- **AC:** criar um cardápio mensal gera as semanas certas do mês; quinzenal gera 2; semanal gera 1.

### 3) Planejador multi-semana (o coração)
**Arquivos:** `showMenuPlanner()` e o renderer da grade (hoje "Planejador Semanal", botão em `nutricao.js:1015`; grade em `js/core_hub.js`).
- Transformar o "Planejador Semanal" em **Planejador por período**: **navegação entre Semana 1…N** (abas/seletor), cada semana com a **grade seg–sex atual**. Renomear o botão para **"+ Abrir Planejador de Cardápio"**.
- Salvar cada semana na sua entrada de `weeklyMenus` (com `indiceSemana`).
- **AC:** dá pra montar as N semanas do cardápio, navegando entre elas; cada semana persiste; a grade diária é a mesma de hoje.

### 4) Motor de IA & demanda — por período
**Arquivos:** `AICardapioEngine.generateWeeklyMenu` (`core_hub.js:4228`), `calcularDemandaPorEscola` (`:4567`), pipeline que gera as **O.S. de expedição**.
- `generateWeeklyMenu` deve poder **gerar as N semanas** do período (ou gerar semana a semana e empilhar).
- `calcularDemandaPorEscola` deve **somar os dias de todas as N semanas** = **demanda por período inteiro**; a O.S. gerada carrega o `cardapioId` (já existe) e reflete o volume do período.
- **AC:** a demanda/O.S. de um cardápio mensal = soma das semanas; entregas continuam podendo ser fracionadas (não gerar entrega única obrigatória).

### 5) Telas de planejamento (Gestor e Escola)
**Arquivos:** `gestor_planejamento` (`gestor.js:738`, demanda "30/90 dias" fixa), `escola_planejamento` (`escolas.js:204`, `dias=['Seg'..'Sex']` + `getWeeklyMenus`).
- Mostrar o cardápio **por período** (as N semanas), não "a semana". Onde houver "30/90 dias" fixo, alinhar ao **período do cardápio**.
- **AC:** Gestor e Escola veem as N semanas do período vigente; nada assume 1 semana só.

### 6) Impressões / visualizações / relatórios
**Arquivos:** `visualizarEImprimirCardapio`, `abrirRelatorioMensal4Paginas`, e as tabelas seg–sex hardcoded (`core_hub.js:5086–5441`).
- Generalizar as impressões para **N semanas** (o "Relatório Mensal (4 Páginas/Mês)" já assume 4 semanas = 4 páginas — estender para o `numSemanas` real).
- Trocar grids **hardcoded** por render a partir das semanas reais do cardápio.
- **AC:** imprimir um cardápio mensal sai com as N semanas; nada seg–sex chumbado.

### 7) Labels, filtros e contadores
**Arquivos:** badges/contadores (`core_hub.js:1962`), filtros que citam "semana/mês/ano" (Cobertura e planejamento).
- Labels "semanal/semana" → mostram a **periodicidade real** do cardápio.
- Filtros por cardápio passam a considerar a **periodicidade do próprio cardápio**.
- **AC:** nenhuma tela afirma "semanal" para um cardápio mensal; contadores batem com `numSemanas`.

### 8) Cálculo das semanas do mês (semana parcial)
- `numSemanas` = número de **semanas úteis (seg–sex)** que tocam o mês de referência (4 ou 5).
- Na primeira/última semana, os **dias fora do mês ficam desabilitados** na grade (não editáveis, não contam na demanda).
- **AC:** meses com 5 semanas úteis geram 5; dias fora do mês aparecem desabilitados e não entram no cálculo.

---

## Ordem de trabalho sugerida
**(1) Modelo** → **(8) cálculo de semanas** → **(2) criação** → **(3) planejador multi-semana** → **(4) demanda/O.S.** → **(5) planejamento Gestor/Escola** → **(6) impressões** → **(7) labels/filtros**. O modelo é o "fio" que destrava o resto.

## Definition of Done (a cada item)
1. `npx playwright test` **verde (≥ 83/83)** + `tests/smoke-renderers.spec.js` **0 falhas**.
2. **Sem erro no console** (verifique de fato — teste criar cardápio mensal e quinzenal).
3. **`docs/` sincronizado** arquivo a arquivo.
4. **Nova entrada no topo** de `F:\Nova cofre\ATIVIDADE_LOG.md`.
5. Commits pequenos e descritivos **na branch `fix/…`** (nunca `master`). **Não** commitar chave. **Não** mexer nas ~60 screenshots.

## Como reportar
Ao concluir cada item, registre no log e devolva um resumo com evidência (nº de testes, prints). Ambiguidade **não coberta aqui** → **pare e registre a dúvida no log**, não decida sozinho.
