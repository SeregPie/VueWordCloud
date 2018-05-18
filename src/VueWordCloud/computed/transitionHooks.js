export default function() {
	let {animationDuration} = this;

	let beforeEnter = function(el) {
		el.style.opacity = 0;
		el.style.transform = 'scale3d(0.3, 0.3, 0.3)';
	};
	let enter = function(el, done) {
		setTimeout(() => {
			el.style.opacity = null;
			el.style.transform = null;
			setTimeout(done, animationDuration);
		}, 1);
	};
	let leave = function(el, done) {
		beforeEnter(el);
		setTimeout(done, animationDuration);
	};
	return {
		beforeEnter,
		enter,
		leave,
	};
}
