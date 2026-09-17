/* ==========================================================================
   PEACEFUL SURPRISE INTERACTION ENGINE
   ========================================================================== */

// --- Web Audio Synthesizer for Peaceful Ambient Music & Chimes ---
class PeacefulAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.musicTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft Peaceful Harp/Chime
  playSoftChime() {
    this.init();
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0.001, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.12, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 1.3);
    });
  }

  // Soft Bubble Pop on click
  playPop() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // Cute Playful Boing/Squeak sound on dodging
  playBoing() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.22);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  // Toggle Peaceful Lofi Ambient Chord Progression
  toggleAmbientMusic(buttonEl) {
    this.init();
    if (this.isPlaying) {
      this.stopAmbientMusic(buttonEl);
    } else {
      this.startAmbientMusic(buttonEl);
    }
  }

  startAmbientMusic(buttonEl) {
    this.isPlaying = true;
    if (buttonEl) {
      buttonEl.classList.add('playing');
      const label = buttonEl.querySelector('.sound-label');
      if (label) label.textContent = 'Calm Music: Playing 🎶';
    }

    // Peaceful Lofi Ambient chords (C# minor, A major, E major, B major)
    const chords = [
      [277.18, 329.63, 415.30, 554.37], // C#m
      [220.00, 277.18, 329.63, 440.00], // A
      [164.81, 246.94, 329.63, 392.00], // E
      [246.94, 311.13, 370.00, 493.88]  // B
    ];
    let chordIdx = 0;

    const playChord = () => {
      if (!this.isPlaying) return;
      const now = this.ctx.currentTime;
      const notes = chords[chordIdx % chords.length];
      chordIdx++;

      notes.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.9);
      });

      this.musicTimer = setTimeout(playChord, 2200);
    };

    playChord();
  }

  stopAmbientMusic(buttonEl) {
    this.isPlaying = false;
    if (this.musicTimer) clearTimeout(this.musicTimer);
    if (buttonEl) {
      buttonEl.classList.remove('playing');
      const label = buttonEl.querySelector('.sound-label');
      if (label) label.textContent = 'Calm Music: Off';
    }
  }
}

const audio = new PeacefulAudioEngine();

