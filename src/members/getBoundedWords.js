import Array_last from '../helpers/Array/last';
import Array_sortBy from '../helpers/Array/sortBy';
import Array_zip from '../helpers/Array/zip';
import Math_ceilPowerOfTwo from '../helpers/Math/ceilPowerOfTwo';

import getWordFontSizes from './getWordFontSizes';
import getWordElementMeasures from './getWordElementMeasures';
import getWordImage from './getWordImage';
import getWordImagePosition from './getWordImagePosition';
import getReducedWordImage from './getReducedWordImage';
import placeWordPixels from './placeWordPixels';

const pixelZoom = 4;
const pixelSize = Math.pow(2, pixelZoom);

export default function(words, containerWidth, containerHeight, fontSizeRatio) {
	let returns = [];
	if (containerWidth > 0 && containerHeight > 0) {
		if (words.length === 1) {
			let [{
				key,
				text,
				rotation,
				fontFamily,
				fontStyle,
				fontVariant,
				fontWeight,
			}] = words;
			let fontSize = pixelSize;//???

			let [
				textWidth,
				textHeight,
				rectWidth,
				rectHeight,
			] = getWordElementMeasures(
				text,
				fontStyle,
				fontVariant,
				fontWeight,
				fontSize,
				fontFamily,
				rotation,
			);

			let rectLeft = 0;
			let rectTop = 0;

			returns.push({
				key,
				fontSize,
				textWidth,
				textHeight,
				rectLeft,
				rectTop,
				rectWidth,
				rectHeight,
			});
		} else
		if (words.length > 1) {
			let containerAspect = containerWidth / containerHeight;
			let wordFontSizes = getWordFontSizes(words, fontSizeRatio);
			words = Array_sortBy(words, ({key}) => -wordFontSizes[key]);

			let {
				key,
				text,
				rotation,
				fontFamily,
				fontStyle,
				fontVariant,
				fontWeight,
			} = words.shift();
			let fontSize = wordFontSizes[key];

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
			let imageZoom = Math.log2(Math.max(Math.min(imageWidth, imageHeight), pixelSize) / pixelSize);
			let ccc = '???';
			let aaa = ccc - 1;
			let bbb = Math.pow(2, aaa);
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

			let lastTotalImageResolution = Math.pow(2, 8);
			let lastTotalImageWidth = Math.floor(Math.sqrt(containerAspect * totalImageResolution));
			let lastTotalImageHeight = Math.floor(totalImageResolution / totalImageWidth);
			let lastTotalImage = new Uint8Array(totalImageWidth * totalImageHeight);

			let totalImage = lastTotalImage;
			let totalImageWidth = lastTotalImageWidth;
			let totalImageHeight = lastTotalImageHeight;
			let totalImageLayers = [[totalImage, totalImageWidth, totalImageHeight]];
			for (let i = 1; i < ccc; ++i) {
				totalImageWidth *= 2;
				totalImageHeight *= 2;
				totalImage = new Uint8Array(totalImageWidth * totalImageHeight);
				totalImageLayers.unshift([totalImage, totalImageWidth, totalImageHeight]);
			}

			let rectLeft = (lastTotalImageWidth - rectWidth) / 2;
			let rectTop = (lastTotalImageHeight - rectHeight) / 2;

			returns.push({
				key,
				fontSize,
				textWidth,
				textHeight,
				rectLeft,
				rectTop,
				rectWidth,
				rectHeight,
			});

			words.forEach(({
				key,
				text,
				rotation,
				fontFamily,
				fontStyle,
				fontVariant,
				fontWeight,
			}) => {
				fontSize = wordFontSizes[key];

				([
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
				));

				imageWidth = Math_ceilPowerOfTwo(safeRectWidth);
				imageHeight = Math_ceilPowerOfTwo(safeRectHeight);
				ccc = '???';
				aaa = ccc - 1;
				bbb = Math.pow(2, aaa);
				image = getWordImage(
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

				totalImageLayers.splice(ccc);
				Array_zip(totalImageLayers, imageLayers).forEach(([totalImageLayer, imageLayer]) => {
					imageLeft *= 2;
					imageTop *= 2;
					if (!imageLayer) {
						imageLayer = getReducedWordImage(previousImageLayer, 1);
					}
					placeWordPixels(
						totalImageLayer,
						[imageLeft, imageTop],
						imageLayer,
					);
					previousImageLayer = imageLayer;
				});
				([lastTotalImage, lastTotalImageWidth, lastTotalImageHeight] = Array_last(totalImageLayers));


				lastImageLayer = getReducedWordImage(imageLayer, bbb);
				imageLayers = [imageLayer, ...[], lastImageLayer];

				([lastImageLeft, lastImageTop] = getWordImagePosition(lastTotalImageLayer, lastImageLayer));
				imageLeft = lastImageLeft * bbb;
				imageTop = lastImageTop * bbb;
				rectLeft = imageLeft + (imageWidth - rectWidth) / 2;
				rectTop = imageTop + (imageHeight - rectHeight) / 2;

				returns.push({
					key,
					fontSize,
					textWidth,
					textHeight,
					rectLeft,
					rectTop,
					rectWidth,
					rectHeight,
				});
			});
		}
	}
	return returns;
}