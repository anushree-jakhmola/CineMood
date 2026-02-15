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
    const bleed = 600;  // CSS mein -600px bleed hai, so we need to cover that area too

    // Total grid area = viewport + bleed on all 4 sides
    // Multiply by 1.8 because of CSS scale(1.2) + 3D rotation effects
    const totalWidth = (window.innerWidth + (bleed * 2)) * 1.8;
    const totalHeight = (window.innerHeight + (bleed * 2)) * 1.8;

    const cols = Math.ceil(totalWidth / posterW) + 15;  // +15 extra for rotation safety
    const rows = Math.ceil(totalHeight / posterH) + 15;

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

const grid = document.getElementById("poster-grid");
document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    const rotY = x * 18;
    const rotX = y * -14;
    grid.style.transform = `perspective(1500px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.2)`;
});

document.getElementById("signin-form").addEventListener("submit", e => {
    e.preventDefault();
    
    // Get username from username field (always exists on Sign Up)
    const username = document.getElementById("username").value.trim();
    
    // Save to localStorage
    localStorage.setItem('cinemood_username', username);
    
    // Redirect to home page
    window.location.href = 'home.html';
});

async function init() {
    await loadPosters();
    
    // Window resize/zoom pe grid refresh karo
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            loadPosters();
        }, 250);  // 250ms debounce taaki baar-baar load na ho
    });
}
// Sign Up toggle
const signupLink = document.getElementById('signup-link');
const signinForm = document.getElementById('signin-form');
const heading = document.querySelector('.auth-container h2');

signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Check if username field already exists
    if (document.getElementById('username')) return;
    
    // Create username field
    const usernameGroup = document.createElement('div');
    usernameGroup.className = 'input-group';
    usernameGroup.innerHTML = '<input type="text" id="username" placeholder="Enter Username" required>';
    
    // Insert before email field
    const emailGroup = signinForm.querySelector('.input-group');
    signinForm.insertBefore(usernameGroup, emailGroup);
    
    // Update heading
    heading.innerHTML = 'Find what <i>you</i> feel like watching';
    
    // Update button text
    document.querySelector('.signin-btn').textContent = 'SIGN UP';
    
    // Update link text
    signupLink.parentElement.innerHTML = 'Already have an account? <a href="#" id="signin-link">Sign In</a>';
    
    // Add sign in listener
    document.getElementById('signin-link').addEventListener('click', (e) => {
        e.preventDefault();
        location.reload(); // Simple refresh back to sign in
    });
});

init();