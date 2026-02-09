let gridSize = 5;
let grid = [];
let vectors = new Set();
let gameActive = true;
let score = 0;

function createGrid() {
  var gridElement = document.getElementById('grid');
  gridElement.innerHTML = '';
  gridElement.style.gridTemplateColumns = 'repeat(' + gridSize + ', 60px)';
  gridElement.style.gridTemplateRows = 'repeat(' + gridSize + ', 60px)';
  grid = [];
  vectors.clear();
  gameActive = true;
  score = 0;
  updateScoreDisplay();

  for (var row = 0; row < gridSize; row++) {
    grid[row] = [];
    for (var col = 0; col < gridSize; col++) {
      var cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', function () {
        var r = parseInt(this.dataset.row, 10);
        var c = parseInt(this.dataset.col, 10);
        handleClick(this, r, c);
      });
      gridElement.appendChild(cell);
      grid[row][col] = cell;
    }
  }
}

function handleClick(cell, row, col) {
  var activeCells = document.querySelectorAll('.cell.active');
  var isRowColActive = false;
  for (var i = 0; i < activeCells.length; i++) {
    var c = activeCells[i];
    if ((c.dataset.row === String(row) || c.dataset.col === String(col)) && c !== cell) {
      isRowColActive = true;
      break;
    }
  }

  if (!isRowColActive || cell.classList.contains('active')) {
    var wasActive = cell.classList.contains('active');
    cell.classList.remove('error');
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
  var dots = [];
  for (var row = 0; row < gridSize; row++) {
    for (var col = 0; col < gridSize; col++) {
      if (grid[row][col].classList.contains('active')) {
        dots.push({ row: row, col: col });
      }
    }
  }

  for (var i = 0; i < dots.length; i++) {
    for (var j = i + 1; j < dots.length; j++) {
      var v = calculateVector(dots[i], dots[j]);
      if (vectors.has(v)) {
        return false;
      }
      vectors.add(v);
    }
  }
  return true;
}

function calculateVector(dot1, dot2) {
  var dy = dot2.row - dot1.row;
  var dx = dot2.col - dot1.col;
  var length = Math.sqrt(dx * dx + dy * dy);
  var angle = Math.atan2(dy, dx);
  return length.toFixed(2) + ',' + angle.toFixed(2);
}

function updateGridSize() {
  gridSize = parseInt(document.getElementById('gridSizeSelect').value, 10);
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

document.getElementById('descriptionButton').addEventListener('click', function () {
  var description = document.getElementById('description');
  if (description.style.display === 'none') {
    description.style.display = 'block';
  } else {
    description.style.display = 'none';
  }
});

createGrid();
updateGridSizeLabel();
