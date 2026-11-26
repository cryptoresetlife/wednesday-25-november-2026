// Original vector drawings for the three lead stories of 25 November 2026 (323x132 panels).
export { ICON } from './icons.mjs';

const svg = (bg, inner) => `<svg viewBox="0 0 323 132" preserveAspectRatio="xMidYMid slice"><rect width="323" height="132" fill="${bg}"/>${inner}</svg>`;
const T = (x, y, s, txt, o = '') => `<text x="${x}" y="${y}" font-size="${s}" font-family="Segoe UI,Arial,sans-serif" ${o}>${txt}</text>`;

export const ART = {
  // US at the centre, proposed tariff arrows from the main targets
  tariffs: (c) => {
    const targets = [
      ['CHINA', '20%', 252, 28, true], ['EU', '', 252, 66], ['JAPAN', '', 252, 104],
      ['INDIA', '', 70, 28], ['TAIWAN', '', 70, 66], ['S. KOREA', '', 70, 104],
    ];
    let g = '';
    for (const [name, rate, x, y, hot] of targets) {
      const left = x < 160;
      const x2 = left ? 124 : 199;
      const x1 = left ? x + 34 : x - 34;
      g += `<line x1="${x2}" y1="66" x2="${x1}" y2="${y}" stroke="${hot ? '#b3412b' : c}" stroke-width="${hot ? 3 : 2}"/>`;
      g += `<rect x="${x - 36}" y="${y - (rate ? 15 : 12)}" width="72" height="${rate ? 30 : 24}" rx="3" fill="#fff" stroke="${hot ? '#b3412b' : c}" stroke-width="1.5"/>`;
      g += T(x, y + (rate ? -2 : 4), 11, name, `text-anchor="middle" font-weight="700" fill="#222"`);
      if (rate) g += T(x, y + 10, 10, rate + ' proposed', `text-anchor="middle" font-weight="700" fill="#b3412b"`);
    }
    return svg('#e9f0ea', `${g}
      <rect x="124" y="38" width="75" height="56" rx="4" fill="${c}"/>
      ${T(161.5, 62, 20, 'US', 'text-anchor="middle" font-weight="800" fill="#fff"')}
      ${T(161.5, 80, 10, 'TARIFFS', 'text-anchor="middle" font-weight="700" fill="#fff" letter-spacing="1"')}
      ${T(161.5, 126, 10, '14 economies named · earliest start January', 'text-anchor="middle" fill="#333" font-weight="600"')}`);
  },
  // falling bars for the day's index moves
  chips: (c) => {
    const rows = [['Kospi', 6.2], ['Taiwan', 4.8], ['Nikkei', 2.8], ['Hang Seng', 1.1]];
    let g = `<line x1="92" y1="18" x2="92" y2="122" stroke="#333" stroke-width="1.5"/>` + T(96, 14, 9, '0%', 'fill="#555"');
    rows.forEach(([n, v], i) => {
      const y = 24 + i * 25;
      g += T(86, y + 13, 11, n, 'text-anchor="end" font-weight="700" fill="#222"');
      g += `<rect x="92" y="${y}" width="${(v * 24).toFixed(0)}" height="18" fill="${i === 0 ? '#b3412b' : c}"/>`;
      g += T(98 + v * 24, y + 13, 12, `−${v}%`, 'font-weight="800" fill="#222"');
    });
    // a small chip with a crack
    g += `<g transform="translate(286,84) scale(.8)"><rect x="-22" y="-22" width="44" height="44" rx="3" fill="#333"/>` +
      [-14, -5, 4, 13].map((v) => `<path d="M${v} -28v6M${v} 22v6M-28 ${v}h6M22 ${v}h6" stroke="#333" stroke-width="2.5"/>`).join('') +
      `<path d="M-4 -22l6 12-8 8 9 9-4 15" fill="none" stroke="#f3d24a" stroke-width="2.5"/></g>`;
    g += T(318, 126, 10, 'SK Hynix −11.1%', 'text-anchor="end" font-weight="700" fill="#b3412b"');
    return svg('#efeaf4', g);
  },
  // overturned fuel tanker in flames on a ring road
  tanker: () => svg('#f3e7d6', `
    <path d="M0 98 Q160 84 323 98 V132 H0z" fill="#6b6259"/>
    <path d="M0 113 Q160 100 323 113" stroke="#f3e7d6" stroke-width="2" stroke-dasharray="12 9" fill="none"/>
    <path d="M110 60 q-10 -30 20 -42 q-4 18 14 22 q6 -22 26 -30 q-6 24 12 30 q14 -14 30 -12 q-14 16 0 34z" fill="#8a8178" opacity=".55"/>
    <g transform="translate(60 0) rotate(-14 150 92)">
      <rect x="92" y="66" width="122" height="34" rx="16" fill="#d9d4cb" stroke="#444" stroke-width="2"/>
      <rect x="214" y="70" width="34" height="30" rx="3" fill="#b03a2e" stroke="#444" stroke-width="2"/>
      <rect x="230" y="74" width="12" height="10" fill="#cfe3ef"/>
      <circle cx="120" cy="64" r="8" fill="#333"/><circle cx="190" cy="64" r="8" fill="#333"/><circle cx="234" cy="66" r="8" fill="#333"/>
    </g>
    <path d="M120 100 q-6 -30 14 -46 q0 18 12 20 q-2 -26 20 -40 q-2 26 16 32 q8 -16 22 -18 q-10 18 4 30 q10 -10 22 -10 q-8 16 2 32z" fill="#e4572e"/>
    <path d="M144 100 q0 -18 12 -28 q2 12 10 14 q2 -14 14 -22 q0 18 12 22 q6 -8 14 -8 q-6 12 2 22z" fill="#f2b134"/>
    ${T(14, 34, 32, '30', ' font-family="Georgia,serif" font-weight="800" fill="#b03a2e"')}
    ${T(14, 50, 10, 'DEAD', 'font-weight="700" fill="#333"')}
    ${T(14, 64, 10, '27 VEHICLES BURNED', 'font-weight="700" fill="#333"')}`),
};
