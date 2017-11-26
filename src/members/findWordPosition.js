export default function(rectWidth, rectHeight, iteratee) {

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
				let value = [left, startTop];
				if (iteratee(value)) {
					return value;
				}
			}
		} else
		if (startTop < endTop) {
			for (let top = startTop; top <= endTop; ++top) {
				let value = [startLeft, top];
				if (iteratee(value)) {
					return value;
				}
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
					let value = [currentEndLeft, top];
					if (iteratee(value)) {
						return value;
					}
				}
			}

			if (currentEndTop > previousEndTop) {
				for (let left = currentEndLeft; left > currentStartLeft; --left) {
					let value = [left, currentEndTop];
					if (iteratee(value)) {
						return value;
					}
				}
			}

			if (currentStartLeft < previousStartLeft) {
				for (let top = currentEndTop; top > currentStartTop; --top) {
					let value = [currentStartLeft, top];
					if (iteratee(value)) {
						return value;
					}
				}
			}

			if (currentStartTop < previousStartTop) {
				for (let left = currentStartLeft; left < currentEndLeft; ++left) {
					let value = [left, currentStartTop];
					if (iteratee(value)) {
						return value;
					}
				}
			}

			previousStartLeft = currentStartLeft;
			previousStartTop = currentStartTop;
			previousEndLeft = currentEndLeft;
			previousEndTop = currentEndTop;
		}
	}
}