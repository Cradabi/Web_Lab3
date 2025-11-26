const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

let grid = [];
let score = 0;
let bestScore = 0;
let gameOver = false;
let moveHistory = [];

const gameGrid = document.getElementById('game-grid');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const newGameButton = document.getElementById('new-game');
const undoButton = document.getElementById('undo');
const showLeaderboardButton = document.getElementById('show-leaderboard');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreDisplay = document.getElementById('final-score');
const playerNameInput = document.getElementById('player-name');
const saveScoreButton = document.getElementById('save-score');
const restartGameButton = document.getElementById('restart-game');
const closeModalButton = document.getElementById('close-modal');
const scoreSavedMessage = document.getElementById('score-saved-message');
const gameOverMessage = document.getElementById('game-over-message');
const leaderboardModal = document.getElementById('leaderboard-modal');
const leaderboardTable = document.getElementById('leaderboard-table').getElementsByTagName('tbody')[0];
const closeLeaderboardButton = document.getElementById('close-leaderboard');
const mobileControls = document.querySelectorAll('.mobile-controls button');

function initGame() {
    createGrid();
    loadGameState();
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

function startNewGame() {
    grid = [];
    score = 0;
    gameOver = false;
    moveHistory = [];

    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.remove());

    createGrid();

    addRandomTile();
    addRandomTile();

    resetGameOverModal();

    saveGameState();

    updateDisplay();

    gameOverModal.style.display = 'none';
    leaderboardModal.style.display = 'none';
}

function resetGameOverModal() {
    gameOverMessage.style.display = 'block';
    scoreSavedMessage.style.display = 'none';
    playerNameInput.value = '';
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
        return true;
    }
    return false;
}

function createTileElement(row, col, value, isNew = false) {
    const tile = document.createElement('div');
    tile.classList.add('tile', `tile-${value}`);
    if (isNew) tile.classList.add('tile-new');
    tile.textContent = value;
    
    tile.dataset.row = row;
    tile.dataset.col = col;
    tile.dataset.value = value;

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

    const prevState = {
        grid: JSON.parse(JSON.stringify(grid)),
        score: score
    };
    
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
        moveHistory.push(prevState);

        addRandomTile();

        updateAllTiles();
        updateDisplay();

        saveGameState();
        if (isGameOver()) {
            endGame();
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

function endGame() {
    gameOver = true;
    finalScoreDisplay.textContent = score;

    resetGameOverModal();
    
    gameOverModal.style.display = 'flex';

    if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.textContent = bestScore;
        localStorage.setItem('bestScore', bestScore);
    }

    saveGameState();
}

function undoMove() {
    if (moveHistory.length > 0 && !gameOver) {
        const prevState = moveHistory.pop();
        grid = prevState.grid;
        score = prevState.score;

        updateAllTiles();
        updateDisplay();
        saveGameState();
    }
}

function saveScore() {
    const playerName = playerNameInput.value.trim();
    
    if (playerName) {
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

        leaderboard.push({
            name: playerName,
            score: score,
            date: new Date().toLocaleDateString('ru-RU')
        });

        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);

        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

        gameOverMessage.style.display = 'none';
        scoreSavedMessage.style.display = 'block';

        saveGameState();
    }
}

function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    leaderboardTable.innerHTML = '';

    leaderboard.forEach((entry, index) => {
        const row = leaderboardTable.insertRow();
        row.insertCell(0).textContent = entry.name;
        row.insertCell(1).textContent = entry.score;
        row.insertCell(2).textContent = entry.date;
    });

    leaderboardModal.style.display = 'flex';
}

function updateDisplay() {
    scoreDisplay.textContent = score;
    bestScoreDisplay.textContent = bestScore;

    undoButton.disabled = moveHistory.length === 0 || gameOver;
}

function saveGameState() {
    const gameState = {
        grid: grid,
        score: score,
        bestScore: bestScore,
        gameOver: gameOver,
        moveHistory: moveHistory
    };
    
    localStorage.setItem('gameState', JSON.stringify(gameState));
}

function loadGameState() {
    const savedState = localStorage.getItem('gameState');
    
    if (savedState) {
        const gameState = JSON.parse(savedState);
        grid = gameState.grid || [];
        score = gameState.score || 0;
        bestScore = gameState.bestScore || 0;
        gameOver = gameState.gameOver || false;
        moveHistory = gameState.moveHistory || [];

        updateAllTiles();
        updateDisplay();

        if (gameOver) {
            finalScoreDisplay.textContent = score;
            resetGameOverModal();
            gameOverModal.style.display = 'flex';
        }
    } else {
        startNewGame();
    }
    const savedBestScore = localStorage.getItem('bestScore');
    if (savedBestScore) {
        bestScore = parseInt(savedBestScore);
        bestScoreDisplay.textContent = bestScore;
    }
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

    mobileControls.forEach(button => {
        button.addEventListener('click', () => {
            if (gameOver) return;
            
            const direction = button.classList[0].split('-')[0];
            move(direction);
        });
    });

    let touchStartX, touchStartY;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY || gameOver) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                move('left');
            } else {
                move('right');
            }
        } else {
            if (diffY > 0) {
                move('up');
            } else {
                move('down');
            }
        }
        
        touchStartX = null;
        touchStartY = null;
    });

    newGameButton.addEventListener('click', startNewGame);
    undoButton.addEventListener('click', undoMove);
    showLeaderboardButton.addEventListener('click', showLeaderboard);

    saveScoreButton.addEventListener('click', saveScore);
    restartGameButton.addEventListener('click', startNewGame);
    closeModalButton.addEventListener('click', () => {
        gameOverModal.style.display = 'none';
    });

    closeLeaderboardButton.addEventListener('click', () => {
        leaderboardModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === gameOverModal) {
            gameOverModal.style.display = 'none';
        }
        if (e.target === leaderboardModal) {
            leaderboardModal.style.display = 'none';
        }
    });
}

window.addEventListener('load', initGame);