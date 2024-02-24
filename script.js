document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('triangleCanvas');
    const ctx = canvas.getContext('2d');
    const resultDiv = document.getElementById('result');
    const resetButton = document.getElementById('resetButton');
    const verticesOnlyCheckbox = document.getElementById('verticesOnly');
    let guessPlaced = false;

    function generateRandomTriangle() {
        const vertices = [];
        for (let i = 0; i < 3; i++) {
            vertices.push({x: Math.random() * canvas.width, y: Math.random() * canvas.height});
        }
        return vertices;
    }

    let vertices = generateRandomTriangle();
    let centroid = calculateCentroid(vertices);

    drawShape(vertices);

    canvas.addEventListener('click', function(event) {
        if (!guessPlaced) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            guessPlaced = true;

            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = 'orange';
            ctx.beginPath();
            ctx.arc(centroid.x, centroid.y, 10, 0, 2 * Math.PI);
            ctx.fill();

            const distance = Math.sqrt(Math.pow(x - centroid.x, 2) + Math.pow(y - centroid.y, 2)).toFixed(2);
            resultDiv.innerHTML = 'Distance from your click to centroid: ' + distance + ' pixels';
        }
    });

    resetButton.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        vertices = generateRandomTriangle();
        centroid = calculateCentroid(vertices);
        drawShape(vertices);
        resultDiv.innerHTML = '';
        guessPlaced = false;
    });

    verticesOnlyCheckbox.addEventListener('change', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawShape(vertices);
    });

    function drawShape(vertices) {
        if (verticesOnlyCheckbox.checked) {
            drawVertices(vertices);
        } else {
            drawTriangle(vertices);
        }
    }

    function drawTriangle(vertices) {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
        drawVertices(vertices); // Optionally highlight vertices on the triangle
    }

    function drawVertices(vertices) {
        vertices.forEach(vertex => {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    function calculateCentroid(vertices) {
        let x = 0, y = 0, n = vertices.length;
        vertices.forEach(vertex => {
            x += vertex.x;
            y += vertex.y;
        });
        return { x: x / n, y: y / n };
    }
});
