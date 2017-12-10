import Object_isObject from '../Object/isObject';

let isEqual = function(value, otherValue) {
	if (value === otherValue) {
		return true;
	}
	if (Array.isArray(value)) {
		if (Array.isArray(otherValue)) {
			if (value.length === otherValue.length) {
				return value.every((value, index) => isEqual(value, otherValue[index]));
			}
		}
	} else
	if (Object_isObject(value)) {
		if (Object_isObject(otherValue)) {
			let valueEntries = Object.entries(value);
			if (valueEntries.length === Object.keys(otherValue).length) {
				return valueEntries.every(([key, value]) => isEqual(value, otherValue[key]));
			}
		}
	}
	return false;
};

export default isEqual;