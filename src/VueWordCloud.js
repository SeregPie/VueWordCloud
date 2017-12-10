import Array_sample from './helpers/Array/sample';
import Function_constant from './helpers/Function/constant';
import Function_isFunction from './helpers/Function/isFunction';
import Function_noop from './helpers/Function/noop';
import Reflect_isEqual from './helpers/Reflect/isEqual';

import getKeyedPopulatedWords from './members/getKeyedPopulatedWords';
import getKeyedBoundableWords from './members/getKeyedBoundableWords';
import getBoundedWords from './members/getBoundedWords';
import getScaledBoundedWords from './members/getScaledBoundedWords';
import render from './members/render';

let VueWordCloud = {
	name: 'VueWordCloud',

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

			keyedBoundableWords: undefined,
			fulfilledBoundedWords: Object.freeze([]),
		};
	},

	computed: {
		getText() {
			let value = this.text;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getWeight() {
			let value = this.weight;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getRotation() {
			let value = this.rotation;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getFontFamily() {
			let value = this.fontFamily;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getFontStyle() {
			let value = this.fontStyle;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getFontVariant() {
			let value = this.fontVariant;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getFontWeight() {
			let value = this.fontWeight;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		getColor() {
			let value = this.color;
			return Function_isFunction(value) ? value : Function_constant(value);
		},

		keyedPopulatedWords() {
			return getKeyedPopulatedWords(
				this.words,
				this.getText,
				this.getWeight,
				this.getRotation,
				this.getFontFamily,
				this.getFontStyle,
				this.getFontVariant,
				this.getFontWeight,
				this.getColor,
			);
		},

		watchedKeyedBoundableWords() {
			return getKeyedBoundableWords(this.keyedPopulatedWords);
		},

		boundableWords() {
			return Object.values(this.keyedBoundableWords);
		},

		boundedWords() {
			Promise
				.resolve(this.promisedBoundedWords)
				.then(value => {
					this.fulfilledBoundedWords = Object.freeze(value);
				})
				.catch(Function_noop);
			return this.fulfilledBoundedWords;
		},

		promisedBoundedWords() {
			return getBoundedWords(
				this.boundableWords,
				this.containerWidth,
				this.containerHeight,
				this.fontSizeRatio,
			);
		},

		scaledBoundedWords() {
			return getScaledBoundedWords(
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
		watchedKeyedBoundableWords: {
			handler(newValue, oldValue) {
				if (!Reflect_isEqual(newValue, oldValue)) {
					this.keyedBoundableWords = Object.freeze(newValue);
				}
			},
			immediate: true,
		},
	},

	mounted() {
		this.startToUpdateContainerSize();
	},

	methods: {
		updateContainerSize() {
			let {width, height} = this.$el.getBoundingClientRect();
			this.containerWidth = width;
			this.containerHeight = height;
		},
	},

	render(createElement) {
		return render(
			createElement,
			Object.assign({
				default: ({text}) => text,
			}, this.$scopedSlots),
			this.scaledBoundedWords,
			this.keyedPopulatedWords,
		);
	},
};

export default VueWordCloud;

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.component(VueWordCloud.name, VueWordCloud);
}