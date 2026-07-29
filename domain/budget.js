function calculateBudgetUsage(budget, transactions) {
  const usedCents = transactions.reduce((sum, item) => sum + (item.amountCents || 0), 0);
  const percent = budget.limitCents ? Math.round(usedCents / budget.limitCents * 100) : 0;
  return { usedCents, percent, status: percent >= 100 ? 'exceeded' : percent >= 80 ? 'warning' : 'normal' };
}
module.exports = { calculateBudgetUsage };
