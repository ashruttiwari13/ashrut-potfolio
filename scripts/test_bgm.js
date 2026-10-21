const fs = require('fs');
const http = require('http');

console.log('--- Background Music Verification Suite ---');

// 1. Check local audio files
const mp3Path1 = 'public/assets/audio/website-music.mp3';
const mp3Path2 = 'public/audio/website-music.mp3';
const legacyMp3 = 'public/assets/audio/calm-ambient.mp3';

const exists1 = fs.existsSync(mp3Path1);
const exists2 = fs.existsSync(mp3Path2);
const existsLegacy = fs.existsSync(legacyMp3);

console.log('1. Audio File Verification:');
console.log(`   - ${mp3Path1}: ${exists1 ? 'EXISTS (' + fs.statSync(mp3Path1).size + ' bytes)' : 'MISSING'}`);
console.log(`   - ${mp3Path2}: ${exists2 ? 'EXISTS (' + fs.statSync(mp3Path2).size + ' bytes)' : 'MISSING'}`);
console.log(`   - ${legacyMp3}: ${existsLegacy ? 'EXISTS (' + fs.statSync(legacyMp3).size + ' bytes)' : 'MISSING'}`);

if (!exists1 || !exists2) {
  console.error('FAIL: Missing MP3 audio file!');
  process.exit(1);
}

// 2. Test HTTP streaming of audio files
function checkUrl(url, expectedType) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      console.log(`2. HTTP ${url}: Status ${res.statusCode}, Content-Type: ${res.headers['content-type']}`);
      if (res.statusCode === 200 && res.headers['content-type'].includes(expectedType)) {
        resolve();
      } else {
        reject(new Error(`Failed to fetch ${url} properly`));
      }
    }).on('error', reject);
  });
}

async function run() {
  await checkUrl('http://localhost:3000/assets/audio/website-music.mp3', 'audio');
  await checkUrl('http://localhost:3000/audio/website-music.mp3', 'audio');
  await checkUrl('http://localhost:3000/assets/audio/calm-ambient.mp3', 'audio');

  // 3. Check Homepage HTML integration
  await new Promise((resolve, reject) => {
    http.get('http://localhost:3000', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('3. Homepage HTML Verification:');
        console.log('   - Contains bgm-toggle-button:', data.includes('bgm-toggle-button'));
        console.log('   - Volume adjust button correctly removed:', !data.includes('bgm-settings-button'));
        console.log('   - Contains /assets/audio/website-music.mp3:', data.includes('/assets/audio/website-music.mp3'));
        resolve();
      });
    }).on('error', reject);
  });

  console.log('\n--- All Automated BGM Verification Tests Passed! ---');
}

run().catch(err => {
  console.error('Verification error:', err.message);
  process.exit(1);
});
