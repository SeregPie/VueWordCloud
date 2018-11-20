export default function() {
	let {fontSizeRatio} = this;
	fontSizeRatio = Math.abs(fontSizeRatio);
	if (fontSizeRatio > 1) {
		fontSizeRatio = 1 / fontSizeRatio;
	}
	return fontSizeRatio;
}
