# 🛠️ AJUSTE 03 (Antigravity) — Liberar Carga para Entrega + Rastreabilidade só em rota

**Contexto:** você já criou Montagem de Carga, Ordens de Entrega e Rastreabilidade. Faltam o passo
de **liberação** da carga e o **filtro** do que aparece no rastreio. Detalhe na Seção A2b e B9 do
`ESPEC_EXPEDICAO_LOGISTICA.md`.

## 1) Liberar Carga para Entrega
- Após montar a carga, adicionar a ação **"Liberar para Entrega"**.
- **Se o peso total < capacidade** do caminhão → **modal de confirmação**:
  *"O caminhão não atingiu o peso máximo (X / 5.400 kg). Liberar mesmo assim?"* — só prossegue no OK.
- **Ao liberar:**
  - Carga: `Em Montagem` → **`Em Rota`**.
  - Cada **O.E. da carga** → **`Em transporte`** e é **despachada ao Motorista** (`addOrder` por
    driver = motorista da carga). **Este é o único ponto de disparo ao motorista** (remova o disparo
    da criação da O.E., conforme Ajuste 02 — a O.E. nasce `Aguardando carga`).
  - O caminhão passa a **aparecer na Rastreabilidade**.
- **Não** permitir liberar carga **vazia**.

## 2) Dois modais / visões de O.E.
Na Montagem de Carga (e/ou na tela Ordens de Entrega), separar claramente:
- **O.E. pendentes** — `Aguardando carga`, ainda **sem caminhão** (é o pool para montar).
- **O.E. já anexadas a caminhões** — já em carga (mostrar por caminhão/carga).
> Uma O.E. já em carga **não** aparece no pool de pendentes.

## 3) Rastreabilidade (B9) — só caminhões em rota + parada atual
- Listar **apenas caminhões com carga LIBERADA / em rota**. Caminhões `Em Montagem` ou `Standby`
  **não aparecem** no rastreio (o "Em Montagem" pertence à ação **Montagem de Carga**).
- Para cada caminhão em rota, mostrar a **parada atual** (em qual destino/escola ele está agora —
  A, B, …) na sequência da rota, além de carga e status. Sem GPS: "posição" = parada corrente da rota.

## Fluxo final esperado
`Separação → Criar O.E. (Aguardando carga) → Montagem de Carga → Liberar para Entrega
 → O.E. Em transporte + despacho ao Motorista → Caminhão aparece na Rastreabilidade (parada atual)
 → dupla checagem (Motorista + Escola) → Concluída`

## Definition of Done
- Botão "Liberar para Entrega" com confirmação quando abaixo do peso; sem liberar carga vazia.
- Motorista recebe as O.E. **só após a liberação** (não na criação da O.E.).
- Rastreabilidade mostra **só caminhões em rota**, com a **parada atual**; "Em Montagem" fica na Montagem de Carga.
- Dois modais/visões: O.E. pendentes × O.E. já em caminhão.
- `npx playwright test` ≥ 82/82 + smoke 0 falhas; **sem erro de console**; **`docs/` sincronizado**; registrar no log.
