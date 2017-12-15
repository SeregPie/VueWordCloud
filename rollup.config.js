import buble from 'rollup-plugin-buble';
import path from 'path';
import rollup from 'rollup';
import uglify from 'rollup-plugin-uglify';

const createObjectURL = (function() {
	const importeePrefix = 'objectURL!';
	const plugins = [
		buble(),
		uglify(),
	];
	return function() {
		let inputs = new Set();
		return {
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
					code = JSON.stringify(code);
					return `export default URL.createObjectURL(new Blob([${code}]))`;
				}
			},*/

			load(input) {
				if (inputs.has(input)) {
					return Promise
						.resolve()
						.then(() => rollup.rollup({input, plugins}))
						.then(bundle => bundle.generate({format: 'iife'}))
						.then(({code}) => {
							code = JSON.stringify(code);
							return `export default URL.createObjectURL(new Blob([${code}]))`;
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
		createObjectURL(),
		buble(),
		uglify(),
	],
};