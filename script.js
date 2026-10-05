/* ====================================================================
   FIVE NIGHTS AT FREDDY'S - BIRTHDAY SURPRISE ENGINE
   Audio Engine, Confetti System, Countdown Flow & Plushie Modal
   ==================================================================== */

// --- CONFIGURATION & PLUSHIE MESSAGES (FÁCIL DE EDITAR AQUÍ) ---
const PLUSHIE_DATA = {
  freddy: {
    name: "Freddy Fazbear",
    role: "Líder de la Banda & Anfitrión",
    tag: "★ FAZBEAR VIP BIRTHDAY ★",
    avatar: "assets/images/freddy.jpg",
    themeClass: "freddy",
    // EDITABLE: Mensaje predeterminado de Freddy
    message: `¡Hola, cumpleañera estrella! 🎩✨\n\nEn nombre de toda la pizzería y de la banda de Freddy Fazbear, ¡te deseamos un cumpleaños increíble y lleno de magia!\n\nGracias por ser una persona tan especial, divertida y genial. Hoy el escenario principal brilla únicamente para ti. ¡Que todos tus sueños y deseos se hagan realidad en este nuevo año de vida! 🍕🎂🎉`,
    giftTitle: "🎤 Micrófono Dorado de Freddy & Pase VIP",
    giftSecret: "✨ ¡Desbloqueaste el Pase Dorado de Fazbear! Tienes acceso ilimitado a pizza infinita, sonrisas y momentos inolvidables. ¡Eres la reina del show! 👑",
    specialActionLabel: "🎶 Tocar Marcha de Freddy"
  },
  bonnie: {
    name: "Bonnie the Bunny",
    role: "Guitarrista Estrella de Rock",
    tag: "★ ROCKSTAR BIRTHDAY SOLO ★",
    avatar: "assets/images/bonnie.jpg",
    themeClass: "bonnie",
    // EDITABLE: Mensaje predeterminado de Bonnie
    message: `¡Hey, cumpleañera rockera! 🎸💜\n\n¡Espero que estés lista para rockear al máximo en tu día! Bonnie preparó los mejores acordes y melodías para celebrar tu vida.\n\nQue este año esté lleno de buena música, aventuras alegres y personas que te hagan sonreír cada día. ¡Nunca dejes de brillar como la estrella que eres! 🐰⚡🎵`,
    giftTitle: "🎸 Púa de Guitarra Cósmica & Solo Exclusivo",
    giftSecret: "🎶 ¡Solo de guitarra legendario activado! Bonnie te dedica un concierto privado con energía al 100%. ¡A rockear siempre! 🤘✨",
    specialActionLabel: "🎸 Solo de Guitarra Rock"
  },
  foxy: {
    name: "Foxy the Pirate Fox",
    role: "Corsario de Pirate Cove",
    tag: "★ PIRATE COVE SECRET TREASURE ★",
    avatar: "assets/images/foxy.jpg",
    themeClass: "foxy",
    // EDITABLE: Mensaje predeterminado de Foxy
    message: `¡Ahoy, capitana de la fiesta! 🏴‍☠️❤️\n\nFoxy salió corriendo a toda velocidad desde Pirate Cove para ser el primero en traerte su cofre del tesoro.\n\nEn este cumpleaños, te deseo travesías llenas de alegría, salud, éxitos y momentos que atesores para siempre. ¡Eres la persona más valiente y genial de los 7 mares! 🦊⚔️💎`,
    giftTitle: "🏴‍☠️ Cofre del Tesoro de Pirate Cove",
    giftSecret: "💎 ¡Abriste el cofre! Contiene: 1000 monedas de felicidad, amuletos de buena suerte y un abrazo esponjoso de Foxy. ¡Felicidades, capitana! ⚓🎁",
    specialActionLabel: "⚓ Grito Pirata y Campanada"
  }
};

// Cargar mensajes guardados en localStorage si existen
try {
  const savedMessages = localStorage.getItem('fnaf_plush_messages');
  if (savedMessages) {
    const parsed = JSON.parse(savedMessages);
    for (const key in parsed) {
      if (PLUSHIE_DATA[key]) {
        PLUSHIE_DATA[key].message = parsed[key];
      }
    }
  }
} catch (e) {
  console.log('LocalStorage not available');
}

