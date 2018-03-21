import VueAsyncComputed from 'x.vue/src/mixins/AsyncComputed';
import VueScheduled from 'x.vue/src/mixins/Scheduled';

import props from './props';
import data from './data';
import asyncComputed from './asyncComputed';
import watch from './watch';
import scheduled from './scheduled';
import render from './render';

export default {
	name: 'VueWordCloud',
	mixins: [
		VueAsyncComputed(asyncComputed),
		VueScheduled(scheduled),
	],
	props,
	data,
	watch,
	render,
};
