const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const PNG = require('pngjs').PNG;

function processCatImage(jpegPath, outPngPath) {
  const jpegData = fs.readFileSync(jpegPath);
  const raw = jpeg.decode(jpegData, { useTArray: true });
  const w = raw.width;
  const h = raw.height;

  // Identify background: outside the sticker
  // The outside background is plain solid white / near white (r > 245, g > 245, b > 245)
  // Flood fill from all 4 borders
  const isBg = new Uint8Array(w * h);
  const queue = [];

  function isWhite(x, y) {
    if (x < 0 || x >= w || y < 0 || y >= h) return false;
    const idx = (y * w + x) * 4;
    return raw.data[idx] > 240 && raw.data[idx+1] > 240 && raw.data[idx+2] > 240;
  }

  for (let x = 0; x < w; x++) {
    if (isWhite(x, 0)) { isBg[x] = 1; queue.push([x, 0]); }
    if (isWhite(x, h - 1)) { isBg[(h - 1) * w + x] = 1; queue.push([x, h - 1]); }
  }
  for (let y = 0; y < h; y++) {
    if (isWhite(0, y)) { isBg[y * w] = 1; queue.push([0, y]); }
    if (isWhite(w - 1, y)) { isBg[y * w + w - 1] = 1; queue.push([w - 1, y]); }
  }

  let head = 0;
  while(head < queue.length) {
    const [cx, cy] = queue[head++];
    const neighbors = [[cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nidx = ny * w + nx;
        if (!isBg[nidx] && isWhite(nx, ny)) {
          isBg[nidx] = 1;
          queue.push([nx, ny]);
        }
      }
    }
  }

  // Find bounding box
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!isBg[idx]) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 8;
  const cropW = (maxX - minX + 1) + pad * 2;
  const cropH = (maxY - minY + 1) + pad * 2;
  const outPng = new PNG({ width: cropW, height: cropH });

  for (let cy = 0; cy < cropH; cy++) {
    for (let cx = 0; cx < cropW; cx++) {
      const sx = minX - pad + cx;
      const sy = minY - pad + cy;
      const outIdx = (cy * cropW + cx) * 4;

      if (sx >= 0 && sx < w && sy >= 0 && sy < h && !isBg[sy * w + sx]) {
        const srcIdx = (sy * w + sx) * 4;
        outPng.data[outIdx] = raw.data[srcIdx];
        outPng.data[outIdx + 1] = raw.data[srcIdx + 1];
        outPng.data[outIdx + 2] = raw.data[srcIdx + 2];
        outPng.data[outIdx + 3] = 255;
      } else {
        outPng.data[outIdx] = 0;
        outPng.data[outIdx + 1] = 0;
        outPng.data[outIdx + 2] = 0;
        outPng.data[outIdx + 3] = 0; // Transparent
      }
    }
  }

  fs.mkdirSync(path.dirname(outPngPath), { recursive: true });
  fs.writeFileSync(outPngPath, PNG.sync.write(outPng));
  console.log(`Saved transparent cat to ${outPngPath} (${cropW}x${cropH})`);
}

const idleJpg = 'C:/Users/Lenovo/.gemini/antigravity-ide/brain/c6385ded-dee3-426f-b7a5-f709b73d7f45/chibi_cat_idle_1792439883326.jpg';
const singJpg1 = 'C:/Users/Lenovo/.gemini/antigravity-ide/brain/c6385ded-dee3-426f-b7a5-f709b73d7f45/chibi_cat_singing_1792439911298.jpg';
const singJpg2 = 'C:/Users/Lenovo/.gemini/antigravity-ide/brain/c6385ded-dee3-426f-b7a5-f709b73d7f45/chibi_cat_sing_frame2_1792440331033.jpg';

processCatImage(idleJpg, 'public/assets/cat_idle.png');
processCatImage(singJpg1, 'public/assets/cat_sing_1.png');
processCatImage(singJpg2, 'public/assets/cat_sing_2.png');
