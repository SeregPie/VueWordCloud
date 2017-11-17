import Array_dropRightUntil from '../helpers/Array/dropRightUntil';
import Array_first from '../helpers/Array/first';
import Array_last from '../helpers/Array/last';
import Array_sortBy from '../helpers/Array/sortBy';
import D2_rectAfterRotation from '../helpers/D2/rectAfterRotation';
import Math_ceilToNearestPowerOfTwo from '../helpers/Math/ceilToNearestPowerOfTwo';
import Math_mapLinear from '../helpers/Math/mapLinear';
import Math_turnToRad from '../helpers/Math/turnToRad';

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

export default function() {
	let containerWidth = this.containerWidth;
	let containerHeight = this.containerHeight;
	let words = this.normalizedWords;
	let fontSizeRatio = this.fontSizeRatio;

	let boundedWords = [];

	if (words.length > 0 && containerWidth > 0 && containerHeight > 0) {

		let containerAspect = containerWidth / containerHeight;

		words = Array_sortBy(words, ({weight}) => -weight);

		let minWeight = Array_last(words).weight;
		let maxWeight = Array_first(words).weight;

		let convertWeightToFontSize;
		if (minWeight < maxWeight && fontSizeRatio > 0 && fontSizeRatio < Infinity) {
			if (fontSizeRatio < 1) {
				fontSizeRatio = 1 / fontSizeRatio;
			}
			convertWeightToFontSize = function(weight) {
				return Math_mapLinear(weight, minWeight, maxWeight, 1, fontSizeRatio);
			};
		} else {
			words = Array_dropRightUntil(words, ({weight}) => weight > 0);
			if (words.length > 0) {
				minWeight = Array_last(words).weight;
			}
			convertWeightToFontSize = function(weight) {
				return weight / minWeight;
			};
		}

		let gridResolution = Math.pow(2, 22);
		let gridWidth = Math.floor(Math.sqrt(containerAspect * gridResolution));
		let gridHeight = Math.floor(gridResolution / gridWidth);
		//gridWidth = Math_ceilToNearestPowerOfTwo(gridWidth);
		//gridHeight = Math_ceilToNearestPowerOfTwo(gridHeight);

		let gridData = Array(gridWidth * gridHeight).fill(0);

		for (let i = 0, ii = words.length; i < ii; ++i) {
			let word = words[i];

			try {
				let {
					key,
					text,
					weight,
					rotation,
					fontFamily,
					fontStyle,
					fontVariant,
					fontWeight,
					color,
				} = word;

				let fontSize = 4 * convertWeightToFontSize(weight);
				let rotationRad = Math_turnToRad(rotation);

				let font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
				/*try {
					await document.fonts.load(font,  text);
				} catch (error) {
					// continue regardless of error
				}*/

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
					//rectWidth = Math_ceilToNearestPowerOfTwo(rectWidth);
					//rectHeight = Math_ceilToNearestPowerOfTwo(rectHeight);
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

					boundedWords.push({
						key,
						text,
						weight,
						rotation,
						fontFamily,
						fontSize,
						fontStyle,
						fontVariant,
						fontWeight,
						rectLeft: innerRectLeft,
						rectTop: innerRectTop,
						rectWidth: innerRectWidth,
						rectHeight: innerRectHeight,
						textWidth,
						textHeight,
						color,
					});
				}
			} catch (error) {
				// console.log(error);
				// continue regardless of error
			}
		}
	}

	return boundedWords;
}