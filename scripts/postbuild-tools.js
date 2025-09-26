import fs from 'fs';
import path from 'path';

// This script copies index.html to 404.html and writes Netlify _redirects file
// to enable SPA routing on static hosts (GitHub Pages, Netlify, Vercel).

const publicDir = path.resolve(process.cwd(), 'dist', 'public');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(publicDir);

const indexPath = path.join(publicDir, 'index.html');
const notFoundPath = path.join(publicDir, '404.html');
const redirectsPath = path.join(publicDir, '_redirects');

if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  fs.writeFileSync(notFoundPath, content, 'utf8');
  console.log('Copied index.html -> 404.html');
} else {
  console.warn('index.html not found at', indexPath);
}

// Netlify redirects: redirect all routes to /index.html with 200
const redirects = `/*    /index.html   200`;
fs.writeFileSync(redirectsPath, redirects, 'utf8');
console.log('Wrote Netlify _redirects');

// For GitHub Pages, ensure a fallback 404.html exists (already created above).
// Vercel handles SPA routing automatically when serving static files from the
// output directory, but the 404 copy helps in all cases.

console.log('postbuild-tools complete');
