/**
 * HAUNTED HOUSE: THE ESCAPE
 * 3D Survival Horror Escape Game built with Three.js & Web Audio API
 */

// --- 1. PROCEDURAL 3D TEXTURE GENERATOR ---
const TextureFactory = {
  createWood(color = '#2d1f14', grainColor = '#1a110a') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);

    // Plank lines
    ctx.strokeStyle = '#0e0906';
    ctx.lineWidth = 4;
    for (let y = 0; y < 512; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Wood grain noise & scratches
    ctx.fillStyle = grainColor;
    for (let i = 0; i < 4000; i++) {
      const gx = Math.random() * 512;
      const gy = Math.random() * 512;
      ctx.fillRect(gx, gy, Math.random() * 12 + 2, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  createWallpaper() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1c1618';
    ctx.fillRect(0, 0, 512, 512);

    // Peeling Victorian damask stripes
    ctx.strokeStyle = '#2b2024';
    ctx.lineWidth = 12;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }

    // Mold and grime stains
    ctx.fillStyle = 'rgba(10, 8, 8, 0.6)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 40 + 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Blood splatter hints
    ctx.fillStyle = 'rgba(90, 10, 15, 0.4)';
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 18 + 4, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  createStone() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#141416';
    ctx.fillRect(0, 0, 512, 512);

    // Brick mortar lines
    ctx.strokeStyle = '#0a0a0c';
    ctx.lineWidth = 4;
    const bh = 32;
    const bw = 64;
    for (let y = 0; y < 512; y += bh) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();

      const offset = (y / bh) % 2 === 0 ? 0 : bw / 2;
      for (let x = offset; x < 512; x += bw) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + bh);
        ctx.stroke();
      }
    }

    // Damp moss stains
    ctx.fillStyle = 'rgba(15, 30, 18, 0.5)';
    for (let i = 0; i < 30; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 512, Math.random() * 30 + 5, Math.random() * 20 + 4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  createSmilingEntityFaceTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // 1. Ghostly Ashen Skin Base
    ctx.fillStyle = '#d5cbca';
    ctx.fillRect(0, 0, 512, 512);

    // Mottled bruised skin texture
    for (let i = 0; i < 400; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(160, 50, 60, 0.08)' : 'rgba(80, 20, 30, 0.06)';
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 512, Math.random() * 24 + 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Deep Sunken Eye Sockets (Bruised purple-maroon rings)
    const eyeCenters = [{ x: 170, y: 180 }, { x: 342, y: 180 }];
    eyeCenters.forEach(pt => {
      if (ctx.createRadialGradient) {
        const rad = ctx.createRadialGradient(pt.x, pt.y, 10, pt.x, pt.y, 82);
        rad.addColorStop(0, '#120206');
        rad.addColorStop(0.45, '#3b0a14');
        rad.addColorStop(0.75, '#731b26');
        rad.addColorStop(1, 'rgba(213, 203, 202, 0)');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 82, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = '#3b0a14';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 75, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 3. Giant Bulging White Eyeballs
    eyeCenters.forEach(pt => {
      // White sclera
      ctx.fillStyle = '#faf8f6';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 45, 0, Math.PI * 2);
      ctx.fill();

      // Bloodshot capillary veins
      ctx.strokeStyle = 'rgba(190, 20, 30, 0.45)';
      ctx.lineWidth = 1.2;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(pt.x + Math.cos(a) * 44, pt.y + Math.sin(a) * 44);
        ctx.lineTo(pt.x + Math.cos(a + 0.15) * 22, pt.y + Math.sin(a + 0.15) * 22);
        ctx.stroke();
      }

      // Dark iris border
      ctx.strokeStyle = '#2b1010';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Tiny piercing black pinprick pupil
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Glossy specular highlight
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(pt.x + 3, pt.y - 3, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // 4. Metallic Piercing Studs on Outer Cheekbones
    const piercings = [{ x: 102, y: 172 }, { x: 410, y: 172 }];
    piercings.forEach(p => {
      ctx.fillStyle = '#a6a6b5';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x - 2, p.y - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 5. Nose & Bridge
    ctx.fillStyle = 'rgba(80, 25, 30, 0.25)';
    ctx.beginPath();
    ctx.moveTo(250, 160);
    ctx.lineTo(262, 160);
    ctx.lineTo(268, 245);
    ctx.lineTo(244, 245);
    if (ctx.closePath) ctx.closePath();
    ctx.fill();

    // Nostrils
    ctx.fillStyle = '#3a0f14';
    ctx.beginPath();
    ctx.ellipse ? ctx.ellipse(244, 250, 5, 8, -0.2, 0, Math.PI * 2) : ctx.arc(244, 250, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse ? ctx.ellipse(268, 250, 5, 8, 0.2, 0, Math.PI * 2) : ctx.arc(268, 250, 6, 0, Math.PI * 2);
    ctx.fill();

    // 6. The Impossibly Wide Ear-To-Ear Grin
    const mouthLeft = 95;
    const mouthRight = 417;
    const mouthY = 320;
    const qCurve = (cpx, cpy, x, y) => {
      if (ctx.quadraticCurveTo) ctx.quadraticCurveTo(cpx, cpy, x, y);
      else ctx.lineTo(x, y);
    };
    const drawRect = (rx, ry, rw, rh) => {
      if (ctx.rect) ctx.rect(rx, ry, rw, rh);
      else if (ctx.fillRect) ctx.fillRect(rx, ry, rw, rh);
    };

    // Dark oral cavity
    ctx.fillStyle = '#080103';
    ctx.beginPath();
    ctx.moveTo(mouthLeft, mouthY - 10);
    qCurve(256, mouthY + 80, mouthRight, mouthY - 10);
    qCurve(256, mouthY - 45, mouthLeft, mouthY - 10);
    if (ctx.closePath) ctx.closePath();
    ctx.fill();

    // Deep Gums
    ctx.fillStyle = '#681120';
    ctx.beginPath();
    ctx.moveTo(mouthLeft + 15, mouthY - 12);
    qCurve(256, mouthY - 42, mouthRight - 15, mouthY - 12);
    qCurve(256, mouthY - 32, mouthLeft + 15, mouthY - 12);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(mouthLeft + 20, mouthY + 12);
    qCurve(256, mouthY + 70, mouthRight - 20, mouthY + 12);
    qCurve(256, mouthY + 58, mouthLeft + 20, mouthY + 12);
    ctx.fill();

    // Upper Teeth (14 distinct teeth)
    const numTeeth = 14;
    const toothWidth = (mouthRight - mouthLeft - 30) / numTeeth;
    for (let i = 0; i < numTeeth; i++) {
      const tx = mouthLeft + 15 + i * toothWidth;
      const progress = i / (numTeeth - 1);
      const curveOffset = Math.sin(progress * Math.PI) * 22;
      const ty = mouthY - 32 + curveOffset;

      ctx.fillStyle = '#fffdf2';
      ctx.strokeStyle = '#220508';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      drawRect(tx, ty, toothWidth - 2, 22);
      ctx.fill();
      ctx.stroke();

      // Shaded dental roots
      ctx.fillStyle = 'rgba(215, 195, 160, 0.4)';
      ctx.fillRect(tx, ty, toothWidth - 2, 6);
    }

    // Lower Teeth (14 distinct teeth)
    for (let i = 0; i < numTeeth; i++) {
      const tx = mouthLeft + 18 + i * toothWidth;
      const progress = i / (numTeeth - 1);
      const curveOffset = Math.sin(progress * Math.PI) * 25;
      const ty = mouthY + 8 + curveOffset;

      ctx.fillStyle = '#f8f4e6';
      ctx.strokeStyle = '#220508';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      drawRect(tx, ty, toothWidth - 2, 20);
      ctx.fill();
      ctx.stroke();
    }

    // Smile Creases & Nasolabial Folds
    ctx.strokeStyle = 'rgba(60, 15, 20, 0.7)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(230, 240);
    qCurve(140, 260, mouthLeft - 5, mouthY - 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(282, 240);
    qCurve(372, 260, mouthRight + 5, mouthY - 15);
    ctx.stroke();

    // 7. Shaggy Dark Hair Bangs cascading onto forehead
    ctx.fillStyle = '#0f0c11';
    for (let i = 0; i < 28; i++) {
      const bx = 80 + i * 13;
      const blen = 80 + Math.sin(i * 0.7) * 45 + (i % 3) * 20;
      ctx.beginPath();
      ctx.moveTo(bx, 0);
      ctx.lineTo(bx + 18, 0);
      ctx.lineTo(bx + 8, blen);
      if (ctx.closePath) ctx.closePath();
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  createHospitalShirtTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Vintage patient/asylum fabric
    ctx.fillStyle = '#e4dfd7';
    ctx.fillRect(0, 0, 512, 512);

    // Fine fabric texture grain
    ctx.fillStyle = 'rgba(180, 170, 160, 0.15)';
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 512, 1);
    }

    // Center vertical button placket
    ctx.fillStyle = '#d7d0c6';
    ctx.fillRect(238, 0, 36, 512);
    ctx.strokeStyle = '#b8aea0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(238, 0);
    ctx.lineTo(238, 512);
    ctx.moveTo(274, 0);
    ctx.lineTo(274, 512);
    ctx.stroke();

    // Dark round buttons
    const buttonYs = [60, 150, 240, 330, 420];
    buttonYs.forEach(by => {
      ctx.fillStyle = '#3a3430';
      ctx.beginPath();
      ctx.arc(256, by, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(254, by - 2, 2, 0, Math.PI * 2);
      ctx.fill();

      // Stitch dots
      ctx.fillStyle = '#8c8278';
      ctx.fillRect(253, by - 2, 2, 2);
      ctx.fillRect(257, by - 2, 2, 2);
      ctx.fillRect(253, by + 2, 2, 2);
      ctx.fillRect(257, by + 2, 2, 2);
    });

    // Wrinkles and grime shading
    ctx.strokeStyle = 'rgba(80, 70, 60, 0.18)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(120, 100 + i * 50);
      if (ctx.quadraticCurveTo) ctx.quadraticCurveTo(240, 120 + i * 50, 390, 90 + i * 50);
      else ctx.lineTo(390, 90 + i * 50);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }
};

// --- 2. PROCEDURAL HORROR AUDIO SYNTHESIZER ---
class HorrorAudio {
  constructor() {
    this.ctx = null;
    this.droneOsc = null;
    this.heartbeatOsc = null;
    this.isMuted = false;
    this.heartbeatRate = 1.0; // Seconds between beats
    this.lastHeartbeatTime = 0;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioClass = window.AudioContext || window.webkitAudioContext;
      if (AudioClass) {
        this.ctx = new AudioClass();
        this.startDrone();
      }
    } catch (e) {
      console.warn('AudioContext failed to initialize:', e);
    }
  }

  startDrone() {
    if (!this.ctx) return;
    try {
      this.droneOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      this.droneOsc.type = 'sawtooth';
      this.droneOsc.frequency.setValueAtTime(45, this.ctx.currentTime); // Low horror rumble

      // Lowpass filter to muffle the drone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      this.droneOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      this.droneOsc.start();
    } catch (e) {}
  }

  updateHeartbeat(keeperDistance) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Heartbeat accelerates as keeper gets closer (from 15m down to 2m)
    const normalized = Math.max(0, Math.min(1, (16 - keeperDistance) / 14));
    this.heartbeatRate = 1.2 - normalized * 0.85; // 1.2s down to 0.35s

    if (now - this.lastHeartbeatTime > this.heartbeatRate && normalized > 0.05) {
      this.lastHeartbeatTime = now;
      this.playHeartbeatThump(normalized);
    }
  }

  playHeartbeatThump(intensity = 0.5) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(75, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);

      const vol = 0.08 + intensity * 0.22;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  playFootstep(isKeeper = false) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isKeeper ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(isKeeper ? 55 : 90, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.08);

      gain.gain.setValueAtTime(isKeeper ? 0.14 : 0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  playFlashlightClick() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.setValueAtTime(800, now + 0.02);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  playDoorCreak() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(340, now + 0.18);
      osc.frequency.linearRampToValueAtTime(160, now + 0.35);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.38);
    } catch (e) {}
  }

  playItemPickup() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  playJumpscareStinger() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(700 + i * 220, now);
        osc.frequency.linearRampToValueAtTime(280 + i * 50, now + 0.6);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch (e) {}
  }

  playEnemyAttack() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Visceral bone impact thud
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 0.22);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // High-pitched wet flesh slash / monster shriek
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(920, now);
      osc2.frequency.linearRampToValueAtTime(320, now + 0.3);
      gain2.gain.setValueAtTime(0.22, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.32);
    } catch (e) {}
  }

  playPlayerHurt() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  playEnemyDetection() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(820, now + 0.28);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  playVictoryChime() {
    if (!this.ctx) return;
    try {
      const chords = [523.25, 659.25, 783.99, 1046.5];
      chords.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.6);
        }, idx * 160);
      });
    } catch (e) {}
  }
}

