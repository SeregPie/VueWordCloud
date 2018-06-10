export default function(callback, delay) {
	let run = function() {
		requestAnimationFrame(() => {
			if (callback() !== false) {
				setTimeout(run, delay);
			}
		});
	};
	run();
}
