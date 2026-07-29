function applyDebtPayment(debt, payment) {
  const remainingCents = Math.max(0, debt.remainingCents - payment.amountCents);
  return { ...debt, remainingCents, status: remainingCents === 0 ? 'settled' : 'active' };
}
module.exports = { applyDebtPayment };
