import Vue from 'vue';

import InterruptError from './helpers/InterruptError';
import Promise_delay from './helpers/Promise/delay';

import computeNormalizedWords from './members/computeNormalizedWords.js';
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

export default VueWordCloud;