export default function(
	originalImage,
	originalImageWidth,
	originalImageHeight,
	bbb,
) {
	let reducedImageWidth = originalImageWidth / bbb;
	let reducedImageHeight = originalImageHeight / bbb;
	let reducedImage = new Uint8Array(reducedImageWidth * reducedImageHeight);
	for (let reducedPixelLeft = 0; reducedPixelLeft < reducedImageWidth; ++reducedPixelLeft) {
		for (let reducedPixelTop = 0; reducedPixelTop < reducedImageHeight; ++reducedPixelTop) {
			offsetPixelsLoop:
			for (let offsetPixelLeft = 0; offsetPixelLeft < bbb; ++offsetPixelLeft) {
				for (let offsetPixelTop = 0; offsetPixelTop < bbb; ++offsetPixelTop) {
					let originalPixelLeft = reducedPixelLeft * bbb + offsetPixelLeft;
					let originalPixelTop = reducedPixelTop * bbb + offsetPixelTop;
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