export default function(value) {
	if (value) {
		let type = typeof value;
		return type === 'object' || type === 'function';
	}
	return false;
}
