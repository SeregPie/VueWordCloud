import VueAsyncComputed from 'x.vue/src/mixins/AsyncComputed';

import props from './props';
import data from './data';
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
	watch,
	mounted,
	methods,
	render,
};
