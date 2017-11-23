import Vue from 'vue';

import Array_sample from './helpers/Array/sample';
import Function_constant from './helpers/Function/constant';
import Function_isFunction from './helpers/Function/isFunction';
import Reflect_isEqual from './helpers/Reflect/isEqual';

import render from './members/render';
import computeKeyedPopulatedWords from './members/computeKeyedPopulatedWords';
import computeBoundableWords from './members/computeBoundableWords';
import computeBoundedWords from './members/computeBoundedWords';
import computeScaledBoundedWords from './members/computeScaledBoundedWords';

let VueWordCloud = {
	name: 'VueWordCloud',

	render(createElement) {
		return render(
			createElement,
			this.scaledBoundedWords,
			this.keyedPopulatedWords,
			this.$scopedSlots.default
				? this.$scopedSlots.default
				: ({text}) => text,
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

		rotation: {
			type: [String, Function],
			default() {
				let values = [0, 3/4];
				return function() {
					return Array_sample(values);
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

		intervalBetweenUpdateContainerSize: {
			type: Number,
			default: 1000,
		},
	},

	data() {
		return {
			containerWidth: 0,
			containerHeight: 0,

			boundableWords: undefined,
		};
	},

	mounted() {
		this.startToUpdateContainerSize();
	},

	computed: {
		computeText() {
			let value = this.text;
			if (Function_isFunction(value)) {
				return value;
			}
			return Function_constant(value);
		},

		computeWeight() {
			let value = this.weight;
			if (Function_isFunction(value)) {
				return value;
			}
			return Function_constant(value);
		},

		computeRotation() {
			let value = this.rotation;
			if (Function_isFunction(value)) {
				return value;
			}
			return Function_constant(value);
		},

		computeFontFamily() {
			let value = this.fontFamily;
			if (Function_isFunction(value)) {
				return value;
			}
			return Function_constant(value);
		},

		computeFontStyle() {
			let value = this.fontStyle;
			if (Function_isFunction(value)) {
				return value;
			}
			return Function_constant(value);
		},

		computeFontVariant() {
			let value = this.fontVariant;
			if (Function_isFunction(value)) {
				return value;
			}
			return Function_constant(value);
		},

		computeFontWeight() {
			let value = this.fontWeight;
			if (Function_isFunction(value)) {
				return value;
			}
			return Function_constant(value);
		},

		computeColor() {
			let value = this.color;
			if (Function_isFunction(value)) {
				return value;
			}
			return Function_constant(value);
		},

		keyedPopulatedWords() {
			return computeKeyedPopulatedWords(
				this.words,
				this.computeText,
				this.computeWeight,
				this.computeRotation,
				this.computeFontFamily,
				this.computeFontStyle,
				this.computeFontVariant,
				this.computeFontWeight,
				this.computeColor,
			);
		},

		populatedWords() {
			return Object.values(this.keyedPopulatedWords);
		},

		watch$boundableWords() {
			return computeBoundableWords(this.populatedWords);
		},

		boundedWords() {
			return computeBoundedWords(
				this.boundableWords,
				this.containerWidth,
				this.containerHeight,
				this.fontSizeRatio,
			);
		},

		scaledBoundedWords() {
			return computeScaledBoundedWords(
				this.boundedWords,
				this.containerWidth,
				this.containerHeight,
				this.maxFontSize,
			);
		},

		startToUpdateContainerSize() {
			return function() {
				if (!this._isDestroyed) {
					setTimeout(() => {
						requestAnimationFrame(() => {
							this.startToUpdateContainerSize();
						});
					}, this.intervalBetweenUpdateContainerSize);
					this.updateContainerSize();
				}
			};
		},
	},

	watch: {
		watch$boundableWords: {
			handler(newValue, oldValue) {
				if (!Reflect_isEqual(newValue, oldValue)) {
					this.boundableWords = Object.freeze(newValue);
				}
			},
			immediate: true,
		},
	},

	methods: {
		updateContainerSize() {
			let {width, height} = this.$el.getBoundingClientRect();
			this.containerWidth = width;
			this.containerHeight = height;
		},
	},
};

export default VueWordCloud;

if (typeof window !== 'undefined') {
	Vue.component(VueWordCloud.name, VueWordCloud);
}