# 📑 PLANO DE ARQUITETURA E MODULARIZAÇÃO DO APP.JS
**Projeto:** SUALE — Vigia Educa (SEMED Campo Grande - MS)  
**Objetivo:** Dividir o arquivo monolítico `app.js` (~13.720 linhas) em 1 Hub Central + 6 Módulos Independentes (Opção A — Vanilla Scripts).  
**Destinado a:** Equipe de Desenvolvimento e Agentes de IA (Claude / Antigravity).

---

## ⚠️ Incidente Conhecido (revisão de 2026-08-18 — leia antes de continuar)

Uma primeira tentativa de execução deste plano (working tree da `feature/modularizacao-hub`, ainda não commitada) criou `js/core_hub.js` + `js/modules/*.js` e já adicionou as 6 tags `<script>` no `index.html`/`docs/index.html` **junto** com `app.js`, sem migração incremental. Isso expôs dois problemas graves que motivaram os ajustes abaixo:

1. **Roteador com contrato de chamada incompatível.** `app.js` chama cada renderer como `renderer(container)` (assinatura `(el) => { el.innerHTML = ...; }`, ~90 telas). O novo `core_hub.js` sobrescreve `window.renderPage` com uma versão que chama `PAGE_RENDERERS[key]()` **sem argumento** e espera um **retorno** de string. Como o script do Hub carrega depois de `app.js`, sua versão vence — e toda tela que ainda usa a assinatura antiga quebra com `TypeError: Cannot set properties of undefined (setting 'innerHTML')`. Isso inclui telas prontas e testadas hoje mesmo (Central de Estoque).
2. **Módulos "esqueleto" sobrescrevendo telas reais.** Os módulos criados não migraram código — escreveram funções novas e pequenas, e em vários casos mapearam telas reais e detalhadas (ex.: `nutricionista_cardapios`, `fichas`, `produtos`, `restricoes`, `relatorios`, `guiasentrega`, `estoquesual`, `escolas`, `consumo`, `desperdicios`) para `return renderNutricionistaDashboard();` — ou seja, 10 telas reais viraram a mesma tela genérica, silenciosamente, sem erro. O total de linhas escritas (~865) é ~7% do estimado na Seção 6 (~13.500) — não houve migração de fato, só um esqueleto de arquivos.
3. **`docs/` (deploy do GitHub Pages) já foi tocado** com os mesmos scripts quebrados, antes de qualquer validação — risco de quebrar o site público se for commitado/enviado como está.

As Regras e Fases abaixo foram ajustadas para que isso não se repita.

### ✅ Situação após a limpeza de 2026-08-18 17:40

O estado descrito acima foi **corrigido** (validado com smoke test das 100 telas dos 11 perfis, 0 falhas):

- **Contrato de chamada resolvido:** o `index.html` passou a carregar `app.js` **por último**, então o `renderPage()` do `app.js` (que chama `renderer(container)`, a assinatura correta da Seção 4.3) é o vigente. O `renderPage()` do `core_hub.js` fica inerte. **Antes de remover o `app.js`, o `core_hub.js` precisa ser corrigido para a assinatura da Seção 4.3** — hoje ele ainda tem a versão incompatível.
- **Módulos alinhados à Regra 6:** todos os registros de `PAGE_RENDERERS` que sombreavam versões mais completas do `app.js` foram removidos dos 6 módulos (47 no `gestor`/`estoque`/`escolas`/`colaboradores` + 9 no `nutricao`). As funções continuam nos arquivos, prontas para assumir; cada bloco de registro tem comentário explicando o critério.
- **Estado real medido:** das ~115 chaves, **5 vêm de módulo e são alcançáveis** (as 4 do Motorista + Guias de Entrega da Nutrição) e 3 são exclusivas úteis mas ainda sem item de menu. O resto vem do `app.js` — que segue sendo a fonte de ~95% das telas.
- **`motorista.js` promovido:** é o único módulo que era clone fiel; assumiu as 4 telas do Motorista e as ~344 linhas equivalentes saíram do `app.js`.
- **`app.js` enxugado:** 13.844 → 12.999 linhas, sem nenhuma duplicata interna restante.
- **`docs/` sincronizado e verificado** arquivo por arquivo (não mais divergente).

