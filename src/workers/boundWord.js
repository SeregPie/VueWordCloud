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
	/*
	let gridWidth2 = Math_ceilToNearestPowerOfTwo(gridWidth);
	let gridHeight2 = Math_ceilToNearestPowerOfTwo(gridHeight);
	let gridData2 = new Uint8Array(gridWidth2 * gridHeight2);
	let gridDataLeft2 = Math.ceil(gridWidth2 / 2);
	let gridDataTop2 = Math.ceil(gridHeight2 / 2);
	let gridDataLevels = [];
	*/

	for (;;) {
		let {rectWidth, rectHeight, rectData} = await messages.dequeue();


		/*
		let rectWidth2 = Math_ceilToNearestPowerOfTwo(rectWidth);
		let rectHeight2 = Math_ceilToNearestPowerOfTwo(rectHeight);
		let rectData2 = convert(rectData);
		let occupiedRectPixelsLevels = [];
		let maxLevel = calculate(rectWidth2, rectHeight2);
		let rectWidthPowerOfTwo = Math_ceilToNearestPowerOfTwo(rectWidth);
		let rectHeightPowerOfTwo = Math_ceilToNearestPowerOfTwo(rectHeight);
		const pixelSize = Math.min(rectWidthPowerOfTwo, rectHeightPowerOfTwo) / 16 (8, 4, 2);
		let rectDataLevels = ?
		if (gridDataLevels === undefined) {
			gridDataLevels = ?
		}
		let occupiedRectPixelsLevels = ?

		*/

		let occupiedRectPixels = [];
		for (let left = 0; left < rectWidth; ++left) {
			for (let top = 0; top < rectHeight; ++top) {
				if (rectData[rectWidth * top + left]) {
					occupiedRectPixels.push([left, top]);
				}
			}
		}
		/*
		let level = occupiedRectPixelsLevels.length - 1;
		let occupiedRectPixels = occupiedRectPixelsLevels[level]
		let gridData = gridDataLevels[level];
		*/

		this.postMessage((() => {
			for (let [rectLeft, rectTop] of RectCenterOutIterator(gridWidth - rectWidth, gridHeight - rectHeight)) {
				if ((() => {
					/*
					for (let [left, top] of occupiedRectPixels) {
						left += rectLeft / Math.pow(2, level);
						top += rectTop / Math.pow(2, level);
						if (gridData[gridWidth * top + left]) {
							return false;
						}
					}
					*/
					for (let [left, top] of occupiedRectPixels) {
						left += rectLeft;
						top += rectTop;
						if (gridData[gridWidth * top + left]) {
							return false;
						}
					}
					/*
					occupiedRectPixelsLevels.forEach((occupiedRectPixels, level) => {
						let gridData = gridDataLevels[level];
						for (let [left, top] of occupiedRectPixels) {
							left += rectLeft / Math.pow(2, level);
							top += rectTop / Math.pow(2, level);
							gridData[gridWidth * top + left] = 1;
						}
					});
					*/
					for (let [left, top] of occupiedRectPixels) {
						left += rectLeft;
						top += rectTop;
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