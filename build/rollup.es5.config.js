import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';

import config from './rollup.config.js';
config.output.file = 'VueWordCloud.es5.js';
config.plugins.push(
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
);
export default config;