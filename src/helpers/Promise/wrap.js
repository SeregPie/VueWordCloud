export default function(func) {
	return new Promise(resolve => {
		resolve(func());
	});
}
