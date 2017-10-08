import path from 'path';
import rollup from 'rollup';

const createObjectURL = (function() {
	let importeePrefix = 'objectURL!';

	return function() {
		let plugins;
		let ids = new Set();

		let instance = {
			options(options) {
				plugins = options.plugins.slice();
				plugins.splice(plugins.indexOf(instance), 1);
			},

			resolveId(importee, importer) {
				if (importee.startsWith(importeePrefix)) {
					importee = importee.slice(importeePrefix.length);
					let id = path.resolve(path.dirname(importer), importee);
					ids.add(id);
					return id;
				}
			},

			async load(id) {
				if (ids.has(id)) {
					let bundle = await rollup.rollup({input: id, plugins});
					let {code} = await bundle.generate({format: 'iife'});
					code = JSON.stringify(code);
					return `export default URL.createObjectURL(new Blob([${code}]))`;
				}
			},
		};
		return instance;
	};
})();

export default {
	input: 'src/VueWordCloud.js',
	external: ['vue'],
	output: {
		file: 'VueWordCloud.js',
		format: 'umd',
		name: 'VueWordCloud',
		globals: {
			'vue': 'Vue',
		},
	},
	plugins: [
		createObjectURL(),
	],
};