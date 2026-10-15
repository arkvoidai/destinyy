import fs from 'fs';
import path from 'path';

let errors = [];

// 1. Load tokens from tokens.css
const tokensCssPath = path.resolve('src/styles/tokens.css');
const tokensContent = fs.readFileSync(tokensCssPath, 'utf8');

// Collect all defined hex colors in tokens.css (case-insensitive lowercase)
const allowedHexes = new Set();
const hexRegex = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
let m;
while ((m = hexRegex.exec(tokensContent)) !== null) {
  let hex = m[0].toLowerCase();
  if (hex.length === 4) {
    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  allowedHexes.add(hex);
}

// Convert hex to HSL hue (0-360) and sat (0-1)
function hexToHueAndSat(hex) {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

// Reject blue, green, purple, pink and teal families:
function isForbiddenHue(hex) {
  const { h, s, l } = hexToHueAndSat(hex);
  if (s < 0.12) return false; // neutral/grey/achromatic

  // Green family: 65 to 160
  if (h >= 65 && h <= 160) return `green family (hue ${h})`;
  // Teal family: 160 to 195
  if (h > 160 && h < 195) return `teal family (hue ${h})`;
  // Light / bright / saturated blue (reject pure blues outside dark cadet)
  if (h >= 195 && h <= 255 && (s > 0.55 || l > 0.35)) return `blue family (hue ${h}, s ${s.toFixed(2)}, l ${l.toFixed(2)})`;
  // Purple family: 255 to 305
  if (h > 255 && h <= 305) return `purple family (hue ${h})`;
  // Pink / magenta family: 305 to 345
  if (h > 305 && h <= 345) return `pink family (hue ${h})`;

  return false;
}

// Validate defined tokens against forbidden hues
for (const hex of allowedHexes) {
  const forbidden = isForbiddenHue(hex);
  if (forbidden) {
    errors.push(`tokens.css contains forbidden hue: ${hex} (${forbidden})`);
  }
}

// 2. Banned words and country names list
const bannedWords = [
  'synergy',
  'disrupt',
  'disruption',
  'revolutionary',
  'paradigm',
  'game-changer',
  'game changer',
  'groundbreaking',
  'cutting-edge',
  'cutting edge',
  'best-in-class',
  'best in class',
  'seamless',
  'supercharge',
  'hyper-growth',
  'stealth mode',
  'unicorns',
  'unicorn',
  'metaverse',
  'crypto',
  'web3',
  'blockchain',
  'nft',
  'nfts',
];

const countryNames = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China', 'Colombia',
  'Denmark', 'Egypt', 'Finland', 'France', 'Germany', 'Greece', 'India',
  'Indonesia', 'Ireland', 'Israel', 'Italy', 'Japan', 'Kenya', 'Mexico',
  'Netherlands', 'New Zealand', 'Nigeria', 'Norway', 'Pakistan', 'Philippines',
  'Poland', 'Portugal', 'Russia', 'Saudi Arabia', 'Singapore', 'South Africa',
  'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Turkey',
  'Ukraine', 'United Kingdom', 'United States', 'Vietnam'
];

// Emoji regex
const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/u;

function walkDir(dir, cb) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(full, cb);
    } else {
      cb(full);
    }
  }
}

walkDir('src', (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const ext = path.extname(filePath);
  const isCss = ext === '.css';
  const isTsx = ext === '.tsx';
  const isTokens = filePath.endsWith('tokens.css');

  // Rule A: uppercase text-transform in CSS
  if (isCss) {
    lines.forEach((line, idx) => {
      const stripped = line.replace(/\/\*.*?\*\//g, '');
      if (/text-transform\s*:\s*uppercase/i.test(stripped)) {
        errors.push(`${filePath}:${idx + 1}: Found uppercase text-transform`);
      }
    });
  }

  // Rule B: "ARKVOID" in text or code (must be "Arkvoid")
  lines.forEach((line, idx) => {
    if (line.includes('ARKVOID')) {
      errors.push(`${filePath}:${idx + 1}: Found uppercase ARKVOID (must be Arkvoid)`);
    }
  });

  // Rule C: hex colors in css/tsx that are not defined in tokens.css
  if (!isTokens && (isCss || isTsx)) {
    lines.forEach((line, idx) => {
      const stripped = line.replace(/\/\*.*?\*\//g, '').replace(/\/\/.*$/g, '');
      const matches = stripped.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g);
      if (matches) {
        for (const rawHex of matches) {
          let hex = rawHex.toLowerCase();
          if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
          }
          if (!allowedHexes.has(hex)) {
            errors.push(`${filePath}:${idx + 1}: Hex color ${rawHex} is not defined in tokens.css`);
          } else {
            const forbidden = isForbiddenHue(hex);
            if (forbidden) {
              errors.push(`${filePath}:${idx + 1}: Hex color ${rawHex} has forbidden hue: ${forbidden}`);
            }
          }
        }
      }
    });
  }

  // Rule D: Emoji
  lines.forEach((line, idx) => {
    if (emojiRegex.test(line)) {
      errors.push(`${filePath}:${idx + 1}: Found forbidden emoji`);
    }
  });

  // Rule E: Banned words
  lines.forEach((line, idx) => {
    const lower = line.toLowerCase();
    for (const word of bannedWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(lower)) {
        errors.push(`${filePath}:${idx + 1}: Found banned word "${word}"`);
      }
    }
  });

  // Rule F: Country names
  lines.forEach((line, idx) => {
    for (const country of countryNames) {
      const regex = new RegExp(`\\b${country}\\b`, 'i');
      if (regex.test(line)) {
        errors.push(`${filePath}:${idx + 1}: Found country name "${country}"`);
      }
    }
  });

  // Rule G: In components (src/sections, src/components), check for hard-coded sentences of 5 or more words inside JSX
  const isComponent = (filePath.includes('/sections/') || filePath.includes('/components/')) && isTsx;
  if (isComponent) {
    lines.forEach((line, idx) => {
      // Ignore lines that are comments or attribute declarations
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;
      if (trimmed.includes('onClick=') || trimmed.includes('href=') || trimmed.includes('style=')) return;

      // Extract text content directly enclosed by JSX tags, e.g. >Some text here<
      const textMatches = line.match(/>([^<>{}\n]+)</g);
      if (textMatches) {
        for (const tm of textMatches) {
          const raw = tm.slice(1, -1).trim();
          // Skip if it contains javascript expressions or operators
          if (raw.includes('=>') || raw.includes('||') || raw.includes('&&') || raw.includes('===')) continue;
          if (raw.length > 0) {
            const words = raw.split(/\s+/).filter(Boolean);
            if (words.length >= 5) {
              errors.push(`${filePath}:${idx + 1}: Hard-coded sentence of 5+ words: "${raw}" (must come from copy.ts)`);
            }
          }
        }
      }
    });
  }

  // Rule H: Any alt value rendered as visible text
  if (isComponent) {
    const altMatch = content.match(/alt=["']([^"']{6,})["']/);
    if (altMatch) {
      const altText = altMatch[1];
      const escaped = altText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const visibleRegex = new RegExp(`>\\s*${escaped}\\s*<`, 'i');
      if (visibleRegex.test(content)) {
        errors.push(`${filePath}: Alt text "${altText}" is rendered as visible text`);
      }
    }
  }
});

if (errors.length > 0) {
  console.error(`[check-copy] FAILED with ${errors.length} error(s):`);
  errors.forEach((err) => console.error(`  - ${err}`));
  process.exit(1);
} else {
  console.log('[check-copy] All copy and token checks passed cleanly.');
  process.exit(0);
}
