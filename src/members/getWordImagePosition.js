import findWordImagePositionBy from './findWordImagePositionBy';
import getOccupiedPixels from './getOccupiedPixels';

export default function(
	cloudImage,
	cloudImageWidth,
	cloudImageHeight,
	wordImage,
	wordImageWidth,
	wordImageHeight,
) {
	let occupiedWordPixels = getOccupiedPixels(wordImage, wordImageWidth, wordImageHeight);
	return findWordImagePositionBy(cloudImageWidth - wordImageWidth, cloudImageHeight - wordImageHeight, ([wordImageLeft, wordImageTop]) => {
		for (let i = 0, ii = occupiedWordPixels.length; i < ii; ++i) {
			let [wordPixelLeft, wordPixelTop] = occupiedWordPixels[i];
			let cloudPixelLeft = wordPixelLeft + wordImageLeft;
			let cloudPixelTop = wordPixelTop + wordImageTop;
			let cloudPixel = cloudImage[cloudImageWidth * cloudPixelTop + cloudPixelLeft];
			if (cloudPixel) {
				return false;
			}
		}
		return true;
	});
}