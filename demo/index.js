(function() {

	new Vue({
		el: '#App',

		data: function() {
			return {
				active: true,

				form: {
					words: {
						value: '',
					},

					fontFamily: (function() {
						var possibleValues = [
							'Abril Fatface',
							'Annie Use Your Telescope',
							'Anton',
							'Bahiana',
							'Baloo Bhaijaan',
							'Barrio',
							'Finger Paint',
							'Fredericka the Great',
							'Gloria Hallelujah',
							'Indie Flower',
							'Life Savers',
							'Londrina Sketch',
							'Lora',
							'Love Ya Like A Sister',
							'Merienda',
							'Nothing You Could Do',
							'Pacifico',
							'Quicksand',
							'Righteous',
							'Sacramento',
							'Shadows Into Light',
						];
						return {
							possibleValues: possibleValues,
							value: chance.pickone(possibleValues),
						};
					})(),

					color: (function() {
						var possibleValues = [
							['#d99cd1', '#c99cd1', '#b99cd1', '#a99cd1'],
							['#403030', '#f97a7a'],
							['#31a50d', '#d1b022', '#74482a'],
							['#ffd077', '#3bc4c7', '#3a9eea', '#ff4e69', '#461e47'],
						];
						return {
							possibleValues: possibleValues,
							value: chance.pickone(possibleValues),
						};
					})(),

					rotation: (function() {
						var possibleItems = [
							{
								value: function() {
									return 0;
								},
								text: '0',
							},
							{
								value: function() {
									return 7/8;
								},
								text: '315',
							},
							{
								value: (function() {
									var possibleValues = [0, 3/4];
									return function(word) {
										var text = word[0];
										return possibleValues[text.length % possibleValues.length];
									};
								})(),
								text: '0|270',
							},
							{
								value: (function() {
									var possibleValues = [0, 1/8, 3/4, 7/8];
									return function(word) {
										var text = word[0];
										return possibleValues[text.length % possibleValues.length];
									};
								})(),
								text: '0|45|270|315',
							},
							{
								value: function() {
									return Math.random();
								},
								icon: 'shuffle',
							},
						];
						return {
							possibleItems: possibleItems,
							value: chance.pickone(possibleItems).value,
						};
					})(),

					animationDuration: {
						possibleValues: [0, 1, 2, 3, 4, 5, 10],
						value: 3,
					},

					fontSizeRatio: {
						possibleValues: [0, 1, 2, 3, 4, 5, 10, 20, 30],
						value: 0,
					},

					maxFontSize: (function() {
						var min = 10;
						return {
							value: 0,
							min: min,
							max: 100 + min,
							step: 10,
						};
					})(),
				},

				drawer: true,
			};
		},

		computed: {
			words: function() {
				return this.form.words.value
					.split(/[\r\n]+/)
					.map(function(line) {
						return /^(.+)\s+(-?\d+)$/.exec(line);
					})
					.filter(function(matched) {
						return matched;
					})
					.map(function(matched) {
						var text = matched[1];
						var size = Number.parseInt(matched[2]);
						return [text, size];
					});
			},

			fontFamily: function() {
				return this.form.fontFamily.value;
			},

			color: function() {
				var possibleValues = this.form.color.value;
				return function(word) {
					var text = word[0];
					return possibleValues[text.length % possibleValues.length];
				};
			},

			rotation: function() {
				return this.form.rotation.value;
			},

			animationDuration: function() {
				var possibleValues = this.form.animationDuration.possibleValues;
				var valueIndex = this.form.animationDuration.value;
				var value = possibleValues[valueIndex];

				return value * 1000;
			},

			fontSizeRatio: function() {
				var possibleValues = this.form.fontSizeRatio.possibleValues;
				var valueIndex = this.form.fontSizeRatio.value;
				var value = possibleValues[valueIndex];

				return value;
			},

			maxFontSize: function() {
				var value = this.form.maxFontSize.value;
				var min = this.form.maxFontSize.min;
				var max = this.form.maxFontSize.max;

				return (value > min) ? min + max - value : Infinity;
			},
		},

		created: function() {
			this.randomizeText();
		},

		methods: {
			randomizeText: function() {
				this.form.words.value = [
					[9, 1, 3],
					[4, 5, 15],
					[2, 5, 15],
					[1, 25, 100],
				]
					.reduce(function(returns, item) {
						var weigh = item[0];
						var min = item[1];
						var max = item[2];
						chance.n(chance.word, chance.integer({min: min, max: max}))
							.forEach(function(word) {
								returns.push(word + ' ' + weigh);
							});
						return returns;
					}, [])
					.join('\n');
			},
		},
	});

})();
