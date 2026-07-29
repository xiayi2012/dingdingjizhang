const test = require('node:test');
const assert = require('node:assert/strict');
const { mergeEntity } = require('../domain/sync');
const { createSyncService } = require('../services/sync-service');

test('keeps the newer entity and preserves a newer tombstone', () => {
  const local = { id: '1', updatedAt: '2026-07-01T00:00:00Z', deleted: false };
  const remote = { id: '1', updatedAt: '2026-07-02T00:00:00Z', deleted: true };
  const result = mergeEntity(local, remote);
  assert.equal(result.winner, 'remote');
  assert.equal(result.entity.deleted, true);
});

test('keeps local and reports conflict when timestamps match', () => {
  const local = { id: '1', updatedAt: '2026-07-01T00:00:00Z', note: '本地' };
  const remote = { id: '1', updatedAt: '2026-07-01T00:00:00Z', note: '云端' };
  assert.equal(mergeEntity(local, remote).conflict, true);
});

test('does not call cloud when cloud is disabled', async () => {
  let calls = 0;
  const service = createSyncService({
    repository: { getPending: () => [] },
    cloud: { call: async () => { calls += 1; } },
    config: { cloudEnabled: false },
  });
  assert.deepEqual(await service.loginAndSync(), { mode: 'local', uploaded: 0, downloaded: 0 });
  assert.equal(calls, 0);
});

test('keeps pending records when upload fails', async () => {
  const repository = { getPending: () => [{ id: '1' }], applySyncResult: () => assert.fail('must not apply') };
  const service = createSyncService({
    repository, cloud: { call: async () => { throw new Error('offline'); } },
    config: { cloudEnabled: true },
  });
  const result = await service.loginAndSync();
  assert.equal(result.mode, 'pending');
  assert.equal(result.uploaded, 0);
});
