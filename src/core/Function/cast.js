import Function_constant from './constant';
import Function_is from './is';

export default function(value) {
	return Function_is(value) ? value : Function_constant(value);
}
