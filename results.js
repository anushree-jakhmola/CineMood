/* =========================================================
   CINEMOOD RESULTS - NETFLIX STYLE ROWS
   ========================================================= */

/* ---------- HUMOROUS ROW TITLES BY GENRE ---------- */

const HUMOROUS_TITLES = {
    action: [
        "Explosions, Stunts & Zero Logic",
        "For When You Need Adrenaline",
        "Cars Go Boom 💥"
    ],
    adventure: [
        "Pack Your Bags (Virtually)",
        "Armchair Explorers Unite",
        "Maps, Legends & Plot Armor"
    ],
    comedy: [
        "Guaranteed Giggles",
        "Laugh Till You Cry (Maybe)",
        "Your Daily Dose of Dopamine"
    ],
    drama: [
        "Bring Tissues 😢",
        "Deeply Meaningful... Probably",
        "Emotions: The Movie"
    ],
    horror: [
        "Sleep Is Overrated Anyway",
        "Jump Scares & Bad Decisions",
        "Don't Watch Alone (Seriously)"
    ],
    romance: [
        "Love, Lies & Butterflies",
        "Single People: Proceed with Caution",
        "Unrealistic Expectations Ahead ❤️"
    ],
    "sci-fi": [
        "Space, Science & Plot Holes",
        "When Physics Takes a Day Off",
        "The Future Looks Weird"
    ]
};

/* ---------- GET URL PARAMETERS ---------- */

function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        genre: params.get('genre'),
        mood: params.get('mood'),
        confidence: params.get('confidence')
    };
}

/* ---------- LOAD GENRE MOVIES ---------- */

async function loadGenreMovies(genre) {
    try {
        const res = await fetch(`data/${genre}.json`);
        
        if (!res.ok) {
            throw new Error(`Genre "${genre}" not found`);
        }
        
        const movies = await res.json();
        
        console.log(`Loaded ${movies.length} ${genre} movies`);
        
        return movies;
        
    } catch (error) {
        console.error('Error loading genre movies:', error);
        
        document.getElementById('main-title').textContent = 'Oops!';
        document.getElementById('subtitle').textContent = `Couldn't load ${genre} movies. Redirecting...`;
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 2000);
        
        return [];
    }
}

/* ---------- CREATE MOVIE CARD ---------- */

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
    
    // Get platforms from watch_providers object
    const platforms = [];
    if (movie.watch_providers) {
        if (movie.watch_providers['amazon prime video']) platforms.push('Prime');
        if (movie.watch_providers['netflix']) platforms.push('Netflix');
        if (movie.watch_providers['jiohotstar']) platforms.push('Hotstar');
        if (movie.watch_providers['apple tv store']) platforms.push('Apple TV');
        if (movie.watch_providers['google play movies']) platforms.push('Google Play');
        if (movie.watch_providers['youtube']) platforms.push('YouTube');
    }
    
    const platformsHTML = platforms.slice(0, 3).map(p => 
        `<span class="platform-badge">${p}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="movie-poster-container">
            <img 
                src="${movie.poster_url}" 
                alt="${movie.title}"
                class="movie-poster"
                onerror="this.src='https://via.placeholder.com/300x450/16213e/ffffff?text=No+Poster'"
            >
            <div class="movie-overlay">
                <div class="movie-info">
                    <div class="movie-title">${movie.title}</div>
                    <div class="movie-meta">
                        <div class="movie-rating">
                            <span class="star-icon">★</span>
                            <span>${rating}</span>
                        </div>
                    </div>
                    ${platforms.length > 0 ? `<div class="movie-platforms">${platformsHTML}</div>` : ''}
                </div>
            </div>
        </div>
    `;
    
    // Click to open popup
    card.addEventListener('click', () => {
        openMoviePopup(movie);
    });
    
    return card;
}

/* ---------- CREATE MOVIE ROW ---------- */

function createMovieRow(title, movies) {
    const row = document.createElement('div');
    row.className = 'movie-row';
    
    row.innerHTML = `
        <h2 class="row-title">${title}</h2>
        <div class="row-scroll"></div>
    `;
    
    const scroll = row.querySelector('.row-scroll');
    
    movies.forEach(movie => {
        const card = createMovieCard(movie);
        scroll.appendChild(card);
    });
    
    return row;
}

/* ---------- DISPLAY RESULTS ---------- */

