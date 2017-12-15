export default function(
	createElement,
	scopedSlots,
	words,
	animationDuration,
) {
	let transitionDuration = words.length > 0
		? animationDuration / Math.min(4, words.length)
		: 0;
	let transitionDelay = words.length > 1
		? (animationDuration - transitionDuration) / (words.length - 1)
		: 0;
	return createElement(
		'div',
		{
			style: {
				position: 'relative',
				width: '100%',
				height: '100%',
				overflow: 'hidden',
			},
		},
		[createElement(
			'div',
			{
				style: {
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				},
			},
			words.map(({
				originalWord,
				key,
				text,
				weight,
				rotation,
				fontFamily,
				fontStyle,
				fontVariant,
				fontWeight,
				color,
				fontSize,
				textWidth,
				textHeight,
				rectLeft,
				rectTop,
				rectWidth,
				rectHeight,
			}, index) => createElement(
				'div',
				{
					key,
					style: {
						position: 'absolute',
						top: `${rectTop + rectHeight / 2}px`,
						left: `${rectLeft + rectWidth / 2}px`,
						transform: `rotate(${rotation}turn)`,
						color: color,
						transition: ['all', `${transitionDuration}ms`, 'ease-in-out', `${transitionDelay * index}ms`].join(' '),
						font: [fontStyle, fontVariant, fontWeight, `${fontSize}px/1`, fontFamily].join(' '),
					},
				},
				[createElement(
					'div',
					{
						style: {
							position: 'absolute',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
							//width: `${textWidth}px`,
							//height: `${textHeight}px`,
							whiteSpace: 'nowrap',
						},
					},
					[scopedSlots.default({
						originalWord,
						text,
						weight,
						rotation,
						fontFamily,
						fontStyle,
						fontVariant,
						fontWeight,
						color,
						fontSize,
					})],
				)],
			)),
		)],
	);

}