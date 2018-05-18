const tag = 'div';

export default function(createElement) {
	let {
		$scopedSlots,
		animationDuration,
		animationEasing,
		cloudWords,
		defaultScopedSlot,
		separateAnimationDelay,
		separateAnimationDuration,
		transitionHooks,
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
				'translate(-50%, -50%)',
				`rotate(${rotation}rad)`,
			].join(' '),
		};
		let mainElementStyle = {
			position: 'absolute',
			left: `${left}px`,
			top: `${top}px`,
		};
		if (animationDuration > 0) {
			let transition = [
				'all',
				`${separateAnimationDuration}ms`,
				animationEasing,
				`${separateAnimationDelay * index}ms`,
			].join(' ');
			originElementStyle.transition = transition;
			mainElementStyle.transition = transition;
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
			{
				props: {
					css: false,
				},
				on: transitionHooks,
			},
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
				transform: 'translate(-50%, -50%)',
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
