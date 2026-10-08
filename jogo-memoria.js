const grid = document.querySelector('.grid');
const timer = document.querySelector('.timer'); // Ajustado para querySelector (classe .timer)
const placarPontos = document.getElementById('btn-pontuacao'); // Ajustado para id="btn-pontuacao"

// Modais
const modalInicio = document.getElementById('modal-inicio');
const modalDificuldade = document.getElementById('modal-dificuldade');
const modalFim = document.getElementById('modal-fim');

// Botões
const btnVoltar = document.getElementById('btn-voltar');
const btnJogar = document.getElementById('btn-jogar');
const btnsDificuldade = document.querySelectorAll('.btn-dif1, .btn-dif2, .btn-dif3');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnJogarNovamente = document.getElementById('btn-jogar-novamente');
const btnPerfil = document.getElementById('btn-perfil');

// Textos do Modal de Fim
const tituloFim = document.getElementById('titulo-fim');
const mensagemFim = document.getElementById('mensagem-fim');

// --- VARIÁVEIS DE ESTADO DO JOGO ---
const characters = [
    'ilha-jogo',
    'mercado-jogo',
    'caranguejo-jogo',
    'tainha-jogo',
    'fandango-jogo',
    'porto-jogo',
];

let firstCard = '';
let secondCard = '';
let canPlay = false;

let currentScore = 0;
let pointsPerPair = 50;

let totalTime = 180;
let currentTime = 0;
let timerInterval = null;

// --- CRIAÇÃO E LÓGICA DAS CARTAS ---

// Cria os elementos HTML de cada carta
const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

// Checa se todas as cartas foram encontradas
const checkEndGame = () => {
    const disabledCards = document.querySelectorAll('.disabled-card');

    if (disabledCards.length === 12) {
        clearInterval(timerInterval);
        canPlay = false;

        salvarMaiorPontuacao(currentScore); // Salva no localStorage para a página de perfil
        dispararConfetes();

        tituloFim.innerHTML = "Parabéns!";
        mensagemFim.innerHTML = `Você completou o jogo! <br> <span style="display: block; margin-top: 10px; font-size: 20px;"> Pontuação Final: <strong style="color: #f39c12; font-size: 24px;">${currentScore} pontos</strong></span>`;
        modalFim.classList.remove('fechar');
    }
};

// Compara se as duas cartas viradas são iguais
const checkCards = () => {
    const firstCharacter = firstCard.getAttribute('data-character');
    const secondCharacter = secondCard.getAttribute('data-character');

    if (firstCharacter === secondCharacter) {
        firstCard.firstChild.classList.add('disabled-card');
        secondCard.firstChild.classList.add('disabled-card');

        // Soma os pontos do par de acordo com a dificuldade
        currentScore += pointsPerPair;
        if (placarPontos) placarPontos.innerHTML = currentScore;

        firstCard = '';
        secondCard = '';

        checkEndGame();
    } else {
        // Se errou o par, espera 500ms e desvira ambas as cartas
        setTimeout(() => {
            if (firstCard) firstCard.classList.remove('reveal-card');
            if (secondCard) secondCard.classList.remove('reveal-card');

            firstCard = '';
            secondCard = '';
        }, 500);
    }
};

// Lógica ao clicar/virar uma carta
const revealCard = ({ target }) => {
    if (!canPlay) return;

    const parentCard = target.parentNode;

    // Impede clicar na mesma carta duas vezes ou em cartas já reveladas
    if (parentCard.classList.contains('reveal-card') || parentCard.classList.contains('grid') || !parentCard.classList.contains('card')) {
        return;
    }

    if (firstCard === '') {
        parentCard.classList.add('reveal-card');
        firstCard = parentCard;
    } else if (secondCard === '') {
        parentCard.classList.add('reveal-card');
        secondCard = parentCard;

        checkCards();
    }
};

// Instancia uma carta
const createCard = (character) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');

    front.style.backgroundImage = `url('./imagens/${character}.png')`;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', revealCard);
    card.setAttribute('data-character', character);

    return card;
};

