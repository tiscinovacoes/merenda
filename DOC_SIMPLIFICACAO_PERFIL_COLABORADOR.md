# Vigia Educa / SUALE — Simplificação Operacional dos Perfis Colaborador

## 🎯 Objetivo
Transformar os perfis de fornecedores da Agricultura Familiar (**Cooperativa** e **Agricultor Familiar**) em ferramentas exclusivamente **operacionais e de ponta de linha**, removendo a sobrecarga de mini-ERPs agrícolas (gestão interna de associados, hectares, previsão de plantio, safras e controle interno patrimonial).
A gestão do fornecedor será desenvolvida futuramente em módulo dedicado.

---

## 📌 Escopo e Arquitetura das 3 Abas Operacionais

### 1. Painel Geral (`dashboard`)
- **Foco:** Visão rápida da operação diária do fornecedor.
- **KPIs:**
  - `📋 O.S. Aguardando Aceite`: Novas ordens emitidas pelo município demandando fornecimento.
  - `🚚 Entregas em Andamento`: Cargas em processo de separação ou em transporte.
  - `✅ Entregas Concluídas`: Histórico de atestos realizados.
  - `💰 Previsão a Faturar`: Volume financeiro das ordens ativas.
- **Tabela de Ação Imediata:** Próximas entregas programadas com data, escola de destino, volume em kg e botão para visualização rápida.

### 2. Ordens de Serviço (`pedidos`)
- **Foco:** Recebimento e gestão das Ordens de Fornecimento emitidas pela SEMED (PNAE).
- **Tabela de Ordens:**
  - Número identificador (`#OSC-XXXX`)
  - Unidade Escolar solicitante
  - Data Limite de Atendimento
  - Produtos e Quantidades (com tag `🌾 Agricultura Familiar` e padrão de higienização)
  - Valor Estimado
  - Status do Pedido (`Pendente`, `Em separação`, `Em transporte`, `Entregue`)
- **Ações Operacionais:**
  - `👁️ Detalhes`: Modal com o descritivo de cada produto e instruções de recebimento.
  - `✅ Aceitar O.S.`: Muda status para "Em separação", confirmando capacidade de fornecimento.
  - `🚚 Despachar`: Muda status para "Em transporte", notificando a escola de que a carga está em trânsito.

### 3. Cronograma de Entregas (`entregas`)
- **Foco:** Agenda clara de transporte e distribuição às unidades escolares.
- **Tabela de Cronograma:**
  - Data Programada (com destaque para entregas imediatas)
  - Escola de Destino e Endereço/Região
  - Carga e Volume a Descarregar
  - Status da Entrega
- **Ação de Baixa:**
  - `📸 Registrar Entrega Realizada`: Modal interativo com simulação de upload da foto do comprovante assinado e nome do recebedor na escola, concluindo a ordem com status `Entregue`.

---

## 🛡️ Retrocompatibilidade e Zero Regressão
- A função `PAGE_RENDERERS.cooperativa_escolas` foi mantida intacta e robusta para alimentar a listagem de escolas piloto do perfil **Gestor SEMED** (`gestor_escolas`).
- As rotas secundárias legadas exibem um card amigável informando a transição para o futuro módulo de Gestão do Fornecedor e oferecendo atalhos rápidos para Ordens de Serviço e Cronograma de Entregas.

---

## 🧪 Validação dos Testes
- `tests/cooperativa.spec.js`: 4/4 aprovados.
- `tests/agricultor.spec.js`: 4/4 aprovados.
- `tests/gestor.spec.js`: 15/15 aprovados.
- `tests/smoke-renderers.spec.js`: 134 telas testadas com 0 falhas.
- Suíte completa de perfis: 62/62 aprovados.
