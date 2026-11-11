document.addEventListener('DOMContentLoaded', async () => {
    const usuarioLogado = localStorage.getItem('usuarioLogado') || localStorage.getItem('usuario_nome');

    if (!usuarioLogado) {
        sessionStorage.setItem('voltarPara', 'jogo-memoria.html');

        // Cria o modal de aviso sem travar a página
        const modalAviso = document.createElement('div');
        modalAviso.className = 'modal-overlay';
        modalAviso.style.zIndex = '99999';

        modalAviso.innerHTML = `
            <div class="modal-content" style="text-align: center; padding: 30px;">
                <h2 style="color: #333; margin-bottom: 15px;">Acesso Restrito</h2>
                <p style="color: #666; margin-bottom: 25px; font-size: 18px;">Você precisa estar logado para jogar o Jogo da Memória!</p>
                <button onclick="window.location.href='cadastro.html'" style="background-color: #65cc69; color: white; padding: 10px 20px; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: bold;">Fazer Login / Cadastro</button>
            </div>
        `;
        document.body.appendChild(modalAviso);

        // Retorna sem carregar o jogo, mas deixa o HTML e CSS renderizarem normal
        return;
    }

    // Se estiver logado, carrega o jogo normal
    loadGame();
});

const grid = document.querySelector('.grid');
const timer = document.querySelector('.timer');
const placarPontos = document.getElementById('btn-pontuacao');

const modalInicio = document.getElementById('modal-inicio');
const modalDificuldade = document.getElementById('modal-dificuldade');
const modalFim = document.getElementById('modal-fim');

const btnVoltar = document.getElementById('btn-voltar');
const btnJogar = document.getElementById('btn-jogar');
const btnsDificuldade = document.querySelectorAll('.btn-dif1, .btn-dif2, .btn-dif3');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnJogarNovamente = document.getElementById('btn-jogar-novamente');
const btnPerfil = document.getElementById('btn-perfil');

const tituloFim = document.getElementById('titulo-fim');
const mensagemFim = document.getElementById('mensagem-fim');

const characters = [
    'ilha-jogo', 'mercado-jogo', 'caranguejo-jogo',
    'tainha-jogo', 'fandango-jogo', 'porto-jogo',
];

let firstCard = '';
let secondCard = '';
let canPlay = false;
let currentScore = 0;
let pointsPerPair = 50;
let totalTime = 180;
let currentTime = 0;
let timerInterval = null;

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

const salvarMaiorPontuacao = async (pontosAtuais) => {
    const maiorPontuacaoSalva = parseInt(localStorage.getItem('maiorPontuacao')) || 0;

    if (pontosAtuais > maiorPontuacaoSalva) {
        localStorage.setItem('maiorPontuacao', pontosAtuais);

        const usuarioId = localStorage.getItem('usuario_id');

        if (usuarioId && usuarioId !== "undefined" && typeof supabase !== 'undefined') {
            const SUPABASE_URL = "https://yehhopwozpguzhgioztv.supabase.co";
            const SUPABASE_ANON_KEY = "sb_publishable_65-1hzodlk2BYCAzg5SgHg_xuILMBb2";
            const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

            try {
                await supabaseClient
                    .from('usuarios')
                    .update({ jogo_pontos: pontosAtuais })
                    .eq('idusuarios', usuarioId);
            } catch (err) {
                console.error("Erro de conexão com o banco:", err);
            }
        }
    }
};

const checkEndGame = () => {
    const disabledCards = document.querySelectorAll('.disabled-card');
    if (disabledCards.length === 12) {
        clearInterval(timerInterval);
        canPlay = false;

        salvarMaiorPontuacao(currentScore);
        dispararConfetes();

        tituloFim.innerHTML = "Parabéns!";
        mensagemFim.innerHTML = `Você completou o jogo! <br> <span style="display: block; margin-top: 10px; font-size: 20px;"> Pontuação Final: <strong style="color: #f39c12; font-size: 24px;">${currentScore} pontos</strong></span>`;
        modalFim.classList.remove('fechar');
    }
};

const checkCards = () => {
    const firstCharacter = firstCard.getAttribute('data-character');
    const secondCharacter = secondCard.getAttribute('data-character');

    if (firstCharacter === secondCharacter) {
        firstCard.firstChild.classList.add('disabled-card');
        secondCard.firstChild.classList.add('disabled-card');
        currentScore += pointsPerPair;
        if (placarPontos) placarPontos.innerHTML = currentScore;
        firstCard = '';
        secondCard = '';
        checkEndGame();
    } else {
        setTimeout(() => {
            if (firstCard) firstCard.classList.remove('reveal-card');
            if (secondCard) secondCard.classList.remove('reveal-card');
            firstCard = '';
            secondCard = '';
        }, 500);
    }
};

