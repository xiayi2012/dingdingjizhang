const { createSyncService } = require('../../services/sync-service');
const { createCloudAdapter } = require('../../utils/cloud');
Page({
  data:{cloud:false,syncText:'仅保存在本机'},
  onShow(){this.setData({cloud:getApp().globalData.runtime.cloudEnabled});if(this.getTabBar)this.getTabBar().setData({selected:4});},
  async login(){
    if(!this.data.cloud){wx.showModal({title:'当前为本地模式',content:'配置小程序 AppID 和云环境 ID 后即可微信登录并自动同步。',showCancel:false});return;}
    this.setData({syncText:'正在同步…'});
    const app=getApp();
    const result=await createSyncService({repository:app.globalData.repository,cloud:createCloudAdapter(),config:app.globalData.runtime}).loginAndSync();
    this.setData({syncText:result.mode==='synced'?'云端已同步':'待同步'});
    wx.showToast({title:result.mode==='synced'?'同步完成':'同步未完成',icon:result.mode==='synced'?'success':'none'});
  },
  goBudget(){wx.navigateTo({url:'/pages/budget/index'});},goLoans(){wx.navigateTo({url:'/pages/loans/index'});},goDebts(){wx.navigateTo({url:'/pages/debts/index'});}
});
