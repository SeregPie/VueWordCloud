import {
	computed,
	defineComponent,
	h,
	onMounted,
	onUnmounted,
	shallowRef,
	TransitionGroup,
	watch,
	watchEffect,
} from 'vue';

import toCSSFont from '../utils/toCSSFont';
import isArray from '../utils/isArray';
import isObject from '../utils/isObject';
import isString from '../utils/isString';

export default defineComponent({
	name: 'VueWordCloud',
	props: {
		/*animationDuration: {
			type: Number,
			default: 1000,
		},*/
		/*animationEasing: {
			type: String,
			default: 'ease',
		},*/
		/*animationOverlap: {
			type: Number,
			default: 1,
		},*/
		/*color: {
			type: [String, Function],
			default: 'Black',
		},*/
		/*createCanvas: {
			type: Function,
			default() {
				return document.createElement('canvas');
			},
		},*/
		/*createWorker: {
			type: Function,
			default(code) {
				return new Worker(URL.createObjectURL(new Blob([code])));
			},
		},*/
		/*enterAnimation: {
			type: [Object, String],
			default: Function_constant({opacity: 0}),
		},*/
		fontFamily: {
			type: String,
			default: 'serif',
		},
		fontSizeRatio: {
			type: Number,
			default: 0,
		},
		fontStyle: {
			type: String,
			default: 'normal',
		},
		fontVariant: {
			type: String,
			default: 'normal',
		},
		fontWeight: {
			type: String,
			default: 'normal',
		},
		/*leaveAnimation: {
			type: [Object, String],
			default: Function_constant({opacity: 0}),
		},*/
		/*loadFont: {
			type: Function,
			default(fontFamily, fontStyle, fontWeight, text) {
				return document.fonts.load([fontStyle, fontWeight, '1px', fontFamily].join(' '), text);
			},
		},*/
		/*rotation: {
			type: [Number, Function],
			default: 0,
		},*/
		/*rotationUnit: {
			type: [String, Function],
			default: 'turn',
		},*/
		spacing: {
			type: Number,
			default: 0,
		},
		words: Array,
	},
	setup(props, {
		emit,
		slots,
	}) {
		let wordsRef = computed(() => {
			let {
				words,
				fontFamily: defaultFontFamily,
				fontWeight: defaultFontWeight,
				fontVariant: defaultFontVariant,
				fontStyle: defaultFontStyle,
			} = props;
			let defaultWeight = 1;
			let result = [];
			if (words) {
				words.forEach(word => {
					if (word) {
						if (isString(word)) {
							text = word;
						} else
						if (isArray(word)) {
							[text, weight] = word;
						} else
						if (isObject(word)) {
							({
								color,
								fontFamily,
								fontStyle,
								fontVariant,
								fontWeight,
								text,
								weight,
							} = word);
						}
					}
				});
				if (words.length) {
					let maxWeight = firstWord.ǂweight;
					let minWeight = lastWord.ǂweight;
					if (minWeight < maxWeight) {
						let fontSizeRange = (() => {
							if (fontSizeRatio > 0) {
								return 1 / fontSizeRatio;
							}
							if (minWeight > 0) {
								return maxWeight / minWeight;
							}
							if (maxWeight < 0) {
								return minWeight / maxWeight;
							}
							return 1 + maxWeight - minWeight;
						})();
						words.forEach(word => {
							word.ǂfontSize = Math_map(word.ǂweight, minWeight, maxWeight, 1, fontSizeRange);
						});
					}
				}
			}
			return result;
		});
		let elRef = shallowRef();
		let cloudWidthRef = shallowRef(0);
		let cloudHeightRef = shallowRef(0);
		let cloudWordsRef = shallowRef([]);
		onMounted(() => {
			let timer = setInterval(() => {
				let el = elRef.value;
				if (el) {
					cloudWidthRef.value = el.offsetWidth;
					cloudHeightRef.value = el.offsetHeight;
				}
			}, 1000);
			onUnmounted(() => {
				clearInterval(timer);
			});
		});
		watchEffect(onInvalidate => {
			let words = wordsRef.value;
			let cloudWidth = cloudWidthRef.value;
			let cloudHeight = cloudHeightRef.value;
			let timer = setTimeout(() => {
				let cloudWords = words.map(({
					fontFamily,
					fontSize,
					fontStyle,
					fontVariant,
					fontWeight,
					text,
					weight,
					//word,
				}) => ({
					color: 'Black',
					font: toCSSFont(
						fontFamily,
						fontSize,
						fontStyle,
						fontVariant,
						fontWeight,
					),
					key: Math.random(),
					left: Math.random() * cloudWidth,
					rotation: Math.random() * Math.PI,
					text,
					top: Math.random() * cloudHeight,
					weight,
					//word,
				}));
				cloudWordsRef.value = cloudWords;
			}, 1);
			onInvalidate(() => {
				clearTimeout(timer);
			});
		});
		return (() => {
			let cloudWords = cloudWordsRef.value;
			let genWord = (() => {
				let slot = slots.word;
				if (slot) {
					return slot;
				}
				return (({text}) => text);
			})();
			return h(
				'div',
				{
					style: {
						height: '100%',
						position: 'relative',
						width: '100%',
					},
					ref: elRef,
				},
				[h(
					'div',
					{
						style: {
							bottom: '50%',
							position: 'absolute',
							right: '50%',
							transform: 'translate(50%,50%)',
						},
					},
					cloudWords.map(({
						color,
						font,
						key,
						left,
						rotation,
						text,
						top,
						weight,
						//word,
					}) => {
						return h(
							'div',
							{
								key,
								style: {
									left: `${left}px`,
									position: 'absolute',
									top: `${top}px`,
								},
							},
							[h(
								'div',
								{
									style: {
										bottom: '50%',
										color: color,
										font: font,
										position: 'absolute',
										right: '50%',
										transform: [
											'translate(50%,50%)',
											`rotate(${rotation}rad)`,
										].join(' '),
										whiteSpace: 'nowrap',
									},
								},
								genWord({
									color,
									font,
									left,
									text,
									top,
									weight,
									//word,
								}),
							)],
						);
					}),
				)],
			);
		});
	},
});
