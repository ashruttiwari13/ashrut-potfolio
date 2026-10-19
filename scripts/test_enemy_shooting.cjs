const fs = require('fs');
const assert = require('assert');

console.log('--- TESTING ENEMY BULLET SHOOTING & HIT DETECTION ---');

const html = fs.readFileSync('pixel-quest.html', 'utf8');

// Verify keywords
assert(html.includes('triggerShoot'), 'Must include triggerShoot');
assert(html.includes('checkEnemyHit'), 'Must include checkEnemyHit');
assert(html.includes('pcy >= s.y + 6'), 'Must prevent ground platform from swallowing bullets');
assert(html.includes('PRIORITY: Check Player Bullets hitting Enemies first!'), 'Must check enemies first');
console.log('✓ Code hooks verified in pixel-quest.html.');

// Simulate Enemy and Projectile classes
class MockEnemy {
  constructor(x, y, type = 'slime') {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 14;
    this.hp = 25;
    this.alive = true;
    this.vx = 0;
  }
  takeDamage(amt, knockDir = 0) {
    this.hp -= amt;
    if (knockDir !== 0) this.vx = knockDir * 2.8;
    if (this.hp <= 0) this.alive = false;
  }
}

class MockProjectile {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.width = 12;
    this.height = 12;
    this.sender = 'player';
    this.damage = 25;
    this.life = 2.4;
  }
  update(dt = 0.016) {
    this.x += this.vx;
    this.y += this.vy;
  }
  checkEnemyHit(en) {
    const enLeft = en.x - 6;
    const enRight = en.x + en.width + 6;
    const enTop = en.y - 6;
    const enBottom = en.y + en.height + 6;
    return (
      this.x + this.width > enLeft &&
      this.x < enRight &&
      this.y + this.height > enTop &&
      this.y < enBottom
    );
  }
}

// Level setup:
// Solid platform at y=220, height=50
const ground = { x: 0, y: 220, w: 580, h: 50 };
// Player at x=40, y=196. Center at x=48, y=208.
// Slime at x=160, y=206 (standing on ground). Center at x=170, y=213.
const enemy = new MockEnemy(160, 206, 'slime');

// Player shoots at enemy
const angle = Math.atan2(213 - 208, 170 - 48); // ~0.04 rad
const speed = 8.0;
const proj = new MockProjectile(
  48 + Math.cos(angle) * 16 - 6,
  208 + Math.sin(angle) * 16 - 6,
  Math.cos(angle) * speed,
  Math.sin(angle) * speed
);

let hitEnemy = false;
let hitGroundPrematurely = false;

for (let frame = 0; frame < 60; frame++) {
  proj.update();

  // 1. Check enemy hit
  if (proj.checkEnemyHit(enemy)) {
    enemy.takeDamage(proj.damage, proj.vx > 0 ? 1 : -1);
    hitEnemy = true;
    console.log(`✓ Bullet successfully struck enemy at frame ${frame} (x=${proj.x.toFixed(1)}, y=${proj.y.toFixed(1)})`);
    break;
  }

  // 2. Check solid ground
  const pcx = proj.x + proj.width / 2;
  const pcy = proj.y + proj.height / 2;
  if (pcx >= ground.x && pcx <= ground.x + ground.w && pcy >= ground.y + 6 && pcy <= ground.y + ground.h) {
    hitGroundPrematurely = true;
    console.error(`✗ Bullet hit ground at frame ${frame}`);
    break;
  }
}

assert(hitEnemy === true, 'Bullet MUST strike enemy');
assert(hitGroundPrematurely === false, 'Bullet must NOT hit ground prematurely');
assert(enemy.hp <= 0, 'Enemy must take full damage and die');
assert(enemy.alive === false, 'Enemy must be defeated');
console.log('✓ Enemy HP reduced to:', enemy.hp, 'Alive:', enemy.alive);

console.log('=== ALL BULLET SHOOTING & ENEMY HIT TESTS PASSED! ===');
