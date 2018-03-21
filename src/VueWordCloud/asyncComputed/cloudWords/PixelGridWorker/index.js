import findPixel from './findPixel';

let construct = function(event) {
	self.removeEventListener('message', construct);

	let _aspect = event.data;
	let _pixels;
	let _minLeft;
	let _maxLeftWidth;
	let _minTop;
	let _maxTopHeight;

	let clear = function() {
		_pixels = {};
		_minLeft = 0;
		_maxLeftWidth = 0;
		_minTop = 0;
		_maxTopHeight = 0;
	};

	clear();

	let getLeft = function() {
		return Math.ceil((_minLeft + _maxLeftWidth) / 2);
	};

	let getTop = function() {
		return Math.ceil((_minTop + _maxTopHeight) / 2);
	};

	let getWidth = function() {
		return _maxLeftWidth - _minLeft;
	};

	let getHeight = function() {
		return _maxTopHeight - _minTop;
	};

	let getBounds = function() {
		return {
			left: getLeft(),
			top: getTop(),
			width: getWidth(),
			height: getHeight(),
		};
	};

	let put = function(pixels, pixelsLeft, pixelsTop) {
		pixels.forEach(([pixelLeft, pixelTop]) => {
			let left = pixelsLeft + pixelLeft;
			let top = pixelsTop + pixelTop;
			_pixels[`${left}|${top}`] = true;
			_minLeft = Math.min(left, _minLeft);
			_maxLeftWidth = Math.max(left + 1, _maxLeftWidth);
			_minTop = Math.min(top, _minTop);
			_maxTopHeight = Math.max(top + 1, _maxTopHeight);
		});
	};

	let canFit = function(pixels, pixelsLeft, pixelsTop) {
		return pixels.every(([pixelLeft, pixelTop]) => {
			let left = pixelsLeft + pixelLeft;
			let top = pixelsTop + pixelTop;
			return !_pixels[`${left}|${top}`];
		});
	};

	let findFit = function(pixels, pixelsLeft, pixelsTop) {
		return findPixel(_aspect, [pixelsLeft + getLeft(), pixelsTop + getTop()], ([pixelsLeft, pixelsTop]) => {
			return canFit(pixels, pixelsLeft, pixelsTop);
		});
	};

	self.postMessage({});
	self.addEventListener('message', function(event) {
		self.postMessage({
			getBounds,
			put,
			//canFit,
			findFit,
			clear,
		}[event.data.name].apply(null, event.data.args));
	});
};
self.addEventListener('message', construct);
