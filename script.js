const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

let grid = [];
let score = 0;
let bestScore = 0;
let gameOver = false;

const gameGrid = document.getElementById('game-grid');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const newGameButton = document.getElementById('new-game');

function initGame() {
    createGrid();
    addInitialTiles();
    setupEventListeners();
    updateDisplay();
}

function createGrid() {
    gameGrid.innerHTML = '';
    grid = [];

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        gameGrid.appendChild(cell);
        
        const row = Math.floor(i / GRID_SIZE);
        const col = i % GRID_SIZE;
        
        if (!grid[row]) grid[row] = [];
        grid[row][col] = 0;
    }
}

function addInitialTiles() {
    addRandomTile();
    addRandomTile();
}

function addRandomTile() {
    const emptyCells = [];
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        createTileElement(randomCell.row, randomCell.col, grid[randomCell.row][randomCell.col], true);
    }
}

function createTileElement(row, col, value, isNew = false) {
    const tile = document.createElement('div');
    tile.classList.add('tile', `tile-${value}`);
    if (isNew) tile.classList.add('tile-new');
    tile.textContent = value;
    
    updateTilePosition(tile, row, col);
    
    gameGrid.appendChild(tile);
}

function updateTilePosition(tile, row, col) {
    const cellSize = 100 / GRID_SIZE;
    tile.style.width = `calc(${cellSize}% - ${CELL_GAP * 2}%)`;
    tile.style.height = `calc(${cellSize}% - ${CELL_GAP * 2}%)`;
    tile.style.left = `calc(${col * cellSize}% + ${CELL_GAP}%)`;
    tile.style.top = `calc(${row * cellSize}% + ${CELL_GAP}%)`;
}

function updateAllTiles() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.remove());
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] !== 0) {
                createTileElement(row, col, grid[row][col]);
            }
        }
    }
}

function move(direction) {
    if (gameOver) return false;
    
    let moved = false;

    switch (direction) {
        case 'up':
            moved = moveUp();
            break;
        case 'down':
            moved = moveDown();
            break;
        case 'left':
            moved = moveLeft();
            break;
        case 'right':
            moved = moveRight();
            break;
    }
    
    if (moved) {
        addRandomTile();

        updateAllTiles();
        updateDisplay();

        if (isGameOver()) {
            gameOver = true;
            setTimeout(() => alert("Игра окончена! Ваш счет: " + score), 300);
        }
        
        return true;
    }
    
    return false;
}

function moveUp() {
    let moved = false;
    
    for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = 1; row < GRID_SIZE; row++) {
            if (grid[row][col] !== 0) {
                let currentRow = row;
                
                while (currentRow > 0 && grid[currentRow - 1][col] === 0) {
                    grid[currentRow - 1][col] = grid[currentRow][col];
                    grid[currentRow][col] = 0;
                    currentRow--;
                    moved = true;
                }

                if (currentRow > 0 && grid[currentRow - 1][col] === grid[currentRow][col]) {
                    grid[currentRow - 1][col] *= 2;
                    grid[currentRow][col] = 0;
                    score += grid[currentRow - 1][col];
                    moved = true;
                }
            }
        }
    }
    
    return moved;
}

function moveDown() {
    let moved = false;
    
    for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = GRID_SIZE - 2; row >= 0; row--) {
            if (grid[row][col] !== 0) {
                let currentRow = row;
                
                while (currentRow < GRID_SIZE - 1 && grid[currentRow + 1][col] === 0) {
                    grid[currentRow + 1][col] = grid[currentRow][col];
                    grid[currentRow][col] = 0;
                    currentRow++;
                    moved = true;
                }

                if (currentRow < GRID_SIZE - 1 && grid[currentRow + 1][col] === grid[currentRow][col]) {
                    grid[currentRow + 1][col] *= 2;
                    grid[currentRow][col] = 0;
                    score += grid[currentRow + 1][col];
                    moved = true;
                }
            }
        }
    }
    
    return moved;
}

function moveLeft() {
    let moved = false;
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 1; col < GRID_SIZE; col++) {
            if (grid[row][col] !== 0) {
                let currentCol = col;
                
                while (currentCol > 0 && grid[row][currentCol - 1] === 0) {
                    grid[row][currentCol - 1] = grid[row][currentCol];
                    grid[row][currentCol] = 0;
                    currentCol--;
                    moved = true;
                }

                if (currentCol > 0 && grid[row][currentCol - 1] === grid[row][currentCol]) {
                    grid[row][currentCol - 1] *= 2;
                    grid[row][currentCol] = 0;
                    score += grid[row][currentCol - 1];
                    moved = true;
                }
            }
        }
    }
    
    return moved;
}

function moveRight() {
    let moved = false;
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = GRID_SIZE - 2; col >= 0; col--) {
            if (grid[row][col] !== 0) {
                let currentCol = col;
                
                while (currentCol < GRID_SIZE - 1 && grid[row][currentCol + 1] === 0) {
                    grid[row][currentCol + 1] = grid[row][currentCol];
                    grid[row][currentCol] = 0;
                    currentCol++;
                    moved = true;
                }

                if (currentCol < GRID_SIZE - 1 && grid[row][currentCol + 1] === grid[row][currentCol]) {
                    grid[row][currentCol + 1] *= 2;
                    grid[row][currentCol] = 0;
                    score += grid[row][currentCol + 1];
                    moved = true;
                }
            }
        }
    }
    
    return moved;
}

function isGameOver() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] === 0) {
                return false;
            }
        }
    }
    
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            const current = grid[row][col];
            
            if ((row < GRID_SIZE - 1 && grid[row + 1][col] === current) ||
                (col < GRID_SIZE - 1 && grid[row][col + 1] === current)) {
                return false;
            }
        }
    }
    
    return true;
}

function startNewGame() {
    grid = [];
    score = 0;
    gameOver = false;

    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.remove());

    createGrid();

    addRandomTile();
    addRandomTile();

    updateDisplay();
}

function updateDisplay() {
    scoreDisplay.textContent = score;
    bestScoreDisplay.textContent = bestScore;
}

function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
        if (gameOver) return;
        
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                move('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                move('down');
                break;
            case 'ArrowLeft':
                e.preventDefault();
                move('left');
                break;
            case 'ArrowRight':
                e.preventDefault();
                move('right');
                break;
        }
    });

    newGameButton.addEventListener('click', startNewGame);
}

window.addEventListener('load', initGame);