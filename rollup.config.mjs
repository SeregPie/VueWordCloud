import {rollup} from 'rollup';
import serve from 'rollup-plugin-serve';

import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

import pkg from './package.json' assert { type: 'json' };

let stringify = function({
    importeePrefix = 'stringify!',
    plugins = [],
} = {}) {
	let ids = new Set();
	return {
		name: 'stringify',
		async resolveId(importee, importer) {
			if (importee.startsWith(importeePrefix)) {
				importee = importee.slice(importeePrefix.length);
				let {id} = await this.resolve(importee, importer);
				ids.add(id);
				return id;
			}
			return null;
		},
		async load(id) {
			if (ids.has(id)) {
				let bundle = await rollup({
					input: id,
					plugins,
				});
				let {output} = await bundle.generate({format: 'iife'});
				let [{code}] = output;
				return `export default ${JSON.stringify(code)}`;
			}
			return null;
		},
	};
};

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
	external: Object.keys(Object.assign(pkg.dependencies, pkg.peerDependencies)),
	input: 'src/index.js',
	plugins: plugins,
	output: {
		file: pkg.main,
		format: 'umd',
		name: 'VueWordCloud',
		globals,
	},
};
