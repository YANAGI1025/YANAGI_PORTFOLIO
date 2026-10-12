
import fs from 'node:fs';
import path from 'node:path';
import JavaScriptObfuscator from 'javascript-obfuscator';
import { minify } from 'html-minifier-terser';
import CleanCSS from 'clean-css';

const root = process.cwd();
const dist = path.join(root, 'dist');
const source = path.join(root, 'js');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'js'), { recursive: true });
fs.mkdirSync(path.join(dist, 'css'), { recursive: true });

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const minifiedHtml = await minify(html, {
  removeComments: true,
  collapseWhitespace: true,
  removeRedundantAttributes: true,
  removeEmptyAttributes: false,
  minifyCSS: true,
  minifyJS: false
});

fs.writeFileSync(path.join(dist, 'index.html'), minifiedHtml);

const cssDir = path.join(root, 'css');

for (const file of fs.readdirSync(cssDir).filter(name => name.endsWith('.css'))) {
  const css = fs.readFileSync(path.join(cssDir, file), 'utf8');
  const result = new CleanCSS().minify(css);

  if (result.errors.length > 0) {
    throw new Error(`${file}: ${result.errors.join('\n')}`);
  }

  fs.writeFileSync(path.join(dist, 'css', file), result.styles);
}

const imgDir = path.join(root, 'img');

if (fs.existsSync(imgDir)) {
  fs.cpSync(imgDir, path.join(dist, 'img'), { recursive: true });
}

for (const file of fs.readdirSync(source).filter(name => name.endsWith('.js'))) {
  const input = fs.readFileSync(path.join(source, file), 'utf8');

  const result = JavaScriptObfuscator.obfuscate(input, {
    compact: true,
    simplify: true,
    stringArray: true,
    stringArrayThreshold: 0.65,
    renameGlobals: false,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    selfDefending: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal'
  });

  fs.writeFileSync(
    path.join(dist, 'js', file),
    result.getObfuscatedCode()
  );
}

console.log('Build complete: dist/');
