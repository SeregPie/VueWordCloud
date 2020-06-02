export default function(n, a0, a1, b0, b1) {
	return b0 + (n - a0) * (b1 - b0) / (a1 - a0);
}
