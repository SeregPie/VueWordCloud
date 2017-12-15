import Math_ceilPowerOfTwo from '../helpers/Math/ceilPowerOfTwo';
import Promise_wrap from '../helpers/Promise/wrap';

import getWordFontSizes from './getWordFontSizes';
import getWordElementMeasures from './getWordElementMeasures';
import getWordImage from './getWordImage';

export default function(context, words, fontSizePower, fontSizeRatio) {
	return Promise_wrap(() => {
		let wordFontSizes = getWordFontSizes(words, fontSizeRatio);
		return Promise.all(words.map(word => {
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
			return getWordElementMeasures(
				text,
				fontStyle,
				fontVariant,
				fontWeight,
				fontSize,
				fontFamily,
				rotation,
			).then(([
				textWidth,
				textHeight,
				rectWidth,
				rectHeight,
				safeRectWidth,
				safeRectHeight,
			]) => {
				let imageWidth = Math.max(Math_ceilPowerOfTwo(safeRectWidth), Math.pow(fontSizePower, 2));
				let imageHeight = Math.max(Math_ceilPowerOfTwo(safeRectHeight), Math.pow(fontSizePower, 2));
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
		}));
	});
}