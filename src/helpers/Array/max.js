export default function(array, iteratee) {
	if (array.length > 0) {
		return array.map(iteratee).reduce((previousValue, currentValue) => Math.max(previousValue, currentValue));
	}
}