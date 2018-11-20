(function() {

	var svgNS = 'http://www.w3.org/2000/svg';
	var animationDurationValues = [0, 1000, 5000, 10000];
	var animationEasingValues = [
		'ease',
		'linear',
		'ease-in',
		'ease-out',
		'ease-in-out',
		'cubic-bezier(0.1,0.7,1.0,0.1)',
	];
	var animationItems = [
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
	var animationOverlapValues = [0, 1/5, 1/2, 1];
	var colorItems = [
		['#d99cd1', '#c99cd1', '#b99cd1', '#a99cd1'],
		['#403030', '#f97a7a'],
		['#31a50d', '#d1b022', '#74482a'],
		['#ffd077', '#3bc4c7', '#3a9eea', '#ff4e69', '#461e47'],
	];
	var fontFamilyValues = [
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
	var fontSizeRatioValues = [0, 1/20, 1/5, 1/2, 1];
	var rotationItems = [
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
						path.setAttribute('transform', 'rotate(315 6 6)');
						return path;
					})());
					return svg;
				})());
				return URL.createObjectURL(new Blob([div.innerHTML]));
			})(),
		},
		{
			value: function(word) {
				var chance = new Chance(word[0]);
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
						path.setAttribute('transform', 'rotate(90 6 6)');
						return path;
					})());
					return svg;
				})());
				return URL.createObjectURL(new Blob([div.innerHTML]));
			})(),
		},
		{
			value: function(word) {
				var chance = new Chance(word[0]);
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
						path.setAttribute('transform', 'rotate(45 6 6)');
						return path;
					})());
					svg.appendChild((function() {
						var path = document.createElementNS(svgNS, 'path');
						path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
						path.setAttribute('transform', 'rotate(90 6 6)');
						return path;
					})());
					svg.appendChild((function() {
						var path = document.createElementNS(svgNS, 'path');
						path.setAttribute('d', 'M0 7 L0 5 L12 5 L12 7 Z');
						path.setAttribute('transform', 'rotate(315 6 6)');
						return path;
					})());
					return svg;
				})());
				return URL.createObjectURL(new Blob([div.innerHTML]));
			})(),
		},
		{
			value: function(word) {
				var chance = new Chance(word[0]);
				return chance.random();
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
	];
	var spacingValues = [0, 1/4, 1/2, 1, 2];
	var generateWordsText = function() {
		return [
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
	};

	new Vue({
		el: '#app',

		data: function() {
			return {
				animationDurationIndex: 2,
				animationDurationValues: animationDurationValues,
				animationEasing: chance.pickone(animationEasingValues),
				animationEasingValues: animationEasingValues,
				animationItem: chance.pickone(animationItems),
				animationItems: animationItems,
				animationOverlapIndex: 1,
				animationOverlapValues: animationOverlapValues,
				colorIndex: chance.integer({min: 0, max: colorItems.length - 1}),
				colorItems: colorItems,
				drawer: true,
				fontFamily: chance.pickone(fontFamilyValues),
				fontFamilyValues: fontFamilyValues,
				fontSizeRatioIndex: 0,
				fontSizeRatioValues: fontSizeRatioValues,
				progress: undefined,
				progressVisible: true,
				rotationIndex: chance.integer({min: 0, max: rotationItems.length - 1}),
				rotationItems: rotationItems,
				snackbarText: '',
				snackbarVisible: false,
				spacingIndex: 1,
				spacingValues: spacingValues,
				wordsText: generateWordsText(),
			};
		},

		computed: {
			animation: function() {
				return this.animationItem.value;
			},

			animationDuration: function() {
				return this.animationDurationValues[this.animationDurationIndex];
			},

			animationOverlap: function() {
				return this.animationOverlapValues[this.animationOverlapIndex];
			},

			color: function() {
				var colors = this.colorItem;
				return function() {
					return chance.pickone(colors);
				};
			},

			colorItem: function() {
				return this.colorItems[this.colorIndex];
			},

			enterAnimation: function() {
				return ['animated', this.animation[0]].join(' ');
			},

			fontSizeRatio: function() {
				return this.fontSizeRatioValues[this.fontSizeRatioIndex];
			},

			leaveAnimation: function() {
				return ['animated', this.animation[1]].join(' ');
			},

			rotation: function() {
				return this.rotationItem.value;
			},

			rotationItem: function() {
				return this.rotationItems[this.rotationIndex];
			},

			spacing: function() {
				return this.spacingValues[this.spacingIndex];
			},

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
		},

		watch: {
			progress: function(currentProgress, previousProgress) {
				if (previousProgress) {
					this.progressVisible = false;
				}
			},
		},

		methods: {
			loadFont: function(fontFamily, fontStyle, fontWeight, text) {
				return (new FontFaceObserver(fontFamily, {style: fontStyle, weight: fontWeight})).load(text);
			},

			onWordClick: function(word) {
				this.snackbarVisible = true;
				this.snackbarText = word[0];
			},

			regenerateWordsText: function() {
				this.wordsText = generateWordsText();
			},
		},
	});

})();
