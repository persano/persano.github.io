#!/usr/bin/env node
/**
 * make-webp.mjs — raw ADB PNG captures -> lean WebP gallery assets (D-54).
 *
 * Usage: node scripts/make-webp.mjs <raw-capture-directory>
 *
 * For each of the four pinned raw capture names (raw-screenshot.<name>.png,
 * name in menu / map / flags / timeline — D-52):
 *   1. load with sharp (missing/corrupt input = loud non-zero exit, Pitfall 2),
 *   2. apply the per-shot extract crop ONLY where Task 1 recorded an approved
 *      framing decision (see CROPS below — empty when shots were approved
 *      as framed),
 *   3. encode WebP at quality 82 (05-RESEARCH A3),
 *   4. write geohist/screenshots/screenshot.<name>.webp,
 *   5. read back metadata and log name + pixel dimensions + byte size
 *      (the gallery task consumes the dimensions for width/height attrs).
 *
 * If an output exceeds ~300 KB it is downscaled to a lean width (A4) and
 * re-logged; a still-overweight output fails the run.
 *
 * Raw PNGs live OUTSIDE the repo (owner temp dir) and are never committed —
 * this script is the only bridge between them and the pinned WebP paths
 * that 05-02's JSON-LD screenshot array will cite.
 */
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import sharp from 'sharp';

const RAW_NAMES = ['menu', 'map', 'flags', 'timeline'];
const OUT_DIR = join(process.cwd(), 'geohist', 'screenshots');
const QUALITY = 82;
const MAX_BYTES = 300 * 1024;
const DOWNSCALE_WIDTH = 720;

/**
 * Per-shot approved framing crops, keyed by shot name (sharp extract coords).
 * Task 1 (ADB capture, 2026-09-03) recorded NO crop decisions — all four
 * shots were owner-approved as framed on the 720x1600 panel — so this map
 * is intentionally empty. If the owner later approves a crop for a shot,
 * add e.g.  menu: { left: 0, top: 60, width: 720, height: 1540 }  here.
 */
const CROPS = {};

const rawDir = process.argv[2];
if (!rawDir) {
  console.error('make-webp: usage — node scripts/make-webp.mjs <raw-capture-directory>');
  process.exit(1);
}
const rawDirAbs = resolve(rawDir);
if (!existsSync(rawDirAbs)) {
  console.error(`make-webp: FATAL — raw capture directory not found: ${rawDirAbs}`);
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

let failed = false;

for (const name of RAW_NAMES) {
  const src = join(rawDirAbs, `raw-screenshot.${name}.png`);
  const outPath = join(OUT_DIR, `screenshot.${name}.webp`);
  try {
    if (!existsSync(src)) {
      throw new Error(`missing raw input: ${src}`);
    }
    const crop = CROPS[name];
    let pipeline = sharp(src);
    if (crop) pipeline = pipeline.extract(crop);
    await pipeline.webp({ quality: QUALITY }).toFile(outPath);

    let meta = await sharp(outPath).metadata();
    let bytes = statSync(outPath).size;

    if (bytes > MAX_BYTES) {
      const meta0 = meta;
      const targetWidth = Math.min(DOWNSCALE_WIDTH, meta0.width);
      let repipe = sharp(src);
      if (crop) repipe = repipe.extract(crop);
      await repipe.resize({ width: targetWidth }).webp({ quality: QUALITY }).toFile(outPath);
      meta = await sharp(outPath).metadata();
      bytes = statSync(outPath).size;
      console.log(`make-webp: ${name} was over ${MAX_BYTES} B — downscaled to ${targetWidth}px wide`);
    }

    if (bytes > MAX_BYTES) {
      console.error(`make-webp: FAIL — screenshot.${name}.webp still ${bytes} B after downscale (limit ${MAX_BYTES} B)`);
      failed = true;
      continue;
    }

    console.log(`make-webp: screenshot.${name}.webp  ${meta.width}x${meta.height}  ${bytes} bytes`);
  } catch (err) {
    console.error(`make-webp: FAIL — ${name}: ${err.message}`);
    failed = true;
  }
}

if (failed) {
  console.error('make-webp: conversion failed for one or more captures — no partial success exit');
  process.exit(1);
}
console.log(`make-webp: OK — 4 WebPs written to ${OUT_DIR}`);
