# ESPEC — Perfil Compras & Contratos (Ata → Contrato → Empenho → Pedido)

> Estado: **PROPOSTA / estruturação** (2026-08-25). Nada aplicado ainda.
> Objetivo: criar um perfil dedicado à gestão de **atas, contratos, empenhos, fornecedores,
> pedidos/aquisição e prestação de contas**, e **refazer a ordem** do modelo — hoje o
> empenho pendura direto na ata; passa a ser `Ata → Contrato → Empenho → Pedido`.
>
> Além do ciclo contratual, este perfil é o **dono fiscal e da aquisição**: recebe as
> **OS de Compra** emitidas pela Nutricionista (a partir do cardápio) e as **Notas Fiscais**
> dos fornecedores, **detém todo o saldo do empenho** e faz a **liquidação**.
> O **Estoque não vê saldo de empenho** — só trabalha com **estoque e entrega** e **executa a
> Ordem de Recebimento** lançada aqui (conferência física + NF), devolvendo apenas *quanto recebeu*.

## Decisões de arquitetura (defaults — sujeitas a validação)

| # | Decisão | Escolha adotada | Alternativas |
|---|---------|-----------------|--------------|
| 1 | Unidade que controla o saldo | **Quantidade manda** (preço unitário fixo pela ata; `valor = qtd × preço_unit`) | Valor manda · Ambos travam |
| 2 | Comportamento da cascata quando falta saldo | **Sugere e cria com 1 clique** (rascunho auto, usuário confirma) | Só bloqueia/alerta · Automático sem confirmar |
| 3 | Atas/Empenhos que hoje estão no Gestor | **Viram só-leitura no Gestor**; edição migra p/ novo perfil | Remover do Gestor · Manter editável nos dois |
| 4 | Nome do perfil | **Compras & Contratos** (`id: compras`) | Gestão Contratual · Suprimentos |

---

## 1. Diagnóstico do modelo atual

- `atas` tem **um único** `fornecedor TEXT` no cabeçalho → não comporta N produtos × N fornecedores.
  Saldo é global (`valor_global − valor_executado`), sem quebra por item.
- `empenhos.ata_id` aponta **direto para a ata** → **não existe camada de contrato**.
- Não existem `contratos`, `fornecedores`, `prestacao_contas`.
- Tudo vive dentro do perfil **Gestor** (grupo "Prestação de Contas" em `PROFILES.gestor`).

## 2. Nova ordem (hierarquia de saldo em cascata)

Saldo é sempre por **(produto × fornecedor)**. Cada nível é um subconjunto do nível acima.

```
FORNECEDOR (cadastro central)
   │
ATA — teto licitado                         1000kg arroz · Talismã · R$17.000   ← linha
   │   saldo_ata(item)      = qtd_licitada    − Σ qtd_contratada           (ato firme)
   ▼
CONTRATO — por fornecedor (~metade)          500kg arroz · Talismã · R$ 8.500
   │   saldo_contrato(item) = qtd_contratada  − Σ qtd_empenhada            (ato firme)
   ▼
EMPENHO — por contrato (total/fracionado)    250kg arroz · R$ 4.250
   │   saldo_livre(item)    = qtd_empenhada − qtd_reservada − qtd_liquidada
   ▼
PEDIDO / AQUISIÇÃO — RESERVA saldo (não dá baixa)              [Compras]
   ▼
ORDEM DE RECEBIMENTO (lançada no Compras) → Estoque confere física+NF → devolve "qtd recebida"
   ▼
LIQUIDAÇÃO no Compras = baixa do empenho pelo RECEBIDO         [Compras]
```
> O Estoque **executa** a conferência mas **não** dá baixa: só informa a quantidade recebida.
> O saldo do empenho (reserva/liquidação) vive inteiramente no perfil **Compras**.

### Estados do saldo do empenho (regra crítica)

O empenho é o único nível onde a divergência física importa. Ele tem **três medidas**:

| Medida | Quando muda | Efeito |
|---|---|---|
| `qtd_empenhada` | ao emitir o empenho | teto |
| `qtd_reservada` | ao emitir **pedido** ao fornecedor | bloqueia saldo, **não é baixa** |
| `qtd_liquidada` | após **conferência da NF** na entrada | **baixa definitiva**, pelo valor **conferido** |

