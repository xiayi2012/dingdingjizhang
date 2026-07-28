const test = require('node:test');
const assert = require('node:assert/strict');
const { createRepository } = require('../services/repository');

function memoryStorage() {
  let value;
  return { get: () => value, set: (next) => { value = next; } };
}

test('seeds a personal book on first load', () => {
  const repo = createRepository(memoryStorage());
  assert.equal(repo.list('books').length, 1);
  assert.equal(repo.list('transactions').length > 0, true);
});

test('marks saved and removed records for synchronization', () => {
  const repo = createRepository(memoryStorage());
  const item = repo.save('transactions', {
    type: 'expense', amountCents: 2800, date: '2026-07-28',
  });
  assert.equal(item.syncStatus, 'pending');
  assert.equal(repo.remove('transactions', item.id).deleted, true);
  assert.equal(repo.list('transactions').some((record) => record.id === item.id), false);
});
