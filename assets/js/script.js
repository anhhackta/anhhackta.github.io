/* ═══════════════════════════════════════════════════════
   NGUYỄN BÁ HOÀNG — Portfolio JS
   Lenis + GSAP ScrollTrigger + Anime.js
   Impeccable: one authored moment per motion layer
═══════════════════════════════════════════════════════ */

/* ── Lenis smooth scroll ── */
const lenis = new Lenis({
    duration: 1.25,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
});
(function loop(t){ lenis.raf(t); requestAnimationFrame(loop); })(0);

gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);

/* ── Scroll progress + nav ── */
const fill    = document.getElementById('scrollFill');
const siteNav = document.getElementById('siteNav');

window.addEventListener('scroll', () => {
    const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    fill.style.width = (p * 100) + '%';
    siteNav.classList.toggle('scrolled', window.scrollY > 48);
}, { passive: true });

/* ── Loader ── */
window.addEventListener('load', () => {
    const ld = document.getElementById('loader');
    setTimeout(() => {
        gsap.to(ld, { opacity: 0, duration: .5, ease: 'power2.out',
            onComplete: () => { ld.classList.add('gone'); revealHero(); }
        });
    }, 900);
});

/* ── Hero entrance: one authored stagger ── */
function revealHero() {
    document.querySelectorAll('.hero [data-ao]').forEach(el => {
        const d = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('visible'), d + 60);
    });
    // chips pop after card
    setTimeout(() => {
        anime({
            targets: '.hchip',
            scale: [0, 1], opacity: [0, 1],
            duration: 480,
            delay: anime.stagger(140),
            easing: 'easeOutBack',
        });
    }, 800);
}

/* ── Custom cursor (desktop only) ── */
const ring = document.getElementById('cur-ring');
const dot  = document.getElementById('cur-dot');
const noHover = window.matchMedia('(hover:none)').matches;

if (!noHover) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function trailLoop() {
        rx += (mx - rx) * .1; ry += (my - ry) * .1;
        ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
        requestAnimationFrame(trailLoop);
    })();
    document.querySelectorAll('a,button,.pj-card,.sk-panel,.ab-tags li,.tl-card').forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
    });
    document.addEventListener('mousedown', () => document.body.classList.add('c-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('c-click'));
}

/* ── Nav: mobile toggle + active link ── */
const burger  = document.getElementById('navBurger');
const navList = document.getElementById('navList');

burger.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
});

document.querySelectorAll('.nl').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        navList.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        const target = document.querySelector(a.getAttribute('href'));
        if (target) lenis.scrollTo(target, { offset: -68, duration: 1.5 });
    });
});

const secs = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const y = window.scrollY + 110;
    let cur = '';
    secs.forEach(s => { if (y >= s.offsetTop && y < s.offsetTop + s.offsetHeight) cur = s.id; });
    document.querySelectorAll('.nl').forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}, { passive: true });

/* ── Scroll reveal (IntersectionObserver) ── */
const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const d = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('visible'), d);
        io.unobserve(entry.target);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('[data-ao]').forEach(el => {
    if (!el.closest('.hero')) io.observe(el);
});

/* ── GSAP: section headings blur-reveal ── */
document.querySelectorAll('.sec-h').forEach(h => {
    ScrollTrigger.create({
        trigger: h, start: 'top 86%',
        onEnter: () => gsap.fromTo(h,
            { opacity: 0, y: 22, filter: 'blur(7px)' },
            { opacity: 1, y: 0, filter: 'blur(0)', duration: .75, ease: 'power3.out' }
        ),
    });
});

/* ── HERO parallax layers (5 nested depths) ── */
const hBg = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 };
gsap.to('.hb-mist',   { y: '8%',  ease: 'none', scrollTrigger: { ...hBg, scrub: 2.5 } });
gsap.to('.hb-blobs',  { y: '18%', ease: 'none', scrollTrigger: { ...hBg, scrub: 2 } });
gsap.to('.hb-grid',   { y: '12%', ease: 'none', scrollTrigger: { ...hBg, scrub: 2 } });
gsap.to('.hb-horizon',   { y: '30%', ease: 'none', scrollTrigger: { ...hBg, scrub: 1.2 } });
gsap.to('.hb-petals', { y: '38%', ease: 'none', scrollTrigger: { ...hBg, scrub: .9 } });
gsap.to('.hb-sun',    { y: '20%', x: '-5%', ease: 'none', scrollTrigger: { ...hBg, scrub: 1.4 } });
// Content softly recedes on scroll
gsap.to('.hero-split', { y: 70, opacity: .65, ease: 'none', scrollTrigger: { ...hBg, scrub: .8 } });

/* ── Skill bars ── */
let skillsDone = false;
ScrollTrigger.create({
    trigger: '#skills', start: 'top 70%',
    onEnter: () => {
        if (skillsDone) return; skillsDone = true;
        document.querySelectorAll('.skb-fill').forEach((bar, i) => {
            const pct = bar.dataset.pct;
            setTimeout(() => anime({ targets: bar, width: pct + '%', duration: 1300, easing: 'easeOutExpo' }), i * 90);
        });
    }
});

/* Skill panel 3D tilt */
document.querySelectorAll('.sk-panel').forEach(p => {
    p.addEventListener('mousemove', e => {
        const r = p.getBoundingClientRect();
        gsap.to(p, {
            rotateY: ((e.clientX - r.left) / r.width  - .5) * 10,
            rotateX: (.5 - (e.clientY - r.top)  / r.height) * 10,
            duration: .4, ease: 'power2.out', transformPerspective: 800,
        });
    });
    p.addEventListener('mouseleave', () =>
        gsap.to(p, { rotateX: 0, rotateY: 0, duration: .6, ease: 'elastic.out(1,.4)' })
    );
});