function displayResults(movies, genre) {
    const container = document.getElementById('rows-container');
    container.innerHTML = '';
    
    // Get humorous titles for this genre
    const titles = HUMOROUS_TITLES[genre] || ["Top Picks", "Fan Favorites", "Must Watch"];
    
    // Row 1: First 5 movies
    if (movies.length >= 5) {
        const row1 = createMovieRow(titles[0], movies.slice(0, 5));
        container.appendChild(row1);
    }
    
    // Row 2: Next 5 movies
    if (movies.length >= 10) {
        const row2 = createMovieRow(titles[1], movies.slice(5, 10));
        container.appendChild(row2);
    }
    
    // Row 3: Next 5 movies
    if (movies.length >= 15) {
        const row3 = createMovieRow(titles[2], movies.slice(10, 15));
        container.appendChild(row3);
    }
    
    // All remaining movies in grid
    if (movies.length > 15) {
        const allSection = document.createElement('div');
        allSection.className = 'movie-row all-movies-section';
        
        allSection.innerHTML = `
            <h2 class="all-movies-title">More ${genre.charAt(0).toUpperCase() + genre.slice(1)} Movies</h2>
            <div class="all-movies-grid"></div>
        `;
        
        const grid = allSection.querySelector('.all-movies-grid');
        
        movies.slice(15).forEach(movie => {
            const card = createMovieCard(movie);
            grid.appendChild(card);
        });
        
        container.appendChild(allSection);
    }
}

/* ---------- UPDATE PAGE TITLE ---------- */

function updatePageTitle(genre, mood, confidence) {
    const genreCapitalized = genre.charAt(0).toUpperCase() + genre.slice(1);
    
    document.getElementById('main-title').textContent = `${genreCapitalized} Movies for You`;
    
    if (mood) {
        const confPercent = confidence ? `${(confidence * 100).toFixed(0)}%` : '';
        document.getElementById('subtitle').textContent = 
            `Based on: "${mood}" ${confPercent ? `• ${confPercent} match` : ''}`;
    }
}

/* ---------- BACK BUTTON ---------- */

document.getElementById('back-btn').addEventListener('click', () => {
    window.location.href = 'home.html';
});

/* ---------- MOVIE POPUP ---------- */

function openMoviePopup(movie) {
    const popup = document.getElementById('movie-popup');
    const backdrop = document.getElementById('popup-backdrop');
    
    // Populate popup
    document.getElementById('popup-poster-img').src = movie.poster_url;
    document.getElementById('popup-title').textContent = movie.title;
    document.getElementById('popup-rating').textContent = movie.rating ? movie.rating.toFixed(1) : 'N/A';
    document.getElementById('popup-year').textContent = ''; // No year in data, hide it
    document.getElementById('popup-overview').textContent = movie.overview || 'No description available.';
    
    // Populate platforms from watch_providers
    const platformsList = document.getElementById('popup-platforms-list');
    platformsList.innerHTML = '';
    
    const platforms = [];
    if (movie.watch_providers) {
        if (movie.watch_providers['amazon prime video']) platforms.push('Amazon Prime Video');
        if (movie.watch_providers['netflix']) platforms.push('Netflix');
        if (movie.watch_providers['jiohotstar']) platforms.push('JioHotstar');
        if (movie.watch_providers['apple tv store']) platforms.push('Apple TV');
        if (movie.watch_providers['google play movies']) platforms.push('Google Play');
        if (movie.watch_providers['youtube']) platforms.push('YouTube');
        if (movie.watch_providers['amazon video']) platforms.push('Amazon Video');
        if (movie.watch_providers['vi movies and tv']) platforms.push('Vi Movies');
        if (movie.watch_providers['amazon prime video with ads']) platforms.push('Prime (Ads)');
    }
    
    if (platforms.length === 0) {
        platformsList.innerHTML = '<span class="popup-platform-badge">Not Available</span>';
    } else {
        platforms.forEach(platform => {
            const badge = document.createElement('span');
            badge.className = 'popup-platform-badge';
            badge.textContent = platform;
            platformsList.appendChild(badge);
        });
    }
    
    // Show popup
    popup.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMoviePopup() {
    const popup = document.getElementById('movie-popup');
    const backdrop = document.getElementById('popup-backdrop');
    
    popup.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close button
document.getElementById('popup-close').addEventListener('click', closeMoviePopup);

// Click backdrop to close
document.getElementById('popup-backdrop').addEventListener('click', closeMoviePopup);

// ESC key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMoviePopup();
    }
});

/* ---------- INIT ---------- */

async function init() {
    const { genre, mood, confidence } = getURLParams();
    
    if (!genre) {
        console.error('No genre parameter');
        window.location.href = 'home.html';
        return;
    }
    
    updatePageTitle(genre, mood, confidence);
    
    const movies = await loadGenreMovies(genre);
    
    if (movies.length > 0) {
        displayResults(movies, genre);
    }
}

init();