const { createSeed } = require('../data/seed');
const { createId } = require('../utils/id');

function clone(value) { return JSON.parse(JSON.stringify(value)); }

function createRepository(storage) {
  let snapshot = storage.get();
  if (!snapshot || snapshot.version !== 1) {
    snapshot = createSeed();
    storage.set(clone(snapshot));
  }
  function list(entity, filters = {}) {
    return (snapshot[entity] || []).filter((item) => !item.deleted)
      .filter((item) => !filters.type || item.type === filters.type)
      .filter((item) => !filters.direction || item.direction === filters.direction)
      .filter((item) => !filters.keyword || JSON.stringify(item).includes(filters.keyword))
      .sort((a, b) => (b.date || b.updatedAt).localeCompare(a.date || a.updatedAt))
      .map(clone);
  }
  function get(entity, id) {
    const item = (snapshot[entity] || []).find((value) => value.id === id && !value.deleted);
    return item ? clone(item) : null;
  }
  function save(entity, value) {
    const now = new Date().toISOString();
    const items = snapshot[entity] || (snapshot[entity] = []);
    const index = items.findIndex((item) => item.id === value.id);
    const next = { bookId: 'book_personal', createdAt: value.createdAt || now, deleted: false, ...value,
      id: value.id || createId(entity.slice(0, -1)), updatedAt: now, syncStatus: 'pending' };
    if (index >= 0) items[index] = next; else items.push(next);
    storage.set(clone(snapshot));
    return clone(next);
  }
  function remove(entity, id) {
    const current = (snapshot[entity] || []).find((item) => item.id === id);
    if (!current) throw new Error('记录不存在');
    return save(entity, { ...current, deleted: true });
  }
  return { list, get, save, remove, getSnapshot: () => clone(snapshot) };
}
module.exports = { createRepository };
