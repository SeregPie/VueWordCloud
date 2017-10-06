/* eslint no-console: 0 */

const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const minify = require('rollup-plugin-babel-minify');

let createObjectURL = (function() {
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

let build = async function(plugins, output) {
	let bundle = await rollup.rollup({
		input: path.join(__dirname, 'src', 'VueWordCloud.js'),
		plugins,
		external: ['vue'],
	});
	await bundle.write({
		file: output,
		format: 'umd',
		name: 'VueWordCloud',
		globals: {
			'vue': 'Vue',
		},
	});
};

build(
	[
		createObjectURL(),
	],
	path.join(__dirname, 'VueWordCloud.js'),
);

build(
	[
		createObjectURL(),
		minify({comments: false}),
	],
	path.join(__dirname, 'VueWordCloud.min.js'),
);

build(
	[
		createObjectURL(),
		babel({
			exclude: 'node_modules/**',
			presets: [
				['env', {
					modules: false,
					targets: {
						'browsers': ['last 2 versions'],
						'edge': 13,
						'firefox': 49,
						'ie': 10,
						'safari': 9,
					},
				}],
			],
			plugins: ['transform-runtime'],
			runtimeHelpers: true,
		}),
		nodeResolve(),
		commonjs({
			include: 'node_modules/**',
		}),
	],
	path.join(__dirname, 'VueWordCloud.es5.js'),
);

build(
	[
		createObjectURL(),
		babel({
			exclude: 'node_modules/**',
			presets: [
				['env', {
					modules: false,
					targets: {
						'browsers': ['last 2 versions'],
						'edge': 13,
						'firefox': 49,
						'ie': 10,
						'safari': 9,
					},
				}],
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
	path.join(__dirname, 'VueWordCloud.es5.min.js'),
);