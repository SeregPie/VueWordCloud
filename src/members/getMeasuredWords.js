import Math_ceilPowerOfTwo from '../helpers/Math/ceilPowerOfTwo';

import getWordFontSizes from './getWordFontSizes';
import getWordElementMeasures from './getWordElementMeasures';
import getWordImage from './getWordImage';

export default function(words, fontSizePower, fontSizeRatio) {
	let wordFontSizes = getWordFontSizes(words, fontSizeRatio);
	return words.map(word => {
		let {
			key,
			text,
			rotation,
			fontFamily,
			fontStyle,
			fontVariant,
			fontWeight,
		} = word;
		let fontSize = Math.pow(fontSizePower - 1, 2) * wordFontSizes[key] + 1;
		let [
			textWidth,
			textHeight,
			rectWidth,
			rectHeight,
			safeRectWidth,
			safeRectHeight,
		] = getWordElementMeasures(
			text,
			fontStyle,
			fontVariant,
			fontWeight,
			fontSize,
			fontFamily,
			rotation,
		);
		let imageWidth = Math_ceilPowerOfTwo(safeRectWidth);
		let imageHeight = Math_ceilPowerOfTwo(safeRectHeight);
		let image = getWordImage(
			text,
			fontStyle,
			fontVariant,
			fontWeight,
			fontSize,
			fontFamily,
			imageWidth,
			imageHeight,
			rotation,
		);
		return Object.assign({
			fontSize,
			textWidth,
			textHeight,
			rectWidth,
			rectHeight,
			image,
			imageWidth,
			imageHeight,
		}, word);
	});
}