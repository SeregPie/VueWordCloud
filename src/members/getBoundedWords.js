import Array_sortBy from '../helpers/Array/sortBy';
import Math_log2 from '../helpers/Math/log2';

import getWordImagePosition from './getWordImagePosition';
import getReducedWordImage from './getReducedWordImage';
import placeWordPixels from './placeWordPixels';

const totalImageResolution = Math.pow(2, 28);

const getBoundedWords = function(words, fontSizePower, containerWidth, containerHeight) {
	if (containerWidth > 0 && containerHeight > 0) {
		let containerAspect = containerWidth / containerHeight;
		let totalImageLayers = [];
		let totalImageWidth = Math.floor(Math.sqrt(containerAspect * totalImageResolution));
		let totalImageHeight = Math.floor(totalImageResolution / totalImageWidth);
		words = words.map(word => {
			let {imageWidth, imageHeight} = word;
			let imagePower = Math_log2(Math.min(imageWidth, imageHeight) / Math.pow(fontSizePower, 2));
			return [imagePower, word];
		});
		words = Array_sortBy(words, ([imagePower]) => -imagePower);
		words = words.map(([imagePower, {
			originalWord,
			key,
			text,
			weight,
			rotation,
			fontFamily,
			fontStyle,
			fontVariant,
			fontWeight,
			color,
			fontSize,
			textWidth,
			textHeight,
			rectWidth,
			rectHeight,
			image,
			imageWidth,
			imageHeight,
		}]) => {
			let imageLayers = [[image, imageWidth, imageHeight]];
			for (let i = 1; i < imagePower; ++i) {
				([image, imageWidth, imageHeight] = getReducedWordImage(image, imageWidth, imageHeight, 2));
				imageLayers.push([image, imageWidth, imageHeight]);
			}
			if (totalImageLayers.length < 1) {
				for (let i = 0; i < imageLayers.length; ++i) {
					let totalImage = new Uint8Array(totalImageWidth * totalImageHeight);
					totalImageLayers.push(totalImage);
				}
			}
			let totalImage = totalImageLayers[imageLayers.length - 1];
			let [imageLeft, imageTop] = getWordImagePosition(
				totalImage,
				totalImageWidth,
				totalImageHeight,
				image,
				imageWidth,
				imageHeight,
			);
			placeWordPixels(
				totalImage,
				totalImageWidth,
				totalImageHeight,
				imageLeft,
				imageTop,
				image,
				imageWidth,
				imageHeight,
			);
			for (let i = imageLayers.length - 1; i-- > 0;) {
				imageLeft = (imageLeft - totalImageWidth / 4) * 2;
				imageTop = (imageTop - totalImageHeight / 4) * 2;
				totalImage = totalImageLayers[i];
				[image, imageWidth, imageHeight] = imageLayers[i];
				placeWordPixels(
					totalImage,
					totalImageWidth,
					totalImageHeight,
					Math.floor(imageLeft),
					Math.floor(imageTop),
					image,
					imageWidth,
					imageHeight,
				);
			}
			let rectLeft = Math.floor(imageLeft + (imageWidth - rectWidth) / 2);
			let rectTop = Math.floor(imageTop + (imageHeight - rectHeight) / 2);
			return {
				originalWord,
				key,
				text,
				weight,
				rotation,
				fontFamily,
				fontStyle,
				fontVariant,
				fontWeight,
				color,
				fontSize,
				textWidth,
				textHeight,
				rectLeft,
				rectTop,
				rectWidth,
				rectHeight,
			};
		});
		return words;
	}
	return [];
};

self.addEventListener('message', ({data}) => {
	let {words, fontSizePower, containerWidth, containerHeight} = data;
	self.postMessage(getBoundedWords(words, fontSizePower, containerWidth, containerHeight));
});
