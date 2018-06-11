(function() {

	var svgNS = 'http://www.w3.org/2000/svg';

	new Vue({
		el: '#App',

		data: function() {
			return {
				input: {
					words: {
						value: '',
					},

					rotation: (function() {

						var items = [
							{
								value: 0,
								svgContent: (function() {
									var path = document.createElementNS(svgNS, 'path');
									path.setAttribute('d', 'M0 14 L0 10 L24 10 L24 14 Z');
									return path.outerHTML;
								})(),
							},
							{
								value: 7/8,
								svgContent: (function() {
									var path = document.createElementNS(svgNS, 'path');
									path.setAttribute('d', 'M0 14 L0 10 L24 10 L24 14 Z');
									path.setAttribute('transform-origin', 'center center');
									path.setAttribute('transform', 'rotate(315)');
									return path.outerHTML;
								})(),
							},
							{
								value: function() {
									return chance.pickone([0, 3/4]);
								},
								svgContent: (function() {
									return [
										(function() {
											var path = document.createElementNS(svgNS, 'path');
											path.setAttribute('d', 'M0 14 L0 10 L24 10 L24 14 Z');
											return path.outerHTML;
										})(),
										(function() {
											var path = document.createElementNS(svgNS, 'path');
											path.setAttribute('d', 'M0 14 L0 10 L24 10 L24 14 Z');
											path.setAttribute('transform-origin', 'center center');
											path.setAttribute('transform', 'rotate(90)');
											return path.outerHTML;
										})(),
									].join('');
								})(),
							},
							{
								value: function() {
									return chance.pickone([0, 1/8, 3/4, 7/8]);
								},
								svgContent: (function() {
									return [
										(function() {
											var path = document.createElementNS(svgNS, 'path');
											path.setAttribute('d', 'M0 14 L0 10 L24 10 L24 14 Z');
											return path.outerHTML;
										})(),
										(function() {
											var path = document.createElementNS(svgNS, 'path');
											path.setAttribute('d', 'M0 14 L0 10 L24 10 L24 14 Z');
											path.setAttribute('transform-origin', 'center center');
											path.setAttribute('transform', 'rotate(45)');
											return path.outerHTML;
										})(),
										(function() {
											var path = document.createElementNS(svgNS, 'path');
											path.setAttribute('d', 'M0 14 L0 10 L24 10 L24 14 Z');
											path.setAttribute('transform-origin', 'center center');
											path.setAttribute('transform', 'rotate(90)');
											return path.outerHTML;
										})(),
										(function() {
											var path = document.createElementNS(svgNS, 'path');
											path.setAttribute('d', 'M0 14 L0 10 L24 10 L24 14 Z');
											path.setAttribute('transform-origin', 'center center');
											path.setAttribute('transform', 'rotate(315)');
											return path.outerHTML;
										})(),
									].join('');
								})(),
							},
							{
								value: function() {
									return Math.random();
								},
								svgContent: (function() {
									var circle = document.createElementNS(svgNS, 'circle');
									circle.setAttribute('cx', 12);
									circle.setAttribute('cy', 12);
									circle.setAttribute('r', 12);
									return circle.outerHTML;
								})(),
							},
						];
						return {
							items: items,
							value: chance.pickone(items).value,
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

					animation: (function() {
						var items = [
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
						return {
							items: items,
							value: chance.pickone(items).value,
						};
					})(),

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
				snackbar: {
					value: false,
					text: '',
				},
			};
		},

		computed: {
			words: function() {
				var input = this.input;

				var value = input.words.value;
				var words = value
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
				return words;
			},

			rotation: function() {
				var input = this.input;

				var rotation = input.rotation.value;
				return rotation;
			},

			fontFamily: function() {
				var input = this.input;

				var fontFamily = input.fontFamily.value;
				return fontFamily;
			},

			color: function() {
				var input = this.input;

				var colors = input.color.value;
				var color = function() {
					return chance.pickone(colors);
				};
				return color;
			},

			spacing: function() {
				var input = this.input;

				var values = input.spacing.values;
				var valueIndex = input.spacing.valueIndex;
				var spacing = values[valueIndex];
				return spacing;
			},

			fontSizeRatio: function() {
				var input = this.input;

				var values = input.fontSizeRatio.values;
				var valueIndex = input.fontSizeRatio.valueIndex;
				var fontSizeRatio = values[valueIndex];
				return fontSizeRatio;
			},

			maxFontSize: function() {
				var input = this.input;

				var values = input.maxFontSize.values;
				var valueIndex = input.maxFontSize.valueIndex;
				var maxFontSize = values[valueIndex];
				return maxFontSize;
			},

			enterAnimation: function() {
				var input = this.input;

				var value = input.animation.value[0];
				var animation = ['animated', value].join(' ');
				return animation;
			},

			leaveAnimation: function() {
				var input = this.input;

				var value = input.animation.value[1];
				var animation = ['animated', value].join(' ');
				return animation;
			},

			animationDuration: function() {
				var input = this.input;

				var values = input.animationDuration.values;
				var valueIndex = input.animationDuration.valueIndex;
				var value = values[valueIndex];
				var duation = value * 1000;
				return duation;
			},

			animationOverlap: function() {
				var input = this.input;

				var values = input.animationOverlap.values;
				var valueIndex = input.animationOverlap.valueIndex;
				var overlap = values[valueIndex];
				return overlap;
			},

			animationEasing: function() {
				var input = this.input;

				var easing = input.animationEasing.value;
				return easing;
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
			progress: function(currentProgress, previousProgress) {
				if (previousProgress) {
					this.showProgress = false;
				}
			},
		},

		created: function() {
			this.generateFormWordsValue();
		},

		methods: {
			generateFormWordsValue: function() {
				var value = [
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
				this.input.words.value = value;
			},

			loadFont: function(fontFamily, fontStyle, fontWeight, text) {
				return (new FontFaceObserver(fontFamily, {
					style: fontStyle,
					weight: fontWeight,
				})).load(text);
			},

			onWordClick: function(word) {
				this.snackbar.value = true;
				this.snackbar.text = word.text;
			},
		},
	});

})();
