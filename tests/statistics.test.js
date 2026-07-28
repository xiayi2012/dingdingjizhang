const test = require('node:test');
const assert = require('node:assert/strict');
const { summarizeTransactions } = require('../domain/statistics');

const records = [
  { id: '1', type: 'expense', amountCents: 740000, categoryName: '餐饮', date: '2026-07-10' },
  { id: '2', type: 'income', amountCents: 1268000, categoryName: '工资', date: '2026-07-20' },
  { id: '3', type: 'transfer', amountCents: 5000, date: '2026-07-21' },
  { id: '4', type: 'expense', amountCents: 9999, date: '2026-07-22', deleted: true },
];

test('summarizes income expense and balance in range', () => {
  const result = summarizeTransactions(records, { start: '2026-07-01', end: '2026-07-31' });
  assert.equal(result.expenseCents, 740000);
  assert.equal(result.incomeCents, 1268000);
  assert.equal(result.balanceCents, 528000);
  assert.equal(result.categories[0].name, '餐饮');
});
