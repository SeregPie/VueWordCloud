import Array_min from '../helpers/Array/min';
import Array_max from '../helpers/Array/max';

export default function() {
	let words = this.boundedWords;
	let containerWidth = this.containerWidth;
	let containerHeight = this.containerHeight;
	let maxFontSize = this.maxFontSize;

	let containedLeft = Array_min(words, ({rectLeft}) => rectLeft);
	let containedRight = Array_max(words, ({rectLeft, rectWidth}) => rectLeft + rectWidth);
	let containedWidth = containedRight - containedLeft;

	let containedTop = Array_min(words, ({rectTop}) => rectTop);
	let containedBottom = Array_max(words, ({rectTop, rectHeight}) => rectTop + rectHeight);
	let containedHeight = containedBottom - containedTop;

	let scaleFactor = Math.min(containerWidth / containedWidth, containerHeight / containedHeight);

	let currentMaxFontSize = Array_max(words, ({fontSize}) => fontSize) * scaleFactor;
	if (currentMaxFontSize > maxFontSize) {
		scaleFactor *= maxFontSize / currentMaxFontSize;
	}

	return words.map(({key, text, weight, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight}) => {
		rectLeft = (rectLeft - (containedLeft + containedRight) / 2) * scaleFactor + containerWidth / 2;
		rectTop = (rectTop - (containedTop + containedBottom) / 2) * scaleFactor + containerHeight / 2;
		rectWidth *= scaleFactor;
		rectHeight *= scaleFactor;
		textWidth *= scaleFactor;
		textHeight *= scaleFactor;
		fontSize *= scaleFactor;
		return {key, text, weight, color, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight};
	});
}