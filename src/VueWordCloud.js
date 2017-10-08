import Vue from 'vue';

import InterruptError from './helpers/InterruptError';
import Worker_getMessage from './helpers/Worker/getMessage';
import Promise_delay from './helpers/Promise/delay';
import Array_uniqueBy from './helpers/Array/uniqueBy';
import Iterable_min from './helpers/Iterable/min';
import Iterable_max from './helpers/Iterable/max';
import Math_turnToRad from './helpers/Math/turnToRad';



import boundWordWorkerContent from 'objectURL!./workers/boundWord.js';


let interpolateWeight = function (weight, maxWeight, minWeight = 1, outputMin, outputMax) {
	const input = weight;
	const inputMin = minWeight;
	const inputMax = maxWeight;
	const inputRange = [inputMin, inputMax];

	if (outputMin === outputMax) {
		return outputMin;
	}

	if (inputMin === inputMax) {
		if (input <= inputMin) {
			return outputMin;
		}
		return outputMax;
	}

	let result = input;

	// Input Range
	result = (result - inputMin) / (inputMax - inputMin);

	// Output Range
	result = result * (outputMax - outputMin) + outputMin;
	return result;
};



let VueWordCloud = {
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

			let minWeight = Iterable_min(words, ({weight}) => weight);
			let maxWeight = Iterable_max(words, ({weight}) => weight);
			if (this.fontSizeRatio) {
				for (let word of words) {
					word.weight = interpolateWeight(word.weight, maxWeight, minWeight, 1, this.fontSizeRatio);
				}
			} else {
				for (let word of words) {
					word.weight /= minWeight;
				}
			}

			return words;
		},

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

		computeBoundedWords: (function() {
			let getTextRect = async function(text, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation) {
				rotation = Math_turnToRad(rotation);
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

			let compute = async function(context) {
				let containerWidth = this.containerWidth;
				let containerHeight = this.containerHeight;
				if (containerWidth <= 0 || containerHeight <= 0) {
					return [];
				}
				let words = this.normalizedWords;
				await context.delayIfNotInterrupted();
				let containerAspect = containerWidth / containerHeight;
				let boundedWords = [];
				let boundWordWorker = new Worker(boundWordWorkerContent);
				try {
					let gridResolution = Math.pow(2, 22);
					let gridWidth = Math.floor(Math.sqrt(containerAspect * gridResolution));
					let gridHeight = Math.floor(gridResolution / gridWidth);
					boundWordWorker.postMessage({gridWidth, gridHeight});
					for (let word of words) {
						context.throwIfInterrupted();
						try {
							let {text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color} = word;
							let fontSize = weight * 4;
							let {textWidth, textHeight, rectWidth, rectHeight, rectData} = await getTextRect(text, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation);
							boundWordWorker.postMessage({rectWidth, rectHeight, rectData});
							let {rectLeft, rectTop} = await Worker_getMessage(boundWordWorker);
							boundedWords.push({text, rotation, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight, color});
						} catch (error) {
							// console.log(error);
							// continue regardless of error
						}
					}
				} finally {
					boundWordWorker.terminate();
				}
				await context.delayIfNotInterrupted();
				return boundedWords;
			};

			return function() {
				let outerToken;
				return async function() {
					let self = this;
					let innerToken = (outerToken = {});
					return await compute.call(this, {
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
			};
		})(),

		scaledBoundedWords() {
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

			return words.map(({text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight}) => {
				rectLeft = (rectLeft - (containedLeft + containedRight) / 2) * scaleFactor + containerWidth / 2;
				rectTop = (rectTop - (containedTop + containedBottom) / 2) * scaleFactor + containerHeight / 2;
				rectWidth *= scaleFactor;
				rectHeight *= scaleFactor;
				textWidth *= scaleFactor;
				textHeight *= scaleFactor;
				fontSize *= scaleFactor;
				return {text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight};
			});
		},

		domWords() {
			let words = [...this.scaledBoundedWords];
			let wordsCount = words.length;
			let transitionDuration = this.animationDuration / 4;
			let transitionDelay = (this.animationDuration - transitionDuration) / wordsCount;
			let transitionEasing = this.animationEasing;
			let domWords = {};
			words.forEach(({text, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight}, index) => {
				domWords[text] = {
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

Vue.component('VueWordCloud', VueWordCloud);

export default VueWordCloud;