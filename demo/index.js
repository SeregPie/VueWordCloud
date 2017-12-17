(function() {

	var Array_sample = function(array) {
		return array[Math.floor(array.length * Math.random())];
	};

	var Array_sampleBy = function(array, n) {
		return array[n % array.length];
	};

	new Vue({
		el: '#App',

		data: function() {
			return {
				active: true,

				model: {
					words: (function() {
						var words = [['astronomy', 15]];
						[
							'Hydra', 'Virgo', 'Ursa Major', 'Cetus', 'Hercules', 'Eridanus',
							'Pegasus', 'Draco', 'Centaurus', 'Aquarius', 'Ophiuchus', 'Leo',
							'Great Void', 'Pisces', 'Sagittarius', 'Cygnus', 'Taurus', 'Camelopardalis',
							'Andromeda', 'Puppis', 'Auriga', 'Aquila',
						].forEach(function(text) {
							words.push([text, 7]);
						});
						[
							'Serpens', 'Perseus', 'Cassiopeia', 'Orion', 'Cepheus', 'Lynx',
							'Libra', 'Gemini', 'Cancer', 'Vela', 'Scorpius', 'Carina',
							'Monoceros', 'Sculptor', 'Phoenix', 'Canes Venatici', 'Aries', 'Capricornus',
							'Fornax', 'Coma Berenices', 'Canis Major', 'Pavo',
						].forEach(function(text) {
							words.push([text, 4]);
						});
						[
							'Grus', 'Microscopium', 'Lupus', 'Sextans', 'Tucana', 'Indus',
							'Octans', 'Lepus', 'Lyra', 'Crater', 'Columba', 'Vulpecula',
							'Ursa Minor', 'Telescopium', 'Horologium', 'Pictor', 'Piscis Austrinus', 'Hydrus',
							'Antlia', 'Ara', 'Leo Minor', 'Pyxis',
						].forEach(function(text) {
							words.push([text, 3]);
						});
						[
							'Apus', 'Lacerta', 'Delphinus', 'Corvus', 'Canis Minor', 'Dorado',
							'Corona Borealis', 'Norma', 'Mensa', 'Volans', 'Musca', 'Triangulum',
							'Chamaeleon', 'Corona Australis', 'Caelum', 'Reticulum', 'Triangulum Australe', 'Scutum',
							'Circinus', 'Sagitta', 'Equuleus', 'Crux',
						].forEach(function(text) {
							words.push([text, 2]);
						});
						return {
							value: words
								.map(function(word) {
									return word.join(' ');
								})
								.join('\n'),
						};
					})(),

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
							value: Array_sample(possibleValues),
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
							value: Array_sample(possibleValues),
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
								value: function(word) {
									var text = word[0];
									return Array_sampleBy([0, 3/4], text.length);
								},
								text: '0|270',
							},
							{
								value: function(word) {
									var text = word[0];
									return Array_sampleBy([0, 1/8, 3/4, 7/8], text.length);
								},
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
							value: Array_sample(possibleItems).value,
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
				return this.model.words.value
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
				return this.model.fontFamily.value;
			},

			color: function() {
				var value = this.model.color.value;

				return function(word) {
					var text = word[0];
					return Array_sampleBy(value, text.length);
				};
			},

			rotation: function() {
				return this.model.rotation.value;
			},

			animationDuration: function() {
				var possibleValues = this.model.animationDuration.possibleValues;
				var valueIndex = this.model.animationDuration.value;
				var value = possibleValues[valueIndex];

				return value * 1000;
			},

			fontSizeRatio: function() {
				var possibleValues = this.model.fontSizeRatio.possibleValues;
				var valueIndex = this.model.fontSizeRatio.value;
				var value = possibleValues[valueIndex];

				return value;
			},

			maxFontSize: function() {
				var value = this.model.maxFontSize.value;
				var min = this.model.maxFontSize.min;
				var max = this.model.maxFontSize.max;

				return (value > min) ? min + max - value : Infinity;
			},
		},
	});

})();