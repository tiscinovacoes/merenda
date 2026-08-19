# 🎯 PLANO DE AÇÃO — Pós-Auditoria da Modularização

**Projeto:** SUALE — Vigia Educa (SEMED Campo Grande · MS)
**Criado em:** 2026-08-19
**Base:** auditoria profunda de 2026-08-18 (ver `PLANO_MODULARIZACAO_APP.md` § *Situação após a limpeza*)
**Destinado a:** Equipe de Desenvolvimento e Agentes de IA (Claude / Antigravity)

---

## 0. Onde estamos

| Indicador | Estado atual |
|---|---|
| `app.js` | 12.999 linhas (era 13.844) · **serve ~95% das telas** |
| Duplicatas internas no `app.js` | 0 (eram 4) |
| Registros "landmine" nos módulos | 0 (eram 56) |
| Telas servidas por módulo e navegáveis | 5 (4 do Motorista + Guias de Entrega) |
| Chaves órfãs | 3 (todas úteis, faltando item de menu) |
| Smoke test das 100 telas / 11 perfis | 0 falhas |
| `docs/` (GitHub Pages) | sincronizado e verificado arquivo por arquivo |

**Estado do Git:** o trabalho de 2026-08-18 está **não-commitado sobre a `master`** (a modularização foi commitada como `2996406` por outra sessão, e `master` = `feature/modularizacao-hub`). A `master` alimenta o GitHub Pages — ver Fase 1.

### Regra que governa este plano

> **Nada é removido do `app.js` sem que exista substituto real e verificado.** O `app.js` é hoje a fonte da maioria das telas; qualquer corte "otimista" quebra produção. Ver Regras 5–7 do `PLANO_MODULARIZACAO_APP.md`.

---

## FASE 0 — 🔴 Corrigir regressão da Substituição Sazonal
**Prioridade máxima · bloqueia o commit · esforço baixo · risco baixo**

**O problema:** ao substituir a tela *Guias de Entrega* (2026-08-18), o botão **"🔄 Substituir"** — substituição de hortifrúti por sazonalidade com justificativa obrigatória, **Requisito PDF nº 4** — deixou de existir. A cadeia ficou órfã, num laço fechado sem ponto de entrada:

```
renderizarGuiaEscola (app.js:6555)
   └─> abrirModalSubstituicaoSazonal (app.js:6636)
        └─> salvarSubstituicaoSazonal (app.js:6668)
             └─> volta para renderizarGuiaEscola  ← nenhum chamador externo
```

Os dados gravados em `SharedState._data.trocasSazionais` também deixaram de ser lidos.

**Passos:**

1. Em `js/modules/nutricao.js`, adicionar coluna **"Substituição por Sazonalidade"** + botão `🔄 Substituir` por item nos cards de guia (`window._cardGuia`), reaproveitando o modal que já existe: `window.abrirModalSubstituicaoSazonal(escolaId, itemId, itemOriginal)`.
2. Redefinir no módulo `abrirModalSubstituicaoSazonal` e `salvarSubstituicaoSazonal`, trocando o re-render final de `renderizarGuiaEscola(escolaId)` para as funções novas (`renderGuiasPorEscola` / `renderGuiasPorColaborador` / `renderGuiasPorProduto`, conforme a aba ativa). Manter a chave de persistência `trocasSazionais[escolaId_itemId]` para não perder o histórico já gravado.
3. **Refletir a troca na Guia de Remessa impressa** (`window.imprimirGuiaRemessa`): produto substituído aparece com o nome novo + a justificativa no campo *Observação* — era o ponto do requisito (a escola precisa saber por que recebeu outro item).
4. Só depois de 1–3 verificados, remover do `app.js` a cadeia morta (bloco guardado + as 3 funções órfãs, ≈180 linhas entre 6501 e 6683) e o guard `_nutricaoGuiasEntregaReal`, que deixa de ser necessário.

**Verificação:** registrar uma substituição → conferir que aparece na tela, persiste após recarregar, e sai impressa nas 2 vias com a justificativa. Rodar o smoke test (Fase 3.4).

---

## FASE 1 — 🟡 Desbloqueios (dependem de você)
**Esforço baixo · não são tarefas de código**

