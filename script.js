/* ====================================================================
   FIVE NIGHTS AT FREDDY'S - BIRTHDAY SURPRISE ENGINE
   Audio Engine, Confetti System, Countdown Flow & Plushie Modal
   ==================================================================== */

// --- CONFIGURATION & PLUSHIE MESSAGES & PRECIADOS RECUERDOS ---
const PLUSHIE_DATA = {
  freddy: {
    name: "Freddy Fazbear",
    role: "Líder de la Banda & Anfitrión",
    tag: "★ FAZBEAR VIP BIRTHDAY ★",
    avatar: "assets/images/freddy.jpg",
    memoryImg: "assets/images/memory_freddy.png",
    memoryTitle: "Preciados Recuerdos con Freddy 🌟",
    memoryCaption: "¡Otro año más conociendote y soportandote JAJAJA, andaba de chill en la foto💛!",
    themeClass: "freddy",
    // EDITABLE: Mensaje predeterminado de Freddy
    message: `¡Hola, cumpleañera estrella! 🎩✨\n\nEn nombre de toda la pizzería y de la banda de Freddy Fazbear, ¡te deseamos un cumpleaños increíble y lleno de magia!\n\nGracias por ser una persona tan especial, divertida y genial. Hoy el escenario principal brilla únicamente para ti. ¡Que todos tus sueños y deseos se hagan realidad en este nuevo año de vida! 🍕🎂🎉`,
    giftTitle: "Preciados Recuerdos & Pase Dorado",
    giftSecret: "📸 ¡Desbloqueaste tu foto de recuerdos con Freddy! Un momento especial guardado en el corazón de Fazbear. 💛",
    specialActionLabel: "🎶 Tocar Marcha de Freddy"
  },
  bonnie: {
    name: "Bonnie the Bunny",
    role: "Guitarrista Estrella de Rock",
    tag: "★ ROCKSTAR BIRTHDAY SOLO ★",
    avatar: "assets/images/bonnie.jpg",
    memoryImg: "assets/images/memory_bonnie.jpg",
    memoryTitle: "Preciados Recuerdos con Bonnie 🌸",
    memoryCaption: "Tardes de relax, ese point onde siempre nos juntabamos pa comer lo era todo, comiamos jateabamos un toq y salia su UNO, Joder nunca lo olvidare. 💜🍃",
    themeClass: "bonnie",
    // EDITABLE: Mensaje predeterminado de Bonnie
    message: `¡Hey, cumpleañera rockera! 🎸💜\n\n¡Espero que estés lista para rockear al máximo en tu día! Bonnie preparó los mejores acordes y melodías para celebrar tu vida.\n\nQue este año esté lleno de buena música, aventuras alegres y personas que te hagan sonreír cada día. ¡Nunca dejes de brillar como la estrella que eres! 🐰⚡🎵`,
    giftTitle: "Preciados Recuerdos & Solo de Guitarra",
    giftSecret: "📸 ¡Desbloqueaste tu foto de recuerdos con Bonnie! Una tarde inolvidable llena de ternura y paz. 💜",
    specialActionLabel: "🎸 Solo de Guitarra Rock"
  },
  foxy: {
    name: "Foxy the Pirate Fox",
    role: "Corsario de Pirate Cove",
    tag: "★ PIRATE COVE SECRET TREASURE ★",
    avatar: "assets/images/foxy.jpg",
    memoryImg: "assets/images/memory_foxy.jpg",
    memoryTitle: "Preciados Recuerdos con Foxy ♟️",
    memoryCaption: "Buaaa esto ci que me trae mas recuerdoc, creo q ati te gustava jugar de todo oe, UNO, ajedre, su real left ufff y ojo yo núnca perrdia solo ne dejaba ganar jeje. ❤️🏴‍☠️",
    themeClass: "foxy",
    // EDITABLE: Mensaje predeterminado de Foxy
    message: `¡Ahoy, capitana de la fiesta! 🏴‍☠️❤️\n\nFoxy salió corriendo a toda velocidad desde Pirate Cove para ser el primero en traerte su cofre del tesoro.\n\nEn este cumpleaños, te deseo travesías llenas de alegría, salud, éxitos y momentos que atesores para siempre. ¡Eres la persona más valiente y genial de los 7 mares! 🦊⚔️💎`,
    giftTitle: "Preciados Recuerdos & Cofre Pirata",
    giftSecret: "📸 ¡Desbloqueaste tu foto de recuerdos con Foxy! El verdadero tesoro son todas las risas que compartimos. ❤️",
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
// WEB AUDIO SYNTHESIZER & SOUND EFFECTS (High Fidelity FNAF Engine)
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

  // Sonido auténtico de la nariz de Freddy (fnaf-12-3-freddys-nose-sound.mp3)
  playHonkNose() {
    try {
      const audioEl = document.getElementById('audioFreddyNose');
      if (audioEl) {
        audioEl.currentTime = 0;
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            const fallbackAudio = new Audio('assets/audio/fnaf-12-3-freddys-nose-sound.mp3');
            fallbackAudio.play().catch(() => {});
          });
        }
      } else {
        const sound = new Audio('assets/audio/fnaf-12-3-freddys-nose-sound.mp3');
        sound.play().catch(() => {});
      }
    } catch (e) {
      console.log('Error playing Freddy nose sound:', e);
    }
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

  // 1. Freddy Beatbox (assets/audio/freddy-beatbox.mp3)
  playFreddyMusicBox() {
    this.stopSpecialAudios();
    try {
      const audioEl = document.getElementById('audioFreddyBeatbox');
      if (audioEl) {
        audioEl.currentTime = 0;
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            const fallback = new Audio('assets/audio/freddy-beatbox.mp3');
            fallback.play().catch(() => {});
          });
        }
      } else {
        const sound = new Audio('assets/audio/freddy-beatbox.mp3');
        sound.play().catch(() => {});
      }
    } catch (e) {
      console.log('Error playing Freddy beatbox:', e);
    }
  }

  // 2. Bonnie El Cumpleañero (assets/audio/el-cumpleanero.mp3)
  playBonnieSolo() {
    this.stopSpecialAudios();
    try {
      const audioEl = document.getElementById('audioBonnieRock');
      if (audioEl) {
        audioEl.currentTime = 0;
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            const fallback = new Audio('assets/audio/el-cumpleanero.mp3');
            fallback.play().catch(() => {});
          });
        }
      } else {
        const sound = new Audio('assets/audio/el-cumpleanero.mp3');
        sound.play().catch(() => {});
      }
    } catch (e) {
      console.log('Error playing Bonnie cumpleañero sound:', e);
    }
  }

  // 3. Foxy WhatsApp Audio (assets/audio/foxy-whatsapp.ogg)
  playFoxyJingle() {
    this.stopSpecialAudios();
    try {
      const audioEl = document.getElementById('audioFoxyPirate');
      if (audioEl) {
        audioEl.currentTime = 0;
        const playPromise = audioEl.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            const fallback = new Audio('assets/audio/foxy-whatsapp.ogg');
            fallback.play().catch(() => {});
          });
        }
      } else {
        const sound = new Audio('assets/audio/foxy-whatsapp.ogg');
        sound.play().catch(() => {});
      }
    } catch (e) {
      console.log('Error playing Foxy WhatsApp sound:', e);
    }
  }

  // Detener audios de acción especial al cambiar o cerrar
  stopSpecialAudios() {
    ['audioFreddyBeatbox', 'audioBonnieRock', 'audioFoxyPirate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
    });
  }

  // Campana armónica metálica realista para el reloj de FNAF
  playBellNote(freq, startTime, duration = 1.8, masterGainVal = 0.28) {
    if (!this.ctx) return;
    const partials = [
      { ratio: 0.5, gain: 0.15, decay: duration * 1.2 },  // Hum
      { ratio: 1.0, gain: 0.35, decay: duration },        // Fundamental / Prime
      { ratio: 1.19, gain: 0.25, decay: duration * 0.8 }, // Tierce (minor 3rd)
      { ratio: 1.50, gain: 0.20, decay: duration * 0.7 }, // Quint
      { ratio: 2.00, gain: 0.28, decay: duration * 0.6 }, // Nominal / Octave
      { ratio: 3.00, gain: 0.15, decay: duration * 0.4 }, // Superquint
      { ratio: 4.15, gain: 0.08, decay: duration * 0.25 } // Strike
    ];

    partials.forEach(p => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * p.ratio, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(p.gain * masterGainVal, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + p.decay);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + p.decay);
    });
  }

  // Sonido auténtico y legendario de las 6:00 AM de FNAF 1 (Westminster Chimes + Cheering)
  play6AMChime() {
    this.init();
    const t = this.ctx.currentTime;
    
    // Melodía del reloj de péndulo de FNAF (Westminster Quarters)
    const melody = [
      { f: 659.25, time: 0.00 }, // E5
      { f: 523.25, time: 0.45 }, // C5
      { f: 587.33, time: 0.90 }, // D5
      { f: 392.00, time: 1.35 }, // G4
      
      { f: 392.00, time: 2.05 }, // G4
      { f: 587.33, time: 2.50 }, // D5
      { f: 659.25, time: 2.95 }, // E5
      { f: 523.25, time: 3.40 }  // C5
    ];

    melody.forEach(n => {
      this.playBellNote(n.f, t + n.time, 1.8, 0.3);
    });

    // Grito de victoria y fanfarria al completar las 6 AM
    this.playCelebrationCheer(t + 4.1);
  }

  // Fanfarria y ovación de cumpleaños / victoria
  playCelebrationCheer(time) {
    if (!this.ctx) return;
    const fanfare = [
      { f: 523.25, offset: 0.0, d: 0.25 },
      { f: 659.25, offset: 0.15, d: 0.25 },
      { f: 783.99, offset: 0.30, d: 0.25 },
      { f: 1046.50, offset: 0.45, d: 0.8 }
    ];

    fanfare.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, time + note.offset);

      gain.gain.setValueAtTime(0, time + note.offset);
      gain.gain.linearRampToValueAtTime(0.25, time + note.offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + note.offset + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time + note.offset);
      osc.stop(time + note.offset + note.d);
    });

    // Ruido filtrado que simula la emoción y aplausos
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.7));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, time);
    filter.frequency.linearRampToValueAtTime(1400, time + 0.4);
    filter.frequency.linearRampToValueAtTime(600, time + 1.2);
    filter.Q.value = 1.2;

    const cheerGain = this.ctx.createGain();
    cheerGain.gain.setValueAtTime(0, time);
    cheerGain.gain.linearRampToValueAtTime(0.2, time + 0.1);
    cheerGain.gain.exponentialRampToValueAtTime(0.001, time + 1.4);

    noise.connect(filter);
    filter.connect(cheerGain);
    cheerGain.connect(this.ctx.destination);

    noise.start(time);
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
  const btnNoTomorrow = document.getElementById('btnNoTomorrow');
  const btnVeamoslo = document.getElementById('btnVeamoslo');
  const countdownNumber = document.getElementById('countdownNumber');
  const countdownLabel = document.getElementById('countdownLabel');

  const introCard = document.getElementById('introCard');
  const introBadge = document.getElementById('introBadge');
  const introTitle = document.getElementById('introTitle');
  const introSubtitle = document.getElementById('introSubtitle');
  const introStep1 = document.getElementById('introStep1');
  const introStep2 = document.getElementById('introStep2');

  // Background Music Element
  const bgMusic = document.getElementById('bgMusic');
  const btnPlayPause = document.getElementById('btnPlayPause');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const volumeSlider = document.getElementById('volumeSlider');
  const btnLoopToggle = document.getElementById('btnLoopToggle');
  const musicPlayerBar = document.getElementById('musicPlayerBar');

  // Loop settings: 'full' = entire song | 'chorus' = loop 0:20 - 1:15
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
  
  // Interactive Gift Elements (Preciados Recuerdos)
  const modalGiftBoxClosed = document.getElementById('modalGiftBoxClosed');
  const modalGiftStatus = document.getElementById('modalGiftStatus');
  const btnOpenGift = document.getElementById('btnOpenGift');
  const modalMemoryReveal = document.getElementById('modalMemoryReveal');
  const modalMemoryImg = document.getElementById('modalMemoryImg');
  const modalMemoryTitle = document.getElementById('modalMemoryTitle');
  const modalMemoryCaption = document.getElementById('modalMemoryCaption');
  const btnZoomMemoryWrapper = document.getElementById('btnZoomMemoryWrapper');
  const btnReopenGift = document.getElementById('btnReopenGift');

  const btnPlaySpecialSound = document.getElementById('btnPlaySpecialSound');
  const btnEditMessage = document.getElementById('btnEditMessage');

  // Customizer Modal Elements
  const customizerModal = document.getElementById('customizerModal');
  const customizerTitle = document.getElementById('customizerTitle');
  const customizerText = document.getElementById('customizerText');
  const btnCancelCustomizer = document.getElementById('btnCancelCustomizer');
  const btnSaveCustomizer = document.getElementById('btnSaveCustomizer');

  // Lightbox Modal Elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaptionText = document.getElementById('lightboxCaptionText');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  // 6:00 AM Victory Overlay
  const fnaf6amOverlay = document.getElementById('fnaf6amOverlay');
  const fnaf6amClock = document.getElementById('fnaf6amClock');

  let currentSelectedPlush = 'freddy';
  let isGiftOpened = false;

  // ==================================================================
  // 1. FLOW: INTRO -> 3s COUNTDOWN -> SURPRISE
  // ==================================================================
  function startExperience() {
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
  }

  // Opción 1: Sí quiero verla
  if (btnStart) {
    btnStart.addEventListener('click', startExperience);
  }

  // Opción 2: No, mñn con falta (Muestra el Meme del Gatito y mensaje)
  if (btnNoTomorrow) {
    btnNoTomorrow.addEventListener('click', () => {
      sfx.init();
      sfx.playHonkNose();

      if (introCard) {
        introCard.classList.add('meme-mode');
      }

      if (introBadge) {
        introBadge.innerHTML = '<span>😾 ¡ALERTA FAZBEAR! 😾</span>';
      }

      if (introTitle) {
        introTitle.innerHTML = '¡Nada de <span class="highlight">mñn!</span>';
      }

      if (introSubtitle) {
        introSubtitle.textContent = '¡La fiesta de cumpleaños es HOY sí o sí, nada de faltar! 😼🎂';
      }

      if (introStep1 && introStep2) {
        introStep1.style.display = 'none';
        introStep2.style.display = 'flex';
      }

      confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 40);
    });
  }

  // Opción Step 2: ¡Veámoslo!
  if (btnVeamoslo) {
    btnVeamoslo.addEventListener('click', startExperience);
  }

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
            trigger6AMCelebration();
          }, 400);
        }
      }
    });
  });

  // ==================================================================
  // 4. EASTER EGGS BUTTONS & 6:00 AM CELEBRATION
  // ==================================================================
  // Honk Freddy's Nose (Sonido icónico de la nariz de Freddy)
  document.getElementById('btnHonkNose').addEventListener('click', (e) => {
    sfx.playHonkNose();
    confetti.burst(e.clientX, e.clientY, 25);
  });

  // 6:00 AM Victoria Chime & Overlay
  document.getElementById('btn6AM').addEventListener('click', () => {
    trigger6AMCelebration();
  });

  function trigger6AMCelebration() {
    sfx.play6AMChime();
    
    // Mostrar overlay de 6:00 AM estilo FNAF
    fnaf6amOverlay.classList.add('active');
    fnaf6amOverlay.setAttribute('aria-hidden', 'false');
    fnaf6amClock.innerHTML = '5:59 <span class="ampm">AM</span>';

    // Ráfagas de confeti continuo
    confetti.burst(window.innerWidth * 0.5, window.innerHeight * 0.4, 90);
    confetti.burst(window.innerWidth * 0.2, window.innerHeight * 0.5, 60);
    confetti.burst(window.innerWidth * 0.8, window.innerHeight * 0.5, 60);

    // Flip del reloj a las 6:00 AM
    setTimeout(() => {
      fnaf6amClock.innerHTML = '6:00 <span class="ampm">AM</span>';
      confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 120);
    }, 1500);

    // Auto-cierre después de 5.5 segundos
    setTimeout(() => {
      fnaf6amOverlay.classList.remove('active');
      fnaf6amOverlay.setAttribute('aria-hidden', 'true');
    }, 5500);
  }

  // Cerrar overlay de 6 AM al hacer clic
  fnaf6amOverlay.addEventListener('click', () => {
    fnaf6amOverlay.classList.remove('active');
    fnaf6amOverlay.setAttribute('aria-hidden', 'true');
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
  // 5. PLUSHIE CARDS & MODAL DETAILED EXPERIENCE (PRECIADOS RECUERDOS)
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
    
    // Resetear estado del regalo (Caja cerrada)
    modalGiftBoxClosed.style.display = 'flex';
    modalMemoryReveal.style.display = 'none';
    modalGiftStatus.textContent = "¡Haz clic en la caja de regalo para abrir este recuerdo especial!";
    btnOpenGift.textContent = "🎁";
    
    // Cargar contenido de la foto de Preciados Recuerdos
    modalMemoryImg.src = data.memoryImg;
    modalMemoryTitle.textContent = data.memoryTitle;
    modalMemoryCaption.textContent = data.memoryCaption;

    btnPlaySpecialSound.textContent = data.specialActionLabel;

    sfx.playPop();
    plushieModal.classList.add('active');
    plushieModal.setAttribute('aria-hidden', 'false');

    // Confeti de bienvenida al personaje
    confetti.burst(window.innerWidth / 2, window.innerHeight * 0.3, 40);
  }

  // Cerrar Modal del Peluche
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

  // Abrir Regalo Interactivo del Peluche (Revelar Foto de Preciados Recuerdos)
  btnOpenGift.addEventListener('click', (e) => {
    const data = PLUSHIE_DATA[currentSelectedPlush];
    isGiftOpened = true;
    
    // Ocultar caja cerrada y mostrar polaroid de recuerdos con animación
    modalGiftBoxClosed.style.display = 'none';
    modalMemoryReveal.style.display = 'flex';
    
    sfx.play6AMChime();
    const rect = modalMemoryReveal.getBoundingClientRect();
    confetti.burst(rect.left + rect.width / 2, rect.top + 50, 80);
    confetti.burst(window.innerWidth * 0.4, window.innerHeight * 0.5, 50);
    confetti.burst(window.innerWidth * 0.6, window.innerHeight * 0.5, 50);
  });

  // Volver a Empacar Regalo (Para poder abrirlo de nuevo)
  btnReopenGift.addEventListener('click', () => {
    sfx.playPop();
    isGiftOpened = false;
    modalMemoryReveal.style.display = 'none';
    modalGiftBoxClosed.style.display = 'flex';
    modalGiftStatus.textContent = "¡Haz clic en la caja de regalo para abrir este recuerdo especial!";
  });

  // Abrir Lightbox para ver la foto en pantalla completa
  btnZoomMemoryWrapper.addEventListener('click', () => {
    const data = PLUSHIE_DATA[currentSelectedPlush];
    sfx.playPop();
    lightboxImg.src = data.memoryImg;
    lightboxCaptionText.textContent = data.memoryCaption;
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
  });

  // Cerrar Lightbox
  function closeLightbox() {
    sfx.playPop();
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
  }

  lightboxCloseBtn.addEventListener('click', closeLightbox);
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      closeLightbox();
    }
  });

  // Cerrar modales con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal.classList.contains('active')) {
        closeLightbox();
      } else if (customizerModal.classList.contains('active')) {
        customizerModal.classList.remove('active');
      } else if (plushieModal.classList.contains('active')) {
        closePlushieModal();
      }
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
