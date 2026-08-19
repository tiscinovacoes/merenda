> ⚠️ **Estado-alvo (2026-08-19):** este mapa reflete o SUALE APÓS a modularização
> (perfis Estoque Central e Motorista já existem) e o épico **Expedição & Logística**
> especificado em `ESPEC_EXPEDICAO_LOGISTICA.md`. Itens marcados 🆕 são a implementar.

LOGIN
 │
 ├── Gestor SEMED
 │
 ├── Nutricionista SEMED
 │
 ├── Escola (Diretor · Merendeira · Resp. Estoque)
 │
 ├── Estoque Central (Central de Distribuição / Almoxarifado)
 │
 ├── Motorista (Logística de Entrega)
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

Perfil Estoque Central (Central de Distribuição / Almoxarifado)

Dashboard Operacional (CD)
│   ├── Recebimentos Pendentes · OS a Separar · Ordens de Entrega Ativas · Lotes em Risco
│   └── 🆕 Cobertura: Escolas Atendidas · Não Atendidas · % (clicáveis → painel das escolas)
│
├── Estoque Central  🆕 (funde "Posição de Estoque" + "OS Estoque Central")
│   ├── Inventário / Posição
│   ├── Estoque Central Vigente (via NFs)
│   └── Receber NF-e via XML
│
├── Recebimentos Pendentes
│   ├── Conferência Física (RN01) → dá entrada no estoque
│   └── Confronto NF-e 4 Vias (RN05)
│
├── Expedição (OS Escolas)  ← 🆕 destino das O.S. da Nutricionista
│   ├── Separação FEFO (RN06) — bipagem + impressão de romaneio
│   ├── 🆕 Fracionar O.S. (saldo → OS pendente)
│   └── Criar Ordem de Entrega (após separação)
│
├── 🆕 Montagem de Carga (modal) — sugestão por peso, trava 5.400 kg, ocupação por caminhão
│
├── Ordens de Entrega
│   ├── 🆕 Filtros: por O.S. / por Escola / por Carga
│   ├── 🆕 Timeline de status (autor + data/hora)
│   └── (sem confirmação aqui — dupla checagem Motorista + Escola)
│
├── 🆕 Rastreabilidade (Caminhões) — acompanhamento logístico por caminhão
│
├── 🆕 Frota — cadastro de caminhões (placa, modelo, capacidade kg, refrigerado, status)
│
├── Controle de Lotes & Rastreabilidade (FEFO)
│
├── Escolas Atendidas
│
├── 🆕 Relatórios de Entrega (por caminhão / motorista / escola)
│
└── 🆕 Ocorrências (tipos de almoxarifado)

Perfil Motorista (Logística de Entrega)  🆕 telas mobile-first (PWA em 2º plano)

Minha Rota Diária
│   └── 🆕 rota ordenada (ORS-ready: prioridade + janela de horário)
│
├── Escolas da Rota
│
├── Realizar Entregas
│   ├── 🆕 Checagem / bipagem dos itens
│   └── Confirmar Entrega (lado Motorista da dupla checagem)
│
├── Registrar Ocorrência (sobre a entrega)
│
└── Histórico de Viagens

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

Fluxo logístico de Expedição (🆕 épico Expedição & Logística)

NUTRICIONISTA (dispara O.S. com cardapioId)
      │
      ▼
ESTOQUE CENTRAL → Expedição (OS Escolas)      ← O.S. chega COMPLETA (corrige bug D11)
      │
      │ Separação FEFO (bipagem, romaneio) · pode FRACIONAR (saldo → OS pendente)
      ▼
MONTAGEM DE CARGA (modal)
      │  1 escola = 1 OE · caminhão agrupa N OEs · trava 5.400 kg · sugestão por peso
      ▼
ORDEM DE ENTREGA (por escola)  →  disparada ao MOTORISTA
      │
      ▼
MOTORISTA (rota ORS-ready)
      │  checagem/bipagem · confirma ENTREGA
      ▼
ESCOLA (Resp. Estoque + Diretor)  →  confirma RECEBIMENTO
      │
      ▼
OE "ENTREGUE" (fecha só com dupla checagem) → timeline de status + rastreabilidade
      │
      ▼
COBERTURA (Gestor + Estoque): escolas atendidas/não atendidas/% por cardápio e período

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
