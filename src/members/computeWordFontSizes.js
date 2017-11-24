import Array_min from '../helpers/Array/min';
import Array_max from '../helpers/Array/max';
import Math_mapLinear from '../helpers/Math/mapLinear';

export default function(words, fontSizeRatio) {
	let returns = {};
	if (words.length > 0) {
		let minWeight = Array_min(words, ({weight}) => weight);
		let maxWeight = Array_max(words, ({weight}) => weight);
		if (minWeight < maxWeight && fontSizeRatio > 0 && fontSizeRatio < Infinity) {
			if (fontSizeRatio < 1) {
				fontSizeRatio = 1 / fontSizeRatio;
			}
			words.forEach(({key, weight}) => {
				returns[key] = Math_mapLinear(weight, minWeight, maxWeight, 1, fontSizeRatio);
			});
		} else
		if (minWeight > 0) {
			words.forEach(({key, weight}) => {
				returns[key] = weight / minWeight;
			});
		} else {
			let newMinWeight = 1;
			let newMaxWeight = newMinWeight + Math.abs(minWeight) + Math.abs(maxWeight);
			words.forEach(({key, weight}) => {
				returns[key] = Math_mapLinear(weight, minWeight, maxWeight, newMinWeight, newMaxWeight);
			});
		}
	}
	return returns;
}