**Portanto a Fase 4 pode prosseguir com segurança**, um módulo por vez: a tarefa agora não é *criar* os arquivos (já existem), é **elevar cada função do módulo ao nível da versão do `app.js`** e só então registrar a chave e remover o bloco correspondente do `app.js`.

### ✅ CONCLUÍDO — Fases 4, 5 e 6 (2026-08-19)

Todo o restante do plano foi executado e validado (suíte Playwright 82/82 + smoke das 111 telas, 0 falhas, **com `app.js` removido do `index.html`**):

- **Fase 4 concluída** (todas as telas migradas por código real, Regra 6):
  - `fase4.4` — 12 telas do Nutricionista → `nutricao.js`.
  - `fase4.5` — Merendeira + `escola_restricoes` → `escolas.js`.
  - `fase4.6` — 11 telas do Gestor → `gestor.js` (antes o módulo registrava 0 chaves).
  - `fase4.7` — cluster cross-perfil `*_escolas`: `cooperativa_escolas`→`colaboradores.js`, `motorista_escolas`→`motorista.js`, demais aliases viram **closures** (imunes à ordem de carga).
  - Marco: `app.js` deixou de registrar qualquer chave de `PAGE_RENDERERS`.
- **Fase 5/6 concluída** (`fase5`):
  - Corpo remanescente do `app.js` (helpers, engines, handlers cross-perfil, `renderPage`, bootstrap) **absorvido em `js/core_hub.js`**; removidas do Hub as definições inertes/incompatíveis (helpers com assinatura antiga e o `renderPage` que retornava string).
  - `app.js` e `docs/app.js` **removidos** (recuperáveis via histórico).
  - `core_hub.js` passou a carregar **por último** (posição do antigo `app.js`) para preservar a semântica de produção — ver nota abaixo.
  - Esqueleto morto do `gestor.js` removido.
  - Adicionado `tests/smoke-renderers.spec.js` (itera todas as chaves de `PAGE_RENDERERS`).

**Nota de ordem de carga (importante):** o Hub carrega **depois** dos 6 módulos, não antes como no rascunho da Fase 5 abaixo. Motivo: `estoque.js` e `nutricao.js` ainda têm handlers `window.*` duplicados que, se carregados por último, sombreariam as versões reais do ex-`app.js`. Com o Hub por último, as funções reais prevalecem (paridade com produção). Limpeza desses handlers duplicados nos módulos fica como refinamento futuro (hoje são dead code corretamente sombreado).

---

## 1. 🎯 Visão Geral & Diretrizes

Atualmente, o `app.js` contém toda a lógica de estado, UI global, modais e renderizadores de telas de todos os 6 perfis em um único arquivo de 780 KB. 

A refatoração irá reorganizar o código em módulos desacoplados, onde cada módulo é responsável exclusivamente pelas telas e regras do seu perfil, enquanto um **Hub Central** gerencia a infraestrutura comum, estado global e roteamento.

### ⚠️ Regras Obrigatórias de Execução
1. **Preservar Contratos DOM:** Não alterar IDs de botões, classes CSS principais ou tabelas. Todos os 82 testes automatizados do Playwright em `tests/` devem continuar passando sem modificações nos seletores.
2. **Zero Dependência de Build Tools:** Seguir a **Opção A** (carregamento por `<script src="...">` nativo do navegador), mantendo compatibilidade total e instantânea com GitHub Pages (`docs/`).
3. **Isolamento em Branch:** Nenhuma alteração de código será feita diretamente na `master`. Todo o processo será realizado na branch `feature/modularizacao-hub`.
4. **Validação Contínua:** A cada módulo extraído, rodar a suíte `npx playwright test`.
5. **Contrato de chamada do roteador é fixo e não pode ser reinventado:** o novo `renderPage()` do Hub deve continuar invocando cada renderer como `renderer(container)` — a mesma assinatura `(el) => { el.innerHTML = ...; }` já usada por todas as telas em `app.js` hoje. Nenhum renderer, novo ou migrado, deve depender de valor de retorno. Ver Seção 4.3.
6. **Migração real, nunca stub-por-cima-de-tela-real:** um módulo só pode registrar uma chave em `PAGE_RENDERERS` quando a função for **código efetivamente movido/portado** de `app.js` (ou uma reescrita comprovadamente equivalente). É proibido registrar uma função genérica (ex.: redirecionar para o dashboard do perfil) no lugar de uma tela que já existe e funciona em `app.js`. Se o módulo ainda não migrou aquela tela, **não registre a chave** — deixe `app.js` continuar respondendo por ela até que a migração real aconteça.
7. **Inclusão de `<script>` é incremental, nunca em lote:** o `index.html` (e o `docs/index.html`) só deve referenciar um módulo (`js/modules/X.js`) depois que **todas** as telas daquele perfil estiverem migradas de verdade e os testes daquele perfil passando. Nunca adicionar as 6 tags de módulo de uma vez só "para já deixar preparado" — isso reintroduz o problema do Incidente Conhecido acima.

