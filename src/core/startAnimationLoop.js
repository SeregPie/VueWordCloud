import Function_prototype_bindRecursive from './Function/prototype/bindRecursive';

export default function(callback, delay) {
	Function_prototype_bindRecursive(recur => {
		requestAnimationFrame(() => {
			if (callback() !== false) {
				setTimeout(recur, delay);
			}
		});
	})();
}
