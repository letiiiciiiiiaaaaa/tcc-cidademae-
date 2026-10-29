// Banco com as 10 Perguntas e Valores (1 a 4 pontos)
const listaPerguntas = [
    {
        titulo: "1. Quando o sol dá as caras no final de semana, qual é o seu rolê perfeito?",
        opcoes: [
            { texto: "Pé na areia, banho de mar e pastel com garapa na praia.", pontos: 4 },
            { texto: "Caminhada na orla, tomar uma água de coco e voltar pra casa.", pontos: 3 },
            { texto: "Ir ao shopping ou cinema no ar-condicionado.", pontos: 2 },
            { texto: "Ficar em casa maratonando série.", pontos: 1 }
        ]
    },
    {
        titulo: "2. Qual é o seu prato ideal em um almoço de domingo?",
        opcoes: [
            { texto: "Peixe fresco frito com pirão de peixe e farinha de mandioca.", pontos: 4 },
            { texto: "Um prato bem servido de frutos do mar ou moqueca.", pontos: 3 },
            { texto: "Um frango assado ou massa caseira.", pontos: 2 },
            { texto: "Fast-food ou hambúrguer artesanal.", pontos: 1 }
        ]
    },
    {
        titulo: "3. Como você reage quando vê a previsão do tempo mudando do nada na praia?",
        opcoes: [
            { texto: "Já tô acostumado, chuva de praia não mata ninguém e logo passa!", pontos: 4 },
            { texto: "Pego minhas coisas com calma e vou procurar um quiosque.", pontos: 3 },
            { texto: "Fico bravo, me encharco todo e vou embora reclamando.", pontos: 2 },
            { texto: "Nem saio de casa se a previsão não cravar 30°C sem nuvens.", pontos: 1 }
        ]
    },
    {
        titulo: "4. O que não pode faltar na sua cozinha de jeito nenhum?",
        opcoes: [
            { texto: "Farinha de mandioca torradinha e peixe fresco.", pontos: 4 },
            { texto: "Fruta da estação e frutos do mar congelados.", pontos: 3 },
            { texto: "Arroz, feijão e carne vermelha.", pontos: 2 },
            { texto: "Comida congelada e produtos industrializados.", pontos: 1 }
        ]
    },
    {
        titulo: "5. O que você acha de andar descalço ou de chinelo o dia todo?",
        opcoes: [
            { texto: "É o meu uniforme oficial! Se pudesse, nem usava tênis.", pontos: 4 },
            { texto: "Uso direto no dia a dia, mas coloco tênis pra sair à noite.", pontos: 3 },
            { texto: "Só uso chinelo dentro de casa.", pontos: 2 },
            { texto: "Prefiro tênis ou calçado fechado em qualquer ocasião.", pontos: 1 }
        ]
    },
    {
        titulo: "6. Qual é a sua relação com o mar?",
        opcoes: [
            { texto: "É meu refúgio! Sei ler as marés, respeito a água e entro sempre.", pontos: 4 },
            { texto: "Adoro dar um mergulho pra refrescar quando tá muito quente.", pontos: 3 },
            { texto: "Gosto de olhar de longe, mas tenho um certo receio de entrar.", pontos: 2 },
            { texto: "Não gosto de areia, salgado do mar nem de onda.", pontos: 1 }
        ]
    },
    {
        titulo: "7. Você encontra um pescador voltando do mar com o barco cheio. O que faz?",
        opcoes: [
            { texto: "Vou dar 'bom dia' e ver o que veio na rede pra comprar fresquinho.", pontos: 4 },
            { texto: "Acho bonito de ver, tiro uma foto e sigo meu caminho.", pontos: 3 },
            { texto: "Olho com curiosidade, mas não me aproximo.", pontos: 2 },
            { texto: "Nem presto atenção, passo direto.", pontos: 1 }
        ]
    },
    {
        titulo: "8. Quando o assunto é a natureza e a vegetação do litoral:",
        opcoes: [
            { texto: "Conheço as trilhas, plantas locais, bichos e defendo a preservação.", pontos: 4 },
            { texto: "Acho lindo, gosto de fazer uma trilha leve de vez em quando.", pontos: 3 },
            { texto: "Acho bonito nas fotos, mas tenho preguiça de mato e mosquito.", pontos: 2 },
            { texto: "Nem reparo nisso, prefiro ambientes urbanos.", pontos: 1 }
        ]
    },
    {
        titulo: "9. Como é o seu ritmo de vida e sua forma de conversar?",
        opcoes: [
            { texto: "Calmo, sossegado, sotaque/gírias locais e sem pressa pra nada.", pontos: 4 },
            { texto: "Tranquilo na maior parte do tempo, mas acelero quando precisa.", pontos: 3 },
            { texto: "Agitado, tô sempre correndo contra o tempo.", pontos: 2 },
            { texto: "Estressado e acelerado 24 horas por dia.", pontos: 1 }
        ]
    },
    {
        titulo: "10. Para você, qual é o maior tesouro de viver perto da praia?",
        opcoes: [
            { texto: "A paz de espírito, a cultura local e o contato com a natureza.", pontos: 4 },
            { texto: "Ter opção de lazer ao ar livre no fim de semana.", pontos: 3 },
            { texto: "Apenas o clima agradável em algumas épocas do ano.", pontos: 2 },
            { texto: "Honestamente? Não vejo muita vantagem.", pontos: 1 }
        ]
    }
];

