/* ============================================
   LIVIA REGOLI - PERSONAL WEBSITE
   JavaScript - Three.js & Interactions
   ============================================ */

// ==========================================
// THREE.JS SCENE SETUP
// ==========================================

const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true 
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// ==========================================
// PARTICLES SYSTEM
// ==========================================

function createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Spherical distribution
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 3 + Math.random() * 4;

        posArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        posArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        posArray[i + 2] = radius * Math.cos(phi);

        // Purple to violet gradient
        const t = Math.random();
        colorsArray[i] = 0.486 + t * 0.2;     // R
        colorsArray[i + 1] = 0.227 + t * 0.3; // G
        colorsArray[i + 2] = 0.929;           // B
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    return new THREE.Points(particlesGeometry, particlesMaterial);
}

const particlesMesh = createParticles();
scene.add(particlesMesh);

// ==========================================
// PLATONIC SOLIDS (Philosophy Reference)
// ==========================================

// Icosahedron - outer wireframe
const icosaGeometry = new THREE.IcosahedronGeometry(2, 1);
const icosaMaterial = new THREE.MeshBasicMaterial({
    color: 0x7c3aed,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const icosahedron = new THREE.Mesh(icosaGeometry, icosaMaterial);
scene.add(icosahedron);

// Dodecahedron - inner wireframe
const dodecaGeometry = new THREE.DodecahedronGeometry(1.2, 0);
const dodecaMaterial = new THREE.MeshBasicMaterial({
    color: 0xa78bfa,
    wireframe: true,
    transparent: true,
    opacity: 0.1
});
const dodecahedron = new THREE.Mesh(dodecaGeometry, dodecaMaterial);
scene.add(dodecahedron);

// ==========================================
// CONNECTING LINES
// ==========================================

function createConnectingLines() {
    const linesGeometry = new THREE.BufferGeometry();
    const linesCount = 50;
    const linesPositions = new Float32Array(linesCount * 6);

    for (let i = 0; i < linesCount * 6; i += 6) {
        const theta1 = Math.random() * Math.PI * 2;
        const phi1 = Math.acos(2 * Math.random() - 1);
        const r1 = 2 + Math.random() * 2;

        const theta2 = theta1 + (Math.random() - 0.5) * 0.5;
        const phi2 = phi1 + (Math.random() - 0.5) * 0.5;
        const r2 = 2 + Math.random() * 2;

        linesPositions[i] = r1 * Math.sin(phi1) * Math.cos(theta1);
        linesPositions[i + 1] = r1 * Math.sin(phi1) * Math.sin(theta1);
        linesPositions[i + 2] = r1 * Math.cos(phi1);

        linesPositions[i + 3] = r2 * Math.sin(phi2) * Math.cos(theta2);
        linesPositions[i + 4] = r2 * Math.sin(phi2) * Math.sin(theta2);
        linesPositions[i + 5] = r2 * Math.cos(phi2);
    }

    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linesPositions, 3));

    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x7c3aed,
        transparent: true,
        opacity: 0.1
    });

    return new THREE.LineSegments(linesGeometry, linesMaterial);
}

const lines = createConnectingLines();
scene.add(lines);

// Set camera position
camera.position.z = 5;

// ==========================================
// MOUSE INTERACTION
// ==========================================

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// ==========================================
// SCROLL EFFECTS
// ==========================================

let scrollY = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// ==========================================
// ANIMATION LOOP
// ==========================================

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse following
    targetX += (mouseX - targetX) * 0.02;
    targetY += (mouseY - targetY) * 0.02;

    // Rotate particles based on mouse and time
    particlesMesh.rotation.y = elapsedTime * 0.05 + targetX * 0.5;
    particlesMesh.rotation.x = targetY * 0.3;

    // Rotate icosahedron
    icosahedron.rotation.x = elapsedTime * 0.1 + targetY * 0.2;
    icosahedron.rotation.y = elapsedTime * 0.08 + targetX * 0.2;

    // Rotate dodecahedron (opposite direction)
    dodecahedron.rotation.x = -elapsedTime * 0.12;
    dodecahedron.rotation.y = -elapsedTime * 0.1;

    // Rotate connecting lines
    lines.rotation.y = elapsedTime * 0.03;
    lines.rotation.z = elapsedTime * 0.02;

    // Scroll-based camera movement
    camera.position.y = -scrollY * 0.001;
    camera.position.z = 5 + scrollY * 0.001;

    // Pulsing effect on icosahedron
    const pulse = Math.sin(elapsedTime * 2) * 0.02;
    icosahedron.scale.set(1 + pulse, 1 + pulse, 1 + pulse);

    renderer.render(scene, camera);
}

animate();

// ==========================================
// WINDOW RESIZE HANDLER
// ==========================================

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================
// INGEGNERE TOGGLE EASTER EGG
// ==========================================

const toggleElement = document.getElementById('ingegnere-toggle');
const variants = ['Ingegner*', 'Ingegnere', 'Ingegnera', 'Ingegnerǝ', 'Engineer'];
let currentVariant = 0;

toggleElement.addEventListener('click', () => {
    currentVariant = (currentVariant + 1) % variants.length;
    toggleElement.textContent = variants[currentVariant];
    
    // Click animation
    toggleElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        toggleElement.style.transform = 'scale(1)';
    }, 150);
});

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================

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

// Apply initial hidden state and observe elements
document.querySelectorAll('.interest-card, .stat-card, .quote-container').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
