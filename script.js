const gameArea = document.getElementById('game-area');
const scoreboard = document.getElementById('scoreboard');
const startBtn = document.getElementById('start-btn');

const modal = document.getElementById('game-over-modal');
const finalScoreText = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

const scoreList = document.getElementById('score-list');

let score = 0;
let timeLeft = 30;
let timer;

// Load scores
let highScores = JSON.parse(localStorage.getItem('scores')) || [];

// Spawn target
function spawnTarget() {
    const existing = document.querySelector('.target');
    if (existing) existing.remove();

    const target = document.createElement('i');
    target.className = 'fa-solid fa-bullseye target';

    const x = Math.random() * (gameArea.clientWidth - 40);
    const y = Math.random() * (gameArea.clientHeight - 40);

    target.style.left = x + 'px';
    target.style.top = y + 'px';

    target.onclick = () => {
        score++;
        updateUI();
        spawnTarget();
    };

    gameArea.appendChild(target);
}

// Update UI
function updateUI() {
    scoreboard.textContent = `Score: ${score} | Time: ${timeLeft}s`;
}

// Timer
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateUI();

        if (timeLeft <= 0) endGame();
    }, 1000);
}

// End game
function endGame() {
    clearInterval(timer);

    document.querySelector('.target')?.remove();

    // Save score
    highScores.push({ score, time: 30 });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 5);

    localStorage.setItem('scores', JSON.stringify(highScores));

    displayScores();

    finalScoreText.textContent = `Score: ${score}`;
    modal.style.display = 'flex';

    startBtn.disabled = false;
}

// Display scores
function displayScores() {
    scoreList.innerHTML = '';

    highScores.forEach((s, i) => {
        const li = document.createElement('li');
        li.textContent = `#${i+1} - ${s.score} pts`;
        scoreList.appendChild(li);
    });
}

// Start game
startBtn.onclick = () => {
    score = 0;
    timeLeft = 30;
    updateUI();

    startBtn.disabled = true;

    spawnTarget();
    startTimer();
};

// Restart
restartBtn.onclick = () => {
    modal.style.display = 'none';
    startBtn.click();
};

// Init
displayScores();