// --- 3. DIFFICULTY CONFIGURATIONS ---
const DIFFICULTIES = {
  easy: {
    label: 'EASY',
    keeperSpeed: 2.2,
    keeperChaseSpeed: 4.2,
    keeperDamage: 25,
    keeperCooldown: 2.0,
    keeperRecovery: 1.8,
    keeperFov: 50 * (Math.PI / 180),
    keeperSightDist: 12,
    staminaDrain: 18,
    staminaRecover: 30,
    batteryDrainRate: 0.15,
  },
  normal: {
    label: 'NORMAL',
    keeperSpeed: 3.2,
    keeperChaseSpeed: 5.5,
    keeperDamage: 35,
    keeperCooldown: 1.4,
    keeperRecovery: 1.2,
    keeperFov: 70 * (Math.PI / 180),
    keeperSightDist: 18,
    staminaDrain: 25,
    staminaRecover: 22,
    batteryDrainRate: 0.35,
  },
  hard: {
    label: 'NIGHTMARE',
    keeperSpeed: 4.2,
    keeperChaseSpeed: 6.8,
    keeperDamage: 50,
    keeperCooldown: 0.9,
    keeperRecovery: 0.7,
    keeperFov: 90 * (Math.PI / 180),
    keeperSightDist: 25,
    staminaDrain: 35,
    staminaRecover: 15,
    batteryDrainRate: 0.6,
  }
};

