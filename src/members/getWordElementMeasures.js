import D2_rotateRect from '../helpers/D2/rotateRect';
import Math_ceilPowerOfTwo from '../helpers/Math/ceilPowerOfTwo';
import Math_turnToRad from '../helpers/Math/turnToRad';

export default function(
	text,
	fontStyle,
	fontVariant,
	fontWeight,
	fontSize,
	fontFamily,
	rotation,
) {
	rotation = Math_turnToRad(rotation);
	let font = [fontStyle, fontVariant, fontWeight, `${fontSize}px`, fontFamily].join(' ');
	/*try {
		await document.fonts.load(font,  text);
	} catch (error) {
		// pass
	}*/
	let ctx = document.createElement('canvas').getContext('2d');
	ctx.font = font;
	let textWidth = ctx.measureText(text).width;
	let textHeight = fontSize;
	let [rectWidth, rectHeight] = D2_rotateRect(textWidth, textHeight, rotation);
	let textPadding = Math.max(ctx.measureText('m').width, fontSize);
	let paddingTextWidth = textWidth + 2 * textPadding;
	let paddingTextHeight = textHeight + 2 * textPadding;
	let [safeRectWidth, safeRectHeight] = D2_rotateRect(paddingTextWidth, paddingTextHeight, rotation);
	return [textWidth, textHeight, rectWidth, rectHeight, safeRectWidth, safeRectHeight];
}