// ====================================================================
// WEB AUDIO SYNTHESIZER & SOUND EFFECTS (Zero External Dependency)
// ====================================================================
class FNAFAudioEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Beep para contador
  playCountdownTick(freq = 440, duration = 0.15) {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Clásico sonido de la nariz de Freddy (Honk!)
  playHonkNose() {
    this.init();
    const t = this.ctx.currentTime;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, t); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, t + 0.12);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, t); // A4
    osc2.frequency.exponentialRampToValueAtTime(659.25, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.22);
    osc2.stop(t + 0.22);
  }

  // Sonido de estática / glitch
  playStaticGlitch(duration = 0.25) {
    this.init();
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
  }

  // Pop para velas y confeti
  playPop() {
    this.init();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Melodía de la caja de música de Freddy (Toreador March fragmento)
  playFreddyMusicBox() {
    this.init();
    const notes = [
      { f: 523.25, d: 0.25 }, // C5
      { f: 493.88, d: 0.25 }, // B4
      { f: 440.00, d: 0.25 }, // A4
      { f: 392.00, d: 0.50 }, // G4
      { f: 440.00, d: 0.25 }, // A4
      { f: 493.88, d: 0.25 }, // B4
      { f: 523.25, d: 0.60 }  // C5
    ];

    let time = this.ctx.currentTime + 0.05;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(n.f, time);

      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + n.d);
      time += n.d * 0.9;
    });
  }

  // Solo de guitarra para Bonnie
  playBonnieSolo() {
    this.init();
    const chords = [330, 392, 493, 587, 659, 784];
    chords.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
      }, idx * 100);
    });
  }

  // Fanfarria pirata de Foxy
  playFoxyJingle() {
    this.init();
    const tones = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    tones.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
      }, idx * 80);
    });
  }

  // Campanada y alegría 6:00 AM
  play6AMChime() {
    this.init();
    const t = this.ctx.currentTime;
    // Dos campanas armónicas de reloj
    [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + (i * 0.25));

      gain.gain.setValueAtTime(0.3, t + (i * 0.25));
      gain.gain.exponentialRampToValueAtTime(0.001, t + (i * 0.25) + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + (i * 0.25));
      osc.stop(t + (i * 0.25) + 0.8);
    });
  }
}

const sfx = new FNAFAudioEngine();


// ====================================================================
// CANVAS CONFETTI & PARTICLES ENGINE
// ====================================================================
class ConfettiEngine {
  constructor() {
    this.canvas = document.getElementById('confettiCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.colors = ['#ffb703', '#fb8500', '#9d4edd', '#e63946', '#00f0ff', '#ff007f', '#00ff66', '#ffffff'];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 80) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 10 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 15,
        gravity: 0.25,
        opacity: 1,
        life: 1,
        decay: Math.random() * 0.01 + 0.008,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;
      p.opacity = Math.max(0, p.life);

      if (p.life <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

let confetti;


// ====================================================================
// CRT STATIC NOISE BACKGROUND
// ====================================================================
function initNoiseCanvas() {
  const canvas = document.getElementById('noiseCanvas');
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = Math.floor(window.innerWidth / 4);
    canvas.height = Math.floor(window.innerHeight / 4);
  }
  resize();
  window.addEventListener('resize', resize);

  function renderNoise() {
    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const buffer = new Uint32Array(imgData.data.buffer);
    const len = buffer.length;

    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.05) {
        buffer[i] = 0x15ffffff; // Low opacity white static
      }
    }

    ctx.putImageData(imgData, 0, 0);
    setTimeout(() => requestAnimationFrame(renderNoise), 60);
  }
  renderNoise();
}


// ====================================================================
// MAIN APPLICATION LOGIC & STATE
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
  confetti = new ConfettiEngine();
  initNoiseCanvas();

  // Screens
  const introScreen = document.getElementById('intro-screen');
  const countdownScreen = document.getElementById('countdown-screen');
  const surpriseScreen = document.getElementById('surprise-screen');

  // Interactive Elements
  const btnStart = document.getElementById('btnStartExperience');
  const countdownNumber = document.getElementById('countdownNumber');
  const countdownLabel = document.getElementById('countdownLabel');

  // Background Music Element
  const bgMusic = document.getElementById('bgMusic');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const volumeSlider = document.getElementById('volumeSlider');
  const btnLoopToggle = document.getElementById('btnLoopToggle');
  const musicPlayerBar = document.getElementById('musicPlayerBar');

