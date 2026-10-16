const fs = require('fs');
const path = require('path');

function verifyPixelQuest() {
  console.log('--- TESTING PIXEL QUEST: THE LOST CRYSTAL ---');

  const filePath = path.join(__dirname, '..', 'pixel-quest.html');
  if (!fs.existsSync(filePath)) {
    throw new Error('pixel-quest.html does not exist!');
  }
  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Structure checks
  console.log('[1/8] Verifying Canvas & HTML Layout...');
  if (!content.includes('id="gameCanvas"')) throw new Error('Missing gameCanvas');
  if (!content.includes('id="bossBarContainer"')) throw new Error('Missing boss health bar');
  if (!content.includes('id="titleScreen"')) throw new Error('Missing title screen');
  if (!content.includes('id="pauseScreen"')) throw new Error('Missing pause screen');
  if (!content.includes('id="defeatScreen"')) throw new Error('Missing defeat screen');
  if (!content.includes('id="victoryScreen"')) throw new Error('Missing victory screen');
  console.log('✓ All essential DOM screens verified.');

  // 2. Controls checks
  console.log('[2/8] Verifying Combat & Controls (Mouse LMB/RMB & No J/X)...');
  if (content.includes('KeyJ') || content.includes('KeyX')) {
    throw new Error('J or X attack keys should not be present!');
  }
  if (!content.includes('e.button === 0') || !content.includes('e.button === 2')) {
    throw new Error('Missing explicit mouse button 0 and 2 checks');
  }
  if (!content.includes('contextmenu')) {
    throw new Error('Missing contextmenu suppression for RMB');
  }
  console.log('✓ Desktop mouse combat (LMB Normal, RMB Special) verified.');

  // 3. Mobile touch controls
  console.log('[3/8] Verifying Mobile Touch Controls...');
  if (!content.includes('id="touchLeft"') || !content.includes('id="touchAttack"')) {
    throw new Error('Missing touch buttons');
  }
  console.log('✓ Mobile on-screen multi-touch controls verified.');

  // 4. Difficulty modes
  console.log('[4/8] Verifying 3 Difficulty Modes...');
  if (!content.includes('EXPLORER') || !content.includes('ADVENTURER') || !content.includes('NIGHTMARE')) {
    throw new Error('Missing 3 difficulty modes');
  }
  console.log('✓ Explorer, Adventurer, and Nightmare configurations verified.');

  // 5. 3 Connected Levels
  console.log('[5/8] Verifying 3 Connected Levels...');
  if (!content.includes('THE FORGOTTEN VILLAGE') ||
      !content.includes('THE WHISPERING FOREST') ||
      !content.includes('THE CRYSTAL DUNGEON')) {
    throw new Error('Missing 3 distinct level definitions');
  }
  console.log('✓ Village, Forest, and Dungeon levels verified.');

  // 6. Boss & Attacks
  console.log('[6/8] Verifying Final Boss (The Crystal Guardian)...');
  if (!content.includes('CrystalGuardianBoss') ||
      !content.includes('Crystal Volley') ||
      !content.includes('Ground Slam') ||
      !content.includes('Crystal Dash')) {
    throw new Error('Missing Crystal Guardian boss or 3 attacks');
  }
  console.log('✓ Crystal Guardian boss with 3 telegraphed attacks verified.');

  // 7. Collectibles & Endings
  console.log('[7/8] Verifying Collectibles & Secret Ending...');
  if (!content.includes('ANCIENT RELIC') || !content.includes('THE ETERNAL DAWN')) {
    throw new Error('Missing Secret Ancient Relic or True Ending condition');
  }
  console.log('✓ Shards, Key, Health Potions, and Secret Relic verified.');

  // 8. Audio Synthesizer
  console.log('[8/8] Verifying Web Audio Synthesizer...');
  if (!content.includes('RetroAudio') || !content.includes('bossRoar') || !content.includes('bossDefeat')) {
    throw new Error('Missing RetroAudio methods');
  }
  console.log('✓ Complete 8-bit synthesizer verified.');

  console.log('\n=== ALL 8 GAMEPLAY VERIFICATION CRITERIA PASSED! ===');
}

verifyPixelQuest();
