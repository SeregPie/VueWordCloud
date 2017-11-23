import Object_isObject from '../Object/isObject';

let isEqual = function(something, otherSomething) {
	if (something === otherSomething) {
		return true;
	}
	if (Array.isArray(something)) {
		if (Array.isArray(otherSomething)) {
			if (something.length === otherSomething.length) {
				return something.every((something, index) => isEqual(something, otherSomething[index]));
			}
		}
	} else
	if (Object_isObject(something)) {
		if (Object_isObject(otherSomething)) {
			let somethingEntries = Object.entries(something);
			if (somethingEntries.length === Object.keys(otherSomething).length) {
				return somethingEntries.every(([key, something]) => isEqual(something, otherSomething[key]));
			}
		}
	}
	return false;
};

export default isEqual;