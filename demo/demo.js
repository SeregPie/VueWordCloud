(function() {

	/*try {
		console.log('--- 1 ---');
		{
			let sizeX = 5;
			let sizeY = 3;
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
				console.log(x0, y0, x1, y1);
			}
		}
		console.log('--- 2 ---');
		{
			let sizeX = 5;
			let sizeY = 3;
			let stepX, stepY;
			if (sizeX > sizeY) {
				stepX = 1;
				stepY = sizeY / sizeX;
			} else
			if (sizeY > sizeX) {
				stepY = 1;
				stepX = sizeX / sizeY;
			} else {
				stepX = stepY = 1;
			}
			let x0 = Math.floor(sizeX / 2);
			let y0 = Math.floor(sizeY / 2);
			let x1 = x0;
			let y1 = y0;
			while (x0 > 0 || y0 > 0 || x1 < sizeX - 1 || y1 < sizeY - 1) {
				let x0i = Math.floor(x0);
				let y0i = Math.floor(y0);
				let x1i = Math.floor(x1);
				let y1i = Math.floor(y1);
				x0 -= stepX;
				y0 -= stepY;
				x1 += stepX;
				y1 += stepY;
				let x0ii = Math.floor(x0);
				let y0ii = Math.floor(y0);
				let x1ii = Math.floor(x1);
				let y1ii = Math.floor(y1);
				while (x0i >= x0ii) {
					for (let i = Math.floor(y0); i <= y1; i++) {
						console.log(JSON.stringify([x0i, i]));
					}
					x0i--;
				}
				if (x1 < sizeX - 1) {
					x1 += stepX;
					for (let i = Math.floor(y0); i <= y1; i++) {
						console.log(JSON.stringify([Math.floor(x1), i]));
					}
				}
				if (y1 < sizeY - 1) {
					//reverse
					y1 += stepY;
					for (let i = Math.floor(x0); i <= x1; i++) {
						console.log(JSON.stringify([i, Math.floor(y1)]));
					}
				}
				if (x0 > 0) {
					//reverse
					x0 -= stepX;
					for (let i = Math.floor(y0); i <= y1; i++) {
						console.log(JSON.stringify([Math.floor(x0), i]));
					}
				}
				if (y0 > 0) {
					y0 -= stepY;
					for (let i = Math.floor(x0); i <= x1; i++) {
						console.log(JSON.stringify([i, Math.floor(y0)]));
					}
				}
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