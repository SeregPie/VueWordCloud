import Array_first from '../helpers/Array/first';
import Array_last from '../helpers/Array/last';
import Math_mapLinear from '../helpers/Math/mapLinear';

export default function() {
	let keys = {};
	let words = this.words.map(word => {
		let text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color;
		if (word) {
			switch (typeof word) {
				case 'string': {
					text = word;
					break;
				}
				case 'object': {
					if (Array.isArray(word)) {
						([text, weight] = word);
					} else {
						({text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color} = word);
					}
					break;
				}
			}
		}
		if (text === undefined) {
			if (typeof this.text === 'function') {
				text = this.text(word);
			} else {
				text = this.text;
			}
		}
		if (weight === undefined) {
			if (typeof this.weight === 'function') {
				weight = this.weight(word);
			} else {
				weight = this.weight;
			}
		}
		if (rotation === undefined) {
			if (typeof this.rotation === 'function') {
				rotation = this.rotation(word);
			} else {
				rotation = this.rotation;
			}
		}
		if (fontFamily === undefined) {
			if (typeof this.fontFamily === 'function') {
				fontFamily = this.fontFamily(word);
			} else {
				fontFamily = this.fontFamily;
			}
		}
		if (fontStyle === undefined) {
			if (typeof this.fontStyle === 'function') {
				fontStyle = this.fontStyle(word);
			} else {
				fontStyle = this.fontStyle;
			}
		}
		if (fontVariant === undefined) {
			if (typeof this.fontVariant === 'function') {
				fontVariant = this.fontVariant(word);
			} else {
				fontVariant = this.fontVariant;
			}
		}
		if (fontWeight === undefined) {
			if (typeof this.fontWeight === 'function') {
				fontWeight = this.fontWeight(word);
			} else {
				fontWeight = this.fontWeight;
			}
		}
		if (color === undefined) {
			if (typeof this.color === 'function') {
				color = this.color(word);
			} else {
				color = this.color;
			}
		}
		let key = JSON.stringify([text, fontFamily, fontStyle, fontVariant, fontWeight]);
		let keyCount = keys[key] || 0;
		keys[key] = keyCount + 1;
		if (keyCount > 0) {
			key = JSON.stringify([text, fontFamily, fontStyle, fontVariant, fontWeight, keyCount]);
		}
		return {key, text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color};
	});

	words = words.filter(({text}) => text);
	words = words.filter(({weight}) => weight > 0);

	if (words.length > 0) {
		words.sort((word, otherWord) => otherWord.weight - word.weight);

		let minWeight = Array_last(words).weight;
		let maxWeight = Array_first(words).weight;

		let fontSizeRatio = this.fontSizeRatio;
		if (fontSizeRatio > 0 && fontSizeRatio < Infinity) {
			if (fontSizeRatio < 1) {
				fontSizeRatio = 1/fontSizeRatio;
			}
			for (let word of words) {
				word.weight = Math_mapLinear(word.weight, minWeight, maxWeight, 1, fontSizeRatio);
			}
		} else {
			for (let word of words) {
				word.weight /= minWeight;
			}
		}
	}

	return words;
}