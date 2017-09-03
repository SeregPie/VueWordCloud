(function() {

	try {
		console.log('--- 1 ---');
		{
			let sizeX = 7;
			let sizeY = 4;
			for (let x0 = 0, y0 = 0, x1 = sizeX - 1, y1 = sizeY - 1; x0 < x1 && y0 < y1; x0++, y0++, x1--, y1--) {
				for (let i = x0; i < x1; i++) {
					console.log(JSON.stringify([i, y0]));
				}
				for (let i = y0; i < y1; i++) {
					console.log(JSON.stringify([x1, i]));
				}
				for (let i = x1; i > x0; i--) {
					console.log(JSON.stringify([i, y1]));
				}
				for (let i = y1; i > y0; i--) {
					console.log(JSON.stringify([x0, i]));
				}
			}
		}
		console.log('--- 2 ---');
		{
			let sizeX = 7;
			let sizeY = 4;
			for (let x0 = 0, y0 = 0, x1 = sizeX - 1, y1 = sizeY - 1; x0 < x1 && y0 < y1; x0++, y0++, x1--, y1--) {
				for (let i = x0; i < x1; i++) {
					console.log(JSON.stringify([i, y0]));
				}
				for (let i = y0; i < y1; i++) {
					console.log(JSON.stringify([x1, i]));
				}
				for (let i = x1; i > x0; i--) {
					console.log(JSON.stringify([i, y1]));
				}
				for (let i = y1; i > y0; i--) {
					console.log(JSON.stringify([x0, i]));
				}
			}
		}
	} catch (error) {
		console.log(error);
	}

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
					[randomText(), 25],
					...Array.from({length: 8}, () => [randomText(), 7]),
					...Array.from({length: 32}, () => [randomText(), 3]),
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