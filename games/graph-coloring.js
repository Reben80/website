console.log('Script started');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const colorPalette = document.getElementById('colorPalette');
const howToPlayBtn = document.getElementById('howToPlayBtn');
const howToPlay = document.getElementById('howToPlay');
const challengeSelect = document.getElementById('challengeSelect');
const checkMinColorsBtn = document.getElementById('checkMinColorsBtn');
const numVerticesInput = document.getElementById('numVertices');

console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

let vertices = [];
let edges = [];
let draggingVertex = null;
let selectedColor = null;

const colors = ['#FFA726', '#66BB6A', '#42A5F5', '#AB47BC', '#EC407A', '#8D6E63'];

const challenges = [
    // Challenge 1: Small Triangle-Based Graph (5 vertices) - Original #4
    {
        vertices: [
            {x: 200, y: 100}, {x: 400, y: 100},
            {x: 100, y: 300}, {x: 300, y: 300}, {x: 500, y: 300}
        ],
        edges: [[0,1],[0,2],[0,3],[1,3],[1,4],[2,3],[3,4]]
    },
    // Challenge 2: Pentagon with Inner Star (6 vertices) - Original #2
    {
        vertices: [
            {x: 300, y: 50}, {x: 450, y: 150}, {x: 400, y: 350},
            {x: 200, y: 350}, {x: 150, y: 150}, {x: 300, y: 200}
        ],
        edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[1,5],[2,5],[3,5],[4,5]]
    },
    // Challenge 3: Medium Graph with Overlapping Edges (8 vertices) - Original #5
    {
        vertices: [
            {x: 200, y: 100}, {x: 400, y: 100}, {x: 200, y: 300}, {x: 400, y: 300},
            {x: 250, y: 150}, {x: 450, y: 150}, {x: 250, y: 350}, {x: 450, y: 350}
        ],
        edges: [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]]
    },
    // Challenge 4: Small, Simple Graph (5 vertices) - Original #1
    {
        vertices: [
            {x: 300, y: 100}, {x: 450, y: 200}, {x: 400, y: 350},
            {x: 200, y: 350}, {x: 150, y: 200}
        ],
        edges: [[0,1],[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
    },
    // Challenge 5: Large, Complex Graph (10 vertices) - Original #6
    {
        vertices: [
            {x: 300, y: 50}, {x: 450, y: 150}, {x: 400, y: 350},
            {x: 200, y: 350}, {x: 150, y: 150}, {x: 300, y: 100},
            {x: 375, y: 175}, {x: 350, y: 275}, {x: 250, y: 275}, {x: 225, y: 175}
        ],
        edges: [[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[1,6],[2,7],[3,8],[4,9],[5,7],[7,9],[9,6],[6,8],[8,5]]
    },
    // Challenge 6: Circular Graph (20 vertices) - Original #7
    {
        vertices: Array(20).fill().map((_, i) => ({
            x: 300 + 200 * Math.cos(2 * Math.PI * i / 20),
            y: 200 + 200 * Math.sin(2 * Math.PI * i / 20)
        })),
        edges: [
            [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],
            [10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,18],[18,19],[19,0],
            [0,5],[1,6],[2,7],[3,8],[4,9],[10,15],[11,16],[12,17],[13,18],[14,19]
        ]
    },
    // Challenge 7: Hexagonal Graph (6 vertices) - Original #3
    {
        vertices: [
            {x: 200, y: 200}, {x: 400, y: 200},
            {x: 150, y: 300}, {x: 450, y: 300},
            {x: 300, y: 100}, {x: 300, y: 400}
        ],
        edges: [[0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,4],[3,5],[4,5]]
    }
];


// Event listener for number of vertices input
numVerticesInput.addEventListener('input', () => {
    const numVertices = parseInt(numVerticesInput.value, 10);
    generateRandomGraph(numVertices);
    drawGraph();
    updateColorCount();
});

function generateRandomGraph(numVertices) {
    vertices = [];
    edges = [];

    for (let i = 0; i < numVertices; i++) {
        vertices.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            color: null,
            adjacentVertices: []
        });
    }

    for (let i = 0; i < numVertices; i++) {
        for (let j = i + 1; j < numVertices; j++) {
            if (Math.random() < 0.3) {
                edges.push([i, j]);
                vertices[i].adjacentVertices.push(j);
                vertices[j].adjacentVertices.push(i);
            }
        }
    }
}

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 2;
    edges.forEach(edge => {
        const [from, to] = edge;
        ctx.beginPath();
        ctx.moveTo(vertices[from].x, vertices[from].y);
        ctx.lineTo(vertices[to].x, vertices[to].y);
        ctx.stroke();
    });
    
    // Draw vertices
    vertices.forEach((vertex) => {
        ctx.beginPath();
        ctx.arc(vertex.x, vertex.y, 15, 0, 2 * Math.PI);
        
        if (vertex.color) {
            ctx.fillStyle = vertex.color;
            ctx.fill();
        } else {
            ctx.fillStyle = '#FFFFFF';
            ctx.fill();
            ctx.strokeStyle = '#BDBDBD';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

function getVertexAtPosition(x, y) {
    for (let i = 0; i < vertices.length; i++) {
        const dx = x - vertices[i].x;
        const dy = y - vertices[i].y;
        if (dx * dx + dy * dy <= 225) { // 15^2
            return i;
        }
    }
    return null;
}

function createColorPalette() {
    colorPalette.innerHTML = ''; // Clear existing palette
    colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = color;
        colorOption.addEventListener('click', () => {
            selectedColor = color;
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('selected');
            });
            colorOption.classList.add('selected');
        });
        colorPalette.appendChild(colorOption);
    });
}

