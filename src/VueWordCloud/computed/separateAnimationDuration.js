export default function() {
	let {cloudWords} = this;
	if (cloudWords.length > 0) {
		let {
			animationDuration,
			normalizedAnimationOverlap: animationOverlap,
		} = this;
		return animationDuration / Math.min(animationOverlap, cloudWords.length);
	}
	return 0;
}
