const { getDateRange } = require('../domain/date-range');
const { summarizeTransactions } = require('../domain/statistics');
const { calculateBudgetUsage } = require('../domain/budget');

function createInsightsService(repository) {
  function getStatistics(period, now) {
    return summarizeTransactions(repository.list('transactions'), getDateRange(period, now));
  }
  function getBudgetViewModel(month) {
    const expenses = repository.list('transactions', { type: 'expense' }).filter((item) => item.date.startsWith(month));
    return repository.list('budgets').filter((item) => item.month === month).map((budget) => ({
      ...budget,
      usage: calculateBudgetUsage(budget, expenses.filter((item) => !budget.categoryName || item.categoryName === budget.categoryName)),
    }));
  }
  return { getStatistics, getBudgetViewModel, saveBudget: (input) => repository.save('budgets', input) };
}
module.exports = { createInsightsService };