// --- 4. HOUSE BUILDER (ROOMS, WALLS, DOORS, PROPS) ---
class HouseBuilder {
  constructor(scene) {
    this.scene = scene;
    this.walls = [];
    this.doors = [];
    this.drawers = [];
    this.items = [];
    this.hidingSpots = [];
    this.frontDoorPlanks = [];
    this.frontDoorPadlock = null;
    this.frontDoorAlarmWires = null;
    this.fuseBox = null;
    this.exitDoor = null;

    // Materials
    this.woodFloorMat = new THREE.MeshStandardMaterial({
      map: TextureFactory.createWood('#2b1c12', '#140c06'),
      roughness: 0.7,
      metalness: 0.1
    });
    this.woodFloorMat.map.repeat.set(8, 8);

    this.basementFloorMat = new THREE.MeshStandardMaterial({
      map: TextureFactory.createStone(),
      roughness: 0.9,
      metalness: 0.2
    });
    this.basementFloorMat.map.repeat.set(6, 6);

    this.wallMat = new THREE.MeshStandardMaterial({
      map: TextureFactory.createWallpaper(),
      roughness: 0.85,
      metalness: 0.05
    });
    this.wallMat.map.repeat.set(4, 2);

    this.doorWoodMat = new THREE.MeshStandardMaterial({
      map: TextureFactory.createWood('#3a2416', '#1a0e08'),
      roughness: 0.6,
      metalness: 0.1
    });

    this.furnitureWoodMat = new THREE.MeshStandardMaterial({
      map: TextureFactory.createWood('#402818', '#1c1008'),
      roughness: 0.6
    });

    this.metalMat = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.4,
      metalness: 0.8
    });

    this.bloodMat = new THREE.MeshStandardMaterial({
      color: 0x8b0000,
      roughness: 0.3
    });
  }

  buildHouse() {
    this.createFloorsAndCeilings();
    this.createHouseRooms();
    this.createFurniture();
    this.createPuzzleInteractables();
    this.createAtmosphericLights();
  }

  createFloorsAndCeilings() {
    // 1. Main Upper Floor (Y = 0)
    const floorGeo = new THREE.PlaneGeometry(36, 28);
    const floor = new THREE.Mesh(floorGeo, this.woodFloorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Ceiling
    const ceilGeo = new THREE.PlaneGeometry(36, 28);
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x181412, roughness: 0.9 });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, 3.4, 0);
    this.scene.add(ceil);

    // 2. Basement Floor (Y = -4)
    const bFloorGeo = new THREE.PlaneGeometry(16, 14);
    const bFloor = new THREE.Mesh(bFloorGeo, this.basementFloorMat);
    bFloor.rotation.x = -Math.PI / 2;
    bFloor.position.set(8, -4, 6);
    this.scene.add(bFloor);
  }

  addWall(x, z, width, height, length, mat = this.wallMat, y = 1.7) {
    const geo = new THREE.BoxGeometry(width, height, length);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    // Store collision bounding box
    mesh.geometry.computeBoundingBox();
    const box = new THREE.Box3();
    box.setFromObject(mesh);
    this.walls.push({ mesh, box, minX: x - width/2, maxX: x + width/2, minZ: z - length/2, maxZ: z + length/2 });
    return mesh;
  }

  createHouseRooms() {
    // Outer Bounds
    this.addWall(0, -14, 36, 3.4, 0.4); // North Wall
    this.addWall(0, 14, 36, 3.4, 0.4);  // South Wall
    this.addWall(-18, 0, 0.4, 3.4, 28); // West Wall
    this.addWall(18, 0, 0.4, 3.4, 28);  // East Wall

    // --- ROOM 1: STARTING BEDROOM (Top Left, X: -18 to -6, Z: -14 to -2) ---
    this.addWall(-6, -11, 0.4, 3.4, 6); // East bedroom wall upper
    this.addWall(-6, -3.5, 0.4, 3.4, 3); // East bedroom wall lower (doorway gap at Z: -6.5)
    this.addWall(-12, -2, 12, 3.4, 0.4); // South bedroom wall

    // Bedroom Door (At X: -6, Z: -6.5)
    this.createDoor(-6, -6.5, Math.PI / 2, 'bedroom_door', 'Bedroom Door (Locked)', true, 'bedroom_key');

    // --- ROOM 2: BATHROOM (Top Mid, X: -5 to 4, Z: -14 to -5) ---
    this.addWall(4, -11, 0.4, 3.4, 6);
    this.addWall(-0.5, -5, 9, 3.4, 0.4);
    this.createDoor(4, -6.5, Math.PI / 2, 'bathroom_door', 'Bathroom Door', false);

    // --- ROOM 3: STORAGE ROOM (Top Right, X: 5 to 18, Z: -14 to -4) ---
    this.addWall(11.5, -4, 13, 3.4, 0.4);
    this.createDoor(5, -4, 0, 'storage_door', 'Storage Room Door', false);

    // --- CENTRAL CORRIDOR (Z: -3 to 3) ---
    // Connects rooms and stairs

    // --- ROOM 4: LIVING ROOM & FRONT EXIT (Bottom Left, X: -18 to -2, Z: 2 to 14) ---
    this.addWall(-10, 2, 16, 3.4, 0.4); // North wall with doorway
    this.addWall(-2, 8, 0.4, 3.4, 12);  // East dividing wall
    this.createDoor(-10, 2, 0, 'living_door', 'Living Room Door', false);

    // THE FRONT EXIT DOOR (At South Wall, X: -10, Z: 14)
    this.createFrontExitDoor(-10, 13.8);

    // --- ROOM 5: KITCHEN (Bottom Right, X: 0 to 18, Z: 2 to 14) ---
    this.addWall(9, 2, 18, 3.4, 0.4); // North kitchen wall with opening at X: 0
    this.createDoor(1, 2, 0, 'kitchen_door', 'Kitchen Door', false);

    // --- BASEMENT STAIRS & DOOR (At X: 11, Z: -1) ---
    this.createBasementEntrance(11, -1);
  }

  createDoor(x, z, rotation, id, label, locked = false, requiredItem = null) {
    const doorGroup = new THREE.Group();
    doorGroup.position.set(x, 0, z);
    doorGroup.rotation.y = rotation;

    const doorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.6, 0.1),
      this.doorWoodMat
    );
    doorMesh.position.set(0.7, 1.3, 0); // Pivot on side hinge
    doorMesh.castShadow = true;
    doorGroup.add(doorMesh);

    // Knob
    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 8, 8),
      this.metalMat
    );
    knob.position.set(1.2, 1.3, 0.08);
    doorGroup.add(knob);

    this.scene.add(doorGroup);

    const doorObj = {
      group: doorGroup,
      mesh: doorMesh,
      id,
      label,
      locked,
      requiredItem,
      isOpen: false,
      targetAngle: 0,
      currentAngle: 0,
      type: 'door',
      interact(player) {
        if (this.locked) {
          if (this.requiredItem && player.inventory === this.requiredItem) {
            this.locked = false;
            game.showAlert(`🔓 UNLOCKED WITH ${player.inventoryName.toUpperCase()}!`);
            player.consumeItem();
            audio.playItemPickup();
          } else {
            game.showAlert(`🔒 ${this.label.toUpperCase()} IS LOCKED!`);
            audio.playFootstep(true);
            return;
          }
        }
        this.isOpen = !this.isOpen;
        this.targetAngle = this.isOpen ? Math.PI * 0.55 : 0;
        audio.playDoorCreak();
      }
    };

    this.doors.push(doorObj);
    return doorObj;
  }

  createFrontExitDoor(x, z) {
    const doorGroup = new THREE.Group();
    doorGroup.position.set(x, 0, z);

    // Heavy Double Oak Door
    const exitMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 3.0, 0.2),
      new THREE.MeshStandardMaterial({
        map: TextureFactory.createWood('#1c0f08', '#0b0604'),
        roughness: 0.5
      })
    );
    exitMesh.position.set(0, 1.5, 0);
    doorGroup.add(exitMesh);

    // 1. Wooden Planks nailed across
    for (let i = 0; i < 3; i++) {
      const plank = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.24, 0.08),
        this.woodFloorMat
      );
      plank.position.set(0, 0.9 + i * 0.65, -0.16);
      plank.rotation.z = (Math.random() - 0.5) * 0.15;
      doorGroup.add(plank);
      this.frontDoorPlanks.push(plank);
    }

    // 2. Heavy Iron Padlock
    const padlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.4, 0.12),
      this.metalMat
    );
    padlock.position.set(0, 1.4, -0.22);
    doorGroup.add(padlock);
    this.frontDoorPadlock = padlock;

    // 3. Electronic Alarm Box & Red Wires
    const alarmBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.5, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    alarmBox.position.set(1.5, 1.8, -0.08);
    doorGroup.add(alarmBox);

    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 1.2),
      new THREE.MeshStandardMaterial({ color: 0xaa1111 })
    );
    wire.position.set(0.8, 1.7, -0.15);
    wire.rotation.z = Math.PI / 3;
    doorGroup.add(wire);
    this.frontDoorAlarmWires = wire;

    this.scene.add(doorGroup);

    this.exitDoor = {
      group: doorGroup,
      planks: this.frontDoorPlanks,
      padlock: padlock,
      wires: wire,
      planksRemoved: false,
      padlockRemoved: false,
      wiresCut: false,
      powerRestored: false,
      isOpen: false,
      type: 'exit_door',
      interact(player) {
        if (!this.planksRemoved) {
          if (player.inventory === 'crowbar') {
            this.planksRemoved = true;
            this.planks.forEach(p => p.visible = false);
            audio.playDoorCreak();
            if (game && game.showAlert) game.showAlert('🪵 PLANKS PRIED OFF WITH CROWBAR!');
            if (game && game.updateObjective) game.updateObjective('Pry off planks ✓ | Cut alarm wires & unlock padlock');
          } else {
            if (game && game.showAlert) game.showAlert('🔒 HEAVY PLANKS NAILED SHUT! NEED A CROWBAR!');
          }
          return;
        }

        if (!this.wiresCut) {
          if (player.inventory === 'wire_cutters') {
            this.wiresCut = true;
            if (this.wires) this.wires.visible = false;
            audio.playItemPickup();
            if (game && game.showAlert) game.showAlert('✂️ ALARM WIRES SNIPPED WITH WIRE CUTTERS!');
            if (game && game.updateObjective) game.updateObjective('Alarm disarmed ✓ | Find Padlock Key');
          } else {
            if (game && game.showAlert) game.showAlert('⚠️ ALARM WIRES ACTIVE! NEED WIRE CUTTERS!');
          }
          return;
        }

        if (!this.padlockRemoved) {
          if (player.inventory === 'padlock_key') {
            this.padlockRemoved = true;
            if (this.padlock) this.padlock.visible = false;
            player.consumeItem();
            audio.playItemPickup();
            if (game && game.showAlert) game.showAlert('🗝️ HEAVY PADLOCK UNLOCKED!');
            if (game && game.updateObjective) game.updateObjective('ESCAPE THROUGH THE FRONT DOOR!');
          } else {
            if (game && game.showAlert) game.showAlert('🔒 HEAVY PADLOCK LOCKED! NEED PADLOCK KEY!');
          }
          return;
        }

        // All 3 disarmed -> Escape!
        this.isOpen = true;
        if (game && game.triggerVictory) game.triggerVictory();
      }
    };

    return this.exitDoor;
  }

  createBasementEntrance(x, z) {
    // Basement Door
    const bDoor = this.createDoor(x, z, 0, 'basement_door', 'Basement Door', true, 'crowbar');

    // Basement Stairs
    for (let i = 0; i < 12; i++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 0.35, 0.6),
        this.basementFloorMat
      );
      step.position.set(x, -i * 0.35, z + 1.2 + i * 0.6);
      this.scene.add(step);
    }
  }

  createFurniture() {
    // 1. MASTER BEDROOM: Bed (Hide Spot)
    this.createBed(-14, -8, 'bed_master');

    // Wardrobe (Hide Spot)
    this.createWardrobe(-17, -4, 0, 'wardrobe_master');

    // Bedside Table + Drawer
    this.createTableWithDrawer(-9, -11, 'drawer_bedroom');

    // 2. BATHROOM: Bathtub
    const tub = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.9, 1.1),
      new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.3 })
    );
    tub.position.set(0, 0.45, -12);
    this.scene.add(tub);

    // 3. LIVING ROOM: Large Dining Table (Hide Spot)
    this.createDiningTable(-10, 8, 'table_living');

    // Old Rotting Sofa
    const sofa = new THREE.Mesh(
      new THREE.BoxGeometry(3.0, 1.1, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x3d2020, roughness: 0.9 })
    );
    sofa.position.set(-15, 0.55, 6);
    this.scene.add(sofa);

    // 4. KITCHEN: Counter + Kitchen Drawer
    this.createTableWithDrawer(12, 10, 'drawer_kitchen');

    // 5. BASEMENT: Electrical Fusebox
    this.createFuseBox(14, -2.2, 10);
  }

  createBed(x, z, id) {
    const bedGroup = new THREE.Group();
    bedGroup.position.set(x, 0, z);

    // Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 3.4), this.furnitureWoodMat);
    frame.position.set(0, 0.4, 0);
    bedGroup.add(frame);

    // Mattress & Sheets
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.4, 3.2),
      new THREE.MeshStandardMaterial({ color: 0x8a7a6a, roughness: 0.9 })
    );
    mattress.position.set(0, 0.7, 0);
    bedGroup.add(mattress);

    this.scene.add(bedGroup);

    // Hiding spot marker
    this.hidingSpots.push({
      mesh: frame,
      id,
      type: 'hiding_spot',
      label: 'Hide Under Bed',
      hidePosition: new THREE.Vector3(x, 0.35, z),
      exitPosition: new THREE.Vector3(x + 1.8, 1.7, z),
      interact(player) {
        player.toggleHiding(this);
      }
    });
  }

  createWardrobe(x, z, rotY, id) {
    const wardMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.8, 1.0),
      this.furnitureWoodMat
    );
    wardMesh.position.set(x, 1.4, z);
    wardMesh.rotation.y = rotY;
    this.scene.add(wardMesh);

    this.hidingSpots.push({
      mesh: wardMesh,
      id,
      type: 'hiding_spot',
      label: 'Hide Inside Wardrobe',
      hidePosition: new THREE.Vector3(x, 1.4, z),
      exitPosition: new THREE.Vector3(x + (rotY === 0 ? 0 : 1.4), 1.7, z + (rotY === 0 ? 1.4 : 0)),
      interact(player) {
        player.toggleHiding(this);
      }
    });
  }

  createDiningTable(x, z, id) {
    const tableGroup = new THREE.Group();
    tableGroup.position.set(x, 0, z);

    // Tabletop
    const top = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.15, 2.2), this.furnitureWoodMat);
    top.position.set(0, 1.2, 0);
    tableGroup.add(top);

    // 4 Legs
    const legGeo = new THREE.BoxGeometry(0.15, 1.2, 0.15);
    const p1 = new THREE.Mesh(legGeo, this.furnitureWoodMat); p1.position.set(-1.8, 0.6, -0.9); tableGroup.add(p1);
    const p2 = new THREE.Mesh(legGeo, this.furnitureWoodMat); p2.position.set(1.8, 0.6, -0.9); tableGroup.add(p2);
    const p3 = new THREE.Mesh(legGeo, this.furnitureWoodMat); p3.position.set(-1.8, 0.6, 0.9); tableGroup.add(p3);
    const p4 = new THREE.Mesh(legGeo, this.furnitureWoodMat); p4.position.set(1.8, 0.6, 0.9); tableGroup.add(p4);

    this.scene.add(tableGroup);

    this.hidingSpots.push({
      mesh: top,
      id,
      type: 'hiding_spot',
      label: 'Duck Under Table',
      hidePosition: new THREE.Vector3(x, 0.5, z),
      exitPosition: new THREE.Vector3(x + 2.5, 1.7, z),
      interact(player) {
        player.toggleHiding(this);
      }
    });
  }

  createTableWithDrawer(x, z, drawerId) {
    const tableMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.1, 1.0),
      this.furnitureWoodMat
    );
    tableMesh.position.set(x, 0.55, z);
    this.scene.add(tableMesh);

    // Drawer box
    const drawerMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.35, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x24150c })
    );
    drawerMesh.position.set(x, 0.75, z + 0.1);
    this.scene.add(drawerMesh);

    this.drawers.push({
      mesh: drawerMesh,
      id: drawerId,
      type: 'drawer',
      isOpen: false,
      origZ: z + 0.1,
      targetZ: z + 0.6,
      interact() {
        this.isOpen = !this.isOpen;
        this.mesh.position.z = this.isOpen ? this.targetZ : this.origZ;
        audio.playDoorCreak();
      }
    });
  }

  createFuseBox(x, y, z) {
    const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 1.1, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 })
    );
    boxMesh.position.set(x, y, z);
    this.scene.add(boxMesh);

    this.fuseBox = {
      mesh: boxMesh,
      type: 'fusebox',
      hasFuse: false,
      interact(player) {
        if (this.hasFuse) {
          game.showAlert('⚡ FUSE IS ALREADY INSTALLED AND HUMMING!');
          return;
        }
        if (player.inventory === 'fuse') {
          this.hasFuse = true;
          player.consumeItem();
          audio.playFlashlightClick();
          game.showAlert('⚡ FUSE INSTALLED! POWER RESTORED TO FRONT ALARM!');
          game.updateObjective('Power restored ✓ | Use Wire Cutters on Front Door');
        } else {
          game.showAlert('⚠️ MAIN FUSE MISSING! FIND THE FUSE IN THE KITCHEN!');
        }
      }
    };
  }

  createPuzzleInteractables() {
    // 1. Bedroom Key (Placed on bedside table)
    this.createItem(-9, 1.25, -11, 'bedroom_key', 'Bedroom Key', 0xffd966, 'key');

    // 2. Crowbar (Hidden in bathroom)
    this.createItem(0, 0.4, -13, 'crowbar', 'Heavy Crowbar', 0xcc2222, 'tool');

    // 3. Electrical Fuse (In kitchen counter)
    this.createItem(12, 1.2, 10, 'fuse', 'Electrical Fuse', 0x70f3ff, 'fuse');

    // 4. Wire Cutters (In basement)
    this.createItem(11, -3.8, 11, 'wire_cutters', 'Wire Cutters', 0xff5555, 'tool');

    // 5. Padlock Key (Hidden in living room)
    this.createItem(-15, 0.8, 9, 'padlock_key', 'Heavy Padlock Key', 0xddbb55, 'key');

    // 6. Flashlight Battery (In storage room)
    this.createItem(12, 0.4, -10, 'battery', 'Flashlight Battery', 0x66ff66, 'battery');
  }

  createItem(x, y, z, id, name, color, itemType) {
    let geo;
    if (itemType === 'key') geo = new THREE.TorusGeometry(0.08, 0.03, 8, 16);
    else if (itemType === 'tool') geo = new THREE.CylinderGeometry(0.04, 0.04, 0.8);
    else if (itemType === 'fuse') geo = new THREE.CylinderGeometry(0.06, 0.06, 0.25);
    else geo = new THREE.CylinderGeometry(0.05, 0.05, 0.18);

    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color,
      roughness: 0.3,
      metalness: 0.8,
      emissive: color,
      emissiveIntensity: 0.25
    }));
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    this.scene.add(mesh);

    const itemObj = {
      mesh,
      id,
      name,
      itemType,
      type: 'item',
      isPicked: false,
      interact(player) {
        if (this.itemType === 'battery') {
          player.battery = Math.min(100, player.battery + 50);
          this.mesh.visible = false;
          this.isPicked = true;
          audio.playItemPickup();
          game.showAlert('🔋 BATTERY CHARGED +50%!');
          return;
        }

        if (player.inventory) {
          game.showAlert(`✋ HANDS FULL! CARRYING ${player.inventoryName}. [G] TO DROP.`);
          return;
        }

        player.pickItem(this.id, this.name);
        this.mesh.visible = false;
        this.isPicked = true;
        audio.playItemPickup();
        game.showAlert(`🎒 PICKED UP ${this.name.toUpperCase()}!`);
      }
    };

    this.items.push(itemObj);
    return itemObj;
  }

  createAtmosphericLights() {
    // Dim creepy ambient light
    const ambient = new THREE.AmbientLight(0x100a0a, 0.35);
    this.scene.add(ambient);

    // Flickering hallway wall sconce
    const sconceLight = new THREE.PointLight(0xffaa55, 0.8, 10);
    sconceLight.position.set(-6, 2.5, 0);
    this.scene.add(sconceLight);
    this.sconceLight = sconceLight;

    // Kitchen dim light
    const kitchenLight = new THREE.PointLight(0x7788aa, 0.4, 9);
    kitchenLight.position.set(9, 2.6, 8);
    this.scene.add(kitchenLight);

    // Basement green damp light
    const basementLight = new THREE.PointLight(0x44aa66, 0.5, 8);
    basementLight.position.set(8, -2.5, 6);
    this.scene.add(basementLight);
  }

  update(time) {
    // Sconce flicker
    if (this.sconceLight) {
      this.sconceLight.intensity = 0.6 + Math.sin(time * 12) * 0.15 + (Math.random() < 0.05 ? -0.4 : 0);
    }

    // Gentle float on items
    for (const it of this.items) {
      if (!it.isPicked) {
        it.mesh.rotation.y += 0.02;
      }
    }

    // Smooth door swings
    for (const d of this.doors) {
      d.currentAngle += (d.targetAngle - d.currentAngle) * 0.12;
      d.group.rotation.y = d.currentAngle;
    }
  }
}

