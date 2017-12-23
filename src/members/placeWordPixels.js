export default function(
	cloudImage,
	cloudImageWidth,
	cloudImageHeight,
	wordImageLeft,
	wordImageTop,
	wordImage,
	wordImageWidth,
	wordImageHeight,
) {
	for (let wordPixelLeft = 0; wordPixelLeft < wordImageWidth; ++wordPixelLeft) {
		for (let wordPixelTop = 0; wordPixelTop < wordImageHeight; ++wordPixelTop) {
			let wordPixel = wordImage[wordImageWidth * wordPixelTop + wordPixelLeft];
			if (wordPixel) {
				let cloudPixelLeft = wordPixelLeft + wordImageLeft;
				if (cloudPixelLeft >= 0 && cloudPixelLeft < cloudImageWidth) {
					let cloudPixelTop = wordPixelTop + wordImageTop;
					if (cloudPixelTop >= 0 && cloudPixelTop < cloudImageHeight) {
						cloudImage[cloudImageWidth * cloudPixelTop + cloudPixelLeft] = wordPixel;
					}
				}
			}
		}
	}
}
