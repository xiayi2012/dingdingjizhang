const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('defines the complete soft cream palette', () => {
  const css = fs.readFileSync('app.wxss', 'utf8');
  ['#F1D37A', '#7FAE9A', '#FFFAEC', '#FFFDF8', '#2C3833', '#4D806B', '#D9786C']
    .forEach((color) => assert.ok(css.includes(color), `missing ${color}`));
});

test('uses dark text on the primary yellow action', () => {
  const css = fs.readFileSync('app.wxss', 'utf8');
  assert.match(css, /\.button-primary\s*\{[^}]*color:\s*var\(--ink\)/s);
});

test('provides all shared components and five navigation items', () => {
  ['app-header', 'amount-card', 'progress-bar', 'status-tag', 'empty-state', 'bell-mark']
    .forEach((name) => assert.ok(fs.existsSync(`components/${name}/index.wxml`), name));
  const tab = fs.readFileSync('custom-tab-bar/index.js', 'utf8');
  assert.match(tab, /首页/);
  assert.match(tab, /我的/);
});
