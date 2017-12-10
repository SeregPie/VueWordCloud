export default function(
	originalImage,
	originalImageWidth,
	originalImageHeight,
	pixelSize,
) {
	let reducedImageWidth = originalImageWidth / pixelSize;
	let reducedImageHeight = originalImageHeight / pixelSize;
	let reducedImage = new Uint8Array(reducedImageWidth * reducedImageHeight);
	for (let reducedPixelLeft = 0; reducedPixelLeft < reducedImageWidth; ++reducedPixelLeft) {
		for (let reducedPixelTop = 0; reducedPixelTop < reducedImageHeight; ++reducedPixelTop) {
			offsetPixelsLoop:
			for (let offsetPixelLeft = 0; offsetPixelLeft < pixelSize; ++offsetPixelLeft) {
				for (let offsetPixelTop = 0; offsetPixelTop < pixelSize; ++offsetPixelTop) {
					let originalPixelLeft = reducedPixelLeft * pixelSize + offsetPixelLeft;
					let originalPixelTop = reducedPixelTop * pixelSize + offsetPixelTop;
					let originalPixel = originalImage[originalImageWidth * originalPixelTop + originalPixelLeft];
					if (originalPixel) {
						reducedImage[reducedImageWidth * reducedPixelTop + reducedPixelLeft] = originalPixel;
						break offsetPixelsLoop;
					}
				}
			}
		}
	}
	return [reducedImage, reducedImageWidth, reducedImageHeight];
}