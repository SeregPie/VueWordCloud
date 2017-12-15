import Promise_wrap from '../Promise/wrap';

export default function(font, text) {
	// needs ie11 polyfill
	return Promise_wrap(() => document.fonts.load(font, text));
}