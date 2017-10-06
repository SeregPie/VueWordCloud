export default function(worker) {
	return new Promise(function(resolve, reject) {
		let cleanUp;
		let messageHandler = function(event) {
			cleanUp(event);
			resolve(event.data);
		};
		let errorHandler = function(event) {
			cleanUp(event);
			reject(event);
		};
		cleanUp = function(event) {
			event.preventDefault();
			worker.removeEventListener('message', messageHandler);
			worker.removeEventListener('error', errorHandler);
		};
		worker.addEventListener('message', messageHandler);
		worker.addEventListener('error', errorHandler);
	});
}