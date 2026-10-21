const fs = require('fs');
const path = require('path');

// Setup lamejs globals in Node.js
global.MPEGMode = require('lamejs/src/js/MPEGMode');
global.Lame = require('lamejs/src/js/Lame');
global.BitStream = require('lamejs/src/js/BitStream');
const lamejs = require('lamejs');

// Audio parameters: Cheerful, joyful, cozy acoustic lo-fi theme
// 104 BPM, 4/4 time. 1 beat = 60 / 104 = 0.5769 sec. 1 bar (4 beats) = 2.3077 sec.
// 16 bars total = 36.923 seconds loop.
const SAMPLE_RATE = 44100;
const BPM = 104;
const BEAT_SEC = 60 / BPM;
const BAR_SEC = BEAT_SEC * 4;
const NUM_BARS = 16;
const DURATION_SECONDS = BAR_SEC * NUM_BARS;
const NUM_SAMPLES = Math.floor(SAMPLE_RATE * DURATION_SECONDS);

const left = new Float32Array(NUM_SAMPLES);
const right = new Float32Array(NUM_SAMPLES);

// Note frequencies (Hz)
const N = {
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50, D6: 1174.66, E6: 1318.51, G6: 1567.98
};

// 1. Cozy Bouncy Acoustic Bass
function addBassNote(freq, startBeat, durationBeats = 1.6, gain = 0.18) {
  const startSec = startBeat * BEAT_SEC;
  const durSec = durationBeats * BEAT_SEC;
  const startSample = Math.floor(startSec * SAMPLE_RATE);
  const totalSamples = Math.floor(durSec * SAMPLE_RATE);

  for (let s = 0; s < totalSamples; s++) {
    const idx = (startSample + s) % NUM_SAMPLES;
    const t = s / SAMPLE_RATE;
    const env = Math.min(1, t / 0.015) * Math.exp(-t * 2.2);

    // Warm round upright bass: fundamental + soft 2nd harmonic
    const p = 2 * Math.PI * freq * t;
    const val = (Math.sin(p) * 0.8 + Math.sin(p * 2) * 0.2) * env * gain;

    left[idx] += val * 0.5;
    right[idx] += val * 0.5;
  }
}

// 2. Cheerful Kalimba / Marimba Chord Stabs (soft, joyful, acoustic)
function addKalimbaChord(notes, startBeat, gain = 0.065, pan = 0) {
  const startSec = startBeat * BEAT_SEC;
  const durSec = 1.8;
  const startSample = Math.floor(startSec * SAMPLE_RATE);
  const totalSamples = Math.floor(durSec * SAMPLE_RATE);

  const leftPan = 0.5 - pan * 0.35;
  const rightPan = 0.5 + pan * 0.35;

  for (let s = 0; s < totalSamples; s++) {
    const idx = (startSample + s) % NUM_SAMPLES;
    const t = s / SAMPLE_RATE;
    const env = Math.min(1, t / 0.008) * Math.exp(-t * 2.8);

    let chordVal = 0;
    notes.forEach(f => {
      const p = 2 * Math.PI * f * t;
      chordVal += (Math.sin(p) * 0.7 + Math.sin(p * 3) * 0.18 + Math.sin(p * 4.2) * 0.06);
    });

    chordVal = (chordVal / notes.length) * env * gain;
    left[idx] += chordVal * leftPan;
    right[idx] += chordVal * rightPan;
  }
}

// 3. Singing Joyful Melody Bell / Flute (The Cat's Happy Singing Song)
function addSingingNote(freq, startBeat, durationBeats, gain = 0.085, pan = 0.1) {
  const startSec = startBeat * BEAT_SEC;
  const durSec = durationBeats * BEAT_SEC;
  const startSample = Math.floor(startSec * SAMPLE_RATE);
  const totalSamples = Math.floor(durSec * SAMPLE_RATE);

  const leftPan = 0.5 - pan * 0.4;
  const rightPan = 0.5 + pan * 0.4;

  for (let s = 0; s < totalSamples; s++) {
    const idx = (startSample + s) % NUM_SAMPLES;
    const t = s / SAMPLE_RATE;

    // Sweet singing envelope with gentle vibrato
    const attack = Math.min(1, t / 0.04);
    const release = Math.min(1, (durSec - t) / 0.08);
    const env = attack * release * Math.exp(-t * 0.8);

    // Warm vocal-like / cheerful whistle vibrato (5 Hz)
    const vibrato = Math.sin(2 * Math.PI * 5 * t) * 0.006 * Math.min(1, t * 2);
    const f = freq * (1 + vibrato);
    const p = 2 * Math.PI * f * t;

    // Cheerful whistle / flute / glockenspiel tone
    const val = (Math.sin(p) * 0.75 + Math.sin(p * 2) * 0.16 + Math.sin(p * 3) * 0.08) * env * gain;

    left[idx] += val * leftPan;
    right[idx] += val * rightPan;
  }
}

