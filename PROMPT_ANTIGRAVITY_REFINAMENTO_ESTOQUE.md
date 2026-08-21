# 🛠️ PROMPT DE EXECUÇÃO — Antigravity · Refinamento do Estoque (CD)

**Tarefa:** aplicar 9 refinamentos no perfil **Estoque Central (CD)** do SUALE.
**Papel:** você é o desenvolvedor. O refinamento/PO já foi feito (Claude, com o cliente) e está **fechado** — não reabrir decisões.

---

## Leia primeiro (obrigatório, nesta ordem)
1. `F:\Nova cofre\ATIVIDADE_LOG.md` — topo. A entrada de **[2026-08-20]** descreve o épico Expedição & Logística que **já está EM PRODUÇÃO** (`origin/master` = `707f92d`).
2. Este arquivo (as 9 decisões travadas abaixo).
3. `ESPEC_EXPEDICAO_LOGISTICA.md` — a espec do épico já entregue (contexto do fluxo).

## ⚠️ Contexto crítico — NÃO refazer o que já existe
O épico de Expedição **foi implementado de verdade e já está no ar**. Estas funções/telas **existem e funcionam** — você vai **refinar por cima**, nunca recriar/remover:
- `SharedState`: `getFrota/addCaminhao/updateCaminhao`, `getCargas/criarCarga/addOeNaCarga/removerOeDaCarga/setStatusCarga`, `pesoDaOe`, `getOcorrencias/registrarOcorrencia`, `getCoberturaEscolas`, `registrarConfirmacaoEntrega`.
- Handlers: `abrirModalMontagemCarga`, `confirmarAlocacaoCarga`, `liberarCarga`, `abrirModalRastreamentoVeiculo`, `RoutingProvider`, `otimizarRotaCarga`, `_moverParadaRota`, `abrirTimelineOe`, `abrirModalDuplaChecagemEscola`.
- Telas: `estoque_montagem-carga`, `estoque_rastreabilidade`, `estoque_roteirizacao`, `estoque_frota`, `estoque_cobertura`, `estoque_relatorios`, `estoque_ocorrencias`, `gestor_ocorrencias`.
- Fluxo: Separação FEFO (item-level) → Criar O.E. (`salvarNovaOrdemEntrega`, nasce "Aguardando carga") → Montagem (trava A1) → Liberar (`liberarCarga`, despacha ao motorista) → Rastreio → dupla checagem (Motorista + Escola) → Entregue. A16 (saldo por item) já existe.

## Contexto de arquitetura (regras que NÃO mudam)
- Front-end puro, sem build. **Não existe `app.js`.** Hub = `js/core_hub.js` (carrega por ÚLTIMO); telas em `js/modules/*.js`.
- Telas registram `PAGE_RENDERERS[key] = (el) => { el.innerHTML = ... }` (contrato fixo — **nunca** retornar string).
- **"Banco" = `SharedState`** (singleton + `localStorage` `saged_shared_state_v2` + EventBus `_emit`/`_on`). **Não** usar Supabase.
- Armadilha conhecida: `getX()` retorna **cópia** (`[...arr]`). Para mutar, use `SharedState._data.X` + `_persist()` — nunca `getX().push()`.
- Padrão visual: `kpi-grid`/`kpi-card {blue|orange|teal|green|red}`, `card`/`card-header`, `data-table`, `tag`, `status-badge`.
- **`docs/` é o deploy (GitHub Pages) — manter `js/` ↔ `docs/` idênticos, arquivo a arquivo.**

## 🚦 Branch & publicação (regra de ouro — NÃO PUBLICAR SOZINHO)
- Trabalhe **somente** na branch **`fix/guias-entrega-e-limpeza-appjs`** (ambiente de **homologação/aprovação**). Commit e push **só nessa branch**.
- **NUNCA** faça push/merge para **`master`**. O `master` é **PRODUÇÃO** e o GitHub Pages publica a partir dele — a promoção `fix → master` é um passo de **aprovação humana**, feito por outra pessoa, não por você.
- Ou seja: você entrega na `fix/...` validada (testes verdes + `docs/` sincronizado + log). **Quem promove pra produção é o cliente/PO.**

