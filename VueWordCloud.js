(function(factory) {
	if (typeof module !== 'undefined' && typeof exports !== 'undefined' && this === exports) {
		module.exports = factory(require('vue'));
	} else {
		this.Vue.component('VueWordCloud', factory(this.Vue));
	}
}).call(this, function(Vue) {

	let Worker_fromFunction = function(f) {
		let code = `(${f.toString()})()`;
		let blob = new Blob([code]);
		let blobURL = URL.createObjectURL(blob);
		return new Worker(blobURL);
	};

	let Worker_getMessage = function(worker) {
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

	let Async_delay = function(ms = 1) {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	let Function_CancelableContext = class {
		constructor() {
			this._canceled = false;
		}

		get canceled() {
			return this._canceled;
		}

		cancel() {
			this._canceled = true;
		}

		throwIfCanceled() {
			if (this.canceled) {
				throw new Error('canceled');
			}
		}

		async delay(ms) {
			this.throwIfCanceled();
			await Async_delay(ms);
			this.throwIfCanceled();
		}
	};

	let Function_makeLastCancelable = function(fn) {
		let context = null;
		return function(...args) {
			if (context) {
				context.cancel();
			}
			return fn.call(this, context = new Function_CancelableContext(), ...args);
		};
	};

	let Array_uniqueBy = function(array, iteratee) {
		let uniqueValues = new Set();
		return array.filter(value => {
			value = iteratee(value);
			if (uniqueValues.has(value)) {
				return false;
			}
			uniqueValues.add(value);
			return true;
		});
	};

	let Iterable_minOf = function(values, iteratee) {
		let returns = Infinity;
		for (let value of values) {
			returns = Math.min(iteratee(value), returns);
		}
		return returns;
	};

	let Iterable_maxOf = function(values, iteratee) {
		let returns = -Infinity;
		for (let value of values) {
			returns = Math.max(iteratee(value), returns);
		}
		return returns;
	};

	let Math_convertTurnToRad = function(v) {
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
				}, this.animatedWordNodes.map(node =>
					createElement('div', {
						key: node.text,
						style: Object.assign({
							position: 'absolute',
							whiteSpace: 'nowrap',
							transition: 'all 1s',
						}, node.style),
					}, node.text)
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

			fontStyle: {
				type: [String, Function],
				default: 'normal',
			},

			fontVariant: {
				type: [String, Function],
				default: 'normal',
			},

			fontWeight: {
				type: [String, Function],
				default: 'normal',
			},

			animationDuration: {
				type: Number,
				default: 1000,
			},
		},

		data() {
			return {
				elementProperties: {width: 0, height: 0},
				wordNodes: [],
				animatedWordNodes: [],
			};
		},

		mounted() {
			this.updateElementProperties();
		},

		computed: {
			normalizedWords() {
				return this.words.map(word => {
					let text, weight, color, rotation, fontFamily, fontStyle, fontVariant, fontWeight;
					if (word) {
						switch (typeof word) {
							case 'string': {
								text = word;
								break;
							}
							case 'object': {
								if (Array.isArray(word)) {
									([text, weight, color, rotation, fontFamily, fontStyle, fontVariant, fontWeight] = word);
								} else {
									({text, weight, color, rotation, fontFamily, fontStyle, fontVariant, fontWeight} = word);
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
					if (fontStyle === undefined) {
						if (typeof this.fontStyle === 'function') {
							fontStyle = this.fontStyle(word);
						} else {
							fontStyle = this.fontStyle;
						}
					}
					if (fontVariant === undefined) {
						if (typeof this.fontVariant === 'function') {
							fontVariant = this.fontVariant(word);
						} else {
							fontVariant = this.fontVariant;
						}
					}
					if (fontWeight === undefined) {
						if (typeof this.fontWeight === 'function') {
							fontWeight = this.fontWeight(word);
						} else {
							fontWeight = this.fontWeight;
						}
					}
					return {text, weight, color, rotation, fontFamily, fontStyle, fontVariant, fontWeight};
				});
			},

			promisedWordNodes() {
				return this.computeWordNodes();
			},

			computeWordNodes() {
				return Function_makeLastCancelable(this._computeWordNodes);
			},

			animateWordNodes() {
				return Function_makeLastCancelable(this._animateWordNodes);
			},
		},

		watch: {
			promisedWordNodes: {
				async handler(promise) {
					try {
						this.wordNodes = await promise;
					} catch (error) {}
				},
				immediate: true,
			},

			async wordNodes(value) {
				try {
					await this.animateWordNodes(value);
				} catch (error) {}
			},
		},

		methods: {
			updateElementProperties() {
				if (this.$el) {
					let {width, height} = this.$el.getBoundingClientRect();
					this.elementProperties.width = width;
					this.elementProperties.height = height;
				}
				setTimeout(() => {
					this.updateElementProperties();
				}, 1000);
			},

			_computeWordNodes: (function() {

				let _getTextRect = async function(text, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation) {
					await document.fonts.load(`16px ${fontFamily}`,  'a');
					let font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
					let ctx = document.createElement('canvas').getContext('2d');
					ctx.font = font;
					let textWidth = ctx.measureText(text).width;
					let textHeight = fontSize;
					let rectWidth = Math.ceil((textWidth * Math.abs(Math.cos(rotation)) + textHeight * Math.abs(Math.sin(rotation))));
					let rectHeight = Math.ceil((textWidth * Math.abs(Math.sin(rotation)) + textHeight * Math.abs(Math.cos(rotation))));
					let rectData = new Int8Array(rectWidth * rectHeight);
					if (rectData.length > 0) {
						let ctx = document.createElement('canvas').getContext('2d');
						ctx.canvas.width = rectWidth;
						ctx.canvas.height = rectHeight;
						ctx.translate(rectWidth / 2, rectHeight / 2);
						ctx.rotate(rotation);
						ctx.font = font;
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';
						ctx.fillText(text, 0, 0);
						let imageData = ctx.getImageData(0, 0, rectWidth, rectHeight).data;
						for (let i = 0, ii = rectData.length; i < ii; ++i) {
							rectData[i] = imageData[i * 4 + 3];
						}
					}
					return {textWidth, textHeight, rectWidth, rectHeight, rectData};
				};

				return async function(context) {
					let containerWidth = this.elementProperties.width;
					let containerHeight = this.elementProperties.height;
					let words = this.normalizedWords;

					await context.delay();

					words = words.filter(({weight}) => weight > 0);
					words = Array_uniqueBy(words, ({text}) => text);
					words.sort((word, otherWord) => otherWord.weight - word.weight);

					await context.delay();

					{
						let minWeight = Iterable_minOf(words, ({weight}) => weight);
						let minFontSize = 2;
						for (let word of words) {
							let {weight} = word;
							let fontSize = weight / minWeight * minFontSize;
							Object.assign(word, {fontSize});
						}
					}

					await context.delay();

					{
						let out = [];
						let worker = Worker_fromFunction(function() {
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
								context.throwIfCanceled();
								try {
									let {text, rotation, fontFamily, fontSize, fontStyle, fontVariant, fontWeight} = word;
									let rotationRad = Math_convertTurnToRad(rotation);
									let {textWidth, textHeight, rectWidth, rectHeight, rectData} = await _getTextRect(text, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotationRad);
									worker.postMessage({rectWidth, rectHeight, rectData});
									let {rectLeft, rectTop} = await Worker_getMessage(worker);
									Object.assign(word, {rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight});
									out.push(word);
								} catch (error) {}
							}
						} finally {
							worker.terminate();
						}
						words = out;
					}

					await context.delay();

					{
						let minLeft = Iterable_minOf(words, ({rectLeft}) => rectLeft);
						let maxLeft = Iterable_maxOf(words, ({rectLeft, rectWidth}) => rectLeft + rectWidth);
						let cloudWidth = maxLeft - minLeft;

						let minTop = Iterable_minOf(words, ({rectTop}) => rectTop);
						let maxTop = Iterable_maxOf(words, ({rectTop, rectHeight}) => rectTop + rectHeight);
						let cloudHeight = maxTop - minTop;

						let scale = Math.min(containerWidth / cloudWidth, containerHeight / cloudHeight);

						for (let word of words) {
							word.rectLeft = (word.rectLeft - (minLeft + maxLeft) / 2) * scale + containerWidth / 2;
							word.rectTop = (word.rectTop - (minTop + maxTop) / 2) * scale + containerHeight / 2;
							word.rectWidth *= scale;
							word.rectHeight *= scale;
							word.textWidth *= scale;
							word.textHeight *= scale;
							word.fontSize *= scale;
						}
					}

					await context.delay();

					return words.map(({rectLeft, rectTop, rectWidth, rectHeight, text, textWidth, textHeight, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation}) => ({
						text,
						style: {
							left: `${rectLeft + rectWidth / 2 - textWidth / 2}px`,
							top: `${rectTop + rectHeight / 2}px`,
							color,
							font: [fontStyle, fontVariant, fontWeight, `${fontSize}px/0`, fontFamily].join(' '),
							transform: `rotate(${rotation}turn)`,
						},
					}));
				};
			})(),

			async _animateWordNodes(context, wordNodes) {
				let oldWordNodes = this.animatedWordNodes;
				let newWordNodes = wordNodes.slice();
				let duration = 1000;
				let delay = duration / Math.max(oldWordNodes.length, newWordNodes.length);
				for (let oldIndex = oldWordNodes.length; oldIndex-- > 0;) {
					await context.delay(delay);
					let oldWordNode = oldWordNodes[oldIndex];
					let newIndex = newWordNodes.findIndex(newWordNode => newWordNode.text === oldWordNode.text);
					if (newIndex < 0) {
						oldWordNodes.splice(oldIndex, 1);
					} else {
						oldWordNodes.splice(oldIndex, 1, ...newWordNodes.splice(newIndex, 1));
					}
				}
				for (let newWord of newWordNodes) {
					await context.delay(delay);
					oldWordNodes.push(newWord);
				}
			},
		},
	};

});