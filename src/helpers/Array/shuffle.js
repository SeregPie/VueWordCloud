export default function(array) {
	for (let i = array.length; i > 0;) {
		let j = Math.floor(Math.random() * i);
		i--;
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}