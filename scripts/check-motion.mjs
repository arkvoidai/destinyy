import fs from 'fs';
import path from 'path';

let errors = [];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const ext = path.extname(filePath);
  const isCss = ext === '.css';
  const isMotionCss = filePath.endsWith('motion.css');
  const isHero = filePath.includes('Hero') || filePath.includes('hero');

  // Rule 9: !important in motion.css
  if (isMotionCss) {
    lines.forEach((line, idx) => {
      // Ignore comments
      const stripped = line.replace(/\/\*.*?\*\//g, '');
      if (stripped.includes('!important')) {
        errors.push(`${filePath}:${idx + 1}: Found !important in motion.css`);
      }
    });
  }

  // Rule 1: transition: all or transition-property: all
  lines.forEach((line, idx) => {
    const stripped = line.replace(/\/\*.*?\*\//g, '');
    if (/transition(-property)?\s*:\s*([^;]*\b)?all\b/i.test(stripped)) {
      errors.push(`${filePath}:${idx + 1}: Forbidden transition: all`);
    }
  });

  // Rule 2: Forbidden transition / animation properties
  const forbiddenProps = [
    'width',
    'height',
    'top',
    'left',
    'right',
    'bottom',
    'margin',
    'padding',
    'box-shadow',
    'filter',
    'backdrop-filter',
    'background-color',
  ];

  if (isCss) {
    lines.forEach((line, idx) => {
      const stripped = line.replace(/\/\*.*?\*\//g, '');
      if (/transition(-property)?\s*:/i.test(stripped)) {
        for (const prop of forbiddenProps) {
          const reg = new RegExp(`(^|[,\\s])${prop}([\\s,;]|$)`, 'i');
          if (reg.test(stripped)) {
            errors.push(`${filePath}:${idx + 1}: Forbidden transition property "${prop}"`);
          }
        }
      }
    });
  }

  // Rule 3: infinite iteration counts
  lines.forEach((line, idx) => {
    const stripped = line.replace(/\/\*.*?\*\//g, '');
    if (/animation(-iteration-count)?\s*:[^;]*\binfinite\b/i.test(stripped)) {
      errors.push(`${filePath}:${idx + 1}: Forbidden infinite animation iteration count`);
    }
  });

  // Rule 4: will-change outside short allow-list: transform, opacity, clip-path
  if (isCss) {
    lines.forEach((line, idx) => {
      const stripped = line.replace(/\/\*.*?\*\//g, '');
      const match = stripped.match(/will-change\s*:\s*([^;]+);/i);
      if (match && match[1]) {
        const props = match[1].split(',').map((p) => p.trim());
        const allowed = ['transform', 'opacity', 'clip-path', 'auto'];
        for (const p of props) {
          if (!allowed.includes(p)) {
            errors.push(`${filePath}:${idx + 1}: Forbidden will-change property "${p}"`);
          }
        }
      }
    });
  }

  // Rule 6: setInterval
  lines.forEach((line, idx) => {
    const stripped = line.replace(/\/\/.*/, '').replace(/\/\*.*?\*\//g, '');
    if (/\bsetInterval\s*\(/.test(stripped)) {
      errors.push(`${filePath}:${idx + 1}: Forbidden setInterval found`);
    }
  });

  // Rule 7: requestAnimationFrame loop outside createIdleLoop & motion engine helpers
  if (!isCss && !filePath.includes('motion.ts') && !filePath.includes('ScrollProgress.tsx')) {
    lines.forEach((line, idx) => {
      const stripped = line.replace(/\/\/.*/, '').replace(/\/\*.*?\*\//g, '');
      if (/\brequestAnimationFrame\s*\(/.test(stripped)) {
        // If it's a loop re-calling rAF
        errors.push(`${filePath}:${idx + 1}: requestAnimationFrame loop must use createIdleLoop`);
      }
    });
  }

  // Rule 8: hard-coded durations over 1500ms outside hero
  if (isCss && !isHero) {
    lines.forEach((line, idx) => {
      const stripped = line.replace(/\/\*.*?\*\//g, '');
      const match = stripped.match(/\b(\d+)(ms|s)\b/g);
      if (match) {
        for (const m of match) {
          let ms = 0;
          if (m.endsWith('ms')) {
            ms = parseInt(m, 10);
          } else if (m.endsWith('s')) {
            ms = parseFloat(m) * 1000;
          }
          if (ms > 1500) {
            errors.push(`${filePath}:${idx + 1}: Hardcoded duration ${m} > 1500ms outside hero`);
          }
        }
      }
    });
  }
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        scanDir(full);
      }
    } else if (/\.(css|ts|tsx)$/.test(entry.name)) {
      checkFile(full);
    }
  }
}

// Rule 5: more than one addEventListener('scroll')
function checkGlobalScrollListeners() {
  let scrollCount = 0;
  function countScroll(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
          countScroll(full);
        }
      } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) {
        const content = fs.readFileSync(full, 'utf8');
        const matches = content.match(/addEventListener\s*\(\s*['"]scroll['"]/g);
        if (matches) {
          scrollCount += matches.length;
        }
      }
    }
  }
  countScroll('src');
  if (scrollCount > 1) {
    errors.push(`Found ${scrollCount} scroll event listeners in src/. Maximum allowed is 1.`);
  }
}

console.log('[check-motion] Scanning src directory...');
scanDir('src');
checkGlobalScrollListeners();

if (errors.length > 0) {
  console.error('[check-motion] Found motion violations:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log('[check-motion] All motion checks passed cleanly.');
  process.exit(0);
}
