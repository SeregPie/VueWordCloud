import Function_constant2 from '../helpers/Function/constant2';
import Object_hasOwn from '../helpers/Object/hasOwn';
import Object_isObject from '../helpers/Object/isObject';
import String_isString from '../helpers/String/isString';

export default function(
	originalWords,
	defaultText,
	defaultWeight,
	defaultRotation,
	defaultFontFamily,
	defaultFontStyle,
	defaultFontVariant,
	defaultFontWeight,
	defaultColor,
) {
	defaultText = Function_constant2(defaultText);
	defaultWeight = Function_constant2(defaultWeight);
	defaultRotation = Function_constant2(defaultRotation);
	defaultFontFamily = Function_constant2(defaultFontFamily);
	defaultFontStyle = Function_constant2(defaultFontStyle);
	defaultFontVariant = Function_constant2(defaultFontVariant);
	defaultFontWeight = Function_constant2(defaultFontWeight);
	defaultColor = Function_constant2(defaultColor);
	let keyedPopulatedWords = {};
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
			text = defaultText(originalWord);
		}
		if (weight === undefined) {
			weight = defaultWeight(originalWord);
		}
		if (rotation === undefined) {
			rotation = defaultRotation(originalWord);
		}
		if (fontFamily === undefined) {
			fontFamily = defaultFontFamily(originalWord);
		}
		if (fontStyle === undefined) {
			fontStyle = defaultFontStyle(originalWord);
		}
		if (fontVariant === undefined) {
			fontVariant = defaultFontVariant(originalWord);
		}
		if (fontWeight === undefined) {
			fontWeight = defaultFontWeight(originalWord);
		}
		if (color === undefined) {
			color = defaultColor(originalWord);
		}
		let key = JSON.stringify([
			text,
			fontFamily,
			fontStyle,
			fontVariant,
			fontWeight,
		]);
		while (Object_hasOwn(keyedPopulatedWords, key)) {
			key += '!';
		}
		keyedPopulatedWords[key] = {
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
	return keyedPopulatedWords;
}
