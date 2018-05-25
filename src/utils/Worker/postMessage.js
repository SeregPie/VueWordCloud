import Worker_getMessage from './getMessage';

export default function(worker, data) {
	worker.postMessage(data);
	return Worker_getMessage(worker);
}
