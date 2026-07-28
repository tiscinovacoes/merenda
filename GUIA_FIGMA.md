# 🎨 Guia: Importar SUALE para o Figma

## Método 1: Plugin html.to.design (RECOMENDADO) ⭐

Este plugin converte HTML renderizado em **layers vetoriais editáveis** no Figma.

### Passo a Passo:

1. **Instalar o Plugin no Figma:**
   - Abra o Figma → Community → Pesquisar: **"html.to.design"**
   - Ou acesse: https://www.figma.com/community/plugin/1159123024924461424
   - Clique "Install"

2. **Iniciar o Servidor Local:**
   - Abra o terminal no Windows (PowerShell)
   - Execute:
   ```powershell
   cd "C:\Users\lucareis\OneDrive\vigia educa\prototype"
   python -m http.server 8080
   ```

3. **Abrir o Protótipo no Chrome:**
   - Navegue para: `http://localhost:8080/index.html`
   - Selecione o perfil desejado (ex: Gestor SEMED)
   - Clique "Entrar no Sistema"
   - Navegue até a tela que quer capturar

4. **Importar no Figma:**
   - No Figma, crie um novo arquivo
   - Abra o plugin: Menu → Plugins → html.to.design
   - Cole a URL: `http://localhost:8080/index.html`
   - Clique "Import"
   - O plugin vai converter toda a página em layers editáveis!

5. **Repetir para cada tela:**
   - No Chrome, navegue para a próxima tela
   - No Figma, rode o plugin novamente com a mesma URL
   - Organize cada importação em uma Page ou Frame diferente

### Dica: Estrutura recomendada no Figma
```
📄 Page 1: Login
📄 Page 2: Gestor SEMED
   - Frame: Dashboard Executivo
   - Frame: Escolas
   - Frame: Atas e Contratos
   - Frame: Pedidos
   - Frame: Cooperativas
   - Frame: Agricultura Familiar
   - Frame: Estoque Consolidado
   - Frame: Planejamento Alimentar
   - Frame: Relatórios
   - Frame: IA de Previsão
📄 Page 3: Nutricionista
   - Frame: Dashboard Nutricional
   - Frame: Fichas Técnicas
   - Frame: Produtos
   - Frame: Cardápios
   - Frame: Planejamento
   - Frame: Escolas
   - Frame: Consumo
   - Frame: Desperdícios
   - Frame: Simulações
   - Frame: IA
📄 Page 4: Escola
   - Frame: Dashboard
   - Frame: Planejamento
   - Frame: Cardápios
   - Frame: Estoque
   - Frame: Consumo
   - Frame: Pedidos
   - Frame: Entregas
   - Frame: Histórico
   - Frame: Relatórios
📄 Page 5: Cooperativa
   - Frame: Dashboard
   - Frame: Agricultores
   - Frame: Produtos
   - Frame: Estoque
   - Frame: Pedidos
   - Frame: Planejamento
   - Frame: Rotas
   - Frame: Contratos
   - Frame: Entregas
   - Frame: Relatórios
   - Frame: Indicadores
📄 Page 6: Agricultor
   - Frame: Dashboard
   - Frame: Produção
   - Frame: Estoque
   - Frame: Pedidos
   - Frame: Entregas
   - Frame: Calendário
   - Frame: Relatórios
   - Frame: Perfil
```

---

## Método 2: Screenshots (JÁ CAPTURADOS)

34 screenshots já estão na pasta:
```
C:\Users\lucareis\OneDrive\vigia educa\figma-screens\
```

### Importar no Figma:
1. Abra o Figma
2. Selecione todos os PNGs da pasta `figma-screens`
3. Arraste para dentro do Figma
4. Cada imagem vira um Frame
5. Renomeie cada Frame pelo nome da tela
6. Adicione hotspots (Prototype mode) para navegação entre telas

### Screenshots disponíveis:

**Login:**
- login_page

**Gestor SEMED:**
- dashboard_gestor_top
- dashboard_gestor_mid
- dashboard_gestor_bottom
- dashboard_gestor_map_alerts
- escolas_list_top
- atas_contratos
- pedidos_list
- cooperativas_list
- agric_familiar_list
- estoque_consolidado
- planejamento_alimentar
- relatorios
- ia_previsao_top
- ia_previsao_mid
- ia_previsao_bottom

**Nutricionista:**
- dashboard_nutri_top
- nutri_fichas
- nutri_produtos
- nutri_cardapios
- nutri_planejamento
- nutri_escolas
- nutri_consumo
- nutri_desperdicios
- nutri_simulacoes
- nutri_ia

**Escola:**
- escola_dashboard
- escola_planejamento
- escola_cardapios
- escola_estoque
- escola_consumo
- escola_pedidos

---

## Método 3: Reconstruir no Figma (Design Tokens)

Use estes tokens do CSS para recriar componentes no Figma:

### Cores Primárias
| Token | Valor | Uso |
|-------|-------|-----|
| Primary | #1565C0 | Botões, sidebar, ações |
| Primary Dark | #0D47A1 | Sidebar background |
| Primary Light | #E3F2FD | Backgrounds claros |
| Accent | #00897B | Indicadores positivos |

### Cores de Status
| Token | Valor | Uso |
|-------|-------|-----|
| Success | #2E7D32 | Abastecida, Entregue |
| Warning | #F57F17 | Alerta, Em separação |
| Danger | #C62828 | Crítica, Vencido |
| Info | #0277BD | Informações |

### Tipografia
| Elemento | Fonte | Peso | Tamanho |
|----------|-------|------|---------|
| Títulos | Inter | 700 | 24px |
| Subtítulos | Inter | 600 | 18px |
| Corpo | Inter | 400 | 14px |
| Labels | Inter | 500 | 12px |

### Espaçamentos
| Token | Valor |
|-------|-------|
| --spacing-xs | 4px |
| --spacing-sm | 8px |
| --spacing-md | 16px |
| --spacing-lg | 24px |
| --spacing-xl | 32px |
| --spacing-2xl | 48px |

### Bordas
| Token | Valor |
|-------|-------|
| Border radius | 12px |
| Card shadow | 0 1px 3px rgba(0,0,0,0.08) |
| Card hover | 0 4px 12px rgba(0,0,0,0.08) |
| Border color | #E2E8F0 |

---

## Navegação no Prototype Mode

Após importar as telas, configure a navegação:

1. No Figma, alterne para **Prototype** (painel direito)
2. Em cada item do menu lateral, adicione um **Interaction**:
   - Trigger: On Click
   - Action: Navigate To
   - Destination: Frame da tela correspondente
   - Animation: Smart Animate (300ms, Ease Out)
3. Teste com **Present** (▶️)

---

## Checklist de Importação

- [ ] Instalar plugin html.to.design
- [ ] Importar tela de Login
- [ ] Importar 10 telas do Gestor
- [ ] Importar 10 telas da Nutricionista
- [ ] Importar 9 telas da Escola
- [ ] Importar 11 telas da Cooperativa
- [ ] Importar 8 telas do Agricultor
- [ ] Configurar navegação no Prototype mode
- [ ] Testar com Present mode
