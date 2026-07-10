# PROTÓTIPO - PERFIL NUTRICIONISTA SEMED

## Objetivo

Permitir o planejamento nutricional da alimentação escolar, garantindo o correto dimensionamento da demanda de alimentos para todas as unidades da rede municipal.

---

# Estrutura de Navegação

Menu lateral:

- Dashboard Nutricional
- Fichas Técnicas
- Produtos
- Cardápios
- Planejamento Alimentar
- Escolas
- Consumo
- Desperdícios
- Simulações
- Relatórios
- IA Nutricional

---

# TELA 01 - Dashboard Nutricional

## Cards

- Escolas Atendidas
- Alunos Atendidos
- Cardápios Ativos
- Consumo Previsto
- Consumo Real
- Índice de Desperdício

## Alertas

- Produtos insuficientes
- Cardápios sem cobertura
- Escolas em risco

## IA

- Sugestões de substituição
- Ajustes de quantidades
- Redução de desperdício

---

# TELA 02 - Cadastro de Produtos

## Campos

- Nome
- Categoria
- Unidade
- Valor Nutricional
- Período de Safra
- Produto da Agricultura Familiar

---

# TELA 03 - Fichas Técnicas

## Cadastro

- Nome da Preparação
- Tipo de Refeição

## Ingredientes

- Produto
- Quantidade
- Unidade

## Resultado

- Valor Nutricional
- Peso Final
- Custo Estimado

---

# TELA 04 - Gestão de Cardápios

## Listagem

- Nome
- Período
- Escolas Vinculadas
- Status

## Cadastro

- Nome
- Data Inicial
- Data Final

## Estrutura

- Café da manhã
- Lanche
- Almoço
- Jantar

## Vinculação

- Escola Individual
- Região
- Todas as Escolas

---

# TELA 05 - Planejamento Alimentar

## Cálculo Automático

Considera:

- Quantidade de alunos
- Per capita
- Dias letivos

## Resultado

- Produto
- Quantidade Necessária
- Estoque Existente
- Necessidade de Compra

---

# TELA 06 - Gestão das Escolas

## Consulta

- Alunos
- Estoque
- Consumo
- Cardápios Aplicados

---

# TELA 07 - Monitoramento de Consumo

## Comparativo

- Produto
- Previsto
- Consumido
- Diferença

## Alertas

- Consumo acima do previsto
- Consumo abaixo do previsto

---

# TELA 08 - Gestão de Desperdícios

## Registro

- Escola
- Produto
- Quantidade
- Motivo

## Indicadores

- Desperdício por escola
- Desperdício por produto
- Desperdício por região

---

# TELA 09 - Simulações

## Cenários

Exemplo:

- Aumento de alunos
- Nova escola
- Alteração de cardápio

## Resultado

- Impacto no consumo
- Impacto financeiro
- Necessidade de compra

---

# TELA 10 - IA Nutricional

## Análises

- Necessidade futura
- Produtos críticos
- Produtos em excesso

## Sugestões

- Ajuste de cardápio
- Produtos sazonais
- Priorização da agricultura familiar

---

# Integrações

## Escola

Envia:

- Cardápios

Recebe:

- Consumo
- Desperdícios

## Gestor

Disponibiliza:

- Planejamento
- Indicadores

## Cooperativa

Disponibiliza:

- Previsão de demanda

## Agricultura Familiar

Disponibiliza:

- Produtos necessários
- Sazonalidade

---

# Regras de Negócio

RN01 - Todo cardápio deve possuir ficha técnica.

RN02 - Toda ficha técnica deve possuir ingredientes.

RN03 - A necessidade de compra é calculada automaticamente.

RN04 - O sistema deve considerar calendário letivo.

RN05 - A IA deve sugerir produtos sazonais da agricultura familiar.

RN06 - Nenhum cardápio pode ser publicado sem validação nutricional.
