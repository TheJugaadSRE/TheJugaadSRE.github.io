// ============================================================
// script.js — Final fixed version
// Key changes:
// 1. Auto-injects hamburger button on every page (no HTML edits needed)
// 2. Hamburger toggle works on all pages
// 3. Mobile scroll fully unlocked
// 4. All cosmic JS disabled on mobile (was re-showing hidden elements)
// 5. No duplicate event listeners
// ============================================================

const isMobile = () => window.innerWidth <= 768;

// ---- INJECT HAMBURGER if missing (fixes all old pages) ----
function ensureHamburger() {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    let hamburger = navContainer.querySelector('.hamburger');
    if (!hamburger) {
        hamburger = document.createElement('button');
        hamburger.className = 'hamburger';
        hamburger.setAttribute('aria-label', 'Toggle menu');
        hamburger.setAttribute('type', 'button');
        hamburger.innerHTML = '<span></span><span></span><span></span>';
        navContainer.appendChild(hamburger);
    }

    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    // Give navMenu an id for easy targeting
    navMenu.id = navMenu.id || 'navMenuMain';

    // Remove any old listeners by cloning
    const newBtn = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newBtn, hamburger);

    newBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('active');
        newBtn.classList.toggle('active', isOpen);
        newBtn.setAttribute('aria-expanded', isOpen);
        // Prevent body scroll when menu open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !newBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            newBtn.classList.remove('active');
            newBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });

    // Close on nav link click
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            newBtn.classList.remove('active');
            newBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });
}

// ---- FIX MOBILE SCROLL ----
function fixMobileScroll() {
    if (!isMobile()) return;

    // Force scroll to work — override any blocking CSS
    document.documentElement.style.cssText += ';overflow-x:hidden!important;overflow-y:auto!important;';
    document.body.style.cssText += ';overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior-y:auto!important;-webkit-overflow-scrolling:touch!important;height:auto!important;';

    // Fix hero if it exists — height:100vh + overflow:hidden blocks scroll
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.cssText += ';height:auto!important;min-height:100svh!important;overflow:visible!important;';
    }

    // Kill cosmic elements that JS re-shows (overrides CSS display:none)
    const cosmicSelectors = [
        '.solar-system', '.sun', '.planet', '.moon', '.asteroid-belt',
        '.wormhole', '.blackhole-system', '.nebula', '.cosmic-dust',
        '.comet', '.space-particles', '.particle'
    ];
    cosmicSelectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
            el.style.display = 'none';
            el.style.animation = 'none';
        }
    });
}

// ---- NAVBAR SCROLL STYLE ----
function initNavbar() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.background = window.scrollY > 100
                ? 'rgba(0,0,0,0.97)'
                : 'rgba(0,0,0,0.8)';
        }
    }, { passive: true });
}

// ---- ACTIVE NAV LINK ----
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ---- SMOOTH SCROLL (anchor links only) ----
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ---- INTERSECTION OBSERVER (desktop only — mobile causes scroll issues) ----
function initAnimations() {
    if (isMobile()) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.timeline-item, .content-card, .travel-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ---- COUNTER ANIMATION ----
function animateCounter(el, target) {
    const suffix = el.textContent.replace(/[0-9]/g, '').trim();
    let val = 0;
    const step = target / 100;
    const timer = setInterval(() => {
        val = Math.min(val + step, target);
        el.textContent = Math.floor(val) + suffix;
        if (val >= target) clearInterval(timer);
    }, 20);
}

function initCounters() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    let done = false;
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !done) {
            done = true;
            document.querySelectorAll('.stat-number').forEach(el => {
                const num = parseInt(el.textContent.replace(/\D/g, ''));
                if (num) setTimeout(() => animateCounter(el, num), 500);
            });
        }
    });
    obs.observe(hero);
}

// ---- THEME ----
function applyTheme(mood) {
    document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();
    document.body.classList.add('theme-' + mood);
}

