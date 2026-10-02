const grid = document.querySelector('.grid');
const timer = document.querySelector('.timer');
const placarPontos = document.getElementById('btn-pontuacao');
const btnReiniciar = document.getElementById('btn-reiniciar');

// Elementos dos Modais
const modalInicio = document.getElementById('modal-inicio');
const modalDificuldade = document.getElementById('modal-dificuldade');
const modalFim = document.getElementById('modal-fim');
const btnJogar = document.getElementById('btn-jogar');
const btnJogarNovamente = document.getElementById('btn-jogar-novamente');
const btnsDificuldade = document.querySelectorAll('.btn-diff');
const tituloFim = document.getElementById('titulo-fim');
const mensagemFim = document.getElementById('mensagem-fim');

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
let totalTime = 0;
let currentTime = 0;
let pointsPerPair = 0;
let currentScore = 0;
let timerInterval = null;
let canPlay = false;

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

// Formatação do tempo MM:SS
const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Controle de Fim de Jogo
const checkEndGame = () => {
    const disabledCards = document.querySelectorAll('.disabled-card');

    // São 6 pares = 12 cartas no total
    if (disabledCards.length === 12) {
        clearInterval(timerInterval);
        canPlay = false;
        
        tituloFim.innerHTML = "Parabéns!";
        mensagemFim.innerHTML = `Você completou o jogo!<br><strong>Pontuação Final: ${currentScore} pontos</strong>`;
        modalFim.classList.remove('fechar');
    }
};

const checkCards = () => {
    const firstCharacter = firstCard.getAttribute('data-character');
    const secondCharacter = secondCard.getAttribute('data-character');

    if (firstCharacter === secondCharacter) {
        firstCard.firstChild.classList.add('disabled-card');
        secondCard.firstChild.classList.add('disabled-card');

        // Soma os pontos de acordo com a dificuldade
        currentScore += pointsPerPair;
        placarPontos.innerHTML = currentScore;

        firstCard = '';
        secondCard = '';

        checkEndGame();
    } else {
        setTimeout(() => {
            firstCard.classList.remove('reveal-card');
            secondCard.classList.remove('reveal-card');

            firstCard = '';
            secondCard = '';
        }, 500);
    }
};

const revealCard = ({ target }) => {
    if (!canPlay) return;

    const card = target.parentNode;

    if (card.classList.contains('reveal-card') || card.querySelector('.disabled-card')) {
        return;
    }

    if (firstCard === '') {
        card.classList.add('reveal-card');
        firstCard = card;
    } else if (secondCard === '') {
        card.classList.add('reveal-card');
        secondCard = card;

        checkCards();
    }
};

const createCard = (character) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');

    front.style.backgroundImage = `url('imagens/${character}.png')`;

    card.appendChild(front);
    card.appendChild(back);

    card.addEventListener('click', revealCard);
    card.setAttribute('data-character', character);

    return card;
};

const loadGame = () => {
    grid.innerHTML = '';
    const duplicateCharacters = [...characters, ...characters];
    const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

    shuffledArray.forEach((character) => {
        const card = createCard(character);
        grid.appendChild(card);
    });
};

const startTimer = () => {
    clearInterval(timerInterval);
    currentTime = totalTime;
    timer.innerHTML = formatTime(currentTime);

    timerInterval = setInterval(() => {
        currentTime--;
        timer.innerHTML = formatTime(currentTime);

        if (currentTime <= 0) {
            clearInterval(timerInterval);
            canPlay = false;

            tituloFim.innerHTML = "Tempo Esgotado!";
            mensagemFim.innerHTML = `O tempo acabou!<br><strong>Sua pontuação: ${currentScore} pontos</strong>`;
            modalFim.classList.remove('fechar');
        }
    }, 1000);
};

// Inicia o processo de revelação temporária antes de liberar o jogo
const startPreviewAndGame = () => {
    loadGame();
    canPlay = false;
    currentScore = 0;
    placarPontos.innerHTML = currentScore;

    const cards = document.querySelectorAll('.card');

    // Revela todas as cartas
    cards.forEach(card => card.classList.add('reveal-card'));

    // Espera 3 segundos, desvira as cartas e começa o jogo/tempo
    setTimeout(() => {
        cards.forEach(card => card.classList.remove('reveal-card'));
        canPlay = true;
        startTimer();
    }, 3000);
};

// Eventos
btnJogar.addEventListener('click', () => {
    modalInicio.classList.add('fechar');
    modalDificuldade.classList.remove('fechar');
});

btnsDificuldade.forEach(btn => {
    btn.addEventListener('click', (e) => {
        totalTime = parseInt(e.target.getAttribute('data-time'));
        pointsPerPair = parseInt(e.target.getAttribute('data-points'));

        modalDificuldade.classList.add('fechar');
        startPreviewAndGame();
    });
});

btnReiniciar.addEventListener('click', () => {
    if (totalTime === 0) return; // Se a dificuldade ainda não foi escolhida
    startPreviewAndGame();
});

btnJogarNovamente.addEventListener('click', () => {
    modalFim.classList.add('fechar');
    modalDificuldade.classList.remove('fechar');
});