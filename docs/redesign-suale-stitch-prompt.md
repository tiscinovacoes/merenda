# Redesign SUALE — Prompt para Antigravity + MCP Stitch

> **Como usar:** no Antigravity, gere **uma tela por vez** com o MCP do Stitch.
> Cole sempre o **Bloco de Estilo Compartilhado** antes do bloco de cada tela.
> Forneça a **logo PREFCG como imagem de referência** para o Stitch calibrar as cores.
> Depois exporte para Figma/código.
>
> Skill de base: `frontend-design` — direção estética intencional, memorabilidade, sistema coeso.

---

## A. Direção de Design (validação)

- **Estética:** *Cívico Ipê* — confiança institucional + orgulho local de Campo Grande ("capital dos ipês").
- **DFII:** Impacto 4 + Fit 5 + Viabilidade 4 + Performance 4 − Risco de consistência 2 = **15/15 (Excellent — Execute fully)**.
- **Âncora de diferenciação:** floração de **ipê-amarelo** como assinatura gráfica (pétalas em headers/divisores e textura sutil atrás dos grandes números). Sem a logo, ainda se reconhece Campo Grande.

## B. Design System

**Cores (CSS vars):**
```
--azul-institucional: #0E3A7E   /* dominante — confiança/governo */
--azul-tinta:         #082554   /* títulos e texto forte */
--amarelo-ipe:        #F7B500   /* ACENTO — números/CTAs de destaque */
--rosa-ipe:           #E5457F   /* dado secundário (gráficos) */
--roxo-ipe:           #7A3E9D   /* dado secundário (gráficos) */
--verde-abastece:     #2E9E5B   /* status OK / abastecido / agricultura familiar */
--papel:              #FAF7F0   /* fundo quente */
--branco:             #FFFFFF
--cinza-texto:        #5B6472   /* texto secundário */
```
**Tipografia:** Display **Bricolage Grotesque** (títulos + números-herói) · Corpo **Public Sans**. *Sem Inter/Roboto/Arial.*

**Ritmo:** grid com assimetria controlada, muito respiro, cards `rounded-2xl`, números gigantes.
**Movimento:** 1 entrada forte na hero + hovers significativos; sem micro-animação decorativa.

## C. Escopo — 5 telas

1. Portal Público — Vitrine de Transparência (stats + busca de cardápio)
2. Cardápio da Escola (detalhe público, mobile-first)
3. Login por Perfil (8 perfis)
4. Dashboard do Gestor (interno, detalhado, "modo apresentação")
5. Admin — Acessos & Log por Perfil

---

## BLOCO DE ESTILO COMPARTILHADO
> Cole antes de CADA tela.

```text
CONTEXTO DO PRODUTO
SUALE — Sistema de Gestão da Alimentação Escolar da SEMED / Prefeitura de Campo Grande-MS.
Web responsivo (desktop e mobile). Público duplo: cidadãos (transparência) e servidores (gestão).

DIREÇÃO ESTÉTICA (nome interno — NUNCA exibir na interface)
Institucional e confiável como um portal de governo, porém memorável, com a identidade de
Campo Grande, a "capital dos ipês". Assinatura visual: pétalas/floração de ipê-amarelo usadas
com moderação em headers e divisores, e como textura sutil atrás dos grandes números.
NÃO usar visual genérico de dashboard de IA. Grid com assimetria controlada, muito respiro.
IMPORTANTE: o nome da direção estética é apenas orientação interna. NÃO renderizar nenhum
selo, badge, chip ou texto "Cívico Ipê" (ou similar) em qualquer tela.

PALETA (hex exatos)
- Azul institucional #0E3A7E (dominante), Azul tinta #082554 (títulos)
- Amarelo-ipê #F7B500 (ACENTO — só nos números/CTAs de destaque)
- Rosa-ipê #E5457F e Roxo-ipê #7A3E9D (gráficos), Verde #2E9E5B (status abastecido / agricultura familiar)
- Fundo papel quente #FAF7F0, branco #FFFFFF, texto secundário #5B6472

TIPOGRAFIA
- Títulos e números-herói: "Bricolage Grotesque" (peso alto)
- Corpo e rótulos: "Public Sans"
- NÃO usar Inter, Roboto, Arial.

COMPONENTES
- Cards arredondados (rounded-2xl), sombra sutil com intenção (não default).
- Números de estatística GIGANTES em Bricolage, com rótulo pequeno em Public Sans.
- Idioma de toda a interface: Português do Brasil.
- Acessível: contraste AA, foco visível, alvos de toque >= 44px.
```

---

## TELA 1 — Portal Público / Vitrine de Transparência

