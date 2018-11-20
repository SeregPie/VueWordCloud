export default function(func) {
	let recur = function(...args) {
		return func.call(this, recur, ...args);
	};
	return recur;
}
