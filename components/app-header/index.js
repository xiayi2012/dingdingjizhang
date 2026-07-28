Component({ properties: { title: String, subtitle: String, back: Boolean }, methods: {
  goBack() { wx.navigateBack(); },
} });
