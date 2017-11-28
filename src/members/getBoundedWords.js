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

		let {
			key,
			text,
			rotation,
			fontFamily,
			fontStyle,
			fontVariant,
			fontWeight,
		} = words.shift();
		let fontSize = 4 * wordFontSizes[key];
		let rotationRad = Math_turnToRad(rotation);
		let ref = getWordCanvasMeasures(
			text,
			fontStyle,
			fontVariant,
			fontWeight,
			fontSize,
			fontFamily,
			rotationRad,
		);
		let [textWidth, textHeight] = ref[0];
		let [rectWidth, rectHeight] = ref[1];
		let [image, imageWidth, imageHeight] = ref[2];

		let totalImageResolution = Math.pow(2, 22);
		let totalImageWidth = Math.floor(Math.sqrt(containerAspect * totalImageResolution));
		let totalImageHeight = Math.floor(totalImageResolution / totalImageWidth);
		//totalImageWidth = Math_ceilPowerOfTwo(totalImageWidth);
		//totalImageHeight = Math_ceilPowerOfTwo(totalImageHeight);
		let totalImage = new Uint8Array(totalImageWidth * totalImageHeight);

		let imageLeft = Math.floor((totalImageWidth - imageWidth) / 2);
		let imageTop = Math.floor((totalImageHeight - imageHeight) / 2);
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
			let ref = getWordCanvasMeasures(
				text,
				fontStyle,
				fontVariant,
				fontWeight,
				fontSize,
				fontFamily,
				rotationRad,
			);
			let [textWidth, textHeight] = ref[0];
			let [rectWidth, rectHeight] = ref[1];
			let [image, imageWidth, imageHeight] = ref[2];

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
		});
	}
	return returns;
}