// Snake Game
// Canvas and game setup
const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

// Colors
const BG_COLOR = '#000000'; // Black
const SNAKE_COLOR = '#7FDBFF'; // Light blue
const APPLE_COLOR = '#FF4136'; // Red

// Game settings
const gridSize = 20; // Size of each cell
const tileCount = canvas.width / gridSize;

// Snake
let snake = [{ x: 10, y: 10 }];
let snakeLength = 5;
let dx = 1;
let dy = 0;

// Apple
let apple = { x: 15, y: 10 };

// Game loop
let gameInterval = setInterval(gameLoop, 100);

function gameLoop() {
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (snake.length > snakeLength) snake.pop();

    // Check collision with apple
    if (head.x === apple.x && head.y === apple.y) {
        snakeLength++;
        placeApple();
    }

    // Check collision with walls or self
    if (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        clearInterval(gameInterval);
        alert('Game Over!');
        return;
    }

    // Draw everything
    draw();
}

function draw() {
    // Draw background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
}

function placeApple() {
    let newApple;
    do {
        newApple = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === newApple.x && segment.y === newApple.y));
    apple = newApple;
}

// Handle keyboard input
window.addEventListener('keydown', e => {
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
});
