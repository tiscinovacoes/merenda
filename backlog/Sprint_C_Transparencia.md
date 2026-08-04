# Backlog — Sprint C: Transparência e Conformidade
> Portal público + dashboard "proteção do gestor" — principal argumento de venda do concorrente
> Origem: [SUALE_Backlog_Paridade_CheffEscolar.md](../SUALE_Backlog_Paridade_CheffEscolar.md)

## Épico C1 — Portal Público de Transparência

**Objetivo:** página pública (sem login) que exibe a execução do PNAE do município — a tese "transparência protege o gestor público" vira funcionalidade.

### C1.1 — Página pública do município
**Como** cidadão/CAE/imprensa, **quero** consultar como o recurso da merenda é aplicado, **para** fiscalizar sem pedir informação via LAI.
- [ ] URL pública por município (ex.: `/transparencia/:municipio`)
- [ ] Blocos: recurso recebido no ano, % executado, % agricultura familiar, nº de refeições servidas
- [ ] Somente dados agregados — nenhum dado pessoal (LGPD)
- **Critério de aceite:** página renderiza sem autenticação; números batem com os relatórios internos do Gestor.

### C1.2 — Cardápio da semana público
**Como** responsável por aluno, **quero** ver o cardápio da semana da escola do meu filho, **para** acompanhar a alimentação.
- [ ] Seleção de escola → cardápio semanal publicado pela Nutricionista
- [ ] Publicação controlada: só cardápios com status "aprovado"
- **Critério de aceite:** alteração de cardápio não publicada não aparece no portal.

### C1.3 — Origem dos alimentos
**Como** cidadão, **quero** ver de onde vêm os alimentos (fornecedores, % agricultura familiar local), **para** conhecer o impacto na economia da região.
- [ ] Lista de fornecedores contratados com tipo (AF local / AF regional / mercado)
- [ ] Gráfico do percentual AF vs. mínimo de 30%
- **Critério de aceite:** percentual idêntico ao exibido no módulo de prestação de contas.

---

## Épico C2 — Dashboard de Conformidade ("Proteção do Gestor")

**Objetivo:** painel de alertas preventivos no perfil Gestor que evita apontamentos de TCU/MP antes que aconteçam.

### C2.1 — Motor de alertas de conformidade
**Como** Gestor SEMED, **quero** receber alertas automáticos de risco de não conformidade, **para** corrigir antes da prestação de contas.
- [ ] Regras iniciais:
  - % AF projetado < 30% (crítico)
  - Saldo de recurso não executado > X% faltando N dias para o fim do exercício
  - NF com divergência pendente há mais de 7 dias
  - Contrato vencendo em 30 dias com saldo alto
  - Escola sem registro de consumo há mais de 5 dias letivos
  - Parcela FNDE prevista e não recebida
- [ ] Severidade (crítico/atenção/informativo) e responsável sugerido por alerta
- [ ] Regras configuráveis (thresholds por município)
- **Critério de aceite:** cada alerta linka direto para a tela onde se resolve.

### C2.2 — Painel de conformidade no dashboard do Gestor
- [ ] Widget de score de conformidade (% de checagens OK)
- [ ] Lista de pendências ordenada por severidade
- [ ] Histórico: evolução do score no exercício
- **Critério de aceite:** resolver a pendência remove o alerta em tempo real.

### C2.3 — Relatório de conformidade para órgãos de controle
**Como** setor Jurídico, **quero** exportar um relatório de conformidade do período, **para** responder diligências de TCE/MP com evidências.
- [ ] PDF com: checagens realizadas, alertas emitidos/resolvidos, trilha de auditoria resumida
- **Critério de aceite:** relatório referencia os registros de auditoria do Sprint A (A2.3).

---

## Épico C3 — Notificações

### C3.1 — Notificações por perfil
- [ ] Alertas críticos notificam por e-mail além do painel
- [ ] Preferências de notificação por usuário
- **Critério de aceite:** alerta crítico gera e-mail em ≤ 5 min.

---

## Dependências
- Sprints A e B (os alertas consomem saldos, contratos, NFs e prestação de contas)
- Cardápios aprovados (módulo Nutricionista existente) para C1.2
- Registro de consumo do perfil Escola (existente) para o alerta de escola inativa
