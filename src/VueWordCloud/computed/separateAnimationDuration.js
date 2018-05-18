export default function() {
	let {
		animationDuration,
		cloudWords,
	} = this;

	return (
		cloudWords.length > 0
			? animationDuration / Math.min(4, cloudWords.length)
			: 0
	);
}
