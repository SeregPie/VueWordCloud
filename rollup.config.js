import path from 'path';
import rollup from 'rollup';
import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';

const createObjectURL = (function() {
	const importeePrefix = 'objectURL!';

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

let globals = {
	'vue': 'Vue',
};

export default {
	input: 'src/VueWordCloud.js',
	external: Object.keys(globals),
	output: {
		file: 'VueWordCloud.js',
		format: 'umd',
		name: 'VueWordCloud',
		globals,
	},
	plugins: [
		createObjectURL(),
		babel({
			exclude: 'node_modules/**',
			presets: [
				['env', {modules: false}],
			],
			plugins: ['transform-runtime'],
			runtimeHelpers: true,
		}),
		nodeResolve(),
		commonjs({
			include: 'node_modules/**',
		}),
		minify({comments: false}),
	],
};