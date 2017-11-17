export default function(func) {
	let boundFunc = function(...args) {
		return func.call(this, boundFunc, ...args);
	};
	return boundFunc;
}