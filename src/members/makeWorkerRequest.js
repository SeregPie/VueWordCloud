import Promise_wrap from '../helpers/Promise/wrap';
import Worker_getMessage from '../helpers/Worker/getMessage';

export default function(context, workerContent, data) {
	return Promise_wrap(() => {
		let worker = new Worker(workerContent);
		let terminateWorker = function() {
			worker.terminate();
		};
		context.onInterrupt(terminateWorker);
		worker.postMessage(data);
		let returns = Worker_getMessage(worker);
		returns.then(terminateWorker, terminateWorker);
		return returns;
	});
}