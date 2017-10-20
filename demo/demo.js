(function() {

	let _sample = function(array) {
		return array[Math.floor(array.length * Math.random())];
	};

	let _sampleN = function(array, n) {
		return array[n % array.length];
	};

	let words = [
		['astronomy', 15],
		...['Hydra', 'Virgo', 'Ursa Major', 'Cetus', 'Hercules', 'Eridanus', 'Pegasus', 'Draco', 'Centaurus', 'Aquarius', 'Ophiuchus', 'Leo', 'Great Void', 'Pisces', 'Sagittarius', 'Cygnus', 'Taurus', 'Camelopardalis', 'Andromeda', 'Puppis', 'Auriga', 'Aquila'].map(text => [text, 7]),
		...['Serpens', 'Perseus', 'Cassiopeia', 'Orion', 'Cepheus', 'Lynx', 'Libra', 'Gemini', 'Cancer', 'Vela', 'Scorpius', 'Carina', 'Monoceros', 'Sculptor', 'Phoenix', 'Canes Venatici', 'Aries', 'Capricornus', 'Fornax', 'Coma Berenices', 'Canis Major', 'Pavo'].map(text => [text, 4]),
		...['Grus', 'Microscopium', 'Lupus', 'Sextans', 'Tucana', 'Indus', 'Octans', 'Lepus', 'Lyra', 'Crater', 'Columba', 'Vulpecula', 'Ursa Minor', 'Telescopium', 'Horologium', 'Pictor', 'Piscis Austrinus', 'Hydrus', 'Antlia', 'Ara', 'Leo Minor', 'Pyxis'].map(text => [text, 3]),
		...['Apus', 'Lacerta', 'Delphinus', 'Corvus', 'Canis Minor', 'Dorado', 'Corona Borealis', 'Norma', 'Mensa', 'Volans', 'Musca', 'Triangulum', 'Chamaeleon', 'Corona Australis', 'Caelum', 'Reticulum', 'Triangulum Australe', 'Scutum', 'Circinus', 'Sagitta', 'Equuleus', 'Crux'].map(text => [text, 2]),
	];

	let randomColor = function() {
		return _sample(['#EBBD58', '#4ACF71', '#10C3B8', '#7E06C4', '#22074C']);
	};

	let horizontalRotation = function() {
		return 0;
	};

	let diagonalRotation = function() {
		return 7/8;
	};

	let randomHorizontalVerticalRotation = function([text]) {
		return _sampleN([0, 3/4], text.length);
	};

	let randomHorizontalVerticalDiagonalsRotation = function([text]) {
		return _sampleN([0, 1/8, 3/4, 7/8], text.length);
	};

	let randomRotation = function() {
		return Math.random();
	};

	let supportedFontFamilies = ['Abril Fatface', 'Annie Use Your Telescope', 'Anton', 'Bahiana', 'Baloo Bhaijaan', 'Barrio', 'Finger Paint', 'Fredericka the Great', 'Gloria Hallelujah', 'Indie Flower', 'Life Savers', 'Londrina Sketch', 'Lora', 'Love Ya Like A Sister', 'Merienda', 'Nothing You Could Do', 'Pacifico', 'Quicksand', 'Righteous', 'Roboto', 'Sacramento', 'Shadows Into Light'];

	new Vue({
		el: '#demo',

		data: {
			active: true,

			wordsInput: words.map(word => word.join(' ')).join('\n'),

			randomColor,

			rotation: _sample([
				horizontalRotation,
				diagonalRotation,
				randomHorizontalVerticalRotation,
				randomHorizontalVerticalDiagonalsRotation,
				randomRotation,
			]),
			horizontalRotation,
			diagonalRotation,
			randomHorizontalVerticalRotation,
			randomHorizontalVerticalDiagonalsRotation,
			randomRotation,

			fontFamily: _sample(supportedFontFamilies),
			supportedFontFamilies,

			fontSizeRatio: 0,
			maxFontSize: 105,
			animationDuration: 5000,

			containerWidth: 0,
			containerHeight: 0,
			drawerActive: false,
		},

		mounted() {
			this.updateContainerSizeTrigger();
		},

		computed: {
			words() {
				return this.wordsInput
					.split(/[\r\n]+/)
					.map(line => /^(.+)\s+(\d+)$/.exec(line))
					.filter(matched => matched)
					.map(([, text, size]) => [text, Number.parseInt(size)]);
			},

			updateContainerSizeTrigger() {
				return function() {
					if (!this._isDestroyed) {
						setTimeout(() => {
							requestAnimationFrame(() => {
								this.updateContainerSizeTrigger();
							});
						}, 111);
						this.updateContainerSize();
					}
				};
			},

			drawerWidth() {

			},
		},

		methods: {
			onWordClick({text, color}) {
				this.$notify({
					dangerouslyUseHTMLString: true,
					message: `You clicked on the word <b style="color: ${color}">${text}</b>.`,
				});
			},

			updateContainerSize() {
				let {width, height} = this.$el.getBoundingClientRect();
				this.containerWidth = width;
				this.containerHeight = height;
			},
		},
	});

})();