- `saldo_livre = qtd_empenhada − qtd_reservada − qtd_liquidada` → é o que a **cascata** enxerga
  para decidir se cabe novo pedido.
- **Baixa só na conferência.** Enquanto a NF não é conferida (física + fiscal), o pedido fica
  como *reserva*. Na conferência:
  - `conferido == pedido` → reserva vira liquidação (baixa cheia).
  - `conferido < pedido` (falta/avaria) → liquida o conferido; a diferença **volta a saldo_livre**
    e abre **pendência de divergência** (re-pedir ou glosar).
  - `conferido > pedido` → só liquida até o pedido/saldo; excedente **não entra sem novo pedido**.
- Os níveis **contrato→empenho** e **ata→contrato** são atos administrativos firmes (não têm
  reserva/liquidação): saldo baixa na emissão do nível de baixo.

### Exemplo de dados (do enunciado)

**Ata** (4 linhas, 3 fornecedores):

| Produto | Fornecedor | Qtd licitada | Valor |
|---|---|---:|---:|
| Arroz | Talismã | 1000 kg | 17.000 |
| Feijão | Atacarejo | 1000 kg | 9.000 |
| Macarrão | Distribuidora Brasil | 1000 kg | 12.000 |
| Farinha de trigo | Talismã | 1000 kg | 8.000 |

**Contratos** (um por fornecedor; ~metade da ata):

| Contrato | Produto | Qtd | Valor |
|---|---|---:|---:|
| Talismã | Arroz | 500 | 8.500 |
| Talismã | Farinha | 500 | 4.000 |
| Atacarejo | Feijão | 500 | 4.500 |
| Distribuidora Brasil | Macarrão | 500 | 6.000 |

**Empenho** (fracionado, conforme demanda):

| Produto | Qtd | Valor |
|---|---|---:|
| Arroz | 250 | 4.250 |
| Feijão | 250 | 2.250 |
| Macarrão | 350 | 4.200 |
| Farinha | 500 | 4.000 |

## 3. Motor de saldo (algoritmo da cascata)

O motor roda quando o Compras converte uma **OS de Compra** (da Nutricionista ou do Estoque) em
pedido(s) ao fornecedor. O fornecedor de cada produto **é derivado da ata vigente** (fornecedor
ganhador do item), não informado pelo solicitante. Alocar = **reservar** saldo (não dá baixa).

Ao lançar um **pedido** de quantidade `Q` para `(produto P, fornecedor F)`:

```
falta = Q

# Nível 1 — EMPENHO (usa saldo_livre = empenhada − reservada − liquidada)
para cada empenho ATIVO de F com item P e saldo_livre > 0 (ordem: mais antigo primeiro / FEFO orçamentário):
    usar = min(saldo_livre(P), falta)
    reserva(usar);  falta -= usar          # reserva, NÃO baixa
    se falta == 0: FIM

# Nível 2 — CONTRATO  → precisa de NOVO EMPENHO
se falta > 0:
    disp = saldo_contrato(P)               # contrato vigente de F
    se disp > 0:
        gerar_empenho = min(disp, falta)   # rascunho de novo empenho
        [decisão #2] sugerir e criar com 1 clique → aloca;  falta -= gerar_empenho
        se falta == 0: FIM

# Nível 3 — ATA  → precisa de NOVO CONTRATO (+ novo empenho)
se falta > 0:
    disp = saldo_ata(P, F)
    se disp > 0:
        gerar_contrato = min(disp, falta)  # rascunho de novo contrato c/ saldo remanescente
        → em seguida novo empenho → aloca;  falta -= gerar_contrato
        se falta == 0: FIM

# Sem saldo
se falta > 0:
    BLOQUEIA + ALERTA("Sem saldo na ata para P/F — remanejar fornecedor ou novo processo")
```

Regras derivadas (do enunciado):
- **Sem saldo no empenho, com saldo no contrato → gerar novo empenho.**
- **Sem saldo no contrato, com saldo na ata → gerar novo contrato (saldo remanescente).**
- Toda geração em cascata fica **rastreável** (quem/quando/origem: pedido X disparou empenho Y).
- **A baixa (liquidação) do empenho NÃO acontece aqui.** O pedido só *reserva*. A baixa ocorre
  na **conferência da entrada da NF** (ver §7), pelo valor conferido — que pode divergir do pedido.