// ---- COSMIC SCENE (desktop only) ----
function initCosmicScene() {
    if (isMobile()) return; // Never touch cosmic on mobile

    applyTheme('excited');

    const cosmicScene = document.querySelector('.cosmic-scene');
    if (cosmicScene) {
        cosmicScene.style.display = 'block';
        cosmicScene.style.visibility = 'visible';
        cosmicScene.style.opacity = '1';
        cosmicScene.style.zIndex = '-1';
    }

    ['.solar-system', '.wormhole', '.blackhole-system', '.blackhole-center', '.accretion-disk', '.event-horizon'].forEach(sel => {
        const el = document.querySelector(sel);
        if (el) { el.style.display = 'block'; el.style.visibility = 'visible'; el.style.opacity = '1'; }
    });

    // Mouse parallax
    document.addEventListener('mousemove', (e) => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;
        const bc = document.querySelector('.blackhole-center');
        const gl = document.querySelector('.gravitational-lensing');
        if (bc) bc.style.transform = `translate(${-50 + mx * 2}%, ${-50 + my * 2}%)`;
        if (gl) gl.style.transform = `translate(${-50 + mx}%, ${-50 + my}%)`;
    });

    // Wormhole scroll effect
    window.addEventListener('scroll', () => {
        const pct = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const w = document.querySelector('.wormhole');
        if (w) w.style.transform = `translate(-50%, -50%) scale(${1 + pct * 2})`;
        const ad = document.querySelector('.accretion-disk');
        if (ad) ad.style.animationDuration = `${Math.max(12 - pct * 8, 2)}s`;
    }, { passive: true });
}

// ---- AUDIO SYSTEM ----
const AUDIO = {
    ctx: null, sources: [], playing: false, track: 'deep-space',
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); return this.ctx; },
    stop() { this.sources.forEach(s => { try { s.stop(); } catch(e) {} }); this.sources = []; this.playing = false; this.ui(); },
    play(id) {
        this.stop();
        const ctx = this.init();
        const go = () => {
            const makers = {
                'deep-space': ctx => { const o=ctx.createOscillator(),g=ctx.createGain(); o.frequency.value=60;o.type='sine';g.gain.value=0.3;o.connect(g);g.connect(ctx.destination);o.start();return[o]; },
                'cosmic-winds': ctx => {
                    const buf=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),d=buf.getChannelData(0);
                    for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
                    const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();
                    s.buffer=buf;s.loop=true;f.type='lowpass';f.frequency.value=800;g.gain.value=0.2;
                    s.connect(f);f.connect(g);g.connect(ctx.destination);s.start();return[s];
                },
                'stellar-harmony': ctx => [220,330,440,550].map(fr=>{const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=fr;o.type='sine';g.gain.value=0.08;o.connect(g);g.connect(ctx.destination);o.start();return o;}),
                'nebula-dreams': ctx => { const p1=ctx.createOscillator(),p2=ctx.createOscillator(),f=ctx.createBiquadFilter(),g=ctx.createGain();p1.frequency.value=110;p2.frequency.value=165;p1.type=p2.type='sawtooth';f.type='lowpass';f.frequency.value=400;g.gain.value=0.15;p1.connect(f);p2.connect(f);f.connect(g);g.connect(ctx.destination);p1.start();p2.start();return[p1,p2]; },
                'quantum-pulse': ctx => { const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.value=80;o.type='square';g.gain.value=0.2;o.connect(g);g.connect(ctx.destination);o.start();return[o]; }
            };
            if (makers[id]) { this.sources=makers[id](ctx); this.track=id; this.playing=true; this.ui(); }
        };
        ctx.state==='suspended' ? ctx.resume().then(go) : go();
    },
    ui() {
        const btn = document.getElementById('audioToggle');
        if (!btn) return;
        btn.innerHTML = this.playing ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        btn.style.boxShadow = this.playing ? '0 0 30px rgba(255,140,0,0.8)' : '0 0 20px rgba(255,140,0,0.3)';
    }
};

function initAudio() {
    const btn = document.getElementById('audioToggle');
    if (btn) btn.addEventListener('click', () => AUDIO.playing ? AUDIO.stop() : AUDIO.play(AUDIO.track));
    AUDIO.ui();

    const ptBtn = document.getElementById('playlistToggle');
    const pl = document.getElementById('musicPlaylist');
    if (ptBtn && pl) {
        ptBtn.addEventListener('click', () => {
            const show = pl.style.display !== 'block';
            pl.style.display = show ? 'block' : 'none';
            ptBtn.innerHTML = show ? '<i class="fas fa-times"></i>' : '<i class="fas fa-list"></i>';
        });
    }
    document.querySelectorAll('.track-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.track;
            if (!id) return;
            AUDIO.play(id);
            document.querySelectorAll('.track-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            if (pl) pl.style.display = 'none';
            if (ptBtn) ptBtn.innerHTML = '<i class="fas fa-list"></i>';
        });
    });
}

// ---- BOOT ----
// Run immediately for things that don't need DOM
fixMobileScroll();

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ensureHamburger();
    setActiveNavLink();
    initNavbar();
    initSmoothScroll();
    initAnimations();
    initCounters();
    initCosmicScene();
    initAudio();
});

// Also re-run hamburger on load (in case DOMContentLoaded already fired)
if (document.readyState !== 'loading') {
    ensureHamburger();
    fixMobileScroll();
}
