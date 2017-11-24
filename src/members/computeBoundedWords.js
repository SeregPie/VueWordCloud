import Array_sortBy from '../helpers/Array/sortBy';
import D2_rectAfterRotation from '../helpers/D2/rectAfterRotation';
import Math_ceilPowerOfTwo from '../helpers/Math/ceilPowerOfTwo';
import Math_turnToRad from '../helpers/Math/turnToRad';

import computeWordFontSizes from './computeWordFontSizes';

let iterateRectCenterOut = function(rectWidth, rectHeight, iteratee) {
	if (rectWidth > 0 && rectHeight > 0) {

		let stepLeft, stepTop;
		if (rectWidth > rectHeight) {
			stepLeft = 1;
			stepTop = rectHeight / rectWidth;
		} else
		if (rectHeight > rectWidth) {
			stepTop = 1;
			stepLeft = rectWidth / rectHeight;
		} else {
			stepLeft = stepTop = 1;
		}

		let startLeft = Math.floor(rectWidth / 2);
		let startTop = Math.floor(rectHeight / 2);
		let endLeft = rectWidth - startLeft;
		let endTop = rectHeight - startTop;

		if (startLeft < endLeft) {
			for (let left = startLeft; left <= endLeft; ++left) {
				let t = [left, startTop];
				if (iteratee(t)) {
					return t;
				}
			}
		} else
		if (startTop < endTop) {
			for (let top = startTop; top <= endTop; ++top) {
				let t = [startLeft, top];
				if (iteratee(t)) {
					return t;
				}
			}
		}

		let previousStartLeft = startLeft;
		let previousStartTop = startTop;
		let previousEndLeft = endLeft;
		let previousEndTop = endTop;

		while (endLeft < rectWidth || endTop < rectHeight) {

			startLeft -= stepLeft;
			startTop -= stepTop;
			endLeft += stepLeft;
			endTop += stepTop;

			let currentStartLeft = Math.floor(startLeft);
			let currentStartTop = Math.floor(startTop);
			let currentEndLeft = Math.ceil(endLeft);
			let currentEndTop = Math.ceil(endTop);

			if (currentEndLeft > previousEndLeft) {
				for (let top = currentStartTop; top < currentEndTop; ++top) {
					let t = [currentEndLeft, top];
					if (iteratee(t)) {
						return t;
					}
				}
			}

			if (currentEndTop > previousEndTop) {
				for (let left = currentEndLeft; left > currentStartLeft; --left) {
					let t = [left, currentEndTop];
					if (iteratee(t)) {
						return t;
					}
				}
			}

			if (currentStartLeft < previousStartLeft) {
				for (let top = currentEndTop; top > currentStartTop; --top) {
					let t = [currentStartLeft, top];
					if (iteratee(t)) {
						return t;
					}
				}
			}

			if (currentStartTop < previousStartTop) {
				for (let left = currentStartLeft; left < currentEndLeft; ++left) {
					let t = [left, currentStartTop];
					if (iteratee(t)) {
						return t;
					}
				}
			}

			previousStartLeft = currentStartLeft;
			previousStartTop = currentStartTop;
			previousEndLeft = currentEndLeft;
			previousEndTop = currentEndTop;
		}
	}

	throw new Error();
};

export default function(words, containerWidth, containerHeight, fontSizeRatio) {
	let returns = [];
	if (words.length > 0 && containerWidth > 0 && containerHeight > 0) {
		let containerAspect = containerWidth / containerHeight;
		let wordFontSizes = computeWordFontSizes(words, fontSizeRatio);
		words = Array_sortBy(words, ({key}) => -wordFontSizes[key]);
		let gridResolution = Math.pow(2, 22);
		let gridWidth = Math.floor(Math.sqrt(containerAspect * gridResolution));
		let gridHeight = Math.floor(gridResolution / gridWidth);
		//gridWidth = Math_ceilPowerOfTwo(gridWidth);
		//gridHeight = Math_ceilPowerOfTwo(gridHeight);
		let gridData = Array(gridWidth * gridHeight).fill(0);
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
					let rectData = Array(rectWidth * rectHeight).fill(0);
					ctx.canvas.width = rectWidth;
					ctx.canvas.height = rectHeight;
					ctx.translate(rectWidth / 2, rectHeight / 2);
					ctx.rotate(rotationRad);
					ctx.font = font;
					ctx.textAlign = 'center';
					ctx.textBaseline = 'middle';
					ctx.fillText(text, 0, 0);
					let imageData = ctx.getImageData(0, 0, rectWidth, rectHeight).data;
					for (let i = 0, ii = rectData.length; i < ii; ++i) {
						rectData[i] = imageData[i * 4 + 3];
					}
					let occupiedRectPixels = [];
					for (let left = 0; left < rectWidth; ++left) {
						for (let top = 0; top < rectHeight; ++top) {
							if (rectData[rectWidth * top + left]) {
								occupiedRectPixels.push([left, top]);
							}
						}
					}
					let [rectLeft, rectTop] = iterateRectCenterOut(gridWidth - rectWidth, gridHeight - rectHeight, ([rectLeft, rectTop]) => {
						for (let i = 0, ii = occupiedRectPixels.length; i < ii; ++i) {
							let [left, top] = occupiedRectPixels[i];
							left += rectLeft;
							top += rectTop;
							if (gridData[gridWidth * top + left]) {
								return false;
							}
						}
						for (let i = 0, ii = occupiedRectPixels.length; i < ii; ++i) {
							let [left, top] = occupiedRectPixels[i];
							left += rectLeft;
							top += rectTop;
							gridData[gridWidth * top + left] = 1;
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