// The world's news of Wednesday 25 November 2026 on one image.
// src/day.mjs holds the day's stories; src/build.mjs lays them out (src/art.mjs, src/world.mjs) and rendered entry.png once.
// The program itself needs no network: it copies that PNG to the output directory, so every run writes the same bytes.
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
copyFileSync(new URL('./entry.png', import.meta.url), join(outDir, 'entry.png'));
