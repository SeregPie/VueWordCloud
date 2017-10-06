export default class extends Error {
	constructor(...args) {
		super(...args);
		this.name = 'InterruptError';
	}
}