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
    keeperSpeed: 2.4,
    keeperChaseSpeed: 4.2,
    keeperFov: 50 * (Math.PI / 180),
    keeperSightDist: 12,
    staminaDrain: 18,
    staminaRecover: 30,
    batteryDrainRate: 0.15,
  },
  normal: {
    label: 'NORMAL',
    keeperSpeed: 3.2,
    keeperChaseSpeed: 5.4,
    keeperFov: 70 * (Math.PI / 180),
    keeperSightDist: 18,
    staminaDrain: 25,
    staminaRecover: 22,
    batteryDrainRate: 0.35,
  },
  hard: {
    label: 'NIGHTMARE',
    keeperSpeed: 4.0,
    keeperChaseSpeed: 6.8,
    keeperFov: 90 * (Math.PI / 180),
    keeperSightDist: 24,
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

// --- 5. THE KEEPER ENEMY AI ---
class KeeperAI {
  constructor(scene, house) {
    this.scene = scene;
    this.house = house;
    this.state = 'PATROL'; // PATROL, INVESTIGATE, CHASE, SEARCH, ATTACK
    this.pos = new THREE.Vector3(-14, 0, 10); // Spawns downstairs in Living Room
    this.velocity = new THREE.Vector3();
    this.speed = 3.2;
    this.rotation = 0;
    this.alive = true;

    // Waypoints across house rooms and hallways
    this.waypoints = [
      new THREE.Vector3(-14, 0, 8),   // Living room
      new THREE.Vector3(-6, 0, 6),    // Living doorway
      new THREE.Vector3(2, 0, 6),     // Kitchen entrance
      new THREE.Vector3(10, 0, 10),   // Deep kitchen
      new THREE.Vector3(6, 0, 0),     // Central hallway
      new THREE.Vector3(-6, 0, 0),    // Upper corridor west
      new THREE.Vector3(-12, 0, -8),  // Bedroom corridor
      new THREE.Vector3(1, 0, -9),    // Bathroom entrance
      new THREE.Vector3(12, 0, -8),   // Storage entrance
      new THREE.Vector3(8, -4, 6),    // Basement center
    ];
    this.currentWpIndex = 0;
    this.targetPos = this.waypoints[0].clone();

    this.investigateTimer = 0;
    this.searchTimer = 0;
    this.lastKnownPlayerPos = new THREE.Vector3();
    this.attackDistance = 1.6;

    this.createMesh();
  }

  createMesh() {
    this.mesh = new THREE.Group();

    // Ragged dark cloak body
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x181014,
      roughness: 0.95
    });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.65, 1.6, 8), bodyMat);
    body.position.y = 1.1;
    this.mesh.add(body);

    // Pale sunken head
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xd8c8be,
      roughness: 0.6
    });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), headMat);
    head.position.y = 2.05;
    this.mesh.add(head);

    // Glowing Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff1111 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eyeMat);
    eyeL.position.set(-0.12, 2.08, 0.26);
    this.mesh.add(eyeL);

    const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), eyeMat);
    eyeR.position.set(0.12, 2.08, 0.26);
    this.mesh.add(eyeR);

    // Bloodied wooden bat in hand
    const bat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.06, 1.1, 6),
      new THREE.MeshStandardMaterial({ color: 0x4a2a16, roughness: 0.7 })
    );
    bat.position.set(0.55, 1.0, 0.3);
    bat.rotation.x = Math.PI / 4;
    this.mesh.add(bat);

    this.mesh.position.copy(this.pos);
    this.scene.add(this.mesh);
  }

  update(dt, player, diffSettings) {
    if (!this.alive) return;

    const distToPlayer = this.pos.distanceTo(player.camera.position);

    // Update spatial heartbeat sound
    audio.updateHeartbeat(distToPlayer);

    // 1. Line of Sight & Detection
    const canSeePlayer = this.checkLineOfSight(player, diffSettings);

    if (canSeePlayer && !player.isHiding) {
      if (this.state !== 'CHASE') {
        this.state = 'CHASE';
        audio.playJumpscareStinger();
        game.setBloodVignette(0.7);
        game.showAlert('⚠️ SHE SAW YOU! RUN!');
      }
      this.lastKnownPlayerPos.copy(player.camera.position);
      this.targetPos.copy(player.camera.position);
    } else if (this.state === 'CHASE') {
      // Lost sight -> switch to SEARCH
      this.state = 'SEARCH';
      this.searchTimer = 6.0;
      this.targetPos.copy(this.lastKnownPlayerPos);
    }

    // 2. State Actions
    const currentSpeed = (this.state === 'CHASE' ? diffSettings.keeperChaseSpeed : diffSettings.keeperSpeed);

    if (this.state === 'PATROL') {
      const distToWp = this.pos.distanceTo(this.targetPos);
      if (distToWp < 1.0) {
        this.currentWpIndex = (this.currentWpIndex + 1) % this.waypoints.length;
        this.targetPos.copy(this.waypoints[this.currentWpIndex]);
      }
    } else if (this.state === 'SEARCH') {
      this.searchTimer -= dt;
      if (this.searchTimer <= 0) {
        this.state = 'PATROL';
        game.setBloodVignette(0);
        this.targetPos.copy(this.waypoints[this.currentWpIndex]);
      }
    } else if (this.state === 'INVESTIGATE') {
      this.investigateTimer -= dt;
      if (this.investigateTimer <= 0) {
        this.state = 'PATROL';
        this.targetPos.copy(this.waypoints[this.currentWpIndex]);
      }
    }

    // 3. Movement towards target
    const dir = new THREE.Vector3().subVectors(this.targetPos, this.pos);
    dir.y = 0;
    if (dir.length() > 0.3) {
      dir.normalize();
      this.pos.addScaledVector(dir, currentSpeed * dt);
      this.rotation = Math.atan2(dir.x, dir.z);
    }

    // Bobbing walk animation
    this.mesh.position.copy(this.pos);
    this.mesh.rotation.y = this.rotation;
    this.mesh.position.y = Math.sin(Date.now() * 0.008) * 0.06;

    // 4. Attack Check
    if (distToPlayer < this.attackDistance && !player.isHiding && player.alive) {
      this.attackPlayer(player);
    }
  }

  checkLineOfSight(player, diffSettings) {
    const toPlayer = new THREE.Vector3().subVectors(player.camera.position, this.pos);
    const dist = toPlayer.length();

    if (dist > diffSettings.keeperSightDist) return false;

    // Check angle inside vision cone
    const lookDir = new THREE.Vector3(Math.sin(this.rotation), 0, Math.cos(this.rotation));
    toPlayer.normalize();
    const angle = lookDir.angleTo(toPlayer);

    // If player has flashlight on, detection angle and range are amplified
    const effectiveFov = player.flashlightOn ? diffSettings.keeperFov * 1.4 : diffSettings.keeperFov;
    if (angle > effectiveFov / 2 && dist > 3.0) return false;

    // Raycast wall occlusion check
    const ray = new THREE.Raycaster(
      new THREE.Vector3(this.pos.x, 2.0, this.pos.z),
      toPlayer,
      0.5,
      dist
    );
    const wallMeshes = this.house.walls.map(w => w.mesh);
    const hits = ray.intersectObjects(wallMeshes);

    return hits.length === 0; // True if no walls block line of sight
  }

  hearNoise(pos, intensity = 1.0) {
    const dist = this.pos.distanceTo(pos);
    if (dist < 22 * intensity) {
      this.state = 'INVESTIGATE';
      this.targetPos.copy(pos);
      this.investigateTimer = 7.0;
      audio.playDoorCreak();
    }
  }

  attackPlayer(player) {
    audio.playJumpscareStinger();
    player.takeHit();
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

  takeHit() {
    if (!this.alive) return;
    this.alive = false;
    game.triggerDayDefeat();
  }

  resetPosition() {
    this.camera.position.set(-14, this.eyeHeight, -8); // Master bedroom bed
    this.yaw = 0;
    this.pitch = 0;
    this.alive = true;
    this.isHiding = false;
    document.getElementById('hidingBanner').style.display = 'none';
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
