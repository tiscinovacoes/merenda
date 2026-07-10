LOGIN
 │
 ├── Gestor SEMED
 │
 ├── Nutricionista SEMED
 │
 ├── Escola
 │
 ├── Cooperativa
 │
 └── Agricultor Familiar

 PERFIL GESTOR SEMED
 
 Dashboard Executivo
│
├── Escolas
│   ├── Listagem
│   ├── Detalhes
│   │   ├── Estoque
│   │   ├── Consumo
│   │   ├── Pedidos
│   │   └── Entregas
│
├── Atas e Contratos
│   ├── Listagem
│   ├── Detalhes
│   ├── Produtos Contratados
│   └── Cronograma
│
├── Pedidos
│   ├── Pendentes
│   ├── Em Atendimento
│   └── Finalizados
│
├── Cooperativas
│   ├── Listagem
│   ├── Estoque Consolidado
│   ├── Entregas
│   └── Indicadores
│
├── Agricultura Familiar
│   ├── Agricultores
│   ├── Produção
│   └── Participação
│
├── Estoque Consolidado
│
├── Planejamento Alimentar
│
├── Relatórios
│
└── IA de Previsão

PERFIL NUTRICIONISTA

Dashboard Nutricional
│
├── Produtos
│
├── Fichas Técnicas
│   ├── Cadastro
│   ├── Ingredientes
│   └── Valor Nutricional
│
├── Cardápios
│   ├── Cadastro
│   ├── Publicação
│   └── Vinculação de Escolas
│
├── Planejamento Alimentar
│   ├── Necessidade Prevista
│   ├── Estoque Existente
│   └── Necessidade de Compra
│
├── Escolas
│
├── Consumo
│
├── Desperdícios
│
├── Simulações
│
├── Relatórios
│
└── IA Nutricional

Perfil escola

Dashboard
│
├── Estoque
│   ├── Entradas
│   ├── Saídas
│   ├── Inventário
│   └── Validades
│
├── Consumo
│   ├── Lançamento Diário
│   ├── Histórico
│   └── Indicadores
│
├── Cardápios
│   ├── Recebidos da Nutricionista
│   └── Execução
│
├── Pedidos
│   ├── Sugestão Automática
│   ├── Solicitação
│   └── Acompanhamento
│
├── Entregas
│   ├── Recebimento
│   ├── Divergências
│   └── Evidências
│
├── Histórico
│
├── Relatórios
│
└── Configurações

Perfil Cooperativa

Dashboard
│
├── Agricultores
│   ├── Cadastro
│   ├── Produção
│   ├── Estoque
│   └── Indicadores
│
├── Produtos
│
├── Estoque Consolidado
│
├── Pedidos
│   ├── Recebidos
│   ├── Distribuição
│   └── Atendimento
│
├── Planejamento de Entregas
│
├── Rotas
│
├── Contratos
│   ├── Chamamentos
│   ├── Produtos
│   ├── Saldo
│   └── Cronograma
│
├── Entregas
│
├── Relatórios
│
└── Indicadores

Perfil Agricultor

Dashboard
│
├── Minha Produção
│   ├── Plantio
│   ├── Safra
│   └── Produção Prevista
│
├── Estoque
│
├── Pedidos
│
├── Entregas
│
├── Calendário
│
├── Relatórios
│
└── Perfil

Fluxo integrado do sistema

NUTRICIONISTA
      │
      │ cria cardápio
      ▼
ESCOLAS
      │
      │ executam cardápio
      │ registram consumo
      ▼
ESTOQUE
      │
      │ identifica necessidade
      ▼
PEDIDO
      │
      ▼
COOPERATIVA
      │
      │ distribui
      ▼
AGRICULTORES
      │
      │ entregam
      ▼
ESCOLA
      │
      │ confirma recebimento
      ▼
ESTOQUE ATUALIZADO
      │
      ▼
GESTOR SEMED
      │
      ├── acompanha indicadores
      ├── acompanha contratos
      ├── acompanha abastecimento
      └── acompanha agricultura familiar

Fluxo da IA

Consumo Escolar
        +
Cardápios
        +
Quantidade de Alunos
        +
Estoque
        +
Contratos
        +
Produção dos Agricultores
        ↓
Motor de IA
        ↓
Previsão de Demanda
        ↓
Alertas
        ↓
Sugestão de Compras
        ↓
Planejamento da Nutricionista
        ↓
Informações para Gestor