function isValidColor(vertexIndex, color) {
    if (!color) return true;
    return !vertices[vertexIndex].adjacentVertices.some(adjIndex => vertices[adjIndex].color === color);
}

function greedyColoring(graph) {
    const n = graph.length;
    const colors = new Array(n).fill(-1); // -1 means uncolored
    
    function isColorValid(v, c) {
        for (let i = 0; i < n; i++) {
            if (graph[v][i] && colors[i] === c) {
                return false;
            }
        }
        return true;
    }
    
    for (let v = 0; v < n; v++) {
        for (let c = 0; ; c++) {
            if (isColorValid(v, c)) {
                colors[v] = c;
                break;
            }
        }
    }
    
    return Math.max(...colors) + 1; // Number of colors used
}

function createAdjacencyMatrix() {
    const n = vertices.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    
    edges.forEach(([from, to]) => {
        matrix[from][to] = 1;
        matrix[to][from] = 1;
    });
    
    return matrix;
}

function updateColorCount() {
    const usedColors = new Set(vertices.map(v => v.color).filter(c => c !== null)).size;
    document.getElementById('colorCount').textContent = usedColors;
}

function loadChallenge(index) {
    if (index === -1) {
        generateRandomGraph(parseInt(numVerticesInput.value, 10));
    } else {
        const challenge = challenges[index];
        vertices = challenge.vertices.map(v => ({...v, color: null, adjacentVertices: []}));
        edges = challenge.edges;
        edges.forEach(([from, to]) => {
            vertices[from].adjacentVertices.push(to);
            vertices[to].adjacentVertices.push(from);
        });
    }
    drawGraph();
    updateColorCount();
}

// Populate challenge dropdown
challenges.forEach((challenge, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `Challenge ${index + 1}`;
    challengeSelect.appendChild(option);
});

challengeSelect.addEventListener('change', (event) => {
    loadChallenge(parseInt(event.target.value));
});

canvas.addEventListener('mousedown', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const clickedVertex = getVertexAtPosition(x, y);
    if (clickedVertex !== null && selectedColor) {
        if (isValidColor(clickedVertex, selectedColor)) {
            vertices[clickedVertex].color = selectedColor;
            drawGraph();
            updateColorCount();
        } else {
            alert("Invalid move! Adjacent vertices cannot have the same color.");
        }
    } else if (clickedVertex !== null) {
        draggingVertex = clickedVertex;
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (draggingVertex !== null) {
        const rect = canvas.getBoundingClientRect();
        vertices[draggingVertex].x = event.clientX - rect.left;
        vertices[draggingVertex].y = event.clientY - rect.top;
        drawGraph();
    }
});

canvas.addEventListener('mouseup', () => {
    draggingVertex = null;
});

resetButton.addEventListener('click', () => {
    if (challengeSelect.value === "-1") {
        generateRandomGraph(parseInt(numVerticesInput.value, 10));
    } else {
        loadChallenge(parseInt(challengeSelect.value));
    }
    selectedColor = null;
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });
    drawGraph();
    updateColorCount();
});

howToPlayBtn.addEventListener('click', () => {
    howToPlay.classList.toggle('hidden');
});

checkMinColorsBtn.addEventListener('click', () => {
    const adjacencyMatrix = createAdjacencyMatrix();
    const minColors = greedyColoring(adjacencyMatrix);
    
    const usedColors = new Set(vertices.map(v => v.color).filter(c => c !== null)).size;
    
    if (usedColors === 0) {
        alert(`The estimated minimum number of colors needed is ${minColors}. Try coloring the graph!`);
    } else if (usedColors === minColors) {
        alert(`Congratulations! You've used the minimum number of colors (${minColors}).`);
    } else if (usedColors > minColors) {
        alert(`Good job, but you can do better! You've used ${usedColors} colors, but the estimated minimum is ${minColors}.`);
    } else {
        alert(`You've used ${usedColors} colors. The estimated minimum is ${minColors}, but your solution might be more optimal!`);
    }
});

// Initial setup
createColorPalette();
loadChallenge(-1); // Start with a random graph
updateColorCount();

console.log('Script ended');
