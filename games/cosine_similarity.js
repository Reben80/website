
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const guessInput = document.getElementById('guessInput');
    const submitGuessBtn = document.getElementById('submitGuess');
    const nextRoundBtn = document.getElementById('nextRound');
    canvas.width = 800;
    canvas.height = 600;

    let round = 0;
    const totalRounds = 5;
    let vectors;
    let totalScore = 0;

    function generateRandomVectors() {
        return [
            { x: Math.random() * 400 - 200, y: Math.random() * 400 - 200 },
            { x: Math.random() * 400 - 200, y: Math.random() * 400 - 200 }
        ];
    }

    function calculateCosineSimilarity() {
        let vectorA = vectors[0];
        let vectorB = vectors[1];

        let dotProduct = (vectorA.x * vectorB.x) + (vectorA.y * vectorB.y);
        let magnitudeA = Math.sqrt(vectorA.x * vectorA.x + vectorA.y * vectorA.y);
        let magnitudeB = Math.sqrt(vectorB.x * vectorB.x + vectorB.y * vectorB.y);

        let cosineSimilarity = dotProduct / (magnitudeA * magnitudeB);
        if (magnitudeA === 0 || magnitudeB === 0) {
            cosineSimilarity = 0;
        }
        return cosineSimilarity;
    }

    function updateScoreboard() {
        document.getElementById('round').textContent = (round + 1) + '/5';
        document.getElementById('currentScore').textContent = Math.abs(parseFloat(guessInput.value) - calculateCosineSimilarity()).toFixed(2);
        document.getElementById('totalScore').textContent = totalScore.toFixed(2);
    }

    function setupRound() {
        vectors = generateRandomVectors();
        redrawCanvas();
        guessInput.value = '';
        guessInput.disabled = false;
        submitGuessBtn.disabled = false;
        nextRoundBtn.style.display = 'none';
    }

    function redrawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawVector(vectors[0], 'red');
        drawVector(vectors[1], 'blue');
    }

    function drawVector(vector, color) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(canvas.width / 2 + vector.x, canvas.height / 2 - vector.y);
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    function submitGuess() {
        let guess = parseFloat(guessInput.value);
        let roundScore = Math.abs(calculateCosineSimilarity() - guess);
        totalScore += roundScore;

        updateScoreboard();
        guessInput.disabled = true;
        submitGuessBtn.disabled = true;
        nextRoundBtn.style.display = 'block';
        if (round === totalRounds - 1) {
            nextRoundBtn.textContent = 'See Results';
        }
    }

    function nextRound() {
        if (round < totalRounds - 1) {
            round++;
            setupRound();
        } else {
            alert('Game Over! Your total score is: ' + totalScore.toFixed(2));
            totalScore = 0;
            round = 0;
            setupRound();
        }
    }

    document.getElementById('newGame').addEventListener('click', function() {
        totalScore = 0;
        round = 0;
        setupRound();
    });
    submitGuessBtn.addEventListener('click', submitGuess);
    nextRoundBtn.addEventListener('click', nextRound);

    setupRound();
});
