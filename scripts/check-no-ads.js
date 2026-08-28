const assert = require('node:assert/strict');
const { readdirSync, readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const forbidden = /AdService|drawAdOverlay|adBoards|\/api\/ads\/|window\.ads|umami|gtag|googlesyndication|광고문의/;
function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) scan(path);
    else if (/\.(?:ts|js|html|css)$/.test(path)) {
      assert(!forbidden.test(readFileSync(path, 'utf8')), `Ad/tracking code remains: ${path}`);
    }
  }
}
scan('src');
assert(!forbidden.test(readFileSync('index.html', 'utf8')));
assert(existsSync('dist/index.html'), 'Run yarn build before this check');
scan('dist');
const html = readFileSync('dist/index.html', 'utf8');
assert.deepEqual(readFileSync('dist/LICENSE.txt'), readFileSync('LICENSE'), 'Published MIT notice must match LICENSE');
const footer = html.match(/<div class=["']?copyright["']?>([\s\S]*?)<\/div>/)?.[1] ?? '';
for (const url of ['https://lazygyu.net', 'https://gomgom.net', 'https://gomgom.github.io/roulette/LICENSE.txt']) {
  assert(footer.includes(`href=${url}`) || footer.includes(`href="${url}"`), `Missing footer link: ${url}`);
}
for (const match of html.matchAll(/(?:src|href)=["']?(\/roulette\/[^\s"'<>]+)/g)) {
  assert(existsSync(join('dist', match[1].slice('/roulette/'.length))), `Missing asset: ${match[1]}`);
}
assert(readdirSync('dist').some(name => name.endsWith('.wasm')), 'Box2D WebAssembly is missing');
console.log('No ad/tracking code; page assets and Box2D WebAssembly exist.');
