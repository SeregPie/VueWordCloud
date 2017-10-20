import Worker_getMessage from '../helpers/Worker/getMessage';
import Array_first from '../helpers/Array/first';
import Array_last from '../helpers/Array/last';
import Array_sortBy from '../helpers/Array/sortBy';
import Array_dropRightUntil from '../helpers/Array/dropRightUntil';
import Math_mapLinear from '../helpers/Math/mapLinear';
import Math_turnToRad from '../helpers/Math/turnToRad';
import Math_ceilToNearestPowerOfTwo from '../helpers/Math/ceilToNearestPowerOfTwo';
import D2_rectAfterRotation from '../helpers/D2/rectAfterRotation';

import boundWordWorkerContent from 'objectURL!../workers/boundWord.js';

export default async function(context) {

	let containerWidth = this.containerWidth;
	let containerHeight = this.containerHeight;
	let words = this.normalizedWords;
	let fontSizeRatio = this.fontSizeRatio;

	let boundedWords = [];

	if (words.length > 0 && containerWidth > 0 && containerHeight > 0) {

		await context.delayIfNotInterrupted();

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

		let boundWordWorker = new Worker(boundWordWorkerContent);
		try {

			let gridResolution = Math.pow(2, 22);
			let gridWidth = Math.floor(Math.sqrt(containerAspect * gridResolution));
			let gridHeight = Math.floor(gridResolution / gridWidth);
			//gridWidth = Math_ceilToNearestPowerOfTwo(gridWidth);
			//gridHeight = Math_ceilToNearestPowerOfTwo(gridHeight);

			boundWordWorker.postMessage({gridWidth, gridHeight});

			for (let word of words) {

				context.throwIfInterrupted();

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
					try {
						await document.fonts.load(font,  text);
					} catch (error) {
						// continue regardless of error
					}

					let ctx = document.createElement('canvas').getContext('2d');
					ctx.font = font;
					let textWidth = ctx.measureText(text).width;
					if (textWidth > 0) {

						let textHeight = fontSize;
						let outerTextPadding = Math.max(ctx.measureText('m').width, fontSize);
						let outerTextWidth = textWidth + 2 * outerTextPadding;
						let outerTextHeight = textHeight + 2 * outerTextPadding;
						let [rectWidth, rectHeight] = D2_rectAfterRotation(textWidth, textHeight, rotationRad);
						let [outerRectWidth, outerRectHeight] = D2_rectAfterRotation(outerTextWidth, outerTextHeight, rotationRad);
						//outerRectWidth = Math_ceilToNearestPowerOfTwo(outerRectWidth);
						//outerRectHeight = Math_ceilToNearestPowerOfTwo(outerRectHeight);
						let outerRectData = new Uint8Array(outerRectWidth * outerRectHeight);

						ctx.canvas.width = outerRectWidth;
						ctx.canvas.height = outerRectHeight;
						ctx.translate(outerRectWidth / 2, outerRectHeight / 2);
						ctx.rotate(rotationRad);
						ctx.font = font;
						ctx.textAlign = 'center';
						ctx.textBaseline = 'middle';
						ctx.fillText(text, 0, 0);
						let imageData = ctx.getImageData(0, 0, outerRectWidth, outerRectHeight).data;
						for (let i = 0, ii = outerRectData.length; i < ii; ++i) {
							outerRectData[i] = imageData[i * 4 + 3];
						}

						boundWordWorker.postMessage({
							rectWidth: outerRectWidth,
							rectHeight: outerRectHeight,
							rectData: outerRectData,
						});
						let {
							rectLeft: outerRectLeft,
							rectTop: outerRectTop,
						} = await Worker_getMessage(boundWordWorker);

						let rectLeft = outerRectLeft + (outerRectWidth - rectWidth) / 2;
						let rectTop = outerRectTop + (outerRectHeight - rectHeight) / 2;

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
							rectLeft,
							rectTop,
							rectWidth,
							rectHeight,
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
		} finally {
			boundWordWorker.terminate();
		}

		await context.delayIfNotInterrupted();
	}

	return boundedWords;
}