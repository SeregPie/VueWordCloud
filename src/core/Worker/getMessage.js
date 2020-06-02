export default function(worker) {
	return new Promise((resolve, reject) => {
		let dispose;
		let messageHandler = function({data}) {
			dispose();
			resolve(data);
		};
		let errorHandler = function({error}) {
			dispose();
			reject(error);
		};
		dispose = function() {
			worker.removeEventListener('message', messageHandler);
			worker.removeEventListener('error', errorHandler);
		};
		worker.addEventListener('message', messageHandler);
		worker.addEventListener('error', errorHandler);
	});
}
