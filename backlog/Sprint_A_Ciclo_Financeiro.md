# Backlog — Sprint A: Ciclo Financeiro
> Paridade crítica com Cheff Escolar: Distribuição de Recursos + Prestação de Contas
> Origem: [SUALE_Backlog_Paridade_CheffEscolar.md](../SUALE_Backlog_Paridade_CheffEscolar.md)

## Épico A1 — Distribuição de Recursos PNAE

**Objetivo:** o Gestor SEMED cadastra o repasse FNDE e o sistema calcula e distribui o recurso por escola, com saldo acompanhado em tempo real.

### A1.1 — Cadastro do exercício e repasse FNDE
**Como** Gestor SEMED, **quero** cadastrar o exercício financeiro e os valores de repasse FNDE por parcela, **para** ter a base de cálculo da distribuição.
- [ ] CRUD de exercício (ano, nº de parcelas, datas previstas)
- [ ] Lançamento de parcela recebida (valor, data, fonte: FNDE / contrapartida municipal)
- [ ] Status da parcela: prevista / recebida / atrasada
- **Critério de aceite:** somatório das parcelas = total do exercício; alerta se parcela atrasar mais de 15 dias.

### A1.2 — Tabela per capita por modalidade
**Como** Gestor SEMED, **quero** manter a tabela de valores per capita por modalidade de ensino (creche, pré-escola, fundamental, EJA, integral, quilombola/indígena), **para** que o cálculo siga a resolução vigente do FNDE.
- [ ] Tabela versionada por exercício (valores mudam por resolução)
- [ ] Importar valores de referência da planilha `PER CAPITA 2026 CONSULTA.xlsx`
- **Critério de aceite:** alterar o per capita não retroage sobre distribuições já homologadas.

### A1.3 — Cálculo e distribuição por escola
**Como** Gestor SEMED, **quero** que o sistema calcule automaticamente o valor de cada escola (alunos matriculados × per capita × dias letivos), **para** eliminar as planilhas manuais (`CÁLCULO AGOSTO 2026.xlsx`).
- [ ] Censo de matrículas por escola/modalidade (cadastro ou importação)
- [ ] Cálculo automático com memória de cálculo visível
- [ ] Ajuste manual com justificativa obrigatória (auditável)
- [ ] Homologação da distribuição (trava edição)
- **Critério de aceite:** resultado bate com a planilha de agosto/2026 usada como massa de teste; divergência > R$ 0,01 reprova.

### A1.4 — Saldo por escola
**Como** Diretor de escola, **quero** ver meu saldo disponível, empenhado e executado, **para** planejar as compras.
- [ ] Card de saldo no dashboard do perfil Escola
- [ ] Extrato de movimentações (crédito da distribuição, débito por pedido/NF)
- **Critério de aceite:** saldo da escola = distribuído − empenhado − executado, sempre.

---

## Épico A2 — Prestação de Contas

**Objetivo:** gerar a prestação de contas no formato FNDE (SiGPC/Contas Online) a partir dos dados já registrados no sistema, com trilha de auditoria completa.

### A2.1 — Conciliação NF × contrato × entrega
**Como** setor de Prestação de Contas, **quero** vincular cada nota fiscal ao contrato/ata e à entrega confirmada pela escola, **para** que cada despesa tenha comprovação em três pontas.
- [ ] Lançamento de NF (nº, chave, fornecedor, itens, valores) — manual na v1
- [ ] Vínculo NF → item de contrato (validação de preço e quantidade contratada)
- [ ] Vínculo NF → entrega conferida no perfil Escola (módulo já existente)
- [ ] Divergências geram pendência bloqueante (preço acima do contratado, quantidade não recebida)
- **Critério de aceite:** NF sem os dois vínculos não entra na prestação de contas.

### A2.2 — Relatório FNDE / parecer CAE
**Como** Gestor SEMED, **quero** gerar o demonstrativo consolidado do exercício no formato exigido pelo FNDE, **para** submeter ao SiGPC sem retrabalho.
- [ ] Demonstrativo sintético: receitas (parcelas) × despesas (NFs conciliadas) × saldo reprogramado
- [ ] Percentual executado em agricultura familiar destacado (mín. 30%)
- [ ] Exportação PDF e CSV; espaço para parecer do CAE (aprovado/aprovado com ressalvas/rejeitado + anexo)
- **Critério de aceite:** total de despesas do relatório = soma das NFs conciliadas do exercício.

### A2.3 — Trilha de auditoria
**Como** setor Jurídico, **quero** consultar o histórico completo de qualquer despesa (quem lançou, quem conferiu a entrega, quem homologou), **para** responder a órgãos de controle.
- [ ] Log imutável por entidade financeira (usuário, ação, timestamp, valor antes/depois)
- [ ] Linha do tempo da despesa: contrato → pedido → entrega → NF → prestação
- **Critério de aceite:** qualquer valor exibido no relatório FNDE rastreável até o registro de origem em ≤ 3 cliques.

---

## Dependências e dados de teste
- Planilhas reais no repo: `PER CAPITA 2026 CONSULTA.xlsx`, `Cópia de CÁLCULO AGOSTO 2026.xlsx`, `Cópia de CÁLCULO AGOSTO 2026 - FORNECEDORES.pdf`
- 8 escolas piloto já cadastradas (commit `81010d9`)
- Módulo de entregas do perfil Escola (pré-requisito do A2.1)
