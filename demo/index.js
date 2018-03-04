(function() {

	new Vue({
		el: '#App',

		data: function() {
			return {
				form: {
					words: {
						value: '',
					},

					rotation: (function() {
						var values = [
							0,
							7/8,
							function() {
								return chance.pickone([0, 3/4]);
							},
							function() {
								return chance.pickone([0, 1/8, 3/4, 7/8]);
							},
							function() {
								return Math.random();
							},
						];
						return {
							values: values,
							value: chance.pickone(values),
						};
					})(),

					fontFamily: (function() {
						var values = [
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
							values: values,
							value: chance.pickone(values),
						};
					})(),

					color: (function() {
						var values = [
							['#d99cd1', '#c99cd1', '#b99cd1', '#a99cd1'],
							['#403030', '#f97a7a'],
							['#31a50d', '#d1b022', '#74482a'],
							['#ffd077', '#3bc4c7', '#3a9eea', '#ff4e69', '#461e47'],
						];
						return {
							values: values,
							value: chance.pickone(values),
						};
					})(),

					spacing: {
						values: [0, 1/4, 1/2, 1, 2],
						valueIndex: 1,
					},

					fontSizeRatio: {
						values: [0, 1, 2, 5, 20],
						valueIndex: 0,
					},

					maxFontSize: {
						values: [Infinity, 100, 50, 10],
						valueIndex: 0,
					},

					animationDuration: {
						values: [0, 1, 5, 10],
						valueIndex: 2,
					},
				},

				progress: undefined,

				drawer: true,
			};
		},

		computed: {
			words: function() {
				var value = this.form.words.value;

				return value
					.split(/[\r\n]+/)
					.map(function(line) {
						return /^(.+)\s+(-?\d+)$/.exec(line);
					})
					.filter(function(matched) {
						return matched;
					})
					.map(function(matched) {
						var text = matched[1];
						var weight = Number.parseInt(matched[2]);
						return [text, weight];
					});
			},

			rotation: function() {
				var value = this.form.rotation.value;

				return value;
			},

			fontFamily: function() {
				var value = this.form.fontFamily.value;

				return value;
			},

			color: function() {
				var colors = this.form.color.value;

				return function() {
					return chance.pickone(colors);
				};
			},

			spacing: function() {
				var values = this.form.spacing.values;
				var valueIndex = this.form.spacing.valueIndex;
				var value = values[valueIndex];

				return value;
			},

			fontSizeRatio: function() {
				var values = this.form.fontSizeRatio.values;
				var valueIndex = this.form.fontSizeRatio.valueIndex;
				var value = values[valueIndex];

				return value;
			},

			maxFontSize: function() {
				var values = this.form.maxFontSize.values;
				var valueIndex = this.form.maxFontSize.valueIndex;
				var value = values[valueIndex];

				return value;
			},

			animationDuration: function() {
				var values = this.form.animationDuration.values;
				var valueIndex = this.form.animationDuration.valueIndex;
				var value = values[valueIndex];

				return value * 1000;
			},
		},

		created: function() {
			this.generateFormWordsValue();
		},

		methods: {
			generateFormWordsValue: function() {
				this.form.words.value = [
					[9, 1, 3],
					[4, 5, 15],
					[2, 5, 15],
					[1, 25, 150],
				]
					.reduce(function(returns, item) {
						var weight = item[0];
						var minCount = item[1];
						var maxCount = item[2];
						var count = chance.integer({min: minCount, max: maxCount});
						var words = chance.n(chance.word, count);
						words.forEach(function(word) {
							returns.push(word + ' ' + weight);
						});
						return returns;
					}, [])
					.join('\n');
			},

			loadFontFamily: function(fontFamily, fontStyle, fontWeight, text) {
				return (new FontFaceObserver(fontFamily, {
					style: fontStyle,
					weight: fontWeight,
				})).load(text);
			},
		},
	});

})();
