import Function_recursive from './Function/recursive';

export default function(callback, delay) {
	Function_recursive(run => {
		requestAnimationFrame(() => {
			if (callback() !== false) {
				setTimeout(run, delay);
			}
		});
	})();
}
