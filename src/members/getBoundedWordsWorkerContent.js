import Array_fill from '../helpers/Array/fill';
import Array_sortBy from '../helpers/Array/sortBy';
import Math_log2 from '../helpers/Math/log2';

import getWordImagePosition from './getWordImagePosition';
import getReducedWordImage from './getReducedWordImage';
import placeWordPixels from './placeWordPixels';

self.addEventListener('message', ({data}) => {
	let {words, containerAspect, aaaa} = data;
	words = words.map(word => {
		let {imageWidth, imageHeight} = word;
		let cccc = Math_log2(Math.min(imageWidth, imageHeight) / Math.pow(aaaa, 2)); //renameMe
		return Object.assign({cccc}, word);
	});
	words = Array_sortBy(words, ({cccc}) => -cccc);
	let totalImageLayers;
	words = words.map(({
		key,
		rectWidth,
		rectHeight,
		image,
		imageWidth,
		imageHeight,
		cccc,
	}) => {
		let imageLayers = [[image, imageWidth, imageHeight]];
		for (let i = 1; i < cccc; ++i) {
			([image, imageWidth, imageHeight] = getReducedWordImage(image, imageWidth, imageHeight, 2));
			imageLayers.push([image, imageWidth, imageHeight]);
		}
		if (totalImageLayers === undefined) {
			let resolution = Math.pow(2, 16); // fixMe (2^32 is max)
			let totalImageWidth = Math.floor(Math.sqrt(containerAspect * resolution));
			let totalImageHeight = Math.floor(resolution / totalImageWidth);
			let totalImage = Array_fill(new Array(totalImageWidth * totalImageHeight), 0);
			totalImageLayers = [[totalImage, totalImageWidth, totalImageHeight]];
			for (let i = 1; i < imageLayers.length; ++i) {
				totalImageWidth *= 2;
				totalImageHeight *= 2;
				totalImage = Array_fill(new Array(totalImageWidth * totalImageHeight), 0);
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
			key,
			rectLeft,
			rectTop,
		};
	});
	self.postMessage(words);
});