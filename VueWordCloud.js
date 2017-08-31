(function(factory) {
	if (typeof module !== 'undefined' && typeof exports !== 'undefined' && this === exports) {
		module.exports = factory(require('vue'));
	} else {
		this.Vue.component('VueWordCloud', factory(this.Vue));
	}
}).call(this, function(Vue) {

	let _sample = function(array) {
		return array[Math.floor(array.length * Math.random())];
	};

	let _randomValue = function(values) {
		return values[_randomInt(0, values.length)];
	};

	let _zip = function(array, ...otherArrays) {
		return array.map(array, (v, i) => [v, ...otherArrays.map(a => a[i])]);
	};

	let _delay = function(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	let _loadFont = async function(fontFamily, fontStyle, fontVariant, fontWeight) {
		let font = _toFont(fontFamily, '16px', fontStyle, fontVariant, fontWeight, 1);
		try {
			await document.fonts.load(font,  'a');
		} catch (error) {}
	};

	let _toFont = function(fontFamily, fontSize, fontStyle, fontVariant, fontWeight, lineHeight) {
		return [fontStyle, fontVariant, fontWeight, `${fontSize}/${lineHeight}`, fontFamily].join(' ');
	};

	let _turnToRad = function(v) {
		return v * 2 * Math.PI;
	};



	return {
		template: `
			<div style="position: relative; width: 100%; height: 100%; overflow: hidden;">
				<div
					v-for="item in wordItems"
					:key="item.text"
					style="position: absolute; white-space: nowrap; transition: all 1s;"
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

			color: {
				type: [String, Function],
				default: 'Inherit',
			},

			fontFamily: {
				type: [String, Function],
				default: 'serif',
			},

			fontVariant: {
				type: [String, Function],
				default: 'normal',
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
					let values = [0, 3/4, 7/8];
					return function() {
						return _sample(values);
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
				return this.words.map(word => {
					let text, weight, color, fontFamily, fontVariant, fontStyle, fontWeight, rotate;
					if (word) {
						switch (typeof word) {
							case 'string': {
								text = word;
								break;
							}
							case 'object': {
								if (Array.isArray(word)) {
									([text, weight, color, fontFamily, fontVariant, fontStyle, fontWeight, rotate] = word);
								} else {
									({text, weight, color, fontFamily, fontVariant, fontStyle, fontWeight, rotate} = word);
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
					if (color === undefined) {
						if (typeof this.color === 'function') {
							color = this.color(word);
						} else {
							color = this.color;
						}
					}
					if (fontFamily === undefined) {
						if (typeof this.fontFamily === 'function') {
							fontFamily = this.fontFamily(word);
						} else {
							fontFamily = this.fontFamily;
						}
					}
					if (fontVariant === undefined) {
						if (typeof this.fontVariant === 'function') {
							fontVariant = this.fontVariant(word);
						} else {
							fontVariant = this.fontVariant;
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
					return {text, weight, color, fontFamily, fontVariant, fontStyle, fontWeight, rotate};
				});
			},

			promisedWordItems() {
				return this.promisifyWordItems();
			},

			promisifyWordItems() {
				let id;
				return function() {
					let my_id = (id = {});
					let canceled = function() {
						return my_id !== id;
					};
					return this.computeWordItems(canceled);
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

			async computeWordItems(canceled) {
				let containerSizeX = this.elProps.width;
				let containerSizeY = this.elProps.height;
				let words = this.normalizedWords;

				let loose = async function() {
					await _delay(1);
					if (canceled()) {
						throw new Error();
					}
				};

				await loose();

				words = words.filter(({weight}) => weight > 0);

				await loose();

				{
					let uniqueTexts = new Set();

					words = words.filter(({text}) => {
						if (uniqueTexts.has(text)) {
							return false;
						}
						uniqueTexts.add(text);
						return true;
					});
				}

				await loose();

				words.sort((word, otherWord) => otherWord.weight - word.weight);

				await loose();

				for (let word of words) {
					let {weight} = word;
					let fontSize = weight;
					Object.assign(word, {fontSize});
				}

				await loose();

				for (let {fontFamily, fontStyle, fontVariant, fontWeight} of words) {
					await _loadFont(fontFamily, fontStyle, fontVariant, fontWeight);
				}

				await loose();

				{
					let out = [];

					let gridResolution = Math.pow(2, 22);
					let gridSizeX = Math.floor(Math.sqrt(containerSizeX / containerSizeY * gridResolution));
					let gridSizeY = Math.floor(gridResolution / gridSizeX);

					let gridOriginX = Math.floor(gridSizeX / 2);
					let gridOriginY = Math.floor(gridSizeY / 2);

					let gridData = Array(gridSizeX * gridSizeY).fill(false);

					for (let word of words) {
						let {text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotate} = word;
						let rotateRad = _turnToRad(rotate);
						let font = _toFont(fontFamily, `${fontSize}px`, fontStyle, fontVariant, fontWeight, 1);

						let ctx = document.createElement('canvas').getContext('2d', {willReadFrequently: true});

						ctx.font = font;
						let textSizeX = ctx.measureText(text).width;
						let textSizeY = fontSize;

						let sizeX = Math.ceil((textSizeX * Math.abs(Math.cos(rotateRad)) + textSizeY * Math.abs(Math.sin(rotateRad))));
						let sizeY = Math.ceil((textSizeX * Math.abs(Math.sin(rotateRad)) + textSizeY * Math.abs(Math.cos(rotateRad))));

						await loose();

						if (sizeX > 0 && sizeY > 0) {
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
							for (let occupiedPixelX = sizeX; occupiedPixelX-- > 0;) {
								for (let occupiedPixelY = sizeY; occupiedPixelY-- > 0;) {
									if (imageData[(sizeX * occupiedPixelY + occupiedPixelX) * 4 + 3]) {
										occupiedPixels.push([occupiedPixelX, occupiedPixelY]);
									}
								}
							}

							await loose();

							let c = 0;
							for (let [positionX, positionY] of (function* () {
								/*for (let i = 0, ii = Math.max(gridSizeX, gridSizeY); i < ii; i++) {
									for (let positionY = 0; positionY < i; positionY++) {
										yield [i, positionY];
									}
									for (let positionX = 0; positionX < i; positionX++) {
										yield [positionX, i];
									}
									yield [i, i];
								}*/

								let x = Math.floor(sizeX / 2);
								let y = Math.floor(sizeY / 2);
								yield [gridOriginX - x, gridOriginY - y];
								for (let radius = 1; radius < 999999; radius++) {
									let a = radius * 8;
									let b = (2 * Math.PI) / a;
									while (a--) {
										yield [
											Math.floor(gridOriginX + radius * Math.cos(a * b)) - x,
											Math.floor(gridOriginY + radius * Math.sin(a * b)) - y,
										];
									}
								}
							})()) {
								//console.log(positionX, positionY);
								c++;
								if ((() => {
									let occupiedGridPixels = [];
									for (let [occupiedPixelX, occupiedPixelY] of occupiedPixels) {
										let occupiedGridPixelX = positionX + occupiedPixelX;
										let occupiedGridPixelY = positionY + occupiedPixelY;
										if (occupiedGridPixelX >= 0 && occupiedGridPixelY >= 0 && occupiedGridPixelX < gridSizeX && occupiedGridPixelY < gridSizeY) {
											if (gridData[gridSizeX * occupiedGridPixelY + occupiedGridPixelX]) {
												return false;
											}
											occupiedGridPixels.push([occupiedGridPixelX, occupiedGridPixelY]);
										}
									}
									for (let [occupiedGridPixelX, occupiedGridPixelY] of occupiedGridPixels) {
										gridData[gridSizeX * occupiedGridPixelY + occupiedGridPixelX] = true;
									}
									return true;
								})()) {
									Object.assign(word, {positionX, positionY, sizeX, sizeY, textSizeX, textSizeY});
									out.push(word);
									break;
								}
							}
							//console.log(c);
						}
					}

					words = out;
				}

				await loose();

				{
					let minOccupiedGridPixelX = Infinity;
					let minOccupiedGridPixelY = Infinity;
					let maxOccupiedGridPixelY = 0;
					let maxOccupiedGridPixelX = 0;

					for (let {positionX, positionY, sizeX, sizeY} of words) {
						minOccupiedGridPixelX = Math.min(positionX, minOccupiedGridPixelX);
						minOccupiedGridPixelY = Math.min(positionY, minOccupiedGridPixelY);
						maxOccupiedGridPixelX = Math.max(positionX + sizeX, maxOccupiedGridPixelX);
						maxOccupiedGridPixelY = Math.max(positionY + sizeY, maxOccupiedGridPixelY);
					}

					let scaleX = containerSizeX / (maxOccupiedGridPixelX - minOccupiedGridPixelX);
					let scaleY = containerSizeY / (maxOccupiedGridPixelY - minOccupiedGridPixelY);
					let scale = Math.min(scaleX, scaleY);

					for (let word of words) {
						word.positionX -= minOccupiedGridPixelX
						word.positionY -= minOccupiedGridPixelY;
						word.positionX *= scale;
						word.positionY *= scale;
						word.sizeX *= scale;
						word.sizeY *= scale;
						word.textSizeX *= scale;
						word.textSizeY *= scale;
						word.fontSize *= scale;
					}
				}

				await loose();

				return words.map(({positionX, positionY, sizeX, sizeY, textSizeX, textSizeY, text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotate}) => ({
					text,
					style: {
						left: `${positionX + sizeX / 2 - textSizeX / 2}px`,
						top: `${positionY + sizeY / 2}px`,
						color,
						font: _toFont(fontFamily, `${fontSize}px`, fontStyle, fontVariant, fontWeight, 0),
						transform: `rotate(${rotate}turn)`,
					},
				}));
			},
		},
	};

});