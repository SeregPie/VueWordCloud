export default function([aspectWidth, aspectHeight], [startLeft, startTop], iteratee) {
	let stepLeft, stepTop;
	if (aspectWidth > aspectHeight) {
		stepLeft = 1;
		stepTop = aspectHeight / aspectWidth;
	} else
	if (aspectHeight > aspectWidth) {
		stepTop = 1;
		stepLeft = aspectWidth / aspectHeight;
	} else {
		stepLeft = stepTop = 1;
	}

	let value = [startLeft, startTop];
	if (iteratee(value)) {
		return value;
	}

	let endLeft = startLeft;
	let endTop = startTop;

	let previousStartLeft = startLeft;
	let previousStartTop = startTop;
	let previousEndLeft = endLeft;
	let previousEndTop = endTop;

	for (;;) {

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
