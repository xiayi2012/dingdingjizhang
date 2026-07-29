function createSyncService({ repository, cloud, config }) {
  async function loginAndSync() {
    if (!config.cloudEnabled) return { mode: 'local', uploaded: 0, downloaded: 0 };
    const pending = repository.getPending();
    try {
      const identity = await cloud.call('login', {});
      const result = await cloud.call('sync', { changes: pending, cursor: repository.getSyncCursor?.() || '' });
      repository.applySyncResult(result);
      return {
        mode: 'synced',
        openId: identity.openId,
        uploaded: pending.length,
        downloaded: (result.changes || []).length,
        conflicts: result.conflicts || [],
      };
    } catch (error) {
      return { mode: 'pending', uploaded: 0, downloaded: 0, message: error.message };
    }
  }
  return { loginAndSync, syncPending: loginAndSync };
}
module.exports = { createSyncService };
