const { applyLoanPayment } = require('../domain/loan');
const { applyDebtPayment } = require('../domain/debt');

function createFinanceService(repository) {
  function recordLoanPayment(input) {
    const loan = repository.get('loans', input.loanId);
    if (!loan) throw new Error('贷款不存在');
    const payment = repository.save('loanPayments', input);
    repository.save('loans', applyLoanPayment(loan, input));
    if (input.createTransaction) repository.save('transactions', {
      type: 'expense', amountCents: input.amountCents, categoryName: '居住',
      accountName: input.accountName || '微信零钱', date: input.date, sourceId: payment.id,
    });
    return payment;
  }
  function recordDebtPayment(input) {
    const debt = repository.get('debts', input.debtId);
    if (!debt) throw new Error('欠款不存在');
    const payment = repository.save('debtPayments', input);
    repository.save('debts', applyDebtPayment(debt, input));
    if (input.createTransaction) repository.save('transactions', {
      type: debt.direction === 'receivable' ? 'income' : 'expense', amountCents: input.amountCents,
      categoryName: '其他', accountName: input.accountName || '微信零钱', date: input.date, sourceId: payment.id,
    });
    return payment;
  }
  return {
    listLoans: () => repository.list('loans'), getLoan: (id) => repository.get('loans', id), recordLoanPayment,
    listDebts: (direction) => repository.list('debts', { direction }), getDebt: (id) => repository.get('debts', id), recordDebtPayment,
    listLoanPayments: () => repository.list('loanPayments'), listDebtPayments: () => repository.list('debtPayments'),
  };
}
module.exports = { createFinanceService };