## 4. Modelo de dados (proposta de schema)

Padrão: cabeçalho + linhas por item. Preço unitário fixado na ata e herdado para baixo.
Saldos são **derivados** (view/campo calculado), nunca digitados.

```
fornecedores        (id, razao_social, cnpj_cpf, tipo, contato, email, telefone, status)

atas                (id, numero, ano, modalidade, processo, objeto,
                     data_inicio, data_fim, status)
ata_itens           (id, ata_id→atas, fornecedor_id→fornecedores, produto, unidade,
                     qtd_licitada, preco_unitario)          # valor = qtd × preço
                     -- saldo_ata = qtd_licitada − Σ contrato_itens.qtd_contratada

contratos           (id, numero, ata_id→atas, fornecedor_id→fornecedores,
                     data_inicio, data_fim, valor_contratado, status)
contrato_itens      (id, contrato_id→contratos, ata_item_id→ata_itens,
                     qtd_contratada, preco_unitario)
                     -- saldo_contrato = qtd_contratada − Σ empenho_itens.qtd_empenhada

empenhos            (id, numero_empenho, contrato_id→contratos,     # ← era ata_id
                     dotacao, data_empenho, status,
                     origem_pedido_id NULL→pedidos)         # se gerado pela cascata
empenho_itens       (id, empenho_id→empenhos, contrato_item_id→contrato_itens,
                     qtd_empenhada, preco_unitario)
                     -- SALDO DO EMPENHO É DO PERFIL COMPRAS (Estoque não acessa)
                     -- qtd_reservada  = Σ pedido_itens ABERTOS (pedido não recebido)
                     -- qtd_liquidada  = Σ ordem_recebimento_itens CONFIRMADOS (qtd_recebida)
                     -- saldo_livre    = qtd_empenhada − qtd_reservada − qtd_liquidada

# ── DEMANDA (Nutricionista OU Estoque → Compras) ───────────────────
os_compra           (id, numero, origem, solicitante, cardapio_id NULL, escola_id NULL,
                     periodo, data_emissao, status)         # origem: nutricao | estoque_reposicao
                     -- status: emitida → recebida → convertida (em pedido) → atendida
os_compra_itens     (id, os_compra_id→os_compra, produto, unidade,
                     qtd_prevista, qtd_estoque, qtd_necessaria)
                     -- qtd_necessaria = qtd_prevista (cardápio) − qtd_estoque (atual)  ← "o que falta"
                     -- fornecedor NÃO vem aqui: derivado da ata vigente (item ganhador)

# ── AQUISIÇÃO (Compras → Fornecedor) ───────────────────────────────
pedidos             (id, numero, fornecedor_id→fornecedores,
                     os_compra_id→os_compra, data, prazo_entrega, status)
                     -- status: reservado → parcial → entregue → liquidado
                     -- (um pedido pode ter VÁRIAS entregas/NFs → entrega parcial)
pedido_itens        (id, pedido_id→pedidos, empenho_item_id→empenho_itens,
                     os_compra_item_id→os_compra_itens,     # rastreio demanda→aquisição
                     produto, qtd_pedida, preco_unitario, status)
                     -- qtd_entregue     = Σ ordem_recebimento_itens CONFIRMADOS (todas as ordens do pedido)
                     -- saldo_a_entregar = qtd_pedida − qtd_entregue      ← "o que falta entregar"

# ── FISCAL (NF chega no Compras) ───────────────────────────────────
notas_fiscais       (id, numero, chave_nfe, fornecedor_id→fornecedores,
                     pedido_id NULL→pedidos, valor_total, data_emissao,
                     xml TEXT, status)                      # status: recebida→em_conferencia→conferida/divergente
                     -- dono: perfil COMPRAS (import XML aqui, não no Estoque)

# ── RECEBIMENTO (Compras LANÇA a ordem → Estoque EXECUTA) ───────────
ordem_recebimento    (id, numero, pedido_id→pedidos, nota_fiscal_id NULL→notas_fiscais,
                      fornecedor_id→fornecedores, destino, data_prevista, status)
                      -- status: aguardando → recebida → conferida | divergente
                      -- LANÇADA no perfil COMPRAS; EXECUTADA (conferência física + NF) no ESTOQUE
ordem_recebimento_itens (id, ordem_id→ordem_recebimento, pedido_item_id→pedido_itens,
                      produto, qtd_esperada, qtd_recebida, divergencia)
                      -- Estoque preenche qtd_recebida (física); divergencia = recebida − esperada
                      -- ao CONFIRMAR a ordem, o COMPRAS liquida o empenho pelo qtd_recebida
                      -- (Estoque NÃO acessa saldo de empenho — só informa o recebido)

prestacao_contas    (id, empenho_id→empenhos, nota_fiscal_id→notas_fiscais,
                     valor_liquidado, valor_pago, data_liquidacao, data_pagamento,
                     documentos JSONB, status)
```