| # | Item | Ação |
|---|---|---|
| 1.1 | **Porta 8080 ocupada** por processo Python zumbi (PID 26964, escuta e não responde). Com `reuseExistingServer: true`, o Playwright o reaproveita e os **82 testes falham** com `ERR_EMPTY_RESPONSE` — não é regressão de código. | `powershell -Command "Stop-Process -Id 26964 -Force"` e depois `npx playwright test` |
| 1.2 | **Trabalho não-commitado na `master`** (branch de produção do GitHub Pages). | Decidir: commitar na `master`, mover para branch dedicada, ou manter local. Recomendo branch + PR, dado o alcance das mudanças. |
| 1.3 | **59 screenshots** modificadas desde 2026-08-18 10:28 (diff 100% binário). | Commitar junto ou descartar (`git restore screenshots/`). |

> **Sugestão de ordem:** resolver 1.1 antes de fechar a Fase 0, para que a Fase 0 já seja validada pelos 82 testes além do smoke test.

---

## FASE 2 — 🟠 Bugs pré-existentes (independentes entre si)
**Esforço baixo cada · podem ser feitos em qualquer ordem, ou adiados**

| # | Bug | Correção proposta |
|---|---|---|
| 2.1 | **`diretor_restricoes` inatingível**: `PROFILES.diretor = PROFILES.escola` (`app.js`) sobrescreve o menu do diretor, que tinha `restricoes`. A tela existe, é rica, e não tem porta de entrada. | Adicionar o item ao menu efetivo do diretor, ou remover a tela órfã. **Decisão de produto:** o diretor deve ver restrições da sua escola? |
| 2.2 | **Duas Listas de Compras**: o menu alcança `gestor_listacompras`; existe também `gestor_lista-compras` (com hífen), implementação diferente e morta. | Escolher qual é a oficial, apagar a outra, padronizar o id. |
| 2.3 | **`supabase is not defined`** em todo carregamento: o CDN do Supabase tem `defer` e roda **depois** do `db.js`. | Envolver o acesso em checagem, ou remover o `defer`/reordenar. Hoje é erro não-fatal, mas polui o console e mascara erros reais. |
| 2.4 | **Recursão infinita dormente** em `js/modules/gestor.js:255` — `renderGestorOsFornecedores` checa `estoque_os-fornecedores` mas chama a si mesma. Inofensiva porque a chave foi desregistrada. | Corrigir a delegação antes de qualquer registro futuro dessa chave. |
| 2.5 | **3 chaves órfãs sem item de menu**: `estoque_lista-compras`, `estoque_os-fornecedores`, `gestor_audit-log`. | Decidir: entram no menu (viram features) ou saem (viram código morto). |
| 2.6 | **Filtro de rota morto** (`filtrarEscolasPorRotaGuia`): os 4 rótulos fixos ("Rota 1 - Birbiriuçu"…) não correspondem a nenhuma `region` real das 8 escolas. | Sai junto com a Fase 0.4 (está na cadeia morta). Se rota for requisito, usar `DATA.regions` reais. |

---

## FASE 3 — ⚪ Preparar a remoção do `app.js`
**Esforço alto · risco alto se feito fora de ordem · é o que realmente destrava a modularização**

Estes 4 itens são **pré-requisitos** da Fase 4. Nenhum módulo pode assumir de vez enquanto eles não existirem.

### 3.1 Corrigir o `renderPage()` do `core_hub.js` ⚠️
Hoje o `core_hub.js` tem uma versão que chama `PAGE_RENDERERS[key]()` **sem argumento** e espera **retorno** de string — incompatível com as ~110 telas, que usam `(el) => { el.innerHTML = ... }`. Está inerte apenas porque o `index.html` carrega `app.js` por último.
**Do jeito que está, remover o `app.js` quebra o app inteiro.** Alinhar à Seção 4.3 do `PLANO_MODULARIZACAO_APP.md`: sempre `renderer(container)`. Incluir também a resolução dinâmica de aliases do perfil `estoque` que hoje só existe no `renderPage()` do `app.js`.

### 3.2 Migrar `SharedState`, `DATA` e `AICardapioEngine`
Os três só existem no `app.js` e são a dependência que trava tudo (Fase 2 do plano original, nunca executada). Enquanto isso não acontecer, o `app.js` é obrigatório.
**Atenção:** `DATA` é declarado com `let/const`, então **não** é propriedade de `window` — código que fizer `window.DATA` recebe `undefined` (erro real já encontrado e corrigido em `resolverColaboradorParaProduto`). Ao migrar, expor explicitamente via `window.DATA = DATA`.

