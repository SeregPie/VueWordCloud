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

		/*let getTextBounds = function(text, weight, fontFamily, fontStyle, fontWeight, rotate) {
			let font = getFont(fontStyle, fontWeight, weight, fontFamily);
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d', {willReadFrequently: true});
			ctx.font = font;
			let textSize = [
				ctx.measureText(text).width,
				weight
				//Math.max(weight, ctx.measureText('m').width, ctx.measureText('\uFF37').width),
			];

			let boxWidth = fw + fh * 2;
			let boxHeight = fh * 3;
			let fgw = Math.ceil(boxWidth / g);
			let fgh = Math.ceil(boxHeight / g);
			boxWidth = fgw * g;
			boxHeight = fgh * g;

			let fillTextOffsetX = - fw / 2;

			let fillTextOffsetY = - fh * 0.4;

			let cgh = Math.ceil((boxWidth * Math.abs(Math.sin(rotate)) + boxHeight * Math.abs(Math.cos(rotateDeg))) / g);
			let cgw = Math.ceil((boxWidth * Math.abs(Math.cos(rotate)) + boxHeight * Math.abs(Math.sin(rotateDeg))) / g);
			let width = cgw * g;
			let height = cgh * g;

			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			ctx.translate(width / 2, height / 2);
			ctx.rotate(- rotate);
			ctx.font = font;

			ctx.fillStyle = '#000';
			ctx.textBaseline = 'middle';
			ctx.fillText(word, fillTextOffsetX, fillTextOffsetY + weight * 0.5);

			let imageData = ctx.getImageData(0, 0, width, height).data;

			let textPixels = [];
			let gx = cgw, gy, x, y;
			while (gx--) {
				gy = cgh;
				while (gy--) {
					y = g;
					singleGridLoop: {
						while (y--) {
							x = g;
							while (x--) {
								if (imageData[((gy * g + y) * width + (gx * g + x)) * 4 + 3]) {
									occupied.push([gx, gy]);
									break singleGridLoop;
								}
							}
						}

					}
				}
			}

			return textPixels;
		};*/

		/*let canFitText = function canFitText(textPosition, textPixels) {
			for (let textPixel of textPixels) {
				let pixelPosition = _zip(textPosition, textPixel).map(([textPosition, textPixel]) => textPosition + textPixel);
				if (grid[pixelPosition[0]][pixelPosition[1]]) {
					return false;
				}
			}
			return true;
		};

		let updateGrid = function updateGrid(gx, gy, gw, gh, info, item) {
			for (let textPixel of textPixels) {
				let pixelPosition = _zip(textPosition, textPixel).map(([textPosition, textPixel]) => textPosition + textPixel);

				if (px < ngx && py < ngy && px >= 0 && py >= 0) {
					grid[x][y] = true;
				}
			}
		};

		let getPointsAtRadius = function(cachedPointsAtRadius, radius, gridOrigin, shape, ellipticity) {
			if (cachedPointsAtRadius[radius]) {
				return cachedPointsAtRadius[radius];
			}
			let points = [];
			if (radius === 0) {
				points.push([gridOrigin[0], gridOrigin[1], 0]);
			}
			let aaa = radius * 8;
			let bbb = aaa * 2 * Math.PI;
			while (aaa-- > 0) {
				let ccc = aaa / bbb;
				let ddd = shape(ccc);
				points.push([
					gridOrigin[0] + radius * ddd * Math.cos(-ccc),
					gridOrigin[1] + radius * ddd * Math.sin(-ccc) * ellipticity,
					ccc,
				]);
			}
			cachedPointsAtRadius[radius] = points;
			return points;
		};*/

		let zzzz1 = function(grid, gridSizeX, gridSizeY, textPositionX, textPositionY, textPixels) {
			for (let [textPositionX, textPositionY] of textPositions) {
				let gridPixels = [];
				for (let [textPixelX, textPixelY] of textPixels) {
					let gridPixelX = textPositionX + textPixelX;
					let gridPixelY = textPositionY + textPixelY;
					if (gridPixelX >= 0 && gridPixelY >= 0 && gridPixelX < gridSizeX && gridPixelY < gridSizeY) {
						if (grid[gridPixelX][gridPixelY]) {
							return false;
						}
						gridPixels.push([gridPixelX, gridPixelY]);
					}
				}
				for (let [gridPixelX, gridPixelY] of gridPixels) {
					grid[gridPixelX][gridPixelY] = true;
				}
				return true;
			}
		};

		return async function(cancelable, {words, containerSize}) {
			await _delay(1);
			if (cancelable.canceled) {
				throw 0;
			}

			let gridSizeX = Math.pow(2, 11);
			let gridSizeY = Math.pow(2, 11);
			let gridOriginX = gridSizeX / 2;
			let gridOriginY = gridSizeY / 2;
			let gridMaxRadius = Math.floor(Math.sqrt(Math.pow(gridSizeX, 2), Math.pow(gridSizeY, 2)));
			let grid = Array(gridSizeX * gridSizeY).fill(false);

			let shape = function() {
				return 1;
			};

			let wordItems = [];
			for (let {text, weight, fontFamily, fontStyle, fontWeight, rotate} of words) {
				let rotateRad = rotate * 2 * Math.PI;
				let font = getFont(fontStyle, fontWeight, weight, fontFamily);

				let ctx = document.createElement('canvas').getContext('2d', {willReadFrequently: true});

				ctx.font = font;
				let textSizeX = ctx.measureText(text).width;
				let textSizeY = weight;
				let rectSizeX = Math.ceil((textSizeX * Math.abs(Math.cos(rotateRad)) + textSizeY * Math.abs(Math.sin(rotateRad))));
				let rectSizeY = Math.ceil((textSizeX * Math.abs(Math.sin(rotateRad)) + textSizeY * Math.abs(Math.cos(rotateRad))));

				ctx.canvas.width = rectSizeX;
				ctx.canvas.height = rectSizeY;
				ctx.translate(rectSizeX / 2, rectSizeY / 2);
				ctx.rotate(rotateRad);
				ctx.font = font;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(text, 0, 0);
				let imageData = ctx.getImageData(0, 0, rectSizeX, rectSizeY).data;
				let textPixels = [];
				for (let textPixelX = rectSizeX; textPixelX-- > 0;) {
					for (let textPixelY = rectSizeY; textPixelY-- > 0;) {
						if (imageData[(textPixelY * rectSizeX + textPixelX) * 4 + 3]) {
							textPixels.push([textPixelX, textPixelY]);
						}
					}
				}

				await _delay(1);
				if (cancelable.canceled) {
					throw 0;
				}

				for (let gridRadius = 0; gridRadius <= gridMaxRadius; gridRadius++) {

					let textPositionX;
					let textPositionY;
					for (let [textPositionX, textPositionY] of textPositions) {
						let gridPixels = [];
						for (let [textPixelX, textPixelY] of textPixels) {
							let gridPixelX = textPositionX + textPixelX;
							let gridPixelY = textPositionY + textPixelY;
							if (gridPixelX >= 0 && gridPixelY >= 0 && gridPixelX < ngx && gridPixelY < ngy) {
								if (grid[gridPixelX][gridPixelY]) {
									return false;
								}
								gridPixels.push([gridPixelX, gridPixelY]);
							}
						}
						for (let [gridPixelX, gridPixelY] of gridPixels) {
							grid[gridPixelX][gridPixelY] = true;
						}
						return true;
					}






					let points = getPointsAtRadius(r);
					if (points.some(tryToPutWordAtPoint)) {
						return true;
					}
				}

				wordItems.push({
					text,
					style: {
						left: `${textPositionX - textSizeX / 2}px`,
						top: `${textPositionY}px`,
						font: font,
						transform: `rotate(${rotate}turn)`,
					},
				});

				await _delay(1);
				if (cancelable.canceled) {
					throw 0;
				}

				/*for (let watchRadius = 1; watchRadius < gridRadius; watchRadius++) {
					let points = getPointsAtRadius(watchRadius);
					for (let point of points) {
						let wordPosition = _zip(point, textBoxSize).map(([point, textBoxSize]) => Math.floor(point - textBoxSize / 2));
						if (canFitText(wordPosition, textBoxSize, textPixels)) {
							updateGrid(gx, gy, gw, gh, info, item);
							wordItems.push({
								key: text,
								html: text,
								style: {
									font: getFont(fontStyle, fontWeight, weight, fontFamily),
									transform: [
										`translate(${wordPosition.map(v => `${v}px`).join(',')})`,
										//`rotate(${rotate}deg)`,
									].join(' '),
								},
							});


						}
					}
				}*/
			}
			return wordItems;
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
				let uniqueTexts = new Set();
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
					})
					.filter(({text}) => {
						if (uniqueTexts.has(text)) {
							return false;
						}
						uniqueTexts.add(text);
						return true;
					})
					.sort((word, otherWord) => otherWord.weight - word.weight);
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