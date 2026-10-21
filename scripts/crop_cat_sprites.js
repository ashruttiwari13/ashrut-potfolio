const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

function isBgPixel(r, g, b, y, h) {
  // Screenshot bottom artifact
  if (y >= h - 12 && r < 120 && g < 120 && b < 120) return true;
  // White top background
  if (r > 240 && g > 240 && b > 240) return true;
  // Blue water
  if (b >= 200 && b > r + 15 && b >= g) return true;
  return false;
}

function processAndCrop(inputPath, outputPath) {
  const png = PNG.sync.read(fs.readFileSync(inputPath));
  const w = png.width, h = png.height;
  const isBg = new Uint8Array(w * h);
  const queue = [];

  for (let x = 0; x < w; x++) {
    if (isBgPixel(png.data[(0*w+x)*4], png.data[(0*w+x)*4+1], png.data[(0*w+x)*4+2], 0, h)) { isBg[x] = 1; queue.push([x, 0]); }
    if (isBgPixel(png.data[((h-1)*w+x)*4], png.data[((h-1)*w+x)*4+1], png.data[((h-1)*w+x)*4+2], h-1, h)) { isBg[(h-1)*w+x] = 1; queue.push([x, h-1]); }
  }
  for (let y = 0; y < h; y++) {
    if (isBgPixel(png.data[(y*w+0)*4], png.data[(y*w+0)*4+1], png.data[(y*w+0)*4+2], y, h)) { isBg[y*w] = 1; queue.push([0, y]); }
    if (isBgPixel(png.data[(y*w+w-1)*4], png.data[(y*w+w-1)*4+1], png.data[(y*w+w-1)*4+2], y, h)) { isBg[y*w+w-1] = 1; queue.push([w-1, y]); }
  }

  let head = 0;
  while(head < queue.length) {
    const [cx, cy] = queue[head++];
    const neighbors = [[cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const nidx = ny * w + nx;
        if (!isBg[nidx]) {
          const nr = png.data[nidx*4];
          const ng = png.data[nidx*4+1];
          const nb = png.data[nidx*4+2];
          if (isBgPixel(nr, ng, nb, ny, h)) {
            isBg[nidx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (!isBg[idx] && y < h - 12) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 6;
  const cropW = (maxX - minX + 1) + pad * 2;
  const cropH = (maxY - minY + 1) + pad * 2;
  const outPng = new PNG({ width: cropW, height: cropH });

  for (let cy = 0; cy < cropH; cy++) {
    for (let cx = 0; cx < cropW; cx++) {
      const srcX = minX - pad + cx;
      const srcY = minY - pad + cy;
      const outIdx = (cy * cropW + cx) * 4;

      if (srcX >= 0 && srcX < w && srcY >= 0 && srcY < h && !isBg[srcY * w + srcX] && srcY < h - 12) {
        const srcIdx = (srcY * w + srcX) * 4;
        outPng.data[outIdx] = png.data[srcIdx];
        outPng.data[outIdx + 1] = png.data[srcIdx + 1];
        outPng.data[outIdx + 2] = png.data[srcIdx + 2];
        outPng.data[outIdx + 3] = 255;
      } else {
        outPng.data[outIdx] = 0;
        outPng.data[outIdx + 1] = 0;
        outPng.data[outIdx + 2] = 0;
        outPng.data[outIdx + 3] = 0; // Transparent
      }
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, PNG.sync.write(outPng));
  console.log('Saved ' + outputPath + ' (' + cropW + 'x' + cropH + ')');
}

processAndCrop('C:/Users/Lenovo/.gemini/antigravity-ide/brain/c6385ded-dee3-426f-b7a5-f709b73d7f45/.user_uploaded/media_1792438712223.png', 'public/assets/cat_idle.png');
processAndCrop('C:/Users/Lenovo/.gemini/antigravity-ide/brain/c6385ded-dee3-426f-b7a5-f709b73d7f45/.user_uploaded/media_1792438785814.png', 'public/assets/cat_sing_1.png');
processAndCrop('C:/Users/Lenovo/.gemini/antigravity-ide/brain/c6385ded-dee3-426f-b7a5-f709b73d7f45/.user_uploaded/media_1792438785913.png', 'public/assets/cat_sing_2.png');
