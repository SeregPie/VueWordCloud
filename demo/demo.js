(function() {

	/*try {
		console.log('--- 1 ---');
		for (let sizeX of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
			for (let sizeY of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
				let grid = Array(sizeX * sizeY).fill(false);
				let count = 0;
				let fillGrid = function(x, y) {
					let index = sizeX * y + x;
					if (grid[index]) {
						throw 'ERROR';
					}
					grid[index] = true;
					count++;
					//console.log(JSON.stringify([x, y]));
				};
				let x0 = 0, y0 = 0, x1 = sizeX - 1, y1 = sizeY - 1;
				for (;;) {
					if (y0 > y1) break;
					for (let i = x0; i <= x1; i++) {
						fillGrid(i, y0);
					}
					y0++;
					if (x0 > x1) break;
					for (let i = y0; i <= y1; i++) {
						fillGrid(x1, i);
					}
					x1--;
					if (y0 > y1) break;
					for (let i = x1; i >= x0; i--) {
						fillGrid(i, y1);
					}
					y1--;
					if (x0 > x1) break;
					for (let i = y1; i >= y0; i--) {
						fillGrid(x0, i);
					}
					x0++;
					//console.log(x0, y0, x1, y1);
				}
				console.log(`${sizeX} x ${sizeY}`, count === sizeX * sizeY);
			}
		}
		console.log('--- 2 ---');
		for (let sizeX of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
			for (let sizeY of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
				let grid = Array(sizeX * sizeY).fill(false);
				let count = 0;
				let fillGrid = function(x, y) {
					let index = sizeX * y + x;
					if (grid[index]) {
						throw 'ERROR';
					}
					grid[index] = true;
					count++;
					//console.log(JSON.stringify([x, y]));
				};
				let x0 = Math.floor(sizeX / 2), y0 = Math.floor(sizeY / 2), x1 = x0, y1 = y0;
				for (;;) {
					if (y1 - y0 >= sizeY) break;
					for (let i = x0; i <= x1; i++) {
						fillGrid(i, y0);
					}
					x1++;
					if (x1 - x0 >= sizeX) break;
					for (let i = y0; i <= y1; i++) {
						fillGrid(x1, i);
					}
					y1++;
					if (y1 - y0 >= sizeY) break;
					for (let i = x0; i <= x1; i++) {
						fillGrid(i, y1);
					}
					x0--;
					if (x1 - x0 >= sizeX) break;
					for (let i = y0; i <= y1; i++) {
						fillGrid(x0, i);
					}
					y0--;
					//console.log(x0, y0, x1, y1);
				}
				console.log(`${sizeX} x ${sizeY}`, count === sizeX * sizeY);
			}
		}
	} catch (error) {
		console.log(error);
	}*/

	let _randomInt = function(start, end) {
		return Math.floor(start + (end - start) * Math.random());
	};

	let _sample = function(array) {
		return array[_randomInt(0, array.length)];
	};

	let _sampleN = function(array, n) {
		return array[n % array.length];
	};



	let words = [
		['astronomy', 14],
		...['Hydra', 'Virgo', 'Ursa Major', 'Cetus', 'Hercules', 'Eridanus', 'Pegasus', 'Draco', 'Centaurus', 'Aquarius', 'Ophiuchus', 'Leo', 'Great Void', 'Pisces', 'Sagittarius', 'Cygnus', 'Taurus', 'Camelopardalis', 'Andromeda', 'Puppis', 'Auriga', 'Aquila'].map(text => [text, 7]),
		...['Serpens', 'Perseus', 'Cassiopeia', 'Orion', 'Cepheus', 'Lynx', 'Libra', 'Gemini', 'Cancer', 'Vela', 'Scorpius', 'Carina', 'Monoceros', 'Sculptor', 'Phoenix', 'Canes Venatici', 'Aries', 'Capricornus', 'Fornax', 'Coma Berenices', 'Canis Major', 'Pavo'].map(text => [text, 5]),
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

	let randomHorizontalVerticalDiagonalRotation = function([text]) {
		return _sampleN([0, 3/4, 7/8], text.length);
	};

	let randomRotation = function() {
		return Math.random();
	};

	let supportedFontFamilies = ['Abril Fatface', 'Annie Use Your Telescope', 'Anton', 'Bahiana', 'Baloo Bhaijaan', 'Barrio', 'Fredericka the Great', 'Gloria Hallelujah', 'Indie Flower', 'Life Savers', 'Londrina Sketch', 'Lora', 'Love Ya Like A Sister', 'Merienda', 'Nothing You Could Do', 'Pacifico', 'Quicksand', 'Righteous', 'Roboto', 'Sacramento', 'Shadows Into Light'];



	new Vue({
		el: '#demo',

		data: {
			wordsInput: words.map(word => word.join(' ')).join('\n'),

			randomColor,

			rotation: _sample([
				horizontalRotation,
				diagonalRotation,
				randomHorizontalVerticalRotation,
				randomHorizontalVerticalDiagonalRotation,
				randomRotation,
			]),
			horizontalRotation,
			diagonalRotation,
			randomHorizontalVerticalRotation,
			randomHorizontalVerticalDiagonalRotation,
			randomRotation,

			fontFamily: _sample(supportedFontFamilies),
			supportedFontFamilies,
		},

		computed: {
			words() {
				return this.wordsInput
					.split(/[\r\n]+/)
					.map(line => /^(.+)\s+(\d+)$/.exec(line))
					.filter(matched => matched)
					.map(([_, text, size]) => [text, parseInt(size)]);
			},
		},
	});

})();