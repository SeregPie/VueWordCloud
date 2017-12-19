import Array_sortBy from '../helpers/Array/sortBy';
import Math_log2 from '../helpers/Math/log2';

import getWordImagePosition from './getWordImagePosition';
import getReducedWordImage from './getReducedWordImage';
import placeWordPixels from './placeWordPixels';

const getBoundedWords = function(words, fontSizePower, containerWidth, containerHeight) {
	if (containerWidth > 0 && containerHeight > 0) {
		let containerAspect = containerWidth / containerHeight;
		let totalImageLayers;
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
			if (totalImageLayers === undefined) {
				let resolution = Math.pow(2, 16);
				let totalImageWidth = Math.floor(Math.sqrt(containerAspect * resolution));
				let totalImageHeight = Math.floor(resolution / totalImageWidth);
				let totalImage = new Uint8Array(totalImageWidth * totalImageHeight);
				totalImageLayers = [[totalImage, totalImageWidth, totalImageHeight]];
				for (let i = 1; i < imageLayers.length; ++i) {
					totalImageWidth *= 2;
					totalImageHeight *= 2;
					totalImage = new Uint8Array(totalImageWidth * totalImageHeight);
					totalImageLayers.unshift([totalImage, totalImageWidth, totalImageHeight]);
				}
			}
			let [totalImage, totalImageWidth, totalImageHeight] = totalImageLayers[imageLayers.length - 1];
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
				imageLeft *= 2;
				imageTop *= 2;
				[totalImage, totalImageWidth, totalImageHeight] = totalImageLayers[i];
				[image, imageWidth, imageHeight] = imageLayers[i];
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
			}
			let rectLeft = imageLeft + (imageWidth - rectWidth) / 2;
			let rectTop = imageTop + (imageHeight - rectHeight) / 2;
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