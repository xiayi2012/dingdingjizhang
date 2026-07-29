const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('registers all ten product pages', () => {
  const app = JSON.parse(fs.readFileSync('app.json', 'utf8'));
  assert.equal(app.pages.length, 10);
  assert.ok(app.pages.includes('pages/home/index'));
  assert.ok(app.pages.includes('pages/budget/index'));
});

test('derives cloud mode from the configured environment id', () => {
  const { getRuntimeConfig } = require('../config/env');
  const config = getRuntimeConfig();
  assert.equal(config.cloudEnabled, Boolean(config.cloudEnvId));
});
