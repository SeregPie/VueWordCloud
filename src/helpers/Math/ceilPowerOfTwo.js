import Math_log2 from './log2';

export default function(v) {
	return Math.pow(2, Math.ceil(Math_log2(v)));
}