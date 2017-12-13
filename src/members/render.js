export default function(
	createElement,
	scopedSlots,
	words,
	animationDuration,
) {
	return createElement(
		'div',
		{
			style: {
				position: 'relative',
				width: '100%',
				height: '100%',
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
		}) => {
			return createElement(
				'div',
				{
					key,
					style: {
						position: 'absolute',
						top: `${rectTop + rectHeight / 2}px`,
						left: `${rectLeft + rectWidth / 2}px`,
						transform: `rotate(${rotation}turn)`,
						color: color,
						transitionDuration: `${Math.round(animationDuration)}ms`,
						transitionProperty: 'all',
						font: [fontStyle, fontVariant, fontWeight, `${fontSize}px/1`, fontFamily].join(' '),
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
								transform: 'translate(-50%, -50%)',
								//width: `${textWidth}px`,
								//height: `${textHeight}px`,
								whiteSpace: 'nowrap',
							},
						},
						[
							scopedSlots.default({
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
							}),
						],
					),
				],
			);
		}),
	);
}