import makeWorkerRequest from './makeWorkerRequest';

import workerContent from 'objectURL!./getBoundedWordsWorkerContent.js';

export default function(context, words, fontSizePower, containerWidth, containerHeight) {
	return makeWorkerRequest(context, workerContent, {
		words,
		fontSizePower,
		containerWidth,
		containerHeight,
	});
}