export default function(createElement, scopedSlots, boundedWords, keyedPopulatedWords) {
	return createElement(
		'div',
		{
			style: {
				position: 'relative',
				width: '100%',
				height: '100%',
			},
		},
		boundedWords.map(({
			key,
			fontSize,
			textWidth,
			textHeight,
			rectLeft,
			rectTop,
			rectWidth,
			rectHeight,
		}) => {
			let {
				originalWord,
				text,
				weight,
				rotation,
				fontFamily,
				fontStyle,
				fontVariant,
				fontWeight,
				color,
			} = keyedPopulatedWords[key];
			return createElement(
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
			);
		}),
	);
}