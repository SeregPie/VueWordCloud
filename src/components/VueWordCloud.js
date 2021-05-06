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

export default defineComponent({
	name: 'VueWordCloud',
	props: {
		/*ationDuration: {
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
				fontFamily,
				fontWeight,
				fontVariant,
				fontStyle,
			} = props;
			if (words) {
				return words.map(({
					text,
					weight,
				}) => ({
					text,
					weight,
					fontFamily,
					fontWeight,
					fontVariant,
					fontStyle,
				}));
			}
			return [];
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
		let timer;
		watchEffect(() => {
			let words = wordsRef.value;
			let cloudWidth = cloudWidthRef.value;
			let cloudHeight = cloudHeightRef.value;
			clearTimeout(timer);
			timer = setTimeout(() => {
				let cloudWords = words.map(({
					fontFamily,
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
						8 + Math.random() * 16,
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
				}))
				cloudWordsRef.value = cloudWords;
			}, 1);
		});
		watch(cloudWordsRef, value => {
			emit('update:cloudWords', value);
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
