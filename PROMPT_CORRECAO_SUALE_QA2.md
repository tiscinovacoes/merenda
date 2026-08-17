# PROMPT DE EXECUÇÃO — QA Rodada 2 (Consolidado Claude + Antigravity)

> **Origem:** Reteste dos 25 achados originais (2026-08-17) + confronto com o relatório de QA do Antigravity no mesmo dia. Este prompt junta os dois: mantém corrigido o que os dois confirmaram, remove do escopo o que já foi resolvido, e lista só o que ainda quebra — verificado em runtime nos dois lados antes de entrar aqui.
> **Regra mestra:** nenhuma correção conta como pronta por leitura de código. Reproduza o cenário real (clicar no botão, submeter o formulário, não só chamar o método no console) antes de marcar como concluído.

---

## 0. O que já está corrigido — NÃO MEXER, só preservar

Confirmado em runtime nesta rodada. Qualquer alteração nestes pontos deve rodar o reteste abaixo antes de commitar:

| Item | Como confirmar que não regrediu |
|---|---|
| IDs únicos (`crypto.randomUUID()`) | `grep -c "' + Date.now()" app.js` deve continuar 0 |
| Escolas piloto no Supabase (8 reais, IDs 1–8) | Login como Diretor de cada uma mostra nome e números corretos |
| `getCardapios` definida | Nenhuma tela quebra em branco (testar as 100 telas dos 10 perfis) |
| `openNewEmpenhoModal` implementado | Botão "Emitir Novo Empenho SIAFI" abre modal |
| Menu "Lista de Compras" único | Nenhum rótulo duplicado no menu do Gestor |
| Ciclo entrega → estoque da escola | Confirmar entrega dá entrada real no estoque |
| Matching agricultor↔produto | Agricultor real atribuído, não mais "A definir" |
| Versão única (`2.4.1`) | Mesmo valor em `app.js`, `package.json`, `index.html` |
| Cópia única do código | `docs/` é espelho de build idêntico à raiz, não editável à parte |
| Estrutura de auth (`AUTH_ENABLED=false`) | Ligar a flag bloqueia login vazio — está correto, é intencional, não ligar ainda |

---

## FASE 1 — CRÍTICA

### 1.1 · Insert de pedido no Supabase continua quebrado
**Onde:** `app.js:8451`, dentro do submit de `escola_pedidos`.
**O bug:** o código de escrita real nunca foi atualizado — ainda envia `{ school: sc.name, date, status, cooperative, value }`. A tabela real tem `school_name`, `school_id`, `items` (plural inglês). Testei agora: `Could not find the 'school' column of 'orders' in the schema cache`, 100% de falha, e o `catch` continua vazio (`/* silencia — SharedState garante persistência local */`), então a tela confirma "✅ Pedido enviado!" mesmo sem gravar nada no banco.

**Execute:**
```js
// trocar o insert atual por:
await _sb.from('orders').insert([{
  school_name: sc.name,
  school_id: sc.id,
  date: newOrder.date,
  status: 'Pendente',
  cooperative: coopSel,
  value,
  items: itens, // ja existe na função, mapear para o array de itens
}]);
```
Substitua o `catch` vazio: em caso de erro, marque o pedido como `sincronizado: false` no `SharedState` e troque a mensagem de sucesso por algo como "Pedido salvo localmente — sincronização com o banco pendente", nunca afirme sucesso total quando a gravação falhou.

**Critério:** criar pedido pela tela da Escola grava de fato em `orders` no Supabase (confirmar com `select` logo em seguida).

### 1.2 · Normalização do pedido não cobre os itens
**Onde:** `SharedState.addOrder()`, bloco de normalização (`finalItens = order.itens || order.items || []`).
**O bug — achado novo desta rodada:** o envelope do pedido foi corrigido (escola/cooperativa aparecem certos nas 3 origens), mas o array de itens é só copiado, nunca remapeado campo a campo. Um pedido do Diretor, que ainda usa `items:[{name, qtd, unit}]`, aparece na Cooperativa com `undefined (50undefined)` no lugar de produto e unidade.

