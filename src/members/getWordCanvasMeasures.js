import D2_rotateRect from '../helpers/D2/rotateRect';
//import Math_ceilPowerOfTwo from '../helpers/Math/ceilPowerOfTwo';

export default function(
	text,
	fontStyle,
	fontVariant,
	fontWeight,
	fontSize,
	fontFamily,
	rotation,
) {
	let font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
	/*try {
		await document.fonts.load(font,  text);
	} catch (error) {
		// continue regardless of error
	}*/
	let ctx = document.createElement('canvas').getContext('2d');
	ctx.font = font;
	let textWidth = ctx.measureText(text).width;
	if (textWidth > 0) {
		let textHeight = fontSize;
		let textPadding = Math.max(ctx.measureText('m').width, fontSize);
		let paddingTextWidth = textWidth + 2 * textPadding;
		let paddingTextHeight = textHeight + 2 * textPadding;
		let [rectWidth, rectHeight] = D2_rotateRect(textWidth, textHeight, rotation);
		let [imageWidth, imageHeight] = D2_rotateRect(paddingTextWidth, paddingTextHeight, rotation);
		//imageWidth = Math_ceilPowerOfTwo(imageWidth);
		//imageHeight = Math_ceilPowerOfTwo(imageHeight);
		ctx.canvas.width = imageWidth;
		ctx.canvas.height = imageHeight;
		ctx.translate(imageWidth / 2, imageHeight / 2);
		ctx.rotate(rotation);
		ctx.font = font;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(text, 0, 0);
		let image = new Uint8Array(imageWidth * imageHeight);
		let canvasImage = ctx.getImageData(0, 0, imageWidth, imageHeight).data;
		for (let i = 0, ii = image.length; i < ii; ++i) {
			image[i] = canvasImage[i * 4 + 3];
		}
		return [
			[textWidth, textHeight],
			[rectWidth, rectHeight],
			[image, imageWidth, imageHeight],
		];
	}
	return null;
}