import {
	getCurrentInstance,
	onUnmounted,
} from 'vue';

export default function(fn, {
	immediate = false,
} = {}) {
	let stopped = false;
	let paused = false;
	let id;
	let loop0;
	let loop1;
	loop0 = (() => {
		try {
			fn();
		} finally {
			if (!paused) {
				loop1();
			}
		}
	});
	loop1 = (() => {
		id = requestAnimationFrame(loop0);
	});
	let start = immediate ? loop0 : loop1;
	let resume = (() => {
		if (!stopped) {
			if (paused) {
				paused = false;
				start();
			}
		}
	});
	let pause = (() => {
		if (!paused) {
			paused = true;
			cancelAnimationFrame(id);
		}
	});
	let stop = (() => {
		if (!stopped) {
			stopped = true;
			pause();
		}
	});
	if (getCurrentInstance()) {
		onUnmounted(stop);
	}
	start();
	return {
		pause,
		resume,
		stop,
	};
}
