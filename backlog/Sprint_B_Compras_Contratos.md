# Backlog — Sprint B: Compras e Contratos
> Lista de compras automática + fluxo aquisitivo + vínculo NF↔contrato
> Origem: [SUALE_Backlog_Paridade_CheffEscolar.md](../SUALE_Backlog_Paridade_CheffEscolar.md)

## Épico B1 — Lista de Compras Automática

**Objetivo:** transformar o cardápio aprovado pela Nutricionista em necessidade de compra consolidada, dividida entre agricultura familiar e licitação.

### B1.1 — Necessidade por gênero alimentício
**Como** Nutricionista, **quero** que o cardápio aprovado gere automaticamente a quantidade necessária de cada gênero (ficha técnica × nº de refeições × alunos), **para** não calcular manualmente.
- [ ] Motor de cálculo: cardápio → fichas técnicas → per capita do alimento × matrículas × dias do período
- [ ] Desconto do estoque existente nas escolas (integração com módulo de estoque já existente)
- [ ] Margem de segurança configurável (% de perda/desperdício por gênero)
- **Critério de aceite:** alterar o cardápio recalcula a necessidade; itens em estoque suficiente não entram na lista.

### B1.2 — Consolidação por rede e por escola
**Como** Gestor SEMED, **quero** ver a lista consolidada da rede e o detalhamento por escola, **para** decidir entre compra centralizada ou descentralizada.
- [ ] Visão rede (totais por gênero) e visão escola (quantidade por unidade)
- [ ] Agrupamento por periodicidade de entrega (semanal para perecíveis, mensal para secos)
- **Critério de aceite:** soma das listas por escola = lista da rede.

### B1.3 — Divisão AF vs. licitação
**Como** Gestor SEMED, **quero** que o sistema classifique os itens entre chamada pública (agricultura familiar) e licitação, **para** garantir o mínimo de 30% em AF.
- [ ] Marcação de gêneros elegíveis à AF (com base no catálogo das cooperativas cadastradas)
- [ ] Simulador: % do recurso destinado à AF conforme a divisão escolhida
- [ ] Alerta bloqueante se a projeção ficar abaixo de 30%
- **Critério de aceite:** o percentual AF exibido bate com (valor itens AF ÷ valor total da lista).

---

## Épico B2 — Fluxo Aquisitivo

**Objetivo:** conduzir chamada pública, licitação e dispensa do edital à homologação, alimentando o módulo de Atas & Contratos já existente.

### B2.1 — Chamada pública da agricultura familiar
**Como** Gestor SEMED, **quero** publicar a chamada pública com os itens AF da lista de compras, **para** contratar cooperativas e agricultores pelo rito do PNAE.
- [ ] Criação da chamada a partir da lista (itens, quantidades, preço de referência)
- [ ] Recebimento de projetos de venda pelos perfis Cooperativa e Agricultor (já existentes)
- [ ] Classificação automática por critérios do PNAE (local > regional > estadual > nacional; assentados/quilombolas/indígenas com prioridade)
- [ ] Homologação → gera contrato no módulo Atas & Contratos
- **Critério de aceite:** a ordem de classificação segue a Res. FNDE vigente; contrato herda itens e preços do projeto de venda vencedor.

### B2.2 — Licitação e dispensa
**Como** Gestor SEMED, **quero** registrar o processo licitatório (ou dispensa) dos demais itens, **para** ter o ciclo aquisitivo completo no sistema.
- [ ] Registro do processo: modalidade, edital, datas, fornecedores participantes, vencedores por item/lote
- [ ] Dispensa com justificativa e teto legal validado
- [ ] Homologação → gera ata/contrato no módulo existente
- **Critério de aceite:** todo contrato ativo referencia um processo aquisitivo; item sem processo não pode ser comprado.

### B2.3 — Pedidos contra contrato
**Como** Diretor de escola, **quero** emitir pedidos apenas de itens contratados e dentro do saldo do contrato, **para** nunca comprar fora do processo.
- [ ] Pedido (módulo já existente) validado contra: saldo do contrato + saldo financeiro da escola (Sprint A)
- [ ] Consumo do saldo do contrato por pedido aprovado
- **Critério de aceite:** pedido que estoure saldo de contrato ou saldo financeiro é bloqueado com mensagem clara.

---

## Épico B3 — Vínculo NF ↔ Contrato (v1 manual)

### B3.1 — Lançamento e conferência de NF
**Como** setor de Prestação de Contas, **quero** lançar a NF e vinculá-la ao pedido/contrato correspondente, **para** alimentar a conciliação do Sprint A (A2.1).
- [ ] Formulário de NF com itens; sugestão automática de vínculo pelo pedido
- [ ] Validações: preço ≤ contratado, quantidade ≤ pedido, fornecedor = contratado
- [ ] Fila de pendências para NFs com divergência
- **Critério de aceite:** NF válida atualiza saldo do contrato e do recurso da escola em uma única transação.

### B3.2 — Preparação para integração SERPRO (fase 2)
- [ ] Campo chave de acesso NF-e (44 dígitos) com validação de dígito
- [ ] Modelo de dados compatível com layout NF-e (para importação automática futura)
- **Critério de aceite:** nenhuma migração de schema necessária quando a integração chegar.

---

## Dependências
- Sprint A (saldos financeiros) para B2.3 e B3.1
- Módulos existentes: cardápios/fichas (Nutricionista), estoque e pedidos (Escola), projetos de venda (Cooperativa/Agricultor), Atas & Contratos (Gestor)
