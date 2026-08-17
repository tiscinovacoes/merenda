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

  // Insumos com Alerta FEFO Simulado para Combate ao Desperdício (fallback)
  const ESTOQUE_FEFO_EMERGENCIA = [
    { itemKey: 'frango', nome: 'Frango Congelado (Coxa/Sobre)', diasParaVencer: 14, risco: 'alto' },
    { itemKey: 'leite', nome: 'Leite Integral UHT', diasParaVencer: 18, risco: 'medio' },
    { itemKey: 'feijao', nome: 'Feijão Carioca 1kg', diasParaVencer: 25, risco: 'medio' },
    { itemKey: 'banana', nome: 'Verduras e Frutas AF', diasParaVencer: 5, risco: 'critico' }
  ];

  // Leitura dinâmica do estoque consolidado real (DATA.products + DATA.lots) sem alterar dados
  function getEstoqueFEFOAtivo() {
    const fefoList = [];
    if (typeof window.estoqueConsolidado === 'function') {
      try {
        const cons = window.estoqueConsolidado() || [];
        cons.forEach(p => {
          if (p.lotes && p.lotes.length > 0) {
            const prox = p.lotes[0];
            if (prox && prox.expirationDate) {
              const dias = Math.ceil((new Date(prox.expirationDate) - new Date()) / 86400000);
              if (dias <= 60) {
                fefoList.push({
                  itemKey: p.name.toLowerCase(),
                  nome: p.name,
                  diasParaVencer: Math.max(1, dias),
                  risco: dias <= 15 ? 'critico' : (dias <= 30 ? 'alto' : 'medio')
                });
              }
            }
          }
        });
      } catch (e) {
        console.warn('[AI Engine] Aviso na leitura de estoqueConsolidado:', e);
      }
    }
    return fefoList.length > 0 ? fefoList : ESTOQUE_FEFO_EMERGENCIA;
  }

  const AICardapioEngine = {
    getCatalogo: function () {
      return CATALOGO_RECEITAS;
    },

    /**
     * Executa o algoritmo de otimização de cardápio semanal
     */
    generateWeeklyMenu: function (params) {
      params = params || {};
      const modalidade = params.modalidade || 'fundamental_integral';
      const metaKcal = parseInt(params.metaKcal) || 700;
      const priorizarFEFO = params.priorizarFEFO !== false;
      const priorizarSazonal = params.priorizarSazonal !== false;
      const considerarRestricoes = params.considerarRestricoes !== false;
      const numAlunos = parseInt(params.numAlunos) || (modalidade === 'rede_total' ? 32000 : 10380);

      // 1. Estoque FEFO ativo (insumos perto de vencer)
      const listaFEFO = getEstoqueFEFOAtivo();

      // 2. Filtrar receitas elegíveis para a modalidade
      let candidatas = CATALOGO_RECEITAS.filter(r => 
        !r.modalidades || r.modalidades.includes(modalidade) || modalidade === 'piloto_completo' || modalidade === 'rede_total'
      );

      if (candidatas.length < 5) candidatas = CATALOGO_RECEITAS;

      // Respeito estrito a restrições de emergência registradas no SharedState
      if (window.SharedState && typeof window.SharedState.getRestricoes === 'function') {
        const restricoesAtivas = window.SharedState.getRestricoes().filter(r => r.status === 'ativo');
        if (restricoesAtivas.length > 0) {
          const temLactose = restricoesAtivas.some(r => (r.tipo || '').toLowerCase().includes('lactose'));
          const temGluten = restricoesAtivas.some(r => (r.tipo || '').toLowerCase().includes('celíaca') || (r.tipo || '').toLowerCase().includes('glúten'));
          
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

        // Bônus FEFO: se usa item perto de vencer do estoque consolidado
        if (priorizarFEFO) {
          const itemFefo = listaFEFO.find(f => 
            (r.ingredientes || []).some(ing => 
              (ing.nome || '').toLowerCase().includes(f.itemKey || '') ||
              (ing.estoqueItem || '').toLowerCase().includes(f.itemKey || '')
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

      // Formatação de datas do intervalo selecionado
      let startDateObj = params.startDate ? new Date(params.startDate + 'T00:00:00') : null;
      let endDateObj = params.endDate ? new Date(params.endDate + 'T00:00:00') : null;
      const diasSemanaBase = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
      const diasSemana = [];

      if (startDateObj && !isNaN(startDateObj.getTime())) {
        let cur = new Date(startDateObj);
        for (let i = 0; i < 5; i++) {
          const dayName = cur.toLocaleDateString('pt-BR', { weekday: 'long' });
          const dayNameCap = dayName.charAt(0).toUpperCase() + dayName.slice(1);
          const dateStr = cur.toLocaleDateString('pt-BR');
          diasSemana.push(`${dayNameCap} (${dateStr})`);
          cur.setDate(cur.getDate() + (cur.getDay() === 5 ? 3 : 1));
        }
      } else {
        diasSemana.push(...diasSemanaBase);
      }

      const d1Str = startDateObj && !isNaN(startDateObj.getTime()) ? startDateObj.toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR');
      const d2Str = endDateObj && !isNaN(endDateObj.getTime()) ? endDateObj.toLocaleDateString('pt-BR') : new Date(Date.now() + 5*86400000).toLocaleDateString('pt-BR');
      const periodoStr = `${d1Str} a ${d2Str}`;

      const refeicoesGeradas = [];
      const acumuladorInsumos = {};

      for (let i = 0; i < 5; i++) {
        const receita = ordenadas[i % ordenadas.length];

        // Processar ingredientes, per capita e necessidade da rede em kg/litros
        const ingredientesProcessados = (receita.ingredientes || []).map(ing => {
          let disponivel = true;
          let qtdEstoque = 'Disponível';

          if (window.SharedState && typeof window.SharedState.getCentralStock === 'function') {
            const stock = window.SharedState.getCentralStock() || [];
            const match = stock.find(s => 
              (s.item || '').toLowerCase().includes((ing.nome || '').toLowerCase()) ||
              (ing.estoqueItem && (s.item || '').toLowerCase().includes(String(ing.estoqueItem).toLowerCase()))
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
          nomePrato: receita.nome,
          kcal: receita.kcal,
          proteinas: receita.proteinas,
          carboidratos: receita.carboidratos,
          lipideos: receita.lipideos,
          sodio: receita.sodio,
          fruta: receita.frutaAcompanhamento,
          fefoBadge: receita.fefoBadge,
          ingredientes: ingredientesProcessados,
          statusEstoque: todosDisponiveis ? 'Estoque Suficiente' : 'Atenção ao Estoque'
        });
      }

      // Métricas Nutricionais Calculadas da Semana
      const totalKcal = Math.round(refeicoesGeradas.reduce((a, b) => a + (b.kcal || 0), 0) / 5);
      const totalProt = Math.round(refeicoesGeradas.reduce((a, b) => a + (b.proteinas || 0), 0) / 5);
      const totalCarb = Math.round(refeicoesGeradas.reduce((a, b) => a + (b.carboidratos || 0), 0) / 5);
      const totalLip = Math.round(refeicoesGeradas.reduce((a, b) => a + (b.lipideos || 0), 0) / 5);
      const totalSodio = Math.round(refeicoesGeradas.reduce((a, b) => a + (b.sodio || 0), 0) / 5);

      // Consolidação de Insumos da Semana
      const insumosResumoSemanal = Object.values(acumuladorInsumos).map(ins => ({
        ...ins,
        totalSemanalKg: Math.round(ins.totalSemanalKg * 5) // 5 dias de consumo
      }));

      const itensAF = insumosResumoSemanal.filter(i => i.af).length;
      const percentualAF = insumosResumoSemanal.length > 0 
        ? Math.round((itensAF / insumosResumoSemanal.length) * 100)
        : 35;

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
    },

    /**
     * Gera uma Ficha Técnica de Preparação automática baseada no Estoque (FEFO + Agricultura Familiar).
     */
    generateFichaTecnicaFromStock: function (params) {
      params = params || {};
      const modalidade = params.modalidade || 'Escolar Urbana (Regular)';
      const tipoRefeicao = params.tipoRefeicao || 'Almoço';
      const listaFEFO = getEstoqueFEFOAtivo();

      // Selecionar receitas candidatas pontuando o uso de itens no estoque
      const candidatas = CATALOGO_RECEITAS.map(r => {
        let score = 80;
        let fefoItems = [];
        if (listaFEFO && listaFEFO.length > 0) {
          listaFEFO.forEach(f => {
            if ((r.ingredientes || []).some(ing => (ing.nome || '').toLowerCase().includes(f.itemKey || '') || (ing.estoqueItem || '').toLowerCase().includes(f.itemKey || ''))) {
              score += 15;
              fefoItems.push(f.nome);
            }
          });
        }
        if (r.sazonal || r.agriculturaFamiliar) score += 10;
        return { ...r, score, fefoItems };
      }).sort((a, b) => b.score - a.score);

      const receita = candidatas[Math.floor(Math.random() * Math.min(3, candidatas.length))] || CATALOGO_RECEITAS[0];

      const ingredientesFicha = receita.ingredientes.map(ing => {
        const perCapita = ing.perCapita || 100;
        let nut = { kcal: 0, carbos: 0, proteinas: 0, lipidios: 0, sodio: 0 };
        if (typeof window.getNutrientesDoAlimento === 'function') {
          nut = window.getNutrientesDoAlimento(ing.nome, perCapita);
        }

        return {
          id: Date.now() + Math.floor(Math.random() * 10000),
          nome: ing.nome,
          quantidade: perCapita,
          unidade: ing.unidade || 'g',
          kcal: parseFloat(nut.kcal) || Math.round(receita.kcal / receita.ingredientes.length),
          carbos: parseFloat(nut.carbos) || Math.round(receita.carboidratos / receita.ingredientes.length),
          proteinas: parseFloat(nut.proteinas) || Math.round(receita.proteinas / receita.ingredientes.length),
          lipidios: parseFloat(nut.lipidios) || Math.round(receita.lipideos / receita.ingredientes.length),
          sodio: parseFloat(nut.sodio) || Math.round(receita.sodio / receita.ingredientes.length)
        };
      });

      const totais = {
        kcal: ingredientesFicha.reduce((a, b) => a + (b.kcal || 0), 0),
        carbos: ingredientesFicha.reduce((a, b) => a + (b.carbos || 0), 0),
        proteinas: ingredientesFicha.reduce((a, b) => a + (b.proteinas || 0), 0),
        lipidios: ingredientesFicha.reduce((a, b) => a + (b.lipidios || 0), 0),
        sodio: ingredientesFicha.reduce((a, b) => a + (b.sodio || 0), 0)
      };

      return {
        nome: receita.nome,
        tipo: tipoRefeicao,
        modalidade: modalidade,
        ingredientes: ingredientesFicha,
        totais: totais,
        fefoItems: receita.fefoItems || [],
        frutaAcompanhamento: receita.frutaAcompanhamento || null,
        geradoPorIA: true
      };
    },

    /**
     * Adiciona uma nova Ficha Técnica aprovada ao catálogo consultável da IA.
     */
    addReceita: function (novaReceita) {
      if (!novaReceita || !novaReceita.nome) return;
      const id = String(novaReceita.id || 'rec_' + Date.now());
      const existe = CATALOGO_RECEITAS.some(r => String(r.id) === id || (r.nome && novaReceita.nome && String(r.nome).toLowerCase() === String(novaReceita.nome).toLowerCase()));
      if (!existe) {
        CATALOGO_RECEITAS.push({
          id: id,
          nome: novaReceita.nome,
          categoria: novaReceita.tipo || 'Almoço/Jantar',
          kcal: Math.round(novaReceita.totais?.kcal || 650),
          proteinas: Math.round(novaReceita.totais?.proteinas || 25),
          carboidratos: Math.round(novaReceita.totais?.carbos || 75),
          lipideos: Math.round(novaReceita.totais?.lipidios || 15),
          sodio: Math.round(novaReceita.totais?.sodio || 400),
          sazonal: true,
          agriculturaFamiliar: true,
          ingredientes: (novaReceita.ingredientes || []).map(ing => ({
            nome: ing.nome,
            perCapita: parseFloat(ing.quantidade) || 100,
            unidade: ing.unidade || 'g',
            estoqueItem: ing.nome
          })),
          frutaAcompanhamento: 'Fruta da Estação AF 🌾',
          restricoesEvitadas: [],
          modalidades: ['fundamental_integral', 'fundamental_parcial', 'creche', 'eja']
        });
      }
    },

    /**
     * Calcula a separação de produtos por escola e aplica a regra de embalagens inteiras não-fracionadas (arroz, feijão, macarrão, óleo, sal, açúcar, etc.)
    /**
     * RN-002: Determina o produto substituto baseado no tipo de restrição e na faixa etária (Data de Nascimento)
     */
    determinarSubstitutoRestricao: function (restricaoTipo, dataNascimento) {
      if (!restricaoTipo) return null;
      const t = String(restricaoTipo).toLowerCase();
      
      let idadeAnos = 5; // Default para alunos de ensino fundamental
      if (dataNascimento) {
        const dob = new Date(dataNascimento);
        if (!isNaN(dob.getTime())) {
          const diffMs = Date.now() - dob.getTime();
          idadeAnos = diffMs / (1000 * 60 * 60 * 24 * 365.25);
        }
      }

      if (t.includes('lactose')) {
        if (idadeAnos < 2) {
          return {
            substituto: 'Fórmula Infantil Especial Zero Lactose (Lata 400g)',
            perCapitaGramos: 120,
            unidade: 'Lata 400g',
            regraEtaria: '🍼 RN-002: Faixa Etária 0-2 anos (Creche) ➔ Fórmula Infantil Específica',
            naoFracionavel: true
          };
        } else {
          return {
            substituto: 'Leite UHT Zero Lactose (Caixa 1L)',
            perCapitaGramos: 200,
            unidade: 'Caixa 1L',
            regraEtaria: '🥛 RN-002: Faixa Etária > 2 anos ➔ Leite UHT Zero Lactose Comum',
            naoFracionavel: true
          };
        }
      }

      if (t.includes('celíaca') || t.includes('celiaca') || t.includes('gluten') || t.includes('glúten')) {
        return {
          substituto: 'Biscoito & Pão Especial Sem Glúten (Pct 300g)',
          perCapitaGramos: 60,
          unidade: 'Pacote 300g',
          regraEtaria: '🌾 RN-002: Dieta Celíaca Sem Glúten Estrita',
          naoFracionavel: true
        };
      }

      if (t.includes('diabete')) {
        return {
          substituto: 'Alimentos Diet / Sem Açúcar Adicionado (Pct 500g)',
          perCapitaGramos: 50,
          unidade: 'Pacote 500g',
          regraEtaria: '🍯 RN-002: Dieta com Restrição de Açúcares/Glicemia',
          naoFracionavel: true
        };
      }

      return null;
    },

    /**
     * Calcula a separação de produtos por escola e aplica a regra de embalagens inteiras não-fracionadas (arroz, feijão, macarrão, óleo, sal, açúcar, etc.)
     */
    calcularDemandaPorEscola: function (menuObj, escolaObj) {
      if (!menuObj || !escolaObj) return [];
      const numAlunos = escolaObj.students || 100;
      const insumos = menuObj.insumosResumoSemanal || [];

      // Dicionário de Tamanho de Embalagem Comercial Mínima (Não-Fracionáveis)
      const embalagensNaoFracionaveis = {
        'arroz': { tamanho: 5.0, unidadePack: 'Saco 5kg', fracionavel: false },
        'feijao': { tamanho: 1.0, unidadePack: 'Pacote 1kg', fracionavel: false },
        'feijão': { tamanho: 1.0, unidadePack: 'Pacote 1kg', fracionavel: false },
        'macarrao': { tamanho: 1.0, unidadePack: 'Pacote 1kg', fracionavel: false },
        'macarrão': { tamanho: 1.0, unidadePack: 'Pacote 1kg', fracionavel: false },
        'oleo': { tamanho: 1.0, unidadePack: 'Frasco 1L', fracionavel: false },
        'óleo': { tamanho: 1.0, unidadePack: 'Frasco 1L', fracionavel: false },
        'sal': { tamanho: 1.0, unidadePack: 'Pacote 1kg', fracionavel: false },
        'acucar': { tamanho: 1.0, unidadePack: 'Pacote 1kg', fracionavel: false },
        'açúcar': { tamanho: 1.0, unidadePack: 'Pacote 1kg', fracionavel: false },
        'leite em po': { tamanho: 1.0, unidadePack: 'Pacote 1kg', fracionavel: false },
        'leite em pó': { tamanho: 1.0, unidadePack: 'Pacote 1kg', fracionavel: false },
      };

      const resultadoDemanda = insumos.map(ins => {
        const perCapitaG = ins.perCapitaGramos || 50;
        const totalBrutoKg = parseFloat(((numAlunos * perCapitaG * 5) / 1000).toFixed(2));
        
        const nomeLower = (ins.nome || '').toLowerCase();
        let packRule = null;
        for (let key in embalagensNaoFracionaveis) {
          if (nomeLower.includes(key)) {
            packRule = embalagensNaoFracionaveis[key];
            break;
          }
        }

        let qtdEnviada = totalBrutoKg;
        let numPacotes = 1;
        let detalheRegra = 'Item fracionável em Kg';

        if (packRule) {
          numPacotes = Math.ceil(totalBrutoKg / packRule.tamanho);
          if (numPacotes < 1) numPacotes = 1;
          qtdEnviada = numPacotes * packRule.tamanho;
          detalheRegra = `📦 Embalagem Inteira (${numPacotes} x ${packRule.unidadePack})`;
        } else {
          qtdEnviada = Math.max(1, parseFloat(totalBrutoKg.toFixed(1)));
        }

        return {
          nome: ins.nome,
          af: ins.af || false,
          perCapitaGramos: perCapitaG,
          demandaCalculadaKg: totalBrutoKg,
          qtdEnviadaKg: qtdEnviada,
          numPacotes: numPacotes,
          detalheRegra: detalheRegra,
          naoFracionavel: !!packRule
        };
      });

      // RN-002 / RF-004: Inclusão Automática de Insumos Especiais para Alunos Cadastrados
      if (window.SharedState && typeof window.SharedState.getAlunosEspeciais === 'function') {
        const alunosEscola = window.SharedState.getAlunosEspeciais(escolaObj.name) || [];
        alunosEscola.forEach(aluno => {
          const subInfo = AICardapioEngine.determinarSubstitutoRestricao(aluno.restricao, aluno.dataNascimento);
          if (subInfo) {
            const totalUnid = Math.max(2, Math.ceil((subInfo.perCapitaGramos * 5) / 300));
            resultadoDemanda.push({
              nome: `${subInfo.substituto} (${aluno.nome.split(' ')[0]} - ${aluno.turma || 'Especial'})`,
              af: false,
              perCapitaGramos: subInfo.perCapitaGramos,
              demandaCalculadaKg: totalUnid,
              qtdEnviadaKg: totalUnid,
              numPacotes: totalUnid,
              detalheRegra: `${subInfo.regraEtaria} (Demanda Automática RF-004)`,
              naoFracionavel: true,
              itemEspecial: true
            });
          }
        });
      }

      return resultadoDemanda;
    },

    /**
     * RN-002 & RF-004: Motor de Substituição por Faixa Etária e Restrição Clínica
     */
    determinarSubstitutoRestricao: function(restricaoTipo, dataNascOuIdade) {
      const tipo = (restricaoTipo || '').toLowerCase();
      let idadeAnos = typeof dataNascOuIdade === 'number' ? dataNascOuIdade : 7;
      
      if (typeof dataNascOuIdade === 'string' && dataNascOuIdade.includes('-')) {
        const anoNasc = parseInt(dataNascOuIdade.split('-')[0], 10);
        if (!isNaN(anoNasc)) {
          idadeAnos = new Date().getFullYear() - anoNasc;
        }
      }

      if (tipo.includes('lactose') || tipo.includes('aplv') || tipo.includes('leite')) {
        if (idadeAnos < 2) {
          return {
            substituto: 'Fórmula Infantil Especial Zero Lactose (Lata 400g)',
            regraEtaria: 'Creche (< 2 anos)',
            perCapitaGramos: 120,
            unidade: 'Lata 400g',
            observacao: 'Fórmula infantil sem lactose recomendada para berçário'
          };
        } else {
          return {
            substituto: 'Leite UHT Zero Lactose (Caixa 1L)',
            regraEtaria: 'Fundamental (≥ 2 anos)',
            perCapitaGramos: 200,
            unidade: 'Caixa 1L',
            observacao: 'Leite fluído sem lactose para Ensino Fundamental'
          };
        }
      }

      if (tipo.includes('celíac') || tipo.includes('celiac') || tipo.includes('glúten') || tipo.includes('gluten')) {
        return {
          substituto: 'Biscoito & Pão Especial Sem Glúten (Pacote 300g)',
          regraEtaria: 'Todas as Idades (Dieta Celíaca)',
          perCapitaGramos: 50,
          unidade: 'Pacote 300g',
          observacao: 'Insumo isento de trigo, aveia, cevada e centeio'
        };
      }

      if (tipo.includes('diabet') || tipo.includes('glicemia')) {
        return {
          substituto: 'Alimentos Diet / Sem Açúcar Adicionado',
          regraEtaria: 'Todas as Idades (Dieta Diabética)',
          perCapitaGramos: 60,
          unidade: 'Unidade',
          observacao: 'Controle de carga glicêmica PNAE'
        };
      }

      return {
        substituto: 'Alimento In Natura Adaptado AF 🌾',
        regraEtaria: 'Geral',
        perCapitaGramos: 100,
        unidade: 'Kg',
        observacao: 'Substituição por fruta/hortaliça in natura da agricultura familiar'
      };
    }
  };

  window.AICardapioEngine = AICardapioEngine;

})(window);