// --- Peaceful Background Canvas (Soft Floating Starlight / Dust) ---
function initPeacefulCanvas() {
  const canvas = document.getElementById('peaceful-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const count = window.innerWidth < 768 ? 25 : 45;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.6,
      opacity: Math.random() * 0.5 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.4 - 0.1,
      fadeSpeed: Math.random() * 0.008 + 0.003
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226, 232, 240, ${p.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#94a3b8';
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

// --- Floating Emoji Reaction Spawner ---
function spawnReaction(emoji, event) {
  audio.playPop();

  const x = event && event.clientX ? event.clientX : window.innerWidth / 2;
  const y = event && event.clientY ? event.clientY : window.innerHeight / 2;

  const el = document.createElement('div');
  el.className = 'floating-reaction';
  el.textContent = emoji;
  el.style.left = `${x - 18 + (Math.random() - 0.5) * 30}px`;
  el.style.top = `${y - 20}px`;

  document.body.appendChild(el);

  setTimeout(() => {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }, 2000);
}

// --- Birthday Wishes & Hugs Reaction Burst ---
function sendHug(event) {
  audio.playSoftChime();
  const emojis = ['🎂', '🎈', '🎉', '✨', '🎁', '🤍', '🫂', '🥳'];
  for (let i = 0; i < 14; i++) {
    setTimeout(() => {
      const chosen = emojis[Math.floor(Math.random() * emojis.length)];
      spawnReaction(chosen, {
        clientX: window.innerWidth / 2 + (Math.random() - 0.5) * Math.min(window.innerWidth * 0.7, 400),
        clientY: window.innerHeight * 0.6 + (Math.random() - 0.5) * 150
      });
    }, i * 100);
  }
}

// --- Smooth Scroll Reveal Observer ---
function initScrollReveal() {
  const rows = document.querySelectorAll('.scroll-reveal');
  if (!('IntersectionObserver' in window)) {
    rows.forEach((r) => r.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  rows.forEach((r) => observer.observe(r));
}

// --- Initial Surprise Modal & Dodging No Button Engine ---
let dodgeCount = 0;
let isAppUnlocked = false;

const funnyNoLabels = [
  "No 🙈",
  "Oops! 😜",
  "No way! 🙅‍♂️",
  "Can't click! 🐱",
  "Try clicking YES! 💖",
  "Nice try! 😂",
  "No is illegal! 🔒",
  "Just click YES! 🚀"
];

// The exact 4 Peach & Goma GIFs in order:
// GIF 1: Frying Pan Chase (assets/images/a2.gif)
// GIF 2: Rolling Up Sleeves "哼~" (assets/images/angry.gif)
// GIF 3: Sassy Side-Eye Cat (assets/images/no_kitty_3.png)
// GIF 4: Mad & Stomping Cat (assets/images/no_kitty_4.png)
const angryGifs = [
  {
    src: 'assets/images/a2.gif',
    badge: '🍳 Frying Pan Chase!',
    message: "just click on Yes",
    emoji: '🍳',
    className: ''
  },
  {
    src: 'assets/images/angry.gif',
    badge: '😤 Rolling Up Sleeves!',
    message: "i am saying just click on Yes😤💢",
    emoji: '😤',
    className: ''
  },
  {
    src: 'assets/images/no_kitty_3.png',
    badge: '😒 The Sassy Side-Eye!',
    message: "😒🐾",
    emoji: '😒',
    className: 'gif-side-eye'
  },
  {
    src: 'assets/images/no_kitty_4.png',
    badge: '😾 Mad & Stomping!',
    message: "you dont have another option😾💢",
    emoji: '😾',
    className: 'gif-angry-stomp'
  }
];

// Preload all GIFs/images into browser memory
[
  'assets/images/surprise_cat.jpg',
  'assets/images/a2.gif',
  'assets/images/angry.gif',
  'assets/images/no_kitty_3.png',
  'assets/images/no_kitty_4.png'
].forEach((src) => {
  const img = new Image();
  img.src = src;
});

function initSurpriseModal() {
  const modal = document.getElementById('surprise-modal');
  if (!modal) return;

  document.body.classList.add('modal-open');

  const btnNo = document.getElementById('btn-surprise-no');
  const btnNoText = document.getElementById('btn-no-text');
  const btnYes = document.getElementById('btn-surprise-yes');
  const alertBox = document.getElementById('no-dodge-alert');
  const dodgeText = document.getElementById('dodge-text');

  if (!btnNo) return;

  let lastDodgeTime = 0;

  function dodgeButton(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Debounce to prevent simultaneous pointerenter + mouseenter from skipping GIFs
    const now = Date.now();
    if (now - lastDodgeTime < 380) {
      return;
    }
    lastDodgeTime = now;

    dodgeCount++;
    audio.playBoing();

    // Select the angry GIF for this attempt strictly one by one:
    // Dodge 1 -> GIF 1 (Frying Pan)
    // Dodge 2 -> GIF 2 (Rolling Sleeves)
    // Dodge 3 -> GIF 3 (Side-Eye)
    // Dodge 4 -> GIF 4 (Mad Stomp)
    const gifIndex = (dodgeCount - 1) % angryGifs.length;
    const gifData = angryGifs[gifIndex];

    // Switch avatar to the angry animated GIF
    const helloWrapper = document.getElementById('hello-kitty-wrapper');
    const angryWrapper = document.getElementById('angry-kitty-wrapper');
    const angryImg = document.getElementById('angry-kitty-gif');
    const angryBadge = document.getElementById('angry-badge');
    const avatarBox = document.getElementById('kitty-avatar-box');

    if (helloWrapper && angryWrapper && angryImg) {
      helloWrapper.classList.add('hidden');
      angryWrapper.classList.remove('hidden');
      angryImg.src = gifData.src;
      angryImg.className = 'angry-kitty-img ' + (gifData.className || '');
      if (angryBadge) angryBadge.textContent = gifData.badge;
    }

    // Shake the avatar box playfully and angrily
    if (avatarBox) {
      avatarBox.classList.remove('angry-shake');
      void avatarBox.offsetWidth;
      avatarBox.classList.add('angry-shake');
    }

    // Show funny alert message matching the GIF
    if (alertBox) {
      alertBox.classList.remove('active');
      void alertBox.offsetWidth; // trigger reflow for animation restart
      alertBox.classList.add('active');
    }

    if (dodgeText) {
      dodgeText.textContent = gifData.message;
    }

    // Change No button text playfully
    const btnNoIcon = document.getElementById('btn-no-icon');
    if (btnNoIcon) {
      btnNoIcon.style.display = 'none';
    }
    if (btnNoText) {
      btnNoText.textContent = funnyNoLabels[Math.min(dodgeCount, funnyNoLabels.length - 1)];
    }

    // Grow Yes button slightly and add extra glow
    if (btnYes) {
      const scaleBonus = 1 + Math.min(dodgeCount * 0.04, 0.28);
      btnYes.style.transform = `scale(${scaleBonus})`;
    }

    // Calculate dynamic safe coordinates for No button
    btnNo.classList.add('dodging');
    const btnRect = btnNo.getBoundingClientRect();
    const btnW = btnRect.width || 100;
    const btnH = btnRect.height || 45;

    const pad = 24;
    const maxW = window.innerWidth - btnW - pad;
    const maxH = window.innerHeight - btnH - pad;

    let targetX = pad + Math.random() * (maxW - pad);
    let targetY = pad + Math.random() * (maxH - pad);

    // Ensure it doesn't land directly on cursor/finger
    if (e && e.clientX && e.clientY) {
      const dist = Math.hypot(targetX - e.clientX, targetY - e.clientY);
      if (dist < 140) {
        targetX = (targetX + window.innerWidth / 2) % (maxW - pad) + pad;
        targetY = (targetY + window.innerHeight / 2) % (maxH - pad) + pad;
      }
    }

    btnNo.style.left = `${Math.max(pad, Math.min(targetX, maxW))}px`;
    btnNo.style.top = `${Math.max(pad, Math.min(targetY, maxH))}px`;

    // Spawn playful dodging reaction emojis matching the angry cat
    const cheekyEmojis = [gifData.emoji, '🍳', '💢', '🐾', '😹', '💨', '😜'];
    const chosenEmoji = cheekyEmojis[Math.floor(Math.random() * cheekyEmojis.length)];
    const touchX = e && e.clientX ? e.clientX : targetX;
    const touchY = e && e.clientY ? e.clientY : targetY;
    spawnReaction(chosenEmoji, { clientX: touchX, clientY: touchY });
  }

  // Pointer events handle both mouse hover/enter and mobile touch without double-firing
  btnNo.addEventListener('pointerenter', dodgeButton);
  btnNo.addEventListener('pointerdown', dodgeButton);

  if (btnYes) {
    btnYes.addEventListener('click', acceptSurprise);
  }
}

function acceptSurprise(event) {
  audio.playSoftChime();
  isAppUnlocked = true;

  const modal = document.getElementById('surprise-modal');
  if (modal) {
    modal.classList.add('hidden');
  }

  // Remove scroll lock
  setTimeout(() => {
    document.body.classList.remove('modal-open');
    if (modal) modal.style.display = 'none';
  }, 650);

  // Big celebration confetti and emoji burst!
  const celebrationEmojis = ['🎂', '🍰', '💖', '💕', '✨', '🎈', '🥳', '🧁', '🤍'];
  for (let i = 0; i < 24; i++) {
    setTimeout(() => {
      const chosen = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
      spawnReaction(chosen, {
        clientX: window.innerWidth * 0.15 + Math.random() * window.innerWidth * 0.7,
        clientY: window.innerHeight * 0.2 + Math.random() * window.innerHeight * 0.6
      });
    }, i * 60);
  }
}

// --- Global Cakes & Hearts Click Blast System ---
function spawnCakeHeartBlast(x, y) {
  audio.playPop();

  // Expanding luminous wave ring
  const ripple = document.createElement('div');
  ripple.className = 'blast-ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  document.body.appendChild(ripple);
  setTimeout(() => {
    if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
  }, 700);

  // Emojis for blast: cakes, hearts, cupcakes, sparkles, balloons
  const blastIcons = ['🎂', '🍰', '🧁', '💖', '💕', '❤️', '✨', '🎈', '🤍', '🥳', '🌸', '🎂', '💖'];
  const particleCount = 8 + Math.floor(Math.random() * 5); // 8-12 particles

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'blast-particle';
    const icon = blastIcons[Math.floor(Math.random() * blastIcons.length)];
    p.textContent = icon;

    // Angle and explosion radius
    const angle = (i / particleCount) * (Math.PI * 2) + (Math.random() - 0.5) * 0.5;
    const distance = 45 + Math.random() * 85;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const rot = `${(Math.random() - 0.5) * 90}deg`;
    const dur = `${0.75 + Math.random() * 0.35}s`;
    const fontSize = `${1.3 + Math.random() * 0.9}rem`;

    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty', `${ty}px`);
    p.style.setProperty('--rot', rot);
    p.style.setProperty('--dur', dur);
    p.style.fontSize = fontSize;
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    document.body.appendChild(p);
    setTimeout(() => {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, 1200);
  }
}

function initGlobalClickBlast() {
  window.addEventListener('pointerdown', (e) => {
    if (!isAppUnlocked) return;

    // Ignore clicks on modal before unlock
    const modal = document.getElementById('surprise-modal');
    if (modal && !modal.classList.contains('hidden')) return;

    spawnCakeHeartBlast(e.clientX, e.clientY);
  });
}

// --- Expose functions globally for inline HTML onclick handlers ---
window.spawnReaction = spawnReaction;
window.sendHug = sendHug;
window.acceptSurprise = acceptSurprise;

// --- Initialization ---
function initApp() {
  initPeacefulCanvas();
  initScrollReveal();
  initSurpriseModal();
  initGlobalClickBlast();

  const audioBtn = document.getElementById('btn-ambient-sound');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      audio.toggleAmbientMusic(audioBtn);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}



