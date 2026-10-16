/**
 * KING ESPORT - Official Script
 * High-performance interactive UI, Canvas particle field, Audio SFX,
 * dynamic roster filtering for MLBB, Free Fire, and PUBG Mobile,
 * countdown timer, and recruitment modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCanvas();
  initCountdown();
  initRosterFilter();
  initPlayerModal();
  initTryoutModal();
  initStatCounters();
  initAudioSfx();
  initNewsletter();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger-btn');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    const scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        links.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE CYBER CANVAS (Particles & Constellations)
   ========================================================================== */
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);

  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.color = Math.random() > 0.3 ? '#a855f7' : '#c084fc';
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#9333ea';
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = (dx / dist) * force * 3;
          const dirY = (dy / dist) * force * 3;
          this.x -= dirX;
          this.y -= dirY;
        }
      }

      this.draw();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const opacity = 1 - dist / 110;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168, 85, 247, ${opacity * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connect();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. LIVE COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const cdDays = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins = document.getElementById('cd-mins');
  const cdSecs = document.getElementById('cd-secs');

  if (!cdDays) return;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 2);
  targetDate.setHours(targetDate.getHours() + 14);
  targetDate.setMinutes(targetDate.getMinutes() + 35);

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMins.textContent = '00';
      cdSecs.textContent = '00';
      return;
    }

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    cdDays.textContent = String(d).padStart(2, '0');
    cdHours.textContent = String(h).padStart(2, '0');
    cdMins.textContent = String(m).padStart(2, '0');
    cdSecs.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   4. ROSTER FILTERING (MLBB, FF, PUBGM)
   ========================================================================== */