```text
Landing page pública (sem login). De cima para baixo:
1) Topo com brasão da Prefeitura de Campo Grande + "SUALE — Alimentação Escolar" e menu
   simples (Transparência, Cardápios, Sobre, Acesso Restrito).
2) HERO com faixa de floração de ipê ao fundo e um número-herói enorme:
   "[N] escolas atendidas hoje" e subtítulo "alimentação escolar servida com transparência".
3) Faixa de 4 estatísticas em cards: Escolas atendidas, Escolas abastecidas hoje,
   Refeições servidas na semana, Agricultores familiares fornecendo. Números grandes em
   amarelo-ipê, mini gráfico de tendência em cada card.
4) DESTAQUE CÍVICO: card/selo verde "Agricultura Familiar: [X]% das compras" reforçando a
   meta legal mínima de 30% (Lei 11.947/2009) — argumento público de boa gestão.
5) Bloco "Consulte o cardápio da sua escola": campo de busca grande por nome da escola,
   com sugestões, e chips de bairros/regiões.
6) Mapa/grelha de escolas com status de abastecimento (verde = abastecida).
7) Rodapé institucional SEMED.
Tom: orgulho cívico, o gestor "vende o peixe" da gestão. Mobile: hero e stats empilham.
```
> **Placeholders a substituir:** `[N]` escolas atendidas, `[X]%` agricultura familiar, e os 4 números da faixa de stats.

---

## TELA 2 — Cardápio da Escola (detalhe público, mobile-first)

```text
Página do cardápio vigente de UMA escola. De cima para baixo:
1) Cabeçalho com nome da escola, endereço e seletor de semana (Semana vigente / próximas).
2) Cardápio semanal em cartões por dia (Seg a Sex): café, almoço, lanche — com ícones de
   refeição e destaque para itens da agricultura familiar (selo verde).
3) Aviso de restrições/alergênicos e opção "cardápio adaptado".
4) Botão "Baixar cardápio (PDF)" e "Compartilhar".
Layout mobile-first, pétalas de ipê como divisor entre os dias. Legível e leve.
```

---

## TELA 3 — Login por Perfil

```text
Tela de acesso restrito. Coluna esquerda: identidade visual com arte de ipê (sem texto de badge).
Coluna direita: card de login com campos CPF/Matrícula Funcional e senha, e uma grade de 7 perfis
selecionáveis, cada um com ícone próprio:
1) Gestor SEMED  2) Nutricionista  3) Escola  4) Colaboradores  5) Estoque Central
6) Motorista  7) Compras & Contratos
- NÃO incluir perfil "Admin" — a administração (usuários/acessos + log) fica dentro do perfil Gestor.
- Ao selecionar "Colaboradores", exibir um sub-seletor (toggle) "Cooperativa" / "Agricultor".
Botão primário azul institucional "Entrar no Sistema". Links "Esqueci minha senha" e "Suporte TI".
Mobile: colapsa em coluna única, arte reduzida no topo.
```

---

## TELA 4 — Dashboard do Gestor (interno, detalhado)

```text
Dashboard pós-login do Gestor SEMED. Layout com sidebar de navegação à esquerda.
Conteúdo:
1) Barra superior com filtros (período, região, escola) e botão "Modo Apresentação"
   (que expande os números para exibição à população/imprensa).
2) Linha de KPIs detalhados: escolas atendidas x meta, % abastecimento, refeições servidas,
   % compras da agricultura familiar (Lei 11.947 — mínimo 30%), incidentes abertos.
3) Gráficos: abastecimento por região (barras rosa/roxo/azul), evolução semanal de refeições
   (linha), ranking de escolas com pendência.
4) Painel lateral de alertas/ocorrências recentes vindas dos outros perfis.
Denso porém organizado, hierarquia clara, amarelo-ipê só nos destaques.
```

---

## TELA 5 — Acessos & Log por Perfil (dentro do perfil Gestor)

> Não é um perfil de login separado. É uma área administrativa acessada pelo Gestor SEMED.

```text
Tela administrativa (acessada pelo Gestor). Sidebar + conteúdo:
1) Aba superior: "Usuários & Acessos" | "Log de Atividade".
2) Aba Usuários: tabela de usuários (nome, login, perfil, cargo, status ativo/inativo,
   criado em) com filtro por perfil e botão "Novo usuário". Ações editar/desativar.
3) Aba Log de Atividade: TIMELINE filtrável POR PERFIL — cada evento mostra perfil (badge
   colorido por perfil), usuário, ação, tela e horário. Filtros por perfil, data e tipo de
   ação. Ex.: "Nutricionista publicou cardápio da Semana 12", "Escola confirmou recebimento".
Visual sóbrio, tabelas legíveis, badges de perfil com cores distintas.
```

---

## Perfis de login (referência)
`gestor` · `nutricionista` · `escola` · `colaboradores` (→ cooperativa / agricultor) · `estoque` · `motorista` · `compras`
> Sem perfil `admin` separado — administração (usuários/acessos + log) fica dentro do perfil `gestor`.

## Checklist pós-geração
- [ ] Substituir placeholders `[N]` / `[X]%` pelos números reais da rede.
- [ ] Rodar auditoria de acessibilidade (skill `ui-a11y`) antes do handoff.
- [ ] Validar contraste do amarelo-ipê sobre fundo claro (usar só em blocos grandes / com texto tinta).
