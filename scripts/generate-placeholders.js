#!/usr/bin/env node
/**
 * Generates simple solid-color placeholder PNGs for the app and driver images.
 * These are intentionally minimal and MUST be replaced with real branding
 * before publishing to the Homey App Store (see specs/release-checklist.md).
 *
 * Usage: node scripts/generate-placeholders.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const BRAND = { r: 0x4a, g: 0x6c, b: 0xf7 }; // matches brandColor in .homeycompose/app.json

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function makePng(width, height, colorAt) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor RGB
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    const row = y * (1 + width * 3);
    raw[row] = 0; // filter: none
    for (let x = 0; x < width; x++) {
      const { r, g, b } = colorAt(x, y, width, height);
      const o = row + 1 + x * 3;
      raw[o] = r;
      raw[o + 1] = g;
      raw[o + 2] = b;
    }
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Brand background with a lighter centered square, so the placeholder is
// recognizable as intentional rather than a broken image.
function placeholderColor(x, y, w, h) {
  const inSquare = x > w * 0.3 && x < w * 0.7 && y > h * 0.3 && y < h * 0.7;
  if (inSquare) {
    return { r: 0xff, g: 0xff, b: 0xff };
  }
  return BRAND;
}

function writePng(file, width, height) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, makePng(width, height, placeholderColor));
  process.stdout.write(`wrote ${file} (${width}x${height})\n`);
}

const root = path.join(__dirname, '..');

// App images (Homey App Store sizes)
writePng(path.join(root, 'assets/images/small.png'), 250, 175);
writePng(path.join(root, 'assets/images/large.png'), 500, 350);
writePng(path.join(root, 'assets/images/xlarge.png'), 1000, 700);

// Driver images (same placeholder for every driver)
const drivers = [
  'virtual-boolean',
  'virtual-button',
  'virtual-number',
  'virtual-string',
  'virtual-temperature',
  'virtual-power',
  'virtual-battery',
  'virtual-humidity',
  'virtual-luminance',
  'virtual-pressure',
  'virtual-co2',
  'virtual-contact',
  'virtual-motion',
  'virtual-dimmer',
  'virtual-energy',
];
for (const driver of drivers) {
  writePng(path.join(root, `drivers/${driver}/assets/images/small.png`), 75, 75);
  writePng(path.join(root, `drivers/${driver}/assets/images/large.png`), 500, 500);
  writePng(path.join(root, `drivers/${driver}/assets/images/xlarge.png`), 1000, 1000);
}
