# 🛠️ AJUSTE 02 (Antigravity) — Montagem de Carga só com O.E. já criada

**Regra do cliente:** *"Após a criação da O.E., ela é liberada para Montagem de Carga. Não é
possível montar carga com O.E. que não foi criada."*

## Sequência oficial (garantir esta ordem)
`Separação FEFO → Criar O.E. → O.E. "liberada para carga" → Montagem de Carga → despacho ao Motorista`

## O que fazer
1. **Gating do pool da Montagem de Carga:** o modal de Montagem de Carga deve listar/permitir
   **apenas Ordens de Entrega (O.E.) já criadas** e que **ainda não estejam em nenhuma carga**.
   - O.S. ainda em separação, ou "Separado"/"Separado parcial" **sem O.E. criada**, **não entram**
     na montagem de carga (não aparecem no pool e não podem ser adicionadas).
   - Uma O.E. **já alocada a uma carga** também não deve reaparecer para nova alocação.
2. **Estado da O.E.:** ao ser criada, a O.E. entra como **"liberada para carga"** (ex.: status
   `Aguardando carga`). Só depois de entrar numa carga ela segue o fluxo logístico.
3. **Momento do despacho ao Motorista:** o disparo para o Motorista (o pedido `Em transporte`
   via `addOrder`) deve ocorrer **quando a carga é montada/despachada**, **não** no momento da
   criação da O.E. Ajuste `salvarNovaOrdemEntrega` para **apenas criar a O.E. liberada**; mova o
   `addOrder(... driver ...)` para a conclusão da **Montagem de Carga** (a carga define o
   caminhão/motorista que leva as O.E. daquela viagem).
   - Se hoje a criação da O.E. já dispara direto ao motorista (comportamento do commit `3833abb`),
     **remova esse disparo da criação da O.E.** e passe-o para a montagem/despacho da carga.

## Não quebrar o que já existe
- Manter **1 escola = 1 O.E.**; a carga agrupa várias O.E.
- Manter a **trava de peso** (A1) e a **sugestão por capacidade** (A2) — agora operando sobre o
  pool de O.E. liberadas.
- Manter a **dupla checagem** (B7) no fechamento da entrega.

## Definition of Done
- No modal de Montagem de Carga, **só aparecem O.E. criadas e sem carga**; O.S. sem O.E. não
  entram; O.E. já em carga somem do pool.
- O Motorista recebe a entrega **apenas após a carga ser montada/despachada** (não na criação da O.E.).
- `npx playwright test` ≥ 82/82 + smoke 0 falhas; **sem erro de console**; **`docs/` sincronizado**.
- Registrar o ajuste no topo de `F:\Nova cofre\ATIVIDADE_LOG.md`.
