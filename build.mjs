import fs from 'node:fs';
import path from 'node:path';
import JavaScriptObfuscator from 'javascript-obfuscator';

const root = process.cwd();
const dist = path.join(root, 'dist');
const source = path.join(root, 'src');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, 'js'), { recursive: true });

for (const file of ['index.html']) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}

for (const dir of ['css', 'img']) {
  const from = path.join(root, dir);
  if (fs.existsSync(from)) {
    fs.cpSync(from, path.join(dist, dir), { recursive: true });
  }
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
  fs.writeFileSync(path.join(dist, 'js', file), result.getObfuscatedCode());
}

console.log('Build complete: dist/');
