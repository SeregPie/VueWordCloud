export default class {
	constructor() {
		this.interrupted = false;
		this.interruptHandlers = new Set();
	}

	throwIfInterrupted() {
		if (this.interrupted) {
			throw new Error();
		}
	}

	interrupt() {
		if (!this.interrupted) {
			this.interrupted = false;
			this.interruptHandlers.forEach(handler => {
				handler();
			});
		}
	}

	onInterrupt(handler) {
		if (this.interrupted) {
			if (!this.interruptHandlers.has(handler)) {
				handler();
			}
		}
		this.interruptHandlers.add(handler);
	}
}
