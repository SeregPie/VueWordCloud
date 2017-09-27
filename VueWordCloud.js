(function(factory) {
	if (typeof module !== 'undefined' && typeof exports !== 'undefined' && this === exports) {
		module.exports = factory(require('vue'));
	} else {
		this.Vue.component('VueWordCloud', factory(this.Vue));
	}
}).call(this, function(Vue) {

	let CancelError = class extends Error {
		constructor(...args) {
			super(...args);
			this.name = 'CancelError';
		}
	};

	let Number_randomFloat = function(start, end) {
		return start + (end - start) * Math.random();
	};

	let Number_randomInt = function(start, end, startInclusive = true, endInclusive = false) {
		if (start > end) {
			return Number_randomInt(end, start, endInclusive, startInclusive);
		}
		if (!startInclusive) start++;
		if (endInclusive) end++;
		return Math.floor(Number_randomFloat(start, end));
	};

	let Worker_fromFunction = function(fn) {
		let code = `(${fn.toString()})()`;
		let blob = new Blob([code]);
		let blobURL = URL.createObjectURL(blob);
		return new Worker(blobURL);
	};

	let Worker_getMessage = function(worker) {
		return new Promise(function(resolve, reject) {
			let cleanUp;
			let messageHandler = function(event) {
				cleanUp(event);
				resolve(event.data);
			};
			let errorHandler = function(event) {
				cleanUp(event);
				reject(event);
			};
			cleanUp = function(event) {
				event.preventDefault();
				worker.removeEventListener('message', messageHandler);
				worker.removeEventListener('error', errorHandler);
			};
			worker.addEventListener('message', messageHandler);
			worker.addEventListener('error', errorHandler);
		});
	};

	let Promise_delay = function(ms = 1) {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	let Function_isFunction = function(value) {
		return typeof value === 'function';
	};

	let Function_noop = function() {};

	let Function_stubArray = function() {
		return [];
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

	let Array_shuffle = function(array) {
		for (let i = array.length; i > 0;) {
			let j = Math.floor(Math.random() * i);
			i--;
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
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



	let computed = {
		renderer() {
			return this.domRenderer;
		},

		normalizedWords() {
			let words = this.words.map(word => {
				let text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color;
				if (word) {
					switch (typeof word) {
						case 'string': {
							text = word;
							break;
						}
						case 'object': {
							if (Array.isArray(word)) {
								([text, weight] = word);
							} else {
								({text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color} = word);
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
				if (color === undefined) {
					if (typeof this.color === 'function') {
						color = this.color(word);
					} else {
						color = this.color;
					}
				}
				return {text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color};
			});

			words = words.filter(({text}) => text);
			words = words.filter(({weight}) => weight > 0);

			words = Array_uniqueBy(words, ({text}) => text);

			words.sort((word, otherWord) => otherWord.weight - word.weight);

			let minWeight = Iterable_minOf(words, ({weight}) => weight);
			//let maxWeight = Iterable_maxOf(words, ({weight}) => weight);
			for (let word of words) {
				word.weight /= minWeight;
			}

			return words;
		},
	};

	let getBoundedWords = (function() {
		let getTextRect = async function(text, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation) {
			rotation = Math_convertTurnToRad(rotation);
			let font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
			try {
				await document.fonts.load(font,  text);
			} catch (error) {
				// continue regardless of error
			}
			let ctx = document.createElement('canvas').getContext('2d');
			ctx.font = font;
			let textWidth = ctx.measureText(text).width;
			let textHeight = fontSize;
			let rectWidth = Math.ceil((textWidth * Math.abs(Math.cos(rotation)) + textHeight * Math.abs(Math.sin(rotation))));
			let rectHeight = Math.ceil((textWidth * Math.abs(Math.sin(rotation)) + textHeight * Math.abs(Math.cos(rotation))));
			let rectData = new Uint8Array(rectWidth * rectHeight);
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

		let boundWord = function() {
			let RectCenterOutIterator = function*(rectWidth, rectHeight) {
				if (rectWidth > 0 && rectHeight > 0) {
					let stepLeft, stepTop;
					if (rectWidth > rectHeight) {
						stepLeft = 1;
						stepTop = rectHeight / rectWidth;
					} else
					if (rectHeight > rectWidth) {
						stepTop = 1;
						stepLeft = rectWidth / rectHeight;
					} else {
						stepLeft = stepTop = 1;
					}
					let startLeft = Math.floor(rectWidth / 2);
					let startTop = Math.floor(rectHeight / 2);
					let endLeft = rectWidth - startLeft;
					let endTop = rectHeight - startTop;
					if (startLeft < endLeft) {
						for (let left = startLeft; left <= endLeft; ++left) {
							yield [left, startTop];
						}
					} else
					if (startTop < endTop) {
						for (let top = startTop; top <= endTop; ++top) {
							yield [startLeft, top];
						}
					}
					let previousStartLeft = startLeft;
					let previousStartTop = startTop;
					let previousEndLeft = endLeft;
					let previousEndTop = endTop;
					while (endLeft < rectWidth || endTop < rectHeight) {
						startLeft -= stepLeft;
						startTop -= stepTop;
						endLeft += stepLeft;
						endTop += stepTop;
						let currentStartLeft = Math.floor(startLeft);
						let currentStartTop = Math.floor(startTop);
						let currentEndLeft = Math.ceil(endLeft);
						let currentEndTop = Math.ceil(endTop);
						if (currentEndLeft > previousEndLeft) {
							for (let top = currentStartTop; top < currentEndTop; ++top) {
								yield [currentEndLeft, top];
							}
						}
						if (currentEndTop > previousEndTop) {
							for (let left = currentEndLeft; left > currentStartLeft; --left) {
								yield [left, currentEndTop];
							}
						}
						if (currentStartLeft < previousStartLeft) {
							for (let top = currentEndTop; top > currentStartTop; --top) {
								yield [currentStartLeft, top];
							}
						}
						if (currentStartTop < previousStartTop) {
							for (let left = currentStartLeft; left < currentEndLeft; ++left) {
								yield [left, currentStartTop];
							}
						}
						previousStartLeft = currentStartLeft;
						previousStartTop = currentStartTop;
						previousEndLeft = currentEndLeft;
						previousEndTop = currentEndTop;
					}
				}
			};

			self.addEventListener('message', function({data: {gridWidth, gridHeight}}) {
				let gridData = new Uint8Array(gridWidth * gridHeight);

				self.addEventListener('message', function({data: {rectWidth, rectHeight, rectData}}) {
					let occupiedRectPixels = [];
					for (let left = 0; left < rectWidth; ++left) {
						for (let top = 0; top < rectHeight; ++top) {
							if (rectData[rectWidth * top + left]) {
								occupiedRectPixels.push([left, top]);
							}
						}
					}
					self.postMessage((function() {
						for (let [rectLeft, rectTop] of RectCenterOutIterator(gridWidth - rectWidth, gridHeight - rectHeight)) {
							if ((function() {
								let occupiedGridPixels = [];
								for (let [left, top] of occupiedRectPixels) {
									left += rectLeft;
									top += rectTop;
									if (gridData[gridWidth * top + left]) {
										return false;
									}
									occupiedGridPixels.push([left, top]);
								}
								for (let [left, top] of occupiedGridPixels) {
									gridData[gridWidth * top + left] = 1;
								}
								return true;
							})()) {
								return {rectLeft, rectTop};
							}
						}
						throw new Error();
					})());
				});

			}, {once: true});
		};

		let boundWords = async function(context, containerWidth, containerHeight, words) {
			let boundedWords = [];
			let boundWordWorker = Worker_fromFunction(boundWord);
			try {
				let gridResolution = Math.pow(2, 22);
				let gridWidth = Math.floor(Math.sqrt(containerWidth / containerHeight * gridResolution));
				let gridHeight = Math.floor(gridResolution / gridWidth);
				boundWordWorker.postMessage({gridWidth, gridHeight});
				for (let word of words) {
					context.throwIfCanceled();
					try {
						let {text, weight, color, rotation, fontFamily, fontStyle, fontVariant, fontWeight} = word;
						let fontSize = weight * 4;
						let {textWidth, textHeight, rectWidth, rectHeight, rectData} = await getTextRect(text, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation);
						boundWordWorker.postMessage({rectWidth, rectHeight, rectData});
						let {rectLeft, rectTop} = await Worker_getMessage(boundWordWorker);
						boundedWords.push({text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight});
					} catch (error) {
						//console.log(error);
					}
				}
			} finally {
				boundWordWorker.terminate();
			}
			return boundedWords;
		};

		let scaleBoundedWords = function(words, containerWidth, containerHeight, maxFontSize) {
			let minLeft = Iterable_minOf(words, ({rectLeft}) => rectLeft);
			let maxLeft = Iterable_maxOf(words, ({rectLeft, rectWidth}) => rectLeft + rectWidth);
			let containedWidth = maxLeft - minLeft;

			let minTop = Iterable_minOf(words, ({rectTop}) => rectTop);
			let maxTop = Iterable_maxOf(words, ({rectTop, rectHeight}) => rectTop + rectHeight);
			let containedHeight = maxTop - minTop;

			let scale = Math.min(containerWidth / containedWidth, containerHeight / containedHeight);

			let currentMaxFontSize = Iterable_maxOf(words, ({fontSize}) => fontSize) * scale;
			if (currentMaxFontSize > maxFontSize) {
				scale *= maxFontSize / currentMaxFontSize;
			}

			for (let word of words) {
				word.rectLeft = (word.rectLeft - (minLeft + maxLeft) / 2) * scale + containerWidth / 2;
				word.rectTop = (word.rectTop - (minTop + maxTop) / 2) * scale + containerHeight / 2;
				word.rectWidth *= scale;
				word.rectHeight *= scale;
				word.textWidth *= scale;
				word.textHeight *= scale;
				word.fontSize *= scale;
			}
		};

		return async function(context) {
			let containerWidth = this.containerWidth;
			let containerHeight = this.containerHeight;
			if (containerWidth <= 0 || containerHeight <= 0) {
				return [];
			}
			let maxFontSize = this.maxFontSize;
			let words = this.normalizedWords;
			await context.delayIfNotCanceled();
			let boundedWords = await boundWords(context, containerWidth, containerHeight, words);
			await context.delayIfNotCanceled();
			scaleBoundedWords(boundedWords, containerWidth, containerHeight, maxFontSize);
			await context.delayIfNotCanceled();
			return boundedWords;
		};
	})();

	let asyncComputed = {
		boundedWords: {
			get: getBoundedWords,
			default: Function_stubArray,
		},
	};

	let watch = {};

	let invokePeriodically = {
		updateContainerSize: {
			method() {
				if (this.mounted && this.$el) {
					let {width, height} = this.$el.getBoundingClientRect();
					this.containerWidth = width;
					this.containerHeight = height;
				}
			},

			//initialDelay

			interval() {
				return this.containerSizeUpdateInterval;
			},
		},
	};

	let methods = {
		domRenderer(createElement) {
			let words = [...this.boundedWords];
			//Array_shuffle(words);
			let wordsCount = words.length;
			let transitionDuration = this.animationDuration / 2;
			let transitionDelay = transitionDuration / wordsCount;
			let transitionEasing = this.animationEasing;
			return createElement('div', {
				style: {
					position: 'relative',
					width: '100%',
					height: '100%',
					overflow: 'hidden',
				},
			}, words.map(({text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight}, index) =>
				createElement('div', {
					key: text,
					style: {
						position: 'absolute',
						left: `${rectLeft + rectWidth / 2 - textWidth / 2}px`,
						top: `${rectTop + rectHeight / 2}px`,
						color: color,
						font: [fontStyle, fontVariant, fontWeight, `${fontSize}px/0`, fontFamily].join(' '),
						transform: `rotate(${rotation}turn)`,
						whiteSpace: 'nowrap',
						transition: ['all', `${Math.round(transitionDuration)}ms`, transitionEasing, `${Math.round(transitionDelay * index)}ms`].join(' '),
					},
				}, text)
			));
		},

		canvasRenderer(createElement) {
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');
			this.boundedWords.forEach(({text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight}) => {
				ctx.save();
				ctx.font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
				ctx.fillStyle = color;
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(text, 0, 0);
				ctx.translate(rectLeft + rectWidth / 2, rectTop + rectHeight / 2);
				ctx.rotate(Math_convertTurnToRad(rotation));
				ctx.restore();
			});
			return canvas;
		},

		svgRenderer(createElement) {
			// todo?
		},

		/*async _animateBoundedWords(context, boundedWords) {
			let oldBoundedWords = this.animatedBoundedWords;
			let newBoundedWords = boundedWords.slice();
			let delay = this.animationDuration / Math.max(oldBoundedWords.length, newBoundedWords.length) / 2;
			for (let oldIndex = oldBoundedWords.length; oldIndex-- > 0;) {
				await context.delayIfNotCanceled(delay);
				let oldBoundedWord = oldBoundedWords[oldIndex];
				let newIndex = newBoundedWords.findIndex(newBoundedWord => newBoundedWord.text === oldBoundedWord.text);
				if (newIndex < 0) {
					oldBoundedWords.splice(oldIndex, 1);
				} else {
					oldBoundedWords.splice(oldIndex, 1, ...newBoundedWords.splice(newIndex, 1));
				}
			}
			for (let newWord of newBoundedWords) {
				await context.delayIfNotCanceled(delay);
				oldBoundedWords.push(newWord);
			}
		},*/
	};

	(function() {
		let CancelableContext = class {
			constructor() {
				this.canceled = false;
			}

			cancel() {
				this.canceled = true;
			}

			throwIfCanceled() {
				if (this.canceled) {
					throw new CancelError();
				}
			}

			async delayIfNotCanceled(ms) {
				this.throwIfCanceled();
				await Promise_delay(ms);
				this.throwIfCanceled();
			}
		};

		let prefixA = 'duqugwtjleyi$';
		let prefixB = 'xvvzxtpxrfjr$';

		Object.entries(asyncComputed).forEach(([key, def]) => {
			let keyA = prefixA + key;
			let keyB = prefixB + key;

			Object.assign(computed, {
				[keyA]() {
					return this[keyB]();
				},

				[keyB]() {
					let outerContext;
					return async function(...args) {
						if (outerContext) {
							outerContext.cancel();
						}
						let innerContext = (outerContext = new CancelableContext());
						let returns = await def.get.call(this, innerContext, ...args);
						innerContext.throwIfCanceled();
						return returns;
					};
				},
			});
			Object.assign(watch, {
				[keyA]: {
					async handler(promise) {
						try {
							this[key] = await promise;
						} catch (error) {
							// continue regardless of error
						}
					},
					immediate: true,
				},
			});
		});
	})();

	(function() {
		let prefixA = 'wkoojrkxgnng$';
		let prefixB = 'ozyvltnleyhp$';

		Object.entries(invokePeriodically).forEach(([key, def]) => {
			let keyA = prefixA + key;
			let keyB = prefixB + key;

			Object.assign(methods, {
				[key]: def.method,
			});
			Object.assign(computed, {
				[keyA]() {
					return this[keyB]();
				},

				[keyB]() {
					let id;
					return function() {
						clearTimeout(id);
						let tvrsadrhbmtf = (() => {
							if (!this.destroyed) {
								id = setTimeout(tvrsadrhbmtf, Function_isFunction(def.interval) ? def.interval.call(this) : def.interval);
								this[key]();
							}
						});
						tvrsadrhbmtf();
					};
				},
			});
			Object.assign(watch, {
				[keyA]: {handler() {}, immediate: true},
			});
		});
	})();

	return {
		render(createElement) {
			return this.renderer(createElement);
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

			color: {
				type: [String, Function],
				default: 'Black',
			},

			maxFontSize: {
				type: Number,
				default: Infinity,
			},

			animationDuration: {
				type: Number,
				default: 5000,
			},

			animationEasing: {
				type: String,
				default: 'ease',
			},

			containerSizeUpdateInterval: {
				type: Number,
				default: 1000,
			},
		},

		data() {
			let data = {
				mounted: false,
				destroyed: false,
				animatedBoundedWords: [],
				containerWidth: 0,
				containerHeight: 0,
			};
			Object.entries(asyncComputed).forEach(([key, def]) => {
				data[key] = Function_isFunction(def.default) ? def.default.call(this) : def.default;
			});
			return data;
		},

		mounted() {
			this.mounted = true;
		},

		beforeDestroy() {
			this.destroyed = true;
		},

		computed,
		watch,
		methods,
	};

});