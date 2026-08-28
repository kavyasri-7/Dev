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

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initPeacefulCanvas();
  initScrollReveal();

  const audioBtn = document.getElementById('btn-ambient-sound');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      audio.toggleAmbientMusic(audioBtn);
    });
  }
});
