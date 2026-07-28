const { createBookkeepingService } = require('../../services/bookkeeping-service');
const { formatCents } = require('../../domain/money');
Page({
  data: { vm: null },
  onShow() {
    const vm = createBookkeepingService(getApp().globalData.repository).getHomeViewModel('2026-07-27');
    this.setData({ vm: { ...vm, todayExpense: formatCents(vm.todayExpenseCents), budgetPercent: 52 } });
    if (this.getTabBar) this.getTabBar().setData({ selected: 0 });
  },
  goEntry(){ wx.switchTab({ url: '/pages/entry/index' }); },
  goLoans(){ wx.navigateTo({ url: '/pages/loans/index' }); },
  goDebts(){ wx.navigateTo({ url: '/pages/debts/index' }); },
});
