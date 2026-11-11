/* ═══════════════════════════════════════════════════════════
   NGUYỄN BÁ HOÀNG — Portfolio JS
   Lenis + GSAP ScrollTrigger + Anime.js
   ═══════════════════════════════════════════════════════════ */

/* ── Smooth scroll ── */
const lenis = new Lenis({
    duration: 1.3,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
});
(function raf(t){ lenis.raf(t); requestAnimationFrame(raf); })(0);

gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

/* ── Scroll progress + nav ── */
const scrollFill = document.getElementById('scrollFill');
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    scrollFill.style.width = pct + '%';
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Loader ── */
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        gsap.to(loader, {
            opacity: 0, duration: .6,
            onComplete: () => {
                loader.classList.add('gone');
                runHeroEntrance();
            }
        });
    }, 1000);
});

/* ── Hero entrance: stagger all data-anime elements ── */
function runHeroEntrance() {
    document.querySelectorAll('.hero [data-anime]').forEach(el => {
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), delay + 100);
    });
    // Chips pop in after card
    setTimeout(() => {
        anime({
            targets: '.hchip',
            scale: [0, 1],
            opacity: [0, 1],
            duration: 500,
            delay: anime.stagger(150),
            easing: 'easeOutBack',
        });
    }, 900);
    // Page num count up feel
    setTimeout(() => {
        anime({
            targets: '.hcard-num',
            opacity: [0, 1],
            translateX: [20, 0],
            duration: 800,
            easing: 'easeOutExpo',
        });
    }, 700);
}

/* ── Custom cursor ── */
const ring = document.getElementById('cursorRing');
const dot  = document.getElementById('cursorDot');
const isTouchDev = window.matchMedia('(hover:none)').matches;

if (!isTouchDev) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function trailLoop() {
        rx += (mx - rx) * .1;
        ry += (my - ry) * .1;
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(trailLoop);
    })();
    document.querySelectorAll('a,button,.pj-card,.sk-panel,.ab-tag,.tl-card,.ct-tile,.role-chip').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
    });
    document.addEventListener('mousedown', () => document.body.classList.add('cur-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cur-click'));
}

/* ── Nav mobile ── */
const burger   = document.getElementById('navBurger');
const navList  = document.getElementById('navList');
burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navList.classList.toggle('open');
});
document.querySelectorAll('.nl').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        burger.classList.remove('open');
        navList.classList.remove('open');
        const target = document.querySelector(link.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: -68, duration: 1.5 });
    });
});

/* Active nav highlight */
const secs = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const y = window.scrollY + 100;
    let cur = '';
    secs.forEach(s => { if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) cur = s.id; });
    document.querySelectorAll('.nl').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}, { passive: true });

/* ── Reveal on scroll (IntersectionObserver) ── */
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-anime]').forEach(el => {
    if (!el.closest('.hero')) io.observe(el);
});

/* ── HERO PARALLAX — multi-layer nested ── */
// Sky: slowest
gsap.to('.hbg-sky', { y: '8%', ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 } });
// Blobs
gsap.to('.hbg-blobs', { y: '18%', ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 } });
// Grid
gsap.to('.hbg-grid', { y: '10%', ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.8 } });
// Buildings
gsap.to('.hbg-buildings', { y: '28%', ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
// Petals
gsap.to('.hbg-petals', { y: '35%', ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .8 } });
// Sun moves diagonally
gsap.to('.hbg-sun', { y: '22%', x: '-6%', ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.1 } });
// Hero split fades as scroll
gsap.to('.hero-split', { y: 90, opacity: .6, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });

/* ── Clouds drift ── */
document.querySelectorAll('.hero-bg .blob').forEach((b, i) => {
    anime({
        targets: b,
        translateX: (i % 2 === 0 ? 1 : -1) * (40 + i * 20),
        translateY: (i % 3 === 0 ? 1 : -1) * 20,
        duration: 7000 + i * 2000,
        direction: 'alternate', loop: true,
        easing: 'easeInOutSine',
    });
});

/* ── SECTION HEADING blur-reveal ── */
document.querySelectorAll('.sec-title').forEach(h => {
    ScrollTrigger.create({
        trigger: h, start: 'top 85%',
        onEnter: () => gsap.fromTo(h,
            { opacity: 0, y: 25, filter: 'blur(8px)' },
            { opacity: 1, y: 0, filter: 'blur(0)', duration: .8, ease: 'power3.out' }
        ),
    });
});

/* ── SKILL BARS animate on enter ── */
ScrollTrigger.create({
    trigger: '.skills', start: 'top 70%',
    onEnter: () => {
        document.querySelectorAll('.skb-fill').forEach((bar, i) => {
            const pct = bar.dataset.pct;
            setTimeout(() => anime({
                targets: bar,
                width: pct + '%',
                duration: 1300 + i * 60,
                easing: 'easeOutExpo',
            }), i * 100);
        });
    }
});

