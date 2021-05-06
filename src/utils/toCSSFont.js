export default function(family, size, style, variant, weight) {
	let el = document.createElement('span');
	el.style.font = '1px serif';
	el.style.fontFamily = family;
	el.style.fontSize = `${size}px`;
	el.style.fontStyle = style;
	el.style.fontVariant = variant;
	el.style.fontWeight = weight;
	return el.style.font;
}
