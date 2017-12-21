export default function(array, iteratee) {
	if (array.length > 0) {
		if (iteratee) {
			array = array.map(iteratee);
		}
		return array.reduce((maxValue, currentValue) => Math.max(maxValue, currentValue));
	}
}
