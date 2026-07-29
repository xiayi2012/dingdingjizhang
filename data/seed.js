function createSeed(now = new Date().toISOString()) {
  const base = { bookId: 'book_personal', createdAt: now, updatedAt: now, syncStatus: 'local', deleted: false };
  return {
    version: 1,
    books: [{ ...base, id: 'book_personal', name: '我的账本', ownerId: 'local' }],
    accounts: [{ ...base, id: 'account_wechat', name: '微信零钱' }, { ...base, id: 'account_cash', name: '现金' }],
    categories: ['餐饮', '购物', '出行', '居住', '工资'].map((name, index) => ({
      ...base, id: `category_${index + 1}`, name, type: name === '工资' ? 'income' : 'expense',
    })),
    transactions: [
      { ...base, id: 'tx_coffee', type: 'expense', amountCents: 2500, categoryName: '餐饮', accountName: '微信零钱', note: '咖啡', date: '2026-07-27' },
      { ...base, id: 'tx_daily', type: 'expense', amountCents: 6800, categoryName: '购物', accountName: '微信零钱', note: '日用品', date: '2026-07-27' },
      { ...base, id: 'tx_lunch', type: 'expense', amountCents: 3550, categoryName: '餐饮', accountName: '微信零钱', note: '午餐', date: '2026-07-27' },
      { ...base, id: 'tx_month', type: 'expense', amountCents: 727150, categoryName: '居住', accountName: '微信零钱', note: '本月其他支出', date: '2026-07-10' },
      { ...base, id: 'tx_salary', type: 'income', amountCents: 1268000, categoryName: '工资', accountName: '微信零钱', note: '工资', date: '2026-07-05' }
    ],
    budgets: [
      { ...base, id: 'budget_total', month: '2026-07', categoryName: '', limitCents: 600000, warning80: true, warning100: true },
      { ...base, id: 'budget_food', month: '2026-07', categoryName: '餐饮', limitCents: 180000, warning80: true, warning100: true },
      { ...base, id: 'budget_shop', month: '2026-07', categoryName: '购物', limitCents: 120000, warning80: true, warning100: true },
      { ...base, id: 'budget_transport', month: '2026-07', categoryName: '出行', limitCents: 60000, warning80: true, warning100: true }
    ],
    loans: [
      { ...base, id: 'loan_home', name: '房贷', totalCents: 68000000, remainingCents: 42000000, installmentCents: 320000, totalPeriods: 300, paidPeriods: 114, nextPaymentDate: '2026-07-31', rate: 3.45 },
      { ...base, id: 'loan_car', name: '车贷', totalCents: 8000000, remainingCents: 4800000, installmentCents: 260000, totalPeriods: 36, paidPeriods: 14, nextPaymentDate: '2026-08-05', rate: 4.2 }
    ],
    loanPayments: [],
    debts: [
      { ...base, id: 'debt_lin', direction: 'receivable', contact: '小林', initialCents: 85000, remainingCents: 50000, dueDate: '2026-08-10', status: 'active' },
      { ...base, id: 'debt_chen', direction: 'payable', contact: '阿陈', initialCents: 30000, remainingCents: 30000, dueDate: '2026-08-15', status: 'active' }
    ],
    debtPayments: [{ ...base, id: 'dp_1', debtId: 'debt_lin', amountCents: 35000, date: '2026-07-20' }],
    syncMeta: [],
  };
}
module.exports = { createSeed };
