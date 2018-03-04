export default function(text, font, createCanvas) {
	let canvas = createCanvas();
	let ctx = canvas.getContext('2d');
	ctx.font = font;
	return ctx.measureText(text).width;
}
