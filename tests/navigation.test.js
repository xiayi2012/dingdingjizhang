const test = require('node:test');
const assert = require('node:assert/strict');
const { validateProject } = require('../scripts/validate-project');

test('has ten complete pages and five valid tabs', () => {
  const result = validateProject(process.cwd());
  assert.equal(result.pages, 10);
  assert.equal(result.tabs, 5);
  assert.deepEqual(result.errors, []);
});
