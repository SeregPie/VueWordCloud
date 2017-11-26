import findWordImagePositionBy from './findWordImagePositionBy';

export default function(
	[totalImage, totalImageWidth, totalImageHeight],
	[image, imageWidth, imageHeight],
) {
	let occupiedPixels = [];
	for (let pixelLeft = 0; pixelLeft < imageWidth; ++pixelLeft) {
		for (let pixelTop = 0; pixelTop < imageHeight; ++pixelTop) {
			let pixel = image[imageWidth * pixelTop + pixelLeft];
			if (pixel) {
				occupiedPixels.push([pixelLeft, pixelTop]);
			}
		}
	}
	return findWordImagePositionBy(totalImageWidth - imageWidth, totalImageHeight - imageHeight, ([imageLeft, imageTop]) => {
		for (let i = 0, ii = occupiedPixels.length; i < ii; ++i) {
			let [pixelLeft, pixelTop] = occupiedPixels[i];
			let totalPixelLeft = pixelLeft + imageLeft;
			let totalPixelTop = pixelTop + imageTop;
			let totalPixel = totalImage[totalImageWidth * totalPixelTop + totalPixelLeft];
			if (totalPixel) {
				return false;
			}
		}
		return true;
	});
}