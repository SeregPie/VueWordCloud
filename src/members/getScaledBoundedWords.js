import Array_min from '../helpers/Array/min';
import Array_max from '../helpers/Array/max';

export default function(words, containerWidth, containerHeight, maxFontSize) {
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

	return words.map(word => {
		let {
			fontSize,
			textWidth,
			textHeight,
			rectLeft,
			rectTop,
			rectWidth,
			rectHeight,
		} = word;

		fontSize *= scaleFactor;
		textWidth *= scaleFactor;
		textHeight *= scaleFactor;
		rectLeft = (rectLeft - (containedLeft + containedRight) / 2) * scaleFactor;
		rectTop = (rectTop - (containedTop + containedBottom) / 2) * scaleFactor;
		rectWidth *= scaleFactor;
		rectHeight *= scaleFactor;

		return Object.assign({}, word, {
			fontSize,
			textWidth,
			textHeight,
			rectLeft,
			rectTop,
			rectWidth,
			rectHeight,
		});
	});
}