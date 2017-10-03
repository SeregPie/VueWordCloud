/* eslint no-console: 0 */

const fs = require('fs');
const path = require('path');
const babel = require('babel-core');

let transformFile;

let build = function() {
	try {
		for (let [output, options] of Object.entries({
			'VueWordCloud.min.js': {
				presets: ['minify'],
			},
			/*'VueWordCloud.es2015.min.js': {
				presets: [
					['env', {
						modules: false,
						targets: {
							'edge': 13,
							'firefox': 49,
							'ie': 11,
							'ios': 9,
							'safari': 9,
						},
						debug: true,
					}],
					'minify',
				],
				"plugins": ["transform-runtime"]
			},
			*/
		})) {
			let code = transformFile(path.join(__dirname, 'VueWordCloud.js'), options);
			code = code.replace('\'./workers/boundWord.js\'', () => {
				let code = transformFile(path.join(__dirname, './workers/boundWord.js'), options);
				return JSON.stringify(code);
			});
			fs.writeFileSync(path.join(__dirname, output), code);
		}
		console.log('build complete');
	} catch (error) {
		console.error('build failed', error);
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