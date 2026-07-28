# 🍽️ SUALE — Sistema de Gestão da Alimentação Escolar

**SEMED · Campo Grande · MS**

Protótipo navegável de alta fidelidade com testes automatizados via Playwright.

---

## 🚀 Quick Start

### Pré-requisitos
- [Node.js 18+](https://nodejs.org/)

### Instalação
```bash
# Clone ou copie o projeto
cd "F:\Projetos\vigia educa"

# Instale dependências
npm install

# Instale o browser de teste
npx playwright install chromium
```

### Rodar o protótipo
```bash
npx serve prototype -l 8080
# Abra http://localhost:8080 no navegador
```

### Rodar testes
```bash
# Suite completo (72 testes)
npm test

# Com browser visível
npm run test:headed

# Interface visual de testes
npm run test:ui

# Por perfil
npm run test:gestor
npm run test:nutricionista
npm run test:escola
npm run test:cooperativa
npm run test:agricultor

# Capturar screenshots para Figma
npm run test:screenshots

# Ver relatório HTML
npm run report
```

---

## 📁 Estrutura do Projeto

```
vigia educa/
├── prototype/               ← Código-fonte do protótipo
│   ├── index.html           ← Shell HTML (login + app)
│   ├── styles.css           ← Design system completo
│   └── app.js               ← SPA engine (48 telas)
│
├── tests/                   ← Testes Playwright
│   ├── helpers.js           ← Funções reutilizáveis
│   ├── login.spec.js        ← Login & autenticação (9 testes)
│   ├── gestor.spec.js       ← Perfil Gestor SEMED (15 testes)
│   ├── nutricionista.spec.js← Perfil Nutricionista (11 testes)
│   ├── escola.spec.js       ← Perfil Escola (10 testes)
│   ├── cooperativa.spec.js  ← Perfil Cooperativa (12 testes)
│   ├── agricultor.spec.js   ← Perfil Agricultor (9 testes)
│   └── capture-all-screens.spec.js ← Captura screenshots Figma
│
├── figma-screens/           ← Screenshots para importar no Figma
├── screenshots/             ← Screenshots gerados pelos testes
│
├── package.json             ← Dependências e scripts npm
├── playwright.config.js     ← Config Playwright (auto-serve)
├── GUIA_FIGMA.md            ← Guia de importação no Figma
└── README.md                ← Este arquivo
```

---

## 🧪 Cobertura de Testes

| Perfil | Telas | Testes | Cobre |
|--------|-------|--------|-------|
| Login | 1 | 9 | Branding, seleção de perfil, autenticação, logout, troca de perfil |
| Gestor SEMED | 10 | 15 | Dashboard, KPIs, gráficos, mapa SVG, escolas, atas, pedidos, cooperativas, agricultura, estoque, planejamento, relatórios, IA, simulador |
| Nutricionista | 11 | 11 | Dashboard, fichas técnicas, produtos, cardápios, planejamento, escolas, consumo, desperdícios, simulações, IA |
| Escola | 9 | 10 | Dashboard, planejamento, cardápios, estoque, consumo, pedidos, entregas, histórico, relatórios |
| Cooperativa | 11 | 12 | Dashboard, agricultores, produtos, estoque, pedidos, planejamento, rotas, contratos, entregas, relatórios, indicadores |
| Agricultor | 8 | 9 | Dashboard, produção, estoque, pedidos, entregas, calendário, relatórios, perfil |
| **Screenshots** | 49 | 6 | Captura automática de TODAS as telas para Figma |
| **Total** | **49** | **72** | **100% cobertura** |

---

## 🎨 Design System

| Token | Valor | Uso |
|-------|-------|-----|
| Primary | `#1565C0` | Botões, sidebar, ações |
| Primary Dark | `#0D47A1` | Sidebar background |
| Success | `#2E7D32` | Status positivo |
| Warning | `#F57F17` | Alertas |
| Danger | `#C62828` | Erros críticos |
| Fonte | `Inter` | Tipografia completa |
| Border Radius | `12px` | Componentes |

---

## 📋 Perfis Disponíveis

1. **Gestor SEMED** — Dashboard executivo, monitoramento de escolas, atas, pedidos, cooperativas, IA
2. **Nutricionista** — Fichas técnicas, cardápios, consumo, desperdícios, simulações
3. **Escola** — Planejamento alimentar, estoque, registro de consumo, pedidos, entregas
4. **Cooperativa** — Gestão de agricultores, rotas, contratos, entregas, indicadores
5. **Agricultor** — Produção, estoque, pedidos, calendário de entregas, perfil

---

## 📦 Tecnologias

- HTML5 / CSS3 / Vanilla JS (sem framework)
- Chart.js 4.4 (gráficos)
- Google Fonts (Inter)
- Playwright (testes E2E)
- Serve (servidor local)
