const typedWords = [
  "multimodal AI systems",
  "computer vision pipelines",
  "vision-language models",
  "retrieval-augmented generation",
  "efficient LLM solutions",
  "intelligent robotic systems"
];

const typedEl = document.getElementById("typedText");
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  const current = typedWords[wordIndex];

  if (!deleting) {
    typedEl.textContent = current.slice(0, charIndex++);
    if (charIndex > current.length) {
      deleting = true;
      return setTimeout(typeLoop, 1250);
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % typedWords.length;
      charIndex = 0;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 70);
}
typeLoop();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const counted = new Set();
const numberObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || counted.has(entry.target)) return;
    counted.add(entry.target);
    const end = Number(entry.target.dataset.count);
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      entry.target.textContent = Math.floor(end * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: .5 });

document.querySelectorAll("[data-count]").forEach(el => numberObserver.observe(el));

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  toTop.classList.toggle("show", window.scrollY > 600);
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.getElementById("year").textContent = new Date().getFullYear();

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
let animationFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  createParticles();
}

function createParticles() {
  const count = Math.min(85, Math.floor(window.innerWidth / 15));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - .5) * .22,
    vy: (Math.random() - .5) * .22,
    r: Math.random() * 1.6 + .4
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
    if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(119, 151, 255, .65)";
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x, dy = p.y - q.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 105) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(77, 119, 220, ${.09 * (1 - d / 105)})`;
        ctx.stroke();
      }
    }
  });
  animationFrame = requestAnimationFrame(drawParticles);
}

resizeCanvas();
drawParticles();
window.addEventListener("resize", () => {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  drawParticles();
});
