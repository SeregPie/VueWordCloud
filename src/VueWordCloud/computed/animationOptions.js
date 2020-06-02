import Function_stubNull from '../../core/Function/stubNull';
import Object_is from '../../core/Object/is';
import Object_mapValues from '../../core/Object/mapValues';
import String_is from '../../core/String/is';

export default function() {
	let {
		animationDuration,
		enterAnimation,
		leaveAnimation,
	} = this;
	if (Object_is(enterAnimation) && Object_is(leaveAnimation)) {
		let remainAnimation = Object_mapValues({
			...enterAnimation,
			...leaveAnimation,
		}, Function_stubNull);
		let beforeEnter = function(el) {
			Object.assign(el.style, enterAnimation);
		};
		let enter = function(el, done) {
			setTimeout(() => {
				Object.assign(el.style, remainAnimation);
				setTimeout(done, animationDuration);
			}, 1);
		};
		let leave = function(el, done) {
			Object.assign(el.style, leaveAnimation);
			setTimeout(done, animationDuration);
		};
		let beforeAppear = beforeEnter;
		let appear = enter;
		return {
			props: {
				css: false,
			},
			on: {
				beforeAppear,
				appear,
				beforeEnter,
				enter,
				leave,
			},
		};
	}
	if (String_is(enterAnimation) && String_is(leaveAnimation)) {
		return {
			props: {
				duration: animationDuration,
				appear: true,
				appearActiveClass: enterAnimation,
				enterActiveClass: enterAnimation,
				leaveActiveClass: leaveAnimation,
			},
		};
	}
	return {};
}
