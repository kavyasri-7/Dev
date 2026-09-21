import onekoGif from './assets/images/oneko.gif';

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
  'assets/images/no_kitty_4.png',
  'assets/images/brain search.jpg',
  'assets/images/brain_give.jpg'
].forEach((src) => {
  const img = new Image();
  img.src = src;
});

// Reusable poof cloud particle for dodging buttons
function spawnPoofCloud(x, y) {
  const poof = document.createElement('div');
  poof.className = 'poof-cloud';
  poof.textContent = '💨';
  poof.style.left = `${x}px`;
  poof.style.top = `${y}px`;
  document.body.appendChild(poof);
  setTimeout(() => {
    if (poof && poof.parentNode) poof.parentNode.removeChild(poof);
  }, 550);
}

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
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }

    // Short debounce for rapid duplicate synthetic touch/pointer events
    const now = Date.now();
    if (now - lastDodgeTime < 130) {
      return;
    }
    lastDodgeTime = now;

    dodgeCount++;
    audio.playBoing();

    // Extract exact touch or cursor position
    let clientX = null;
    let clientY = null;
    if (e) {
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else if (typeof e.clientX === 'number' && e.clientX > 0) {
        clientX = e.clientX;
        clientY = e.clientY;
      }
    }

    // Previous button location for poof cloud
    const oldRect = btnNo.getBoundingClientRect();
    const poofX = oldRect.left + (oldRect.width || 100) / 2;
    const poofY = oldRect.top + (oldRect.height || 45) / 2;
    spawnPoofCloud(poofX, poofY);

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
    const btnW = oldRect.width || 120;
    const btnH = oldRect.height || 48;
    const pad = 16;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const minX = pad;
    const maxX = Math.max(pad, winW - btnW - pad);
    const minY = pad + 30;
    const maxY = Math.max(minY, winH - btnH - pad - 20);

    let targetX, targetY;
    if (clientX !== null && clientY !== null) {
      // Teleport to the opposite vertical half of the screen
      if (clientY > winH / 2) {
        targetY = minY + Math.random() * (winH * 0.35);
      } else {
        targetY = Math.max(minY, winH * 0.55 + Math.random() * (maxY - winH * 0.55));
      }

      // Teleport to the opposite horizontal half of the screen
      if (clientX > winW / 2) {
        targetX = minX + Math.random() * (winW * 0.35);
      } else {
        targetX = Math.max(minX, winW * 0.45 + Math.random() * (maxX - winW * 0.45));
      }
    } else {
      targetX = minX + Math.random() * (maxX - minX);
      targetY = minY + Math.random() * (maxY - minY);
    }

    // Clamp coordinates safely within screen view
    targetX = Math.max(minX, Math.min(targetX, maxX));
    targetY = Math.max(minY, Math.min(targetY, maxY));

    // Restart the materialize animation
    btnNo.style.animation = 'none';
    void btnNo.offsetWidth;
    btnNo.style.animation = '';

    btnNo.style.left = `${targetX}px`;
    btnNo.style.top = `${targetY}px`;

    // Spawn playful dodging reaction emojis matching the angry cat
    const cheekyEmojis = [gifData.emoji, '🍳', '💢', '🐾', '😹', '💨', '😜'];
    const chosenEmoji = cheekyEmojis[Math.floor(Math.random() * cheekyEmojis.length)];
    spawnReaction(chosenEmoji, { clientX: poofX, clientY: poofY });
  }

  // Handle all touch and mouse interactions seamlessly on both mobile & desktop
  ['touchstart', 'pointerdown', 'mousedown', 'click'].forEach((evt) => {
    btnNo.addEventListener(evt, (e) => {
      dodgeButton(e);
    }, { passive: false });
  });

  btnNo.addEventListener('pointerenter', dodgeButton);

  if (btnYes) {
    btnYes.addEventListener('click', acceptSurprise);
  }
}

let brainDodgeCount = 0;
let lastBrainDodgeTime = 0;

