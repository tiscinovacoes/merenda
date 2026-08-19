# 📦 ESPECIFICAÇÃO — Expedição & Logística (SUALE / Central de Distribuição)

**Projeto:** SUALE — Vigia Educa (SEMED Campo Grande - MS)
**Autor do refinamento:** Claude (Product Owner) · **Executor:** Antigravity
**Data:** 2026-08-19 · **Status:** ✅ Escopo travado — pronto para desenvolvimento
**Base de código:** branch `fix/guias-entrega-e-limpeza-appjs` (já em produção via merge no `master`)

> Este documento é o **estado-alvo** ("como ficará") do fluxo de Expedição e Logística
> do perfil **Estoque Central (CD)** e sua conexão com **Nutricionista → Motorista → Escola**.
> É a fonte única para a implementação. Todas as decisões abaixo estão **fechadas com o cliente**.

---

## 0. Contexto de arquitetura (regras que NÃO mudam)

- **Front-end puro, sem build** (Opção A do `PLANO_MODULARIZACAO_APP.md`): `<script>` nativo, compatível com GitHub Pages (`docs/`).
- **`app.js` NÃO existe mais.** Hub Central = `js/core_hub.js`; telas por perfil em `js/modules/*.js`. Cada tela auto-registra `PAGE_RENDERERS[key] = (el) => { el.innerHTML = ... }` (contrato fixo — nunca retornar string).
- **Ordem de carga:** os 6 módulos carregam ANTES; `core_hub.js` carrega por ÚLTIMO. Handlers cross-perfil e estado vivem no `core_hub.js`.
- **"Banco" = camada compartilhada** `SharedState` (singleton + `localStorage`, chave `saged_shared_state_v2`) com EventBus (`_emit`/`_on`). É onde o novo modelo de dados vive e por onde os perfis se comunicam. **Não** usar Supabase agora (fica para a fase de integração).
- **Padrão visual:** telas usam `kpi-grid` + `kpi-card {blue|orange|teal|green|red}`, `card`/`card-header`, `data-table`, `tag`, `status-badge`. Manter consistência.
- **Definition of Done de cada entrega:** `npx playwright test` **verde (≥ 82/82)** + smoke `tests/smoke-renderers.spec.js` **0 falhas**; **sem erro de console**; **`docs/` sincronizado** arquivo a arquivo; **nova entrada no `F:\Nova cofre\ATIVIDADE_LOG.md`**.

---

## 1. Modelo de dados (SharedState) — o que criar/alterar

| Entidade | Alteração |
| :-- | :-- |
| **Produto** | Peso sempre em **kg**; itens em **L contam 1:1** (1 L = 1 kg). Sem campo novo — regra de conversão no cálculo de peso. |
| **Escola** | + `endereco`, + `lat`, + `lng`, + `diasEntrega` (ex.: `['seg','qua','sex']`), + `janelaHorario` (ex.: `{ inicio:'08:00', fim:'11:00' }`). |
| **Caminhão (Frota)** 🆕 | Nova coleção `frota`: `{ id, placa, modelo, capacidadeKg (default 5400), refrigerado (bool), motoristaPadrao, status ('ativo'|'manutencao') }`. |
| **Cardápio** | + `cardapioId` (chave estável). Toda OS/OE de distribuição carrega esse id. |
| **OS de Expedição** (`ordensServicoExpedicao`) | + `cardapioId`, + `cargaId` (quando alocada), + `historicoStatus: [{status, autor, data}]`. Fracionamento gera **nova OS pendente** (número com sufixo `/2`, prioridade herdada). |
| **Ordem de Entrega** (`ordensEntrega`) | + `cardapioId`, + `escolaId` (já existe), + `cargaId`, + `historicoStatus`, + `confirmacaoMotorista`, + `confirmacaoEscola` (dupla checagem). |
| **Carga/Viagem** 🆕 | Nova coleção `cargas`: `{ id, caminhaoId, motorista, pesoTotalKg, oes: [oeId...], rotaOrdenada: [paradaId...], status, criadaEm, historicoStatus }`. |
| **Ocorrência** 🆕/ajuste | Coleção `ocorrencias`: `{ id, modulo ('motorista'|'estoque'), tipo, descricao, autor, data, vinculo (oeId/recebimentoId) }`. |

**Helpers/mutations novos no SharedState (exemplos):** `getFrota/addCaminhao`, `getCargas/criarCarga/addOeNaCarga/removerOeDaCarga`, `getOcorrencias(modulo)/registrarOcorrencia`, `setStatusComHistorico(entidade, novoStatus, autor)`, `getCoberturaEscolas({cardapioId, periodo})`.

