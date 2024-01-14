document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const nextRoundBtn = document.getElementById('nextRound');
    const scoreTable = document.getElementById('scoreTable');
    canvas.width = 800;
    canvas.height = 600;

    let round = 0;
    const totalRounds = 5;
    let vectors, userDot, vectorSum;
    let scores = Array(totalRounds).fill(0); // Initialize scores array

    function setupRound() {
        vectors = generateRandomVectors(2);
        userDot = null;
        vectorSum = calculateVectorSum();
        redrawCanvas();
        nextRoundBtn.style.display = 'none'; // Initially hide the 'Next Round' button
    }

    function generateRandomVectors(num) {
        let vectors = [];
        for (let i = 0; i < num; i++) {
            vectors.push({
                x: Math.random() * 400 - 200,
                y: Math.random() * 400 - 200
            });
        }
        return vectors;
    }

    function drawGrid() {
        ctx.beginPath();
        for (let i = 0; i < canvas.width; i += 20) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.moveTo(0, i);
            ctx.lineTo(canvas.width, i);
        }
        ctx.strokeStyle = '#ddd';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = 1;
    }

    function drawDot(vector, color = 'black') {
        ctx.beginPath();
        ctx.arc(canvas.width / 2 + vector.x, canvas.height / 2 - vector.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    function calculateVectorSum() {
        let sum = { x: 0, y: 0 };
        for (let vector of vectors) {
            sum.x += vector.x;
            sum.y += vector.y;
        }
        return sum;
    }

    function calculateDistance() {
        if (!userDot) return 0;
        return Math.sqrt(Math.pow(userDot.x - vectorSum.x, 2) + Math.pow(userDot.y - vectorSum.y, 2)).toFixed(2);
    }

    function updateScoreboard() {
        document.getElementById('attempts').textContent = (round + 1) + '/5';
        let distance = calculateDistance();
        document.getElementById('distance').textContent = distance;
        scores[round] = distance;
        updateTable();
    }

    function placeDot(x, y) {
        userDot = { x: x - canvas.width / 2, y: canvas.height / 2 - y };
        redrawCanvas(true);
        nextRoundBtn.style.display = 'block';
        updateScoreboard();
    }

    function canvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        placeDot(x, y);
    }

    function redrawCanvas(showSum = false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        vectors.forEach(v => drawDot(v));
        if (showSum) {
            drawDot(vectorSum, 'blue');
        }
        if (userDot) {
            drawDot(userDot, 'red');
        }
    }

    function updateTable() {
        scoreTable.style.display = 'table'; // Show the table
        scoreTable.innerHTML = '';
        let totalScore = 0;
        scores.forEach((score, round) => {
            let row = scoreTable.insertRow();
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            cell1.innerHTML = 'Round ' + (round + 1);
            cell2.innerHTML = score || '-';
            totalScore += parseFloat(score || 0);
        });
        let totalRow = scoreTable.insertRow();
        let cell1 = totalRow.insertCell(0);
        let cell2 = totalRow.insertCell(1);
        cell1.innerHTML = 'Total';
        cell2.innerHTML = totalScore.toFixed(2);
    }

    function nextRound() {
        if (round < totalRounds - 1) {
            round++;
            setupRound();
        } else {
            nextRoundBtn.style.display = 'none'; // Hide the button on the last round
        }
    }

    document.getElementById('newGame').addEventListener('click', function() {
        round = 0;
        scores = Array(totalRounds).fill(0);
        setupRound();
    });
    canvas.addEventListener('click', canvasClick);
    nextRoundBtn.addEventListener('click', nextRound);

    setupRound();
});
