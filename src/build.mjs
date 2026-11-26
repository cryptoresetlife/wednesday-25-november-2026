// Builds the one-page front page from src/day.mjs, writes src/page.html, then renders it to entry.png
// (1024x1024) with headless Chrome.  Run by hand after editing the day's stories:  node src/build.mjs
// The entry program main.ts never runs this; it only copies the finished entry.png.
import { writeFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { DAY } from './day.mjs';
import { ART, ICON } from './art.mjs';
import { worldPaths, project } from './world.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const REGION = {
  eu: ['EUROPE', '#2c5a9a'], me: ['MIDDLE EAST', '#b3412b'], af: ['AFRICA', '#b8720e'], as: ['ASIA', '#7d4aa8'],
  am: ['AMERICAS', '#2a8051'], oc: ['OCEANIA', '#17808f'], gl: ['WORLD', '#444'],
};

const stories = [...DAY.heroes, ...DAY.cards, ...DAY.briefs];
stories.forEach((s, i) => { s.n = i + 1; });
const tally = Object.keys(REGION)
  .map((r) => [r, stories.filter((s) => s.region === r).length])
  .filter(([, c]) => c)
  .map(([r, c]) => `${REGION[r][0]} ${c}`).join(' · ');

// every story names its field (trade, war, disaster...); the header counts the distinct ones
const fields = new Set(stories.map((s) => s.f).filter(Boolean)).size;
const badge = (n) => `<i class="n">${n}</i>`;
const col = (s) => REGION[s.region][1];

