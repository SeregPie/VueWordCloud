export default function(array, iteratee) {
	let i = array.length;
	while (i-- > 0) {
		if (iteratee(array[i], i)) {
			break;
		}
	}
	return array.slice(0, i + 1);
}