import Geometry_getRotatedRectangleBoundingBoxHeight from 'x/src/Geometry/getRotatedRectangleBoundingBoxHeight';
import Geometry_getRotatedRectangleBoundingBoxWidth from 'x/src/Geometry/getRotatedRectangleBoundingBoxWidth';

import getFont from './getFont';
import getTextWidth from './getTextWidth';
import getImageData from './getImageData';

export default class {
	constructor(
		text,
		rotation,
		fontFamily,
		fontStyle,
		fontVariant,
		fontWeight,
		createCanvas,
	) {
		this.ǂtext = text;
		this.ǂrotation = rotation;
		this.ǂfontFamily = fontFamily;
		this.ǂfontStyle = fontStyle;
		this.ǂfontVariant = fontVariant;
		this.ǂfontWeight = fontWeight;
		this.ǂcreateCanvas = createCanvas;
		this.ǂ_fontSize = 1;
		this.ǂ_relativePadding = 0;
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
				this.ǂfont,
				this.ǂcreateCanvas,
			) / this.ǂfontSize;
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

	get ǂrelativePadding() {
		return this.ǂ_relativePadding;
	}

	set ǂrelativePadding(value) {
		if (this.ǂ_relativePadding !== value) {
			this.ǂ_relativePadding = value;
			this.ǂ_imageData = undefined;
		}
	}

	get ǂpadding() {
		return this.ǂrelativePadding * this.ǂfontSize;
	}

	get ǂimageData() {
		if (this.ǂ_imageData === undefined) {
			this.ǂ_imageData = getImageData(
				this.ǂtext,
				this.ǂfont,
				this.ǂpadding * 2,
				this.ǂrotation,
				Geometry_getRotatedRectangleBoundingBoxWidth(
					this.ǂtextWidth + (this.ǂpadding + this.ǂfontSize) * 2,
					this.ǂfontSize + (this.ǂpadding + this.ǂfontSize) * 2,
					this.ǂrotation,
				),
				Geometry_getRotatedRectangleBoundingBoxHeight(
					this.ǂtextWidth + (this.ǂpadding + this.ǂfontSize) * 2,
					this.ǂfontSize + (this.ǂpadding + this.ǂfontSize) * 2,
					this.ǂrotation,
				),
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
