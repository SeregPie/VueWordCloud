import Worker_getMessage from '../helpers/Worker/getMessage';

import getBoundedWordsWorkerContent from 'objectURL!./getBoundedWordsWorkerContent.js';

export default function(context, words, fontSizePower, containerWidth, containerHeight) {
	let getBoundedWordsWorker = new Worker(getBoundedWordsWorkerContent);
	let fin = function() {
		getBoundedWordsWorker.terminate();
	};
	context.onInterrupt(fin);
	getBoundedWordsWorker.postMessage({
		words,
		fontSizePower,
		containerWidth,
		containerHeight,
	});
	let returns = Worker_getMessage(getBoundedWordsWorker);
	returns.then(fin, fin);
	return returns;
}