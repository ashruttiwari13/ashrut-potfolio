const fs = require('fs');
const html = fs.readFileSync('pixel-quest.html', 'utf8');

// Global browser mocks
global.window = {
  addEventListener: () => {},
  innerWidth: 1200,
  innerHeight: 800
};
global.localStorage = { getItem: () => null, setItem: () => {} };
global.document = {
  getElementById: (id) => {
    return {
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
    };
  },
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
  constructor() {
    this.destination = {};
    this.currentTime = 0;
  }
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: () => {}, linearRampToValueAtTime: () => {} },
      connect: () => {},
      start: () => {},
      stop: () => {}
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {}, value: 1 },
      connect: () => {}
    };
  }
  createBufferSource() {
    return { buffer: null, connect: () => {}, start: () => {} };
  }
  createBuffer() {
    return { getChannelData: () => new Float32Array(100) };
  }
};
global.webkitAudioContext = global.AudioContext;

const script = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/i)[1];

try {
  const runner = new Function(script + `
    return {
      atlas,
      Game,
      LevelManager,
      DIFFICULTY_SETTINGS
    };
  `);

  const exports = runner();
  console.log('✓ Script parsed and executed successfully!');
  console.log('✓ Atlas sprites count:', Object.keys(exports.atlas.sprites).length);

  const game = new exports.Game();
  console.log('✓ Game instance initialized.');

  game.startNewGame();
  console.log('✓ startNewGame() succeeded.');

  // Simulate 60 frames for Level 0
  for (let i = 0; i < 60; i++) {
    game.update(1/60);
    game.draw();
  }
  console.log('✓ Level 0 (Village) 60 frames simulation OK.');

  // Simulate Level 1
  game.loadLevel(1);
  for (let i = 0; i < 60; i++) {
    game.update(1/60);
    game.draw();
  }
  console.log('✓ Level 1 (Forest) 60 frames simulation OK.');

  // Simulate Level 2
  game.loadLevel(2);
  for (let i = 0; i < 60; i++) {
    game.update(1/60);
    game.draw();
  }
  console.log('✓ Level 2 (Dungeon) 60 frames simulation OK.');

  // Simulate Level 3 (Boss)
  game.loadLevel(3);
  for (let i = 0; i < 60; i++) {
    game.update(1/60);
    game.draw();
  }
  console.log('✓ Level 3 (Boss Arena) 60 frames simulation OK.');

  console.log('\n=== COMPLETE RUNTIME VERIFICATION PASSED WITH ZERO ERRORS ===');
} catch (err) {
  console.error('RUNTIME VERIFICATION FAILED:', err);
  process.exit(1);
}
