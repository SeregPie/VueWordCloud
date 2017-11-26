import Array_sortBy from '../helpers/Array/sortBy';
import Math_turnToRad from '../helpers/Math/turnToRad';

import getWordFontSizes from './getWordFontSizes';
import getWordCanvasMeasures from './getWordCanvasMeasures';
import getWordImagePosition from './getWordImagePosition';
import placeWordPixels from './placeWordPixels';

export default function(words, containerWidth, containerHeight, fontSizeRatio) {
	let returns = [];
	if (words.length > 0 && containerWidth > 0 && containerHeight > 0) {
		let containerAspect = containerWidth / containerHeight;
		let wordFontSizes = getWordFontSizes(words, fontSizeRatio);
		words = Array_sortBy(words, ({key}) => -wordFontSizes[key]);
		let totalImageResolution = Math.pow(2, 22);
		let totalImageWidth = Math.floor(Math.sqrt(containerAspect * totalImageResolution));
		let totalImageHeight = Math.floor(totalImageResolution / totalImageWidth);
		//totalImageWidth = Math_ceilPowerOfTwo(totalImageWidth);
		//totalImageHeight = Math_ceilPowerOfTwo(totalImageHeight);
		let totalImage = new Uint8Array(totalImageWidth * totalImageHeight);
		words.forEach(({
			key,
			text,
			rotation,
			fontFamily,
			fontStyle,
			fontVariant,
			fontWeight,
		}) => {
			let fontSize = 4 * wordFontSizes[key];
			let rotationRad = Math_turnToRad(rotation);
			let [
				[textWidth, textHeight],
				[rectWidth, rectHeight],
				[image, imageWidth, imageHeight],
			] = getWordCanvasMeasures(
				text,
				fontStyle,
				fontVariant,
				fontWeight,
				fontSize,
				fontFamily,
				rotationRad,
			);
			try {
				let [imageLeft, imageTop] = getWordImagePosition(
					[totalImage, totalImageWidth, totalImageHeight],
					[image, imageWidth, imageHeight],
				);
				placeWordPixels(
					[totalImage, totalImageWidth, totalImageHeight],
					[image, imageLeft, imageTop, imageWidth, imageHeight],
				);
				let rectLeft = imageLeft + (imageWidth - rectWidth) / 2;
				let rectTop = imageTop + (imageHeight - rectHeight) / 2;
				returns.push({
					key,
					fontSize,
					textWidth,
					textHeight,
					rectLeft,
					rectTop,
					rectWidth,
					rectHeight,
				});
			} catch (error) {
				// console.log(error);
				// continue regardless of error
			}
		});
	}
	return returns;
}