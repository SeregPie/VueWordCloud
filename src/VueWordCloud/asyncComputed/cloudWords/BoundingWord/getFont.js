export default function(fontStyle, fontVariant, fontWeight, fontSize, fontFamily) {
	return [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
}
