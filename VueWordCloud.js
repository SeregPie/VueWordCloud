(function(Vue) {

	let timeout = function(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	let generateWordItems = (function() {


		return async function(context, {words, containerSize}) {
			await timeout(1);
			if (context.canceled) {
				throw 0;
			}
			let wordItems = [];
			for (let {text, font} of words) {
				let rotate = Math.round(Math.random() * 180);
				let position = [
					Math.round(Math.random() * 500),
					Math.round(Math.random() * 500),
				];
				let wordItem = {
					key: text,
					html: text,
					style: {
						font,
						transform: [
							`translate(${position.map(v => `${v}px`).join(',')})`,
							`rotate(${rotate}deg)`,
						].join(' '),
					},
				};
				wordItems.push(wordItem);
				await timeout(1);
				if (context.canceled) {
					throw 0;
				}
			}
			return wordItems;
		};
	})();

	Vue.component('VueWordCloud', {
		template: `
			<div
				style="position: relative; width: 100%; height: 100%;"
			>
				<div
					v-for="item in wordItems"
					:key="item.key"
					style="position: absolute; transition: all 1s;"
					:class="item.class"
					:style="item.style"
					v-html="item.html"
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
				default: 1,
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
				elProps: {width: 0, height: 0},
				wordItems: [],
			};
		},

		mounted() {
			this.updateElProps();
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
						let font = [fontStyle, fontWeight, `${fontSize}px`, fontFamily].join(' ');
						return {text, font, rotate};
					})
					.filter(({text}) => {
						if (uniqueTexts.has(text)) {
							return false;
						}
						uniqueTexts.add(text);
						return true;
					});
			},

			containerSize() {
				return [this.elProps.width, this.elProps.height];
			},

			generatorData() {
				return {
					words: this.normalizedWords,
					containerSize: this.containerSize,
				};
			},

			wordItemsPromise() {
				return this.promisifyWordItems();
			},

			promisifyWordItems() {
				let id;
				return function() {
					id = {};
					let words = this.normalizedWords;
					let containerSize = this.containerSize;
					let context = {
						id,
						get canceled() {
							return this.id !== id;
						},
					};
					return generateWordItems(context, {words, containerSize});
				};
			},
		},

		watch: {
			wordItemsPromise: {
				async handler(promise) {
					try {
						this.wordItems = await promise;
					} catch (error) {}
				},
				immediate: true,
			},
		},

		methods: {
			updateElProps() {
				if (this.$el) {
					let {width, height} = this.$el.getBoundingClientRect();
					this.elProps.width = width;
					this.elProps.height = height;
				}
				setTimeout(() => {
					this.updateElProps();
				}, 1000);
			},
		},
	});

})(Vue);