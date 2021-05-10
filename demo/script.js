(() => {

	let {
		computed,
		createApp,
		proxyRefs,
		shallowRef,
	} = Vue;

	let app = createApp({
		components: {
			VueWordCloud,
		},
		setup() {
			let input = {
				animation: (() => {
					let items = [
						{
							text: 'bounce',
							value: ['bounceIn', 'bounceOut'],
						},
						{
							text: 'fade',
							value: ['fadeIn', 'fadeOut'],
						},
						{
							text: 'flipX',
							value: ['flipInX', 'flipOutX'],
						},
						{
							text: 'flipY',
							value: ['flipInY', 'flipOutY'],
						},
						{
							text: 'rotate',
							value: ['rotateIn', 'rotateOut'],
						},
						{
							text: 'zoom',
							value: ['zoomIn', 'zoomOut'],
						},
					];
					let valueRef = shallowRef(chance.pickone(items).value);
					return proxyRefs({
						items,
						value: valueRef,
					});
				})(),
				animationDuration: (() => {
					let values = [0, 1000, 5000, 10000];
					let indexRef = shallowRef(2);
					return proxyRefs({
						index: indexRef,
						max: values.length - 1,
						value: computed(() => {
							let index = indexRef.value;
							return values[index];
						}),
						values,
					});
				})(),
				animationEasing: (() => {
					let values = [
						'ease',
						'linear',
						'ease-in',
						'ease-out',
						'ease-in-out',
						'cubic-bezier(0.1,0.7,1.0,0.1)',
					];
					let valueRef = shallowRef(chance.pickone(values));
					return proxyRefs({
						value: valueRef,
						values,
					});
				})(),
				animationOverlap: (() => {
					let values = [0, 1/4, 1/2, 1];
					let indexRef = shallowRef(1);
					return proxyRefs({
						index: indexRef,
						max: values.length - 1,
						value: computed(() => {
							let index = indexRef.value;
							return values[index];
						}),
						values,
					});
				})(),
				colorStrategy: undefined,
				fontFamily: (() => {
					let values = [
						'Arizonia',
						'Berkshire Swash',
						'Cookie',
						'Great Vibes',
						'Just Another Hand',
						'Leckerli One',
						'Lobster Two',
						'Merienda One',
						'Oleo Script',
						'Pacifico',
					];
					let valueRef = shallowRef(chance.pickone(values));
					return proxyRefs({
						value: valueRef,
						values,
					});
				})(),
				fontSizeRatio: (() => {
					let values = [0, 1/16, 1/4, 1];
					let indexRef = shallowRef(0);
					return proxyRefs({
						index: indexRef,
						max: values.length - 1,
						value: computed(() => {
							let index = indexRef.value;
							return values[index];
						}),
						values,
					});
				})(),
				rotationStrategy: undefined,
				spacing: (() => {
					let values = [0, 1/4, 1/2, 1, 2];
					let indexRef = shallowRef(1);
					let valueRef = computed(() => {
						let index = indexRef.value;
						return values[index];
					});
					return proxyRefs({
						index: indexRef,
						max: values.length - 1,
						value: valueRef,
						valueFormatted: computed(() => {
							let n = valueRef.value;
							return n.toLocaleString('en', {
								style: 'percent',
							});
						}),
						values,
					});
				})(),
				words: (() => {
					let gen = (() => {
						// todo
						return (Array
							.from({length: chance.integer({min: 16, max: 256})})
							.map(() => {
								let weight = chance.weighted([9, 8, 7, 6, 5, 4, 3, 2, 1], [1, 2, 4, 8, 16, 32, 62, 128, 256]);
								let text = chance.word();
								return {text, weight};
							})
							.sort((word, otherWord) => {
								return otherWord.weight - word.weight;
							})
							.map(({text, weight}) => `${text} ${weight}`)
							.join('\n')
						);
					});
					let valueRef = shallowRef(gen());
					return proxyRefs({
						regen() {
							valueRef.value = gen();
						},
						value: valueRef,
					});
				})(),
			};
			let ui = {
				drawer: (() => {
					let visibleRef = shallowRef(true);
					let toggle = (() => {
						visibleRef.value = !visibleRef.value;
					});
					return proxyRefs({
						toggle,
						visible: visibleRef,
					});
				})(),
			};
			return {
				animationDuration: computed(() => input.animationDuration.value),
				animationEasing: computed(() => input.animationEasing.value),
				animationOverlap: computed(() => input.animationOverlap.value),
				colorStrategy: undefined,
				enterAnimation: computed(() => {
					let value = input.animation.value;
					return `animate__animated animate__${value[0]}`;
				}),
				fontFamily: computed(() => input.fontFamily.value),
				fontSizeRatio: computed(() => input.fontSizeRatio.value),
				input,
				leaveAnimation: computed(() => {
					let value = input.animation.value;
					return `animate__animated animate__${value[1]}`;
				}),
				rotationStrategy: undefined,
				spacing: computed(() => input.spacing.value),
				ui,
				words: computed(() => {
					(input.words.value
						.split(/[\r\n]+/)
						.map(line => /^(.+)\s+(-?\d+)$/.exec(line))
						.filter(v => v)
						.map(matched => {
							let text = matched[1];
							let weight = Number(matched[2]);
							return [text, weight];
						})
					);
				}),
			};
		},
	});

	app.use(Quasar);
	app.mount('#q-app');

	Quasar.iconSet.set(Quasar.iconSet.mdiV5);

})();
