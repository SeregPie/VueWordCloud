import Function_cast from '/utils/Function/cast';
import Lang_isUndefined from '/utils/Lang/isUndefined';
import Object_mapValues from '/utils/Object/mapValues';

export default Object_mapValues({
	colorValues: 'color',
	fontFamilyValues: 'fontFamily',
	fontStyleValues: 'fontStyle',
	fontVariantValues: 'fontVariant',
	fontWeightValues: 'fontWeight',
	rotationUnitValues: 'rotationUnit',
	rotationValues: 'rotation',
	textValues: 'text',
	weightValues: 'weight',
}, key => function() {
	let {
		normalizedWords,
		words,
	} = this;
	let getDefaultValue = Function_cast(this[key]);
	return normalizedWords.map((normalizedWord, index) => {
		let value = normalizedWord[key];
		if (Lang_isUndefined(value)) {
			let word = words[index];
			value = getDefaultValue(word, index, words);
		}
		return value;
	});
});
