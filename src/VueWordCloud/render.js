export default function($createElement) {
	let {
		$scopedSlots,
		animationEasing,
		animationOptions,
		cloudWords,
		separateAnimationDelay,
		separateAnimationDuration,
	} = this;
	$scopedSlots = {
		default({text}) {
			return text;
		},
		...$scopedSlots,
	};
	return $createElement(
		'div',
		{
			style: {
				height: '100%',
				position: 'relative',
				width: '100%',
			},
		},
		[$createElement(
			'div',
			{
				style: {
					left: '50%',
					position: 'absolute',
					top: '50%',
					transform: 'translate(-50%,-50%)',
				},
			},
			cloudWords.map(({
				color,
				font,
				left,
				rotation,
				rotationUnit,
				text,
				top,
				weight,
				word,
			}, index) => $createElement(
				'transition',
				{...animationOptions},
				[$createElement(
					'div',
					{
						key: index,
						style: {
							left: `${left}px`,
							position: 'absolute',
							top: `${top}px`,
							...((separateAnimationDuration > 0)
								? {
									animation: [
										`${separateAnimationDuration}ms`,
										animationEasing,
										`${separateAnimationDelay * index}ms`,
									].join(' '),
									transition: [
										'all',
										`${separateAnimationDuration}ms`,
										animationEasing,
										`${separateAnimationDelay * index}ms`,
									].join(' '),
								}
								: {}
							),
						},
					},
					[$createElement(
						'div',
						{
							style: {
								color: color,
								font: font,
								left: '50%',
								position: 'absolute',
								top: '50%',
								transform: [
									'translate(-50%,-50%)',
									`rotate(${rotation}${rotationUnit})`,
								].join(' '),
								whiteSpace: 'nowrap',
								...((separateAnimationDuration > 0)
									? {
										transition: [
											'all',
											`${separateAnimationDuration}ms`,
											animationEasing,
											`${separateAnimationDelay * index}ms`,
										].join(' '),
									}
									: {}
								),
							},
						},
						[$scopedSlots.default({
							color,
							font,
							left,
							text,
							top,
							weight,
							word,
						})],
					)],
				)],
			)),
		)],
	);
}
