export default class {
	constructor() {
		this._values = [];
		/*
		this._promise = undefined;
		this._resolvePromise = undefined;
		*/
	}

	enqueue(value) {
		this._values.push(value);
		if (this._promise) {
			this._resolvePromise();
		}
	}

	async dequeue() {
		for (;;) {
			if (this._values.length) {
				return this._values.shift();
			}
			if (!this._promise) {
				this._promise = new Promise(resolve => {
					this._resolvePromise = resolve;
				});
			}
			await this._promise;
			this._promise = undefined;
		}
	}
}