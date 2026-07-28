function yuanToCents(value) {
  const normalized = String(value).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) throw new Error('请输入正确金额');
  const [yuan, decimal = ''] = normalized.split('.');
  return Number(yuan) * 100 + Number(decimal.padEnd(2, '0'));
}

function formatCents(cents) {
  const sign = cents < 0 ? '-' : '';
  const absolute = Math.abs(cents);
  return `${sign}${Math.floor(absolute / 100)}.${String(absolute % 100).padStart(2, '0')}`;
}

module.exports = { yuanToCents, formatCents };
