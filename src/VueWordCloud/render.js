import { h } from 'vue';

export default function() {
	let {
		$slots,
		animationEasing,
		animationOptions,
		cloudWords,
		separateAnimationDelay,
		separateAnimationDuration,
	} = this;
	$slots = {
		default({text}) {
			return text;
		},
		...$slots,
	};
	return h(
		'div',
		{
			style: {
				height: '100%',
				position: 'relative',
				width: '100%',
			},
		},
		[h(
			'div',
			{
				style: {
					bottom: '50%',
					position: 'absolute',
					right: '50%',
					transform: 'translate(50%,50%)',
				},
			},
			cloudWords.map(({
				color,
				font,
				left,
				rotation,
				text,
				top,
				weight,
				word,
			}, index) => h(
				'transition',
				{...animationOptions},
				[h(
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
					[h(
						'div',
						{
							style: {
								bottom: '50%',
								color: color,
								font: font,
								position: 'absolute',
								right: '50%',
								transform: [
									'translate(50%,50%)',
									`rotate(${rotation}rad)`,
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
						[$slots.default({
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
