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

	let _buildFont = function(fontStyle, fontWeight, fontSize, fontFamily) {
		return [fontStyle, fontWeight, `${fontSize}px`, fontFamily].join(' ');
	};

	let _convertTurnToRad = function(turn) {
		return turn * 2 * Math.PI;
	};



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
			promisedWordItems() {
				return this.promisifyWordItems();
			},

			promisifyWordItems() {
				let id;
				return function() {
					let my_id = id = {};
					let canceled = function() {
						return my_id !== id;
					};
					return this.generateWordItems(canceled);
				};
			},
		},

		watch: {
			promisedWordItems: {
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

			async generateWordItems(canceled) {
				let containerSizeX = this.elProps.width;
				let containerSizeY = this.elProps.height;

				let words = this.words.map(word => {
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

				let loose = async function() {
					await _delay(1);
					if (canceled()) {
						throw 0;
					}
				};

				await loose();

				let uniqueTexts = new Set();

				words = words.filter(({text}) => {
					if (uniqueTexts.has(text)) {
						return false;
					}
					uniqueTexts.add(text);
					return true;
				});

				await loose();

				words.sort((word, otherWord) => otherWord.weight - word.weight);

				await loose();

				for (let word of words) {
					let {weight} = word;
					let fontSize = weight * 4;
					Object.assign(word, {fontSize});
				}

				await loose();

				let gridSizeX = Math.pow(2, 11);
				let gridSizeY = Math.pow(2, 11);
				let gridOriginX = gridSizeX / 2;
				let gridOriginY = gridSizeY / 2;

				let grid = Array(gridSizeX * gridSizeY).fill(false);

				let minOccupiedGridPixelX = Infinity;
				let maxOccupiedGridPixelX = 0;
				let minOccupiedGridPixelY = Infinity;
				let maxOccupiedGridPixelY = 0;

				for (let word of words) {
					let {text, fontSize, fontFamily, fontStyle, fontWeight, rotate} = word;
					let rotateRad = _convertTurnToRad(rotate);
					let font = _buildFont(fontStyle, fontWeight, fontSize, fontFamily);

					let ctx = document.createElement('canvas').getContext('2d', {willReadFrequently: true});

					ctx.font = font;
					let textSizeX = ctx.measureText(text).width;
					let textSizeY = fontSize;

					let sizeX = Math.ceil((textSizeX * Math.abs(Math.cos(rotateRad)) + textSizeY * Math.abs(Math.sin(rotateRad))));
					let sizeY = Math.ceil((textSizeX * Math.abs(Math.sin(rotateRad)) + textSizeY * Math.abs(Math.cos(rotateRad))));

					ctx.canvas.width = sizeX;
					ctx.canvas.height = sizeY;
					ctx.translate(sizeX / 2, sizeY / 2);
					ctx.rotate(rotateRad);
					ctx.font = font;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText(text, 0, 0);
					let imageData = ctx.getImageData(0, 0, sizeX, sizeY).data;
					let occupiedPixels = [];
					for (let wordPixelX = sizeX; wordPixelX-- > 0;) {
						for (let wordPixelY = sizeY; wordPixelY-- > 0;) {
							if (imageData[(sizeX * wordPixelY + wordPixelX) * 4 + 3]) {
								occupiedPixels.push([wordPixelX, wordPixelY]);
							}
						}
					}

					await loose();

					let positionX = Math.round(Math.random() * gridSizeX);
					let positionY = Math.round(Math.random() * gridSizeY);

					minOccupiedGridPixelX = Math.min(positionX, minOccupiedGridPixelX);
					maxOccupiedGridPixelX = Math.max(positionX + sizeX, maxOccupiedGridPixelX);
					minOccupiedGridPixelY = Math.min(positionY, minOccupiedGridPixelY);
					maxOccupiedGridPixelY = Math.max(positionY + sizeY, maxOccupiedGridPixelY);

					await loose();

					Object.assign(word, {positionX, positionY, sizeX, sizeY});
				}

				await loose();

				let scaleX = containerSizeX / (maxOccupiedGridPixelX - minOccupiedGridPixelX);
				let scaleY = containerSizeY / (maxOccupiedGridPixelY - minOccupiedGridPixelY);

				for (let word of words) {
					word.positionX -= minOccupiedGridPixelX
					word.positionY -= minOccupiedGridPixelY;
					word.positionX *= scaleX;
					word.positionY *= scaleY;
					word.sizeX *= scaleX;
					word.sizeY *= scaleY;
					word.fontSize *= Math.min(scaleX, scaleY);
				}

				await loose();

				return words.map(({positionX, positionY, sizeX, sizeY, text, fontStyle, fontWeight, fontSize, fontFamily, rotate}) => {
					return {
						text,
						style: {
							left: `${positionX - sizeX / 2}px`,
							top: `${positionY}px`,
							font: _buildFont(fontStyle, fontWeight, fontSize, fontFamily),
							transform: `rotate(${rotate}turn)`,
						},
					};
				});
			},
		},
	};

});