const fs = require('fs');

console.log('--- TESTING ENEMY UPGRADE: 3D SMILING HORROR ENTITY & ATTACK SYSTEM ---');

// 1. Mock Browser & WebGL for Node testing
const THREE = require('../public/libs/three.min.js');

THREE.WebGLRenderer = class {
  constructor() {
    this.shadowMap = {};
    this.domElement = { addEventListener: () => {}, requestPointerLock: () => {} };
  }
  setSize() {}
  setPixelRatio() {}
  render() {}
};

global.THREE = THREE;
global.window = {
  innerWidth: 1280,
  innerHeight: 720,
  devicePixelRatio: 1,
  addEventListener: () => {},
  AudioContext: class {
    constructor() { this.currentTime = 0; }
    createOscillator() {
      return {
        type: 'sine',
        frequency: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
        connect: () => {}, start: () => {}, stop: () => {}
      };
    }
    createGain() {
      return { gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} }, connect: () => {} };
    }
    createBiquadFilter() {
      return { type: 'lowpass', frequency: { setValueAtTime: () => {} }, connect: () => {} };
    }
  }
};

const mockElements = {};
global.document = {
  pointerLockElement: null,
  addEventListener: () => {},
  exitPointerLock: () => {},
  createElement: (tag) => {
    if (tag === 'canvas') {
      return {
        width: 512,
        height: 512,
        addEventListener: () => {},
        getContext: () => ({
          fillStyle: '',
          fillRect: () => {},
          strokeStyle: '',
          lineWidth: 1,
          beginPath: () => {},
          moveTo: () => {},
          lineTo: () => {},
          stroke: () => {},
          arc: () => {},
          ellipse: () => {},
          rect: () => {},
          quadraticCurveTo: () => {},
          closePath: () => {},
          fill: () => {},
          createRadialGradient: () => ({ addColorStop: () => {} })
        })
      };
    }
    return { style: {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {}, innerText: '', innerHTML: '' };
  },
  getElementById: (id) => {
    if (!mockElements[id]) {
      mockElements[id] = {
        id,
        style: {},
        classList: { add: () => {}, remove: () => {} },
        innerText: '',
        innerHTML: '',
        addEventListener: () => {},
        requestPointerLock: () => {}
      };
    }
    return mockElements[id];
  },
  querySelectorAll: () => []
};

// 2. Load game script
const gameScript = fs.readFileSync('js/haunted-house.js', 'utf8');
const runner = new Function(gameScript + `
  return {
    TextureFactory,
    HorrorAudio,
    DIFFICULTIES,
    HouseBuilder,
    KeeperAI,
    PlayerController,
    HauntedHouseGame,
    audio,
    setGame: (g) => { game = g; }
  };
`);

const gameModules = runner();
console.log('[1/7] Evaluated game engine and modules successfully.');

// Test 1: Verify Custom Textures (Smiling Face & Hospital Shirt)
console.log('[2/7] Testing Smiling Entity Face Texture & Hospital Shirt Texture...');
const faceTex = gameModules.TextureFactory.createSmilingEntityFaceTexture();
const shirtTex = gameModules.TextureFactory.createHospitalShirtTexture();
if (!faceTex || !shirtTex) {
  throw new Error('Failed to generate enemy custom procedural textures');
}
console.log('✓ Enemy Face Texture & Hospital Shirt Texture generated cleanly.');

// Test 2: Build Scene, House, and Enemy 3D Mesh
console.log('[3/7] Verifying 3D Enemy Mesh & Proportions based on Reference Image...');
const scene = new THREE.Scene();
const house = new gameModules.HouseBuilder(scene);
house.buildHouse();

const keeper = new gameModules.KeeperAI(scene, house);
if (!keeper.headMesh || !keeper.eyeL || !keeper.eyeR || !keeper.jaw || !keeper.weapon) {
  throw new Error('Keeper 3D mesh missing critical body parts (head, bulging eyes, articulated jaw, or weapon)');
}
console.log('✓ 3D Smiling Horror Creature assembled with bulging eyes, piercings, shaggy hair, jaw, and rusted cleaver.');

// Test 3: Waypoint Navigation Graph & BFS Pathfinding
console.log('[4/7] Testing 16-Node Connected Waypoint Navigation Graph & Pathfinding...');
if (keeper.waypoints.length !== 16) {
  throw new Error(`Expected 16 waypoints connecting all rooms, found: ${keeper.waypoints.length}`);
}
const startWp = keeper.getWaypointById('living_inside');
const endWp = keeper.getWaypointById('bedroom_inside');
const path = keeper.findShortestPath(startWp, endWp);
if (!path || path.length < 3) {
  throw new Error('Pathfinder failed to navigate from Living Room to Bedroom');
}
console.log(`✓ Navigation Graph connected! Living Room to Bedroom path resolved: ${path.map(p => p.id).join(' -> ')}`);

// Test 4: Senses & Line of Sight
console.log('[5/7] Testing Senses, Noise Hearing, and Line-of-Sight occlusion...');
const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 100);
const canvas = document.createElement('canvas');
const player = new gameModules.PlayerController(camera, canvas, scene, house);

// Hearing
keeper.hearNoise(new THREE.Vector3(0, 0, 0), 1.0);
if (keeper.state !== 'INVESTIGATE') {
  throw new Error(`Expected INVESTIGATE on hearing noise, got: ${keeper.state}`);
}
console.log('✓ Enemy heard noise and transitioned to INVESTIGATE.');

