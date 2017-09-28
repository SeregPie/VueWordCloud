let RectCenterOutIterator = function*(rectWidth, rectHeight) {

	if (rectWidth > 0 && rectHeight > 0) {

		let stepLeft, stepTop;
		if (rectWidth > rectHeight) {
			stepLeft = 1;
			stepTop = rectHeight / rectWidth;
		} else
		if (rectHeight > rectWidth) {
			stepTop = 1;
			stepLeft = rectWidth / rectHeight;
		} else {
			stepLeft = stepTop = 1;
		}

		let startLeft = Math.floor(rectWidth / 2);
		let startTop = Math.floor(rectHeight / 2);
		let endLeft = rectWidth - startLeft;
		let endTop = rectHeight - startTop;

		if (startLeft < endLeft) {
			for (let left = startLeft; left <= endLeft; ++left) {
				yield [left, startTop];
			}
		} else
		if (startTop < endTop) {
			for (let top = startTop; top <= endTop; ++top) {
				yield [startLeft, top];
			}
		}

		let previousStartLeft = startLeft;
		let previousStartTop = startTop;
		let previousEndLeft = endLeft;
		let previousEndTop = endTop;

		while (endLeft < rectWidth || endTop < rectHeight) {

			startLeft -= stepLeft;
			startTop -= stepTop;
			endLeft += stepLeft;
			endTop += stepTop;

			let currentStartLeft = Math.floor(startLeft);
			let currentStartTop = Math.floor(startTop);
			let currentEndLeft = Math.ceil(endLeft);
			let currentEndTop = Math.ceil(endTop);

			if (currentEndLeft > previousEndLeft) {
				for (let top = currentStartTop; top < currentEndTop; ++top) {
					yield [currentEndLeft, top];
				}
			}

			if (currentEndTop > previousEndTop) {
				for (let left = currentEndLeft; left > currentStartLeft; --left) {
					yield [left, currentEndTop];
				}
			}

			if (currentStartLeft < previousStartLeft) {
				for (let top = currentEndTop; top > currentStartTop; --top) {
					yield [currentStartLeft, top];
				}
			}

			if (currentStartTop < previousStartTop) {
				for (let left = currentStartLeft; left < currentEndLeft; ++left) {
					yield [left, currentStartTop];
				}
			}

			previousStartLeft = currentStartLeft;
			previousStartTop = currentStartTop;
			previousEndLeft = currentEndLeft;
			previousEndTop = currentEndTop;
		}
	}
};

let AsyncQueue = class {
	constructor() {
		this._values = [];
		/*
		this._promise = undefined;
		this._resolvePromise = undefined;
		*/
	}

	enqueue(value) {
		this._values.push(value);
		if (this._promise) {
			this._resolvePromise();
		}
	}

	async dequeue() {
		for (;;) {
			if (this._values.length) {
				return this._values.shift();
			}
			if (!this._promise) {
				this._promise = new Promise(resolve => {
					this._resolvePromise = resolve;
				});
			}
			await this._promise;
			this._promise = undefined;
		}
	}
};

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