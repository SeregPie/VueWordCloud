new Vue({
	el: '#demo',

	data() {
		let fontFamilyValues = [
			'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia',
			'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana',
			'serif', 'sans-serif', 'monospace',
		];

		return {
			wordsText: '',
			fontFamily: fontFamilyValues[0],
			fontFamilyValues,
		};
	},

	computed: {
		words() {
			return this.wordsText
				.split(/[\r\n]+/)
				.map(v => v.split(/\s+/).filter(v => v))
				.filter(v => v.length)
				.map(([size, text]) => [text, parseInt(size)]);
		},
	},
});