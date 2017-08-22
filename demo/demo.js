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
			let fontFamilyValues = [
				'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia',
				'Impact', 'Lucida Console', 'Tahoma', 'Times New Roman', 'Verdana',
				'serif', 'sans-serif', 'monospace',
			];

			let randomText = function() {
				let size = _randomInt(3, 9);
				let returns = '';
				while (size-- > 0) {
					returns += _randomValue('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
				}
				return returns;
			};

			return {
				wordsText: [
					[randomText(), 12],
					...Array.from({length: 64}, () => [randomText(), 5]),
					/*...Array.from({length: 64}, () => [randomText(), 4]),
					...Array.from({length: 64}, () => [randomText(), 3]),
					...Array.from({length: 64}, () => [randomText(), 2]),*/
				].map(v => v.join(' ')).join('\n'),
				fontFamily: fontFamilyValues[0],
				fontFamilyValues,
			};
		},

		computed: {
			words() {
				return this.wordsText
					.split(/[\r\n]+/)
					.map(v => v.split(/\s+/).filter(v => v))
					.filter(v => v.length)
					.map(([text, size]) => [text, parseInt(size)]);
			},
		},
	});

})();