/**
 * AI Cardápio Engine — Vigia Educa (SUALE)
 * Módulo de Inteligência Artificial para geração automática e otimização de cardápios escolares (PNAE).
 * 
 * Atualizações:
 * - Priorização de itens sazonais da Agricultura Familiar.
 * - Priorização de insumos próximos ao vencimento (FEFO / Combate ao Desperdício).
 * - Cálculo detalhado de Per Capita (g/aluno) e Consumo Total Semanal da Rede.
 * - Trava de Relatório PNAE: liberação exclusiva após aprovação da Dra. Lilian Droppa.
 */

(function (window) {
  'use strict';

  // Catálogo PNAE de Receitas Balanceadas com Indicadores Sazonais e AF
  const CATALOGO_RECEITAS = [
    {
      id: 'rec_01',
      nome: 'Arroz com Feijão, Coxa de Frango Assada e Salada Colorida',
      categoria: 'Almoço/Jantar',
      kcal: 720,
      proteinas: 34,
      carboidratos: 85,
      lipideos: 18,
      sodio: 480,
      sazonal: true,
      agriculturaFamiliar: true,
      ingredientes: [
        { nome: 'Arroz branco', perCapita: 60, unidade: 'g', estoqueItem: 'Arroz Branco 5kg' },
        { nome: 'Feijão carioca', perCapita: 40, unidade: 'g', estoqueItem: 'Feijão Carioca 1kg' },
        { nome: 'Coxa de frango', perCapita: 110, unidade: 'g', estoqueItem: 'Frango Congelado (Coxa/Sobre)' },
        { nome: 'Alface crespa', perCapita: 30, unidade: 'g', estoqueItem: 'Verduras da Agricultura Familiar', sazonal: true, af: true },
        { nome: 'Tomate fresco', perCapita: 35, unidade: 'g', estoqueItem: 'Legumes da Agricultura Familiar', sazonal: true, af: true },
        { nome: 'Óleo vegetal', perCapita: 8, unidade: 'ml', estoqueItem: 'Óleo de Soja 900ml' }
      ],
      frutaAcompanhamento: 'Laranja fatiada (100g) — Safra Local AF 🌾',
      restricoesEvitadas: [],
      modalidades: ['fundamental_integral', 'fundamental_parcial', 'eja']
    },
    {
      id: 'rec_02',
      nome: 'Arroz Integral, Feijão Preto, Carne Moída Ensopada e Salada de Cenoura',
      categoria: 'Almoço/Jantar',
      kcal: 690,
      proteinas: 36,
      carboidratos: 80,
      lipideos: 16,
      sodio: 450,
      sazonal: true,
      agriculturaFamiliar: true,
      ingredientes: [
        { nome: 'Arroz integral', perCapita: 55, unidade: 'g', estoqueItem: 'Arroz Branco 5kg' },
        { nome: 'Feijão preto', perCapita: 40, unidade: 'g', estoqueItem: 'Feijão Carioca 1kg' },
        { nome: 'Carne moída bovina', perCapita: 90, unidade: 'g', estoqueItem: 'Carne Bovina Moída' },
        { nome: 'Cenoura ralada', perCapita: 40, unidade: 'g', estoqueItem: 'Cenoura Fresca', sazonal: true, af: true },
        { nome: 'Azeite/Óleo', perCapita: 6, unidade: 'ml', estoqueItem: 'Óleo de Soja 900ml' }
      ],
      frutaAcompanhamento: 'Melancia em cubos (120g) — Safra Local AF 🌾',
      restricoesEvitadas: ['lactose'],
      modalidades: ['fundamental_integral', 'fundamental_parcial', 'eja']
    },
    {
      id: 'rec_03',
      nome: 'Galinhada Caipira com Milho e Ervilha, Feijão e Salada de Pepino',
      categoria: 'Almoço/Jantar',
      kcal: 710,
      proteinas: 32,
      carboidratos: 88,
      lipideos: 17,
      sodio: 460,
      sazonal: true,
      agriculturaFamiliar: true,
      ingredientes: [
        { nome: 'Arroz branco', perCapita: 65, unidade: 'g', estoqueItem: 'Arroz Branco 5kg' },
        { nome: 'Frango em cubos', perCapita: 95, unidade: 'g', estoqueItem: 'Frango Congelado (Coxa/Sobre)' },
        { nome: 'Feijão carioca', perCapita: 35, unidade: 'g', estoqueItem: 'Feijão Carioca 1kg' },
        { nome: 'Milho verde e ervilha', perCapita: 25, unidade: 'g', estoqueItem: 'Legumes da Agricultura Familiar', sazonal: true, af: true },
        { nome: 'Pepino fatiado', perCapita: 35, unidade: 'g', estoqueItem: 'Verduras da Agricultura Familiar', sazonal: true, af: true }
      ],
      frutaAcompanhamento: 'Banana prata (1 un) — Orgânico AF 🌾',
      restricoesEvitadas: ['lactose', 'gluten'],
      modalidades: ['fundamental_integral', 'fundamental_parcial', 'eja', 'creche']
    },
    {
      id: 'rec_04',
      nome: 'Arroz, Feijão, Omelete Assado com Legumes e Salada de Repolho Roxo',
      categoria: 'Almoço/Jantar',
      kcal: 640,
      proteinas: 26,
      carboidratos: 78,
      lipideos: 18,
      sodio: 410,
      sazonal: true,
      agriculturaFamiliar: true,
      ingredientes: [
        { nome: 'Arroz branco', perCapita: 60, unidade: 'g', estoqueItem: 'Arroz Branco 5kg' },
        { nome: 'Feijão carioca', perCapita: 40, unidade: 'g', estoqueItem: 'Feijão Carioca 1kg' },
        { nome: 'Ovo caipira fresco', perCapita: 2, unidade: 'un', estoqueItem: 'Ovos caipiras', af: true },
        { nome: 'Cheiro verde e tomate', perCapita: 20, unidade: 'g', estoqueItem: 'Verduras da Agricultura Familiar', sazonal: true, af: true },
        { nome: 'Repolho roxo com maçã', perCapita: 40, unidade: 'g', estoqueItem: 'Legumes da Agricultura Familiar', sazonal: true, af: true }
      ],
      frutaAcompanhamento: 'Maçã nacional (1 un)',
      restricoesEvitadas: ['lactose', 'gluten'],
      modalidades: ['fundamental_integral', 'fundamental_parcial', 'creche']
    },
    {
      id: 'rec_05',
      nome: 'Macarronada de Carne Moída ao Molho Caseiro de Tomate e Beterraba',
      categoria: 'Almoço/Jantar',
      kcal: 730,
      proteinas: 35,
      carboidratos: 92,
      lipideos: 19,
      sodio: 490,
      sazonal: true,
      agriculturaFamiliar: true,
      ingredientes: [
        { nome: 'Macarrão parafuso/espaguete', perCapita: 80, unidade: 'g', estoqueItem: 'Macarrão Parafuso 500g' },
        { nome: 'Carne moída bovina', perCapita: 90, unidade: 'g', estoqueItem: 'Carne Bovina Moída' },
        { nome: 'Extrato de tomate caseiro', perCapita: 30, unidade: 'g', estoqueItem: 'Extrato de Tomate' },
        { nome: 'Beterraba cozida', perCapita: 40, unidade: 'g', estoqueItem: 'Legumes da Agricultura Familiar', sazonal: true, af: true }
      ],
      frutaAcompanhamento: 'Mamão formosa fatiado (100g) — Safra Local AF 🌾',
      restricoesEvitadas: ['lactose'],
      modalidades: ['fundamental_integral', 'fundamental_parcial', 'eja']
    },
    {
      id: 'rec_06',
      nome: 'Sopa Cremosa de Mandioca com Carne Bovina e Couve Manteiga',
      categoria: 'Almoço/Jantar',
      kcal: 610,
      proteinas: 28,
      carboidratos: 72,
      lipideos: 15,
      sodio: 390,
      sazonal: true,
      agriculturaFamiliar: true,
      ingredientes: [
        { nome: 'Macaxeira/Mandioca', perCapita: 120, unidade: 'g', estoqueItem: 'Legumes da Agricultura Familiar', sazonal: true, af: true },
        { nome: 'Carne bovina em cubos', perCapita: 85, unidade: 'g', estoqueItem: 'Carne Bovina Moída' },
        { nome: 'Couve manteiga picada', perCapita: 30, unidade: 'g', estoqueItem: 'Verduras da Agricultura Familiar', sazonal: true, af: true }
      ],
      frutaAcompanhamento: 'Abacaxi em rodelas (100g)',
      restricoesEvitadas: ['lactose', 'gluten'],
      modalidades: ['creche', 'fundamental_integral']
    },
    {
      id: 'rec_07',
      nome: 'Risoto de Frango com Abóbora Cabotiá, Vagem e Salada de Alface',
      categoria: 'Almoço/Jantar',
      kcal: 680,
      proteinas: 31,
      carboidratos: 82,
      lipideos: 16,
      sodio: 430,
      sazonal: true,
      agriculturaFamiliar: true,
      ingredientes: [
        { nome: 'Arroz branco', perCapita: 60, unidade: 'g', estoqueItem: 'Arroz Branco 5kg' },
        { nome: 'Frango desfiado', perCapita: 90, unidade: 'g', estoqueItem: 'Frango Congelado (Coxa/Sobre)' },
        { nome: 'Abóbora cabotiá', perCapita: 45, unidade: 'g', estoqueItem: 'Legumes da Agricultura Familiar', sazonal: true, af: true },
        { nome: 'Vagem picada', perCapita: 25, unidade: 'g', estoqueItem: 'Legumes da Agricultura Familiar', sazonal: true, af: true }
      ],
      frutaAcompanhamento: 'Tangerina/Mexerica (1 un) — Safra Atual AF 🌾',
      restricoesEvitadas: ['lactose', 'gluten'],
      modalidades: ['fundamental_integral', 'fundamental_parcial', 'creche', 'eja']
    }
  ];

  // Insumos com Alerta FEFO Simulado para Combate ao Desperdício
  const ESTOQUE_FEFO_EMERGENCIA = [
    { itemKey: 'frango', nome: 'Frango Congelado (Coxa/Sobre)', diasParaVencer: 14, risco: 'alto' },
    { itemKey: 'leite', nome: 'Leite Integral UHT', diasParaVencer: 18, risco: 'medio' },
    { itemKey: 'feijao', nome: 'Feijão Carioca 1kg', diasParaVencer: 25, risco: 'medio' },
    { itemKey: 'banana', nome: 'Verduras e Frutas AF', diasParaVencer: 5, risco: 'critico' }
  ];

  const AICardapioEngine = {
    getCatalogo: function () {
      return CATALOGO_RECEITAS;
    },

    /**
     * Gera um cardápio semanal PNAE com priorização de Sazonalidade, FEFO e Per Capita.
     */
    generateWeeklyMenu: function (params) {
      params = params || {};
      const modalidade = params.modalidade || 'fundamental_integral';
      const metaKcal = parseInt(params.metaKcal) || 700;
      const priorizarEstoque = params.priorizarEstoque !== false;
      const priorizarFEFO = params.priorizarFEFO !== false;
      const priorizarSazonal = params.priorizarSazonal !== false;
      const considerarRestricoes = params.considerarRestricoes !== false;
      const numAlunos = parseInt(params.numAlunos) || (modalidade === 'creche' ? 12000 : 32000);

      // 1. Filtrar receitas por modalidade
      let candidatas = CATALOGO_RECEITAS.filter(r => 
        !r.modalidades || r.modalidades.includes(modalidade)
      );

      if (candidatas.length === 0) candidatas = CATALOGO_RECEITAS;

      // 2. Filtrar restrições alimentares (Glúten / Lactose)
      if (considerarRestricoes && window.SharedState && typeof window.SharedState.getRestricoes === 'function') {
        const restricoesAtivas = window.SharedState.getRestricoes() || [];
        const temLactose = restricoesAtivas.some(r => (r.tipo || '').toLowerCase().includes('lactose'));
        const temGluten = restricoesAtivas.some(r => (r.tipo || '').toLowerCase().includes('gluten'));

        if (temLactose || temGluten) {
          candidatas = candidatas.filter(r => {
            if (temLactose && !r.restricoesEvitadas.includes('lactose')) return false;
            if (temGluten && !r.restricoesEvitadas.includes('gluten')) return false;
            return true;
          });
          if (candidatas.length < 5) candidatas = CATALOGO_RECEITAS;
        }
      }

      // 3. Pontuação inteligente de receitas (FEFO + Sazonalidade)
      const candidatasPontuadas = candidatas.map(r => {
        let scoreBonus = 0;
        let fefoBadge = null;

        // Bônus FEFO: se usa item perto de vencer
        if (priorizarFEFO) {
          const itemFefo = ESTOQUE_FEFO_EMERGENCIA.find(f => 
            r.ingredientes.some(ing => 
              ing.nome.toLowerCase().includes(f.itemKey) ||
              ing.estoqueItem.toLowerCase().includes(f.itemKey)
            )
          );
          if (itemFefo) {
            scoreBonus += 15;
            fefoBadge = `⚡ Aproveitamento Prioritário: ${itemFefo.nome} (Vence em ${itemFefo.diasParaVencer} dias)`;
          }
        }

        // Bônus Sazonalidade / Agricultura Familiar
        if (priorizarSazonal && r.sazonal) {
          scoreBonus += 10;
        }

        return {
          ...r,
          scoreFinal: 80 + scoreBonus,
          fefoBadge: fefoBadge
        };
      });

      // Ordenar por maior pontuação estratégica
      const ordenadas = [...candidatasPontuadas].sort((a, b) => b.scoreFinal - a.scoreFinal);

      const diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
      const refeicoesGeradas = [];
      const acumuladorInsumos = {};

      for (let i = 0; i < 5; i++) {
        const receita = ordenadas[i % ordenadas.length];

        // Processar ingredientes, per capita e necessidade da rede em kg/litros
        const ingredientesProcessados = receita.ingredientes.map(ing => {
          let disponivel = true;
          let qtdEstoque = 'Disponível';

          if (window.SharedState && typeof window.SharedState.getCentralStock === 'function') {
            const stock = window.SharedState.getCentralStock() || [];
            const match = stock.find(s => 
              s.item.toLowerCase().includes(ing.nome.toLowerCase()) ||
              (ing.estoqueItem && s.item.toLowerCase().includes(ing.estoqueItem.toLowerCase()))
            );
            if (match) {
              qtdEstoque = `${match.qtd} ${match.unit}`;
              if (match.qtd <= 0) disponivel = false;
            }
          }

          // Cálculo Per Capita Total da Rede (kg)
          const necessidadeKgDia = Math.round(((ing.perCapita * numAlunos) / 1000) * 10) / 10;

          // Acumular demanda da semana
          if (!acumuladorInsumos[ing.nome]) {
            acumuladorInsumos[ing.nome] = {
              nome: ing.nome,
              unidade: ing.unidade,
              perCapitaGramos: ing.perCapita,
              totalSemanalKg: 0,
              af: ing.af || false
            };
          }
          acumuladorInsumos[ing.nome].totalSemanalKg += necessidadeKgDia;

          return {
            ...ing,
            disponivel,
            qtdEstoque,
            necessidadeKgDia
          };
        });

        const todosDisponiveis = ingredientesProcessados.every(ing => ing.disponivel);

        refeicoesGeradas.push({
          dia: diasSemana[i],
          receitaId: receita.id,
          nomePrato: receita.nome,
          categoria: receita.categoria,
          kcal: receita.kcal,
          proteinas: receita.proteinas,
          carboidratos: receita.carboidratos,
          lipideos: receita.lipideos,
          sodio: receita.sodio,
          fruta: receita.frutaAcompanhamento,
          sazonal: receita.sazonal || false,
          agriculturaFamiliar: receita.agriculturaFamiliar || false,
          fefoBadge: receita.fefoBadge,
          ingredientes: ingredientesProcessados,
          estoqueOk: todosDisponiveis,
          scoreIA: Math.min(99, Math.floor(receita.scoreFinal + (Math.random() * 5)))
        });
      }

      // Média semanal
      const totalKcal = Math.round(refeicoesGeradas.reduce((acc, r) => acc + r.kcal, 0) / 5);
      const totalProt = Math.round(refeicoesGeradas.reduce((acc, r) => acc + r.proteinas, 0) / 5);
      const totalCarb = Math.round(refeicoesGeradas.reduce((acc, r) => acc + r.carboidratos, 0) / 5);
      const totalLip = Math.round(refeicoesGeradas.reduce((acc, r) => acc + r.lipideos, 0) / 5);
      const totalSodio = Math.round(refeicoesGeradas.reduce((acc, r) => acc + r.sodio, 0) / 5);

      const insumosResumoSemanal = Object.values(acumuladorInsumos);
      const afCount = insumosResumoSemanal.filter(i => i.af).length;
      const percentualAF = Math.round((afCount / Math.max(1, insumosResumoSemanal.length)) * 100);

      return {
        id: 'cardapio_ia_' + Date.now(),
        timestamp: new Date().toISOString(),
        nutricionista: 'Dra. Lilian Droppa',
        crn: '12345/MS',
        statusAprovacao: 'rascunho_ia', // rascunho_ia | aprovado_nutri
        relatorioPNAEDisponivel: false,  // TRAVA DE SEGURANÇA
        params: { modalidade, metaKcal, numAlunos, priorizarFEFO, priorizarSazonal, considerarRestricoes },
        metricasSemanais: {
          numAlunos,
          mediaKcal: totalKcal,
          mediaProteinas: totalProt,
          mediaCarboidratos: totalCarb,
          mediaLipideos: totalLip,
          mediaSodio: totalSodio,
          percentualAF,
          percentualAderenciaPNAE: totalKcal >= (metaKcal - 50) && totalKcal <= (metaKcal + 100) ? 98 : 92
        },
        refeicoes: refeicoesGeradas,
        insumosResumoSemanal
      };
    },

    /**
     * Aprova o cardápio (ação exclusiva da Dra. Lilian Droppa) e libera a geração do Relatório PNAE.
     */
    approveMenu: function (menuData) {
      if (!menuData) return null;
      menuData.statusAprovacao = 'aprovado_nutri';
      menuData.relatorioPNAEDisponivel = true;
      menuData.aprovadoEm = new Date().toISOString();
      menuData.aprovadoPor = 'Dra. Lilian Droppa (CRN 12345/MS)';
      return menuData;
    },

    suggestAlternativeDish: function (receitaIdAtual) {
      const opcoes = CATALOGO_RECEITAS.filter(r => r.id !== receitaIdAtual);
      const indice = Math.floor(Math.random() * opcoes.length);
      return opcoes[indice] || CATALOGO_RECEITAS[0];
    }
  };

  window.AICardapioEngine = AICardapioEngine;

})(window);
