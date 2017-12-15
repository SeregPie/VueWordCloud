import Promise_wrap from '../helpers/Promise/wrap';
import Worker_getMessage from '../helpers/Worker/getMessage';

import getBoundedWordsWorkerContent from 'objectURL!./getBoundedWordsWorkerContent.js';

export default function(context, words, fontSizePower, containerWidth, containerHeight) {
	return Promise_wrap(() => {
		let getBoundedWordsWorker = new Worker(getBoundedWordsWorkerContent);
		let terminateWorker = function() {
			getBoundedWordsWorker.terminate();
		};
		context.onInterrupt(terminateWorker);
		getBoundedWordsWorker.postMessage({
			words,
			fontSizePower,
			containerWidth,
			containerHeight,
		});
		let returns = Worker_getMessage(getBoundedWordsWorker);
		returns.then(terminateWorker, terminateWorker);
		return returns;
	});
}