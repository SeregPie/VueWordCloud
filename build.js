/* eslint no-console: 0 */

const fs = require('fs');
const path = require('path');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const minify = require('rollup-plugin-babel-minify');

let build = async function(plugins, output) {
	let id = './workers/boundWord.js';
	let workers = {
		[id]: await (async () => {
			let bundle = await rollup.rollup(Object.assign({
				input: path.join(__dirname, 'src', id),
				plugins,
			}));
			let {code} = await bundle.generate({
				format: 'iife',
			});
			return code;
		})(),
	};

	let bundle = await rollup.rollup({
		input: path.join(__dirname, 'src', 'VueWordCloud.js'),
		plugins,
		external: ['vue'],
	});
	let {code} = await bundle.generate({
		format: 'umd',
		name: 'VueWordCloud',
		globals: {
			'vue': 'Vue',
		},
	});
	for (let [workerId, workerCode] of Object.entries(workers)) {
		code = code.replace('\''+workerId+'\'', JSON.stringify(workerCode));
	}

	fs.writeFileSync(output, code);
};

build(
	[
		minify({
			comments: false,
		}),
	],
	path.join(__dirname, 'VueWordCloud.min.js'),
);

build(
	[
		babel({
			exclude: 'node_modules/**',
			presets: [
				['env', {
					modules: false,
					targets: {
						'browsers': ['last 2 versions'],
						'edge': 13,
						'firefox': 49,
						'ie': 11,
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
		minify({
			comments: false,
		}),
	],
	path.join(__dirname, 'VueWordCloud.es2015.min.js'),
);