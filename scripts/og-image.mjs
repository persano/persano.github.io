// OG image generator (D-57/D-58/D-59, Phase 05 Plan 05-02).
// Composes geohist/icon.png onto a 1200x630 antique canvas using the exact
// design tokens from css/base.css (:root):
//   --color-bg      #1a1410   (canvas base)
//   --color-fg      #f0e6d2   (parchment title)
//   --color-muted   #c9b89a   (tagline)
//   --color-accent  #d9a951   (gold frame/rule accents)
//   --font-display  Georgia, "Times New Roman", serif
// Text is baked pixels — static EN only (D-58; no i18n possible for images).
// Run: npm run og:image  (from the repo root)
import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const ICON_SIZE = 176;
const ICON_LEFT = Math.round((WIDTH - ICON_SIZE) / 2); // 512
const ICON_TOP = 84;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#1a1410"/>
  <rect x="30" y="30" width="${WIDTH - 60}" height="${HEIGHT - 60}" fill="none" stroke="#d9a951" stroke-width="2"/>
  <rect x="42" y="42" width="${WIDTH - 84}" height="${HEIGHT - 84}" fill="none" stroke="#f0e6d2" stroke-opacity="0.22" stroke-width="1"/>
  <text x="${WIDTH / 2}" y="404" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="86" font-weight="bold" fill="#f0e6d2">GeoHist Trivia</text>
  <text x="${WIDTH / 2}" y="478" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="34" fill="#c9b89a">Pack your bags — we're traveling through time.</text>
  <rect x="520" y="530" width="160" height="2" fill="#d9a951"/>
</svg>`;

const icon = await sharp('geohist/icon.png')
  .resize(ICON_SIZE, ICON_SIZE)
  .png()
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([{ input: icon, left: ICON_LEFT, top: ICON_TOP }])
  .png()
  .toFile('geohist/og-image.png');

const meta = await sharp('geohist/og-image.png').metadata();
console.log(`geohist/og-image.png written: ${meta.width}x${meta.height}`);
