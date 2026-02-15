/* =========================================================
   CINEMOOD HOME - POSTER GRID & MOOD SEARCH
   ========================================================= */

/* ---------- POSTER GRID LOADING (reused from auth.js) ---------- */

async function loadPosters() {
    const genres = ["drama", "comedy", "sci-fi"];
    let allMovies = [];

    for (let genre of genres) {
        const res = await fetch(`data/${genre}.json`);
        const movies = await res.json();
        allMovies = allMovies.concat(movies);
    }

    allMovies.sort(() => Math.random() - 0.5);

    const posterW = 150;
    const posterH = 225;
    const bleed = 600;

    const totalWidth = (window.innerWidth + (bleed * 2)) * 1.3;
    const totalHeight = (window.innerHeight + (bleed * 2)) * 1.3;

    const cols = Math.ceil(totalWidth / posterW) + 10;
    const rows = Math.ceil(totalHeight / posterH) + 10;

    const totalNeeded = cols * rows;

    let neededPosters = [];
    while (neededPosters.length < totalNeeded) {
        neededPosters = neededPosters.concat(allMovies);
    }
    neededPosters = neededPosters.slice(0, totalNeeded);

    const grid = document.getElementById("poster-grid");
    grid.innerHTML = '';

    neededPosters.forEach(movie => {
        if (!movie.poster_url) return;
        const img = document.createElement("img");
        img.src = movie.poster_url;
        img.alt = movie.title || "";
        img.loading = "lazy";
        grid.appendChild(img);
    });
}

/* ---------- 3D PARALLAX EFFECT (reused from auth.js) ---------- */

const grid = document.getElementById("poster-grid");

document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    const rotY = x * 18;
    const rotX = y * -14;
    grid.style.transform = `perspective(1500px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.2)`;
});

/* ---------- USERNAME DISPLAY ---------- */

function displayUsername() {
    // Get username from localStorage (set during login)
    const username = localStorage.getItem('cinemood_username') || 'User';
    document.getElementById('username').textContent = username;
}

/* ---------- MOOD SEARCH HANDLING ---------- */

const moodInput = document.getElementById('mood-input');
const findBtn = document.querySelector('.find-btn');

findBtn.addEventListener('click', async () => {
    const mood = moodInput.value.trim();
    
    if (!mood) {
        alert('Please describe your mood or movie preference!');
        return;
    }
    
    // Show loading state
    const originalText = findBtn.textContent;
    findBtn.textContent = 'FINDING...';
    findBtn.disabled = true;
    
    const apiPorts = [5001]; // 5001 = default (avoids AirPlay), 5000 = fallback
    let data = null;
    let lastError = null;

    try {
        for (const port of apiPorts) {
            try {
                const url = `http://127.0.0.1:${port}/predict-genre`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ mood: mood })
                });
                if (!response.ok) continue;
                data = await response.json();
                if (data.error) {
                    lastError = data.error;
                    continue;
                }
                break;
            } catch (e) {
                lastError = e;
                continue;
            }
        }

        if (!data || data.error) {
            alert(data && data.error ? 'Error: ' + data.error : 'Could not reach the API.');
            return;
        }

        const genre = data.genre;
        const confidence = (data.confidence * 100).toFixed(1);
        console.log(`Predicted genre: ${genre} (${confidence}% confidence)`);
        localStorage.setItem('cinemood_last_confidence', data.confidence);
        await loadGenreMovies(genre, mood);
    } catch (error) {
        console.error('Error:', error);
        alert(
            'Failed to connect to genre prediction service.\n\n' +
            '1. In a terminal, go to the cinemood folder and run:\n   python app.py\n\n' +
            '2. Check the server: open http://127.0.0.1:5001/health in your browser (should show {"status":"ok"}).\n\n' +
            '3. Then try your mood again here.'
        );
    } finally {
        // Reset button
        findBtn.textContent = originalText;
        findBtn.disabled = false;
        moodInput.value = '';
    }
});

// Allow Enter key to submit
moodInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        findBtn.click();
    }
});

/* ---------- LOAD & DISPLAY GENRE MOVIES ---------- */

async function loadGenreMovies(genre, originalMood) {
    // Redirect to results page with genre and mood as URL parameters
    const confidence = localStorage.getItem('cinemood_last_confidence') || '';
    
    window.location.href = `results.html?genre=${encodeURIComponent(genre)}&mood=${encodeURIComponent(originalMood)}&confidence=${confidence}`;
}

/* ---------- THEME CARD CLICKS ---------- */

const themeCards = document.querySelectorAll('.theme-card');

themeCards.forEach(card => {
    card.addEventListener('click', () => {
        const themeLabel = card.querySelector('.theme-label').textContent;
        console.log('Theme clicked:', themeLabel);
        alert(`Exploring: ${themeLabel}\n\n(Feature coming soon!)`);
    });
});

/* ---------- WINDOW RESIZE HANDLER ---------- */

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        loadPosters();
    }, 250);
});

/* ---------- INIT ---------- */

async function init() {
    displayUsername();
    await loadPosters();
}

init();