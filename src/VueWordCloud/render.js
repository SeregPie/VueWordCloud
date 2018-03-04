export default function(createElement) {
	let words = this.cloudWords;
	let animationDuration = this.animationDuration;
	let scopedSlots = Object.assign({
		default: ({text}) => text,
	}, this.$scopedSlots);

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
			'div',
			{
				style: {
					position: 'relative',
					width: '100%',
					height: '100%',
					overflow: 'hidden',
				},
			},
			[
				createElement(
					'div',
					{
						style: {
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%,-50%)',
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
							'div',
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
										'ease-in-out',
										`${transitionDelay * index}ms`,
									].join(' '),
								},
							},
							[
								createElement(
									'div',
									{
										style: {
											position: 'absolute',
											left: '50%',
											top: '50%',
											transform: 'translate(-50%,-50%)',
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
						)
					),
				),
			],
		)
	);
}