**Execute:**
```js
let finalItens = (order.itens || order.items || []).map(i => ({
  produto: i.produto || i.name || i.nome || '—',
  qtd: i.qtd || i.quantidade || 0,
  unidade: i.unidade || i.unit || '',
}));
```
Aplique essa normalização **antes** de atribuir a `finalItens`, no mesmo bloco em `addOrder()`. Depois, corrija a tela de origem do Diretor para já gravar `itens` no formato canônico — a normalização é rede de segurança, não a única defesa.

**Critério:** pedido criado pela tela do Diretor mostra produto e unidade corretos em `cooperativa/pedidos`, `gestor/pedidos` e `estoque/separacao`.

### 1.3 · Motorista nunca vê a entrega real — causa mudou, problema continua
**Onde:** `window.dispatchOrder` (~`app.js:8869`).
**O bug — revalidado agora, o código mudou entre o laudo anterior e hoje:** `dispatchOrder()` passou a gravar `o.driver = 'Carlos Silva (Placa ABC-1234)'` como valor fixo. Mas o perfil logável de motorista é `PROFILES.motorista.name = 'José Souza'`. A tela `motorista_entregas` filtra por `o.driver === prof.name` — os dois nomes nunca batem. Testei o despacho real agora: `driver` gravado ≠ nome do perfil, motorista continua sem ver o pedido.

**Execute:** não usar nome fixo. No despacho, abrir seleção real de motorista (mesmo que hoje só exista um motorista cadastrado, buscar o nome de `PROFILES.motorista.name` ou de uma lista de motoristas em vez de um literal hardcoded):
```js
window.dispatchOrder = (id) => {
  const o = SharedState.getOrders().find(x => x.id === id);
  if (o) {
    o.driver = o.driver || PROFILES.motorista.name; // nunca um nome fixo diferente do perfil logável
    o.driver_id = o.driver_id || PROFILES.motorista.userId;
  }
  SharedState.updateOrderStatus(id, 'Em transporte');
  showToast('🚚 Pedido despachado. ' + o.driver + ' notificado.');
  renderPage();
};
```
Quando existir mais de um motorista cadastrado, trocar por um seletor real (nome + veículo + rota) em vez de atribuição automática.

**Critério:** despachar um pedido e logar como motorista mostra esse pedido em `motorista/entregas`, sem atalho manual no console.

### 1.4 · Aliases entre perfis continuam vazando escopo
**Onde:** menu de Cooperativa e Agricultor.
**O bug:** sem mudança desde o laudo original. `cooperativa/estoque` continua abrindo "Estoque Consolidado Municipal" (a tela do Gestor, rede inteira) e `agricultor/escolas` continua listando todas as escolas do município, não só as atendidas. Isso expõe dado de toda a rede a um fornecedor externo.

**Execute:** dar renderer próprio com escopo filtrado:
```js
PAGE_RENDERERS.cooperativa_estoque = (el) => {
  const coopName = PROFILES.cooperativa.role;
  // filtrar por produtos/estoque vinculados a esta cooperativa, não DATA.schools inteiro
};
PAGE_RENDERERS.agricultor_escolas = (el) => {
  // filtrar DATA.schools pelas escolas que este agricultor efetivamente atende
};
```
Fazer o mesmo para os demais aliases já mapeados no laudo original (`cooperativa/entregas`, `cooperativa/planejamento`, `agricultor/entregas`, `agricultor/calendario`, `merendeira/dashboard`, `merendeira/cardapios`, `diretor/cardapios`) — nenhum foi corrigido ainda.

**Critério:** logar como Cooperativa e como Agricultor mostra só dados do próprio escopo, nunca o consolidado municipal.

---

## FASE 2 — ALTA

### 2.1 · `diretor/planejamento` sem renderer (achado novo)
**Onde:** menu do Diretor tem o item `planejamento` (adicionado corretamente, endereçando o achado A1 do laudo original), mas `PAGE_RENDERERS.diretor_planejamento` nunca foi criado. Cai no fallback do dashboard sem aviso.

**Execute:**
```js
PAGE_RENDERERS.diretor_planejamento = (el) => { PAGE_RENDERERS.escola_planejamento(el); };
```
Ou, se o conteúdo precisar ser diferente para o Diretor, implementar um renderer próprio. O mínimo aceitável é o alias acima — não deixar o item de menu sem destino.

