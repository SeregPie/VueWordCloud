export default function(worker) {
	return new Promise(function(resolve, reject) {
		let dispose;
		let messageHandler = function(event) {
			dispose(event);
			resolve(event.data);
		};
		let errorHandler = function(event) {
			dispose(event);
			reject(event);
		};
		dispose = function(event) {
			event.preventDefault();
			worker.removeEventListener('message', messageHandler);
			worker.removeEventListener('error', errorHandler);
		};
		worker.addEventListener('message', messageHandler);
		worker.addEventListener('error', errorHandler);
	});
}
