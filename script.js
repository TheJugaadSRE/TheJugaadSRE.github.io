// ============================================
// SCRIPT.JS - Fixed version
// Key fixes:
// 1. Hamburger wrapped in null check - no more crash
// 2. Mobile: all cosmic JS disabled to fix scroll
// 3. Scroll listeners use passive:true throughout
// ============================================

const isMobile = window.innerWidth <= 768;

// ---- HAMBURGER NAV (null-safe) ----
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Close menu on nav link click
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    });
});

// ---- SMOOTH SCROLL for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- NAVBAR background on scroll ----
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.background = window.scrollY > 100
            ? 'rgba(0,0,0,0.95)'
            : 'rgba(0,0,0,0.8)';
    }
}, { passive: true });

// ---- ACTIVE NAV STATE ----
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
});

// ---- INTERSECTION OBSERVER for timeline/cards ----
// Skip on mobile to prevent scroll interference
if (!isMobile) {
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
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = element.dataset.suffix || '';
    function update() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + suffix;
            requestAnimationFrame(update);
        } else {
            element.textContent = target + suffix;
        }
    }
    update();
}

const heroSection = document.querySelector('.hero');
if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.stat-number').forEach(stat => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    const hasSuffix = text.includes('+') ? '+' : (text.includes('K') ? 'K+' : '');
                    if (number) {
                        stat.textContent = '0';
                        setTimeout(() => {
                            animateCounter(stat, number, 2000);
                            setTimeout(() => {
                                if (text.includes('+')) stat.textContent = number + '+';
                                if (text.includes('K+')) stat.textContent = number + 'K+';
                            }, 2100);
                        }, 500);
                    }
                });
                heroObserver.unobserve(entry.target);
            }
        });
    });
    heroObserver.observe(heroSection);
}

// ---- STAT HOVER (desktop only) ----
if (!isMobile) {
    document.querySelectorAll('.stat').forEach(stat => {
        stat.addEventListener('mouseenter', () => { stat.style.transform = 'translateY(-10px) scale(1.05)'; });
        stat.addEventListener('mouseleave', () => { stat.style.transform = 'translateY(0) scale(1)'; });
    });

    // Profile card hover
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.addEventListener('mouseenter', () => { profileCard.style.transform = 'translateY(-10px) scale(1.02)'; });
        profileCard.addEventListener('mouseleave', () => { profileCard.style.transform = 'translateY(0) scale(1)'; });
    }
}

