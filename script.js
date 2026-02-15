/* =========================================================
   CINE MOOD — CINEMATIC PARALLAX ENGINE
   ========================================================= */

/* ---------------- CONFIG ---------------- */

const GENRES = ["action", "horror", "romance"];

const TEXT_STORY = [
    "Too many movies.<br>Nothing <i>feels</i> right.",
    "And somewhere in the silence...<br>the <i>right story</i> waits.",
    "What if stories followed<br>how you <i>feel</i>..."
];

/* speed per depth layer */
const SPEEDS = {
    far: 0.5,   // slowest
    mid: 0.5,    // medium
    near: 0.5    // fastest
};


/* ---------------- DOM ---------------- */

const rowTop = document.getElementById("row-top");   // far
const rowMid = document.getElementById("row-mid");   // mid
const rowBot = document.getElementById("row-bot");   // near

const heroText = document.getElementById("hero-text");
const enterBtn = document.querySelector(".enter-btn");

/* =========================================================
   CINEMATIC INFINITE POSTER MOTION — STABLE ENGINE
   ========================================================= */

const rows = [
    { el: document.getElementById("row-top"), speed: 0.18, x: 0 },
    { el: document.getElementById("row-mid"), speed: 0.18, x: 0 },
    { el: document.getElementById("row-bot"), speed: 0.18, x: 0 }
];

/* ---------- ensure seamless width ---------- */
rows.forEach(row => {
    const posters = Array.from(row.el.children);

    // duplicate once for perfect loop
    posters.forEach(p => {
        const clone = p.cloneNode(true);
        row.el.appendChild(clone);
    });
});




/* =========================================================
   LOAD MOVIES
   ========================================================= */

async function loadRow(rowEl, genre) {
    const res = await fetch(`data/${genre}.json`);
    const movies = await res.json();

    const loop = [...movies, ...movies, ...movies];

    loop.forEach(movie => {
        if (!movie.poster_url) return;

        const img = document.createElement("img");
        img.src = movie.poster_url;
        img.alt = movie.title || "movie";

        rowEl.appendChild(img);
    });

    // Fix: Set initial position to hide the gap
    rowEl.style.transform = 'translate3d(0, 0, 0)';
}


/* =========================================================
   INFINITE SCROLL ANIMATION
   ========================================================= */

/* =========================================================
   SMOOTH INFINITE SCROLL ANIMATION (NO LAG)
   ========================================================= */

/* =========================================================
   SMOOTH INFINITE SCROLL ANIMATION
   ========================================================= */

function startRowAnimation() {
    function animate() {
        rowsState.forEach(row => {
            const width = row.el.scrollWidth / 2;

            // Move the row
            row.x += row.speed * row.dir;

            // Loop logic (FIXED)
            if (row.dir === -1) {
                // Left-moving rows
                if (row.x <= -width) row.x = 0;
            } else {
                // Right-moving rows
                if (row.x >= 0) row.x = -width;  // Start from left edge
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}



/* =========================================================
   MOUSE PARALLAX DEPTH (FIXED)
   ========================================================= */

let mouseX = 0;
let mouseY = 0;

window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
});

/* parallax state - REDUCED DEPTH */
const rowsState = [
    { el: rowTop, depth: 3, speed: SPEEDS.far, dir: -1, x: 0 },      // Was 20
    { el: rowMid, depth: 4, speed: SPEEDS.mid, dir: 1, x: 0 },       // Was 35
    { el: rowBot, depth: 5, speed: SPEEDS.near, dir: -1, x: 0 }      // Was 50
];

function startParallax() {
    function update() {
        rowsState.forEach(row => {
            // Only mouse parallax offset
            const depthX = mouseX * row.depth;
            const depthY = mouseY * row.depth * 0.2;  // Was 0.5 - now much less

            const baseX = row.x || 0;

            row.el.style.transform =
                `translate3d(${baseX + depthX}px, ${depthY}px, 0)`;
        });

        requestAnimationFrame(update);
    }

    update();
}

/* =========================================================
   AUTO-CYCLING TEXT (FADE OUT/IN)
   ========================================================= */

let currentIndex = 0;

function updateStory(index) {

    heroText.style.opacity = 0;
    heroText.style.transform = "translateY(10px)";

    setTimeout(() => {
        heroText.innerHTML = TEXT_STORY[index];
        heroText.style.opacity = 1;
        heroText.style.transform = "translateY(0)";

        currentIndex = index;

    }, 600);
}

function startTextCycle() {
    // First text change after 4 seconds
    setTimeout(() => {
        updateStory(1);

        // Second text change after another 4 seconds
        setTimeout(() => {
            updateStory(2);
        }, 4000);

    }, 4000);
}


/* =========================================================
   INIT
   ========================================================= */

async function init() {

    heroText.innerHTML = TEXT_STORY[0];
    enterBtn.classList.add("show");  // Always visible

    await Promise.all([
        loadRow(rowTop, GENRES[0]),
        loadRow(rowMid, GENRES[1]),
        loadRow(rowBot, GENRES[2])
    ]);

    startRowAnimation();
    startParallax();
    startTextCycle(); // Start automatic text cycling
}

init();

/* =========================================================
   REAL WEBGL CURSOR DEPTH BUMP — Phase 1
   Lightweight displacement illusion
   ========================================================= */

const canvas = document.getElementById("depth-canvas");
const gl = canvas.getContext("webgl");

if (gl) {

    /* ---------- resize ---------- */
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    resize();
    window.addEventListener("resize", resize);

    /* ---------- vertex shader ---------- */
    const vsSource = `
    attribute vec2 position;
    varying vec2 vUv;

    void main(){
      vUv = position * 0.5 + 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

    /* ---------- fragment shader (DEPTH MAGIC) ---------- */
    const fsSource = `
    precision mediump float;

    varying vec2 vUv;
    uniform vec2 uMouse;
    uniform vec2 uRes;

    void main(){

        vec2 uv = vUv;

        // normalized mouse
        vec2 m = uMouse / uRes;

        // distance from cursor
        float d = distance(uv, m);

        // ===== DEPTH DISPLACEMENT =====
        float radius = 0.35;

        float strength = smoothstep(radius, 0.0, d);

        // push pixels toward mouse center (zoom-in illusion)
        vec2 dir = normalize(uv - m);
        uv -= dir * strength * 0.08;

        // ===== SHADING FOR DEPTH =====
        float shade = strength * 0.35;

        vec3 color = vec3(0.0);

        // Blue-ish glow (Amazon Prime style)
        vec3 blueGlow = vec3(0.2, 0.4, 0.8);  // RGB for blue
        color += blueGlow * shade;

        gl_FragColor = vec4(color, 1.0);
    }
    `;


    /* ---------- shader compile ---------- */
    function compile(type, source) {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        return s;
    }

    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    /* ---------- full screen quad ---------- */
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -1, -1, 1, -1, -1, 1,
            -1, 1, 1, -1, 1, 1
        ]),
        gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    /* ---------- uniforms ---------- */
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uRes = gl.getUniformLocation(program, "uRes");

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = canvas.height - e.clientY;
    });

    /* ---------- render loop ---------- */
    function render() {
        gl.uniform2f(uMouse, mouseX, mouseY);
        gl.uniform2f(uRes, canvas.width, canvas.height);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }

    render();
}

enterBtn.addEventListener("click", () => {
    // Fade out animation
    document.body.classList.add("fade-out-tunnel");
    
    // Redirect after fade completes
    setTimeout(() => {
        window.location.href = "auth.html";
    }, 1000);
});