// 4. Cozy Woodblock / Tap (organic, joyful rhythm)
function addWoodblock(startBeat, gain = 0.04, pitch = 850) {
  const startSec = startBeat * BEAT_SEC;
  const durSec = 0.08;
  const startSample = Math.floor(startSec * SAMPLE_RATE);
  const totalSamples = Math.floor(durSec * SAMPLE_RATE);

  for (let s = 0; s < totalSamples; s++) {
    const idx = (startSample + s) % NUM_SAMPLES;
    const t = s / SAMPLE_RATE;
    const env = Math.exp(-t * 55);
    const val = Math.sin(2 * Math.PI * pitch * t) * env * gain;
    left[idx] += val * 0.5;
    right[idx] += val * 0.5;
  }
}

console.log('Synthesizing joyful, cheerful music...');

// Define Chords for 16 bars (2 bars each):
// 1-2: Cmaj7 | 3-4: Fmaj7 | 5-6: Dm9 | 7-8: G7 | 9-10: Em7 | 11-12: Am7 | 13-14: Dm7 | 15-16: G13->C
const BAR_CHORDS = [
  // Bar 0, 1: Cmaj7
  { bass: N.C2, chord: [N.G3, N.B3, N.E4, N.G4] },
  { bass: N.G2, chord: [N.G3, N.B3, N.E4, N.G4] },
  // Bar 2, 3: Fmaj7
  { bass: N.F2, chord: [N.A3, N.C4, N.E4, N.A4] },
  { bass: N.C3, chord: [N.A3, N.C4, N.E4, N.A4] },
  // Bar 4, 5: Dm9
  { bass: N.D2, chord: [N.F3, N.A3, N.C4, N.E4] },
  { bass: N.A2, chord: [N.F3, N.A3, N.C4, N.E4] },
  // Bar 6, 7: G7
  { bass: N.G2, chord: [N.F3, N.B3, N.D4, N.G4] },
  { bass: N.D3, chord: [N.F3, N.B3, N.D4, N.G4] },
  // Bar 8, 9: Em7
  { bass: N.E2, chord: [N.G3, N.B3, N.D4, N.G4] },
  { bass: N.B2, chord: [N.G3, N.B3, N.D4, N.G4] },
  // Bar 10, 11: Am7
  { bass: N.A2, chord: [N.G3, N.C4, N.E4, N.A4] },
  { bass: N.E3, chord: [N.G3, N.C4, N.E4, N.A4] },
  // Bar 12, 13: Dm7
  { bass: N.D2, chord: [N.F3, N.A3, N.C4, N.F4] },
  { bass: N.A2, chord: [N.F3, N.A3, N.C4, N.F4] },
  // Bar 14, 15: G7sus -> G7
  { bass: N.G2, chord: [N.F3, N.C4, N.D4, N.G4] },
  { bass: N.G2, chord: [N.F3, N.B3, N.D4, N.F4] },
];

// Render Rhythm, Bass, Chords
BAR_CHORDS.forEach((bar, bIdx) => {
  const startBeat = bIdx * 4;

  // Bouncy Bass on beats 0 and 2.5
  addBassNote(bar.bass, startBeat + 0, 1.2, 0.20);
  addBassNote(bar.bass * 1.5, startBeat + 2.5, 0.8, 0.14);

  // Joyful Kalimba Strum on offbeats: 1, 2, 3
  addKalimbaChord(bar.chord, startBeat + 1, 0.065, -0.2);
  addKalimbaChord(bar.chord, startBeat + 2.5, 0.05, 0.2);
  addKalimbaChord(bar.chord, startBeat + 3.5, 0.045, -0.1);

  // Woodblock taps on beats 2 and 4
  addWoodblock(startBeat + 1.0, 0.035, 750);
  addWoodblock(startBeat + 3.0, 0.038, 920);
});

