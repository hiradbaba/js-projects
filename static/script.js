// Snake Game
// Canvas and game setup
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;
// document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Colors
const BG_COLOR = '#000000'; // Black
const SNAKE_COLOR = '#7FDBFF'; // Light blue
const APPLE_COLOR = '#FF4136'; // Red

// Game settings
const gridSize = 20; // Size of each cell
const tileCountX = Math.floor(canvas.width / gridSize);
const tileCountY = Math.floor(canvas.height / gridSize);

// Game state
let gameState = 'menu'; // 'menu', 'playing', 'gameover'
let score = 0;
let initialLength = 5;

// Snake
let snake = [{ x: 10, y: 10 }];
let snakeLength = initialLength;
let dx = 1;
let dy = 0;

// Apple
let apple = { x: 15, y: 10 };

// Game loop
let gameInterval = null;

function startGame() {
    snake = [{ x: 10, y: 10 }];
    snakeLength = initialLength;
    dx = 1;
    dy = 0;
    score = 0;
    placeApple();
    gameState = 'playing';
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
    draw();
}

function gameLoop() {
    if (gameState !== 'playing') return;
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (snake.length > snakeLength) snake.pop();

    // Check collision with apple
    if (head.x === apple.x && head.y === apple.y) {
        snakeLength++;
        score+=10;
        placeApple();
    }

    // Check collision with walls or self
    if (
        head.x < 0 || head.x >= tileCountX ||
        head.y < 0 || head.y >= tileCountY ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameInterval);
        gameState = 'gameover';
        draw();
        return;
    }

    draw();
}

function draw() {
    // Draw background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'menu') {
        drawMenu();
    } else if (gameState === 'playing') {
        // Draw snake
        ctx.fillStyle = SNAKE_COLOR;
        for (const segment of snake) {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        }
        // Draw apple (as a red circle)
        ctx.beginPath();
        ctx.arc(
            apple.x * gridSize + gridSize / 2,
            apple.y * gridSize + gridSize / 2,
            gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = APPLE_COLOR;
        ctx.fill();
        // Draw score
        ctx.font = '20px monospace';
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText('SCORE: ' + score, 20, 40);
    } else if (gameState === 'gameover') {
        drawGameOver();
    }
}

function drawMenu() {
    ctx.font = '40px monospace';
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('SNAKE GAME', canvas.width / 2, canvas.height / 2 - 60);
    // Draw start button
    ctx.fillStyle = '#222';
    ctx.fillRect(canvas.width / 2 - 100, canvas.height / 2 - 10, 200, 60);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(canvas.width / 2 - 100, canvas.height / 2 - 10, 200, 60);
    ctx.font = '30px monospace';
    ctx.fillStyle = '#7FDBFF';
    ctx.fillText('START', canvas.width / 2, canvas.height / 2 + 32);
}

function drawGameOver() {
    ctx.font = '40px monospace';
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 60);
    ctx.font = '30px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText('SCORE: ' + score, canvas.width / 2, canvas.height / 2 - 10);
    // Draw continue button
    ctx.fillStyle = '#222';
    ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 30, 240, 60);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeRect(canvas.width / 2 - 120, canvas.height / 2 + 30, 240, 60);
    ctx.font = '30px monospace';
    ctx.fillStyle = '#FF4136';
    ctx.fillText('CONTINUE', canvas.width / 2, canvas.height / 2 + 72);
}

function placeApple() {
    let newApple;
    do {
        newApple = {
            x: Math.floor(Math.random() * tileCountX),
            y: Math.floor(Math.random() * tileCountY)
        };
    } while (snake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
    apple = newApple;
}

// Handle keyboard input
window.addEventListener('keydown', e => {
    if (gameState === 'playing') {
        switch (e.key) {
            case 'ArrowUp':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
        }
    }
});

// Handle mouse input for menu and gameover buttons
canvas.addEventListener('click', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    if (gameState === 'menu') {
        // Start button
        if (
            mx >= canvas.width / 2 - 100 && mx <= canvas.width / 2 + 100 &&
            my >= canvas.height / 2 - 10 && my <= canvas.height / 2 + 50
        ) {
            startGame();
        }
    } else if (gameState === 'gameover') {
        // Continue button
        if (
            mx >= canvas.width / 2 - 120 && mx <= canvas.width / 2 + 120 &&
            my >= canvas.height / 2 + 30 && my <= canvas.height / 2 + 90
        ) {
            gameState = 'menu';
            draw();
        }
    }
});

// Initial draw
ctx.imageSmoothingEnabled = false;
draw();
