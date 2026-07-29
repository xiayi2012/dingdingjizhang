const { createBookkeepingService } = require('../../services/bookkeeping-service');
Page({
  data:{mode:'manual',type:'expense',amount:'28.00',categoryName:'餐饮',accountName:'微信零钱',note:'午餐',date:'2026-07-28'},
  onShow(){if(this.getTabBar)this.getTabBar().setData({selected:2});},
  setMode(e){this.setData({mode:e.currentTarget.dataset.mode});}, setType(e){this.setData({type:e.currentTarget.dataset.type});},
  input(e){this.setData({[e.currentTarget.dataset.field]:e.detail.value});},
  save(){try{createBookkeepingService(getApp().globalData.repository).saveTransaction(this.data);wx.showToast({title:'已记一笔',icon:'success'});}catch(error){wx.showToast({title:error.message,icon:'none'});}},
});
