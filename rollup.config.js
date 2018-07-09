import {uglify} from 'rollup-plugin-uglify';
import buble from 'rollup-plugin-buble';
import path from 'path';
import resolve from '@seregpie/rollup-plugin-resolve';
import stringify from 'rollup-plugin-stringify';

import {main} from './package.json';

export default {
	input: 'src/index.js',
	output: {
		file: main,
		format: 'umd',
		name: path.basename(main, path.extname(main)),
	},
	plugins: [
		stringify(),
		resolve(),
		buble({objectAssign: 'Object.assign'}),
		uglify({mangle: {properties: {regex: /^ǂ/}}}),
	],
};
