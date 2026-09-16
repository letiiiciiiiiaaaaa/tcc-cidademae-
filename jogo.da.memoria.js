const grid = document.querySelector('.grid');

const criaCarta = () => {
    const card = document.createElement('div');
    const frente = document.createElement('div');
    const atras = document.createElement('div');

    card.className = 'card';
    frente.className = 'face frente';
    atras.className = 'face atras';

    card.appendChild(frente);
    card.appendChild(atras);

    grid.appendChild(card);
}

criaCarta();