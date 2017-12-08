import findWordImagePositionBy from './findWordImagePositionBy';

export default function(image, imageWidth, imageHeight) {
	let returns = [];
	for (let pixelLeft = 0; pixelLeft < imageWidth; ++pixelLeft) {
		for (let pixelTop = 0; pixelTop < imageHeight; ++pixelTop) {
			let pixel = image[imageWidth * pixelTop + pixelLeft];
			if (pixel) {
				returns.push([pixelLeft, pixelTop]);
			}
		}
	}
	return returns;
}