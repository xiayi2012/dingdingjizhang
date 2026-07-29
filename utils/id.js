function createId(prefix = 'item') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
module.exports = { createId };
