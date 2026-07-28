const { getRuntimeConfig } = require('./config/env');
const { createRepository } = require('./services/repository');
const { createWxStorage } = require('./utils/storage');

App({
  globalData: { runtime: getRuntimeConfig(), repository: null },
  onLaunch() {
    this.globalData.repository = createRepository(createWxStorage());
    const runtime = this.globalData.runtime;
    if (runtime.cloudEnabled && wx.cloud) {
      wx.cloud.init({ env: runtime.cloudEnvId, traceUser: true });
    }
  },
});
