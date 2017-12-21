import buble from 'rollup-plugin-buble';
import path from 'path';
import rollup from 'rollup';
import uglify from 'rollup-plugin-uglify';

const stringify = (function() {
	const importeePrefix = 'stringify!';
	return function() {
		let plugins;
		let inputs = new Set();
		return {
			options(options) {
				plugins = options.plugins.slice();
				plugins.splice(plugins.indexOf(this), 1);
			},

			resolveId(importee, importer) {
				if (importee.startsWith(importeePrefix)) {
					importee = importee.slice(importeePrefix.length);
					let input = path.resolve(path.dirname(importer), importee);
					inputs.add(input);
					return input;
				}
			},

			/*async load(input) {
				if (inputs.has(input)) {
					let bundle = await rollup.rollup({input, plugins});
					let {code} = await bundle.generate({format: 'iife'});
					return `export default ${JSON.stringify(code)}`;
				}
			},*/

			load(input) {
				if (inputs.has(input)) {
					return rollup.rollup({input, plugins})
						.then(bundle => bundle.generate({format: 'iife'}))
						.then(({code}) => {
							return `export default ${JSON.stringify(code)}`;
						});
				}
			},
		};
	};
})();

export default {
	input: 'src/VueWordCloud.js',
	output: {
		file: 'VueWordCloud.js',
		format: 'umd',
		name: 'VueWordCloud',
	},
	plugins: [
		stringify(),
		buble(),
		uglify(),
	],
};
