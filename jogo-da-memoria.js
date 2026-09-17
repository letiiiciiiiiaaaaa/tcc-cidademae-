const grid = document.querySelector('.grid');

const cards = [
    'caranguejo-jogo',
    'aquario-jogo',
];

const createElement = (tag, className) => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

const createCard = () => {
    const card = createElement('div', 'card');
    const front = createElement('div', 'face front');
    const back = createElement('div', 'face back');

    card.appendChild(front);
    card.appendChild(back);

    return card;
}

const loadGame = () => {
    cards.forEach((card) => {
        console.log(card);
    });

}

loadGame();