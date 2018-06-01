export default function() {
	let {animationDuration} = this;

	let beforeAppear = function(el) {
		el.style.opacity = 0;
		el.style.transform = 'scale3d(0.3,0.3,0.3)';
	};
	let appear = function(el, done) {
		setTimeout(() => {
			el.style.opacity = null;
			el.style.transform = null;
			setTimeout(done, animationDuration);
		}, 1);
	};
	let beforeEnter = beforeAppear;
	let enter = appear;
	let leave = function(el, done) {
		beforeAppear(el);
		setTimeout(done, animationDuration);
	};
	return {
		beforeAppear,
		appear,
		beforeEnter,
		enter,
		leave,
	};
}
