# 🛠️ AJUSTE 01 (Antigravity) — Restaurar "Recebimentos Pendentes" no perfil Estoque

**Contexto:** você já executou o Sprint 1 (D12) localmente. Nessa reorganização de menu, a tela
**"Recebimentos Pendentes" foi removida por engano**. Ela **NÃO deve deixar de existir** — é
**o ponto de entrada de mercadoria no estoque**. O erro veio da minha espec (a Seção 3 não a
listava); **já corrigi** o `ESPEC_EXPEDICAO_LOGISTICA.md` (Seção 3).

## O que fazer
1. **Restaurar "Recebimentos Pendentes"** como item de menu próprio no perfil **Estoque Central**
   (grupo "Gerenciamento Estoque"), e a tela correspondente.
2. A tela é a **fila de recebimento de mercadorias dos fornecedores**, e é por onde se **dá
   entrada no estoque** via **Conferência Física (RN01)**: ao gravar a conferência, a quantidade
   aprovada entra no estoque (estoque físico + Estoque Central vigente + baixa de empenho) e o
   status vai para "Recebido"/"Recebido parcialmente". Esse comportamento **já existe** — não o
   perca: reutilize `window.salvarConferenciaFisica` + `window._darEntradaEstoqueRecebimento`
   (ponto único de entrada) e `window.abrirModalConfronto4Vias` / `aprovarEntradaFinalEstoque`.
3. O renderer da tela é `PAGE_RENDERERS['gestor_recebimentos-pendentes']` (o perfil Estoque a
   reaproveita via alias `estoque_recebimentos-pendentes`). Se o D12 mexeu no menu/roteamento,
   garanta que a chave e o item de menu voltem a resolver para essa tela.

## Não confundir (o D12 continua valendo assim)
- **"Posição de Estoque" → "Estoque Central"** (inventário/posição + botão "Receber NF-e via XML").
- **"OS Estoque Central"** deixa de ser destino das O.S. de distribuição → elas vão para
  **"Expedição (OS Escolas)"** (isso corrige o bug D11 de produto/qtd `undefined`).
- **"Recebimentos Pendentes" PERMANECE** — entrada de mercadoria por conferência física.

> Distinção importante: **"Receber NF-e via XML"** (botão dentro do Estoque Central) e
> **"Recebimentos Pendentes"** (fila de conferência física que dá entrada) são **coisas
> diferentes e ambas existem**. Não fundir uma na outra.

## Definition of Done
- Menu do Estoque mostra "Recebimentos Pendentes" e a tela abre com a fila de fornecedores.
- Fluxo de entrada validado: "Conf. Física" → gravar → status muda para "Recebido" e o produto
  dá entrada (confira no Inventário/Estoque Central e no saldo do empenho).
- `npx playwright test` ≥ 82/82 + smoke `tests/smoke-renderers.spec.js` 0 falhas; **sem erro de
  console**; **`docs/` sincronizado**.
- Registrar o ajuste no topo de `F:\Nova cofre\ATIVIDADE_LOG.md`.
