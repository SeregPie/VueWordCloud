export default function(words) {
	return words.map(({
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