  // Loop settings: 'full' = entire song | 'chorus' = loop 0:15 - 1:15
  let loopMode = 'full'; 

  // Modal Elements
  const plushieModal = document.getElementById('plushieModal');
  const modalCard = document.getElementById('modalCard');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalAvatarImg = document.getElementById('modalAvatarImg');
  const modalCharTag = document.getElementById('modalCharTag');
  const modalCharName = document.getElementById('modalCharName');
  const modalCharSubtitle = document.getElementById('modalCharSubtitle');
  const modalDedicationText = document.getElementById('modalDedicationText');
  const modalGiftTitle = document.getElementById('modalGiftTitle');
  const modalGiftStatus = document.getElementById('modalGiftStatus');
  const btnOpenGift = document.getElementById('btnOpenGift');
  const btnPlaySpecialSound = document.getElementById('btnPlaySpecialSound');
  const btnEditMessage = document.getElementById('btnEditMessage');

  // Customizer Modal Elements
  const customizerModal = document.getElementById('customizerModal');
  const customizerTitle = document.getElementById('customizerTitle');
  const customizerText = document.getElementById('customizerText');
  const btnCancelCustomizer = document.getElementById('btnCancelCustomizer');
  const btnSaveCustomizer = document.getElementById('btnSaveCustomizer');

  let currentSelectedPlush = 'freddy';
  let isGiftOpened = false;

  // ==================================================================
  // 1. FLOW: INTRO -> 3s COUNTDOWN -> SURPRISE
  // ==================================================================
  btnStart.addEventListener('click', () => {
    sfx.init();
    sfx.playStaticGlitch(0.3);

    // Iniciar música de fondo
    bgMusic.volume = parseFloat(volumeSlider.value);
    bgMusic.play().then(() => {
      musicPlayerBar.classList.remove('player-paused');
      musicPlayerBar.classList.add('player-playing');
      playPauseIcon.textContent = '⏸️';
    }).catch(err => {
      console.log("Audio play blocked by browser:", err);
    });

    // Transición a pantalla de cuenta regresiva
    introScreen.classList.remove('active');
    countdownScreen.classList.add('active');

    // Iniciar Cuenta Regresiva de 3 Segundos
    startCountdown();
  });

