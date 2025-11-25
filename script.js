const GRID_SIZE = 4;
let grid = [];

const gameGrid = document.getElementById('game-grid');

function initGame() {
    createGrid();
    addInitialTiles();
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
        createTileElement(randomCell.row, randomCell.col, grid[randomCell.row][randomCell.col]);
    }
}

function createTileElement(row, col, value) {
    const tile = document.createElement('div');
    tile.classList.add('tile', `tile-${value}`);
    tile.textContent = value;
    tile.dataset.row = row;
    tile.dataset.col = col;
    
    const cellSize = 100 / GRID_SIZE;
    tile.style.width = `calc(${cellSize}% - 20px)`;
    tile.style.height = `calc(${cellSize}% - 20px)`;
    tile.style.left = `calc(${col * cellSize}% + 10px)`;
    tile.style.top = `calc(${row * cellSize}% + 10px)`;
    
    gameGrid.appendChild(tile);
}

window.addEventListener('load', initGame);