export default function() {
	let {cloudWords} = this;
	if (cloudWords.length > 1) {
		let {
			animationDuration,
			separateAnimationDuration,
		} = this;
		return (animationDuration - separateAnimationDuration) / (cloudWords.length - 1);
	}
	return 0;
}
