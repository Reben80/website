document.addEventListener('DOMContentLoaded', function() {
    let gridSize = 5;
    const grid = document.getElementById('grid');
    const resetBtn = document.getElementById('reset-btn');
    console.log("Reset button:", resetBtn); // Check if the button is found
    resetBtn.addEventListener('click', function() {
        console.log("Reset button clicked");
        resetGame();
    });
    const dotCountSpan = document.getElementById('dot-count');
    const maxDotsSpan = document.getElementById('max-dots');
    const difficultySelect = document.getElementById('difficulty');
    const instructionsBtn = document.getElementById("instructions-btn");
    const modal = document.getElementById("instructions-modal");
    const closeBtn = document.getElementsByClassName("close")[0];

    let dots = [];
    let dotCount = 0;
    let maxDots = 0;
    let gameActive = true;

    function createGrid() {
        console.log("Creating grid with size:", gridSize);
        gameActive = true;
        grid.innerHTML = '';
        const cellSize = getCellSize(gridSize);
        grid.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
        for (let i = 0; i < gridSize * gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.addEventListener('click', () => placeDot(i));
            grid.appendChild(cell);
        }
        calculateMaxDots();
    }

    function getCellSize(gridSize) {
        const baseSize = 50; // Base size for 5x5 grid
        const scaleFactor = 5 / gridSize;
        return Math.max(30, Math.floor(baseSize * scaleFactor)); // Minimum cell size of 30px
    }

    function calculateMaxDots() {
        const maxDotsList = [1, 4, 6, 8, 10, 12, 14, 16, 18];
        maxDots = maxDotsList[gridSize - 1] || Math.floor(gridSize * gridSize / 2);
        maxDotsSpan.textContent = maxDots;
    }

    function placeDot(index) {
        if (!gameActive) return; // Prevent moves if the game is not active

        const cell = grid.children[index];
        if (!cell.hasChildNodes()) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            const dotSize = Math.max(20, Math.floor(getCellSize(gridSize) * 0.6)); // Adjust dot size based on cell size
            dot.style.width = `${dotSize}px`;
            dot.style.height = `${dotSize}px`;
            cell.appendChild(dot);
            dots.push(index);
            dotCount++;
            dotCountSpan.textContent = dotCount;
            
            if (checkForThreeInLine()) {
                dot.classList.add('illegal');
                console.log("Oops! Three in a line. Game Over!");
                gameActive = false; // Stop the game
            } else if (dotCount === maxDots) {
                gameActive = false;
                console.log("Congratulations! You've completed this level!");
                celebrateWin(); // Trigger celebration animation
            } else {
                console.log(getEncouragingMessage());
            }
        }
    }

    function animateDot(dot) {
        dot.style.transform = 'scale(0)';
        setTimeout(() => {
            dot.style.transform = 'scale(1.2)';
            setTimeout(() => {
                dot.style.transform = 'scale(1)';
            }, 100);
        }, 0);
    }

    function getEncouragingMessage() {
        const messages = [
            "Great move!",
            "You're doing awesome!",
            "Keep it up!",
            "Brilliant strategy!",
            "You've got this!",
            "Amazing play!"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    function checkForThreeInLine() {
        for (let i = 0; i < dots.length - 2; i++) {
            for (let j = i + 1; j < dots.length - 1; j++) {
                for (let k = j + 1; k < dots.length; k++) {
                    if (isCollinear(dots[i], dots[j], dots[k])) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function isCollinear(a, b, c) {
        const ax = a % gridSize, ay = Math.floor(a / gridSize);
        const bx = b % gridSize, by = Math.floor(b / gridSize);
        const cx = c % gridSize, cy = Math.floor(c / gridSize);
        return (by - ay) * (cx - bx) === (cy - by) * (bx - ax);
    }

    function highlightIllegalDots() {
        const lastThreeDots = dots.slice(-3);
        
        lastThreeDots.forEach(dotIndex => {
            const dot = grid.children[dotIndex].firstChild;
            dot.classList.add('illegal');
        });
    }

    function resetGame() {
        console.log("resetGame function called");
        gameActive = true;
        dots = [];
        dotCount = 0;
        dotCountSpan.textContent = dotCount;
        createGrid();
        console.log("Game reset!"); // Add a message to confirm reset
    }

    function changeDifficulty() {
        gridSize = parseInt(difficultySelect.value);
        resetGame();
    }

    function celebrateWin() {
        console.log("Celebrate Win function called!");
        // Trigger confetti with custom colors
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF4081', '#FFC107', '#3F51B5', '#00BCD4'] // Pink, Amber, Indigo, Cyan
        });
    }

    // Function to open the modal
    function openModal() {
        modal.style.display = "block";
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Event listener for opening the modal
    instructionsBtn.addEventListener("click", openModal);

    // Event listener for closing the modal
    closeBtn.addEventListener("click", closeModal);

    // Close the modal when clicking outside of it
    window.addEventListener("click", (event) => {
        if (event.target == modal) {
            closeModal();
        }
    });

    // Event listener for difficulty select
    difficultySelect.addEventListener('change', changeDifficulty);

    // Initial grid creation
    gridSize = parseInt(difficultySelect.value);
    createGrid();

    console.log('Script loaded and running');
});