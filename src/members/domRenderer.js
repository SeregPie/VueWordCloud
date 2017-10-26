export default function(createElement) {
	let words = [...this.scaledBoundedWords];
	let createWordElement = this.createWordElement;
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
			key,
			text,
			weight,
			color,
			fontFamily,
			fontSize,
			fontStyle,
			fontVariant,
			fontWeight,
			rotation,
			rectLeft,
			rectTop,
			rectWidth,
			rectHeight,
			textWidth,
			textHeight,
		}) =>
			createElement(
				'div',
				{
					key,
					style: {
						position: 'absolute',
						left: `${rectLeft + rectWidth / 2}px`,
						top: `${rectTop + rectHeight / 2}px`,
						transform: `rotate(${rotation}turn)`,
					},
				},
				[createElement(
					'div',
					{
						style: {
							position: 'absolute',
							left: '50%',
							top: '50%',
							//width: `${textWidth}px`,
							//height: `${textHeight}px`,
							color: color,
							font: [fontStyle, fontVariant, fontWeight, `${fontSize}px/1`, fontFamily].join(' '),
							whiteSpace: 'nowrap',
							transform: 'translate(-50%, -50%)',
						},
					},
					createWordElement({
						text,
						weight,
						color,
						fontFamily,
						fontSize,
						fontStyle,
						fontVariant,
						fontWeight,
						rotation,
					}),
				)],
			)
		),
	);
}