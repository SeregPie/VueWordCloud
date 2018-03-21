export default [
	{
		method() {
			this.elementWidth = this.$el.offsetWidth;
			this.elementHeight = this.$el.offsetHeight;
		},
		delay: 1000,
	},
];
