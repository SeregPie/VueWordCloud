import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';

export default {
	input: 'src/VueWordCloud.js',
	output: {
		file: 'VueWordCloud.js',
		format: 'umd',
		name: 'VueWordCloud',
	},
	plugins: [
		buble(),
		uglify(),
	],
};