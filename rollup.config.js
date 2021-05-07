import {babel} from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import serve from 'rollup-plugin-serve';
import {terser} from 'rollup-plugin-terser';

import {main} from './package.json';

let plugins = [
	nodeResolve(),
	babel({
		babelHelpers: 'bundled',
		presets: [['@babel/preset-env', {
			targets: 'defaults and not IE 11',
		}]],
	}),
	//terser(),
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
		format: 'umd',
		name: 'VueWordCloud',
		globals,
	},
};
