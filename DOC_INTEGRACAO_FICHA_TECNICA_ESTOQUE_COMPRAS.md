# Vigia Educa / SUALE — Integração Ficha Técnica → Estoque Central & Compras

## 🎯 Objetivo e Contexto
Automatizar o dimensionamento da demanda nutricional da rede escolar de Campo Grande ao publicar cardápios na plataforma SUALE / Vigia Educa.
O fluxo conecta a formulação nutricional (per capita dos alimentos nas Fichas Técnicas) com a disponibilidade física do Centro de Distribuição / Estoque Central (CD) e emite ordens de compra automáticas para o setor de Compras & Contratos.

---

## ⚙️ Regra de Negócio & Arquitetura de Dados

### 1. Cálculo de Demanda Total
- **Entradas:** Fichas técnicas dos pratos do cardápio, total de alunos das escolas vinculadas (`DATA.schools`), número de semanas letivas do período e fator de não fracionamento.
- **Fórmula:** 
  $$\text{Demanda Total (kg/L)} = \sum (\text{Per Capita} \times \text{Alunos} \times \text{Dias de Atendimento}) \times \text{Fator Não Fracionamento}$$

### 2. Confronto com o Estoque Central (CD)
- **Consulta:** Saldo disponível do produto em `SharedState.getCentralStock()`.
- **Casos:**
  - $\text{Saldo CD} \ge \text{Demanda}$: Atendimento 100% via estoque próprio. Saldo reservado para expedição FEFO e montagem de carga às escolas. Não emite compra.
  - $\text{Saldo CD} < \text{Demanda}$: Atendimento parcial. O saldo em estoque é reservado e a diferença $(\text{Demanda} - \text{Saldo CD})$ é convertida em demanda de compra.
  - $\text{Saldo CD} = 0$: Demanda 100% convertida em necessidade de compra.

### 3. Emissão da Ordem de Serviço de Compra (OSC)
- Ao confirmar a publicação do cardápio no modal, a engine aciona:
  ```javascript
  SharedState.comprasEmitirOsCompra({
    origem: 'nutricao',
    solicitante: 'Dra. Lilian Droppa (Nutricionista SEMED)',
    cardapioId: menu.id,
    periodo: menu.periodo,
    itens: itensParaCompra
  });
  ```
- Gera uma OS numerada (`OSC-2026/XXXX`) com status `'emitida'`, visível no módulo `js/modules/compras.js` do setor de Compras & Contratos.
- O cardápio publicado ganha o badge interativo `🛒 OSC-2026/XXXX`, permitindo à Nutricionista auditar a tramitação da compra com 1 clique.

---

## 🖥️ Componentes de Interface (UI)
1. **Botão 📦 Suprimentos:** Presente na tabela de gestão de cardápios para consulta prévia do dimensionamento.
2. **Modal de Diagnóstico (`#modal-dimensionamento-cardapio`):**
   - 4 KPIs principais: Insumos da Ficha Técnica, Cobertos pelo Estoque CD, Demanda de Compra (OSC) e Estimativa em Atas Vigentes.
   - Diagnóstico descritivo do atendimento.
   - Tabela analítica com demanda, saldo do CD, quantidade atendida, quantidade a comprar, fornecedor da ata e badges explicativos (`✓ Coberto`, `⚠️ Parcial`, `🛒 Comprar`, `🌾 AF`, `🛡️ Dieta Especial`).
   - Botão de confirmação de publicação com disparo de suprimentos.

---

## 🧪 Cobertura de Testes Automatizados
- **Teste Unitário/Integração:** `tests/nutricionista.spec.js`
  - Cobre abertura e fechamento do modal de suprimentos.
  - Cobre a confirmação de publicação e a emissão automática de OS no `SharedState`.
- **Smoke Test:** `tests/smoke-renderers.spec.js` (134 telas testadas com 0 falhas).

---
*Documento gerado em 10/09/2026 — Versão em Produção na branch master.*
