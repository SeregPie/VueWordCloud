import getBoundingBoxHeight from './getBoundingBoxHeight';
import getBoundingBoxWidth from './getBoundingBoxWidth';
import getFont from './getFont';
import getImageData from './getImageData';
import getTextWidth from './getTextWidth';

export default class {
	constructor(
		text,
		rotation,
		fontFamily,
		fontWeight,
		fontVariant,
		fontStyle,
		createCanvas,
	) {
		this.ǂtext = text;
		this.ǂrotation = rotation;
		this.ǂfontFamily = fontFamily;
		this.ǂfontWeight = fontWeight;
		this.ǂfontVariant = fontVariant;
		this.ǂfontStyle = fontStyle;
		this.ǂcreateCanvas = createCanvas;
		this.ǂ_fontSize = 1;
		this.ǂ_padding = 0;
		this.ǂrelativeLeft = 0;
		this.ǂrelativeTop = 0;
	}

	get ǂfontSize() {
		return this.ǂ_fontSize;
	}

	set ǂfontSize(value) {
		if (this.ǂ_fontSize !== value) {
			this.ǂ_fontSize = value;
			this.ǂ_imageData = undefined;
		}
	}

	get ǂfont() {
		return getFont(
			this.ǂfontStyle,
			this.ǂfontVariant,
			this.ǂfontWeight,
			this.ǂfontSize,
			this.ǂfontFamily,
		);
	}

	get ǂrelativeTextWidth() {
		if (this.ǂ_relativeTextWidth === undefined) {
			this.ǂ_relativeTextWidth = getTextWidth(
				this.ǂtext,
				getFont(
					this.ǂfontStyle,
					this.ǂfontVariant,
					this.ǂfontWeight,
					1,
					this.ǂfontFamily,
				),
				this.ǂcreateCanvas,
			);
		}
		return this.ǂ_relativeTextWidth;
	}

	get ǂtextWidth() {
		return this.ǂrelativeTextWidth * this.ǂfontSize;
	}

	get ǂleft() {
		return this.ǂrelativeLeft * this.ǂfontSize;
	}

	set ǂleft(value) {
		this.ǂrelativeLeft = value / this.ǂfontSize;
	}

	get ǂtop() {
		return this.ǂrelativeTop * this.ǂfontSize;
	}

	set ǂtop(value) {
		this.ǂrelativeTop = value / this.ǂfontSize;
	}

	get ǂboundingBoxWidth() {
		return getBoundingBoxWidth(
			this.ǂtextWidth,
			this.ǂfontSize,
			this.ǂrotation,
		);
	}

	get ǂboundingBoxHeight() {
		return getBoundingBoxHeight(
			this.ǂtextWidth,
			this.ǂfontSize,
			this.ǂrotation,
		);
	}

	get ǂboundingBoxLeft() {
		return this.ǂleft - this.ǂboundingBoxWidth / 2;
	}

	get ǂboundingBoxTop() {
		return this.ǂtop - this.ǂboundingBoxHeight / 2;
	}

	get ǂpadding() {
		return this.ǂ_padding;
	}

	set ǂpadding(value) {
		if (this.ǂ_padding !== value) {
			this.ǂ_padding = value;
			this.ǂ_imageData = undefined;
		}
	}

	get ǂimageData() {
		if (this.ǂ_imageData === undefined) {
			this.ǂ_imageData = getImageData(
				this.ǂtext,
				this.ǂfontStyle,
				this.ǂfontVariant,
				this.ǂfontWeight,
				this.ǂfontSize,
				this.ǂfontFamily,
				this.ǂpadding,
				this.ǂrotation,
				this.ǂcreateCanvas,
			);
		}
		return this.ǂ_imageData;
	}

	get ǂimagePixels() {
		return this.ǂimageData[0];
	}

	get ǂimageWidth() {
		return this.ǂimageData[1];
	}

	get ǂimageHeight() {
		return this.ǂimageData[2];
	}

	get ǂimageLeftShift() {
		return this.ǂimageData[3];
	}

	get ǂimageTopShift() {
		return this.ǂimageData[4];
	}

	get ǂimageLeft() {
		return Math.ceil(this.ǂleft) - this.ǂimageLeftShift;
	}

	set ǂimageLeft(value) {
		this.ǂleft = value + this.ǂimageLeftShift;
	}

	get ǂimageTop() {
		return Math.ceil(this.ǂtop) - this.ǂimageTopShift;
	}

	set ǂimageTop(value) {
		this.ǂtop = value + this.ǂimageTopShift;
	}
}
