# PROTÓTIPO - PERFIL COOPERATIVA

## Objetivo

Permitir que a cooperativa gerencie seus agricultores, estoques, pedidos, entregas e contratos, garantindo o atendimento das demandas das escolas e da Secretaria Municipal de Educação.

---

# Estrutura de Navegação

Menu lateral:

- Dashboard
- Agricultores
- Produtos
- Estoque Consolidado
- Pedidos
- Planejamento de Entregas
- Rotas
- Contratos e Chamamentos
- Entregas
- Relatórios
- Indicadores

---

# TELA 01 - Dashboard

## Cards

- Agricultores Ativos
- Produtos Disponíveis
- Pedidos Pendentes
- Entregas Programadas
- Entregas em Atraso
- Valor Executado
- Saldo Contratual

---

## Gráficos

### Pedidos por Status

- Solicitado
- Aceito
- Em Separação
- Em Transporte
- Entregue

### Produtos Mais Demandados

Top 10 produtos

---

## Alertas

- Estoque insuficiente
- Entregas próximas
- Contratos próximos do limite
- Agricultores sem estoque

---

# TELA 02 - Gestão de Agricultores

## Lista

- Nome
- Município
- Produtos
- Estoque Atual
- Produção Estimada
- Status

---

## Cadastro

Campos:

- Nome
- CPF/CNPJ
- Contato
- Endereço
- Produtos Produzidos
- Capacidade de Produção

---

## Detalhes

### Produção

- Produto
- Quantidade
- Disponível
- Reservado

### Histórico

- Entregas
- Pedidos atendidos
- Reclamações

---

# TELA 03 - Gestão de Produtos

## Lista

- Produto
- Categoria
- Unidade
- Estoque Consolidado
- Agricultores Fornecedores

---

## Detalhes

- Agricultores que produzem
- Quantidade disponível
- Quantidade reservada

---

# TELA 04 - Estoque Consolidado

## Visão Geral

Tabela:

- Produto
- Estoque Total
- Disponível
- Reservado
- Comprometido

---

## Filtros

- Produto
- Agricultor
- Região

---

# TELA 05 - Gestão de Pedidos

## Lista

- Número
- Escola
- Data
- Status
- Valor

---

## Detalhes do Pedido

### Produtos

- Produto
- Quantidade Solicitada
- Quantidade Atendida

---

### Distribuição Automática

Sistema sugere:

- Agricultor A
- Agricultor B
- Agricultor C

Conforme disponibilidade.

---

## Status

- Recebido
- Aceito
- Em Separação
- Em Transporte
- Entregue

---

# TELA 06 - Planejamento de Entregas

## Objetivo

Gerenciar cronogramas de entrega.

---

### Programação

- Semanal
- Quinzenal
- Mensal

---

### Calendário

Visualizar:

- Entregas previstas
- Entregas realizadas
- Entregas atrasadas

---

# TELA 07 - Gestão de Rotas

## Mapa

Exibir:

- Escolas
- Agricultores
- Entregas programadas

---

## Otimização

Sistema sugere:

- Melhor rota
- Menor distância
- Menor custo

---

# TELA 08 - Contratos e Chamamentos

## Lista

- Contrato
- Vigência
- Valor Global
- Valor Executado
- Saldo

---

## Produtos Contratados

- Produto
- Quantidade Contratada
- Quantidade Entregue
- Quantidade Restante

---

## Cronograma

- Semanal
- Quinzenal
- Mensal

---

# TELA 09 - Entregas

## Lista

- Pedido
- Escola
- Data
- Status

---

## Comprovantes

Anexar:

- Nota Fiscal
- Fotos
- Comprovante de Recebimento

---

## Linha do Tempo

- Pedido recebido
- Separado
- Em transporte
- Entregue

---

# TELA 10 - Relatórios

## Disponíveis

- Pedidos atendidos
- Entregas realizadas
- Produtos fornecidos
- Agricultores participantes
- Contratos executados
- Entregas atrasadas

---

# TELA 11 - Indicadores

## Performance

- Taxa de Atendimento
- Entregas no Prazo
- Volume Fornecido
- Participação por Agricultor

---

# Integrações

## Escola

Recebe:

- Pedidos

Envia:

- Confirmações
- Datas de entrega

---

## Gestor

Disponibiliza:

- Indicadores
- Entregas
- Execução contratual

---

## Nutricionista

Recebe:

- Previsão de demanda

---

## Agricultor Familiar

Recebe:

- Estoque
- Produção
- Disponibilidade

Envia:

- Pedidos de fornecimento

---

# Regras de Negócio

RN01

Todo pedido deve ser vinculado a um contrato ou chamamento vigente.

RN02

Não permitir distribuição acima da capacidade disponível dos agricultores.

RN03

Toda entrega deve possuir comprovante.

RN04

O estoque consolidado deve ser atualizado automaticamente.

RN05

O cronograma de entregas deve respeitar a periodicidade contratual.

RN06

O sistema deve alertar quando o saldo contratual atingir níveis críticos.