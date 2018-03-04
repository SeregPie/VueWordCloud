import VueAsyncComputed from 'x.vue/src/mixins/AsyncComputed';
import VueWatchElementSize from 'x.vue/src/mixins/WatchElementSize';

import props from './props';
import data from './data';
import asyncComputed from './asyncComputed';
import watch from './watch';
import render from './render';

export default {
	name: 'VueWordCloud',
	mixins: [
		VueAsyncComputed(asyncComputed),
		VueWatchElementSize(),
	],
	props,
	data,
	watch,
	render,
};
