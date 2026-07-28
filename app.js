const { getRuntimeConfig } = require('./config/env');

App({
  globalData: { runtime: getRuntimeConfig(), repository: null },
  onLaunch() {
    const runtime = this.globalData.runtime;
    if (runtime.cloudEnabled && wx.cloud) {
      wx.cloud.init({ env: runtime.cloudEnvId, traceUser: true });
    }
  },
});
