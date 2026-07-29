const STORAGE_KEY = 'dingding.bookkeeping.v1';
function createWxStorage(wxApi = wx) {
  return {
    get: () => wxApi.getStorageSync(STORAGE_KEY),
    set: (value) => wxApi.setStorageSync(STORAGE_KEY, value),
  };
}
module.exports = { createWxStorage, STORAGE_KEY };