---

## 2. 🌿 Estratégia de Git & Branching

Antes de modificar qualquer código de produção:
```bash
# 1. Garantir que está na master e com working tree limpo
git checkout master
git pull origin master

# 2. Criar e alternar para a branch dedicada de testes
git checkout -b feature/modularizacao-hub
```

*(Se no futuro for decidido migrar para um repositório separado, esta branch servirá como a base limpa e pronta para a migração).*

---

## 3. 📂 Estrutura Proposta de Arquivos

```
f:/Projetos/vigia educa/
├── index.html                   # Importa core_hub.js e os 6 módulos
├── styles.css
├── alimentos.js
├── db.js
├── ai_cardapio_engine.js
├── js/
│   ├── core_hub.js              # HUB CENTRAL (SharedState, Router, Modais, Toast, Helpers)
│   └── modules/
│       ├── gestor.js            # Módulo Perfil Gestor SEMED
│       ├── nutricao.js          # Módulo Perfil Nutricionista
│       ├── estoque.js           # Módulo Perfil Central de Estoque (CD / Almoxarifado)
│       ├── escolas.js           # Módulo Perfil Escola (Diretor / Merendeira)
│       ├── motorista.js         # Módulo Perfil Motorista (Logística / Carregamento)
│       └── colaboradores.js     # Módulo Perfil Colaboradores (Cooperativas / Agricultor)
└── docs/                        # Espelho para GitHub Pages (mantido sincronizado)
```

---

## 4. 🏛️ Responsabilidade de Cada Componente

### 4.1. `js/core_hub.js` (HUB CENTRAL)
- **Constantes de Versão:** `APP_VERSION`, `APP_BUILD_DATE`, `USAR_CATALOGO_LOCAL`.
- **Sanitização DOM:** `window.escapeHTML()`.
- **Sistema Global de UI:** `window.showModal()`, `closeModal()`, `showToast()`.
- **Helpers de Renderização HTML:** `_kpi()`, `_pageHeader()`, `_cardHeader()`, `_tag()`, `_statusBadge()`, `_emptyState()`.
- **Estado Global & EventBus:** `window.SharedState` (gerenciador de dados do `localStorage` e emissor/receptor de eventos `_emit` / `_on`), incluindo **`DATA`** (seed/dataset) e **`AICardapioEngine`** — hoje os três só existem em `app.js`; migrá-los para `core_hub.js` é trabalho pendente e **obrigatório antes de remover `app.js`** (ver Fase 2 e o critério de saída da Fase 5). Não basta o Hub *assumir* que `SharedState` "já vai existir" — enquanto `app.js` for a única fonte desses globais, ele não pode ser removido.
- **Motor de Roteamento:** `window.PAGE_RENDERERS = {}` e função `window.renderPage(pageKey)` — deve preservar o contrato de chamada da Seção 4.3.
- **Gerenciador de Sessão e Perfis:** Troca de perfil no menu superior e atualização de avatar/header.
- **Funções cross-perfil de `app.js` sem dono claro:** dezenas de `window.abrirModalX/salvarY/imprimirZ` e motores como `EngineAbastecimento` são chamados a partir de múltiplos perfis (ex.: modais de ATA/Empenho, Engine de Abastecimento em 7 Passos, funções de impressão). Cada uma precisa ser explicitamente atribuída a um módulo (ou ao próprio `core_hub.js`, se for genuinamente cross-perfil) durante o mapeamento da Fase 2 — não podem ficar "esquecidas" em `app.js`.

