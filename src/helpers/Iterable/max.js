export default function(values, iteratee) {
	let returns = -Infinity;
	for (let value of values) {
		returns = Math.max(iteratee(value), returns);
	}
	return returns;
}