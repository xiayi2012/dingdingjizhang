function summarizeTransactions(transactions, range) {
  const valid = transactions.filter((item) =>
    !item.deleted && item.type !== 'transfer' &&
    item.date >= range.start && item.date <= range.end);
  let incomeCents = 0;
  let expenseCents = 0;
  const categoryTotals = new Map();
  const dailyTotals = new Map();
  valid.forEach((item) => {
    if (item.type === 'income') incomeCents += item.amountCents;
    if (item.type === 'expense') {
      expenseCents += item.amountCents;
      const name = item.categoryName || '其他';
      categoryTotals.set(name, (categoryTotals.get(name) || 0) + item.amountCents);
      dailyTotals.set(item.date, (dailyTotals.get(item.date) || 0) + item.amountCents);
    }
  });
  const categories = [...categoryTotals].map(([name, amountCents]) => ({
    name,
    amountCents,
    percent: expenseCents ? Math.round(amountCents / expenseCents * 100) : 0,
  })).sort((a, b) => b.amountCents - a.amountCents);
  const trend = [...dailyTotals].map(([date, amountCents]) => ({ date, amountCents }))
    .sort((a, b) => a.date.localeCompare(b.date));
  return { incomeCents, expenseCents, balanceCents: incomeCents - expenseCents, categories, trend };
}

module.exports = { summarizeTransactions };
