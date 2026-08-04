# Análise Completa — Cheff Escolar (Digix)
> Benchmark para clonagem/superação pelo SUALE — 20/07/2026
> Fonte: https://cheffescolar.com.br/ (site institucional + blog)

## 1. Visão geral

- **Produto:** Cheff Escolar — SaaS de gestão do PNAE para Secretarias de Educação.
- **Empresa:** Digix (20+ anos em software para gestão pública, sede em MS).
- **Posicionamento:** "Único software do Brasil que simplifica a gestão do PNAE".
- **Modelo comercial:** B2G — venda direta à Secretaria via demonstração agendada (não há preço público, self-service ou trial).
- **Case âncora:** Governo de Mato Grosso do Sul (SED-MS) — "escolas triplicaram o consumo de produtos da agricultura familiar".
- **Site:** WordPress + Elementor (institucional apenas; o sistema em si não é acessível publicamente).

## 2. Personas atendidas (imagens da página /educacao/)

1. **Secretários de Educação** — visão macro, indicadores, proteção jurídica
2. **RTs / Nutricionistas** — elaboração de cardápios
3. **Setor de Orçamento** — distribuição de recursos
4. **Setor de Prestação de Contas** — financeiro
5. **Setor Jurídico** — conformidade com processos aquisitivos
6. **Diretores de escola**
7. **Merendeiras**
8. **Comunidade** (beneficiário indireto): agricultura familiar, transparência, hábitos saudáveis

## 3. Módulos funcionais declarados

| # | Módulo | O que faz |
|---|--------|-----------|
| 1 | **Distribuição de recursos** | Repasse e controle dos recursos PNAE por escola/unidade |
| 2 | **Planejamento de cardápio** | Elaboração pelos RTs (nutricionistas), conforme normas do FNDE |
| 3 | **Lista de compras** | Gerada a partir dos cardápios planejados |
| 4 | **Licitações** | Suporte a diferentes processos aquisitivos públicos (licitação, chamada pública, dispensa) |
| 5 | **Agricultura Familiar** | Controle do mínimo de 30% obrigatório + chamadas públicas |
| 6 | **Prestação de contas** | Financeira, automatizada, orientada ao FNDE/CAE |
| 7 | **Gestão de dados e transparência** | Dashboards, relatórios, dados públicos |
| 8 | **Integrações** | Ex.: **SERPRO** — leitura automática de NF-e e vínculo entre itens de contrato e itens adquiridos |

### Fluxo fim-a-fim que o produto cobre (ciclo do PNAE)
```
Recurso FNDE → Distribuição → Cardápio (RT) → Lista de compras
→ Processo aquisitivo (licitação/chamada pública AF) → Contrato
→ Compra/NF-e (integração SERPRO) → Execução nas escolas
→ Prestação de contas → Transparência
```

## 4. Mensagens de marketing (copy a espelhar/superar)

- "Simplifique as etapas do PNAE, desde a elaboração dos cardápios até a prestação de contas, em um único sistema."
- "Mais agilidade, eficiência e segurança no uso dos recursos da alimentação escolar."
- "Tudo de forma automatizada, transparente e eficiente."
- "Todos ganham com o Cheff Escolar" (Secretaria → estudantes).
- Tese central do blog: **transparência protege o gestor público** (medo de TCU/MP é o gatilho de compra); **gestão descentralizada com controle**; **agricultura familiar além do percentual obrigatório**.

## 5. Estrutura do site (para clonar o institucional)

```
/                          Home (hero + beneficiados + case + depoimentos + blog + CTA)
/sobre-o-cheff-escolar/    Produto: módulos, integrações, case
/educacao/                 Beneficiados: Secretaria (7 personas com cards)
/comunidade/               Beneficiados: sociedade/agricultura familiar
/blog/                     12+ páginas de artigos SEO sobre PNAE
```
- CTA único em todo o site: **"Agendar demonstração"** (popup Elementor com formulário).
- Newsletter (nome + e-mail) no rodapé do blog.
- Redes: Instagram, Facebook, YouTube, LinkedIn (@cheffescolar).
- Rodapé: Política de Privacidade, Cookies, Códigos de ética (LGPD/compliance — importante para vender a governo).
- SEO: blog ativo com pauta PNAE (2-4 artigos/mês, autoria "Digix"), imagens .avif, categorias "Alimentação escolar" e "Gestão da alimentação escolar".

## 6. O que o site NÃO revela (lacunas de informação)

- Preço, modelo de cobrança (por aluno? por escola? por rede?)
- Telas do sistema (só um mock "tela.png" na home)
- App mobile (nenhuma menção)
- Gestão de **estoque físico** nas escolas (não aparece como módulo)
- Controle de recebimento de mercadorias na unidade escolar
- Testes de aceitabilidade / desperdício / execução do cardápio na ponta

## 7. Blueprint de clonagem para o SUALE

### 7.1 Paridade de funcionalidades (mínimo p/ competir)
- [ ] Distribuição de recursos por escola (per capita × dias letivos × modalidade — já temos planilhas de referência no repo)
- [ ] Cardápios pelo RT com fichas técnicas e cálculo nutricional (referência FNDE)
- [ ] Lista de compras automática a partir do cardápio (consolidada por rede e por escola)
- [ ] Módulo de aquisições: licitação + **chamada pública da agricultura familiar** com controle dos 30%
- [ ] Contratos e vínculo item-contrato ↔ item-NF (a integração SERPRO é o diferencial técnico deles — avaliar API NF-e/SEFAZ)
- [ ] Prestação de contas no formato FNDE/CAE
- [ ] Dashboard de transparência (argumento "protege o gestor")

### 7.2 Diferenciais do SUALE (onde superamos, não só clonamos)
- **Estoque na escola**: entrada/saída, validade, lote — módulo que o Cheff Escolar não anuncia (SUALE já tem perfis Diretor e Resp. Estoque nas 8 escolas piloto)
- **Operação na ponta**: recebimento conferido pela escola, consumo diário, desperdício
- **Mobile-first** para merendeira/estoquista
- **Fluxo de baixo para cima**: dados reais da escola alimentando a prestação de contas (eles fazem só de cima para baixo)

### 7.3 Clonagem do go-to-market
- Site institucional com mesma arquitetura (Home / Produto / Beneficiados por persona / Blog / CTA "Agendar demonstração")
- Blog SEO com as mesmas pautas: transparência, agricultura familiar, prestação de contas, gestão descentralizada, PNAE na prática
- Case de sucesso com métricas (usar o piloto das 8 escolas como case inicial)
- Depoimentos em vídeo de nutricionista da rede + especialista
- Compliance visível: LGPD, políticas, código de ética (requisito de venda B2G)

## 8. Riscos/observações
- "Único software do Brasil" é claim de marketing — existem outros players (ex.: soluções municipais, NutriUNIFESP, sistemas próprios de estados).
- A força deles é o relacionamento Digix-governo e o case SED-MS; a fraqueza é a ausência (aparente) de operação na escola — exatamente o território do SUALE.