### Migração a partir do schema atual
- `atas`: mover `fornecedor`/`itens JSONB` → linhas em `ata_itens` (1 fornecedor por linha).
- `empenhos`: trocar FK `ata_id` → `contrato_id`. Para dados legados sem contrato,
  criar um **contrato "espelho"** por (ata, fornecedor) cobrindo o já empenhado.
- Manter `numero_empenho UNIQUE`, `valor_*` etc. como estão onde fizer sentido.

## 5. Novo perfil `compras` (registro em `PROFILES`, core_hub.js)

```js
compras: {
  userId: 'ID-007',
  name: '<responsável compras>',
  role: 'Compras & Contratos — SEMED',
  initials: 'CC',
  menu: [
    { id: 'dashboard',    icon: '📊', label: 'Dashboard Contratual', badge: null },
    { id: 'fornecedores', icon: '🏢', label: 'Fornecedores', badge: null },
    { type: 'group', label: 'Ciclo Contratual', children: [
      { id: 'atas',       icon: '📋', label: 'Atas de Registro de Preços', badge: null },
      { id: 'contratos',  icon: '📄', label: 'Contratos', badge: null },
      { id: 'empenhos',   icon: '💳', label: 'Empenhos', badge: null },
    ]},
    { type: 'group', label: 'Aquisição', children: [
      { id: 'os-compra',  icon: '📥', label: 'OS de Compra (Nutrição/Estoque)', badge: 'NEW' },
      { id: 'pedidos',    icon: '🛒', label: 'Pedidos / Aquisições', badge: null },
      { id: 'notas',      icon: '📑', label: 'Notas Fiscais', badge: null },
      { id: 'recebimentos',icon: '📦', label: 'Ordens de Recebimento', badge: null },
      { id: 'liquidacao', icon: '✅', label: 'Liquidação', badge: null },
    ]},
    { id: 'prestacao',    icon: '🧾', label: 'Prestação de Contas', badge: null },
    { id: 'relatorios',   icon: '📈', label: 'Relatórios', badge: null },
  ]
}
```

Módulo novo: `js/modules/compras.js` (mesmo padrão dos módulos existentes; render por `id` de menu).
Store novo em `SharedState`: `compras: { fornecedores, atas, ataItens, contratos, contratoItens,
empenhos, empenhoItens, osCompra, osCompraItens, pedidos, pedidoItens, notasFiscais, ordensRecebimento, prestacao }`.
A **Ordem de Recebimento** é o único objeto compartilhado Compras↔Estoque: o Estoque lê a ordem e grava
`qtd_recebida`; nunca lê `empenhos`.

### Impacto no perfil Gestor (decisão #3)
Grupo "Prestação de Contas" do Gestor: itens `atas` e `empenhos` viram **só-leitura**
(consulta de saldos/status), sem botões de criar/editar. Edição só no perfil `compras`.

## 6. Telas principais (por item de menu)

- **Dashboard Contratual** — cards de saldo por nível, alertas de saldo baixo e vigência a vencer,
  e **cumprimento de entregas** (pedidos em aberto · a entregar · atrasados).
