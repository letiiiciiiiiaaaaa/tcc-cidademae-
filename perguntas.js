const form = document.getElementById('quiz-form');
const contadorElemento = document.getElementById('contador-pergunta');
const btnProxima = document.getElementById('btn-proxima');
let passoAtual = 1;
const totalPerguntas = 10;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Verifica se a pergunta atual foi respondida
    const radioAtual = form.querySelector(`input[name="p${passoAtual}"]:checked`);
    
    if (!radioAtual) {
        alert("Por favor, selecione uma opção para continuar!");
        return;
    }

    if (passoAtual < totalPerguntas) {
        // Esconde a pergunta atual
        document.querySelector(`.pergunta-step[data-step="${passoAtual}"]`).classList.remove('ativo');
        
        // Avança para a próxima
        passoAtual++;
        document.querySelector(`.pergunta-step[data-step="${passoAtual}"]`).classList.add('ativo');
        
        // Atualiza o contador na barra verde
        contadorElemento.innerText = `Pergunta ${passoAtual} de ${totalPerguntas}`;
    } else {
        // Se chegou ao final, calcula o resultado
        calcularResultado();
    }
});

function calcularResultado() {
    let pontosTotais = 0;
    
    // Soma os valores marcados de p1 até p10
    for (let i = 1; i <= totalPerguntas; i++) {
        const valor = parseInt(form.querySelector(`input[name="p${i}"]:checked`).value);
        pontosTotais += valor;
    }

    // Cálculo da porcentagem (10 pts = 0% / 40 pts = 100%)
    const porcentagem = Math.round(((pontosTotais - 10) / 30) * 100);

    // Oculta perguntas e topo do card
    document.querySelector(`.pergunta-step[data-step="${totalPerguntas}"]`).classList.remove('ativo');
    document.querySelector('.topo-card').style.display = 'none';

    // Define os textos de acordo com a pontuação
    const resultadoContainer = document.getElementById('resultado-container');
    const tituloResultado = document.getElementById('titulo-resultado');
    const porcentagemTexto = document.getElementById('porcentagem-texto');
    const descricaoResultado = document.getElementById('descricao-resultado');

    porcentagemTexto.innerText = `${porcentagem}% Caiçara`;

    if (pontosTotais >= 33) {
        tituloResultado.innerText = "Caiçara da Raiz! 🌊";
        descricaoResultado.innerText = "O mar corre nas suas veias, você conhece cada canto do litoral e não troca esse estilo de vida por nada.";
    } else if (pontosTotais >= 25) {
        tituloResultado.innerText = "Caiçara de Coração! ☀️";
        descricaoResultado.innerText = "Você ama a praia, a culinária e o ritmo de vida, mesmo mantendo alguns hábitos da cidade.";
    } else if (pontosTotais >= 17) {
        tituloResultado.innerText = "Turista Frequente! 🏖️";
        descricaoResultado.innerText = "Você curte dar uma passeada no litoral e tomar um banho de mar, mas é urbano demais pra largar a cidade.";
    } else {
        tituloResultado.innerText = "Cientista da Cidade! 🏙️";
        descricaoResultado.innerText = "A areia incomoda, o mar é gelado e o ar-condicionado é seu melhor amigo. Passou longe do espírito caiçara!";
    }

    resultadoContainer.style.display = 'block';
}