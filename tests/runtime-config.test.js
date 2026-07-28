const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('uses eager component injection for stable custom tab rendering', () => {
  const app = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  assert.equal(app.lazyCodeLoading, undefined);
});
