export default function*(rectWidth, rectHeight) {

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
}