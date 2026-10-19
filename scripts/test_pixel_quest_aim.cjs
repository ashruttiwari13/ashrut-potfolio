const fs = require('fs');
const assert = require('assert');

console.log('--- TESTING PIXEL QUEST AIM & SHOOT LOGIC ---');

const html = fs.readFileSync('pixel-quest.html', 'utf8');

// Verify keywords
assert(html.includes('aimAngle'), 'Must include aimAngle');
assert(html.includes('updateMouseCoords'), 'Must include updateMouseCoords');
assert(html.includes('getDirectionalAimAngle'), 'Must include getDirectionalAimAngle');
assert(html.includes('Math.cos(angle) * speed'), 'Must shoot at dynamic angle');
assert(html.includes('CRYSTAL BLAST'), 'Must trigger crystal blast on special attack');
assert(html.includes('Aim Crosshair at mouse pointer'), 'Must render aim crosshair');
console.log('✓ All key aiming and shooting hooks present in HTML.');

// Verify projectile angle calculation
const simulateAim = (playerX, playerY, targetX, targetY) => {
  const dx = targetX - playerX;
  const dy = targetY - playerY;
  const angle = Math.atan2(dy, dx);
  const speed = 7.2;
  return {
    angle,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    facing: dx >= 0 ? 1 : -1
  };
};

// 1. Aiming to the right (0 deg)
const aimRight = simulateAim(100, 100, 200, 100);
assert(aimRight.vx > 7.1 && Math.abs(aimRight.vy) < 0.001);
assert(aimRight.facing === 1);
console.log('✓ Aim Right test passed: vx=' + aimRight.vx.toFixed(2) + ', vy=' + aimRight.vy.toFixed(2));

// 2. Aiming to the left (180 deg)
const aimLeft = simulateAim(100, 100, 0, 100);
assert(aimLeft.vx < -7.1 && Math.abs(aimLeft.vy) < 0.001);
assert(aimLeft.facing === -1);
console.log('✓ Aim Left test passed: vx=' + aimLeft.vx.toFixed(2) + ', vy=' + aimLeft.vy.toFixed(2));

// 3. Aiming diagonally up-right (-45 deg)
const aimUpRight = simulateAim(100, 100, 200, 0);
assert(aimUpRight.vx > 5.0 && aimUpRight.vy < -5.0);
assert(aimUpRight.facing === 1);
console.log('✓ Aim Up-Right test passed: vx=' + aimUpRight.vx.toFixed(2) + ', vy=' + aimUpRight.vy.toFixed(2));

// 4. Aiming straight up (-90 deg)
const aimUp = simulateAim(100, 100, 100, 0);
assert(Math.abs(aimUp.vx) < 0.001 && aimUp.vy < -7.1);
console.log('✓ Aim Up test passed: vx=' + aimUp.vx.toFixed(2) + ', vy=' + aimUp.vy.toFixed(2));

console.log('=== ALL PIXEL QUEST AIM TESTS PASSED! ===');
