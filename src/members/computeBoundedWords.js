import Worker_getMessage from '../helpers/Worker/getMessage';
import Math_turnToRad from '../helpers/Math/turnToRad';
import D2_rectAfterRotation from '../helpers/D2/rectAfterRotation';

import boundWordWorkerContent from 'objectURL!../workers/boundWord.js';

export default async function(context) {
	let containerWidth = this.containerWidth;
	let containerHeight = this.containerHeight;
	if (containerWidth <= 0 || containerHeight <= 0) {
		return [];
	}
	let containerAspect = containerWidth / containerHeight;
	let words = this.normalizedWords;

	await context.delayIfNotInterrupted();

	let boundedWords = [];
	let boundWordWorker = new Worker(boundWordWorkerContent);
	try {
		let gridResolution = Math.pow(2, 22);
		let gridWidth = Math.floor(Math.sqrt(containerAspect * gridResolution));
		let gridHeight = Math.floor(gridResolution / gridWidth);
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

				let fontSize = weight * 4;
				let rotationRad = Math_turnToRad(rotation);

				let font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
				try {
					await document.fonts.load(font,  text);
				} catch (error) {
					// continue regardless of error
				}

				let ctx = document.createElement('canvas').getContext('2d');
				ctx.font = font;
				let innerTextWidth = ctx.measureText(text).width;
				let innerTextHeight = fontSize;
				let outerTextPadding = Math.max(ctx.measureText('m').width, fontSize);
				let outerTextWidth = innerTextWidth + 2 * outerTextPadding;
				let outerTextHeight = innerTextHeight + 2 * outerTextPadding;
				let [innerRectWidth, innerRectHeight] = D2_rectAfterRotation(innerTextWidth, innerTextHeight, rotationRad);
				let [outerRectWidth, outerRectHeight] = D2_rectAfterRotation(outerTextWidth, outerTextHeight, rotationRad);
				let outerRectData = new Uint8Array(outerRectWidth * outerRectHeight);
				if (outerRectData.length > 0) {
					let ctx = document.createElement('canvas').getContext('2d');
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

				let innerRectLeft = outerRectLeft + (outerRectWidth - innerRectWidth) / 2;
				let innerRectTop = outerRectTop + (outerRectHeight - innerRectHeight) / 2;

				boundedWords.push({
					key,
					text,
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
					textWidth: innerTextWidth,
					textHeight: innerTextHeight,
					color,
				});
			} catch (error) {
				// console.log(error);
				// continue regardless of error
			}
		}
	} finally {
		boundWordWorker.terminate();
	}
	await context.delayIfNotInterrupted();
	return boundedWords;
}