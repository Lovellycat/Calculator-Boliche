/**
 * Função principal que calcula o total do pedido com base nas quantidades e preços.
 */
function calculateTotal() {
    let total = 0;
    
    // 1. Pega todos os campos de input de item dentro da div 'items-list'
    const itemInputs = document.querySelectorAll('#items-list input[type="number"]');

    // 2. Itera sobre cada campo para calcular o subtotal
    itemInputs.forEach(input => {
        // Pega a quantidade (garante que é um número e não é negativo)
        const quantity = Math.max(0, parseInt(input.value) || 0); 
        
        // Pega o preço do item que está armazenado no atributo 'data-price'
        const price = parseFloat(input.getAttribute('data-price'));

        // Adiciona ao total
        if (price > 0) {
            total += quantity * price;
        }
    });

    // 3. Formata o valor total com o cifrão e separadores de milhar
    const formattedTotal = `$${total.toLocaleString('pt-BR')}`;

    // 4. Atualiza o elemento de resultado na página
    document.getElementById('total-result').textContent = formattedTotal;
}

/**
 * Função para limpar todos os campos de quantidade e resetar o total.
 */
function clearFields() {
    // 1. Pega todos os campos de input de item
    const itemInputs = document.querySelectorAll('#items-list input[type="number"]');

    // 2. Seta o valor de todos os campos para zero
    itemInputs.forEach(input => {
        input.value = 0;
    });

    // 3. Recalcula o total (que será zero) e atualiza o display
    calculateTotal(); 
}

/**
 * Evento que carrega a função de cálculo automaticamente.
 */
document.addEventListener('DOMContentLoaded', () => {
    const itemInputs = document.querySelectorAll('#items-list input[type="number"]');
    
    // Adiciona um listener de evento para recalcular o total
    itemInputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
        input.addEventListener('change', calculateTotal);
    });
    
    // Calcula o total inicial ao carregar a página (que deve ser $0)
    calculateTotal();
});