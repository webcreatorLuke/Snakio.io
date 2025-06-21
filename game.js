const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');

const gridSize = 20; // size of each grid square
const canvasSize = 400; // canvas is 400x400px

let snake, direction, food, score, gameInterval, gameOver;

function randomGridPosition() {
    // Returns an [x, y] where x, y are multiples of gridSize and within bounds
    return [
        Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize,
        Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize
    ];
}

function restartGame() {
    snake = [
        {x: gridSize * 5, y: gridSize * 5},
        {x: gridSize * 4, y: gridSize * 5},
        {x: gridSize * 3, y: gridSize * 5}
    ];
    direction = {x: gridSize, y: 0};
    food = null;
    score = 0;
    gameOver = false;
    scoreDiv.textContent = "Score: 0";
    placeFood();
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

function placeFood() {
    let valid = false;
    while (!valid) {
        let pos = randomGridPosition();
        valid = !snake.some(segment => segment.x === pos[0] && segment.y === pos[1]);
        if (valid) {
            food = {x: pos[0], y: pos[1]};
        }
    }
}

function gameLoop() {
    if (gameOver) return;
    // Move snake
    const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Check wall collision
    if (
        newHead.x < 0 || newHead.x >= canvasSize ||
        newHead.y < 0 || newHead.y >= canvasSize
    ) {
        endGame();
        return;
    }

    // Check self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }

    // Add new head to snake
    snake.unshift(newHead);

    // Check if food eaten
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        scoreDiv.textContent = "Score: " + score;
        placeFood();
    } else {
        // Remove tail
        snake.pop();
    }

    // Draw everything
    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw snake
    ctx.fillStyle = "#00FF00";
    snake.forEach((segment, idx) => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        // Eyes for the head
        if (idx === 0) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(segment.x + 4, segment.y + 4, 4, 4);
            ctx.fillRect(segment.x + 12, segment.y + 4, 4, 4);
            ctx.fillStyle = "#00FF00";
        }
    });

    // Draw food (block)
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    ctx.fillStyle = "#fff";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvasSize / 2, canvasSize / 2 - 10);
    ctx.font = "24px Arial";
    ctx.fillText("Score: " + score, canvasSize / 2, canvasSize / 2 + 30);
}

window.addEventListener('keydown', e => {
    if (gameOver) return;
    let newDir;
    if (e.key === "ArrowUp" && direction.y === 0) newDir = {x: 0, y: -gridSize};
    if (e.key === "ArrowDown" && direction.y === 0) newDir = {x: 0, y: gridSize};
    if (e.key === "ArrowLeft" && direction.x === 0) newDir = {x: -gridSize, y: 0};
    if (e.key === "ArrowRight" && direction.x === 0) newDir = {x: gridSize, y: 0};
    if (newDir) direction = newDir;
});

restartGame();


















// --- Add this after your main <script> in the HTML, or inside your main script if you prefer ---

// =============== Daily Reward System ==============
const dailyBtn = document.getElementById('daily-btn');
const dailyClaimed = document.getElementById('daily-claimed');
const rewardPopup = document.getElementById('reward-popup');

// Daily reward logic
function canClaimDaily() {
    const last = localStorage.getItem('snake_daily_claim');
    if (!last) return true;
    const lastDate = new Date(parseInt(last));
    const now = new Date();
    return now.toDateString() !== lastDate.toDateString();
}
function claimDaily() {
    localStorage.setItem('snake_daily_claim', Date.now());
    showRewardPopup('Daily Reward: +5 coins!');
    dailyBtn.disabled = true;
    dailyClaimed.style.display = '';
}
function setupDaily() {
    if (canClaimDaily()) {
        dailyBtn.disabled = false;
        dailyClaimed.style.display = 'none';
    } else {
        dailyBtn.disabled = true;
        dailyClaimed.style.display = '';
    }
}
dailyBtn.onclick = claimDaily;
setupDaily();

// =============== Quest System ==============
let questProgress = 0;
const questGoal = 5;
const questProgressSpan = document.getElementById('quest-progress');
const questRewardSpan = document.getElementById('quest-reward');

function checkQuest() {
    if (questProgress >= questGoal) {
        questRewardSpan.style.display = '';
        showRewardPopup('Quest Complete! +10 coins!');
    }
}

// Call this when the player eats a food/cube:
function onCubeEaten() {
    questProgress++;
    questProgressSpan.textContent = questProgress;
    checkQuest();
}

// =============== Reward Popup ==============
function showRewardPopup(msg) {
    rewardPopup.textContent = msg;
    rewardPopup.style.display = '';
    setTimeout(() => {
        rewardPopup.style.display = 'none';
    }, 2200);
}

// =============== INTEGRATION ==============
// In your food-eating code, call onCubeEaten():
// Example: after you increment score in moveSnake() when eating food, add:
onCubeEaten();

// In your game restart/init function, also reset quest UI if needed:
questProgress = 0;
questProgressSpan.textContent = questProgress;
questRewardSpan.style.display = 'none';
setupDaily();

const game = zip.folder("game");
game.file("index.html", "<html>...</html>");
game.file("assets/logo.png", someBinaryData);
