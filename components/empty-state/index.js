Component({ properties: { title: String, description: String, action: String }, methods: { act(){this.triggerEvent('action');} } });
