export default function() {
	let keyCounters = {};
	return this.words.map(word => {
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
		let keyCounter = keyCounters[key] || 0;
		keyCounters[key] = keyCounter + 1;
		if (keyCounter > 0) {
			key += `-${keyCounter}`;
		}
		return {key, text, weight, rotation, fontFamily, fontStyle, fontVariant, fontWeight, color};
	});
}