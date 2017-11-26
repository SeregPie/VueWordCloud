import Array_sortBy from '../helpers/Array/sortBy';
import D2_rectAfterRotation from '../helpers/D2/rectAfterRotation';
import Math_ceilPowerOfTwo from '../helpers/Math/ceilPowerOfTwo';
import Math_turnToRad from '../helpers/Math/turnToRad';

import computeWordFontSizes from './computeWordFontSizes';
import findWordPosition from './findWordPosition';

export default function(words, containerWidth, containerHeight, fontSizeRatio) {
	let returns = [];
	if (words.length > 0 && containerWidth > 0 && containerHeight > 0) {
		let containerAspect = containerWidth / containerHeight;
		let wordFontSizes = computeWordFontSizes(words, fontSizeRatio);
		words = Array_sortBy(words, ({key}) => -wordFontSizes[key]);
		let cloudResolution = Math.pow(2, 22);
		let cloudWidth = Math.floor(Math.sqrt(containerAspect * cloudResolution));
		let cloudHeight = Math.floor(cloudResolution / cloudWidth);
		//cloudWidth = Math_ceilPowerOfTwo(cloudWidth);
		//cloudHeight = Math_ceilPowerOfTwo(cloudHeight);
		let cloudImage = new Uint8Array(cloudWidth * cloudHeight);
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
			let font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
			/*try {
				await document.fonts.load(font,  text);
			} catch (error) {
				// continue regardless of error
			}*/
			try {
				let ctx = document.createElement('canvas').getContext('2d');
				ctx.font = font;
				let textWidth = ctx.measureText(text).width;
				if (textWidth > 0) {
					let textHeight = fontSize;
					let outerTextPadding = Math.max(ctx.measureText('m').width, fontSize);
					let outerTextWidth = textWidth + 2 * outerTextPadding;
					let outerTextHeight = textHeight + 2 * outerTextPadding;
					let [innerRectWidth, innerRectHeight] = D2_rectAfterRotation(textWidth, textHeight, rotationRad);
					let [rectWidth, rectHeight] = D2_rectAfterRotation(outerTextWidth, outerTextHeight, rotationRad);
					//rectWidth = Math_ceilPowerOfTwo(rectWidth);
					//rectHeight = Math_ceilPowerOfTwo(rectHeight);
					ctx.canvas.width = rectWidth;
					ctx.canvas.height = rectHeight;
					ctx.translate(rectWidth / 2, rectHeight / 2);
					ctx.rotate(rotationRad);
					ctx.font = font;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText(text, 0, 0);
					let image = new Uint8Array(rectWidth * rectHeight);
					let imageData = ctx.getImageData(0, 0, rectWidth, rectHeight).data;
					for (let i = 0, ii = image.length; i < ii; ++i) {
						image[i] = imageData[i * 4 + 3] ? 1 : 0;
					}
					let occupiedImagePixels = [];
					for (let left = 0; left < rectWidth; ++left) {
						for (let top = 0; top < rectHeight; ++top) {
							if (image[rectWidth * top + left]) {
								occupiedImagePixels.push([left, top]);
							}
						}
					}
					let [rectLeft, rectTop] = findWordPosition(cloudWidth - rectWidth, cloudHeight - rectHeight, ([rectLeft, rectTop]) => {
						for (let i = 0, ii = occupiedImagePixels.length; i < ii; ++i) {
							let [left, top] = occupiedImagePixels[i];
							left += rectLeft;
							top += rectTop;
							if (cloudImage[cloudWidth * top + left]) {
								return false;
							}
						}
						for (let i = 0, ii = occupiedImagePixels.length; i < ii; ++i) {
							let [left, top] = occupiedImagePixels[i];
							left += rectLeft;
							top += rectTop;
							cloudImage[cloudWidth * top + left] = 1;
						}
						return true;
					});
					let innerRectLeft = rectLeft + (rectWidth - innerRectWidth) / 2;
					let innerRectTop = rectTop + (rectHeight - innerRectHeight) / 2;
					returns.push({
						key,
						fontSize,
						textWidth,
						textHeight,
						rectLeft: innerRectLeft,
						rectTop: innerRectTop,
						rectWidth: innerRectWidth,
						rectHeight: innerRectHeight,
					});
				}
			} catch (error) {
				// console.log(error);
				// continue regardless of error
			}
		});
	}
	return returns;
}