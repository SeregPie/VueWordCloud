import VueAsyncComputed from '/utils/Vue/AsyncComputed';

import asyncComputed from './asyncComputed';
import computed from './computed';
import data from './data';
import methods from './methods';
import mounted from './mounted';
import props from './props';
import render from './render';
import watch from './watch';

export default {
	name: 'VueWordCloud',
	mixins: [
		VueAsyncComputed(asyncComputed),
	],
	props,
	data,
	computed,
	watch,
	mounted,
	methods,
	render,
};
