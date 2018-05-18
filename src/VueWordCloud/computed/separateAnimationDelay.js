export default function() {
	let {
		animationDuration,
		cloudWords,
		separateAnimationDuration,
	} = this;

	return (
		cloudWords.length > 1
			? (animationDuration - separateAnimationDuration) / (cloudWords.length - 1)
			: 0
	);
}
