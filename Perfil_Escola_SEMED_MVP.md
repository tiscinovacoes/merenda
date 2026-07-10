# PROTÓTIPO - PERFIL ESCOLA

## Objetivo

Permitir que a unidade escolar realize o planejamento alimentar, controle seu estoque, registre o consumo dos alimentos, solicite abastecimento e acompanhe entregas.

---

# Estrutura de Navegação

Menu lateral:

- Dashboard
- Planejamento Alimentar
- Cardápios
- Estoque
- Consumo
- Pedidos de Abastecimento
- Entregas
- Histórico
- Relatórios
- Configurações

---

# TELA 01 - Dashboard

## Cards

- Quantidade de Alunos
- Produtos em Estoque
- Produtos Críticos
- Pedidos Pendentes
- Entregas Previstas
- Consumo do Mês

## Alertas

- Estoque Crítico
- Produtos próximos da validade
- Entregas atrasadas
- Pedidos pendentes

## Widget IA

Sugestão de reposição baseada em consumo e cardápio.

---

# TELA 02 - Planejamento Alimentar

## Dados da Escola

- Quantidade de alunos
- Turnos
- Modalidade de ensino

## Planejamento Mensal

Calendário com:
- Café da manhã
- Lanche
- Almoço
- Jantar

## Resumo

Sistema calcula:
- Consumo previsto
- Necessidade futura
- Estoque insuficiente

---

# TELA 03 - Gestão de Cardápios

## Listagem

- Nome
- Período
- Responsável
- Status

## Cadastro

- Nome
- Data Inicial
- Data Final

## Montagem

Adicionar refeições e produtos por refeição.

## Cálculo Automático

- Consumo previsto
- Necessidade de compra

---

# TELA 04 - Gestão de Estoque

## Produtos

- Produto
- Quantidade
- Unidade
- Estoque mínimo
- Validade
- Status

## Movimentações

- Entradas
- Saídas
- Ajustes

## Inventário

Conferência física de estoque.

---

# TELA 05 - Registro de Consumo

## Lançamento Diário

- Data
- Refeição
- Produto
- Quantidade utilizada

## Histórico

- Data
- Produto
- Quantidade
- Responsável

---

# TELA 06 - Pedidos de Abastecimento

## Sugestão Inteligente

Baseada em:
- Estoque
- Cardápio
- Quantidade de alunos

## Pedido

- Produto
- Quantidade
- Justificativa

## Status

- Solicitado
- Em análise
- Aceito
- Em separação
- Em transporte
- Entregue

---

# TELA 07 - Recebimento de Entregas

## Lista

- Pedido
- Cooperativa
- Data prevista
- Status

## Recebimento

- Produto
- Quantidade recebida
- Divergências
- Observações

## Evidências

- Foto da entrega
- Foto da nota fiscal
- Foto dos produtos

## Resultado

Sistema atualiza:
- Estoque
- Pedido
- Indicadores do Gestor

---

# TELA 08 - Histórico

## Consultas

- Pedidos
- Consumo
- Entregas

---

# TELA 09 - Relatórios

- Consumo por período
- Consumo por produto
- Estoque atual
- Estoque crítico
- Pedidos realizados
- Entregas recebidas

---

# Integrações

## Gestor

Envia:
- Consumo
- Estoque
- Pedidos
- Entregas

## Cooperativa

Envia:
- Pedidos

Recebe:
- Confirmações
- Datas de entrega

## Agricultura Familiar

Sem interação direta.

---

# Regras de Negócio

RN01 - Não permitir estoque negativo.

RN02 - Toda entrega confirmada gera entrada automática.

RN03 - Todo consumo gera saída automática.

RN04 - Sistema alerta quando estoque atingir nível crítico.

RN05 - Sistema sugere pedido automaticamente.

RN06 - Produtos vencidos não podem ser consumidos.
