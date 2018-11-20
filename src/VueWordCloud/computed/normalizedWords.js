import Object_isObject from '/utils/Object/isObject';
import String_isString from '/utils/String/isString';

export default function() {
	let {words} = this;
	return words.map(word => {
		let color;
		let fontFamily;
		let fontStyle;
		let fontVariant;
		let fontWeight;
		let rotation;
		let rotationUnit;
		let text;
		let weight;
		if (String_isString(word)) {
			text = word;
		} else
		if (Array.isArray(word)) {
			[
				text,
				weight,
			] = word;
		} else
		if (Object_isObject(word)) {
			({
				color,
				fontFamily,
				fontStyle,
				fontVariant,
				fontWeight,
				rotation,
				rotationUnit,
				text,
				weight,
			} = word);
		}
		return {
			color,
			fontFamily,
			fontStyle,
			fontVariant,
			fontWeight,
			rotation,
			rotationUnit,
			text,
			weight,
		};
	});
}
