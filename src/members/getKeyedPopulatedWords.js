import Object_hasOwn from '../helpers/Object/hasOwn';
import Object_isObject from '../helpers/Object/isObject';
import String_isString from '../helpers/String/isString';

export default function(
	originalWords,
	getText,
	getWeight,
	getRotation,
	getFontFamily,
	getFontStyle,
	getFontVariant,
	getFontWeight,
	getColor,
) {
	let returns = {};
	originalWords.forEach(originalWord => {
		let text;
		let weight;
		let rotation;
		let fontFamily;
		let fontStyle;
		let fontVariant;
		let fontWeight;
		let color;
		if (originalWord) {
			if (String_isString(originalWord)) {
				text = originalWord;
			} else
			if (Array.isArray(originalWord)) {
				([
					text,
					weight,
				] = originalWord);
			} else
			if (Object_isObject(originalWord)) {
				({
					text,
					weight,
					rotation,
					fontFamily,
					fontStyle,
					fontVariant,
					fontWeight,
					color,
				} = originalWord);
			}
		}
		if (text === undefined) {
			text = getText(originalWord);
		}
		if (weight === undefined) {
			weight = getWeight(originalWord);
		}
		if (rotation === undefined) {
			rotation = getRotation(originalWord);
		}
		if (fontFamily === undefined) {
			fontFamily = getFontFamily(originalWord);
		}
		if (fontStyle === undefined) {
			fontStyle = getFontStyle(originalWord);
		}
		if (fontVariant === undefined) {
			fontVariant = getFontVariant(originalWord);
		}
		if (fontWeight === undefined) {
			fontWeight = getFontWeight(originalWord);
		}
		if (color === undefined) {
			color = getColor(originalWord);
		}
		let key = JSON.stringify([
			text,
			fontFamily,
			fontStyle,
			fontVariant,
			fontWeight,
		]);
		while (Object_hasOwn(returns, key)) {
			key += '!';
		}
		returns[key] = {
			originalWord,
			key,
			text,
			weight,
			rotation,
			fontFamily,
			fontStyle,
			fontVariant,
			fontWeight,
			color,
		};
	});
	return returns;
}
