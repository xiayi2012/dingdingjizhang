function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateRange(period, now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  if (period === 'week') {
    const offset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - offset);
    end.setTime(start.getTime());
    end.setDate(end.getDate() + 6);
  } else if (period === 'year') {
    start.setMonth(0, 1);
    end.setMonth(11, 31);
  } else {
    start.setDate(1);
    end.setMonth(end.getMonth() + 1, 0);
  }
  return { start: formatDate(start), end: formatDate(end) };
}

module.exports = { formatDate, getDateRange };