- **Fornecedores** — CRUD + **gestão de cumprimento** por fornecedor: pedidos, **entregue**,
  **a entregar** (`saldo_a_entregar`), atrasos (`prazo_entrega` vencido), histórico de divergências.
  Semáforo por fornecedor (em dia / parcial / atrasado).
- **Atas** — lista + detalhe; grade de itens (produto × fornecedor × qtd × preço); barra de saldo por item.
- **Contratos** — por fornecedor dentro da ata; grade de itens; saldo contrato vs. empenhado.
- **Empenhos** — por contrato; itens; saldo empenho vs. pedido; badge quando gerado pela cascata.
- **Pedidos/Aquisições** — formulário que roda o **motor de cascata**; mostra de onde o saldo saiu
  e, se preciso, o rascunho de novo empenho/contrato para confirmação (1 clique). Acompanha
  **entregue × a entregar** por item (entrega parcial), prazo e status até a liquidação.
- **OS de Compra** — fila das demandas recebidas (Nutrição/Estoque); converter em pedido(s) por fornecedor.
- **Notas Fiscais** — entrada/import da NF (dono Compras); vínculo NF ↔ pedido.
- **Ordens de Recebimento** — **lança** a ordem (pedido + NF) e a envia ao Estoque; acompanha status
  (aguardando/recebida/conferida) e a `qtd_recebida` que o Estoque devolve.
- **Liquidação** — sobre ordens conferidas: **baixa o empenho** pelo recebido; divergência gera pendência.
- **Prestação de Contas** — liquidação/pagamento por empenho, anexos (NF), relatórios.

## 7. Fluxo operacional e segregação de responsabilidades

**Quem é dono de quê:**

| Perfil | Responsabilidade | NÃO faz |
|---|---|---|
| **Nutricionista** | Gera cardápio → emite **OS de Compra** (demanda) | Não escolhe fornecedor, não empenha, não recebe NF |
| **Estoque (escola/central)** | Detecta necessidade de reposição → emite **OS de Compra** | idem acima |
| **Compras & Contratos** | Recebe OS, escolhe fornecedor (via ata), **efetua pedido conforme empenho**, dispara fornecedor, **dá entrada na NF**, **lança a Ordem de Recebimento**, **liquida o empenho**, presta contas | Não confere fisicamente |
| **Estoque Central** | **Estoque + entrega**; **executa a Ordem de Recebimento** (conferência física + NF) e devolve `qtd_recebida`; dá entrada no estoque | **Não vê/gerencia saldo de empenho**; não é dono da NF nem do pedido; não liquida |

**Fluxo ponta a ponta:**

```
① DEMANDA                                    ② AQUISIÇÃO (Compras)
Nutricionista (cardápio)  ┐                  recebe OS → deriva fornecedor pela ata vigente
Estoque (reposição)       ┘→ OS de Compra →  → efetua PEDIDO conforme EMPENHO (cascata §3)
                                                se saldo_livre ok → reserva
                                                se falta → gera empenho/contrato (1 clique)
                                                     │  dispara fornecedor + dá entrada na NF
                                                     ▼  e LANÇA a Ordem de Recebimento
③ RECEBIMENTO (Estoque — executa)            ④ LIQUIDAÇÃO (Compras — dono do empenho)
recebe a Ordem de Recebimento                Compras lê qtd_recebida da ordem conferida →
confere FÍSICA + NF, dá entrada no estoque   → LIQUIDA empenho (baixa pelo RECEBIDO)
grava qtd_recebida e devolve ─────────────►  → divergente: baixa o recebido + PENDÊNCIA
(NÃO vê saldo de empenho)                          │
                                                     ▼
⑤ PRESTAÇÃO DE CONTAS (Compras)
pagamento + NF + documentos → relatórios
```

Pontos de integração com o que já existe:
- A **lista de compra** (itens da OS) é **calculada**, não digitada:
  `necessária = prevista_cardápio − estoque_atual` (por produto) → só entra na OS **o que falta**.
  Reusa o "Planejamento Alimentar → Necessidade Prevista / Estoque Existente / Necessidade de Compra"
  da Nutricionista; a origem Estoque usa o saldo do próprio estoque para a reposição.
- A **OS de Compra** materializa essa "Necessidade de Compra". Não confundir com a **OS de Expedição**
  (saída p/ escolas), que continua no fluxo logístico existente.
