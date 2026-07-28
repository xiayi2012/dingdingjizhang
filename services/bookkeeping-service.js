const { yuanToCents } = require('../domain/money');
const { summarizeTransactions } = require('../domain/statistics');

function createBookkeepingService(repository) {
  function getHomeViewModel(date) {
    const records = repository.list('transactions');
    const summary = summarizeTransactions(records, { start: date.slice(0, 7) + '-01', end: date.slice(0, 7) + '-31' });
    const today = records.filter((item) => item.date === date && item.type === 'expense');
    const todayExpenseCents = today.reduce((sum, item) => sum + item.amountCents, 0);
    return {
      todayExpenseCents, todayCount: today.length, month: summary,
      recent: records.slice(0, 3),
      loans: repository.list('loans').slice(0, 1),
      debts: repository.list('debts', { direction: 'receivable' }).slice(0, 1),
      budget: repository.list('budgets').find((item) => !item.categoryName),
    };
  }
  function listRecordGroups(filters = {}) {
    const groups = {};
    repository.list('transactions', filters).forEach((item) => {
      (groups[item.date] || (groups[item.date] = [])).push(item);
    });
    return Object.entries(groups).map(([date, records]) => ({ date, records }));
  }
  function saveTransaction(form) {
    if (!String(form.amount || '').trim()) throw new Error('请输入金额');
    if (!form.categoryName) throw new Error('请选择分类');
    if (!form.accountName) throw new Error('请选择账户');
    return repository.save('transactions', { ...form, amountCents: yuanToCents(form.amount) });
  }
  return { getHomeViewModel, listRecordGroups, saveTransaction,
    removeTransaction: (id) => repository.remove('transactions', id) };
}
module.exports = { createBookkeepingService };
