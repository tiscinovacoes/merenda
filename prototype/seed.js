const SUPABASE_URL = 'https://xszqqqyvdzoyxokkuqix.supabase.co';
const SUPABASE_KEY = 'sb_publishable_qwKVO7DURZT5jY0FlJs03Q_EYNKoH4L';

async function seed() {
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    // 1. Fetch produtos reais do banco de dados (alimentos_pnae)
    console.log('Buscando produtos...');
    const resAlimentos = await fetch(`${SUPABASE_URL}/rest/v1/alimentos_pnae?select=*`, { headers });
    const alimentos = await resAlimentos.json();

    const arroz = alimentos.find(a => a.name.toLowerCase().includes('arroz') && a.name.toLowerCase().includes('branco')) || { id: 'PRD-001', name: 'Arroz Branco', unit: 'kg' };
    const feijao = alimentos.find(a => a.name.toLowerCase().includes('feijão carioca') || a.name.toLowerCase().includes('feijao carioca')) || { id: 'PRD-002', name: 'Feijão Carioca', unit: 'kg' };
    const batata = alimentos.find(a => a.name.toLowerCase().includes('batata inglesa') || a.name.toLowerCase().includes('batata')) || { id: 'PRD-003', name: 'Batata Inglesa', unit: 'kg' };
    const carne = alimentos.find(a => a.name.toLowerCase().includes('carne bovina') || a.name.toLowerCase().includes('patinho')) || { id: 'PRD-004', name: 'Carne Bovina (Patinho)', unit: 'kg' };
    
    // Incluir Sal e Alho
    const sal = alimentos.find(a => a.name.toLowerCase().includes('sal')) || { id: 'PRD-005', name: 'Sal Refinado', unit: 'kg' };
    const alho = alimentos.find(a => a.name.toLowerCase().includes('alho')) || { id: 'PRD-006', name: 'Alho', unit: 'kg' };

    // 2. Criar Atas
    console.log('Criando Atas...');
    const ataId = 'ata-' + Date.now();
    const ata = {
      id: ataId,
      numero: 'ATA-2026/001',
      fornecedor: 'Fornecedor A',
      status: 'Ativa',
      vigencia: '2026-12-31',
      produtos: [
        { productId: arroz.id, produto: arroz.name, unidade: arroz.unit, qtd: 20000, valorUnit: 5.50 },  // Dobrado (antes era 10000)
        { productId: feijao.id, produto: feijao.name, unidade: feijao.unit, qtd: 10000, valorUnit: 7.20 }, // Dobrado
        { productId: carne.id, produto: carne.name, unidade: carne.unit, qtd: 4000, valorUnit: 35.00 }, // Dobrado
        { productId: sal.id, produto: sal.name, unidade: sal.unit, qtd: 500, valorUnit: 2.50 }, // Dobrado (Sal)
        { productId: alho.id, produto: alho.name, unidade: alho.unit, qtd: 200, valorUnit: 15.00 } // Dobrado (Alho)
      ]
    };

    await fetch(`${SUPABASE_URL}/rest/v1/atas`, {
      method: 'POST',
      headers,
      body: JSON.stringify(ata)
    });

    // 3. Criar Empenhos vinculados a esta Ata
    console.log('Criando Empenhos...');
    const empenhos = [
      { id: 'emp-101', numero: 'EMP-2026/101', ataNumero: ata.numero, contratoNumero: 'CTR-001', fornecedor: ata.fornecedor, status: 'Ativo', produto: arroz.name, unidade: arroz.unit, qtdTotal: 10000, qtdConsumida: 5000, valorUnit: 5.50, items: [{ productId: arroz.id, qtd: 10000 }] },
      { id: 'emp-102', numero: 'EMP-2026/102', ataNumero: ata.numero, contratoNumero: 'CTR-001', fornecedor: ata.fornecedor, status: 'Ativo', produto: feijao.name, unidade: feijao.unit, qtdTotal: 5000, qtdConsumida: 2000, valorUnit: 7.20, items: [{ productId: feijao.id, qtd: 5000 }] },
      { id: 'emp-103', numero: 'EMP-2026/103', ataNumero: ata.numero, contratoNumero: 'CTR-001', fornecedor: ata.fornecedor, status: 'Ativo', produto: sal.name, unidade: sal.unit, qtdTotal: 300, qtdConsumida: 150, valorUnit: 2.50, items: [{ productId: sal.id, qtd: 300 }] },
      { id: 'emp-104', numero: 'EMP-2026/104', ataNumero: ata.numero, contratoNumero: 'CTR-001', fornecedor: ata.fornecedor, status: 'Ativo', produto: alho.name, unidade: alho.unit, qtdTotal: 100, qtdConsumida: 50, valorUnit: 15.00, items: [{ productId: alho.id, qtd: 100 }] }
    ];

    for (let emp of empenhos) {
      await fetch(`${SUPABASE_URL}/rest/v1/empenhos`, { method: 'POST', headers, body: JSON.stringify(emp) });
    }

    // 4. Receber Notas Fiscais (Lançar no estoque tudo o que foi consumido dos empenhos)
    console.log('Gerando NFs (Recebendo no Estoque)...');
    const nfs = [
      { id: 'nf-001', empenhoId: 'emp-101', empenhoNumero: 'EMP-2026/101', numero: 'NF-1001', qtd: 5000, valor: 5000 * 5.50, dataRec: '2026-07-20', validade: '2027-07-20', lote: 'L-ARR-001', ateste: 'Conforme' },
      { id: 'nf-002', empenhoId: 'emp-102', empenhoNumero: 'EMP-2026/102', numero: 'NF-1002', qtd: 2000, valor: 2000 * 7.20, dataRec: '2026-07-21', validade: '2027-05-10', lote: 'L-FEI-001', ateste: 'Conforme' },
      { id: 'nf-003', empenhoId: 'emp-103', empenhoNumero: 'EMP-2026/103', numero: 'NF-1003', qtd: 150, valor: 150 * 2.50, dataRec: '2026-07-22', validade: '2028-01-01', lote: 'L-SAL-001', ateste: 'Conforme' },
      { id: 'nf-004', empenhoId: 'emp-104', empenhoNumero: 'EMP-2026/104', numero: 'NF-1004', qtd: 50, valor: 50 * 15.00, dataRec: '2026-07-22', validade: '2026-12-01', lote: 'L-ALHO-001', ateste: 'Conforme' }
    ];

    for (let nf of nfs) {
      await fetch(`${SUPABASE_URL}/rest/v1/nfs_recebidas`, { method: 'POST', headers, body: JSON.stringify(nf) });
    }

    // 5. Alimentar o Estoque Central
    console.log('Alimentando Estoque Central...');
    const estoqueData = [
      { produto: arroz.name, qtd: 5000, unidade: arroz.unit, lotes: [{ lote: 'L-ARR-001', qtd: 5000, validade: '2027-07-20', entrada: '2026-07-20' }] },
      { produto: feijao.name, qtd: 2000, unidade: feijao.unit, lotes: [{ lote: 'L-FEI-001', qtd: 2000, validade: '2027-05-10', entrada: '2026-07-21' }] },
      { produto: sal.name, qtd: 150, unidade: sal.unit, lotes: [{ lote: 'L-SAL-001', qtd: 150, validade: '2028-01-01', entrada: '2026-07-22' }] },
      { produto: alho.name, qtd: 50, unidade: alho.unit, lotes: [{ lote: 'L-ALHO-001', qtd: 50, validade: '2026-12-01', entrada: '2026-07-22' }] }
    ];

    for (let est of estoqueData) {
      await fetch(`${SUPABASE_URL}/rest/v1/estoque_central?produto=eq.${encodeURIComponent(est.produto)}`, { method: 'DELETE', headers }); // Clear first
      await fetch(`${SUPABASE_URL}/rest/v1/estoque_central`, { method: 'POST', headers, body: JSON.stringify(est) });
    }

    console.log('✅ Seed finalizado com sucesso! (Dobrado + Sal + Alho)');

  } catch (err) {
    console.error('Erro:', err);
  }
}

seed();