const lyingAlertMessages = [
  "No! You are lying, you don't have a brain! 😂",
  "Doctor confirmed: 0 braincells detected! Just click NO! 🔍🚫",
  "Stop lying to yourself bro! Just click NO! 🤣",
  "Error 404: Brain not found! Accept reality & click NO! 🧠🙅‍♂️",
  "Even the magnifying glass couldn't find one! Click NO! 🔬🤭",
  "Nice try liar! Click NO! 😜"
];

const funnyBrainYesLabels = [
  "Yes 💖",
  "Oops! 😜",
  "No way! 🙅‍♂️",
  "Can't click! 🧠",
  "Try clicking NO! 🙈",
  "Nice try liar! 😂",
  "Yes is illegal! 🔒",
  "Just click NO! 🚀"
];

function dodgeBrainYesButton(e) {
  if (e) {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
  }

  const now = Date.now();
  if (now - lastBrainDodgeTime < 130) return;
  lastBrainDodgeTime = now;

  brainDodgeCount++;
  audio.playBoing();

  const btnYes = document.getElementById('btn-brain-yes');
  const btnYesText = document.getElementById('btn-brain-yes-text');
  const btnYesIcon = document.getElementById('btn-brain-yes-icon');
  const btnNo = document.getElementById('btn-brain-no');
  const alertBox = document.getElementById('brain-lying-alert');
  const lyingText = document.getElementById('brain-lying-text');

  if (!btnYes) return;

  // Spawn poof cloud at previous position
  const oldRect = btnYes.getBoundingClientRect();
  const poofX = oldRect.left + (oldRect.width || 120) / 2;
  const poofY = oldRect.top + (oldRect.height || 50) / 2;
  spawnPoofCloud(poofX, poofY);

  // Show funny lying alert message
  if (alertBox && lyingText) {
    alertBox.classList.remove('active');
    void alertBox.offsetWidth;
    alertBox.classList.add('active');
    const msgIdx = (brainDodgeCount - 1) % lyingAlertMessages.length;
    lyingText.textContent = lyingAlertMessages[msgIdx];
  }

  // Update button icon & text playfully
  if (btnYesIcon) {
    btnYesIcon.style.display = 'none';
  }
  if (btnYesText) {
    const lblIdx = Math.min(brainDodgeCount, funnyBrainYesLabels.length - 1);
    btnYesText.textContent = funnyBrainYesLabels[lblIdx];
  }

  // Make the No button grow slightly and glow
  if (btnNo) {
    const scaleBonus = 1 + Math.min(brainDodgeCount * 0.05, 0.32);
    btnNo.style.transform = `scale(${scaleBonus})`;
    btnNo.classList.add('highlighted');
  }

  // Calculate random safe coordinates across viewport
  btnYes.classList.add('dodging');
  const btnW = oldRect.width || 120;
  const btnH = oldRect.height || 50;
  const pad = 16;
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const minX = pad;
  const maxX = Math.max(pad, winW - btnW - pad);
  const minY = pad + 30;
  const maxY = Math.max(minY, winH - btnH - pad - 20);

  let targetX, targetY;
  let clientX = null;
  let clientY = null;
  if (e) {
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (typeof e.clientX === 'number' && e.clientX > 0) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
  }

  if (clientX !== null && clientY !== null) {
    if (clientY > winH / 2) {
      targetY = minY + Math.random() * (winH * 0.35);
    } else {
      targetY = Math.max(minY, winH * 0.55 + Math.random() * (maxY - winH * 0.55));
    }
    if (clientX > winW / 2) {
      targetX = minX + Math.random() * (winW * 0.35);
    } else {
      targetX = Math.max(minX, winW * 0.45 + Math.random() * (maxX - winW * 0.45));
    }
  } else {
    targetX = minX + Math.random() * (maxX - minX);
    targetY = minY + Math.random() * (maxY - minY);
  }

  targetX = Math.max(minX, Math.min(targetX, maxX));
  targetY = Math.max(minY, Math.min(targetY, maxY));

  btnYes.style.animation = 'none';
  void btnYes.offsetWidth;
  btnYes.style.animation = '';

  btnYes.style.left = `${targetX}px`;
  btnYes.style.top = `${targetY}px`;

  // Spawn reaction emoji
  const lyingEmojis = ['🤥', '🔍', '🧠', '❌', '🤣', '💨', '😜', '🚫'];
  const chosen = lyingEmojis[Math.floor(Math.random() * lyingEmojis.length)];
  spawnReaction(chosen, { clientX: poofX, clientY: poofY });
}

