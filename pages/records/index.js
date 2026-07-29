const { createBookkeepingService } = require('../../services/bookkeeping-service');
Page({
  data: { groups: [], keyword: '', type: '' },
  onShow(){ this.load(); if(this.getTabBar)this.getTabBar().setData({selected:1}); },
  load(){ this.setData({ groups: createBookkeepingService(getApp().globalData.repository).listRecordGroups({ keyword:this.data.keyword,type:this.data.type }) }); },
  search(e){ this.setData({keyword:e.detail.value}); this.load(); },
  filter(e){ this.setData({type:e.currentTarget.dataset.type}); this.load(); },
  remove(e){ wx.showModal({title:'删除这笔记录？',content:'删除后会同步到其他设备。',success:(r)=>{if(r.confirm){createBookkeepingService(getApp().globalData.repository).removeTransaction(e.currentTarget.dataset.id);this.load();}}}); },
});
