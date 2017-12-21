export default function(object, key) {
	return Object.prototype.hasOwnProperty.call(object, key);
}
