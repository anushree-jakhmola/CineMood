/* =========================================================
   CINEMOOD ABOUT PAGE
   ========================================================= */

/* ---------- LOAD BACKGROUND POSTERS ---------- */

async function loadBackgroundPosters() {
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

/* ---------- 3D PARALLAX EFFECT ---------- */

const grid = document.getElementById("poster-grid");

document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    const rotY = x * 18;
    const rotX = y * -14;
    grid.style.transform = `perspective(1500px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.2)`;
});

// Load posters on page load
loadBackgroundPosters();

/* ---------- SMOOTH SCROLL ANIMATIONS ---------- */

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and steps
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.card, .step-card');
    elements.forEach(el => observer.observe(el));
});

/* ---------- EASTER EGG: CLICK LOGO 5 TIMES ---------- */

let logoClickCount = 0;
const logo = document.querySelector('.logo');

if (logo) {
    logo.addEventListener('click', (e) => {
        // Don't trigger if user is trying to go home
        if (e.detail === 5) {
            logoClickCount++;
            
            if (logoClickCount === 1) {
                // Easter egg triggered!
                document.body.style.animation = 'rainbow 3s infinite';
                
                setTimeout(() => {
                    document.body.style.animation = '';
                    logoClickCount = 0;
                }, 3000);
            }
        }
    });
}

// Rainbow animation CSS (injected)
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

/* ---------- SCROLL TO TOP ON LOAD ---------- */

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});