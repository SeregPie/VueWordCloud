import Object_mapValues from '../helpers/Object/mapValues';

export default function(words) {
	return Object_mapValues(words, ({
		key,
		text,
		weight,
		rotation,
		fontFamily,
		fontStyle,
		fontVariant,
		fontWeight,
	}) => ({
		key,
		text,
		weight,
		rotation,
		fontFamily,
		fontStyle,
		fontVariant,
		fontWeight,
	}));
}