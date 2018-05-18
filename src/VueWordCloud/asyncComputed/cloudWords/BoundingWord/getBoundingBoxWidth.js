export default function(width, height, rotation) {
	return Math.ceil((width * Math.abs(Math.cos(rotation)) + height * Math.abs(Math.sin(rotation))));
}
