const test = require('node:test');
const assert = require('node:assert/strict');
const { yuanToCents, formatCents } = require('../domain/money');

test('converts decimal yuan to integer cents', () => {
  assert.equal(yuanToCents('28.50'), 2850);
  assert.equal(yuanToCents('0.01'), 1);
});

test('formats integer cents as yuan', () => {
  assert.equal(formatCents(2850), '28.50');
  assert.equal(formatCents(-50), '-0.50');
});

test('rejects invalid amounts', () => {
  assert.throws(() => yuanToCents('1.999'), /正确金额/);
});