### 3.3 Atribuir dono às funções cross-perfil
Dezenas de `window.abrirModalX/salvarY/imprimirZ`, mais `EngineAbastecimento`, são chamadas por `onclick=` de vários perfis. Cada uma precisa de destino explícito (um módulo ou o próprio Hub) — nenhuma pode ficar esquecida no `app.js`.

### 3.4 Institucionalizar o smoke test 🧪
Transformar o teste ad-hoc usado na auditoria em `tests/smoke-renderers.spec.js`: percorre **todos** os itens de menu de **todos** os perfis, renderiza no container real e falha em exceção ou tela vazia. Foi ele que pegou o mapa quebrado do Gestor e validou os 845 cortes de linha — os 82 specs atuais não cobrem as ~100 telas. Atende ao item de smoke test da Fase 6 do plano original.

---

## FASE 4 — Migração real, módulo por módulo
**Só começa depois da Fase 3 · um módulo por vez, do menor risco ao maior**

Os 6 arquivos de módulo **já existem** — a tarefa não é criá-los, é **elevar cada função ao nível da versão do `app.js`** e só então registrar a chave. Ordem recomendada (por volume e risco crescentes):

| Ordem | Módulo | Situação | O que falta |
|---|---|---|---|
| ✅ | `motorista.js` | **concluído** (2026-08-18) | — clone fiel, promovido, 344 linhas removidas do `app.js` |
| 1º | `escolas.js` | mais pobre | frequência/orçamento reais, timeline de status, sugestão IA, itens múltiplos nos pedidos |
| 2º | `colaboradores.js` | o mais raso | 2 gráficos do dashboard, filtro por cooperativa/agricultor + botões aceitar/despachar, tabela de escolas de 3→8 colunas, formulário real de produção, 6 relatórios com export CSV |
| 3º | `estoque.js` | mais pobre | conferência física RN01, confronto NF-e, separação FEFO RN06/RN07, motorista/veículo/rota + assinatura digital |
| 4º | `gestor.js` | mais pobre | 7 KPIs + flow diagram + 3 charts + widget IA, modais de detalhe de ATA/Empenho, export CSV |
| 5º | `nutricao.js` | parcialmente migrado | dashboard, cardápios (CRUD completo), fichas, restrições, consumo, desperdícios (cálculo real vs % fixo) |

**Ciclo obrigatório por módulo** (Fases 3–4 do `PLANO_MODULARIZACAO_APP.md`):

1. Elevar as funções do módulo à paridade com o `app.js` (código migrado, não reescrito por cima).
2. Registrar as chaves no módulo.
3. Rodar smoke test (3.4) + `npx playwright test` + conferir console do browser.
4. **Só então** remover o bloco correspondente do `app.js`.
5. Sincronizar `docs/` e revalidar.
6. Registrar em `F:\Nova cofre\ATIVIDADE_LOG.md`.

**Critério de saída para apagar o `app.js`** (Fase 5 do plano original): todas as chaves com substituto real, `SharedState`/`DATA`/`AICardapioEngine` no Hub, funções cross-perfil com dono, e os 82 testes + smoke test passando **com o `app.js` já fora do `index.html`**.

---

## Resumo executivo

| Fase | Escopo | Esforço | Risco | Depende de |
|---|---|---|---|---|
| **0** | Regressão da substituição sazonal | Baixo | Baixo | — |
| **1** | Desbloqueios (porta 8080, git, screenshots) | Baixo | — | você |
| **2** | 6 bugs pré-existentes independentes | Baixo cada | Baixo | — |
| **3** | Pré-requisitos p/ remover `app.js` | Alto | Alto fora de ordem | — |
| **4** | Migração real dos 5 módulos restantes | Muito alto | Alto | Fase 3 completa |

**Caminho mínimo para poder commitar com segurança:** Fase 0 + Fase 1.1 (validar com os 82 testes) + decisão da Fase 1.2.

## O que NÃO fazer

- ❌ Cortar linhas do `app.js` esperando que os módulos cubram — eles não cobrem (ver tabela da Fase 4).
- ❌ Adicionar tags `<script>` de módulo, ou registrar chaves, antes da paridade real (Regras 6 e 7).
- ❌ Mexer em `docs/` antes de validar (é o deploy público).
- ❌ Reordenar os `<script>` do `index.html` sem antes fazer a Fase 3.1 — hoje a ordem (`app.js` por último) é o que mantém o app funcionando.
