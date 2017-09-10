(function(factory) {
	if (typeof module !== 'undefined' && typeof exports !== 'undefined' && this === exports) {
		module.exports = factory(require('vue'));
	} else {
		this.Vue.component('VueWordCloud', factory(this.Vue));
	}
}).call(this, function(Vue) {

	let _Worker$fromFunction = function(f) {
		let code = `(${f.toString()})()`;
		let blob = new Blob([code]);
		let blobURL = URL.createObjectURL(blob);
		return new Worker(blobURL);
	};

	let _Worker$getMessage = function(worker) {
		return new Promise((resolve, reject) => {
			worker.addEventListener('message', function(event) {
				event.preventDefault();
				resolve(event.data);
			}, {once: true});
			worker.addEventListener('error', function(event) {
				event.preventDefault();
				reject(event);
			}, {once: true});
		});
	};

	let _Async$delay = function(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	let _Font$join = function({fontFamily = 'serif', fontSize = '16px', fontStyle = 'normal', fontVariant = 'normal', fontWeight = 'normal', lineHeight = 1}) {
		return [fontStyle, fontVariant, fontWeight, `${fontSize}/${lineHeight}`, fontFamily].join(' ');
	};

	let _Font$load = async function(fontFamily) {
		let font = _Font$join({fontFamily});
		await document.fonts.load(font,  'a');
	};

	let _Font$measureTextWidth = (function() {
		let ctx = document.createElement('canvas').getContext('2d');

		return async function(text, {fontFamily, fontSize, fontStyle, fontVariant, fontWeight}) {
			await _Font$load(fontFamily);
			let font = _Font$join({fontFamily, fontSize, fontStyle, fontVariant, fontWeight});
			ctx.font = font;
			return ctx.measureText(text).width;
		};
	})();

	let _Font$computeTextData = (function() {
		return async function(text, {fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation = 0}) {
			let textHeight = fontSize;
			fontSize = `${fontSize}px`;
			let textWidth = await _Font$measureTextWidth(text, {fontFamily, fontSize, fontStyle, fontVariant, fontWeight});
			let rectWidth = Math.ceil((textWidth * Math.abs(Math.cos(rotation)) + textHeight * Math.abs(Math.sin(rotation))));
			let rectHeight = Math.ceil((textWidth * Math.abs(Math.sin(rotation)) + textHeight * Math.abs(Math.cos(rotation))));
			let rectData = new Int8Array(rectWidth * rectHeight);
			if (rectWidth > 0 && rectHeight > 0) {
				let ctx = document.createElement('canvas').getContext('2d');
				ctx.canvas.width = rectWidth;
				ctx.canvas.height = rectHeight;
				ctx.translate(rectWidth / 2, rectHeight / 2);
				ctx.rotate(rotation);
				let font = _Font$join({fontFamily, fontSize, fontStyle, fontVariant, fontWeight});
				ctx.font = font;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(text, 0, 0);
				let imageData = ctx.getImageData(0, 0, rectWidth, rectHeight).data;
				for (let x = 0; x < rectWidth; ++x) {
					for (let y = 0; y < rectHeight; ++y) {
						let index = rectWidth * y + x;
						rectData[index] = imageData[index * 4 + 3];
					}
				}
			}
			return {textWidth, textHeight, rectWidth, rectHeight, rectData};
		};
	})();

	let _Iterable$minOf = function(values, iteratee) {
		let returns = Infinity;
		for (let value of values) {
			returns = Math.min(iteratee(value), returns);
		}
		return returns;
	};

	let _Iterable$maxOf = function(values, iteratee) {
		let returns = -Infinity;
		for (let value of values) {
			returns = Math.max(iteratee(value), returns);
		}
		return returns;
	};

	let _Math$convertTurnToRad = function(v) {
		return v * 2 * Math.PI;
	};



	return {
		render(createElement) {
			return(
				createElement('div', {
					style: {
						position: 'relative',
						width: '100%',
						height: '100%',
						overflow: 'hidden',
					},
				}, this.wordItems.map(item =>
					createElement('div', {
						key: item.text,
						style: Object.assign({
							position: 'absolute',
							whiteSpace: 'nowrap',
							transition: 'all 1s',
						}, item.style),
					}, item.text)
				))
			);
		},

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
				default: 'inherit',
			},

			rotation: {
				type: [String, Function],
				default() {
					let values = [0, 3/4];
					return function() {
						return values[Math.floor(Math.random() * values.length)];
					};
				},
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
					let text, weight, color, rotation, fontFamily, fontVariant, fontStyle, fontWeight;
					if (word) {
						switch (typeof word) {
							case 'string': {
								text = word;
								break;
							}
							case 'object': {
								if (Array.isArray(word)) {
									([text, weight, color, rotation, fontFamily, fontVariant, fontStyle, fontWeight] = word);
								} else {
									({text, weight, color, rotation, fontFamily, fontVariant, fontStyle, fontWeight} = word);
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
					if (rotation === undefined) {
						if (typeof this.rotation === 'function') {
							rotation = this.rotation(word);
						} else {
							rotation = this.rotation;
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
					return {text, weight, color, rotation, fontFamily, fontVariant, fontStyle, fontWeight};
				});
			},

			promisedWordItems() {
				return this.promisifyWordItems();
			},

			promisifyWordItems() {
				let outerToken;
				return function() {
					let innerToken = (outerToken = {});
					let canceled = function() {
						return innerToken !== outerToken;
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

			async computeWordItems(canceled) {
				let containerWidth = this.elProps.width;
				let containerHeight = this.elProps.height;
				let words = this.normalizedWords;

				let throwIfCanceled = async function() {
					await _Async$delay(1);
					if (canceled()) {
						throw new Error();
					}
				};

				await throwIfCanceled();

				words = words.filter(({weight}) => weight > 0);

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

				words.sort((word, otherWord) => otherWord.weight - word.weight);

				{
					let minWeight = _Iterable$minOf(words, ({weight}) => weight);
					let minFontSize = 2;

					for (let word of words) {
						let {weight} = word;
						let fontSize = weight / minWeight * minFontSize;
						Object.assign(word, {fontSize});
					}
				}

				await throwIfCanceled();

				{
					let out = [];
					let worker = _Worker$fromFunction(function() {
						self.addEventListener('message', function({data: {gridWidth, gridHeight}}) {
							let gridData = Array(gridWidth * gridHeight).fill(0);

							self.addEventListener('message', function({data: {rectWidth, rectHeight, rectData}}) {
								let occupiedPixels = [];
								for (let x = 0; x < rectWidth; ++x) {
									for (let y = 0; y < rectHeight; ++y) {
										if (rectData[rectWidth * y + x]) {
											occupiedPixels.push([x, y]);
										}
									}
								}
								self.postMessage((function() {
									for (let [positionX, positionY] of (function*(rectWidth, rectHeight) {
										let stepX, stepY;
										if (rectWidth > rectHeight) {
											stepX = 1;
											stepY = rectHeight / rectWidth;
										} else
										if (rectHeight > rectWidth) {
											stepY = 1;
											stepX = rectWidth / rectHeight;
										} else {
											stepX = stepY = 1;
										}
										let startX = Math.floor(rectWidth / 2);
										let startY = Math.floor(rectHeight / 2);
										let endX = startX - 1;
										let endY = startY - 1;
										let b = true;
										while (b) {
											b = false;
											if (endX < rectWidth - 1) {
												endX++;
												for (let i = startY; i <= endY; i++) {
													yield [endX, i];
												}
												b = true;
											}
											if (endY < rectHeight - 1) {
												//reverse
												endY++;
												for (let i = startX; i <= endX; i++) {
													yield [i, endY];
												}
												b = true;
											}
											if (startX > 0) {
												//reverse
												startX--;
												for (let i = startY; i <= endY; i++) {
													yield [startX, i];
												}
												b = true;
											}
											if (startY > 0) {
												startY--;
												for (let i = startX; i <= endX; i++) {
													yield [i, startY];
												}
												b = true;
											}
										}
									})(gridWidth - rectWidth, gridHeight - rectHeight)) {
										if ((function() {
											let occupiedGridPixels = [];
											for (let [occupiedPixelX, occupiedPixelY] of occupiedPixels) {
												let occupiedGridPixelX = positionX + occupiedPixelX;
												let occupiedGridPixelY = positionY + occupiedPixelY;
												if (occupiedGridPixelX >= 0 && occupiedGridPixelY >= 0 && occupiedGridPixelX < gridWidth && occupiedGridPixelY < gridHeight) {
													if (gridData[gridWidth * occupiedGridPixelY + occupiedGridPixelX]) {
														return false;
													}
													occupiedGridPixels.push([occupiedGridPixelX, occupiedGridPixelY]);
												}
											}
											for (let [occupiedGridPixelX, occupiedGridPixelY] of occupiedGridPixels) {
												gridData[gridWidth * occupiedGridPixelY + occupiedGridPixelX] = true;
											}
											return true;
										})()) {
											return {rectLeft: positionX, rectTop: positionY};
										}
									}
									throw new Error();
								})());
							});

						}, {once: true});
					});
					try {
						let gridResolution = Math.pow(2, 22);
						let gridWidth = Math.floor(Math.sqrt(containerWidth / containerHeight * gridResolution));
						let gridHeight = Math.floor(gridResolution / gridWidth);
						worker.postMessage({gridWidth, gridHeight});
						for (let word of words) {
							try {
								let {text, rotation, fontFamily, fontSize, fontStyle, fontVariant, fontWeight} = word;
								let rotationRad = _Math$convertTurnToRad(rotation);
								let {textWidth, textHeight, rectWidth, rectHeight, rectData} = await _Font$computeTextData(text, {fontFamily, fontSize: fontSize, fontStyle, fontVariant, fontWeight, rotation: rotationRad});
								worker.postMessage({rectWidth, rectHeight, rectData});
								let {rectLeft, rectTop} = await _Worker$getMessage(worker);
								Object.assign(word, {rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight});
								out.push(word);
							} catch (error) {
								console.log(error);
							}
						}
					} finally {
						worker.terminate();
					}
					words = out;
				}

				await throwIfCanceled();

				{
					let minLeft = _Iterable$minOf(words, ({rectLeft}) => rectLeft);
					let maxLeft = _Iterable$maxOf(words, ({rectLeft, rectWidth}) => rectLeft + rectWidth);
					let cloudWidth = maxLeft - minLeft;

					let minTop = _Iterable$minOf(words, ({rectTop}) => rectTop);
					let maxTop = _Iterable$maxOf(words, ({rectTop, rectHeight}) => rectTop + rectHeight);
					let cloudHeight = maxTop - minTop;

					let scale = Math.min(containerWidth / cloudWidth, containerHeight / cloudHeight);

					for (let word of words) {
						word.rectLeft = (word.rectLeft + containerWidth / scale  / 2 - maxLeft / 2 - minLeft  / 2) * scale;

						word.rectTop -= minTop;

						word.rectTop *= scale;
						word.rectWidth *= scale;
						word.rectHeight *= scale;
						word.textWidth *= scale;
						word.textHeight *= scale;
						word.fontSize *= scale;
					}
				}

				await throwIfCanceled();

				return words.map(({rectLeft, rectTop, rectWidth, rectHeight, text, textWidth, textHeight, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation}) => ({
					text,
					style: {
						left: `${rectLeft + rectWidth / 2 - textWidth / 2}px`,
						top: `${rectTop + rectHeight / 2}px`,
						color,
						font: _Font$join({fontFamily, fontSize: `${fontSize}px`, fontStyle, fontVariant, fontWeight, lineHeight: 0}),
						transform: `rotate(${rotation}turn)`,
					},
				}));
			},
		},
	};

});