---

## 2. Épicos, histórias e critérios de aceite (LOCKED)

### ÉPICO A — Carga, Peso & Roteirização

**A1 — Peso + trava por caminhão**
- Peso da carga = Σ (quantidade em kg; L convertido 1:1) de todas as OEs da carga.
- Capacidade vem do **Cadastro de Caminhões** (default 5.400 kg, editável).
- **AC:** ao tentar alocar uma OE que faça a carga exceder a capacidade → **avisa** e **impede** salvar, sugerindo alocar em outro caminhão. Nunca persiste acima do limite.

**A1b — Cadastro de Caminhões (Frota)** 🆕 — tela no perfil Estoque
- **AC:** CRUD de caminhões com `placa, modelo, capacidadeKg, refrigerado, motoristaPadrao, status`. Lista com ocupação atual quando em viagem.

**A2 — Montagem de Carga (MODAL)**
- Abre **popup de Montagem de Carga**. Mostra **ocupação atualizada de cada caminhão** (ex.: barra `4.900/5.400 kg · 6 escolas`).
- **Motor de sugestão** por capacidade restante:
  - Caminhão A com 4.900 kg (rest. 500): OS de **700 kg → bloqueia A**, sugere outro; OS de **500 kg → sugere A** (fecha 5.400) **e** outros com espaço.
- **Operador escolhe** o caminhão. **1 escola = 1 OE**; a **carga agrupa várias OEs**.
- **AC:** cada escola mantém sua OE/comprovante; a carga soma o peso e respeita a trava; sugestão destaca o(s) caminhão(ões) viável(is).

**A3 — Roteirização (SÓ A TELA agora, ORS-ready)**
- Tela que ordena as paradas da carga, **ajustável por prioridade, exigências e janela de horário** da escola.
- **Adaptador plugável** `RoutingProvider` desenhado para **OpenRouteService (ORS)**: métodos `geocode(endereco) → {lat,lng}` e `optimize(veiculos, entregas) → rotaOrdenada`, mapeando para os endpoints ORS `/geocode/search` e `/optimization` (VROOM: suporta **capacidade** e **time windows** nativamente). **Sem chamada real agora** — implementação atual retorna **ordenação heurística** (região + prioridade + janela); trocar para ORS = só ligar a chave, sem refatorar as telas.
- **AC:** a tela mostra a rota ordenada e permite reordenar/ajustar; o código isola a lógica de rota atrás do `RoutingProvider` (documentado como "ORS-ready").

**A16 — Fracionar O.S. na separação**
- Na separação, informar **quantidade fracionada** por item (escola que não comporta tudo).
- **AC:** o **saldo não separado vira nova OS pendente** (número com sufixo, prioridade herdada); a OS original segue como **Separado parcial**.

### ÉPICO B — Ordens de Entrega & Status

**B6 — Filtros na tela de OE:** agrupar **por O.S. / por Escola / por Expedição (carga)** — filtro na mesma tela.
**B7 — Remover "confirmar entrega" do Estoque; dupla checagem:** a OE fecha em **"Entregue"** apenas com **Motorista (entregou)** **+** confirmação da **Escola**. Do lado da escola confirmam **Resp. Estoque (repositor)** e **Diretor**.
**B8 — Timeline de status:** histórico com **autor + data/hora** por transição (Separado → Em rota → Entregue → Recebido).
**B9 — Rastreabilidade por caminhão:** tela de **acompanhamento logístico** (carga, escolas na rota, progresso das paradas, status). Sem GPS agora.

### ÉPICO C — Dashboard / Cobertura

**C10 — KPIs de cobertura de escolas** (dashboards **Gestor** e **Estoque**)
- **Atendida** = escola cujo `escolaId` tem **O.E. vinculada dentro do `cardapioId`** do período.
- **Filtro por cardápio + período (semana / mês / ano).**
- KPIs: **Atendidas**, **Não atendidas**, **% de cada**. **Clicar no KPI abre o painel** com a lista das escolas daquele KPI.
- **AC:** o `cardapioId` é criado/persistido na camada compartilhada e propagado às OEs; o Estoque lê da mesma camada; percentuais e listas conferem entre si.

### ÉPICO D — Entrada de O.S. / Estoque Central

