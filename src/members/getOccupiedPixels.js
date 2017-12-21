import findWordImagePositionBy from './findWordImagePositionBy';

export default function(image, imageWidth, imageHeight) {
	let returns = [];
	for (let pixelLeft = 0; pixelLeft < imageWidth; ++pixelLeft) {
		for (let pixelTop = 0; pixelTop < imageHeight; ++pixelTop) {
			if (image[imageWidth * pixelTop + pixelLeft]) {
				returns.push([pixelLeft, pixelTop]);
			}
		}
	}
	return returns;
}