// --- 5. THE SMILING HORROR ENTITY (KEEPER AI) ---
class KeeperAI {
  constructor(scene, house) {
    this.scene = scene;
    this.house = house;
    this.state = 'PATROL'; // PATROL, INVESTIGATE, DETECT, CHASE, SEARCH, ATTACK, RECOVERY
    this.pos = new THREE.Vector3(-14, 0, 10); // Spawns downstairs in Living Room
    this.velocity = new THREE.Vector3();
    this.speed = 3.2;
    this.rotation = 0;
    this.alive = true;

    // Attack System Properties
    this.attackDistance = 2.1;
    this.attackCooldownTimer = 0;
    this.recoveryTimer = 0;
    this.isAttacking = false;
    this.attackAnimTimer = 0;
    this.attackHitRegistered = false;

    // Timers & Senses
    this.investigateTimer = 0;
    this.searchTimer = 0;
    this.lastKnownPlayerPos = new THREE.Vector3();
    this.hadLineOfSightWhenHid = false;
    this.footstepTimer = 0;
    this.headTwitchTimer = 0;
    this.headTwitchTarget = 0;

    // Waypoint Navigation Graph (All rooms & doorways connected)
    this.initWaypoints();
    this.currentWpIndex = 0;
    this.targetPos = this.waypoints[0].pos.clone();

    this.createMesh();
    console.log('[KEEPER AI] Initialized 3D Smiling Horror Entity at', this.pos);
  }

  initWaypoints() {
    this.waypoints = [
      { id: 'living_inside',     pos: new THREE.Vector3(-14, 0, 8),   neighbors: ['living_doorway', 'living_exit'] },
      { id: 'living_doorway',    pos: new THREE.Vector3(-10, 0, 2),   neighbors: ['living_inside', 'hallway_west'] },
      { id: 'living_exit',       pos: new THREE.Vector3(-10, 0, 11),  neighbors: ['living_inside'] },
      { id: 'hallway_west',      pos: new THREE.Vector3(-6, 0, 0),    neighbors: ['living_doorway', 'bedroom_doorway', 'hallway_center'] },
      { id: 'bedroom_doorway',   pos: new THREE.Vector3(-6, 0, -6.5), neighbors: ['hallway_west', 'bedroom_inside'] },
      { id: 'bedroom_inside',    pos: new THREE.Vector3(-12, 0, -8),  neighbors: ['bedroom_doorway'] },
      { id: 'hallway_center',    pos: new THREE.Vector3(0, 0, 0),     neighbors: ['hallway_west', 'hallway_east', 'bathroom_doorway', 'kitchen_doorway'] },
      { id: 'bathroom_doorway',  pos: new THREE.Vector3(4, 0, -6.5),  neighbors: ['hallway_center', 'bathroom_inside'] },
      { id: 'bathroom_inside',   pos: new THREE.Vector3(0, 0, -9),    neighbors: ['bathroom_doorway'] },
      { id: 'kitchen_doorway',   pos: new THREE.Vector3(1, 0, 2),     neighbors: ['hallway_center', 'kitchen_inside'] },
      { id: 'kitchen_inside',    pos: new THREE.Vector3(9, 0, 8),     neighbors: ['kitchen_doorway'] },
      { id: 'hallway_east',      pos: new THREE.Vector3(10, 0, 0),    neighbors: ['hallway_center', 'storage_doorway', 'basement_stairs'] },
      { id: 'storage_doorway',   pos: new THREE.Vector3(5, 0, -4),    neighbors: ['hallway_east', 'storage_inside'] },
      { id: 'storage_inside',    pos: new THREE.Vector3(12, 0, -8),   neighbors: ['storage_doorway'] },
      { id: 'basement_stairs',   pos: new THREE.Vector3(11, 0, -1),   neighbors: ['hallway_east', 'basement_inside'] },
      { id: 'basement_inside',   pos: new THREE.Vector3(8, -4, 6),    neighbors: ['basement_stairs'] },
    ];

    this.patrolRoute = [
      'living_inside', 'living_doorway', 'hallway_west', 'bedroom_doorway',
      'hallway_west', 'hallway_center', 'bathroom_doorway', 'bathroom_inside',
      'bathroom_doorway', 'hallway_center', 'kitchen_doorway', 'kitchen_inside',
      'kitchen_doorway', 'hallway_center', 'hallway_east', 'storage_doorway',
      'storage_inside', 'storage_doorway', 'hallway_east', 'basement_stairs',
      'basement_inside', 'basement_stairs', 'hallway_east', 'hallway_center'
    ];
    this.patrolIndex = 0;
  }

  getWaypointById(id) {
    return this.waypoints.find(w => w.id === id);
  }

  getNearestWaypoint(pos) {
    let nearest = this.waypoints[0];
    let minDist = Infinity;
    for (const wp of this.waypoints) {
      const d = pos.distanceTo(wp.pos);
      if (d < minDist) {
        minDist = d;
        nearest = wp;
      }
    }
    return nearest;
  }

  findShortestPath(startWp, endWp) {
    if (startWp.id === endWp.id) return [startWp];
    const queue = [[startWp]];
    const visited = new Set([startWp.id]);

    while (queue.length > 0) {
      const path = queue.shift();
      const curr = path[path.length - 1];

      for (const nbrId of curr.neighbors) {
        const nbr = this.getWaypointById(nbrId);
        if (!nbr) continue;
        if (nbr.id === endWp.id) {
          return path.concat(nbr);
        }
        if (!visited.has(nbr.id)) {
          visited.add(nbr.id);
          queue.push(path.concat(nbr));
        }
      }
    }
    return [startWp];
  }

