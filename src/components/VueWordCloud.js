import {
	computed,
	defineComponent,
	h,
	onMounted,
	shallowRef,
	watchEffect,
} from 'vue';

import isArray from '../utils/isArray';
import isObject from '../utils/isObject';
import isString from '../utils/isString';
import scaleNumber from '../utils/scaleNumber';
import toCSSFont from '../utils/toCSSFont';
import sleep from '../utils/sleep';
import useFFF from '../utils/useFFF';
import constant from '../utils/constant';
import stubArray from '../utils/stubArray';

export default defineComponent({
	name: 'VueWordCloud',
	props: {
		animationDuration: {
			type: Number,
			default: 1000,
		},
		animationEasing: {
			type: String,
			default: 'ease',
		},
		animationOverlap: {
			type: Number,
			default: 1,
		},
		/*colorStrategy: {
			type: [String, Function],
			default: 'Black',
		},*/
		enterAnimation: {
			type: [Object, String],
			default: constant({opacity: 0}),
		},
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
		leaveAnimation: {
			type: [Object, String],
			default: constant({opacity: 0}),
		},
		/*loadFont: {
			type: Function,
			default(fontFamily, fontStyle, fontWeight, text) {
				return document.fonts.load([fontStyle, fontWeight, '1px', fontFamily].join(' '), text);
			},
		},*/
		/*rotationStrategy: {
			type: [String, Function],
			default: 0,
		},*/
		spacing: {
			type: Number,
			default: 0,
		},
		words: {
			type: Array,
			default: stubArray,
		},
	},
	setup(props, {
		slots,
	}) {
		let elRef = shallowRef();
		let cloudWidthRef = shallowRef(0);
		let cloudHeightRef = shallowRef(0);
		onMounted(() => {
			useFFF(() => {
				let el = elRef.value;
				if (el) {
					cloudWidthRef.value = el.offsetWidth;
					cloudHeightRef.value = el.offsetHeight;
				}
			}, {
				immediate: true,
			});
		});
		let fontSizeRatioRef = computed(() => {
			let n = props.fontSizeRatio;
			n = Math.abs(n);
			if (n > 1) {
				n = 1 / n;
			}
			return n;
		});
		let cpnyWordsRef = computed(() => {
			let {
				fontFamily: defaultFontFamily,
				fontStyle: defaultFontStyle,
				fontVariant: defaultFontVariant,
				fontWeight: defaultFontWeight,
				words,
			} = props;
			let defaultText = '';
			let defaultWeight = 1;
			let result = new Map();
			words.forEach(word => {
				let {
					color,
					fontFamily = defaultFontFamily,
					fontStyle = defaultFontStyle,
					fontVariant = defaultFontVariant,
					fontWeight = defaultFontWeight,
					rotation,
					text = defaultText,
					weight = defaultWeight,
				} = (() => {
					if (isString(word)) {
						let text = word;
						return {text};
					}
					if (isArray(word)) {
						let [
							text,
							weight,
						] = word;
						return {
							text,
							weight,
						};
					}
					if (isObject(word)) {
						return word;
					}
					return {};
				})();
				// todo
				let key;
				{
					let font = toCSSFont(
						fontFamily,
						1,
						fontStyle,
						fontVariant,
						fontWeight,
					);
					key = JSON.stringify([text, font]);
					while (result.has(key)) {
						key += '!';
					}
				}
				result.set(key, {
					color,
					fontFamily,
					fontStyle,
					fontVariant,
					fontWeight,
					rotation,
					text,
					weight,
					word,
				});
			});
			return result;
		});
		let omjnWordsRef = computed(() => {
			let words = cpnyWordsRef.value;
			let fontSizeRatio = fontSizeRatioRef.value;
			let minWeight = +Infinity;
			let maxWeight = -Infinity;
			words.forEach(({weight}) => {
				minWeight = Math.min(minWeight, weight);
				maxWeight = Math.max(maxWeight, weight);
			});
			let minFontSize = 1;
			let maxFontSize = (() => {
				if (minWeight < maxWeight) {
					if (fontSizeRatio) {
						return 1 / fontSizeRatio;
					}
					if (minWeight > 0) {
						return maxWeight / minWeight;
					}
					if (maxWeight < 0) {
						return minWeight / maxWeight;
					}
					return 1 + maxWeight - minWeight;
				}
				return 1;
			})();
			let result = new Map();
			words.forEach(({weight}, key) => {
				let fontSize = scaleNumber(weight, minWeight, maxWeight, minFontSize, maxFontSize);
				result.set(key, fontSize);
			});
			return result;
		});
		let ijqiWordsRef = computed(() => {
			let cpnyWords = cpnyWordsRef.value;
			let omjnWords = omjnWordsRef.value;
			let result = new Map();
			cpnyWords.forEach(({
				fontFamily,
				fontStyle,
				fontVariant,
				fontWeight,
				rotation,
				text,
			}, key) => {
				let fontSize = omjnWords.get(key);
				result.set(key, {
					fontFamily,
					fontSize,
					fontStyle,
					fontVariant,
					fontWeight,
					rotation,
					text,
				});
			});
			return result;
		});
		let satpWordsRef = shallowRef(new Map());
		let satpWidthRef = shallowRef(0);
		let satpHeightRef = shallowRef(0);
		watchEffect(async onInvalidate => {
			let words = ijqiWordsRef.value;
			let controller = new AbortController();
			onInvalidate(() => {
				controller.abort();
			});
			let {signal} = controller;
			await sleep(2000);
			console.log(signal.aborted);
			if (signal.aborted) {
				return;
			}
			let ojozLeft = 0;
			let ojozRight = 0;
			let ojozTop = 0;
			let ojozBottom = 0;
			let satpWords = new Map();
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');
			words.forEach(({
				fontFamily,
				fontSize,
				fontStyle,
				fontVariant,
				fontWeight,
				rotation = Math.random() * Math.PI,
				text,
			}, key) => {
				let font = toCSSFont(
					fontFamily,
					fontSize,
					fontStyle,
					fontVariant,
					fontWeight,
				);
				let width;
				let height;
				{
					ctx.font = font;
					let x = ctx.measureText(text).width + fontSize;
					let y = fontSize * 2;
					let a = rotation;
					let cosA = Math.abs(Math.cos(a));
					let sinA = Math.abs(Math.sin(a));
					width = x * cosA + y * sinA;
					height = x * sinA + y * cosA;
				}
				let left = ((min, max) => min + (max - min) * Math.random())(ojozLeft - width, ojozRight + width);
				let top = ((min, max) => min + (max - min) * Math.random())(ojozTop - height, ojozBottom + height);
				ojozLeft = Math.min(ojozLeft, left);
				ojozRight = Math.max(ojozRight, left + width);
				ojozTop = Math.min(ojozTop, top);
				ojozBottom = Math.max(ojozBottom, top + height);
				satpWords.set(key, {
					left,
					rotation,
					top,
				});
			});
			if (signal.aborted) {
				return;
			}
			let satpLeft = (ojozLeft + ojozRight) / 2;
			let satpTop = (ojozTop + ojozBottom) / 2;
			let satpWidth = ojozRight - ojozLeft;
			let satpHeight = ojozBottom - ojozTop;
			satpWords.forEach(word => {
				word.left -= satpLeft;
				word.top -= satpTop;
			});
			if (signal.aborted) {
				return;
			}
			satpWordsRef.value = satpWords;
			satpWidthRef.value = satpWidth;
			satpHeightRef.value = satpHeight;
		});
		let satpScalingRef = computed(() => {
			let satpWidth = satpWidthRef.value;
			let satpHeight = satpHeightRef.value;
			if (satpWidth && satpHeight) {
				let cloudWidth = cloudWidthRef.value;
				let cloudHeight = cloudHeightRef.value;
				return Math.min(cloudWidth / satpWidth, cloudHeight / satpHeight);
			}
			return 0;
		});
		let btciWordsRef = computed(() => {
			let cpnyWords = cpnyWordsRef.value;
			let result = new Map();
			cpnyWords.forEach(({
				color = 'Black',
			}, key) => {
				result.set(key, color);
			});
			return result;
		});
		let eicpWordsRef = computed(() => {
			let omjnWords = omjnWordsRef.value;
			let satpWords = satpWordsRef.value;
			let satpScaling = satpScalingRef.value;
			let result = new Map();
			satpWords.forEach(({
				left,
				top,
			}, key) => {
				let fontSize = omjnWords.get(key);
				fontSize *= satpScaling;
				left *= satpScaling;
				top *= satpScaling;
				result.set(key, {
					fontSize,
					left,
					top,
				});
			});
			return result;
		});
		let cloudWordsRef = computed(() => {
			let cpnyWords = cpnyWordsRef.value;
			let btciWords = btciWordsRef.value;
			let eicpWords = eicpWordsRef.value;
			let satpWords = satpWordsRef.value;
			let result = [];
			satpWords.forEach(({rotation}, key) => {
				let {
					fontFamily,
					fontStyle,
					fontVariant,
					fontWeight,
					text,
					weight,
					word,
				} = cpnyWords.get(key);
				let {
					fontSize,
					left,
					top,
				} = eicpWords.get(key);
				let color = btciWords.get(key);
				let font = toCSSFont(
					fontFamily,
					fontSize,
					fontStyle,
					fontVariant,
					fontWeight,
				);
				result.push({
					word,
					key,
					text,
					weight,
					font,
					left,
					top,
					rotation,
					color,
				});
			});
			return result;
		});
		return (() => {
			let words = cloudWordsRef.value;
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
					words.map(({
						color,
						font,
						key,
						left,
						rotation,
						text,
						top,
						weight,
						word,
					}) => {
						return h(
							'div',
							{
								key,
								style: {
									color: color,
									font: font,
									left: `${left}px`,
									position: 'absolute',
									top: `${top}px`,
									transform: `rotate(${rotation}rad)`,
									transformOrigin: 'center',
									whiteSpace: 'nowrap',
								},
							},
							genWord({
								text,
								weight,
								word,
							}),
						);
					}),
				)],
			);
		});
	},
});
