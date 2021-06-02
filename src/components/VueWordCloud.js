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
import qhak from '../utils/qhak';
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
			qhak(() => {
				let el = elRef.value;
				if (el) {
					cloudWidthRef.value = el.offsetWidth;
					cloudHeightRef.value = el.offsetHeight;
				}
			}, {
				immediate: true,
			});
		});
		let cloudWordsRef = shallowRef([]);
		watchEffect(async onInvalidate => {
			let controller = new AbortController();
			onInvalidate(() => {
				controller.abort();
			});
			let {signal} = controller;
			let {
				fontFamily,
				fontSizeRatio,
				fontStyle,
				fontVariant,
				fontWeight,
				rotation,
				words,
			} = props;
			let cloudWidth = cloudWidthRef.value;
			let cloudHeight = cloudHeightRef.value;
			let cloudWords = await WordCloud(words, cloudWidth, cloudHeight, {
				fontFamily,
				fontSizeRatio,
				fontStyle,
				fontVariant,
				fontWeight,
				rotation,
				signal,
			});
			cloudWordsRef.value = cloudWords;
		});
		watchEffect(() => {
			let cloudWords = cloudWordsRef.value;
			cloudWords.forEach(cloudWord => {
				let {word} = cloudWord;
				let {color = 'Black'} = WordCloud.xmax(word);
				Object.assign(cloudWord, {color});
			});
		});
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
					cloudWords.map(({
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
