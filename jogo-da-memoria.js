const grid = document.querySelector('.grid');

const images = [
    'ilha-jogo',
    'caranguejo-jogo',
    'fandango-jogo',
    'tainha-jogo',
    'porto-jogo',
    'mercado-jogo',
];

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

const createCard = (image) => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');

    front.style.backgroundImage = `url('imagens/${image}.png')`;

    card.appendChild(front);
    card.appendChild(back);

    return card;
}

const loadGame = () => {
    
    images.forEach((image) => {

    const card = createCard(image);
    grid.appendChild(card);

    });

}

loadGame();