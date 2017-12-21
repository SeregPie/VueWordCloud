export default function(width, height, iteratee) {

	if (width > 0 && height > 0) {

		let stepLeft, stepTop;
		if (width > height) {
			stepLeft = 1;
			stepTop = height / width;
		} else
		if (height > width) {
			stepTop = 1;
			stepLeft = width / height;
		} else {
			stepLeft = stepTop = 1;
		}

		let startLeft = Math.floor(width / 2);
		let startTop = Math.floor(height / 2);
		let endLeft = width - startLeft;
		let endTop = height - startTop;

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

		while (endLeft < width || endTop < height) {

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
