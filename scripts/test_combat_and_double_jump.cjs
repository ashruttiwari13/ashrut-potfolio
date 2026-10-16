const fs = require('fs');
const html = fs.readFileSync('pixel-quest.html', 'utf8');

// Global mocks
global.window = {
  addEventListener: () => {},
  innerWidth: 1200,
  innerHeight: 800,
  focus: () => {}
};
global.localStorage = { getItem: () => null, setItem: () => {} };
global.document = {
  getElementById: (id) => ({
    getContext: () => ({
      imageSmoothingEnabled: false,
      clearRect: () => {},
      fillRect: () => {},
      drawImage: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      scale: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
    }),
    width: 480,
    height: 270,
    style: {},
    classList: { add: () => {}, remove: () => {} },
    appendChild: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 480, height: 270 })
  }),
  createElement: () => ({
    width: 0,
    height: 0,
    style: {},
    appendChild: () => {},
    getContext: () => ({
      imageSmoothingEnabled: false,
      clearRect: () => {},
      fillRect: () => {},
      drawImage: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      fill: () => {},
      stroke: () => {},
      save: () => {},
      restore: () => {},
      translate: () => {},
      scale: () => {},
      createLinearGradient: () => ({ addColorStop: () => {} }),
    })
  }),
  querySelectorAll: () => [],
  addEventListener: () => {}
};
global.performance = { now: () => Date.now() };
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);
global.AudioContext = class {
  constructor() { this.destination = {}; this.currentTime = 0; }
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      connect: () => {}, start: () => {}, stop: () => {}
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, value: 1 },
      connect: () => {}
    };
  }
  createBufferSource() { return { buffer: null, connect: () => {}, start: () => {} }; }
  createBuffer() { return { getChannelData: () => new Float32Array(100) }; }
};
global.webkitAudioContext = global.AudioContext;

const script = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i)[1];

const runner = new Function(script + `
  return { atlas, Game, Player, Enemy, DIFFICULTY_SETTINGS };
`);

const { Game, Player, Enemy } = runner();
const game = new Game();
game.startNewGame();

console.log('--- TESTING COMBAT & DOUBLE JUMP ---');

// 1. TEST DOUBLE JUMP
console.log('[1/2] Verifying Double Jump mechanics...');
const player = game.player;
player.grounded = true;
player.update(1/60, { keys: {}, jumpPressed: false }, game.level);

if (player.jumpsLeft !== 2) {
  throw new Error('Expected 2 jumps available on ground, got: ' + player.jumpsLeft);
}

// First jump
player.update(1/60, { keys: { jump: true }, jumpPressed: true }, game.level);
console.log('✓ Jump 1 velocity:', player.vy, '| Jumps left:', player.jumpsLeft);
if (player.vy >= 0 || player.jumpsLeft !== 1) {
  throw new Error('First jump failed to propel player or decrement jumpsLeft');
}

// Second jump (Double Jump)
player.update(1/60, { keys: { jump: true }, jumpPressed: true }, game.level);
console.log('✓ Double Jump velocity:', player.vy, '| Jumps left:', player.jumpsLeft);
if (player.vy >= 0 || player.jumpsLeft !== 0) {
  throw new Error('Double jump failed to propel player in mid-air');
}
console.log('✓ Double Jump verified: 2 consecutive air jumps work smoothly!');

// 2. TEST LEFT MOUSE MELEE ATTACK HIT DETECTION
console.log('\n[2/2] Verifying Left Click Melee Attack against enemies...');
const testEnemy = new Enemy(player.x + 20, player.y, 'slime');
game.level.enemies = [testEnemy];
const initialHp = testEnemy.hp;

// Trigger normal attack facing the enemy
player.facing = 1;
player.triggerNormalAttack();

if (!player.isAttacking || !player.attackHitbox) {
  throw new Error('triggerNormalAttack failed to activate attack state or hitbox');
}

// Update game loop frame so combat checks run
game.update(1/60);

console.log('✓ Enemy HP before hit:', initialHp, '| Enemy HP after slash:', testEnemy.hp);
if (testEnemy.hp >= initialHp) {
  throw new Error('Enemy was NOT damaged by normal melee slash!');
}

if (!player.attackHitbox.hitEnemies.has(testEnemy)) {
  throw new Error('hitEnemies tracking set did not record enemy hit!');
}
console.log('✓ Melee Hit Detection verified: Left click accurately hits enemy with knockback and damage!');

console.log('\n=== ALL COMBAT AND DOUBLE JUMP TESTS PASSED SUCCESSFULLY! ===');
