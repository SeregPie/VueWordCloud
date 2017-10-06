export default function(values, iteratee) {
	let returns = Infinity;
	for (let value of values) {
		returns = Math.min(iteratee(value), returns);
	}
	return returns;
}