function initBrainCheckInteraction() {
  const btnYes = document.getElementById('btn-brain-yes');
  if (!btnYes || btnYes.dataset.bound) return;
  btnYes.dataset.bound = 'true';

  ['touchstart', 'pointerdown', 'mousedown', 'click'].forEach((evt) => {
    btnYes.addEventListener(evt, (e) => {
      dodgeBrainYesButton(e);
    }, { passive: false });
  });

  btnYes.addEventListener('pointerenter', dodgeBrainYesButton);
}

function confirmNoBrain(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Reset any dodging Yes button
  const btnYes = document.getElementById('btn-brain-yes');
  if (btnYes) {
    btnYes.classList.remove('dodging');
    btnYes.style.position = '';
    btnYes.style.left = '';
    btnYes.style.top = '';
  }

  transitionToBrainPunchline();
}

function acceptSurprise(event) {
  if (event) {
    event.preventDefault();
  }
  audio.playPop();

  const kittyView = document.getElementById('surprise-view-kitty');
  const brainView = document.getElementById('surprise-view-brain');
  const modalBox = document.getElementById('surprise-modal-card');
  const stage1 = document.getElementById('brain-stage-1');
  const stage2 = document.getElementById('brain-stage-2');

  if (!kittyView || !brainView) {
    completeSurpriseAndScroll();
    return;
  }

  // Switch to brain mode
  kittyView.classList.add('hidden');
  brainView.classList.remove('hidden');
  if (modalBox) modalBox.classList.add('brain-mode');

  // Stage 1: Setup Meme (Doctor checking for brain) & Question
  if (stage1) stage1.classList.remove('hidden');
  if (stage2) stage2.classList.add('hidden');

  // Reset brain dodge state
  brainDodgeCount = 0;
  const btnBrainYes = document.getElementById('btn-brain-yes');
  const btnBrainYesText = document.getElementById('btn-brain-yes-text');
  const btnBrainNo = document.getElementById('btn-brain-no');
  const alertBox = document.getElementById('brain-lying-alert');

  if (btnBrainYes) {
    btnBrainYes.classList.remove('dodging');
    btnBrainYes.style.position = '';
    btnBrainYes.style.left = '';
    btnBrainYes.style.top = '';
  }
  if (btnBrainYesText) {
    btnBrainYesText.textContent = 'Yes';
  }
  if (btnBrainNo) {
    btnBrainNo.classList.remove('highlighted');
  }
  if (alertBox) {
    alertBox.classList.remove('active');
  }

  // Initialize dodge events on Yes button
  initBrainCheckInteraction();

  // CTA Accept Brain button on stage 2
  const btnAccept = document.getElementById('btn-accept-brain');
  if (btnAccept) {
    btnAccept.onclick = (e) => {
      e.stopPropagation();
      completeSurpriseAndScroll();
    };
  }
}

function transitionToBrainPunchline() {
  audio.playBoing();

  const stage1 = document.getElementById('brain-stage-1');
  const stage2 = document.getElementById('brain-stage-2');

  if (stage1) stage1.classList.add('hidden');
  if (stage2) {
    stage2.classList.remove('hidden');
    // Spawn funny punchline emojis
    ['🧠', '🤣', '🎁', '✨', '🧠'].forEach((em, i) => {
      setTimeout(() => {
        spawnReaction(em, {
          clientX: window.innerWidth * 0.35 + Math.random() * window.innerWidth * 0.3,
          clientY: window.innerHeight * 0.35 + Math.random() * window.innerHeight * 0.3
        });
      }, i * 90);
    });
  }
}

