export default function(ms = 1) {
	return new Promise(resolve => setTimeout(resolve, ms));
}