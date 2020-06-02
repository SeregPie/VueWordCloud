import VueAsyncComputed from '../core/Vue/AsyncComputed';

import props from './props';
import data from './data';
import computed from './computed';
import asyncComputed from './asyncComputed';
import watch from './watch';
import mounted from './mounted';
import methods from './methods';
import render from './render';

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
