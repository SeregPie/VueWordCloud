(() => {

	let {
		computed,
		createApp,
		proxyRefs,
		shallowRef,
	} = Vue;

	let app = createApp({
		components: {
			PButton: primevue.button,
			PInputText: primevue.inputtext,
			VueWordCloud,
		},
		setup() {
			let input = (() => {
				let fontFamily = (() => {
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
				})();
				let words = (() => {
					let gen = (() => {
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
						);
					});
					let valueRef = shallowRef(gen());
					let regen = (() => {
						valueRef.value = gen();
					});
					return proxyRefs({
						regen,
						value: valueRef,
					});
				})();
				return {
					fontFamily,
					words,
				};
			})();
			return {
				input,
				fontFamily: computed(() => input.fontFamily.value),
				words: computed(() => input.words.value),
			};
		},
	});

	app.mount('body');

})();
