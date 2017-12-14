import Array_sample from './helpers/Array/sample';
import Function_constant from './helpers/Function/constant';
import Function_isFunction from './helpers/Function/isFunction';
import Function_noop from './helpers/Function/noop';
import Function_stubArray from './helpers/Function/stubArray';
import Object_isObject from './helpers/Object/isObject';

import AsyncComputedContext from './members/AsyncComputedContext';
import getKeyedPopulatedWords from './members/getKeyedPopulatedWords';
import getBoundedWords from './members/getBoundedWords';
import getScaledBoundedWords from './members/getScaledBoundedWords';
import render from './members/render';

let asyncComputed = {
	boundedWords: {
		get(context) {
			return getBoundedWords(
				context,
				this.populatedWords,
				this.containerWidth,
				this.containerHeight,
				this.fontSizeRatio,
			);
		},
		default: Function_stubArray,
	}
};

let VueWordCloud = {
	name: 'VueWordCloud',

	props: {
		words: {
			type: Array,
			default: Function_stubArray,
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

		animationDuration: {
			type: Number,
			default: 5000,
		},

		intervalBetweenUpdateContainerSize: {
			type: Number,
			default: 1000,
		},
	},

	data() {
		let returns = {
			containerWidth: 0,
			containerHeight: 0,
		};
		Object.entries(asyncComputed).forEach(([key, def]) => {
			let defaultValue = def.default;
			if (Function_isFunction(defaultValue)) {
				defaultValue = defaultValue.call(this);
			}
			if (Object_isObject(defaultValue)) {
				defaultValue = Object.freeze(defaultValue);
			}
			returns['fulfilled$' + key] = defaultValue;
		});
		return returns;
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

		populatedWords() {
			return Object.values(this.keyedPopulatedWords);
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

	beforeCreate() {
		Object.entries(asyncComputed).forEach(([key, def]) => {
			let errorHandler = def.errorHandler || Function_noop;
			this.$options.computed[key] = function() {
				Promise
					.resolve(this['promised$' + key])
					.then(value => {
						if (Object_isObject(value)) {
							value = Object.freeze(value);
						}
						this['fulfilled$' + key] = value;
					})
					.catch(errorHandler);
				return this['fulfilled$' + key];
			};
			let outerContext = new AsyncComputedContext();
			this.$options.computed['promised$' + key] = function() {
				outerContext.interrupt();
				let innerContext = (outerContext = new AsyncComputedContext());
				return Promise
					.resolve(def.get.call(this, innerContext))
					.then(value => {
						if (this._isDestroyed) {
							throw new Error();
						}
						innerContext.throwIfInterrupted();
						return value;
					});
			};
		});
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
			this.animationDuration,
		);
	},
};

export default VueWordCloud;

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.component(VueWordCloud.name, VueWordCloud);
}