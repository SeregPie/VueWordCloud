import Math_ceilDivisible from '../../../../core/Math/ceilDivisible';

import getBoundingBoxHeight from './getBoundingBoxHeight';
import getBoundingBoxWidth from './getBoundingBoxWidth';
import getFont from './getFont';
import getTextWidth from './getTextWidth';

const pixelSize = 4;

export default function(
	text,
	fontStyle,
	fontVariant,
	fontWeight,
	fontSize,
	fontFamily,
	padding,
	rotation,
	createCanvas,
) {
	fontSize *= pixelSize;
	let font = getFont(
		fontStyle,
		fontVariant,
		fontWeight,
		fontSize,
		fontFamily,
	);
	let textWidth = getTextWidth(text, font, createCanvas);
	let textHeight = fontSize;
	let lineWidth = padding * fontSize * 2;
	let boxWidth = lineWidth + textWidth;
	let boxHeight = lineWidth + textHeight;
	let canvas = createCanvas();
	let ctx = canvas.getContext('2d');
	let canvasWidth = Math_ceilDivisible(getBoundingBoxWidth(
		boxWidth,
		boxHeight,
		rotation,
	), pixelSize);
	let canvasHeight = Math_ceilDivisible(getBoundingBoxHeight(
		boxWidth,
		boxHeight,
		rotation,
	), pixelSize);
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	ctx.translate(canvasWidth / 2, canvasHeight / 2);
	ctx.rotate(rotation);
	ctx.font = font;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, 0, 0);
	if (lineWidth > 0) {
		ctx.miterLimit = 1;
		ctx.lineWidth = lineWidth;
		ctx.strokeText(text, 0, 0);
	}
	let image = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
	let imagePixels = [];
	let minPixelLeft = Infinity;
	let maxPixelLeftWidth = 0;
	let minPixelTop = Infinity;
	let maxPixelTopHeight = 0;
	let pixelLeftWidth = canvasWidth / pixelSize;
	let pixelTopHeight = canvasHeight / pixelSize;
	for (let pixelLeft = 0; pixelLeft < pixelLeftWidth; ++pixelLeft) {
		for (let pixelTop = 0; pixelTop < pixelTopHeight; ++pixelTop) {
			offsetLoop:
			for (let offsetLeft = 0; offsetLeft < pixelSize; ++offsetLeft) {
				for (let offsetTop = 0; offsetTop < pixelSize; ++offsetTop) {
					let canvasLeft = pixelLeft * pixelSize + offsetLeft;
					let canvasTop = pixelTop * pixelSize + offsetTop;
					if (image[(canvasWidth * canvasTop + canvasLeft) * 4 + 3]) {
						imagePixels.push([pixelLeft, pixelTop]);
						minPixelLeft = Math.min(pixelLeft, minPixelLeft);
						maxPixelLeftWidth = Math.max(pixelLeft + 1, maxPixelLeftWidth);
						minPixelTop = Math.min(pixelTop, minPixelTop);
						maxPixelTopHeight = Math.max(pixelTop + 1, maxPixelTopHeight);
						break offsetLoop;
					}
				}
			}
		}
	}
	if (imagePixels.length > 0) {
		return [
			imagePixels.map(([pixelLeft, pixelTop]) => [pixelLeft - minPixelLeft, pixelTop - minPixelTop]),
			maxPixelLeftWidth - minPixelLeft,
			maxPixelTopHeight - minPixelTop,
			Math.ceil(pixelLeftWidth / 2) - minPixelLeft,
			Math.ceil(pixelTopHeight / 2) - minPixelTop,
		];
	}
	return [imagePixels, 0, 0, 0, 0];
}