### 4.2. Módulos de Perfis (`js/modules/*.js`)
Cada módulo se auto-registra no `PAGE_RENDERERS` do Hub ao carregar:
```javascript
// Exemplo em js/modules/motorista.js
(function() {
  if (!window.PAGE_RENDERERS) window.PAGE_RENDERERS = {};

  PAGE_RENDERERS['motorista_dashboard'] = renderMotoristaDashboard;
  PAGE_RENDERERS['motorista_carregamento'] = renderMotoristaCarregamento;
  PAGE_RENDERERS['motorista_rotas'] = renderMotoristaRotas;

  function renderMotoristaDashboard() { /* ... */ }
  function renderMotoristaCarregamento() { /* ... */ }
  function renderMotoristaRotas() { /* ... */ }
})();
```

---

## 4.3. 📐 Contrato de Chamada dos Renderizadores (OBRIGATÓRIO)

Este é o ponto que causou o Incidente Conhecido — trate como regra dura, não como sugestão.

- **Assinatura fixa:** todo renderer em `PAGE_RENDERERS[key]` recebe o elemento container e escreve nele diretamente. Nunca retorna a string HTML.
  ```javascript
  // CORRETO — é assim que app.js já funciona hoje, e como todo módulo novo deve funcionar
  PAGE_RENDERERS['motorista_dashboard'] = function(el) {
    el.innerHTML = `...`;
  };
  ```
  ```javascript
  // ERRADO — quebra qualquer renderer que app.js ainda não migrou
  PAGE_RENDERERS['motorista_dashboard'] = function() {
    return `...`;
  };
  ```
- **`renderPage()` do Hub chama sempre `renderer(container)`**, nunca `renderer()`. Antes de substituir `window.renderPage`, releia a implementação atual em `app.js` (`function renderPage()`) e replique exatamente essa forma de invocação.
- **Antes de sobrescrever `window.renderPage`, `window.PAGE_RENDERERS` ou `window.SharedState`**, confirme que a nova versão é um **superconjunto** funcional da atual — nunca uma reescrita paralela e incompatível enquanto `app.js` ainda está carregado.
- **Checklist rápido antes de cada commit desta branch:** abrir o app no browser, navegar por pelo menos 1 tela de cada perfil e confirmar no console que não há `TypeError` relacionado a `undefined` em `el`/`container`.

---

## 5. 🔄 Conexão Inter-Módulos (EventBus & SharedState)

Os módulos **não importam uns aos outros diretamente**. Eles se comunicam através do barramento de eventos do `SharedState`.

### Exemplo de Comunicação Reativa:
1. **Publicação no Módulo Nutrição (`nutricao.js`):**
   ```javascript
   // Nutricionista clica em "Publicar Cardápio"
   SharedState.publishMenu(menuId);
   // SharedState automaticamente executa: SharedState._emit('menu:published', menuData);
   ```
2. **Reação no Módulo Estoque (`estoque.js`):**
   ```javascript
   // Módulo Estoque escuta a publicação e gera as OS de separação
   SharedState._on('menu:published', (menu) => {
     gerarOrdensDeServicoPorEscola(menu);
   });
   ```
3. **Reação no Módulo Motorista (`motorista.js`):**
   ```javascript
   // Quando a OS do Estoque muda para 'Separado', o Motorista recebe na fila de embarque
   SharedState._on('os:separado', (os) => {
     adicionarFilaCarregamento(os);
   });
   ```

---

## 6. 🗺️ Mapeamento Detalhado de Linhas do `app.js` Atual