function initRosterFilter() {
  const tabBtns = document.querySelectorAll('.roster-tabs .tab-btn');
  const playerCards = document.querySelectorAll('.roster-grid .player-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      playerCards.forEach(card => {
        const game = card.getAttribute('data-game');
        if (filter === 'all' || game === filter) {
          card.style.display = 'block';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. PLAYER DETAILS MODAL DATA (MLBB, FREE FIRE, PUBG MOBILE)
   ========================================================================== */
const playerData = {
  // --- MOBILE LEGENDS: BANG BANG ROSTER ---
  aphrodite: {
    ign: 'KING // APHRODITE',
    realName: 'Clarissa "Aphrodite" Angela',
    role: 'Midlaner / Mage Specialist',
    game: 'MOBILE LEGENDS',
    stats: { winrate: '84%', kd: '4.82', hs: '124★', tournaments: '32' },
    mainHero: 'Valentina / Yve / Pharsa',
    quote: '"Kontrol rotasi peta, kuasai bush, dan habisi lawan sebelum mereka mendekati Lord."',
    achievements: ['MPL ID Season 12 Champion', 'M-Series Finals MVP', 'First Team Midlaner']
  },
  vortex: {
    ign: 'KING // VORTEX',
    realName: 'Reza "Vortex" Pratama',
    role: 'Jungler / Assassin Core',
    game: 'MOBILE LEGENDS',
    stats: { winrate: '82%', kd: '5.10', hs: '150★', tournaments: '28' },
    mainHero: 'Fanny / Ling / Nolan',
    quote: '"Retribution ada di tangan kami. Lord dan Turtle adalah milik sang Raja."',
    achievements: ['Best Jungler Regular Season', 'Triple Retri God Award', 'M-World Semi-Finalist']
  },
  shadow: {
    ign: 'KING // SHADOW',
    realName: 'Bagas "Shadow" Nur',
    role: 'Roamer / Tank & Initiator',
    game: 'MOBILE LEGENDS',
    stats: { winrate: '81%', kd: '3.10', hs: '130★', tournaments: '25' },
    mainHero: 'Chou / Khufra / Tigreal',
    quote: '"Aku adalah benteng pertahanan sekaligus badai pembuka teamfight."',
    achievements: ['Best Roamer MPL 2025', 'Most Assists in League', 'First Blood King']
  },
  zeus: {
    ign: 'KING // ZEUS',
    realName: 'Fajar "Zeus" Maulana',
    role: 'Gold Laner / Marksman Carry',
    game: 'MOBILE LEGENDS',
    stats: { winrate: '79%', kd: '4.95', hs: '142★', tournaments: '26' },
    mainHero: 'Claude / Bruno / Beatrix',
    quote: '"Late game adalah panggungku. Beri aku ruang 3 detik dan base lawan akan rata."',
    achievements: ['Highest DPM MPL Season 13', 'Maniac & Savage Record Holder']
  },
  titan: {
    ign: 'KING // TITAN',
    realName: 'Gilang "Titan" Saputra',
    role: 'EXP Laner / Fighter & Splitpusher',
    game: 'MOBILE LEGENDS',
    stats: { winrate: '77%', kd: '3.80', hs: '118★', tournaments: '22' },
    mainHero: 'Paquito / Terizla / Arlott',
    quote: '"Lane satu lawan satu adalah ujian mental. Jangan harap bisa memotong wave."',
    achievements: ['Solokill King MPL S12', 'Unbeaten Lane Ratio']
  },

  // --- FREE FIRE ROSTER ---
  valkyrie: {
    ign: 'KING // VALKYRIE',
    realName: 'Sarah "Valkyrie" Octavia',
    role: 'Sniper & Overwatch',
    game: 'FREE FIRE',
    stats: { winrate: '73%', kd: '4.65', hs: '68%', tournaments: '20' },
    mainHero: 'AWM / M82B / AC80 Specialist',
    quote: '"Satu peluru tembus gloo wall, satu kepala jatuh. Takhta tidak menerima yang lemah."',
    achievements: ['FFWS Top Eliminator', 'National Grand Master Cup 2025']
  },
  draco: {
    ign: 'KING // DRACO',
    realName: 'Danu "Draco" Pratama',
    role: 'Rusher 1 / Frontliner',
    game: 'FREE FIRE',
    stats: { winrate: '76%', kd: '5.40', hs: '74%', tournaments: '24' },
    mainHero: 'MP40 / Shotgun M1887',
    quote: '"Gloo wall bukan pelindung bagi musuh yang sudah masuk radar bidikanku."',
    achievements: ['Terminator FFML Season 8', 'Most Kill Points in Single Split']
  },
  inferno: {
    ign: 'KING // INFERNO',
    realName: 'Rendy "Inferno" Putra',
    role: 'Grenadier & Flanker',
    game: 'FREE FIRE',
    stats: { winrate: '71%', kd: '4.20', hs: '55%', tournaments: '19' },
    mainHero: 'Grenade Cooking & Charge Buster',
    quote: '"Waktu lempar granat presisi nol koma sekian detik meratakan squad lawan."',
    achievements: ['Best Grenadier FFWS SEA', 'Clutch 1v4 Grand Finalist']
  },
  specter: {
    ign: 'KING // SPECTER',
    realName: 'Aldi "Specter" Kusuma',
    role: 'Captain & Shotcaller IGL',
    game: 'FREE FIRE',
    stats: { winrate: '75%', kd: '3.90', hs: '58%', tournaments: '26' },
    mainHero: 'Tactical Drone / Alok / Chrono',
    quote: '"Zona terakhir adalah milik mereka yang menghitung setiap langkah rotasi."',
    achievements: ['Master Strategist FFWS 2024', 'Highest Placement Points']
  },

  // --- PUBG MOBILE ROSTER ---
  kaiser: {
    ign: 'KING // KAISER',
    realName: 'Dimas "Kaiser" Wijaya',
    role: 'Terminator & Rusher',
    game: 'PUBG MOBILE',
    stats: { winrate: '68%', kd: '5.20', hs: '42%', tournaments: '22' },
    mainHero: 'M416 + 6x Spray / UMP45',
    quote: '"Zona penutup adalah rumah kami. Siapa pun yang menantang akan tereliminasi."',
    achievements: ['PMSL SEA Terminator Award', 'WWCD Record in Single Matchday']
  },
  cyph3r: {
    ign: 'KING // CYPH3R',
    realName: 'Kevin "Cyph3r" Santoso',
    role: 'IGL & Tactical Commander',
    game: 'PUBG MOBILE',
    stats: { winrate: '74%', kd: '3.60', hs: '36%', tournaments: '30' },
    mainHero: 'DBS / M416 / Smoke Utility',
    quote: '"Rotasi kendaraan tanpa cacat, kuasai kompon tengah dan amankan Chicken Dinner."',
    achievements: ['PMSL Best In-Game Leader', 'PMGC Indonesia Qualifier Champion']
  },
  hawkeye: {
    ign: 'KING // HAWKEYE',
    realName: 'Rian "Hawkeye" Gunawan',
    role: 'Sniper & Long-Range Scout',
    game: 'PUBG MOBILE',
    stats: { winrate: '70%', kd: '4.45', hs: '52%', tournaments: '21' },
    mainHero: 'AWM / Mini14 / SLR',
    quote: '"Jarak 400 meter bukan halangan. Headshot adalah tanda selamat datang dari KING."',
    achievements: ['Longest Snipe Elimination PMSL (512m)', 'Golden Pan Recipient']
  },
  barricade: {
    ign: 'KING // BARRICADE',
    realName: 'Tommy "Barricade" Siregar',
    role: 'Support & Cover Fragger',
    game: 'PUBG MOBILE',
    stats: { winrate: '69%', kd: '3.75', hs: '38%', tournaments: '18' },
    mainHero: 'Groza / AKM / Frag Master',
    quote: '"Tidak ada rekan tim yang tumbang di bawah pengawasanku."',
    achievements: ['Best Support PMNC 2025', 'Most Revives & Clutch Rescues']
  }
};

function initPlayerModal() {
  const modal = document.getElementById('player-modal');
  const closeBtn = document.getElementById('close-player-modal');
  const cards = document.querySelectorAll('.player-card');

  if (!modal) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const playerId = card.getAttribute('data-player');
      const data = playerData[playerId];
      if (!data) return;

      document.getElementById('modal-ign').textContent = data.ign;
      document.getElementById('modal-realname').textContent = data.realName;
      document.getElementById('modal-role').textContent = data.role;
      document.getElementById('modal-game').textContent = data.game;
      document.getElementById('modal-winrate').textContent = data.stats.winrate;
      document.getElementById('modal-kd').textContent = data.stats.kd;
      document.getElementById('modal-hs').textContent = data.stats.hs;
      document.getElementById('modal-tournaments').textContent = data.stats.tournaments;
      document.getElementById('modal-mainhero').textContent = data.mainHero;
      document.getElementById('modal-quote').textContent = data.quote;

      const achList = document.getElementById('modal-achievements');
      achList.innerHTML = '';
      data.achievements.forEach(ach => {
        const li = document.createElement('li');
        li.innerHTML = `<span style="color:#c084fc; margin-right: 8px;">★</span> ${ach}`;
        achList.appendChild(li);
      });

      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

/* ==========================================================================
   6. TRYOUT / RECRUITMENT MODAL
   ========================================================================== */
function initTryoutModal() {
  const modal = document.getElementById('tryout-modal');
  const openBtns = document.querySelectorAll('.open-tryout-btn');
  const closeBtn = document.getElementById('close-tryout-modal');
  const form = document.getElementById('tryout-form');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active');
  });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ign = document.getElementById('tryout-ign').value.trim();
      const game = document.getElementById('tryout-game').value;

      modal.classList.remove('active');
      form.reset();

      showToast(`⚡ Aplikasi tryout untuk [${ign}] di divisi ${game} berhasil dikirim! Staff kepelatihan KING ESPORT akan menghubungi via WhatsApp/Discord.`);
    });
  }
}

