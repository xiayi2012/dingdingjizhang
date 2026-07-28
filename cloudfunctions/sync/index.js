const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const COLLECTIONS = new Set(['books','transactions','accounts','categories','budgets','loans','loanPayments','debts','debtPayments','syncMeta']);

exports.main = async (event) => {
  const { OPENID: openId } = cloud.getWXContext();
  const acceptedIds = [];
  for (const change of event.changes || []) {
    if (!COLLECTIONS.has(change.entity)) continue;
    const value = { ...change.value, _openid: openId };
    const query = await db.collection(change.entity).where({ _openid: openId, id: value.id }).limit(1).get();
    const current = query.data[0];
    if (!current) await db.collection(change.entity).add({ data: value });
    else if ((value.updatedAt || '') >= (current.updatedAt || '')) {
      const { _id, ...data } = value;
      await db.collection(change.entity).doc(current._id).set({ data });
    }
    acceptedIds.push(value.id);
  }
  const cursor = new Date().toISOString();
  const changes = [];
  for (const entity of COLLECTIONS) {
    if (entity === 'syncMeta') continue;
    const result = await db.collection(entity).where({ _openid: openId, updatedAt: db.command.gt(event.cursor || '') }).limit(100).get();
    result.data.forEach(({ _id, _openid, ...value }) => changes.push({ entity, value }));
  }
  return { acceptedIds, changes, conflicts: [], cursor };
};
