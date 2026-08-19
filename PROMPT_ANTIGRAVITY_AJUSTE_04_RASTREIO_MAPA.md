# 🛠️ AJUSTE 04 (Antigravity) — Rastreamento do caminhão em mapa (não abrir Montagem de Carga)

**Bug atual:** na tela **Rastreabilidade (Caminhões)**, o botão de ação da linha (ex.: "OEs da Rota"
/ "Rota & OEs") está **abrindo o popup de Montagem de Carga** — está errado.

## O que fazer
1. **A ação da linha abre um MODAL de Rastreamento do Caminhão** (não a Montagem de Carga).
2. Como o caminhão tem **várias paradas/O.E.**, o modal deve mostrar **onde ele está em tempo real**:
   - **Mapa fictício/simulado** (mock) com o **marcador do caminhão** posicionado na rota e
     **avançando entre as paradas** (simule o movimento — ex.: marcador que anda por etapas/timer
     entre os pontos das escolas). A integração de **GPS real será feita depois**.
   - **Sequência de paradas** (escolas da rota) com a **parada atual destacada** (ex.: "Parada 2/3").
   - **Lista das O.E.** daquela carga (escola, itens, status).
3. **Isolar o ponto de integração:** a posição do caminhão vem de uma função/fonte trocável
   (hoje = mock/simulação; amanhã = coordenadas reais). Documente como "GPS-ready", igual fizemos com o `RoutingProvider`.

## Observações
- Mapa: pode ser um **mock leve** (SVG/placeholder com os pontos das escolas e o marcador do caminhão),
  **sem depender de API externa/CSP** neste momento. O importante é a **simulação da posição em tempo real**.
- Mantém o restante do B9 (Ajuste 03): a Rastreabilidade lista **só caminhões em rota**; "Em Montagem"
  continua na ação **Montagem de Carga** (que segue existindo no seu próprio botão do topo).

## Definition of Done
- Clicar na ação da linha da Rastreabilidade abre o **modal de rastreamento** (mapa + paradas + O.E.),
  **não** a Montagem de Carga.
- O marcador do caminhão **simula posição em tempo real** entre as paradas; parada atual destacada.
- Fonte da posição isolada (mock trocável por GPS real).
- `npx playwright test` ≥ 82/82 + smoke 0 falhas; **sem erro de console**; **`docs/` sincronizado**; registrar no log.
