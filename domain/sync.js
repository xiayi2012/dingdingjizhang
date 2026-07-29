function mergeEntity(local, remote) {
  if (!local) return { entity: remote, winner: 'remote', conflict: false };
  if (!remote) return { entity: local, winner: 'local', conflict: false };
  if (local.updatedAt > remote.updatedAt) return { entity: local, winner: 'local', conflict: false };
  if (remote.updatedAt > local.updatedAt) return { entity: remote, winner: 'remote', conflict: false };
  const conflict = JSON.stringify(local) !== JSON.stringify(remote);
  return { entity: local, winner: 'local', conflict };
}
module.exports = { mergeEntity };