  function startCountdown() {
    let count = 3;
    countdownNumber.textContent = count;
    sfx.playCountdownTick(520, 0.2);

    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        countdownNumber.textContent = count;
        countdownNumber.style.animation = 'none';
        void countdownNumber.offsetWidth; // trigger reflow
        countdownNumber.style.animation = 'countdownPulse 1s ease-in-out infinite';
        
        sfx.playCountdownTick(520 + (3 - count) * 120, 0.2);
        
        if (count === 1) {
          countdownLabel.textContent = "¡Casi listo! Prepárate...";
        }
      } else if (count === 0) {
        countdownNumber.textContent = "¡YA!";
        countdownLabel.textContent = "🎉 ¡FELIZ CUMPLEAÑOS! 🎉";
        sfx.playCountdownTick(950, 0.4);
        confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 100);
      } else {
        clearInterval(timer);
        // Revelar pantalla de sorpresa principal
        sfx.playStaticGlitch(0.2);
        countdownScreen.classList.remove('active');
        surpriseScreen.classList.add('active');
        
        // Gran explosión de confeti de celebración
        confetti.burst(window.innerWidth * 0.3, window.innerHeight * 0.4, 70);
        confetti.burst(window.innerWidth * 0.7, window.innerHeight * 0.4, 70);
        confetti.burst(window.innerWidth * 0.5, window.innerHeight * 0.5, 90);
      }
    }, 1000);
  }

  // ==================================================================
  // 2. AUDIO PLAYER CONTROLS (THE LIVING TOMBSTONE)
  // ==================================================================
  btnPlayPause.addEventListener('click', () => {
    sfx.init();
    if (bgMusic.paused) {
      bgMusic.play();
      musicPlayerBar.classList.remove('player-paused');
      musicPlayerBar.classList.add('player-playing');
      playPauseIcon.textContent = '⏸️';
    } else {
      bgMusic.pause();
      musicPlayerBar.classList.add('player-paused');
      musicPlayerBar.classList.remove('player-playing');
      playPauseIcon.textContent = '▶️';
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = parseFloat(e.target.value);
  });

  // Loop Mode Toggle (Recortar / Repetir Coro)
  btnLoopToggle.addEventListener('click', () => {
    sfx.playPop();
    if (loopMode === 'full') {
      loopMode = 'chorus';
      btnLoopToggle.textContent = '🔁 Modo: Bucle Coro (0:20 - 1:15)';
      btnLoopToggle.style.background = 'var(--color-neon-pink)';
      btnLoopToggle.style.color = '#fff';
      bgMusic.currentTime = 20; // Saltar al inicio del beat/coro
    } else {
      loopMode = 'full';
      btnLoopToggle.textContent = '🔁 Modo: Completo';
      btnLoopToggle.style.background = 'rgba(255, 183, 3, 0.15)';
      btnLoopToggle.style.color = 'var(--color-freddy-gold)';
    }
  });

  // Manejar el bucle personalizado si está en modo coro
  bgMusic.addEventListener('timeupdate', () => {
    if (loopMode === 'chorus') {
      // Repetir entre 20s y 75s
      if (bgMusic.currentTime >= 75) {
        bgMusic.currentTime = 20;
      }
    }
  });

  // ==================================================================
  // 3. INTERACTIVE BIRTHDAY CAKE & VELAS
  // ==================================================================
  const candles = document.querySelectorAll('.interactive-candle');
  let blownCount = 0;

  candles.forEach(candle => {
    candle.addEventListener('click', (e) => {
      if (!candle.classList.contains('blown-out')) {
        candle.classList.add('blown-out');
        sfx.playPop();
        
        const rect = candle.getBoundingClientRect();
        confetti.burst(rect.left + rect.width / 2, rect.top, 25);

        blownCount++;
        if (blownCount === candles.length) {
          document.getElementById('candleInstruction').textContent = "✨ ¡Deseo concedido! ¡Que se cumplan todos tus sueños!";
          document.getElementById('candleInstruction').style.color = "var(--color-neon-green)";
          
          setTimeout(() => {
            sfx.play6AMChime();
            confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 120);
          }, 400);
        }
      }
    });
  });

  // ==================================================================
  // 4. EASTER EGGS BUTTONS
  // ==================================================================
  // Honk Freddy's Nose
  document.getElementById('btnHonkNose').addEventListener('click', (e) => {
    sfx.playHonkNose();
    confetti.burst(e.clientX, e.clientY, 20);
  });

  // 6:00 AM Victoria Chime
  document.getElementById('btn6AM').addEventListener('click', () => {
    sfx.play6AMChime();
    confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
    alertCelebration("⏰ ¡6:00 AM! Sobreviviste un año más de pura diversión");
  });

  // Luces Pizzeria Toggle
  document.getElementById('btnToggleLights').addEventListener('click', () => {
    sfx.playPop();
    document.body.classList.toggle('light-flicker');
    setTimeout(() => {
      document.body.classList.remove('light-flicker');
    }, 2000);
  });

  // Más Confeti
  document.getElementById('btnMoreConfetti').addEventListener('click', (e) => {
    sfx.playPop();
    confetti.burst(e.clientX, e.clientY, 60);
    confetti.burst(window.innerWidth * Math.random(), window.innerHeight * 0.3, 40);
  });

  function alertCelebration(msg) {
    const notif = document.createElement('div');
    notif.textContent = msg;
    notif.style.position = 'fixed';
    notif.style.top = '30px';
    notif.style.left = '50%';
    notif.style.transform = 'translateX(-50%)';
    notif.style.background = 'linear-gradient(135deg, #ffb703, #ff007f)';
    notif.style.color = '#fff';
    notif.style.padding = '12px 28px';
    notif.style.borderRadius = '30px';
    notif.style.fontFamily = 'var(--font-fnaf)';
    notif.style.fontWeight = '800';
    notif.style.fontSize = '0.95rem';
    notif.style.zIndex = '9999';
    notif.style.boxShadow = '0 5px 25px rgba(0,0,0,0.8)';
    notif.style.transition = 'all 0.4s ease';
    document.body.appendChild(notif);

    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transform = 'translateX(-50%) translateY(-20px)';
      setTimeout(() => notif.remove(), 400);
    }, 2800);
  }


  // ==================================================================
  // 5. PLUSHIE CARDS & MODAL DETAILED EXPERIENCE
  // ==================================================================
  const plushCards = document.querySelectorAll('.plushie-card');

  plushCards.forEach(card => {
    card.addEventListener('click', () => {
      const plushKey = card.getAttribute('data-plush');
      openPlushieModal(plushKey);
    });
  });

  function openPlushieModal(key) {
    currentSelectedPlush = key;
    isGiftOpened = false;
    const data = PLUSHIE_DATA[key];

    // Resetear clases y aplicar tema
    modalCard.className = `plushie-modal-card ${data.themeClass}`;
    modalAvatarImg.src = data.avatar;
    modalCharTag.textContent = data.tag;
    modalCharName.textContent = data.name;
    modalCharSubtitle.textContent = data.role;
    modalDedicationText.textContent = data.message;
    modalGiftTitle.textContent = `🎁 ${data.giftTitle}`;
    modalGiftStatus.textContent = "¡Haz clic en la caja de regalo para abrir tu sorpresa!";
    btnOpenGift.textContent = "🎁";
    btnPlaySpecialSound.textContent = data.specialActionLabel;

    sfx.playPop();
    plushieModal.classList.add('active');
    plushieModal.setAttribute('aria-hidden', 'false');

    // Confeti de bienvenida al personaje
    confetti.burst(window.innerWidth / 2, window.innerHeight * 0.3, 40);
  }

  // Cerrar Modal
  function closePlushieModal() {
    sfx.playPop();
    plushieModal.classList.remove('active');
    plushieModal.setAttribute('aria-hidden', 'true');
  }

  modalCloseBtn.addEventListener('click', closePlushieModal);
  plushieModal.addEventListener('click', (e) => {
    if (e.target === plushieModal) {
      closePlushieModal();
    }
  });

  // Cerrar modales con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (customizerModal.classList.contains('active')) {
        customizerModal.classList.remove('active');
      } else if (plushieModal.classList.contains('active')) {
        closePlushieModal();
      }
    }
  });

  // Abrir Regalo Interactivo del Peluche
  btnOpenGift.addEventListener('click', (e) => {
    const data = PLUSHIE_DATA[currentSelectedPlush];
    if (!isGiftOpened) {
      isGiftOpened = true;
      btnOpenGift.textContent = "🎉";
      modalGiftStatus.innerHTML = `<strong>${data.giftSecret}</strong>`;
      modalGiftStatus.style.color = "#00ff66";
      
      sfx.play6AMChime();
      const rect = btnOpenGift.getBoundingClientRect();
      confetti.burst(rect.left + rect.width / 2, rect.top, 80);
    } else {
      // Si ya está abierto, hacer más confeti y sonido
      sfx.playHonkNose();
      confetti.burst(e.clientX, e.clientY, 40);
    }
  });

  // Botón de Acción Especial del Peluche (Música/Sonido único)
  btnPlaySpecialSound.addEventListener('click', (e) => {
    if (currentSelectedPlush === 'freddy') {
      sfx.playFreddyMusicBox();
    } else if (currentSelectedPlush === 'bonnie') {
      sfx.playBonnieSolo();
    } else if (currentSelectedPlush === 'foxy') {
      sfx.playFoxyJingle();
    }
    confetti.burst(e.clientX, e.clientY, 35);
  });


  // ==================================================================
  // 6. IN-BROWSER MESSAGE EDITOR (Para que el usuario personalice)
  // ==================================================================
  btnEditMessage.addEventListener('click', () => {
    sfx.playPop();
    const data = PLUSHIE_DATA[currentSelectedPlush];
    customizerTitle.textContent = `✏️ Personalizar Mensaje de ${data.name}`;
    customizerText.value = data.message;
    customizerModal.classList.add('active');
    customizerText.focus();
  });

  btnCancelCustomizer.addEventListener('click', () => {
    sfx.playPop();
    customizerModal.classList.remove('active');
  });

  btnSaveCustomizer.addEventListener('click', () => {
    sfx.playPop();
    const newText = customizerText.value.trim();
    if (newText) {
      PLUSHIE_DATA[currentSelectedPlush].message = newText;
      modalDedicationText.textContent = newText;

      // Guardar en localStorage
      try {
        const toSave = {
          freddy: PLUSHIE_DATA.freddy.message,
          bonnie: PLUSHIE_DATA.bonnie.message,
          foxy: PLUSHIE_DATA.foxy.message
        };
        localStorage.setItem('fnaf_plush_messages', JSON.stringify(toSave));
      } catch (e) {}

      alertCelebration("💾 ¡Dedicatoria guardada con éxito!");
    }
    customizerModal.classList.remove('active');
  });

});
