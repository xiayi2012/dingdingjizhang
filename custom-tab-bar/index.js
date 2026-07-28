Component({
  data: { selected: 0, items: [
    { text: '首页', icon: '⌂', path: '/pages/home/index' },
    { text: '明细', icon: '≡', path: '/pages/records/index' },
    { text: '记账', icon: '+', path: '/pages/entry/index', primary: true },
    { text: '统计', icon: '▥', path: '/pages/statistics/index' },
    { text: '我的', icon: '○', path: '/pages/profile/index' },
  ] },
  methods: { switchTab(e) { wx.switchTab({ url: e.currentTarget.dataset.path }); } },
});