  createMesh() {
    this.mesh = new THREE.Group();

    // 1. Spine / Torso Group (Lanky, slightly hunched forward)
    this.spine = new THREE.Group();
    this.spine.position.y = 1.05;
    this.mesh.add(this.spine);

    // Torso with Hospital/Asylum Shirt Texture
    const shirtTex = TextureFactory.createHospitalShirtTexture();
    const torsoMat = new THREE.MeshStandardMaterial({
      map: shirtTex,
      roughness: 0.85,
      metalness: 0.05
    });
    this.torso = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.88, 0.32), torsoMat);
    this.torso.position.y = 0.44;
    this.torso.castShadow = true;
    this.spine.add(this.torso);

    // Shirt Collars (V-Neck / Lapels)
    const collarMat = new THREE.MeshStandardMaterial({ color: 0xd4ceca, roughness: 0.8 });
    const collarL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.04), collarMat);
    collarL.position.set(-0.14, 0.86, 0.16);
    collarL.rotation.z = -0.4;
    this.spine.add(collarL);

    const collarR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.04), collarMat);
    collarR.position.set(0.14, 0.86, 0.16);
    collarR.rotation.z = 0.4;
    this.spine.add(collarR);

    // 2. Neck
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd0c4c0, roughness: 0.7 });
    this.neck = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.22, 10), skinMat);
    this.neck.position.y = 0.96;
    this.spine.add(this.neck);

    // 3. Head Group (Featuring the exact smiling entity reference appearance)
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.15, 0.04);
    this.spine.add(this.headGroup);

    // Head Base with Custom Smiling Face Texture
    const faceTex = TextureFactory.createSmilingEntityFaceTexture();
    const headMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.65,
      metalness: 0.05
    });
    this.headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), headMat);
    this.headMesh.castShadow = true;
    this.headGroup.add(this.headMesh);

    // Physical 3D Bulging Eyeballs (Protruding forward with eerie intense gleam)
    const eyeWhiteMat = new THREE.MeshStandardMaterial({
      color: 0xfafafa,
      roughness: 0.1,
      metalness: 0.1
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const createEyeball = (x) => {
      const eyeGrp = new THREE.Group();
      eyeGrp.position.set(x, 0.06, 0.27);

      const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.088, 16, 16), eyeWhiteMat);
      eyeGrp.add(sclera);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 12), pupilMat);
      pupil.position.set(0, 0, 0.08);
      eyeGrp.add(pupil);

      const glint = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 8), glintMat);
      glint.position.set(0.018, 0.02, 0.088);
      eyeGrp.add(glint);

      return eyeGrp;
    };

    this.eyeL = createEyeball(-0.11);
    this.eyeR = createEyeball(0.11);
    this.headGroup.add(this.eyeL);
    this.headGroup.add(this.eyeR);

    // Metallic Piercing Studs on Outer Cheekbones / Eyebrows
    const piercingMat = new THREE.MeshStandardMaterial({
      color: 0xd8d8e8,
      metalness: 0.95,
      roughness: 0.15
    });
    const studL = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), piercingMat);
    studL.position.set(-0.25, 0.05, 0.2);
    this.headGroup.add(studL);

    const studR = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 10), piercingMat);
    studR.position.set(0.25, 0.05, 0.2);
    this.headGroup.add(studR);

    // Shaggy Dark Emo/Asylum Hair Strands (Over crown and forehead bangs)
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x0c0a0e, roughness: 0.95 });
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.33, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.52), hairMat);
    hairCap.position.y = 0.05;
    this.headGroup.add(hairCap);

    // Jagged bangs strands hanging down over forehead
    for (let i = -3; i <= 3; i++) {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.22, 5), hairMat);
      bang.position.set(i * 0.065, 0.16, 0.29);
      bang.rotation.x = Math.PI + (Math.random() - 0.5) * 0.2;
      bang.rotation.z = (Math.random() - 0.5) * 0.3;
      this.headGroup.add(bang);
    }

    // Articulated Lower Jaw (Drops open into a terrifying bite/screech during attacks)
    this.jaw = new THREE.Group();
    this.jaw.position.set(0, -0.16, 0.18);
    const jawMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.16), skinMat);
    this.jaw.add(jawMesh);
    this.headGroup.add(this.jaw);

    // 4. Lanky Arms with Elongated Clawed Hands & Rusted Cleaver
    const sleeveMat = new THREE.MeshStandardMaterial({ color: 0xe0dad2, roughness: 0.85 });
    const cleaverMat = new THREE.MeshStandardMaterial({ color: 0x3d2c2c, metalness: 0.8, roughness: 0.4 });
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x2e1a12, roughness: 0.8 });

    // Left Arm (Reaching Claw)
    this.armL = new THREE.Group();
    this.armL.position.set(-0.35, 0.8, 0);
    const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.48, 8), sleeveMat);
    sleeveL.position.y = -0.24;
    this.armL.add(sleeveL);

    this.forearmL = new THREE.Group();
    this.forearmL.position.set(0, -0.48, 0);
    const armSkinL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.5, 8), skinMat);
    armSkinL.position.y = -0.25;
    this.forearmL.add(armSkinL);

    // Clawed Hand with long pale fingers
    this.handL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.04), skinMat);
    this.handL.position.y = -0.56;
    this.forearmL.add(this.handL);
    this.armL.add(this.forearmL);
    this.spine.add(this.armL);

    // Right Arm (Armed with Blood-Stained Heavy Cleaver)
    this.armR = new THREE.Group();
    this.armR.position.set(0.35, 0.8, 0);
    const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.48, 8), sleeveMat);
    sleeveR.position.y = -0.24;
    this.armR.add(sleeveR);

    this.forearmR = new THREE.Group();
    this.forearmR.position.set(0, -0.48, 0);
    const armSkinR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.5, 8), skinMat);
    armSkinR.position.y = -0.25;
    this.forearmR.add(armSkinR);

    // Weapon: Heavy Rusted Meat Cleaver
    this.weapon = new THREE.Group();
    this.weapon.position.set(0, -0.55, 0.12);
    this.weapon.rotation.x = Math.PI * 0.4;

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.026, 0.22, 6), handleMat);
    handle.position.y = 0;
    this.weapon.add(handle);

    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.36, 0.018), cleaverMat);
    blade.position.set(0, 0.22, 0);
    this.weapon.add(blade);

    // Blood edge on blade
    const bloodEdge = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.34, 0.022),
      new THREE.MeshStandardMaterial({ color: 0x8a0b0b, roughness: 0.3 })
    );
    bloodEdge.position.set(0.04, 0.22, 0);
    this.weapon.add(bloodEdge);

    this.forearmR.add(this.weapon);
    this.armR.add(this.forearmR);
    this.spine.add(this.armR);

    // 5. Lanky Legs with Dark Trousers & Worn Boots
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1f1a1d, roughness: 0.9 });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x110f11, roughness: 0.8 });

    // Left Leg
    this.legL = new THREE.Group();
    this.legL.position.set(-0.16, 0, 0);
    const legMeshL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.95, 8), pantsMat);
    legMeshL.position.y = -0.48;
    this.legL.add(legMeshL);

    const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.26), bootMat);
    bootL.position.set(0, -0.95, 0.05);
    this.legL.add(bootL);
    this.spine.add(this.legL);

    // Right Leg
    this.legR = new THREE.Group();
    this.legR.position.set(0.16, 0, 0);
    const legMeshR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.95, 8), pantsMat);
    legMeshR.position.y = -0.48;
    this.legR.add(legMeshR);

    const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.26), bootMat);
    bootR.position.set(0, -0.95, 0.05);
    this.legR.add(bootR);
    this.spine.add(this.legR);

    this.mesh.position.copy(this.pos);
    this.scene.add(this.mesh);
  }

  update(dt, player, diffSettings) {
    if (!this.alive) return;

    // Cooldown timers
    if (this.attackCooldownTimer > 0) this.attackCooldownTimer -= dt;

    const dx = player.camera.position.x - this.pos.x;
    const dz = player.camera.position.z - this.pos.z;
    const distToPlayer = Math.sqrt(dx * dx + dz * dz);

    // Update Proximity Accelerating Heartbeat
    audio.updateHeartbeat(distToPlayer);

    // 1. Line of Sight & Detection
    const canSeePlayer = this.checkLineOfSight(player, diffSettings);

    if (canSeePlayer && !player.isHiding && player.alive) {
      if (this.state !== 'CHASE' && this.state !== 'ATTACK' && this.state !== 'RECOVERY') {
        this.state = 'CHASE';
        audio.playEnemyDetection();
        audio.playJumpscareStinger();
        game.setBloodVignette(0.7);
        game.showAlert('⚠️ SHE SAW YOU! THE SMILING ENTITY IS CHASING!');
        console.log('[KEEPER AI] Player detected! Entering CHASE state.');
      }
      this.lastKnownPlayerPos.copy(player.camera.position);
      this.targetPos.copy(player.camera.position);
    } else if (this.state === 'CHASE' && !this.isAttacking) {
      // Lost sight -> switch to SEARCH
      this.state = 'SEARCH';
      this.searchTimer = 6.0;
      this.targetPos.copy(this.lastKnownPlayerPos);
      console.log('[KEEPER AI] Lost sight of player. Searching last known position.');
    }

    // 2. Handle Hiding Player
    if (player.isHiding) {
      if (this.hadLineOfSightWhenHid) {
        // She saw you hide! Marches to hiding spot to rip you out!
        if (player.hidingSpot) {
          this.targetPos.copy(player.hidingSpot.position);
          const distToSpot = this.pos.distanceTo(player.hidingSpot.position);
          if (distToSpot < 1.8) {
            player.exitHiding();
            audio.playEnemyDetection();
            game.showAlert('😱 SHE FOUND YOUR HIDING SPOT!');
            this.initiateAttack(player, diffSettings);
          }
        }
      } else if (this.state === 'CHASE') {
        this.state = 'SEARCH';
        this.searchTimer = 5.0;
        this.targetPos.copy(this.lastKnownPlayerPos);
      }
    }
    this.hadLineOfSightWhenHid = canSeePlayer && !player.isHiding;

    // 3. State Behavior & Pathfinding
    let currentSpeed = diffSettings.keeperSpeed;

    if (this.state === 'PATROL') {
      const distToWp = this.pos.distanceTo(this.targetPos);
      if (distToWp < 1.1) {
        this.patrolIndex = (this.patrolIndex + 1) % this.patrolRoute.length;
        const nextWpId = this.patrolRoute[this.patrolIndex];
        const nextWp = this.getWaypointById(nextWpId);
        if (nextWp) this.targetPos.copy(nextWp.pos);
      }
    } else if (this.state === 'SEARCH') {
      this.searchTimer -= dt;
      const distToSearch = this.pos.distanceTo(this.targetPos);
      if (distToSearch < 1.2 || this.searchTimer <= 0) {
        this.state = 'PATROL';
        game.setBloodVignette(0);
        const nearest = this.getNearestWaypoint(this.pos);
        this.targetPos.copy(nearest.pos);
        console.log('[KEEPER AI] Search finished without spotting player. Returning to PATROL.');
      }
    } else if (this.state === 'INVESTIGATE') {
      this.investigateTimer -= dt;
      const distToNoise = this.pos.distanceTo(this.targetPos);
      if (distToNoise < 1.2 || this.investigateTimer <= 0) {
        this.state = 'PATROL';
        const nearest = this.getNearestWaypoint(this.pos);
        this.targetPos.copy(nearest.pos);
        console.log('[KEEPER AI] Finished investigating noise. Returning to PATROL.');
      }
    } else if (this.state === 'CHASE') {
      currentSpeed = diffSettings.keeperChaseSpeed;

      // If direct line to player is blocked by walls, route through doorway waypoints!
      if (!canSeePlayer) {
        const startWp = this.getNearestWaypoint(this.pos);
        const endWp = this.getNearestWaypoint(this.targetPos);
        const path = this.findShortestPath(startWp, endWp);
        if (path.length > 1) {
          this.targetPos.copy(path[1].pos);
        }
      }
    } else if (this.state === 'RECOVERY') {
      currentSpeed = diffSettings.keeperSpeed * 0.35; // Slower during recovery
      this.recoveryTimer -= dt;
      if (this.recoveryTimer <= 0) {
        this.state = canSeePlayer ? 'CHASE' : 'SEARCH';
        console.log('[KEEPER AI] Attack recovery complete. Resuming', this.state);
      }
    }

    // 4. Attack Check (Only within range, facing, line of sight, and not on cooldown)
    if (distToPlayer <= this.attackDistance && !player.isHiding && player.alive) {
      if (!this.isAttacking && this.attackCooldownTimer <= 0 && this.state !== 'RECOVERY') {
        const facingDot = this.getFacingDotTo(player.camera.position);
        if (facingDot > 0.15 && this.checkLineOfSight(player, diffSettings, true)) {
          this.initiateAttack(player, diffSettings);
        }
      }
    }

    // 5. Attack Execution Window
    if (this.isAttacking) {
      this.attackAnimTimer -= dt;

      // Mid-swing hit registration (Damage applies exactly during the forward strike window)
      if (this.attackAnimTimer <= 0.32 && !this.attackHitRegistered) {
        if (distToPlayer <= this.attackDistance + 0.5 && this.checkLineOfSight(player, diffSettings, true)) {
          this.attackHitRegistered = true;
          player.takeDamage(diffSettings.keeperDamage);
          console.log(`[KEEPER AI] Hit landed! Dealt ${diffSettings.keeperDamage} damage to player.`);
        }
      }

      if (this.attackAnimTimer <= 0) {
        this.isAttacking = false;
        this.state = 'RECOVERY';
        this.recoveryTimer = diffSettings.keeperRecovery;
        this.attackCooldownTimer = diffSettings.keeperCooldown;
      }
    }

    // 6. Movement & Wall Collision Avoidance (Whiskers)
    if (!this.isAttacking) {
      const moveDir = new THREE.Vector3().subVectors(this.targetPos, this.pos);
      moveDir.y = 0;

      if (moveDir.length() > 0.25) {
        moveDir.normalize();

        // Forward wall whisker obstacle avoidance
        const adjustedDir = this.steerAroundObstacles(moveDir);

        this.pos.addScaledVector(adjustedDir, currentSpeed * dt);
        this.rotation = Math.atan2(adjustedDir.x, adjustedDir.z);

        // Footstep audio trigger
        this.footstepTimer += dt * currentSpeed;
        if (this.footstepTimer > 1.8) {
          this.footstepTimer = 0;
          audio.playFootstep(true);
        }
      }
    }

    // 7. Update Transform & Procedural Skeletal Animations
    this.mesh.position.copy(this.pos);
    this.mesh.rotation.y = this.rotation;
    this.animateSkeletalMotion(dt, currentSpeed);
  }

  steerAroundObstacles(moveDir) {
    // Cast center, left, and right whiskers to avoid doors and furniture
    const origin = new THREE.Vector3(this.pos.x, 1.0, this.pos.z);
    const wallMeshes = this.house.walls.map(w => w.mesh);

    const centerRay = new THREE.Raycaster(origin, moveDir, 0.2, 0.85);
    const hits = centerRay.intersectObjects(wallMeshes);

    if (hits.length > 0) {
      // Center blocked -> test whiskers
      const leftDir = moveDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.55);
      const rightDir = moveDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -0.55);

      const leftHits = new THREE.Raycaster(origin, leftDir, 0.2, 0.85).intersectObjects(wallMeshes);
      const rightHits = new THREE.Raycaster(origin, rightDir, 0.2, 0.85).intersectObjects(wallMeshes);

      if (leftHits.length === 0) return leftDir;
      if (rightHits.length === 0) return rightDir;
    }
    return moveDir;
  }

  getFacingDotTo(target) {
    const forward = new THREE.Vector3(Math.sin(this.rotation), 0, Math.cos(this.rotation));
    const toTarget = new THREE.Vector3().subVectors(target, this.pos);
    toTarget.y = 0;
    toTarget.normalize();
    return forward.dot(toTarget);
  }

  initiateAttack(player, diffSettings) {
    this.isAttacking = true;
    this.attackAnimTimer = 0.52;
    this.attackHitRegistered = false;
    this.state = 'ATTACK';
    audio.playEnemyAttack();
    console.log('[KEEPER AI] ATTACK INITIATED! Swinging cleaver.');
  }

  animateSkeletalMotion(dt, currentSpeed) {
    const time = Date.now() * 0.001;

    // Erratic Head Twitch (Horror flavor)
    this.headTwitchTimer -= dt;
    if (this.headTwitchTimer <= 0) {
      this.headTwitchTimer = 2.5 + Math.random() * 3.0;
      this.headTwitchTarget = (Math.random() - 0.5) * 0.6;
    }
    this.headGroup.rotation.z += (this.headTwitchTarget - this.headGroup.rotation.z) * 0.15;

    if (this.isAttacking) {
      // Violent Slash Attack Animation
      const progress = 1.0 - (this.attackAnimTimer / 0.52);
      this.spine.rotation.x = 0.35 + Math.sin(progress * Math.PI) * 0.25;
      // Cleaver arm lunges down with force
      this.armR.rotation.x = -1.6 + progress * 2.2;
      this.armL.rotation.x = -1.2 + progress * 1.5;
      // Horrifying Jaw Drops Open
      this.jaw.rotation.x = Math.sin(progress * Math.PI) * 0.55;
    } else if (this.state === 'RECOVERY') {
      // Drawing arms back slowly
      this.spine.rotation.x = 0.15;
      this.armR.rotation.x = -0.5;
      this.armL.rotation.x = -0.4;
      this.jaw.rotation.x = 0.05;
    } else if (this.state === 'CHASE') {
      // Aggressive Hunched Chase Sprint
      this.spine.rotation.x = 0.38;
      const sprintSpeed = currentSpeed * 1.8;
      this.legL.rotation.x = Math.sin(time * sprintSpeed) * 0.75;
      this.legR.rotation.x = -Math.sin(time * sprintSpeed) * 0.75;
      // Arms reaching forward to grab player
      this.armL.rotation.x = -1.35 + Math.sin(time * sprintSpeed) * 0.25;
      this.armR.rotation.x = -1.15 + Math.cos(time * sprintSpeed) * 0.25;
      this.jaw.rotation.x = 0.22 + (Math.random() < 0.15 ? 0.2 : 0);
    } else {
      // Creepy Lanky Stride (Patrol / Investigate / Search)
      this.spine.rotation.x = 0.12;
      const walkSpeed = currentSpeed * 1.4;
      this.legL.rotation.x = Math.sin(time * walkSpeed) * 0.48;
      this.legR.rotation.x = -Math.sin(time * walkSpeed) * 0.48;
      this.armL.rotation.x = -Math.sin(time * walkSpeed) * 0.45;
      this.armR.rotation.x = Math.sin(time * walkSpeed) * 0.45;
      this.jaw.rotation.x = 0;
      // Head scanning side to side
      this.headGroup.rotation.y = Math.sin(time * 1.6) * 0.35;
    }
  }

  checkLineOfSight(player, diffSettings, ignoreFov = false) {
    const toPlayer = new THREE.Vector3().subVectors(player.camera.position, this.pos);
    const dist = toPlayer.length();

    if (dist > diffSettings.keeperSightDist) return false;

    if (!ignoreFov) {
      const lookDir = new THREE.Vector3(Math.sin(this.rotation), 0, Math.cos(this.rotation));
      toPlayer.normalize();
      const angle = lookDir.angleTo(toPlayer);

      const effectiveFov = player.flashlightOn ? diffSettings.keeperFov * 1.4 : diffSettings.keeperFov;
      if (angle > effectiveFov / 2 && dist > 3.0) return false;
    }

    // Raycast wall occlusion check (Origin at keeper eyes, height 1.85m)
    const ray = new THREE.Raycaster(
      new THREE.Vector3(this.pos.x, 1.85, this.pos.z),
      new THREE.Vector3().subVectors(player.camera.position, new THREE.Vector3(this.pos.x, 1.85, this.pos.z)).normalize(),
      0.4,
      dist
    );
    const wallMeshes = this.house.walls.map(w => w.mesh);
    const hits = ray.intersectObjects(wallMeshes);

    return hits.length === 0;
  }

  hearNoise(pos, intensity = 1.0) {
    const dist = this.pos.distanceTo(pos);
    if (dist < 24 * intensity) {
      if (this.state !== 'CHASE' && this.state !== 'ATTACK') {
        this.state = 'INVESTIGATE';
        this.targetPos.copy(pos);
        this.investigateTimer = 7.5;
        audio.playDoorCreak();
        console.log('[KEEPER AI] Heard noise at', pos, 'entering INVESTIGATE.');
      }
    }
  }

  resetPosition() {
    this.pos.set(-14, 0, 10); // Living room spawn
    this.state = 'PATROL';
    this.patrolIndex = 0;
    this.targetPos.copy(this.waypoints[0].pos);
    this.isAttacking = false;
    this.attackCooldownTimer = 0;
    this.recoveryTimer = 0;
    this.searchTimer = 0;
    this.investigateTimer = 0;
    if (this.mesh) {
      this.mesh.position.copy(this.pos);
      this.mesh.rotation.y = 0;
    }
    console.log('[KEEPER AI] Reset position to Living Room and state to PATROL.');
  }
}

