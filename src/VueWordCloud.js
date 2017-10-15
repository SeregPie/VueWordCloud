import Vue from 'vue';

import InterruptError from './helpers/InterruptError';
import Promise_delay from './helpers/Promise/delay';
import Array_first from './helpers/Array/first';
import Array_last from './helpers/Array/last';
import Math_mapLinear from './helpers/Math/mapLinear';

import computeBoundedWords from './members/computeBoundedWords.js';
import computeScaledBoundedWords from './members/computeScaledBoundedWords.js';

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

		normalizedWords() {
			let keys = {};
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
				let key = JSON.stringify([text, fontFamily, fontStyle, fontVariant, fontWeight]);
				let keyCount = keys[key] || 0;
				keys[key] = keyCount + 1;
				if (keyCount > 0) {
					key = JSON.stringify([text, fontFamily, fontStyle, fontVariant, fontWeight, keyCount]);
				}
				return {key, text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color};
			});

			words = words.filter(({text}) => text);
			words = words.filter(({weight}) => weight > 0);

			if (words.length > 0) {
				words.sort((word, otherWord) => otherWord.weight - word.weight);

				let minWeight = Array_last(words).weight;
				let maxWeight = Array_first(words).weight;

				let fontSizeRatio = this.fontSizeRatio;
				if (fontSizeRatio > 0 && fontSizeRatio < Infinity) {
					if (fontSizeRatio < 1) {
						fontSizeRatio = 1/fontSizeRatio;
					}
					for (let word of words) {
						word.weight = Math_mapLinear(word.weight, minWeight, maxWeight, 1, fontSizeRatio);
					}
				} else {
					for (let word of words) {
						word.weight /= minWeight;
					}
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

export default VueWordCloud;