/* ── Stats counter ── */
let statsDone = false;
ScrollTrigger.create({
    trigger: '.stats-band', start: 'top 80%',
    onEnter: () => {
        if (statsDone) return; statsDone = true;
        document.querySelectorAll('.st-n[data-target]').forEach((el, i) => {
            const t = parseInt(el.dataset.target);
            const obj = { v: 0 };
            anime({
                targets: obj, v: t, duration: 2000,
                easing: 'easeOutExpo', round: 1, delay: i * 100,
                update: () => { el.textContent = Math.round(obj.v).toLocaleString(); },
                complete: () => anime({ targets: el, scale: [1, 1.18, 1], duration: 400, easing: 'easeOutBack' }),
            });
        });
    }
});

/* ── Timeline rail draw ── */
gsap.fromTo('.timeline::before',  // using a pseudo — approach via wrapper
    {},{}  // pseudo not animatable directly; use scaleY on a sibling div instead
);
// Add a real rail div instead of relying on CSS pseudo
const tl = document.querySelector('.timeline');
if (tl) {
    const rail = document.createElement('div');
    rail.className = 'tl-rail-anim';
    rail.style.cssText = `position:absolute;left:50%;top:0;bottom:0;width:2px;transform:translateX(-50%);transform-origin:top;background:linear-gradient(180deg,transparent,#3ec6c6 8%,#5b9bd5 50%,#a0aed4 90%,transparent);border-radius:2px;`;
    tl.appendChild(rail);
    // Hide CSS pseudo
    tl.style.setProperty('--tl-pseudo', 'none');
    // Override via JS
    Object.assign(tl.style, { '--before-display': 'none' });
    gsap.fromTo(rail,
        { scaleY: 0, transformOrigin: 'top' },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#journey', start: 'top 65%', end: 'bottom 80%', scrub: 1 } }
    );
    // Also hide ::before via inserted style
    const st = document.createElement('style');
    st.textContent = '.timeline::before{display:none!important;}';
    document.head.appendChild(st);
}

document.querySelectorAll('.tl-dot').forEach(dot => {
    ScrollTrigger.create({
        trigger: dot, start: 'top 78%',
        onEnter: () => gsap.fromTo(dot, { scale: 0 }, { scale: 1, duration: .45, ease: 'back.out(2.5)' }),
    });
});

/* ── Project cards 3D tilt ── */
document.querySelectorAll('.pj-card').forEach(c => {
    c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        gsap.to(c, {
            rotateY: ((e.clientX - r.left) / r.width  - .5) * 12,
            rotateX: (.5 - (e.clientY - r.top)  / r.height) * 12,
            duration: .4, ease: 'power2.out', transformPerspective: 900, transformStyle: 'preserve-3d',
        });
    });
    c.addEventListener('mouseleave', () =>
        gsap.to(c, { rotateX: 0, rotateY: 0, duration: .65, ease: 'elastic.out(1,.4)' })
    );
});

/* ── Magnetic buttons ── */
document.querySelectorAll('.btn-primary, .btn-ghost, .nav-hire').forEach(b => {
    b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        gsap.to(b, {
            x: (e.clientX - r.left - r.width / 2) * .28,
            y: (e.clientY - r.top - r.height / 2) * .28,
            duration: .3, ease: 'power2.out',
        });
    });
    b.addEventListener('mouseleave', () =>
        gsap.to(b, { x: 0, y: 0, duration: .55, ease: 'elastic.out(1,.3)' })
    );
});

/* ── About tags stagger on enter ── */
ScrollTrigger.create({
    trigger: '.ab-tags', start: 'top 85%',
    onEnter: () => anime({
        targets: '.ab-tags li',
        translateY: [20, 0], opacity: [0, 1],
        duration: 500, delay: anime.stagger(60), easing: 'easeOutBack',
    }),
});

/* ── Orbit counter-rotation (keeps icons upright) ── */
document.querySelectorAll('.av-orbit, .aba-orbit').forEach(orbit => {
    // inner icons counter-rotate so text reads correctly
    const icons = orbit.querySelectorAll('.av-orb, .abo');
    let angle = 0;
    (function spinComp() {
        angle += .3;
        icons.forEach(icon => { icon.style.transform = `rotate(${-angle}deg)`; });
        requestAnimationFrame(spinComp);
    })();
});

/* ── Contact form ── */
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const mailto = `mailto:bahoangcran@gmail.com?subject=${encodeURIComponent(fd.get('subject'))}&body=${encodeURIComponent(`Tên: ${fd.get('name')}\nEmail: ${fd.get('email')}\n\n${fd.get('message')}`)}`;
    window.location.href = mailto;
    anime({ targets: '.ct-form-wrap', scale: [1, .98, 1], duration: 500, easing: 'easeInOutQuad' });
    setTimeout(() => e.target.reset(), 700);
});

/* ── Back to top ── */
document.querySelector('.footer-top').addEventListener('click', e => {
    e.preventDefault();
    lenis.scrollTo('#hero', { duration: 2 });
});

/* ── Refresh ST on load ── */
window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 300));

console.log('%cNguyễn Bá Hoàng', 'font-weight:800;font-size:18px;color:#3ec6c6');
console.log('%cSolo Game Developer · bahoangcran@gmail.com', 'font-size:12px;color:#8e9bbf');

