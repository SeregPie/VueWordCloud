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
			let genWords = (() => {
				// todo
				return (Array
					.from({length: chance.integer({min: 16, max: 256})})
					.map(() => {
						let weight = chance.weighted([9, 8, 7, 6, 5, 4, 3, 2, 1], [1, 2, 4, 8, 16, 32, 62, 128, 256]);
						let text = chance.word();
						return [text, weight];
					})
					.sort((word, otherWord) => {
						return otherWord[1] - word[1];
					})
				);
			});
			let ui = (() => {
				let input = {
					animation: (() => {
						let items = [
							{
								label: 'bounce',
								value: ['bounceIn', 'bounceOut'],
							},
							{
								label: 'fade',
								value: ['fadeIn', 'fadeOut'],
							},
							{
								label: 'flipX',
								value: ['flipInX', 'flipOutX'],
							},
							{
								label: 'flipY',
								value: ['flipInY', 'flipOutY'],
							},
							{
								label: 'rotate',
								value: ['rotateIn', 'rotateOut'],
							},
							{
								label: 'zoom',
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
						let values = [0, 1, 3, 9];
						let indexRef = shallowRef(2);
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
									style: 'unit',
									unit: 'second',
								});
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
						let values = [0, 1/4, 1];
						let indexRef = shallowRef(0);
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
							return (genWords()
								.map(([text, weight]) => `${text} ${weight}`)
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
				return {
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
					input,
				};
			})();
			return {
				animationDuration: computed(() => {
					let value = ui.input.animationDuration.value;
					return value * 1000;
				}),
				animationEasing: computed(() => ui.input.animationEasing.value),
				animationOverlap: computed(() => ui.input.animationOverlap.value),
				colorStrategy: undefined,
				enterAnimation: computed(() => {
					let value = ui.input.animation.value;
					return `animate__animated animate__${value[0]}`;
				}),
				fontFamily: computed(() => ui.input.fontFamily.value),
				fontSizeRatio: computed(() => ui.input.fontSizeRatio.value),
				leaveAnimation: computed(() => {
					let value = ui.input.animation.value;
					return `animate__animated animate__${value[1]}`;
				}),
				rotationStrategy: undefined,
				spacing: computed(() => ui.input.spacing.value),
				ui,
				words: computed(() => {
					return (ui.input.words.value
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

	app.use(Quasar, {
		iconSet: Quasar.iconSet.mdiV5,
	});
	app.mount('#q-app');

})();
