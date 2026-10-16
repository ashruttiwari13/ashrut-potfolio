const fs = require('fs');

console.log('--- TESTING HAUNTED HOUSE: THE ESCAPE (3D HORROR GAME) ---');

// 1. Verify Three.js local library exists
const threePath = 'public/libs/three.min.js';
if (!fs.existsSync(threePath)) {
  throw new Error('Local Three.js library missing at ' + threePath);
}
console.log('[1/7] Local Three.js library verified (size: ' + fs.statSync(threePath).size + ' bytes).');

// 2. Mock Browser & WebGL for Node testing
const THREE = require('../public/libs/three.min.js');

THREE.WebGLRenderer = class {
  constructor() {
    this.shadowMap = {};
    this.domElement = { addEventListener: () => {} };
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
          fill: () => {}
        })
      };
    }
    return { style: {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {}, innerText: '', innerHTML: '' };
  },
  getElementById: (id) => ({
    style: {},
    classList: { add: () => {}, remove: () => {} },
    innerText: '',
    innerHTML: '',
    addEventListener: () => {},
    requestPointerLock: () => {}
  }),
  querySelectorAll: () => []
};

// 3. Load game script
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
console.log('[2/7] 3D Game script successfully evaluated in WebGL environment.');

// 4. Test Procedural Textures & Materials
console.log('[3/7] Verifying Procedural Textures (Wood, Wallpaper, Stone)...');
const woodTex = gameModules.TextureFactory.createWood();
const wallTex = gameModules.TextureFactory.createWallpaper();
const stoneTex = gameModules.TextureFactory.createStone();
if (!woodTex || !wallTex || !stoneTex) {
  throw new Error('Procedural texture generation failed');
}
console.log('✓ Wood, Wallpaper, and Stone procedural textures created cleanly.');

// 5. Test House World Generation
console.log('[4/7] Verifying House Layout & Room Bounding Colliders...');
const scene = new THREE.Scene();
const house = new gameModules.HouseBuilder(scene);
house.buildHouse();

console.log('✓ Walls created:', house.walls.length);
console.log('✓ Doors created:', house.doors.length);
console.log('✓ Hiding Spots created:', house.hidingSpots.length);
console.log('✓ Items placed:', house.items.length);
if (house.walls.length < 8 || house.doors.length < 4 || house.hidingSpots.length < 3) {
  throw new Error('HouseBuilder did not generate the required minimum rooms/colliders');
}

// 6. Test Player & The Keeper AI
console.log('[5/7] Verifying Player Controller & The Keeper AI State Machine...');
const camera = new THREE.PerspectiveCamera(75, 16/9, 0.1, 100);
const canvas = document.createElement('canvas');
const player = new gameModules.PlayerController(camera, canvas, scene, house);
const keeper = new gameModules.KeeperAI(scene, house);

if (keeper.state !== 'PATROL') {
  throw new Error('Keeper AI initial state should be PATROL, got: ' + keeper.state);
}

// Test noise hearing
keeper.hearNoise(new THREE.Vector3(0, 0, 0), 1.5);
if (keeper.state !== 'INVESTIGATE') {
  throw new Error('Keeper AI failed to switch to INVESTIGATE upon hearing noise');
}
console.log('✓ Keeper AI Hearing & Investigation verified.');

// Test line of sight detection
player.camera.position.set(keeper.pos.x + 3, keeper.pos.y, keeper.pos.z + 3);
player.flashlightOn = true;
const detected = keeper.checkLineOfSight(player, gameModules.DIFFICULTIES.normal);
console.log('✓ Line of Sight check returned:', detected);

// 7. Test The 5 Escape Puzzle Objectives
console.log('[6/7] Verifying 5 Interconnected Escape Puzzle Objectives...');
// Set dummy game reference
global.game = {
  showAlert: () => {},
  updateObjective: () => {},
  setBloodVignette: () => {},
  triggerVictory: () => { global.victoryTriggered = true; }
};
gameModules.setGame(global.game);

// Obj 1: Unlock bedroom door with key
const bedroomDoor = house.doors.find(d => d.id === 'bedroom_door');
player.pickItem('bedroom_key', 'Bedroom Key');
bedroomDoor.interact(player);
if (bedroomDoor.locked) throw new Error('Bedroom door failed to unlock with Bedroom Key');
console.log('✓ Obj 1: Bedroom Key unlocks Bedroom Door.');

// Obj 2: Pry off front door planks with crowbar
player.pickItem('crowbar', 'Heavy Crowbar');
house.exitDoor.interact(player);
if (!house.exitDoor.planksRemoved) throw new Error('Failed to pry off front door planks with Crowbar');
console.log('✓ Obj 2: Crowbar prys off Front Door planks.');

// Obj 3: Install Fuse into Basement Fusebox
player.pickItem('fuse', 'Electrical Fuse');
house.fuseBox.interact(player);
if (!house.fuseBox.hasFuse) throw new Error('Failed to install Fuse into Fusebox');
console.log('✓ Obj 3: Fuse installed into Basement Fusebox.');

// Obj 4: Cut Alarm Wires with Wire Cutters
player.pickItem('wire_cutters', 'Wire Cutters');
house.exitDoor.interact(player);
if (!house.exitDoor.wiresCut) throw new Error('Failed to cut alarm wires with Wire Cutters');
console.log('✓ Obj 4: Alarm wires cut with Wire Cutters.');

// Obj 5: Unlock Padlock with Padlock Key
player.pickItem('padlock_key', 'Heavy Padlock Key');
house.exitDoor.interact(player);
if (!house.exitDoor.padlockRemoved) {
  throw new Error('Failed to unlock Padlock with Padlock Key');
}
console.log('✓ Obj 5: Padlock Key unlocks Padlock.');

// Final Step: Open Front Door and Escape!
house.exitDoor.interact(player);
if (!house.exitDoor.isOpen || !global.victoryTriggered) {
  throw new Error('Failed to open door and trigger victory sequence');
}
console.log('✓ Final Escape: Door opens into freedom and triggers Victory!');

// 8. Test 5 Days / Lives System
console.log('[7/7] Verifying 5 Days System & Difficulty Scaling...');
const fullGame = new gameModules.HauntedHouseGame();
if (fullGame.currentDay !== 1) throw new Error('Initial day should be 1');
fullGame.triggerDayDefeat();
if (fullGame.currentDay !== 2) throw new Error('Day count should increment to 2 after defeat');
console.log('✓ Day progression verified: Player wakes up on Day 2 with blood scars.');

console.log('\n=== ALL 7 3D HORROR GAME VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
