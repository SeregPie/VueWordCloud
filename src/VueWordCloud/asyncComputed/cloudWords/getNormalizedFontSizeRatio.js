export default function(value) {
	value = Math.abs(value);
	return value > 1 ? 1 / value : value;
}