- A **conferência** reaproveita as regras já mapeadas no Estoque: **RN01 (conferência física)** e
  **RN05 (confronto NF-e)**. Muda a *posse* e o *gatilho*: a NF nasce no Compras, e o Estoque só age
  ao receber a **Ordem de Recebimento** lançada lá. O Estoque **não** enxerga empenho/saldo — devolve
  apenas `qtd_recebida`; a **liquidação** (baixa do empenho) é feita no Compras.

## 8. Ordem de implementação sugerida (quando aprovado)

1. Schema novo + migração (tabelas acima) e seed com o exemplo (ata 4 itens / 3 fornecedores).
2. `SharedState.compras` + getters/derivadores de saldo — **funções puras testáveis**:
   `saldoAta`, `saldoContrato`, `saldoLivreEmpenho`, `saldoAEntregar`.
3. Perfil `compras` em `PROFILES` + `js/modules/compras.js` (telas de leitura primeiro).
4. **OS de Compra**: emissão pela Nutricionista (do cardápio) e pelo Estoque (reposição) →
   fila no Compras. (toca os módulos `nutricao.js` e `estoque.js`/escola p/ o botão de emitir.)
5. Motor de cascata (`alocarPedido(P, F, Q)` → plano de reserva + rascunhos) + testes.
6. Telas de escrita (ata/contrato/empenho) + **converter OS → Pedido(s)** plugado no motor.
7. **NF** (entrada/import no Compras) → **Ordem de Recebimento** (lançada no Compras) →
   Estoque **executa** (física + confronto, grava `qtd_recebida`) → **liquidação** no Compras
   pelo recebido + tratamento de divergência/pendência.
8. Acompanhamento de **entregue × a entregar** por fornecedor/pedido (entrega parcial).
9. Prestação de contas + relatórios.
10. Ajustar perfil Gestor para só-leitura; ajustar Estoque: só **estoque + entrega + executar Ordem
    de Recebimento** (sem posse de NF e **sem acesso a saldo de empenho**).

## 9. Refinamentos aplicados na implementação (2026-08-25)

- **Conferência mora no Estoque Central.** A simulação/execução da conferência de entrada
  saiu do perfil Compras e virou a tela **“Conferência de Entradas (NF)”** no perfil Estoque
  (`estoque_conferencianf`). Fluxo: empenho → pedido (sobre o empenho) → fornecedor fatura → NF
  → **Compras lança a NF como entrada** → aparece na fila do Estoque → Estoque confere →
  **confirma a entrada da NF e dá a baixa do volume no empenho** (automática, pelo recebido).
  Método `comprasConfirmarEntradaEstoque()` = registra recebido + baixa (liquidação) + prestação.
  No Compras, “Ordens de Recebimento” virou só acompanhamento e “Liquidação” mostra liquidados +
  pagamento.
- **Banco único de atas (unificação).** As atas do perfil Gestor (`DATA.contracts` +
  `DATA.ataProducts`) são carregadas no store do Compras via `comprasImportarAtasDoGestor()`
  (idempotente, roda no `init`). `qtdExecutada` (= executado/preço do Gestor) entra no
  `saldo_ata` para os números baterem com a tela do Gestor (ex.: ATA-2026/001 saldo
  R$ 3.477.280). 6 atas · 27 itens · 6 fornecedores importados. O transacional (contratos,
  empenhos, pedidos…) começa limpo sobre as atas reais e é preenchido pela cascata.

---

### Pontos abertos p/ validar antes de aplicar
- Confirmar as 4 decisões da tabela do topo.
- Política de escolha do empenho na cascata (mais antigo? menor saldo? por dotação?).
- Aditivo de contrato: "novo contrato" com saldo remanescente vs. termo aditivo ao contrato existente.
- Numeração automática (ata/contrato/empenho/pedido/OS/NF) — máscara e ano.
- Divergência na conferência: quando `conferido < pedido`, o `saldo_a_entregar` fica **aberto p/ nova
  entrega** (fornecedor completa) ou **glosa/encerra** o item? (provável: decisão por item na conferência.)
- OS de Compra do Estoque: parte de escola individual ou só da Central? (define `escola_id`.)
