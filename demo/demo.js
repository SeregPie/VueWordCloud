new Vue({
	el: '#demo',

	data() {
		let fontFamilyValues = [
			'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia',
			'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana',
			'serif', 'sans-serif', 'monospace',
		];

		return {
			text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
			fontFamily: fontFamilyValues[0],
			fontFamilyValues,
		};
	},

	computed: {
		words() {
			return this.text.split(/[^0-9a-zA-Z]+/g).map(text => [text, 12 + Math.random() * 24]);
		},
	},
});