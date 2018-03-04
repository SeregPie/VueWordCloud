export default {
	handler(value) {
		this.$emit('update:progress', value);
	},
	deep: true,
	immediate: true,
};
