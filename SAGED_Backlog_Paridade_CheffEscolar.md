# SUALE — Backlog de Paridade e Superação vs. Cheff Escolar
> Documento de agregação ao SUALE — derivado de [Analise_Concorrente_CheffEscolar.md](Analise_Concorrente_CheffEscolar.md)
> Data: 20/07/2026

## Objetivo
Incorporar ao SUALE tudo que o Cheff Escolar (Digix) entrega, mapeando cada módulo do concorrente aos perfis e telas já existentes no SUALE, e explicitando o que falta construir.

---

## 1. Mapa de paridade — módulo do concorrente × estado no SUALE

| Módulo Cheff Escolar | Perfil SUALE responsável | Estado no SUALE | Ação |
|---|---|---|---|
| Distribuição de recursos (per capita × modalidade) | Gestor SEMED | ❌ Não existe | **CONSTRUIR** — módulo financeiro |
| Planejamento de cardápio pelo RT | Nutricionista | ✅ Existe (cardápios, fichas técnicas, planejamento) | Manter |
| Lista de compras a partir do cardápio | Nutricionista → Gestor | 🟡 Parcial (planejamento alimentar existe; geração automática de lista consolidada não) | **COMPLETAR** |
| Licitações / processos aquisitivos | Gestor SEMED | 🟡 Parcial (Atas & Contratos existe; fluxo de licitação/dispensa não) | **COMPLETAR** |
| Agricultura Familiar (30% + chamada pública) | Gestor + Cooperativa + Agricultor | ✅ Forte (perfis Cooperativa e Agricultor completos — vantagem sobre o concorrente) | Manter e destacar |
| Prestação de contas FNDE/CAE | Gestor SEMED | ❌ Não existe | **CONSTRUIR** |
| Gestão de dados e transparência | Gestor (Relatórios) | 🟡 Parcial (relatórios internos; portal público de transparência não) | **COMPLETAR** |
| Integração SERPRO (NF-e → itens de contrato) | Gestor + Escola | ❌ Não existe | **CONSTRUIR** (fase 2) |

## 2. Vantagens SUALE já existentes (o concorrente NÃO tem)

| Diferencial SUALE | Onde está |
|---|---|
| Estoque físico na escola (entrada/saída/validade) | Perfil Escola — tela estoque |
| Registro de consumo diário e desperdício | Perfis Escola e Nutricionista |
| Recebimento/conferência de entregas na unidade | Perfil Escola — entregas |
| Perfis Cooperativa e Agricultor Familiar (ponta do fornecedor) | Perfis completos com pedidos, rotas, entregas |
| IA de previsão de demanda | Telas IA (Gestor e Nutricionista) |
| Simulações nutricionais | Perfil Nutricionista |

## 3. Backlog priorizado

### Sprint A — Fecha o ciclo financeiro (paridade crítica)
1. **Módulo Distribuição de Recursos**
   - Cadastro do repasse FNDE por exercício
   - Cálculo per capita × dias letivos × modalidade de ensino (usar planilhas de referência: `PER CAPITA 2026 CONSULTA.xlsx`, `Cópia de CÁLCULO AGOSTO 2026.xlsx`)
   - Saldo por escola e por fonte (FNDE / contrapartida municipal)
2. **Prestação de Contas**
   - Consolidação de notas fiscais × contratos × entregas confirmadas pelas escolas
   - Relatório no formato FNDE (SiGPC) + parecer do CAE
   - Trilha de auditoria (quem recebeu, quando, quanto foi consumido)

### Sprint B — Compras e contratos
3. **Lista de compras automática**: cardápio aprovado → necessidade por gênero → consolidação por rede → divisão AF (mín. 30%) vs. licitação
4. **Fluxo aquisitivo**: chamada pública AF + licitação + dispensa, do edital à homologação, alimentando Atas & Contratos existente
5. **Vínculo NF ↔ contrato**: lançamento manual de NF na v1; integração SERPRO/SEFAZ na v2

### Sprint C — Transparência (argumento de venda)
6. **Portal público de transparência**: cardápios da semana, origem dos alimentos (% AF), execução dos recursos por escola
7. **Dashboard "proteção do gestor"**: alertas de conformidade (percentual AF abaixo de 30%, saldo não executado, prestação pendente)

### Fase 2
8. Integração SERPRO/NF-e automática
9. App mobile para merendeira/estoquista (registro de consumo offline-first)

## 4. Argumento de posicionamento (para pitch e site)

> O Cheff Escolar gerencia o PNAE **do gabinete para baixo** (recurso → cardápio → licitação → prestação de contas). O SUALE cobre o mesmo ciclo **e fecha o loop na ponta**: estoque real da escola, recebimento conferido, consumo diário e desperdício — dados que tornam a prestação de contas verificável, não apenas declaratória. Além disso, o SUALE é o único com perfis para **cooperativa e agricultor familiar**, digitalizando também o lado do fornecedor.

## 5. Referências cruzadas no repo
- Perfis: [Perfil_Gestor_SEMED_MVP.md](Perfil_Gestor_SEMED_MVP.md), [Perfil_Escola_SEMED_MVP.md](Perfil_Escola_SEMED_MVP.md), [Perfil_Nutricionista_SEMED_MVP.md](Perfil_Nutricionista_SEMED_MVP.md), [Perfil_agricultor_familiar.md](Perfil_agricultor_familiar.md), [Cooperativa.md](Cooperativa.md)
- Fluxos: [fluxo_escola.md](fluxo_escola.md), [fluxo_nutricionista.md](fluxo_nutricionista.md), [Fluxo_agricultor.md](Fluxo_agricultor.md)
- Navegação: [Mapa_Navegacao_geral_do_Sistema.md](Mapa_Navegacao_geral_do_Sistema.md)
- Telas de referência: `figma-screens/`
- Análise do concorrente: [Analise_Concorrente_CheffEscolar.md](Analise_Concorrente_CheffEscolar.md)
