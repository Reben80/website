document.addEventListener("DOMContentLoaded", () => {
    let gridSize = 3;
    const gridElement = document.getElementById('grid');
    const resetButton = document.getElementById('reset-button');
    const messageElement = document.getElementById('message');
    const gridSizeSelector = document.getElementById('grid-size');
    const counterElement = document.getElementById('counter');
    const challengeMessageElement = document.getElementById('challenge-message');
    
    let points = [];
    let dotCount = 0;

    gridSizeSelector.addEventListener('change', (event) => {
        gridSize = parseInt(event.target.value);
        initGrid();
    });

    // Initialize the grid
    function initGrid() {
        gridElement.innerHTML = '';
        points = [];
        dotCount = 0;
        updateCounter();
        challengeMessageElement.textContent = "What's the Secret Rule? Try Placing as Many Dots as Possible!";
        gridElement.style.pointerEvents = 'auto'; // Re-enable clicking

        gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        gridElement.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

        // Draw grid lines
        for (let i = 1; i < gridSize; i++) {
            const horizontalLine = document.createElement('div');
            horizontalLine.className = 'grid-line horizontal';
            horizontalLine.style.gridRowStart = i + 1;
            horizontalLine.style.gridColumn = '1 / -1';
            gridElement.appendChild(horizontalLine);

            const verticalLine = document.createElement('div');
            verticalLine.className = 'grid-line vertical';
            verticalLine.style.gridColumnStart = i + 1;
            verticalLine.style.gridRow = '1 / -1';
            gridElement.appendChild(verticalLine);
        }

        // Create intersections
        for (let row = 0; row <= gridSize; row++) {
            for (let col = 0; col <= gridSize; col++) {
                const intersection = document.createElement('div');
                intersection.className = 'intersection';
                intersection.dataset.row = row;
                intersection.dataset.col = col;
                intersection.style.left = `${(col / gridSize) * 100}%`;
                intersection.style.top = `${(row / gridSize) * 100}%`;
                intersection.addEventListener('click', onIntersectionClick);
                gridElement.appendChild(intersection);
            }
        }
    }

    // Handle intersection click
    function onIntersectionClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (!event.target.classList.contains('occupied')) {
            if (!checkForThreeInLine(row, col)) {
                event.target.classList.add('occupied');
                points.push([row, col]);
                dotCount++;
                updateCounter();
            } else {
                event.target.classList.add('illegal'); // Mark the illegal dot with a special class
                challengeMessageElement.textContent = 'Something unexpected happened! The game will stop.';
                gridElement.style.pointerEvents = 'none'; // Disable further clicks
            }
        }
    }

    // Update the counter display
    function updateCounter() {
        counterElement.textContent = `Dots Placed: ${dotCount}`;
    }

    // Check if the last point forms a line with any other two points
    function checkForThreeInLine(row, col) {
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                if (isCollinear(points[i], points[j], [row, col])) {
                    return true;
                }
            }
        }
        return false;
    }

    // Check if three points are collinear
    function isCollinear(p1, p2, p3) {
        const [x1, y1] = p1;
        const [x2, y2] = p2;
        const [x3, y3] = p3;

        return (y2 - y1) * (x3 - x2) === (y3 - y2) * (x2 - x1);
    }

    // Reset the game
    resetButton.addEventListener('click', initGrid);

    // Initialize the game on page load
    initGrid();
});