function completeSurpriseAndScroll() {
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

    // Smoothly scroll down to the memory gallery or hero
    const gallery = document.querySelector('.gallery-container') || document.querySelector('.surprise-hero');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 650);

  // Big celebration confetti and emoji burst!
  const celebrationEmojis = ['🎂', '🧠', '💖', '💕', '✨', '🎈', '🥳', '🧁', '🤣'];
  for (let i = 0; i < 28; i++) {
    setTimeout(() => {
      const chosen = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
      spawnReaction(chosen, {
        clientX: window.innerWidth * 0.15 + Math.random() * window.innerWidth * 0.7,
        clientY: window.innerHeight * 0.2 + Math.random() * window.innerHeight * 0.6
      });
    }, i * 55);
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
window.confirmNoBrain = confirmNoBrain;
window.dodgeBrainYesButton = dodgeBrainYesButton;
window.transitionToBrainPunchline = transitionToBrainPunchline;
window.completeSurpriseAndScroll = completeSurpriseAndScroll;

// --- Oneko: Interactive Cursor-Chasing Cat ---
function initOnekoCat() {
  if (document.getElementById("oneko")) return;

  const nekoEl = document.createElement("div");
  nekoEl.id = "oneko";
  nekoEl.setAttribute("aria-hidden", "true");

  let nekoPosX = 48;
  let nekoPosY = 48;
  let mousePosX = window.innerWidth / 2;
  let mousePosY = window.innerHeight / 2;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  // Gentle, playful cat speed as requested
  const nekoSpeed = 8;

  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  nekoEl.style.width = "32px";
  nekoEl.style.height = "32px";
  nekoEl.style.position = "fixed";
  nekoEl.style.pointerEvents = "none";
  nekoEl.style.imageRendering = "pixelated";
  nekoEl.style.left = `${nekoPosX - 16}px`;
  nekoEl.style.top = `${nekoPosY - 16}px`;
  nekoEl.style.zIndex = "999990";
  nekoEl.style.backgroundImage = `url(${onekoGif})`;

  document.body.appendChild(nekoEl);

  function updateCursorPos(x, y) {
    mousePosX = x;
    mousePosY = y;
  }

  // Follow smoothly wherever user moves, clicks, or touches on screen
  window.addEventListener("mousemove", (e) => updateCursorPos(e.clientX, e.clientY));
  window.addEventListener("pointerdown", (e) => updateCursorPos(e.clientX, e.clientY));
  window.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length > 0) {
      updateCursorPos(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches.length > 0) {
      updateCursorPos(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  function setSprite(name, frame) {
    const set = spriteSets[name];
    if (!set || set.length === 0) return;
    const sprite = set[frame % set.length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // After sitting for ~8 frames (~0.8s), cat immediately scratches itself!
    if (idleAnimation === null) {
      if (idleTime > 8 && idleTime < 12) {
        idleAnimation = "scratchSelf";
        idleAnimationFrame = 0;
      } else if (idleTime > 40 && idleTime < 45) {
        // After sitting for a bit more, cat yawns and goes to sleep
        idleAnimation = "sleeping";
        idleAnimationFrame = 0;
      } else if (idleTime > 90 && Math.floor(Math.random() * 80) === 0) {
        // Occasionally scratch again while idle
        idleAnimation = "scratchSelf";
        idleAnimationFrame = 0;
      }
    }

    switch (idleAnimation) {
      case "scratchSelf":
        setSprite("scratchSelf", idleAnimationFrame);
        if (idleAnimationFrame > 20) {
          resetIdleAnimation();
        }
        break;
      case "sleeping":
        if (idleAnimationFrame < 10) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 12) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    // When cat arrives close to cursor, stop and sit there acting like a cat
    if (distance < nekoSpeed || distance < 24) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    // Alert sprite before starting to run
    if (idleTime > 1) {
      setSprite("alert", 0);
      idleTime = Math.min(idleTime, 6);
      idleTime -= 1;
      return;
    }

    let direction = "";
    direction += diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";

    setSprite(direction || "idle", frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  let lastTimestamp = 0;
  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) return;
    if (timestamp - lastTimestamp > 100) {
      lastTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  window.requestAnimationFrame(onAnimationFrame);
}

// --- Initialization ---
function initApp() {
  initPeacefulCanvas();
  initScrollReveal();
  initSurpriseModal();
  initBrainCheckInteraction();
  initGlobalClickBlast();
  initOnekoCat();

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



