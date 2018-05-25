import Function_constant from './constant';
import Function_isFunction from './isFunction';

export default function(value) {
	return Function_isFunction(value) ? value : Function_constant(value);
}
