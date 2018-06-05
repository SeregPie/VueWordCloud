const tag = 'div';

export default function(createElement) {
	let {
		$scopedSlots,
		animationEasing,
		animationOptions,
		cloudWords,
		defaultScopedSlot,
		separateAnimationDelay,
		separateAnimationDuration,
	} = this;

	$scopedSlots = {
		default: defaultScopedSlot,
		...$scopedSlots,
	};

	let childElements = cloudWords.map(({
		word,
		key,
		text,
		weight,
		rotation,
		font,
		color,
		left,
		top,
	}, index) => {
		let slotElement = $scopedSlots.default({
			word,
			text,
			weight,
			font,
			color,
			left,
			top,
		});
		let originElementStyle = {
			position: 'absolute',
			left: '50%',
			top: '50%',
			color: color,
			font: font,
			whiteSpace: 'nowrap',
			transform: [
				'translate(-50%,-50%)',
				`rotate(${rotation}rad)`,
			].join(' '),
		};
		let mainElementStyle = {
			position: 'absolute',
			left: `${left}px`,
			top: `${top}px`,
		};
		if (separateAnimationDuration > 0) {
			let transitionStyle = {
				transitionProperty: 'all',
				transitionDuration: `${separateAnimationDuration}ms`,
				transitionTimingFunction: animationEasing,
				transitionDelay: `${separateAnimationDelay * index}ms`,
			};
			let animationStyle = {
				animationDuration: `${separateAnimationDuration}ms`,
				animationTimingFunction: animationEasing,
				animationDelay: `${separateAnimationDelay * index}ms`,
			};
			Object.assign(originElementStyle, transitionStyle);
			Object.assign(mainElementStyle, transitionStyle, animationStyle);
		}
		let originElement = createElement(
			tag,
			{
				style: originElementStyle,
			},
			[slotElement],
		);
		let mainElement = createElement(
			tag,
			{
				key,
				style: mainElementStyle,
			},
			[originElement],
		);
		let transitionElement = createElement(
			'transition',
			{...animationOptions},
			[mainElement],
		);
		return transitionElement;
	});
	let originElement = createElement(
		tag,
		{
			style: {
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%,-50%)',
			},
		},
		childElements,
	);
	let mainElement = createElement(
		tag,
		{
			style: {
				position: 'relative',
				width: '100%',
				height: '100%',
			},
		},
		[originElement],
	);
	return mainElement;
}
