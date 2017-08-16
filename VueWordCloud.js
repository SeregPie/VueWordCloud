(function(Vue) {

	Vue.component('VueWordCloud', {
		render(createElement) {
			return createElement('canvas');
		},

		props: {
			type: String,
			data: Object,
			options: Object,
		},

		mounted() {
			this.chart = new Chart(this.$el, {
				type: this.type,
				data: this.data,
				options: this.options,
			});
		},

		watch: {
			data: {
				handler(data) {
					this.chart.data = data;
					this.chart.update();
				},
				deep: true,
			},

			options: {
				handler(options) {
					this.chart.options = options;
					this.chart.update();
				},
				deep: true,
			},
		},
	});

})(Vue);