**Critério:** clicar em "Planejamento Alimentar" no menu do Diretor abre a tela de planejamento, não o Painel da Direção.

### 2.2 · Botões inertes — 29 continuam sem ação
**Onde:** mesmo conjunto do laudo original, revalidado agora sem mudança.

| Tela | Botões | Prioridade |
|---|---|---|
| `cooperativa/pedidos` | **Confirmar Distribuição e Enviar aos Agricultores** · Distribuir | Alta — é o CTA que fecha o repasse Cooperativa→Agricultor |
| `cooperativa/agricultores` | + Novo Agricultor · Detalhes | Média |
| `cooperativa/produtos` | + Novo Produto · Editar | Média |
| `gestor/cooperativas` | Ver Indicadores | Baixa |
| `gestor/pedidos` | Filtros Entregue/Em transporte/Em separação | Baixa |

**Execute:** implementar ação real em cada um, começando pelo CTA de distribuição — ele precisa gravar a distribuição em `SharedState` e disparar a mesma lógica de `acceptOrder`. Onde não houver tempo de implementar a funcionalidade completa nesta rodada, remover o botão em vez de deixá-lo decorativo.

### 2.3 · `#incident-school` com opções fixas *(achado validado do relatório do Antigravity)*
**Onde:** `app.js:10052`, formulário de ocorrência do Motorista.
**O bug:** confirmado — o `<select id="incident-school">` só tem 2 escolas hardcoded mais "Outro incidente", sem popular pela rota real do motorista.

**Execute:**
```js
const escolasDaRota = DATA.schools.filter(s => /* escolas atendidas pela rota deste motorista */);
// popular <option> dinamicamente a partir de escolasDaRota, mantendo "Outro incidente" fixo no fim
```

**Critério:** o dropdown reflete as escolas da rota ativa, não uma lista fixa.

### 2.4 · FEFO sem filtro de lote vencido *(achado validado do relatório do Antigravity)*
**Onde:** `app.js:1369` — `item.lotes.sort((a,b) => new Date(a.validade) - new Date(b.validade))`.
**O bug:** confirmado — a ordenação por validade está correta (mais próximo do vencimento primeiro), mas não existe filtro removendo lotes já vencidos antes do consumo. Um lote vencido pode ser alocado para consumo escolar.

**Execute:**
```js
item.lotes = item.lotes.filter(l => !l.validade || new Date(l.validade) >= new Date());
item.lotes.sort((a,b) => new Date(a.validade) - new Date(b.validade));
```
Aplicar o mesmo filtro em todo ponto do código que consome de `lotes` (verificar `consumeCentralStock` e qualquer outro consumidor de FEFO).

**Critério:** um lote com validade no passado nunca é retornado como disponível para consumo; idealmente gera alerta de descarte.

---

## FASE 3 — MÉDIA

### 3.1 · `centralStock` sempre vazio — causa real, não a que o Antigravity apontou
**Onde:** `SharedState._data.centralStock`.
**Diagnóstico correto (o relatório do Antigravity atribuiu a causa errada — verificar antes de aplicar a correção dele):** não é sobre logar direto como Almoxarifado sem passar pelo Gestor antes. **Não existe nenhuma função que semeia `centralStock`**, em nenhum caminho de login. Ele só é populado organicamente por `receiveNF()` (recebimento real de NF-e). A correção que o Antigravity sugeriu — `this._data.centralStock = this._data.centralStock || DATA.centralStock || {}` — não resolve nada, porque `DATA.centralStock` **não existe** em lugar nenhum do código.

**Execute:** decidir entre duas abordagens:
- **(a)** Se o vazio for aceitável em ambiente limpo (central só deveria ter estoque após NF-e real), documentar isso na tela com uma mensagem clara tipo "Nenhuma NF-e recebida ainda — receba uma nota em Entradas para popular o estoque", em vez de mostrar produto com "0 Lata / Falta de Estoque" como se fosse erro.
- **(b)** Se o ambiente de demonstração precisa de estoque de exemplo, criar uma função `seedCentralStock()` análoga a `seedSchoolStocks()` (já existe em `app.js:2126` como referência de padrão), chamada no mesmo ponto do `login()`.

