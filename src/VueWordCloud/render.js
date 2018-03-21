const tag = 'div';

export default function(createElement) {
	let words = this.cloudWords;
	let animationDuration = this.animationDuration;
	let animationEasing = this.animationEasing;
	let scopedSlots = {
		default: ({text}) => text,
		...this.$scopedSlots,
	};

	let transitionDuration = (
		words.length > 0
			? animationDuration / Math.min(4, words.length)
			: 0
	);

	let transitionDelay = (
		words.length > 1
			? (animationDuration - transitionDuration) / (words.length - 1)
			: 0
	);

	return (
		createElement(
			tag,
			{
				style: {
					position: 'relative',
					width: '100%',
					height: '100%',
				},
			},
			[
				createElement(
					tag,
					{
						style: {
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						},
					},
					words.map(({
						word,
						key,
						text,
						weight,
						rotation,
						font,
						color,
						left,
						top,
					}, index) =>
						createElement(
							'transition',
							{
								props: {
									css: false,
								},
								on: {
									beforeEnter(el) {
										el.style.opacity = 0;
										el.style.transform = `rotate(${rotation}rad) scale3d(0.3, 0.3, 0.3)`;
									},
									enter(el, done) {
										setTimeout(() => {
											el.style.opacity = null;
											el.style.transform = `rotate(${rotation}rad)`;
										}, 1);
										setTimeout(done, animationDuration);
									},
									leave(el, done) {
										el.style.opacity = 0;
										el.style.transform += ' scale3d(0.3, 0.3, 0.3)';
										setTimeout(done, animationDuration);
									},
								},
							},
							[
								createElement(
									tag,
									{
										key,
										style: {
											position: 'absolute',
											left: `${left}px`,
											top: `${top}px`,
											transform: `rotate(${rotation}rad)`,
											color: color,
											font: font,
											transition: [
												'all',
												`${transitionDuration}ms`,
												animationEasing,
												`${transitionDelay * index}ms`,
											].join(' '),
										},
									},
									[
										createElement(
											tag,
											{
												style: {
													position: 'absolute',
													left: '50%',
													top: '50%',
													transform: 'translate(-50%, -50%)',
													whiteSpace: 'nowrap',
												},
											},
											[
												scopedSlots.default({
													word,
													text,
													weight,
													font,
													color,
													left,
													top,
												}),
											],
										),
									],
								),
							],
						)
					),
				),
			],
		)
	);
}
