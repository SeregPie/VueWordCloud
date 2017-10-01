/* eslint no-console: 0 */

const fs = require('fs');
const path = require('path');
const babel = require('babel-core');

let transformFile;

let build = function() {
	try {
		for (let [output, presets] of Object.entries({
			'VueWordCloud.min.js': ['minify'],
			'VueWordCloud.es2015.min.js': [
				['es2015', {'modules': false}],
				'minify',
			],
		})) {
			let code = transformFile(path.join(__dirname, 'VueWordCloud.js'), {presets});
			code = code.replace('\'./workers/boundWord.js\'', () => {
				let code = transformFile(path.join(__dirname, './workers/boundWord.js'), {presets});
				return JSON.stringify(code);
			});
			fs.writeFileSync(path.join(__dirname, output), code);
		}
		console.log('build complete');
	} catch (error) {
		console.log('build failed');
	}
};

let watchedFiles = new Set();
transformFile = function(file, options) {
	if (!watchedFiles.has(file)) {
		watchedFiles.add(file);
		fs.watchFile(file, build);
	}
	let {code} = babel.transformFileSync(file, options);
	return code;
};

build();