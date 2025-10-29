const form = document.getElementById('assessmentForm');
const resultsDiv = document.getElementById('results');
const scoreEl = document.getElementById('score');

const correctAnswers = {
    q1: new Date().toLocaleDateString(), // today's date
    q2: "joyful",
    q3: "8",
    q4: "circle",
    q5: "red"
};

// Store previous attempts in localStorage
let attempts = JSON.parse(localStorage.getItem('attempts')) || [];

form.addEventListener('submit', function(e) {
    e.preventDefault();

    let formData = new FormData(form);
    let score = 0;

    for (let [key, value] of formData.entries()) {
        if (key === 'q1') {
            // simple date comparison
            if (value.trim() === correctAnswers[key]) score++;
        } else if (value === correctAnswers[key]) {
            score++;
        }
    }

    const attempt = {
        date: new Date().toLocaleString(),
        score: score
    };
    attempts.push(attempt);
    localStorage.setItem('attempts', JSON.stringify(attempts));

    scoreEl.innerText = `${score} / 5`;
    form.classList.add('hidden');
    resultsDiv.classList.remove('hidden');

    renderChart();
});

function renderChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const labels = attempts.map(a => a.date);
    const data = attempts.map(a => a.score);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score Over Time',
                data: data,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0,123,255,0.2)',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: 0,
                    max: 5,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}
