(function(factory) {
	if (typeof module !== 'undefined' && typeof exports !== 'undefined' && this === exports) {
		factory(
			require('vue'),
			module
		);
	} else {
		let module = {};
		factory(
			this.Vue,
			module
		);
		this.Vue.component('VueWordCloud', module.exports);
	}
}).call(this, function(Vue, module) {

	let _zip = function(array, ...otherArrays) {
		return array.map(array, (v, i) => [v, ...otherArrays.map(a => a[i])]);
	};

	let _delay = function(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	let generateWordItems = (function() {

		let getFont = function(fontStyle, fontWeight, fontSize, fontFamily) {
			return [fontStyle, fontWeight, `${fontSize}px`, fontFamily].join(' ');
		};

		let convertTurnToRad = function(turn) {
			return turn * 2 * Math.PI;
		};

		let getOccupiedWordPixels = function(text, fontStyle, fontWeight, fontSize, fontFamily, rotate) {
			let rotateRad = convertTurnToRad(rotate);
			let font = getFont(fontStyle, fontWeight, fontSize, fontFamily);

			let ctx = document.createElement('canvas').getContext('2d', {willReadFrequently: true});

			ctx.font = font;
			let textSizeX = ctx.measureText(text).width;
			let textSizeY = fontSize;

			let wordSizeX = Math.ceil((textSizeX * Math.abs(Math.cos(rotateRad)) + textSizeY * Math.abs(Math.sin(rotateRad))));
			let wordSizeY = Math.ceil((textSizeX * Math.abs(Math.sin(rotateRad)) + textSizeY * Math.abs(Math.cos(rotateRad))));

			ctx.canvas.width = wordSizeX;
			ctx.canvas.height = wordSizeY;
			ctx.translate(wordSizeX / 2, wordSizeY / 2);
			ctx.rotate(rotateRad);
			ctx.font = font;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(text, 0, 0);
			let imageData = ctx.getImageData(0, 0, wordSizeX, wordSizeY).data;
			let occupiedWordPixels = [];
			for (let wordPixelX = wordSizeX; wordPixelX-- > 0;) {
				for (let wordPixelY = wordSizeY; wordPixelY-- > 0;) {
					if (imageData[(wordSizeX * wordPixelY + wordPixelX) * 4 + 3]) {
						occupiedWordPixels.push([wordPixelX, wordPixelY]);
					}
				}
			}

			return [occupiedWordPixels, wordSizeX, wordSizeY];
		};

		let pause = async function(cancelable) {
			await _delay(1);
			if (cancelable.canceled) {
				throw 0;
			}
		};

		let zzzz1 = function(grid, gridSizeX, gridSizeY, wordPositionX, wordPositionY, occupiedWordPixels) {
			let occupiedGridPixels = [];
			for (let [wordPixelX, wordPixelY] of occupiedWordPixels) {
				let gridPixelX = wordPositionX + wordPixelX;
				let gridPixelY = wordPositionY + wordPixelY;
				if (gridPixelX >= 0 && gridPixelY >= 0 && gridPixelX < gridSizeX && gridPixelY < gridSizeY) {
					if (grid[gridSizeX * gridPixelY + gridPixelX]) {
						return false;
					}
					occupiedGridPixels.push([gridPixelX, gridPixelY]);
				}
			}
			for (let [gridPixelX, gridPixelY] of occupiedGridPixels) {
				grid[gridSizeX * gridPixelY + gridPixelX] = true;
			}
			return true;
		};

		let prepareWords = function(words) {
			let uniqueTexts = new Set();
			return words
				.filter(({text}) => {
					if (uniqueTexts.has(text)) {
						return false;
					}
					uniqueTexts.add(text);
					return true;
				})
				.sort((word, otherWord) => otherWord.weight - word.weight)
				.map(({text, weight, fontFamily, fontStyle, fontWeight, rotate}) => {
					let fontSize = weight * 4;
					return [text, fontStyle, fontWeight, fontSize, fontFamily, rotate];
				});
		};

		let gridSizeX = Math.pow(2, 11);
		let gridSizeY = Math.pow(2, 11);
		let gridOriginX = gridSizeX / 2;
		let gridOriginY = gridSizeY / 2;

		return async function(cancelable, {words, containerSize}) {
			await pause(cancelable);

			let [containerSizeX, containerSizeY] = containerSize;

			let uniqueTexts = new Set();

			words = words.filter(({text}) => {
				if (uniqueTexts.has(text)) {
					return false;
				}
				uniqueTexts.add(text);
				return true;
			});

			words.sort((word, otherWord) => otherWord.weight - word.weight);

			await pause(cancelable);

			let minOccupiedGridPixelX = Infinity;
			let maxOccupiedGridPixelX = 0;
			let minOccupiedGridPixelY = Infinity;
			let maxOccupiedGridPixelY = 0;
			let grid = Array(gridSizeX * gridSizeY).fill(false);

			words = await Promise.all(words.map(async ({text, weight, fontFamily, fontStyle, fontWeight, rotate}) => {
				let fontSize = weight * 4;

				await pause(cancelable);

				let [occupiedPixels, sizeX, sizeY] = getOccupiedWordPixels(text, fontStyle, fontWeight, fontSize, fontFamily, rotate);

				await pause(cancelable);

				let positionX = Math.round(Math.random() * gridSizeX);
				let positionY = Math.round(Math.random() * gridSizeY);

				await pause(cancelable);

				minOccupiedGridPixelX = Math.min(positionX, minOccupiedGridPixelX);
				maxOccupiedGridPixelX = Math.max(positionX + sizeX, maxOccupiedGridPixelX);
				minOccupiedGridPixelY = Math.min(positionY, minOccupiedGridPixelY);
				maxOccupiedGridPixelY = Math.max(positionY + sizeY, maxOccupiedGridPixelY);

				return [positionX, positionY, sizeX, sizeY, text, fontStyle, fontWeight, fontSize, fontFamily, rotate];
			}));

			await pause(cancelable);

			let scaleX = containerSizeX / (maxOccupiedGridPixelX - minOccupiedGridPixelX);
			let scaleY = containerSizeY / (maxOccupiedGridPixelY - minOccupiedGridPixelY);

			return words.map(([positionX, positionY, sizeX, sizeY, text, fontStyle, fontWeight, fontSize, fontFamily, rotate]) => {
				positionX = (positionX - minOccupiedGridPixelX) * scaleX;
				positionY = (positionY - minOccupiedGridPixelY) * scaleY;
				sizeX *= scaleX;
				//sizeY *= scaleY;
				fontSize *= Math.min(scaleX, scaleY);

				return {
					text,
					style: {
						left: `${positionX - sizeX / 2}px`,
						top: `${positionY}px`,
						font: getFont(fontStyle, fontWeight, fontSize, fontFamily),
						transform: `rotate(${rotate}turn)`,
					},
				};
			});
		};
	})();

	module.exports = {
		template: `
			<div
				style="position: relative; width: 100%; height: 100%;"
			>
				<div
					v-for="item in wordItems"
					:key="item.text"
					style="position: absolute; line-height: 0; white-space: nowrap; transition: all 1s;"
					:class="item.class"
					:style="item.style"
					v-html="item.text"
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

			weight: {
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
						return Math.random();
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
				return this.words
					.map(word => {
						let text, weight, fontFamily, fontStyle, fontWeight, rotate;
						if (word) {
							switch (typeof word) {
								case 'string': {
									text = word;
									break;
								}
								case 'object': {
									if (Array.isArray(word)) {
										([text, weight, fontFamily, fontStyle, fontWeight, rotate] = word);
									} else {
										({text, weight, fontFamily, fontStyle, fontWeight, rotate} = word);
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
						if (weight === undefined) {
							if (typeof this.weight === 'function') {
								weight = this.weight(word);
							} else {
								weight = this.weight;
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
						return {text, weight, fontFamily, fontStyle, fontWeight, rotate};
					});
			},

			containerSize() {
				return [this.elProps.width, this.elProps.height];
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
					let cancelable = {
						id,
						get canceled() {
							return this.id !== id;
						},
					};
					return generateWordItems(cancelable, {words, containerSize});
				};
			},
		},

		watch: {
			wordItemsPromise: {
				async handler(promise) {
					try {
						this.wordItems = await promise;
					} catch (error) {
						console.log(error);
					}
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
	};

});