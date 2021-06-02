import {
	computed,
	defineComponent,
	h,
	onMounted,
	reactive,
	shallowRef,
	TransitionGroup,
	watch,
	watchEffect,
} from 'vue';

import isArray from '../utils/isArray';
import isObject from '../utils/isObject';
import isString from '../utils/isString';
import scaleNumber from '../utils/scaleNumber';
import toCSSFont from '../utils/toCSSFont';
import sleep from '../utils/sleep';
import useFFF from '../utils/qhak';
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
		emit,
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
		let cloudWords = reactive({});
		watchEffect(() => {
			console.log('watchEffect');
			let {
				fontFamily: defaultFontFamily,
				fontStyle: defaultFontStyle,
				fontVariant: defaultFontVariant,
				fontWeight: defaultFontWeight,
				words,
			} = props;
			let defaultText = '';
			let defaultWeight = 1;
			let oldKeys = new Set(Object.keys(cloudWords));
			let keys = new Set();
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
				let fontFace = {
					family: fontFamily,
					style: fontStyle,
					variant: fontVariant,
					weight: fontWeight,
				};
				let key;
				{
					let i = 0;
					do {
						key = JSON.stringify([text, fontFace, i]);
						console.log(key);
					} while (keys.has(key));
					keys.add(key);
				}
				let cloudWord = cloudWords[key];
				if (cloudWord) {
					Object.assign(cloudWord, {
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
				} else {
					cloudWords[key] = {
						color,
						fontFamily,
						fontStyle,
						fontVariant,
						fontWeight,
						rotation,
						text,
						weight,
						word,
					};
				}
			});
			oldKeys.forEach(key => {
				if (!keys.has(key)) {
					delete cloudWords[key];
				}
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
		/*watchEffect(() => {
			let words = cloudWords;
			let fontSizeRatio = fontSizeRatioRef.value;
			let minWeight = +Infinity;
			let maxWeight = -Infinity;
			words.forEach(({weight}) => {
				minWeight = Math.min(minWeight, weight);
				maxWeight = Math.max(maxWeight, weight);
			});
			let minSize = 1;
			let maxSize = (() => {
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
			words.forEach(word => {
				let {weight} = word;
				let size = scaleNumber(weight, minWeight, maxWeight, minSize, maxSize);
				Object.assign(word, {size});
			});
		});*/
		/*watchEffect(() => {
			let words = cloudWords;
			let cloudWidth = cloudWidthRef.value;
			let cloudHeight = cloudHeightRef.value;
			let ojozLeft = 0;
			let ojozRight = 0;
			let ojozTop = 0;
			let ojozBottom = 0;
			let satpWords = new Map();
			let canvas = document.createElement('canvas');
			let ctx = canvas.getContext('2d');
			words.forEach(word => {
				let {
					fontFamily,
					fontSize,
					fontStyle,
					fontVariant,
					fontWeight,
					rotation = Math.random() * Math.PI,
					text,
				} = word;
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
				Object.assign(word, {
					left,
					rotation,
					top,
				})
			});
			let satpLeft = (ojozLeft + ojozRight) / 2;
			let satpTop = (ojozTop + ojozBottom) / 2;
			let satpWidth = ojozRight - ojozLeft;
			let satpHeight = ojozBottom - ojozTop;
			words.forEach(word => {
				word.left -= satpLeft;
				word.top -= satpTop;
			});
		});
		watchEffect(() => {
			let words = cloudWords;
			words.forEach(word => {
				let {color = 'Black'} = word;
				Object.assign(word, {color});
			});
		});*/
		return (() => {
			let genWord = (() => {
				let slot = slots['word'];
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
					/*[...cloudWords.values()].map(({
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
					}),*/
				)],
			);
		});
	},
});
