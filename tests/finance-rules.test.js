const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateBudgetUsage } = require('../domain/budget');
const { applyLoanPayment } = require('../domain/loan');
const { applyDebtPayment } = require('../domain/debt');

test('reports budget thresholds', () => {
  assert.equal(calculateBudgetUsage({ limitCents: 10000 }, [{ amountCents: 8000 }]).status, 'warning');
  assert.equal(calculateBudgetUsage({ limitCents: 10000 }, [{ amountCents: 10000 }]).status, 'exceeded');
});

test('reduces loan principal without going below zero', () => {
  assert.equal(applyLoanPayment({ remainingCents: 5000, paidPeriods: 1 }, { principalCents: 6000 }).remainingCents, 0);
});

test('settles debt when its remaining amount reaches zero', () => {
  const result = applyDebtPayment({ remainingCents: 5000, status: 'active' }, { amountCents: 5000 });
  assert.equal(result.status, 'settled');
});