**Critério:** login como Estoque (direto ou via Gestor) mostra um estado consistente — nunca "Falta de Estoque" para um produto que na verdade só não foi semeado.

### 3.2 · Concorrência na emissão de Empenho *(achado validado do relatório do Antigravity)*
**Onde:** `SharedState.addEmpenho2()`, `app.js:832`.
**O bug:** confirmado — grava direto no `localStorage`/estado em memória, sem nenhum check de saldo remanescente da ATA nem trava atômica. Dois empenhos emitidos em sequência rápida contra a mesma ATA podem estourar o saldo.

**Execute (adaptando a sugestão do Antigravity ao Supabase já em uso neste projeto):**
```sql
-- RPC no Supabase, chamada em vez do insert direto:
create or replace function emitir_empenho(p_ata_id uuid, p_valor numeric, ...)
returns ... as $$
  update atas set valor_executado = valor_executado + p_valor
  where id = p_ata_id and (valor_global - valor_executado) >= p_valor
  returning *;
$$ language sql;
```
No cliente, chamar via `_sb.rpc('emitir_empenho', {...})` e checar se a linha retornou (se não retornou, saldo insuficiente ou concorrência perdeu a corrida).

**Critério:** dois empenhos disparados em paralelo contra a mesma ATA nunca resultam em saldo negativo.

### 3.3 · Renderers redefinidos, `addProduction` duplicado, telas órfãs, seed duplicado
Sem mudança desde o laudo original — revalidar rapidamente e aplicar:
- **M1:** 4 renderers ainda redefinidos (`gestor_escolas`, `gestor_atas`, `nutricionista_restricoes`, `nutricionista_escolas`) — confirmar se há lógica útil só no bloco morto, então excluir.
- **M2:** `addProduction` ainda declarado 2x — unificar preservando `status:'Ativo'` e a proteção de array (`this._data.productions = this._data.productions || []`).
- **M3:** `escola_restricoes`, `gestor_restricoes`, `escola_escolas`, `nutricionista_simulacoes` continuam sem entrada de menu — remover.
- **M9:** `restr-107` continua duplicado no seed — remover a entrada repetida.

---

## Achados do Antigravity descartados desta rodada

**`.calendar-wrapper` / `#calendar-container` (agenda do Agricultor):** busquei essa string em `app.js`, `docs/app.js` e nos 3 arquivos de teste que tocam em calendário (`tests/agricultor.spec.js`, `tests/capture-all-screens.spec.js`, `tests/motorista.spec.js`) — **não existe em nenhum lugar do repositório**. O teste real usa `navigateTo(page, 'calendario')` (id de página), não uma classe CSS `.calendar-wrapper`. Não incluí correção para isso — se o Antigravity insistir que existe, pedir o caminho exato do arquivo antes de agir, pode ser confusão com outro projeto que o mesmo agente audita (Vigia Custos / AIVIQ Saúde usam portas e stacks diferentes).

---

## CHECKLIST FINAL

- [ ] Pedido criado pela Escola grava de fato em `orders` no Supabase (não só no `localStorage`)
- [ ] Pedido do Diretor mostra produto/unidade corretos na Cooperativa, sem `undefined`
- [ ] Despachar um pedido faz o motorista real (não um nome fixo) vê-lo em `motorista/entregas`
- [ ] `cooperativa/estoque` e `agricultor/escolas` mostram só o próprio escopo, não a rede municipal
- [ ] `diretor/planejamento` abre a tela de planejamento, não o dashboard
- [ ] Botão "Confirmar Distribuição e Enviar aos Agricultores" executa a distribuição de verdade
- [ ] Dropdown de ocorrência do Motorista reflete a rota real
- [ ] Lote vencido nunca é retornado como disponível pelo FEFO
- [ ] `centralStock` não mostra "Falta de Estoque" falso em ambiente limpo — mensagem clara ou seed explícito
- [ ] Emissão de empenho contra ATA é atômica (testar 2 chamadas simultâneas)
- [ ] Nenhum renderer duplicado, nenhuma tela órfã, nenhum seed duplicado
- [ ] Registrar entrada no topo de `F:\Nova cofre\SUALE\ATIVIDADE_LOG.md` ao concluir, com o que foi de fato testado — não só descrito
