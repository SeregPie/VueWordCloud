import Math_ceilPowerOfTwo from '../helpers/Math/ceilPowerOfTwo';
import Worker_getMessage from '../helpers/Worker/getMessage';

import getWordFontSizes from './getWordFontSizes';
import getWordElementMeasures from './getWordElementMeasures';
import getWordImage from './getWordImage';

import getBoundedWordsWorkerContent from 'objectURL!./getBoundedWordsWorkerContent.js';

let aaaa = 4; // renameMe

export default function(context, words, containerWidth, containerHeight, fontSizeRatio) {
	if (containerWidth > 0 && containerHeight > 0) {
		if (words.length > 0) {
			let containerAspect = containerWidth / containerHeight;
			let wordFontSizes = getWordFontSizes(words, fontSizeRatio);
			words = words.map(word => {
				let {
					key,
					text,
					rotation,
					fontFamily,
					fontStyle,
					fontVariant,
					fontWeight,
				} = word;
				let fontSize = Math.pow(aaaa - 1, 2) * wordFontSizes[key] + 1;
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
			let getBoundedWordsWorker = new Worker(getBoundedWordsWorkerContent);
			context.onInterrupt(() => {
				getBoundedWordsWorker.terminate();
			});
			getBoundedWordsWorker.postMessage({
				words: words.map(({
					key,
					rectWidth,
					rectHeight,
					image,
					imageWidth,
					imageHeight,
				}) => ({
					key,
					rectWidth,
					rectHeight,
					image,
					imageWidth,
					imageHeight,
				})),
				containerAspect,
				aaaa,
			});
			return Worker_getMessage(getBoundedWordsWorker)
				.then(value => {
					let keyedWords = {};
					words.forEach(word => {
						let {key} = word;
						keyedWords[key] = word;
					});
					value.forEach(value => {
						let {key} = value;
						Object.assign(keyedWords[key], value);
					});
					return words;
				})
				.finally(() => {
					getBoundedWordsWorker.terminate();
				});
		}
	}
	return [];
}