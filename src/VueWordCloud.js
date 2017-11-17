import Vue from 'vue';

import Array_sample from './helpers/Array/sample';
import Function_noop from './helpers/Function/noop';
import InterruptError from './helpers/InterruptError';
import Promise_delay from './helpers/Promise/delay';

import render from './members/render';
import computeNormalizedWords from './members/computeNormalizedWords';
import computeBoundedWords from './members/computeBoundedWords';
import computeScaledBoundedWords from './members/computeScaledBoundedWords';

let VueWordCloud = {
	name: 'VueWordCloud',

	render,

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

			fulfilledBoundedWords: [],
		};
	},

	mounted() {
		this.startToUpdateContainerSize();
	},

	computed: {
		normalizedWords: computeNormalizedWords,
		boundedWords: computeBoundedWords,
		scaledBoundedWords: computeScaledBoundedWords,

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