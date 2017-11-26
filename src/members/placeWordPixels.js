export default function(
	[totalImage, totalImageWidth, totalImageHeight],
	[image, imageLeft, imageTop, imageWidth, imageHeight],
) {
	for (let pixelLeft = 0; pixelLeft < imageWidth; ++pixelLeft) {
		for (let pixelTop = 0; pixelTop < imageHeight; ++pixelTop) {
			let pixel = image[imageWidth * pixelTop + pixelLeft];
			if (pixel) {
				let totalPixelLeft = pixelLeft + imageLeft;
				let totalPixelTop = pixelTop + imageTop;
				totalImage[totalImageWidth * totalPixelTop + totalPixelLeft] = pixel;
			}
		}
	}
}