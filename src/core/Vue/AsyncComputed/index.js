import Function_is from '../../Function/is';
import Function_noop from '../../Function/noop';

import Context from './Context';

const prefix = 'asyncComputed_';
const prefixPromise = prefix + 'promise_';
const prefixTrigger = prefix + 'trigger_';

export default function(asyncComputed) {
	let options = {
		data() {
			let returns = {};
			Object.keys(asyncComputed).forEach(key => {
				returns[prefixTrigger + key] = {};
			});
			return returns;
		},

		computed: {},

		beforeCreate() {
			let currentContexts = new Set();

			Object.entries(asyncComputed).forEach(([key, {
				get,
				default: currentValue,
				errorHandler = Function_noop,
			}]) => {
				let firstCall = true;
				let currentContext;

				this.$options.computed[key] = function() {
					this[prefixTrigger + key];
					this[prefixPromise + key];
					return currentValue;
				};

				this.$options.computed[prefixPromise + key] = function() {
					if (currentContext) {
						currentContext.interrupt();
						currentContexts.delete(currentContext);
					}
					if (firstCall) {
						firstCall = false;
						if (Function_is(currentValue)) {
							currentValue = currentValue.call(this);
						}
					}
					let context = new Context(currentValue);
					currentContext = context;
					currentContexts.add(currentContext);
					new Promise(resolve => {
						resolve(get.call(this, context));
					})
						.then(value => {
							context.throwIfInterrupted();
							currentValue = value;
							this[prefixTrigger + key] = {};
						})
						.catch(errorHandler);
				};
			});
		},
	};

	return options;
}
