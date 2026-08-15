const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

const OUT = path.join(__dirname, "..", "public");

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function fillRect(data, w, x0, y0, x1, y1, r, g, b, a = 255) {
  const left = Math.max(0, Math.floor(x0));
  const top = Math.max(0, Math.floor(y0));
  const right = Math.min(w, Math.ceil(x1));
  const bottom = Math.min(data.length / (w * 4), Math.ceil(y1));
  for (let y = top; y < bottom; y++) {
    for (let x = left; x < right; x++) {
      const i = (y * w + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = a;
    }
  }
}

function roundedRect(data, size, x, y, rw, rh, radius, r, g, b) {
  const r2 = radius * radius;
  for (let py = y; py < y + rh; py++) {
    for (let px = x; px < x + rw; px++) {
      const lx = px - x;
      const ly = py - y;
      let inside = true;
      if (lx < radius && ly < radius) {
        const dx = radius - lx;
        const dy = radius - ly;
        inside = dx * dx + dy * dy <= r2;
      } else if (lx >= rw - radius && ly < radius) {
        const dx = lx - (rw - radius - 1);
        const dy = radius - ly;
        inside = dx * dx + dy * dy <= r2;
      } else if (lx < radius && ly >= rh - radius) {
        const dx = radius - lx;
        const dy = ly - (rh - radius - 1);
        inside = dx * dx + dy * dy <= r2;
      } else if (lx >= rw - radius && ly >= rh - radius) {
        const dx = lx - (rw - radius - 1);
        const dy = ly - (rh - radius - 1);
        inside = dx * dx + dy * dy <= r2;
      }
      if (inside) {
        const i = (py * size + px) * 4;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;
      }
    }
  }
}

function drawMark(size) {
  const data = Buffer.alloc(size * size * 4);
  const s = size / 64;
  roundedRect(data, size, 0, 0, size, size, Math.round(16 * s), 27, 27, 26);
  const cream = [244, 239, 228];
  const accent = [216, 93, 51];
  fillRect(data, size, 17 * s, 11 * s, 26 * s, 53 * s, ...cream);
  fillRect(data, size, 38 * s, 11 * s, 47 * s, 53 * s, ...cream);
  fillRect(data, size, 17 * s, 29 * s, 47 * s, 37 * s, ...accent);
  const cx = 48.6 * s;
  const cy = 16.4 * s;
  const rad = 2.4 * s;
  for (let y = Math.floor(cy - rad - 1); y <= cy + rad + 1; y++) {
    for (let x = Math.floor(cx - rad - 1); x <= cx + rad + 1; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= rad * rad && x >= 0 && y >= 0 && x < size && y < size) {
        const i = (y * size + x) * 4;
        data[i] = accent[0];
        data[i + 1] = accent[1];
        data[i + 2] = accent[2];
        data[i + 3] = 255;
      }
    }
  }
  return encodePng(size, size, data);
}

function writeIco(png32) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry[0] = 32;
  entry[1] = 32;
  entry[2] = 0;
  entry[3] = 0;
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png32.length, 8);
  entry.writeUInt32LE(22, 12);
  return Buffer.concat([header, entry, png32]);
}

const png32 = drawMark(32);
fs.writeFileSync(path.join(OUT, "favicon.ico"), writeIco(png32));
fs.writeFileSync(path.join(OUT, "apple-touch-icon.png"), drawMark(180));
fs.writeFileSync(path.join(OUT, "logo192.png"), drawMark(192));
fs.writeFileSync(path.join(OUT, "logo512.png"), drawMark(512));
console.log("Wrote favicon and logo assets");
