# PROMPT DE EXECUÇÃO — Correção Integral do SUALE

> **Origem:** Laudo de Varredura SUALE (2026-08-17), versão com adendo do trabalho paralelo do Antigravity.
> **Regra mestra:** nada entra "pela metade". Cada correção só é dada como concluída quando o **caminho completo** está ligado — dado → SharedState → renderer → UI → todos os perfis a jusante — e verificado em execução real no navegador.

---

## 0. CONTEXTO OBRIGATÓRIO ANTES DE COMEÇAR

Você vai corrigir o **SUALE** (Sistema de Gestão da Alimentação Escolar — SEMED Campo Grande/MS), SPA em HTML/CSS/JS puro, sem framework, com Supabase como banco e um singleton `SharedState` persistido em `localStorage`.

**Arquivos do sistema:** `app.js` (~13.200 linhas, monolito com todos os renderers), `db.js` (camada Supabase), `sprint_abc.js` (IIFE carregada depois, estende `PAGE_RENDERERS`), `ai_cardapio_engine.js`, `alimentos.js`, `index.html`, `styles.css`.

**Arquitetura de navegação:** `PAGE_RENDERERS[`${perfil}_${pagina}`]` — o router em `renderPage()` faz fallback silencioso para o dashboard do perfil se a chave não existir. `PROFILES` define o menu de cada um dos 10 perfis.

**Coordenação multi-agente — LEIA ANTES DE TOCAR EM QUALQUER ARQUIVO:**
Este projeto é trabalhado por **Claude** e por **Antigravity** simultaneamente. Em 2026-08-17 os dois editaram o repositório no mesmo intervalo de tempo.
1. Leia `F:\Nova cofre\SUALE\ATIVIDADE_LOG.md` antes de começar — é o log compartilhado.
2. Registre uma entrada no **topo** do log ao concluir cada FASE, seguindo o template do próprio arquivo.
3. **Não confie no log como prova de que algo existe.** Auditoria de 2026-07-28 achou 3 regressões descritas como prontas; a varredura de 2026-08-17 achou 2 itens declarados na v2.4.1 que não estavam no código. Sempre confirme por `grep`/leitura antes de assumir.

**Verificação:** sirva a pasta consolidada e teste no navegador. Não dê nada como pronto por leitura de código.
```bash
npx serve . -l 8090 --no-clipboard
```

---

## FASE 0 — UNIFICAR AS DUAS CÓPIAS (M8) · **BLOQUEIA TUDO**

