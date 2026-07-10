# PROTÓTIPO - PERFIL AGRICULTOR FAMILIAR

## Objetivo

Permitir que o agricultor familiar informe sua produção, acompanhe pedidos recebidos da cooperativa, controle seu estoque e gerencie suas entregas.

---

# Estrutura de Navegação

Menu lateral:

- Dashboard
- Minha Produção
- Estoque
- Pedidos
- Entregas
- Calendário
- Relatórios
- Perfil

---

# TELA 01 - Dashboard

## Objetivo

Apresentar uma visão rápida da situação atual do produtor.

---

## Cards

- Produtos Cadastrados
- Estoque Disponível
- Pedidos Pendentes
- Entregas Programadas
- Entregas Concluídas
- Valor a Receber

---

## Alertas

Exibir:

- Entregas para hoje
- Estoque insuficiente
- Produção abaixo da demanda
- Produtos próximos da colheita

---

## Próximas Entregas

Tabela:

- Produto
- Quantidade
- Data
- Escola Destino
- Cooperativa

---

# TELA 02 - Minha Produção

## Objetivo

Cadastrar e acompanhar a produção agrícola.

---

## Lista de Produtos

Tabela:

- Produto
- Área Plantada
- Produção Prevista
- Produção Disponível
- Status

---

## Cadastro de Produção

Campos:

- Produto
- Área Plantada
- Quantidade Estimada
- Data de Plantio
- Data Prevista de Colheita

---

## Safra

Informar:

- Início da Safra
- Fim da Safra

---

## Histórico

Visualizar produções anteriores.

---

# TELA 03 - Gestão de Estoque

## Objetivo

Controlar produtos disponíveis para venda.

---

## Estoque Atual

Tabela:

- Produto
- Quantidade Disponível
- Quantidade Reservada
- Quantidade Livre

---

## Atualizar Estoque

Campos:

- Produto
- Quantidade
- Motivo

Motivos:

- Colheita
- Ajuste
- Perda
- Correção

---

## Movimentações

Histórico completo.

---

# TELA 04 - Gestão de Pedidos

## Objetivo

Visualizar pedidos enviados pela cooperativa.

---

## Lista

Tabela:

- Pedido
- Produto
- Quantidade
- Data Limite
- Status

---

## Detalhes

Exibir:

- Produto
- Quantidade
- Local de Entrega
- Escola Destino
- Data Programada

---

## Confirmação

Botões:

- Aceitar Pedido
- Solicitar Ajuste
- Recusar

---

## Status

- Recebido
- Confirmado
- Separando
- Pronto para Entrega
- Entregue

---

# TELA 05 - Gestão de Entregas

## Lista

Tabela:

- Pedido
- Produto
- Quantidade
- Data
- Status

---

## Detalhes

Informações:

- Escola
- Cooperativa
- Quantidade
- Horário

---

## Comprovante

Permitir:

- Foto da carga
- Foto da entrega
- Documento assinado

---

## Conclusão

Botão:

"Confirmar Entrega"

---

# TELA 06 - Calendário

## Objetivo

Visualizar compromissos futuros.

---

## Calendário

Exibir:

- Plantio
- Colheita
- Entregas
- Pedidos Programados

---

## Visualizações

- Diário
- Semanal
- Mensal

---

# TELA 07 - Relatórios

## Disponíveis

- Produção por período
- Produtos entregues
- Estoque atual
- Entregas realizadas
- Pedidos atendidos

---

## Exportação

- PDF
- Excel

---

# TELA 08 - Perfil

## Dados Pessoais

- Nome
- CPF
- Endereço
- Telefone

---

## Dados da Propriedade

- Nome da Propriedade
- Área Total
- Área Produtiva

---

## Produtos Produzidos

Lista de culturas cadastradas.

---

## Documentos

- CAF/DAP
- Certificações
- Licenças

---

# Integrações

## Cooperativa

Recebe:

- Pedidos
- Programações
- Cronogramas

Envia:

- Estoque
- Produção
- Confirmações

---

## Gestor

Disponibiliza:

- Indicadores de fornecimento
- Participação no programa

---

## Nutricionista

Disponibiliza:

- Produtos disponíveis
- Calendário de safra

---

## Escola

Sem interação direta.

Toda comunicação ocorre através da cooperativa.

---

# Regras de Negócio

RN01

O agricultor não pode receber pedidos acima do estoque disponível.

---

RN02

Toda confirmação de pedido reserva automaticamente o estoque.

---

RN03

Toda entrega reduz automaticamente o estoque.

---

RN04

O sistema deve alertar sobre baixa capacidade produtiva.

---

RN05

O sistema deve permitir informar perdas de produção.

---

RN06

A cooperativa deve visualizar em tempo real a disponibilidade do agricultor.

---

# Funcionalidade Estratégica

## Previsão de Produção

Com base em:

- Histórico de safras
- Área plantada
- Produtos cultivados
- Calendário agrícola

O sistema poderá estimar:

- Produção futura
- Capacidade de atendimento
- Risco de insuficiência

Essas informações alimentam:

- Cooperativa
- Nutricionista
- Gestor
- IA de Previsão de Demanda