const revealCard = ({ target }) => {
    if (!canPlay) return;
    const parentCard = target.parentNode;
    if (parentCard.classList.contains('reveal-card') || parentCard.classList.contains('grid') || !parentCard.classList.contains('card')) return;

    if (firstCard === '') {
        parentCard.classList.add('reveal-card');
        firstCard = parentCard;
    } else if (secondCard === '') {
        parentCard.classList.add('reveal-card');
        secondCard = parentCard;
        checkCards();
    }
};

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

const loadGame = () => {
    grid.innerHTML = '';
    const duplicateCharacters = [...characters, ...characters];
    const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);
    shuffledArray.forEach((character) => grid.appendChild(createCard(character)));
};

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const startTimer = () => {
    currentTime = totalTime;
    if (timer) timer.innerHTML = formatTime(currentTime);
    timerInterval = setInterval(() => {
        currentTime--;
        if (timer) timer.innerHTML = formatTime(currentTime);
        if (currentTime <= 0) {
            clearInterval(timerInterval);
            canPlay = false;

            salvarMaiorPontuacao(currentScore);

            tituloFim.innerHTML = "Tempo Esgotado!";
            mensagemFim.innerHTML = `O tempo acabou!<br><span style="display: block; margin-top: 10px; font-size: 20px;">Sua pontuação: <strong style="color: #f39c12; font-size: 24px;">${currentScore} pontos</strong></span>`;
            modalFim.classList.remove('fechar');
        }
    }, 1000);
};

const startPreviewAndGame = () => {
    loadGame();
    canPlay = false;
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => card.classList.add('reveal-card'));
    setTimeout(() => {
        allCards.forEach(card => card.classList.remove('reveal-card'));
        canPlay = true;
        startTimer();
    }, 3000);
};

const resetGameState = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    canPlay = false;
    currentScore = 0;
    if (placarPontos) placarPontos.innerHTML = currentScore;
    if (timer) timer.innerHTML = "00:00";
    loadGame(); 
};

const dispararConfetes = () => {
    if (typeof confetti !== 'function') return;
    const duracao = 3 * 1000;
    const fim = Date.now() + duracao;
    const interval = setInterval(() => {
        if (Date.now() > fim) return clearInterval(interval);
        confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.8 } });
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.8 } });
    }, 50);
};

btnJogar.addEventListener('click', () => {
    modalInicio.classList.add('fechar');
    modalDificuldade.classList.remove('fechar');
});

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

btnReiniciar.addEventListener('click', () => {
    resetGameState();
    modalInicio.classList.remove('fechar');
});

btnJogarNovamente.addEventListener('click', () => {
    modalFim.classList.add('fechar');
    modalDificuldade.classList.remove('fechar');
});

if (btnPerfil) btnPerfil.addEventListener('click', () => window.location.href = 'perfil.html');
if (btnVoltar) btnVoltar.addEventListener('click', () => window.history.back());

document.addEventListener('DOMContentLoaded', () => {
    const btnFecharMemoria = document.getElementById('btn-fechar-memoria');
    const modalAlerta = document.getElementById('modal-confirmar-saida-memoria');
    const btnConfirmarSair = document.getElementById('btn-confirmar-sair-memoria');
    const btnCancelarSair = document.getElementById('btn-cancelar-sair-memoria');

    function voltarParaOrigem() {
        const origem = sessionStorage.getItem('origemJogo');
        sessionStorage.removeItem('origemJogo');

        if (origem && !origem.includes('jogo-memoria.html')) {
            window.location.href = origem;
        } else if (document.referrer && !document.referrer.includes('jogo-memoria.html')) {
            window.location.href = document.referrer;
        } else {
            window.location.href = 'index.html';
        }
    }

    if (btnFecharMemoria) {
        btnFecharMemoria.addEventListener('click', () => {
            if (modalAlerta) modalAlerta.style.display = 'flex';
        });
    }

    if (btnConfirmarSair) {
        btnConfirmarSair.addEventListener('click', voltarParaOrigem);
    }

    if (btnCancelarSair) {
        btnCancelarSair.addEventListener('click', () => {
            if (modalAlerta) modalAlerta.style.display = 'none';
        });
    }
});