// Cheerful singing melody (like a joyful cat whistling in the morning sunshine!)
// Phrases in 4-bar segments (beats)
const MELODY = [
  // Phrase 1: Cheerful morning hook
  { beat: 0.5, note: N.E5, dur: 0.75 },
  { beat: 1.5, note: N.G5, dur: 0.75 },
  { beat: 2.5, note: N.A5, dur: 1.0 },
  { beat: 4.0, note: N.G5, dur: 1.5 },
  { beat: 6.0, note: N.E5, dur: 1.0 },

  // Phrase 2: Playful bounce
  { beat: 8.5, note: N.F5, dur: 0.75 },
  { beat: 9.5, note: N.A5, dur: 0.75 },
  { beat: 10.5, note: N.C6, dur: 1.2 },
  { beat: 12.0, note: N.B5, dur: 1.2 },
  { beat: 14.0, note: N.G5, dur: 1.5 },

  // Phrase 3: Cheerful run down & up
  { beat: 16.5, note: N.A5, dur: 0.5 },
  { beat: 17.25, note: N.B5, dur: 0.5 },
  { beat: 18.0, note: N.C6, dur: 1.2 },
  { beat: 19.5, note: N.E5, dur: 0.8 },
  { beat: 20.5, note: N.G5, dur: 1.5 },
  { beat: 22.5, note: N.D5, dur: 1.0 },

  // Phrase 4: Happy resolution of part 1
  { beat: 24.5, note: N.E5, dur: 0.75 },
  { beat: 25.5, note: N.G5, dur: 0.75 },
  { beat: 26.5, note: N.D6, dur: 1.2 },
  { beat: 28.0, note: N.C6, dur: 2.5 },

  // Phrase 5 (Part B): Heartwarming variation
  { beat: 32.5, note: N.G5, dur: 0.75 },
  { beat: 33.5, note: N.C6, dur: 1.0 },
  { beat: 35.0, note: N.D6, dur: 1.0 },
  { beat: 36.5, note: N.E6, dur: 1.8 },
  { beat: 39.0, note: N.D6, dur: 0.8 },

  // Phrase 6: Sweet flutter
  { beat: 40.5, note: N.C6, dur: 0.75 },
  { beat: 41.5, note: N.A5, dur: 1.0 },
  { beat: 43.0, note: N.G5, dur: 1.2 },
  { beat: 45.0, note: N.E5, dur: 1.5 },

  // Phrase 7: Playful hop
  { beat: 48.5, note: N.D5, dur: 0.5 },
  { beat: 49.0, note: N.E5, dur: 0.5 },
  { beat: 49.75, note: N.F5, dur: 0.75 },
  { beat: 51.0, note: N.A5, dur: 1.0 },
  { beat: 52.5, note: N.G5, dur: 1.2 },
  { beat: 54.0, note: N.D5, dur: 1.5 },

  // Phrase 8: Grand joyful turnaround leading seamlessly to start
  { beat: 56.5, note: N.E5, dur: 0.6 },
  { beat: 57.5, note: N.G5, dur: 0.6 },
  { beat: 58.5, note: N.B5, dur: 0.8 },
  { beat: 59.5, note: N.D6, dur: 1.2 },
  { beat: 61.0, note: N.C6, dur: 2.5 }
];

MELODY.forEach(m => {
  addSingingNote(m.note, m.beat, m.dur, 0.09, 0.1);
});

// Seamless crossfade boundary (2 beats)
const crossfadeLen = Math.floor(2 * BEAT_SEC * SAMPLE_RATE);
for (let i = 0; i < crossfadeLen; i++) {
  const headIdx = i;
  const tailIdx = NUM_SAMPLES - crossfadeLen + i;
  const alpha = i / crossfadeLen;

  const mixedL = left[tailIdx] * (1 - alpha) + left[headIdx] * alpha;
  const mixedR = right[tailIdx] * (1 - alpha) + right[headIdx] * alpha;

  left[headIdx] = mixedL;
  right[headIdx] = mixedR;
  left[tailIdx] = mixedL;
  right[tailIdx] = mixedR;
}

// Normalize amplitude to prevent clipping (-2.5 dB)
let maxAmp = 0;
for (let i = 0; i < NUM_SAMPLES; i++) {
  maxAmp = Math.max(maxAmp, Math.abs(left[i]), Math.abs(right[i]));
}
console.log('Peak melody amplitude:', maxAmp);
const normGain = maxAmp > 0 ? 0.76 / maxAmp : 1;
const pcmLeft = new Int16Array(NUM_SAMPLES);
const pcmRight = new Int16Array(NUM_SAMPLES);

for (let i = 0; i < NUM_SAMPLES; i++) {
  pcmLeft[i] = Math.max(-32768, Math.min(32767, Math.floor(left[i] * normGain * 32767)));
  pcmRight[i] = Math.max(-32768, Math.min(32767, Math.floor(right[i] * normGain * 32767)));
}

// Write WAV
function writeWav(filePath) {
  const byteRate = SAMPLE_RATE * 4;
  const blockAlign = 4;
  const dataSize = NUM_SAMPLES * 4;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(2, 22); // Stereo
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // 16-bit
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < NUM_SAMPLES; i++) {
    buffer.writeInt16LE(pcmLeft[i], offset);
    buffer.writeInt16LE(pcmRight[i], offset + 2);
    offset += 4;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  console.log(`Wrote joyful WAV: ${filePath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
}

// Encode to MP3 using lamejs
function writeMp3(filePath) {
  const mp3encoder = new lamejs.Mp3Encoder(2, SAMPLE_RATE, 128);
  const mp3Data = [];
  const chunkSize = 1152;

  for (let i = 0; i < NUM_SAMPLES; i += chunkSize) {
    const leftChunk = pcmLeft.subarray(i, i + chunkSize);
    const rightChunk = pcmRight.subarray(i, i + chunkSize);
    const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    if (mp3buf.length > 0) {
      mp3Data.push(Buffer.from(mp3buf));
    }
  }

  const endBuf = mp3encoder.flush();
  if (endBuf.length > 0) {
    mp3Data.push(Buffer.from(endBuf));
  }

  const finalBuffer = Buffer.concat(mp3Data);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, finalBuffer);
  console.log(`Wrote joyful MP3: ${filePath} (${(finalBuffer.length / 1024).toFixed(1)} KB)`);
}

writeMp3('public/assets/audio/calm-ambient.mp3');
writeMp3('public/audio/calm-ambient.mp3');
writeWav('public/audio/calm-ambient.wav');

console.log('Joyful music successfully synthesized and saved!');
