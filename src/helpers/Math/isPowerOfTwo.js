export default function(v) {
	return (v & (v - 1)) === 0 && v !== 0;
}