import Array_sortBy from '../helpers/Array/sortBy';
import Math_ceilPowerOfTwo from '../helpers/Math/ceilPowerOfTwo';
import Promise_delay from '../helpers/Promise/delay';

import getWordFontSizes from './getWordFontSizes';
import getWordElementMeasures from './getWordElementMeasures';
import getWordImage from './getWordImage';
import getWordImagePosition from './getWordImagePosition';
import getReducedWordImage from './getReducedWordImage';
import placeWordPixels from './placeWordPixels';

let aaaa = 4; // renameMe

export default function(keyedWords, containerWidth, containerHeight, fontSizeRatio) {
	let returns = [];
	if (containerWidth > 0 && containerHeight > 0) {
		let words = Object.values(keyedWords);
		if (words.length > 0) {
			let containerAspect = containerWidth / containerHeight;
			let wordFontSizes = getWordFontSizes(words, fontSizeRatio);
			return Promise
				.all(words.map(({
					key,
					text,
					rotation,
					fontFamily,
					fontStyle,
					fontVariant,
					fontWeight,
				}) =>
					Promise_delay(1)
						.then(() => {
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
							let cccc = Math.log2(Math.min(imageWidth, imageHeight) / Math.pow(aaaa, 2)); //renameMe
							return {
								key,
								fontSize,
								textWidth,
								textHeight,
								rectWidth,
								rectHeight,
								image,
								imageWidth,
								imageHeight,
								cccc,
							};
						})
				))
				.then(words => Array_sortBy(words, ({cccc}) => -cccc))
				.then(words => {
					let returns = [];
					let totalImageLayers;
					words.forEach(({
						key,
						fontSize,
						textWidth,
						textHeight,
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
						returns.push(Object.assign({
							fontSize,
							textWidth,
							textHeight,
							rectLeft,
							rectTop,
							rectWidth,
							rectHeight,
						}, keyedWords[key]));
					});
					return returns;
				});
		}
	}
	return [];
}