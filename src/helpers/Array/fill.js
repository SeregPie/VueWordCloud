export default function(array, value) {
	for (let i = 0, ii = array.length; i < ii; ++i) {
		array[i] = value;
	}
	return array;
}