**Problema:** existem duas cópias vivas e versionadas do sistema — a **raiz** (`F:\Projetos\vigia educa\`) e **`prototype/`**. Em 17/08 divergiam em 4 dos 5 arquivos (só `styles.css` batia). O Antigravity desenvolve em `prototype/`; `npm run serve` e todo o Playwright apontam para `prototype/`; mas a raiz também está no git.

**Decisão do usuário (M8):** *"veja a última versão e unifique"*.

**A última versão é `prototype/`** — comprovado: `prototype/app.js` tem 13.199 linhas contra 13.141 da raiz, contém `userId` (20 ocorrências), `criadoPorUserId` (11) e o fallback `escola`→`school`, tudo ausente na raiz.

**Execute:**
1. Faça backup: `git add -A && git commit -m "chore: snapshot antes da unificação das cópias"`.
2. Promova `prototype/` como fonte única: copie `prototype/{app.js,db.js,index.html,sprint_abc.js,ai_cardapio_engine.js}` para a raiz, sobrescrevendo.
3. Confira que a raiz continua funcional no navegador antes de seguir.
4. Elimine a duplicação: apague a pasta `prototype/` **ou** transforme-a em link/alias. Não deixe duas cópias editáveis.
5. Aponte `package.json` (`"serve": "npx serve . -l 8080 --no-clipboard"`) e `playwright.config.js` para a cópia única.
6. Rode a suíte: `npx playwright test`. Corrija o que quebrar por causa do caminho.

**Critério de conclusão:** `md5sum` não encontra mais pares divergentes; existe **uma** cópia; testes rodam contra ela.

---

## FASE 1 — FUNDAÇÃO DE DADOS (C5, C6, C7, M9)

### C5 · Unificar em um único projeto Supabase e apagar tabelas inúteis
**Decisão do usuário:** *"vamos unificar em um único projeto, assim as tabelas se unificam e têm utilidade; as tabelas que não têm utilidade devem ser apagadas para liberar espaço"*.

**Situação atual:** `db.js` cria **dois** clientes:
- `_sb` → `xszqqqyvdzoyxokkuqix` — tem `schools, orders, atas, empenhos, estoque_central, fichas_tecnicas, lista_compras, os_estoque_central, os_fornecedores, alimentos_pnae`
- `_sb2` → `oxanubfolkoulklrhrpr` — tem **só** `atas` (vazia)

`db.js` consulta `schools` (linha ~151), `escola_usuarios` (~173) e `restricoes_alimentares` (~223–260, inclusive *inserts*) **no `_sb2`**, onde nenhuma delas existe. Tudo cai em mock silencioso e o badge segue exibindo "Supabase • Ao Vivo".

**Execute:**
1. Adote **`xszqqqyvdzoyxokkuqix`** como projeto único (é o que tem dados reais).
2. Crie as **12 tabelas faltantes**: `deliveries, menus, weekly_menus, productions, incidents, stock_adjusts, restricoes_alimentares, nfs_recebidas, ata_products, comprovantes, consumption_records, escola_usuarios`. Use `supabase_schema_v3.sql` como base e versione a migration nova.
3. Apague do projeto `oxanubfolkoulklrhrpr` a tabela `atas` vazia e desative o projeto.
4. Remova `_sb2`, `SUALE_URL` e `SUALE_KEY` do `db.js`; redirecione as 7 chamadas de `_sb2` para `_sb`.
5. **Faça o badge dizer a verdade:** `updateDbStatusBadge()` deve refletir falha real de tabela, não só "cliente criado". Se qualquer `_fetch` retornar `null`, o badge vira "Modo Demo" com o motivo no `title`.
6. Troque o `catch` silencioso do `_fetch` por um log agregado visível no console.

**Critério:** as 22 tabelas respondem; nenhuma referência a `_sb2`; badge reflete o estado real.

### C6 · Criar o banco das escolas com as 8 piloto e corrigir o bug
**Decisão do usuário:** *"faça o banco das escolas, corrija, inclua as 8 escolas piloto, corrija o bug das escolas"*.

**O bug:** interseção **zero** entre as escolas do login e as do banco.

| Login / `_PILOT_SCHOOLS` (correto) | Supabase `schools` (a substituir) |
|---|---|
| EM ADV. DEMOSTHENES MARTINS | EM Arlindo Lima |
| EM PROF. ANTÔNIO LOPES LINS | EM Elpidio Reis |
| EMRTI AGRICOLA GOV. ARNALDO ESTEVAO DE FIGUEREDO | EM Franklin Roosevelt |
| EMTI PROFª IRACEMA MARIA VICENTE | EM Hercules Maymone |
| EMEI CLEOMAR BAPTISTA DOS SANTOS | EM Jose Rodrigues Benfica |
| EMEI PROFª EMY ISHIDA NASCIMENTO NOGUEIRA | EM Kame Adania |
| EMEI CLOTILDE CHAIA | EM Licurgo de Oliveira Bastos |
| EMEI ELEODES ESTEVAN | EM Professora Goncalina Faustina |

**Execute:**
1. Limpe `schools` e semeie as **8 escolas piloto reais**, preservando `id` 1–8 (é o que o dropdown do login usa em `index.html`).
2. Cada escola precisa dos campos que o app consome: `name, region, students, attendance_avg, attendance_pct, grade_levels, meals_per_day, monthly_budget, stock_status`. Os valores reais estão em `ATTENDANCE_DATA` no `db.js` e nas escolas piloto de `app.js`.
3. Semeie também as 3 pessoas por escola (`diretor`, `merendeira`, `respEstoque`) na tabela `escola_usuarios`, com o `userId` que o Antigravity criou na v2.4.0.
4. **Elimine a fonte dupla:** hoje as escolas vivem em 3 lugares — `index.html` (dropdown fixo), `_PILOT_SCHOOLS` (JS) e Supabase. Faça o dropdown do login ser **populado dinamicamente** a partir do banco (com o array atual como fallback offline).
5. Confirme que `hydrateData()` não sobrescreve `state.selectedSchool` depois do login.

**Critério:** logar como Diretor de cada uma das 8 escolas mostra o nome e os números corretos, vindos do banco.

### C7 · Consertar o insert de pedidos
**Decisão do usuário:** *"conserte o insert"*.

**O bug:** o app envia `{ school, date, status, cooperative, value }`; a tabela `orders` tem `{ id, school_id, school_name, date, status, cooperative, value, items, justification, created_at }`. Resposta real: `Could not find the 'school' column of 'orders' in the schema cache`. O `try/catch` tem corpo vazio (`/* silencia */`) e a tela exibe "✅ Pedido enviado!" mesmo com 100% de falha.

**Execute:**
1. Crie um mapeador único `mapOrderToDb(order)` em `db.js` que traduza o objeto canônico para as colunas reais (`school` → `school_name`, `schoolId` → `school_id`, `itens` → `items`), incluindo `criado_por_user_id`.
2. Use esse mapeador em **todos** os pontos de escrita de pedido.
3. **Acabe com o `catch` vazio.** Falha de gravação precisa: registrar no console, marcar o pedido como `sincronizado: false` no `SharedState`, e a mensagem na tela deve dizer que ficou salvo localmente e será sincronizado — nunca afirmar sucesso pleno.
4. Implemente uma fila de re-sincronização para os pendentes.

**Critério:** criar pedido pela tela da Escola grava de fato em `orders`; derrubar a rede exibe aviso honesto e re-sincroniza ao voltar.

### M9 · Corrigir duplicatas do seed
**Decisão:** *"corrija"*. Em `_defaults()`, `restr-107` (EMTI PROFª IRACEMA · Doença celíaca · 30) aparece **duas vezes**, inflando a contagem da escola 4. Remova a duplicata. No mesmo bloco, o merge de `init()` re-semeia arrays esvaziados pelo usuário — ajuste para só semear quando a chave **não existir**, nunca quando existir vazia.

---

## FASE 2 — NÚCLEO DO FLUXO (C2, C3, A5, A6)

### C2 · Colisão de IDs — **a correção de maior retorno de toda a lista**
**Você pediu explicação. Aqui está.**

Todo registro do sistema recebe id assim:
```js
id: 'ord-' + Date.now()
```
`Date.now()` devolve o relógio em **milissegundos**. Dois registros criados dentro do mesmo milissegundo — o que é o caso normal quando o sistema gera Ordens de Serviço em lote, ou quando alguém clica duas vezes — recebem **exatamente o mesmo id**.

Como todos os métodos localizam o registro por
```js
this._data.orders.find(x => x.id === orderId)
```
e `.find()` devolve **o primeiro que casar**, a operação sempre cai no primeiro da lista — não naquele em que você clicou.

**Prova colhida na varredura:** criei 3 pedidos (escolas E1, E2, E3). Os três saíram com o id `ord-1786970773536`. Mandei marcar o pedido da **E1** como "Entregue". O sistema marcou o da **E3**.

**Por que é grave:** confirmar entrega, aceitar pedido, distribuir para agricultor, dar baixa em empenho — tudo usa esse `.find()`. O usuário vê a ação acontecer na linha errada, sem nenhum erro. E são **22 tipos de registro** com esse padrão: pedidos, entregas, fichas, produções, empenhos, atas, NF-e, consumo, ocorrências, restrições, alunos e logs de auditoria. Pior: `'emp-'` e `'adj-'` são usados por dois métodos diferentes cada, então há colisão até entre entidades distintas.

**Execute:**
1. Crie um gerador único:
```js
const novoId = (prefixo) => `${prefixo}-${crypto.randomUUID()}`;
```
2. Substitua as **27 ocorrências** de `'prefixo-' + Date.now()` por `novoId('prefixo')`. Confira: `grep -c "' + Date.now()" app.js` deve dar **0**.
3. Garanta prefixos únicos por entidade (resolva o `emp-` e o `adj-` duplicados).
4. **Migração dos dados existentes:** o `localStorage` dos usuários já tem registros com ids colididos. No `init()`, detecte ids repetidos e re-emita ids únicos preservando os vínculos (`orderId` nas deliveries, `empenhoId` nas NFs, etc.). Sem isso, quem já usou o sistema continua quebrado.
5. Se decidir bumpar a chave para `saged_shared_state_v3`, faça migração — não descarte dados sem avisar.

**Critério:** criar 5 registros em laço e confirmar 5 ids distintos; marcar o 1º e verificar que só o 1º mudou.

### C3 + A5 · Unificar o schema do pedido
**Decisão do usuário (C3):** *"corrija o caminho para chegar"*. **(A5):** *"após C3 executado, resolva A5"*.

**O bug:** três telas gravam pedido com três nomes de campo diferentes, e `cooperativa_pedidos` filtra por `o.cooperative`:

| Origem | Campos | Cooperativa recebe? |
|---|---|---|
| Escola (`escola_pedidos`) | `school` · `cooperative` · `itens` | ✅ sim |
| Diretor (`enviarPedidoDiretor`) | `school` · **`coop`** · **`items`** | ❌ **não** |
| Gerador de OS da IA | **`escola`** · *sem cooperative* · `itens` | ❌ **não** |
| Tabela `orders` (Supabase) | `school_name` · `school_id` · `items` | 4º schema |

O Antigravity já mitigou parte disso em `prototype/` (fallback `escola`→`school` + `schoolId`), mas **o campo `coop` do Diretor continua sem tratamento** — então o pedido do Diretor, que é o perfil real do piloto, segue sem chegar ao fornecedor.

**Execute:**
1. Defina o **contrato canônico** do pedido, documentado no topo do `SharedState`:
   `{ id, numero, schoolId, school, cooperative, itens[{produto,qtd,unidade}], value, status, date, solicitante, criadoPorUserId, driver, sincronizado }`
2. Normalize **na entrada**, dentro de `addOrder()` — não nos getters. Aceite e converta: `escola`→`school`, `coop`→`cooperative`, `items`→`itens`, resolvendo `schoolId` pelo nome.
3. Corrija as **3 telas de origem** para já gravarem no formato canônico. Não deixe a normalização ser a única defesa.
4. Elimine o fallback dos getters depois que as origens estiverem corretas (evita mascarar regressão futura).
5. **A5 sai de graça aqui:** com o contrato garantido, some o literal `undefined` das colunas Escola em `gestor/pedidos`, `cooperativa/pedidos` e `estoque/separacao`. Ainda assim, ponha `?? '—'` nos templates como rede de segurança.

**Critério:** criar pedido pelos 3 caminhos (Escola, Diretor, gerador de OS) e confirmar que os 3 aparecem na Cooperativa, no Gestor e no Estoque, com o nome da escola correto.

### A6 · Fechar o ciclo entrega → estoque
**Decisão:** *"ajuste para que funcione, lembrando de linkar todos os caminhos para que seja funcional"*.

**O bug:** após `confirmDelivery()`, `getSchoolStockItem(escola, produto)` devolve `null`. O estoque da escola nunca recebe a mercadoria.

**Execute — a cadeia inteira:**
1. `confirmDelivery()` passa a: dar **entrada no estoque da escola** por produto; **gerar lote** com `validade`, `numeroLote` e `dataEntrada`; registrar em `stockAdjust` como log de auditoria; anexar `criadoPorUserId` e o recebedor.
2. Isso destrava, em cascata — **verifique cada uma**:
   - `resp_estoque/validades` (FEFO) deixa de dizer "confirme uma entrega para gerar lotes"
   - `escola/estoque` e `diretor/estoque` mostram o saldo novo
   - `escola/historico` registra o evento
   - a sugestão automática de pedido passa a considerar o saldo real
   - o consumo lançado pela merendeira abate desse saldo
3. Ligue também a baixa: `addConsumo()` deve debitar o lote mais antigo (FEFO) e disparar alerta de estoque crítico.

**Critério:** pedido → entrega → confirmação → estoque sobe → consumo lançado → estoque desce → sugestão de novo pedido reflete o saldo. Ciclo fechado, sem intervenção manual.

---

## FASE 3 — NAVEGAÇÃO E TELAS (A1, A2, A7, M1, M3)

### A1 · Estruturar o perfil escolar
**Decisão:** *"monte a estrutura para executar e corrigir"*.

**O problema:** `PROFILES.escola` existe com 9 itens de menu, mas o login sempre resolve "Escola" para `diretor`/`merendeira`/`resp_estoque` — o perfil nunca é ativado. Efeito: a tela **Planejamento Alimentar da escola** (`escola_planejamento`) não está no menu de nenhum sub-perfil escolar; só é alcançável pela **Cooperativa** ("Planejamento de Entregas") e pelo **Agricultor** ("Calendário").

**Execute:**
1. Decida e documente: `escola` vira **base compartilhada** dos 3 sub-perfis (não um perfil logável). A memória do projeto já registra que "o perfil `escola` genérico foi eliminado; `diretor` é o master" — siga isso.
2. Monte a matriz explícita de permissões — qual sub-perfil vê qual tela:

| Tela | Diretor | Resp. Estoque | Merendeira |
|---|---|---|---|
| Dashboard | ✅ próprio | ✅ próprio | ✅ próprio |
| Planejamento Alimentar | ✅ | — | — |
| Estoque | ✅ | ✅ edita | ✅ leitura |
| Consumo | ✅ vê | ✅ lança | ✅ lança |
| Pedidos | ✅ cria | ✅ vê | — |
| Entregas | ✅ | ✅ confirma | ✅ confere |
| Cardápio | ✅ vigente | — | ✅ do dia |
| Restrições / Histórico / Relatórios | ✅ | parcial | — |

3. Acrescente **Planejamento Alimentar** ao menu do Diretor.
4. Remova `PROFILES.escola` da lista de perfis logáveis, mantendo os renderers `escola_*` como base dos aliases.

### A2 · Corrigir os aliases que vazam entre perfis
**Decisão:** *"corrija"*. Cada item abaixo abre hoje a tela de outro perfil:

| Perfil / item | Rótulo | Abre hoje | Deve abrir |
|---|---|---|---|
| `cooperativa/estoque` | Estoque Consolidado | Estoque **Municipal** (tela do Gestor, rede inteira) | só o estoque da própria cooperativa |
| `cooperativa/entregas` | Entregas | Recebimento de uma escola | entregas que a cooperativa deve fazer |
| `cooperativa/planejamento` | Planejamento de Entregas | Planejamento Alimentar da escola | agenda de entregas por rota/data |
| `agricultor/entregas` | Entregas | Recebimento de uma escola | entregas do próprio agricultor |
| `agricultor/calendario` | Calendário | Planejamento Alimentar da escola | calendário de colheita/entrega |
| `agricultor/escolas` | Escolas que Atendo | **todas** as escolas | só as que ele atende |
| `merendeira/dashboard` | Painel da Merendeira | dashboard genérico da escola | painel próprio da cozinha |
| `merendeira/cardapios` | Cardápio do Dia | Gestão de Cardápios (edição) | cardápio do dia, leitura |
| `diretor/cardapios` | Cardápio Vigente | Gestão de Cardápios (edição) | cardápio vigente, leitura |
| `cooperativa`/`agricultor`/`nutricionista` `/relatorios` | Relatórios | mesma tela genérica nos 3 | relatórios por perfil |

**Atenção — risco de exposição:** `cooperativa/estoque` e `agricultor/escolas` entregam a um **fornecedor externo** dados de toda a rede municipal. Trate como prioridade dentro desta fase.

**Execute:** dê renderer próprio a cada item, com escopo filtrado pela entidade logada. Onde o reaproveitamento fizer sentido, passe um **parâmetro de escopo** em vez de alias cego (ex.: `renderEstoque(el, { escopo: 'cooperativa', id })`).

### A7 · Unificar "Lista de Compras"
**Decisão:** *"unifique em um item só, lembrando de linkar todos os caminhos"*.

Hoje o menu do Gestor tem **dois itens com o mesmo rótulo**: `lista-compras` (definido em `app.js`, mostra "Nenhuma lista carregada") e `listacompras` (injetado por `sprint_abc.js`, tela funcional de 11 KB).

**Execute:**
1. Mantenha **uma** tela — a funcional do `sprint_abc.js` é a base; incorpore o que a outra tiver de útil (integração Supabase `lista_compras`).
2. Remova o item órfão do array de menu em `app.js`.
3. Corrija a injeção do `sprint_abc.js` para checar duplicidade por **rótulo**, não só por `id`, evitando que o problema volte.
4. Reaponte todos os `navigateTo(...,'lista-compras')` e `'listacompras'` para o id sobrevivente. `grep` nos dois.

### M1 · Renderers redefinidos — avaliar e limpar
**Decisão:** *"veja a funcionalidade se ainda é necessário, se não, exclua"*.

4 renderers são atribuídos mais de uma vez; a última atribuição vence e as anteriores são **código morto** (~291 linhas). Editar o bloco errado não muda nada na tela — armadilha de manutenção.

| Renderer | Bloco morto (raiz) | Vence |
|---|---|---|
| `gestor_escolas` | 1866–1956 | 7014 |
| `gestor_atas` | 2467–2561 | 11137 |
| `nutricionista_restricoes` | 6096–6191 e 7427 | 10369 |
| `nutricionista_escolas` | 6896–6908 | 7016 |

*(as linhas deslocam ~+58 na cópia `prototype/`)*

**Execute:** compare cada bloco morto com o vencedor. O antigo `gestor_atas`, por exemplo, tem lógica de `ataTotais()`, AF/chamada pública e liquidação que **pode não estar** no vencedor — se houver funcionalidade só no morto, **migre antes de apagar**. Depois exclua os blocos mortos e confirme que as telas seguem idênticas.

### M3 · Remover telas órfãs
**Decisão:** *"retire as telas"*. Sem entrada de menu em nenhum perfil: `escola_restricoes`, `gestor_restricoes`, `escola_escolas`, `nutricionista_simulacoes`. Antes de apagar, confirme por `grep` que nenhuma outra tela as chama como alias ou via `navigateTo`.

---

## FASE 4 — FUNCIONALIDADES FALTANTES (C4, A3, A4, A8, A9)

### C4 · Guias de Entrega & Distribuição — identificar e executar
**Decisão:** *"identifique a funcionalidade da tela para executar"*.

**Funcionalidade identificada (li o código):** a tela `nutricionista_guiasentrega` é a **emissão de ordens de fornecimento fracionadas**. Ela deve, por unidade escolar: calcular a remessa a partir do **per capita** e da **frequência de refeições**, aplicar **trocas por sazonalidade**, filtrar por **rota**, e gerar a guia de entrega parcelada. Cabeçalho: *"Emissão de ordens de fornecimento fracionadas por per capita, frequências e trocas por sazonalidade"*.

**Por que está em branco:** ela chama `SharedState.getCardapios()`, método **que nunca foi definido**. Existem `getMenus()` e `getWeeklyMenus()`, não `getCardapios`. A tela quebra na primeira linha e renderiza 0 bytes.

**O resto da tela está pronto:** `window.renderizarGuiaEscola` e `window.filtrarEscolasPorRotaGuia` existem e estão definidos; `statusAprovacao` e `trocasSazionais` também. **Falta essencialmente o getter.**

**Execute:**
1. Defina `getCardapios()` no `SharedState`, devolvendo a coleção de cardápios que carrega `statusAprovacao` (a tela procura `statusAprovacao === 'aprovado_nutri'`). Se hoje isso vive em `menus`, mapeie para lá; se não existir a coleção, crie `cardapios` com o campo e semeie.
2. **Corrija as rotas fixas:** o filtro oferece *Birbiriuçu, Anhanduí, Urbana Leste, Urbana Oeste* — que **não existem** neste município. As regiões reais são `['Anhanduizinho','Bandeira','Centro','Imbirussu','Lagoa','Prosa','Segredo']` (`DATA.regions`). Popule o select dinamicamente.
3. Corrija o fallback de escola `'EMEF Prof. Arlene Marques'` (região *Birbiriuçu*) — é de outra base. Use as escolas piloto.
4. **Ligue a saída:** a guia emitida precisa virar OS de fornecimento visível ao Estoque Central / Cooperativa e alimentar `ordens-entrega`. Sem isso a tela renderiza mas não serve para nada.
5. Envolva `renderPage()` em `try/catch` com tela de erro amigável — hoje qualquer método faltante gera página branca silenciosa.

**Critério:** abrir a tela, escolher escola e rota, gerar a guia, e ver a OS correspondente aparecer no Estoque Central.

### A3 · Botão "Emitir Novo Empenho SIAFI"
**Decisão:** *"ajuste o botão para existir a funcionalidade"*.

`window.openNewEmpenhoModal` é chamada em **2 botões** e tem **0 definições** em todo o projeto:
- `app.js:11412` — `onclick="window.openNewEmpenhoModal()"` → "➕ Emitir Novo Empenho SIAFI"
- `app.js:11224` — `onclick="window.openNewEmpenhoModal('${numAta}')"` → emitir empenho a partir da Ata

**Execute:** implemente o modal de emissão de empenho multi-item, com: seleção da ATA de origem, múltiplos produtos, **trava de saldo** (não permitir empenhar acima do saldo da ATA), abatimento em tempo real, gravação via `addEmpenho2()` e persistência no Supabase. Quando chamado com `numAta`, pré-selecione a ATA. Ligue a saída às telas de Empenhos, Atas e ao motor de triagem `processarPedido`.

### A4 · Dar funcionalidade aos 29 botões inertes
**Decisão:** *"dê funcionalidade aos botões"*.

| Tela | Botões | O que devem fazer |
|---|---|---|
| `cooperativa/pedidos` | **Confirmar Distribuição e Enviar aos Agricultores** | efetivar a distribuição (é o CTA central do fluxo — ver A9) |
| `cooperativa/pedidos` | Distribuir | abrir distribuição do pedido legado |
| `cooperativa/agricultores` | + Novo Agricultor · Detalhes | CRUD de agricultor + ficha |
| `cooperativa/produtos` | + Novo Produto · Editar | CRUD de produto |
| `gestor/cooperativas` | Ver Indicadores | abrir indicadores da cooperativa |
| `gestor/pedidos` | Entregue · Em transporte · Em separação | filtrar a tabela por status |

**Atenção:** a tabela de distribuição automática acima do CTA em `cooperativa/pedidos` é **fixa no HTML** (Mandioca/Banana/Alface/Tomate) e não reflete o pedido real. Torne-a dinâmica junto com o botão. Regra: se um botão não pode funcionar agora, **remova-o** em vez de deixá-lo decorativo.

### A8 · Criar a tela do Motorista
**Decisão:** *"vamos criar a tela do motorista, lembrando de linkar todos os caminhos"*.

**Diagnóstico preciso:** `motorista_entregas` **até lê** os pedidos —
```js
SharedState.getOrders().filter(o => o.status === 'Em transporte' && (!prof || o.driver === prof.name))
```
— mas **nada no sistema jamais atribui `o.driver`**. As 8 ocorrências de "driver" no arquivo são ids de DOM e esse filtro. Sem ninguém popular o campo, o filtro nunca casa e a tela cai no fallback fixo `'EM PROF. ANTÔNIO LOPES LINS'`.

**Execute — a cadeia inteira:**
1. **Crie a etapa que faltava:** ao despachar (`dispatchOrder`), abrir atribuição de **motorista + veículo + rota** e gravar `driver`, `veiculo` e `rota` no pedido. Isso é a RN08/RN09 já prevista em `ordens-entrega`.
2. Reescreva `motorista_dashboard` (rota do dia, ordenada por sequência de entrega) e `motorista_entregas` (lista real das entregas atribuídas, sem escola fixa).
3. Mantenha o coletor de assinatura digital em Canvas que já existe e ligue-o ao pedido certo.
4. Ao confirmar entrega, dispare `confirmDelivery()` — que, após A6, dá entrada no estoque da escola.
5. Ligue `motorista_ocorrencias` → `gestor/dashboard` (esse caminho **já funciona**, preserve) e `motorista_historico` às entregas reais.

**Critério:** despachar um pedido com motorista atribuído → ele aparece na rota do motorista → confirma com assinatura → estoque da escola sobe → Gestor e Cooperativa veem "Entregue".

### A9 · Agricultor recebe quando o produto é dele
**Decisão:** *"ajuste para quando for produto do agricultor ele receba, lembrando de linkar todos os caminhos"*.

**Dois bugs empilhados:**
1. `distributeOrderToFarmers()` só dispara via `acceptOrder`, que só existe na tela da Cooperativa — que por C3 não recebia os pedidos do Diretor nem da IA. **A FASE 2 resolve isso.**
2. O casamento produto↔produção usa `includes()` da primeira palavra do nome. Sem correspondência, o item vira `agricultor: 'A definir'` e **some** da tela do agricultor.

**Execute:**
1. Substitua o match por `productId`/código do produto, com o nome apenas como fallback.
2. Aplique a regra de **Agricultura Familiar**: o sistema já tem `isAF` (`emp.tipo === 'AF' || fornecedor contém "coop"/"agri"` — `app.js:11496,11662`). Reutilize essa lógica para rotear itens de AF ao agricultor e itens convencionais ao Estoque Central.
3. Itens sem agricultor casado **não podem sumir**: mostre-os como "aguardando atribuição" com ação manual para a cooperativa designar.
4. Ligue `agricultor/producao` → `agricultor/estoque` → `agricultor/pedidos` → `agricultor/entregas`, e reflita na cooperativa e no gestor.

**Critério:** agricultor declara produção → cooperativa aceita pedido com esse produto → item aparece no painel do agricultor → ele marca como enviado → cooperativa e escola acompanham.

---

## FASE 5 — ACABAMENTO (M2, M4, M5, M7, C1, M6)

### M2 · `addProduction` duplicado
**Decisão:** *"corrija e unifique"*. O método é declarado **duas vezes** no mesmo literal `SharedState` (linhas ~933 e ~1197). A segunda vence e **não define `status: 'Ativo'`** — toda produção nova entra sem status. A primeira ainda protege contra array inexistente (`this._data.productions = ... || []`); a segunda não. Unifique numa versão única que preserve **as duas** proteções. Faça uma varredura por outras chaves duplicadas no mesmo objeto.

### M4 · Elementos sem handler
**Decisão:** *"arrume"*. Presentes no HTML, sem nenhum listener:

| Elemento | Rótulo | Ação |
|---|---|---|
| `#link-forgot` | Esqueci minha senha | fluxo de recuperação (ver C1 — protótipo: deixar estruturado) |
| `#link-support` | Suporte TI | abrir canal/modal de suporte |
| `#global-search` | Pesquisar escola, produto, pedido… | busca global real sobre escolas, produtos e pedidos |
| `#header-user-btn` | menu do usuário | dropdown com perfil, ID logado e sair |
| `#notif-badge` | contador | refletir notificações reais (hoje fixo em "4") |

As 6 notificações do drawer são um **array fixo** em `renderNotifications()`. Ligue-as a eventos reais do `SharedState` (estoque crítico, entrega atrasada, novo pedido, alerta da IA).

### M5 · `#school-picker-label`
**Decisão do usuário:** *"foi criado id"*.
⚠️ **Verifiquei e não encontrei** `school-picker-label` em nenhum dos dois `index.html`. O JS (`app.js` ~11025 e ~11041) atualiza esse elemento em 2 pontos, protegido por `if (lbl)` — falha em silêncio.
**Execute:** confirme se o id foi mesmo criado. Se sim, valide que os 2 blocos funcionam. Se não, escolha: adicionar `id="school-picker-label"` ao `<label>` do seletor de escola, **ou** remover os 2 blocos mortos. Não deixe no meio do caminho.

### M7 · Unificar a versão
**Decisão:** *"unifique a versão"*. Hoje há **três** números divergentes:
- `app.js:16` → `APP_VERSION = '2.1.0'` ← é o que aparece na sidebar e no rodapé para o usuário
- `package.json` → `"version": "1.9.0"`
- `index.html` → cache-bust `?v=2.3.0_20260805_1526`

O log do Antigravity já foi a **v2.4.1**. Defina a versão corrente, aplique nos **três** lugares e faça o cache-bust derivar de `APP_VERSION` em vez de string fixa.

### C1 e M6 · Autenticação — estruturar sem obrigar
**Decisão do usuário (C1):** *"a autenticação não está sendo usada por ser um protótipo, para facilitar o acesso e demonstração; assim que aprovado vamos inserir as credenciais"*. **(M6):** *"por ser protótipo ainda não vamos colocar obrigação, mas deixe tudo estruturado para quando startar ficar pronto"*.

**Não implemente login obrigatório agora.** Deixe pronta a estrutura:
1. Crie `auth.js` com `authenticate(usuario, senha, perfil)` retornando sucesso por padrão, **com um flag central** `AUTH_ENABLED = false` no topo.
2. Faça o `submit` do login **passar pelos campos** `#login-user` e `#login-pass` (hoje eles são simplesmente ignorados) e chamar `authenticate()`. Com o flag desligado, segue direto.
3. Mesma lógica para a seleção de escola (M6): valide `schoolId`, mas só **bloqueie** se `AUTH_ENABLED`. Deixe a mensagem de erro pronta.
4. Deixe `escola_usuarios` mapeada e o `criadoPorUserId` (v2.4.0) já preenchido a partir do perfil logado — quando ligar o flag, a rastreabilidade já funciona.
5. Documente no README como ativar: trocar um booleano e semear as credenciais.

**Critério:** ligar `AUTH_ENABLED = true` deve bastar para exigir credenciais, sem refatorar nada.

---

## CHECKLIST FINAL — "SEM PONTAS SOLTAS"

Antes de declarar concluído, execute no navegador e confirme **cada** item:

**Integridade estrutural**
- [ ] Uma única cópia do código; `grep -c "' + Date.now()"` = 0; nenhuma referência a `_sb2`
- [ ] 22 tabelas respondendo; badge do banco reflete o estado real
- [ ] 8 escolas piloto no banco, com id 1–8; dropdown do login vem do banco
- [ ] Versão única nos 3 lugares; nenhum renderer definido duas vezes; nenhuma tela órfã

**Ciclo operacional completo (o teste que prova tudo)**
- [ ] Nutricionista publica cardápio → chega na escola e vira demanda
- [ ] Diretor cria pedido → **aparece na Cooperativa** (hoje não aparece)
- [ ] Cooperativa aceita → distribui → **agricultor recebe o item dele**
- [ ] Estoque Central separa (FEFO) → despacha **com motorista atribuído**
- [ ] Motorista vê a entrega na rota → confirma com assinatura
- [ ] **Estoque da escola sobe** e o lote é criado com validade
- [ ] Merendeira lança consumo → estoque desce pelo lote mais antigo
- [ ] Sugestão de novo pedido reflete o saldo real
- [ ] Gestor acompanha tudo; ATA e empenho abatidos corretamente

**Robustez**
- [ ] Nenhum `undefined` renderizado em nenhuma tela
- [ ] Nenhum `catch` vazio engolindo falha de gravação
- [ ] Nenhum botão sem ação (ou implementado, ou removido)
- [ ] Console limpo ao navegar por **todas** as 106 telas dos 10 perfis
- [ ] `npx playwright test` passando contra a cópia única

**Governança**
- [ ] Entrada registrada no topo de `F:\Nova cofre\SUALE\ATIVIDADE_LOG.md` por fase
- [ ] O que foi declarado no log **confere** com o que está no código
