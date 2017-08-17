(function(Vue) {

	let timeout = function(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	Vue.component('VueWordCloud', {
		template: `
			<div style="position: absolute; width: 100%; height: 100%;">
				<div v-for="word in placedWords" style="position: absolute;" :style="word.style">{{ word.text }}</div>
			</div>
		`,

		props: {
			words: {
				type: Array,
				default() {
					return [];
				},
			},

			text: {
				type: [String, Function],
				default: '',
			},

			fontSize: {
				type: [Number, Function],
				default: 16,
			},

			fontFamily: {
				type: [String, Function],
				default: 'serif',
			},

			fontStyle: {
				type: [String, Function],
				default: 'normal',
			},

			fontWeight: {
				type: [String, Function],
				default: 'normal',
			},

			rotate: {
				type: [String, Function],
				default() {
					return function() {
						return (~~(Math.random() * 6) - 3) * 30;
					};
				},
			},
		},

		data() {
			return {
				placedWords: [],
				size: [500, 500],
				drawId: null,
			};
		},

		computed: {
			normalizedWords() {
				return this.words.map(word => {
					let text, fontSize, fontFamily, fontStyle, fontWeight, rotate;
					if (word) {
						switch (typeof word) {
							case 'string': {
								text = word;
								break;
							}
							case 'object': {
								if (Array.isArray(word)) {
									([text, fontSize, fontFamily, fontStyle, fontWeight, rotate] = word);
								} else {
									({text, fontSize, fontFamily, fontStyle, fontWeight, rotate} = word);
								}
								break;
							}
						}
					}
					if (text === undefined) {
						if (typeof this.text === 'function') {
							text = this.text(word);
						} else {
							text = this.text;
						}
					}
					if (fontSize === undefined) {
						if (typeof this.fontSize === 'function') {
							fontSize = this.fontSize(word);
						} else {
							fontSize = this.fontSize;
						}
					}
					if (fontFamily === undefined) {
						if (typeof this.fontFamily === 'function') {
							fontFamily = this.fontFamily(word);
						} else {
							fontFamily = this.fontFamily;
						}
					}
					if (fontStyle === undefined) {
						if (typeof this.fontStyle === 'function') {
							fontStyle = this.fontStyle(word);
						} else {
							fontStyle = this.fontStyle;
						}
					}
					if (fontWeight === undefined) {
						if (typeof this.fontWeight === 'function') {
							fontWeight = this.fontWeight(word);
						} else {
							fontWeight = this.fontWeight;
						}
					}
					if (rotate === undefined) {
						if (typeof this.rotate === 'function') {
							rotate = this.rotate(word);
						} else {
							rotate = this.rotate;
						}
					}
					return {text, fontSize, fontFamily, fontStyle, fontWeight, rotate};
				});
			},
		},

		watch: {
			normalizedWords: {
				handler(words) {
					let id = this.drawId = {};
					setTimeout(() => {
						this.computePlacedWords(id, words);
					}, 1);
				},
				immediate: true,
			},
		},

		methods: {
			async computePlacedWords(id, words) {
				if (this.drawId !== id) {
					return;
				}
				let returns = [];
				for (let {text, fontSize, fontFamily, fontStyle, fontWeight, rotate} of words) {
					returns.push({
						text,
						style: {
							left: `${Math.random() * 500}px`,
							top: `${Math.random() * 500}px`,
							fontSize: `${fontSize}px`,
							fontFamily,
							fontStyle,
							fontWeight,
						},
					});
					await timeout(1);
					if (this.drawId !== id) {
						return;
					}
				}
				this.placedWords = returns;
			},
		},
	});

})(Vue);