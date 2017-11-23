import Object_hasOwn from '../helpers/Object/hasOwn';
import Object_isObject from '../helpers/Object/isObject';
import String_isString from '../helpers/String/isString';

export default function(
	originalWords,
	computeText,
	computeWeight,
	computeRotation,
	computeFontFamily,
	computeFontStyle,
	computeFontVariant,
	computeFontWeight,
	computeColor,
) {
	let returns = {};
	originalWords.forEach(originalWord => {
		let key;
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
					key,
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
			text = computeText(originalWord);
		}
		if (weight === undefined) {
			weight = computeWeight(originalWord);
		}
		if (rotation === undefined) {
			rotation = computeRotation(originalWord);
		}
		if (fontFamily === undefined) {
			fontFamily = computeFontFamily(originalWord);
		}
		if (fontStyle === undefined) {
			fontStyle = computeFontStyle(originalWord);
		}
		if (fontVariant === undefined) {
			fontVariant = computeFontVariant(originalWord);
		}
		if (fontWeight === undefined) {
			fontWeight = computeFontWeight(originalWord);
		}
		if (color === undefined) {
			color = computeColor(originalWord);
		}
		if (key === undefined) {
			key = JSON.stringify([
				text,
				fontFamily,
				fontStyle,
				fontVariant,
				fontWeight,
			]);
		}
		while (Object_hasOwn(returns, key)) {
			key += '!';
		}
		returns[key] = {
			key,
			originalWord,
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