/* Skill panel 3D tilt */
document.querySelectorAll('.sk-panel').forEach(panel => {
    panel.addEventListener('mousemove', e => {
        const r = panel.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width  - .5) * 12;
        const y = ((e.clientY - r.top)  / r.height - .5) * -12;
        gsap.to(panel, { rotateY: x, rotateX: y, duration: .4, ease: 'power2.out', transformPerspective: 800 });
    });
    panel.addEventListener('mouseleave', () => {
        gsap.to(panel, { rotateX: 0, rotateY: 0, duration: .7, ease: 'elastic.out(1,.4)' });
        anime({ targets: panel.querySelector('.sk-icon'), scale: [1, 1.4, 1], rotate: [0, 360], duration: 700, easing: 'easeOutBack' });
    });
});

/* ── STATS COUNTER ── */
let statsDone = false;
ScrollTrigger.create({
    trigger: '.stats-band', start: 'top 80%',
    onEnter: () => {
        if (statsDone) return; statsDone = true;
        document.querySelectorAll('.stat-n').forEach((el, i) => {
            const target = parseInt(el.dataset.target);
            const obj = { v: 0 };
            anime({
                targets: obj, v: target, duration: 2200,
                easing: 'easeOutExpo', round: 1, delay: i * 110,
                update: () => { el.textContent = Math.round(obj.v).toLocaleString(); },
                complete: () => anime({ targets: el, scale: [1, 1.2, 1], duration: 400, easing: 'easeOutBack' }),
            });
        });
    }
});

/* ── TIMELINE rail grow + dot pop ── */
gsap.fromTo('.tl-rail',
    { scaleY: 0, transformOrigin: 'top' },
    { scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '.journey', start: 'top 65%', end: 'bottom 80%', scrub: 1 } }
);
document.querySelectorAll('.tl-node').forEach(node => {
    const dot = node.querySelector('.tl-dot');
    ScrollTrigger.create({
        trigger: node, start: 'top 78%',
        onEnter: () => gsap.fromTo(dot, { scale: 0 }, { scale: 1, duration: .5, ease: 'back.out(2.5)' }),
    });
});

/* ── PROJECT CARDS 3D tilt ── */
document.querySelectorAll('.pj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        gsap.to(card, {
            rotateY: ((e.clientX - r.left) / r.width  - .5) * 14,
            rotateX: (.5 - (e.clientY - r.top) / r.height) * 14,
            duration: .4, ease: 'power2.out', transformPerspective: 900,
        });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: .7, ease: 'elastic.out(1,.4)' });
    });
    card.addEventListener('mouseenter', () => {
        anime({ targets: card.querySelector('.pj-emoji'), scale: [1, 1.25, 1], rotate: [0, 15, -15, 0], duration: 700, easing: 'easeOutElastic(1,.5)' });
    });
});

/* ── ABOUT portrait orbit stagger ── */
ScrollTrigger.create({
    trigger: '.ab-portrait', start: 'top 70%',
    onEnter: () => anime({
        targets: '.orb',
        scale: [0, 1], opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(100, { start: 300 }),
        easing: 'easeOutBack',
    }),
});

/* ── ABOUT tags stagger ── */
ScrollTrigger.create({
    trigger: '.ab-tags', start: 'top 85%',
    onEnter: () => anime({
        targets: '.ab-tag',
        translateY: [25, 0], opacity: [0, 1],
        duration: 550,
        delay: anime.stagger(70),
        easing: 'easeOutBack',
    }),
});

/* ── ROLE CHIPS wave ── */
document.querySelectorAll('.role-chip').forEach((chip, i) => {
    anime({
        targets: chip,
        translateY: [0, -4, 0],
        duration: 2000 + i * 300,
        loop: true, easing: 'easeInOutSine',
        delay: i * 200,
    });
});

/* ── BUTTONS magnetic effect ── */
document.querySelectorAll('.btn-main, .btn-line, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
            x: (e.clientX - r.left - r.width / 2) * .3,
            y: (e.clientY - r.top - r.height / 2) * .3,
            duration: .3, ease: 'power2.out',
        });
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.3)' });
    });
});

/* ── SOCIAL icons bounce ── */
document.querySelectorAll('.h-socials a, .ct-socials a').forEach(a => {
    a.addEventListener('mouseenter', () => anime({ targets: a, scale: 1.2, duration: 300, easing: 'easeOutBack' }));
    a.addEventListener('mouseleave', () => anime({ targets: a, scale: 1, duration: 300, easing: 'easeOutQuad' }));
});

/* ── Contact form ── */
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    window.location.href = `mailto:bahoangcran@gmail.com?subject=${encodeURIComponent(fd.get('subject'))}&body=${encodeURIComponent(`Tên: ${fd.get('name')}\nEmail: ${fd.get('email')}\n\n${fd.get('message')}`)}`;
    anime({ targets: '.ct-form-wrap', scale: [1, .98, 1], duration: 500, easing: 'easeInOutQuad' });
    setTimeout(() => e.target.reset(), 800);
});

/* ── Back to top ── */
document.querySelector('.footer-top').addEventListener('click', e => {
    e.preventDefault();
    lenis.scrollTo('#hero', { duration: 2 });
});

/* ── Refresh ── */
window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 300));

console.log('%c⚔️ Nguyễn Bá Hoàng', 'font-size:20px;font-weight:bold;color:#ff6b6b;');
console.log('%cSolo Game Developer · Đà Nẵng · bahoangcran@gmail.com', 'font-size:13px;color:#4ecdc4;');
