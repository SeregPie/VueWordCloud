(function() {

	new Vue({
		el: '#App',

		data: function() {
			return {
				input: {
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
						values: [0, 1/20, 1/5, 1/2, 1],
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

					animationOverlap: {
						values: [0, 1/5, 1/2, 1],
						valueIndex: 1,
					},

					animationEasing: (function() {
						var values = [
							'ease',
							'linear',
							'ease-in',
							'ease-out',
							'ease-in-out',
							'cubic-bezier(0.1, 0.7, 1.0, 0.1)',
						];
						return {
							values: values,
							value: chance.pickone(values),
						};
					})(),
				},

				showProgress: true,
				progress: undefined,

				drawer: true,
			};
		},

		computed: {
			words: function() {
				var value = this.input.words.value;

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
				var value = this.input.rotation.value;

				return value;
			},

			fontFamily: function() {
				var value = this.input.fontFamily.value;

				return value;
			},

			color: function() {
				var colors = this.input.color.value;

				return function() {
					return chance.pickone(colors);
				};
			},

			spacing: function() {
				var values = this.input.spacing.values;
				var valueIndex = this.input.spacing.valueIndex;
				var value = values[valueIndex];

				return value;
			},

			fontSizeRatio: function() {
				var values = this.input.fontSizeRatio.values;
				var valueIndex = this.input.fontSizeRatio.valueIndex;
				var value = values[valueIndex];

				return value;
			},

			maxFontSize: function() {
				var values = this.input.maxFontSize.values;
				var valueIndex = this.input.maxFontSize.valueIndex;
				var value = values[valueIndex];

				return value;
			},

			animationDuration: function() {
				var values = this.input.animationDuration.values;
				var valueIndex = this.input.animationDuration.valueIndex;
				var value = values[valueIndex];

				return value * 1000;
			},

			animationOverlap: function() {
				var values = this.input.animationOverlap.values;
				var valueIndex = this.input.animationOverlap.valueIndex;
				var value = values[valueIndex];

				return value;
			},

			animationEasing: function() {
				var value = this.input.animationEasing.value;

				return value;
			},

			progressedWordCloudStyle: function() {
				return {
					pointerEvents: 'none',
					opacity:  0.3,
					transform: 'scale(0.7, 0.7)',
					filter: 'blur(8px)',
				};
			},
		},

		watch: {
			progress: function(newProgress, oldProgress) {
				if (oldProgress) {
					this.showProgress = false;
				}
			},
		},

		created: function() {
			this.generateFormWordsValue();
		},

		methods: {
			generateFormWordsValue: function() {
				this.input.words.value = [
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

			loadFont: function(fontFamily, fontStyle, fontWeight, text) {
				return (new FontFaceObserver(fontFamily, {
					style: fontStyle,
					weight: fontWeight,
				})).load(text);
			},
		},
	});

})();
