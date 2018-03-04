export default function([width, height]) {
	if (width > height) {
		return [1, height / width];
	}
	if (height > width) {
		return [width / height, 1];
	}
	return [1, 1];
}
