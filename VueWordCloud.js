(function(Vue) {

	let timeout = function(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	let computePlacedWords = function(cancelable, {words, size}) {
		if (cancelable.canceled) {
			throw 0;
		}

		let cloudRadians = Math.PI / 180;
		let cw = 1 << 11 >> 5;
		let ch = 1 << 11;

		let spiral = archimedeanSpiral;

		let canvas = document.createElement('canvas');
		canvas.width = canvas.height = 1;
		let context = canvas.getContext('2d');
		let ratio = Math.sqrt(context.getImageData(0, 0, 1, 1).data.length >> 2);
		canvas.width = (cw << 5) / ratio;
		canvas.height = ch / ratio;
		context.fillStyle = context.strokeStyle = 'red';
		context.textAlign = 'center';

	};

	Vue.component('VueWordCloud', {
		template: `
			<div
				style="position: absolute; width: 100%; height: 100%;"
			>
				<div
					v-for="word in wordElements"
					:key="word.key"
					style="position: absolute; transition: all 1s;"
					:class="word.class"
					:style="word.style"
					v-html="word.html"
				></div>
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
				size: [500, 500],
				placedWords: [],
				drawId: null,
			};
		},

		computed: {
			normalizedWords() {
				let uniqueTexts = new Set();
				return this.words
					.map(word => {
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
					})
					.filter(({text}) => {
						if (uniqueTexts.has(text)) {
							return false;
						}
						uniqueTexts.add(text);
						return true;
					});
			},

			wordElements() {
				return this.normalizedWords.map(({text, fontSize, fontFamily, fontStyle, fontWeight, rotate}) => ({
					key: text,
					html: text,
					style: {
						//left: `${Math.random() * 500}px`,
						//top: `${Math.random() * 500}px`,
						transform: [
							`translate(${[Math.random() * 500, Math.random() * 500].map(i => `${Math.round(i)}px`).join(',')})`,
							`rotate(${Math.round(Math.random() * 180)}deg)`,
						].join(' '),
						fontSize: `${fontSize}px`,
						fontFamily,
						fontStyle,
						fontWeight,
					},
				}));
			},
		},

		watch: {
			wordElements: {
				handler(words) {
					console.log(words);
				},
				immediate: true,
			},
		},

		/*methods: {
			async computewordElements(id, words) {
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
				this.wordElements = returns;
			},
		},*/
	});

})(Vue);