//import Math_ceilToNearestPowerOfTwo from '../helpers/Math/ceilToNearestPowerOfTwo';
import RectCenterOutIterator from '../helpers/RectCenterOutIterator';
import AsyncQueue from '../helpers/AsyncQueue';

(async function() {
	let messages = new AsyncQueue();
	this.addEventListener('message', function({data}) {
		messages.enqueue(data);
	});

	let {gridWidth, gridHeight} = await messages.dequeue();
	let gridData = new Uint8Array(gridWidth * gridHeight);

	for (;;) {
		let {rectWidth, rectHeight, rectData} = await messages.dequeue();
		let occupiedRectPixels = [];
		for (let left = 0; left < rectWidth; ++left) {
			for (let top = 0; top < rectHeight; ++top) {
				if (rectData[rectWidth * top + left]) {
					occupiedRectPixels.push([left, top]);
				}
			}
		}
		this.postMessage((() => {
			for (let [rectLeft, rectTop] of RectCenterOutIterator(gridWidth - rectWidth, gridHeight - rectHeight)) {
				if ((() => {
					let occupiedGridPixels = [];
					for (let [left, top] of occupiedRectPixels) {
						left += rectLeft;
						top += rectTop;
						if (gridData[gridWidth * top + left]) {
							return false;
						}
						occupiedGridPixels.push([left, top]);
					}
					for (let [left, top] of occupiedGridPixels) {
						gridData[gridWidth * top + left] = 1;
					}
					return true;
				})()) {
					return {rectLeft, rectTop};
				}
			}
			throw new Error();
		})());
	}
}).call(self);