export default function(object, iteratee) {
	let returns = {};
	Object.entries(object).forEach(([key, value]) => {
		returns[key] = iteratee(value, key);
	});
	return returns;
}
