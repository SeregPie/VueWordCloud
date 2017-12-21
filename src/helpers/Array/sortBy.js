export default function(array, iteratee) {
	return array
		.map(value => [iteratee(value), value])
		.sort(([value], [otherValue]) =>
			value > otherValue ? 1 : value < otherValue ? -1 : 0
		)
		.map(([, value]) => value);
}
