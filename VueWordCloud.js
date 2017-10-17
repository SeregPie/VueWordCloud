(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
	typeof define === 'function' && define.amd ? define(['vue'], factory) :
	(global.VueWordCloud = factory(global.Vue));
}(this, (function (Vue) { 'use strict';

Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

var InterruptError = class extends Error {
	constructor(...args) {
		super(...args);
		this.name = 'InterruptError';
	}
};

var Promise_delay = function(ms = 1) {
	return new Promise(resolve => setTimeout(resolve, ms));
};

var computeNormalizedWords = function() {
	let generateKey = (function() {
		let keyCounters = {};
		return function(value) {
			let key = JSON.stringify(value);
			let keyCounter = keyCounters[key] || 0;
			keyCounters[key] = keyCounter + 1;
			if (keyCounter > 0) {
				key += `-${keyCounter}`;
			}
			return key;
		};
	})();
	return this.words.map(word => {
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
		let key = generateKey([text, fontFamily, fontStyle, fontVariant, fontWeight]);
		return {key, text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color};
	});
};

var Worker_getMessage = function(worker) {
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

var Array_first = function(array) {
	return array[0];
};

var Array_last = function(array) {
	return array[array.length - 1];
};

var Array_sortBy = function(array, iteratee) {
	return array.slice().sort((value, otherValue) => {
		value = iteratee(value);
		otherValue = iteratee(otherValue);
		if (value < otherValue) {
			return -1;
		}
		if (value > otherValue) {
			return 1;
		}
		return 0;
	});
};

var Array_dropRightUntil = function(array, iteratee) {
	let i = array.length;
	while (i-- > 0) {
		if (iteratee(array[i], i)) {
			break;
		}
	}
	return array.slice(0, i + 1);
};

var Math_mapLinear = function(x, x0, x1, y0, y1) {
	return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
};

var Math_turnToRad = function(v) {
	return v * 2 * Math.PI;
};

var Math_ceilToNearestPowerOfTwo = function(v) {
	return Math.pow(2, Math.ceil(Math.log(v) / Math.LN2));
};

var D2_rectAfterRotation = function(width, height, rotation) {
	return [
		Math.ceil((width * Math.abs(Math.cos(rotation)) + height * Math.abs(Math.sin(rotation)))),
		Math.ceil((width * Math.abs(Math.sin(rotation)) + height * Math.abs(Math.cos(rotation)))),
	];
};

var boundWordWorkerContent = URL.createObjectURL(new Blob(["(function () {\n'use strict';\n\nvar RectCenterOutIterator = function*(rectWidth, rectHeight) {\n\n\tif (rectWidth > 0 && rectHeight > 0) {\n\n\t\tlet stepLeft, stepTop;\n\t\tif (rectWidth > rectHeight) {\n\t\t\tstepLeft = 1;\n\t\t\tstepTop = rectHeight / rectWidth;\n\t\t} else\n\t\tif (rectHeight > rectWidth) {\n\t\t\tstepTop = 1;\n\t\t\tstepLeft = rectWidth / rectHeight;\n\t\t} else {\n\t\t\tstepLeft = stepTop = 1;\n\t\t}\n\n\t\tlet startLeft = Math.floor(rectWidth / 2);\n\t\tlet startTop = Math.floor(rectHeight / 2);\n\t\tlet endLeft = rectWidth - startLeft;\n\t\tlet endTop = rectHeight - startTop;\n\n\t\tif (startLeft < endLeft) {\n\t\t\tfor (let left = startLeft; left <= endLeft; ++left) {\n\t\t\t\tyield [left, startTop];\n\t\t\t}\n\t\t} else\n\t\tif (startTop < endTop) {\n\t\t\tfor (let top = startTop; top <= endTop; ++top) {\n\t\t\t\tyield [startLeft, top];\n\t\t\t}\n\t\t}\n\n\t\tlet previousStartLeft = startLeft;\n\t\tlet previousStartTop = startTop;\n\t\tlet previousEndLeft = endLeft;\n\t\tlet previousEndTop = endTop;\n\n\t\twhile (endLeft < rectWidth || endTop < rectHeight) {\n\n\t\t\tstartLeft -= stepLeft;\n\t\t\tstartTop -= stepTop;\n\t\t\tendLeft += stepLeft;\n\t\t\tendTop += stepTop;\n\n\t\t\tlet currentStartLeft = Math.floor(startLeft);\n\t\t\tlet currentStartTop = Math.floor(startTop);\n\t\t\tlet currentEndLeft = Math.ceil(endLeft);\n\t\t\tlet currentEndTop = Math.ceil(endTop);\n\n\t\t\tif (currentEndLeft > previousEndLeft) {\n\t\t\t\tfor (let top = currentStartTop; top < currentEndTop; ++top) {\n\t\t\t\t\tyield [currentEndLeft, top];\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (currentEndTop > previousEndTop) {\n\t\t\t\tfor (let left = currentEndLeft; left > currentStartLeft; --left) {\n\t\t\t\t\tyield [left, currentEndTop];\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (currentStartLeft < previousStartLeft) {\n\t\t\t\tfor (let top = currentEndTop; top > currentStartTop; --top) {\n\t\t\t\t\tyield [currentStartLeft, top];\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (currentStartTop < previousStartTop) {\n\t\t\t\tfor (let left = currentStartLeft; left < currentEndLeft; ++left) {\n\t\t\t\t\tyield [left, currentStartTop];\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tpreviousStartLeft = currentStartLeft;\n\t\t\tpreviousStartTop = currentStartTop;\n\t\t\tpreviousEndLeft = currentEndLeft;\n\t\t\tpreviousEndTop = currentEndTop;\n\t\t}\n\t}\n};\n\nvar AsyncQueue = class {\n\tconstructor() {\n\t\tthis._values = [];\n\t\t/*\n\t\tthis._promise = undefined;\n\t\tthis._resolvePromise = undefined;\n\t\t*/\n\t}\n\n\tenqueue(value) {\n\t\tthis._values.push(value);\n\t\tif (this._promise) {\n\t\t\tthis._resolvePromise();\n\t\t}\n\t}\n\n\tasync dequeue() {\n\t\tfor (;;) {\n\t\t\tif (this._values.length) {\n\t\t\t\treturn this._values.shift();\n\t\t\t}\n\t\t\tif (!this._promise) {\n\t\t\t\tthis._promise = new Promise(resolve => {\n\t\t\t\t\tthis._resolvePromise = resolve;\n\t\t\t\t});\n\t\t\t}\n\t\t\tawait this._promise;\n\t\t\tthis._promise = undefined;\n\t\t}\n\t}\n};\n\n//import Math_ceilToNearestPowerOfTwo from '../helpers/Math/ceilToNearestPowerOfTwo';\n(async function() {\n\tlet messages = new AsyncQueue();\n\tthis.addEventListener('message', function({data}) {\n\t\tmessages.enqueue(data);\n\t});\n\n\tlet {gridWidth, gridHeight} = await messages.dequeue();\n\tlet gridData = new Uint8Array(gridWidth * gridHeight);\n\t/*\n\tlet gridWidth2 = Math_ceilToNearestPowerOfTwo(gridWidth);\n\tlet gridHeight2 = Math_ceilToNearestPowerOfTwo(gridHeight);\n\tlet gridData2 = new Uint8Array(gridWidth2 * gridHeight2);\n\tlet gridDataLeft2 = Math.ceil(gridWidth2 / 2);\n\tlet gridDataTop2 = Math.ceil(gridHeight2 / 2);\n\tlet gridDataLevels = [];\n\t*/\n\n\tfor (;;) {\n\t\tlet {rectWidth, rectHeight, rectData} = await messages.dequeue();\n\n\n\t\t/*\n\t\tlet rectWidth2 = Math_ceilToNearestPowerOfTwo(rectWidth);\n\t\tlet rectHeight2 = Math_ceilToNearestPowerOfTwo(rectHeight);\n\t\tlet rectData2 = convert(rectData);\n\t\tlet occupiedRectPixelsLevels = [];\n\t\tlet maxLevel = calculate(rectWidth2, rectHeight2);\n\t\tlet rectWidthPowerOfTwo = Math_ceilToNearestPowerOfTwo(rectWidth);\n\t\tlet rectHeightPowerOfTwo = Math_ceilToNearestPowerOfTwo(rectHeight);\n\t\tconst pixelSize = Math.min(rectWidthPowerOfTwo, rectHeightPowerOfTwo) / 16 (8, 4, 2);\n\t\tlet rectDataLevels = ?\n\t\tif (gridDataLevels === undefined) {\n\t\t\tgridDataLevels = ?\n\t\t}\n\t\tlet occupiedRectPixelsLevels = ?\n\n\t\t*/\n\n\t\tlet occupiedRectPixels = [];\n\t\tfor (let left = 0; left < rectWidth; ++left) {\n\t\t\tfor (let top = 0; top < rectHeight; ++top) {\n\t\t\t\tif (rectData[rectWidth * top + left]) {\n\t\t\t\t\toccupiedRectPixels.push([left, top]);\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\t/*\n\t\tlet level = occupiedRectPixelsLevels.length - 1;\n\t\tlet occupiedRectPixels = occupiedRectPixelsLevels[level]\n\t\tlet gridData = gridDataLevels[level];\n\t\t*/\n\n\t\tthis.postMessage((() => {\n\t\t\tfor (let [rectLeft, rectTop] of RectCenterOutIterator(gridWidth - rectWidth, gridHeight - rectHeight)) {\n\t\t\t\tif ((() => {\n\t\t\t\t\t/*\n\t\t\t\t\tfor (let [left, top] of occupiedRectPixels) {\n\t\t\t\t\t\tleft += rectLeft / Math.pow(2, level);\n\t\t\t\t\t\ttop += rectTop / Math.pow(2, level);\n\t\t\t\t\t\tif (gridData[gridWidth * top + left]) {\n\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t*/\n\t\t\t\t\tfor (let [left, top] of occupiedRectPixels) {\n\t\t\t\t\t\tleft += rectLeft;\n\t\t\t\t\t\ttop += rectTop;\n\t\t\t\t\t\tif (gridData[gridWidth * top + left]) {\n\t\t\t\t\t\t\treturn false;\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\t/*\n\t\t\t\t\toccupiedRectPixelsLevels.forEach((occupiedRectPixels, level) => {\n\t\t\t\t\t\tlet gridData = gridDataLevels[level];\n\t\t\t\t\t\tfor (let [left, top] of occupiedRectPixels) {\n\t\t\t\t\t\t\tleft += rectLeft / Math.pow(2, level);\n\t\t\t\t\t\t\ttop += rectTop / Math.pow(2, level);\n\t\t\t\t\t\t\tgridData[gridWidth * top + left] = 1;\n\t\t\t\t\t\t}\n\t\t\t\t\t});\n\t\t\t\t\t*/\n\t\t\t\t\tfor (let [left, top] of occupiedRectPixels) {\n\t\t\t\t\t\tleft += rectLeft;\n\t\t\t\t\t\ttop += rectTop;\n\t\t\t\t\t\tgridData[gridWidth * top + left] = 1;\n\t\t\t\t\t}\n\t\t\t\t\treturn true;\n\t\t\t\t})()) {\n\t\t\t\t\treturn {rectLeft, rectTop};\n\t\t\t\t}\n\t\t\t}\n\t\t\tthrow new Error();\n\t\t})());\n\t}\n}).call(self);\n\n}());\n"]));

var computeBoundedWords = async function(context) {

	let containerWidth = this.containerWidth;
	let containerHeight = this.containerHeight;
	let words = this.normalizedWords;
	let fontSizeRatio = this.fontSizeRatio;

	let boundedWords = [];

	if (words.length > 0 && containerWidth > 0 && containerHeight > 0) {

		await context.delayIfNotInterrupted();

		let containerAspect = containerWidth / containerHeight;

		words = Array_sortBy(words, ({weight}) => -weight);

		let minWeight = Array_last(words).weight;
		let maxWeight = Array_first(words).weight;

		let convertWeightToFontSize;
		if (minWeight < maxWeight && fontSizeRatio > 0 && fontSizeRatio < Infinity) {
			if (fontSizeRatio < 1) {
				fontSizeRatio = 1 / fontSizeRatio;
			}
			convertWeightToFontSize = function(weight) {
				return Math_mapLinear(weight, minWeight, maxWeight, 1, fontSizeRatio);
			};
		} else {
			words = Array_dropRightUntil(words, ({weight}) => weight > 0);
			if (words.length > 0) {
				minWeight = Array_last(words).weight;
			}
			convertWeightToFontSize = function(weight) {
				return weight / minWeight;
			};
		}

		let boundWordWorker = new Worker(boundWordWorkerContent);
		try {

			let gridResolution = Math.pow(2, 22);
			let gridWidth = Math.floor(Math.sqrt(containerAspect * gridResolution));
			let gridHeight = Math.floor(gridResolution / gridWidth);
			gridWidth = Math_ceilToNearestPowerOfTwo(gridWidth);
			gridHeight = Math_ceilToNearestPowerOfTwo(gridHeight);

			boundWordWorker.postMessage({gridWidth, gridHeight});

			for (let word of words) {

				context.throwIfInterrupted();

				try {

					let {
						key,
						text,
						weight,
						rotation,
						fontFamily,
						fontStyle,
						fontVariant,
						fontWeight,
						color,
					} = word;

					let fontSize = 4 * convertWeightToFontSize(weight);
					let rotationRad = Math_turnToRad(rotation);

					let font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
					try {
						await document.fonts.load(font,  text);
					} catch (error) {
						// continue regardless of error
					}

					let ctx = document.createElement('canvas').getContext('2d');
					ctx.font = font;
					let textWidth = ctx.measureText(text).width;
					if (textWidth > 0) {

						let textHeight = fontSize;
						let outerTextPadding = Math.max(ctx.measureText('m').width, fontSize);
						let outerTextWidth = textWidth + 2 * outerTextPadding;
						let outerTextHeight = textHeight + 2 * outerTextPadding;
						let [rectWidth, rectHeight] = D2_rectAfterRotation(textWidth, textHeight, rotationRad);
						let [outerRectWidth, outerRectHeight] = D2_rectAfterRotation(outerTextWidth, outerTextHeight, rotationRad);
						outerRectWidth = Math_ceilToNearestPowerOfTwo(outerRectWidth);
						outerRectHeight = Math_ceilToNearestPowerOfTwo(outerRectHeight);
						let outerRectData = new Uint8Array(outerRectWidth * outerRectHeight);

						ctx.canvas.width = outerRectWidth;
						ctx.canvas.height = outerRectHeight;
						ctx.translate(outerRectWidth / 2, outerRectHeight / 2);
						ctx.rotate(rotationRad);
						ctx.font = font;
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';
						ctx.fillText(text, 0, 0);
						let imageData = ctx.getImageData(0, 0, outerRectWidth, outerRectHeight).data;
						for (let i = 0, ii = outerRectData.length; i < ii; ++i) {
							outerRectData[i] = imageData[i * 4 + 3];
						}

						boundWordWorker.postMessage({
							rectWidth: outerRectWidth,
							rectHeight: outerRectHeight,
							rectData: outerRectData,
						});
						let {
							rectLeft: outerRectLeft,
							rectTop: outerRectTop,
						} = await Worker_getMessage(boundWordWorker);

						let rectLeft = outerRectLeft + (outerRectWidth - rectWidth) / 2;
						let rectTop = outerRectTop + (outerRectHeight - rectHeight) / 2;

						boundedWords.push({
							key,
							text,
							rotation,
							fontFamily,
							fontSize,
							fontStyle,
							fontVariant,
							fontWeight,
							rectLeft,
							rectTop,
							rectWidth,
							rectHeight,
							textWidth,
							textHeight,
							color,
						});
					}
				} catch (error) {
					// console.log(error);
					// continue regardless of error
				}
			}
		} finally {
			boundWordWorker.terminate();
		}

		await context.delayIfNotInterrupted();
	}

	return boundedWords;
};

var Iterable_min = function(values, iteratee) {
	let returns = Infinity;
	for (let value of values) {
		returns = Math.min(iteratee(value), returns);
	}
	return returns;
};

var Iterable_max = function(values, iteratee) {
	let returns = -Infinity;
	for (let value of values) {
		returns = Math.max(iteratee(value), returns);
	}
	return returns;
};

var computeScaledBoundedWords = function() {
	let words = this.boundedWords;
	let containerWidth = this.containerWidth;
	let containerHeight = this.containerHeight;
	let maxFontSize = this.maxFontSize;

	let containedLeft = Iterable_min(words, ({rectLeft}) => rectLeft);
	let containedRight = Iterable_max(words, ({rectLeft, rectWidth}) => rectLeft + rectWidth);
	let containedWidth = containedRight - containedLeft;

	let containedTop = Iterable_min(words, ({rectTop}) => rectTop);
	let containedBottom = Iterable_max(words, ({rectTop, rectHeight}) => rectTop + rectHeight);
	let containedHeight = containedBottom - containedTop;

	let scaleFactor = Math.min(containerWidth / containedWidth, containerHeight / containedHeight);

	let currentMaxFontSize = Iterable_max(words, ({fontSize}) => fontSize) * scaleFactor;
	if (currentMaxFontSize > maxFontSize) {
		scaleFactor *= maxFontSize / currentMaxFontSize;
	}

	return words.map(({key, text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight}) => {
		rectLeft = (rectLeft - (containedLeft + containedRight) / 2) * scaleFactor + containerWidth / 2;
		rectTop = (rectTop - (containedTop + containedBottom) / 2) * scaleFactor + containerHeight / 2;
		rectWidth *= scaleFactor;
		rectHeight *= scaleFactor;
		textWidth *= scaleFactor;
		textHeight *= scaleFactor;
		fontSize *= scaleFactor;
		return {key, text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight};
	});
};

let VueWordCloud = {
	name: 'VueWordCloud',

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

		fontSizeRatio: {
			type: Number,
			default: 0,
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
		return {
			containerWidth: 0,
			containerHeight: 0,

			//domWords: {},

			fulfilledBoundedWords: [],
		};
	},

	mounted() {
		this.startContainerSizeUpdate();
	},

	computed: {
		renderer() {
			return this.domRenderer;
		},

		normalizedWords: computeNormalizedWords,

		boundedWords() {
			(async () => {
				try {
					this.fulfilledBoundedWords = await this.promisedBoundedWords;
				} catch (error) {
					// console.log(error);
					// continue regardless of error
				}
			})();
			return this.fulfilledBoundedWords;
		},

		promisedBoundedWords() {
			return this.computeBoundedWords();
		},

		computeBoundedWords() {
			let outerToken;
			return async function() {
				let self = this;
				let innerToken = (outerToken = {});
				return await computeBoundedWords.call(this, {
					get interrupted() {
						return innerToken !== outerToken || self._isDestroyed;
					},

					throwIfInterrupted() {
						if (this.interrupted) {
							throw new InterruptError();
						}
					},

					async delayIfNotInterrupted(ms) {
						this.throwIfInterrupted();
						await Promise_delay(ms);
						this.throwIfInterrupted();
					},
				});
			};
		},

		scaledBoundedWords: computeScaledBoundedWords,

		domWords() {
			let words = [...this.scaledBoundedWords];
			let wordsCount = words.length;
			let transitionDuration = this.animationDuration / 4;
			let transitionDelay = (this.animationDuration - transitionDuration) / wordsCount;
			let transitionEasing = this.animationEasing;
			let domWords = {};
			words.forEach(({key, text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight}, index) => {
				domWords[key] = {
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
					text,
				};
			});
			return domWords;
		},

		startContainerSizeUpdate() {
			return function() {
				if (!this._isDestroyed) {
					setTimeout(() => {
						this.startContainerSizeUpdate();
					}, this.containerSizeUpdateInterval);
					this.updateContainerSize();
				}
			};
		},
	},

	methods: {
		domRenderer(createElement) {
			return createElement('div', {
				style: {
					position: 'relative',
					width: '100%',
					height: '100%',
					overflow: 'hidden',
				},
			}, Object.entries(this.domWords).map(([key, {style, text}]) =>
				createElement('div', {key, style}, text)
			));
		},

		canvasRenderer(createElement) {
			// todo?
			/*
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
				ctx.rotate(Math_turnToRad(rotation));
				ctx.restore();
			});
			return canvas;
			*/
		},

		svgRenderer(createElement) {
			// todo?
		},

		updateContainerSize() {
			let {width, height} = this.$el.getBoundingClientRect();
			this.containerWidth = width;
			this.containerHeight = height;
		},
	},
};

Vue.component(VueWordCloud.name, VueWordCloud);

return VueWordCloud;

})));