// --- 6. FIRST-PERSON PLAYER CONTROLLER ---
class PlayerController {
  constructor(camera, domElement, scene, house) {
    this.camera = camera;
    this.domElement = domElement;
    this.scene = scene;
    this.house = house;

    this.moveSpeed = 4.2;
    this.sprintSpeed = 7.2;
    this.crouchSpeed = 2.2;
    this.eyeHeight = 1.7;
    this.crouchHeight = 0.8;

    this.keys = {};
    this.velocity = new THREE.Vector3();
    this.isCrouching = false;
    this.isSprinting = false;
    this.isHiding = false;
    this.hidingSpot = null;
    this.alive = true;
    this.maxHealth = 100;
    this.health = 100;
    this.damageShake = 0;

    this.stamina = 100;
    this.battery = 100;
    this.flashlightOn = true;

    this.inventory = null;
    this.inventoryName = 'EMPTY';

    // Mouse look
    this.pitch = 0;
    this.yaw = 0;
    this.mouseSensitivity = 0.0022;

    this.setupFlashlight();
    this.bindControls();
  }

  setupFlashlight() {
    this.flashlight = new THREE.SpotLight(0xfffaed, 2.8, 18, Math.PI * 0.22, 0.45, 1.2);
    this.flashlight.position.set(0, 0, 0);
    this.flashlightTarget = new THREE.Object3D();
    this.scene.add(this.flashlightTarget);
    this.flashlight.target = this.flashlightTarget;
    this.camera.add(this.flashlight);
  }

  bindControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      if (e.code === 'KeyF') this.toggleFlashlight();
      if (e.code === 'KeyC') this.toggleCrouch();
      if (e.code === 'KeyE') this.interact();
      if (e.code === 'KeyG') this.dropItem();
      if (e.code === 'Escape') game.togglePause();
      if (e.code === 'Backquote' || e.code === 'KeyU') game.toggleDebug();
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    if (this.domElement && this.domElement.addEventListener) {
      this.domElement.addEventListener('click', () => {
        if (game && game.state === 'PLAYING' && !document.pointerLockElement) {
          if (this.domElement.requestPointerLock) this.domElement.requestPointerLock();
        }
      });
    }

    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === this.domElement && !this.isHiding) {
        this.yaw -= e.movementX * this.mouseSensitivity;
        this.pitch -= e.movementY * this.mouseSensitivity;
        this.pitch = Math.max(-Math.PI * 0.42, Math.min(Math.PI * 0.42, this.pitch));

        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;
      }
    });
  }

  toggleFlashlight() {
    this.flashlightOn = !this.flashlightOn;
    this.flashlight.visible = this.flashlightOn && this.battery > 0;
    audio.playFlashlightClick();
  }

  toggleCrouch() {
    this.isCrouching = !this.isCrouching;
    this.camera.position.y = this.isCrouching ? this.crouchHeight : this.eyeHeight;
  }

  toggleHiding(spot) {
    if (this.isHiding) {
      // Exit hiding
      this.isHiding = false;
      this.camera.position.copy(spot.exitPosition);
      document.getElementById('hidingBanner').style.display = 'none';
      game.showAlert('👁️ EXITED HIDING SPOT');
    } else {
      // Enter hiding
      this.isHiding = true;
      this.hidingSpot = spot;
      this.camera.position.copy(spot.hidePosition);
      document.getElementById('hidingBanner').style.display = 'block';
      game.showAlert('👁️ HIDING... STAY QUIET!');
    }
  }

  interact() {
    if (this.isHiding) {
      this.toggleHiding(this.hidingSpot);
      return;
    }

    // Center screen raycast
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    ray.far = 3.2;

    const interactiveObjects = [
      ...this.house.doors.map(d => d.mesh),
      ...this.house.items.filter(i => !i.isPicked).map(i => i.mesh),
      ...this.house.drawers.map(d => d.mesh),
      ...this.house.hidingSpots.map(h => h.mesh),
      this.house.exitDoor.group.children[0], // front exit door mesh
      this.house.fuseBox.mesh
    ];

    const hits = ray.intersectObjects(interactiveObjects);
    if (hits.length > 0) {
      const hitMesh = hits[0].object;

      // Find corresponding system object
      const door = this.house.doors.find(d => d.mesh === hitMesh);
      if (door) { door.interact(this); return; }

      const item = this.house.items.find(i => i.mesh === hitMesh);
      if (item) { item.interact(this); return; }

      const drawer = this.house.drawers.find(d => d.mesh === hitMesh);
      if (drawer) { drawer.interact(this); return; }

      const hide = this.house.hidingSpots.find(h => h.mesh === hitMesh);
      if (hide) { hide.interact(this); return; }

      if (this.house.fuseBox && this.house.fuseBox.mesh === hitMesh) {
        this.house.fuseBox.interact(this);
        return;
      }

      if (this.house.exitDoor) {
        this.house.exitDoor.interact(this);
        return;
      }
    }
  }

  pickItem(id, name) {
    this.inventory = id;
    this.inventoryName = name;
    document.getElementById('inventoryItem').innerText = name.toUpperCase();
  }

  consumeItem() {
    this.inventory = null;
    this.inventoryName = 'EMPTY';
    document.getElementById('inventoryItem').innerText = 'EMPTY';
  }

  dropItem() {
    if (!this.inventory) return;
    const droppedName = this.inventoryName;
    const droppedId = this.inventory;

    // Drop on floor in front of player
    const dropPos = this.camera.position.clone().add(this.getForwardVector().multiplyScalar(1.2));
    dropPos.y = 0.2;

    this.house.createItem(dropPos.x, dropPos.y, dropPos.z, droppedId, droppedName, 0xffffff, 'tool');
    this.consumeItem();

    audio.playDoorCreak();
    game.showAlert(`📦 DROPPED ${droppedName}! (MADE A NOISE)`);

    // Alert keeper to investigate dropped noise!
    if (game.keeper) game.keeper.hearNoise(dropPos, 1.2);
  }

  getForwardVector() {
    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyEuler(new THREE.Euler(0, this.yaw, 0, 'YXZ'));
    return dir;
  }

  getRightVector() {
    const dir = new THREE.Vector3(1, 0, 0);
    dir.applyEuler(new THREE.Euler(0, this.yaw, 0, 'YXZ'));
    return dir;
  }

  takeDamage(amount) {
    if (!this.alive) return;
    this.health = Math.max(0, this.health - amount);
    this.damageShake = 0.45;

    // Update HUD Health Bar
    const fill = document.getElementById('healthFill');
    const txt = document.getElementById('healthPercent');
    if (fill) fill.style.width = this.health + '%';
    if (txt) txt.innerText = Math.round(this.health) + ' HP';

    // Screen Blood Flash Effect
    const flash = document.getElementById('damageFlash');
    if (flash) {
      flash.style.opacity = '0.85';
      setTimeout(() => { if (flash) flash.style.opacity = '0'; }, 180);
    }

    audio.playPlayerHurt();
    game.showAlert(`🩸 THE SMILING ENTITY SLASHED YOU! -${amount} HP`);

    if (this.health <= 0) {
      this.alive = false;
      console.log('[GAME STATE] Player Health reached 0! Triggering Defeat.');
      // Dramatic camera collapse to floor
      this.camera.position.y = 0.35;
      this.pitch = -0.3;
      setTimeout(() => {
        game.triggerDayDefeat();
      }, 750);
    }
  }

  takeHit() {
    this.takeDamage(35);
  }

  resetHealth() {
    this.health = this.maxHealth;
    this.alive = true;
    this.damageShake = 0;
    const fill = document.getElementById('healthFill');
    const txt = document.getElementById('healthPercent');
    if (fill) fill.style.width = '100%';
    if (txt) txt.innerText = '100 HP';
    const flash = document.getElementById('damageFlash');
    if (flash) flash.style.opacity = '0';
  }

  resetPosition() {
    this.camera.position.set(-14, this.eyeHeight, -8); // Master bedroom bed
    this.yaw = 0;
    this.pitch = 0;
    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = 0;
    this.camera.rotation.x = 0;
    this.camera.rotation.z = 0;
    this.resetHealth();
    this.isHiding = false;
    const banner = document.getElementById('hidingBanner');
    if (banner) banner.style.display = 'none';
  }

  update(dt, diffSettings) {
    if (!this.alive || this.isHiding) return;

    // 1. Stamina & Sprinting
    this.isSprinting = this.keys['ShiftLeft'] && (this.keys['KeyW'] || this.keys['KeyS']);
    if (this.isSprinting && this.stamina > 0) {
      this.stamina = Math.max(0, this.stamina - diffSettings.staminaDrain * dt);
      if (this.stamina <= 0) this.isSprinting = false;
    } else {
      this.stamina = Math.min(100, this.stamina + diffSettings.staminaRecover * dt);
    }
    document.getElementById('staminaFill').style.width = this.stamina + '%';

    // 2. Battery Drain
    if (this.flashlightOn && this.battery > 0) {
      this.battery = Math.max(0, this.battery - diffSettings.batteryDrainRate * dt);
      if (this.battery <= 0) {
        this.flashlight.visible = false;
        game.showAlert('🔦 FLASHLIGHT BATTERY DIED!');
      }
    }
    document.getElementById('batteryFill').style.width = this.battery + '%';
    document.getElementById('batteryPercent').innerText = Math.round(this.battery) + '%';

    // 3. Movement
    const speed = this.isCrouching ? this.crouchSpeed : (this.isSprinting ? this.sprintSpeed : this.moveSpeed);
    const forward = this.getForwardVector();
    const right = this.getRightVector();

    const moveDir = new THREE.Vector3();
    if (this.keys['KeyW']) moveDir.add(forward);
    if (this.keys['KeyS']) moveDir.sub(forward);
    if (this.keys['KeyD']) moveDir.add(right);
    if (this.keys['KeyA']) moveDir.sub(right);

    if (moveDir.length() > 0) {
      moveDir.normalize();

      // Desired new position
      const newPos = this.camera.position.clone().addScaledVector(moveDir, speed * dt);

      // Wall collision check
      if (!this.checkWallCollision(newPos.x, newPos.z)) {
        this.camera.position.x = newPos.x;
        this.camera.position.z = newPos.z;
      }

      // Alert keeper if sprinting loudly
      if (this.isSprinting && game.keeper) {
        game.keeper.hearNoise(this.camera.position, 0.8);
      }
    }

    // Flashlight target follow camera forward
    const spotTargetPos = this.camera.position.clone().add(this.getForwardVector().multiplyScalar(10));
    this.flashlightTarget.position.copy(spotTargetPos);

    // Damage trauma camera shake
    if (this.damageShake > 0) {
      this.camera.rotation.order = 'YXZ';
      this.camera.rotation.z = (Math.random() - 0.5) * this.damageShake * 0.16;
      this.camera.rotation.x = this.pitch + (Math.random() - 0.5) * this.damageShake * 0.12;
      this.camera.rotation.y = this.yaw + (Math.random() - 0.5) * this.damageShake * 0.12;
      this.damageShake = Math.max(0, this.damageShake - dt * 2.2);
    } else {
      this.camera.rotation.z = 0;
    }

    // Crosshair Raycast Interaction Preview
    this.updateCrosshair();
  }

  checkWallCollision(nx, nz) {
    const pr = 0.45; // Player radius
    for (const w of this.house.walls) {
      if (nx + pr > w.minX && nx - pr < w.maxX && nz + pr > w.minZ && nz - pr < w.maxZ) {
        return true; // Collision!
      }
    }
    return false;
  }

  updateCrosshair() {
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    ray.far = 3.0;

    const interactiveObjects = [
      ...this.house.doors.map(d => d.mesh),
      ...this.house.items.filter(i => !i.isPicked).map(i => i.mesh),
      ...this.house.drawers.map(d => d.mesh),
      ...this.house.hidingSpots.map(h => h.mesh),
      this.house.fuseBox.mesh,
      this.house.exitDoor.group.children[0]
    ];

    const hits = ray.intersectObjects(interactiveObjects);
    const ch = document.getElementById('crosshair');
    const prompt = document.getElementById('interactPrompt');

    if (hits.length > 0) {
      ch.classList.add('active');
      prompt.style.display = 'block';

      const hitMesh = hits[0].object;
      const door = this.house.doors.find(d => d.mesh === hitMesh);
      if (door) prompt.innerText = `[E] ${door.isOpen ? 'Close' : 'Open'} ${door.label}`;

      const item = this.house.items.find(i => i.mesh === hitMesh);
      if (item) prompt.innerText = `[E] Pick up ${item.name}`;

      const hide = this.house.hidingSpots.find(h => h.mesh === hitMesh);
      if (hide) prompt.innerText = `[E] ${hide.label}`;

      const drawer = this.house.drawers.find(d => d.mesh === hitMesh);
      if (drawer) prompt.innerText = `[E] ${drawer.isOpen ? 'Close' : 'Search'} Drawer`;

      if (hitMesh === this.house.fuseBox.mesh) prompt.innerText = '[E] Fusebox';
      if (this.house.exitDoor && hitMesh === this.house.exitDoor.group.children[0]) prompt.innerText = '[E] Front Exit Door';
    } else {
      ch.classList.remove('active');
      prompt.style.display = 'none';
    }
  }
}

