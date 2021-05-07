export default function(n, inMin, inMax, outMin, outMax) {
	return outMin + (n - inMin) * (outMax - outMin) / (inMax - inMin);
}
