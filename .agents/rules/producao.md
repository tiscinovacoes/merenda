---
trigger: always_on
---

# 1. Trava de Segurança e Fluxo de Aprovação (Produção)

- NUNCA execute alterações no ambiente de produção diretamente.
- O processo de trabalho deve seguir OBRIGATORIAMENTE 3 etapas:

  ETAPA 1 — PLANEJAMENTO E REFINAMENTO:
  * Antes de mexer no código, analise a demanda, consulte a skill em `skill-instas-rafa/SKILL.md` e o histórico no Obsidian, pense na solução e traga o plano detalhado.
  * Faça as perguntas necessárias para refinarmos a ideia juntos.

  ETAPA 2 — EXECUÇÃO AUTÔNOMA (APÓS APROVAÇÃO):
  * Assim que o usuário aprovar o plano, execute a tarefa do início ao fim de forma autônoma.
  * NÃO fique pedindo confirmações intermediárias a cada passo/linha de código, pois o escopo já foi previamente aprovado.

  ETAPA 3 — VALIDAÇÃO E PROMOÇÃO PARA PRODUÇÃO:
  * Ao finalizar toda a execução e os testes no ambiente local/desenvolvimento, conclua a tarefa e pergunte ao usuário: "O trabalho foi concluído com sucesso. Podemos subir para produção?"

---

# 2. Ciclo de Leitura e Registro no Obsidian (F:\Nova cofre)

1. ANTES DE PLANEJAR (Na Etapa 1):
   - Verifique o status atual do trabalho.
   - Consulte a última alteração em "F:\Nova cofre\ATIVIDADE_LOG.md" para entender o estado e o histórico do projeto.

2. APÓS CONCLUIR A EXECUÇÃO (Antes da Etapa 3):
   - Registre a nova versão e o resumo do que foi alterado diretamente no log "F:\Nova cofre\ATIVIDADE_LOG.md".
   - O log deve conter: Data/Hora, Versão/Etapa, Resumo das Mudanças e Arquivos Alterados.

---

# 3. Uso Obrigatório da Skill (skill-instas-rafa)

- CONSULTA DE SKILL: Para qualquer tarefa relacionada a este projeto, você deve OBRIGATORIAMENTE ler e seguir as diretrizes definidas no arquivo `skill-instas-rafa/SKILL.md`. "F:\Nova cofre\skill-instas-rafa.skill"
- APLICAÇÃO PRÁTICA: Utilize os padrões, instruções e estruturas descritos nessa skill durante o planejamento e a execução do código.


# 4. Salvar as Implementações

- Salve no Obsidian e na pasta original do projeto, todas as implementações aprovadas.