| Componente Alvo | Função / Conteúdo no `app.js` Atual | Estimativa de Linhas |
| :--- | :--- | :--- |
| **`core_hub.js`** | Configurações iniciais, `escapeHTML`, Modal System, Toast, Helpers HTML, `SharedState`, `renderPage()`, `PAGE_RENDERERS` base, header/avatar/login listeners. | ~1.800 linhas |
| **`modules/gestor.js`** | `gestor_dashboard`, `gestor_escolas`, `gestor_contratos`, `gestor_cardapios`, `gestor_previsao-ia`, `gestor_ordens-servico`, `gestor_recebimentos-pendentes`, `gestor_expedicao-os`, `gestor_ordens-entrega`, `gestor_rastreabilidade-lotes`, etc. | ~3.800 linhas |
| **`modules/nutricao.js`** | `nutricionista_dashboard`, `nutricionista_planejador`, `nutricionista_cardapios`, `nutricionista_fichas-tecnicas`, `nutricionista_dietas-especiais`, modais de cardápio e cálculo PNAE. | ~2.400 linhas |
| **`modules/estoque.js`** | `estoque_dashboard`, `estoque_inventario`, `estoque_conferencia-nfe`, `estoque_picking-fefo`, `estoque_os-central`, `estoque_movimentacoes`. | ~2.100 linhas |
| **`modules/escolas.js`** | `escola_dashboard`, `escola_recebimento`, `escola_estoque-local`, `escola_cardapio-dia`, `escola_registro-sobras`, `escola_solicitacoes`. | ~1.600 linhas |
| **`modules/motorista.js`** | `motorista_dashboard`, `motorista_carregamento-bipagem`, `motorista_rotas-entregas`, `motorista_comprovantes`. | ~800 linhas |
| **`modules/colaboradores.js`**| `colaboradores_dashboard`, `agricultor_entregas`, `agricultor_produtos`, `cooperativa_pedidos`, `cooperativa_contratos`. | ~1.200 linhas |

---

## 7. 🚀 Roteiro de Execução Passo a Passo (Fases)

### FASE 1: Preparação do Ambiente
- [ ] Criar branch `feature/modularizacao-hub` (`git checkout -b feature/modularizacao-hub`).
- [ ] Criar estrutura de pastas `js/modules/`.

### FASE 2: Extração do Core Hub
- [ ] Criar `js/core_hub.js` com a infraestrutura base, **respeitando o contrato de chamada da Seção 4.3** (não reescrever `renderPage` com uma assinatura diferente da atual de `app.js`).
- [ ] Garantir que `window.PAGE_RENDERERS` e `window.SharedState` estejam acessíveis globalmente.
- [ ] Migrar de fato `SharedState`, `DATA` e `AICardapioEngine` de `app.js` para `core_hub.js` (não apenas assumir que continuarão vindo de `app.js` — ver nota da Seção 4.1). Enquanto isso não acontecer, `app.js` é uma dependência obrigatória e **não pode ser removido** (afeta o critério de saída da Fase 5).
- [ ] Mapear e atribuir explicitamente cada função cross-perfil solta em `app.js` (modais de ATA/Empenho, `EngineAbastecimento`, funções de impressão de guias/OS, etc.) a um módulo ou ao próprio Hub — nenhuma pode ficar sem dono.

### FASE 3: Migração do Piloto (`motorista.js`)
- [ ] Mover (código real, não reescrever do zero) os renderizadores do Motorista de `app.js` para `js/modules/motorista.js`, preservando a assinatura `(el) => {...}`.
- [ ] Incluir `<script src="js/modules/motorista.js"></script>` no `index.html` **somente após** o módulo cobrir 100% das telas do perfil Motorista — nunca antes.
- [ ] Testar navegação em todas as telas do perfil Motorista (não só a primeira).
- [ ] Executar `npx playwright test` e conferir os erros de console no browser, não só o resultado final da suíte — um roteador incompatível pode passar despercebido se os testes não cobrirem toda tela.
- [ ] Só depois de tudo isso validado, remover as chaves correspondentes de `app.js` (ou deixá-las como estão — nunca deixar duas fontes divergentes da mesma tela "correta" coexistindo silenciosamente).

### FASE 4: Migração dos Demais Módulos (Substituição Gradual do `app.js`)
Repetir o mesmo ciclo completo da Fase 3 (migrar → incluir `<script>` → testar todas as telas → validar console → só então seguir) **um módulo por vez**, nesta ordem:
- [ ] `js/modules/nutricao.js`.
- [ ] `js/modules/estoque.js`.
- [ ] `js/modules/escolas.js`.
- [ ] `js/modules/colaboradores.js`.
- [ ] `js/modules/gestor.js`.

⚠️ Nunca adicionar as tags `<script>` de mais de um módulo de uma vez, e nunca registrar uma chave de `PAGE_RENDERERS` que apenas redireciona para uma tela genérica no lugar da tela real (Regra 6). Se um módulo ficar pela metade, o app deve continuar 100% funcional usando `app.js` para as telas ainda não migradas.

