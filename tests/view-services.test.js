const test = require('node:test');
const assert = require('node:assert/strict');
const { createRepository } = require('../services/repository');
const { createBookkeepingService } = require('../services/bookkeeping-service');
const { createInsightsService } = require('../services/insights-service');
const { createFinanceService } = require('../services/finance-service');

function repo() {
  let value;
  return createRepository({ get: () => value, set: (next) => { value = next; } });
}

test('builds the designed home summary from repository data', () => {
  const vm = createBookkeepingService(repo()).getHomeViewModel('2026-07-27');
  assert.equal(vm.todayExpenseCents, 12850);
  assert.equal(vm.todayCount, 3);
});

test('validates and saves manual transactions', () => {
  const service = createBookkeepingService(repo());
  assert.throws(() => service.saveTransaction({ amount: '' }), /金额/);
  assert.equal(service.saveTransaction({
    amount: '28.00', type: 'expense', categoryName: '餐饮',
    accountName: '微信零钱', date: '2026-07-28',
  }).amountCents, 2800);
});

test('calculates monthly statistics and budgets', () => {
  const vm = createInsightsService(repo()).getStatistics('month', new Date('2026-07-28T12:00:00+08:00'));
  assert.equal(vm.expenseCents, 740000);
  assert.equal(vm.incomeCents, 1268000);
});

test('records debt payments and settles the remaining balance', () => {
  const service = createFinanceService(repo());
  const payment = service.recordDebtPayment({ debtId: 'debt_lin', amountCents: 50000, date: '2026-07-28' });
  assert.equal(payment.amountCents, 50000);
  assert.equal(service.getDebt('debt_lin').status, 'settled');
});