// --- 7. MAIN 3D HORROR GAME ORCHESTRATOR ---
class HauntedHouseGame {
  constructor() {
    game = this;
    if (typeof window !== 'undefined') window.game = this;
    this.canvas = document.getElementById('webglCanvas');
    this.state = 'TITLE'; // TITLE, PLAYING, DAY_TRANSITION, PAUSED, DEFEAT, VICTORY
    this.currentDay = 1;
    this.maxDays = 5;
    this.diffKey = 'normal';
    this.diffSettings = DIFFICULTIES.normal;
    this.startTime = 0;
    this.debugMode = false;

    this.initThree();
    this.house = new HouseBuilder(this.scene);
    this.house.buildHouse();

    this.player = new PlayerController(this.camera, this.canvas, this.scene, this.house);
    this.keeper = new KeeperAI(this.scene, this.house);

    this.bindDOM();
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x050406, 0.08); // Dense horror fog

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(-14, 1.7, -8);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  bindDOM() {
    const bind = (id, event, fn) => {
      const el = document.getElementById(id);
      if (el && el.addEventListener) el.addEventListener(event, fn);
    };

    // Difficulty Buttons
    if (document.querySelectorAll) {
      document.querySelectorAll('.diff-btn').forEach(btn => {
        if (btn && btn.addEventListener) {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.diffKey = btn.getAttribute ? btn.getAttribute('data-diff') : 'normal';
            this.diffSettings = DIFFICULTIES[this.diffKey];
            audio.init();
            audio.playFlashlightClick();
          });
        }
      });
    }

    // Menus
    bind('startBtn', 'click', () => this.startNewGame());
    bind('howToPlayBtn', 'click', () => {
      const modal = document.getElementById('controlsModal');
      if (modal) modal.style.display = 'flex';
      audio.init();
    });
    bind('closeControlsBtn', 'click', () => {
      const modal = document.getElementById('controlsModal');
      if (modal) modal.style.display = 'none';
    });

    bind('resumeBtn', 'click', () => this.togglePause());
    bind('restartGameBtn', 'click', () => this.startNewGame());
    bind('quitToTitleBtn', 'click', () => this.quitToTitle());

    bind('wakeUpBtn', 'click', () => this.wakeUpNextDay());
    bind('retryGameBtn', 'click', () => this.startNewGame());
    bind('defeatQuitBtn', 'click', () => this.quitToTitle());
    bind('playAgainBtn', 'click', () => this.startNewGame());
    bind('victoryQuitBtn', 'click', () => this.quitToTitle());

    // Mobile buttons
    const bindTouch = (id, action) => {
      const el = document.getElementById(id);
      if (!el || !el.addEventListener) return;
      el.addEventListener('pointerdown', (e) => { e.preventDefault(); action(); });
    };
    bindTouch('mBtnInteract', () => this.player.interact());
    bindTouch('mBtnFlashlight', () => this.player.toggleFlashlight());
    bindTouch('mBtnCrouch', () => this.player.toggleCrouch());
    bindTouch('mBtnSprint', () => {
      this.player.keys['ShiftLeft'] = !this.player.keys['ShiftLeft'];
    });
  }

  showAlert(text) {
    const el = document.getElementById('interactPrompt');
    if (!el) return;
    el.innerText = text;
    el.style.display = 'block';
    clearTimeout(this.alertTimeout);
    this.alertTimeout = setTimeout(() => { el.style.display = 'none'; }, 2600);
  }

  updateObjective(text) {
    document.getElementById('objectiveText').innerText = text;
  }

  setBloodVignette(opacity) {
    document.getElementById('bloodVignette').style.opacity = opacity;
  }

  startNewGame() {
    audio.init();
    this.currentDay = 1;
    this.startTime = Date.now();
    this.state = 'PLAYING';

    document.getElementById('titleScreen').style.display = 'none';
    document.getElementById('pauseScreen').style.display = 'none';
    document.getElementById('defeatScreen').style.display = 'none';
    document.getElementById('victoryScreen').style.display = 'none';
    document.getElementById('dayScreen').style.display = 'none';
    document.getElementById('hud').style.display = 'flex';

    document.getElementById('dayDisplay').innerText = 'DAY 1';
    this.updateObjective('Search bedroom drawer for Bedroom Key...');

    this.player.resetPosition();
    if (this.keeper) this.keeper.resetPosition();
    this.canvas.requestPointerLock();
  }

  triggerDayDefeat() {
    this.state = 'DAY_TRANSITION';
    document.exitPointerLock();

    this.currentDay++;
    if (this.currentDay > this.maxDays) {
      // Game Over
      this.state = 'DEFEAT';
      document.getElementById('defeatScreen').style.display = 'flex';
      return;
    }

    const dayText = document.getElementById('dayTitleText');
    const daySub = document.getElementById('daySubtext');
    dayText.innerText = `DAY ${this.currentDay}`;
    daySub.innerText = `She dragged you back to the room. ${this.maxDays - this.currentDay + 1} Days remain.`;
    document.getElementById('dayScreen').style.display = 'flex';
  }

  wakeUpNextDay() {
    document.getElementById('dayScreen').style.display = 'none';
    document.getElementById('dayDisplay').innerText = `DAY ${this.currentDay}`;
    this.setBloodVignette(0.25 * (this.currentDay - 1)); // Blood scars remain on screen!
    this.player.resetPosition();
    if (this.keeper) this.keeper.resetPosition();
    this.state = 'PLAYING';
    this.canvas.requestPointerLock();
  }

  triggerVictory() {
    this.state = 'VICTORY';
    document.exitPointerLock();
    audio.playVictoryChime();

    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;

    const stats = document.getElementById('victoryStats');
    stats.innerHTML = `
      DIFFICULTY    : <strong>${this.diffSettings.label}</strong><br>
      DAYS USED     : <strong>${this.currentDay} / ${this.maxDays}</strong><br>
      ESCAPE TIME   : <strong>${m}m ${s}s</strong><br>
      STATUS        : <strong>SURVIVED &amp; ESCAPED THE HOUSE!</strong>
    `;

    document.getElementById('victoryScreen').style.display = 'flex';
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      document.exitPointerLock();
      document.getElementById('pauseScreen').style.display = 'flex';
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      document.getElementById('pauseScreen').style.display = 'none';
      this.canvas.requestPointerLock();
    }
  }

  toggleDebug() {
    this.debugMode = !this.debugMode;
    const overlay = document.getElementById('debugOverlay');
    if (overlay) overlay.style.display = this.debugMode ? 'block' : 'none';
    console.log('[DEBUG] Monitor overlay toggled:', this.debugMode ? 'ON' : 'OFF');
  }

  updateDebugOverlay() {
    if (!this.keeper || !this.player) return;
    const k = this.keeper;
    const p = this.player;
    const dist = k.pos.distanceTo(p.camera.position);
    const los = k.checkLineOfSight(p, this.diffSettings);

    const setTxt = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.innerText = val;
    };

    setTxt('dbgEnemyState', k.state + (k.isAttacking ? ' [SLASHING]' : ''));
    setTxt('dbgPlayerHp', Math.round(p.health));
    setTxt('dbgDist', dist.toFixed(2));
    setTxt('dbgLos', los ? 'YES (VISIBLE)' : 'NO (OCCLUDED)');
    setTxt('dbgInAtkRange', dist <= k.attackDistance ? 'YES' : 'NO');
    setTxt('dbgAtkCooldown', k.attackCooldownTimer > 0 ? k.attackCooldownTimer.toFixed(1) + 's' : 'READY');
    setTxt('dbgTargetPos', `(${k.targetPos.x.toFixed(1)}, ${k.targetPos.z.toFixed(1)})`);
  }

  quitToTitle() {
    this.state = 'TITLE';
    document.exitPointerLock();
    document.getElementById('hud').style.display = 'none';
    document.getElementById('pauseScreen').style.display = 'none';
    document.getElementById('defeatScreen').style.display = 'none';
    document.getElementById('victoryScreen').style.display = 'none';
    document.getElementById('dayScreen').style.display = 'none';
    document.getElementById('titleScreen').style.display = 'flex';
  }

  update(dt, time) {
    if (this.state === 'PLAYING') {
      this.player.update(dt, this.diffSettings);
      this.keeper.update(dt, this.player, this.diffSettings);
      this.house.update(time);

      if (this.debugMode) {
        this.updateDebugOverlay();
      }
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

// Global Instances
let game = null;
const audio = new HorrorAudio();
let lastTime = performance.now();

function animate(time) {
  const dt = Math.min((time - lastTime) / 1000, 0.1);
  lastTime = time;

  if (game) {
    game.update(dt, time * 0.001);
    game.render();
  }

  requestAnimationFrame(animate);
}

window.addEventListener('DOMContentLoaded', () => {
  game = new HauntedHouseGame();
  requestAnimationFrame(animate);
});
