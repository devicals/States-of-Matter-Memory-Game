const gameBoard = document.getElementById('game-board');
const matchesDisplay = document.getElementById('matches');
const resetButton = document.getElementById('reset-button');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');
const closePopupButton = document.getElementById('close-popup-button');
const infoButton = document.getElementById('info-button');

const cardsData = [
    { term: 'Solid', definition: 'Fixed shape and volume' },
    { term: 'Liquid', definition: 'Fixed volume, takes shape of container' },
    { term: 'Gas', definition: 'No fixed shape or volume' },
    { term: 'Melting', definition: 'Solid to liquid transition' },
    { term: 'Evaporation', definition: 'Liquid to gas transition' },
    { term: 'Condensation', definition: 'Gas to liquid transition' },
    { term: 'Freezing', definition: 'Liquid to solid transition' },
    { term: 'Sublimation', definition: 'Solid to gas transition' },
    { term: 'Deposition', definition: 'Gas to solid transition' },
    { term: 'Plasma', definition: 'Fourth state of matter, ionized gas' },
    { term: 'Boiling Point', definition: 'Temperature at which a liquid becomes a gas' },
    { term: 'Melting Point', definition: 'Temperature at which a solid becomes a liquid' }
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let gameStarted = false;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCard(content, isDefinition) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">${content}</div>
            <div class="card-back">?</div>
        </div>
    `;
    card.dataset.content = content;
    card.dataset.isDefinition = isDefinition;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const content1 = card1.dataset.content;
    const content2 = card2.dataset.content;
    const isDefinition1 = card1.dataset.isDefinition === 'true';
    const isDefinition2 = card2.dataset.isDefinition === 'true';

    const isMatch = cardsData.some(item => 
        (item.term === content1 && item.definition === content2 && !isDefinition1 && isDefinition2) ||
        (item.term === content2 && item.definition === content1 && !isDefinition2 && isDefinition1)
    );

    if (isMatch) {
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        matchedPairs++;
        matchesDisplay.textContent = matchedPairs;
    } else {
        // Change background to red for a second
        card1.querySelector('.card-front').style.backgroundColor = '#e74c3c';
        card2.querySelector('.card-front').style.backgroundColor = '#e74c3c';
        
        setTimeout(() => {
            // Change back to green
            card1.querySelector('.card-front').style.backgroundColor = '';
            card2.querySelector('.card-front').style.backgroundColor = '';
            
            // Flip cards back
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }

    flippedCards = [];

    if (matchedPairs === 6) {
        setTimeout(() => alert('Congratulations! You\'ve matched all the pairs!'), 500);
    }
}

function initializeGame() {
    gameBoard.innerHTML = '';
    matchedPairs = 0;
    matchesDisplay.textContent = '0';
    gameStarted = false;

    // Randomly select 6 pairs
    shuffleArray(cardsData);
    const selectedPairs = cardsData.slice(0, 6);

    cards = [
        ...selectedPairs.map(item => ({ content: item.term, isDefinition: false })),
        ...selectedPairs.map(item => ({ content: item.definition, isDefinition: true }))
    ];
    shuffleArray(cards);

    cards.forEach(card => {
        const cardElement = createCard(card.content, card.isDefinition);
        gameBoard.appendChild(cardElement);
    });
}

function showPopup() {
    popup.classList.remove('hidden');
}

function hidePopup() {
    popup.classList.add('hidden');
    if (!gameStarted) {
        startGame();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
        hidePopup();
    }
});

function startGame() {
    if (gameStarted) return;
    
    gameStarted = true;
    // Show cards for 1.5 seconds, then hide them
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('flipped');
        });

        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('flipped');
            });
        }, 1500);
    }, 500);
}

resetButton.addEventListener('click', () => {
    initializeGame();
    startGame();
});
closePopup.addEventListener('click', hidePopup);
closePopupButton.addEventListener('click', hidePopup);
infoButton.addEventListener('click', showPopup);

// Initialize the game and show popup on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    showPopup();
});