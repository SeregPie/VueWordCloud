export default function(array, iteratee) {
	return array.slice().sort((value, otherValue) => {
		value = iteratee(value);
		otherValue = iteratee(otherValue);
		if (value < otherValue) {
			return -1;
		}
		if (value > otherValue) {
			return 1;
		}
		return 0;
	});
}