(function() {

	var svgNS = 'http://www.w3.org/2000/svg';

	new Vue({
		el: '#app',

		data: function() {
			return {
				drawer: true,
				progressVisible: true,
				progress: undefined,
				snackbarVisible: false,
				snackbarText: '',
				wordsText: undefined,
				rotationItemIndex: undefined,
				rotationItems: [
					{
						value: 0,
						svg: (function() {
							var div = document.createElement('div');
							div.appendChild((function() {
								var svg = document.createElementNS(svgNS, 'svg');
								svg.setAttribute('viewBox', '0 0 12 12');
								svg.appendChild((function() {
									var path = document.createElementNS(svgNS, 'path');
									path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
									return path;
								})());
								return svg;
							})());
							return URL.createObjectURL(new Blob([div.innerHTML]));
						})(),
					},
					{
						value: 7/8,
						svg: (function() {
							var div = document.createElement('div');
							div.appendChild((function() {
								var svg = document.createElementNS(svgNS, 'svg');
								svg.setAttribute('viewBox', '0 0 12 12');
								svg.appendChild((function() {
									var path = document.createElementNS(svgNS, 'path');
									path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
									path.setAttribute('transform-origin', 'center center');
									path.setAttribute('transform', 'rotate(315)');
									return path;
								})());
								return svg;
							})());
							return URL.createObjectURL(new Blob([div.innerHTML]));
						})(),
					},
					{
						value: function() {
							return chance.pickone([0, 3/4]);
						},
						svg: (function() {
							var div = document.createElement('div');
							div.appendChild((function() {
								var svg = document.createElementNS(svgNS, 'svg');
								svg.setAttribute('viewBox', '0 0 12 12');
								svg.appendChild((function() {
									var path = document.createElementNS(svgNS, 'path');
									path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
									return path;
								})());
								svg.appendChild((function() {
									var path = document.createElementNS(svgNS, 'path');
									path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
									path.setAttribute('transform-origin', 'center center');
									path.setAttribute('transform', 'rotate(90)');
									return path;
								})());
								return svg;
							})());
							return URL.createObjectURL(new Blob([div.innerHTML]));
						})(),
					},
					{
						value: function() {
							return chance.pickone([0, 1/8, 3/4, 7/8]);
						},
						svg: (function() {
							var div = document.createElement('div');
							div.appendChild((function() {
								var svg = document.createElementNS(svgNS, 'svg');
								svg.setAttribute('viewBox', '0 0 12 12');
								svg.appendChild((function() {
									var path = document.createElementNS(svgNS, 'path');
									path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
									return path;
								})());
								svg.appendChild((function() {
									var path = document.createElementNS(svgNS, 'path');
									path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
									path.setAttribute('transform-origin', 'center center');
									path.setAttribute('transform', 'rotate(45)');
									return path;
								})());
								svg.appendChild((function() {
									var path = document.createElementNS(svgNS, 'path');
									path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
									path.setAttribute('transform-origin', 'center center');
									path.setAttribute('transform', 'rotate(90)');
									return path;
								})());
								svg.appendChild((function() {
									var path = document.createElementNS(svgNS, 'path');
									path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
									path.setAttribute('transform-origin', 'center center');
									path.setAttribute('transform', 'rotate(315)');
									return path;
								})());
								return svg;
							})());
							return URL.createObjectURL(new Blob([div.innerHTML]));
						})(),
					},
					{
						value: function() {
							return Math.random();
						},
						svg: (function() {
							var div = document.createElement('div');
							div.appendChild((function() {
								var svg = document.createElementNS(svgNS, 'svg');
								svg.setAttribute('viewBox', '0 0 2 2');
								svg.appendChild((function() {
									var circle = document.createElementNS(svgNS, 'circle');
									circle.setAttribute('cx', 1);
									circle.setAttribute('cy', 1);
									circle.setAttribute('r', 1);
									return circle;
								})());
								return svg;
							})());
							return URL.createObjectURL(new Blob([div.innerHTML]));
						})(),
					}
				],
				fontFamily: undefined,
				fontFamilyValues: [
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
				],
				colorItemIndex: undefined,
				colorItems: [
					['#d99cd1', '#c99cd1', '#b99cd1', '#a99cd1'],
					['#403030', '#f97a7a'],
					['#31a50d', '#d1b022', '#74482a'],
					['#ffd077', '#3bc4c7', '#3a9eea', '#ff4e69', '#461e47'],
				],
				spacingValueIndex: 1,
				spacingValues: [0, 1/4, 1/2, 1, 2],
				fontSizeRatioValueIndex: 0,
				fontSizeRatioValues: [0, 1/20, 1/5, 1/2, 1],
				animation: undefined,
				animationItems: [
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
				],
				animationDurationValueIndex: 2,
				animationDurationValues: [0, 1000, 5000, 10000],
				animationOverlapValueIndex: 1,
				animationOverlapValues: [0, 1/5, 1/2, 1],
				animationEasing: undefined,
				animationEasingValues: [
					'ease',
					'linear',
					'ease-in',
					'ease-out',
					'ease-in-out',
					'cubic-bezier(0.1, 0.7, 1.0, 0.1)',
				],
			};
		},

		computed: {
			words: function() {
				return this.wordsText
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
				var item = this.rotationItems[this.rotationItemIndex];
				return item.value;
			},

			color: function() {
				var colors = this.colorItems[this.colorItemIndex];
				return function() {
					return chance.pickone(colors);
				};
			},

			spacing: function() {
				return this.spacingValues[this.spacingValueIndex];
			},

			fontSizeRatio: function() {
				return this.fontSizeRatioValues[this.fontSizeRatioValueIndex];
			},

			enterAnimation: function() {
				return ['animated', this.animation[0]].join(' ');
			},

			leaveAnimation: function() {
				return ['animated', this.animation[1]].join(' ');
			},

			animationDuration: function() {
				return this.animationDurationValues[this.animationDurationValueIndex];
			},

			animationOverlap: function() {
				return this.animationOverlapValues[this.animationOverlapValueIndex];
			},
		},

		watch: {
			progress: function(currentProgress, previousProgress) {
				if (previousProgress) {
					this.progressVisible = false;
				}
			},
		},

		created: function() {
			this.generateWordsText();
			this.rotationItemIndex = chance.integer({min: 0, max: this.rotationItems.length - 1});
			this.fontFamily = chance.pickone(this.fontFamilyValues);
			this.colorItemIndex = chance.integer({min: 0, max: this.colorItems.length - 1});
			this.animation = chance.pickone(this.animationItems).value;
			this.animationEasing = chance.pickone(this.animationEasingValues);
		},

		methods: {
			generateWordsText: function() {
				this.wordsText = [
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
						chance.n(function() {
							var word = chance.word();
							returns.push(word+' '+weight);
						}, count);
						return returns;
					}, [])
					.join('\n');
			},

			loadFont: function(fontFamily, fontStyle, fontWeight, text) {
				return (new FontFaceObserver(fontFamily, {style: fontStyle, weight: fontWeight})).load(text);
			},

			onWordClick: function(word) {
				this.snackbarVisible = true;
				this.snackbarText = word[0];
			},
		},
	});

})();