// ---- THEME (kept minimal) ----
function applyTheme(mood) {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${mood}`);
}

// ---- COSMIC SCENE: desktop only ----
// On mobile, skip ALL cosmic JS — CSS already hides elements,
// but JS was re-showing them which broke scroll
if (!isMobile) {
    document.addEventListener('DOMContentLoaded', () => {
        applyTheme('excited');
        document.body.style.opacity = '1';

        const cosmicScene = document.querySelector('.cosmic-scene');
        if (cosmicScene) {
            cosmicScene.style.display = 'block';
            cosmicScene.style.visibility = 'visible';
            cosmicScene.style.opacity = '1';
            cosmicScene.style.zIndex = '-1';
        }

        // Show cosmic elements on desktop
        ['.solar-system','.wormhole','.blackhole-system','.blackhole-center','.accretion-disk','.event-horizon'].forEach(sel => {
            const el = document.querySelector(sel);
            if (el) { el.style.display = 'block'; el.style.visibility = 'visible'; el.style.opacity = '1'; }
        });
    });

    // Mouse parallax on black hole (desktop only)
    document.addEventListener('mousemove', (e) => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        const blackholeCenter = document.querySelector('.blackhole-center');
        const gravitationalLensing = document.querySelector('.gravitational-lensing');
        if (blackholeCenter) blackholeCenter.style.transform = `translate(${-50 + mouseX * 2}%, ${-50 + mouseY * 2}%)`;
        if (gravitationalLensing) gravitationalLensing.style.transform = `translate(${-50 + mouseX}%, ${-50 + mouseY}%)`;
    });

    // Wormhole scroll effect (desktop only)
    window.addEventListener('scroll', () => {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const wormhole = document.querySelector('.wormhole');
        if (wormhole) {
            wormhole.style.transform = `translate(-50%, -50%) scale(${1 + scrollPercent * 2})`;
        }
        const accretionDisk = document.querySelector('.accretion-disk');
        if (accretionDisk) {
            accretionDisk.style.animationDuration = `${Math.max(12 - scrollPercent * 8, 2)}s`;
        }
    }, { passive: true });

    // Floating elements parallax (desktop only)
    window.addEventListener('scroll', () => {
        document.querySelectorAll('.float-item').forEach(el => {
            const speed = el.dataset.speed || 1;
            el.style.transform = `translateY(${-(window.pageYOffset * speed * 0.1)}px)`;
        });
    }, { passive: true });
}

// ---- MOBILE: ensure body scrolls freely ----
if (isMobile) {
    document.body.style.overflow = 'auto';
    document.body.style.overflowX = 'hidden';
    document.body.style.webkitOverflowScrolling = 'touch';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.overflowX = 'hidden';
}

// ---- COSMIC AUDIO SYSTEM ----
const COSMIC_AUDIO = {
    isPlaying: false,
    audioContext: null,
    currentSources: [],
    currentTrack: 'deep-space',
    initContext() {
        if (!this.audioContext) this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return this.audioContext;
    },
    stopAll() {
        this.currentSources.forEach(s => { try { s.stop(); } catch(e) {} });
        this.currentSources = [];
    },
    play(trackId) {
        this.stopAll();
        const ctx = this.initContext();
        const resume = () => this.startTrack(trackId, ctx);
        ctx.state === 'suspended' ? ctx.resume().then(resume) : resume();
    },
    startTrack(trackId, ctx) {
        const creators = {
            'deep-space': (ctx) => {
                const hum = ctx.createOscillator(); const g = ctx.createGain();
                hum.frequency.value = 60; hum.type = 'sine'; g.gain.value = 0.3;
                hum.connect(g); g.connect(ctx.destination); hum.start(); return [hum];
            },
            'cosmic-winds': (ctx) => {
                const buf = ctx.createBuffer(1, ctx.sampleRate*2, ctx.sampleRate);
                const data = buf.getChannelData(0);
                for (let i=0;i<data.length;i++) data[i]=Math.random()*2-1;
                const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
                const f = ctx.createBiquadFilter(); f.type='lowpass'; f.frequency.value=800;
                const g = ctx.createGain(); g.gain.value=0.2;
                src.connect(f); f.connect(g); g.connect(ctx.destination); src.start(); return [src];
            },
            'stellar-harmony': (ctx) => {
                return [220,330,440,550].map(freq => {
                    const o=ctx.createOscillator(); const g=ctx.createGain();
                    o.frequency.value=freq; o.type='sine'; g.gain.value=0.08;
                    o.connect(g); g.connect(ctx.destination); o.start(); return o;
                });
            },
            'nebula-dreams': (ctx) => {
                const p1=ctx.createOscillator(); const p2=ctx.createOscillator();
                const f=ctx.createBiquadFilter(); const g=ctx.createGain();
                p1.frequency.value=110; p2.frequency.value=165;
                p1.type=p2.type='sawtooth'; f.type='lowpass'; f.frequency.value=400; g.gain.value=0.15;
                p1.connect(f); p2.connect(f); f.connect(g); g.connect(ctx.destination);
                p1.start(); p2.start(); return [p1,p2];
            },
            'quantum-pulse': (ctx) => {
                const o=ctx.createOscillator(); const g=ctx.createGain();
                o.frequency.value=80; o.type='square'; g.gain.value=0.2;
                o.connect(g); g.connect(ctx.destination); o.start(); return [o];
            }
        };
        if (creators[trackId]) {
            this.currentSources = creators[trackId](ctx);
            this.currentTrack = trackId;
            this.isPlaying = true;
            this.updateUI();
        }
    },
    stop() { this.stopAll(); this.isPlaying = false; this.updateUI(); },
    updateUI() {
        const btn = document.getElementById('audioToggle');
        if (!btn) return;
        btn.innerHTML = this.isPlaying ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
        btn.style.boxShadow = this.isPlaying ? '0 0 30px rgba(255,140,0,0.8)' : '0 0 20px rgba(255,140,0,0.3)';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const audioToggle = document.getElementById('audioToggle');
    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            COSMIC_AUDIO.isPlaying ? COSMIC_AUDIO.stop() : COSMIC_AUDIO.play(COSMIC_AUDIO.currentTrack);
        });
        COSMIC_AUDIO.updateUI();
    }
    const playlistToggle = document.getElementById('playlistToggle');
    const musicPlaylist = document.getElementById('musicPlaylist');
    if (playlistToggle && musicPlaylist) {
        playlistToggle.addEventListener('click', () => {
            const visible = musicPlaylist.style.display === 'block';
            musicPlaylist.style.display = visible ? 'none' : 'block';
            playlistToggle.innerHTML = visible ? '<i class="fas fa-list"></i>' : '<i class="fas fa-times"></i>';
        });
    }
    document.querySelectorAll('.track-item').forEach(item => {
        item.addEventListener('click', () => {
            const trackId = item.dataset.track;
            if (trackId) {
                COSMIC_AUDIO.currentTrack = trackId;
                COSMIC_AUDIO.play(trackId);
                document.querySelectorAll('.track-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                if (musicPlaylist) musicPlaylist.style.display = 'none';
                if (playlistToggle) playlistToggle.innerHTML = '<i class="fas fa-list"></i>';
            }
        });
    });
});
