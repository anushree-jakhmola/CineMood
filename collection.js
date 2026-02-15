/* =========================================================
   CINEMOOD COLLECTION - ALL MOVIES WITH SEARCH & FILTERS
   ========================================================= */

   let allMovies = [];
   let filteredMovies = [];
   let displayedCount = 0;
   const MOVIES_PER_LOAD = 20;
   
   /* ---------- LOAD ALL MOVIES FROM ALL GENRES ---------- */
   
   async function loadAllMovies() {
       const genres = ["action", "adventure", "comedy", "drama", "horror", "romance", "sci-fi"];
       
       for (let genre of genres) {
           try {
               const res = await fetch(`data/${genre}.json`);
               const movies = await res.json();
               
               // Add genre tag to each movie
               movies.forEach(movie => {
                   movie.genre = genre;
               });
               
               allMovies = allMovies.concat(movies);
           } catch (error) {
               console.error(`Failed to load ${genre} movies:`, error);
           }
       }
       
       console.log(`Loaded ${allMovies.length} total movies`);
       
       // Update stats
       document.getElementById('stats-text').textContent = `${allMovies.length} movies in our collection`;
       
       // Display initial movies
       filteredMovies = [...allMovies];
       displayMovies();
   }
   
   /* ---------- DISPLAY MOVIES (with pagination) ---------- */
   
   function displayMovies(reset = true) {
       const grid = document.getElementById('movie-grid');
       
       if (reset) {
           grid.innerHTML = '';
           displayedCount = 0;
       }
       
       const moviesToShow = filteredMovies.slice(displayedCount, displayedCount + MOVIES_PER_LOAD);
       
       moviesToShow.forEach(movie => {
           const card = createMovieCard(movie);
           grid.appendChild(card);
       });
       
       displayedCount += moviesToShow.length;
       
       // Show/hide load more button
       const loadMoreBtn = document.getElementById('load-more-btn');
       if (displayedCount < filteredMovies.length) {
           loadMoreBtn.style.display = 'block';
       } else {
           loadMoreBtn.style.display = 'none';
       }
   }
   
   /* ---------- CREATE MOVIE CARD ---------- */
   
   function createMovieCard(movie) {
       const card = document.createElement('div');
       card.className = 'movie-card';
       
       const rating = movie.rating ? movie.rating.toFixed(1) : 'N/A';
       
       // Get platforms
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
       `;
       
       card.addEventListener('click', () => {
           openMoviePopup(movie);
       });
       
       return card;
   }
   
   /* ---------- SEARCH FUNCTIONALITY ---------- */
   
   const searchInput = document.getElementById('search-input');
   const searchBtn = document.getElementById('search-btn');
   
   function performSearch() {
       const query = searchInput.value.trim().toLowerCase();
       
       if (!query) {
           // Reset to current filter
           const activeFilter = document.querySelector('.filter-btn.active');
           const genre = activeFilter.dataset.genre;
           filterByGenre(genre);
           return;
       }
       
       filteredMovies = allMovies.filter(movie => 
           movie.title.toLowerCase().includes(query)
       );
       
       document.getElementById('stats-text').textContent = 
           `Found ${filteredMovies.length} movie${filteredMovies.length !== 1 ? 's' : ''} matching "${query}"`;
       
       displayMovies(true);
   }
   
   searchBtn.addEventListener('click', performSearch);
   
   searchInput.addEventListener('keypress', (e) => {
       if (e.key === 'Enter') {
           performSearch();
       }
   });
   
   // Clear search on input clear
   searchInput.addEventListener('input', (e) => {
       if (e.target.value === '') {
           const activeFilter = document.querySelector('.filter-btn.active');
           const genre = activeFilter.dataset.genre;
           filterByGenre(genre);
       }
   });
   
   /* ---------- FILTER BY GENRE ---------- */
   
   function filterByGenre(genre) {
       // Clear search
       searchInput.value = '';
       
       if (genre === 'all') {
           filteredMovies = [...allMovies];
           document.getElementById('stats-text').textContent = `${allMovies.length} movies in our collection`;
       } else {
           filteredMovies = allMovies.filter(movie => movie.genre === genre);
           const genreLabel = genre.charAt(0).toUpperCase() + genre.slice(1);
           document.getElementById('stats-text').textContent = `${filteredMovies.length} ${genreLabel} movies`;
       }
       
       displayMovies(true);
   }
   
   // Filter button click handlers
   const filterBtns = document.querySelectorAll('.filter-btn');
   filterBtns.forEach(btn => {
       btn.addEventListener('click', () => {
           // Remove active class from all
           filterBtns.forEach(b => b.classList.remove('active'));
           
           // Add active to clicked
           btn.classList.add('active');
           
           // Filter
           const genre = btn.dataset.genre;
           filterByGenre(genre);
       });
   });
   
   /* ---------- LOAD MORE ---------- */
   
   document.getElementById('load-more-btn').addEventListener('click', () => {
       displayMovies(false);
   });
   
   /* ---------- MOVIE POPUP ---------- */
   
   function openMoviePopup(movie) {
       const popup = document.getElementById('movie-popup');
       const backdrop = document.getElementById('popup-backdrop');
       
       document.getElementById('popup-poster-img').src = movie.poster_url;
       document.getElementById('popup-title').textContent = movie.title;
       document.getElementById('popup-rating').textContent = movie.rating ? movie.rating.toFixed(1) : 'N/A';
       document.getElementById('popup-year').textContent = '';
       document.getElementById('popup-overview').textContent = movie.overview || 'No description available.';
       
       // Populate platforms
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
   
   document.getElementById('popup-close').addEventListener('click', closeMoviePopup);
   document.getElementById('popup-backdrop').addEventListener('click', closeMoviePopup);
   
   document.addEventListener('keydown', (e) => {
       if (e.key === 'Escape') {
           closeMoviePopup();
       }
   });
   
   /* ---------- BACK BUTTON ---------- */
   
   document.getElementById('back-btn').addEventListener('click', () => {
       window.location.href = 'home.html';
   });
   
   /* ---------- INIT ---------- */
   
   async function init() {
       await loadAllMovies();
   }
   
   init();