let perguntaAtual = 0;
let pontosAcumulados = 0;

const form = document.getElementById('quiz-form');
const contadorElemento = document.getElementById('contador-pergunta');
const textoPerguntaElemento = document.getElementById('texto-pergunta');
const opcoesContainer = document.getElementById('opcoes-container');

// Renderiza a pergunta atual na tela
function renderizarPergunta() {
    const dados = listaPerguntas[perguntaAtual];
    
    // Atualiza o topo e o título
    contadorElemento.innerText = `Pergunta ${perguntaAtual + 1} de ${listaPerguntas.length}`;
    textoPerguntaElemento.innerText = dados.titulo;
    
    // Limpa as opções anteriores
    opcoesContainer.innerHTML = '';

    // Cria os inputs de rádio dinamicamente
    dados.opcoes.forEach((opcao, index) => {
        const label = document.createElement('label');
        label.classList.add('opcao-label');

        label.innerHTML = `
            <input type="radio" name="resposta" value="${opcao.pontos}" required>
            <span>${opcao.texto}</span>
        `;

        opcoesContainer.appendChild(label);
    });
}

// Evento ao clicar na seta/enviar formulário
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const opcaoSelecionada = form.querySelector('input[name="resposta"]:checked');
    if (!opcaoSelecionada) return;

    // Soma a pontuação
    pontosAcumulados += parseInt(opcaoSelecionada.value);

    perguntaAtual++;

    if (perguntaAtual < listaPerguntas.length) {
        renderizarPergunta();
    } else {
        exibirResultado();
    }
});

// Exibe o resultado final ao responder as 10 perguntas
function exibirResultado() {
    const porcentagem = Math.round(((pontosAcumulados - 10) / 30) * 100);

    // Oculta contador e perguntas
    document.querySelector('.topo-card').style.display = 'none';
    textoPerguntaElemento.style.display = 'none';
    opcoesContainer.style.display = 'none';

    const resultadoContainer = document.getElementById('resultado-container');
    const tituloResultado = document.getElementById('titulo-resultado');
    const porcentagemTexto = document.getElementById('porcentagem-texto');
    const descricaoResultado = document.getElementById('descricao-resultado');

    porcentagemTexto.innerText = `${porcentagem}% Caiçara`;

    if (pontosAcumulados >= 33) {
        tituloResultado.innerText = "Caiçara da Raiz! 🌊";
        descricaoResultado.innerText = "O mar corre nas suas veias, você conhece cada canto do litoral e não troca esse estilo de vida por nada.";
    } else if (pontosAcumulados >= 25) {
        tituloResultado.innerText = "Caiçara de Coração! ☀️";
        descricaoResultado.innerText = "Você ama a praia, a culinária e o ritmo de vida, mesmo mantendo alguns hábitos da cidade.";
    } else if (pontosAcumulados >= 17) {
        tituloResultado.innerText = "Turista Frequente! 🏖️";
        descricaoResultado.innerText = "Você curte dar uma passeada no litoral e tomar um banho de mar, mas é urbano demais pra largar a cidade.";
    } else {
        tituloResultado.innerText = "Cientista da Cidade! 🏙️";
        descricaoResultado.innerText = "A areia incomoda, o mar é gelado e o ar-condicionado é seu melhor amigo. Passou longe do espírito caiçara!";
    }

    resultadoContainer.style.display = 'block';
}

// Inicializa a primeira pergunta ao carregar
renderizarPergunta();