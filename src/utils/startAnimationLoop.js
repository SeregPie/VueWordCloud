export default function(callback, delay) {
	let run = (() => {
		requestAnimationFrame(() => {
			if (callback() !== false) {
				setTimeout(run, delay);
			}
		});
	});
	run();
}
