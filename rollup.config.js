import {terser} from 'rollup-plugin-terser';
import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import stringify from 'rollup-plugin-stringify';

import {main} from './package.json';

let plugins = [
	stringify({
		plugins: [
			buble(),
			terser(),
		],
	}),
	resolve(),
	buble({objectAssign: 'Object.assign'}),
	terser({mangle: {properties: {regex: /^ǂ/}}}),
];

if (process.env.ROLLUP_WATCH) {
	plugins.push(serve({
		contentBase: '',
		open: true,
	}));
}

let globals = {
	'vue': 'Vue',
};

export default {
	external: Object.keys(globals),
	input: 'src/index.js',
	plugins,
	output: {
		file: main,

		name: 'VueWordCloud',
		globals,
	},
};
