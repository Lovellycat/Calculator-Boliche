// Array para armazenar o histórico de vendas do dia
let salesHistory = [];

/**
 * Adiciona o pedido atual ao histórico de vendas (log).
 */
function recordSale(total) {
    const now = new Date();
    // Formata a hora (Ex: 21:45:00)
    const time = now.toLocaleTimeString('pt-BR', { hour12: false });
    
    let saleDetails = {
        time: time,
        total: total,
        items: []
    };
    
    // Pega todos os campos de input de item
    const itemInputs = document.querySelectorAll('#items-list input[type="number"]');

    itemInputs.forEach(input => {
        const quantity = parseInt(input.value) || 0;
        
        if (quantity > 0) {
            // Pega o nome do item do atributo data-name no HTML
            const name = input.getAttribute('data-name');
            const price = parseFloat(input.getAttribute('data-price'));
            
            saleDetails.items.push({
                name: name,
                quantity: quantity,
                price: price
            });
        }
    });

    // Só registra a venda se houver itens
    if (saleDetails.items.length > 0) {
        salesHistory.push(saleDetails);
        updateDailyLogDisplay();
    }
}

/**
 * Atualiza a textarea com um resumo das vendas registradas.
 */
function updateDailyLogDisplay() {
    const logArea = document.getElementById('daily-log');
    let displayLog = "--- RESUMO DE VENDAS ATENDIDAS ---\n";
    
    salesHistory.forEach((sale, index) => {
        let itemsString = sale.items.map(item => `${item.quantity}x ${item.name}`).join(', ');
        displayLog += `[Venda #${index + 1} | ${sale.time}] Total: $${sale.total.toLocaleString('pt-BR')} | Itens: ${itemsString}\n`;
    });
    
    logArea.value = displayLog;
}

/**
 * Gera e formata o log final para o fechamento do caixa (copiável).
 */
function generateLogReport() {
    if (salesHistory.length === 0) {
        alert("Nenhuma venda foi registrada hoje. Clique em 'Calcular Total' para registrar um pedido.");
        return;
    }
    
    let report = `
========================================
📋 LOG DE ATENDIMENTO - ORLEANS BOLICHE
Data: ${new Date().toLocaleDateString('pt-BR')}
Total de Pedidos Atendidos: ${salesHistory.length}
========================================
`;
    
    let finalTotalSales = 0;
    const itemSummary = {};
    
    salesHistory.forEach((sale, index) => {
        finalTotalSales += sale.total;
        
        // Detalhe de cada pedido
        report += `[#${index + 1}] Horário: ${sale.time} | Total: $${sale.total.toLocaleString('pt-BR')}\n`;
        
        sale.items.forEach(item => {
            report += `   - ${item.quantity}x ${item.name} ($${item.price.toLocaleString('pt-BR')})\n`;
            
            // Soma o total de itens para o resumo
            if (itemSummary[item.name]) {
                itemSummary[item.name] += item.quantity;
            } else {
                itemSummary[item.name] = item.quantity;
            }
        });
        report += "----------------------------------------\n";
    });
    
    report += "\n=== RESUMO GERAL DE ITENS VENDIDOS ===\n";
    for (const item in itemSummary) {
        report += `${item}: ${itemSummary[item]} unidades\n`;
    }
    
    report += `\n💰 TOTAL ARRECADADO HOJE: $${finalTotalSales.toLocaleString('pt-BR')}\n`;
    report += "========================================\n";
    report += "Relatório gerado pela Calculadora Orleans Boliche.";

    const logArea = document.getElementById('daily-log');
    logArea.value = report;
    alert("Relatório Diário Gerado. Use o botão 'Copiar Log' para enviá-lo.");
}

/**
 * Função principal que calcula o total do pedido e REGISTRA A VENDA.
 */
function calculateTotal() {
    let total = 0;
    
    const itemInputs = document.querySelectorAll('#items-list input[type="number"]');

    itemInputs.forEach(input => {
        const quantity = Math.max(0, parseInt(input.value) || 0); 
        const price = parseFloat(input.getAttribute('data-price'));

        if (price > 0) {
            total += quantity * price;
        }
    });

    const formattedTotal = `$${total.toLocaleString('pt-BR')}`;

    document.getElementById('total-result').textContent = formattedTotal;
    
    // *CHAMADA CRUCIAL: REGISTRA A VENDA DEPOIS DE CALCULAR*
    if (total > 0) {
        recordSale(total);
    }
}

/**
 * Função para limpar todos os campos de quantidade e resetar o total (APENAS UM PEDIDO).
 */
function clearFields() {
    const itemInputs = document.querySelectorAll('#items-list input[type="number"]');

    itemInputs.forEach(input => {
        input.value = 0;
    });

    calculateTotal(); 
}

/**
 * Copia o conteúdo da área de log para a área de transferência.
 */
function copyLog() {
    const logArea = document.getElementById('daily-log');
    logArea.select();
    logArea.setSelectionRange(0, 99999); // Para mobile
    document.execCommand('copy');
    alert("Log copiado para a área de transferência!");
}

/**
 * Limpa o histórico de vendas do dia.
 */
function clearDailyLog() {
    if (confirm("Tem certeza que deseja limpar o Histórico de Vendas (Log) do dia? Esta ação não pode ser desfeita.")) {
        salesHistory = [];
        document.getElementById('daily-log').value = "";
        calculateTotal();
        alert("Histórico de Vendas Limpo.");
    }
}


// Evento que carrega a função de cálculo automaticamente.
document.addEventListener('DOMContentLoaded', () => {
    const itemInputs = document.querySelectorAll('#items-list input[type="number"]');
    
    itemInputs.forEach(input => {
        input.addEventListener('input', calculateTotal); // O cálculo é feito ao digitar, mas a venda só é registrada no clique
        input.addEventListener('change', calculateTotal);
    });
    
    calculateTotal();
});
