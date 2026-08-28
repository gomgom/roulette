const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

const html = readFileSync('index.html', 'utf8');
const script = html.match(/<script type="text\/javascript">([\s\S]*?)<\/script>/)[1];

function fixture(recording) {
  const elements = new Map();
  const events = new Map();
  const calls = [];
  let range = { start: 0, end: 0 };
  const makeElement = () => ({
    value: '', checked: false, style: {}, textContent: '',
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    handlers: {},
    addEventListener(name, fn) { this.handlers[name] = fn; },
    setAttribute() {}, append() {},
    querySelector() { return makeElement(); },
    click() { this.handlers.click?.(); },
  });
  const document = {
    querySelector(selector) {
      if (selector.startsWith('#')) assert(new RegExp(`id=["']${selector.slice(1)}["']`).test(html), `Missing DOM element ${selector}`);
      if (!elements.has(selector)) elements.set(selector, makeElement());
      return elements.get(selector);
    },
    createElement: makeElement,
    addEventListener() {},
    documentElement: makeElement(),
  };
  document.querySelector('#in_names').value = '가나,다라';
  const context = vm.createContext({
    document, URLSearchParams,
    window: {
      location: { search: '' },
      options: { winnerRange: range },
      translateElement() {},
      roulette: {
        isReady: true, getCount: () => 2, getMaps: () => [{ index: 0, title: 'Map' }],
        setMarbles() {}, setAutoRecording() {}, setTheme() {},
        setWinnerRange(start, end) { range = { start, end }; },
        getWinnerRange: () => range,
        startRecording() { calls.push('record'); return recording; },
        start() { calls.push('start'); },
        addEventListener(name, fn) { events.set(name, fn); },
      },
    },
    localStorage: { getItem: () => null, setItem() {} },
    setTimeout() {}, console: { log() {} },
  });
  vm.runInContext(script, context);
  vm.runInContext('initialize()', context);
  return { context, elements, events, calls };
}

test('page initializes without removed promotional controls and starts without ads', async () => {
  const f = fixture(Promise.resolve());
  await f.elements.get('#btnStart').handlers.click();
  assert.deepEqual(f.calls, ['record', 'start']);
  f.events.get('goal')();
  assert.equal(vm.runInContext('ready', f.context), false);
});

test('recording is ready before physics starts; duplicate start clicks are ignored', async () => {
  let release;
  const f = fixture(new Promise(resolve => { release = resolve; }));
  const first = f.elements.get('#btnStart').handlers.click();
  await f.elements.get('#btnStart').handlers.click();
  assert.deepEqual(f.calls, ['record']);
  release();
  await first;
  assert.deepEqual(f.calls, ['record', 'start']);
});

test('result popup keeps its close button drawing and padded hit area', () => {
  const compiled = ts.transpileModule(readFileSync('src/resultControls.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports });
  const calls = [];
  const ctx = new Proxy({}, { get: (_, name) => (...args) => calls.push([name, ...args]) });
  const rect = exports.drawCloseCircle(ctx, 100, 50, 20);
  assert.deepEqual({ ...rect }, { x: 82, y: 32, w: 36, h: 36 });
  assert(calls.some(([name]) => name === 'arc'));
  assert.equal(exports.closeButtonSize(100), 20);
  assert.equal(exports.closeButtonSize(1000), 34);
});
