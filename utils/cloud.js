function createCloudAdapter(wxApi = wx) {
  return {
    async call(name, data) {
      const response = await wxApi.cloud.callFunction({ name, data });
      if (!response.result) throw new Error('云端未返回数据');
      return response.result;
    },
  };
}
module.exports = { createCloudAdapter };
