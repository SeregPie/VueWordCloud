import minify from 'rollup-plugin-babel-minify';

import config from './rollup.config.js';
config.output.file = 'VueWordCloud.min.js';
config.plugins.push(
	minify({comments: false}),
);
export default config;