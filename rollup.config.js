import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

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
		buble(),
		uglify(),
	],
};