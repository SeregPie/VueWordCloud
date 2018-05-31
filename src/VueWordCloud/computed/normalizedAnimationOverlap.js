export default function() {
	let {animationOverlap} = this;

	animationOverlap = Math.abs(animationOverlap);
	if (animationOverlap < 1) {
		animationOverlap = 1 / animationOverlap;
	}
	return animationOverlap;
}
