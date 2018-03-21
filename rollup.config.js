import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve';
import stringify from 'rollup-plugin-stringify';
import uglify from 'rollup-plugin-uglify';

import pkg from './package.json';

export default {
	input: 'src/index.js',
	output: {
		file: pkg.main,
		format: 'umd',
		name: 'VueWordCloud',
	},
	plugins: [
		stringify(),
		nodeResolve(),
		buble({
			objectAssign: 'Object.assign',
		}),
		uglify({
			mangle: {
				properties: {
					regex: /^ǂ/,
				},
			},
		}),
	],
};
