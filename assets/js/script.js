/* ================================================================
   NGUYỄN BÁ HOÀNG — PORTFOLIO JS
   Anime + European Architecture — Layered Scroll Animations
   ================================================================ */

// ===== LENIS SMOOTH SCROLL =====
const lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
});
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// ===== GSAP SETUP =====
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

// ===== SCROLL PROGRESS BAR =====
const scrollFill = document.getElementById('scrollFill');
const navbar    = document.getElementById('navbar');

function onScrollUpdate() {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollFill.style.width = pct + '%';
    navbar.classList.toggle('scrolled', scrollTop > 50);
}
window.addEventListener('scroll', onScrollUpdate, { passive: true });
onScrollUpdate();

// ===== CUSTOM CURSOR =====
const cursorDot   = document.getElementById('cursorDot');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

const isTouch = window.matchMedia('(hover: none)').matches;

if (!isTouch) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Trail lags behind
    (function animTrail() {
        trailX += (mouseX - trailX) * 0.12;
        trailY += (mouseY - trailY) * 0.12;
        cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animTrail);
    })();

    // Hover state on interactive elements
    document.querySelectorAll('a, button, .project-card, .skill-panel, .tag-pill, .contact-tile').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
}

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    const ls = document.getElementById('loadingScreen');
    setTimeout(() => {
        gsap.to(ls, { opacity: 0, duration: 0.5, onComplete: () => ls.classList.add('hidden') });
        initHeroAnimations();
    }, 1200);
});

// ===== HERO ENTRANCE ANIMATIONS =====
function initHeroAnimations() {
    // Stagger elements in
    const heroEls = document.querySelectorAll('.hero-content .reveal-up');
    heroEls.forEach((el, i) => {
        const delay = parseFloat(el.dataset.delay || 0) * 800;
        setTimeout(() => el.classList.add('visible'), delay + 200);
    });

    // Animate sun rays individually
    document.querySelectorAll('.sun-ray').forEach((ray, i) => {
        gsap.to(ray, {
            rotate: `+=${360}`,
            duration: 12 + i * 2,
            repeat: -1,
            ease: 'none',
            transformOrigin: '0 50%',
        });
    });

    // Kick off petals
    document.querySelectorAll('.petal').forEach((petal) => {
        petal.style.top = '-5%';
    });
}

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal-up, .reveal-side, .reveal-fade').forEach(el => {
    if (!el.closest('.hero')) revealObserver.observe(el);
});

// ===== HERO PARALLAX — NESTED LAYERS =====
// Layer 1: sky gradient (slowest)
gsap.to('.layer-sky', {
    y: '8%',
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
});

// Layer 2: clouds
gsap.to('.layer-clouds', {
    y: '15%',
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
});

// Layer 3: buildings (medium speed)
gsap.to('.layer-buildings', {
    y: '25%',
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
});

// Layer 4: ground + petals (faster)
gsap.to('.layer-ground, .layer-petals', {
    y: '35%',
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.8 }
});

// Sun moves diagonally
gsap.to('.layer-sun', {
    y: '20%',
    x: '-5%',
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
});

// Hero content fades as you scroll past
gsap.to('.hero-content', {
    y: 100,
    opacity: 0.5,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
});

// ===== CLOUDS DRIFT =====
document.querySelectorAll('.layer-clouds .cloud').forEach((cloud, i) => {
    anime({
        targets: cloud,
        translateX: (i % 2 === 0 ? 1 : -1) * (50 + i * 20),
        duration: 8000 + i * 2000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
    });
});

// ===== FLOATING DECORATIONS — PARALLAX + DRIFT =====
document.querySelectorAll('.float-shape').forEach((shape, i) => {
    const depth = parseFloat(shape.dataset.depth || 0.1) * 100;
    gsap.to(shape, {
        y: `-${depth}px`,
        ease: 'none',
        scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 }
    });
    anime({
        targets: shape,
        translateY: [-10, 10],
        rotate: [-8, 8],
        opacity: [0.1, 0.25],
        duration: 3000 + i * 500,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        delay: i * 300,
    });
});

// ===== NAVIGATION =====
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        const target = document.querySelector(link.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: -70, duration: 1.5 });
    });
});

// Active nav on scroll
const sections = document.querySelectorAll('section[id]');
function highlightNav() {
    const scrollY = window.scrollY + 110;
    let cur = '';
    sections.forEach(s => {
        if (scrollY >= s.offsetTop && scrollY < s.offsetTop + s.offsetHeight) cur = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
    });
}
window.addEventListener('scroll', highlightNav, { passive: true });

// ===== SECTION HEADING BLUR REVEAL =====
document.querySelectorAll('.section-heading').forEach(h => {
    ScrollTrigger.create({
        trigger: h,
        start: 'top 85%',
        onEnter: () => gsap.fromTo(h,
            { opacity: 0, y: 30, filter: 'blur(8px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'power3.out' }
        ),
    });
});

// ===== SKILL BARS =====
ScrollTrigger.create({
    trigger: '.skills',
    start: 'top 70%',
    onEnter: () => {
        document.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
            const level = bar.dataset.level;
            setTimeout(() => {
                anime({ targets: bar, width: level + '%', duration: 1400, easing: 'easeOutExpo' });
            }, i * 160);
        });
    }
});

