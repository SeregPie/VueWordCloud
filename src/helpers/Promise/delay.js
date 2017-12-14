export default function(ms = 0) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}