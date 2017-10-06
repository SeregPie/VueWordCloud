export default function(array, iteratee) {
	let uniqueValues = new Set();
	return array.filter(value => {
		value = iteratee(value);
		if (uniqueValues.has(value)) {
			return false;
		}
		uniqueValues.add(value);
		return true;
	});
}