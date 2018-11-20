import Function_bindRecursive from './Function/bindRecursive';

export default function(callback, delay) {
	Function_bindRecursive(run => {
		requestAnimationFrame(() => {
			if (callback() !== false) {
				setTimeout(run, delay);
			}
		});
	})();
}
