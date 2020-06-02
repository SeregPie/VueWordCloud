export default class {
	constructor(previousValue) {
		this.previousValue = previousValue;
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
			this.interrupted = true;
			this.interruptHandlers.forEach(handler => {
				try {
					handler();
				} catch (error) {
					// pass
				}
			});
		}
	}

	onInterrupt(handler) {
		if (this.interrupted) {
			if (!this.interruptHandlers.has(handler)) {
				try {
					handler();
				} catch (error) {
					// pass
				}
			}
		}
		this.interruptHandlers.add(handler);
	}
}
