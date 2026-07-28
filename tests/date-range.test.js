const test = require('node:test');
const assert = require('node:assert/strict');
const { getDateRange } = require('../domain/date-range');

test('returns natural month range', () => {
  assert.deepEqual(getDateRange('month', new Date('2026-07-28T12:00:00+08:00')), {
    start: '2026-07-01', end: '2026-07-31',
  });
});

test('returns monday through sunday for week', () => {
  assert.deepEqual(getDateRange('week', new Date('2026-07-28T12:00:00+08:00')), {
    start: '2026-07-27', end: '2026-08-02',
  });
});