function map(w, h) {
  let pins = '';
  // later stories first so the headline pins sit on top
  for (const s of [...stories].reverse()) {
    if (s.lat === undefined) continue;
    const [x, y] = project(s.lon, s.lat, w, h);
    pins += `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><circle r="7.5" fill="${col(s)}" stroke="#fff" stroke-width="1.2"/>` +
      `<text y="3.3" text-anchor="middle" font-size="9" font-weight="700" fill="#fff">${s.n}</text></g>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#dfe8ec"/>` +
    `<path d="${worldPaths(w, h)}" fill="#efe6d2" stroke="#b9ad94" stroke-width=".7"/>${pins}</svg>`;
}

let b = '';
b += `<header><div class="top"><span>THE WORLD IN ONE DAY</span><span class="red">${esc(DAY.dayOfYear)}</span><span>${stories.length} STORIES · ${fields} FIELDS · ALL DATED ${esc(DAY.short)}</span></div>`;
b += `<h1>${esc(DAY.title)}</h1>`;
b += `<div class="tally">${tally}</div>`;
b += `<div class="lede">${DAY.lede.map(esc).join('<span class="dia">◆</span>')}</div></header>`;

b += '<section class="heroes">';
for (const s of DAY.heroes) {
  b += `<article class="hero"><div class="art">${ART[s.art](col(s))}</div>` +
    `<div class="kick"><span class="tag" style="background:${col(s)}">${esc(s.tag)}</span>${badge(s.n)}<span class="pl">${esc(s.place)}</span></div>` +
    `<h2>${esc(s.head)}</h2><p>${esc(s.text)}</p></article>`;
}
b += '</section>';

b += '<section class="cards">';
for (const s of DAY.cards) {
  b += `<article class="card" style="border-top-color:${col(s)}"><div class="ic">${ICON[s.icon](col(s))}<b>${esc(s.big)}</b><small>${esc(s.cap)}</small></div>` +
    `<div><div class="k" style="color:${col(s)}">${badge(s.n)}${esc(s.place)}</div><h3>${esc(s.head)}</h3><p>${esc(s.text)}</p></div></article>`;
}
b += '</section>';

// the brief list fills two columns on the right; whatever is left runs on under the map
const RIGHT = DAY.rightBriefs ?? DAY.briefs.length;
const brief = (s) => `<div>${badge(s.n)}<b>${esc(s.place)}</b> ${esc(s.line)}</div>`;
b += `<section class="low"><div class="mapbox"><div class="bh">WHERE · numbers match the stories</div>${map(372, DAY.mapHeight ?? 150)}`;
b += DAY.briefs.length > RIGHT ? `<div class="list one">${DAY.briefs.slice(RIGHT).map(brief).join('')}</div>` :
  `<div class="nums">${DAY.stats.map(([n, l]) => `<div><b>${esc(n)}</b><span>${esc(l)}</span></div>`).join('')}</div>`;
b += `</div><div class="briefs"><div class="bh">ALSO ON ${esc(DAY.short)}</div><div class="list">${DAY.briefs.slice(0, RIGHT).map(brief).join('')}</div></div></section>`;
b += `<footer>Every story above happened or was first reported on <b>${esc(DAY.title)}</b>, as reported by ${esc(DAY.sources)}. Drawings and map are original.</footer>`;

const css = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1024px;height:1024px;overflow:hidden;background:#f7f2e8;color:#15120e;font-family:"Segoe UI",Arial,sans-serif}
body{padding:9px 14px}
.top{display:flex;justify-content:space-between;font-size:11px;font-weight:700;letter-spacing:.08em;border-bottom:3px solid #221d16;padding-bottom:3px}
.red{color:#a8261b}
h1{font-family:Georgia,serif;font-size:64px;line-height:1;text-align:center;letter-spacing:-1px;margin:5px 0 3px}
.tally{text-align:center;font-size:11px;font-weight:700;letter-spacing:.06em;border-top:1px solid #221d16;border-bottom:1px solid #221d16;padding:2px 0}
.lede{text-align:center;font-family:Georgia,serif;font-style:italic;font-size:18px;white-space:nowrap;margin:4px 0 6px}
.dia{color:#a8261b;font-style:normal;margin:0 8px;font-size:13px}
.n{display:inline-flex;align-items:center;justify-content:center;width:17px;height:17px;border-radius:50%;background:#15120e;color:#fff;font-style:normal;font-size:10px;font-weight:700;flex:none;margin-right:5px}
.heroes{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;border-top:2px solid #221d16;padding-top:7px}
.art svg{display:block;width:100%;height:132px;border:1px solid #221d16}
.kick{display:flex;align-items:center;gap:6px;margin-top:5px;font-size:11px;font-weight:700;letter-spacing:.04em}
.tag{color:#fff;padding:1px 6px}
.pl{color:#5a5246}
.hero h2{font-family:Georgia,serif;font-size:24px;line-height:1.07;margin:3px 0 3px}
.hero p{font-size:12.5px;line-height:1.27}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:9px}
.card{display:flex;gap:7px;border-top:4px solid;background:#fcf9f2;padding:5px 6px 6px;min-height:96px}
.ic{width:62px;flex:none;text-align:center}
.ic svg{width:40px;height:40px;display:block;margin:2px auto 0}
.ic b{display:block;font-family:Georgia,serif;font-size:19px;line-height:1.05;white-space:nowrap}
.ic small{display:block;font-size:9px;text-transform:uppercase;letter-spacing:.04em;color:#5a5246;line-height:1.1}
.k{display:flex;align-items:center;font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase}
.card h3{font-family:Georgia,serif;font-size:16.5px;line-height:1.1;margin:3px 0 2px}
.card p{font-size:11.5px;line-height:1.25}
.low{display:grid;grid-template-columns:372px 1fr;gap:14px;margin-top:9px}
.bh{display:inline-block;background:#15120e;color:#fff;font-size:11px;font-weight:700;letter-spacing:.06em;padding:2px 7px;margin-bottom:4px}
.mapbox svg{display:block;border:1px solid #221d16}
.nums{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:5px}
.nums div{border-left:3px solid #a8261b;padding:1px 0 1px 5px;line-height:1.1}
.nums b{display:block;font-family:Georgia,serif;font-size:19px}
.nums span{font-size:9.5px;color:#5a5246}
.list{columns:2;column-gap:14px;font-size:11.5px;line-height:1.2}
.list div{display:flex;align-items:flex-start;break-inside:avoid;margin-bottom:4.5px}
.list b{margin-right:4px;white-space:nowrap}
.list{font-size:11.3px}
.list div{margin-bottom:2.2px;white-space:nowrap}
.list .n{width:15px;height:15px;font-size:9px}
.list.one{columns:1;margin-top:6px}
footer{position:absolute;left:14px;right:14px;bottom:7px;border-top:1px solid #221d16;padding-top:3px;font-size:10px;color:#5a5246;text-align:center}
`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(DAY.title)}</title><style>${css}</style></head><body>${b}</body></html>`;
const pagePath = join(here, 'page.html');
writeFileSync(pagePath, html);

const chrome = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find((p) => existsSync(p));
if (!chrome) throw new Error('Chrome not found; set CHROME=<path>');
const out = join(here, '..', 'entry.png');
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1024,1024', '--virtual-time-budget=2000', `--screenshot=${out}`, pathToFileURL(pagePath).href], { stdio: 'ignore' });
const size = statSync(out).size;
console.log(`entry.png: ${size} bytes, ${stories.length} stories (${tally})`);
if (size > 1048576) throw new Error('entry.png is over 1 MiB');
