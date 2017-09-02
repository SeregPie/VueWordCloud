(function() {

	let _randomInt = function(start, end) {
		return Math.floor(start + (end - start) * Math.random());
	};

	let _randomValue = function(values) {
		return values[_randomInt(0, values.length)];
	};

	new Vue({
		el: '#demo',

		data() {
			let availableFontFamilyValues = [
				'Abril Fatface', 'Annie Use Your Telescope', 'Anton', 'Bahiana', 'Baloo Bhaijaan', 'Barrio', 'Fredericka the Great', 'Gloria Hallelujah', 'Indie Flower', 'Life Savers', 'Londrina Sketch', 'Lora', 'Love Ya Like A Sister', 'Merienda', 'Nothing You Could Do', 'Pacifico', 'Quicksand', 'Righteous', 'Roboto', 'Sacramento', 'Shadows Into Light',
			];

			let randomText = function() {
				let size = _randomInt(3, 9);
				let returns = '';
				while (size-- > 0) {
					returns += _randomValue('abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ');
				}
				return returns;
			};

			return {
				wordsText: [
					[randomText(), 30],
					...Array.from({length: 16}, () => [randomText(), 9]),
					...Array.from({length: 64}, () => [randomText(), 3]),
					...Array.from({length: 128}, () => [randomText(), 1]),
				].map(v => v.join(' ')).join('\n'),
				fontFamily: _randomValue(availableFontFamilyValues),
				availableFontFamilyValues,
			};
		},

		computed: {
			words() {
				return this.wordsText
					.split(/[\r\n]+/)
					.map(line => /^(.+)\s+(\d+)$/.exec(line))
					.filter(matched => matched)
					.map(([_, text, size]) => [text, parseInt(size)]);
			},
		},

		methods: {
			generateRandomColor() {
				return _randomValue(['RoyalBlue', 'OrangeRed', 'MediumOrchid']);
			},
		},
	});

})();