/* ==========================================================================
   7. TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
  let toast = document.getElementById('cyber-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cyber-toast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color:#22c55e; font-size:1.2rem;">✔</span> <div>${message}</div>`;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 4500);
}

/* ==========================================================================
   8. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatCounters() {
  const statCards = document.querySelectorAll('.stat-num');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statCards.forEach(card => {
          const target = parseFloat(card.getAttribute('data-target'));
          const suffix = card.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          let count = 0;
          const duration = 1500;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              card.textContent = (isDecimal ? target.toFixed(1) : Math.floor(target)) + suffix;
              clearInterval(timer);
            } else {
              card.textContent = (isDecimal ? count.toFixed(1) : Math.floor(count)) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   9. WEB AUDIO API SYNTHESIZER (Cyber SFX)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = false;

function initAudioSfx() {
  const toggleBtn = document.getElementById('sound-toggle');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        toggleBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        `;
        toggleBtn.style.borderColor = 'var(--purple-bright)';
        toggleBtn.style.color = '#fff';
        playTone(600, 0.08, 'triangle');
        showToast('🔊 Efek Audio Cyber Diaktifkan!');
      } else {
        toggleBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        `;
        toggleBtn.style.borderColor = 'var(--purple-border)';
        toggleBtn.style.color = 'var(--purple-bright)';
      }
    });
  }

  const buttons = document.querySelectorAll('button, .nav-link, .player-card, .btn-cyber-primary, .btn-cyber-outline');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (soundEnabled && audioCtx) {
        playTone(850, 0.03, 'sine');
      }
    });
    btn.addEventListener('click', () => {
      if (soundEnabled && audioCtx) {
        playTone(480, 0.07, 'triangle');
      }
    });
  });
}

function playTone(freq, duration, type = 'sine') {
  try {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // Audio error handling
  }
}

/* ==========================================================================
   10. NEWSLETTER FORM
   ========================================================================== */
function initNewsletter() {
  const nlForm = document.getElementById('newsletter-form');
  if (nlForm) {
    nlForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('nl-email').value.trim();
      if (email) {
        nlForm.reset();
        showToast(`✉ Terima kasih! [${email}] telah terdaftar di KING ESPORT VIP Dispatch.`);
      }
    });
  }
}
