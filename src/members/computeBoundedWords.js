import Worker_getMessage from '../helpers/Worker/getMessage';
import Math_turnToRad from '../helpers/Math/turnToRad';

import boundWordWorkerContent from 'objectURL!../workers/boundWord.js';

let getTextRect = async function(text, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation) {
	rotation = Math_turnToRad(rotation);
	let font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
	try {
		await document.fonts.load(font,  text);
	} catch (error) {
		// continue regardless of error
	}
	let ctx = document.createElement('canvas').getContext('2d');
	ctx.font = font;
	let textWidth = ctx.measureText(text).width;
	let textHeight = fontSize;
	let rectWidth = Math.ceil((textWidth * Math.abs(Math.cos(rotation)) + textHeight * Math.abs(Math.sin(rotation))));
	let rectHeight = Math.ceil((textWidth * Math.abs(Math.sin(rotation)) + textHeight * Math.abs(Math.cos(rotation))));
	let rectData = new Uint8Array(rectWidth * rectHeight);
	if (rectData.length > 0) {
		let ctx = document.createElement('canvas').getContext('2d');
		ctx.canvas.width = rectWidth;
		ctx.canvas.height = rectHeight;
		ctx.translate(rectWidth / 2, rectHeight / 2);
		ctx.rotate(rotation);
		ctx.font = font;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(text, 0, 0);
		let imageData = ctx.getImageData(0, 0, rectWidth, rectHeight).data;
		for (let i = 0, ii = rectData.length; i < ii; ++i) {
			rectData[i] = imageData[i * 4 + 3];
		}
	}
	return {textWidth, textHeight, rectWidth, rectHeight, rectData};
};

export default async function(context) {
	let containerWidth = this.containerWidth;
	let containerHeight = this.containerHeight;
	if (containerWidth <= 0 || containerHeight <= 0) {
		return [];
	}
	let words = this.normalizedWords;
	await context.delayIfNotInterrupted();
	let containerAspect = containerWidth / containerHeight;
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
				let {text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color} = word;
				let fontSize = weight * 4;
				let {textWidth, textHeight, rectWidth, rectHeight, rectData} = await getTextRect(text, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rotation);
				boundWordWorker.postMessage({rectWidth, rectHeight, rectData});
				let {rectLeft, rectTop} = await Worker_getMessage(boundWordWorker);
				boundedWords.push({text, rotation, fontFamily, fontSize, fontStyle, fontVariant, fontWeight, rectLeft, rectTop, rectWidth, rectHeight, textWidth, textHeight, color});
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