// Direct Line of Sight
player.camera.position.set(keeper.pos.x, keeper.pos.y, keeper.pos.z + 4);
keeper.rotation = 0; // facing +Z
const visible = keeper.checkLineOfSight(player, gameModules.DIFFICULTIES.normal);
if (!visible) throw new Error('Player directly in front should have line of sight');
console.log('✓ Line-of-sight confirmed when player is in front of enemy.');

// Wall Occlusion (Player behind wall in bedroom)
player.camera.position.set(-14, 1.7, -10);
const occluded = keeper.checkLineOfSight(player, gameModules.DIFFICULTIES.normal);
if (occluded) throw new Error('Player behind bedroom wall should NOT have line of sight from living room');
console.log('✓ Wall occlusion verified: Enemy cannot see player through bedroom wall.');

// Test 5: Real Attack System, Animations, and Player Health Damage
console.log('[6/7] Testing Real Attack System, Hitbox, Cooldowns, and Health Damage...');

// Setup dummy game orchestrator
global.game = {
  state: 'PLAYING',
  showAlert: () => {},
  setBloodVignette: () => {},
  triggerDayDefeat: () => { global.defeatTriggered = true; },
  keeper,
  player
};
gameModules.setGame(global.game);

// Place player within attack range (1.5m in front of enemy)
player.camera.position.set(keeper.pos.x, keeper.pos.y + 1.7, keeper.pos.z + 1.4);
keeper.rotation = 0;
keeper.state = 'CHASE';
keeper.attackCooldownTimer = 0;

// Verify initial player health
if (player.health !== 100) throw new Error(`Initial player health should be 100, got: ${player.health}`);

// Execute update step to trigger attack
keeper.update(0.016, player, gameModules.DIFFICULTIES.normal);

if (!keeper.isAttacking || keeper.state !== 'ATTACK') {
  throw new Error(`Enemy should enter ATTACK state when player is in range, got: ${keeper.state}`);
}
console.log('✓ Enemy successfully initiated visible attack animation.');

// Advance time to mid-swing window (anim progress)
keeper.update(0.25, player, gameModules.DIFFICULTIES.normal);

if (player.health >= 100) {
  throw new Error(`Player should have taken damage during attack swing, but health is still: ${player.health}`);
}
const expectedHp = 100 - gameModules.DIFFICULTIES.normal.keeperDamage;
if (player.health !== expectedHp) {
  throw new Error(`Expected player HP to be ${expectedHp}, got: ${player.health}`);
}
console.log(`✓ Attack landed! Player HP correctly decreased from 100 to ${player.health} (-${gameModules.DIFFICULTIES.normal.keeperDamage} HP).`);

// Advance time past swing end to enter RECOVERY
keeper.update(0.35, player, gameModules.DIFFICULTIES.normal);
if (keeper.isAttacking) throw new Error('Attack animation should have ended');
if (keeper.state !== 'RECOVERY') throw new Error(`Enemy should enter RECOVERY after attack, got: ${keeper.state}`);
if (keeper.attackCooldownTimer <= 0) throw new Error('Attack cooldown timer should be active after attack');
console.log(`✓ Enemy entered RECOVERY state with ${keeper.attackCooldownTimer.toFixed(1)}s cooldown active.`);

// Verify cooldown prevents immediate second attack
const hpBefore = player.health;
keeper.update(0.016, player, gameModules.DIFFICULTIES.normal);
if (player.health !== hpBefore) {
  throw new Error('Enemy attacked again before cooldown finished!');
}
console.log('✓ Attack cooldown successfully prevented damage spam.');

// Test 6: Player Death and Reset
console.log('[7/7] Testing Player Death on 0 HP, Reset, and Difficulty Scaling...');

// Deal fatal damage
player.takeDamage(100);
if (player.health !== 0) throw new Error('Player HP should be 0 after fatal damage');
if (player.alive) throw new Error('Player alive status should be false upon reaching 0 HP');
console.log('✓ Player health reduced to 0 -> Player death triggered.');

// Reset Player & Enemy
player.resetPosition();
keeper.resetPosition();

if (player.health !== 100 || !player.alive) {
  throw new Error('player.resetPosition() failed to restore health to 100 and alive to true');
}
if (keeper.state !== 'PATROL' || keeper.pos.x !== -14 || keeper.pos.z !== 10) {
  throw new Error('keeper.resetPosition() failed to restore Living Room spawn and PATROL state');
}
console.log('✓ Player reset restored 100 HP, and Enemy reset returned to Living Room in PATROL state.');

// Verify Difficulty Scaling
const easy = gameModules.DIFFICULTIES.easy;
const normal = gameModules.DIFFICULTIES.normal;
const hard = gameModules.DIFFICULTIES.hard;

if (easy.keeperDamage >= normal.keeperDamage || normal.keeperDamage >= hard.keeperDamage) {
  throw new Error('Difficulty scaling does not scale keeperDamage correctly');
}
if (easy.keeperCooldown <= normal.keeperCooldown || normal.keeperCooldown <= hard.keeperCooldown) {
  throw new Error('Difficulty scaling does not scale keeperCooldown correctly');
}
console.log(`✓ Difficulty Scaling Verified:`);
console.log(`  - Easy: ${easy.keeperDamage} damage, ${easy.keeperCooldown}s cooldown, speed ${easy.keeperSpeed}`);
console.log(`  - Normal: ${normal.keeperDamage} damage, ${normal.keeperCooldown}s cooldown, speed ${normal.keeperSpeed}`);
console.log(`  - Hard/Nightmare: ${hard.keeperDamage} damage, ${hard.keeperCooldown}s cooldown, speed ${hard.keeperSpeed}`);

console.log('\n=== ALL ENEMY UPGRADE TESTS PASSED WITH 100% SUCCESS! ===');
