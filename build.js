const fs = require('fs');
const path = require('path');
const babel = require('babel-core');

let compile = function() {
	console.log('compile');
	{
		let {code} = babel.transformFileSync(path.join(__dirname, 'VueWordCloud.js'), {
			'presets': ['minify'],
		});

		code = code.replace("'./workers/boundWord.js'", () => {
			let {code} = babel.transformFileSync(path.join(__dirname, './workers/boundWord.js'), {
				'presets': ['minify'],
			});
			return JSON.stringify(code);
		});

		fs.writeFileSync(path.join(__dirname, 'VueWordCloud.min.js'), code);
	}
	{
		let {code} = babel.transformFileSync(path.join(__dirname, 'VueWordCloud.js'), {
			'presets': [
				['es2015', {'modules': false}],
				//'minify',
			],
		});

		code = code.replace("'./workers/boundWord.js'", () => {
			let {code} = babel.transformFileSync(path.join(__dirname, './workers/boundWord.js'), {
				'presets': [
					['es2015', {'modules': false}],
					'minify',
				],
			});
			return JSON.stringify(code);
		});

		fs.writeFileSync(path.join(__dirname, 'VueWordCloud.es2015.min.js'), code);
	}
};

compile();

fs.watchFile(path.join(__dirname, 'VueWordCloud.js'), compile);