// Skill panel hover — panel tilts slightly
document.querySelectorAll('.skill-panel').forEach(panel => {
    panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
        gsap.to(panel, { rotateY: x, rotateX: y, duration: 0.4, ease: 'power2.out', transformPerspective: 800 });
    });
    panel.addEventListener('mouseleave', () => {
        gsap.to(panel, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        // emoji spin
        anime({ targets: panel.querySelector('.panel-emoji'), scale: [1, 1.4, 1], rotate: [0, 360], duration: 700, easing: 'easeOutBack' });
    });
});

// ===== STATS COUNTER =====
let statsDone = false;
ScrollTrigger.create({
    trigger: '.stats-band',
    start: 'top 80%',
    onEnter: () => {
        if (statsDone) return;
        statsDone = true;
        document.querySelectorAll('.stat-num').forEach((el, i) => {
            const target = parseInt(el.dataset.target);
            const obj = { val: 0 };
            anime({
                targets: obj,
                val: target,
                duration: 2200,
                easing: 'easeOutExpo',
                round: 1,
                delay: i * 130,
                update: () => { el.textContent = Math.round(obj.val).toLocaleString(); },
                complete: () => anime({ targets: el, scale: [1, 1.2, 1], duration: 500, easing: 'easeOutBack' }),
            });
        });
    }
});

// ===== TIMELINE =====
// Rail grows as you scroll through the section
gsap.fromTo('.timeline-rail',
    { scaleY: 0, transformOrigin: 'top' },
    {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.journey', start: 'top 65%', end: 'bottom 80%', scrub: 1 },
    }
);

// Node dots pop in
document.querySelectorAll('.timeline-node').forEach(node => {
    const dot = node.querySelector('.node-dot');
    ScrollTrigger.create({
        trigger: node,
        start: 'top 78%',
        onEnter: () => gsap.fromTo(dot,
            { scale: 0 },
            { scale: 1, duration: 0.5, ease: 'back.out(2.5)' }
        ),
    });
});

// ===== PROJECT CARDS — 3D TILT =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const r  = card.getBoundingClientRect();
        const x  = e.clientX - r.left;
        const y  = e.clientY - r.top;
        const ry = ((x - r.width  / 2) / r.width)  * 12;
        const rx = ((r.height / 2 - y) / r.height) * 12;
        gsap.to(card, { rotateY: ry, rotateX: rx, duration: 0.4, ease: 'power2.out', transformPerspective: 900 });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
    // Thumb icon bounce on card hover
    card.addEventListener('mouseenter', () => {
        anime({ targets: card.querySelector('.thumb-icon'), scale: [1, 1.2, 1], rotate: [0, 15, -15, 0], duration: 700, easing: 'easeOutElastic(1, 0.5)' });
    });
});

// ===== PORTRAIT ORBIT — stop CSS rotation, use JS for more control =====
// (we keep CSS animation in place; add extra pulse on scroll into view)
ScrollTrigger.create({
    trigger: '.about-portrait',
    start: 'top 70%',
    onEnter: () => {
        anime({
            targets: '.orbit-dot',
            scale: [0, 1],
            opacity: [0, 1],
            duration: 600,
            delay: anime.stagger(100, { start: 300 }),
            easing: 'easeOutBack',
        });
    },
});

// ===== TAG PILLS WAVE =====
ScrollTrigger.create({
    trigger: '.about-tags',
    start: 'top 85%',
    onEnter: () => {
        anime({
            targets: '.tag-pill',
            translateY: [30, 0],
            opacity: [0, 1],
            duration: 600,
            delay: anime.stagger(80),
            easing: 'easeOutBack',
        });
    },
});

// ===== BUTTON MAGNETIC =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
            x: (e.clientX - r.left - r.width  / 2) * 0.28,
            y: (e.clientY - r.top  - r.height / 2) * 0.28,
            duration: 0.3, ease: 'power2.out',
        });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
    });
});

// ===== SOCIAL ICONS BOUNCE =====
document.querySelectorAll('.hero-socials a, .social-chip').forEach(link => {
    link.addEventListener('mouseenter', () =>
        anime({ targets: link, scale: 1.18, duration: 300, easing: 'easeOutBack' })
    );
    link.addEventListener('mouseleave', () =>
        anime({ targets: link, scale: 1, duration: 300, easing: 'easeOutQuad' })
    );
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const mailto = `mailto:bahoangcran@gmail.com?subject=${encodeURIComponent(fd.get('subject'))}&body=${encodeURIComponent(`Tên: ${fd.get('name')}\nEmail: ${fd.get('email')}\n\nLời nhắn:\n${fd.get('message')}`)}`;
    window.location.href = mailto;
    anime({ targets: '.contact-form-wrap', scale: [1, 0.98, 1], duration: 500, easing: 'easeInOutQuad' });
    setTimeout(() => e.target.reset(), 800);
});

// ===== BACK TO TOP =====
document.querySelector('.footer-up').addEventListener('click', (e) => {
    e.preventDefault();
    lenis.scrollTo('#top', { duration: 2 });
});

// ===== MARQUEE PAUSE ON HOVER =====
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
    marqueeTrack.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
}

// ===== SCROLL TRIGGER REFRESH =====
window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 300));

// ===== CONSOLE EASTER EGG =====
console.log('%c🏰 Hoàng\'s Gallery', 'font-size:24px;font-weight:bold;color:#ff6b6b;');
console.log('%cChào mừng đến bảo tàng của Nguyễn Bá Hoàng!', 'font-size:14px;color:#4ecdc4;');
console.log('%cĐang tìm cơ hội trong Game Development 🎮', 'font-size:14px;color:#ffd93d;');
console.log('%cEmail: bahoangcran@gmail.com', 'font-size:14px;color:#ff6b6b;');