**D12 (inclui a correção do bug D11) — Unificar "Estoque Central" + redirecionar O.S.**
- Fundir **"Posição de Estoque" + "OS Estoque Central"** num único menu **"Estoque Central"** (mantém **inventário** + **"Receber NF-e via XML"**).
- As **Ordens de Serviço de distribuição** (hoje caem em "OS Estoque Central" com **PRODUTO/QTD `undefined`** — bug D11) passam a ser **redirecionadas para "Expedição (OS Escolas)"**, criadas com os campos corretos (`produto`, `quantidade`, `unidade`, `escola`, `cardapioId`).
- **AC:** ao Nutricionista disparar, a OS aparece **completa** na Expedição (nada `undefined`); "OS Estoque Central" deixa de existir como destino dessas OS; NF-e via XML permanece no Estoque Central.

### ÉPICO E — Relatórios

**E13 — Relatório de entrega genérico:** filtros por **caminhão / motorista / escola** + período; exportar/imprimir. Detalhes a validar com o cliente depois.

### ÉPICO F — Ocorrências (por módulo + Livro)

**F14/F15 — Ocorrências segmentadas:**
- **Motorista:** ocorrências **sobre a entrega** (atraso, recusa, avaria em rota, ausência na escola…).
- **Estoque:** tipos de **almoxarifado** (avaria no recebimento, divergência de quantidade, quebra, produto vencido…).
- **Gestor:** **Livro de Ocorrência consolidado** (todas as ocorrências de todos os módulos num só lugar, com filtro por módulo/tipo/período).

### ÉPICO G — App do Motorista (só telas agora)

**G17 — Telas mobile-first** do motorista (integração/PWA em 2º plano): rota/paradas, **checagem/bipagem** na entrega, **confirmar entrega** (lado motorista da dupla checagem), **registrar ocorrência**.

---

## 3. Menu final do perfil Estoque Central (estado-alvo)

`Dashboard Operacional · Estoque Central (inventário + NF-e) · Recebimentos Pendentes · Expedição (OS Escolas) · Montagem de Carga · Ordens de Entrega · Rastreabilidade (Caminhões) · Frota · Controle de Lotes · Escolas Atendidas · Relatórios · Ocorrências`

> **⚠️ CORREÇÃO (2026-08-19):** a tela **"Recebimentos Pendentes" NÃO desaparece** — ela é
> **o ponto de entrada de mercadoria no estoque** (fila de recebimento de fornecedores →
> **Conferência Física RN01 dá entrada** → Confronto NF-e RN05). Deve continuar existindo
> como item de menu próprio no perfil Estoque. O D12 só funde **"Posição de Estoque" + "OS
> Estoque Central"** em **"Estoque Central"**, e redireciona as **O.S. de distribuição** para
> **"Expedição (OS Escolas)"**. Nada disso remove "Recebimentos Pendentes".

**Resumo do que muda no menu (D12):**
- "Posição de Estoque" **→ vira** "Estoque Central" (inventário + posição + botão "Receber NF-e via XML").
- "OS Estoque Central" **→ deixa de ser destino das O.S.**; as O.S. de distribuição vão para "Expedição (OS Escolas)".
- "Recebimentos Pendentes" **→ permanece** (entrada de mercadoria por conferência física).

---

## 4. Plano de sprints (ordem de execução)

1. **Sprint 1 — Base:** D12 + correção D11; modelo de dados novo (`cardapioId`, Escola +endereço/coord/horário, Frota, Carga, `historicoStatus`); tela **Cadastro de Caminhões (A1b)**.
2. **Sprint 2 — Carga & Separação:** modal **Montagem de Carga (A2)** com sugestão + trava (A1); **fracionar O.S. (A16)**.
3. **Sprint 3 — Entrega & Rastreio:** OE com filtros (B6), remover confirmação no Estoque + dupla checagem (B7), **timeline (B8)**, **rastreabilidade por caminhão (B9)**.
4. **Sprint 4 — Rota & Cobertura:** tela de roteirização **ORS-ready (A3)**; **KPIs de cobertura (C10)** clicáveis com filtro por cardápio/período.
5. **Sprint 5 — Relatórios, Ocorrências & App:** **relatório genérico (E13)**; **ocorrências por módulo + Livro (F)**; **telas do app do motorista (G17)**.

---

## 5. Integração ORS (para quando ligar a API — deixar pronto)

- Provedor: **OpenRouteService** (free tier ~2.000 req/dia, CORS no navegador).
- Endpoints: `/geocode/search` (endereço→coord) e `/optimization` (VROOM — capacidade de veículo + janelas de horário).
- Chave por variável de configuração única (ex.: `window.SUALE_CONFIG.ORS_KEY`), **não commitar chave**. Enquanto vazia, `RoutingProvider` usa o modo heurístico.
- Mapeamento: caminhão → `vehicle` (capacity = `capacidadeKg`); escola → `job` (location = `[lng,lat]`, time_windows = `janelaHorario`, amount = peso da OE).