// Carrega e embaralha o jogo no grid
const loadGame = () => {
    grid.innerHTML = '';
    const duplicateCharacters = [...characters, ...characters];
    const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

    shuffledArray.forEach((character) => {
        const card = createCard(character);
        grid.appendChild(card);
    });
};

// --- TEMPORIZADOR E CONTROLE DE FLUXO ---

// Formata segundos para o padrão MM:SS
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Inicia a contagem regressiva
const startTimer = () => {
    currentTime = totalTime;
    if (timer) timer.innerHTML = formatTime(currentTime);

    timerInterval = setInterval(() => {
        currentTime--;
        if (timer) timer.innerHTML = formatTime(currentTime);

        if (currentTime <= 0) {
            clearInterval(timerInterval);
            canPlay = false;

            salvarMaiorPontuacao(currentScore); // Salva a pontuação feita até o tempo acabar

            tituloFim.innerHTML = "Tempo Esgotado!";
            mensagemFim.innerHTML = `O tempo acabou!<br>
                <span style="display: block; margin-top: 10px; font-size: 20px;">Sua pontuação: <strong style="color: #f39c12; font-size: 24px;">${currentScore} pontos</strong></span>`;
            
            modalFim.classList.remove('fechar');
        }
    }, 1000);
};

// Espiadinha inicial de 3 segundos nas cartas
const startPreviewAndGame = () => {
    loadGame();
    canPlay = false;

    // Revela todas as cartas temporariamente
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.add('reveal-card'));

    // Após 3 segundos, desvira as cartas e libera a partida
    setTimeout(() => {
        allCards.forEach(card => card.classList.remove('reveal-card'));
        canPlay = true;
        startTimer();
    }, 3000);
};

// Reseta o estado geral do jogo e paralisa o relógio imediatamente
const resetGameState = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    canPlay = false;
    currentScore = 0;
    if (placarPontos) placarPontos.innerHTML = currentScore;
    if (timer) timer.innerHTML = "00:00";
    grid.innerHTML = '';
};

// --- RECORDE E EFEITOS ESPECIAIS ---

const salvarMaiorPontuacao = (pontosAtuais) => {
    const maiorPontuacaoSalva = parseInt(localStorage.getItem('maiorPontuacao')) || 0;
    if (pontosAtuais > maiorPontuacaoSalva) {
        localStorage.setItem('maiorPontuacao', pontosAtuais);
    }
};

const dispararConfetes = () => {
    if (typeof confetti !== 'function') return;

    const duracao = 3 * 1000;
    const fim = Date.now() + duracao;

    const interval = setInterval(() => {
        if (Date.now() > fim) {
            return clearInterval(interval);
        }

        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.8 }
        });

        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.8 }
        });
    }, 50);
};

// --- OUVINTES DE EVENTOS (LISTENERS) ---

// Botão 'JOGAR' na tela inicial
btnJogar.addEventListener('click', () => {
    modalInicio.classList.add('fechar');
    modalDificuldade.classList.remove('fechar');
});

// Seleção de Dificuldades (Fácil, Médio, Difícil)
btnsDificuldade.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const button = e.target.closest('.btn-dif1, .btn-dif2, .btn-dif3');
        if (!button) return;

        totalTime = parseInt(button.getAttribute('data-time'));
        pointsPerPair = parseInt(button.getAttribute('data-points'));

        modalDificuldade.classList.add('fechar');
        startPreviewAndGame();
    });
});

// Botão de Reiniciar durante a partida
btnReiniciar.addEventListener('click', () => {
    resetGameState();
    modalInicio.classList.remove('fechar');
});

// Botão 'Jogar Novamente'
btnJogarNovamente.addEventListener('click', () => {
    modalFim.classList.add('fechar');
    modalDificuldade.classList.remove('fechar');
});

// Botão 'Ver Perfil'
if (btnPerfil) {
    btnPerfil.addEventListener('click', () => {
        window.location.href = 'perfil.html';
    });
}

if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
        window.history.back();
    });
}