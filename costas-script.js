let gridSize = 5;
let grid = [];
let vectors = new Set();
let gameActive = true;
let score = 0;

function createGrid() {
    const gridElement = document.getElementById('grid');
    gridElement.innerHTML = '';
    gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;
    gridElement.style.gridTemplateRows = `repeat(${gridSize}, 60px)`;
    grid = [];
    vectors.clear();
    gameActive = true;
    score = 0;
    updateScoreDisplay();

    for (let row = 0; row < gridSize; row++) {
        grid[row] = [];
        for (let col = 0; col < gridSize; col++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', () => handleClick(cell, row, col));
            gridElement.appendChild(cell);
            grid[row][col] = cell;
        }
    }
}

function handleClick(cell, row, col) {
    let isRowColActive = Array.from(document.querySelectorAll('.cell'))
        .some(c => (c.dataset.row === String(row) || c.dataset.col === String(col)) 
                   && c.classList.contains('active'));

    if (!isRowColActive || cell.classList.contains('active')) {
        let wasActive = cell.classList.contains('active');
        cell.classList.toggle('active');
        if (!updateVectors()) {
            cell.classList.remove('active');
            cell.classList.add('error');
            gameActive = false;
        } else {
            updateScore(wasActive ? -1 : 1);
        }
    }
}

function updateVectors() {
    vectors.clear();
    let dots = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col].classList.contains('active')) {
                dots.push({ row, col });
            }
        }
    }

    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            let vector = calculateVector(dots[i], dots[j]);
            if (vectors.has(vector)) {
                return false;
            }
            vectors.add(vector);
        }
    }
    return true;
}

function calculateVector(dot1, dot2) {
    let dy = dot2.row - dot1.row;
    let dx = dot2.col - dot1.col;
    let length = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dy, dx);
    return `${length.toFixed(2)},${angle.toFixed(2)}`;
}

function updateGridSize() {
    gridSize = document.getElementById('gridSizeSelect').value;
    resetGame();
}

function resetGame() {
    createGrid();
    updateGridSizeLabel();
    updateScoreDisplay();
}

function updateGridSizeLabel() {
    document.getElementById('gridSizeLabel').textContent = gridSize;
}

function updateScore(change) {
    score += change;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    document.getElementById('scoreValue').textContent = score;
}

createGrid();
updateGridSizeLabel();
