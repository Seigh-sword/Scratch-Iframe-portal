const gameCardsContainer = document.getElementById('gameCards');
const gameFrame = document.getElementById('gameFrame');
const iframeContainer = document.getElementById('iframeContainer');
const backBtn = document.getElementById('backBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const minimizeBtn = document.getElementById('minimizeBtn');

// Load games list
fetch('gamesList.json')
  .then(res => res.json())
  .then(games => {
    games.forEach(game => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${game.name}</h3>
        <p>By: ${game.author}</p>
        <button>Play</button>
      `;

      card.querySelector('button').onclick = () => {
        gameFrame.src = `games/${game.folder}/index.html`;
        iframeContainer.style.display = "block";
        gameCardsContainer.style.display = "none";
      };

      gameCardsContainer.appendChild(card);
    });
  })
  .catch(err => console.error('Error loading games:', err));

// Back button
backBtn.addEventListener('click', () => {
  iframeContainer.style.display = "none";
  gameCardsContainer.style.display = "flex";
  gameFrame.src = "";
});

// Fullscreen
fullscreenBtn.addEventListener('click', () => {
  gameFrame.requestFullscreen();
});

// Minimize
minimizeBtn.addEventListener('click', () => {
  document.exitFullscreen();
});