### FASE 5: Ajuste de HTML e Script Tags
- [ ] Atualizar o rodapé do `index.html` **substituindo** `app.js` pelos 6 módulos (não somando às tags existentes):
  ```html
  <script src="alimentos.js?v=2.7.3"></script>
  <script src="db.js?v=2.7.3"></script>
  <script src="ai_cardapio_engine.js?v=2.7.3"></script>
  <script src="js/core_hub.js?v=3.0.0"></script>
  <script src="js/modules/gestor.js?v=3.0.0"></script>
  <script src="js/modules/nutricao.js?v=3.0.0"></script>
  <script src="js/modules/estoque.js?v=3.0.0"></script>
  <script src="js/modules/escolas.js?v=3.0.0"></script>
  <script src="js/modules/motorista.js?v=3.0.0"></script>
  <script src="js/modules/colaboradores.js?v=3.0.0"></script>
  <script src="sprint_abc.js?v=2.7.3"></script>
  ```
- [ ] **Critério de saída obrigatório antes de remover `app.js`** (checar todos, não apenas "os 6 arquivos existem"):
  - [ ] `SharedState`, `DATA` e `AICardapioEngine` já vivem em `core_hub.js` (Fase 2), não mais em `app.js`.
  - [ ] Toda chave de `PAGE_RENDERERS` que `app.js` registrava tem um equivalente real (não-stub) em algum módulo — gerar um diff de chaves antes/depois para confirmar que nenhuma tela ficou sem dono.
  - [ ] Toda função cross-perfil (`window.abrirModalX`, `EngineAbastecimento`, funções de impressão, etc.) referenciada por `onclick=` no HTML ou por outros módulos tem um novo lar confirmado.
  - [ ] Os 82 testes Playwright passam com `app.js` **removido do `index.html`** localmente, não apenas com ele ainda presente "por garantia".
- [ ] Só então remover ou arquivar o `app.js` monolítico antigo.

### FASE 6: Validação E2E & Sincronização com `docs/`
- [ ] Rodar um smoke test simples que itera por todas as chaves de `PAGE_RENDERERS` × perfis chamando `renderer(container)` num container de teste e captura qualquer exceção — os 82 testes Playwright não cobrem necessariamente todas as ~90 telas, e um roteador incompatível (como no Incidente Conhecido) precisa ser pego aqui, não só "ajustando seletores".
- [ ] Executar os 82 testes do Playwright (`npx playwright test`).
- [ ] Garantir 100% de aprovação (82/82) **com `app.js` já removido**.
- [ ] Só depois disso, sincronizar os arquivos da pasta `js/` para `docs/js/` e replicar as mesmas tags em `docs/index.html` (nunca em paralelo com um módulo ainda incompleto — o `docs/` é o deploy público do GitHub Pages).
- [ ] Registrar nova versão no Obsidian (`F:\Nova cofre\ATIVIDADE_LOG.md`).
- [ ] Apresentar ao usuário para aprovação e PR de merge para a `master`.

---

## 🤖 Guia Prático para a IA (Claude / Antigravity)

Quando for executar as tarefas nesta branch:
1. **Verifique sempre o status dos testes** antes e depois de modificar qualquer arquivo com `npx playwright test`, e leia os erros de console do browser, não só o resumo da suíte — nem tudo que quebra é pego pelos 82 specs.
2. **Nunca exclua ou renomeie eventos** do `SharedState` (`menu:published`, `order:status_change`, etc.).
3. **Mantenha as assinaturas das funções de renderização** intactas no `PAGE_RENDERERS` — `renderer(container)`, sempre, nunca `renderer()` com retorno (Seção 4.3). Antes de tocar em `renderPage`, `PAGE_RENDERERS` ou `SharedState`, releia como `app.js` já os implementa.
4. **Grave cada progresso no log de atividades** (`F:\Nova cofre\ATIVIDADE_LOG.md`) — incluindo qualquer desvio do plano ou problema encontrado, não só os sucessos.
5. **Nunca registre uma tela-stub no lugar de uma tela real e já testada.** Se a migração de uma tela ainda não está completa, não registre a chave — deixe `app.js` responder por ela.
6. **Nunca adicione `<script>` de um módulo, nem sincronize `docs/js/`, antes desse módulo estar 100% migrado e validado.** Uma branch de modularização "pela metade" ligada em produção (ou pronta para ir) é o pior estado possível — pior do que não ter começado.
