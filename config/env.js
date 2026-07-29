const CLOUD_ENV_ID = '';

function getRuntimeConfig() {
  return { cloudEnabled: Boolean(CLOUD_ENV_ID), cloudEnvId: CLOUD_ENV_ID };
}

module.exports = { getRuntimeConfig };
