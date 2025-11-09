// -----------------------------
// Elements
// -----------------------------
const gameCardsContainer = document.getElementById('gameCards');
const iframeContainer = document.getElementById('iframeContainer');
const gameFrame = document.getElementById('gameFrame');
const backBtn = document.getElementById('backBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const clickSound = new Audio('assets/click-sfx.mp3');

const searchInput = document.getElementById('searchInput');
const sortFavBtn = document.getElementById('sortFavBtn');

// -----------------------------
// Globals
// -----------------------------
const loadedGames = new Set();
let gamesData = [];

// -----------------------------
// Helper Functions
// -----------------------------
function playClick() {
    clickSound.currentTime = 0;
    clickSound.play();
}

function createCard(game) {
    const card = document.createElement('div');
    card.className = 'card';

    // Fallback thumbnail
    const thumbnailPath = `games/${game.folder}/tumbnail.png`;
    const img = document.createElement('img');
    img.className = 'thumbnail';
    img.alt = 'Thumbnail';
    img.src = thumbnailPath;
    img.onerror = () => { img.src = 'assets/default-thumbnail.png'; };

    // Card innerHTML
    card.appendChild(img);
    const title = document.createElement('h3');
    title.textContent = game.name;
    card.appendChild(title);

    const author = document.createElement('p');
    author.textContent = `By: ${game.author}`;
    card.appendChild(author);

    // Play button
    const playBtn = document.createElement('button');
    playBtn.textContent = 'Play';
    playBtn.onclick = () => {
        playClick();
        gameFrame.src = `games/${game.folder}/index.html`;
        iframeContainer.style.display = 'flex';
        gameCardsContainer.style.display = 'none';
    };
    card.appendChild(playBtn);

    // Favorite star
    const favContainer = document.createElement('div');
    favContainer.className = 'favorite-container';
    const favBtn = document.createElement('img');
    favBtn.className = 'favoriteBtn';
    favBtn.src = localStorage.getItem(game.folder + '-fav') === 'true' ? 'assets/star-yes.png' : 'assets/star-no.png';
    let isFav = favBtn.src.includes('star-yes.png');

    favBtn.onclick = () => {
        playClick();
        isFav = !isFav;
        favBtn.src = isFav ? 'assets/star-yes.png' : 'assets/star-no.png';
        favBtn.classList.add('clicked');
        setTimeout(() => favBtn.classList.remove('clicked'), 300);
        localStorage.setItem(game.folder + '-fav', isFav);
    };

    favContainer.appendChild(favBtn);
    card.appendChild(favContainer);

    gameCardsContainer.appendChild(card);
}

// -----------------------------
// Load Games JSON
// -----------------------------
fetch('gamesList.json')
    .then(res => res.json())
    .then(games => {
        gamesData = games;
        games.forEach(game => {
            if (!loadedGames.has(game.folder)) {
                loadedGames.add(game.folder);
                createCard(game);
            }
        });
    })
    .catch(err => console.error('Error loading games:', err));

// -----------------------------
// Iframe Controls
// -----------------------------
backBtn.addEventListener('click', () => {
    playClick();
    iframeContainer.style.display = 'none';
    gameCardsContainer.style.display = 'flex';
    gameFrame.src = '';
});

fullscreenBtn.addEventListener('click', () => {
    playClick();
    if (gameFrame.requestFullscreen) gameFrame.requestFullscreen();
});

// -----------------------------
// Search Filter
// -----------------------------
searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    gameCardsContainer.innerHTML = '';
    gamesData.filter(game => game.name.toLowerCase().includes(term) || game.author.toLowerCase().includes(term))
             .forEach(game => createCard(game));
});

// -----------------------------
// Sort by Favorite
// -----------------------------
sortFavBtn.addEventListener('click', () => {
    gameCardsContainer.innerHTML = '';
    gamesData
        .sort((a, b) => {
            const aFav = localStorage.getItem(a.folder + '-fav') === 'true';
            const bFav = localStorage.getItem(b.folder + '-fav') === 'true';
            return bFav - aFav;
        })
        .forEach(game => createCard(game));
});
