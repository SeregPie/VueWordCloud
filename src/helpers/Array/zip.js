export default function(array, ...otherArrays) {
	return array.map((value, index) => [value, ...otherArrays.map(otherArray => otherArray[index])]);
}