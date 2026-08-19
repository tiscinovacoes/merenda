# 🛰️ PROMPT DE EXECUÇÃO — Antigravity

**Tarefa:** implementar o épico **Expedição & Logística** do SUALE conforme a especificação.
**Papel:** você é o desenvolvedor. O refinamento/PO já foi feito pelo Claude e está **fechado**.

---

## Leia primeiro (obrigatório, nesta ordem)
1. `F:\Nova cofre\ATIVIDADE_LOG.md` — log de coordenação Claude↔Antigravity (leia o topo antes de começar).
2. `ESPEC_EXPEDICAO_LOGISTICA.md` (raiz do repo) — **a especificação-alvo completa e travada**. É a fonte da verdade.
3. `PLANO_MODULARIZACAO_APP.md` — regras de arquitetura (contrato de renderers, `docs/`, ordem de carga).

## Contexto de código (não reintroduza o que foi removido)
- Front-end puro, sem build. **`app.js` foi REMOVIDO** — Hub = `js/core_hub.js`, telas em `js/modules/*.js`.
- Telas registram `PAGE_RENDERERS[key] = (el) => { el.innerHTML = ... }` (contrato fixo, **nunca** retornar string).
- **`core_hub.js` carrega por ÚLTIMO** (depois dos 6 módulos). Handlers cross-perfil e estado ficam nele.
- **"Banco" = `SharedState`** (singleton + `localStorage` + EventBus `_emit`/`_on`). Todo o novo modelo de dados vive aqui. **NÃO** usar Supabase agora.
- Cuidado com a armadilha já conhecida: `getX()` do SharedState costuma retornar **cópia** (`[...arr]`) — para persistir, mutar `SharedState._data.X` e chamar `_persist()`, nunca `getX().push()`.
- Padrão visual: `kpi-grid`/`kpi-card {blue|orange|teal|green|red}`, `card`, `data-table`, `tag`, `status-badge`.

## Ordem de trabalho
Siga os **Sprints 1→5** da Seção 4 da `ESPEC_EXPEDICAO_LOGISTICA.md`, **um por vez**. Comece pelo **Sprint 1** (é a base e corrige o bug D11).

## Definition of Done (a cada sprint, sem exceção)
1. `npx playwright test` **verde (≥ 82/82)** + `tests/smoke-renderers.spec.js` **0 falhas**.
2. **Sem erro no console** do navegador (verifique de fato, não só a suíte).
3. **`docs/` sincronizado** arquivo a arquivo (é o deploy do GitHub Pages).
4. **Nova entrada no topo** de `F:\Nova cofre\ATIVIDADE_LOG.md` descrevendo o que fez, decisões e pendências.
5. Commits pequenos e descritivos na branch `fix/guias-entrega-e-limpeza-appjs` (ou a branch de trabalho vigente). **Não** commitar chave de API. **Não** mexer nas 60 screenshots pendentes (ficam fora dos commits).

## Decisões já fechadas (não reabrir)
- Peso em **kg**; **1 L = 1 kg**. Trava de peso **vem do Cadastro de Caminhões** (default 5.400, editável); ao exceder, **avisa e bloqueia**, sugerindo outro caminhão.
- **1 escola = 1 OE**; **Carga/Viagem** agrupa várias OEs num caminhão. Montagem de Carga é um **modal** com sugestão por capacidade restante e ocupação por caminhão.
- **Fracionar OS** na separação → saldo vira **nova OS pendente** (sufixo + prioridade herdada).
- **Roteirização: só a TELA agora**, com adaptador `RoutingProvider` **pronto para OpenRouteService** (heurística por enquanto; ver Seção 5 da espec). Endereços/coordenadas/horários entram no **cadastro da Escola**.
- **Cobertura (C10):** "atendida" = escola com **OE vinculada ao seu `escolaId` dentro do `cardapioId`** do período; filtro por cardápio + semana/mês/ano; KPIs clicáveis; dashboards do **Gestor e Estoque**.
- **D12:** unificar "Posição de Estoque" + "OS Estoque Central" em **"Estoque Central"** (mantém inventário + NF-e via XML); **OS de distribuição vão para "Expedição (OS Escolas)"** com os campos corretos — isso corrige o bug D11 (`undefined`).
- **Dupla checagem (B7):** OE fecha em "Entregue" com **Motorista + Escola**; do lado da escola confirmam **Resp. Estoque (repositor) e Diretor**. Remover a confirmação do lado do Estoque.
- **Ocorrências:** por módulo (Motorista=entrega, Estoque=almoxarifado) **+ Livro consolidado no Gestor**.
- **App do motorista (G17):** apenas as **telas** mobile-first agora; integração/PWA depois.

## Como reportar
Ao concluir cada sprint, registre no log e me devolva um resumo: o que entrou, evidências de validação (nº de testes, prints/telas), e o que ficou pendente para o próximo sprint. Se encontrar ambiguidade **não coberta pela espec**, **pare e registre a dúvida no log** em vez de decidir por conta própria.
