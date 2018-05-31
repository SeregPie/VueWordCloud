export default function() {
	let {
		animationDuration,
		normalizedAnimationOverlap: animationOverlap,
		cloudWords,
	} = this;

	return (
		cloudWords.length > 0
			? animationDuration / Math.min(animationOverlap, cloudWords.length)
			: 0
	);
}
