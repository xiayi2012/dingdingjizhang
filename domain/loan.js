function applyLoanPayment(loan, payment) {
  return { ...loan, remainingCents: Math.max(0, loan.remainingCents - payment.principalCents), paidPeriods: (loan.paidPeriods || 0) + 1 };
}
module.exports = { applyLoanPayment };