---

## As 9 decisões travadas (o que fazer)

### 1) Dashboard CD — reformular KPIs
**Arquivo:** `PAGE_RENDERERS.estoque_dashboard` (`js/modules/estoque.js`).
- **Remover** o card **"Saldo de Empenhos Vigentes"**.
- Novos KPIs, cada um **número + mini-lista clicável**:
  - **Caminhões em rota** (fonte: `getCargas().filter(status==='em_transporte')` + `getFrota`; mini-lista com placa/motorista/parada atual — reaproveite a lógica da Rastreabilidade B9).
  - **Pendentes de entrega** (O.E. ainda não *Entregue* pela dupla checagem — inclui *Em Rota*/*Aguardando confirmação*).
  - **Escolas abastecidas** (ver item 8 — fonte única de fulfillment).
- **AC:** dashboard sem qualquer número de empenho; os 3 blocos batem com Rastreabilidade e com a tela de Escolas (item 8).

### 2) Estoque Central — estoque real em tempo real
**Arquivo:** `PAGE_RENDERERS.estoque_inventario` (`js/modules/estoque.js`).
- A tela deve refletir o **estoque real** = `SharedState.getCentralStock()` (creditado no recebimento, debitado na expedição).
- **Remover** a tabela **"Inventário Estimado (visão consolidada)"** que lê `DATA.products` (mock).
- Os **4 KPIs do topo** (itens / crítico ≤5d / atenção 6–10d / zerados) passam a ser calculados **sobre o estoque real** (`getCentralStock`), não sobre `DATA.products`.
- Confirmar que a saída (`concluirSeparacaoFEFO` → `consumeCentralStock`) **debita** e o recebimento **credita** — em tempo real via EventBus.
- **AC:** os números do topo batem com a tabela vigente; ao dar entrada por recebimento o valor sobe, ao expedir ele cai, sem recarregar.

### 3) Empenho fora das telas do Estoque
**Arquivos:** `estoque_dashboard`, `openReceiveNFModal`, `openRecebimentoModal`, `confirmRecebimento` (`js/modules/estoque.js`) e onde mais o CD exibir "empenho/saldo".
- **Sumir com qualquer número/coluna de empenho** das telas do perfil Estoque.
- **Manter a baixa contábil no back** (a lógica que baixa empenho na conferência física continua rodando — só não aparece pro operador do CD). Não quebrar a rastreabilidade do Gestor.
- **AC:** nenhuma tela do CD mostra empenho; a baixa continua acontecendo (verificar no perfil Gestor).

### 4) Expedição (OS) — corrigir a máquina de estados
**Arquivo:** renderer `gestor_expedicao-os` (em `js/core_hub.js`; alias `estoque_expedicao-os`) e `salvarNovaOrdemEntrega`, `liberarCarga`, `registrarConfirmacaoEntrega`.
- **Bug atual:** com a OS em **"OE Criada"** o botão **"Separação FEFO"** reaparece. Corrigir a lógica da coluna **Ações** para:

  | Status da OS | Ação |
  | :-- | :-- |
  | `Aguardando Separação` | botão **Separação FEFO (RN06)** |
  | `Separado` / `Separado parcial` | botão **Criar OE (RN08)** |
  | `OE Criada` | rótulo passivo **"OE emitida"** (sem reabrir FEFO) |
  | `Em Rota` | rótulo **"OE emitida / Em rota"** |
  | `Entregue` | rótulo **"Entregue"** |

- **Avançar o status da OS:** em `liberarCarga`, além de mudar a O.E. para *Em Transporte*, **mudar a OS vinculada para `Em Rota`** (hoje ela fica travada em "OE Criada"). A cascata `OS → Entregue` na dupla checagem **já existe** em `registrarConfirmacaoEntrega`.
- **AC:** nenhuma OS "OE Criada"/"Em Rota"/"Entregue" mostra o botão de FEFO; ao liberar a carga a OS vira "Em Rota"; ao concluir a dupla checagem vira "Entregue".

### 5) Montagem — 1 caminhão = 1 carga ativa + piso de 70%
**Arquivos:** `abrirModalMontagemCarga`, `confirmarAlocacaoCarga`, `criarCarga`, `liberarCarga` (`js/core_hub.js`).
- **1 caminhão = 1 carga ativa:** **bloquear** criar uma **2ª carga** para um caminhão que já tem carga ativa (`em_montagem` **ou** `em_transporte`). No seletor de caminhão da "Nova Montagem de Carga", **não listar** caminhões com carga ativa; explicar o motivo.
- **Compor sempre liberado:** continuar podendo **adicionar O.E.s à carga em montagem** para encher a capacidade (os ~30% que faltam), respeitando a **trava A1** (não passar de 100%). *Encher a mesma carga é sempre permitido.*
- **70% = piso pra despachar:** em `liberarCarga`, se `pesoTotal < 70% da capacidade` → **confirmação** ("não atingiu 70% (X / cap kg), liberar mesmo assim?"). **Não é bloqueio** — só confirma. (≥70% libera direto.)
- **AC:** não dá pra abrir 2 cargas pro mesmo caminhão; dá pra encher a carga até 100%; liberar abaixo de 70% pede confirmação; ao despachar, o caminhão fica livre pra próxima carga.

### 6) Montagem — remover painel "O.E. já em caminhão"
**Arquivo:** `PAGE_RENDERERS['estoque_montagem-carga']` (`js/modules/estoque.js`).
- **Remover** a seção **"🚚 O.E. Já em Caminhão"** (essa info vive em Ordens de Entrega). **Manter** "⏳ O.E. Pendentes (Aguardando Carga)".
- **AC:** a tela mostra só o pool de pendentes; nada se perde (a tela Ordens de Entrega já mostra caminhão/carga por O.E.).

### 7) Separação FEFO — coluna QTD editável (A16 completo)
**Arquivos:** `_sepFefoBody`, `_biparItemFefo`, `concluirSeparacaoFEFO` (`js/core_hub.js`).
- Tornar a coluna **QTD editável** por item (input numérico, entre `0` e a qtd solicitada). Guardar em `p._qtdSeparada`.
- `concluirSeparacaoFEFO`: usar a **qtd separada** (não a solicitada) para: montar a **O.E.** (produtos com a qtd separada), **debitar o Estoque Central** e calcular o **saldo** = `solicitado − separado` por item → nova **OS `/2`** "Aguardando Separação".
- Se a qtd separada de um item **exceder o saldo real do CD** (`getCentralStock`): **avisar, mas deixar seguir** (não bloquear).
- **AC:** dá pra separar parcial por quantidade; a O.E. e a baixa usam a qtd separada; o saldo vira OS `/2` com as quantidades restantes; separar acima do estoque apenas alerta.

### 8) Cobertura Escolar — confronto OS × OE (REVISADO após a 1ª entrega)
**Arquivos:** tela unificada `PAGE_RENDERERS['estoque_cobertura']` (`js/modules/estoque.js`), `SharedState.getCoberturaEscolas`/`getFulfillmentEscolas` (`js/core_hub.js`), menu em `PROFILES.estoque.menu`.

> ⚠️ A 1ª versão foi entregue como **"Fulfillment & Escolas"** com colunas herdadas do mock (alunos, cardápio, autonomia, status cobertura). **Corrigir para o abaixo.**

- **Menu e título da página:** **"Cobertura Escolar"** (remover o nome "Fulfillment & Escolas"/"Fulfillment"). Unificar Cobertura + Escolas Atendidas numa tela só (remover o item de menu e o renderer que ficar órfão).
- **Remover as colunas:** *Alunos Matriculados*, *Cardápio Ativo*, *Autonomia Estimada*, *Status Cobertura* (e qualquer "autonomia em dias" mockada em `getCoberturaEscolas`).
- **Confronto (por produto, em kg/L):** para cada escola, `previsto` = soma dos produtos das **O.S. de expedição** (emitidas pela nutricionista) **−** `entregue` = soma dos produtos das **O.E. com status Entregue** (dupla checagem) = **saldo a entregar**. `% falta = saldo ÷ previsto × 100`.
- **Tabela (uma linha por escola):**
  - **Escola / EMEF** — **clicável**.
  - **% que falta entregar** (agregada da escola) — usar **cor**: **verde** quando 0% (abastecida), **âmbar** quando > 0%. *(sem coluna de status separada — a % representa o estado.)*
  - **Ação:** botão **"Gerar O.S. Reposição"** (mantém).
  - **Ao clicar no nome da escola → abrir um _collapse_** com os **produtos faltantes**, cada um com **previsto / entregue / % falta** (ex.: *Arroz Tipo 1 (5kg) — 0/150 kg · falta 100%*). Escola sem saldo não expande (nada a entregar).
- **KPIs do topo (mantêm):** *Escolas Abastecidas* · *Escolas Pendentes de Entrega* · *Saldo Total a Entregar (kg)*.
- Essa tela é a **fonte única** de "escolas abastecidas"/"pendentes de entrega" que o **Dashboard (item 1)** consome.
- **AC:** sem as 4 colunas removidas; menu/título = "Cobertura Escolar"; a linha mostra escola + % falta (colorida) + ação; clicar na escola expande os produtos faltantes com %; "abastecida" (0%) só quando **todas** as O.E. da escola estão Entregues por dupla checagem; os números batem com o Dashboard.

### 9) Livro de Ocorrências — único/geral com Perfil
**Arquivos:** `SharedState.registrarOcorrencia` + `_data.ocorrencias` + `_data.incidents`/`addIncident` (`js/core_hub.js`); `gestor_ocorrencias` (F15), `estoque_ocorrencias` (F14), `motorista_ocorrencias`.
- **Unificar** num **único livro geral**: uma coleção só, com campo **`perfil`** (quem registrou: Estoque, Motorista, Escola, Gestor, Nutri…) + autor (nome).
- Migrar/mesclar `incidents` (motorista) para dentro da coleção unificada de ocorrências.
- **Qualquer perfil registra**; **todos veem** o livro geral com **filtro por perfil / tipo / período**. A mesma tela serve os perfis (via alias de renderer).
- **AC:** toda ocorrência grava o perfil de origem; o livro é o mesmo para todos, filtrável; ocorrência criada por um perfil aparece pros outros.

---

## Ordem de trabalho sugerida
Comece pelos **dois "fios"** que destravam o resto: **(2) Estoque real** e **(8) Fulfillment** — depois **(1) Dashboard** (que consome os dois), **(4) máquina de estados**, **(5) montagem**, **(7) FEFO**, e por fim **(3) empenho**, **(6) painel**, **(9) ocorrências**.

## Definition of Done (a cada item, sem exceção)
1. `npx playwright test` **verde (≥ 83/83)** + `tests/smoke-renderers.spec.js` **0 falhas**.
2. **Sem erro no console** do navegador (verifique de fato).
3. **`docs/` sincronizado** arquivo a arquivo com `js/`.
4. **Nova entrada no topo** de `F:\Nova cofre\ATIVIDADE_LOG.md` (o que fez, decisões, pendências).
5. Commits pequenos e descritivos **na branch `fix/guias-entrega-e-limpeza-appjs`** (nunca no `master` — ver "🚦 Branch & publicação"). **Não** commitar chave de API. **Não** mexer nas ~60 screenshots (ficam fora dos commits).

## Como reportar
Ao concluir cada item, registre no log e devolva um resumo: o que entrou, evidência de validação (nº de testes, prints), e o que ficou pendente. Se achar ambiguidade **não coberta aqui**, **pare e registre a dúvida no log** — não decida por conta própria.
